class TrackBar {
	barRectangle: TileRectangle;
	barAnchor: TileAnchor;
	constructor(left: number, top: number, ww: number, toAnchor: TileAnchor, data: MixerData) {
		this.barRectangle = { x: left, y: top, w: ww-1, h: data.notePathHeight * 100-1, rx: 1, ry: 1, css: 'debug' };
		this.barAnchor = { xx: left, yy: top, ww: ww, hh: data.notePathHeight * 100, showZoom: 0.25, hideZoom: 32, content: [this.barRectangle] };
		toAnchor.content.push(this.barAnchor);
	}
}