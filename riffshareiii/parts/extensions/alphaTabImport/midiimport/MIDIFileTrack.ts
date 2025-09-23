type NotePitch = {
	pointDuration: number
	, basePitchDelta: number
}
/*
type TrackChord = {
	startMs: number
	, channelidx: number
	, tracknotes: TrackNote[]
};
*/
type TrackNote = {
	closed: boolean
	, bendPoints: NotePitch[]
	, openEvent?: MIDIEvent
	, closeEvent?: MIDIEvent
	, volume?: number
	, basePitch: number
	, baseDuration: number
	, startMs: number
	, channelidx: number
	, trackidx: number
	, avgMs: number
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
	//trackChords: TrackChord[] = [];
	trackNotes: TrackNote[] = [];
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
