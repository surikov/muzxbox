class FanPane {
	filterIcons: FilterIcon[];
	performerIcons: PerformerIcon[];
	spears: SpearConnection[];
	resetPlates(cfg: MixerDataMathUtility): void {
		console.log('FanPane.resetPlates', cfg);
		this.filterIcons = [];
		this.performerIcons = [];
		for (let ff = 0; ff < cfg.data.filters.length; ff++) {
			//if (cfg.data.filters[ff].automation) {
			this.filterIcons.push(new FilterIcon(cfg.data.filters[ff]));
		}
		for (let tt = 0; tt < cfg.data.tracks.length; tt++) {
			this.performerIcons.push(new PerformerIcon(cfg.data.tracks[tt]));
		}
		this.buildPerformerIcons();
		this.buildAutoIcons();
		this.buildFilterIcons();
		this.buildOutIcon();
	}
	buildPerformerIcons() {
		for (let ii = 0; ii < this.performerIcons.length; ii++) {
			this.performerIcons[ii].buildPerformerSpot();
		}
	}
	buildAutoIcons() {
		for (let ii = 0; ii < this.filterIcons.length; ii++) {
			if (this.filterIcons[ii].filter.automation) {
				this.filterIcons[ii].buildFilterSpot();
			} else {
				//
			}
		}
	}
	buildFilterIcons() {
		for (let ii = 0; ii < this.filterIcons.length; ii++) {
			if (this.filterIcons[ii].filter.automation) {
				//
			} else {
				this.filterIcons[ii].buildFilterSpot();
			}
		}
	}
	buildOutIcon() {

	}
	connectPerformers() {

	}
	connectFilters() {

	}
}
