class RightMenuPanel {
    menuRectangle: TileRectangle;
    menuShadow: TileRectangle;
    menuAnchor: TileAnchor;
    menuGroup: SVGElement;
    menuLayer: TileLayerDefinition;
    menuCloseButton: ToolBarButton;
    showState: boolean = false;
    lastWidth: number = 0;
    lastHeight: number = 0;
    //requestReRenderToolbar: () => void;
    createMenu(resetAnchor: (parentSVGGroup: SVGElement, anchor: TileAnchor, layerMode: LevelModes) => void): TileLayerDefinition[] {
        //this.requestReRenderToolbar = requestReRenderToolbar;
        this.menuGroup = (document.getElementById("menuPanelGroup") as any) as SVGElement;
        this.menuRectangle = { x: 0, y: 0, w: 5, h: 5, css: 'rightMenuPanel' };
        this.menuShadow = { x: 0, y: 0, w: 5, h: 5, css: 'fillShadow' };
        this.menuCloseButton = new ToolBarButton(['❯'], 1, 11, (nn: number) => {
            console.log('menuCloseButton', nn);
            //this.closeMenu();
            this.showState = false;
            this.resizeMenu(this.lastWidth, this.lastHeight);
            resetAnchor(this.menuGroup,this.menuAnchor,LevelModes.overlay);
        });
        this.menuAnchor = {
            xx: 0, yy: 0, ww: 111, hh: 111, showZoom: zoomPrefixLevelsCSS[0].zoom, hideZoom: zoomPrefixLevelsCSS[10].zoom, content: [
                this.menuShadow, this.menuRectangle, this.menuCloseButton.anchor
            ]
        };
        this.menuLayer = {
            g: this.menuGroup, anchors: [
                this.menuAnchor
            ], mode: LevelModes.overlay
        };
        return [this.menuLayer];
    }
    //closeMenu() {
    //    this.showState = false;
    //    this.resizeMenu(this.lastWidth, this.lastHeight);
    //}
    fillMenu(viewWIdth: number, viewHeight: number) {
        console.log('fillMenu', viewWIdth, viewHeight);

    }
    resizeMenu(viewWIdth: number, viewHeight: number) {
        console.log('resizeMenu', viewWIdth, viewHeight);
        this.lastWidth = viewWIdth;
        this.lastHeight = viewHeight;
        let ww = viewWIdth - 1;
        if (ww > 9) ww = 9;
        if (ww < 2) {
            ww = 2;
        }
        let xx = viewWIdth - ww;
        if (!this.showState) {
            xx = viewWIdth + 1;
            this.menuCloseButton.position=-11;
        }else{
            this.menuCloseButton.position=0;
        }

        let shn = 0.05;

        this.menuShadow.x = xx - shn;
        this.menuShadow.y = -shn;
        this.menuShadow.w = ww + shn + shn;
        this.menuShadow.h = viewHeight + shn + shn;

        this.menuRectangle.x = xx;
        this.menuRectangle.y = 0;
        this.menuRectangle.w = ww;
        this.menuRectangle.h = viewHeight;

        this.menuAnchor.xx = 0;
        this.menuAnchor.yy = 0;
        this.menuAnchor.ww = viewWIdth;
        this.menuAnchor.hh = viewHeight;


        
        this.menuCloseButton.resize(viewWIdth, viewHeight);
    }
    //reRenderMenu(tiler: TileLevelBase) {
    //    tiler.resetAnchor(this.menuGroup, this.menuAnchor, LevelModes.overlay);
    //}
	/*showMenu(viewWIdth: number, viewHeight: number){
		this.showState=true;
		this.resizeMenu(viewWIdth,viewHeight);
		this.requestReRenderToolbar();
	}
	hideMenu(viewWIdth: number, viewHeight: number){
		this.showState=false;
		this.resizeMenu(viewWIdth,viewHeight);
		this.requestReRenderToolbar();
	}*/
}
