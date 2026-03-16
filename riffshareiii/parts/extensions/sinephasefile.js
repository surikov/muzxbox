"use strict";
let prccntr = 0;
class PhaseSineAudioWorkletProcessor extends AudioWorkletProcessor {
    process(inputs, outputs, parameters) {
        if (prccntr < 10) {
            console.log(prccntr, inputs, outputs, parameters);
            prccntr++;
        }
        const output = outputs[0];
        output.forEach((channel) => {
            for (let i = 0; i < channel.length; i++) {
                channel[i] = Math.random() * 2 - 1;
            }
        });
        return true;
    }
}
registerProcessor("sinePhaseModuleID", PhaseSineAudioWorkletProcessor);
//# sourceMappingURL=sinephasefile.js.map