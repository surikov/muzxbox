class FilterIcon{
    filterId:string;
	constructor(filterId:string){
        
		//console.log('FilterIcon', filter);
        this.filterId=filterId;
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
		let left = cfg.leftPad+cfg.timelineWidth() + cfg.padGridFan;
		let top = cfg.gridTop();
		let xx = left;
		let yy = top;
		if (filterTarget.iconPosition) {
			xx = left + filterTarget.iconPosition.x;
			yy = top + filterTarget.iconPosition.y;
		}

		let rec: TileRectangle = { x: xx, y: yy, w: cfg.pluginIconWidth, rx:cfg.pluginIconHeight/4,ry:cfg.pluginIconHeight/4,h: cfg.pluginIconHeight, css: 'fanSamplerIcon' };
		fanLevelAnchor.content.push(rec);
		let txt: TileText = { text: 'z' + zidx + ':' + zoomPrefixLevelsCSS[zidx].minZoom + ':' + filterTarget.id, x: xx, y: yy + cfg.pluginIconHeight, css: 'fanSamplerIcon' };
		fanLevelAnchor.content.push(txt);
		//console.log('PerformerIcon', rec);
		//cfg.addSpear(3, cfg.leftPad+cfg.timelineWidth(), yy + cfg.pluginIconHeight / 2, xx, yy + cfg.pluginIconHeight / 2, fanLevelAnchor, 'fanSamplerIcon');
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
		let left = cfg.leftPad+cfg.timelineWidth() + cfg.padGridFan;
		let top = cfg.gridTop();
		let xx = left;
		let yy = top;
		if (filterTarget.iconPosition) {
			xx = left + filterTarget.iconPosition.x;
			yy = top + filterTarget.iconPosition.y;
		}

		let rec: TileRectangle = { x: xx, y: yy, w: cfg.pluginIconWidth, rx:cfg.pluginIconHeight/4,ry:cfg.pluginIconHeight/4,h: cfg.pluginIconHeight, css: 'fanSamplerIcon' };
		fanLevelAnchor.content.push(rec);
		let txt: TileText = { text: 'z' + zidx + ':' + zoomPrefixLevelsCSS[zidx].minZoom + ':' + filterTarget.id, x: xx, y: yy + cfg.pluginIconHeight, css: 'fanSamplerIcon' };
		fanLevelAnchor.content.push(txt);
		//console.log('PerformerIcon', rec);
		cfg.addSpear(3, cfg.leftPad+cfg.timelineWidth(), yy + cfg.pluginIconHeight / 2, xx, yy + cfg.pluginIconHeight / 2, fanLevelAnchor, 'fanSamplerIcon');
	}
}
