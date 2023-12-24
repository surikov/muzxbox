class MixerZoomLevel {
	zoomAnchor: TileAnchor;
	bars: MixerBar[];
	zoomLevelIndex: number;
	//projectTitle: TileText;
	//trackTitle: TileText;
	constructor(zoomLevel: number, anchor: TileAnchor) {
		this.zoomLevelIndex = zoomLevel;
		this.zoomAnchor = anchor;
		this.zoomAnchor.content = [];
		//this.projectTitle = { x: 0, y: 1, text: 'Text label for testing of middle size project title', css: 'projectTitle' };
		//this.trackTitle = { x: 0, y: 1, text: 'Text label for testing of middle size project title', css: 'trackTitle' };
	}
	reCreateBars(data: MZXBX_Project) {
		//console.log('resetBars', ww, hh);
		let mixm: MixerDataMath = new MixerDataMath(data);
		this.zoomAnchor.content = [];//this.projectTitle,this.trackTitle];

		//this.trackTitle.y = mixm.gridTop();
		//this.trackTitle.text = data.tracks[0].title;

		//this.projectTitle.y = mixm.gridTop()*0.9;
		//this.projectTitle.text = data.title;

		this.bars = [];
		let left = mixm.LeftPad;
		let width = 0;
		let   h12 = 12 * data.theme.notePathHeight*data.theme.octaveCount;
		for (let ii = 0; ii < data.timeline.length; ii++) {
			let timebar = data.timeline[ii];
			width = MZMM().set(timebar.metre).duration(timebar.tempo) * data.theme.widthDurationRatio;
			let barAnchor: TileAnchor = {
				showZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom
				, hideZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex + 1].minZoom
				, xx: left
				, yy: mixm.gridTop()
				, ww: width
				, hh: h12
				, content: []
				, id: 'measure' + (ii + Math.random())
			};
			//console.log(ii,barAnchor)
			this.zoomAnchor.content.push(barAnchor);
			let mixBar = new MixerBar(ii,left,  width, this.zoomLevelIndex, barAnchor, data);
			this.bars.push(mixBar);
			left = left + width;
		}

	}
}
