class TR808Synth implements MZXBX_AudioSamplerPlugin {
	audioContext: AudioContext;
	drumOutput: GainNode;
	drumsCache: DrumCacheItem[] = [];
	parameters: BoomParameters;
	currentDuration = 0;
	takeEngine(kind: number): DrumCacheItem {
		for (let ii = 0; ii < this.drumsCache.length; ii++) {
			if (this.drumsCache[ii].kind == kind && this.drumsCache[ii].drum.endTime() < this.audioContext.currentTime) {
				//console.log('reuse',ii);
				return this.drumsCache[ii];
			}
		}
		//console.log('takeEngine',kind);
		let drum: BoomDrum;
		if (kind < 8) {
			drum = new VoiceKick(this.audioContext, kind);
		} else {
			if (kind < 12) {
				drum = new VoiceSnare(this.audioContext, kind - 8);
			} else {
				if (kind < 16) {
					drum = new VoiceClap(this.audioContext, kind - 12);
				} else {
					if (kind < 24) {
						drum = new VoiceHat(this.audioContext, kind - 16);
					} else {
						if (kind < 28) {
							drum = new VoiceBell(this.audioContext, kind - 24);
						} else {
							drum = new VoiceKick(this.audioContext, 0);
						}
					}
				}
			}
		}
		drum.output().connect(this.drumOutput);
		let cache: DrumCacheItem = { kind: kind, drum: drum };
		this.drumsCache.push(cache);
		return cache;

	}
	launch(context: AudioContext, parameters: string): number {
		//console.log('launch',parameters);
		if (this.audioContext) {
			//
		} else {
			this.audioContext = context;
			this.drumOutput = this.audioContext.createGain();
		}
		if (parameters) {
			let parsed = JSON.parse(parameters);
			this.parameters = parsed;
		} else {
			this.parameters = {
				volume: 70
				, ratio: 1
				, nn: 0
			};
		}
		let boom = this.takeEngine(this.parameters.nn);
		this.currentDuration = boom.drum.duration();
		return 0;
	}
	busy(): null | string {
		return null;
	}
	start(when: number, tempo: number): void {
		let boom = this.takeEngine(this.parameters.nn);
		boom.drum.start(when, 1 + this.parameters.ratio / 10, this.parameters.volume / 100);
	}
	cancel(): void {
		for (let ii = 0; ii < this.drumsCache.length; ii++) {
			this.drumsCache[ii].drum.cancel();
		}
	};
	output(): AudioNode | null {
		return this.drumOutput;
	}
	duration(): number {
		return this.currentDuration;
	}
}	