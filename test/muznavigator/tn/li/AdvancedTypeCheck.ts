/*import {
	AudioBuffer,
	isAnyAudioContext,
	isAnyAudioNode,
	isAnyAudioParam,
	isAnyOfflineAudioContext,
} from "standardized-audio-context";
*/
type TIsNativeAudioParamFunction = (anything: unknown) => anything is TNativeAudioParam;
type TNativeAudioParam = AudioParam;
interface IAudioParam {
	readonly defaultValue: number;

	readonly maxValue: number;

	readonly minValue: number;

	value: number;

	cancelAndHoldAtTime(cancelTime: number): IAudioParam;

	cancelScheduledValues(cancelTime: number): IAudioParam;

	exponentialRampToValueAtTime(value: number, endTime: number): IAudioParam;

	linearRampToValueAtTime(value: number, endTime: number): IAudioParam;

	setTargetAtTime(target: number, startTime: number, timeConstant: number): IAudioParam;

	setValueAtTime(value: number, startTime: number): IAudioParam;

	setValueCurveAtTime(values: number[] | Float32Array, startTime: number, duration: number): IAudioParam;
}
type TAudioParamStore = WeakMap<IAudioParam, TNativeAudioParam>;
type TIsAnyAudioParamFunction = (anything: unknown) => anything is IAudioParam | TNativeAudioParam;
type TIsAnyAudioParamFactory = (
	audioParamStore: TAudioParamStore,
	isNativeAudioParam: TIsNativeAudioParamFunction
) => TIsAnyAudioParamFunction;
const createIsAnyAudioParam: TIsAnyAudioParamFactory = (audioParamStore, isNativeAudioParam) => {
	return (anything): anything is IAudioParam | TNativeAudioParam => audioParamStore.has(<any>anything) || isNativeAudioParam(anything);
};
const AUDIO_PARAM_STORE: TAudioParamStore = new WeakMap();
type TWindow = Window & typeof globalThis;
type TIsNativeAudioParamFactory = (window: null | TWindow) => TIsNativeAudioParamFunction;
const createIsNativeAudioParam: TIsNativeAudioParamFactory = (window) => {
	return (anything): anything is TNativeAudioParam => {
		return window !== null && typeof window.AudioParam === 'function' && anything instanceof window.AudioParam;
	};
};
const isNativeAudioParam = createIsNativeAudioParam(window);
const isAnyAudioParam = createIsAnyAudioParam(AUDIO_PARAM_STORE, isNativeAudioParam);
type TNativeEventTarget = EventTarget;
interface IEventTarget<EventMap extends Record<string, Event>> extends TNativeEventTarget {
	addEventListener<Type extends keyof EventMap>(
		type: Type,
		listener: (this: this, event: EventMap[Type]) => void,
		options?: boolean | AddEventListenerOptions
	): void;
	addEventListener(type: string, listener: null | EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;

	removeEventListener<Type extends keyof EventMap>(
		type: Type,
		listener: (this: this, event: EventMap[Type]) => void,
		options?: boolean | EventListenerOptions
	): void;
	removeEventListener(type: string, callback: null | EventListenerOrEventListenerObject, options?: EventListenerOptions | boolean): void;
}
interface IMinimalBaseAudioContextEventMap extends Record<string, Event> {
	statechange: Event;
}
interface IAudioDestinationNode<T extends TContext> extends IAudioNode<T> {
	readonly maxChannelCount: number;
}
interface IAudioListener {
	readonly forwardX: IAudioParam;

	readonly forwardY: IAudioParam;

	readonly forwardZ: IAudioParam;

	readonly positionX: IAudioParam;

	readonly positionY: IAudioParam;

	readonly positionZ: IAudioParam;

	readonly upX: IAudioParam;

	readonly upY: IAudioParam;

	readonly upZ: IAudioParam;
}
type TEventHandler<T, U extends Event = Event> = (ThisType<T> & { handler(event: U): void })['handler'];
type TAudioContextState = 'closed' | 'interrupted' | 'running' | 'suspended';
interface IMinimalBaseAudioContext<T extends TContext> extends IEventTarget<IMinimalBaseAudioContextEventMap> {
	readonly currentTime: number;

