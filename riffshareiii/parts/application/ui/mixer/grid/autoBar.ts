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
						let yShift = 2 * 0.4;
						if (zIndex < 2) yShift = 2 * 0.27;
						if (zIndex < 1) yShift = 2 * 0.20;
						let editIcon: TileText = {
							x: xx + globalCommandDispatcher.cfg().autoPointHeight / 16
							, y: top + globalCommandDispatcher.cfg().autoPointHeight / 16 + globalCommandDispatcher.cfg().autoPointHeight * aa + yShift
							, text: icon_sliders
							, css: 'samplerDrumDeleteIcon samplerDrumDeleteSize' + zIndex
						};
						barOctaveAnchor.content.push(editIcon);


					}
				}

			}
		}
		if (zIndex < globalCommandDispatcher.cfg().zoomEditSLess) {

			let interpane: TileRectangle = {
				x: barOctaveAnchor.xx
				, y: globalCommandDispatcher.cfg().automationTop()
				, w: barOctaveAnchor.ww
				, h: globalCommandDispatcher.cfg().data.filters.length * globalCommandDispatcher.cfg().autoPointHeight
				//, rx: barOctaveAnchor.ww / 2
				//, ry: globalCommandDispatcher.cfg().data.filters.length*globalCommandDispatcher.cfg().autoPointHeight / 2
				, css: 'commentPaneForClick'
				, activation: (x: number, y: number) => { this.autoCellClick(barIdx, x, y, zIndex); }
			};
			barOctaveAnchor.content.push(interpane);
		}
	}
	autoCellClick(barIdx: number, barX: number, yy: number, zz: number) {

		let row = Math.floor(yy / globalCommandDispatcher.cfg().autoPointHeight);
		let filter = globalCommandDispatcher.cfg().data.filters[row];
		let info: BarStepStartEnd = globalCommandDispatcher.cfg().gridClickInfo(barIdx, barX, zz);
		let change: null | Zvoog_FilterStateChange = null;
		let muStart = MMUtil().set(info.start);
		let muEnd = MMUtil().set(info.end);
		for (let cc = 0; cc < filter.automation[barIdx].changes.length; cc++) {
			let testChange = filter.automation[barIdx].changes[cc];
			if (muStart.more(testChange.skip)) {
				//
			} else {
				if (muEnd.more(testChange.skip)) {
					change = testChange;
					break;
				}
			}
		}
		console.log('autoCellClick', change);
		let finfo = globalCommandDispatcher.findPluginRegistrationByKind(filter.kind);
		if (finfo) {
			globalCommandDispatcher.pointPluginDialog.openPointPluginDialogFrame(filter, finfo);
		}
	}
}
