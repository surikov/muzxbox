function tilePolygon(svgns: string, tapSize: number, g: SVGElement, x: number, y: number, z: number | undefined, dots: number[], cssClass: string | undefined): TileSVGElement {
	let polygon: TileSVGElement = document.createElementNS(svgns, 'polygon') as TileSVGElement;
	let points: string = '';
	let dlmtr = '';
	for (let i = 0; i < dots.length; i = i + 2) {
		points = points + dlmtr + dots[i] * tapSize + ',' + dots[i + 1] * tapSize;
		dlmtr = ', ';
	}
	polygon.setAttributeNS(null, 'points', points);
	let t: string = "";
	if ((x) || (y)) {
		t = 'translate(' + x + ',' + y + ')';
	}
	if (z) {
		t = t + ' scale(' + z + ')';
	}
	if (t.length > 0) {
		polygon.setAttributeNS(null, 'transform', t);
	}
	/*if (cssClass) {
		polygon.classList.add(cssClass);
	}*/
	if (cssClass) {
		polygon.setAttributeNS(null, 'class', cssClass);
	}
	g.appendChild(polygon);
	return polygon;
}
