class FanPane {
	resetPlates(cfg: MixerDataMathUtility): void {
		console.log('FanPane.resetPlates', cfg);
		//for (let ff = 0; ff < cfg.data.filters.length; ff++) {
		//	if (cfg.data.filters[ff].automation) {
		//		console.log('automation', ff, cfg.data.filters[ff]);
		//	}
		//}
		for (let tt = 0; tt < cfg.data.tracks.length; tt++) {
			new PerformerIcon().buildPerformerSpot(cfg.data.tracks[tt]);
			//console.log('source', tt, cfg.data.tracks[tt].performer);
		}
	}
}
