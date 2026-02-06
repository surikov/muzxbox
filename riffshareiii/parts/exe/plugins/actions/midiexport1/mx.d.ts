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
    hint1_128: number;
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
    hint35_81: number;
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
    channel: MZXBX_Channel;
    kind: string;
    properties: string;
    description: string;
};
type MZXBX_Channel = {
    id: string;
    performer: MZXBX_ChannelSource;
    outputs: string[];
    hint: number;
};
type MZXBX_SlideItem = {
    duration: number;
    delta: number;
};
type MZXBX_PlayItem = {
    skip: number;
    channel: MZXBX_Channel;
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
    launch: (context: AudioContext, parameters: string) => number;
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
    launch: (context: AudioContext, parameters: string) => number;
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
declare abstract class MZXBX_Plugin_UI {
    dialogId: string;
    hostData: any;
    constructor(screenWait: boolean);
    closeDialog(data: any): void;
    updateHostData(data: any): void;
    _sendMessageToHost(data: any, done: boolean, screenWait: boolean): void;
    _receiveHostMessage(messageEvent: MessageEvent): void;
    abstract onMessageFromHost(message: MZXBX_MessageToPlugin): void;
    abstract onLanguaga(enruzhId: string): void;
}
declare class ControllerChangeEvent implements MidiEvent {
    channel: number;
    controllerNumber: number;
    controllerValue: number;
    data: number[];
    delta: number;
    name: string;
    status: 0xB0;
    constructor(fields: {
        controllerNumber: number;
        controllerValue: number;
        channel?: number;
        delta?: number;
    });
}
interface MidiEvent extends AbstractEvent {
    channel: number;
    status: number;
    buildData?: Function;
}
declare class NoteEvent implements AbstractEvent {
    data: number[];
    delta: number;
    events: MidiEvent[];
    name: string;
    pitch: string[];
    grace: string | string[];
    channel: number;
    repeat: number;
    tick: number;
    duration: string;
    sequential: boolean;
    wait: string;
    velocity: number;
    tickDuration: number;
    restDuration: number;
    constructor(fields: any);
    buildData(): NoteEvent;
}
declare class NoteOffEvent implements MidiEvent {
    channel: number;
    data: number[];
    delta: number;
    deltaWithPrecisionCorrection: number;
    status: 0x80;
    name: string;
    velocity: number;
    pitch: string | number;
    duration: string | number;
    tick: number;
    constructor(fields: any);
    buildData(track: any, precisionDelta: number, options?: {
        middleC?: string;
    }): this;
}
declare class NoteOnEvent implements MidiEvent {
    channel: number;
    data: number[];
    delta: number;
    status: 0x90;
    name: string;
    pitch: string | string[] | number | number[];
    velocity: number;
    wait: string | number;
    tick: number;
    deltaWithPrecisionCorrection: number;
    constructor(fields: {
        channel?: number;
        wait?: string | number;
        velocity?: number;
        pitch?: string | string[] | number | number[];
        tick?: number;
        data?: number[];
        delta?: number;
    });
    buildData(track: any, precisionDelta: any, options?: {
        middleC?: string;
    }): this;
}
declare class NoteOnEventOnOff2 implements MidiEvent {
    channel: number;
    data: number[];
    delta: number;
    status: 0x90;
    name: string;
    constructor(channel: number, tickDelta: number, pitch: number, velocity: number, isOn: boolean);
}
declare class PitchBendEvent implements MidiEvent {
    channel: number;
    data: number[];
    delta: number;
    name: string;
    status: 0xE0;
    constructor(fields: any);
    scale14bits(zeroOne: any): number;
}
declare class ProgramChangeEvent implements MidiEvent {
    channel: number;
    data: number[];
    delta: number;
    status: 0xC0;
    name: string;
    instrument: number;
    constructor(fields: {
        channel?: number;
        delta?: number;
        instrument: number;
    });
}
declare class CopyrightEvent implements MetaEvent {
    data: number[];
    delta: number;
    name: string;
    text: string;
    type: 0x02;
    constructor(fields: {
        text: string;
        delta?: number;
    });
}
declare class CuePointEvent implements MetaEvent {
    data: number[];
    delta: number;
    name: string;
    text: string;
    type: 0x07;
    constructor(fields: {
        text: string;
        delta?: number;
    });
}
declare class EndTrackEvent implements MetaEvent {
    data: number[];
    delta: number;
    name: string;
    type: [0x2F, 0x00];
    constructor(fields?: {
        delta: number;
    });
}
declare class InstrumentNameEvent implements MetaEvent {
    data: number[];
    delta: number;
    name: string;
    text: string;
    type: 0x04;
    constructor(fields: {
        text: string;
        delta?: number;
    });
}
declare class KeySignatureEvent implements MetaEvent {
    data: number[];
    delta: number;
    name: string;
    type: 0x59;
    constructor(sf: any, mi: any);
}
declare class LyricEvent implements MetaEvent {
    data: number[];
    delta: number;
    name: string;
    text: string;
    type: 0x05;
    constructor(fields: {
        text: string;
        delta?: number;
    });
}
declare class MarkerEvent implements MetaEvent {
    data: number[];
    delta: number;
    name: string;
    text: string;
    type: 0x06;
    constructor(fields: {
        text: string;
        delta?: number;
    });
}
interface MetaEvent extends AbstractEvent {
    type: number | number[];
}
declare class TempoEvent implements MetaEvent {
    bpm: number;
    data: number[];
    delta: number;
    name: string;
    tick: number;
    type: 0x51;
    constructor(fields: {
        bpm: number;
        tick?: number;
        delta?: number;
    });
}
declare class TrackTextEvent implements MetaEvent {
    data: number[];
    delta: number;
    name: string;
    text: string;
    type: 0x01;
    constructor(fields: {
        text: string;
        delta?: number;
    });
}
declare class TimeSignatureEvent implements MetaEvent {
    data: number[];
    delta: number;
    name: string;
    type: 0x58;
    constructor(numerator: any, denominator: any, midiclockspertick?: any, notespermidiclock?: any);
}
declare class TrackNameEvent implements MetaEvent {
    data: number[];
    delta: number;
    name: string;
    text: string;
    type: 0x03;
    constructor(fields: {
        text: string;
        delta?: number;
    });
}
declare class MHeader implements Chunk {
    data: number[];
    type: number[];
    size: number[];
    constructor(numberOfTracks: any);
}
interface Chunk {
    type: number[];
    size: number[];
}
declare class Track implements Chunk {
    data: number[];
    events: AbstractEvent[];
    explicitTickEvents: NoteEvent[];
    size: number[];
    type: number[];
    tickPointer: number;
    constructor();
    addEvent(events: (AbstractEvent | AbstractEvent[]), mapFunction?: (i: number, event: AbstractEvent) => object): Track;
    buildData(options?: {}): this;
    mergeExplicitTickEvents(): void;
    mergeTrack(track: Track): Track;
    mergeSingleEvent(event: AbstractEvent): Track;
    removeEventsByName(eventName: string): Track;
    setTempo(bpm: number, tick?: number): Track;
    setTimeSignature(numerator: number, denominator: number, midiclockspertick: number, notespermidiclock: number): Track;
    setTimeSignatureOnly(numerator: number, denominator: number): Track;
    setKeySignature(sf: any, mi: any): Track;
    addText(text: string): Track;
    addCopyright(text: string): Track;
    addTrackName(text: string): Track;
    addInstrumentName(text: string): Track;
    addMarker(text: string): Track;
    addCuePoint(text: string): Track;
    addLyric(text: string): Track;
    polyModeOn(): Track;
    setPitchBend(bend: number): Track;
    controllerChange(number: number, value: number, channel?: number, delta?: number): Track;
}
interface AbstractEvent {
    data: number[];
    delta: number;
    name: string;
    tick?: number;
}
declare const Constants: {
    VERSION: string;
    HEADER_CHUNK_TYPE: number[];
    HEADER_CHUNK_LENGTH: number[];
    HEADER_CHUNK_FORMAT0: number[];
    HEADER_CHUNK_FORMAT1: number[];
    HEADER_CHUNK_DIVISION: number[];
    TRACK_CHUNK_TYPE: number[];
    META_EVENT_ID: number;
    META_SMTPE_OFFSET: number;
};
declare var NoNote: {
    empty: boolean;
    name: string;
    pc: string;
    acc: string;
};
declare var REGEX: RegExp;
declare var SEMI: number[];
declare var cache: Map<any, any>;
declare function tokenizeNote(str: any): any[];
declare function parse(noteName: any): {
    empty: boolean;
    name: string;
    pc: string;
    acc: string;
} | {
    empty: boolean;
    acc: any;
    alt: any;
    chroma: number;
    coord: number[];
    freq: number | null;
    height: any;
    letter: any;
    midi: any;
    name: any;
    oct: number | undefined;
    pc: any;
    step: number;
};
declare var mod: (n: any, m: any) => number;
declare var FIFTHS: number[];
declare var STEPS_TO_OCTS: number[];
declare function encode(pitch: any): number[];
declare var fillStr: (s: any, n: any) => string;
declare var altToAcc: (alt: any) => string;
declare var accToAlt: (acc: any) => any;
declare var stepToLetter: (step: any) => string;
declare function pitchName(props: any): string;
declare function note(src: any): any;
declare function isNamed(src: any): boolean;
declare function isPitch(pitch: any): boolean;
declare function isMidi(arg: any): boolean;
declare function toMidi(pnote: any): any;
declare class Utils {
    static version(): string;
    static stringToBytes(string: string): number[];
    static isNumeric(n: any): boolean;
    static getPitch(pitch: any, middleC?: string): number;
    static numberToVariableLength(ticks: number): number[];
    static stringByteCount(s: string): number;
    static numberFromBytes(bytes: number[]): number;
    static numberToBytes(number: number, bytesNeeded: number): number[];
    static toArray(value: any): any[];
    static convertVelocity(velocity: number): number;
    static getTickDuration(duration: (string | string[] | number)): number;
    static getRoundedIfClose(tick: number): number;
    static getPrecisionLoss(tick: number): number;
    static getDurationMultiplier(duration: string): number;
}
declare const Buffer: any;
declare const process: any;
declare class Writer {
    tracks: Track[];
    options: object;
    constructor(tracks: any, options?: {});
    buildData(): never[];
    buildFile(): Uint8Array;
    base64(): string;
    dataUri(): string;
    setOption(key: string, value: number | string): Writer;
    stdout(): any;
}
declare class MiniumMIDIx extends MZXBX_Plugin_UI {
    currentProject: Zvoog_Project;
    constructor();
    startExport(): void;
    onMessageFromHost(message: MZXBX_MessageToPlugin): void;
    setText(id: string, txt: string): void;
    onLanguaga(enruzhId: string): void;
}
