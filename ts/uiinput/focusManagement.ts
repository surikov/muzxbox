interface FocusLevel {
	isMatch(zoomLevel: number, zRender: ZRender): boolean;
	addSpot(mngmnt: FocusManagement): void;
	spotUp(mngmnt: FocusManagement): boolean;
	spotDown(mngmnt: FocusManagement): boolean;
	spotLeft(mngmnt: FocusManagement): boolean;
	spotRight(mngmnt: FocusManagement): boolean;
	moveSpotIntoView(mngmnt: FocusManagement): void;
	moveViewToShowSpot(mngmnt: FocusManagement) :void;
}




class FocusManagement {
	focusMarkerLayer: SVGElement;
	focusAnchor: TileAnchor;
	focusLayer: TileLayerDefinition;
	levelOfDetails: number = 0;
	muzXBox: MuzXBox;
	focusLevels: FocusLevel[] = [
		new FocusZoomSong()
		, new FocusZoomMeasure()
		, new FocusZoomNote()
		, new FocusZoomFar()
		, new FocusZoomBig()
	];
	attachFocus(bx: MuzXBox, zRender: ZRender) {
		//console.log('attachFocus');
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
	clearFocusAnchorsContent(zRender: ZRender, wholeWidth: number): void {
		let anchors: TileAnchor[] = [
			this.focusAnchor
		];

		for (let i = 0; i < anchors.length; i++) {
			zRender.clearResizeSingleAnchor(anchors[i], wholeWidth);
		}

		//console.log('wholeWidth',wholeWidth);

	}
	currentFocusLevelX(): FocusLevel {
		for (let i = 0; i < this.focusLevels.length; i++) {
			if (this.focusLevels[i].isMatch(this.muzXBox.zrenderer.tileLevel.translateZ, this.muzXBox.zrenderer)) {
				return this.focusLevels[i];
			}
		}
		return this.focusLevels[this.focusLevels.length - 1];
	}

	reSetFocus(zrenderer: ZRender, wholeWidth: number) {
		//console.log('reSetFocus',wholeWidth);
		zrenderer.tileLevel.resetAnchor(this.focusAnchor, this.focusMarkerLayer);
		zrenderer.clearResizeSingleAnchor(this.focusAnchor, wholeWidth);
		this.currentFocusLevelX().addSpot(this);
		zrenderer.tileLevel.allTilesOK = false;
	}
	resetSpotPosition() {
		this.currentFocusLevelX().moveSpotIntoView(this);
	}
	spotUp() {
		if (this.currentFocusLevelX().spotUp(this)) {
			this.currentFocusLevelX().moveViewToShowSpot(this);
			this.reSetFocus(this.muzXBox.zrenderer, gridWidthTp(this.muzXBox.currentSchedule, this.muzXBox.zrenderer.secondWidthInTaps));
		} else {
			this.wrongActionWarning();
		}
	}
	spotDown() {
		if (this.currentFocusLevelX().spotDown(this)) {
			this.currentFocusLevelX().moveViewToShowSpot(this);
			this.reSetFocus(this.muzXBox.zrenderer, gridWidthTp(this.muzXBox.currentSchedule, this.muzXBox.zrenderer.secondWidthInTaps));
		} else {
			this.wrongActionWarning();
		}
	}
	spotLeft() {
		if (this.currentFocusLevelX().spotLeft(this)) {
			this.currentFocusLevelX().moveViewToShowSpot(this);
			this.reSetFocus(this.muzXBox.zrenderer, gridWidthTp(this.muzXBox.currentSchedule, this.muzXBox.zrenderer.secondWidthInTaps));
		} else {
			this.wrongActionWarning();
		}
	}
	spotRight() {
		if (this.currentFocusLevelX().spotRight(this)) {
			this.currentFocusLevelX().moveViewToShowSpot(this);
			this.reSetFocus(this.muzXBox.zrenderer, gridWidthTp(this.muzXBox.currentSchedule, this.muzXBox.zrenderer.secondWidthInTaps));
		} else {
			this.wrongActionWarning();
		}
	}
	/*spotReset() {
		console.log('spotReset');
	}*/
	spotSelectA() {
		console.log('spotSelectA');
	}
	spotPlus() {
		//console.log('spotPlus');
		let zoom: number = this.muzXBox.zrenderer.tileLevel.translateZ
			- this.muzXBox.zrenderer.tileLevel.translateZ * 0.25;
		this.changeZoomTo(zoom);
	}
	spotMinus() {
		//console.log('spotMinus');
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
		var oldLOD=this.muzXBox.zrenderer.zToLOD(this.muzXBox.zrenderer.tileLevel.translateZ);
		this.muzXBox.zrenderer.tileLevel.translateZ = zoom;
		var newLOD=this.muzXBox.zrenderer.zToLOD(this.muzXBox.zrenderer.tileLevel.translateZ);

		//this.currentFocusLevelX().moveViewToShowSpot(this);

		this.muzXBox.zrenderer.tileLevel.applyZoomPosition();
		this.muzXBox.zrenderer.tileLevel.adjustContentPosition();

		console.log('moveViewToShowSpot');

		if(oldLOD!=newLOD){
			this.currentFocusLevelX().moveSpotIntoView(this);
		}
		
		this.currentFocusLevelX().moveViewToShowSpot(this);
		this.muzXBox.zrenderer.tileLevel.allTilesOK = false;
	}
	wrongActionWarning(): void {
		console.log('wrongActionWarning');
	}
}
