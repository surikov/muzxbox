class WarningUI {
	warningRectangle: TileRectangle;
	warningAnchor: TileAnchor;
	warningGroup: SVGElement;
	warningLayer: TileLayerDefinition;
	warningIcon: TileText;
	warningTitle: TileText;
	warningDescription: TileText;
	cancel: () => void = function () {
		this.hide();
	};
	initDialogUI() {
		this.warningIcon = { x: 0, y: 0, text: icon_warningPlay, css: 'warningIcon' };
		this.warningTitle = { x: 0, y: 0, text: 'Title', css: 'warningTitle' };
		this.warningDescription = { x: 0, y: 0, text: 'Some optional text information.', css: 'warningDescription' };
		this.warningGroup = (document.getElementById("warningDialogGroup") as any) as SVGElement;
		this.warningRectangle = { x: 0, y: 0, w: 1, h: 1, css: 'warningBG', activation: this.cancel.bind(this) };
		this.warningAnchor = {
			id: 'warningAnchor', xx: 0, yy: 0, ww: 1, hh: 1, showZoom: zoomPrefixLevelsCSS[0].zoom, hideZoom: zoomPrefixLevelsCSS[10].zoom
			, content: [this.warningRectangle, this.warningIcon, this.warningTitle, this.warningDescription]
		};
		this.warningLayer = { g: this.warningGroup, anchors: [this.warningAnchor], mode: LevelModes.overlay };
	}
	resetDialogView(data: MixerData) {
		console.log('resetDialogView');
		//this.resizeDialog();
	}
	resizeDialog(ww: number, hh: number) {
		console.log('resizeDialog');
		this.warningRectangle.w = ww;
		this.warningRectangle.h = hh;
		this.warningAnchor.ww = ww;
		this.warningAnchor.hh = hh;
		this.warningIcon.x = ww / 2;
		this.warningIcon.y = hh / 3;
		this.warningTitle.x = ww / 2;
		this.warningTitle.y = hh / 3 + 1.5;
		this.warningDescription.x = ww / 2;
		this.warningDescription.y = hh / 3 + 2;
		//console.log('debugLayer',this.debugLayer);
	}
	allLayers(): TileLayerDefinition[] {
		return [this.warningLayer];
	}
	show() {
		console.log('WarningUI show');
		(document.getElementById("warningAnchor") as any).style.visibility = "visible";
	}
	hide() {
		console.log('WarningUI hide');
		(document.getElementById("warningAnchor") as any).style.visibility = "hidden";
	}
}