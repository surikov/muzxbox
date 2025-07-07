console.log('Percussion Plugin v1.0.1');
class PercussionDrumKitImplementation implements MZXBX_AudioSamplerPlugin {
	audioContext: AudioContext;
	player: PercussionWebAudioFontPlayer = new PercussionWebAudioFontPlayer();
	volumeNode: GainNode;
	loader: PercussionWebAudioFontLoader = new PercussionWebAudioFontLoader();
	info: PercussionPresetInfo;
	preset: PercussionWavePreset | null = null;
	sampleDuration = 0.000001;
	loudness = 0.9;
	preidx = -1;
	launch(context: AudioContext, parameters: string): void {
		if (this.audioContext) {
			//
		} else {
			this.preset = null;
			this.audioContext = context;
			this.volumeNode = this.audioContext.createGain();
		}
		let idx = 0;
		try {
			let split = parameters.split('/');
			let volume = parseInt(split[0]);
			idx = parseInt(split[1]);
			this.loudness = volume / 100;
		} catch (xx) {
			console.log(xx);
		}
		this.volumeNode.gain.setValueAtTime(this.loudness, 0);
		if ((this.preset) && this.preidx == idx) {
			//
		} else {
			this.info = this.loader.drumInfo(idx);
			this.loader.startLoad(context, this.info.url, this.info.variable);
			this.loader.waitLoad(() => {
				this.preset = window[this.info.variable];
			});
		}
		this.preidx = idx;
	}
	busy(): null | string {
		if (this.preset == null) {
			return 'empty preset';
		} else {
			if (!this.loader.loaded(this.info.variable)) {
				return 'no ' + this.info.variable;
			} else {
				if (this.preset) {
					if (this.preset.zones.length > 0) {
						if (this.preset.zones[0].buffer) {
							this.sampleDuration = this.preset.zones[0].buffer.duration;
						}
					}
				}
				return null;
			}
		}
	}
	start(when: number, tempo) {
		if (this.audioContext) {
			if (this.volumeNode) {
				if (this.preset) {
					when = when + Math.random() * 1 / tempo;
					let rlevel = 1 + 0.15 * Math.random();
					this.player.queueWaveTable(this.audioContext, this.volumeNode, this.preset, when, this.info.pitch, this.sampleDuration + 0.001, rlevel);
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
	duration(): number {
		return this.sampleDuration;
	}

}

function newBasePercussionPlugin(): MZXBX_AudioSamplerPlugin {
	return new PercussionDrumKitImplementation();
}
