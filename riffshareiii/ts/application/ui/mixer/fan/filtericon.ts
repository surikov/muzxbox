class FilterIcon {
	filterId: string;
	constructor(filterId: string) {

		//console.log('FilterIcon', filter);
		this.filterId = filterId;
	}

	buildFilterSpot(cfg: MixerDataMathUtility, fanLevelAnchor: TileAnchor, zidx: number) {
		//console.log('buildPerformerSpot', this.performerId);
		for (let ii = 0; ii < cfg.data.filters.length; ii++) {
			if (cfg.data.filters[ii].id == this.filterId) {
				let filterTarget: Zvoog_FilterTarget = cfg.data.filters[ii];
				this.addFilterSpot(cfg, filterTarget, fanLevelAnchor, zidx);
				break;
			}
		}
	}
	addFilterSpot(cfg: MixerDataMathUtility, filterTarget: Zvoog_FilterTarget, fanLevelAnchor: TileAnchor, zidx: number) {
		let left = cfg.leftPad + cfg.timelineWidth() + cfg.padGridFan;
		let top = cfg.gridTop();
		let xx = left;
		let yy = top;
		if (filterTarget.iconPosition) {
			xx = left + filterTarget.iconPosition.x;
			yy = top + filterTarget.iconPosition.y;
		}

		let rec: TileRectangle = { x: xx, y: yy, w: cfg.pluginIconSize, rx: cfg.pluginIconSize / 2, ry: cfg.pluginIconSize / 2
		, h: cfg.pluginIconSize, css: 'fanFilterIcon' };
		fanLevelAnchor.content.push(rec);
		if (zidx < 5) {
			let txt: TileText = { text: filterTarget.kind + ':' + filterTarget.id, x: xx, y: yy + cfg.pluginIconSize, css: 'fanSamplerIcon' };
			fanLevelAnchor.content.push(txt);
		}
		//console.log('PerformerIcon', rec);
		//cfg.addSpear(3, cfg.leftPad+cfg.timelineWidth(), yy + cfg.pluginIconHeight / 2, xx, yy + cfg.pluginIconHeight / 2, fanLevelAnchor, 'fanSamplerIcon');
		this.addOutputs(cfg, filterTarget.outputs, fanLevelAnchor, zidx, xx + cfg.pluginIconSize, yy + cfg.pluginIconSize / 2);
	}
	buildAutoSpot(cfg: MixerDataMathUtility, fanLevelAnchor: TileAnchor, zidx: number) {
		//console.log('buildPerformerSpot', this.performerId);
		for (let ii = 0; ii < cfg.data.filters.length; ii++) {
			if (cfg.data.filters[ii].id == this.filterId) {
				let filterTarget: Zvoog_FilterTarget = cfg.data.filters[ii];
				this.addAutoSpot(cfg, filterTarget, fanLevelAnchor, zidx);
				break;
			}
		}
	}
	addAutoSpot(cfg: MixerDataMathUtility, filterTarget: Zvoog_FilterTarget, fanLevelAnchor: TileAnchor, zidx: number) {
		let left = cfg.leftPad + cfg.timelineWidth() + cfg.padGridFan;
		let top = cfg.gridTop();
		let xx = left;
		let yy = top;
		if (filterTarget.iconPosition) {
			xx = left + filterTarget.iconPosition.x;
			yy = top + filterTarget.iconPosition.y;
		}

		let rec: TileRectangle = { x: xx, y: yy, w: cfg.pluginIconSize, rx: cfg.pluginIconSize / 2, ry: cfg.pluginIconSize / 2
		, h: cfg.pluginIconSize, css: 'fanFilterIcon' };
		fanLevelAnchor.content.push(rec);
		if (zidx < 5) {
			let txt: TileText = { text: '' + filterTarget.kind + ':' + filterTarget.id, x: xx, y: yy + cfg.pluginIconSize, css: 'fanSamplerIcon' };
			fanLevelAnchor.content.push(txt);
		}
		//console.log('PerformerIcon', rec);
		let controlLineWidth=xx-cfg.leftPad - cfg.timelineWidth() - cfg.padGridFan;
		new ControlConnection().addLineFlow(cfg, yy + cfg.pluginIconSize / 2,  controlLineWidth
		, fanLevelAnchor);
		this.addOutputs(cfg, filterTarget.outputs, fanLevelAnchor, zidx, xx + cfg.pluginIconSize, yy + cfg.pluginIconSize / 2);
	}
	addOutputs(cfg: MixerDataMathUtility, outputs: string[], fanLevelAnchor: TileAnchor, zidx: number, fromX: number, fromY: number) {
		if (outputs)if (outputs.length > 0) {
			for (let oo = 0; oo < outputs.length; oo++) {
				let outId = outputs[oo];
				for (let ii = 0; ii < cfg.data.filters.length; ii++) {
					if (cfg.data.filters[ii].id == outId) {
						let toFilter: Zvoog_FilterTarget = cfg.data.filters[ii];
						let left = cfg.leftPad + cfg.timelineWidth() + cfg.padGridFan;
						let top = cfg.gridTop();
						let xx = left;
						let yy = top;
						if (toFilter.iconPosition) {
							xx = left + toFilter.iconPosition.x;
							yy = top + toFilter.iconPosition.y + cfg.pluginIconSize / 2;
						}
						new SpearConnection().addSpear( fromX, fromY, xx, yy, fanLevelAnchor);
						break;
					}
				}
			}
		} else {
			let speakerX=cfg.wholeWidth() - cfg.speakerIconPad-cfg.rightPad;
			new SpearConnection().addSpear( fromX, fromY, speakerX, cfg.gridTop() + cfg.gridHeight() / 2, fanLevelAnchor);
		}
	}
}
