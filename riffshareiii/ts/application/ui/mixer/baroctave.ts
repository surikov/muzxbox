class BarOctave {
    barRightBorder: TileRectangle;
    octaveBottomBorder: TileRectangle;
    constructor(left: number, top: number, width: number, height: number, anchor: TileAnchor
        //, prefix: string, minZoom: number, maxZoom: number, data: MZXBX_Project
        , zoomLevel: number
    ) {
        //let mixm: MixerDataMath = new MixerDataMath(data);
        //let oRectangle = { x: left, y: top, w: width, h: height, rx: 1, ry: 1, css: 'mixFieldBg' + prefix };
        this.barRightBorder = {
            x: left + width
            , y: top
            , w: zoomPrefixLevelsCSS[zoomLevel].zoom/8.0
            , h: height - 1.5
            , css: 'mixPanelFill'
        };
        this.octaveBottomBorder = {
            x: left
            , y: top + height
            , w: width - 1.5
            , h: zoomPrefixLevelsCSS[zoomLevel].zoom/8.0
            , css: 'mixToolbarFill'
        };
        //let oAnchor = { xx: left, yy: top, ww: width, hh: height, showZoom: minZoom, hideZoom: maxZoom, content: [oRectangle] };
        //anchor.content.push(oAnchor);
        //console.log(left,top,prefix,minZoom,maxZoom);
        anchor.content.push(this.barRightBorder);
        anchor.content.push(this.octaveBottomBorder);
    }
}