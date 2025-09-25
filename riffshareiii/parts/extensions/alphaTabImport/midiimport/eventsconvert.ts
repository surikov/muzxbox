//type TrackNumChanNum = { trackNum: number, channelNum: number, zvoogtrack: Zvoog_MusicTrack };
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
		let allTracks: { midiTrack: number, midiChan: number }[] = [];
		let allPercussions: { midiTrack: number, midiPitch: number }[] = [];
		for (let ii = 0; ii < this.parser.parsedTracks.length; ii++) {
			let parsedtrack: MIDIFileTrack = this.parser.parsedTracks[ii];
			for (let nn = 0; nn < parsedtrack.trackNotes.length; nn++) {
				allNotes.push(parsedtrack.trackNotes[nn]);
				if (parsedtrack.trackNotes[nn].channelidx == 9) {
					this.takeProSamplerNo(allPercussions, ii, parsedtrack.trackNotes[nn].basePitch);
				} else {
					this.takeProTrackNo(allTracks, ii, parsedtrack.trackNotes[nn].channelidx);
				}
			}
		}

		allNotes.sort((a, b) => { return a.startMs - b.startMs; });
		console.log(allNotes);
		console.log(allTracks);
		console.log(allPercussions);
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
				title: '' + ii
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
		for (let ii = 0; ii < allPercussions.length; ii++) {
			let volDrum = this.findVolumeDrum(allPercussions[ii].midiPitch);
			let pp: Zvoog_PercussionTrack = {
				title: '' + ii
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
				this.addTrackNote(project.timeline, it);
			}
		}

		return project;
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
	addTrackNote(timeline: Zvoog_SongMeasure[], note: TrackNote) {

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
	addDrumkNote(percussions: Zvoog_PercussionTrack[], timeline: Zvoog_SongMeasure[], allPercussions: { midiTrack: number, midiPitch: number }[], note: TrackNote) {
		let barStart = 0;
		for (let ii = 0; ii < timeline.length; ii++) {
			let measure = timeline[ii];
			let durationMs = 1000 * MMUtil().set(measure.metre).duration(measure.tempo);
			if (note.startMs >= barStart && note.startMs < barStart + durationMs) {
				let peridx = this.takeProSamplerNo(allPercussions, note.trackidx, note.basePitch);
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
	takeProTrackNo(allTracks: { midiTrack: number, midiChan: number }[], midiTrack: number, midiChannel: number): number {
		for (let ii = 0; ii < allTracks.length; ii++) {
			let it = allTracks[ii];
			if (it.midiTrack == midiTrack && it.midiChan == midiChannel) {
				return ii;
			}
		}
		allTracks.push({ midiTrack: midiTrack, midiChan: midiChannel });
		return allTracks.length - 1;
	}
	takeProSamplerNo(allPercussions: { midiTrack: number, midiPitch: number }[], midiTrack: number, midiPitch: number): number {
		for (let ii = 0; ii < allPercussions.length; ii++) {
			let it = allPercussions[ii];
			if (it.midiTrack == midiTrack && it.midiPitch == midiPitch) {
				return ii;
			}
		}
		allPercussions.push({ midiTrack: midiTrack, midiPitch: midiPitch });
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
