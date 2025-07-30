function tileRectangle(svgns: string, tapSize: number, g: SVGElement
    , x: number, y: number, w: number, h: number
    , rx: number | undefined, ry: number | undefined
    //, image: string | undefined
    , cssClass: string
	,cssStyle:string
	): TileSVGElement {
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
    /*if (cssClass) {
        rect.classList.add(cssClass);
    }*/
	if (cssClass) {
		rect.setAttributeNS(null, 'class', cssClass);
	}else{
		if (cssStyle) {
			rect.setAttributeNS(null, 'style', cssStyle);
		}
	}
    //if(image){
        //image='theme/img/audio.png';
        //rect.setAttributeNS(null, 'background-image', '' + image);
        //rect.setAttributeNS(null, 'background-size', 'cover');
        //rect.style.backgroundImage=image;
        //rect.style.backgroundSize='cover';
        //rect.setAttributeNS(null,"style", "fill: blue; stroke: purple; background-size: cover; background-image: '"+image+"'");
        //console.dir(rect);
    //}
    g.appendChild(rect);
    //console.log(cssClass,rect);
    return rect;
}
