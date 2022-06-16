class FocusZoomBig implements FocusLevel {
	measureGroupIndx: number = 2;
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
		while (groupIdx < this.measureGroupIndx) {
			for (let i = 0; i < bigGroupMeasure && groupIdx * bigGroupMeasure + i < mngmnt.muzXBox.currentSchedule.measures.length - 1; i++) {
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
		let yy = topGridMarginTp(mngmnt.muzXBox.currentSchedule,mngmnt.muzXBox.zrenderer.pitchLineThicknessInTaps);
		//console.log(kk, xx, ww);
		mngmnt.focusAnchor.content.push({
			x: xx
			, y: yy
			, w: ww
			, h: hh
			, rx: 0
			, ry: 0
			, css: 'actionPointBig'
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
		if (this.measureGroupIndx > 0) {
			this.measureGroupIndx--;
			return true;
		} else {
			return false;
		}
	}
	spotRight(mngmnt: FocusManagement): boolean {
		if (this.measureGroupIndx * bigGroupMeasure + bigGroupMeasure < mngmnt.muzXBox.currentSchedule.measures.length) {
			this.measureGroupIndx++;
			return true;
		} else {
			return false;
		}
	}
	moveSpotIntoView(mngmnt: FocusManagement): void {
		var rhythmPattern: ZvoogMeter[] = mngmnt.muzXBox.currentSchedule.rhythm ? mngmnt.muzXBox.currentSchedule.rhythm : default8rhytym;
		let firstMeasureIdx = this.measureGroupIndx * bigGroupMeasure;
		let measuresAndStep = measuresAndStepDuration(mngmnt.muzXBox.currentSchedule, firstMeasureIdx, 0, rhythmPattern);
		let tp = mngmnt.muzXBox.zrenderer.tileLevel.tapSize;
		//let ww = mngmnt.muzXBox.zrenderer.secondWidthInTaps * measuresAndStep.duration;
		let ww = 0;
		for (let i = 0; i < bigGroupMeasure && i + firstMeasureIdx < mngmnt.muzXBox.currentSchedule.measures.length; i++) {
			ww = ww + mngmnt.muzXBox.zrenderer.secondWidthInTaps
				* meter2seconds(
					mngmnt.muzXBox.currentSchedule.measures[firstMeasureIdx + i].tempo
					, mngmnt.muzXBox.currentSchedule.measures[firstMeasureIdx + i].meter);
		}
		let hh = mngmnt.muzXBox.zrenderer.pitchLineThicknessInTaps;

		let tz = mngmnt.muzXBox.zrenderer.tileLevel.translateZ;
		let tx = mngmnt.muzXBox.zrenderer.tileLevel.translateX / tz;
		let ty = mngmnt.muzXBox.zrenderer.tileLevel.translateY / tz;

		let vw = mngmnt.muzXBox.zrenderer.tileLevel.viewWidth;
		let vh = mngmnt.muzXBox.zrenderer.tileLevel.viewHeight;

		let ih = mngmnt.muzXBox.zrenderer.tileLevel.innerHeight / tz;
		let iw = mngmnt.muzXBox.zrenderer.tileLevel.innerWidth / tz;

		
		let newX = iw / 2;
		if (vw < iw) {
			newX = vw / 2 - tx;
		}
		let stepX = -tp * leftGridMargin / tz + newX;
		let findX = tz * stepX / tp;
		let measureStep = findMeasureStep(mngmnt.muzXBox.currentSchedule.measures, rhythmPattern, mngmnt.muzXBox.zrenderer.secondWidthInTaps, findX);
		if (measureStep) {
			this.measureGroupIndx = Math.round(measureStep.measure/bigGroupMeasure);
		} else {
			this.measureGroupIndx = 0;
		}
	}
	moveViewToShowSpot(mngmnt: FocusManagement): void {
		//console.log('right border');

		var rhythmPattern: ZvoogMeter[] = mngmnt.muzXBox.currentSchedule.rhythm ? mngmnt.muzXBox.currentSchedule.rhythm : default8rhytym;
		let firstMeasureIdx = this.measureGroupIndx * bigGroupMeasure;
		let measuresAndStep = measuresAndStepDuration(mngmnt.muzXBox.currentSchedule, firstMeasureIdx, 0, rhythmPattern);
		let xx = leftGridMargin + mngmnt.muzXBox.zrenderer.secondWidthInTaps * measuresAndStep.start;
		//let yy = topGridMargin;
		let ww = 0;
		for (let i = 0; i < bigGroupMeasure && i + firstMeasureIdx < mngmnt.muzXBox.currentSchedule.measures.length; i++) {
			ww = ww + mngmnt.muzXBox.zrenderer.secondWidthInTaps
				* meter2seconds(
					mngmnt.muzXBox.currentSchedule.measures[firstMeasureIdx + i].tempo
					, mngmnt.muzXBox.currentSchedule.measures[firstMeasureIdx + i].meter);
		}
		/*
		let ww = mngmnt.muzXBox.zrenderer.secondWidthInTaps
			* meter2seconds(
				mngmnt.muzXBox.currentSchedule.measures[this.measureGroupIndx].tempo
				, mngmnt.muzXBox.currentSchedule.measures[this.measureGroupIndx].meter);
				*/
		let hh = 12 * mngmnt.muzXBox.zrenderer.pitchLineThicknessInTaps;
		let tx = mngmnt.muzXBox.zrenderer.tileLevel.translateX / mngmnt.muzXBox.zrenderer.tileLevel.tapSize;
		let ty = mngmnt.muzXBox.zrenderer.tileLevel.translateY / mngmnt.muzXBox.zrenderer.tileLevel.tapSize;
		let tz = mngmnt.muzXBox.zrenderer.tileLevel.translateZ / mngmnt.muzXBox.zrenderer.tileLevel.tapSize
		let vw = mngmnt.muzXBox.zrenderer.tileLevel.viewWidth * tz;
		let vh = mngmnt.muzXBox.zrenderer.tileLevel.viewHeight * tz;
		if (xx + ww > vw - tx) {//right
			mngmnt.muzXBox.zrenderer.tileLevel.translateX = (vw - xx - ww) * mngmnt.muzXBox.zrenderer.tileLevel.tapSize;
			//console.log('right border');
		}
		if (xx < -tx) {//left
			mngmnt.muzXBox.zrenderer.tileLevel.translateX = -xx * mngmnt.muzXBox.zrenderer.tileLevel.tapSize;
		}
		/*if (yy + hh > vh - ty) {//down
			mngmnt.muzXBox.zrenderer.tileLevel.translateY = (vh - yy - hh) * mngmnt.muzXBox.zrenderer.tileLevel.tapSize;
		}
		if (yy < -ty) {//up
			mngmnt.muzXBox.zrenderer.tileLevel.translateY = -yy * mngmnt.muzXBox.zrenderer.tileLevel.tapSize;
		}*/
		//console.log('moveViewToShowSpot',mngmnt.muzXBox.zrenderer.tileLevel.translateX);
		mngmnt.muzXBox.zrenderer.tileLevel.applyZoomPosition();
		//console.log(ww,hh,tx,ty,tz,this.indexMeasure,mngmnt.muzXBox.zrenderer.tileLevel.translateX,mngmnt.muzXBox.zrenderer.tileLevel.translateX);
	}
}
