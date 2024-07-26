class FanPane {
	filterIcons: FilterIcon[];
	autoIcons: FilterIcon[];
	performerIcons: PerformerIcon[];
	samplerIcons: SamplerIcon[];
	spears: SpearConnection[];
	resetPlates(cfg: MixerDataMathUtility, fanAnchors: TileAnchor[]): void {
		console.log('FanPane.resetPlates', cfg, fanAnchors);
		this.filterIcons = [];
		this.autoIcons = [];
		this.performerIcons = [];
		this.samplerIcons = [];
		for (let ff = 0; ff < cfg.data.filters.length; ff++) {
			if (cfg.data.filters[ff].automation) {
				this.autoIcons.push(new FilterIcon(cfg.data.filters[ff].id));
			} else {
				this.filterIcons.push(new FilterIcon(cfg.data.filters[ff].id));
			}

		}
		for (let tt = 0; tt < cfg.data.tracks.length; tt++) {
			this.performerIcons.push(new PerformerIcon(cfg.data.tracks[tt].performer.id));
		}
		for (let tt = 0; tt < cfg.data.percussions.length; tt++) {
			this.samplerIcons.push(new SamplerIcon(cfg.data.percussions[tt].sampler.id));
		}

		for (let ii = 0; ii < zoomPrefixLevelsCSS.length - 1; ii++) {
			this.buildPerformerIcons(cfg, fanAnchors[ii], ii);
			this.buildFilterIcons(cfg, fanAnchors[ii], ii);
			this.buildAutoIcons(cfg, fanAnchors[ii], ii);
			this.buildSamplerIcons(cfg, fanAnchors[ii], ii);
			this.buildOutIcon(cfg, fanAnchors[ii], ii);
			//this.connectPlugins(cfg, fanAnchors[ii], ii);
		}
		//this.buildAutoIcons();
		//this.buildFilterIcons();
		//this.buildOutIcon();
	}
	buildPerformerIcons(cfg: MixerDataMathUtility, fanAnchor: TileAnchor, zidx: number) {
		for (let ii = 0; ii < this.performerIcons.length; ii++) {
			this.performerIcons[ii].buildPerformerSpot(cfg, fanAnchor, zidx);
		}
	}
	buildSamplerIcons(cfg: MixerDataMathUtility, fanAnchor: TileAnchor, zidx: number) {
		for (let ii = 0; ii < this.samplerIcons.length; ii++) {
			this.samplerIcons[ii].buildSamplerSpot(cfg, fanAnchor, zidx);
		}
	}
	buildAutoIcons(cfg: MixerDataMathUtility, fanAnchor: TileAnchor, zidx: number) {
		for (let ii = 0; ii < this.autoIcons.length; ii++) {
			this.autoIcons[ii].buildAutoSpot(cfg, fanAnchor, zidx);
		}
	}
	buildFilterIcons(cfg: MixerDataMathUtility, fanAnchor: TileAnchor, zidx: number) {
		for (let ii = 0; ii < this.filterIcons.length; ii++) {
			this.filterIcons[ii].buildFilterSpot(cfg, fanAnchor, zidx);
		}
	}
	buildOutIcon(cfg: MixerDataMathUtility, fanAnchor: TileAnchor, zidx: number) {
		let xx = cfg.wholeWidth() - cfg.pluginIconWidth;
		let yy = cfg.gridTop() + cfg.gridHeight() / 2-cfg.pluginIconHeight/2;

		let rec: TileRectangle = { x: xx, y: yy, w: cfg.pluginIconWidth, rx: cfg.pluginIconWidth / 3, ry: cfg.pluginIconHeight / 3, h: cfg.pluginIconHeight, css: 'fanSamplerIcon' };
		fanAnchor.content.push(rec);
		if (zidx < 5) {
			let txt: TileText = { text: 'Speaker', x: xx, y: yy + cfg.pluginIconHeight, css: 'fanSamplerIcon' };
			fanAnchor.content.push(txt);
		}
	}
	
}
