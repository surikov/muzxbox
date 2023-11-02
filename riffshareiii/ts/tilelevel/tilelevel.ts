console.log('tilelevel v2.20.001');
function createTileLevel(): TileLevelBase {
    return new TileLevelRealTime();
}
class TileLevelRealTime implements TileLevelBase {
    svg: SVGElement;
    tapSize: number = 50;
    twoZoom: boolean = false;
    clickLimit: number = this.tapSize / 6;
    svgns: string = "http://www.w3.org/2000/svg";
    stickLeft: boolean;
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
    waitViewClickAction: boolean = false;
    mx: number = 100;
    mn: number = 1;
    startedTouch: boolean = false;
    twodistance: number = 0;
    twocenter: TilePoint;
    model: TileLayerDefinition[] = [];
    slidingLockTo: number = 0;
    slidingID: number = 0;
    onResizeDo: CannyDo = new CannyDo();
    onZoom: CannyDo = new CannyDo();
    onResetAnchorDo: LazyDo = new LazyDo();
    afterZoomCallback: () => void;
    afterResizeCallback: () => void;

    lastTickTime: number = 0;

    fastenUp: boolean = true;
    fastenDown: boolean = true;
    fastenLeft: boolean = true;
    fastenRight: boolean = true;

    lastMoveDx: number = 0;
    lastMoveDy: number = 0;
    //lastMoveDt: number = 0;

    mouseDownMode: boolean = false;
	/*ModeDragNone: 0 = 0;
	ModeDragView: 1 = 1;
	ModeDragElement: 2 = 2;
	interMode: 0 | 1 | 2 = this.ModeDragNone;
*/
    //dragMode:boolean =false;

    //currentDragTileItem: TileItem | null;
    currentDragItem: null | TileItem = null;

    interactor: TileInteraction = new TileInteraction(this);

    get allTilesOK(): boolean {
        return this._allTilesOK;
    }
    set allTilesOK(bb: boolean) {
        if (bb != this._allTilesOK) {
            this._allTilesOK = bb;
        }
    }

    get translateZ(): number {
        return this._translateZ;
    }
    set translateZ(z: number) {
        if (z != this._translateZ) {
            this._translateZ = z;
        }

    }
    get translateX(): number {
        return this._translateX;
    }
    set translateX(x: number) {
        if (x != this._translateX) {
            this._translateX = x;
        }

    }
    get translateY(): number {
        return this._translateY;
    }
    set translateY(y: number) {
        if (y != this._translateY) {
            this._translateY = y;
        }

    }
    getStartMouseScreen(): TilePoint {
        return {
            x: this.startMouseScreenX, y: this.startMouseScreenY
        };
    }

    getCurrentPointPosition(): TileZoom {
        return {
            x: this.translateX, y: this.translateY, z: this.translateZ
        };
    }
    screen2view(screen: TilePoint): TilePoint {
        let xx = (screen.x * this.translateZ - this.translateX) / this.tapSize;
        let yy = (screen.y * this.translateZ - this.translateY) / this.tapSize;
        if (this.viewWidth * this.translateZ > this.innerWidth) {
            if (this.stickLeft) {
                //
            } else {
                xx = xx + 0.5 * (this.innerWidth - this.viewWidth * this.translateZ) / this.tapSize
            }
        }
        //console.log('check y', this.viewHeight, this.translateZ, this.viewHeight * this.translateZ, this.innerHeight);
        if (this.viewHeight * this.translateZ > this.innerHeight) {
            //console.log('shift y', yy );
            yy = yy + 0.5 * (this.innerHeight - this.viewHeight * this.translateZ) / this.tapSize
        }
        let rr = { x: xx, y: yy };
        //console.log('screen2view', screen, rr);
        return rr;
    }
    resetInnerSize(inWidth: number, inHeight: number) {
        this.innerWidth = inWidth * this.tapSize;
        this.innerHeight = inHeight * this.tapSize;
    }

