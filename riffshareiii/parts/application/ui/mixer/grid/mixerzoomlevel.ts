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
		//cfg: MixerDataMathUtility
	) {
		//let mixm: MixerDataMath = new MixerDataMath(data);
		this.zoomGridAnchor.content = [];//this.projectTitle,this.trackTitle];
		this.zoomTracksAnchor.content = [];
		this.zoomFirstAnchor.content = [];
		this.bars = [];
		let left = globalCommandDispatcher.cfg().leftPad;
		let width = 0;
		for (let ii = 0; ii < globalCommandDispatcher.cfg().data.timeline.length; ii++) {
			let timebar = globalCommandDispatcher.cfg().data.timeline[ii];
			width = MMUtil().set(timebar.metre).duration(timebar.tempo) * globalCommandDispatcher.cfg().widthDurationRatio;

			let barGridAnchor: TileAnchor = {
				showZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom, hideZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex + 1].minZoom
				, xx: left, yy: 0, ww: width, hh: globalCommandDispatcher.cfg().wholeHeight(), content: [], id: 'barGrid' + (ii + Math.random())
			};
			this.zoomGridAnchor.content.push(barGridAnchor);
			let barTracksAnchor: TileAnchor = {
				showZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom, hideZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex + 1].minZoom
				, xx: left, yy: 0, ww: width, hh: globalCommandDispatcher.cfg().wholeHeight(), content: [], id: 'barTrack' + (ii + Math.random())
			};
			this.zoomTracksAnchor.content.push(barTracksAnchor);
			let barFirstAnchor: TileAnchor = {
				showZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom, hideZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex + 1].minZoom
				, xx: left, yy: 0, ww: width, hh: globalCommandDispatcher.cfg().wholeHeight(), content: [], id: 'barFirst' + (ii + Math.random())
			};
			this.zoomFirstAnchor.content.push(barFirstAnchor);

			let mixBar = new MixerBar(ii, left, width, this.zoomLevelIndex
				, barGridAnchor
				, barTracksAnchor
				, barFirstAnchor
			);
			this.bars.push(mixBar);
			left = left + width;
		}
		/*
		let titleLabel: TileText = {
			x: 0
			//, y: globalCommandDispatcher.cfg().gridTop() - zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom * 2
			, y: globalCommandDispatcher.cfg().heightOfTitle()
			, text: globalCommandDispatcher.cfg().data.title
			, css: 'titleLabel' + zoomPrefixLevelsCSS[this.zoomLevelIndex].prefix
		};
		this.zoomGridAnchor.content.push(titleLabel);
		*/
		this.addDrumLines();

		this.addGridLines(this.zoomGridAnchor);//zoomLevel, left, top, width, height, data, barIdx, octaveIdx);
		this.addCommentLines();
	}
	addDrumLines() {
		/*	if (this.zoomLevelIndex < 4) {
				for (let ss = 1; ss < globalCommandDispatcher.cfg().data.percussions.length; ss++) {
					let line: TileRectangle = {
						x: globalCommandDispatcher.cfg().leftPad
						, y: globalCommandDispatcher.cfg().samplerTop() + globalCommandDispatcher.cfg().notePathHeight * ss
						, h: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom / 8.0
						, w: globalCommandDispatcher.cfg().timelineWidth(), css: 'samplerRowBorder'
					};
					this.zoomGridAnchor.content.push(line);
				}
			}*/
	}
	addCommentLines() {
		/*if (this.zoomLevelIndex < 3) {
			for (let ss = 0; ss <= globalCommandDispatcher.cfg().maxCommentRowCount; ss++) {
				let line: TileRectangle = {
					x: globalCommandDispatcher.cfg().leftPad
					, y: globalCommandDispatcher.cfg().gridTop() + globalCommandDispatcher.cfg().notePathHeight * (ss + 1)
					, h: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom / 32.0
					, w: globalCommandDispatcher.cfg().timelineWidth(), css: 'interActiveGridLine'
				};
				this.zoomGridAnchor.content.push(line);
			}
		}*/
	}
	addGridLines(barOctaveAnchor: TileAnchor//, data: Zvoog_Project
		//, cfg: MixerDataMathUtility
	) {
		//let mixm: MixerDataMath = new MixerDataMath(data);
		if (this.zoomLevelIndex < 6) {
			for (let oo = 0; oo < globalCommandDispatcher.cfg().drawOctaveCount(); oo++) {
				if (oo > 0) {
					let octaveBottomBorder: TileRectangle = {
						x: globalCommandDispatcher.cfg().leftPad
						, y: globalCommandDispatcher.cfg().gridTop() + oo * 12 * globalCommandDispatcher.cfg().notePathHeight
						, w: globalCommandDispatcher.cfg().timelineWidth()
						, h: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom / 32.0
						, css: 'octaveBottomBorder'
					};
					barOctaveAnchor.content.push(octaveBottomBorder);
				}
				if (this.zoomLevelIndex < globalCommandDispatcher.cfg().zoomEditSLess) {
					for (let kk = 1; kk < 12; kk++) {
						//let yy = globalCommandDispatcher.cfg().gridTop() + (oo * 12 + kk) * globalCommandDispatcher.cfg().notePathHeight;
						/*let need = false;
						if (globalCommandDispatcher.cfg().data.focus) {
							if (globalCommandDispatcher.cfg().data.focus == 1) {
								if (oo * 12 + kk > 12 * globalCommandDispatcher.cfg().octaveCount - globalCommandDispatcher.cfg().data.percussions.length * 2 - 2) {
									if (!((oo * 12 + kk) % 2)) {
										need = true;
									}
								}
							} else {
								if (globalCommandDispatcher.cfg().data.focus == 2) {
									if (oo * 12 + kk <= globalCommandDispatcher.cfg().maxAutomationsCount) {
										need = true;
									}
								} else {
									if (oo * 12 + kk < 2 + globalCommandDispatcher.cfg().maxCommentRowCount) {
										need = true;
									}
								}
							}
						} else {
							need = true;
						}
						if (need) {*/
						barOctaveAnchor.content.push({
							x: globalCommandDispatcher.cfg().leftPad
							, y: globalCommandDispatcher.cfg().gridTop() + (oo * 12 + kk) * globalCommandDispatcher.cfg().notePathHeight
							, w: globalCommandDispatcher.cfg().timelineWidth()
							, h: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom / 32.0
							, css: 'interActiveGridLine'
						});
						//}
					}
				}
			}

			for (let pp = 1; pp < globalCommandDispatcher.cfg().data.percussions.length; pp++) {
				barOctaveAnchor.content.push({
					x: globalCommandDispatcher.cfg().leftPad
					, y: globalCommandDispatcher.cfg().samplerTop() + pp * globalCommandDispatcher.cfg().samplerDotHeight
					, w: globalCommandDispatcher.cfg().timelineWidth()
					, h: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom / 64.0
					, css: 'octaveBottomBorder'
				});
			}
			for (let aa = 1; aa < globalCommandDispatcher.cfg().data.filters.length; aa++) {
				barOctaveAnchor.content.push({
					x: globalCommandDispatcher.cfg().leftPad
					, y: globalCommandDispatcher.cfg().automationTop() + aa * globalCommandDispatcher.cfg().autoPointHeight
					, w: globalCommandDispatcher.cfg().timelineWidth()
					, h: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom / 64.0
					, css: 'octaveBottomBorder'
				});
			}
			if (this.zoomLevelIndex < globalCommandDispatcher.cfg().zoomEditSLess) {
				//let ratio = globalCommandDispatcher.cfg().textZoomRatio(this.zoomLevelIndex);
				//console.log(this.zoomLevelIndex, ratio);
				for (let tt = 0; tt <= globalCommandDispatcher.cfg().maxCommentRowCount; tt++) {
					barOctaveAnchor.content.push({
						x: globalCommandDispatcher.cfg().leftPad
						, y: globalCommandDispatcher.cfg().commentsTop() +  globalCommandDispatcher.cfg().commentsZoomLineY(this.zoomLevelIndex, tt)
						, w: globalCommandDispatcher.cfg().timelineWidth()
						, h: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom / 32.0
						, css: 'interActiveGridLine'
					});
				}
			}
		}
	}
}
