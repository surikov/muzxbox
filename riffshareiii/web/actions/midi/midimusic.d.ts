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
    automation: Zvoog_AutomationTrack | null;
    iconPosition?: {
        x: number;
        y: number;
    };
};
declare type Zvoog_AudioSequencer = {
    id: string;
    data: string;
    kind: string;
    outputs: string[];
    iconPosition?: {
        x: number;
        y: number;
    };
};
declare type Zvoog_AudioSampler = {
    id: string;
    data: string;
    kind: string;
    outputs: string[];
    iconPosition?: {
        x: number;
        y: number;
    };
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
    row: number;
};
declare type Zvoog_CommentMeasure = {
    points: Zvoog_CommentText[];
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
    focus?: 0 | 1 | 2 | 3;
    position?: {
        x: number;
        y: number;
        z: number;
    };
    list?: boolean;
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
declare type MZXBX_ChannelSampler = {
    id: string;
    kind: string;
    properties: string;
};
declare type MZXBX_AudioSamplerPlugin = {
    launch: (context: AudioContext, parameters: string) => void;
    busy: () => null | string;
    schedule: (when: number) => void;
    cancel: () => void;
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
    schedule: (when: number, pitches: number[], tempo: number, slides: MZXBX_SlideItem[]) => void;
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
declare enum MZXBX_PluginPurpose {
    Action = 0,
    Filter = 1,
    Sampler = 2,
    Performer = 3
}
declare type MZXBX_PluginRegistrationInformation = {
    label: string;
    kind: string;
    purpose: MZXBX_PluginPurpose;
    ui: string;
    evaluate: string;
    script: string;
};
declare type MZXBX_PluginMessage = {
    dialogID: string;
    data: any;
};
declare function MZXBX_waitForCondition(sleepMs: number, isDone: () => boolean, onFinish: () => void): void;
declare function MZXBX_loadCachedBuffer(audioContext: AudioContext, path: string, onDone: (cachedWave: MZXBX_CachedWave) => void): void;
declare function MZXBX_appendScriptURL(url: string): boolean;
declare function MMUtil(): Zvoog_MetreMathType;
declare function MZXBX_currentPlugins(): MZXBX_PluginRegistrationInformation[];
declare class MIDIIImportMusicPlugin {
    callbackID: string;
    parsedProject: Zvoog_Project | null;
    constructor();
    init(): void;
    sendImportedMIDIData(): void;
    loadMIDIfile(inputFile: any): void;
    receiveHostMessage(par: any): void;
}
declare type ImportMeasure = Zvoog_SongMeasure & {
    startMs: number;
    durationMs: number;
};
declare let drumNames: string[];
declare let insNames: string[];
declare type XYp = {
    x: number;
    y: number;
};
declare type PP = {
    p1: XYp;
    p2: XYp;
};
declare type TrackChord = {
    when: number;
    channel: number;
    notes: TrackNote[];
};
declare type TrackNote = {
    closed: boolean;
    bendPoints: NotePitch[];
    openEvent?: MIDIEvent;
    closeEvent?: MIDIEvent;
    volume?: number;
    basePitch: number;
    baseDuration: number;
};
declare type NotePitch = {
    pointDuration: number;
    basePitchDelta: number;
};
declare type MIDIEvent = {
    offset: number;
    delta: number;
    eventTypeByte: number;
    basetype?: number;
    subtype?: number;
    index?: string;
    length?: number;
    msb?: number;
    lsb?: number;
    prefix?: number;
    data?: number[];
    tempo?: number;
    tempoBPM?: number;
    hour?: number;
    minutes?: number;
    seconds?: number;
    frames?: number;
    subframes?: number;
    key?: number;
    param1?: number;
    param2?: number;
    param3?: number;
    param4?: number;
    scale?: number;
    badsubtype?: number;
    midiChannel?: number;
    playTimeMs: number;
    preTimeMs?: number;
    deltaTimeMs?: number;
    trackNum?: number;
    text?: string;
};
declare type MIDISongPoint = {
    pitch: number;
    durationms: number;
    midipoint?: TrackNote;
};
declare type MIDISongNote = {
    midiPitch: number;
    midiDuration: number;
    slidePoints: MIDISongPoint[];
};
declare type MIDISongChord = {
    when: number;
    channel: number;
    notes: MIDISongNote[];
};
declare type MIDISongTrack = {
    title: string;
    channelNum: number;
    program: number;
    trackVolumes: {
        ms: number;
        value: number;
        meausre?: number;
        skip384?: number;
    }[];
    songchords: MIDISongChord[];
    order: number;
};
declare type MIDISongData = {
    duration: number;
    parser: string;
    bpm: number;
    changes: {
        track: number;
        ms: number;
        resolution: number;
        bpm: number;
    }[];
    meters: {
        track: number;
        ms: number;
        count: number;
        division: number;
    }[];
    lyrics: {
        track: number;
        ms: number;
        txt: string;
    }[];
    key: number;
    mode: number;
    meter: {
        count: number;
        division: number;
    };
    signs: {
        track: number;
        ms: number;
        sign: string;
    }[];
    miditracks: MIDISongTrack[];
    speedMode: number;
    lineMode: number;
};
declare let instrumentNamesArray: string[];
declare let drumNamesArray: string[];
declare function findrumTitles(nn: number): string;
declare function drumTitles(): string[];
declare function instrumentTitles(): string[];
declare class DataViewStream {
    position: number;
    buffer: DataView;
    constructor(dv: DataView);
    readUint8(): number;
    readUint16(): number;
    readVarInt(): number;
    readBytes(length: number): number[];
    offset(): number;
    end(): boolean;
}
declare class MIDIFileHeader {
    datas: DataView;
    HEADER_LENGTH: number;
    format: number;
    trackCount: number;
    tempoBPM: number;
    changes: {
        track: number;
        ms: number;
        resolution: number;
        bpm: number;
    }[];
    meters: {
        track: number;
        ms: number;
        count: number;
        division: number;
    }[];
    lyrics: {
        track: number;
        ms: number;
        txt: string;
    }[];
    signs: {
        track: number;
        ms: number;
        sign: string;
    }[];
    meterCount: number;
    meterDivision: number;
    keyFlatSharp: number;
    keyMajMin: number;
    lastNonZeroQuarter: number;
    constructor(buffer: ArrayBuffer);
    getCalculatedTickResolution(tempo: number): number;
    get0TickResolution(): number;
    getTicksPerBeat(): number;
    getTicksPerFrame(): number;
    getSMPTEFrames(): number;
}
declare class LastKeyVal {
    data: {
        name: string;
        value: number;
    }[];
    take(keyName: string): {
        name: string;
        value: number;
    };
}
declare class MIDIFileTrack {
    datas: DataView;
    HDR_LENGTH: number;
    trackLength: number;
    trackContent: DataView;
    trackevents: MIDIEvent[];
    trackTitle: string;
    instrumentName: string;
    programChannel: {
        program: number;
        channel: number;
    }[];
    trackVolumePoints: {
        ms: number;
        value: number;
        channel: number;
    }[];
    chords: TrackChord[];
    constructor(buffer: ArrayBuffer, start: number);
}
declare function utf8ArrayToString(aBytes: any): string;
declare class MidiParser {
    header: MIDIFileHeader;
    parsedTracks: MIDIFileTrack[];
    instrumentNamesArray: string[];
    drumNamesArray: string[];
    EVENT_META: number;
    EVENT_SYSEX: number;
    EVENT_DIVSYSEX: number;
    EVENT_MIDI: number;
    EVENT_META_SEQUENCE_NUMBER: number;
    EVENT_META_TEXT: number;
    EVENT_META_COPYRIGHT_NOTICE: number;
    EVENT_META_TRACK_NAME: number;
    EVENT_META_INSTRUMENT_NAME: number;
    EVENT_META_LYRICS: number;
    EVENT_META_MARKER: number;
    EVENT_META_CUE_POINT: number;
    EVENT_META_MIDI_CHANNEL_PREFIX: number;
    EVENT_META_END_OF_TRACK: number;
    EVENT_META_SET_TEMPO: number;
    EVENT_META_SMTPE_OFFSET: number;
    EVENT_META_TIME_SIGNATURE: number;
    EVENT_META_KEY_SIGNATURE: number;
    EVENT_META_SEQUENCER_SPECIFIC: number;
    EVENT_MIDI_NOTE_OFF: number;
    EVENT_MIDI_NOTE_ON: number;
    EVENT_MIDI_NOTE_AFTERTOUCH: number;
    EVENT_MIDI_CONTROLLER: number;
    EVENT_MIDI_PROGRAM_CHANGE: number;
    EVENT_MIDI_CHANNEL_AFTERTOUCH: number;
    EVENT_MIDI_PITCH_BEND: number;
    midiEventType: number;
    midiEventChannel: number;
    midiEventParam1: number;
    controller_BankSelectMSB: number;
    controller_ModulationWheel: number;
    controller_coarseDataEntrySlider: number;
    controller_coarseVolume: number;
    controller_ballance: number;
    controller_pan: number;
    controller_expression: number;
    controller_BankSelectLSBGS: number;
    controller_fineDataEntrySlider: number;
    controller_ReverbLevel: number;
    controller_HoldPedal1: number;
    controller_TremoloDepth: number;
    controller_ChorusLevel: number;
    controller_NRPNParameterLSB: number;
    controller_NRPNParameterMSB: number;
    controller_fineRPN: number;
    controller_coarseRPN: number;
    controller_ResetAllControllers: number;
    constructor(arrayBuffer: ArrayBuffer);
    parseTracks(arrayBuffer: ArrayBuffer): void;
    toText(arr: number[]): string;
    findChordBefore(when: number, track: MIDIFileTrack, channel: number): TrackChord | null;
    findOpenedNoteBefore(firstPitch: number, when: number, track: MIDIFileTrack, channel: number): {
        chord: TrackChord;
        note: TrackNote;
    } | null;
    takeChord(when: number, track: MIDIFileTrack, channel: number): TrackChord;
    takeOpenedNote(first: number, when: number, track: MIDIFileTrack, channel: number): TrackNote;
    distanceToPoint(line: PP, point: XYp): number;
    douglasPeucker(points: XYp[], tolerance: number): XYp[];
    simplifySinglePath(points: XYp[], tolerance: number): XYp[];
    simplifyAllPaths(): void;
    dumpResolutionChanges(): void;
    lastResolution(ms: number): number;
    parseTicks2time(track: MIDIFileTrack): void;
    parseNotes(): void;
    nextEvent(stream: DataViewStream): MIDIEvent;
    parseTrackEvents(track: MIDIFileTrack): void;
    findOrCreateTrack(parsedtrack: MIDIFileTrack, trackNum: number, channelNum: number, trackChannel: {
        trackNum: number;
        channelNum: number;
        track: MIDISongTrack;
    }[]): {
        trackNum: number;
        channelNum: number;
        track: MIDISongTrack;
    };
    findLastMeter(midiSongData: MIDISongData, beforeMs: number, barIdx: number): Zvoog_Metre;
    findLastChange(midiSongData: MIDISongData, beforeMs: number): {
        track: number;
        ms: number;
        resolution: number;
        bpm: number;
    };
    findNextChange(midiSongData: MIDISongData, afterMs: number): {
        track: number;
        ms: number;
        resolution: number;
        bpm: number;
    };
    calcMeasureDuration(midiSongData: MIDISongData, meter: Zvoog_Metre, bpm: number, part: number, startMs: number): number;
    createMeasure(midiSongData: MIDISongData, fromMs: number, barIdx: number): ImportMeasure;
    createTimeLine(midiSongData: MIDISongData): Zvoog_SongMeasure[];
    convertProject(title: string, comment: string): Zvoog_Project;
    addLyricsPoints(commentPoint: Zvoog_CommentMeasure, skip: Zvoog_Metre, txt: string, tempo: number): void;
    collectDrums(midiTrack: MIDISongTrack): number[];
    numratio(nn: number): number;
    stripDuration(what: Zvoog_MetreMathType): Zvoog_MetreMathType;
    createProjectTrack(top: number, timeline: Zvoog_SongMeasure[], midiTrack: MIDISongTrack, outputId: string): Zvoog_MusicTrack;
    createProjectDrums(top: number, drum: number, timeline: Zvoog_SongMeasure[], midiTrack: MIDISongTrack, outputId: string): Zvoog_PercussionTrack;
}
declare function round1000(nn: number): number;
declare function findMeasureSkipByTime(time: number, measures: Zvoog_SongMeasure[]): null | {
    idx: number;
    skip: Zvoog_Metre;
};
declare function newMIDIparser2(arrayBuffer: ArrayBuffer): MidiParser;
