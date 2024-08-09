class SimpleBeepImplementation implements MZXBX_AudioPerformerPlugin {
	audioContext: AudioContext;
	oscillators: OscillatorNode[] = [];
	volume: GainNode;
	launch(context: AudioContext, parameters: string): void {
		this.audioContext = context;
		this.volume = this.audioContext.createGain();
		this.volume.gain.setValueAtTime(0.7, 0);
	}
	busy(): null | string {
		return null;
	}
	schedule(when: number, pitches: number[], tempo: number, slides: MZXBX_SlideItem[]) {
		if (this.audioContext) {
			if (this.volume) {
				let duration: number = 0;
				for (let ss = 0; ss < slides.length; ss++) {
					duration = duration + slides[ss].duration;
				}
				let A4frequency = 440.0;
				let A4half = 48;
				this.cancel();
				for (let ii = 0; ii < pitches.length; ii++) {
					console.log('schedule', when, duration, pitches[ii], tempo, slides);
					let oscillator: OscillatorNode = this.audioContext.createOscillator();
					let currentPitch = pitches[ii];
					let frequency = A4frequency * Math.pow(Math.pow(2, (1 / 12)), currentPitch - A4half);
					oscillator.frequency.setValueAtTime(frequency, when);
					let currentWhen = when;
					for (let ss = 0; ss < slides.length; ss++) {
						frequency = A4frequency * Math.pow(Math.pow(2, (1 / 12)), currentPitch - A4half);
						currentWhen = currentWhen + slides[ss].duration
						currentPitch = currentPitch + slides[ss].delta;
						oscillator.frequency.linearRampToValueAtTime(frequency, currentWhen);
					}
					oscillator.connect(this.volume);
					oscillator.start(when);
					oscillator.stop(when + duration);
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
		if (this.volume) {
			return this.volume;
		} else {
			return null;
		}
	}
}
function newSimpleBeepImplementation(): MZXBX_AudioPerformerPlugin {
	return new SimpleBeepImplementation();
}
