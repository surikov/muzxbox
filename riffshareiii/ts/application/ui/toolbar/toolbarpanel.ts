class UIToolbar{
	toolBarRectangle: TileRectangle;
	toolBarAnchor: TileAnchor;
	toolBarGroup: SVGElement;
	toolBarLayer: TileLayerDefinition;
	toolBarLayers(): TileLayerDefinition[] {
		return [this.toolBarLayer];
	}
    setupToolbar(){
		this.toolBarGroup = (document.getElementById("toolBarPanelGroup") as any) as SVGElement;
		this.toolBarRectangle = { x: 0, y: 0, w: 111, h: 111, rx: 10, ry: 10, css: 'debug' };
		this.toolBarAnchor = { xx: 0, yy: 0, ww: 111, hh: 111, showZoom: zoomPrefixLevelsCSS[0].zoom, hideZoom: zoomPrefixLevelsCSS[10].zoom, content: [
			this.toolBarRectangle
		] };
		this.toolBarLayer = {
			g: this.toolBarGroup, anchors: [
					this.toolBarAnchor
			], mode: LevelModes.normal
		};
    }
    resetToolbar(){
        
    }
}