	readonly destination: IAudioDestinationNode<T>;

	readonly listener: IAudioListener;

	onstatechange: null | TEventHandler<T>;

	readonly sampleRate: number;

	readonly state: TAudioContextState;
}
interface IWorkletOptions {
	credentials: 'include' | 'omit' | 'same-origin';
}
interface IAudioWorklet {
	addModule(moduleURL: string, options?: IWorkletOptions): Promise<void>;
}
interface IAnalyserNode<T extends TContext> extends IAudioNode<T> {
	fftSize: number;

	readonly frequencyBinCount: number;

	maxDecibels: number;

	minDecibels: number;

	smoothingTimeConstant: number;

	getByteFrequencyData(array: Uint8Array): void;

	getByteTimeDomainData(array: Uint8Array): void;

	getFloatFrequencyData(array: Float32Array): void;

	getFloatTimeDomainData(array: Float32Array): void;
}
type TBiquadFilterType = 'allpass' | 'bandpass' | 'highpass' | 'highshelf' | 'lowpass' | 'lowshelf' | 'notch' | 'peaking';
interface IBiquadFilterNode<T extends TContext> extends IAudioNode<T> {
	readonly detune: IAudioParam;

	readonly frequency: IAudioParam;

	readonly gain: IAudioParam;

	readonly Q: IAudioParam;

	type: TBiquadFilterType;

	getFrequencyResponse(frequencyHz: Float32Array, magResponse: Float32Array, phaseResponse: Float32Array): void;
}
interface IAudioBuffer {
	readonly duration: number;

	readonly length: number;

	readonly numberOfChannels: number;

	readonly sampleRate: number;

	copyFromChannel(destination: Float32Array, channelNumber: number, bufferOffset?: number): void;

	copyToChannel(source: Float32Array, channelNumber: number, bufferOffset?: number): void;

	getChannelData(channel: number): Float32Array<ArrayBuffer>;
}
interface IAudioScheduledSourceNodeEventMap extends Record<string, Event> {
	ended: Event;
}
interface IAudioScheduledSourceNode<T extends TContext> extends IAudioNode<T, IAudioScheduledSourceNodeEventMap> {
	onended: null | TEventHandler<this>;

	start(when?: number): void;

	stop(when?: number): void;
}
type TNativeAudioBuffer = AudioBuffer;
type TAnyAudioBuffer = IAudioBuffer | TNativeAudioBuffer;
interface IAudioBufferSourceNode<T extends TContext> extends IAudioScheduledSourceNode<T> {
	buffer: null | TAnyAudioBuffer;

	readonly detune: IAudioParam;

	loop: boolean;

	loopEnd: number;

	loopStart: number;

	readonly playbackRate: IAudioParam;

	start(when?: number, offset?: number, duration?: number): void;
}
interface IConstantSourceNode<T extends TContext> extends IAudioScheduledSourceNode<T> {
	readonly offset: IAudioParam;
}
interface IConvolverNode<T extends TContext> extends IAudioNode<T> {
	buffer: null | TAnyAudioBuffer;

	normalize: boolean;
}
interface IDelayNode<T extends TContext> extends IAudioNode<T> {
	readonly delayTime: IAudioParam;
}
interface IDynamicsCompressorNode<T extends TContext> extends IAudioNode<T> {
	readonly attack: IAudioParam;

	readonly knee: IAudioParam;

	readonly ratio: IAudioParam;

	readonly reduction: number;

	readonly release: IAudioParam;

	readonly threshold: IAudioParam;
}
interface IGainNode<T extends TContext> extends IAudioNode<T> {
	readonly gain: IAudioParam;
}
interface IIIRFilterNode<T extends TContext> extends IAudioNode<T> {
	getFrequencyResponse(frequencyHz: Float32Array, magResponse: Float32Array, phaseResponse: Float32Array): void;
}
type TOscillatorType = 'custom' | 'sawtooth' | 'sine' | 'square' | 'triangle';
interface IOscillatorNode<T extends TContext> extends IAudioScheduledSourceNode<T> {
	readonly detune: IAudioParam;

