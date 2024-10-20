class FilterIcon {
	filterId: string;
	constructor(filterId: string) {

		//console.log('FilterIcon', filter);
		this.filterId = filterId;
	}

	buildFilterSpot(fanLevelAnchor: TileAnchor, spearsAnchor: TileAnchor, zidx: number) {
		//console.log('buildPerformerSpot', this.performerId);
		for (let ii = 0; ii < globalCommandDispatcher.cfg().data.filters.length; ii++) {
			if (globalCommandDispatcher.cfg().data.filters[ii].id == this.filterId) {
				let filterTarget: Zvoog_FilterTarget = globalCommandDispatcher.cfg().data.filters[ii];
				this.addFilterSpot(filterTarget, fanLevelAnchor, spearsAnchor, zidx);
				break;
			}
		}
	}
	addFilterSpot(filterTarget: Zvoog_FilterTarget, fanLevelAnchor: TileAnchor, spearsAnchor: TileAnchor, zidx: number) {
		let left = globalCommandDispatcher.cfg().leftPad + globalCommandDispatcher.cfg().timelineWidth() + globalCommandDispatcher.cfg().padGridFan;
		let top = globalCommandDispatcher.cfg().gridTop();
		let xx = left;
		let yy = top;
		if (filterTarget.iconPosition) {
			xx = left + filterTarget.iconPosition.x;
			yy = top + filterTarget.iconPosition.y;
		}

		let rec: TileRectangle = {
			x: xx, y: yy, w: globalCommandDispatcher.cfg().pluginIconSize
			, rx: globalCommandDispatcher.cfg().pluginIconSize / 2, ry: globalCommandDispatcher.cfg().pluginIconSize / 2
			, h: globalCommandDispatcher.cfg().pluginIconSize, css: 'fanFilterIcon'
		};
		fanLevelAnchor.content.push(rec);
		if (zidx < 5) {
			let txt: TileText = { text: filterTarget.kind + ':' + filterTarget.id, x: xx, y: yy + globalCommandDispatcher.cfg().pluginIconSize, css: 'fanIconLabel' };
			fanLevelAnchor.content.push(txt);
		}
		//console.log('PerformerIcon', rec);
		//globalCommandDispatcher.cfg().addSpear(3, globalCommandDispatcher.cfg().leftPad+globalCommandDispatcher.cfg().timelineWidth(), yy + globalCommandDispatcher.cfg().pluginIconHeight / 2, xx, yy + globalCommandDispatcher.cfg().pluginIconHeight / 2, fanLevelAnchor, 'fanSamplerIcon');
		new FanOutputLine().addOutputs(filterTarget.outputs, fanLevelAnchor, spearsAnchor
			, filterTarget.id
			, xx + globalCommandDispatcher.cfg().pluginIconSize / 2
			, yy + globalCommandDispatcher.cfg().pluginIconSize / 2);
	}
	buildAutoSpot(fanLevelAnchor: TileAnchor, spearsAnchor: TileAnchor, zidx: number) {
		//console.log('buildPerformerSpot', this.performerId);
		for (let ii = 0; ii < globalCommandDispatcher.cfg().data.filters.length; ii++) {
			if (globalCommandDispatcher.cfg().data.filters[ii].id == this.filterId) {
				let filterTarget: Zvoog_FilterTarget = globalCommandDispatcher.cfg().data.filters[ii];
				this.addAutoSpot(filterTarget, fanLevelAnchor, spearsAnchor, zidx);
				break;
			}
		}
	}
	addAutoSpot(filterTarget: Zvoog_FilterTarget, fanLevelAnchor: TileAnchor, spearsAnchor: TileAnchor, zidx: number) {
		let left = globalCommandDispatcher.cfg().leftPad + globalCommandDispatcher.cfg().timelineWidth() + globalCommandDispatcher.cfg().padGridFan;
		let top = globalCommandDispatcher.cfg().gridTop();
		let xx = left;
		let yy = top;
		if (filterTarget.iconPosition) {
			xx = left + filterTarget.iconPosition.x;
			yy = top + filterTarget.iconPosition.y;
		}

		let rec: TileRectangle = {
			x: xx, y: yy, w: globalCommandDispatcher.cfg().pluginIconSize
			, rx: globalCommandDispatcher.cfg().pluginIconSize / 2, ry: globalCommandDispatcher.cfg().pluginIconSize / 2
			, h: globalCommandDispatcher.cfg().pluginIconSize, css: 'fanFilterIcon'
		};
		fanLevelAnchor.content.push(rec);
		if (zidx < 5) {
			let txt: TileText = {
				text: '' + filterTarget.kind + ':' + filterTarget.id
				, x: xx, y: yy + globalCommandDispatcher.cfg().pluginIconSize, css: 'fanIconLabel'
			};
			fanLevelAnchor.content.push(txt);
		}
		//console.log('PerformerIcon', rec);
		let controlLineWidth = xx - globalCommandDispatcher.cfg().leftPad - globalCommandDispatcher.cfg().timelineWidth();
		new ControlConnection().addLineFlow(yy + globalCommandDispatcher.cfg().pluginIconSize / 2, controlLineWidth, fanLevelAnchor);
		new FanOutputLine().addOutputs(filterTarget.outputs, fanLevelAnchor, spearsAnchor
			, filterTarget.id
			, xx + globalCommandDispatcher.cfg().pluginIconSize / 2
			, yy + globalCommandDispatcher.cfg().pluginIconSize / 2);
	}
	/*
	addOutputs(outputs: string[], fanLevelAnchor: TileAnchor, zidx: number, fromX: number, fromY: number) {
		if (outputs) if (outputs.length > 0) {
			for (let oo = 0; oo < outputs.length; oo++) {
				let outId = outputs[oo];
				for (let ii = 0; ii < globalCommandDispatcher.cfg().data.filters.length; ii++) {
					if (globalCommandDispatcher.cfg().data.filters[ii].id == outId) {
						let toFilter: Zvoog_FilterTarget = globalCommandDispatcher.cfg().data.filters[ii];
						let left = globalCommandDispatcher.cfg().leftPad + globalCommandDispatcher.cfg().timelineWidth() + globalCommandDispatcher.cfg().padGridFan;
						let top = globalCommandDispatcher.cfg().gridTop();
						let xx = left+ globalCommandDispatcher.cfg().pluginIconSize / 2;
						let yy = top+ globalCommandDispatcher.cfg().pluginIconSize / 2;
						if (toFilter.iconPosition) {
							xx = left + toFilter.iconPosition.x+ globalCommandDispatcher.cfg().pluginIconSize / 2;
							yy = top + toFilter.iconPosition.y + globalCommandDispatcher.cfg().pluginIconSize / 2;
						}
						new SpearConnection().addSpear(fromX, fromY, xx, yy, fanLevelAnchor);
						break;
					}
				}
			}
		} else {
			let speakerX = globalCommandDispatcher.cfg().wholeWidth() - globalCommandDispatcher.cfg().speakerIconPad - globalCommandDispatcher.cfg().rightPad;
			new SpearConnection().addSpear(fromX, fromY, speakerX
				, globalCommandDispatcher.cfg().gridTop() + globalCommandDispatcher.cfg().gridHeight() / 2, fanLevelAnchor);
		}
	}*/
}
