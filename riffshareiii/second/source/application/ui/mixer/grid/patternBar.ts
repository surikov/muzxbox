class PatternBarContent {
    constructor(barIdx: number
        , barLeft: number
        , barOctaveAnchor: TileAnchor
        , zIndex: number) {
        //console.log('PatternBarContent', zIndex, barLeft);
        let curBar = globalCommandDispatcher.cfg().data.timeline[barIdx];
        let top = globalCommandDispatcher.cfg().patternTop();

        if (zIndex < globalCommandDispatcher.cfg().zoomEditZoomIdxLess) {

            let interpane: TileRectangle = {
                x: barOctaveAnchor.xx
                , y: globalCommandDispatcher.cfg().patternTop()
                , w: barOctaveAnchor.ww
                , h: globalCommandDispatcher.cfg().data.patterns.length * globalCommandDispatcher.cfg().samplerDotHeight
                , css: 'commentPaneForClick'
                , activation: (x: number, y: number) => { this.patternCellClick(barIdx, x, y, zIndex); }
            };
            barOctaveAnchor.content.push(interpane);
        }
        for (let aa = 0; aa < globalCommandDispatcher.cfg().data.patterns.length; aa++) {
            let arp = globalCommandDispatcher.cfg().data.patterns[aa];
            if (arp.measures[barIdx]) {
                let css = 'automationBgDot';
                if (arp.arpeggiator.state > 0) {
                    css = 'automationMuteDot';
                }
                let cucss = 'samplerDrumDotBg';
                let licss = 'mixArpeggiatorLine';
                let soloOnly = globalCommandDispatcher.soloOnly();
                if ((soloOnly && arp.arpeggiator.state != 2) || ((!soloOnly) && arp.arpeggiator.state == 1)) {
                    cucss = 'samplerDrumMuteBg';
                    licss = 'mixArpeggiatorMutedLine';
                }
                let measure = arp.measures[barIdx];
                for (let ii = 0; ii < measure.points.length; ii++) {
                    let change = measure.points[ii];
                    let xx = barLeft + MMUtil().set(change.skip).duration(curBar.tempo) * globalCommandDispatcher.cfg().widthDurationRatio;
                    /*let aubtn: TileRectangle = {
                        x: xx
                        , y: top + globalCommandDispatcher.cfg().samplerDotHeight * aa
                        , w: globalCommandDispatcher.cfg().samplerDotHeight * 0.95
                        , h: globalCommandDispatcher.cfg().samplerDotHeight * 0.95
                        , css: css
                    };*/
                    let yy = top + globalCommandDispatcher.cfg().samplerDotHeight * aa + 0.05 * globalCommandDispatcher.cfg().samplerDotHeight / 2;
                    let dot2 = 0.9 * globalCommandDispatcher.cfg().samplerDotHeight / 2;
                    let aubtn: TilePolygon = {
                        dots: [xx, yy + dot2
                            , xx + dot2, yy
                            , xx + dot2, yy + dot2 * 2
                        ]
                        , css: cucss
                    };
                    barOctaveAnchor.content.push(aubtn);
                    if (zIndex < globalCommandDispatcher.cfg().zoomEditZoomIdxLess) {
                        let yShift = 0.24;
                        let xShift = 0.20;
                        if (zIndex < 2) {
                            yShift = 0.29;
                            xShift = 0.29;
                        }
                        if (zIndex < 1) {
                            yShift = 0.37;
                            xShift = 0.37;
                        }

                        let editIcon: TileText = {
                            x: xx + xShift
                            , y: yy - yShift + 1.4
                            , text: icon_close_circle
                            , css: 'samplerDrumDeleteIcon samplerDrumDeleteSize' + zIndex
                        };
                        barOctaveAnchor.content.push(editIcon);

                    }
                    let remains = MMUtil().set(change.duration);
                    let lastSkip = MMUtil().set(change.skip);
                    let seconds = 0;
                    for (let ibar = barIdx; ibar < globalCommandDispatcher.cfg().data.timeline.length && remains.more({ count: 0, part: 1 }); ibar++) {
                        let lastBar = globalCommandDispatcher.cfg().data.timeline[ibar];
                        if (lastSkip.plus(remains).less(lastBar.metre)) {
                            seconds = seconds + remains.duration(lastBar.tempo);
                            break;
                        } else {
                            seconds = seconds + MMUtil().set(lastBar.metre).minus(lastSkip).duration(lastBar.tempo);
                            remains = remains.minus(lastBar.metre).plus(lastSkip);
                            lastSkip = lastSkip.set({ count: 0, part: 1 });
                        }
                    }
                    let linelen = seconds * globalCommandDispatcher.cfg().widthDurationRatio;
                    if (linelen > dot2) {
                        let line: TileLine = {
                            x1: xx + 0.995 * dot2
                            , y1: yy + dot2
                            , x2: xx + linelen
                            , y2: yy + dot2
                            , css: licss
                        };
                        barOctaveAnchor.content.push(line);
                        if (barOctaveAnchor.ww < xx + linelen) {
                            barOctaveAnchor.ww = xx + linelen
                        }
                    }

                }

            }
        }


    }
    patternCellClick(barIdx: number, barX: number, yy: number, zz: number) {
        // console.log('patternCellClick bar', barIdx, 'x', barX, 'y', yy, 'z', zz);
        let row = Math.floor(yy / globalCommandDispatcher.cfg().samplerDotHeight);
        let arp = globalCommandDispatcher.cfg().data.patterns[row];
        let info: BarStepStartEnd = globalCommandDispatcher.cfg().gridClickInfo(barIdx, barX, zz);
        let change: null | Zvoog_PatternPoint = null;
        let muStart = MMUtil().set(info.start);
        let muEnd = MMUtil().set(info.end);
        let changeIdx = 0;

        for (changeIdx = 0; changeIdx < arp.measures[barIdx].points.length; changeIdx++) {
            let testChange = arp.measures[barIdx].points[changeIdx];
            if (muStart.more(testChange.skip)) {
                //
            } else {
                if (muEnd.more(testChange.skip)) {
                    change = testChange;
                    globalCommandDispatcher.exe.commitProjectChanges(['patterns', row], () => {
                        arp.measures[barIdx].points.splice(changeIdx, 1);
                        globalCommandDispatcher.resetProject();
                    });
                    break;
                }
            }
        }
        // console.log('change', change);
        //  console.log('info', info);
        if (!(change)) {
            
            if (globalCommandDispatcher.cfg().editPatternMark) {
                globalCommandDispatcher.cfg().editPatternMark = null;
                //console.log('remove mark');
            } else {
                globalCommandDispatcher.cfg().editPatternMark = { barIdx: barIdx, skip: muStart.metre(), rowIdx: row };
                //console.log('mark', globalCommandDispatcher.cfg().editPatternMark);
            }
            globalCommandDispatcher.renderer.mixer.resetPatternMark();

        }
        /*
                if (change) {
                    //
                } else {
                    globalCommandDispatcher.exe.commitProjectChanges(['filters', row, 'automation', barIdx], () => {
                        change = { skip: info.start, stateBlob: '' };
                        arp.measures[barIdx].points.push(change);
                    });
                }
                let finfo = globalCommandDispatcher.findPluginRegistrationByKind(arp.kind);
                if (finfo) {
                    if (change) {
                        globalCommandDispatcher.pointPluginDialog.openPointPluginDialogFrame(row, barIdx, info, changeIdx, change, filter, finfo);
                    }
                }*/
    }
}
