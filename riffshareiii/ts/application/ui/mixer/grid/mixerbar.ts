class MixerBar {
	octaves: BarOctave[];
	anchor: TileAnchor;
	zoomLevel: number;
	constructor(
		barIdx: number, left: number, ww: number
		, zoomLevel: number
		, toAnchor: TileAnchor
		, data: MZXBX_Project
	) {
		//console.log('MixerBar',zoomLevel,left,ww,data.theme.octaveCount);
		this.zoomLevel = zoomLevel;
		let mixm: MixerDataMath = new MixerDataMath(data);
		this.anchor = toAnchor;
		this.octaves = [];
		let h12 = 12 * data.theme.notePathHeight;
		for (let oo = 0; oo < data.theme.octaveCount; oo++) {
			let barOctaveAnchor: TileAnchor = {
				showZoom: zoomPrefixLevelsCSS[this.zoomLevel].zoom
				, hideZoom: zoomPrefixLevelsCSS[this.zoomLevel + 1].zoom
				, xx: left
				, yy: mixm.gridTop() + oo * h12
				, ww: ww
				, hh: h12, content: []
				, id: 'octave' + (oo + Math.random())
			};
			this.anchor.content.push(barOctaveAnchor);
			let bo: BarOctave = new BarOctave(barIdx, (data.theme.octaveCount - oo - 1), left, mixm.gridTop() + oo * h12, ww, h12, barOctaveAnchor, this.zoomLevel, data);
			this.octaves.push(bo);
		}

	}
}