declare class SSSEngine {
    constructor();
    init(): void;
}
declare type SSSMeter = {
    count: number;
    division: number;
};
declare type SSSFilter = {
    id: string;
    parameters: SSSPoint[];
};
declare type SSSPerformer = {
    id: string;
    parameters: SSSPoint[];
};
declare type SSSHop = {
    ticks: number;
    meter: SSSMeter;
};
declare type SSSTick = {
    meter: SSSMeter;
    tempo: number;
};
declare type SSSSchedule = {
    title: string;
    tracks: SSSTrack[];
    timeline: SSSTick[];
    filters: SSSFilter[];
};
declare type SSSTrack = {
    title: string;
    measures: SSSMeasure[];
    filters: SSSFilter[];
    performer: SSSPerformer[];
};
declare type SSSChord = {
    notes: SSSNote[];
    start: SSSMeter;
};
declare type SSSNote = {
    pitches: SSSPitchStep[];
};
declare type SSSMeasure = {
    meter: SSSMeter;
    tempo: number;
    chords: SSSChord;
};
declare type SSSPitchStep = {
    value: number;
    duration: SSSMeter;
};
declare type SSSPoint = {
    data: object;
    skip: SSSHop;
};
declare class TreeValue {
    name: string;
    value: string;
    content: TreeValue[];
    constructor(name: string, value: string, children: TreeValue[]);
    clone(): TreeValue;
    first(name: string): TreeValue;
    exists(name: string): boolean;
    every(name: string): TreeValue[];
    seek(name: string, subname: string, subvalue: string): TreeValue;
    readDocChildren(node: any): TreeValue[];
    fill(document: Document): void;
}
declare function MeterMath(u: SSSMeter): DurationUnitUtil;
declare class DurationUnitUtil {
    _unit: SSSMeter;
    constructor(u: SSSMeter);
    clone(): SSSMeter;
    plus(b: SSSMeter): SSSMeter;
    minus(b: SSSMeter): SSSMeter;
    _meterCompare(b: SSSMeter): number;
    moreThen(b: SSSMeter): boolean;
    notMoreThen(b: SSSMeter): boolean;
    lessThen(b: SSSMeter): boolean;
    notLessThen(b: SSSMeter): boolean;
    equalsTo(b: SSSMeter): boolean;
    simplify(): SSSMeter;
}
