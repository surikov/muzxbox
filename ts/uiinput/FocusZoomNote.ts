class FocusZoomNote implements FocusLevel {
	xxPoint = 10;
	yyPoint = 20;
	isMatch(zoomLevel: number, zRender: ZRender): boolean {
		if (zoomLevel < zRender.zoomNote) {
			return true;
		} else {
			return false;
		}
	}
	addSpot(mngmnt: FocusManagement) {
		mngmnt.focusAnchor.content.push({ x: this.xxPoint, y: this.yyPoint, w: 1, h: 1, rx: 0.25, ry: 0.25, css: 'actionSpot1' });
	}
	spotUp(mngmnt: FocusManagement): boolean {
		if (this.yyPoint > 0) {
			this.yyPoint--;
			return true;
		} else {
			return false;
		}
	}
	spotDown(mngmnt: FocusManagement): boolean {
		let hh = wholeHeightTp(mngmnt.muzXBox.zrenderer.pitchLineThicknessInTaps);
		if (this.yyPoint < hh - 1) {
			this.yyPoint++;
			return true;
		} else {
			return false;
		}
	}
	spotLeft(mngmnt: FocusManagement): boolean {
		if (this.xxPoint > 0) {
			this.xxPoint--;
			return true;
		} else {
			return false;
		}
	}
	spotRight(mngmnt: FocusManagement): boolean {
		let ww = wholeWidthTp(mngmnt.muzXBox.currentSchedule, mngmnt.muzXBox.zrenderer.secondWidthInTaps);
		if (this.xxPoint < ww - 1) {
			this.xxPoint++;
			return true;
		} else {
			return false;
		}
	}
	moveSpotIntoView(mngmnt: FocusManagement): void {
		let tp = mngmnt.muzXBox.zrenderer.tileLevel.tapSize;

		let tz = mngmnt.muzXBox.zrenderer.tileLevel.translateZ;
		let tx = mngmnt.muzXBox.zrenderer.tileLevel.translateX / tz;
		let ty = mngmnt.muzXBox.zrenderer.tileLevel.translateY / tz;

		let vw = mngmnt.muzXBox.zrenderer.tileLevel.viewWidth;
		let vh = mngmnt.muzXBox.zrenderer.tileLevel.viewHeight;

		let ih = mngmnt.muzXBox.zrenderer.tileLevel.innerHeight / tz;
		let iw = mngmnt.muzXBox.zrenderer.tileLevel.innerWidth / tz;

		let newY = ih / 2;
		if (vh < ih) {
			newY = vh / 2 - ty;
		}
		let newX = iw / 2;
		if (vw < iw) {
			newX = vw / 2 - tx;
		}

		newX=Math.round(tz*newX/tp);
		newY=Math.round(tz*newY/tp);

		this.xxPoint=newX;
		this.yyPoint=newY;
		
	}
	moveViewToShowSpot(mngmnt: FocusManagement): void {
		let xx = this.xxPoint;
		let yy = this.yyPoint;
		let tx = mngmnt.muzXBox.zrenderer.tileLevel.translateX / mngmnt.muzXBox.zrenderer.tileLevel.tapSize;
		let ty = mngmnt.muzXBox.zrenderer.tileLevel.translateY / mngmnt.muzXBox.zrenderer.tileLevel.tapSize;
		let tz = mngmnt.muzXBox.zrenderer.tileLevel.translateZ / mngmnt.muzXBox.zrenderer.tileLevel.tapSize
		let vw = mngmnt.muzXBox.zrenderer.tileLevel.viewWidth * tz;
		let vh = mngmnt.muzXBox.zrenderer.tileLevel.viewHeight * tz;
		if (xx + 1 > vw - tx) {//right
			mngmnt.muzXBox.zrenderer.tileLevel.translateX = (vw - xx - 1) * mngmnt.muzXBox.zrenderer.tileLevel.tapSize;
		}
		if (xx < -tx) {//left
			mngmnt.muzXBox.zrenderer.tileLevel.translateX = -xx * mngmnt.muzXBox.zrenderer.tileLevel.tapSize;
		}
		if (yy + 1 > vh - ty) {//down
			mngmnt.muzXBox.zrenderer.tileLevel.translateY = (vh - yy - 1) * mngmnt.muzXBox.zrenderer.tileLevel.tapSize;
		}
		if (yy < -ty) {//up
			mngmnt.muzXBox.zrenderer.tileLevel.translateY = -yy * mngmnt.muzXBox.zrenderer.tileLevel.tapSize;
		}
		mngmnt.muzXBox.zrenderer.tileLevel.applyZoomPosition();
	}
}
