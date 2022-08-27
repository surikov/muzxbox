function tileLine(svgns: string, tapSize: number,g: SVGElement, x1: number, y1: number, x2: number, y2: number, cssClass: string | undefined): TileSVGElement {
	let line: TileSVGElement = document.createElementNS(svgns, 'line') as TileSVGElement;
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
