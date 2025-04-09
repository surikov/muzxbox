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
				minZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom, beforeZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex + 1].minZoom
				, xx: left, yy: 0, ww: width, hh: globalCommandDispatcher.cfg().wholeHeight(), content: [], id: 'barGrid' + (ii + Math.random())
			};
			this.zoomGridAnchor.content.push(barGridAnchor);
			let barTracksAnchor: TileAnchor = {
				minZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom, beforeZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex + 1].minZoom
				, xx: left, yy: 0, ww: width, hh: globalCommandDispatcher.cfg().wholeHeight(), content: [], id: 'barTrack' + (ii + Math.random())
			};
			this.zoomTracksAnchor.content.push(barTracksAnchor);
			let barFirstAnchor: TileAnchor = {
				minZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom, beforeZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex + 1].minZoom
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
	addGridLines(barOctaveAnchor: TileAnchor) {
		if (this.zoomLevelIndex < 6) {
			for (let octaveIdx = 0; octaveIdx < globalCommandDispatcher.cfg().drawOctaveCount(); octaveIdx++) {
				let octaveY = globalCommandDispatcher.cfg().gridTop() + octaveIdx * 12 * globalCommandDispatcher.cfg().notePathHeight;
				if (octaveIdx > 0) {
					let octaveBottomBorder: TileRectangle = {
						x: globalCommandDispatcher.cfg().leftPad
						, y: octaveY
						, w: globalCommandDispatcher.cfg().timelineWidth()
						, h: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom / 32.0
						, css: 'octaveBottomBorder'
					};
					barOctaveAnchor.content.push(octaveBottomBorder);
				}
				if (this.zoomLevelIndex < globalCommandDispatcher.cfg().zoomEditSLess) {
					for (let kk = 1; kk < 12; kk++) {
						let pitchY = octaveY + kk * globalCommandDispatcher.cfg().notePathHeight;
						barOctaveAnchor.content.push({
							x: globalCommandDispatcher.cfg().leftPad
							, y: pitchY//globalCommandDispatcher.cfg().gridTop() + (octaveIdx * 12 + kk) * globalCommandDispatcher.cfg().notePathHeight
							, w: globalCommandDispatcher.cfg().timelineWidth()
							, h: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom / 32.0
							, css: 'interActiveGridLine'
						});
						//console.log(this.zoomLevelIndex,octaveIdx,octaveY,kk,pitchY);
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
				for (let tt = 0; tt <= globalCommandDispatcher.cfg().maxCommentRowCount; tt++) {
					barOctaveAnchor.content.push({
						x: globalCommandDispatcher.cfg().leftPad
						, y: globalCommandDispatcher.cfg().commentsTop() + globalCommandDispatcher.cfg().commentsZoomLineY(this.zoomLevelIndex, tt)
						, w: globalCommandDispatcher.cfg().timelineWidth()
						, h: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom / 32.0
						, css: 'interActiveGridLine'
					});
				}
			}
		}
	}
}
