//declare let pluginListKindUrlName: {group: string,kind: string, url: string, functionName: string }[];



/*function loadOrFindFromScript(url: string, onDone: (r: any) => void) {
	let cachedObjects: { url: string, createFunction: null | (() => any), createdObject: any }[] = window['cachedScripts'];
	cachedObjects = cachedObjects || [];
	let found: null | { url: string, createFunction: null | (() => any), createdObject: any } = null;
	for (let ii = 0; ii < cachedObjects.length; ii++) {
		if (cachedObjects[ii].url == url) {
			found = cachedObjects[ii];
		}
	}
	if (found == null) {
		found = { url: url, createFunction: null, createdObject: null };
		cachedObjects.push(found);
		MZXBX_appendScriptURL(url);
	}
	MZXBX_waitForCondition(250, () => {
		if (found != null) {
			return (found.createFunction != null);
		} else {
			return false;
		}
	}, () => {
		if (found != null) {
			if (found.createdObject == null) {
				if (found.createFunction != null) {
					found.createdObject = found.createFunction();
				}
			}
			onDone(found.createdObject);
		}
	});
}*/
function createSchedulePlayer(): MZXBX_Player {
	return new SchedulePlayer();
}
class SchedulePlayer implements MZXBX_Player {
	position: number = 0;
	audioContext: AudioContext;
	schedule: MZXBX_Schedule | null = null;
	performers: MZXBX_PerformerHolder[] = [];//{ plugin: MZXBX_AudioPerformerPlugin | null, id: string, kind: string, properties: string, launched: boolean }[] = [];
	filters: MZXBX_FilterHolder[] = [];// { plugin: MZXBX_AudioFilterPlugin | null, id: string, kind: string, properties: string }[] = [];
	pluginsList: MZXBX_PerformerHolder[] = [];// { url: string, name: string, kind: string }[];
	//stateSetupDone: boolean = false;
	nextAudioContextStart: number = 0;
	//currentPosition: number = 0;
	tickDuration = 0.25;
	onAir = false;

	setupPlugins(context: AudioContext, schedule: MZXBX_Schedule, onDone: () => void): null | string {
		this.audioContext = context;
		this.schedule = schedule;
		//this.stateSetupDone = false;
		if (this.schedule) {
			let pluginLoader: PluginLoader = new PluginLoader();
			return pluginLoader.collectLoadPlugins(this.schedule, this.filters, this.performers, onDone);
		} else {
			return 'Empty schedule';
		}
	}

	allFilters(): MZXBX_FilterHolder[] {
		return this.filters;
	}
	allPerformers(): MZXBX_PerformerHolder[] {
		return this.performers;
	}



