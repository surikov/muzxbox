type ConnectionSchemeDX7 = {
    outputMix: number[];
    modulationMatrix: (number[])[];
};
declare let matrixAlgorithmsDX7: ConnectionSchemeDX7[];
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
    constructor(ctx: AudioContext);
    down0now(): void;
    slopeDuration(preLevel: number, nextLevel: number, rate: number): number;
    setLevelRate(level1: number, rate1: number, level2: number, rate2: number, level3: number, rate3: number, level4: number, rate4: number, when: number, duration: number): void;
}
declare class SynthDX7 {
    moContext: AudioContext;
    output: GainNode;
    testVox: VoiceDX7 | null;
    constructor(audioContext: AudioContext);
    test(): void;
}
declare class OperatorDX7 {
    minimalDelta: number;
    onNotOff: boolean;
    ocntxt: AudioContext;
    osc: OscillatorNode;
    outGain: GainNode;
    envelope: EnvelopeNode;
    eg: {
        level1: number;
        level2: number;
        level3: number;
        level4: number;
        rate1: number;
        rate2: number;
        rate3: number;
        rate4: number;
    };
    adsr: {
        attackDuration: number;
        attackVolume: number;
        decayDuration: number;
        decayVolume: number;
        releaseDuration: number;
    };
    constructor(cntxt: AudioContext);
    frequencyFromNoteNumber(note: number): number;
    startOperator(level1: number, rate1: number, level2: number, rate2: number, level3: number, rate3: number, level4: number, rate4: number, when: number, duration: number, pitch: number, oscMode: number, freqRatio: number, freqFixed: number, outputLevel: number): void;
    connectToOutputNode(outNode: AudioNode): void;
    connectSendToOperator(opDX7: OperatorDX7): void;
}
declare class VoiceDX7 {
    operators: OperatorDX7[];
    voxoutput: GainNode;
    voContext: AudioContext;
    dx7voxData: {
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
    constructor(destination: AudioNode, aContext: AudioContext);
    startPlayNote(when: number, duration: number, pitch: number): void;
    connectMixOperators(scheme: ConnectionSchemeDX7): void;
}
declare let synth: SynthDX7;
declare function initTester(): void;
declare function testPlay(): void;
