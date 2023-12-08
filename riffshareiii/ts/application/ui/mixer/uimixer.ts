class MixerUI {
	svgs: SVGElement[] = [];
	zoomLayers: TileLayerDefinition[] = [];
	//zoomAnchors: TileAnchor[] = [];
	levels: MixerZoomLevel[] = [];
	reFillMixerUI(data: MZXBX_Project) {
		let mixm: MixerDataMath = new MixerDataMath(data);
		let ww = mixm.wholeWidth();
		let hh = mixm.wholeHeight();
		//for (let ii = 0; ii < this.zoomAnchors.length; ii++) {
		for (let ii = 0; ii < zoomPrefixLevelsCSS.length - 1; ii++) {
			this.zoomLayers[ii].anchors[0].ww=ww;
			this.zoomLayers[ii].anchors[0].hh=hh;
			//this.zoomAnchors[ii].ww = ww;
			//this.zoomAnchors[ii].hh = hh;
			//this.levels[ii].buildLevel(ww, hh);
			this.levels[ii].resetBars(data, ww, hh);
		}
	}
	createMixerLayers(): TileLayerDefinition[] {
		for (let ii = 0; ii < zoomPrefixLevelsCSS.length - 1; ii++) {
			this.svgs.push((document.getElementById("tracksLayerZoom" + zoomPrefixLevelsCSS[ii].prefix) as any) as SVGElement);
			let an:TileAnchor={ showZoom: zoomPrefixLevelsCSS[ii].zoom, hideZoom: zoomPrefixLevelsCSS[ii + 1].zoom, xx: 0, yy: 0, ww: 1, hh: 1, content: [] };
			//this.zoomAnchors.push({ showZoom: zoomPrefixLevelsCSS[ii].zoom, hideZoom: zoomPrefixLevelsCSS[ii + 1].zoom, xx: 0, yy: 0, ww: 1, hh: 1, content: [] });
			this.zoomLayers.push({ g: this.svgs[ii], anchors: [an], mode: LevelModes.normal });
			this.levels.push(new MixerZoomLevel(
				//zoomPrefixLevelsCSS[ii].prefix
				//, zoomPrefixLevelsCSS[ii].zoom
				//, zoomPrefixLevelsCSS[ii + 1].zoom
				ii
				, an));
		}
		return this.zoomLayers;
	}
}
