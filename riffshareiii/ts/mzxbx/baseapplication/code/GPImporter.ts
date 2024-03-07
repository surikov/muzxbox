/*https://github.com/CoderLine/alphaTab
*/
class GPImporter {
	score: Score;
	load(arrayBuffer: ArrayBuffer) {
		console.log('load', arrayBuffer);
		let gp3To5Importer: Gp3To5Importer = new Gp3To5Importer();
		let uint8Array: Uint8Array = new Uint8Array(arrayBuffer);
		//console.log('uint8Array', uint8Array);
		let data: ByteBuffer = ByteBuffer.fromBuffer(uint8Array);
		let settings: Settings = new Settings();
		gp3To5Importer.init(data, settings);
		//console.log('gp3To5Importer', gp3To5Importer);
		this.score = gp3To5Importer.readScore();
		//console.log("score", this.score);
	}
	convertProject(title: string, comment: string): MZXBX_Project {
		//console.log('GPImporter.convertProject');
		let project: MZXBX_Project = score2schedule(title, comment, this.score);
		return project;
	}
}
function newGPparser(arrayBuffer: ArrayBuffer) {
	console.log("newGPparser");
	let pp = new GPImporter();
	pp.load(arrayBuffer);
	return pp;
}
function score2schedule(title: string, comment: string, score: Score): MZXBX_Project {
	console.log('score2schedule', score);
	let project: MZXBX_Project = {
		title: title + ' ' + comment
		, timeline: []
		, tracks: []
		, percussions: []
		, filters: []
		, comments: []
	};

	let tempo = 120;
	for (let bb = 0; bb < score.masterBars.length; bb++) {
		let maBar = score.masterBars[bb];
		if (maBar.tempoAutomation) {
			if (maBar.tempoAutomation.value > 0) {
				tempo = maBar.tempoAutomation.value;
			}
		}
		let measure: MZXBX_SongMeasure = {
			tempo: tempo
			, metre: {
				count: maBar.timeSignatureNumerator
				, part: maBar.timeSignatureDenominator
			}
		};
		project.timeline.push(measure);

	}
	for (let tt = 0; tt < score.tracks.length; tt++) {
		let scoreTrack = score.tracks[tt];
		let pp = false;
		for (let ss = 0; ss < scoreTrack.staves.length; ss++) {
			if (scoreTrack.staves[ss].isPercussion) {
				pp = true;
			}
		}
		if (pp) {
			addScoreDrumsTracks(project, scoreTrack);
		} else {
			addScoreInsTrack(project, scoreTrack);
		}
	}
	return project;
}
function addScoreInsTrack(project: MZXBX_Project, scoreTrack: Track) {
	let mzxbxTrack: MZXBX_MusicTrack = {
		title: scoreTrack.name
		, measures: []
		, filters: []
		, performer: { id: '', data: '' }
	};
	project.tracks.push(mzxbxTrack);
	for (let tr = 0; tr < project.timeline.length; tr++) {
		let mzxbxMeasure: MZXBX_TrackMeasure = { chords: [] };
		project.tracks[tr].measures.push(mzxbxMeasure);
		for (let ss = 0; ss < scoreTrack.staves.length; ss++) {
			let staff = scoreTrack.staves[ss];
			let bar = staff.bars[tr];
			for (let vv = 0; vv < bar.voices.length; vv++) {
				let voice = bar.voices[vv];
				for (let bb = 0; bb < voice.beats.length; bb) {
					let beat = voice.beats[bb];

				}
			}

		}
		let bar = scoreTrack.staves
	}
}
function addScoreDrumsTracks(project: MZXBX_Project, scoreTrack: Track) {

}