    initRun(svgObject: SVGElement
        , stickLeft: boolean
        , inWidth: number, inHeight: number
        , minZoom: number, curZoom: number, maxZoom: number
        , layers: TileLayerDefinition[]) {
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
        this.svg.addEventListener("wheel", this.interactor.rakeMouseWheel.bind(this.interactor), { capture: false, passive: false });
        this.svg.addEventListener("touchstart", this.interactor.rakeTouchStart.bind(this.interactor), { capture: true, passive: false });
        this.svg.addEventListener("touchmove", this.interactor.rakeTouchMove.bind(this.interactor), { capture: true, passive: false });
        this.svg.addEventListener("touchend", this.interactor.rakeTouchEnd.bind(this.interactor), { capture: true, passive: false });
        this.svg.addEventListener('mousedown', this.interactor.rakeMouseDown.bind(this.interactor), { capture: false, passive: false });
        this.svg.addEventListener('mousemove', this.interactor.rakeMouseMove.bind(this.interactor), { capture: false, passive: false });
        this.svg.addEventListener('mouseup', this.interactor.rakeMouseUp.bind(this.interactor), { capture: false, passive: false });
        window.addEventListener('resize', this.onAfterResize.bind(this));
        this.setModel(layers);
        this.startLoop();
        this.applyZoomPosition();
        this.clearUselessDetails();
    }
    dump() {
        console.log('dump', this);
    }
    tapPxSize(): number {
        return this.tapSize;
    }
    setupTapSize(baseSize: number) {
        let rect: Element = document.createElementNS(this.svgns, 'rect');
        rect.setAttributeNS(null, 'height', '' + baseSize + 'cm');
        rect.setAttributeNS(null, 'width', '' + baseSize + 'cm');
        this.svg.appendChild(rect);
        let tbb: DOMRect = (rect as SVGSVGElement).getBBox();
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
    onMove(dx: number, dy: number) {
        //console.log('onMove',dx,dy);
        this.lastMoveDx = dx;
        this.lastMoveDy = dy;
        //this.lastMoveDt = Date.now();
    }
	/*moveTail(speed: number) {
		var dx = this.translateX + 2 * this.tapSize * speed * this.lastMoveDx;
		var dy = this.translateY + 2 * this.tapSize * speed * this.lastMoveDy;
		this.startSlideTo(dx, dy, this.translateZ, function () {
		}.bind(this));
	}*/

    applyZoomPosition() {
        let rx: number = -this.translateX - this.dragZoom * this.translateZ * (this.viewWidth - this.viewWidth / this.dragZoom) * (this.clickX / this.viewWidth);
        let ry: number = -this.translateY - this.dragZoom * this.translateZ * (this.viewHeight - this.viewHeight / this.dragZoom) * (this.clickY / this.viewHeight);
        let rw: number = this.viewWidth * this.translateZ * this.dragZoom;
        let rh: number = this.viewHeight * this.translateZ * this.dragZoom;
        this.svg.setAttribute('viewBox', rx + ' ' + ry + ' ' + rw + ' ' + rh);
        if (this.model) {
            for (let k: number = 0; k < this.model.length; k++) {
                let layer: TileLayerDefinition = this.model[k];
                let tx: number = 0;
                let ty: number = 0;
                let tz: number = 1;
                let cX: number = 0;
                let cY: number = 0;
                let sX: number = 0;
                let sY: number = 0;
                if (this.viewWidth * this.translateZ > this.innerWidth) {
                    if (this.stickLeft) {
                        //
                    } else {
                        cX = (this.viewWidth * this.translateZ - this.innerWidth) / 2;
                    }
                }
                if (this.viewHeight * this.translateZ > this.innerHeight) {
                    cY = (this.viewHeight * this.translateZ - this.innerHeight) / 2;
                }
                //if (isLayerOverlay(layer)) {
                if (layer.mode == LevelModes.overlay) {
                    tz = this.translateZ;
                    tx = -this.translateX;
                    ty = -this.translateY;
                    cX = 0;
                    cY = 0;
                } else {
                    //if (isLayerStickLeft(layer)) {
                    if (layer.mode == LevelModes.left) {
                        tx = -this.translateX;
                        cX = 0;
                        if (layer.stickLeft) {
                            sX = layer.stickLeft * this.tapSize * this.translateZ;
                        }
                    } else {
                        //if (isLayerStickTop(layer)) {
                        if (layer.mode == LevelModes.top) {
                            ty = -this.translateY;
                            cY = 0;
                            if (layer.stickTop) {
                                sY = layer.stickTop * this.tapSize * this.translateZ;
                            }
                        } else {
                            //if (isLayerStickBottom(layer)) {
                            if (layer.mode == LevelModes.bottom) {
                                ty = -this.translateY;
                                cY = 0;
                                sY = this.viewHeight * this.translateZ;
                                if (layer.stickBottom) {
                                    sY = this.viewHeight * this.translateZ - layer.stickBottom * this.tapSize;
                                }
                            } else {
                                //if (isLayerStickRight(layer)) {
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
                } else {
                    vY = 0;
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
        return {
            x: vX,
            y: vY,
            z: vZ
        };
    }
    startTouchZoom(touchEvent: TouchEvent) {
        this.twoZoom = true;
        let p1: TilePoint = vectorFromTouch(touchEvent.touches[0]);
        let p2: TilePoint = vectorFromTouch(touchEvent.touches[1]);
        this.twocenter = vectorFindCenter(p1, p2);
        let d: number = vectorDistance(p1, p2);
        if (d <= 0) {
            d = 1;
        }
        this.twodistance = d;
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
        let xyz: TileZoom[] = [];
        for (let i: number = 0; i < stepCount; i++) {
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
    stepSlideTo(key: number, xyz: TileZoom[], action: (() => void) | null) {
        let n: TileZoom | undefined = xyz.shift();
        if (n) {
            if (key == this.slidingLockTo) {
                this.translateX = n.x;
                this.translateY = n.y;
                this.translateZ = n.z;
                this.applyZoomPosition();
                let main: TileLevelRealTime = this;
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
        }
    }

    queueTiles() {
        this.clearUselessDetails();
        this.tileFromModel();
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
            if (this.stickLeft) {
                //
            } else {
                cX = (this.viewWidth * this.translateZ - this.innerWidth) / 2;
                x = x - cX;
            }
        }
        if (this.viewHeight * this.translateZ > this.innerHeight) {
            cY = (this.viewHeight * this.translateZ - this.innerHeight) / 2;
            y = y - cY;
        }
        //if (isLayerOverlay(layer)) {
        if (layer.mode == LevelModes.overlay) {
            x = 0;
            y = 0;
            //w = this.viewHeight;
            //h = this.viewHeight;
        } else {
            //if (isLayerStickLeft(layer)) {
            if (layer.mode == LevelModes.left) {
                x = 0;
            } else {
                //if (isLayerStickTop(layer)) {
                if (layer.mode == LevelModes.top) {
                    y = 0;
                } else {
                    //if (isLayerStickRight(layer)) {
                    if (layer.mode == LevelModes.right) {
                        x = 0;
                    } else {
                        //if (isLayerStickBottom(layer)) {
                        if (layer.mode == LevelModes.bottom) {
                            y = 0;
                        }
                    }
                }
            }
        }
        if (group) this.msEdgeHook(group);
        for (let i: number = 0; i < group.children.length; i++) {
            let child: TileSVGElement = group.children[i] as TileSVGElement;
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
        if (this.model) {
            //console.log('tileFromModel');
            for (let k = 0; k < this.model.length; k++) {
                let svggroup: SVGElement = this.model[k].g;
                let arr: TileAnchor[] = this.model[k].anchors;
                for (let i: number = 0; i < arr.length; i++) {
                    let a: TileAnchor = arr[i];
                    this.addGroupTile(svggroup,
                        a, this.model[k].mode
                    );
                }
            }
        }
        this.allTilesOK = true;
    }
    addGroupTile(parentSVGElement: SVGElement, anchor: TileAnchor, layerMode: LevelModes
        //, layer: TileLayerDefinition
    ) {
        //if (parentSVGElement.id == 'rightMenuContentAnchor') console.log('addGroupTile', anchor.id);
        if (anchor.id) {
            //
        } else {
            anchor.id = rid()
        }

        let x: number = -this.translateX;
        let y: number = -this.translateY;
        let w: number = this.svg.clientWidth * this.translateZ;
        let h: number = this.svg.clientHeight * this.translateZ;
        let cX: number = 0;
        let cY: number = 0;
        if (this.viewWidth * this.translateZ > this.innerWidth) {
            if (this.stickLeft) {
                //
            } else {
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
            w = this.viewHeight;
            h = this.viewHeight;
        } else {
            if (layerMode == LevelModes.left) {
                x = 0;
            } else {
                if (layerMode == LevelModes.top) {
                    y = 0;
                } else {
                    if (layerMode == LevelModes.right) {
                        x = 0;
                    } else {
                        if (layerMode == LevelModes.bottom) {
                            y = 0;
                        }
                    }
                }
            }
        }
        /*if (parentSVGElement.id == 'rightMenuContentAnchor') {
            console.log('check', anchor.showZoom, this.translateZ, anchor.hideZoom);
        }*/
        if (anchor.showZoom <= this.translateZ && anchor.hideZoom > this.translateZ) {
            /*if (parentSVGElement.id == 'rightMenuContentAnchor') {
                console.log('collision', x, y, w, h
                    , ':'
                    , anchor.xx * this.tapSize
                    , anchor.yy * this.tapSize
                    , anchor.ww * this.tapSize
                    , anchor.hh * this.tapSize
                    
                    );
            }*/
            if (LevelModes.overlay || this.collision(anchor.xx * this.tapSize
                , anchor.yy * this.tapSize
                , anchor.ww * this.tapSize
                , anchor.hh * this.tapSize //
                , x, y, w, h)) {

                var gid: string = anchor.id ? anchor.id : '';
                let existedSVGchild: SVGElement | null = this.groupChildWithID(parentSVGElement, gid);
                //if (parentSVGElement.id == 'rightMenuContentAnchor') { console.log('rightMenuContentAnchor', existedSVGchild); }

                if (existedSVGchild) {
                    if (anchor.translation) {
                        let tr = anchor.translation;
                        let translate = 'translate(' + (tr.x * this.tapSize) + ',' + (tr.y * this.tapSize) + ')';
                        existedSVGchild.setAttribute('transform', translate);
                        //console.log('translation',existedSVGchild,tr,translate);
                    }

                    for (let n = 0; n < anchor.content.length; n++) {
                        let d = anchor.content[n];
                        if (isTileGroup(d)) {
                            this.addElement(existedSVGchild, d, layerMode);
                        }
                    }
                } else {
                    let g: TileSVGElement = document.createElementNS(this.svgns, 'g') as TileSVGElement;
                    g.id = gid;//tileGroup.id;
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
                        //console.log('translation',g);
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
    groupChildWithID(group: SVGElement, id: string): SVGElement | null {
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
    addElement(gg: SVGElement, dd: TileItem
        //, layer: TileLayerDefinition
        , layerMode: LevelModes
    ) {
        /*if (gg.id == 'rightMenuContentAnchor') {
            console.log('addElement', dd.id);
        }*/
        if (dd.id) {
            //
        } else {
            dd.id = rid()
        }
        let element: TileSVGElement | null = null;
        if (isTileRectangle(dd)) {
            element = tileRectangle(this.svgns, this.tapSize, gg, dd.x * this.tapSize, dd.y * this.tapSize
                , dd.w * this.tapSize, dd.h * this.tapSize
                , (dd.rx ? dd.rx : 0) * this.tapSize, (dd.ry ? dd.ry : 0) * this.tapSize
                //, dd.image
                , (dd.css ? dd.css : '')
                , (dd.style ? dd.style : '')
            );
        }
        if (isTileImage(dd)) {
            element = tileImage(this.svgns, this.tapSize, gg, dd.x * this.tapSize, dd.y * this.tapSize
                , dd.w * this.tapSize, dd.h * this.tapSize
                , dd.href
                , dd.preserveAspectRatio
                , (dd.css ? dd.css : ''));
        }
        if (isTileText(dd)) {
            element = tileText(this.svgns, this.tapSize, gg, dd.x * this.tapSize, dd.y * this.tapSize, dd.text
                , dd.maxWidth ? dd.maxWidth : ''
                , dd.css ? dd.css : '', dd.style ? dd.style : '');
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
            //if (gg.id == 'rightMenuContentAnchor') console.log('group', gg.id, dd.id);
            this.addGroupTile(gg, dd, layerMode);

        }
        if (element) {
            if (dd.id) element.id = dd.id;
            if (dd.activation) {
                let me: TileLevelRealTime = this;
                if (dd.draggable) {
                    let dndstart: (mouseEvent: MouseEvent) => void = (mouseEvent: MouseEvent) => {
                        me.currentDragItem = dd;
                    };
                    element.addEventListener('mousedown', dndstart, { capture: false, passive: false });
                    element.addEventListener('touchstart', dndstart, { capture: false, passive: false });
                    //}
                } else {
                    element.onClickFunction = dd.activation;
                    let click: () => void = function () {
                        if (me.waitViewClickAction) {
                            if (element) {
                                if (element.onClickFunction) {
                                    let xx: number = element.getBoundingClientRect().left - me.svg.getBoundingClientRect().left;
                                    let yy: number = element.getBoundingClientRect().top - me.svg.getBoundingClientRect().top;
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
            for (let i: number = 0; i < this.model.length; i++) {
                this.clearGroupDetails(this.model[i].g);
            }
        }
    }
    clearGroupDetails(group: SVGElement) {
        if (group) this.msEdgeHook(group);
        while (group.children.length) {
            group.removeChild(group.children[0]);
        }
    }
    /*autoID(definition: (TileAnchor | TileRectangle | TileText | TilePath | TileLine | TilePolygon)[]) {
        if (definition) {
            if (definition.length) {
                for (let i: number = 0; i < definition.length; i++) {
                    if (!(definition[i].id)) {
                        definition[i].id = rid();
                    }
                    if (isTileGroup(definition[i])) {
                        let group: TileAnchor = definition[i] as TileAnchor;
                        this.autoID(group.content);
                    }
                }
            }
        }
    }*/
    setModel(layers: TileLayerDefinition[]) {
        //for (let i: number = 0; i < layers.length; i++) {
        //    this.autoID(layers[i].anchors);
        //}
        this.model = layers;
        this.resetModel();
    }
    resetModel() {
        //for (let i: number = 0; i < this.model.length; i++) {
        //    this.autoID(this.model[i].anchors);
        //}
        this.clearAllDetails();
        this.applyZoomPosition();
        this.adjustContentPosition();
        this.slideToContentPosition();
        this.allTilesOK = false;
    }
    resetAnchor(parentSVGGroup: SVGElement, anchor: TileAnchor
        //, layer: TileLayerDefinition
        , layerMode: LevelModes
    ) {

        var gid: string = anchor.id ? anchor.id : '';
        let existedSVGchild: SVGElement | null = this.groupChildWithID(parentSVGGroup, gid);
        //if (anchor.id == 'rightMenuContentAnchor') console.log('resetAnchor', parentSVGGroup.id, gid);
        if (existedSVGchild) {
            //console.log('remove',existedSVGchild,'from',parentSVGGroup);
            parentSVGGroup.removeChild(existedSVGchild);
        }
        //console.log('add',anchor);
        this.addGroupTile(parentSVGGroup, anchor, layerMode);
    }
    delayedResetAnchor(parentSVGGroup: SVGElement, anchor: TileAnchor
        //, layer: TileLayerDefinition
        , layerMode: LevelModes
    ) {
        //let gg = (document.getElementById('' + parentAnchor.id) as any) as SVGElement;
        //if (gg) {
        //let parentSVGGroup: SVGElement = (gg as any) as SVGElement;
        let me = this;
        this.onResetAnchorDo.start(123, () => {
            me.resetAnchor(parentSVGGroup, anchor, layerMode);
        }
        );
        //}
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
    setAfterResizeCallback(f: () => void): void {
        this.afterResizeCallback = f;
    }
    setAfterZoomCallback(f: () => void): void {
        this.afterZoomCallback = f;
    }
}
