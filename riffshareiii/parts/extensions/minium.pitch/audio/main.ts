console.log('Pitch/Chord v1.0');
class StrumPerformerImplementation implements MZXBX_AudioPerformerPlugin {
	audioContext: AudioContext;
	player: MM_WebAudioFontPlayer = new MM_WebAudioFontPlayer();
	outputVolume: GainNode;
	loader: MM_WebAudioFontLoader = new MM_WebAudioFontLoader(this.player);

	listidx: number = 0;
	info: MMPresetInfo;
	preset: MMWavePreset | null = null;
	loudness = 0.5;
	up = false;

	strumModeFlat: 0 = 0;
	strumModeDown: 1 = 1;
	strumModeUp: 2 = 2;
	strumModeSnap: 3 = 3;
	strumModePong: 4 = 4;
	strumMode: 0 | 1 | 2 | 3 | 4 = this.strumModeFlat;	//Flat / Down / Up / Snap / Pong
	util: ChordPitchPerformerUtil = new ChordPitchPerformerUtil();
	constructor() {
		//
	}
	launch(context: AudioContext, parameters: string): void {
		this.parseParametersData(parameters);
		if (this.audioContext) {

		} else {
			this.preset = null;
			this.audioContext = context;
			this.outputVolume = this.audioContext.createGain();
			//this.outputVolume.connect(this.audioContext.destination);
			//this.parseParametersData(parameters);


		}
		this.outputVolume.gain.setValueAtTime(this.loudness / 100, this.audioContext.currentTime + 0.00001);
		//this.volumeNode.gain.value=this.loudness;
		//console.log('StrumPerformerImplementation launch loudness', this.loudness, this.outputVolume.gain.value);
		if (this.preset) {
			//
		} else {
			this.info = this.loader.instrumentInfo(this.listidx);

			this.loader.startLoad(context, this.info.url, this.info.variable);

			this.loader.waitLoad(() => {
				this.preset = window[this.info.variable];

			});
		}
	}
	parseParametersData(parameters: string) {
		let parsed = this.util.checkParameters(parameters);
		this.loudness = parsed.loudness;
		this.listidx = parsed.idx;
		this.strumMode = parsed.mode;
		/*
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
		
		
				} catch (xx) {
					console.log(xx);
					this.loudness = 0.5;
					this.listidx = 0;
					this.strumMode = 0;
				}
				this.outputVolume.gain.setValueAtTime(this.loudness, this.audioContext.currentTime + 0.00001);
				console.log('parseParameter', parameters, this.loudness, this.listidx, this.strumMode);
				*/
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
			if (this.outputVolume) {
				if (this.preset) {
console.log('',this.loudness,this.strumMode,zpitches,whenStart);

					let duration = 0;

					let volumeLevel = 0.95 + 0.05 * Math.random();
					let when = whenStart + Math.random() * 1 / tempo;

					for (let ii = 0; ii < mzbxslide.length; ii++) {
						let one = mzbxslide[ii];
						duration = duration + one.duration;

					}
					let pitches: number[] = [];
					for (let ii = 0; ii < zpitches.length; ii++) {
						pitches.push(zpitches[ii] + 0);
					}

					if (this.strumMode == this.strumModePong) {
						if (this.up) {
							this.player.queueStrumDown(this.audioContext, this.outputVolume, this.preset, when, tempo, pitches, duration, volumeLevel, mzbxslide);
						} else {
							this.player.queueStrumUp(this.audioContext, this.outputVolume, this.preset, when, tempo, pitches, duration, volumeLevel, mzbxslide);
						}
						this.up = !this.up;
					} else {
						if (this.strumMode == this.strumModeDown) {
							this.player.queueStrumDown(this.audioContext, this.outputVolume, this.preset, when, tempo, pitches, duration, volumeLevel, mzbxslide);
						} else {
							if (this.strumMode == this.strumModeUp) {
								this.player.queueStrumUp(this.audioContext, this.outputVolume, this.preset, when, tempo, pitches, duration, volumeLevel, mzbxslide);
							} else {
								if (this.strumMode == this.strumModeSnap) {
									this.player.queueSnap(this.audioContext, this.outputVolume, this.preset, when, tempo, pitches, duration, volumeLevel, mzbxslide);
								} else {
									this.player.queueChord(this.audioContext, this.outputVolume, this.preset, when, pitches, duration, volumeLevel, mzbxslide);
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
		//console.log('outputVolume', this.outputVolume);
		if (this.outputVolume) {
			//console.log('gain', this.outputVolume.gain.value);
			return this.outputVolume;
		} else {
			return null;
		}
	}
}

function newStrumPerformerImplementation(): MZXBX_AudioPerformerPlugin {
	//console.log('newStrumPerformerImplementation');
	return new StrumPerformerImplementation();
}

