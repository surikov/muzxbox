console.log('MIDI.Ru Archive plugin v1.0');
declare function createSchedulePlayer(callback: (start: number, position: number, end: number) => void): MZXBX_Player;
class InMIDI {
	player: MZXBX_Player | null = null;
	parsedProject: Zvoog_Project | null = testminium;
	audioContext: AudioContext | null = null;
	constructor() {
		console.log('init');
	}
	startLoad() {
		console.log('startLoad');
	}
	initContext() {
		if (this.audioContext) {
			//
		} else {
			this.audioContext = new AudioContext();
		}
		if (this.audioContext.state == 'suspended') {
			this.audioContext.resume();
		}
	}
	startPlay() {
		console.log('startPlay');
		this.initContext();
		let me = this;
		if (this.player) {
			//
		} else {
			this.player = createSchedulePlayer((start: number, position: number, end: number) => {
				console.log('player', start, position, end);
			});
		}


		if (me.parsedProject) {
			let raw = me.renderCurrentProjectForOutput(me.parsedProject);
			console.log('rendered', raw);
			if (me.audioContext) {
				let result = this.player.startSetupPlugins(me.audioContext, raw);
				//console.log('loading result', result);
				if (result) {
					alert(result);
				} else {
					let to = 0;
					for (let nn = 0; nn < raw.series.length; nn++) {
						to = to + raw.series[nn].duration;
					}
					let msg: string = this.player.startLoopTicks(0, 0, to);
					if (msg) {
						alert(msg);
					}
				}
			}
			//}
		}
	}
	jumpPos(vv) {
		console.log('jumpPos', vv);
	}
	loadFromFileURL() {
		console.log(this.parsedProject);
		let params: URLSearchParams = new URLSearchParams(document.location.search);
		let fileurl = params.get('url');
		let filetitle = params.get('title');
		console.log('loadFromFileURL', filetitle, fileurl);
		if (fileurl) {
			let xmlHttpRequest = new XMLHttpRequest();
			xmlHttpRequest.open("GET", fileurl);
			xmlHttpRequest.responseType = "arraybuffer";
			let me = this;
			xmlHttpRequest.onload = (event) => {
				let arrayBuffer: ArrayBuffer = xmlHttpRequest.response as ArrayBuffer; // Note: not req.responseText
				if (arrayBuffer) {
					me.loadFromArray(arrayBuffer, filetitle);
				}
			};
			xmlHttpRequest.send(null);
		}
	}
	loadFromArray(arrayBuffer: ArrayBuffer, filetitle: string | null) {
		console.log(arrayBuffer);
		let title: string = filetitle ? filetitle : '?';
		let mireader: MIDIReader = new MIDIReader(title, 123, arrayBuffer);
		this.parsedProject = mireader.project;
		console.log(this.parsedProject);
	}
	findCurrentFilter(zp: Zvoog_Project, id: string): null | Zvoog_FilterTarget {
		for (let ff = 0; ff < zp.filters.length; ff++) {
			if (zp.filters[ff].id == id) {
				return zp.filters[ff];
			}
		}
		return null;
	}
	renderCurrentOutputs(zp: Zvoog_Project, id: string, result: string[], outputs: string[]) {
		//console.log('renderCurrentOutputs', id, outputs);
		for (let oo = 0; oo < outputs.length; oo++) {
			let cid = outputs[oo];
			if (cid) {
				if (cid != id) {
					let filter = this.findCurrentFilter(zp, cid);
					if (filter) {
						if (filter.state == 1) {//passthrough
							//console.log('passthrough', filter);
							this.renderCurrentOutputs(zp, id, result, filter.outputs);
						} else {
							if (result.indexOf(cid) < 0) {
								//console.log('add', cid);
								result.push(cid);
							}
						}
					}
				}
			} else {
				if (result.indexOf('') < 0) {
					//console.log('add speaker');
					result.push('');
				}
			}
		}
	}
	renderCurrentProjectForOutput(zp: Zvoog_Project): MZXBX_Schedule {
		//globalCommandDispatcher.adjustTimeline();
		let forOutput: MZXBX_Schedule = {
			series: []
			, channels: []
			, filters: []
		};
		let prj: Zvoog_Project = zp;

		let soloOnly = false;
		for (let ss = 0; ss < prj.percussions.length; ss++) {
			if (prj.percussions[ss].sampler.state == 2) {
				soloOnly = true;
				break;
			}
		}
		for (let tt = 0; tt < prj.tracks.length; tt++) {
			if (prj.tracks[tt].performer.state == 2) {
				soloOnly = true;
				break;
			}
		}
		for (let ss = 0; ss < prj.percussions.length; ss++) {
			let sampler = prj.percussions[ss];
			let mchannel: MZXBX_Channel = {
				id: sampler.sampler.id
				, outputs: []//sampler.sampler.outputs
				, performer: {
					//id: sampler.sampler.id
					kind: sampler.sampler.kind
					, properties: sampler.sampler.data
					, description: 'sampler ' + sampler.title
				}
				, hint: 0
			};
			if (
				(soloOnly && sampler.sampler.state != 2)
				|| ((!soloOnly) && sampler.sampler.state == 1)
			) {
				//mchannel.outputs = [];
			} else {
				this.renderCurrentOutputs(zp, sampler.sampler.id, mchannel.outputs, sampler.sampler.outputs);
			}
			forOutput.channels.push(mchannel);
		}

		for (let tt = 0; tt < prj.tracks.length; tt++) {
			let track = prj.tracks[tt];
			let mchannel: MZXBX_Channel = {
				id: track.performer.id
				, outputs: []//track.performer.outputs
				, performer: {
					//id: track.performer.id
					kind: track.performer.kind
					, properties: track.performer.data
					, description: 'track ' + track.title
				}
				, hint: 0
			};
			if (
				(soloOnly && track.performer.state != 2)
				|| ((!soloOnly) && track.performer.state == 1)
			) {
				//mchannel.outputs = [];
			} else {
				this.renderCurrentOutputs(zp, track.performer.id, mchannel.outputs, track.performer.outputs);
			}
			forOutput.channels.push(mchannel);
		}

		for (let ff = 0; ff < prj.filters.length; ff++) {
			let filter = prj.filters[ff];
			let outFilter: MZXBX_Filter = {
				id: filter.id
				, kind: filter.kind
				, properties: filter.data
				, outputs: []//filter.outputs
				, description: 'filter ' + filter.title
			}
			if (filter.state == 1) {
				//outFilter.outputs = [];
			} else {
				this.renderCurrentOutputs(zp, filter.id, outFilter.outputs, filter.outputs);
			}
			forOutput.filters.push(outFilter);
		}
		//let cuStart = 0;
		for (let mm = 0; mm < prj.timeline.length; mm++) {
			let measure: Zvoog_SongMeasure = prj.timeline[mm];
			let cuDuration = MMUtil().set(measure.metre).duration(measure.tempo);
			let singleSet: MZXBX_Set = {
				duration: cuDuration
				, tempo: measure.tempo
				, items: []
				, states: []
			};
			forOutput.series.push(singleSet);
			for (let ff = 0; ff < prj.filters.length; ff++) {
				let filter = prj.filters[ff];
				let auto = filter.automation[mm];
				if (auto) {
					for (let aa = 0; aa < auto.changes.length; aa++) {
						let change = auto.changes[aa];
						let start = MMUtil().set(change.skip).duration(measure.tempo);
						let filterChange: MZXBX_FilterState = { skip: start, filterId: filter.id, data: change.stateBlob };
						singleSet.states.push(filterChange);
					}
				}
			}
			for (let ss = 0; ss < prj.percussions.length; ss++) {
				let channel = forOutput.channels[ss];
				let sampler = prj.percussions[ss];
				let percBar = sampler.measures[mm];
				if (percBar) {
					for (let ski = 0; ski < percBar.skips.length; ski++) {
						let askip = percBar.skips[ski];
						let start = MMUtil().set(askip).duration(measure.tempo);
						let it: MZXBX_PlayItem = { skip: start, channel: channel, pitches: [], slides: [] };
						singleSet.items.push(it);
					}
				}
			}
			for (let ss = 0; ss < prj.tracks.length; ss++) {
				let channel = forOutput.channels[ss + prj.percussions.length];
				let track = prj.tracks[ss];
				let trackBar = track.measures[mm];
				if (trackBar) {
					for (let ch = 0; ch < trackBar.chords.length; ch++) {
						let chord = trackBar.chords[ch];
						//for (let ski = 0; ski < trackBar.skips.length; ski++) {
						//let askip = trackBar.skips[ski];
						let start = MMUtil().set(chord.skip).duration(measure.tempo);
						let it: MZXBX_PlayItem = { skip: start, channel: channel, pitches: chord.pitches, slides: [] };
						singleSet.items.push(it);
						for (let kk = 0; kk < chord.slides.length; kk++) {
							let one = chord.slides[kk];
							it.slides.push({ duration: MMUtil().set(one.duration).duration(measure.tempo), delta: one.delta });
						}
						//}
						if (it.pitches.length < 1) {
							console.log('empty', it);
						}
					}
				}
			}
		}
		//console.log('renderCurrentProjectForOutput', forOutput);
		return forOutput;
	}
}