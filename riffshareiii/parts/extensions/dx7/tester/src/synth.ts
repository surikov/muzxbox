class SynthDX7 {
	audioContext: AudioContext;
	output: GainNode;
	//preset: DX7PresetData;
	cache: VoiceDX7[] = [];
	constructor(audioContext: AudioContext) {
		console.log('new SynthDX7');
		this.audioContext = audioContext;
		this.output = this.audioContext.createGain();
		this.output.connect(this.audioContext.destination);


	}
	/*resetPreset(newpreset: DX7PresetData) {
		this.preset = newpreset;
	}*/
	takeVox(): VoiceDX7 {
		for (let ii = 0; ii < this.cache.length; ii++) {
			if (this.cache[ii].locktime < this.audioContext.currentTime) {
				console.log('found vox', ii);
				return this.cache[ii];
			}
		}
		console.log('new vox', this.cache.length + 1);
		let vx: VoiceDX7 = new VoiceDX7(this.output, this.audioContext);
		this.cache.push(vx);
		return vx;
	}
	scheduleStrum(preset: DX7PresetData,when: number, pitches: number[], slides: MZXBX_SlideItem[]) {
		//console.log('SynthDX7 schedule');
		if (this.audioContext.state === "suspended") {
			this.audioContext.resume();
		}

		let testVox = this.takeVox();
		testVox.setupVoice(preset);
		testVox.startPlayNote(when, slides.reduce((sm, cur) => sm + cur.duration, 0), pitches[0]);
	}
}
