function tileText(svgns: string, tapSize: number,g: SVGElement, x: number, y: number, html: string, cssClass: string): TileSVGElement {

	let txt: TileSVGElement = document.createElementNS(svgns, 'text') as TileSVGElement;
	txt.setAttributeNS(null, 'x', '' + x);
	txt.setAttributeNS(null, 'y', '' + y);
	if (cssClass) {
		txt.setAttributeNS(null, 'class', cssClass);
	}
	txt.innerHTML = html;
	g.appendChild(txt);
	//console.log('tileText',g,txt);
	return txt;
}
