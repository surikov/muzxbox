declare type ConnectionSchemeDX7 = {
    outputMix: number[];
    modulationMatrix: (number[])[];
};
declare let matrixAlgorithmsDX7: ConnectionSchemeDX7[];
declare class SynthDX7 {
    moContext: AudioContext;
    output: GainNode;
    constructor(audioContext: AudioContext);
    test(): void;
}
declare class OperatorDX7 {
    constructor();
}
declare class VoiceDX7 {
    note: number;
    velocity: number;
    operator1: OperatorDX7;
    operator2: OperatorDX7;
    operator3: OperatorDX7;
    operator4: OperatorDX7;
    operator5: OperatorDX7;
    operator6: OperatorDX7;
    constructor(note: number, velocity: number);
    frequencyFromNoteNumber(note: number): number;
}
declare let synth: SynthDX7;
declare function initTester(): void;
declare function testPlay(): void;
