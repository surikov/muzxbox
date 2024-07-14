class MixerDataMathUtility {
	data: Zvoog_Project;

	leftPad: number = 3;
	rightPad: number = 10;
	bottomPad = 11;
	topPad = 2;

	notePathHeight = 1;
	widthDurationRatio = 27;
	octaveCount = 10;


	titleBottomPad = 5;
	automationBottomPad = 1;
	samplerBottomPad = 1;
	gridBottomPad = 1;

	maxCommentRowCount = 0;
	maxAutomationsCount = 0;

	constructor(data: Zvoog_Project) {
		this.data = data;
		this.maxCommentRowCount = -1;
		for (let ii = 0; ii < this.data.comments.length; ii++) {
			let txts = this.data.comments[ii].points;
			for (let tt = 0; tt < txts.length; tt++) {
				if (this.maxCommentRowCount < txts[tt].row) {
					this.maxCommentRowCount = txts[tt].row;
				}
			}
		}
		this.maxAutomationsCount = 0;
		for (let ff = 0; ff < this.data.filters.length; ff++) {
			if (this.data.filters[ff].automation) {
				this.maxAutomationsCount++;
			}
		}
		//console.log();
	}
	extractDifference(from: Zvoog_Project): Object {
		return '';
	}
	mergeDifference(diff:Object) {

	}
	wholeWidth(): number {
		return this.leftPad + this.timelineWidth() + this.rightPad;
	}
	heightOfTitle(): number {
		return 10;
	}
	timelineWidth(): number {
		let mm: Zvoog_MetreMathType = MMUtil();
		let ww = 0;
		for (let ii = 0; ii < this.data.timeline.length; ii++) {
			ww = ww + mm.set(this.data.timeline[ii].metre).duration(this.data.timeline[ii].tempo) * this.widthDurationRatio;
		}
		return ww;
	}
	wholeHeight(): number {
		/*return this.commentsTop()
			+ this.commentsMaxHeight()
			+ this.bottomPad;*/
		return this.gridTop()
			+ this.gridHeight()
			+ this.bottomPad

			;
	}
	automationMaxHeight(): number {
		return this.maxAutomationsCount * this.notePathHeight * 2;
	}
	commentsMaxHeight(): number {
		return (2 + this.maxCommentRowCount) * this.notePathHeight * 8;
	}
	commentsAverageFillHeight(): number {
		let rcount = this.maxCommentRowCount;
		if (rcount > 3) {
			rcount = 3;
		}
		return (2 + rcount) * this.notePathHeight * 8;

	}
	automationTop(): number {
		return this.topPad + this.heightOfTitle() + this.titleBottomPad;
	}
	/*
		commentsTop(): number {
			return this.gridTop()
				+ this.gridHeight()
				+ this.gridBottomPad;
		}
		*/
	gridTop(): number {
		//return this.samplerTop() + this.samplerHeight() + this.samplerBottomPad;
		return this.topPad + this.heightOfTitle() + this.titleBottomPad;
	}


	gridHeight(): number {
		return this.notePathHeight * this.octaveCount * 12;
	}
	/*
	samplerHeight(): number {
		return this.data.percussions.length * this.notePathHeight;
	}
	samplerTop(): number {
		return this.automationTop() + this.automationMaxHeight() + this.automationBottomPad;
	}
	*/
}