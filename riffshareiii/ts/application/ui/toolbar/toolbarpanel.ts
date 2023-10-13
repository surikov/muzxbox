class UIToolbar {
	toolBarRectangle: TileRectangle;
	toolBarAnchor: TileAnchor;
	toolBarGroup: SVGElement;
	toolBarLayer: TileLayerDefinition;
	playPauseButton: ToolBarButton;
	infoButton: ToolBarButton;
	menuButton: ToolBarButton;
	headButton: ToolBarButton;
	//toolBarLayers(): TileLayerDefinition[] {
	//	return [this.toolBarLayer];
	//}
	createToolbar(requestReRenderToolbar: () => void,actionShowMenu: () => void):TileLayerDefinition[] {
		this.infoButton = new ToolBarButton(['?'], 0, -0.5, (nn:number) => {
			console.log('infoButton',nn);
		});
		this.playPauseButton = new ToolBarButton(['⏵','⏸'], 0, +0.5, (nn:number) => {
			console.log('playPauseButton',nn);
			requestReRenderToolbar();
		});
		this.menuButton = new ToolBarButton(['≡','❯'], 1, 0, (nn:number) => {
			console.log('menuButton',nn);
			requestReRenderToolbar();
			actionShowMenu();
		});
		this.headButton = new ToolBarButton(['◧','☐'], -1, 0, (nn:number) => {
			console.log('headButton',nn);
			requestReRenderToolbar();
		});
		this.toolBarGroup = (document.getElementById("toolBarPanelGroup") as any) as SVGElement;
		this.toolBarRectangle = { x: 0, y: 0, w: 5, h: 5, css: 'toolBarPanel' };
		this.toolBarAnchor = {
			xx: 0, yy: 0, ww: 111, hh: 111, showZoom: zoomPrefixLevelsCSS[0].zoom, hideZoom: zoomPrefixLevelsCSS[10].zoom, content: [
				this.toolBarRectangle
				, this.playPauseButton.anchor
				, this.infoButton.anchor
				, this.menuButton.anchor
				, this.headButton.anchor
			]
		};
		this.toolBarLayer = {
			g: this.toolBarGroup, anchors: [
				this.toolBarAnchor
			], mode: LevelModes.overlay
		};
		return [this.toolBarLayer];
	}
	//fillToolbar(viewWIdth: number, viewHeight: number) {
	//	console.log('fillToolbar', viewWIdth, viewHeight);

	//}
	resizeToolbar(viewWIdth: number, viewHeight: number) {
		console.log('resizeToolbar', viewWIdth, viewHeight);
		this.toolBarRectangle.x = 0;
		this.toolBarRectangle.y = viewHeight - 1;
		this.toolBarRectangle.w = viewWIdth;
		this.toolBarRectangle.h = 1;
		this.toolBarAnchor.xx = 0;
		this.toolBarAnchor.yy = 0;
		this.toolBarAnchor.ww = viewWIdth;
		this.toolBarAnchor.hh = viewHeight;
		this.playPauseButton.resize(viewWIdth, viewHeight);
		this.infoButton.resize(viewWIdth, viewHeight);
		this.menuButton.resize(viewWIdth, viewHeight);
		this.headButton.resize(viewWIdth, viewHeight);
	}
	reRenderToolbar(tiler: TileLevelBase) {
		tiler.resetAnchor(this.toolBarGroup, this.toolBarAnchor, LevelModes.overlay);
	}
}
class ToolBarButton {
	anchor: TileAnchor;
	bg: TileRectangle;
	spot: TileRectangle;
	label: TileText;
	stick: number;
	position: number;
	labels: string[];
	action: (selection: number) => void;
	selection: number = 0;
	constructor(labels: string[], stick: number, position: number, action: (nn:number) => void) {
		this.labels = labels;
		this.build(stick, position, action);
	}
	build(stick: number, position: number, action: (selection: number) => void) {
		this.stick = stick;
		this.position = position;
		this.action = action;
		//this.labelText = labelText;
		this.bg = { x: 0, y: 0, w: 5, h: 5, rx: 0.4, ry: 0.4, css: 'toolBarButtonCircle' };
		this.spot = {
			x: 0, y: 0, w: 1, h: 1, css: 'transparentSpot', activation: (x: number, y: number) => {
				this.selection++;
				if (this.selection > this.labels.length - 1) {
					this.selection = 0;
				}
				this.label.text = this.labels[this.selection];
				this.action(this.selection);
			}
		};
		this.label = {
			x: 0, y: 0, text: this.labels[this.selection]//this.labelText
			, css: 'toolBarButtonLabel'
		}
		this.anchor = {
			xx: 0, yy: 0, ww: 111, hh: 111, showZoom: zoomPrefixLevelsCSS[0].zoom, hideZoom: zoomPrefixLevelsCSS[10].zoom, content: [
				this.bg
				, this.label
				, this.spot
			]
		};
	}
	resize(viewWIdth: number, viewHeight: number) {
		let x0 = viewWIdth / 2 - 0.5 + this.position;
		if (this.stick > 0) {
			x0 = viewWIdth - 1 - this.position;
		} else {
			if (this.stick < 0) {
				x0 = 0 + this.position;
			}
		}
		this.bg.x = x0 + 0.1;
		this.bg.y = viewHeight - 0.9;
		this.bg.w = 0.8;
		this.bg.h = 0.8;
		this.label.x = x0 + 0.5;
		this.label.y = viewHeight - 0.5 + 0.05;
		this.spot.x = x0;
		this.spot.y = viewHeight - 1;
	}
	//icon(labelText:string){
	//this.labelText = labelText;
	//	this.label.text=labelText;
	//}
}
