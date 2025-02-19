class UIToolbar {
    toolBarAnchor: TileAnchor;
    toolBarGroup: SVGElement;
    toolBarLayer: TileLayerDefinition;
    menuButton: ToolBarButton;

	undoButton: ToolBarButton;
	redoButton: ToolBarButton;

	playStopButton: ToolBarButton;

    constructor(){
		//
    }
    createToolbar():TileLayerDefinition[]{
        this.menuButton = new ToolBarButton([icon_ver_menu], 1, 0, (nn: number) => {
            globalCommandDispatcher.resetAnchor(this.toolBarGroup, this.toolBarAnchor, LevelModes.overlay);
            globalCommandDispatcher.showRightMenu();
        });
		
		this.playStopButton = new ToolBarButton([icon_play,icon_pause], -1, 0, (nn: number) => {
			globalCommandDispatcher.toggleStartStop();
        });
		this.undoButton = new ToolBarButton([icon_undo], -1, 1, (nn: number) => {
			globalCommandDispatcher.exe.undo(1);
        });
		this.redoButton = new ToolBarButton([icon_redo], -1, 2, (nn: number) => {
			globalCommandDispatcher.exe.redo(1);
        });
		
        this.toolBarGroup = (document.getElementById("toolBarPanelGroup") as any) as SVGElement;
        this.toolBarAnchor = {
            xx: 0, yy: 0, ww: 111, hh: 111
            , showZoom: zoomPrefixLevelsCSS[0].minZoom
            , hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length-1].minZoom
            , content: [
                this.menuButton.iconLabelButton.anchor
				,this.undoButton.iconLabelButton.anchor
				,this.redoButton.iconLabelButton.anchor
				,this.playStopButton.iconLabelButton.anchor
            ]
        };
        this.toolBarLayer = {
            g: this.toolBarGroup, anchors: [
                this.toolBarAnchor
            ], mode: LevelModes.overlay
        };
        return [this.toolBarLayer];
    }
    resizeToolbar(viewWIdth: number, viewHeight: number) {
        this.toolBarAnchor.xx = 0;
        this.toolBarAnchor.yy = 0;
        this.toolBarAnchor.ww = viewWIdth;
        this.toolBarAnchor.hh = viewHeight;
        this.menuButton.resize(viewWIdth, viewHeight);
		this.undoButton.resize(viewWIdth, viewHeight);
		this.redoButton.resize(viewWIdth, viewHeight);
		this.playStopButton.resize(viewWIdth, viewHeight);
    }
}
