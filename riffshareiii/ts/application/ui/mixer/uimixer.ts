class MixerUI {
    svgs: SVGElement[] = [];
    zoomLayers: TileLayerDefinition[] = [];
    zoomAnchors: TileAnchor[] = [];
    levels: MixerLevel[] = [];
    resetMixeUI(data: MixerData) {
        let mixm: MixerDataMath = new MixerDataMath(data);
        let ww = mixm.wholeWidth();
        let hh = mixm.wholeHeight();
        for (let ii = 0; ii < this.zoomAnchors.length; ii++) {
            this.zoomAnchors[ii].ww = ww;
            this.zoomAnchors[ii].hh = hh;
            this.levels[ii].build(ww, hh);
        }
    }
    buildMixerLayers(): TileLayerDefinition[] {
        for (let ii = 0; ii < zoomPrefixLevelsCSS.length - 1; ii++) {
            this.svgs.push((document.getElementById("tracksLayerZoom" + zoomPrefixLevelsCSS[ii].prefix) as any) as SVGElement);
            this.zoomAnchors.push({ showZoom: zoomPrefixLevelsCSS[ii].zoom, hideZoom: zoomPrefixLevelsCSS[ii + 1].zoom, xx: 0, yy: 0, ww: 1, hh: 1, content: [] });
            this.zoomLayers.push({ g: this.svgs[ii], anchors: [this.zoomAnchors[ii]], mode: LevelModes.normal });
            this.levels.push(new MixerLevel(zoomPrefixLevelsCSS[ii].prefix
                , zoomPrefixLevelsCSS[ii].zoom, zoomPrefixLevelsCSS[ii + 1].zoom
                , this.zoomAnchors[ii]));
        }
        return this.zoomLayers;
    }
}
