console.log('tilelevel v2.17');

class TileLevel {
	svg: SVGElement;
	tapSize: number = 50;
	twoZoom: boolean = false;
	clickLimit: number = this.tapSize / 6;
	svgns: string = "http://www.w3.org/2000/svg";
	viewWidth: number = 0;
	viewHeight: number = 0;
	innerWidth: number = 0;
	innerHeight: number = 0;
	_translateX: number = 0;
	_translateY: number = 0;
	_translateZ: number = 1;
	startMouseScreenX: number = 0;
	startMouseScreenY: number = 0;
	clickX: number = 0;
	clickY: number = 0;
	dragZoom: number = 1;
	_allTilesOK: boolean = false;
	clicked: boolean = false;
	mx: number = 100;
	mn: number = 1;
	startedTouch: boolean = false;
	twodistance: number = 0;
	twocenter: TilePoint;
	model: TileModelLayer[] = [];
	slidingLockTo: number = 0;
	slidingID: number = 0;
	onResizeDo: CannyDo = new CannyDo();
	onZoom: CannyDo = new CannyDo();
	afterZoomCallback: () => void;
	afterResizeCallback: () => void;

	lastTickTime: number = 0;

	fastenUp: boolean = true;
	fastenDown: boolean = true;
	fastenLeft: boolean = true;
	fastenRight: boolean = true;

	lastMoveDx: number = 0;
	lastMoveDy: number = 0;
	lastMoveDt: number = 0;
	//onMoveStop: CannyDo = new CannyDo();
	dragTileItem: TileItem | null = null;
	dragTileSVGelement: TileSVGElement | null = null;
	dragSVGparent: SVGElement | null = null;
	draggedX: number = 0;
	draggedY: number = 0;
	dragTranslateX: number = 0;
	dragTranslateY: number = 0;

	mouseDownMode: boolean = false;

	get allTilesOK(): boolean {
		return this._allTilesOK;
	}
	set allTilesOK(bb: boolean) {
		if (bb != this._allTilesOK) {
			//console.log('allTilesOK',bb);
			this._allTilesOK = bb;
		}
	}

	get translateZ(): number {
		return this._translateZ;
	}
	set translateZ(z: number) {
		if (z != this._translateZ) {
			//console.log('z',this._translateZ,'=>',z);
			this._translateZ = z;
		}

	}
	get translateX(): number {
		return this._translateX;
	}
	set translateX(x: number) {
		if (x != this._translateX) {
			//console.trace('x',this._translateX,'=>',x);
			this._translateX = x;
		}

	}
	get translateY(): number {
		return this._translateY;
	}
	set translateY(y: number) {
		if (y != this._translateY) {
			//console.log('y',this._translateY,'=>',y);
			this._translateY = y;
		}

	}

