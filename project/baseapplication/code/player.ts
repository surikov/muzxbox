declare let pluginListKindUrlName: { kind: string, url: string, functionName: string }[];

function waitLoadCheckNext(sleepMs: number, url: string, variableName: string, onFinish: () => void): void {
	if (window[variableName]) {
		onFinish();
	} else {
		if (!scriptExistsInDocument(url)) {
			appendScriptURL(url);
		}
		setTimeout(() => {
			waitLoadCheckNext(sleepMs, url, variableName, onFinish);
		}, sleepMs);
	}
}
function appendScriptURL(url: string): boolean {
	var scriptElement: HTMLScriptElement = document.createElement('script');
	scriptElement.setAttribute("type", "text/javascript");
	scriptElement.setAttribute("src", url);
	(scriptElement as any).lockedLoaderURL = url;
	let head: HTMLHeadElement = document.getElementsByTagName("head")[0];
	head.appendChild(scriptElement);
	return false;
}
function scriptExistsInDocument(url: string): boolean {
	let scripts: HTMLCollectionOf<HTMLScriptElement> = document.getElementsByTagName("script");
	for (let ii = 0; ii < scripts.length; ii++) {
		let script: HTMLScriptElement | null = scripts.item(ii);
		if (script) {
			if (url == (script as any).lockedLoaderURL) {
				return true;
			}
		}
	}
	return false;
}

class SchedulePlayer implements MZXBX_Player {
	position: number = 0;
	audioContext: AudioContext;
	schedule: MZXBX_Schedule | null = null;
	performers: { plugin: MZXBX_AudioPerformerPlugin | null, id: string, kind: string }[] = [];
	filters: { plugin: MZXBX_AudioFilterPlugin | null, id: string, kind: string }[] = [];
	pluginsList: { url: string, name: string, kind: string }[];
	/*pluginURLs: { kind: string, url: string, functionName: string }[] = [
		{ kind: 'volume_filter_1_test', functionName: 'testPluginForVolume1', url: './plugins/filters/testvolume.js' }
		, { kind: 'compressor_filter_1_test', functionName: 'testPluginForCompressor1', url: './plugins/filters/testcompr.js' }
		, { kind: 'echo_filter_1_test', functionName: 'testPluginForEcho1', url: './plugins/filters/testecho.js' }
		, { kind: 'waf_ins_performer_1_test', functionName: 'testPluginForInstrum1', url: './plugins/performer/testins.js' }
		, { kind: 'waf_drums_performer_1_test', functionName: 'testPluginForDrum1', url: './plugins/performer/testperc.js' }
	];*/
	setup(context: AudioContext, schedule: MZXBX_Schedule): void {
		this.audioContext = context;
		this.schedule = schedule;
		this.startSetupPlugins();
	}
	startSetupPlugins() {
		if (this.schedule) {
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
	findPluginInfo(kind: string): { kind: string, url: string, functionName: string } | null {
		for (let ll = 0; ll < pluginListKindUrlName.length; ll++) {
			if (pluginListKindUrlName[ll].kind == kind) {
				return pluginListKindUrlName[ll];
			}
		}
		console.log('startLoadFilter', kind);
		return null;
	}
	startLoadFilter(filterItem: { plugin: MZXBX_AudioFilterPlugin | null, id: string, kind: string }) {
		console.log('startLoadFilter', filterItem);
		let pluginInfo = this.findPluginInfo(filterItem.kind);
		if (pluginInfo) {
			waitLoadCheckNext(250, pluginInfo.url, pluginInfo.functionName, () => {
				if (pluginInfo) {
					let exe: () => MZXBX_AudioFilterPlugin = window[pluginInfo.functionName];
					let plugin: MZXBX_AudioFilterPlugin = exe();
					if (plugin) {
						filterItem.plugin = plugin;
						this.startLoadCollectedPlugins();
					}
				}
			});
		}
	}
	startLoadPerformer(performerItem: { plugin: MZXBX_AudioPerformerPlugin | null, id: string, kind: string }) {
		console.log('startLoadPerformer', performerItem);
		let pluginInfo = this.findPluginInfo(performerItem.kind);
		if (pluginInfo) {
			waitLoadCheckNext(250, pluginInfo.url, pluginInfo.functionName, () => {
				if (pluginInfo) {
					let exe: () => MZXBX_AudioPerformerPlugin = window[pluginInfo.functionName];
					let plugin: MZXBX_AudioPerformerPlugin = exe();
					if (plugin) {
						performerItem.plugin = plugin;
						this.startLoadCollectedPlugins();
					}
				}
			});
		}
	}
	startLoadCollectedPlugins() {
		for (let ff = 0; ff < this.filters.length; ff++) {
			if (!(this.filters[ff].plugin)) {
				this.startLoadFilter(this.filters[ff]);
				return;
			}
		}
		for (let pp = 0; pp < this.performers.length; pp++) {
			if (!(this.performers[pp].plugin)) {
				this.startLoadPerformer(this.performers[pp]);
				return;
			}
		}
	}
	start(from: number, position: number, to: number): boolean {
		return false;
	}
	cancel(): void {

	}

}