//type TrackNumChanNum = { trackNum: number, channelNum: number, zvoogtrack: Zvoog_MusicTrack };
type MIDITrackInfo = { midiTrack: number, midiChan: number, trackVolumePoints: { ms: number, value: number, channel: number }[] };
type MIDIDrumInfo = { midiTrack: number, midiPitch: number, trackVolumePoints: { ms: number, value: number, channel: number }[] };
class EventsConverter {
	parser: MidiParser;
	constructor(parser: MidiParser) {
		this.parser = parser;
	}
	convertEvents(): Zvoog_Project {
		let project: Zvoog_Project = {
			title: 'test'
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
		for (let ii = 0; ii < allTracks.length; ii++) {
			let parsedMIDItrack = this.parser.parsedTracks[allTracks[ii].midiTrack];
			let midiProgram = 0;
			for (let kk = 0; kk < parsedMIDItrack.programChannel.length; kk++) {
				if (parsedMIDItrack.programChannel[kk].channel == allTracks[ii].midiChan) {
					midiProgram = parsedMIDItrack.programChannel[kk].program;
				}
			}
			let idxRatio = this.findVolumeInstrument(midiProgram);
			let iidx = idxRatio.idx;

			let tt: Zvoog_MusicTrack = {
				title: '' + (1 + ii) + '. ' + parsedMIDItrack.trackTitle
				, measures: []
				, performer: {
					id: 'track' + (ii + Math.random())
					, data: ('100/' + iidx + '/0')
					, kind: 'miniumpitchchord1'
					, outputs: [compresID]
					, iconPosition: { x: 0, y: 0 }
					, state: 0
				}
			};
			for (let mm = 0; mm < project.timeline.length; mm++) {
				tt.measures.push({ chords: [] });
			}
			project.tracks.push(tt);
		}
		//console.log(project);
		for (let ii = 0; ii < allPercussions.length; ii++) {
			let volDrum = this.findVolumeDrum(allPercussions[ii].midiPitch);
			let parsedMIDItrack = this.parser.parsedTracks[allPercussions[ii].midiTrack];
			let pp: Zvoog_PercussionTrack = {
				title: '' + (1 + ii) + '. ' + parsedMIDItrack.trackTitle
				, measures: []
				, sampler: {
					id: 'drum' + (ii + Math.random())
					, data: '' + (volDrum.ratio * 100) + '/' + volDrum.idx
					, kind: 'miniumdrums1'
					, outputs: [compresID]
					, iconPosition: { x: 0, y: 0 }
					, state: 0
				}
			};
			for (let mm = 0; mm < project.timeline.length; mm++) {
				pp.measures.push({ skips: [] });
			}
			project.percussions.push(pp);
		}
		for (let ii = 0; ii < allNotes.length; ii++) {
			let it = allNotes[ii];
			if (it.channelidx == 9) {
				this.addDrumkNote(project.percussions, project.timeline, allPercussions, it);
			} else {
				this.addTrackNote(project.tracks, project.timeline, allTracks, it);
			}
		}
		this.addComments(project);
		return project;
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
						let duration = MMUtil().set(measure.metre).calculate(note.baseDuration / 1000, measure.tempo).metre();
						chord.slides = [{ duration: duration, delta: 0 }];
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
		if (trackVolumePoints) {
			allTracks.push({ midiTrack: midiTrack, midiChan: midiChannel, trackVolumePoints: trackVolumePoints });
		} else {
			allTracks.push({ midiTrack: midiTrack, midiChan: midiChannel, trackVolumePoints: [] });
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
		if (trackVolumePoints) {
			allPercussions.push({ midiTrack: midiTrack, midiPitch: midiPitch, trackVolumePoints: trackVolumePoints });
		} else {
			allPercussions.push({ midiTrack: midiTrack, midiPitch: midiPitch, trackVolumePoints: [] });
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
