class OperatorDX7 {
	outOperators: OperatorDX7[] = [];
	outDestination: AudioNode | null = null;
	onNotOff: boolean = false;
	ocntxt: AudioContext;
	osc: OscillatorNode | null = null;
	oenvelope: GainNode;
	eg: { level1: number, level2: number, level3: number, level4: number, rate1: number, rate2: number, rate3: number, rate4: number };
	adsr: { attackDuration: number, attackVolume: number, decayDuration: number, decayVolume: number, releaseDuration: number } = {
		attackDuration: 0.01
		, attackVolume: 1
		, decayDuration: 0.02
		, decayVolume: 0.5
		, releaseDuration: 0.03
	};
	freqRatio: number = 1;
	constructor(cntxt: AudioContext) {
		this.ocntxt = cntxt;
		this.oenvelope = this.ocntxt.createGain();
	}
	/*setupCarrier(){
		console.log('setupCarrier');
	}*/
	/*setupModulator(){
		console.log('setupModulator');
	}*/
	/*outputToOperator(to: OperatorDX7) {
		this.outOperators.push(to);
	}
	outputToDestination(destination: AudioNode) {
		this.outDestination = destination;
	}*/
	frequencyFromNoteNumber(note: number) {
		return 440 * Math.pow(2, (note - 69) / 12);
	};
	startOperator(when: number, duration: number, pitch: number) {
		if (this.onNotOff) {
			console.log('startOperator', when, pitch);

			this.oenvelope.disconnect();
			this.oenvelope.gain.setValueAtTime(0, when);
			this.oenvelope.gain.linearRampToValueAtTime(this.adsr.attackVolume, when + this.adsr.attackDuration);
			this.oenvelope.gain.linearRampToValueAtTime(this.adsr.decayVolume, when + this.adsr.attackDuration + this.adsr.decayDuration);
			this.oenvelope.gain.linearRampToValueAtTime(this.adsr.decayVolume, when + duration);
			this.oenvelope.gain.linearRampToValueAtTime(0, when + duration + this.adsr.releaseDuration);
			if (this.outDestination) {
				this.oenvelope.connect(this.outDestination);
			}

			this.osc = this.ocntxt.createOscillator();
			this.osc.connect(this.oenvelope);
			this.osc.frequency.setValueAtTime(this.freqRatio * this.frequencyFromNoteNumber(pitch), when);
			this.osc.start(when);
			this.osc.stop(when + duration + this.adsr.releaseDuration);
		}
	}
}
