class LeftBar {
	selectionBarLayer: TileLayerDefinition;
	leftLayerZoom: SVGElement;

	openedLeftRightBar: TileAnchor;
	closedLeftRightBar: TileAnchor;

	openedGridTop: TileAnchor;
	closedGridTop: TileAnchor;
	//bgLeftPanel: TileAnchor;

	//backgroundLinks: TileRectangle[] = [];

	leftHide: boolean = true;
	panelWidth: number = 5;
	constructor() {

	}
	reShowLeftPanel(viewWidth: number, viewHeight: number) {
		//console.log(this.leftHide, viewWidth, viewHeight, this.leftBarContentAnchor);
		if (this.leftHide) {
			this.openedLeftRightBar.translation = { x: 0, y: 1234567890 };
			this.closedLeftRightBar.translation = { x: 0, y: 0 };
		} else {
			this.openedLeftRightBar.translation = { x: 0, y: 0 };
			this.closedLeftRightBar.translation = { x: 0, y: 1234567890 };
		}
	}

	createLeftPanel(): TileLayerDefinition[] {
		console.log('createLeftPanel');
		this.leftLayerZoom = (document.getElementById("leftLayerZoom") as any) as SVGElement;
		this.openedGridTop = { xx: 0, yy: -1234567890/2, ww: 1, hh: 1234567890, showZoom: zoomPrefixLevelsCSS[0].minZoom, hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom, content: [] };
		this.openedLeftRightBar = { xx: 0, yy: -1234567890/2, ww: 1, hh: 1234567890, showZoom: zoomPrefixLevelsCSS[0].minZoom, hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom, content: [this.openedGridTop] };
		this.closedGridTop = { xx: 0, yy: -1234567890/2, ww: 1, hh: 1234567890, showZoom: zoomPrefixLevelsCSS[0].minZoom, hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom, content: [] , id: 'closedLeftPanel'  + Math.random()};
		this.closedLeftRightBar = { xx: 0, yy: -1234567890/2, ww: 1, hh: 1234567890, showZoom: zoomPrefixLevelsCSS[0].minZoom, hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom, content: [this.closedGridTop], id: 'closedLeftBar'  + Math.random() };
		for (let zz = 0; zz < zoomPrefixLevelsCSS.length - 1; zz++) {
			let bg = { x: 0, y: -12345, w: this.panelWidth * zoomPrefixLevelsCSS[zz].minZoom, h: 1234567890, css: 'leftPanelBG', id: 'hdbg' + (zz + Math.random()) };
			//this.backgroundLinks.push(bg);
			let edittitle: TileText = { x: this.panelWidth * zoomPrefixLevelsCSS[zz].minZoom, y: -2 * zoomPrefixLevelsCSS[zz].minZoom, text: 'Debug track title string', css: 'leftBarProjectTitle' + zoomPrefixLevelsCSS[zz].prefix };
			let editfirst: TileText = { x: this.panelWidth * zoomPrefixLevelsCSS[zz].minZoom, y: 0, text: 'Debug track title string', css: 'leftFirstTitle' + zoomPrefixLevelsCSS[zz].prefix };
			let openedBarZoom: TileAnchor = { xx: 0, yy: -1234567890/2, ww: 1, hh: 1234567890, showZoom: zoomPrefixLevelsCSS[zz].minZoom, hideZoom: zoomPrefixLevelsCSS[zz + 1].minZoom, content: [bg, edittitle, editfirst] };
			this.openedGridTop.content.push(openedBarZoom);

			let protitle: TileText = { x: 0, y: -2 * zoomPrefixLevelsCSS[zz].minZoom, text: 'Debug title string', css: 'leftReadProjectTitle' + zoomPrefixLevelsCSS[zz].prefix, id: 'projTitle' + zz + Math.random() };
			let profirst: TileText = { x: 0, y: 0, text: 'Debug title string', css: 'leftReadFirstTitle' + zoomPrefixLevelsCSS[zz].prefix, id: 'firstTitle' + zz + Math.random() };
			let closedBarZoom: TileAnchor = { xx: 0, yy: -1234567890/2, ww: 1, hh: 1234567890, showZoom: zoomPrefixLevelsCSS[zz].minZoom, hideZoom: zoomPrefixLevelsCSS[zz + 1].minZoom, content: [protitle, profirst], id: 'closedBarZoom' + zz + Math.random() };
			this.closedGridTop.content.push(closedBarZoom);
		}
		this.selectionBarLayer = { g: this.leftLayerZoom, anchors: [this.openedLeftRightBar, this.closedLeftRightBar], mode: LevelModes.left };
		return [this.selectionBarLayer];
	}
	resizeHeaders(mixerH: number, viewWidth: number, viewHeight: number, tz: number) {
		console.log('resizeHeaders');
		/*
		let rh = viewHeight * zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom - 1;
		let ry = -(rh - mixerH) / 2;

		this.openedLeftBar.yy = ry;
		this.openedLeftBar.hh = rh;
		this.openedLeftPanel.hh = rh;

		this.closedLeftBar.yy = ry;
		this.closedLeftBar.hh = rh;
		this.closedLeftPanel.hh = rh;
		*/
/*
		for (let ii = 0; ii < this.backgroundLinks.length; ii++) {
			this.backgroundLinks[ii].y = ry;
			this.backgroundLinks[ii].h = rh;
		}*/
		this.reShowLeftPanel(viewWidth, viewHeight);
	}
	fillTrackHeaders(data: MZXBX_Project) {
		console.log('fillTrackHeaders');
		let mixm: MixerDataMath = new MixerDataMath(data);
		this.openedGridTop.translation = { x: 0, y: mixm.gridTop() };
		this.closedGridTop.translation = { x: 0, y: mixm.gridTop() };
	}
}
