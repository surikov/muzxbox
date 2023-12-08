class MixerBar {
	//barRectangle: TileRectangle;
	//barAnchor: TileAnchor;
	//minZoom: number;
	//maxZoom: number;
	//prefix: string = '';
	octaves: BarOctave[];
	anchor: TileAnchor;
	zoomLevel:number;
	constructor(//prefix: string
		//, 
		left: number, top: number, ww: number, hh: number
		//, minZoom: number, maxZoom: number
		,zoomLevel:number
		, toAnchor: TileAnchor
		, data: MZXBX_Project
	) {
		//this.minZoom = minZoom;
		//this.maxZoom = maxZoom;
		this.zoomLevel=zoomLevel;
		let mixm: MixerDataMath = new MixerDataMath(data);
		//this.prefix = prefix;
		this.anchor = toAnchor;
		//this.barRectangle = { x: left, y: top, w: ww, h: hh, rx: 1, ry: 1, css: 'mixFieldBg' + this.prefix };
		//this.barAnchor = { xx: left, yy: top, ww: ww, hh: hh, showZoom: minZoom, hideZoom: maxZoom, content: [this.barRectangle] };
		//this.anchor.content.push(this.barRectangle);
		this.octaves = [];
		let h12=12*data.theme.notePathHeight;
		for (let oo = 0; oo < data.theme.octaveCount; oo++) {
			let barOctaveAnchor: TileAnchor = { showZoom: zoomPrefixLevelsCSS[this.zoomLevel].zoom, hideZoom: zoomPrefixLevelsCSS[this.zoomLevel+1].zoom, xx: left, yy: oo*h12, ww: ww, hh: h12, content: [] };
			//let barOctaveAnchor: TileAnchor = { showZoom: this.minZoom, hideZoom: this.maxZoom, xx: left, yy: oo*h12, ww: ww, hh: h12, content: [] };
			this.anchor.content.push(barOctaveAnchor);
			let bo: BarOctave = new BarOctave(left, oo*h12, ww, h12, barOctaveAnchor
				//, prefix
				//, minZoom, maxZoom, data
				,this.zoomLevel
				);
			this.octaves.push(bo);
		}

	}
}