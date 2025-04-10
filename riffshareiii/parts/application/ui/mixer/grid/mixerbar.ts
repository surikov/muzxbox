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
				, activation: (x: number, y: number) => {

					this.trackCellClick(barIdx, x, y, zoomLevel);
				}
			};
			gridZoomBarAnchor.content.push(interpane);

		}

		for (let oo = globalCommandDispatcher.cfg().transposeOctaveCount(); oo < globalCommandDispatcher.cfg().drawOctaveCount(); oo++) {
			let gridOctaveAnchor: TileAnchor = {
				minZoom: zoomPrefixLevelsCSS[zoomLevel].minZoom
				, beforeZoom: zoomPrefixLevelsCSS[zoomLevel + 1].minZoom
				, xx: left
				, yy: globalCommandDispatcher.cfg().gridTop() + oo * h12 - transpose
				, ww: ww
				, hh: h12, content: []
				, id: 'octaveGridz' + zoomLevel + 'b' + barIdx + 'o' + oo + 'r' + Math.random()
			};
			gridZoomBarAnchor.content.push(gridOctaveAnchor);
			let tracksOctaveAnchor: TileAnchor = {
				minZoom: zoomPrefixLevelsCSS[zoomLevel].minZoom
				, beforeZoom: zoomPrefixLevelsCSS[zoomLevel + 1].minZoom
				, xx: left
				, yy: globalCommandDispatcher.cfg().gridTop() + oo * h12 - transpose
				, ww: ww
				, hh: h12, content: []
				, id: 'octaveTracks' + zoomLevel + 'b' + barIdx + 'o' + oo + 'r' + Math.random()
			};
			tracksZoomBarAnchor.content.push(tracksOctaveAnchor);
			let firstOctaveAnchor: TileAnchor = {
				minZoom: zoomPrefixLevelsCSS[zoomLevel].minZoom
				, beforeZoom: zoomPrefixLevelsCSS[zoomLevel + 1].minZoom
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
		let trMeasure = globalCommandDispatcher.cfg().data.tracks[0].measures[barIdx];
		//let pitch = Math.round(12 * (globalCommandDispatcher.cfg().drawOctaveCount() - globalCommandDispatcher.cfg().transposeOctaveCount()) - yy + 0);
		let pitch = Math.ceil(globalCommandDispatcher.cfg().gridHeight() - yy);
		let info: BarStepStartEnd = globalCommandDispatcher.cfg().gridClickInfo(barIdx, barX, zz);

		//console.log('trackCellClick', barIdx, pitch, muStart, muEnd);
		let mark = globalCommandDispatcher.cfg().editmark;
		//console.log('trackCellClick', mark);
		if (mark) {
			//console.log(mark, barIdx, info);
			let from = MMUtil().set(mark.skip);
			let toStart = MMUtil().set(info.start);
			let toEnd = MMUtil().set(info.end);
			let fromBar = mark.barIdx;
			let chordPitch = mark.pitch;
			let shift = pitch - mark.pitch;
			for (let ii = 0; ii < globalCommandDispatcher.cfg().data.timeline.length; ii++) {
				if (ii < mark.barIdx) {
					from.set(from.plus(globalCommandDispatcher.cfg().data.timeline[ii].metre));
				}
				if (ii < barIdx) {
					toStart.set(toStart.plus(globalCommandDispatcher.cfg().data.timeline[ii].metre));
					toEnd.set(toEnd.plus(globalCommandDispatcher.cfg().data.timeline[ii].metre));
				}
			}
			let to = MMUtil().set(toEnd);
			if (from.more(toStart)) {
				//console.log('swap');
				let newForm = toStart.metre();
				to.set(MMUtil().set(from.metre()).plus(info.end).minus(info.start));
				from.set(newForm);
				fromBar = barIdx;
				chordPitch = pitch;
				shift = mark.pitch - pitch;
			}
			let duration = to.minus(from).simplyfy();
			let skip = MMUtil().set(from);
			for (let ii = 0; ii < globalCommandDispatcher.cfg().data.timeline.length; ii++) {
				if (ii < fromBar) {
					skip.set(skip.minus(globalCommandDispatcher.cfg().data.timeline[ii].metre));
				}
			}
			let chord: Zvoog_Chord | null = null;
			let measure = globalCommandDispatcher.cfg().data.tracks[0].measures[fromBar];

			globalCommandDispatcher.exe.commitProjectChanges(['tracks', 0, 'measures', barIdx], () => {
				for (let ii = 0; ii < measure.chords.length; ii++) {
					if (MMUtil().set(measure.chords[ii].skip).equals(skip)) {
						chord = measure.chords[ii];
					}
				}
				if (chord) {
					//
				} else {
					chord = { skip: skip, pitches: [], slides: [] };
					measure.chords.push(chord);
				}
				chord.pitches.push(chordPitch + 11);
				chord.slides = [{ duration: duration, delta: shift }];
			});
			//console.log('insert', chord);
			globalCommandDispatcher.cfg().editmark = null;
		} else {
			let muStart = MMUtil().set(info.start);
			let muEnd = MMUtil().set(info.end);
			let drop = false;
			globalCommandDispatcher.exe.commitProjectChanges(['tracks', 0, 'measures', barIdx], () => {
				for (let ii = 0; ii < trMeasure.chords.length; ii++) {
					let chord = trMeasure.chords[ii];
					//console.log(ii,chord);
					if ((!muStart.more(chord.skip)) && muEnd.more(chord.skip)) {
						//console.log('found',chord);
						for (let nn = 0; nn < chord.pitches.length; nn++) {
							//console.log('check', pitch, chord);
							//console.log(yy,chord.pitches[nn], pitch,globalCommandDispatcher.cfg().gridTop(),globalCommandDispatcher.renderer.tiler.tapPxSize());
							if (chord.pitches[nn] >= pitch + 11 && chord.pitches[nn] < pitch + 11 + 1) {
								//console.log('drop #', nn);
								chord.pitches.splice(nn, 1);
								nn--;
								drop = true;
								//console.log('splice', chord);
							}
						}
					}
				}
			});
			if (!drop) {

				globalCommandDispatcher.cfg().editmark = { barIdx: barIdx, skip: muStart.metre(), pitch };
				//console.log('new mark', globalCommandDispatcher.cfg().editmark);
			}
		}
		globalCommandDispatcher.resetProject();
	}

}