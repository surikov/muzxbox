class FxDelay {
	delayNode: DelayNode;
	constructor(currentContext: AudioContext) {
		this.delayNode = currentContext.createDelay();
	}
}
class FxSignal {
	constructor(currentContext: AudioContext) {

	}
}
class FxLFO {
	constructor(currentContext: AudioContext) {

	}
}
class FxShift {
	volume: GainNode;
	_frequency: FxSignal;
	_delayA: FxDelay;
	_delayB: FxDelay;
	_lfoA: FxLFO;
	_lfoB: FxLFO;
	_crossFade: FxLFO;
	_crossFadeLFO: FxLFO;
	_feedbackDelay: FxDelay;
	delayTime: number = 0;
	_pitch: number = 0;
	_windowSize: number = 0;
	constructor(currentContext: AudioContext) {
		this.volume = currentContext.createGain();
		this._frequency = new FxSignal(currentContext);
		this._delayA = new FxDelay(currentContext);
		this._delayB = new FxDelay(currentContext);
		this._feedbackDelay = new FxDelay(currentContext);
		this._lfoA = new FxLFO(currentContext);
		this._lfoB = new FxLFO(currentContext);
		this._crossFade = new FxLFO(currentContext);
		this._crossFadeLFO = new FxLFO(currentContext);

		
	}
	input(): AudioNode {
		return this.volume;
	}
	output(): AudioNode {
		return this.volume;
	}

}
