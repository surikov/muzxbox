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
		let left = barLeft + width;
		let top = mixm.commentsTop();
		let height = mixm.commentsHeight;
		let barTxtRightBorder: TileRectangle = {
			x: left
			, y: top
			, w: zoomPrefixLevelsCSS[zIndex].minZoom * 0.5 //zoomPrefixLevelsCSS[zoomLevel].minZoom / 8.0
			, h: height
			, rx: zoomPrefixLevelsCSS[zIndex].minZoom * 0.25
			, ry: zoomPrefixLevelsCSS[zIndex].minZoom * 0.25
			, css: 'barRightBorder'
		};
		barOctaveAnchor.content.push(barTxtRightBorder);
		//console.log(barIdx,barLeft,width);
		if (barIdx < data.comments.length) {
			for (let ii = 0; ii < data.comments[barIdx].texts.length; ii++) {

				let tt: TileText = {
					x: barLeft + MMUtil().set(data.comments[barIdx].texts[ii].skip).duration(data.timeline[barIdx].tempo) * mixm.widthDurationRatio
					, y: top + zoomPrefixLevelsCSS[zIndex].minZoom
					, text: data.comments[barIdx].texts[ii].text
					, css: 'commentLineText' + zoomPrefixLevelsCSS[zIndex].prefix
				};
				barOctaveAnchor.content.push(tt);
			}
		}
	}

}
