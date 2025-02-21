/*https://github.com/CoderLine/alphaTab
*/
class GPImporter {
	score: Score;
	load(arrayBuffer: ArrayBuffer, ext: string) {
		console.log('load', arrayBuffer);
		let scoreImporter: ScoreImporter | null = null;
		if (ext.toUpperCase() == 'GP3' || ext.toUpperCase() == 'GP4' || ext.toUpperCase() == 'GP5') {
			scoreImporter = new Gp3To5Importer();
			//let gp3To5Importer: Gp3To5Importer = new Gp3To5Importer();

		} else {
			if (ext.toUpperCase() == 'GPX') {
				scoreImporter = new GpxImporter();
			} else {

				console.log('Unknown file ' + ext);
			}
		}
		if (scoreImporter) {
			let uint8Array: Uint8Array = new Uint8Array(arrayBuffer);
			//console.log('uint8Array', uint8Array);
			let data: ByteBuffer = ByteBuffer.fromBuffer(uint8Array);
			let settings: Settings = new Settings();
			settings.importer.encoding = 'windows-1251';
			scoreImporter.init(data, settings);
			//console.log('gp3To5Importer', gp3To5Importer);
			this.score = scoreImporter.readScore();
			//console.log("score", this.score);
		}
	}
	convertProject(title: string, comment: string): Zvoog_Project {
		//console.log('GPImporter.convertProject');
		let project: Zvoog_Project = score2schedule(title, comment, this.score);
		return project;
	}
}
function newGPparser(arrayBuffer: ArrayBuffer, ext: string) {
	console.log("newGPparser");
	let pp = new GPImporter();
	pp.load(arrayBuffer, ext);
	return pp;
}
function score2schedule(title: string, comment: string, score: Score): Zvoog_Project {
	console.log('score2schedule', score);
	let project: Zvoog_Project = {
		versionCode: '1'
		, title: title + ' ' + comment
		, timeline: []
		, tracks: []
		, percussions: []
		, filters: []
		, comments: []
		, position: { x: 0, y: 0, z: 0 }
		, selectedPart: { startMeasure: -1, endMeasure: -1 }
		, list: false
	};

	let tempo = 120;
	for (let bb = 0; bb < score.masterBars.length; bb++) {
		let maBar = score.masterBars[bb];
		if (maBar.tempoAutomation) {
			if (maBar.tempoAutomation.value > 0) {
				tempo = maBar.tempoAutomation.value;
			}
		}
		let measure: Zvoog_SongMeasure = {
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
	console.log(project);
	return project;
}
function stringFret2pitch(stringNum: number, fretNum: number, tuning: number[]): number {
	if (stringNum > 0 && stringNum <= tuning.length) {
		return tuning[tuning.length - stringNum] + fretNum;
	}
	/*
	var C = 0, Cs = 1, D = 2, Ds = 3, E = 4, F = 5, Fs = 6, G = 7, Gs = 8, A = 9, As = 10, B = 11;
	var O = 12;
	var _6th = E + O * 3, _5th = A + O * 3, _4th = D + O * 4, _3rd = G + O * 4, _2nd = B + O * 4, _1st = E + O * 5;
	if (stringNum == 1) return _6th + fretNum;
	if (stringNum == 2) return _5th + fretNum;
	if (stringNum == 3) return _4th + fretNum;
	if (stringNum == 4) return _3rd + fretNum;
	if (stringNum == 5) return _2nd + fretNum;
	if (stringNum == 6) return _1st + fretNum;
	*/
	return -1;
}
function beatDuration(beat: Beat): Zvoog_MetreMathType {
	let duration: Zvoog_MetreMathType = MMUtil().set({ count: 1, part: beat.duration });
	if (beat.dots > 0) {
		duration = duration.plus({ count: duration.count, part: 2 * beat.duration });
	}
	if (beat.dots > 1) {
		duration = duration.plus({ count: duration.count, part: 4 * beat.duration });
	}
	if (beat.dots > 2) {
		duration = duration.plus({ count: duration.count, part: 8 * beat.duration });
	}
	if (beat.dots > 3) {
		duration = duration.plus({ count: duration.count, part: 16 * beat.duration });
	}
	return duration;
}
function takeChord(start: Zvoog_Metre, measure: Zvoog_TrackMeasure): Zvoog_Chord {
	let startBeat = MMUtil().set(start);
	for (let cc = 0; cc < measure.chords.length; cc++) {
		if (startBeat.equals(measure.chords[cc].skip)) {
			return measure.chords[cc];
		}
	}
	let newChord: Zvoog_Chord = { notes: [], skip: { count: start.count, part: start.part } };
	measure.chords.push(newChord);
	return newChord;
}
function addScoreInsTrack(project: Zvoog_Project, scoreTrack: Track) {
	let mzxbxTrack: Zvoog_MusicTrack = {
		title: scoreTrack.trackName
		, measures: []
		//, filters: []
		, performer: { id: '', data: '', kind: '', outputs: [] }
	};
	project.tracks.push(mzxbxTrack);
	for (let mm = 0; mm < project.timeline.length; mm++) {
		let mzxbxMeasure: Zvoog_TrackMeasure = { chords: [] };
		mzxbxTrack.measures.push(mzxbxMeasure);
		for (let ss = 0; ss < scoreTrack.staves.length; ss++) {
			let staff = scoreTrack.staves[ss];
			let tuning: number[] = staff.stringTuning.tunings;
			let bar = staff.bars[mm];
			for (let vv = 0; vv < bar.voices.length; vv++) {
				let voice = bar.voices[vv];
				let start: Zvoog_MetreMathType = MMUtil();
				for (let bb = 0; bb < voice.beats.length; bb++) {
					let beat = voice.beats[bb];
					let currentDuration = beatDuration(beat);
					for (let nn = 0; nn < beat.notes.length; nn++) {
						let note = beat.notes[nn];
						let pitch = stringFret2pitch(note.string, note.fret, tuning);
						let chord: Zvoog_Chord = takeChord(start, mzxbxMeasure);
						let mzxbxNote: Zvoog_Note = {
							pitch: pitch
							, slides: [{
								delta: 0
								, duration: currentDuration
							}]
						};
						chord.notes.push(mzxbxNote);
					}
					start = start.plus(currentDuration);
				}
			}

		}
		//let bar = scoreTrack.staves
	}
}
function takeDrumTrack(title: string, trackDrums: Zvoog_PercussionTrack[], drumNum: number): Zvoog_PercussionTrack {
	if (trackDrums[drumNum]) {
		//
	} else {
		let track: Zvoog_PercussionTrack = {
			title: title
			, measures: []
			//, filters: []
			, sampler: { id: '', data: '', kind: '', outputs: [] }
		};
		trackDrums[drumNum] = track;
	}
	trackDrums[drumNum].title = title;
	return trackDrums[drumNum];
}
function takeDrumMeasure(trackDrum: Zvoog_PercussionTrack, barNum: number): Zvoog_PercussionMeasure {
	if (trackDrum.measures[barNum]) {
		//
	} else {
		let measure: Zvoog_PercussionMeasure = {
			skips: []
		};
		trackDrum.measures[barNum] = measure;
	}
	return trackDrum.measures[barNum];
}

function addScoreDrumsTracks(project: Zvoog_Project, scoreTrack: Track) {
	let trackDrums: Zvoog_PercussionTrack[] = [];
	for (let mm = 0; mm < project.timeline.length; mm++) {
		//let mzxbxMeasure: Zvoog_TrackMeasure = { chords: [] };
		//mzxbxTrack.measures.push(mzxbxMeasure);
		for (let ss = 0; ss < scoreTrack.staves.length; ss++) {
			let staff = scoreTrack.staves[ss];
			//let tuning: number[] = staff.stringTuning.tunings;
			let bar = staff.bars[mm];
			for (let vv = 0; vv < bar.voices.length; vv++) {
				let voice = bar.voices[vv];
				let start: Zvoog_MetreMathType = MMUtil();
				for (let bb = 0; bb < voice.beats.length; bb++) {
					let beat = voice.beats[bb];
					let currentDuration = beatDuration(beat);
					for (let nn = 0; nn < beat.notes.length; nn++) {
						let note = beat.notes[nn];
						let drum = note.percussionArticulation;
						let track = takeDrumTrack(scoreTrack.trackName + ': ' + drum, trackDrums, drum);
						let measure = takeDrumMeasure(track, mm);
						measure.skips.push(start);
						/*let pitch = stringFret2pitch(note.string, note.fret, tuning);
						let chord: Zvoog_Chord = takeChord(start, mzxbxMeasure);
						let mzxbxNote: Zvoog_Note = {
							pitch: pitch
							, slides: [{
								delta: 0
								, duration: currentDuration
							}]
						};
						chord.notes.push(mzxbxNote);*/
					}
					start = start.plus(currentDuration);
				}
			}

		}
		//let bar = scoreTrack.staves
	}
	for (let mm = 0; mm < project.timeline.length; mm++) {
		for (let tt = 0; tt < trackDrums.length; tt++) {
			if (trackDrums[tt]) {
				takeDrumMeasure(trackDrums[tt], mm);
			}
		}
	}
	for (let tt = 0; tt < trackDrums.length; tt++) {
		if (trackDrums[tt]) {
			//console.log(trackDrums[tt]);
			project.percussions.push(trackDrums[tt]);
		}
	}
}
class GP345ImportMusicPlugin {
	callbackID = '';
	parsedProject: Zvoog_Project | null = null;
	constructor() {
		this.init();
	}
	init() {
		window.addEventListener('message', this.receiveHostMessage.bind(this), false);
		window.parent.postMessage({
			dialogID: this.callbackID
			, pluginData: this.parsedProject
			, done: false
		}, '*');
	}
	sendParsedGP345Data() {

		if (this.parsedProject) {
			var oo: MZXBX_MessageToHost = {
				dialogID: this.callbackID
				, pluginData: this.parsedProject
				, done: true
			};
			window.parent.postMessage(oo, '*');
		} else {
			alert('No parsed data');
		}
	}


	receiveHostMessage(par) {
		let message: MZXBX_MessageToPlugin = par.data;
		if (this.callbackID) {
			//
		} else {
			this.callbackID = message.hostData;
		}
	}
	loadGP345file(from) {
		console.log('loadGP345file', from.files);
		let me = this;
		var file = from.files[0];
		var fileReader = new FileReader();
		let title: string = file.name;
		let ext: string | undefined = ('' + file.name).split('.').pop();
		let dat = '' + file.lastModifiedDate;
		try {
			let last: Date = file.lastModifiedDate;
			dat = '' + last.getFullYear();
			if (last.getMonth() < 10) {
				dat = dat + '-' + last.getMonth();
			} else {
				dat = dat + '-0' + last.getMonth();
			}
			if (last.getDate() < 10) {
				dat = dat + '-' + last.getDate();
			} else {
				dat = dat + '-0' + last.getDate();
			}
		} catch (xx) {
			console.log(xx);
		}
		let comment: string = ', ' + file.size / 1000 + 'kb, ' + dat;
		fileReader.onload = function (progressEvent: any) {
			if (progressEvent != null) {
				var arrayBuffer = progressEvent.target.result;

				var pp = newGPparser(arrayBuffer, '' + ext);
				try {
					let result: Zvoog_Project = pp.convertProject(title, comment);
					//me.registerWorkProject(result);
					//me.resetProject();
					me.parsedProject = result;
				} catch (xxx) {
					console.log(xxx);
				}
			}
		};
		fileReader.readAsArrayBuffer(file);
	}
	/*
		callbackID = '';
		parsedProject: Zvoog_Project | null = null;
		constructor() {
			window.addEventListener('message', this.receiveHostMessage.bind(this), false);
		}
		receiveHostMessage(par) {
			//console.log('receiveHostMessage', par);
			//callbackID = par.data;
			try {
				var oo:MZXBX_PluginMessage = JSON.parse(par.data);
				this.callbackID = oo.dialogID;
			} catch (xx) {
				console.log(xx);
			}
		}
		loadGP345file(from) {
			console.log('loadGP345file', from.files);
			let me = this;
			var file = from.files[0];
			var fileReader = new FileReader();
			let title: string = file.name;
			let ext: string | undefined = ('' + file.name).split('.').pop();
			let dat = '' + file.lastModifiedDate;
			try {
				let last: Date = file.lastModifiedDate;
				dat = '' + last.getFullYear();
				if (last.getMonth() < 10) {
					dat = dat + '-' + last.getMonth();
				} else {
					dat = dat + '-0' + last.getMonth();
				}
				if (last.getDate() < 10) {
					dat = dat + '-' + last.getDate();
				} else {
					dat = dat + '-0' + last.getDate();
				}
			} catch (xx) {
				console.log(xx);
			}
			let comment: string = ', ' + file.size / 1000 + 'kb, ' + dat;
			fileReader.onload = function (progressEvent: any) {
				if (progressEvent != null) {
					var arrayBuffer = progressEvent.target.result;
	
					var pp = newGPparser(arrayBuffer, '' + ext);
					try {
						let result: Zvoog_Project = pp.convertProject(title, comment);
						//me.registerWorkProject(result);
						//me.resetProject();
						me.parsedProject = result;
					} catch (xxx) {
						console.log(xxx);
					}
				}
			};
			fileReader.readAsArrayBuffer(file);
		}
		sendParsedGP345Data() {
			console.log('sendParsedGP345Data');
			if (this.parsedProject) {
				var oo:MZXBX_PluginMessage = {
					dialogID: this.callbackID,
					data: JSON.stringify(this.parsedProject)
				};
				window.parent.postMessage(JSON.stringify(oo), '*');
			} else {
				alert('No parsed data');
			}
		}*/
}