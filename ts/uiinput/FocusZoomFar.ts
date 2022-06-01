class FocusZoomFar implements FocusLevel {
	currentMeasure: number = 6;
	isMatch(zoomLevel: number, zRender: ZRender): boolean {
		if (zoomLevel >= zRender.zoomSong && zoomLevel < zRender.zoomFar) {
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
		let hh = 12 *octaveCount* mngmnt.muzXBox.zrenderer.ratioThickness;
		let yy = topGridMargin ;
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
		console.log('FocusZoomFar spotUp');
		return false;
	}
	spotDown(mngmnt: FocusManagement): boolean {
		console.log('FocusZoomFar spotDown');
		return false;
	}
	spotLeft(mngmnt: FocusManagement): boolean {
		console.log('FocusZoomFar spotLeft');
		return false;
	}
	spotRight(mngmnt: FocusManagement): boolean {
		console.log('FocusZoomFar spotRight');
		return false;
	}
	moveSpotIntoView(mngmnt: FocusManagement) :void{
		
	}
}
