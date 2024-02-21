class MixerDataMath {
	data: MZXBX_Project;
	titleHeight: number = 33;
	LeftPad: number = 3;
	rightPad: number = 10;
	bottomMixerPad = 11;
	notePathHeight = 1;
	widthDurationRatio = 27;
	octaveCount = 10;
	sequencerBottomPad = 2;

	constructor(data: MZXBX_Project) {
		this.data = data;
	}
	mixerWidth(): number {
		return this.LeftPad + this.timelineWidth() + this.rightPad;
	}
	timelineWidth(): number {
		let mm: MZXBX_MetreMathType = MZMM();
		let ww = 0;
		for (let ii = 0; ii < this.data.timeline.length; ii++) {
			ww = ww + mm.set(this.data.timeline[ii].metre).duration(this.data.timeline[ii].tempo) * this.widthDurationRatio;
		}
		return ww;
	}
	mixerHeight(): number {
		return this.titleHeight
			+ this.gridHeight()
			+ this.sequencerBottomPad
			+ this.data.percussions.length * this.notePathHeight
			+ this.bottomMixerPad;
	}
	gridTop(): number {
		return this.titleHeight;
	}
	samplerTop(): number {
		return this.gridTop() + this.gridHeight() + this.sequencerBottomPad;
	}

	gridHeight(): number {
		return this.notePathHeight * this.octaveCount * 12;
	}
}