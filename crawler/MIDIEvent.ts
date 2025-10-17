type MIDIEvent = {
	offset: number
	, delta: number
	, eventTypeByte: number
	, basetype?: number
	, subtype?: number
	, index?: string
	, length?: number
	, msb?: number
	, lsb?: number
	, prefix?: number
	, data?: number[]
	, tempo?: number
	, tempoBPM?: number
	, hour?: number
	, minutes?: number
	, seconds?: number
	, frames?: number
	, subframes?: number
	, key?: number
	, param1?: number
	, param2?: number
	, param3?: number
	, param4?: number
	, scale?: number
	, badsubtype?: number
	, midiChannel?: number
	, playTimeMs: number
	, preTimeMs?: number
	, deltaTimeMs?: number
	, trackNum?: number
	, text?: string
};
