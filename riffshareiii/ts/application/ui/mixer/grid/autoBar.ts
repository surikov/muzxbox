class AutomationBarContent {
	constructor(barIdx: number
		, cfg: MixerDataMathUtility
		, barLeft: number
		, barOctaveAnchor: TileAnchor
		, zIndex: number) {
		let curBar = cfg.data.timeline[barIdx];
		let width = MMUtil().set(curBar.metre).duration(curBar.tempo) * cfg.widthDurationRatio;
		let left = barLeft + width;
		let top = cfg.automationTop();
		let height = cfg.automationMaxHeight();
		/*
		let barAutoRightBorder: TileRectangle = {
			x: left
			, y: top
			, w: zoomPrefixLevelsCSS[zIndex].minZoom * 0.5
			, h: height
			, rx: zoomPrefixLevelsCSS[zIndex].minZoom * 0.25
			, ry: zoomPrefixLevelsCSS[zIndex].minZoom * 0.25
			, css: 'barRightBorder'
		};
		barOctaveAnchor.content.push(barAutoRightBorder);
*/
		for (let ff = 0; ff < cfg.data.filters.length; ff++) {
			let filter = cfg.data.filters[ff];
			if (filter.automation) {
				if (filter.automation.measures[barIdx]) {
					let measure: Zvoog_FilterMeasure = filter.automation.measures[barIdx];
					for (let ii = 0; ii < measure.changes.length; ii++) {
						let change = measure.changes[ii];
						let xx = barLeft + MMUtil().set(change.skip).duration(curBar.tempo) * cfg.widthDurationRatio;
						let aubtn: TilePolygon = {
							dots: [xx, top + cfg.notePathHeight * ff
								, xx+1,top + cfg.notePathHeight * ff
								, xx , top + cfg.notePathHeight * (ff+1)
							]
							, css: 'automationChangeDot'
						};
						barOctaveAnchor.content.push(aubtn);
					}
				}
			}
		}
		/*if (barIdx < cfg.data.comments.length) {
			for (let ii = 0; ii < cfg.data.comments[barIdx].points.length; ii++) {
				let itxt = cfg.data.comments[barIdx].points[ii];
				let xx = barLeft + MMUtil().set(itxt.skip).duration(curBar.tempo) * cfg.widthDurationRatio;
				let tt: TileText = {
					x: xx
					, y: top + cfg.notePathHeight * (1 + itxt.row) * txtZoomRatio
					, text: cfg.data.comments[barIdx].points[ii].text
					, css: 'commentLineText' + zoomPrefixLevelsCSS[zIndex].prefix
				};
				barOctaveAnchor.content.push(tt);
			}
		}*/
	}
}
