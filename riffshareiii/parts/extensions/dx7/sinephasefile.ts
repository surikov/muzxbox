interface AudioWorkletProcessor {}
declare var AudioWorkletProcessor: {
    prototype: AudioWorkletProcessor;
    new(options?: AudioWorkletNodeOptions): AudioWorkletProcessor;
};

interface AudioWorkletGlobalScope {
    registerProcessor(name: string, processorCtor: any): void;
    // Add other worklet globals like currentFrame, sampleRate, etc. if needed
}

declare var AudioWorkletGlobalScope: {
    prototype: AudioWorkletGlobalScope;
    new(): AudioWorkletGlobalScope;
};

declare function registerProcessor(name: string, processorCtor: any): void;
////////////////////////////////////////////////////////////////////////////////////////
let prccntr=0;
class PhaseSineAudioWorkletProcessor extends AudioWorkletProcessor {
	process(inputs, outputs, parameters) {
		if(prccntr<10){
			console.log(prccntr,inputs,outputs,parameters);
			prccntr++;
		}
		
		return true;
	}
}

registerProcessor("sinePhaseModuleID", PhaseSineAudioWorkletProcessor);