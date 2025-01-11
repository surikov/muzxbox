class OctaveContent {

	constructor(barIdx: number
		, octaveIdx: number
		, left: number, top: number, width: number, height: number
		//, data: Zvoog_Project
		//, cfg: MixerDataMathUtility
		, barOctaveTrackAnchor: TileAnchor
		, barOctaveFirstAnchor: TileAnchor
		, transpose: number
		, zoomLevel: number) {
		if (zoomLevel < 8) {
			//if (globalCommandDispatcher.cfg().data.focus) {
			//
			//} else {
			this.addUpperNotes(barIdx, octaveIdx, left, top, width, height, barOctaveFirstAnchor, transpose, zoomLevel);
			//}
			if (zoomLevel < 7) {

				this.addOtherNotes(barIdx, octaveIdx, left, top, width, height, barOctaveTrackAnchor, transpose, zoomLevel);

			}
		}
	}

	addUpperNotes(barIdx: number, octaveIdx: number
		, left: number, top: number, width: number, height: number
		, barOctaveAnchor: TileAnchor//, data: Zvoog_Project
		, transpose: number
		//, cfg: MixerDataMathUtility
		, zoomLevel: number
	) {
		if (globalCommandDispatcher.cfg().data.tracks.length) {
			let track = globalCommandDispatcher.cfg().data.tracks[0];
			let css = 'mixNoteLine';
			this.addTrackNotes(track, barIdx, octaveIdx, left, top, width, height, barOctaveAnchor, transpose, css, true, zoomLevel);



			//for (let tt = 0; tt < globalCommandDispatcher.cfg().data.tracks.length; tt++) {
			//	let track = globalCommandDispatcher.cfg().data.tracks[tt];
			//	if (track.active) {
			//		let css = 'mixNoteLine';
			//if (globalCommandDispatcher.cfg().data.focus) {
			//	css = 'mixNoteSub';
			//}
			/*if (zoomLevel == 0) {
				this.addTrackNotes(track, barIdx, octaveIdx
					, left, top, width, height, barOctaveAnchor
					, css//, true
				);
			} else {
				this.addTrackNotes(track, barIdx, octaveIdx
					, left, top, width, height, barOctaveAnchor
					, css//, false
				);
			}*/
			//		this.addTrackNotes(track, barIdx, octaveIdx, left, top, width, height, barOctaveAnchor, css);
			//		break;
			//	}
			//}
		}
	}
	addOtherNotes(barIdx: number, octaveIdx: number
		, left: number, top: number, width: number, height: number
		, barOctaveAnchor: TileAnchor//, data: Zvoog_Project
		//, cfg: MixerDataMathUtility
		, transpose: number
		, zoomLevel: number
	) {
		//let start=1;
		//if (globalCommandDispatcher.cfg().data.focus) {
		//	start=0;
		//}

		for (let ii = 1; ii < globalCommandDispatcher.cfg().data.tracks.length; ii++) {
			let track = globalCommandDispatcher.cfg().data.tracks[ii];
			/*if (track.active) {
				//skip
			} else {
				this.addTrackNotes(track, barIdx, octaveIdx, left, top, width, height, barOctaveAnchor, 'mixNoteSub');
			}*/
			this.addTrackNotes(track, barIdx, octaveIdx, left, top, width, height, barOctaveAnchor, transpose, 'mixNoteSub', false, zoomLevel);
		}
	}
	addTrackNotes(track: Zvoog_MusicTrack, barIdx: number, octaveIdx: number
		, left: number, top: number, width: number, height: number
		, barOctaveAnchor: TileAnchor
		, transpose: number
		//, data: Zvoog_Project
		//, cfg: MixerDataMathUtility
		, css: string//, addMoreInfo: boolean
		, interact: boolean, zoomLevel: number
	) {
		//let mixm: MixerDataMath = new MixerDataMath(data);
		//let transpose=-2*12;
		let measure: Zvoog_TrackMeasure = track.measures[barIdx];
		//
		if (measure) {
			for (let cc = 0; cc < measure.chords.length; cc++) {
				let chord: Zvoog_Chord = measure.chords[cc];
				for (let nn = 0; nn < chord.pitches.length; nn++) {
					//let note: Zvoog_Note = chord.notes[nn];
					let from = octaveIdx * 12;
					let to = (octaveIdx + 1) * 12;
					if (chord.pitches[nn] >= from && chord.pitches[nn] < to) {
						let xStart = left + MMUtil().set(chord.skip).duration(globalCommandDispatcher.cfg().data.timeline[barIdx].tempo) * globalCommandDispatcher.cfg().widthDurationRatio;
						let yStart = top + height - (chord.pitches[nn] - from + transpose) * globalCommandDispatcher.cfg().notePathHeight;
						let x1 = xStart;
						let y1 = yStart;
						//let slidearr = note.slides;
						/*if (slidearr.length > 1) {
							console.log(track.title, barIdx, slidearr);
						}*/
						for (let ss = 0; ss < chord.slides.length; ss++) {
							//if (ss > 2) break;
							let x2 = x1 + MMUtil().set(chord.slides[ss].duration).duration(globalCommandDispatcher.cfg().data.timeline[barIdx].tempo) * globalCommandDispatcher.cfg().widthDurationRatio;
							let y2 = y1 - chord.slides[ss].delta * globalCommandDispatcher.cfg().notePathHeight;
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
							//if (slidearr.length > 1) {
							//	console.log(slidearr[ss], x1, x2, line);
							//}
							barOctaveAnchor.content.push(line);



							/*if (slidearr.length > 1) {
								console.log(line);
							}*/
							/*if (addMoreInfo && ss == 0) {
								let txt = '' + (barIdx + 1)
									+ ':' + chord.skip.count + '/' + chord.skip.part
									+ '(' + note.pitch
									+ '-' + slidearr[0].duration.count + '/' + slidearr[0].duration.part
									+ ')';
								let info: TileText = { x: x1, y: y1 + 0.25, text: txt, css: 'timeBarNum025' };
								barOctaveAnchor.content.push(info);
							}*/
							x1 = x2;
							y1 = y2;
						}
						if (interact) {
							if (zoomLevel < 3) {
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