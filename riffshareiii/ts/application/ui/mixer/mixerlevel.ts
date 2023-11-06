class MixerLevel {
    minZoom: number;
    maxZoom: number;
    anchor: TileAnchor;
    bg: TileRectangle;
    prefix: string;
    constructor(prefix: string, minZoom: number, maxZoom: number, anchor: TileAnchor) {
        this.minZoom = minZoom;
        this.maxZoom = maxZoom;
        this.anchor = anchor;
        this.prefix = prefix;
        this.bg = { x: 0, y: 0, w: 5, h: 5, rx: 0.4, ry: 0.4, css: 'mixFieldBg' + this.prefix };
        this.anchor.content = [this.bg];
    }
    build(ww: number, hh: number) {
        this.bg.w = ww;
        this.bg.h = hh;
    }
}
