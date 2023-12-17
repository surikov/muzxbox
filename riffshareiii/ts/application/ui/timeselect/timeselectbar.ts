class TimeSelectBar {
    selectionBarLayer: TileLayerDefinition;
    selectionBarSVGGroup: SVGElement;
    selectBarAnchor: TileAnchor;
    zoomAnchors: TileAnchor[];
    constructor() {

    }
    createTimeScale(): TileLayerDefinition[] {
        this.selectionBarSVGGroup = (document.getElementById("timeselectbar") as any) as SVGElement;
        this.selectBarAnchor = {
            xx: 0, yy: 0, ww: 1, hh: 1
            , showZoom: zoomPrefixLevelsCSS[0].zoom
            , hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].zoom
            , content: [

            ]
        };
        this.selectionBarLayer = {
            g: this.selectionBarSVGGroup, anchors: [
                this.selectBarAnchor
            ], mode: LevelModes.top
        };
        return [this.selectionBarLayer];
    }
    resizeTimeScale(viewWIdth: number, viewHeight: number) {
        console.log('resizeTimeScale', viewWIdth, viewHeight);
        //this.selectBarAnchor.xx = 0;
        //this.selectBarAnchor.yy = 0;
        //this.selectBarAnchor.ww = viewWIdth;
        //this.selectBarAnchor.hh = viewHeight;
        /*for(let ii=0;ii<this.zoomAnchors.length;ii++){
            this.zoomAnchors[ii].ww=viewWIdth;
            this.zoomAnchors[ii].hh=viewHeight;
        }*/
    }
    fillTimeBar(data: MZXBX_Project) {
        console.log('fillTimeBar', data.timeline);
        let mixm: MixerDataMath = new MixerDataMath(data);
        this.selectBarAnchor.ww = mixm.mixerWidth();
        this.selectBarAnchor.hh = mixm.mixerHeight();
        this.zoomAnchors = [];
        //let tt:TileRectangle={x:0,y:0,w:11,h:11,css:'mixToolbarFill'};
        //this.selectBarAnchor.content.push(tt);
        for (let ii = 0; ii < zoomPrefixLevelsCSS.length - 1; ii++) {
            let selectLevelAnchor: TileAnchor = {
                showZoom: zoomPrefixLevelsCSS[ii].zoom
                , hideZoom: zoomPrefixLevelsCSS[ii + 1].zoom
                , xx: 0, yy: 0, ww: mixm.mixerWidth(), hh: mixm.mixerHeight(), content: []
                , id: 'time' + (ii + Math.random())
            };
            this.zoomAnchors.push(selectLevelAnchor);
            /*let tt: TileRectangle = {
                x: mixm.LeftPad, y: 0
                , w: zoomPrefixLevelsCSS[ii].zoom * 0.25, h: zoomPrefixLevelsCSS[ii].zoom * 2
                , css: 'mixToolbarFill'
            };
            selectLevelAnchor.content.push(tt);*/
            if (ii < 7) {
                let mm: MZXBX_MetreMathType = MZMM();
                let ww = 0;
                let cuTmp = 0;
                let cuCnt = 0;
                let cuPrt = 0;
                for (let kk = 0; kk < data.timeline.length - 1; kk++) {
                    let curBar = data.timeline[kk];
                    let curMeasureMeter = mm.set(curBar.metre);
                    let len = curMeasureMeter.duration(curBar.tempo) * data.theme.widthDurationRatio;
                    if (
                        (ii == 7 && kk % 8 == 0)
                        || (ii == 6 && kk % 4 == 0)
                        || (ii == 5 && kk % 2 == 0)
                        || (ii < 5)
                    ) {
                        if (ii < 4) {
                            let s2 = { count: 1, part: 2 };
                            let ticks: MZXBX_MetreMathType = MZMM().set(s2);
                            while (ticks.less(curMeasureMeter)) {
                                let mark2: TileRectangle = {
                                    x: mixm.LeftPad + ww + ticks.duration(curBar.tempo) * data.theme.widthDurationRatio
                                    , y: 0
                                    , w: zoomPrefixLevelsCSS[ii].zoom * 0.1
                                    , h: zoomPrefixLevelsCSS[ii].zoom * 2
                                    , css: 'timeMeasureMark'
                                };
                                selectLevelAnchor.content.push(mark2);
                                ticks = ticks.plus(s2);
                            }

                        }
                        if (ii < 3) {
                            let s4 = { count: 1, part: 4 };
                            let ticks: MZXBX_MetreMathType = MZMM().set(s4);
                            while (ticks.less(curMeasureMeter)) {
                                let mark4: TileRectangle = {
                                    x: mixm.LeftPad + ww + ticks.duration(curBar.tempo) * data.theme.widthDurationRatio
                                    , y: 0
                                    , w: zoomPrefixLevelsCSS[ii].zoom * 0.1
                                    , h: zoomPrefixLevelsCSS[ii].zoom * 1
                                    , css: 'timeMeasureMark'
                                };
                                selectLevelAnchor.content.push(mark4);
                                ticks = ticks.plus(s4);
                            }
                        }
                        if (ii < 2) {
                            let s16 = { count: 1, part: 16 };
                            let ticks: MZXBX_MetreMathType = MZMM().set(s16);
                            while (ticks.less(curMeasureMeter)) {
                                let mark16: TileRectangle = {
                                    x: mixm.LeftPad + ww + ticks.duration(curBar.tempo) * data.theme.widthDurationRatio
                                    , y: 0
                                    , w: zoomPrefixLevelsCSS[ii].zoom * 0.05
                                    , h: zoomPrefixLevelsCSS[ii].zoom * 1
                                    , css: 'timeMeasureMark'
                                };
                                selectLevelAnchor.content.push(mark16);
                                ticks = ticks.plus(s16);
                            }
                        }
                        let tt: TileRectangle = {
                            x: mixm.LeftPad + ww, y: 0
                            , w: zoomPrefixLevelsCSS[ii].zoom * 0.25, h: zoomPrefixLevelsCSS[ii].zoom * 2
                            , css: 'timeMeasureMark'
                        };
                        selectLevelAnchor.content.push(tt);
                        let nm: TileText = {
                            x: mixm.LeftPad + ww, y: zoomPrefixLevelsCSS[ii].zoom * 2, text: '' + (1 + kk)
                            , css: 'timeBarNum' + zoomPrefixLevelsCSS[ii].prefix
                        };
                        selectLevelAnchor.content.push(nm);
                        if (cuTmp != curBar.tempo || cuCnt != curBar.metre.count || cuPrt != curBar.metre.part) {
                            cuTmp = curBar.tempo;
                            cuCnt = curBar.metre.count;
                            cuPrt = curBar.metre.part;
                            let bpm: TileText = {
                                x: mixm.LeftPad + ww + len
                                , y: zoomPrefixLevelsCSS[ii].zoom * 2
                                , text: '' + Math.round(cuTmp)
                                , css: 'timeBarInfo' + zoomPrefixLevelsCSS[ii].prefix
                            };
                            selectLevelAnchor.content.push(bpm);
                            let mtr: TileText = {
                                x: mixm.LeftPad + ww + len
                                , y: zoomPrefixLevelsCSS[ii].zoom * 2 / 2
                                , text: '' + cuCnt + '/' + cuPrt
                                , css: 'timeBarInfo' + zoomPrefixLevelsCSS[ii].prefix
                            };
                            selectLevelAnchor.content.push(mtr);
                        }
                    }
                    ww = ww + len;
                }
            }
        }
        this.selectBarAnchor.content = this.zoomAnchors;
    }
}
