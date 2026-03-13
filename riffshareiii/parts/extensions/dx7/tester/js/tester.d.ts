type ConnectionSchemeDX7 = {
    outputMix: number[];
    modulationMatrix: (number[])[];
};
declare let matrixConnectionAlgorithmsDX7: ConnectionSchemeDX7[];
type DX7OperatorData = {
    enabled: boolean;
    freqFine: number;
    freqCoarse: number;
    volume: number;
    oscMode: number;
    detune: number;
    rates: number[];
    levels: number[];
};
type DX7PresetData = {
    name: string;
    algorithm: number;
    operators: DX7OperatorData[];
    feedback: number;
};
declare let epiano1preset: DX7PresetData;
declare let defaultBrass1test: {
    algorithm: number;
    feedback: number;
    operators: {
        rates: number[];
        levels: number[];
        keyScaleBreakpoint: number;
        keyScaleDepthL: number;
        keyScaleDepthR: number;
        keyScaleCurveL: number;
        keyScaleCurveR: number;
        keyScaleRate: number;
        detune: number;
        lfoAmpModSens: number;
        velocitySens: number;
        volume: number;
        oscMode: number;
        freqCoarse: number;
        freqFine: number;
        pan: number;
        idx: number;
        enabled: boolean;
    }[];
    name: string;
    lfoSpeed: number;
    lfoDelay: number;
    lfoPitchModDepth: number;
    lfoAmpModDepth: number;
    lfoPitchModSens: number;
    lfoWaveform: number;
    lfoSync: number;
    pitchEnvelope: {
        rates: number[];
        levels: number[];
    };
    controllerModVal: number;
    aftertouchEnabled: number;
};
declare let _defaultBrass1test: {
    algorithm: number;
    feedback: number;
    operators: {
        rates: number[];
        levels: number[];
        keyScaleBreakpoint: number;
        keyScaleDepthL: number;
        keyScaleDepthR: number;
        keyScaleCurveL: number;
        keyScaleCurveR: number;
        keyScaleRate: number;
        detune: number;
        lfoAmpModSens: number;
        velocitySens: number;
        volume: number;
        oscMode: number;
        freqCoarse: number;
        freqFine: number;
        pan: number;
        idx: number;
        enabled: boolean;
        outputLevel: number;
        freqRatio: number;
        ampL: number;
        ampR: number;
        freqFixed: number;
    }[];
    name: string;
    lfoSpeed: number;
    lfoDelay: number;
    lfoPitchModDepth: number;
    lfoAmpModDepth: number;
    lfoPitchModSens: number;
    lfoWaveform: number;
    lfoSync: number;
    pitchEnvelope: {
        rates: number[];
        levels: number[];
    };
    controllerModVal: number;
    aftertouchEnabled: number;
    fbRatio: number;
};
declare class EnvelopeNode {
    minTimeDelta: number;
    maxReleaseDelta: number;
    envelopeContext: AudioContext;
    envelopeGain: GainNode;
    slopes: number[];
    volumes: number[];
    doneTime: number;
    constructor(ctx: AudioContext);
    setupEnvelope(rates: number[], levels: number[]): void;
    setupSlope(when: number, duration: number, from: number, to: number): void;
    startEnvelope(when: number, wholeDuration: number): void;
    down0now(): void;
}
declare class SynthDX7 {
    audioContext: AudioContext;
    output: GainNode;
    constructor(audioContext: AudioContext);
    test(): void;
}
declare var OCTAVE_1024: number;
declare class BeepDX7 {
    ocntxt: AudioContext;
    osc: OscillatorNode;
    outGain: GainNode;
    envelopenode: EnvelopeNode;
    delay: DelayNode;
    off: boolean;
    constructor(cntxt: AudioContext);
    setupOperator(cfg: DX7OperatorData): void;
    startOperator(when: number, duration: number, note: number): void;
    frequencyFromNoteNumber(note: number): number;
    _____________startOperator(level1: number, rate1: number, level2: number, rate2: number, level3: number, rate3: number, level4: number, rate4: number, when: number, duration: number, pitch: number, oscMode: number, freqCoarse: number, freqFine: number, detune: number, volume: number): void;
    connectToOutputNode(outNode: AudioNode): void;
    connectToCarrier(opDX7: BeepDX7): void;
    connectToSelf(): void;
}
declare class VoiceDX7 {
    beeps: BeepDX7[];
    voxoutput: GainNode;
    voContext: AudioContext;
    constructor(destination: AudioNode, aContext: AudioContext);
    setupVoice(presetData: DX7PresetData): void;
    startPlayNote(when: number, duration: number, note: number): void;
    connectMixOperators(scheme: ConnectionSchemeDX7): void;
}
declare let synth: SynthDX7;
declare function initTester(): void;
declare function testPlay(): void;
