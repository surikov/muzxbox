class Projectr {
	readProject(midiSongData: MIDISongData, title: string, comment: string): Zvoog_Project {


		let newtimeline: Zvoog_SongMeasure[] = this.createTimeLine(midiSongData);
		let project: Zvoog_Project = {
			title: title// + ' ' + comment
			, timeline: newtimeline
			, tracks: []
			, percussions: []
			, filters: []
			//,automations: []
			, comments: []
			, selectedPart: {
				startMeasure: -1
				, endMeasure: -1
			}
			, versionCode: '1'
			, list: false
			//, undo: []
			//, redo: []
			, position: { x: 0, y: 0, z: 30 }
		};

		let echoOutID = 'reverberation';
		let compresID = 'compression';

		for (let ii = 0; ii < project.timeline.length; ii++) {
			project.comments.push({ points: [] });
		}

		for (let ii = 0; ii < midiSongData.lyrics.length; ii++) {
			let textpoint = midiSongData.lyrics[ii];
			let pnt = findMeasureSkipByTime('lyrics', textpoint.ms / 1000, project.timeline);
			if (pnt) {
				//console.log(pnt.skip, textpoint.ms, textpoint.txt);
				this.addLyricsPoints(project.comments[pnt.idx], { count: pnt.skip.count, part: pnt.skip.part }, textpoint.txt, project.timeline[pnt.idx].tempo);
			}
		}
		this.addLyricsPoints(project.comments[0], { count: 0, part: 4 }, 'import from .mid' + comment, project.timeline[0].tempo);

		let top = 0;
		let outputID = '';
		let volume = 1;
		for (var ii = 0; ii < midiSongData.miditracks.length; ii++) {
			let midiSongTrack: MIDISongTrack = midiSongData.miditracks[ii];
			if (midiSongTrack.trackVolumes.length > 1) {
				let filterID = 'fader' + Math.random();
				let filterVolume: Zvoog_FilterTarget = {
					id: filterID
					, title: 'Fader automation ' + midiSongTrack.title
					, kind: 'miniumfader1'
					, data: '99'
					, outputs: [compresID]
					, iconPosition: { x: 77 + ii * 5, y: ii * 11 + 2 }
					, automation: [], state: 0
				};
				outputID = filterID;
				project.filters.push(filterVolume);
				for (let mm = 0; mm < project.timeline.length; mm++) {
					filterVolume.automation.push({ changes: [] });
				}
				for (let vv = 0; vv < midiSongTrack.trackVolumes.length; vv++) {
					let gain = midiSongTrack.trackVolumes[vv];
					let vol = '' + Math.round(gain.value * 100) + '%';
					let pnt = findMeasureSkipByTime('v' + ii, gain.ms / 1000, project.timeline);

					//
					if (pnt) {
						pnt.skip = MMUtil().set(pnt.skip).strip(16);
						for (let aa = 0; aa < filterVolume.automation[pnt.idx].changes.length; aa++) {
							let sk = filterVolume.automation[pnt.idx].changes[aa].skip;
							if (MMUtil().set(sk).equals(pnt.skip)) {
								filterVolume.automation[pnt.idx].changes.splice(aa, 1);
								break;
							}
						}
						filterVolume.automation[pnt.idx].changes.push({ skip: pnt.skip, stateBlob: vol });
					}
				}
			} else {
				outputID = compresID;
				if (midiSongTrack.trackVolumes.length == 1) {
					volume = 1 * midiSongTrack.trackVolumes[0].value;
				} else {
					//console.log(midiSongTrack.title,'default');
				}

			}

			if (midiSongTrack.channelNum == 9) {
				let drums: number[] = this.collectDrums(midiSongTrack);
				for (let dd = 0; dd < drums.length; dd++) {
					project.percussions.push(this.createProjectDrums(1, top * 9, drums[dd], project.timeline, midiSongTrack, outputID));
					top++;
				}
			} else {
				project.tracks.push(this.createProjectTrack(volume, top * 8, project.timeline, midiSongTrack, outputID));
				top++;
			}
		}
		let filterEcho: Zvoog_FilterTarget = {
			id: echoOutID
			, title: echoOutID
			, kind: 'miniumecho1'
			, data: '22'
			, outputs: ['']
			, iconPosition: {
				x: 77 + midiSongData.miditracks.length * 30
				, y: midiSongData.miditracks.length * 8 + 2
			}
			, automation: [], state: 0
		};
		let filterCompression: Zvoog_FilterTarget = {
			id: compresID
			, title: compresID
			, kind: 'miniumdcompressor1'
			, data: '33'
			, outputs: [echoOutID]
			, iconPosition: {
				x: 88 + midiSongData.miditracks.length * 30
				, y: midiSongData.miditracks.length * 8 + 2
			}
			, automation: [], state: 0
		};
		project.filters.push(filterEcho);
		project.filters.push(filterCompression);

		for (let mm = project.timeline.length - 2; mm >= 0; mm--) {
			for (let ff = 0; ff < project.filters.length; ff++) {
				if (!(project.filters[ff].automation[mm])) {
					project.filters[ff].automation[mm] = { changes: [] };
				}
			}
			for (let cc = 0; cc < project.comments.length; cc++) {
				if (!(project.comments[mm])) {
					project.comments[mm] = { points: [] };
				}
			}
		}





		let needSlice = (midiSongData.meters.length < 2)
			//&& (midiSongData.changes.length < 3)
			&& (project.timeline[0].metre.count / project.timeline[0].metre.part == 1)
			;
		this.trimProject(project, needSlice);

		return project;
	}

	createTimeLine(midiSongData: MIDISongData): Zvoog_SongMeasure[] {
		let count = 0;
		let part = 0;
		let bpm = 0;

		let timeline: Zvoog_SongMeasure[] = [];
		let fromMs = 0;
		while (fromMs < midiSongData.duration) {
			let measure: ImportMeasure = this.createMeasure(midiSongData, fromMs, timeline.length);
			fromMs = fromMs + measure.durationMs;

			if (count != measure.metre.count || part != measure.metre.part || bpm != measure.tempo) {

				count = measure.metre.count;
				part = measure.metre.part;
				bpm = measure.tempo;
			} else {
				//console.log(timeline.length, measure.startMs);
			}
			timeline.push(measure);
		}
		return timeline;
	}
	createMeasure(midiSongData: MIDISongData, fromMs: number, barIdx: number): ImportMeasure {
		let change = this.findLastChange(midiSongData, fromMs);
		let meter: Zvoog_Metre = this.findLastMeter(midiSongData, fromMs, barIdx);
		let duration = this.calcMeasureDuration(midiSongData, meter, change.bpm, 1, fromMs);
		let measure: ImportMeasure = {
			tempo: change.bpm
			, metre: meter
			, startMs: fromMs
			, durationMs: duration
		};
		return measure;
	}


	findLastChange(midiSongData: MIDISongData, beforeMs: number): { track: number, ms: number, resolution: number, bpm: number } {
		let nextChange: { track: number, ms: number, resolution: number, bpm: number } = { track: 0, ms: 0, resolution: 0, bpm: 120 };
		for (let ii = 1; ii < midiSongData.changes.length; ii++) {
			if (midiSongData.changes[ii].ms > beforeMs + 1) {
				break;
			}
			nextChange = midiSongData.changes[ii];
		}
		return nextChange;
	}

	findLastMeter(midiSongData: MIDISongData, beforeMs: number, barIdx: number): Zvoog_Metre {
		let metre: Zvoog_Metre = {
			count: midiSongData.meter.count
			, part: midiSongData.meter.division
		};
		let midimeter: { track: number, ms: number, count: number, division: number } = { track: 0, ms: 0, count: 4, division: 4 };
		for (let mi = 0; mi < midiSongData.meters.length; mi++) {
			if (midiSongData.meters[mi].ms > beforeMs + 1 + barIdx * 3) {
				break;
			}
			midimeter = midiSongData.meters[mi];
		}
		metre.count = midimeter.count;
		metre.part = midimeter.division;
		return metre;
	}

	calcMeasureDuration(midiSongData: MIDISongData, meter: Zvoog_Metre, bpm: number, part: number, startMs: number): number {
		let metreMath = MMUtil();
		let wholeDurationMs = 1000 * metreMath.set(meter).duration(bpm);
		let partDurationMs = part * wholeDurationMs;
		let nextChange = this.findNextChange(midiSongData, startMs);
		if (startMs < nextChange.ms && nextChange.ms < startMs + partDurationMs) {
			let diffMs = nextChange.ms - startMs;
			let ratio = diffMs / partDurationMs;
			let newPart = ratio * part
			let newPartDurationMs = newPart * wholeDurationMs;
			let remainsMs = this.calcMeasureDuration(midiSongData, meter, nextChange.bpm, part - newPart, nextChange.ms);
			return newPartDurationMs + remainsMs;
		} else {
			return partDurationMs;
		}
	}

	findNextChange(midiSongData: MIDISongData, afterMs: number): { track: number, ms: number, resolution: number, bpm: number } {
		let nextChange: { track: number, ms: number, resolution: number, bpm: number } = { track: 0, ms: 0, resolution: 0, bpm: 120 };
		for (let ii = 1; ii < midiSongData.changes.length; ii++) {
			if (midiSongData.changes[ii].ms > afterMs) {
				nextChange = midiSongData.changes[ii];
				break;
			}
		}
		return nextChange;
	}

	addLyricsPoints(commentPoint: Zvoog_CommentMeasure, skip: Zvoog_Metre, txt: string, tempo: number) {
		txt = txt.replace(/(\r)/g, '~');
		txt = txt.replace(/\\r/g, '~');
		txt = txt.replace(/(\n)/g, '~');
		txt = txt.replace(/\\n/g, '~');
		txt = txt.replace(/(~~)/g, '~');
		txt = txt.replace(/(~~)/g, '~');
		txt = txt.replace(/(~~)/g, '~');
		txt = txt.replace(/(~~)/g, '~');
		let strings: string[] = txt.split('~');
		if (strings.length) {
			let roundN = 750;
			let nextMs = 1000 * MMUtil().set(skip).duration(tempo);
			for (let ii = 0; ii < strings.length; ii++) {
				let row = 0;
				for (let ii = 0; ii < commentPoint.points.length; ii++) {
					let existsMs = 1000 * MMUtil().set(commentPoint.points[ii].skip).duration(tempo);
					if (Math.floor(Math.floor(existsMs / roundN) * roundN) == Math.floor(Math.floor(nextMs / roundN) * roundN)) {
						row++;
					}
				}
				commentPoint.points.push({ skip: skip, text: strings[ii].trim(), row: row });
			}
		}
	}
	collectDrums(midiTrack: MIDISongTrack): number[] {
		let drums: number[] = [];
		for (let ii = 0; ii < midiTrack.songchords.length; ii++) {
			let chord = midiTrack.songchords[ii];
			for (let kk = 0; kk < chord.notes.length; kk++) {
				let note = chord.notes[kk];
				if (drums.indexOf(note.midiPitch) < 0) {
					drums.push(note.midiPitch);
				}
			}
		}
		return drums;
	}
	findVolumeDrum(midi: number): { idx: number, ratio: number } {
		let re = { idx: 0, ratio: 1 };
		//let instrs = new ChordPitchPerformerUtil().tonechordinstrumentKeys();
		let pre = '' + midi;
		for (let nn = 0; nn < drumKeysArrayPercussionPaths.length; nn++) {
			if (drumKeysArrayPercussionPaths[nn].startsWith(pre)) {
				re.idx = nn;
				break;
			}
		}


		return re;
	};
	createProjectDrums(volume: number, top: number, drum: number, timeline: Zvoog_SongMeasure[], midiTrack: MIDISongTrack, outputId: string): Zvoog_PercussionTrack {
		let idxratio = this.findVolumeDrum(drum);
		let drumvolidx = '' + Math.round(volume * 100) + '/' + idxratio.idx;

		let projectDrums: Zvoog_PercussionTrack = {
			//title: midiTrack.title + ' ' + drumNames[drum]

			title: midiTrack.title + ' ' + allPercussionDrumTitles()[drum]
			, measures: []
			, sampler: {
				id: 'drum' + (drum + Math.random())
				//, data: '' + drum
				, data: drumvolidx
				//, kind: 'zdrum1'
				, kind: 'miniumdrums1'
				, outputs: [outputId]
				, iconPosition: { x: top * 1.5, y: top / 2 }, state: 0
			}
			//, volume: volume
		};
		console.log(('' + midiTrack.title + ' ' + allPercussionDrumTitles()[drum]), drum, drumvolidx);
		if (!(drum >= 35 && drum <= 81)) {
			projectDrums.sampler.outputs = [];
		}
		let currentTimeMs = 0;
		let mm = MMUtil();
		for (let tt = 0; tt < timeline.length; tt++) {
			let projectMeasure: Zvoog_PercussionMeasure = { skips: [] };
			projectDrums.measures.push(projectMeasure);
			let nextMeasure = timeline[tt];
			let measureDurationS = mm.set(nextMeasure.metre).duration(nextMeasure.tempo);
			for (let ii = 0; ii < midiTrack.songchords.length; ii++) {
				let chord = midiTrack.songchords[ii];
				for (let kk = 0; kk < chord.notes.length; kk++) {
					let note = chord.notes[kk];
					//for (let pp = 0; pp < note.slidePoints.length; pp++) {
					let pitch = note.midiPitch;
					if (pitch == drum) {
						if (chord.when >= currentTimeMs && chord.when < currentTimeMs + measureDurationS * 1000) {
							let skip = mm.calculate((chord.when - currentTimeMs) / 1000, nextMeasure.tempo);
							projectMeasure.skips.push(skip);
						}
					}
					//}
				}
			}
			currentTimeMs = currentTimeMs + measureDurationS * 1000;
		}
		//console.log(projectDrums);
		return projectDrums;
	}
	findVolumeInstrument(program: number): { idx: number, ratio: number } {
		let re = { idx: 0, ratio: 0.7 };
		let instrs = new ChordPitchPerformerUtil().tonechordinstrumentKeys();
		for (var i = 0; i < instrs.length; i++) {
			if (program == 1 * parseInt(instrs[i].substring(0, 3))) {
				re.idx = i;
				break;
			}
		}
		if (program == 51) re.ratio = 0.4;
		if (program == 89) re.ratio = 0.4;
		if (program == 50) re.ratio = 0.5;
		if (program == 27) re.ratio = 0.85;

		//console.log('program', program, 'not found set 0');
		return re;
	};
	findModeInstrument(program: number): number {
		if (program == 24) return 4;
		if (program == 25) return 4;
		if (program == 26) return 4;
		if (program == 27) return 4;
		if (program == 29) return 1;
		if (program == 30) return 1;
		return 0;
	};
	createProjectTrack(volume: number, top: number, timeline: Zvoog_SongMeasure[], midiTrack: MIDISongTrack, outputId: string): Zvoog_MusicTrack {
		//let perfkind = 'zinstr1';
		/*let strummode='plain';
		if (midiTrack.program == 24
			|| midiTrack.program == 25
			|| midiTrack.program == 26
			|| midiTrack.program == 27
			|| midiTrack.program == 28
			|| midiTrack.program == 29
			|| midiTrack.program == 30
		) {
			//perfkind = 'zvstrumming1';
			strummode='pong';
		}*/
		let idxRatio = this.findVolumeInstrument(midiTrack.program);
		let iidx = idxRatio.idx;
		let imode = this.findModeInstrument(midiTrack.program);//Flat / Down / Up / Snap / Pong
		let ivolume = Math.round(volume * 100) * idxRatio.ratio;
		let idata = new ChordPitchPerformerUtil().dumpParameters(ivolume, iidx, imode);
		//console.log('createProjectTrack', volume, midiTrack.title, idata);
		let projectTrack: Zvoog_MusicTrack = {
			//title: midiTrack.title + ' ' + insNames[midiTrack.program]
			title: midiTrack.title + ' ' + new ChordPitchPerformerUtil().tonechordinslist()[midiTrack.program]
			, measures: []
			//, filters: []
			, performer: {
				id: 'track' + (midiTrack.program + Math.random())
				//, data: '' + midiTrack.program+'//'+strummode
				, data: idata
				//, kind: perfkind
				//, kind: 'zvstrumming1'
				, kind: 'miniumpitchchord1'

				, outputs: [outputId]
				, iconPosition: { x: top * 2, y: top }
				, state: 0
			}
			//, volume: volume
		};
		console.log((midiTrack.title + ' ' + new ChordPitchPerformerUtil().tonechordinslist()[midiTrack.program]), midiTrack.program, idata);
		/*if(midiTrack.program==65){
			projectTrack.performer.data='' + midiTrack.program+'//'+strummode+'/90'
		}
		if(midiTrack.program==49){
			projectTrack.performer.data='' + midiTrack.program+'//'+strummode+'/20'
		}
		if(midiTrack.program==80){
			projectTrack.performer.data='' + midiTrack.program+'//'+strummode+'/20'
		}
		if(midiTrack.program==38){
			projectTrack.performer.data='' + midiTrack.program+'//'+strummode+'/90'
		}
		if(midiTrack.program==16){
			projectTrack.performer.data='' + midiTrack.program+'//'+strummode+'/20'
		}*/
		if (!(midiTrack.program >= 0 && midiTrack.program <= 127)) {
			projectTrack.performer.outputs = [];
		}
		let mm = MMUtil();
		for (let tt = 0; tt < timeline.length; tt++) {
			let projectMeasure: Zvoog_TrackMeasure = { chords: [] };
			projectTrack.measures.push(projectMeasure);
			let nextMeasure: Zvoog_SongMeasure = timeline[tt];
			for (let ii = 0; ii < midiTrack.songchords.length; ii++) {
				let midiChord = midiTrack.songchords[ii];
				if (
					this.numratio(midiChord.when) >= (nextMeasure as any).startMs //this.numratio(currentMeasureStart) - 33
					&& this.numratio(midiChord.when) < (nextMeasure as any).startMs + (nextMeasure as any).durationMs //this.numratio(currentMeasureStart + measureDurationMs) - 33
				) {
					let trackChord: Zvoog_Chord | null = null;
					let skip = mm.calculate((midiChord.when - (nextMeasure as any).startMs) / 1000.0, nextMeasure.tempo).strip(32);
					if (skip.count < 0) {
						skip.count = 0;
					}
					for (let cc = 0; cc < projectMeasure.chords.length; cc++) {
						if (mm.set(projectMeasure.chords[cc].skip).equals(skip)) {
							trackChord = projectMeasure.chords[cc];
						}
					}
					if (trackChord == null) {
						trackChord = { skip: skip, pitches: [], slides: [] };
						projectMeasure.chords.push(trackChord);
					}
					if (trackChord) {
						for (let nn = 0; nn < midiChord.notes.length; nn++) {
							let midiNote: MIDISongNote = midiChord.notes[nn];
							if (midiNote.slidePoints.length > 0) {
								trackChord.slides = [];
								let bendDurationMs = 0;
								for (let pp = 0; pp < midiNote.slidePoints.length; pp++) {
									let midiSlidePoint: MIDISongPoint = midiNote.slidePoints[pp];
									let xduration: Zvoog_Metre = mm.calculate(midiSlidePoint.durationms / 1000.0, nextMeasure.tempo);
									trackChord.slides.push({
										duration: xduration
										, delta: midiSlidePoint.pitch - midiNote.midiPitch
									});
									bendDurationMs = bendDurationMs + midiSlidePoint.durationms;
								}
								let remains = midiNote.midiDuration - bendDurationMs;
								if (remains > 0) {
									trackChord.slides.push({
										duration: mm.calculate(remains / 1000.0, nextMeasure.tempo)
										, delta: midiNote.slidePoints[midiNote.slidePoints.length - 1].pitch - midiNote.midiPitch
									});
								}


							} else {
								trackChord.slides = [{
									duration: mm.calculate(midiNote.midiDuration / 1000.0
										, nextMeasure.tempo), delta: 0
								}];
							}
							trackChord.pitches.push(midiNote.midiPitch);
						}
					}
				}
			}
		}
		return projectTrack;
	}
	/*noreslide(trackChord: Zvoog_Chord, midiNote: MIDISongNote, nextMeasure: Zvoog_SongMeasure) {
		trackChord.slides = [];
		let bendDurationMs = 0;
		let mm = MMUtil();
		for (let pp = 0; pp < midiNote.slidePoints.length; pp++) {
			let midiPoint:MIDISongPoint = midiNote.slidePoints[pp];
			let xduration:Zvoog_Metre = mm.calculate(midiPoint.durationms / 1000.0, nextMeasure.tempo);
			trackChord.slides.push({
				duration: xduration
				, delta: midiNote.midiPitch - midiPoint.pitch
			});
			bendDurationMs = bendDurationMs + midiPoint.durationms;
		}
		let remains = midiNote.midiDuration - bendDurationMs;
		if (remains > 0) {
			trackChord.slides.push({
				duration: mm.calculate(remains / 1000.0, nextMeasure.tempo)
				, delta: midiNote.midiPitch - midiNote.slidePoints[midiNote.slidePoints.length - 1].pitch
			});
		}
	}*/
	/*reslideChord(trackChord: Zvoog_Chord, midiNote: MIDISongNote, nextMeasure: Zvoog_SongMeasure) {
		trackChord.slides = [];
		let bendDurationMs = 0;
		let mm = MMUtil();
		for (let pp = 0; pp < midiNote.slidePoints.length; pp++) {
			let midiPoint:MIDISongPoint = midiNote.slidePoints[pp];
			let xduration:Zvoog_Metre = mm.calculate(midiPoint.durationms / 1000.0, nextMeasure.tempo);
			trackChord.slides.push({
				duration: xduration
				, delta: midiNote.midiPitch - midiPoint.pitch
			});
			bendDurationMs = bendDurationMs + midiPoint.durationms;
		}
		let remains = midiNote.midiDuration - bendDurationMs;
		if (remains > 0) {
			trackChord.slides.push({
				duration: mm.calculate(remains / 1000.0, nextMeasure.tempo)
				, delta: midiNote.midiPitch - midiNote.slidePoints[midiNote.slidePoints.length - 1].pitch
			});
		}
		console.log(midiNote.slidePoints,trackChord.slides);
	}*/

	trimProject(project: Zvoog_Project, reslice: boolean) {
		let hh = 12 * 6 * 1 + project.percussions.length * 3 + 17;
		for (let ii = 0; ii < project.tracks.length; ii++) {
			project.tracks[ii].performer.iconPosition.x = 10 + ii * 4;
			project.tracks[ii].performer.iconPosition.y = 0 + ii * 9;
		}
		for (let ii = 0; ii < project.percussions.length; ii++) {
			project.percussions[project.percussions.length - ii - 1].sampler.iconPosition.x = 110 + project.tracks.length * 4 + project.percussions.length * 4 - ii * 8;
			project.percussions[project.percussions.length - ii - 1].sampler.iconPosition.y = hh - ii * 6;
		}
		for (let ii = 0; ii < project.filters.length - 2; ii++) {
			project.filters[ii].iconPosition.x = 120 + project.tracks.length * 4 + project.percussions.length * 8 + ii * 5;
			project.filters[ii].iconPosition.y = ii * 6;
		}

		project.filters[project.filters.length - 2].iconPosition.x = 150 + project.tracks.length * 9 + project.percussions.length * 8 + project.filters.length * 4;
		project.filters[project.filters.length - 2].iconPosition.y = hh * 0.7;

		project.filters[project.filters.length - 1].iconPosition.x = 120 + project.tracks.length * 9 + project.percussions.length * 8 + project.filters.length * 4;
		project.filters[project.filters.length - 1].iconPosition.y = hh * 0.4;
		/*
				for (let tt = 0; tt < project.tracks.length; tt++) {
					let track = project.tracks[tt];
					for (let mm = 0; mm < track.measures.length; mm++) {
						let measure = track.measures[mm];
						for (let cc = 0; cc < measure.chords.length; cc++) {
							let chord = measure.chords[cc];
							chord.skip = MMUtil().set(chord.skip);
						}
					}
				}
				for (let ss = 0; ss < project.percussions.length; ss++) {
					let sampleTrack = project.percussions[ss];
					for (let mm = 0; mm < sampleTrack.measures.length; mm++) {
						let measure = sampleTrack.measures[mm];
						for (let mp = 0; mp < measure.skips.length; mp++) {
							let newSkip = MMUtil().set(measure.skips[mp]);
							measure.skips[mp].count = newSkip.count;
							measure.skips[mp].part = newSkip.part;
						}
					}
				}*/
		for (let bb = project.timeline.length - 2; bb > 0; bb--) {
			let barMetre = MMUtil().set(project.timeline[bb].metre);
			for (let tt = 0; tt < project.tracks.length; tt++) {
				let track = project.tracks[tt];
				//let trmeasure = track.measures[bb];
				for (let cc = 0; cc < track.measures[bb].chords.length; cc++) {
					let chord = track.measures[bb].chords[cc];
					if (chord.skip.count < 0) {
						chord.skip.count = 0;
					}
					if (!barMetre.more(chord.skip)) {
						track.measures[bb].chords.splice(cc, 1);
						chord.skip = MMUtil().set(chord.skip).minus(barMetre);
						track.measures[bb + 1].chords.push(chord);
						cc--;
					}
				}
			}
			for (let ss = 0; ss < project.percussions.length; ss++) {
				let sampleTrack = project.percussions[ss];
				//let sameasure = sampleTrack.measures[bb];
				for (let mp = 0; mp < sampleTrack.measures[bb].skips.length; mp++) {
					if (sampleTrack.measures[bb].skips[mp].count < 0) {
						sampleTrack.measures[bb].skips[mp].count = 0;
					}
					if (!barMetre.more(sampleTrack.measures[bb].skips[mp])) {
						let newSkip = MMUtil().set(sampleTrack.measures[bb].skips[mp]).minus(barMetre);
						sampleTrack.measures[bb + 1].skips.push(newSkip);
						sampleTrack.measures[bb].skips.splice(mp, 1);
						mp--;
					}
				}
			}
		}

		for (let mm = project.timeline.length - 1; mm > 0; mm--) {
			for (let ff = 0; ff < project.filters.length; ff++) {
				let filter = project.filters[ff].automation;
				let cuAuto = filter[mm];
				let preAUto = filter[mm - 1];
				let preMetre = MMUtil().set(project.timeline[mm].metre);
				for (let cc = 0; cc < preAUto.changes.length; cc++) {
					let change = preAUto.changes[cc];
					if (preMetre.more(change.skip)) {
						//
					} else {
						preAUto.changes.splice(cc, 1);
						cc--;
						change.skip = MMUtil().set(change.skip).minus(preMetre);
						cuAuto.changes.push(change);
					}
				}
			}
		}


		this.limitShort(project)
		if (reslice) {

			let durations: { len: number, shft: number }[] = [];
			for (let ii = 0; ii < 32; ii++) {
				let len: Zvoog_Metre = this.calculateShift32(project, ii);
				let nn = 32 - ii;
				if (ii == 0) {
					nn = 0;
				}
				durations.push({ len: Math.round(len.count / len.part), shft: nn });
			}
			durations.sort((a, b) => {

				return b.len - a.len;
			});
			//console.log(durations);
			let top: { len: number, shft: number }[] = [durations[0]];
			for (let ii = 1; ii < durations.length; ii++) {
				if (durations[ii].len * 2 > durations[0].len) {
					top.push(durations[ii]);
				}
			}
			top.sort((a, b) => { return a.shft - b.shft });
			//console.log(top);
			let shsize = top[0].shft;
			if (shsize) {
				//console.log('shift', '' + shsize + '/32');
				this.shiftForwar32(project, shsize)
			}

		}

		let len = project.timeline.length;
		for (let ii = len - 1; ii > 0; ii--) {
			if (this.isBarEmpty(ii, project)) {
				//
			} else {
				project.timeline.length = ii + 2;
				return;
			}
		}


	}
	limitShort(project: Zvoog_Project) {
		let note16 = MMUtil().set({ count: 1, part: 16 });
		for (let tt = 0; tt < project.tracks.length; tt++) {
			let track = project.tracks[tt];
			for (let mm = 0; mm < track.measures.length; mm++) {
				let measure = track.measures[mm];
				for (let cc = 0; cc < measure.chords.length; cc++) {
					let chord = measure.chords[cc];
					if (chord.slides.length == 1) {
						chord.slides[0].duration = MMUtil().set(chord.slides[0].duration).simplyfy();
						if (note16.more(chord.slides[0].duration)) {
							chord.slides[0].duration = note16;
						}
					}
				}
			}
		}
	}

	calculateShift32(project: Zvoog_Project, count32: number): Zvoog_Metre {
		let ticker: Zvoog_MetreMathType = MMUtil().set({ count: count32, part: 32 });
		let duration: Zvoog_MetreMathType = MMUtil().set({ count: 0, part: 32 });
		for (let mm = 0; mm < project.timeline.length; mm++) {
			duration = duration.plus(project.timeline[mm].metre);
		}
		let smm = MMUtil().set({ count: 0, part: 32 });
		while (ticker.less(duration)) {
			let pointLen = this.extractPointStampDuration(project, ticker);
			//console.log(ticker,pointLen);
			smm = smm.plus(pointLen).strip(32);
			ticker = ticker.plus({ count: 1, part: 1 });

		}
		//console.log(count32,smm);
		return smm.strip(32);
	}


	extractPointStampDuration(project: Zvoog_Project, at: Zvoog_Metre): Zvoog_Metre {
		//console.log('extractPointStampDuration',at);
		let pointSumm: Zvoog_MetreMathType = MMUtil().set({ count: 0, part: 32 });
		let end: Zvoog_MetreMathType = MMUtil().set({ count: 0, part: 32 });
		for (let mm = 0; mm < project.timeline.length; mm++) {
			let barStart = end.simplyfy();
			end = end.plus(project.timeline[mm].metre).strip(32);
			if (end.more(at)) {
				let skip = MMUtil().set(at).minus(barStart);
				for (let pp = 0; pp < project.tracks.length; pp++) {
					let track = project.tracks[pp];
					let trackBar = track.measures[mm];
					for (let ss = 0; ss < trackBar.chords.length; ss++) {
						let chord = trackBar.chords[ss];
						let chordSkip = MMUtil().set(chord.skip).strip(32);
						if (skip.strip(32).equals(chordSkip)) {
							let chordLen: Zvoog_MetreMathType = MMUtil().set({ count: 0, part: 32 });
							for (let ss = 0; ss < chord.slides.length; ss++) {
								chordLen = chordLen.plus(chord.slides[ss].duration).strip(32);
							}
							pointSumm = pointSumm.plus(chordLen).strip(32);
							break;
						}
					}
				}

				for (let dd = 0; dd < project.percussions.length; dd++) {
					let drum = project.percussions[dd];
					let drumBar = drum.measures[mm];
					let drumDuration = { count: 1, part: 16 };
					if (drum.sampler.data == '35' || drum.sampler.data == '36') {//kick
						drumDuration = { count: 8, part: 16 };
					} else {
						if (drum.sampler.data == '38' || drum.sampler.data == '40') {//snare
							drumDuration = { count: 2, part: 16 };
						}
					}
					for (let ss = 0; ss < drumBar.skips.length; ss++) {
						let drumSkip = MMUtil().set(drumBar.skips[ss]).strip(32);
						if (skip.strip(32).equals(drumSkip)) {
							pointSumm = pointSumm.plus(drumDuration).strip(32);
							break;
						}
					}
					//console.log(drum.sampler.data,drum.title,drumDuration);
				}
				break;
			}
		}
		//console.log(pointSumm);
		return pointSumm;
	}
	numratio(nn: number): number {
		let rr = 1;//0000;
		return Math.round(nn * rr);
	}


	shiftForwar32(project: Zvoog_Project, amount: number) {
		for (let mm = project.timeline.length - 2; mm >= 0; mm--) {
			let measureDuration = MMUtil().set(project.timeline[mm].metre);
			for (let tt = 0; tt < project.tracks.length; tt++) {
				let track = project.tracks[tt];
				let trackMeasure = track.measures[mm];
				let trackNextMeasure = track.measures[mm + 1];
				for (let cc = 0; cc < trackMeasure.chords.length; cc++) {
					let chord = trackMeasure.chords[cc];
					let newSkip = MMUtil().set(chord.skip).plus({ count: amount, part: 32 });
					if (measureDuration.more(newSkip)) {
						chord.skip = newSkip.simplyfy();
					} else {
						trackMeasure.chords.splice(cc, 1);
						cc--;
						trackNextMeasure.chords.push(chord);
						chord.skip = newSkip.minus(measureDuration).simplyfy();
					}
				}
			}
			for (let ss = 0; ss < project.percussions.length; ss++) {
				let sampleTrack = project.percussions[ss];
				let sampleMeasure = sampleTrack.measures[mm];
				let sampleNextMeasure = sampleTrack.measures[mm + 1];
				for (let mp = 0; mp < sampleMeasure.skips.length; mp++) {
					let newSkip = MMUtil().set(sampleMeasure.skips[mp]).plus({ count: amount, part: 32 });
					if (measureDuration.more(newSkip)) {
						sampleMeasure.skips[mp] = newSkip.simplyfy();
					} else {
						sampleMeasure.skips.splice(mp, 1);
						mp--;
						sampleNextMeasure.skips.push(newSkip.minus(measureDuration).simplyfy());
					}
				}
			}
			for (let cc = 0; cc < project.comments.length; cc++) {
				let comMeasure = project.comments[mm];
				let comNextMeasure = project.comments[mm + 1];
				for (let pp = 0; pp < comMeasure.points.length; pp++) {
					let point = comMeasure.points[pp];
					let newSkip = MMUtil().set(point.skip).plus({ count: amount, part: 32 });
					if (measureDuration.more(newSkip)) {
						point.skip = newSkip.simplyfy();
					} else {
						comMeasure.points.splice(pp, 1);
						pp--;
						comNextMeasure.points.push(point);
						point.skip = newSkip.minus(measureDuration).simplyfy();
					}
				}
			}
			for (let ff = 0; ff < project.filters.length; ff++) {
				let autoMeasure = project.filters[ff].automation[mm];
				let autoNextMeasure = project.filters[ff].automation[mm + 1];
				for (let cc = 0; cc < autoMeasure.changes.length; cc++) {
					let change = autoMeasure.changes[cc];
					let newSkip = MMUtil().set(change.skip).plus({ count: amount, part: 32 });
					if (measureDuration.more(newSkip)) {
						change.skip = newSkip.simplyfy();
					} else {
						autoMeasure.changes.splice(cc, 1);
						cc--;
						autoNextMeasure.changes.push(change);
						change.skip = newSkip.minus(measureDuration).simplyfy();
					}
				}
			}
		}
	}
	isBarEmpty(barIdx: number, project: Zvoog_Project): boolean {
		for (let tt = 0; tt < project.tracks.length; tt++) {
			let track = project.tracks[tt];
			if (track.measures[barIdx]) {
				if (track.measures[barIdx].chords.length) {
					return false;
				}
			}
		}
		for (let tt = 0; tt < project.percussions.length; tt++) {
			let drum = project.percussions[tt];
			if (drum.measures[barIdx]) {
				if (drum.measures[barIdx].skips.length) {
					return false;
				}
			}
		}
		return true;
	}

}

