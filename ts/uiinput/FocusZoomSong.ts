class FocusZoomSong implements FocusLevel {
	isMatch(zoomLevel: number, zRender: ZRender): boolean {
		if (zoomLevel >= zRender.zoomMeasure && zoomLevel < zRender.zoomSong) {
			return true;
		} else {
			return false;
		}
	}
	addSpot(mngmnt: FocusManagement) {
		mngmnt.focusAnchor.content.push({
			x: 0
			, y: 0
			, w: 5//wholeWidthTp(mngmnt.muzXBox.currentSchedule, mngmnt.muzXBox.zrenderer.ratioDuration)
			, h: 5//wholeHeightTp(mngmnt.muzXBox.zrenderer.ratioThickness)
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
