let skipLoadPhaseWorkletSource = false;
function loadPhaseWorkletSource(audioContext: AudioContext, onDone: () => void) {
	if (skipLoadPhaseWorkletSource) {
		onDone();
	} else {
		loadAudioWorkletCode(phaseWorkletSource, audioContext, () => {
			skipLoadPhaseWorkletSource = true;
			onDone();
		});
	}
}
let phaseWorkletSource = `
class PhaseSineAudioWorkletProcessor extends AudioWorkletProcessor {
	phase = 0;
	cntr = 0;
	constructor() {
		super();
	}
	static get parameterDescriptors() {
		return [
			{ name: "carrierFrequency", automationRate: "a-rate" }
			, { name: "modulationLevel", automationRate: "a-rate" }
		];
	}
	readSample(inputs, xx) {
		let inputSumm = 0;
		for (let ii = 0; ii < inputs.length; ii++) {
			let singleInput = inputs[ii];
			let channelCount = singleInput.length;
			if (channelCount) {
				let channelSumm = 0;
				for (let ch = 0; ch < singleInput.length; ch++) {
					let singleChannel = singleInput[ch];
					channelSumm = channelSumm + singleChannel[xx];
				}
				inputSumm = inputSumm + channelSumm / channelCount;
			}
		}
		return inputSumm;
	}
	writeSample(outputs, xx, value) {
		for (let oo = 0; oo < outputs.length; oo++) {
			let singleOutput = outputs[oo];
			for (let ch = 0; ch < singleOutput.length; ch++) {
				let singleChannel = singleOutput[ch];
				singleChannel[xx] = value;
			}
		}
	}
	process(inputs, outputs, parameters) {
		let outSampleCount = outputs[0][0].length;
		let frequency = parameters["carrierFrequency"][0];
		let level = parameters["modulationLevel"][0];
		let incrementBySample = Math.PI * 2 * frequency / sampleRate;

		for (let xx = 0; xx < outSampleCount; xx++) {
			let inputSumm = this.readSample(inputs, xx);
			let resultValue = Math.sin(this.phase + level * inputSumm);
			this.writeSample(outputs, xx, resultValue);
			this.phase = this.phase + incrementBySample;
			if (this.phase >= Math.PI * 2) {
				this.phase = this.phase - Math.PI * 2;
			}
		}
		return true;
	}
}
registerProcessor("sinePhaseModuleID", PhaseSineAudioWorkletProcessor);
`;
