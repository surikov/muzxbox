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
		let debugAnchor: TileAnchor = { xx: 0, yy: 0, ww: 1000, hh: 1000, showZoom: 1, hideZoom: 256, content: [] };
		debugAnchor.content.push(debugRectangle);
		this.testAddRectangles(debugAnchor, 0, 0, 64, 1, 32, 256);
		console.log('debugAnchor', debugAnchor);

		let debugLayer: TileLayerDefinition = {
			g: debugGroup, anchors: [debugAnchor], mode: LevelModes.normal
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
	testAddRectangles(anchor: TileAnchor, xx: number, yy: number, size: number, stopZoom: number, currentZoom: number, maxZoom: number) {
		let lenX=3;
		let lenY=2;
		for (let ix = 0; ix < lenX; ix++) {
			for (let iy = 0; iy < lenY; iy++) {
				let rectangle1: TileRectangle = { x: xx + ix * size, y: yy + iy * size, w: size, h: size, rx: size * 0.5, ry: size * 0.5, css: 'debug' };
				let anchor1: TileAnchor = { xx: xx + ix * size, yy: yy + iy * size, ww: size, hh: size, showZoom: currentZoom, hideZoom: currentZoom * 2, content: [rectangle1] };
				anchor.content.push(anchor1);

				if (currentZoom / 2 >= stopZoom) {
					let sub1: TileAnchor = { xx: xx + ix * size, yy: yy + iy * size, ww: size, hh: size, showZoom: stopZoom, hideZoom: maxZoom, content: [] };
					anchor.content.push(sub1);
					this.testAddRectangles(sub1, xx + ix * size, yy + iy * size, size / 2, stopZoom, currentZoom / 2, maxZoom);
				}
			}
		}

		/*let rectangle1: TileRectangle = { x: xx, y: yy, w: size, h: size, rx: size * 0.5, ry: size * 0.5, css: 'debug' };
		let anchor1: TileAnchor = { xx: xx, yy: yy, ww: size, hh: size, showZoom: currentZoom, hideZoom: currentZoom * 2, content: [rectangle1] };
		anchor.content.push(anchor1);

		let rectangle2: TileRectangle = { x: xx + size, y: yy, w: size, h: size, rx: size * 0.5, ry: size * 0.5, css: 'debug' };
		let anchor2: TileAnchor = { xx: xx + size, yy: yy, ww: size, hh: size, showZoom: currentZoom, hideZoom: currentZoom * 2, content: [rectangle2] };
		anchor.content.push(anchor2);

		let rectangle3: TileRectangle = { x: xx, y: yy + size, w: size, h: size, rx: size * 0.5, ry: size * 0.5, css: 'debug' };
		let anchor3: TileAnchor = { xx: xx, yy: yy + size, ww: size, hh: size, showZoom: currentZoom, hideZoom: currentZoom * 2, content: [rectangle3] };
		anchor.content.push(anchor3);

		let rectangle4: TileRectangle = { x: xx + size, y: yy + size, w: size, h: size, rx: size * 0.5, ry: size * 0.5, css: 'debug' };
		let anchor4: TileAnchor = { xx: xx + size, yy: yy + size, ww: size, hh: size, showZoom: currentZoom, hideZoom: currentZoom * 2, content: [rectangle4] };
		anchor.content.push(anchor4);*/

		let label: TileText = { x: xx, y: yy + currentZoom, text: '' + xx + ':' + yy + '/' + currentZoom, style: 'font-size: ' + currentZoom + 'cm;' };
		let anchor1: TileAnchor = { xx: xx + 0 * size, yy: yy + 0 * size, ww: size, hh: size, showZoom: currentZoom, hideZoom: currentZoom * 2, content: [label] };
		anchor.content.push(anchor1);

		//if (currentZoom / 2 >= stopZoom) {

			/*let sub1: TileAnchor = { xx: xx, yy: yy, ww: size, hh: size, showZoom: stopZoom, hideZoom: maxZoom, content: [] };
			let sub2: TileAnchor = { xx: xx + size, yy: yy, ww: size, hh: size, showZoom: stopZoom, hideZoom: maxZoom, content: [] };
			let sub3: TileAnchor = { xx: xx, yy: yy + size, ww: size, hh: size, showZoom: stopZoom, hideZoom: maxZoom, content: [] };
			let sub4: TileAnchor = { xx: xx + size, yy: yy + size, ww: size, hh: size, showZoom: stopZoom, hideZoom: maxZoom, content: [] };
			anchor.content.push(sub1);
			anchor.content.push(sub2);
			anchor.content.push(sub3);
			anchor.content.push(sub4);
			this.testAddRectangles(sub1, xx, yy, size / 2, stopZoom, currentZoom / 2, maxZoom);
			this.testAddRectangles(sub2, xx + size, yy, size / 2, stopZoom, currentZoom / 2, maxZoom);
			this.testAddRectangles(sub3, xx, yy + size, size / 2, stopZoom, currentZoom / 2, maxZoom);
			this.testAddRectangles(sub4, xx + size, yy + size, size / 2, stopZoom, currentZoom / 2, maxZoom);*/
		//}

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
