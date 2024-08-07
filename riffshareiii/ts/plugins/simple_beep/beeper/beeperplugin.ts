class SimpleBeepImplementation implements MZXBX_AudioPerformerPlugin {
	audioContext: AudioContext;
	oscillators: OscillatorNode[] = [];
	gain: GainNode;
	launch(context: AudioContext, parameters: string): void {
		this.audioContext = context;
		this.gain = this.audioContext.createGain();
	}
	busy(): null | string {
		return null;
	}
	schedule(when: number, duraton: number, pitches: number[], tempo: number, slides: MZXBX_SlideItem[]) {
		if (this.audioContext) {
			if (this.gain) {

				this.cancel();
				for (let ii = 0; ii < pitches.length; ii++) {
					console.log('schedule', when, duraton, pitches[ii], tempo, slides);
					let oscillator: OscillatorNode = this.audioContext.createOscillator();
					let A4frequency = 440.0;
					let A4half = 48;
					let frequency = A4frequency * Math.pow(Math.pow(2, (1 / 12)), pitches[ii] - A4half);
					oscillator.frequency.setValueAtTime(frequency, 0);
					oscillator.connect(this.gain);
					oscillator.start(when);
					oscillator.stop(when + duraton);
					this.oscillators.push(oscillator);
				}
			}
		}
	}
	cancel(): void {
		for (let ii = 0; ii < this.oscillators.length; ii++) {
			this.oscillators[ii].stop(0);
		}
		this.oscillators = [];
	}
	output(): AudioNode | null {
		if (this.gain) {
			return this.gain;
		} else {
			return null;
		}
	}
}
function newSimpleBeepImplementation():MZXBX_AudioPerformerPlugin{
	return new SimpleBeepImplementation();
}
