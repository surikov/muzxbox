class PatternIcon {
    samplerId: string;
    constructor(samplerId: string) {
        this.samplerId = samplerId;
    }
    buildPatternSpot(percnum: number, fanLevelAnchor: TileAnchor, spearsAnchor: TileAnchor, zidx: number) {
        for (let ii = 0; ii < globalCommandDispatcher.cfg().data.patterns.length; ii++) {
            if (globalCommandDispatcher.cfg().data.patterns[ii].arpeggiator.id == this.samplerId) {
                this.addPatternSpot(percnum
                    //, globalCommandDispatcher.cfg().data.patterns[ii]
                    , fanLevelAnchor, spearsAnchor, zidx);
                break;
            }
        }
    }

    addPatternSpot(percnum: number
        //, samplerTrack: Zvoog_PercussionTrack
        , fanLevelAnchor: TileAnchor
        , spearsAnchor: TileAnchor
        , zidx: number
    ) {

        let sz = globalCommandDispatcher.cfg().fanPluginIconSize(zidx) * 0.66;
        let left = globalCommandDispatcher.cfg().leftPad + globalCommandDispatcher.cfg().timelineWidth() + globalCommandDispatcher.cfg().padGridFan;
        let top = globalCommandDispatcher.cfg().gridTop();
        let xx = left;
        let yy = top;
        let patternTrack: Zvoog_PatternTrack = globalCommandDispatcher.cfg().data.patterns[percnum];
        if (patternTrack.arpeggiator.iconPosition) {
            xx = left + patternTrack.arpeggiator.iconPosition.x;
            yy = top + patternTrack.arpeggiator.iconPosition.y;
        }
        let dragAnchor: TileAnchor = {
            xx: xx - sz / 2, yy: yy - sz / 2, ww: sz, hh: sz
            , minZoom: fanLevelAnchor.minZoom, beforeZoom: fanLevelAnchor.beforeZoom, content: [], translation: { x: 0, y: 0 }
        };
        fanLevelAnchor.content.push(dragAnchor);
        let dropAnchor: TileAnchor = {
            xx: xx - sz / 2, yy: yy - sz / 2, ww: sz, hh: sz
            , minZoom: fanLevelAnchor.minZoom, beforeZoom: fanLevelAnchor.beforeZoom, content: [], translation: { x: 0, y: 0 }
        };
        fanLevelAnchor.content.push(dropAnchor);
        /*let rec: TilePolygon = {
            x: xx - sz * 0.6
            , y: yy - sz
            , dots: [0, 0, sz * 2 * 0.8, sz, 0, sz * 2]
        };*/
        let rec: TilePolygon = {
            x: xx - sz * 0.6
            , y: yy - sz
            , dots: [0, sz
                , sz, 0
                , sz * 2, sz
                , sz, sz * 2
            ]
        };

        let showSoloOnly = globalCommandDispatcher.soloOnly();

        if (zidx < 7) {

            let dragSamplerCss = 'fanSamplerMoveIconBase';
            if (patternTrack.arpeggiator.state == 0 && showSoloOnly) dragSamplerCss = 'fanSamplerMoveIconDisabled';
            if (patternTrack.arpeggiator.state == 1) dragSamplerCss = 'fanSamplerMoveIconDisabled';

            rec.draggable = true;
            let toFilter: Zvoog_FilterTarget | null = null;
            let toSpeaker: boolean = false;
            let needReset = false;
            rec.activation = (x: number, y: number) => {
                if (!dragAnchor.translation) {
                    dragAnchor.translation = { x: 0, y: 0 };
                }
                dropAnchor.content = [];
                if (x == 0 && y == 0) {
                    if (!patternTrack.arpeggiator.iconPosition) {
                        patternTrack.arpeggiator.iconPosition = { x: 0, y: 0 };
                    }
                    if (toSpeaker) {
                        globalCommandDispatcher.exe.commitProjectChanges(['patterns', percnum, 'arpeggiator', 'outputs'], () => {
                            patternTrack.arpeggiator.outputs.push('');
                        });
                    } else {
                        if (toFilter) {
                            globalCommandDispatcher.exe.commitProjectChanges(['patterns', percnum, 'arpeggiator', 'outputs'], () => {
                                if (toFilter) patternTrack.arpeggiator.outputs.push(toFilter.id);
                            });
                        } else {
                            globalCommandDispatcher.exe.commitProjectChanges(['patterns', percnum, 'arpeggiator'], () => {
                                if (dragAnchor.translation) {
                                    patternTrack.arpeggiator.iconPosition.x = patternTrack.arpeggiator.iconPosition.x + dragAnchor.translation.x;
                                    patternTrack.arpeggiator.iconPosition.y = patternTrack.arpeggiator.iconPosition.y + dragAnchor.translation.y;
                                }
                            });
                        }
                    }
                    dragAnchor.translation = { x: 0, y: 0 };
                } else {
                    toSpeaker = false;
                    toFilter = null;
                    dragAnchor.translation.x = dragAnchor.translation.x + x;
                    dragAnchor.translation.y = dragAnchor.translation.y + y;
                    if (patternTrack.arpeggiator.iconPosition) {
                        let xx = patternTrack.arpeggiator.iconPosition.x + dragAnchor.translation.x;
                        let yy = patternTrack.arpeggiator.iconPosition.y + dragAnchor.translation.y;
                        toFilter = globalCommandDispatcher.cfg().dragFindPluginFilterIcon(xx, yy, zidx, patternTrack.arpeggiator.id, patternTrack.arpeggiator.outputs);
                        if (toFilter) {
                            needReset = true;
                            let sz = globalCommandDispatcher.cfg().fanPluginIconSize(zidx);
                            let left = globalCommandDispatcher.cfg().leftPad + globalCommandDispatcher.cfg().timelineWidth() + globalCommandDispatcher.cfg().padGridFan;
                            let top = globalCommandDispatcher.cfg().gridTop();
                            let fx = left;
                            let fy = top;
                            if (toFilter.iconPosition) {
                                fx = left + toFilter.iconPosition.x;
                                fy = top + toFilter.iconPosition.y;
                            }
                            dropAnchor.content.push({
                                x: fx - sz * 0.75, y: fy - sz * 0.75
                                , w: sz * 1.5, h: sz * 1.5
                                , rx: sz * 0.75, ry: sz * 0.75
                                , css: 'fanConnectionBase  fanConnection' + zidx
                            });
                            globalCommandDispatcher.renderer.tiler.resetAnchor(globalCommandDispatcher.renderer.mixer.fanSVGgroup
                                , fanLevelAnchor
                                , LevelModes.normal);
                        } else {
                            if (globalCommandDispatcher.cfg().dragCollisionSpeaker(xx, yy, patternTrack.arpeggiator.outputs)) {
                                toSpeaker = true;
                                needReset = true;
                                let speakerCenter = globalCommandDispatcher.cfg().speakerFanPosition();
                                let rec: TileRectangle = {
                                    x: speakerCenter.x - globalCommandDispatcher.cfg().speakerIconSize * 0.55
                                    , y: speakerCenter.y - globalCommandDispatcher.cfg().speakerIconSize * 0.55
                                    , w: globalCommandDispatcher.cfg().speakerIconSize * 1.1
                                    , h: globalCommandDispatcher.cfg().speakerIconSize * 1.1
                                    , rx: globalCommandDispatcher.cfg().speakerIconSize * 0.55
                                    , ry: globalCommandDispatcher.cfg().speakerIconSize * 0.55
                                    , css: 'fanConnectionBase  fanConnection' + zidx
                                };
                                dropAnchor.content = [rec];
                                globalCommandDispatcher.renderer.tiler.resetAnchor(globalCommandDispatcher.renderer.mixer.fanSVGgroup
                                    , fanLevelAnchor
                                    , LevelModes.normal);
                            } else {
                                if (needReset) {
                                    globalCommandDispatcher.renderer.tiler.resetAnchor(globalCommandDispatcher.renderer.mixer.fanSVGgroup
                                        , fanLevelAnchor
                                        , LevelModes.normal);
                                    needReset = false;
                                } else {
                                    globalCommandDispatcher.renderer.tiler.updateAnchorStyle(dragAnchor);
                                }
                            }
                        }
                    }
                }
            }
            //rec.css = 'fanSamplerMoveIconBase fanSamplerMoveIcon' + zidx;
            rec.css = dragSamplerCss + ' fanSamplerMoveIcon' + zidx;
            if (zidx < 4) {
                let interSamplerCss = 'fanSamplerInteractionIcon';
                if (patternTrack.arpeggiator.state == 0 && showSoloOnly) interSamplerCss = 'fanSamplerInterDisabledIcon';
                if (patternTrack.arpeggiator.state == 1) interSamplerCss = 'fanSamplerInterDisabledIcon';

                rec.css = interSamplerCss + ' fanButton' + zidx;
                rec.activation = (x: number, y: number) => {
                    let info = globalCommandDispatcher.findPluginRegistrationByKind(patternTrack.arpeggiator.kind);
                    console.log('patternPluginDialog');
                    //globalCommandDispatcher.samplerPluginDialog.openDrumPluginDialogFrame(percnum, samplerTrack, info);
                }
                rec.draggable = false;
            }
        } else {
            rec.css = 'fanConnectionBase fanConnectionSecondary fanConnection' + zidx;
        }
        dragAnchor.content.push(rec);
        /*
        spearsAnchor.content.push({
            x: xx - sz * 0.6 * 0.9
            , y: yy - sz * 0.9
            , dots: [0, 0, sz * 2 * 0.8 * 0.9, sz * 0.9, 0, sz * 2 * 0.9]
            , css: 'fanConnectionBase fanConnectionSecondary fanConnection' + zidx
        });*/
        spearsAnchor.content.push({
            x: xx - sz * 0.6 * 0.9
            , y: yy - sz * 0.9
            , dots: [0, sz
                , sz, 0
                , sz * 2, sz
                , sz, sz * 2]
            , css: 'fanConnectionBase fanConnectionSecondary fanConnection' + zidx
        });
         


        if (zidx <= 5) {//} globalCommandDispatcher.cfg().zoomEditSLess) {
            let labelSamplerCss = 'fanIconLabel';
            if (patternTrack.arpeggiator.state == 0 && showSoloOnly) labelSamplerCss = 'fanDisabledLabel';
            if (patternTrack.arpeggiator.state == 1) labelSamplerCss = 'fanDisabledLabel';
            let txt: TileText = {
                text: patternTrack.title //+ ": " + samplerTrack.volume + ": " + patternTrack.arpeggiator.kind + ': ' + patternTrack.arpeggiator.id
                , x: xx - sz * 0.5
                , y: yy - sz * 0.2
                , css: labelSamplerCss + ' fanIconLabelSize' + zidx
            };
            dragAnchor.content.push(txt);
        }
        let patternFromY = globalCommandDispatcher.cfg().patternTop()
            + (percnum + 0.5) * globalCommandDispatcher.cfg().samplerDotHeight;

        //new ControlConnection().addAudioStreamLineFlow(order > 0, zidx, samplerFromY, xx, yy, spearsAnchor);
        new ControlConnection().addAudioStreamLineFlow(false, zidx, patternFromY, xx, yy, spearsAnchor);

        let fol = new FanOutputLine();
        for (let oo = 0; oo < patternTrack.arpeggiator.outputs.length; oo++) {
            let outId = patternTrack.arpeggiator.outputs[oo];
            if (outId) {
                fol.connectOutput(outId, patternTrack.arpeggiator.id, xx, yy, spearsAnchor, fanLevelAnchor, zidx, patternTrack.arpeggiator.outputs
                    , (x: number, y: number) => {

                        globalCommandDispatcher.exe.commitProjectChanges(['patterns', percnum, 'arpeggiator', 'outputs'], () => {
                            let nn = patternTrack.arpeggiator.outputs.indexOf(outId);
                            if (nn > -1) {
                                patternTrack.arpeggiator.outputs.splice(nn, 1);
                            }
                        });
                    });
            } else {
                fol.connectSpeaker(patternTrack.arpeggiator.id, xx, yy, spearsAnchor, fanLevelAnchor, zidx, patternTrack.arpeggiator.outputs
                    , (x: number, y: number) => {

                        globalCommandDispatcher.exe.commitProjectChanges(['patterns', percnum, 'arpeggiator', 'outputs'], () => {
                            let nn = patternTrack.arpeggiator.outputs.indexOf('');
                            if (nn > -1) {
                                patternTrack.arpeggiator.outputs.splice(nn, 1);
                            }
                        });
                    });
            }
        }

        if (zidx < 4) {
            this.addReorderPatternIcon(zidx, percnum, fanLevelAnchor);
        } else {
            if (percnum == 0) {
                if (zidx < 7) {
                    this.addZoomReorderPatternIcon(zidx, percnum, fanLevelAnchor);
                }
            }
        }
    }
    addZoomReorderPatternIcon(zidx: number, percnum: number, fanLevelAnchor: TileAnchor) {
        let ratio = zoomPrefixLevelsCSS[zidx].minZoom;
        if (zidx >= 3) {
            ratio = ratio / 2;
        }
        let top = globalCommandDispatcher.cfg().patternTop();
        let xx = globalCommandDispatcher.cfg().leftPad + globalCommandDispatcher.cfg().timelineWidth();
        let sz = globalCommandDispatcher.cfg().samplerDotHeight * 0.75 * ratio;
        //let css = 'fanSamplerMoveIconBase fanSamplerMoveIcon' + zidx;
        let yy = top + globalCommandDispatcher.cfg().samplerDotHeight * (percnum + 0.5);
        let zoomReorderSamplerButton: TileRectangle = {
            x: xx - 0.5 * sz
            , y: yy - 0.5 * sz
            , w: sz
            , h: sz
            , rx: 0.5 * sz
            , ry: 0.5 * sz
            , css: 'fanEmptySymbol fanButton' + zidx
            , draggable: true

        };
        fanLevelAnchor.content.push(zoomReorderSamplerButton);
    }
    addReorderPatternIcon(zidx: number, percnum: number, fanLevelAnchor: TileAnchor) {
        //if (zidx < 4) {
        let ratio = zoomPrefixLevelsCSS[zidx].minZoom;
        if (zidx >= 3) {
            ratio = ratio / 2;
        }
        let top = globalCommandDispatcher.cfg().patternTop();
        let xx = globalCommandDispatcher.cfg().leftPad + globalCommandDispatcher.cfg().timelineWidth();
        let sz = globalCommandDispatcher.cfg().samplerDotHeight * 0.75 * ratio;
        let css = 'fanSamplerMoveIconBase fanSamplerMoveIcon' + zidx;
        let yy = top + globalCommandDispatcher.cfg().samplerDotHeight * (percnum + 0.5);
        let dragOrderSampleAnchor: TileAnchor = {
            xx: xx - sz / 2, yy: yy - sz / 2, ww: sz, hh: sz
            , minZoom: fanLevelAnchor.minZoom
            , beforeZoom: fanLevelAnchor.beforeZoom
            , content: []
            , translation: { x: 0, y: 0 }
        };
        let reorderSamplerButton: TileRectangle = {
            x: xx - 0.5 * sz
            , y: yy - 0.5 * sz
            , w: sz
            , h: sz
            , rx: 0.5 * sz
            , ry: 0.5 * sz
            , css: css
            , draggable: true

        };
        let aim = percnum;
        reorderSamplerButton.activation = (xx, yy) => {
            if (dragOrderSampleAnchor.translation) {
                if (xx == 0 && yy == 0) {
                    dragOrderSampleAnchor.translation.x = 0;
                    dragOrderSampleAnchor.translation.y = 0;
                    if (aim < 0) {
                        aim = 0;
                    }
                    if (aim > globalCommandDispatcher.cfg().data.patterns.length - 1) {
                        aim = globalCommandDispatcher.cfg().data.patterns.length - 1;

                    }
                    if (aim == percnum) {
                        globalCommandDispatcher.renderer.tiler.updateAnchorStyle(dragOrderSampleAnchor);
                    } else {
                        globalCommandDispatcher.exe.commitProjectChanges(['patterns'], () => {
                            let percTrack: Zvoog_PatternTrack
                                = globalCommandDispatcher.cfg().data.patterns.splice(percnum, 1)[0];
                            globalCommandDispatcher.cfg().data.patterns.splice(aim, 0, percTrack);
                        });
                        globalCommandDispatcher.resetProject();
                    }
                } else {
                    dragOrderSampleAnchor.translation.x = sz / 3;
                    aim = Math.round((dragOrderSampleAnchor.translation.y + yy)
                        / globalCommandDispatcher.cfg().samplerDotHeight) + percnum;
                    //console.log(aim);
                    if (aim >= 0 && aim < globalCommandDispatcher.cfg().data.patterns.length) {
                        dragOrderSampleAnchor.translation.y = dragOrderSampleAnchor.translation.y + yy;
                    }
                    globalCommandDispatcher.renderer.tiler.updateAnchorStyle(dragOrderSampleAnchor);
                }
                //console.log(xx, yy,dragOrderSampleAnchor.translation.x,dragOrderSampleAnchor.translation.y);

            }
        }
        dragOrderSampleAnchor.content.push(reorderSamplerButton);
        fanLevelAnchor.content.push(dragOrderSampleAnchor);
        //}
    }
}
