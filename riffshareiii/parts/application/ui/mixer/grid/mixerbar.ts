class MixerBar {
	octaves: BarOctaveRender[];
	zoomLevel: number;
	constructor(
		barIdx: number
		, left: number
		, ww: number
		, zoomLevel: number
		, gridZoomBarAnchor: TileAnchor
		, tracksZoomBarAnchor: TileAnchor
		, firstZoomBarAnchor: TileAnchor
		//, durationLen: number

	) {
		//let durationLen = 1 * globalCommandDispatcher.cfg().widthDurationRatio;
		let h12 = 12 * globalCommandDispatcher.cfg().notePathHeight;
		let transpose = globalCommandDispatcher.cfg().transposeOctaveCount() * 12;
		if (zoomLevel < globalCommandDispatcher.cfg().zoomEditSLess) {
			let interpane: TileRectangle = {
				x: gridZoomBarAnchor.xx
				, y: globalCommandDispatcher.cfg().gridTop()
				, w: gridZoomBarAnchor.ww
				, h: globalCommandDispatcher.cfg().gridHeight()
				//, rx: barOctaveAnchor.ww / 2
				//, ry: globalCommandDispatcher.cfg().data.filters.length*globalCommandDispatcher.cfg().autoPointHeight / 2
				, css: 'commentPaneForClick'
				, activation: (x: number, y: number) => { this.trackCellClick(barIdx, x, y, zoomLevel); }
			};
			gridZoomBarAnchor.content.push(interpane);
		}

		for (let oo = globalCommandDispatcher.cfg().transposeOctaveCount(); oo < globalCommandDispatcher.cfg().drawOctaveCount(); oo++) {
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
			new BarOctaveRender(
				barIdx, (globalCommandDispatcher.cfg().drawOctaveCount() - oo - 1), left, globalCommandDispatcher.cfg().gridTop() + oo * h12
				, ww, h12
				, gridOctaveAnchor
				, tracksOctaveAnchor
				, firstOctaveAnchor
				, transpose
				, zoomLevel);
			//console.log('BarOctave',zoomLevel,(globalCommandDispatcher.cfg().drawOctaveCount() - oo - 1));
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
				let durationLen: number = this.findDurationOfSample(drum.sampler.id) * globalCommandDispatcher.cfg().widthDurationRatio;
				if (drum) {
					let measure: Zvoog_PercussionMeasure = drum.measures[barIdx];
					if (measure) {
						new SamplerBar(barIdx, pp, zoomLevel, firstZoomBarAnchor, left, durationLen);
					}
				}
			}
		}
		if (zoomLevel < 7) {
			new TextCommentsBar(barIdx, left, gridZoomBarAnchor, zoomLevel);
		}
		if (zoomLevel < 7) {
			new AutomationBarContent(barIdx, left, gridZoomBarAnchor, zoomLevel);
		}
	}
	findDurationOfSample(samplerId: string): number {
		if (globalCommandDispatcher.player) {
			let arr = globalCommandDispatcher.player.allPerformersSamplers();
			//console.log('findDurationOfSample', samplerId,arr);
			for (let ii = 0; ii < arr.length; ii++) {
				if (arr[ii].channelId == samplerId) {
					try {
						let pluginImplementation = arr[ii].plugin as any;// as MZXBX_AudioSamplerPlugin;
						//console.log('findDurationOfSample',smplr.duration(),'for', samplerId);
						//return smplr.duration();
						if (pluginImplementation.duration) {
							return pluginImplementation.duration();
						} else {
							return 0.0001;
						}
					} catch (xxx) {
						console.log(xxx);
						return 0.0002;
					}
				}
			}
		}
		//console.log('findDurationOfSample unknown for', samplerId);
		return 0.0001;
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
			, w: zoomPrefixLevelsCSS[zIndex].minZoom * 0.8
			, h: globalCommandDispatcher.cfg().gridHeight()
			, css: 'barRightBorder'
		});
		barOctaveAnchor.content.push({
			x: barLeft + width
			, y: globalCommandDispatcher.cfg().samplerTop()
			, w: zoomPrefixLevelsCSS[zIndex].minZoom * 0.8
			, h: globalCommandDispatcher.cfg().samplerHeight()
			, css: 'barRightBorder'
		});
		barOctaveAnchor.content.push({
			x: barLeft + width
			, y: globalCommandDispatcher.cfg().automationTop()
			, w: zoomPrefixLevelsCSS[zIndex].minZoom * 0.8
			, h: globalCommandDispatcher.cfg().automationHeight()
			, css: 'barRightBorder'
		});

		if (zoomInfo.gridLines.length > 0) {
			let css = 'stepPartDelimiter';
			if (zIndex < globalCommandDispatcher.cfg().zoomEditSLess) {
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
					, w: line.ratio * zoomInfo.minZoom / 4
					, h: globalCommandDispatcher.cfg().gridHeight()
					, css: css
				});
				barOctaveAnchor.content.push({
					x: xx
					, y: globalCommandDispatcher.cfg().samplerTop()
					, w: line.ratio * zoomInfo.minZoom / 4
					, h: globalCommandDispatcher.cfg().samplerHeight()
					, css: css
				});
				barOctaveAnchor.content.push({
					x: xx
					, y: globalCommandDispatcher.cfg().automationTop()
					, w: line.ratio * zoomInfo.minZoom / 4
					, h: globalCommandDispatcher.cfg().automationHeight()
					, css: css
				});
				if (zIndex < globalCommandDispatcher.cfg().zoomEditSLess) {
					barOctaveAnchor.content.push({
						x: xx
						, y: globalCommandDispatcher.cfg().commentsTop()
						, w: line.ratio * zoomInfo.minZoom / 4
						, h: globalCommandDispatcher.cfg().commentsZoomHeight(zIndex)
						, css: css
					});
				}
				lineCount++;
				if (lineCount >= zoomInfo.gridLines.length) {
					lineCount = 0;
				}
			}
			if (zIndex < globalCommandDispatcher.cfg().zoomEditSLess) {
				let xx = barLeft + skip.duration(curBar.tempo) * globalCommandDispatcher.cfg().widthDurationRatio;
				let line = zoomInfo.gridLines[lineCount];
				barOctaveAnchor.content.push({
					x: xx
					, y: globalCommandDispatcher.cfg().commentsTop()
					, w: line.ratio * zoomInfo.minZoom / 4
					, h: globalCommandDispatcher.cfg().commentsZoomHeight(zIndex)
					, css: css
				});
			}
		}
	}
	trackCellClick(barIdx: number, barX: number, yy: number, zz: number) {
		console.log('trackCellClick',barIdx, barX, yy, zz);
	}

}