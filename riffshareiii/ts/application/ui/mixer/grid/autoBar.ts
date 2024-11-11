class AutomationBarContent {
	constructor(barIdx: number
		//, cfg: MixerDataMathUtility
		, barLeft: number
		, barOctaveAnchor: TileAnchor
		, zIndex: number) {
		let curBar = globalCommandDispatcher.cfg().data.timeline[barIdx];
		//let width = MMUtil().set(curBar.metre).duration(curBar.tempo) * globalCommandDispatcher.cfg().widthDurationRatio;
		//let left = barLeft + width;
		let top = globalCommandDispatcher.cfg().automationTop();
		//let height = globalCommandDispatcher.cfg().automationMaxHeight();
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
		let css = 'automationBgDot';
		//if (globalCommandDispatcher.cfg().data.focus) if (globalCommandDispatcher.cfg().data.focus == 2) css = 'automationFocusedDot';
		/*let yy =0;
		for (let ff = 0; ff < globalCommandDispatcher.cfg().data.filters.length; ff++) {
			let filter = globalCommandDispatcher.cfg().data.filters[ff];
			if (filter.automation) {
				if (filter.automation.measures[barIdx]) {
					let measure: Zvoog_FilterMeasure = filter.automation.measures[barIdx];
					for (let ii = 0; ii < measure.changes.length; ii++) {
						let change = measure.changes[ii];
						let xx = barLeft + MMUtil().set(change.skip).duration(curBar.tempo) * globalCommandDispatcher.cfg().widthDurationRatio;
						let aubtn: TilePolygon = {
							dots: [xx, top + globalCommandDispatcher.cfg().autoPointHeight * yy//globalCommandDispatcher.cfg().notePathHeight * ff
								, xx + globalCommandDispatcher.cfg().autoPointHeight, top + globalCommandDispatcher.cfg().autoPointHeight * yy//globalCommandDispatcher.cfg().notePathHeight * ff
								, xx, top + globalCommandDispatcher.cfg().autoPointHeight * (yy+1)//globalCommandDispatcher.cfg().notePathHeight * (ff + 1)
							]
							, css: css
						};
						barOctaveAnchor.content.push(aubtn);
						
					}
					yy++;
				}
			}
		}*/
		for (let aa = 0; aa < globalCommandDispatcher.cfg().data.automations.length; aa++) {
			let automation = globalCommandDispatcher.cfg().data.automations[aa];
			//let filter = globalCommandDispatcher.cfg().findFilterTarget[automation.output];
			//if (filter) {
				if (automation.measures[barIdx]) {
					let measure: Zvoog_FilterMeasure = automation.measures[barIdx];
					for (let ii = 0; ii < measure.changes.length; ii++) {
						let change = measure.changes[ii];
						let xx = barLeft + MMUtil().set(change.skip).duration(curBar.tempo) * globalCommandDispatcher.cfg().widthDurationRatio;
						let aubtn: TilePolygon = {
							dots: [xx, top + globalCommandDispatcher.cfg().autoPointHeight * aa//globalCommandDispatcher.cfg().notePathHeight * ff
								, xx + globalCommandDispatcher.cfg().autoPointHeight, top + globalCommandDispatcher.cfg().autoPointHeight * aa//globalCommandDispatcher.cfg().notePathHeight * ff
								, xx, top + globalCommandDispatcher.cfg().autoPointHeight * (aa+1)//globalCommandDispatcher.cfg().notePathHeight * (ff + 1)
							]
							, css: css
						};
						barOctaveAnchor.content.push(aubtn);
						//console.log(aubtn);
					}
					
				}
			//}
		}
		/*if (barIdx < globalCommandDispatcher.cfg().data.comments.length) {
			for (let ii = 0; ii < globalCommandDispatcher.cfg().data.comments[barIdx].points.length; ii++) {
				let itxt = globalCommandDispatcher.cfg().data.comments[barIdx].points[ii];
				let xx = barLeft + MMUtil().set(itxt.skip).duration(curBar.tempo) * globalCommandDispatcher.cfg().widthDurationRatio;
				let tt: TileText = {
					x: xx
					, y: top + globalCommandDispatcher.cfg().notePathHeight * (1 + itxt.row) * txtZoomRatio
					, text: globalCommandDispatcher.cfg().data.comments[barIdx].points[ii].text
					, css: 'commentLineText' + zoomPrefixLevelsCSS[zIndex].prefix
				};
				barOctaveAnchor.content.push(tt);
			}
		}*/
	}
}
