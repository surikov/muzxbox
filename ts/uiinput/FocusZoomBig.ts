class FocusZoomBig implements FocusLevel {
	isMatch(zoomLevel: number, zRender: ZRender): boolean {
		if (zoomLevel >= zRender.zoomFar) {
			return true;
		} else {
			return false;
		}
	}
	addSpot(mngmnt: FocusManagement) {
		//
	}
	spotUp(mngmnt: FocusManagement): boolean {
		console.log('FocusZoomBig spotUp');
		return false;
	}
	spotDown(mngmnt: FocusManagement): boolean {
		console.log('FocusZoomBig spotDown');
		return false;
	}
	spotLeft(mngmnt: FocusManagement): boolean {
		console.log('FocusZoomBig spotLeft');
		return false;
	}
	spotRight(mngmnt: FocusManagement): boolean {
		console.log('FocusZoomBig spotRight');
		return false;
	}
	moveSpotIntoView(mngmnt: FocusManagement) :void{
		
	}
}
