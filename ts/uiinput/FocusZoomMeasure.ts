class FocusZoomMeasure implements FocusLevel {
	pitchLineIdx: number = 33;
	idxMeasure: number = 2;
	idxStep: number = 1;
	isMatch(zoomLevel: number, zRender: ZRender): boolean {
		if (zoomLevel >= zRender.zoomNote && zoomLevel < zRender.zoomMeasure) {
			return true;
		} else {
			return false;
		}
	}
	addSpot(mngmnt: FocusManagement) {
		var rhythmPattern: ZvoogMeter[] = mngmnt.muzXBox.currentSchedule.rhythm ? mngmnt.muzXBox.currentSchedule.rhythm : default8rhytym;
		let measuresAndStep = measuresAndStepDuration(mngmnt.muzXBox.currentSchedule, this.idxMeasure, this.idxStep, rhythmPattern);
		let xx = leftGridMargin + mngmnt.muzXBox.zrenderer.secondWidthInTaps * measuresAndStep.start;
		let ww = mngmnt.muzXBox.zrenderer.secondWidthInTaps * measuresAndStep.duration;
		let hh = mngmnt.muzXBox.zrenderer.pitchLineThicknessInTaps;
		let yy = topGridMargin
			+ gridHeightTp(mngmnt.muzXBox.zrenderer.pitchLineThicknessInTaps)
			- (this.pitchLineIdx + 1) * mngmnt.muzXBox.zrenderer.pitchLineThicknessInTaps
			;
		mngmnt.focusAnchor.content.push({ x: xx, y: yy, w: ww, h: hh, rx: 0, ry: 0, css: 'actionPoint' });
	}
	spotUp(mngmnt: FocusManagement): boolean {
		if (this.pitchLineIdx < octaveCount * 12 - 1) {
			this.pitchLineIdx++;

			//this.moveViewToShowSpot(mngmnt);

			//mngmnt.reSetFocus(mngmnt.muzXBox.zrenderer, gridWidthTp(mngmnt.muzXBox.currentSchedule, mngmnt.muzXBox.zrenderer.ratioDuration));
			return true;
		} else {
			return false;
		}
	}
	spotDown(mngmnt: FocusManagement): boolean {
		if (this.pitchLineIdx > 0) {
			this.pitchLineIdx--;

			//this.moveViewToShowSpot(mngmnt);

			//mngmnt.reSetFocus(mngmnt.muzXBox.zrenderer, gridWidthTp(mngmnt.muzXBox.currentSchedule, mngmnt.muzXBox.zrenderer.ratioDuration));
			return true;
		} else {
			return false;
		}
	}
	spotLeft(mngmnt: FocusManagement): boolean {

		if (this.idxStep > 0) {
			this.idxStep--;
			//this.moveViewToShowSpot(mngmnt);
			//mngmnt.reSetFocus(mngmnt.muzXBox.zrenderer, gridWidthTp(mngmnt.muzXBox.currentSchedule, mngmnt.muzXBox.zrenderer.ratioDuration));
			//console.log('done', this.idxMeasure, this.idxStep, this.pitchLineIdx);
			return true;
		} else {
			if (this.idxMeasure > 0) {
				//console.log('spotLeft', this.idxMeasure, this.idxStep, this.pitchLineIdx);
				var rhythmPattern: ZvoogMeter[] = mngmnt.muzXBox.currentSchedule.rhythm ? mngmnt.muzXBox.currentSchedule.rhythm : default8rhytym;
				this.idxMeasure--;
				let count = countMeasureSteps(mngmnt.muzXBox.currentSchedule.measures[this.idxMeasure].meter, rhythmPattern);
				this.idxStep = count - 1;
				//console.log('now', this.idxMeasure, this.idxStep, this.pitchLineIdx);
				return true;
			} else {
				return false;
			}
		}
	}
	spotRight(mngmnt: FocusManagement): boolean {
		var rhythmPattern: ZvoogMeter[] = mngmnt.muzXBox.currentSchedule.rhythm ? mngmnt.muzXBox.currentSchedule.rhythm : default8rhytym;
		let count = countMeasureSteps(mngmnt.muzXBox.currentSchedule.measures[this.idxMeasure].meter, rhythmPattern);
		if (this.idxStep < count - 1) {
			this.idxStep++;
			//this.moveViewToShowSpot(mngmnt);
			//mngmnt.reSetFocus(mngmnt.muzXBox.zrenderer, gridWidthTp(mngmnt.muzXBox.currentSchedule, mngmnt.muzXBox.zrenderer.ratioDuration));
			return true;
		} else {
			if (this.idxMeasure < mngmnt.muzXBox.currentSchedule.measures.length - 1) {
				this.idxMeasure++;
				this.idxStep = 0;
				//this.moveViewToShowSpot(mngmnt);
				//mngmnt.reSetFocus(mngmnt.muzXBox.zrenderer, gridWidthTp(mngmnt.muzXBox.currentSchedule, mngmnt.muzXBox.zrenderer.ratioDuration));
				return true;
			} else {
				return false;
			}
		}
	}
	moveViewToShowSpot(mngmnt: FocusManagement) {
		var rhythmPattern: ZvoogMeter[] = mngmnt.muzXBox.currentSchedule.rhythm ? mngmnt.muzXBox.currentSchedule.rhythm : default8rhytym;
		let measuresAndStep = measuresAndStepDuration(mngmnt.muzXBox.currentSchedule, this.idxMeasure, this.idxStep, rhythmPattern);
		let xx = leftGridMargin + mngmnt.muzXBox.zrenderer.secondWidthInTaps * measuresAndStep.start;
		let yy = topGridMargin
			+ gridHeightTp(mngmnt.muzXBox.zrenderer.pitchLineThicknessInTaps)
			+ 0 * 12 * mngmnt.muzXBox.zrenderer.pitchLineThicknessInTaps
			- this.pitchLineIdx * mngmnt.muzXBox.zrenderer.pitchLineThicknessInTaps;
		let ww = mngmnt.muzXBox.zrenderer.secondWidthInTaps * measuresAndStep.duration;
		let hh = mngmnt.muzXBox.zrenderer.pitchLineThicknessInTaps;
		let tx = mngmnt.muzXBox.zrenderer.tileLevel.translateX / mngmnt.muzXBox.zrenderer.tileLevel.tapSize;
		let ty = mngmnt.muzXBox.zrenderer.tileLevel.translateY / mngmnt.muzXBox.zrenderer.tileLevel.tapSize;
		let tz = mngmnt.muzXBox.zrenderer.tileLevel.translateZ / mngmnt.muzXBox.zrenderer.tileLevel.tapSize
		let vw = mngmnt.muzXBox.zrenderer.tileLevel.viewWidth * tz;
		let vh = mngmnt.muzXBox.zrenderer.tileLevel.viewHeight * tz;
		if (xx + ww > vw - tx) {//right
			mngmnt.muzXBox.zrenderer.tileLevel.translateX = (vw - xx - ww) * mngmnt.muzXBox.zrenderer.tileLevel.tapSize;
		}
		if (xx < -tx) {//left
			mngmnt.muzXBox.zrenderer.tileLevel.translateX = -xx * mngmnt.muzXBox.zrenderer.tileLevel.tapSize;
		}
		if (yy + hh > vh - ty) {//down
			mngmnt.muzXBox.zrenderer.tileLevel.translateY = (vh - yy - hh) * mngmnt.muzXBox.zrenderer.tileLevel.tapSize;
		}
		if (yy < -ty) {//up
			mngmnt.muzXBox.zrenderer.tileLevel.translateY = -yy * mngmnt.muzXBox.zrenderer.tileLevel.tapSize;
		}
		mngmnt.muzXBox.zrenderer.tileLevel.applyZoomPosition();
	}
	moveSpotIntoView(mngmnt: FocusManagement): void {
		var rhythmPattern: ZvoogMeter[] = mngmnt.muzXBox.currentSchedule.rhythm ? mngmnt.muzXBox.currentSchedule.rhythm : default8rhytym;
		let measuresAndStep = measuresAndStepDuration(mngmnt.muzXBox.currentSchedule, this.idxMeasure, this.idxStep, rhythmPattern);
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

		let newY = ih / 2;
		if (vh < ih) {
			newY = vh / 2 - ty;
		}
		let pitchY = tp * topGridMargin + tp * octaveCount * 12 * mngmnt.muzXBox.zrenderer.pitchLineThicknessInTaps - newY * tz;
		this.pitchLineIdx = Math.ceil(pitchY / (tp * mngmnt.muzXBox.zrenderer.pitchLineThicknessInTaps));
		if (this.pitchLineIdx < 0) {
			this.pitchLineIdx = 0;
		}
		if (this.pitchLineIdx >= octaveCount * 12) {
			this.pitchLineIdx = octaveCount * 12;
		}
		let newX = iw / 2;
		if (vw < iw) {
			newX = vw / 2 - tx;
		}
		let stepX = -tp * leftGridMargin / tz + newX;
		let findX = tz * stepX / tp;
		let measureStep = findMeasureStep(mngmnt.muzXBox.currentSchedule.measures, rhythmPattern, mngmnt.muzXBox.zrenderer.secondWidthInTaps, findX);
		if (measureStep) {
			this.idxMeasure = measureStep.measure;
			this.idxStep = measureStep.step;
		} else {
			this.idxMeasure = 0;
			this.idxStep = 0;
		}
	}
}
