class FocusZoomSong implements FocusLevel {
	indexMeasure: number = 2;
	indexOctave: number = 5;
	isMatch(zoomLevel: number, zRender: ZRender): boolean {
		if (zoomLevel >= zRender.zoomMeasure && zoomLevel < zRender.zoomSong) {
			return true;
		} else {
			return false;
		}
	}
	addSpot(mngmnt: FocusManagement) {
		if (this.indexMeasure >= mngmnt.muzXBox.currentSchedule.measures.length) {
			this.indexMeasure = mngmnt.muzXBox.currentSchedule.measures.length - 1;
		}
		var rhythmPattern: ZvoogMeter[] = mngmnt.muzXBox.currentSchedule.rhythm ? mngmnt.muzXBox.currentSchedule.rhythm : default8rhytym;
		let measuresAndStep = measuresAndStepDuration(mngmnt.muzXBox.currentSchedule, this.indexMeasure, 0, rhythmPattern);
		let xx = leftGridMargin + mngmnt.muzXBox.zrenderer.secondWidthInTaps * measuresAndStep.start;
		let ww = mngmnt.muzXBox.zrenderer.secondWidthInTaps * meter2seconds(mngmnt.muzXBox.currentSchedule.measures[this.indexMeasure].tempo, mngmnt.muzXBox.currentSchedule.measures[this.indexMeasure].meter);
		let hh = 12 * mngmnt.muzXBox.zrenderer.pitchLineThicknessInTaps;
		let yy = topGridMargin
			+ gridHeightTp(mngmnt.muzXBox.zrenderer.pitchLineThicknessInTaps)
			- 12 * (1 + this.indexOctave) * mngmnt.muzXBox.zrenderer.pitchLineThicknessInTaps;
		if (this.indexOctave < 0) {
			hh = bottomGridMargin;
		}
		mngmnt.focusAnchor.content.push({
			x: xx
			, y: yy
			, w: ww
			, h: hh
			, rx: 0
			, ry: 0
			, css: 'actionPointSong'
		});
		let ww2 = mngmnt.muzXBox.zrenderer.secondWidthInTaps *0.1;
		if (startSlecetionMeasureIdx > -1) {
			let measuresAndStep2 = measuresAndStepDuration(mngmnt.muzXBox.currentSchedule, startSlecetionMeasureIdx, 0, rhythmPattern);
			let xx2 = mngmnt.muzXBox.zrenderer.secondWidthInTaps * measuresAndStep2.start;
			if (endSlecetionMeasureIdx > -1) {
				ww2 = 0;
				for (let kk = startSlecetionMeasureIdx; kk <= endSlecetionMeasureIdx; kk++) {
					ww2 = ww2 + mngmnt.muzXBox.zrenderer.secondWidthInTaps
						* meter2seconds(mngmnt.muzXBox.currentSchedule.measures[kk].tempo
							, mngmnt.muzXBox.currentSchedule.measures[kk].meter);
				}
			}
			mngmnt.focusAnchor.content.push({
				x: leftGridMargin + xx2
				, y: topGridMargin
				, w: ww2
				, h: octaveCount * 12 * mngmnt.muzXBox.zrenderer.pitchLineThicknessInTaps
				, rx: 0
				, ry: 0
				, css: 'selectionBackGround'
			});
		}


	}
	spotUp(mngmnt: FocusManagement): boolean {
		if (this.indexOctave < octaveCount - 1) {
			this.indexOctave++;
			return true;
		} else {
			return false;
		}
	}
	spotDown(mngmnt: FocusManagement): boolean {
		if (this.indexOctave > -1) {
			this.indexOctave--;
			return true;
		} else {
			return false;
		}
	}
	spotLeft(mngmnt: FocusManagement): boolean {
		//console.log('song spotLeft');
		if (this.indexMeasure > 0) {
			this.indexMeasure--;
			return true;
		} else {
			return false;
		}
	}
	spotRight(mngmnt: FocusManagement): boolean {
		//console.log('song spotRight');
		//return false;
		if (this.indexMeasure < mngmnt.muzXBox.currentSchedule.measures.length - 1) {
			this.indexMeasure++;
			return true;
		} else {
			return false;
		}

	}
	moveViewToShowSpot(mngmnt: FocusManagement): void {
		var rhythmPattern: ZvoogMeter[] = mngmnt.muzXBox.currentSchedule.rhythm ? mngmnt.muzXBox.currentSchedule.rhythm : default8rhytym;
		let measuresAndStep = measuresAndStepDuration(mngmnt.muzXBox.currentSchedule, this.indexMeasure, 0, rhythmPattern);
		let xx = leftGridMargin + mngmnt.muzXBox.zrenderer.secondWidthInTaps * measuresAndStep.start;
		let yy = topGridMargin
			+ gridHeightTp(mngmnt.muzXBox.zrenderer.pitchLineThicknessInTaps)
			- 12 * this.indexOctave * mngmnt.muzXBox.zrenderer.pitchLineThicknessInTaps;
		let ww = mngmnt.muzXBox.zrenderer.secondWidthInTaps * meter2seconds(mngmnt.muzXBox.currentSchedule.measures[this.indexMeasure].tempo, mngmnt.muzXBox.currentSchedule.measures[this.indexMeasure].meter);
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
		if (yy + hh > vh - ty) {//down
			mngmnt.muzXBox.zrenderer.tileLevel.translateY = (vh - yy - hh) * mngmnt.muzXBox.zrenderer.tileLevel.tapSize;
		}
		if (yy < -ty) {//up
			mngmnt.muzXBox.zrenderer.tileLevel.translateY = -yy * mngmnt.muzXBox.zrenderer.tileLevel.tapSize;
		}
		//console.log('moveViewToShowSpot',mngmnt.muzXBox.zrenderer.tileLevel.translateX);
		mngmnt.muzXBox.zrenderer.tileLevel.applyZoomPosition();
		//console.log(ww,hh,tx,ty,tz,this.indexMeasure,mngmnt.muzXBox.zrenderer.tileLevel.translateX,mngmnt.muzXBox.zrenderer.tileLevel.translateX);
	}
	moveSpotIntoView(mngmnt: FocusManagement): void {
		var rhythmPattern: ZvoogMeter[] = mngmnt.muzXBox.currentSchedule.rhythm ? mngmnt.muzXBox.currentSchedule.rhythm : default8rhytym;
		let measuresAndStep = measuresAndStepDuration(mngmnt.muzXBox.currentSchedule, this.indexMeasure, 0, rhythmPattern);
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
		let pitchLineIdx = this.indexOctave * 12;
		pitchLineIdx = Math.ceil(pitchY / (tp * mngmnt.muzXBox.zrenderer.pitchLineThicknessInTaps));
		if (pitchLineIdx < 0) {
			pitchLineIdx = 0;
		}
		if (pitchLineIdx >= octaveCount * 12) {
			pitchLineIdx = octaveCount * 12;
		}
		this.indexOctave = Math.round(pitchLineIdx / 12);
		let newX = iw / 2;
		if (vw < iw) {
			newX = vw / 2 - tx;
		}
		let stepX = -tp * leftGridMargin / tz + newX;
		let findX = tz * stepX / tp;
		let measureStep = findMeasureStep(mngmnt.muzXBox.currentSchedule.measures, rhythmPattern, mngmnt.muzXBox.zrenderer.secondWidthInTaps, findX);
		if (measureStep) {
			this.indexMeasure = measureStep.measure;
		} else {
			this.indexMeasure = 0;
		}
	}
}
