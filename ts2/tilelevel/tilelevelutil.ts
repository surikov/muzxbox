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
			
			if (startId == this.currentID) {
				//console.log('do',startId);
				action();
			}else{
				//console.log('skip',startId,'for',this.currentID);
			}
		}.bind(this), ms);
		startId = this.currentID;
		//console.log('wait',startId);
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
	//, dragX?: boolean// string
	//, dragY?: boolean// string
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
function TAnchor(xx: number, yy: number, ww: number, hh: number, showZoom: number, hideZoom: number,id?:string): TileAnchor {
	return { xx: xx, yy: yy, ww: ww, hh: hh, showZoom: showZoom, hideZoom: hideZoom, content: [] ,id:id};
}

type TileRectangle = {
	x: number
	, y: number
	, w: number
	, h: number
	, rx?: number
	, ry?: number
} & TileBaseDefinition;
/*function TRectangle(x: number, y: number, w: number, h: number, rx?: number, ry?: number, id?: string, css?: string, dragX?: boolean, dragY?: boolean, action?: (x: number, y: number) => void | undefined): TileRectangle {
	return { x: x, y: y, w: w, h: h, rx: rx, ry: ry, id: id, css: css, dragX: dragX, dragY: dragY, action: action };
}*/

type TileText = {
	x: number
	, y: number
	, text: string
} & TileBaseDefinition;
function TText(x: number, y: number, css: string, text: string): TileText {
	return { x: x, y: y, text: text, css: css,  };
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
function cloneBaseDefiition(from: TileBaseDefinition): TileBaseDefinition {
	var to: TileBaseDefinition = {};
	//if (from.action) to.action = from.action;
	if (from.css) to.css = from.css;
	//if (from.dragX) to.dragX = from.dragX;
	//if (from.dragY) to.dragY = from.dragY;
	return to;
}
function cloneLine(from: TileLine): TileLine {
	var to: TileLine = cloneBaseDefiition(from) as TileLine;
	to.x1 = from.x1;
	to.x2 = from.x2;
	to.y1 = from.y1;
	to.y2 = from.y2;
	return to;
}
function cloneRectangle(from: TileRectangle): TileRectangle {
	var to: TileRectangle = cloneBaseDefiition(from) as TileRectangle;
	to.x = from.x;
	to.y = from.y;
	to.w = from.w;
	to.h = from.h;
	to.rx = from.rx;
	to.ry = from.ry;
	return to;
}
