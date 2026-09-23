

/*
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
}*/
/*
class Param2 extends ToneWithContext2 {
	_param: AudioParam

	constructor(ac: AudioContext) {
		super(ac);
	}
}*/
/*
class ToneAudioNode2 extends ToneWithContext2 {


	constructor(ac: AudioContext) {
		super(ac);

	}
}*/
class Oscillator2 {
	_oscillator: OscillatorNode;
	frequency: Signal2;
	detune: Signal2;
	output: GainNode;
	audioContext: AudioContext;
	constructor(ac: AudioContext) {
		this.audioContext = ac;
		//this._oscillator = ac.createOscillator();
		this.detune = new Signal2(ac);
		this.output = ac.createGain();
	}
	start(when: number) {
		this._oscillator = new OscillatorNode(this.audioContext);
		this._oscillator.connect(this.output);
		this._oscillator.frequency.setValueAtTime(440, 0);
		//this.frequency.output.connect(this._oscillator.frequency);
		this.detune.output.connect(this._oscillator.detune);

		// start the oscillator
		this._oscillator.start(when);
	}

}

class Add2 {
	value: AudioParam;
	_sum: GainNode;
	input: GainNode;
	output: GainNode;
	param: AudioParam;
	constsource: ConstantSourceNode;

	constructor(ac: AudioContext) {
		this._sum = ac.createGain();
		this.param = this.constsource.offset;
		this.input = this._sum;
		this.output = this._sum;
		this.constsource = ac.createConstantSource();
		this.constsource.connect(this._sum);

	}
}
class Multiply2 {
	factor: AudioParam;
	_mult: GainNode;
	input: GainNode;
	output: GainNode;
	constsource: ConstantSourceNode;
	constructor(ac: AudioContext) {
		this._mult = ac.createGain();
		this.input = this._mult;
		this.output = this._mult;
		this.constsource = ac.createConstantSource();
		this.factor = this.constsource.offset;
		this.constsource.connect(this._mult);
	}
}
class Scale2 {
	input: Multiply2;
	output: Add2;
	constructor(ac: AudioContext) {
		this.input = new Multiply2(ac);
		this.output = new Add2(ac);
		this.input.output.connect(this.output.input);
	}
}
class LFO2 {
	_oscillator: Oscillator2;
	frequency: Signal2;
	min: number;
	max: number;
	_amplitudeGain: Gain2;
	amplitude: AudioParam;
	_stoppedSignal: Signal2;
	_a2g: AudioToGain2;
	_scaler: Scale2;
	output: Scale2;
	constructor(ac: AudioContext) {
		this._oscillator = new Oscillator2(ac);
		this.frequency = new Signal2(ac);
		this._amplitudeGain = new Gain2(ac);
		this._stoppedSignal = new Signal2(ac);
		this._a2g = new AudioToGain2(ac);
		this.output = this._scaler;
		//
		this.amplitude = this._amplitudeGain.gain;
		this.frequency = this._oscillator.frequency;


	}
	connectToDelay(delay: Delay2) {

	}
	connectToCrossFade(crossFade: CrossFade2) {

	}
	start(when: number) {

	}
}
class Gain2 {
	_gainNode: GainNode;
	gain: AudioParam;
	input: AudioNode;
	output: AudioNode;
	constructor(ac: AudioContext) {

		this._gainNode = ac.createGain();
		this.gain = this._gainNode.gain;
		this.input = this._gainNode;
		this.output = this._gainNode;
	}
	connectToDelay(delay: Delay2) {

	}

}
class Signal2 {
	_constantSource: ConstantSourceNode;
	output: ConstantSourceNode;
	value: number = 0;
	_param: AudioParam;
	input: AudioParam;
	constructor(ac: AudioContext) {
		this._constantSource = ac.createConstantSource();
		this.output = this._constantSource;
		this._param = this._constantSource.offset;
		this.input = this._param;
	}
	connectToSignal(destination: Signal2) {
		destination.input.cancelScheduledValues(0);
		destination.input.setValueAtTime(0, 0);
		this.output.connect(destination.input);
	}
}

class Delay2 {
	delayTime: AudioParam;
	_delayNode: DelayNode;
	input: AudioNode;
	output: AudioNode;
	constructor(ac: AudioContext) {

		this._delayNode = ac.createDelay(1);
		this.delayTime = this._delayNode.delayTime;
		this.input = this._delayNode;
		this.output = this._delayNode;
	}

	connectToCrossFade(crossFade: CrossFade2) {

	}
	connectToGain(gain: Gain2) {

	}
}

class WaveShaper2 {
	_shaper: WaveShaperNode;

	constructor(ac: AudioContext) {
		this._shaper = ac.createWaveShaper();

	}
	setCurve(mapping: Float32Array<ArrayBuffer> | null) {//Float32Array | null) {
		//setCurve(mapping: Float32Array | null) {
		if (mapping) {
			this._shaper.curve = mapping;
		}
	}
}
class AudioToGain2 {
	_norm: WaveShaper2;
	constructor(ac: AudioContext) {
		this._norm = new WaveShaper2(ac);
		//let fncurve = (x) => Math.abs(x) * 2 - 1;
		let curveLen = 1024;
		const array = new Float32Array(curveLen);
		for (let i = 0; i < curveLen; i++) {
			const normalized = (i / (curveLen - 1)) * 2 - 1;
			array[i] = this.curveFn(normalized);
		}
		this._norm.setCurve(array);
	}
	curveFn(value: number, index?: number) {
		return (value + 1) / 2;
		//mapping: (x) => (x + 1) / 2,
	}
}
class GainToAudio2 {
	_norm: WaveShaper2;
	constructor(ac: AudioContext) {
		this._norm = new WaveShaper2(ac);
		//let fncurve = (x) => Math.abs(x) * 2 - 1;
		let curveLen = 1024;
		const array = new Float32Array(curveLen);
		for (let i = 0; i < curveLen; i++) {
			const normalized = (i / (curveLen - 1)) * 2 - 1;
			array[i] = this.curveFn(normalized);
		}
		this._norm.setCurve(array);
	}
	curveFn(value: number, index?: number) {
		return Math.abs(value) * 2 - 1;
	}
}
class CrossFade2 {
	_panner: StereoPannerNode;
	_split: ChannelSplitterNode;
	_g2a: GainToAudio2;
	constructor(ac: AudioContext) {

		this._panner = ac.createStereoPanner();
		this._split = ac.createChannelSplitter(2);
		this._g2a = new GainToAudio2(ac);
	}
	connectToDelay(delay: Delay2) {

	}
	connectToGain(gain: Gain2) {

	}

}


class Effect2 {
	outputDryWet: CrossFade2;
	inputGainNode: GainNode;
	wet: Signal2;
	effectSend: Gain2;
	effectReturn: Gain2;

	constructor(ac: AudioContext) {


	}
}
class FeedbackEffect2 extends Effect2 {
	feedback: AudioParam;
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
class Synth2 {
	output: GainNode;
	constructor(ac: AudioContext) {
		this.output = ac.createGain();
	}
	start(when: number) {

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
let cuCo: AudioContext | null = null;
let synth: Synth2 | null = null;
function doTest2() {
	console.log('doTest2');
	if (cuCo) {

	} else {
		cuCo = new AudioContext();
		synth = new Synth2(cuCo);
		synth.output.connect(cuCo.destination);
	}
	if (cuCo) {
		if (synth) {
			synth.start(cuCo.currentTime + 0.1);
		}
	}

}