class SamplerBar {
	constructor(barIdx: number, drumIdx: number, zoomLevel: number, anchor: TileAnchor, left: number, durationLen: number) {
		let ww = globalCommandDispatcher.cfg().samplerDotHeight * (1 + zoomLevel / 3) / 4;
		let drum: Zvoog_PercussionTrack = globalCommandDispatcher.cfg().data.percussions[drumIdx];
		let measure: Zvoog_PercussionMeasure = drum.measures[barIdx];
		let yy = globalCommandDispatcher.cfg().samplerTop() + drumIdx * globalCommandDispatcher.cfg().samplerDotHeight;
		let tempo = globalCommandDispatcher.cfg().data.timeline[barIdx].tempo;
		let cucss = 'samplerDrumDotBg';
		if (zoomLevel < globalCommandDispatcher.cfg().zoomEditSLess) {

			let interpane: TileRectangle = {
				x: anchor.xx
				, y: globalCommandDispatcher.cfg().samplerTop()
				, w: anchor.ww
				, h: globalCommandDispatcher.cfg().data.percussions.length * globalCommandDispatcher.cfg().samplerDotHeight
				//, rx: barOctaveAnchor.ww / 2
				//, ry: globalCommandDispatcher.cfg().data.filters.length*globalCommandDispatcher.cfg().autoPointHeight / 2
				, css: 'commentPaneForClick'
				, activation: (x: number, y: number) => { this.drumCellClick(barIdx, x, y, zoomLevel); }
			};
			anchor.content.push(interpane);
		}
		for (let ss = 0; ss < measure.skips.length; ss++) {
			let skip: Zvoog_Metre = measure.skips[ss];
			let xx = left + MMUtil().set(skip).duration(tempo) * globalCommandDispatcher.cfg().widthDurationRatio

			let bgline: TilePolygon = {
				dots: [xx, yy
					, xx, yy + globalCommandDispatcher.cfg().samplerDotHeight
					, xx + durationLen, yy + globalCommandDispatcher.cfg().samplerDotHeight / 2
				]
				, css: 'samplerDrumDotLine'
			};
			anchor.content.push(bgline);

			let ply: TilePolygon = {
				dots: [xx, yy
					, xx, yy + globalCommandDispatcher.cfg().samplerDotHeight
					, xx + ww, yy + globalCommandDispatcher.cfg().samplerDotHeight / 2
				]
				, css: cucss
			};
			anchor.content.push(ply);
			if (zoomLevel < globalCommandDispatcher.cfg().zoomEditSLess) {
				/*let idot: TileRectangle = {
					x: xx + globalCommandDispatcher.cfg().samplerDotHeight / 16
					, y: yy + globalCommandDispatcher.cfg().samplerDotHeight * (1 / 2 - 1 / 16)
					, w: globalCommandDispatcher.cfg().samplerDotHeight / 8
					, h: globalCommandDispatcher.cfg().samplerDotHeight / 8
					, rx: globalCommandDispatcher.cfg().samplerDotHeight / 16
					, ry: globalCommandDispatcher.cfg().samplerDotHeight / 16
					, css: 'samplerDrumDotActive'
				};
				anchor.content.push(idot);
				*/
				let yShift = 0.3;
				if (zoomLevel < 2) yShift = 0.2;
				if (zoomLevel < 1) yShift = 0.15;
				let deleteIcon: TileText = {
					x: xx //+ globalCommandDispatcher.cfg().samplerDotHeight / 32
					, y: yy + globalCommandDispatcher.cfg().samplerDotHeight / 2 + yShift
					, text: icon_close_circle//icon_close
					, css: 'samplerDrumDeleteIcon samplerDrumDeleteSize' + zoomLevel
				};
				anchor.content.push(deleteIcon);
			}
		}
	}
	drumCellClick(barIdx: number, barX: number, yy: number, zz: number) {
		//console.log(barIdx, barX, yy, zz);
		let row = Math.floor(yy / globalCommandDispatcher.cfg().samplerDotHeight);
		let drum = globalCommandDispatcher.cfg().data.percussions[row];
		let info: BarStepStartEnd = globalCommandDispatcher.cfg().gridClickInfo(barIdx, barX, zz);
		let muStart = MMUtil().set(info.start);
		let muEnd = MMUtil().set(info.end);
		let deleteSkipIdx = 0;
		let addDrum = true;
		globalCommandDispatcher.exe.commitProjectChanges(['percussions', row, 'measures', barIdx], () => {
			for (deleteSkipIdx = 0; deleteSkipIdx < drum.measures[barIdx].skips.length; deleteSkipIdx++) {
				let probeSkip = drum.measures[barIdx].skips[deleteSkipIdx];
				if (muStart.more(probeSkip)) {
					//
				} else {
					if (muEnd.more(probeSkip)) {
						addDrum = false;
						console.log('drop', barIdx, probeSkip, drum);
						drum.measures[barIdx].skips.splice(deleteSkipIdx, 1);
						deleteSkipIdx--;
						break;
					}
				}
			}
			if (addDrum) {
				console.log('add', barIdx, muStart, drum);
				drum.measures[barIdx].skips.push(muStart.metre());
			}
		});
	}
}
