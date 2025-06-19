class SamplerBar {
	constructor(barIdx: number, drumIdx: number, zoomLevel: number, anchor: TileAnchor, left: number, durationLen: number) {
		let ww = globalCommandDispatcher.cfg().samplerDotHeight * (1 + zoomLevel / 3) / 4;
		let drum: Zvoog_PercussionTrack = globalCommandDispatcher.cfg().data.percussions[drumIdx];
		let measure: Zvoog_PercussionMeasure = drum.measures[barIdx];
		let yy = globalCommandDispatcher.cfg().samplerTop() + drumIdx * globalCommandDispatcher.cfg().samplerDotHeight;
		let tempo = globalCommandDispatcher.cfg().data.timeline[barIdx].tempo;
		let cucss = 'samplerDrumDotBg';
		let licss = 'samplerDrumDotLine';
		let soloOnly = false;
		for (let ss = 0; ss < globalCommandDispatcher.cfg().data.percussions.length; ss++)
			if (globalCommandDispatcher.cfg().data.percussions[ss].sampler.state == 2) {
				soloOnly = true;
				break;
			}

		for (let tt = 0; tt < globalCommandDispatcher.cfg().data.tracks.length; tt++) {
			if (globalCommandDispatcher.cfg().data.tracks[tt].performer.state == 2) {
				soloOnly = true;
				break;
			}
		}
		if ((soloOnly && drum.sampler.state != 2) || ((!soloOnly) && drum.sampler.state == 1)) {
			cucss = 'samplerDrumMuteBg';
			licss = 'samplerDrumMuteLine';
		}
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
				, css: licss//'samplerDrumDotLine'
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
						//console.log('drop', barIdx, probeSkip, drum);
						drum.measures[barIdx].skips.splice(deleteSkipIdx, 1);
						deleteSkipIdx--;
						break;
					}
				}
			}
			if (addDrum) {
				//console.log('add', barIdx, muStart, drum);
				drum.measures[barIdx].skips.push(muStart.metre());
			}
		});
	}
}
