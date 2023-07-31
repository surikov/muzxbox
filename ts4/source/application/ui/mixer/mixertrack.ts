class MixerTrack {
	trackRectangle: TileRectangle;
	trackAnchor: TileAnchor;
	constructor(top: number, toAnchor: TileAnchor, data: MixerData) {
		let mixm: MixerDataMath = new MixerDataMath(data);
		this.trackRectangle = { x: 0, y: top, w: mixm.wholeWidth(), h: data.notePathHeight * 100, rx: 11, ry: 11, css: 'debug' };
		this.trackAnchor = { xx: 0, yy: top, ww: mixm.wholeWidth(), hh: data.notePathHeight * 100, showZoom: 0.25, hideZoom: 256, content: [this.trackRectangle] };
		toAnchor.content.push(this.trackAnchor);
		//console.log(top);
	}

}