declare class TreeValue {
    name: string;
    value: string;
    content: TreeValue[];
    constructor(name: string, value: string, children: TreeValue[]);
    clone(): TreeValue;
    first(name: string): TreeValue;
    exists(name: string): boolean;
    every(name: string): TreeValue[];
    seek(name: string, subname: string, subvalue: string): TreeValue;
    readDocChildren(node: any): TreeValue[];
    fillFromDocument(document: Document): void;
    fillFromXMLstring(xml: string): void;
    readObjectChildren(oo: Object): void;
    fillFromJSONstring(json: string): void;
    dump(pad: string, symbol: string): void;
}
declare function startApplication(): void;
declare function startLoadCSSfile(cssurl: string): void;
declare class CommandDispatcher {
    renderer: UIRenderer;
    registerUI(renderer: UIRenderer): void;
    showRightMenu(): void;
    resetAnchor(parentSVGGroup: SVGElement, anchor: TileAnchor, layerMode: LevelModes): void;
    changeTapSIze(ratio: number): void;
    promptImportFromMIDI(): void;
}
declare type MZXBX_Schedule = {
    series: MZXBX_Set[];
    channels: MZXBX_Channel[];
    filters: MZXBX_ChannelFilter[];
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
declare type MZXBX_Channel = {
    id: string;
    comment?: string;
    filters: MZXBX_ChannelFilter[];
    performer: MZXBX_ChannelPerformer;
};
declare type MZXBX_ChannelPerformer = {
    id: string;
    kind: string;
    properties: string;
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
    points: NotePitch[];
    openEvent?: MIDIEvent;
    closeEvent?: MIDIEvent;
    volume?: number;
};
declare type NotePitch = {
    pointDuration: number;
    pitch: number;
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
    points: MIDISongPoint[];
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
    title: string;
    instrument: string;
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
    controller_coarseVolume: number;
    controller_coarseDataEntrySlider: number;
    controller_fineDataEntrySlider: number;
    controller_coarseRPN: number;
    controller_fineRPN: number;
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
    simplifyPath(points: XYp[], tolerance: number): XYp[];
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
    dump(): MZXBX_Schedule;
}
declare function createTileLevel(): TileLevelBase;
declare let zoomPrefixLevelsCSS: {
    prefix: string;
    zoom: number;
}[];
declare class UIRenderer {
    toolbar: UIToolbar;
    menu: RightMenuPanel;
    mixer: MixerUI;
    debug: DebugLayerUI;
    tiler: TileLevelBase;
    tileLevelSVG: SVGElement;
    commands: CommandDispatcher;
    constructor(commands: CommandDispatcher);
    changeTapSIze(ratio: number): void;
    createUI(): void;
    fillUI(data: MixerData): void;
    onReSizeView(): void;
    deleteUI(): void;
}
declare let labelLocaleDictionary: string;
declare let localNameLocal: string;
declare let localMenuItemSettings: string;
declare let localeDictionary: {
    id: string;
    data: {
        locale: string;
        text: string;
    }[];
}[];
declare function setLocaleID(loname: string): void;
declare function LO(id: string): string;
declare class UIToolbar {
    toolBarRectangle: TileRectangle;
    toolBarShadow: TileRectangle;
    toolBarAnchor: TileAnchor;
    toolBarGroup: SVGElement;
    toolBarLayer: TileLayerDefinition;
    playPauseButton: ToolBarButton;
    menuButton: ToolBarButton;
    headButton: ToolBarButton;
    commands: CommandDispatcher;
    constructor(commands: CommandDispatcher);
    createToolbar(): TileLayerDefinition[];
    resizeToolbar(viewWIdth: number, viewHeight: number): void;
}
declare class ToolBarButton {
    stick: number;
    position: number;
    iconLabelButton: IconLabelButton;
    constructor(labels: string[], stick: number, position: number, action: (nn: number) => void);
    resize(viewWIdth: number, viewHeight: number): void;
}
declare class RightMenuPanel {
    menuCloseButton: IconLabelButton;
    menuUpButton: IconLabelButton;
    showState: boolean;
    lastWidth: number;
    lastHeight: number;
    backgroundRectangle: TileRectangle;
    listingShadow: TileRectangle;
    backgroundAnchor: TileAnchor;
    menuPanelBackground: SVGElement;
    menuPanelContent: SVGElement;
    menuPanelInteraction: SVGElement;
    menuPanelButtons: SVGElement;
    bgLayer: TileLayerDefinition;
    contentLayer: TileLayerDefinition;
    interLayer: TileLayerDefinition;
    buttonsLayer: TileLayerDefinition;
    interAnchor: TileAnchor;
    buttonsAnchor: TileAnchor;
    dragHandler: TileRectangle;
    contentAnchor: TileAnchor;
    items: RightMenuItem[];
    scrollY: number;
    shiftX: number;
    lastZ: number;
    itemsWidth: number;
    commands: CommandDispatcher;
    constructor(commands: CommandDispatcher);
    resetAllAnchors(): void;
    createMenu(): TileLayerDefinition[];
    scrollListing(dx: number, dy: number): void;
    randomString(nn: number): string;
    fillMenuItems(): void;
    setFocus(it: MenuInfo, infos: MenuInfo[]): void;
    setOpenState(state: boolean, it: MenuInfo, infos: MenuInfo[]): void;
    fillMenuItemChildren(pad: number, infos: MenuInfo[]): void;
    setThemeLocale(loc: string): void;
    setThemeColor(cssPath: string): void;
    setThemeSize(ratio: number, cssPath: string): void;
    rerenderContent(folder: RightMenuItem | null): void;
    resizeMenu(viewWidth: number, viewHeight: number): void;
}
declare class RightMenuItem {
    label: string;
    kindAction: 1;
    kindDraggable: 2;
    kindPreview: 3;
    kindClosedFolder: 4;
    kindOpenedFolder: 5;
    kind: 1 | 2 | 3 | 4 | 5;
    action: {
        (x: number, y: number): void;
    };
    pad: number;
    focused: boolean;
    top: number;
    info: MenuInfo;
    constructor(info: MenuInfo);
    initActionItem(pad: number, focused: boolean, label: string, tap: () => void): this;
    initDraggableItem(pad: number, focused: boolean, tap: () => void): this;
    initOpenedFolderItem(pad: number, focused: boolean, label: string, tap: () => void): this;
    initClosedFolderItem(pad: number, focused: boolean, label: string, tap: () => void): this;
    initPreviewItem(pad: number, focused: boolean, tap: () => void): this;
    calculateHeight(): number;
    buildTile(itemTop: number, itemWidth: number): TileItem;
}
declare type MenuInfo = {
    text: string;
    focused?: boolean;
    opened?: boolean;
    children?: MenuInfo[];
    sid?: string;
};
declare let commandThemeSizeSmall: string;
declare let commandThemeSizeBig: string;
declare let commandThemeSizeHuge: string;
declare let commandThemeColorRed: string;
declare let commandThemeColorGreen: string;
declare let commandThemeColorBlue: string;
declare let commandLocaleEN: string;
declare let commandLocaleRU: string;
declare let commandLocaleZH: string;
declare let commandImportFromMIDI: string;
declare let testMenuData: MenuInfo[];
declare class BarOctave {
    constructor(left: number, top: number, width: number, height: number, anchor: TileAnchor, prefix: string, minZoom: number, maxZoom: number, data: MixerData);
}
declare class OctaveContent {
    constructor(aa: number, top: number, toAnchor: TileAnchor, data: MixerData);
    resetMainPitchedTrackUI(pitchedTrackData: PitchedTrack): void;
    resetOtherPitchedTrackUI(pitchedTrackData: PitchedTrack): void;
}
declare class MixerBar {
    barRectangle: TileRectangle;
    barAnchor: TileAnchor;
    prefix: string;
    octaves: BarOctave[];
    constructor(prefix: string, left: number, top: number, ww: number, hh: number, minZoom: number, maxZoom: number, toAnchor: TileAnchor, data: MixerData);
}
declare class MixerUI {
    svgs: SVGElement[];
    zoomLayers: TileLayerDefinition[];
    zoomAnchors: TileAnchor[];
    levels: MixerZoomLevel[];
    fillMixeUI(data: MixerData): void;
    buildMixerLayers(): TileLayerDefinition[];
}
declare class MixerZoomLevel {
    minZoom: number;
    maxZoom: number;
    anchor: TileAnchor;
    bg: TileRectangle;
    prefix: string;
    bars: MixerBar[];
    constructor(prefix: string, minZoom: number, maxZoom: number, anchor: TileAnchor);
    buildLevel(ww: number, hh: number): void;
    fillBars(data: MixerData, hh: number): void;
}
declare class IconLabelButton {
    anchor: TileAnchor;
    bg: TileRectangle;
    spot: TileRectangle;
    label: TileText;
    left: number;
    top: number;
    labels: string[];
    action: (selection: number) => void;
    selection: number;
    constructor(labels: string[], cssBG: string, cssLabel: string, action: (nn: number) => void);
    resize(left: number, top: number, size: number): void;
}
declare let icon_play: string;
declare let icon_pause: string;
declare let icon_openmenu: string;
declare let icon_closemenu: string;
declare let icon_closedbranch: string;
declare let icon_openedbranch: string;
declare let icon_openleft: string;
declare let icon_closeleft: string;
declare let icon_moveup: string;
declare let icon_movedown: string;
declare let icon_moveleft: string;
declare let icon_moveright: string;
declare class DebugLayerUI {
    debugRectangle: TileRectangle;
    debugAnchor: TileAnchor;
    debugGroup: SVGElement;
    debugLayer: TileLayerDefinition;
    allLayers(): TileLayerDefinition[];
    setupUI(): void;
    resetDebugView(data: MixerData): void;
    deleteDebbugView(): void;
}
declare type MusicMetre = {
    count: number;
    part: number;
};
declare type TimeBar = {
    tempo: number;
    metre: MusicMetre;
};
declare type PitchedTrack = {
    title: string;
};
declare type DrumsTrack = {
    title: string;
};
declare type MixerData = {
    title: string;
    timeline: TimeBar[];
    notePathHeight: number;
    widthDurationRatio: number;
    pitchedTracks: PitchedTrack[];
};
declare let testBigMixerData: MixerData;
declare let testEmptyMixerData: MixerData;
declare class MusicMetreMath {
    count: number;
    part: number;
    constructor(from: MusicMetre);
    metre(): MusicMetre;
    simplyfy(): MusicMetreMath;
    strip(toPart: number): MusicMetreMath;
    equals(metre: MusicMetre): boolean;
    less(metre: MusicMetre): boolean;
    more(metre: MusicMetre): boolean;
    plus(metre: MusicMetre): MusicMetreMath;
    minus(metre: MusicMetre): MusicMetreMath;
    duration(tempo: number): number;
    width(tempo: number, ratio: number): number;
}
declare class MixerDataMath {
    data: MixerData;
    constructor(data: MixerData);
    wholeWidth(): number;
    wholeHeight(): number;
}
declare let biChar32: String[];
declare type PackedChannel = {
    wafIndex: number;
};
declare type PackedBar = {
    tone: number;
    mode: number;
};
declare type PackedProject = {
    bars: PackedBar[];
};
declare function testNumMathUtil(): void;
declare type TileZoom = {
    x: number;
    y: number;
    z: number;
};
declare type TilePoint = {
    x: number;
    y: number;
};
declare type TileBaseDefinition = {
    id?: string;
    css?: string;
    style?: string;
    activation?: (x: number, y: number) => void | undefined;
    draggable?: boolean;
};
declare enum LevelModes {
    normal = 0,
    left = 1,
    right = 2,
    top = 3,
    bottom = 4,
    overlay = 5
}
declare type TileLayerDefinition = {
    g: SVGElement;
    mode: 0 | 1 | 2 | 3 | 4 | 5;
    stickLeft?: number;
    stickTop?: number;
    stickBottom?: number;
    stickRight?: number;
    anchors: TileAnchor[];
};
declare type TileItem = TileAnchor | TileRectangle | TileText | TilePath | TileLine | TilePolygon | TileImage;
declare type TileAnchor = {
    xx: number;
    yy: number;
    ww: number;
    hh: number;
    showZoom: number;
    hideZoom: number;
    content: TileItem[];
    translation?: TilePoint;
} & TileBaseDefinition;
declare function TAnchor(xx: number, yy: number, ww: number, hh: number, showZoom: number, hideZoom: number, id?: string, translation?: TilePoint): TileAnchor;
declare type TileImage = {
    x: number;
    y: number;
    w: number;
    h: number;
    preserveAspectRatio?: string;
    href: string;
} & TileBaseDefinition;
declare type TileRectangle = {
    x: number;
    y: number;
    w: number;
    h: number;
    rx?: number;
    ry?: number;
} & TileBaseDefinition;
declare type TileText = {
    x: number;
    y: number;
    text: string;
    maxWidth?: string;
} & TileBaseDefinition;
declare function TText(x: number, y: number, css: string, text: string): TileText;
declare type TilePath = {
    x?: number;
    y?: number;
    scale?: number;
    points: string;
} & TileBaseDefinition;
declare type TileLine = {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
} & TileBaseDefinition;
declare type TilePolygon = {
    x?: number;
    y?: number;
    scale?: number;
    dots: number[];
} & TileBaseDefinition;
declare type TileSVGElement = SVGElement & {
    onClickFunction: (x: number, y: number) => void;
    watchX: number;
    watchY: number;
    watchW: number;
    watchH: number;
    minZoom: number;
    maxZoom: number;
    translateX: number;
    translateY: number;
};
declare type TileLevelBase = {
    dump: () => void;
    tapPxSize: () => number;
    setupTapSize: (ratioCm: number) => void;
    resetModel: () => void;
    getCurrentPointPosition(): TileZoom;
    getStartMouseScreen(): TilePoint;
    screen2view(screen: TilePoint): TilePoint;
    resetAnchor(parentSVGGroup: SVGElement, anchor: TileAnchor, layerMode: LevelModes): void;
    delayedResetAnchor(parentSVGGroup: SVGElement, anchor: TileAnchor, layerMode: LevelModes): void;
    setAfterResizeCallback(f: () => void): void;
    setAfterZoomCallback(f: () => void): void;
    resetInnerSize(inWidth: number, inHeight: number): void;
    initRun(svgObject: SVGElement, stickLeft: boolean, inWidth: number, inHeight: number, minZoom: number, curZoom: number, maxZoom: number, layers: TileLayerDefinition[]): void;
};
