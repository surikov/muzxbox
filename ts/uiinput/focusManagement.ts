interface FocusLevel {
	isMatch(zoomLevel: number, zRender: ZRender): boolean;
	addSpot(mngmnt: FocusManagement): void;
	spotUp(mngmnt: FocusManagement): void;
	spotDown(mngmnt: FocusManagement): void;
	spotLeft(mngmnt: FocusManagement): void;
	spotRight(mngmnt: FocusManagement): void;
}
class FocusOtherLevel implements FocusLevel {
	isMatch(zoomLevel: number, zRender: ZRender): boolean {
		return true;
	}
	addSpot(mngmnt: FocusManagement) {
		//
	}
	spotUp(mngmnt: FocusManagement) {
		console.log('other spotUp');
	}
	spotDown(mngmnt: FocusManagement) {
		console.log('other spotDown');
	}
	spotLeft(mngmnt: FocusManagement) {
		console.log('other spotLeft');
	}
	spotRight(mngmnt: FocusManagement) {
		console.log('other spotRight');
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
	spotUp(mngmnt: FocusManagement) {
		console.log('note spotUp');
	}
	spotDown(mngmnt: FocusManagement) {
		console.log('note spotDown');
	}
	spotLeft(mngmnt: FocusManagement) {
		console.log('note spotLeft');
	}
	spotRight(mngmnt: FocusManagement) {
		console.log('note spotRight');
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
		var r = mngmnt.muzXBox.zrenderer.ratioThickness;
		let defrhy: ZvoogMeter[] = [
			{ count: 1, division: 8 }, { count: 1, division: 8 }
			, { count: 1, division: 8 }, { count: 1, division: 8 }

		];
		var rhythmPattern: ZvoogMeter[] = mngmnt.muzXBox.currentSchedule.rhythm ? mngmnt.muzXBox.currentSchedule.rhythm : defrhy;
		let xx = mngmnt.muzXBox.zrenderer.ratioDuration * measuresAndStepDuration(mngmnt.muzXBox.currentSchedule, this.currentMeasure, this.currentStep, rhythmPattern);
		mngmnt.focusAnchor.content.push({ x: xx, y: 0, w: r, h: r, rx: 0, ry: 0, css: 'debug' });
	}
	spotUp(mngmnt: FocusManagement) {
		console.log('measure spotUp');
	}
	spotDown(mngmnt: FocusManagement) {
		console.log('measure spotDown');
	}
	spotLeft(mngmnt: FocusManagement) {
		console.log('measure spotLeft');
	}
	spotRight(mngmnt: FocusManagement) {
		console.log('measure spotRight'
			, mngmnt.muzXBox.zrenderer.tileLevel.translateX, mngmnt.muzXBox.zrenderer.tileLevel.translateY, mngmnt.muzXBox.zrenderer.tileLevel.translateZ
		);


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
	spotUp() {
		console.log('song spotUp');
	}
	spotDown() {
		console.log('song spotDown');
	}
	spotLeft() {
		console.log('song spotLeft');
	}
	spotRight() {
		console.log('song spotRight');
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
		this.currentFocusLevelX().spotUp(this);
	}
	spotDown() {
		this.currentFocusLevelX().spotDown(this);
	}
	spotLeft() {
		this.currentFocusLevelX().spotLeft(this);
	}
	spotRight() {
		this.currentFocusLevelX().spotRight(this);
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
}
