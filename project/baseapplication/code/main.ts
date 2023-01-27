console.log("MuzXbox v1.0.1");
class MuzXbox {
	uiStarted: boolean = false;
	audioContext: AudioContext;
	constructor() {
		this.initAfterLoad();
	}
	initAfterLoad() {
		console.log("MuzXbox loaded");
	}
	initFromUI() {
		if (this.uiStarted) {
			console.log("skip initFromUI");
		} else {
			console.log("start initFromUI");
			this.initAudioContext();
		}
	}
	initAudioContext() {
		let AudioContextFunc = (window as any).AudioContext || (window as any).webkitAudioContext;
		this.audioContext = new AudioContextFunc();
		console.log(this.audioContext);
		if (this.audioContext.state == "running") {
			this.uiStarted = true;
		}
	}
}
class SchedulePlayer implements MZXBX_Player {
	position: number = 0;
	audioContext: AudioContext;
	schedule: MZXBX_Schedule;
	performers: { plugin: MZXBX_AudioPerformerPlugin | null, id: string, kind: string }[];
	filters: { plugin: MZXBX_AudioFilterPlugin | null, id: string, kind: string }[];
	pluginsList: { url: string, name: string, kind: string }[];
	pluginURLs: { kind: string, url: string, functionName: string }[] = [
		{ kind: 'volume_filter_1_test', functionName: 'testPluginForVolume1', url: './plugins/filters/testvolume.js' }
		, { kind: 'compressor_filter_1_test', functionName: 'testPluginForCompressor1', url: './plugins/filters/testcompr.js' }
		, { kind: 'echo_filter_1_test', functionName: 'testPluginForEcho1', url: './plugins/filters/testecho.js' }
		, { kind: 'waf_ins_performer_1_test', functionName: 'testPluginForInstrum1', url: './plugins/performer/testins.js' }
		, { kind: 'waf_drums_performer_1_test', functionName: 'testPluginForDrum1', url: './plugins/performer/testperc.js' }
	];
	setup(context: AudioContext, schedule: MZXBX_Schedule): void {
		this.audioContext = context;
		this.schedule = schedule;
		this.startSetupPlugins();
	}
	startSetupPlugins() {
		this.performers = [];
		this.filters = [];
		for (let ff = 0; ff < this.schedule.filters.length; ff++) {
			let filter: MZXBX_ChannelFilter = this.schedule.filters[ff];
			this.сollectFilterPlugin(filter.id, filter.kind);
		}
		for (let ch = 0; ch < this.schedule.channels.length; ch++) {
			let performer: MZXBX_ChannelPerformer = this.schedule.channels[ch].performer;
			this.сollectPerformerPlugin(performer.id, performer.kind);
			for (let ff = 0; ff < this.schedule.channels[ch].filters.length; ff++) {
				let filter: MZXBX_ChannelFilter = this.schedule.channels[ch].filters[ff];
				this.сollectFilterPlugin(filter.id, filter.kind);
			}
		}
		this.startLoadCollectedPlugins();
	}
	сollectFilterPlugin(id: string, kind: string): void {
		for (let ii = 0; ii < this.filters.length; ii++) {
			if (this.filters[ii].id == id) {
				return;
			}
		}
		this.filters.push({ plugin: null, id: id, kind: kind });
	}
	сollectPerformerPlugin(id: string, kind: string): void {
		for (let ii = 0; ii < this.performers.length; ii++) {
			if (this.performers[ii].id == id) {
				return;
			}
		}
		this.performers.push({ plugin: null, id: id, kind: kind });
	}
	tryToCreateFilter(functionName: string): null | MZXBX_AudioFilterPlugin {
		if (window[functionName]) {
			let exe: () => MZXBX_AudioFilterPlugin = window[functionName];
			let plugin: MZXBX_AudioFilterPlugin = exe();
			return plugin;
		} else {
			return null;
		}
	}
	waitLoadFilter(functionName: string, filterItem: { plugin: MZXBX_AudioFilterPlugin | null, id: string, kind: string }) {
		let plugin: null | MZXBX_AudioFilterPlugin = this.tryToCreateFilter(functionName);
		if (plugin) {
			this.setItemFilterPluginAndNext(plugin, filterItem);
		} else {

		}
	}
	setItemFilterPluginAndNext(plugin: MZXBX_AudioFilterPlugin, filterItem: { plugin: MZXBX_AudioFilterPlugin | null, id: string, kind: string }) {
		filterItem.plugin = plugin;
		this.startLoadCollectedPlugins();
	}
	startLoadFilter(filterItem: { plugin: MZXBX_AudioFilterPlugin | null, id: string, kind: string }) {
		for (let ll = 0; ll < this.pluginURLs.length; ll++) {
			if (this.pluginURLs[ll].kind == filterItem.kind) {
				let plugin: null | MZXBX_AudioFilterPlugin = this.tryToCreateFilter(this.pluginURLs[ll].functionName);
				if (plugin) {
					this.setItemFilterPluginAndNext(plugin, filterItem);
				} else {
					var rr: HTMLScriptElement = document.createElement('script');
					rr.setAttribute("type", "text/javascript");
					rr.setAttribute("src", this.pluginURLs[ll].url);
					document.getElementsByTagName("head")[0].appendChild(rr);
					this.waitLoadFilter(this.pluginURLs[ll].functionName, filterItem);
					return;
				}
			}
		}
	}
	startLoadCollectedPlugins() {
		for (let ff = 0; ff < this.filters.length; ff++) {
			if (this.filters[ff].plugin) {
				//
			} else {
				this.startLoadFilter(this.filters[ff]);
			}
		}
	}
	start(from: number, position: number, to: number): boolean {
		return false;
	}
	cancel(): void {

	}

}
