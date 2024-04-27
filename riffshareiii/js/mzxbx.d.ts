declare class MZXBX_ScaleMath {
}
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
declare type Zvoog_Note = {
    pitch: number;
    slides: Zvoog_Slide[];
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
    output: null | Zvoog_FilterTarget;
    automation: Zvoog_AutomationTrack;
};
declare type Zvoog_AudioSequencer = {
    id: string;
    data: string;
    kind: string;
    output: null | Zvoog_FilterTarget;
};
declare type Zvoog_AudioSampler = {
    id: string;
    data: string;
};
declare type Zvoog_Chord = {
    skip: Zvoog_Metre;
    notes: Zvoog_Note[];
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
declare type Zvoog_AutomationTrack = {
    title: string;
    measures: Zvoog_FilterMeasure[];
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
};
declare type Zvoog_CommentMeasure = {
    texts: Zvoog_CommentText[];
};
declare type Zvoog_Selection = {
    startMeasure: number;
    endMeasure: number;
};
declare type Zvoog_Project = {
    title: string;
    timeline: Zvoog_SongMeasure[];
    tracks: Zvoog_MusicTrack[];
    percussions: Zvoog_PercussionTrack[];
    comments: Zvoog_CommentMeasure[];
    filters: Zvoog_FilterTarget[];
    selection?: Zvoog_Selection;
};
declare type MZXBX_CachedWave = {
    path: string;
    buffer: AudioBuffer | null;
    canceled?: boolean;
    line100?: number[];
};
declare type MZXBX_FilterHolder = {
    plugin: MZXBX_AudioFilterPlugin | null;
    id: string;
    kind: string;
    properties: string;
    launched: boolean;
};
declare type MZXBX_PerformerHolder = {
    plugin: MZXBX_AudioPerformerPlugin | null;
    id: string;
    kind: string;
    properties: string;
    launched: boolean;
};
declare type MZXBX_Channel = {
    id: string;
    comment?: string;
    filters: MZXBX_ChannelFilter[];
    performer: MZXBX_ChannelPerformer;
};
declare type MZXBX_SlideItem = {
    duration: number;
    delta: number;
};
declare type MZXBX_PlayItem = {
    skip: number;
    channelId: string;
    pitch: number;
    slides: MZXBX_SlideItem[];
};
declare type MZXBX_FilterState = {
    skip: number;
    filterId: string;
    data: string;
};
declare type MZXBX_Set = {
    duration: number;
    items: MZXBX_PlayItem[];
    states: MZXBX_FilterState[];
};
declare type MZXBX_ChannelFilter = {
    id: string;
    kind: string;
    properties: string;
};
declare type MZXBX_AudioFilterPlugin = {
    launch: (context: AudioContext, parameters: string) => void;
    busy: () => null | string;
    schedule: (when: number, parameters: string) => void;
    input: () => AudioNode | null;
    output: () => AudioNode | null;
};
declare type MZXBX_ChannelPerformer = {
    id: string;
    kind: string;
    properties: string;
};
declare type MZXBX_AudioPerformerPlugin = {
    launch: (context: AudioContext, parameters: string) => void;
    busy: () => null | string;
    schedule: (when: number, pitch: number, slides: MZXBX_SlideItem[]) => void;
    cancel: () => void;
    output: () => AudioNode | null;
};
declare type MZXBX_Schedule = {
    series: MZXBX_Set[];
    channels: MZXBX_Channel[];
    filters: MZXBX_ChannelFilter[];
};
declare type MZXBX_Player = {
    setupPlugins: (context: AudioContext, schedule: MZXBX_Schedule, onDone: () => void) => void;
    startLoop: (from: number, position: number, to: number) => string;
    cancel: () => void;
    allFilters(): MZXBX_FilterHolder[];
    allPerformers(): MZXBX_PerformerHolder[];
    position: number;
};
declare type MZXBX_PluginRegistrationInformation = {
    id: string;
    label: string;
    group: string;
    url: string;
    evaluate: string;
};
declare function MZXBX_waitForCondition(sleepMs: number, isDone: () => boolean, onFinish: () => void): void;
declare function MZXBX_loadCachedBuffer(audioContext: AudioContext, path: string, onDone: (cachedWave: MZXBX_CachedWave) => void): void;
declare function MZXBX_appendScriptURL(url: string): boolean;
declare function MMUtil(): Zvoog_MetreMathType;
declare function MZXBX_currentPlugins(): MZXBX_PluginRegistrationInformation[];
declare let testSchedule: MZXBX_Schedule;
declare class MuzXbox {
    uiStarted: boolean;
    audioContext: AudioContext;
    player: SchedulePlayer;
    setupDone: boolean;
    currentDuration: number;
    songslide: HTMLInputElement | null;
    constructor();
    initAfterLoad(): void;
    initFromUI(): void;
    updatePosition(pp: number): void;
    updateSongSlider(): void;
    setSongSlider(): void;
    initAudioContext(): void;
    resumeContext(audioContext: AudioContext): void;
}
declare function createSchedulePlayer(): MZXBX_Player;
declare class SchedulePlayer implements MZXBX_Player {
    position: number;
    audioContext: AudioContext;
    schedule: MZXBX_Schedule | null;
    performers: {
        plugin: MZXBX_AudioPerformerPlugin | null;
        id: string;
        kind: string;
        properties: string;
        launched: boolean;
    }[];
    filters: MZXBX_FilterHolder[];
    pluginsList: MZXBX_PerformerHolder[];
    nextAudioContextStart: number;
    tickDuration: number;
    onAir: boolean;
    setupPlugins(context: AudioContext, schedule: MZXBX_Schedule, onDone: () => void): void;
    allFilters(): MZXBX_FilterHolder[];
    allPerformers(): MZXBX_PerformerHolder[];
    launchCollectedPlugins(): null | string;
    checkCollectedPlugins(): null | string;
    startLoop(loopStart: number, currentPosition: number, loopEnd: number): string;
    connect(): string | null;
    disconnect(): void;
    tick(loopStart: number, loopEnd: number): void;
    findPerformerPlugin(channelId: string): MZXBX_AudioPerformerPlugin | null;
    sendPerformerItem(it: MZXBX_PlayItem, whenAudio: number): void;
    findFilterPlugin(filterId: string): MZXBX_AudioFilterPlugin | null;
    sendFilterItem(state: MZXBX_FilterState, whenAudio: number): void;
    ms(nn: number): number;
    sendPiece(fromPosition: number, toPosition: number, whenAudio: number): void;
    cancel(): void;
}
declare class MusicTicker {
    startPlay(): void;
    cancelPlay(): void;
    setPosition(seconds: number): void;
    getPosition(): number;
}
declare function MZXBX_currentPlugins(): MZXBX_PluginRegistrationInformation[];
declare class PluginLoader {
    collectLoadPlugins(schedule: MZXBX_Schedule, filters: MZXBX_FilterHolder[], performers: MZXBX_PerformerHolder[], afterLoad: () => void): void;
    startLoadCollectedPlugins(filters: MZXBX_FilterHolder[], performers: MZXBX_PerformerHolder[], afterLoad: () => void): void;
    startLoadPluginStarter(kind: string, filters: MZXBX_FilterHolder[], performers: MZXBX_PerformerHolder[], onDone: (plugin: any) => void, afterLoad: () => void): void;
    сollectFilterPlugin(id: string, kind: string, properties: string, filters: MZXBX_FilterHolder[]): void;
    сollectPerformerPlugin(id: string, kind: string, properties: string, performers: MZXBX_PerformerHolder[]): void;
    findPluginInfo(kind: string): MZXBX_PluginRegistrationInformation | null;
}
