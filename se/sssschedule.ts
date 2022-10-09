type SSSMeter = {
	count: number;
	division: number;
};
type SSSFilter = {
	id: string;
	parameters: SSSPoint[];
};
type SSSPerformer = {
	id: string;
	parameters: SSSPoint[];
};
type SSSHop = {
	ticks: number;
	meter: SSSMeter;
};
type SSSTick = {
	meter: SSSMeter;
	tempo: number;
};
type SSSSchedule = {
	title: string;
	tracks: SSSTrack[];
	timeline: SSSTick[];
	filters: SSSFilter[];
};
type SSSTrack = {
	title: string;
	measures: SSSMeasure[];
	filters: SSSFilter[];
	performer: SSSPerformer[];
};
type SSSChord = {
	notes: SSSNote[];
	start: SSSMeter;
};
type SSSNote = {
	pitches: SSSPitchStep[];
};
type SSSMeasure = {
	meter: SSSMeter;
	tempo: number;
	chords: SSSChord;
};
type SSSPitchStep = {
	value: number;
	duration: SSSMeter;
};
type SSSPoint = {
	data: object;
	skip: SSSHop;
};

