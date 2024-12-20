class MixerBar {
	octaves: BarOctave[];
	zoomLevel: number;
	constructor(
		barIdx: number
		, left: number
		, ww: number
		, zoomLevel: number
		, gridZoomBarAnchor: TileAnchor
		, tracksZoomBarAnchor: TileAnchor
		, firstZoomBarAnchor: TileAnchor

	) {
		let h12 = 12 * globalCommandDispatcher.cfg().notePathHeight;
		let transpose = globalCommandDispatcher.cfg().transposeOctaveCount() * 12;
		for (let oo = 0; oo < globalCommandDispatcher.cfg().drawOctaveCount(); oo++) {
			let gridOctaveAnchor: TileAnchor = {
				showZoom: zoomPrefixLevelsCSS[zoomLevel].minZoom
				, hideZoom: zoomPrefixLevelsCSS[zoomLevel + 1].minZoom
				, xx: left
				, yy: globalCommandDispatcher.cfg().gridTop() + oo * h12 - transpose
				, ww: ww
				, hh: h12, content: []
				, id: 'octaveGridz' + zoomLevel + 'b' + barIdx + 'o' + oo + 'r' + Math.random()
			};
			gridZoomBarAnchor.content.push(gridOctaveAnchor);
			let tracksOctaveAnchor: TileAnchor = {
				showZoom: zoomPrefixLevelsCSS[zoomLevel].minZoom
				, hideZoom: zoomPrefixLevelsCSS[zoomLevel + 1].minZoom
				, xx: left
				, yy: globalCommandDispatcher.cfg().gridTop() + oo * h12 - transpose
				, ww: ww
				, hh: h12, content: []
				, id: 'octaveTracks' + zoomLevel + 'b' + barIdx + 'o' + oo + 'r' + Math.random()
			};
			tracksZoomBarAnchor.content.push(tracksOctaveAnchor);
			let firstOctaveAnchor: TileAnchor = {
				showZoom: zoomPrefixLevelsCSS[zoomLevel].minZoom
				, hideZoom: zoomPrefixLevelsCSS[zoomLevel + 1].minZoom
				, xx: left
				, yy: globalCommandDispatcher.cfg().gridTop() + oo * h12 - transpose
				, ww: ww
				, hh: h12, content: []
				, id: 'octaveFirst' + zoomLevel + 'b' + barIdx + 'o' + oo + 'r' + Math.random()
			};
			firstZoomBarAnchor.content.push(firstOctaveAnchor);
			new BarOctave(
				barIdx, (globalCommandDispatcher.cfg().drawOctaveCount() - oo - 1), left, globalCommandDispatcher.cfg().gridTop() + oo * h12
				, ww, h12
				, gridOctaveAnchor
				, tracksOctaveAnchor
				, firstOctaveAnchor
				, transpose
				, zoomLevel);
			if (firstZoomBarAnchor.ww < firstOctaveAnchor.ww) {
				firstZoomBarAnchor.ww = firstOctaveAnchor.ww;
			}
			if (tracksZoomBarAnchor.ww < tracksOctaveAnchor.ww) {
				tracksZoomBarAnchor.ww = tracksOctaveAnchor.ww;
			}
		}
		if (zoomLevel < 6) {
			this.addOctaveGridSteps(barIdx, left, ww, gridZoomBarAnchor, zoomLevel);
		}
		if (zoomLevel < 7) {
			for (let pp = 0; pp < globalCommandDispatcher.cfg().data.percussions.length; pp++) {
				let drum: Zvoog_PercussionTrack = globalCommandDispatcher.cfg().data.percussions[pp];
				if (drum) {
					let measure: Zvoog_PercussionMeasure = drum.measures[barIdx];
					if (measure) {
						new SamplerBar(barIdx, pp, zoomLevel, firstZoomBarAnchor, left);
					}
				}
			}
		}
		if (zoomLevel < 7) {
			new TextComments(barIdx, left, gridZoomBarAnchor, zoomLevel);
		}
		if (zoomLevel < 7) {
			new AutomationBarContent(barIdx, left, gridZoomBarAnchor, zoomLevel);
		}
	}
	addOctaveGridSteps(
		barIdx: number
		, barLeft: number
		, width: number
		, barOctaveAnchor: TileAnchor
		, zIndex: number) {
		let zoomInfo = zoomPrefixLevelsCSS[zIndex];
		let curBar = globalCommandDispatcher.cfg().data.timeline[barIdx];
		let lineCount = 0;
		let skip: Zvoog_MetreMathType = MMUtil().set({ count: 0, part: 1 });
		barOctaveAnchor.content.push({
			x: barLeft + width
			, y: globalCommandDispatcher.cfg().gridTop()
			, w: zoomPrefixLevelsCSS[zIndex].minZoom * 0.5
			, h: globalCommandDispatcher.cfg().gridHeight()
			, css: 'barRightBorder'
		});
		barOctaveAnchor.content.push({
			x: barLeft + width
			, y: globalCommandDispatcher.cfg().samplerTop()
			, w: zoomPrefixLevelsCSS[zIndex].minZoom * 0.5
			, h: globalCommandDispatcher.cfg().samplerHeight()
			, css: 'barRightBorder'
		});
		barOctaveAnchor.content.push({
			x: barLeft + width
			, y: globalCommandDispatcher.cfg().automationTop()
			, w: zoomPrefixLevelsCSS[zIndex].minZoom * 0.5
			, h: globalCommandDispatcher.cfg().automationHeight()
			, css: 'barRightBorder'
		});
		barOctaveAnchor.content.push({
			x: barLeft + width
			, y: globalCommandDispatcher.cfg().commentsTop()
			, w: zoomPrefixLevelsCSS[zIndex].minZoom * 0.5
			, h: globalCommandDispatcher.cfg().commentsZoomHeight(zIndex)
			, css: 'barRightBorder'
		});
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
				barOctaveAnchor.content.push({
					x: xx
					, y: globalCommandDispatcher.cfg().gridTop()
					, w: line.ratio * zoomInfo.minZoom / 2
					, h: globalCommandDispatcher.cfg().gridHeight()
					, css: css
				});
				barOctaveAnchor.content.push({
					x: xx
					, y: globalCommandDispatcher.cfg().samplerTop()
					, w: line.ratio * zoomInfo.minZoom / 2
					, h: globalCommandDispatcher.cfg().samplerHeight()
					, css: css
				});
				barOctaveAnchor.content.push({
					x: xx
					, y: globalCommandDispatcher.cfg().automationTop()
					, w: line.ratio * zoomInfo.minZoom / 2
					, h: globalCommandDispatcher.cfg().automationHeight()
					, css: css
				});
				barOctaveAnchor.content.push({
					x: xx
					, y: globalCommandDispatcher.cfg().commentsTop()
					, w: line.ratio * zoomInfo.minZoom / 2
					, h: globalCommandDispatcher.cfg().commentsZoomHeight(zIndex)
					, css: css
				});
				lineCount++;
				if (lineCount >= zoomInfo.gridLines.length) {
					lineCount = 0;
				}
			}
		}
	}

}