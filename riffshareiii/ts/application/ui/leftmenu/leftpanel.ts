class LeftBar {
	selectionBarLayer: TileLayerDefinition;
	leftLayerZoom: SVGElement;
	leftBarContentAnchor: TileAnchor;
	titlesLeftBar: TileAnchor;
	backgrounds: TileRectangle[] = [];
	zoomAnchors: TileAnchor[] = [];
	titlesAnchors: TileAnchor[] = [];
	projectTitles: TileText[] = [];
	editProjectTitles: TileText[] = [];
	leftHide: boolean = true;
	panelWidth:number=5;
	constructor() {

	}
	reShowLeftPanel(viewWidth: number, viewHeight: number) {
		//console.log(this.leftHide, viewWidth, viewHeight, this.leftBarContentAnchor);
		if (this.leftHide) {
			this.leftBarContentAnchor.translation = { x: 0, y: -this.leftBarContentAnchor.hh };
			this.titlesLeftBar.translation = { x: 0, y: 0 };
		} else {
			this.leftBarContentAnchor.translation = { x: 0, y: 0 };
			this.titlesLeftBar.translation = { x: 0, y: -this.leftBarContentAnchor.hh };
		}
	}

	createLeftPanel(): TileLayerDefinition[] {

		this.leftLayerZoom = (document.getElementById("leftLayerZoom") as any) as SVGElement;
		this.leftBarContentAnchor = {
			xx: 0, yy: 0, ww: 1, hh: 1
			, showZoom: zoomPrefixLevelsCSS[0].minZoom
			, hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom
			, content: []
			, id: 'leftBarContentAnchor'
		};
		this.titlesLeftBar = {
			xx: 0, yy: 0, ww: 1, hh: 1
			, showZoom: zoomPrefixLevelsCSS[0].minZoom
			, hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom
			, content: []
			, id: 'titlesLeftBar'
		};
		for (let zz = 0; zz < zoomPrefixLevelsCSS.length - 1; zz++) {
			let bg = { x: 0, y: 0, w: this.panelWidth * zoomPrefixLevelsCSS[zz].minZoom, h: 55, css: 'leftPanelBG', id: 'hdbg' + (zz + Math.random()) };
			this.backgrounds.push(bg);
			let edittitle: TileText = { x: this.panelWidth * zoomPrefixLevelsCSS[zz].minZoom, y: 22, text: 'Debug title string', css: 'leftBarProjectTitle' + zoomPrefixLevelsCSS[zz].prefix };
			this.editProjectTitles.push(edittitle);
			let zoomAnchor = {
				xx: 0, yy: 0, ww: 1, hh: 1
				, showZoom: zoomPrefixLevelsCSS[zz].minZoom
				, hideZoom: zoomPrefixLevelsCSS[zz + 1].minZoom
				, content: [bg,edittitle]
				, id: 'head' + (zz + Math.random())
			};
			this.zoomAnchors.push(zoomAnchor);
			this.leftBarContentAnchor.content.push(zoomAnchor);

			let protitle: TileText = { x: 0, y: 22, text: 'Debug title string', css: 'leftReadProjectTitle' + zoomPrefixLevelsCSS[zz].prefix };
			this.projectTitles.push(protitle);
			let titleAnchor = {
				xx: 0, yy: 0, ww: 1, hh: 1
				, showZoom: zoomPrefixLevelsCSS[zz].minZoom
				, hideZoom: zoomPrefixLevelsCSS[zz + 1].minZoom
				, content: [ protitle]
				, id: 'title' + (zz + Math.random())
			};
			this.titlesAnchors.push(titleAnchor);
			this.titlesLeftBar.content.push(titleAnchor);
		}
		this.selectionBarLayer = { g: this.leftLayerZoom, anchors: [this.leftBarContentAnchor, this.titlesLeftBar], mode: LevelModes.left };
		return [this.selectionBarLayer];
	}
	resizeHeaders(mixerH: number, viewWidth: number, viewHeight: number, tz: number) {
		let rh = viewHeight * zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom - 1;
		let ry = -(rh - mixerH) / 2;
		this.leftBarContentAnchor.yy = ry;
		this.leftBarContentAnchor.hh = rh;
		this.titlesLeftBar.yy = ry;
		this.titlesLeftBar.hh = rh;
		for (let ii = 0; ii < this.zoomAnchors.length; ii++) {
			this.zoomAnchors[ii].yy = ry;
			this.zoomAnchors[ii].hh = rh;
			this.backgrounds[ii].y = ry;
			this.backgrounds[ii].h = rh;
			this.titlesAnchors[ii].yy = ry;
			this.titlesAnchors[ii].hh = rh;
		}
		this.reShowLeftPanel(viewWidth, viewHeight);
	}
	fillTrackHeaders(data: MZXBX_Project) {
		let mixm: MixerDataMath = new MixerDataMath(data);
		for (let ii = 0; ii < this.projectTitles.length; ii++) {
			this.projectTitles[ii].y = mixm.gridTop();
			this.projectTitles[ii].text = data.title;
			this.editProjectTitles[ii].y = mixm.gridTop();
			this.editProjectTitles[ii].text = data.title;
		}
	}
}
