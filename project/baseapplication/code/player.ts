declare let pluginListKindUrlName: { kind: string, url: string, functionName: string }[];

function waitForCondition(sleepMs: number, isDone: () => boolean, onFinish: () => void): void {
	if (isDone()) {
		onFinish();
	} else {
		setTimeout(() => {
			waitForCondition(sleepMs, isDone, onFinish);
		}, sleepMs);
	}
}
function appendScriptURL(url: string): void {
	let scripts: HTMLCollectionOf<HTMLScriptElement> = document.getElementsByTagName("script");
	for (let ii = 0; ii < scripts.length; ii++) {
		let script: HTMLScriptElement | null = scripts.item(ii);
		if (script) {
			if (url == (script as any).lockedLoaderURL) {
				return;
			}
		}
	}
	var scriptElement: HTMLScriptElement = document.createElement('script');
	scriptElement.setAttribute("type", "text/javascript");
	scriptElement.setAttribute("src", url);
	(scriptElement as any).lockedLoaderURL = url;
	let head: HTMLHeadElement = document.getElementsByTagName("head")[0];
	head.appendChild(scriptElement);
}
class SchedulePlayer implements MZXBX_Player {
	position: number = 0;
	audioContext: AudioContext;
	schedule: MZXBX_Schedule | null = null;
	performers: { plugin: MZXBX_AudioPerformerPlugin | null, id: string, kind: string }[] = [];
	filters: { plugin: MZXBX_AudioFilterPlugin | null, id: string, kind: string }[] = [];
	pluginsList: { url: string, name: string, kind: string }[];
	stateSetupDone: boolean = false;
	nextAudioContextStart: number = 0;
	//currentPosition: number = 0;
	tickDuration = 0.3;
	onAir = false;
	setup(context: AudioContext, schedule: MZXBX_Schedule): void {
		this.audioContext = context;
		this.schedule = schedule;
		this.stateSetupDone = false;
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
	startLoadPluginStarter(kind: string, onDone: (plugin) => void) {
		console.log('startLoadSinglePlugin', kind);
		let tt = this.findPluginInfo(kind);
		if (tt) {
			let info: { kind: string, url: string, functionName: string } = tt;
			appendScriptURL(info.url);
			waitForCondition(250, () => { return (window[info.functionName]); }, () => {
				let exe = window[info.functionName];
				let plugin = exe();
				if (plugin) {
					onDone(plugin);
					this.startLoadCollectedPlugins();
				}
			});
		} else {
			console.log('Not found ', kind);
		}
	}
	startLoadCollectedPlugins() {
		for (let ff = 0; ff < this.filters.length; ff++) {
			if (!(this.filters[ff].plugin)) {
				this.startLoadPluginStarter(this.filters[ff].kind, (plugin) => {
					this.filters[ff].plugin = plugin;
				});
				return;
			}
		}
		for (let pp = 0; pp < this.performers.length; pp++) {
			if (!(this.performers[pp].plugin)) {
				this.startLoadPluginStarter(this.performers[pp].kind, (plugin) => {
					this.performers[pp].plugin = plugin;
				});
				return;
			}
		}
		this.stateSetupDone = true;
	}
	start(loopStart: number, currentPosition: number, loopEnd: number): boolean {
		console.log('start', loopStart, currentPosition, loopEnd);
		this.connect();
		this.nextAudioContextStart = this.audioContext.currentTime;
		this.position = currentPosition;
		this.onAir = true;
		this.tick(loopStart, loopEnd);
		return false;
	}
	connect() {
		console.log('connect');
	}
	disconnect() {
		console.log('disconnect');
	}
	tick(loopStart: number, loopEnd: number) {
		let sendFrom = this.position;
		let sendTo = this.position + this.tickDuration;
		if (this.audioContext.currentTime > this.nextAudioContextStart - this.tickDuration) {
			console.log('position', this.position);//, when);
			let atTime = this.nextAudioContextStart;
			if (sendTo > loopEnd) {
				this.sendPiece(sendFrom, loopEnd, atTime);
				sendFrom = loopStart;
				atTime = atTime + (sendTo - loopEnd);
				sendTo = loopStart + (sendTo - loopEnd);
			}
			this.sendPiece(sendFrom, sendTo, atTime);
			this.position = sendTo;
			this.nextAudioContextStart = this.nextAudioContextStart + this.tickDuration;
			if (this.nextAudioContextStart < this.audioContext.currentTime) {
				this.nextAudioContextStart = this.audioContext.currentTime + this.tickDuration;
			}
		}
		let me = this;
		if (this.onAir) {
			window.requestAnimationFrame(function (time) {
				me.tick(loopStart, loopEnd);
			});
		} else {
			this.disconnect();
		}
	}
	findChannel(id: string): MZXBX_Channel | null {
		if (this.schedule) {
			for (let ii = 0; ii < this.schedule.channels.length; ii++) {
				if (this.schedule.channels[ii].id == id) {
					return this.schedule.channels[ii];
				}
			}
		}
		return null;
	}
	sendPerformerItem(it: MZXBX_PlayItem, whenAudio: number) {
		console.log(it, whenAudio);
		if (this.schedule) {
			let channel:MZXBX_Channel|null=this.findChannel(it.channelId);
			if(channel){
				let performerId = channel.performer.id;
				
			}
			for (let ii = 0; ii < this.schedule.channels.length; ii++) {
				if (this.schedule.channels[ii].id == it.channelId) {
					let performerId = this.schedule.channels[ii].performer.id;
					for (let nn = 0; nn < this.performers.length; nn++) {
						let performer = this.performers[nn];
						if (performerId == performer.id) {
							if (performer.plugin) {
								let plugin: MZXBX_AudioPerformerPlugin = performer.plugin;
								plugin.schedule(whenAudio, it.pitch, it.slides);
							}
						}
					}
				}
			}
		}
	}
	sendFilterItem(state: MZXBX_FilterState, whenAudio: number) {
		if (this.schedule) {
			for (let ii = 0; ii < this.schedule.filters.length; ii++) {

			}
		}
	}
	sendPiece(fromPosition: number, toPosition: number, whenAudio: number) {
		console.log('send', fromPosition, toPosition, whenAudio);
		if (this.schedule) {
			let serieStart = 0;
			for (let ii = 0; ii < this.schedule.series.length; ii++) {
				let cuSerie: MZXBX_Set = this.schedule.series[ii];
				if (serieStart < toPosition && serieStart + cuSerie.duration >= fromPosition) {
					for (let nn = 0; nn < cuSerie.items.length; nn++) {
						let it: MZXBX_PlayItem = cuSerie.items[nn];
						if (serieStart + it.skip >= fromPosition && serieStart + it.skip < toPosition) {
							this.sendPerformerItem(it, whenAudio + serieStart + it.skip - fromPosition);
						}
					}
					for (let nn = 0; nn < cuSerie.states.length; nn++) {
						let state: MZXBX_FilterState = cuSerie.states[nn];
						if (serieStart + state.skip >= fromPosition && serieStart + state.skip < toPosition) {
							this.sendFilterItem(state, whenAudio + serieStart + state.skip - fromPosition);
						}
					}
				}
				serieStart = serieStart + cuSerie.duration;
			}
		}
	}
	cancel(): void {
		this.onAir = false;
	}

}