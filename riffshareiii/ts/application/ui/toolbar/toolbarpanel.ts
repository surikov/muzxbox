class UIToolbar {
    toolBarAnchor: TileAnchor;
    toolBarGroup: SVGElement;
    toolBarLayer: TileLayerDefinition;
    menuButton: ToolBarButton;

    constructor(){
		//
    }
    createToolbar():TileLayerDefinition[]{
        this.menuButton = new ToolBarButton([icon_ver_menu], 1, 0, (nn: number) => {
            globalCommandDispatcher.resetAnchor(this.toolBarGroup, this.toolBarAnchor, LevelModes.overlay);
            globalCommandDispatcher.showRightMenu();
        });
        this.toolBarGroup = (document.getElementById("toolBarPanelGroup") as any) as SVGElement;
        this.toolBarAnchor = {
            xx: 0, yy: 0, ww: 111, hh: 111
            , showZoom: zoomPrefixLevelsCSS[0].minZoom
            , hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length-1].minZoom
            , content: [
                this.menuButton.iconLabelButton.anchor
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
    }
}
