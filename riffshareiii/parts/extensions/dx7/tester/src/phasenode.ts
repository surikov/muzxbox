class PhaseNode {
	carrier: AudioWorkletNode;
	carrierFrequency: AudioParam | undefined;
	modulationLevel: AudioParam | undefined;
	constructor(audioContext: AudioContext) {
		this.carrier = new AudioWorkletNode(audioContext, 'sinePhaseModuleID');
		let descriptors = this.carrier.parameters as any;
		this.carrierFrequency = descriptors.get('carrierFrequency');
		this.modulationLevel = descriptors.get('modulationLevel');
	}
}
