class LeftBar {
	selectionBarLayer: TileLayerDefinition;
	leftLayerZoom: SVGElement;

	openedLeftBar: TileAnchor;
	closedLeftBar: TileAnchor;

	openedLeftPanel: TileAnchor;
	closedLeftPanel: TileAnchor;

	backgroundLinks: TileRectangle[] = [];

	leftHide: boolean = true;
	panelWidth: number = 5;
	constructor() {

	}
	reShowLeftPanel(viewWidth: number, viewHeight: number) {
		//console.log(this.leftHide, viewWidth, viewHeight, this.leftBarContentAnchor);
		if (this.leftHide) {
			this.openedLeftBar.translation = { x: 0, y: -this.openedLeftBar.hh };
			this.closedLeftBar.translation = { x: 0, y: 0 };
		} else {
			this.openedLeftBar.translation = { x: 0, y: 0 };
			this.closedLeftBar.translation = { x: 0, y: -this.openedLeftBar.hh };
		}
	}

	createLeftPanel(): TileLayerDefinition[] {
		console.log('createLeftPanel');
		this.leftLayerZoom = (document.getElementById("leftLayerZoom") as any) as SVGElement;
		this.openedLeftPanel = { xx: 0, yy: 0, ww: 1, hh: 1, showZoom: zoomPrefixLevelsCSS[0].minZoom, hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom, content: [] };
		this.openedLeftBar = { xx: 0, yy: 0, ww: 1, hh: 1, showZoom: zoomPrefixLevelsCSS[0].minZoom, hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom, content: [this.openedLeftPanel] };
		this.closedLeftPanel = { xx: 0, yy: 0, ww: 1, hh: 1, showZoom: zoomPrefixLevelsCSS[0].minZoom, hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom, content: [] };
		this.closedLeftBar = { xx: 0, yy: 0, ww: 1, hh: 1, showZoom: zoomPrefixLevelsCSS[0].minZoom, hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom, content: [this.closedLeftPanel] };
		for (let zz = 0; zz < zoomPrefixLevelsCSS.length - 1; zz++) {
			let bg = { x: 0, y: 0, w: this.panelWidth * zoomPrefixLevelsCSS[zz].minZoom, h: 123, css: 'leftPanelBG', id: 'hdbg' + (zz + Math.random()) };
			this.backgroundLinks.push(bg);
			let edittitle: TileText = { x: this.panelWidth * zoomPrefixLevelsCSS[zz].minZoom, y: -2*zoomPrefixLevelsCSS[zz].minZoom, text: 'Debug track title string', css: 'leftBarProjectTitle' + zoomPrefixLevelsCSS[zz].prefix };
			let editfirst: TileText = { x: this.panelWidth * zoomPrefixLevelsCSS[zz].minZoom, y: 0, text: 'Debug track title string', css: 'leftFirstTitle' + zoomPrefixLevelsCSS[zz].prefix };
			let openedBarZoom = { xx: 0, yy: 0, ww: 1, hh: 1, showZoom: zoomPrefixLevelsCSS[zz].minZoom, hideZoom: zoomPrefixLevelsCSS[zz + 1].minZoom, content: [bg, edittitle, editfirst] };
			this.openedLeftPanel.content.push(openedBarZoom);

			let protitle: TileText = { x: 0, y: -2*zoomPrefixLevelsCSS[zz].minZoom, text: 'Debug title string', css: 'leftReadProjectTitle' + zoomPrefixLevelsCSS[zz].prefix };
			let profirst: TileText = { x: 0, y: 0, text: 'Debug title string', css: 'leftReadFirstTitle' + zoomPrefixLevelsCSS[zz].prefix };
			let closedBarZoom = { xx: 0, yy: 0, ww: 1, hh: 1, showZoom: zoomPrefixLevelsCSS[zz].minZoom, hideZoom: zoomPrefixLevelsCSS[zz + 1].minZoom, content: [protitle, profirst] };
			this.closedLeftPanel.content.push(closedBarZoom);
		}
		this.selectionBarLayer = { g: this.leftLayerZoom, anchors: [this.openedLeftBar, this.closedLeftBar], mode: LevelModes.left };
		return [this.selectionBarLayer];
	}
	resizeHeaders(mixerH: number, viewWidth: number, viewHeight: number, tz: number) {
		console.log('resizeHeaders');
		let rh = viewHeight * zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom - 1;
		let ry = -(rh - mixerH) / 2;
		this.openedLeftBar.yy = ry;
		this.openedLeftBar.hh = rh;
		this.closedLeftBar.yy = ry;
		this.closedLeftBar.hh = rh;
		for (let ii = 0; ii < this.backgroundLinks.length; ii++) {
			this.backgroundLinks[ii].y = ry;
			this.backgroundLinks[ii].h = rh;
		}
		this.reShowLeftPanel(viewWidth, viewHeight);
	}
	fillTrackHeaders(data: MZXBX_Project) {
		console.log('fillTrackHeaders');
		let mixm: MixerDataMath = new MixerDataMath(data);
		this.openedLeftPanel.translation = { x: 0, y: mixm.gridTop() };
		this.closedLeftPanel.translation = { x: 0, y: mixm.gridTop() };
	}
}
