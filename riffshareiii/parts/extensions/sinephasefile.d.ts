interface AudioWorkletProcessor {
}
declare var AudioWorkletProcessor: {
    prototype: AudioWorkletProcessor;
    new (options?: AudioWorkletNodeOptions): AudioWorkletProcessor;
};
interface AudioWorkletGlobalScope {
    registerProcessor(name: string, processorCtor: any): void;
}
declare var AudioWorkletGlobalScope: {
    prototype: AudioWorkletGlobalScope;
    new (): AudioWorkletGlobalScope;
};
declare function registerProcessor(name: string, processorCtor: any): void;
declare let prccntr: number;
declare class PhaseSineAudioWorkletProcessor extends AudioWorkletProcessor {
    process(inputs: any, outputs: any, parameters: any): boolean;
}
