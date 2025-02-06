class FilterIcon {
	filterId: string;
	constructor(filterId: string) {
		this.filterId = filterId;
	}
	buildAutoSpot(order: number, fanLevelAnchor: TileAnchor, spearsAnchor: TileAnchor, zidx: number) {
		for (let ii = 0; ii < globalCommandDispatcher.cfg().data.filters.length; ii++) {
			if (globalCommandDispatcher.cfg().data.filters[ii].id == this.filterId) {
				let filterTarget: Zvoog_FilterTarget = globalCommandDispatcher.cfg().data.filters[ii];
				this.addFilterSpot(order, filterTarget, fanLevelAnchor, spearsAnchor, zidx);
				break;
			}
		}
	}

	addFilterSpot(order: number, filterTarget: Zvoog_FilterTarget, fanLevelAnchor: TileAnchor, spearsAnchor: TileAnchor, zidx: number) {
		let sz = globalCommandDispatcher.cfg().fanPluginIconSize(zidx);
		let left = globalCommandDispatcher.cfg().leftPad + globalCommandDispatcher.cfg().timelineWidth() + globalCommandDispatcher.cfg().padGridFan;
		let top = globalCommandDispatcher.cfg().gridTop();
		let xx = left;
		let yy = top;
		if (filterTarget.iconPosition) {
			xx = left + filterTarget.iconPosition.x;
			yy = top + filterTarget.iconPosition.y;
		}
		let dragAnchor: TileAnchor = {
			xx: xx - sz / 2, yy: yy - sz / 2, ww: sz, hh: sz
			, showZoom: fanLevelAnchor.showZoom, hideZoom: fanLevelAnchor.hideZoom, content: [], translation: { x: 0, y: 0 }
		};
		fanLevelAnchor.content.push(dragAnchor);
		let dropAnchor: TileAnchor = {
			xx: xx - sz / 2, yy: yy - sz / 2, ww: sz, hh: sz
			, showZoom: fanLevelAnchor.showZoom, hideZoom: fanLevelAnchor.hideZoom, content: [], translation: { x: 0, y: 0 }
		};
		fanLevelAnchor.content.push(dropAnchor);
		let rec: TileRectangle = {
			x: xx - sz / 2, y: yy - sz / 2, w: sz
			, rx: sz / 2, ry: sz / 2
			, h: sz
		};
		if (zidx < 7) {
			rec.draggable = true;
			let toFilter: Zvoog_FilterTarget | null = null;
			let toSpeaker: boolean = false;
			rec.activation = (x: number, y: number) => {
				//https://stackoverflow.com/questions/56653453/why-touchmove-event-is-not-fired-after-dom-changes
				if (!dragAnchor.translation) {
					dragAnchor.translation = { x: 0, y: 0 };
				}
				dropAnchor.content = [];
				if (x == 0 && y == 0) {
					if (!filterTarget.iconPosition) {
						filterTarget.iconPosition = { x: 0, y: 0 };
					}
					if (toSpeaker) {
						globalCommandDispatcher.exe.commitProjectChanges(['filters', order], () => {
							filterTarget.outputs.push('');
						});
					} else {
						if (toFilter) {
							globalCommandDispatcher.exe.commitProjectChanges(['filters', order], () => {
								if (toFilter) filterTarget.outputs.push(toFilter.id);
							});
						} else {
							globalCommandDispatcher.exe.commitProjectChanges(['filters', order], () => {
								if (dragAnchor.translation) {
									filterTarget.iconPosition.x = filterTarget.iconPosition.x + dragAnchor.translation.x;
									filterTarget.iconPosition.y = filterTarget.iconPosition.y + dragAnchor.translation.y;
								}
							});
						}
					}
					dragAnchor.translation = { x: 0, y: 0 };
					//globalCommandDispatcher.resetProject();
				} else {
					toSpeaker = false;
					toFilter = null;
					dragAnchor.translation.x = dragAnchor.translation.x + x;
					dragAnchor.translation.y = dragAnchor.translation.y + y;
					/*if (dragAnchor.id) {
						let elem = document.getElementById(dragAnchor.id);

						if (elem) {
							let translate = 'translate(' + dragAnchor.translation.x + ',' + dragAnchor.translation.y + ')';
							elem.setAttribute('transform', translate);
							//console.log('translate', translate);
						}
					}*/
					if (filterTarget.iconPosition) {
						let xx = filterTarget.iconPosition.x + dragAnchor.translation.x;
						let yy = filterTarget.iconPosition.y + dragAnchor.translation.y;
						toFilter = globalCommandDispatcher.cfg().dragFindPluginFilterIcon(xx, yy, zidx, filterTarget.id, filterTarget.outputs);
						if (toFilter) {
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
						} else {
							if (globalCommandDispatcher.cfg().dragCollisionSpeaker(xx, yy, filterTarget.outputs)) {
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
							}
						}
					}

					globalCommandDispatcher.renderer.tiler.resetAnchor(globalCommandDispatcher.renderer.mixer.fanSVGgroup
						, fanLevelAnchor
						, LevelModes.normal);

				}
			}
			//if (order) {
			rec.css = 'fanSamplerMoveIcon fanSamplerMoveIcon' + zidx;
			//} else {
			//	rec.css = 'fanSamplerMoveIcon fanSamplerUpIcon' + zidx;
			//}
		} else {
			rec.css = 'fanConnectionBase fanConnectionSecondary fanConnection' + zidx;
		}
		dragAnchor.content.push(rec);
		spearsAnchor.content.push({
			x: xx - sz / 2 * 0.9, y: yy - sz / 2 * 0.9
			, w: sz * 0.9
			, rx: sz / 2 * 0.9, ry: sz / 2 * 0.9
			, h: sz * 0.9
			, css: 'fanConnectionBase fanConnectionSecondary fanConnection' + zidx
		});
		if (zidx < 5) {
			let px: number = globalCommandDispatcher.renderer.tiler.tapPxSize();
			//let url: string = MZXBX_currentPlugins()[order].ui;
			let btn: TilePath = {
				x: xx - sz / 2
				, y: yy
				, points: 'M 0 0 a 1 1 0 0 0 ' + (sz * px) + ' 0 Z'
				, css: 'fanSamplerInteractionIcon fanButton' + zidx
				, activation: (x: number, y: number) => {
					let info = globalCommandDispatcher.findPluginRegistrationByKind(filterTarget.kind);
					if (info) {
						let url = info.ui;
						globalCommandDispatcher.promptFilterPluginDialog(filterTarget.id, url, filterTarget.data, (obj: any) => {
							globalCommandDispatcher.exe.commitProjectChanges(['filters', order], () => {
								filterTarget.data = obj;
							});
							//globalCommandDispatcher.reStartPlayIfPlay();
							return true;
						});
					}
				}
			};
			dragAnchor.content.push(btn);
		}
		if (zidx < globalCommandDispatcher.cfg().zoomEditSLess) {
			let txt: TileText = { text: filterTarget.kind + ':' + filterTarget.id, x: xx, y: yy, css: 'fanIconLabel' };
			dragAnchor.content.push(txt);
		}
		let filterFromY = globalCommandDispatcher.cfg().automationTop() + (order + 0.5) * globalCommandDispatcher.cfg().autoPointHeight;
		let start = globalCommandDispatcher.cfg().leftPad + globalCommandDispatcher.cfg().timelineWidth();
		let css = 'fanConnectionBase fanConnection' + zidx;
		if (order) {
			css = 'fanConnectionBase fanConnectionSecondary fanConnection' + zidx;
		}
		let hoLine: TileLine = { x1: start, x2: xx, y1: filterFromY, y2: filterFromY, css: css };
		spearsAnchor.content.push(hoLine);
		new SpearConnection().addSpear(order > 0, zidx,
			xx
			, filterFromY
			, sz
			, xx
			, yy
			, spearsAnchor);
		let fol = new FanOutputLine();
		for (let oo = 0; oo < filterTarget.outputs.length; oo++) {
			let outId = filterTarget.outputs[oo];
			if (outId) {
				fol.connectOutput(outId, filterTarget.id, xx, yy, spearsAnchor, fanLevelAnchor, zidx, filterTarget.outputs
					, (x: number, y: number) => {
						globalCommandDispatcher.exe.commitProjectChanges(['filters', order], () => {
							let nn = filterTarget.outputs.indexOf(outId);
							if (nn > -1) {
								filterTarget.outputs.splice(nn, 1);
							}
						});
					});
			} else {
				fol.connectSpeaker(filterTarget.id, xx, yy, spearsAnchor, fanLevelAnchor, zidx, filterTarget.outputs
					, (x: number, y: number) => {
						globalCommandDispatcher.exe.commitProjectChanges(['filters', order], () => {
							let nn = filterTarget.outputs.indexOf('');
							if (nn > -1) {
								filterTarget.outputs.splice(nn, 1);
							}
						});
					});
			}
		}
		/*if (zidx < 5) {
			let sbuttn: TileRectangle = {
				x: globalCommandDispatcher.cfg().leftPad + globalCommandDispatcher.cfg().timelineWidth() - 0.9 * globalCommandDispatcher.cfg().autoPointHeight / 2
				, y: filterFromY - 0.9 * globalCommandDispatcher.cfg().autoPointHeight / 2
				, w: 0.9 * globalCommandDispatcher.cfg().autoPointHeight
				, h: 0.9 * globalCommandDispatcher.cfg().autoPointHeight
				, rx: 0.9 * globalCommandDispatcher.cfg().autoPointHeight / 2
				, ry: 0.9 * globalCommandDispatcher.cfg().autoPointHeight / 2
				, css: 'fanFilterDrragger'
				, draggable: true
			};
			let btnAnchor: TileAnchor = {
				xx: sbuttn.x
				, yy: sbuttn.y
				, ww: sbuttn.w
				, hh: sbuttn.h
				, showZoom: fanLevelAnchor.showZoom, hideZoom: fanLevelAnchor.hideZoom, content: [sbuttn], translation: { x: 0, y: 0 }
			};
			sbuttn.activation = (x: number, y: number) => {
				if (!btnAnchor.translation) {
					btnAnchor.translation = { x: 0, y: 0 };
				}
				if (x == 0 && y == 0) {
					let dy = btnAnchor.translation.y;
					btnAnchor.translation.y = 0;
					let newOrder = order + Math.round(dy / globalCommandDispatcher.cfg().autoPointHeight);
					if (newOrder < 0) newOrder = 0;
					if (newOrder > globalCommandDispatcher.cfg().data.percussions.length - 1) newOrder > globalCommandDispatcher.cfg().data.percussions.length - 1;
					if (order != newOrder) {
						globalCommandDispatcher.exe.commitProjectChanges(['filters'], () => {
							globalCommandDispatcher.cfg().data.filters.splice(order, 1);
							globalCommandDispatcher.cfg().data.filters.splice(newOrder, 0, filterTarget);
						});
					}
				} else {
					btnAnchor.translation.y = btnAnchor.translation.y + y;
				}
				globalCommandDispatcher.renderer.tiler.resetAnchor(
					globalCommandDispatcher.renderer.mixer.spearsSVGgroup
					, spearsAnchor
					, LevelModes.normal);
			};
			spearsAnchor.content.push(btnAnchor);
		}*/
	}

}
