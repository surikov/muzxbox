class MixerZoomLevel {
    zoomAnchor: TileAnchor;
    bars: MixerBar[];
    zoomLevelIndex: number;
	title:TileText;
    constructor(zoomLevel: number, anchor: TileAnchor) {
        this.zoomLevelIndex = zoomLevel;
        this.zoomAnchor = anchor;
        this.zoomAnchor.content = [];
		this.title={x:0,y:10,text:'test',css:'mixTextFill warningIcon'};
    }
    reCreateBars(data: MZXBX_Project, ww: number, hh: number) {
        //console.log('resetBars', ww, hh);
        this.zoomAnchor.content = [this.title];
        this.bars = [];
        let left = 0;
        let width = 0;
        for (let ii = 0; ii < data.timeline.length; ii++) {
            let timebar = data.timeline[ii];
            width = MZMM().set(timebar.metre).duration(timebar.tempo) * data.theme.widthDurationRatio;
            let barAnchor: TileAnchor = {
                showZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex].zoom
                , hideZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex + 1].zoom
                , xx: left, yy: 0, ww: width, hh: hh, content: []
                , id: 'measure' + (ii + Math.random())
            };
            //console.log(ii,barAnchor)
            this.zoomAnchor.content.push(barAnchor);
            let mixBar=new MixerBar(left, 0, width, hh, this.zoomLevelIndex, barAnchor, data);
            this.bars.push(mixBar);
            left = left + width;
        }

    }
}
