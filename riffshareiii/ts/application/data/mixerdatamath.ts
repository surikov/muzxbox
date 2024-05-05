class MixerDataMath {
	data: Zvoog_Project;
	projTitleHeight: number = 33;
	LeftPad: number = 3;
	rightPad: number = 10;
	bottomMixerPad = 11;
	notePathHeight = 1;
	widthDurationRatio = 27;
	octaveCount = 10;
	samplerBottomPad = 1;
	titleBottomPad = 1;
	gridBottomPad = 3;
	commentsHeight = 10;

	constructor(data: Zvoog_Project) {
		this.data = data;
	}
	mixerWidth(): number {
		return this.LeftPad + this.timelineWidth() + this.rightPad;
	}
	heightOfTitle(): number {
		return this.projTitleHeight;
	}
	timelineWidth(): number {
		let mm: Zvoog_MetreMathType = MMUtil();
		let ww = 0;
		for (let ii = 0; ii < this.data.timeline.length; ii++) {
			ww = ww + mm.set(this.data.timeline[ii].metre).duration(this.data.timeline[ii].tempo) * this.widthDurationRatio;
		}
		return ww;
	}
	mixerHeight(): number {
		return this.heightOfTitle()
			+ this.samplerHeight()
			+ this.samplerBottomPad
			+ this.gridHeight()
			//data.percussions.length * this.notePathHeight
			+this.gridBottomPad
			+this.commentsHeight
			+ this.bottomMixerPad;
	}
	commentsTop():number{
		return this.heightOfTitle()
			+ this.samplerHeight()
			+ this.samplerBottomPad
			+ this.gridHeight()
			//data.percussions.length * this.notePathHeight
			+this.gridBottomPad;
	}
	gridTop(): number {
		return this.heightOfTitle()+this.titleBottomPad + this.samplerHeight() + this.samplerBottomPad;
	}
	samplerTop(): number {
		//return this.gridTop() + this.gridHeight() + this.sequencerBottomPad;
		return this.heightOfTitle()+this.titleBottomPad;
	}

	gridHeight(): number {
		return this.notePathHeight * this.octaveCount * 12;
	}
	samplerHeight(): number {
		return this.data.percussions.length * this.notePathHeight;
	}
}