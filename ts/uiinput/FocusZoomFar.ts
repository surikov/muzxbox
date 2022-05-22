class FocusZoomFar implements FocusLevel {
	isMatch(zoomLevel: number, zRender: ZRender): boolean {
		if (zoomLevel >= zRender.zoomSong && zoomLevel < zRender.zoomFar) {
			return true;
		} else {
			return false;
		}
	}
	addSpot(mngmnt: FocusManagement) {
		//
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
