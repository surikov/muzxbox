type SSSMeter = {
	count: number;
	division: number;
};
type SSSMeasure = {
	meter: SSSMeter;
	tempo:number;
};
type SSSSchedule = {
	title: string;
	tracks: SSSTrack[];
	measures:SSSMeasure[];
};
type SSSTrack = {
	title: string;
	voices: SSSVoice[];
};
type SSSVoice = {
	title: string;
};
