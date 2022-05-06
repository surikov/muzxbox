interface FocusLevel {
	isMatch(zoomLevel: number, zRender: ZRender): boolean;
	addSpot(mngmnt: FocusManagement): void;
	spotUp(mngmnt: FocusManagement): boolean;
	spotDown(mngmnt: FocusManagement): boolean;
	spotLeft(mngmnt: FocusManagement): boolean;
	spotRight(mngmnt: FocusManagement): boolean;
}
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
}
class FocusZoomMeasure implements FocusLevel {
	currentPitch: number = 3;
	currentMeasure: number = 2;
	currentStep: number = 5;
	isMatch(zoomLevel: number, zRender: ZRender): boolean {
		if (zoomLevel >= zRender.zoomNote && zoomLevel < zRender.zoomMeasure) {
			return true;
		} else {
			return false;
		}
	}
	addSpot(mngmnt: FocusManagement) {
		//var rr = mngmnt.muzXBox.zrenderer.ratioThickness;
		let defrhy: ZvoogMeter[] = [
			{ count: 1, division: 8 }, { count: 1, division: 8 }
			, { count: 1, division: 8 }, { count: 1, division: 8 }

		];
		var rhythmPattern: ZvoogMeter[] = mngmnt.muzXBox.currentSchedule.rhythm ? mngmnt.muzXBox.currentSchedule.rhythm : defrhy;
		let measuresAndStep = measuresAndStepDuration(mngmnt.muzXBox.currentSchedule, this.currentMeasure, this.currentStep, rhythmPattern);
		let xx = mngmnt.muzXBox.zrenderer.ratioDuration * measuresAndStep.start;
		let ww = mngmnt.muzXBox.zrenderer.ratioDuration * measuresAndStep.duration;
		let hh = mngmnt.muzXBox.zrenderer.ratioThickness;
		let yy = (127 - this.currentPitch) * mngmnt.muzXBox.zrenderer.ratioThickness;
		mngmnt.focusAnchor.content.push({ x: xx, y: yy, w: ww, h: hh, rx: 0, ry: 0, css: 'debug' });
	}
	spotUp(mngmnt: FocusManagement): boolean {
		if (this.currentPitch < 127) {
			this.currentPitch++;
			mngmnt.reSetFocus(mngmnt.muzXBox.zrenderer, scheduleDuration(mngmnt.muzXBox.currentSchedule));
			return true;
		} else {
			return false;
		}
	}
	spotDown(mngmnt: FocusManagement): boolean {
		if (this.currentPitch > 0) {
			this.currentPitch--;
			mngmnt.reSetFocus(mngmnt.muzXBox.zrenderer, scheduleDuration(mngmnt.muzXBox.currentSchedule));
			return true;
		} else {
			return false;
		}
	}
	spotLeft(mngmnt: FocusManagement): boolean {
		console.log('measure spotLeft');
		return true;
	}
	spotRight(mngmnt: FocusManagement): boolean {
		console.log('measure spotRight'
			, mngmnt.muzXBox.zrenderer.tileLevel.translateX, mngmnt.muzXBox.zrenderer.tileLevel.translateY, mngmnt.muzXBox.zrenderer.tileLevel.translateZ
		);
		return true;

	}
}
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
}
class FocusManagement {
	focusMarkerLayer: SVGElement;
	focusAnchor: TileAnchor;
	focusLayer: TileLayerDefinition;
	levelOfDetails: number = 0;
	muzXBox: MuzXBox;
	focusLevels: FocusLevel[] = [new FocusZoomSong(), new FocusZoomMeasure(), new FocusZoomNote(), new FocusOtherLevel()];
	attachFocus(bx: MuzXBox, zRender: ZRender) {
		console.log('attachFocus');
		this.muzXBox = bx;
		this.focusMarkerLayer = (document.getElementById('focusMarkerLayer') as any) as SVGElement;
		this.focusAnchor = TAnchor(0, 0, 1111, 1111, zRender.zoomMin, zRender.zoomMax + 1);
		this.focusLayer = {
			g: this.focusMarkerLayer, anchors: [
				this.focusAnchor
			]
		};
		zRender.layers.push(this.focusLayer);
	}
	clearAnchorsContent(zRender: ZRender, songDuration: number): void {
		let anchors: TileAnchor[] = [
			this.focusAnchor
		];

		for (let i = 0; i < anchors.length; i++) {
			zRender.clearResizeSingleAnchor(anchors[i], songDuration);
		}

	}
	currentFocusLevelX(): FocusLevel {
		for (let i = 0; i < this.focusLevels.length; i++) {
			if (this.focusLevels[i].isMatch(this.muzXBox.zrenderer.tileLevel.translateZ, this.muzXBox.zrenderer)) {
				return this.focusLevels[i];
			}
		}
		return this.focusLevels[this.focusLevels.length - 1];
	}

