class AutomationBarContent {
	constructor(barIdx: number
		, barLeft: number
		, barOctaveAnchor: TileAnchor
		, zIndex: number) {
		let curBar = globalCommandDispatcher.cfg().data.timeline[barIdx];
		let top = globalCommandDispatcher.cfg().automationTop();
		let css = 'automationBgDot';
		for (let aa = 0; aa < globalCommandDispatcher.cfg().data.filters.length; aa++) {
			let filter = globalCommandDispatcher.cfg().data.filters[aa];
			if (filter.automation[barIdx]) {
				let measure: Zvoog_FilterMeasure = filter.automation[barIdx];
				for (let ii = 0; ii < measure.changes.length; ii++) {
					let change = measure.changes[ii];
					let xx = barLeft + MMUtil().set(change.skip).duration(curBar.tempo) * globalCommandDispatcher.cfg().widthDurationRatio;
					let aubtn: TilePolygon = {
						dots: [xx, top + globalCommandDispatcher.cfg().autoPointHeight * aa//globalCommandDispatcher.cfg().notePathHeight * ff
							, xx + globalCommandDispatcher.cfg().autoPointHeight, top + globalCommandDispatcher.cfg().autoPointHeight * aa//globalCommandDispatcher.cfg().notePathHeight * ff
							, xx, top + globalCommandDispatcher.cfg().autoPointHeight * (aa + 1)//globalCommandDispatcher.cfg().notePathHeight * (ff + 1)
						]
						, css: css
					};
					barOctaveAnchor.content.push(aubtn);
					if (zIndex < globalCommandDispatcher.cfg().zoomEditSLess) {
						/*let idot: TileRectangle = {
							x: xx + globalCommandDispatcher.cfg().autoPointHeight  /16
							, y: top + globalCommandDispatcher.cfg().autoPointHeight /16+globalCommandDispatcher.cfg().autoPointHeight * aa
							, w: globalCommandDispatcher.cfg().autoPointHeight / 8
							, h: globalCommandDispatcher.cfg().autoPointHeight / 8
							, rx: globalCommandDispatcher.cfg().autoPointHeight / 16
							, ry: globalCommandDispatcher.cfg().autoPointHeight / 16
							, css: 'automationFocusedDot'
						};
						barOctaveAnchor.content.push(idot);*/
						let yShift = 2*0.4;
						if (zIndex < 2) yShift = 2*0.27;
						if (zIndex < 1) yShift = 2*0.20;
						let deleteIcon: TileText = {
							x: xx + globalCommandDispatcher.cfg().autoPointHeight / 16
							, y: top + globalCommandDispatcher.cfg().autoPointHeight / 16 + globalCommandDispatcher.cfg().autoPointHeight * aa +yShift
							, text: icon_close_circle
							, css: 'samplerDrumDeleteIcon samplerDrumDeleteSize' + zIndex
						};
						barOctaveAnchor.content.push(deleteIcon);
					}
				}

			}
		}
	}
}
