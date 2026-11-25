//console.log('alphatabimport1');
type PitchesStatistics = {
	tone: number;
	nI: number;
	nIV: number;
	nV: number;
	min: number;
	maj: number;
	sept: number;
};
class FileLoaderAlpha {
	inames: ChordPitchPerformerUtilMIDI = new ChordPitchPerformerUtilMIDI();

	constructor(inputFile) {
		var file = inputFile.files[0];
		var fileReader = new FileReader();
		let me = this;
		//console.log('read', file);

		fileReader.onload = function (progressEvent: any) {
			if (progressEvent != null) {
				let title: string = file.name;
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
				var arrayBuffer: ArrayBuffer = progressEvent.target.result as ArrayBuffer;

				let uint8Array: Uint8Array = new Uint8Array(arrayBuffer);
				//console.log('uint8Array', uint8Array);
				let data: ByteBuffer = ByteBuffer.fromBuffer(uint8Array);
				let settings: Settings = new Settings();
				//settings.importer.beatTextAsLyrics = true;
				let path: string = inputFile.value;
				path = path.toLowerCase().trim();
				if (path.endsWith('.gp3') || path.endsWith('.gp4') || path.endsWith('.gp5')) {
					let gp35: Gp3To5Importer = new Gp3To5Importer();
					settings.importer.encoding = 'windows-1251';
					gp35.init(data, settings);
					let score = gp35.readScore();
					me.convertScore2Project(title, score);
				} else {
					if (path.endsWith('.gpx')) {
						let gpx: GpxImporter = new GpxImporter();
						settings.importer.encoding = 'windows-1251';
						gpx.init(data, settings);
						let score = gpx.readScore();
						me.convertScore2Project(title, score);
					} else {
						if (path.endsWith('.gp')) {
							let gp78: Gp7To8Importer = new Gp7To8Importer();
							settings.importer.encoding = 'windows-1251';
							gp78.init(data, settings);
							let score = gp78.readScore();
							me.convertScore2Project(title, score);
						} else {
							if (path.endsWith('.mxl') || path.endsWith('.musicxml')) {
								let mxl: MusicXmlImporter = new MusicXmlImporter();
								settings.importer.encoding = 'windows-1251';
								mxl.init(data, settings);
								let score = mxl.readScore();
								me.convertScore2Project(title, score);
							} else {
								if (path.endsWith('.mid')) {

									let mireader: MIDIReader = new MIDIReader(file.name, file.size, arrayBuffer);
									parsedProject = mireader.project;
									console.log('parser', mireader.parser);
									console.log('info', mireader.info);
									console.log('project', mireader.project);
								} else {
									if (path.endsWith('.json')) {
										//parsedProject = JSON.parse(progressEvent.target.result);
										//
										let textDecoder = new TextDecoder(); // always utf-8
										let json = textDecoder.decode(uint8Array);
										//console.log('json', json);
										parsedProject = JSON.parse(json);
									} else {
										console.log('wrong path', path);
									}
								}
							}
						}
					}
				}
				me.setupProjectCHordHints(parsedProject);

				//let proj = new Projectr();
				//me.parsedProject = proj.parseRawMIDIdata(arrayBuffer, title, comment);
				//console.log('done zproject', me.parsedProject);
			}
		};
		fileReader.readAsArrayBuffer(file);
	}
	convertScore2Project(fname: string, score: Score) {
		console.log(score);

		let project: Zvoog_Project = {
			versionCode: '1'
			, title: score.title + ' ' + fname
			, timeline: []
			, tracks: []
			, percussions: []
			, comments: []
			, filters: []
			, farorder: []
			, selectedPart: { startMeasure: -1, endMeasure: -1 }
			, position: { x: 0, y: 0, z: 30 }
			, list: false
			//, modeNameHint: '?'
			, patterns: []
			, menuPerformers: false, menuSamplers: false, menuFilters: false, menuActions: false, menuPlugins: false, menuClipboard: false, menuSettings: false
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
				//, modality: { tonic: { step: 0, shift: 0 }, mode: [], chord: [] }
				, metre: {
					count: maBar.timeSignatureNumerator
					, part: maBar.timeSignatureDenominator
				}
				//, chordNameHint: '?'
			};
			project.timeline.push(measure);

		}
		let echoOutID = 'reverberation' + Math.random();
		let compresID = 'compression' + Math.random();
		for (let tt = 0; tt < score.tracks.length; tt++) {
			let scoreTrack = score.tracks[tt];
			let pp = false;
			for (let ss = 0; ss < scoreTrack.staves.length; ss++) {
				if (scoreTrack.staves[ss].isPercussion) {
					pp = true;
				}
			}
			if (pp) {
				this.addScoreDrumsTracks(project, scoreTrack, compresID);
			} else {
				this.addScoreInsTrack(project, scoreTrack, compresID);
			}
		}
		let filterEcho: Zvoog_FilterTarget = {
			id: echoOutID, title: 'Echo'
			, kind: 'miniumecho1', data: '22', outputs: ['']
			, iconPosition: {
				x: 77 + project.tracks.length * 30
				, y: project.tracks.length * 8 + 2
			}
			, automation: [], state: 0
		};
		let filterCompression: Zvoog_FilterTarget = {
			id: compresID
			, title: 'Compressor'
			, kind: 'miniumdcompressor1'
			, data: '33'
			, outputs: [echoOutID]
			, iconPosition: {
				x: 88 + project.tracks.length * 30
				, y: project.tracks.length * 8 + 2
			}
			, automation: [], state: 0
		};
		project.filters.push(filterEcho);
		project.filters.push(filterCompression);

