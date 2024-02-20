class MixerZoomLevel {
	zoomGridAnchor: TileAnchor;
	zoomTracksAnchor: TileAnchor;
	zoomFirstAnchor: TileAnchor;
	bars: MixerBar[];
	zoomLevelIndex: number;
	//projectTitle: TileText;
	//trackTitle: TileText;
	constructor(zoomLevel: number, anchorGrid: TileAnchor, anchorTracks: TileAnchor, anchorFirst: TileAnchor) {
		this.zoomLevelIndex = zoomLevel;
		this.zoomGridAnchor = anchorGrid;
		this.zoomTracksAnchor = anchorTracks;
		this.zoomFirstAnchor = anchorFirst;
		//this.zoomGridAnchor.content = [];
		//this.projectTitle = { x: 0, y: 1, text: 'Text label for testing of middle size project title', css: 'projectTitle' };
		//this.trackTitle = { x: 0, y: 1, text: 'Text label for testing of middle size project title', css: 'trackTitle' };
	}
	reCreateBars(data: MZXBX_Project) {
		//console.log('resetBars', ww, hh);
		let mixm: MixerDataMath = new MixerDataMath(data);
		this.zoomGridAnchor.content = [];//this.projectTitle,this.trackTitle];
		this.zoomTracksAnchor.content = [];
		this.zoomFirstAnchor.content = [];

		//this.trackTitle.y = mixm.gridTop();
		//this.trackTitle.text = data.tracks[0].title;

		//this.projectTitle.y = mixm.gridTop()*0.9;
		//this.projectTitle.text = data.title;

		this.bars = [];
		let left = mixm.LeftPad;
		let width = 0;
		let h12 = 12 * mixm.notePathHeight * mixm.octaveCount;
		for (let ii = 0; ii < data.timeline.length; ii++) {
			let timebar = data.timeline[ii];
			width = MZMM().set(timebar.metre).duration(timebar.tempo) * mixm.widthDurationRatio;

			let barGridAnchor: TileAnchor = {
				showZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom, hideZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex + 1].minZoom
				, xx: left, yy: mixm.gridTop(), ww: width, hh: h12, content: [], id: 'barGrid' + (ii + Math.random())
			};
			this.zoomGridAnchor.content.push(barGridAnchor);
			let barTracksAnchor: TileAnchor = {
				showZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom, hideZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex + 1].minZoom
				, xx: left, yy: mixm.gridTop(), ww: width, hh: h12, content: [], id: 'barTrack' + (ii + Math.random())
			};
			this.zoomTracksAnchor.content.push(barTracksAnchor);
			let barFirstAnchor: TileAnchor = {
				showZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom, hideZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex + 1].minZoom
				, xx: left, yy: mixm.gridTop(), ww: width, hh: h12, content: [], id: 'barFirst' + (ii + Math.random())
			};
			this.zoomFirstAnchor.content.push(barFirstAnchor);


			let mixBar = new MixerBar(ii, left, width, this.zoomLevelIndex
				, barGridAnchor
				, barTracksAnchor
				, barFirstAnchor
				, data);
			/*console.log(this.zoomAnchor.ww,mixBar.singleBarAnchor.ww);
			if(this.zoomAnchor.ww<mixBar.singleBarAnchor.ww){
				    
			    
				this.zoomAnchor.ww=mixBar.singleBarAnchor.ww;
			}*/
			this.bars.push(mixBar);

			

			left = left + width;
		}
		let titleLabel: TileText = { x: 0, y: mixm.gridTop()-zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom*2, text: data.title, css: 'titleLabel' + zoomPrefixLevelsCSS[this.zoomLevelIndex].prefix };
		this.zoomGridAnchor.content.push(titleLabel);
	}

}
