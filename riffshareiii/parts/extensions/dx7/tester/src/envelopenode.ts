type SlopeInfo = {
	duration: number
	, from: number
	, to: number
};
class EnvelopeNode {
	minTimeDelta: number = 0.005;
	maxReleaseDelta: number = 0.5;
	envelopeContext: AudioContext;
	envelopeGain: GainNode;
	//slopes: SlopeInfo[] = [];
	attack: SlopeInfo;
	decay: SlopeInfo;
	sustain: SlopeInfo;
	release: SlopeInfo;
	doneTime: number = 0;
	constructor(ctx: AudioContext) {
		this.envelopeContext = ctx;
		this.envelopeGain = this.envelopeContext.createGain();
		this.down0now();
	}
	scale99(nn: number): number {
		let speed = Math.pow(2, nn * 0.16 - 11);
		return speed;
	}
	durationDown(nn: number): number {
		//let ss = this.scale99(nn);
		//return 0.095 / ss;
		return 0.008 + 318 * Math.pow(2, (99 - nn) * 0.16) / Math.pow(2, 99 * 0.16);
	}
	durationUp(nn: number): number {
		//return  this.durationDown(nn)/4;
		return 0.003 + 38 * Math.pow(2, (99 - nn) * 0.16) / Math.pow(2, 99 * 0.16);
	}
	levelRatio(nn: number): number {
		let ratio = Math.log(nn + 1) * 14 + nn;
		return ratio;
	}
	/*level99to1value(nn: number) {
		let rr = Math.pow(2.55, nn / 10 - 7.45) / 10;
		return rr;
	}*/
	slopeDuration(r99: number, from99: number, to99: number): SlopeInfo {
		let fromRatio = this.levelRatio(from99);
		let toRatio = this.levelRatio(to99);
		let fullRatio = this.levelRatio(100);
		let partDuration = Math.abs(fromRatio - toRatio) / fullRatio;
		let fullDuration = this.durationDown(r99);
		//console.log(r99, 'partDuration', partDuration, 'fullDuration', fullDuration, 'speed', this.scale99(r99));
		if (from99 < to99) {
			fullDuration = this.durationUp(r99);
		}
		let slope = {
			duration: partDuration * fullDuration
			, from: this.scale99(from99) / 32
			, to: this.scale99(to99) / 32
		};
		//console.log('slopeDuration', r99, from99, to99, slope, fullDuration, partDuration);
		return slope;
	}
	setupEnvelope(rates99: number[], levels99: number[]) {
		this.attack = this.slopeDuration(rates99[0], levels99[3], levels99[0]);
		this.decay = this.slopeDuration(rates99[1], levels99[0], levels99[1]);
		this.sustain = this.slopeDuration(rates99[2], levels99[1], levels99[2]);
		this.release = this.slopeDuration(rates99[3], levels99[2], levels99[3]);

	}
	startEnvelope(when: number, wholeDuration: number): number {
		this.envelopeGain.gain.setValueAtTime(this.attack.from, when);
		this.envelopeGain.gain.linearRampToValueAtTime(this.attack.to, when + this.attack.duration);
		this.envelopeGain.gain.linearRampToValueAtTime(this.decay.to, when + this.attack.duration + this.decay.duration);
		this.envelopeGain.gain.linearRampToValueAtTime(this.sustain.to, when + this.attack.duration + this.decay.duration + this.sustain.duration);
		this.envelopeGain.gain.cancelAndHoldAtTime(when + wholeDuration);
		this.envelopeGain.gain.exponentialRampToValueAtTime(this.release.from, 0.003 + when + wholeDuration);
		this.envelopeGain.gain.linearRampToValueAtTime(this.release.to, 0.003 + when + wholeDuration + this.release.duration);
		return 0.003 + when + wholeDuration + this.release.duration;
	}
	down0now() {
		this.envelopeGain.gain.cancelScheduledValues(this.envelopeContext.currentTime);
		this.envelopeGain.gain.value = 0;
	}
}
