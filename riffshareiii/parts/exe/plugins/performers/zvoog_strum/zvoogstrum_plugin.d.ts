declare type Zvoog_Metre = {
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
declare type Zvoog_Slide = {
    duration: Zvoog_Metre;
    delta: number;
};
declare type Zvoog_PluginBase = {
    setup: (audioContext: AudioContext) => boolean;
};
declare type Zvoog_PluginFilter = Zvoog_PluginBase | {
    input: string;
};
declare type Zvoog_PluginPerformer = Zvoog_PluginBase | {
    output: string;
    schedule: (chord: Zvoog_Chord, when: number) => boolean;
};
declare type Zvoog_PluginSampler = Zvoog_PluginBase | {
    output: string;
};
declare type Zvoog_FilterTarget = {
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
declare type Zvoog_AudioSequencer = {
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
declare type Zvoog_AudioSampler = {
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
declare type Zvoog_Chord = {
    skip: Zvoog_Metre;
    pitches: number[];
    slides: Zvoog_Slide[];
};
declare type Zvoog_TrackMeasure = {
    chords: Zvoog_Chord[];
};
declare type Zvoog_PercussionMeasure = {
    skips: Zvoog_Metre[];
};
declare type Zvoog_SongMeasure = {
    tempo: number;
    metre: Zvoog_Metre;
};
declare type Zvoog_FilterMeasure = {
    changes: Zvoog_FilterStateChange[];
};
declare type Zvoog_FilterStateChange = {
    skip: Zvoog_Metre;
    stateBlob: string;
};
declare type Zvoog_PercussionTrack = {
    title: string;
    measures: Zvoog_PercussionMeasure[];
    sampler: Zvoog_AudioSampler;
};
declare type Zvoog_MusicTrack = {
    title: string;
    measures: Zvoog_TrackMeasure[];
    performer: Zvoog_AudioSequencer;
};
declare type Zvoog_CommentText = {
    skip: Zvoog_Metre;
    text: string;
    row: number;
};
declare type Zvoog_CommentMeasure = {
    points: Zvoog_CommentText[];
};
declare type Zvoog_Selection = {
    startMeasure: number;
    endMeasure: number;
};
declare type DifferenceCreate = {
    kind: "+";
    path: (string | number)[];
    newNode: any;
};
declare type DifferenceRemove = {
    kind: "-";
    path: (string | number)[];
    oldNode: any;
};
declare type DifferenceChange = {
    kind: "=";
    path: (string | number)[];
    newValue: any;
    oldValue: any;
};
declare type Zvoog_Action = DifferenceCreate | DifferenceRemove | DifferenceChange;
declare type Zvoog_UICommand = {
    position: {
        x: number;
        y: number;
        z: number;
    };
    actions: Zvoog_Action[];
};
declare type Zvoog_Project = {
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
declare type MZXBX_CachedWave = {
    path: string;
    buffer: AudioBuffer | null;
    canceled?: boolean;
    line100?: number[];
};
declare type MZXBX_FilterHolder = {
    plugin: MZXBX_AudioFilterPlugin | null;
    filterId: string;
    kind: string;
    properties: string;
};
declare type MZXBX_PerformerSamplerHolder = {
    plugin: MZXBX_AudioPerformerPlugin | MZXBX_AudioSamplerPlugin | null;
    channelId: string;
    kind: string;
    properties: string;
};
declare type MZXBX_Channel = {
    id: string;
    performer: MZXBX_ChannelSource;
    outputs: string[];
};
declare type MZXBX_SlideItem = {
    duration: number;
    delta: number;
};
declare type MZXBX_PlayItem = {
    skip: number;
    channelId: string;
    pitches: number[];
    slides: MZXBX_SlideItem[];
};
declare type MZXBX_FilterState = {
    skip: number;
    filterId: string;
    data: string;
};
declare type MZXBX_Set = {
    duration: number;
    tempo: number;
    items: MZXBX_PlayItem[];
    states: MZXBX_FilterState[];
};
declare type MZXBX_Filter = {
    id: string;
    kind: string;
    properties: string;
    outputs: string[];
};
declare type MZXBX_AudioFilterPlugin = {
    launch: (context: AudioContext, parameters: string) => void;
    busy: () => null | string;
    schedule: (when: number, tempo: number, parameters: string) => void;
    input: () => AudioNode | null;
    output: () => AudioNode | null;
};
declare type MZXBX_AudioSamplerPlugin = {
    launch: (context: AudioContext, parameters: string) => void;
    busy: () => null | string;
    start: (when: number, tempo: number) => void;
    cancel: () => void;
    output: () => AudioNode | null;
    duration: () => number;
};
declare type MZXBX_ChannelSource = {
    kind: string;
    properties: string;
};
declare type MZXBX_AudioPerformerPlugin = {
    launch: (context: AudioContext, parameters: string) => void;
    busy: () => null | string;
    strum: (when: number, pitches: number[], tempo: number, slides: MZXBX_SlideItem[]) => void;
    cancel: () => void;
    output: () => AudioNode | null;
};
declare type MZXBX_Schedule = {
    series: MZXBX_Set[];
    channels: MZXBX_Channel[];
    filters: MZXBX_Filter[];
};
declare type MZXBX_Player = {
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
declare type MZXBX_PluginRegistrationInformation = {
    label: string;
    kind: string;
    purpose: 'Action' | 'Filter' | 'Sampler' | 'Performer';
    ui: string;
    evaluate: string;
    script: string;
};
declare type MZXBX_MessageToPlugin = {
    hostData: any;
};
declare type MZXBX_MessageToHost = {
    dialogID: string;
    pluginData: any;
    done: boolean;
};
declare function MZXBX_waitForCondition(sleepMs: number, isDone: () => boolean, onFinish: () => void): void;
declare function MZXBX_loadCachedBuffer(audioContext: AudioContext, path: string, onDone: (cachedWave: MZXBX_CachedWave) => void): void;
declare function MZXBX_appendScriptURL(url: string): boolean;
declare function MMUtil(): Zvoog_MetreMathType;
declare function MZXBX_currentPlugins(): MZXBX_PluginRegistrationInformation[];
declare type ZPWaveEnvelope = {
    audioBufferSourceNode?: AudioBufferSourceNode | null;
    target: AudioNode;
    when: number;
    duration: number;
    cancel: () => void;
    pitch: number;
    preset: ZPWavePreset;
};
declare type ZPWaveZone = {
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
    ahdsr?: boolean | ZPWaveAHDSR[];
    sample?: string;
    file?: string;
    sustain?: number;
};
declare type ZPWavePreset = {
    zones: ZPWaveZone[];
};
declare type ZPWaveSlide = {
    when: number;
    delta: number;
};
declare type ZPWaveAHDSR = {
    duration: number;
    volume: number;
};
declare type ZPCachedPreset = {
    variableName: string;
    filePath: string;
};
declare type ZPPresetInfo = {
    variable: string;
    url: string;
    title: string;
    pitch: number;
};
declare type ChordQueue = {
    when: number;
    destination: AudioNode;
    preset: ZPWavePreset;
    pitch: number;
    duration: number;
    volume?: number;
    slides?: ZPWaveSlide[];
};
declare class ZS_WebAudioFontLoader {
    cached: ZPCachedPreset[];
    player: ZS_WebAudioFontPlayer;
    instrumentKeyArray: string[];
    instrumentNamesArray: string[];
    drumNamesArray: string[];
    drumKeyArray: string[];
    constructor(player: ZS_WebAudioFontPlayer);
    startLoad(audioContext: AudioContext, filePath: string, variableName: string): void;
    decodeAfterLoading(audioContext: AudioContext, variableName: string): void;
    waitOrFinish(variableName: string, onFinish: () => void): void;
    loaded(variableName: string): boolean;
    progress(): number;
    waitLoad(onFinish: () => void): void;
    instrumentTitles: () => string[];
    instrumentKeys(): string[];
    instrumentInfo(n: number): ZPPresetInfo;
    findInstrument(program: number): number;
}
declare class ZS_WebAudioFontPlayer {
    envelopes: ZPWaveEnvelope[];
    loader: ZS_WebAudioFontLoader;
    afterTime: number;
    nearZero: number;
    limitVolume(volume: number | undefined): number;
    queueChord(audioContext: AudioContext, target: AudioNode, preset: ZPWavePreset, when: number, pitches: number[], duration: number, volume?: number, slides?: MZXBX_SlideItem[]): ZPWaveEnvelope[];
    queueStrumUp(audioContext: AudioContext, target: AudioNode, preset: ZPWavePreset, when: number, tempo: number, pitches: number[], duration: number, volume?: number, slides?: MZXBX_SlideItem[]): ZPWaveEnvelope[];
    queueStrumDown(audioContext: AudioContext, target: AudioNode, preset: ZPWavePreset, when: number, tempo: number, pitches: number[], duration: number, volume?: number, slides?: MZXBX_SlideItem[]): ZPWaveEnvelope[];
    queueStrum(audioContext: AudioContext, target: AudioNode, preset: ZPWavePreset, when: number, tempo: number, pitches: number[], duration: number, volume?: number, slides?: MZXBX_SlideItem[]): ZPWaveEnvelope[];
    queueSnap(audioContext: AudioContext, target: AudioNode, preset: ZPWavePreset, when: number, tempo: number, pitches: number[], duration: number, volume?: number, slides?: MZXBX_SlideItem[]): ZPWaveEnvelope[];
    resumeContext(audioContext: AudioContext): void;
    queueWaveTable(audioContext: AudioContext, target: AudioNode, preset: ZPWavePreset, when: number, pitch: number, duration: number, volume?: number, slides?: MZXBX_SlideItem[]): ZPWaveEnvelope | null;
    noZeroVolume(n: number): number;
    setupEnvelope(audioContext: AudioContext, envelope: ZPWaveEnvelope, zone: ZPWaveZone, volume: number, when: number, sampleDuration: number, noteDuration: number): void;
    numValue(aValue: any, defValue: number): number;
    findEnvelope(audioContext: AudioContext, target: AudioNode): ZPWaveEnvelope;
    adjustPreset: (audioContext: AudioContext, preset: ZPWavePreset) => void;
    adjustZone: (audioContext: AudioContext, zone: ZPWaveZone) => void;
    findZone(audioContext: AudioContext, preset: ZPWavePreset, pitch: number): ZPWaveZone | null;
    cancelQueue(audioContext: AudioContext): void;
}
declare class ZvoogStrumPerformerImplementation implements MZXBX_AudioPerformerPlugin {
    audioContext: AudioContext;
    player: ZS_WebAudioFontPlayer;
    volumeNode: GainNode;
    loader: ZS_WebAudioFontLoader;
    midiidx: number;
    listidx: number;
    info: ZPPresetInfo;
    preset: ZPWavePreset | null;
    loudness: number;
    up: boolean;
    mode: 'plain' | 'pong' | 'up' | 'down' | 'snap';
    launch(context: AudioContext, parameters: string): void;
    busy(): null | string;
    strum(whenStart: number, zpitches: number[], tempo: number, mzbxslide: MZXBX_SlideItem[]): void;
    cancel(): void;
    output(): AudioNode | null;
}
declare class ZSUI {
    id: string;
    data: string;
    inslist: any;
    modelist: any;
    voluctrl: any;
    loud: number;
    player: ZS_WebAudioFontPlayer;
    init(): void;
    send2State(): void;
    sendMessageToHost(data: string): void;
    receiveHostMessage(messageEvent: MessageEvent): void;
    setMessagingId(newId: string): void;
    setState(data: string): void;
}
declare function initZStrumUI(): void;
declare function newZvoogStrumPerformerImplementation(): MZXBX_AudioPerformerPlugin;
