class RightMenuPanel {
	menuCloseButton: ToolBarButton;
	showState: boolean = false;
	lastWidth: number = 0;
	lastHeight: number = 0;

	backgroundRectangle: TileRectangle;
	listingShadow: TileRectangle;
	backgroundAnchor: TileAnchor;

	listingGroup: SVGElement;
	listingLayer: TileLayerDefinition;
 
	interAnchor: TileAnchor;

	testRectangle: TileRectangle;

	createMenu(resetAnchor: (parentSVGGroup: SVGElement, anchor: TileAnchor, layerMode: LevelModes) => void): TileLayerDefinition[] {
		this.listingGroup = (document.getElementById("menuPanelGroup") as any) as SVGElement;
		this.backgroundRectangle = { x: 0, y: 0, w: 5, h: 5, css: 'rightMenuPanel' };
		this.testRectangle = { x: 1, y: 1, w: 5, h: 5, css: 'debug' };
		this.listingShadow = { x: 0, y: 0, w: 5, h: 5, css: 'fillShadow' };
		this.menuCloseButton = new ToolBarButton(['❯'], 1, 11, (nn: number) => {
			console.log('menuCloseButton', nn);
			this.showState = false;
			this.resizeMenu(this.lastWidth, this.lastHeight);
			resetAnchor(this.listingGroup, this.backgroundAnchor, LevelModes.overlay);
		});
		this.backgroundAnchor = {
			xx: 0, yy: 0, ww: 111, hh: 111, showZoom: zoomPrefixLevelsCSS[0].zoom, hideZoom: zoomPrefixLevelsCSS[10].zoom, content: [
				this.listingShadow, this.backgroundRectangle, this.menuCloseButton.anchor
			]
		};
		this.interAnchor = { xx: 0, yy: 111, ww: 111, hh: 0, showZoom: zoomPrefixLevelsCSS[0].zoom, hideZoom: zoomPrefixLevelsCSS[10].zoom, content: [
			this.testRectangle
		] };
		this.listingLayer = {
			g: this.listingGroup, anchors: [
				this.backgroundAnchor,this.interAnchor
			], mode: LevelModes.overlay
		};
		return [this.listingLayer];
	}
	fillMenu(viewWIdth: number, viewHeight: number) {
		console.log('fillMenu', viewWIdth, viewHeight);

	}
	resizeMenu(viewWIdth: number, viewHeight: number) {
		console.log('resizeMenu', viewWIdth, viewHeight);
		this.lastWidth = viewWIdth;
		this.lastHeight = viewHeight;
		let ww = viewWIdth - 1;
		if (ww > 9) ww = 9;
		if (ww < 2) {
			ww = 2;
		}
		let xx = viewWIdth - ww;
		if (!this.showState) {
			xx = viewWIdth + 1;
			this.menuCloseButton.position = -11;
		} else {
			this.menuCloseButton.position = 0;
		}

		let shn = 0.05;

		this.listingShadow.x = xx - shn;
		this.listingShadow.y = -shn;
		this.listingShadow.w = ww + shn + shn;
		this.listingShadow.h = viewHeight + shn + shn;

		this.backgroundRectangle.x = xx;
		this.backgroundRectangle.y = 0;
		this.backgroundRectangle.w = ww;
		this.backgroundRectangle.h = viewHeight;

		this.backgroundAnchor.xx = 0;
		this.backgroundAnchor.yy = 0;
		this.backgroundAnchor.ww = viewWIdth;
		this.backgroundAnchor.hh = viewHeight;

		this.interAnchor.xx = 0;
		this.interAnchor.yy = 0;
		this.interAnchor.ww = viewWIdth;
		this.interAnchor.hh = viewHeight;

		this.menuCloseButton.resize(viewWIdth, viewHeight);
	}

}
