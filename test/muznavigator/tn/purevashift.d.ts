type IntegerRange<N extends number, A extends any[] = []> = A["length"] extends N ? A[number] : IntegerRange<N, [...A, A["length"]]>;
type MidiNote = IntegerRange<128>;
declare const notifyNewContext: Array<(ctx: Context) => void>;
declare function onContextInit(cb: (ctx: Context) => void): void;
declare function initializeContext(ctx: Context): void;
declare const notifyCloseContext: Array<(ctx: Context) => void>;
declare function onContextClose(cb: (ctx: Context) => void): void;
declare function closeContext(ctx: Context): void;
declare const version: string;
interface BaseToneOptions {
}
declare abstract class Tone {
    static version: string;
    name: string;
    static getDefaults(): BaseToneOptions;
    debug: boolean;
    protected log(...args: any[]): void;
    private _wasDisposed;
    dispose(): this;
    get disposed(): boolean;
    toString(): string;
}
declare class Tone2 extends Tone {
    name: string;
}
type TimeValue = Time | TimeBaseClass<any, any>;
type TimeBaseUnit = "s" | "n" | "t" | "m" | "i" | "hz" | "tr" | "samples" | "number";
interface TypeFunction {
    regexp: RegExp;
    method: (value: string, ...args: string[]) => number;
}
interface TimeExpression<Type extends number> {
    [key: string]: {
        regexp: RegExp;
        method: (value: string, ...args: string[]) => Type;
    };
}
declare abstract class TimeBaseClass<Type extends number, Unit extends string> extends Tone {
    readonly context: BaseContext;
    protected _val?: TimeValue;
    protected _units?: Unit;
    protected _expressions: TimeExpression<Type>;
    readonly defaultUnits: Unit;
    constructor(context: BaseContext, value?: TimeValue, units?: Unit);
    protected _getExpressions(): TimeExpression<Type>;
    valueOf(): Type;
    protected _frequencyToUnits(freq: Hertz): Type;
    protected _beatsToUnits(beats: number): Type;
    protected _secondsToUnits(seconds: Seconds): Type;
    protected _ticksToUnits(ticks: Ticks): Type;
    protected _noArg(): Type;
    protected _getBpm(): BPM;
    protected _getTimeSignature(): number;
    protected _getPPQ(): number;
    protected abstract _now(): Type;
    fromType(type: TimeBaseClass<any, any>): this;
    abstract toSeconds(): Seconds;
    abstract toMidi(): MidiNote;
    abstract toTicks(): Ticks;
    toFrequency(): Hertz;
    toSamples(): Samples;
    toMilliseconds(): Milliseconds;
}
declare class TimeClass<Type extends Seconds | Ticks = Seconds, Unit extends string = TimeBaseUnit> extends TimeBaseClass<Type, Unit> {
    readonly name: string;
    protected _getExpressions(): TimeExpression<Type>;
    quantize(subdiv: Time, percent?: number): Type;
    toNotation(): Subdivision;
    toBarsBeatsSixteenths(): BarsBeatsSixteenths;
    toTicks(): Ticks;
    toSeconds(): Seconds;
    toMidi(): MidiNote;
    protected _now(): Type;
}
declare function Time(value?: TimeValue, units?: TimeBaseUnit): TimeClass<Seconds>;
type FrequencyUnit = TimeBaseUnit | "midi";
declare class FrequencyClass<Type extends number = Hertz> extends TimeClass<Type, FrequencyUnit> {
    readonly name: string;
    readonly defaultUnits: FrequencyUnit;
    static get A4(): Hertz;
    static set A4(freq: Hertz);
    protected _getExpressions(): TimeExpression<Type>;
    transpose(interval: Interval): FrequencyClass;
    harmonize(intervals: Interval[]): FrequencyClass[];
    toMidi(): MidiNote;
    toNote(): Note;
    toSeconds(): Seconds;
    toTicks(): Ticks;
    protected _noArg(): Type;
    protected _frequencyToUnits(freq: Hertz): Type;
    protected _ticksToUnits(ticks: Ticks): Type;
    protected _beatsToUnits(beats: number): Type;
    protected _secondsToUnits(seconds: Seconds): Type;
    static mtof(midi: MidiNote): Hertz;
    static ftom(frequency: Hertz): MidiNote;
}
declare const noteToScaleIndex: {
    cbbb: number;
    cbb: number;
    cb: number;
    c: number;
    "c#": number;
    cx: number;
    "c##": number;
    "c###": number;
    "cx#": number;
    "c#x": number;
    dbbb: number;
    dbb: number;
    db: number;
    d: number;
    "d#": number;
    dx: number;
    "d##": number;
    "d###": number;
    "dx#": number;
    "d#x": number;
    ebbb: number;
    ebb: number;
    eb: number;
    e: number;
    "e#": number;
    ex: number;
    "e##": number;
    "e###": number;
    "ex#": number;
    "e#x": number;
    fbbb: number;
    fbb: number;
    fb: number;
    f: number;
    "f#": number;
    fx: number;
    "f##": number;
    "f###": number;
    "fx#": number;
    "f#x": number;
    gbbb: number;
    gbb: number;
    gb: number;
    g: number;
    "g#": number;
    gx: number;
    "g##": number;
    "g###": number;
    "gx#": number;
    "g#x": number;
    abbb: number;
    abb: number;
    ab: number;
    a: number;
    "a#": number;
    ax: number;
    "a##": number;
    "a###": number;
    "ax#": number;
    "a#x": number;
    bbbb: number;
    bbb: number;
    bb: number;
    b: number;
    "b#": number;
    bx: number;
    "b##": number;
    "b###": number;
    "bx#": number;
    "b#x": number;
};
declare const scaleIndexToNote: string[];
declare function Frequency(value?: TimeValue | Frequency, units?: FrequencyUnit): FrequencyClass;
interface EmitterEventObject {
    [event: string]: Array<(...args: any[]) => void>;
}
declare class Emitter<EventType extends string = string> extends Tone {
    readonly name: string;
    private _events?;
    on(event: EventType, callback: (...args: any[]) => void): this;
    once(event: EventType, callback: (...args: any[]) => void): this;
    off(event: EventType, callback?: (...args: any[]) => void): this;
    emit(event: EventType, ...args: any[]): this;
    static mixin(constr: any): void;
    dispose(): this;
}
type ExcludedFromBaseAudioContext = "onstatechange" | "addEventListener" | "removeEventListener" | "listener" | "dispatchEvent" | "audioWorklet" | "destination" | "createScriptProcessor";
type BaseAudioContextSubset = Omit<BaseAudioContext, ExcludedFromBaseAudioContext>;
type ContextLatencyHint = AudioContextLatencyCategory;
declare abstract class BaseContext extends Emitter<"statechange" | "tick"> implements BaseAudioContextSubset {
    abstract createAnalyser(): AnalyserNode;
    abstract createOscillator(): OscillatorNode;
    abstract createBufferSource(): AudioBufferSourceNode;
    abstract createBiquadFilter(): BiquadFilterNode;
    abstract createBuffer(_numberOfChannels: number, _length: number, _sampleRate: number): AudioBuffer;
    abstract createChannelMerger(_numberOfInputs?: number | undefined): ChannelMergerNode;
    abstract createChannelSplitter(_numberOfOutputs?: number | undefined): ChannelSplitterNode;
    abstract createConstantSource(): ConstantSourceNode;
    abstract createConvolver(): ConvolverNode;
    abstract createDelay(_maxDelayTime?: number | undefined): DelayNode;
    abstract createDynamicsCompressor(): DynamicsCompressorNode;
    abstract createGain(): GainNode;
    abstract createIIRFilter(_feedForward: number[] | Float32Array, _feedback: number[] | Float32Array): IIRFilterNode;
    abstract createPanner(): PannerNode;
    abstract createPeriodicWave(_real: number[] | Float32Array, _imag: number[] | Float32Array, _constraints?: PeriodicWaveConstraints | undefined): PeriodicWave;
    abstract createStereoPanner(): StereoPannerNode;
    abstract createWaveShaper(): WaveShaperNode;
    abstract createMediaStreamSource(_stream: MediaStream): MediaStreamAudioSourceNode;
    abstract createMediaElementSource(_element: HTMLMediaElement): MediaElementAudioSourceNode;
    abstract createMediaStreamDestination(): MediaStreamAudioDestinationNode;
    abstract decodeAudioData(_audioData: ArrayBuffer): Promise<AudioBuffer>;
    abstract createAudioWorkletNode(_name: string, _options?: Partial<AudioWorkletNodeOptions>): AudioWorkletNode;
    abstract get rawContext(): AnyAudioContext;
    abstract addAudioWorkletModule(_url: string): Promise<void>;
    abstract lookAhead: number;
    abstract latencyHint: ContextLatencyHint | Seconds;
    abstract resume(): Promise<void>;
    abstract setTimeout(_fn: (...args: any[]) => void, _timeout: Seconds): number;
    abstract clearTimeout(_id: number): this;
    abstract setInterval(_fn: (...args: any[]) => void, _interval: Seconds): number;
    abstract clearInterval(_id: number): this;
    abstract getConstant(_val: number): AudioBufferSourceNode;
    abstract get currentTime(): Seconds;
    abstract get state(): AudioContextState;
    abstract get sampleRate(): number;
    abstract get listener(): Listener;
    abstract get transport(): Transport;
    abstract get draw(): Draw;
    abstract get destination(): Destination;
    abstract now(): Seconds;
    abstract immediate(): Seconds;
    toJSON(): Record<string, any>;
    readonly isOffline: boolean;
}
type Listener = ListenerInstance;
type Transport = TransportInstance;
type Draw = DrawInstance;
type Destination = DestinationInstance;
declare class DummyContext extends BaseContext {
    createAnalyser(): AnalyserNode;
    createOscillator(): OscillatorNode;
    createBufferSource(): AudioBufferSourceNode;
    createBiquadFilter(): BiquadFilterNode;
    createBuffer(_numberOfChannels: number, _length: number, _sampleRate: number): AudioBuffer;
    createChannelMerger(_numberOfInputs?: number | undefined): ChannelMergerNode;
    createChannelSplitter(_numberOfOutputs?: number | undefined): ChannelSplitterNode;
    createConstantSource(): ConstantSourceNode;
    createConvolver(): ConvolverNode;
    createDelay(_maxDelayTime?: number | undefined): DelayNode;
    createDynamicsCompressor(): DynamicsCompressorNode;
    createGain(): GainNode;
    createIIRFilter(_feedForward: number[] | Float32Array, _feedback: number[] | Float32Array): IIRFilterNode;
    createPanner(): PannerNode;
    createPeriodicWave(_real: number[] | Float32Array, _imag: number[] | Float32Array, _constraints?: PeriodicWaveConstraints | undefined): PeriodicWave;
    createStereoPanner(): StereoPannerNode;
    createWaveShaper(): WaveShaperNode;
    createMediaStreamSource(_stream: MediaStream): MediaStreamAudioSourceNode;
    createMediaElementSource(_element: HTMLMediaElement): MediaElementAudioSourceNode;
    createMediaStreamDestination(): MediaStreamAudioDestinationNode;
    decodeAudioData(_audioData: ArrayBuffer): Promise<AudioBuffer>;
    createAudioWorkletNode(_name: string, _options?: Partial<AudioWorkletNodeOptions>): AudioWorkletNode;
    get rawContext(): AnyAudioContext;
    addAudioWorkletModule(_url: string): Promise<void>;
    lookAhead: number;
    latencyHint: number;
    resume(): Promise<void>;
    setTimeout(_fn: (...args: any[]) => void, _timeout: Seconds): number;
    clearTimeout(_id: number): this;
    setInterval(_fn: (...args: any[]) => void, _interval: Seconds): number;
    clearInterval(_id: number): this;
    getConstant(_val: number): AudioBufferSourceNode;
    get currentTime(): Seconds;
    get state(): AudioContextState;
    get sampleRate(): number;
    get listener(): Listener;
    get transport(): Transport;
    get draw(): Draw;
    set draw(_d: Draw);
    get destination(): Destination;
    set destination(_d: Destination);
    now(): number;
    immediate(): number;
    readonly isOffline: boolean;
}
declare class stdAudioContext {
    constructor(options?: AudioContextOptions);
}
declare class stdOfflineAudioContext {
    constructor(channels: number, length: number, sampleRate: number);
}
declare class stdAudioWorkletNode {
}
declare function createAudioContext(options?: AudioContextOptions): AudioContext;
declare function createOfflineAudioContext(channels: number, length: number, sampleRate: number): OfflineAudioContext;
type AnyAudioContext = AudioContext | OfflineAudioContext;
interface ToneWindow extends Window {
    TONE_SILENCE_LOGGING?: boolean;
    TONE_DEBUG_CLASS?: string;
    BaseAudioContext: any;
    AudioWorkletNode: any;
}
declare const theWindow: ToneWindow | null;
declare const hasAudioContext: boolean | null;
declare function createAudioWorkletNode(context: AnyAudioContext, name: string, options?: Partial<AudioWorkletNodeOptions>): AudioWorkletNode;
declare const dummyContext: DummyContext;
declare let globalContext: BaseContext;
declare function getContext(): BaseContext;
declare function setContext(context: BaseContext | AnyAudioContext, disposeOld?: boolean): void;
declare function start(): Promise<void>;
interface ContextOptions {
    clockSource: TickerClockSource;
    latencyHint: ContextLatencyHint;
    lookAhead: Seconds;
    updateInterval: Seconds;
    context: AnyAudioContext;
    sampleRate: number;
}
interface ContextTimeoutEvent {
    callback: (...args: any[]) => void;
    id: number;
    time: Seconds;
}
declare class Context extends BaseContext {
    readonly name: string;
    protected readonly _context: AnyAudioContext;
    private readonly _ticker;
    private _latencyHint;
    private _constants;
    private _timeouts;
    private _timeoutIds;
    private _transport;
    private _listener;
    private _destination;
    private _draw;
    private _initialized;
    private _closeStarted;
    readonly isOffline: boolean;
    constructor(context?: AnyAudioContext);
    constructor(options?: Partial<ContextOptions>);
    static getDefaults(): ContextOptions;
    private initialize;
    createAnalyser(): AnalyserNode;
    createOscillator(): OscillatorNode;
    createBufferSource(): AudioBufferSourceNode;
    createBiquadFilter(): BiquadFilterNode;
    createBuffer(numberOfChannels: number, length: number, sampleRate: number): AudioBuffer;
    createChannelMerger(numberOfInputs?: number | undefined): ChannelMergerNode;
    createChannelSplitter(numberOfOutputs?: number | undefined): ChannelSplitterNode;
    createConstantSource(): ConstantSourceNode;
    createConvolver(): ConvolverNode;
    createDelay(maxDelayTime?: number | undefined): DelayNode;
    createDynamicsCompressor(): DynamicsCompressorNode;
    createGain(): GainNode;
    createIIRFilter(feedForward: number[] | Float32Array, feedback: number[] | Float32Array): IIRFilterNode;
    createPanner(): PannerNode;
    createPeriodicWave(real: number[] | Float32Array, imag: number[] | Float32Array, constraints?: PeriodicWaveConstraints | undefined): PeriodicWave;
    createStereoPanner(): StereoPannerNode;
    createWaveShaper(): WaveShaperNode;
    createMediaStreamSource(stream: MediaStream): MediaStreamAudioSourceNode;
    createMediaElementSource(element: HTMLMediaElement): MediaElementAudioSourceNode;
    createMediaStreamDestination(): MediaStreamAudioDestinationNode;
    decodeAudioData(audioData: ArrayBuffer): Promise<AudioBuffer>;
    get currentTime(): Seconds;
    get state(): AudioContextState;
    get sampleRate(): number;
    get listener(): Listener;
    set listener(l: Listener);
    get transport(): Transport;
    set transport(t: Transport);
    get draw(): Draw;
    set draw(d: Draw);
    get destination(): Destination;
    set destination(d: Destination);
    private _workletPromises;
    createAudioWorkletNode(name: string, options?: Partial<AudioWorkletNodeOptions>): AudioWorkletNode;
    addAudioWorkletModule(url: string): Promise<void>;
    protected workletsAreReady(): Promise<void>;
    get updateInterval(): Seconds;
    set updateInterval(interval: Seconds);
    get clockSource(): TickerClockSource;
    set clockSource(type: TickerClockSource);
    get lookAhead(): Seconds;
    set lookAhead(time: Seconds);
    private _lookAhead;
    get latencyHint(): ContextLatencyHint | Seconds;
    get rawContext(): AnyAudioContext;
    now(): Seconds;
    immediate(): Seconds;
    resume(): Promise<void>;
    close(): Promise<void>;
    getConstant(val: number): AudioBufferSourceNode;
    dispose(): this;
    private _timeoutLoop;
    setTimeout(fn: (...args: any[]) => void, timeout: Seconds): number;
    clearTimeout(id: number): this;
    clearInterval(id: number): this;
    setInterval(fn: (...args: any[]) => void, interval: Seconds): number;
}
declare class OfflineContext extends Context {
    readonly name: string;
    private readonly _duration;
    private _currentTime;
    protected _context: OfflineAudioContext;
    readonly isOffline: boolean;
    constructor(channels: number, duration: Seconds, sampleRate: number);
    constructor(context: OfflineAudioContext);
    now(): Seconds;
    get currentTime(): Seconds;
    private _renderClock;
    render(asynchronous?: boolean): Promise<ToneAudioBuffer>;
    close(): Promise<void>;
}
interface ToneAudioBufferOptions {
    url?: string | AudioBuffer | ToneAudioBuffer;
    reverse: boolean;
    onload: (buffer?: ToneAudioBuffer) => void;
    onerror: (error: Error) => void;
}
declare class ToneAudioBuffer extends Tone {
    readonly name: string;
    private _buffer?;
    private _reversed;
    onload: (buffer: ToneAudioBuffer) => void;
    constructor(url?: string | ToneAudioBuffer | AudioBuffer, onload?: (buffer: ToneAudioBuffer) => void, onerror?: (error: Error) => void);
    constructor(options?: Partial<ToneAudioBufferOptions>);
    static getDefaults(): ToneAudioBufferOptions;
    get sampleRate(): number;
    set(buffer: AudioBuffer | ToneAudioBuffer): this;
    get(): AudioBuffer | undefined;
    load(url: string): Promise<this>;
    dispose(): this;
    fromArray(array: Float32Array | Float32Array[]): this;
    toMono(chanNum?: number): this;
    toArray(channel?: number): Float32Array | Float32Array[];
    getChannelData(channel: number): Float32Array;
    slice(start: Seconds, end?: Seconds): ToneAudioBuffer;
    private _reverse;
    get loaded(): boolean;
    get duration(): Seconds;
    get length(): Samples;
    get numberOfChannels(): number;
    get reverse(): boolean;
    set reverse(rev: boolean);
    static baseUrl: string;
    static fromArray(array: Float32Array | Float32Array[]): ToneAudioBuffer;
    static fromUrl(url: string): Promise<ToneAudioBuffer>;
    static downloads: Array<Promise<void>>;
    static load(url: string): Promise<AudioBuffer>;
    static supportsType(url: string): boolean;
    static loaded(): Promise<void>;
}
declare function equalPowerScale(percent: NormalRange): number;
declare function dbToGain(db: Decibels): GainFactor;
declare function gainToDb(gain: GainFactor): Decibels;
declare function intervalToFrequencyRatio(interval: Interval): number;
declare let A4: Hertz;
declare function getA4(): Hertz;
declare function setA4(freq: Hertz): void;
declare function ftom(frequency: Hertz): MidiNote;
declare function ftomf(frequency: Hertz): number;
declare function mtof(midi: MidiNote): Hertz;
declare function isUndef(arg: any): arg is undefined;
declare function isDefined<T>(arg: T | undefined): arg is T;
declare function isFunction(arg: any): arg is (a: any) => any;
declare function isNumber(arg: any): arg is number;
declare function isObject(arg: any): arg is object;
declare function isBoolean(arg: any): arg is boolean;
declare function isArray(arg: any): arg is any[];
declare function isString(arg: any): arg is string;
declare function isNote(arg: any): arg is Note;
interface ToneWithContextOptions {
    context: BaseContext;
}
declare abstract class ToneWithContext<Options extends ToneWithContextOptions> extends Tone {
    readonly context: BaseContext;
    readonly defaultContext?: BaseContext;
    constructor(context?: BaseContext);
    constructor(options?: Partial<ToneWithContextOptions>);
    static getDefaults(): ToneWithContextOptions;
    now(): Seconds;
    immediate(): Seconds;
    get sampleTime(): Seconds;
    get blockTime(): Seconds;
    toSeconds(time?: Time): Seconds;
    toFrequency(freq: Frequency): Hertz;
    toTicks(time?: Time | TimeClass): Ticks;
    protected _getPartialProperties(props: Options): Partial<Options>;
    get(): Options;
    set(props: RecursivePartial<Options>): this;
}
type InputNode = ToneAudioNode | AudioNode | Param<any> | AudioParam;
type OutputNode = ToneAudioNode | AudioNode;
interface ChannelProperties {
    channelCount: number;
    channelCountMode: ChannelCountMode;
    channelInterpretation: ChannelInterpretation;
}
type ToneAudioNodeOptions = ToneWithContextOptions;
declare abstract class ToneAudioNode<Options extends ToneAudioNodeOptions = ToneAudioNodeOptions> extends ToneWithContext<Options> {
    abstract readonly name: string;
    abstract input: InputNode | undefined;
    abstract output: OutputNode | undefined;
    get numberOfInputs(): number;
    get numberOfOutputs(): number;
    protected _internalChannels: OutputNode[];
    private _isAudioNode;
    private _getInternalNodes;
    private _setChannelProperties;
    private _getChannelProperties;
    get channelCount(): number;
    set channelCount(channelCount: number);
    get channelCountMode(): ChannelCountMode;
    set channelCountMode(channelCountMode: ChannelCountMode);
    get channelInterpretation(): ChannelInterpretation;
    set channelInterpretation(channelInterpretation: ChannelInterpretation);
    connect(destination: InputNode, outputNum?: number, inputNum?: number): this;
    toDestination(): this;
    toMaster(): this;
    disconnect(destination?: InputNode, outputNum?: number, inputNum?: number): this;
    chain(...nodes: InputNode[]): this;
    fan(...nodes: InputNode[]): this;
    dispose(): this;
}
declare function connectSeries(...nodes: InputNode[]): void;
declare function connect(srcNode: OutputNode, dstNode: InputNode, outputNumber?: number, inputNumber?: number): void;
declare function disconnect(srcNode: OutputNode, dstNode?: InputNode, outputNumber?: number, inputNumber?: number): void;
declare function fanIn(...nodes: OutputNode[]): void;
interface VolumeOptions extends ToneAudioNodeOptions {
    volume: Decibels;
    mute: boolean;
}
declare class Volume extends ToneAudioNode<VolumeOptions> {
    readonly name: string;
    output: Gain<"decibels">;
    input: Gain<"decibels">;
    private _unmutedVolume;
    volume: Param<"decibels">;
    constructor(volume?: Decibels);
    constructor(options?: Partial<VolumeOptions>);
    static getDefaults(): VolumeOptions;
    get mute(): boolean;
    set mute(mute: boolean);
    dispose(): this;
}
type OneShotSourceCurve = "linear" | "exponential";
type BasicPlaybackState = "started" | "stopped";
type onEndedCallback = (source: OneShotSource<any>) => void;
interface OneShotSourceOptions extends ToneAudioNodeOptions {
    onended: onEndedCallback;
    fadeIn: Time;
    fadeOut: Time;
    curve: OneShotSourceCurve;
}
declare abstract class OneShotSource<Options extends ToneAudioNodeOptions> extends ToneAudioNode<Options> {
    onended: onEndedCallback;
    input: undefined;
    protected _startTime: number;
    protected _stopTime: number;
    private _timeout;
    output: Gain;
    protected _gainNode: Gain<"gain">;
    protected _fadeIn: Time;
    protected _fadeOut: Time;
    protected _curve: OneShotSourceCurve;
    constructor(options: OneShotSourceOptions);
    static getDefaults(): OneShotSourceOptions;
    protected abstract _stopSource(time: Seconds): void;
    protected abstract start(time?: Time): this;
    protected _startGain(time: Seconds, gain?: GainFactor): this;
    stop(time?: Time): this;
    protected _stopGain(time: Seconds): this;
    protected _onended(): void;
    getStateAtTime: (time: Time) => BasicPlaybackState;
    get state(): BasicPlaybackState;
    cancelStop(): this;
    dispose(): this;
}
interface ParamOptions<TypeName extends UnitName> extends ToneWithContextOptions {
    units: TypeName;
    value?: UnitMap[TypeName];
    param: AudioParam | Param<TypeName>;
    convert: boolean;
    minValue?: number;
    maxValue?: number;
    swappable?: boolean;
}
type AutomationType = "linearRampToValueAtTime" | "exponentialRampToValueAtTime" | "setValueAtTime" | "setTargetAtTime" | "cancelScheduledValues";
interface TargetAutomationEvent {
    type: "setTargetAtTime";
    time: number;
    value: number;
    constant: number;
}
interface NormalAutomationEvent {
    type: Exclude<AutomationType, "setTargetAtTime">;
    time: number;
    value: number;
}
type AutomationEvent = NormalAutomationEvent | TargetAutomationEvent;
declare class Param<TypeName extends UnitName = "number"> extends ToneWithContext<ParamOptions<TypeName>> implements AbstractParam<TypeName> {
    readonly name: string;
    readonly input: GainNode | AudioParam;
    readonly units: UnitName;
    convert: boolean;
    overridden: boolean;
    protected _events: Timeline<AutomationEvent>;
    protected _param: AudioParam;
    protected _initialValue: number;
    private _minOutput;
    private readonly _minValue?;
    private readonly _maxValue?;
    protected readonly _swappable: boolean;
    constructor(param: AudioParam, units?: TypeName, convert?: boolean);
    constructor(options: Partial<ParamOptions<TypeName>>);
    static getDefaults(): ParamOptions<any>;
    get value(): UnitMap[TypeName];
    set value(value: UnitMap[TypeName]);
    get minValue(): number;
    get maxValue(): number;
    private _is;
    private _assertRange;
    protected _fromType(val: UnitMap[TypeName]): number;
    protected _toType(val: number): UnitMap[TypeName];
    setValueAtTime(value: UnitMap[TypeName], time: Time): this;
    getValueAtTime(time: Time): UnitMap[TypeName];
    setRampPoint(time: Time): this;
    linearRampToValueAtTime(value: UnitMap[TypeName], endTime: Time): this;
    exponentialRampToValueAtTime(value: UnitMap[TypeName], endTime: Time): this;
    exponentialRampTo(value: UnitMap[TypeName], rampTime: Time, startTime?: Time): this;
    linearRampTo(value: UnitMap[TypeName], rampTime: Time, startTime?: Time): this;
    targetRampTo(value: UnitMap[TypeName], rampTime: Time, startTime?: Time): this;
    exponentialApproachValueAtTime(value: UnitMap[TypeName], time: Time, rampTime: Time): this;
    setTargetAtTime(value: UnitMap[TypeName], startTime: Time, timeConstant: Positive): this;
    setValueCurveAtTime(values: UnitMap[TypeName][], startTime: Time, duration: Time, scaling?: number): this;
    cancelScheduledValues(time: Time): this;
    cancelAndHoldAtTime(time: Time): this;
    rampTo(value: UnitMap[TypeName], rampTime?: Time, startTime?: Time): this;
    apply(param: Param | AudioParam): this;
    setParam(param: AudioParam): this;
    dispose(): this;
    get defaultValue(): UnitMap[TypeName];
    protected _exponentialApproach(t0: number, v0: number, v1: number, timeConstant: number, t: number): number;
    protected _linearInterpolate(t0: number, v0: number, t1: number, v1: number, t: number): number;
    protected _exponentialInterpolate(t0: number, v0: number, t1: number, v1: number, t: number): number;
}
type Letter = "C" | "D" | "E" | "F" | "G" | "A" | "B";
type Accidental = "bb" | "b" | "" | "#" | "x";
type Octave = -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
type Note = `${Letter}${Accidental}${Octave}`;
type Seconds = number;
type Decibels = number;
type NormalRange = number;
type AudioRange = number;
type Interval = number;
type GainFactor = number;
type Positive = number;
type Subdivision = "1m" | "1n" | "1n." | `${2 | 4 | 8 | 16 | 32 | 64 | 128 | 256}${"n" | "n." | "t"}` | "0";
type TimeObject = {
    [sub in Subdivision]?: number;
};
type Time = string | Seconds | TimeObject | Subdivision;
type Frequency = Subdivision | Note | string | Hertz;
type TimeSignature = number | number[];
type TransportTime = Time;
type Ticks = number;
type BPM = number;
type Degrees = number;
type Radians = number;
type BarsBeatsSixteenths = `${number}:${number}:${number}`;
type Samples = number;
type Hertz = number;
type Cents = number;
type Milliseconds = number;
type PowerOfTwo = number;
interface UnitMap {
    number: number;
    decibels: Decibels;
    normalRange: NormalRange;
    audioRange: AudioRange;
    gain: GainFactor;
    positive: Positive;
    time: Time;
    frequency: Frequency;
    transportTime: TransportTime;
    ticks: Ticks;
    bpm: BPM;
    degrees: Degrees;
    radians: Radians;
    samples: Samples;
    hertz: Hertz;
    cents: Cents;
}
type Unit = UnitMap[keyof UnitMap];
type UnitName = keyof UnitMap;
declare abstract class AbstractParam<TypeName extends UnitName> {
    abstract setValueAtTime(value: UnitMap[TypeName], time: Time): this;
    abstract getValueAtTime(time: Time): UnitMap[TypeName];
    abstract setRampPoint(time: Time): this;
    abstract linearRampToValueAtTime(value: UnitMap[TypeName], time: Time): this;
    abstract exponentialRampToValueAtTime(value: UnitMap[TypeName], time: Time): this;
    abstract exponentialRampTo(value: UnitMap[TypeName], rampTime: Time, startTime?: Time): this;
    abstract linearRampTo(value: UnitMap[TypeName], rampTime: Time, startTime?: Time): this;
    abstract targetRampTo(value: UnitMap[TypeName], rampTime: Time, startTime?: Time): this;
    abstract exponentialApproachValueAtTime(value: UnitMap[TypeName], time: Time, rampTime: Time): this;
    abstract setTargetAtTime(value: UnitMap[TypeName], startTime: Time, timeConstant: number): this;
    abstract setValueCurveAtTime(values: UnitMap[TypeName][], startTime: Time, duration: Time, scaling?: number): this;
    abstract cancelScheduledValues(time: Time): this;
    abstract cancelAndHoldAtTime(time: Time): this;
    abstract rampTo(value: UnitMap[TypeName], rampTime: Time, startTime?: Time): this;
    abstract value: UnitMap[TypeName];
    abstract convert: boolean;
    abstract readonly units: UnitName;
    abstract overridden: boolean;
    abstract readonly minValue: number;
    abstract readonly maxValue: number;
}
interface DestinationOptions extends ToneAudioNodeOptions {
    volume: Decibels;
    mute: boolean;
}
declare class DestinationInstance extends ToneAudioNode<DestinationOptions> {
    readonly name: string;
    input: Volume;
    output: Gain;
    volume: Param<"decibels">;
    constructor(options: Partial<DestinationOptions>);
    static getDefaults(): DestinationOptions;
    get mute(): boolean;
    set mute(mute: boolean);
    chain(...args: Array<AudioNode | ToneAudioNode>): this;
    get maxChannelCount(): number;
    dispose(): this;
}
interface EffectOptions extends ToneAudioNodeOptions {
    wet: NormalRange;
}
declare abstract class Effect<Options extends EffectOptions> extends ToneAudioNode<Options> {
    readonly name: string;
    private _dryWet;
    wet: Signal<"normalRange">;
    protected effectSend: Gain;
    protected effectReturn: Gain;
    input: Gain;
    output: CrossFade;
    constructor(options: EffectOptions);
    static getDefaults(): EffectOptions;
    protected connectEffect(effect: ToneAudioNode | AudioNode): this;
    dispose(): this;
}
interface FeedbackEffectOptions extends EffectOptions {
    feedback: NormalRange;
}
declare abstract class FeedbackEffect<Options extends FeedbackEffectOptions> extends Effect<Options> {
    readonly name: string;
    private _feedbackGain;
    feedback: Param<"normalRange">;
    constructor(options: FeedbackEffectOptions);
    static getDefaults(): FeedbackEffectOptions;
    dispose(): this;
}
interface SignalOptions<TypeName extends UnitName> extends ToneAudioNodeOptions {
    value: UnitMap[TypeName];
    units: TypeName;
    convert: boolean;
    minValue?: number;
    maxValue?: number;
}
declare class Signal<TypeName extends UnitName = "number"> extends ToneAudioNode<SignalOptions<any>> implements AbstractParam<TypeName> {
    readonly name: string;
    readonly override: boolean;
    protected _constantSource: ToneConstantSource<TypeName>;
    readonly output: OutputNode;
    protected _param: Param<TypeName>;
    readonly input: InputNode;
    constructor(value?: UnitMap[TypeName], units?: TypeName);
    constructor(options?: Partial<SignalOptions<TypeName>>);
    static getDefaults(): SignalOptions<any>;
    connect(destination: InputNode, outputNum?: number, inputNum?: number): this;
    disconnect(destination?: InputNode, outputNum?: number, inputNum?: number): this;
    dispose(): this;
    setValueAtTime(value: UnitMap[TypeName], time: Time): this;
    getValueAtTime(time: Time): UnitMap[TypeName];
    setRampPoint(time: Time): this;
    linearRampToValueAtTime(value: UnitMap[TypeName], time: Time): this;
    exponentialRampToValueAtTime(value: UnitMap[TypeName], time: Time): this;
    exponentialRampTo(value: UnitMap[TypeName], rampTime: Time, startTime?: Time): this;
    linearRampTo(value: UnitMap[TypeName], rampTime: Time, startTime?: Time): this;
    targetRampTo(value: UnitMap[TypeName], rampTime: Time, startTime?: Time): this;
    exponentialApproachValueAtTime(value: UnitMap[TypeName], time: Time, rampTime: Time): this;
    setTargetAtTime(value: UnitMap[TypeName], startTime: Time, timeConstant: number): this;
    setValueCurveAtTime(values: UnitMap[TypeName][], startTime: Time, duration: Time, scaling?: number): this;
    cancelScheduledValues(time: Time): this;
    cancelAndHoldAtTime(time: Time): this;
    rampTo(value: UnitMap[TypeName], rampTime: Time, startTime?: Time): this;
    get value(): UnitMap[TypeName];
    set value(value: UnitMap[TypeName]);
    get convert(): boolean;
    set convert(convert: boolean);
    get units(): UnitName;
    get overridden(): boolean;
    set overridden(overridden: boolean);
    get maxValue(): number;
    get minValue(): number;
    apply(param: Param | AudioParam): this;
}
declare const connectedSignals: WeakMap<OutputNode, {
    destination: Param | AudioParam | Signal;
    outputNum: number;
    inputNum: number;
    previousValue: number;
}[]>;
declare function connectSignal(signal: OutputNode, destination: InputNode, outputNum?: number, inputNum?: number): void;
declare function disconnectSignal(signal: OutputNode, destination?: InputNode, outputNum?: number, inputNum?: number): void;
type SignalOperatorOptions = ToneAudioNodeOptions;
declare abstract class SignalOperator<Options extends SignalOperatorOptions> extends ToneAudioNode<Options> {
    constructor(options?: Partial<Options>);
    connect(destination: InputNode, outputNum?: number, inputNum?: number): this;
}
interface PowOptions extends ToneAudioNodeOptions {
    value: number;
}
declare class Pow extends SignalOperator<PowOptions> {
    readonly name: string;
    private _exponent;
    private _exponentScaler;
    input: WaveShaper;
    output: WaveShaper;
    constructor(value?: number);
    constructor(options?: Partial<PowOptions>);
    static getDefaults(): PowOptions;
    private _expFunc;
    get value(): number;
    set value(exponent: number);
    dispose(): this;
}
interface TransportEventOptions {
    callback: (time: number) => void;
    once: boolean;
    time: Ticks;
}
declare class TransportEvent {
    protected transport: Transport;
    id: number;
    time: Ticks;
    private callback?;
    private _once;
    protected _remainderTime: number;
    constructor(transport: Transport, opts: Partial<TransportEventOptions>);
    static getDefaults(): TransportEventOptions;
    private static _eventId;
    protected get floatTime(): number;
    invoke(time: Seconds): void;
    dispose(): this;
}
interface TransportRepeatEventOptions extends TransportEventOptions {
    interval: Ticks;
    duration: Ticks;
}
declare class TransportRepeatEvent extends TransportEvent {
    private duration;
    private _interval;
    private _currentId;
    private _nextId;
    private _nextTick;
    private _boundRestart;
    protected context: BaseContext;
    constructor(transport: Transport, opts: Partial<TransportRepeatEventOptions>);
    static getDefaults(): TransportRepeatEventOptions;
    invoke(time: Seconds): void;
    private _createEvent;
    private _createEvents;
    private _restart;
    dispose(): this;
}
interface IntervalTimelineEvent {
    time: number;
    duration: number;
    [propName: string]: any;
}
type IteratorCallback = (event: IntervalTimelineEvent) => void;
declare class IntervalTimeline extends Tone {
    readonly name: string;
    private _root;
    private _length;
    add(event: IntervalTimelineEvent): this;
    remove(event: IntervalTimelineEvent): this;
    get length(): number;
    cancel(after: number): this;
    private _setRoot;
    private _replaceNodeInParent;
    private _removeNode;
    private _rotateLeft;
    private _rotateRight;
    private _rebalance;
    get(time: number): IntervalTimelineEvent | null;
    forEach(callback: IteratorCallback): this;
    forEachAtTime(time: number, callback: IteratorCallback): this;
    forEachFrom(time: number, callback: IteratorCallback): this;
    dispose(): this;
}
declare class IntervalNode {
    event: IntervalTimelineEvent | null;
    low: number;
    high: number;
    max: number;
    private _left;
    private _right;
    parent: IntervalNode | null;
    height: number;
    constructor(low: number, high: number, event: IntervalTimelineEvent);
    insert(node: IntervalNode): void;
    search(point: number, results: IntervalNode[]): void;
    searchAfter(point: number, results: IntervalNode[]): void;
    traverse(callback: (self: IntervalNode) => void): void;
    updateHeight(): void;
    updateMax(): void;
    getBalance(): number;
    isLeftChild(): boolean;
    get left(): IntervalNode | null;
    set left(node: IntervalNode | null);
    get right(): IntervalNode | null;
    set right(node: IntervalNode | null);
    dispose(): void;
}
type TickAutomationEvent = AutomationEvent & {
    ticks: number;
};
interface TickParamOptions<TypeName extends UnitName> extends ParamOptions<TypeName> {
    multiplier: number;
}
declare class TickParam<TypeName extends "hertz" | "bpm"> extends Param<TypeName> {
    readonly name: string;
    protected _events: Timeline<TickAutomationEvent>;
    private _multiplier;
    constructor(value?: number);
    constructor(options: Partial<TickParamOptions<TypeName>>);
    static getDefaults(): TickParamOptions<any>;
    setTargetAtTime(value: UnitMap[TypeName], time: Time, constant: number): this;
    setValueAtTime(value: UnitMap[TypeName], time: Time): this;
    linearRampToValueAtTime(value: UnitMap[TypeName], time: Time): this;
    exponentialRampToValueAtTime(value: UnitMap[TypeName], time: Time): this;
    private _getTicksUntilEvent;
    getTicksAtTime(time: Time): Ticks;
    getDurationOfTicks(ticks: Ticks, time: Time): Seconds;
    getTimeOfTick(tick: Ticks): Seconds;
    ticksToTime(ticks: Ticks, when: Time): Seconds;
    timeToTicks(duration: Time, when: Time): Ticks;
    protected _fromType(val: UnitMap[TypeName]): number;
    protected _toType(val: number): UnitMap[TypeName];
    get multiplier(): number;
    set multiplier(m: number);
}
interface TickSignalOptions<TypeName extends UnitName> extends SignalOptions<TypeName> {
    value: UnitMap[TypeName];
    multiplier: number;
}
declare class TickSignal<TypeName extends "hertz" | "bpm"> extends Signal<TypeName> {
    readonly name: string;
    protected _param: TickParam<TypeName>;
    readonly input: InputNode;
    constructor(value?: UnitMap[TypeName]);
    constructor(options: Partial<TickSignalOptions<TypeName>>);
    static getDefaults(): TickSignalOptions<any>;
    ticksToTime(ticks: Ticks, when: Time): Seconds;
    timeToTicks(duration: Time, when: Time): Ticks;
    getTimeOfTick(tick: Ticks): Seconds;
    getDurationOfTicks(ticks: Ticks, time: Time): Seconds;
    getTicksAtTime(time: Time): Ticks;
    get multiplier(): number;
    set multiplier(m: number);
    dispose(): this;
}
interface TickSourceOptions extends ToneWithContextOptions {
    frequency: number;
    units: "bpm" | "hertz";
}
interface TickSourceOffsetEvent extends TimelineEvent {
    ticks: number;
    time: number;
    seconds: number;
}
interface TickSourceTicksAtTimeEvent extends TimelineEvent {
    state: PlaybackState;
    time: number;
    ticks: number;
}
interface TickSourceSecondsAtTimeEvent extends TimelineEvent {
    state: PlaybackState;
    time: number;
    seconds: number;
}
declare class TickSource<TypeName extends "bpm" | "hertz"> extends ToneWithContext<TickSourceOptions> {
    readonly name: string;
    readonly frequency: TickSignal<TypeName>;
    private _state;
    private _tickOffset;
    private _ticksAtTime;
    private _secondsAtTime;
    constructor(frequency?: number);
    constructor(options?: Partial<TickSourceOptions>);
    static getDefaults(): TickSourceOptions;
    get state(): PlaybackState;
    start(time: Time, offset?: Ticks): this;
    stop(time: Time): this;
    pause(time: Time): this;
    cancel(time: Time): this;
    getTicksAtTime(time?: Time): Ticks;
    get ticks(): Ticks;
    set ticks(t: Ticks);
    get seconds(): Seconds;
    set seconds(s: Seconds);
    getSecondsAtTime(time: Time): Seconds;
    setTicksAtTime(ticks: Ticks, time: Time): this;
    getStateAtTime(time: Time): PlaybackState;
    getTimeOfTick(tick: Ticks, before?: number): Seconds;
    forEachTickBetween(startTime: number, endTime: number, callback: (when: Seconds, ticks: Ticks) => void): this;
    dispose(): this;
}
type TimelineSearchParam = "ticks" | "time";
interface TimelineOptions {
    memory: number;
    increasing: boolean;
}
interface TimelineEvent {
    time: number;
}
declare class Timeline<GenericEvent extends TimelineEvent> extends Tone {
    readonly name: string;
    memory: number;
    protected _timeline: GenericEvent[];
    increasing: boolean;
    constructor(memory?: number);
    constructor(options?: Partial<TimelineOptions>);
    static getDefaults(): TimelineOptions;
    get length(): number;
    add(event: GenericEvent): this;
    remove(event: GenericEvent): this;
    get(time: number, param?: TimelineSearchParam): GenericEvent | null;
    peek(): GenericEvent | undefined;
    shift(): GenericEvent | undefined;
    getAfter(time: number, param?: TimelineSearchParam): GenericEvent | null;
    getBefore(time: number): GenericEvent | null;
    cancel(after: number): this;
    cancelBefore(time: number): this;
    previousEvent(event: GenericEvent): GenericEvent | null;
    protected _search(time: number, param?: TimelineSearchParam): number;
    private _iterate;
    forEach(callback: (event: GenericEvent) => void): this;
    forEachBefore(time: Seconds, callback: (event: GenericEvent) => void): this;
    forEachAfter(time: Seconds, callback: (event: GenericEvent) => void): this;
    forEachBetween(startTime: number, endTime: number, callback: (event: GenericEvent) => void): this;
    forEachFrom(time: number, callback: (event: GenericEvent) => void): this;
    forEachAtTime(time: number, callback: (event: GenericEvent) => void): this;
    dispose(): this;
}
type PlaybackState = BasicPlaybackState | "paused";
interface StateTimelineEvent extends TimelineEvent {
    state: PlaybackState;
}
declare class StateTimeline<AdditionalOptions extends Record<string, any> = Record<string, any>> extends Timeline<StateTimelineEvent & AdditionalOptions> {
    readonly name: string;
    private _initial;
    constructor(initial?: PlaybackState);
    getValueAtTime(time: Seconds): PlaybackState;
    setStateAtTime(state: PlaybackState, time: Seconds, options?: AdditionalOptions): this;
    getLastState(state: PlaybackState, time: number): (StateTimelineEvent & AdditionalOptions) | undefined;
    getNextState(state: PlaybackState, time: number): (StateTimelineEvent & AdditionalOptions) | undefined;
}
type ClockCallback = (time: Seconds, ticks?: Ticks) => void;
interface ClockOptions extends ToneWithContextOptions {
    frequency: Hertz;
    callback: ClockCallback;
    units: "hertz" | "bpm";
}
type ClockEvent = "start" | "stop" | "pause";
declare class Clock<TypeName extends "bpm" | "hertz" = "hertz"> extends ToneWithContext<ClockOptions> implements Emitter<ClockEvent> {
    readonly name: string;
    callback: ClockCallback;
    private _tickSource;
    private _lastUpdate;
    private _state;
    private _boundLoop;
    frequency: TickSignal<TypeName>;
    constructor(callback?: ClockCallback, frequency?: Frequency);
    constructor(options: Partial<ClockOptions>);
    static getDefaults(): ClockOptions;
    get state(): PlaybackState;
    start(time?: Time, offset?: Ticks): this;
    stop(time?: Time): this;
    pause(time?: Time): this;
    get ticks(): Ticks;
    set ticks(t: Ticks);
    get seconds(): Seconds;
    set seconds(s: Seconds);
    getSecondsAtTime(time: Time): Seconds;
    setTicksAtTime(ticks: Ticks, time: Time): this;
    getTimeOfTick(tick: Ticks, before?: number): Seconds;
    getTicksAtTime(time?: Time): Ticks;
    nextTickTime(offset: Ticks, when: Time): Seconds;
    private _loop;
    getStateAtTime(time: Time): PlaybackState;
    dispose(): this;
    on: (event: ClockEvent, callback: (...args: any[]) => void) => this;
    once: (event: ClockEvent, callback: (...args: any[]) => void) => this;
    off: (event: ClockEvent, callback?: ((...args: any[]) => void) | undefined) => this;
    emit: (event: any, ...args: any[]) => this;
}
declare function assert(statement: boolean, error: string): asserts statement;
declare function assertRange(value: number, gte: number, lte?: number): void;
declare function assertContextRunning(context: BaseContext): void;
declare let isInsideScheduledCallback: boolean;
declare let printedScheduledWarning: boolean;
declare function enterScheduledCallback(insideCallback: boolean): void;
declare function assertUsedScheduleTime(time?: Time): void;
interface Logger {
    log: (args?: any[]) => void;
    warn: (args?: any[]) => void;
}
declare let defaultLogger: Logger;
declare function setLogger(logger: Logger): void;
declare function log(...args: any[]): void;
declare function warn(...args: any[]): void;
declare class TransportTimeClass<Type extends Seconds | Ticks = Seconds> extends TimeClass<Type> {
    readonly name: string;
    protected _now(): Type;
}
declare function TransportTime(value?: TimeValue, units?: TimeBaseUnit): TransportTimeClass;
declare class TicksClass extends TransportTimeClass<Ticks> {
    readonly name: string;
    readonly defaultUnits: TimeBaseUnit;
    protected _now(): Ticks;
    protected _beatsToUnits(beats: number): Ticks;
    protected _secondsToUnits(seconds: Seconds): Ticks;
    protected _ticksToUnits(ticks: Ticks): Ticks;
    toTicks(): Ticks;
    toSeconds(): Seconds;
}
declare function Ticks(value?: TimeValue, units?: TimeBaseUnit): TicksClass;
interface ListenerOptions extends ToneAudioNodeOptions {
    positionX: number;
    positionY: number;
    positionZ: number;
    forwardX: number;
    forwardY: number;
    forwardZ: number;
    upX: number;
    upY: number;
    upZ: number;
}
declare class ListenerInstance extends ToneAudioNode<ListenerOptions> {
    readonly name: string;
    output: undefined;
    input: undefined;
    readonly positionX: Param;
    readonly positionY: Param;
    readonly positionZ: Param;
    readonly forwardX: Param;
    readonly forwardY: Param;
    readonly forwardZ: Param;
    readonly upX: Param;
    readonly upY: Param;
    readonly upZ: Param;
    static getDefaults(): ListenerOptions;
    dispose(): this;
}
declare function noCopy(key: string, arg: any): boolean;
declare function deepMerge<T>(target: T): T;
declare function deepMerge<T, U>(target: T, source1: U): T & U;
declare function deepMerge<T, U, V>(target: T, source1: U, source2: V): T & U & V;
declare function deepMerge<T, U, V, W>(target: T, source1: U, source2: V, source3: W): T & U & V & W;
declare function deepEquals<T>(arrayA: T[], arrayB: T[]): boolean;
declare function optionsFromArguments<T extends object>(defaults: T, argsArray: IArguments, keys?: Array<keyof T>, objKey?: keyof T): T;
declare function getDefaultsFromInstance<T>(instance: T): BaseToneOptions;
declare function defaultArg<T>(given: T, fallback: T): T;
declare function omitFromObject<T extends object, O extends string[]>(obj: T, omit: O): Omit<T, keyof O>;
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
type TIsAnyAudioParamFactory = (audioParamStore: TAudioParamStore, isNativeAudioParam: TIsNativeAudioParamFunction) => TIsAnyAudioParamFunction;
declare const createIsAnyAudioParam: TIsAnyAudioParamFactory;
declare const AUDIO_PARAM_STORE: TAudioParamStore;
type TWindow = Window & typeof globalThis;
type TIsNativeAudioParamFactory = (window: null | TWindow) => TIsNativeAudioParamFunction;
declare const createIsNativeAudioParam: TIsNativeAudioParamFactory;
declare const isNativeAudioParam: TIsNativeAudioParamFunction;
declare const isAnyAudioParam: TIsAnyAudioParamFunction;
type TNativeEventTarget = EventTarget;
interface IEventTarget<EventMap extends Record<string, Event>> extends TNativeEventTarget {
    addEventListener<Type extends keyof EventMap>(type: Type, listener: (this: this, event: EventMap[Type]) => void, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: null | EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<Type extends keyof EventMap>(type: Type, listener: (this: this, event: EventMap[Type]) => void, options?: boolean | EventListenerOptions): void;
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
type TEventHandler<T, U extends Event = Event> = (ThisType<T> & {
    handler(event: U): void;
})['handler'];
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
interface IPeriodicWave {
}
interface IBaseAudioContext<T extends TContext> extends IMinimalBaseAudioContext<T> {
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
    decodeAudioData(audioData: ArrayBuffer, successCallback?: TDecodeSuccessCallback, errorCallback?: TDecodeErrorCallback): Promise<AudioBuffer>;
}
interface ICommonAudioContext {
    readonly baseLatency: number;
    close(): Promise<void>;
    resume(): Promise<void>;
    suspend(): Promise<void>;
}
interface IMinimalAudioContext extends ICommonAudioContext, IMinimalBaseAudioContext<IMinimalAudioContext> {
}
interface IMediaElementAudioSourceNode<T extends IAudioContext | IMinimalAudioContext> extends IAudioNode<T> {
    readonly mediaElement: HTMLMediaElement;
}
interface IMediaStreamAudioDestinationNode<T extends IAudioContext | IMinimalAudioContext> extends IAudioNode<T> {
    readonly stream: MediaStream;
}
interface IMediaStreamAudioSourceNode<T extends IAudioContext | IMinimalAudioContext> extends IAudioNode<T> {
    readonly mediaStream: MediaStream;
}
interface IMediaStreamTrackAudioSourceNode<T extends IAudioContext | IMinimalAudioContext> extends IAudioNode<T> {
}
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
interface IMinimalOfflineAudioContext extends ICommonOfflineAudioContext, IMinimalBaseAudioContext<IMinimalOfflineAudioContext> {
}
interface IOfflineAudioContext extends IBaseAudioContext<IOfflineAudioContext>, ICommonOfflineAudioContext {
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
    connect<U extends TContext, OtherEventMap extends Record<string, Event>, V extends IAudioNode<U, OtherEventMap>>(destinationNode: V, output?: number, input?: number): V;
    connect(destinationParam: IAudioParam, output?: number): void;
    disconnect(output?: number): void;
    disconnect<U extends TContext, OtherEventMap extends Record<string, Event>>(destinationNode: IAudioNode<U, OtherEventMap>, output?: number, input?: number): void;
    disconnect(destinationParam: IAudioParam, output?: number): void;
}
type TNativeAudioNode = AudioNode;
type TIsAnyAudioNodeFunction = (anything: unknown) => anything is IAudioNode<any> | TNativeAudioNode;
declare function isAudioParam(arg: any): arg is AudioParam;
type TIsNativeAudioNodeFunction = (anything: unknown) => anything is TNativeAudioNode;
type TAudioNodeStore = WeakMap<IAudioNode<TContext>, TNativeAudioNode>;
type TIsAnyAudioNodeFactory = (audioNodeStore: TAudioNodeStore, isNativeAudioNode: TIsNativeAudioNodeFunction) => TIsAnyAudioNodeFunction;
declare const createIsAnyAudioNode: TIsAnyAudioNodeFactory;
declare const AUDIO_NODE_STORE: TAudioNodeStore;
type TIsNativeAudioNodeFactory = (window: null | TWindow) => TIsNativeAudioNodeFunction;
declare const createIsNativeAudioNode: TIsNativeAudioNodeFactory;
declare const isNativeAudioNode: TIsNativeAudioNodeFunction;
declare const isAnyAudioNode: TIsAnyAudioNodeFunction;
declare function isAudioNode(arg: any): arg is AudioNode;
type TNativeMediaStreamTrackAudioSourceNode = typeof globalThis extends {
    MediaStreamTrackAudioSourceNode: any;
} ? never : TNativeAudioNode;
type ExceptOptions = {
    requireExactProps?: boolean;
};
type IsAny<T> = 0 extends 1 & NoInfer<T> ? true : false;
type IsOptionalKeyOf<Type extends object, Key extends keyof Type> = IsAny<Type | Key> extends true ? never : Key extends keyof Type ? Type extends Record<Key, Type[Key]> ? false : true : false;
type OptionalKeysOf<Type extends object> = Type extends unknown ? (keyof {
    [Key in keyof Type as IsOptionalKeyOf<Type, Key> extends false ? never : Key]: never;
}) & keyof Type : never;
type PickIndexSignature<ObjectType> = {
    [KeyType in keyof ObjectType as {} extends Record<KeyType, unknown> ? KeyType : never]: ObjectType[KeyType];
};
type OmitIndexSignature<ObjectType> = {
    [KeyType in keyof ObjectType as {} extends Record<KeyType, unknown> ? never : KeyType]: ObjectType[KeyType];
};
type RequiredKeysOf<Type extends object> = Type extends unknown ? Exclude<keyof Type, OptionalKeysOf<Type>> : never;
type SimpleMerge<Destination, Source> = {
    [Key in keyof Destination as Key extends keyof Source ? never : Key]: Destination[Key];
} & Source;
type If<Type extends boolean, IfBranch, ElseBranch> = IsNever<Type> extends true ? ElseBranch : Type extends true ? IfBranch : ElseBranch;
type IsNever<T> = [T] extends [never] ? true : false;
type Merge<Destination, Source> = Simplify<SimpleMerge<PickIndexSignature<Destination>, PickIndexSignature<Source>> & SimpleMerge<OmitIndexSignature<Destination>, OmitIndexSignature<Source>>>;
type ApplyDefaultOptions<Options extends object, Defaults extends Simplify<Omit<Required<Options>, RequiredKeysOf<Options>> & Partial<Record<RequiredKeysOf<Options>, never>>>, SpecifiedOptions extends Options> = If<IsAny<SpecifiedOptions>, Defaults, If<IsNever<SpecifiedOptions>, Defaults, Simplify<Merge<Defaults, {
    [Key in keyof SpecifiedOptions as Key extends OptionalKeysOf<Options> ? undefined extends SpecifiedOptions[Key] ? never : Key : Key]: SpecifiedOptions[Key];
}> & Required<Options>>>>;
type DefaultExceptOptions = {
    requireExactProps: false;
};
type TWithAdditionalProperty<BaseType, Property extends keyof any, PropertyType> = BaseType extends Record<Property, any> ? never : BaseType & Record<Property, PropertyType>;
type Except<ObjectType, KeysType extends keyof ObjectType, Options extends ExceptOptions = {}> = _Except<ObjectType, KeysType, ApplyDefaultOptions<ExceptOptions, DefaultExceptOptions, Options>>;
type _IsEqual<A, B> = (<G>() => G extends A & G | G ? 1 : 2) extends (<G>() => G extends B & G | G ? 1 : 2) ? true : false;
type IsEqual<A, B> = [
    A
] extends [B] ? [B] extends [A] ? _IsEqual<A, B> : false : false;
type Filter<KeyType, ExcludeType> = IsEqual<KeyType, ExcludeType> extends true ? never : (KeyType extends ExcludeType ? never : KeyType);
type _Except<ObjectType, KeysType extends keyof ObjectType, Options extends Required<ExceptOptions>> = {
    [KeyType in keyof ObjectType as Filter<KeyType, KeysType>]: ObjectType[KeyType];
} & (Options['requireExactProps'] extends true ? Partial<Record<KeysType, never>> : {});
type SetOptional<BaseType, Keys extends keyof BaseType> = (BaseType extends (...arguments_: never) => any ? (...arguments_: Parameters<BaseType>) => ReturnType<BaseType> : unknown) & _SetOptional<BaseType, Keys>;
type Simplify<T> = {
    [KeyType in keyof T]: T[KeyType];
} & {};
type UnionToIntersection<Union> = (Union extends unknown ? (distributedUnion: Union) => void : never) extends ((mergedIntersection: infer Intersection) => void) ? Intersection & Union : never;
type KeysOfUnion<ObjectType> = keyof UnionToIntersection<ObjectType extends unknown ? Record<keyof ObjectType, never> : never>;
type HomomorphicPick<T, Keys extends KeysOfUnion<T>> = {
    [P in keyof T as Extract<P, Keys>]: T[P];
};
type _SetOptional<BaseType, Keys extends keyof BaseType> = BaseType extends unknown ? Simplify<Except<BaseType, Keys> & Partial<HomomorphicPick<BaseType, Keys>>> : never;
type TNativeAudioContext = SetOptional<TWithAdditionalProperty<AudioContext, 'createMediaStreamTrackSource', (mediaStreamTrack: MediaStreamTrack) => TNativeMediaStreamTrackAudioSourceNode>, 'createMediaStreamTrackSource'>;
type TNativeOfflineAudioContext = OfflineAudioContext;
type TNativeContext = TNativeAudioContext | TNativeOfflineAudioContext;
type TContextStore = WeakMap<TContext, TNativeContext>;
type TIsNativeOfflineAudioContextFunction = (anything: unknown) => anything is TNativeOfflineAudioContext;
type TIsAnyOfflineAudioContextFunction = (anything: unknown) => anything is IMinimalOfflineAudioContext | IOfflineAudioContext | TNativeOfflineAudioContext;
type TIsAnyOfflineAudioContextFactory = (contextStore: TContextStore, isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction) => TIsAnyOfflineAudioContextFunction;
declare const createIsAnyOfflineAudioContext: TIsAnyOfflineAudioContextFactory;
declare const CONTEXT_STORE: TContextStore;
type TNativeOfflineAudioContextConstructor = typeof OfflineAudioContext;
type TIsNativeOfflineAudioContextFactory = (nativeOfflineAudioContextConstructor: null | TNativeOfflineAudioContextConstructor) => TIsNativeOfflineAudioContextFunction;
declare const createIsNativeOfflineAudioContext: TIsNativeOfflineAudioContextFactory;
type TNativeOfflineAudioContextConstructorFactory = (window: null | TWindow) => null | TNativeOfflineAudioContextConstructor;
declare const createNativeOfflineAudioContextConstructor: TNativeOfflineAudioContextConstructorFactory;
declare const nativeOfflineAudioContextConstructor: {
    new (contextOptions: OfflineAudioContextOptions): OfflineAudioContext;
    new (numberOfChannels: number, length: number, sampleRate: number): OfflineAudioContext;
    prototype: OfflineAudioContext;
} | null;
declare const isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction;
declare const isAnyOfflineAudioContext: TIsAnyOfflineAudioContextFunction;
declare function isOfflineAudioContext(arg: any): arg is OfflineAudioContext;
type TIsNativeAudioContextFunction = (anything: unknown) => anything is TNativeAudioContext;
type TIsAnyAudioContextFunction = (anything: unknown) => anything is IAudioContext | IMinimalAudioContext | TNativeAudioContext;
type TIsAnyAudioContextFactory = (contextStore: TContextStore, isNativeAudioContext: TIsNativeAudioContextFunction) => TIsAnyAudioContextFunction;
declare const createIsAnyAudioContext: TIsAnyAudioContextFactory;
type TNativeAudioContextConstructor = new (options?: AudioContextOptions) => TNativeAudioContext;
type TIsNativeAudioContextFactory = (nativeAudioContextConstructor: null | TNativeAudioContextConstructor) => TIsNativeAudioContextFunction;
declare const createIsNativeAudioContext: TIsNativeAudioContextFactory;
type TNativeAudioContextConstructorFactory = (window: null | TWindow) => null | TNativeAudioContextConstructor;
declare const createNativeAudioContextConstructor: TNativeAudioContextConstructorFactory;
declare const nativeAudioContextConstructor: TNativeAudioContextConstructor | null;
declare const isNativeAudioContext: TIsNativeAudioContextFunction;
declare const isAnyAudioContext: TIsAnyAudioContextFunction;
declare function isAudioContext(arg: any): arg is AudioContext;
declare function isAudioBuffer(arg: any): arg is AudioBuffer;
type TickerClockSource = "worker" | "timeout" | "offline";
declare class Ticker {
    private _type;
    private _updateInterval;
    private _minimumUpdateInterval;
    private _callback;
    private _timeout;
    private _worker;
    constructor(callback: () => void, type: TickerClockSource, updateInterval: Seconds, contextSampleRate?: number);
    private _createWorker;
    private _createTimeout;
    private _createClock;
    private _disposeClock;
    get updateInterval(): Seconds;
    set updateInterval(interval: Seconds);
    get type(): TickerClockSource;
    set type(type: TickerClockSource);
    dispose(): void;
}
declare const EPSILON = 0.000001;
declare function GT(a: number, b: number): boolean;
declare function GTE(a: number, b: number): boolean;
declare function LT(a: number, b: number): boolean;
declare function EQ(a: number, b: number): boolean;
declare function clamp(value: number, min: number, max: number): number;
interface TimelineValueEvent<T> extends TimelineEvent {
    value: T;
}
declare class TimelineValue<Type> extends Tone {
    readonly name: string;
    private _timeline;
    private _initialValue;
    constructor(initialValue: Type);
    set(value: Type, time: Seconds): this;
    get(time: Seconds): Type;
}
interface TransportOptions extends ToneWithContextOptions {
    bpm: BPM;
    swing: NormalRange;
    swingSubdivision: Subdivision;
    timeSignature: number;
    loopStart: Time;
    loopEnd: Time;
    ppq: number;
}
type TransportEventNames = "start" | "stop" | "pause" | "loop" | "loopEnd" | "loopStart" | "ticks";
interface SyncedSignalEvent {
    signal: Signal;
    initial: number;
    nodes: ToneAudioNode<any>[];
}
type TransportCallback = (time: Seconds) => void;
declare class TransportInstance extends ToneWithContext<TransportOptions> implements Emitter<TransportEventNames> {
    readonly name: string;
    private _loop;
    private _loopStart;
    private _loopEnd;
    private _ppq;
    private _clock;
    bpm: TickParam<"bpm">;
    private _timeSignature;
    private _scheduledEvents;
    private _timeline;
    private _repeatedEvents;
    private _syncedSignals;
    private _swingTicks;
    private _swingAmount;
    constructor(options?: Partial<TransportOptions>);
    static getDefaults(): TransportOptions;
    private _processTick;
    schedule(callback: TransportCallback, time: TransportTime | TransportTimeClass): number;
    scheduleRepeat(callback: TransportCallback, interval: Time | TimeClass, startTime?: TransportTime | TransportTimeClass, duration?: Time): number;
    scheduleOnce(callback: TransportCallback, time: TransportTime | TransportTimeClass): number;
    clear(eventId: number): this;
    private _addEvent;
    cancel(after?: TransportTime): this;
    private _bindClockEvents;
    get state(): PlaybackState;
    start(time?: Time, offset?: TransportTime): this;
    stop(time?: Time): this;
    pause(time?: Time): this;
    toggle(time?: Time): this;
    get timeSignature(): TimeSignature;
    set timeSignature(timeSig: TimeSignature);
    get loopStart(): Time;
    set loopStart(startPosition: Time);
    get loopEnd(): Time;
    set loopEnd(endPosition: Time);
    get loop(): boolean;
    set loop(loop: boolean);
    setLoopPoints(startPosition: TransportTime, endPosition: TransportTime): this;
    get swing(): NormalRange;
    set swing(amount: NormalRange);
    get swingSubdivision(): Subdivision;
    set swingSubdivision(subdivision: Subdivision);
    get position(): BarsBeatsSixteenths | Time;
    set position(progress: Time);
    get seconds(): Seconds;
    set seconds(s: Seconds);
    get progress(): NormalRange;
    get ticks(): Ticks;
    set ticks(t: Ticks);
    getTicksAtTime(time?: Time): Ticks;
    getSecondsAtTime(time: Time): Seconds;
    get PPQ(): number;
    set PPQ(ppq: number);
    nextSubdivision(subdivision?: Time): Seconds;
    syncSignal(signal: Signal<any>, ratio?: number): this;
    unsyncSignal(signal: Signal<any>): this;
    dispose(): this;
    on: (event: TransportEventNames, callback: (...args: any[]) => void) => this;
    once: (event: TransportEventNames, callback: (...args: any[]) => void) => this;
    off: (event: TransportEventNames, callback?: ((...args: any[]) => void) | undefined) => this;
    emit: (event: any, ...args: any[]) => this;
}
interface ToneConstantSourceOptions<TypeName extends UnitName> extends OneShotSourceOptions {
    convert: boolean;
    offset: UnitMap[TypeName];
    units: TypeName;
    minValue?: number;
    maxValue?: number;
}
declare class ToneConstantSource<TypeName extends UnitName = "number"> extends OneShotSource<ToneConstantSourceOptions<TypeName>> {
    readonly name: string;
    private _source?;
    readonly offset: Param<TypeName>;
    constructor(offset: UnitMap[TypeName]);
    constructor(options?: Partial<ToneConstantSourceOptions<TypeName>>);
    static getDefaults(): ToneConstantSourceOptions<any>;
    private readonly _contextStarted;
    start(time?: Time): this;
    protected _stopSource(time?: Seconds): void;
    dispose(): this;
}
type Omit2<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
declare function readOnly(target: object, property: string | string[]): void;
declare function writable(target: object, property: string | string[]): void;
declare const noOp: (...args: any[]) => any;
type RecursivePartial<T> = {
    [P in keyof T]?: T[P] extends Array<infer U> ? Array<RecursivePartial<U>> : T[P] extends object ? RecursivePartial<T[P]> : T[P];
};
interface GainOptions2<TypeName extends UnitName> extends ToneAudioNodeOptions {
    gain: UnitMap[TypeName];
    units: TypeName;
    convert: boolean;
    minValue?: number;
    maxValue?: number;
}
declare class Gain<TypeName extends "gain" | "decibels" | "normalRange" = "gain"> extends ToneAudioNode<GainOptions2<TypeName>> {
    readonly name: string;
    readonly gain: Param<TypeName>;
    private _gainNode;
    readonly input: GainNode;
    readonly output: GainNode;
    constructor(gain?: UnitMap[TypeName], units?: TypeName);
    constructor(options?: Partial<GainOptions2<TypeName>>);
    static getDefaults(): GainOptions2<any>;
    dispose(): this;
}
interface DrawEvent extends TimelineEvent {
    callback: () => void;
}
declare class DrawInstance extends ToneWithContext<ToneWithContextOptions> {
    readonly name: string;
    expiration: Seconds;
    anticipation: Seconds;
    private _events;
    private _boundDrawLoop;
    private _animationFrame;
    schedule(callback: () => void, time: Time): this;
    cancel(after?: Time): this;
    private _drawLoop;
    dispose(): this;
}
interface CrossFadeOptions extends ToneAudioNodeOptions {
    fade: NormalRange;
}
declare class CrossFade extends ToneAudioNode<CrossFadeOptions> {
    readonly name: string;
    private _panner;
    private _split;
    private _g2a;
    readonly a: Gain;
    readonly b: Gain;
    readonly output: Gain;
    readonly input: undefined;
    readonly fade: Signal<"normalRange">;
    protected _internalChannels: Gain<"gain">[];
    constructor(fade?: NormalRange);
    constructor(options?: Partial<CrossFadeOptions>);
    static getDefaults(): CrossFadeOptions;
    dispose(): this;
}
declare class Zero extends SignalOperator<ToneAudioNodeOptions> {
    readonly name: string;
    private _gain;
    output: Gain<"gain">;
    input: undefined;
    constructor(options?: Partial<ToneAudioNodeOptions>);
    dispose(): this;
}
declare class AudioToGain extends SignalOperator<ToneAudioNodeOptions> {
    readonly name: string;
    private _norm;
    input: WaveShaper;
    output: WaveShaper;
    dispose(): this;
}
interface ScaleOptions extends ToneAudioNodeOptions {
    min: number;
    max: number;
}
declare class Scale<Options extends ScaleOptions = ScaleOptions> extends SignalOperator<Options> {
    readonly name: string;
    input: InputNode;
    output: OutputNode;
    protected _mult: Multiply;
    protected _add: Add;
    private _min;
    private _max;
    constructor(min?: number, max?: number);
    constructor(options?: Partial<ScaleOptions>);
    static getDefaults(): ScaleOptions;
    get min(): number;
    set min(min: number);
    get max(): number;
    set max(max: number);
    private _setRange;
    dispose(): this;
}
declare class Add extends Signal {
    override: boolean;
    readonly name: string;
    private _sum;
    readonly input: Gain<"gain">;
    readonly output: Gain<"gain">;
    readonly addend: Param<"number">;
    constructor(value?: number);
    constructor(options?: Partial<SignalOptions<"number">>);
    static getDefaults(): SignalOptions<"number">;
    dispose(): this;
}
declare class Multiply<TypeName extends "number" | "positive" = "number"> extends Signal<TypeName> {
    readonly name: string;
    readonly override = false;
    private _mult;
    input: InputNode;
    output: OutputNode;
    factor: Param<TypeName>;
    constructor(value?: number);
    constructor(options?: Partial<SignalOptions<TypeName>>);
    static getDefaults(): SignalOptions<any>;
    dispose(): this;
}
interface ToneOscillatorInterface {
    baseType: OscillatorType | "pulse" | "pwm";
    type: ExtendedToneOscillatorType;
    readonly frequency: Signal<"frequency">;
    readonly detune: Signal<"cents">;
    phase: Degrees;
    partials: number[];
    partialCount?: number;
    asArray(length: number): Promise<Float32Array>;
}
declare function generateWaveform(instance: any, length: number): Promise<Float32Array>;
type PartialsRange = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32;
type SineWithPartials = `sine${PartialsRange}`;
type SquareWithPartials = `square${PartialsRange}`;
type SawtoothWithPartials = `sawtooth${PartialsRange}`;
type TriangleWithPartials = `triangle${PartialsRange}`;
type TypeWithPartials = SineWithPartials | SquareWithPartials | TriangleWithPartials | SawtoothWithPartials;
interface BaseOscillatorOptions extends SourceOptions {
    frequency: Frequency;
    detune: Cents;
    phase: Degrees;
}
type NonCustomOscillatorType = Exclude<OscillatorType, "custom">;
type AllNonCustomOscillatorType = NonCustomOscillatorType | TypeWithPartials;
type ToneOscillatorType = AllNonCustomOscillatorType | "custom";
type ExtendedToneOscillatorType = ToneOscillatorType | "pwm" | "pulse";
interface ToneCustomOscillatorOptions extends BaseOscillatorOptions {
    type: "custom";
    partials: number[];
}
interface ToneTypeOscillatorOptions extends BaseOscillatorOptions {
    type: NonCustomOscillatorType;
    partialCount?: number;
}
interface TonePartialOscillatorOptions extends BaseOscillatorOptions {
    type: TypeWithPartials;
}
type ToneOscillatorConstructorOptions = ToneCustomOscillatorOptions | ToneTypeOscillatorOptions | TonePartialOscillatorOptions;
interface ToneOscillatorOptions extends BaseOscillatorOptions {
    type: ToneOscillatorType;
    partialCount: number;
    partials: number[];
}
interface FMBaseOscillatorOptions extends BaseOscillatorOptions {
    harmonicity: Positive;
    modulationIndex: Positive;
    modulationType: AllNonCustomOscillatorType;
}
interface FMCustomOscillatorOptions extends FMBaseOscillatorOptions {
    type: "custom";
    partials: number[];
}
interface FMTypeOscillatorOptions extends FMBaseOscillatorOptions {
    type: NonCustomOscillatorType;
    partialsCount?: number;
}
interface FMPartialsOscillatorOptions extends FMBaseOscillatorOptions {
    type: TypeWithPartials;
}
type FMConstructorOptions = FMTypeOscillatorOptions | FMCustomOscillatorOptions | FMPartialsOscillatorOptions;
interface FMOscillatorOptions extends ToneOscillatorOptions {
    harmonicity: Positive;
    modulationIndex: Positive;
    modulationType: AllNonCustomOscillatorType;
}
interface AMBaseOscillatorOptions extends BaseOscillatorOptions {
    harmonicity: Positive;
    modulationType: AllNonCustomOscillatorType;
}
interface AMCustomOscillatorOptions extends AMBaseOscillatorOptions {
    type: "custom";
    partials: number[];
}
interface AMTypeOscillatorOptions extends AMBaseOscillatorOptions {
    type: NonCustomOscillatorType;
    partialsCount?: number;
}
interface AMPartialsOscillatorOptions extends AMBaseOscillatorOptions {
    type: TypeWithPartials;
}
type AMConstructorOptions = AMCustomOscillatorOptions | AMTypeOscillatorOptions | AMPartialsOscillatorOptions;
interface AMOscillatorOptions extends ToneOscillatorOptions {
    harmonicity: Positive;
    modulationType: AllNonCustomOscillatorType;
}
interface FatBaseOscillatorOptions extends BaseOscillatorOptions {
    spread: Cents;
    count: Positive;
}
interface FatCustomOscillatorOptions extends FatBaseOscillatorOptions {
    type: "custom";
    partials: number[];
}
interface FatTypeOscillatorOptions extends FatBaseOscillatorOptions {
    type: NonCustomOscillatorType;
    partialCount?: number;
}
interface FatPartialsOscillatorOptions extends FatBaseOscillatorOptions {
    type: TypeWithPartials;
}
type FatConstructorOptions = FatCustomOscillatorOptions | FatTypeOscillatorOptions | FatPartialsOscillatorOptions;
interface FatOscillatorOptions extends ToneOscillatorOptions {
    spread: Cents;
    count: Positive;
}
interface PulseOscillatorOptions extends BaseOscillatorOptions {
    type: "pulse";
    width: AudioRange;
}
interface PWMOscillatorOptions extends BaseOscillatorOptions {
    type: "pwm";
    modulationFrequency: Frequency;
}
type FMSineWithPartials = `fmsine${PartialsRange}`;
type FMSquareWithPartials = `fmsquare${PartialsRange}`;
type FMSawtoothWithPartials = `fmsawtooth${PartialsRange}`;
type FMTriangleWithPartials = `fmtriangle${PartialsRange}`;
type FMTypeWithPartials = FMSineWithPartials | FMSquareWithPartials | FMSawtoothWithPartials | FMTriangleWithPartials;
type AMSineWithPartials = `amsine${PartialsRange}`;
type AMSquareWithPartials = `amsquare${PartialsRange}`;
type AMSawtoothWithPartials = `amsawtooth${PartialsRange}`;
type AMTriangleWithPartials = `amtriangle${PartialsRange}`;
type AMTypeWithPartials = AMSineWithPartials | AMSquareWithPartials | AMSawtoothWithPartials | AMTriangleWithPartials;
type FatSineWithPartials = `fatsine${PartialsRange}`;
type FatSquareWithPartials = `fatsquare${PartialsRange}`;
type FatSawtoothWithPartials = `fatsawtooth${PartialsRange}`;
type FatTriangleWithPartials = `fattriangle${PartialsRange}`;
type FatTypeWithPartials = FatSineWithPartials | FatSquareWithPartials | FatSawtoothWithPartials | FatTriangleWithPartials;
interface OmniFMCustomOscillatorOptions extends FMBaseOscillatorOptions {
    type: "fmcustom";
    partials: number[];
}
interface OmniFMTypeOscillatorOptions extends FMBaseOscillatorOptions {
    type: "fmsine" | "fmsquare" | "fmsawtooth" | "fmtriangle";
    partialsCount?: number;
}
interface OmniFMPartialsOscillatorOptions extends FMBaseOscillatorOptions {
    type: FMTypeWithPartials;
}
interface OmniAMCustomOscillatorOptions extends AMBaseOscillatorOptions {
    type: "amcustom";
    partials: number[];
}
interface OmniAMTypeOscillatorOptions extends AMBaseOscillatorOptions {
    type: "amsine" | "amsquare" | "amsawtooth" | "amtriangle";
    partialsCount?: number;
}
interface OmniAMPartialsOscillatorOptions extends AMBaseOscillatorOptions {
    type: AMTypeWithPartials;
}
interface OmniFatCustomOscillatorOptions extends FatBaseOscillatorOptions {
    type: "fatcustom";
    partials: number[];
}
interface OmniFatTypeOscillatorOptions extends FatBaseOscillatorOptions {
    type: "fatsine" | "fatsquare" | "fatsawtooth" | "fattriangle";
    partialsCount?: number;
}
interface OmniFatPartialsOscillatorOptions extends FatBaseOscillatorOptions {
    type: FatTypeWithPartials;
}
type OmniOscillatorType = "fatsine" | "fatsquare" | "fatsawtooth" | "fattriangle" | "fatcustom" | FatTypeWithPartials | "fmsine" | "fmsquare" | "fmsawtooth" | "fmtriangle" | "fmcustom" | FMTypeWithPartials | "amsine" | "amsquare" | "amsawtooth" | "amtriangle" | "amcustom" | AMTypeWithPartials | TypeWithPartials | OscillatorType | "pulse" | "pwm";
type OmniOscillatorOptions = PulseOscillatorOptions | PWMOscillatorOptions | OmniFatCustomOscillatorOptions | OmniFatTypeOscillatorOptions | OmniFatPartialsOscillatorOptions | OmniFMCustomOscillatorOptions | OmniFMTypeOscillatorOptions | OmniFMPartialsOscillatorOptions | OmniAMCustomOscillatorOptions | OmniAMTypeOscillatorOptions | OmniAMPartialsOscillatorOptions | ToneOscillatorConstructorOptions;
type OmitSourceOptions<T extends BaseOscillatorOptions> = Omit<T, "frequency" | "detune" | "context">;
type OmniOscillatorSynthOptions = OmitSourceOptions<PulseOscillatorOptions> | OmitSourceOptions<PWMOscillatorOptions> | OmitSourceOptions<OmniFatCustomOscillatorOptions> | OmitSourceOptions<OmniFatTypeOscillatorOptions> | OmitSourceOptions<OmniFatPartialsOscillatorOptions> | OmitSourceOptions<OmniFMCustomOscillatorOptions> | OmitSourceOptions<OmniFMTypeOscillatorOptions> | OmitSourceOptions<OmniFMPartialsOscillatorOptions> | OmitSourceOptions<OmniAMCustomOscillatorOptions> | OmitSourceOptions<OmniAMTypeOscillatorOptions> | OmitSourceOptions<OmniAMPartialsOscillatorOptions> | OmitSourceOptions<ToneCustomOscillatorOptions> | OmitSourceOptions<ToneTypeOscillatorOptions> | OmitSourceOptions<TonePartialOscillatorOptions>;
interface ToneOscillatorNodeOptions extends OneShotSourceOptions {
    frequency: Frequency;
    detune: Cents;
    type: OscillatorType;
}
declare class ToneOscillatorNode extends OneShotSource<ToneOscillatorNodeOptions> {
    readonly name: string;
    private _oscillator;
    protected _internalChannels: OscillatorNode[];
    readonly frequency: Param<"frequency">;
    readonly detune: Param<"cents">;
    constructor(frequency: Frequency, type: OscillatorType);
    constructor(options?: Partial<ToneOscillatorNodeOptions>);
    static getDefaults(): ToneOscillatorNodeOptions;
    start(time?: Time): this;
    protected _stopSource(time?: Seconds): void;
    setPeriodicWave(periodicWave: PeriodicWave): this;
    get type(): OscillatorType;
    set type(type: OscillatorType);
    dispose(): this;
}
type onStopCallback = (source: Source<any>) => void;
interface SourceOptions extends ToneAudioNodeOptions {
    volume: Decibels;
    mute: boolean;
    onstop: onStopCallback;
}
declare abstract class Source<Options extends SourceOptions> extends ToneAudioNode<Options> {
    private _volume;
    output: OutputNode;
    input: undefined;
    volume: Param<"decibels">;
    onstop: onStopCallback;
    protected _state: StateTimeline<{
        duration?: Seconds;
        offset?: Seconds;
        implicitEnd?: boolean;
    }>;
    protected _synced: boolean;
    private _scheduled;
    private _syncedStart;
    private _syncedStop;
    constructor(options: SourceOptions);
    static getDefaults(): SourceOptions;
    get state(): BasicPlaybackState;
    get mute(): boolean;
    set mute(mute: boolean);
    protected abstract _start(time: Time, offset?: Time, duration?: Time): void;
    protected abstract _stop(time: Time): void;
    protected abstract _restart(time: Seconds, offset?: Time, duration?: Time): void;
    private _clampToCurrentTime;
    start(time?: Time, offset?: Time, duration?: Time): this;
    stop(time?: Time): this;
    restart(time?: Time, offset?: Time, duration?: Time): this;
    sync(): this;
    unsync(): this;
    dispose(): this;
}
declare class Oscillator extends Source<ToneOscillatorOptions> implements ToneOscillatorInterface {
    readonly name: string;
    private _oscillator;
    frequency: Signal<"frequency">;
    detune: Signal<"cents">;
    private _wave?;
    private _partials;
    private _partialCount;
    private _phase;
    private _type;
    constructor(frequency?: Frequency, type?: ToneOscillatorType);
    constructor(options?: Partial<ToneOscillatorConstructorOptions>);
    static getDefaults(): ToneOscillatorOptions;
    protected _start(time?: Time): void;
    protected _stop(time?: Time): void;
    protected _restart(time?: Time): this;
    syncFrequency(): this;
    unsyncFrequency(): this;
    private static _periodicWaveCache;
    private _getCachedPeriodicWave;
    get type(): ToneOscillatorType;
    set type(type: ToneOscillatorType);
    get baseType(): OscillatorType;
    set baseType(baseType: OscillatorType);
    get partialCount(): number;
    set partialCount(p: number);
    private _getRealImaginary;
    private _inverseFFT;
    getInitialValue(): AudioRange;
    get partials(): number[];
    set partials(partials: number[]);
    get phase(): Degrees;
    set phase(phase: Degrees);
    asArray(length?: number): Promise<Float32Array>;
    dispose(): this;
}
type LFOOptions = {
    min: number;
    max: number;
    amplitude: NormalRange;
    units: UnitName;
} & ToneOscillatorOptions;
declare class LFO extends ToneAudioNode<LFOOptions> {
    readonly name: string;
    private _oscillator;
    private _amplitudeGain;
    readonly amplitude: Param<"normalRange">;
    private _stoppedSignal;
    private _zeros;
    private _stoppedValue;
    private _a2g;
    private _scaler;
    readonly output: OutputNode;
    readonly input: undefined;
    private _units;
    convert: boolean;
    readonly frequency: Signal<"frequency">;
    constructor(frequency?: Frequency, min?: number, max?: number);
    constructor(options?: Partial<LFOOptions>);
    static getDefaults(): LFOOptions;
    start(time?: Time): this;
    stop(time?: Time): this;
    sync(): this;
    unsync(): this;
    private _setStoppedValue;
    get min(): number;
    set min(min: number);
    get max(): number;
    set max(max: number);
    get type(): ToneOscillatorType;
    set type(type: ToneOscillatorType);
    get partials(): number[];
    set partials(partials: number[]);
    get phase(): Degrees;
    set phase(phase: Degrees);
    get units(): UnitName;
    set units(val: UnitName);
    get state(): BasicPlaybackState;
    connect(node: InputNode, outputNum?: number, inputNum?: number): this;
    private _fromType;
    private _toType;
    private _is;
    private _clampValue;
    dispose(): this;
}
interface DelayOptions2 extends ToneAudioNodeOptions {
    delayTime: Time;
    maxDelay: Time;
}
declare class Delay extends ToneAudioNode<DelayOptions2> {
    readonly name: string;
    private _maxDelay;
    readonly delayTime: Param<"time">;
    private _delayNode;
    readonly input: DelayNode;
    readonly output: DelayNode;
    constructor(delayTime?: Time, maxDelay?: Time);
    constructor(options?: Partial<DelayOptions2>);
    static getDefaults(): DelayOptions2;
    get maxDelay(): Seconds;
    dispose(): this;
}
declare class GainToAudio extends SignalOperator<ToneAudioNodeOptions> {
    readonly name: string;
    private _norm;
    input: WaveShaper;
    output: WaveShaper;
    dispose(): this;
}
interface PitchShiftOptions extends FeedbackEffectOptions {
    pitch: Interval;
    windowSize: Seconds;
    delayTime: Time;
}
declare class PitchShift extends FeedbackEffect<PitchShiftOptions> {
    readonly name: string;
    private _frequency;
    private _delayA;
    private _lfoA;
    private _delayB;
    private _lfoB;
    private _crossFade;
    private _crossFadeLFO;
    private _feedbackDelay;
    readonly delayTime: Param<"time">;
    private _pitch;
    private _windowSize;
    constructor(pitch?: Interval);
    constructor(options?: Partial<PitchShiftOptions>);
    static getDefaults(): PitchShiftOptions;
    get pitch(): number;
    set pitch(interval: number);
    get windowSize(): Seconds;
    set windowSize(size: Seconds);
    dispose(): this;
}
declare function createShift(): PitchShift;
type WaveShaperMappingFn = (value: number, index?: number) => number;
type WaveShaperMapping = WaveShaperMappingFn | number[] | Float32Array;
interface WaveShaperOptions extends ToneAudioNodeOptions {
    mapping?: WaveShaperMapping;
    length: number;
    curve?: number[] | Float32Array;
}
declare class WaveShaper extends SignalOperator<WaveShaperOptions> {
    readonly name: string;
    private _shaper;
    input: WaveShaperNode;
    output: WaveShaperNode;
    constructor(mapping?: WaveShaperMapping, length?: number);
    constructor(options?: Partial<WaveShaperOptions>);
    static getDefaults(): WaveShaperOptions;
    setMap(mapping: WaveShaperMappingFn, length?: number): this;
    get curve(): Float32Array | null;
    set curve(mapping: Float32Array | null);
    get oversample(): OverSampleType;
    set oversample(oversampling: OverSampleType);
    dispose(): this;
}
