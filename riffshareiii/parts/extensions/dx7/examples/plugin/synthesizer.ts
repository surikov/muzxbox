class DX7Synthesizer {
	cache: DX7Voice[] = [];
	audioContext: AudioContext;
	output: GainNode;
	constructor(audioContext: AudioContext) {
		this.audioContext = audioContext;
		this.output = this.audioContext.createGain();
	}
	checkCache() {
		if (this.cache.length > 25) {
			for (let ii = 0; ii < this.cache.length; ii++) {
				if (this.cache[ii].locktime < this.audioContext.currentTime) {
					this.cache[ii].disonnectOperators();
					this.cache[ii].mixID = 0;
					//console.log('free',ii);
				}
			}
		}
	}
	takeVox(mid: number): DX7Voice {
		this.checkCache();
		for (let ii = 0; ii < this.cache.length; ii++) {
			if (this.cache[ii].locktime < this.audioContext.currentTime && mid == this.cache[ii].mixID) {
				//console.log('found vox', ii);
				return this.cache[ii];
			}
		}
		for (let ii = 0; ii < this.cache.length; ii++) {
			if (this.cache[ii].locktime < this.audioContext.currentTime && this.cache[ii].mixID == 0) {
				//console.log('reused vox', ii);
				this.cache[ii].mixID = mid;
				this.cache[ii].connectOperators()
				return this.cache[ii];
			}
		}
		//console.log('new vox', this.audioContext.currentTime, this.cache);
		let vx: DX7Voice = new DX7Voice(mid, this.audioContext, this.output);
		this.cache.push(vx);
		return vx;
	}
	scheduleStrum(preset: SynthPreset, when: number, pitches: number[], slides: MZXBX_SlideItem[]) {
		for (let ii = 0; ii < pitches.length; ii++) {
			let vox = this.takeVox(preset.mixID);
			vox.startPlayNote(preset, when, slides.reduce((sm, cur) => sm + cur.duration, 0), pitches[ii]);
		}
	}
}