	constructor(svgObject: SVGElement, inWidth: number, inHeight: number, minZoom: number, curZoom: number, maxZoom: number, layers: TileModelLayer[]) {
		//console.trace('TileLevel',layers);
		//this = this;
		this.svg = svgObject;
		this.setupTapSize();

		this.viewWidth = this.svg.clientWidth;
		this.viewHeight = this.svg.clientHeight;
		//this.innerWidth = this.viewWidth;
		//this.innerHeight = this.viewHeight;
		this.innerWidth = inWidth * this.tapSize;
		this.innerHeight = inHeight * this.tapSize;
		this.mx = maxZoom;
		this.mn = minZoom;
		this.translateZ = curZoom;

		this.svg.addEventListener("wheel", this.rakeMouseWheel.bind(this), { capture: false, passive: false });
		this.svg.addEventListener("touchstart", this.rakeTouchStart.bind(this), { capture: true, passive: false });
		this.svg.addEventListener("touchmove", this.rakeTouchMove.bind(this), { capture: true, passive: false });
		this.svg.addEventListener("touchend", this.rakeTouchEnd.bind(this), { capture: true, passive: false });
		this.svg.addEventListener('mousedown', this.rakeMouseDown.bind(this), { capture: false, passive: false });
		this.svg.addEventListener('mousemove', this.rakeMouseMove.bind(this), { capture: false, passive: false });
		this.svg.addEventListener('mouseup', this.rakeMouseUp.bind(this), { capture: false, passive: false });
		window.addEventListener('resize', this.onAfterResize.bind(this));

		this.setModel(layers);
		this.startLoop();
		this.applyZoomPosition();
		this.clearUselessDetails();
	}
	dump() {
		console.log('dump', this);
	}
	/*
	start(layers: TileModelLayer[]){//layers: TileModelLayer[], innerWidth: number, innerHeight: number, minZoom: number, curZoom: number, maxZoom: number) {
		this.setModel(layers);
		this.startLoop();
		//this.innerWidth = innerWidth;
		//this.innerHeight = innerHeight;
		//this.mx = maxZoom;
		//this.mn = minZoom;
		//this.translateZ = curZoom;
		this.applyZoomPosition();
		this.clearUselessDetails();
		//console.log('start', this);
	}*/
	setupTapSize() {
		let rect: Element = document.createElementNS(this.svgns, 'rect');
		rect.setAttributeNS(null, 'height', '1cm');
		rect.setAttributeNS(null, 'width', '1cm');
		this.svg.appendChild(rect);
		let tbb: DOMRect = (rect as SVGSVGElement).getBBox();
		this.tapSize = tbb.width;
		this.svg.removeChild(rect);
		this.clickLimit = this.tapSize / 6;
	}
	onAfterResize() {
		this.onResizeDo.start(333, function () {
			//console.log('resized', this);
			this.viewWidth = this.svg.clientWidth;
			this.viewHeight = this.svg.clientHeight;
			//this.resetModel();
			if (this.afterResizeCallback) { this.afterResizeCallback(); }
			this.applyZoomPosition();
			this.adjustContentPosition();
			this.slideToContentPosition();
		}.bind(this));
	}
	onMove(dx: number, dy: number) {
		var d = new Date();
		//console.log('onMove speed', d, d.getMilliseconds(), dx, dy, Math.sqrt(dx * dx + dy * dy));
		this.lastMoveDx = dx;
		this.lastMoveDy = dy;
		this.lastMoveDt = Date.now();
		/*var me=this;
		this.onMoveStop.start(100, function () {
			me.moveTail();
		}.bind(this));*/
	}
	moveTail(speed: number) {
		//if(speed>1){
		//var speed = Math.sqrt(this.lastMoveDx * this.lastMoveDx + this.lastMoveDy * this.lastMoveDy) / (Date.now() - this.lastMoveDt)
		var dx = this.translateX + 2 * this.tapSize * speed * this.lastMoveDx;
		var dy = this.translateY + 2 * this.tapSize * speed * this.lastMoveDy;
		//console.log('moveTail', speed, 'from', this.translateX, this.translateY, 'to', dx, dy);//Math.sqrt(this.lastMoveDx * this.lastMoveDx + this.lastMoveDy * this.lastMoveDy) / (Date.now() - this.lastMoveDt));
		//this.cancelDragZoom();
		//this.slideToContentPosition();
		//this.allTilesOK = false;
		//var me=this;
		this.startSlideTo(dx, dy, this.translateZ, function () {
			//console.log('done',this.translateX,this.translateY,this.translateZ);
		}.bind(this));
		//}
	}
	rakeMouseWheel(e: WheelEvent) {
		//console.log('wheel',this.translateX,this.translateY,this.translateZ);
		//console.log('rakeMouseWheel',e);
		this.slidingLockTo = -1;
		//console.log('rakeMouseWheel',e.wheelDelta,e.detail,e.deltaX,e.deltaY,e.deltaZ,e);
		e.preventDefault();
		//let wheelVal = e.wheelDelta || -e.detail;
		let wheelVal: number = e.deltaY;
		let min: number = Math.min(1, wheelVal);
		let delta: number = Math.max(-1, min);
		let zoom: number = this.translateZ - delta * (this.translateZ) * 0.077;
		if (zoom < this.minZoom()) {
			zoom = this.minZoom();
		}
		if (zoom > this.maxZoom()) {
			zoom = this.maxZoom();
		}
		/*console.log('wheel'
			, 'x', this.translateX, this.translateX - (this.translateZ - zoom) * e.offsetX
			, 'y', this.translateY, this.translateY - (this.translateZ - zoom) * e.offsetY
			, 'z', this.translateZ, this.translateZ - delta * (this.translateZ) * 0.077, this.minZoom(), this.maxZoom()
			, 'e', e.offsetX, e.offsetY
			,new Date().getTime());*/
		this.translateX = this.translateX - (this.translateZ - zoom) * e.offsetX;
		this.translateY = this.translateY - (this.translateZ - zoom) * e.offsetY;
		this.translateZ = zoom;
		//console.log('wheel',this.translateX,this.translateY,this.translateZ,e.offsetX,e.offsetY);
		this.applyZoomPosition();
		this.adjustContentPosition();
		this.allTilesOK = false;
		//console.log('done wheel', this.translateX, this.translateY, this.translateZ);
		return false;
	}
	rakeMouseDown(mouseEvent: MouseEvent) {
		this.slidingLockTo = -1;
		//console.log('rakeMouseDown',mouseEvent);
		mouseEvent.preventDefault();
		//this.svg.addEventListener('mousemove', this.rakeMouseMove.bind(this), true);
		//this.svg.addEventListener('mouseup', this.rakeMouseUp.bind(this), false);
		this.startMouseScreenX = mouseEvent.offsetX;
		this.startMouseScreenY = mouseEvent.offsetY;
		if (this.dragTileItem) {
			//console.log('rakeMouseDown',this.dragElement);
		} else {
			this.mouseDownMode = true;

			this.clickX = this.startMouseScreenX;
			this.clickY = this.startMouseScreenY;
			this.clicked = false;
			this.startDragZoom();
		}
	}
	rakeMouseMove(mouseEvent: MouseEvent) {
		//console.log('rakeMouseMove',mouseEvent);
		let dX: number = mouseEvent.offsetX - this.startMouseScreenX;
		let dY: number = mouseEvent.offsetY - this.startMouseScreenY;
		this.startMouseScreenX = mouseEvent.offsetX;
		this.startMouseScreenY = mouseEvent.offsetY;
		if (this.mouseDownMode) {
			mouseEvent.preventDefault();
			//let dX: number = mouseEvent.offsetX - this.startMouseScreenX;
			//let dY: number = mouseEvent.offsetY - this.startMouseScreenY;
			this.translateX = this.translateX + dX * this.translateZ;
			this.translateY = this.translateY + dY * this.translateZ;
			//this.startMouseScreenX = mouseEvent.offsetX;
			//this.startMouseScreenY = mouseEvent.offsetY;
			this.applyZoomPosition();
			this.onMove(dX, dY);
		} else {
			if (this.dragTileItem) {
				if (this.dragTileSVGelement) {
					//let sx = this.dragSVGelement.getAttribute('x');
					//if (sx) {
					//	let ex: number = parseFloat(sx);
					//	let sy = this.dragSVGelement.getAttribute('y');
					//	if (sy) {
					//		let ey: number = parseFloat(sy);
					//		ex = ex + dX * this.translateZ;
					//		ey = ey + dY * this.translateZ;
					let ex = this.dragTranslateX + dX * this.translateZ;
					let ey = this.dragTranslateY + dY * this.translateZ;
					if (!(this.dragTileItem.dragX)) ex = 0;
					if (!(this.dragTileItem.dragY)) ey = 0;
					this.draggedX = this.draggedX + dX;
					this.draggedY = this.draggedY + dY;
					//this.dragSVGelement.setAttributeNS(null, 'x', '' + ex);
					//this.dragSVGelement.setAttributeNS(null, 'y', '' + ey);
					//console.log(dX,dY,ex,ey);
					if (this.dragSVGparent) this.dragSVGparent.setAttributeNS(null, 'transform', 'translate(' + ex + ', ' + ey + ')');
					this.dragTranslateX = ex;
					this.dragTranslateY = ey;
					//transform="translate(100, 100)"
					//	}
					//}
				}
			}
		}
	}
	rakeMouseUp(mouseEvent: MouseEvent) {
		//console.log('rakeMouseUp',mouseEvent);

		if (this.mouseDownMode) {
			this.mouseDownMode = false;
			mouseEvent.preventDefault();
			//this.svg.removeEventListener('mousemove', this.rakeMouseMove, true);
			//this.svg.removeEventListener('mousemove', this.rakeMouseMove.bind(this));
			this.cancelDragZoom();
			this.clicked = false;
			let diffX = Math.abs(this.clickX - this.startMouseScreenX);
			let diffY = Math.abs(this.clickY - this.startMouseScreenY);
			//if (Math.abs(this.clickX - this.startMouseScreenX) < this.translateZ * this.clickLimit //
			//	&&
			//	Math.abs(this.clickY - this.startMouseScreenY) < this.translateZ * this.clickLimit) {
			if (diffX < this.clickLimit && diffY < this.clickLimit) {
				//if (Math.abs(this.clickX - mouseEvent.offsetX) < this.clickLimit //
				//	&&
				//	Math.abs(this.clickY - mouseEvent.offsetY) < this.clickLimit) {
				//console.log('rakeMouseUp');
				this.clicked = true;
				//this.cancelDragZoom();
				this.slideToContentPosition();
				this.allTilesOK = false;
			} else {
				//var speed = Math.sqrt(this.lastMoveDx * this.lastMoveDx + this.lastMoveDy * this.lastMoveDy) / (Date.now() - this.lastMoveDt);
				//if (speed > 1) {


				//this.moveTail(speed);

				//} else {
				//this.cancelDragZoom();
				this.slideToContentPosition();
				this.allTilesOK = false;
				//}
			}


		} else {
			if (this.dragTileItem) {
				//console.log('translateZ', this.translateZ, 'tapSize', this.tapSize, 'draggedX', this.draggedX, '=',this.draggedX*this.translateZ);
				//let diffX = this.clickX - this.startMouseScreenX;
				//let diffY = this.clickY - this.startMouseScreenY;
				//let rr: TileRectangle = this.dragTileItem as TileRectangle;
				//console.log('clickX', this.clickX, 'startMouseScreenX', this.startMouseScreenX);
				//console.log(rr.x, '+', diffX, 'x', rr.y, '+', diffY);
				//console.log(rr.x, 'x', rr.y);
				//rr.x = rr.x + this.draggedX * this.translateZ / this.tapSize;
				//rr.y = rr.y + this.draggedY * this.translateZ / this.tapSize;
				//console.log(rr.x, 'x', rr.y);
				this.clearAllDetails();
				this.applyZoomPosition();
				this.allTilesOK = false;
				if (this.dragTileSVGelement) {
					if (this.dragTileSVGelement.onClickFunction) {
						//console.log('this.dragSVGelement', this.dragSVGelement);
						//let xx: number = this.dragSVGelement.getBoundingClientRect().left - this.svg.getBoundingClientRect().left;
						//let yy: number = this.dragSVGelement.getBoundingClientRect().top - this.svg.getBoundingClientRect().top;
						//this.dragSVGelement.onClickFunction(this.translateZ * (this.clickX - xx) / this.tapSize, this.translateZ * (this.clickY - yy) / this.tapSize);
						this.dragTileSVGelement.onClickFunction(this.draggedX * this.translateZ / this.tapSize, this.draggedY * this.translateZ / this.tapSize);
					}
				}
				this.dragTileItem = null;
				this.dragTileSVGelement = null;
			}
		}
		this.dragTileItem = null;
	}
	rakeTouchStart(touchEvent: TouchEvent) {
		//console.log('rakeTouchStart',this.dragTileItem);
		this.slidingLockTo = -1;
		touchEvent.preventDefault();
		if (this.dragTileItem) {
			//console.log('rakeMouseDown',this.dragElement);
		} else {
			this.startedTouch = true;
			this.clicked = false;
			if (touchEvent.touches.length < 2) {
				this.twoZoom = false;
				this.startMouseScreenX = touchEvent.touches[0].clientX;
				this.startMouseScreenY = touchEvent.touches[0].clientY;
				this.clickX = this.startMouseScreenX;
				this.clickY = this.startMouseScreenY;
				this.twodistance = 0;
				this.startDragZoom();
				return;
			} else {
				this.startTouchZoom(touchEvent);
			}
		}
	}
	rakeTouchMove(touchEvent: TouchEvent) {
		//console.log('touchEvent',this.dragTileItem);
		touchEvent.preventDefault();
		if (this.startedTouch) {
			if (touchEvent.touches.length < 2) {
				if (this.twoZoom) {
					//
				} else {
					let dX: number = touchEvent.touches[0].clientX - this.startMouseScreenX;
					let dY: number = touchEvent.touches[0].clientY - this.startMouseScreenY;
					this.translateX = this.translateX + dX * this.translateZ;
					this.translateY = this.translateY + dY * this.translateZ;
					this.startMouseScreenX = touchEvent.touches[0].clientX;
					this.startMouseScreenY = touchEvent.touches[0].clientY;
					this.applyZoomPosition();
					this.onMove(dX, dY);
					return;
				}
			} else {
				if (!this.twoZoom) {
					this.startTouchZoom(touchEvent);
				} else {
					let p1: TilePoint = this.vectorFromTouch(touchEvent.touches[0]);
					let p2: TilePoint = this.vectorFromTouch(touchEvent.touches[1]);
					let d: number = this.vectorDistance(p1, p2);
					if (d <= 0) {
						d = 1;
					}
					let ratio: number = d / this.twodistance;
					this.twodistance = d;
					let zoom: number = this.translateZ / ratio;
					if (zoom < this.minZoom()) {
						zoom = this.minZoom();
					}
					if (zoom > this.maxZoom()) {
						zoom = this.maxZoom();
					}
					/*let cX:number = 0;
					let cY:number = 0;
					if (this.viewWidth * this.translateZ > this.innerWidth) {
						cX = (this.viewWidth - this.innerWidth / this.translateZ) / 2;
					}
					if (this.viewHeight * this.translateZ > this.innerHeight) {
						cY = (this.viewHeight - this.innerHeight / this.translateZ) / 2;
					}*/
					if (this.viewWidth * this.translateZ < this.innerWidth) {
						this.translateX = this.translateX - (this.translateZ - zoom) * (this.twocenter.x);
					}
					if (this.viewHeight * this.translateZ < this.innerHeight) {
						this.translateY = this.translateY - (this.translateZ - zoom) * (this.twocenter.y);
					}
					this.translateZ = zoom;
					this.dragZoom = 1.0;
					this.applyZoomPosition();
				}
			}
		} else {
			if (this.dragTileItem) {
				if (this.dragTileSVGelement) {
					//let sx = this.dragSVGelement.getAttribute('x');
					//if (sx) {
					//	let ex: number = parseFloat(sx);
					//	let sy = this.dragSVGelement.getAttribute('y');
					//	if (sy) {
					let dX: number = touchEvent.touches[0].clientX - this.startMouseScreenX;
					let dY: number = touchEvent.touches[0].clientY - this.startMouseScreenY;
					this.startMouseScreenX = touchEvent.touches[0].clientX;
					this.startMouseScreenY = touchEvent.touches[0].clientY;
					//		let ey: number = parseFloat(sy);
					//		ex = ex + dX * this.translateZ;
					//		ey = ey + dY * this.translateZ;
					let ex = this.dragTranslateX + dX * this.translateZ;
					let ey = this.dragTranslateY + dY * this.translateZ;
					if (!(this.dragTileItem.dragX)) ex = 0;
					if (!(this.dragTileItem.dragY)) ey = 0;
					this.draggedX = this.draggedX + dX;
					this.draggedY = this.draggedY + dY;
					//this.dragSVGelement.setAttributeNS(null, 'x', '' + ex);
					//this.dragSVGelement.setAttributeNS(null, 'y', '' + ey);
					if (this.dragSVGparent) this.dragSVGparent.setAttributeNS(null, 'transform', 'translate(' + ex + ', ' + ey + ')');
					this.dragTranslateX = ex;
					this.dragTranslateY = ey;
					//	}
					//}
				}
			}
		}
	}
	rakeTouchEnd(touchEvent: TouchEvent) {
		//console.log('rakeTouchEnd',touchEvent.touches.length);
		touchEvent.preventDefault();
		if (this.dragTileItem) {
			this.clearAllDetails();
			this.applyZoomPosition();
			this.allTilesOK = false;
			if (this.dragTileSVGelement) {
				if (this.dragTileSVGelement.onClickFunction) {
					this.dragTileSVGelement.onClickFunction(this.draggedX * this.translateZ / this.tapSize, this.draggedY * this.translateZ / this.tapSize);
				}
			}
			this.dragTileItem = null;
			this.dragTileSVGelement = null;
		} else {



			this.allTilesOK = false;
			if (!this.twoZoom) {
				if (touchEvent.touches.length < 2) {
					this.cancelDragZoom();
					this.clicked = false;
					if (this.startedTouch) {
						//let diffLimit = this.clickLimit;
						let diffX = Math.abs(this.clickX - this.startMouseScreenX);
						let diffY = Math.abs(this.clickY - this.startMouseScreenY);
						//if (Math.abs(this.clickX - this.startMouseScreenX) < this.translateZ * this.clickLimit //
						//	&&
						//	Math.abs(this.clickY - this.startMouseScreenY) < this.translateZ * this.clickLimit) {
						if (diffX < this.clickLimit && diffY < this.clickLimit) {
							//console.log('rakeTouchEnd');
							this.clicked = true;
							this.slideToContentPosition();
						} else {
							//var speed = Math.sqrt(this.lastMoveDx * this.lastMoveDx + this.lastMoveDy * this.lastMoveDy) / (Date.now() - this.lastMoveDt);
							//if (speed > 1) {
							//	this.moveTail(speed);
							//} else {
							this.clicked = false;
							this.slideToContentPosition();
							//}
						}
						//console.log('tap',this.clicked,diffX,diffY,diffLimit);
					} else {
						//console.log('touch ended already');
					}
					//this.cancelDragZoom();
					//this.slideToContentPosition();

					return;
				}
			}

			this.twoZoom = false;
			this.startedTouch = false;
			this.cancelDragZoom();
			this.slideToContentPosition();
		}
	}
	startDragZoom() {
		this.dragZoom = 1.002;
		this.applyZoomPosition();
	};
	cancelDragZoom() {
		this.dragZoom = 1.0;
		this.applyZoomPosition();
	};
	applyZoomPosition() {
		let rx: number = -this.translateX - this.dragZoom * this.translateZ * (this.viewWidth - this.viewWidth / this.dragZoom) * (this.clickX / this.viewWidth);
		let ry: number = -this.translateY - this.dragZoom * this.translateZ * (this.viewHeight - this.viewHeight / this.dragZoom) * (this.clickY / this.viewHeight);
		let rw: number = this.viewWidth * this.translateZ * this.dragZoom;
		let rh: number = this.viewHeight * this.translateZ * this.dragZoom;
		this.svg.setAttribute('viewBox', rx + ' ' + ry + ' ' + rw + ' ' + rh);
		if (this.model) {
			//console.log('applyZoomPosition',this.translateX,this.translateY,this.translateZ,this.tapSize);
			for (let k: number = 0; k < this.model.length; k++) {
				let layer: TileModelLayer = this.model[k];
				let tx: number = 0;
				let ty: number = 0;
				let tz: number = 1;
				let cX: number = 0;
				let cY: number = 0;
				let sX: number = 0;
				let sY: number = 0;
				if (this.viewWidth * this.translateZ > this.innerWidth) {
					cX = (this.viewWidth * this.translateZ - this.innerWidth) / 2;
				}
				if (this.viewHeight * this.translateZ > this.innerHeight) {
					cY = (this.viewHeight * this.translateZ - this.innerHeight) / 2;
				}
				if (isLayerOverlay(layer)) {
					tz = this.translateZ;
					tx = -this.translateX;
					ty = -this.translateY;
					cX = 0;
					cY = 0;
				} else {
					if (isLayerStickLeft(layer)) {
						tx = -this.translateX;
						cX = 0;
						if (layer.stickLeft) {
							sX = layer.stickLeft * this.tapSize * this.translateZ;
						}
					} else {
						if (isLayerStickTop(layer)) {
							ty = -this.translateY;
							cY = 0;
							if (layer.stickTop) {
								sY = layer.stickTop * this.tapSize * this.translateZ;
							}
						} else {
							if (isLayerStickBottom(layer)) {
								ty = -this.translateY;
								cY = 0;
								sY = this.viewHeight * this.translateZ;
								if (layer.stickBottom) {
									sY = this.viewHeight * this.translateZ - layer.stickBottom * this.tapSize;
								}
							} else {

								if (isLayerStickRight(layer)) {
									tx = -this.translateX;
									cX = 0;
									sX = this.viewWidth * this.translateZ;
									if (layer.stickRight) {
										sX = this.viewWidth * this.translateZ - layer.stickRight * this.tapSize;
									}
								}
							}
						}
					}
				}
				layer.g.setAttribute('transform', 'translate(' + (tx + cX + sX) + ',' + (ty + cY + sY) + ') scale(' + tz + ',' + tz + ')');
			}
			//console.log('done',this.translateX,this.translateY,this.translateZ);
		}
		this.checkAfterZoom();

	}
	checkAfterZoom() {
		//if (this.afterZoomCallback) {
		this.onZoom.start(555, function () {
			//console.log('afterZoom', this.afterZoomCallback);
			if (this.afterZoomCallback) this.afterZoomCallback();
		}.bind(this));
		//}
	}


