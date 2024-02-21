class MixerZoomLevel {
	zoomGridAnchor: TileAnchor;
	zoomTracksAnchor: TileAnchor;
	zoomFirstAnchor: TileAnchor;
	bars: MixerBar[];
	zoomLevelIndex: number;
	constructor(zoomLevel: number, anchorGrid: TileAnchor, anchorTracks: TileAnchor, anchorFirst: TileAnchor) {
		this.zoomLevelIndex = zoomLevel;
		this.zoomGridAnchor = anchorGrid;
		this.zoomTracksAnchor = anchorTracks;
		this.zoomFirstAnchor = anchorFirst;
	}
	reCreateBars(data: MZXBX_Project) {
		let mixm: MixerDataMath = new MixerDataMath(data);
		this.zoomGridAnchor.content = [];//this.projectTitle,this.trackTitle];
		this.zoomTracksAnchor.content = [];
		this.zoomFirstAnchor.content = [];
		this.bars = [];
		let left = mixm.LeftPad;
		let width = 0;
		//let h12 = 12 * mixm.notePathHeight * mixm.octaveCount;
		for (let ii = 0; ii < data.timeline.length; ii++) {
			let timebar = data.timeline[ii];
			width = MZMM().set(timebar.metre).duration(timebar.tempo) * mixm.widthDurationRatio;

			let barGridAnchor: TileAnchor = {
				showZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom, hideZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex + 1].minZoom
				, xx: left, yy: 0, ww: width, hh: mixm.mixerHeight(), content: [], id: 'barGrid' + (ii + Math.random())
			};
			this.zoomGridAnchor.content.push(barGridAnchor);
			let barTracksAnchor: TileAnchor = {
				showZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom, hideZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex + 1].minZoom
				, xx: left, yy: 0, ww: width, hh: mixm.mixerHeight(), content: [], id: 'barTrack' + (ii + Math.random())
			};
			this.zoomTracksAnchor.content.push(barTracksAnchor);
			let barFirstAnchor: TileAnchor = {
				showZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom, hideZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex + 1].minZoom 
				, xx: left, yy: 0, ww: width, hh: mixm.mixerHeight(), content: [], id: 'barFirst' + (ii + Math.random())
			};
			this.zoomFirstAnchor.content.push(barFirstAnchor);

			let mixBar = new MixerBar(ii, left, width, this.zoomLevelIndex
				, barGridAnchor
				, barTracksAnchor
				, barFirstAnchor
				, data);
			this.bars.push(mixBar);
			left = left + width;
		}
		let titleLabel: TileText = { x: 0, y: mixm.gridTop()-zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom*2, text: data.title, css: 'titleLabel' + zoomPrefixLevelsCSS[this.zoomLevelIndex].prefix };
		this.zoomGridAnchor.content.push(titleLabel);

		if (this.zoomLevelIndex < 4) {
			for (let ss = 1; ss < data.percussions.length; ss++) {
				let line: TileRectangle = {
					x: mixm.LeftPad
					, y: mixm.samplerTop() + mixm.notePathHeight * ss
					, h: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom / 8.0
					, w: mixm.timelineWidth(), css: 'samplerRowBorder'
				};
				this.zoomGridAnchor.content.push(line);
			}
		}
	}

}
