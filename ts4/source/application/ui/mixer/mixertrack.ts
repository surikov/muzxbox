class MixerTrack {
	trackRectangle: TileRectangle;
	trackAnchor: TileAnchor;
	bars: TrackBar[];
	constructor(top: number, toAnchor: TileAnchor, data: MixerData) {
		let ww = new MixerDataMath(data).wholeWidth();
		this.trackRectangle = { x: 0, y: top, w: ww, h: data.notePathHeight * 100-3, rx: 3, ry: 3, css: 'debug' };
		this.trackAnchor = { xx: 0, yy: top, ww: ww, hh: data.notePathHeight * 100, showZoom: 0.25, hideZoom: 64, content: [this.trackRectangle] };
		//toAnchor.content.push(this.trackAnchor);
		//console.log(top);
		this.bars = [];
		let left = 0;
		for (let ss = 0; ss < data.timeline.length; ss++) {
			let width = new MusicMetreMath(data.timeline[ss].metre).width(data.timeline[ss].tempo, data.widthDurationRatio);
			let bar = new TrackBar(left, top, width, this.trackAnchor, data);
			this.bars.push(bar);
			left = left + width;
		}
	}

}