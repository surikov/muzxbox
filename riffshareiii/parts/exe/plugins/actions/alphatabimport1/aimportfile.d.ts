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
declare class FormatError extends AlphaTabError {
    constructor(message: string);
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
declare class BitReader {
    private static readonly ByteSize;
    private _currentByte;
    private _position;
    private _source;
    constructor(source: IReadable);
    readByte(): number;
    readBytes(count: number): Uint8Array;
    readBits(count: number): number;
    readBitsReversed(count: number): number;
    readBit(): number;
    readAll(): Uint8Array;
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
    backingTrack: BackingTrack | undefined;
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
    color: Color;
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
type ColorJson = Color | string | number;
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
    static toJson(obj: Color | null): number | null;
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
    constructor(elementType?: string, staffLine?: number, outputMidiNumber?: number);
}
declare class BackingTrack {
    rawAudioFile: Uint8Array | undefined;
}
declare class PercussionMapper {
    private static gp6ElementAndVariationToArticulation;
    static articulationFromElementVariation(element: number, variation: number): number;
    static instrumentArticulations: Map<number, InstrumentArticulation>;
    static instrumentArticulationNames: Map<string, number>;
    static getArticulationName(n: Note): string;
    static getArticulation(n: Note): InstrumentArticulation | null;
    static getElementAndVariation(n: Note): number[];
    static getArticulationByInputMidiNumber(inputMidiNumber: number): InstrumentArticulation | null;
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
declare class GpxFile {
    fileName: string;
    fileSize: number;
    data: Uint8Array | null;
}
declare class GpxFileSystem {
    static readonly HeaderBcFs: string;
    static readonly HeaderBcFz: string;
    fileFilter: (fileName: string) => boolean;
    files: GpxFile[];
    constructor();
    load(s: IReadable): void;
    readHeader(src: BitReader): string;
    decompress(src: BitReader, skipHeader?: boolean): Uint8Array;
    private readBlock;
    private readUncompressedBlock;
    private getString;
    private getInteger;
}
declare class GpifRhythm {
    id: string;
    dots: number;
    tupletDenominator: number;
    tupletNumerator: number;
    value: Duration;
}
declare class GpifSound {
    name: string;
    path: string;
    role: string;
    get uniqueId(): string;
    program: number;
    bank: number;
}
declare class GpifParser {
    private static readonly InvalidId;
    private static readonly BendPointPositionFactor;
    private static readonly BendPointValueFactor;
    private static readonly SampleRate;
    score: Score;
    private _backingTrackAssetId;
    private _masterTrackAutomations;
    private _automationsPerTrackIdAndBarIndex;
    private _sustainPedalsPerTrackIdAndBarIndex;
    private _tracksMapping;
    private _tracksById;
    private _masterBars;
    private _barsOfMasterBar;
    private _barsById;
    private _voicesOfBar;
    private _voiceById;
    private _beatsOfVoice;
    private _rhythmOfBeat;
    private _beatById;
    private _rhythmById;
    private _noteById;
    private _notesOfBeat;
    private _tappedNotes;
    private _lyricsByTrack;
    private _soundsByTrack;
    private _hasAnacrusis;
    private _articulationByName;
    private _skipApplyLyrics;
    private _backingTrackPadding;
    private _doubleBars;
    private _keySignatures;
    loadAsset?: (fileName: string) => Uint8Array | undefined;
    parseXml(xml: string, settings: Settings): void;
    private parseDom;
    private parseAssets;
    private parseBackingTrackAsset;
    private parseScoreNode;
    private static parseIntSafe;
    private static parseFloatSafe;
    private static splitSafe;
    private parseBackingTrackNode;
    private parseMasterTrackNode;
    private parseAutomations;
    private parseAutomation;
    private parseTracksNode;
    private parseTrack;
    private parseTrackAutomations;
    private parseNotationPatch;
    private parseInstrumentSet;
    private parseElements;
    private parseElement;
    private parseArticulations;
    private parseArticulation;
    private parseTechniqueSymbol;
    private parseNoteHead;
    private parseStaves;
    private parseStaff;
    private parseStaffProperties;
    private parseStaffProperty;
    private parseLyrics;
    private parseLyricsLine;
    private parseDiagramCollectionForTrack;
    private parseDiagramCollectionForStaff;
    private parseDiagramItemForTrack;
    private parseDiagramItemForStaff;
    private parseDiagramItemForChord;
    private parseTrackProperties;
    private parseTrackProperty;
    private parseGeneralMidi;
    private parseSounds;
    private parseSound;
    private parseSoundMidi;
    private parsePartSounding;
    private _transposeKeySignaturePerTrack;
    private parseTranspose;
    private parseRSE;
    private parseChannelStrip;
    private parseChannelStripParameters;
    private parseMasterBarsNode;
    private parseMasterBar;
    private parseDirections;
    private parseFermatas;
    private parseFermata;
    private parseBars;
    private parseBar;
    private parseVoices;
    private parseVoice;
    private parseBeats;
    private parseBeat;
    private parseBeatLyrics;
    private parseBeatXProperties;
    private parseBarXProperties;
    private parseMasterBarXProperties;
    private parseBeatProperties;
    private parseNotes;
    private parseNote;
    private parseNoteProperties;
    private parseConcertPitch;
    private toBendValue;
    private toBendOffset;
    private parseRhythms;
    private parseRhythm;
    private buildModel;
}
declare enum DataType {
    Boolean = 0,
    Integer = 1,
    Float = 2,
    String = 3,
    Point = 4,
    Size = 5,
    Rectangle = 6,
    Color = 7
}
declare class BinaryStylesheet {
    readonly _types: Map<string, DataType>;
    readonly raw: Map<string, unknown>;
    constructor(data?: Uint8Array);
    private read;
    apply(score: Score): void;
    addValue(key: string, value: unknown, type?: DataType): void;
    writeTo(writer: IWriteable): void;
    private getDataType;
    private static addHeaderAndFooter;
}
declare class Lazy<T> {
    private _factory;
    private _value;
    constructor(factory: () => T);
    get value(): T;
}
declare enum XmlNodeType {
    None = 0,
    Element = 1,
    Text = 2,
    CDATA = 3,
    Document = 4,
    DocumentType = 5,
    Comment = 6
}
declare class XmlNode {
    nodeType: XmlNodeType;
    localName: string | null;
    value: string | null;
    childNodes: XmlNode[];
    attributes: Map<string, string>;
    firstChild: XmlNode | null;
    firstElement: XmlNode | null;
    childElements(): Generator<XmlNode, void, unknown>;
    addChild(node: XmlNode): void;
    getAttribute(name: string, defaultValue?: string): string;
    getElementsByTagName(name: string, recursive?: boolean): XmlNode[];
    private searchElementsByTagName;
    findChildElement(name: string): XmlNode | null;
    addElement(name: string): XmlNode;
    get innerText(): string;
    set innerText(value: string);
    setCData(s: string): void;
}
declare class XmlDocument extends XmlNode {
    constructor();
    parse(xml: string): void;
    toString(): string;
    toFormattedString(indention?: string, xmlHeader?: boolean): string;
}
declare class XmlError extends AlphaTabError {
    xml: string;
    pos: number;
    constructor(message: string, xml: string, pos: number);
}
declare enum XmlState {
    IgnoreSpaces = 0,
    Begin = 1,
    BeginNode = 2,
    TagName = 3,
    Body = 4,
    AttribName = 5,
    Equals = 6,
    AttvalBegin = 7,
    AttribVal = 8,
    Childs = 9,
    Close = 10,
    WaitEnd = 11,
    WaitEndRet = 12,
    Pcdata = 13,
    Header = 14,
    Comment = 15,
    Doctype = 16,
    Cdata = 17,
    Escape = 18
}
declare class XmlParser {
    static readonly CharCodeLF: number;
    static readonly CharCodeTab: number;
    static readonly CharCodeCR: number;
    static readonly CharCodeSpace: number;
    static readonly CharCodeLowerThan: number;
    static readonly CharCodeAmp: number;
    static readonly CharCodeBrackedClose: number;
    static readonly CharCodeBrackedOpen: number;
    static readonly CharCodeGreaterThan: number;
    static readonly CharCodeExclamation: number;
    static readonly CharCodeUpperD: number;
    static readonly CharCodeLowerD: number;
    static readonly CharCodeMinus: number;
    static readonly CharCodeQuestion: number;
    static readonly CharCodeSlash: number;
    static readonly CharCodeEquals: number;
    static readonly CharCodeDoubleQuote: number;
    static readonly CharCodeSingleQuote: number;
    static readonly CharCodeSharp: number;
    static readonly CharCodeLowerX: number;
    static readonly CharCodeLowerA: number;
    static readonly CharCodeLowerZ: number;
    static readonly CharCodeUpperA: number;
    static readonly CharCodeUpperZ: number;
    static readonly CharCode0: number;
    static readonly CharCode9: number;
    static readonly CharCodeColon: number;
    static readonly CharCodeDot: number;
    static readonly CharCodeUnderscore: number;
    static readonly CharCodeSemi: number;
    private static Escapes;
    static parse(str: string, p: number, parent: XmlNode): number;
    private static isValidChar;
}
declare class XmlWriter {
    private _result;
    private _indention;
    private _xmlHeader;
    private _isStartOfLine;
    private _currentIndention;
    constructor(indention: string, xmlHeader: boolean);
    writeNode(xml: XmlNode): void;
    private unindend;
    private indent;
    private writeAttributeValue;
    static write(xml: XmlNode, indention: string, xmlHeader: boolean): string;
    private write;
    private writeLine;
    toString(): string;
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
declare class AutomationCloner {
    static clone(original: Automation): Automation;
}
declare class SyncPointDataCloner {
    static clone(original: SyncPointData): SyncPointData;
}
declare class Adler32 {
    private static readonly Base;
    value: number;
    constructor();
    reset(): void;
    update(data: Uint8Array, offset: number, count: number): void;
}
declare class Crc32 {
    private static readonly Crc32Lookup;
    private static buildCrc32Lookup;
    private static readonly CrcInit;
    private _checkValue;
    get value(): number;
    constructor();
    update(data: Uint8Array, offset: number, count: number): void;
    reset(): void;
}
declare class Deflater {
    private static readonly IsFlushing;
    private static readonly IsFinishing;
    private static readonly BusyState;
    private static readonly FlushingState;
    private static readonly FinishingState;
    private static readonly FinishedState;
    private _state;
    private _pending;
    private _engine;
    get inputCrc(): number;
    constructor();
    get isNeedingInput(): boolean;
    get isFinished(): boolean;
    reset(): void;
    setInput(input: Uint8Array, offset: number, count: number): void;
    deflate(output: Uint8Array, offset: number, length: number): number;
    finish(): void;
}
declare class DeflaterConstants {
    static readonly MAX_WBITS: number;
    static readonly WSIZE: number;
    static readonly WMASK: number;
    static readonly MIN_MATCH: number;
    static readonly MAX_MATCH: number;
    static readonly DEFAULT_MEM_LEVEL: number;
    static readonly PENDING_BUF_SIZE: number;
    static readonly HASH_BITS: number;
    static readonly HASH_SIZE: number;
    static readonly HASH_SHIFT: number;
    static readonly HASH_MASK: number;
    static readonly MIN_LOOKAHEAD: number;
    static readonly MAX_DIST: number;
}
declare class DeflaterEngine {
    private static readonly TooFar;
    private blockStart;
    private maxChain;
    private niceLength;
    private goodLength;
    private insertHashIndex;
    private strstart;
    private window;
    private head;
    private prev;
    private lookahead;
    private inputBuf;
    private inputOff;
    private inputEnd;
    private prevAvailable;
    private matchStart;
    private matchLen;
    private pending;
    private huffman;
    inputCrc: Crc32;
    constructor(pending: PendingBuffer);
    reset(): void;
    private updateHash;
    needsInput(): boolean;
    setInput(buffer: Uint8Array, offset: number, count: number): void;
    deflate(flush: boolean, finish: boolean): boolean;
    private deflateSlow;
    private findLongestMatch;
    private insertString;
    fillWindow(): void;
    private slideWindow;
}
declare class Tree {
    private static readonly Repeat3To6;
    private static readonly Repeat3To10;
    private static readonly Repeat11To138;
    freqs: Int16Array;
    length: Uint8Array | null;
    minNumCodes: number;
    numCodes: number;
    private codes;
    private readonly bitLengthCounts;
    private readonly maxLength;
    private huffman;
    constructor(dh: DeflaterHuffman, elems: number, minCodes: number, maxLength: number);
    reset(): void;
    buildTree(): void;
    private buildLength;
    getEncodedLength(): number;
    calcBLFreq(blTree: Tree): void;
    setStaticCodes(staticCodes: Int16Array, staticLengths: Uint8Array): void;
    buildCodes(): void;
    writeTree(blTree: Tree): void;
    writeSymbol(code: number): void;
}
declare class DeflaterHuffman {
    private static readonly BUFSIZE;
    private static readonly LITERAL_NUM;
    static readonly STORED_BLOCK = 0;
    static readonly STATIC_TREES = 1;
    static readonly DYN_TREES = 2;
    private static readonly DIST_NUM;
    private static staticLCodes;
    private static staticLLength;
    private static staticDCodes;
    private static staticDLength;
    static staticInit(): void;
    private static readonly BL_ORDER;
    private static readonly bit4Reverse;
    static bitReverse(toReverse: number): number;
    private static readonly BITLEN_NUM;
    private static readonly EOF_SYMBOL;
    pending: PendingBuffer;
    private literalTree;
    private distTree;
    private blTree;
    private d_buf;
    private l_buf;
    private last_lit;
    private extra_bits;
    constructor(pending: PendingBuffer);
    isFull(): boolean;
    reset(): void;
    flushStoredBlock(stored: Uint8Array, storedOffset: number, storedLength: number, lastBlock: boolean): void;
    flushBlock(stored: Uint8Array, storedOffset: number, storedLength: number, lastBlock: boolean): void;
    sendAllTrees(blTreeCodes: number): void;
    compressBlock(): void;
    tallyDist(distance: number, length: number): boolean;
    tallyLit(literal: number): boolean;
    private static Lcode;
    private static Dcode;
}
declare class Huffman {
}
declare class Found extends Huffman {
    readonly n: number;
    constructor(n: number);
}
declare class NeedBit extends Huffman {
    readonly left: Huffman;
    readonly right: Huffman;
    constructor(left: Huffman, right: Huffman);
}
declare class NeedBits extends Huffman {
    readonly n: number;
    readonly table: Huffman[];
    constructor(n: number, table: Huffman[]);
}
declare class HuffTools {
    static make(lengths: number[], pos: number, nlengths: number, maxbits: number): Huffman;
    private static treeMake;
    private static treeCompress;
    private static treeWalk;
    private static treeDepth;
}
declare enum InflateState {
    Head = 0,
    Block = 1,
    CData = 2,
    Flat = 3,
    Crc = 4,
    Dist = 5,
    DistOne = 6,
    Done = 7
}
declare class InflateWindow {
    private static readonly Size;
    private static readonly BufferSize;
    buffer: Uint8Array;
    pos: number;
    slide(): void;
    addBytes(b: Uint8Array, p: number, len: number): void;
    addByte(c: number): void;
    getLastChar(): number;
    available(): number;
}
declare class Inflate {
    private static LenExtraBitsTbl;
    private static LenBaseValTbl;
    private static DistExtraBitsTbl;
    private static DistBaseValTbl;
    private static CodeLengthsPos;
    private static _fixedHuffman;
    private static buildFixedHuffman;
    private _nbits;
    private _bits;
    private _state;
    private _isFinal;
    private _huffman;
    private _huffdist;
    private _len;
    private _dist;
    private _needed;
    private _output;
    private _outpos;
    private _input;
    private _lengths;
    private _window;
    constructor(readable: IReadable);
    readBytes(b: Uint8Array, pos: number, len: number): number;
    private inflateLoop;
    private addDistOne;
    private addByte;
    private addDist;
    private getBit;
    private getBits;
    private getRevBits;
    private resetBits;
    private addBytes;
    private inflateLengths;
    private applyHuffman;
}
declare class PendingBuffer {
    private _buffer;
    private _start;
    private _end;
    private _bits;
    bitCount: number;
    get isFlushed(): boolean;
    constructor(bufferSize: number);
    reset(): void;
    writeShortMSB(s: number): void;
    writeShort(value: number): void;
    writeBlock(block: Uint8Array, offset: number, length: number): void;
    flush(output: Uint8Array, offset: number, length: number): number;
    writeBits(b: number, count: number): void;
    alignToByte(): void;
}
declare class ZipEntry {
    static readonly OptionalDataDescriptorSignature: number;
    static readonly CompressionMethodDeflate: number;
    static readonly LocalFileHeaderSignature: number;
    static readonly CentralFileHeaderSignature: number;
    static readonly EndOfCentralDirSignature: number;
    readonly fullName: string;
    readonly fileName: string;
    readonly data: Uint8Array;
    constructor(fullName: string, data: Uint8Array);
}
declare class ZipReader {
    private _readable;
    constructor(readable: IReadable);
    read(): ZipEntry[];
    private readEntry;
}
declare class ZipCentralDirectoryHeader {
    entry: ZipEntry;
    localHeaderOffset: number;
    compressedSize: number;
    crc32: number;
    compressionMode: number;
    constructor(entry: ZipEntry, crc32: number, localHeaderOffset: number, compressionMode: number, compressedSize: number);
}
declare class ZipWriter {
    private _data;
    private _centralDirectoryHeaders;
    private _deflater;
    constructor(data: IWriteable);
    writeEntry(entry: ZipEntry): void;
    private compress;
    end(): void;
    private writeEndOfCentralDirectoryRecord;
    private writeCentralDirectoryHeader;
}
declare class Gp3To5Importer extends ScoreImporter {
    constructor();
    private static readonly VersionString;
    private _versionNumber;
    private _score;
    private _globalTripletFeel;
    private _lyricsTrack;
    private _lyrics;
    private _barCount;
    private _trackCount;
    private _playbackInfos;
    private _doubleBars;
    private _clefsPerTrack;
    private _keySignatures;
    private _beatTextChunksByTrack;
    private _directionLookup;
    get name(): string;
    readScore(): Score;
    private readDirection;
    readVersion(): void;
    readScoreInformation(): void;
    readLyrics(): void;
    readPageSetup(): void;
    readPageSetupOriginal(): void;
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
    private readRseBank;
    readMixTableChange(beat: Beat): void;
    readNote(track: Track, bar: Bar, voice: Voice, beat: Beat, stringIndex: number): Note;
    toDynamicValue(value: number): DynamicValue;
    readNoteEffects(_track: Track, voice: Voice, beat: Beat, note: Note): void;
    private static readonly BendStep;
    readBend(note: Note): void;
    readGrace(voice: Voice, note: Note): void;
    readTremoloPicking(beat: Beat): void;
    readSlide(note: Note): void;
    readArtificialHarmonic(note: Note): void;
    readTrill(note: Note): void;
}
declare class GpBinaryHelpers {
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
declare class GpxImporter extends ScoreImporter {
    get name(): string;
    readScore(): Score;
}
declare class Gp7To8Importer extends ScoreImporter {
    get name(): string;
    readScore(): Score;
}
declare class StaffContext {
    slurStarts: Map<string, Note>;
    currentDynamics: DynamicValue;
    tieStarts: Set<Note>;
    tieStartIds: Map<string, Note>;
    slideOrigins: Map<string, Note>;
    transpose: number;
    isExplicitlyBeamed: boolean;
    constructor();
}
declare class InstrumentArticulationWithPlaybackInfo extends InstrumentArticulation {
    outputMidiChannel: number;
    outputMidiProgram: number;
    outputMidiBank: number;
    outputVolume: number;
    outputBalance: number;
}
declare class TrackInfo {
    track: Track;
    firstArticulation?: InstrumentArticulationWithPlaybackInfo;
    instrumentArticulations: Map<string, InstrumentArticulationWithPlaybackInfo>;
    private _instrumentIdToArticulationIndex;
    private _lyricsLine;
    private _lyricsLines;
    constructor(track: Track);
    getLyricLine(number: string): number;
    private static defaultNoteArticulation;
    getOrCreateArticulation(instrumentId: string, note: Note): number;
}
declare class MusicXmlImporter extends ScoreImporter {
    private _score;
    private _idToTrackInfo;
    private _indexToTrackInfo;
    private _staffToContext;
    private _divisionsPerQuarterNote;
    private _currentDynamics;
    get name(): string;
    readScore(): Score;
    private extractMusicXml;
    private parseDom;
    private parsePartwise;
    private parseTimewise;
    private parseCredit;
    private static sanitizeDisplay;
    private parseIdentification;
    private parseEncoding;
    private parseMovementTitle;
    private parsePartList;
    private parseScorePart;
    private parseScoreInstrument;
    private parseScorePartMidiInstrument;
    private static interpolatePercent;
    private static interpolatePan;
    private static interpolate;
    private parsePartDisplayAsText;
    private parseWork;
    private parsePartwisePart;
    private parsePartwiseMeasure;
    private parseTimewiseMeasure;
    private getOrCreateMasterBar;
    private parseTimewisePart;
    private _musicalPosition;
    private _lastBeat;
    private parsePartMeasure;
    private parsePrint;
    private applySimileMarks;
    private clearBar;
    private parseBarLine;
    private parseRepeat;
    private _nextMasterBarRepeatEnding;
    private parseEnding;
    private parseBarStyle;
    private parseSound;
    private parseSwing;
    private _nextBeatAutomations;
    private _nextBeatChord;
    private _nextBeatCrescendo;
    private _nextBeatLetRing;
    private _nextBeatPalmMute;
    private _nextBeatOttavia;
    private _nextBeatText;
    private parseSoundMidiInstrument;
    private parseHarmony;
    private parseDegree;
    private parseHarmonyRoot;
    private parseHarmonyKind;
    private parseHarmonyFrame;
    private parseAttributes;
    private _simileMarkAllStaves;
    private _simileMarkPerStaff;
    private _isBeatSlash;
    private parseMeasureStyle;
    private parseTranspose;
    private parseStaffDetails;
    private parseStaffTuning;
    private parseClef;
    private parseTime;
    private _keyAllStaves;
    private parseKey;
    private parseDirection;
    private parseOctaveShift;
    private parseMetronome;
    private hasSameTempo;
    private parsePedal;
    private parseDynamics;
    private parseForward;
    private parseBackup;
    private getOrCreateStaff;
    private getOrCreateBar;
    private getOrCreateVoice;
    private parseNote;
    private parsePlay;
    private createRestForGap;
    private insertBeatToVoice;
    private musicXmlDivisionsToAlphaTabTicks;
    private parseBeatDuration;
    private static allDurations;
    private static allDurationTicks;
    private applyBeatDurationFromTicks;
    private parseLyric;
    private parseNotations;
    private getStaffContext;
    private parseGlissando;
    private parseSlur;
    private parseArpeggiate;
    private parseFermata;
    private parseArticulations;
    private parseTechnical;
    private parseBends;
    private parseFingering;
    private _currentTrillStep;
    private parseOrnaments;
    private parseSlide;
    private parseTied;
    private parseAccidental;
    private calculatePitchedNoteValue;
    private parseDuration;
    private parseUnpitched;
    private parsePitch;
}
type MIDIEvent = {
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
type XYp = {
    x: number;
    y: number;
};
type PP = {
    p1: XYp;
    p2: XYp;
};
declare let pluckDiff: number;
type TicksAverageTime = {
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
type NotePitch = {
    pointDuration: number;
    basePitchDelta: number;
};
type TrackNote = {
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
    constructor(filename: string, filesize: number, arrayBuffer: ArrayBuffer);
}
type MIDITrackInfo = {
    midiTrack: number;
    midiProgram: number;
    trackVolumePoints: {
        ms: number;
        value: number;
        channel: number;
    }[];
    midiTitle: string;
};
type MIDIDrumInfo = {
    midiTrack: number;
    midiPitch: number;
    trackVolumePoints: {
        ms: number;
        value: number;
        channel: number;
    }[];
    title: string;
};
type MIDIFileInfo = {
    fileName: string;
    fileSize: number;
    duration: number;
    noteCount: number;
    drumCount: number;
    tracks: {
        program: number;
        singlCount: number;
        chordCount: number;
        singleDuration: number;
        chordDuration: number;
        pitches: number[];
        title: string;
    }[];
    drums: {
        pitch: number;
        count: number;
        title: string;
    }[];
    bars: {
        idx: Number;
        meter: string;
        bpm: number;
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
    addComments(project: Zvoog_Project): void;
    addLyricsPoints(bar: Zvoog_CommentMeasure, skip: Zvoog_Metre, txt: string): void;
    findMeasureSkipByTime(time: number, measures: Zvoog_SongMeasure[]): null | {
        idx: number;
        skip: Zvoog_Metre;
    };
    findVolumeDrum(midi: number): {
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
declare let parsedProject: Zvoog_Project | null;
declare class AlphaTabImportMusicPlugin {
    callbackID: string;
    constructor();
    init(): void;
    sendImportedMusicData(): void;
    receiveHostMessage(par: any): void;
    loadMusicfile(inputFile: any): void;
}
declare class FileLoaderAlpha {
    inames: ChordPitchPerformerUtil;
    constructor(inputFile: any);
    convertProject(score: Score): void;
    addRepeats(project: Zvoog_Project, score: Score): void;
    cloneAndRepeat(project: Zvoog_Project, start: number, altEnd: number, end: number, count: number): number;
    cloneOneMeasure(project: Zvoog_Project, from: number, to: number): void;
    addLyrics(project: Zvoog_Project, score: Score): void;
    addBarText(text: string, project: Zvoog_Project, barIdx: number): void;
    addHeaderText(text: string, label: string, firstBar: Zvoog_CommentMeasure): void;
    arrangeTracks(project: Zvoog_Project): void;
    arrangeDrums(project: Zvoog_Project): void;
    arrangeFilters(project: Zvoog_Project): void;
    findVolumeInstrument(program: number): {
        idx: number;
        ratio: number;
    };
    findModeInstrument(program: number): number;
    addScoreInsTrack(project: Zvoog_Project, scoreTrack: Track, targetId: string): void;
    beatDuration(beat: Beat): Zvoog_MetreMathType;
    stringFret2pitch(stringNum: number, fretNum: number, tuning: number[], octave: number, tone: number): number;
    takeChord(start: Zvoog_Metre, measure: Zvoog_TrackMeasure): Zvoog_Chord;
    addScoreDrumsTracks(project: Zvoog_Project, scoreTrack: Track, targetId: string): void;
    takeDrumMeasure(trackDrum: Zvoog_PercussionTrack, barNum: number): Zvoog_PercussionMeasure;
    takeDrumTrack(title: string, trackDrums: Zvoog_PercussionTrack[], drumNum: number, targetId: string): Zvoog_PercussionTrack;
}
