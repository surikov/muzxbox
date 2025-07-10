class VoiceDX7 {
	note: number;
	velocity: number;
	operator1: OperatorDX7;
	operator2: OperatorDX7;
	operator3: OperatorDX7;
	operator4: OperatorDX7;
	operator5: OperatorDX7;
	operator6: OperatorDX7;
	constructor(note: number, velocity: number) {
		console.log('new VoiceDX7', note, velocity);
		this.note = note;
		this.velocity = velocity;
		this.operator1 = new OperatorDX7();
		this.operator2 = new OperatorDX7();
		this.operator3 = new OperatorDX7();
		this.operator4 = new OperatorDX7();
		this.operator5 = new OperatorDX7();
		this.operator6 = new OperatorDX7();
	}
	/*test() {
		console.log('VoiceDX7 test');
	}*/
	frequencyFromNoteNumber(note: number) {
		return 440 * Math.pow(2, (note - 69) / 12);
	};
}