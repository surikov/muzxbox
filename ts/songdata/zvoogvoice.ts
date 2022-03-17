type ZvoogVoice = {
	measureChords: ZvoogMeasureChord[]
	, performer: ZvoogPerformerSetting
	, filters: ZvoogFilterSetting[]
	//, bass: boolean
	, title: string
	//, stringPattern: ZvoogStringPattern | null//16th
	//, strumPattern: ZvoogStrumPattern | null//16th
	//, keyPattern: ZvoogKeyPattern | null//16th
	, obverse?: number
};
