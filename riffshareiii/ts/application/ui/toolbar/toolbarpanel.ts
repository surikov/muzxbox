class UIToolbar {
    //toolBarRectangle: TileRectangle;
    //toolBarShadow: TileRectangle;
    toolBarAnchor: TileAnchor;
    toolBarGroup: SVGElement;
    toolBarLayer: TileLayerDefinition;
    playPauseButton: ToolBarButton;
    //infoButton: ToolBarButton;
    menuButton: ToolBarButton;
    headButton: ToolBarButton;
    //toolBarLayers(): TileLayerDefinition[] {
    //	return [this.toolBarLayer];
    //}
    //commands: CommandDispatcher;
    constructor(){//commands: CommandDispatcher) {
        //this.commands = commands;
    }
    createToolbar():TileLayerDefinition[]{//resetAnchor: (parentSVGGroup: SVGElement, anchor: TileAnchor, layerMode: LevelModes) => void
        //, actionShowMenu: () => void): TileLayerDefinition[] {
        //this.infoButton = new ToolBarButton(['?'], 0, -0.5, (nn: number) => {
        //    console.log('infoButton', nn);
        //});
        this.playPauseButton = new ToolBarButton([icon_play, icon_pause], 0, 0, (nn: number) => {
            console.log('playPauseButton', nn);
            //requestReRenderToolbar();
            commandDispatcher.resetAnchor(this.toolBarGroup, this.toolBarAnchor, LevelModes.overlay);
        });
        this.menuButton = new ToolBarButton([icon_openmenu], 0, 1, (nn: number) => {
            console.log('menuButton', nn);
            //requestReRenderToolbar();
            commandDispatcher.resetAnchor(this.toolBarGroup, this.toolBarAnchor, LevelModes.overlay);
            commandDispatcher.showRightMenu();
        });
        this.headButton = new ToolBarButton([icon_openleft, icon_closeleft], 0, -1, (nn: number) => {
            console.log('headButton', nn);
            //requestReRenderToolbar();
            commandDispatcher.resetAnchor(this.toolBarGroup, this.toolBarAnchor, LevelModes.overlay);
        });
        this.toolBarGroup = (document.getElementById("toolBarPanelGroup") as any) as SVGElement;
        //this.toolBarRectangle = { x: 0, y: 0, w: 5, h: 5, css: 'toolBarPanel' };
        //this.toolBarShadow = { x: 0, y: 0, w: 5, h: 5, css: 'fillShadow' };
        this.toolBarAnchor = {
            xx: 0, yy: 0, ww: 111, hh: 111
            , showZoom: zoomPrefixLevelsCSS[0].zoom
            , hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length-1].zoom
            , content: [
                //this.toolBarShadow
                //, this.toolBarRectangle
                this.playPauseButton.iconLabelButton.anchor
                //, this.infoButton.anchor
                , this.menuButton.iconLabelButton.anchor
                , this.headButton.iconLabelButton.anchor
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
        //console.log('resizeToolbar', viewWIdth, viewHeight);

        let shn = 0.05;
        /*
        this.toolBarShadow.x = -shn;
        this.toolBarShadow.y = viewHeight - 1 - shn;
        this.toolBarShadow.w = viewWIdth + shn + shn;
        this.toolBarShadow.h = 1 + shn + shn;

        this.toolBarRectangle.x = -1;
        this.toolBarRectangle.y = viewHeight - 1;
        this.toolBarRectangle.w = viewWIdth + 2;
        this.toolBarRectangle.h = 2;
*/
        this.toolBarAnchor.xx = 0;
        this.toolBarAnchor.yy = 0;
        this.toolBarAnchor.ww = viewWIdth;
        this.toolBarAnchor.hh = viewHeight;
        this.playPauseButton.resize(viewWIdth, viewHeight);
        //this.infoButton.resize(viewWIdth, viewHeight);
        this.menuButton.resize(viewWIdth, viewHeight);
        this.headButton.resize(viewWIdth, viewHeight);
    }
    //reRenderToolbar(tiler: TileLevelBase) {
    //    tiler.resetAnchor(this.toolBarGroup, this.toolBarAnchor, LevelModes.overlay);
    //}
}
