type ZvoogChordPoint = {
	when: ZvoogMeter
};
type ZvoogChordStrings = ZvoogChordPoint & {
	envelopes: ZvoogEnvelope[]
	, variation: number
};
