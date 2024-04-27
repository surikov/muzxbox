class OctaveContent {

	constructor(barIdx: number
		, octaveIdx: number
		, left: number, top: number, width: number, height: number
		, data: Zvoog_Project
		, barOctaveTrackAnchor: TileAnchor
		, barOctaveFirstAnchor: TileAnchor
		, zoomLevel: number) {
		if (zoomLevel < 8) {
			this.addUpperNotes(barIdx, octaveIdx, left, top, width, height, barOctaveFirstAnchor, data, zoomLevel);
			if (zoomLevel < 7) {
				this.addOtherNotes(barIdx, octaveIdx, left, top, width, height, barOctaveTrackAnchor, data);

			}
		}
	}

	addUpperNotes(barIdx: number, octaveIdx: number
		, left: number, top: number, width: number, height: number
		, barOctaveAnchor: TileAnchor, data: Zvoog_Project
		, zoomLevel: number
	) {
		if (data.tracks.length) {
			if (zoomLevel == 0) {
				this.addTrackNotes(data.tracks[0], barIdx, octaveIdx, left, top, width, height, barOctaveAnchor, data
					, 'mixNoteLine', true
				);
			} else {
				this.addTrackNotes(data.tracks[0], barIdx, octaveIdx, left, top, width, height, barOctaveAnchor, data
					, 'mixNoteLine', false
				);
			}

		}
	}
	addOtherNotes(barIdx: number, octaveIdx: number
		, left: number, top: number, width: number, height: number
		, barOctaveAnchor: TileAnchor, data: Zvoog_Project
	) {
		for (let ii = 1; ii < data.tracks.length; ii++) {
			let track = data.tracks[ii];
			this.addTrackNotes(track, barIdx, octaveIdx, left, top, width, height, barOctaveAnchor, data
				, 'mixNoteSub', false
			);
		}
	}
	addTrackNotes(track: Zvoog_MusicTrack, barIdx: number, octaveIdx: number
		, left: number, top: number, width: number, height: number
		, barOctaveAnchor: TileAnchor, data: Zvoog_Project
		, css: string, addMoreInfo: boolean
	) {
		let mixm: MixerDataMath = new MixerDataMath(data);
		let measure: Zvoog_TrackMeasure = track.measures[barIdx];
		for (let cc = 0; cc < measure.chords.length; cc++) {
			let chord: Zvoog_Chord = measure.chords[cc];
			for (let nn = 0; nn < chord.notes.length; nn++) {
				let note: Zvoog_Note = chord.notes[nn];
				let from = octaveIdx * 12;
				let to = (octaveIdx + 1) * 12;
				if (note.pitch >= from && note.pitch < to) {
					let x1 = left + MMUtil().set(chord.skip).duration(data.timeline[barIdx].tempo) * mixm.widthDurationRatio;
					let y1 = top + height - (note.pitch - from) * mixm.notePathHeight;
					let slidearr = note.slides;
					/*if (slidearr.length > 1) {
						console.log(track.title, barIdx, slidearr);
					}*/
					for (let ss = 0; ss < slidearr.length; ss++) {
						//if (ss > 2) break;
						let x2 = x1 + MMUtil().set(slidearr[ss].duration).duration(data.timeline[barIdx].tempo) * mixm.widthDurationRatio;
						let y2 = y1 + slidearr[ss].delta * mixm.notePathHeight;
						let r_x1 = x1 + mixm.notePathHeight / 2;
						if (ss > 0) {
							r_x1 = x1;
						}
						let r_x2 = x2 - mixm.notePathHeight / 2;
						if (ss < slidearr.length - 1) {
							r_x2 = x2;
						}
						if (r_x2 - r_x1 < mixm.notePathHeight / 2) {
							r_x2 = r_x1 + 0.000001;
						}
						if (barOctaveAnchor.ww < r_x2 - barOctaveAnchor.xx) {
							barOctaveAnchor.ww = r_x2 - barOctaveAnchor.xx
						}
						let line: TileLine = {
							x1: r_x1
							, y1: y1 - mixm.notePathHeight / 2
							, x2: r_x2
							, y2: y2 - mixm.notePathHeight / 2
							, css: css
						};
						//if (slidearr.length > 1) {
						//	console.log(slidearr[ss], x1, x2, line);
						//}
						barOctaveAnchor.content.push(line);
						/*if (slidearr.length > 1) {
							console.log(line);
						}*/
						if (addMoreInfo && ss == 0) {
							let txt = '' + (barIdx + 1)
								+ ':' + chord.skip.count + '/' + chord.skip.part
								+ '(' + note.pitch
								+ '-' + slidearr[0].duration.count + '/' + slidearr[0].duration.part
								+ ')';
							let info: TileText = { x: x1, y: y1 + 0.25, text: txt, css: 'timeBarNum025' };
							barOctaveAnchor.content.push(info);
						}
						x1 = x2;
						y1 = y2;
					}
				}
			}
		}
	}
}