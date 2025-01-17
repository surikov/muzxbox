console.log('zvoog defaulet performer v1.0');
class ZvoogBasePerformerImplementation implements MZXBX_AudioPerformerPlugin {
	audioContext: AudioContext;
	player: ZPWebAudioFontPlayer = new ZPWebAudioFontPlayer();
	volume: GainNode;
	loader: ZPWebAudioFontLoader = new ZPWebAudioFontLoader(this.player);
	midinumber: number = 0;
	info: ZPPresetInfo;
	preset: ZPWavePreset | null = null;
	launch(context: AudioContext, parameters: string): void {
		this.preset = null;
		this.audioContext = context;
		this.volume = this.audioContext.createGain();
		this.volume.gain.setValueAtTime(0.7, 0);
		this.midinumber = parseInt(parameters);
		let idx = this.loader.findInstrument(this.midinumber);
		this.info = this.loader.instrumentInfo(idx);
		this.loader.startLoad(context, this.info.url, this.info.variable);
		this.loader.waitLoad(() => {
			this.preset = window[this.info.variable];
			//console.log('preset',this.preset,this.info);
		});
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
	schedule(when: number, zpitches: number[], tempo: number, mzbxslide: MZXBX_SlideItem[]): void {
		if (this.audioContext) {
			if (this.volume) {
				if (this.preset) {
					let duration = 0;
					let volume = 1;
					let slides: ZPWaveSlide[][] = [];
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
						pitches.push(zpitches[ii] + 36);
					}
					//console.log(duration, zpitches, mzbxslide);
					this.player.queueChord(this.audioContext, this.volume, this.preset, when, pitches, duration, volume, mzbxslide);
				}
			}
		}
	}
	cancel(): void {
		this.player.cancelQueue(this.audioContext)
	}
	output(): AudioNode | null {
		if (this.volume) {
			return this.volume;
		} else {
			return null;
		}
	}
}
function newZvoogBasePerformerImplementation(): MZXBX_AudioPerformerPlugin {
	return new ZvoogBasePerformerImplementation();
}
