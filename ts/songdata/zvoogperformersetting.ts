type ZvoogAudioPerformerSetting = {
	parameters: ZvoogParameterData[]
	, kind: string
	, initial: string
	, focus?: boolean
};
type ZvoogInstrumentSetting = ZvoogAudioPerformerSetting & {
	instrumentPlugin: ZvoogInstrumentPlugin | null
};
type ZvoogPercussionSetting = ZvoogAudioPerformerSetting & {
	percussionPlugin: ZvoogPercussionPlugin | null
};
