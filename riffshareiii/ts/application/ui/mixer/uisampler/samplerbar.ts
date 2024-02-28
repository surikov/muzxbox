class SamplerBar {
	constructor(data: MZXBX_Project, barIdx: number, drumIdx: number, zoomLevel: number, anchor: TileAnchor, left: number) {
		let mixm: MixerDataMath = new MixerDataMath(data);
		let drum: MZXBX_PercussionTrack = data.percussions[drumIdx];
		let measure: MZXBX_PercussionMeasure = drum.measures[barIdx];
		//console.log(drum.title,barIdx,measure.skips);
		let yy = mixm.samplerTop() + drumIdx * mixm.notePathHeight;
		let tempo = data.timeline[barIdx].tempo;
		for (let ss = 0; ss < measure.skips.length; ss++) {
			let skip: MZXBX_Metre = measure.skips[ss];
			let xx = left + MZMM().set(skip).duration(tempo) * mixm.widthDurationRatio
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
		}
	}
}