	launchCollectedPlugins(): null | string {
		for (let ff = 0; ff < this.filters.length; ff++) {
			let plugin: MZXBX_AudioFilterPlugin | null = this.filters[ff].plugin;
			//console.log('filter', this.filters[ff].id, this.filters[ff].kind, this.filters[ff].properties);
			if (plugin) {
				//console.log('launch');
				//if (!this.filters[ff].launched) {
				plugin.launch(this.audioContext, this.filters[ff].properties);
				this.filters[ff].launched = true;
				//console.log('launch',this.filters[ff]);
				//}
			}
		}
		for (let pp = 0; pp < this.performers.length; pp++) {
			let plugin: MZXBX_AudioPerformerPlugin | null = this.performers[pp].plugin;
			//console.log('performer', this.performers[pp].id, this.performers[pp].kind, this.performers[pp].properties);
			if (plugin) {
				//console.log('launch');
				//if (!this.performers[pp].launched) {
				plugin.launch(this.audioContext, this.performers[pp].properties);
				this.performers[pp].launched = true;
				//console.log('launch',this.performers[pp]);
				//}
			}
		}
		return null;
	}
	checkCollectedPlugins(): null | string {
		for (let ff = 0; ff < this.filters.length; ff++) {
			let plugin: MZXBX_AudioFilterPlugin | null = this.filters[ff].plugin;
			if (plugin) {
				if (plugin.busy()) {
					return 'filter ' + this.filters[ff].filterId + ' ' + plugin.busy();
				}
			} else {
				return 'empty plugin for filter ' + this.filters[ff].filterId;
			}
		}
		for (let pp = 0; pp < this.performers.length; pp++) {
			let plugin: MZXBX_AudioPerformerPlugin | null = this.performers[pp].plugin;
			if (plugin) {
				if (plugin.busy()) {
					return 'performer ' + this.performers[pp].channelId + ' ' + plugin.busy();
				}
			} else {
				return 'empty performer ' + this.performers[pp];
			}
		}
		return null;
	}
	startLoop(loopStart: number, currentPosition: number, loopEnd: number): string {
		//loopStart=8;
		//currentPosition=2;
		//loopEnd=16;
		//console.log('startLoop', loopStart, currentPosition, loopEnd);
		//this.startSetupPlugins();
		/*if (this.schedule) {
			let pluginLoader: PluginLoader = new PluginLoader();
			pluginLoader.collectLoadPlugins(this.schedule, this.filters, this.performers, () => {

			});
		}*/
		let msg: string | null = this.connectAllPlugins();
		if (msg) {
			//console.log('Can\'t start loop:', msg);
			return msg;
		} else {
			this.nextAudioContextStart = this.audioContext.currentTime + this.tickDuration;
			this.position = currentPosition;
			this.onAir = true;
			this.tick(loopStart, loopEnd);
			return '';
		}
	}
	/*reconnect() {
		if (this.onAir) {
			this.disconnect();
			this.connect();
			this.launchCollectedPlugins();
		}
	}*/
	connectAllPlugins(): string | null {
		//console.log('connectAllPlugins');
		let msg: string | null = this.launchCollectedPlugins();
		if (msg) {
			return msg;
		} else {
			msg = this.checkCollectedPlugins();
			if (msg) {
				return msg;
			} else {
				if (this.schedule) {
					let master: AudioNode = this.audioContext.destination;
					//(masterOutput as any).debug = 'destination';
					for (let ff = this.schedule.filters.length - 1; ff >= 0; ff--) {
						let filter = this.schedule.filters[ff];
						let plugin = this.findFilterPlugin(filter.id);

						if (plugin) {
							let pluginOutput = plugin.output();

							if (pluginOutput) {
								/*(pluginOutput as any).debug = filter.id;
								pluginOutput.connect(masterOutput);
								let pluginInput = plugin.input();
								if (pluginInput) {
									//console.log(pluginInput,pluginOutput, masterOutput);
									masterOutput = pluginInput;
								}
							}*/
								for (let oo = 0; oo < filter.outputs.length; oo++) {
									let outId = filter.outputs[oo];
									//console.log('check filter', filter.id, outId);
									let targetNode: AudioNode | null = master;
									if (outId) {
										let target = this.findFilterPlugin(outId);
										if (target) {
											targetNode = target.input();
										}

									}
									if (targetNode) {
										//console.log('connect filter', filter.id, outId);
										pluginOutput.connect(targetNode);
									}
								}
							}
						}
					}
					for (let cc = 0; cc < this.schedule.channels.length; cc++) {
						let channel = this.schedule.channels[cc];
						//let channelOutput = masterOutput;
						/*for (let ff = channel.filters.length - 1; ff >= 0; ff--) {
							let filter = channel.filters[ff];
							let plugin = this.findFilterPlugin(filter.id);
							if (plugin) {
								let output = plugin.output();
								if (output) {
									(output as any).debug = filter.id;
									output.connect(channelOutput);
									let input = plugin.input();
									if (input) {
										//console.log(input,output, masterOutput);
										channelOutput = input;
									}
								}
							}
						}*/
						let performer = this.findPerformerPlugin(channel.id);
						if (performer) {
							let output = performer.output();
							if (output) {
								//(output as any).debug = channel.id;
								//console.log(output,channelOutput);
								//output.connect(channelOutput);
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
										//console.log('connect channel', channel.id, outId);
										output.connect(targetNode);
									}
								}
							}
						}
					}
				}
				return null;
			}
		}
	}
	disconnectAllPlugins() {
		//console.log('disconnect');
		if (this.schedule) {
			let master: AudioNode = this.audioContext.destination;
			//let toNode: AudioNode = this.audioContext.destination;
			for (let ff = this.schedule.filters.length - 1; ff >= 0; ff--) {
				let filter = this.schedule.filters[ff];
				let plugin = this.findFilterPlugin(filter.id);
				if (plugin) {
					let output = plugin.output();
					if (output) {
						/*try {
							output.disconnect(toNode);
						} catch (ex) {
							//ignore
						}
						//output.disconnect(toNode);
						let input = plugin.input();
						if (input) {
							toNode = input;
						}*/
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
					}
				}
			}
			for (let cc = 0; cc < this.schedule.channels.length; cc++) {
				let channel = this.schedule.channels[cc];
				/*let channelOutput = toNode;
				
				for (let ff = channel.filters.length - 1; ff >= 0; ff--) {
					let filter = channel.filters[ff];
					let plugin = this.findFilterPlugin(filter.id);
					if (plugin) {
						let output = plugin.output();
						if (output) {
							try {
								output.disconnect(channelOutput);
							} catch (ex) {
								//ignore
							}
							let input = plugin.input();
							if (input) {
								channelOutput = input;
							}
							
						}
					}
				}*/
				let plugin = this.findPerformerPlugin(channel.id);
				if (plugin) {
					let output = plugin.output();
					if (output) {
						try {
							plugin.cancel();
							//output.disconnect(channelOutput);
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
							//ignore
						}
					}
				}
			}
		}
	}
	tick(loopStart: number, loopEnd: number) {
		//console.log('tick', loopStart, loopEnd, this.audioContext.currentTime, this.nextAudioContextStart, this.tickDuration);
		let sendFrom = this.position;
		let sendTo = this.position + this.tickDuration;
		if (this.audioContext.currentTime > this.nextAudioContextStart - this.tickDuration) {
			//console.log(sendFrom,sendTo);
			let atTime = this.nextAudioContextStart;
			if (sendTo > loopEnd) {
				this.sendPiece(sendFrom, loopEnd, atTime);
				atTime = atTime + (loopEnd - sendFrom);
				sendFrom = loopStart;
				//atTime = atTime + (sendTo - loopEnd);

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
			this.disconnectAllPlugins();
		}
	}
	findPerformerPlugin(channelId: string): MZXBX_AudioPerformerPlugin | null {
		if (this.schedule) {
			for (let ii = 0; ii < this.schedule.channels.length; ii++) {
				if (this.schedule.channels[ii].id == channelId) {
					//let performerId = this.schedule.channels[ii].performer.id;
					for (let nn = 0; nn < this.performers.length; nn++) {
						let performer = this.performers[nn];
						if (channelId == performer.channelId) {
							if (performer.plugin) {
								let plugin: MZXBX_AudioPerformerPlugin = performer.plugin;
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
		//console.log('sendPerformerItem',it, whenAudio);
		/*if (this.schedule) {
			for (let ii = 0; ii < this.schedule.channels.length; ii++) {
				if (this.schedule.channels[ii].id == it.channelId) {
					let performerId = this.schedule.channels[ii].performer.id;
					for (let nn = 0; nn < this.performers.length; nn++) {
						let performer = this.performers[nn];
						if (performerId == performer.id) {
							if (performer.plugin) {
								let plugin: MZXBX_AudioPerformerPlugin = performer.plugin;
								plugin.schedule(whenAudio, it.volume,it.pitch, it.slides);
							}
						}
					}
				}
			}
		}*/
		let plugin: MZXBX_AudioPerformerPlugin | null = this.findPerformerPlugin(it.channelId);
		if (plugin) {
			//console.log(plugin,it);
			//plugin.schedule(whenAudio, it.pitch, it.slides);
			plugin.schedule(whenAudio, it.pitches, tempo, it.slides);
		}
	}
	findFilterPlugin(filterId: string): MZXBX_AudioFilterPlugin | null {
		if (this.schedule) {
			for (let nn = 0; nn < this.filters.length; nn++) {
				let filter = this.filters[nn];
				if (filter.filterId == filterId) {
					if (filter.plugin) {
						let plugin: MZXBX_AudioFilterPlugin = filter.plugin;
						if (plugin) {
							return plugin;
						}
					}
				}
			}
		}
		return null;
	}
	sendFilterItem(state: MZXBX_FilterState, whenAudio: number) {
		/*if (this.schedule) {
			for (let nn = 0; nn < this.filters.length; nn++) {
				let filter = this.filters[nn];
				if (filter.id == state.filterId) {
					if (filter.plugin) {
						let plugin: MZXBX_AudioFilterPlugin = filter.plugin;
						plugin.schedule(whenAudio, state.data);
					}
				}
			}
		}*/
		let plugin: MZXBX_AudioFilterPlugin | null = this.findFilterPlugin(state.filterId);
		if (plugin) {
			//console.log('sendFilterItem',state.filterId,whenAudio, state.data);
			plugin.schedule(whenAudio, state.data);
		}
	}
	ms(nn: number): number {
		return Math.round(nn * 1000);
	}
	sendPiece(fromPosition: number, toPosition: number, whenAudio: number) {
		//fromPosition = Math.floor(fromPosition * 1000) / 1000;
		//toPosition = Math.floor(toPosition * 1000) / 1000;
		//console.log('sendPiece', fromPosition, toPosition, 'at', whenAudio);
		if (this.schedule) {
			let serieStart = 0;
			for (let ii = 0; ii < this.schedule.series.length; ii++) {
				let cuSerie: MZXBX_Set = this.schedule.series[ii];
				if (this.ms(serieStart) < this.ms(toPosition)
					&& this.ms(serieStart + cuSerie.duration) >= this.ms(fromPosition)) {
					for (let nn = 0; nn < cuSerie.items.length; nn++) {
						let it: MZXBX_PlayItem = cuSerie.items[nn];
						//console.log('    check', this.ms(serieStart + it.skip), (serieStart + it.skip));
						if (this.ms(serieStart + it.skip) >= this.ms(fromPosition)
							&& this.ms(serieStart + it.skip) < this.ms(toPosition)) {//}, it.channelId) {
							//console.log('  sendPerformerItem', (ii + it.skip), it.channelId, it.pitch, (whenAudio + serieStart + it.skip - fromPosition));
							this.sendPerformerItem(it, whenAudio + serieStart + it.skip - fromPosition, cuSerie.tempo);
						}
					}
					for (let nn = 0; nn < cuSerie.states.length; nn++) {
						let state: MZXBX_FilterState = cuSerie.states[nn];
						if (this.ms(serieStart + state.skip) >= this.ms(fromPosition)
							&& this.ms(serieStart + state.skip) < this.ms(toPosition)) {
							this.sendFilterItem(state, whenAudio + serieStart + state.skip - fromPosition);
						}
					}
				}
				serieStart = serieStart + cuSerie.duration;
				//serieStart = Math.floor(serieStart * 1000) / 1000;
			}
		}
	}
	cancel(): void {
		//console.log('cancel player');
		this.onAir = false;
		//this.disconnect();
	}

}