class FxDelay {
	volume: GainNode;
	delayTime: AudioParam;
	constructor(currentContext: AudioContext) {
		this.volume = currentContext.createGain();
		this.delayTime = new AudioParam();
	}
	input(): AudioNode {
		return this.volume;
	}
	output(): AudioNode {
		return this.volume;
	}
	inputDelayTime(): AudioParam {
		return this.delayTime;
	}
	inputEffect(): AudioParam {
		return this.delayTime;
	}
}
class FxSignal {
	volume: GainNode;
	constructor(currentContext: AudioContext) {
		this.volume = currentContext.createGain();
	}
	output(): AudioNode {
		return this.volume;
	}
}
class FxShaper {
	volume: GainNode;
	constructor(currentContext: AudioContext) {
		this.volume = currentContext.createGain();
	}
	output(): AudioNode {
		return this.volume;
	}
	input(): AudioNode {
		return this.volume;
	}
}
class FxGain {
	volume: GainNode;
	constructor(currentContext: AudioContext) {
		this.volume = currentContext.createGain();
	}
	input(): AudioNode {
		return this.volume;
	}
	output(): AudioNode {
		return this.volume;
	}
}
class FxLFO {
	volume: GainNode;
	frequency: GainNode;
	constructor(currentContext: AudioContext) {
		this.volume = currentContext.createGain();
		this.frequency = currentContext.createGain();
	}
	inputFrequency(): AudioNode {
		return this.frequency;
	}
	output(): AudioNode {
		return this.volume;
	}
	start(when: number) {
		//
	}
}
class FxCrossFade {
	aa: GainNode;
	bb: GainNode;
	outputNode: GainNode;
	fade: FxSignal;
	g2a: FxShaper;
	panner: StereoPannerNode;
	split: ChannelSplitterNode;
	buffer: AudioBufferSourceNode;
	constructor(currentContext: AudioContext) {
		this.aa = currentContext.createGain();
		this.bb = currentContext.createGain();
		this.outputNode = currentContext.createGain();
		this.fade = new FxSignal(currentContext);
		this.g2a = new FxShaper(currentContext);
		this.panner = currentContext.createStereoPanner();
		this.split = currentContext.createChannelSplitter(2);
		this.buffer = currentContext.createBufferSource();
		this.connect();
	}
	connect() {
		this.buffer.connect(this.panner);
		this.panner.connect(this.split);
		this.panner.channelCount = 1;
		this.panner.channelCountMode = "explicit";
		this.split.connect(this.aa, 0);
		this.split.connect(this.bb, 0);
		this.fade.output().connect(this.g2a.input());
		this.g2a.output().connect(this.panner);
		this.aa.connect(this.outputNode);
		this.bb.connect(this.outputNode);
	}
	inputA(): AudioNode {
		return this.aa;
	}
	inputB(): AudioNode {
		return this.bb;
	}
	inputFade(): AudioNode {
		return this.fade.output();
	}
	output(): AudioNode {
		return this.outputNode;
	}
}
class FxShift {
	volume: GainNode;
	frequency: FxSignal;
	delayA: FxDelay;
	delayB: FxDelay;
	lfoA: FxLFO;
	lfoB: FxLFO;
	crossFader: FxCrossFade;
	crossFadeLFO: FxLFO;
	feedbackDelay: FxDelay;
	delayTime: number = 0;
	effectSend: FxGain;
	effectReturn: FxGain;
	_pitch: number = 0;
	_windowSize: number = 0;
	constructor(currentContext: AudioContext) {
		this.createNodes(currentContext);
		this.connectNodes();
	}
	setupPitch(shift: number) {
		console.log('setupPitch', shift);
	}
	connectNodes() {
		this.lfoA.output().connect(this.delayA.inputDelayTime());
		this.lfoB.output().connect(this.delayB.inputDelayTime());
		this.crossFadeLFO.output().connect(this.crossFader.inputFade());
		this.delayA.output().connect(this.crossFader.inputA());
		this.delayB.output().connect(this.crossFader.inputB());
		this.frequency.output().connect(this.lfoA.inputFrequency());
		this.frequency.output().connect(this.lfoB.inputFrequency());
		this.frequency.output().connect(this.crossFadeLFO.inputFrequency());
		this.effectSend.output().connect(this.delayA.inputEffect());
		this.effectSend.output().connect(this.delayB.inputEffect());
	}
	createNodes(currentContext: AudioContext) {
		this.volume = currentContext.createGain();
		this.effectSend = new FxGain(currentContext);
		this.effectReturn = new FxGain(currentContext);
		this.frequency = new FxSignal(currentContext);
		this.delayA = new FxDelay(currentContext);
		this.delayB = new FxDelay(currentContext);
		this.feedbackDelay = new FxDelay(currentContext);
		this.lfoA = new FxLFO(currentContext);
		this.lfoB = new FxLFO(currentContext);
		this.crossFader = new FxCrossFade(currentContext);
		this.crossFadeLFO = new FxLFO(currentContext);
		this.crossFader.output().connect(this.feedbackDelay.input());
		this.crossFader.output().connect(this.effectReturn.input());
		let now = currentContext.currentTime;
		this.lfoA.start(now);
		this.lfoB.start(now);
		this.crossFadeLFO.start(now);
	}
	input(): AudioNode {
		return this.volume;
	}
	output(): AudioNode {
		return this.volume;
	}

}
