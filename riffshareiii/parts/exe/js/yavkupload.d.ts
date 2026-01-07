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
type Dictionary = Record<string, number>;
type PendingDictionary = Record<string, true>;
type DictionaryCollection = Record<string, Dictionary>;
interface DecompressionTracker {
    val: number;
    position: number;
    index: number;
}
declare class LZUtil {
    keyStrBase64: string;
    keyStrUriSafe: string;
    baseReverseDic: DictionaryCollection;
    getBaseValue(alphabet: string, character: string): number;
    _compress(uncompressed: string | null, bitsPerChar: number, getCharFromInt: (a: number) => string): string;
    _decompress(length: number, resetValue: number, getNextValue: (a: number) => number): string | null | undefined;
    compressToUTF16(input: string | null | undefined): string;
    decompressFromUTF16(compressed: string | null | undefined): string | null | undefined;
}
declare let dt: string;
declare let ya_file_name: string;
declare let ya_picture_name: string;
declare let ya_access_token: string;
declare let projecttextdata: string;
declare let previewArrayBuffer: ArrayBuffer;
declare let image_download_link: string;
declare let project_download_link: string;
declare function dumpResultMessage(txt: string): void;
declare function check_ya_token(): string;
declare function textcell2(num: number): string;
declare function datekey(): string;
declare function sendRequest(token: any, url: any, method: any, jsonOrArrayBuffer: any, onError: any, onDone: any): void;
declare function readYaUploadURL(ya_access_token: any, filename: any, onError: any, onDone: any): void;
declare function uploadYaFileData(ya_upload_url: any, jsonOrArrayBuffer: any, onError: any, onDone: any): void;
declare function dumpYaOperationState(ya_operation_id: any, ya_access_token: any, onError: any, onDone: any): void;
declare function getYaLink(ya_file_name: any, ya_access_token: any, onError: any, onDone: any): void;
declare function getLinkUpload(ya_file_name: any, jsonOrArrayBuffer: any, ya_access_token: any, onError: any, onDone: any): void;
declare function postVKarticle(): void;
declare function yavkInit(): void;
declare function startYAVKipload(): void;
