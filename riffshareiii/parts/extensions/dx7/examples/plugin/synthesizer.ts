class DX7Synthesizer {
	cache: DX7Voice[] = [];
	audioContext: AudioContext;
	output: GainNode;
	constructor(audioContext: AudioContext) {
		this.audioContext = audioContext;
		this.output = this.audioContext.createGain();
	}
	takeVox(mixID: number): DX7Voice {
		for (let ii = 0; ii < this.cache.length; ii++) {
			if (this.cache[ii].locktime < this.audioContext.currentTime && mixID == this.cache[ii].mixID) {
				//console.log('found vox', ii);
				return this.cache[ii];
			}
		}
		//console.log('new vox', this.audioContext.currentTime, this.cache);
		let vx: DX7Voice = new DX7Voice(mixID, this.audioContext, this.output);
		this.cache.push(vx);
		return vx;
	}
	scheduleStrum(preset: SynthPreset, when: number, pitches: number[], slides: MZXBX_SlideItem[]) {
		let vox = this.takeVox(preset.mixID);
		vox.startPlayNote(preset, when, slides.reduce((sm, cur) => sm + cur.duration, 0), pitches[0]);
	}
}
