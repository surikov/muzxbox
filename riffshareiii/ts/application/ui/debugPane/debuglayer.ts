class DebugLayerUI implements RenderedLayers {
	debugRectangle: TileRectangle;
	debugAnchor: TileAnchor;
	debugGroup: SVGElement;
	debugLayer: TileLayerDefinition;
	allLayers(): TileLayerDefinition[] {
		return [this.debugLayer];
	}
	setupUI() {
		this.debugRectangle = { x: 0, y: 0, w: 1, h: 1, rx: 10, ry: 10, css: 'debug' };
		this.debugGroup = (document.getElementById("debugLayer") as any) as SVGElement;
		this.debugAnchor = { xx: 0, yy: 0, ww: 1, hh: 1, showZoom: zoomPrefixLevelsCSS[0].zoom, hideZoom: zoomPrefixLevelsCSS[10].zoom, content: [
			this.debugRectangle
			,{ x: 0.25, y: 0, w: 0.25, h:0.25, css: 'debug' }
			,{ x: 0.5, y: 0, w: 0.5, h: 0.5, css: 'debug' }
			,{ x: 1, y: 0, w: 1, h: 1, css: 'debug' }
			,{ x: 2, y: 0, w: 2, h: 2, css: 'debug' }
			,{ x: 4, y: 0, w: 4, h: 4, css: 'debug' }
			,{ x: 8, y: 0, w: 8, h: 8, css: 'debug' }
			,{ x: 16, y: 0, w: 16, h: 16, css: 'debug' }
			,{ x: 32, y: 0, w: 32, h: 32, css: 'debug' }
			,{ x: 64, y: 0, w: 64, h: 64, css: 'debug' }
			,{ x: 128, y: 0, w: 128, h: 128, css: 'debug' }
			,{ x: 256, y: 0, w: 256, h: 256, css: 'debug' }
		] };
		this.debugLayer = {
			g: this.debugGroup, anchors: [
					this.debugAnchor
			], mode: LevelModes.normal
		};
	}
	resetUI(data: MixerData) {
		let mixm: MixerDataMath = new MixerDataMath(data);
		let ww = mixm.wholeWidth();
		let hh = mixm.wholeHeight();
		this.debugRectangle.w = ww;
		this.debugRectangle.h = hh;
		this.debugAnchor.ww = ww;
		this.debugAnchor.hh = hh;
		console.log('debugLayer',this.debugLayer);
	}
	deleteUI() {

	}
}