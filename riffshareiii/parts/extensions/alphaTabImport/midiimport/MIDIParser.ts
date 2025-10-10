type XYp = {
	x: number;
	y: number;
};
type PP = {
	p1: XYp;
	p2: XYp;
};
let pluckDiff = 23;
type TicksAverageTime = { avgstartms: number, items: number[] };
class MidiParser {
	alignedMIDIevents: { startMs: number, avg: number, events: MIDIEvent[] }[] = [];
	midiheader: MIDIFileHeader;
	parsedTracks: MIDIFileTrack[];
	instrumentNamesArray: string[] = [];
	drumNamesArray: string[] = [];
	EVENT_META: number = 0xff;//255
	EVENT_SYSEX: number = 0xf0;//240
	EVENT_DIVSYSEX: number = 0xf7;//247
	EVENT_MIDI: number = 0x8;
	// Meta event types https://www.recordingblogs.com/wiki/midi-meta-messages
	EVENT_META_SEQUENCE_NUMBER: number = 0x00;//
	EVENT_META_TEXT: number = 0x01;
	EVENT_META_COPYRIGHT_NOTICE: number = 0x02;
	EVENT_META_TRACK_NAME: number = 0x03;
	EVENT_META_INSTRUMENT_NAME: number = 0x04;
	EVENT_META_LYRICS: number = 0x05;
	EVENT_META_MARKER: number = 0x06;
	EVENT_META_CUE_POINT: number = 0x07;
	EVENT_META_MIDI_CHANNEL_PREFIX: number = 0x20;//32 https://www.recordingblogs.com/wiki/midi-channel-prefix-meta-message
	EVENT_META_END_OF_TRACK: number = 0x2f;//47
	EVENT_META_SET_TEMPO: number = 0x51;//81
	EVENT_META_SMTPE_OFFSET: number = 0x54;//84
	EVENT_META_TIME_SIGNATURE: number = 0x58;//88 https://www.recordingblogs.com/wiki/midi-time-signature-meta-message
	EVENT_META_KEY_SIGNATURE: number = 0x59;//89 https://www.recordingblogs.com/wiki/midi-key-signature-meta-message
	EVENT_META_SEQUENCER_SPECIFIC: number = 0x7f;//127
	// MIDI event types
	EVENT_MIDI_NOTE_OFF: number = 0x8;
	EVENT_MIDI_NOTE_ON: number = 0x9;
	EVENT_MIDI_NOTE_AFTERTOUCH: number = 0xa;//10
	EVENT_MIDI_CONTROLLER: number = 0xb;//11
	EVENT_MIDI_PROGRAM_CHANGE: number = 0xc;//12
	EVENT_MIDI_CHANNEL_AFTERTOUCH: number = 0xd;//13
	EVENT_MIDI_PITCH_BEND: number = 0xe;//14
	midiEventType: number = 0;
	midiEventChannel: number = 0;
	midiEventParam1: number = 0;

	programTrackChannel: { eventProgram: number, eventChannel: number, eventTrack: number, from: MIDIEvent }[]=[];

	controller_BankSelectMSB = 0x00;
	controller_ModulationWheel = 0x01;
	controller_coarseDataEntrySlider: number = 0x06;//6
	controller_coarseVolume: number = 0x07;
	controller_ballance: number = 0x08;
	controller_pan: number = 0x0A;//10
	controller_expression: number = 0x0B;//11
	controller_BankSelectLSBGS: number = 0x20;//32
	controller_fineDataEntrySlider: number = 0x26;//38
	controller_ReverbLevel = 0x5B;//91
	controller_HoldPedal1 = 0x40;//64
	controller_TremoloDepth = 0x5C;//92
	controller_ChorusLevel = 0x5D;//93
	controller_NRPNParameterLSB: number = 0x62;//98
	controller_NRPNParameterMSB: number = 0x63;//99

	controller_fineRPN: number = 0x64;//100
	controller_coarseRPN: number = 0x65;//101

	controller_ResetAllControllers: number = 0x79;//121


