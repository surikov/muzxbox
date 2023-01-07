declare type MZXBX_Metre = {
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
declare type MZXBX_HalfTone = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
declare type MZXBX_Octave = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
declare type MZXBX_Step = 1 | 2 | 3 | 4 | 5 | 6 | 7;
declare type MZXBX_StepShift = -2 | -1 | 0 | 1 | 2;
declare type MZXBX_StepSkip = 1 | 2;
declare type MZXBX_Scale = {
    basePitch: MZXBX_HalfTone;
    step2: MZXBX_StepSkip;
    step3: MZXBX_StepSkip;
    step4: MZXBX_StepSkip;
    step5: MZXBX_StepSkip;
    step6: MZXBX_StepSkip;
    step7: MZXBX_StepSkip;
};
declare type MZXBX_Slide = {
    duration: MZXBX_Metre;
    delta: number;
};
declare type MZXBX_Note = {
    step: 1 | 2 | 3 | 4 | 5 | 6 | 7;
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
declare type MZXBX_PluginBase = {
    id: string;
};
declare type MZXBX_PluginFilter = MZXBX_PluginBase | {
    input: string;
};
declare type MZXBX_PluginPerformer = MZXBX_PluginBase | {
    output: string;
};
declare type MZXBX_PluginBeat = MZXBX_PluginBase | {
    output: string;
};
declare type MZXBX_ParameterData = {
    skip: MZXBX_Metre;
    data: string;
};
declare type MZXBX_ParameterPlace = {
    items: MZXBX_ParameterData[];
};
declare type MZXBX_PluginParameter = {
    title: string;
    places: MZXBX_ParameterPlace[];
};
declare type MZXBX_AudioFilter = {
    id: string;
    parameters: MZXBX_PluginParameter[];
};
declare type MZXBX_AudioPerformer = {
    id: string;
    parameters: MZXBX_PluginParameter[];
};
declare type MZXBX_Chord = {
    skip: MZXBX_Metre;
    notes: MZXBX_Note[];
};
declare type MZXBX_Bar = {
    chords: MZXBX_Chord[];
};
declare type MZXBX_PercussionBeat = {
    beats: MZXBX_Metre[];
};
declare type MZXBX_PercussionBar = {
    beats: MZXBX_PercussionBeat[];
};
declare type MZXBX_Measure = {
    tempo: number;
    metre: MZXBX_Metre;
    scale: MZXBX_Scale;
};
declare type MZXBX_PercussionTrack = {
    title: string;
    bars: MZXBX_PercussionBar[];
    filters: MZXBX_AudioFilter[];
    beat: MZXBX_PluginBeat;
};
declare type MZXBX_Track = {
    title: string;
    bars: MZXBX_Bar[];
    filters: MZXBX_AudioFilter[];
    performer: MZXBX_AudioPerformer;
};
declare type MZXBX_Project = {
    title: string;
    timeline: MZXBX_Measure[];
    tracks: MZXBX_Track[];
    percussions: MZXBX_PercussionTrack[];
    filters: MZXBX_AudioFilter[];
};
declare let testIonianC: MZXBX_Scale;
declare let testMetre44: MZXBX_Metre;
declare let testSongProject: MZXBX_Project;
