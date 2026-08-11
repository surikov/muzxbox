class TR808Synth implements MZXBX_AudioSamplerPlugin {
	audioContext: AudioContext;
	drumOutput: GainNode;
	drumsCache: DrumCache[] = [];
	parameters: BoomParameters;
	currentDuration = 0;
	takeEngine(kind: number): DrumCache {
		for (let ii = 0; ii < this.drumsCache.length; ii++) {
			if (this.drumsCache[ii].kind == kind && this.drumsCache[ii].drum.endTime() < this.audioContext.currentTime) {
				return this.drumsCache[ii];
			}
		}
		let drum = new VoiceKick(this.audioContext, kind);
		drum.output().connect(this.drumOutput);
		let cache: DrumCache = { kind: kind, drum: drum };
		this.drumsCache.push(cache);
		return cache;
	}
	launch(context: AudioContext, parameters: string): number {
		this.audioContext = context;
		this.drumOutput = this.audioContext.createGain();
		if (parameters) {
			let parsed = JSON.parse(parameters);
			this.parameters = parsed;
		} else {
			this.parameters = {
				volume: 100
				, ratio: 1
				, nn: 0
			};
		}
		this.takeEngine(this.parameters.nn);
		return 0;
	}
	busy(): null | string {
		return null;
	}
	start(when: number, tempo: number): void {
		let drum = this.takeEngine(this.parameters.nn);
		this.currentDuration = drum.drum.duration();
		drum.drum.start(when, this.parameters.ratio, this.parameters.nn);
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
		/*if (this.currentDuration > 1) {
			return 1;
		} else {
			return this.currentDuration;
		}*/
		return this.currentDuration;
	}
}	