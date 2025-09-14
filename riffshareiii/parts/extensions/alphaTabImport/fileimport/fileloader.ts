class FileLoaderAlpha {
	inames: ChordPitchPerformerUtil = new ChordPitchPerformerUtil();
	constructor(inputFile) {
		var file = inputFile.files[0];
		var fileReader = new FileReader();
		let me = this;


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

				let path: string = inputFile.value;
				path = path.toLowerCase().trim();
				if (path.endsWith('.gp3') || path.endsWith('.gp4') || path.endsWith('.gp5')) {
					let gp35: Gp3To5Importer = new Gp3To5Importer();
					settings.importer.encoding = 'windows-1251';
					gp35.init(data, settings);
					let score = gp35.readScore();
					me.convertProject(score);
				} else {
					if (path.endsWith('.gpx')) {
						let gpx: GpxImporter = new GpxImporter();
						settings.importer.encoding = 'windows-1251';
						gpx.init(data, settings);
						let score = gpx.readScore();
						me.convertProject(score);
					} else {
						if (path.endsWith('.gp')) {
							let gp78: Gp7To8Importer = new Gp7To8Importer();
							settings.importer.encoding = 'windows-1251';
							gp78.init(data, settings);
							let score = gp78.readScore();
							me.convertProject(score);
						} else {
							if (path.endsWith('.mxl') || path.endsWith('.musicxml')) {
								let mxl: MusicXmlImporter = new MusicXmlImporter();
								settings.importer.encoding = 'windows-1251';
								mxl.init(data, settings);
								let score = mxl.readScore();
								me.convertProject(score);
							} else {
								console.log('wrong path', path);
							}
						}
					}
				}


				//let proj = new Projectr();
				//me.parsedProject = proj.parseRawMIDIdata(arrayBuffer, title, comment);
				//console.log('done zproject', me.parsedProject);
			}
		};
		fileReader.readAsArrayBuffer(file);
	}
	convertProject(score: Score) {
		console.log(score);
		let project: Zvoog_Project = {
			versionCode: '1'
			, title: score.title
			, timeline: []
			, tracks: []
			, percussions: []
			, comments: []
			, filters: []
			, selectedPart: { startMeasure: -1, endMeasure: -1 }
			, position: { x: 0, y: 0, z: 0 }
			, list: false
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
				, metre: {
					count: maBar.timeSignatureNumerator
					, part: maBar.timeSignatureDenominator
				}
			};
			project.timeline.push(measure);

		}
		let echoOutID = 'reverberation';
		let compresID = 'compression';
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
		console.log(project);
	}

	addScoreInsTrack(project: Zvoog_Project, scoreTrack: Track, targetId: string) {
		//let perfkind = 'zinstr1';
		let strummode = 'plain';
		if (scoreTrack.playbackInfo.program == 24
			|| scoreTrack.playbackInfo.program == 25
			|| scoreTrack.playbackInfo.program == 26
			|| scoreTrack.playbackInfo.program == 27
			|| scoreTrack.playbackInfo.program == 28
			|| scoreTrack.playbackInfo.program == 29
			|| scoreTrack.playbackInfo.program == 30
		) {
			//perfkind = 'zvstrumming1';
			strummode = 'pong';
		}
		let mzxbxTrack: Zvoog_MusicTrack = {
			title: scoreTrack.name + ' ' + this.inames.tonechordinslist[scoreTrack.playbackInfo.program]
			, measures: []
			, performer: {
				id: 'track' + (this.inames.tonechordinslist[scoreTrack.playbackInfo.program] + Math.random())
				//, data: '' + scoreTrack.playbackInfo.program + '//pong'
				, data: '' + scoreTrack.playbackInfo.program + '//' + strummode
				//, kind: perfkind
				, kind: 'zvstrumming1'
				, outputs: [targetId]
				, iconPosition: { x: 0, y: 0 }
				, state: 0
			}
		};
		let palmMuteTrack: Zvoog_MusicTrack = {
			title: 'P.M.' + scoreTrack.name + ' ' + this.inames.tonechordinslist[scoreTrack.playbackInfo.program]
			, measures: []
			, performer: {
				id: 'track' + (this.inames.tonechordinslist[scoreTrack.playbackInfo.program] + Math.random())
				, data: '' + scoreTrack.playbackInfo.program
				//, kind: perfkind
				, kind: 'zvstrumming1'
				, outputs: [targetId]
				, iconPosition: { x: 0, y: 0 }
				, state: 0
			}
		};
		let upTrack: Zvoog_MusicTrack = {
			title: '^' + scoreTrack.name + ' ' + this.inames.tonechordinslist[scoreTrack.playbackInfo.program]
			, measures: []
			, performer: {
				id: 'track' + (this.inames.tonechordinslist[scoreTrack.playbackInfo.program] + Math.random())
				, data: '' + scoreTrack.playbackInfo.program + '//up'
				//, kind: perfkind
				, kind: 'zvstrumming1'
				, outputs: [targetId]
				, iconPosition: { x: 0, y: 0 }
				, state: 0
			}
		};
		let downTrack: Zvoog_MusicTrack = {
			title: 'v' + scoreTrack.name + ' ' + this.inames.tonechordinslist[scoreTrack.playbackInfo.program]
			, measures: []
			, performer: {
				id: 'track' + (this.inames.tonechordinslist[scoreTrack.playbackInfo.program] + Math.random())
				, data: '' + scoreTrack.playbackInfo.program + '//down'
				//, kind: perfkind
				, kind: 'zvstrumming1'
				, outputs: [targetId]
				, iconPosition: { x: 0, y: 0 }
				, state: 0
			}
		};
		if (scoreTrack.playbackInfo.program == 29
			|| scoreTrack.playbackInfo.program == 30) {
			mzxbxTrack.performer.data = '30/341';
			palmMuteTrack.performer.data = '29/323';
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
						//beat.brushType;
						let currentDuration = this.beatDuration(beat);
						for (let nn = 0; nn < beat.notes.length; nn++) {
							let note = beat.notes[nn];
							let pitch = this.stringFret2pitch(note.string, note.fret, tuning);
							if (note.isPalmMute) {
								let pmChord: Zvoog_Chord = this.takeChord(start, pmMeasure);
								pmChord.slides = [{ duration: currentDuration, delta: 0 }];
								pmChord.pitches.push(pitch);
								pmFlag = true;
							} else {
								if (beat.brushType == 1) {
									let upchord: Zvoog_Chord = this.takeChord(start, upMeasure);
									upchord.slides = [{ duration: currentDuration, delta: 0 }];
									upchord.pitches.push(pitch);
									upFlag = true;
								} else {
									if (beat.brushType == 2) {
										let downchord: Zvoog_Chord = this.takeChord(start, downMeasure);
										downchord.slides = [{ duration: currentDuration, delta: 0 }];
										downchord.pitches.push(pitch);
										downFlag = true;
									} else {
										let chord: Zvoog_Chord = this.takeChord(start, mzxbxMeasure);
										chord.slides = [{ duration: currentDuration, delta: 0 }];
										chord.pitches.push(pitch);
									}
								}

							}

						}
						start = start.plus(currentDuration);
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
		return duration;
	}

	stringFret2pitch(stringNum: number, fretNum: number, tuning: number[]): number {
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
	takeChord(start: Zvoog_Metre, measure: Zvoog_TrackMeasure): Zvoog_Chord {
		let startBeat = MMUtil().set(start);
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
							let track = this.takeDrumTrack(scoreTrack.name + ': ' + drum, trackDrums, drum, targetId);
							let measure = this.takeDrumMeasure(track, mm);
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
			let track: Zvoog_PercussionTrack = {
				title: title
				, measures: []
				//, filters: []
				//, sampler: { id: '', data: '', kind: '', outputs: [] }
				, sampler: {
					id: 'drum' + (drumNum + Math.random())
					, data: '' + drumNum
					, kind: 'zdrum1'
					, outputs: [targetId]
					, iconPosition: { x: 0, y: 0 }
					, state: 0
				}
			};
			trackDrums[drumNum] = track;
		}
		trackDrums[drumNum].title = title + ' ' + drumNames[drumNum];
		return trackDrums[drumNum];
	}
}



