class FilterIcon {
	filterId: string;
	constructor(filterId: string) {
		this.filterId = filterId;
	}
	buildAutoSpot(order: number, fanLevelAnchor: TileAnchor, spearsAnchor: TileAnchor, zidx: number) {
		//console.log('buildPerformerSpot', this.performerId);
		for (let ii = 0; ii < globalCommandDispatcher.cfg().data.filters.length; ii++) {
			if (globalCommandDispatcher.cfg().data.filters[ii].id == this.filterId) {
				let filterTarget: Zvoog_FilterTarget = globalCommandDispatcher.cfg().data.filters[ii];
				this.addFilterSpot(order, filterTarget, fanLevelAnchor, spearsAnchor, zidx);
				//this.addAutoSpot(order, filterTarget, fanLevelAnchor, spearsAnchor, zidx);
				break;
			}
		}
	}

	addFilterSpot(order: number, filterTarget: Zvoog_FilterTarget, fanLevelAnchor: TileAnchor, spearsAnchor: TileAnchor, zidx: number) {
		//let sz = globalCommandDispatcher.cfg().pluginIconSize * zoomPrefixLevelsCSS[zidx].iconRatio;
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
			/*, draggable: true
			, activation: (x: number, y: number) => {
				//console.log('sampler', x, y);
				if (!dragAnchor.translation) {
					dragAnchor.translation = { x: 0, y: 0 };
				}
				if (x == 0 && y == 0) {
					console.log('done', dragAnchor.translation);
					if (!filterTarget.iconPosition) {
						filterTarget.iconPosition = { x: 0, y: 0 };
					}
					filterTarget.iconPosition.x = filterTarget.iconPosition.x + dragAnchor.translation.x;
					filterTarget.iconPosition.y = filterTarget.iconPosition.y + dragAnchor.translation.y;
					console.log('drop' + filterTarget.kind + ':' + filterTarget.id + ' to ' + filterTarget.iconPosition.x + '/' + filterTarget.iconPosition.y);
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
			rec.activation = (x: number, y: number) => {
				if (!dragAnchor.translation) {
					dragAnchor.translation = { x: 0, y: 0 };
				}
				dropAnchor.content = [];
				if (x == 0 && y == 0) {
					if (!filterTarget.iconPosition) {
						filterTarget.iconPosition = { x: 0, y: 0 };
					}
					if (toSpeaker) {
						filterTarget.outputs.push('');
					} else {
						if (toFilter) {
							filterTarget.outputs.push(toFilter.id);
						} else {
							filterTarget.iconPosition.x = filterTarget.iconPosition.x + dragAnchor.translation.x;
							filterTarget.iconPosition.y =filterTarget.iconPosition.y + dragAnchor.translation.y;
						}
					}
					dragAnchor.translation = { x: 0, y: 0 };
					globalCommandDispatcher.resetProject();
				} else {
					dragAnchor.translation.x = dragAnchor.translation.x + x;
					dragAnchor.translation.y = dragAnchor.translation.y + y;
					if (filterTarget.iconPosition) {
						let xx = filterTarget.iconPosition.x + dragAnchor.translation.x;
						let yy = filterTarget.iconPosition.y + dragAnchor.translation.y;
						toFilter = globalCommandDispatcher.cfg().dragFindPluginFilterIcon(xx, yy, zidx, filterTarget.id, filterTarget.outputs);
						if (toFilter) {
							toSpeaker = false;
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
								toFilter = null;
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
			rec.css = 'fanSamplerMoveIcon fanSamplerMoveIcon' + zidx;
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
		//let clickBtnSz = globalCommandDispatcher.cfg().pluginIconSize * 0.3 * zoomPrefixLevelsCSS[zidx].iconRatio;
		//let clickBtnSz = globalCommandDispatcher.cfg().fanPluginIconSize(zidx) * 0.3;
		if (zidx < 5) {
			let px: number = globalCommandDispatcher.renderer.tiler.tapPxSize();
			let btn: TilePath = {
				x: xx - sz / 2
				, y: yy
				, points: 'M 0 0 a 1 1 0 0 0 ' + (sz * px) + ' 0 Z'
				, css: 'fanSamplerInteractionIcon fanButton' + zidx
				, activation: (x: number, y: number) => {
					console.log('' + filterTarget.kind + ':' + filterTarget.id);
				}
			};
			dragAnchor.content.push(btn);

		}
		if (zidx < 3) {
			let txt: TileText = { text: filterTarget.kind + ':' + filterTarget.id, x: xx, y: yy, css: 'fanIconLabel' };
			dragAnchor.content.push(txt);
		}
		/*if (zidx < 4) {
			let yZshift = 0.3;
			if (zidx > 0) yZshift = 0.25;
			if (zidx > 1) yZshift = 0.2;
			if (zidx > 2) yZshift = 0.15;


			let txt: TileText = {
				text: icon_gear
				, x: xx
				, y: yy + sz / 5 + clickBtnSz * yZshift
				, css: 'fanSamplerActionIconLabel'
			};
			dragAnchor.content.push(txt);
		}*/

		let filterFromY = globalCommandDispatcher.cfg().automationTop() + (order + 0.5) * globalCommandDispatcher.cfg().autoPointHeight;
		let start = globalCommandDispatcher.cfg().leftPad + globalCommandDispatcher.cfg().timelineWidth();
		let css = 'fanConnectionBase fanConnectionSecondary fanConnection' + zidx;
		let hoLine: TileLine = { x1: start, x2: xx, y1: filterFromY, y2: filterFromY, css: css };
		spearsAnchor.content.push(hoLine);
		new SpearConnection().addSpear(true, zidx,
			xx
			, filterFromY
			, sz //globalCommandDispatcher.cfg().pluginIconSize
			, xx
			, yy
			, spearsAnchor);

		new FanOutputLine().addOutputs(filterTarget.outputs, fanLevelAnchor, spearsAnchor
			, filterTarget.id
			, xx
			, yy
			, zidx);
	}

}
