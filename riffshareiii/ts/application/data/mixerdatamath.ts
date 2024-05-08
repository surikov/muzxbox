class MixerDataMath {
	data: Zvoog_Project;
	//projTitleHeight: number = 33;
	LeftPad: number = 3;
	rightPad: number = 10;
	bottomMixerPad = 11;
	notePathHeight = 1;
	widthDurationRatio = 27;
	octaveCount = 10;
	samplerBottomPad = 1;
	titleBottomPad = 1;
	gridBottomPad = 1;
	//commentsMaxHeight = 10;

	constructor(data: Zvoog_Project) {
		this.data = data;
	}
	mixerWidth(): number {
		return this.LeftPad + this.timelineWidth() + this.rightPad;
	}
	heightOfTitle(): number {
		return 0;
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
		return this.commentsTop()
			+ this.commentsMaxHeight()
			+ this.bottomMixerPad;
	}
	commentsMaxHeight(): number {
		//let ratio = 2;
		let mx = 1;

		for (let ii = 0; ii < this.data.comments.length; ii++) {

			let placedX: number[] = [];
			let txts = this.data.comments[ii].texts;
			//console.log('commentsMaxHeight',ii,mx);
			for (let tt = 0; tt < txts.length; tt++) {
				//let skipS = MMUtil().set(txts[tt].skip).duration(this.data.timeline[tt].tempo);
				let skipS = 0.5 * Math.round(MMUtil().set(txts[tt].skip).duration(this.data.timeline[ii].tempo) / 0.5);
				for (let kk = 0; kk < placedX.length; kk++) {
					//if (Math.abs(skipS - placedX[kk]) < 0.3) {
					if (skipS == placedX[kk]) {
						mx++;
					}
				}
				placedX.push(skipS);

			}
		}

		return mx * this.notePathHeight;
	}

	commentsTop(): number {
		return this.gridTop()
			+ this.gridHeight()
			+ this.gridBottomPad;
	}
	gridTop(): number {
		/*
		return this.heightOfTitle()
			+ this.titleBottomPad
			+ this.samplerHeight()
			+ this.samplerBottomPad;
			*/
		return this.samplerTop() + this.samplerHeight() + this.samplerBottomPad;
	}


	gridHeight(): number {
		return this.notePathHeight * this.octaveCount * 12;
	}
	samplerHeight(): number {
		return this.data.percussions.length * this.notePathHeight;
	}
	samplerTop(): number {
		//return this.gridTop() + this.gridHeight() + this.sequencerBottomPad;
		return this.heightOfTitle() + this.titleBottomPad;
	}
}