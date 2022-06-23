type XYp = {
	x: number;
	y: number;
};
type PP = {
	p1: XYp;
	p2: XYp;
};
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
type MIDISongPoint = {
	pitch: number;
	durationms: number;
}
type MIDISongNote = {
	points: MIDISongPoint[];
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
	volumes: { ms: number, value: number, meausre?: number, skip384?: number }[];
	songchords: MIDISongChord[];
	order: number;
};
type MIDISongData = {
	duration: number;
	parser: string;
	bpm: number;
	changes: { track: number, ms: number, resolution: number, bpm: number }[];
	meters: { track: number, ms: number, count: number, division: number }[];
	lyrics: { track: number, ms: number, txt: string }[];
	key: number;
	mode: number;
	meter: { count: number, division: number };
	signs: { track: number, ms: number, sign: string }[];
	miditracks: MIDISongTrack[];
	speedMode: number;
	lineMode: number;
};
let instrumentNamesArray: string[] = [];
let drumNamesArray: string[] = [];
function findrumTitles(nn: number): string {
	let name = drumTitles()[nn];
	if (name) {
		return '' + name;
	} else {
		return 'MIDI' + nn;
	}

}
function drumTitles(): string[] {
	if (drumNamesArray.length == 0) {
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
		drumNamesArray = drumNames;
	}
	return drumNamesArray;
};
function instrumentTitles(): string[] {
	if (instrumentNamesArray.length == 0) {
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
		instrumentNamesArray = insNames;
	}
	return instrumentNamesArray;
};
class MIDIFileImporter implements ZvoogStore {
	list(onFinish: (items: ZvoogStoreListItem[]) => void): void { };
	goFolder(title: string, onFinish: (error: string) => void): void { };
	goUp(onFinish: (error: string) => void): void { };
	readSongData(title: string, onFinish: (result: ZvoogSchedule | null) => void): void {
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
	format: number;
	trackCount: number;
	tempoBPM: number = 120;
	changes: { track: number, ms: number, resolution: number, bpm: number }[] = [];
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
class MIDIFileTrack {
	datas: DataView;
	HDR_LENGTH: number = 8;
	trackLength: number;
	trackContent: DataView;
	trackevents: MIDIEvent[];
	title: string;
	instrument: string;
	programChannel: { program: number, channel: number }[];
	volumes: { ms: number, value: number }[];
	chords: TrackChord[] = [];
	constructor(buffer: ArrayBuffer, start: number) {
		this.datas = new DataView(buffer, start, this.HDR_LENGTH);
		this.trackLength = this.datas.getUint32(4);
		this.datas = new DataView(buffer, start, this.HDR_LENGTH + this.trackLength);
		this.trackContent = new DataView(this.datas.buffer, this.datas.byteOffset + this.HDR_LENGTH, this.datas.byteLength - this.HDR_LENGTH);
		this.trackevents = [];
		this.volumes = [];
		this.programChannel = [];
	}
}

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
	constructor(arrayBuffer: ArrayBuffer) {
		this.header = new MIDIFileHeader(arrayBuffer);
		this.parseTracks(arrayBuffer);
	}
	parseTracks(arrayBuffer: ArrayBuffer) {
		console.log('start parseTracks');
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
		for (var t = 0; t < this.parsedTracks.length; t++) {
			var track: MIDIFileTrack = this.parsedTracks[t];
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
						note.points = [];
						for (var p = 0; p < lessPoints.length - 1; p++) {
							var xypoint: XYp = lessPoints[p];
							var xyduration = lessPoints[p + 1].x - xypoint.x;
							note.points.push({ pointDuration: xyduration, pitch: xypoint.y });
						}
					} else {
						if (note.points.length == 1) {
							if (note.points[0].pointDuration > 4321) {
								note.points[0].pointDuration = 1234;
							}
						}
					}
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
		for (var e = 0; e < track.trackevents.length; e++) {
			var evnt = track.trackevents[e];
			let curDelta: number = 0.0;
			if (evnt.delta) curDelta = evnt.delta;
			var searchPlayTimeTicks = playTimeTicks + curDelta * tickResolution / 1000.0;
			tickResolution = this.lastResolution(searchPlayTimeTicks);
			playTimeTicks = playTimeTicks + curDelta * tickResolution / 1000.0;
			evnt.playTimeMs = playTimeTicks;
		}
	}
	parseNotes() {
		this.dumpResolutionChanges();
		for (let t = 0; t < this.parsedTracks.length; t++) {
			var singleParsedTrack: MIDIFileTrack = this.parsedTracks[t];
			this.parseTicks2time(singleParsedTrack);
			for (var e = 0; e < singleParsedTrack.trackevents.length; e++) {
				var evnt = singleParsedTrack.trackevents[e];
				if (evnt.basetype == this.EVENT_MIDI) {
					evnt.param1 = evnt.param1 ? evnt.param1 : 0;
					if (evnt.subtype == this.EVENT_MIDI_NOTE_ON) {
						if (evnt.param1 >= 0 && evnt.param1 <= 127) {
							var pitch = evnt.param1 ? evnt.param1 : 0;
							var when = 0;
							if (evnt.playTimeMs) when = evnt.playTimeMs;
							this.takeOpenedNote(pitch, when, singleParsedTrack, evnt.midiChannel ? evnt.midiChannel : 0);
						}
					} else {
						if (evnt.subtype == this.EVENT_MIDI_NOTE_OFF) {
							if (evnt.param1 >= 0 && evnt.param1 <= 127) {
								var pitch = evnt.param1 ? evnt.param1 : 0;
								var when = 0;
								if (evnt.playTimeMs) when = evnt.playTimeMs;
								var chpi = this.findOpenedNoteBefore(pitch, when, singleParsedTrack, evnt.midiChannel ? evnt.midiChannel : 0);
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
									singleParsedTrack.programChannel.push({
										program: evnt.param1 ? evnt.param1 : 0
										, channel: evnt.midiChannel ? evnt.midiChannel : 0
									});
								}
							} else {
								if (evnt.subtype == this.EVENT_MIDI_PITCH_BEND) {
									var pitch = evnt.param1 ? evnt.param1 : 0;
									var slide = ((evnt.param2 ? evnt.param2 : 0) - 64) / 6;
									var when = evnt.playTimeMs ? evnt.playTimeMs : 0;
									var chord: TrackChord | null = this.findChordBefore(when, singleParsedTrack, evnt.midiChannel ? evnt.midiChannel : 0);
									if (chord) {
										for (var i = 0; i < chord.notes.length; i++) {
											var note: TrackNote = chord.notes[i];
											if (!(note.closed)) {
												var duration = 0;
												for (var k = 0; k < note.points.length - 1; k++) {
													duration = duration + note.points[k].pointDuration;
												}
												note.points[note.points.length - 1].pointDuration = when - chord.when - duration;
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
										singleParsedTrack.volumes.push({ ms: evnt.playTimeMs, value: v });
									} else {
										//
									}
								}
							}
						}
					}
					//}
				} else {
					if (evnt.subtype == this.EVENT_META_TEXT) {
						this.header.lyrics.push({ track: t, ms: evnt.playTimeMs ? evnt.playTimeMs : 0, txt: evnt.text ? evnt.text : "?" });
					}
					if (evnt.subtype == this.EVENT_META_COPYRIGHT_NOTICE) {
						this.header.lyrics.push({ track: t, ms: evnt.playTimeMs ? evnt.playTimeMs : 0, txt: evnt.text ? evnt.text : "?" });
					}
					if (evnt.subtype == this.EVENT_META_TRACK_NAME) {
						singleParsedTrack.title = this.toText(evnt.data ? evnt.data : []);
					}
					if (evnt.subtype == this.EVENT_META_INSTRUMENT_NAME) {
						singleParsedTrack.instrument = this.toText(evnt.data ? evnt.data : []);
					}
					if (evnt.subtype == this.EVENT_META_LYRICS) {
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
						this.header.meters.push({
							track: t, ms: evnt.playTimeMs ? evnt.playTimeMs : 0
							, count: this.header.meterCount, division: this.header.meterDivision
						});
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
						event.param2 = 127; // Find a standard telling what to do here
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
	/* __takeDrumVoice(drum: number, drumVoices: { voice: ZvoogPercussionVoice, drum: number }[]): { voice: ZvoogPercussionVoice, drum: number } {
		for (var i = 0; i < drumVoices.length; i++) {
			if (drumVoices[i].drum == drum) {
				return drumVoices[i];
			}
		}
		var voice: ZvoogPercussionVoice = {
			measureBunches: []
			//, disabled: false
			, percussionSetting: {
				percussionPlugin: null//new WafPercSource()//drum)
				, parameters: []
				, kind: "wafdrum"
				, initial: "" + drum
			}
			, filters: []
			, title: 'Drum ' + drum + ': ' + findrumTitles(drum)
		};
		var drvc = { voice: voice, drum: drum };
		drumVoices.push(drvc);
		return drvc;
	}*/
	parametersDefs(plugin: ZvoogPlugin): ZvoogParameterData[] {
		var pars: ZvoogParameterData[] = [];
		var pp = 0;
		var pName = plugin.getParId(pp);
		while (pName) {
			pars.push({ caption: pName, points: [{ skipMeasures: 0, skipSteps: { count: 0, division: 1 }, velocity: 60 }] });
			pp++;
			pName = plugin.getParId(pp);
		}
		return pars;
	}
	convert(): ZvoogSchedule {
		var midisong: MIDISongData = this.dump();
		console.log('midisong', midisong);
		let minIns = 123456;
		let maxIns = -1;
		let minDr = 123456;
		let maxDr = -1;
		for (let tt = 0; tt < midisong.miditracks.length; tt++) {
			let onetrack = midisong.miditracks[tt];
			for (let ch = 0; ch < onetrack.songchords.length; ch++) {
				let onechord = onetrack.songchords[ch];
				for (let nn = 0; nn < onechord.notes.length; nn++) {
					let pp = onechord.notes[nn].points[0].pitch;
					if (onechord.channel == 9) {
						if (maxDr < pp) {
							maxDr = pp;
						} else {
							if (minDr > pp) {
								minDr = pp;
							}
						}
					} else {
						if (maxIns < pp) {
							maxIns = pp;
						} else {
							if (minIns > pp) {
								minIns = pp;
							}
						}
					}
				}
			}
		}
		console.log('ins min/mx', minIns, maxIns);
		console.log('dr min/mx', minDr, maxDr);
		var count = 4;
		var division = 4;
		var sign = 'C';
		var ms = 0;
		var tempo = 120;
		//var meterIdx = 1;
		var timeline: { bpm: number, c: number, d: number, split: number, s: string, ms: number, len: number }[] = [];
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
			for (var i = 0; i < midisong.changes.length; i++) {
				if (midisong.changes[i].ms >= ms && midisong.changes[i].ms < ms + measureDuration) {
					if (midisong.changes[i].bpm != tt) {
						tempoChange.push({ delta: midisong.changes[i].ms - ms, bmp: midisong.changes[i].bpm });
					}
				}
			}
			if (tempoChange.length) {
				tempo = tempoChange[tempoChange.length - 1].bmp;
				tempoRatio = 4 * 60 / tempo;
				var measureDuration2 = 1000 * tempoRatio * count / division;
				for (var i = 0; i < midisong.signs.length; i++) {
					if (midisong.signs[i].ms >= ms && midisong.signs[i].ms < ms + measureDuration2) {
						sign = midisong.signs[i].sign;
					}
				}
				timeline.push({
					bpm: tempo
					, c: count
					, d: division
					, split: ms + tempoChange[0].delta
					, s: sign
					, ms: ms
					, len: measureDuration2
				});
				ms = ms + measureDuration2;
			} else {
				measureDuration = 1000 * tempoRatio * count / division;
				for (var i = 0; i < midisong.signs.length; i++) {
					if (midisong.signs[i].ms >= ms && midisong.signs[i].ms < ms + measureDuration) {
						sign = midisong.signs[i].sign;
					}
				}
				timeline.push({
					bpm: tempo, c: count
					, d: division, split: 0, s: sign, ms: ms, len: measureDuration
				});
				ms = ms + measureDuration;
			}
			//meterIdx++;
		}
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
		var testEcho: ZvoogPlugin = new WAFEcho();
		var testGain: ZvoogPlugin = new ZvoogFxGain();
		var testEQ: ZvoogPlugin = new WAFEqualizer();
		var wafdrum: ZvoogPlugin = new WAFPercSource();
		var wafinstrument = new WAFInsSource();
		schedule.filters.push({
			filterPlugin: null
			, parameters: this.parametersDefs(testEcho)
			, kind: "echo"
			, initial: ""
		});
		schedule.filters.push({
			filterPlugin: null
			, parameters: this.parametersDefs(testGain)
			, kind: "gain"
			, initial: ""
		});
		for (var i = 0; i < timeline.length; i++) {
			schedule.measures.push({
				meter: { count: Math.round(timeline[i].c), division: Math.round(timeline[i].d) }
				, tempo: Math.round(timeline[i].bpm / 5) * 5
				, points: []
			});
		}
		for (let i = 0; i < midisong.lyrics.length; i++) {
			//console.log(midisong.lyrics[i]);
			let lyricsPiece = midisong.lyrics[i];
			for (var tc = 0; tc < timeline.length; tc++) {
				if (Math.round(lyricsPiece.ms) < Math.round(timeline[tc].ms)) {
					var timelineMeasure = timeline[tc - 1];
					var skipInMeasureMs = lyricsPiece.ms - timelineMeasure.ms;
					var skipMeter: ZvoogMeter = seconds2meter32(skipInMeasureMs / 1000, timelineMeasure.bpm);
					skipMeter = DUU(skipMeter).simplify();
					var point: ZvoogMeasurePoint = {
						when: skipMeter
						, lyrics: lyricsPiece.txt
					}
					schedule.measures[tc - 1].points.push(point);
					//console.log(tc,skipMeter,lyricsPiece);
					break;
				}
			}
		}
		for (let i = 0; i < midisong.miditracks.length; i++) {
			/*var trackTictle: string = '';
			if (midisong.miditracks[i].title) {
				trackTictle = midisong.miditracks[i].title;
				if (midisong.miditracks[i].instrument) {
					trackTictle = midisong.miditracks[i].title + ': ' + midisong.miditracks[i].instrument;
				}
			} else {
				if (midisong.miditracks[i].instrument) {
					trackTictle = midisong.miditracks[i].instrument;
				} else {
					trackTictle = 'track ' + i;
				}
			}*/
			let track: ZvoogTrack = {
				title: '' + i
				, instruments: [], percussions: []
				, filters: [{
					filterPlugin: null
					, parameters: this.parametersDefs(testGain)
					, kind: "gain"
					, initial: ""
				}]
			};
			schedule.tracks.push(track);
			let firstChannelNum = 0;
			for (let ch = 0; ch < midisong.miditracks[i].songchords.length; ch++) {
				firstChannelNum = midisong.miditracks[i].songchords[ch].channel;
				break;
			}
			if (firstChannelNum == 9) {
				track.filters.push({
					filterPlugin: null
					, parameters: this.parametersDefs(testEQ)
					, kind: "equalizer"
					, initial: ""
				});
				let drumNums: number[] = [];
				for (let ch = 0; ch < midisong.miditracks[i].songchords.length; ch++) {
					var midichord: MIDISongChord = midisong.miditracks[i].songchords[ch];
					for (let nn = 0; nn < midichord.notes.length; nn++) {
						let pinum: number = midichord.notes[nn].points[0].pitch;
						let idx = drumNums.indexOf(pinum);
						let voice: ZvoogPercussionVoice;
						//console.log(idx,pinum);
						if (idx < 0) {
							drumNums.push(pinum);
							voice = {
								measureBunches: []
								, percussionSetting: {
									percussionPlugin: null
									, parameters: this.parametersDefs(wafdrum)
									, kind: 'wafdrum'
									, initial: '' + pinum
								}
								, filters: [{
									filterPlugin: null
									, parameters: this.parametersDefs(testGain)
									, kind: "gain"
									, initial: ""
								}]
								, title: '' + pinum + ' ' + findrumTitles(pinum)
							};
							track.percussions.push(voice);
							track.title = 'Drums';
							for (let mc = 0; mc < timeline.length; mc++) {
								voice.measureBunches.push({ bunches: [] });
							}
							//console.log(voice.title);
						} else {
							voice = track.percussions[idx];
						}
						for (var tc = 0; tc < timeline.length; tc++) {
							if (Math.round(midichord.when) < Math.round(timeline[tc].ms)) {
								var timelineMeasure = timeline[tc - 1];
								var skipInMeasureMs = midichord.when - timelineMeasure.ms;
								var skipMeter: ZvoogMeter = seconds2meter32(skipInMeasureMs / 1000, timelineMeasure.bpm);
								skipMeter = DUU(skipMeter).simplify();
								let onehit: ZvoogChordPoint = {
									when: skipMeter
								}
								voice.measureBunches[tc - 1].bunches.push(onehit);
								break;
							}
						}

						//if (drumNums.indexOf(pinum) < 0) {
						/*drumNums.push(pinum);
						let voice: ZvoogPercussionVoice = {
							measureBunches: []
							, percussionSetting: {
								percussionPlugin: null
								, parameters: this.parametersDefs(wafdrum)
								, kind: 'wafdrum'
								, initial: '' + pinum
							}
							, filters: [{
								filterPlugin: null
								, parameters: this.parametersDefs(testGain)
								, kind: "gain"
								, initial: ""
							}]
							, title: '' + pinum + ' ' + findrumTitles(pinum)
						};
						track.percussions.push(voice);
						track.title = '' + pinum + ': Drums';*/
						/*for (var mc = 0; mc < timeline.length; mc++) {
							voice.measureBunches.push({ bunches: [] });
						}*/
						/*for (var chn = 0; chn < midisong.miditracks[i].songchords.length; chn++) {
							var midichord: MIDISongChord = midisong.miditracks[i].songchords[chn];
							for (var tc = 0; tc < timeline.length; tc++) {
								if (Math.round(midichord.when) < Math.round(timeline[tc].ms)) {
									var timelineMeasure = timeline[tc - 1];
									var skipInMeasureMs = midichord.when - timelineMeasure.ms;
									var skipMeter: ZvoogMeter = seconds2meter32(skipInMeasureMs / 1000, timelineMeasure.bpm);
									skipMeter = DUU(skipMeter).simplify();
									let onehit: ZvoogChordPoint = {
										when: skipMeter
									}
									voice.measureBunches[tc - 1].bunches.push(onehit);
									break;
								}
							}
						}*/
						//}
					}
				}
				//console.log(i, firstChannelNum, drumNums);
			} else {
				let voice: ZvoogInstrumentVoice = {
					measureChords: []
					, instrumentSetting: {
						instrumentPlugin: null
						, parameters: this.parametersDefs(wafinstrument)
						, kind: 'wafinstrument'
						, initial: '' + midisong.miditracks[i].program
					}
					, filters: [{
						filterPlugin: null
						, parameters: this.parametersDefs(testGain)
						, kind: "gain"
						, initial: ""
					}, {
						filterPlugin: null
						, parameters: this.parametersDefs(testEQ)
						, kind: "equalizer"
						, initial: ""
					}]
					, title: instrumentTitles()[midisong.miditracks[i].program]
				};
				track.instruments.push(voice);
				track.title = '' + midisong.miditracks[i].program + ': ' + voice.title;
				for (var mc = 0; mc < timeline.length; mc++) {
					voice.measureChords.push({ chords: [] });
				}
				for (var chn = 0; chn < midisong.miditracks[i].songchords.length; chn++) {
					var midichord: MIDISongChord = midisong.miditracks[i].songchords[chn];
					for (var tc = 0; tc < timeline.length; tc++) {
						if (Math.round(midichord.when) < Math.round(timeline[tc].ms)) {
							var timelineMeasure = timeline[tc - 1];
							var skipInMeasureMs = midichord.when - timelineMeasure.ms;
							var skipMeter: ZvoogMeter = seconds2meter32(skipInMeasureMs / 1000, timelineMeasure.bpm);
							//console.log(i,tc,skipInMeasureMs,skipMeter,DUU(skipMeter).simplify());
							skipMeter = DUU(skipMeter).simplify();
							var onechord: ZvoogChordStrings = {
								when: skipMeter
								, envelopes: []
								, variation: 0
							}
							for (var nx = 0; nx < midichord.notes.length; nx++) {
								var env: ZvoogEnvelope = { pitches: [] };
								var mino: MIDISongNote = midichord.notes[nx];
								for (var px = 0; px < mino.points.length; px++) {
									var mipoint: MIDISongPoint = mino.points[px];
									env.pitches.push({
										duration: DUU(seconds2meter32(mipoint.durationms / 1000, timelineMeasure.bpm)).simplify()
										, pitch: mipoint.pitch - midiInstrumentPitchShift
									});
								}
								onechord.envelopes.push(env);
							}
							voice.measureChords[tc - 1].chords.push(onechord);
							break;
						}
					}
				}
			}
		}
		console.log(schedule);
		return schedule;
	}
	findOrCreateTrack(trackNum: number, channelNum: number, trackChannel: { trackNum: number, channelNum: number, track: MIDISongTrack }[]): { trackNum: number, channelNum: number, track: MIDISongTrack } {
		for (let i = 0; i < trackChannel.length; i++) {
			if (trackChannel[i].trackNum == trackNum && trackChannel[i].channelNum == channelNum) {
				return trackChannel[i];
			}
		}
		let it: { trackNum: number, channelNum: number, track: MIDISongTrack } = {
			trackNum: trackNum, channelNum: channelNum, track: {
				order: 0
				, title: 'unknown'
				, instrument: '0'
				, volumes: []
				, program: 0
				, songchords: []
			}
		};
		trackChannel.push(it);
		return it;
	}
	dump(): MIDISongData {
		var a: MIDISongData = {
			parser: '1.01'
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
		let trackChannel: { trackNum: number, channelNum: number, track: MIDISongTrack }[] = [];
		for (let i = 0; i < this.parsedTracks.length; i++) {
			let parsedtrack: MIDIFileTrack = this.parsedTracks[i];
			for (let k = 0; k < parsedtrack.programChannel.length; k++) {
				this.findOrCreateTrack(i, parsedtrack.programChannel[k].channel, trackChannel);
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
					var newnote: MIDISongNote = { points: [] };
					newchord.notes.push(newnote);
					for (var v = 0; v < midinote.points.length; v++) {
						var midipoint: NotePitch = midinote.points[v];
						var newpoint: MIDISongPoint = { pitch: midipoint.pitch, durationms: midipoint.pointDuration };
						newnote.points.push(newpoint);
					}
				}
				let chanTrack = this.findOrCreateTrack(i, newchord.channel, trackChannel);
				chanTrack.track.songchords.push(newchord);
			}
			for (let i = 0; i < trackChannel.length; i++) {
				if (trackChannel[i].trackNum == i) {
					trackChannel[i].track.title = miditrack.title ? miditrack.title : '';
					trackChannel[i].track.volumes = miditrack.volumes;
					trackChannel[i].track.instrument = miditrack.instrument ? miditrack.instrument : ''
				}
			}
		}
		for (let tt = 0; tt < trackChannel.length; tt++) {
			let trackChan = trackChannel[tt];
			if (trackChan.track.songchords.length > 0) {
				a.miditracks.push(trackChannel[tt].track);
				if (a.duration < maxWhen) {
					a.duration = 54321 + maxWhen;
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
		return a;
	}
}