	readonly frequency: IAudioParam;

	type: TOscillatorType;

	setPeriodicWave(periodicWave: PeriodicWave): void;
}
type TDistanceModelType = 'exponential' | 'inverse' | 'linear';
type TPanningModelType = 'HRTF' | 'equalpower';
interface IPannerNode<T extends TContext> extends IAudioNode<T> {
	coneInnerAngle: number;

	coneOuterAngle: number;

	coneOuterGain: number;

	distanceModel: TDistanceModelType;

	maxDistance: number;

	readonly orientationX: IAudioParam;

	readonly orientationY: IAudioParam;

	readonly orientationZ: IAudioParam;

	panningModel: TPanningModelType;

	readonly positionX: IAudioParam;

	readonly positionY: IAudioParam;

	readonly positionZ: IAudioParam;

	refDistance: number;

	rolloffFactor: number;
}
interface IStereoPannerNode<T extends TContext> extends IAudioNode<T> {
	readonly pan: IAudioParam;
}
type TOverSampleType = '2x' | '4x' | 'none';
interface IWaveShaperNode<T extends TContext> extends IAudioNode<T> {
	curve: null | Float32Array;

	oversample: TOverSampleType;
}
type TDecodeSuccessCallback = (decodedData: IAudioBuffer) => void;
type TDecodeErrorCallback = (error: DOMException | TypeError) => void;
interface IPeriodicWaveConstraints {
	disableNormalization: boolean;
}
interface IPeriodicWave { } // tslint:disable-line:no-empty-interface
interface IBaseAudioContext<T extends TContext> extends IMinimalBaseAudioContext<T> {
	// The audioWorklet property is only available in a SecureContext.
	readonly audioWorklet?: IAudioWorklet;

	createAnalyser(): IAnalyserNode<T>;

	createBiquadFilter(): IBiquadFilterNode<T>;

	createBuffer(numberOfChannels: number, length: number, sampleRate: number): IAudioBuffer;

	createBufferSource(): IAudioBufferSourceNode<T>;

	createChannelMerger(numberOfInputs?: number): IAudioNode<T>;

	createChannelSplitter(numberOfOutputs?: number): IAudioNode<T>;

	createConstantSource(): IConstantSourceNode<T>;

	createConvolver(): IConvolverNode<T>;

	createDelay(maxDelayTime?: number): IDelayNode<T>;

	createDynamicsCompressor(): IDynamicsCompressorNode<T>;

	createGain(): IGainNode<T>;

	createIIRFilter(feedforward: Iterable<number>, feedback: Iterable<number>): IIIRFilterNode<T>;

	createOscillator(): IOscillatorNode<T>;

	createPanner(): IPannerNode<T>;

	createPeriodicWave(real: Iterable<number>, imag: Iterable<number>, constraints?: Partial<IPeriodicWaveConstraints>): IPeriodicWave;

	createStereoPanner(): IStereoPannerNode<T>;

	createWaveShaper(): IWaveShaperNode<T>;

	decodeAudioData(
		audioData: ArrayBuffer,
		successCallback?: TDecodeSuccessCallback,
		errorCallback?: TDecodeErrorCallback
	): Promise<AudioBuffer>;
}
interface ICommonAudioContext {
	readonly baseLatency: number;

	close(): Promise<void>;

	// @todo This should be part of the IMinimalBaseAudioContext.
	resume(): Promise<void>;

	suspend(): Promise<void>;
}
interface IMinimalAudioContext extends ICommonAudioContext, IMinimalBaseAudioContext<IMinimalAudioContext> { };
interface IMediaElementAudioSourceNode<T extends IAudioContext | IMinimalAudioContext> extends IAudioNode<T> {
	readonly mediaElement: HTMLMediaElement;
}
interface IMediaStreamAudioDestinationNode<T extends IAudioContext | IMinimalAudioContext> extends IAudioNode<T> {
	readonly stream: MediaStream;
}
interface IMediaStreamAudioSourceNode<T extends IAudioContext | IMinimalAudioContext> extends IAudioNode<T> {
	readonly mediaStream: MediaStream;
}
interface IMediaStreamTrackAudioSourceNode<T extends IAudioContext | IMinimalAudioContext> extends IAudioNode<T> { }
interface IAudioTimestamp {
	contextTime: number;

