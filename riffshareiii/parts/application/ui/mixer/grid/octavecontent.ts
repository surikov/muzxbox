class OctaveContent {
	constructor(barIdx: number
		, octaveIdx: number
		, left: number, top: number, width: number, height: number
		, barOctaveTrackAnchor: TileAnchor
		, barOctaveFirstAnchor: TileAnchor
		, transpose: number
		, zoomLevel: number) {
		if (zoomLevel < 8) {
			this.addUpperNotes(barIdx, octaveIdx, left, top, width, height, barOctaveFirstAnchor, transpose, zoomLevel);
			if (zoomLevel < 7) {
				this.addOtherNotes(barIdx, octaveIdx, left, top, width, height, barOctaveTrackAnchor, transpose, zoomLevel);
			}
		}
	}
	addUpperNotes(barIdx: number, octaveIdx: number
		, left: number, top: number, width: number, height: number
		, barOctaveAnchor: TileAnchor//, data: Zvoog_Project
		, transpose: number
		, zoomLevel: number
	) {
		if (globalCommandDispatcher.cfg().data.tracks.length) {
			let track = globalCommandDispatcher.cfg().data.tracks[0];
			let css = 'mixNoteLine';
			this.addTrackNotes(track, barIdx, octaveIdx, left, top, width, height, barOctaveAnchor, transpose, css, true, zoomLevel);
		}
	}
	addOtherNotes(barIdx: number, octaveIdx: number
		, left: number, top: number, width: number, height: number
		, barOctaveAnchor: TileAnchor//, data: Zvoog_Project
		, transpose: number
		, zoomLevel: number
	) {
		for (let ii = 1; ii < globalCommandDispatcher.cfg().data.tracks.length; ii++) {
			let track = globalCommandDispatcher.cfg().data.tracks[ii];
			this.addTrackNotes(track, barIdx, octaveIdx, left, top, width, height, barOctaveAnchor, transpose, 'mixNoteSub', false, zoomLevel);
		}
	}
	addTrackNotes(track: Zvoog_MusicTrack, barIdx: number, octaveIdx: number
		, left: number, top: number, width: number, height: number
		, barOctaveAnchor: TileAnchor
		, transpose: number
		, css: string
		, interact: boolean, zoomLevel: number
	) {
		if (!track.measures[barIdx]) {
			//globalCommandDispatcher.adjustTimeline();
			console.log('addTrackNotes not found',barIdx,'for track',track.title);
			return;
		}
		let measure: Zvoog_TrackMeasure = track.measures[barIdx];
		if (measure) {

			for (let cc = 0; cc < measure.chords.length; cc++) {
				let chord: Zvoog_Chord = measure.chords[cc];
				for (let nn = 0; nn < chord.pitches.length; nn++) {
					let from = octaveIdx * 12;
					let to = (octaveIdx + 1) * 12;
					if (chord.pitches[nn] >= from && chord.pitches[nn] < to) {
						let xStart = left + MMUtil().set(chord.skip).duration(globalCommandDispatcher.cfg().data.timeline[barIdx].tempo) * globalCommandDispatcher.cfg().widthDurationRatio;
						let yStart = top + height - (chord.pitches[nn] - from + transpose) * globalCommandDispatcher.cfg().notePathHeight;
						let x1 = xStart;
						let y1 = yStart;
						for (let ss = 0; ss < chord.slides.length; ss++) {
							let x2 = x1 + MMUtil().set(chord.slides[ss].duration).duration(globalCommandDispatcher.cfg().data.timeline[barIdx].tempo) * globalCommandDispatcher.cfg().widthDurationRatio;
							let y2 = yStart - chord.slides[ss].delta * globalCommandDispatcher.cfg().notePathHeight;
							let r_x1 = x1 + globalCommandDispatcher.cfg().notePathHeight / 2;
							if (ss > 0) {
								r_x1 = x1;
							}
							let r_x2 = x2 - globalCommandDispatcher.cfg().notePathHeight / 2;
							if (ss < chord.slides.length - 1) {
								r_x2 = x2;
							}
							if (r_x2 - r_x1 < globalCommandDispatcher.cfg().notePathHeight / 2) {
								r_x2 = r_x1 + 0.000001;
							}
							if (barOctaveAnchor.ww < r_x2 - barOctaveAnchor.xx) {
								barOctaveAnchor.ww = r_x2 - barOctaveAnchor.xx
							}
							let line: TileLine = {
								x1: r_x1
								, y1: y1 - globalCommandDispatcher.cfg().notePathHeight / 2
								, x2: r_x2
								, y2: y2 - globalCommandDispatcher.cfg().notePathHeight / 2
								, css: css
							};
							barOctaveAnchor.content.push(line);
							x1 = x2;
							y1 = y2;
						}
						if (interact) {
							if (zoomLevel < globalCommandDispatcher.cfg().zoomEditSLess) {
								/*
								let inetrDot: TileRectangle = {
									x: xStart + globalCommandDispatcher.cfg().notePathHeight / 4
									, y: yStart - globalCommandDispatcher.cfg().notePathHeight * 3 / 4
									, w: globalCommandDispatcher.cfg().notePathHeight / 2
									, h: globalCommandDispatcher.cfg().notePathHeight / 2
									, rx: globalCommandDispatcher.cfg().notePathHeight / 4
									, ry: globalCommandDispatcher.cfg().notePathHeight / 4
									, css: 'mixDropNote'
								};
								barOctaveAnchor.content.push(inetrDot);
								*/
								let yShift = 0.24;
								let xShift = 0.20;
								if (zoomLevel < 2) {
									yShift = 0.29;
									xShift = 0.29;
								}
								if (zoomLevel < 1) {
									yShift = 0.37;
									xShift = 0.37;
								}
								let deleteIcon: TileText = {
									x: xStart + xShift
									, y: yStart - yShift
									, text: icon_close_circle
									, css: 'samplerDrumDeleteIcon samplerDrumDeleteSize' + zoomLevel
								};
								barOctaveAnchor.content.push(deleteIcon);
								let slideClick: TileRectangle = {
									x: x1 - globalCommandDispatcher.cfg().notePathHeight
									, y: y1 - globalCommandDispatcher.cfg().notePathHeight
									, w: globalCommandDispatcher.cfg().notePathHeight
									, h: globalCommandDispatcher.cfg().notePathHeight
									, rx: globalCommandDispatcher.cfg().notePathHeight / 2
									, ry: globalCommandDispatcher.cfg().notePathHeight / 2
									, css: 'mixDropClick'
									, activation: (x: number, y: number) => {
										//let start = globalCommandDispatcher.cfg().gridTop() + globalCommandDispatcher.cfg().gridHeight();

										//let pitch = (start - y1) / globalCommandDispatcher.cfg().notePathHeight;
										globalCommandDispatcher.cfg().slidemark = {
											barIdx: barIdx
											, chord: chord
											, pitch: chord.pitches[nn]
											//, delta: chord.slides[chord.slides.length-1].delta
										};
										//console.log('start slide', x, y, globalCommandDispatcher.cfg().slidermark);
										globalCommandDispatcher.resetProject();
									}
								};
								barOctaveAnchor.content.push(slideClick);
								let slideDot: TileRectangle = {
									x: x1 - globalCommandDispatcher.cfg().notePathHeight * 5 / 8
									, y: y1 - globalCommandDispatcher.cfg().notePathHeight * 5 / 8
									, w: globalCommandDispatcher.cfg().notePathHeight / 4
									, h: globalCommandDispatcher.cfg().notePathHeight / 4
									, rx: globalCommandDispatcher.cfg().notePathHeight / 8
									, ry: globalCommandDispatcher.cfg().notePathHeight / 8
									, css: 'mixDropNote'
								};
								barOctaveAnchor.content.push(slideDot);
							}
						}
					}
				}
			}
		} else {
			console.log('addTrackNotes no measure', barIdx, track);
		}
	}
}