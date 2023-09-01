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
function tileImage(svgns: string, tapSize: number, g: SVGElement
    , x: number, y: number, w: number, h: number
    , href: string | undefined,preserveAspectRatio:string|undefined
    , cssClass: string): TileSVGElement {
    let img: TileSVGElement = document.createElementNS(svgns, 'image') as TileSVGElement;
    img.setAttributeNS(null, 'x', '' + x);
    img.setAttributeNS(null, 'y', '' + y);
    img.setAttributeNS(null, 'height', '' + h);
    img.setAttributeNS(null, 'width', '' + w);
    if(preserveAspectRatio){
        img.setAttributeNS(null, 'preserveAspectRatio', preserveAspectRatio);
    }else{
    img.setAttributeNS(null, 'preserveAspectRatio', 'xMidYMid meet');
    }
    if (cssClass) {
        img.classList.add(cssClass);
    }
    if(href){
        img.setAttributeNS(null, 'href', href);
    }
    g.appendChild(img);
    return img;
}
