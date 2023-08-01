class MixerUI {
	mixerGroup: SVGElement;
	//testRectangle: TileRectangle;
	mixerAnchor: TileAnchor;
	layerAnchors: TileAnchor[];
	bgRectangles: TileRectangle[];
	mixerLayer: TileLayerDefinition;
	tracks: MixerTrack[];
	resetMixeUI(data: MixerData) {
		let mixm: MixerDataMath = new MixerDataMath(data);
		let ww = mixm.wholeWidth();
		let hh = mixm.wholeHeight();
		//this.testRectangle.w = ww;
		//this.testRectangle.h = hh;
		this.mixerAnchor.ww = ww;
		this.mixerAnchor.hh = hh;
		for (let zz = 0; zz < zoomPrefixLevelsCSS.length - 1; zz++) {
			this.bgRectangles[zz].w = ww;
			this.bgRectangles[zz].h = hh;
			this.layerAnchors[zz].ww = ww;
			this.layerAnchors[zz].hh = hh;
		}
		//console.log();
		this.tracks = [];
		for (let tt = 0; tt < data.tracks.length; tt++) {
			let yy = tt * 100 * data.notePathHeight;
			let tm = new MixerTrack(yy, this.mixerAnchor, data);
			this.tracks.push(tm);
		}
	}
	//cssLayerZoomPrefix2(zz:number):number{

	//}
	buildDebugLayers(): TileLayerDefinition[] {
		this.mixerGroup = (document.getElementById("mixerLayer") as any) as SVGElement;
		//this.mixerLayer = { g: this.mixerGroup, anchors: [], mode: LevelModes.normal };
		//this.testRectangle = { x: 0, y: 0, w: 1, h: 1, rx: 50, ry: 50, css: 'mixFieldBg' };
		//this.mixerAnchor = { xx: 0, yy: 0, ww: 1, hh: 1, showZoom: 0.25, hideZoom: 256, content: [this.testRectangle] };
		this.mixerAnchor = { xx: 0, yy: 0, ww: 1, hh: 1, showZoom: zoomPrefixLevelsCSS[0].zoom, hideZoom: zoomPrefixLevelsCSS[10].zoom, content: [] };
		this.mixerLayer = { g: this.mixerGroup, anchors: [this.mixerAnchor], mode: LevelModes.normal };
		this.layerAnchors=[];
		this.bgRectangles=[];
		for (let zz = 0; zz < zoomPrefixLevelsCSS.length - 1; zz++) {
			let rectangle = { x: 0, y: 0, w: 1, h: 1, rx: 50, ry: 50, css: 'mixFieldBg' + zoomPrefixLevelsCSS[zz].prefix };
			let anchor: TileAnchor = { xx: 0, yy: 0, ww: 1, hh: 1, showZoom: zoomPrefixLevelsCSS[zz].zoom, hideZoom: zoomPrefixLevelsCSS[zz + 1].zoom, content: [rectangle] };
			this.mixerLayer.anchors.push(anchor);
			this.layerAnchors.push(anchor);
			this.bgRectangles.push(rectangle);
		}
		console.log(this.mixerLayer);
		return [this.mixerLayer];
	}
}
