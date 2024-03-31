declare class MZXBX_ScaleMath {
    basePitch: MZXBX_HalfTone;
    step2: MZXBX_StepSkip;
    step3: MZXBX_StepSkip;
    step4: MZXBX_StepSkip;
    step5: MZXBX_StepSkip;
    step6: MZXBX_StepSkip;
    step7: MZXBX_StepSkip;
    scale(): MZXBX_Scale;
}
type MZXBX_CachedWave = {
    path: string;
    buffer: AudioBuffer | null;
    canceled?: boolean;
    line100?: number[];
};
type MZXBX_Metre = {
    count: number;
    part: number;
};
interface MZXBX_MetreMathType {
    count: number;
    part: number;
    set(from: MZXBX_Metre): MZXBX_MetreMathType;
    metre(): MZXBX_Metre;
    simplyfy(): MZXBX_MetreMathType;
    strip(toPart: number): MZXBX_MetreMathType;
    equals(metre: MZXBX_Metre): boolean;
    less(metre: MZXBX_Metre): boolean;
    more(metre: MZXBX_Metre): boolean;
    plus(metre: MZXBX_Metre): MZXBX_MetreMathType;
    minus(metre: MZXBX_Metre): MZXBX_MetreMathType;
    duration(tempo: number): number;
    calculate(duration: number, tempo: number): MZXBX_MetreMathType;
}
type MZXBX_HalfTone = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
type MZXBX_Octave = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type MZXBX_Step = 1 | 2 | 3 | 4 | 5 | 6 | 7;
type MZXBX_StepShift = -2 | -1 | 0 | 1 | 2;
type MZXBX_StepSkip = 1 | 2;
type MZXBX_Scale = {
    basePitch: MZXBX_HalfTone;
    step2: MZXBX_StepSkip;
    step3: MZXBX_StepSkip;
    step4: MZXBX_StepSkip;
    step5: MZXBX_StepSkip;
    step6: MZXBX_StepSkip;
    step7: MZXBX_StepSkip;
};
type MZXBX_Slide = {
    duration: MZXBX_Metre;
    delta: number;
};
type MZXBX_Note = {
    step?: MZXBX_Step;
    shift?: MZXBX_StepShift;
    octave?: MZXBX_Octave;
    pitch: number;
    slides: MZXBX_Slide[];
};
type MZXBX_PluginBase = {
    setup: (audioContext: AudioContext) => boolean;
};
type MZXBX_PluginFilter = MZXBX_PluginBase | {
    input: string;
};
type MZXBX_PluginPerformer = MZXBX_PluginBase | {
    output: string;
    schedule: (chord: MZXBX_Chord, when: number) => boolean;
};
type MZXBX_PluginSampler = MZXBX_PluginBase | {
    output: string;
};
type MZXBX_AudioFilter = {
    id: string;
    data: string;
};
type MZXBX_AudioPerformer = {
    id: string;
    data: string;
};
type MZXBX_AudioSampler = {
    id: string;
    data: string;
};
type MZXBX_Chord = {
    skip: MZXBX_Metre;
    notes: MZXBX_Note[];
};
type MZXBX_TrackMeasure = {
    chords: MZXBX_Chord[];
};
type MZXBX_PercussionMeasure = {
    skips: MZXBX_Metre[];
};
type MZXBX_SongMeasure = {
    tempo: number;
    metre: MZXBX_Metre;
    scale?: MZXBX_Scale;
};
type MZXBX_PercussionTrack = {
    title: string;
    measures: MZXBX_PercussionMeasure[];
    filters: MZXBX_AudioFilter[];
    sampler: MZXBX_AudioSampler;
};
type MZXBX_MusicTrack = {
    title: string;
    measures: MZXBX_TrackMeasure[];
    filters: MZXBX_AudioFilter[];
    performer: MZXBX_AudioPerformer;
};
type MZXBX_CommentText = {
    skip: MZXBX_Metre;
    text: string;
};
type MZXBX_CommentMeasure = {
    texts: MZXBX_CommentText[];
};
type MZXBX_Project = {
    title: string;
    timeline: MZXBX_SongMeasure[];
    tracks: MZXBX_MusicTrack[];
    percussions: MZXBX_PercussionTrack[];
    comments: MZXBX_CommentMeasure[];
    filters: MZXBX_AudioFilter[];
};
type MZXBX_FilterHolder = {
    plugin: MZXBX_AudioFilterPlugin | null;
    id: string;
    kind: string;
    properties: string;
    launched: boolean;
};
type MZXBX_PerformerHolder = {
    plugin: MZXBX_AudioPerformerPlugin | null;
    id: string;
    kind: string;
    properties: string;
    launched: boolean;
};
type MZXBX_Channel = {
    id: string;
    comment?: string;
    filters: MZXBX_ChannelFilter[];
    performer: MZXBX_ChannelPerformer;
};
type MZXBX_SlideItem = {
    duration: number;
    delta: number;
};
type MZXBX_PlayItem = {
    skip: number;
    channelId: string;
    pitch: number;
    slides: MZXBX_SlideItem[];
};
type MZXBX_FilterState = {
    skip: number;
    filterId: string;
    data: string;
};
type MZXBX_Set = {
    duration: number;
    items: MZXBX_PlayItem[];
    states: MZXBX_FilterState[];
};
type MZXBX_ChannelFilter = {
    id: string;
    kind: string;
    properties: string;
};
type MZXBX_AudioFilterPlugin = {
    launch: (context: AudioContext, parameters: string) => void;
    busy: () => null | string;
    schedule: (when: number, parameters: string) => void;
    input: () => AudioNode | null;
    output: () => AudioNode | null;
};
type MZXBX_ChannelPerformer = {
    id: string;
    kind: string;
    properties: string;
};
type MZXBX_AudioPerformerPlugin = {
    launch: (context: AudioContext, parameters: string) => void;
    busy: () => null | string;
    schedule: (when: number, pitch: number, slides: MZXBX_SlideItem[]) => void;
    cancel: () => void;
    output: () => AudioNode | null;
};
type MZXBX_Schedule = {
    series: MZXBX_Set[];
    channels: MZXBX_Channel[];
    filters: MZXBX_ChannelFilter[];
};
type MZXBX_Player = {
    setupPlugins: (context: AudioContext, schedule: MZXBX_Schedule, onDone: () => void) => void;
    startLoop: (from: number, position: number, to: number) => string;
    cancel: () => void;
    allFilters(): MZXBX_FilterHolder[];
    allPerformers(): MZXBX_PerformerHolder[];
    position: number;
};
type MZXBX_import = {
    import: () => MZXBX_Schedule | null;
};
type MZXBX_PluginRegistrationInformation = {
    id: string;
    label: string;
    group: string;
    url: string;
    evaluate: string;
};
declare function MZXBX_waitForCondition(sleepMs: number, isDone: () => boolean, onFinish: () => void): void;
declare function MZXBX_loadCachedBuffer(audioContext: AudioContext, path: string, onDone: (cachedWave: MZXBX_CachedWave) => void): void;
declare function MZXBX_appendScriptURL(url: string): boolean;
declare function MZMM(): MZXBX_MetreMathType;
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
