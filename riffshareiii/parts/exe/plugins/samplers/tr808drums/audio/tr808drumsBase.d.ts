type Zvoog_Metre = {
    count: number;
    part: number;
};
interface Zvoog_MetreMathType {
    count: number;
    part: number;
    set(from: Zvoog_Metre): Zvoog_MetreMathType;
    metre(): Zvoog_Metre;
    simplyfy(): Zvoog_MetreMathType;
    strip(toPart: number): Zvoog_MetreMathType;
    floor(toPart: number): Zvoog_MetreMathType;
    equals(metre: Zvoog_Metre): boolean;
    less(metre: Zvoog_Metre): boolean;
    more(metre: Zvoog_Metre): boolean;
    plus(metre: Zvoog_Metre): Zvoog_MetreMathType;
    minus(metre: Zvoog_Metre): Zvoog_MetreMathType;
    duration(tempo: number): number;
    calculate(duration: number, tempo: number): Zvoog_MetreMathType;
}
type Zvoog_Slide = {
    duration: Zvoog_Metre;
    delta: number;
};
type Zvoog_PluginBase = {
    setup: (audioContext: AudioContext) => boolean;
};
type Zvoog_PluginFilter = Zvoog_PluginBase | {
    input: string;
};
type Zvoog_PluginPerformer = Zvoog_PluginBase | {
    output: string;
    schedule: (chord: Zvoog_Chord, when: number) => boolean;
};
type Zvoog_PluginSampler = Zvoog_PluginBase | {
    output: string;
};
type Zvoog_FilterTarget = {
    id: string;
    kind: string;
    data: string;
    outputs: string[];
    automation: Zvoog_FilterMeasure[];
    iconPosition: {
        x: number;
        y: number;
    };
    state: 0 | 1;
    title: string;
};
type Zvoog_AudioSequencer = {
    id: string;
    data: string;
    kind: string;
    outputs: string[];
    iconPosition: {
        x: number;
        y: number;
    };
    state: 0 | 1 | 2;
    hint1_128: number;
};
type Zvoog_AudioSampler = {
    id: string;
    data: string;
    kind: string;
    outputs: string[];
    iconPosition: {
        x: number;
        y: number;
    };
    state: 0 | 1 | 2;
    hint35_81: number;
};
type Zvoog_Chord = {
    skip: Zvoog_Metre;
    pitches: number[];
    slides: Zvoog_Slide[];
};
type Zvoog_TrackMeasure = {
    chords: Zvoog_Chord[];
};
type Zvoog_PercussionMeasure = {
    skips: Zvoog_Metre[];
};
type Zvoog_SongMeasure = {
    tempo: number;
    metre: Zvoog_Metre;
};
type Zvoog_FilterMeasure = {
    changes: Zvoog_FilterStateChange[];
};
type Zvoog_FilterStateChange = {
    skip: Zvoog_Metre;
    stateBlob: string;
};
type Zvoog_PercussionTrack = {
    title: string;
    measures: Zvoog_PercussionMeasure[];
    sampler: Zvoog_AudioSampler;
};
type Zvoog_MusicTrack = {
    title: string;
    measures: Zvoog_TrackMeasure[];
    performer: Zvoog_AudioSequencer;
};
type Zvoog_CommentText = {
    skip: Zvoog_Metre;
    text: string;
    row: number;
};
type Zvoog_CommentMeasure = {
    points: Zvoog_CommentText[];
};
type Zvoog_Selection = {
    startMeasure: number;
    endMeasure: number;
};
type DifferenceCreate = {
    kind: "+";
    path: (string | number)[];
    newNode: any;
};
type DifferenceRemove = {
    kind: "-";
    path: (string | number)[];
    oldNode: any;
};
type DifferenceChange = {
    kind: "=";
    path: (string | number)[];
    newValue: any;
    oldValue: any;
};
type Zvoog_Action = DifferenceCreate | DifferenceRemove | DifferenceChange;
type Zvoog_UICommand = {
    position: {
        x: number;
        y: number;
        z: number;
    };
    actions: Zvoog_Action[];
};
type Zvoog_Project = {
    versionCode: '1';
    title: string;
    timeline: Zvoog_SongMeasure[];
    tracks: Zvoog_MusicTrack[];
    farorder: number[];
    percussions: Zvoog_PercussionTrack[];
    comments: Zvoog_CommentMeasure[];
    filters: Zvoog_FilterTarget[];
    selectedPart: Zvoog_Selection;
    position: {
        x: number;
        y: number;
        z: number;
    };
    list: boolean;
    menuPerformers: boolean;
    menuSamplers: boolean;
    menuFilters: boolean;
    menuActions: boolean;
    menuPlugins: boolean;
    menuClipboard: boolean;
    menuSettings: boolean;
};
type MZXBX_CachedWave = {
    path: string;
    buffer: AudioBuffer | null;
    canceled?: boolean;
    line100?: number[];
};
type MZXBX_FilterHolder = {
    pluginAudioFilter: MZXBX_AudioFilterPlugin | null;
    filterId: string;
    kind: string;
    properties: string;
    description: string;
};
type MZXBX_PerformerSamplerHolder = {
    pluginPerformerSampler: MZXBX_AudioPerformerPlugin | MZXBX_AudioSamplerPlugin | null;
    channel: MZXBX_Channel;
    kind: string;
    properties: string;
    description: string;
};
type MZXBX_Channel = {
    id: string;
    performer: MZXBX_ChannelSource;
    outputs: string[];
    hint: number;
};
type MZXBX_SlideItem = {
    duration: number;
    delta: number;
};
type MZXBX_PlayItem = {
    skip: number;
    channel: MZXBX_Channel;
    pitches: number[];
    slides: MZXBX_SlideItem[];
};
type MZXBX_FilterState = {
    skip: number;
    filterId: string;
    data: string;
};
type MZXBX_Set = {
    duration: number;
    tempo: number;
    items: MZXBX_PlayItem[];
    states: MZXBX_FilterState[];
};
type MZXBX_Filter = {
    id: string;
    kind: string;
    properties: string;
    outputs: string[];
    description: string;
};
type MZXBX_AudioFilterPlugin = {
    launch: (context: AudioContext, parameters: string) => void;
    busy: () => null | string;
    schedule: (when: number, tempo: number, parameters: string) => void;
    input: () => AudioNode | null;
    output: () => AudioNode | null;
};
type MZXBX_AudioSamplerPlugin = {
    launch: (context: AudioContext, parameters: string) => number;
    busy: () => null | string;
    start: (when: number, tempo: number) => void;
    cancel: () => void;
    output: () => AudioNode | null;
    duration: () => number;
};
type MZXBX_ChannelSource = {
    kind: string;
    properties: string;
    description: string;
};
type MZXBX_AudioPerformerPlugin = {
    launch: (context: AudioContext, parameters: string) => number;
    busy: () => null | string;
    strum: (when: number, pitches: number[], tempo: number, slides: MZXBX_SlideItem[]) => void;
    cancel: () => void;
    output: () => AudioNode | null;
};
type MZXBX_Schedule = {
    series: MZXBX_Set[];
    channels: MZXBX_Channel[];
    filters: MZXBX_Filter[];
};
type MZXBX_Player = {
    replaceCurrentSchedule(schedule: MZXBX_Schedule): void;
    startSetupPlugins: (context: AudioContext, schedule: MZXBX_Schedule) => string | null;
    startLoopTicks(loopStart: number, currentPosition: number, loopEnd: number, onDone: (message: string | null) => void): void;
    cancel: () => void;
    allFilters(): MZXBX_FilterHolder[];
    allPerformersSamplers(): MZXBX_PerformerSamplerHolder[];
    position: number;
    playState(): {
        connected: boolean;
        play: boolean;
        loading: boolean;
    };
    clearPluginsCache(): void;
};
type MZXBX_PluginRegistrationInformation = {
    label: string;
    kind: string;
    purpose: 'Action' | 'Filter' | 'Sampler' | 'Performer';
    ui: string;
    evaluate: string;
    script: string;
};
type MZXBX_MessageToPlugin = {
    hostData: any;
    colors: {
        background: string;
        main: string;
        drag: string;
        line: string;
        click: string;
    };
    screenData: number[] | null;
    langID: string;
};
type MZXBX_MessageToHost = {
    dialogID: string;
    pluginData: any;
    done: boolean;
    screenWait: boolean;
};
declare function MZXBX_waitForCondition(sleepMs: number, isDone: () => boolean, onFinish: () => void): void;
declare function MZXBX_loadCachedBuffer(audioContext: AudioContext, path: string, onDone: (cachedWave: MZXBX_CachedWave) => void): void;
declare function MZXBX_appendScriptURL(url: string): boolean;
declare function MMUtil(): Zvoog_MetreMathType;
declare function MZXBX_currentPlugins(): MZXBX_PluginRegistrationInformation[];
declare let drumInfos: Drum808info[];
declare let kickInfos: Drum808info[];
declare let snareInfos: Snare808info[];
declare let clapInfos: Clap808info[];
declare let hatInfos: Hat808info[];
declare let ohatInfos: Hat808info[];
declare let cowbellInfos: Cowbell808info[];
declare let tomInfos: Tom808info[];
declare class TR808Synth implements MZXBX_AudioSamplerPlugin {
    audioContext: AudioContext;
    drumOutput: GainNode;
    drumsCache: DrumCacheItem[];
    parameters: BoomParameters;
    currentDuration: number;
    takeEngine(kind: number): DrumCacheItem;
    launch(context: AudioContext, parameters: string): number;
    busy(): null | string;
    start(when: number, tempo: number): void;
    cancel(): void;
    output(): AudioNode | null;
    duration(): number;
}
type DrumEngineProps808 = {
    startFrequency: number;
    nextFrequency: number;
    freqChangeDuration: number;
    duration: number;
    clickLevel: number;
    clickWave: string;
    clickFrequency: number;
    driveLevel: number;
    baseWave: string;
    baselevel: number;
};
type SnareEngineProps808 = {
    toneDur: number;
    noiseLevel: number;
    noiceDur: number;
    noiseFreq: number;
    tones: {
        frequency: number;
        volume: number;
    }[];
};
type ClapEngineProps808 = {
    freq: number;
    bursts: number[];
    qualityFactor: number;
    tail: number;
};
type HatEngineProps808 = {
    level: number;
    bandFiFreq: number;
    highFiFreq: number;
    decay: number;
    freqScale: number;
    washVolume: number;
};
type CowbellEngineProps808 = {
    bellLevel: number;
    duration: number;
    freqs: number[];
    bpFilterFreq: number;
    strikeVolume: number;
    qualityFilter: number;
};
type TomEngineProps808 = {
    startFreq: number;
    nextFreq: number;
    drop: number;
    duration: number;
    tomwave: string;
    skinLevel: number;
    skinFreq: number;
    skinDur: number;
};
type Drum808info = {
    drumname: string;
    drumprops: DrumEngineProps808;
};
type Snare808info = {
    snarename: string;
    snareprops: SnareEngineProps808;
};
type Clap808info = {
    clapname: string;
    clapprops: ClapEngineProps808;
};
type Hat808info = {
    hatname: string;
    hatprops: HatEngineProps808;
};
type Cowbell808info = {
    cowbellname: string;
    cowbellprops: CowbellEngineProps808;
};
type Tom808info = {
    tomname: string;
    tomprops: TomEngineProps808;
};
type DrumCacheItem = {
    kind: number;
    drum: BoomDrum;
};
type BoomDrum = {
    start: (when: number, pitchRatio: number, volume: number) => void;
    cancel: () => void;
    duration: () => number;
    endTime: () => number;
    output: () => AudioNode;
};
type BoomParameters = {
    volume: number;
    ratio: number;
    nn: number;
};
declare class VoiceKick implements BoomDrum {
    lastWhen: number;
    wholeDuration: number;
    baseOscillator: OscillatorNode;
    baseGain: GainNode;
    outGain: GainNode;
    clickOscillator: OscillatorNode;
    driveGain: GainNode;
    clickGain: GainNode;
    waveShaper: WaveShaperNode;
    audioContext: AudioContext;
    drumProperties: DrumEngineProps808;
    constructor(context: AudioContext, propertyId: number);
    start(when: number, pitchRatio: number, volume: number): void;
    cancel(): void;
    duration(): number;
    endTime(): number;
    curveArray(): Float32Array<ArrayBuffer>;
    output(): GainNode;
}
type SnareTone = {
    osc: OscillatorNode;
    baseGain: GainNode;
};
declare class VoiceSnare implements BoomDrum {
    lastWhen: number;
    wholeDuration: number;
    outGain: GainNode;
    audioContext: AudioContext;
    drumProperties: SnareEngineProps808;
    tones: SnareTone[];
    NOISE_SECONDS: number;
    NOISE_DATA: Float32Array;
    noiseSourceBuffer: AudioBufferSourceNode;
    bqFilter: BiquadFilterNode;
    noiseGain: GainNode;
    fillNoiseData(): Float32Array<ArrayBuffer>;
    fillFrom(dst: Float32Array, src: Float32Array): void;
    noiseBuf(ac: AudioContext): AudioBuffer;
    noiseSrc(ac: AudioContext): AudioBufferSourceNode;
    constructor(context: AudioContext, propertyId: number);
    start(when: number, pitchRatio: number, volume: number): void;
    cancel(): void;
    duration(): number;
    endTime(): number;
    output(): GainNode;
    takeTone(from: number): SnareTone;
}
declare class VoiceHat implements BoomDrum {
    lastWhen: number;
    wholeDuration: number;
    outGain: GainNode;
    audioContext: AudioContext;
    drumProperties: HatEngineProps808;
    NOISE_SECONDS: number;
    NOISE_DATA: Float32Array;
    noiseBufferSource: AudioBufferSourceNode;
    biFilter: BiquadFilterNode;
    baseGain: GainNode;
    freqs: number[];
    hipaFilter: BiquadFilterNode;
    oscs: OscillatorNode[];
    washFilter: BiquadFilterNode;
    noiseGain: GainNode;
    noiseSource: AudioBufferSourceNode;
    constructor(context: AudioContext, propertyId: number);
    fillNoiseData(): Float32Array<ArrayBuffer>;
    fillFrom(dst: Float32Array, src: Float32Array): void;
    noiseBuf(ac: AudioContext): AudioBuffer;
    noiseSrc(ac: AudioContext): AudioBufferSourceNode;
    start(when: number, pitchRatio: number, volume: number): void;
    cancel(): void;
    duration(): number;
    endTime(): number;
    output(): GainNode;
}
declare class VoiceBell implements BoomDrum {
    lastWhen: number;
    wholeDuration: number;
    outGain: GainNode;
    audioContext: AudioContext;
    drumProperties: CowbellEngineProps808;
    NOISE_SECONDS: number;
    NOISE_DATA: Float32Array;
    noiseBufferSource: AudioBufferSourceNode;
    passFilter: BiquadFilterNode;
    subfreqs: {
        beep: OscillatorNode;
        bifilter: BiquadFilterNode;
        vogain: GainNode;
    }[];
    noiseGain: GainNode;
    noiseSource: AudioBufferSourceNode;
    bellEng(ctx: any, when: any, out: any, pitchRatio: any, props: CowbellEngineProps808): void;
    constructor(context: AudioContext, propertyId: number);
    start(when: number, pitchRatio: number, volume: number): void;
    cancel(): void;
    duration(): number;
    endTime(): number;
    output(): GainNode;
    fillNoiseData(): Float32Array<ArrayBuffer>;
    fillFrom(dst: Float32Array, src: Float32Array): void;
    noiseBuf(ac: AudioContext): AudioBuffer;
    noiseSrc(ac: AudioContext): AudioBufferSourceNode;
}
declare class VoiceClap implements BoomDrum {
    lastWhen: number;
    wholeDuration: number;
    outGain: GainNode;
    audioContext: AudioContext;
    drumProperties: ClapEngineProps808;
    NOISE_SECONDS: number;
    NOISE_DATA: Float32Array;
    noiseBufferSource: AudioBufferSourceNode;
    biFilter: BiquadFilterNode;
    baseGain: GainNode;
    constructor(context: AudioContext, propertyId: number);
    fillNoiseData(): Float32Array<ArrayBuffer>;
    fillFrom(dst: Float32Array, src: Float32Array): void;
    noiseBuf(ac: AudioContext): AudioBuffer;
    noiseSrc(ac: AudioContext): AudioBufferSourceNode;
    start(when: number, pitchRatio: number, volume: number): void;
    cancel(): void;
    duration(): number;
    endTime(): number;
    output(): GainNode;
}
declare function createNewTR808synth(): MZXBX_AudioSamplerPlugin;
