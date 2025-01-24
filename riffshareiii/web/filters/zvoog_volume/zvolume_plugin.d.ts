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
    dataBlob: string;
    outputs: string[];
    automation: Zvoog_FilterMeasure[];
    iconPosition: {
        x: number;
        y: number;
    };
    state: 0 | 1;
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
    volume: number;
};
declare type Zvoog_MusicTrack = {
    title: string;
    measures: Zvoog_TrackMeasure[];
    performer: Zvoog_AudioSequencer;
    volume: number;
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
    undo: Zvoog_UICommand[];
    redo: Zvoog_UICommand[];
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
declare type MZXBX_PerformerHolder = {
    plugin: MZXBX_AudioPerformerPlugin | null;
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
    schedule: (when: number, parameters: string) => void;
    input: () => AudioNode | null;
    output: () => AudioNode | null;
};
declare type MZXBX_AudioSamplerPlugin = {
    launch: (context: AudioContext, parameters: string) => void;
    busy: () => null | string;
    schedule: (when: number) => void;
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
    schedule: (when: number, pitches: number[], tempo: number, slides: MZXBX_SlideItem[]) => void;
    cancel: () => void;
    output: () => AudioNode | null;
};
declare type MZXBX_Schedule = {
    series: MZXBX_Set[];
    channels: MZXBX_Channel[];
    filters: MZXBX_Filter[];
};
declare type MZXBX_Player = {
    setupPlugins: (context: AudioContext, schedule: MZXBX_Schedule, onDone: () => void) => string | null;
    startLoop: (from: number, position: number, to: number) => string;
    cancel: () => void;
    allFilters(): MZXBX_FilterHolder[];
    allPerformers(): MZXBX_PerformerHolder[];
    position: number;
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
declare class ZVolImplementation implements MZXBX_AudioFilterPlugin {
    audioContext: AudioContext;
    volume: GainNode;
    num: number;
    launch(context: AudioContext, parameters: string): void;
    busy(): null | string;
    schedule(when: number, parameters: string): void;
    input(): AudioNode | null;
    output(): AudioNode | null;
}
declare function newZvoogVolumeImplementation(): MZXBX_AudioFilterPlugin;
