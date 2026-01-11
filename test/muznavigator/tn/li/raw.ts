


class Tone2 {

	constructor(ac: AudioContext) {

	}
}
class ToneWithContext2 extends Tone2 {
	_audioContext: AudioContext;
	constructor(ac: AudioContext) {
		super(ac);
		this._audioContext = ac;
	}
}
class Param2 extends ToneWithContext2 {
	input: GainNode;
	_param: AudioParam

	constructor(ac: AudioContext) {
		super(ac);

	}
}
class ToneAudioNode2 extends ToneWithContext2 {


	constructor(ac: AudioContext) {
		super(ac);

	}
}
class Oscillator2 extends ToneAudioNode2 {

	constructor(ac: AudioContext) {
		super(ac);

	}
}
class Source2 extends ToneAudioNode2 {

	constructor(ac: AudioContext) {
		super(ac);

	}
}
class LFO2 extends ToneAudioNode2 {
	_oscillator: Oscillator2;
	frequency: Signal2;
	min: number;
	max: number;
	constructor(ac: AudioContext) {
		super(ac);

	}
	connectToDelay(delay: Delay2) {

	}
	connectToCrossFade(crossFade: CrossFade2) {

	}
	start(when: number) {

	}
}
class Gain2 extends ToneAudioNode2 {

	constructor(ac: AudioContext) {
		super(ac);

	}
	connectToDelay(delay: Delay2) {

	}

}
class Signal2 extends ToneAudioNode2 {
	_constantSource:ConstantSourceNode;
	value:number=0;
	constructor(ac: AudioContext) {
		super(ac);

	}
	connectToSignal(signal: Signal2) {

	}
}

class Delay2 extends ToneAudioNode2 {
	delayTime: Param2;

	constructor(ac: AudioContext) {
		super(ac);

	}
	connectToCrossFade(crossFade: CrossFade2) {

	}
	connectToGain(gain: Gain2) {

	}
}
class CrossFade2 extends ToneAudioNode2 {

	constructor(ac: AudioContext) {
		super(ac);

	}
	connectToDelay(delay: Delay2) {

	}
	connectToGain(gain: Gain2) {

	}

}


class Effect2 extends ToneAudioNode2 {
	outputDryWet: CrossFade2;
	inputGainNode: GainNode;
	wet: Signal2;
	effectSend: Gain2;
	effectReturn: Gain2;

	constructor(ac: AudioContext) {
		super(ac);

	}
}
class FeedbackEffect2 extends Effect2 {
	feedback: Param2;
	_feedbackGain: Gain2;

	constructor(ac: AudioContext) {
		super(ac);

	}
}

