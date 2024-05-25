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
declare function createSchedulePlayer(): MZXBX_Player;
declare function createTileLevel(): TileLevelBase;
declare function startApplication(): void;
declare function initWebAudioFromUI(): void;
declare function startLoadCSSfile(cssurl: string): void;
declare class PluginDialogPrompt {
    dialogID: string;
    waitCallback: (obj: any) => boolean;
    constructor();
    openDialogFrame(label: string, url: string, callback: (obj: any) => boolean): void;
    sendMessageToPlugin(data: any): void;
    closeDialogFrame(): void;
    receiveMessageFromPlugin(e: any): void;
}
declare class CommandDispatcher {
    renderer: UIRenderer;
    audioContext: AudioContext;
    tapSizeRatio: number;
    cfg: MixerDataMathUtility;
    listener: null | ((this: HTMLElement, event: HTMLElementEventMap['change']) => any);
    initAudioFromUI(): void;
    registerWorkProject(data: Zvoog_Project): void;
    registerUI(renderer: UIRenderer): void;
    showRightMenu(): void;
    setThemeLocale(loc: string, ratio: number): void;
    setThemeColor(cssPath: string): void;
    resetAnchor(parentSVGGroup: SVGElement, anchor: TileAnchor, layerMode: LevelModes): void;
    changeTapSize(ratio: number): void;
    resetProject(): void;
    moveTrackTop(trackNum: number): void;
    moveDrumTop(drumNum: number): void;
    setTrackSoloState(state: number): void;
    setDrumSoloState(state: number): void;
    promptPluginGUI(label: string, url: string, callback: (obj: any) => boolean): void;
    cancelPluginGUI(): void;
    expandTimeLineSelection(idx: number): void;
}
declare let commandDispatcher: CommandDispatcher;
declare let pluginDialogPrompt: PluginDialogPrompt;
type GridTimeTemplate14 = {
    ratio: number;
    duration: Zvoog_Metre;
    label?: boolean;
};
declare let gridLinesBrief: GridTimeTemplate14[];
declare let gridLinesAccurate: GridTimeTemplate14[];
declare let gridLinesDtailed: GridTimeTemplate14[];
declare let gridLinesExplicit: GridTimeTemplate14[];
declare let zoomPrefixLevelsCSS: {
    prefix: string;
    minZoom: number;
    gridLines: GridTimeTemplate14[];
}[];
declare class UIRenderer {
    toolbar: UIToolbar;
    menu: RightMenuPanel;
    mixer: MixerUI;
    debug: DebugLayerUI;
    warning: WarningUI;
    timeselectbar: TimeSelectBar;
    leftPanel: LeftPanel;
    tiler: TileLevelBase;
    tileLevelSVG: SVGElement;
    lastUsedData: Zvoog_Project;
    constructor();
    changeTapSIze(ratio: number): void;
    createUI(): void;
    fillWholeUI(): void;
    onReSizeView(): void;
    deleteUI(): void;
}
declare let labelLocaleDictionary: string;
declare let localNameLocal: string;
declare let localeFontRatio: number;
declare let localMenuItemSettings: string;
declare let localMenuTracksFolder: string;
declare let localMenuPercussionFolder: string;
declare let localMenuImportFolder: string;
declare let localMenuFileFolder: string;
declare let localMenuAutomationFolder: string;
declare let localMenuCommentsLayer: string;
declare let localeDictionary: {
    id: string;
    data: {
        locale: string;
        text: string;
    }[];
}[];
declare function setLocaleID(loname: string, ratio: number): void;
declare function LO(id: string): string;
declare class TimeSelectBar {
    selectionBarLayer: TileLayerDefinition;
    selectionBarSVGGroup: SVGElement;
    selectBarAnchor: TileAnchor;
    zoomAnchors: TileAnchor[];
    selectedTimeLayer: TileLayerDefinition;
    selectedTimeSVGGroup: SVGElement;
    selectionAnchor: TileAnchor;
    selectionMark: TileRectangle;
    constructor();
    createTimeScale(): TileLayerDefinition[];
    resizeTimeScale(viewWidth: number, viewHeight: number): void;
    updateTimeSelectionBar(cfg: MixerDataMathUtility): void;
    createBarMark(barIdx: number, barLeft: number, size: number, measureAnchor: TileAnchor, cfg: MixerDataMathUtility): void;
    createBarNumber(barLeft: number, barnum: number, zz: number, curBar: Zvoog_SongMeasure, measureAnchor: TileAnchor, barTime: number): void;
    fillTimeBar(cfg: MixerDataMathUtility): void;
}
declare class UIToolbar {
    toolBarAnchor: TileAnchor;
    toolBarGroup: SVGElement;
    toolBarLayer: TileLayerDefinition;
    menuButton: ToolBarButton;
    constructor();
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
    constructor();
    resetAllAnchors(): void;
    createMenu(): TileLayerDefinition[];
    scrollListing(dx: number, dy: number): void;
    fillMenuItems(): void;
    setFocus(it: MenuInfo, infos: MenuInfo[]): void;
    setOpenState(state: boolean, it: MenuInfo, infos: MenuInfo[]): void;
    fillMenuItemChildren(pad: number, infos: MenuInfo[]): void;
    readCurrentSongData(project: Zvoog_Project): void;
    rerenderMenuContent(folder: RightMenuItem | null): void;
    resizeMenu(viewWidth: number, viewHeight: number): void;
}
declare class RightMenuItem {
    kindAction: 1;
    kindDraggable: 2;
    kindPreview: 3;
    kindClosedFolder: 4;
    kindOpenedFolder: 5;
    kindAction2: 6;
    kind: 1 | 2 | 3 | 4 | 5 | 6;
    action?: {
        (): void;
    };
    action2?: {
        (): void;
    };
    pad: number;
    top: number;
    info: MenuInfo;
    constructor(info: MenuInfo, pad: number, tap?: () => void, tap2?: () => void);
    initActionItem(): RightMenuItem;
    initActionItem2(): RightMenuItem;
    initDraggableItem(): RightMenuItem;
    initOpenedFolderItem(): RightMenuItem;
    initClosedFolderItem(): RightMenuItem;
    initPreviewItem(): RightMenuItem;
    calculateHeight(): number;
    buildTile(itemTop: number, itemWidth: number): TileItem;
}
type MenuInfo = {
    text: string;
    noLocalization?: boolean;
    focused?: boolean;
    opened?: boolean;
    children?: MenuInfo[];
    sid?: string;
    onClick?: () => void;
    onSubClick?: () => void;
    states?: string[];
    selection?: number;
};
declare let menuItemsData: MenuInfo[] | null;
declare let menuPointTracks: MenuInfo;
declare let menuPointPercussion: MenuInfo;
declare let menuPointAutomation: MenuInfo;
declare let menuPointFileImport: MenuInfo;
declare let menuPointMenuFile: MenuInfo;
declare function fillMenuImportPlugins(): void;
declare function composeBaseMenu(): MenuInfo[];
declare class LeftPanel {
    leftLayer: TileLayerDefinition;
    leftZoomAnchors: TileAnchor[];
    constructor();
    createLeftPanel(): TileLayerDefinition[];
    reFillLeftPanel(cfg: MixerDataMathUtility): void;
}
declare class SamplerBar {
    constructor(cfg: MixerDataMathUtility, barIdx: number, drumIdx: number, zoomLevel: number, anchor: TileAnchor, left: number);
}
declare class BarOctave {
    constructor(barIdx: number, octaveIdx: number, left: number, top: number, width: number, height: number, barOctaveGridAnchor: TileAnchor, barOctaveTrackAnchor: TileAnchor, barOctaveFirstAnchor: TileAnchor, zoomLevel: number, cfg: MixerDataMathUtility);
}
declare class OctaveContent {
    constructor(barIdx: number, octaveIdx: number, left: number, top: number, width: number, height: number, cfg: MixerDataMathUtility, barOctaveTrackAnchor: TileAnchor, barOctaveFirstAnchor: TileAnchor, zoomLevel: number);
    addUpperNotes(barIdx: number, octaveIdx: number, left: number, top: number, width: number, height: number, barOctaveAnchor: TileAnchor, cfg: MixerDataMathUtility, zoomLevel: number): void;
    addOtherNotes(barIdx: number, octaveIdx: number, left: number, top: number, width: number, height: number, barOctaveAnchor: TileAnchor, cfg: MixerDataMathUtility): void;
    addTrackNotes(track: Zvoog_MusicTrack, barIdx: number, octaveIdx: number, left: number, top: number, width: number, height: number, barOctaveAnchor: TileAnchor, cfg: MixerDataMathUtility, css: string, addMoreInfo: boolean): void;
}
declare class MixerBar {
    octaves: BarOctave[];
    zoomLevel: number;
    constructor(barIdx: number, left: number, ww: number, zoomLevel: number, gridZoomBarAnchor: TileAnchor, tracksZoomBarAnchor: TileAnchor, firstZoomBarAnchor: TileAnchor, cfg: MixerDataMathUtility);
    addOctaveGridSteps(barIdx: number, cfg: MixerDataMathUtility, barLeft: number, width: number, barOctaveAnchor: TileAnchor, zIndex: number): void;
}
declare class TextComments {
    constructor(barIdx: number, cfg: MixerDataMathUtility, barLeft: number, barOctaveAnchor: TileAnchor, zIndex: number);
}
declare class AutomationBarContent {
    constructor(barIdx: number, cfg: MixerDataMathUtility, barLeft: number, barOctaveAnchor: TileAnchor, zIndex: number);
}
declare class MixerUI {
    gridLayers: TileLayerDefinition;
    trackLayers: TileLayerDefinition;
    firstLayers: TileLayerDefinition;
    levels: MixerZoomLevel[];
    fillerAnchor: TileAnchor;
    reFillMixerUI(cfg: MixerDataMathUtility): void;
    createMixerLayers(): TileLayerDefinition[];
    reFillTracksRatio(cfg: MixerDataMathUtility): void;
}
declare class MixerZoomLevel {
    zoomGridAnchor: TileAnchor;
    zoomTracksAnchor: TileAnchor;
    zoomFirstAnchor: TileAnchor;
    bars: MixerBar[];
    zoomLevelIndex: number;
    constructor(zoomLevel: number, anchorGrid: TileAnchor, anchorTracks: TileAnchor, anchorFirst: TileAnchor);
    reCreateBars(cfg: MixerDataMathUtility): void;
    addDrumLines(cfg: MixerDataMathUtility): void;
    addCommentLines(cfg: MixerDataMathUtility): void;
    addGridLines(barOctaveAnchor: TileAnchor, cfg: MixerDataMathUtility): void;
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
declare let icon_hor_menu: string;
declare let icon_ver_menu: string;
declare let icon_closemenu: string;
declare let icon_closedbranch: string;
declare let icon_openedbranch: string;
declare let icon_openleft: string;
declare let icon_closeleft: string;
declare let icon_moveup: string;
declare let icon_movedown: string;
declare let icon_moveleft: string;
declare let icon_moveright: string;
declare let icon_warningPlay: string;
declare let icon_gear: string;
declare let icon_sound_low: string;
declare let icon_sound_middle: string;
declare let icon_sound_loud: string;
declare let icon_sound_none: string;
declare let icon_sound_surround: string;
declare let icon_hide: string;
declare class DebugLayerUI {
    debugRectangle: TileRectangle;
    debugAnchor: TileAnchor;
    debugGroup: SVGElement;
    debugLayer: TileLayerDefinition;
    allLayers(): TileLayerDefinition[];
    setupUI(): void;
    resetDebugView(cfg: MixerDataMathUtility): void;
    deleteDebbugView(): void;
}
declare class WarningUI {
    warningRectangle: TileRectangle;
    warningAnchor: TileAnchor;
    warningGroup: SVGElement;
    warningLayer: TileLayerDefinition;
    warningIcon: TileText;
    warningTitle: TileText;
    warningDescription: TileText;
    cancel: () => void;
    initDialogUI(): void;
    resetDialogView(data: Zvoog_Project): void;
    resizeDialog(ww: number, hh: number, resetWarningAnchor: () => void): void;
    allLayers(): TileLayerDefinition[];
    showWarning(): void;
    hideWarning(): void;
}
declare let mzxbxProjectForTesting2: Zvoog_Project;
declare let testBigMixerData: {
    title: string;
    timeline: {
        tempo: number;
        metre: {
            count: number;
            part: number;
        };
    }[];
    notePathHeight: number;
    widthDurationRatio: number;
    pitchedTracks: {
        title: string;
    }[];
};
declare let testEmptyMixerData: {
    title: string;
    timeline: {
        tempo: number;
        metre: {
            count: number;
            part: number;
        };
    }[];
    notePathHeight: number;
    widthDurationRatio: number;
    pitchedTracks: {
        title: string;
    }[];
};
declare class MixerDataMathUtility {
    data: Zvoog_Project;
    leftPad: number;
    rightPad: number;
    bottomPad: number;
    topPad: number;
    notePathHeight: number;
    widthDurationRatio: number;
    octaveCount: number;
    titleBottomPad: number;
    automationBottomPad: number;
    samplerBottomPad: number;
    gridBottomPad: number;
    maxCommentRowCount: number;
    maxAutomationsCount: number;
    constructor(data: Zvoog_Project);
    wholeWidth(): number;
    heightOfTitle(): number;
    timelineWidth(): number;
    wholeHeight(): number;
    automationMaxHeight(): number;
    commentsMaxHeight(): number;
    commentsAverageFillHeight(): number;
    automationTop(): number;
    gridTop(): number;
    gridHeight(): number;
}
declare let biChar32: String[];
type PackedChannel = {
    wafIndex: number;
};
type PackedBar = {
    tone: number;
    mode: number;
};
type PackedProject = {
    bars: PackedBar[];
};
declare function testNumMathUtil(): void;
type TileZoom = {
    x: number;
    y: number;
    z: number;
};
type TilePoint = {
    x: number;
    y: number;
};
type TileBaseDefinition = {
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
type TileLayerDefinition = {
    g: SVGElement;
    mode: 0 | 1 | 2 | 3 | 4 | 5;
    stickLeft?: number;
    stickTop?: number;
    stickBottom?: number;
    stickRight?: number;
    anchors: TileAnchor[];
};
type TileItem = TileAnchor | TileRectangle | TileText | TilePath | TileLine | TilePolygon | TileImage;
type TileAnchor = {
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
type TileImage = {
    x: number;
    y: number;
    w: number;
    h: number;
    preserveAspectRatio?: string;
    href: string;
} & TileBaseDefinition;
type TileRectangle = {
    x: number;
    y: number;
    w: number;
    h: number;
    rx?: number;
    ry?: number;
} & TileBaseDefinition;
type TileText = {
    x: number;
    y: number;
    text: string;
    maxWidth?: string;
} & TileBaseDefinition;
declare function TText(x: number, y: number, css: string, text: string): TileText;
type TilePath = {
    x?: number;
    y?: number;
    scale?: number;
    points: string;
} & TileBaseDefinition;
type TileLine = {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
} & TileBaseDefinition;
type TilePolygon = {
    x?: number;
    y?: number;
    scale?: number;
    dots: number[];
} & TileBaseDefinition;
type TileSVGElement = SVGElement & {
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
type TileLevelBase = {
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
type Zvoog_Note = {
    pitch: number;
    slides: Zvoog_Slide[];
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
    dataBlob: string;
    outputId: string;
    automation: Zvoog_AutomationTrack | null;
};
type Zvoog_AudioSequencer = {
    id: string;
    data: string;
    kind: string;
    outputId: string;
};
type Zvoog_AudioSampler = {
    id: string;
    data: string;
    kind: string;
    outputId: string;
};
type Zvoog_Chord = {
    skip: Zvoog_Metre;
    notes: Zvoog_Note[];
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
type Zvoog_AutomationTrack = {
    title: string;
    measures: Zvoog_FilterMeasure[];
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
type Zvoog_Project = {
    title: string;
    timeline: Zvoog_SongMeasure[];
    tracks: Zvoog_MusicTrack[];
    percussions: Zvoog_PercussionTrack[];
    comments: Zvoog_CommentMeasure[];
    filters: Zvoog_FilterTarget[];
    selection?: Zvoog_Selection;
};
type MZXBX_CachedWave = {
    path: string;
    buffer: AudioBuffer | null;
    canceled?: boolean;
    line100?: number[];
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
declare function MMUtil(): Zvoog_MetreMathType;
declare function MZXBX_currentPlugins(): MZXBX_PluginRegistrationInformation[];
