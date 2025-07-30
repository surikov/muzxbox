function tileImage(svgns: string, tapSize: number, g: SVGElement
	, x: number, y: number, w: number, h: number
	, href: string | undefined, preserveAspectRatio: string | undefined
	, cssClass: string): TileSVGElement {
	let img: TileSVGElement = document.createElementNS(svgns, 'image') as TileSVGElement;
	img.setAttributeNS(null, 'x', '' + x);
	img.setAttributeNS(null, 'y', '' + y);
	img.setAttributeNS(null, 'height', '' + h);
	img.setAttributeNS(null, 'width', '' + w);
	if (preserveAspectRatio) {
		img.setAttributeNS(null, 'preserveAspectRatio', preserveAspectRatio);
	} else {
		img.setAttributeNS(null, 'preserveAspectRatio', 'xMidYMid meet');//xMidYMid slice
	}
	if (cssClass) {
		img.classList.add(cssClass);
	}
	if (href) {
		img.setAttributeNS(null, 'href', href);
	}
	g.appendChild(img);
	return img;
}