	performanceTime: number;
}

interface IAudioContext extends IBaseAudioContext<IAudioContext>, ICommonAudioContext {
	createMediaElementSource(mediaElement: HTMLMediaElement): IMediaElementAudioSourceNode<this>;

	createMediaStreamDestination(): IMediaStreamAudioDestinationNode<this>;

	createMediaStreamSource(mediaStream: MediaStream): IMediaStreamAudioSourceNode<this>;

	createMediaStreamTrackSource(mediaStreamTrack: MediaStreamTrack): IMediaStreamTrackAudioSourceNode<this>;

	getOutputTimestamp(): IAudioTimestamp;
}
interface ICommonOfflineAudioContext {
	readonly length: number;

	startRendering(): Promise<AudioBuffer>;
}
interface IMinimalOfflineAudioContext extends ICommonOfflineAudioContext, IMinimalBaseAudioContext<IMinimalOfflineAudioContext> { }
interface IOfflineAudioContext extends IBaseAudioContext<IOfflineAudioContext>, ICommonOfflineAudioContext {
	// @todo oncomplete
}
type TContext = IAudioContext | IMinimalAudioContext | IMinimalOfflineAudioContext | IOfflineAudioContext;
type TChannelCountMode = 'clamped-max' | 'explicit' | 'max';
type TChannelInterpretation = 'discrete' | 'speakers';
interface IAudioNode<T extends TContext, EventMap extends Record<string, Event> = {}> extends IEventTarget<EventMap> {
	channelCount: number;

	channelCountMode: TChannelCountMode;

	channelInterpretation: TChannelInterpretation;

	readonly context: T;

	readonly numberOfInputs: number;

	readonly numberOfOutputs: number;

	connect<U extends TContext, OtherEventMap extends Record<string, Event>, V extends IAudioNode<U, OtherEventMap>>(
		destinationNode: V,
		output?: number,
		input?: number
	): V;
	connect(destinationParam: IAudioParam, output?: number): void;

