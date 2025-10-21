//type TrackNumChanNum = { trackNum: number, channelNum: number, zvoogtrack: Zvoog_MusicTrack };
type MIDITrackInfo = {
	midiTrack: number
	//, midiChan: number
	, midiProgram: number
	, trackVolumePoints: { ms: number, value: number, channel: number }[]
	, midiTitle: string
};
type MIDIDrumInfo = {
	midiTrack: number
	, midiPitch: number
	, trackVolumePoints: { ms: number, value: number, channel: number }[]
	, title: string
};
type MIDIFileInfo = {
	fileName: string
	, fileSize: number
	, duration: number
	, durationCategory: string
	, baseDrumCategory: string
	, baseDrumPerBar: number
	, avgTempoCategory: string
	, noteCount: number
	, drumCount: number
	, tracks: {
		program: number, singlCount: number, chordCount: number, singleDuration: number, chordDuration: number, title: string
		, tones: {
			pitches: {
				pitch: number
				, count: number
			}[]
			, tone: number
			, toneCount: number
		}[]
		, pitches: {
			pitch: number
			, count: number
			, ratio: number
		}[]
	}[]
	, drums: { pitch: number, count: number, ratio: number, baravg: number, title: string }[]
	, bars: { idx: Number, meter: string, bpm: number, count: number }[]
	, barCount: number
	, bassTrackNum: number
	, bassAvg: number
	, guitarChordDuration: number
	, guitarChordCategory: string

};//console.log('bass pitch', curAvg, bassTrack.title, piline);
class EventsConverter {
	midiFileInfo: MIDIFileInfo = {
		fileName: ''
		, fileSize: 0
		, duration: 0
		, noteCount: 0
		, drumCount: 0
		, tracks: []
		, drums: []
		, avgTempoCategory: ''
		, baseDrumCategory: ''
		, baseDrumPerBar: 0
		, bars: []
		, barCount: 0
		, bassTrackNum: -1
		, bassAvg: -1
		, durationCategory: ''
		, guitarChordDuration: 0
		, guitarChordCategory: ''
	};
	parser: MidiParser;
	constructor(parser: MidiParser) {
		this.parser = parser;
	}
	convertEvents(name: string, filesize: number): Zvoog_Project {
		this.midiFileInfo.fileName = name;
		this.midiFileInfo.fileSize = filesize;
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
			, farorder: []
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
		this.fillTimeline(project, allNotes);

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
				//let tidx=it.trackidx;
				//let chidx=it.channelidx;
				//if(it.trackidx==3)console.log('addTrackNote',it.trackidx, it.channelidx);
				this.addTrackNote(project.tracks, project.timeline, allTracks, it);
			}
		}

		this.addMIDIComments(project);
		this.arrangeIcons(project);

		for (let ii = 0; ii < project.timeline.length; ii++) {
			let bar = project.timeline[ii];
			bar.tempo = 10 * Math.round(bar.tempo / 10);
		}

		//this.parser.aligned.sort((a, b) => { return b.events.length - a.events.length });
		/*for (let ii = 5; ii < this.parser.aligned.length; ii++) {
			let avgcount = (this.parser.aligned[ii - 1].events.length
				+ this.parser.aligned[ii - 2].events.length
				+ this.parser.aligned[ii - 3].events.length
				+ this.parser.aligned[ii - 4].events.length
				+ this.parser.aligned[ii - 5].events.length
			) / 5;
			if (this.parser.aligned[ii].events.length > avgcount * 2.9) {
				//console.log(avgcount, this.parser.aligned[ii]);
			}
		}*/

		//console.log('allNotes', allNotes);
		//console.log('alignedMIDIevents', this.parser.alignedMIDIevents);
		this.fillInfoMIDI(project, allNotes, allTracks);

		return project;
	}
	/*
	findTrackProgram(nt: TrackNote, allTracks: MIDITrackInfo[]): number {//midiTrackIdx: number, chanelTrackIdx: number): number {
		let inf = this.parser.parsedTracks[nt.trackidx];
		for (let ii = 0; ii < inf.programChannel.length; ii++) {
			if (inf.programChannel[ii].eventChannel == nt.channelidx) {
				return inf.programChannel[ii].eventProgram;
			}
		}
		return -1;
	}
	*/
	/*findProgramForChannel(trackIdx: number, chanIdx: number): number {
		let program = -1;
		for (let ii = 0; ii < this.parser.programTrackChannel.length; ii++) {
			if (this.parser.programTrackChannel[ii].eventChannel == chanIdx
				&& this.parser.programTrackChannel[ii].eventTrack == trackIdx
			) {
				return this.parser.programTrackChannel[ii].eventProgram;
			}
		}
		return program;
	}*/
	findProgramForChannel(chanIdx: number): number {
		let program = -1;
		for (let ii = 0; ii < this.parser.programChannel.length; ii++) {
			if (this.parser.programChannel[ii].midiChannel == chanIdx) {
				return this.parser.programChannel[ii].midiProgram;
			}
		}
		return program;
	}
	fillInfoMIDI(project: Zvoog_Project, allNotes: TrackNote[], allTracks: MIDITrackInfo[]) {
		//console.log('fillInfoMIDI');
		/*
		let sortedIns = allNotes.sort((a, b) => b.baseDuration - a.baseDuration);
		let ins90 = sortedIns.filter((element, index) => index > 0.05 * sortedIns.length && index < 0.95 * sortedIns.length);
		let insMedian = ins90.reduce((last, it) => last + it.baseDuration, 0) / ins90.length;
		let insMin = ins90[ins90.length - 1].baseDuration;
		let insMax = ins90[0].baseDuration
		console.log('ins',insMin, insMedian, insMax);
		*/
		let insList: number[] = [];
		for (let ii = 0; ii < allNotes.length; ii++) {
			let anote = allNotes[ii];
			//console.log(anote.program);
			if (anote.channelidx != 9) {
				//console.log(anote,allTracks);
				//let prog = this.findTrackProgram(anote, allTracks);
				let prog = this.findProgramForChannel(anote.channelidx);
				if (insList.indexOf(prog) < 0) {
					insList.push(prog);
				}
			}
		}
		//console.log('insList', insList);
		for (let kk = 0; kk < insList.length; kk++) {
			let program = insList[kk];
			//let progNotes = allNotes.filter((it) => this.findTrackProgram(it, allTracks) == program);
			let progNotes = allNotes.filter((it) => this.findProgramForChannel(it.channelidx) == program);
			let starts: TrackNote[] = [];
			for (let cc = 0; cc < progNotes.length; cc++) {
				let pnote = progNotes[cc];
				let xsts = starts.find((it) => it.startMs == pnote.startMs);
				if (xsts) {
					xsts.count = 1 + (xsts.count ? xsts.count : 1);
				} else {
					starts.push(pnote);
				}
			}
			let chords = starts.filter((it) => (it.count ? it.count : 1) > 2);
			let choDur = chords.reduce((last, it) => last + it.baseDuration, 0);
			let singles = starts.filter((it) => (it.count ? it.count : 1) < 2);
			let snglDur = singles.reduce((last, it) => last + it.baseDuration, 0);
			//let pitches: { pitch: number, count: number, tone: number }[] = []
			let tones: {
				pitches: {
					pitch: number
					, count: number
				}[]
				, tone: number
				, toneCount: number

			}[] = [];
			let sipitches: {
				pitch: number
				, count: number
				, ratio: number
			}[] = [];

			for (let ss = 0; ss < starts.length; ss++) {
				let pitch = Math.round(starts[ss].basePitch);
				let tone = pitch % 12;

				let foundedTone = tones.find((it) => it.tone == tone);
				if (foundedTone) {
					let foundedPitch = foundedTone.pitches.find((it) => it.pitch == pitch);
					if (foundedPitch) {
						foundedPitch.count++;
						foundedTone.toneCount++;
					} else {
						foundedTone.pitches.push({ pitch: pitch, count: 1 });
					}
				} else {
					tones.push({
						pitches: [{
							pitch: pitch
							, count: 1
						}]
						, tone: tone
						, toneCount: 1

					});
				}
				let found = sipitches.find((it) => it.pitch == pitch);
				if (found) {
					found.count++;
				} else {
					found = { pitch: pitch, count: 1, ratio: 0 };
					sipitches.push(found);
				}
			}

			/*
						console.log('program', program
							, 'single', singles.length, Math.round(snglDur)
							, 'chords', chords.length, Math.round(choDur)
							, new ChordPitchPerformerUtil().tonechordinslist()[program]);
			*/
			//console.log('single', singles.length, 'chords', chords.length);
			let pitchCount = sipitches.reduce((last, it) => last + it.count, 0);

			this.midiFileInfo.tracks.push({
				program: program
				, singlCount: singles.length
				, chordCount: chords.length
				, singleDuration: Math.round(snglDur)
				, chordDuration: Math.round(choDur)
				//, pitches: pitches.sort((a, b) => b.count - a.count)
				, tones: tones.sort((a, b) => b.toneCount - a.toneCount)
				, pitches: sipitches.map((it) => { it.ratio = it.count / pitchCount; return it; }).sort((a, b) => b.count - a.count)
				, title: new ChordPitchPerformerUtil().tonechordinslist()[program]
			});
		}
		let drumList: number[] = [];
		for (let ii = 0; ii < allNotes.length; ii++) {
			let anote = allNotes[ii];
			if (anote.channelidx == 9) {
				if (drumList.indexOf(anote.basePitch) < 0) {
					drumList.push(anote.basePitch);
				}
			}
		}
		this.midiFileInfo.barCount = project.timeline.length;
		for (let ii = 0; ii < drumList.length; ii++) {
			let pitch = drumList[ii];
			let dritem = {
				pitch: pitch
				, count: allNotes
					.filter((it) => it.channelidx == 9 && it.basePitch == pitch)
					.reduce((last, it) => last + 1, 0)
				, title: allPercussionDrumTitles()[pitch]
				, ratio: 0
				, baravg: 0
			};
			this.midiFileInfo.drums.push(dritem);
			this.midiFileInfo.drumCount = this.midiFileInfo.drumCount + dritem.count;
		}
		for (let ii = 0; ii < this.midiFileInfo.drums.length; ii++) {
			this.midiFileInfo.drums[ii].ratio = Math.round(100 * this.midiFileInfo.drums[ii].count / this.midiFileInfo.drumCount);
			this.midiFileInfo.drums[ii].baravg = Math.round(this.midiFileInfo.drums[ii].count / this.midiFileInfo.barCount);
		}
		//let barMeterBPM: { idx: Number, meter: string, bpm: number, count: number }[] = [];

		for (let ii = 0; ii < project.timeline.length; ii++) {
			let bar = project.timeline[ii];
			if (bar) {
				//console.log(ii, bar);
				let descr = {
					idx: ii
					, meter: '' + bar.metre.count + '/' + bar.metre.part
					//, bpm: 15 * Math.round(bar.tempo / 15)
					, bpm: bar.tempo
					, count: 1
				};
				let xsts = this.midiFileInfo.bars.find((it) => it.meter == descr.meter && it.bpm == descr.bpm);
				if (xsts) {
					xsts.count = 1 + (xsts.count ? xsts.count : 1);
				} else {
					this.midiFileInfo.bars.push(descr);
				}
			}
		}
		this.midiFileInfo.bars.sort((a, b) => b.count - a.count);
		this.midiFileInfo.tracks.sort((a, b) => (b.chordCount + b.singlCount) - (a.chordCount + a.singlCount));
		this.midiFileInfo.drums.sort((a, b) => b.count - a.count);
		//console.log(barMeterBPM);
		//
		/*
		let durationCategory = '';
		if (this.midiFileInfo.duration < 1 * 60 * 1000) durationCategory = 'excerpt'
		else if (this.midiFileInfo.duration < 2.5 * 60 * 1000) durationCategory = 'short'
		else if (this.midiFileInfo.duration < 4 * 60 * 1000) durationCategory = 'medium'
		else if (this.midiFileInfo.duration < 6 * 60 * 1000) durationCategory = 'long'
		else durationCategory = 'lingering'
		//console.log('durationCategory', durationCategory, this.midiFileInfo.duration);
		*/
		let basedrums = this.midiFileInfo.drums.filter((it) => it.pitch == 35 || it.pitch == 36 || it.pitch == 38 || it.pitch == 40);
		let avgdrum = 0;
		if (basedrums.length) {
			avgdrum = basedrums.reduce((last, it) => last + it.count, 0) / this.midiFileInfo.barCount;
		}
		//console.log('avgdrum', avgdrum, basedrums);
		let bassTrack;
		let bassTrackNo = -1;
		let curAvg = 0;
		for (let ii = 0; ii < this.midiFileInfo.tracks.length; ii++) {
			let track = this.midiFileInfo.tracks[ii];
			if ((track.program < 96 || (track.program > 103 && track.program < 120))
				&& track.singleDuration + track.chordDuration > this.midiFileInfo.duration / 10) {
				let halfsize = Math.ceil(track.pitches.length / 3);
				let sm = 0;
				for (let kk = 0; kk < halfsize; kk++) {
					sm = sm + track.pitches[kk].pitch;
				}
				let avgPitch = Math.round(sm / halfsize);
				if (avgPitch < 48) {
					//console.log(avgPitch, track.title);
					if (avgPitch > 0 && (bassTrack)) {
						if (avgPitch < curAvg && track.singlCount > bassTrack.singlCount * 0.7) {
							curAvg = avgPitch;
							bassTrack = track;
							bassTrackNo = ii;
						}
					} else {
						bassTrack = track;
						curAvg = avgPitch;
						bassTrackNo = ii;
					}
					//console.log(bassTrack.title);
				}
			}
		}
		if (bassTrack) {
			let piline = '';
			for (let ii = 0; ii < bassTrack.pitches.length; ii++) {
				piline = piline + '/' + Math.round(bassTrack.pitches[ii].ratio * 100);
			}
			//console.log('bass pitch', curAvg, bassTrack.title, piline);
			this.midiFileInfo.bassTrackNum = bassTrackNo;
			this.midiFileInfo.bassAvg = curAvg;
		}
		if (this.midiFileInfo.duration < 1 * 60 * 1000) this.midiFileInfo.durationCategory = 'excerpt'
		else if (this.midiFileInfo.duration < 2.5 * 60 * 1000) this.midiFileInfo.durationCategory = 'short'
		else if (this.midiFileInfo.duration < 4 * 60 * 1000) this.midiFileInfo.durationCategory = 'medium'
		else if (this.midiFileInfo.duration < 6 * 60 * 1000) this.midiFileInfo.durationCategory = 'long'
		else this.midiFileInfo.durationCategory = 'lingering'

		let bpm = 0;
		for (let ii = 0; ii < project.timeline.length; ii++) {
			bpm = bpm + project.timeline[ii].tempo;
		}
		let avgbpm = bpm / project.timeline.length;
		if (avgbpm < 80)
			this.midiFileInfo.avgTempoCategory = 'very slow';
		else if (avgbpm < 110)
			this.midiFileInfo.avgTempoCategory = 'slow';
		else if (avgbpm < 140)
			this.midiFileInfo.avgTempoCategory = 'medium';
		else if (avgbpm < 200)
			this.midiFileInfo.avgTempoCategory = 'fast';
		else
			this.midiFileInfo.avgTempoCategory = 'very fast';


		let maxTrackChordDuration = 0;
		for (let ii = 0; ii < this.midiFileInfo.tracks.length; ii++) {
			let track = this.midiFileInfo.tracks[ii];
			if (track.program >= 24 && track.program <= 30 && track.chordDuration > 5 * 1000) {
				if (maxTrackChordDuration < track.chordDuration) {
					maxTrackChordDuration = track.chordDuration;
				}
			}
		}
		this.midiFileInfo.guitarChordDuration = maxTrackChordDuration / this.midiFileInfo.duration;
		if (this.midiFileInfo.guitarChordDuration < 0.1)
			this.midiFileInfo.guitarChordCategory = 'none';
		else if (this.midiFileInfo.guitarChordDuration < 0.3)
			this.midiFileInfo.guitarChordCategory = 'few';
		else if (this.midiFileInfo.guitarChordDuration < 0.5)
			this.midiFileInfo.guitarChordCategory = 'medium';
		else
			this.midiFileInfo.guitarChordCategory = 'many';




		this.midiFileInfo.baseDrumCategory = 'none';
		if (basedrums.length) {
			this.midiFileInfo.baseDrumPerBar = Math.round(basedrums.reduce((last, it) => last + it.count, 0) / this.midiFileInfo.barCount);
			if (this.midiFileInfo.baseDrumPerBar < 2) this.midiFileInfo.baseDrumCategory = 'few'
			else if (this.midiFileInfo.baseDrumPerBar < 6) this.midiFileInfo.baseDrumCategory = 'medium'
			else this.midiFileInfo.baseDrumCategory = 'many'
		}
		/*
				console.log('--'
					, this.midiFileInfo.durationCategory, (Math.floor(this.midiFileInfo.duration / 60000) + "'" + (Math.floor(this.midiFileInfo.duration / 1000) % 60) + '"')
					, 'drums', this.midiFileInfo.baseDrumCategory, this.midiFileInfo.baseDrumPerBar
					, 'bpm', this.midiFileInfo.avgTempoCategory
					, 'gchords', Math.round(this.midiFileInfo.guitarChordDuration * 100), this.midiFileInfo.guitarChordCategory
				);
		
		
				console.log(this.midiFileInfo);
				*/
	}
	/*wholeTimelineDuration(timeline: Zvoog_SongMeasure[]): number {
		let ss = 0;
		for (let tt = 0; tt < timeline.length; tt++) {
			let bar = timeline[tt];
			ss = ss + MMUtil().set(bar.metre).duration(bar.tempo);
		}
		return ss;
	}*/
	findMIDITempoBefore(ms: number): number {
		for (var ii = this.parser.midiheader.changesResolutionTempo.length - 1; ii >= 0; ii--) {
			if (this.parser.midiheader.changesResolutionTempo[ii].ms <= ms + 123) {
				return this.parser.midiheader.changesResolutionTempo[ii].bpm;
			}
		}
		return 120;
	}
	findMIDIMeterBefore(ms: number): Zvoog_Metre {
		for (var ii = this.parser.midiheader.metersList.length - 1; ii >= 0; ii--) {
			if (this.parser.midiheader.metersList[ii].ms <= ms + 123) {
				//return this.parser.midiheader.changesResolutionTempo[ii].bpm;
				return {
					count: this.parser.midiheader.metersList[ii].count
					, part: this.parser.midiheader.metersList[ii].division
				};
			}
		}
		return { count: 4, part: 4 };
	}
	findNearestPoint(ms: number): number {
		let timeMs = -1;
		for (let aa = 0; aa < this.parser.alignedMIDIevents.length; aa++) {
			let avg = this.parser.alignedMIDIevents[aa].avg;
			if ((timeMs < 0 || Math.abs(avg - ms) < Math.abs(timeMs - ms))
				&& Math.abs(avg - ms) < 123
			) {
				//console.log(timeMs,avg,ms);
				timeMs = avg;
			}
		}
		if (timeMs < 0) {
			//console.log('not found near',ms);
			return ms;
		} else {
			return timeMs;
		}
	}
	fillTimeline(project: Zvoog_Project, allNotes: TrackNote[]) {
		let lastMs = allNotes[allNotes.length - 1].startMs + 1000;
		this.midiFileInfo.duration = lastMs;
		let wholeDurationMs = 0;
		//console.log(this.parser);
		while (wholeDurationMs < lastMs) {
			let tempo = this.findMIDITempoBefore(wholeDurationMs);
			let meter = MMUtil().set(this.findMIDIMeterBefore(wholeDurationMs));
			let barDurationMs = meter.duration(tempo) * 1000;
			let nextBar: Zvoog_SongMeasure = { tempo: tempo, metre: meter.metre() };
			project.timeline.push(nextBar);
			if (barDurationMs < 100) barDurationMs = 100;
			let nearestDurationMs = this.findNearestPoint(wholeDurationMs + barDurationMs);
			//console.log(wholeDurationMs, '+', Math.round(barDurationMs)
			//	, '=', Math.round(wholeDurationMs + barDurationMs), '/', nearestDurationMs
			//	, meter.count + '/' + meter.part, Math.round(tempo)
			//);
			let nearestBarMs = nearestDurationMs - wholeDurationMs;
			nextBar.tempo = tempo * barDurationMs / nearestBarMs;
			wholeDurationMs = wholeDurationMs + nearestBarMs;
		}
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
			//if (allPercussions[ii].midiPitch < 35 || allPercussions[ii].midiPitch > 81) {
			if (allPercussions[ii].midiPitch < 27 || allPercussions[ii].midiPitch > 87) {
				/*
				General MIDI 2 (Expanded Range)
				27/Eb1 High Q
				28/E1 Slap
				29/F1 Scratch Push
				30/Gb1 Scratch Pull
				31/G1 Sticks
				32/Ab1 Square Click
				33/A1 Metronome Click
				34/Bb1 Metronome Bell
				82/Bb5 Shaker (GM2)
				83/B5 Jingle Bell (GM2)
				84/C5 Belltree (GM2)
				85/Db5 Castanets (GM2)
				86/D5 Mute Surdo (GM2)
				87/Eb5 Open Surdo (GM2)
				*/
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
			//let midiProgram = this.findProgramForChannel(allTracks[ii].midiChan);
			let midiProgram = allTracks[ii].midiProgram;
			/*for (let kk = 0; kk < parsedMIDItrack.programChannel.length; kk++) {
				if (parsedMIDItrack.programChannel[kk].eventChannel == allTracks[ii].midiChan) {
					midiProgram = parsedMIDItrack.programChannel[kk].eventProgram;
				}
			}*/

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
					, iconPosition: { x: (ii + 7) * wwCell * 1.1, y: ii * hhCell * 0.8 }
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
				/*
				
				*/
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
					//if(ii==3 )console.log('collectNotes chan', parsedtrack.trackNotes[nn].channelidx);
					this.takeProTrackNo(allTracks, ii, parsedtrack.trackNotes[nn].channelidx, parsedtrack.trackVolumePoints);
				}
			}
		}
		allNotes.sort((a, b) => { return a.startMs - b.startMs; });
		//console.log(this.parser);
	}
	addMIDIComments(project: Zvoog_Project) {
		for (let ii = 0; ii < project.timeline.length; ii++) {
			project.comments.push({ points: [] });
		}

		for (let ii = 0; ii < this.parser.midiheader.lyricsList.length; ii++) {
			let textpoint = this.parser.midiheader.lyricsList[ii];
			let pnt = this.findMeasureSkipByTime(textpoint.ms / 1000, project.timeline);
			if (pnt) {
				//console.log(pnt.idx, pnt.skip.count + '/' + pnt.skip.part, textpoint.ms, textpoint.txt);
				this.addLyricsPoints(project.comments[pnt.idx], { count: pnt.skip.count, part: pnt.skip.part }, textpoint.txt);
			}
		}
		//this.addLyricsPoints(project.comments[0], { count: 0, part: 4 }, 'import from .mid');
	}
	addLyricsPoints(bar: Zvoog_CommentMeasure, skip: Zvoog_Metre, txt: string) {
		let cnt = bar.points.length;
		bar.points[cnt] = {
			skip: skip
			, text: //cnt + ':' + skip.count + '/' + skip.part + ':' + 
				txt
			, row: cnt
		}
	}
	findMeasureSkipByTime(timeFromStart: number, measures: Zvoog_SongMeasure[]): null | { idx: number, skip: Zvoog_Metre } {
		let curMeasureStartS = 0;
		let mm = MMUtil();
		for (let ii = 0; ii < measures.length; ii++) {
			let curMeasure = measures[ii];
			let measureDurationS = mm.set(curMeasure.metre).duration(curMeasure.tempo);

			if (curMeasureStartS + measureDurationS > timeFromStart + 0.001) {
				let delta = timeFromStart - curMeasureStartS;
				if (delta < 0) {
					delta = 0;
				}
				//let curSkip = mm.calculate(delta, curMeasure.tempo).strip(8);
				//let timeSkip = mm.set(curSkip).duration(curMeasure.tempo);
				//console.log(delta, measureDurationS);
				return {
					idx: ii
					, skip: mm.calculate(delta, curMeasure.tempo).floor(8)
				};
			}
			curMeasureStartS = curMeasureStartS + measureDurationS;
		}
		return null;
	}
	findVolumeDrum(midipitch: number): { idx: number, ratio: number } {
		let midi = midipitch;
		//General MIDI 2 (Expanded Range)
		//27/Eb1 High Q
		if (midipitch == 27) midi = 78
		//28/E1 Slap
		if (midipitch == 28) midi = 79
		//29/F1 Scratch Push
		if (midipitch == 29) midi = 80
		//30/Gb1 Scratch Pull
		if (midipitch == 30) midi = 81
		//31/G1 Sticks
		if (midipitch == 31) midi = 60
		//32/Ab1 Square Click
		if (midipitch == 32) midi = 63
		//33/A1 Metronome Click
		if (midipitch == 33) midi = 70
		//34/Bb1 Metronome Bell
		if (midipitch == 34) midi = 56
		//82/Bb5 Shaker (GM2)
		if (midipitch == 82) midi = 73
		//83/B5 Jingle Bell (GM2)
		if (midipitch == 83) midi = 53
		//84/C5 Belltree (GM2)
		if (midipitch == 84) midi = 67
		//85/Db5 Castanets (GM2)
		if (midipitch == 85) midi = 37
		//86/D5 Mute Surdo (GM2)
		if (midipitch == 86) midi = 70
		//87/Eb5 Open Surdo (GM2)
		if (midipitch == 87) midi = 63


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
			//if(note.trackidx==3 && note.channelidx==5)console.log('check',note.trackidx, note.channelidx,note.startMs,ii,barStart,durationMs);
			if (note.startMs >= barStart && note.startMs < barStart + durationMs) {
				//if(note.trackidx==3)console.log('addTrackNote',note.trackidx, note.channelidx);
				let zvootraidx = this.takeProTrackNo(allTracks, note.trackidx, note.channelidx, null);
				let zvooginstrack = tracks[zvootraidx];
				let noteStartMs = note.startMs - barStart;
				let when = MMUtil().set(measure.metre).calculate(noteStartMs / 1000, measure.tempo).strip(32).metre();
				//console.log(tracks, insidx, instrack);
				//instrack.measures[ii]..skips.push(when);
				//if(note.trackidx==3)console.log('addTrackNote',note.trackidx, note.channelidx,zvootraidx);
				let chord = this.takeChord(zvooginstrack.measures[ii], when);
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
		//if(note.trackidx==3)console.log('skip addTrackNote',note.trackidx, note.channelidx);
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
				let when = MMUtil().set(measure.metre).calculate(noteStartMs / 1000, measure.tempo).strip(32).metre();
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
		let midiProgram = this.findProgramForChannel(midiChannel);
		for (let ii = 0; ii < allTracks.length; ii++) {
			let it = allTracks[ii];
			if (it.midiTrack == midiTrack && it.midiProgram == midiProgram) {
				return ii;
			}
		}
		//let title: string = '';
		if (trackVolumePoints) {

			allTracks.push({ midiTrack: midiTrack, midiProgram: midiProgram, midiTitle: '' + midiProgram, trackVolumePoints: trackVolumePoints });
		} else {
			allTracks.push({ midiTrack: midiTrack, midiProgram: midiProgram, midiTitle: '' + midiProgram, trackVolumePoints: [] });
		}
		//console.log('add track', midiTrack, midiChannel, midiProgram);
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
