class SamplerBar {
	constructor(//data: Zvoog_Project
		barIdx: number, drumIdx: number, zoomLevel: number, anchor: TileAnchor, left: number
		, durationLen: number
	) {
		//let durationLen = 1 * globalCommandDispatcher.cfg().widthDurationRatio;
		let ww = globalCommandDispatcher.cfg().samplerDotHeight * (1 + zoomLevel / 3) / 4;
		//let mixm: MixerDataMath = new MixerDataMath(data);
		let drum: Zvoog_PercussionTrack = globalCommandDispatcher.cfg().data.percussions[drumIdx];
		let measure: Zvoog_PercussionMeasure = drum.measures[barIdx];
		//console.log(drum.title,barIdx,measure.skips);
		//let yy = globalCommandDispatcher.cfg().samplerTop() + drumIdx * globalCommandDispatcher.cfg().notePathHeight;
		//let yy = globalCommandDispatcher.cfg().gridTop() + drumIdx * globalCommandDispatcher.cfg().notePathHeight;
		//let yy = globalCommandDispatcher.cfg().gridTop() + globalCommandDispatcher.cfg().gridHeight() - 2 * globalCommandDispatcher.cfg().data.percussions.length + drumIdx * globalCommandDispatcher.cfg().notePathHeight * 2;
		let yy = globalCommandDispatcher.cfg().samplerTop() + drumIdx * globalCommandDispatcher.cfg().samplerDotHeight;
		let tempo = globalCommandDispatcher.cfg().data.timeline[barIdx].tempo;
		let css = 'samplerDrumDotBg';
		/*if (zoomLevel < 3) {
			css = 'samplerDrumDotActive';
		}*/
		//if (globalCommandDispatcher.cfg().data.focus) if (globalCommandDispatcher.cfg().data.focus == 1) css = 'samplerDrumDotFocused';
		for (let ss = 0; ss < measure.skips.length; ss++) {
			let skip: Zvoog_Metre = measure.skips[ss];
			let xx = left + MMUtil().set(skip).duration(tempo) * globalCommandDispatcher.cfg().widthDurationRatio
			/*
						let dot: TileRectangle = {
							x: xx
							, y: yy + 0.1
							, w: 0.8 * mixm.notePathHeight
							, h: 0.8 * mixm.notePathHeight
							, rx: 1 * mixm.notePathHeight / 8
							, ry: 1 * mixm.notePathHeight / 8
							, css: 'samplerDrumDot'
						};
						anchor.content.push(dot);
						*/


			//console.log(zoomLevel, ww, xx);

			let bgline: TilePolygon = {
				//id:''+ww+'x'+zoomLevel+'x'+Math.random(),
				dots: [xx, yy
					, xx, yy + globalCommandDispatcher.cfg().samplerDotHeight
					, xx + durationLen, yy + globalCommandDispatcher.cfg().samplerDotHeight / 2
				]
				, css: 'samplerDrumDotLine'
			};
			anchor.content.push(bgline);

			let ply: TilePolygon = {
				//id:''+ww+'x'+zoomLevel+'x'+Math.random(),
				dots: [xx, yy
					, xx, yy + globalCommandDispatcher.cfg().samplerDotHeight
					, xx + ww, yy + globalCommandDispatcher.cfg().samplerDotHeight / 2
				]
				, css: css
			};
			anchor.content.push(ply);
			if (zoomLevel < 3) {
				let idot: TileRectangle = {
					x: xx + globalCommandDispatcher.cfg().samplerDotHeight / 16
					, y: yy + globalCommandDispatcher.cfg().samplerDotHeight * (1 / 2 - 1 / 16)
					, w: globalCommandDispatcher.cfg().samplerDotHeight / 8
					, h: globalCommandDispatcher.cfg().samplerDotHeight / 8
					, rx: globalCommandDispatcher.cfg().samplerDotHeight / 16
					, ry: globalCommandDispatcher.cfg().samplerDotHeight / 16
					, css: 'samplerDrumDotActive'
				};
				anchor.content.push(idot);
			}
		}
	}
}
