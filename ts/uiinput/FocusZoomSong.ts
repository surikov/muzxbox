class FocusZoomSong implements FocusLevel {
	isMatch(zoomLevel: number, zRender: ZRender): boolean {
		if (zoomLevel >= zRender.zoomMeasure && zoomLevel < zRender.zoomSong) {
			return true;
		} else {
			return false;
		}
	}
	addSpot(mngmnt: FocusManagement) {
		var r = mngmnt.muzXBox.zrenderer.ratioThickness;
		mngmnt.focusAnchor.content.push({ x: 0, y: 0, w: r * 127, h: r * 127, rx: 0, ry: 0, css: 'debug' });
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
	moveSpotIntoView(mngmnt: FocusManagement) :void{
		
	}
}
