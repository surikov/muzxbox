console.log('Tile Level API');

type TileZoom = {
    x: number,
    y: number,
    z: number
}
type TilePoint = {
    x: number,
    y: number
}
/*
type TileModelLayer = {
    g: SVGElement,
    //mode: string = 'normal';
    //shift: number;
    //viceversa: boolean;
    //definition: TileDefinition[] = [];
    anchors: TileAnchor[]
}

type TileLayerStickLeft = {
    stickLeft: number
} & TileModelLayer;

type TileLayerStickTop = {
    stickTop: number
} & TileModelLayer;

type TileLayerStickBottom = {
    stickBottom: number
} & TileModelLayer;

type TileLayerStickRight = {
    stickRight: number
} & TileModelLayer;

type TileLayerOverlay = {
    overlay: boolean
} & TileModelLayer;
*/
type TileBaseDefinition = {
    id?: string// = 'id'+Math.floor(Math.random()*1000000000)
    , css?: string// string
    , style?: string
    //,tempX?:number
    //,tempY?:number
    //, dragX?: boolean// string
    //, dragY?: boolean// string
    , activation?: (x: number, y: number) => void | undefined
    //,dragndrop?:(dx: number, dy: number)=>void
    , draggable?: boolean
};
//type TileLayerDefinition = TileModelLayer | TileLayerStickLeft | TileLayerStickTop | TileLayerStickBottom | TileLayerStickRight | TileLayerOverlay;

enum LevelModes { normal = 0, left = 1, right = 2, top = 3, bottom = 4, overlay = 5 };
/*
const LayerModeModel=0;
const LayerModeStickLeft=1;
const LayerModeStickTop=2;
const LayerModeStickBottom=3;
const LayerModeStickRight=4;
const LayerModeOverlay=5;
*/


type TileLayerDefinition = {
    g: SVGElement
    , mode: 0 | 1 | 2 | 3 | 4 | 5
    , stickLeft?: number
    , stickTop?: number
    , stickBottom?: number
    , stickRight?: number
    , anchors: TileAnchor[]
}
type TileItem = TileAnchor | TileRectangle | TileText | TilePath | TileLine | TilePolygon | TileImage;
type TileAnchor = {
    xx: number
    , yy: number
    , ww: number
    , hh: number
    , showZoom: number
    , hideZoom: number
    , content: TileItem[]
    , translation?: TilePoint
} & TileBaseDefinition;
function TAnchor(xx: number, yy: number, ww: number, hh: number, showZoom: number, hideZoom: number, id?: string
    , translation?: TilePoint
): TileAnchor {
    return { xx: xx, yy: yy, ww: ww, hh: hh, showZoom: showZoom, hideZoom: hideZoom, content: [], id: id };
}

type TileImage = {
    x: number
    , y: number
    , w: number
    , h: number
    , preserveAspectRatio?: string //(none) xMinYMin | xMidYMin | xMaxYMin | xMinYMid | xMidYMid | xMaxYMid | xMinYMax | xMidYMax | xMaxYMax meet | slice
    , href: string
} & TileBaseDefinition;
type TileRectangle = {
    x: number
    , y: number
    , w: number
    , h: number
    , rx?: number
    , ry?: number

    //,image?:string
} & TileBaseDefinition;
/*function TRectangle(x: number, y: number, w: number, h: number, rx?: number, ry?: number, id?: string, css?: string, dragX?: boolean, dragY?: boolean, action?: (x: number, y: number) => void | undefined): TileRectangle {
    return { x: x, y: y, w: w, h: h, rx: rx, ry: ry, id: id, css: css, dragX: dragX, dragY: dragY, action: action };
}*/

type TileText = {
    x: number
    , y: number
    , text: string
    , maxWidth?: string
} & TileBaseDefinition;
function TText(x: number, y: number, css: string, text: string): TileText {
    return { x: x, y: y, text: text, css: css, };
}

type TilePath = {
    x?: number
    , y?: number
    , scale?: number
    , points: string//path definition
} & TileBaseDefinition;
/*function TPath(x: number, y: number,scale: number, points: string, id?: string, css?: string, dragX?: boolean, dragY?: boolean, action?: (x: number, y: number) => void | undefined): TilePath {
    return { x: x, y: y, scale: scale, points: points, id: id, css: css, dragX: dragX, dragY: dragY, action: action };
}*/

type TileLine = {
    x1: number
    , x2: number
    , y1: number
    , y2: number
} & TileBaseDefinition;

type TilePolygon = {
    x?: number
    , y?: number
    , scale?: number
    , dots: number[]
} & TileBaseDefinition;

type TileSVGElement = SVGElement & {
    onClickFunction: (x: number, y: number) => void
    , watchX: number
    , watchY: number
    , watchW: number
    , watchH: number
    , minZoom: number
    , maxZoom: number
    , translateX: number
    , translateY: number
};
type TileLevelBase = {
    dump: () => void;
    tapPxSize: () => number;
    setupTapSize: (ratioCm: number) => void;
    resetModel: () => void;
    getCurrentPointPosition(): TileZoom;
    setCurrentPointPosition: (xyz: TileZoom) => void;
    getStartMouseScreen(): TilePoint;
    screen2view(screen: TilePoint): TilePoint;
    resetAnchor(parentSVGGroup: SVGElement, anchor: TileAnchor
        //, layer: TileLayerDefinition
        , layerMode: LevelModes
    ): void;
    delayedResetAnchor(parentSVGGroup: SVGElement, anchor: TileAnchor
        //, layer: TileLayerDefinition
        , layerMode: LevelModes
    ): void;
    setAfterResizeCallback(f: () => void): void;
    setAfterZoomCallback(f: () => void): void;
    //resetAnchor: (//fromSVGGroup: SVGElement,
    //    anchor: TileAnchor, layer: TileLayerDefinition) => void;
    resetInnerSize(inWidth: number, inHeight: number): void;
    initRun(svgObject: SVGElement
        , stickLeft: boolean
        , inWidth: number, inHeight: number
        , minZoom: number, curZoom: number, maxZoom: number
        , layers: TileLayerDefinition[]): void;
}

