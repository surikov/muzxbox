class SynthDX7 {
	audioContext: AudioContext;
	output: GainNode;
	preset: DX7PresetData;
	constructor(audioContext: AudioContext) {
		console.log('new SynthDX7');
		this.audioContext = audioContext;
		this.output = this.audioContext.createGain();
		this.output.connect(this.audioContext.destination);


	}
	resetPreset(newpreset: DX7PresetData) {
		this.preset = newpreset;
	}
	scheduleStrum(when: number, pitches: number[], slides: MZXBX_SlideItem[]) {
		console.log('SynthDX7 schedule');
		if (this.audioContext.state === "suspended") {
			this.audioContext.resume();
		}

		let testVox: VoiceDX7 = new VoiceDX7(this.output, this.audioContext);
		testVox.setupVoice(this.preset);
		testVox.startPlayNote(when, slides.reduce((sm, cur) => sm + cur.duration, 0), pitches[0]);
	}
}
