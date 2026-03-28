class VoiceDX7 {

	beeps: BeepDX7[];
	voxoutput: GainNode;
	voContext: AudioContext;
	constructor(destination: AudioNode, aContext: AudioContext) {
		this.voContext = aContext;
		this.voxoutput = this.voContext.createGain();
		this.voxoutput.connect(destination);
		this.beeps = [];
		this.beeps[0] = new BeepDX7(this.voContext);
		this.beeps[1] = new BeepDX7(this.voContext);
		this.beeps[2] = new BeepDX7(this.voContext);
		this.beeps[3] = new BeepDX7(this.voContext);
		this.beeps[4] = new BeepDX7(this.voContext);
		this.beeps[5] = new BeepDX7(this.voContext);
	}
	setupVoice(presetData: DX7PresetData) {
		console.log('setupVoice', presetData);
		let algIdx = presetData.algorithm - 1;
		let scheme: ConnectionSchemeDX7 = matrixConnectionAlgorithmsDX7[algIdx];
		this.connectMixOperators(scheme);
		for (let ii = 0; ii < 6; ii++) {
			if (presetData.operators[ii].enabled) {
				this.beeps[ii].setupOperator(presetData.operators[ii],presetData.feedback);
			}
		}
	}
	startPlayNote(when: number, duration: number, note: number) {
		console.log('startPlayNote', when, 'duration', duration, 'note', note, 'now time', this.voContext.currentTime);
		for (let ii = 0; ii < this.beeps.length; ii++) {
			if (this.beeps[ii].ready) {
				this.beeps[ii].startOperator(when, duration, note);
			} else {
				console.log('operator', (1 + ii), 'skip');
			}
		}

		
	}
	connectMixOperators(scheme: ConnectionSchemeDX7) {
		for (let ii = 0; ii < scheme.outputMix.length; ii++) {
			let outIdx = scheme.outputMix[ii];
			this.beeps[outIdx].connectToOutputNode(this.voxoutput);
			console.log('' + (1 + outIdx) + ' -> out');
		}
		for (let ii = 0; ii < scheme.modulationMatrix.length; ii++) {
			let carrier = this.beeps[ii];
			let modulators = scheme.modulationMatrix[ii];
			for (let mm = 0; mm < modulators.length; mm++) {
				let modulatorIdx = modulators[mm];
				if (modulatorIdx == ii) {
					this.beeps[modulatorIdx].connectToSelf();
				} else {
					this.beeps[modulatorIdx].connectToCarrier(carrier);
				}
				console.log('' + (modulatorIdx + 1) + ' -> ' + (ii + 1));
			}
		}
	}

}