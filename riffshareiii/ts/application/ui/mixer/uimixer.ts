class MixerUI {
    //svgs: SVGElement[] = [];
    //svg: SVGElement ;
    //zoomLayers: TileLayerDefinition[] = [];
    zoomLayer: TileLayerDefinition;
    levels: MixerZoomLevel[] = [];
    reFillMixerUI(data: MZXBX_Project) {
        let mixm: MixerDataMath = new MixerDataMath(data);
        let ww = mixm.wholeWidth();
        let hh = mixm.wholeHeight();
        for (let ii = 0; ii < zoomPrefixLevelsCSS.length - 1; ii++) {
            //this.zoomLayers[ii].anchors[0].ww = ww;
            //this.zoomLayers[ii].anchors[0].hh = hh;
            this.zoomLayer.anchors[ii].ww = ww;
            this.zoomLayer.anchors[ii].hh = hh;
            this.levels[ii].reCreateBars(data, ww, hh);
        }
    }
    createMixerLayers(): TileLayerDefinition[] {
        let svg: SVGElement = (document.getElementById('tracksLayerZoom') as any) as SVGElement;
        this.zoomLayer = { g: svg, anchors: [], mode: LevelModes.normal };
        for (let ii = 0; ii < zoomPrefixLevelsCSS.length - 1; ii++) {
            //this.svgs.push((document.getElementById(zoomPrefixLevelsCSS[ii].svg) as any) as SVGElement);
            let mixerLevelAnchor: TileAnchor = {
                showZoom: zoomPrefixLevelsCSS[ii].zoom
                , hideZoom: zoomPrefixLevelsCSS[ii + 1].zoom
                , xx: 0, yy: 0, ww: 1, hh: 1, content: []
                , id: 'mix' + (ii + Math.random())
            };
            //this.zoomLayers.push({ g: this.svgs[ii], anchors: [mixerLevelAnchor], mode: LevelModes.normal });
            this.zoomLayer.anchors.push(mixerLevelAnchor);
            this.levels.push(new MixerZoomLevel(ii, mixerLevelAnchor));
        }
        return [this.zoomLayer];
    }
}
