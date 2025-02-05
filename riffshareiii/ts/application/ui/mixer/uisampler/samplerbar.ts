class SamplerBar {
	constructor(barIdx: number, drumIdx: number, zoomLevel: number, anchor: TileAnchor, left: number, durationLen: number) {
		let ww = globalCommandDispatcher.cfg().samplerDotHeight * (1 + zoomLevel / 3) / 4;
		let drum: Zvoog_PercussionTrack = globalCommandDispatcher.cfg().data.percussions[drumIdx];
		let measure: Zvoog_PercussionMeasure = drum.measures[barIdx];
		let yy = globalCommandDispatcher.cfg().samplerTop() + drumIdx * globalCommandDispatcher.cfg().samplerDotHeight;
		let tempo = globalCommandDispatcher.cfg().data.timeline[barIdx].tempo;
		let css = 'samplerDrumDotBg';
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
				, css: css
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
				let yShift = 0.4;
				if (zoomLevel < 2) yShift = 0.27;
				if (zoomLevel < 1) yShift = 0.20;
				let deleteIcon: TileText = {
					x: xx + globalCommandDispatcher.cfg().samplerDotHeight / 32
					, y: yy + globalCommandDispatcher.cfg().samplerDotHeight / 2 + yShift
					, text: icon_close_circle//icon_close
					, css: 'samplerDrumDeleteIcon samplerDrumDeleteSize' + zoomLevel
				};
				anchor.content.push(deleteIcon);
			}
		}
	}
}
