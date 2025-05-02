console.log('Percussion Plugin v1.0.1');
class PercussionDrumKitImplementation implements MZXBX_AudioSamplerPlugin {
	audioContext: AudioContext;
	player: PercussionWebAudioFontPlayer = new PercussionWebAudioFontPlayer();
	volumeNode: GainNode;
	loader: PercussionWebAudioFontLoader = new PercussionWebAudioFontLoader();
	//midinumber: number = 0;
	//midiidx: number = 0;
	//listidx: number = -1;
	info: PercussionPresetInfo;
	preset: PercussionWavePreset | null = null;
	sampleDuration = 0.000001;
	loudness = 0.9;
	launch(context: AudioContext, parameters: string): void {
		this.preset = null;
		this.audioContext = context;
		this.volumeNode = this.audioContext.createGain();
		//this.volumeNode.gain.setValueAtTime(0.99, 0);
		//this.midinumber = parseInt(parameters);

		//console.log('parameters',parameters);
		/*let split = parameters.split('/');
		let idx = 0;
		if (split.length>1 && split[1].length>0) {
			let listidx = parseInt(split[1]);
			idx = listidx;
			//console.log('from list',idx);
		} else {
			let midiidx = parseInt(parameters);
			idx = this.loader.findDrum(midiidx);
			//console.log('from midi',idx);
		}
		if (split.length > 2) {
			if (split[2].length > 0) {
				this.loudness = 0.01 * (0.0 + parseInt(split[2]));
			}
		}*/
		let idx=0;
		try {
			let split = parameters.split('/');
			let volume = parseInt(split[0]);
			idx = parseInt(split[1]);
			
			this.loudness=volume/100;

		} catch (xx) {
			console.log(xx);
		}
		this.volumeNode.gain.setValueAtTime(this.loudness, 0);
		//let idx = this.loader.findDrum(this.midinumber);
		this.info = this.loader.drumInfo(idx);
		//console.log('info',this.info);
		this.loader.startLoad(context, this.info.url, this.info.variable);
		this.loader.waitLoad(() => {
			this.preset = window[this.info.variable];
			//console.log('preset',this.preset,this.info);
		});
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
