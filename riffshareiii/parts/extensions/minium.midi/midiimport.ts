class MidiParser {
	header: MIDIFileHeader;
	parsedTracks: MIDIFileTrack[];
	instrumentNamesArray: string[] = [];
	drumNamesArray: string[] = [];
	EVENT_META: number = 0xff;
	EVENT_SYSEX: number = 0xf0;
	EVENT_DIVSYSEX: number = 0xf7;
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
	EVENT_META_MIDI_CHANNEL_PREFIX: number = 0x20;//https://www.recordingblogs.com/wiki/midi-channel-prefix-meta-message
	EVENT_META_END_OF_TRACK: number = 0x2f;
	EVENT_META_SET_TEMPO: number = 0x51;
	EVENT_META_SMTPE_OFFSET: number = 0x54;
	EVENT_META_TIME_SIGNATURE: number = 0x58;//https://www.recordingblogs.com/wiki/midi-time-signature-meta-message
	EVENT_META_KEY_SIGNATURE: number = 0x59;//https://www.recordingblogs.com/wiki/midi-key-signature-meta-message
	EVENT_META_SEQUENCER_SPECIFIC: number = 0x7f;
	// MIDI event types
	EVENT_MIDI_NOTE_OFF: number = 0x8;
	EVENT_MIDI_NOTE_ON: number = 0x9;
	EVENT_MIDI_NOTE_AFTERTOUCH: number = 0xa;
	EVENT_MIDI_CONTROLLER: number = 0xb;
	EVENT_MIDI_PROGRAM_CHANGE: number = 0xc;
	EVENT_MIDI_CHANNEL_AFTERTOUCH: number = 0xd;
	EVENT_MIDI_PITCH_BEND: number = 0xe;
	midiEventType: number = 0;
	midiEventChannel: number = 0;
	midiEventParam1: number = 0;


	controller_BankSelectMSB = 0x00;
	controller_ModulationWheel = 0x01;
	controller_coarseDataEntrySlider: number = 0x06;//6
	controller_coarseVolume: number = 0x07;
	controller_ballance: number = 0x08;
	controller_pan: number = 0x0A;
	controller_expression: number = 0x0B;
	controller_BankSelectLSBGS: number = 0x20;
	controller_fineDataEntrySlider: number = 0x26;//38
	controller_ReverbLevel = 0x5B;
	controller_HoldPedal1 = 0x40;
	controller_TremoloDepth = 0x5C;
	controller_ChorusLevel = 0x5D;
	controller_NRPNParameterLSB: number = 0x62;
	controller_NRPNParameterMSB: number = 0x63;

	controller_fineRPN: number = 0x64;//100
	controller_coarseRPN: number = 0x65;//101

	controller_ResetAllControllers: number = 0x79;


	constructor(arrayBuffer: ArrayBuffer) {
		this.header = new MIDIFileHeader(arrayBuffer);
		this.parseTracks(arrayBuffer);

	}
	parseTracks(arrayBuffer: ArrayBuffer) {
		//console.log('start parseTracks');
		var curIndex: number = this.header.HEADER_LENGTH;
		var trackCount: number = this.header.trackCount;
		this.parsedTracks = [];
		for (var i = 0; i < trackCount; i++) {
			var track: MIDIFileTrack = new MIDIFileTrack(arrayBuffer, curIndex);
			this.parsedTracks.push(track);
			// Updating index to the track end
			curIndex = curIndex + track.trackLength + 8;
		}
		for (var i = 0; i < this.parsedTracks.length; i++) {
			this.parseTrackEvents(this.parsedTracks[i]);
		}
		this.parseNotes();
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
	findChordBefore(when: number, track: MIDIFileTrack, channel: number): TrackChord | null {
		for (var i = 0; i < track.chords.length; i++) {
			var chord = track.chords[track.chords.length - i - 1];
			if (chord.when < when && chord.channel == channel) {
				return chord;
			}
		}
		return null;
	}
	findOpenedNoteBefore(firstPitch: number, when: number, track: MIDIFileTrack, channel: number): { chord: TrackChord, note: TrackNote } | null {
		var before = when;
		var chord = this.findChordBefore(before, track, channel);
		while (chord) {
			for (var i = 0; i < chord.notes.length; i++) {
				var note: TrackNote = chord.notes[i];
				if (!(note.closed)) {
					//if (firstPitch == note.points[0].pitch) {
					if (firstPitch == note.basePitch) {
						return { chord: chord, note: note };
					}
				}
			}
			before = chord.when;
			chord = this.findChordBefore(before, track, channel);
		}
		return null;
	}
	takeChord(when: number, track: MIDIFileTrack, channel: number): TrackChord {
		for (var i = 0; i < track.chords.length; i++) {
			if (track.chords[i].when == when && track.chords[i].channel == channel) {
				return track.chords[i];
			}
		}
		var ch: TrackChord = {
			when: when
			, channel: channel
			, notes: []
		};
		track.chords.push(ch);
		return ch;
	}
	takeOpenedNote(first: number, when: number, track: MIDIFileTrack, channel: number): TrackNote {
		var chord: TrackChord = this.takeChord(when, track, channel);
		for (var i = 0; i < chord.notes.length; i++) {
			if (!(chord.notes[i].closed)) {
				//if (chord.notes[i].points[0].pitch == first) {
				if (chord.notes[i].basePitch == first) {
					return chord.notes[i];
				}
			}
		}
		//var pi: TrackNote = { closed: false, points: [] };
		var pi: TrackNote = { closed: false, bendPoints: [], basePitch: first, baseDuration: -1 };
		//pi.points.push({ pointDuration: -1, pitch: first });
		chord.notes.push(pi);
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
	simplifyAllBendPaths() {
		let msMin = 25;
		for (var t = 0; t < this.parsedTracks.length; t++) {
			var track: MIDIFileTrack = this.parsedTracks[t];
			for (var ch = 0; ch < track.chords.length; ch++) {
				var chord: TrackChord = track.chords[ch];
				for (var n = 0; n < chord.notes.length; n++) {
					var note: TrackNote = chord.notes[n];
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
						/*if (note.bendPoints.length == 1) {
							if (note.bendPoints[0].pointDuration > 4321) {
								note.bendPoints[0].pointDuration = 432;
							}
							console.log('to long',note);
						}*/
						if(note.baseDuration>7654){
							//console.log('to long',note);
							note.baseDuration=4321;
						}
					}
					//console.log(note);
				}
			}
		}
	}
	dumpResolutionChanges(): void {
		this.header.changes = [];
		let tickResolution: number = this.header.get0TickResolution();
		this.header.changes.push({ track: -1, ms: -1, resolution: tickResolution, bpm: 120 });
		for (var t = 0; t < this.parsedTracks.length; t++) {
			var track: MIDIFileTrack = this.parsedTracks[t];
			let playTimeTicks: number = 0;
			for (var e = 0; e < track.trackevents.length; e++) {
				var evnt = track.trackevents[e];
				let curDelta: number = 0.0;
				if (evnt.delta) curDelta = evnt.delta;
				playTimeTicks = playTimeTicks + curDelta * tickResolution / 1000.0;
				if (evnt.basetype === this.EVENT_META) {
					if (evnt.subtype === this.EVENT_META_SET_TEMPO) {
						if (evnt.tempo) {
							tickResolution = this.header.getCalculatedTickResolution(evnt.tempo);
							this.header.changes.push({ track: t, ms: playTimeTicks, resolution: tickResolution, bpm: (evnt.tempoBPM) ? evnt.tempoBPM : 120 });
						}
					}
				}
			}
		}
		this.header.changes.sort((a, b) => { return a.ms - b.ms; });
	}
	lastResolution(ms: number): number {
		for (var i = this.header.changes.length - 1; i >= 0; i--) {
			if (this.header.changes[i].ms <= ms) {
				return this.header.changes[i].resolution
			}
		}
		return 0;
	}
	parseTicks2time(track: MIDIFileTrack) {
		let tickResolution: number = this.lastResolution(0);
		let playTimeTicks: number = 0;
		for (let e = 0; e < track.trackevents.length; e++) {

			let evnt = track.trackevents[e];

			let curDelta: number = 0.0;
			if (evnt.delta) curDelta = evnt.delta;
			let searchPlayTimeTicks = playTimeTicks + curDelta * tickResolution / 1000.0;
			tickResolution = this.lastResolution(searchPlayTimeTicks);

			evnt.preTimeMs = playTimeTicks;
			playTimeTicks = playTimeTicks + curDelta * tickResolution / 1000.0;

			evnt.playTimeMs = playTimeTicks;
			evnt.deltaTimeMs = curDelta * tickResolution / 1000.0;
		}
	}

	parseNotes() {
		//console.log('parseNotes');
		this.dumpResolutionChanges();
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
			this.parseTicks2time(singleParsedTrack);
			//console.log('notes for track',t,singleParsedTrack);
			for (var e = 0; e < singleParsedTrack.trackevents.length; e++) {
				if(Math.floor(e/1000)==e/1000){
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
							let trno = this.takeOpenedNote(pitch, when, singleParsedTrack, evnt.midiChannel ? evnt.midiChannel : 0);
							trno.volume = evnt.param2;
							trno.openEvent = evnt;
						}
					} else {
						if (evnt.subtype == this.EVENT_MIDI_NOTE_OFF) {
							if (evnt.param1 >= 0 && evnt.param1 <= 127) {
								var pitch = evnt.param1 ? evnt.param1 : 0;
								var when = 0;
								if (evnt.playTimeMs) when = evnt.playTimeMs;
								var chpi = this.findOpenedNoteBefore(pitch, when, singleParsedTrack, evnt.midiChannel ? evnt.midiChannel : 0);
								if (chpi) {
									chpi.note.baseDuration = when - chpi.chord.when;
									chpi.note.closed = true;
									chpi.note.closeEvent = evnt;
								}
							}
						} else {
							if (evnt.subtype == this.EVENT_MIDI_PROGRAM_CHANGE) {
								if (evnt.param1 >= 0 && evnt.param1 <= 127) {
									singleParsedTrack.programChannel.push({
										program: evnt.param1 ? evnt.param1 : 0
										, channel: evnt.midiChannel ? evnt.midiChannel : 0
									});
								}
							} else {
								if (evnt.subtype == this.EVENT_MIDI_PITCH_BEND) {
									var eventWhen = evnt.playTimeMs ? evnt.playTimeMs : 0;
									var chord: TrackChord | null = this.findChordBefore(eventWhen, singleParsedTrack, evnt.midiChannel ? evnt.midiChannel : 0);
									if (chord) {
										for (var i = 0; i < chord.notes.length; i++) {
											var note: TrackNote = chord.notes[i];
											let idx: number = evnt.midiChannel ? evnt.midiChannel : 0;
												let pp2 = evnt.param2 ? evnt.param2 : 0;
												var delta: number = (pp2 - 64.0) / 64.0 * pitchBendValuesRange[idx];
												var allPointsDuration = 0;
												for (var k = 0; k < note.bendPoints.length; k++) {
													allPointsDuration = allPointsDuration + note.bendPoints[k].pointDuration;
												}
												var point: NotePitch = {
													pointDuration: eventWhen - chord.when - allPointsDuration
													, basePitchDelta: delta
												};
											if (!(note.closed)) {
												
												//when: event.playTime / 1000-track.notes[i].when
												
												
												note.bendPoints.push(point);
												//console.log('basePitchDelta',note,point);
											}else{
											//	console.log('no bend',point,'for closed',note);
											}
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
						this.header.lyrics.push({ track: t, ms: evnt.playTimeMs ? evnt.playTimeMs : 0, txt: (evnt.text ? evnt.text : "") });
					}
					if (evnt.subtype == this.EVENT_META_MARKER) {
						this.header.lyrics.push({ track: t, ms: evnt.playTimeMs ? evnt.playTimeMs : 0, txt: (evnt.text ? evnt.text : "") });
					}
					if (evnt.subtype == this.EVENT_META_COPYRIGHT_NOTICE) {
						this.header.lyrics.push({ track: t, ms: evnt.playTimeMs ? evnt.playTimeMs : 0, txt: 'Copyright: ' + (evnt.text ? evnt.text : "") });
					}
					if (evnt.subtype == this.EVENT_META_TRACK_NAME) {
						singleParsedTrack.trackTitle = evnt.text ? evnt.text : '';
					}
					if (evnt.subtype == this.EVENT_META_INSTRUMENT_NAME) {
						singleParsedTrack.instrumentName = evnt.text ? evnt.text : '';
					}
					if (evnt.subtype == this.EVENT_META_LYRICS) {
						this.header.lyrics.push({ track: t, ms: evnt.playTimeMs ? evnt.playTimeMs : 0, txt: (evnt.text ? evnt.text : "") });
					}
					if (evnt.subtype == this.EVENT_META_CUE_POINT) {
						this.header.lyrics.push({ track: t, ms: evnt.playTimeMs ? evnt.playTimeMs : 0, txt: 'CUE: ' + (evnt.text ? evnt.text : "") });
					}
					if (evnt.subtype == this.EVENT_META_KEY_SIGNATURE) {

						var majSharpCircleOfFifths: string[] = ['C', 'G', 'D', 'A', 'E', 'B', 'F#'];
						var majFlatCircleOfFifths: string[] = ['C', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb'];
						var minSharpCircleOfFifths: string[] = ['Am', 'Em', 'Bm', 'F#m', 'C#m', 'G#m', 'D#'];
						var minFlatCircleOfFifths: string[] = ['Am', 'Dm', 'Gm', 'Cm', 'Fm', 'Bbm', 'Ebm'];

						var key: number = evnt.key ? evnt.key : 0;

						if (key > 127) key = key - 256;

						this.header.keyFlatSharp = key;//+sharp-flat
						this.header.keyMajMin = evnt.scale ? evnt.scale : 0;//0-maj, 1 min

						var signature = 'C';
						if (this.header.keyFlatSharp >= 0) {
							if (this.header.keyMajMin < 1) {
								signature = majSharpCircleOfFifths[Math.abs(this.header.keyFlatSharp)];
							} else {
								signature = minSharpCircleOfFifths[Math.abs(this.header.keyFlatSharp)];
							}
						} else {
							if (this.header.keyMajMin < 1) {
								signature = majFlatCircleOfFifths[Math.abs(this.header.keyFlatSharp)];
							} else {
								signature = minFlatCircleOfFifths[Math.abs(this.header.keyFlatSharp)];
							}
						}
						this.header.signs.push({ track: t, ms: evnt.playTimeMs ? evnt.playTimeMs : 0, sign: signature });
					}
					if (evnt.subtype == this.EVENT_META_SET_TEMPO) {
						this.header.tempoBPM = evnt.tempoBPM ? evnt.tempoBPM : 120;
					}
					if (evnt.subtype == this.EVENT_META_TIME_SIGNATURE) {
						this.header.meterCount = evnt.param1 ? evnt.param1 : 4;
						var dvsn: number = evnt.param2 ? evnt.param2 : 2;
						if (dvsn == 1) this.header.meterDivision = 2
						else if (dvsn == 2) this.header.meterDivision = 4
						else if (dvsn == 3) this.header.meterDivision = 8
						else if (dvsn == 4) this.header.meterDivision = 16
						else if (dvsn == 5) this.header.meterDivision = 32
						else if (dvsn == 0) this.header.meterDivision = 1
						this.header.meters.push({
							track: t, ms: evnt.playTimeMs ? evnt.playTimeMs : 0
							, count: this.header.meterCount, division: this.header.meterDivision
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













}
