class SynthDX7 {
	moContext: AudioContext;
	output: GainNode;
	constructor(audioContext: AudioContext) {
		console.log('new SynthDX7');
		this.moContext = audioContext;
	}
	/*createVoice(): VoiceDX7 {
		return new VoiceDX7();
	}*/
	test() {
		console.log('SynthDX7 test');
		let voice = new VoiceDX7(60, 1);
		//voice.test();
	}
}
