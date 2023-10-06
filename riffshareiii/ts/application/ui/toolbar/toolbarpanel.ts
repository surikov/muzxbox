class UIToolbar {
	toolBarRectangle: TileRectangle;
	toolBarAnchor: TileAnchor;
	toolBarGroup: SVGElement;
	toolBarLayer: TileLayerDefinition;
	toolBarLayers(): TileLayerDefinition[] {
		return [this.toolBarLayer];
	}
	createToolbar() {
		this.toolBarGroup = (document.getElementById("toolBarPanelGroup") as any) as SVGElement;
		this.toolBarRectangle = { x: 0, y: 0, w: 5, h: 5, css: 'debug' };
		this.toolBarAnchor = {
			xx: 0, yy: 0, ww: 111, hh: 111, showZoom: zoomPrefixLevelsCSS[0].zoom, hideZoom: zoomPrefixLevelsCSS[10].zoom, content: [
				this.toolBarRectangle
			]
		};
		this.toolBarLayer = {
			g: this.toolBarGroup, anchors: [
				this.toolBarAnchor
			], mode: LevelModes.overlay
		};
	}
	fillToolbar(data: MixerData) {
		console.log('fillToolbar', data);
		
	}
	resizeToolbar(viewWIdth: number, viewHeight: number, innerWidth: number, innerHeight: number) {
		console.log('resizeToolbar', viewWIdth, viewHeight, innerWidth, innerHeight);
	}
}
