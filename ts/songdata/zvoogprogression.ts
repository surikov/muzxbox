
type ZvoogModeStep = {
	step: number
	, halfTones: number
	, shift: number
	, octave: number
};




type ZvoogStrumPattern = {
	directions: string;//'.' | '-' | 'V' | 'A' | 'X'
};
type ZvoogKeyPattern = {
	octaves: string;//'.' | '-' | 1-9
};
type ZvoogStringPattern = {
	strings: string[] | null;/*
	'	|*.....*'
	, '	|.*...*.'
	, '	|..*.*..'
	, '	|...*---'
	, '	*---....'
	, '	|.......'
	*/
};



type ZvoogChordMelody = {
	duration: ZvoogMeter
	, chord: string
};
type ZvoogProgression = {
	//base: number
	tone:string
	, mode: string
	, progression: ZvoogChordMelody[]
};

type ZvoogFretKeys = {
	pitch: number
	, name: string
	, frets: number[]
};
type ZvoogStepHalfTone={
	step:number
	,halftone:number
};
type ZvoogChordPitches = {
	name: string
	, pitches: ZvoogStepHalfTone[]//number[]
};
type IntervalMode = {
	name: string
	, steps: number[]
	, flat: boolean
	,priority:number
};

