//console.log('tilelevelг v2.17');
//let this: TileLevel = null;
/*
let layerModeLockX: string = 'lockX';
let layerModeNormal: string = 'normal';
let layerModeOverlay: string = 'overlay';
let layerModeLockY: string = 'lockY';
let layerModeStickBottom: string = 'stickBottom';
let layerModeStickRight: string = 'stickRight';
*/

class CannyDo {
	currentID: number = 0;
	start(ms: number, action: () => void) {
		var startId = -1;
		this.currentID = setTimeout(function () {
			//console.log(startId,this.currentID,this);
			if (startId == this.currentID) {
				action();
			}
		}.bind(this), ms);
		startId = this.currentID;
	}
}

type TileZoom = {
	x: number,
	y: number,
	z: number
}
type TilePoint = {
	x: number,
	y: number
}
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
	overlay: number
} & TileModelLayer;

type TileBaseDefinition = {
	id?: string// = 'id'+Math.floor(Math.random()*1000000000)
	, css?: string// string
	, dragX?: boolean// string
	, dragY?: boolean// string
	, action?: (x: number, y: number) => void | undefined
};
type TileLayerDefinition = TileModelLayer | TileLayerStickLeft | TileLayerStickTop | TileLayerStickBottom | TileLayerStickRight | TileLayerOverlay;
type TileItem = TileAnchor | TileRectangle | TileText | TilePath | TileLine | TilePolygon;
type TileAnchor = {
	xx: number
	, yy: number
	, ww: number
	, hh: number
	, showZoom: number
	, hideZoom: number
	, content: TileItem[]
} & TileBaseDefinition;


type TileRectangle = {
	x: number
	, y: number
	, w: number
	, h: number
	, rx?: number
	, ry?: number
} & TileBaseDefinition;

type TileText = {
	x: number
	, y: number
	, text: string
} & TileBaseDefinition;

type TilePath = {
	x?: number
	, y?: number
	, scale?: number
	, points: string//path definition
} & TileBaseDefinition;

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