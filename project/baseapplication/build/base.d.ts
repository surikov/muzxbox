declare class MZXBX_MetreMath implements MZXBX_MetreMathType {
    count: number;
    part: number;
    set(from: MZXBX_Metre): MZXBX_MetreMath;
    metre(): MZXBX_Metre;
    simplyfy(): MZXBX_MetreMath;
    strip(toPart: number): MZXBX_MetreMath;
    equals(metre: MZXBX_Metre): boolean;
    less(metre: MZXBX_Metre): boolean;
    more(metre: MZXBX_Metre): boolean;
    plus(metre: MZXBX_Metre): MZXBX_MetreMath;
    minus(metre: MZXBX_Metre): MZXBX_MetreMath;
    duration(metre: MZXBX_Metre, tempo: number): number;
}
declare class MZXBX_ScaleMath implements MZXBX_ScaleMathType {
    basePitch: MZXBX_HalfTone;
    step2: MZXBX_StepSkip;
    step3: MZXBX_StepSkip;
    step4: MZXBX_StepSkip;
    step5: MZXBX_StepSkip;
    step6: MZXBX_StepSkip;
    step7: MZXBX_StepSkip;
    set(scale: MZXBX_Scale): MZXBX_ScaleMath;
    scale(): MZXBX_Scale;
    pitch(note: MZXBX_Note): number;
}
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
declare let testIonianC: MZXBX_Scale;
declare let testMetre44: MZXBX_Metre;
declare let testSongProject: MZXBX_Project;
declare class MuzXbox {
    uiStarted: boolean;
    audioContext: AudioContext;
    constructor();
    initAfterLoad(): void;
    initFromUI(): void;
    initAudioContext(): void;
}
declare class MusicTicker {
    startPlay(): void;
    cancelPlay(): void;
    setPosition(seconds: number): void;
    getPosition(): number;
}
