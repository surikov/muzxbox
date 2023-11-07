class MixerLevel {
    minZoom: number;
    maxZoom: number;
    anchor: TileAnchor;
    bg: TileRectangle;
    prefix: string;
    bars: TrackBarUI[];
    constructor(prefix: string, minZoom: number, maxZoom: number, anchor: TileAnchor) {
        this.minZoom = minZoom;
        this.maxZoom = maxZoom;
        this.anchor = anchor;
        this.prefix = prefix;
        this.bg = { x: 0, y: 0, w: 5, h: 5, rx: 0.4, ry: 0.4, css: 'mixFieldBg' + this.prefix };
        this.anchor.content = [this.bg];
        this.bars = [];
    }
    buildLevel(ww: number, hh: number) {
        this.bg.w = ww;
        this.bg.h = hh;
    }
    fillBars(data: MixerData, hh: number) {

        let left = 0;
        let width = 0;
        for (let ii = 0; ii < data.timeline.length; ii++) {
            let timebar = data.timeline[ii];
            width = new MusicMetreMath(timebar.metre).width(timebar.tempo, data.widthDurationRatio);
            this.bars.push(new TrackBarUI(left, 0, width, hh, this.minZoom, this.maxZoom, this.anchor));
            left = left + width;
        }
    }
}
