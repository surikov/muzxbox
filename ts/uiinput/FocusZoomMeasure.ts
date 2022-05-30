class FocusZoomMeasure implements FocusLevel {
	currentPitch: number = 33;
	currentMeasure: number = 2;
	currentStep: number = 1;
	isMatch(zoomLevel: number, zRender: ZRender): boolean {
		if (zoomLevel >= zRender.zoomNote && zoomLevel < zRender.zoomMeasure) {
			return true;
		} else {
			return false;
		}
	}
	addSpot(mngmnt: FocusManagement) {
		var rhythmPattern: ZvoogMeter[] = mngmnt.muzXBox.currentSchedule.rhythm ? mngmnt.muzXBox.currentSchedule.rhythm : default8rhytym;
		let measuresAndStep = measuresAndStepDuration(mngmnt.muzXBox.currentSchedule, this.currentMeasure, this.currentStep, rhythmPattern);
		let xx = leftGridMargin + mngmnt.muzXBox.zrenderer.ratioDuration * measuresAndStep.start;
		let ww = mngmnt.muzXBox.zrenderer.ratioDuration * measuresAndStep.duration;
		let hh = mngmnt.muzXBox.zrenderer.ratioThickness;
		let yy = topGridMargin
			+ gridHeightTp(mngmnt.muzXBox.zrenderer.ratioThickness)
			+ 0 * 12 * mngmnt.muzXBox.zrenderer.ratioThickness
			- this.currentPitch * mngmnt.muzXBox.zrenderer.ratioThickness;
		mngmnt.focusAnchor.content.push({ x: xx, y: yy, w: ww, h: hh, rx: 0, ry: 0, css: 'actionPoint' });
	}
	spotUp(mngmnt: FocusManagement): boolean {
		if (this.currentPitch < octaveCount * 12) {
			this.currentPitch++;

			this.moveViewToShowSpot(mngmnt);

			mngmnt.reSetFocus(mngmnt.muzXBox.zrenderer, gridWidthTp(mngmnt.muzXBox.currentSchedule, mngmnt.muzXBox.zrenderer.ratioDuration));
			return true;
		} else {
			return false;
		}
	}
	spotDown(mngmnt: FocusManagement): boolean {
		if (this.currentPitch > 1) {
			this.currentPitch--;

			this.moveViewToShowSpot(mngmnt);

			mngmnt.reSetFocus(mngmnt.muzXBox.zrenderer, gridWidthTp(mngmnt.muzXBox.currentSchedule, mngmnt.muzXBox.zrenderer.ratioDuration));
			return true;
		} else {
			return false;
		}
	}
	spotLeft(mngmnt: FocusManagement): boolean {
		if (this.currentStep > 0) {
			this.currentStep--;
			this.moveViewToShowSpot(mngmnt);
			mngmnt.reSetFocus(mngmnt.muzXBox.zrenderer, gridWidthTp(mngmnt.muzXBox.currentSchedule, mngmnt.muzXBox.zrenderer.ratioDuration));
			return true;
		} else {
			if (this.currentMeasure > 0) {
				let defrhy: ZvoogMeter[] = [
					{ count: 1, division: 8 }, { count: 1, division: 8 }
					, { count: 1, division: 8 }, { count: 1, division: 8 }

				];
				var rhythmPattern: ZvoogMeter[] = mngmnt.muzXBox.currentSchedule.rhythm ? mngmnt.muzXBox.currentSchedule.rhythm : defrhy;
				let count = countMeasureSteps(mngmnt.muzXBox.currentSchedule.measures[this.currentMeasure].meter
					, rhythmPattern);
				this.currentStep = count - 1;
				this.currentMeasure--;
				this.moveViewToShowSpot(mngmnt);
				mngmnt.reSetFocus(mngmnt.muzXBox.zrenderer, gridWidthTp(mngmnt.muzXBox.currentSchedule, mngmnt.muzXBox.zrenderer.ratioDuration));
				return true;
			} else {
				return false;
			}
		}
	}
	spotRight(mngmnt: FocusManagement): boolean {
		let defrhy: ZvoogMeter[] = [
			{ count: 1, division: 8 }, { count: 1, division: 8 }
			, { count: 1, division: 8 }, { count: 1, division: 8 }

		];
		var rhythmPattern: ZvoogMeter[] = mngmnt.muzXBox.currentSchedule.rhythm ? mngmnt.muzXBox.currentSchedule.rhythm : defrhy;
		let count = countMeasureSteps(mngmnt.muzXBox.currentSchedule.measures[this.currentMeasure].meter
			, rhythmPattern);
		if (this.currentStep < count - 1) {
			this.currentStep++;
			this.moveViewToShowSpot(mngmnt);
			mngmnt.reSetFocus(mngmnt.muzXBox.zrenderer, gridWidthTp(mngmnt.muzXBox.currentSchedule, mngmnt.muzXBox.zrenderer.ratioDuration));
			return true;
		} else {
			if (this.currentMeasure < mngmnt.muzXBox.currentSchedule.measures.length - 1) {
				this.currentMeasure++;
				this.currentStep = 0;
				this.moveViewToShowSpot(mngmnt);
				mngmnt.reSetFocus(mngmnt.muzXBox.zrenderer, gridWidthTp(mngmnt.muzXBox.currentSchedule, mngmnt.muzXBox.zrenderer.ratioDuration));
				return true;
			} else {
				return false;
			}
		}
	}
	moveViewToShowSpot(mngmnt: FocusManagement) {
		var rhythmPattern: ZvoogMeter[] = mngmnt.muzXBox.currentSchedule.rhythm ? mngmnt.muzXBox.currentSchedule.rhythm : default8rhytym;
		let measuresAndStep = measuresAndStepDuration(mngmnt.muzXBox.currentSchedule, this.currentMeasure, this.currentStep, rhythmPattern);
		let xx = leftGridMargin + mngmnt.muzXBox.zrenderer.ratioDuration * measuresAndStep.start;
		let yy = topGridMargin
			+ gridHeightTp(mngmnt.muzXBox.zrenderer.ratioThickness)
			+ 0 * 12 * mngmnt.muzXBox.zrenderer.ratioThickness
			- this.currentPitch * mngmnt.muzXBox.zrenderer.ratioThickness;
		let ww = mngmnt.muzXBox.zrenderer.ratioDuration * measuresAndStep.duration;
		let hh = mngmnt.muzXBox.zrenderer.ratioThickness;
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
		let measuresAndStep = measuresAndStepDuration(mngmnt.muzXBox.currentSchedule, this.currentMeasure, this.currentStep, rhythmPattern);
		let tp = mngmnt.muzXBox.zrenderer.tileLevel.tapSize;
		let ww = mngmnt.muzXBox.zrenderer.ratioDuration * measuresAndStep.duration;
		let hh = mngmnt.muzXBox.zrenderer.ratioThickness;

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
		let pitchY = tp * topGridMargin + tp * octaveCount * 12 * mngmnt.muzXBox.zrenderer.ratioThickness - newY * tz;
		this.currentPitch = Math.ceil(pitchY / (tp * mngmnt.muzXBox.zrenderer.ratioThickness));
		if (this.currentPitch < 0) {
			this.currentPitch = 0;
		}
		if (this.currentPitch >= octaveCount * 12) {
			this.currentPitch = octaveCount * 12;
		}
		let newX = iw / 2;
		if (vw < iw) {
			newX = vw / 2 - tx;
		}
		let stepX = -tp * leftGridMargin / tz + newX;
		let findX = tz * stepX / tp;
		let measureStep = findMeasureStep(mngmnt.muzXBox.currentSchedule.measures, rhythmPattern, mngmnt.muzXBox.zrenderer.ratioDuration, findX);
		if (measureStep) {
			this.currentMeasure = measureStep.measure;
			this.currentStep = measureStep.step;
		} else {
			this.currentMeasure = 0;
			this.currentStep = 0;
		}
	}
}
