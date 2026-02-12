type ConnectionSchemeDX7 = {
    outputMix: number[];
    modulationMatrix: (number[])[];
};
declare let matrixAlgorithmsDX7: ConnectionSchemeDX7[];
declare class SynthDX7 {
    moContext: AudioContext;
    output: GainNode;
    testVox: VoiceDX7 | null;
    constructor(audioContext: AudioContext);
    test(): void;
}
declare class OperatorDX7 {
    outOperators: OperatorDX7[];
    outDestination: AudioNode | null;
    onNotOff: boolean;
    ocntxt: AudioContext;
    osc: OscillatorNode | null;
    oenvelope: GainNode;
    adsr: {
        attackDuration: number;
        attackVolume: number;
        decayDuration: number;
        decayVolume: number;
        releaseDuration: number;
    };
    freqRatio: number;
    constructor(cntxt: AudioContext);
    frequencyFromNoteNumber(note: number): number;
    startOperator(when: number, duration: number, pitch: number): void;
}
declare class VoiceDX7 {
    operators: OperatorDX7[];
    voxoutput: GainNode;
    voContext: AudioContext;
    constructor(destination: AudioNode, aContext: AudioContext);
    startPlayNote(when: number, duration: number, pitch: number): void;
    connectOperators(scheme: ConnectionSchemeDX7): void;
}
declare let synth: SynthDX7;
declare function initTester(): void;
declare function testPlay(): void;
