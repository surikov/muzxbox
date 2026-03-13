class VoiceDX7 {

	beeps: BeepDX7[];
	voxoutput: GainNode;
	voContext: AudioContext;
	//dx7voxData: DX7PresetData;// = epiano1preset;//defaultBrass1test;
	//presetData: DX7PresetData;
	constructor(destination: AudioNode, aContext: AudioContext) {
		//
		//console.log('new VoiceDX7', aContext.currentTime, 'algorithm', this.dx7voxData.algorithm, matrixAlgorithmsDX7[this.dx7voxData.algorithm - 1]);
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
		/*for (let ii = 0; ii < this.operators.length; ii++) {
			this.operators[ii].onNotOff = true;
		}*/
		//this.connectMixOperators(matrixAlgorithmsDX7[this.dx7voxData.algorithm - 1]);
	}
	setupVoice(presetData: DX7PresetData) {
		console.log('setupVoice', presetData);
		let algIdx = presetData.algorithm - 1;
		let scheme: ConnectionSchemeDX7 = matrixConnectionAlgorithmsDX7[algIdx];
		this.connectMixOperators(scheme);
		for (let ii = 0; ii < 6; ii++) {
			this.beeps[ii].setupOperator(presetData.operators[ii]);
		}
	}
	startPlayNote(when: number, duration: number, note: number) {
		console.log('startPlayNote', when, 'duration', duration, 'note', note, 'now time', this.voContext.currentTime);
		for (let ii = 0; ii < this.beeps.length; ii++) {
			/*let operadata = this.dx7voxData.operators[ii];
			if (operadata.enabled) {
				console.log('startOperator', ii, ('' + operadata.freqCoarse + '.' + operadata.freqFine + '/' + operadata.detune), ('' + operadata.volume + '%'));
				this.operators[ii].startOperator(
					operadata.levels[0], operadata.rates[0]
					, operadata.levels[1], operadata.rates[1]
					, operadata.levels[2], operadata.rates[2]
					, operadata.levels[3], operadata.rates[3]
					, when, duration, pitch
					, operadata.oscMode, operadata.freqCoarse, operadata.freqFine
					, operadata.detune
					, operadata.volume
				);
			}*/
			if(this.beeps[ii].off){
console.log('beep',ii,'skip');
			}else{
this.beeps[ii].startOperator(when, duration, note);
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
					this.beeps[modulatorIdx].connectToSelf
				} else {
					this.beeps[modulatorIdx].connectToCarrier(carrier);
				}
				console.log('' + (modulatorIdx + 1) + ' -> ' + (ii + 1));
			}
		}
	}

}