type SlopeInfo = {
	duration: number, from: number, to: number
};
class EnvelopeNode {
	minTimeDelta: number = 0.005;
	maxReleaseDelta: number = 0.5;
	envelopeContext: AudioContext;
	envelopeGain: GainNode;
	slopes: SlopeInfo[] = [];
	doneTime: number = 0;
	constructor(ctx: AudioContext) {
		this.envelopeContext = ctx;
		this.envelopeGain = this.envelopeContext.createGain();
		this.down0now();
	}
	level99to1value(nn: number) {
		let rr = Math.pow(2.55, nn / 10 - 7.45) / 10;
		return rr;
	}
	slopeDuration(r99: number, from99: number, to99: number): SlopeInfo {
		let speed = Math.pow(2, r99 * 0.16 - 11);
		let fullDuration = 0.17 / speed;
		if (from99 < to99) {
			fullDuration = fullDuration / 2;
		}

		let from = this.level99to1value(from99);
		let to = this.level99to1value(to99);
		let partLevel = Math.abs(from99 - to99) / 100;
		let partDuration = fullDuration * partLevel;
		console.log(r99, speed, 'duration', fullDuration, '/', partDuration, ':', from, '>', to, ':', partLevel,);
		return { duration: partDuration, from: from, to: to };
	}
	setupEnvelope(rates99: number[], levels99: number[]) {
		this.slopes[0] = this.slopeDuration(rates99[0], levels99[3], levels99[0]);
		this.slopes[1] = this.slopeDuration(rates99[1], levels99[0], levels99[1]);
		this.slopes[2] = this.slopeDuration(rates99[2], levels99[1], levels99[2]);
		this.slopes[3] = this.slopeDuration(rates99[3], levels99[2], levels99[3]);
		console.log('rates', rates99, 'levels', levels99, 'slopes', this.slopes);
	}
	startEnvelope(when: number, wholeDuration: number) {
		//attack
		this.envelopeGain.gain.setValueAtTime(this.slopes[0].from, when);
		this.envelopeGain.gain.linearRampToValueAtTime(this.slopes[0].to, when + this.slopes[0].duration);
		//decay
		this.envelopeGain.gain.cancelAndHoldAtTime(when + this.slopes[0].duration);
		this.envelopeGain.gain.linearRampToValueAtTime(this.slopes[1].from, 0.001 + when + this.slopes[0].duration);
		this.envelopeGain.gain.linearRampToValueAtTime(this.slopes[1].to, when + this.slopes[0].duration + this.slopes[1].duration);
		//hold
		this.envelopeGain.gain.cancelAndHoldAtTime(when + this.slopes[0].duration + this.slopes[1].duration);
		this.envelopeGain.gain.linearRampToValueAtTime(this.slopes[2].from, 0.001 + when + this.slopes[0].duration + this.slopes[1].duration);
		this.envelopeGain.gain.linearRampToValueAtTime(this.slopes[2].to, when + this.slopes[0].duration + this.slopes[1].duration + this.slopes[2].duration);
		//release
		this.envelopeGain.gain.cancelAndHoldAtTime(when + wholeDuration);
		this.envelopeGain.gain.linearRampToValueAtTime(this.slopes[3].from, 0.001 + when + wholeDuration);
		this.envelopeGain.gain.linearRampToValueAtTime(this.slopes[3].to, when + wholeDuration + this.slopes[3].duration);
	}
	down0now() {
		this.envelopeGain.gain.cancelScheduledValues(this.envelopeContext.currentTime);
		this.envelopeGain.gain.value = 0;
	}
}
