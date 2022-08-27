function tileRectangle(svgns: string, tapSize: number,g: SVGElement, x: number, y: number, w: number, h: number, rx: number | undefined, ry: number | undefined, cssClass: string): TileSVGElement {
	let rect: TileSVGElement = document.createElementNS(svgns, 'rect') as TileSVGElement;
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
	//console.log(cssClass,rect);
	return rect;
}
