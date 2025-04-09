declare function createTileLevel(): TileLevelBase;
declare class TileLevelRealTime implements TileLevelBase {
    svg: SVGElement;
    tapSize: number;
    twoZoom: boolean;
    clickLimit: number;
    svgns: string;
    stickLeft: boolean;
    viewWidth: number;
    viewHeight: number;
    innerWidth: number;
    innerHeight: number;
    _translateX: number;
    _translateY: number;
    _translateZ: number;
    startMouseScreenX: number;
    startMouseScreenY: number;
    clickX: number;
    clickY: number;
    dragZoom: number;
    _allTilesOK: boolean;
    waitViewClickAction: boolean;
    mx: number;
    mn: number;
    startedTouch: boolean;
    twodistance: number;
    twocenter: TilePoint;
    model: TileLayerDefinition[];
    slidingLockTo: number;
    slidingID: number;
    onResizeDo: CannyDo;
    onZoom: CannyDo;
    onResetAnchorDo: LazyDo;
    afterZoomCallback: () => void;
    afterResizeCallback: () => void;
    lastTickTime: number;
    fastenUp: boolean;
    fastenDown: boolean;
    fastenLeft: boolean;
    fastenRight: boolean;
    lastMoveDx: number;
    lastMoveDy: number;
    mouseDownMode: boolean;
    currentDragItem: null | TileItem;
    interactor: TileInteraction;
    get allTilesOK(): boolean;
    set allTilesOK(bb: boolean);
    get translateZ(): number;
    set translateZ(z: number);
    get translateX(): number;
    set translateX(x: number);
    get translateY(): number;
    set translateY(y: number);
    getStartMouseScreen(): TilePoint;
    setCurrentPointPosition(position: TileZoom): void;
    getCurrentPointPosition(): TileZoom;
    screen2view(screen: TilePoint): TilePoint;
    resetInnerSize(inWidth: number, inHeight: number): void;
    initRun(svgObject: SVGElement, stickLeft: boolean, inWidth: number, inHeight: number, minZoom: number, curZoom: number, maxZoom: number, layers: TileLayerDefinition[]): void;
    dump(): void;
    tapPxSize(): number;
    setupTapSize(baseSize: number): void;
    onAfterResize(): void;
    onMove(dx: number, dy: number): void;
    applyZoomPosition(): void;
    checkAfterZoom(): void;
    slideToContentPosition(): void;
    maxZoom(): number;
    minZoom(): number;
    adjustContentPosition(): void;
    calculateValidContentPosition(): TileZoom;
    startTouchZoom(touchEvent: TouchEvent): void;
    startSlideCenter(x: number, y: number, z: number, w: number, h: number, action: () => void): void;
    startSlideTo(x: number, y: number, z: number, action: (() => void) | null): void;
    startStepSlideTo(s: number, x: number, y: number, z: number, action: (() => void) | null): void;
    stepSlideTo(key: number, xyz: TileZoom[], action: (() => void) | null): void;
    queueTiles(): void;
    clearUselessDetails(): void;
    clearUselessGroups(group: SVGElement, layer: TileLayerDefinition): void;
    msEdgeHook(g: SVGElement): void;
    outOfWatch(g: TileSVGElement, x: number, y: number, w: number, h: number): boolean;
    collision(x1: number, y1: number, w1: number, h1: number, x2: number, y2: number, w2: number, h2: number): boolean;
    collision2(x: number, w: number, left: number, width: number): boolean;
    tileFromModel(): void;
    addGroupTile(parentSVGElement: SVGElement, anchor: TileAnchor, layerMode: LevelModes): void;
    groupChildWithID(group: SVGElement, id: string): SVGElement | null;
    addElement(gg: SVGElement, dd: TileItem, layerMode: LevelModes): void;
    clearAllDetails(): void;
    clearGroupDetails(group: SVGElement): void;
    setModel(layers: TileLayerDefinition[]): void;
    resetModel(): void;
    updateAnchorTranslation(anchor: TileAnchor): void;
    resetAnchor(parentSVGGroup: SVGElement, anchor: TileAnchor, layerMode: LevelModes): void;
    delayedResetAnchor(parentSVGGroup: SVGElement, anchor: TileAnchor, layerMode: LevelModes): void;
    startLoop(): void;
    tick(): void;
    setAfterResizeCallback(f: () => void): void;
    setAfterZoomCallback(f: () => void): void;
}
declare function isTilePath(t: TileItem): t is TilePath;
declare function isTileText(t: TileItem): t is TileText;
declare function isTileLine(t: TileItem): t is TileLine;
declare function isTilePolygon(t: TileItem): t is TilePolygon;
declare function isTileRectangle(t: TileItem): t is TileRectangle;
declare function isTileImage(t: TileItem): t is TileImage;
declare function isTileGroup(t: TileItem): t is TileAnchor;
declare function rid(): string;
declare function nonEmptyID(id?: string): string;
declare class CannyDo {
    currentID: number;
    start(ms: number, action: () => void): void;
}
declare class LazyDo {
    locked: boolean;
    start(ms: number, action: () => void): void;
}
declare function cloneBaseDefiition(from: TileBaseDefinition): TileBaseDefinition;
declare function cloneLine(from: TileLine): TileLine;
declare function cloneRectangle(from: TileRectangle): TileRectangle;
declare function vectorFromTouch(touch: Touch): TilePoint;
declare function vectorFindCenter(xy1: TilePoint, xy2: TilePoint): TilePoint;
declare function vectorAdd(xy1: TilePoint, xy2: TilePoint): TilePoint;
declare function vectorScale(xy: TilePoint, coef: number): TilePoint;
declare function vectorDistance(xy1: TilePoint, xy2: TilePoint): number;
declare function vectorNorm(xy: TilePoint): number;
declare function vectorSubstract(xy1: TilePoint, xy2: TilePoint): TilePoint;
declare function vectorNormSquared(xy: TilePoint): number;
declare class TileInteraction {
    tiler: TileLevelRealTime;
    constructor(parenttiler: TileLevelRealTime);
    rakeMouseWheel(e: WheelEvent): boolean;
    rakeMouseDown(mouseEvent: MouseEvent): void;
    rakeMouseMove(mouseEvent: MouseEvent): void;
    rakeMouseUp(mouseEvent: MouseEvent): void;
    rakeTouchStart(touchEvent: TouchEvent): void;
    rakeTouchMove(touchEvent: TouchEvent): void;
    rakeTouchEnd(touchEvent: TouchEvent): void;
    startDragNDrop(): void;
    startDragZoom(): void;
    cancelDragZoom(): void;
}
declare function tileLine(svgns: string, tapSize: number, g: SVGElement, x1: number, y1: number, x2: number, y2: number, cssClass: string | undefined): TileSVGElement;
declare function tilePath(svgns: string, tapSize: number, g: SVGElement, x: number, y: number, z: number, data: string, cssClass: string): TileSVGElement;
declare function tilePolygon(svgns: string, tapSize: number, g: SVGElement, x: number, y: number, z: number | undefined, dots: number[], cssClass: string | undefined): TileSVGElement;
declare function tileRectangle(svgns: string, tapSize: number, g: SVGElement, x: number, y: number, w: number, h: number, rx: number | undefined, ry: number | undefined, cssClass: string, cssStyle: string): TileSVGElement;
declare function tileImage(svgns: string, tapSize: number, g: SVGElement, x: number, y: number, w: number, h: number, href: string | undefined, preserveAspectRatio: string | undefined, cssClass: string): TileSVGElement;
declare function tileText(svgns: string, tapSize: number, g: SVGElement, x: number, y: number, html: string, maxWidth: string, cssClass: string, cssStyle: string): TileSVGElement;
declare type TileZoom = {
    x: number;
    y: number;
    z: number;
};
declare type TilePoint = {
    x: number;
    y: number;
};
declare type TileBaseDefinition = {
    id?: string;
    css?: string;
    style?: string;
    activation?: (x: number, y: number) => void | undefined;
    draggable?: boolean;
};
declare enum LevelModes {
    normal = 0,
    left = 1,
    right = 2,
    top = 3,
    bottom = 4,
    overlay = 5
}
declare type TileLayerDefinition = {
    g: SVGElement;
    mode: 0 | 1 | 2 | 3 | 4 | 5;
    stickLeft?: number;
    stickTop?: number;
    stickBottom?: number;
    stickRight?: number;
    anchors: TileAnchor[];
};
declare type TileItem = TileAnchor | TileRectangle | TileText | TilePath | TileLine | TilePolygon | TileImage;
declare type TileAnchor = {
    xx: number;
    yy: number;
    ww: number;
    hh: number;
    minZoom: number;
    beforeZoom: number;
    content: TileItem[];
    translation?: TilePoint;
} & TileBaseDefinition;
declare function TAnchor(xx: number, yy: number, ww: number, hh: number, showZoom: number, hideZoom: number, id?: string, translation?: TilePoint): TileAnchor;
declare type TileImage = {
    x: number;
    y: number;
    w: number;
    h: number;
    preserveAspectRatio?: string;
    href: string;
} & TileBaseDefinition;
declare type TileRectangle = {
    x: number;
    y: number;
    w: number;
    h: number;
    rx?: number;
    ry?: number;
} & TileBaseDefinition;
declare type TileText = {
    x: number;
    y: number;
    text: string;
    maxWidth?: string;
} & TileBaseDefinition;
declare function TText(x: number, y: number, css: string, text: string): TileText;
declare type TilePath = {
    x?: number;
    y?: number;
    scale?: number;
    points: string;
} & TileBaseDefinition;
declare type TileLine = {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
} & TileBaseDefinition;
declare type TilePolygon = {
    x?: number;
    y?: number;
    scale?: number;
    dots: number[];
} & TileBaseDefinition;
declare type TileSVGElement = SVGElement & {
    onClickFunction: (x: number, y: number) => void;
    watchX: number;
    watchY: number;
    watchW: number;
    watchH: number;
    minZoom: number;
    maxZoom: number;
    translateX: number;
    translateY: number;
};
declare type TileLevelBase = {
    dump: () => void;
    tapPxSize: () => number;
    setupTapSize: (ratioCm: number) => void;
    resetModel: () => void;
    getCurrentPointPosition(): TileZoom;
    setCurrentPointPosition: (xyz: TileZoom) => void;
    getStartMouseScreen(): TilePoint;
    screen2view(screen: TilePoint): TilePoint;
    resetAnchor(parentSVGGroup: SVGElement, anchor: TileAnchor, layerMode: LevelModes): void;
    delayedResetAnchor(parentSVGGroup: SVGElement, anchor: TileAnchor, layerMode: LevelModes): void;
    updateAnchorTranslation(anchor: TileAnchor): void;
    setAfterResizeCallback(f: () => void): void;
    setAfterZoomCallback(f: () => void): void;
    resetInnerSize(inWidth: number, inHeight: number): void;
    initRun(svgObject: SVGElement, stickLeft: boolean, inWidth: number, inHeight: number, minZoom: number, curZoom: number, maxZoom: number, layers: TileLayerDefinition[]): void;
};
