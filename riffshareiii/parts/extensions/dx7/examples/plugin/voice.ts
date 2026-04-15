class DX7Voice {
	operators: DX7Operator[];
	locktime: number = 0;
	audioContext: AudioContext;
	output: GainNode;
	constructor(audioContext: AudioContext, to: AudioNode) {
		this.audioContext = audioContext;
		this.output = this.audioContext.createGain();
		this.output.connect(to);
		this.output.gain.value = 0.125;
		this.operators = [
			new DX7Operator(this.audioContext)
			, new DX7Operator(this.audioContext)
			, new DX7Operator(this.audioContext)
			, new DX7Operator(this.audioContext)
			, new DX7Operator(this.audioContext)
			, new DX7Operator(this.audioContext)
		];
	}
	connectOperators(preset: SynthPreset) {
		for (let ii = 0; ii < 6; ii++) {
			this.operators[ii].output.disconnect();
		}
		for (let ii = 0; ii < preset.connectionsInfo.modulationMatrix.length; ii++) {
			let carrier = this.operators[ii];
			let modulatorIds = preset.connectionsInfo.modulationMatrix[ii];
			for (let mm = 0; mm < modulatorIds.length; mm++) {
				let id = modulatorIds[mm];
				if (id == ii) {
					this.operators[id].feedback.gain.value = preset.feedbackRatio;
					this.operators[id].output.connect(this.operators[id].feedback);
				} else {
					this.operators[id].output.connect(carrier.modulation);
				}
			}
			for (let ii = 0; ii < preset.connectionsInfo.outputMix.length; ii++) {
				let outIdx = preset.connectionsInfo.outputMix[ii];
				this.operators[outIdx].output.connect(this.output);
			}
		}
	}
	startPlayNote(preset: SynthPreset, when: number, duration: number, note: number) {
		for (let ii = 0; ii < 6; ii++) {
			if (preset.operators[ii].enabled) {
				let frequency = preset.operators[ii].constantFrequency;
				if (!(frequency)) {
					let noteFreq = 440 * Math.pow(2, (note - 69) / 12);
					let detuneRatio = Math.pow(Math.exp(Math.log(2) / 1024), preset.operators[ii].detune);
					frequency = noteFreq * detuneRatio * preset.operators[ii].frequencyRatio;
				}
				let time = this.operators[ii].startPlayFrequency(preset.operators[ii], when, duration, frequency);
				if (this.locktime < time) {
					this.locktime = time;
				}
				console.log(ii, 'startPlayFrequency', frequency);
			}
		}
		this.connectOperators(preset);
		console.log('startPlayNote', note, 'when', when, 'lock', this.locktime);
	}
}
