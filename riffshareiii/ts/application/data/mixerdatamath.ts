class MixerDataMathUtility {
	data: Zvoog_Project;

	leftPad: number = 3;
	rightPad: number = 50;

	topPad = 2;
	parTitleGrid = 5;
	padGrid2Sampler = 5;
	padSampler2Automation = 5;
	padAutomation2Comments = 5;
	bottomPad = 11;


	notePathHeight = 1.01;
	samplerDotHeight = 3;
	autoPointHeight = 4;
	//commentPointHeight = 9;

	widthDurationRatio = 27;
	octaveDrawCount = 8;
	octaveTransposeCount = -1;


	//titleBottomPad = 5;
	//automationBottomPad = 1;
	//samplerBottomPad = 1;
	//gridBottomPad = 1;

	maxCommentRowCount = 0;
	//maxAutomationsCount = 0;

	//pluginIconWidth = 17;
	//pluginIconHeight = 7;
	pluginIconSize = 3;
	speakerIconSize = 22;
	speakerIconPad = 44;

	padGridFan = 15;

	constructor(data: Zvoog_Project) {
		this.data = data;
		this.recalculateCommantMax();
		//this.recalculateAutoMax();
		//console.log();
	}
	/*recalculateAutoMax() {
		this.maxAutomationsCount = 0;
		for (let ff = 0; ff < this.data.filters.length; ff++) {
			if (this.data.filters[ff].automation) {
				this.maxAutomationsCount++;
			}
		}
	}*/
	recalculateCommantMax() {
		this.maxCommentRowCount = -1;
		for (let ii = 0; ii < this.data.comments.length; ii++) {
			let txts = this.data.comments[ii].points;
			for (let tt = 0; tt < txts.length; tt++) {
				if (this.maxCommentRowCount < txts[tt].row) {
					this.maxCommentRowCount = txts[tt].row;
				}
			}
		}
	}
	extractDifference(from: Zvoog_Project): Object {
		return '';
	}
	mergeDifference(diff: Object) {

	}
	wholeWidth(): number {
		return this.leftPad + this.timelineWidth() + this.padGridFan + this.fanWidth() + this.rightPad;
	}
	fanPluginIconSize(zidx: number) {
		return this.pluginIconSize * zoomPrefixLevelsCSS[zidx].iconRatio;
	}
	fanWidth(): number {
		let ww = 1;
		for (let tt = 0; tt < this.data.tracks.length; tt++) {
			let iconPosition = this.data.tracks[tt].performer.iconPosition;
			let pp: { x: number, y: number } = { x: 0, y: 0 };
			if (iconPosition) {
				pp = iconPosition;
			}
			if (ww < pp.x + this.pluginIconSize) {
				ww = pp.x + this.pluginIconSize;
			}
		}
		for (let tt = 0; tt < this.data.filters.length; tt++) {
			let iconPosition = this.data.filters[tt].iconPosition;
			let pp: { x: number, y: number } = { x: 0, y: 0 };
			if (iconPosition) {
				pp = iconPosition;
			}
			if (ww < pp.x + this.pluginIconSize) {
				ww = pp.x + this.pluginIconSize;
			}
		}
		for (let tt = 0; tt < this.data.percussions.length; tt++) {
			let iconPosition = this.data.percussions[tt].sampler.iconPosition;
			let pp: { x: number, y: number } = { x: 0, y: 0 };
			if (iconPosition) {
				pp = iconPosition;
			}
			if (ww < pp.x + this.pluginIconSize) {
				ww = pp.x + this.pluginIconSize;
			}
		}
		ww = ww + this.speakerIconPad + 7 * this.pluginIconSize;
		return ww;
	}
	/*
	findPluginSamplerIcon(x: number, y: number, z: number, xid: string): Zvoog_AudioSampler | null {
		let sz = this.fanPluginIconSize(z);
		for (let ii = 0; ii < this.data.percussions.length; ii++) {
			let plugin = this.data.percussions[ii].sampler;
			if (plugin.id != xid) {
				if (plugin.iconPosition) {
					if (Math.abs(x - plugin.iconPosition.x) < sz * 0.75) {
						if (Math.abs(y - plugin.iconPosition.y) < sz * 0.75) {
							//console.log(plugin.iconPosition, x, y, z);
							return plugin;
						}
					}
				}
			}
		}
		return null;
	}
	findPluginPerformerIcon(x: number, y: number, z: number, xid: string): Zvoog_AudioSequencer | null {
		let sz = this.fanPluginIconSize(z);
		for (let ii = 0; ii < this.data.tracks.length; ii++) {
			let plugin = this.data.tracks[ii].performer;
			if (plugin.id != xid) {
				if (plugin.iconPosition) {
					if (Math.abs(x - plugin.iconPosition.x) < sz * 0.75) {
						if (Math.abs(y - plugin.iconPosition.y) < sz * 0.75) {
							//console.log(plugin.iconPosition, x, y, z);
							return plugin;
						}
					}
				}
			}
		}
		return null;
	}*/
	dragFindPluginFilterIcon(x: number, y: number, z: number, xid: string, outputs: string[]): Zvoog_FilterTarget | null {

		let sz = this.fanPluginIconSize(z);
		for (let ii = 0; ii < this.data.filters.length; ii++) {
			let plugin = this.data.filters[ii];
			if (plugin.id != xid) {
				if (outputs.indexOf(plugin.id, 0) < 0) {
					if (plugin.iconPosition) {
						if (Math.abs(x - plugin.iconPosition.x) < sz * 0.75) {
							if (Math.abs(y - plugin.iconPosition.y) < sz * 0.75) {
								//console.log(plugin.iconPosition, x, y, z);
								return plugin;
							}
						}
					}
				}
			}
		}
		return null;
	}
	dragCollisionSpeaker(fanx: number, fany: number, outputs: string[]): boolean {
		if (outputs.indexOf('', 0) > -1) {
			return false;
		}
		let sz = this.speakerIconSize;
		let speaker = this.speakerFanPosition();
		let x = fanx + this.leftPad + this.timelineWidth() + this.padGridFan;
		let y = fany + this.gridTop();
		//console.log(x,y,speaker);
		if (Math.abs(x - speaker.x) < sz * 0.75) {
			if (Math.abs(y - speaker.y) < sz * 0.75) {
				return true;
			}
		}
		return false;
	}
	speakerFanPosition(): TilePoint {
		let speakerX = this.wholeWidth() - this.speakerIconPad - this.rightPad + this.speakerIconSize / 2;
		let speakerY = this.wholeHeight()/2-this.speakerIconSize / 2;
		//this.gridTop() + this.gridHeight() / 2 - this.speakerIconSize / 2;
		return { x: speakerX, y: speakerY };
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
	commentsMaxHeight(): number {
		return this.commentsZoomHeight(zoomPrefixLevelsCSS.length - 1);
	}
	wholeHeight(): number {
		/*return this.commentsTop()
			+ this.commentsMaxHeight()
			+ this.bottomPad;*/
		return this.commentsTop()
			+ this.commentsMaxHeight()
			+ this.bottomPad
			;
	}
	workHeight() {
		return this.gridHeight()
			+ this.padGrid2Sampler + this.samplerHeight()
			+ this.padSampler2Automation + this.automationHeight()
			+ this.padAutomation2Comments + this.commentsMaxHeight()
			;
	}
	automationHeight(): number {
		return this.data.filters.length * this.autoPointHeight;
	}
	commentsZoomHeight(zIndex: number): number {
		return (2 + this.maxCommentRowCount) * this.notePathHeight * this.textZoomRatio(zIndex);
	}
	commentsAverageFillHeight(): number {
		let rcount = this.maxCommentRowCount;
		if (rcount > 3) {
			rcount = 3;
		}
		return (2 + rcount) * this.notePathHeight * 8;

	}
	automationTop(): number {
		return this.samplerTop() + this.samplerHeight() + this.padSampler2Automation;
	}


	commentsTop(): number {
		return this.automationTop()
			+ this.automationHeight()
			+ this.padAutomation2Comments;
	}

	gridTop(): number {
		//return this.samplerTop() + this.samplerHeight() + this.samplerBottomPad;
		return this.topPad + this.heightOfTitle() + this.parTitleGrid;
	}

	drawOctaveCount() {
		return this.octaveDrawCount;
	}
	transposeOctaveCount() {
		return this.octaveTransposeCount;
	}
	gridHeight(): number {
		return this.notePathHeight * this.drawOctaveCount() * 12;
	}


	samplerHeight(): number {
		return this.data.percussions.length * this.samplerDotHeight;
	}
	samplerTop(): number {
		return this.gridTop() + this.gridHeight() + this.padGrid2Sampler;
	}
	findFilterTarget(filterId: string): Zvoog_FilterTarget | null {
		//console.log('findFilterTarget start -----------------------------------------------------');
		if (this.data) {
			for (let nn = 0; nn < this.data.filters.length; nn++) {
				let filter = this.data.filters[nn];
				//console.log('findFilterTarget',filterId,filter);
				if (filter.id == filterId) {
					return filter;
				}
			}
		}
		//console.log('findFilterTarget no',filterId);
		return null;
	}
	textZoomRatio(zIndex: number): number {
		let txtZoomRatio = 1;
		if (zIndex > 2) txtZoomRatio = 2;
		if (zIndex > 3) txtZoomRatio = 4;
		if (zIndex > 4) txtZoomRatio = 8;
		return txtZoomRatio;
	}

}