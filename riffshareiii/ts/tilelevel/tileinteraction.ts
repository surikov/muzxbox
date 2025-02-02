class TileInteraction {
    tiler: TileLevelRealTime;
    constructor(parenttiler: TileLevelRealTime) {
        this.tiler = parenttiler;
    }
    rakeMouseWheel(e: WheelEvent) {
        //console.log('rakeMouseWheel');
        this.tiler.slidingLockTo = -1;
        e.preventDefault();
        let wheelVal: number = e.deltaY;
        let min: number = Math.min(1, wheelVal);
        let delta: number = Math.max(-1, min);
        //let zoom: number = this.translateZ - delta * (this.translateZ) * 0.077;
        let zoom: number = this.tiler.translateZ + delta * (this.tiler.translateZ) * 0.05;
        //console.log('rakeMouseWheel',zoom);
        if (zoom < this.tiler.minZoom()) {
            zoom = this.tiler.minZoom();
        }
        if (zoom > this.tiler.maxZoom()) {
            zoom = this.tiler.maxZoom();
        }
        this.tiler.translateX = this.tiler.translateX - (this.tiler.translateZ - zoom) * e.offsetX;
        this.tiler.translateY = this.tiler.translateY - (this.tiler.translateZ - zoom) * e.offsetY;
        this.tiler.translateZ = zoom;
        this.tiler.applyZoomPosition();
        this.tiler.adjustContentPosition();
        this.tiler.allTilesOK = false;
        return false;
    }
    rakeMouseDown(mouseEvent: MouseEvent) {
        //console.log('rakeMouseDown');
        this.tiler.slidingLockTo = -1;
        mouseEvent.preventDefault();
        this.tiler.startMouseScreenX = mouseEvent.offsetX;
        this.tiler.startMouseScreenY = mouseEvent.offsetY;
        this.tiler.mouseDownMode = true;
        //this.interMode = this.ModeDragView;
        this.tiler.clickX = this.tiler.startMouseScreenX;
        this.tiler.clickY = this.tiler.startMouseScreenY;
        this.tiler.waitViewClickAction = false;
        this.startDragZoom();
    }
    rakeMouseMove(mouseEvent: MouseEvent) {
        let dX: number = mouseEvent.offsetX - this.tiler.startMouseScreenX;
        let dY: number = mouseEvent.offsetY - this.tiler.startMouseScreenY;
        this.tiler.startMouseScreenX = mouseEvent.offsetX;
        this.tiler.startMouseScreenY = mouseEvent.offsetY;
        //console.log('rakeMouseMove', dX, dY, this.startMouseScreenX, this.startMouseScreenY);
        if (this.tiler.mouseDownMode) {

            // if (this.interMode == this.ModeDragView) {
            mouseEvent.preventDefault();
            if (this.tiler.currentDragItem) {
                if (dX != 0 || dY != 0) {
                    //console.log('rakeMouseMove', dX, dY, this.startMouseScreenX, this.startMouseScreenY);
                    let moveX = this.tiler.translateZ * dX / this.tiler.tapSize;
                    let moveY = this.tiler.translateZ * dY / this.tiler.tapSize;
                    if (this.tiler.currentDragItem.activation) {
                        this.tiler.currentDragItem.activation(moveX, moveY);
                        //console.log(this.translateZ,dX,dY,moveX, moveY);
                    }
                }
            } else {
                this.tiler.translateX = this.tiler.translateX + dX * this.tiler.translateZ;
                this.tiler.translateY = this.tiler.translateY + dY * this.tiler.translateZ;
                this.tiler.applyZoomPosition();
                this.tiler.adjustContentPosition();
                this.tiler.onMove(dX, dY);
            }
        }
    }
    rakeMouseUp(mouseEvent: MouseEvent) {
        //console.log('rakeMouseUp');
        if (this.tiler.mouseDownMode) {
            //if (this.interMode == this.ModeDragView) {
            this.tiler.mouseDownMode = false;
            //this.interMode = this.ModeDragNone;
            mouseEvent.preventDefault();
            this.cancelDragZoom();
            this.tiler.waitViewClickAction = false;
            if (this.tiler.currentDragItem) {
                if (this.tiler.currentDragItem.activation) {
                    this.tiler.currentDragItem.activation(0, 0);
                }
                this.tiler.currentDragItem = null;
            } else {
                let diffX = Math.abs(this.tiler.clickX - this.tiler.startMouseScreenX);
                let diffY = Math.abs(this.tiler.clickY - this.tiler.startMouseScreenY);
                if (diffX < this.tiler.clickLimit && diffY < this.tiler.clickLimit) {
                    this.tiler.waitViewClickAction = true;
                    this.tiler.slideToContentPosition();
                    this.tiler.allTilesOK = false;
                } else {
                    this.tiler.slideToContentPosition();
                    this.tiler.allTilesOK = false;
                }
            }
        }
    }
    rakeTouchStart(touchEvent: TouchEvent) {
        console.log('rakeTouchStart', touchEvent.touches);
        this.tiler.slidingLockTo = -1;
        touchEvent.preventDefault();
        this.tiler.startedTouch = true;
        this.tiler.waitViewClickAction = false;
        if (touchEvent.touches.length < 2) {
            this.tiler.twoZoom = false;
            this.tiler.startMouseScreenX = touchEvent.touches[0].clientX;
            this.tiler.startMouseScreenY = touchEvent.touches[0].clientY;
            this.tiler.clickX = this.tiler.startMouseScreenX;
            this.tiler.clickY = this.tiler.startMouseScreenY;
            this.tiler.twodistance = 0;
            this.startDragZoom();
            return;
        } else {
            this.tiler.startTouchZoom(touchEvent);
        }
    }
    rakeTouchMove(touchEvent: TouchEvent) {
        console.log('rakeTouchMove',touchEvent);
        touchEvent.preventDefault();
        if (this.tiler.startedTouch) {
            if (touchEvent.touches.length < 2) {
                if (this.tiler.twoZoom) {
                    //
                } else {
                    let dX: number = touchEvent.touches[0].clientX - this.tiler.startMouseScreenX;
                    let dY: number = touchEvent.touches[0].clientY - this.tiler.startMouseScreenY;
                    if (this.tiler.currentDragItem) {
                        if (dX != 0 || dY != 0) {
                            //console.log('rakeMouseMove', dX, dY, this.startMouseScreenX, this.startMouseScreenY);
                            let moveX = this.tiler.translateZ * dX / this.tiler.tapSize;
                            let moveY = this.tiler.translateZ * dY / this.tiler.tapSize;
                            if (this.tiler.currentDragItem.activation) {
                                this.tiler.currentDragItem.activation(moveX, moveY);
                                //console.log(this.translateZ,dX,dY,moveX, moveY);
                            }
                            this.tiler.startMouseScreenX = touchEvent.touches[0].clientX;
                            this.tiler.startMouseScreenY = touchEvent.touches[0].clientY;
                        }
                    } else {
                        this.tiler.translateX = this.tiler.translateX + dX * this.tiler.translateZ;
                        this.tiler.translateY = this.tiler.translateY + dY * this.tiler.translateZ;
                        this.tiler.startMouseScreenX = touchEvent.touches[0].clientX;
                        this.tiler.startMouseScreenY = touchEvent.touches[0].clientY;
                        this.tiler.applyZoomPosition();
                        this.tiler.adjustContentPosition();
                        this.tiler.onMove(dX, dY);
                    }
                    return;
                }
            } else {
                if (!this.tiler.twoZoom) {
                    this.tiler.startTouchZoom(touchEvent);
                } else {
                    let p1: TilePoint = vectorFromTouch(touchEvent.touches[0]);
                    let p2: TilePoint = vectorFromTouch(touchEvent.touches[1]);
                    let d: number = vectorDistance(p1, p2);
                    if (d <= 0) {
                        d = 1;
                    }
                    let ratio: number = d / this.tiler.twodistance;
                    this.tiler.twodistance = d;
                    let zoom: number = this.tiler.translateZ / ratio;
                    //let zoom: number = this.translateZ * ratio;
                    if (zoom < this.tiler.minZoom()) {
                        zoom = this.tiler.minZoom();
                    }
                    if (zoom > this.tiler.maxZoom()) {
                        zoom = this.tiler.maxZoom();
                    }
                    if (this.tiler.viewWidth * this.tiler.translateZ < this.tiler.innerWidth) {
                        this.tiler.translateX = this.tiler.translateX - (this.tiler.translateZ - zoom) * (this.tiler.twocenter.x);
                    }
                    if (this.tiler.viewHeight * this.tiler.translateZ < this.tiler.innerHeight) {
                        this.tiler.translateY = this.tiler.translateY - (this.tiler.translateZ - zoom) * (this.tiler.twocenter.y);
                    }
                    this.tiler.translateZ = zoom;
                    this.tiler.dragZoom = 1.0;
                    this.tiler.applyZoomPosition();
                    this.tiler.adjustContentPosition();
                }
            }
        }
    }
    rakeTouchEnd(touchEvent: TouchEvent) {
        touchEvent.preventDefault();
        //this.currentDragItem = null;
        console.log('rakeTouchEnd',touchEvent);
        this.tiler.allTilesOK = false;
        if (!this.tiler.twoZoom) {
            if (touchEvent.touches.length < 2) {
                this.cancelDragZoom();
                this.tiler.waitViewClickAction = false;
                if (this.tiler.startedTouch) {
                    if (this.tiler.currentDragItem) {
                        if (this.tiler.currentDragItem.activation) {
                            this.tiler.currentDragItem.activation(0, 0);
                        }
                        this.tiler.currentDragItem = null;
                    } else {
                        let diffX = Math.abs(this.tiler.clickX - this.tiler.startMouseScreenX);
                        let diffY = Math.abs(this.tiler.clickY - this.tiler.startMouseScreenY);
                        if (diffX < this.tiler.clickLimit && diffY < this.tiler.clickLimit) {
                            this.tiler.waitViewClickAction = true;
                            this.tiler.slideToContentPosition();
                        } else {
                            this.tiler.waitViewClickAction = false;
                            this.tiler.slideToContentPosition();
                        }
                    }
                } else {
                    //console.log('touch ended already');
                }
                return;
            }
        }
        this.tiler.twoZoom = false;
        this.tiler.startedTouch = false;
        this.cancelDragZoom();
        this.tiler.slideToContentPosition();
    }
    startDragNDrop(): void {

    }
    startDragZoom() {
        //console.log('startDragZoom');
        this.tiler.dragZoom = 1.002;
        this.tiler.applyZoomPosition();
    };
    cancelDragZoom() {
        this.tiler.dragZoom = 1.0;
        this.tiler.applyZoomPosition();
    };
}
