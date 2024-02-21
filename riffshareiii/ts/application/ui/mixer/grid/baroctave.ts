class BarOctave {

	constructor(barIdx: number, octaveIdx: number, left: number, top: number, width: number, height: number
		, barOctaveGridAnchor: TileAnchor
		, barOctaveTrackAnchor: TileAnchor
		, barOctaveFirstAnchor: TileAnchor
		, zoomLevel: number
		, data: MZXBX_Project
	) {
		new OctaveContent(barIdx, octaveIdx, left, top, width, height, data, barOctaveTrackAnchor, barOctaveFirstAnchor, zoomLevel);
		if (zoomLevel < 6) {
			this.addLines(barOctaveGridAnchor, zoomLevel, left, top, width, height, data, barIdx, octaveIdx);
		}
	}
	addLines(barOctaveAnchor: TileAnchor, zoomLevel: number, left: number, top: number, width: number, height: number
		, data: MZXBX_Project, barIdx: number, octaveIdx: number
	) {
		//this.addOctaveGridSteps(barIdx, data, left, top, height, barOctaveAnchor, zoomLevel);
		let mixm: MixerDataMath = new MixerDataMath(data);
		/*
		let barRightBorder: TileRectangle = {
			x: left + width
			, y: top
			, w: zoomPrefixLevelsCSS[zoomLevel].minZoom * 0.25 //zoomPrefixLevelsCSS[zoomLevel].minZoom / 8.0
			, h: height
			, css: 'barRightBorder'
		};
		barOctaveAnchor.content.push(barRightBorder);
		*/
		if (zoomLevel < 4) {
			if (octaveIdx > 0) {
				let octaveBottomBorder: TileRectangle = {
					x: left
					, y: top + height
					, w: width
					, h: zoomPrefixLevelsCSS[zoomLevel].minZoom / 8.0
					, css: 'octaveBottomBorder'
				};
				barOctaveAnchor.content.push(octaveBottomBorder);
			}
		}
		if (zoomLevel < 3) {
			for (let kk = 1; kk < 12; kk++) {
				barOctaveAnchor.content.push({
					x: left
					, y: top + height - kk * mixm.notePathHeight
					, w: width
					, h: zoomPrefixLevelsCSS[zoomLevel].minZoom / 32.0
					, css: 'octaveBottomBorder'
				});
			}
		}
	}
	


}