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
		let xx = mngmnt.muzXBox.zrenderer.ratioDuration * measuresAndStep.start;
		let ww = mngmnt.muzXBox.zrenderer.ratioDuration * measuresAndStep.duration;
		let hh = mngmnt.muzXBox.zrenderer.ratioThickness;
		let yy = (127 - this.currentPitch) * mngmnt.muzXBox.zrenderer.ratioThickness;
		mngmnt.focusAnchor.content.push({ x: xx, y: yy, w: ww, h: hh, rx: 0, ry: 0, css: 'debug' });
	}
	spotUp(mngmnt: FocusManagement): boolean {
		if (this.currentPitch < 127) {
			this.currentPitch++;

			let yy = (127 - this.currentPitch) * mngmnt.muzXBox.zrenderer.ratioThickness;
			let ty = mngmnt.muzXBox.zrenderer.tileLevel.translateY / mngmnt.muzXBox.zrenderer.tileLevel.tapSize;
			if (yy < -ty) {
				mngmnt.muzXBox.zrenderer.tileLevel.translateY = -yy * mngmnt.muzXBox.zrenderer.tileLevel.tapSize;
				mngmnt.muzXBox.zrenderer.tileLevel.applyZoomPosition();
			}

			mngmnt.reSetFocus(mngmnt.muzXBox.zrenderer, scheduleDuration(mngmnt.muzXBox.currentSchedule));
			return true;
		} else {
			return false;
		}
	}
	spotDown(mngmnt: FocusManagement): boolean {
		if (this.currentPitch > 0) {
			this.currentPitch--;

			let hh = mngmnt.muzXBox.zrenderer.ratioThickness;
			let yy = (127 - this.currentPitch) * mngmnt.muzXBox.zrenderer.ratioThickness;
			let ty = mngmnt.muzXBox.zrenderer.tileLevel.translateY / mngmnt.muzXBox.zrenderer.tileLevel.tapSize;
			let tz = mngmnt.muzXBox.zrenderer.tileLevel.translateZ / mngmnt.muzXBox.zrenderer.tileLevel.tapSize
			let vh = mngmnt.muzXBox.zrenderer.tileLevel.viewHeight * tz;
			if (yy + hh > vh - ty) {
				mngmnt.muzXBox.zrenderer.tileLevel.translateY = (vh - yy - hh) * mngmnt.muzXBox.zrenderer.tileLevel.tapSize;
				mngmnt.muzXBox.zrenderer.tileLevel.applyZoomPosition();
			}

			mngmnt.reSetFocus(mngmnt.muzXBox.zrenderer, scheduleDuration(mngmnt.muzXBox.currentSchedule));
			return true;
		} else {
			return false;
		}
	}
	checkMoveLeft(mngmnt: FocusManagement) {
		var rhythmPattern: ZvoogMeter[] = mngmnt.muzXBox.currentSchedule.rhythm ? mngmnt.muzXBox.currentSchedule.rhythm : default8rhytym;
		let measuresAndStep = measuresAndStepDuration(mngmnt.muzXBox.currentSchedule, this.currentMeasure, this.currentStep, rhythmPattern);
		let xx = mngmnt.muzXBox.zrenderer.ratioDuration * measuresAndStep.start;
		let tx = mngmnt.muzXBox.zrenderer.tileLevel.translateX / mngmnt.muzXBox.zrenderer.tileLevel.tapSize;
		if (xx < -tx) {
			mngmnt.muzXBox.zrenderer.tileLevel.translateX = -xx * mngmnt.muzXBox.zrenderer.tileLevel.tapSize;
			mngmnt.muzXBox.zrenderer.tileLevel.applyZoomPosition();
		}
	}
	spotLeft(mngmnt: FocusManagement): boolean {
		console.log('measure spotLeft', this.currentMeasure, this.currentStep
		);
		if (this.currentStep > 0) {
			this.currentStep--;
			this.checkMoveLeft(mngmnt);
			mngmnt.reSetFocus(mngmnt.muzXBox.zrenderer, scheduleDuration(mngmnt.muzXBox.currentSchedule));
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
				this.checkMoveLeft(mngmnt);
				mngmnt.reSetFocus(mngmnt.muzXBox.zrenderer, scheduleDuration(mngmnt.muzXBox.currentSchedule));
				return true;
			} else {
				return false;
			}
		}
	}
	checkMoveRight(mngmnt: FocusManagement) {
		var rhythmPattern: ZvoogMeter[] = mngmnt.muzXBox.currentSchedule.rhythm ? mngmnt.muzXBox.currentSchedule.rhythm : default8rhytym;
		let measuresAndStep = measuresAndStepDuration(mngmnt.muzXBox.currentSchedule, this.currentMeasure, this.currentStep, rhythmPattern);
		let xx = mngmnt.muzXBox.zrenderer.ratioDuration * measuresAndStep.start;
		let ww = mngmnt.muzXBox.zrenderer.ratioDuration * measuresAndStep.duration;
		let tx = mngmnt.muzXBox.zrenderer.tileLevel.translateX / mngmnt.muzXBox.zrenderer.tileLevel.tapSize;
		let tz = mngmnt.muzXBox.zrenderer.tileLevel.translateZ / mngmnt.muzXBox.zrenderer.tileLevel.tapSize
		let vw = mngmnt.muzXBox.zrenderer.tileLevel.viewWidth * tz;
		if (xx + ww > vw - tx) {
			mngmnt.muzXBox.zrenderer.tileLevel.translateX = (vw - xx - ww) * mngmnt.muzXBox.zrenderer.tileLevel.tapSize;
			mngmnt.muzXBox.zrenderer.tileLevel.applyZoomPosition();
		}
	}
	spotRight(mngmnt: FocusManagement): boolean {
		console.log('measure spotRight'
			, mngmnt.muzXBox.zrenderer.tileLevel.translateX, mngmnt.muzXBox.zrenderer.tileLevel.translateY, mngmnt.muzXBox.zrenderer.tileLevel.translateZ
		);
		let defrhy: ZvoogMeter[] = [
			{ count: 1, division: 8 }, { count: 1, division: 8 }
			, { count: 1, division: 8 }, { count: 1, division: 8 }

		];
		var rhythmPattern: ZvoogMeter[] = mngmnt.muzXBox.currentSchedule.rhythm ? mngmnt.muzXBox.currentSchedule.rhythm : defrhy;
		let count = countMeasureSteps(mngmnt.muzXBox.currentSchedule.measures[this.currentMeasure].meter
			, rhythmPattern);
		if (this.currentStep < count - 1) {
			this.currentStep++;
			this.checkMoveRight(mngmnt);
			mngmnt.reSetFocus(mngmnt.muzXBox.zrenderer, scheduleDuration(mngmnt.muzXBox.currentSchedule));
			return true;
		} else {
			if (this.currentMeasure < mngmnt.muzXBox.currentSchedule.measures.length - 1) {
				this.currentMeasure++;
				this.currentStep = 0;
				this.checkMoveRight(mngmnt);
				mngmnt.reSetFocus(mngmnt.muzXBox.zrenderer, scheduleDuration(mngmnt.muzXBox.currentSchedule));
				return true;
			} else {
				return false;
			}
		}
	}
}
