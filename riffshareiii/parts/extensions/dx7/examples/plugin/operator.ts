class DX7Operator {
	audioContext: AudioContext;
	output: GainNode;
	feedbackLevel: GainNode;
	phaseDelay: DelayNode;
	compensateNegativeDelay: ConstantSourceNode;
	carrier: OscillatorNode;
	modulationLevel: GainNode;
	envelope: GainNode;
	constructor(cntxt: AudioContext) {
		this.audioContext = cntxt;
		this.createNodes();
		this.connectNodes();
		this.setupNodes();
	}
	setupNodes() {
		this.output.gain.value = 0;
		this.phaseDelay.delayTime.value = 0;
		this.envelope.gain.value = 0;
		this.compensateNegativeDelay.start(this.audioContext.currentTime);
		this.carrier.start(this.audioContext.currentTime);
	}
	connectNodes() {
		this.envelope.connect(this.output);
		this.phaseDelay.connect(this.envelope);
		this.modulationLevel.connect(this.phaseDelay.delayTime);
		this.compensateNegativeDelay.connect(this.phaseDelay.delayTime);
		//this.feedbackLevel.connect(this.modulationLevel);
		this.feedbackLevel.connect(this.phaseDelay.delayTime);
		this.carrier.connect(this.phaseDelay);

	}
	createNodes() {
		this.output = this.audioContext.createGain();
		this.modulationLevel = this.audioContext.createGain();
		this.feedbackLevel = this.audioContext.createGain();
		this.envelope = this.audioContext.createGain();
		this.phaseDelay = this.audioContext.createDelay();
		this.compensateNegativeDelay = this.audioContext.createConstantSource();
		this.carrier = this.audioContext.createOscillator();
	}
	rresetCarrier(when: number) {
		/*
		if (this.carrier) {
			this.carrier.stop();
			this.carrier.disconnect();
		}
		this.carrier = this.audioContext.createOscillator();
		this.carrier.connect(this.phaseDelay);
		this.carrier.start(when);
		*/

	}
	//resetEnvelope(attack: SynthSlope, decay: SynthSlope, sustain: SynthSlope, release: number, when: number, duration: number) {
	resetEnvelope(edata: EnvelopeInfo, when: number, duration: number) {
		this.envelope.gain.setValueAtTime(0, when);
		this.envelope.gain.setValueCurveAtTime(edata.attack.values, when, edata.attack.duration);
		this.envelope.gain.setValueCurveAtTime(edata.decay.values, when + edata.attack.duration, edata.decay.duration);
		this.envelope.gain.setValueCurveAtTime(edata.sustain.values, when + edata.attack.duration + edata.decay.duration, edata.sustain.duration);
		this.envelope.gain.cancelAndHoldAtTime(when + duration);
		this.envelope.gain.linearRampToValueAtTime(0, when + duration + edata.release);
	}
	resetFrequency(when: number, frequency: number, modulationRatio: number, feedbackRatio: number) {
		this.carrier.frequency.linearRampToValueAtTime(frequency, when);
		//this.modulationLevel.gain.linearRampToValueAtTime(2.8 / frequency, when);
		this.modulationLevel.gain.linearRampToValueAtTime(modulationRatio / frequency, when);
		this.compensateNegativeDelay.offset.linearRampToValueAtTime(3 / frequency, when);//2 * modulationRatio;
		//this.feedbackLevel.gain.linearRampToValueAtTime(0.4 * feedbackRatio, when);
		//this.feedbackLevel.gain.linearRampToValueAtTime(0.05 * feedbackRatio, when);
		this.feedbackLevel.gain.linearRampToValueAtTime(feedbackRatio / frequency, when);
	}
	startPlayFrequency(info: OperatorInfo, when: number, duration: number, frequency: number, modulationRatio: number, feedbackRatio: number) {
		//console.log('startPlayFrequency', frequency, feedbackRatio, info.volume);
		//this.resetCarrier(when);
		//this.resetEnvelope(info.attack, info.decay, info.sustain, info.release, when, duration);
		this.resetEnvelope(info.envelope, when, duration);
		this.resetFrequency(when, frequency, modulationRatio, feedbackRatio);
		this.output.gain.value = info.volume;
	}
}
