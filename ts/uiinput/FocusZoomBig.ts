class FocusZoomBig implements FocusLevel {
	currentGroup: number = 10;
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
		let kk=0;
		while (groupIdx < this.currentGroup) {
			for (let i = 0; i < bigGroupMeasure; i++) {
				kk = groupIdx * bigGroupMeasure + i;
				if (kk < mngmnt.muzXBox.currentSchedule.measures.length) {
					xx = xx + mngmnt.muzXBox.zrenderer.ratioDuration * meter2seconds(
						mngmnt.muzXBox.currentSchedule.measures[kk].tempo
						, mngmnt.muzXBox.currentSchedule.measures[kk].meter);
				}
			}
			groupIdx++;
		}
		let ww = 0;
		for (let i = 0; i < bigGroupMeasure; i++) {
			if (kk+i < mngmnt.muzXBox.currentSchedule.measures.length) {
				ww = ww + mngmnt.muzXBox.zrenderer.ratioDuration * meter2seconds(
					mngmnt.muzXBox.currentSchedule.measures[kk+i].tempo
					, mngmnt.muzXBox.currentSchedule.measures[kk+i].meter);
			}
		}
		/*for (let i = 0; i < mngmnt.muzXBox.currentSchedule.measures.length; i++) {
			if (i < this.currentGroup * bigGroupMeasure) {

				xx = xx + mngmnt.muzXBox.zrenderer.ratioDuration * meter2seconds(
					mngmnt.muzXBox.currentSchedule.measures[this.currentMeasure].tempo
					, mngmnt.muzXBox.currentSchedule.measures[this.currentMeasure].meter
				);
			}
		}*/
		//var rhythmPattern: ZvoogMeter[] = mngmnt.muzXBox.currentSchedule.rhythm ? mngmnt.muzXBox.currentSchedule.rhythm : default8rhytym;
		//let measuresAndStep = measuresAndStepDuration(mngmnt.muzXBox.currentSchedule, this.currentMeasure, 0, rhythmPattern);
		//let xx = leftGridMargin + mngmnt.muzXBox.zrenderer.ratioDuration * measuresAndStep.start;
		//let ww = mngmnt.muzXBox.zrenderer.ratioDuration *meter2seconds(mngmnt.muzXBox.currentSchedule.measures[0].tempo, mngmnt.muzXBox.currentSchedule.measures[0].meter);
		let hh = 12 * octaveCount * mngmnt.muzXBox.zrenderer.ratioThickness;
		let yy = topGridMargin;
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
}
