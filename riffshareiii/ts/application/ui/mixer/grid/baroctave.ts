class BarOctave {
	barRightBorder: TileRectangle;
	octaveBottomBorder: TileRectangle;
	constructor(barIdx: number, octaveIdx: number, left: number, top: number, width: number, height: number, barOctaveAnchor: TileAnchor
		//, prefix: string, minZoom: number, maxZoom: number, data: MZXBX_Project
		, zoomLevel: number, data: MZXBX_Project
	) {
		//let mixm: MixerDataMath = new MixerDataMath(data);
		//let oRectangle = { x: left, y: top, w: width, h: height, rx: 1, ry: 1, css: 'mixFieldBg' + prefix };
		if (zoomLevel < 5) {
			this.addLines(barOctaveAnchor, zoomLevel, left, top, width, height, data, barIdx);
		}
		if (zoomLevel < 7) {
			this.addNotes(barIdx, octaveIdx, left, top, width, height, barOctaveAnchor, zoomLevel, data);
		}
	}
	addLines(barOctaveAnchor: TileAnchor, zoomLevel: number, left: number, top: number, width: number, height: number
		, data: MZXBX_Project, barIdx: number) {
		this.addOctaveGridSteps(barIdx, data, left
			, barOctaveAnchor, zoomLevel);
		let mixm: MixerDataMath = new MixerDataMath(data);
		this.barRightBorder = {
			x: left + width
			, y: top
			, w: zoomPrefixLevelsCSS[zoomLevel].minZoom * 0.25 //zoomPrefixLevelsCSS[zoomLevel].minZoom / 8.0
			, h: height
			, css: 'mixPanelFill'
		};
		barOctaveAnchor.content.push(this.barRightBorder);
		this.octaveBottomBorder = {
			x: left
			, y: top + height
			, w: width
			, h: zoomPrefixLevelsCSS[zoomLevel].minZoom / 16.0
			, css: 'mixToolbarFill'
		};

		//let oAnchor = { xx: left, yy: top, ww: width, hh: height, showZoom: minZoom, hideZoom: maxZoom, content: [oRectangle] };
		//anchor.content.push(oAnchor);
		//console.log(left,top,prefix,minZoom,maxZoom);

		barOctaveAnchor.content.push(this.octaveBottomBorder);
		if (zoomLevel < 3) {
			for (let kk = 1; kk < 12; kk++) {
				barOctaveAnchor.content.push({
					x: left
					, y: top + height - kk * mixm.notePathHeight
					, w: width
					, h: zoomPrefixLevelsCSS[zoomLevel].minZoom / 64.0
					, css: 'mixToolbarFill'
				});
			}
		}
	}
	addOctaveGridSteps(barIdx: number, data: MZXBX_Project, barLeft: number
		, barOctaveAnchor: TileAnchor, zIndex: number) {
		let zoomInfo = zoomPrefixLevelsCSS[zIndex];
		if (zoomInfo.gridLines.length > 0) {
			let curBar = data.timeline[barIdx];
			let mixm: MixerDataMath = new MixerDataMath(data);
			let lineCount = 0;
			let skip: MZXBX_MetreMathType = MZMM().set({ count: 0, part: 1 });
			while (true) {
				let line = zoomInfo.gridLines[lineCount];
				skip = skip.plus(line.duration).simplyfy();
				if (!skip.less(curBar.metre)) {
					break;
				}
				let xx = barLeft + skip.duration(curBar.tempo) * mixm.widthDurationRatio;
				let mark: TileRectangle = {
					x: xx
					, y: mixm.gridTop()
					, w: line.ratio * zoomInfo.minZoom / 2
					, h: mixm.gridHeight()
					, css: 'timeMeasureMark'
				};
				barOctaveAnchor.content.push(mark);
				lineCount++;
				if (lineCount >= zoomInfo.gridLines.length) {
					lineCount = 0;
				}
			}
		}
	}
	addNotes(barIdx: number, octaveIdx: number, left: number, top: number, width: number, height: number
		, barOctaveAnchor: TileAnchor, zoomLevel: number, data: MZXBX_Project) {
		let mixm: MixerDataMath = new MixerDataMath(data);
		for (let ii = 0; ii < data.tracks.length; ii++) {
			let track = data.tracks[ii];
			if (ii > 0) {
				let measure: MZXBX_TrackMeasure = track.measures[barIdx];
				for (let cc = 0; cc < measure.chords.length; cc++) {
					let chord: MZXBX_Chord = measure.chords[cc];
					for (let nn = 0; nn < chord.notes.length; nn++) {
						let note: MZXBX_Note = chord.notes[nn];
						let from = octaveIdx * 12;
						let to = (octaveIdx + 1) * 12;
						if (note.pitch >= from && note.pitch < to) {
							let x1 = left + MZMM().set(chord.skip).duration(data.timeline[barIdx].tempo) * mixm.widthDurationRatio;
							let y1 = top + height - (note.pitch - from) * mixm.notePathHeight;
							for (let ss = 0; ss < note.slides.length; ss++) {
								let x2 = x1
									+ MZMM()
										.set(note.slides[ss].duration)
										.duration(data.timeline[barIdx].tempo)
									* mixm.widthDurationRatio;
								let y2 = y1 + note.slides[ss].delta * mixm.notePathHeight;
								let rx1 = x1 + mixm.notePathHeight / 2;
								let rx2 = x2 - mixm.notePathHeight / 2;
								if (rx2 - rx1 < 0.00001) {
									rx2 = rx1 + 0.00001;
								}
								if (barOctaveAnchor.ww < rx2 - barOctaveAnchor.xx) {
									barOctaveAnchor.ww = rx2 - barOctaveAnchor.xx
								}
								let line: TileLine = {
									x1: rx1
									, y1: y1 - mixm.notePathHeight / 2
									, x2: rx2
									, y2: y2 - mixm.notePathHeight / 2
									, css: 'mixNoteSub'
								};
								barOctaveAnchor.content.push(line);
								x1 = x2;
								y1 = y2;
							}
						}
					}
				}
			}
		}
		for (let ii = 0; ii < data.tracks.length; ii++) {
			let track = data.tracks[ii];
			if (ii == 0) {
				let measure: MZXBX_TrackMeasure = track.measures[barIdx];
				for (let cc = 0; cc < measure.chords.length; cc++) {
					let chord: MZXBX_Chord = measure.chords[cc];
					for (let nn = 0; nn < chord.notes.length; nn++) {
						let note: MZXBX_Note = chord.notes[nn];
						let from = octaveIdx * 12;
						let to = (octaveIdx + 1) * 12;
						if (note.pitch >= from && note.pitch < to) {
							let x1 = left + MZMM().set(chord.skip).duration(data.timeline[barIdx].tempo) * mixm.widthDurationRatio;
							let y1 = top + height - (note.pitch - from) * mixm.notePathHeight;
							for (let ss = 0; ss < note.slides.length; ss++) {
								let x2 = x1 + MZMM().set(note.slides[ss].duration)
									.duration(data.timeline[barIdx].tempo)
									* mixm.widthDurationRatio;
								let y2 = y1 + note.slides[ss].delta * mixm.notePathHeight;
								let rx1 = x1 + mixm.notePathHeight / 2;
								let rx2 = x2 - mixm.notePathHeight / 2;
								if (rx2 - rx1 < 0.00001) {
									rx2 = rx1 + 0.00001;
								}
								let line: TileLine = {
									x1: rx1
									, y1: y1 - mixm.notePathHeight / 2
									, x2: rx2
									, y2: y2 - mixm.notePathHeight / 2
									, css: 'mixNoteLine'
								};
								barOctaveAnchor.content.push(line);
								x1 = x2;
								y1 = y2;
							}
						}
					}
				}
			}
		}
	}
}