class PitchShift2 extends FeedbackEffect2
//FeedbackEffect<PitchShiftOptions> 
{
	//readonly name: string = "PitchShift";
	private _frequency: Signal2;//<"frequency">;
	_delayA: Delay2;
	private _lfoA: LFO2;
	private _delayB: Delay2;
	private _lfoB: LFO2;
	private _crossFade: CrossFade2;
	private _crossFadeLFO: LFO2;
	private _feedbackDelay: Delay2;
	//readonly delayTime: Param<"time">;
	//private _pitch: Interval;
	private _windowSampleSize: number;

	inputNode: GainNode;
	outputNode: GainNode;

	shiftFrom(node: AudioNode) {
		//connect(node, this);
		node.connect(this.inputNode);
	}
	shiftTo(node: AudioNode) {
		//connect(this, node);
		this.outputNode.connect(node);
	}
	connectToGain(gain: Gain2) {

	}
	constructor(ac: AudioContext) {
		super(ac);


		/*super({
			feedback: 0.125,
			wet: 1,
			context: getContext()
		});*/

		this._frequency = new Signal2(ac);//{ context: this.context });
		this._delayA = new Delay2(ac);//({ maxDelay: 1, context: this.context, });
		this._lfoA = new LFO2(ac);//({ context: this.context, min: 0, max: 0.1, type: "sawtooth", });

		this._delayB = new Delay2(ac);//({ maxDelay: 1, context: this.context, });
		this._lfoB = new LFO2(ac);//({ context: this.context, min: 0, max: 0.1, type: "sawtooth", phase: 180, });

		this._crossFade = new CrossFade2(ac);//({ context: this.context });
		this._crossFadeLFO = new LFO2(ac);//({ context: this.context, min: 0, max: 1, type: "triangle", phase: 90, });

		this._feedbackDelay = new Delay2(ac);//({ delayTime: 0, context: this.context, });
		//this.delayTime = this._feedbackDelay.delayTime;
		//this._pitch = 0;
		//this._lfoA.connect(this._delayA.delayTime);
		this._lfoA.connectToDelay(this._delayA);
		//this._lfoB.connect(this._delayB.delayTime);
		this._lfoB.connectToDelay(this._delayB);
		//this._crossFadeLFO.connect(this._crossFade.fade);
		this._crossFadeLFO.connectToCrossFade(this._crossFade);
		/**
	 * The window size corresponds roughly to the sample length in a looping sampler.
	 * Smaller values are desirable for a less noticeable delay time of the pitch shifted
	 * signal, but larger values will result in smoother pitch shifting for larger intervals.
	 * A nominal range of 0.03 to 0.1 is recommended.
	 */
		this._windowSampleSize = 0.1;
		// connect the two delay lines up
		//this._delayA.connect(this._crossFade.a);
		this._delayA.connectToCrossFade(this._crossFade);
		//this._delayB.connect(this._crossFade.b);
		this._delayB.connectToCrossFade(this._crossFade);
		// connect the frequency
		//this._frequency.fan(this._lfoA.frequency, this._lfoB.frequency, this._crossFadeLFO.frequency);
		this._frequency.connectToSignal(this._lfoA.frequency);
		this._frequency.connectToSignal(this._lfoB.frequency);
		this._frequency.connectToSignal(this._crossFadeLFO.frequency);
		// route the input
		//this.effectSend.fan(this._delayA, this._delayB);
		this.effectSend.connectToDelay(this._delayA);
		this.effectSend.connectToDelay(this._delayB);
		//this._crossFade.chain(this._feedbackDelay, this.effectReturn);
		this._crossFade.connectToDelay(this._feedbackDelay);
		this._feedbackDelay.connectToGain(this.effectReturn);
		// start the LFOs at the same time
		//const now = this.now();
		let when = ac.currentTime + 0.1;
		this._lfoA.start(when);
		this._lfoB.start(when);
		this._crossFadeLFO.start(when);
		// set the initial value
		//this.windowSize = this._windowSampleSize;
	}

	/**
	 * Repitch the incoming signal by some interval (measured in semi-tones).
	 * @example
	 * const pitchShift = new Tone.PitchShift().toDestination();
	 * const osc = new Tone.Oscillator().connect(pitchShift).start().toDestination();
	 * pitchShift.pitch = -12; // down one octave
	 * pitchShift.pitch = 7; // up a fifth
	 */
	/*get pitch() {
		return this._pitch;
	}*/
	//set pitch(interval) {
	setupPitch(interval: number) {
		//this._pitch = interval;
		let factor = 0;
		if (interval < 0) {
			this._lfoA.min = 0;
			this._lfoA.max = this._windowSampleSize;
			this._lfoB.min = 0;
			this._lfoB.max = this._windowSampleSize;
			factor = intervalToFrequencyRatio(interval - 1) + 1;
		} else {
			this._lfoA.min = this._windowSampleSize;
			this._lfoA.max = 0;
			this._lfoB.min = this._windowSampleSize;
			this._lfoB.max = 0;
			factor = intervalToFrequencyRatio(interval) - 1;
		}
		this._frequency.value = factor * (1.2 / this._windowSampleSize);
	}

	/**
	 * The window size corresponds roughly to the sample length in a looping sampler.
	 * Smaller values are desirable for a less noticeable delay time of the pitch shifted
	 * signal, but larger values will result in smoother pitch shifting for larger intervals.
	 * A nominal range of 0.03 to 0.1 is recommended.
	 */
	/*get windowSize(): Seconds {
		return this._windowSampleSize;
	}*/
	/*setupWindowSize(size) {
		this._windowSampleSize = this.toSeconds(size);
		//this.pitch = this._pitch;
		this.setupPitch(this._pitch);
	}*/

	dispose(): this {
		/*
		super.dispose();
		this._frequency.dispose();
		this._delayA.dispose();
		this._delayB.dispose();
		this._lfoA.dispose();
		this._lfoB.dispose();
		this._crossFade.dispose();
		this._crossFadeLFO.dispose();
		this._feedbackDelay.dispose();
		*/
		return this;
	}
}
//console.log('retone',window['Tone']);
//window['Tone'].PitchShift=PitchShift;
function createShift2(ac: AudioContext) {
	let sh = new PitchShift2(ac);
	console.log('created2', sh);
	return sh;
}
function createShift() {
	let sh = new PitchShift();
	console.log('created', sh);
	return sh;
}
//console.log(window['Tone'].PitchShift);
