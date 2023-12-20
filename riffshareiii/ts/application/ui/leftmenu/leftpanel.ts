class LeftBar {
	selectionBarLayer: TileLayerDefinition;
	leftLayerZoom: SVGElement;
	leftBarAnchor: TileAnchor;
	backgroundRectangle: TileRectangle;
	constructor() {

	}
	createLeftPanel(): TileLayerDefinition[] {
		this.leftLayerZoom = (document.getElementById("leftLayerZoom") as any) as SVGElement;
		this.backgroundRectangle = { x: 0, y: 0, w: 5, h: 5, css: 'debug' };
		this.leftBarAnchor = {
			xx: 0, yy: 0, ww: 1, hh: 1
			, showZoom: zoomPrefixLevelsCSS[0].zoom
			, hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].zoom
			, content: [
				this.backgroundRectangle
			]
		};
		this.selectionBarLayer = {
			g: this.leftLayerZoom, anchors: [
				this.leftBarAnchor
			], mode: LevelModes.left
		};
		return [this.selectionBarLayer];
	}
}
