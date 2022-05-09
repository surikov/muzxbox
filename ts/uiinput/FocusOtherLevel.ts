class FocusOtherLevel implements FocusLevel {
	isMatch(zoomLevel: number, zRender: ZRender): boolean {
		return true;
	}
	addSpot(mngmnt: FocusManagement) {
		//
	}
	spotUp(mngmnt: FocusManagement): boolean {
		console.log('other spotUp');
		return false;
	}
	spotDown(mngmnt: FocusManagement): boolean {
		console.log('other spotDown');
		return false;
	}
	spotLeft(mngmnt: FocusManagement): boolean {
		console.log('other spotLeft');
		return false;
	}
	spotRight(mngmnt: FocusManagement): boolean {
		console.log('other spotRight');
		return false;
	}
}
