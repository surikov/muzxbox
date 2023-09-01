declare function createTileLevel(): TileLevelBase;

type RenderedPart = {
	setupUI: () => void;
	resetUI: (data: MixerData) => void;
	deleteUI: () => void;
};
type RenderedLayers = RenderedPart & {
	allLayers: () => TileLayerDefinition[];
} ;
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
class UIRenderer implements RenderedPart {
	toolbar: UIToolbar;
	//mixer: MixerUI;
	debug: RenderedLayers;
	tileRenderer: TileLevelBase;
	tileLevelSVG: SVGElement;

	setupUI() {
		this.tileRenderer = createTileLevel();
		this.tileLevelSVG = (document.getElementById("tileLevelSVG") as any) as SVGElement;
		let layers: TileLayerDefinition[] = [];
		this.debug = new DebugLayerUI();
		this.debug.setupUI();
		layers = layers.concat(this.debug.allLayers());
		//this.mixer = new MixerUI();
		//layers = layers.concat(this.mixer.buildDebugLayers());

		console.log(layers.length, layers);


		this.tileRenderer.initRun(this.tileLevelSVG
			, false
			, 1
			, 1
			, 0.25, 4, 256 - 1
			, layers);
		this.tileRenderer.setAfterZoomCallback(() => { console.log(this.tileRenderer.getCurrentPointPosition()) });
	}

	resetUI(data: MixerData) {
		let mixm: MixerDataMath = new MixerDataMath(data);
		this.tileRenderer.resetInnerSize(mixm.wholeWidth(), mixm.wholeHeight());

		//this.mixer.resetMixeUI(data);
		this.debug.resetUI(data);

		this.tileRenderer.resetModel();
	}
	deleteUI() {

	}
}
