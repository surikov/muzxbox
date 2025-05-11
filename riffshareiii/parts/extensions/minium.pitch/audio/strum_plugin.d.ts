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
    plugin: MZXBX_AudioPerformerPlugin | MZXBX_AudioSamplerPlugin | null;
    channelId: string;
    kind: string;
    properties: string;
    description: string;
};
type MZXBX_Channel = {
    id: string;
    performer: MZXBX_ChannelSource;
    outputs: string[];
};
type MZXBX_SlideItem = {
    duration: number;
    delta: number;
};
type MZXBX_PlayItem = {
    skip: number;
    channelId: string;
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
    launch: (context: AudioContext, parameters: string) => void;
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
    launch: (context: AudioContext, parameters: string) => void;
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
    startSetupPlugins: (context: AudioContext, schedule: MZXBX_Schedule) => string | null;
    startLoopTicks: (from: number, position: number, to: number) => string;
    reconnectAllPlugins: (schedule: MZXBX_Schedule) => void;
    cancel: () => void;
    allFilters(): MZXBX_FilterHolder[];
    allPerformersSamplers(): MZXBX_PerformerSamplerHolder[];
    position: number;
    playState(): {
        connected: boolean;
        play: boolean;
        loading: boolean;
    };
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
};
type MZXBX_MessageToHost = {
    dialogID: string;
    pluginData: any;
    done: boolean;
};
declare function MZXBX_waitForCondition(sleepMs: number, isDone: () => boolean, onFinish: () => void): void;
declare function MZXBX_loadCachedBuffer(audioContext: AudioContext, path: string, onDone: (cachedWave: MZXBX_CachedWave) => void): void;
declare function MZXBX_appendScriptURL(url: string): boolean;
declare function MMUtil(): Zvoog_MetreMathType;
declare function MZXBX_currentPlugins(): MZXBX_PluginRegistrationInformation[];
declare function tonechordinslist(): string[];
declare function tonechordinstrumentKeys(): string[];
type MMWaveEnvelope = {
    audioBufferSourceNode?: AudioBufferSourceNode | null;
    target: AudioNode;
    when: number;
    duration: number;
    cancel: () => void;
    pitch: number;
    preset: MMWavePreset;
};
type MMWaveZone = {
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
    ahdsr?: boolean | MMWaveAHDSR[];
    sample?: string;
    file?: string;
    sustain?: number;
};
type MMWavePreset = {
    zones: MMWaveZone[];
};
type MMWaveSlide = {
    when: number;
    delta: number;
};
type MMWaveAHDSR = {
    duration: number;
    volume: number;
};
type MMCachedPreset = {
    variableName: string;
    filePath: string;
};
type MMPresetInfo = {
    variable: string;
    url: string;
    title: string;
    pitch: number;
};
type MMChordQueue = {
    when: number;
    destination: AudioNode;
    preset: MMWavePreset;
    pitch: number;
    duration: number;
    volume?: number;
    slides?: MMWaveSlide[];
};
declare class MM_WebAudioFontLoader {
    cached: MMCachedPreset[];
    player: MM_WebAudioFontPlayer;
    instrumentKeyArray: string[];
    instrumentNamesArray: string[];
    drumNamesArray: string[];
    drumKeyArray: string[];
    constructor(player: MM_WebAudioFontPlayer);
    startLoad(audioContext: AudioContext, filePath: string, variableName: string): void;
    decodeAfterLoading(audioContext: AudioContext, variableName: string): void;
    waitOrFinish(variableName: string, onFinish: () => void): void;
    loaded(variableName: string): boolean;
    progress(): number;
    waitLoad(onFinish: () => void): void;
    instrumentInfo(n: number): MMPresetInfo;
    findInstrument(program: number): number;
}
declare class MM_WebAudioFontPlayer {
    envelopes: MMWaveEnvelope[];
    loader: MM_WebAudioFontLoader;
    afterTime: number;
    nearZero: number;
    limitVolume(volume: number | undefined): number;
    queueChord(audioContext: AudioContext, target: AudioNode, preset: MMWavePreset, when: number, pitches: number[], duration: number, volume?: number, slides?: MZXBX_SlideItem[]): MMWaveEnvelope[];
    queueStrumUp(audioContext: AudioContext, target: AudioNode, preset: MMWavePreset, when: number, tempo: number, pitches: number[], duration: number, volume?: number, slides?: MZXBX_SlideItem[]): MMWaveEnvelope[];
    queueStrumDown(audioContext: AudioContext, target: AudioNode, preset: MMWavePreset, when: number, tempo: number, pitches: number[], duration: number, volume?: number, slides?: MZXBX_SlideItem[]): MMWaveEnvelope[];
    queueStrum(audioContext: AudioContext, target: AudioNode, preset: MMWavePreset, when: number, tempo: number, pitches: number[], duration: number, volume?: number, slides?: MZXBX_SlideItem[]): MMWaveEnvelope[];
    queueSnap(audioContext: AudioContext, target: AudioNode, preset: MMWavePreset, when: number, tempo: number, pitches: number[], duration: number, volume?: number, slides?: MZXBX_SlideItem[]): MMWaveEnvelope[];
    resumeContext(audioContext: AudioContext): void;
    queueWaveTable(audioContext: AudioContext, target: AudioNode, preset: MMWavePreset, when: number, pitch: number, duration: number, volume?: number, slides?: MZXBX_SlideItem[]): MMWaveEnvelope | null;
    noZeroVolume(n: number): number;
    setupEnvelope(audioContext: AudioContext, envelope: MMWaveEnvelope, zone: MMWaveZone, volume: number, when: number, sampleDuration: number, noteDuration: number): void;
    numValue(aValue: any, defValue: number): number;
    findEnvelope(audioContext: AudioContext, target: AudioNode): MMWaveEnvelope;
    adjustPreset: (audioContext: AudioContext, preset: MMWavePreset) => void;
    adjustZone: (audioContext: AudioContext, zone: MMWaveZone) => void;
    findZone(audioContext: AudioContext, preset: MMWavePreset, pitch: number): MMWaveZone | null;
    cancelQueue(audioContext: AudioContext): void;
}
declare class StrumPerformerImplementation implements MZXBX_AudioPerformerPlugin {
    audioContext: AudioContext;
    player: MM_WebAudioFontPlayer;
    outputVolume: GainNode;
    loader: MM_WebAudioFontLoader;
    listidx: number;
    info: MMPresetInfo;
    preset: MMWavePreset | null;
    loudness: number;
    up: boolean;
    strumModeFlat: 0;
    strumModeDown: 1;
    strumModeUp: 2;
    strumModeSnap: 3;
    strumModePong: 4;
    strumMode: 0 | 1 | 2 | 3 | 4;
    launch(context: AudioContext, parameters: string): void;
    parseParameters(parameters: string): void;
    busy(): null | string;
    strum(whenStart: number, zpitches: number[], tempo: number, mzbxslide: MZXBX_SlideItem[]): void;
    cancel(): void;
    output(): AudioNode | null;
}
declare function newStrumPerformerImplementation(): MZXBX_AudioPerformerPlugin;
