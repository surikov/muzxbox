class MixerBar {
    octaves: BarOctave[];
    singleBarAnchor: TileAnchor;
    zoomLevel: number;
    constructor(
        barIdx: number, left: number, ww: number
        , zoomLevel: number
        , zoomBarAnchor: TileAnchor
        , data: MZXBX_Project
    ) {
        //console.log('MixerBar',zoomLevel,left,ww,data.theme.octaveCount);
        this.zoomLevel = zoomLevel;
        let mixm: MixerDataMath = new MixerDataMath(data);
        this.singleBarAnchor = zoomBarAnchor;
        this.octaves = [];
        let h12 = 12 * mixm.notePathHeight;
        for (let oo = 0; oo < mixm.octaveCount; oo++) {
            let singleOctaveAnchor: TileAnchor = {
                showZoom: zoomPrefixLevelsCSS[this.zoomLevel].minZoom
                , hideZoom: zoomPrefixLevelsCSS[this.zoomLevel + 1].minZoom
                , xx: left
                , yy: mixm.gridTop() + oo * h12
                , ww: ww
                , hh: h12, content: []
                , id: 'octave' + (oo + Math.random())
            };
            this.singleBarAnchor.content.push(singleOctaveAnchor);
            let bo: BarOctave = new BarOctave(
                barIdx, (mixm.octaveCount - oo - 1), left, mixm.gridTop() + oo * h12
                , ww, h12, singleOctaveAnchor, this.zoomLevel, data);
            //console.log(zoomLevel, barIdx, this.singleBarAnchor.ww, singleOctaveAnchor.ww);

            if (this.singleBarAnchor.ww < singleOctaveAnchor.ww) {
                this.singleBarAnchor.ww = singleOctaveAnchor.ww;

            }
            this.octaves.push(bo);
        }
        
    }
    
}