class FocusZoomNote implements FocusLevel {
	isMatch(zoomLevel: number, zRender: ZRender): boolean {
		if (zoomLevel < zRender.zoomNote) {
			return true;
		} else {
			return false;
		}
	}
	addSpot(mngmnt: FocusManagement) {
		mngmnt.focusAnchor.content.push({ x: 0, y: 0, w: 1, h: 1, rx: 0.5, ry: 0.5, css: 'debug' });
	}
	spotUp(mngmnt: FocusManagement): boolean {
		console.log('note spotUp');
		return false;
	}
	spotDown(mngmnt: FocusManagement): boolean {
		console.log('note spotDown');
		return false;
	}
	spotLeft(mngmnt: FocusManagement): boolean {
		console.log('note spotLeft');
		return false;
	}
	spotRight(mngmnt: FocusManagement): boolean {
		console.log('note spotRight');
		return false;
	}
	moveSpotIntoView(mngmnt: FocusManagement) :void{
		
	}
}
