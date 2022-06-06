class FocusZoomNote implements FocusLevel {
	isMatch(zoomLevel: number, zRender: ZRender): boolean {
		if (zoomLevel < zRender.zoomNote) {
			return true;
		} else {
			return false;
		}
	}
	addSpot(mngmnt: FocusManagement) {
		//console.log('addSpot');
		this.dumpSpots();
		mngmnt.focusAnchor.content.push({ x: 0, y: 0, w: 1, h: 1, rx: 0.5, ry: 0.5, css: 'actionPointNote' });
	}
	spotUp(mngmnt: FocusManagement): boolean {
		//console.log('note spotUp');
		this.dumpSpots();
		return false;
	}
	spotDown(mngmnt: FocusManagement): boolean {
		//console.log('note spotDown');
		this.dumpSpots();
		return false;
	}
	spotLeft(mngmnt: FocusManagement): boolean {
		//console.log('note spotLeft');
		this.dumpSpots();
		return false;
	}
	spotRight(mngmnt: FocusManagement): boolean {
		//console.log('note spotRight');
		this.dumpSpots();
		return false;
	}
	moveSpotIntoView(mngmnt: FocusManagement) :void{
		//console.log('moveSpotIntoView');
		this.dumpSpots();
	}
	dumpSpots(){
		//console.log('dumpSpots');

	}
	moveViewToShowSpot(mngmnt: FocusManagement): void {

	}
}
