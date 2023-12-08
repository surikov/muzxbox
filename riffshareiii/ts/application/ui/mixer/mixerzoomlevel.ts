class MixerZoomLevel {
	//minZoom: number;
	//maxZoom: number;
	zoomAnchor: TileAnchor;
	//bg: TileRectangle;
	//prefix: string;
	bars: MixerBar[];
	//barAnchors: TileAnchor[] = [];
	zoomLevel:number;
	constructor(//prefix: string, minZoom: number, maxZoom: number
		zoomLevel:number
		, anchor: TileAnchor) {
		//this.minZoom = minZoom;
		//this.maxZoom = maxZoom;
		this.zoomLevel=zoomLevel;
		this.zoomAnchor = anchor;
		//this.prefix = prefix;
		//this.bg = { x: 0, y: 0, w: 5, h: 5, rx: 0.4, ry: 0.4, css: 'debug' };
		this.zoomAnchor.content = [];//this.bg];

	}
	/*
	buildLevel(ww: number, hh: number) {
		//this.bg.w = ww;
		//this.bg.h = hh;
		this.anchor.ww = ww;
		this.anchor.hh = hh;
	}*/
	resetBars(data: MZXBX_Project, ww: number, hh: number) {
		this.zoomAnchor.content = [];//this.bg];
		//this.bg.w = ww;
		//this.bg.h = hh;
		//this.barAnchors = [];
		this.bars = [];
		let left = 0;
		let width = 0;
		for (let ii = 0; ii < data.timeline.length; ii++) {
			let timebar = data.timeline[ii];
			width = MZMM().set(timebar.metre).duration(timebar.tempo) * data.theme.widthDurationRatio;
			let an: TileAnchor = { showZoom: zoomPrefixLevelsCSS[this.zoomLevel].zoom, hideZoom: zoomPrefixLevelsCSS[this.zoomLevel+1].zoom, xx: left, yy: 0, ww: width, hh: hh, content: [] };
			//this.barAnchors.push(an);
			this.zoomAnchor.content.push(an);
			this.bars.push(new MixerBar(//this.prefix, 
				left, 0, width, hh
				//, this.minZoom, this.maxZoom
				,this.zoomLevel
				, an, data
				));
			left = left + width;
		}

	}
}