	reSetFocus(zrenderer: ZRender, songDuration: number) {
		console.log('reSetFocus');
		zrenderer.tileLevel.resetAnchor(this.focusAnchor, this.focusMarkerLayer);
		zrenderer.clearResizeSingleAnchor(this.focusAnchor, songDuration);
		this.currentFocusLevelX().addSpot(this);
		zrenderer.tileLevel.allTilesOK = false;
	}
	spotUp() {
		if (!this.currentFocusLevelX().spotUp(this)) this.wrongActionWarning();
	}
	spotDown() {
		if (!this.currentFocusLevelX().spotDown(this)) this.wrongActionWarning();
	}
	spotLeft() {
		if (!this.currentFocusLevelX().spotLeft(this)) this.wrongActionWarning();
	}
	spotRight() {
		if (!this.currentFocusLevelX().spotRight(this)) this.wrongActionWarning();
	}
	/*spotReset() {
		console.log('spotReset');
	}*/
	spotSelectA() {
		console.log('spotSelectA');
	}
	spotPlus() {
		console.log('spotPlus');
		let zoom: number = this.muzXBox.zrenderer.tileLevel.translateZ
			- this.muzXBox.zrenderer.tileLevel.translateZ * 0.25;
		this.changeZoomTo(zoom);
	}
	spotMinus() {
		console.log('spotMinus');
		let zoom: number = this.muzXBox.zrenderer.tileLevel.translateZ
			+ this.muzXBox.zrenderer.tileLevel.translateZ * 0.25;
		this.changeZoomTo(zoom);
	}

	changePositionTo(xx: number, yy: number) {
		//console.log(this.muzXBox.zrenderer.tileLevel.translateX, xx, this.muzXBox.zrenderer.tileLevel.translateY, yy);
		this.muzXBox.zrenderer.tileLevel.translateX = xx;
		this.muzXBox.zrenderer.tileLevel.translateY = yy;
		this.muzXBox.zrenderer.tileLevel.applyZoomPosition();
		this.muzXBox.zrenderer.tileLevel.onMove(xx, yy);
		//this.slideToContentPosition();
		let a = this.muzXBox.zrenderer.tileLevel.calculateValidContentPosition();
		//console.log(a,this.translateX,this.translateY,this.translateZ);
		if (a.x != this.muzXBox.zrenderer.tileLevel.translateX
			|| a.y != this.muzXBox.zrenderer.tileLevel.translateY
			|| a.z != this.muzXBox.zrenderer.tileLevel.translateZ) {
			this.muzXBox.zrenderer.tileLevel.translateX = a.x;
			this.muzXBox.zrenderer.tileLevel.translateY = a.y;
		}
		this.muzXBox.zrenderer.tileLevel.allTilesOK = false;
	}
	changeZoomTo(zoom: number) {
		if (zoom < this.muzXBox.zrenderer.tileLevel.minZoom()) {
			zoom = this.muzXBox.zrenderer.tileLevel.minZoom();
		}
		if (zoom > this.muzXBox.zrenderer.tileLevel.maxZoom()) {
			zoom = this.muzXBox.zrenderer.tileLevel.maxZoom();
		}
		//console.log('zoom', this.muzXBox.zrenderer.tileLevel.translateZ, zoom);
		this.muzXBox.zrenderer.tileLevel.translateZ = zoom;
		this.muzXBox.zrenderer.tileLevel.applyZoomPosition();
		this.muzXBox.zrenderer.tileLevel.adjustContentPosition();
		this.muzXBox.zrenderer.tileLevel.allTilesOK = false;
	}
	wrongActionWarning(): void {
		console.log('wrongActionWarning');
	}
}
