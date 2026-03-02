var OCTAVE_1024 = 1.0006771307; //Math.exp(Math.log(2)/1024);
class OperatorDX7 {
	minimalDelta: number = 0.001;
	//outOperators: OperatorDX7[] = [];
	//outDestination: AudioNode | null = null;
	onNotOff: boolean = false;
	ocntxt: AudioContext;
	osc: OscillatorNode;
	outGain: GainNode;
	envelope: EnvelopeNode;
	velocitySens0_7: number = 0;
	level0_99: number = 0;
	lfoAmpModSens_3_3: number = 0;
	freqCoarse0_31: number = 0;
	freqCoarseFixed0_3: number = 0;
	freqFine0_99: number = 0;
	detune_7_7: number = 0;

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
		, oscMode: number, freqCoarse: number, freqFine: number, detune: number
		, volume:number
	) {
		if (this.onNotOff) {
			console.log('startOperator', when, pitch, ('' + freqCoarse + '.' + freqFine + '/' + detune), ('' + volume + '%'));
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

			let detuneRatio = Math.pow(OCTAVE_1024, detune);
			//this.envelope.setLevelRate(88, 90, 33, 80, 99, 70, 55, 60, when, duration);
			this.envelope.setLevelRate(level1, rate1, level2, rate2, level3, rate3, level4, rate4, when, duration,volume);
if(freqCoarse==0)freqCoarse=0.5;
			//let freqRatio = (freqCoarse || 0.5) * (1 + freqFine / 100);
			let freqRatio = freqCoarse * (1 + freqFine / 100);
			let opefrequency = detuneRatio * freqRatio * this.frequencyFromNoteNumber(pitch);
			if (oscMode > 0) {
				opefrequency = Math.pow(10, freqCoarse % 4) * (1 + (freqFine / 99) * 8.772);;
			}
			/*console.log('freq', freqRatio
				, this.frequencyFromNoteNumber(pitch), '>', freqRatio * this.frequencyFromNoteNumber(pitch), '>', opefrequency
				, ':', detuneRatio, detune);
*/
			this.osc.frequency.setValueAtTime(opefrequency, this.ocntxt.currentTime);
			//this.osc.start(when);
			//this.osc.stop(when + duration + this.adsr.releaseDuration);
			//console.log('osc',when,(when + duration + this.adsr.releaseDuration));
			//this.outGain.gain.setValueAtTime(outputLevel016 / 16, this.ocntxt.currentTime);
			this.outGain.gain.setValueAtTime(volume / 100, this.ocntxt.currentTime);
		}
	}
	connectToOutputNode(outNode: AudioNode) {
		this.outGain.connect(outNode);
	}
	connectSendToOperator(opDX7: OperatorDX7) {
		this.outGain.connect(opDX7.osc.detune);
	}
	/*updateFrequencyByCoarseFine(op: { freqCoarse: number, freqFine: number, freqRatio: number, freqFixed: number, oscMode: number }) {
		//var op = params.operators[operatorIndex];
		if (op.oscMode == 0) {
			var freqCoarse = op.freqCoarse || 0.5; // freqCoarse of 0 is used for ratio of 0.5
			op.freqRatio = freqCoarse * (1 + op.freqFine / 100);
		} else {
			op.freqFixed = Math.pow(10, op.freqCoarse % 4) * (1 + (op.freqFine / 99) * 8.772);
		}
	};*/
}
