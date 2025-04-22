class PerformerIcon {
	performerId: string;
	constructor(performerId: string) {
		this.performerId = performerId;
	}
	buildPerformerSpot(fanLevelAnchor: TileAnchor, spearsAnchor: TileAnchor, zidx: number) {
		for (let ii = 0; ii < globalCommandDispatcher.cfg().data.tracks.length; ii++) {
			if (globalCommandDispatcher.cfg().data.tracks[ii].performer.id == this.performerId) {
				this.addPerformerSpot(ii > 0, ii, globalCommandDispatcher.cfg().data.tracks[ii], fanLevelAnchor, spearsAnchor, zidx);
				break;
			}
		}
	}
	addPerformerSpot(secondary: boolean, trackNo: number, track: Zvoog_MusicTrack, fanLevelAnchor: TileAnchor, spearsAnchor: TileAnchor, zidx: number) {
		let sz = globalCommandDispatcher.cfg().fanPluginIconSize(zidx);
		let left = globalCommandDispatcher.cfg().leftPad + globalCommandDispatcher.cfg().timelineWidth() + globalCommandDispatcher.cfg().padGridFan;
		let top = globalCommandDispatcher.cfg().gridTop();
		let xx = left;
		let yy = top;
		if (track.performer.iconPosition) {
			xx = left + track.performer.iconPosition.x;
			yy = top + track.performer.iconPosition.y;
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
		let rec: TileRectangle = {
			x: xx - sz / 2, y: yy - sz / 2
			, w: sz, h: sz
			/*, draggable: true
			, activation: (x: number, y: number) => {
				if (!dragAnchor.translation) {
					dragAnchor.translation = { x: 0, y: 0 };
				}
				if (x == 0 && y == 0) {
					console.log('done', dragAnchor.translation);
					if (!track.performer.iconPosition) {
						track.performer.iconPosition = { x: 0, y: 0 };
					}
					track.performer.iconPosition.x = track.performer.iconPosition.x + dragAnchor.translation.x;
					track.performer.iconPosition.y = track.performer.iconPosition.y + dragAnchor.translation.y;
					console.log('drop' + track.performer.kind + ':' + track.performer.id + ' to ' + track.performer.iconPosition.x + '/' + track.performer.iconPosition.y);
					dragAnchor.translation = { x: 0, y: 0 };
					globalCommandDispatcher.resetProject();
				} else {
					dragAnchor.translation.x = dragAnchor.translation.x + x;
					dragAnchor.translation.y = dragAnchor.translation.y + y;
					globalCommandDispatcher.renderer.tiler.resetAnchor(globalCommandDispatcher.renderer.mixer.fanSVGgroup
						, fanLevelAnchor
						, LevelModes.normal);
				}
			}
			, css: 'fanSamplerMoveIcon fanSamplerMoveIcon' + zidx*/
		};
		if (zidx < 7) {
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
					if (!track.performer.iconPosition) {
						track.performer.iconPosition = { x: 0, y: 0 };
					}
					if (toSpeaker) {
						globalCommandDispatcher.exe.commitProjectChanges(['tracks', trackNo, 'performer', 'outputs'], () => {
							track.performer.outputs.push('');
						});
					} else {
						if (toFilter) {
							globalCommandDispatcher.exe.commitProjectChanges(['tracks', trackNo, 'performer', 'outputs'], () => {
								if (toFilter) track.performer.outputs.push(toFilter.id);
							});
						} else {
							globalCommandDispatcher.exe.commitProjectChanges(['tracks', trackNo, 'performer'], () => {
								if (dragAnchor.translation) {
									track.performer.iconPosition.x = track.performer.iconPosition.x + dragAnchor.translation.x;
									track.performer.iconPosition.y = track.performer.iconPosition.y + dragAnchor.translation.y;
								}
							});
						}
					}
					dragAnchor.translation = { x: 0, y: 0 };
					globalCommandDispatcher.renderer.tiler.resetAnchor(globalCommandDispatcher.renderer.mixer.fanSVGgroup
						, fanLevelAnchor
						, LevelModes.normal);
				} else {
					toSpeaker = false;
					toFilter = null;
					dragAnchor.translation.x = dragAnchor.translation.x + x;
					dragAnchor.translation.y = dragAnchor.translation.y + y;
					if (track.performer.iconPosition) {
						let xx = track.performer.iconPosition.x + dragAnchor.translation.x;
						let yy = track.performer.iconPosition.y + dragAnchor.translation.y;
						toFilter = globalCommandDispatcher.cfg().dragFindPluginFilterIcon(xx, yy, zidx, track.performer.id, track.performer.outputs);
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
							if (globalCommandDispatcher.cfg().dragCollisionSpeaker(xx, yy, track.performer.outputs)) {
								needReset = true;
								toSpeaker = true;
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
								//globalCommandDispatcher.renderer.tiler.updateAnchorTranslation(dragAnchor);
								if (needReset) {
									globalCommandDispatcher.renderer.tiler.resetAnchor(globalCommandDispatcher.renderer.mixer.fanSVGgroup, fanLevelAnchor, LevelModes.normal);
									needReset = false;
								} else {
									globalCommandDispatcher.renderer.tiler.updateAnchorStyle(dragAnchor);
								}
							}
						}
					}

				}
			}
			rec.css = 'fanSamplerMoveIcon fanSamplerMoveIcon' + zidx;
		} else {
			rec.css = 'fanConnectionBase fanConnectionSecondary fanConnection' + zidx;
		}
		dragAnchor.content.push(rec);
		spearsAnchor.content.push({
			x: xx - sz / 2 + sz * 0.05, y: yy - sz / 2 + sz * 0.05
			, w: sz * 0.9, h: sz * 0.9
			, css: 'fanConnectionBase fanConnectionSecondary fanConnection' + zidx
		});

		if (zidx < 5) {
			let btn: TileRectangle = {
				x: xx - sz / 2
				, y: yy
				, w: sz
				, h: sz / 2
				, css: 'fanSamplerInteractionIcon fanButton' + zidx
				, activation: (x: number, y: number) => {
					//console.log('' + track.performer.kind + ':' + track.performer.id);
					let info = globalCommandDispatcher.findPluginRegistrationByKind(track.performer.kind);
					//if (info) {
						//globalCommandDispatcher.promptPluginSequencerDialog(track, info);
						globalCommandDispatcher.sequencerPluginDialog.openSequencerPluginDialogFrame(trackNo, track, info);
						/*let url = info.ui;
						globalCommandDispatcher.promptPluginPointDialog(track.title, url, track.performer.data, (obj: any) => {
							globalCommandDispatcher.exe.commitProjectChanges(['tracks', trackNo, 'performer'], () => {
								track.performer.data = obj;
							});
							//globalCommandDispatcher.reStartPlayIfPlay();
							return true;
						}, LO(localDropInsTrack), () => {
							//console.log(localDropInsTrack);
							globalCommandDispatcher.exe.commitProjectChanges(['tracks'], () => {
								globalCommandDispatcher.cfg().data.tracks.splice(trackNo, 1);
							});
							globalCommandDispatcher.cancelPluginGUI();
						}, (newTitle: string) => {
							globalCommandDispatcher.exe.commitProjectChanges(['tracks', trackNo], () => {
								track.title = newTitle;
							});
							globalCommandDispatcher.cancelPluginGUI();
						});*/
					//}


				}
			};
			dragAnchor.content.push(btn);
		}
		if (zidx <= 5) {//} globalCommandDispatcher.cfg().zoomEditSLess) {
			let txt: TileText = {
				text: track.title //+ ': ' + track.volume + ': ' + track.performer.kind + ': ' + track.performer.id
				, x: xx - sz * 0.45
				, y: yy - sz * 0.1
				, css: 'fanIconLabel fanIconLabelSize' + zidx
			};
			dragAnchor.content.push(txt);

		}
		let performerFromY = globalCommandDispatcher.cfg().gridTop() + globalCommandDispatcher.cfg().gridHeight() / 2;
		new ControlConnection().addAudioStreamLineFlow(secondary, zidx, performerFromY, xx, yy, spearsAnchor);
		//new FanOutputLine().addOutputs(track.performer.outputs, fanLevelAnchor, spearsAnchor, track.performer.id, xx, yy, zidx);
		let fol = new FanOutputLine();
		for (let oo = 0; oo < track.performer.outputs.length; oo++) {
			let outId = track.performer.outputs[oo];
			if (outId) {
				fol.connectOutput(outId, track.performer.id, xx, yy, spearsAnchor, fanLevelAnchor, zidx, track.performer.outputs
					, (x: number, y: number) => {
						//console.log('split', track.title, 'from', outId);
						/*globalCommandDispatcher.exe.addUndoCommandFromUI(ExeDisonnectPerformer, {
							track: trackNo
							, id: outId
						});*/
						globalCommandDispatcher.exe.commitProjectChanges(['tracks', trackNo, 'performer'], () => {
							let nn = track.performer.outputs.indexOf(outId);
							if (nn > -1) {
								track.performer.outputs.splice(nn, 1);
							}
						});
					});
			} else {
				fol.connectSpeaker(track.performer.id, xx, yy, spearsAnchor, fanLevelAnchor, zidx, track.performer.outputs
					, (x: number, y: number) => {
						//console.log('split', track.title, 'from speaker');
						/*globalCommandDispatcher.exe.addUndoCommandFromUI(ExeDisonnectPerformer, {
							track: trackNo
							, id: ''
						});*/
						globalCommandDispatcher.exe.commitProjectChanges(['tracks', trackNo, 'performer'], () => {
							let nn = track.performer.outputs.indexOf('');
							if (nn > -1) {
								track.performer.outputs.splice(nn, 1);
							}
						});
					});
			}
		}
	}
}

