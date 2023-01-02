declare class MusicMetreMath implements MusicMetreMathType {
    count: number;
    part: number;
    set(from: MusicMetre): MusicMetreMath;
    metre(): MusicMetre;
    simplyfy(): MusicMetreMath;
    strip(toPart: number): MusicMetreMath;
    equals(metre: MusicMetre): boolean;
    less(metre: MusicMetre): boolean;
    more(metre: MusicMetre): boolean;
    plus(metre: MusicMetre): MusicMetreMath;
    minus(metre: MusicMetre): MusicMetreMath;
    duration(metre: MusicMetre, tempo: number): number;
}
declare class MusicScaleMath implements MusicScaleMathType {
    basePitch: number;
    step2: StepSkip;
    step3: StepSkip;
    step4: StepSkip;
    step5: StepSkip;
    step6: StepSkip;
    step7: StepSkip;
    set(scale: MusicScale): MusicScaleMath;
    scale(): MusicScale;
    pitch(note: MusicNote): number;
}
declare type MusicMetre = {
    count: number;
    part: number;
};
interface MusicMetreMathType {
    count: number;
    part: number;
    set(from: MusicMetre): MusicMetreMathType;
    metre(): MusicMetre;
    simplyfy(): MusicMetreMathType;
    strip(toPart: number): MusicMetreMathType;
    equals(metre: MusicMetre): boolean;
    less(metre: MusicMetre): boolean;
    more(metre: MusicMetre): boolean;
    plus(metre: MusicMetre): MusicMetreMathType;
    minus(metre: MusicMetre): MusicMetreMathType;
    duration(metre: MusicMetre, tempo: number): number;
}
declare type MusicOctave = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
declare type MusicStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;
declare type StepShift = -2 | -1 | 0 | 1 | 2;
declare type StepSkip = 1 | 2;
declare type MusicScale = {
    basePitch: number;
    step2: StepSkip;
    step3: StepSkip;
    step4: StepSkip;
    step5: StepSkip;
    step6: StepSkip;
    step7: StepSkip;
};
declare type MusicNote = {
    step: 1 | 2 | 3 | 4 | 5 | 6 | 7;
    shift: StepShift;
    octave: MusicOctave;
};
interface MusicScaleMathType {
    basePitch: number;
    step2: StepSkip;
    step3: StepSkip;
    step4: StepSkip;
    step5: StepSkip;
    step6: StepSkip;
    step7: StepSkip;
    set(scale: MusicScale): MusicScaleMath;
    scale(): MusicScale;
    pitch(musicNote: MusicNote): number;
}
declare type MusicTrack = {
    title: string;
};
declare type MusicProject = {
    title: string;
    timeline: MusicMetre[];
    tracks: MusicTrack[];
};
declare class MuzXbox {
    uiStarted: boolean;
    constructor();
    initAfterLoad(): void;
    initFromUI(): void;
    initAudioContext(): void;
}
