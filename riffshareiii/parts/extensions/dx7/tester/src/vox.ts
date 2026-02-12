class VoiceDX7 {
	//note: number;
	//velocity: number;
	operators: OperatorDX7[];
	//algorithm: ConnectionSchemeDX7;
	voxoutput: GainNode;
	voContext: AudioContext;
	constructor(destination: AudioNode, aContext: AudioContext) {
		console.log('new VoiceDX7');
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

		this.operators[0].onNotOff = true;
		this.operators[0].outDestination = destination;

		this.operators[1].onNotOff = true;
		this.operators[1].freqRatio = 1.5;
		this.operators[1].outDestination = destination;

	}
	startPlayNote(when: number, duration: number, pitch: number) {
		console.log('startPlayNote', when, pitch);
		for (let ii = 0; ii < this.operators.length; ii++) {
			this.operators[ii].startOperator(when, duration, pitch);
		}
	}
	/*test() {
		console.log('VoiceDX7 test');
	}*/

	connectOperators(scheme: ConnectionSchemeDX7) {
		//for (let ii = 0; ii < scheme.outputMix.length; ii++) {
		//	this.operators[scheme.outputMix[ii]].setupCarrier();
		//}
		/*for (let ii = 0; ii < this.operators.length; ii++) {
			this.operators[scheme.outputMix[ii]].setupModulator();
		}*/
	}

}