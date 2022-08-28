type ZvoogTrackVoice = {
	filters: ZvoogFilterSetting[]
	, title: string
	, focus?: boolean
};
type ZvoogInstrumentVoice = ZvoogTrackVoice & {
	instrumentSetting: ZvoogInstrumentSetting
	, measureChords: ZvoogChordsInMeasure[]
};
type ZvoogPercussionVoice = ZvoogTrackVoice & {
	percussionSetting: ZvoogPercussionSetting
	, measureBunches: ZvoogBunchesInMeasure[]
};
