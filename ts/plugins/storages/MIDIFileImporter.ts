class MIDIFileImporter implements ZvoogStore {
	list(onFinish: (items: ZvoogStoreListItem[]) => void): void { };
	goFolder(title: string, onFinish: (error: string) => void): void { };
	goUp(onFinish: (error: string) => void): void { };

	readSongData(title: string, onFinish: (result: ZvoogSchedule | null) => void): void {
		console.log('MIDIFileImporter readSongData', title);
		var fileSelector: HTMLInputElement = document.createElement('input');
		fileSelector.setAttribute('type', 'file');
		fileSelector.setAttribute('accept', 'audio/midi, audio/x-midi');
		fileSelector.addEventListener("change", function (ev: Event) {
			if (fileSelector.files) {
				let file = fileSelector.files[0];
				let fileReader: FileReader = new FileReader();
				fileReader.onload = function (progressEvent) {
					if (progressEvent.target) {
						let arrayBuffer: ArrayBuffer = (progressEvent.target as any).result as ArrayBuffer;
						let midiParser: MidiParser = new MidiParser(arrayBuffer);
						var res: ZvoogSchedule = midiParser.convert();
						onFinish(res);
					}
				};
				fileReader.readAsArrayBuffer(file);
			}
		}, false);
		fileSelector.click();
	};

	createSongData(title: string, schedule: ZvoogSchedule, onFinish: (error: string) => void): void { };
	updateSongData(title: string, schedule: ZvoogSchedule, onFinish: (error: string) => void): void { };
	deleteSongData(title: string, onFinish: (error: string) => void): void { };
	renameSongData(title: string, newTitle: string, onFinish: (error: string) => void): void { };

	createFolder(title: string, onFinish: (error: string) => void): void { };
	deleteFolder(title: string, onFinish: (error: string) => void): void { };
	renameFolder(title: string, newTitle: string, onFinish: (error: string) => void): void { };
};

type XYp = {
	x: number;
	y: number;
};
type PP = {
	p1: XYp;
	p2: XYp;
};
class DataViewStream {
	position = 0;
	buffer: DataView;
	constructor(dv: DataView) {
		this.buffer = dv;
	}
	readUint8(): number {
		var n: number = (this.buffer as DataView).getUint8(this.position);
		this.position++;
		return n;
	}
	readUint16(): number {
		var v = (this.buffer as DataView).getUint16(this.position);
		this.position = this.position + 2;
		return v;
	}
	readVarInt(): number {
		var v: number = 0;
		var i: number = 0;
		var b: number;
		while (i < 4) {
			b = this.readUint8();
			if (b & 0x80) {
				v = v + (b & 0x7f);
				v = v << 7;
			} else {
				return v + b;
			}
			i++;
		}
		throw new Error('readVarInt ' + i);
	}
	readBytes(length: number): number[] {
		var bytes: number[] = [];
		for (var i = 0; i < length; i++) {
			bytes.push(this.readUint8());
		}
		return bytes;
	}
	/*pos(): string {
		return '0x' + (this.buffer.byteOffset + this.position).toString(16);
	}*/
	offset(): number {
		return this.buffer.byteOffset + this.position;
	}
	end(): boolean {
		return this.position == this.buffer.byteLength;
	}
}
class MIDIFileHeader {
	datas: DataView;
	HEADER_LENGTH: number = 14;
	//FRAMES_PER_SECONDS: number = 1;
	//TICKS_PER_BEAT: number = 2;
	format: number;
	trackCount: number;
	//ticksPerBeat: number;
	//ticksPerFrame: number;
	tempoBPM: number = 120;
	tempos: { track: number, ms: number, bmp: number }[] = [];
	meters: { track: number, ms: number, count: number, division: number }[] = [];
	lyrics: { track: number, ms: number, txt: string }[] = [];
	signs: { track: number, ms: number, sign: string }[] = [];
	meterCount: number = 4;
	meterDivision: number = 4;
	keyFlatSharp: number = 0;
	keyMajMin: number = 0;
	lastNonZeroQuarter: number = 0;
	constructor(buffer: ArrayBuffer) {
		this.datas = new DataView(buffer, 0, this.HEADER_LENGTH);
		this.format = this.datas.getUint16(8);
		this.trackCount = this.datas.getUint16(10);
		//this.ticksPerBeat = this.datas.getUint16(12);
		//this.ticksPerFrame = this.datas.getUint16(12);
	}
	______getTickResolution(tempo: number): number {
		//console.log('getTickResolution', tempo);
		if (tempo) {
			this.lastNonZeroQuarter = tempo;
		} else {
			if (this.lastNonZeroQuarter) {
				tempo = this.lastNonZeroQuarter;
			} else {
				tempo = 60000000 / this.tempoBPM;
			}
		}

		// Frames per seconds
		if (this.datas.getUint16(12) & 0x8000) {
			var r = 1000000 / (this.getSMPTEFrames() * this.getTicksPerFrame());
			// Ticks per beat
			//console.log('per frame', r);
			return r;
		} else {
			// Default MIDI tempo is 120bpm, 500ms per beat
			tempo = tempo || 500000;
			var r: number = tempo / this.getTicksPerBeat();
			//console.log('per beat', r);
			return r;
		}
	}
	getCalculatedTickResolution(tempo: number): number {
		this.lastNonZeroQuarter = tempo;
		if (this.datas.getUint16(12) & 0x8000) {
			var r = 1000000 / (this.getSMPTEFrames() * this.getTicksPerFrame());
			return r;
		} else {
			tempo = tempo || 500000;
			var r: number = tempo / this.getTicksPerBeat();
			return r;
		}
	}
	get0TickResolution(): number {
		var tempo = 0;
		if (this.lastNonZeroQuarter) {
			tempo = this.lastNonZeroQuarter;
		} else {
			tempo = 60000000 / this.tempoBPM;
		}
		if (this.datas.getUint16(12) & 0x8000) {
			var r = 1000000 / (this.getSMPTEFrames() * this.getTicksPerFrame());
			return r;
		} else {
			tempo = tempo || 500000;
			var r: number = tempo / this.getTicksPerBeat();
			return r;
		}
	}
	/*getTimeDivision(): number {
		if (this.datas.getUint16(12) & 0x8000) {
			return this.FRAMES_PER_SECONDS;
		}
		return this.TICKS_PER_BEAT;
	}*/
	getTicksPerBeat(): number {
		var divisionWord = this.datas.getUint16(12);
		return divisionWord;
	}
	getTicksPerFrame(): number {
		const divisionWord = this.datas.getUint16(12);
		return divisionWord & 0x00ff;
	}
	getSMPTEFrames(): number {
		const divisionWord = this.datas.getUint16(12);
		let smpteFrames: number;
		smpteFrames = divisionWord & 0x7f00;
		if (smpteFrames == 29) {
			return 29.97
		} else {
			return smpteFrames;
		}
	}
}
type TrackChord = {
	when: number
	, channel: number
	, notes: TrackNote[]
};
type TrackNote = {
	closed: boolean
	, points: NotePitch[]
}
type NotePitch = {
	pointDuration: number
	, pitch: number
}
class MIDIFileTrack {
	datas: DataView;
	HDR_LENGTH: number = 8;
	trackLength: number;
	trackContent: DataView;
	trackevents: MIDIEvent[];
	title: string;
	instrument: string;
	program: number;
	volumes: { ms: number, value: number }[];
	chords: TrackChord[] = [];
	constructor(buffer: ArrayBuffer, start: number) {
		this.datas = new DataView(buffer, start, this.HDR_LENGTH);
		this.trackLength = this.datas.getUint32(4);
		/*console.log(String.fromCharCode(this.datas.getUint8(0)));
		console.log(String.fromCharCode(this.datas.getUint8(1)));
		console.log(String.fromCharCode(this.datas.getUint8(2)));
		console.log(String.fromCharCode(this.datas.getUint8(3)));
		console.log(this.trackLength);*/
		this.datas = new DataView(buffer, start, this.HDR_LENGTH + this.trackLength);
		this.trackContent = new DataView(this.datas.buffer, this.datas.byteOffset + this.HDR_LENGTH, this.datas.byteLength - this.HDR_LENGTH);
		this.trackevents = [];
		this.volumes = [];
	}
}
type MIDIEvent = {
	offset: number
	, delta: number
	, eventTypeByte: number

	, basetype?: number
	, subtype?: number
	, index?: string
	, length?: number
	, msb?: number
	, lsb?: number
	, prefix?: number
	, data?: number[]
	, tempo?: number
	, tempoBPM?: number
	, hour?: number
	, minutes?: number
	, seconds?: number
	, frames?: number
	, subframes?: number
	, key?: number
	, param1?: number
	, param2?: number
	, param3?: number
	, param4?: number
	, scale?: number
	, badsubtype?: number
	, midiChannel?: number
	, playTimeMs: number
	, trackNum?: number
	, text?: string
}
class MidiParser {
	header: MIDIFileHeader;
	tracks: MIDIFileTrack[];

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
	// MIDI event sizes
	//MIDI_1PARAM_EVENTS: number[];
	//MIDI_2PARAMS_EVENTS: number[];

