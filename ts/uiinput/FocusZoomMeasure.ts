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

			this.moveViewToShowSpot(mngmnt);

			mngmnt.reSetFocus(mngmnt.muzXBox.zrenderer, scheduleDuration(mngmnt.muzXBox.currentSchedule));
			return true;
		} else {
			return false;
		}
	}
	spotDown(mngmnt: FocusManagement): boolean {
		if (this.currentPitch > 0) {
			this.currentPitch--;

			this.moveViewToShowSpot(mngmnt);

			mngmnt.reSetFocus(mngmnt.muzXBox.zrenderer, scheduleDuration(mngmnt.muzXBox.currentSchedule));
			return true;
		} else {
			return false;
		}
	}
	spotLeft(mngmnt: FocusManagement): boolean {
		//console.log('measure spotLeft', this.currentMeasure, this.currentStep
		//);
		if (this.currentStep > 0) {
			this.currentStep--;
			this.moveViewToShowSpot(mngmnt);
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
				this.moveViewToShowSpot(mngmnt);
				mngmnt.reSetFocus(mngmnt.muzXBox.zrenderer, scheduleDuration(mngmnt.muzXBox.currentSchedule));
				return true;
			} else {
				return false;
			}
		}
	}
	spotRight(mngmnt: FocusManagement): boolean {
		//console.log('measure spotRight'
		//	, mngmnt.muzXBox.zrenderer.tileLevel.translateX, mngmnt.muzXBox.zrenderer.tileLevel.translateY, mngmnt.muzXBox.zrenderer.tileLevel.translateZ
		//);
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
			mngmnt.reSetFocus(mngmnt.muzXBox.zrenderer, scheduleDuration(mngmnt.muzXBox.currentSchedule));
			return true;
		} else {
			if (this.currentMeasure < mngmnt.muzXBox.currentSchedule.measures.length - 1) {
				this.currentMeasure++;
				this.currentStep = 0;
				this.moveViewToShowSpot(mngmnt);
				mngmnt.reSetFocus(mngmnt.muzXBox.zrenderer, scheduleDuration(mngmnt.muzXBox.currentSchedule));
				return true;
			} else {
				return false;
			}
		}
	}
	moveViewToShowSpot(mngmnt: FocusManagement) {
		var rhythmPattern: ZvoogMeter[] = mngmnt.muzXBox.currentSchedule.rhythm ? mngmnt.muzXBox.currentSchedule.rhythm : default8rhytym;
		let measuresAndStep = measuresAndStepDuration(mngmnt.muzXBox.currentSchedule, this.currentMeasure, this.currentStep, rhythmPattern);
		let xx = mngmnt.muzXBox.zrenderer.ratioDuration * measuresAndStep.start;
		let yy = (127 - this.currentPitch) * mngmnt.muzXBox.zrenderer.ratioThickness;
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
		console.log('moveSpotIntoView from', this.currentPitch, ':', this.currentMeasure, this.currentStep);
		var rhythmPattern: ZvoogMeter[] = mngmnt.muzXBox.currentSchedule.rhythm ? mngmnt.muzXBox.currentSchedule.rhythm : default8rhytym;
		let measuresAndStep = measuresAndStepDuration(mngmnt.muzXBox.currentSchedule, this.currentMeasure, this.currentStep, rhythmPattern);
		let xx = mngmnt.muzXBox.zrenderer.ratioDuration * measuresAndStep.start;
		let yy = (127 - this.currentPitch) * mngmnt.muzXBox.zrenderer.ratioThickness;
		let ww = mngmnt.muzXBox.zrenderer.ratioDuration * measuresAndStep.duration;
		let hh = mngmnt.muzXBox.zrenderer.ratioThickness;
		let tx = mngmnt.muzXBox.zrenderer.tileLevel.translateX / mngmnt.muzXBox.zrenderer.tileLevel.tapSize;
		let ty = mngmnt.muzXBox.zrenderer.tileLevel.translateY / mngmnt.muzXBox.zrenderer.tileLevel.tapSize;
		let tz = mngmnt.muzXBox.zrenderer.tileLevel.translateZ / mngmnt.muzXBox.zrenderer.tileLevel.tapSize
		let vw = mngmnt.muzXBox.zrenderer.tileLevel.viewWidth * tz;
		let vh = mngmnt.muzXBox.zrenderer.tileLevel.viewHeight * tz;
		if (xx + ww > vw - tx) {//right
			console.log('from right');
			let measureStartTime = 0;
			//let old = this.currentMeasure;
			let measureDuration = 0;
			for (this.currentMeasure = 0; this.currentMeasure < mngmnt.muzXBox.currentSchedule.measures.length; this.currentMeasure++) {
				measureDuration = meter2seconds(mngmnt.muzXBox.currentSchedule.measures[this.currentMeasure].tempo, mngmnt.muzXBox.currentSchedule.measures[this.currentMeasure].meter);
				if ((measureStartTime + measureDuration) * mngmnt.muzXBox.zrenderer.ratioDuration > ww + vw - tx) {
					//console.log(':', tx, this.currentMeasure, (measureStartTime + measureDuration) * mngmnt.muzXBox.zrenderer.ratioDuration);
					break;
				}
				measureStartTime = measureStartTime + measureDuration;
			}
			let nn = 0;
			this.currentStep = 0;
			let currentStepEnd: ZvoogMeter = rhythmPattern[nn];
			let inDuration = meter2seconds(mngmnt.muzXBox.currentSchedule.measures[this.currentMeasure].tempo, currentStepEnd);
			while (inDuration < measureDuration && (measureStartTime + inDuration) * mngmnt.muzXBox.zrenderer.ratioDuration < -ww + vw - tx) {
				nn++;
				this.currentStep++;
				if (nn >= rhythmPattern.length) {
					nn = 0;
				}
				currentStepEnd = DUU(currentStepEnd).plus(rhythmPattern[nn]);
				inDuration = meter2seconds(mngmnt.muzXBox.currentSchedule.measures[this.currentMeasure].tempo, currentStepEnd);
			}
			console.log('from right', this.currentMeasure, this.currentStep);
		}
		if (xx < -tx) {//left
			let measureStartTime = 0;
			//let old = this.currentMeasure;
			let measureDuration = 0;
			for (this.currentMeasure = 0; this.currentMeasure < mngmnt.muzXBox.currentSchedule.measures.length; this.currentMeasure++) {
				measureDuration = meter2seconds(mngmnt.muzXBox.currentSchedule.measures[this.currentMeasure].tempo, mngmnt.muzXBox.currentSchedule.measures[this.currentMeasure].meter);
				if ((measureStartTime + measureDuration) * mngmnt.muzXBox.zrenderer.ratioDuration > -tx) {
					//console.log(':', tx, this.currentMeasure, (measureStartTime + measureDuration) * mngmnt.muzXBox.zrenderer.ratioDuration);
					break;
				}
				measureStartTime = measureStartTime + measureDuration;
			}
			let nn = 0;
			this.currentStep = 0;
			let currentStepEnd: ZvoogMeter = rhythmPattern[nn];
			let inDuration = meter2seconds(mngmnt.muzXBox.currentSchedule.measures[this.currentMeasure].tempo, currentStepEnd);
			while (inDuration < measureDuration && (measureStartTime + inDuration) * mngmnt.muzXBox.zrenderer.ratioDuration < -tx) {
				nn++;
				this.currentStep++;
				if (nn >= rhythmPattern.length) {
					nn = 0;
				}
				currentStepEnd = DUU(currentStepEnd).plus(rhythmPattern[nn]);
				inDuration = meter2seconds(mngmnt.muzXBox.currentSchedule.measures[this.currentMeasure].tempo, currentStepEnd);
			}
			console.log('from left', this.currentMeasure, this.currentStep);
		}
		if (yy + hh > vh - ty) {//down
			let newY = vh - ty - hh;
			let newPitch = 127 - Math.floor(newY / mngmnt.muzXBox.zrenderer.ratioThickness);
			console.log('from down', this.currentPitch, newPitch);
			this.currentPitch = newPitch;
		}
		if (yy < -ty) {//up
			let newY = -ty;
			let newPitch = 127 - Math.ceil(newY / mngmnt.muzXBox.zrenderer.ratioThickness);
			console.log('from up', this.currentPitch, newPitch);
			this.currentPitch = newPitch;
		}
		console.log('to', this.currentPitch, ':', this.currentMeasure, this.currentStep);
	}
}
