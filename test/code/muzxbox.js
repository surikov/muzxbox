"use strict";
console.log('MuzXBox v1.01');
var firstAnchor;
var menuAnchor;
var tileLevel;
var testProject;
var sizeRatio = 2;
var MuzXBox = (function () {
    function MuzXBox() {
        console.log('start');
    }
    MuzXBox.prototype.initAll = function () {
        console.log('initAll');
        var me = this;
        this.zInputDeviceHandler = new ZInputDeviceHandler();
        this.muzLoader = new MuzLoader();
        this.createUI();
    };
    MuzXBox.prototype.createUI = function () {
        var _this = this;
        var layers = [];
        var backgroundLayerGroup = document.getElementById('backgroundLayerGroup');
        var minZoom = 1;
        var maxZoom = 100;
        testProject = this.muzLoader.createTestProject();
        console.log(testProject);
        firstAnchor = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: minZoom, hideZoom: maxZoom + 1, content: [] };
        menuAnchor = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: minZoom, hideZoom: maxZoom + 1, content: [] };
        layers.push({ g: backgroundLayerGroup, anchors: [firstAnchor] });
        layers.push({ g: backgroundLayerGroup, anchors: [menuAnchor] });
        tileLevel = new TileLevel(document.getElementById('contentSVG'), 1000, 1000, minZoom, minZoom, maxZoom, layers);
        for (var tt = 0; tt < testProject.tracks.length; tt++) {
            var track = testProject.tracks[tt];
            var curPoint = { count: 0, division: 4 };
            console.log(tt, track);
            for (var pp = 0; pp < track.patterns.length; pp++) {
                var pattern = track.patterns[pp];
                curPoint = DUU(curPoint).plus(pattern.skip);
                var time = duration2seconds(testProject.tempo, duration384(curPoint));
                var sz = duration2seconds(testProject.tempo, duration384(pattern.duration));
                console.log(curPoint, time, sz, duration384(curPoint), curPoint.count, curPoint.division);
                firstAnchor.content.push({ x: 2 * time, y: tt, w: 2 * sz, h: 1, rx: 0.1, ry: 0.1, css: 'debug', action: function () { _this.testChooser(20, 16); } });
                curPoint = DUU(curPoint).plus(pattern.duration);
            }
        }
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
var MuzLoader = (function () {
    function MuzLoader() {
    }
    MuzLoader.prototype.createTestProject = function () {
        var p = {
            tracks: [
                {
                    patterns: [
                        { pattern: 0, skip: { count: 0, division: 4 }, duration: { count: 1, division: 4 } },
                        { pattern: 1, skip: { count: 6, division: 4 }, duration: { count: 1, division: 4 } },
                        { pattern: 0, skip: { count: 0, division: 4 }, duration: { count: 1, division: 4 } },
                        { pattern: 2, skip: { count: 6, division: 4 }, duration: { count: 1, division: 4 } }
                    ]
                }, {
                    patterns: [
                        { pattern: 3, skip: { count: 0, division: 4 }, duration: { count: 4, division: 4 } }
                    ]
                }, {
                    patterns: [
                        { pattern: 4, skip: { count: 1, division: 4 }, duration: { count: 1, division: 4 } }
                    ]
                }, {
                    patterns: [
                        { pattern: 15, skip: { count: 4, division: 4 }, duration: { count: 2, division: 4 } },
                        { pattern: 10, skip: { count: 6, division: 4 }, duration: { count: 2, division: 4 } }
                    ]
                }
            ],
            title: 'test123',
            tempo: 100,
            duration: { count: 16, division: 4 }
        };
        return p;
    };
    return MuzLoader;
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
        enumerable: true,
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
        enumerable: true,
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
        enumerable: true,
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
var ZvoogFilterSourceEmpty = (function () {
    function ZvoogFilterSourceEmpty() {
        this.lockedState = new ZvoogPluginLock();
    }
    ZvoogFilterSourceEmpty.prototype.setData = function (data) {
    };
    ZvoogFilterSourceEmpty.prototype.state = function () {
        return this.lockedState;
    };
    ZvoogFilterSourceEmpty.prototype.prepare = function (audioContext) {
        if (this.base) {
        }
        else {
            this.base = audioContext.createGain();
        }
        this.params = [];
    };
    ZvoogFilterSourceEmpty.prototype.getOutput = function () {
        return this.base;
    };
    ZvoogFilterSourceEmpty.prototype.getParams = function () {
        return this.params;
    };
    ZvoogFilterSourceEmpty.prototype.busy = function () {
        return 0;
    };
    ZvoogFilterSourceEmpty.prototype.cancelSchedule = function () {
    };
    ZvoogFilterSourceEmpty.prototype.addSchedule = function (when, tempo, chord, variation) {
    };
    ZvoogFilterSourceEmpty.prototype.getInput = function () {
        return this.base;
    };
    return ZvoogFilterSourceEmpty;
}());
var cachedFilterSourceEmptyPlugins = [];
function takeZvoogFilterSourceEmpty() {
    for (var i = 0; i < cachedFilterSourceEmptyPlugins.length; i++) {
        if (!cachedFilterSourceEmptyPlugins[i].state().locked()) {
            cachedFilterSourceEmptyPlugins[i].state().lock();
            return cachedFilterSourceEmptyPlugins[i];
        }
    }
    var plugin = new ZvoogFilterSourceEmpty();
    plugin.state().lock();
    cachedFilterSourceEmptyPlugins.push(plugin);
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
    return takeZvoogFilterSourceEmpty();
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
    return takeZvoogFilterSourceEmpty();
}
function duration2seconds(bpm, duration384) {
    var n4 = 60 / bpm;
    var part = 384 / (4 * duration384);
    return n4 / part;
}
function durations2time(measures) {
    var t = 0;
    for (var i = 0; i < measures.length; i++) {
        t = t + duration2seconds(measures[i].tempo, duration384(measures[i].meter));
    }
    return t;
}
function seconds2Duration384(time, bpm) {
    var n4 = 60 / bpm;
    var n384 = n4 / 96;
    return Math.round(time / n384);
}
function duration384(meter) {
    return meter.count * (384 / meter.division);
}
function calculateEnvelopeDuration(envelope) {
    var d = { count: 0, division: 1 };
    for (var i = 0; i < envelope.pitches.length; i++) {
        d = DUU(d).plus(envelope.pitches[i].duration);
    }
    return d;
}
function scheduleDuration(measures) {
    var duration = { count: 0, division: 1 };
    for (var i = 0; i < measures.length; i++) {
        duration = DUU(duration).plus(measures[i].meter);
    }
    return duration;
}
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
        while (r.division % 2 == 0 && r.count % 2 == 0) {
            r.division = r.division / 2;
            r.count = r.count / 2;
        }
        return r;
    };
    return DurationUnitUtil;
}());
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
        var seconds = duration2seconds(tempo, duration384(line.pitches[0].duration));
        oscillator.frequency.setValueAtTime(this.freq(line.pitches[0].pitch), when);
        var nextPointSeconds = when + seconds;
        for (var i = 1; i < line.pitches.length; i++) {
            var seconds_1 = duration2seconds(tempo, duration384(line.pitches[i].duration));
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
        var duration = duration2seconds(tempo, duration384(envelope.pitches[0].duration));
        var slides = [];
        var tt = 0;
        for (var n = 1; n < envelope.pitches.length; n++) {
            tt = tt + duration2seconds(tempo, duration384(envelope.pitches[n - 1].duration));
            slides.push({
                pitch: envelope.pitches[n].pitch,
                when: tt
            });
            duration = duration + duration2seconds(tempo, duration384(envelope.pitches[n].duration));
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
            var duration = duration2seconds(tempo, duration384(envelope.pitches[0].duration));
            var t = 0;
            for (var n = 1; n < envelope.pitches.length; n++) {
                t = t + duration2seconds(tempo, duration384(envelope.pitches[n - 1].duration));
                slides.push({
                    pitch: envelope.pitches[n].pitch,
                    when: t
                });
                duration = duration + duration2seconds(tempo, duration384(envelope.pitches[n].duration));
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
        var seconds = duration2seconds(tempo, duration384(line.pitches[0].duration));
        var nextPointSeconds = when + seconds;
        for (var i = 1; i < line.pitches.length; i++) {
            var seconds_2 = duration2seconds(tempo, duration384(line.pitches[i].duration));
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
    return AudioFileSource;
}());
//# sourceMappingURL=muzxbox.js.map