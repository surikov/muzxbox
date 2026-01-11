declare var Tone: any;
declare function setContext(context: any, disposeOld: any): any;
declare function connect(srcNode: any, dstNode: any): any;
declare function createShift(): any;
declare class FxPlayer {
    mp3arrayBuffer: ArrayBuffer | null;
    mp3audioBuffer: AudioBuffer | null;
    currentContext: AudioContext | null;
    mp3sourceNode: AudioBufferSourceNode | null;
    volumeNode: GainNode;
    pitchRatio: number;
    shift: any;
    waf: WebAudioFontPlayer;
    reverberator: WebAudioFontReverberator;
    channelMaster: WebAudioFontChannel;
    resetSource(): void;
    resetPitch(nn: number): void;
    startAudioBuffer(rebuff: AudioBuffer): void;
    initContext(): void;
    load(file: File): void;
}
declare let player: FxPlayer;
declare function startLoadMP3(it: any): void;
declare function warnInit(): void;
declare function onPitchChange(it: any): void;
declare function onCompressorLevel(it: any): void;
declare function onCompressorThreshold(it: any): void;
declare function onCompressorKnee(it: any): void;
declare function onCompressorRatio(it: any): void;
declare function onCompressorAttack(it: any): void;
declare function onCompressorRelease(it: any): void;
declare function onReverberatorChange(it: any): void;
declare function onFlangerLevel(it: any): void;
declare function onFlangerDelay(it: any): void;
declare function onFlangerDepth(it: any): void;
declare function onFlangerFeedback(it: any): void;
declare function onFlangerSpeed(it: any): void;
declare function onEq32(it: any): void;
declare function onEq64(it: any): void;
declare function onEq128(it: any): void;
declare function onEq256(it: any): void;
declare function onEq512(it: any): void;
declare function onEq1k(it: any): void;
declare function onEq2k(it: any): void;
declare function onEq4k(it: any): void;
declare function onEq8k(it: any): void;
declare function onEq16k(it: any): void;
declare class Shift2 {
}
declare class FxDelay {
    volume: GainNode;
    delayTime: AudioParam;
    constructor(currentContext: AudioContext);
    input(): AudioNode;
    output(): AudioNode;
    inputDelayTime(): AudioParam;
    inputEffect(): AudioParam;
}
declare class FxSignal {
    volume: GainNode;
    constructor(currentContext: AudioContext);
    output(): AudioNode;
}
declare class FxShaper {
    volume: GainNode;
    constructor(currentContext: AudioContext);
    output(): AudioNode;
    input(): AudioNode;
}
declare class FxGain {
    volume: GainNode;
    constructor(currentContext: AudioContext);
    input(): AudioNode;
    output(): AudioNode;
}
declare class FxLFO {
    volume: GainNode;
    frequency: GainNode;
    constructor(currentContext: AudioContext);
    inputFrequency(): AudioNode;
    output(): AudioNode;
    start(when: number): void;
}
declare class FxCrossFade {
    aa: GainNode;
    bb: GainNode;
    outputNode: GainNode;
    fade: FxSignal;
    g2a: FxShaper;
    panner: StereoPannerNode;
    split: ChannelSplitterNode;
    buffer: AudioBufferSourceNode;
    constructor(currentContext: AudioContext);
    connect(): void;
    inputA(): AudioNode;
    inputB(): AudioNode;
    inputFade(): AudioNode;
    output(): AudioNode;
}
declare class FxShift {
    volume: GainNode;
    frequency: FxSignal;
    delayA: FxDelay;
    delayB: FxDelay;
    lfoA: FxLFO;
    lfoB: FxLFO;
    crossFader: FxCrossFade;
    crossFadeLFO: FxLFO;
    feedbackDelay: FxDelay;
    delayTime: number;
    effectSend: FxGain;
    effectReturn: FxGain;
    _pitch: number;
    _windowSize: number;
    constructor(currentContext: AudioContext);
    setupPitch(shift: number): void;
    connectNodes(): void;
    createNodes(currentContext: AudioContext): void;
    input(): AudioNode;
    output(): AudioNode;
}
declare class WebAudioFontReverberator {
    audioContext: AudioContext;
    output: GainNode;
    input: BiquadFilterNode;
    compressor: DynamicsCompressorNode;
    compressorWet: GainNode;
    compressorDry: GainNode;
    convolver: AudioNode | ConvolverNode | null;
    convolverInput: GainNode;
    dry: GainNode;
    wet: GainNode;
    irrArrayBuffer: ArrayBuffer;
    constructor(audioContext: AudioContext);
    irr: string;
}
declare class WebAudioFontTicker {
    stateStop: number;
    statePlay: number;
    stateEnd: number;
    state: number;
    stepDuration: number;
    lastPosition: number;
    playLoop(player: WebAudioFontPlayer, audioContext: AudioContext, loopStart: number, loopPosition: number, loopEnd: number, queue: ChordQueue[]): void;
    startTicks(audioContext: AudioContext, onTick: (when: number, from: number, to: number) => void, loopStart: number, loopPosition: number, loopEnd: number, onEnd: (loopPosition: number) => void): void;
    tick(audioContext: AudioContext, nextAudioTime: number, onTick: (when: number, from: number, to: number) => void, loopStart: number, loopPosition: number, loopEnd: number, onEnd: (loopPosition: number) => void): void;
    cancel(): void;
}
declare class WebAudioFontPlayer {
    envelopes: WaveEnvelope[];
    loader: WebAudioFontLoader;
    afterTime: number;
    nearZero: number;
    createChannel(audioContext: AudioContext): WebAudioFontChannel;
    createReverberator(audioContext: AudioContext): WebAudioFontReverberator;
    limitVolume(volume: number | undefined): number;
    queueChord(audioContext: AudioContext, target: AudioNode, preset: WavePreset, when: number, pitches: number[], duration: number, volume?: number, slides?: WaveSlide[][]): WaveEnvelope[];
    queueStrumUp(audioContext: AudioContext, target: AudioNode, preset: WavePreset, when: number, pitches: number[], duration: number, volume?: number, slides?: WaveSlide[][]): WaveEnvelope[];
    queueStrumDown(audioContext: AudioContext, target: AudioNode, preset: WavePreset, when: number, pitches: number[], duration: number, volume?: number, slides?: WaveSlide[][]): WaveEnvelope[];
    queueStrum(audioContext: AudioContext, target: AudioNode, preset: WavePreset, when: number, pitches: number[], duration: number, volume?: number, slides?: WaveSlide[][]): WaveEnvelope[];
    queueSnap(audioContext: AudioContext, target: AudioNode, preset: WavePreset, when: number, pitches: number[], duration: number, volume?: number, slides?: WaveSlide[][]): WaveEnvelope[];
    resumeContext(audioContext: AudioContext): void;
    queueWaveTable(audioContext: AudioContext, target: AudioNode, preset: WavePreset, when: number, pitch: number, duration: number, volume?: number, slides?: WaveSlide[]): WaveEnvelope | null;
    noZeroVolume(n: number): number;
    setupEnvelope(audioContext: AudioContext, envelope: WaveEnvelope, zone: WaveZone, volume: number, when: number, sampleDuration: number, noteDuration: number): void;
    numValue(aValue: any, defValue: number): number;
    findEnvelope(audioContext: AudioContext, target: AudioNode): WaveEnvelope;
    adjustPreset: (audioContext: AudioContext, preset: WavePreset) => void;
    adjustZone: (audioContext: AudioContext, zone: WaveZone) => void;
    findZone(audioContext: AudioContext, preset: WavePreset, pitch: number): WaveZone | null;
    cancelQueue(audioContext: AudioContext): void;
}
type WaveEnvelope = {
    audioBufferSourceNode?: AudioBufferSourceNode | null;
    target: AudioNode;
    when: number;
    duration: number;
    cancel: () => void;
    pitch: number;
    preset: WavePreset;
};
type WaveZone = {
    keyRangeLow: number;
    keyRangeHigh: number;
    originalPitch: number;
    coarseTune: number;
    fineTune: number;
    loopStart: number;
    loopEnd: number;
    buffer?: AudioBuffer;
    sampleRate: number;
    delay?: number;
    ahdsr?: boolean | WaveAHDSR[];
    sample?: string;
    file?: string;
    sustain?: number;
};
type WavePreset = {
    zones: WaveZone[];
};
type WaveSlide = {
    when: number;
    delta: number;
};
type WaveAHDSR = {
    duration: number;
    volume: number;
};
type CachedPreset = {
    variableName: string;
    filePath: string;
};
type NumPair = number[];
type PresetInfo = {
    variable: string;
    url: string;
    title: string;
    pitch: number;
};
type ChordQueue = {
    when: number;
    destination: AudioNode;
    preset: WavePreset;
    pitch: number;
    duration: number;
    volume?: number;
    slides?: WaveSlide[];
};
declare class WebAudioFontLoader {
    cached: CachedPreset[];
    player: WebAudioFontPlayer;
    instrumentKeyArray: string[];
    instrumentNamesArray: string[];
    choosenInfos: NumPair[];
    drumNamesArray: string[];
    drumKeyArray: string[];
    constructor(player: WebAudioFontPlayer);
    startLoad(audioContext: AudioContext, filePath: string, variableName: string): void;
    decodeAfterLoading(audioContext: AudioContext, variableName: string): void;
    waitOrFinish(variableName: string, onFinish: () => void): void;
    loaded(variableName: string): boolean;
    progress(): number;
    waitLoad(onFinish: () => void): void;
    instrumentTitles: () => string[];
    instrumentKeys(): string[];
    instrumentInfo(n: number): PresetInfo;
    findInstrument(program: number): number;
    drumTitles(): string[];
    drumKeys(): string[];
    drumInfo(n: number): PresetInfo;
    findDrum(nn: number): number;
}
declare class WebAudioFontChannel {
    audioContext: AudioContext;
    input: GainNode;
    band32: BiquadFilterNode;
    band64: BiquadFilterNode;
    band128: BiquadFilterNode;
    band256: BiquadFilterNode;
    band512: BiquadFilterNode;
    band1k: BiquadFilterNode;
    band2k: BiquadFilterNode;
    band4k: BiquadFilterNode;
    band8k: BiquadFilterNode;
    band16k: BiquadFilterNode;
    output: GainNode;
    constructor(audioContext: AudioContext);
    bandEqualizer(from: AudioNode, frequency: number): BiquadFilterNode;
}
