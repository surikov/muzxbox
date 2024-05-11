class SamplerBar {
	constructor(//data: Zvoog_Project
	cfg:MixerDataMathUtility
		, barIdx: number, drumIdx: number, zoomLevel: number, anchor: TileAnchor, left: number) {
		//let mixm: MixerDataMath = new MixerDataMath(data);
		let drum: Zvoog_PercussionTrack = cfg.data.percussions[drumIdx];
		let measure: Zvoog_PercussionMeasure = drum.measures[barIdx];
		//console.log(drum.title,barIdx,measure.skips);
		let yy = cfg.samplerTop() + drumIdx * cfg.notePathHeight;
		let tempo = cfg.data.timeline[barIdx].tempo;
		for (let ss = 0; ss < measure.skips.length; ss++) {
			let skip: Zvoog_Metre = measure.skips[ss];
			let xx = left + MMUtil().set(skip).duration(tempo) * cfg.widthDurationRatio
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
					, xx, yy + 0.975
					, xx + 0.75, yy + 0.5
				]
				, css: 'samplerDrumDot'
			};
			anchor.content.push(ply);
		}
	}
}