	slideToContentPosition() {
		let a = this.calculateValidContentPosition();
		//console.log(a,this.translateX,this.translateY,this.translateZ);
		if (a.x != this.translateX || a.y != this.translateY || a.z != this.translateZ) {
			this.startSlideTo(a.x, a.y, a.z, null);
		}
	}
	maxZoom() {
		return this.mx;
	};
	minZoom() {
		return this.mn;
	};
	adjustContentPosition() {
		let a: TileZoom = this.calculateValidContentPosition();
		if (a.x != this.translateX || a.y != this.translateY || a.z != this.translateZ) {
			this.translateX = a.x;
			this.translateY = a.y;
			this.translateZ = a.z;
			this.applyZoomPosition();
			//console.log('adjustContentPosition',this.translateX,this.translateY,this.translateZ,this.tapSize);
		}
	}
	calculateValidContentPosition(): TileZoom {
		let vX: number = this.translateX;
		let vY: number = this.translateY;
		let vZ: number = this.translateZ;
		if (this.translateX > 0) {
			vX = 0;
		} else {
			if (this.viewWidth - this.translateX / this.translateZ > this.innerWidth / this.translateZ) {
				if (this.viewWidth * this.translateZ - this.innerWidth <= 0) {
					vX = this.viewWidth * this.translateZ - this.innerWidth;
				} else {
					vX = 0;
				}
			}
		}
		var upLimit: number = this.viewHeight * this.translateZ;
		if (this.fastenUp) {
			upLimit = 0;
		}
		if (this.translateY > upLimit) {
			vY = upLimit;
		} else {
			if (this.viewHeight - this.translateY / this.translateZ > this.innerHeight / this.translateZ) {
				if (this.viewHeight * this.translateZ - this.innerHeight <= 0) {
					vY = this.viewHeight * this.translateZ - this.innerHeight;
					//console.log('to border');
				} else {
					vY = 0;
					//console.log('to 0');
				}
			}
		}
		if (this.translateZ < this.minZoom()) {
			vZ = this.minZoom();
		} else {
			if (this.translateZ > this.maxZoom()) {
				vZ = this.maxZoom();
			}
		}
		//console.log(this.translateX,this.translateY,this.translateZ,vX,vY,vZ);
		return {
			x: vX,
			y: vY,
			z: vZ
		};
	}
	startTouchZoom(touchEvent: TouchEvent) {
		this.twoZoom = true;
		let p1: TilePoint = this.vectorFromTouch(touchEvent.touches[0]);
		let p2: TilePoint = this.vectorFromTouch(touchEvent.touches[1]);
		this.twocenter = this.vectorFindCenter(p1, p2);
		let d: number = this.vectorDistance(p1, p2);
		if (d <= 0) {
			d = 1;
		}
		this.twodistance = d;
	}
	vectorFromTouch(touch: Touch): TilePoint {
		return {
			x: touch.clientX,
			y: touch.clientY
		};
	}
	vectorFindCenter(xy1: TilePoint, xy2: TilePoint): TilePoint {
		let xy: TilePoint = this.vectorAdd(xy1, xy2);
		return this.vectorScale(xy, 0.5);
	};
	vectorAdd(xy1: TilePoint, xy2: TilePoint): TilePoint {
		return {
			x: xy1.x + xy2.x,
			y: xy1.y + xy2.y
		};
	};
	vectorScale(xy: TilePoint, coef: number): TilePoint {
		return {
			x: xy.x * coef,
			y: xy.y * coef
		};
	};
	vectorDistance(xy1: TilePoint, xy2: TilePoint): number {
		let xy: TilePoint = this.vectorSubstract(xy1, xy2);
		let n: number = this.vectorNorm(xy);
		return n;
	}
	vectorNorm(xy: TilePoint): number {
		return Math.sqrt(this.vectorNormSquared(xy));
	}
	vectorSubstract(xy1: TilePoint, xy2: TilePoint): TilePoint {
		return {
			x: xy1.x - xy2.x,
			y: xy1.y - xy2.y
		};
	}
	vectorNormSquared(xy: TilePoint): number {
		return xy.x * xy.x + xy.y * xy.y;
	}
	startSlideCenter(x: number, y: number, z: number, w: number, h: number, action: () => void) {
		let dx = (z * this.viewWidth / this.tapSize - w) / 2;
		let dy = (z * this.viewHeight / this.tapSize - h) / 2;
		this.startSlideTo((dx - x) * this.tapSize, (dy - y) * this.tapSize, z, action)
	}
	startSlideTo(x: number, y: number, z: number, action: (() => void) | null) {
		this.startStepSlideTo(20, x, y, z, action);
	}
	startStepSlideTo(s: number, x: number, y: number, z: number, action: (() => void) | null) {
		clearTimeout(this.slidingID);
		let stepCount: number = s;
		//let dx: number = (x - this.translateX) / stepCount;
		//let dy: number = (y - this.translateY) / stepCount;
		//let dz: number = (z - this.translateZ) / stepCount;
		let xyz: TileZoom[] = [];
		for (let i: number = 0; i < stepCount; i++) {
			/*xyz.push({
				x: this.translateX + dx * i,
				y: this.translateY + dy * i,
				z: this.translateZ + dz * i
			});*/
			xyz.push({
				x: this.translateX + (x - this.translateX) * Math.cos((Math.PI / 2) / (1 + i)),
				y: this.translateY + (y - this.translateY) * Math.cos((Math.PI / 2) / (1 + i)),
				z: this.translateZ + (z - this.translateZ) * Math.cos((Math.PI / 2) / (1 + i))
			});
			//console.log(i,xyz[xyz.length-1]);
		}
		xyz.push({
			x: x,
			y: y,
			z: z
		});

		this.slidingLockTo = Math.random();
		this.stepSlideTo(this.slidingLockTo, xyz, action);
		//console.log('start',new Date());
	}
	stepSlideTo(key: number, xyz: TileZoom[], action: (() => void) | null) {
		let n: TileZoom | undefined = xyz.shift();
		if (n) {
			if (key == this.slidingLockTo) {
				this.translateX = n.x;
				this.translateY = n.y;
				this.translateZ = n.z;
				this.applyZoomPosition();
				let main: TileLevel = this;
				this.slidingID = setTimeout(function () {
					main.stepSlideTo(key, xyz, action);
				}, 30);
			} else {
				//console.log('cancel slide');
			}
		} else {
			if (action) {
				action();
			}
			this.adjustContentPosition();
			this.allTilesOK = true;
			this.queueTiles();
			//console.log('done',new Date());
		}
	}
	queueTiles() {
		//console.log('queueTiles',this.translateX,this.translateY,this.translateZ,this.tapSize);
		this.clearUselessDetails();
		this.tileFromModel();
		//console.log('done queueTiles',this.translateX,this.translateY,this.translateZ,this.tapSize);
	}
	clearUselessDetails() {
		if (this.model) {
			for (let k = 0; k < this.model.length; k++) {
				let group: SVGElement = this.model[k].g;
				this.clearUselessGroups(group, this.model[k]);
			}
		}
	}
	clearUselessGroups(group: SVGElement, layer: TileLayerDefinition) {
		let x: number = -this.translateX;
		let y: number = -this.translateY;
		let w: number = this.svg.clientWidth * this.translateZ;
		let h: number = this.svg.clientHeight * this.translateZ;
		let cX: number = 0;
		let cY: number = 0;
		if (this.viewWidth * this.translateZ > this.innerWidth) {
			cX = (this.viewWidth * this.translateZ - this.innerWidth) / 2;
			x = x - cX;
		}
		if (this.viewHeight * this.translateZ > this.innerHeight) {
			cY = (this.viewHeight * this.translateZ - this.innerHeight) / 2;
			y = y - cY;
		}
		if (isLayerOverlay(layer)) {
			//if (kind == layerModeOverlay) {
			x = 0;
			y = 0;
		} else {
			if (isLayerStickLeft(layer)) {
				//if (kind == layerModeLockX) {
				x = 0;
			} else {
				if (isLayerStickTop(layer)) {
					//if (kind == layerModeLockY) {
					y = 0;
				} else {
					if (isLayerStickRight(layer)) {
						//if (kind == layerModeStickRight) {
						x = 0;
					} else {
						if (isLayerStickBottom(layer)) {
							//if (kind == layerModeStickBottom) {
							y = 0;
						}
					}
				}
			}
		}
		if (group) this.msEdgeHook(group);
		//console.log('this.translateZ',this.translateZ);
		for (let i: number = 0; i < group.children.length; i++) {
			let child: TileSVGElement = group.children[i] as TileSVGElement;
			//console.log('check',child.minZoom,child.maxZoom,child);
			if (this.outOfWatch(child, x, y, w, h) || child.minZoom > this.translateZ || child.maxZoom <= this.translateZ) {
				group.removeChild(child);
				i--;
			} else {
				if (child.localName == 'g') {
					this.clearUselessGroups(child, layer);
				}
			}
		}
	}
	msEdgeHook(g: SVGElement) {
		if (g.childNodes && (!(g.children))) {
			(g as any).children = g.childNodes;
		}
	}
	outOfWatch(g: TileSVGElement, x: number, y: number, w: number, h: number): boolean {
		let watchX: number = g.watchX;
		let watchY: number = g.watchY;
		let watchW: number = g.watchW;
		let watchH: number = g.watchH;
		return !(this.collision(watchX, watchY, watchW, watchH, x, y, w, h));
	}
	collision(x1: number, y1: number, w1: number, h1: number, x2: number, y2: number, w2: number, h2: number): boolean {
		if (this.collision2(x1, w1, x2, w2) && this.collision2(y1, h1, y2, h2)) {
			return true;
		} else {
			return false;
		}
	}
	collision2(x: number, w: number, left: number, width: number): boolean {
		if (x + w <= left || x >= left + width) {
			return false;
		} else {
			return true;
		}
	}
	tileFromModel() {
		//console.log('tileFromModel',this.model);
		if (this.model) {
			for (let k = 0; k < this.model.length; k++) {
				let svggroup: SVGElement = this.model[k].g;
				let arr: TileAnchor[] = this.model[k].anchors;
				for (let i: number = 0; i < arr.length; i++) {
					let a: TileAnchor = arr[i];
					this.addGroupTile(svggroup, a, this.model[k]);
				}
			}
		}
		this.allTilesOK = true;
	}
	addGroupTile(parentSVGElement: SVGElement, anchor: TileAnchor, layer: TileLayerDefinition) {
		//console.log('addGroupTile',this.translateZ,definitions);
		let x: number = -this.translateX;
		let y: number = -this.translateY;
		let w: number = this.svg.clientWidth * this.translateZ;
		let h: number = this.svg.clientHeight * this.translateZ;
		let cX: number = 0;
		let cY: number = 0;
		if (this.viewWidth * this.translateZ > this.innerWidth) {
			cX = (this.viewWidth * this.translateZ - this.innerWidth) / 2;
			x = x - cX;
		}
		if (this.viewHeight * this.translateZ > this.innerHeight) {
			cY = (this.viewHeight * this.translateZ - this.innerHeight) / 2;
			y = y - cY;
		}
		if (isLayerOverlay(layer)) {
			//if (layerKind == layerModeOverlay) {
			x = 0;
			y = 0;
		} else {
			if (isLayerStickLeft(layer)) {
				//if (layerKind == layerModeLockX) {
				x = 0;
			} else {
				if (isLayerStickTop(layer)) {
					//if (layerKind == layerModeLockY) {
					y = 0;
				} else {
					if (isLayerStickRight(layer)) {
						//if (layerKind == layerModeStickRight) {
						x = 0;
					} else {
						if (isLayerStickBottom(layer)) {
							//if (layerKind == layerModeStickBottom) {
							y = 0;
						}
					}
				}
			}
		}

		//if (definitions.z[0] <= this.translateZ && definitions.z[1] > this.translateZ) {
		if (anchor.showZoom <= this.translateZ && anchor.hideZoom > this.translateZ) {
			//console.log(this.collision(definitions.x * this.tapSize, definitions.y * this.tapSize, definitions.w * this.tapSize, definitions.h * this.tapSize, x, y, w, h));

			if (this.collision(anchor.xx * this.tapSize
				, anchor.yy * this.tapSize
				, anchor.ww * this.tapSize
				, anchor.hh * this.tapSize //
				, x, y, w, h)) {

				var gid: string = anchor.id ? anchor.id : '';
				//console.log('el',gid,tileGroup);
				let xg: SVGElement | null = this.childExists(parentSVGElement, gid);
				//console.log('exists',xg);
				if (xg) {
					//if (isTileGroup(tileGroup)) {
					//console.log('anchor',anchor);
					for (let n = 0; n < anchor.content.length; n++) {
						let d = anchor.content[n];
						//if (d.draw == 'group') {
						if (isTileGroup(d)) {
							//console.log(n, d);
							this.addElement(xg, d, layer);
						}
					}
					//}
				} else {
					let g: TileSVGElement = document.createElementNS(this.svgns, 'g') as TileSVGElement;
					//console.log(parentGroup,g);
					g.id = gid;//tileGroup.id;
					//let gg = g as any;
					g.watchX = anchor.xx * this.tapSize;
					g.watchY = anchor.yy * this.tapSize;
					g.watchW = anchor.ww * this.tapSize;
					g.watchH = anchor.hh * this.tapSize;
					parentSVGElement.appendChild(g);
					g.minZoom = anchor.showZoom;
					g.maxZoom = anchor.hideZoom;
					//if (isTileGroup(tileGroup)) {
					for (let n = 0; n < anchor.content.length; n++) {
						let d = anchor.content[n];
						this.addElement(g, d, layer);
					}
					//}
				}
			}
		}
	}
	childExists(group: SVGElement, id: string): SVGElement | null {//SVGGraphicsElement/SVGElement
		//console.log('childExists',group, id);
		//console.dir(group);
		if (id) {
			if (group) this.msEdgeHook(group);
			for (let i: number = 0; i < group.children.length; i++) {
				let child: SVGElement = group.children[i] as SVGElement;
				if (child.id == id) {
					return child;
				}
			}
		}
		return null;
	}
	addElement(g: SVGElement, dd: TileItem //TileAnchor | TileRectangle | TileText | TilePath | TileLine | TilePolygon
		, layer: TileLayerDefinition) {

		let element: TileSVGElement | null = null;
		//if (d.draw == 'rectangle') {
		if (isTileRectangle(dd)) {
			//let r=d as TileRectangle;
			element = tileRectangle(this.svgns, this.tapSize, g, dd.x * this.tapSize, dd.y * this.tapSize
				, dd.w * this.tapSize, dd.h * this.tapSize
				, (dd.rx ? dd.rx : 0) * this.tapSize, (dd.ry ? dd.ry : 0) * this.tapSize
				, (dd.css ? dd.css : ''));
		}
		//if (d.draw == 'text') {
		if (isTileText(dd)) {
			element = tileText(this.svgns, this.tapSize, g, dd.x * this.tapSize, dd.y * this.tapSize, dd.text, dd.css ? dd.css : '');
		}
		//if (d.draw == 'path') {
		if (isTilePath(dd)) {
			element = tilePath(this.svgns, this.tapSize, g, (dd.x ? dd.x : 0) * this.tapSize, (dd.y ? dd.y : 0) * this.tapSize, (dd.scale ? dd.scale : 0), dd.points, dd.css ? dd.css : '');
		}
		if (isTilePolygon(dd)) {
			element = tilePolygon(this.svgns, this.tapSize, g, (dd.x ? dd.x : 0) * this.tapSize, (dd.y ? dd.y : 0) * this.tapSize, dd.scale, dd.dots, dd.css);
		}
		//if (d.draw == 'line') {
		if (isTileLine(dd)) {
			element = tileLine(this.svgns, this.tapSize, g, dd.x1 * this.tapSize, dd.y1 * this.tapSize, dd.x2 * this.tapSize, dd.y2 * this.tapSize, dd.css);
		}
		//if (d.draw == 'group') {
		if (isTileGroup(dd)) {
			this.addGroupTile(g, dd, layer);
		}
		if (element) {
			if (dd.id) element.id = dd.id;
			//console.log('add',d.showZoom,d.hideZoom,d,element);
			//element.minZoom = d.showZoom;
			//element.maxZoom = d.hideZoom;
			//console.log('addElement',this.translateZ,d,element);
			if (dd.action) {
				//let e:any = element as any;
				//let e:TileSVGElement = element;
				element.onClickFunction = dd.action;
				let me: TileLevel = this;
				let click: () => void = function () {
					//console.log('click',me.clicked,element);
					if (me.clicked) {
						if (element) {
							//console.log('click',element);
							if (element.onClickFunction) {
								//console.log('clicked', element);
								let xx: number = element.getBoundingClientRect().left - me.svg.getBoundingClientRect().left;
								let yy: number = element.getBoundingClientRect().top - me.svg.getBoundingClientRect().top;
								element.onClickFunction(me.translateZ * (me.clickX - xx) / me.tapSize, me.translateZ * (me.clickY - yy) / me.tapSize);
							}
						}
					}
				};
				element.onclick = click;
				element.ontouchend = click;
				if ((dd.dragX) || (dd.dragY)) {
					let onStartDrag = function (elmnt: TileSVGElement | null, ev: TouchEvent | MouseEvent) {

						//console.log('onStartDrag', dd,g);
						//console.log('element', element);
						me.dragTileItem = dd;
						me.dragTileSVGelement = element;
						me.dragSVGparent = g;
						me.draggedX = 0;
						me.draggedY = 0;
						me.dragTranslateX = 0;
						me.dragTranslateY = 0;
						//(elmnt as any).setAttributeNS(null, 'x', '555');
						me.startedTouch = false;
					};
					let startTouchDrag: ((this: GlobalEventHandlers, ev: TouchEvent) => any) | null
						= function (this: GlobalEventHandlers, ev: TouchEvent): any {
							onStartDrag(element, ev);
						};
					let startMouseDrag: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null
						= function (this: GlobalEventHandlers, ev: MouseEvent): any {
							onStartDrag(element, ev);
						};
					element.onmousedown = startMouseDrag;
					element.ontouchstart = startTouchDrag;
					//if (dd.action)element.onClickFunction = dd.action;
				}
			}
		}
	}





