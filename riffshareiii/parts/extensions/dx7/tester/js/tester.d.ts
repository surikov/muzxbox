declare type ConnectionSchemeDX7 = {
    outputMix: number[];
    modulationMatrix: (number[])[];
};
declare let matrixAlgorithmsDX7: ConnectionSchemeDX7[];
declare class SynthDX7 {
    moContext: AudioContext;
    constructor(audioContext: AudioContext);
    createVoice(): VoiceDX7;
    test(): void;
}
declare class OperatorDX7 {
    constructor();
}
declare class VoiceDX7 {
    constructor();
    test(): void;
    frequencyFromNoteNumber(note: number): number;
}
declare let synth: SynthDX7;
declare function initTester(): void;
declare function testPlay(): void;
