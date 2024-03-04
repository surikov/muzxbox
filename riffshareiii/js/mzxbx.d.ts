declare class MZXBX_MetreMath implements MZXBX_MetreMathType {
    count: number;
    part: number;
    set(from: MZXBX_Metre): MZXBX_MetreMath;
    calculate(duration: number, tempo: number): MZXBX_MetreMath;
    metre(): MZXBX_Metre;
    simplyfy(): MZXBX_MetreMath;
    strip(toPart: number): MZXBX_MetreMath;
    equals(metre: MZXBX_Metre): boolean;
    less(metre: MZXBX_Metre): boolean;
    more(metre: MZXBX_Metre): boolean;
    plus(metre: MZXBX_Metre): MZXBX_MetreMath;
    minus(metre: MZXBX_Metre): MZXBX_MetreMath;
    duration(tempo: number): number;
    width(tempo: number, ratio: number): number;
}
declare function MZMM(): MZXBX_MetreMathType;
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
declare type MZXBX_CachedWave = {
    path: string;
    buffer: AudioBuffer | null;
    canceled?: boolean;
    line100?: number[];
};
declare type MZXBX_Metre = {
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
declare type MZXBX_HalfTone = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
declare type MZXBX_Octave = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
declare type MZXBX_Step = 1 | 2 | 3 | 4 | 5 | 6 | 7;
declare type MZXBX_StepShift = -2 | -1 | 0 | 1 | 2;
declare type MZXBX_StepSkip = 1 | 2;
declare type MZXBX_Scale = {
    basePitch: MZXBX_HalfTone;
    step2: MZXBX_StepSkip;
    step3: MZXBX_StepSkip;
    step4: MZXBX_StepSkip;
    step5: MZXBX_StepSkip;
    step6: MZXBX_StepSkip;
    step7: MZXBX_StepSkip;
};
declare type MZXBX_Slide = {
    duration: MZXBX_Metre;
    delta: number;
};
declare type MZXBX_Note = {
    step?: MZXBX_Step;
    shift?: MZXBX_StepShift;
    octave?: MZXBX_Octave;
    pitch: number;
    slides: MZXBX_Slide[];
};
declare type MZXBX_PluginBase = {
    setup: (audioContext: AudioContext) => boolean;
};
declare type MZXBX_PluginFilter = MZXBX_PluginBase | {
    input: string;
};
declare type MZXBX_PluginPerformer = MZXBX_PluginBase | {
    output: string;
    schedule: (chord: MZXBX_Chord, when: number) => boolean;
};
declare type MZXBX_PluginSampler = MZXBX_PluginBase | {
    output: string;
};
declare type MZXBX_AudioFilter = {
    id: string;
    data: string;
};
declare type MZXBX_AudioPerformer = {
    id: string;
    data: string;
};
declare type MZXBX_AudioSampler = {
    id: string;
    data: string;
};
declare type MZXBX_Chord = {
    skip: MZXBX_Metre;
    notes: MZXBX_Note[];
};
declare type MZXBX_TrackMeasure = {
    chords: MZXBX_Chord[];
};
declare type MZXBX_PercussionMeasure = {
    skips: MZXBX_Metre[];
};
declare type MZXBX_SongMeasure = {
    tempo: number;
    metre: MZXBX_Metre;
    scale?: MZXBX_Scale;
};
declare type MZXBX_PercussionTrack = {
    title: string;
    measures: MZXBX_PercussionMeasure[];
    filters: MZXBX_AudioFilter[];
    sampler: MZXBX_AudioSampler;
};
declare type MZXBX_MusicTrack = {
    title: string;
    measures: MZXBX_TrackMeasure[];
    filters: MZXBX_AudioFilter[];
    performer: MZXBX_AudioPerformer;
};
declare type MZXBX_CommentText = {
    skip: MZXBX_Metre;
    text: string;
};
declare type MZXBX_CommentMeasure = {
    texts: MZXBX_CommentText[];
};
declare type MZXBX_Project = {
    title: string;
    timeline: MZXBX_SongMeasure[];
    tracks: MZXBX_MusicTrack[];
    percussions: MZXBX_PercussionTrack[];
    comments: MZXBX_CommentMeasure[];
    filters: MZXBX_AudioFilter[];
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
declare type MZXBX_import = {
    import: () => MZXBX_Schedule | null;
};
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
declare let pluginListKindUrlName: {
    kind: string;
    url: string;
    functionName: string;
}[];
declare function MZXBX_loadCachedBuffer(audioContext: AudioContext, path: string, onDone: (cachedWave: MZXBX_CachedWave) => void): void;
declare function fillLinesOfBuffer(buffer: null | AudioBuffer): number[];
declare function MZXBX_waitForCondition(sleepMs: number, isDone: () => boolean, onFinish: () => void): void;
declare function MZXBX_appendScriptURL(url: string): boolean;
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
declare class PluginLoader {
    collectLoadPlugins(schedule: MZXBX_Schedule, filters: MZXBX_FilterHolder[], performers: MZXBX_PerformerHolder[], afterLoad: () => void): void;
    startLoadCollectedPlugins(filters: MZXBX_FilterHolder[], performers: MZXBX_PerformerHolder[], afterLoad: () => void): void;
    startLoadPluginStarter(kind: string, filters: MZXBX_FilterHolder[], performers: MZXBX_PerformerHolder[], onDone: (plugin: any) => void, afterLoad: () => void): void;
    сollectFilterPlugin(id: string, kind: string, properties: string, filters: MZXBX_FilterHolder[]): void;
    сollectPerformerPlugin(id: string, kind: string, properties: string, performers: MZXBX_PerformerHolder[]): void;
    findPluginInfo(kind: string): {
        kind: string;
        url: string;
        functionName: string;
    } | null;
}
declare type ImportMeasure = MZXBX_SongMeasure & {
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
    findLastMeter(midiSongData: MIDISongData, beforeMs: number, barIdx: number): MZXBX_Metre;
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
    calcMeasureDuration(midiSongData: MIDISongData, meter: MZXBX_Metre, bpm: number, part: number, startMs: number): number;
    createMeasure(midiSongData: MIDISongData, fromMs: number, barIdx: number): ImportMeasure;
    createTimeLine(midiSongData: MIDISongData): MZXBX_SongMeasure[];
    convertProject(title: string, comment: string): MZXBX_Project;
    addLyricsPoints(commentPoint: MZXBX_CommentMeasure, skip: MZXBX_Metre, txt: string): void;
    collectDrums(midiTrack: MIDISongTrack): number[];
    numratio(nn: number): number;
    stripDuration(what: MZXBX_MetreMath): MZXBX_MetreMath;
    createProjectTrack(timeline: MZXBX_SongMeasure[], midiTrack: MIDISongTrack): MZXBX_MusicTrack;
    createProjectDrums(drum: number, timeline: MZXBX_SongMeasure[], midiTrack: MIDISongTrack): MZXBX_PercussionTrack;
}
declare function findMeasureSkipByTime(time: number, measures: MZXBX_SongMeasure[]): null | {
    idx: number;
    skip: MZXBX_Metre;
};
declare function newMIDIparser(arrayBuffer: ArrayBuffer): MidiParser;
declare class GPImporter {
    score: Score;
    load(arrayBuffer: ArrayBuffer): void;
    convertProject(title: string, comment: string): MZXBX_Project;
}
declare function newGPparser(arrayBuffer: ArrayBuffer): GPImporter;
declare class ImporterSettings {
    encoding: string;
    mergePartGroupsInMusicXml: boolean;
    beatTextAsLyrics: boolean;
}
declare enum TextAlign {
    Left = 0,
    Center = 1,
    Right = 2
}
declare enum TextBaseline {
    Top = 0,
    Middle = 1,
    Bottom = 2
}
declare abstract class ScoreImporter {
    protected data: IReadable;
    protected settings: Settings;
    init(data: IReadable, settings: Settings): void;
    abstract get name(): string;
    abstract readScore(): Score;
}
declare enum MusicFontSymbol {
    None = -1,
    GClef = 57424,
    CClef = 57436,
    FClef = 57442,
    UnpitchedPercussionClef1 = 57449,
    SixStringTabClef = 57453,
    FourStringTabClef = 57454,
    TimeSig0 = 57472,
    TimeSig1 = 57473,
    TimeSig2 = 57474,
    TimeSig3 = 57475,
    TimeSig4 = 57476,
    TimeSig5 = 57477,
    TimeSig6 = 57478,
    TimeSig7 = 57479,
    TimeSig8 = 57480,
    TimeSig9 = 57481,
    TimeSigCommon = 57482,
    TimeSigCutCommon = 57483,
    NoteheadDoubleWholeSquare = 57505,
    NoteheadDoubleWhole = 57504,
    NoteheadWhole = 57506,
    NoteheadHalf = 57507,
    NoteheadBlack = 57508,
    NoteheadNull = 57509,
    NoteheadXOrnate = 57514,
    NoteheadTriangleUpWhole = 57531,
    NoteheadTriangleUpHalf = 57532,
    NoteheadTriangleUpBlack = 57534,
    NoteheadDiamondBlackWide = 57564,
    NoteheadDiamondWhite = 57565,
    NoteheadDiamondWhiteWide = 57566,
    NoteheadCircleX = 57523,
    NoteheadXWhole = 57511,
    NoteheadXHalf = 57512,
    NoteheadXBlack = 57513,
    NoteheadParenthesis = 57550,
    NoteheadSlashedBlack2 = 57552,
    NoteheadCircleSlash = 57591,
    NoteheadHeavyX = 57592,
    NoteheadHeavyXHat = 57593,
    NoteQuarterUp = 57813,
    NoteEighthUp = 57815,
    Tremolo3 = 57890,
    Tremolo2 = 57889,
    Tremolo1 = 57888,
    FlagEighthUp = 57920,
    FlagEighthDown = 57921,
    FlagSixteenthUp = 57922,
    FlagSixteenthDown = 57923,
    FlagThirtySecondUp = 57924,
    FlagThirtySecondDown = 57925,
    FlagSixtyFourthUp = 57926,
    FlagSixtyFourthDown = 57927,
    FlagOneHundredTwentyEighthUp = 57928,
    FlagOneHundredTwentyEighthDown = 57929,
    FlagTwoHundredFiftySixthUp = 57930,
    FlagTwoHundredFiftySixthDown = 57931,
    AccidentalFlat = 57952,
    AccidentalNatural = 57953,
    AccidentalSharp = 57954,
    AccidentalDoubleSharp = 57955,
    AccidentalDoubleFlat = 57956,
    AccidentalQuarterToneFlatArrowUp = 57968,
    AccidentalQuarterToneSharpArrowUp = 57972,
    AccidentalQuarterToneNaturalArrowUp = 57970,
    ArticAccentAbove = 58528,
    ArticStaccatoAbove = 58530,
    ArticMarcatoAbove = 58540,
    FermataAbove = 58560,
    FermataShortAbove = 58564,
    FermataLongAbove = 58566,
    RestLonga = 58593,
    RestDoubleWhole = 58594,
    RestWhole = 58595,
    RestHalf = 58596,
    RestQuarter = 58597,
    RestEighth = 58598,
    RestSixteenth = 58599,
    RestThirtySecond = 58600,
    RestSixtyFourth = 58601,
    RestOneHundredTwentyEighth = 58602,
    RestTwoHundredFiftySixth = 58603,
    Repeat1Bar = 58624,
    Repeat2Bars = 58625,
    Ottava = 58640,
    OttavaAlta = 58641,
    OttavaBassaVb = 58652,
    Quindicesima = 58644,
    QuindicesimaAlta = 58645,
    DynamicPPP = 58666,
    DynamicPP = 58667,
    DynamicPiano = 58656,
    DynamicMP = 58668,
    DynamicMF = 58669,
    DynamicForte = 58658,
    DynamicFF = 58671,
    DynamicFFF = 58672,
    OrnamentTrill = 58726,
    StringsDownBow = 58896,
    StringsUpBow = 58898,
    PictEdgeOfCymbal = 59177,
    GuitarString0 = 59443,
    GuitarString1 = 59444,
    GuitarString2 = 59445,
    GuitarString3 = 59446,
    GuitarString4 = 59447,
    GuitarString5 = 59448,
    GuitarString6 = 59449,
    GuitarString7 = 59450,
    GuitarString8 = 59451,
    GuitarString9 = 59452,
    GuitarGolpe = 59458,
    FretboardX = 59481,
    FretboardO = 59482,
    WiggleTrill = 60068,
    WiggleVibratoMediumFast = 60126,
    OctaveBaselineM = 60565,
    OctaveBaselineB = 60563
}
declare class Gp3To5Importer extends ScoreImporter {
    private static readonly VersionString;
    private _versionNumber;
    private _score;
    private _globalTripletFeel;
    private _lyricsTrack;
    private _lyrics;
    private _barCount;
    private _trackCount;
    private _playbackInfos;
    private _beatTextChunksByTrack;
    get name(): string;
    constructor();
    readScore(): Score;
    readVersion(): void;
    readScoreInformation(): void;
    readLyrics(): void;
    readPageSetup(): void;
    readPlaybackInfos(): void;
    readMasterBars(): void;
    readMasterBar(): void;
    readTracks(): void;
    readTrack(): void;
    readBars(): void;
    readBar(track: Track): void;
    readVoice(track: Track, bar: Bar): void;
    readBeat(track: Track, bar: Bar, voice: Voice): void;
    readChord(beat: Beat): void;
    readBeatEffects(beat: Beat): HarmonicType;
    readTremoloBarEffect(beat: Beat): void;
    private static toStrokeValue;
    readMixTableChange(beat: Beat): void;
    readNote(track: Track, bar: Bar, voice: Voice, beat: Beat, stringIndex: number): Note;
    toDynamicValue(value: number): DynamicValue;
    readNoteEffects(track: Track, voice: Voice, beat: Beat, note: Note): void;
    private static readonly BendStep;
    readBend(note: Note): void;
    readGrace(voice: Voice, note: Note): void;
    readTremoloPicking(beat: Beat): void;
    readSlide(note: Note): void;
    readArtificialHarmonic(note: Note): void;
    deltaFretToHarmonicValue(deltaFret: number): number;
    readTrill(note: Note): void;
}
declare class GpBinaryHelpers {
    static gpReadDouble(data: IReadable): number;
    static gpReadFloat(data: IReadable): number;
    static gpReadColor(data: IReadable, readAlpha?: boolean): Color;
    static gpReadBool(data: IReadable): boolean;
    static gpReadStringIntUnused(data: IReadable, encoding: string): string;
    static gpReadStringInt(data: IReadable, encoding: string): string;
    static gpReadStringIntByte(data: IReadable, encoding: string): string;
    static gpReadString(data: IReadable, length: number, encoding: string): string;
    static gpWriteString(data: IWriteable, s: string): void;
    static gpReadStringByteLength(data: IReadable, length: number, encoding: string): string;
}
declare class MixTableChange {
    volume: number;
    balance: number;
    instrument: number;
    tempoName: string;
    tempo: number;
    duration: number;
}
interface IReadable {
    position: number;
    readonly length: number;
    reset(): void;
    skip(offset: number): void;
    readByte(): number;
    read(buffer: Uint8Array, offset: number, count: number): number;
    readAll(): Uint8Array;
}
declare class Settings {
    readonly notation: NotationSettings;
    readonly importer: ImporterSettings;
}
declare class Score {
    private _currentRepeatGroup;
    private _openedRepeatGroups;
    private _properlyOpenedRepeatGroups;
    album: string;
    artist: string;
    copyright: string;
    instructions: string;
    music: string;
    notices: string;
    subTitle: string;
    title: string;
    words: string;
    tab: string;
    tempo: number;
    tempoLabel: string;
    masterBars: MasterBar[];
    tracks: Track[];
    defaultSystemsLayout: number;
    systemsLayout: number[];
    rebuildRepeatGroups(): void;
    addMasterBar(bar: MasterBar): void;
    private addMasterBarToRepeatGroups;
    addTrack(track: Track): void;
    finish(settings: Settings): void;
}
declare class RepeatGroup {
    masterBars: MasterBar[];
    opening: MasterBar | null;
    get openings(): MasterBar[];
    closings: MasterBar[];
    get isOpened(): boolean;
    isClosed: boolean;
    addMasterBar(masterBar: MasterBar): void;
}
declare enum AccentuationType {
    None = 0,
    Normal = 1,
    Heavy = 2
}
declare enum AccidentalType {
    None = 0,
    Natural = 1,
    Sharp = 2,
    Flat = 3,
    NaturalQuarterNoteUp = 4,
    SharpQuarterNoteUp = 5,
    FlatQuarterNoteUp = 6,
    DoubleSharp = 7,
    DoubleFlat = 8
}
declare enum AutomationType {
    Tempo = 0,
    Volume = 1,
    Instrument = 2,
    Balance = 3
}
declare class Automation {
    isLinear: boolean;
    type: AutomationType;
    value: number;
    ratioPosition: number;
    text: string;
    static buildTempoAutomation(isLinear: boolean, ratioPosition: number, value: number, reference: number): Automation;
    static buildInstrumentAutomation(isLinear: boolean, ratioPosition: number, value: number): Automation;
}
declare class Bar {
    private static _globalBarId;
    id: number;
    index: number;
    nextBar: Bar | null;
    previousBar: Bar | null;
    clef: Clef;
    clefOttava: Ottavia;
    staff: Staff;
    voices: Voice[];
    simileMark: SimileMark;
    isMultiVoice: boolean;
    displayScale: number;
    displayWidth: number;
    get masterBar(): MasterBar;
    get isEmpty(): boolean;
    addVoice(voice: Voice): void;
    finish(settings: Settings, sharedDataBag?: Map<string, unknown> | null): void;
    calculateDuration(): number;
}
declare enum BeatBeamingMode {
    Auto = 0,
    ForceSplitToNext = 1,
    ForceMergeWithNext = 2
}
declare class Beat {
    private static _globalBeatId;
    id: number;
    index: number;
    previousBeat: Beat | null;
    nextBeat: Beat | null;
    get isLastOfVoice(): boolean;
    voice: Voice;
    notes: Note[];
    readonly noteStringLookup: Map<number, Note>;
    readonly noteValueLookup: Map<number, Note>;
    isEmpty: boolean;
    whammyStyle: BendStyle;
    ottava: Ottavia;
    fermata: Fermata | null;
    isLegatoOrigin: boolean;
    get isLegatoDestination(): boolean;
    minNote: Note | null;
    maxNote: Note | null;
    maxStringNote: Note | null;
    minStringNote: Note | null;
    duration: Duration;
    get isRest(): boolean;
    get isFullBarRest(): boolean;
    isLetRing: boolean;
    isPalmMute: boolean;
    automations: Automation[];
    dots: number;
    fadeIn: boolean;
    lyrics: string[] | null;
    hasRasgueado: boolean;
    pop: boolean;
    slap: boolean;
    tap: boolean;
    text: string | null;
    brushType: BrushType;
    brushDuration: number;
    tupletDenominator: number;
    tupletNumerator: number;
    get hasTuplet(): boolean;
    tupletGroup: TupletGroup | null;
    isContinuedWhammy: boolean;
    whammyBarType: WhammyType;
    whammyBarPoints: BendPoint[] | null;
    maxWhammyPoint: BendPoint | null;
    minWhammyPoint: BendPoint | null;
    get hasWhammyBar(): boolean;
    vibrato: VibratoType;
    chordId: string | null;
    get hasChord(): boolean;
    get chord(): Chord | null;
    graceType: GraceType;
    graceGroup: GraceGroup | null;
    graceIndex: number;
    pickStroke: PickStroke;
    get isTremolo(): boolean;
    tremoloSpeed: Duration | null;
    crescendo: CrescendoType;
    displayStart: number;
    playbackStart: number;
    displayDuration: number;
    playbackDuration: number;
    get absoluteDisplayStart(): number;
    get absolutePlaybackStart(): number;
    dynamics: DynamicValue;
    invertBeamDirection: boolean;
    preferredBeamDirection: BeamDirection | null;
    isEffectSlurOrigin: boolean;
    get isEffectSlurDestination(): boolean;
    effectSlurOrigin: Beat | null;
    effectSlurDestination: Beat | null;
    beamingMode: BeatBeamingMode;
    addWhammyBarPoint(point: BendPoint): void;
    removeWhammyBarPoint(index: number): void;
    addNote(note: Note): void;
    removeNote(note: Note): void;
    getAutomation(type: AutomationType): Automation | null;
    getNoteOnString(noteString: number): Note | null;
    private calculateDuration;
    updateDurations(): void;
    finishTuplet(): void;
    finish(settings: Settings, sharedDataBag?: Map<string, unknown> | null): void;
    isBefore(beat: Beat): boolean;
    isAfter(beat: Beat): boolean;
    hasNoteOnString(noteString: number): boolean;
    getNoteWithRealValue(noteRealValue: number): Note | null;
    chain(sharedDataBag?: Map<string, unknown> | null): void;
}
declare class BendPoint {
    static readonly MaxPosition: number;
    static readonly MaxValue: number;
    offset: number;
    value: number;
    constructor(offset?: number, value?: number);
}
declare enum BendStyle {
    Default = 0,
    Gradual = 1,
    Fast = 2
}
declare enum BendType {
    None = 0,
    Custom = 1,
    Bend = 2,
    Release = 3,
    BendRelease = 4,
    Hold = 5,
    Prebend = 6,
    PrebendBend = 7,
    PrebendRelease = 8
}
declare enum BrushType {
    None = 0,
    BrushUp = 1,
    BrushDown = 2,
    ArpeggioUp = 3,
    ArpeggioDown = 4
}
declare class Chord {
    name: string;
    firstFret: number;
    strings: number[];
    barreFrets: number[];
    staff: Staff;
    showName: boolean;
    showDiagram: boolean;
    showFingering: boolean;
    get uniqueId(): string;
}
declare enum Clef {
    Neutral = 0,
    C3 = 1,
    C4 = 2,
    F4 = 3,
    G2 = 4
}
declare enum FermataType {
    Short = 0,
    Medium = 1,
    Long = 2
}
declare class Fermata {
    type: FermataType;
    length: number;
}
declare enum KeySignature {
    Cb = -7,
    Gb = -6,
    Db = -5,
    Ab = -4,
    Eb = -3,
    Bb = -2,
    F = -1,
    C = 0,
    G = 1,
    D = 2,
    A = 3,
    E = 4,
    B = 5,
    FSharp = 6,
    CSharp = 7
}
declare enum KeySignatureType {
    Major = 0,
    Minor = 1
}
declare class MasterBar {
    static readonly MaxAlternateEndings: number;
    alternateEndings: number;
    nextMasterBar: MasterBar | null;
    previousMasterBar: MasterBar | null;
    index: number;
    keySignature: KeySignature;
    keySignatureType: KeySignatureType;
    isDoubleBar: boolean;
    isRepeatStart: boolean;
    get isRepeatEnd(): boolean;
    repeatCount: number;
    repeatGroup: RepeatGroup;
    timeSignatureNumerator: number;
    timeSignatureDenominator: number;
    timeSignatureCommon: boolean;
    tripletFeel: TripletFeel;
    section: Section | null;
    get isSectionStart(): boolean;
    tempoAutomation: Automation | null;
    score: Score;
    fermata: Map<number, Fermata> | null;
    start: number;
    isAnacrusis: boolean;
    displayScale: number;
    displayWidth: number;
    calculateDuration(respectAnacrusis?: boolean): number;
    addFermata(offset: number, fermata: Fermata): void;
    getFermata(beat: Beat): Fermata | null;
}
declare class MidiUtils {
    static readonly QuarterTime: number;
    private static readonly MinVelocity;
    private static readonly VelocityIncrement;
    static ticksToMillis(ticks: number, tempo: number): number;
    static millisToTicks(millis: number, tempo: number): number;
    static toTicks(duration: Duration): number;
    static valueToTicks(duration: number): number;
    static applyDot(ticks: number, doubleDotted: boolean): number;
    static applyTuplet(ticks: number, numerator: number, denominator: number): number;
    static removeTuplet(ticks: number, numerator: number, denominator: number): number;
    static dynamicToVelocity(dynamicsSteps: number): number;
}
declare enum Duration {
    QuadrupleWhole = -4,
    DoubleWhole = -2,
    Whole = 1,
    Half = 2,
    Quarter = 4,
    Eighth = 8,
    Sixteenth = 16,
    ThirtySecond = 32,
    SixtyFourth = 64,
    OneHundredTwentyEighth = 128,
    TwoHundredFiftySixth = 256
}
declare enum Ottavia {
    _15ma = 0,
    _8va = 1,
    Regular = 2,
    _8vb = 3,
    _15mb = 4
}
declare class Staff {
    index: number;
    track: Track;
    bars: Bar[];
    chords: Map<string, Chord> | null;
    capo: number;
    transpositionPitch: number;
    displayTranspositionPitch: number;
    stringTuning: Tuning;
    get tuning(): number[];
    get tuningName(): string;
    get isStringed(): boolean;
    showTablature: boolean;
    showStandardNotation: boolean;
    isPercussion: boolean;
    standardNotationLineCount: number;
    finish(settings: Settings, sharedDataBag?: Map<string, unknown> | null): void;
    addChord(chordId: string, chord: Chord): void;
    hasChord(chordId: string): boolean;
    getChord(chordId: string): Chord | null;
    addBar(bar: Bar): void;
}
declare class Track {
    private static readonly ShortNameMaxLength;
    index: number;
    score: Score;
    staves: Staff[];
    playbackInfo: PlaybackInformation;
    color: Color;
    name: string;
    shortName: string;
    defaultSystemsLayout: number;
    systemsLayout: number[];
    percussionArticulations: InstrumentArticulation[];
    ensureStaveCount(staveCount: number): void;
    addStaff(staff: Staff): void;
    finish(settings: Settings, sharedDataBag?: Map<string, unknown> | null): void;
    applyLyrics(lyrics: Lyrics[]): void;
}
declare class Voice {
    private _beatLookup;
    private static _globalBarId;
    id: number;
    index: number;
    bar: Bar;
    beats: Beat[];
    isEmpty: boolean;
    insertBeat(after: Beat, newBeat: Beat): void;
    addBeat(beat: Beat): void;
    private chain;
    addGraceBeat(beat: Beat): void;
    getBeatAtPlaybackStart(playbackStart: number): Beat | null;
    finish(settings: Settings, sharedDataBag?: Map<string, unknown> | null): void;
    calculateDuration(): number;
}
declare enum SimileMark {
    None = 0,
    Simple = 1,
    FirstOfDouble = 2,
    SecondOfDouble = 3
}
declare class NoteIdBag {
    tieDestinationNoteId: number;
    tieOriginNoteId: number;
    slurDestinationNoteId: number;
    slurOriginNoteId: number;
    hammerPullDestinationNoteId: number;
    hammerPullOriginNoteId: number;
}
declare class Note {
    static GlobalNoteId: number;
    id: number;
    index: number;
    accentuated: AccentuationType;
    bendType: BendType;
    bendStyle: BendStyle;
    bendOrigin: Note | null;
    isContinuedBend: boolean;
    bendPoints: BendPoint[] | null;
    maxBendPoint: BendPoint | null;
    get hasBend(): boolean;
    get isStringed(): boolean;
    fret: number;
    string: number;
    get isPiano(): boolean;
    octave: number;
    tone: number;
    get isPercussion(): boolean;
    get element(): number;
    get variation(): number;
    percussionArticulation: number;
    isVisible: boolean;
    isLeftHandTapped: boolean;
    isHammerPullOrigin: boolean;
    get isHammerPullDestination(): boolean;
    hammerPullOrigin: Note | null;
    hammerPullDestination: Note | null;
    get isSlurOrigin(): boolean;
    isSlurDestination: boolean;
    slurOrigin: Note | null;
    slurDestination: Note | null;
    get isHarmonic(): boolean;
    harmonicType: HarmonicType;
    harmonicValue: number;
    isGhost: boolean;
    isLetRing: boolean;
    letRingDestination: Note | null;
    isPalmMute: boolean;
    palmMuteDestination: Note | null;
    isDead: boolean;
    isStaccato: boolean;
    slideInType: SlideInType;
    slideOutType: SlideOutType;
    slideTarget: Note | null;
    slideOrigin: Note | null;
    vibrato: VibratoType;
    tieOrigin: Note | null;
    tieDestination: Note | null;
    isTieDestination: boolean;
    get isTieOrigin(): boolean;
    leftHandFinger: Fingers;
    rightHandFinger: Fingers;
    isFingering: boolean;
    trillValue: number;
    get trillFret(): number;
    get isTrill(): boolean;
    trillSpeed: Duration;
    durationPercent: number;
    accidentalMode: NoteAccidentalMode;
    beat: Beat;
    dynamics: DynamicValue;
    isEffectSlurOrigin: boolean;
    hasEffectSlur: boolean;
    get isEffectSlurDestination(): boolean;
    effectSlurOrigin: Note | null;
    effectSlurDestination: Note | null;
    get stringTuning(): number;
    static getStringTuning(staff: Staff, noteString: number): number;
    get realValue(): number;
    get realValueWithoutHarmonic(): number;
    calculateRealValue(applyTranspositionPitch: boolean, applyHarmonic: boolean): number;
    get harmonicPitch(): number;
    get initialBendValue(): number;
    get displayValue(): number;
    get displayValueWithoutBend(): number;
    get hasQuarterToneOffset(): boolean;
    addBendPoint(point: BendPoint): void;
    finish(settings: Settings, sharedDataBag?: Map<string, unknown> | null): void;
    private static readonly MaxOffsetForSameLineSearch;
    static nextNoteOnSameLine(note: Note): Note | null;
    static findHammerPullDestination(note: Note): Note | null;
    static findTieOrigin(note: Note): Note | null;
    private static NoteIdLookupKey;
    private _noteIdBag;
    chain(sharedDataBag?: Map<string, unknown> | null): void;
    toJson(o: Map<string, unknown>): void;
    setProperty(property: string, v: unknown): boolean;
}
declare enum NoteAccidentalMode {
    Default = 0,
    ForceNone = 1,
    ForceNatural = 2,
    ForceSharp = 3,
    ForceDoubleSharp = 4,
    ForceFlat = 5,
    ForceDoubleFlat = 6
}
declare enum HarmonicType {
    None = 0,
    Natural = 1,
    Artificial = 2,
    Pinch = 3,
    Tap = 4,
    Semi = 5,
    Feedback = 6
}
declare enum WhammyType {
    None = 0,
    Custom = 1,
    Dive = 2,
    Dip = 3,
    Hold = 4,
    Predive = 5,
    PrediveDive = 6
}
declare enum TripletFeel {
    NoTripletFeel = 0,
    Triplet16th = 1,
    Triplet8th = 2,
    Dotted16th = 3,
    Dotted8th = 4,
    Scottish16th = 5,
    Scottish8th = 6
}
declare class Tuning {
    private static _sevenStrings;
    private static _sixStrings;
    private static _fiveStrings;
    private static _fourStrings;
    private static _defaultTunings;
    static readonly defaultAccidentals: string[];
    static readonly defaultSteps: string[];
    static getTextForTuning(tuning: number, includeOctave: boolean): string;
    static getTextPartsForTuning(tuning: number, octaveShift?: number): string[];
    static getDefaultTuningFor(stringCount: number): Tuning | null;
    static getPresetsFor(stringCount: number): Tuning[];
    static initialize(): void;
    static findTuning(strings: number[]): Tuning | null;
    isStandard: boolean;
    name: string;
    tunings: number[];
    constructor(name?: string, tuning?: number[] | null, isStandard?: boolean);
    finish(): void;
}
declare class TupletGroup {
    private static readonly HalfTicks;
    private static readonly QuarterTicks;
    private static readonly EighthTicks;
    private static readonly SixteenthTicks;
    private static readonly ThirtySecondTicks;
    private static readonly SixtyFourthTicks;
    private static readonly OneHundredTwentyEighthTicks;
    private static readonly TwoHundredFiftySixthTicks;
    private static AllTicks;
    private _isEqualLengthTuplet;
    totalDuration: number;
    beats: Beat[];
    voice: Voice;
    isFull: boolean;
    constructor(voice: Voice);
    check(beat: Beat): boolean;
}
declare enum VibratoType {
    None = 0,
    Slight = 1,
    Wide = 2
}
declare enum SlideOutType {
    None = 0,
    Shift = 1,
    Legato = 2,
    OutUp = 3,
    OutDown = 4,
    PickSlideDown = 5,
    PickSlideUp = 6
}
declare enum SlideInType {
    None = 0,
    IntoFromBelow = 1,
    IntoFromAbove = 2
}
declare enum PickStroke {
    None = 0,
    Up = 1,
    Down = 2
}
declare class GraceGroup {
    beats: Beat[];
    id: string;
    isComplete: boolean;
    addBeat(beat: Beat): void;
    finish(): void;
}
declare enum GraceType {
    None = 0,
    OnBeat = 1,
    BeforeBeat = 2,
    BendGrace = 3
}
declare enum Fingers {
    Unknown = -2,
    NoOrDead = -1,
    Thumb = 0,
    IndexFinger = 1,
    MiddleFinger = 2,
    AnnularFinger = 3,
    LittleFinger = 4
}
declare enum CrescendoType {
    None = 0,
    Crescendo = 1,
    Decrescendo = 2
}
declare enum DynamicValue {
    PPP = 0,
    PP = 1,
    P = 2,
    MP = 3,
    MF = 4,
    F = 5,
    FF = 6,
    FFF = 7
}
declare enum LyricsState {
    IgnoreSpaces = 0,
    Begin = 1,
    Text = 2,
    Comment = 3,
    Dash = 4
}
declare class Lyrics {
    private static readonly CharCodeLF;
    private static readonly CharCodeTab;
    private static readonly CharCodeCR;
    private static readonly CharCodeSpace;
    private static readonly CharCodeBrackedClose;
    private static readonly CharCodeBrackedOpen;
    private static readonly CharCodeDash;
    startBar: number;
    text: string;
    chunks: string[];
    finish(skipEmptyEntries?: boolean): void;
    private parse;
    private addChunk;
    private prepareChunk;
}
declare class PlaybackInformation {
    volume: number;
    balance: number;
    port: number;
    program: number;
    primaryChannel: number;
    secondaryChannel: number;
    isMute: boolean;
    isSolo: boolean;
}
declare class InstrumentArticulation {
    elementType: string;
    staffLine: number;
    noteHeadDefault: MusicFontSymbol;
    noteHeadHalf: MusicFontSymbol;
    noteHeadWhole: MusicFontSymbol;
    techniqueSymbol: MusicFontSymbol;
    techniqueSymbolPlacement: TextBaseline;
    outputMidiNumber: number;
    constructor(elementType?: string, staffLine?: number, outputMidiNumber?: number, noteHeadDefault?: MusicFontSymbol, noteHeadHalf?: MusicFontSymbol, noteHeadWhole?: MusicFontSymbol, techniqueSymbol?: MusicFontSymbol, techniqueSymbolPlacement?: TextBaseline);
    getSymbol(duration: Duration): MusicFontSymbol;
}
declare class PercussionMapper {
    private static gp6ElementAndVariationToArticulation;
    static articulationFromElementVariation(element: number, variation: number): number;
    static instrumentArticulations: Map<number, InstrumentArticulation>;
    static getArticulation(n: Note): InstrumentArticulation | null;
    static getElementAndVariation(n: Note): number[];
    static getArticulationByValue(midiNumber: number): InstrumentArticulation | null;
}
declare enum TabRhythmMode {
    Hidden = 0,
    ShowWithBeams = 1,
    ShowWithBars = 2
}
declare enum FingeringMode {
    ScoreDefault = 0,
    ScoreForcePiano = 1,
    SingleNoteEffectBand = 2,
    SingleNoteEffectBandForcePiano = 3
}
declare enum NotationMode {
    GuitarPro = 0,
    SongBook = 1
}
declare enum NotationElement {
    ScoreTitle = 0,
    ScoreSubTitle = 1,
    ScoreArtist = 2,
    ScoreAlbum = 3,
    ScoreWords = 4,
    ScoreMusic = 5,
    ScoreWordsAndMusic = 6,
    ScoreCopyright = 7,
    GuitarTuning = 8,
    TrackNames = 9,
    ChordDiagrams = 10,
    ParenthesisOnTiedBends = 11,
    TabNotesOnTiedBends = 12,
    ZerosOnDiveWhammys = 13,
    EffectAlternateEndings = 14,
    EffectCapo = 15,
    EffectChordNames = 16,
    EffectCrescendo = 17,
    EffectDynamics = 18,
    EffectFadeIn = 19,
    EffectFermata = 20,
    EffectFingering = 21,
    EffectHarmonics = 22,
    EffectLetRing = 23,
    EffectLyrics = 24,
    EffectMarker = 25,
    EffectOttavia = 26,
    EffectPalmMute = 27,
    EffectPickSlide = 28,
    EffectPickStroke = 29,
    EffectSlightBeatVibrato = 30,
    EffectSlightNoteVibrato = 31,
    EffectTap = 32,
    EffectTempo = 33,
    EffectText = 34,
    EffectTrill = 35,
    EffectTripletFeel = 36,
    EffectWhammyBar = 37,
    EffectWideBeatVibrato = 38,
    EffectWideNoteVibrato = 39,
    EffectLeftHandTap = 40
}
declare class NotationSettings {
    notationMode: NotationMode;
    fingeringMode: FingeringMode;
    elements: Map<NotationElement, boolean>;
    static defaultElements: Map<NotationElement, boolean>;
    rhythmMode: TabRhythmMode;
    rhythmHeight: number;
    transpositionPitches: number[];
    displayTranspositionPitches: number[];
    smallGraceTabNotes: boolean;
    extendBendArrowsOnTiedNotes: boolean;
    extendLineEffectsToBeatEnd: boolean;
    slurHeight: number;
    isNotationElementVisible(element: NotationElement): boolean;
}
declare class Lazy<T> {
    private _factory;
    private _value;
    constructor(factory: () => T);
    get value(): T;
}
declare class TuningParseResult {
    note: string | null;
    noteValue: number;
    octave: number;
    get realValue(): number;
}
declare class ModelUtils {
    static getIndex(duration: Duration): number;
    static keySignatureIsFlat(ks: number): boolean;
    static keySignatureIsNatural(ks: number): boolean;
    static keySignatureIsSharp(ks: number): boolean;
    static applyPitchOffsets(settings: Settings, score: Score): void;
    static fingerToString(settings: Settings, beat: Beat, finger: Fingers, leftHand: boolean): string | null;
    static isTuning(name: string): boolean;
    static parseTuning(name: string): TuningParseResult | null;
    static getTuningForText(str: string): number;
    static getToneForText(note: string): number;
    static newGuid(): string;
    static isAlmostEqualTo(a: number, b: number): boolean;
    static toHexString(n: number, digits?: number): string;
}
declare class Section {
    marker: string;
    text: string;
}
declare class IOHelper {
    static readInt32BE(input: IReadable): number;
    static readInt32LE(input: IReadable): number;
    static readUInt32LE(input: IReadable): number;
    static decodeUInt32LE(data: Uint8Array, index: number): number;
    static readUInt16LE(input: IReadable): number;
    static readInt16LE(input: IReadable): number;
    static readUInt32BE(input: IReadable): number;
    static readUInt16BE(input: IReadable): number;
    static readInt16BE(input: IReadable): number;
    static readByteArray(input: IReadable, length: number): Uint8Array;
    static read8BitChars(input: IReadable, length: number): string;
    static read8BitString(input: IReadable): string;
    static read8BitStringLength(input: IReadable, length: number): string;
    static readSInt8(input: IReadable): number;
    static readInt24(input: Uint8Array, index: number): number;
    static readInt16(input: Uint8Array, index: number): number;
    static toString(data: Uint8Array, encoding: string): string;
    private static detectEncoding;
    static stringToBytes(str: string): Uint8Array;
    static writeInt32BE(o: IWriteable, v: number): void;
    static writeInt32LE(o: IWriteable, v: number): void;
    static writeUInt16LE(o: IWriteable, v: number): void;
    static writeInt16LE(o: IWriteable, v: number): void;
    static writeInt16BE(o: IWriteable, v: number): void;
}
declare class ByteBuffer implements IWriteable, IReadable {
    private _buffer;
    length: number;
    position: number;
    get bytesWritten(): number;
    getBuffer(): Uint8Array;
    static empty(): ByteBuffer;
    static withCapacity(capacity: number): ByteBuffer;
    static fromBuffer(data: Uint8Array): ByteBuffer;
    static fromString(contents: string): ByteBuffer;
    reset(): void;
    skip(offset: number): void;
    readByte(): number;
    read(buffer: Uint8Array, offset: number, count: number): number;
    writeByte(value: number): void;
    write(buffer: Uint8Array, offset: number, count: number): void;
    private ensureCapacity;
    readAll(): Uint8Array;
    toArray(): Uint8Array;
    copyTo(destination: IWriteable): void;
}
interface IWriteable {
    readonly bytesWritten: number;
    writeByte(value: number): void;
    write(buffer: Uint8Array, offset: number, count: number): void;
}
declare class TypeConversions {
    private static _conversionBuffer;
    private static _conversionByteArray;
    private static _dataView;
    static float64ToBytes(v: number): Uint8Array;
    static bytesToFloat64(bytes: Uint8Array): number;
    static uint16ToInt16(v: number): number;
    static int16ToUint32(v: number): number;
    static int32ToUint16(v: number): number;
    static int32ToInt16(v: number): number;
    static int32ToUint32(v: number): number;
    static uint8ToInt8(v: number): number;
}
declare class BeatCloner {
    static clone(original: Beat): Beat;
}
declare class NoteCloner {
    static clone(original: Note): Note;
}
declare class BendPointCloner {
    static clone(original: BendPoint): BendPoint;
}
declare class Color {
    static readonly BlackRgb: string;
    constructor(r: number, g: number, b: number, a?: number);
    updateRgba(): void;
    raw: number;
    get a(): number;
    get r(): number;
    get g(): number;
    get b(): number;
    rgba: string;
    static random(opacity?: number): Color;
    static fromJson(v: unknown): Color | null;
    static toJson(obj: Color): number;
}
declare enum BeamDirection {
    Up = 0,
    Down = 1
}
declare class AutomationCloner {
    static clone(original: Automation): Automation;
}
declare class GeneralMidi {
    private static _values;
    static getValue(name: string): number;
    static isPiano(program: number): boolean;
    static isGuitar(program: number): boolean;
}
