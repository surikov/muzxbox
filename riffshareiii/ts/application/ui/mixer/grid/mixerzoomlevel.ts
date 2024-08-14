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
	reCreateBars(//data:Zvoog_Project
		cfg: MixerDataMathUtility
	) {
		//let mixm: MixerDataMath = new MixerDataMath(data);
		this.zoomGridAnchor.content = [];//this.projectTitle,this.trackTitle];
		this.zoomTracksAnchor.content = [];
		this.zoomFirstAnchor.content = [];
		this.bars = [];
		let left = cfg.leftPad;
		let width = 0;
		for (let ii = 0; ii < cfg.data.timeline.length; ii++) {
			let timebar = cfg.data.timeline[ii];
			width = MMUtil().set(timebar.metre).duration(timebar.tempo) * cfg.widthDurationRatio;

			let barGridAnchor: TileAnchor = {
				showZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom, hideZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex + 1].minZoom
				, xx: left, yy: 0, ww: width, hh: cfg.wholeHeight(), content: [], id: 'barGrid' + (ii + Math.random())
			};
			this.zoomGridAnchor.content.push(barGridAnchor);
			let barTracksAnchor: TileAnchor = {
				showZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom, hideZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex + 1].minZoom
				, xx: left, yy: 0, ww: width, hh: cfg.wholeHeight(), content: [], id: 'barTrack' + (ii + Math.random())
			};
			this.zoomTracksAnchor.content.push(barTracksAnchor);
			let barFirstAnchor: TileAnchor = {
				showZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom, hideZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex + 1].minZoom
				, xx: left, yy: 0, ww: width, hh: cfg.wholeHeight(), content: [], id: 'barFirst' + (ii + Math.random())
			};
			this.zoomFirstAnchor.content.push(barFirstAnchor);

			let mixBar = new MixerBar(ii, left, width, this.zoomLevelIndex
				, barGridAnchor
				, barTracksAnchor
				, barFirstAnchor
				, cfg);
			this.bars.push(mixBar);
			left = left + width;
		}
		let titleLabel: TileText = {
			x: 0
			//, y: cfg.gridTop() - zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom * 2
			, y: cfg.heightOfTitle()
			, text: cfg.data.title
			, css: 'titleLabel' + zoomPrefixLevelsCSS[this.zoomLevelIndex].prefix
		};
		this.zoomGridAnchor.content.push(titleLabel);
		this.addDrumLines(cfg);

		this.addGridLines(this.zoomGridAnchor, cfg);//zoomLevel, left, top, width, height, data, barIdx, octaveIdx);
		this.addCommentLines(cfg);
	}
	addDrumLines(cfg: MixerDataMathUtility) {
		/*	if (this.zoomLevelIndex < 4) {
				for (let ss = 1; ss < cfg.data.percussions.length; ss++) {
					let line: TileRectangle = {
						x: cfg.leftPad
						, y: cfg.samplerTop() + cfg.notePathHeight * ss
						, h: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom / 8.0
						, w: cfg.timelineWidth(), css: 'samplerRowBorder'
					};
					this.zoomGridAnchor.content.push(line);
				}
			}*/
	}
	addCommentLines(cfg: MixerDataMathUtility) {
		/*if (this.zoomLevelIndex < 3) {
			for (let ss = 0; ss <= cfg.maxCommentRowCount; ss++) {
				let line: TileRectangle = {
					x: cfg.leftPad
					, y: cfg.gridTop() + cfg.notePathHeight * (ss + 1)
					, h: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom / 32.0
					, w: cfg.timelineWidth(), css: 'interActiveGridLine'
				};
				this.zoomGridAnchor.content.push(line);
			}
		}*/
	}
	addGridLines(barOctaveAnchor: TileAnchor//, data: Zvoog_Project
		, cfg: MixerDataMathUtility
	) {
		//let mixm: MixerDataMath = new MixerDataMath(data);
		if (this.zoomLevelIndex < 4) {
			for (let oo = 0; oo < cfg.octaveCount; oo++) {
				if (oo > 0) {
					let octaveBottomBorder: TileRectangle = {
						x: cfg.leftPad
						, y: cfg.gridTop() + oo * 12 * cfg.notePathHeight
						, w: cfg.timelineWidth()
						, h: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom / 2.0
						, css: 'octaveBottomBorder'
					};
					barOctaveAnchor.content.push(octaveBottomBorder);
				}
				if (this.zoomLevelIndex < 3) {
					for (let kk = 1; kk < 12; kk++) {
						//let yy = cfg.gridTop() + (oo * 12 + kk) * cfg.notePathHeight;
						let need = false;
						if (cfg.data.focus) {
							if (cfg.data.focus == 1) {
								if (oo * 12 + kk > 12 * cfg.octaveCount - cfg.data.percussions.length * 2-2) {
									if (!((oo * 12 + kk) % 2)) {
										need = true;
									}
								}
							} else {
								if (cfg.data.focus == 2) {
									if (oo * 12 + kk <= cfg.maxAutomationsCount ) {
										need = true;
									}
								} else {
									if (oo * 12 + kk < 2+cfg.maxCommentRowCount ) {
										need = true;
									}
								}
							}
						} else {
							need = true;
						}
						if (need) {
							barOctaveAnchor.content.push({
								x: cfg.leftPad
								, y: cfg.gridTop() + (oo * 12 + kk) * cfg.notePathHeight
								, w: cfg.timelineWidth()
								, h: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom / 32.0
								, css: 'interActiveGridLine'
							});
						}
					}
				}
			}
		}
	}
}
