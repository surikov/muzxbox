//http://midi.teragonaudio.com/tech/midispec.htm

type ImportMeasure = MZXBX_SongMeasure & {
	startMs: number;
	durationMs: number;
};



let drumNames: string[] = [];
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
let insNames: string[] = [];
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
	, openEvent?: MIDIEvent
	, closeEvent?: MIDIEvent
	, volume?: number
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
	, preTimeMs?: number
	, deltaTimeMs?: number
	, trackNum?: number
	, text?: string
}
type MIDISongPoint = {
	pitch: number;
	durationms: number;
	midipoint?: TrackNote;
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
	//instrument: string;
	channelNum: number;
	program: number;
	trackVolumes: { ms: number, value: number, meausre?: number, skip384?: number }[];
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

}
class MIDIFileTrack {
	//nn:number
	datas: DataView;
	HDR_LENGTH: number = 8;
	trackLength: number;
	trackContent: DataView;
	trackevents: MIDIEvent[];
	trackTitle: string;
	instrumentName: string;
	programChannel: { program: number, channel: number }[];
	trackVolumePoints: { ms: number, value: number, channel: number }[];
	chords: TrackChord[] = [];
	constructor(buffer: ArrayBuffer, start: number) {
		this.datas = new DataView(buffer, start, this.HDR_LENGTH);
		this.trackLength = this.datas.getUint32(4);
		this.datas = new DataView(buffer, start, this.HDR_LENGTH + this.trackLength);
		this.trackContent = new DataView(this.datas.buffer, this.datas.byteOffset + this.HDR_LENGTH, this.datas.byteLength - this.HDR_LENGTH);
		this.trackevents = [];
		this.trackVolumePoints = [];
		this.programChannel = [];
	}
}
function utf8ArrayToString(aBytes) {
	var sView = "";

	for (var nPart, nLen = aBytes.length, nIdx = 0; nIdx < nLen; nIdx++) {
		nPart = aBytes[nIdx];

		sView =sView+ String.fromCharCode(
			nPart > 251 && nPart < 254 && nIdx + 5 < nLen ? /* six bytes */
				/* (nPart - 252 << 30) may be not so safe in ECMAScript! So...: */
				(nPart - 252) * 1073741824 + (aBytes[++nIdx] - 128 << 24) + (aBytes[++nIdx] - 128 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
				: nPart > 247 && nPart < 252 && nIdx + 4 < nLen ? /* five bytes */
					(nPart - 248 << 24) + (aBytes[++nIdx] - 128 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
					: nPart > 239 && nPart < 248 && nIdx + 3 < nLen ? /* four bytes */
						(nPart - 240 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
						: nPart > 223 && nPart < 240 && nIdx + 2 < nLen ? /* three bytes */
							(nPart - 224 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
							: nPart > 191 && nPart < 224 && nIdx + 1 < nLen ? /* two bytes */
								(nPart - 192 << 6) + aBytes[++nIdx] - 128
								: /* nPart < 127 ? */ /* one byte */
								nPart
		);
	}

	return sView;
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
		this.simplifyAllPaths();
	}
	toText(arr: number[]): string {
		let txt = '';
		try {
			let win1251decoder = new TextDecoder("windows-1251");
			let bytes = new Uint8Array(arr);
			txt = win1251decoder.decode(bytes);
		} catch (xx) {
			console.log(xx);
			var rr: string = '';
			for (var ii = 0; ii < arr.length; ii++) {
				rr = rr + String.fromCharCode(arr[ii]);
			}
			txt = rr;
		}
		let at = txt;

		/*
				var rr: string = '';
				for (var ii = 0; ii < arr.length; ii++) {
					rr = rr + String.fromCharCode(arr[ii]);
				}
				let win1251decoder = new TextDecoder("windows-1251");
				let bytes = new Uint8Array(arr);
				txt = win1251decoder.decode(bytes);
				*/
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
		//txt=txt.trim();
		//console.log('toText',  txt);
		//console.log('toText',  at,txt);
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
	simplifyAllPaths() {
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
									var duration = 0;
									for (var i = 0; i < chpi.note.points.length - 1; i++) {
										duration = duration + chpi.note.points[i].pointDuration;
									}
									chpi.note.points[chpi.note.points.length - 1].pointDuration = when - chpi.chord.when - duration;
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
								/*if (evnt.subtype == this.EVENT_MIDI_PITCH_BEND) {
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
									}*/
								if (evnt.subtype == this.EVENT_MIDI_PITCH_BEND) {
									//this.addSlide(evnt, song, pitchBendRange[events[i].channel]);
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
												let idx: number = evnt.midiChannel ? evnt.midiChannel : 0;
												var firstpitch: number = note.points[0].pitch + pitchBendRange[idx];
												//var firstpitch: number = note.points[0].pitch + b14;
												var point: NotePitch = {
													pointDuration: -1
													, pitch: firstpitch
												};
												note.points.push(point);
											}
										}
									}

									/*
									//var pitch = evnt.param1 ? evnt.param1 : 0;
									var nn1: number = evnt.param1 ? evnt.param1 : 0;
									var nn2: number = evnt.param2 ? evnt.param2 : 0;
									nn1 = nn1 & 0b01111111;
									nn2 = nn2 & 0b01111111;
									nn2 = nn2 << 7;
									var nn14: number = nn2 | nn1;
									nn14 = (nn14 - 0x2000) / 1000;


									var slide = ((evnt.param2 ? evnt.param2 : 0) - 64) / 6;
									var b14 = evnt.param2 ? evnt.param2 : 0;
									b14 <<= 7;
									b14 |= evnt.param1 ? evnt.param1 : 0;
									b14 = (b14 - 0x2000) / 1000;

									//console.log('EVENT_MIDI_PITCH_BEND', evnt.param1, evnt.param2, ':', nn14, b14, '/', slide, evnt);
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
												var firstpitch: number = note.points[0].pitch + nn14;
												//var firstpitch: number = note.points[0].pitch + b14;
												var point: NotePitch = {
													pointDuration: -1
													, pitch: firstpitch
												};
												note.points.push(point);
											}
										}
									}
								    
									*/
								} else {
									if (evnt.subtype == this.EVENT_MIDI_CONTROLLER) {


										/*
										if (evnt.subtype == this.EVENT_MIDI_CONTROLLER && evnt.param1 == this.controller_coarseVolume) {
											var v = evnt.param2 ? evnt.param2 / 127 : 0;
											let point = { ms: evnt.playTimeMs, value: v, channel: evnt.midiChannel ? evnt.midiChannel : 0, track: t };
											singleParsedTrack.trackVolumePoints.push(point);
											//if(point.channel==9){
											//    console.log('trackVolumePoints',singleParsedTrack.title, point);
											//}
										} else {
											if (evnt.subtype == this.EVENT_MIDI_CONTROLLER
												&& (evnt.param1 == this.controller_coarseDataEntrySlider
													|| evnt.param1 == this.controller_fineDataEntrySlider
													|| evnt.param1 == this.controller_coarseRPN
													|| evnt.param1 == this.controller_fineRPN
												)
											) {
												console.log('EVENT_MIDI_CONTROLLER', evnt.param1, evnt.param2, evnt);
											}
										}
										*/
										if (evnt.param1 == this.controller_coarseVolume) {
											var v = evnt.param2 ? evnt.param2 / 127 : 0;
											let point = { ms: evnt.playTimeMs, value: v, channel: evnt.midiChannel ? evnt.midiChannel : 0, track: t };
											singleParsedTrack.trackVolumePoints.push(point);
										} else {
											if (
												/*(expectedPitchBendRangeMessageNumber == 1 && evnt.param1 == 0x65 && evnt.param2 == 0x00) ||
												(expectedPitchBendRangeMessageNumber == 2 && evnt.param1 == 0x64 && evnt.param2 == 0x00) ||
												(expectedPitchBendRangeMessageNumber == 3 && evnt.param1 == 0x06) ||
												(expectedPitchBendRangeMessageNumber == 4 && evnt.param1 == 0x26)*/
												(expectedPitchBendRangeMessageNumber == 1 && evnt.param1 == this.controller_coarseRPN && evnt.param2 == 0x00) ||
												(expectedPitchBendRangeMessageNumber == 2 && evnt.param1 == this.controller_fineRPN && evnt.param2 == 0x00) ||
												(expectedPitchBendRangeMessageNumber == 3 && evnt.param1 == this.controller_coarseDataEntrySlider) ||
												(expectedPitchBendRangeMessageNumber == 4 && evnt.param1 == this.controller_fineDataEntrySlider)
											) {
												if (expectedPitchBendRangeMessageNumber > 1 && evnt.midiChannel != expectedPitchBendRangeChannel) {
													//throw Error('Unexpected channel number in non-first pitch-bend RANGE (SENSITIVITY) message. MIDI file might be corrupt.');
													console.log('Unexpected channel number in non-first pitch-bend RANGE (SENSITIVITY) message. MIDI file might be corrupt.');
												}
												expectedPitchBendRangeChannel = evnt.midiChannel;
												let idx: number = evnt.midiChannel ? evnt.midiChannel : 0;
												if (expectedPitchBendRangeMessageNumber == 3) {
													pitchBendRange[idx] = evnt.param2; // in semitones
													//console.log('pitchBendRange', pitchBendRange);
												}
												if (expectedPitchBendRangeMessageNumber == 4) {
													let pp = evnt.param2 ? evnt.param2 : 0;
													pitchBendRange[idx] = pitchBendRange[idx] + pp / 100; // convert cents to semitones, add to semitones set in the previous MIDI message
													//console.log('pitchBendRange', pitchBendRange);
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
					if (evnt.subtype == this.EVENT_META_COPYRIGHT_NOTICE) {
						this.header.lyrics.push({ track: t, ms: evnt.playTimeMs ? evnt.playTimeMs : 0, txt: 'Copyright: ' + (evnt.text ? evnt.text : "") });
					}
					if (evnt.subtype == this.EVENT_META_TRACK_NAME) {
						//singleParsedTrack.title = this.toText(evnt.data ? evnt.data : []);
						singleParsedTrack.trackTitle = evnt.text ? evnt.text : '';
					}
					if (evnt.subtype == this.EVENT_META_INSTRUMENT_NAME) {
						//singleParsedTrack.instrument = this.toText(evnt.data ? evnt.data : []);
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

						//console.log('EVENT_META_KEY_SIGNATURE',this.header.keyFlatSharp,this.header.keyMajMin);

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
						//console.log('EVENT_META_TIME_SIGNATURE', evnt.param1, '2"',evnt.param2, 'metronome',evnt.param3, evnt.param4);
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
		//console.log('create',it,'from',parsedtrack);
		return it;
	}
	dump(): MZXBX_Schedule {
		console.log('MidiParser', this);
		let midiSongData: MIDISongData = {
			parser: '1.11'
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
					var newnote: MIDISongNote = { points: [] };
					newchord.notes.push(newnote);
					for (var v = 0; v < midinote.points.length; v++) {
						var midipoint: NotePitch = midinote.points[v];
						var newpoint: MIDISongPoint = { pitch: midipoint.pitch, durationms: midipoint.pointDuration };
						newpoint.midipoint = midinote;
						newnote.points.push(newpoint);
					}
					newnote.points[newnote.points.length - 1].durationms
						= newnote.points[newnote.points.length - 1].durationms + 66;
				}
				let chanTrack = this.findOrCreateTrack(miditrack, i, newchord.channel, tracksChannels);
				chanTrack.track.songchords.push(newchord);
			}
			//for (let i = 0; i < trackChannel.length; i++) {
			//if (trackChannel[i].trackNum == i) {
			//trackChannel[i].track.title = miditrack.title ? miditrack.title : '';
			//trackChannel[i].track.volumes = miditrack.volumes;
			//trackChannel[i].track.instrument = miditrack.instrument ? miditrack.instrument : ''
			//}
			//}
		}
		for (let tt = 0; tt < tracksChannels.length; tt++) {
			let trackChan = tracksChannels[tt];
			if (trackChan.track.songchords.length > 0) {
				midiSongData.miditracks.push(tracksChannels[tt].track);
				if (midiSongData.duration < maxWhen) {
					midiSongData.duration = 654321 + maxWhen;
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
		console.log('MIDISongData', midiSongData);
		let schedule: MZXBX_Schedule = {
			series: []
			, channels: []
			, filters: [
				//{ id: 'compressor1', kind: 'dynamic_compression', properties: '' }
				//,{ id: 'masterEcho111', kind: 'echo_filter_1_test', properties: '0.3' }
			]
		};
		let volumeCashe = new LastKeyVal();
		for (let mt = 0; mt < midiSongData.miditracks.length; mt++) {
			let miditrack = midiSongData.miditracks[mt];
			let midinum = 1 + Math.round(miditrack.program);
			//if (midinum < 1) midinum = 1;
			//if (midinum > 128) midinum = 128;
			//let set: MZXBX_Channel[] = [];
			/*let channel: MZXBX_Channel = {
				id: 'channel' + mt// + ': ' + miditrack.title
				, comment: miditrack.title
				, filters: []
				, performer: {
					id: 'channel' + mt + 'performer'
					, kind: 'waf_performer_1_test'
					, properties: ''+midinum
				}
			};
			if(mt==9){
				channel.performer.kind='drums_performer_1_test';
			}*/
			for (let ch = 0; ch < miditrack.songchords.length; ch++) {
				let chord = miditrack.songchords[ch];
				for (let nn = 0; nn < chord.notes.length; nn++) {
					let note: MIDISongNote = chord.notes[nn];
					let timeIndex = Math.floor(chord.when / 1000.0);
					let channelId: string = 'voice' + mt;
					let tID = 'voice' + mt + 'subVolume';
					if (miditrack.channelNum == 9) {
						channelId = 'drum' + mt + '.' + note.points[0].pitch;
						tID = 'drum' + mt + '.' + note.points[0].pitch + 'subVolume';
					}
					let timeSkip = chord.when / 1000 - timeIndex;
					if (timeSkip < 0) timeSkip = 0;
					let item: MZXBX_PlayItem = {
						skip: timeSkip//(Math.round(chord.when) % 1000.0) / 1000.0
						, channelId: channelId//channel.id
						, pitch: note.points[0].pitch
						, slides: []
					};
					item.slides.push({ duration: note.points[0].durationms / 1000, delta: 0 });
					if (miditrack.channelNum == 9) {
						//item.slides.push({ duration: note.points[0].durationms / 1000, delta: 0 });
					} else {
						if (note.points.length > 1) {
							for (let pp = 0; pp < note.points.length - 1; pp++) {
								item.slides.push({
									duration: note.points[pp].durationms / 1000
									, delta: note.points[pp + 1].pitch - item.pitch
								});
							}
							item.slides.push({
								duration: note.points[note.points.length - 1].durationms / 1000
								, delta: note.points[note.points.length - 1].pitch - item.pitch
							});
							//console.log(note, item);
						} /*else {
							item.slides.push({ duration: note.points[0].durationms / 1000, delta: 0 });
						}*/
					}
					if (note.points[0].midipoint) {
						if (note.points[0].midipoint.volume) {
							let volVal: number = Math.round(100 * note.points[0].midipoint.volume / 127);
							let lastVol = volumeCashe.take(tID);
							if (lastVol.value == volVal) {
								//
							} else {
								lastVol.value = volVal;
								let newVol = '' + volVal + '%';
								//console.log(tID, newVol, (timeIndex + '.' + item.skip));

								for (let ii = 0; ii <= timeIndex; ii++) {
									if (!(schedule.series[ii])) {
										schedule.series[ii] = { duration: 1, items: [], states: [] };
									}
								}
								schedule.series[timeIndex].states.push({
									skip: item.skip
									, filterId: tID
									, data: newVol
								});
							}
						}
					}
					/*if (note.points.length > 1) {
						console.log(note);

					} else {
						item.slides.push({ duration: note.points[0].durationms / 1000, delta: 0 });
					}*/
					for (let ii = 0; ii <= timeIndex; ii++) {
						if (!(schedule.series[ii])) {
							schedule.series[ii] = { duration: 1, items: [], states: [] };
						}
					}
					schedule.series[timeIndex].items.push(item);
					let exsts = false;
					for (let ch = 0; ch < schedule.channels.length; ch++) {
						if (schedule.channels[ch].id == channelId) {
							exsts = true;
							break;
						}
					}
					if (!exsts) {
						if (miditrack.channelNum == 9) {
							let drumNum = note.points[0].pitch;
							let performerKind = 'drums_performer_1_test';
							if (drumNum < 35 || drumNum > 81) {
								performerKind = 'emptySilent';
							}
							let volumeID = 'drum' + mt + '.' + drumNum + 'volume';
							let tID = 'drum' + mt + '.' + drumNum + 'subVolume';
							let comment = miditrack.title + ' [' + drumNum + ': ' + drumNames[drumNum] + ': drums]';
							schedule.channels.push({
								id: channelId, comment: comment, filters: [
									{ id: volumeID, kind: 'volume_filter_1_test', properties: '100%' }
									, { id: tID, kind: 'volume_filter_1_test', properties: '100%' }
								]
								, performer: { id: 'drum' + mt + '.' + drumNum + 'performer', kind: performerKind, properties: '' + drumNum }
							});
							for (let vv = 0; vv < miditrack.trackVolumes.length; vv++) {
								let setIndex = Math.floor(miditrack.trackVolumes[vv].ms / 1000.0);
								for (let ii = 0; ii <= setIndex; ii++) {
									if (!(schedule.series[ii])) {
										schedule.series[ii] = { duration: 1, items: [], states: [] };
									}
								}
								schedule.series[setIndex].states.push({
									skip: (Math.round(miditrack.trackVolumes[vv].ms) % 1000.0) / 1000.0
									, filterId: volumeID
									, data: '' + Math.round(100 * miditrack.trackVolumes[vv].value) + '%'
								});
							}
						} else {
							let performerKind = 'waf_performer_1_test';
							if (midinum < 1 || midinum > 128) {
								performerKind = 'emptySilent';
							}
							let volumeID = 'voice' + mt + 'volume';
							let tID = 'voice' + mt + 'subVolume';
							let comment = miditrack.title + ' [' + midinum + ': ' + insNames[midinum - 1] + ']';
							schedule.channels.push({
								id: channelId, comment: comment, filters: [
									{ id: volumeID, kind: 'volume_filter_1_test', properties: '100%' }
									, { id: tID, kind: 'volume_filter_1_test', properties: '100%' }
								]
								, performer: { id: 'voice' + mt + 'performer', kind: performerKind, properties: '' + midinum }
							});
							for (let vv = 0; vv < miditrack.trackVolumes.length; vv++) {
								let setIndex = Math.floor(miditrack.trackVolumes[vv].ms / 1000.0);
								for (let ii = 0; ii <= setIndex; ii++) {
									if (!(schedule.series[ii])) {
										schedule.series[ii] = { duration: 1, items: [], states: [] };
									}
								}
								schedule.series[setIndex].states.push({
									skip: (Math.round(miditrack.trackVolumes[vv].ms) % 1000.0) / 1000.0
									, filterId: volumeID
									, data: '' + Math.round(100 * miditrack.trackVolumes[vv].value) + '%'
								});
							}
						}
					}
				}
			}

			//schedule.channels.push(channel);
		}
		//console.log(volumeCashe);
		//console.log('schedule', schedule);
		return schedule;//midiSongData;
	}
	findLastMeter(midiSongData: MIDISongData, beforeMs: number, barIdx: number): MZXBX_Metre {
		let metre: MZXBX_Metre = {
			count: midiSongData.meter.count
			, part: midiSongData.meter.division
		};
		//let preBPM = this.findLastChange(midiSongData, beforeMs).bpm;
		let midimeter: { track: number, ms: number, count: number, division: number } = { track: 0, ms: 0, count: 4, division: 4 };
		for (let mi = 0; mi < midiSongData.meters.length; mi++) {
			//if (midiSongData.meters[mi].ms > beforeMs + 1){//barIdx * 3) {
			if (midiSongData.meters[mi].ms > beforeMs + 1 + barIdx * 3) {
				//console.log();
				break;
			}
			midimeter = midiSongData.meters[mi];
			//metre.count = midiSongData.meters[mi].count;
			//metre.part = midiSongData.meters[mi].division;
		}
		metre.count = midimeter.count;
		metre.part = midimeter.division;
		//console.log(midimeter);
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
	calcMeasureDuration(midiSongData: MIDISongData, meter: MZXBX_Metre, bpm: number, part: number, startMs: number): number {
		let metreMath = new MZXBX_MetreMath();
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
		let meter: MZXBX_Metre = this.findLastMeter(midiSongData, fromMs, barIdx);
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

	createTimeLine(midiSongData: MIDISongData): MZXBX_SongMeasure[] {
		let count = 0;
		let part = 0;
		let bpm = 0;

		let timeline: MZXBX_SongMeasure[] = [];
		let fromMs = 0;
		while (fromMs < midiSongData.duration) {
			let measure: ImportMeasure = this.createMeasure(midiSongData, fromMs, timeline.length);
			fromMs = fromMs + measure.durationMs;
			/*
						let ms2 = 0;
						let metreMath = new MZXBX_MetreMath();
						for (let ii = 0; ii < timeline.length; ii++) {
							ms2 = ms2 + 1000 * metreMath.set({ count: timeline[ii].metre.count, part: timeline[ii].metre.part }).duration(timeline[ii].tempo);
						}*/

			if (count != measure.metre.count || part != measure.metre.part || bpm != measure.tempo) {
				console.log(timeline.length, measure.startMs, measure.tempo, '' + measure.metre.count + '/' + measure.metre.part);
				count = measure.metre.count;
				part = measure.metre.part;
				bpm = measure.tempo;
			} else {
				console.log(timeline.length, measure.startMs);
			}
			timeline.push(measure);
		}
		return timeline;
	}
	convertProject(title: string, comment: string): MZXBX_Project {
		console.log('MidiParser.convertProject', this);
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
					var newnote: MIDISongNote = { points: [] };
					newchord.notes.push(newnote);
					for (var v = 0; v < midinote.points.length; v++) {
						var midipoint: NotePitch = midinote.points[v];
						var newpoint: MIDISongPoint = { pitch: midipoint.pitch, durationms: midipoint.pointDuration };
						newpoint.midipoint = midinote;
						newnote.points.push(newpoint);
					}
					newnote.points[newnote.points.length - 1].durationms = newnote.points[newnote.points.length - 1].durationms + 66;
				}
				let chanTrack = this.findOrCreateTrack(miditrack, i, newchord.channel, tracksChannels);
				chanTrack.track.songchords.push(newchord);
			}
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

		//let metreMath = new MZXBX_MetreMath();


		let newtimeline: MZXBX_SongMeasure[] = this.createTimeLine(midiSongData);

		console.log('midiSongData', midiSongData
			//, 1000 * metreMath.set(curMeter).duration(132)
			//, 1000 * metreMath.set(curMeter).duration(134)
		);

		let project: MZXBX_Project = {
			title: title + ' ' + comment
			, timeline: newtimeline
			, tracks: []
			, percussions: []
			, filters: []
			, comments: []
		};

		for (let ii = 0; ii < project.timeline.length; ii++) {
			project.comments.push({ texts: [] });
		}
		for (let ii = 0; ii < midiSongData.lyrics.length; ii++) {
			let textpoint = midiSongData.lyrics[ii];
			//let measure=MZXBX_SongMeasure
			let pnt = findMeasureSkipByTime(textpoint.ms / 1000, project.timeline);
			if (pnt) {
				//console.log(textpoint.ms, pnt.idx, pnt.skip.count, pnt.skip.part, textpoint.txt);
				project.comments[pnt.idx].texts.push({ skip: { count: pnt.skip.count, part: pnt.skip.part }, text: textpoint.txt });
			}
		}
		for (var ii = 0; ii < midiSongData.miditracks.length; ii++) {
			let midiTrack: MIDISongTrack = midiSongData.miditracks[ii];
			if (midiTrack.channelNum == 9) {
				let drums = this.collectDrums(midiTrack);
				for (let dd = 0; dd < drums.length; dd++) {
					project.percussions.push(this.createProjectDrums(drums[dd], project.timeline, midiTrack));
				}
			} else {
				project.tracks.push(this.createProjectTrack(project.timeline, midiTrack));
			}
		}

		console.log('project', project);
		return project;
	}
	collectDrums(midiTrack: MIDISongTrack): number[] {
		let drums: number[] = [];
		for (let ii = 0; ii < midiTrack.songchords.length; ii++) {
			let chord = midiTrack.songchords[ii];
			for (let kk = 0; kk < chord.notes.length; kk++) {
				let note = chord.notes[kk];
				for (let pp = 0; pp < note.points.length; pp++) {
					let pitch = note.points[pp].pitch;
					if (drums.indexOf(pitch) < 0) {
						drums.push(pitch);
					}
				}
			}
		}
		return drums;
	}
	numratio(nn: number): number {
		let rr = 1;//0000;
		return Math.round(nn * rr);
	}
	stripDuration(what: MZXBX_MetreMath): MZXBX_MetreMath {
		/*if (what.less({ count: 1, part: 16 })) {
			what = what.strip(32);
		} else {
			what = what.strip(16);
		}*/
		//what = what.strip(32);
		return what;
	}
	createProjectTrack(timeline: MZXBX_SongMeasure[], midiTrack: MIDISongTrack): MZXBX_MusicTrack {
		let projectTrack: MZXBX_MusicTrack = {
			title: midiTrack.title + ' [' + midiTrack.program + '] ' + insNames[midiTrack.program]
			, measures: []
			, filters: []
			, performer: { id: '', data: '' }
		};
		//let currentMeasureStart = 0;
		let mm = new MZXBX_MetreMath();
		for (let tt = 0; tt < timeline.length; tt++) {
			let projectMeasure: MZXBX_TrackMeasure = { chords: [] };
			projectTrack.measures.push(projectMeasure);
			let nextMeasure = timeline[tt];
			//let measureDurationMs = 1000.0 * mm.set(nextMeasure.metre).duration(nextMeasure.tempo);
			for (let ii = 0; ii < midiTrack.songchords.length; ii++) {
				let midiChord = midiTrack.songchords[ii];
				if (
					this.numratio(midiChord.when) >= (nextMeasure as any).startMs //this.numratio(currentMeasureStart) - 33
					&& this.numratio(midiChord.when) < (nextMeasure as any).startMs + (nextMeasure as any).durationMs //this.numratio(currentMeasureStart + measureDurationMs) - 33
				) {
					let trackChord: MZXBX_Chord | null = null;
					//let skip = mm.calculate((midiChord.when - currentMeasureStart) / 1000.0, nextMeasure.tempo).strip(32);
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
						trackChord = { skip: skip, notes: [] };
						projectMeasure.chords.push(trackChord);
					}
					if (trackChord) {
						for (let nn = 0; nn < midiChord.notes.length; nn++) {
							let midiNote: MIDISongNote = midiChord.notes[nn];
							let startPitch = midiNote.points[0].pitch;
							let startDuration = mm.calculate((midiNote.points[0].durationms - 66) / 1000.0, nextMeasure.tempo).strip(32);
							let curSlide: MZXBX_Slide = {
								duration: this.stripDuration(startDuration)
								, delta: 0
							};
							let trackNote: MZXBX_Note = { pitch: startPitch, slides: [curSlide] };
							for (let pp = 1; pp < midiNote.points.length; pp++) {
								let midiPoint = midiNote.points[pp];
								curSlide.delta = startPitch - midiPoint.pitch;
								let xduration = mm.calculate((midiPoint.durationms - 66) / 1000.0, nextMeasure.tempo);
								curSlide = {
									duration: this.stripDuration(xduration)
									, delta: 0
								};
								trackNote.slides.push(curSlide);
							}
							trackChord.notes.push(trackNote);
						}
					}
				}
			}
			//currentMeasureStart = currentMeasureStart + measureDurationMs;
		}
		return projectTrack;
	}
	createProjectDrums(drum: number, timeline: MZXBX_SongMeasure[], midiTrack: MIDISongTrack): MZXBX_PercussionTrack {
		let projectDrums: MZXBX_PercussionTrack = {
			title: midiTrack.title + ' [' + drum + '] ' + drumNames[drum]
			, measures: []
			, filters: []
			, sampler: { id: '', data: '' }
		};
		let currentTimeMs = 0;
		let mm = new MZXBX_MetreMath();
		for (let tt = 0; tt < timeline.length; tt++) {
			let projectMeasure: MZXBX_PercussionMeasure = { skips: [] };
			projectDrums.measures.push(projectMeasure);
			let nextMeasure = timeline[tt];
			let measureDurationS = mm.set(nextMeasure.metre).duration(nextMeasure.tempo);
			for (let ii = 0; ii < midiTrack.songchords.length; ii++) {
				let chord = midiTrack.songchords[ii];
				for (let kk = 0; kk < chord.notes.length; kk++) {
					let note = chord.notes[kk];
					for (let pp = 0; pp < note.points.length; pp++) {
						let pitch = note.points[pp].pitch;
						if (pitch == drum) {
							if (chord.when >= currentTimeMs && chord.when < currentTimeMs + measureDurationS * 1000) {
								let skip = mm.calculate((chord.when - currentTimeMs) / 1000, nextMeasure.tempo);
								projectMeasure.skips.push(skip);
							}
						}
					}
				}
			}
			currentTimeMs = currentTimeMs + measureDurationS * 1000;
		}
		return projectDrums;
	}
	/*createNextMeasure(currentTimeMs:number,midiSongData:MIDISongData): MZXBX_SongMeasure {
		let nextMeasure: MZXBX_SongMeasure = { tempo: 120, metre: { count: 4, part: 4 } };
		return nextMeasure;
	}*/
}
function findMeasureSkipByTime(time: number, measures: MZXBX_SongMeasure[]): null | { idx: number, skip: MZXBX_Metre } {
	let curTime = 0;
	let mm = new MZXBX_MetreMath();
	for (let ii = 0; ii < measures.length; ii++) {
		let cumea = measures[ii];
		let measureDurationS = mm.set(cumea.metre).duration(cumea.tempo);
		if (curTime + measureDurationS > time) {
			//console.log(time - curTime);
			return {
				idx: ii
				, skip: mm.calculate(time - curTime, cumea.tempo)
			};
		}
		curTime = curTime + measureDurationS;
	}
	return null;
}

function newMIDIparser(arrayBuffer: ArrayBuffer) {
	return new MidiParser(arrayBuffer);
}
