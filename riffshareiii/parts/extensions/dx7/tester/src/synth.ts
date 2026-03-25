class SynthDX7 {
	audioContext: AudioContext;
	output: GainNode;
	constructor(audioContext: AudioContext) {
		console.log('new SynthDX7');
		this.audioContext = audioContext;
		this.output = this.audioContext.createGain();
		this.output.connect(this.audioContext.destination);

		
	}
	scheduleStrum(preset: DX7PresetData, when: number, pitches: number[],  slides: MZXBX_SlideItem[]) {
		console.log('SynthDX7 schedule');

		

		let testVox: VoiceDX7 = new VoiceDX7(this.output, this.audioContext);
		testVox.setupVoice(preset);
		testVox.startPlayNote(when, slides.reduce((sm, cur) => sm + cur.duration, 0), pitches[0]);
	}
}
