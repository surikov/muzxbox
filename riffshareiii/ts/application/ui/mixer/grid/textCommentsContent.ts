class TextComments {
	constructor(barIdx: number
		//, data: Zvoog_Project
		//, cfg: MixerDataMathUtility
		, barLeft: number
		, barOctaveAnchor: TileAnchor
		, zIndex: number
	) {
		let curBar = globalCommandDispatcher.cfg().data.timeline[barIdx];

		//let mixm: MixerDataMath = new MixerDataMath(data);
		//let width = MMUtil().set(curBar.metre).duration(curBar.tempo) * globalCommandDispatcher.cfg().widthDurationRatio;
		//let left = barLeft + width;
		let top = globalCommandDispatcher.cfg().gridTop();
		//let height = globalCommandDispatcher.cfg().maxCommentRowCount + 2;
		//console.log(zIndex);
		/*
		if (zIndex == 3) {
			height = (globalCommandDispatcher.cfg().maxCommentRowCount + 2) * 2;
		}
		if (zIndex == 4) {
			height = (globalCommandDispatcher.cfg().maxCommentRowCount + 2) * 4;
		}
		if (zIndex > 4) {
			height = (globalCommandDispatcher.cfg().maxCommentRowCount + 2) * 8;
		}
		let barTxtRightBorder: TileRectangle = {
			x: left
			, y: top
			, w: zoomPrefixLevelsCSS[zIndex].minZoom * 0.5 //zoomPrefixLevelsCSS[zoomLevel].minZoom / 8.0
			, h: height
			, rx: zoomPrefixLevelsCSS[zIndex].minZoom * 0.25
			, ry: zoomPrefixLevelsCSS[zIndex].minZoom * 0.25
			, css: 'barRightBorder'
		};*/
		//console.log('comments', barIdx, zIndex, top, height, zoomPrefixLevelsCSS[zIndex].minZoom);
		//barOctaveAnchor.content.push(barTxtRightBorder);
		//console.log(barIdx,barLeft,width);
		if (barIdx < globalCommandDispatcher.cfg().data.comments.length) {
			/*let placedX: number[] = [];
			for (let ii = 0; ii < globalCommandDispatcher.cfg().data.comments[barIdx].texts.length; ii++) {
				let itxt = globalCommandDispatcher.cfg().data.comments[barIdx].texts[ii];
				let skipS = 0.5 * Math.floor(MMUtil().set(itxt.skip).duration(curBar.tempo) / 0.5);
				let xx = barLeft + MMUtil().set(itxt.skip).duration(curBar.tempo) * globalCommandDispatcher.cfg().widthDurationRatio;
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
					, text: globalCommandDispatcher.cfg().data.comments[barIdx].texts[ii].text
					, css: 'commentLineText' + zoomPrefixLevelsCSS[zIndex].prefix
				};
				//console.log(zoomPrefixLevelsCSS[zIndex].minZoom * placeIdx, placeIdx, globalCommandDispatcher.cfg().data.comments[barIdx].texts[ii].text);
				barOctaveAnchor.content.push(tt);
			}*/
			let txtZoomRatio = 1;
			if (zIndex > 2) txtZoomRatio = 2;
			if (zIndex > 3) txtZoomRatio = 4;
			if (zIndex > 4) txtZoomRatio = 8;
			let css= 'commentReadText' + zoomPrefixLevelsCSS[zIndex].prefix;
			//if(globalCommandDispatcher.cfg().data.focus){
			//	if(globalCommandDispatcher.cfg().data.focus==3){
					css= 'commentLineText' + zoomPrefixLevelsCSS[zIndex].prefix;
			//	}
			//}
			for (let ii = 0; ii < globalCommandDispatcher.cfg().data.comments[barIdx].points.length; ii++) {
				let itxt = globalCommandDispatcher.cfg().data.comments[barIdx].points[ii];
				let xx = barLeft + MMUtil().set(itxt.skip).duration(curBar.tempo) * globalCommandDispatcher.cfg().widthDurationRatio;
				let tt: TileText = {
					x: xx
					, y: top + globalCommandDispatcher.cfg().notePathHeight * (1 + itxt.row) * txtZoomRatio
					, text: globalCommandDispatcher.cfg().data.comments[barIdx].points[ii].text
					, css: css //'commentLineText' + zoomPrefixLevelsCSS[zIndex].prefix
				};
				//console.log(zoomPrefixLevelsCSS[zIndex].minZoom * placeIdx, placeIdx, globalCommandDispatcher.cfg().data.comments[barIdx].texts[ii].text);
				barOctaveAnchor.content.push(tt);
			}
		}
	}

}
