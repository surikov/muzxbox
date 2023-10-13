class RightMenuPanel {
	menuRectangle: TileRectangle;
	menuAnchor: TileAnchor;
	menuGroup: SVGElement;
	menuLayer: TileLayerDefinition;
	 showState:boolean=false;
	 requestReRenderToolbar: () => void;
	createMenu(requestReRenderToolbar: () => void): TileLayerDefinition[] {
		this.requestReRenderToolbar=requestReRenderToolbar;
		this.menuGroup = (document.getElementById("menuPanelGroup") as any) as SVGElement;
		this.menuRectangle = { x: 0, y: 0, w: 5, h: 5, css: 'debug' };
		this.menuAnchor = {
			xx: 0, yy: 0, ww: 111, hh: 111, showZoom: zoomPrefixLevelsCSS[0].zoom, hideZoom: zoomPrefixLevelsCSS[10].zoom, content: [
				this.menuRectangle
			]
		};
		this.menuLayer = {
			g: this.menuGroup, anchors: [
				this.menuAnchor
			], mode: LevelModes.overlay
		};
		return [this.menuLayer];
	}
	fillMenu(viewWIdth: number, viewHeight: number) {
		console.log('fillMenu', viewWIdth, viewHeight);

	}
	resizeMenu(viewWIdth: number, viewHeight: number) {
		console.log('resizeMenu', viewWIdth, viewHeight);
		let ww = 9;
		if (ww > viewWIdth - 1) ww = viewWIdth - 1;
		let xx=viewWIdth - ww;
		if(!this.showState){
			xx=viewWIdth;
		}
		this.menuRectangle.x = xx;
		this.menuRectangle.y = 0;
		this.menuRectangle.w = ww;
		this.menuRectangle.h = viewHeight;
		this.menuAnchor.xx = 0;
		this.menuAnchor.yy = 0;
		this.menuAnchor.ww = viewWIdth;
		this.menuAnchor.hh = viewHeight;
	}
	reRenderMenu(tiler: TileLevelBase) {
		tiler.resetAnchor(this.menuGroup, this.menuAnchor, LevelModes.overlay);
	}
	/*showMenu(viewWIdth: number, viewHeight: number){
		this.showState=true;
		this.resizeMenu(viewWIdth,viewHeight);
		this.requestReRenderToolbar();
	}
	hideMenu(viewWIdth: number, viewHeight: number){
		this.showState=false;
		this.resizeMenu(viewWIdth,viewHeight);
		this.requestReRenderToolbar();
	}*/
}
