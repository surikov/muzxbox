type ZvoogTrack = {
	title: string
	//, voices: ZvoogVoice[]
	, instruments: ZvoogInstrumentVoice[]
	, percussions: ZvoogPercussionVoice[]
	, filters: ZvoogFilterSetting[]
	//, obverseVoiceFilter?: number
	, focus?: boolean
};
