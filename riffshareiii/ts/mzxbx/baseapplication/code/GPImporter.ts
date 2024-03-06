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
	for (let tt = 0; tt < score.tracks.length; tt++) {
		let track = score.tracks[tt];
		let pp = false;
		for (let ss = 0; ss < track.staves.length; ss++) {
			if (track.staves[ss].isPercussion) {
				pp = true;
			}
		}
		if (pp) {
			addScoreDrumsTracks(project, track);
		} else {
			addScoreInsTrack(project, track);
		}
	}
	let tempo = 120;
	for (let bb = 0; bb < score.masterBars.length; bb++) {
		let maBar = score.masterBars[bb];
		if (maBar.tempoAutomation) {
			if (maBar.tempoAutomation.value > 0) {
				tempo=maBar.tempoAutomation.value;
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
		for (let tr = 0; tr < project.tracks.length; tr++) {
			project.tracks[tr].measures.push({ chords: [] });
		}
	}
	return project;
}
function addScoreInsTrack(project: MZXBX_Project, fromTrack: Track) {
	let toTrack: MZXBX_MusicTrack = {
		title: fromTrack.name
		, measures: []
		, filters: []
		, performer: { id: '', data: '' }
	};
	project.tracks.push(toTrack);
}
function addScoreDrumsTracks(project: MZXBX_Project, fromTrack: Track) {

}
