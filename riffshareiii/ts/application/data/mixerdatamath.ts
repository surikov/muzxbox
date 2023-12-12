class MixerDataMath {
	data: MZXBX_Project;
	titleHeight: number = 50;

	constructor(data: MZXBX_Project) {
		this.data = data;
	}
	mixerWidth(): number {
		let mm: MZXBX_MetreMathType = MZMM();
		let ww = 0;
		for (let ii = 0; ii < this.data.timeline.length; ii++) {
			//ww = ww + new MusicMetreMath(this.data.timeline[ii].metre).width(this.data.timeline[ii].tempo, this.data.theme.widthDurationRatio);
			ww = ww + mm.set(this.data.timeline[ii].metre).duration(this.data.timeline[ii].tempo) * this.data.theme.widthDurationRatio;
		}
		return ww;
	}
	mixerHeight(): number {
		return this.titleHeight + this.gridHeight();
	}
	gridTop(): number {
		return this.titleHeight;
	}

	gridHeight(): number {
		return this.data.theme.notePathHeight * 10 * 12;
	}
}