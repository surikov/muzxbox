class EnvelopeNode {
	minTimeDelta: number = 0.005;
	maxReleaseDelta: number = 0.5;
	envelopeContext: AudioContext;
	envelopeGain: GainNode;
	constructor(ctx: AudioContext) {
		this.envelopeContext = ctx;
		this.envelopeGain = this.envelopeContext.createGain();
	}
	down0now() {
		this.envelopeGain.gain.cancelScheduledValues(this.envelopeContext.currentTime);
		this.envelopeGain.gain.linearRampToValueAtTime(0, this.envelopeContext.currentTime + this.minTimeDelta);
	}
	slopeDuration(preLevel: number, nextLevel: number, rate: number) {
		let volDiff = Math.abs(preLevel - nextLevel) / 100;
		let radians = rate * ((Math.PI * 0.5) / 100);
		let timeDiff = volDiff / Math.tan(radians);//a = b / tg(β)
		return timeDiff;
	}
	setLevelRate(level1: number, rate1: number
		, level2: number, rate2: number
		, level3: number, rate3: number
		, level4: number, rate4: number
		, when: number, duration: number
	) {
		let whenLevel1 = when + this.slopeDuration(level4, level1, rate1);
		let whenLevel2 = whenLevel1 + this.slopeDuration(level1, level2, rate2);
		let whenLevel3 = whenLevel2 + this.slopeDuration(level2, level3, rate3);
		let whenLevel4 = when + duration + this.slopeDuration(level3, level4, rate4);
		this.down0now();
		this.envelopeGain.gain.linearRampToValueAtTime(level4 / 100, when );
		this.envelopeGain.gain.linearRampToValueAtTime(level1 / 100, whenLevel1);
		this.envelopeGain.gain.linearRampToValueAtTime(level2 / 100, whenLevel2);
		this.envelopeGain.gain.linearRampToValueAtTime(level3 / 100, whenLevel3);
		this.envelopeGain.gain.cancelAndHoldAtTime(when + duration);
		this.envelopeGain.gain.linearRampToValueAtTime(level4 / 100, whenLevel4);
		this.envelopeGain.gain.cancelAndHoldAtTime(when + duration + this.maxReleaseDelta);
		this.envelopeGain.gain.linearRampToValueAtTime(0, when + duration + this.maxReleaseDelta + this.minTimeDelta);
	}
}
