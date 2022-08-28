type ZvoogAudioPerformerPlugin = ZvoogPlugin & {
	cancelSchedule: () => void
}
type ZvoogInstrumentPlugin = ZvoogAudioPerformerPlugin & {
	scheduleChord: (when: number, tempo: number, envelopes: ZvoogEnvelope[], variation: number) => void
}
type ZvoogPercussionPlugin = ZvoogAudioPerformerPlugin & {
	scheduleHit: (when: number) => void
}
