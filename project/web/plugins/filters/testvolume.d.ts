declare class SimpleTestVolumePlugin implements MZXBX_AudioFilterPlugin {
    base: GainNode;
    schedule(when: number, parameters: string): void;
    reset(context: AudioContext, parameters: string): boolean;
    output(): AudioNode | null;
    input(): AudioNode | null;
}
declare function testPluginForVolume1(): MZXBX_AudioFilterPlugin;
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
declare type MZXBX_PluginBase = {
    setup: (audioContext: AudioContext) => boolean;
};
declare type MZXBX_PluginFilter = MZXBX_PluginBase | {
    input: string;
};
declare type MZXBX_PluginPerformer = MZXBX_PluginBase | {
    output: string;
    schedule: (chord: MZXBX_Chord, when: number) => boolean;
};
declare type MZXBX_PluginSampler = MZXBX_PluginBase | {
    output: string;
};
declare type MZXBX_AudioFilter = {
    id: string;
    data: string;
};
declare type MZXBX_AudioPerformer = {
    id: string;
    data: string;
};
declare type MZXBX_AudioSampler = {
    id: string;
    data: string;
};
declare type MZXBX_Chord = {
    skip: MZXBX_Metre;
    notes: MZXBX_Note[];
};
declare type MZXBX_TrackMeasure = {
    chords: MZXBX_Chord[];
};
declare type MZXBX_PercussionMeasure = {
    skips: MZXBX_Metre[];
};
declare type MZXBX_SongMeasure = {
    tempo: number;
    metre: MZXBX_Metre;
    scale: MZXBX_Scale;
};
declare type MZXBX_PercussionTrack = {
    title: string;
    measures: MZXBX_PercussionMeasure[];
    filters: MZXBX_AudioFilter[];
    sampler: MZXBX_AudioSampler;
};
declare type MZXBX_MusicTrack = {
    title: string;
    measures: MZXBX_TrackMeasure[];
    filters: MZXBX_AudioFilter[];
    performer: MZXBX_AudioPerformer;
};
declare type MZXBX_Project = {
    title: string;
    timeline: MZXBX_SongMeasure[];
    tracks: MZXBX_MusicTrack[];
    percussions: MZXBX_PercussionTrack[];
    filters: MZXBX_AudioFilter[];
};
declare type MZXBX_Channel = {
    id: string;
    filters: MZXBX_ChannelFilter[];
    performer: MZXBX_ChannelPerformer;
};
declare type MZXBX_SlideItem = {
    duration: number;
    delta: number;
};
declare type MZXBX_PlayItem = {
    skip: number;
    channelId: string;
    pitch: number;
    slides: MZXBX_SlideItem[];
};
declare type MZXBX_FilterState = {
    skip: number;
    filterId: string;
    data: string;
};
declare type MZXBX_Set = {
    duration: number;
    items: MZXBX_PlayItem[];
    states: MZXBX_FilterState[];
};
declare type MZXBX_ChannelFilter = {
    id: string;
    kind: string;
    properties: string;
};
declare type MZXBX_AudioFilterPlugin = {
    reset: (context: AudioContext, parameters: string) => boolean;
    schedule: (when: number, parameters: string) => void;
    input: () => AudioNode | null;
    output: () => AudioNode | null;
};
declare type MZXBX_ChannelPerformer = {
    id: string;
    kind: string;
    properties: string;
};
declare type MZXBX_AudioPerformerPlugin = {
    reset: (context: AudioContext, parameters: string) => boolean;
    schedule: (when: number, pitch: number, slides: MZXBX_SlideItem[]) => void;
    cancel: () => void;
    output: () => AudioNode | null;
};
declare type MZXBX_Schedule = {
    series: MZXBX_Set[];
    channels: MZXBX_Channel[];
    filters: MZXBX_ChannelFilter[];
};
declare type MZXBX_Player = {
    setup: (context: AudioContext, schedule: MZXBX_Schedule, onDone: () => void) => void;
    start: (from: number, position: number, to: number) => boolean;
    cancel: () => void;
    position: number;
};
declare type MZXBX_import = {
    import: () => MZXBX_Schedule | null;
};
