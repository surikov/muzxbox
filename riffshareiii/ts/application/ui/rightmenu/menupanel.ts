class RightMenuPanel {
	menuCloseButton: ToolBarButton;
	showState: boolean = false;
	lastWidth: number = 0;
	lastHeight: number = 0;

	backgroundRectangle: TileRectangle;
	listingShadow: TileRectangle;
	backgroundAnchor: TileAnchor;

	menuPanelBackground: SVGElement;
	menuPanelContent: SVGElement;
	menuPanelInteraction: SVGElement;

	bgLayer: TileLayerDefinition;
	contentLayer: TileLayerDefinition;
	interLayer: TileLayerDefinition;

	interAnchor: TileAnchor;
	dragHandler: TileRectangle;

	contentAnchor: TileAnchor;
	//testContent: TileRectangle;
	items: RightMenuItem[] = [];

	scrollY: number = 0;
	shiftX: number = 0;
	lastZ: number = 1;

	itemsWidth: number = 0;


	resetAnchor: (parentSVGGroup: SVGElement, anchor: TileAnchor, layerMode: LevelModes) => void;

	resetAnchors() {
		this.resetAnchor(this.menuPanelBackground, this.backgroundAnchor, LevelModes.overlay);
		this.resetAnchor(this.menuPanelContent, this.contentAnchor, LevelModes.overlay);
		this.resetAnchor(this.menuPanelInteraction, this.interAnchor, LevelModes.overlay);
	}

	createMenu(resetAnchor: (parentSVGGroup: SVGElement, anchor: TileAnchor, layerMode: LevelModes) => void): TileLayerDefinition[] {

		this.resetAnchor = resetAnchor;

		this.menuPanelBackground = (document.getElementById("menuPanelBackground") as any) as SVGElement;
		this.menuPanelContent = (document.getElementById("menuPanelContent") as any) as SVGElement;
		this.menuPanelInteraction = (document.getElementById("menuPanelInteraction") as any) as SVGElement;

		this.backgroundRectangle = { x: 0, y: 0, w: 5, h: 5, css: 'rightMenuPanel' };
		this.dragHandler = { x: 1, y: 1, w: 5, h: 5, css: 'transparentScroll', id: 'rightMenuDragHandler', draggable: true, activation: this.scrollListing.bind(this) };
		//this.testContent = { x: 2, y: 1, w: 3, h: 7, css: 'debug', id: 'testMenuContent' };
		this.listingShadow = { x: 0, y: 0, w: 5, h: 5, css: 'fillShadow' };
		this.menuCloseButton = new ToolBarButton(['❯'], 1, 11, (nn: number) => {
			console.log('menuCloseButton', nn);
			this.showState = false;
			this.resizeMenu(this.lastWidth, this.lastHeight);
			this.resetAnchors();
		});
		this.backgroundAnchor = {
			xx: 0, yy: 0, ww: 111, hh: 111, showZoom: zoomPrefixLevelsCSS[0].zoom, hideZoom: zoomPrefixLevelsCSS[10].zoom, content: [
				this.listingShadow
				, this.backgroundRectangle

			], id: 'rightMenuBackgroundAnchor'
		};
		this.contentAnchor = {
			xx: 0, yy: 0, ww: 111, hh: 111, showZoom: zoomPrefixLevelsCSS[0].zoom, hideZoom: zoomPrefixLevelsCSS[10].zoom, content: [
				//this.testContent
			], id: 'rightMenuContentAnchor'
		};
		this.interAnchor = {
			xx: 0, yy: 111, ww: 111, hh: 0, showZoom: zoomPrefixLevelsCSS[0].zoom, hideZoom: zoomPrefixLevelsCSS[10].zoom, content: [
				this.dragHandler, this.menuCloseButton.anchor
			], id: 'rightMenuInteractionAnchor'
		};
		this.bgLayer = { g: this.menuPanelBackground, anchors: [this.backgroundAnchor], mode: LevelModes.overlay };
		this.contentLayer = { g: this.menuPanelContent, anchors: [this.contentAnchor], mode: LevelModes.overlay };
		this.interLayer = { g: this.menuPanelInteraction, anchors: [this.interAnchor], mode: LevelModes.overlay };
		return [this.bgLayer
			, this.contentLayer
			, this.interLayer];
	}
	scrollListing(dx: number, dy: number) {
		//console.log('scrollListing', dx, dy,this.lastZ);
		let yy = this.scrollY + dy / this.lastZ;
		let itemsH = 0;//1 * this.items.length;
		for (let ii = 0; ii < this.items.length; ii++) {
			itemsH = itemsH + this.items[ii].calculateHeight();
		}

		if (yy < -0 + this.lastHeight - itemsH) yy = -0 + this.lastHeight - itemsH;
		if (yy > 0) yy = 0;

		this.scrollY = yy;
		this.contentAnchor.translation = { x: this.shiftX, y: this.scrollY };
		this.resetAnchor(this.menuPanelContent, this.contentAnchor, LevelModes.overlay);
	}
	fillMenu(viewWIdth: number, viewHeight: number) {

		//this.itemsCount = 44;
		//let items: RightMenuItem[] = [];
		for (let ii = 0; ii < 44; ii++) {
			let it: RightMenuItem = new RightMenuItem();
			it.labelText = "item " + ii+" "+Math.random();
			this.items.push(it);
			//let item: TileText = { x: 0, y: ii, text: "item " + ii };
			//this.contentAnchor.content.push(item);
		}
		this.items[12].big = true;
		this.items[22].big = true;
		this.items[23].big = true;
		this.items[24].big = true;
		this.items[7].big = true;

		

		//console.log('fillMenu', viewWIdth, viewHeight, this.contentAnchor);

	}
	rerenderContent() {
		this.contentAnchor.content=[];
		let position: number = 0;
		for (let ii = 0; ii < this.items.length; ii++) {
			let tile = this.items[ii].buildTile(position, this.itemsWidth);
			this.contentAnchor.content.push(tile);
			position = position + this.items[ii].calculateHeight();
		}
		this.resetAnchor(this.menuPanelContent, this.contentAnchor, LevelModes.overlay);
	}
	resizeMenu(viewWIdth: number, viewHeight: number) {
		//console.log('resizeMenu', viewWIdth, viewHeight, this.showState);
		this.lastWidth = viewWIdth;
		this.lastHeight = viewHeight;
		this.itemsWidth = viewWIdth - 1;
		if (this.itemsWidth > 9) this.itemsWidth = 9;
		if (this.itemsWidth < 2) {
			this.itemsWidth = 2;
		}
		this.shiftX = viewWIdth - this.itemsWidth;
		if (!this.showState) {
			this.shiftX = viewWIdth + 1;
			this.menuCloseButton.position = -11;
		} else {
			this.menuCloseButton.position = 0;
		}

		let shn = 0.05;

		this.listingShadow.x = this.shiftX - shn;
		this.listingShadow.y = -shn;
		this.listingShadow.w = this.itemsWidth + shn + shn;
		this.listingShadow.h = viewHeight + shn + shn;

		this.backgroundRectangle.x = this.shiftX;
		this.backgroundRectangle.y = 0;
		this.backgroundRectangle.w = this.itemsWidth;
		this.backgroundRectangle.h = viewHeight;

		this.backgroundAnchor.xx = 0;
		this.backgroundAnchor.yy = 0;
		this.backgroundAnchor.ww = viewWIdth;
		this.backgroundAnchor.hh = viewHeight;


		this.dragHandler.x = this.shiftX;
		this.dragHandler.y = 0;
		this.dragHandler.w = this.itemsWidth;
		this.dragHandler.h = viewHeight;


		this.interAnchor.xx = 0;
		this.interAnchor.yy = 0;
		this.interAnchor.ww = viewWIdth;
		this.interAnchor.hh = viewHeight;

		this.contentAnchor.xx = 0;
		this.contentAnchor.yy = 0;
		this.contentAnchor.ww = viewWIdth;
		this.contentAnchor.hh = viewHeight;

		this.contentAnchor.translation = { x: this.shiftX, y: this.scrollY };

		this.menuCloseButton.resize(viewWIdth, viewHeight);

		//console.log(this.dragHandler);
		this.rerenderContent();
	}

}
