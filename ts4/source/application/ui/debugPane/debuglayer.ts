class DebugLayer {
	debugRectangle: TileRectangle;
	debugAnchor: TileAnchor;
	debugGroup: SVGElement;
	debugLayer: TileLayerDefinition;
	buildDebugLayers(): TileLayerDefinition[] {
		this.debugRectangle = { x: 0, y: 0, w: 1, h: 1, rx: 10, ry: 10, css: 'debug' };
		this.debugGroup = (document.getElementById("debugLayer") as any) as SVGElement;
		this.debugAnchor = { xx: 0, yy: 0, ww: 1, hh: 1, showZoom: zoomPrefixLevelsCSS[0].zoom, hideZoom: zoomPrefixLevelsCSS[10].zoom, content: [this.debugRectangle] };
		this.debugLayer = { g: this.debugGroup, anchors: [
		//	this.debugAnchor
		], mode: LevelModes.normal };
		return [this.debugLayer];
	}
	resetDebugLayer(data: MixerData) {
		let mixm: MixerDataMath = new MixerDataMath(data);
		let ww = mixm.wholeWidth();
		let hh = mixm.wholeHeight();
		this.debugRectangle.w = ww;
		this.debugRectangle.h = hh;
		this.debugAnchor.ww = ww;
		this.debugAnchor.hh = hh;
		//console.log(this.debugLayer);
	}
}