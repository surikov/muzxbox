class VoiceDX7 {
	constructor() {
		console.log('new VoiceDX7');
	}
	test() {
		console.log('VoiceDX7 test');
	}
	frequencyFromNoteNumber(note: number) {
		return 440 * Math.pow(2, (note - 69) / 12);
	};
}