	constructor(arrayBuffer: ArrayBuffer) {
		//console.log(this);
		this.midiheader = new MIDIFileHeader(arrayBuffer);
		this.parseTracks(arrayBuffer);

	}
	parseTracks(arrayBuffer: ArrayBuffer) {
		//console.log('start parseTracks');
		var curIndex: number = this.midiheader.HEADER_LENGTH;
		var trackCount: number = this.midiheader.trackCount;
		this.parsedTracks = [];
		for (var i = 0; i < trackCount; i++) {
			var track: MIDIFileTrack = new MIDIFileTrack(arrayBuffer, curIndex);
			this.parsedTracks.push(track);
			// Updating index to the track end
			curIndex = curIndex + track.trackLength + 8;
		}
		/*var format = this.midiheader.getFormat();
		if (1 == format || 1 == this.midiheader.trackCount) {
			console.log('format', format,'tracks',this.midiheader.trackCount);
			for (var i = 0; i < this.parsedTracks.length; i++) {
				this.parseTrackEvents(this.parsedTracks[i]);
			}

		} else {
			for (var i = 0; i < this.parsedTracks.length; i++) {
				this.parseTrackEvents(this.parsedTracks[i]);
			}
		}*/
		for (var i = 0; i < this.parsedTracks.length; i++) {
			this.parseTrackEvents(this.parsedTracks[i]);
		}
		this.parseNotes();
		/*if (this.midiheader.metersList.length > 1) {
			if (this.midiheader.metersList[1].ms < 4321) {
				this.midiheader.metersList[0].count = this.midiheader.metersList[1].count
				this.midiheader.metersList[0].division = this.midiheader.metersList[1].division
			}
		}*/
		this.simplifyAllBendPaths();
	}
	toText(arr: number[]): string {
		let txt = '';
		try {
			let win1251decoder = new TextDecoder("windows-1251");
			//let utf8decoder = new TextDecoder("utf-8");
			let bytes = new Uint8Array(arr);
			let txt1251 = win1251decoder.decode(bytes);
			//let txt8 = utf8decoder.decode(bytes);
			//console.log('decode',txt8,txt1251);

			txt = txt1251;
		} catch (xx) {
			console.log(xx);
			var rr: string = '';
			for (var ii = 0; ii < arr.length; ii++) {
				rr = rr + String.fromCharCode(arr[ii]);
			}
			txt = rr;
		}


		txt = txt.replace("\\n", " ");
		txt = txt.replace("\\r", " ");
		txt = txt.replace("\\t", " ");
		txt = txt.replace("\n", " ");
		txt = txt.replace("\r", " ");
		txt = txt.replace("\t", " ");
		txt = txt.replace("\\", " ");
		txt = txt.replace("/", " ");
		txt = txt.replace("  ", " ");
		txt = txt.replace("  ", " ");
		txt = txt.replace("  ", " ");
		txt = txt.replace("  ", " ");
		txt = txt.replace("  ", " ");
		txt = txt.replace("  ", " ");
		txt = txt.replace("  ", " ");
		txt = txt.replace("  ", " ");
		txt = txt.replace("  ", " ");

		return txt;
	}
	/*findChordBefore(when: number, track: MIDIFileTrack, channel: number): TrackChord | null {
		for (var i = 0; i < track.trackChords.length; i++) {
			var chord = track.trackChords[track.trackChords.length - i - 1];
			if (chord.startMs < when && chord.channelidx == channel) {
				return chord;
			}
		}
		return null;
	}*/
	/*findOpenedNoteBefore(firstPitch: number, when: number, track: MIDIFileTrack, channel: number): { chord: TrackChord, note: TrackNote } | null {
		var before = when;
		var chord = this.findChordBefore(before, track, channel);
		while (chord) {
			for (var i = 0; i < chord.tracknotes.length; i++) {
				var note: TrackNote = chord.tracknotes[i];
				if (!(note.closed)) {
					//if (firstPitch == note.points[0].pitch) {
					if (firstPitch == note.basePitch) {
						return { chord: chord, note: note };
					}
				}
			}
			before = chord.startMs;
			chord = this.findChordBefore(before, track, channel);
		}
		return null;
	}*/
	findOpenedNoteBefore(firstPitch: number, when: number, track: MIDIFileTrack, channel: number): TrackNote | null {
		for (var i = 0; i < track.trackNotes.length; i++) {
			let trNote = track.trackNotes[track.trackNotes.length - i - 1];
			//console.log((track.trackNotes.length - i - 1),trNote,track);
			if (trNote.startMs < when && trNote.channelidx == channel) {
				if (!(trNote.closed)) {
					if (trNote.basePitch == firstPitch) {
						return trNote;
					}
				}
			}
		}
		return null;
	}
	findLastNoteBefore(when: number, track: MIDIFileTrack, channel: number): TrackNote | null {
		for (var i = 0; i < track.trackNotes.length; i++) {
			let trNote = track.trackNotes[track.trackNotes.length - i - 1];
			if (trNote.startMs < when && trNote.channelidx == channel) {
				return trNote;
			}
		}
		return null;
	}
	/*takeChord(when: number, track: MIDIFileTrack, channel: number): TrackChord {
		for (var i = 0; i < track.trackChords.length; i++) {
			if (track.trackChords[i].startMs == when && track.trackChords[i].channelidx == channel) {
				return track.trackChords[i];
			}
		}
		var ch: TrackChord = {
			startMs: when
			, channelidx: channel
			, tracknotes: []
		};
		track.trackChords.push(ch);
		return ch;
	}*/
	/*
	takeOpenedNote(first: number, when: number, track: MIDIFileTrack, channel: number): TrackNote {
		var chord: TrackChord = this.takeChord(when, track, channel);
		for (var i = 0; i < chord.tracknotes.length; i++) {
			if (!(chord.tracknotes[i].closed)) {
				//if (chord.notes[i].points[0].pitch == first) {
				if (chord.tracknotes[i].basePitch == first) {
					return chord.tracknotes[i];
				}
			}
		}
		//var pi: TrackNote = { closed: false, points: [] };
		var pi: TrackNote = { closed: false, bendPoints: [], basePitch: first, baseDuration: -1 };
		//pi.points.push({ pointDuration: -1, pitch: first });
		chord.tracknotes.push(pi);
		return pi;
	}
*/
	takeOpenedNote(first: number, when: number, trackIdx: number, track: MIDIFileTrack, channel: number): TrackNote {
		for (var i = 0; i < track.trackNotes.length; i++) {
			let trNote = track.trackNotes[i];
			if (trNote.startMs == when && trNote.channelidx == channel) {
				if (!(trNote.closed)) {
					if (trNote.basePitch == first) {
						return trNote;
					}
				}
			}
		}
		/*let program = -1;
		for (let cc = 0; cc < track.programChannel.length; cc++) {
			if (track.programChannel[cc].eventChannel == channel) {
				program = track.programChannel[cc].eventProgram;
			}
		}*/
		//console.log(program);
		var pi: TrackNote = {
			basePitch: first, startMs: when, avgMs: -1
			, trackidx: trackIdx
			, channelidx: channel
			, baseDuration: -1
			, closed: false
			//, cuprogram: program
			, bendPoints: []
		};
		track.trackNotes.push(pi);
		return pi;
	}
	distanceToPoint(line: PP, point: XYp): number {
		var m: number = (line.p2.y - line.p1.y) / (line.p2.x - line.p1.x);
		var b: number = line.p1.y - (m * line.p1.x);
		var d: number[] = [];
		d.push(Math.abs(point.y - (m * point.x) - b) / Math.sqrt(Math.pow(m, 2) + 1));
		d.push(Math.sqrt(Math.pow((point.x - line.p1.x), 2) + Math.pow((point.y - line.p1.y), 2)));
		d.push(Math.sqrt(Math.pow((point.x - line.p2.x), 2) + Math.pow((point.y - line.p2.y), 2)));
		d.sort(function (a, b) {
			return (a - b);
		});
		return d[0];
	};
	douglasPeucker(points: XYp[], tolerance: number): XYp[] {
		if (points.length <= 2) {
			return [points[0]];
		}
		var returnPoints: XYp[] = [];
		var line: PP = { p1: points[0], p2: points[points.length - 1] };
		var maxDistance = 0;
		var maxDistanceIndex = 0;
		var p: XYp;
		for (var i = 1; i <= points.length - 2; i++) {
			var distance = this.distanceToPoint(line, points[i]);
			if (distance > maxDistance) {
				maxDistance = distance;
				maxDistanceIndex = i;
			}
		}
		if (maxDistance >= tolerance) {
			p = points[maxDistanceIndex];
			this.distanceToPoint(line, p);
			returnPoints = returnPoints.concat(this.douglasPeucker(points.slice(0, maxDistanceIndex + 1), tolerance));
			returnPoints = returnPoints.concat(this.douglasPeucker(points.slice(maxDistanceIndex, points.length), tolerance));
		} else {
			p = points[maxDistanceIndex];
			this.distanceToPoint(line, p);
			returnPoints = [points[0]];
		}
		return returnPoints;
	};
	/*
	simplifyAllBendPaths() {
		let msMin = 25;
		for (var t = 0; t < this.parsedTracks.length; t++) {
			var track: MIDIFileTrack = this.parsedTracks[t];
			for (var ch = 0; ch < track.trackChords.length; ch++) {
				var chord: TrackChord = track.trackChords[ch];
				for (var n = 0; n < chord.tracknotes.length; n++) {
					var note: TrackNote = chord.tracknotes[n];
					if (note.bendPoints.length > 0) {

						let simplifiedPath: NotePitch[] = [];
						let cuPointDuration = 0;
						let lastPitchDelta = 0;
						for (let pp = 0; pp < note.bendPoints.length; pp++) {
							let cuPoint = note.bendPoints[pp];
							lastPitchDelta = cuPoint.basePitchDelta;
							cuPointDuration = cuPointDuration + cuPoint.pointDuration;
							if (cuPointDuration > msMin) {
								simplifiedPath.push({ pointDuration: cuPointDuration, basePitchDelta: lastPitchDelta });
								cuPointDuration = 0;
							} else {
								if (simplifiedPath.length > 0) {
									let prePoint = simplifiedPath[simplifiedPath.length - 1];
									prePoint.basePitchDelta = lastPitchDelta;
								}
							}
						}
						simplifiedPath.push({ pointDuration: cuPointDuration, basePitchDelta: lastPitchDelta });
						note.bendPoints = simplifiedPath;
						//console.log(note,simplifiedPath);
					} else {
						/if (note.bendPoints.length == 1) {
							if (note.bendPoints[0].pointDuration > 4321) {
								note.bendPoints[0].pointDuration = 432;
							}
							console.log('to long',note);
						}/
						if (note.baseDuration > 7654) {
							//console.log('to long',note);
							note.baseDuration = 4321;
						}
					}
					//console.log(note);
				}
			}
		}
	}
	*/
	simplifyAllBendPaths() {
		let msMinPointDuration = 25;
		for (var t = 0; t < this.parsedTracks.length; t++) {
			var track: MIDIFileTrack = this.parsedTracks[t];
			for (var nn = 0; nn < track.trackNotes.length; nn++) {
				var note: TrackNote = track.trackNotes[nn];
				if (note.bendPoints.length > 0) {
					let simplifiedPath: NotePitch[] = [];
					let cuPointDuration = 0;
					let lastPitchDelta = 0;
					for (let pp = 0; pp < note.bendPoints.length; pp++) {
						let cuPoint = note.bendPoints[pp];
						lastPitchDelta = cuPoint.basePitchDelta;
						cuPointDuration = cuPointDuration + cuPoint.pointDuration;
						if (cuPointDuration > msMinPointDuration) {
							simplifiedPath.push({ pointDuration: cuPointDuration, basePitchDelta: lastPitchDelta });
							cuPointDuration = 0;
						} else {
							if (simplifiedPath.length > 0) {
								let prePoint = simplifiedPath[simplifiedPath.length - 1];
								prePoint.basePitchDelta = lastPitchDelta;
							}
						}
					}
					simplifiedPath.push({ pointDuration: cuPointDuration, basePitchDelta: lastPitchDelta });
					note.bendPoints = simplifiedPath;
				} else {
					if (note.baseDuration > 7654) {
						note.baseDuration = 4321;
					}
				}
			}
		}
	}
	/*dumpResolutionChanges(): void {
		console.log('dumpResolutionChanges');
		this.midiheader.changesResolutionBPM = [];
		let tickResolution: number = this.midiheader.get0TickResolution();
		let reChange = { track: -1, ms: -1, newresolution: tickResolution, bpm: 120, evnt: null };
		this.midiheader.changesResolutionBPM.push(reChange);
		for (var t = 0; t < this.parsedTracks.length; t++) {
			var track: MIDIFileTrack = this.parsedTracks[t];
			let playTimeTicks: number = 0;
			for (var e = 0; e < track.trackevents.length; e++) {
				var cuevnt = track.trackevents[e];
				let curDelta: number = 0.0;
				if (cuevnt.delta) curDelta = cuevnt.delta;
				playTimeTicks = playTimeTicks + curDelta * tickResolution / 1000.0;
				if (cuevnt.basetype === this.EVENT_META) {
					if (cuevnt.subtype === this.EVENT_META_SET_TEMPO) {

						if (cuevnt.tempo) {
							tickResolution = this.midiheader.getCalculatedTickResolution(cuevnt.tempo);
							let reChange = {
								track: t
								, ms: playTimeTicks
								//, ms: cuevnt.playTimeMs
								, newresolution: tickResolution
								, bpm: (cuevnt.tempoBPM) ? cuevnt.tempoBPM : 120
								, evnt: cuevnt
							};
							//console.log(cuevnt.playTimeMs);
							this.midiheader.changesResolutionBPM.push(reChange);
							//console.log(playTimeTicks, 'resolution', tickResolution, 'bpm', reChange.bpm);
						}
					}
				}
			}
		}
		this.midiheader.changesResolutionBPM.sort((a, b) => { return a.ms - b.ms; });
	}*/
	/*findResolutionBefore(ms: number): number {
		for (var i = this.midiheader.changesResolutionBPM.length - 1; i >= 0; i--) {
			if (this.midiheader.changesResolutionBPM[i].ms <= ms) {
				return this.midiheader.changesResolutionBPM[i].newresolution
			}
		}
		return 0;
	}*/
	/*adjustChangesResolutionBPM() {
		for (var i = 0; i < this.midiheader.changesResolutionBPM.length; i++) {
			let ee = this.midiheader.changesResolutionBPM[i].evnt;
			if (ee) {
				this.midiheader.changesResolutionBPM[i].ms = ee.playTimeMs
			}
		}
	}*/
	nextByAllTracksEvent(): MIDIEvent | null {
		let minDeltaEvent: MIDIEvent | null = null;
		let trackWithSmallestDelta: MIDIFileTrack | null = null;
		let minDeltaTrackIdx = -1;
		for (let tt = 0; tt < this.parsedTracks.length; tt++) {
			var atrack: MIDIFileTrack = this.parsedTracks[tt];
			if (atrack.currentEvent) {
				if (trackWithSmallestDelta) {
					if (trackWithSmallestDelta.currentEvent) {
						if (trackWithSmallestDelta.currentEvent.delta > atrack.currentEvent.delta) {
							trackWithSmallestDelta = atrack;
							minDeltaEvent = trackWithSmallestDelta.currentEvent;
							minDeltaTrackIdx = tt;
						}
					}
				} else {
					trackWithSmallestDelta = atrack;
					minDeltaEvent = trackWithSmallestDelta.currentEvent;
					minDeltaTrackIdx = tt;
				}
			}
		}
		if (trackWithSmallestDelta) {
			if (minDeltaEvent) {//trackWithSmallestDelta.currentEvent) {
				//trackWithSmallestDelta.moveNextCuEvent();
				for (let tt = 0; tt < this.parsedTracks.length; tt++) {
					var atrack: MIDIFileTrack = this.parsedTracks[tt];
					if (tt == minDeltaTrackIdx) {
						atrack.moveNextCuEvent();
					} else {
						if (atrack.currentEvent) {
							atrack.currentEvent.delta = atrack.currentEvent.delta - minDeltaEvent?.delta;
						}
					}
				}
			}
		}
		return minDeltaEvent;
	}
	/*parseTicks2time(track: MIDIFileTrack) {
		console.log('parseTicks2time');
		let tickResolution: number = this.findResolutionBefore(0);
		let playTimeTicks: number = 0;
		for (let e = 0; e < track.trackevents.length; e++) {

			let evnt = track.trackevents[e];

			let curDelta: number = 0.0;
			if (evnt.delta) curDelta = evnt.delta;
			let searchPlayTimeTicks = playTimeTicks + curDelta * tickResolution / 1000.0;
			tickResolution = this.findResolutionBefore(searchPlayTimeTicks);

			evnt.preTimeMs = playTimeTicks;
			playTimeTicks = playTimeTicks + curDelta * tickResolution / 1000.0;

			evnt.playTimeMs = playTimeTicks;
			evnt.deltaTimeMs = curDelta * tickResolution / 1000.0;
		}
		//this.adjustChangesResolutionBPM();
	}*/
	addResolutionPoint(trackIdx: number, playTimeTicks: number, tickResolution: number, tempo: number, vnt: MIDIEvent | null) {
		let reChange: { track: number, ms: number, newresolution: number, bpm: number, evnt: MIDIEvent | null } = {
			track: trackIdx
			, ms: playTimeTicks
			//, ms: cuevnt.playTimeMs
			, newresolution: tickResolution
			, bpm: tempo
			, evnt: vnt
		};
		//console.log(cuevnt.playTimeMs);
		this.midiheader.changesResolutionTempo.push(reChange);
		this.midiheader.changesResolutionTempo.sort((a, b) => { return a.ms - b.ms; });
	}
	fillEventsTimeMs() {
		console.log('fillEventsTimeMs');
		//this.dumpResolutionChanges();
		let tickResolutionAt0: number = this.midiheader.get0TickResolution();
		//let reChange = { track: -1, ms: -1, newresolution: tickResolution, bpm: 120, evnt: null };
		//this.midiheader.changesResolutionBPM.push(reChange);
		this.addResolutionPoint(-1, -1, tickResolutionAt0, 120, null);
		var format = this.midiheader.getFormat();
		console.log('format', format, 'tracks', this.midiheader.trackCount, this.parsedTracks.length);
		if (format == 1) {//|| this.midiheader.trackCount > 1) {
			console.log('multi track');
			/*for (let t = 0; t < this.parsedTracks.length; t++) {
				var singleParsedTrack: MIDIFileTrack = this.parsedTracks[t];
				this.parseTicks2time(singleParsedTrack);
			}*/
			let playTime = 0;
			let tickResolution = this.midiheader.getCalculatedTickResolution(0);
			for (let tt = 0; tt < this.parsedTracks.length; tt++) {
				this.parsedTracks[tt].moveNextCuEvent();
			}
			let cuevnt = this.nextByAllTracksEvent();
			while (cuevnt) {
				if (cuevnt.delta) {
					playTime = playTime + (cuevnt.delta * tickResolution) / 1000;
				}
				//console.log(playTime, cuevnt);
				cuevnt.playTimeMs = playTime;
				if (cuevnt.basetype === this.EVENT_META) {
					// tempo change events
					if (cuevnt.subtype === this.EVENT_META_SET_TEMPO) {
						tickResolution = this.midiheader.getCalculatedTickResolution(cuevnt.tempo ? cuevnt.tempo : 0);
						//console.log(playTime,'11 tickResolution',tickResolution,'bpm',event.tempoBPM);
						//console.log(cuevnt.tempoBPM, tickResolution);
						this.addResolutionPoint(-1, playTime, tickResolution, cuevnt.tempoBPM ? cuevnt.tempoBPM : 12, cuevnt);
					}
				}
				cuevnt = this.nextByAllTracksEvent();
			}
		} else {
			console.log('single track');
			let playTime = 0;
			let tickResolution = this.midiheader.getCalculatedTickResolution(0);
			for (let t = 0; t < this.parsedTracks.length; t++) {
				var track: MIDIFileTrack = this.parsedTracks[t];
				if (format == 2) {
					//
				} else {
					playTime = 0;
				}
				//playTime = (2 === format && playTime ? playTime : 0);
				for (let e = 0; e < track.trackevents.length; e++) {
					let trevnt = track.trackevents[e];
					//playTime += event.delta ? (event.delta * tickResolution) / 1000 : 0;
					playTime = playTime + trevnt.delta * tickResolution / 1000;
					trevnt.playTimeMs = playTime;
					if (trevnt.basetype === this.EVENT_META) {
						// tempo change events
						if (trevnt.subtype === this.EVENT_META_SET_TEMPO) {
							tickResolution = this.midiheader.getCalculatedTickResolution(trevnt.tempo ? trevnt.tempo : 0);
							this.addResolutionPoint(-1, playTime, tickResolution, trevnt.tempoBPM ? trevnt.tempoBPM : 12, trevnt);
						}
					}

				}
				//this.parseTicks2time(singleParsedTrack);
			}
		}


	}
	alignEventsTime() {
		let maxDelta = 23;
		let starts: MIDIEvent[] = [];
		//let aligned: { startMs: number, avg: number, events: MIDIEvent[] }[] = [];
		for (let tt = 0; tt < this.parsedTracks.length; tt++) {
			var singleParsedTrack: MIDIFileTrack = this.parsedTracks[tt];
			for (var ee = 0; ee < singleParsedTrack.trackevents.length; ee++) {
				var evnt = singleParsedTrack.trackevents[ee];
				if (evnt.basetype == this.EVENT_MIDI) {
					if (evnt.subtype == this.EVENT_MIDI_NOTE_ON) {
						starts.push(evnt);
					}
				}
			}
		}
		starts.sort((a, b) => { return a.playTimeMs - b.playTimeMs; });
		//console.log(starts);
		if (starts.length) {
			let evnt = starts[0];
			this.alignedMIDIevents.push({ startMs: evnt.playTimeMs, avg: 0, events: [evnt] });
			for (let ee = 1; ee < starts.length; ee++) {
				let evnt = starts[ee];
				let last = this.alignedMIDIevents[this.alignedMIDIevents.length - 1];
				let pretime = last.events[last.events.length - 1].playTimeMs;
				if (evnt.playTimeMs < pretime + maxDelta) {
					last.events.push(evnt);
				} else {
					this.alignedMIDIevents.push({ startMs: evnt.playTimeMs, avg: 0, events: [evnt] });
				}
			}
			for (let ii = 0; ii < this.alignedMIDIevents.length; ii++) {
				let smm = 0;
				for (ee = 0; ee < this.alignedMIDIevents[ii].events.length; ee++) {
					smm = smm + this.alignedMIDIevents[ii].events[ee].playTimeMs;
				}
				this.alignedMIDIevents[ii].avg = Math.round(smm / this.alignedMIDIevents[ii].events.length);
			}
			//console.log(aligned);
			for (let ii = 0; ii < this.alignedMIDIevents.length; ii++) {
				for (ee = 0; ee < this.alignedMIDIevents[ii].events.length; ee++) {
					this.alignedMIDIevents[ii].events[ee].playTimeMs = this.alignedMIDIevents[ii].avg;
				}
			}
		}

	}
	parseNotes() {
		//console.log('parseNotes');
		this.fillEventsTimeMs();
		this.alignEventsTime();
		//console.log(this.midiheader.changesResolutionTempo);
		//this.dumpResolutionChanges();
		// counts which pitch-bend range message can be expected next
		//: number 1 (can be sent any time, except after pitch-bend range messages number 1 or 2)
		//, number 2 (required after number 1)
		//, number 3 (required after number 2)
		//, or number 4 (optional)
		var expectedState = 1;
		var expectedPitchBendRangeChannel: number | undefined | null = null;
		var pitchBendValuesRange = Array(16).fill(2); // Default pitch-bend range is 2 semitones.
		for (let t = 0; t < this.parsedTracks.length; t++) {
			var singleParsedTrack: MIDIFileTrack = this.parsedTracks[t];
			//this.parseTicks2time(singleParsedTrack);
			console.log('notes for track', t);
			for (var e = 0; e < singleParsedTrack.trackevents.length; e++) {
				if (Math.floor(e / 1000) == e / 1000) {
					//console.log('event',e);
				}
				var preState = expectedState;
				var evnt = singleParsedTrack.trackevents[e];
				if (evnt.basetype == this.EVENT_MIDI) {
					evnt.param1 = evnt.param1 ? evnt.param1 : 0;
					if (evnt.subtype == this.EVENT_MIDI_NOTE_ON) {
						if (evnt.param1 >= 0 && evnt.param1 <= 127) {
							var pitch = evnt.param1 ? evnt.param1 : 0;
							var when = 0;
							if (evnt.playTimeMs) when = evnt.playTimeMs;
							let trno = this.takeOpenedNote(pitch, when, t, singleParsedTrack, evnt.midiChannel ? evnt.midiChannel : 0);
							trno.volume = evnt.param2;
							trno.openEvent = evnt;
						}
					} else {
						if (evnt.subtype == this.EVENT_MIDI_NOTE_OFF) {
							if (evnt.param1 >= 0 && evnt.param1 <= 127) {
								var pitch = evnt.param1 ? evnt.param1 : 0;
								var when = 0;
								if (evnt.playTimeMs) when = evnt.playTimeMs;
								var openedNoteBefore = this.findOpenedNoteBefore(pitch, when, singleParsedTrack, evnt.midiChannel ? evnt.midiChannel : 0);
								if (openedNoteBefore) {
									openedNoteBefore.baseDuration = when - openedNoteBefore.startMs;
									openedNoteBefore.closed = true;
									openedNoteBefore.closeEvent = evnt;
								}
							}
						} else {
							if (evnt.subtype == this.EVENT_MIDI_PROGRAM_CHANGE) {
								console.log('EVENT_MIDI_PROGRAM_CHANGE', t + '/' + evnt.midiChannel, evnt.param1);
								if (evnt.param1 >= 0 && evnt.param1 <= 127) {
									let pair = {
										eventProgram: evnt.param1 ? evnt.param1 : 0
										, eventChannel: evnt.midiChannel ? evnt.midiChannel : 0
										, eventTrack: t
										, from: evnt
									};
									console.log(pair);
									//singleParsedTrack.programChannel.push(pair);
									this.programTrackChannel.push(pair);
								}
							} else {
								if (evnt.subtype == this.EVENT_MIDI_PITCH_BEND) {
									var eventWhen = evnt.playTimeMs ? evnt.playTimeMs : 0;
									//var chord: TrackChord | null = this.findChordBefore(eventWhen, singleParsedTrack, evnt.midiChannel ? evnt.midiChannel : 0);
									//if (chord) {
									//for (var i = 0; i < chord.tracknotes.length; i++) {
									//var note: TrackNote = chord.tracknotes[i];
									var note: TrackNote | null = this.findLastNoteBefore(eventWhen, singleParsedTrack, evnt.midiChannel ? evnt.midiChannel : 0);
									if (note) {
										let idx: number = evnt.midiChannel ? evnt.midiChannel : 0;
										let pp2 = evnt.param2 ? evnt.param2 : 0;
										var delta: number = (pp2 - 64.0) / 64.0 * pitchBendValuesRange[idx];
										var allPointsDuration = 0;
										for (var k = 0; k < note.bendPoints.length; k++) {
											allPointsDuration = allPointsDuration + note.bendPoints[k].pointDuration;
										}
										var point: NotePitch = {
											pointDuration: eventWhen - note.startMs - allPointsDuration
											, basePitchDelta: delta
										};
										if (!(note.closed)) {
											note.bendPoints.push(point);
										} else {
											//	console.log('no bend',point,'for closed',note);
										}

									}
								} else {
									if (evnt.subtype == this.EVENT_MIDI_CONTROLLER) {

										if (evnt.param1 == this.controller_coarseVolume) {
											var v = evnt.param2 ? evnt.param2 / 127 : 0;
											let point = { ms: evnt.playTimeMs, value: v, channel: evnt.midiChannel ? evnt.midiChannel : 0, track: t };
											singleParsedTrack.trackVolumePoints.push(point);
										} else {
											if (

												(expectedState == 1 && evnt.param1 == this.controller_coarseRPN && evnt.param2 == 0x00) ||
												(expectedState == 2 && evnt.param1 == this.controller_fineRPN && evnt.param2 == 0x00) ||
												(expectedState == 3 && evnt.param1 == this.controller_coarseDataEntrySlider) ||
												(expectedState == 4 && evnt.param1 == this.controller_fineDataEntrySlider)
											) {
												//console.log(expectedState,'->',evnt.param1,evnt.param2);
												//console.log('bend range',evnt.param2,evnt.midiChannel,expectedPitchBendRangeMessageNumber,pitchBendValuesRange);
												if (expectedState > 1 && evnt.midiChannel != expectedPitchBendRangeChannel) {
													console.log('Unexpected channel number in non-first pitch-bend RANGE (SENSITIVITY) message. MIDI file might be corrupt.');
												}
												expectedPitchBendRangeChannel = evnt.midiChannel;
												let idx: number = evnt.midiChannel ? evnt.midiChannel : 0;
												if (expectedState == 3) {
													pitchBendValuesRange[idx] = evnt.param2; // in semitones
													//console.log('bend range', idx, pitchBendValuesRange[idx], evnt.param2);
												}
												if (expectedState == 4) {
													let pp = evnt.param2 ? evnt.param2 : 0;
													pitchBendValuesRange[idx] = pitchBendValuesRange[idx] + pp / 100; // convert cents to semitones, add to semitones set in the previous MIDI message
													//console.log('bend range convert', idx, pitchBendValuesRange[idx], pp / 100);
												}
												expectedState++;
												if (expectedState == 5) {
													expectedState = 1;
												}

											} else {
												if (evnt.param1 == this.controller_BankSelectMSB
													|| evnt.param1 == this.controller_ModulationWheel
													|| evnt.param1 == this.controller_ReverbLevel
													|| evnt.param1 == this.controller_TremoloDepth
													|| evnt.param1 == this.controller_ChorusLevel
													|| evnt.param1 == this.controller_NRPNParameterLSB
													|| evnt.param1 == this.controller_NRPNParameterMSB
													|| evnt.param1 == this.controller_fineRPN
													|| evnt.param1 == this.controller_coarseRPN
													|| evnt.param1 == this.controller_coarseDataEntrySlider
													|| evnt.param1 == this.controller_ballance
													|| evnt.param1 == this.controller_pan
													|| evnt.param1 == this.controller_expression
													|| evnt.param1 == this.controller_BankSelectLSBGS
													|| evnt.param1 == this.controller_HoldPedal1
													|| evnt.param1 == this.controller_ResetAllControllers
													|| (evnt.param1 >= 32 && evnt.param1 <= 63) //LSB for Control 0-31
													|| (evnt.param1 >= 70 && evnt.param1 <= 79) //Sound Controller 1-10
												) {
													//console.log('skip controller', evnt.param1, evnt.param2, 'at', evnt.playTimeMs, 'ms, for channel', evnt.midiChannel);
												} else {
													//console.log('unknown controller', evnt.playTimeMs, 'ms, channel', evnt.midiChannel, ':', evnt.param1, evnt.param2);
												}
											}
										}
									}
								}
							}
						}
					}
					//}
				} else {

					if (evnt.subtype == this.EVENT_META_TEXT) {
						this.midiheader.lyricsList.push({ track: t, ms: evnt.playTimeMs ? evnt.playTimeMs : 0, txt: (evnt.text ? evnt.text : "") });
					}
					if (evnt.subtype == this.EVENT_META_MARKER) {
						this.midiheader.lyricsList.push({ track: t, ms: evnt.playTimeMs ? evnt.playTimeMs : 0, txt: (evnt.text ? evnt.text : "") });
					}
					if (evnt.subtype == this.EVENT_META_COPYRIGHT_NOTICE) {
						this.midiheader.lyricsList.push({ track: t, ms: evnt.playTimeMs ? evnt.playTimeMs : 0, txt: 'Copyright: ' + (evnt.text ? evnt.text : "") });
					}
					if (evnt.subtype == this.EVENT_META_TRACK_NAME) {
						singleParsedTrack.trackTitle = evnt.text ? evnt.text : '';
					}
					if (evnt.subtype == this.EVENT_META_INSTRUMENT_NAME) {
						singleParsedTrack.instrumentName = evnt.text ? evnt.text : '';
					}
					if (evnt.subtype == this.EVENT_META_LYRICS) {
						this.midiheader.lyricsList.push({ track: t, ms: evnt.playTimeMs ? evnt.playTimeMs : 0, txt: (evnt.text ? evnt.text : "") });
					}
					if (evnt.subtype == this.EVENT_META_CUE_POINT) {
						this.midiheader.lyricsList.push({ track: t, ms: evnt.playTimeMs ? evnt.playTimeMs : 0, txt: 'CUE: ' + (evnt.text ? evnt.text : "") });
					}
					if (evnt.subtype == this.EVENT_META_KEY_SIGNATURE) {

						var majSharpCircleOfFifths: string[] = ['C', 'G', 'D', 'A', 'E', 'B', 'F#'];
						var majFlatCircleOfFifths: string[] = ['C', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb'];
						var minSharpCircleOfFifths: string[] = ['Am', 'Em', 'Bm', 'F#m', 'C#m', 'G#m', 'D#'];
						var minFlatCircleOfFifths: string[] = ['Am', 'Dm', 'Gm', 'Cm', 'Fm', 'Bbm', 'Ebm'];

						var key: number = evnt.key ? evnt.key : 0;

						if (key > 127) key = key - 256;

						this.midiheader.keyFlatSharp = key;//+sharp-flat
						this.midiheader.keyMajMin = evnt.scale ? evnt.scale : 0;//0-maj, 1 min

						var signature = 'C';
						if (this.midiheader.keyFlatSharp >= 0) {
							if (this.midiheader.keyMajMin < 1) {
								signature = majSharpCircleOfFifths[Math.abs(this.midiheader.keyFlatSharp)];
							} else {
								signature = minSharpCircleOfFifths[Math.abs(this.midiheader.keyFlatSharp)];
							}
						} else {
							if (this.midiheader.keyMajMin < 1) {
								signature = majFlatCircleOfFifths[Math.abs(this.midiheader.keyFlatSharp)];
							} else {
								signature = minFlatCircleOfFifths[Math.abs(this.midiheader.keyFlatSharp)];
							}
						}
						this.midiheader.signsList.push({ track: t, ms: evnt.playTimeMs ? evnt.playTimeMs : 0, sign: signature });
					}
					if (evnt.subtype == this.EVENT_META_SET_TEMPO) {
						this.midiheader.tempoBPM = evnt.tempoBPM ? evnt.tempoBPM : 120;
						//console.log('tempo', this.midiheader.tempoBPM, evnt);
					}
					if (evnt.subtype == this.EVENT_META_TIME_SIGNATURE) {
						this.midiheader.meterCount = evnt.param1 ? evnt.param1 : 4;
						var dvsn: number = evnt.param2 ? evnt.param2 : 2;
						if (dvsn == 1) this.midiheader.meterDivision = 2
						else if (dvsn == 2) this.midiheader.meterDivision = 4
						else if (dvsn == 3) this.midiheader.meterDivision = 8
						else if (dvsn == 4) this.midiheader.meterDivision = 16
						else if (dvsn == 5) this.midiheader.meterDivision = 32
						else if (dvsn == 0) this.midiheader.meterDivision = 1
						this.midiheader.metersList.push({
							track: t, ms: evnt.playTimeMs ? evnt.playTimeMs : 0
							, count: this.midiheader.meterCount, division: this.midiheader.meterDivision
							, evnt: evnt
						});
					}
				}
				if (preState == expectedState) { // If the current message wasn't an expected pitch-bend range message
					if (preState >= 2 && preState <= 3) {
						//console.log('Pitch-bend RANGE (SENSITIVITY) messages ended prematurely. MIDI file might be corrupt.');
					}
					if (preState == 4) { // The fourth message is optional, so since it wasn't sent, the setting of the pitch-bend range is done, and we might expect the first pitch-bend range message some time in the future
						expectedState = 1;
					}
				}
			}
		}
	}
	nextEvent(stream: DataViewStream): MIDIEvent {
		var index = stream.offset();
		var delta = stream.readVarInt();
		var eventTypeByte: number = stream.readUint8();
		var event: MIDIEvent = { offset: index, delta: delta, eventTypeByte: eventTypeByte, playTimeMs: 0 };
		if (0xf0 === (eventTypeByte & 0xf0)) {
			// Meta events
			if (eventTypeByte === this.EVENT_META) {
				event.basetype = this.EVENT_META;
				event.subtype = stream.readUint8();
				event.length = stream.readVarInt();
				switch (event.subtype) {
					case this.EVENT_META_SEQUENCE_NUMBER:
						event.msb = stream.readUint8();
						event.lsb = stream.readUint8();
						console.log('EVENT_META_SEQUENCE_NUMBER', event);
						return event;
					case this.EVENT_META_TEXT:
					case this.EVENT_META_COPYRIGHT_NOTICE:
					case this.EVENT_META_TRACK_NAME:
					case this.EVENT_META_INSTRUMENT_NAME:
					case this.EVENT_META_LYRICS:
					case this.EVENT_META_MARKER:
					case this.EVENT_META_CUE_POINT:
						event.data = stream.readBytes(event.length);
						event.text = this.toText(event.data ? event.data : []);
						return event;
					case this.EVENT_META_MIDI_CHANNEL_PREFIX:
						event.prefix = stream.readUint8();
						return event;
					case this.EVENT_META_END_OF_TRACK:
						return event;
					case this.EVENT_META_SET_TEMPO:
						event.tempo = (stream.readUint8() << 16) + (stream.readUint8() << 8) + stream.readUint8();
						event.tempoBPM = 60000000 / event.tempo;
						return event;
					case this.EVENT_META_SMTPE_OFFSET:
						event.hour = stream.readUint8();
						event.minutes = stream.readUint8();
						event.seconds = stream.readUint8();
						event.frames = stream.readUint8();
						event.subframes = stream.readUint8();
						return event;
					case this.EVENT_META_KEY_SIGNATURE:
						event.key = stream.readUint8();
						event.scale = stream.readUint8();
						return event;
					case this.EVENT_META_TIME_SIGNATURE:
						event.data = stream.readBytes(event.length);
						event.param1 = event.data[0];
						event.param2 = event.data[1];
						event.param3 = event.data[2];
						event.param4 = event.data[3];
						return event;
					case this.EVENT_META_SEQUENCER_SPECIFIC:
						event.data = stream.readBytes(event.length);
						return event;
					default:
						event.data = stream.readBytes(event.length);
						return event;
				}
				// System events
			} else {
				if (eventTypeByte === this.EVENT_SYSEX || eventTypeByte === this.EVENT_DIVSYSEX) {
					event.basetype = eventTypeByte;
					event.length = stream.readVarInt();
					event.data = stream.readBytes(event.length);
					return event;
					// Unknown event, assuming it's system like event
				} else {
					event.basetype = eventTypeByte;
					event.badsubtype = stream.readVarInt();
					event.length = stream.readUint8();
					event.data = stream.readBytes(event.length);
					return event;
				}
			}
		} else {
			// running status
			if (0 === (eventTypeByte & 0x80)) {
				if (!this.midiEventType) {
					throw new Error('no pre event' + stream.offset());
				}
				this.midiEventParam1 = eventTypeByte;
			} else {
				this.midiEventType = eventTypeByte >> 4;
				this.midiEventChannel = eventTypeByte & 0x0f;
				this.midiEventParam1 = stream.readUint8();
			}
			event.basetype = this.EVENT_MIDI;
			event.subtype = this.midiEventType;
			event.midiChannel = this.midiEventChannel;
			event.param1 = this.midiEventParam1;
			switch (this.midiEventType) {
				case this.EVENT_MIDI_NOTE_OFF:
					event.param2 = stream.readUint8();
					return event;
				case this.EVENT_MIDI_NOTE_ON:
					event.param2 = stream.readUint8();
					// If velocity is 0, it's a note off event in fact
					if (!event.param2) {
						event.subtype = this.EVENT_MIDI_NOTE_OFF;
						//event.param2 = 127; // Find a standard telling what to do here
						event.param2 = -1;
					}
					return event;
				case this.EVENT_MIDI_NOTE_AFTERTOUCH:
					event.param2 = stream.readUint8();
					return event;
				case this.EVENT_MIDI_CONTROLLER:
					event.param2 = stream.readUint8();
					if (event.param1 == 7) {
						//
					}
					return event;
				case this.EVENT_MIDI_PROGRAM_CHANGE:
					//
					return event;
				case this.EVENT_MIDI_CHANNEL_AFTERTOUCH:
					return event;
				case this.EVENT_MIDI_PITCH_BEND:
					event.param2 = stream.readUint8();
					return event;
				default:
					console.log('unknown note', event);
					return event;
			}
		}
	}
	parseTrackEvents(track: MIDIFileTrack) {
		var stream: DataViewStream = new DataViewStream(track.trackContent);
		this.midiEventType = 0;
		this.midiEventChannel = 0;
		this.midiEventParam1 = 0;
		while (!stream.end()) {
			var e: MIDIEvent = this.nextEvent(stream);
			track.trackevents.push(e);
		}
	}

	/*
		findNearestAvgTick(ms: number, stat: TicksAverageTime[]): number {
			let foundDiff = 1234567890;
			let fountMs = 0;
			for (let ii = 0; ii < stat.length; ii++) {
				let cuDiff = Math.abs(stat[ii].avgstartms - ms);
				if (foundDiff > cuDiff) {
					foundDiff = cuDiff;
					fountMs = stat[ii].avgstartms;
				}
			}
			return fountMs;
		}*/
	/*
		findPreMetre(ms: number): Zvoog_Metre {
			let cume: Zvoog_Metre = { count: this.midiheader.metersList[0].count, part: this.midiheader.metersList[0].division };
			for (let ii = this.midiheader.metersList.length - 1; ii >= 0; ii--) {
				cume = { count: this.midiheader.metersList[ii].count, part: this.midiheader.metersList[ii].division };
				if (ms >= this.midiheader.metersList[ii].ms - 99) {
					break;
				}
			}
			return cume;
		}*/
	/*findPreBPM(ms: number): number {
		let bpm = this.midiheader.changesResolutionBPM[0].bpm;
		for (let ii = this.midiheader.changesResolutionBPM.length - 1; ii >= 0; ii--) {
			bpm = this.midiheader.changesResolutionBPM[ii].bpm;
			if (ms >= this.midiheader.changesResolutionBPM[ii].ms - 99) {
				break;
			}
		}
		return bpm;
	}*/







}
