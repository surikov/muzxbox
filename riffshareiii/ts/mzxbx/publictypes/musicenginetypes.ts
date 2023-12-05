type MZXBX_CachedWave = {
	path: string;
    buffer: AudioBuffer | null;
    canceled?:boolean;
    //dots?:{x:number,y:number}[];
    line100?:number[];
};
type MZXBX_Metre = {
	count: number;
	part: number;
};
interface MZXBX_MetreMathType {
	count: number;
	part: number;
	set(from: MZXBX_Metre): MZXBX_MetreMathType;
	metre(): MZXBX_Metre;
	simplyfy(): MZXBX_MetreMathType;
	strip(toPart: number): MZXBX_MetreMathType;
	equals(metre: MZXBX_Metre): boolean;
	less(metre: MZXBX_Metre): boolean;
	more(metre: MZXBX_Metre): boolean;
	plus(metre: MZXBX_Metre): MZXBX_MetreMathType;
	minus(metre: MZXBX_Metre): MZXBX_MetreMathType;
    //duration(metre: MZXBX_Metre, tempo: number): number;
    duration( tempo: number): number;
    calculate(duration: number,tempo:number): MZXBX_MetreMathType ;
}
type MZXBX_HalfTone = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
type MZXBX_Octave = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type MZXBX_Step = 1 | 2 | 3 | 4 | 5 | 6 | 7;
type MZXBX_StepShift = -2 | -1 | 0 | 1 | 2;
type MZXBX_StepSkip = 1 | 2;
type MZXBX_Scale = {
	basePitch: MZXBX_HalfTone;
	step2: MZXBX_StepSkip;
	step3: MZXBX_StepSkip;
	step4: MZXBX_StepSkip;
	step5: MZXBX_StepSkip;
	step6: MZXBX_StepSkip;
	step7: MZXBX_StepSkip;
};
type MZXBX_Slide = {
	duration: MZXBX_Metre;
	delta: number;
};
type MZXBX_Note = {
	step?: MZXBX_Step;
	shift?: MZXBX_StepShift;
    octave?: MZXBX_Octave;
    pitch:number;
	slides: MZXBX_Slide[];
};
/*
interface MZXBX_ScaleMathType {
	basePitch: MZXBX_HalfTone;
	step2: MZXBX_StepSkip;
	step3: MZXBX_StepSkip;
	step4: MZXBX_StepSkip;
	step5: MZXBX_StepSkip;
	step6: MZXBX_StepSkip;
	step7: MZXBX_StepSkip;
	//set(scale: MZXBX_Scale): MZXBX_ScaleMathType;
	scale(): MZXBX_Scale;
	//pitch(musicNote: MZXBX_Note): number;
}*/
type MZXBX_PluginBase = {
	setup: (audioContext: AudioContext) => boolean;
};
type MZXBX_PluginFilter = MZXBX_PluginBase | {
	input: string;
};
type MZXBX_PluginPerformer = MZXBX_PluginBase | {
	output: string;
	schedule: (chord: MZXBX_Chord, when: number) => boolean;
};
type MZXBX_PluginSampler = MZXBX_PluginBase | {
	output: string;
};
/*type MZXBX_ParameterData = {
	skip: MZXBX_Metre;
	data: string;
};
type MZXBX_ParameterMeasure = {
	states: MZXBX_ParameterData[];
};
type MZXBX_PluginParameter = {
	title: string;
	measures: MZXBX_ParameterMeasure[];
};*/
type MZXBX_AudioFilter = {
	id: string;
	//parameters: MZXBX_PluginParameter[];
	data: string;
};
type MZXBX_AudioPerformer = {
	id: string;
	//parameters: MZXBX_PluginParameter[];
	data: string;
};
type MZXBX_AudioSampler = {
	id: string;
	//parameters: MZXBX_PluginParameter[];
	data: string;
};
type MZXBX_Chord = {
	skip: MZXBX_Metre;
	notes: MZXBX_Note[];
};
type MZXBX_TrackMeasure = {
	chords: MZXBX_Chord[];
};
/*type MZXBX_PercussionBeat = {
	skips: MZXBX_Metre[];
};*/
type MZXBX_PercussionMeasure = {
	skips: MZXBX_Metre[];
};
type MZXBX_SongMeasure = {
	tempo: number;
	metre: MZXBX_Metre;
	scale?: MZXBX_Scale;
};
type MZXBX_PercussionTrack = {
	title: string;
	measures: MZXBX_PercussionMeasure[];
	filters: MZXBX_AudioFilter[];
	sampler: MZXBX_AudioSampler;
};
type MZXBX_MusicTrack = {
	title: string;
	measures: MZXBX_TrackMeasure[];
	filters: MZXBX_AudioFilter[];
	performer: MZXBX_AudioPerformer;
};
type MZXBX_CommentText={
    skip:MZXBX_Metre;
    text:string;
};
type MZXBX_CommentMeasure={
    texts:MZXBX_CommentText[];
};
type MZXBX_Theme={
	widthDurationRatio:number
	,notePathHeight:number
};
type MZXBX_Project = {
	title: string;
	timeline: MZXBX_SongMeasure[];
	tracks: MZXBX_MusicTrack[];
    percussions: MZXBX_PercussionTrack[];
    comments: MZXBX_CommentMeasure[];
	filters: MZXBX_AudioFilter[];
	theme:MZXBX_Theme;
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
type MZXBX_FilterHolder = {
    plugin: MZXBX_AudioFilterPlugin | null
    , id: string
    , kind: string
    , properties: string
    , launched: boolean
};
type MZXBX_PerformerHolder = {
    plugin: MZXBX_AudioPerformerPlugin | null
    , id: string
    , kind: string
    , properties: string
    , launched: boolean
};
type MZXBX_Channel = {
	id: string;
	comment?: string;
	filters: MZXBX_ChannelFilter[];
	performer: MZXBX_ChannelPerformer;
};
type MZXBX_SlideItem = {
	duration: number;
	delta: number;
}
type MZXBX_PlayItem = {
	skip: number;
	channelId: string;
	pitch: number;
	//volume: number;
	slides: MZXBX_SlideItem[];
};
type MZXBX_FilterState = {
	skip: number;
	filterId: string;
	data: string;
};
type MZXBX_Set = {
	duration: number;
	items: MZXBX_PlayItem[];
	states: MZXBX_FilterState[];
};
type MZXBX_ChannelFilter = {
	id: string;
	kind: string;
	properties: string;
};
type MZXBX_AudioFilterPlugin = {
	launch: (context: AudioContext, parameters: string) => void;
	busy: () => null | string;
	schedule: (when: number, parameters: string) => void;
	input: () => AudioNode | null;
	output: () => AudioNode | null;
};
type MZXBX_ChannelPerformer = {
	id: string;
	kind: string;
	properties: string;
};
type MZXBX_AudioPerformerPlugin = {
	launch: (context: AudioContext, parameters: string) => void;
	busy: () => null | string;
	schedule: (when: number, pitch: number, slides: MZXBX_SlideItem[]) => void;
	cancel: () => void;
	output: () => AudioNode | null;
};
type MZXBX_Schedule = {
	series: MZXBX_Set[];
	channels: MZXBX_Channel[];
	filters: MZXBX_ChannelFilter[];
};
type MZXBX_Player = {
	setupPlugins: (context: AudioContext, schedule: MZXBX_Schedule, onDone: () => void) => void;
	startLoop: (from: number, position: number, to: number) => string;
	cancel: () => void;
	//reconnect:()=> void;
	//findFilterPlugin(filterId: string): MZXBX_AudioFilterPlugin | null;
	//findPerformerPlugin(channelId: string): MZXBX_AudioPerformerPlugin | null;
	allFilters():MZXBX_FilterHolder[];
	allPerformers():MZXBX_PerformerHolder[];
	position: number;
};
type MZXBX_import = {
	import: () => MZXBX_Schedule | null;
};



