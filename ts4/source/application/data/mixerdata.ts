type MusicMetre = {
	count: number
	, part: number
};
type TimeBar = {
	tempo: number
	, metre: MusicMetre
};
type MusicTrack = {
	title: string
};
type MixerData = {
	title: string
	, timeline: TimeBar[]
	, notePathHeight: number
	, widthDurationRatio: number
	, tracks: MusicTrack[]
};

