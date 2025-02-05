function tilePath(svgns: string, tapSize: number,g: SVGElement, x: number, y: number, z: number, data: string, cssClass: string): TileSVGElement {
	let path: TileSVGElement = document.createElementNS(svgns, 'path') as TileSVGElement;
	path.setAttributeNS(null, 'd', data);
	let t: string = "";
	if ((x) || (y)) {
		t = 'translate(' + x + ',' + y + ')';
	}
	if (z) {
		t = t + ' scale(' + z + ')';
	}
	if (t.length > 0) {
		path.setAttributeNS(null, 'transform', t);
	}
	/*if (cssClass) {
		path.classList.add(cssClass);
	}*/
	if (cssClass) {
		path.setAttributeNS(null, 'class', cssClass);
	}
	g.appendChild(path);
	return path;
}
