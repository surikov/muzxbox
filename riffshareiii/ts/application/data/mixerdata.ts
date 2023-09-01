type MusicMetre = {
	count: number
	, part: number
};
type TimeBar = {
	tempo: number
	, metre: MusicMetre
};
type PitchedTrack = {
	title: string
};
type DrumsTrack = {
	title: string
};
type MixerData = {
	title: string
	, timeline: TimeBar[]
	, notePathHeight: number
	, widthDurationRatio: number
	, pitchedTracks: PitchedTrack[]
	//, drumsTracks: DrumsTrack[]
};

