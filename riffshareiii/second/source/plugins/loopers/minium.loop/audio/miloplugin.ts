console.log('Fader v1.0');
class MiniumLoopPlugin implements MZXBX_ActivePatternPlugin {
	chordUtil: ChordUtil = new ChordUtil();
	launch(stemtrack: Zvoog_PatternTrack, timeline: Zvoog_SongMeasure[], comments: Zvoog_CommentMeasure[]): Zvoog_Project {
		let tt: Zvoog_Project = {
			versionCode: '1'
			, title: ''
			, timeline: []
			, tracks: []
			, farorder: []
			, percussions: []
			, comments: []
			, filters: []
			, patterns: []
			, selectedPart: { startMeasure: -1, endMeasure: -1 }
			, position: { x: 0, y: 0, z: 0 }
			, list: false
			, menuPerformers: false
			, menuSamplers: false
			, menuFilters: false
			, menuActions: false
			, menuPlugins: false
			, menuClipboard: false
			, menuSettings: false
		};
		this.fillProject(stemtrack, timeline, comments, tt);
		return tt;
	}
	fillProject(stemtrack: Zvoog_PatternTrack, timeline: Zvoog_SongMeasure[], comments: Zvoog_CommentMeasure[], to: Zvoog_Project) {
		console.log('fillProject');
		let track: Zvoog_MusicTrack = {
			title: ''
			, measures: []
			, performer: {
				id: '' + Math.random()
				, data: '55/171/0'
				, kind: 'miniumpitchchord1'
				, outputs: ['']
				, iconPosition: { x: 0, y: 0 }
				, state: 0
				, hint1_128: 0
			}
		};
		let chords: { chordText: string, start: Zvoog_Metre }[] = [];
		let lines: { duration: Zvoog_Metre, start: Zvoog_Metre }[] = [];
		let point = MMUtil();
		for (let ii = 0; ii < timeline.length; ii++) {
			track.measures.push({
				chords: []
			});
			let textbar = comments[ii];
			for (let kk = 0; kk < textbar.points.length; kk++) {
				let comment = textbar.points[kk];
				if (comment.row == 0) {
					chords.push({
						chordText: comment.text
						, start: point.plus(comment.skip).metre()
					});
				}
			}
			let stembar = stemtrack.measures[ii];
			for (let kk = 0; kk < stembar.points.length; kk++) {
				let line = stembar.points[kk];
				lines.push({
					start: point.plus(line.skip).metre()
					, duration: line.duration
				});
			}
			point = point.plus(timeline[ii].metre);
		}
		chords.sort((a, b) => MMUtil().set(a.start).more(b.start) ? 1 : -1);
		lines.sort((a, b) => MMUtil().set(a.start).more(b.start) ? 1 : -1);

		//console.log(chords, lines);
		//for (let ii = 0; ii < chords.length; ii++) {
		//	console.log(chords[ii].chordText, this.chordUtil.pianoKeysByName(chords[ii].chordText));
		//}
	}
}
function newMiniumLoopPlugin(): MZXBX_ActivePatternPlugin {
	return new MiniumLoopPlugin();
}
