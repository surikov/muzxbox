class TextComments {
	constructor(barIdx: number
		, data: Zvoog_Project
		, barLeft: number
		, barOctaveAnchor: TileAnchor
		, zIndex: number
	) {
		let curBar = data.timeline[barIdx];

		let mixm: MixerDataMath = new MixerDataMath(data);
		let width = MMUtil().set(curBar.metre).duration(curBar.tempo) * mixm.widthDurationRatio;
		let top = mixm.gridTop();
		let height = mixm.gridHeight();
		let barRightBorder: TileRectangle = {
			x: barLeft + width
			, y: top
			, w: zoomPrefixLevelsCSS[zIndex].minZoom * 0.5 //zoomPrefixLevelsCSS[zoomLevel].minZoom / 8.0
			, h: height
			, rx: zoomPrefixLevelsCSS[zIndex].minZoom * 0.25
			, ry: zoomPrefixLevelsCSS[zIndex].minZoom * 0.25
			, css: 'barRightBorder'
		};
		barOctaveAnchor.content.push(barRightBorder);
	}

}
