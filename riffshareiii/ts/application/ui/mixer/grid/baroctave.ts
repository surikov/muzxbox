class BarOctave {
    barRightBorder: TileRectangle;
    octaveBottomBorder: TileRectangle;
    constructor(barIdx: number, octaveIdx: number, left: number, top: number, width: number, height: number, anchor: TileAnchor
        //, prefix: string, minZoom: number, maxZoom: number, data: MZXBX_Project
        , zoomLevel: number, data: MZXBX_Project
    ) {
        //let mixm: MixerDataMath = new MixerDataMath(data);
        //let oRectangle = { x: left, y: top, w: width, h: height, rx: 1, ry: 1, css: 'mixFieldBg' + prefix };
        if (zoomLevel < 5) {
            this.addLines(anchor, zoomLevel, left, top, width, height, data, barIdx);
        }
        //if (zoomLevel <= 16) {
        this.addNotes(barIdx, octaveIdx, left, top, width, height, anchor, zoomLevel, data);
        //}
    }
    addLines(anchor: TileAnchor, zoomLevel: number, left: number, top: number, width: number, height: number
        , data: MZXBX_Project, barIdx: number) {
        this.addOctaveGridSteps(barIdx, data, left
            , anchor, zoomLevel);
        let mixm: MixerDataMath = new MixerDataMath(data);
        this.barRightBorder = {
            x: left + width
            , y: top
            , w: zoomPrefixLevelsCSS[zoomLevel].minZoom * 0.25 //zoomPrefixLevelsCSS[zoomLevel].minZoom / 8.0
            , h: height
            , css: 'mixPanelFill'
        };
        anchor.content.push(this.barRightBorder);
        this.octaveBottomBorder = {
            x: left
            , y: top + height
            , w: width
            , h: zoomPrefixLevelsCSS[zoomLevel].minZoom / 16.0
            , css: 'mixToolbarFill'
        };

        //let oAnchor = { xx: left, yy: top, ww: width, hh: height, showZoom: minZoom, hideZoom: maxZoom, content: [oRectangle] };
        //anchor.content.push(oAnchor);
        //console.log(left,top,prefix,minZoom,maxZoom);

        anchor.content.push(this.octaveBottomBorder);
        if (zoomLevel < 4) {
            for (let kk = 1; kk < 12; kk++) {
                anchor.content.push({
                    x: left
                    , y: top + height - kk * mixm.notePathHeight
                    , w: width
                    , h: zoomPrefixLevelsCSS[zoomLevel].minZoom / 64.0
                    , css: 'mixToolbarFill'
                });
            }
        }
    }
    addOctaveGridSteps(barIdx: number, data: MZXBX_Project, barLeft: number
        , barOctaveAnchor: TileAnchor, zIndex: number) {
        let zoomInfo = zoomPrefixLevelsCSS[zIndex];
        if (zoomInfo.gridLines.length > 0) {
            let curBar = data.timeline[barIdx];
            let mixm: MixerDataMath = new MixerDataMath(data);
            let lineCount = 0;
            let skip: MZXBX_MetreMathType = MZMM().set({ count: 0, part: 1 });
            while (true) {
                let line = zoomInfo.gridLines[lineCount];
                skip = skip.plus(line.duration).simplyfy();
                if (!skip.less(curBar.metre)) {
                    break;
                }
                let xx = barLeft + skip.duration(curBar.tempo) * mixm.widthDurationRatio;
                let mark: TileRectangle = {
                    x: xx
                    , y: mixm.gridTop()
                    , w: line.ratio * zoomInfo.minZoom / 2
                    , h: mixm.gridHeight()
                    , css: 'timeMeasureMark'
                };
                barOctaveAnchor.content.push(mark);
                lineCount++;
                if (lineCount >= zoomInfo.gridLines.length) {
                    lineCount = 0;
                }
            }
        }
    }
    addNotes(barIdx: number, octaveIdx: number, left: number, top: number, width: number, height: number
        , anchor: TileAnchor, zoomLevel: number, data: MZXBX_Project) {
        let mixm: MixerDataMath = new MixerDataMath(data);
        for (let ii = 0; ii < data.tracks.length; ii++) {
            let track = data.tracks[ii];
            if (ii == 0) {
                //let txt: TileText = { x: left, y: top + height, text: '' + barIdx + ':' + octaveIdx, css: 'testMeasureLabel' };
                //anchor.content.push(txt);
                let measure: MZXBX_TrackMeasure = track.measures[barIdx];
                //console.log(barIdx,octaveIdx,'measure',measure);
                for (let cc = 0; cc < measure.chords.length; cc++) {
                    let chord: MZXBX_Chord = measure.chords[cc];
                    //console.log(cc,'chord',chord);
                    for (let nn = 0; nn < chord.notes.length; nn++) {
                        let note: MZXBX_Note = chord.notes[nn];
                        let from = octaveIdx * 12;
                        let to = (octaveIdx + 1) * 12;
                        //console.log(nn,'note',note);
                        if (note.pitch >= from && note.pitch < to) {
                            let x1 = left + MZMM().set(chord.skip).duration(data.timeline[barIdx].tempo) * mixm.widthDurationRatio;
                            let y1 = top + height - (note.pitch - from) * mixm.notePathHeight;
                            //let dot: TileRectangle = { x: x, y: y, w: data.theme.notePathHeight, h: data.theme.notePathHeight, css: 'mixTextFill' };
                            //if (anchor.showZoom == 0.25 && barIdx < 5 && (note.slides) && note.slides.length >= 0 && note.slides[0]) {
                            //    console.log(barIdx, nn, chord.skip, note.slides[0].duration);
                            //}
                            for (let ss = 0; ss < note.slides.length; ss++) {
                                let x2 = x1 + MZMM().set(note.slides[ss].duration)
                                    .duration(data.timeline[barIdx].tempo)
                                    * mixm.widthDurationRatio;
                                let y2 = y1 + note.slides[ss].delta * mixm.notePathHeight;
                                let line: TileLine = { x1: x1, y1: y1, x2: x2, y2: y2, css: 'noteLine' };
                                anchor.content.push(line);
                                //console.log(line);
                                x1 = x2;
                                y1 = y2;
                            }
                        }
                    }
                }
            }
        }
    }
}