class MixerUI {
    //svgs: SVGElement[] = [];
    //svg: SVGElement ;
    //zoomLayers: TileLayerDefinition[] = [];
    zoomLayer: TileLayerDefinition;
    levels: MixerZoomLevel[] = [];
    fillerAnchor: TileAnchor;

    reFillMixerUI(data: MZXBX_Project) {
        let mixm: MixerDataMath = new MixerDataMath(data);
        let ww = mixm.mixerWidth();
        let hh = mixm.mixerHeight();
        for (let ii = 0; ii < zoomPrefixLevelsCSS.length - 1; ii++) {
            //this.zoomLayers[ii].anchors[0].ww = ww;
            //this.zoomLayers[ii].anchors[0].hh = hh;
            this.zoomLayer.anchors[ii].ww = ww;
            this.zoomLayer.anchors[ii].hh = hh;
            this.levels[ii].reCreateBars(data);
        }
        this.fillerAnchor.xx = mixm.LeftPad;
        this.fillerAnchor.yy = mixm.gridTop();
        this.fillerAnchor.ww = mixm.mixerWidth() - mixm.LeftPad - mixm.rightPad;
        this.fillerAnchor.hh = mixm.gridHeight();
        this.reFillTracksRatio(data);
    }
    createMixerLayers(): TileLayerDefinition[] {
        let svg: SVGElement = (document.getElementById('tracksLayerZoom') as any) as SVGElement;
        this.zoomLayer = { g: svg, anchors: [], mode: LevelModes.normal };
        for (let ii = 0; ii < zoomPrefixLevelsCSS.length - 1; ii++) {
            //this.svgs.push((document.getElementById(zoomPrefixLevelsCSS[ii].svg) as any) as SVGElement);
            let mixerLevelAnchor: TileAnchor = {
                showZoom: zoomPrefixLevelsCSS[ii].minZoom
                , hideZoom: zoomPrefixLevelsCSS[ii + 1].minZoom
                , xx: 0, yy: 0, ww: 1, hh: 1, content: []
                , id: 'mix' + (ii + Math.random())
            };
            //this.zoomLayers.push({ g: this.svgs[ii], anchors: [mixerLevelAnchor], mode: LevelModes.normal });
            this.zoomLayer.anchors.push(mixerLevelAnchor);
            this.levels.push(new MixerZoomLevel(ii, mixerLevelAnchor));
        }
        this.fillerAnchor = {
            showZoom: zoomPrefixLevelsCSS[6].minZoom
            , hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom + 1
            , xx: 0, yy: 0, ww: 1, hh: 1, content: []
        };
        this.zoomLayer.anchors.push( this.fillerAnchor);
        return [this.zoomLayer];
    }
    reFillTracksRatio(data: MZXBX_Project) {
        let mixm: MixerDataMath = new MixerDataMath(data);
        let mxNotes = 0;
        for (let bb = 0; bb < data.timeline.length; bb++) {
            let notecount = 0;
            for (let tt = 0; tt < data.tracks.length; tt++) {
                let bar = data.tracks[tt].measures[bb];
                for(let cc=0;cc<bar.chords.length;cc++){
                    notecount = notecount + bar.chords[cc].notes.length;
                }
            }
            if (mxNotes < notecount) {
                mxNotes = notecount;
            }
            //console.log(bb, notecount);
        }
        //console.log(mxNotes);
        this.fillerAnchor.content = [];
        let barX=0;
        for (let bb = 0; bb < data.timeline.length; bb++) {
            let notecount = 0;
            for (let tt = 0; tt < data.tracks.length; tt++) {
                let bar = data.tracks[tt].measures[bb];
                for(let cc=0;cc<bar.chords.length;cc++){
                    notecount = notecount + bar.chords[cc].notes.length;
                }
                
            }
            let css = 'mixFiller' + (1 + Math.round(7 * notecount / mxNotes));
            let barwidth=MZMM().set(data.timeline[bb].metre).duration(data.timeline[bb].tempo) * mixm.widthDurationRatio;
            let fillRectangle: TileRectangle = {
                x: mixm.LeftPad+barX
                , y: mixm.gridTop()
                , w: barwidth
                , h: mixm.gridHeight()
                , css: css
            };
            //console.log(bb, notecount, css,fillRectangle);
            this.fillerAnchor.content.push(fillRectangle);
            barX=barX+barwidth;
        }
    }

}
