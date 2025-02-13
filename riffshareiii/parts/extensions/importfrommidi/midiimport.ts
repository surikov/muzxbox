

/*
class LastKeyVal {
	data: { name: string, value: number }[] = [];
	take(keyName: string): { name: string, value: number } {
		for (let ii = 0; ii < this.data.length; ii++) {
			if (this.data[ii].name == keyName) {
				return this.data[ii];
			}
		}
		let newit = { name: keyName, value: -1 };
		this.data.push(newit);
		return newit;
	}

}*/


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
	controller_coarseDataEntrySlider: number = 0x06;
	controller_coarseVolume: number = 0x07;
	controller_ballance: number = 0x08;
	controller_pan: number = 0x0A;
	controller_expression: number = 0x0B;
	controller_BankSelectLSBGS: number = 0x20;
	controller_fineDataEntrySlider: number = 0x26;
	controller_ReverbLevel = 0x5B;
	controller_HoldPedal1 = 0x40;
	controller_TremoloDepth = 0x5C;
	controller_ChorusLevel = 0x5D;
	controller_NRPNParameterLSB: number = 0x62;
	controller_NRPNParameterMSB: number = 0x63;

	controller_fineRPN: number = 0x64;
	controller_coarseRPN: number = 0x65;

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
	/*
		simplifySinglePath(points: XYp[], tolerance: number): XYp[] {
			var arr: XYp[] = this.douglasPeucker(points, tolerance);
			arr.push(points[points.length - 1]);
			//console.log(points, tolerance, arr);
			return arr;
		}
	*/
	simplifyAllBendPaths() {
		let msMin = 75;
		for (var t = 0; t < this.parsedTracks.length; t++) {
			var track: MIDIFileTrack = this.parsedTracks[t];
			for (var ch = 0; ch < track.chords.length; ch++) {
				var chord: TrackChord = track.chords[ch];
				for (var n = 0; n < chord.notes.length; n++) {
					var note: TrackNote = chord.notes[n];
					if (note.bendPoints.length > 1) {
						let simplifiedPath: NotePitch[] = [];
						let cuPointDuration = 0;
						let lastBasePitchDelta = 0;
						for (let pp = 0; pp < note.bendPoints.length; pp++) {
							let cuPoint = note.bendPoints[pp];
							lastBasePitchDelta = cuPoint.basePitchDelta;
							cuPointDuration = cuPointDuration + cuPoint.pointDuration;
							if (cuPointDuration > msMin) {
								//simplifiedPath.push({ pointDuration: cuPointDuration, basePitchDelta: Math.round(lastBasePitchDelta) });
								simplifiedPath.push({ pointDuration: cuPointDuration, basePitchDelta: lastBasePitchDelta });
								cuPointDuration = 0;
							} else {
								if (simplifiedPath.length > 0) {
									let prePoint = simplifiedPath[simplifiedPath.length - 1];
									prePoint.basePitchDelta = lastBasePitchDelta;
								}
							}
						}
						//simplifiedPath.push({ pointDuration: cuPointDuration, basePitchDelta: Math.round(lastBasePitchDelta) });
						simplifiedPath.push({ pointDuration: cuPointDuration, basePitchDelta: lastBasePitchDelta });
						//console.log(note.bendPoints , simplifiedPath);
						note.bendPoints = simplifiedPath;
					} else {
						if (note.bendPoints.length == 1) {
							if (note.bendPoints[0].pointDuration > 4321) {
								note.bendPoints[0].pointDuration = 1234;
							}
						}
					}
				}
			}
		}
	}
	/*simplifyAllBendPaths22() {
		for (var t = 0; t < this.parsedTracks.length; t++) {
			var track: MIDIFileTrack = this.parsedTracks[t];
			//console.log('simplify',track.trackTitle);
			for (var ch = 0; ch < track.chords.length; ch++) {
				var chord: TrackChord = track.chords[ch];
				for (var n = 0; n < chord.notes.length; n++) {
					var note: TrackNote = chord.notes[n];
					if (note.bendPoints.length > 1) {
						this.simplifyNoteBendPath(note);
					} else {
						if (note.bendPoints.length == 1) {
							if (note.bendPoints[0].pointDuration > 4321) {
								note.bendPoints[0].pointDuration = 1234;
							}
						}
					}
				}
			}
		}
	}
	simplifyNoteBendPath(note: TrackNote) {
		console.log(note.baseDuration, note.bendPoints);
		let step = 0.005;
	}*/
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

			//if(e<133)console.log(evnt);
		}
	}

	parseNotes() {
		this.dumpResolutionChanges();
		// counts which pitch-bend range message can be expected next
		//: number 1 (can be sent any time, except after pitch-bend range messages number 1 or 2)
		//, number 2 (required after number 1)
		//, number 3 (required after number 2)
		//, or number 4 (optional)
		var expectedPitchBendRangeMessageNumber = 1;
		var expectedPitchBendRangeChannel: number | undefined | null = null;
		var pitchBendRange = Array(16).fill(2); // Default pitch-bend range is 2 semitones.
		for (let t = 0; t < this.parsedTracks.length; t++) {
			//console.log('start parseNotes', t);
			var singleParsedTrack: MIDIFileTrack = this.parsedTracks[t];
			//singleParsedTrack.nn=t;
			this.parseTicks2time(singleParsedTrack);
			for (var e = 0; e < singleParsedTrack.trackevents.length; e++) {
				var expectedPitchBendRangeMessageNumberOld = expectedPitchBendRangeMessageNumber;
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
									/*
									var duration = 0;
									for (var i = 0; i < chpi.note.points.length - 1; i++) {
										duration = duration + chpi.note.points[i].pointDuration;
									}
									chpi.note.points[chpi.note.points.length - 1].pointDuration = when - chpi.chord.when - duration;
									*/
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
									//this.addSlide(evnt, song, pitchBendRange[events[i].channel]);
									var eventWhen = evnt.playTimeMs ? evnt.playTimeMs : 0;
									var chord: TrackChord | null = this.findChordBefore(eventWhen, singleParsedTrack, evnt.midiChannel ? evnt.midiChannel : 0);
									if (chord) {
										for (var i = 0; i < chord.notes.length; i++) {
											var note: TrackNote = chord.notes[i];
											if (!(note.closed)) {
												var allPointsDuration = 0;
												for (var k = 0; k < note.bendPoints.length; k++) {
													allPointsDuration = allPointsDuration + note.bendPoints[k].pointDuration;
												}
												//when: event.playTime / 1000-track.notes[i].when
												//note.points[note.points.length - 1].pointDuration = eventWhen - chord.when - pointsDuration;
												let idx: number = evnt.midiChannel ? evnt.midiChannel : 0;
												//var pointpitch: number = note.points[0].pitch + pitchBendRange[idx];
												let pp2 = evnt.param2 ? evnt.param2 : 0;
												var delta: number = (pp2 - 64) / 64 * pitchBendRange[idx];
												//var firstpitch: number = note.points[0].pitch + b14;
												var point: NotePitch = {
													pointDuration: eventWhen - chord.when - allPointsDuration
													, basePitchDelta: delta
												};
												note.bendPoints.push(point);
												//console.log(note);
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

												(expectedPitchBendRangeMessageNumber == 1 && evnt.param1 == this.controller_coarseRPN && evnt.param2 == 0x00) ||
												(expectedPitchBendRangeMessageNumber == 2 && evnt.param1 == this.controller_fineRPN && evnt.param2 == 0x00) ||
												(expectedPitchBendRangeMessageNumber == 3 && evnt.param1 == this.controller_coarseDataEntrySlider) ||
												(expectedPitchBendRangeMessageNumber == 4 && evnt.param1 == this.controller_fineDataEntrySlider)
											) {
												if (expectedPitchBendRangeMessageNumber > 1 && evnt.midiChannel != expectedPitchBendRangeChannel) {
													console.log('Unexpected channel number in non-first pitch-bend RANGE (SENSITIVITY) message. MIDI file might be corrupt.');
												}
												expectedPitchBendRangeChannel = evnt.midiChannel;
												let idx: number = evnt.midiChannel ? evnt.midiChannel : 0;
												if (expectedPitchBendRangeMessageNumber == 3) {
													pitchBendRange[idx] = evnt.param2; // in semitones
												}
												if (expectedPitchBendRangeMessageNumber == 4) {
													let pp = evnt.param2 ? evnt.param2 : 0;
													pitchBendRange[idx] = pitchBendRange[idx] + pp / 100; // convert cents to semitones, add to semitones set in the previous MIDI message

												}
												expectedPitchBendRangeMessageNumber++;
												if (expectedPitchBendRangeMessageNumber == 5) {
													expectedPitchBendRangeMessageNumber = 1;
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
													//skip controller
												} else {
													console.log('unknown controller', evnt.playTimeMs, 'ms, channel', evnt.midiChannel, ':', evnt.param1, evnt.param2);
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
				if (expectedPitchBendRangeMessageNumberOld == expectedPitchBendRangeMessageNumber) { // If the current message wasn't an expected pitch-bend range message
					if (expectedPitchBendRangeMessageNumberOld >= 2 && expectedPitchBendRangeMessageNumberOld <= 3) {
						//throw Error('Pitch-bend RANGE (SENSITIVITY) messages ended prematurely. MIDI file might be corrupt.');
					}
					if (expectedPitchBendRangeMessageNumberOld == 4) { // The fourth message is optional, so since it wasn't sent, the setting of the pitch-bend range is done, and we might expect the first pitch-bend range message some time in the future
						expectedPitchBendRangeMessageNumber = 1;
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




	findOrCreateTrack(parsedtrack: MIDIFileTrack, trackNum: number, channelNum: number, trackChannel: { trackNum: number, channelNum: number, track: MIDISongTrack }[])
		: { trackNum: number, channelNum: number, track: MIDISongTrack } {
		for (let i = 0; i < trackChannel.length; i++) {
			if (trackChannel[i].trackNum == trackNum && trackChannel[i].channelNum == channelNum) {
				return trackChannel[i];
			}
		}
		//console.log('findOrCreateTrack',parsedtrack.trackTitle);
		let it: { trackNum: number, channelNum: number, track: MIDISongTrack } = {
			trackNum: trackNum, channelNum: channelNum, track: {
				order: 0
				, title: parsedtrack.trackTitle + ((parsedtrack.instrumentName) ? (' - ' + parsedtrack.instrumentName) : '')
				//, instrument: '0'
				, channelNum: channelNum
				, trackVolumes: []//parsedtrack.trackVolumePoints
				, program: -1
				, songchords: []
			}
		};
		for (let vv = 0; vv < parsedtrack.trackVolumePoints.length; vv++) {
			if (parsedtrack.trackVolumePoints[vv].channel == it.track.channelNum) {
				it.track.trackVolumes.push(parsedtrack.trackVolumePoints[vv]);
			}
		}
		trackChannel.push(it);
		return it;
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
		//console.log(barIdx, measure);
		return measure;
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
	convertProject(title: string, comment: string): Zvoog_Project {
		//console.log('MidiParser.convertProject', this);
		let midiSongData: MIDISongData = {
			parser: '1.12'
			, duration: 0
			, bpm: this.header.tempoBPM
			, changes: this.header.changes
			, lyrics: this.header.lyrics
			, key: this.header.keyFlatSharp
			, mode: this.header.keyMajMin
			, meter: { count: this.header.meterCount, division: this.header.meterDivision }
			, meters: this.header.meters
			, signs: this.header.signs
			, miditracks: []
			, speedMode: 0
			, lineMode: 0
		};
		let tracksChannels: { trackNum: number, channelNum: number, track: MIDISongTrack }[] = [];
		for (let i = 0; i < this.parsedTracks.length; i++) {
			let parsedtrack: MIDIFileTrack = this.parsedTracks[i];
			for (let k = 0; k < parsedtrack.programChannel.length; k++) {
				this.findOrCreateTrack(parsedtrack, i, parsedtrack.programChannel[k].channel, tracksChannels);
			}

		}
		var maxWhen = 0;
		for (var i = 0; i < this.parsedTracks.length; i++) {
			var miditrack: MIDIFileTrack = this.parsedTracks[i];
			for (var ch = 0; ch < miditrack.chords.length; ch++) {
				var midichord: TrackChord = miditrack.chords[ch];
				var newchord: MIDISongChord = { when: midichord.when, notes: [], channel: midichord.channel };
				if (maxWhen < midichord.when) {
					maxWhen = midichord.when;
				}

				for (var n = 0; n < midichord.notes.length; n++) {
					var midinote: TrackNote = midichord.notes[n];
					var newnote: MIDISongNote = { slidePoints: [], midiPitch: midinote.basePitch, midiDuration: midinote.baseDuration };
					newchord.notes.push(newnote);
					if (midinote.bendPoints.length > 0) {

						for (var v = 0; v < midinote.bendPoints.length; v++) {
							var midipoint: NotePitch = midinote.bendPoints[v];
							//var newpoint: MIDISongPoint = { pitch: midipoint.pitch, durationms: midipoint.pointDuration };
							var newpoint: MIDISongPoint = {
								pitch: midinote.basePitch + midipoint.basePitchDelta
								, durationms: midipoint.pointDuration
							};
							newpoint.midipoint = midinote;
							newnote.slidePoints.push(newpoint);
						}
						//console.log(midinote,newnote);
					} else {
						//newnote.points[newnote.points.length - 1].durationms = newnote.points[newnote.points.length - 1].durationms + 66;
						/*newnote.points.push({
							pitch: midinote.basePitch
							, durationms: midinote.baseDuration + 66
						});
						*/
					}
				}

				let chanTrack = this.findOrCreateTrack(miditrack, i, newchord.channel, tracksChannels);
				chanTrack.track.songchords.push(newchord);
			}


			//console.log(miditrack.trackTitle,miditrack.trackVolumePoints,);
		}

		for (let tt = 0; tt < tracksChannels.length; tt++) {
			let trackChan = tracksChannels[tt];
			if (trackChan.track.songchords.length > 0) {
				midiSongData.miditracks.push(tracksChannels[tt].track);
				if (midiSongData.duration < maxWhen) {
					midiSongData.duration = 54321 + maxWhen;
				}
				for (let i = 0; i < this.parsedTracks.length; i++) {
					let miditrack: MIDIFileTrack = this.parsedTracks[i];
					for (let kk = 0; kk < miditrack.programChannel.length; kk++) {
						if (miditrack.programChannel[kk].channel == trackChan.channelNum) {
							trackChan.track.program = miditrack.programChannel[kk].program;
						}
					}
				}
			}
		}

		let newtimeline: Zvoog_SongMeasure[] = this.createTimeLine(midiSongData);



		let project: Zvoog_Project = {
			title: title + ' ' + comment
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
			, undo: []
			, redo: []
			, position: { x: 0, y: 0, z: 100 }
		};

		let echoOutID = 'reverberation';
		let compresID = 'compression';

		for (let ii = 0; ii < project.timeline.length; ii++) {
			project.comments.push({ points: [] });
		}
		for (let ii = 0; ii < midiSongData.lyrics.length; ii++) {
			let textpoint = midiSongData.lyrics[ii];
			let pnt = findMeasureSkipByTime(textpoint.ms / 1000, project.timeline);
			if (pnt) {
				//console.log(pnt.skip, textpoint.ms, textpoint.txt);
				this.addLyricsPoints(project.comments[pnt.idx], { count: pnt.skip.count, part: pnt.skip.part }, textpoint.txt, project.timeline[pnt.idx].tempo);
			}
		}

		let top = 0;
		let outputID = '';
		let volume = 1;
		for (var ii = 0; ii < midiSongData.miditracks.length; ii++) {
			let midiSongTrack: MIDISongTrack = midiSongData.miditracks[ii];
			if (midiSongTrack.trackVolumes.length > 1) {
				let filterID = 'volume' + ii;
				let filterVolume: Zvoog_FilterTarget = {
					id: filterID
					, title: filterID
					, kind: 'zvolume1', data: '99', outputs: [compresID]
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
					let pnt = findMeasureSkipByTime(gain.ms / 1000, project.timeline);

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
						//console.log(filterID, vol, pnt,vol);
					}
				}
				//console.log(midiSongTrack.title, 'auto',midiSongTrack.trackVolumes.length);
			} else {
				outputID = compresID;
				if (midiSongTrack.trackVolumes.length == 1) {
					let vol: number = 1 * midiSongTrack.trackVolumes[0].value;
					//filterVolume.dataBlob = '' + Math.round(vol * 100) + '%';
					//console.log(midiSongTrack.title, 'set', vol);
					volume = 1 * midiSongTrack.trackVolumes[0].value;
				} else {
					//console.log(midiSongTrack.title,'default');
				}

			}

			//console.log('filterVolume', filterVolume);

			if (midiSongTrack.channelNum == 9) {
				let drums: number[] = this.collectDrums(midiSongTrack);
				//console.log('drums',drums);
				for (let dd = 0; dd < drums.length; dd++) {
					project.percussions.push(this.createProjectDrums(1, top * 9, drums[dd], project.timeline, midiSongTrack, outputID));
					top++;
				}
			} else {
				project.tracks.push(this.createProjectTrack(volume, top * 8, project.timeline, midiSongTrack, outputID));
				top++;
			}
			//console.log(top,ii);

		}
		let filterEcho: Zvoog_FilterTarget = {
			id: echoOutID, title: echoOutID
			, kind: 'zvecho1', data: '22', outputs: ['']
			, iconPosition: {
				x: 77 + midiSongData.miditracks.length * 30
				, y: midiSongData.miditracks.length * 8 + 2
			}
			, automation: [], state: 0
		};
		let filterCompression: Zvoog_FilterTarget = {
			id: compresID
			, title: compresID
			, kind: 'zvooco1', data: '1', outputs: [echoOutID]
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

		console.log('midiParser', this);
		console.log('midiSongData', midiSongData);
		console.log('project', project);
		//console.log('project', midiSongData.changes);
		let needSlice = (midiSongData.meters.length < 2)
			&& (midiSongData.changes.length < 3)
			&& (project.timeline[0].metre.count / project.timeline[0].metre.part == 1)
			;
		//needSlice=false;
		this.trimProject(project, needSlice);
		/*if (midiSongData.meters.length < 2) {
			let mxSh = 0;
			let mxIdx = 0;
			for (let ii = 0; ii < 32; ii++) {
				let sh = this.calculateShift32(project, ii);
				if (sh > mxSh) {
					mxSh = sh;
					mxIdx = ii;
				}
			}

			if (mxIdx) {
				console.log('shift', '' + (32-mxIdx) + '/32');
				this.shiftForwar32(project, 32-mxIdx)
				//this.drumForwar32(project, 32-mxIdx)
			}
		}*/
		return project;
	}
	calculateShift32(project: Zvoog_Project, count32: number): Zvoog_Metre {
		let ticker: Zvoog_MetreMathType = MMUtil().set({ count: count32, part: 32 });
		let duration: Zvoog_MetreMathType = MMUtil().set({ count: 0, part: 32 });
		for (let mm = 0; mm < project.timeline.length; mm++) {
			duration = duration.plus(project.timeline[mm].metre);
		}
		//console.log('calculateShift32',count32,duration);
		let smm = MMUtil().set({ count: 0, part: 32 });
		while (ticker.less(duration)) {
			//let all = this.extractInstrumPointStamp(project, ticker);
			let pointLen = this.extractPointStampDuration(project, ticker);

			//smm = smm + all.length;
			smm = smm.plus(pointLen).strip(32);
			//console.log(cnt);
			ticker = ticker.plus({ count: 1, part: 1 });

		}

		return smm.strip(32);
	}
	/*
	avgLineRatio(project: Zvoog_Project, start1: Zvoog_Metre, start2: Zvoog_Metre, duration: Zvoog_Metre):number {
		let point1: Zvoog_MetreMathType = MMUtil().set(start1);
		let point2: Zvoog_MetreMathType = MMUtil().set(start2);
		let ticker: Zvoog_MetreMathType = MMUtil().set({ count: 0, part: 32 });
		let sm = 0;
		let cnt = 0;
		while (ticker.less(duration)) {
			let s1 = this.extractDrumPointStamp(project, point1);
			let s2 = this.extractDrumPointStamp(project, point2);
			sm = sm + this.diffPointRatio(s1, s2);
			cnt++;
			point1 = point1.plus({ count: 1, part: 32 });
			point2 = point2.plus({ count: 1, part: 32 });
			ticker = ticker.plus({ count: 1, part: 32 });
		}
		return sm/cnt;
	}
	diffPointRatio(a: number[], b: number[]): number {
		if (a.length == 0 && b.length == 0) {
			return 0;
		}
		let wrong = 0;
		for (let ii = 0; ii < a.length; ii++) {
			if (b.indexOf(a[ii]) < 0) {
				wrong++;
			}
		}
		for (let ii = 0; ii < b.length; ii++) {
			if (a.indexOf(b[ii]) < 0) {
				wrong++;
			}
		}
		let ratio = wrong / (a.length + b.length);
		return ratio;
	}
	extractDrumPointStamp(project: Zvoog_Project, at: Zvoog_Metre): number[] {
		let slice: number[] = [];
		let end: Zvoog_MetreMathType = MMUtil().set({ count: 0, part: 32 });
		for (let mm = 0; mm < project.timeline.length; mm++) {
			let barStart = end.simplyfy();
			end = end.plus(project.timeline[mm].metre);
			if (end.more(at)) {
				let skip = MMUtil().set(at).minus(barStart);
				//console.log(at,mm,skip);
				for (let pp = 0; pp < project.percussions.length; pp++) {
					let drum = project.percussions[pp];
					let bar = drum.measures[mm];
					//console.log(bar);
					for (let ss = 0; ss < bar.skips.length; ss++) {
						if (skip.equals(bar.skips[ss])) {
							slice.push(pp);
							break;
						}
					}
				}
				break;
			}
		}
		return slice;
	}*/
	extractPointStampDuration(project: Zvoog_Project, at: Zvoog_Metre): Zvoog_Metre {
		let pointSumm: Zvoog_MetreMathType = MMUtil().set({ count: 0, part: 32 });
		let end: Zvoog_MetreMathType = MMUtil().set({ count: 0, part: 32 });
		for (let mm = 0; mm < project.timeline.length; mm++) {
			let barStart = end.simplyfy();
			end = end.plus(project.timeline[mm].metre).strip(32);
			if (end.more(at)) {
				let skip = MMUtil().set(at).minus(barStart);
				//console.log(at,mm,skip);
				for (let pp = 0; pp < project.tracks.length; pp++) {
					let track = project.tracks[pp];
					let trackBar = track.measures[mm];
					//console.log(bar);
					for (let ss = 0; ss < trackBar.chords.length; ss++) {
						let chord = trackBar.chords[ss];

						if (skip.equals(chord.skip)) {
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
					//console.log(drum);
					if (drum.sampler.data == '35' || drum.sampler.data == '36') {//kick
						drumDuration = { count: 3, part: 16 };
					} else {
						if (drum.sampler.data == '38' || drum.sampler.data == '40') {//snare
							drumDuration = { count: 2, part: 16 };
						}
					}
					for (let ss = 0; ss < drumBar.skips.length; ss++) {
						if (skip.equals(drumBar.skips[ss])) {
							pointSumm = pointSumm.plus(drumDuration).strip(32);
							break;
						}
					}
				}
				break;
			}
		}
		//console.log('pointSumm',pointSumm);
		return pointSumm;
	}
	/*
	calculateShiftDrum(project: Zvoog_Project) {
		let duration: Zvoog_MetreMathType = MMUtil().set({ count: 0, part: 32 });
		for (let mm = 0; mm < project.timeline.length; mm++) {
			duration = duration.plus(project.timeline[mm].metre);
		}
		console.log('calculateShiftDrum', duration);
		console.log(this.avgLineRatio(project, { count: 4, part: 1 }, { count: 5, part: 1 }, { count: 1, part: 4 }));
		console.log(this.avgLineRatio(project, { count: 11, part: 1 }, { count: 12, part: 1 }, { count: 1, part: 4 }));
		//this.extractDrumPointStamp(project, { count: 0, part: 1 });
		//this.extractDrumPointStamp(project, { count: 1, part: 1 });
		//this.extractDrumPointStamp(project, { count: 2, part: 1 });
		//this.extractDrumPointStamp(project, { count: 3, part: 1 });
	}
	*/
	trimProject(project: Zvoog_Project, reslice: boolean) {
		for (let ii = 0; ii < project.tracks.length; ii++) {
			project.tracks[ii].performer.iconPosition.x = 10 + ii * 9;
			project.tracks[ii].performer.iconPosition.y = 0 + ii * 4;
		}
		for (let ii = 0; ii < project.percussions.length; ii++) {
			project.percussions[ii].sampler.iconPosition.x = 20 + ii * 4;
			project.percussions[ii].sampler.iconPosition.y = 30 + ii * 9;
		}
		for (let ii = 0; ii < project.filters.length - 2; ii++) {
			project.filters[ii].iconPosition.x = 10 + project.tracks.length * 9 + 5 + ii * 4;
			project.filters[ii].iconPosition.y = ii * 9;
		}

		project.filters[project.filters.length - 2].iconPosition.x = 35 + project.tracks.length * 9 + project.filters.length * 4;
		project.filters[project.filters.length - 2].iconPosition.y = project.filters.length * 5;

		project.filters[project.filters.length - 1].iconPosition.x = 20 + project.tracks.length * 9 + project.filters.length * 4;
		project.filters[project.filters.length - 1].iconPosition.y = project.filters.length * 6;

		for (let tt = 0; tt < project.tracks.length; tt++) {
			let track = project.tracks[tt];
			for (let mm = 0; mm < track.measures.length; mm++) {
				let measure = track.measures[mm];
				for (let cc = 0; cc < measure.chords.length; cc++) {
					let chord = measure.chords[cc];
					chord.skip = MMUtil().set(chord.skip).strip(32);
				}
			}
		}
		for (let ss = 0; ss < project.percussions.length; ss++) {
			let sampleTrack = project.percussions[ss];
			for (let mm = 0; mm < sampleTrack.measures.length; mm++) {
				let measure = sampleTrack.measures[mm];
				for (let mp = 0; mp < measure.skips.length; mp++) {
					let newSkip = MMUtil().set(measure.skips[mp]).strip(32);
					measure.skips[mp].count = newSkip.count;
					measure.skips[mp].part = newSkip.part;
				}
			}
		}
		//---------------
		//this.reShiftSequencer(project);
		//this.reShiftDrums(project);
		this.limitShort(project)
		if (reslice) {
			/*
			let mxLen = MMUtil().set({ count: 0, part: 32 });
			let mxIdx = 0;
			for (let ii = 0; ii < 32; ii++) {
				let sh = this.calculateShift32(project, ii);

				if (mxLen.less(sh)) {
					mxLen.set(sh);
					mxIdx = ii;
				}
				console.log((32 - ii), sh, mxLen);
			}
*/
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
				/*if (MMUtil().set(a.len).less(b.len)) {
					return 1;
				} else {
					if (MMUtil().set(a.len).equals(b.len)) {
						return 0;
					} else {
						return -1;
					}
				}*/
				return b.len - a.len;
			});
			console.log(durations);
			let top: { len: number, shft: number }[] = [durations[0]];
			for (let ii = 1; ii < durations.length; ii++) {
				if (durations[ii].len * 2.2 > durations[0].len) {
					top.push(durations[ii]);
				}
			}
			top.sort((a, b) => { return a.shft - b.shft });
			console.log(top);
			let shsize = top[0].shft;
			if (shsize) {
				console.log('shift', '' + shsize + '/32');
				this.shiftForwar32(project, shsize)
			}
			/*
			let mainSh = durations[0].shft;
			if (mainSh > durations[1].shft) mainSh = durations[1].shft;
			if (mainSh > durations[2].shft) mainSh = durations[2].shft;
			if (mainSh > 0) {
				console.log('shift', '' + mainSh + '/32');
				this.shiftForwar32(project, mainSh)
			}*/
			/*if (mxIdx) {
				console.log('shift', '' + (32 - mxIdx) + '/32');
				this.shiftForwar32(project, 32 - mxIdx)
				//this.drumForwar32(project, 32-mxIdx)
			}*/
		}
		//this.cutShift(project);
		//this.allShiftForwad(project, { count: 5, part: 8 });

		//---------------
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
	/*
		allShiftForwad(project: Zvoog_Project, shiftSize: Zvoog_Metre) {
			//console.log('allShiftForwad', shiftSize);
			for (let tt = 0; tt < project.tracks.length; tt++) {
				let track = project.tracks[tt];
				for (let mm = track.measures.length; mm > 1; mm--) {
					//console.log(mm);
					let fromDuration = project.timeline[mm - 2].metre;
					let fromMeasure = track.measures[mm - 2];
					let toMeasure = track.measures[mm - 1];
					for (let cc = 0; cc < fromMeasure.chords.length; cc++) {
						let chord = fromMeasure.chords[cc];
						let skip: Zvoog_MetreMathType = MMUtil().set(chord.skip).plus(shiftSize);
						//console.log(chord.skip, skip.simplyfy());
						if (skip.less(fromDuration)) {
							chord.skip = skip.simplyfy();
						} else {
							chord.skip = skip.minus(fromDuration).simplyfy();
							toMeasure.chords.push(chord);
							fromMeasure.chords.splice(cc, 1);
							cc--;
						}
					}
				}
			}
			for (let tt = 0; tt < project.percussions.length; tt++) {
				let drum = project.percussions[tt];
				for (let mm = drum.measures.length; mm > 1; mm--) {
					let fromDuration = project.timeline[mm - 2].metre;
					let fromMeasure = drum.measures[mm - 2];
					let toMeasure = drum.measures[mm - 1];
					for (let cc = 0; cc < fromMeasure.skips.length; cc++) {
						//let drumskip = fromMeasure.skips[cc];
						let skip: Zvoog_MetreMathType = MMUtil().set(fromMeasure.skips[cc]).plus(shiftSize);
						//console.log(chord.skip, skip.simplyfy());
						if (skip.less(fromDuration)) {
							fromMeasure.skips[cc] = skip.simplyfy();
						} else {
							fromMeasure.skips[cc] = skip.minus(fromDuration).simplyfy();
							toMeasure.skips.push(fromMeasure.skips[cc]);
							fromMeasure.skips.splice(cc, 1);
							cc--;
						}
					}
				}
			}
			for (let mm = project.comments.length; mm > 1; mm--) {
				let fromDuration = project.timeline[mm - 2].metre;
				let fromMeasure = project.comments[mm - 2];
				let toMeasure = project.comments[mm - 1];
				for (let cc = 0; cc < fromMeasure.points.length; cc++) {
					//let drumskip = fromMeasure.skips[cc];
					let skip: Zvoog_MetreMathType = MMUtil().set(fromMeasure.points[cc].skip).plus(shiftSize);
					//console.log(chord.skip, skip.simplyfy());
					if (skip.less(fromDuration)) {
						fromMeasure.points[cc].skip = skip.simplyfy();
					} else {
						fromMeasure.points[cc].skip = skip.minus(fromDuration).simplyfy();
						toMeasure.points.push(fromMeasure.points[cc]);
						fromMeasure.points.splice(cc, 1);
						cc--;
					}
				}
			}
		}*/
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
							//console.log(chord.slides[0].duration);
							chord.slides[0].duration = note16;
						}
					}
				}
			}
		}
	}
	/*
	reShiftSequencer(project: Zvoog_Project) {
		let plus32 = 0;
		let cOther = 0;
		let c0 = 0;
		let minus32 = 0;
		for (let tt = 0; tt < project.tracks.length; tt++) {
			let track = project.tracks[tt];
			for (let mm = 0; mm < track.measures.length; mm++) {
				let measure = track.measures[mm];
				let meme = MMUtil().set(project.timeline[mm].metre);
				for (let cc = 0; cc < measure.chords.length; cc++) {
					let chord = measure.chords[cc];
					if (chord.skip.count == 1 && chord.skip.part == 32) {
						plus32++;
					} else {
						if (chord.skip.count == 0) { c0++; } else {
							if (meme.minus({ count: 1, part: 32 }).equals(chord.skip)) {
								minus32++;
							} else {
								cOther++;
							}
						}
					}
				}
			}
		}
		if (plus32 && c0 / plus32 < 0.5) {
			this.shiftBackwar(32, project);
		} else {
			if (minus32 && c0 / minus32 < 0.5) {
				this.shiftForwar32(project);
			}
		}
	}
	reShiftDrums(project: Zvoog_Project) {
		let plus32 = 0;
		let cOther = 0;
		let c0 = 0;
		let minus32 = 0;
		for (let tt = 0; tt < project.percussions.length; tt++) {
			let track = project.percussions[tt];
			for (let mm = 0; mm < track.measures.length; mm++) {
				let measure = track.measures[mm];
				let meme = MMUtil().set(project.timeline[mm].metre);
				for (let cc = 0; cc < measure.skips.length; cc++) {
					let chord = measure.skips[cc];
					if (chord.count == 1 && chord.part == 32) {
						plus32++;
					} else {
						if (chord.count == 0) { c0++; } else {
							if (meme.minus({ count: 1, part: 32 }).equals(chord)) {
								minus32++;
							} else {
								cOther++;
							}
						}
					}
				}
			}
		}
		if (plus32 && c0 / plus32 < 0.5) {
			this.drumBackwar(32, project);
		} else {
			if (minus32 && c0 / minus32 < 0.5) {
				this.drumForwar32(project);
			}
		}
	}*/
	/*
	cutShift(project: Zvoog_Project) {
		for (let tt = 0; tt < project.tracks.length; tt++) {
			let track = project.tracks[tt];
			for (let mm = 0; mm < track.measures.length; mm++) {
				let measure = track.measures[mm];
				for (let cc = 0; cc < measure.chords.length; cc++) {
					//let m16 = MMUtil().set(measure.chords[cc].skip);
					let m16 = MMUtil().set(measure.chords[cc].skip).strip(32);
					measure.chords[cc].skip.count = m16.count;
					measure.chords[cc].skip.part = m16.part;
					let chord = measure.chords[cc];
					if (chord.skip.count < 0) {
						if (mm > 0) {
							let premetre = MMUtil().set(project.timeline[mm - 1].metre);
							chord.skip = premetre.plus(chord.skip);
							track.measures[mm - 1].chords.push(chord);
							track.measures[mm].chords.splice(cc, 1);
							cc--;
						} else {
							chord.skip.count = 0;
						}
					} else {
						let metre = MMUtil().set(project.timeline[mm].metre);
						if (metre.less(chord.skip)) {
							if (mm < project.timeline.length - 1) {
								let metre = MMUtil().set(project.timeline[mm + 1].metre);
								chord.skip = MMUtil().set(chord.skip).minus(metre);
								track.measures[mm + 1].chords.push(chord);
								track.measures[mm].chords.splice(cc, 1);
								cc--;
							}
						}
					}
				}
			}
		}
		for (let ss = 0; ss < project.percussions.length; ss++) {
			let sampleTrack = project.percussions[ss];
			for (let mm = 0; mm < sampleTrack.measures.length; mm++) {
				let measure = sampleTrack.measures[mm];
				for (let mp = 0; mp < measure.skips.length; mp++) {
					//let m16 = MMUtil().set(measure.skips[mp]);
					let m16 = MMUtil().set(measure.skips[mp]).strip(32);
					measure.skips[mp].count = m16.count;
					measure.skips[mp].part = m16.part;
					let skip = measure.skips[mp];
					if (skip.count < 0) {
						if (mm > 0) {
							let premetre = MMUtil().set(project.timeline[mm - 1].metre);
							let newskip = premetre.plus(skip);
							sampleTrack.measures[mm - 1].skips.push(newskip);
							measure.skips.splice(mp, 1);
							mp--;
						} else {
							skip.count = 0;
						}
					} else {
						let metre = MMUtil().set(project.timeline[mm].metre);
						if (metre.less(skip)) {
							if (mm < project.timeline.length - 1) {
								let metre = MMUtil().set(project.timeline[mm + 1].metre);
								let newskip = MMUtil().set(skip).minus(metre);
								sampleTrack.measures[mm + 1].skips.push(newskip);
								measure.skips.splice(mp, 1);
								mp--;
							}
						}
					}
				}
			}
		}
	}*/
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
	/*drumForwar32(project: Zvoog_Project, amount: number) {
		for (let ss = 0; ss < project.percussions.length; ss++) {
			let sampleTrack = project.percussions[ss];
			for (let mm = 0; mm < sampleTrack.measures.length; mm++) {
				let measure = sampleTrack.measures[mm];
				for (let mp = 0; mp < measure.skips.length; mp++) {
					let newSkip = MMUtil().set(measure.skips[mp]).plus({ count: amount, part: 32 }).simplyfy();
					measure.skips[mp].count = newSkip.count;
					measure.skips[mp].part = newSkip.part;
				}
			}
		}
	}*/
	/*
		shiftBackwar(part: number, project: Zvoog_Project) {
			for (let tt = 0; tt < project.tracks.length; tt++) {
				let track = project.tracks[tt];
				for (let mm = 0; mm < track.measures.length; mm++) {
					let measure = track.measures[mm];
					for (let cc = 0; cc < measure.chords.length; cc++) {
						let chord = measure.chords[cc];
						chord.skip = MMUtil().set(chord.skip).minus({ count: 1, part: part }).simplyfy();
					}
				}
			}
		}
		drumBackwar(part: number, project: Zvoog_Project) {
			for (let ss = 0; ss < project.percussions.length; ss++) {
				let sampleTrack = project.percussions[ss];
				for (let mm = 0; mm < sampleTrack.measures.length; mm++) {
					let measure = sampleTrack.measures[mm];
					for (let mp = 0; mp < measure.skips.length; mp++) {
						let newSkip = MMUtil().set(measure.skips[mp]).minus({ count: 1, part: part }).simplyfy();
						measure.skips[mp].count = newSkip.count;
						measure.skips[mp].part = newSkip.part;
					}
				}
			}
		}*/
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
	numratio(nn: number): number {
		let rr = 1;//0000;
		return Math.round(nn * rr);
	}
	createProjectTrack(volume: number, top: number, timeline: Zvoog_SongMeasure[], midiTrack: MIDISongTrack, outputId: string): Zvoog_MusicTrack {
		let perfkind = 'zinstr1';
		if (midiTrack.program == 24
			|| midiTrack.program == 25
			|| midiTrack.program == 26
			|| midiTrack.program == 27
			|| midiTrack.program == 28
			|| midiTrack.program == 29
			|| midiTrack.program == 30
		) {
			perfkind = 'zvstrumming1';
		}
		let projectTrack: Zvoog_MusicTrack = {
			title: midiTrack.title + ' ' + insNames[midiTrack.program]
			, measures: []
			//, filters: []
			, performer: {
				id: 'track' + (midiTrack.program + Math.random()), data: '' + midiTrack.program, kind: perfkind, outputs: [outputId]
				, iconPosition: { x: top * 2, y: top }, state: 0
			}
			, volume: volume
		};
		if (!(midiTrack.program >= 0 && midiTrack.program <= 127)) {
			projectTrack.performer.outputs = [];
		}
		let mm = MMUtil();
		for (let tt = 0; tt < timeline.length; tt++) {
			let projectMeasure: Zvoog_TrackMeasure = { chords: [] };
			projectTrack.measures.push(projectMeasure);
			let nextMeasure = timeline[tt];
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
									let midiPoint = midiNote.slidePoints[pp];
									let xduration = mm.calculate(midiPoint.durationms / 1000.0, nextMeasure.tempo);
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
	createProjectDrums(volume: number, top: number, drum: number, timeline: Zvoog_SongMeasure[], midiTrack: MIDISongTrack, outputId: string): Zvoog_PercussionTrack {
		let projectDrums: Zvoog_PercussionTrack = {
			title: midiTrack.title + ' ' + drumNames[drum]
			, measures: []
			, sampler: {
				id: 'drum' + (drum + Math.random()), data: '' + drum, kind: 'zdrum1', outputs: [outputId]
				, iconPosition: { x: top * 1.5, y: top / 2 }, state: 0
			}
			, volume: volume
		};
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
		return projectDrums;
	}
}
