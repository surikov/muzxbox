class MixerDataMath {
	data: MZXBX_Project;
	octaveCount=10;
	constructor(data: MZXBX_Project) {
		this.data = data;
	}
	wholeWidth(): number {
		let mm: MZXBX_MetreMathType = MZMM();
		let ww = 0;
		for (let ii = 0; ii < this.data.timeline.length; ii++) {
			//ww = ww + new MusicMetreMath(this.data.timeline[ii].metre).width(this.data.timeline[ii].tempo, this.data.theme.widthDurationRatio);
			ww = ww + mm.set(this.data.timeline[ii].metre).duration(this.data.timeline[ii].tempo) * this.data.theme.widthDurationRatio;
		}
		return ww;
	}
	wholeHeight(): number {
		return this.data.theme.notePathHeight * 10 * 12;
	}
}