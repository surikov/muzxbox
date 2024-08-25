class BarOctave {

	constructor(barIdx: number, octaveIdx: number, left: number, top: number, width: number, height: number
		, barOctaveGridAnchor: TileAnchor
		, barOctaveTrackAnchor: TileAnchor
		, barOctaveFirstAnchor: TileAnchor
		, zoomLevel: number
		//, data: Zvoog_Project
		//,cfg:MixerDataMathUtility
	) {
		new OctaveContent(barIdx, octaveIdx, left, top, width, height, barOctaveTrackAnchor, barOctaveFirstAnchor, zoomLevel);
		//if (zoomLevel < 6) {
		//	this.addLines(barOctaveGridAnchor, zoomLevel, left, top, width, height, data, barIdx, octaveIdx);
		//}
	}
	
	


}