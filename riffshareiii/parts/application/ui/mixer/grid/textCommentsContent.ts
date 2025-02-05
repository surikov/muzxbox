class TextCommentsBar {
	//zoomLevelIndex = 0;
	//barIndex = 0;
	constructor(barIdx: number
		, barLeft: number
		, barOctaveAnchor: TileAnchor
		, zIndex: number
	) {
		//this.zoomLevelIndex = zIndex;
		//this.barIndex = barIdx;
		//console.log('TextCommentsBar',this.zoomLevelIndex,this.barIndex);

		let curBar = globalCommandDispatcher.cfg().data.timeline[barIdx];
		let top = globalCommandDispatcher.cfg().commentsTop();
		if (barIdx < globalCommandDispatcher.cfg().data.comments.length) {
			let pad = 0.125 * globalCommandDispatcher.cfg().notePathHeight * globalCommandDispatcher.cfg().textZoomRatio(zIndex);
			let css = 'commentReadText' + zoomPrefixLevelsCSS[zIndex].prefix;
			css = 'commentLineText' + zoomPrefixLevelsCSS[zIndex].prefix;
			this.testBars();
			for (let ii = 0; ii < globalCommandDispatcher.cfg().data.comments[barIdx].points.length; ii++) {
				let itxt = globalCommandDispatcher.cfg().data.comments[barIdx].points[ii];
				let xx = barLeft + MMUtil().set(itxt.skip).duration(curBar.tempo) * globalCommandDispatcher.cfg().widthDurationRatio + pad;
				let yy = top + globalCommandDispatcher.cfg().notePathHeight * (1 + itxt.row) * globalCommandDispatcher.cfg().textZoomRatio(zIndex) - pad;
				let tt: TileText = {
					x: xx
					, y: yy
					, text: globalCommandDispatcher.cfg().data.comments[barIdx].points[ii].text
					, css: css
				};
				barOctaveAnchor.content.push(tt);
			}
		}
		if (zIndex < globalCommandDispatcher.cfg().zoomEditSLess) {
			let interpane: TileRectangle = {
				x: barOctaveAnchor.xx
				, y: globalCommandDispatcher.cfg().commentsTop()
				, w: barOctaveAnchor.ww
				, h: globalCommandDispatcher.cfg().commentsMaxHeight()
				, css: 'commentPaneForClick'
				, activation: (x: number, y: number) => { this.cellClick(x, y, zIndex, barIdx); }
			};
			barOctaveAnchor.content.push(interpane);
		}
	}
	testBars() {
		for (let idx = 0; idx < globalCommandDispatcher.cfg().data.timeline.length; idx++) {
			if (globalCommandDispatcher.cfg().data.comments[idx]) {
				//
			} else {
				globalCommandDispatcher.cfg().data.comments[idx] = {
					points: []
				};
			}
		}
	}
	cellClick(x: number, y: number, zz: number, idx: number) {
		let row = 0;
		for (let tt = 0; tt <= globalCommandDispatcher.cfg().maxCommentRowCount; tt++) {
			let nextY = globalCommandDispatcher.cfg().commentsZoomLineY(zz, tt);
			if (nextY > y) {
				break;
			}
			row++;
		}
		let info = globalCommandDispatcher.cfg().gridClickInfo(idx, x, zz);
		this.testBars();
		let commentBar = globalCommandDispatcher.cfg().data.comments[idx];
		let first = this.getFirstCommentText(commentBar, row, info);
		let re = prompt(first, first);
		if (re === first) {
			//
		} else {
			if (re !== null) {
				let newText = re;
				globalCommandDispatcher.exe.commitProjectChanges(['comments', idx], () => {
					this.dropBarComments(commentBar, row, info);
					commentBar.points.push({
						skip: info.start
						, text: newText
						, row: row
					});
				});

				//globalCommandDispatcher.resetProject();
			}
		}
	}
	getFirstCommentText(commentBar: Zvoog_CommentMeasure, row: number, info: { start: Zvoog_MetreMathType, length: Zvoog_MetreMathType, end: Zvoog_MetreMathType }): string {
		for (let ii = 0; ii < commentBar.points.length; ii++) {
			let pp = commentBar.points[ii];
			if (pp.row == row) {
				if (!info.start.more(pp.skip)) {
					if (info.end.more(pp.skip)) {
						return pp.text;
					}
				}
			}
		}
		return '';
	}
	dropBarComments(commentBar: Zvoog_CommentMeasure, row: number, info: { start: Zvoog_MetreMathType, length: Zvoog_MetreMathType, end: Zvoog_MetreMathType }) {
		commentBar.points = commentBar.points.filter((pp: Zvoog_CommentText) => {
			if (pp.row == row) {
				if (!info.start.more(pp.skip)) {
					if (info.end.more(pp.skip)) {
						return false;
					}
				}
			}
			return true;
		});
	}

}
