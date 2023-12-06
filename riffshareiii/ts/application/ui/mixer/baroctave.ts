class BarOctave {
    constructor(left: number, top: number, width: number, height: number, anchor: TileAnchor, prefix: string, minZoom: number, maxZoom: number, data: MZXBX_Project) {
        let mixm: MixerDataMath = new MixerDataMath(data);
        let oRectangle = { x: left, y: top, w: width, h: height, rx: 1, ry: 1, css: 'mixFieldBg' + prefix };
        let oAnchor = { xx: left, yy: top, ww: width, hh: height, showZoom: minZoom, hideZoom: maxZoom, content: [oRectangle] };
        anchor.content.push(oAnchor);
		//console.log(left,top,prefix,minZoom,maxZoom);
    }
}