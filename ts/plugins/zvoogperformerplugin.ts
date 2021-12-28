type ZvoogPerformerPlugin = ZvoogPlugin & {
	addSchedule: (when: number, tempo: number, envelopes: ZvoogEnvelope[], variation: number) => void
	, cancelSchedule: () => void
}
