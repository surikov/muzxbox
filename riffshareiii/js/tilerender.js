"use strict";
console.log('tilelevel v2.20.001');
function createTileLevel() {
    return new TileLevelRealTime();
}
class TileLevelRealTime {
    constructor() {
        this.tapSize = 50;
        this.twoZoom = false;
        this.clickLimit = this.tapSize / 6;
        this.svgns = "http://www.w3.org/2000/svg";
        this.viewWidth = 0;
        this.viewHeight = 0;
        this.innerWidth = 0;
        this.innerHeight = 0;
        this._translateX = 0;
        this._translateY = 0;
        this._translateZ = 1;
        this.startMouseScreenX = 0;
        this.startMouseScreenY = 0;
        this.clickX = 0;
        this.clickY = 0;
        this.dragZoom = 1;
        this._allTilesOK = false;
        this.waitViewClickAction = false;
        this.mx = 100;
        this.mn = 1;
        this.startedTouch = false;
        this.twodistance = 0;
        this.model = [];
        this.slidingLockTo = 0;
        this.slidingID = 0;
        this.onResizeDo = new CannyDo();
        this.onZoom = new CannyDo();
        this.onResetAnchorDo = new LazyDo();
        this.lastTickTime = 0;
        this.fastenUp = true;
        this.fastenDown = true;
        this.fastenLeft = true;
        this.fastenRight = true;
        this.lastMoveDx = 0;
        this.lastMoveDy = 0;
        this.mouseDownMode = false;
        this.currentDragItem = null;
    }
    get allTilesOK() {
        return this._allTilesOK;
    }
    set allTilesOK(bb) {
        if (bb != this._allTilesOK) {
            this._allTilesOK = bb;
        }
    }
    get translateZ() {
        return this._translateZ;
    }
    set translateZ(z) {
        if (z != this._translateZ) {
            this._translateZ = z;
        }
    }
    get translateX() {
        return this._translateX;
    }
    set translateX(x) {
        if (x != this._translateX) {
            this._translateX = x;
        }
    }
    get translateY() {
        return this._translateY;
    }
    set translateY(y) {
        if (y != this._translateY) {
            this._translateY = y;
        }
    }
    getStartMouseScreen() {
        return {
            x: this.startMouseScreenX, y: this.startMouseScreenY
        };
    }
    getCurrentPointPosition() {
        return {
            x: this.translateX, y: this.translateY, z: this.translateZ
        };
    }
    screen2view(screen) {
        let xx = (screen.x * this.translateZ - this.translateX) / this.tapSize;
        let yy = (screen.y * this.translateZ - this.translateY) / this.tapSize;
        if (this.viewWidth * this.translateZ > this.innerWidth) {
            if (this.stickLeft) {
            }
            else {
                xx = xx + 0.5 * (this.innerWidth - this.viewWidth * this.translateZ) / this.tapSize;
            }
        }
        if (this.viewHeight * this.translateZ > this.innerHeight) {
            yy = yy + 0.5 * (this.innerHeight - this.viewHeight * this.translateZ) / this.tapSize;
        }
        let rr = { x: xx, y: yy };
        return rr;
    }
    resetInnerSize(inWidth, inHeight) {
        this.innerWidth = inWidth * this.tapSize;
        this.innerHeight = inHeight * this.tapSize;
    }
    initRun(svgObject, stickLeft, inWidth, inHeight, minZoom, curZoom, maxZoom, layers) {
        this.svg = svgObject;
        this.setupTapSize(1);
        this.stickLeft = stickLeft;
        this.viewWidth = this.svg.clientWidth;
        this.viewHeight = this.svg.clientHeight;
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
    tapPxSize() {
        return this.tapSize;
    }
    setupTapSize(baseSize) {
        let rect = document.createElementNS(this.svgns, 'rect');
        rect.setAttributeNS(null, 'height', '' + baseSize + 'cm');
        rect.setAttributeNS(null, 'width', '' + baseSize + 'cm');
        this.svg.appendChild(rect);
        let tbb = rect.getBBox();
        this.tapSize = tbb.width;
        this.svg.removeChild(rect);
        this.clickLimit = this.tapSize / 6;
    }
    onAfterResize() {
        this.onResizeDo.start(333, function () {
            this.viewWidth = this.svg.clientWidth;
            this.viewHeight = this.svg.clientHeight;
            if (this.afterResizeCallback) {
                this.afterResizeCallback();
            }
            this.applyZoomPosition();
            this.adjustContentPosition();
            this.slideToContentPosition();
        }.bind(this));
    }
    onMove(dx, dy) {
        this.lastMoveDx = dx;
        this.lastMoveDy = dy;
    }
    rakeMouseWheel(e) {
        this.slidingLockTo = -1;
        e.preventDefault();
        let wheelVal = e.deltaY;
        let min = Math.min(1, wheelVal);
        let delta = Math.max(-1, min);
        let zoom = this.translateZ + delta * (this.translateZ) * 0.05;
        if (zoom < this.minZoom()) {
            zoom = this.minZoom();
        }
        if (zoom > this.maxZoom()) {
            zoom = this.maxZoom();
        }
        this.translateX = this.translateX - (this.translateZ - zoom) * e.offsetX;
        this.translateY = this.translateY - (this.translateZ - zoom) * e.offsetY;
        this.translateZ = zoom;
        this.applyZoomPosition();
        this.adjustContentPosition();
        this.allTilesOK = false;
        return false;
    }
    rakeMouseDown(mouseEvent) {
        this.slidingLockTo = -1;
        mouseEvent.preventDefault();
        this.startMouseScreenX = mouseEvent.offsetX;
        this.startMouseScreenY = mouseEvent.offsetY;
        this.mouseDownMode = true;
        this.clickX = this.startMouseScreenX;
        this.clickY = this.startMouseScreenY;
        this.waitViewClickAction = false;
        this.startDragZoom();
    }
    rakeMouseMove(mouseEvent) {
        let dX = mouseEvent.offsetX - this.startMouseScreenX;
        let dY = mouseEvent.offsetY - this.startMouseScreenY;
        this.startMouseScreenX = mouseEvent.offsetX;
        this.startMouseScreenY = mouseEvent.offsetY;
        if (this.mouseDownMode) {
            mouseEvent.preventDefault();
            if (this.currentDragItem) {
                if (dX != 0 || dY != 0) {
                    let moveX = this.translateZ * dX / this.tapSize;
                    let moveY = this.translateZ * dY / this.tapSize;
                    if (this.currentDragItem.activation) {
                        this.currentDragItem.activation(moveX, moveY);
                    }
                }
            }
            else {
                this.translateX = this.translateX + dX * this.translateZ;
                this.translateY = this.translateY + dY * this.translateZ;
                this.applyZoomPosition();
                this.adjustContentPosition();
                this.onMove(dX, dY);
            }
        }
    }
    rakeMouseUp(mouseEvent) {
        if (this.mouseDownMode) {
            this.mouseDownMode = false;
            mouseEvent.preventDefault();
            this.cancelDragZoom();
            this.waitViewClickAction = false;
            if (this.currentDragItem) {
                if (this.currentDragItem.activation) {
                    this.currentDragItem.activation(0, 0);
                }
                this.currentDragItem = null;
            }
            else {
                let diffX = Math.abs(this.clickX - this.startMouseScreenX);
                let diffY = Math.abs(this.clickY - this.startMouseScreenY);
                if (diffX < this.clickLimit && diffY < this.clickLimit) {
                    this.waitViewClickAction = true;
                    this.slideToContentPosition();
                    this.allTilesOK = false;
                }
                else {
                    this.slideToContentPosition();
                    this.allTilesOK = false;
                }
            }
        }
    }
    rakeTouchStart(touchEvent) {
        this.slidingLockTo = -1;
        touchEvent.preventDefault();
        this.startedTouch = true;
        this.waitViewClickAction = false;
        if (touchEvent.touches.length < 2) {
            this.twoZoom = false;
            this.startMouseScreenX = touchEvent.touches[0].clientX;
            this.startMouseScreenY = touchEvent.touches[0].clientY;
            this.clickX = this.startMouseScreenX;
            this.clickY = this.startMouseScreenY;
            this.twodistance = 0;
            this.startDragZoom();
            return;
        }
        else {
            this.startTouchZoom(touchEvent);
        }
    }
    rakeTouchMove(touchEvent) {
        touchEvent.preventDefault();
        if (this.startedTouch) {
            if (touchEvent.touches.length < 2) {
                if (this.twoZoom) {
                }
                else {
                    let dX = touchEvent.touches[0].clientX - this.startMouseScreenX;
                    let dY = touchEvent.touches[0].clientY - this.startMouseScreenY;
                    if (this.currentDragItem) {
                        if (dX != 0 || dY != 0) {
                            let moveX = this.translateZ * dX / this.tapSize;
                            let moveY = this.translateZ * dY / this.tapSize;
                            if (this.currentDragItem.activation) {
                                this.currentDragItem.activation(moveX, moveY);
                            }
                            this.startMouseScreenX = touchEvent.touches[0].clientX;
                            this.startMouseScreenY = touchEvent.touches[0].clientY;
                        }
                    }
                    else {
                        this.translateX = this.translateX + dX * this.translateZ;
                        this.translateY = this.translateY + dY * this.translateZ;
                        this.startMouseScreenX = touchEvent.touches[0].clientX;
                        this.startMouseScreenY = touchEvent.touches[0].clientY;
                        this.applyZoomPosition();
                        this.adjustContentPosition();
                        this.onMove(dX, dY);
                    }
                    return;
                }
            }
            else {
                if (!this.twoZoom) {
                    this.startTouchZoom(touchEvent);
                }
                else {
                    let p1 = vectorFromTouch(touchEvent.touches[0]);
                    let p2 = vectorFromTouch(touchEvent.touches[1]);
                    let d = vectorDistance(p1, p2);
                    if (d <= 0) {
                        d = 1;
                    }
                    let ratio = d / this.twodistance;
                    this.twodistance = d;
                    let zoom = this.translateZ / ratio;
                    if (zoom < this.minZoom()) {
                        zoom = this.minZoom();
                    }
                    if (zoom > this.maxZoom()) {
                        zoom = this.maxZoom();
                    }
                    if (this.viewWidth * this.translateZ < this.innerWidth) {
                        this.translateX = this.translateX - (this.translateZ - zoom) * (this.twocenter.x);
                    }
                    if (this.viewHeight * this.translateZ < this.innerHeight) {
                        this.translateY = this.translateY - (this.translateZ - zoom) * (this.twocenter.y);
                    }
                    this.translateZ = zoom;
                    this.dragZoom = 1.0;
                    this.applyZoomPosition();
                    this.adjustContentPosition();
                }
            }
        }
    }
    rakeTouchEnd(touchEvent) {
        touchEvent.preventDefault();
        this.allTilesOK = false;
        if (!this.twoZoom) {
            if (touchEvent.touches.length < 2) {
                this.cancelDragZoom();
                this.waitViewClickAction = false;
                if (this.startedTouch) {
                    if (this.currentDragItem) {
                        if (this.currentDragItem.activation) {
                            this.currentDragItem.activation(0, 0);
                        }
                        this.currentDragItem = null;
                    }
                    else {
                        let diffX = Math.abs(this.clickX - this.startMouseScreenX);
                        let diffY = Math.abs(this.clickY - this.startMouseScreenY);
                        if (diffX < this.clickLimit && diffY < this.clickLimit) {
                            this.waitViewClickAction = true;
                            this.slideToContentPosition();
                        }
                        else {
                            this.waitViewClickAction = false;
                            this.slideToContentPosition();
                        }
                    }
                }
                else {
                }
                return;
            }
        }
        this.twoZoom = false;
        this.startedTouch = false;
        this.cancelDragZoom();
        this.slideToContentPosition();
    }
    startDragNDrop() {
    }
    startDragZoom() {
        this.dragZoom = 1.002;
        this.applyZoomPosition();
    }
    ;
    cancelDragZoom() {
        this.dragZoom = 1.0;
        this.applyZoomPosition();
    }
    ;
    applyZoomPosition() {
        let rx = -this.translateX - this.dragZoom * this.translateZ * (this.viewWidth - this.viewWidth / this.dragZoom) * (this.clickX / this.viewWidth);
        let ry = -this.translateY - this.dragZoom * this.translateZ * (this.viewHeight - this.viewHeight / this.dragZoom) * (this.clickY / this.viewHeight);
        let rw = this.viewWidth * this.translateZ * this.dragZoom;
        let rh = this.viewHeight * this.translateZ * this.dragZoom;
        this.svg.setAttribute('viewBox', rx + ' ' + ry + ' ' + rw + ' ' + rh);
        if (this.model) {
            for (let k = 0; k < this.model.length; k++) {
                let layer = this.model[k];
                let tx = 0;
                let ty = 0;
                let tz = 1;
                let cX = 0;
                let cY = 0;
                let sX = 0;
                let sY = 0;
                if (this.viewWidth * this.translateZ > this.innerWidth) {
                    if (this.stickLeft) {
                    }
                    else {
                        cX = (this.viewWidth * this.translateZ - this.innerWidth) / 2;
                    }
                }
                if (this.viewHeight * this.translateZ > this.innerHeight) {
                    cY = (this.viewHeight * this.translateZ - this.innerHeight) / 2;
                }
                if (layer.mode == LevelModes.overlay) {
                    tz = this.translateZ;
                    tx = -this.translateX;
                    ty = -this.translateY;
                    cX = 0;
                    cY = 0;
                }
                else {
                    if (layer.mode == LevelModes.left) {
                        tx = -this.translateX;
                        cX = 0;
                        if (layer.stickLeft) {
                            sX = layer.stickLeft * this.tapSize * this.translateZ;
                        }
                    }
                    else {
                        if (layer.mode == LevelModes.top) {
                            ty = -this.translateY;
                            cY = 0;
                            if (layer.stickTop) {
                                sY = layer.stickTop * this.tapSize * this.translateZ;
                            }
                        }
                        else {
                            if (layer.mode == LevelModes.bottom) {
                                ty = -this.translateY;
                                cY = 0;
                                sY = this.viewHeight * this.translateZ;
                                if (layer.stickBottom) {
                                    sY = this.viewHeight * this.translateZ - layer.stickBottom * this.tapSize;
                                }
                            }
                            else {
                                if (layer.mode == LevelModes.right) {
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
        }
        this.checkAfterZoom();
    }
    checkAfterZoom() {
        this.onZoom.start(123, function () {
            if (this.afterZoomCallback) {
                this.afterZoomCallback();
            }
        }.bind(this));
    }
    slideToContentPosition() {
        let a = this.calculateValidContentPosition();
        if (a.x != this.translateX || a.y != this.translateY || a.z != this.translateZ) {
            this.startSlideTo(a.x, a.y, a.z, null);
        }
    }
    maxZoom() {
        return this.mx;
    }
    ;
    minZoom() {
        return this.mn;
    }
    ;
    adjustContentPosition() {
        let a = this.calculateValidContentPosition();
        if (a.x != this.translateX || a.y != this.translateY || a.z != this.translateZ) {
            this.translateX = a.x;
            this.translateY = a.y;
            this.translateZ = a.z;
            this.applyZoomPosition();
        }
    }
    calculateValidContentPosition() {
        let vX = this.translateX;
        let vY = this.translateY;
        let vZ = this.translateZ;
        if (this.translateX > 0) {
            vX = 0;
        }
        else {
            if (this.viewWidth - this.translateX / this.translateZ > this.innerWidth / this.translateZ) {
                if (this.viewWidth * this.translateZ - this.innerWidth <= 0) {
                    vX = this.viewWidth * this.translateZ - this.innerWidth;
                }
                else {
                    vX = 0;
                }
            }
        }
        var upLimit = this.viewHeight * this.translateZ;
        if (this.fastenUp) {
            upLimit = 0;
        }
        if (this.translateY > upLimit) {
            vY = upLimit;
        }
        else {
            if (this.viewHeight - this.translateY / this.translateZ > this.innerHeight / this.translateZ) {
                if (this.viewHeight * this.translateZ - this.innerHeight <= 0) {
                    vY = this.viewHeight * this.translateZ - this.innerHeight;
                }
                else {
                    vY = 0;
                }
            }
        }
        if (this.translateZ < this.minZoom()) {
            vZ = this.minZoom();
        }
        else {
            if (this.translateZ > this.maxZoom()) {
                vZ = this.maxZoom();
            }
        }
        return {
            x: vX,
            y: vY,
            z: vZ
        };
    }
    startTouchZoom(touchEvent) {
        this.twoZoom = true;
        let p1 = vectorFromTouch(touchEvent.touches[0]);
        let p2 = vectorFromTouch(touchEvent.touches[1]);
        this.twocenter = vectorFindCenter(p1, p2);
        let d = vectorDistance(p1, p2);
        if (d <= 0) {
            d = 1;
        }
        this.twodistance = d;
    }
    startSlideCenter(x, y, z, w, h, action) {
        let dx = (z * this.viewWidth / this.tapSize - w) / 2;
        let dy = (z * this.viewHeight / this.tapSize - h) / 2;
        this.startSlideTo((dx - x) * this.tapSize, (dy - y) * this.tapSize, z, action);
    }
    startSlideTo(x, y, z, action) {
        this.startStepSlideTo(20, x, y, z, action);
    }
    startStepSlideTo(s, x, y, z, action) {
        clearTimeout(this.slidingID);
        let stepCount = s;
        let xyz = [];
        for (let i = 0; i < stepCount; i++) {
            xyz.push({
                x: this.translateX + (x - this.translateX) * Math.cos((Math.PI / 2) / (1 + i)),
                y: this.translateY + (y - this.translateY) * Math.cos((Math.PI / 2) / (1 + i)),
                z: this.translateZ + (z - this.translateZ) * Math.cos((Math.PI / 2) / (1 + i))
            });
        }
        xyz.push({
            x: x,
            y: y,
            z: z
        });
        this.slidingLockTo = Math.random();
        this.stepSlideTo(this.slidingLockTo, xyz, action);
    }
    stepSlideTo(key, xyz, action) {
        let n = xyz.shift();
        if (n) {
            if (key == this.slidingLockTo) {
                this.translateX = n.x;
                this.translateY = n.y;
                this.translateZ = n.z;
                this.applyZoomPosition();
                let main = this;
                this.slidingID = setTimeout(function () {
                    main.stepSlideTo(key, xyz, action);
                }, 30);
            }
            else {
            }
        }
        else {
            if (action) {
                action();
            }
            this.adjustContentPosition();
            this.allTilesOK = true;
            this.queueTiles();
        }
    }
    queueTiles() {
        this.clearUselessDetails();
        this.tileFromModel();
    }
    clearUselessDetails() {
        if (this.model) {
            for (let k = 0; k < this.model.length; k++) {
                let group = this.model[k].g;
                this.clearUselessGroups(group, this.model[k]);
            }
        }
    }
    clearUselessGroups(group, layer) {
        let x = -this.translateX;
        let y = -this.translateY;
        let w = this.svg.clientWidth * this.translateZ;
        let h = this.svg.clientHeight * this.translateZ;
        let cX = 0;
        let cY = 0;
        if (this.viewWidth * this.translateZ > this.innerWidth) {
            if (this.stickLeft) {
            }
            else {
                cX = (this.viewWidth * this.translateZ - this.innerWidth) / 2;
                x = x - cX;
            }
        }
        if (this.viewHeight * this.translateZ > this.innerHeight) {
            cY = (this.viewHeight * this.translateZ - this.innerHeight) / 2;
            y = y - cY;
        }
        if (layer.mode == LevelModes.overlay) {
            x = 0;
            y = 0;
        }
        else {
            if (layer.mode == LevelModes.left) {
                x = 0;
            }
            else {
                if (layer.mode == LevelModes.top) {
                    y = 0;
                }
                else {
                    if (layer.mode == LevelModes.right) {
                        x = 0;
                    }
                    else {
                        if (layer.mode == LevelModes.bottom) {
                            y = 0;
                        }
                    }
                }
            }
        }
        if (group)
            this.msEdgeHook(group);
        for (let i = 0; i < group.children.length; i++) {
            let child = group.children[i];
            if (this.outOfWatch(child, x, y, w, h) || child.minZoom > this.translateZ || child.maxZoom <= this.translateZ) {
                group.removeChild(child);
                i--;
            }
            else {
                if (child.localName == 'g') {
                    this.clearUselessGroups(child, layer);
                }
            }
        }
    }
    msEdgeHook(g) {
        if (g.childNodes && (!(g.children))) {
            g.children = g.childNodes;
        }
    }
    outOfWatch(g, x, y, w, h) {
        let watchX = g.watchX;
        let watchY = g.watchY;
        let watchW = g.watchW;
        let watchH = g.watchH;
        return !(this.collision(watchX, watchY, watchW, watchH, x, y, w, h));
    }
    collision(x1, y1, w1, h1, x2, y2, w2, h2) {
        if (this.collision2(x1, w1, x2, w2) && this.collision2(y1, h1, y2, h2)) {
            return true;
        }
        else {
            return false;
        }
    }
    collision2(x, w, left, width) {
        if (x + w <= left || x >= left + width) {
            return false;
        }
        else {
            return true;
        }
    }
    tileFromModel() {
        if (this.model) {
            for (let k = 0; k < this.model.length; k++) {
                let svggroup = this.model[k].g;
                let arr = this.model[k].anchors;
                for (let i = 0; i < arr.length; i++) {
                    let a = arr[i];
                    this.addGroupTile(svggroup, a, this.model[k].mode);
                }
            }
        }
        this.allTilesOK = true;
    }
    addGroupTile(parentSVGElement, anchor, layerMode) {
        let x = -this.translateX;
        let y = -this.translateY;
        let w = this.svg.clientWidth * this.translateZ;
        let h = this.svg.clientHeight * this.translateZ;
        let cX = 0;
        let cY = 0;
        if (this.viewWidth * this.translateZ > this.innerWidth) {
            if (this.stickLeft) {
            }
            else {
                cX = (this.viewWidth * this.translateZ - this.innerWidth) / 2;
                x = x - cX;
            }
        }
        if (this.viewHeight * this.translateZ > this.innerHeight) {
            cY = (this.viewHeight * this.translateZ - this.innerHeight) / 2;
            y = y - cY;
        }
        if (layerMode == LevelModes.overlay) {
            x = 0;
            y = 0;
        }
        else {
            if (layerMode == LevelModes.left) {
                x = 0;
            }
            else {
                if (layerMode == LevelModes.top) {
                    y = 0;
                }
                else {
                    if (layerMode == LevelModes.right) {
                        x = 0;
                    }
                    else {
                        if (layerMode == LevelModes.bottom) {
                            y = 0;
                        }
                    }
                }
            }
        }
        if (anchor.showZoom <= this.translateZ && anchor.hideZoom > this.translateZ) {
            if (this.collision(anchor.xx * this.tapSize, anchor.yy * this.tapSize, anchor.ww * this.tapSize, anchor.hh * this.tapSize, x, y, w, h)) {
                var gid = anchor.id ? anchor.id : '';
                let existedSVGchild = this.groupChildWithID(parentSVGElement, gid);
                if (existedSVGchild) {
                    if (anchor.translation) {
                        let tr = anchor.translation;
                        let translate = 'translate(' + (tr.x * this.tapSize) + ',' + (tr.y * this.tapSize) + ')';
                        existedSVGchild.setAttribute('transform', translate);
                    }
                    for (let n = 0; n < anchor.content.length; n++) {
                        let d = anchor.content[n];
                        if (isTileGroup(d)) {
                            this.addElement(existedSVGchild, d, layerMode);
                        }
                    }
                }
                else {
                    let g = document.createElementNS(this.svgns, 'g');
                    g.id = gid;
                    g.watchX = anchor.xx * this.tapSize;
                    g.watchY = anchor.yy * this.tapSize;
                    g.watchW = anchor.ww * this.tapSize;
                    g.watchH = anchor.hh * this.tapSize;
                    parentSVGElement.appendChild(g);
                    g.minZoom = anchor.showZoom;
                    g.maxZoom = anchor.hideZoom;
                    if (anchor.translation) {
                        let tr = anchor.translation;
                        let translate = 'translate(' + (tr.x * this.tapSize) + ',' + (tr.y * this.tapSize) + ')';
                        g.setAttribute('transform', translate);
                    }
                    if (anchor.css) {
                        g.classList.add(anchor.css);
                    }
                    for (let n = 0; n < anchor.content.length; n++) {
                        let d = anchor.content[n];
                        this.addElement(g, d, layerMode);
                    }
                }
            }
        }
    }
    groupChildWithID(group, id) {
        if (id) {
            if (group)
                this.msEdgeHook(group);
            for (let i = 0; i < group.children.length; i++) {
                let child = group.children[i];
                if (child.id == id) {
                    return child;
                }
            }
        }
        return null;
    }
    addElement(gg, dd, layerMode) {
        let element = null;
        if (isTileRectangle(dd)) {
            element = tileRectangle(this.svgns, this.tapSize, gg, dd.x * this.tapSize, dd.y * this.tapSize, dd.w * this.tapSize, dd.h * this.tapSize, (dd.rx ? dd.rx : 0) * this.tapSize, (dd.ry ? dd.ry : 0) * this.tapSize, (dd.css ? dd.css : ''), (dd.style ? dd.style : ''));
        }
        if (isTileImage(dd)) {
            element = tileImage(this.svgns, this.tapSize, gg, dd.x * this.tapSize, dd.y * this.tapSize, dd.w * this.tapSize, dd.h * this.tapSize, dd.href, dd.preserveAspectRatio, (dd.css ? dd.css : ''));
        }
        if (isTileText(dd)) {
            element = tileText(this.svgns, this.tapSize, gg, dd.x * this.tapSize, dd.y * this.tapSize, dd.text, dd.maxWidth ? dd.maxWidth : '', dd.css ? dd.css : '', dd.style ? dd.style : '');
        }
        if (isTilePath(dd)) {
            element = tilePath(this.svgns, this.tapSize, gg, (dd.x ? dd.x : 0) * this.tapSize, (dd.y ? dd.y : 0) * this.tapSize, (dd.scale ? dd.scale : 0), dd.points, dd.css ? dd.css : '');
        }
        if (isTilePolygon(dd)) {
            element = tilePolygon(this.svgns, this.tapSize, gg, (dd.x ? dd.x : 0) * this.tapSize, (dd.y ? dd.y : 0) * this.tapSize, dd.scale, dd.dots, dd.css);
        }
        if (isTileLine(dd)) {
            element = tileLine(this.svgns, this.tapSize, gg, dd.x1 * this.tapSize, dd.y1 * this.tapSize, dd.x2 * this.tapSize, dd.y2 * this.tapSize, dd.css);
        }
        if (isTileGroup(dd)) {
            this.addGroupTile(gg, dd, layerMode);
        }
        if (element) {
            if (dd.id)
                element.id = dd.id;
            if (dd.activation) {
                let me = this;
                if (dd.draggable) {
                    let dndstart = (mouseEvent) => {
                        me.currentDragItem = dd;
                    };
                    element.addEventListener('mousedown', dndstart, { capture: false, passive: false });
                    element.addEventListener('touchstart', dndstart, { capture: false, passive: false });
                }
                else {
                    element.onClickFunction = dd.activation;
                    let click = function () {
                        if (me.waitViewClickAction) {
                            if (element) {
                                if (element.onClickFunction) {
                                    let xx = element.getBoundingClientRect().left - me.svg.getBoundingClientRect().left;
                                    let yy = element.getBoundingClientRect().top - me.svg.getBoundingClientRect().top;
                                    element.onClickFunction(me.translateZ * (me.clickX - xx) / me.tapSize, me.translateZ * (me.clickY - yy) / me.tapSize);
                                }
                            }
                        }
                    };
                    element.onclick = click;
                    element.ontouchend = click;
                }
            }
        }
    }
    clearAllDetails() {
        if (this.model) {
            for (let i = 0; i < this.model.length; i++) {
                this.clearGroupDetails(this.model[i].g);
            }
        }
    }
    clearGroupDetails(group) {
        if (group)
            this.msEdgeHook(group);
        while (group.children.length) {
            group.removeChild(group.children[0]);
        }
    }
    autoID(definition) {
        if (definition) {
            if (definition.length) {
                for (let i = 0; i < definition.length; i++) {
                    if (!(definition[i].id)) {
                        definition[i].id = rid();
                    }
                    if (isTileGroup(definition[i])) {
                        let group = definition[i];
                        this.autoID(group.content);
                    }
                }
            }
        }
    }
    setModel(layers) {
        for (let i = 0; i < layers.length; i++) {
            this.autoID(layers[i].anchors);
        }
        this.model = layers;
        this.resetModel();
    }
    resetModel() {
        for (let i = 0; i < this.model.length; i++) {
            this.autoID(this.model[i].anchors);
        }
        this.clearAllDetails();
        this.applyZoomPosition();
        this.adjustContentPosition();
        this.slideToContentPosition();
        this.allTilesOK = false;
    }
    resetAnchor(parentSVGGroup, anchor, layerMode) {
        var gid = anchor.id ? anchor.id : '';
        let existedSVGchild = this.groupChildWithID(parentSVGGroup, gid);
        if (existedSVGchild) {
            parentSVGGroup.removeChild(existedSVGchild);
        }
        this.addGroupTile(parentSVGGroup, anchor, layerMode);
    }
    delayedResetAnchor(parentSVGGroup, anchor, layerMode) {
        let me = this;
        this.onResetAnchorDo.start(123, () => {
            me.resetAnchor(parentSVGGroup, anchor, layerMode);
        });
    }
    startLoop() {
        this.lastTickTime = new Date().getTime();
        this.tick();
    }
    tick() {
        let now = new Date().getTime();
        if (this.lastTickTime + 33 < now) {
            if (!(this.allTilesOK)) {
                this.queueTiles();
            }
            this.lastTickTime = new Date().getTime();
        }
        window.requestAnimationFrame(this.tick.bind(this));
    }
    setAfterResizeCallback(f) {
        this.afterResizeCallback = f;
    }
    setAfterZoomCallback(f) {
        this.afterZoomCallback = f;
    }
}
function isTilePath(t) {
    return t.points !== undefined;
}
function isTileText(t) {
    return t.text !== undefined;
}
function isTileLine(t) {
    return t.x1 !== undefined;
}
function isTilePolygon(t) {
    return t.dots !== undefined;
}
function isTileRectangle(t) {
    return t.h !== undefined;
}
function isTileImage(t) {
    return t.href !== undefined;
}
function isTileGroup(t) {
    return t.content !== undefined;
}
function rid() {
    return 'id' + Math.floor(Math.random() * 1000000000);
}
function nonEmptyID(id) {
    if (id) {
        return id;
    }
    else {
        return 'ID' + Math.floor(Math.random() * 1000000000);
    }
}
class CannyDo {
    constructor() {
        this.currentID = 0;
    }
    start(ms, action) {
        var startId = -1;
        this.currentID = setTimeout(function () {
            if (startId == this.currentID) {
                action();
            }
        }.bind(this), ms);
        startId = this.currentID;
    }
}
class LazyDo {
    constructor() {
        this.locked = false;
    }
    start(ms, action) {
        if (!this.locked) {
            this.locked = true;
            setTimeout(function () {
                action();
                this.locked = false;
            }.bind(this), ms);
        }
        else {
        }
    }
}
function cloneBaseDefiition(from) {
    var to = {};
    if (from.css)
        to.css = from.css;
    return to;
}
function cloneLine(from) {
    var to = cloneBaseDefiition(from);
    to.x1 = from.x1;
    to.x2 = from.x2;
    to.y1 = from.y1;
    to.y2 = from.y2;
    return to;
}
function cloneRectangle(from) {
    var to = cloneBaseDefiition(from);
    to.x = from.x;
    to.y = from.y;
    to.w = from.w;
    to.h = from.h;
    to.rx = from.rx;
    to.ry = from.ry;
    return to;
}
function vectorFromTouch(touch) {
    return {
        x: touch.clientX,
        y: touch.clientY
    };
}
function vectorFindCenter(xy1, xy2) {
    let xy = this.vectorAdd(xy1, xy2);
    return this.vectorScale(xy, 0.5);
}
;
function vectorAdd(xy1, xy2) {
    return {
        x: xy1.x + xy2.x,
        y: xy1.y + xy2.y
    };
}
;
function vectorScale(xy, coef) {
    return {
        x: xy.x * coef,
        y: xy.y * coef
    };
}
;
function vectorDistance(xy1, xy2) {
    let xy = this.vectorSubstract(xy1, xy2);
    let n = this.vectorNorm(xy);
    return n;
}
function vectorNorm(xy) {
    return Math.sqrt(this.vectorNormSquared(xy));
}
function vectorSubstract(xy1, xy2) {
    return {
        x: xy1.x - xy2.x,
        y: xy1.y - xy2.y
    };
}
function vectorNormSquared(xy) {
    return xy.x * xy.x + xy.y * xy.y;
}
function tileLine(svgns, tapSize, g, x1, y1, x2, y2, cssClass) {
    let line = document.createElementNS(svgns, 'line');
    line.setAttributeNS(null, 'x1', '' + x1);
    line.setAttributeNS(null, 'y1', '' + y1);
    line.setAttributeNS(null, 'x2', '' + x2);
    line.setAttributeNS(null, 'y2', '' + y2);
    if (cssClass) {
        line.setAttributeNS(null, 'class', cssClass);
    }
    g.appendChild(line);
    return line;
}
function tilePath(svgns, tapSize, g, x, y, z, data, cssClass) {
    let path = document.createElementNS(svgns, 'path');
    path.setAttributeNS(null, 'd', data);
    let t = "";
    if ((x) || (y)) {
        t = 'translate(' + x + ',' + y + ')';
    }
    if (z) {
        t = t + ' scale(' + z + ')';
    }
    if (t.length > 0) {
        path.setAttributeNS(null, 'transform', t);
    }
    if (cssClass) {
        path.setAttributeNS(null, 'class', cssClass);
    }
    g.appendChild(path);
    return path;
}
function tilePolygon(svgns, tapSize, g, x, y, z, dots, cssClass) {
    let polygon = document.createElementNS(svgns, 'polygon');
    let points = '';
    let dlmtr = '';
    for (let i = 0; i < dots.length; i = i + 2) {
        points = points + dlmtr + dots[i] * tapSize + ',' + dots[i + 1] * tapSize;
        dlmtr = ', ';
    }
    polygon.setAttributeNS(null, 'points', points);
    let t = "";
    if ((x) || (y)) {
        t = 'translate(' + x + ',' + y + ')';
    }
    if (z) {
        t = t + ' scale(' + z + ')';
    }
    if (t.length > 0) {
        polygon.setAttributeNS(null, 'transform', t);
    }
    if (cssClass) {
        polygon.setAttributeNS(null, 'class', cssClass);
    }
    g.appendChild(polygon);
    return polygon;
}
function tileRectangle(svgns, tapSize, g, x, y, w, h, rx, ry, cssClass, cssStyle) {
    let rect = document.createElementNS(svgns, 'rect');
    rect.setAttributeNS(null, 'x', '' + x);
    rect.setAttributeNS(null, 'y', '' + y);
    rect.setAttributeNS(null, 'height', '' + h);
    rect.setAttributeNS(null, 'width', '' + w);
    if (rx) {
        rect.setAttributeNS(null, 'rx', '' + rx);
    }
    if (ry) {
        rect.setAttributeNS(null, 'ry', '' + ry);
    }
    if (cssClass) {
        rect.setAttributeNS(null, 'class', cssClass);
    }
    else {
        if (cssStyle) {
            rect.setAttributeNS(null, 'style', cssStyle);
        }
    }
    g.appendChild(rect);
    return rect;
}
function tileImage(svgns, tapSize, g, x, y, w, h, href, preserveAspectRatio, cssClass) {
    let img = document.createElementNS(svgns, 'image');
    img.setAttributeNS(null, 'x', '' + x);
    img.setAttributeNS(null, 'y', '' + y);
    img.setAttributeNS(null, 'height', '' + h);
    img.setAttributeNS(null, 'width', '' + w);
    if (preserveAspectRatio) {
        img.setAttributeNS(null, 'preserveAspectRatio', preserveAspectRatio);
    }
    else {
        img.setAttributeNS(null, 'preserveAspectRatio', 'xMidYMid meet');
    }
    if (cssClass) {
        img.classList.add(cssClass);
    }
    if (href) {
        img.setAttributeNS(null, 'href', href);
    }
    g.appendChild(img);
    return img;
}
function tileText(svgns, tapSize, g, x, y, html, maxWidth, cssClass, cssStyle) {
    let txt = document.createElementNS(svgns, 'text');
    txt.setAttributeNS(null, 'x', '' + x);
    txt.setAttributeNS(null, 'y', '' + y);
    if (cssClass) {
        txt.setAttributeNS(null, 'class', cssClass);
    }
    else {
        if (cssStyle) {
            txt.setAttributeNS(null, 'style', cssStyle);
        }
    }
    if (maxWidth) {
    }
    txt.innerHTML = html;
    g.appendChild(txt);
    return txt;
}
console.log('Tile Level API');
var LevelModes;
(function (LevelModes) {
    LevelModes[LevelModes["normal"] = 0] = "normal";
    LevelModes[LevelModes["left"] = 1] = "left";
    LevelModes[LevelModes["right"] = 2] = "right";
    LevelModes[LevelModes["top"] = 3] = "top";
    LevelModes[LevelModes["bottom"] = 4] = "bottom";
    LevelModes[LevelModes["overlay"] = 5] = "overlay";
})(LevelModes || (LevelModes = {}));
;
function TAnchor(xx, yy, ww, hh, showZoom, hideZoom, id, translation) {
    return { xx: xx, yy: yy, ww: ww, hh: hh, showZoom: showZoom, hideZoom: hideZoom, content: [], id: id };
}
function TText(x, y, css, text) {
    return { x: x, y: y, text: text, css: css, };
}
//# sourceMappingURL=tilerender.js.map