	disconnect(output?: number): void;
	disconnect<U extends TContext, OtherEventMap extends Record<string, Event>>(
		destinationNode: IAudioNode<U, OtherEventMap>,
		output?: number,
		input?: number
	): void;
	disconnect(destinationParam: IAudioParam, output?: number): void;
}
type TNativeAudioNode = AudioNode;
type TIsAnyAudioNodeFunction = (anything: unknown) => anything is IAudioNode<any> | TNativeAudioNode;
/**
 * Test if the given value is an instanceof AudioParam
 */
//export 
function isAudioParam(arg: any): arg is AudioParam {
	return isAnyAudioParam(arg);
}

/**
 * Test if the given value is an instanceof AudioNode
 */
type TIsNativeAudioNodeFunction = (anything: unknown) => anything is TNativeAudioNode;
type TAudioNodeStore = WeakMap<IAudioNode<TContext>, TNativeAudioNode>;
type TIsAnyAudioNodeFactory = (
	audioNodeStore: TAudioNodeStore,
	isNativeAudioNode: TIsNativeAudioNodeFunction
) => TIsAnyAudioNodeFunction;
const createIsAnyAudioNode: TIsAnyAudioNodeFactory = (audioNodeStore, isNativeAudioNode) => {
	return (anything): anything is IAudioNode<any> | TNativeAudioNode => audioNodeStore.has(<any>anything) || isNativeAudioNode(anything);
};
const AUDIO_NODE_STORE: TAudioNodeStore = new WeakMap();
type TIsNativeAudioNodeFactory = (window: null | TWindow) => TIsNativeAudioNodeFunction;
const createIsNativeAudioNode: TIsNativeAudioNodeFactory = (window) => {
	return (anything): anything is TNativeAudioNode => {
		return window !== null && typeof window.AudioNode === 'function' && anything instanceof window.AudioNode;
	};
};
const isNativeAudioNode = createIsNativeAudioNode(window);
const isAnyAudioNode = createIsAnyAudioNode(AUDIO_NODE_STORE, isNativeAudioNode);
//export 
function isAudioNode(arg: any): arg is AudioNode {
	return isAnyAudioNode(arg);
}

/**
 * Test if the arg is instanceof an OfflineAudioContext
 */
type TNativeMediaStreamTrackAudioSourceNode = typeof globalThis extends { MediaStreamTrackAudioSourceNode: any }
	? never
	: TNativeAudioNode;
type ExceptOptions = {
	/**
	Disallow assigning non-specified properties.

	Note that any omitted properties in the resulting type will be present in autocomplete as `undefined`.

	@default false
	*/
	requireExactProps?: boolean;
};
type IsAny<T> = 0 extends 1 & NoInfer<T> ? true : false;

type IsOptionalKeyOf<Type extends object, Key extends keyof Type> =
	IsAny<Type | Key> extends true ? never
	: Key extends keyof Type
	? Type extends Record<Key, Type[Key]>
	? false
	: true
	: false;

type OptionalKeysOf<Type extends object> =
	Type extends unknown // For distributing `Type`
	? (keyof { [Key in keyof Type as
		IsOptionalKeyOf<Type, Key> extends false
		? never
		: Key
		]: never
	}) & keyof Type // Intersect with `keyof Type` to ensure result of `OptionalKeysOf<Type>` is always assignable to `keyof Type`
	: never; // Should never happen
type PickIndexSignature<ObjectType> = {
	[KeyType in keyof ObjectType as {} extends Record<KeyType, unknown>
	? KeyType
	: never]: ObjectType[KeyType];
};
type OmitIndexSignature<ObjectType> = {
	[KeyType in keyof ObjectType as {} extends Record<KeyType, unknown>
	? never
	: KeyType]: ObjectType[KeyType];
};
type RequiredKeysOf<Type extends object> =
	Type extends unknown // For distributing `Type`
	? Exclude<keyof Type, OptionalKeysOf<Type>>
	: never; // Should never happen

type SimpleMerge<Destination, Source> = {
	[Key in keyof Destination as Key extends keyof Source ? never : Key]: Destination[Key];
} & Source;
type If<Type extends boolean, IfBranch, ElseBranch> =
	IsNever<Type> extends true
	? ElseBranch
	: Type extends true
	? IfBranch
	: ElseBranch;
type IsNever<T> = [T] extends [never] ? true : false;
type Merge<Destination, Source> =
	Simplify<
		SimpleMerge<PickIndexSignature<Destination>, PickIndexSignature<Source>>
		& SimpleMerge<OmitIndexSignature<Destination>, OmitIndexSignature<Source>>
	>;

type ApplyDefaultOptions<
	Options extends object,
	Defaults extends Simplify<Omit<Required<Options>, RequiredKeysOf<Options>> & Partial<Record<RequiredKeysOf<Options>, never>>>,
	SpecifiedOptions extends Options,
> =
	If<IsAny<SpecifiedOptions>, Defaults,
		If<IsNever<SpecifiedOptions>, Defaults,
			Simplify<Merge<Defaults, {
				[Key in keyof SpecifiedOptions
				as Key extends OptionalKeysOf<Options> ? undefined extends SpecifiedOptions[Key] ? never : Key : Key
				]: SpecifiedOptions[Key]
			}> & Required<Options>>>>; // `& Required<Options>` ensures that `ApplyDefaultOptions<SomeOption, ...>` is always assignable to `Required<SomeOption>`
type DefaultExceptOptions = {
	requireExactProps: false;
};
type TWithAdditionalProperty<BaseType, Property extends keyof any, PropertyType> =
	BaseType extends Record<Property, any> ? never : BaseType & Record<Property, PropertyType>;
//export 
type Except<ObjectType, KeysType extends keyof ObjectType, Options extends ExceptOptions = {}> =
	_Except<ObjectType, KeysType, ApplyDefaultOptions<ExceptOptions, DefaultExceptOptions, Options>>;




type _IsEqual<A, B> =
	(<G>() => G extends A & G | G ? 1 : 2) extends
	(<G>() => G extends B & G | G ? 1 : 2)
	? true
	: false;
type IsEqual<A, B> =
	[A] extends [B]
	? [B] extends [A]
	? _IsEqual<A, B>
	: false
	: false;
type Filter<KeyType, ExcludeType> = IsEqual<KeyType, ExcludeType> extends true ? never : (KeyType extends ExcludeType ? never : KeyType);
type _Except<ObjectType, KeysType extends keyof ObjectType, Options extends Required<ExceptOptions>> = {
	[KeyType in keyof ObjectType as Filter<KeyType, KeysType>]: ObjectType[KeyType];
} & (Options['requireExactProps'] extends true
	? Partial<Record<KeysType, never>>
	: {});
type SetOptional<BaseType, Keys extends keyof BaseType> =
	(BaseType extends (...arguments_: never) => any
		? (...arguments_: Parameters<BaseType>) => ReturnType<BaseType>
		: unknown)
	& _SetOptional<BaseType, Keys>;
type Simplify<T> = { [KeyType in keyof T]: T[KeyType] } & {};





type UnionToIntersection<Union> = (
	// `extends unknown` is always going to be the case and is used to convert the
	// `Union` into a [distributive conditional
	// type](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#distributive-conditional-types).
	Union extends unknown
	// The union type is used as the only argument to a function since the union
	// of function arguments is an intersection.
	? (distributedUnion: Union) => void
	// This won't happen.
	: never
	// Infer the `Intersection` type since TypeScript represents the positional
	// arguments of unions of functions as an intersection of the union.
) extends ((mergedIntersection: infer Intersection) => void)
	// The `& Union` is to ensure result of `UnionToIntersection<A | B>` is always assignable to `A | B`
	? Intersection & Union
	: never;


type KeysOfUnion<ObjectType> =
	// Hack to fix https://github.com/sindresorhus/type-fest/issues/1008
	keyof UnionToIntersection<ObjectType extends unknown ? Record<keyof ObjectType, never> : never>;

type HomomorphicPick<T, Keys extends KeysOfUnion<T>> = {
	[P in keyof T as Extract<P, Keys>]: T[P]
};
type _SetOptional<BaseType, Keys extends keyof BaseType> =
	BaseType extends unknown // To distribute `BaseType` when it's a union type.
	? Simplify<
		// Pick just the keys that are readonly from the base type.
		Except<BaseType, Keys> &
		// Pick the keys that should be mutable from the base type and make them mutable.
		Partial<HomomorphicPick<BaseType, Keys>>
	>
	: never;
type TNativeAudioContext = SetOptional<
	TWithAdditionalProperty<
		AudioContext,
		'createMediaStreamTrackSource',
		(mediaStreamTrack: MediaStreamTrack) => TNativeMediaStreamTrackAudioSourceNode
	>,
	'createMediaStreamTrackSource'
>;









type TNativeOfflineAudioContext = OfflineAudioContext;
type TNativeContext = TNativeAudioContext | TNativeOfflineAudioContext;
type TContextStore = WeakMap<TContext, TNativeContext>;
type TIsNativeOfflineAudioContextFunction = (anything: unknown) => anything is TNativeOfflineAudioContext;
type TIsAnyOfflineAudioContextFunction = (
	anything: unknown
) => anything is IMinimalOfflineAudioContext | IOfflineAudioContext | TNativeOfflineAudioContext;

type TIsAnyOfflineAudioContextFactory = (
	contextStore: TContextStore,
	isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction
) => TIsAnyOfflineAudioContextFunction;
const createIsAnyOfflineAudioContext: TIsAnyOfflineAudioContextFactory = (contextStore, isNativeOfflineAudioContext) => {
	return (anything): anything is IMinimalOfflineAudioContext | IOfflineAudioContext | TNativeOfflineAudioContext => {
		const nativeContext = contextStore.get(<any>anything);

		return isNativeOfflineAudioContext(nativeContext) || isNativeOfflineAudioContext(anything);
	};
};
const CONTEXT_STORE: TContextStore = new WeakMap();
type TNativeOfflineAudioContextConstructor = typeof OfflineAudioContext;
type TIsNativeOfflineAudioContextFactory = (
	nativeOfflineAudioContextConstructor: null | TNativeOfflineAudioContextConstructor
) => TIsNativeOfflineAudioContextFunction;

const createIsNativeOfflineAudioContext: TIsNativeOfflineAudioContextFactory = (nativeOfflineAudioContextConstructor) => {
	return (anything): anything is TNativeOfflineAudioContext => {
		return nativeOfflineAudioContextConstructor !== null && anything instanceof nativeOfflineAudioContextConstructor;
	};
};
type TNativeOfflineAudioContextConstructorFactory = (window: null | TWindow) => null | TNativeOfflineAudioContextConstructor;
const createNativeOfflineAudioContextConstructor: TNativeOfflineAudioContextConstructorFactory = (window) => {
	if (window !== null && 'OfflineAudioContext' in window) {
		return window.OfflineAudioContext;
	}

	return null;
};

const nativeOfflineAudioContextConstructor = createNativeOfflineAudioContextConstructor(window);
const isNativeOfflineAudioContext = createIsNativeOfflineAudioContext(nativeOfflineAudioContextConstructor);
const isAnyOfflineAudioContext = createIsAnyOfflineAudioContext(CONTEXT_STORE, isNativeOfflineAudioContext);
//export 
function isOfflineAudioContext(arg: any): arg is OfflineAudioContext {
	return isAnyOfflineAudioContext(arg);
}

/**
 * Test if the arg is an instanceof AudioContext
 */
type TIsNativeAudioContextFunction = (anything: unknown) => anything is TNativeAudioContext;
type TIsAnyAudioContextFunction = (anything: unknown) => anything is IAudioContext | IMinimalAudioContext | TNativeAudioContext;
type TIsAnyAudioContextFactory = (
	contextStore: TContextStore,
	isNativeAudioContext: TIsNativeAudioContextFunction
) => TIsAnyAudioContextFunction;

const createIsAnyAudioContext: TIsAnyAudioContextFactory = (contextStore, isNativeAudioContext) => {
	return (anything): anything is IAudioContext | IMinimalAudioContext | TNativeAudioContext => {
		const nativeContext = contextStore.get(<any>anything);

		return isNativeAudioContext(nativeContext) || isNativeAudioContext(anything);
	};
};
type TNativeAudioContextConstructor = new (options?: AudioContextOptions) => TNativeAudioContext;

type TIsNativeAudioContextFactory = (
	nativeAudioContextConstructor: null | TNativeAudioContextConstructor
) => TIsNativeAudioContextFunction;

const createIsNativeAudioContext: TIsNativeAudioContextFactory = (nativeAudioContextConstructor) => {
	return (anything): anything is TNativeAudioContext => {
		return nativeAudioContextConstructor !== null && anything instanceof nativeAudioContextConstructor;
	};
};
type TNativeAudioContextConstructorFactory = (window: null | TWindow) => null | TNativeAudioContextConstructor;

const createNativeAudioContextConstructor: TNativeAudioContextConstructorFactory = (window) => {
	if (window !== null && 'AudioContext' in window) {
		return window.AudioContext;
	}

	return null;
};

const nativeAudioContextConstructor = createNativeAudioContextConstructor(window);
const isNativeAudioContext = createIsNativeAudioContext(nativeAudioContextConstructor);
const isAnyAudioContext = createIsAnyAudioContext(CONTEXT_STORE, isNativeAudioContext);
//export 
function isAudioContext(arg: any): arg is AudioContext {
	return isAnyAudioContext(arg);
}

/**
 * Test if the arg is instanceof an AudioBuffer
 */
//export 
function isAudioBuffer(arg: any): arg is AudioBuffer {
	return arg instanceof AudioBuffer;
}