	midiEventType: number = 0;
	midiEventChannel: number = 0;
	midiEventParam1: number = 0;

	constructor(arrayBuffer: ArrayBuffer) {
		console.log('start constructor');
		/*this.MIDI_1PARAM_EVENTS = [
			this.EVENT_MIDI_PROGRAM_CHANGE,
			this.EVENT_MIDI_CHANNEL_AFTERTOUCH,
		];
		this.MIDI_2PARAMS_EVENTS = [
			this.EVENT_MIDI_NOTE_OFF,
			this.EVENT_MIDI_NOTE_ON,
			this.EVENT_MIDI_NOTE_AFTERTOUCH,
			this.EVENT_MIDI_CONTROLLER,
			this.EVENT_MIDI_PITCH_BEND,
		];*/
		this.header = new MIDIFileHeader(arrayBuffer);
		this.parseTracks(arrayBuffer);
	}
	parseTracks(arrayBuffer: ArrayBuffer) {
		console.log('start parseTracks');
		var curIndex: number = this.header.HEADER_LENGTH;
		var trackCount: number = this.header.trackCount;
		this.tracks = [];
		for (var i = 0; i < trackCount; i++) {
			var track: MIDIFileTrack = new MIDIFileTrack(arrayBuffer, curIndex);
			this.tracks.push(track);
			// Updating index to the track end
			curIndex = curIndex + track.trackLength + 8;
		}
		for (var i = 0; i < this.tracks.length; i++) {
			this.parseTrackEvents(this.tracks[i]);
		}
		this.parseNotes();
		this.simplify();
	}
	toText(arr: number[]): string {
		var r: string = '';
		for (var i = 0; i < arr.length; i++) {
			r = r + String.fromCharCode(arr[i]);
		}
		return r;
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
					if (firstPitch == note.points[0].pitch) {
						return { chord: chord, note: note };
					}
				}
			}
			before = chord.when;
			chord = this.findChordBefore(before, track, channel);
		}
		//console.log('no',first,'before',when,'at',trackNo);
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
				if (chord.notes[i].points[0].pitch == first) {
					return chord.notes[i];
				}
			}
		}
		var pi: TrackNote = { closed: false, points: [] };
		pi.points.push({ pointDuration: -1, pitch: first });
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
	simplifyPath(points: XYp[], tolerance: number): XYp[] {
		var arr: XYp[] = this.douglasPeucker(points, tolerance);
		arr.push(points[points.length - 1]);
		return arr;
	}
	simplify() {
		for (var t = 0; t < this.tracks.length; t++) {
			var track: MIDIFileTrack = this.tracks[t];
			for (var ch = 0; ch < track.chords.length; ch++) {
				var chord: TrackChord = track.chords[ch];
				for (var n = 0; n < chord.notes.length; n++) {
					var note: TrackNote = chord.notes[n];
					if (note.points.length > 5) {
						var xx = 0;
						var pnts: XYp[] = [];
						for (var p = 0; p < note.points.length; p++) {
							note.points[p].pointDuration = Math.max(note.points[p].pointDuration, 0);
							pnts.push({ x: xx, y: note.points[p].pitch });
							xx = xx + note.points[p].pointDuration;
						}
						pnts.push({ x: xx, y: note.points[note.points.length - 1].pitch });
						var lessPoints: XYp[] = this.simplifyPath(pnts, 1.5);
						//console.log(note);
						//console.log(pnts);
						//console.log(lessPoints);

						note.points = [];
						for (var p = 0; p < lessPoints.length - 1; p++) {
							var xypoint: XYp = lessPoints[p];
							var xyduration = lessPoints[p + 1].x - xypoint.x;
							note.points.push({ pointDuration: xyduration, pitch: xypoint.y });
						}
					} else {
						if (note.points.length == 1) {
							if (note.points[0].pointDuration > 4321) {
								//console.log(note.points[0].pointDuration,note);
								note.points[0].pointDuration = 1234;
							}
						}
					}
				}
			}
		}
	}
	dumpResolutionChanges():{track:number,ms:number,resolution:number,bpm:number}[] {
		var changes:{track:number,ms:number,resolution:number,bpm:number}[]=[];
		let tickResolution: number = this.header.get0TickResolution();
		//console.log('tickResolution', tickResolution);
		changes.push({track:-1,ms:-1,resolution:tickResolution,bpm:120});
		for (var t = 0; t < this.tracks.length; t++) {
			var track: MIDIFileTrack = this.tracks[t];
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
							//console.log(t, 'tickResolution', tickResolution, 'tempo', evnt.tempoBPM, 'at', playTimeTicks);
							changes.push({track:t,ms:playTimeTicks,resolution:tickResolution,bpm:evnt.tempo});
						}
					}
				}
			}
		}
		changes.sort((a,b)=>{return a.ms-b.ms;});
		//console.log('dumpResolutionChanges', changes);
		return changes;
	}
	lastResolution(ms:number,changes:{track:number,ms:number,resolution:number,bpm:number}[]):number{
		for(var i=changes.length-1;i>=0;i--){
			if(changes[i].ms<=ms){
				return changes[i].resolution
			}
		}
		return 0;
	}
	parseTicks2time(changes:{track:number,ms:number,resolution:number,bpm:number}[],track: MIDIFileTrack){
		let tickResolution: number = this.lastResolution(0,changes);
		let playTimeTicks: number = 0;
		for (var e = 0; e < track.trackevents.length; e++) {
			var evnt = track.trackevents[e];
			let curDelta: number = 0.0;
			if (evnt.delta) curDelta = evnt.delta;
			var searchPlayTimeTicks = playTimeTicks + curDelta * tickResolution / 1000.0;
			tickResolution = this.lastResolution(searchPlayTimeTicks,changes);
			playTimeTicks = playTimeTicks + curDelta * tickResolution / 1000.0;
			evnt.playTimeMs = playTimeTicks;
		}
	}
	parseNotes() {
		var changes=this.dumpResolutionChanges();
		
		for (var t = 0; t < this.tracks.length; t++) {
			var track: MIDIFileTrack = this.tracks[t];
			this.parseTicks2time(changes,track);
			/*let playTimeTicks: number = 0;
			let tickResolution: number = this.header.get0TickResolution();
			for (var e = 0; e < track.trackevents.length; e++) {
				var evnt = track.trackevents[e];
				let curDelta: number = 0.0;
				if (evnt.delta) curDelta = evnt.delta;
				playTimeTicks = playTimeTicks + curDelta * tickResolution / 1000.0;
				if (evnt.basetype === this.EVENT_META) {
					// tempo change events
					if (evnt.subtype === this.EVENT_META_SET_TEMPO) {
						if (evnt.tempo) {
							tickResolution = this.header.getCalculatedTickResolution(evnt.tempo);
							console.log('tickResolution', tickResolution, 'at', e, playTimeTicks);
						}
					}
				}
				evnt.playTimeMs = playTimeTicks;
			}*/
			//console.log(t, playTime);
			for (var e = 0; e < track.trackevents.length; e++) {
				var evnt = track.trackevents[e];
				//console.log(t, evnt);
				if (evnt.basetype == this.EVENT_MIDI) {

					evnt.param1 = evnt.param1 ? evnt.param1 : 0;
					/*if (evnt.midiChannel == 9) {
						if (evnt.param1 >= 35 && evnt.param1 <= 81) {
							if (evnt.subtype == this.EVENT_MIDI_NOTE_ON) {
								//this.startDrum(evnt);
							} else {
								if (evnt.subtype == this.EVENT_MIDI_NOTE_OFF) {
									//this.closeDrum(evnt);
								}
							}
						}
					} else {*/
					//console.log(evnt.subtype);
					if (evnt.subtype == this.EVENT_MIDI_NOTE_ON) {
						if (evnt.param1 >= 0 && evnt.param1 <= 127) {
							//this.startNote(evnt);
							//console.log(evnt);
							var pitch = evnt.param1 ? evnt.param1 : 0;
							var when = 0;
							if (evnt.playTimeMs) when = evnt.playTimeMs;
							this.takeOpenedNote(pitch, when, track, evnt.midiChannel ? evnt.midiChannel : 0);
						}
					} else {
						if (evnt.subtype == this.EVENT_MIDI_NOTE_OFF) {
							if (evnt.param1 >= 0 && evnt.param1 <= 127) {
								//this.closeNote(evnt);
								var pitch = evnt.param1 ? evnt.param1 : 0;
								var when = 0;
								if (evnt.playTimeMs) when = evnt.playTimeMs;
								var chpi = this.findOpenedNoteBefore(pitch, when, track, evnt.midiChannel ? evnt.midiChannel : 0);
								if (chpi) {
									var duration = 0;
									for (var i = 0; i < chpi.note.points.length - 1; i++) {
										duration = duration + chpi.note.points[i].pointDuration;
									}
									chpi.note.points[chpi.note.points.length - 1].pointDuration = when - chpi.chord.when - duration;
									chpi.note.closed = true;
								}
							}
						} else {
							if (evnt.subtype == this.EVENT_MIDI_PROGRAM_CHANGE) {
								if (evnt.param1 >= 0 && evnt.param1 <= 127) {
									//this.setProgram(evnt);
									//console.log('setProgram', evnt.param1,evnt.param2,evnt);
									track.program = evnt.param1 ? evnt.param1 : 0;
									//track.volume = evnt.param2 ? evnt.param2 : 0.001;
								}
							} else {
								if (evnt.subtype == this.EVENT_MIDI_PITCH_BEND) {
									//this.bendNote(evnt);

									var pitch = evnt.param1 ? evnt.param1 : 0;
									var slide = ((evnt.param2 ? evnt.param2 : 0) - 64) / 6;
									var when = evnt.playTimeMs ? evnt.playTimeMs : 0;
									var chord: TrackChord | null = this.findChordBefore(when, track, evnt.midiChannel ? evnt.midiChannel : 0);
									if (chord) {
										for (var i = 0; i < chord.notes.length; i++) {
											var note: TrackNote = chord.notes[i];
											if (!(note.closed)) {
												var duration = 0;
												for (var k = 0; k < note.points.length - 1; k++) {
													duration = duration + note.points[k].pointDuration;
												}
												note.points[note.points.length - 1].pointDuration = when - chord.when - duration;
												//console.log('bend',t,note.points[note.points.length - 1].pointDuration, when, chord.when, duration);
												var firstpitch: number = note.points[0].pitch + slide;
												var point: NotePitch = {
													pointDuration: -1
													, pitch: firstpitch
												};
												note.points.push(point);
											}
										}
									}
								} else {

									if (evnt.subtype == this.EVENT_MIDI_CONTROLLER && evnt.param1 == 7) {

										var v = evnt.param2 ? evnt.param2 / 127 : 0;
										track.volumes.push({ ms: evnt.playTimeMs, value: v });
										//console.log(t, 'track.volume', track.volumes[track.volumes.length - 1], track.title);
									} else {
										//
									}
								}
							}
						}
					}
					//}
				} else {
					//console.log((evnt.subtype?evnt.subtype:0).toString(16), evnt);
					if (evnt.subtype == this.EVENT_META_TEXT) {
						//console.log('EVENT_META_TEXT', evnt);
						this.header.lyrics.push({ track: t, ms: evnt.playTimeMs ? evnt.playTimeMs : 0, txt: evnt.text ? evnt.text : "?" });
					}
					if (evnt.subtype == this.EVENT_META_COPYRIGHT_NOTICE) {
						//console.log('EVENT_META_COPYRIGHT_NOTICE', evnt);
						this.header.lyrics.push({ track: t, ms: evnt.playTimeMs ? evnt.playTimeMs : 0, txt: evnt.text ? evnt.text : "?" });
					}
					if (evnt.subtype == this.EVENT_META_TRACK_NAME) {
						//console.log('EVENT_META_TRACK_NAME', evnt);
						//this.setTitle(evnt);
						//console.log(t,this.toText(evnt.data?evnt.data:[]), evnt);
						track.title = this.toText(evnt.data ? evnt.data : []);
					}
					if (evnt.subtype == this.EVENT_META_INSTRUMENT_NAME) {
						//console.log('EVENT_META_INSTRUMENT_NAME', evnt);
						//console.log(t,this.toText(evnt.data?evnt.data:[]), evnt);
						track.instrument = this.toText(evnt.data ? evnt.data : []);
					}
					if (evnt.subtype == this.EVENT_META_LYRICS) {
						//console.log('EVENT_META_LYRICS', evnt);
						//console.log(t,this.toText(evnt.data?evnt.data:[]), evnt);
						this.header.lyrics.push({ track: t, ms: evnt.playTimeMs ? evnt.playTimeMs : 0, txt: evnt.text ? evnt.text : "?" });
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
								signature = majSharpCircleOfFifths[this.header.keyFlatSharp];
							} else {
								signature = minSharpCircleOfFifths[this.header.keyFlatSharp];
							}
						} else {
							if (this.header.keyMajMin < 1) {
								signature = majFlatCircleOfFifths[this.header.keyFlatSharp];
							} else {
								signature = minFlatCircleOfFifths[this.header.keyFlatSharp];
							}
						}

						//console.log(t, 'notes EVENT_META_KEY_SIGNATURE', evnt.key, evnt.scale
						//,this.header.keyFlatSharp,this.header.keyMajMin,signature);
						this.header.signs.push({ track: t, ms: evnt.playTimeMs ? evnt.playTimeMs : 0, sign: signature });
					}
					if (evnt.subtype == this.EVENT_META_SET_TEMPO) {
						//console.log('track', t, 'EVENT_META_SET_TEMPO', evnt.tempoBPM, evnt);
						this.header.tempoBPM = evnt.tempoBPM ? evnt.tempoBPM : 120;
						this.header.tempos.push({ track: t, ms: evnt.playTimeMs ? evnt.playTimeMs : 0, bmp: this.header.tempoBPM });
					}
					if (evnt.subtype == this.EVENT_META_TIME_SIGNATURE) {

						this.header.meterCount = evnt.param1 ? evnt.param1 : 4;
						var dvsn: number = evnt.param2 ? evnt.param2 : 2;
						if (dvsn == 1) this.header.meterDivision = 2
						else if (dvsn == 2) this.header.meterDivision = 4
						else if (dvsn == 3) this.header.meterDivision = 8
						else if (dvsn == 4) this.header.meterDivision = 16
						else if (dvsn == 5) this.header.meterDivision = 32

						this.header.meters.push({
							track: t, ms: evnt.playTimeMs ? evnt.playTimeMs : 0
							, count: this.header.meterCount, division: this.header.meterDivision
						});




						//console.log(t, 'notes EVENT_META_TIME_SIGNATURE', this.header.meterCount,'/',this.header.meterDivision,evnt);

						//console.log(t,'EVENT_META_TIME_SIGNATURE',this.header.meterCount,this.header.meterDivision,evnt);
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
		//track.events.push(event);
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
						//console.log('txt',event);
						return event;
					case this.EVENT_META_MIDI_CHANNEL_PREFIX:
						event.prefix = stream.readUint8();
						//console.log('EVENT_META_MIDI_CHANNEL_PREFIX', event);
						return event;
					case this.EVENT_META_END_OF_TRACK:
						//console.log('EVENT_META_END_OF_TRACK',event);
						return event;
					case this.EVENT_META_SET_TEMPO:
						event.tempo = (stream.readUint8() << 16) + (stream.readUint8() << 8) + stream.readUint8();
						event.tempoBPM = 60000000 / event.tempo;
						//console.log('EVENT_META_SET_TEMPO',event);
						//console.log('note', 'EVENT_META_SET_TEMPO', event.tempoBPM, event);
						return event;
					case this.EVENT_META_SMTPE_OFFSET:
						event.hour = stream.readUint8();
						event.minutes = stream.readUint8();
						event.seconds = stream.readUint8();
						event.frames = stream.readUint8();
						event.subframes = stream.readUint8();
						//console.log('EVENT_META_SMTPE_OFFSET',event);
						return event;
					case this.EVENT_META_KEY_SIGNATURE:
						event.key = stream.readUint8();
						event.scale = stream.readUint8();
						//console.log('event EVENT_META_KEY_SIGNATURE', event);
						return event;
					case this.EVENT_META_TIME_SIGNATURE:
						event.data = stream.readBytes(event.length);
						event.param1 = event.data[0];
						event.param2 = event.data[1];
						event.param3 = event.data[2];
						event.param4 = event.data[3];
						//console.log('event EVENT_META_TIME_SIGNATURE', event);
						return event;
					case this.EVENT_META_SEQUENCER_SPECIFIC:
						event.data = stream.readBytes(event.length);
						//console.log('EVENT_META_SEQUENCER_SPECIFIC',event);
						return event;
					default:
						event.data = stream.readBytes(event.length);
						//console.log('unknown meta',event);
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
						event.param2 = 127; // Find a standard telling what to do here
					}
					return event;
				case this.EVENT_MIDI_NOTE_AFTERTOUCH:
					event.param2 = stream.readUint8();
					return event;
				case this.EVENT_MIDI_CONTROLLER:
					event.param2 = stream.readUint8();
					if (event.param1 == 7) {
						//console.log(event);
					}
					return event;
				case this.EVENT_MIDI_PROGRAM_CHANGE:
					//event.param2 = stream.readUint8();
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
		//console.log(stream.position,stream.buffer.byteLength);
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
	/*takeMeasure(track: MIDISongTrack, when: number, bpm: number, meter: number): MIDISongMeasure {
		var q: number = 60 / bpm;
		var duration: number = 1000 * q * meter * 4;
		var idx = Math.floor(when / duration);
		for (var i = 0; i <= idx; i++) {
			if (track.measures.length < 1 + idx) {
				var m: MIDISongMeasure = {
					duration: duration,
					songchords: []
				};
				track.measures.push(m);
			}
		}
		//console.log(when,track.measures.length,idx,meter,duration);
		return track.measures[idx];
	}*/
	takeDrumVoice(drum: number, drumVoices: { voice: ZvoogVoice, drum: number }[]): { voice: ZvoogVoice, drum: number } {
		for (var i = 0; i < drumVoices.length; i++) {
			if (drumVoices[i].drum == drum) {
				return drumVoices[i];
			}
		}
		var voice: ZvoogVoice = {
			measureChords: []
			//, disabled: false
			, performer: {
				performerPlugin: null//new WafPercSource()//drum)
				, parameters: []
				, kind: "wafdrum"
				, initial: "" + drum
			}
			, filters: []
			, title: 'Drum ' + drum + ': ' + this.drumTitles()[drum]
		};
		var drvc = { voice: voice, drum: drum };
		drumVoices.push(drvc);
		return drvc;
	}/*
	meter44(): ZvoogGridStep[] {
		return [
			{ duration: 384 / 16, power: 3 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 1 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 2 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 1 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 0 }
		];
	}
	meter24(): ZvoogGridStep[] {
		return [
			{ duration: 384 / 16, power: 3 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 1 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 0 }
		];
	}
	meter54(): ZvoogGridStep[] {
		return [
			{ duration: 384 / 16, power: 3 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 1 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 1 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 1 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 1 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 0 }
		];
	}
	meter34(): ZvoogGridStep[] {
		return [
			{ duration: 384 / 16, power: 3 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 1 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 1 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 0 }
		];
	}*/
	/*findMeasureNum(measures: MIDISongMeasure[], ms: number): { nn: number, startMs: number } {
		var k = { nn: 0, startMs: 0 };
		//var t = 0;
		for (var m = 0; m < measures.length; m++) {
			var measure = measures[m];
			if (ms >= k.startMs && ms < k.startMs + measure.duration) {
				break;
			}
			//console.log(i,m,miditrack.measures[m]);
			k.startMs = k.startMs + measure.duration;
			k.nn++;
		}
		return k;
	}*/
	convert(): ZvoogSchedule {
		var midisong: MIDISongData = this.dump();
		console.log('midisong', midisong);
		console.log('from', this);
		/*var splits: number[] = [];
		for (var i = 0; i < midisong.tempos.length; i++) {
			splits.push(midisong.tempos[i].ms);
		}
		for (var i = 0; i < midisong.meters.length; i++) {
			splits.push(midisong.meters[i].ms);
		}
		for (var i = 0; i < midisong.signs.length; i++) {
			splits.push(midisong.signs[i].ms);
		}
		splits.sort();
		console.log(splits);
*/
		var count = 4;
		var division = 4;
		var sign = 'C';
		/*if (midisong.meters.length) {
			if (midisong.meters[0].ms == 0) {
				count = midisong.meters[0].count;
				division = midisong.meters[0].division;
			}
		}*/
		var ms = 0;
		var tempo = 120;
		/*if (midisong.tempos.length) {
			if (midisong.tempos[0].ms == 0) {
				tempo = midisong.tempos[0].bmp;
			}
		}*/
		var meterIdx = 1;
		//var measureDuration = 1000 * count * (4 * 60 / tempo) / division;
		/*var durationChanges: { ms: number, tempo: number, count: number, division: number }[] = [];
		for (var ti = 0; ti < midisong.tempos.length; ti++) {
			durationChanges.push({ms: midisong.tempos[ti].ms, tempo: midisong.tempos[ti].bmp, count: 0, division: 0});
		}
		for (var mi = 0; mi < midisong.meters.length; mi++) {
			durationChanges.push({ms: midisong.meters[mi].ms, tempo: 0, count: midisong.meters[mi].count, division: midisong.meters[mi].division});
		}
		durationChanges.sort((a,b)=>{return a.ms-b.ms;});
		*/
		//var changesIdx:number=0;

		//console.log(durationChanges);
		var timeline: { bpm: number, c: number, d: number, split: number, preTempo: number, s: string, ms: number, len: number }[] = [];
		while (ms < midisong.duration) {
			var tempoRatio = 4 * 60 / tempo;
			var measureDuration = 1000 * tempoRatio * count / division;
			for (var mi = 0; mi < midisong.meters.length; mi++) {
				if (midisong.meters[mi].ms >= ms && midisong.meters[mi].ms < ms + measureDuration) {
					count = midisong.meters[mi].count;
					division = midisong.meters[mi].division;
					measureDuration = 1000 * tempoRatio * count / division;
				}
			}
			var tempoChange: { delta: number, bmp: number }[] = [];
			var tt = tempo;
			for (var i = 0; i < midisong.tempos.length; i++) {
				if (midisong.tempos[i].ms >= ms && midisong.tempos[i].ms < ms + measureDuration) {
					if (midisong.tempos[i].bmp != tt) {
						tempoChange.push({ delta: midisong.tempos[i].ms - ms, bmp: midisong.tempos[i].bmp });
					}
				}
			}
			if (tempoChange.length) {
				//if(tempoChange[0].delta>1){

				//}
				//measureDuration = 1000 * tempoRatio * count / division;
				var part = tempoChange[0].delta / measureDuration;
				var startMs = ms;
				//console.log(meterIdx, ms, '|', tempoChange[0].delta,'=',part,'*',measureDuration,  tempo,':', count, '/',division);
				//console.log(meterIdx, ms,'split', tempoChange);
				//console.log(part, tempoChange);
				var preTempo = tempo;
				tempo = tempoChange[0].bmp;
				tempoRatio = 4 * 60 / tempo;
				var measureDuration2 = (1000 * tempoRatio * count / division) * (1 - part);
				//console.log(meterIdx, ms,'start');

				ms = ms + tempoChange[0].delta;
				//console.log('/',ms,part,'of',measureDuration);
				//if(measureDuration2>1){
				//console.log(meterIdx, ms, '||', measureDuration2 ,'=',(1 - part),'*',(1000 * tempoRatio * count / division),  tempo);
				//}
				for (var i = 0; i < midisong.signs.length; i++) {
					if (midisong.signs[i].ms >= ms && midisong.signs[i].ms < ms + tempoChange[0].delta + measureDuration2) {
						sign = midisong.signs[i].sign;
					}
				}
				timeline.push({
					bpm: tempo, c: count
					, d: division, split: startMs + tempoChange[0].delta, s: sign, preTempo: preTempo, ms: startMs, len: tempoChange[0].delta + measureDuration2
				});
				ms = ms + measureDuration2 * (1 - part);
				//console.log('/',(1 - part),'of',measureDuration2);
				/*for (var ii = 0; ii < tempoChange.length; ii++) {
					tempo = tempoChange[ii].bmp;
					tempoRatio = 4 * 60 / tempo;
					measureDuration = 1000 * tempoRatio * count / division;
					ms = ms + tempoChange[ii].delta;
				}*/
			} else {
				measureDuration = 1000 * tempoRatio * count / division;
				//console.log(meterIdx, ms, '+', measureDuration, ':', count, '/', division, ':', tempo);
				for (var i = 0; i < midisong.signs.length; i++) {
					if (midisong.signs[i].ms >= ms && midisong.signs[i].ms < ms + measureDuration) {
						sign = midisong.signs[i].sign;
					}
				}
				timeline.push({
					bpm: tempo, c: count
					, d: division, split: 0, s: sign, preTempo: 0, ms: ms, len: measureDuration
				});
				ms = ms + measureDuration;
			}
			meterIdx++;
		}
		//console.log('timeline', timeline);

		/*var gridPat: ZvoogGridStep[] = this.meter44();
		if (midisong.meter.count == 2 && midisong.meter.division == 4) {
			gridPat = this.meter24();
		}
		if (midisong.meter.count == 3 && midisong.meter.division == 4) {
			gridPat = this.meter34();
		}
		if (midisong.meter.count == 5 && midisong.meter.division == 4) {
			gridPat = this.meter54();
		}*/
		/*let schedule: ZvoogSchedule = {
			title: 'import from *.mid'
			//, description: 'none'
			//, duration: duration
			, timeline: []
			, tracks: []
			, effects: []
			, macros: []
			, macroPosition: 2
			, masterPosition: 1
			, gridPattern: gridPat
			, keyPattern: []
			, horizontal: true
			, locked: false
			, selectedLayer: { track_songFx: 0, voice_trackFx_songFxParam: 0, source_voiceFx_trackParam: 0, sourceParam_voiceFxParam: 0 }
			, selectedMeasures: { from: 0, duration: 0 }

		};*/
		let schedule: ZvoogSchedule = {
			title: "import from *.mid"
			, tracks: []
			, filters: []
			, measures: []
			, harmony: {
				tone: ""
				, mode: ""
				, progression: []
			}
		};
		schedule.filters.push({
			filterPlugin: null
			, parameters: []
			, kind: "gain"
			, initial: ""
		});
		for (var i = 0; i < timeline.length; i++) {
			schedule.measures.push({
				meter: { count: Math.round(timeline[i].c), division: Math.round(timeline[i].d) }
				, tempo: Math.round(timeline[i].bpm / 5) * 5
			});
		}
		for (var i = 0; i < midisong.tracks.length; i++) {
			var trackTictle: string = '';
			if (midisong.tracks[i].title) {
				trackTictle = midisong.tracks[i].title;
				if (midisong.tracks[i].instrument) {
					trackTictle = midisong.tracks[i].title + ': ' + midisong.tracks[i].instrument;
				}
			} else {
				if (midisong.tracks[i].instrument) {
					trackTictle = midisong.tracks[i].instrument;
				} else {
					trackTictle = 'track ' + i;
				}
			}
			var track: ZvoogTrack = {
				title: trackTictle
				, voices: []
				, filters: []
			};
			schedule.tracks.push(track);
			var firstChannelNum = 0;
			for (var ch = 0; ch < midisong.tracks[i].songchords.length; ch++) {
				firstChannelNum = midisong.tracks[i].songchords[ch].channel;
				break;
			}
			if (firstChannelNum == 9) {
				var drumNums: number[] = [];
				for (var ch = 0; ch < midisong.tracks[i].songchords.length; ch++) {
					for (var nn = 0; nn < midisong.tracks[i].songchords[ch].notes.length; nn++) {
						var pinum: number = midisong.tracks[i].songchords[ch].notes[nn].points[0].pitch;
						if (drumNums.indexOf(pinum) < 0) {
							drumNums.push(pinum);
							var voice: ZvoogVoice = {
								measureChords: []
								, performer: {
									performerPlugin: null
									, parameters: []
									, kind: 'wafdrum'
									, initial: '' + pinum
								}
								, filters: []
								, title: 'drum ' + pinum
							};
							track.voices.push(voice);
							for (var mc = 0; mc < timeline.length; mc++) {
								voice.measureChords.push({ chords: [] });
							}
						}
					}
				}
			} else {
				var voice: ZvoogVoice = {
					measureChords: []
					, performer: {
						performerPlugin: null
						, parameters: []
						, kind: 'wafinstrument'
						, initial: '' + midisong.tracks[i].program
					}
					, filters: []
					, title: 'program ' + midisong.tracks[i].program
				};
				track.voices.push(voice);
				for (var mc = 0; mc < timeline.length; mc++) {
					voice.measureChords.push({ chords: [] });
				}
				console.log(track);
				for (var chn = 0; chn < midisong.tracks[i].songchords.length; chn++) {
					var midichord: MIDISongChord = midisong.tracks[i].songchords[chn];
					for (var tc = 0; tc < timeline.length; tc++) {
						if (Math.round(midichord.when) < Math.round(timeline[tc].ms)) {
							var timelineMeasure = timeline[tc - 1];
							var skipInMeasureMs = midichord.when - timelineMeasure.ms;
							var skipMeter: ZvoogMeter = seconds2meter32(skipInMeasureMs / 1000, timelineMeasure.bpm);
							skipMeter = DUU(skipMeter).simplify();
							console.log(i,tc, timelineMeasure.ms,midichord.when,skipMeter);
							break;
						}
					}
				}
			}
		}

		/*
	for (var o = 0; o < 10; o++) {
		schedule.keyPattern.push(3);
		schedule.keyPattern.push(2);
		schedule.keyPattern.push(1);
		schedule.keyPattern.push(2);
		schedule.keyPattern.push(1);
		schedule.keyPattern.push(1);
		schedule.keyPattern.push(2);
		schedule.keyPattern.push(1);
		schedule.keyPattern.push(2);
		schedule.keyPattern.push(1);
		schedule.keyPattern.push(2);
		schedule.keyPattern.push(1);
	}
	for (var i = 0; i < midisong.tracks[0].measures.length; i++) {
		schedule.timeline.push({
			meter: {
				count: midisong.meter.count
				, division: midisong.meter.division
			}
			, tempo: Math.round(midisong.bpm)
		});
	}
	let cuti = 0;
	let curBPM = midisong.bpm;
	for (let i = 0; i < schedule.timeline.length; i++) {
		let measure = schedule.timeline[i];
		for (let k = 0; k < midisong.tempos.length; k++) {
			let pp = duration2time(160, duration384(measure.meter));
			if (midisong.tempos[k].ms >= cuti * 1000 && midisong.tempos[k].ms < (cuti + pp) * 1000) {
				curBPM = Math.round(midisong.tempos[k].bmp);
				break;
			}
		}
		measure.tempo = curBPM;
		let tt = duration2time(measure.tempo, duration384(measure.meter));
		cuti = cuti + tt;
		//console.log(i, cuti, measure);
	}*/



		/*
		for (var i = 0; i < midisong.tracks.length; i++) {
			var miditrack: MIDISongTrack = midisong.tracks[i];
			var volumePoints: ZvoogPoint[] = [];
			if (miditrack.volumes.length) {
				var curMeasure = 0;
				var curVol = 0;
				for (var kk = 0; kk < miditrack.volumes.length; kk++) {
					var measureN = this.findMeasureNum(miditrack.measures, miditrack.volumes[kk].ms);
					var deltatime = miditrack.volumes[kk].ms - measureN.startMs;
					var delta384 = time2Duration(deltatime / 1000, schedule.timeline[measureN.nn].tempo);
					volumePoints.push({
						skipMeasures: measureN.nn - curMeasure
						, skip384: delta384
						, velocity: curVol
					});
					curVol = 119 * miditrack.volumes[kk].value;
					volumePoints.push({
						skipMeasures: 0
						, skip384: delta384
						, velocity: curVol
					});
					curMeasure = measureN.nn;
				}
			} else {
				volumePoints.push({
					skipMeasures: 0
					, skip384: 0
					, velocity: 99
				});
			}
			var trackTitle=miditrack.title;
			if(!(trackTitle)){
				trackTitle='track ' + i;
			}
			var track: ZvoogTrack = {
				voices: []
				, disabled: false
				, effects: [{
					parameters: [{
						points: volumePoints
					}]
					, plugin: new ZvoogFxGain()
					, disabled: false
				}]
				, title: trackTitle
				, strings: []
			};


			var voice: ZvoogVoice = {
				chunks: []
				, disabled: false
				, source: {
					plugin: new ZvoogInstrumentSource(miditrack.program + 1)
					, parameters: []
				}
				, effects: []//{ parameters: [{ points: [{ skipMeasures: 0, skip384: 0, velocity: 119 }] }], plugin: new ZvoogFxGain() }]
				, title: 'MIDI ' + miditrack.program + ': ' + this.instrumentTitles()[miditrack.program]
			};
			var time = 0;
			for (var m = 0; m < miditrack.measures.length; m++) {
				var songmeasure: MIDISongMeasure = miditrack.measures[m];
				var chunk: ZvoogPattern = {
					chords: []
					, title: 'start at ' + time
					, clefHint: 0
					, keyHint: 0
				};
				for (var c = 0; c < songmeasure.songchords.length; c++) {
					var midichord: MIDISongChord = songmeasure.songchords[c];
					var chordtime = midichord.when - time;
					var when384 = time2Duration(chordtime / 1000, midisong.bpm);
					var zvoogchord: ZvoogChord = {
						when: 12 * (Math.round((when384 - 0) / 12))
						, values: []
						, title: ''
						, fretHint: []
						, text: ''
					};
					if (midichord.channel != 9) {
						for (var n = 0; n < midichord.notes.length; n++) {
							var midinote: MIDISongNote = midichord.notes[n];
							var zvoogkey: ZvoogKey = {
								envelope: []
								, stepHint: 0
								, shiftHint: 0
								, octaveHint: 0
							};
							zvoogchord.values.push(zvoogkey);
							for (var p = 0; p < midinote.points.length; p++) {
								var point: MIDISongPoint = midinote.points[p];
								var zvoogPitch: ZvoogPitch = {
									duration: time2Duration(point.duration / 1000, midisong.bpm)
									, pitch: point.pitch
								};
								zvoogkey.envelope.push(zvoogPitch);
							}
						}
					}
					chunk.chords.push(zvoogchord);
				}
				voice.chunks.push(chunk);
				time = time + songmeasure.duration;
			}
			track.voices.push(voice);
			var fordrum: { voice: ZvoogVoice, drum: number }[] = [];
			for (var m = 0; m < miditrack.measures.length; m++) {
				var measure: MIDISongMeasure = miditrack.measures[m];
				for (var c = 0; c < measure.songchords.length; c++) {
					let chord: MIDISongChord = measure.songchords[c];
					if (chord.channel == 9) {
						for (var n = 0; n < chord.notes.length; n++) {
							var note: MIDISongNote = chord.notes[n];
							for (var p = 0; p < note.points.length; p++) {
								var point: MIDISongPoint = note.points[p];
								this.takeDrumVoice(point.pitch, fordrum);
							}
						}
					}
				}
			}
			if(fordrum.length>0){
				track.voices=[];
			}
			for (var d = 0; d < fordrum.length; d++) {
				var zvoice: ZvoogVoice = fordrum[d].voice;
				track.voices.push(zvoice);
				var time = 0;
				for (var m = 0; m < miditrack.measures.length; m++) {
					var measure: MIDISongMeasure = miditrack.measures[m];
					var chunk: ZvoogPattern = {
						chords: []
						, title: 'start at ' + time
						, clefHint: 0
						, keyHint: 0
					};
					zvoice.chunks.push(chunk);
					for (var c = 0; c < measure.songchords.length; c++) {
						let midichord: MIDISongChord = measure.songchords[c];
						if (midichord.channel == 9) {
							var chordtime = midichord.when - time;
							var zvoogchord: ZvoogChord = {
								when: time2Duration(chordtime / 1000, midisong.bpm)
								, values: []
								, title: ''
								, fretHint: []
								, text: ''
							};
							for (var n = 0; n < midichord.notes.length; n++) {
								var midinote: MIDISongNote = midichord.notes[n];
								var point: MIDISongPoint = midinote.points[0];
								if (point.pitch == fordrum[d].drum) {
									var zvoogkey: ZvoogKey = {
										envelope: []
										, stepHint: 0
										, shiftHint: 0
										, octaveHint: 0
									};
									var zvoogPitch: ZvoogPitch = {
										duration: time2Duration(point.duration / 1000, midisong.bpm)
										, pitch: point.pitch
									};
									zvoogkey.envelope.push(zvoogPitch);
									zvoogchord.values.push(zvoogkey);
								}
							}
							if (zvoogchord.values.length) {
								chunk.chords.push(zvoogchord);
							}
						}
					}
					time = time + measure.duration;
				}
			}
			schedule.tracks.push(track);
		}
*/
		//console.log(schedule);
		return schedule;
	}
	dump(): MIDISongData {
		var a: MIDISongData = {
			parser: '1.01'
			, duration: 0
			, bpm: this.header.tempoBPM
			, tempos: this.header.tempos
			, lyrics: this.header.lyrics
			, key: this.header.keyFlatSharp
			, mode: this.header.keyMajMin
			, meter: { count: this.header.meterCount, division: this.header.meterDivision }
			, meters: this.header.meters
			, signs: this.header.signs
			, tracks: []
			, speedMode: 0
			, lineMode: 0
		};
		for (var i = 0; i < this.tracks.length; i++) {
			var miditrack: MIDIFileTrack = this.tracks[i];
			var tr: MIDISongTrack = {
				order: i
				, title: miditrack.title ? miditrack.title : ''
				, instrument: miditrack.instrument ? miditrack.instrument : ''
				//, volume: miditrack.volume ? miditrack.volume : 1
				, volumes: miditrack.volumes
				, program: miditrack.program ? miditrack.program : 0
				//, measures: []
				, songchords: []
			};
			var maxWhen = 0;
			for (var ch = 0; ch < miditrack.chords.length; ch++) {
				var midichord: TrackChord = miditrack.chords[ch];
				var newchord: MIDISongChord = { when: midichord.when, notes: [], channel: midichord.channel };
				if (maxWhen < midichord.when) {
					maxWhen = midichord.when;
				}
				//var measure: MIDISongMeasure = this.takeMeasure(tr, midichord.when, this.header.tempoBPM, this.header.meterCount / this.header.meterDivision);
				//tr.chords.push(newchord);
				//console.log(ch,midichord,measure);
				//measure.songchords.push(newchord);
				tr.songchords.push(newchord);
				for (var n = 0; n < midichord.notes.length; n++) {
					var midinote: TrackNote = midichord.notes[n];
					var newnote: MIDISongNote = { points: [] };
					newchord.notes.push(newnote);
					for (var v = 0; v < midinote.points.length; v++) {
						var midipoint: NotePitch = midinote.points[v];
						var newpoint: MIDISongPoint = { pitch: midipoint.pitch, duration: midipoint.pointDuration };
						newnote.points.push(newpoint);
					}
				}
			}
			if (tr.songchords.length > 0) {
				a.tracks.push(tr);
				//var d = tr.measures.length * tr.measures[0].duration;
				if (a.duration < maxWhen) {
					a.duration = 54321 + maxWhen;
					//console.log('duration',a.duration);
				}
			}
		}
		//console.log('duration',a.duration,this);
		//console.log(a);
		return a;
	}
	instrumentTitles() {
		if (this.instrumentNamesArray.length > 0) {
			//
		} else {
			var insNames: string[] = [];
			insNames[0] = "Acoustic Grand Piano: Piano";
			insNames[1] = "Bright Acoustic Piano: Piano";
			insNames[2] = "Electric Grand Piano: Piano";
			insNames[3] = "Honky-tonk Piano: Piano";
			insNames[4] = "Electric Piano 1: Piano";
			insNames[5] = "Electric Piano 2: Piano";
			insNames[6] = "Harpsichord: Piano";
			insNames[7] = "Clavinet: Piano";
			insNames[8] = "Celesta: Chromatic Percussion";
			insNames[9] = "Glockenspiel: Chromatic Percussion";
			insNames[10] = "Music Box: Chromatic Percussion";
			insNames[11] = "Vibraphone: Chromatic Percussion";
			insNames[12] = "Marimba: Chromatic Percussion";
			insNames[13] = "Xylophone: Chromatic Percussion";
			insNames[14] = "Tubular Bells: Chromatic Percussion";
			insNames[15] = "Dulcimer: Chromatic Percussion";
			insNames[16] = "Drawbar Organ: Organ";
			insNames[17] = "Percussive Organ: Organ";
			insNames[18] = "Rock Organ: Organ";
			insNames[19] = "Church Organ: Organ";
			insNames[20] = "Reed Organ: Organ";
			insNames[21] = "Accordion: Organ";
			insNames[22] = "Harmonica: Organ";
			insNames[23] = "Tango Accordion: Organ";
			insNames[24] = "Acoustic Guitar (nylon): Guitar";
			insNames[25] = "Acoustic Guitar (steel): Guitar";
			insNames[26] = "Electric Guitar (jazz): Guitar";
			insNames[27] = "Electric Guitar (clean): Guitar";
			insNames[28] = "Electric Guitar (muted): Guitar";
			insNames[29] = "Overdriven Guitar: Guitar";
			insNames[30] = "Distortion Guitar: Guitar";
			insNames[31] = "Guitar Harmonics: Guitar";
			insNames[32] = "Acoustic Bass: Bass";
			insNames[33] = "Electric Bass (finger): Bass";
			insNames[34] = "Electric Bass (pick): Bass";
			insNames[35] = "Fretless Bass: Bass";
			insNames[36] = "Slap Bass 1: Bass";
			insNames[37] = "Slap Bass 2: Bass";
			insNames[38] = "Synth Bass 1: Bass";
			insNames[39] = "Synth Bass 2: Bass";
			insNames[40] = "Violin: Strings";
			insNames[41] = "Viola: Strings";
			insNames[42] = "Cello: Strings";
			insNames[43] = "Contrabass: Strings";
			insNames[44] = "Tremolo Strings: Strings";
			insNames[45] = "Pizzicato Strings: Strings";
			insNames[46] = "Orchestral Harp: Strings";
			insNames[47] = "Timpani: Strings";
			insNames[48] = "String Ensemble 1: Ensemble";
			insNames[49] = "String Ensemble 2: Ensemble";
			insNames[50] = "Synth Strings 1: Ensemble";
			insNames[51] = "Synth Strings 2: Ensemble";
			insNames[52] = "Choir Aahs: Ensemble";
			insNames[53] = "Voice Oohs: Ensemble";
			insNames[54] = "Synth Choir: Ensemble";
			insNames[55] = "Orchestra Hit: Ensemble";
			insNames[56] = "Trumpet: Brass";
			insNames[57] = "Trombone: Brass";
			insNames[58] = "Tuba: Brass";
			insNames[59] = "Muted Trumpet: Brass";
			insNames[60] = "French Horn: Brass";
			insNames[61] = "Brass Section: Brass";
			insNames[62] = "Synth Brass 1: Brass";
			insNames[63] = "Synth Brass 2: Brass";
			insNames[64] = "Soprano Sax: Reed";
			insNames[65] = "Alto Sax: Reed";
			insNames[66] = "Tenor Sax: Reed";
			insNames[67] = "Baritone Sax: Reed";
			insNames[68] = "Oboe: Reed";
			insNames[69] = "English Horn: Reed";
			insNames[70] = "Bassoon: Reed";
			insNames[71] = "Clarinet: Reed";
			insNames[72] = "Piccolo: Pipe";
			insNames[73] = "Flute: Pipe";
			insNames[74] = "Recorder: Pipe";
			insNames[75] = "Pan Flute: Pipe";
			insNames[76] = "Blown bottle: Pipe";
			insNames[77] = "Shakuhachi: Pipe";
			insNames[78] = "Whistle: Pipe";
			insNames[79] = "Ocarina: Pipe";
			insNames[80] = "Lead 1 (square): Synth Lead";
			insNames[81] = "Lead 2 (sawtooth): Synth Lead";
			insNames[82] = "Lead 3 (calliope): Synth Lead";
			insNames[83] = "Lead 4 (chiff): Synth Lead";
			insNames[84] = "Lead 5 (charang): Synth Lead";
			insNames[85] = "Lead 6 (voice): Synth Lead";
			insNames[86] = "Lead 7 (fifths): Synth Lead";
			insNames[87] = "Lead 8 (bass + lead): Synth Lead";
			insNames[88] = "Pad 1 (new age): Synth Pad";
			insNames[89] = "Pad 2 (warm): Synth Pad";
			insNames[90] = "Pad 3 (polysynth): Synth Pad";
			insNames[91] = "Pad 4 (choir): Synth Pad";
			insNames[92] = "Pad 5 (bowed): Synth Pad";
			insNames[93] = "Pad 6 (metallic): Synth Pad";
			insNames[94] = "Pad 7 (halo): Synth Pad";
			insNames[95] = "Pad 8 (sweep): Synth Pad";
			insNames[96] = "FX 1 (rain): Synth Effects";
			insNames[97] = "FX 2 (soundtrack): Synth Effects";
			insNames[98] = "FX 3 (crystal): Synth Effects";
			insNames[99] = "FX 4 (atmosphere): Synth Effects";
			insNames[100] = "FX 5 (brightness): Synth Effects";
			insNames[101] = "FX 6 (goblins): Synth Effects";
			insNames[102] = "FX 7 (echoes): Synth Effects";
			insNames[103] = "FX 8 (sci-fi): Synth Effects";
			insNames[104] = "Sitar: Ethnic";
			insNames[105] = "Banjo: Ethnic";
			insNames[106] = "Shamisen: Ethnic";
			insNames[107] = "Koto: Ethnic";
			insNames[108] = "Kalimba: Ethnic";
			insNames[109] = "Bagpipe: Ethnic";
			insNames[110] = "Fiddle: Ethnic";
			insNames[111] = "Shanai: Ethnic";
			insNames[112] = "Tinkle Bell: Percussive";
			insNames[113] = "Agogo: Percussive";
			insNames[114] = "Steel Drums: Percussive";
			insNames[115] = "Woodblock: Percussive";
			insNames[116] = "Taiko Drum: Percussive";
			insNames[117] = "Melodic Tom: Percussive";
			insNames[118] = "Synth Drum: Percussive";
			insNames[119] = "Reverse Cymbal: Percussive";
			insNames[120] = "Guitar Fret Noise: Sound effects";
			insNames[121] = "Breath Noise: Sound effects";
			insNames[122] = "Seashore: Sound effects";
			insNames[123] = "Bird Tweet: Sound effects";
			insNames[124] = "Telephone Ring: Sound effects";
			insNames[125] = "Helicopter: Sound effects";
			insNames[126] = "Applause: Sound effects";
			insNames[127] = "Gunshot: Sound effects";
			this.instrumentNamesArray = insNames;
		}
		return this.instrumentNamesArray;
	};
	drumTitles() {
		if (this.drumNamesArray.length < 1) {
			var drumNames: string[] = [];
			drumNames[35] = "Bass Drum 2";
			drumNames[36] = "Bass Drum 1";
			drumNames[37] = "Side Stick/Rimshot";
			drumNames[38] = "Snare Drum 1";
			drumNames[39] = "Hand Clap";
			drumNames[40] = "Snare Drum 2";
			drumNames[41] = "Low Tom 2";
			drumNames[42] = "Closed Hi-hat";
			drumNames[43] = "Low Tom 1";
			drumNames[44] = "Pedal Hi-hat";
			drumNames[45] = "Mid Tom 2";
			drumNames[46] = "Open Hi-hat";
			drumNames[47] = "Mid Tom 1";
			drumNames[48] = "High Tom 2";
			drumNames[49] = "Crash Cymbal 1";
			drumNames[50] = "High Tom 1";
			drumNames[51] = "Ride Cymbal 1";
			drumNames[52] = "Chinese Cymbal";
			drumNames[53] = "Ride Bell";
			drumNames[54] = "Tambourine";
			drumNames[55] = "Splash Cymbal";
			drumNames[56] = "Cowbell";
			drumNames[57] = "Crash Cymbal 2";
			drumNames[58] = "Vibra Slap";
			drumNames[59] = "Ride Cymbal 2";
			drumNames[60] = "High Bongo";
			drumNames[61] = "Low Bongo";
			drumNames[62] = "Mute High Conga";
			drumNames[63] = "Open High Conga";
			drumNames[64] = "Low Conga";
			drumNames[65] = "High Timbale";
			drumNames[66] = "Low Timbale";
			drumNames[67] = "High Agogo";
			drumNames[68] = "Low Agogo";
			drumNames[69] = "Cabasa";
			drumNames[70] = "Maracas";
			drumNames[71] = "Short Whistle";
			drumNames[72] = "Long Whistle";
			drumNames[73] = "Short Guiro";
			drumNames[74] = "Long Guiro";
			drumNames[75] = "Claves";
			drumNames[76] = "High Wood Block";
			drumNames[77] = "Low Wood Block";
			drumNames[78] = "Mute Cuica";
			drumNames[79] = "Open Cuica";
			drumNames[80] = "Mute Triangle";
			drumNames[81] = "Open Triangle";
			this.drumNamesArray = drumNames;
		}
		return this.drumNamesArray;
	};
}
/*type MIDISongMeasure = {
	duration: number;
	songchords: MIDISongChord[];
};*/
type MIDISongPoint = {
	pitch: number;
	duration: number;
}
type MIDISongNote = {
	points: MIDISongPoint[];
	nn?: number;
}
type MIDISongChord = {
	when: number;
	channel: number;
	notes: MIDISongNote[];
};
type MIDISongTrack = {
	title: string;
	instrument: string;
	program: number;
	//volume: number;
	volumes: { ms: number, value: number, meausre?: number, skip384?: number }[];
	//measures: MIDISongMeasure[];
	songchords: MIDISongChord[];
	order: number;
};
type MIDISongData = {
	duration: number;
	parser: string;
	bpm: number;
	tempos: { track: number, ms: number, bmp: number }[];
	meters: { track: number, ms: number, count: number, division: number }[];
	lyrics: { track: number, ms: number, txt: string }[];
	key: number;
	mode: number;
	meter: { count: number, division: number };
	signs: { track: number, ms: number, sign: string }[];
	tracks: MIDISongTrack[];
	speedMode: number;
	lineMode: number;
};
