class SynthDX7 {
	moContext: AudioContext;
	output: GainNode;
	testVox: VoiceDX7 | null = null;
	constructor(audioContext: AudioContext) {
		console.log('new SynthDX7');
		this.moContext = audioContext;
		this.output = this.moContext.createGain();
		this.output.connect(this.moContext.destination);
	}
	/*createVoice(): VoiceDX7 {
		return new VoiceDX7();
	}*/
	test() {
		console.log('SynthDX7 test');
		if (this.testVox == null) {
			this.testVox = new VoiceDX7(this.output, this.moContext);
		}
		this.testVox.startPlayNote(this.moContext.currentTime + 1, 4, 12*5);
	}
}
