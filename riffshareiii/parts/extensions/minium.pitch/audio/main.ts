console.log('Pitch/Chord v1.0');
class StrumPerformerImplementation implements MZXBX_AudioPerformerPlugin {
	audioContext: AudioContext;
	player: MM_WebAudioFontPlayer = new MM_WebAudioFontPlayer();
	volumeNode: GainNode;
	loader: MM_WebAudioFontLoader = new MM_WebAudioFontLoader(this.player);
	//midiidx: number = 0;
	listidx: number = 0;
	info: MMPresetInfo;
	preset: MMWavePreset | null = null;
	loudness = 0.5;
	up = false;
	//mode: 'plain' | 'pong' | 'up' | 'down' | 'snap' = 'pong';
	strumModeFlat: 0 = 0;
	strumModeDown: 1 = 1;
	strumModeUp: 2 = 2;
	strumModeSnap: 3 = 3;
	strumModePong: 4 = 4;
	strumMode: 0 | 1 | 2 | 3 | 4 = this.strumModeFlat;	//Flat / Down / Up / Snap / Pong
	launch(context: AudioContext, parameters: string): void {
		this.preset = null;
		this.audioContext = context;
		this.volumeNode = this.audioContext.createGain();

		/*
		let split = parameters.split('/');
		let idx = 0;
		if (split.length > 1 && (split[1].trim().length > 0)) {
			this.listidx = parseInt(split[1]);
			this.midiidx = parseInt(split[0]);
			idx = this.listidx;
		} else {
			this.listidx = -1;
			this.midiidx = parseInt(parameters);
			idx = this.loader.findInstrument(this.midiidx);
		}
		if (split.length > 2) {
			if (split[2].length > 0) {
				this.mode = split[2] as any;
			}
		}
		if (split.length > 3) {
			if (split[3].length > 0) {
				this.loudness = 0.01 * (0.0 + parseInt(split[3]));
			}
		}
		*/
		//this.midinumber = parseInt(parameters);
		//let idx = this.loader.findInstrument(this.midinumber);
		this.info = this.loader.instrumentInfo(this.listidx);

		this.loader.startLoad(context, this.info.url, this.info.variable);
		this.volumeNode.gain.setValueAtTime(this.loudness, this.audioContext.currentTime + 0.001);
		//console.log('loudness',this.loudness);
		/*
		if(this.info.variable=="_tone_0300_SBAWE32_sf2_file"){
			this.volume.gain.setValueAtTime(0.99, this.audioContext.currentTime+0.002);
		}
		if(this.info.variable=="_tone_0290_GeneralUserGS_sf2_file"){
			this.volume.gain.setValueAtTime(0.99, this.audioContext.currentTime+0.002);
		}*/
		this.loader.waitLoad(() => {
			this.preset = window[this.info.variable];
			//console.log('preset', this.preset, this.info);

		});
	}
	parseParameters(parameters: string) {
		try {
			let split = parameters.split('/');
			this.loudness = parseInt(split[0]) / 100;
			this.listidx = parseInt(split[1]);
			let mode = parseInt(split[2]);
			if (mode == 0) this.strumMode = 0;
			if (mode == 1) this.strumMode = 1;
			if (mode == 2) this.strumMode = 2;
			if (mode == 3) this.strumMode = 3;
			if (mode == 4) this.strumMode = 4;
			//this.strumMode = parseInt(split[2]);

		} catch (xx) {
			console.log(xx);
			this.loudness = 0.5;
			this.listidx = 0;
			this.strumMode = 0;
		}
	}
	busy(): null | string {
		if (this.preset == null) {
			return 'preset ' + this.info;
		} else {
			if (!this.loader.loaded(this.info.variable)) {
				return 'loaded ' + this.info;
			} else {
				return null;
			}
		}
	}
	strum(whenStart: number, zpitches: number[], tempo: number, mzbxslide: MZXBX_SlideItem[]): void {
		if (this.audioContext) {
			if (this.volumeNode) {
				if (this.preset) {
					let duration = 0;
					//let volumeLevel = 0.66;
					let volumeLevel = 0.95 + 0.05 * Math.random();
					let when = whenStart + Math.random() * 1 / tempo;
					//let slides: ZPWaveSlide[][] = [];
					for (let ii = 0; ii < mzbxslide.length; ii++) {
						let one = mzbxslide[ii];
						duration = duration + one.duration;
						//let sipi: ZPWaveSlide[] = [];
						//for (let pp = 0; pp < zpitches.length; pp++) {
						//	sipi.push({ when: 0, delta: 0 });
						//}
						//slides.push(sipi);
					}
					let pitches: number[] = [];
					for (let ii = 0; ii < zpitches.length; ii++) {
						pitches.push(zpitches[ii] + 0);
					}
					//console.log(duration, zpitches, mzbxslide);
					if (this.strumMode == this.strumModePong) {
						if (this.up) {
							this.player.queueStrumDown(this.audioContext, this.volumeNode, this.preset, when, tempo, pitches, duration, volumeLevel, mzbxslide);
						} else {
							this.player.queueStrumUp(this.audioContext, this.volumeNode, this.preset, when, tempo, pitches, duration, volumeLevel, mzbxslide);
						}
						this.up = !this.up;
					} else {
						if (this.strumMode == this.strumModeDown) {
							this.player.queueStrumDown(this.audioContext, this.volumeNode, this.preset, when, tempo, pitches, duration, volumeLevel, mzbxslide);
						} else {
							if (this.strumMode == this.strumModeUp) {
								this.player.queueStrumUp(this.audioContext, this.volumeNode, this.preset, when, tempo, pitches, duration, volumeLevel, mzbxslide);
							} else {
								if (this.strumMode == this.strumModeSnap) {
									this.player.queueSnap(this.audioContext, this.volumeNode, this.preset, when, tempo, pitches, duration, volumeLevel, mzbxslide);
								} else {
									this.player.queueChord(this.audioContext, this.volumeNode, this.preset, when, pitches, duration, volumeLevel, mzbxslide);
								}
							}
						}
					}
				}
			}
		}
	}
	cancel(): void {
		this.player.cancelQueue(this.audioContext)
	}
	output(): AudioNode | null {
		if (this.volumeNode) {
			return this.volumeNode;
		} else {
			return null;
		}
	}
}
/*
class ZSUI {
	id: string = '';
	data: string = '';
	inslist: any;
	modelist: any;
	voluctrl: any;
	loud = 50;
	player: MM_WebAudioFontPlayer = new MM_WebAudioFontPlayer();
	init() {
		window.addEventListener('message', this.receiveHostMessage.bind(this), false);
		this.sendMessageToHost('');
		this.inslist = document.getElementById('inslist');
		this.modelist = document.getElementById('modelist');
		this.voluctrl = document.getElementById('voluctrl');
		let ins = this.player.loader.instrumentKeys();

		for (let ii = 0; ii < ins.length; ii++) {
			var option = document.createElement('option');
			option.value = '' + ii;
			let midi = parseInt(ins[ii].substring(0, 3));
			option.innerHTML = ins[ii] + ": " + this.player.loader.instrumentTitles()[midi];
			this.inslist.appendChild(option);
		}
		this.inslist.addEventListener('change', (event) => {
			//console.dir(this.player.loader.instrumentKeys()[1 * this.list.value]);
			this.send2State();
		});
		this.modelist.addEventListener('change', (event) => {
			this.send2State();
		});
		this.voluctrl.addEventListener('change', (event) => {
			this.send2State();
		});
	}

	send2State() {
		let mode = '';
		if (this.modelist.value == '1') {
			mode = 'pong';
		} else {
			if (this.modelist.value == '2') {
				mode = 'up';
			} else {
				if (this.modelist.value == '3') {
					mode = 'down';
				} else {
					if (this.modelist.value == '4') {
						mode = 'snap';
					} else {
						mode = 'plain';
					}
				}
			}
		}
		this.loud = this.voluctrl.value;
		this.sendMessageToHost('0/' + this.inslist.value + '/' + mode + '/' + this.loud);
	}

	sendMessageToHost(data: string) {
		var message: MZXBX_MessageToHost = { dialogID: this.id, pluginData: data, done: false };
		console.log('sendMessageToHost', message);
		window.parent.postMessage(message, '*');
	}
	receiveHostMessage(messageEvent: MessageEvent) {
		let message: MZXBX_MessageToPlugin = messageEvent.data;
		if (this.id) {
			this.setState(message.hostData);
		} else {
			this.setMessagingId(message.hostData);
		}
	}
	setMessagingId(newId: string) {
		this.id = newId;
	}
	setState(data: string) {
		console.log('setState', data);
		this.data = data;
		let split = this.data.split('/');
		if (split.length > 1 && split[1].trim().length > 0) {
			this.inslist.value = parseInt(split[1]);
		} else {
			this.inslist.value = this.player.loader.findInstrument(parseInt(split[0]));
		}
		this.modelist.value = 1;
		if (split.length > 2) {
			let mode = split[2];
			if (mode == 'pong') {
				this.modelist.value = 1;
			} else {
				if (mode == 'up') {
					this.modelist.value = 2;
				} else {
					if (mode == 'down') {
						this.modelist.value = 3;
					} else {
						if (mode == 'snap') {
							this.modelist.value = 4;
						} else {
							this.modelist.value = 0;
						}
					}
				}
			}
		}
		this.voluctrl.value = 50;
		if (split.length > 3) {
			if (split[3].length > 0) {
				this.loud = parseInt(split[3]);
				this.voluctrl.value = this.loud;
			}
		}
	}
}
*/
function newStrumPerformerImplementation(): MZXBX_AudioPerformerPlugin {
	return new StrumPerformerImplementation();
}

