//type TrackNumChanNum = { trackNum: number, channelNum: number, zvoogtrack: Zvoog_MusicTrack };
type MIDITrackInfo = {
	midiTrack: number
	, midiChan: number
	, trackVolumePoints: { ms: number, value: number, channel: number }[]
	, title: string
};
type MIDIDrumInfo = {
	midiTrack: number
	, midiPitch: number
	, trackVolumePoints: { ms: number, value: number, channel: number }[]
	, title: string
};
class EventsConverter {
	parser: MidiParser;
	constructor(parser: MidiParser) {
		this.parser = parser;
	}
	convertEvents(name: string): Zvoog_Project {
		let project: Zvoog_Project = {
			title: name
			, timeline: []
			, tracks: []
			, percussions: []
			, filters: []
			, comments: []
			, selectedPart: {
				startMeasure: -1
				, endMeasure: -1
			}
			, versionCode: '1'
			, list: false
			, position: { x: 0, y: 0, z: 30 }
			, menuPerformers: false
			, menuSamplers: false
			, menuFilters: false
			, menuActions: false
			, menuPlugins: false
			, menuClipboard: false
			, menuSettings: false
		};
		let allNotes: TrackNote[] = [];
		let allTracks: MIDITrackInfo[] = [];
		let allPercussions: MIDIDrumInfo[] = [];
		this.collectNotes(allNotes, allTracks, allPercussions);
		/*
		for (let ii = 0; ii < this.parser.parsedTracks.length; ii++) {
			let parsedtrack: MIDIFileTrack = this.parser.parsedTracks[ii];
			for (let nn = 0; nn < parsedtrack.trackNotes.length; nn++) {
				allNotes.push(parsedtrack.trackNotes[nn]);
				if (parsedtrack.trackNotes[nn].channelidx == 9) {
					this.takeProSamplerNo(allPercussions, ii, parsedtrack.trackNotes[nn].basePitch, parsedtrack.trackVolumePoints);
				} else {
					this.takeProTrackNo(allTracks, ii, parsedtrack.trackNotes[nn].channelidx, parsedtrack.trackVolumePoints);
				}
			}
		}
		allNotes.sort((a, b) => { return a.startMs - b.startMs; });
		*/
		//console.log(allNotes);
		//console.log(allTracks);
		//console.log(allPercussions);
		let lastMs = allNotes[allNotes.length - 1].startMs;
		let barCount = 1 + Math.ceil(0.5 * lastMs / 1000);
		for (let ii = 0; ii < barCount; ii++) {
			project.timeline.push({
				tempo: 120
				, metre: {
					count: 4
					, part: 4
				}
			});
		}

		let echoOutID = 'reverberation';
		let compresID = 'compression';
		let filterEcho: Zvoog_FilterTarget = {
			id: echoOutID
			, title: echoOutID
			, kind: 'miniumecho1'
			, data: '22'
			, outputs: ['']
			, iconPosition: { x: 0, y: 0 }
			, automation: [], state: 0
		};
		let filterCompression: Zvoog_FilterTarget = {
			id: compresID
			, title: compresID
			, kind: 'miniumdcompressor1'
			, data: '33'
			, outputs: [echoOutID]
			, iconPosition: { x: 0, y: 0 }
			, automation: [], state: 0
		};
		project.filters.push(filterEcho);
		project.filters.push(filterCompression);


		this.addInsTrack(project, allTracks, compresID);
		this.addPercussionTrack(project, allPercussions, compresID);


		for (let ii = 0; ii < allNotes.length; ii++) {
			let it = allNotes[ii];
			if (it.channelidx == 9) {
				this.addDrumkNote(project.percussions, project.timeline, allPercussions, it);
			} else {
				this.addTrackNote(project.tracks, project.timeline, allTracks, it);
			}
		}
		this.addComments(project);
		this.arrangeIcons(project);
		return project;
	}
	addPercussionTrack(project: Zvoog_Project, allPercussions: MIDIDrumInfo[], compresID: string) {
		let filterPitch: { track: number, pitch: number, id: string }[] = [];
		//console.log(project);
		let wwCell = 9;
		let hhCell = 2;

		for (let ii = 0; ii < allPercussions.length; ii++) {
			let left = 9 * (ii + 11 + project.tracks.length);
			let top = (8 * 12 + 2 * project.percussions.length) + ii * hhCell - allPercussions.length * hhCell;
			let volDrum = this.findVolumeDrum(allPercussions[ii].midiPitch);
			let parsedMIDItrack = this.parser.parsedTracks[allPercussions[ii].midiTrack];
			let drumData = '' + Math.round(volDrum.ratio * 100) + '/' + volDrum.idx;

			let insOut: string[] = [compresID];
			let perTrackTitle = '' + parsedMIDItrack.trackTitle + ': ' + allPercussionDrumTitles()[allPercussions[ii].midiPitch];
			//if (parsedMIDItrack.trackVolumePoints.length > 1) {
			if (this.hasVolumeAutomation(parsedMIDItrack.trackVolumePoints)) {
				let filterID = '';
				for (let ff = 0; ff < filterPitch.length; ff++) {
					if (filterPitch[ff].track == allPercussions[ii].midiTrack) {
						filterID = filterPitch[ff].id;
						break;
					}
				}
				if (filterID) {
					insOut = [filterID];
				} else {
					filterID = 'drumfader' + Math.random();

					let filterVolume: Zvoog_FilterTarget = {
						id: filterID
						, title: 'Fader for ' + perTrackTitle//allPercussions[ii].midiTrack + '/' + allPercussions[ii].midiPitch
						, kind: 'miniumfader1'
						, data: '' + (100 * volDrum.ratio)//drumData//'99'
						, outputs: [compresID]
						, iconPosition: { x: left + 7 * wwCell, y: top }
						, automation: []
						, state: 0
					};
					insOut = [filterID];
					project.filters.push(filterVolume);
					for (let mm = 0; mm < project.timeline.length; mm++) {
						filterVolume.automation.push({ changes: [] });
					}
					for (let vv = 0; vv < parsedMIDItrack.trackVolumePoints.length; vv++) {
						let gain = parsedMIDItrack.trackVolumePoints[vv];
						let vol = '' + Math.round(gain.value * 100 * volDrum.ratio) + '%';

						let pnt = this.findMeasureSkipByTime(gain.ms / 1000, project.timeline);
						if (pnt) {
							pnt.skip = MMUtil().set(pnt.skip).strip(16);
							for (let aa = 0; aa < filterVolume.automation[pnt.idx].changes.length; aa++) {
								let volumeskip = filterVolume.automation[pnt.idx].changes[aa].skip;
								if (MMUtil().set(volumeskip).equals(pnt.skip)) {
									filterVolume.automation[pnt.idx].changes.splice(aa, 1);
									break;
								}
							}
							filterVolume.automation[pnt.idx].changes.push({ skip: pnt.skip, stateBlob: vol });
						}
					}
					filterPitch.push({
						track: allPercussions[ii].midiTrack
						, pitch: allPercussions[ii].midiPitch
						, id: filterID
					});
				}
			} else {
				if (parsedMIDItrack.trackVolumePoints.length) {
					let lastVolume = parsedMIDItrack.trackVolumePoints[parsedMIDItrack.trackVolumePoints.length - 1].value;
					drumData = '' + Math.round(100 * volDrum.ratio * lastVolume) + '/' + volDrum.idx;
				} else {
					drumData = '' + Math.round(volDrum.ratio * 100) + '/' + volDrum.idx;
				}
			}
			if (allPercussions[ii].midiPitch < 35 || allPercussions[ii].midiPitch > 81) {
				insOut = [];
			}
			//console.log(filterPitch);
			let pp: Zvoog_PercussionTrack = {
				title: '' + perTrackTitle//(1 + ii) + '. ' + parsedMIDItrack.trackTitle
				, measures: []
				, sampler: {
					id: 'drum' + (ii + Math.random())
					, data: drumData//'' + (volDrum.ratio * 100) + '/' + volDrum.idx
					, kind: 'miniumdrums1'
					, outputs: insOut//[compresID]
					, iconPosition: { x: left, y: top }
					, state: 0
				}
			};
			for (let mm = 0; mm < project.timeline.length; mm++) {
				pp.measures.push({ skips: [] });
			}
			project.percussions.push(pp);
		}
	}
	hasVolumeAutomation(trackVolumePoints: { ms: number, value: number, channel: number }[]): boolean {
		if (trackVolumePoints.length) {
			if (trackVolumePoints[trackVolumePoints.length - 1].ms > 987) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}
	addInsTrack(project: Zvoog_Project, allTracks: MIDITrackInfo[], compresID: string) {
		let wwCell = 9;
		let hhCell = 7;
		for (let ii = 0; ii < project.tracks.length; ii++) {
			let track = project.tracks[ii];
			track.performer.iconPosition.x = ii * wwCell;
			track.performer.iconPosition.y = ii * hhCell;
		}
		for (let ii = 0; ii < allTracks.length; ii++) {
			let parsedMIDItrack: MIDIFileTrack = this.parser.parsedTracks[allTracks[ii].midiTrack];
			let midiProgram = 0;
			for (let kk = 0; kk < parsedMIDItrack.programChannel.length; kk++) {
				if (parsedMIDItrack.programChannel[kk].channel == allTracks[ii].midiChan) {
					midiProgram = parsedMIDItrack.programChannel[kk].program;
				}
			}
			let idxRatio = this.findVolumeInstrument(midiProgram);
			//let volumeRatio = idxRatio.ratio;
			let iidx = idxRatio.idx;
			let intitle = '' + parsedMIDItrack.trackTitle + ': ' + new ChordPitchPerformerUtil().tonechordinslist()[midiProgram];
			let imode = this.findModeInstrument(midiProgram);//Flat / Down / Up / Snap / Pong
			let insData = '100/' + iidx + '/' + imode;
			let insOut: string[] = [compresID];
			//console.log(midiProgram, intitle, parsedMIDItrack.trackVolumePoints.length, this.hasVolumeAutomation(parsedMIDItrack.trackVolumePoints));
			if (this.hasVolumeAutomation(parsedMIDItrack.trackVolumePoints)) {
				//if (parsedMIDItrack.trackVolumePoints.length > 1) {
				let filterID = 'fader' + Math.random();
				let filterVolume: Zvoog_FilterTarget = {
					id: filterID
					, title: 'Fader for  ' + intitle
					, kind: 'miniumfader1'
					, data: '' + (100 * idxRatio.ratio)
					, outputs: [compresID]
					, iconPosition: { x: (ii + 7) * wwCell, y: ii * hhCell * 0.8 }
					, automation: []
					, state: 0
				};
				insOut = [filterID];
				project.filters.push(filterVolume);
				for (let mm = 0; mm < project.timeline.length; mm++) {
					filterVolume.automation.push({ changes: [] });
				}
				for (let vv = 0; vv < parsedMIDItrack.trackVolumePoints.length; vv++) {
					let gain = parsedMIDItrack.trackVolumePoints[vv];
					let vol = '' + Math.round(gain.value * 100 * idxRatio.ratio) + '%';
					let pnt = this.findMeasureSkipByTime(gain.ms / 1000, project.timeline);
					if (pnt) {
						pnt.skip = MMUtil().set(pnt.skip).strip(16);
						for (let aa = 0; aa < filterVolume.automation[pnt.idx].changes.length; aa++) {
							let volumeskip = filterVolume.automation[pnt.idx].changes[aa].skip;
							if (MMUtil().set(volumeskip).equals(pnt.skip)) {
								filterVolume.automation[pnt.idx].changes.splice(aa, 1);
								break;
							}
						}
						filterVolume.automation[pnt.idx].changes.push({ skip: pnt.skip, stateBlob: vol });
					}
				}
			} else {
				if (parsedMIDItrack.trackVolumePoints.length) {
					let lastVolume = parsedMIDItrack.trackVolumePoints[parsedMIDItrack.trackVolumePoints.length - 1].value;
					insData = '' + Math.round(100 * idxRatio.ratio * lastVolume) + '/' + iidx + '/' + imode;
				} else {
					insData = '' + Math.round(idxRatio.ratio * 100) + '/' + iidx + '/' + imode;
				}

			}
			if (midiProgram < 0 || midiProgram > 127) {
				insOut = [];
			}
			let tt: Zvoog_MusicTrack = {
				title: '' + intitle//(1 + ii) + '. ' + parsedMIDItrack.trackTitle
				, measures: []
				, performer: {
					id: 'track' + (ii + Math.random())
					, data: insData//('100/' + iidx + '/0')
					, kind: 'miniumpitchchord1'
					, outputs: insOut//[compresID]
					, iconPosition: { x: ii * wwCell, y: ii * hhCell }
					, state: 0
				}
			};



			for (let mm = 0; mm < project.timeline.length; mm++) {
				tt.measures.push({ chords: [] });
			}
			project.tracks.push(tt);
		}
	}
	findModeInstrument(program: number): number {
		if (program == 24) return 4;
		if (program == 25) return 4;
		if (program == 26) return 4;
		if (program == 27) return 4;
		if (program == 29) return 1;
		if (program == 30) return 1;
		return 0;
	};
	arrangeIcons(project: Zvoog_Project) {
		//let wwCell = 7;
		//let hhCell = 9;
		/*for (let ii = 0; ii < project.tracks.length; ii++) {
			let track = project.tracks[ii];
			track.performer.iconPosition.x = ii * wwCell;
			track.performer.iconPosition.y = ii * hhCell;
		}*/
		let tracksWidth = 9 * (8 + project.tracks.length);
		/*for (let ii = 0; ii < project.percussions.length; ii++) {
			let percus = project.percussions[project.percussions.length - 1 - ii];
			percus.sampler.iconPosition.x = ii * wwCell + tracksWidth;
			percus.sampler.iconPosition.y = (8 * 12 + project.percussions.length) - ii * hhCell;
		}*/
		let perWidth = 9 * (8 + project.percussions.length);
		/*for (let ii = 2; ii < project.filters.length; ii++) {
			let filter = project.filters[ii];
			filter.iconPosition.x = ii * wwCell + tracksWidth + perWidth;
			filter.iconPosition.y = (ii - 2) * hhCell;
		}*/
		//let filtersWidth = wwCell * (project.filters.length - 0);
		project.filters[0].iconPosition.x = 7 * 7 + tracksWidth + perWidth;
		project.filters[0].iconPosition.y = 1 * 9 + 66;
		project.filters[1].iconPosition.x = 3 * 7 + tracksWidth + perWidth;
		project.filters[1].iconPosition.y = 2 * 9 + 11;
	}
	collectNotes(allNotes: TrackNote[], allTracks: MIDITrackInfo[], allPercussions: MIDIDrumInfo[]) {
		for (let ii = 0; ii < this.parser.parsedTracks.length; ii++) {
			let parsedtrack: MIDIFileTrack = this.parser.parsedTracks[ii];
			for (let nn = 0; nn < parsedtrack.trackNotes.length; nn++) {
				allNotes.push(parsedtrack.trackNotes[nn]);
				if (parsedtrack.trackNotes[nn].channelidx == 9) {
					this.takeProSamplerNo(allPercussions, ii, parsedtrack.trackNotes[nn].basePitch, parsedtrack.trackVolumePoints);
				} else {
					this.takeProTrackNo(allTracks, ii, parsedtrack.trackNotes[nn].channelidx, parsedtrack.trackVolumePoints);
				}
			}
		}
		allNotes.sort((a, b) => { return a.startMs - b.startMs; });
	}
	addComments(project: Zvoog_Project) {
		for (let ii = 0; ii < project.timeline.length; ii++) {
			project.comments.push({ points: [] });
		}

		for (let ii = 0; ii < this.parser.midiheader.lyricsList.length; ii++) {
			let textpoint = this.parser.midiheader.lyricsList[ii];
			let pnt = this.findMeasureSkipByTime(textpoint.ms / 1000, project.timeline);
			if (pnt) {
				//console.log(pnt.skip, textpoint.ms, textpoint.txt);
				this.addLyricsPoints(project.comments[pnt.idx], { count: pnt.skip.count, part: pnt.skip.part }, textpoint.txt);
			}
		}
		this.addLyricsPoints(project.comments[0], { count: 0, part: 4 }, 'import from .mid');
	}
	addLyricsPoints(bar: Zvoog_CommentMeasure, skip: Zvoog_Metre, txt: string) {
		let cnt = bar.points.length;
		bar.points[cnt] = {
			skip: skip
			, text: txt
			, row: cnt
		}
	}
	findMeasureSkipByTime(time: number, measures: Zvoog_SongMeasure[]): null | { idx: number, skip: Zvoog_Metre } {
		let curTime = 0;
		let mm = MMUtil();
		for (let ii = 0; ii < measures.length; ii++) {
			let cumea = measures[ii];
			let measureDurationS = mm.set(cumea.metre).duration(cumea.tempo);
			if (curTime + measureDurationS > time) {

				let delta = time - curTime;
				if (delta < 0) {
					delta = 0;
				}
				/*if(ii==85){
					console.log(cmnt,ii,round1000(curTime + measureDurationS), round1000(time), mm.calculate(delta, cumea.tempo),curTime + measureDurationS, time);
					}*/
				return { idx: ii, skip: mm.calculate(delta, cumea.tempo).strip(8) };
			}
			curTime = curTime + measureDurationS;
		}
		return null;
	}
	findVolumeDrum(midi: number): { idx: number, ratio: number } {
		let re = { idx: 0, ratio: 1 };
		let pre = '' + midi;
		for (let nn = 0; nn < drumKeysArrayPercussionPaths.length; nn++) {
			if (drumKeysArrayPercussionPaths[nn].startsWith(pre)) {
				re.idx = nn;
				break;
			}
		}
		return re;
	};

	findVolumeInstrument(program: number): { idx: number, ratio: number } {
		let re = { idx: 0, ratio: 0.7 };
		let instrs = new ChordPitchPerformerUtil().tonechordinstrumentKeys();
		for (var i = 0; i < instrs.length; i++) {
			if (program == 1 * parseInt(instrs[i].substring(0, 3))) {
				re.idx = i;
				break;
			}
		}

		if (program == 16) re.ratio = 0.4;
		if (program == 19) re.ratio = 0.4;

		if (program == 27) re.ratio = 0.95;

		if (program == 32) re.ratio = 0.95;
		if (program == 33) re.ratio = 0.95;
		if (program == 34) re.ratio = 0.95;
		if (program == 35) re.ratio = 0.95;
		if (program == 36) re.ratio = 0.95;
		if (program == 37) re.ratio = 0.95;
		if (program == 38) re.ratio = 0.95;
		if (program == 39) re.ratio = 0.95;

		if (program == 48) re.ratio = 0.4;
		if (program == 49) re.ratio = 0.4;
		if (program == 50) re.ratio = 0.5;
		if (program == 51) re.ratio = 0.4;

		if (program == 65) re.ratio = 0.99;

		if (program == 80) re.ratio = 0.3;
		if (program == 89) re.ratio = 0.4;



		//console.log('program', program, 'not found set 0');
		return re;
	};
	takeChord(bar: Zvoog_TrackMeasure, when: Zvoog_Metre): Zvoog_Chord {
		for (let cc = 0; cc < bar.chords.length; cc++) {
			let chord = bar.chords[cc];
			if (MMUtil().set(chord.skip).equals(when)) {
				//console.log(chord);
				return chord;
			}
		}
		let chord: Zvoog_Chord = {
			skip: when
			, pitches: []
			, slides: []
		}
		bar.chords.push(chord);
		return chord;
	}
	addTrackNote(tracks: Zvoog_MusicTrack[], timeline: Zvoog_SongMeasure[], allTracks: MIDITrackInfo[], note: TrackNote) {
		let barStart = 0;
		for (let ii = 0; ii < timeline.length; ii++) {
			let measure = timeline[ii];
			let durationMs = 1000 * MMUtil().set(measure.metre).duration(measure.tempo);
			if (note.startMs >= barStart && note.startMs < barStart + durationMs) {
				//console.log();
				let insidx = this.takeProTrackNo(allTracks, note.trackidx, note.channelidx, null);
				let instrack = tracks[insidx];
				let noteStartMs = note.startMs - barStart;
				let when = MMUtil().set(measure.metre).calculate(noteStartMs / 1000, measure.tempo).metre();
				//console.log(tracks, insidx, instrack);
				//instrack.measures[ii]..skips.push(when);
				let chord = this.takeChord(instrack.measures[ii], when);
				chord.pitches.push(note.basePitch);

				if (chord.slides.length == 0 || chord.slides.length == 1) {
					if (note.bendPoints.length) {
						//console.log(note.bendPoints);
						chord.slides = [];
						let bendDurationMs = 0;
						for (var v = 0; v < note.bendPoints.length; v++) {
							var midipoint: NotePitch = note.bendPoints[v];
							let pieceduration = MMUtil().set(measure.metre).calculate(midipoint.pointDuration / 1000, measure.tempo).metre();
							let slide: Zvoog_Slide = { duration: pieceduration, delta: midipoint.basePitchDelta };
							chord.slides.push(slide);
							bendDurationMs = bendDurationMs + midipoint.pointDuration;
						}
						let remains = note.baseDuration - bendDurationMs;
						if (remains > 0) {
							chord.slides.push({
								duration: MMUtil().set(measure.metre).calculate(remains / 1000, measure.tempo).metre()
								, delta: chord.slides[chord.slides.length - 1].delta
							});
						}
					} else {
						let duration = MMUtil().set(measure.metre).calculate(note.baseDuration / 1000, measure.tempo);
						if (duration.less({ count: 1, part: 16 })) {
							duration.set({ count: 1, part: 16 });
						}
						if (duration.more({ count: 4, part: 1 })) {
							duration.set({ count: 4, part: 1 });
						}
						chord.slides = [{ duration: duration.metre(), delta: 0 }];
					}
				}
				return;
			}
			barStart = barStart + durationMs;
		}
	}
	addDrumkNote(percussions: Zvoog_PercussionTrack[], timeline: Zvoog_SongMeasure[], allPercussions: MIDIDrumInfo[]
		, note: TrackNote) {
		let barStart = 0;
		for (let ii = 0; ii < timeline.length; ii++) {
			let measure = timeline[ii];
			let durationMs = 1000 * MMUtil().set(measure.metre).duration(measure.tempo);
			if (note.startMs >= barStart && note.startMs < barStart + durationMs) {
				let peridx = this.takeProSamplerNo(allPercussions, note.trackidx, note.basePitch, null);
				let pertrack = percussions[peridx];
				let noteStartMs = note.startMs - barStart;
				let when = MMUtil().set(measure.metre).calculate(noteStartMs / 1000, measure.tempo).metre();
				//console.log(peridx,pertrack);
				pertrack.measures[ii].skips.push(when);
				return;
			}
			barStart = barStart + durationMs;
		}
	}
	/*findBarNo(timeline: Zvoog_SongMeasure[], startMs: number): number {
		let barStart = 0;
		for (let ii = 0; ii < timeline.length; ii++) {
			let measure = timeline[ii];
			let durationMs = 1000 * MMUtil().set(measure.metre).duration(measure.tempo);
			if (startMs >= barStart && startMs < barStart + durationMs) {
				return ii;
			}
		}
		return -1;
	}*/
	takeProTrackNo(allTracks: MIDITrackInfo[], midiTrack: number, midiChannel: number
		, trackVolumePoints: null | { ms: number, value: number, channel: number }[]): number {
		for (let ii = 0; ii < allTracks.length; ii++) {
			let it = allTracks[ii];
			if (it.midiTrack == midiTrack && it.midiChan == midiChannel) {
				return ii;
			}
		}
		let title: string = '';
		if (trackVolumePoints) {

			allTracks.push({ midiTrack: midiTrack, midiChan: midiChannel, title: title, trackVolumePoints: trackVolumePoints });
		} else {
			allTracks.push({ midiTrack: midiTrack, midiChan: midiChannel, title: title, trackVolumePoints: [] });
		}
		//console.log(allTracks.length);
		return allTracks.length - 1;
	}
	takeProSamplerNo(allPercussions: MIDIDrumInfo[], midiTrack: number, midiPitch: number
		, trackVolumePoints: null | { ms: number, value: number, channel: number }[]): number {
		for (let ii = 0; ii < allPercussions.length; ii++) {
			let it = allPercussions[ii];
			if (it.midiTrack == midiTrack && it.midiPitch == midiPitch) {
				return ii;
			}
		}
		let title: string = '';
		if (trackVolumePoints) {
			allPercussions.push({ midiTrack: midiTrack, midiPitch: midiPitch, title: title, trackVolumePoints: trackVolumePoints });
		} else {
			allPercussions.push({ midiTrack: midiTrack, midiPitch: midiPitch, title: title, trackVolumePoints: [] });
		}
		return allPercussions.length - 1;
	}
	/*findOrCreateTrack(parsedtrack: MIDIFileTrack, trackOrder: number, channelNum: number, tracksChannels: TrackNumChanNum[]): TrackNumChanNum {
		for (let ii = 0; ii < tracksChannels.length; ii++) {
			if (tracksChannels[ii].trackNum == trackOrder && tracksChannels[ii].channelNum == channelNum) {
				return tracksChannels[ii];
			}
		}
		let it: TrackNumChanNum = {
			trackNum: trackOrder
			, channelNum: channelNum
			, zvoogtrack: {
				title: parsedtrack.trackTitle + ' / ' + parsedtrack.instrumentName
				, measures: []
				, performer: {
					id: '' + Math.random()
					, data: ''
					, kind: ''
					, outputs: []
					, iconPosition: { x: 0, y: 0 }
					, state: 0
				}
			}
		};
		tracksChannels.push(it);
		return it;
	}*/
}
