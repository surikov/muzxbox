class BarOctave {
	barRightBorder: TileRectangle;
	octaveBottomBorder: TileRectangle;
	constructor(barIdx: number, octaveIdx: number, left: number, top: number, width: number, height: number, anchor: TileAnchor
		//, prefix: string, minZoom: number, maxZoom: number, data: MZXBX_Project
		, zoomLevel: number, data: MZXBX_Project
	) {
		//let mixm: MixerDataMath = new MixerDataMath(data);
		//let oRectangle = { x: left, y: top, w: width, h: height, rx: 1, ry: 1, css: 'mixFieldBg' + prefix };
		this.barRightBorder = {
			x: left + width
			, y: top
			, w: zoomPrefixLevelsCSS[zoomLevel].minZoom / 8.0
			, h: height - 1.5
			, css: 'mixPanelFill'
		};
		this.octaveBottomBorder = {
			x: left
			, y: top + height
			, w: width - 1.5
			, h: zoomPrefixLevelsCSS[zoomLevel].minZoom / 8.0
			, css: 'mixToolbarFill'
		};
		//let oAnchor = { xx: left, yy: top, ww: width, hh: height, showZoom: minZoom, hideZoom: maxZoom, content: [oRectangle] };
		//anchor.content.push(oAnchor);
		//console.log(left,top,prefix,minZoom,maxZoom);
		anchor.content.push(this.barRightBorder);
		anchor.content.push(this.octaveBottomBorder);
		if (zoomLevel <= 16) {
			this.addNotes(barIdx, octaveIdx, left, top, width, height, anchor, zoomLevel, data);
		}
	}
	addNotes(barIdx: number, octaveIdx: number, left: number, top: number, width: number, height: number, anchor: TileAnchor, zoomLevel: number, data: MZXBX_Project) {
		//let mixm: MixerDataMath = new MixerDataMath(data);
		for (let ii = 0; ii < data.tracks.length; ii++) {
			let track = data.tracks[ii];
			if (ii == 0) {
				//let txt: TileText = { x: left, y: top + height, text: '' + barIdx + ':' + octaveIdx, css: 'testMeasureLabel' };
				//anchor.content.push(txt);
				let measure: MZXBX_TrackMeasure = track.measures[barIdx];
				//console.log(barIdx,octaveIdx,'measure',measure);
				for (let cc = 0; cc < measure.chords.length; cc++) {
					let chord: MZXBX_Chord = measure.chords[cc];
					//console.log(cc,'chord',chord);
					for (let nn = 0; nn < chord.notes.length; nn++) {
						let note: MZXBX_Note = chord.notes[nn];
						let from = octaveIdx * 12;
						let to = (octaveIdx + 1) * 12;
						//console.log(nn,'note',note);
						if (note.pitch >= from && note.pitch < to) {
							let x = left + MZMM().set(chord.skip).duration(data.timeline[barIdx].tempo) * data.theme.widthDurationRatio;
							let y = top + height - (note.pitch - from) * data.theme.notePathHeight;
							let dot: TileRectangle = { x: x, y: y, w: data.theme.notePathHeight, h: data.theme.notePathHeight, css: 'mixTextFill' };
							//console.log(zoomLevel, 'note', chord.skip, note, dot);
							anchor.content.push(dot);
						}
					}
				}
			}
		}
	}
}