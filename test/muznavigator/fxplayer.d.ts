declare class FxPlayer {
    mp3arrayBuffer: ArrayBuffer | null;
    mp3audioBuffer: AudioBuffer | null;
    currentContext: AudioContext | null;
    mp3sourceNode: AudioBufferSourceNode | null;
    lastStart: number;
    lastDuration: number;
    pitchRatio: number;
    resetSource(): void;
    startAudioBuffer(rebuff: AudioBuffer): void;
    initContext(): void;
    load(file: File): void;
    transpose(): AudioBuffer | null;
}
declare let player: FxPlayer;
declare function startLoadMP3(it: any): void;
declare function warnInit(): void;
declare function onPitchChange(it: any): void;
declare function resamplePitchShiftFloat32Array(pitchShift: number, numSampsToProcess: number, fftFrameSize: number, osamp: number, sampleRate: number, indata: Float32Array): Float32Array;
declare function ShortTimeFourierTransform(fftBuffer: number[], fftFrameSize: number, sign: number): void;
declare function ___do___PitchShift(audioBuffer: AudioBuffer, ratio: number): void;
