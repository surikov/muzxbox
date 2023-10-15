declare function createTileLevel(): TileLevelBase;
/*
type RenderedPart = {
	setupUI: () => void;
	resetUI: (data: MixerData) => void;
	deleteUI: () => void;
};
type RenderedLayers = RenderedPart & {
	allLayers: () => TileLayerDefinition[];
};
*/
let zoomPrefixLevelsCSS: { prefix: string, zoom: number }[] = [
    { prefix: '025', zoom: 0.25 }//0
    , { prefix: '05', zoom: 0.5 }//1
    , { prefix: '1', zoom: 1 }//2
    , { prefix: '2', zoom: 2 }//3
    , { prefix: '4', zoom: 4 }//4
    , { prefix: '8', zoom: 8 }//5
    , { prefix: '16', zoom: 16 }//6
    , { prefix: '32', zoom: 32 }//7
    , { prefix: '64', zoom: 64 }//8
    , { prefix: '128', zoom: 128 }//9
    , { prefix: '256', zoom: 256 }//10
];
class UIRenderer {//} implements RenderedPart {
    toolbar: UIToolbar;
    menu: RightMenuPanel;
    //mixer: MixerUI;
    debug: DebugLayerUI;
    tiler: TileLevelBase;
    tileLevelSVG: SVGElement;
    resetAnchor: (parentSVGGroup: SVGElement, anchor: TileAnchor, layerMode: LevelModes) => void
        = (parentSVGGroup: SVGElement, anchor: TileAnchor, layerMode: LevelModes): void => {
            this.tiler.resetAnchor(parentSVGGroup, anchor, layerMode);
        };

    createUI() {
        this.tiler = createTileLevel();
        this.tileLevelSVG = (document.getElementById("tileLevelSVG") as any) as SVGElement;
        let layers: TileLayerDefinition[] = [];
        this.debug = new DebugLayerUI();
        this.debug.setupUI();
        this.toolbar = new UIToolbar();
        //this.toolbar.createToolbar(()=>{
        //	this.toolbar.reRenderToolbar(this.tiler);
        //});
        this.menu = new RightMenuPanel();
        let me = this;
        let actionShowMenu: () => void = function () {
            let vw = me.tileLevelSVG.clientWidth / me.tiler.tapPxSize();
            let vh = me.tileLevelSVG.clientHeight / me.tiler.tapPxSize();
            me.menu.showState = true;
            me.menu.resizeMenu(vw, vh);
            me.tiler.resetAnchor(me.menu.menuGroup, me.menu.menuAnchor, LevelModes.overlay);
        };
        layers = layers.concat(
            this.debug.allLayers()
            //, this.toolbar.toolBarLayers()
            , this.toolbar.createToolbar(this.resetAnchor, actionShowMenu)
            , this.menu.createMenu(this.resetAnchor)
        );

        //this.mixer = new MixerUI();
        //layers = layers.concat(this.mixer.buildDebugLayers());

        console.log(layers.length, layers);


        this.tiler.initRun(this.tileLevelSVG
            , false
            , 1
            , 1
            , 0.25, 4, 256 - 1
            , layers);
        this.tiler.setAfterZoomCallback(() => {
            //console.log('afterZoomCallback', this.tileRenderer.getCurrentPointPosition());
        });
        this.tiler.setAfterResizeCallback(() => {
            //console.log('afterResizeCallback',this.tileRenderer.getCurrentPointPosition()) ;

            this.onReSizeView();
        });
    }

    fillUI(data: MixerData) {
        let mixm: MixerDataMath = new MixerDataMath(data);
        let vw = this.tileLevelSVG.clientWidth / this.tiler.tapPxSize();
        let vh = this.tileLevelSVG.clientHeight / this.tiler.tapPxSize();
        this.tiler.resetInnerSize(mixm.wholeWidth(), mixm.wholeHeight());

        //this.mixer.resetMixeUI(data);
        this.debug.resetDebugView(data);

        //this.toolbar.fillToolbar(vw, vh);
        this.toolbar.resizeToolbar(vw, vh);

        this.menu.fillMenu(vw, vh);
        this.menu.resizeMenu(vw, vh);

        this.tiler.resetModel();
    }
    onReSizeView() {
        console.log('onReSizeView');
        let vw = this.tileLevelSVG.clientWidth / this.tiler.tapPxSize();
        let vh = this.tileLevelSVG.clientHeight / this.tiler.tapPxSize();
        this.toolbar.resizeToolbar(vw, vh);
        //this.toolbar.reRenderToolbar(this.tiler);
        this.tiler.resetAnchor(this.toolbar.toolBarGroup, this.toolbar.toolBarAnchor, LevelModes.overlay);
        this.menu.resizeMenu(vw, vh);
        //this.menu.reRenderMenu(this.tiler);
        this.tiler.resetAnchor(this.menu.menuGroup, this.menu.menuAnchor, LevelModes.overlay);
    }
    deleteUI() {

    }
}
