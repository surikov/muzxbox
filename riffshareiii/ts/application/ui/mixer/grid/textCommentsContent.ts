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
		let height = mixm.commentsMaxHeight();
		let barTxtRightBorder: TileRectangle = {
			x: left
			, y: top
			, w: zoomPrefixLevelsCSS[zIndex].minZoom * 0.5 //zoomPrefixLevelsCSS[zoomLevel].minZoom / 8.0
			, h: height
			, rx: zoomPrefixLevelsCSS[zIndex].minZoom * 0.25
			, ry: zoomPrefixLevelsCSS[zIndex].minZoom * 0.25
			, css: 'barRightBorder'
		};
		//console.log('comments', barIdx, zIndex, top, height, zoomPrefixLevelsCSS[zIndex].minZoom);
		barOctaveAnchor.content.push(barTxtRightBorder);
		//console.log(barIdx,barLeft,width);
		if (barIdx < data.comments.length) {
			let placedX: number[] = [];
			for (let ii = 0; ii < data.comments[barIdx].texts.length; ii++) {
				let itxt = data.comments[barIdx].texts[ii];
				let skipS = 0.5 * Math.floor(MMUtil().set(itxt.skip).duration(curBar.tempo) / 0.5);
				let xx = barLeft + MMUtil().set(itxt.skip).duration(curBar.tempo) * mixm.widthDurationRatio;
				let placeIdx = 1;
				//let x10 = Math.round(xx * 10);
				for (let kk = 0; kk < placedX.length; kk++) {
					//if (Math.abs(skipS - placedX[kk]) < 0.3) {
					if (skipS == placedX[kk]) {
						placeIdx++;
					}
				}
				placedX.push(skipS);
				let tt: TileText = {
					x: xx
					, y: top + zoomPrefixLevelsCSS[zIndex].minZoom * placeIdx
					, text: data.comments[barIdx].texts[ii].text
					, css: 'commentLineText' + zoomPrefixLevelsCSS[zIndex].prefix
				};
				//console.log(zoomPrefixLevelsCSS[zIndex].minZoom * placeIdx, placeIdx, data.comments[barIdx].texts[ii].text);
				barOctaveAnchor.content.push(tt);
			}
		}
	}

}