		this.addScoreLyrics(project, score);
		//console.log(project);
		this.addRepeats(project, score);

		let tracksWidth = 9 * project.tracks.length;
		let perWidth = 9 * project.percussions.length;
		project.filters[0].iconPosition.x = 7 * 7 + tracksWidth + perWidth;
		project.filters[0].iconPosition.y = 1 * 9 + 66;
		project.filters[1].iconPosition.x = 3 * 7 + tracksWidth + perWidth;
		project.filters[1].iconPosition.y = 12;

		this.arrangeTracks(project);
		this.arrangeDrums(project);
		this.arrangeFilters(project);


		parsedProject = project;


	}

	setupProjectCHordHints(project: Zvoog_Project | null) {
		//console.log('dumpProjectInfo--------------------------------------', project);
		if (project) {
			this.adjustContentByMeter(project);
			for (let ii = 0; ii < project.timeline.length; ii++) {
				project.comments[ii].points.map(vv => vv.row++);
			}
			let lastLabel = '';
			let step = { count: 1, part: 2 };
			let lastTonic = -1;
			//let lastMinor = false;

			let last7 = false;
			let triadPrefs: number[] = [];
			for (let hh = 0; hh < 12; hh++) {
				triadPrefs[hh] = 0;
			}
			for (let ii = 0; ii < project.timeline.length; ii++) {
				//if (ii >= 28 && ii <= 28) {
				let measure = project.timeline[ii];
				let point = MMUtil().set({ count: 0, part: 1 });
				while (point.less(measure.metre)) {


					/*
											let counts = this.countNotesAll(ii, point, point.plus(step), project);
											console.log(ii, point.metre(), counts);
											for (let nn = 0; nn < 12; nn++) {
												console.log(this.fillChordInfo(nn, counts));
											}*/

					//let label = this.notes2Chord(counts);
					//console.log(lastMinor);
					let chord = new ChordFinder(lastTonic, triadPrefs, last7, ii, point, point.plus(step), project);
					lastTonic = chord.tonic;
					//lastMinor = chord.minor;
					last7 = chord.seventh;
					let label = chord.chordLabel();
					/*
					console.log(lastMinor,label);
					if (lastTonic == chord.tonic) {
						lastMinor = chord.minor;
						last7 = chord.seventh;
					} else {
						lastMinor = false;
						lastTonic = chord.tonic;
						last7=false;
					}
					*/
					//console.log(ii, label, allnotes);
					if (label != lastLabel) {
						project.comments[ii].points.push({
							skip: point.metre()
							, text: label
							, row: 0
						});
						lastLabel = label;
					}
					point = point.plus(step);
				}

				/*
								let allnotes = this.countNotesAll(ii, { count: 0, part: 1 }, { count: 1, part: 2 }, project);
								let label = '';
								label = label + this.notes2Chord(allnotes);
								allnotes = this.countNotesAll(ii, { count: 1, part: 2 }, { count: 1, part: 1 }, project);
								label = label + '-' + this.notes2Chord(allnotes);
								project.comments[ii].points.push({
									skip: { count: 0, part: 1 }
									, text: label
									, row: 0
								});*/
				//}
			}
		}
		//console.log('-------------------');
	}
	/*
	notes2Chord(counts: number[]): string {
		let tonic = this.findTonic(counts);
		if (tonic < 0) {
			return '?';
		}
		let label = this.halfStepNames[tonic] + this.findTriadLabel(tonic, counts) + this.find7Label(tonic, counts);
		return label;
	}
	halfStepNames = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
	notesText(notes: number[]) {

		let txt = ''
		for (let ii = 0; ii < notes.length; ii++) {
			if (notes[ii]) {
				txt = txt + ' ' + Math.floor(ii / 12) + this.halfStepNames[ii % 12];
			}
		}
		return txt;
	}
	allNotes2base(allNotes: number[]): number[] {
		let base12: number[] = [];
		for (let ii = 0; ii < 12; ii++) {
			base12[ii] = 0;
		}
		for (let ii = 0; ii < allNotes.length; ii++) {
			if (allNotes[ii]) {
				let half = ii % 12;
				base12[half] = base12[half] + allNotes[ii];
			}
		}
		return base12;
	}
	findTriadLabel(tonic: number, allNotes: number[]): string {
		let base12 = this.allNotes2base(allNotes);
		if (base12[(tonic + 3) % 12] > base12[(tonic + 4) % 12]) {
			return 'm';//+'['+base12[(tonic + 3) % 12]+':'+base12[(tonic + 4) % 12]+']';
		} else {
			return '';//+'['+base12[(tonic + 3) % 12]+':'+base12[(tonic + 4) % 12]+']';
		}
	}
	find7Label(tonic: number, allNotes: number[]): string {
		let counts = this.allNotes2base(allNotes);
		if (counts[(tonic + 10) % 12] > 0) {
			return '7';
		} else {
			return '';
		}
	}
	findTonic(allNotes: number[]): number {
		let notes12 = this.allNotes2base(allNotes);
		let maxCount = 0;
		let halfNum = -1;
		for (let ii = 0; ii < 12; ii++) {
			let qN = (ii + 7) % 12;
			//if (counts[ii] > 0 && counts[qN] > 0 && counts[ii] > 1.1 * counts[qN]) {
			//if (counts[ii] > 0 && counts[qN] > 0 && counts[ii] > 1.1 * counts[qN]) {
			//console.log(noteNames[ii], counts[ii] + '+' + counts[qN] + '=' + (counts[ii] + counts[qN]));
			if (maxCount < notes12[ii] + notes12[qN]) {
				maxCount = notes12[ii] + notes12[qN];
				halfNum = ii;
			}
			//}
		}
		//console.log(halfNum,counts);
		return halfNum;
	}

	findNearChord(allNotes: number[]): number {
		let notes12 = this.allNotes2base(allNotes);
		let maxCount = 0;
		let halfNum = -1;
		for (let ii = 0; ii < 12; ii++) {
			let qN = (ii + 7) % 12;
			if (maxCount < notes12[ii] + notes12[qN]) {
				maxCount = notes12[ii] + notes12[qN];
				halfNum = ii;
			}
			//}
		}
		//console.log(halfNum,counts);
		return halfNum;
	}
	isChordConsists(base: PitchesStatistics, another: PitchesStatistics): boolean {
		if (base.tone == another.tone) {
			if (base.sept > 0) {
				if (base.min > 0 && another.maj == 0) {
					if (base.maj > 0 && another.min == 0) {
						return true;
					}
				}
			}
		}
		return false;
	}
	fillChordInfo(tone12: number, counts: number[]): PitchesStatistics {
		let rz: PitchesStatistics = { tone: tone12, nI: 0, nIV: 0, nV: 0, min: 0, maj: 0, sept: 0 };
		for (let ii = 0; ii < counts.length; ii++) {
			if (counts[ii]) {
				if ((ii % 12) == tone12) rz.nI = rz.nI + counts[ii];
				if ((ii % 12) == ((tone12 + 5) % 12)) rz.nIV = rz.nIV + counts[ii];
				if ((ii % 12) == ((tone12 + 7) % 12)) rz.nV = rz.nV + counts[ii];
				if ((ii % 12) == ((tone12 + 3) % 12)) rz.min = rz.min + counts[ii];
				if ((ii % 12) == ((tone12 + 4) % 12)) rz.maj = rz.maj + counts[ii];
				if ((ii % 12) == ((tone12 + 10) % 12)) rz.sept = rz.sept + counts[ii];
			}
		}
		return rz;
	}
	countNotesAll(barNo: number, from: Zvoog_Metre, to: Zvoog_Metre, project: Zvoog_Project): number[] {
		let counts: number[] = [];
		for (let tt = 0; tt < project.tracks.length; tt++) {
			let trackMeasure = project.tracks[tt].measures[barNo];
			for (let cc = 0; cc < trackMeasure.chords.length; cc++) {
				let trackMeasureChord = trackMeasure.chords[cc];
				let mm = MMUtil().set(trackMeasureChord.skip);
				if ((!mm.less(from)) && mm.less(to)) {
					for (let pp = 0; pp < trackMeasureChord.pitches.length; pp++) {
						let halftone = trackMeasureChord.pitches[pp];
						counts[halftone] = (counts[halftone]) ? counts[halftone] : 0;
						counts[halftone]++;
					}
				}
			}
		}
		return counts;
	}*/
	adjustContentByMeter(currentProject: Zvoog_Project) {
		for (let ii = 0; ii < currentProject.timeline.length; ii++) {
			let barMetre = MMUtil().set(currentProject.timeline[ii].metre);
			for (let nn = 0; nn < currentProject.tracks.length; nn++) {
				if (!(currentProject.tracks[nn].measures[ii])) currentProject.tracks[nn].measures[ii] = { chords: [] };
				let trackBar = currentProject.tracks[nn].measures[ii];
				for (let kk = 0; kk < trackBar.chords.length; kk++) {
					let chord = trackBar.chords[kk];
					if (!barMetre.more(chord.skip)) {
						if (ii + 1 < currentProject.timeline.length) {
							chord.skip = MMUtil().set(chord.skip).minus(barMetre).simplyfy();
							trackBar.chords.splice(kk, 1);
							kk--;
							currentProject.tracks[nn].measures[ii + 1].chords.push(chord);
						} else {
							currentProject.timeline[ii].metre = MMUtil().set(chord.skip).plus({ count: 1, part: 8 }).metre();
						}
					}
				}
			}
			for (let nn = 0; nn < currentProject.percussions.length; nn++) {
				if (!(currentProject.percussions[nn].measures[ii])) currentProject.percussions[nn].measures[ii] = { skips: [] };
				let percuBar = currentProject.percussions[nn].measures[ii];
				for (let kk = 0; kk < percuBar.skips.length; kk++) {
					let skip = percuBar.skips[kk];
					if (!barMetre.more(skip)) {
						if (ii + 1 < currentProject.timeline.length) {
							let newSkip = MMUtil().set(skip).minus(barMetre).simplyfy();
							percuBar.skips.splice(kk, 1);
							kk--;
							currentProject.percussions[nn].measures[ii + 1].skips.push(newSkip);
						} else {
							currentProject.timeline[ii].metre = MMUtil().set(skip).plus({ count: 1, part: 8 }).metre();
						}
					}
				}
			}
			for (let nn = 0; nn < currentProject.filters.length; nn++) {
				if (!(currentProject.filters[nn].automation[ii])) currentProject.filters[nn].automation[ii] = { changes: [] };
				let autoBar = currentProject.filters[nn].automation[ii];
				for (let kk = 0; kk < autoBar.changes.length; kk++) {
					let change = autoBar.changes[kk];
					if (!barMetre.more(change.skip)) {
						if (ii + 1 < currentProject.timeline.length) {
							change.skip = MMUtil().set(change.skip).minus(barMetre).simplyfy();
							autoBar.changes.splice(kk, 1);
							kk--;
							currentProject.filters[nn].automation[ii + 1].changes.push(change);
						} else {
							currentProject.timeline[ii].metre = MMUtil().set(change.skip).plus({ count: 1, part: 8 }).metre();
						}
					}
				}
			}
			if (!(currentProject.comments[ii])) currentProject.comments[ii] = { points: [] };
			let textBar = currentProject.comments[ii];
			for (let kk = 0; kk < textBar.points.length; kk++) {
				let point = textBar.points[kk];
				if (!barMetre.more(point.skip)) {
					if (ii + 1 < currentProject.timeline.length) {
						point.skip = MMUtil().set(point.skip).minus(barMetre).simplyfy();
						textBar.points.splice(kk, 1);
						kk--;
						console.log();
						currentProject.comments[ii + 1].points.push(point);
					} else {
						currentProject.timeline[ii].metre = MMUtil().set(point.skip).plus({ count: 1, part: 8 }).metre();
					}
				}
			}
		}
	}
	addRepeats(project: Zvoog_Project, score: Score) {
		let startLoop = -1;
		let altStart = -1;
		let projIdx = 0;
		for (let ii = 0; ii < score.masterBars.length; ii++) {
			//console.log(ii, projIdx);
			let scorebar = score.masterBars[ii];
			if (scorebar.isRepeatStart) {
				startLoop = ii;
				altStart = -1;
				//console.log('start', startLoop);
			}
			if (scorebar.alternateEndings) {
				//console.log('...', ii, 'endings', scorebar.alternateEndings);
				altStart = ii;
			}
			if (scorebar.isRepeatEnd) {
				//console.log('.end', ii);
				if (startLoop > -1) {
					let diff = projIdx - ii;
					projIdx = projIdx + this.cloneAndRepeat(project, startLoop + diff, altStart < 0 ? -1 : altStart + diff, ii + diff, scorebar.repeatCount);
					//console.log('..', ii, 'repeat', scorebar.repeatCount);
					//console.log(startLoop, altStart, ii, 'x', scorebar.repeatCount);
					startLoop = -1;
					altStart = -1;
				}
			}
			projIdx++;
		}
	}
	cloneAndRepeat(project: Zvoog_Project, start: number, altEnd: number, end: number, count: number): number {
		console.log('repeat', start, altEnd, end, count);
		let insertPoint = end + 1;
		for (let cc = 0; cc < count - 1; cc++) {
			//console.log(cc);
			for (let mm = start; mm <= end; mm++) {
				if ((cc == count - 2) && (altEnd > -1) && (mm >= altEnd)) {
					//
				} else {
					this.cloneOneMeasure(project, mm, insertPoint);
					insertPoint++;
				}
			}
		}
		return insertPoint - 1 - end;
	}
	cloneOneMeasure(project: Zvoog_Project, from: number, to: number) {
		//console.log('clone', from, to);
		let clone = project.timeline[from];
		let oo = JSON.parse(JSON.stringify(clone));
		project.timeline.splice(to, 0, oo);
		for (let ii = 0; ii < project.tracks.length; ii++) {
			let clone = project.tracks[ii].measures[from];
			let oo = JSON.parse(JSON.stringify(clone));
			project.tracks[ii].measures.splice(to, 0, oo);
		}
		for (let ii = 0; ii < project.percussions.length; ii++) {
			let clone = project.percussions[ii].measures[from];
			let oo = JSON.parse(JSON.stringify(clone));
			project.percussions[ii].measures.splice(to, 0, oo);
		}
		for (let ii = 0; ii < project.filters.length; ii++) {
			let clone = project.filters[ii].automation[from];
			if (clone) {
				let oo = JSON.parse(JSON.stringify(clone));
				project.filters[ii].automation.splice(to, 0, oo);
			}
		}
		let clone2 = project.comments[from];
		let oo2 = JSON.parse(JSON.stringify(clone2));
		project.comments.splice(to, 0, oo2);
	}
	addScoreLyrics(project: Zvoog_Project, score: Score) {
		for (let ii = 0; ii < project.timeline.length; ii++) {
			project.comments.push({ points: [] });
		}
		let firstBar = project.comments[0];
		this.addHeaderText(score.album, 'Album', firstBar);
		this.addHeaderText(score.artist, 'Artist', firstBar);
		this.addHeaderText(score.copyright, 'Copyright', firstBar);
		this.addHeaderText(score.instructions, 'Instructions', firstBar);
		this.addHeaderText(score.music, 'Music', firstBar);
		this.addHeaderText(score.notices, 'Notices', firstBar);
		this.addHeaderText(score.subTitle, 'Subtitle', firstBar);
		this.addHeaderText(score.tab, 'Tab', firstBar);
		this.addHeaderText(score.tempoLabel, 'Tempo', firstBar);
		this.addHeaderText(score.words, 'words', firstBar);
		for (let mm = 0; mm < score.masterBars.length; mm++) {
			let mbar = score.masterBars[mm]
			if (mbar.section) {
				this.addBarText(mbar.section.text, project, mm);
			}
		}
		for (let tt = 0; tt < score.tracks.length; tt++) {
			let cutrack = score.tracks[tt];
			for (let ss = 0; ss < cutrack.staves.length; ss++) {
				let custaff = cutrack.staves[ss];
				for (let bb = 0; bb < custaff.bars.length; bb++) {
					let bar = custaff.bars[bb];
					//console.log(bb,bar);
					for (let vv = 0; vv < bar.voices.length; vv++) {
						let vox = bar.voices[vv];
						//console.log(vv,vox);
						for (let rr = 0; rr < vox.beats.length; rr++) {
							let beat = vox.beats[rr];
							//console.log(rr,beat);
							if (beat.text) {
								this.addBarText(beat.text, project, bb);
							}
							if (beat.lyrics) {
								if (beat.lyrics.length) {
									//console.log(bb,beat.lyrics);
									for (let ll = 0; ll < beat.lyrics.length; ll++) {
										this.addBarText(beat.lyrics[ll], project, bb);
									}
								}
							}
						}
					}
				}
			}
		}


	}
	addBarText(text: string, project: Zvoog_Project, barIdx: number) {
		let bar: Zvoog_CommentMeasure = project.comments[barIdx];
		if (text) {
			let row = bar.points.length;
			bar.points.push({ skip: { count: 0, part: 1 }, text: text, row: row });
		}
	}
	addHeaderText(text: string, label: string, firstBar: Zvoog_CommentMeasure) {
		if (text) {
			let row = firstBar.points.length;
			firstBar.points.push({ skip: { count: 0, part: 1 }, text: label + ': ' + text, row: row });
		}
	}
	arrangeTracks(project: Zvoog_Project) {
		let wwCell = 9;
		let hhCell = 7;
		for (let ii = 0; ii < project.tracks.length; ii++) {
			//project.tracks[ii].performer.iconPosition.x = (project.tracks.length - ii - 1) * 9;
			//project.tracks[ii].performer.iconPosition.y = ii * 6;
			project.tracks[ii].performer.iconPosition = { x: (ii + 1) * wwCell * 1.1, y: ii * hhCell * 0.8 };
		}
	}
	arrangeDrums(project: Zvoog_Project) {
		let wwCell = 9;
		let hhCell = 3;
		let start = (project.tracks.length + 2) * wwCell * 1.1;
		for (let kk = 0; kk < project.percussions.length; kk++) {
			//let left = 9 * (kk + 11 + project.tracks.length);
			let top = (8 * 12 + 2 * project.percussions.length) + kk * hhCell - project.percussions.length * hhCell;
			let ss = project.percussions[kk];
			//ss.sampler.iconPosition.x = (project.percussions.length - 1 - kk) * 7 + (1 + project.tracks.length) * 9;
			//ss.sampler.iconPosition.y = 8 * 12 + project.percussions.length * 2 - (1 + kk) * 7;
			ss.sampler.iconPosition = { x: start + kk * wwCell, y: top };
		}
	}
	arrangeFilters(project: Zvoog_Project) {
		for (let ii = 0; ii < project.filters.length - 2; ii++) {
			project.filters[ii].iconPosition.x = ii * 7 + (1 + project.tracks.length) * 9 + (1 + project.percussions.length) * 7;
			project.filters[ii].iconPosition.y = ii * 7;
		}
		/*let cmp = project.filters[project.filters.length - 1];
		let eq = project.filters[project.filters.length - 2];

		cmp.iconPosition.x = project.filters.length * 7 + (1 + project.tracks.length) * 9 + (1 + project.percussions.length) * 7;
		cmp.iconPosition.y = 6 * 12;

		eq.iconPosition.x = cmp.iconPosition.x + 10;
		eq.iconPosition.y = 5 * 12;*/
	}
	findVolumeInstrument(program: number): { idx: number, ratio: number } {
		let re = { idx: 0, ratio: 0.7 };
		let instrs = new ChordPitchPerformerUtilMIDI().tonechordinstrumentKeys();
		for (var i = 0; i < instrs.length; i++) {
			if (program == 1 * parseInt(instrs[i].substring(0, 3))) {
				re.idx = i;
				break;
			}
		}

		if (program == 16) re.ratio = 0.4;
		if (program == 17) re.ratio = 0.4;
		if (program == 18) re.ratio = 0.4;
		if (program == 19) re.ratio = 0.4;
		if (program == 20) re.ratio = 0.4;
		if (program == 21) re.ratio = 0.4;
		if (program == 22) re.ratio = 0.4;
		if (program == 23) re.ratio = 0.4;

		if (program == 24) re.ratio = 0.44;
		if (program == 26) re.ratio = 0.44;

		if (program == 27) re.ratio = 0.95;

		if (program == 28) re.ratio = 0.99;
		if (program == 29) re.ratio = 0.99;
		if (program == 30) re.ratio = 0.99;
		if (program == 31) re.ratio = 0.99;

		if (program == 32) re.ratio = 0.45;
		if (program == 33) re.ratio = 0.45;
		if (program == 34) re.ratio = 0.45;
		if (program == 35) re.ratio = 0.45;
		if (program == 36) re.ratio = 0.65;
		if (program == 37) re.ratio = 0.65;
		if (program == 38) re.ratio = 0.75;
		if (program == 39) re.ratio = 0.75;

		if (program == 48) re.ratio = 0.25;
		if (program == 49) re.ratio = 0.25;
		if (program == 50) re.ratio = 0.33;
		if (program == 51) re.ratio = 0.25;

		if (program == 65) re.ratio = 0.99;

		if (program == 80) re.ratio = 0.3;
		if (program == 89) re.ratio = 0.4;



		//console.log('program', program, 'not found set 0');
		return re;
	};
	/*
	findModeInstrument(program: number): number {
		if (program == 24) return 4;
		if (program == 25) return 4;
		if (program == 26) return 4;
		if (program == 27) return 4;
		if (program == 29) return 1;
		if (program == 30) return 1;
		return 0;
	};
*/
	addScoreInsTrack(project: Zvoog_Project, scoreTrack: Track, targetId: string) {
		//let perfkind = 'zinstr1';
		//strumMode: 0 | 1 | 2 | 3 | 4 = this.strumModeFlat;	//Flat / Down / Up / Snap / Pong
		let strummode: 0 | 1 | 2 | 3 | 4 = 0;//Flat / Down / Up / Snap / Pong
		if (scoreTrack.playbackInfo.program == 24
			|| scoreTrack.playbackInfo.program == 25
			|| scoreTrack.playbackInfo.program == 26
			|| scoreTrack.playbackInfo.program == 27
			|| scoreTrack.playbackInfo.program == 28
			|| scoreTrack.playbackInfo.program == 29
			|| scoreTrack.playbackInfo.program == 30
		) {
			//perfkind = 'zvstrumming1';
			strummode = 4;
		}
		let idxRatio = this.findVolumeInstrument(scoreTrack.playbackInfo.program);
		let iidx = idxRatio.idx;
		//let imode = this.findModeInstrument(scoreTrack.playbackInfo.program);
		let volume = 1;
		let ivolume = Math.round(volume * 100) * idxRatio.ratio;
		console.log(scoreTrack.playbackInfo.program, scoreTrack.name, idxRatio.ratio);
		//let util = new ChordPitchPerformerUtil();
		//let idata = new ChordPitchPerformerUtil().dumpParameters(ivolume, iidx, imode);
		let midiTitle = this.inames.tonechordinslist()[scoreTrack.playbackInfo.program];
		//console.log(scoreTrack.playbackInfo.program,midiTitle);
		let mzxbxTrack: Zvoog_MusicTrack = {
			title: scoreTrack.name + ': ' + midiTitle
			, measures: []
			, performer: {
				id: 'track' + scoreTrack.playbackInfo.program + Math.random()
				, data: '' + ivolume + '/' + iidx + '/' + strummode
				//, kind: perfkind
				, kind: 'miniumpitchchord1'
				, outputs: [targetId]
				, iconPosition: { x: 0, y: 0 }
				, state: 0
				, hint1_128: 0
			}
		};
		let palmMuteTrack: Zvoog_MusicTrack = {
			title: 'P.M.' + scoreTrack.name + ' ' + this.inames.tonechordinslist[scoreTrack.playbackInfo.program]
			, measures: []
			, performer: {
				id: 'track' + (scoreTrack.playbackInfo.program + Math.random())
				//, data: '' + scoreTrack.playbackInfo.program
				, data: '' + ivolume + '/' + iidx + '/0'
				//, kind: perfkind
				, kind: 'miniumpitchchord1'
				, outputs: [targetId]
				, iconPosition: { x: 0, y: 0 }
				, state: 0
				, hint1_128: 0
			}
		};
		let upTrack: Zvoog_MusicTrack = {
			title: '^' + scoreTrack.name + ' ' + this.inames.tonechordinslist[scoreTrack.playbackInfo.program]
			, measures: []
			, performer: {
				id: 'track' + (scoreTrack.playbackInfo.program + Math.random())
				, data: '' + ivolume + '/' + iidx + '/2'
				//, kind: perfkind
				, kind: 'miniumpitchchord1'
				, outputs: [targetId]
				, iconPosition: { x: 0, y: 0 }
				, state: 0
				, hint1_128: 0
			}
		};
		let downTrack: Zvoog_MusicTrack = {
			title: 'v' + scoreTrack.name + ' ' + this.inames.tonechordinslist[scoreTrack.playbackInfo.program]
			, measures: []
			, performer: {
				id: 'track' + (scoreTrack.playbackInfo.program + Math.random())
				, data: '' + ivolume + '/' + iidx + '/1'
				//, kind: perfkind
				, kind: 'miniumpitchchord1'
				, outputs: [targetId]
				, iconPosition: { x: 0, y: 0 }
				, state: 0
				, hint1_128: 0
			}
		};
		if (scoreTrack.playbackInfo.program == 29
			|| scoreTrack.playbackInfo.program == 30) {
			mzxbxTrack.performer.data = '' + ivolume + '/341/' + strummode;//'30/341';
			palmMuteTrack.performer.data = '' + (Math.round(volume * 100) * idxRatio.ratio * 0.7) + '/323/0';//'29/323';
		}
		let pmFlag = false;
		let upFlag = false;
		let downFlag = false;
		project.tracks.push(mzxbxTrack);
		for (let mm = 0; mm < project.timeline.length; mm++) {
			let mzxbxMeasure: Zvoog_TrackMeasure = { chords: [] };
			let pmMeasure: Zvoog_TrackMeasure = { chords: [] };
			let upMeasure: Zvoog_TrackMeasure = { chords: [] };
			let downMeasure: Zvoog_TrackMeasure = { chords: [] };
			mzxbxTrack.measures.push(mzxbxMeasure);
			palmMuteTrack.measures.push(pmMeasure);
			upTrack.measures.push(upMeasure);
			downTrack.measures.push(downMeasure);
			for (let ss = 0; ss < scoreTrack.staves.length; ss++) {
				let staff = scoreTrack.staves[ss];
				let tuning: number[] = staff.stringTuning.tunings;
				let bar = staff.bars[mm];
				for (let vv = 0; vv < bar.voices.length; vv++) {
					let voice = bar.voices[vv];
					let start: Zvoog_MetreMathType = MMUtil();
					for (let bb = 0; bb < voice.beats.length; bb++) {
						let beat = voice.beats[bb];
						if (beat.automations.length > 0) {
							//console.log(beat.automations, scoreTrack.name);
						}
						//beat.brushType;
						let beatDuration: Zvoog_Metre = this.beatDuration(beat);
						let noteDuration: Zvoog_Metre = MMUtil().set(beatDuration).metre();
						for (let nn = 0; nn < beat.notes.length; nn++) {
							let note = beat.notes[nn];
							//console.log(note.slideTarget,note.slideOrigin);
							if (note.isTieDestination) {
								//
							} else {
								if (note.slideOrigin) {
									//
								} else {
									let pitch = this.stringFret2pitch(note.string, note.fret, tuning, note.octave, note.tone);
									if (note.tieDestination) {
										let tiedNote: Note | null = note.tieDestination;
										while (tiedNote) {
											noteDuration = MMUtil().set(this.beatDuration(tiedNote.beat)).plus(noteDuration).metre();
											tiedNote = tiedNote.tieDestination;
										}
									}
									let slides: Zvoog_Slide[] = [{ duration: noteDuration, delta: 0 }];
									if (note.slideTarget) {
										let targetpitch = this.stringFret2pitch(note.slideTarget.string, note.slideTarget.fret
											, tuning, note.slideTarget.octave, note.slideTarget.tone);
										let targetDuration = this.beatDuration(note.slideTarget.beat).metre();
										slides = [{ duration: noteDuration, delta: targetpitch - pitch }
											, { duration: targetDuration, delta: targetpitch - pitch }];
									}
									if (note.bendType) {
										//console.log(note);
										if (note.bendPoints) {
											slides = [];
											let len = 0;
											let preOffset = 0;
											for (let bp = 0; bp < note.bendPoints.length; bp++) {
												let offset = note.bendPoints[bp].offset / 60;
												let value = note.bendPoints[bp].value / 4;
												len = offset - preOffset;
												preOffset = offset;
												slides.push({
													duration: {
														count: Math.round(1024 * noteDuration.count * len)
														, part: 1024 * noteDuration.part
													}
													, delta: value
												});
												//console.log(slides);
											}
										}
									}
									if (note.isPalmMute) {
										let pmChord: Zvoog_Chord = this.takeChord(start, pmMeasure);
										pmChord.slides = slides;
										if (pmChord.pitches.indexOf(pitch) < 0) pmChord.pitches.push(pitch);
										pmFlag = true;
									} else {
										if (beat.brushType == 1) {
											let upchord: Zvoog_Chord = this.takeChord(start, upMeasure);
											upchord.slides = slides;
											if (upchord.pitches.indexOf(pitch) < 0) upchord.pitches.push(pitch);
											upFlag = true;
										} else {
											if (beat.brushType == 2) {
												let downchord: Zvoog_Chord = this.takeChord(start, downMeasure);
												downchord.slides = slides;
												if (downchord.pitches.indexOf(pitch) < 0) downchord.pitches.push(pitch);
												downFlag = true;
											} else {
												let chord: Zvoog_Chord = this.takeChord(start, mzxbxMeasure);
												chord.slides = slides;
												if (chord.pitches.indexOf(pitch) < 0) chord.pitches.push(pitch);
											}
										}
									}
								}
							}
						}
						start = start.plus(beatDuration);
					}
				}

			}
			//let bar = scoreTrack.staves
		}
		if (pmFlag) {
			project.tracks.push(palmMuteTrack);
		}
		if (upFlag) {
			project.tracks.push(upTrack);
		}
		if (downFlag) {
			project.tracks.push(downTrack);
		}
	}

	beatDuration(beat: Beat): Zvoog_MetreMathType {
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
		// * tupletDenominator/tupletNumerator
		//console.log(beat.id, duration, beat.tupletDenominator, beat.tupletNumerator);
		if (beat.tupletDenominator > 0 && beat.tupletNumerator > 0) {

			duration.count = Math.round((beat.tupletDenominator / beat.tupletNumerator) * 1024 * (duration.count / duration.part));
			duration.part = 1024;
			//console.log(duration);
		}
		return duration.simplyfy();
	}

	stringFret2pitch(stringNum: number, fretNum: number, tuning: number[], octave: number, tone: number): number {
		//console.log(stringNum, fretNum, tuning);
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
		//return -1;
		return 12 * octave + tone;
	}
	takeChord(start: Zvoog_Metre, measure: Zvoog_TrackMeasure): Zvoog_Chord {
		let startBeat = MMUtil().set(start).strip(32);
		//let startBeat = MMUtil().set(start).strip(128);
		for (let cc = 0; cc < measure.chords.length; cc++) {
			if (startBeat.equals(measure.chords[cc].skip)) {
				return measure.chords[cc];
			}
		}
		//let newChord: Zvoog_Chord = { notes: [], skip: { count: start.count, part: start.part } };
		let newChord: Zvoog_Chord = { pitches: [], slides: [], skip: { count: start.count, part: start.part } };
		measure.chords.push(newChord);
		return newChord;
	}

	addScoreDrumsTracks(project: Zvoog_Project, scoreTrack: Track, targetId: string) {
		console.log(scoreTrack);
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
						let currentDuration = this.beatDuration(beat);
						for (let nn = 0; nn < beat.notes.length; nn++) {
							let note = beat.notes[nn];
							let drum = note.percussionArticulation;

							if (drum > 34) {
								//
							} else {

								if (scoreTrack.percussionArticulations) {
									//console.log(drum, scoreTrack.percussionArticulations);
									if (scoreTrack.percussionArticulations.length) {
										if (scoreTrack.percussionArticulations.length > drum && drum > -1) {
											let info = scoreTrack.percussionArticulations[drum];
											//console.log(drum, scoreTrack.name, info);
											drum = info.outputMidiNumber;

										}
									}
								}
							}
							//console.log(mm, bb, drum,note);

							let track = this.takeDrumTrack(scoreTrack.name, trackDrums, drum, targetId);
							let measure = this.takeDrumMeasure(track, mm);
							measure.skips.push(start.strip(32));
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
					this.takeDrumMeasure(trackDrums[tt], mm);
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

	takeDrumMeasure(trackDrum: Zvoog_PercussionTrack, barNum: number): Zvoog_PercussionMeasure {
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
	takeDrumTrack(title: string, trackDrums: Zvoog_PercussionTrack[], drumNum: number, targetId: string): Zvoog_PercussionTrack {
		if (trackDrums[drumNum]) {
			//
		} else {
			//console.log(title, drumNum);
			let idx = firstDrumKeysArrayPercussionPathsMIDI(drumNum);
			let track: Zvoog_PercussionTrack = {
				title: title
				, measures: []
				//, filters: []
				//, sampler: { id: '', data: '', kind: '', outputs: [] }
				, sampler: {
					id: 'drum' + (drumNum + Math.random())
					, data: '100/' + idx
					, kind: 'miniumdrums1'
					, outputs: [targetId]
					, iconPosition: { x: 0, y: 0 }
					, state: 0
					, hint35_81: 0
				}
			};
			if (idx) {
				//
			} else {
				track.sampler.outputs = [];
			}
			trackDrums[drumNum] = track;
		}
		trackDrums[drumNum].title = title + ': ' + allPercussionDrumTitlesMIDI()[drumNum];
		return trackDrums[drumNum];
	}
}



