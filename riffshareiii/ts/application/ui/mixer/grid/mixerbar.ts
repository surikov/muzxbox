class MixerBar {

	octaves: BarOctave[];
	//singleBarGridAnchor: TileAnchor;
	//singleBarOtherTracksAnchor: TileAnchor;
	//singleBarFirstAnchor: TileAnchor;
	zoomLevel: number;
	//samplerRows: SamplerRows;

	constructor(
		barIdx: number
		, left: number
		, ww: number
		, zoomLevel: number
		, gridZoomBarAnchor: TileAnchor
		, tracksZoomBarAnchor: TileAnchor
		, firstZoomBarAnchor: TileAnchor
		//, data: Zvoog_Project
		//,cfg:MixerDataMathUtility
	) {
		//console.log('MixerBar',zoomLevel,left,ww,globalCommandDispatcher.cfg().data.theme.octaveCount);
		//this.zoomLevel = zoomLevel;
		//let mixm: MixerDataMath = new MixerDataMath(data);
		//this.singleBarGridAnchor = gridZoomBarAnchor;
		//this.singleBarOtherTracksAnchor = tracksZoomBarAnchor;
		//this.singleBarFirstAnchor = firstZoomBarAnchor;
		//this.octaves = [];
		let h12 = 12 * globalCommandDispatcher.cfg().notePathHeight;
		for (let oo = 0; oo < globalCommandDispatcher.cfg().octaveCount; oo++) {
			let gridOctaveAnchor: TileAnchor = {
				showZoom: zoomPrefixLevelsCSS[zoomLevel].minZoom
				, hideZoom: zoomPrefixLevelsCSS[zoomLevel + 1].minZoom
				, xx: left
				, yy: globalCommandDispatcher.cfg().gridTop() + oo * h12
				, ww: ww
				, hh: h12, content: []
				, id: 'octaveGridz' + zoomLevel + 'b' + barIdx + 'o' + oo + 'r' + Math.random()
			};
			gridZoomBarAnchor.content.push(gridOctaveAnchor);
			let tracksOctaveAnchor: TileAnchor = {
				showZoom: zoomPrefixLevelsCSS[zoomLevel].minZoom
				, hideZoom: zoomPrefixLevelsCSS[zoomLevel + 1].minZoom
				, xx: left
				, yy: globalCommandDispatcher.cfg().gridTop() + oo * h12
				, ww: ww
				, hh: h12, content: []
				, id: 'octaveTracks' + zoomLevel + 'b' + barIdx + 'o' + oo + 'r' + Math.random()
			};
			tracksZoomBarAnchor.content.push(tracksOctaveAnchor);
			let firstOctaveAnchor: TileAnchor = {
				showZoom: zoomPrefixLevelsCSS[zoomLevel].minZoom
				, hideZoom: zoomPrefixLevelsCSS[zoomLevel + 1].minZoom
				, xx: left
				, yy: globalCommandDispatcher.cfg().gridTop() + oo * h12
				, ww: ww
				, hh: h12, content: []
				, id: 'octaveFirst' + zoomLevel + 'b' + barIdx + 'o' + oo + 'r' + Math.random()
			};
			firstZoomBarAnchor.content.push(firstOctaveAnchor);
			//let bo: BarOctave = 
			new BarOctave(
				barIdx, (globalCommandDispatcher.cfg().octaveCount - oo - 1), left, globalCommandDispatcher.cfg().gridTop() + oo * h12
				, ww, h12
				, gridOctaveAnchor
				, tracksOctaveAnchor
				, firstOctaveAnchor
				, zoomLevel);
			if (firstZoomBarAnchor.ww < firstOctaveAnchor.ww) {
				firstZoomBarAnchor.ww = firstOctaveAnchor.ww;
			}
			if (tracksZoomBarAnchor.ww < tracksOctaveAnchor.ww) {
				tracksZoomBarAnchor.ww = tracksOctaveAnchor.ww;
			}
			//console.log(zoomLevel, barIdx, this.singleBarAnchor.ww, singleOctaveAnchor.ww);
			/*
						if (this.singleBarGridAnchor.ww < gridOctaveAnchor.ww) {
							this.singleBarGridAnchor.ww = gridOctaveAnchor.ww;
			
						}*/
			//this.octaves.push(bo);



		}

		if (zoomLevel < 6) {
			this.addOctaveGridSteps(barIdx,  left, ww, gridZoomBarAnchor, zoomLevel);
		}

		if (zoomLevel < 7) {
			for (let pp = 0; pp < globalCommandDispatcher.cfg().data.percussions.length; pp++) {
				let drum: Zvoog_PercussionTrack = globalCommandDispatcher.cfg().data.percussions[pp];
				if (drum) {
					let measure: Zvoog_PercussionMeasure = drum.measures[barIdx];
					if (measure) {
						new SamplerBar( barIdx, pp, zoomLevel, firstZoomBarAnchor, left);
					}
				}
			}
		}

		if (zoomLevel < 7) {
			new TextComments(barIdx,  left, gridZoomBarAnchor, zoomLevel);
		}
		if (zoomLevel < 7) {
			new AutomationBarContent(barIdx,  left, gridZoomBarAnchor, zoomLevel);
		}
	}
	addOctaveGridSteps(
		barIdx: number
		//, data: Zvoog_Project
		//,cfg:MixerDataMathUtility
		, barLeft: number
		, width: number
		//, top: number, height: number
		, barOctaveAnchor: TileAnchor
		, zIndex: number) {
		let zoomInfo = zoomPrefixLevelsCSS[zIndex];
		//console.log('MixerBar',barIdx,zoomLevel);
		let curBar = globalCommandDispatcher.cfg().data.timeline[barIdx];
		//let mixm: MixerDataMath = new MixerDataMath(data);
		let lineCount = 0;
		let skip: Zvoog_MetreMathType = MMUtil().set({ count: 0, part: 1 });
		//let barLeft = globalCommandDispatcher.cfg().LeftPad;
		let top = globalCommandDispatcher.cfg().gridTop();
		let height = globalCommandDispatcher.cfg().gridHeight();



		let barRightBorder: TileRectangle = {
			x: barLeft + width
			, y: top
			, w: zoomPrefixLevelsCSS[zIndex].minZoom * 0.5 //zoomPrefixLevelsCSS[zoomLevel].minZoom / 8.0
			, h: height
			//, rx: zoomPrefixLevelsCSS[zIndex].minZoom * 0.25
			//, ry: zoomPrefixLevelsCSS[zIndex].minZoom * 0.25
			, css: 'barRightBorder'
		};
		barOctaveAnchor.content.push(barRightBorder);
		/*
		if (globalCommandDispatcher.cfg().data.percussions.length) {
			let barSamRightBorder: TileRectangle = {
				x: barLeft + width
				, y: globalCommandDispatcher.cfg().samplerTop()
				, w: zoomPrefixLevelsCSS[zIndex].minZoom * 0.5 //zoomPrefixLevelsCSS[zoomLevel].minZoom / 8.0
				, h: globalCommandDispatcher.cfg().data.percussions.length * globalCommandDispatcher.cfg().notePathHeight
				, rx: zoomPrefixLevelsCSS[zIndex].minZoom * 0.25
				, ry: zoomPrefixLevelsCSS[zIndex].minZoom * 0.25
				, css: 'barRightBorder'
			};
			barOctaveAnchor.content.push(barSamRightBorder);
		}*/
		if (zoomInfo.gridLines.length > 0) {
			let css = 'stepPartDelimiter';
			if (zIndex < 3) {
				css = 'interactiveTimeMeasureMark';
			}
			while (true) {
				let line = zoomInfo.gridLines[lineCount];
				skip = skip.plus(line.duration).simplyfy();
				if (!skip.less(curBar.metre)) {
					break;
				}
				let xx = barLeft + skip.duration(curBar.tempo) * globalCommandDispatcher.cfg().widthDurationRatio;
				let mark: TileRectangle = {
					x: xx
					, y: top//globalCommandDispatcher.cfg().gridTop()
					, w: line.ratio * zoomInfo.minZoom / 2
					, h: height//globalCommandDispatcher.cfg().gridHeight()
					, css: css
				};
				barOctaveAnchor.content.push(mark);
				/*
				if (globalCommandDispatcher.cfg().data.percussions.length) {
					let sammark: TileRectangle = {
						x: xx
						, y: globalCommandDispatcher.cfg().samplerTop()
						, w: line.ratio * zoomInfo.minZoom / 2
						, h: globalCommandDispatcher.cfg().data.percussions.length * globalCommandDispatcher.cfg().notePathHeight
						, css: css
					};
					barOctaveAnchor.content.push(sammark);
				}*/
				/*
				let txtH=globalCommandDispatcher.cfg().maxCommentRowCount+2;
				if(zIndex==3){
					txtH=(globalCommandDispatcher.cfg().maxCommentRowCount+2)*2;
				}
				if(zIndex==4){
					txtH=(globalCommandDispatcher.cfg().maxCommentRowCount+2)*4;
				}
				if(zIndex>4){
					txtH=(globalCommandDispatcher.cfg().maxCommentRowCount+2)*8;
				}
				let txtmark: TileRectangle = {
					x: xx
					, y: globalCommandDispatcher.cfg().commentsTop()
					, w: line.ratio * zoomInfo.minZoom / 2
					, h: txtH //globalCommandDispatcher.cfg().maxCommentRowCount+2
					, css: css
				};
				barOctaveAnchor.content.push(txtmark);
				*/
				lineCount++;
				if (lineCount >= zoomInfo.gridLines.length) {
					lineCount = 0;
				}
			}
		}
	}

}