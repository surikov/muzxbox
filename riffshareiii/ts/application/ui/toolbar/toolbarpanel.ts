class UIToolbar {
    toolBarAnchor: TileAnchor;
    toolBarGroup: SVGElement;
    toolBarLayer: TileLayerDefinition;
    playPauseButton: ToolBarButton;
    menuButton: ToolBarButton;
    headButton: ToolBarButton;
	//closeLeftButton: ToolBarButton;
    constructor(){
		//
    }
    createToolbar():TileLayerDefinition[]{
		/*this.closeLeftButton = new ToolBarButton([icon_moveleft],-1, 0, (nn: number) => {
            console.log('closeLeftButton', nn);
            //commandDispatcher.resetAnchor(this.toolBarGroup, this.toolBarAnchor, LevelModes.overlay);
        });
*/
        this.playPauseButton = new ToolBarButton([icon_play, icon_pause], 0, 0, (nn: number) => {
            console.log('playPauseButton', nn);
            commandDispatcher.resetAnchor(this.toolBarGroup, this.toolBarAnchor, LevelModes.overlay);
        });
        this.menuButton = new ToolBarButton([icon_ver_menu], 0, 1, (nn: number) => {
            console.log('menuButton', nn);
            commandDispatcher.resetAnchor(this.toolBarGroup, this.toolBarAnchor, LevelModes.overlay);
            commandDispatcher.showRightMenu();
        });
        this.headButton = new ToolBarButton([icon_openleft, icon_closeleft], 0, -1, (nn: number) => {
            commandDispatcher.resetAnchor(this.toolBarGroup, this.toolBarAnchor, LevelModes.overlay);
            commandDispatcher.toggleLeftMenu();
        });
        this.toolBarGroup = (document.getElementById("toolBarPanelGroup") as any) as SVGElement;
        this.toolBarAnchor = {
            xx: 0, yy: 0, ww: 111, hh: 111
            , showZoom: zoomPrefixLevelsCSS[0].minZoom
            , hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length-1].minZoom
            , content: [
                this.playPauseButton.iconLabelButton.anchor
                , this.menuButton.iconLabelButton.anchor
                , this.headButton.iconLabelButton.anchor
				//,this.closeLeftButton.iconLabelButton.anchor
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
        this.playPauseButton.resize(viewWIdth, viewHeight);
        this.menuButton.resize(viewWIdth, viewHeight);
        this.headButton.resize(viewWIdth, viewHeight);
		//this.closeLeftButton.resize(viewWIdth, viewHeight);
    }
}
