"use strict";
console.log('MuzXBox v1.01');
var ZInputDeviceHandler = (function () {
    function ZInputDeviceHandler(from) {
        var me = this;
        this.muzXBox = from;
        window.addEventListener("keydown", function (keyboardEvent) {
            me.processKeyboardEvent(keyboardEvent);
        });
    }
    ZInputDeviceHandler.prototype.processKeyboardEvent = function (keyboardEvent) {
        switch (keyboardEvent.code) {
            case 'KeyX':
                keyboardEvent.preventDefault();
                this.processKeyX();
                break;
            case 'KeyY':
                keyboardEvent.preventDefault();
                this.processKeyY();
                break;
            case 'KeyA':
                keyboardEvent.preventDefault();
                this.processKeyA();
                break;
            case 'KeyB':
                keyboardEvent.preventDefault();
                this.processKeyB();
                break;
            case 'ArrowLeft':
                keyboardEvent.preventDefault();
                this.processArrowLeft();
                break;
            case 'ArrowRight':
                keyboardEvent.preventDefault();
                this.processArrowRight();
                break;
            case 'ArrowUp':
                keyboardEvent.preventDefault();
                this.processArrowUp();
                break;
            case 'ArrowDown':
                keyboardEvent.preventDefault();
                this.processArrowDown();
                break;
            default:
                switch (keyboardEvent.key) {
                    case '+':
                        keyboardEvent.preventDefault();
                        this.processAnyPlus();
                        break;
                    case '-':
                        keyboardEvent.preventDefault();
                        this.processAnyMinus();
                        break;
                    default:
                }
        }
    };
    ZInputDeviceHandler.prototype.processKeyX = function () {
    };
    ZInputDeviceHandler.prototype.processKeyY = function () {
    };
    ZInputDeviceHandler.prototype.processKeyA = function () {
    };
    ZInputDeviceHandler.prototype.processKeyB = function () {
    };
    ZInputDeviceHandler.prototype.processAnyPlus = function () {
        if (this.muzXBox.zMainMenu.currentLevel) {
        }
        else {
            var zoom = this.muzXBox.zrenderer.tileLevel.translateZ - this.muzXBox.zrenderer.tileLevel.translateZ * 0.25;
            this.changeZoomTo(zoom);
        }
    };
    ZInputDeviceHandler.prototype.processAnyMinus = function () {
        if (this.muzXBox.zMainMenu.currentLevel) {
        }
        else {
            var zoom = this.muzXBox.zrenderer.tileLevel.translateZ + this.muzXBox.zrenderer.tileLevel.translateZ * 0.25;
            this.changeZoomTo(zoom);
        }
    };
    ZInputDeviceHandler.prototype.processArrowLeft = function () {
        if (this.muzXBox.zMainMenu.currentLevel) {
        }
        else {
            var nn = this.muzXBox.zrenderer.tileLevel.translateX - this.muzXBox.zrenderer.tileLevel.translateZ * 25;
            this.changePositionTo(nn, this.muzXBox.zrenderer.tileLevel.translateY);
        }
    };
    ZInputDeviceHandler.prototype.processArrowRight = function () {
        if (this.muzXBox.zMainMenu.currentLevel) {
        }
        else {
            var nn = this.muzXBox.zrenderer.tileLevel.translateX + this.muzXBox.zrenderer.tileLevel.translateZ * 25;
            this.changePositionTo(nn, this.muzXBox.zrenderer.tileLevel.translateY);
        }
    };
    ZInputDeviceHandler.prototype.processArrowUp = function () {
        if (this.muzXBox.zMainMenu.currentLevel) {
        }
        else {
            var nn = this.muzXBox.zrenderer.tileLevel.translateY - this.muzXBox.zrenderer.tileLevel.translateZ * 25;
            this.changePositionTo(this.muzXBox.zrenderer.tileLevel.translateX, nn);
        }
    };
    ZInputDeviceHandler.prototype.processArrowDown = function () {
        if (this.muzXBox.zMainMenu.currentLevel) {
        }
        else {
            var nn = this.muzXBox.zrenderer.tileLevel.translateY + this.muzXBox.zrenderer.tileLevel.translateZ * 25;
            this.changePositionTo(this.muzXBox.zrenderer.tileLevel.translateX, nn);
        }
    };
    ZInputDeviceHandler.prototype.changePositionTo = function (xx, yy) {
        this.muzXBox.zrenderer.tileLevel.translateX = xx;
        this.muzXBox.zrenderer.tileLevel.translateY = yy;
        this.muzXBox.zrenderer.tileLevel.applyZoomPosition();
        this.muzXBox.zrenderer.tileLevel.onMove(xx, yy);
        var a = this.muzXBox.zrenderer.tileLevel.calculateValidContentPosition();
        if (a.x != this.muzXBox.zrenderer.tileLevel.translateX || a.y != this.muzXBox.zrenderer.tileLevel.translateY || a.z != this.muzXBox.zrenderer.tileLevel.translateZ) {
            this.muzXBox.zrenderer.tileLevel.translateX = a.x;
            this.muzXBox.zrenderer.tileLevel.translateY = a.y;
        }
        this.muzXBox.zrenderer.tileLevel.allTilesOK = false;
    };
    ZInputDeviceHandler.prototype.changeZoomTo = function (zoom) {
        if (zoom < this.muzXBox.zrenderer.tileLevel.minZoom()) {
            zoom = this.muzXBox.zrenderer.tileLevel.minZoom();
        }
        if (zoom > this.muzXBox.zrenderer.tileLevel.maxZoom()) {
            zoom = this.muzXBox.zrenderer.tileLevel.maxZoom();
        }
        this.muzXBox.zrenderer.tileLevel.translateZ = zoom;
        this.muzXBox.zrenderer.tileLevel.applyZoomPosition();
        this.muzXBox.zrenderer.tileLevel.adjustContentPosition();
        this.muzXBox.zrenderer.tileLevel.allTilesOK = false;
    };
    return ZInputDeviceHandler;
}());
console.log('tilelevel v2.17');
var TileLevel = (function () {
    function TileLevel(svgObject, inWidth, inHeight, minZoom, curZoom, maxZoom, layers) {
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
        this.clicked = false;
        this.mx = 100;
        this.mn = 1;
        this.startedTouch = false;
        this.twodistance = 0;
        this.model = [];
        this.slidingLockTo = 0;
        this.slidingID = 0;
        this.onResizeDo = new CannyDo();
        this.onZoom = new CannyDo();
        this.lastTickTime = 0;
        this.fastenUp = true;
        this.fastenDown = true;
        this.fastenLeft = true;
        this.fastenRight = true;
        this.lastMoveDx = 0;
        this.lastMoveDy = 0;
        this.lastMoveDt = 0;
        this.dragTileItem = null;
        this.dragTileSVGelement = null;
        this.dragSVGparent = null;
        this.draggedX = 0;
        this.draggedY = 0;
        this.dragTranslateX = 0;
        this.dragTranslateY = 0;
        this.mouseDownMode = false;
        this.svg = svgObject;
        this.setupTapSize();
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
    Object.defineProperty(TileLevel.prototype, "allTilesOK", {
        get: function () {
            return this._allTilesOK;
        },
        set: function (bb) {
            if (bb != this._allTilesOK) {
                this._allTilesOK = bb;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileLevel.prototype, "translateZ", {
        get: function () {
            return this._translateZ;
        },
        set: function (z) {
            if (z != this._translateZ) {
                this._translateZ = z;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileLevel.prototype, "translateX", {
        get: function () {
            return this._translateX;
        },
        set: function (x) {
            if (x != this._translateX) {
                this._translateX = x;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TileLevel.prototype, "translateY", {
        get: function () {
            return this._translateY;
        },
        set: function (y) {
            if (y != this._translateY) {
                this._translateY = y;
            }
        },
        enumerable: false,
        configurable: true
    });
    TileLevel.prototype.dump = function () {
        console.log('dump', this);
    };
    TileLevel.prototype.setupTapSize = function () {
        var rect = document.createElementNS(this.svgns, 'rect');
        rect.setAttributeNS(null, 'height', '1cm');
        rect.setAttributeNS(null, 'width', '1cm');
        this.svg.appendChild(rect);
        var tbb = rect.getBBox();
        this.tapSize = tbb.width;
        this.svg.removeChild(rect);
        this.clickLimit = this.tapSize / 6;
    };
    TileLevel.prototype.onAfterResize = function () {
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
    };
    TileLevel.prototype.onMove = function (dx, dy) {
        var d = new Date();
        this.lastMoveDx = dx;
        this.lastMoveDy = dy;
        this.lastMoveDt = Date.now();
    };
    TileLevel.prototype.moveTail = function (speed) {
        var dx = this.translateX + 2 * this.tapSize * speed * this.lastMoveDx;
        var dy = this.translateY + 2 * this.tapSize * speed * this.lastMoveDy;
        this.startSlideTo(dx, dy, this.translateZ, function () {
        }.bind(this));
    };
    TileLevel.prototype.rakeMouseWheel = function (e) {
        this.slidingLockTo = -1;
        e.preventDefault();
        var wheelVal = e.deltaY;
        var min = Math.min(1, wheelVal);
        var delta = Math.max(-1, min);
        var zoom = this.translateZ - delta * (this.translateZ) * 0.077;
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
    };
    TileLevel.prototype.rakeMouseDown = function (mouseEvent) {
        this.slidingLockTo = -1;
        mouseEvent.preventDefault();
        this.startMouseScreenX = mouseEvent.offsetX;
        this.startMouseScreenY = mouseEvent.offsetY;
        if (this.dragTileItem) {
        }
        else {
            this.mouseDownMode = true;
            this.clickX = this.startMouseScreenX;
            this.clickY = this.startMouseScreenY;
            this.clicked = false;
            this.startDragZoom();
        }
    };
    TileLevel.prototype.rakeMouseMove = function (mouseEvent) {
        var dX = mouseEvent.offsetX - this.startMouseScreenX;
        var dY = mouseEvent.offsetY - this.startMouseScreenY;
        this.startMouseScreenX = mouseEvent.offsetX;
        this.startMouseScreenY = mouseEvent.offsetY;
        if (this.mouseDownMode) {
            mouseEvent.preventDefault();
            this.translateX = this.translateX + dX * this.translateZ;
            this.translateY = this.translateY + dY * this.translateZ;
            this.applyZoomPosition();
            this.onMove(dX, dY);
        }
        else {
            if (this.dragTileItem) {
                if (this.dragTileSVGelement) {
                    var ex = this.dragTranslateX + dX * this.translateZ;
                    var ey = this.dragTranslateY + dY * this.translateZ;
                    if (!(this.dragTileItem.dragX))
                        ex = 0;
                    if (!(this.dragTileItem.dragY))
                        ey = 0;
                    this.draggedX = this.draggedX + dX;
                    this.draggedY = this.draggedY + dY;
                    if (this.dragSVGparent)
                        this.dragSVGparent.setAttributeNS(null, 'transform', 'translate(' + ex + ', ' + ey + ')');
                    this.dragTranslateX = ex;
                    this.dragTranslateY = ey;
                }
            }
        }
    };
    TileLevel.prototype.rakeMouseUp = function (mouseEvent) {
        if (this.mouseDownMode) {
            this.mouseDownMode = false;
            mouseEvent.preventDefault();
            this.cancelDragZoom();
            this.clicked = false;
            var diffX = Math.abs(this.clickX - this.startMouseScreenX);
            var diffY = Math.abs(this.clickY - this.startMouseScreenY);
            if (diffX < this.clickLimit && diffY < this.clickLimit) {
                this.clicked = true;
                this.slideToContentPosition();
                this.allTilesOK = false;
            }
            else {
                this.slideToContentPosition();
                this.allTilesOK = false;
            }
        }
        else {
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
            }
        }
        this.dragTileItem = null;
    };
    TileLevel.prototype.rakeTouchStart = function (touchEvent) {
        this.slidingLockTo = -1;
        touchEvent.preventDefault();
        if (this.dragTileItem) {
        }
        else {
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
            }
            else {
                this.startTouchZoom(touchEvent);
            }
        }
    };
    TileLevel.prototype.rakeTouchMove = function (touchEvent) {
        touchEvent.preventDefault();
        if (this.startedTouch) {
            if (touchEvent.touches.length < 2) {
                if (this.twoZoom) {
                }
                else {
                    var dX = touchEvent.touches[0].clientX - this.startMouseScreenX;
                    var dY = touchEvent.touches[0].clientY - this.startMouseScreenY;
                    this.translateX = this.translateX + dX * this.translateZ;
                    this.translateY = this.translateY + dY * this.translateZ;
                    this.startMouseScreenX = touchEvent.touches[0].clientX;
                    this.startMouseScreenY = touchEvent.touches[0].clientY;
                    this.applyZoomPosition();
                    this.onMove(dX, dY);
                    return;
                }
            }
            else {
                if (!this.twoZoom) {
                    this.startTouchZoom(touchEvent);
                }
                else {
                    var p1 = this.vectorFromTouch(touchEvent.touches[0]);
                    var p2 = this.vectorFromTouch(touchEvent.touches[1]);
                    var d = this.vectorDistance(p1, p2);
                    if (d <= 0) {
                        d = 1;
                    }
                    var ratio = d / this.twodistance;
                    this.twodistance = d;
                    var zoom = this.translateZ / ratio;
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
                }
            }
        }
        else {
            if (this.dragTileItem) {
                if (this.dragTileSVGelement) {
                    var dX = touchEvent.touches[0].clientX - this.startMouseScreenX;
                    var dY = touchEvent.touches[0].clientY - this.startMouseScreenY;
                    this.startMouseScreenX = touchEvent.touches[0].clientX;
                    this.startMouseScreenY = touchEvent.touches[0].clientY;
                    var ex = this.dragTranslateX + dX * this.translateZ;
                    var ey = this.dragTranslateY + dY * this.translateZ;
                    if (!(this.dragTileItem.dragX))
                        ex = 0;
                    if (!(this.dragTileItem.dragY))
                        ey = 0;
                    this.draggedX = this.draggedX + dX;
                    this.draggedY = this.draggedY + dY;
                    if (this.dragSVGparent)
                        this.dragSVGparent.setAttributeNS(null, 'transform', 'translate(' + ex + ', ' + ey + ')');
                    this.dragTranslateX = ex;
                    this.dragTranslateY = ey;
                }
            }
        }
    };
    TileLevel.prototype.rakeTouchEnd = function (touchEvent) {
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
        }
        else {
            this.allTilesOK = false;
            if (!this.twoZoom) {
                if (touchEvent.touches.length < 2) {
                    this.cancelDragZoom();
                    this.clicked = false;
                    if (this.startedTouch) {
                        var diffX = Math.abs(this.clickX - this.startMouseScreenX);
                        var diffY = Math.abs(this.clickY - this.startMouseScreenY);
                        if (diffX < this.clickLimit && diffY < this.clickLimit) {
                            this.clicked = true;
                            this.slideToContentPosition();
                        }
                        else {
                            this.clicked = false;
                            this.slideToContentPosition();
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
    };
    TileLevel.prototype.startDragZoom = function () {
        this.dragZoom = 1.002;
        this.applyZoomPosition();
    };
    ;
    TileLevel.prototype.cancelDragZoom = function () {
        this.dragZoom = 1.0;
        this.applyZoomPosition();
    };
    ;
    TileLevel.prototype.applyZoomPosition = function () {
        var rx = -this.translateX - this.dragZoom * this.translateZ * (this.viewWidth - this.viewWidth / this.dragZoom) * (this.clickX / this.viewWidth);
        var ry = -this.translateY - this.dragZoom * this.translateZ * (this.viewHeight - this.viewHeight / this.dragZoom) * (this.clickY / this.viewHeight);
        var rw = this.viewWidth * this.translateZ * this.dragZoom;
        var rh = this.viewHeight * this.translateZ * this.dragZoom;
        this.svg.setAttribute('viewBox', rx + ' ' + ry + ' ' + rw + ' ' + rh);
        if (this.model) {
            for (var k = 0; k < this.model.length; k++) {
                var layer = this.model[k];
                var tx = 0;
                var ty = 0;
                var tz = 1;
                var cX = 0;
                var cY = 0;
                var sX = 0;
                var sY = 0;
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
                }
                else {
                    if (isLayerStickLeft(layer)) {
                        tx = -this.translateX;
                        cX = 0;
                        if (layer.stickLeft) {
                            sX = layer.stickLeft * this.tapSize * this.translateZ;
                        }
                    }
                    else {
                        if (isLayerStickTop(layer)) {
                            ty = -this.translateY;
                            cY = 0;
                            if (layer.stickTop) {
                                sY = layer.stickTop * this.tapSize * this.translateZ;
                            }
                        }
                        else {
                            if (isLayerStickBottom(layer)) {
                                ty = -this.translateY;
                                cY = 0;
                                sY = this.viewHeight * this.translateZ;
                                if (layer.stickBottom) {
                                    sY = this.viewHeight * this.translateZ - layer.stickBottom * this.tapSize;
                                }
                            }
                            else {
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
        }
        this.checkAfterZoom();
    };
    TileLevel.prototype.checkAfterZoom = function () {
        this.onZoom.start(555, function () {
            if (this.afterZoomCallback)
                this.afterZoomCallback();
        }.bind(this));
    };
    TileLevel.prototype.slideToContentPosition = function () {
        var a = this.calculateValidContentPosition();
        if (a.x != this.translateX || a.y != this.translateY || a.z != this.translateZ) {
            this.startSlideTo(a.x, a.y, a.z, null);
        }
    };
    TileLevel.prototype.maxZoom = function () {
        return this.mx;
    };
    ;
    TileLevel.prototype.minZoom = function () {
        return this.mn;
    };
    ;
    TileLevel.prototype.adjustContentPosition = function () {
        var a = this.calculateValidContentPosition();
        if (a.x != this.translateX || a.y != this.translateY || a.z != this.translateZ) {
            this.translateX = a.x;
            this.translateY = a.y;
            this.translateZ = a.z;
            this.applyZoomPosition();
        }
    };
    TileLevel.prototype.calculateValidContentPosition = function () {
        var vX = this.translateX;
        var vY = this.translateY;
        var vZ = this.translateZ;
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
    };
    TileLevel.prototype.startTouchZoom = function (touchEvent) {
        this.twoZoom = true;
        var p1 = this.vectorFromTouch(touchEvent.touches[0]);
        var p2 = this.vectorFromTouch(touchEvent.touches[1]);
        this.twocenter = this.vectorFindCenter(p1, p2);
        var d = this.vectorDistance(p1, p2);
        if (d <= 0) {
            d = 1;
        }
        this.twodistance = d;
    };
    TileLevel.prototype.vectorFromTouch = function (touch) {
        return {
            x: touch.clientX,
            y: touch.clientY
        };
    };
    TileLevel.prototype.vectorFindCenter = function (xy1, xy2) {
        var xy = this.vectorAdd(xy1, xy2);
        return this.vectorScale(xy, 0.5);
    };
    ;
    TileLevel.prototype.vectorAdd = function (xy1, xy2) {
        return {
            x: xy1.x + xy2.x,
            y: xy1.y + xy2.y
        };
    };
    ;
    TileLevel.prototype.vectorScale = function (xy, coef) {
        return {
            x: xy.x * coef,
            y: xy.y * coef
        };
    };
    ;
    TileLevel.prototype.vectorDistance = function (xy1, xy2) {
        var xy = this.vectorSubstract(xy1, xy2);
        var n = this.vectorNorm(xy);
        return n;
    };
    TileLevel.prototype.vectorNorm = function (xy) {
        return Math.sqrt(this.vectorNormSquared(xy));
    };
    TileLevel.prototype.vectorSubstract = function (xy1, xy2) {
        return {
            x: xy1.x - xy2.x,
            y: xy1.y - xy2.y
        };
    };
    TileLevel.prototype.vectorNormSquared = function (xy) {
        return xy.x * xy.x + xy.y * xy.y;
    };
    TileLevel.prototype.startSlideCenter = function (x, y, z, w, h, action) {
        var dx = (z * this.viewWidth / this.tapSize - w) / 2;
        var dy = (z * this.viewHeight / this.tapSize - h) / 2;
        this.startSlideTo((dx - x) * this.tapSize, (dy - y) * this.tapSize, z, action);
    };
    TileLevel.prototype.startSlideTo = function (x, y, z, action) {
        this.startStepSlideTo(20, x, y, z, action);
    };
    TileLevel.prototype.startStepSlideTo = function (s, x, y, z, action) {
        clearTimeout(this.slidingID);
        var stepCount = s;
        var xyz = [];
        for (var i = 0; i < stepCount; i++) {
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
    };
    TileLevel.prototype.stepSlideTo = function (key, xyz, action) {
        var n = xyz.shift();
        if (n) {
            if (key == this.slidingLockTo) {
                this.translateX = n.x;
                this.translateY = n.y;
                this.translateZ = n.z;
                this.applyZoomPosition();
                var main_1 = this;
                this.slidingID = setTimeout(function () {
                    main_1.stepSlideTo(key, xyz, action);
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
    };
    TileLevel.prototype.queueTiles = function () {
        this.clearUselessDetails();
        this.tileFromModel();
    };
    TileLevel.prototype.clearUselessDetails = function () {
        if (this.model) {
            for (var k = 0; k < this.model.length; k++) {
                var group = this.model[k].g;
                this.clearUselessGroups(group, this.model[k]);
            }
        }
    };
    TileLevel.prototype.clearUselessGroups = function (group, layer) {
        var x = -this.translateX;
        var y = -this.translateY;
        var w = this.svg.clientWidth * this.translateZ;
        var h = this.svg.clientHeight * this.translateZ;
        var cX = 0;
        var cY = 0;
        if (this.viewWidth * this.translateZ > this.innerWidth) {
            cX = (this.viewWidth * this.translateZ - this.innerWidth) / 2;
            x = x - cX;
        }
        if (this.viewHeight * this.translateZ > this.innerHeight) {
            cY = (this.viewHeight * this.translateZ - this.innerHeight) / 2;
            y = y - cY;
        }
        if (isLayerOverlay(layer)) {
            x = 0;
            y = 0;
        }
        else {
            if (isLayerStickLeft(layer)) {
                x = 0;
            }
            else {
                if (isLayerStickTop(layer)) {
                    y = 0;
                }
                else {
                    if (isLayerStickRight(layer)) {
                        x = 0;
                    }
                    else {
                        if (isLayerStickBottom(layer)) {
                            y = 0;
                        }
                    }
                }
            }
        }
        if (group)
            this.msEdgeHook(group);
        for (var i = 0; i < group.children.length; i++) {
            var child = group.children[i];
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
    };
    TileLevel.prototype.msEdgeHook = function (g) {
        if (g.childNodes && (!(g.children))) {
            g.children = g.childNodes;
        }
    };
    TileLevel.prototype.outOfWatch = function (g, x, y, w, h) {
        var watchX = g.watchX;
        var watchY = g.watchY;
        var watchW = g.watchW;
        var watchH = g.watchH;
        return !(this.collision(watchX, watchY, watchW, watchH, x, y, w, h));
    };
    TileLevel.prototype.collision = function (x1, y1, w1, h1, x2, y2, w2, h2) {
        if (this.collision2(x1, w1, x2, w2) && this.collision2(y1, h1, y2, h2)) {
            return true;
        }
        else {
            return false;
        }
    };
    TileLevel.prototype.collision2 = function (x, w, left, width) {
        if (x + w <= left || x >= left + width) {
            return false;
        }
        else {
            return true;
        }
    };
    TileLevel.prototype.tileFromModel = function () {
        if (this.model) {
            for (var k = 0; k < this.model.length; k++) {
                var svggroup = this.model[k].g;
                var arr = this.model[k].anchors;
                for (var i = 0; i < arr.length; i++) {
                    var a = arr[i];
                    this.addGroupTile(svggroup, a, this.model[k]);
                }
            }
        }
        this.allTilesOK = true;
    };
    TileLevel.prototype.addGroupTile = function (parentSVGElement, anchor, layer) {
        var x = -this.translateX;
        var y = -this.translateY;
        var w = this.svg.clientWidth * this.translateZ;
        var h = this.svg.clientHeight * this.translateZ;
        var cX = 0;
        var cY = 0;
        if (this.viewWidth * this.translateZ > this.innerWidth) {
            cX = (this.viewWidth * this.translateZ - this.innerWidth) / 2;
            x = x - cX;
        }
        if (this.viewHeight * this.translateZ > this.innerHeight) {
            cY = (this.viewHeight * this.translateZ - this.innerHeight) / 2;
            y = y - cY;
        }
        if (isLayerOverlay(layer)) {
            x = 0;
            y = 0;
        }
        else {
            if (isLayerStickLeft(layer)) {
                x = 0;
            }
            else {
                if (isLayerStickTop(layer)) {
                    y = 0;
                }
                else {
                    if (isLayerStickRight(layer)) {
                        x = 0;
                    }
                    else {
                        if (isLayerStickBottom(layer)) {
                            y = 0;
                        }
                    }
                }
            }
        }
        if (anchor.showZoom <= this.translateZ && anchor.hideZoom > this.translateZ) {
            if (this.collision(anchor.xx * this.tapSize, anchor.yy * this.tapSize, anchor.ww * this.tapSize, anchor.hh * this.tapSize, x, y, w, h)) {
                var gid = anchor.id ? anchor.id : '';
                var xg = this.childExists(parentSVGElement, gid);
                if (xg) {
                    for (var n = 0; n < anchor.content.length; n++) {
                        var d = anchor.content[n];
                        if (isTileGroup(d)) {
                            this.addElement(xg, d, layer);
                        }
                    }
                }
                else {
                    var g = document.createElementNS(this.svgns, 'g');
                    g.id = gid;
                    g.watchX = anchor.xx * this.tapSize;
                    g.watchY = anchor.yy * this.tapSize;
                    g.watchW = anchor.ww * this.tapSize;
                    g.watchH = anchor.hh * this.tapSize;
                    parentSVGElement.appendChild(g);
                    g.minZoom = anchor.showZoom;
                    g.maxZoom = anchor.hideZoom;
                    for (var n = 0; n < anchor.content.length; n++) {
                        var d = anchor.content[n];
                        this.addElement(g, d, layer);
                    }
                }
            }
        }
    };
    TileLevel.prototype.childExists = function (group, id) {
        if (id) {
            if (group)
                this.msEdgeHook(group);
            for (var i = 0; i < group.children.length; i++) {
                var child = group.children[i];
                if (child.id == id) {
                    return child;
                }
            }
        }
        return null;
    };
    TileLevel.prototype.addElement = function (g, dd, layer) {
        var element = null;
        if (isTileRectangle(dd)) {
            element = tileRectangle(this.svgns, this.tapSize, g, dd.x * this.tapSize, dd.y * this.tapSize, dd.w * this.tapSize, dd.h * this.tapSize, (dd.rx ? dd.rx : 0) * this.tapSize, (dd.ry ? dd.ry : 0) * this.tapSize, (dd.css ? dd.css : ''));
        }
        if (isTileText(dd)) {
            element = tileText(this.svgns, this.tapSize, g, dd.x * this.tapSize, dd.y * this.tapSize, dd.text, dd.css ? dd.css : '');
        }
        if (isTilePath(dd)) {
            element = tilePath(this.svgns, this.tapSize, g, (dd.x ? dd.x : 0) * this.tapSize, (dd.y ? dd.y : 0) * this.tapSize, (dd.scale ? dd.scale : 0), dd.points, dd.css ? dd.css : '');
        }
        if (isTilePolygon(dd)) {
            element = tilePolygon(this.svgns, this.tapSize, g, (dd.x ? dd.x : 0) * this.tapSize, (dd.y ? dd.y : 0) * this.tapSize, dd.scale, dd.dots, dd.css);
        }
        if (isTileLine(dd)) {
            element = tileLine(this.svgns, this.tapSize, g, dd.x1 * this.tapSize, dd.y1 * this.tapSize, dd.x2 * this.tapSize, dd.y2 * this.tapSize, dd.css);
        }
        if (isTileGroup(dd)) {
            this.addGroupTile(g, dd, layer);
        }
        if (element) {
            if (dd.id)
                element.id = dd.id;
            if (dd.action) {
                element.onClickFunction = dd.action;
                var me_1 = this;
                var click = function () {
                    if (me_1.clicked) {
                        if (element) {
                            if (element.onClickFunction) {
                                var xx = element.getBoundingClientRect().left - me_1.svg.getBoundingClientRect().left;
                                var yy = element.getBoundingClientRect().top - me_1.svg.getBoundingClientRect().top;
                                element.onClickFunction(me_1.translateZ * (me_1.clickX - xx) / me_1.tapSize, me_1.translateZ * (me_1.clickY - yy) / me_1.tapSize);
                            }
                        }
                    }
                };
                element.onclick = click;
                element.ontouchend = click;
                if ((dd.dragX) || (dd.dragY)) {
                    var onStartDrag_1 = function (elmnt, ev) {
                        me_1.dragTileItem = dd;
                        me_1.dragTileSVGelement = element;
                        me_1.dragSVGparent = g;
                        me_1.draggedX = 0;
                        me_1.draggedY = 0;
                        me_1.dragTranslateX = 0;
                        me_1.dragTranslateY = 0;
                        me_1.startedTouch = false;
                    };
                    var startTouchDrag = function (ev) {
                        onStartDrag_1(element, ev);
                    };
                    var startMouseDrag = function (ev) {
                        onStartDrag_1(element, ev);
                    };
                    element.onmousedown = startMouseDrag;
                    element.ontouchstart = startTouchDrag;
                }
            }
        }
    };
    TileLevel.prototype.clearAllDetails = function () {
        if (this.model) {
            for (var i = 0; i < this.model.length; i++) {
                this.clearGroupDetails(this.model[i].g);
            }
        }
    };
    TileLevel.prototype.clearGroupDetails = function (group) {
        if (group)
            this.msEdgeHook(group);
        while (group.children.length) {
            group.removeChild(group.children[0]);
        }
    };
    TileLevel.prototype.autoID = function (definition) {
        if (definition) {
            if (definition.length) {
                for (var i = 0; i < definition.length; i++) {
                    if (!(definition[i].id)) {
                        definition[i].id = rid();
                    }
                    if (isTileGroup(definition[i])) {
                        var group = definition[i];
                        this.autoID(group.content);
                    }
                }
            }
        }
    };
    TileLevel.prototype.setModel = function (layers) {
        for (var i = 0; i < layers.length; i++) {
            this.autoID(layers[i].anchors);
        }
        this.model = layers;
        this.resetModel();
    };
    TileLevel.prototype.resetModelAndRun = function (afterDone) {
        this.resetModel();
    };
    TileLevel.prototype.resetModel = function () {
        for (var i = 0; i < this.model.length; i++) {
            this.autoID(this.model[i].anchors);
        }
        this.clearAllDetails();
        this.applyZoomPosition();
        this.adjustContentPosition();
        this.slideToContentPosition();
        this.allTilesOK = false;
    };
    TileLevel.prototype.resetAnchor = function (anchor, fromSVGGroup) {
        var gid = anchor.id ? anchor.id : '';
        var xg = this.childExists(fromSVGGroup, gid);
        if (xg) {
            fromSVGGroup.removeChild(xg);
        }
    };
    TileLevel.prototype.redrawAnchor = function (anchor) {
        if (anchor.id) {
            for (var i = 0; i < this.model.length; i++) {
                var layer = this.model[i];
                var svgEl = layer.g;
                if (this.removeFromTree(anchor, svgEl, layer)) {
                    return true;
                }
            }
        }
        return false;
    };
    TileLevel.prototype.removeFromTree = function (anchor, parentSVG, layer) {
        if (parentSVG)
            this.msEdgeHook(parentSVG);
        if (anchor.id) {
            for (var i = 0; i < parentSVG.children.length; i++) {
                var child = parentSVG.children[i];
                if (child.id == anchor.id) {
                    parentSVG.removeChild(child);
                    this.addGroupTile(parentSVG, anchor, layer);
                    return true;
                }
                else {
                    if (child.localName == 'g') {
                        if (this.removeFromTree(anchor, child, layer)) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    };
    TileLevel.prototype.startLoop = function () {
        this.lastTickTime = new Date().getTime();
        this.tick();
    };
    TileLevel.prototype.tick = function () {
        var now = new Date().getTime();
        if (this.lastTickTime + 33 < now) {
            if (!(this.allTilesOK)) {
                this.queueTiles();
            }
            this.lastTickTime = new Date().getTime();
        }
        window.requestAnimationFrame(this.tick.bind(this));
    };
    return TileLevel;
}());
var CannyDo = (function () {
    function CannyDo() {
        this.currentID = 0;
    }
    CannyDo.prototype.start = function (ms, action) {
        var startId = -1;
        this.currentID = setTimeout(function () {
            if (startId == this.currentID) {
                action();
            }
            else {
            }
        }.bind(this), ms);
        startId = this.currentID;
    };
    return CannyDo;
}());
function TAnchor(xx, yy, ww, hh, showZoom, hideZoom) {
    return { xx: xx, yy: yy, ww: ww, hh: hh, showZoom: showZoom, hideZoom: hideZoom, content: [] };
}
function TText(x, y, css, text) {
    return { x: x, y: y, text: text, css: css, };
}
function cloneBaseDefiition(from) {
    var to = {};
    if (from.css)
        to.css = from.css;
    if (from.dragX)
        to.dragX = from.dragX;
    if (from.dragY)
        to.dragY = from.dragY;
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
function tilePolygon(svgns, tapSize, g, x, y, z, dots, cssClass) {
    var polygon = document.createElementNS(svgns, 'polygon');
    var points = '';
    var dlmtr = '';
    for (var i = 0; i < dots.length; i = i + 2) {
        points = points + dlmtr + dots[i] * tapSize + ',' + dots[i + 1] * tapSize;
        dlmtr = ', ';
    }
    polygon.setAttributeNS(null, 'points', points);
    var t = "";
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
        polygon.classList.add(cssClass);
    }
    g.appendChild(polygon);
    return polygon;
}
function tilePath(svgns, tapSize, g, x, y, z, data, cssClass) {
    var path = document.createElementNS(svgns, 'path');
    path.setAttributeNS(null, 'd', data);
    var t = "";
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
        path.classList.add(cssClass);
    }
    g.appendChild(path);
    return path;
}
function tileRectangle(svgns, tapSize, g, x, y, w, h, rx, ry, cssClass) {
    var rect = document.createElementNS(svgns, 'rect');
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
        rect.classList.add(cssClass);
    }
    g.appendChild(rect);
    return rect;
}
function tileLine(svgns, tapSize, g, x1, y1, x2, y2, cssClass) {
    var line = document.createElementNS(svgns, 'line');
    line.setAttributeNS(null, 'x1', '' + x1);
    line.setAttributeNS(null, 'y1', '' + y1);
    line.setAttributeNS(null, 'x2', '' + x2);
    line.setAttributeNS(null, 'y2', '' + y2);
    if (cssClass) {
        line.classList.add(cssClass);
    }
    g.appendChild(line);
    return line;
}
function tileText(svgns, tapSize, g, x, y, html, cssClass) {
    var txt = document.createElementNS(svgns, 'text');
    txt.setAttributeNS(null, 'x', '' + x);
    txt.setAttributeNS(null, 'y', '' + y);
    if (cssClass) {
        txt.setAttributeNS(null, 'class', cssClass);
    }
    txt.innerHTML = html;
    g.appendChild(txt);
    return txt;
}
function anchor(xx, yy, ww, hh, showZoom, hideZoom) {
    return { xx: xx, yy: yy, ww: ww, hh: hh, showZoom: showZoom, hideZoom: hideZoom, content: [] };
}
function rectangle(x, y, w, h, rx, ry, css) {
    return { x: x, y: y, w: w, h: h, rx: rx, ry: ry, css: css };
}
function actionRectangle(action, x, y, w, h, rx, ry, css) {
    return { x: x, y: y, w: w, h: h, rx: rx, ry: ry, css: css, action: action };
}
function line(x1, y1, x2, y2, css) {
    return { x1: x1, y1: y1, x2: x2, y2: y2, css: css };
}
function text(x, y, text, css) {
    return { x: x, y: y, text: text, css: css };
}
function pathImage(x, y, scale, points, css) {
    return { x: x, y: y, scale: scale, points: points, css: css };
}
function isLayerStickTop(t) {
    return t.stickTop !== undefined;
}
function isLayerStickBottom(t) {
    return t.stickBottom !== undefined;
}
function isLayerStickRight(t) {
    return t.stickRight !== undefined;
}
function isLayerOverlay(t) {
    return t.overlay !== undefined;
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
function isLayerStickLeft(t) {
    return t.stickLeft !== undefined;
}
function isTileRectangle(t) {
    return t.h !== undefined;
}
function isTileGroup(t) {
    return t.content !== undefined;
}
function isLayerNormal(t) {
    return t.stickLeft === undefined
        && t.stickTop === undefined
        && t.stickBottom === undefined
        && t.stickRight === undefined
        && t.overlay === undefined;
}
function rid() {
    return 'id' + Math.floor(Math.random() * 1000000000);
}
var ZRender = (function () {
    function ZRender() {
        this.layers = [];
        this.zoomMin = 1;
        this.zoomNote = 2;
        this.zoomMeasure = 16;
        this.zoomSong = 64;
        this.zoomFar = 256;
        this.zoomBig = 512;
        this.zoomMax = 1024;
        this.ratioDuration = 50;
        this.ratioThickness = 3;
        this.sizeRatio = 2;
        this.rhythmPatternDefault = [
            { count: 1, division: 8 }, { count: 1, division: 8 },
            { count: 1, division: 8 }, { count: 1, division: 8 }
        ];
        this.measureInfoRenderer = new MeasureInfoRenderer();
        this.pianoRollRenderer = new PianoRollRenderer();
        this.gridRenderer = new GridRenderer();
        this.timeLineRenderer = new TimeLineRenderer();
        this.focusManager = new FocusManagement();
    }
    ZRender.prototype.bindLayers = function () {
        this.debugLayerGroup = document.getElementById('debugLayerGroup');
        this.tileLevel = new TileLevel(document.getElementById('contentSVG'), 1000, 1000, this.zoomMin, this.zoomMin, this.zoomMax, this.layers);
    };
    ZRender.prototype.initUI = function () {
        this.initDebugAnchors();
        this.measureInfoRenderer.attach(this);
        this.pianoRollRenderer.attach(this);
        this.gridRenderer.attach(this);
        this.timeLineRenderer.attach(this);
        this.focusManager.attach(this);
    };
    ZRender.prototype.initDebugAnchors = function () {
        this.debugAnchor0 = TAnchor(0, 0, 1111, 1111, this.zoomMin, this.zoomMax + 1);
        this.debugAnchor1 = TAnchor(0, 0, 1111, 1111, this.zoomMin, this.zoomNote);
        this.debugAnchor4 = TAnchor(0, 0, 1111, 1111, this.zoomNote, this.zoomMeasure);
        this.debugAnchor16 = TAnchor(0, 0, 1111, 1111, this.zoomMeasure, this.zoomSong);
        this.debugAnchor64 = TAnchor(0, 0, 1111, 1111, this.zoomSong, this.zoomFar);
        this.debugAnchor256 = TAnchor(0, 0, 1111, 1111, this.zoomFar, this.zoomMax + 1);
        this.layers.push({
            g: this.debugLayerGroup, anchors: [
                this.debugAnchor1, this.debugAnchor4, this.debugAnchor16, this.debugAnchor64, this.debugAnchor256, this.debugAnchor0
            ]
        });
    };
    ZRender.prototype.clearSingleAnchor = function (anchor, songDuration) {
        anchor.content.length = 0;
        anchor.ww = this.ratioDuration * songDuration;
        anchor.hh = 128 * this.ratioThickness;
    };
    ZRender.prototype.clearAnchorsContent = function (songDuration) {
        var anchors = [
            this.debugAnchor0, this.debugAnchor1, this.debugAnchor4, this.debugAnchor16, this.debugAnchor64, this.debugAnchor256
        ];
        for (var i = 0; i < anchors.length; i++) {
            this.clearSingleAnchor(anchors[i], songDuration);
        }
        this.gridRenderer.clearAnchorsContent(this, songDuration);
        this.measureInfoRenderer.clearAnchorsContent(this, songDuration);
        this.pianoRollRenderer.clearAnchorsContent(this, songDuration);
        this.timeLineRenderer.clearAnchorsContent(this, songDuration);
        this.tileLevel.innerWidth = this.ratioDuration * songDuration * this.tileLevel.tapSize;
        this.tileLevel.innerHeight = 128 * this.ratioThickness * this.tileLevel.tapSize;
    };
    ZRender.prototype.drawSchedule = function (song) {
        var songDuration = scheduleDuration(song);
        this.clearAnchorsContent(songDuration);
        this.measureInfoRenderer.fillMeasureInfo(song, this.ratioDuration, this.ratioThickness);
        this.pianoRollRenderer.drawSchedule(song, this.ratioDuration, this.ratioThickness);
        var rhythm = this.rhythmPatternDefault;
        if (song.rhythm) {
            if (song.rhythm.length) {
                rhythm = song.rhythm;
            }
        }
        this.gridRenderer.drawGrid(this, song, this.ratioDuration, this.ratioThickness, rhythm);
        this.timeLineRenderer.drawSchedule(this, song, this.ratioDuration, this.ratioThickness);
        var time = 0;
        song.obverseTrackFilter = (song.obverseTrackFilter) ? song.obverseTrackFilter : 0;
        for (var mm = 0; mm < song.measures.length; mm++) {
            var measureDuration = meter2seconds(song.measures[mm].tempo, song.measures[mm].meter);
            time = time + measureDuration;
        }
        this.tileLevel.resetModel();
    };
    return ZRender;
}());
var ZUserSetting = (function () {
    function ZUserSetting() {
        this.mode = "";
        this.texts = [];
        this.fillModeValues();
    }
    ZUserSetting.prototype.fillModeValues = function () {
        this.texts.push({ mode: 'ru', id: 'testText', txt: 'rutest' });
        this.texts.push({ mode: 'en', id: 'testText', txt: 'entest' });
    };
    ZUserSetting.prototype.selectMode = function (mode) {
        this.mode = mode;
    };
    ZUserSetting.prototype.txt = function (id) {
        for (var i = 0; i < this.texts.length; i++) {
            if (this.texts[i].mode == this.mode && this.texts[i].id == id) {
                return this.texts[i].txt;
            }
        }
        return this.mode + "?" + id;
    };
    return ZUserSetting;
}());
function progressionDuration(progression) {
    var duration = { count: 0, division: 1 };
    for (var i = 0; i < progression.length; i++) {
        duration = DUU(duration).plus(progression[i].duration);
    }
    return duration;
}
function adjustPartLeadPad(voice, fromPosition, toPosition, measures) {
    var lowest = 120;
    var highest = 0;
    var measurePosition = { count: 0, division: 1 };
    for (var m = 0; m < voice.measureChords.length; m++) {
        var mch = voice.measureChords[m].chords;
        for (var ch = 0; ch < mch.length; ch++) {
            var chord = mch[ch];
            var chordPosition = DUU(measurePosition).plus(chord.when);
            if (DUU(chordPosition).notLessThen(fromPosition) && DUU(chordPosition).lessThen(toPosition)) {
                for (var e = 0; e < chord.envelopes.length; e++) {
                    var envelope = chord.envelopes[e];
                    for (var p = 0; p < envelope.pitches.length; p++) {
                        var pitch = envelope.pitches[p];
                        if (pitch.pitch < lowest) {
                            lowest = pitch.pitch;
                        }
                        if (pitch.pitch > highest) {
                            highest = pitch.pitch;
                        }
                    }
                }
            }
        }
        measurePosition = DUU(measurePosition).plus(measures[m].meter);
    }
    if (lowest < 3 * 12 + 4) {
        var shift = 1 * 12;
        if (lowest < 2 * 12 + 4)
            shift = 2 * 12;
        if (lowest < 1 * 12 + 4)
            shift = 3 * 12;
        if (lowest < 0 * 12 + 4)
            shift = 4 * 12;
        var measurePosition_1 = { count: 0, division: 1 };
        for (var m = 0; m < voice.measureChords.length; m++) {
            var mch = voice.measureChords[m].chords;
            for (var ch = 0; ch < mch.length; ch++) {
                var chord = mch[ch];
                var chordPosition = DUU(measurePosition_1).plus(chord.when);
                if (DUU(chordPosition).notLessThen(fromPosition) && DUU(chordPosition).lessThen(toPosition)) {
                    for (var e = 0; e < chord.envelopes.length; e++) {
                        var envelope = chord.envelopes[e];
                        for (var p = 0; p < envelope.pitches.length; p++) {
                            var pitch = envelope.pitches[p];
                            pitch.pitch = pitch.pitch + shift;
                        }
                    }
                }
            }
            measurePosition_1 = DUU(measurePosition_1).plus(measures[m].meter);
        }
    }
    if (highest > 8 * 12 + 4) {
        var shift = 1 * 12;
        if (highest > 9 * 12 + 4)
            shift = 2 * 12;
        if (highest > 10 * 12 + 4)
            shift = 3 * 12;
        if (highest > 11 * 12 + 4)
            shift = 4 * 12;
        var measurePosition_2 = { count: 0, division: 1 };
        for (var m = 0; m < voice.measureChords.length; m++) {
            var mch = voice.measureChords[m].chords;
            for (var ch = 0; ch < mch.length; ch++) {
                var chord = mch[ch];
                var chordPosition = DUU(measurePosition_2).plus(chord.when);
                if (DUU(chordPosition).notLessThen(fromPosition) && DUU(chordPosition).lessThen(toPosition)) {
                    for (var e = 0; e < chord.envelopes.length; e++) {
                        var envelope = chord.envelopes[e];
                        for (var p = 0; p < envelope.pitches.length; p++) {
                            var pitch = envelope.pitches[p];
                            pitch.pitch = pitch.pitch - shift;
                        }
                    }
                }
            }
            measurePosition_2 = DUU(measurePosition_2).plus(measures[m].meter);
        }
    }
}
function adjustPartBass(voice, fromPosition, toPosition, measures) {
    var lowest = 120;
    var measurePosition = { count: 0, division: 1 };
    for (var m = 0; m < voice.measureChords.length; m++) {
        var mch = voice.measureChords[m].chords;
        for (var ch = 0; ch < mch.length; ch++) {
            var chord = mch[ch];
            var chordPosition = DUU(measurePosition).plus(chord.when);
            if (DUU(chordPosition).notLessThen(fromPosition) && DUU(chordPosition).lessThen(toPosition)) {
                for (var e = 0; e < chord.envelopes.length; e++) {
                    var envelope = chord.envelopes[e];
                    for (var p = 0; p < envelope.pitches.length; p++) {
                        var pitch = envelope.pitches[p];
                        if (pitch.pitch < lowest) {
                            lowest = pitch.pitch;
                        }
                    }
                }
            }
        }
        measurePosition = DUU(measurePosition).plus(measures[m].meter);
    }
    if (lowest < 12 + 12 + 4) {
        var shift = 12;
        if (lowest < 12 + 4)
            shift = 24;
        if (lowest < 4)
            shift = 36;
        var measurePosition_3 = { count: 0, division: 1 };
        for (var m = 0; m < voice.measureChords.length; m++) {
            var mch = voice.measureChords[m].chords;
            for (var ch = 0; ch < mch.length; ch++) {
                var chord = mch[ch];
                var chordPosition = DUU(measurePosition_3).plus(chord.when);
                if (DUU(chordPosition).notLessThen(fromPosition) && DUU(chordPosition).lessThen(toPosition)) {
                    for (var e = 0; e < chord.envelopes.length; e++) {
                        var envelope = chord.envelopes[e];
                        for (var p = 0; p < envelope.pitches.length; p++) {
                            var pitch = envelope.pitches[p];
                            pitch.pitch = pitch.pitch + shift;
                        }
                    }
                }
            }
            measurePosition_3 = DUU(measurePosition_3).plus(measures[m].meter);
        }
    }
}
function createBreakList(originalProg, targetProg, measures) {
    var list = [{ count: 0, division: 1 }];
    var fromPosition = { count: 0, division: 1 };
    for (var i = 0; i < originalProg.length; i++) {
        var part = originalProg[i];
        var toPosition = DUU(fromPosition).plus(part.duration);
        list.push({ count: toPosition.count, division: toPosition.division });
        fromPosition = toPosition;
    }
    fromPosition = { count: 0, division: 1 };
    for (var i = 0; i < targetProg.length; i++) {
        var part = targetProg[i];
        var toPosition = DUU(fromPosition).plus(part.duration);
        for (var kk = 0; kk < list.length - 1; kk++) {
            var kkPos = list[kk];
            var nxtPos = list[kk + 1];
            if (DUU(kkPos).equalsTo(toPosition)) {
                break;
            }
            else {
                if (DUU(kkPos).lessThen(toPosition) && DUU(nxtPos).moreThen(toPosition)) {
                    list.splice(kk + 1, 0, { count: toPosition.count, division: toPosition.division });
                    break;
                }
            }
        }
        fromPosition = toPosition;
    }
    return list;
}
function adjustVoiceLowHigh(voice, originalProg, targetProg, measures, trackIsBass) {
    var list = createBreakList(originalProg, targetProg, measures);
    for (var i = 0; i < list.length - 1; i++) {
        if (trackIsBass) {
            adjustPartBass(voice, list[i], list[i + 1], measures);
        }
        else {
            adjustPartLeadPad(voice, list[i], list[i + 1], measures);
        }
    }
}
var ZvoogFxGain = (function () {
    function ZvoogFxGain() {
        this.lockedState = new ZvoogPluginLock();
    }
    ZvoogFxGain.prototype.state = function () {
        return this.lockedState;
    };
    ZvoogFxGain.prototype.prepare = function (audioContext, data) {
        if (this.base) {
        }
        else {
            this.base = audioContext.createGain();
            this.params = [];
            this.params.push(new RangedAudioParam120(this.base.gain, 0, 1));
        }
    };
    ZvoogFxGain.prototype.getInput = function () {
        return this.base;
    };
    ZvoogFxGain.prototype.getOutput = function () {
        return this.base;
    };
    ZvoogFxGain.prototype.getParams = function () {
        return this.params;
    };
    ZvoogFxGain.prototype.busy = function () {
        return 0;
    };
    ZvoogFxGain.prototype.getParId = function (nn) {
        switch (nn) {
            case 0: return 'volume';
        }
        return null;
    };
    return ZvoogFxGain;
}());
var WAFEcho = (function () {
    function WAFEcho() {
        this.lockedState = new ZvoogPluginLock();
    }
    WAFEcho.prototype.state = function () {
        return this.lockedState;
    };
    WAFEcho.prototype.setData = function (data) {
    };
    WAFEcho.prototype.prepare = function (audioContext, data) {
        if (this.inpt) {
        }
        else {
            var me_2 = this;
            this.inpt = audioContext.createGain();
            this.outpt = audioContext.createGain();
            this.params = [];
            this.initWAF();
            this.rvrbrtr = window.wafPlayer.createReverberator(audioContext);
            this.params.push(new RangedAudioParam120(this.rvrbrtr.wet.gain, 0, 1));
            this.params.push(new RangedAudioParam120(this.rvrbrtr.compressor.threshold, -100, 0));
            this.params.push(new RangedAudioParam120(this.rvrbrtr.compressor.knee, 0, 40));
            this.params.push(new RangedAudioParam120(this.rvrbrtr.compressor.ratio, 2, 20));
            this.params.push(new RangedAudioParam120(this.rvrbrtr.compressor.attack, 0, 1));
            this.params.push(new RangedAudioParam120(this.rvrbrtr.compressor.release, 0, 1));
            this.rvrbrtr.compressorDry.gain.setValueAtTime(1, 0);
            this.rvrbrtr.compressorWet.gain.setValueAtTime(0, 0);
            this.params.push({
                cancelScheduledValues: function (cancelTime) {
                    me_2.rvrbrtr.compressorDry.gain.cancelScheduledValues(cancelTime);
                    me_2.rvrbrtr.compressorWet.gain.cancelScheduledValues(cancelTime);
                },
                linearRampToValueAtTime: function (value, endTime) {
                    var wet = value / 119;
                    if (wet < 0)
                        wet = 0;
                    if (wet > 1)
                        wet = 1;
                    var dry = 1 - wet;
                    me_2.rvrbrtr.compressorDry.gain.linearRampToValueAtTime(dry, endTime);
                    me_2.rvrbrtr.compressorWet.gain.linearRampToValueAtTime(wet, endTime);
                },
                setValueAtTime: function (value, startTime) {
                    var wet = value / 119;
                    if (wet < 0)
                        wet = 0;
                    if (wet > 1)
                        wet = 1;
                    var dry = 1 - wet;
                    me_2.rvrbrtr.compressorDry.gain.setValueAtTime(dry, startTime);
                    me_2.rvrbrtr.compressorWet.gain.setValueAtTime(wet, startTime);
                }
            });
        }
        this.inpt.connect(this.rvrbrtr.input);
        this.rvrbrtr.output.connect(this.outpt);
    };
    WAFEcho.prototype.getParId = function (nn) {
        switch (nn) {
            case 0: return 'reverberation';
            case 1: return 'threshold';
            case 2: return 'knee';
            case 3: return 'ratio';
            case 4: return 'attack';
            case 5: return 'release';
            case 6: return 'level';
        }
        return null;
    };
    WAFEcho.prototype.getInput = function () {
        return this.inpt;
    };
    WAFEcho.prototype.getOutput = function () {
        return this.outpt;
    };
    WAFEcho.prototype.getParams = function () {
        return this.params;
    };
    WAFEcho.prototype.busy = function () {
        return 0;
    };
    WAFEcho.prototype.initWAF = function () {
        if (!(window.wafPlayer)) {
            window.wafPlayer = new WebAudioFontPlayer();
        }
    };
    return WAFEcho;
}());
var WAFEqualizer = (function () {
    function WAFEqualizer() {
        this.lockedState = new ZvoogPluginLock();
    }
    WAFEqualizer.prototype.state = function () {
        return this.lockedState;
    };
    WAFEqualizer.prototype.prepare = function (audioContext, data) {
        if (this.inpt) {
        }
        else {
            this.inpt = audioContext.createGain();
            this.outpt = audioContext.createGain();
            this.params = [];
            this.initWAF();
            this.chnl = window.wafPlayer.createChannel(audioContext);
            this.params.push(new RangedAudioParam120(this.chnl.band32.gain, -10, 10));
            this.params.push(new RangedAudioParam120(this.chnl.band64.gain, -10, 10));
            this.params.push(new RangedAudioParam120(this.chnl.band128.gain, -10, 10));
            this.params.push(new RangedAudioParam120(this.chnl.band256.gain, -10, 10));
            this.params.push(new RangedAudioParam120(this.chnl.band512.gain, -10, 10));
            this.params.push(new RangedAudioParam120(this.chnl.band1k.gain, -10, 10));
            this.params.push(new RangedAudioParam120(this.chnl.band2k.gain, -10, 10));
            this.params.push(new RangedAudioParam120(this.chnl.band4k.gain, -10, 10));
            this.params.push(new RangedAudioParam120(this.chnl.band8k.gain, -10, 10));
            this.params.push(new RangedAudioParam120(this.chnl.band16k.gain, -10, 10));
        }
        this.inpt.connect(this.chnl.input);
        this.chnl.output.connect(this.outpt);
    };
    WAFEqualizer.prototype.getInput = function () {
        return this.inpt;
    };
    WAFEqualizer.prototype.getOutput = function () {
        return this.outpt;
    };
    WAFEqualizer.prototype.getParams = function () {
        return this.params;
    };
    WAFEqualizer.prototype.busy = function () {
        return 0;
    };
    WAFEqualizer.prototype.initWAF = function () {
        if (!(window.wafPlayer)) {
            window.wafPlayer = new WebAudioFontPlayer();
        }
    };
    WAFEqualizer.prototype.getParId = function (nn) {
        switch (nn) {
            case 0: return '32';
            case 1: return '64';
            case 2: return '128';
            case 3: return '256';
            case 4: return '512';
            case 5: return '1k';
            case 6: return '2k';
            case 7: return '4k';
            case 8: return '8k';
            case 9: return '16k';
        }
        return null;
    };
    return WAFEqualizer;
}());
var ZvoogSineSource = (function () {
    function ZvoogSineSource() {
        this.lockedState = new ZvoogPluginLock();
    }
    ZvoogSineSource.prototype.state = function () {
        return this.lockedState;
    };
    ZvoogSineSource.prototype.prepare = function (audioContext, data) {
        if (this.out) {
        }
        else {
            this.out = audioContext.createGain();
            this.params = [];
            this.poll = [];
            this.audioContext = audioContext;
        }
    };
    ZvoogSineSource.prototype.getOutput = function () {
        return this.out;
    };
    ZvoogSineSource.prototype.getParams = function () {
        return this.params;
    };
    ZvoogSineSource.prototype.cancelSchedule = function () {
        for (var i = 0; i < this.poll.length; i++) {
            this.poll[i].node.stop();
        }
    };
    ZvoogSineSource.prototype.addSchedule = function (when, tempo, chord, variation) {
        this.cleanup();
        for (var i = 0; i < chord.length; i++) {
            this.sendLine(when, tempo, chord[i]);
        }
    };
    ZvoogSineSource.prototype.sendLine = function (when, tempo, line) {
        var oscillator = this.audioContext.createOscillator();
        oscillator.type = 'sine';
        var seconds = meter2seconds(tempo, line.pitches[0].duration);
        oscillator.frequency.setValueAtTime(this.freq(line.pitches[0].pitch), when);
        var nextPointSeconds = when + seconds;
        for (var i = 1; i < line.pitches.length; i++) {
            var seconds_1 = meter2seconds(tempo, line.pitches[i].duration);
            oscillator.frequency.linearRampToValueAtTime(this.freq(line.pitches[i].pitch), nextPointSeconds);
            nextPointSeconds = nextPointSeconds + seconds_1;
        }
        oscillator.connect(this.out);
        oscillator.start(when);
        oscillator.stop(nextPointSeconds);
        this.poll.push({ node: oscillator, end: nextPointSeconds });
    };
    ZvoogSineSource.prototype.busy = function () {
        return 0;
    };
    ZvoogSineSource.prototype.freq = function (key) {
        var O4 = [261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392.00, 415.30, 440.00, 466.16, 493.88];
        var half = Math.floor(key % 12);
        var octave = Math.floor(key / 12);
        var freq0 = O4[half] / (2 * 2 * 2 * 2);
        return freq0 * Math.pow(2, octave);
    };
    ZvoogSineSource.prototype.nextClear = function () {
        for (var i = 0; i < this.poll.length; i++) {
            if (this.poll[i].end < this.audioContext.currentTime) {
                try {
                    this.poll[i].node.stop();
                    this.poll[i].node.disconnect();
                }
                catch (x) {
                    console.log(x);
                }
                this.poll.splice(i, 1);
                return true;
            }
        }
        return false;
    };
    ZvoogSineSource.prototype.cleanup = function () {
        while (this.nextClear()) {
        }
        ;
    };
    ZvoogSineSource.prototype.getParId = function (nn) {
        return null;
    };
    return ZvoogSineSource;
}());
var WAFInsSource = (function () {
    function WAFInsSource() {
        this.ins = 0;
        this.lockedState = new ZvoogPluginLock();
    }
    WAFInsSource.prototype.state = function () {
        return this.lockedState;
    };
    WAFInsSource.prototype.cancelSchedule = function () {
        window.wafPlayer.cancelQueue(this.audioContext);
    };
    WAFInsSource.prototype.addSchedule = function (when, tempo, chord, variation) {
        var pitches = [];
        for (var i = 0; i < chord.length; i++) {
            var envelope_1 = chord[i];
            pitches.push(envelope_1.pitches[0].pitch);
        }
        var envelope = chord[0];
        var duration = meter2seconds(tempo, envelope.pitches[0].duration);
        var slides = [];
        var tt = 0;
        for (var n = 1; n < envelope.pitches.length; n++) {
            slides.push({
                pitch: envelope.pitches[n].pitch,
                when: tt
            });
            duration = duration + meter2seconds(tempo, envelope.pitches[n].duration);
        }
        if (variation == 1 || variation == 2 || variation == 3) {
            if (variation == 1) {
                window.wafPlayer.queueStrumDown(this.audioContext, this.out, this.zones, when, pitches, duration, 0.99, slides);
            }
            else {
                if (variation == 2) {
                    window.wafPlayer.queueStrumUp(this.audioContext, this.out, this.zones, when, pitches, duration, 0.99, slides);
                }
                else {
                    window.wafPlayer.queueSnap(this.audioContext, this.out, this.zones, when, pitches, duration, 0.99, slides);
                }
            }
        }
        else {
            window.wafPlayer.queueChord(this.audioContext, this.out, this.zones, when, pitches, duration, 0.99, slides);
        }
    };
    WAFInsSource.prototype.prepare = function (audioContext, data) {
        if (this.out) {
        }
        else {
            this.out = audioContext.createGain();
            this.params = [];
            this.poll = [];
            this.audioContext = audioContext;
            this.initWAF();
        }
        this.zones = null;
        this.ins = parseInt(data);
        this.selectIns(this.ins);
    };
    WAFInsSource.prototype.getOutput = function () {
        return this.out;
    };
    WAFInsSource.prototype.getParams = function () {
        return this.params;
    };
    WAFInsSource.prototype.busy = function () {
        if (this.zones) {
            return 0;
        }
        else {
            return 1;
        }
    };
    WAFInsSource.prototype.initWAF = function () {
        if (!(window.wafPlayer)) {
            window.wafPlayer = new WebAudioFontPlayer();
        }
    };
    WAFInsSource.prototype.selectIns = function (nn) {
        var me = this;
        var info = window.wafPlayer.loader.instrumentInfo(nn);
        window.wafPlayer.loader.startLoad(this.audioContext, info.url, info.variable);
        window.wafPlayer.loader.waitLoad(function () {
            me.zones = window[info.variable];
        });
    };
    WAFInsSource.prototype.getParId = function (nn) {
        return null;
    };
    return WAFInsSource;
}());
var WAFPercSource = (function () {
    function WAFPercSource() {
        this.ins = 0;
        this.lockedState = new ZvoogPluginLock();
    }
    WAFPercSource.prototype.state = function () {
        return this.lockedState;
    };
    WAFPercSource.prototype.cancelSchedule = function () {
        window.wafPlayer.cancelQueue(this.audioContext);
    };
    WAFPercSource.prototype.addSchedule = function (when, tempo, chord, variation) {
        for (var i = 0; i < chord.length; i++) {
            var envelope = chord[i];
            var slides = [];
            var duration = meter2seconds(tempo, envelope.pitches[0].duration);
            var t = 0;
            for (var n = 1; n < envelope.pitches.length; n++) {
                t = t + meter2seconds(tempo, envelope.pitches[n - 1].duration);
                slides.push({
                    pitch: envelope.pitches[n].pitch,
                    when: t
                });
                duration = duration + meter2seconds(tempo, envelope.pitches[n].duration);
            }
            window.wafPlayer.queueWaveTable(this.audioContext, this.out, this.zones, when, envelope.pitches[0].pitch, duration, 0.99, slides);
        }
    };
    WAFPercSource.prototype.prepare = function (audioContext, data) {
        if (this.out) {
        }
        else {
            this.out = audioContext.createGain();
            this.params = [];
            this.poll = [];
            this.audioContext = audioContext;
            this.initWAF();
        }
        this.ins = parseInt(data);
        this.selectDrum(this.ins);
    };
    WAFPercSource.prototype.getOutput = function () {
        return this.out;
    };
    WAFPercSource.prototype.getParams = function () {
        return this.params;
    };
    WAFPercSource.prototype.busy = function () {
        if (this.zones) {
            return 0;
        }
        else {
            return 1;
        }
    };
    WAFPercSource.prototype.initWAF = function () {
        if (!(window.wafPlayer)) {
            window.wafPlayer = new WebAudioFontPlayer();
        }
    };
    WAFPercSource.prototype.selectDrum = function (nn) {
        var me = this;
        var info = window.wafPlayer.loader.drumInfo(nn);
        window.wafPlayer.loader.startLoad(this.audioContext, info.url, info.variable);
        window.wafPlayer.loader.waitLoad(function () {
            me.zones = window[info.variable];
        });
    };
    WAFPercSource.prototype.getParId = function (nn) {
        return null;
    };
    return WAFPercSource;
}());
var AudioFileSource = (function () {
    function AudioFileSource() {
        this.afterTime = 0.008;
        this.lockedState = new ZvoogPluginLock();
    }
    AudioFileSource.prototype.state = function () {
        return this.lockedState;
    };
    AudioFileSource.prototype.setData = function (base64file) {
        var t = [];
        try {
            var chars = atob(base64file);
            for (var i = 0; i < chars.length; i++) {
                var num = chars.charCodeAt(i);
                t.push(num);
            }
            var arr;
            arr = Uint8Array.from(t);
            this.rawData = arr;
        }
        catch (xx) {
            console.log(xx);
        }
    };
    AudioFileSource.prototype.prepare = function (audioContext, data) {
        if (this.out) {
            this.setData(data);
        }
        else {
            this.out = audioContext.createGain();
            this.params = [];
            this.waves = [];
            this.envelopes = [];
            this.audioContext = audioContext;
            var me_3 = this;
            this.setData(data);
            if (this.buffer) {
            }
            else {
                if (this.rawData) {
                    this.audioContext.decodeAudioData(this.rawData.buffer, function (audioBuffer) {
                        me_3.buffer = audioBuffer;
                    });
                }
            }
        }
    };
    AudioFileSource.prototype.getOutput = function () {
        return this.out;
    };
    AudioFileSource.prototype.getParams = function () {
        return this.params;
    };
    AudioFileSource.prototype.cancelSchedule = function () {
        for (var i = 0; i < this.waves.length; i++) {
            this.waves[i].audio.stop();
        }
    };
    AudioFileSource.prototype.addSchedule = function (when, tempo, chord, variation) {
        this.cleanup();
        for (var i = 0; i < chord.length; i++) {
            this.single(when, tempo, chord[i]);
        }
    };
    AudioFileSource.prototype.busy = function () {
        if (this.buffer) {
            return 0;
        }
        else {
            return 1;
        }
    };
    AudioFileSource.prototype.nextClear = function () {
        for (var i = 0; i < this.waves.length; i++) {
            if (this.waves[i].end < this.audioContext.currentTime) {
                try {
                    this.waves[i].audio.stop();
                    this.waves[i].audio.disconnect();
                }
                catch (x) {
                    console.log(x);
                }
                this.waves.splice(i, 1);
                return true;
            }
        }
        return false;
    };
    AudioFileSource.prototype.cleanup = function () {
        while (this.nextClear()) {
        }
        ;
    };
    AudioFileSource.prototype.findEnvelope = function (when, duration) {
        var envelope = null;
        for (var i = 0; i < this.envelopes.length; i++) {
            var e = this.envelopes[i];
            if (this.audioContext.currentTime > e.when + e.duration + this.afterTime) {
                envelope = e;
                break;
            }
        }
        if (!(envelope)) {
            envelope = {
                base: this.audioContext.createGain(),
                when: 0,
                duration: 0
            };
            this.envelopes.push(envelope);
            envelope.base.connect(this.out);
        }
        envelope.when = when;
        envelope.duration = duration;
        envelope.base.gain.setValueAtTime(0, 0);
        envelope.base.gain.setValueAtTime(0, when);
        envelope.base.gain.linearRampToValueAtTime(1, when + this.afterTime);
        envelope.base.gain.setValueAtTime(1, when + duration);
        envelope.base.gain.linearRampToValueAtTime(0, when + duration + this.afterTime);
        return envelope;
    };
    ;
    AudioFileSource.prototype.single = function (when, tempo, line) {
        var seconds = meter2seconds(tempo, line.pitches[0].duration);
        var nextPointSeconds = when + seconds;
        for (var i = 1; i < line.pitches.length; i++) {
            var seconds_2 = meter2seconds(tempo, line.pitches[i].duration);
            nextPointSeconds = nextPointSeconds + seconds_2;
        }
        var e = this.findEnvelope(when, nextPointSeconds - when);
        var audioBufferSourceNode = this.audioContext.createBufferSource();
        audioBufferSourceNode.buffer = this.buffer;
        audioBufferSourceNode.connect(e.base);
        audioBufferSourceNode.start(when);
        audioBufferSourceNode.stop(nextPointSeconds + this.afterTime);
        this.waves.push({ audio: audioBufferSourceNode, end: nextPointSeconds + this.afterTime });
    };
    AudioFileSource.prototype.getParId = function (nn) {
        return null;
    };
    return AudioFileSource;
}());
function meter2seconds(bpm, meter) {
    var wholeNoteSeconds = 4 * 60 / bpm;
    var meterSeconds = wholeNoteSeconds * meter.count / meter.division;
    return meterSeconds;
}
function seconds2meter32(bpm, seconds) {
    var note32Seconds = (4 * 60 / bpm) / 32;
    var part = seconds / note32Seconds;
    return { count: Math.round(part),
        division: 32 };
}
function calculateEnvelopeDuration(envelope) {
    var d = { count: 0, division: 1 };
    for (var i = 0; i < envelope.pitches.length; i++) {
        d = DUU(d).plus(envelope.pitches[i].duration);
    }
    return d;
}
function DUU(u) {
    return new DurationUnitUtil(u);
}
var DurationUnitUtil = (function () {
    function DurationUnitUtil(u) {
        this._unit = u;
    }
    DurationUnitUtil.prototype.clone = function () {
        return { count: this._unit.count, division: this._unit.division };
    };
    DurationUnitUtil.prototype.plus = function (b) {
        if (this._unit.division == b.division) {
            return { count: this._unit.count + b.count, division: this._unit.division };
        }
        else {
            var r = { count: this._unit.count * b.division + b.count * this._unit.division, division: this._unit.division * b.division };
            return r;
        }
    };
    DurationUnitUtil.prototype.minus = function (b) {
        if (this._unit.division == b.division) {
            return { count: this._unit.count - b.count, division: this._unit.division };
        }
        else {
            var r = { count: this._unit.count * b.division - b.count * this._unit.division, division: this._unit.division * b.division };
            return r;
        }
    };
    DurationUnitUtil.prototype._meterMore = function (b) {
        var a1 = this.plus({ count: 0, division: b.division });
        var b1 = DUU(b).plus({ count: 0, division: this._unit.division });
        if (a1.count == b1.count) {
            return 0;
        }
        else {
            if (a1.count > b1.count) {
                return 1;
            }
            else {
                return -1;
            }
        }
    };
    DurationUnitUtil.prototype.moreThen = function (b) {
        if (this._meterMore(b) == 1) {
            return true;
        }
        else {
            return false;
        }
    };
    DurationUnitUtil.prototype.notMoreThen = function (b) {
        if (this._meterMore(b) == 1) {
            return false;
        }
        else {
            return true;
        }
    };
    DurationUnitUtil.prototype.lessThen = function (b) {
        if (this._meterMore(b) == -1) {
            return true;
        }
        else {
            return false;
        }
    };
    DurationUnitUtil.prototype.notLessThen = function (b) {
        if (this._meterMore(b) == -1) {
            return false;
        }
        else {
            return true;
        }
    };
    DurationUnitUtil.prototype.equalsTo = function (b) {
        if (this._meterMore(b) == 0) {
            return true;
        }
        else {
            return false;
        }
    };
    DurationUnitUtil.prototype.simplify = function () {
        var r = this.clone();
        while (r.division % 3 == 0) {
            r.division = r.division / 3;
            r.count = Math.round(r.count / 3);
        }
        while (r.division % 2 == 0 && r.count % 2 == 0) {
            r.division = r.division / 2;
            r.count = Math.round(r.count / 2);
        }
        if (r.division % r.count == 0) {
            r.division = r.division / r.count;
            r.count = 1;
        }
        return r;
    };
    return DurationUnitUtil;
}());
var ZvoogPluginLock = (function () {
    function ZvoogPluginLock() {
    }
    ZvoogPluginLock.prototype.lock = function () {
        this.lockedState = true;
    };
    ZvoogPluginLock.prototype.unlock = function () {
        this.lockedState = false;
    };
    ZvoogPluginLock.prototype.locked = function () {
        return this.lockedState;
    };
    return ZvoogPluginLock;
}());
var RangedAudioParam120 = (function () {
    function RangedAudioParam120(base, min, max) {
        this.baseParam = base;
        this.minValue = min;
        this.maxValue = max;
    }
    RangedAudioParam120.prototype.recalulate = function (value) {
        if (value < 0)
            console.log('wrong 1-119', value);
        if (value < 0)
            value = 0;
        if (value > 119)
            value = 119;
        var ratio = (this.maxValue - this.minValue) / 119;
        var nn = this.minValue + value * ratio;
        return nn;
    };
    RangedAudioParam120.prototype.cancelScheduledValues = function (cancelTime) {
        this.baseParam.cancelScheduledValues(cancelTime);
    };
    RangedAudioParam120.prototype.linearRampToValueAtTime = function (value, endTime) {
        this.baseParam.linearRampToValueAtTime(this.recalulate(value), endTime);
    };
    RangedAudioParam120.prototype.setValueAtTime = function (value, startTime) {
        this.baseParam.setValueAtTime(this.recalulate(value), startTime);
    };
    return RangedAudioParam120;
}());
var ZvoogPerformerStub = (function () {
    function ZvoogPerformerStub() {
        this.lockedState = new ZvoogPluginLock();
    }
    ZvoogPerformerStub.prototype.setData = function (data) {
    };
    ZvoogPerformerStub.prototype.state = function () {
        return this.lockedState;
    };
    ZvoogPerformerStub.prototype.prepare = function (audioContext) {
        if (this.base) {
        }
        else {
            this.base = audioContext.createGain();
        }
        this.params = [];
    };
    ZvoogPerformerStub.prototype.getOutput = function () {
        return this.base;
    };
    ZvoogPerformerStub.prototype.getParams = function () {
        return this.params;
    };
    ZvoogPerformerStub.prototype.busy = function () {
        return 0;
    };
    ZvoogPerformerStub.prototype.cancelSchedule = function () {
    };
    ZvoogPerformerStub.prototype.addSchedule = function (when, tempo, chord, variation) {
    };
    ZvoogPerformerStub.prototype.getParId = function (nn) {
        return null;
    };
    return ZvoogPerformerStub;
}());
var ZvoogFilterStub = (function () {
    function ZvoogFilterStub() {
        this.lockedState = new ZvoogPluginLock();
    }
    ZvoogFilterStub.prototype.setData = function (data) {
    };
    ZvoogFilterStub.prototype.state = function () {
        return this.lockedState;
    };
    ZvoogFilterStub.prototype.prepare = function (audioContext) {
        if (this.base) {
        }
        else {
            this.base = audioContext.createGain();
        }
        this.params = [];
    };
    ZvoogFilterStub.prototype.getOutput = function () {
        return this.base;
    };
    ZvoogFilterStub.prototype.getParams = function () {
        return this.params;
    };
    ZvoogFilterStub.prototype.busy = function () {
        return 0;
    };
    ZvoogFilterStub.prototype.getInput = function () {
        return this.base;
    };
    ZvoogFilterStub.prototype.getParId = function (nn) {
        return null;
    };
    return ZvoogFilterStub;
}());
function scheduleDuration(song) {
    var ss = 0;
    for (var i = 0; i < song.measures.length; i++) {
        ss = ss + meter2seconds(song.measures[i].tempo, song.measures[i].meter);
    }
    return ss;
}
var cachedPerformerStubPlugins = [];
function takeZvoogPerformerStub() {
    for (var i = 0; i < cachedPerformerStubPlugins.length; i++) {
        if (!cachedPerformerStubPlugins[i].state().locked()) {
            cachedPerformerStubPlugins[i].state().lock();
            return cachedPerformerStubPlugins[i];
        }
    }
    var plugin = new ZvoogPerformerStub();
    plugin.state().lock();
    cachedPerformerStubPlugins.push(plugin);
    return plugin;
}
var cachedFilterStubPlugins = [];
function takeZvoogFilterStub() {
    for (var i = 0; i < cachedFilterStubPlugins.length; i++) {
        if (!cachedFilterStubPlugins[i].state().locked()) {
            cachedFilterStubPlugins[i].state().lock();
            return cachedFilterStubPlugins[i];
        }
    }
    var plugin = new ZvoogFilterStub();
    plugin.state().lock();
    cachedFilterStubPlugins.push(plugin);
    return plugin;
}
var cachedWAFEchoPlugins = [];
function takeWAFEcho() {
    for (var i = 0; i < cachedWAFEchoPlugins.length; i++) {
        if (!cachedWAFEchoPlugins[i].state().locked()) {
            cachedWAFEchoPlugins[i].state().lock();
            return cachedWAFEchoPlugins[i];
        }
    }
    var plugin = new WAFEcho();
    plugin.state().lock();
    cachedWAFEchoPlugins.push(plugin);
    return plugin;
}
var cachedWAFEqualizerPlugins = [];
function takeWAFEqualizer() {
    for (var i = 0; i < cachedWAFEqualizerPlugins.length; i++) {
        if (!cachedWAFEqualizerPlugins[i].state().locked()) {
            cachedWAFEqualizerPlugins[i].state().lock();
            return cachedWAFEqualizerPlugins[i];
        }
    }
    var plugin = new WAFEqualizer();
    plugin.state().lock();
    cachedWAFEqualizerPlugins.push(plugin);
    return plugin;
}
var cachedZvoogFxGainPlugins = [];
function takeZvoogFxGain() {
    for (var i = 0; i < cachedZvoogFxGainPlugins.length; i++) {
        if (!cachedZvoogFxGainPlugins[i].state().locked()) {
            cachedZvoogFxGainPlugins[i].state().lock();
            return cachedZvoogFxGainPlugins[i];
        }
    }
    var plugin = new ZvoogFxGain();
    plugin.state().lock();
    cachedZvoogFxGainPlugins.push(plugin);
    return plugin;
}
var cachedAudioFileSourcePlugins = [];
function takeAudioFileSource() {
    for (var i = 0; i < cachedAudioFileSourcePlugins.length; i++) {
        if (!cachedAudioFileSourcePlugins[i].state().locked()) {
            cachedAudioFileSourcePlugins[i].state().lock();
            return cachedAudioFileSourcePlugins[i];
        }
    }
    var plugin = new AudioFileSource();
    plugin.state().lock();
    cachedAudioFileSourcePlugins.push(plugin);
    return plugin;
}
var cachedWAFInsSourcePlugins = [];
function takeWAFInsSource() {
    for (var i = 0; i < cachedWAFInsSourcePlugins.length; i++) {
        if (!cachedWAFInsSourcePlugins[i].state().locked()) {
            cachedWAFInsSourcePlugins[i].state().lock();
            return cachedWAFInsSourcePlugins[i];
        }
    }
    var plugin = new WAFInsSource();
    plugin.state().lock();
    cachedWAFInsSourcePlugins.push(plugin);
    return plugin;
}
var cachedWAFPercSourcePlugins = [];
function takeWAFPercSource() {
    for (var i = 0; i < cachedWAFPercSourcePlugins.length; i++) {
        if (!cachedWAFPercSourcePlugins[i].state().locked()) {
            cachedWAFPercSourcePlugins[i].state().lock();
            return cachedWAFPercSourcePlugins[i];
        }
    }
    var plugin = new WAFPercSource();
    plugin.state().lock();
    cachedWAFPercSourcePlugins.push(plugin);
    return plugin;
}
var cachedZvoogSineSourcePlugins = [];
function takeZvoogSineSource() {
    for (var i = 0; i < cachedZvoogSineSourcePlugins.length; i++) {
        if (!cachedZvoogSineSourcePlugins[i].state().locked()) {
            cachedZvoogSineSourcePlugins[i].state().lock();
            return cachedZvoogSineSourcePlugins[i];
        }
    }
    var plugin = new ZvoogSineSource();
    plugin.state().lock();
    cachedZvoogSineSourcePlugins.push(plugin);
    return plugin;
}
function createPluginEffect(id) {
    if (id == 'echo')
        return takeWAFEcho();
    if (id == 'equalizer')
        return takeWAFEqualizer();
    if (id == 'gain')
        return takeZvoogFxGain();
    return takeZvoogFilterStub();
}
function createPluginSource(id) {
    if (id == 'audio') {
        return takeAudioFileSource();
    }
    if (id == 'wafinstrument')
        return takeWAFInsSource();
    if (id == 'wafdrum')
        return takeWAFPercSource();
    if (id == 'sine')
        return takeZvoogSineSource();
    return takeZvoogPerformerStub();
}
var MIDIFileImporter = (function () {
    function MIDIFileImporter() {
    }
    MIDIFileImporter.prototype.list = function (onFinish) { };
    ;
    MIDIFileImporter.prototype.goFolder = function (title, onFinish) { };
    ;
    MIDIFileImporter.prototype.goUp = function (onFinish) { };
    ;
    MIDIFileImporter.prototype.readSongData = function (title, onFinish) {
        var fileSelector = document.createElement('input');
        fileSelector.setAttribute('type', 'file');
        fileSelector.setAttribute('accept', 'audio/midi, audio/x-midi');
        fileSelector.addEventListener("change", function (ev) {
            if (fileSelector.files) {
                var file = fileSelector.files[0];
                var fileReader = new FileReader();
                fileReader.onload = function (progressEvent) {
                    if (progressEvent.target) {
                        var arrayBuffer = progressEvent.target.result;
                        var midiParser = new MidiParser(arrayBuffer);
                        var res = midiParser.convert();
                        onFinish(res);
                    }
                };
                fileReader.readAsArrayBuffer(file);
            }
        }, false);
        fileSelector.click();
    };
    ;
    MIDIFileImporter.prototype.createSongData = function (title, schedule, onFinish) { };
    ;
    MIDIFileImporter.prototype.updateSongData = function (title, schedule, onFinish) { };
    ;
    MIDIFileImporter.prototype.deleteSongData = function (title, onFinish) { };
    ;
    MIDIFileImporter.prototype.renameSongData = function (title, newTitle, onFinish) { };
    ;
    MIDIFileImporter.prototype.createFolder = function (title, onFinish) { };
    ;
    MIDIFileImporter.prototype.deleteFolder = function (title, onFinish) { };
    ;
    MIDIFileImporter.prototype.renameFolder = function (title, newTitle, onFinish) { };
    ;
    return MIDIFileImporter;
}());
;
var DataViewStream = (function () {
    function DataViewStream(dv) {
        this.position = 0;
        this.buffer = dv;
    }
    DataViewStream.prototype.readUint8 = function () {
        var n = this.buffer.getUint8(this.position);
        this.position++;
        return n;
    };
    DataViewStream.prototype.readUint16 = function () {
        var v = this.buffer.getUint16(this.position);
        this.position = this.position + 2;
        return v;
    };
    DataViewStream.prototype.readVarInt = function () {
        var v = 0;
        var i = 0;
        var b;
        while (i < 4) {
            b = this.readUint8();
            if (b & 0x80) {
                v = v + (b & 0x7f);
                v = v << 7;
            }
            else {
                return v + b;
            }
            i++;
        }
        throw new Error('readVarInt ' + i);
    };
    DataViewStream.prototype.readBytes = function (length) {
        var bytes = [];
        for (var i = 0; i < length; i++) {
            bytes.push(this.readUint8());
        }
        return bytes;
    };
    DataViewStream.prototype.offset = function () {
        return this.buffer.byteOffset + this.position;
    };
    DataViewStream.prototype.end = function () {
        return this.position == this.buffer.byteLength;
    };
    return DataViewStream;
}());
var MIDIFileHeader = (function () {
    function MIDIFileHeader(buffer) {
        this.HEADER_LENGTH = 14;
        this.tempoBPM = 120;
        this.changes = [];
        this.meters = [];
        this.lyrics = [];
        this.signs = [];
        this.meterCount = 4;
        this.meterDivision = 4;
        this.keyFlatSharp = 0;
        this.keyMajMin = 0;
        this.lastNonZeroQuarter = 0;
        this.datas = new DataView(buffer, 0, this.HEADER_LENGTH);
        this.format = this.datas.getUint16(8);
        this.trackCount = this.datas.getUint16(10);
    }
    MIDIFileHeader.prototype.______getTickResolution = function (tempo) {
        if (tempo) {
            this.lastNonZeroQuarter = tempo;
        }
        else {
            if (this.lastNonZeroQuarter) {
                tempo = this.lastNonZeroQuarter;
            }
            else {
                tempo = 60000000 / this.tempoBPM;
            }
        }
        if (this.datas.getUint16(12) & 0x8000) {
            var r = 1000000 / (this.getSMPTEFrames() * this.getTicksPerFrame());
            return r;
        }
        else {
            tempo = tempo || 500000;
            var r = tempo / this.getTicksPerBeat();
            return r;
        }
    };
    MIDIFileHeader.prototype.getCalculatedTickResolution = function (tempo) {
        this.lastNonZeroQuarter = tempo;
        if (this.datas.getUint16(12) & 0x8000) {
            var r = 1000000 / (this.getSMPTEFrames() * this.getTicksPerFrame());
            return r;
        }
        else {
            tempo = tempo || 500000;
            var r = tempo / this.getTicksPerBeat();
            return r;
        }
    };
    MIDIFileHeader.prototype.get0TickResolution = function () {
        var tempo = 0;
        if (this.lastNonZeroQuarter) {
            tempo = this.lastNonZeroQuarter;
        }
        else {
            tempo = 60000000 / this.tempoBPM;
        }
        if (this.datas.getUint16(12) & 0x8000) {
            var r = 1000000 / (this.getSMPTEFrames() * this.getTicksPerFrame());
            return r;
        }
        else {
            tempo = tempo || 500000;
            var r = tempo / this.getTicksPerBeat();
            return r;
        }
    };
    MIDIFileHeader.prototype.getTicksPerBeat = function () {
        var divisionWord = this.datas.getUint16(12);
        return divisionWord;
    };
    MIDIFileHeader.prototype.getTicksPerFrame = function () {
        var divisionWord = this.datas.getUint16(12);
        return divisionWord & 0x00ff;
    };
    MIDIFileHeader.prototype.getSMPTEFrames = function () {
        var divisionWord = this.datas.getUint16(12);
        var smpteFrames;
        smpteFrames = divisionWord & 0x7f00;
        if (smpteFrames == 29) {
            return 29.97;
        }
        else {
            return smpteFrames;
        }
    };
    return MIDIFileHeader;
}());
var MIDIFileTrack = (function () {
    function MIDIFileTrack(buffer, start) {
        this.HDR_LENGTH = 8;
        this.chords = [];
        this.datas = new DataView(buffer, start, this.HDR_LENGTH);
        this.trackLength = this.datas.getUint32(4);
        this.datas = new DataView(buffer, start, this.HDR_LENGTH + this.trackLength);
        this.trackContent = new DataView(this.datas.buffer, this.datas.byteOffset + this.HDR_LENGTH, this.datas.byteLength - this.HDR_LENGTH);
        this.trackevents = [];
        this.volumes = [];
    }
    return MIDIFileTrack;
}());
var MidiParser = (function () {
    function MidiParser(arrayBuffer) {
        this.instrumentNamesArray = [];
        this.drumNamesArray = [];
        this.EVENT_META = 0xff;
        this.EVENT_SYSEX = 0xf0;
        this.EVENT_DIVSYSEX = 0xf7;
        this.EVENT_MIDI = 0x8;
        this.EVENT_META_SEQUENCE_NUMBER = 0x00;
        this.EVENT_META_TEXT = 0x01;
        this.EVENT_META_COPYRIGHT_NOTICE = 0x02;
        this.EVENT_META_TRACK_NAME = 0x03;
        this.EVENT_META_INSTRUMENT_NAME = 0x04;
        this.EVENT_META_LYRICS = 0x05;
        this.EVENT_META_MARKER = 0x06;
        this.EVENT_META_CUE_POINT = 0x07;
        this.EVENT_META_MIDI_CHANNEL_PREFIX = 0x20;
        this.EVENT_META_END_OF_TRACK = 0x2f;
        this.EVENT_META_SET_TEMPO = 0x51;
        this.EVENT_META_SMTPE_OFFSET = 0x54;
        this.EVENT_META_TIME_SIGNATURE = 0x58;
        this.EVENT_META_KEY_SIGNATURE = 0x59;
        this.EVENT_META_SEQUENCER_SPECIFIC = 0x7f;
        this.EVENT_MIDI_NOTE_OFF = 0x8;
        this.EVENT_MIDI_NOTE_ON = 0x9;
        this.EVENT_MIDI_NOTE_AFTERTOUCH = 0xa;
        this.EVENT_MIDI_CONTROLLER = 0xb;
        this.EVENT_MIDI_PROGRAM_CHANGE = 0xc;
        this.EVENT_MIDI_CHANNEL_AFTERTOUCH = 0xd;
        this.EVENT_MIDI_PITCH_BEND = 0xe;
        this.midiEventType = 0;
        this.midiEventChannel = 0;
        this.midiEventParam1 = 0;
        this.header = new MIDIFileHeader(arrayBuffer);
        this.parseTracks(arrayBuffer);
    }
    MidiParser.prototype.parseTracks = function (arrayBuffer) {
        var curIndex = this.header.HEADER_LENGTH;
        var trackCount = this.header.trackCount;
        this.tracks = [];
        for (var i = 0; i < trackCount; i++) {
            var track = new MIDIFileTrack(arrayBuffer, curIndex);
            this.tracks.push(track);
            curIndex = curIndex + track.trackLength + 8;
        }
        for (var i = 0; i < this.tracks.length; i++) {
            this.parseTrackEvents(this.tracks[i]);
        }
        this.parseNotes();
        this.simplify();
    };
    MidiParser.prototype.toText = function (arr) {
        var r = '';
        for (var i = 0; i < arr.length; i++) {
            r = r + String.fromCharCode(arr[i]);
        }
        return r;
    };
    MidiParser.prototype.findChordBefore = function (when, track, channel) {
        for (var i = 0; i < track.chords.length; i++) {
            var chord = track.chords[track.chords.length - i - 1];
            if (chord.when < when && chord.channel == channel) {
                return chord;
            }
        }
        return null;
    };
    MidiParser.prototype.findOpenedNoteBefore = function (firstPitch, when, track, channel) {
        var before = when;
        var chord = this.findChordBefore(before, track, channel);
        while (chord) {
            for (var i = 0; i < chord.notes.length; i++) {
                var note = chord.notes[i];
                if (!(note.closed)) {
                    if (firstPitch == note.points[0].pitch) {
                        return { chord: chord, note: note };
                    }
                }
            }
            before = chord.when;
            chord = this.findChordBefore(before, track, channel);
        }
        return null;
    };
    MidiParser.prototype.takeChord = function (when, track, channel) {
        for (var i = 0; i < track.chords.length; i++) {
            if (track.chords[i].when == when && track.chords[i].channel == channel) {
                return track.chords[i];
            }
        }
        var ch = {
            when: when,
            channel: channel,
            notes: []
        };
        track.chords.push(ch);
        return ch;
    };
    MidiParser.prototype.takeOpenedNote = function (first, when, track, channel) {
        var chord = this.takeChord(when, track, channel);
        for (var i = 0; i < chord.notes.length; i++) {
            if (!(chord.notes[i].closed)) {
                if (chord.notes[i].points[0].pitch == first) {
                    return chord.notes[i];
                }
            }
        }
        var pi = { closed: false, points: [] };
        pi.points.push({ pointDuration: -1, pitch: first });
        chord.notes.push(pi);
        return pi;
    };
    MidiParser.prototype.distanceToPoint = function (line, point) {
        var m = (line.p2.y - line.p1.y) / (line.p2.x - line.p1.x);
        var b = line.p1.y - (m * line.p1.x);
        var d = [];
        d.push(Math.abs(point.y - (m * point.x) - b) / Math.sqrt(Math.pow(m, 2) + 1));
        d.push(Math.sqrt(Math.pow((point.x - line.p1.x), 2) + Math.pow((point.y - line.p1.y), 2)));
        d.push(Math.sqrt(Math.pow((point.x - line.p2.x), 2) + Math.pow((point.y - line.p2.y), 2)));
        d.sort(function (a, b) {
            return (a - b);
        });
        return d[0];
    };
    ;
    MidiParser.prototype.douglasPeucker = function (points, tolerance) {
        if (points.length <= 2) {
            return [points[0]];
        }
        var returnPoints = [];
        var line = { p1: points[0], p2: points[points.length - 1] };
        var maxDistance = 0;
        var maxDistanceIndex = 0;
        var p;
        for (var i = 1; i <= points.length - 2; i++) {
            var distance = this.distanceToPoint(line, points[i]);
            if (distance > maxDistance) {
                maxDistance = distance;
                maxDistanceIndex = i;
            }
        }
        if (maxDistance >= tolerance) {
            p = points[maxDistanceIndex];
            this.distanceToPoint(line, p);
            returnPoints = returnPoints.concat(this.douglasPeucker(points.slice(0, maxDistanceIndex + 1), tolerance));
            returnPoints = returnPoints.concat(this.douglasPeucker(points.slice(maxDistanceIndex, points.length), tolerance));
        }
        else {
            p = points[maxDistanceIndex];
            this.distanceToPoint(line, p);
            returnPoints = [points[0]];
        }
        return returnPoints;
    };
    ;
    MidiParser.prototype.simplifyPath = function (points, tolerance) {
        var arr = this.douglasPeucker(points, tolerance);
        arr.push(points[points.length - 1]);
        return arr;
    };
    MidiParser.prototype.simplify = function () {
        for (var t = 0; t < this.tracks.length; t++) {
            var track = this.tracks[t];
            for (var ch = 0; ch < track.chords.length; ch++) {
                var chord = track.chords[ch];
                for (var n = 0; n < chord.notes.length; n++) {
                    var note = chord.notes[n];
                    if (note.points.length > 5) {
                        var xx = 0;
                        var pnts = [];
                        for (var p = 0; p < note.points.length; p++) {
                            note.points[p].pointDuration = Math.max(note.points[p].pointDuration, 0);
                            pnts.push({ x: xx, y: note.points[p].pitch });
                            xx = xx + note.points[p].pointDuration;
                        }
                        pnts.push({ x: xx, y: note.points[note.points.length - 1].pitch });
                        var lessPoints = this.simplifyPath(pnts, 1.5);
                        note.points = [];
                        for (var p = 0; p < lessPoints.length - 1; p++) {
                            var xypoint = lessPoints[p];
                            var xyduration = lessPoints[p + 1].x - xypoint.x;
                            note.points.push({ pointDuration: xyduration, pitch: xypoint.y });
                        }
                    }
                    else {
                        if (note.points.length == 1) {
                            if (note.points[0].pointDuration > 4321) {
                                note.points[0].pointDuration = 1234;
                            }
                        }
                    }
                }
            }
        }
    };
    MidiParser.prototype.dumpResolutionChanges = function () {
        this.header.changes = [];
        var tickResolution = this.header.get0TickResolution();
        this.header.changes.push({ track: -1, ms: -1, resolution: tickResolution, bpm: 120 });
        for (var t = 0; t < this.tracks.length; t++) {
            var track = this.tracks[t];
            var playTimeTicks = 0;
            for (var e = 0; e < track.trackevents.length; e++) {
                var evnt = track.trackevents[e];
                var curDelta = 0.0;
                if (evnt.delta)
                    curDelta = evnt.delta;
                playTimeTicks = playTimeTicks + curDelta * tickResolution / 1000.0;
                if (evnt.basetype === this.EVENT_META) {
                    if (evnt.subtype === this.EVENT_META_SET_TEMPO) {
                        if (evnt.tempo) {
                            tickResolution = this.header.getCalculatedTickResolution(evnt.tempo);
                            this.header.changes.push({ track: t, ms: playTimeTicks, resolution: tickResolution, bpm: (evnt.tempoBPM) ? evnt.tempoBPM : 120 });
                        }
                    }
                }
            }
        }
        this.header.changes.sort(function (a, b) { return a.ms - b.ms; });
    };
    MidiParser.prototype.lastResolution = function (ms) {
        for (var i = this.header.changes.length - 1; i >= 0; i--) {
            if (this.header.changes[i].ms <= ms) {
                return this.header.changes[i].resolution;
            }
        }
        return 0;
    };
    MidiParser.prototype.parseTicks2time = function (track) {
        var tickResolution = this.lastResolution(0);
        var playTimeTicks = 0;
        for (var e = 0; e < track.trackevents.length; e++) {
            var evnt = track.trackevents[e];
            var curDelta = 0.0;
            if (evnt.delta)
                curDelta = evnt.delta;
            var searchPlayTimeTicks = playTimeTicks + curDelta * tickResolution / 1000.0;
            tickResolution = this.lastResolution(searchPlayTimeTicks);
            playTimeTicks = playTimeTicks + curDelta * tickResolution / 1000.0;
            evnt.playTimeMs = playTimeTicks;
        }
    };
    MidiParser.prototype.parseNotes = function () {
        var changes = this.dumpResolutionChanges();
        for (var t = 0; t < this.tracks.length; t++) {
            var track = this.tracks[t];
            this.parseTicks2time(track);
            for (var e = 0; e < track.trackevents.length; e++) {
                var evnt = track.trackevents[e];
                if (evnt.basetype == this.EVENT_MIDI) {
                    evnt.param1 = evnt.param1 ? evnt.param1 : 0;
                    if (evnt.subtype == this.EVENT_MIDI_NOTE_ON) {
                        if (evnt.param1 >= 0 && evnt.param1 <= 127) {
                            var pitch = evnt.param1 ? evnt.param1 : 0;
                            var when = 0;
                            if (evnt.playTimeMs)
                                when = evnt.playTimeMs;
                            this.takeOpenedNote(pitch, when, track, evnt.midiChannel ? evnt.midiChannel : 0);
                        }
                    }
                    else {
                        if (evnt.subtype == this.EVENT_MIDI_NOTE_OFF) {
                            if (evnt.param1 >= 0 && evnt.param1 <= 127) {
                                var pitch = evnt.param1 ? evnt.param1 : 0;
                                var when = 0;
                                if (evnt.playTimeMs)
                                    when = evnt.playTimeMs;
                                var chpi = this.findOpenedNoteBefore(pitch, when, track, evnt.midiChannel ? evnt.midiChannel : 0);
                                if (chpi) {
                                    var duration = 0;
                                    for (var i = 0; i < chpi.note.points.length - 1; i++) {
                                        duration = duration + chpi.note.points[i].pointDuration;
                                    }
                                    chpi.note.points[chpi.note.points.length - 1].pointDuration = when - chpi.chord.when - duration;
                                    chpi.note.closed = true;
                                }
                            }
                        }
                        else {
                            if (evnt.subtype == this.EVENT_MIDI_PROGRAM_CHANGE) {
                                if (evnt.param1 >= 0 && evnt.param1 <= 127) {
                                    track.program = evnt.param1 ? evnt.param1 : 0;
                                }
                            }
                            else {
                                if (evnt.subtype == this.EVENT_MIDI_PITCH_BEND) {
                                    var pitch = evnt.param1 ? evnt.param1 : 0;
                                    var slide = ((evnt.param2 ? evnt.param2 : 0) - 64) / 6;
                                    var when = evnt.playTimeMs ? evnt.playTimeMs : 0;
                                    var chord = this.findChordBefore(when, track, evnt.midiChannel ? evnt.midiChannel : 0);
                                    if (chord) {
                                        for (var i = 0; i < chord.notes.length; i++) {
                                            var note = chord.notes[i];
                                            if (!(note.closed)) {
                                                var duration = 0;
                                                for (var k = 0; k < note.points.length - 1; k++) {
                                                    duration = duration + note.points[k].pointDuration;
                                                }
                                                note.points[note.points.length - 1].pointDuration = when - chord.when - duration;
                                                var firstpitch = note.points[0].pitch + slide;
                                                var point = {
                                                    pointDuration: -1,
                                                    pitch: firstpitch
                                                };
                                                note.points.push(point);
                                            }
                                        }
                                    }
                                }
                                else {
                                    if (evnt.subtype == this.EVENT_MIDI_CONTROLLER && evnt.param1 == 7) {
                                        var v = evnt.param2 ? evnt.param2 / 127 : 0;
                                        track.volumes.push({ ms: evnt.playTimeMs, value: v });
                                    }
                                    else {
                                    }
                                }
                            }
                        }
                    }
                }
                else {
                    if (evnt.subtype == this.EVENT_META_TEXT) {
                        this.header.lyrics.push({ track: t, ms: evnt.playTimeMs ? evnt.playTimeMs : 0, txt: evnt.text ? evnt.text : "?" });
                    }
                    if (evnt.subtype == this.EVENT_META_COPYRIGHT_NOTICE) {
                        this.header.lyrics.push({ track: t, ms: evnt.playTimeMs ? evnt.playTimeMs : 0, txt: evnt.text ? evnt.text : "?" });
                    }
                    if (evnt.subtype == this.EVENT_META_TRACK_NAME) {
                        track.title = this.toText(evnt.data ? evnt.data : []);
                    }
                    if (evnt.subtype == this.EVENT_META_INSTRUMENT_NAME) {
                        track.instrument = this.toText(evnt.data ? evnt.data : []);
                    }
                    if (evnt.subtype == this.EVENT_META_LYRICS) {
                        this.header.lyrics.push({ track: t, ms: evnt.playTimeMs ? evnt.playTimeMs : 0, txt: evnt.text ? evnt.text : "?" });
                    }
                    if (evnt.subtype == this.EVENT_META_KEY_SIGNATURE) {
                        var majSharpCircleOfFifths = ['C', 'G', 'D', 'A', 'E', 'B', 'F#'];
                        var majFlatCircleOfFifths = ['C', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb'];
                        var minSharpCircleOfFifths = ['Am', 'Em', 'Bm', 'F#m', 'C#m', 'G#m', 'D#'];
                        var minFlatCircleOfFifths = ['Am', 'Dm', 'Gm', 'Cm', 'Fm', 'Bbm', 'Ebm'];
                        var key = evnt.key ? evnt.key : 0;
                        if (key > 127)
                            key = key - 256;
                        this.header.keyFlatSharp = key;
                        this.header.keyMajMin = evnt.scale ? evnt.scale : 0;
                        var signature = 'C';
                        if (this.header.keyFlatSharp >= 0) {
                            if (this.header.keyMajMin < 1) {
                                signature = majSharpCircleOfFifths[this.header.keyFlatSharp];
                            }
                            else {
                                signature = minSharpCircleOfFifths[this.header.keyFlatSharp];
                            }
                        }
                        else {
                            if (this.header.keyMajMin < 1) {
                                signature = majFlatCircleOfFifths[this.header.keyFlatSharp];
                            }
                            else {
                                signature = minFlatCircleOfFifths[this.header.keyFlatSharp];
                            }
                        }
                        this.header.signs.push({ track: t, ms: evnt.playTimeMs ? evnt.playTimeMs : 0, sign: signature });
                    }
                    if (evnt.subtype == this.EVENT_META_SET_TEMPO) {
                        this.header.tempoBPM = evnt.tempoBPM ? evnt.tempoBPM : 120;
                    }
                    if (evnt.subtype == this.EVENT_META_TIME_SIGNATURE) {
                        this.header.meterCount = evnt.param1 ? evnt.param1 : 4;
                        var dvsn = evnt.param2 ? evnt.param2 : 2;
                        if (dvsn == 1)
                            this.header.meterDivision = 2;
                        else if (dvsn == 2)
                            this.header.meterDivision = 4;
                        else if (dvsn == 3)
                            this.header.meterDivision = 8;
                        else if (dvsn == 4)
                            this.header.meterDivision = 16;
                        else if (dvsn == 5)
                            this.header.meterDivision = 32;
                        this.header.meters.push({
                            track: t, ms: evnt.playTimeMs ? evnt.playTimeMs : 0,
                            count: this.header.meterCount, division: this.header.meterDivision
                        });
                    }
                }
            }
        }
    };
    MidiParser.prototype.nextEvent = function (stream) {
        var index = stream.offset();
        var delta = stream.readVarInt();
        var eventTypeByte = stream.readUint8();
        var event = { offset: index, delta: delta, eventTypeByte: eventTypeByte, playTimeMs: 0 };
        if (0xf0 === (eventTypeByte & 0xf0)) {
            if (eventTypeByte === this.EVENT_META) {
                event.basetype = this.EVENT_META;
                event.subtype = stream.readUint8();
                event.length = stream.readVarInt();
                switch (event.subtype) {
                    case this.EVENT_META_SEQUENCE_NUMBER:
                        event.msb = stream.readUint8();
                        event.lsb = stream.readUint8();
                        console.log('EVENT_META_SEQUENCE_NUMBER', event);
                        return event;
                    case this.EVENT_META_TEXT:
                    case this.EVENT_META_COPYRIGHT_NOTICE:
                    case this.EVENT_META_TRACK_NAME:
                    case this.EVENT_META_INSTRUMENT_NAME:
                    case this.EVENT_META_LYRICS:
                    case this.EVENT_META_MARKER:
                    case this.EVENT_META_CUE_POINT:
                        event.data = stream.readBytes(event.length);
                        event.text = this.toText(event.data ? event.data : []);
                        return event;
                    case this.EVENT_META_MIDI_CHANNEL_PREFIX:
                        event.prefix = stream.readUint8();
                        return event;
                    case this.EVENT_META_END_OF_TRACK:
                        return event;
                    case this.EVENT_META_SET_TEMPO:
                        event.tempo = (stream.readUint8() << 16) + (stream.readUint8() << 8) + stream.readUint8();
                        event.tempoBPM = 60000000 / event.tempo;
                        return event;
                    case this.EVENT_META_SMTPE_OFFSET:
                        event.hour = stream.readUint8();
                        event.minutes = stream.readUint8();
                        event.seconds = stream.readUint8();
                        event.frames = stream.readUint8();
                        event.subframes = stream.readUint8();
                        return event;
                    case this.EVENT_META_KEY_SIGNATURE:
                        event.key = stream.readUint8();
                        event.scale = stream.readUint8();
                        return event;
                    case this.EVENT_META_TIME_SIGNATURE:
                        event.data = stream.readBytes(event.length);
                        event.param1 = event.data[0];
                        event.param2 = event.data[1];
                        event.param3 = event.data[2];
                        event.param4 = event.data[3];
                        return event;
                    case this.EVENT_META_SEQUENCER_SPECIFIC:
                        event.data = stream.readBytes(event.length);
                        return event;
                    default:
                        event.data = stream.readBytes(event.length);
                        return event;
                }
            }
            else {
                if (eventTypeByte === this.EVENT_SYSEX || eventTypeByte === this.EVENT_DIVSYSEX) {
                    event.basetype = eventTypeByte;
                    event.length = stream.readVarInt();
                    event.data = stream.readBytes(event.length);
                    return event;
                }
                else {
                    event.basetype = eventTypeByte;
                    event.badsubtype = stream.readVarInt();
                    event.length = stream.readUint8();
                    event.data = stream.readBytes(event.length);
                    return event;
                }
            }
        }
        else {
            if (0 === (eventTypeByte & 0x80)) {
                if (!this.midiEventType) {
                    throw new Error('no pre event' + stream.offset());
                }
                this.midiEventParam1 = eventTypeByte;
            }
            else {
                this.midiEventType = eventTypeByte >> 4;
                this.midiEventChannel = eventTypeByte & 0x0f;
                this.midiEventParam1 = stream.readUint8();
            }
            event.basetype = this.EVENT_MIDI;
            event.subtype = this.midiEventType;
            event.midiChannel = this.midiEventChannel;
            event.param1 = this.midiEventParam1;
            switch (this.midiEventType) {
                case this.EVENT_MIDI_NOTE_OFF:
                    event.param2 = stream.readUint8();
                    return event;
                case this.EVENT_MIDI_NOTE_ON:
                    event.param2 = stream.readUint8();
                    if (!event.param2) {
                        event.subtype = this.EVENT_MIDI_NOTE_OFF;
                        event.param2 = 127;
                    }
                    return event;
                case this.EVENT_MIDI_NOTE_AFTERTOUCH:
                    event.param2 = stream.readUint8();
                    return event;
                case this.EVENT_MIDI_CONTROLLER:
                    event.param2 = stream.readUint8();
                    if (event.param1 == 7) {
                    }
                    return event;
                case this.EVENT_MIDI_PROGRAM_CHANGE:
                    return event;
                case this.EVENT_MIDI_CHANNEL_AFTERTOUCH:
                    return event;
                case this.EVENT_MIDI_PITCH_BEND:
                    event.param2 = stream.readUint8();
                    return event;
                default:
                    console.log('unknown note', event);
                    return event;
            }
        }
    };
    MidiParser.prototype.parseTrackEvents = function (track) {
        var stream = new DataViewStream(track.trackContent);
        this.midiEventType = 0;
        this.midiEventChannel = 0;
        this.midiEventParam1 = 0;
        while (!stream.end()) {
            var e = this.nextEvent(stream);
            track.trackevents.push(e);
        }
    };
    MidiParser.prototype.takeDrumVoice = function (drum, drumVoices) {
        for (var i = 0; i < drumVoices.length; i++) {
            if (drumVoices[i].drum == drum) {
                return drumVoices[i];
            }
        }
        var voice = {
            measureChords: [],
            performer: {
                performerPlugin: null,
                parameters: [],
                kind: "wafdrum",
                initial: "" + drum
            },
            filters: [],
            title: 'Drum ' + drum + ': ' + this.drumTitles()[drum]
        };
        var drvc = { voice: voice, drum: drum };
        drumVoices.push(drvc);
        return drvc;
    };
    MidiParser.prototype.parametersDefs = function (plugin) {
        var pars = [];
        var pp = 0;
        var pName = plugin.getParId(pp);
        while (pName) {
            pars.push({ caption: pName, points: [{ skipMeasures: 0, skip384: 0, velocity: 60 }] });
            pp++;
            pName = plugin.getParId(pp);
        }
        return pars;
    };
    MidiParser.prototype.convert = function () {
        var midisong = this.dump();
        var count = 4;
        var division = 4;
        var sign = 'C';
        var ms = 0;
        var tempo = 120;
        var meterIdx = 1;
        var timeline = [];
        while (ms < midisong.duration) {
            var tempoRatio = 4 * 60 / tempo;
            var measureDuration = 1000 * tempoRatio * count / division;
            for (var mi = 0; mi < midisong.meters.length; mi++) {
                if (midisong.meters[mi].ms >= ms && midisong.meters[mi].ms < ms + measureDuration) {
                    count = midisong.meters[mi].count;
                    division = midisong.meters[mi].division;
                    measureDuration = 1000 * tempoRatio * count / division;
                }
            }
            var tempoChange = [];
            var tt = tempo;
            for (var i = 0; i < midisong.changes.length; i++) {
                if (midisong.changes[i].ms >= ms && midisong.changes[i].ms < ms + measureDuration) {
                    if (midisong.changes[i].bpm != tt) {
                        tempoChange.push({ delta: midisong.changes[i].ms - ms, bmp: midisong.changes[i].bpm });
                    }
                }
            }
            if (tempoChange.length) {
                tempo = tempoChange[tempoChange.length - 1].bmp;
                tempoRatio = 4 * 60 / tempo;
                var measureDuration2 = 1000 * tempoRatio * count / division;
                for (var i = 0; i < midisong.signs.length; i++) {
                    if (midisong.signs[i].ms >= ms && midisong.signs[i].ms < ms + measureDuration2) {
                        sign = midisong.signs[i].sign;
                    }
                }
                timeline.push({
                    bpm: tempo, c: count,
                    d: division, split: ms + tempoChange[0].delta, s: sign, ms: ms, len: measureDuration2
                });
                ms = ms + measureDuration2;
            }
            else {
                measureDuration = 1000 * tempoRatio * count / division;
                for (var i = 0; i < midisong.signs.length; i++) {
                    if (midisong.signs[i].ms >= ms && midisong.signs[i].ms < ms + measureDuration) {
                        sign = midisong.signs[i].sign;
                    }
                }
                timeline.push({
                    bpm: tempo, c: count,
                    d: division, split: 0, s: sign, ms: ms, len: measureDuration
                });
                ms = ms + measureDuration;
            }
            meterIdx++;
        }
        var schedule = {
            title: "import from *.mid",
            tracks: [],
            filters: [],
            measures: [],
            harmony: {
                tone: "",
                mode: "",
                progression: []
            }
        };
        var testEcho = new WAFEcho();
        var testGain = new ZvoogFxGain();
        var testEQ = new WAFEqualizer();
        var wafdrum = new WAFPercSource();
        var wafinstrument = new WAFInsSource();
        schedule.filters.push({
            filterPlugin: null,
            parameters: this.parametersDefs(testEcho),
            kind: "echo",
            initial: ""
        });
        schedule.filters.push({
            filterPlugin: null,
            parameters: this.parametersDefs(testGain),
            kind: "gain",
            initial: ""
        });
        for (var i = 0; i < timeline.length; i++) {
            schedule.measures.push({
                meter: { count: Math.round(timeline[i].c), division: Math.round(timeline[i].d) },
                tempo: Math.round(timeline[i].bpm / 5) * 5
            });
        }
        for (var i = 0; i < midisong.tracks.length; i++) {
            var trackTictle = '';
            if (midisong.tracks[i].title) {
                trackTictle = midisong.tracks[i].title;
                if (midisong.tracks[i].instrument) {
                    trackTictle = midisong.tracks[i].title + ': ' + midisong.tracks[i].instrument;
                }
            }
            else {
                if (midisong.tracks[i].instrument) {
                    trackTictle = midisong.tracks[i].instrument;
                }
                else {
                    trackTictle = 'track ' + i;
                }
            }
            var track = {
                title: trackTictle,
                voices: [],
                filters: [{
                        filterPlugin: null,
                        parameters: this.parametersDefs(testGain),
                        kind: "gain",
                        initial: ""
                    }]
            };
            schedule.tracks.push(track);
            var firstChannelNum = 0;
            for (var ch = 0; ch < midisong.tracks[i].songchords.length; ch++) {
                firstChannelNum = midisong.tracks[i].songchords[ch].channel;
                break;
            }
            if (firstChannelNum == 9) {
                track.filters.push({
                    filterPlugin: null,
                    parameters: this.parametersDefs(testEQ),
                    kind: "equalizer",
                    initial: ""
                });
                var drumNums = [];
                for (var ch = 0; ch < midisong.tracks[i].songchords.length; ch++) {
                    for (var nn = 0; nn < midisong.tracks[i].songchords[ch].notes.length; nn++) {
                        var pinum = midisong.tracks[i].songchords[ch].notes[nn].points[0].pitch;
                        if (drumNums.indexOf(pinum) < 0) {
                            drumNums.push(pinum);
                            var voice = {
                                measureChords: [],
                                performer: {
                                    performerPlugin: null,
                                    parameters: this.parametersDefs(wafdrum),
                                    kind: 'wafdrum',
                                    initial: '' + pinum
                                },
                                filters: [{
                                        filterPlugin: null,
                                        parameters: this.parametersDefs(testGain),
                                        kind: "gain",
                                        initial: ""
                                    }],
                                title: 'drum ' + pinum
                            };
                            track.voices.push(voice);
                            for (var mc = 0; mc < timeline.length; mc++) {
                                voice.measureChords.push({ chords: [] });
                            }
                            for (var chn = 0; chn < midisong.tracks[i].songchords.length; chn++) {
                                var midichord = midisong.tracks[i].songchords[chn];
                                for (var tc = 0; tc < timeline.length; tc++) {
                                    if (Math.round(midichord.when) < Math.round(timeline[tc].ms)) {
                                        var timelineMeasure = timeline[tc - 1];
                                        var skipInMeasureMs = midichord.when - timelineMeasure.ms;
                                        var skipMeter = seconds2meter32(skipInMeasureMs / 1000, timelineMeasure.bpm);
                                        skipMeter = DUU(skipMeter).simplify();
                                        var onechord = {
                                            when: skipMeter,
                                            envelopes: [],
                                            variation: 0
                                        };
                                        for (var nx = 0; nx < midichord.notes.length; nx++) {
                                            var env = { pitches: [] };
                                            var mino = midichord.notes[nx];
                                            if (mino.points[0].pitch == pinum) {
                                                for (var px = 0; px < mino.points.length; px++) {
                                                    var mipoint = mino.points[px];
                                                    env.pitches.push({
                                                        duration: DUU(seconds2meter32(mipoint.durationms / 1000, timelineMeasure.bpm)).simplify(),
                                                        pitch: mipoint.pitch - midiDrumPitchShift
                                                    });
                                                }
                                                onechord.envelopes.push(env);
                                            }
                                        }
                                        if (onechord.envelopes.length > 0) {
                                            voice.measureChords[tc - 1].chords.push(onechord);
                                        }
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            else {
                var voice = {
                    measureChords: [],
                    performer: {
                        performerPlugin: null,
                        parameters: this.parametersDefs(wafinstrument),
                        kind: 'wafinstrument',
                        initial: '' + midisong.tracks[i].program
                    },
                    filters: [{
                            filterPlugin: null,
                            parameters: this.parametersDefs(testGain),
                            kind: "gain",
                            initial: ""
                        }, {
                            filterPlugin: null,
                            parameters: this.parametersDefs(testEQ),
                            kind: "equalizer",
                            initial: ""
                        }],
                    title: 'program ' + midisong.tracks[i].program
                };
                track.voices.push(voice);
                for (var mc = 0; mc < timeline.length; mc++) {
                    voice.measureChords.push({ chords: [] });
                }
                for (var chn = 0; chn < midisong.tracks[i].songchords.length; chn++) {
                    var midichord = midisong.tracks[i].songchords[chn];
                    for (var tc = 0; tc < timeline.length; tc++) {
                        if (Math.round(midichord.when) < Math.round(timeline[tc].ms)) {
                            var timelineMeasure = timeline[tc - 1];
                            var skipInMeasureMs = midichord.when - timelineMeasure.ms;
                            var skipMeter = seconds2meter32(skipInMeasureMs / 1000, timelineMeasure.bpm);
                            skipMeter = DUU(skipMeter).simplify();
                            var onechord = {
                                when: skipMeter,
                                envelopes: [],
                                variation: 0
                            };
                            for (var nx = 0; nx < midichord.notes.length; nx++) {
                                var env = { pitches: [] };
                                var mino = midichord.notes[nx];
                                for (var px = 0; px < mino.points.length; px++) {
                                    var mipoint = mino.points[px];
                                    env.pitches.push({
                                        duration: DUU(seconds2meter32(mipoint.durationms / 1000, timelineMeasure.bpm)).simplify(),
                                        pitch: mipoint.pitch
                                    });
                                }
                                onechord.envelopes.push(env);
                            }
                            voice.measureChords[tc - 1].chords.push(onechord);
                            break;
                        }
                    }
                }
            }
        }
        console.log(schedule);
        return schedule;
    };
    MidiParser.prototype.dump = function () {
        var a = {
            parser: '1.01',
            duration: 0,
            bpm: this.header.tempoBPM,
            changes: this.header.changes,
            lyrics: this.header.lyrics,
            key: this.header.keyFlatSharp,
            mode: this.header.keyMajMin,
            meter: { count: this.header.meterCount, division: this.header.meterDivision },
            meters: this.header.meters,
            signs: this.header.signs,
            tracks: [],
            speedMode: 0,
            lineMode: 0
        };
        for (var i = 0; i < this.tracks.length; i++) {
            var miditrack = this.tracks[i];
            var tr = {
                order: i,
                title: miditrack.title ? miditrack.title : '',
                instrument: miditrack.instrument ? miditrack.instrument : '',
                volumes: miditrack.volumes,
                program: miditrack.program ? miditrack.program : 0,
                songchords: []
            };
            var maxWhen = 0;
            for (var ch = 0; ch < miditrack.chords.length; ch++) {
                var midichord = miditrack.chords[ch];
                var newchord = { when: midichord.when, notes: [], channel: midichord.channel };
                if (maxWhen < midichord.when) {
                    maxWhen = midichord.when;
                }
                tr.songchords.push(newchord);
                for (var n = 0; n < midichord.notes.length; n++) {
                    var midinote = midichord.notes[n];
                    var newnote = { points: [] };
                    newchord.notes.push(newnote);
                    for (var v = 0; v < midinote.points.length; v++) {
                        var midipoint = midinote.points[v];
                        var newpoint = { pitch: midipoint.pitch, durationms: midipoint.pointDuration };
                        newnote.points.push(newpoint);
                    }
                }
            }
            if (tr.songchords.length > 0) {
                a.tracks.push(tr);
                if (a.duration < maxWhen) {
                    a.duration = 54321 + maxWhen;
                }
            }
        }
        return a;
    };
    MidiParser.prototype.instrumentTitles = function () {
        if (this.instrumentNamesArray.length > 0) {
        }
        else {
            var insNames = [];
            insNames[0] = "Acoustic Grand Piano: Piano";
            insNames[1] = "Bright Acoustic Piano: Piano";
            insNames[2] = "Electric Grand Piano: Piano";
            insNames[3] = "Honky-tonk Piano: Piano";
            insNames[4] = "Electric Piano 1: Piano";
            insNames[5] = "Electric Piano 2: Piano";
            insNames[6] = "Harpsichord: Piano";
            insNames[7] = "Clavinet: Piano";
            insNames[8] = "Celesta: Chromatic Percussion";
            insNames[9] = "Glockenspiel: Chromatic Percussion";
            insNames[10] = "Music Box: Chromatic Percussion";
            insNames[11] = "Vibraphone: Chromatic Percussion";
            insNames[12] = "Marimba: Chromatic Percussion";
            insNames[13] = "Xylophone: Chromatic Percussion";
            insNames[14] = "Tubular Bells: Chromatic Percussion";
            insNames[15] = "Dulcimer: Chromatic Percussion";
            insNames[16] = "Drawbar Organ: Organ";
            insNames[17] = "Percussive Organ: Organ";
            insNames[18] = "Rock Organ: Organ";
            insNames[19] = "Church Organ: Organ";
            insNames[20] = "Reed Organ: Organ";
            insNames[21] = "Accordion: Organ";
            insNames[22] = "Harmonica: Organ";
            insNames[23] = "Tango Accordion: Organ";
            insNames[24] = "Acoustic Guitar (nylon): Guitar";
            insNames[25] = "Acoustic Guitar (steel): Guitar";
            insNames[26] = "Electric Guitar (jazz): Guitar";
            insNames[27] = "Electric Guitar (clean): Guitar";
            insNames[28] = "Electric Guitar (muted): Guitar";
            insNames[29] = "Overdriven Guitar: Guitar";
            insNames[30] = "Distortion Guitar: Guitar";
            insNames[31] = "Guitar Harmonics: Guitar";
            insNames[32] = "Acoustic Bass: Bass";
            insNames[33] = "Electric Bass (finger): Bass";
            insNames[34] = "Electric Bass (pick): Bass";
            insNames[35] = "Fretless Bass: Bass";
            insNames[36] = "Slap Bass 1: Bass";
            insNames[37] = "Slap Bass 2: Bass";
            insNames[38] = "Synth Bass 1: Bass";
            insNames[39] = "Synth Bass 2: Bass";
            insNames[40] = "Violin: Strings";
            insNames[41] = "Viola: Strings";
            insNames[42] = "Cello: Strings";
            insNames[43] = "Contrabass: Strings";
            insNames[44] = "Tremolo Strings: Strings";
            insNames[45] = "Pizzicato Strings: Strings";
            insNames[46] = "Orchestral Harp: Strings";
            insNames[47] = "Timpani: Strings";
            insNames[48] = "String Ensemble 1: Ensemble";
            insNames[49] = "String Ensemble 2: Ensemble";
            insNames[50] = "Synth Strings 1: Ensemble";
            insNames[51] = "Synth Strings 2: Ensemble";
            insNames[52] = "Choir Aahs: Ensemble";
            insNames[53] = "Voice Oohs: Ensemble";
            insNames[54] = "Synth Choir: Ensemble";
            insNames[55] = "Orchestra Hit: Ensemble";
            insNames[56] = "Trumpet: Brass";
            insNames[57] = "Trombone: Brass";
            insNames[58] = "Tuba: Brass";
            insNames[59] = "Muted Trumpet: Brass";
            insNames[60] = "French Horn: Brass";
            insNames[61] = "Brass Section: Brass";
            insNames[62] = "Synth Brass 1: Brass";
            insNames[63] = "Synth Brass 2: Brass";
            insNames[64] = "Soprano Sax: Reed";
            insNames[65] = "Alto Sax: Reed";
            insNames[66] = "Tenor Sax: Reed";
            insNames[67] = "Baritone Sax: Reed";
            insNames[68] = "Oboe: Reed";
            insNames[69] = "English Horn: Reed";
            insNames[70] = "Bassoon: Reed";
            insNames[71] = "Clarinet: Reed";
            insNames[72] = "Piccolo: Pipe";
            insNames[73] = "Flute: Pipe";
            insNames[74] = "Recorder: Pipe";
            insNames[75] = "Pan Flute: Pipe";
            insNames[76] = "Blown bottle: Pipe";
            insNames[77] = "Shakuhachi: Pipe";
            insNames[78] = "Whistle: Pipe";
            insNames[79] = "Ocarina: Pipe";
            insNames[80] = "Lead 1 (square): Synth Lead";
            insNames[81] = "Lead 2 (sawtooth): Synth Lead";
            insNames[82] = "Lead 3 (calliope): Synth Lead";
            insNames[83] = "Lead 4 (chiff): Synth Lead";
            insNames[84] = "Lead 5 (charang): Synth Lead";
            insNames[85] = "Lead 6 (voice): Synth Lead";
            insNames[86] = "Lead 7 (fifths): Synth Lead";
            insNames[87] = "Lead 8 (bass + lead): Synth Lead";
            insNames[88] = "Pad 1 (new age): Synth Pad";
            insNames[89] = "Pad 2 (warm): Synth Pad";
            insNames[90] = "Pad 3 (polysynth): Synth Pad";
            insNames[91] = "Pad 4 (choir): Synth Pad";
            insNames[92] = "Pad 5 (bowed): Synth Pad";
            insNames[93] = "Pad 6 (metallic): Synth Pad";
            insNames[94] = "Pad 7 (halo): Synth Pad";
            insNames[95] = "Pad 8 (sweep): Synth Pad";
            insNames[96] = "FX 1 (rain): Synth Effects";
            insNames[97] = "FX 2 (soundtrack): Synth Effects";
            insNames[98] = "FX 3 (crystal): Synth Effects";
            insNames[99] = "FX 4 (atmosphere): Synth Effects";
            insNames[100] = "FX 5 (brightness): Synth Effects";
            insNames[101] = "FX 6 (goblins): Synth Effects";
            insNames[102] = "FX 7 (echoes): Synth Effects";
            insNames[103] = "FX 8 (sci-fi): Synth Effects";
            insNames[104] = "Sitar: Ethnic";
            insNames[105] = "Banjo: Ethnic";
            insNames[106] = "Shamisen: Ethnic";
            insNames[107] = "Koto: Ethnic";
            insNames[108] = "Kalimba: Ethnic";
            insNames[109] = "Bagpipe: Ethnic";
            insNames[110] = "Fiddle: Ethnic";
            insNames[111] = "Shanai: Ethnic";
            insNames[112] = "Tinkle Bell: Percussive";
            insNames[113] = "Agogo: Percussive";
            insNames[114] = "Steel Drums: Percussive";
            insNames[115] = "Woodblock: Percussive";
            insNames[116] = "Taiko Drum: Percussive";
            insNames[117] = "Melodic Tom: Percussive";
            insNames[118] = "Synth Drum: Percussive";
            insNames[119] = "Reverse Cymbal: Percussive";
            insNames[120] = "Guitar Fret Noise: Sound effects";
            insNames[121] = "Breath Noise: Sound effects";
            insNames[122] = "Seashore: Sound effects";
            insNames[123] = "Bird Tweet: Sound effects";
            insNames[124] = "Telephone Ring: Sound effects";
            insNames[125] = "Helicopter: Sound effects";
            insNames[126] = "Applause: Sound effects";
            insNames[127] = "Gunshot: Sound effects";
            this.instrumentNamesArray = insNames;
        }
        return this.instrumentNamesArray;
    };
    ;
    MidiParser.prototype.drumTitles = function () {
        if (this.drumNamesArray.length < 1) {
            var drumNames = [];
            drumNames[35] = "Bass Drum 2";
            drumNames[36] = "Bass Drum 1";
            drumNames[37] = "Side Stick/Rimshot";
            drumNames[38] = "Snare Drum 1";
            drumNames[39] = "Hand Clap";
            drumNames[40] = "Snare Drum 2";
            drumNames[41] = "Low Tom 2";
            drumNames[42] = "Closed Hi-hat";
            drumNames[43] = "Low Tom 1";
            drumNames[44] = "Pedal Hi-hat";
            drumNames[45] = "Mid Tom 2";
            drumNames[46] = "Open Hi-hat";
            drumNames[47] = "Mid Tom 1";
            drumNames[48] = "High Tom 2";
            drumNames[49] = "Crash Cymbal 1";
            drumNames[50] = "High Tom 1";
            drumNames[51] = "Ride Cymbal 1";
            drumNames[52] = "Chinese Cymbal";
            drumNames[53] = "Ride Bell";
            drumNames[54] = "Tambourine";
            drumNames[55] = "Splash Cymbal";
            drumNames[56] = "Cowbell";
            drumNames[57] = "Crash Cymbal 2";
            drumNames[58] = "Vibra Slap";
            drumNames[59] = "Ride Cymbal 2";
            drumNames[60] = "High Bongo";
            drumNames[61] = "Low Bongo";
            drumNames[62] = "Mute High Conga";
            drumNames[63] = "Open High Conga";
            drumNames[64] = "Low Conga";
            drumNames[65] = "High Timbale";
            drumNames[66] = "Low Timbale";
            drumNames[67] = "High Agogo";
            drumNames[68] = "Low Agogo";
            drumNames[69] = "Cabasa";
            drumNames[70] = "Maracas";
            drumNames[71] = "Short Whistle";
            drumNames[72] = "Long Whistle";
            drumNames[73] = "Short Guiro";
            drumNames[74] = "Long Guiro";
            drumNames[75] = "Claves";
            drumNames[76] = "High Wood Block";
            drumNames[77] = "Low Wood Block";
            drumNames[78] = "Mute Cuica";
            drumNames[79] = "Open Cuica";
            drumNames[80] = "Mute Triangle";
            drumNames[81] = "Open Triangle";
            this.drumNamesArray = drumNames;
        }
        return this.drumNamesArray;
    };
    ;
    return MidiParser;
}());
var MusicXMLFileImporter = (function () {
    function MusicXMLFileImporter() {
    }
    MusicXMLFileImporter.prototype.list = function (onFinish) { };
    ;
    MusicXMLFileImporter.prototype.goFolder = function (title, onFinish) { };
    ;
    MusicXMLFileImporter.prototype.goUp = function (onFinish) { };
    ;
    MusicXMLFileImporter.prototype.readSongData = function (title, onFinish) {
        var fileSelector = document.createElement('input');
        fileSelector.setAttribute('type', 'file');
        var me = this;
        fileSelector.addEventListener("change", function (ev) {
            if (fileSelector.files) {
                var file = fileSelector.files[0];
                var fileReader = new FileReader();
                fileReader.onload = function (progressEvent) {
                    if (progressEvent.target) {
                        var xml = progressEvent.target.result;
                        var domParser = new DOMParser();
                        var _document = domParser.parseFromString(xml, "text/xml");
                        var mxml = new TreeValue('', '', []);
                        mxml.fill(_document);
                        var zvoogSchedule = me.parseMXML(mxml);
                        onFinish(zvoogSchedule);
                    }
                };
                fileReader.readAsBinaryString(file);
            }
        }, false);
        fileSelector.click();
    };
    ;
    MusicXMLFileImporter.prototype.parseMXML = function (mxml) {
        console.log(mxml);
        var zvoogSchedule = {
            title: '',
            tracks: [],
            filters: [],
            measures: [],
            harmony: {
                tone: '',
                mode: '',
                progression: []
            }
        };
        var firstPartMeasures = mxml.first('part').every('measure');
        var timecount = '4';
        var timediv = '4';
        var fifths = '';
        for (var mm = 0; mm < firstPartMeasures.length; mm++) {
            var attributes = firstPartMeasures[mm].first('attributes');
            if (((attributes.first('time').first('beats').value) && attributes.first('time').first('beats').value != timecount)
                || ((attributes.first('time').first('beat-type').value) && attributes.first('time').first('beat-type').value != timediv)
                || ((attributes.first('key').first('fifths').value) && fifths != attributes.first('key').first('fifths').value)) {
                timecount = attributes.first('time').first('beats').value;
                timediv = attributes.first('time').first('beat-type').value;
                fifths = attributes.first('key').first('fifths').value;
                console.log(mm, 'time', timecount, timediv, 'fifths', attributes.first('key').first('fifths').value);
            }
            var directions = firstPartMeasures[mm].every('direction');
            for (var dd = 0; dd < directions.length; dd++) {
                var dirtype = directions[dd].first('direction-type').children[0];
                if (dirtype.name == 'rehearsal') {
                    console.log(dirtype.name, mm, dirtype.value);
                }
                else {
                    if (dirtype.name == 'dynamics') {
                        console.log(dirtype.name, mm, directions[dd].first('sound').first('dynamics').value);
                    }
                    else {
                        if (dirtype.name == 'metronome') {
                            console.log(dirtype.name, mm, dirtype.first('per-minute').value, dirtype.first('beat-unit').value);
                        }
                        else {
                            if (dirtype.name == 'words') {
                                console.log(dirtype.name, mm, dirtype.value);
                            }
                            else {
                                if (dirtype.name == 'bracket') {
                                    console.log(dirtype.name, mm, dirtype.first('type').value, dirtype.first('number').value, dirtype.first('line-end').value, dirtype.first('end-length').value);
                                }
                                else {
                                    console.log(dirtype.name, mm, directions[dd]);
                                }
                            }
                        }
                    }
                }
            }
        }
        var scorePart = mxml.first('part-list').every('score-part');
        for (var i = 0; i < scorePart.length; i++) {
            var newtrack = {
                title: scorePart[i].first('id').value + ': ' + scorePart[i].first('part-name').value,
                voices: [],
                filters: []
            };
            zvoogSchedule.tracks.push(newtrack);
            var midiInstrument = scorePart[i].every('midi-instrument');
            for (var kk = 0; kk < midiInstrument.length; kk++) {
                var unpitched = midiInstrument[kk].first('midi-unpitched').value;
                var newvoice = {
                    measureChords: [],
                    performer: {
                        performerPlugin: null,
                        parameters: [],
                        kind: '',
                        initial: ''
                    },
                    filters: [],
                    title: ''
                };
                newtrack.voices.push(newvoice);
                if (unpitched) {
                    newvoice.title = 'drum ' + unpitched;
                    newvoice.performer.kind = 'wafdrum';
                    newvoice.performer.initial = unpitched;
                }
                else {
                    newvoice.title = 'program ' + midiInstrument[kk].first('midi-program').value;
                    newvoice.performer.kind = 'wafinstrument';
                    newvoice.performer.initial = midiInstrument[kk].first('midi-program').value;
                }
            }
        }
        return zvoogSchedule;
    };
    MusicXMLFileImporter.prototype.createSongData = function (title, schedule, onFinish) { };
    ;
    MusicXMLFileImporter.prototype.updateSongData = function (title, schedule, onFinish) { };
    ;
    MusicXMLFileImporter.prototype.deleteSongData = function (title, onFinish) { };
    ;
    MusicXMLFileImporter.prototype.renameSongData = function (title, newTitle, onFinish) { };
    ;
    MusicXMLFileImporter.prototype.createFolder = function (title, onFinish) { };
    ;
    MusicXMLFileImporter.prototype.deleteFolder = function (title, onFinish) { };
    ;
    MusicXMLFileImporter.prototype.renameFolder = function (title, newTitle, onFinish) { };
    ;
    return MusicXMLFileImporter;
}());
;
var TreeValue = (function () {
    function TreeValue(name, value, children) {
        this.name = name;
        this.value = value;
        this.children = children;
    }
    TreeValue.prototype.clone = function () {
        var r = new TreeValue('', '', []);
        r.name = this.name;
        r.value = this.value;
        r.children = [];
        for (var i = 0; i < this.children.length; i++) {
            r.children.push(this.children[i].clone());
        }
        return r;
    };
    TreeValue.prototype.first = function (name) {
        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i].name == name) {
                return this.children[i];
            }
        }
        return new TreeValue('', '', []);
    };
    TreeValue.prototype.every = function (name) {
        var r = [];
        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i].name == name) {
                r.push(this.children[i]);
            }
        }
        return r;
    };
    TreeValue.prototype.seek = function (name, subname, subvalue) {
        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i].name == name) {
                var t = this.children[i].first(subname);
                if (t.value == subvalue) {
                    return this.children[i];
                }
            }
        }
        return new TreeValue('', '', []);
    };
    TreeValue.prototype.readDocChildren = function (node) {
        var children = [];
        if (node.children) {
            for (var i = 0; i < node.children.length; i++) {
                var c = node.children[i];
                var t = '';
                if (c.childNodes && c.childNodes[0] && c.childNodes[0].nodeName == '#text') {
                    t = ('' + c.childNodes[0].nodeValue).trim();
                }
                children.push(new TreeValue(c.localName, t, this.readDocChildren(c)));
            }
        }
        if (node.attributes) {
            for (var i = 0; i < node.attributes.length; i++) {
                var a = node.attributes[i];
                children.push(new TreeValue(a.localName, a.value, []));
            }
        }
        return children;
    };
    TreeValue.prototype.fill = function (document) {
        var tt = this.readDocChildren(document);
        if (tt.length > 0) {
            this.name = tt[0].name;
            this.value = tt[0].value;
            this.children = tt[0].children;
        }
    };
    return TreeValue;
}());
var ZMainMenu = (function () {
    function ZMainMenu(from) {
        this.currentLevel = 0;
        this.panels = [];
        this.songFolder = { path: "Current song", icon: "", folders: [], items: [], afterOpen: function () { } };
        this.muzXBox = from;
        this.layerSelector = new LayerSelector(from);
        this.panels.push(new SingleMenuPanel('menuPaneDiv1', 'menu1textHead', 'menu1content'));
        this.panels.push(new SingleMenuPanel('menuPaneDiv2', 'menu2textHead', 'menu2content'));
        this.panels.push(new SingleMenuPanel('menuPaneDiv3', 'menu3textHead', 'menu3content'));
        this.panels.push(new SingleMenuPanel('menuPaneDiv4', 'menu4textHead', 'menu4content'));
        this.panels.push(new SingleMenuPanel('menuPaneDiv5', 'menu5textHead', 'menu5content'));
        this.menuRoot = {
            path: 'Menu',
            icon: '',
            folders: [],
            items: [],
            afterOpen: function () { }
        };
        this.reBuildMenu();
    }
    ZMainMenu.prototype.openNextLevel = function () {
        this.open_nn_level(this.currentLevel);
        this.currentLevel++;
    };
    ZMainMenu.prototype.backPreLevel = function () {
        if (this.currentLevel - 1 >= 0 && this.currentLevel - 1 < this.panels.length) {
            this.panels[this.currentLevel - 1].off();
        }
        this.currentLevel--;
    };
    ZMainMenu.prototype.hideMenu = function () {
        for (var i = 0; i < this.panels.length; i++) {
            this.panels[i].off();
        }
        this.currentLevel = 0;
    };
    ZMainMenu.prototype.moveSelection = function (level, row) {
        this.panels[level - 1].moveSelection(row);
    };
    ZMainMenu.prototype.createFolderClick = function (idx) {
        var _this = this;
        return function () {
            _this.moveSelection(_this.currentLevel, idx);
            _this.currentLevel++;
            _this.panels[_this.currentLevel - 2].selection = idx;
            _this.open_nn_level(_this.currentLevel - 1);
        };
    };
    ZMainMenu.prototype.createActionClick = function (nn, item) {
        var _this = this;
        return function () {
            _this.panels[_this.currentLevel - 1].selection = nn;
            if (item.autoclose) {
                _this.hideMenu();
            }
            else {
                _this.moveSelection(_this.currentLevel, nn);
            }
            item.action();
        };
    };
    ZMainMenu.prototype.reFillMenulevel = function (menuContent, subRoot, selectedLevel) {
        while (menuContent.lastChild) {
            menuContent.removeChild(menuContent.lastChild);
        }
        for (var i = 0; i < subRoot.items.length; i++) {
            var item = subRoot.items[i];
            var div = document.createElement('div');
            div.classList.add('menuActionRow');
            div.id = 'menuItem1-' + i;
            div.onclick = this.createActionClick(i, item);
            div.innerText = item.label;
            menuContent.appendChild(div);
            if (selectedLevel == i) {
                div.dataset['rowSelection'] = 'yes';
            }
            else {
                div.dataset['rowSelection'] = 'no';
            }
        }
        for (var i = 0; i < subRoot.folders.length; i++) {
            var folder = subRoot.folders[i];
            var div = document.createElement('div');
            div.classList.add('menuFolderRow');
            div.id = 'menuFolder1-' + i;
            div.onclick = this.createFolderClick(subRoot.items.length + i);
            div.innerText = folder.path;
            menuContent.appendChild(div);
            if (selectedLevel == subRoot.items.length + i) {
                div.dataset['rowSelection'] = 'yes';
            }
            else {
                div.dataset['rowSelection'] = 'no';
            }
        }
    };
    ZMainMenu.prototype.open_nn_level = function (nn) {
        var wi = '' + (6 + (4 - nn) * 0.5) + 'cm';
        this.panels[nn].levelStyle.width = wi;
        var subRoot = this.menuRoot;
        var txt = this.menuRoot.path;
        var action = undefined;
        if (nn == 1) {
            var folderIdx1 = this.panels[0].selection - this.menuRoot.items.length;
            action = this.menuRoot.folders[folderIdx1].afterOpen;
            txt = this.menuRoot.folders[folderIdx1].path;
            subRoot = this.menuRoot.folders[folderIdx1];
        }
        if (nn == 2) {
            var folderIdx1 = this.panels[0].selection - this.menuRoot.items.length;
            var folderIdx2 = this.panels[1].selection - this.menuRoot.folders[folderIdx1].items.length;
            action = this.menuRoot.folders[folderIdx1].folders[folderIdx2].afterOpen;
            txt = this.menuRoot.folders[folderIdx1].path;
            subRoot = this.menuRoot.folders[folderIdx1].folders[folderIdx2];
        }
        if (nn == 3) {
            var folderIdx1 = this.panels[0].selection - this.menuRoot.items.length;
            var folderIdx2 = this.panels[1].selection - this.menuRoot.folders[folderIdx1].items.length;
            var folderIdx3 = this.panels[2].selection - this.menuRoot.folders[folderIdx1].folders[folderIdx2].items.length;
            action = this.menuRoot.folders[folderIdx1].folders[folderIdx2].folders[folderIdx3].afterOpen;
            txt = this.menuRoot.folders[folderIdx1].folders[folderIdx2].folders[folderIdx3].path;
            subRoot = this.menuRoot.folders[folderIdx1].folders[folderIdx2].folders[folderIdx3];
        }
        if (nn == 4) {
            var folderIdx1 = this.panels[0].selection - this.menuRoot.items.length;
            var folderIdx2 = this.panels[1].selection - this.menuRoot.folders[folderIdx1].items.length;
            var folderIdx3 = this.panels[2].selection - this.menuRoot.folders[folderIdx1].folders[folderIdx2].items.length;
            var folderIdx4 = this.panels[3].selection - this.menuRoot.folders[folderIdx1].folders[folderIdx2].folders[folderIdx3].items.length;
            action = this.menuRoot.folders[folderIdx1].folders[folderIdx2].folders[folderIdx3].folders[folderIdx4].afterOpen;
            this.menuRoot.folders[folderIdx1].folders[folderIdx2].folders[folderIdx3].folders[folderIdx4].path;
            subRoot = this.menuRoot.folders[folderIdx1].folders[folderIdx2].folders[folderIdx3].folders[folderIdx4];
        }
        this.reFillMenulevel(this.panels[nn].menuContent, subRoot, this.panels[nn].selection);
        this.panels[nn].menuTextHead.innerText = txt;
        if (action)
            action();
    };
    ZMainMenu.prototype.reBuildMenu = function () {
        this.menuRoot.items.length = 0;
        this.menuRoot.folders.length = 0;
        this.menuRoot.items.push({
            label: 'import midi',
            action: function () {
                var me = window['MZXB'];
                if (me) {
                    me.testFSmidi();
                }
            },
            autoclose: true,
            icon: ''
        });
        this.menuRoot.items.push({
            label: 'play/stop',
            action: function () {
                console.log('play/stop');
            },
            autoclose: true,
            icon: ''
        });
        this.menuRoot.folders.push(this.songFolder);
        this.menuRoot.folders.push({
            path: "Rhythm patterns", icon: "", folders: [], items: [
                {
                    label: 'plain 1/16', autoclose: true, icon: '', action: function () {
                        var rr = [
                            { count: 1, division: 16 }, { count: 1, division: 16 },
                            { count: 1, division: 16 }, { count: 1, division: 16 },
                            { count: 1, division: 16 }, { count: 1, division: 16 },
                            { count: 1, division: 16 }, { count: 1, division: 16 }
                        ];
                        console.log('plain 1/16', rr);
                        var me = window['MZXB'];
                        if (me) {
                            me.setGrid(rr);
                        }
                    }
                },
                {
                    label: 'plain 1/8', autoclose: true, icon: '', action: function () {
                        var rr = [
                            { count: 1, division: 8 }, { count: 1, division: 8 },
                            { count: 1, division: 8 }, { count: 1, division: 8 }
                        ];
                        console.log('plain 1/8', rr);
                        var me = window['MZXB'];
                        if (me) {
                            me.setGrid(rr);
                        }
                    }
                },
                {
                    label: 'swing 1/8', autoclose: true, icon: '', action: function () {
                        var rr = [
                            { count: 5, division: 32 }, { count: 3, division: 32 },
                            { count: 5, division: 32 }, { count: 3, division: 32 }
                        ];
                        console.log('swing 1/8', rr);
                        var me = window['MZXB'];
                        if (me) {
                            me.setGrid(rr);
                        }
                    }
                }
            ], afterOpen: function () { }
        });
    };
    ZMainMenu.prototype.fillFrom = function (prj) {
        this.songFolder.items.length = 0;
        this.songFolder.folders.length = 0;
        this.songFolder.items.push({ label: "+track", icon: "", autoclose: false, action: function () { console.log('+track'); } });
        this.songFolder.items.push({ label: "+fx", icon: "", autoclose: false, action: function () { console.log('+fx'); } });
        for (var tt = 0; tt < prj.tracks.length; tt++) {
            var songtrack = prj.tracks[tt];
            var tr = {
                path: 'track ' + songtrack.title, icon: "", folders: [], items: [],
                afterOpen: this.layerSelector.upTrack(tt)
            };
            this.songFolder.folders.push(tr);
            tr.items.push({ label: "-track", icon: "", autoclose: false, action: function () { console.log('-track'); } });
            tr.items.push({ label: "+tfx", icon: "", autoclose: false, action: function () { console.log('+tfx'); } });
            tr.items.push({ label: "+vox", icon: "", autoclose: false, action: function () { console.log('+vox'); } });
            for (var vv = 0; vv < songtrack.voices.length; vv++) {
                var songvox = songtrack.voices[vv];
                var vox = {
                    path: 'vox ' + songvox.title, icon: "", folders: [], items: [],
                    afterOpen: this.layerSelector.upVox(tt, vv)
                };
                tr.folders.push(vox);
                vox.items.push({ label: "+vfx", icon: "", autoclose: false, action: function () { console.log('+vfx'); } });
                var source = {
                    path: 'src ' + songvox.performer.kind, icon: "", folders: [], items: [],
                    afterOpen: this.layerSelector.upVoxProvider(tt, vv)
                };
                source.items.push({ label: "?src", icon: "", autoclose: false, action: function () { console.log('?src'); } });
                for (var kk = 0; kk < songvox.performer.parameters.length; kk++) {
                    var par = {
                        label: "par " + kk + " " + songvox.performer.parameters[kk].caption, icon: "", autoclose: false,
                        action: this.layerSelector.upVoxProviderParam(tt, vv, kk)
                    };
                    source.items.push(par);
                }
                vox.folders.push(source);
                for (var ff = 0; ff < songvox.filters.length; ff++) {
                    var filter = {
                        path: 'fx ' + songvox.filters[ff].kind, icon: "", folders: [], items: [],
                        afterOpen: this.layerSelector.upVoxFx(tt, vv, ff)
                    };
                    vox.folders.push(filter);
                    var voxfilter = songvox.filters[ff];
                    filter.items.push({ label: "-vfx", icon: "", autoclose: false, action: function () { console.log('-vfx'); } });
                    for (var kk = 0; kk < voxfilter.parameters.length; kk++) {
                        var par = {
                            label: "par " + kk + " " + voxfilter.parameters[kk].caption, icon: "", autoclose: false,
                            action: this.layerSelector.upVoxFxParam(tt, vv, ff, kk)
                        };
                        filter.items.push(par);
                    }
                }
            }
            for (var ff = 0; ff < songtrack.filters.length; ff++) {
                var filter = {
                    path: 'fx ' + songtrack.filters[ff].kind, icon: "", folders: [], items: [],
                    afterOpen: this.layerSelector.upTrackFx(tt, ff)
                };
                tr.folders.push(filter);
                var trfilter = songtrack.filters[ff];
                filter.items.push({ label: "-fx", icon: "", autoclose: false, action: function () { console.log('-fx'); } });
                for (var kk = 0; kk < trfilter.parameters.length; kk++) {
                    var par = {
                        label: "par " + kk + " " + trfilter.parameters[kk].caption, icon: "", autoclose: false,
                        action: this.layerSelector.upTrackFxParam(tt, ff, kk)
                    };
                    filter.items.push(par);
                }
            }
        }
        for (var ff = 0; ff < prj.filters.length; ff++) {
            var filter = {
                path: 'fx ' + prj.filters[ff].kind, icon: "", folders: [], items: [],
                afterOpen: this.layerSelector.upSongFx(ff)
            };
            this.songFolder.folders.push(filter);
            var songfilter = prj.filters[ff];
            filter.items.push({ label: "-fx", icon: "", autoclose: false, action: function () { console.log('-fx'); } });
            for (var kk = 0; kk < songfilter.parameters.length; kk++) {
                var par = {
                    label: "par " + kk + " " + songfilter.parameters[kk].caption, icon: "", autoclose: false,
                    action: this.layerSelector.upSongFxParam(ff, kk)
                };
                filter.items.push(par);
            }
        }
    };
    return ZMainMenu;
}());
var SingleMenuPanel = (function () {
    function SingleMenuPanel(menuPaneDivID, menuTextHeadID, menuContentID) {
        this.selection = 0;
        var el = document.getElementById(menuPaneDivID);
        if (el) {
            this.levelStyle = el.style;
        }
        el = document.getElementById(menuTextHeadID);
        if (el) {
            this.menuTextHead = el;
        }
        el = document.getElementById(menuContentID);
        if (el) {
            this.menuContent = el;
        }
    }
    SingleMenuPanel.prototype.off = function () {
        this.levelStyle.width = '0cm';
    };
    SingleMenuPanel.prototype.moveSelection = function (row) {
        for (var i = 0; i < this.menuContent.childNodes.length; i++) {
            var child = this.menuContent.childNodes[i];
            child.dataset['rowSelection'] = 'no';
        }
        var child = this.menuContent.childNodes[row];
        child.dataset['rowSelection'] = 'yes';
    };
    return SingleMenuPanel;
}());
console.log('MuzXBox v1.01');
var midiDrumPitchShift = 23;
var us;
var MuzXBox = (function () {
    function MuzXBox() {
        this.menuButton = {
            x: 0,
            y: 0,
            w: 10,
            h: 10,
            rx: 3,
            ry: 3,
            css: 'debug',
            action: this.testFS,
            id: 'menuButtonTest1'
        };
        console.log('start');
        us = new ZUserSetting();
    }
    MuzXBox.prototype.initAll = function () {
        console.log('initAll');
        this.zrenderer = new ZRender();
        this.zInputDeviceHandler = new ZInputDeviceHandler(this);
        this.zMainMenu = new ZMainMenu(this);
        this.zrenderer.bindLayers();
        this.zrenderer.initUI();
        this.createUI();
        us.selectMode('ru');
        us.selectMode('en');
        us.selectMode('wwwwwww');
        us.selectMode('en');
    };
    MuzXBox.prototype.createUI = function () {
        var emptySchedule = {
            title: 'Empty project', tracks: [],
            filters: [],
            measures: [],
            harmony: {
                tone: '',
                mode: '',
                progression: []
            }
        };
        this.currentSchedule = emptySchedule;
        this.zrenderer.drawSchedule(emptySchedule);
        this.zMainMenu.fillFrom(this.currentSchedule);
    };
    MuzXBox.prototype.setGrid = function (meters) {
        this.currentSchedule.rhythm = meters;
        this.zrenderer.gridRenderer.reSetGrid(this.zrenderer, meters, this.currentSchedule);
    };
    MuzXBox.prototype.testFSmidi = function () {
        var test = new MIDIFileImporter();
        test.readSongData("any", function (result) {
            if (result) {
                var me = window['MZXB'];
                if (me) {
                    me.currentSchedule = result;
                    me.zrenderer.drawSchedule(result);
                    me.zMainMenu.fillFrom(result);
                }
            }
        });
    };
    MuzXBox.prototype.testFSmxml = function () {
        var test = new MusicXMLFileImporter();
        test.readSongData("any", function (result) {
            if (result) {
                var me = window['MZXB'];
                if (me) {
                    console.log(result);
                    me.currentSchedule = result;
                    me.zrenderer.drawSchedule(result);
                }
            }
        });
    };
    MuzXBox.prototype.testFS = function () {
        var me = window['MZXB'];
        if (me) {
            me.testFSmidi();
        }
    };
    return MuzXBox;
}());
window['MZXB'] = new MuzXBox();
var MeasureInfoRenderer = (function () {
    function MeasureInfoRenderer() {
    }
    MeasureInfoRenderer.prototype.attach = function (zRender) {
        this.bottomTimelineLayerGroup = document.getElementById('bottomTimelineLayerGroup');
        this.initMeasureInfoAnchors(zRender);
    };
    MeasureInfoRenderer.prototype.fillMeasureInfo = function (song, ratioDuration, ratioThickness) {
        this.fillMeasureInfo1(song, ratioDuration, ratioThickness);
        this.fillMeasureInfo4(song, ratioDuration, ratioThickness);
        this.fillMeasureInfo16(song, ratioDuration, ratioThickness);
        this.fillMeasureInfo64(song, ratioDuration, ratioThickness);
        this.fillMeasureInfo256(song, ratioDuration, ratioThickness);
    };
    MeasureInfoRenderer.prototype.initMeasureInfoAnchors = function (zRender) {
        this.measuresMeasureInfoAnchor1 = TAnchor(0, 0, 1111, 1111, zRender.zoomMin, zRender.zoomNote);
        this.measuresMeasureInfoAnchor4 = TAnchor(0, 0, 1111, 1111, zRender.zoomNote, zRender.zoomMeasure);
        this.measuresMeasureInfoAnchor16 = TAnchor(0, 0, 1111, 1111, zRender.zoomMeasure, zRender.zoomSong);
        this.measuresMeasureInfoAnchor64 = TAnchor(0, 0, 1111, 1111, zRender.zoomSong, zRender.zoomFar);
        this.measuresMeasureInfoAnchor256 = TAnchor(0, 0, 1111, 1111, zRender.zoomFar, zRender.zoomBig + 1);
        zRender.layers.push({
            g: this.bottomTimelineLayerGroup, stickBottom: 0, anchors: [
                this.measuresMeasureInfoAnchor1, this.measuresMeasureInfoAnchor4, this.measuresMeasureInfoAnchor16, this.measuresMeasureInfoAnchor64, this.measuresMeasureInfoAnchor256
            ]
        });
    };
    MeasureInfoRenderer.prototype.clearAnchorsContent = function (zRender, songDuration) {
        var anchors = [
            this.measuresMeasureInfoAnchor1, this.measuresMeasureInfoAnchor4, this.measuresMeasureInfoAnchor16, this.measuresMeasureInfoAnchor64, this.measuresMeasureInfoAnchor256
        ];
        for (var i = 0; i < anchors.length; i++) {
            zRender.clearSingleAnchor(anchors[i], songDuration);
        }
    };
    MeasureInfoRenderer.prototype.fillMeasureInfo1 = function (song, ratioDuration, ratioThickness) {
        var time = 0;
        var curMeterCount = 0;
        var curDivision = 0;
        var curTempo = 0;
        for (var i = 0; i < song.measures.length; i++) {
            var measureDuration = meter2seconds(song.measures[i].tempo, song.measures[i].meter);
            var singlemeasuresTimelineAnchor1 = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, 128 * ratioThickness, this.measuresMeasureInfoAnchor1.showZoom, this.measuresMeasureInfoAnchor1.hideZoom);
            if (curMeterCount != song.measures[i].meter.count || curDivision != song.measures[i].meter.division || curTempo != song.measures[i].tempo) {
                curMeterCount = song.measures[i].meter.count;
                curDivision = song.measures[i].meter.division;
                curTempo = song.measures[i].tempo;
                singlemeasuresTimelineAnchor1.content.push(TText(time * ratioDuration, -1, 'barNumber textSize1', (song.measures[i].tempo + ': ' + song.measures[i].meter.count + '/' + song.measures[i].meter.division)));
            }
            this.measuresMeasureInfoAnchor1.content.push(singlemeasuresTimelineAnchor1);
            time = time + measureDuration;
        }
    };
    MeasureInfoRenderer.prototype.fillMeasureInfo4 = function (song, ratioDuration, ratioThickness) {
        var time = 0;
        var curMeterCount = 0;
        var curDivision = 0;
        var curTempo = 0;
        for (var i = 0; i < song.measures.length; i++) {
            var measureDuration = meter2seconds(song.measures[i].tempo, song.measures[i].meter);
            var singlemeasuresTimelineAnchor4 = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, 128 * ratioThickness, this.measuresMeasureInfoAnchor4.showZoom, this.measuresMeasureInfoAnchor4.hideZoom);
            if (curMeterCount != song.measures[i].meter.count || curDivision != song.measures[i].meter.division || curTempo != song.measures[i].tempo) {
                curMeterCount = song.measures[i].meter.count;
                curDivision = song.measures[i].meter.division;
                curTempo = song.measures[i].tempo;
                singlemeasuresTimelineAnchor4.content.push(TText(time * ratioDuration, -4, 'barNumber textSize4', (song.measures[i].tempo + ': ' + song.measures[i].meter.count + '/' + song.measures[i].meter.division)));
            }
            this.measuresMeasureInfoAnchor4.content.push(singlemeasuresTimelineAnchor4);
            time = time + measureDuration;
        }
    };
    MeasureInfoRenderer.prototype.fillMeasureInfo16 = function (song, ratioDuration, ratioThickness) {
        var time = 0;
        var curMeterCount = 0;
        var curDivision = 0;
        var curTempo = 0;
        for (var i = 0; i < song.measures.length; i++) {
            var measureDuration = meter2seconds(song.measures[i].tempo, song.measures[i].meter);
            var singlemeasuresTimelineAnchor16 = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, 128 * ratioThickness, this.measuresMeasureInfoAnchor16.showZoom, this.measuresMeasureInfoAnchor16.hideZoom);
            if (curMeterCount != song.measures[i].meter.count || curDivision != song.measures[i].meter.division || curTempo != song.measures[i].tempo) {
                curMeterCount = song.measures[i].meter.count;
                curDivision = song.measures[i].meter.division;
                curTempo = song.measures[i].tempo;
                singlemeasuresTimelineAnchor16.content.push({
                    x: time * ratioDuration, y: -16, css: 'barNumber textSize16',
                    text: (song.measures[i].tempo + ': ' + song.measures[i].meter.count + '/' + song.measures[i].meter.division)
                });
            }
            this.measuresMeasureInfoAnchor16.content.push(singlemeasuresTimelineAnchor16);
            time = time + measureDuration;
        }
    };
    MeasureInfoRenderer.prototype.fillMeasureInfo64 = function (song, ratioDuration, ratioThickness) {
        var time = 0;
        var curMeterCount = 0;
        var curDivision = 0;
        var curTempo = 0;
        var lastMeasureNum = -123456;
        for (var i = 0; i < song.measures.length; i++) {
            var measureDuration = meter2seconds(song.measures[i].tempo, song.measures[i].meter);
            var singlemeasuresTimelineAnchor64 = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, 128 * ratioThickness, this.measuresMeasureInfoAnchor64.showZoom, this.measuresMeasureInfoAnchor64.hideZoom);
            if (curMeterCount != song.measures[i].meter.count || curDivision != song.measures[i].meter.division || curTempo != song.measures[i].tempo) {
                curMeterCount = song.measures[i].meter.count;
                curDivision = song.measures[i].meter.division;
                curTempo = song.measures[i].tempo;
                if (i - lastMeasureNum > 2) {
                    lastMeasureNum = i;
                    singlemeasuresTimelineAnchor64.content.push({
                        x: time * ratioDuration, y: -64, css: 'barNumber textSize64',
                        text: (song.measures[i].tempo + ': ' + song.measures[i].meter.count + '/' + song.measures[i].meter.division)
                    });
                }
            }
            this.measuresMeasureInfoAnchor64.content.push(singlemeasuresTimelineAnchor64);
            time = time + measureDuration;
        }
    };
    MeasureInfoRenderer.prototype.fillMeasureInfo256 = function (song, ratioDuration, ratioThickness) {
        var time = 0;
        var curMeterCount = 0;
        var curDivision = 0;
        var curTempo = 0;
        var lastMeasureNum = -123456;
        for (var i = 0; i < song.measures.length; i++) {
            var measureDuration = meter2seconds(song.measures[i].tempo, song.measures[i].meter);
            var singlemeasuresTimelineAnchor256 = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, 128 * ratioThickness, this.measuresMeasureInfoAnchor256.showZoom, this.measuresMeasureInfoAnchor256.hideZoom);
            if (curMeterCount != song.measures[i].meter.count || curDivision != song.measures[i].meter.division || curTempo != song.measures[i].tempo) {
                curMeterCount = song.measures[i].meter.count;
                curDivision = song.measures[i].meter.division;
                curTempo = song.measures[i].tempo;
                if (i - lastMeasureNum > 8) {
                    lastMeasureNum = i;
                    singlemeasuresTimelineAnchor256.content.push({
                        x: time * ratioDuration, y: -256, css: 'barNumber textSize256',
                        text: (song.measures[i].tempo + ': ' + song.measures[i].meter.count + '/' + song.measures[i].meter.division)
                    });
                }
            }
            this.measuresMeasureInfoAnchor256.content.push(singlemeasuresTimelineAnchor256);
            time = time + measureDuration;
        }
    };
    return MeasureInfoRenderer;
}());
var PianoRollRenderer = (function () {
    function PianoRollRenderer() {
    }
    PianoRollRenderer.prototype.attach = function (zRender) {
        this.measureOtherVoicesLayerGroup = document.getElementById('measureOtherVoicesLayerGroup');
        this.measureSecondVoicesLayerGroup = document.getElementById('measureSecondVoicesLayerGroup');
        this.measureMainVoiceLayerGroup = document.getElementById('measureMainVoiceLayerGroup');
        this.initMainAnchors(zRender);
        this.initSecondAnchors(zRender);
        this.initOthersAnchors(zRender);
    };
    PianoRollRenderer.prototype.clearAnchorsContent = function (zRender, songDuration) {
        var anchors = [
            this.contentMain1, this.contentMain4, this.contentMain16, this.contentMain64, this.contentMain256,
            this.contentSecond1, this.contentSecond4, this.contentSecond16, this.contentSecond64, this.contentSecond256,
            this.contentOther1, this.contentOther4, this.contentOther16, this.contentOther64, this.contentOther256
        ];
        for (var i = 0; i < anchors.length; i++) {
            zRender.clearSingleAnchor(anchors[i], songDuration);
        }
    };
    PianoRollRenderer.prototype.initMainAnchors = function (zRender) {
        this.contentMain1 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: zRender.zoomMin, hideZoom: zRender.zoomNote, content: [] };
        this.contentMain4 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: zRender.zoomNote, hideZoom: zRender.zoomMeasure, content: [] };
        this.contentMain16 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: zRender.zoomMeasure, hideZoom: zRender.zoomSong, content: [] };
        this.contentMain64 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: zRender.zoomSong, hideZoom: zRender.zoomFar, content: [] };
        this.contentMain256 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: zRender.zoomFar, hideZoom: zRender.zoomMax + 1, content: [] };
        zRender.layers.push({
            g: this.measureMainVoiceLayerGroup, anchors: [
                this.contentMain1, this.contentMain4, this.contentMain16, this.contentMain64, this.contentMain256
            ]
        });
    };
    PianoRollRenderer.prototype.initSecondAnchors = function (zRender) {
        this.contentSecond1 = TAnchor(0, 0, 1111, 1111, zRender.zoomMin, zRender.zoomNote);
        this.contentSecond4 = TAnchor(0, 0, 1111, 1111, zRender.zoomNote, zRender.zoomMeasure);
        this.contentSecond16 = TAnchor(0, 0, 1111, 1111, zRender.zoomMeasure, zRender.zoomSong);
        this.contentSecond64 = TAnchor(0, 0, 1111, 1111, zRender.zoomSong, zRender.zoomFar);
        this.contentSecond256 = TAnchor(0, 0, 1111, 1111, zRender.zoomFar, zRender.zoomMax + 1);
        zRender.layers.push({
            g: this.measureSecondVoicesLayerGroup, anchors: [
                this.contentSecond1, this.contentSecond4, this.contentSecond16, this.contentSecond64, this.contentSecond256
            ]
        });
    };
    PianoRollRenderer.prototype.initOthersAnchors = function (zRender) {
        this.contentOther1 = TAnchor(0, 0, 1111, 1111, zRender.zoomMin, zRender.zoomNote);
        this.contentOther4 = TAnchor(0, 0, 1111, 1111, zRender.zoomNote, zRender.zoomMeasure);
        this.contentOther16 = TAnchor(0, 0, 1111, 1111, zRender.zoomMeasure, zRender.zoomSong);
        this.contentOther64 = TAnchor(0, 0, 1111, 1111, zRender.zoomSong, zRender.zoomFar);
        this.contentOther256 = TAnchor(0, 0, 1111, 1111, zRender.zoomFar, zRender.zoomMax + 1);
        zRender.layers.push({
            g: this.measureOtherVoicesLayerGroup, anchors: [
                this.contentOther1, this.contentOther4, this.contentOther16, this.contentOther64, this.contentOther256
            ]
        });
    };
    PianoRollRenderer.prototype.addParameterMeasure = function (ratioDuration, ratioThickness, song, parameter, measureNum, time, css, anchors) {
        var point = parameter.points[0];
        for (var aa = 0; aa < anchors.length; aa++) {
            var line_1 = {
                x1: 0,
                x2: 0 + 1,
                y1: 128 - point.velocity,
                y2: 128 - point.velocity + 1,
                css: css
            };
            anchors[aa].content.push(cloneLine(line_1));
        }
    };
    PianoRollRenderer.prototype.addVoiceMeasure = function (ratioDuration, ratioThickness, song, voice, measureNum, time, css, anchors) {
        var measure = voice.measureChords[measureNum];
        var measureMaxLen = anchors[0].ww;
        for (var cc = 0; cc < measure.chords.length; cc++) {
            var chord = measure.chords[cc];
            for (var ee = 0; ee < chord.envelopes.length; ee++) {
                var envelope = chord.envelopes[ee];
                var pitchWhen = meter2seconds(song.measures[measureNum].tempo, chord.when);
                for (var pp = 0; pp < envelope.pitches.length; pp++) {
                    var pitch = envelope.pitches[pp];
                    var slide = pitch.pitch;
                    if (pp + 1 < envelope.pitches.length) {
                        slide = envelope.pitches[pp + 1].pitch;
                    }
                    var pitchDuration = meter2seconds(song.measures[measureNum].tempo, pitch.duration);
                    var startShift = 0;
                    if (pp == 0) {
                        startShift = 0.5 * ratioThickness;
                    }
                    var endShift = 0;
                    if (pp == envelope.pitches.length - 1) {
                        endShift = -0.49 * ratioThickness;
                    }
                    var line_2 = {
                        x1: (time + pitchWhen) * ratioDuration + startShift,
                        x2: (time + pitchWhen + pitchDuration) * ratioDuration + endShift,
                        y1: (128 - pitch.pitch) * ratioThickness,
                        y2: (128 - slide) * ratioThickness,
                        css: css
                    };
                    for (var aa = 0; aa < anchors.length; aa++) {
                        if (line_2.x2 - anchors[aa].xx > anchors[aa].ww) {
                            anchors[aa].ww = line_2.x2 - anchors[aa].xx;
                        }
                        anchors[aa].content.push(cloneLine(line_2));
                        if (measureMaxLen < anchors[aa].ww) {
                            measureMaxLen = anchors[aa].ww;
                        }
                    }
                    pitchWhen = pitchWhen + pitchDuration;
                }
            }
        }
        return measureMaxLen;
    };
    PianoRollRenderer.prototype.drawSchedule = function (song, ratioDuration, ratioThickness) {
        var time = 0;
        song.obverseTrackFilter = (song.obverseTrackFilter) ? song.obverseTrackFilter : 0;
        for (var mm = 0; mm < song.measures.length; mm++) {
            var measureDuration = meter2seconds(song.measures[mm].tempo, song.measures[mm].meter);
            var contentMeasure1 = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, 128 * ratioThickness, this.contentMain1.showZoom, this.contentMain1.hideZoom);
            var contentMeasure4 = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, 128 * ratioThickness, this.contentMain4.showZoom, this.contentMain4.hideZoom);
            var contentMeasure16 = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, 128 * ratioThickness, this.contentMain16.showZoom, this.contentMain16.hideZoom);
            var contentMeasure64 = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, 128 * ratioThickness, this.contentMain64.showZoom, this.contentMain64.hideZoom);
            var contentMeasure256 = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, 128 * ratioThickness, this.contentMain256.showZoom, this.contentMain256.hideZoom);
            this.contentMain1.content.push(contentMeasure1);
            this.contentMain4.content.push(contentMeasure4);
            this.contentMain16.content.push(contentMeasure16);
            this.contentMain64.content.push(contentMeasure64);
            this.contentMain256.content.push(contentMeasure256);
            var secondMeasure1 = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, 128 * ratioThickness, this.contentSecond1.showZoom, this.contentSecond1.hideZoom);
            var secondMeasure4 = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, 128 * ratioThickness, this.contentSecond4.showZoom, this.contentSecond4.hideZoom);
            var secondMeasure16 = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, 128 * ratioThickness, this.contentSecond16.showZoom, this.contentSecond16.hideZoom);
            var secondMeasure64 = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, 128 * ratioThickness, this.contentSecond64.showZoom, this.contentSecond64.hideZoom);
            var secondMeasure256 = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, 128 * ratioThickness, this.contentSecond256.showZoom, this.contentSecond256.hideZoom);
            this.contentSecond1.content.push(secondMeasure1);
            this.contentSecond4.content.push(secondMeasure4);
            this.contentSecond16.content.push(secondMeasure16);
            this.contentSecond64.content.push(secondMeasure64);
            this.contentSecond256.content.push(secondMeasure256);
            var otherMeasure1 = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, 128 * ratioThickness, this.contentOther1.showZoom, this.contentOther1.hideZoom);
            var otherMeasure4 = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, 128 * ratioThickness, this.contentOther4.showZoom, this.contentOther4.hideZoom);
            var otherMeasure16 = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, 128 * ratioThickness, this.contentOther16.showZoom, this.contentOther16.hideZoom);
            var otherMeasure64 = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, 128 * ratioThickness, this.contentOther64.showZoom, this.contentOther64.hideZoom);
            var otherMeasure256 = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, 128 * ratioThickness, this.contentOther256.showZoom, this.contentOther256.hideZoom);
            this.contentOther1.content.push(otherMeasure1);
            this.contentOther4.content.push(otherMeasure4);
            this.contentOther16.content.push(otherMeasure16);
            this.contentOther64.content.push(otherMeasure64);
            this.contentOther256.content.push(otherMeasure256);
            for (var tt = 0; tt < song.tracks.length; tt++) {
                var track = song.tracks[tt];
                track.obverseVoiceFilter = (track.obverseVoiceFilter) ? track.obverseVoiceFilter : 0;
                for (var vv = 0; vv < track.voices.length; vv++) {
                    var voice = track.voices[vv];
                    voice.obversePerformerFilter = (voice.obversePerformerFilter) ? voice.obversePerformerFilter : 0;
                    for (var pp = 0; pp < voice.performer.parameters.length; pp++) {
                        var paremeter = voice.performer.parameters[pp];
                        if (song.obverseTrackFilter == tt && track.obverseVoiceFilter == vv && voice.obversePerformerFilter == 0) {
                            voice.performer.obverseParameter = (voice.performer.obverseParameter) ? voice.performer.obverseParameter : 0;
                            if (voice.performer.obverseParameter == pp) {
                                this.addParameterMeasure(ratioDuration, ratioThickness, song, paremeter, mm, time, 'mainLine', [
                                    contentMeasure1,
                                    contentMeasure4,
                                    contentMeasure16,
                                    contentMeasure64,
                                    contentMeasure256
                                ]);
                            }
                            else {
                                this.addParameterMeasure(ratioDuration, ratioThickness, song, paremeter, mm, time, 'secondLine', [
                                    secondMeasure1,
                                    secondMeasure4,
                                    secondMeasure16,
                                    secondMeasure64
                                ]);
                            }
                        }
                        else {
                            this.addParameterMeasure(ratioDuration, ratioThickness, song, paremeter, mm, time, 'otherLine', [
                                secondMeasure1,
                                secondMeasure4,
                                secondMeasure16
                            ]);
                        }
                    }
                    if (tt == song.obverseTrackFilter) {
                        if (vv == track.obverseVoiceFilter) {
                            var maxMeasureLen = this.addVoiceMeasure(ratioDuration, ratioThickness, song, voice, mm, time, 'mainLine', [
                                contentMeasure1,
                                contentMeasure4,
                                contentMeasure16,
                                contentMeasure64,
                                contentMeasure256
                            ]);
                        }
                        else {
                            this.addVoiceMeasure(ratioDuration, ratioThickness, song, voice, mm, time, 'secondLine', [
                                secondMeasure1,
                                secondMeasure4,
                                secondMeasure16,
                                secondMeasure64
                            ]);
                        }
                    }
                    else {
                        this.addVoiceMeasure(ratioDuration, ratioThickness, song, voice, mm, time, 'otherLine', [
                            secondMeasure1,
                            secondMeasure4,
                            secondMeasure16
                        ]);
                    }
                    for (var ff = 0; ff < voice.filters.length; ff++) {
                        var filter = voice.filters[ff];
                        for (var pp = 0; pp < filter.parameters.length; pp++) {
                            var paremeter = filter.parameters[pp];
                            if (song.obverseTrackFilter == tt && track.obverseVoiceFilter == vv && voice.obversePerformerFilter == ff + 1) {
                                filter.obverseParameter = (filter.obverseParameter) ? filter.obverseParameter : 0;
                                if (filter.obverseParameter == pp) {
                                    this.addParameterMeasure(ratioDuration, ratioThickness, song, paremeter, mm, time, 'mainLine', [
                                        contentMeasure1,
                                        contentMeasure4,
                                        contentMeasure16,
                                        contentMeasure64,
                                        contentMeasure256
                                    ]);
                                }
                                else {
                                    this.addParameterMeasure(ratioDuration, ratioThickness, song, paremeter, mm, time, 'secondLine', [
                                        secondMeasure1,
                                        secondMeasure4,
                                        secondMeasure16,
                                        secondMeasure64
                                    ]);
                                }
                            }
                            else {
                                this.addParameterMeasure(ratioDuration, ratioThickness, song, paremeter, mm, time, 'otherLine', [
                                    secondMeasure1,
                                    secondMeasure4,
                                    secondMeasure16
                                ]);
                            }
                        }
                    }
                }
                for (var ff = 0; ff < track.filters.length; ff++) {
                    var filter = track.filters[ff];
                    for (var pp = 0; pp < filter.parameters.length; pp++) {
                        var paremeter = filter.parameters[pp];
                        if (song.obverseTrackFilter == tt && track.obverseVoiceFilter == track.voices.length + ff) {
                            filter.obverseParameter = (filter.obverseParameter) ? filter.obverseParameter : 0;
                            if (filter.obverseParameter == pp) {
                                this.addParameterMeasure(ratioDuration, ratioThickness, song, paremeter, mm, time, 'mainLine', [
                                    contentMeasure1,
                                    contentMeasure4,
                                    contentMeasure16,
                                    contentMeasure64,
                                    contentMeasure256
                                ]);
                            }
                            else {
                                this.addParameterMeasure(ratioDuration, ratioThickness, song, paremeter, mm, time, 'secondLine', [
                                    secondMeasure1,
                                    secondMeasure4,
                                    secondMeasure16,
                                    secondMeasure64
                                ]);
                            }
                        }
                        else {
                            this.addParameterMeasure(ratioDuration, ratioThickness, song, paremeter, mm, time, 'otherLine', [
                                secondMeasure1,
                                secondMeasure4,
                                secondMeasure16
                            ]);
                        }
                    }
                }
            }
            for (var ff = 0; ff < song.filters.length; ff++) {
                var filter = song.filters[ff];
                for (var pp = 0; pp < filter.parameters.length; pp++) {
                    var paremeter = filter.parameters[pp];
                    if (song.obverseTrackFilter == song.tracks.length + ff) {
                        filter.obverseParameter = (filter.obverseParameter) ? filter.obverseParameter : 0;
                        if (filter.obverseParameter == pp) {
                            this.addParameterMeasure(ratioDuration, ratioThickness, song, paremeter, mm, time, 'mainLine', [
                                contentMeasure1,
                                contentMeasure4,
                                contentMeasure16,
                                contentMeasure64,
                                contentMeasure256
                            ]);
                        }
                        else {
                            this.addParameterMeasure(ratioDuration, ratioThickness, song, paremeter, mm, time, 'secondLine', [
                                secondMeasure1,
                                secondMeasure4,
                                secondMeasure16,
                                secondMeasure64
                            ]);
                        }
                    }
                    else {
                        this.addParameterMeasure(ratioDuration, ratioThickness, song, paremeter, mm, time, 'otherLine', [
                            secondMeasure1,
                            secondMeasure4,
                            secondMeasure16
                        ]);
                    }
                }
            }
            time = time + measureDuration;
        }
    };
    return PianoRollRenderer;
}());
var GridRenderer = (function () {
    function GridRenderer() {
    }
    GridRenderer.prototype.attach = function (zRender) {
        this.gridLayerGroup = document.getElementById('gridLayerGroup');
        this.initGridAnchors(zRender);
    };
    GridRenderer.prototype.initGridAnchors = function (zRender) {
        this.gridAnchor1 = TAnchor(0, 0, 1111, 1111, zRender.zoomMin, zRender.zoomNote);
        this.gridAnchor4 = TAnchor(0, 0, 1111, 1111, zRender.zoomNote, zRender.zoomMeasure);
        this.gridAnchor16 = TAnchor(0, 0, 1111, 1111, zRender.zoomMeasure, zRender.zoomSong);
        this.gridAnchor64 = TAnchor(0, 0, 1111, 1111, zRender.zoomSong, zRender.zoomFar);
        this.gridAnchor256 = TAnchor(0, 0, 1111, 1111, zRender.zoomFar, zRender.zoomMax + 1);
        this.gridLayer = {
            g: this.gridLayerGroup, anchors: [
                this.gridAnchor1, this.gridAnchor4, this.gridAnchor16, this.gridAnchor64, this.gridAnchor256
            ]
        };
        zRender.layers.push(this.gridLayer);
    };
    GridRenderer.prototype.clearAnchorsContent = function (zRender, songDuration) {
        var anchors = [
            this.gridAnchor1, this.gridAnchor4, this.gridAnchor16, this.gridAnchor64, this.gridAnchor256
        ];
        for (var i = 0; i < anchors.length; i++) {
            zRender.clearSingleAnchor(anchors[i], songDuration);
        }
    };
    GridRenderer.prototype.drawGrid = function (zRender, song, ratioDuration, ratioThickness, rhythmPattern) {
        this.gridAnchor1.content = [];
        this.gridAnchor4.content = [];
        this.gridAnchor16.content = [];
        this.gridAnchor64.content = [];
        this.gridAnchor256.content = [];
        var time = 0;
        song.obverseTrackFilter = (song.obverseTrackFilter) ? song.obverseTrackFilter : 0;
        for (var mm = 0; mm < song.measures.length; mm++) {
            var measureDuration = meter2seconds(song.measures[mm].tempo, song.measures[mm].meter);
            var gridMeasure1 = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, 128 * ratioThickness, zRender.pianoRollRenderer.contentMain1.showZoom, zRender.pianoRollRenderer.contentMain1.hideZoom);
            var gridMeasure4 = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, 128 * ratioThickness, zRender.pianoRollRenderer.contentMain4.showZoom, zRender.pianoRollRenderer.contentMain4.hideZoom);
            var gridMeasure16 = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, 128 * ratioThickness, zRender.pianoRollRenderer.contentMain16.showZoom, zRender.pianoRollRenderer.contentMain16.hideZoom);
            var gridMeasure64 = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, 128 * ratioThickness, zRender.pianoRollRenderer.contentMain64.showZoom, zRender.pianoRollRenderer.contentMain64.hideZoom);
            var gridMeasure256 = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, 128 * ratioThickness, zRender.pianoRollRenderer.contentMain256.showZoom, zRender.pianoRollRenderer.contentMain256.hideZoom);
            this.gridAnchor1.content.push(gridMeasure1);
            this.gridAnchor4.content.push(gridMeasure4);
            this.gridAnchor16.content.push(gridMeasure16);
            this.gridAnchor64.content.push(gridMeasure64);
            this.gridAnchor256.content.push(gridMeasure256);
            gridMeasure1.content.push({ x1: time * ratioDuration, y1: 0, x2: time * ratioDuration, y2: 128 * ratioThickness, css: 'barLine1' });
            gridMeasure4.content.push({ x1: time * ratioDuration, y1: 0, x2: time * ratioDuration, y2: 128 * ratioThickness, css: 'barLine4' });
            gridMeasure16.content.push({ x1: time * ratioDuration, y1: 0, x2: time * ratioDuration, y2: 128 * ratioThickness, css: 'barLine16' });
            gridMeasure64.content.push({ x1: time * ratioDuration, y1: 0, x2: time * ratioDuration, y2: 128 * ratioThickness, css: 'barLine64' });
            gridMeasure256.content.push({ x1: time * ratioDuration, y1: 0, x2: time * ratioDuration, y2: 128 * ratioThickness, css: 'barLine256' });
            for (var i = 1; i < 128; i = i + 12) {
                gridMeasure16.content.push({
                    x1: time * ratioDuration, y1: (128.5 - i) * ratioThickness,
                    x2: (time + measureDuration) * ratioDuration, y2: (128.5 - i) * ratioThickness, css: 'barLine16'
                });
            }
            for (var i = 1; i < 128; i = i + 1) {
                if (i % 12 == 0) {
                    gridMeasure4.content.push({
                        x1: time * ratioDuration, y1: (128.5 - i) * ratioThickness,
                        x2: (time + measureDuration) * ratioDuration, y2: (128.5 - i) * ratioThickness, css: 'barLine4'
                    });
                }
                else {
                    gridMeasure4.content.push({
                        x1: time * ratioDuration, y1: (128.5 - i) * ratioThickness,
                        x2: (time + measureDuration) * ratioDuration, y2: (128.5 - i) * ratioThickness, css: 'pitchLine4'
                    });
                }
            }
            var stepNN = 0;
            var position = rhythmPattern[stepNN];
            while (DUU(position).lessThen(song.measures[mm].meter)) {
                var positionDuration = meter2seconds(song.measures[mm].tempo, position);
                var css = 'pitchLine4';
                if (stepNN == rhythmPattern.length - 1) {
                    css = 'pitchWideLine4';
                }
                gridMeasure4.content.push({
                    x1: (time + positionDuration) * ratioDuration,
                    y1: 0,
                    x2: (time + positionDuration) * ratioDuration,
                    y2: 128 * ratioThickness,
                    css: css
                });
                stepNN++;
                if (stepNN >= rhythmPattern.length) {
                    stepNN = 0;
                }
                position = DUU(position).plus(rhythmPattern[stepNN]);
            }
            time = time + measureDuration;
        }
        zRender.tileLevel.autoID(this.gridLayer.anchors);
    };
    GridRenderer.prototype.reSetGrid = function (zrenderer, meters, currentSchedule) {
        zrenderer.tileLevel.resetAnchor(zrenderer.gridRenderer.gridAnchor1, zrenderer.gridRenderer.gridLayerGroup);
        zrenderer.tileLevel.resetAnchor(zrenderer.gridRenderer.gridAnchor4, zrenderer.gridRenderer.gridLayerGroup);
        zrenderer.tileLevel.resetAnchor(zrenderer.gridRenderer.gridAnchor16, zrenderer.gridRenderer.gridLayerGroup);
        zrenderer.tileLevel.resetAnchor(zrenderer.gridRenderer.gridAnchor64, zrenderer.gridRenderer.gridLayerGroup);
        zrenderer.tileLevel.resetAnchor(zrenderer.gridRenderer.gridAnchor256, zrenderer.gridRenderer.gridLayerGroup);
        zrenderer.gridRenderer.drawGrid(zrenderer, currentSchedule, zrenderer.ratioDuration, zrenderer.ratioThickness, meters);
        zrenderer.tileLevel.allTilesOK = false;
    };
    return GridRenderer;
}());
var TimeLineRenderer = (function () {
    function TimeLineRenderer() {
    }
    TimeLineRenderer.prototype.attach = function (zRender) {
        this.upperSelectionScale = document.getElementById('upperSelectionScale');
        this.initTimeScaleAnchors(zRender);
    };
    TimeLineRenderer.prototype.initTimeScaleAnchors = function (zRender) {
        this.measuresTimelineAnchor1 = TAnchor(0, 0, 1111, 1111, zRender.zoomMin, zRender.zoomNote);
        this.measuresTimelineAnchor4 = TAnchor(0, 0, 1111, 1111, zRender.zoomNote, zRender.zoomMeasure);
        this.measuresTimelineAnchor16 = TAnchor(0, 0, 1111, 1111, zRender.zoomMeasure, zRender.zoomSong);
        this.measuresTimelineAnchor64 = TAnchor(0, 0, 1111, 1111, zRender.zoomSong, zRender.zoomFar);
        this.measuresTimelineAnchor256 = TAnchor(0, 0, 1111, 1111, zRender.zoomFar, zRender.zoomBig + 1);
        zRender.layers.push({
            g: this.upperSelectionScale, stickTop: 0, anchors: [
                this.measuresTimelineAnchor1, this.measuresTimelineAnchor4, this.measuresTimelineAnchor16, this.measuresTimelineAnchor64, this.measuresTimelineAnchor256
            ]
        });
    };
    TimeLineRenderer.prototype.clearAnchorsContent = function (zRender, songDuration) {
        var anchors = [
            this.measuresTimelineAnchor1, this.measuresTimelineAnchor4, this.measuresTimelineAnchor16, this.measuresTimelineAnchor64, this.measuresTimelineAnchor256
        ];
        for (var i = 0; i < anchors.length; i++) {
            zRender.clearSingleAnchor(anchors[i], songDuration);
        }
    };
    TimeLineRenderer.prototype.drawSchedule = function (zRender, song, ratioDuration, ratioThickness) {
        this.drawLevel(song, ratioDuration, ratioThickness, this.measuresTimelineAnchor1, 'textSize1', 1);
        this.drawLevel(song, ratioDuration, ratioThickness, this.measuresTimelineAnchor4, 'textSize4', 4);
        this.drawLevel(song, ratioDuration, ratioThickness, this.measuresTimelineAnchor16, 'textSize16', 16);
        this.drawLevel(song, ratioDuration, ratioThickness, this.measuresTimelineAnchor64, 'textSize64', 64);
        this.drawLevel(song, ratioDuration, ratioThickness, this.measuresTimelineAnchor256, 'textSize256', 256);
    };
    TimeLineRenderer.prototype.drawLevel = function (song, ratioDuration, ratioThickness, layerAnchor, textSize, yy) {
        var time = 0;
        for (var i = 0; i < song.measures.length; i++) {
            var measureDuration = meter2seconds(song.measures[i].tempo, song.measures[i].meter);
            if (yy < 64 || (i % 8 == 0)) {
                var measureAnchor = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, 128 * ratioThickness, layerAnchor.showZoom, layerAnchor.hideZoom);
                measureAnchor.content.push(TText(time * ratioDuration, yy * 2, 'barNumber ' + textSize, ('' + (1 + i))));
                if (yy < 16) {
                    var step = { count: 1, division: 8 };
                    var part = { count: 1, division: 8 };
                    while (DUU(part).lessThen(song.measures[i].meter)) {
                        var duration = meter2seconds(song.measures[i].tempo, part);
                        var simple = DUU(part).simplify();
                        measureAnchor.content.push(TText((time + duration) * ratioDuration, yy, 'barNumber ' + textSize, ('' + simple.count + '/' + simple.division)));
                        part = DUU(part).plus(step);
                    }
                }
                layerAnchor.content.push(measureAnchor);
            }
            time = time + measureDuration;
        }
    };
    return TimeLineRenderer;
}());
var LayerSelector = (function () {
    function LayerSelector(from) {
        this.muzXBox = from;
    }
    LayerSelector.prototype.upSongFx = function (fx) {
        var _this = this;
        return function () {
            console.log('upSongFx', fx);
            _this.muzXBox.currentSchedule.obverseTrackFilter = _this.muzXBox.currentSchedule.tracks.length + fx;
            _this.muzXBox.currentSchedule.filters[fx].obverseParameter = 0;
            _this.muzXBox.zrenderer.drawSchedule(_this.muzXBox.currentSchedule);
            _this.muzXBox.zMainMenu.fillFrom(_this.muzXBox.currentSchedule);
        };
    };
    LayerSelector.prototype.upSongFxParam = function (fx, param) {
        var _this = this;
        return function () {
            console.log('upSongFxParam', fx, param);
            _this.muzXBox.currentSchedule.obverseTrackFilter = _this.muzXBox.currentSchedule.tracks.length + fx;
            _this.muzXBox.currentSchedule.filters[fx].obverseParameter = param;
            _this.muzXBox.zrenderer.drawSchedule(_this.muzXBox.currentSchedule);
            _this.muzXBox.zMainMenu.fillFrom(_this.muzXBox.currentSchedule);
        };
    };
    LayerSelector.prototype.upTrack = function (trk) {
        var _this = this;
        return function () {
            console.log('upTrack', trk);
            _this.muzXBox.currentSchedule.obverseTrackFilter = trk;
            if (_this.muzXBox.currentSchedule.tracks.length) {
                _this.muzXBox.currentSchedule.tracks[trk].obverseVoiceFilter = 0;
            }
            _this.muzXBox.zrenderer.drawSchedule(_this.muzXBox.currentSchedule);
            _this.muzXBox.zMainMenu.fillFrom(_this.muzXBox.currentSchedule);
        };
    };
    LayerSelector.prototype.upTrackFx = function (trk, fx) {
        var _this = this;
        return function () {
            console.log('upTrackFx', trk, fx);
            _this.muzXBox.currentSchedule.obverseTrackFilter = trk;
            _this.muzXBox.currentSchedule.tracks[trk].obverseVoiceFilter = _this.muzXBox.currentSchedule.tracks[trk].voices.length + fx;
            _this.muzXBox.zrenderer.drawSchedule(_this.muzXBox.currentSchedule);
            _this.muzXBox.zMainMenu.fillFrom(_this.muzXBox.currentSchedule);
        };
    };
    LayerSelector.prototype.upTrackFxParam = function (trk, fx, param) {
        var _this = this;
        return function () {
            _this.muzXBox.currentSchedule.obverseTrackFilter = trk;
            _this.muzXBox.currentSchedule.tracks[trk].obverseVoiceFilter = _this.muzXBox.currentSchedule.tracks[trk].voices.length + fx;
            _this.muzXBox.currentSchedule.tracks[trk].filters[fx].obverseParameter = param;
            _this.muzXBox.zrenderer.drawSchedule(_this.muzXBox.currentSchedule);
            _this.muzXBox.zMainMenu.fillFrom(_this.muzXBox.currentSchedule);
            console.log('upTrackFxParam', trk, fx, param);
        };
    };
    LayerSelector.prototype.upVox = function (trk, vox) {
        var _this = this;
        return function () {
            console.log('upVox', trk, vox);
            _this.muzXBox.currentSchedule.obverseTrackFilter = trk;
            _this.muzXBox.currentSchedule.tracks[trk].obverseVoiceFilter = vox;
            _this.muzXBox.zrenderer.drawSchedule(_this.muzXBox.currentSchedule);
            _this.muzXBox.zMainMenu.fillFrom(_this.muzXBox.currentSchedule);
        };
    };
    LayerSelector.prototype.upVoxFx = function (trk, vox, fx) {
        var _this = this;
        return function () {
            console.log('upVoxFx', trk, vox, fx);
            _this.muzXBox.currentSchedule.obverseTrackFilter = trk;
            _this.muzXBox.currentSchedule.tracks[trk].obverseVoiceFilter = vox;
            _this.muzXBox.currentSchedule.tracks[trk].voices[vox].obversePerformerFilter = fx + 1;
            _this.muzXBox.zrenderer.drawSchedule(_this.muzXBox.currentSchedule);
            _this.muzXBox.zMainMenu.fillFrom(_this.muzXBox.currentSchedule);
        };
    };
    LayerSelector.prototype.upVoxFxParam = function (trk, vox, fx, param) {
        var _this = this;
        return function () {
            console.log('upVoxFxParam', trk, vox, fx, param);
            _this.muzXBox.currentSchedule.obverseTrackFilter = trk;
            _this.muzXBox.currentSchedule.tracks[trk].obverseVoiceFilter = vox;
            _this.muzXBox.currentSchedule.tracks[trk].voices[vox].obversePerformerFilter = fx + 1;
            _this.muzXBox.currentSchedule.tracks[trk].voices[vox].filters[fx].obverseParameter = fx;
            _this.muzXBox.zrenderer.drawSchedule(_this.muzXBox.currentSchedule);
            _this.muzXBox.zMainMenu.fillFrom(_this.muzXBox.currentSchedule);
        };
    };
    LayerSelector.prototype.upVoxProvider = function (trk, vox) {
        var _this = this;
        return function () {
            console.log('upVoxProvider', trk, vox);
            _this.muzXBox.currentSchedule.obverseTrackFilter = trk;
            _this.muzXBox.currentSchedule.tracks[trk].obverseVoiceFilter = vox;
            _this.muzXBox.currentSchedule.tracks[trk].voices[vox].obversePerformerFilter = 0;
            _this.muzXBox.zrenderer.drawSchedule(_this.muzXBox.currentSchedule);
            _this.muzXBox.zMainMenu.fillFrom(_this.muzXBox.currentSchedule);
        };
    };
    LayerSelector.prototype.upVoxProviderParam = function (trk, vox, param) {
        var _this = this;
        return function () {
            console.log('upVoxProviderParam', trk, vox, param);
            _this.muzXBox.currentSchedule.obverseTrackFilter = trk;
            _this.muzXBox.currentSchedule.tracks[trk].obverseVoiceFilter = vox;
            _this.muzXBox.currentSchedule.tracks[trk].voices[vox].obversePerformerFilter = 0;
            _this.muzXBox.currentSchedule.tracks[trk].voices[vox].performer.obverseParameter = 0;
            _this.muzXBox.zrenderer.drawSchedule(_this.muzXBox.currentSchedule);
            _this.muzXBox.zMainMenu.fillFrom(_this.muzXBox.currentSchedule);
        };
    };
    return LayerSelector;
}());
var FocusManagement = (function () {
    function FocusManagement() {
    }
    FocusManagement.prototype.attach = function (zRender) {
        this.focusMarkerLayer = document.getElementById('focusMarkerLayer');
        this.focusAnchor1 = TAnchor(0, 0, 1111, 1111, zRender.zoomMin, zRender.zoomNote);
        this.focusAnchor4 = TAnchor(0, 0, 1111, 1111, zRender.zoomNote, zRender.zoomMeasure);
        this.focusAnchor16 = TAnchor(0, 0, 1111, 1111, zRender.zoomMeasure, zRender.zoomSong);
        this.focusAnchor64 = TAnchor(0, 0, 1111, 1111, zRender.zoomSong, zRender.zoomFar);
        this.focusAnchor256 = TAnchor(0, 0, 1111, 1111, zRender.zoomFar, zRender.zoomMax + 1);
    };
    return FocusManagement;
}());
//# sourceMappingURL=muzxbox.js.map