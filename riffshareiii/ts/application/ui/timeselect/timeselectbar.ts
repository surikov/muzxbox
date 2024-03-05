
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
            , showZoom: zoomPrefixLevelsCSS[0].minZoom
            , hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom
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

    }
    addGridMarks(data: MZXBX_Project, barnum: number, barLeft: number, curBar: MZXBX_SongMeasure
        , measureAnchor: TileAnchor, zIndex: number) {
        let zoomInfo = zoomPrefixLevelsCSS[zIndex];
        if (zoomInfo.gridLines.length > 0) {
            let mixm: MixerDataMath = new MixerDataMath(data);
            let lineCount = 0;
            let skip: MZXBX_MetreMathType = MZMM().set({ count: 0, part: 1 });
            while (true) {
                let line = zoomInfo.gridLines[lineCount];
                skip = skip.plus(line.duration).simplyfy();
                if (!skip.less(curBar.metre)) {
                    break;
                }
                
                if (line.label) {
					let xx = barLeft + skip.duration(curBar.tempo) * mixm.widthDurationRatio;
                let mark: TileRectangle = {
                    x: xx, y: 0
                    , w: line.ratio * 4*zoomInfo.minZoom
                    , h: line.ratio * 4 * zoomInfo.minZoom
                    , css: 'timeMeasureMark'
                };
                measureAnchor.content.push(mark);
                    let mtr: TileText = {
                        x: xx
                        , y: 1 * zoomInfo.minZoom
                        , text: '' + skip.count + '/' + skip.part
                        , css: 'timeBarInfo' + zoomPrefixLevelsCSS[zIndex].prefix
                    };
                    measureAnchor.content.push(mtr);
                }
                lineCount++;
                if (lineCount >= zoomInfo.gridLines.length) {
                    lineCount = 0;
                }
            }
        }
    }

    createBarMark(barLeft: number, width: number, height: number, measureAnchor: TileAnchor) {
        let mark: TileRectangle = { x: barLeft, y: 0, w: width, h: height, css: 'timeMeasureMark' };
        measureAnchor.content.push(mark);
    }
    createBarNumber(barLeft: number//, top: number
        , barnum: number, zz: number
        , curBar: MZXBX_SongMeasure
        , measureAnchor: TileAnchor
		,barTime:number
    ) {
        let nm: TileText = {
            x: barLeft
            , y: zoomPrefixLevelsCSS[zz].minZoom * 2
            , text: '' + (1 + barnum)+': ' + curBar.metre.count + '/' + curBar.metre.part
            , css: 'timeBarNum' + zoomPrefixLevelsCSS[zz].prefix
        };
        measureAnchor.content.push(nm);
		let timeText=Math.round(barTime*100)/100;
        let bpm: TileText = {
            x: barLeft
            , y: zoomPrefixLevelsCSS[zz].minZoom * 3
            , text: '' + Math.round(curBar.tempo)+': '+timeText
            , css: 'timeBarInfo' + zoomPrefixLevelsCSS[zz].prefix
        };
        measureAnchor.content.push(bpm);
        /*let mtr: TileText = {
            x: barLeft
            , y:zoomPrefixLevelsCSS[zz].minZoom * 2
            , text: '' + curBar.metre.count + '/' + curBar.metre.part
            , css: 'timeBarInfo' + zoomPrefixLevelsCSS[zz].prefix
        };
        measureAnchor.content.push(mtr);*/
    }

    fillTimeBar(data: MZXBX_Project) {
        //console.log('fillTimeBar', data.timeline);
        let mixm: MixerDataMath = new MixerDataMath(data);
        this.selectBarAnchor.ww = mixm.mixerWidth();
        this.selectBarAnchor.hh = mixm.mixerHeight();
        this.zoomAnchors = [];
        for (let zz = 0; zz < zoomPrefixLevelsCSS.length - 1; zz++) {
            //console.log('add',zoomPrefixLevelsCSS[zz]);
            let selectLevelAnchor: TileAnchor = {
                showZoom: zoomPrefixLevelsCSS[zz].minZoom
                , hideZoom: zoomPrefixLevelsCSS[zz + 1].minZoom
                , xx: 0, yy: 0, ww: mixm.mixerWidth(), hh: mixm.mixerHeight(), content: []
                , id: 'time' + (zz + Math.random())
            };
            this.zoomAnchors.push(selectLevelAnchor);
            let mm: MZXBX_MetreMathType = MZMM();
            let barLeft = mixm.LeftPad;
			let barTime=0;
            for (let kk = 0; kk < data.timeline.length; kk++) {
                let curBar = data.timeline[kk];
                let curMeasureMeter = mm.set(curBar.metre);
                let barWidth = curMeasureMeter.duration(curBar.tempo) * mixm.widthDurationRatio;
                let measureAnchor: TileAnchor = {
                    showZoom: zoomPrefixLevelsCSS[zz].minZoom
                    , hideZoom: zoomPrefixLevelsCSS[zz + 1].minZoom
                    , xx: barLeft, yy: 0, ww: barWidth, hh: 1234, content: []
                    , id: 'measure' + (kk + Math.random())
                };
                selectLevelAnchor.content.push(measureAnchor);

                this.addGridMarks(data, kk, barLeft, curBar, measureAnchor, zz);
                if ((zz <= 4) || (zz == 5 && kk % 2 == 0) || (zz == 6 && kk % 4 == 0) || (zz == 7 && kk % 8 == 0) || (zz == 8 && kk % 16 == 0)) {
                    this.createBarMark(barLeft
                        , zoomPrefixLevelsCSS[zz].minZoom * 3
                        , zoomPrefixLevelsCSS[zz].minZoom * 3
                        , measureAnchor);
                    this.createBarNumber(barLeft
                        //, zoomPrefixLevelsCSS[zz].minZoom * 3
                        , kk, zz, curBar, measureAnchor,barTime);
                }
                barLeft = barLeft + barWidth;
				barTime=barTime+curMeasureMeter.duration(curBar.tempo);
            }
        }
        this.selectBarAnchor.content = this.zoomAnchors;
    }
}
