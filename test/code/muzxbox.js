"use strict";
console.log('MuzXBox v1.01');
var firstAnchor;
var menuAnchor;
var tileLevel;
var MuzXBox = (function () {
    function MuzXBox() {
        console.log('start');
    }
    MuzXBox.prototype.initAll = function () {
        console.log('initAll');
        var me = this;
        this.zInputDeviceHandler = new ZInputDeviceHandler();
        this.createUI();
    };
    MuzXBox.prototype.createUI = function () {
        var _this = this;
        var layers = [];
        var backgroundLayerGroup = document.getElementById('backgroundLayerGroup');
        var minZoom = 1;
        var maxZoom = 100;
        firstAnchor = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: minZoom, hideZoom: maxZoom + 1, content: [] };
        menuAnchor = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: minZoom, hideZoom: maxZoom + 1, content: [] };
        layers.push({ g: backgroundLayerGroup, anchors: [firstAnchor] });
        layers.push({ g: backgroundLayerGroup, anchors: [menuAnchor] });
        tileLevel = new TileLevel(document.getElementById('contentSVG'), 1000, 1000, minZoom, minZoom, maxZoom, layers);
        var txt = { x: 1, y: 8, css: 'fontSize8' + ' fillColorContent', text: 'Text label' };
        firstAnchor.content.push(txt);
        var backRectangle = {
            x: 0,
            y: 0,
            w: 1000,
            h: 1000,
            rx: 11,
            ry: 11,
            css: 'debug'
        };
        firstAnchor.content.push(backRectangle);
        var menuButton = {
            x: 0,
            y: 0,
            w: 10,
            h: 10,
            rx: 3,
            ry: 3,
            css: 'debug',
            action: this.openMenu
        };
        firstAnchor.content.push(menuButton);
        menuAnchor.content.push({ x: 9, y: 10, w: 16, h: 11, rx: 1, ry: 1, css: 'debug', action: function (x, y) { console.log(x, y); }, dragY: true });
        menuAnchor.content.push({ x: 10, y: 11, w: 4, h: 4, rx: 1, ry: 1, css: 'debug', action: function () { _this.testChooser(10, 11); } });
        menuAnchor.content.push({ x: 10, y: 16, w: 4, h: 4, rx: 1, ry: 1, css: 'debug', action: function () { _this.testChooser(10, 16); } });
        menuAnchor.content.push({ x: 15, y: 11, w: 4, h: 4, rx: 1, ry: 1, css: 'debug', action: function () { _this.testChooser(15, 11); } });
        menuAnchor.content.push({ x: 15, y: 16, w: 4, h: 4, rx: 1, ry: 1, css: 'debug', action: function () { _this.testChooser(15, 16); } });
        menuAnchor.content.push({ x: 20, y: 11, w: 4, h: 4, rx: 1, ry: 1, css: 'debug', action: function () { _this.testChooser(20, 11); } });
        menuAnchor.content.push({ x: 20, y: 16, w: 4, h: 4, rx: 1, ry: 1, css: 'debug', action: function () { _this.testChooser(20, 16); } });
    };
    MuzXBox.prototype.testChooser = function (xx, yy) {
        console.log('testChooser', xx, yy);
    };
    MuzXBox.prototype.openMenu = function () {
        document.getElementById('menuContentDiv').style.visibility = 'visible';
        document.getElementById('menuDiv1').style.width = '100%';
    };
    MuzXBox.prototype.closeMenu = function () {
        document.getElementById('menuDiv1').style.width = '0%';
    };
    return MuzXBox;
}());
window['MuzXBox'] = new MuzXBox();
console.log('MuzXBox v1.01');
var ZInputDeviceHandler = (function () {
    function ZInputDeviceHandler() {
        var me = this;
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
        console.log('KeyX');
    };
    ZInputDeviceHandler.prototype.processKeyY = function () {
        console.log('KeyY');
    };
    ZInputDeviceHandler.prototype.processKeyA = function () {
        console.log('KeyA');
    };
    ZInputDeviceHandler.prototype.processKeyB = function () {
        console.log('KeyB');
    };
    ZInputDeviceHandler.prototype.processAnyPlus = function () {
        console.log('+');
    };
    ZInputDeviceHandler.prototype.processAnyMinus = function () {
        console.log('-');
    };
    ZInputDeviceHandler.prototype.processArrowLeft = function () {
        console.log('left');
    };
    ZInputDeviceHandler.prototype.processArrowRight = function () {
        console.log('right');
    };
    ZInputDeviceHandler.prototype.processArrowUp = function () {
        console.log('up');
    };
    ZInputDeviceHandler.prototype.processArrowDown = function () {
        console.log('down');
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
        this.allTilesOK = false;
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
    TileLevel.prototype.anchor = function (xx, yy, ww, hh, showZoom, hideZoom) {
        return { xx: xx, yy: yy, ww: ww, hh: hh, showZoom: showZoom, hideZoom: hideZoom, content: [] };
    };
    TileLevel.prototype.rectangle = function (x, y, w, h, rx, ry, css) {
        return { x: x, y: y, w: w, h: h, rx: rx, ry: ry, css: css };
    };
    TileLevel.prototype.actionRectangle = function (action, x, y, w, h, rx, ry, css) {
        return { x: x, y: y, w: w, h: h, rx: rx, ry: ry, css: css, action: action };
    };
    TileLevel.prototype.line = function (x1, y1, x2, y2, css) {
        return { x1: x1, y1: y1, x2: x2, y2: y2, css: css };
    };
    TileLevel.prototype.text = function (x, y, text, css) {
        return { x: x, y: y, text: text, css: css };
    };
    TileLevel.prototype.pathImage = function (x, y, scale, points, css) {
        return { x: x, y: y, scale: scale, points: points, css: css };
    };
    TileLevel.prototype.isLayerStickTop = function (t) {
        return t.stickTop !== undefined;
    };
    TileLevel.prototype.isLayerStickBottom = function (t) {
        return t.stickBottom !== undefined;
    };
    TileLevel.prototype.isLayerStickRight = function (t) {
        return t.stickRight !== undefined;
    };
    TileLevel.prototype.isLayerOverlay = function (t) {
        return t.overlay !== undefined;
    };
    TileLevel.prototype.isTilePath = function (t) {
        return t.points !== undefined;
    };
    TileLevel.prototype.isTileText = function (t) {
        return t.text !== undefined;
    };
    TileLevel.prototype.isTileLine = function (t) {
        return t.x1 !== undefined;
    };
    TileLevel.prototype.isTilePolygon = function (t) {
        return t.dots !== undefined;
    };
    TileLevel.prototype.isLayerStickLeft = function (t) {
        return t.stickLeft !== undefined;
    };
    TileLevel.prototype.isTileRectangle = function (t) {
        return t.h !== undefined;
    };
    TileLevel.prototype.isTileGroup = function (t) {
        return t.content !== undefined;
    };
    TileLevel.prototype.isLayerNormal = function (t) {
        return t.stickLeft === undefined
            && t.stickTop === undefined
            && t.stickBottom === undefined
            && t.stickRight === undefined
            && t.overlay === undefined;
    };
    TileLevel.prototype.rid = function () {
        return 'id' + Math.floor(Math.random() * 1000000000);
    };
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
                if (this.isLayerOverlay(layer)) {
                    tz = this.translateZ;
                    tx = -this.translateX;
                    ty = -this.translateY;
                    cX = 0;
                    cY = 0;
                }
                else {
                    if (this.isLayerStickLeft(layer)) {
                        tx = -this.translateX;
                        cX = 0;
                        if (layer.stickLeft) {
                            sX = layer.stickLeft * this.tapSize * this.translateZ;
                        }
                    }
                    else {
                        if (this.isLayerStickTop(layer)) {
                            ty = -this.translateY;
                            cY = 0;
                            if (layer.stickTop) {
                                sY = layer.stickTop * this.tapSize * this.translateZ;
                            }
                        }
                        else {
                            if (this.isLayerStickBottom(layer)) {
                                ty = -this.translateY;
                                cY = 0;
                                sY = this.viewHeight * this.translateZ;
                                if (layer.stickBottom) {
                                    sY = this.viewHeight * this.translateZ - layer.stickBottom * this.tapSize;
                                }
                            }
                            else {
                                if (this.isLayerStickRight(layer)) {
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
        if (this.isLayerOverlay(layer)) {
            x = 0;
            y = 0;
        }
        else {
            if (this.isLayerStickLeft(layer)) {
                x = 0;
            }
            else {
                if (this.isLayerStickTop(layer)) {
                    y = 0;
                }
                else {
                    if (this.isLayerStickRight(layer)) {
                        x = 0;
                    }
                    else {
                        if (this.isLayerStickBottom(layer)) {
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
        if (this.isLayerOverlay(layer)) {
            x = 0;
            y = 0;
        }
        else {
            if (this.isLayerStickLeft(layer)) {
                x = 0;
            }
            else {
                if (this.isLayerStickTop(layer)) {
                    y = 0;
                }
                else {
                    if (this.isLayerStickRight(layer)) {
                        x = 0;
                    }
                    else {
                        if (this.isLayerStickBottom(layer)) {
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
                        if (this.isTileGroup(d)) {
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
        if (this.isTileRectangle(dd)) {
            element = this.tileRectangle(g, dd.x * this.tapSize, dd.y * this.tapSize, dd.w * this.tapSize, dd.h * this.tapSize, (dd.rx ? dd.rx : 0) * this.tapSize, (dd.ry ? dd.ry : 0) * this.tapSize, (dd.css ? dd.css : ''));
        }
        if (this.isTileText(dd)) {
            element = this.tileText(g, dd.x * this.tapSize, dd.y * this.tapSize, dd.text, dd.css ? dd.css : '');
        }
        if (this.isTilePath(dd)) {
            element = this.tilePath(g, (dd.x ? dd.x : 0) * this.tapSize, (dd.y ? dd.y : 0) * this.tapSize, (dd.scale ? dd.scale : 0), dd.points, dd.css ? dd.css : '');
        }
        if (this.isTilePolygon(dd)) {
            element = this.tilePolygon(g, (dd.x ? dd.x : 0) * this.tapSize, (dd.y ? dd.y : 0) * this.tapSize, dd.scale, dd.dots, dd.css);
        }
        if (this.isTileLine(dd)) {
            element = this.tileLine(g, dd.x1 * this.tapSize, dd.y1 * this.tapSize, dd.x2 * this.tapSize, dd.y2 * this.tapSize, dd.css);
        }
        if (this.isTileGroup(dd)) {
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
    TileLevel.prototype.tilePolygon = function (g, x, y, z, dots, cssClass) {
        var polygon = document.createElementNS(this.svgns, 'polygon');
        var points = '';
        var dlmtr = '';
        for (var i = 0; i < dots.length; i = i + 2) {
            points = points + dlmtr + dots[i] * this.tapSize + ',' + dots[i + 1] * this.tapSize;
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
    };
    TileLevel.prototype.tilePath = function (g, x, y, z, data, cssClass) {
        var path = document.createElementNS(this.svgns, 'path');
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
    };
    TileLevel.prototype.tileRectangle = function (g, x, y, w, h, rx, ry, cssClass) {
        var rect = document.createElementNS(this.svgns, 'rect');
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
    };
    TileLevel.prototype.tileLine = function (g, x1, y1, x2, y2, cssClass) {
        var line = document.createElementNS(this.svgns, 'line');
        line.setAttributeNS(null, 'x1', '' + x1);
        line.setAttributeNS(null, 'y1', '' + y1);
        line.setAttributeNS(null, 'x2', '' + x2);
        line.setAttributeNS(null, 'y2', '' + y2);
        if (cssClass) {
            line.classList.add(cssClass);
        }
        g.appendChild(line);
        return line;
    };
    TileLevel.prototype.tileText = function (g, x, y, html, cssClass) {
        var txt = document.createElementNS(this.svgns, 'text');
        txt.setAttributeNS(null, 'x', '' + x);
        txt.setAttributeNS(null, 'y', '' + y);
        if (cssClass) {
            txt.setAttributeNS(null, 'class', cssClass);
        }
        txt.innerHTML = html;
        g.appendChild(txt);
        return txt;
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
                        definition[i].id = this.rid();
                    }
                    if (this.isTileGroup(definition[i])) {
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
    TileLevel.prototype.resetAnchor = function (anchor, svgGroup) {
        var gid = anchor.id ? anchor.id : '';
        var xg = this.childExists(svgGroup, gid);
        if (xg) {
            svgGroup.removeChild(xg);
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
        }.bind(this), ms);
        startId = this.currentID;
    };
    return CannyDo;
}());
//# sourceMappingURL=muzxbox.js.map