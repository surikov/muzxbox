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
	buildFilterSpot(fanLevelAnchor: TileAnchor, spearsAnchor: TileAnchor, zidx: number) {
		for (let ii = 0; ii < globalCommandDispatcher.cfg().data.filters.length; ii++) {
			if (globalCommandDispatcher.cfg().data.filters[ii].id == this.filterId) {
				let filterTarget: Zvoog_FilterTarget = globalCommandDispatcher.cfg().data.filters[ii];
				this.addFilterSpot(-1, filterTarget, fanLevelAnchor, spearsAnchor, zidx);
				break;
			}
		}
	}
	addFilterSpot(order: number, filterTarget: Zvoog_FilterTarget, fanLevelAnchor: TileAnchor, spearsAnchor: TileAnchor, zidx: number) {
		let sz = globalCommandDispatcher.cfg().pluginIconSize * zoomPrefixLevelsCSS[zidx].iconRatio;
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
		let rec: TileRectangle = {
			x: xx - sz / 2, y: yy - sz / 2, w: sz
			, rx: sz / 2, ry: sz / 2
			, h: sz
			, draggable: true
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
			, css: 'fanSamplerMoveIcon fanSamplerMoveIcon' + zidx
		};
		dragAnchor.content.push(rec);
		if (zidx < 3) {
			let txt: TileText = { text: filterTarget.kind + ':' + filterTarget.id, x: xx, y: yy, css: 'fanIconLabel' };
			dragAnchor.content.push(txt);
		}
		let clickBtnSz = globalCommandDispatcher.cfg().pluginIconSize * 0.3 * zoomPrefixLevelsCSS[zidx].iconRatio;
		if (zidx < 5) {

			let btn: TileRectangle = {
				x: xx - clickBtnSz / 2
				, y: yy + sz / 5 - clickBtnSz / 2
				, w: clickBtnSz
				, h: clickBtnSz
				, rx: clickBtnSz / 2
				, ry: clickBtnSz / 2
				, css: 'fanSamplerInteractionIcon fanButton' + zidx
				, activation: (x: number, y: number) => {
					console.log('' + filterTarget.kind + ':' + filterTarget.id);
				}
			};
			dragAnchor.content.push(btn);

		}
		if (zidx < 4) {
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
		}
		if (order > -1) {
			let filterFromY = globalCommandDispatcher.cfg().automationTop() + (order + 0.5) * globalCommandDispatcher.cfg().autoPointHeight;
			//new ControlConnection().addAudioStreamLineFlow(zidx, filterFromY, xx, yy, spearsAnchor);
			let left = globalCommandDispatcher.cfg().leftPad + globalCommandDispatcher.cfg().timelineWidth();
			let css = 'fanConnectionBase fanConnection'+zidx;
			let hoLine: TileLine = { x1: left, x2: xx, y1: filterFromY, y2: filterFromY, css: css };
			spearsAnchor.content.push(hoLine);
			new SpearConnection().addSpear(zidx,
				xx
				, filterFromY
				, sz //globalCommandDispatcher.cfg().pluginIconSize
				, xx
				, yy
				, spearsAnchor);
			//console.log(hoLine);
		}
		new FanOutputLine().addOutputs(filterTarget.outputs, fanLevelAnchor, spearsAnchor
			, filterTarget.id
			, xx
			, yy
			, zidx);
	}
	/*addAutoSpot(order: number, filterTarget: Zvoog_FilterTarget, fanLevelAnchor: TileAnchor, spearsAnchor: TileAnchor, zidx: number) {
		let sz = globalCommandDispatcher.cfg().pluginIconSize;
		let left = globalCommandDispatcher.cfg().leftPad + globalCommandDispatcher.cfg().timelineWidth() + globalCommandDispatcher.cfg().padGridFan;
		let top = globalCommandDispatcher.cfg().gridTop();
		let xx = left;
		let yy = top;
		if (filterTarget.iconPosition) {
			xx = left + filterTarget.iconPosition.x;
			yy = top + filterTarget.iconPosition.y;
		}

		let rec: TileRectangle = {
			x: xx-sz/2, y: yy-sz/2, w: sz
			, rx: sz / 2, ry: sz / 2
			, h: sz, css: 'fanFilterIcon'
		};
		fanLevelAnchor.content.push(rec);
		if (zidx < 5) {
			let txt: TileText = {
				text: '' + filterTarget.kind + ':' + filterTarget.id
				, x: xx, y: yy , css: 'fanIconLabel'
			};
			fanLevelAnchor.content.push(txt);
		}
		let filterFromY = globalCommandDispatcher.cfg().automationTop() + (order +0.5)* globalCommandDispatcher.cfg().autoPointHeight;
		new ControlConnection().addAudioStreamLineFlow(zidx,filterFromY
			, xx, yy, spearsAnchor);
		new FanOutputLine().addOutputs(filterTarget.outputs, fanLevelAnchor, spearsAnchor
			, filterTarget.id
			, xx 
			, yy 
			, zidx);
	}*/
}
