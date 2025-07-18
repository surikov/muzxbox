class VoiceDX7 {
	note: number;
	velocity: number;
	operators: OperatorDX7[];
	//algorithm: ConnectionSchemeDX7;
	constructor(note: number, velocity: number) {
		console.log('new VoiceDX7', note, velocity);
		this.note = note;
		this.velocity = velocity;
		this.operators[0] = new OperatorDX7();
		this.operators[1] = new OperatorDX7();
		this.operators[2] = new OperatorDX7();
		this.operators[3] = new OperatorDX7();
		this.operators[4] = new OperatorDX7();
		this.operators[5] = new OperatorDX7();
		let scheme: ConnectionSchemeDX7 = matrixAlgorithmsDX7[3];
		this.connectOperators(scheme);
	}
	/*test() {
		console.log('VoiceDX7 test');
	}*/
	frequencyFromNoteNumber(note: number) {
		return 440 * Math.pow(2, (note - 69) / 12);
	};
	connectOperators(scheme: ConnectionSchemeDX7) {
		for (let ii = 0; ii < scheme.outputMix.length; ii++) {
			this.operators[scheme.outputMix[ii]].setupCarrier();
		}
		/*for (let ii = 0; ii < this.operators.length; ii++) {
			this.operators[scheme.outputMix[ii]].setupModulator();
		}*/
	}
	start() {
		console.log('voice start');

	}
}