class FocusZoomSong implements FocusLevel {
	currentMeasure: number = 2;
	currentOctave: number = 5;
	isMatch(zoomLevel: number, zRender: ZRender): boolean {
		if (zoomLevel >= zRender.zoomMeasure && zoomLevel < zRender.zoomSong) {
			return true;
		} else {
			return false;
		}
	}
	addSpot(mngmnt: FocusManagement) {
		if (this.currentMeasure >= mngmnt.muzXBox.currentSchedule.measures.length) {
			this.currentMeasure = mngmnt.muzXBox.currentSchedule.measures.length - 1;
		}
		var rhythmPattern: ZvoogMeter[] = mngmnt.muzXBox.currentSchedule.rhythm ? mngmnt.muzXBox.currentSchedule.rhythm : default8rhytym;
		let measuresAndStep = measuresAndStepDuration(mngmnt.muzXBox.currentSchedule, this.currentMeasure, 0, rhythmPattern);
		let xx = leftGridMargin + mngmnt.muzXBox.zrenderer.ratioDuration * measuresAndStep.start;
		let ww = mngmnt.muzXBox.zrenderer.ratioDuration *meter2seconds(mngmnt.muzXBox.currentSchedule.measures[this.currentMeasure].tempo, mngmnt.muzXBox.currentSchedule.measures[this.currentMeasure].meter);
		let hh = 12 * mngmnt.muzXBox.zrenderer.ratioThickness;
		let yy = topGridMargin
			+ gridHeightTp(mngmnt.muzXBox.zrenderer.ratioThickness)
			+ 0 * 12 * mngmnt.muzXBox.zrenderer.ratioThickness
			- 12 * this.currentOctave * mngmnt.muzXBox.zrenderer.ratioThickness;
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
	spotUp(): boolean {
		console.log('song spotUp');
		return false;
	}
	spotDown(): boolean {
		console.log('song spotDown');
		return false;
	}
	spotLeft(): boolean {
		console.log('song spotLeft');
		return false;
	}
	spotRight(): boolean {
		console.log('song spotRight');
		return false;
	}
	moveSpotIntoView(mngmnt: FocusManagement): void {

	}
}
