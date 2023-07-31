class MixerUI {
	mixerGroup: SVGElement;
	testRectangle: TileRectangle;
	mixerAnchor: TileAnchor;
	mixerLayer: TileLayerDefinition;
	tracks: MixerTrack[];
	resetMixeUI(data: MixerData) {
		let mixm: MixerDataMath = new MixerDataMath(data);
		let ww = mixm.wholeWidth();
		let hh = mixm.wholeHeight();
		this.testRectangle.w = ww;
		this.testRectangle.h = hh;
		this.mixerAnchor.ww = ww;
		this.mixerAnchor.hh = hh;
		//console.log();
		this.tracks = [];
		for (let tt = 0; tt < data.tracks.length; tt++) {
			let yy = tt * 100 * data.notePathHeight;
			let tm = new MixerTrack(yy, this.mixerAnchor,data);

			this.tracks.push(tm);
		}
	}
	buildDebugLayers(): TileLayerDefinition[] {
		this.mixerGroup = (document.getElementById("mixerLayer") as any) as SVGElement;
		this.testRectangle = { x: 0, y: 0, w: 1, h: 1, rx: 50, ry: 50, css: 'debug' };
		this.mixerAnchor = { xx: 0, yy: 0, ww: 1, hh: 1, showZoom: 0.25, hideZoom: 256, content: [this.testRectangle] };
		this.mixerLayer = { g: this.mixerGroup, anchors: [this.mixerAnchor], mode: LevelModes.normal };
		return [this.mixerLayer];
	}
}
