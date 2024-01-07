
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
type GridTimeTemplate14 = {
    ratio: number
    , duration: MZXBX_Metre
    , label?: boolean
};
let gridLinesBrief: GridTimeTemplate14[] = [
    { ratio: 0.4, duration: { count: 1, part: 2 } }
];
let gridLinesAccurate: GridTimeTemplate14[] = [
    { ratio: 0.2, duration: { count: 1, part: 8 } }
    , { ratio: 0.2, duration: { count: 1, part: 8 } }
    , { ratio: 0.2, duration: { count: 1, part: 8 } }
    , { ratio: 0.4, duration: { count: 1, part: 8 }, label: true }
];
let gridLinesDtailed: GridTimeTemplate14[] = [
    { ratio: 0.1, duration: { count: 1, part: 16 } }
    , { ratio: 0.1, duration: { count: 1, part: 16 } }
    , { ratio: 0.1, duration: { count: 1, part: 16 } }
    , { ratio: 0.2, duration: { count: 1, part: 16 }, label: true }
    , { ratio: 0.1, duration: { count: 1, part: 16 } }
    , { ratio: 0.1, duration: { count: 1, part: 16 } }
    , { ratio: 0.1, duration: { count: 1, part: 16 } }
    , { ratio: 0.4, duration: { count: 1, part: 16 }, label: true }
];
let gridLinesExplicit: GridTimeTemplate14[] = [
    { ratio: 0.1, duration: { count: 1, part: 32 } }
    , { ratio: 0.1, duration: { count: 1, part: 32 } }
    , { ratio: 0.1, duration: { count: 1, part: 32 } }
    , { ratio: 0.1, duration: { count: 1, part: 32 }, label: true }
    , { ratio: 0.1, duration: { count: 1, part: 32 } }
    , { ratio: 0.1, duration: { count: 1, part: 32 } }
    , { ratio: 0.1, duration: { count: 1, part: 32 } }
    , { ratio: 0.2, duration: { count: 1, part: 32 }, label: true }
    , { ratio: 0.1, duration: { count: 1, part: 32 } }
    , { ratio: 0.1, duration: { count: 1, part: 32 } }
    , { ratio: 0.1, duration: { count: 1, part: 32 } }
    , { ratio: 0.1, duration: { count: 1, part: 32 }, label: true }
    , { ratio: 0.1, duration: { count: 1, part: 32 } }
    , { ratio: 0.1, duration: { count: 1, part: 32 } }
    , { ratio: 0.1, duration: { count: 1, part: 32 } }
    , { ratio: 0.4, duration: { count: 1, part: 32 }, label: true }
];
let zoomPrefixLevelsCSS: {
    prefix: string, minZoom: number, gridLines: GridTimeTemplate14[]
}[] = [
        { prefix: '025', minZoom: 0.25, gridLines: gridLinesExplicit }//0
        , { prefix: '05', minZoom: 0.5, gridLines: gridLinesDtailed }//1
        , { prefix: '1', minZoom: 1, gridLines: gridLinesAccurate }//2
        , { prefix: '2', minZoom: 2, gridLines: gridLinesBrief }//3
        , { prefix: '4', minZoom: 4, gridLines: [] }//4
        , { prefix: '8', minZoom: 8, gridLines: [] }//5
        , { prefix: '16', minZoom: 16, gridLines: [] }//6
        , { prefix: '32', minZoom: 32, gridLines: [] }//7
        , { prefix: '64', minZoom: 64, gridLines: [] }//8
        , { prefix: '128', minZoom: 128, gridLines: [] }//9
        //, { prefix: '256', zoom: 256,svg:'tracksLayerZoom025' }//10
    ];
