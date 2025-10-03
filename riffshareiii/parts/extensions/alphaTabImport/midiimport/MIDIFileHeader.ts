class MIDIFileHeader {
	datas: DataView;
	HEADER_LENGTH: number = 14;
	format: number;
	trackCount: number;
	tempoBPM: number = 120;
	changesResolutionBPM: { track: number, ms: number, newresolution: number, bpm: number, evnt: MIDIEvent | null }[] = [];
	metersList: { track: number, ms: number, count: number, division: number }[] = [];
	lyricsList: { track: number, ms: number, txt: string }[] = [];
	signsList: { track: number, ms: number, sign: string }[] = [];
	meterCount: number = 4;
	meterDivision: number = 4;
	keyFlatSharp: number = 0;
	keyMajMin: number = 0;
	lastNonZeroQuarter: number = 0;
	constructor(buffer: ArrayBuffer) {
		this.datas = new DataView(buffer, 0, this.HEADER_LENGTH);
		this.format = this.datas.getUint16(8);
		this.trackCount = this.datas.getUint16(10);
		console.log('MIDIFileHeader', (this.datas.getUint16(12) & 0x8000), this.datas.getUint16(12));
	}
	/*
	// Tick compute
	getTickResolution(tempo: number) {
		// Frames per seconds
		if (this.datas.getUint16(12) & 0x8000) {
			return 1000000 / (this.getSMPTEFrames() * this.getTicksPerFrame());
			// Ticks per beat
		}
		// Default MIDI tempo is 120bpm, 500ms per beat
		tempo = tempo || 500000;
		return tempo / this.getTicksPerBeat();
	}*/
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
	// MIDI file format
	getFormat = function (): number {
		const format = this.datas.getUint16(8);
		if (0 == format || 1 == format || 2 == format) {

		} else {
			console.log('wrong format', format);
		}
		return format;
	};
}
