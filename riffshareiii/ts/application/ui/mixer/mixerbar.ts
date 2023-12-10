class MixerBar {
    octaves: BarOctave[];
    anchor: TileAnchor;
    zoomLevel: number;
    constructor(
        left: number, top: number, ww: number, hh: number
        , zoomLevel: number
        , toAnchor: TileAnchor
        , data: MZXBX_Project
    ) {
        this.zoomLevel = zoomLevel;
        let mixm: MixerDataMath = new MixerDataMath(data);
        this.anchor = toAnchor;
        this.octaves = [];
        let h12 = 12 * data.theme.notePathHeight;
        for (let oo = 0; oo < data.theme.octaveCount; oo++) {
            let barOctaveAnchor: TileAnchor = {
                showZoom: zoomPrefixLevelsCSS[this.zoomLevel].zoom
                , hideZoom: zoomPrefixLevelsCSS[this.zoomLevel + 1].zoom
                , xx: left, yy: oo * h12, ww: ww, hh: h12, content: []
                , id: 'octave' + (oo + Math.random())
            };
            this.anchor.content.push(barOctaveAnchor);
            let bo: BarOctave = new BarOctave(left, oo * h12, ww, h12, barOctaveAnchor
                , this.zoomLevel
            );
            this.octaves.push(bo);
        }

    }
}