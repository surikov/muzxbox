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
		this.toolBarRectangle = { x: 0, y: 0, w: 5, h: 5, css: 'toolBarPanel' };
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
	fillToolbar(data: MixerData,viewWIdth: number, viewHeight: number) {
		console.log('fillToolbar', data,viewWIdth,viewHeight);
		
	}
	resizeToolbar(tiler:TileLevelBase,viewWIdth: number, viewHeight: number) {
        console.log('resizeToolbar', viewWIdth, viewHeight);
        this.toolBarRectangle.x=0;
        this.toolBarRectangle.y=viewHeight-1;
        this.toolBarRectangle.w=viewWIdth;
        this.toolBarRectangle.h=1;
        this.toolBarAnchor.xx=0;
        this.toolBarAnchor.yy=0;
        this.toolBarAnchor.ww=viewWIdth;
        this.toolBarAnchor.hh=viewHeight;
tiler.resetAnchor(this.toolBarGroup,this.toolBarAnchor,LevelModes.overlay);
	}
}
