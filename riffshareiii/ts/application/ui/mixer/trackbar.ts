class TrackBarUI {
    barRectangle: TileRectangle;
    barAnchor: TileAnchor;
    constructor(left: number, top: number, ww: number, hh: number
        , minZoom: number, maxZoom: number
        , toAnchor: TileAnchor) {
        this.barRectangle = { x: left, y: top, w: ww/2, h: hh, rx: 1, ry: 1, css: 'debug' };
        this.barAnchor = { xx: left, yy: top, ww: ww, hh: hh, showZoom: minZoom, hideZoom: maxZoom, content: [this.barRectangle] };
        toAnchor.content.push(this.barAnchor);
    }
}