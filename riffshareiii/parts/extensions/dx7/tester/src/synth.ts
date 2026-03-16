class SynthDX7 {
	audioContext: AudioContext;
	output: GainNode;
	//testVox: VoiceDX7 | null = null;
	constructor(audioContext: AudioContext) {
		console.log('new SynthDX7');
		this.audioContext = audioContext;
		this.output = this.audioContext.createGain();
		this.output.connect(this.audioContext.destination);
	}
	/*createVoice(): VoiceDX7 {
		return new VoiceDX7();
	}*/
	test() {
		console.log('SynthDX7 test');
		let testVox: VoiceDX7 = new VoiceDX7(this.output, this.audioContext);
		testVox.setupVoice(epiano1preset);
		testVox.startPlayNote(this.audioContext.currentTime + 0.54321, 2, 12 * 5);
	}
}
