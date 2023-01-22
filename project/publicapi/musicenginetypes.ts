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
    duration(metre: MZXBX_Metre, tempo: number): number;
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
    step: MZXBX_Step;
    shift: MZXBX_StepShift;
    octave: MZXBX_Octave;
    sides: MZXBX_Slide[];
};
interface MZXBX_ScaleMathType {
    basePitch: MZXBX_HalfTone;
    step2: MZXBX_StepSkip;
    step3: MZXBX_StepSkip;
    step4: MZXBX_StepSkip;
    step5: MZXBX_StepSkip;
    step6: MZXBX_StepSkip;
    step7: MZXBX_StepSkip;
    set(scale: MZXBX_Scale): MZXBX_ScaleMathType;
    scale(): MZXBX_Scale;
    pitch(musicNote: MZXBX_Note): number;
}
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
    scale: MZXBX_Scale;
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
type MZXBX_Project = {
    title: string;
    timeline: MZXBX_SongMeasure[];
    tracks: MZXBX_MusicTrack[];
    percussions: MZXBX_PercussionTrack[];
    filters: MZXBX_AudioFilter[];
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
type MZXBX_Channel = {
    id: string;
    filters: MZXBX_ChannelFilter[];
    performer: MZXBX_ChannelPerformer;
};
type MZXBX_SlideItem = {
    duration: number;
    delta: number;
}
type MZXBX_PlayItem = {
    groupId: string;
    skip: number;
    channelId: string;
    pitch: number;
    volume: number;
    slides: MZXBX_SlideItem;
};
type MZXBX_Set = {
    duration: number;
    items: MZXBX_PlayItem[];
};
type MZXBX_ChannelFilter = {
    id: string;
    kind: string;
    properties: string;
};
type MZXBX_AudioFilterPlugin = {
    reset: (context: AudioContext, parameters: string) => boolean;
};
type MZXBX_ChannelPerformer = {
    id: string;
    kind: string;
    properties: string;
};
type MZXBX_AudioPerformerPlugin = {
    reset: (context: AudioContext, parameters: string) => boolean;
    schedule: (when: number, pitch: number, volume: number, slides: MZXBX_SlideItem[]) => void;
    cancel: () => void;
};
type MZXBX_Schedule = {
    series: MZXBX_Set[];
    channels: MZXBX_Channel[];
    filters: MZXBX_ChannelFilter[];
};
type MZXBX_Player = {
    setup: (context: AudioContext, schedule: MZXBX_Schedule) => boolean;
    start: (from: number, position: number, to: number) => boolean;
    cancel: () => void;
    position:  number;
}




