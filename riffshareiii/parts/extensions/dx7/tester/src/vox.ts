class VoiceDX7 {

	//note: number;
	//velocity: number;
	operators: OperatorDX7[];
	//algorithm: ConnectionSchemeDX7;
	voxoutput: GainNode;
	voContext: AudioContext;
	dx7voxData = epiano1preset;//defaultBrass1test;
	constructor(destination: AudioNode, aContext: AudioContext) {
		console.log('new VoiceDX7', aContext.currentTime);
		//this.note = note;
		//this.velocity = velocity;
		this.voContext = aContext;
		this.voxoutput = this.voContext.createGain();
		this.voxoutput.connect(destination);
		this.operators = [];
		this.operators[0] = new OperatorDX7(this.voContext);
		this.operators[1] = new OperatorDX7(this.voContext);
		this.operators[2] = new OperatorDX7(this.voContext);
		this.operators[3] = new OperatorDX7(this.voContext);
		this.operators[4] = new OperatorDX7(this.voContext);
		this.operators[5] = new OperatorDX7(this.voContext);
		//let scheme: ConnectionSchemeDX7 = matrixAlgorithmsDX7[3];
		//this.connectOperators(scheme);

		//this.operators[0].onNotOff = true;
		//this.operators[0].outDestination = destination;

		//this.operators[1].onNotOff = false;
		//this.operators[1].freqRatio = 1.5;
		//this.operators[1].outDestination = destination;
		for (let ii = 0; ii < this.operators.length; ii++) {
			this.operators[ii].onNotOff = true;
		}
		this.connectMixOperators(matrixAlgorithmsDX7[defaultBrass1test.algorithm]);
	}
	/*setupMix(algoIdx: number) {
		let info = matrixAlgorithmsDX7[algoIdx];

	}*/
	startPlayNote(when: number, duration: number, pitch: number) {
		console.log('startPlayNote', when, 'duration', duration, 'pitch', pitch, 'now time', this.voContext.currentTime);
		for (let ii = 0; ii < this.operators.length; ii++) {
			let operadata = this.dx7voxData.operators[ii];
			if (operadata.enabled) {
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
			}
		}
	}
	/*test() {
		console.log('VoiceDX7 test');
	}*/

	connectMixOperators(scheme: ConnectionSchemeDX7) {
		for (let ii = 0; ii < scheme.outputMix.length; ii++) {
			let outIdx = scheme.outputMix[ii];
			this.operators[outIdx].connectToOutputNode(this.voxoutput);
		}
		for (let ii = 0; ii < scheme.modulationMatrix.length; ii++) {
			let pars = scheme.modulationMatrix[ii];
			for (let pp = 0; pp < pars.length; pp++) {
				this.operators[pp].connectSendToOperator(this.operators[ii]);
			}
		}

	}

}