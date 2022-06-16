class FocusZoomFar implements FocusLevel {
	idxMeasureStart: number = 6;
	idxRow: number = -1;
	isMatch(zoomLevel: number, zRender: ZRender): boolean {
		if (zoomLevel >= zRender.zoomSong && zoomLevel < zRender.zoomFar) {
			return true;
		} else {
			return false;
		}
	}
	addSpot(mngmnt: FocusManagement) {
		if (this.idxMeasureStart >= mngmnt.muzXBox.currentSchedule.measures.length) {
			this.idxMeasureStart = mngmnt.muzXBox.currentSchedule.measures.length - 1;
		}
		var rhythmPattern: ZvoogMeter[] = mngmnt.muzXBox.currentSchedule.rhythm ? mngmnt.muzXBox.currentSchedule.rhythm : default8rhytym;
		let measuresAndStep = measuresAndStepDuration(mngmnt.muzXBox.currentSchedule, this.idxMeasureStart, 0, rhythmPattern);
		let xx = leftGridMargin + mngmnt.muzXBox.zrenderer.secondWidthInTaps * measuresAndStep.start;
		let ww = mngmnt.muzXBox.zrenderer.secondWidthInTaps
			* meter2seconds(
				mngmnt.muzXBox.currentSchedule.measures[this.idxMeasureStart].tempo
				, mngmnt.muzXBox.currentSchedule.measures[this.idxMeasureStart].meter);
		let hh = 12 * octaveCount * mngmnt.muzXBox.zrenderer.pitchLineThicknessInTaps;
		let yy = topGridMarginTp(mngmnt.muzXBox.currentSchedule,mngmnt.muzXBox.zrenderer.pitchLineThicknessInTaps);
		if(this.idxRow<0){
			hh=bottomGridMargin;
			//yy=topGridMargin+12 * octaveCount * mngmnt.muzXBox.zrenderer.pitchLineThicknessInTaps;
			yy = topGridMarginTp(mngmnt.muzXBox.currentSchedule,mngmnt.muzXBox.zrenderer.pitchLineThicknessInTaps)+12 * octaveCount * mngmnt.muzXBox.zrenderer.pitchLineThicknessInTaps;
		}
		mngmnt.focusAnchor.content.push({
			x: xx
			, y: yy
			, w: ww
			, h: hh
			, rx: 0
			, ry: 0
			, css: 'actionPointFar'
		});
	}
	spotUp(mngmnt: FocusManagement): boolean {
		if (this.idxRow < 0) {
			this.idxRow = 0;
			return true;
		} else {
			return false;
		}

	}
	spotDown(mngmnt: FocusManagement): boolean {
		if (this.idxRow > -1) {
			this.idxRow = -1;
			return true;
		} else {
			return false;
		}
	}
	spotLeft(mngmnt: FocusManagement): boolean {
		if (this.idxMeasureStart > 0) {
			this.idxMeasureStart--;
			return true;
		} else {
			return false;
		}
	}
	spotRight(mngmnt: FocusManagement): boolean {
		if (this.idxMeasureStart < mngmnt.muzXBox.currentSchedule.measures.length - 1) {
			this.idxMeasureStart++;
			return true;
		} else {
			return false;
		}
	}
	moveSpotIntoView(mngmnt: FocusManagement): void {
		var rhythmPattern: ZvoogMeter[] = mngmnt.muzXBox.currentSchedule.rhythm ? mngmnt.muzXBox.currentSchedule.rhythm : default8rhytym;
		let measuresAndStep = measuresAndStepDuration(mngmnt.muzXBox.currentSchedule, this.idxMeasureStart, 0, rhythmPattern);
		let tp = mngmnt.muzXBox.zrenderer.tileLevel.tapSize;
		let ww = mngmnt.muzXBox.zrenderer.secondWidthInTaps * measuresAndStep.duration;
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
			this.idxMeasureStart = measureStep.measure;
		} else {
			this.idxMeasureStart = 0;
		}
	}
	moveViewToShowSpot(mngmnt: FocusManagement): void {
		var rhythmPattern: ZvoogMeter[] = mngmnt.muzXBox.currentSchedule.rhythm ? mngmnt.muzXBox.currentSchedule.rhythm : default8rhytym;
		let measuresAndStep = measuresAndStepDuration(mngmnt.muzXBox.currentSchedule, this.idxMeasureStart, 0, rhythmPattern);
		let xx = leftGridMargin + mngmnt.muzXBox.zrenderer.secondWidthInTaps * measuresAndStep.start;
		//let yy = topGridMargin;
		let ww = mngmnt.muzXBox.zrenderer.secondWidthInTaps
			* meter2seconds(
				mngmnt.muzXBox.currentSchedule.measures[this.idxMeasureStart].tempo
				, mngmnt.muzXBox.currentSchedule.measures[this.idxMeasureStart].meter);
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
