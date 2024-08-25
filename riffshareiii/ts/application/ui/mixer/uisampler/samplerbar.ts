class SamplerBar {
	constructor(//data: Zvoog_Project
		 barIdx: number, drumIdx: number, zoomLevel: number, anchor: TileAnchor, left: number) {
		//let mixm: MixerDataMath = new MixerDataMath(data);
		let drum: Zvoog_PercussionTrack = globalCommandDispatcher.cfg().data.percussions[drumIdx];
		let measure: Zvoog_PercussionMeasure = drum.measures[barIdx];
		//console.log(drum.title,barIdx,measure.skips);
		//let yy = globalCommandDispatcher.cfg().samplerTop() + drumIdx * globalCommandDispatcher.cfg().notePathHeight;
		//let yy = globalCommandDispatcher.cfg().gridTop() + drumIdx * globalCommandDispatcher.cfg().notePathHeight;
		let yy = globalCommandDispatcher.cfg().gridTop() + globalCommandDispatcher.cfg().gridHeight() - 2 * globalCommandDispatcher.cfg().data.percussions.length + drumIdx * globalCommandDispatcher.cfg().notePathHeight * 2;
		let tempo = globalCommandDispatcher.cfg().data.timeline[barIdx].tempo;
		let css = 'samplerDrumDotBg';
		if (globalCommandDispatcher.cfg().data.focus) if (globalCommandDispatcher.cfg().data.focus == 1) css = 'samplerDrumDotFocused';
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

			let ply: TilePolygon = {
				dots: [xx, yy + 0.025
					, xx, yy + 2 - 0.025
					, xx + 1.5, yy + 1
				]
				, css: css
			};
			anchor.content.push(ply);
		}
	}
}
