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
    menuPerformers?: boolean;
    menuSamplers?: boolean;
    menuFilters?: boolean;
    menuActions?: boolean;
    menuPlugins?: boolean;
    menuClipboard?: boolean;
    menuSettings?: boolean;
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
declare enum AlphaTabErrorType {
    General = 0,
    Format = 1,
    AlphaTex = 2
}
declare class AlphaTabError extends Error {
    type: AlphaTabErrorType;
    constructor(type: AlphaTabErrorType, message?: string | null, inner?: Error);
}
declare enum FontFileFormat {
    EmbeddedOpenType = 0,
    Woff = 1,
    Woff2 = 2,
    OpenType = 3,
    TrueType = 4,
    Svg = 5
}
declare class CoreSettings {
    scriptFile: string | null;
    fontDirectory: string | null;
    smuflFontSources: Map<FontFileFormat, string> | null;
    static buildDefaultSmuflFontSources(fontDirectory: string | null): Map<FontFileFormat, string>;
    file: string | null;
    tex: boolean;
    tracks: number | number[] | 'all' | null;
    enableLazyLoading: boolean;
    engine: string;
    logLevel: LogLevel;
    useWorkers: boolean;
    includeNoteBounds: boolean;
    constructor();
}
declare enum LogLevel {
    None = 0,
    Debug = 1,
    Info = 2,
    Warning = 3,
    Error = 4
}
declare class ImporterSettings {
    encoding: string;
    mergePartGroupsInMusicXml: boolean;
    beatTextAsLyrics: boolean;
}
declare class Settings {
    readonly core: CoreSettings;
    readonly notation: NotationSettings;
    readonly importer: ImporterSettings;
    setSongBookModeSettings(): void;
    static get songBook(): Settings;
    handleBackwardsCompatibility(): void;
}
interface ILogger {
    debug(category: string, msg: string, ...details: unknown[]): void;
    warning(category: string, msg: string, ...details: unknown[]): void;
    info(category: string, msg: string, ...details: unknown[]): void;
    error(category: string, msg: string, ...details: unknown[]): void;
}
declare class ConsoleLogger implements ILogger {
    static logLevel: LogLevel;
    private static format;
    debug(category: string, msg: string, ...details: unknown[]): void;
    warning(category: string, msg: string, ...details: unknown[]): void;
    info(category: string, msg: string, ...details: unknown[]): void;
    error(category: string, msg: string, ...details: unknown[]): void;
}
declare class Logger {
    static logLevel: LogLevel;
    static log: ILogger;
    private static shouldLog;
    static debug(category: string, msg: string, ...details: unknown[]): void;
    static warning(category: string, msg: string, ...details: unknown[]): void;
    static info(category: string, msg: string, ...details: unknown[]): void;
    static error(category: string, msg: string, ...details: unknown[]): void;
}
declare enum TabRhythmMode {
    Hidden = 0,
    ShowWithBeams = 1,
    ShowWithBars = 2,
    Automatic = 3
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
    EffectLeftHandTap = 40,
    EffectFreeTime = 41,
    EffectSustainPedal = 42,
    EffectGolpe = 43,
    EffectWahPedal = 44,
    EffectBeatBarre = 45,
    EffectNoteOrnament = 46,
    EffectRasgueado = 47,
    EffectDirections = 48,
    EffectBeatTimer = 49
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
interface IReadable {
    position: number;
    readonly length: number;
    reset(): void;
    skip(offset: number): void;
    readByte(): number;
    read(buffer: Uint8Array, offset: number, count: number): number;
    readAll(): Uint8Array;
}
declare class EndOfReaderError extends AlphaTabError {
    constructor();
}
declare class IOHelper {
    static readInt32BE(input: IReadable): number;
    static readFloat32BE(readable: IReadable): number;
    static readFloat64BE(readable: IReadable): number;
    static readInt32LE(input: IReadable): number;
    static readInt64LE(input: IReadable): number;
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
    static writeFloat32BE(o: IWriteable, v: number): void;
    static iterateCodepoints(input: string): Generator<number, void, unknown>;
    static isLeadingSurrogate(charCode: number): boolean;
    static isTrailingSurrogate(charCode: number): boolean;
}
declare class TypeConversions {
    private static _conversionBuffer;
    private static _conversionByteArray;
    private static _dataView;
    static float64ToBytes(v: number): Uint8Array;
    static bytesToInt64LE(bytes: Uint8Array): number;
    static bytesToFloat64LE(bytes: Uint8Array): number;
    static bytesToFloat32LE(bytes: Uint8Array): number;
    static float32BEToBytes(v: number): Uint8Array;
    static uint16ToInt16(v: number): number;
    static int16ToUint32(v: number): number;
    static int32ToUint16(v: number): number;
    static int32ToInt16(v: number): number;
    static int32ToUint32(v: number): number;
    static uint8ToInt8(v: number): number;
}
interface IWriteable {
    readonly bytesWritten: number;
    writeByte(value: number): void;
    write(buffer: Uint8Array, offset: number, count: number): void;
}
declare class SynthConstants {
    static readonly DefaultChannelCount: number;
    static readonly MetronomeChannel: number;
    static readonly MetronomeKey: number;
    static readonly AudioChannels: number;
    static readonly MinVolume: number;
    static readonly MinProgram: number;
    static readonly MaxProgram: number;
    static readonly MinPlaybackSpeed: number;
    static readonly MaxPlaybackSpeed: number;
    static readonly PercussionChannel: number;
    static readonly PercussionBank: number;
    static readonly MaxPitchWheel: number;
    static readonly MaxPitchWheel20: number;
    static readonly DefaultPitchWheel: number;
    static readonly MicroBufferCount: number;
    static readonly MicroBufferSize: number;
}
declare enum ScoreSubElement {
    Title = 0,
    SubTitle = 1,
    Artist = 2,
    Album = 3,
    Words = 4,
    Music = 5,
    WordsAndMusic = 6,
    Transcriber = 7,
    Copyright = 8,
    CopyrightSecondLine = 9,
    ChordDiagramList = 10
}
declare class HeaderFooterStyle {
    template: string;
    isVisible?: boolean;
    constructor(template?: string, isVisible?: boolean | undefined);
    buildText(score: Score): string;
    private static readonly PlaceholderPattern;
}
declare class ScoreStyle {
    headerAndFooter: Map<ScoreSubElement, HeaderFooterStyle>;
}
declare class Score {
    private _currentRepeatGroup;
    private _openedRepeatGroups;
    private _properlyOpenedRepeatGroups;
    static resetIds(): void;
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
    style?: ScoreStyle;
    rebuildRepeatGroups(): void;
    addMasterBar(bar: MasterBar): void;
    private addMasterBarToRepeatGroups;
    addTrack(track: Track): void;
    finish(settings: Settings): void;
    applyFlatSyncPoints(syncPoints: FlatSyncPoint[]): void;
    exportFlatSyncPoints(): FlatSyncPoint[];
}
declare enum PickStroke {
    None = 0,
    Up = 1,
    Down = 2
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
declare class MasterBar {
    static readonly MaxAlternateEndings: number;
    alternateEndings: number;
    nextMasterBar: MasterBar | null;
    previousMasterBar: MasterBar | null;
    index: number;
    get hasChanges(): boolean;
    get keySignature(): KeySignature;
    set keySignature(value: KeySignature);
    get keySignatureType(): KeySignatureType;
    set keySignatureType(value: KeySignatureType);
    isDoubleBar: boolean;
    isRepeatStart: boolean;
    get isRepeatEnd(): boolean;
    repeatCount: number;
    repeatGroup: RepeatGroup;
    timeSignatureNumerator: number;
    timeSignatureDenominator: number;
    timeSignatureCommon: boolean;
    isFreeTime: boolean;
    tripletFeel: TripletFeel;
    section: Section | null;
    get isSectionStart(): boolean;
    get tempoAutomation(): Automation | null;
    tempoAutomations: Automation[];
    syncPoints: Automation[] | undefined;
    score: Score;
    fermata: Map<number, Fermata> | null;
    start: number;
    isAnacrusis: boolean;
    displayScale: number;
    displayWidth: number;
    directions: Set<Direction> | null;
    calculateDuration(respectAnacrusis?: boolean): number;
    addFermata(offset: number, fermata: Fermata): void;
    addDirection(direction: Direction): void;
    getFermata(beat: Beat): Fermata | null;
    addSyncPoint(syncPoint: Automation): void;
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
declare enum TripletFeel {
    NoTripletFeel = 0,
    Triplet16th = 1,
    Triplet8th = 2,
    Dotted16th = 3,
    Dotted8th = 4,
    Scottish16th = 5,
    Scottish8th = 6
}
declare class Section {
    marker: string;
    text: string;
}
declare enum AutomationType {
    Tempo = 0,
    Volume = 1,
    Instrument = 2,
    Balance = 3,
    SyncPoint = 4,
    Bank = 4
}
interface FlatSyncPoint {
    barIndex: number;
    barPosition: number;
    barOccurence: number;
    millisecondOffset: number;
}
declare class SyncPointData {
    barOccurence: number;
    millisecondOffset: number;
}
declare class Automation {
    isLinear: boolean;
    type: AutomationType;
    value: number;
    syncPointValue: SyncPointData | undefined;
    ratioPosition: number;
    text: string;
    static buildTempoAutomation(isLinear: boolean, ratioPosition: number, value: number, reference: number): Automation;
    static buildInstrumentAutomation(isLinear: boolean, ratioPosition: number, value: number): Automation;
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
declare enum Direction {
    TargetFine = 0,
    TargetSegno = 1,
    TargetSegnoSegno = 2,
    TargetCoda = 3,
    TargetDoubleCoda = 4,
    JumpDaCapo = 5,
    JumpDaCapoAlCoda = 6,
    JumpDaCapoAlDoubleCoda = 7,
    JumpDaCapoAlFine = 8,
    JumpDalSegno = 9,
    JumpDalSegnoAlCoda = 10,
    JumpDalSegnoAlDoubleCoda = 11,
    JumpDalSegnoAlFine = 12,
    JumpDalSegnoSegno = 13,
    JumpDalSegnoSegnoAlCoda = 14,
    JumpDalSegnoSegnoAlDoubleCoda = 15,
    JumpDalSegnoSegnoAlFine = 16,
    JumpDaCoda = 17,
    JumpDaDoubleCoda = 18
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
declare enum DynamicValue {
    PPP = 0,
    PP = 1,
    P = 2,
    MP = 3,
    MF = 4,
    F = 5,
    FF = 6,
    FFF = 7,
    PPPP = 8,
    PPPPP = 9,
    PPPPPP = 10,
    FFFF = 11,
    FFFFF = 12,
    FFFFFF = 13,
    SF = 14,
    SFP = 15,
    SFPP = 16,
    FP = 17,
    RF = 18,
    RFZ = 19,
    SFZ = 20,
    SFFZ = 21,
    FZ = 22,
    N = 23,
    PF = 24,
    SFZP = 25
}
declare enum BeatBeamingMode {
    Auto = 0,
    ForceSplitToNext = 1,
    ForceMergeWithNext = 2,
    ForceSplitOnSecondaryToNext = 3
}
declare enum BeatSubElement {
    Effects = 0,
    StandardNotationStem = 1,
    StandardNotationFlags = 2,
    StandardNotationBeams = 3,
    StandardNotationTuplet = 4,
    StandardNotationEffects = 5,
    StandardNotationRests = 6,
    GuitarTabStem = 7,
    GuitarTabFlags = 8,
    GuitarTabBeams = 9,
    GuitarTabTuplet = 10,
    GuitarTabEffects = 11,
    GuitarTabRests = 12,
    SlashStem = 13,
    SlashFlags = 14,
    SlashBeams = 15,
    SlashTuplet = 16,
    SlashRests = 17,
    SlashEffects = 18,
    NumberedDuration = 19,
    NumberedEffects = 20,
    NumberedRests = 21,
    NumberedTuplet = 22
}
declare class BeatStyle {
}
declare class Beat {
    private static _globalBeatId;
    static resetIds(): void;
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
    get fadeIn(): boolean;
    set fadeIn(value: boolean);
    fade: FadeType;
    lyrics: string[] | null;
    get hasRasgueado(): boolean;
    pop: boolean;
    slap: boolean;
    tap: boolean;
    text: string | null;
    slashed: boolean;
    deadSlapped: boolean;
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
    get displayEnd(): number;
    playbackStart: number;
    displayDuration: number;
    playbackDuration: number;
    overrideDisplayDuration?: number;
    golpe: GolpeType;
    get absoluteDisplayStart(): number;
    get absolutePlaybackStart(): number;
    dynamics: DynamicValue;
    invertBeamDirection: boolean;
    isEffectSlurOrigin: boolean;
    get isEffectSlurDestination(): boolean;
    effectSlurOrigin: Beat | null;
    effectSlurDestination: Beat | null;
    beamingMode: BeatBeamingMode;
    wahPedal: WahPedal;
    barreFret: number;
    barreShape: BarreShape;
    get isBarre(): boolean;
    rasgueado: Rasgueado;
    showTimer: boolean;
    timer: number | null;
    style?: BeatStyle;
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
declare enum VoiceSubElement {
    Glyphs = 0
}
declare class VoiceStyle {
}
declare class Voice {
    private _beatLookup;
    private _isEmpty;
    private _isRestOnly;
    private static _globalVoiceId;
    static resetIds(): void;
    id: number;
    index: number;
    bar: Bar;
    beats: Beat[];
    get isEmpty(): boolean;
    style?: VoiceStyle;
    forceNonEmpty(): void;
    get isRestOnly(): boolean;
    insertBeat(after: Beat, newBeat: Beat): void;
    addBeat(beat: Beat): void;
    private chain;
    addGraceBeat(beat: Beat): void;
    getBeatAtPlaybackStart(playbackStart: number): Beat | null;
    finish(settings: Settings, sharedDataBag?: Map<string, unknown> | null): void;
    calculateDuration(): number;
}
declare class NoteIdBag {
    tieDestinationNoteId: number;
    tieOriginNoteId: number;
    slurDestinationNoteId: number;
    slurOriginNoteId: number;
    hammerPullDestinationNoteId: number;
    hammerPullOriginNoteId: number;
    slideTargetNoteId: number;
    slideOriginNoteId: number;
}
declare enum NoteSubElement {
    Effects = 0,
    StandardNotationNoteHead = 1,
    StandardNotationAccidentals = 2,
    StandardNotationEffects = 3,
    GuitarTabFretNumber = 4,
    GuitarTabEffects = 5,
    SlashNoteHead = 6,
    SlashEffects = 7,
    NumberedNumber = 8,
    NumberedAccidentals = 9,
    NumberedEffects = 10
}
declare class NoteStyle {
}
declare class Note {
    static GlobalNoteId: number;
    static resetIds(): void;
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
    showStringNumber: boolean;
    get isPiano(): boolean;
    octave: number;
    tone: number;
    get isPercussion(): boolean;
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
    get isFingering(): boolean;
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
    ornament: NoteOrnament;
    style?: NoteStyle;
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
declare enum BendStyle {
    Default = 0,
    Gradual = 1,
    Fast = 2
}
declare enum AccentuationType {
    None = 0,
    Normal = 1,
    Heavy = 2,
    Tenuto = 3
}
declare enum Ottavia {
    _15ma = 0,
    _8va = 1,
    Regular = 2,
    _8vb = 3,
    _15mb = 4
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
declare class BendPoint {
    static readonly MaxPosition: number;
    static readonly MaxValue: number;
    offset: number;
    value: number;
    constructor(offset?: number, value?: number);
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
declare enum SlideInType {
    None = 0,
    IntoFromBelow = 1,
    IntoFromAbove = 2
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
declare enum VibratoType {
    None = 0,
    Slight = 1,
    Wide = 2
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
declare enum NoteAccidentalMode {
    Default = 0,
    ForceNone = 1,
    ForceNatural = 2,
    ForceSharp = 3,
    ForceDoubleSharp = 4,
    ForceFlat = 5,
    ForceDoubleFlat = 6
}
declare enum NoteOrnament {
    None = 0,
    InvertedTurn = 1,
    Turn = 2,
    UpperMordent = 3,
    LowerMordent = 4
}
declare class Staff {
    static readonly DefaultStandardNotationLineCount = 5;
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
    showSlash: boolean;
    showNumbered: boolean;
    showTablature: boolean;
    showStandardNotation: boolean;
    isPercussion: boolean;
    standardNotationLineCount: number;
    private _filledVoices;
    get filledVoices(): Set<number>;
    finish(settings: Settings, sharedDataBag?: Map<string, unknown> | null): void;
    addChord(chordId: string, chord: Chord): void;
    hasChord(chordId: string): boolean;
    getChord(chordId: string): Chord | null;
    addBar(bar: Bar): void;
}
declare enum TrackSubElement {
    TrackName = 0,
    BracesAndBrackets = 1,
    SystemSeparator = 2,
    StringTuning = 3
}
declare class Track {
    private static readonly ShortNameMaxLength;
    index: number;
    score: Score;
    staves: Staff[];
    playbackInfo: PlaybackInformation;
    name: string;
    isVisibleOnMultiTrack: boolean;
    shortName: string;
    defaultSystemsLayout: number;
    systemsLayout: number[];
    lineBreaks?: Set<number>;
    get isPercussion(): boolean;
    addLineBreaks(index: number): void;
    percussionArticulations: InstrumentArticulation[];
    ensureStaveCount(staveCount: number): void;
    addStaff(staff: Staff): void;
    finish(settings: Settings, sharedDataBag?: Map<string, unknown> | null): void;
    applyLyrics(lyrics: Lyrics[]): void;
}
declare enum SustainPedalMarkerType {
    Down = 0,
    Hold = 1,
    Up = 2
}
declare class SustainPedalMarker {
    ratioPosition: number;
    pedalType: SustainPedalMarkerType;
    bar: Bar;
    nextPedalMarker: SustainPedalMarker | null;
    previousPedalMarker: SustainPedalMarker | null;
}
declare enum BarSubElement {
    StandardNotationRepeats = 0,
    GuitarTabsRepeats = 1,
    SlashRepeats = 2,
    NumberedRepeats = 3,
    StandardNotationBarNumber = 4,
    GuitarTabsBarNumber = 5,
    SlashBarNumber = 6,
    NumberedBarNumber = 7,
    StandardNotationBarLines = 8,
    GuitarTabsBarLines = 9,
    SlashBarLines = 10,
    NumberedBarLines = 11,
    StandardNotationClef = 12,
    GuitarTabsClef = 13,
    StandardNotationKeySignature = 14,
    NumberedKeySignature = 15,
    StandardNotationTimeSignature = 16,
    GuitarTabsTimeSignature = 17,
    SlashTimeSignature = 18,
    NumberedTimeSignature = 19,
    StandardNotationStaffLine = 20,
    GuitarTabsStaffLine = 21,
    SlashStaffLine = 22,
    NumberedStaffLine = 23
}
declare enum BarLineStyle {
    Automatic = 0,
    Dashed = 1,
    Dotted = 2,
    Heavy = 3,
    HeavyHeavy = 4,
    HeavyLight = 5,
    LightHeavy = 6,
    LightLight = 7,
    None = 8,
    Regular = 9,
    Short = 10,
    Tick = 11
}
declare class Bar {
    private static _globalBarId;
    static resetIds(): void;
    id: number;
    index: number;
    nextBar: Bar | null;
    previousBar: Bar | null;
    clef: Clef;
    clefOttava: Ottavia;
    staff: Staff;
    voices: Voice[];
    simileMark: SimileMark;
    private _filledVoices;
    get isMultiVoice(): boolean;
    get filledVoices(): Set<number>;
    displayScale: number;
    displayWidth: number;
    sustainPedals: SustainPedalMarker[];
    get masterBar(): MasterBar;
    private _isEmpty;
    private _isRestOnly;
    get isEmpty(): boolean;
    get hasChanges(): boolean;
    get isRestOnly(): boolean;
    barLineLeft: BarLineStyle;
    barLineRight: BarLineStyle;
    keySignature: KeySignature;
    keySignatureType: KeySignatureType;
    getActualBarLineLeft(isFirstOfSystem: boolean): BarLineStyle;
    getActualBarLineRight(): BarLineStyle;
    private static automaticToActualType;
    private static actualBarLine;
    addVoice(voice: Voice): void;
    finish(settings: Settings, sharedDataBag?: Map<string, unknown> | null): void;
    calculateDuration(): number;
}
declare enum Clef {
    Neutral = 0,
    C3 = 1,
    C4 = 2,
    F4 = 3,
    G2 = 4
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
declare class Tuning {
    private static _sevenStrings;
    private static _sixStrings;
    private static _fiveStrings;
    private static _fourStrings;
    private static _defaultTunings;
    static readonly noteNames: string[];
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
declare class TuningParseResult {
    note: string | null;
    tone: TuningParseResultTone;
    octave: number;
    get realValue(): number;
}
declare class TuningParseResultTone {
    noteValue: number;
    accidentalMode: NoteAccidentalMode;
    constructor(noteValue?: number, accidentalMode?: NoteAccidentalMode);
}
declare class ModelUtils {
    static getIndex(duration: Duration): number;
    static keySignatureIsFlat(ks: number): boolean;
    static keySignatureIsNatural(ks: number): boolean;
    static keySignatureIsSharp(ks: number): boolean;
    static applyPitchOffsets(settings: Settings, score: Score): void;
    static isTuning(name: string): boolean;
    private static readonly TuningLetters;
    static parseTuning(name: string): TuningParseResult | null;
    static getTuningForText(str: string): number;
    static getToneForText(note: string): TuningParseResultTone;
    static readonly accidentalModeMapping: Map<string, NoteAccidentalMode>;
    static parseAccidentalMode(data: string): NoteAccidentalMode;
    static newGuid(): string;
    static isAlmostEqualTo(a: number, b: number): boolean;
    static toHexString(n: number, digits?: number): string;
    static getAlternateEndingsList(bitflag: number): number[];
    static deltaFretToHarmonicValue(deltaFret: number): number;
    static clamp(value: number, min: number, max: number): number;
    static buildMultiBarRestInfo(tracks: Track[] | null, startIndex: number, endIndexInclusive: number): Map<number, number[]> | null;
    static consolidate(score: Score): void;
    static trimEmptyBarsAtEnd(score: Score): void;
    static readonly displayTranspositionPitches: Map<number, number>;
    static flooredDivision(a: number, b: number): number;
    private static translateKeyTransposeTable;
    private static readonly keyTransposeTable;
    static transposeKey(keySignature: KeySignature, transpose: number): KeySignature;
    private static KeySignatureLookup;
    static AccidentalNotes: boolean[];
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
declare enum CrescendoType {
    None = 0,
    Crescendo = 1,
    Decrescendo = 2
}
declare enum FadeType {
    None = 0,
    FadeIn = 1,
    FadeOut = 2,
    VolumeSwell = 3
}
declare enum Rasgueado {
    None = 0,
    Ii = 1,
    Mi = 2,
    MiiTriplet = 3,
    MiiAnapaest = 4,
    PmpTriplet = 5,
    PmpAnapaest = 6,
    PeiTriplet = 7,
    PeiAnapaest = 8,
    PaiTriplet = 9,
    PaiAnapaest = 10,
    AmiTriplet = 11,
    AmiAnapaest = 12,
    Ppp = 13,
    Amii = 14,
    Amip = 15,
    Eami = 16,
    Eamii = 17,
    Peami = 18
}
declare enum BrushType {
    None = 0,
    BrushUp = 1,
    BrushDown = 2,
    ArpeggioUp = 3,
    ArpeggioDown = 4
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
declare enum WhammyType {
    None = 0,
    Custom = 1,
    Dive = 2,
    Dip = 3,
    Hold = 4,
    Predive = 5,
    PrediveDive = 6
}
declare enum GolpeType {
    None = 0,
    Thumb = 1,
    Finger = 2
}
declare enum WahPedal {
    None = 0,
    Open = 1,
    Closed = 2
}
declare enum BarreShape {
    None = 0,
    Full = 1,
    Half = 2
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
declare enum SimileMark {
    None = 0,
    Simple = 1,
    FirstOfDouble = 2,
    SecondOfDouble = 3
}
declare class PlaybackInformation {
    volume: number;
    balance: number;
    port: number;
    program: number;
    bank: number;
    primaryChannel: number;
    secondaryChannel: number;
    isMute: boolean;
    isSolo: boolean;
}
declare enum TechniqueSymbolPlacement {
    Above = 0,
    Inside = 1,
    Below = 2,
    Outside = 3
}
declare class InstrumentArticulation {
    elementType: string;
    staffLine: number;
    techniqueSymbolPlacement: TechniqueSymbolPlacement;
    outputMidiNumber: number;
}
declare class MidiUtils {
    static readonly QuarterTime: number;
    private static readonly MinVelocity;
    static readonly VelocityIncrement: number;
    static ticksToMillis(ticks: number, tempo: number): number;
    static millisToTicks(millis: number, tempo: number): number;
    static toTicks(duration: Duration): number;
    static valueToTicks(duration: number): number;
    static applyDot(ticks: number, doubleDotted: boolean): number;
    static applyTuplet(ticks: number, numerator: number, denominator: number): number;
    static removeTuplet(ticks: number, numerator: number, denominator: number): number;
    static dynamicToVelocity(dynamicValue: DynamicValue, adjustment?: number): number;
}
declare class GeneralMidi {
    private static _values;
    static getValue(name: string): number;
    static getName(input: number): string;
    static isPiano(program: number): boolean;
    static isGuitar(program: number): boolean;
    static isBass(program: number): boolean;
    static bankToLsbMsb(bank: number): [number, number];
}
declare abstract class ScoreImporter {
    protected data: IReadable;
    protected settings: Settings;
    init(data: IReadable, settings: Settings): void;
    abstract get name(): string;
    abstract readScore(): Score;
}
declare class UnsupportedFormatError extends AlphaTabError {
    constructor(message?: string | null, inner?: Error);
}
declare class Lazy<T> {
    private _factory;
    private _value;
    constructor(factory: () => T);
    get value(): T;
}
declare module "extensions/alphaTabImport/alphatab/importer/Gp3To5Importer" {
    export class GpBinaryHelpers {
        static gpReadBool(data: IReadable): boolean;
        static gpReadStringIntUnused(data: IReadable, encoding: string): string;
        static gpReadStringInt(data: IReadable, encoding: string): string;
        static gpReadStringIntByte(data: IReadable, encoding: string): string;
        static gpReadString(data: IReadable, length: number, encoding: string): string;
        static gpWriteString(data: IWriteable, s: string): void;
        static gpReadStringByteLength(data: IReadable, length: number, encoding: string): string;
    }
}
declare class AlphaTabImportMusicPlugin {
    callbackID: string;
    parsedProject: Zvoog_Project | null;
    constructor();
    init(): void;
    sendImportedMusicData(): void;
    receiveHostMessage(par: any): void;
    loadMusicfile(inputFile: any): void;
}
declare class FileLoaderAlpha {
    constructor(inputFile: any);
}
