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
    floor(toPart: number): Zvoog_MetreMathType;
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
declare type MZXBX_CachedWave = {
    path: string;
    buffer: AudioBuffer | null;
    canceled?: boolean;
    line100?: number[];
};
declare type MZXBX_FilterHolder = {
    pluginAudioFilter: MZXBX_AudioFilterPlugin | null;
    filterId: string;
    kind: string;
    properties: string;
    description: string;
};
declare type MZXBX_PerformerSamplerHolder = {
    plugin: MZXBX_AudioPerformerPlugin | MZXBX_AudioSamplerPlugin | null;
    channelId: string;
    kind: string;
    properties: string;
    description: string;
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
    description: string;
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
    description: string;
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
declare type MZXBX_MessageToHost = {
    dialogID: string;
    pluginData: any;
    done: boolean;
    sceenWait: boolean;
};
declare function MZXBX_waitForCondition(sleepMs: number, isDone: () => boolean, onFinish: () => void): void;
declare function MZXBX_loadCachedBuffer(audioContext: AudioContext, path: string, onDone: (cachedWave: MZXBX_CachedWave) => void): void;
declare function MZXBX_appendScriptURL(url: string): boolean;
declare function MMUtil(): Zvoog_MetreMathType;
declare function MZXBX_currentPlugins(): MZXBX_PluginRegistrationInformation[];
declare function firstDrumKeysArrayPercussionPaths(midi: number): number;
declare function allPercussionDrumTitles(): string[];
declare let drumKeysArrayPercussionPaths: string[];
declare class ChordPitchPerformerUtil {
    checkParameters(parameters: string): {
        loudness: number;
        idx: number;
        mode: 0 | 1 | 2 | 3 | 4;
    };
    dumpParameters(loudness: number, idx: number, mode: number): string;
    tonechordinslist(): string[];
    tonechordinstrumentKeys(): string[];
}
declare type Dictionary = Record<string, number>;
declare type PendingDictionary = Record<string, true>;
declare type DictionaryCollection = Record<string, Dictionary>;
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
declare enum AlphaTabErrorType {
    General = 0,
    Format = 1,
    AlphaTex = 2
}
declare class AlphaTabError extends Error {
    type: AlphaTabErrorType;
    constructor(type: AlphaTabErrorType, message?: string | null, inner?: Error);
}
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
declare type XYp = {
    x: number;
    y: number;
};
declare type PP = {
    p1: XYp;
    p2: XYp;
};
declare let pluckDiff: number;
declare type TicksAverageTime = {
    avgstartms: number;
    items: number[];
};
declare class MidiParser {
    alignedMIDIevents: {
        startMs: number;
        avg: number;
        events: MIDIEvent[];
    }[];
    midiheader: MIDIFileHeader;
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
    programChannel: {
        midiProgram: number;
        midiChannel: number;
    }[];
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
    findOpenedNoteBefore(firstPitch: number, when: number, track: MIDIFileTrack, channel: number): TrackNote | null;
    findLastNoteBefore(when: number, track: MIDIFileTrack, channel: number): TrackNote | null;
    takeOpenedNote(first: number, when: number, trackIdx: number, track: MIDIFileTrack, channel: number): TrackNote;
    distanceToPoint(line: PP, point: XYp): number;
    douglasPeucker(points: XYp[], tolerance: number): XYp[];
    simplifyAllBendPaths(): void;
    nextByAllTracksEvent(): MIDIEvent | null;
    addResolutionPoint(trackIdx: number, playTimeTicks: number, tickResolution: number, tempo: number, vnt: MIDIEvent | null): void;
    fillEventsTimeMs(): void;
    alignEventsTime(): void;
    parseNotes(): void;
    nextEvent(stream: DataViewStream): MIDIEvent;
    parseTrackEvents(track: MIDIFileTrack): void;
}
declare type NotePitch = {
    pointDuration: number;
    basePitchDelta: number;
};
declare type TrackNote = {
    closed: boolean;
    bendPoints: NotePitch[];
    openEvent?: MIDIEvent;
    closeEvent?: MIDIEvent;
    volume?: number;
    basePitch: number;
    baseDuration: number;
    startMs: number;
    channelidx: number;
    trackidx: number;
    avgMs: number;
    count?: number;
};
declare type TrackChord = {
    startMs: number;
    baseDuration: number;
    tones: number[];
    basePitch: number;
};
declare class MIDIFileTrack {
    currentEventIdx: number;
    currentEvent: MIDIEvent | null;
    datas: DataView;
    HDR_LENGTH: number;
    trackLength: number;
    trackContent: DataView;
    trackevents: MIDIEvent[];
    trackTitle: string;
    instrumentName: string;
    trackVolumePoints: {
        ms: number;
        value: number;
        channel: number;
    }[];
    trackNotes: TrackNote[];
    constructor(buffer: ArrayBuffer, start: number);
    moveNextCuEvent(): void;
}
declare class MIDIFileHeader {
    datas: DataView;
    HEADER_LENGTH: number;
    format: number;
    trackCount: number;
    tempoBPM: number;
    changesResolutionTempo: {
        track: number;
        ms: number;
        newresolution: number;
        bpm: number;
        evnt: MIDIEvent | null;
    }[];
    metersList: {
        track: number;
        ms: number;
        count: number;
        division: number;
        evnt: MIDIEvent | null;
    }[];
    lyricsList: {
        track: number;
        ms: number;
        txt: string;
    }[];
    signsList: {
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
    pushLyrics(newPoint: {
        track: number;
        ms: number;
        txt: string;
    }): void;
    getCalculatedTickResolution(tempo: number): number;
    get0TickResolution(): number;
    getTicksPerBeat(): number;
    getTicksPerFrame(): number;
    getSMPTEFrames(): number;
    getFormat: () => number;
}
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
declare class MIDIReader {
    info: MIDIFileInfo;
    project: Zvoog_Project;
    parser: MidiParser;
    constructor(filename: string, filesize: number, arrayBuffer: ArrayBuffer);
}
declare type MIDITrackInfo = {
    midiTrack: number;
    midiProgram: number;
    trackVolumePoints: {
        ms: number;
        value: number;
        channel: number;
    }[];
    midiTitle: string;
};
declare type MIDIDrumInfo = {
    midiTrack: number;
    midiPitch: number;
    trackVolumePoints: {
        ms: number;
        value: number;
        channel: number;
    }[];
    title: string;
};
declare type MIDIFileTrackInfo = {
    program: number;
    singlCount: number;
    chordCount: number;
    singleDuration: number;
    chordDuration: number;
    title: string;
    tones: {
        pitches: {
            pitch: number;
            count: number;
        }[];
        tone: number;
        toneCount: number;
    }[];
    pitches: {
        pitch: number;
        count: number;
        ratio: number;
    }[];
    ratio: number;
};
declare type MIDIFileInfo = {
    fileName: string;
    fileSize: number;
    duration: number;
    durationCategory04: number;
    baseDrumCategory03: number;
    baseDrumPerBar: number;
    avgTempoCategory04: number;
    noteCount: number;
    drumCount: number;
    tracks: MIDIFileTrackInfo[];
    drums: {
        pitch: number;
        count: number;
        ratio: number;
        baravg: number;
        title: string;
    }[];
    bars: {
        idx: Number;
        meter: string;
        bpm: number;
        count: number;
    }[];
    barCount: number;
    bassTrackNum: number;
    bassLine: string;
    bassAvg: number;
    bassTone50: number;
    guitarChordDuration: number;
    guitarChordCategory03: number;
    overDriveRatio01: number;
    proCategories: {
        cat: number;
        ratio: number;
        title: string;
    }[];
    meters: {
        label: string;
        count: number;
    }[];
};
declare class EventsConverter {
    midiFileInfo: MIDIFileInfo;
    parser: MidiParser;
    constructor(parser: MidiParser);
    convertEvents(name: string, filesize: number): Zvoog_Project;
    findProgramForChannel(chanIdx: number): number;
    fillInfoMIDI(project: Zvoog_Project, allNotes: TrackNote[], allTracks: MIDITrackInfo[]): void;
    findMIDITempoBefore(ms: number): number;
    findMIDIMeterBefore(ms: number): Zvoog_Metre;
    findNearestPoint(ms: number): number;
    fillTimeline(project: Zvoog_Project, allNotes: TrackNote[]): void;
    addPercussionTrack(project: Zvoog_Project, allPercussions: MIDIDrumInfo[], compresID: string): void;
    hasVolumeAutomation(trackVolumePoints: {
        ms: number;
        value: number;
        channel: number;
    }[]): boolean;
    addInsTrack(project: Zvoog_Project, allTracks: MIDITrackInfo[], compresID: string): void;
    findModeInstrument(program: number): number;
    arrangeIcons(project: Zvoog_Project): void;
    collectNotes(allNotes: TrackNote[], allTracks: MIDITrackInfo[], allPercussions: MIDIDrumInfo[]): void;
    addMIDIComments(project: Zvoog_Project): void;
    addLyricsPoints(bar: Zvoog_CommentMeasure, skip: Zvoog_Metre, txt: string): void;
    findMeasureSkipByTime(timeFromStart: number, measures: Zvoog_SongMeasure[]): null | {
        idx: number;
        skip: Zvoog_Metre;
    };
    findVolumeDrum(midipitch: number): {
        idx: number;
        ratio: number;
    };
    findVolumeInstrument(program: number): {
        idx: number;
        ratio: number;
    };
    takeChord(bar: Zvoog_TrackMeasure, when: Zvoog_Metre): Zvoog_Chord;
    addTrackNote(tracks: Zvoog_MusicTrack[], timeline: Zvoog_SongMeasure[], allTracks: MIDITrackInfo[], note: TrackNote): void;
    addDrumkNote(percussions: Zvoog_PercussionTrack[], timeline: Zvoog_SongMeasure[], allPercussions: MIDIDrumInfo[], note: TrackNote): void;
    takeProTrackNo(allTracks: MIDITrackInfo[], midiTrack: number, midiChannel: number, trackVolumePoints: null | {
        ms: number;
        value: number;
        channel: number;
    }[]): number;
    takeProSamplerNo(allPercussions: MIDIDrumInfo[], midiTrack: number, midiPitch: number, trackVolumePoints: null | {
        ms: number;
        value: number;
        channel: number;
    }[]): number;
}
declare let params: URLSearchParams;
declare let fileurl: string | null;
declare let filetitle: string | null;
declare function startload(): void;
declare function loadFromArray(arrayBuffer: ArrayBuffer): void;
declare function saveProject(parsedProject: Zvoog_Project): void;
declare function readLzObjectFromlocalStorage(name: string): any;
declare function saveLzText2localStorage(name: string, text: string): void;
declare function saveRawText2localStorage(name: string, text: string): void;
declare function goedit(): void;
