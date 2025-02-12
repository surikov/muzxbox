//http://midi.teragonaudio.com/tech/midispec.htm

type ImportMeasure = Zvoog_SongMeasure & {
	startMs: number;
	durationMs: number;
};



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
	, bendPoints: NotePitch[]
	, openEvent?: MIDIEvent
	, closeEvent?: MIDIEvent
	, volume?: number
	, basePitch: number
	, baseDuration: number
}
type NotePitch = {
	pointDuration: number
	, basePitchDelta: number
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
	midiPitch: number
	, midiDuration: number
	, slidePoints: MIDISongPoint[];
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
function round1000(nn: number): number {
	return Math.round(1000 * nn) / 1000;
}
function findMeasureSkipByTime(time: number, measures: Zvoog_SongMeasure[]): null | { idx: number, skip: Zvoog_Metre } {
	let curTime = 0;
	let mm = MMUtil();
	for (let ii = 0; ii < measures.length; ii++) {
		let cumea = measures[ii];
		let measureDurationS = mm.set(cumea.metre).duration(cumea.tempo);
		if (round1000(curTime + measureDurationS) > round1000(time)) {
			//console.log(time - curTime, curTime, measureDurationS, time,round1000(curTime + measureDurationS ),round1000( time));
			let delta = time - curTime;
			if (delta < 0) {
				delta = 0;
			}
			return {
				idx: ii
				, skip: mm.calculate(delta, cumea.tempo)
			};
		}
		curTime = curTime + measureDurationS;
	}
	return null;
}

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
function utf8ArrayToString(aBytes) {
	var sView = "";

	for (var nPart, nLen = aBytes.length, nIdx = 0; nIdx < nLen; nIdx++) {
		nPart = aBytes[nIdx];

		sView = sView + String.fromCharCode(
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