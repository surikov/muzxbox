class MixerBar {
	
    octaves: BarOctave[];
    //singleBarGridAnchor: TileAnchor;
	//singleBarOtherTracksAnchor: TileAnchor;
	//singleBarFirstAnchor: TileAnchor;
    zoomLevel: number;
	
    constructor(
        barIdx: number, left: number, ww: number
        , zoomLevel: number
        , gridZoomBarAnchor: TileAnchor
		, tracksZoomBarAnchor: TileAnchor
		, firstZoomBarAnchor: TileAnchor
        , data: MZXBX_Project
    ) {
        //console.log('MixerBar',zoomLevel,left,ww,data.theme.octaveCount);
        //this.zoomLevel = zoomLevel;
        let mixm: MixerDataMath = new MixerDataMath(data);
        //this.singleBarGridAnchor = gridZoomBarAnchor;
		//this.singleBarOtherTracksAnchor = tracksZoomBarAnchor;
		//this.singleBarFirstAnchor = firstZoomBarAnchor;
        //this.octaves = [];
        let h12 = 12 * mixm.notePathHeight;
        for (let oo = 0; oo < mixm.octaveCount; oo++) {
            let gridOctaveAnchor: TileAnchor = {
                showZoom: zoomPrefixLevelsCSS[zoomLevel].minZoom
                , hideZoom: zoomPrefixLevelsCSS[zoomLevel + 1].minZoom
                , xx: left
                , yy: mixm.gridTop() + oo * h12
                , ww: ww
                , hh: h12, content: []
                , id: 'octaveGridz'+zoomLevel+'b'+barIdx+'o'+ oo+'r' + Math.random()
            };
			gridZoomBarAnchor.content.push(gridOctaveAnchor);
			let tracksOctaveAnchor: TileAnchor = {
                showZoom: zoomPrefixLevelsCSS[zoomLevel].minZoom
                , hideZoom: zoomPrefixLevelsCSS[zoomLevel + 1].minZoom
                , xx: left
                , yy: mixm.gridTop() + oo * h12
                , ww: ww
                , hh: h12, content: []
                , id: 'octaveTracks' +zoomLevel+'b'+barIdx+'o'+ oo+'r' + Math.random()
            };
			tracksZoomBarAnchor.content.push(tracksOctaveAnchor);
			let firstOctaveAnchor: TileAnchor = {
                showZoom: zoomPrefixLevelsCSS[zoomLevel].minZoom
                , hideZoom: zoomPrefixLevelsCSS[zoomLevel + 1].minZoom
                , xx: left
                , yy: mixm.gridTop() + oo * h12
                , ww: ww
                , hh: h12, content: []
                , id: 'octaveFirst'+zoomLevel+'b'+barIdx+'o'+ oo+'r' + Math.random()
            };
            firstZoomBarAnchor.content.push(firstOctaveAnchor);
            let bo: BarOctave = new BarOctave(
                barIdx, (mixm.octaveCount - oo - 1), left, mixm.gridTop() + oo * h12
                , ww, h12
				, gridOctaveAnchor
				, tracksOctaveAnchor
				, firstOctaveAnchor
				, zoomLevel, data);

            //console.log(zoomLevel, barIdx, this.singleBarAnchor.ww, singleOctaveAnchor.ww);
/*
            if (this.singleBarGridAnchor.ww < gridOctaveAnchor.ww) {
                this.singleBarGridAnchor.ww = gridOctaveAnchor.ww;

            }*/
            //this.octaves.push(bo);
        }
        
    }
    
}