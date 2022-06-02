class FocusZoomBig implements FocusLevel {
	currentGroupIndx: number = 10;
	isMatch(zoomLevel: number, zRender: ZRender): boolean {
		if (zoomLevel >= zRender.zoomFar) {
			return true;
		} else {
			return false;
		}
	}
	addSpot(mngmnt: FocusManagement) {
		let xx = 0;
		//
		let groupIdx = 0;
		let kk = 0;
		while (groupIdx < this.currentGroupIndx) {
			for (let i = 0; i < bigGroupMeasure && groupIdx * bigGroupMeasure + i < mngmnt.muzXBox.currentSchedule.measures.length-1; i++) {
				kk = groupIdx * bigGroupMeasure + i;
				if (kk < mngmnt.muzXBox.currentSchedule.measures.length) {
					xx = xx + mngmnt.muzXBox.zrenderer.secondWidthInTaps * meter2seconds(
						mngmnt.muzXBox.currentSchedule.measures[kk].tempo
						, mngmnt.muzXBox.currentSchedule.measures[kk].meter);
				}
			}
			groupIdx++;
		}
		let ww = 0;
		for (let i = 0; i < bigGroupMeasure; i++) {
			if (kk + i < mngmnt.muzXBox.currentSchedule.measures.length) {
				ww = ww + mngmnt.muzXBox.zrenderer.secondWidthInTaps * meter2seconds(
					mngmnt.muzXBox.currentSchedule.measures[kk + i].tempo
					, mngmnt.muzXBox.currentSchedule.measures[kk + i].meter);
			}
		}
		let hh = 12 * octaveCount * mngmnt.muzXBox.zrenderer.pitchLineThicknessInTaps;
		let yy = topGridMargin;
		//console.log(kk, xx, ww);
		mngmnt.focusAnchor.content.push({
			x: xx
			, y: yy
			, w: ww
			, h: hh
			, rx: 0
			, ry: 0
			, css: 'actionPoint'
		});
	}
	spotUp(mngmnt: FocusManagement): boolean {
		console.log('FocusZoomBig spotUp');
		return false;
	}
	spotDown(mngmnt: FocusManagement): boolean {
		console.log('FocusZoomBig spotDown');
		return false;
	}
	spotLeft(mngmnt: FocusManagement): boolean {
		console.log('FocusZoomBig spotLeft');
		return false;
	}
	spotRight(mngmnt: FocusManagement): boolean {
		console.log('FocusZoomBig spotRight');
		return false;
	}
	moveSpotIntoView(mngmnt: FocusManagement): void {

	}
	moveViewToShowSpot(mngmnt: FocusManagement): void {

	}
}