	clearAllDetails() {
		if (this.model) {
			for (let i: number = 0; i < this.model.length; i++) {
				this.clearGroupDetails(this.model[i].g);
			}
		}
	}
	clearGroupDetails(group: SVGElement) {
		if (group) this.msEdgeHook(group);
		//console.log(group);
		while (group.children.length) {
			group.removeChild(group.children[0]);
		}
	}
	autoID(definition: (TileAnchor | TileRectangle | TileText | TilePath | TileLine | TilePolygon)[]) {
		if (definition) {
			if (definition.length) {
				for (let i: number = 0; i < definition.length; i++) {

					if (!(definition[i].id)) {
						//definition[i].id = 'id' + Math.floor(Math.random() * 1000000000);
						definition[i].id = rid();
						//console.log('/',definition[i]);
					}
					//let tt:TileGroup|TileDefinition=definition[i];
					//this.autoID(tt.sub);
					if (isTileGroup(definition[i])) {
						let group: TileAnchor = definition[i] as TileAnchor;
						this.autoID(group.content);
					}
					//this.autoID(definition[i].sub);
				}
			}
		}
	}

	setModel(layers: TileModelLayer[]) {
		for (let i: number = 0; i < layers.length; i++) {
			this.autoID(layers[i].anchors);
		}
		//console.log(layers);
		this.model = layers;
		this.resetModel();
	}
	resetModelAndRun(afterDone: () => void) {
		this.resetModel();
	}
	resetModel() {
		for (let i: number = 0; i < this.model.length; i++) {
			this.autoID(this.model[i].anchors);
		}
		this.clearAllDetails();
		this.applyZoomPosition();
		this.adjustContentPosition();
		this.slideToContentPosition();
		this.allTilesOK = false;
	}
	resetAnchor(anchor: TileAnchor, fromSVGGroup: SVGElement) {
		var gid: string = anchor.id ? anchor.id : '';
		let xg: SVGElement | null = this.childExists(fromSVGGroup, gid);
		if (xg) {
			fromSVGGroup.removeChild(xg);
			//console.log('resetAnchor',anchor,xg);
		}
	}
	redrawAnchor(anchor: TileAnchor) {
		//this.autoID([anchor]);
		if (anchor.id) {
			for (var i = 0; i < this.model.length; i++) {

				var layer = this.model[i];
				var svgEl: SVGElement = layer.g;
				if (this.removeFromTree(anchor, svgEl, layer)) {
					return true;
				}
			}
		}
		return false;
	}
	removeFromTree(anchor: TileAnchor, parentSVG: SVGElement, layer: TileLayerDefinition): boolean {
		if (parentSVG) this.msEdgeHook(parentSVG);
		if (anchor.id) {
			for (var i: number = 0; i < parentSVG.children.length; i++) {
				var child: SVGElement = parentSVG.children[i] as SVGElement;
				if (child.id == anchor.id) {
					parentSVG.removeChild(child);
					this.addGroupTile(parentSVG, anchor, layer);
					return true;
				} else {
					if (child.localName == 'g') {
						if (this.removeFromTree(anchor, child, layer)) {
							return true;
						}
					}
				}
			}
		}
		return false;
	}
	/*
	startLoop() {
		//console.log('startLoop', this.model);
		let last: number = new Date().getTime();
		let me: TileLevel = this;
		let step: () => void = function () {
			let now = new Date().getTime();
			if (last + 33 < now) {
				if (!(me.valid)) {
					me.queueTiles();
				}
				last = new Date().getTime();
			}
			window.requestAnimationFrame(step);
		};
		step();
	}*/
	startLoop() {
		//console.log('TileLevel startLoop');
		this.lastTickTime = new Date().getTime();
		this.tick();
	}
	tick() {
		let now = new Date().getTime();
		if (this.lastTickTime + 33 < now) {
			if (!(this.allTilesOK)) {
				//console.log('queueTiles', this.translateX, this.translateY, this.translateZ, this.tapSize,new Date().getTime());
				this.queueTiles();
				//console.log('done queueTiles', this.allTilesOK);
			}
			this.lastTickTime = new Date().getTime();
		}
		window.requestAnimationFrame(this.tick.bind(this));
	}

}