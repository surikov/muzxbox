class MixerBar {
    barRectangle: TileRectangle;
    barAnchor: TileAnchor;
    prefix: string = '';
    octaves: BarOctave[];
    constructor(prefix: string
        , left: number, top: number, ww: number, hh: number
        , minZoom: number, maxZoom: number
        , toAnchor: TileAnchor
        , data: MZXBX_Project
    ) {
        this.prefix = prefix;
        this.barRectangle = { x: left, y: top, w: ww, h: hh, rx: 1, ry: 1, css: 'mixFieldBg' + this.prefix };
        this.barAnchor = { xx: left, yy: top, ww: ww, hh: hh, showZoom: minZoom, hideZoom: maxZoom, content: [this.barRectangle] };
        toAnchor.content.push(this.barAnchor);
        this.octaves = [];
        for (let oo = 0; oo < 10; oo++) {
            this.octaves.push(new BarOctave(left, oo * 12 * data.theme.notePathHeight, ww, 12 * data.theme.notePathHeight, this.barAnchor, prefix, minZoom, maxZoom, data));
        }

    }
}