class UIRenderer {//} implements RenderedPart {
    toolbar: UIToolbar;
    menu: RightMenuPanel;
    mixer: MixerUI;
    debug: DebugLayerUI;
    warning: WarningUI;
    timeselectbar: TimeSelectBar;
    //leftBar: LeftBar;
    tiler: TileLevelBase;
    tileLevelSVG: SVGElement;
    //commands: CommandDispatcher;
    lastUsedData: MZXBX_Project;
    constructor() {
        //this.commands = commands;
        commandDispatcher.registerUI(this);
    }
	/* resetAnchor: (parentSVGGroup: SVGElement, anchor: TileAnchor, layerMode: LevelModes) => void
		 = (parentSVGGroup: SVGElement, anchor: TileAnchor, layerMode: LevelModes): void => {
			 this.tiler.resetAnchor(parentSVGGroup, anchor, layerMode);
		 };*/
    changeTapSIze(ratio: number) {
        console.log('changeTapSIze', ratio, this);
        this.tiler.setupTapSize(ratio);
        this.onReSizeView();
        this.tiler.resetModel();
    }
    createUI() {
        this.tiler = createTileLevel();

        this.tileLevelSVG = (document.getElementById("tileLevelSVG") as any) as SVGElement;
        let layers: TileLayerDefinition[] = [];
        this.debug = new DebugLayerUI();
        this.debug.setupUI();
        this.warning = new WarningUI();
        this.warning.initDialogUI();
        this.toolbar = new UIToolbar();
        this.timeselectbar = new TimeSelectBar();
        //this.leftBar = new LeftBar();
        //this.toolbar.createToolbar(()=>{
        //	this.toolbar.reRenderToolbar(this.tiler);
        //});
        this.menu = new RightMenuPanel();
        this.mixer = new MixerUI();
        let me = this;
		/*let actionShowMenu: () => void = function () {
			let vw = me.tileLevelSVG.clientWidth / me.tiler.tapPxSize();
			let vh = me.tileLevelSVG.clientHeight / me.tiler.tapPxSize();
			me.menu.showState = !me.menu.showState;
			me.menu.resizeMenu(vw, vh);
			me.menu.resetAllAnchors();
		};*/
        layers = layers.concat(
            this.debug.allLayers()
            //, this.toolbar.toolBarLayers()
            , this.toolbar.createToolbar()//this.resetAnchor, actionShowMenu)
            , this.menu.createMenu()//this.resetAnchor.bind(this), this.changeTapSIze.bind(this))
            , this.mixer.createMixerLayers()
            , this.warning.allLayers()
            , this.timeselectbar.createTimeScale()
            //, this.leftBar.createLeftPanel()
        );

        //this.mixer = new MixerUI();
        //layers = layers.concat(this.mixer.buildDebugLayers());

        //console.log('layers', layers.length, layers);


        this.tiler.initRun(this.tileLevelSVG
            , true
            , 1
            , 1
            , zoomPrefixLevelsCSS[0].minZoom
            , zoomPrefixLevelsCSS[Math.floor(zoomPrefixLevelsCSS.length / 2)].minZoom
            , zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom - 1
            , layers);
        //console.log('tap size', this.tiler.tapPxSize());
        this.tiler.setAfterZoomCallback(() => {
            //console.log('afterZoomCallback', this.tiler.getCurrentPointPosition());
            if (this.menu) {
                this.menu.lastZ = this.tiler.getCurrentPointPosition().z;
            }
        });
        this.tiler.setAfterResizeCallback(() => {
            //console.log('afterResizeCallback',this.tiler.getCurrentPointPosition()) ;

            this.onReSizeView();
        });
    }

    fillWholeUI() {
        let mixm: MixerDataMath = new MixerDataMath(commandDispatcher.workData);
        let vw = this.tileLevelSVG.clientWidth / this.tiler.tapPxSize();
        let vh = this.tileLevelSVG.clientHeight / this.tiler.tapPxSize();
        this.tiler.resetInnerSize(mixm.mixerWidth(), mixm.mixerHeight());

        this.mixer.reFillMixerUI(commandDispatcher.workData);

        this.debug.resetDebugView(commandDispatcher.workData);

        //this.toolbar.fillToolbar(vw, vh);
        this.toolbar.resizeToolbar(vw, vh);

        //this.menu.fillMenuItems();
        this.menu.readCurrentSongData(commandDispatcher.workData);
        this.menu.resizeMenu(vw, vh);
        //this.menu.rerenderContent();
        //this.warning.resetDialogView(data);
        this.warning.resizeDialog(vw, vh);


        this.timeselectbar.fillTimeBar(commandDispatcher.workData);
        this.timeselectbar.resizeTimeScale(vw, vh);

        //this.leftBar.resizeHeaders(mixm.mixerHeight(), vw, vh, this.tiler.getCurrentPointPosition().z);
        //this.leftBar.fillTrackHeaders(data);

        this.tiler.resetModel();

        //console.log('fillWholeUI',this.tiler);

    }
    onReSizeView() {
        //console.log('onReSizeView');
        let mixH = 1;
        if (this.lastUsedData) {
            let mixm: MixerDataMath = new MixerDataMath(this.lastUsedData);
            mixH = mixm.mixerHeight();
        }
        let vw = this.tileLevelSVG.clientWidth / this.tiler.tapPxSize();
        let vh = this.tileLevelSVG.clientHeight / this.tiler.tapPxSize();
        this.toolbar.resizeToolbar(vw, vh);
        this.tiler.resetAnchor(this.toolbar.toolBarGroup, this.toolbar.toolBarAnchor, LevelModes.overlay);
        this.menu.resizeMenu(vw, vh);
        this.menu.resetAllAnchors();
        this.warning.resizeDialog(vw, vh);
        //this.leftBar.resizeHeaders(mixH, vw, vh, this.tiler.getCurrentPointPosition().z);
    }
    deleteUI() {

    }
}
