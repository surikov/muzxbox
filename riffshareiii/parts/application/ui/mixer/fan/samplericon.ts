class SamplerIcon {
	samplerId: string;
	constructor(samplerId: string) {
		this.samplerId = samplerId;
	}
	buildSamplerSpot(order: number, fanLevelAnchor: TileAnchor, spearsAnchor: TileAnchor, zidx: number) {
		for (let ii = 0; ii < globalCommandDispatcher.cfg().data.percussions.length; ii++) {
			if (globalCommandDispatcher.cfg().data.percussions[ii].sampler.id == this.samplerId) {
				this.addSamplerSpot(order, globalCommandDispatcher.cfg().data.percussions[ii], fanLevelAnchor, spearsAnchor, zidx);
				break;
			}
		}
	}
	addSamplerSpot(order: number, samplerTrack: Zvoog_PercussionTrack, fanLevelAnchor: TileAnchor, spearsAnchor: TileAnchor, zidx: number) {
		let sz = globalCommandDispatcher.cfg().fanPluginIconSize(zidx) * 0.66;
		let left = globalCommandDispatcher.cfg().leftPad + globalCommandDispatcher.cfg().timelineWidth() + globalCommandDispatcher.cfg().padGridFan;
		let top = globalCommandDispatcher.cfg().gridTop();
		let xx = left;
		let yy = top;
		if (samplerTrack.sampler.iconPosition) {
			xx = left + samplerTrack.sampler.iconPosition.x;
			yy = top + samplerTrack.sampler.iconPosition.y;
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
		let rec: TilePolygon = {
			x: xx - sz * 0.6
			, y: yy - sz
			, dots: [0, 0, sz * 2 * 0.8, sz, 0, sz * 2]
		};

		let showSoloOnly = false;
		for (let tt = 0; tt < globalCommandDispatcher.cfg().data.tracks.length; tt++)
			if (globalCommandDispatcher.cfg().data.tracks[tt].performer.state == 2) showSoloOnly = true;
		for (let tt = 0; tt < globalCommandDispatcher.cfg().data.percussions.length; tt++)
			if (globalCommandDispatcher.cfg().data.percussions[tt].sampler.state == 2) showSoloOnly = true;

		if (zidx < 7) {

			let dragSamplerCss = 'fanSamplerMoveIconBase';
			if (samplerTrack.sampler.state == 0 && showSoloOnly) dragSamplerCss = 'fanSamplerMoveIconDisabled';
			if (samplerTrack.sampler.state == 1) dragSamplerCss = 'fanSamplerMoveIconDisabled';

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
					if (!samplerTrack.sampler.iconPosition) {
						samplerTrack.sampler.iconPosition = { x: 0, y: 0 };
					}
					if (toSpeaker) {
						globalCommandDispatcher.exe.commitProjectChanges(['percussions', order, 'sampler', 'outputs'], () => {
							samplerTrack.sampler.outputs.push('');
						});
					} else {
						if (toFilter) {
							globalCommandDispatcher.exe.commitProjectChanges(['percussions', order, 'sampler', 'outputs'], () => {
								if (toFilter) samplerTrack.sampler.outputs.push(toFilter.id);
							});
						} else {
							globalCommandDispatcher.exe.commitProjectChanges(['percussions', order, 'sampler'], () => {
								if (dragAnchor.translation) {
									samplerTrack.sampler.iconPosition.x = samplerTrack.sampler.iconPosition.x + dragAnchor.translation.x;
									samplerTrack.sampler.iconPosition.y = samplerTrack.sampler.iconPosition.y + dragAnchor.translation.y;
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
					if (samplerTrack.sampler.iconPosition) {
						let xx = samplerTrack.sampler.iconPosition.x + dragAnchor.translation.x;
						let yy = samplerTrack.sampler.iconPosition.y + dragAnchor.translation.y;
						toFilter = globalCommandDispatcher.cfg().dragFindPluginFilterIcon(xx, yy, zidx, samplerTrack.sampler.id, samplerTrack.sampler.outputs);
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
							if (globalCommandDispatcher.cfg().dragCollisionSpeaker(xx, yy, samplerTrack.sampler.outputs)) {
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

		} else {
			rec.css = 'fanConnectionBase fanConnectionSecondary fanConnection' + zidx;
		}
		dragAnchor.content.push(rec);
		spearsAnchor.content.push({
			x: xx - sz * 0.6 * 0.9
			, y: yy - sz * 0.9
			, dots: [0, 0, sz * 2 * 0.8 * 0.9, sz * 0.9, 0, sz * 2 * 0.9]
			, css: 'fanConnectionBase fanConnectionSecondary fanConnection' + zidx
		});
		if (zidx < 5) {
			let interSamplerCss = 'fanSamplerInteractionIcon';
			if (samplerTrack.sampler.state == 0 && showSoloOnly) interSamplerCss = 'fanSamplerInterDisabledIcon';
			if (samplerTrack.sampler.state == 1) interSamplerCss = 'fanSamplerInterDisabledIcon';
			let btn: TilePolygon = {
				x: xx - sz * 0.6
				, y: yy - sz
				, dots: [0, sz, sz * 2 * 0.8, sz, 0, sz * 2]
				//, css: 'fanSamplerInteractionIcon fanButton' + zidx
				, css: interSamplerCss + ' fanButton' + zidx
				, activation: (x: number, y: number) => {

					let info = globalCommandDispatcher.findPluginRegistrationByKind(samplerTrack.sampler.kind);

					globalCommandDispatcher.samplerPluginDialog.openDrumPluginDialogFrame(order, samplerTrack, info);

				}
			};
			dragAnchor.content.push(btn);
		}

		if (zidx <= 5) {//} globalCommandDispatcher.cfg().zoomEditSLess) {
			let labelSamplerCss = 'fanIconLabel';
			if (samplerTrack.sampler.state == 0 && showSoloOnly) labelSamplerCss = 'fanDisabledLabel';
			if (samplerTrack.sampler.state == 1) labelSamplerCss = 'fanDisabledLabel';
			let txt: TileText = {
				text: samplerTrack.title //+ ": " + samplerTrack.volume + ": " + samplerTrack.sampler.kind + ': ' + samplerTrack.sampler.id
				, x: xx - sz * 0.5
				, y: yy - sz * 0.2
				, css: labelSamplerCss+' fanIconLabelSize' + zidx
			};
			dragAnchor.content.push(txt);
		}
		let samplerFromY = globalCommandDispatcher.cfg().samplerTop()
			+ (order + 0.5) * globalCommandDispatcher.cfg().samplerDotHeight;

		//new ControlConnection().addAudioStreamLineFlow(order > 0, zidx, samplerFromY, xx, yy, spearsAnchor);
		new ControlConnection().addAudioStreamLineFlow(false, zidx, samplerFromY, xx, yy, spearsAnchor);

		let fol = new FanOutputLine();
		for (let oo = 0; oo < samplerTrack.sampler.outputs.length; oo++) {
			let outId = samplerTrack.sampler.outputs[oo];
			if (outId) {
				fol.connectOutput(outId, samplerTrack.sampler.id, xx, yy, spearsAnchor, fanLevelAnchor, zidx, samplerTrack.sampler.outputs
					, (x: number, y: number) => {

						globalCommandDispatcher.exe.commitProjectChanges(['percussions', order, 'sampler', 'outputs'], () => {
							let nn = samplerTrack.sampler.outputs.indexOf(outId);
							if (nn > -1) {
								samplerTrack.sampler.outputs.splice(nn, 1);
							}
						});
					});
			} else {
				fol.connectSpeaker(samplerTrack.sampler.id, xx, yy, spearsAnchor, fanLevelAnchor, zidx, samplerTrack.sampler.outputs
					, (x: number, y: number) => {

						globalCommandDispatcher.exe.commitProjectChanges(['percussions', order, 'sampler', 'outputs'], () => {
							let nn = samplerTrack.sampler.outputs.indexOf('');
							if (nn > -1) {
								samplerTrack.sampler.outputs.splice(nn, 1);
							}
						});
					});
			}
		}

	}
}
