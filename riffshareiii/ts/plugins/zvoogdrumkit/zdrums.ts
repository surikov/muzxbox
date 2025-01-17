console.log('ZvoogDrumKit v1.0');
class ZvoogDrumKitImplementation implements MZXBX_AudioSamplerPlugin {
	audioContext: AudioContext;
	player: ZDRWebAudioFontPlayer = new ZDRWebAudioFontPlayer();
	volume: GainNode;
	loader: ZDRWebAudioFontLoader = new ZDRWebAudioFontLoader();
	midinumber: number = 0;
	info: ZDRPresetInfo;
	preset: ZDRWavePreset | null = null;
	launch(context: AudioContext, parameters: string): void {
		this.preset = null;
		this.audioContext = context;
		this.volume = this.audioContext.createGain();
		this.volume.gain.setValueAtTime(0.7, 0);
		this.midinumber = parseInt(parameters);
		let idx = this.loader.findDrum(this.midinumber);
		this.info = this.loader.drumInfo(idx);
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
	schedule(when: number) {
		if (this.audioContext) {
			if (this.volume) {
				if (this.preset) {
					this.player.queueWaveTable(this.audioContext, this.volume, this.preset, when, this.info.pitch, 1, 0.9);
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
	duration(): number {
		if (this.preset) {
			if (this.preset.zones.length > 0) {
				if (this.preset.zones[0].buffer) {
					return this.preset.zones[0].buffer.duration;
				}
			}
		}
		return 1;
	}

}
function newZvoogDrumKitImplementation(): MZXBX_AudioSamplerPlugin {
	return new ZvoogDrumKitImplementation();
}
