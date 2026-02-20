class OperatorDX7 {
	minimalDelta: number = 0.001;
	//outOperators: OperatorDX7[] = [];
	//outDestination: AudioNode | null = null;
	onNotOff: boolean = false;
	ocntxt: AudioContext;
	osc: OscillatorNode;
	outGain: GainNode;
	envelope: EnvelopeNode;
	eg: { level1: number, level2: number, level3: number, level4: number, rate1: number, rate2: number, rate3: number, rate4: number };
	adsr: { attackDuration: number, attackVolume: number, decayDuration: number, decayVolume: number, releaseDuration: number } = {
		attackDuration: 0.01
		, attackVolume: 1
		, decayDuration: 0.02
		, decayVolume: 0.5
		, releaseDuration: 0.2
	};
	//freqRatio: number = 1;
	constructor(cntxt: AudioContext) {
		this.ocntxt = cntxt;
		//this.oenvelope = this.ocntxt.createGain();
		this.envelope = new EnvelopeNode(this.ocntxt);
		this.osc = this.ocntxt.createOscillator();
		//this.osc.connect(this.oenvelope);
		this.osc.connect(this.envelope.envelopeGain);
		this.outGain = this.ocntxt.createGain();

		this.envelope.envelopeGain.connect(this.outGain);

		this.envelope.down0now();
		this.osc.start(this.ocntxt.currentTime + this.envelope.minTimeDelta);
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
	startOperator(level1: number, rate1: number
		, level2: number, rate2: number
		, level3: number, rate3: number
		, level4: number, rate4: number
		, when: number, duration: number, pitch: number
		, oscMode: number, freqRatio: number, freqFixed: number
	) {
		if (this.onNotOff) {
			console.log('startOperator', when, pitch);
			/*
						this.oenvelope.disconnect();
						this.oenvelope.gain.setValueAtTime(0, when);
						this.oenvelope.gain.linearRampToValueAtTime(this.adsr.attackVolume, when + this.adsr.attackDuration);
						this.oenvelope.gain.linearRampToValueAtTime(this.adsr.decayVolume, when + this.adsr.attackDuration + this.adsr.decayDuration);
						this.oenvelope.gain.linearRampToValueAtTime(this.adsr.decayVolume, when + duration);
						this.oenvelope.gain.linearRampToValueAtTime(0, when + duration + this.adsr.releaseDuration);
						if (this.outDestination) {
							this.oenvelope.connect(this.outDestination);
						}
			*/

			//this.envelope.setLevelRate(88, 90, 33, 80, 99, 70, 55, 60, when, duration);
			this.envelope.setLevelRate(level1, rate1, level2, rate2, level3, rate3, level4, rate4, when, duration);
			let opefrequency = freqRatio * this.frequencyFromNoteNumber(pitch);
			if (oscMode > 0) {
				opefrequency = freqFixed;
			}
			this.osc.frequency.setValueAtTime(opefrequency, this.ocntxt.currentTime);
			//this.osc.start(when);
			//this.osc.stop(when + duration + this.adsr.releaseDuration);
			//console.log('osc',when,(when + duration + this.adsr.releaseDuration));

		}
	}
	connectToOutputNode(outNode: AudioNode) {
		this.outGain.connect(outNode);
	}
	connectSendToOperator(opDX7: OperatorDX7) {
		this.outGain.connect(opDX7.osc.detune);
	}
}
