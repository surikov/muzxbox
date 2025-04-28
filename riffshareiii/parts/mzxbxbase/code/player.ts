function createSchedulePlayer(callback: (start: number, position: number, end: number) => void): MZXBX_Player {
	return new SchedulePlayer(callback);
}
class SchedulePlayer implements MZXBX_Player {
	position: number = 0;
	audioContext: AudioContext;
	schedule: MZXBX_Schedule | null = null;
	performers: MZXBX_PerformerSamplerHolder[] = [];
	filters: MZXBX_FilterHolder[] = [];
	pluginsList: MZXBX_PerformerSamplerHolder[] = [];
	nextAudioContextStart: number = 0;
	tickDuration = 0.25;
	//playState: 'waiting' | 'starting' | 'playing' | 'stopping' = 'waiting';
	isPlayLoop: boolean = false;
	isConnected: boolean = false;
	isLoadingPlugins: boolean = false;

	playCallback: (start: number, position: number, end: number) => void = (start: number, position: number, end: number) => { };
	waitForID: number = -1;
	constructor(callback: (start: number, position: number, end: number) => void) {
		this.playCallback = callback;
	}
	startSetupPlugins(context: AudioContext, schedule: MZXBX_Schedule): null | string {
		if (!(this.isPlayLoop || this.isLoadingPlugins)) {
			this.isLoadingPlugins = true;
			this.audioContext = context;
			this.schedule = schedule;
			if (this.schedule) {
				let pluginLoader: PluginLoader = new PluginLoader();
				let waitload = pluginLoader.collectLoadPlugins(this.schedule, this.filters, this.performers);
				if (waitload) {
					return waitload;
				} else {
					this.isLoadingPlugins = false;
					return null;
				}

			} else {
				return 'Empty schedule';
			}
		} else {
			return 'Already playing/loading';
		}
	}
	allFilters(): MZXBX_FilterHolder[] {
		return this.filters;
	}
	allPerformersSamplers(): MZXBX_PerformerSamplerHolder[] {
		return this.performers;
	}
	launchCollectedPlugins(): null | string {
		try {
			//
			for (let ff = 0; ff < this.filters.length; ff++) {
				//console.log('launch filter',ff,this.filters[ff]);
				let plugin: MZXBX_AudioFilterPlugin | null = this.filters[ff].pluginAudioFilter;

				if (plugin) {
					plugin.launch(this.audioContext, this.filters[ff].properties);
				}
			}
			for (let pp = 0; pp < this.performers.length; pp++) {
				//console.log('launch performer',pp,this.performers[pp]);
				let plugin: MZXBX_AudioPerformerPlugin | MZXBX_AudioSamplerPlugin | null = this.performers[pp].plugin;
				if (plugin) {
					plugin.launch(this.audioContext, this.performers[pp].properties);
				}
			}
			return null;
		} catch (xx) {
			console.log('Can not launch due', xx);
			return 'Can not launch due ' + xx;
		}
	}
	checkCollectedPlugins(): null | string {
		for (let ff = 0; ff < this.filters.length; ff++) {
			//console.log(ff, this.filters[ff]);
			let plugin: MZXBX_AudioFilterPlugin | null = this.filters[ff].pluginAudioFilter;
			if (plugin) {
				let busyState = plugin.busy()
				if (busyState) {
					return busyState + ' [' + this.filters[ff].filterId + ']';
				}
			} else {
				console.log('no plugin for filter', this.filters[ff]);
				return 'plugin not found [' + this.filters[ff].description + ']';
			}
		}
		for (let pp = 0; pp < this.performers.length; pp++) {
			let plugin: MZXBX_AudioPerformerPlugin | MZXBX_AudioSamplerPlugin | null = this.performers[pp].plugin;
			if (plugin) {
				let busyState = plugin.busy()
				if (busyState) {
					return busyState + ' [' + this.performers[pp].description + ' ]';
				}
			} else {
				console.log('no plugin for performer/sampler', this.performers[pp]);
				return 'plugin not found [' + this.performers[pp].description + ']';
			}
		}
		return null;
	}
	reconnectAllPlugins(schedule: MZXBX_Schedule): void {
		this.disconnectAllPlugins();
		this.schedule = schedule;
		let msg = this.connectAllPlugins();
		console.log('reconnectAllPlugins', msg, schedule);
	}
	startLoopTicks(loopStart: number, currentPosition: number, loopEnd: number): string {
		console.log('startLoopTicks', loopStart, currentPosition, loopEnd);
		let msg: string | null = this.connectAllPlugins();
		if (msg) {
			//console.log('Can\'t start loop:', msg);
			return msg;
		} else {
			if (this.audioContext) {
				this.nextAudioContextStart = this.audioContext.currentTime + this.tickDuration;
				this.position = currentPosition;
				this.isPlayLoop = true;
				//this.onAir = true;
				this.waitForID = Math.random();
				this.tick(loopStart, loopEnd, this.waitForID);
				return '';
			} else {
				this.cancel();
				return 'Empty audio context';
			}
		}
	}
	playState(): { connected: boolean, play: boolean, loading: boolean } {
		return {
			connected: this.isConnected
			, play: this.isPlayLoop
			, loading: this.isLoadingPlugins
		};
	}
	connectAllPlugins(): string | null {
		console.log('connectAllPlugins');
		if (!this.isConnected) {
			let msg: string | null = this.launchCollectedPlugins();
			console.log('launchCollectedPlugins', msg);
			if (msg) {
				return msg;
			} else {
				msg = this.checkCollectedPlugins();
				console.log('checkCollectedPlugins', msg);
				if (msg) {
					return msg;
				} else {
					if (this.schedule) {
						let master: AudioNode = this.audioContext.destination;
						for (let ff = this.schedule.filters.length - 1; ff >= 0; ff--) {

							let filter = this.schedule.filters[ff];
							let plugin = this.findFilterPlugin(filter.id);
							if (plugin) {
								let pluginOutput = plugin.output();
								if (pluginOutput) {
									for (let oo = 0; oo < filter.outputs.length; oo++) {
										let outId = filter.outputs[oo];
										let targetNode: AudioNode | null = master;
										if (outId) {
											let target = this.findFilterPlugin(outId);
											if (target) {
												targetNode = target.input();
											}
										}
										if (targetNode) {
											pluginOutput.connect(targetNode);
										}
									}
								}
							}
						}
						for (let cc = 0; cc < this.schedule.channels.length; cc++) {
							let channel = this.schedule.channels[cc];
							let performer = this.findPerformerSamplerPlugin(channel.id);
							if (performer) {
								let output = performer.output();
								if (output) {
									for (let oo = 0; oo < channel.outputs.length; oo++) {
										let outId = channel.outputs[oo];
										let targetNode: AudioNode | null = master;
										if (outId) {
											let target = this.findFilterPlugin(outId);
											if (target) {
												targetNode = target.input();
											}
										}
										if (targetNode) {
											output.connect(targetNode);
										}
									}
								}
							}
						}
					}
					this.isConnected = true;
					return null;
				}
			}
		} else {
			console.log('Connected aready');
			return null;
		}
	}
	disconnectAllPlugins() {
		//console.log('disconnectAllPlugins');
		if (this.isConnected) {
			if (this.schedule) {
				let master: AudioNode = this.audioContext.destination;
				for (let ff = this.schedule.filters.length - 1; ff >= 0; ff--) {
					let filter = this.schedule.filters[ff];
					let plugin = this.findFilterPlugin(filter.id);
					if (plugin) {
						let output = plugin.output();
						if (output) {
							try {
								for (let oo = 0; oo < filter.outputs.length; oo++) {
									let outId = filter.outputs[oo];
									let targetNode: AudioNode | null = master;
									if (outId) {
										let target = this.findFilterPlugin(outId);
										if (target) {
											targetNode = target.input();

										}
									}
									if (targetNode) {
										output.disconnect(targetNode);
									}
								}
							} catch (ex) {
								console.log(ex);
							}
						}
					}
				}
				for (let cc = 0; cc < this.schedule.channels.length; cc++) {
					let channel = this.schedule.channels[cc];
					let plugin = this.findPerformerSamplerPlugin(channel.id);
					if (plugin) {
						let output = plugin.output();
						if (output) {
							try {
								plugin.cancel();
								for (let oo = 0; oo < channel.outputs.length; oo++) {
									let outId = channel.outputs[oo];
									let targetNode: AudioNode | null = master;
									if (outId) {
										let target = this.findFilterPlugin(outId);
										if (target) {
											targetNode = target.input();

										}
									}
									if (targetNode) {
										output.disconnect(targetNode);
									}
								}
							} catch (ex) {
								console.log(ex);
							}
						}
					}
				}
				this.isConnected = false;
			} else {
				console.log('empty schedule');
			}

		} else {
			console.log('not connected');
		}
	}
	tick(loopStart: number, loopEnd: number, waitId: number) {
		if (this.audioContext) {
			if (waitId == this.waitForID) {
				let sendFrom = this.position;
				let sendTo = this.position + this.tickDuration;
				if (this.audioContext.currentTime > this.nextAudioContextStart - this.tickDuration) {
					let atTime = this.nextAudioContextStart;
					if (sendTo > loopEnd) {
						this.sendPiece(sendFrom, loopEnd, atTime);
						atTime = atTime + (loopEnd - sendFrom);
						sendFrom = loopStart;
						sendTo = loopStart + (sendTo - loopEnd);
					}
					this.sendPiece(sendFrom, sendTo, atTime);
					this.position = sendTo;
					this.nextAudioContextStart = this.nextAudioContextStart + this.tickDuration;
					if (this.nextAudioContextStart < this.audioContext.currentTime) {
						this.nextAudioContextStart = this.audioContext.currentTime + this.tickDuration;
					}
					this.playCallback(loopStart, this.position, loopEnd);
				}
				let me = this;
				if (this.isPlayLoop) {
					if (this.waitForID == waitId) {
						this.waitForID = Math.random();
						let id = this.waitForID;
						window.requestAnimationFrame(function (time) {
							me.tick(loopStart, loopEnd, id);
						});
						this.waitForID = id;
					} else {
						console.log('cancel ticks due different id');
					}
					//} else {
					//this.disconnectAllPlugins();
				} else {
					console.log('cancel ticks due stop');
				}
			}
		}
	}
	findPerformerSamplerPlugin(channelId: string): MZXBX_AudioPerformerPlugin | MZXBX_AudioSamplerPlugin | null {
		if (this.schedule) {
			for (let ii = 0; ii < this.schedule.channels.length; ii++) {
				if (this.schedule.channels[ii].id == channelId) {
					for (let nn = 0; nn < this.performers.length; nn++) {
						let performer = this.performers[nn];
						if (channelId == performer.channelId) {
							if (performer.plugin) {
								let plugin: MZXBX_AudioPerformerPlugin | MZXBX_AudioSamplerPlugin = performer.plugin;
								return plugin;
							} else {
								console.error('Empty performer plugin for', channelId);
							}
						}
					}
				}
			}
			console.error('Empty schedule');
		}
		console.error('No performer for', channelId);
		return null;
	}
	sendPerformerItem(it: MZXBX_PlayItem, whenAudio: number, tempo: number) {
		let pp = this.findPerformerSamplerPlugin(it.channelId) as any;
		if (pp) {
			if (pp.start) {
				let sampler: MZXBX_AudioSamplerPlugin = pp;
				sampler.start(whenAudio, tempo);
			} else {
				let performer: MZXBX_AudioPerformerPlugin = pp;
				performer.strum(whenAudio, it.pitches, tempo, it.slides);
			}
		}
	}
	findFilterPlugin(filterId: string): MZXBX_AudioFilterPlugin | null {
		if (this.schedule) {
			for (let nn = 0; nn < this.filters.length; nn++) {
				let filter = this.filters[nn];
				if (filter.filterId == filterId) {
					if (filter.pluginAudioFilter) {
						let plugin: MZXBX_AudioFilterPlugin = filter.pluginAudioFilter;
						if (plugin) {
							return plugin;
						}
					}
				}
			}
		}
		console.log('not found filter', filterId);
		return null;
	}
	sendFilterItem(state: MZXBX_FilterState, whenAudio: number, tempo: number) {
		let plugin: MZXBX_AudioFilterPlugin | null = this.findFilterPlugin(state.filterId);
		if (plugin) {
			plugin.schedule(whenAudio, tempo, state.data);
		}
	}
	ms(nn: number): number {
		return Math.round(nn * 1000);
	}
	sendPiece(fromPosition: number, toPosition: number, whenAudio: number) {
		if (this.schedule) {
			let serieStart = 0;
			for (let ii = 0; ii < this.schedule.series.length; ii++) {
				let cuSerie: MZXBX_Set = this.schedule.series[ii];
				if (this.ms(serieStart) < this.ms(toPosition)
					&& this.ms(serieStart + cuSerie.duration) >= this.ms(fromPosition)) {
					for (let nn = 0; nn < cuSerie.items.length; nn++) {
						let it: MZXBX_PlayItem = cuSerie.items[nn];
						if (this.ms(serieStart + it.skip) >= this.ms(fromPosition)
							&& this.ms(serieStart + it.skip) < this.ms(toPosition)) {//}, it.channelId) {
							this.sendPerformerItem(it, whenAudio + serieStart + it.skip - fromPosition, cuSerie.tempo);
						}
					}
					for (let nn = 0; nn < cuSerie.states.length; nn++) {
						let state: MZXBX_FilterState = cuSerie.states[nn];
						if (this.ms(serieStart + state.skip) >= this.ms(fromPosition)
							&& this.ms(serieStart + state.skip) < this.ms(toPosition)) {
							this.sendFilterItem(state, whenAudio + serieStart + state.skip - fromPosition, cuSerie.tempo);
						}
					}
				}
				serieStart = serieStart + cuSerie.duration;
			}
		}
	}
	cancel(): void {
		if (this.isPlayLoop) {
			this.waitForID = -1;
			this.isPlayLoop = false;
			this.disconnectAllPlugins();
		} else {
			console.log('No loop to cancel');
		}
	}

}