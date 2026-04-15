class DX7Operator {
	audioContext: AudioContext;
	output: GainNode;
	feedback: GainNode;
	phaseShift: DelayNode;
	carrier: OscillatorNode;
	modulation: GainNode;
	envelope: GainNode;
	constructor(cntxt: AudioContext) {
		this.audioContext = cntxt;

		this.output = this.audioContext.createGain();
		this.modulation = this.audioContext.createGain();
		this.feedback = this.audioContext.createGain();
		this.envelope = this.audioContext.createGain();
		this.phaseShift = this.audioContext.createDelay();
		this.carrier = this.audioContext.createOscillator();

		this.carrier.connect(this.phaseShift);
		this.modulation.connect(this.phaseShift.delayTime);
		this.phaseShift.connect(this.envelope);
		this.envelope.connect(this.output);

		this.output.gain.value = 0;
		this.phaseShift.delayTime.value = 0;

		this.carrier.start(this.audioContext.currentTime);
	}
	startPlayFrequency(info: OperatorInfo, when: number, duration: number, frequency: number): number {
		this.carrier.frequency.value = frequency;
		this.modulation.gain.value = 1 / frequency;//17 / (2 * Math.PI * frequency);
		this.output.gain.value = info.volume;
		/*this.envelope.gain.setValueAtTime(info.attack.from, when);
		this.envelope.gain.linearRampToValueAtTime(info.attack.to, when + info.attack.duration);
		this.envelope.gain.linearRampToValueAtTime(info.decay.to, when + info.attack.duration + info.decay.duration);
		this.envelope.gain.linearRampToValueAtTime(info.sustain.to, when + info.attack.duration + info.decay.duration + info.sustain.duration);
		this.envelope.gain.cancelAndHoldAtTime(when + duration);
		this.envelope.gain.linearRampToValueAtTime(info.release.to, when + duration + info.release.duration);
		if (info.release.duration > 3 || info.release.to > 0) {
			this.envelope.gain.cancelAndHoldAtTime(when + duration + info.release.duration + 3);
			this.envelope.gain.linearRampToValueAtTime(0, 0.003 + when + duration + info.release.duration + 3);
			return 0.003 + when + duration + info.release.duration + 3;
		} else {
			return 0.003 + when + duration + info.release.duration;
		}*/
		return 5;
	}
}
