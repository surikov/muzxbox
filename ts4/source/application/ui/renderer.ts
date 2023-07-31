declare function createTileLevel(): TileLevelBase;
class UIRenderer {
	toolbar: UIToolbar;
	mixer: MixerUI;
	debug: DebugLayer
	tileRenderer: TileLevelBase;
	tileLevelSVG: SVGElement;
	setupUI() {
		this.tileRenderer = createTileLevel();
		this.tileLevelSVG = (document.getElementById("tileLevelSVG") as any) as SVGElement;
		let layers: TileLayerDefinition[] = [];
		//let debugGroup = (document.getElementById("debugLayer") as any) as SVGElement;

		//let debugAnchor1: TileAnchor = { xx: 0, yy: 0, ww: 1000, hh: 1000, showZoom: 16, hideZoom: 256, content: [] };
		//let debugAnchor2: TileAnchor = { xx: 0, yy: 0, ww: 1000, hh: 1000, showZoom: 1, hideZoom: 16, content: [] };
		//let debugAnchor: TileAnchor = { xx: 0, yy: 0, ww: this.constentWidth(), hh: this.constentHeight()
		//    , showZoom: 0.25, hideZoom: 256, content: [] };
		//let debugRectangle: TileRectangle = { x: 0, y: 0, w: this.constentWidth(), h: this.constentHeight(), rx: this.constentWidth() / 8, ry: this.constentWidth() / 8, css: 'debug' };
		//debugAnchor.content.push(debugRectangle);
		//let zoom1_2Anchor: TileAnchor = { xx: 0, yy: 0, ww: this.constentWidth(), hh: this.constentHeight(), showZoom: 1, hideZoom: 2, content: [] };
		//debugAnchor.content.push(zoom1_2Anchor);
		//this.testAddRectangles(debugAnchor1, 0, 0, 512, 16, 128, 128);
		//this.testAddRectangles(debugAnchor2, 0, 0, 128, 1, 8, 8);
		//console.log('debugAnchor', debugAnchor);
		/*
		this.createTestMixerTracks(debugAnchor, 1, 1, 2, 256);
		let debugLayer: TileLayerDefinition = {
			g: debugGroup, anchors: [debugAnchor], mode: LevelModes.normal
		};
		layers.push(debugLayer);
		*/
		this.debug = new DebugLayer();
		layers = layers.concat(this.debug.buildDebugLayers());
		this.mixer = new MixerUI();
		layers = layers.concat(this.mixer.buildDebugLayers());

		console.log(layers.length, layers);


		this.tileRenderer.initRun(this.tileLevelSVG
			, false
			, 1//this.constentWidth()
			, 1//this.constentHeight()
			, 0.25, 4, 256 - 1
			, layers);
		this.tileRenderer.setAfterZoomCallback(() => { console.log(this.tileRenderer.getCurrentPointPosition()) });
	}
	/*createTestMixerTracks(anchor: TileAnchor, minZoom: number, showZoom: number, hideZoom: number, maxZoom: number) {
		let debugRectangle: TileRectangle = { x: 0, y: 0, w: this.constentWidth(), h: this.constentHeight(), rx: this.constentWidth() / 8, ry: this.constentHeight() / 8, css: 'debug' };
		anchor.content.push(debugRectangle);
		for (let tt = 0; tt < 16; tt++) {
			let trackRectangle: TileRectangle = { x: 0, y: 12 * 10 * tt, w: this.constentWidth(), h: 12 * 10 - 5, rx: 22, ry: 22, css: 'debug' };
			anchor.content.push(trackRectangle);
			for (let mm = 0; mm < 200; mm++) {
				let measureRectangle: TileRectangle = { x: mm * 32, y: 12 * 10 * tt, w: 32 - 1, h: 12 * 10 - 2, rx: 5, ry: 5, css: 'debug' };
				anchor.content.push(measureRectangle);
			}
			for (let oo = 0; oo < 12; oo++) {
				let oktaRectangle: TileRectangle = { x: 0, y: 12 * 10 * tt+oo*12, w: this.constentWidth(), h: 12  - 1, rx: 3, ry:3, css: 'debug' };
				anchor.content.push(oktaRectangle);
			}
		}
	}*/
	/*testAddRectangles(anchor: TileAnchor, xx: number, yy: number, size: number, stopMinZoom: number, startMaxZoom: number, maxZoom: number) {
		let rr = 2;
		for (let ix = 0; ix < rr; ix++) {
			for (let iy = 0; iy < rr; iy++) {
				//let rectangle: TileRectangle = { x: xx + ix * size, y: yy + iy * size, w: size, h: size, rx: size * 0.5, ry: size * 0.5, css: 'debug' };
				//let reAnchor: TileAnchor = { xx: xx + ix * size, yy: yy + iy * size, ww: size, hh: size, showZoom: startMaxZoom, hideZoom: startMaxZoom * 2, content: [rectangle] };
				//anchor.content.push(reAnchor);

				if (startMaxZoom / 2 >= stopMinZoom) {
					let subAnchot: TileAnchor = { xx: xx + ix * size, yy: yy + iy * size, ww: size, hh: size, showZoom: stopMinZoom, hideZoom: maxZoom, content: [] };
					anchor.content.push(subAnchot);
					this.testAddRectangles(subAnchot, xx + ix * size, yy + iy * size, size / 2, stopMinZoom, startMaxZoom / 2, maxZoom);

				}
			}
		}
		let rectangle: TileRectangle = { x: xx, y: yy, w: size / 2, h: size / 2, rx: size * 0.25, ry: size * 0.25, css: 'debug' };
		let reAnchor: TileAnchor = { xx: xx, yy: yy, ww: size, hh: size, showZoom: startMaxZoom, hideZoom: startMaxZoom * 2, content: [rectangle] };
		anchor.content.push(reAnchor);

		let label: TileText = { x: xx, y: yy + startMaxZoom, text: '' + xx + ':' + yy + '/' + startMaxZoom, style: 'font-size: ' + startMaxZoom + 'cm;' };
		let txAnchor: TileAnchor = { xx: xx, yy: yy, ww: size, hh: size, showZoom: startMaxZoom, hideZoom: startMaxZoom * 2, content: [label] };
		anchor.content.push(txAnchor);
	}*/
	resetUI(data: MixerData) {
		let mixm: MixerDataMath = new MixerDataMath(data);
		this.tileRenderer.resetInnerSize(mixm.wholeWidth(), mixm.wholeHeight());
		
		this.mixer.resetMixeUI(data);
		this.debug.resetDebugLayer(data);

		this.tileRenderer.resetModel();
	}
	/*constentWidth() {
		return 32 * 200;
	}
	constentHeight() {
		return 12 * 10 * 16;
	}*/
}
