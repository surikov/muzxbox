declare function createTileLevel(): TileLevelBase;
class UIRenderer {
	toolbar: UIToolbar;
	mixer: MixerUI;
	tileRenderer: TileLevelBase;
	tileLevelSVG: SVGElement;
	setupUI() {
		this.tileRenderer = createTileLevel();
		this.tileLevelSVG = (document.getElementById("tileLevelSVG") as any) as SVGElement;
		let layers: TileLayerDefinition[] = [];
		let debugGroup = (document.getElementById("debugLayer") as any) as SVGElement;
		let debugRectangle: TileRectangle = { x: 0, y: 0, w: 1000, h: 1000, rx: 100, ry: 100, css: 'debug' };
		let debugAnchor1: TileAnchor = { xx: 0, yy: 0, ww: 1000, hh: 1000, showZoom: 16, hideZoom: 256, content: [] };
		let debugAnchor2: TileAnchor = { xx: 0, yy: 0, ww: 1000, hh: 1000, showZoom: 1, hideZoom: 16, content: [] };
		debugAnchor1.content.push(debugRectangle);
		this.testAddRectangles(debugAnchor1, 0, 0, 512, 16, 128, 128);
		this.testAddRectangles(debugAnchor2, 0, 0, 128, 1, 8, 8);
		//console.log('debugAnchor', debugAnchor);

		let debugLayer: TileLayerDefinition = {
			g: debugGroup, anchors: [debugAnchor1, debugAnchor2], mode: LevelModes.normal
		};
		layers.push(debugLayer);
		this.mixer = new MixerUI();
		this.tileRenderer.initRun(this.tileLevelSVG
			, false
			, this.constentWidth()
			, this.constentWidth()
			, 1, 4, 256 - 1
			, layers);
		this.tileRenderer.setAfterZoomCallback(() => { console.log(this.tileRenderer.getCurrentPointPosition()) });
	}
	testAddRectangles(anchor: TileAnchor, xx: number, yy: number, size: number, stopMinZoom: number, startMaxZoom: number, maxZoom: number) {
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
	}
	resetUI() {
		this.mixer.resetMixeUI();
	}
	constentWidth() {
		return 1000;
	}
	constentHeight() {
		return 1000;
	}
}
