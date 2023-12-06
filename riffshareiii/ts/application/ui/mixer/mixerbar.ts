class MixerBar {
	//barRectangle: TileRectangle;
	//barAnchor: TileAnchor;
	minZoom: number;
	maxZoom: number;
	prefix: string = '';
	octaves: BarOctave[];
	anchor: TileAnchor;
	constructor(prefix: string
		, left: number, top: number, ww: number, hh: number
		, minZoom: number, maxZoom: number
		, toAnchor: TileAnchor
		, data: MZXBX_Project
	) {
		this.minZoom = minZoom;
		this.maxZoom = maxZoom;
		let mixm: MixerDataMath = new MixerDataMath(data);
		this.prefix = prefix;
		this.anchor = toAnchor;
		//this.barRectangle = { x: left, y: top, w: ww, h: hh, rx: 1, ry: 1, css: 'mixFieldBg' + this.prefix };
		//this.barAnchor = { xx: left, yy: top, ww: ww, hh: hh, showZoom: minZoom, hideZoom: maxZoom, content: [this.barRectangle] };
		//this.anchor.content.push(this.barRectangle);
		this.octaves = [];
		let h12=12*data.theme.notePathHeight;
		for (let oo = 0; oo < mixm.octaveCount; oo++) {
			
			let an: TileAnchor = { showZoom: this.minZoom, hideZoom: this.maxZoom, xx: left, yy: oo*h12, ww: ww, hh: h12, content: [] };
			this.anchor.content.push(an);
			let bo: BarOctave = new BarOctave(left, oo*h12, ww, h12, an, prefix, minZoom, maxZoom, data);
			this.octaves.push(bo);
		}

	}
}