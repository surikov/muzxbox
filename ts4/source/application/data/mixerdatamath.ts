class MixerDataMath {
	data: MixerData;
	constructor(data: MixerData) {
		this.data = data;
	}
	wholeWidth(): number {
		let ww = 0;
		for (let ii = 0; ii < this.data.timeline.length; ii++) {
			ww = ww + new MusicMetreMath(this.data.timeline[ii].metre).width(this.data.timeline[ii].tempo, this.data.widthDurationRatio);
		}
		return ww;
	}
	wholeHeight(): number {
		return this.data.tracks.length * this.data.notePathHeight * 100;
	}
}