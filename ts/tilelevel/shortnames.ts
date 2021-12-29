function anchor(xx: number, yy: number, ww: number, hh: number, showZoom: number, hideZoom: number): TileAnchor {
	return { xx: xx, yy: yy, ww: ww, hh: hh, showZoom: showZoom, hideZoom: hideZoom, content: [] };
}
function rectangle(x: number, y: number, w: number, h: number, rx?: number, ry?: number, css?: string): TileRectangle {
	return { x: x, y: y, w: w, h: h, rx: rx, ry: ry, css: css };
}
function actionRectangle(action: (x: number, y: number) => void | undefined, x: number, y: number, w: number, h: number, rx?: number, ry?: number, css?: string): TileRectangle {
	return { x: x, y: y, w: w, h: h, rx: rx, ry: ry, css: css, action: action };
}
function line(x1: number, y1: number, x2: number, y2: number, css?: string): TileLine {
	return { x1: x1, y1: y1, x2: x2, y2: y2, css: css };
}
function text(x: number, y: number, text: string, css?: string): TileText {
	return { x: x, y: y, text: text, css: css };
}
function pathImage(x: number, y: number, scale: number, points: string, css?: string): TilePath {
	return { x: x, y: y, scale: scale, points: points, css: css };
}


function isLayerStickTop(t: TileLayerDefinition): t is TileLayerStickTop {
	return (t as TileLayerStickTop).stickTop !== undefined;
}
function isLayerStickBottom(t: TileLayerDefinition): t is TileLayerStickBottom {
	return (t as TileLayerStickBottom).stickBottom !== undefined;
}
function isLayerStickRight(t: TileLayerDefinition): t is TileLayerStickRight {
	return (t as TileLayerStickRight).stickRight !== undefined;
}
function isLayerOverlay(t: TileLayerDefinition): t is TileLayerOverlay {
	return (t as TileLayerOverlay).overlay !== undefined;
}
function isTilePath(t: TileItem): t is TilePath {
	return (t as TilePath).points !== undefined;
}
function isTileText(t: TileItem): t is TileText {
	return (t as TileText).text !== undefined;
}
function isTileLine(t: TileItem): t is TileLine {
	return (t as TileLine).x1 !== undefined;
}
function isTilePolygon(t: TileItem): t is TilePolygon {
	return (t as TilePolygon).dots !== undefined;
}
function isLayerStickLeft(t: TileLayerDefinition): t is TileLayerStickLeft {
	return (t as TileLayerStickLeft).stickLeft !== undefined;
}
function isTileRectangle(t: TileItem): t is TileRectangle {
	return (t as TileRectangle).h !== undefined;
}
function isTileGroup(t: TileItem): t is TileAnchor {
	return (t as TileAnchor).content !== undefined;
}
function isLayerNormal(t: TileLayerDefinition): t is TileModelLayer {
	return (t as any).stickLeft === undefined
		&& (t as any).stickTop === undefined
		&& (t as any).stickBottom === undefined
		&& (t as any).stickRight === undefined
		&& (t as any).overlay === undefined
		;
}
function rid() {
	return 'id' + Math.floor(Math.random() * 1000000000);
}
