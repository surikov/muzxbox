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
    dialogMessage: MZXBX_PluginMessage | null;
    waitCallback: (obj: any) => boolean;
    constructor();
    openDialogFrame(label: string, url: string, initOrProject: any, callback: (obj: any) => boolean): void;
    sendMessageToPlugin(): void;
    closeDialogFrame(): void;
    receiveMessageFromPlugin(e: any): void;
}
declare class CommandDispatcher {
    player: MZXBX_Player;
    renderer: UIRenderer;
    audioContext: AudioContext;
    tapSizeRatio: number;
    onAir: boolean;
    _mixerDataMathUtility: MixerDataMathUtility;
    listener: null | ((this: HTMLElement, event: HTMLElementEventMap['change']) => any);
    cfg(): MixerDataMathUtility;
    initAudioFromUI(): void;
    registerWorkProject(data: Zvoog_Project): void;
    registerUI(renderer: UIRenderer): void;
    showRightMenu(): void;
    toggleStartStop(): void;
    setThemeLocale(loc: string, ratio: number): void;
    setThemeColor(cssPath: string): void;
    resetAnchor(parentSVGGroup: SVGElement, anchor: TileAnchor, layerMode: LevelModes): void;
    changeTapSize(ratio: number): void;
    resetProject(): void;
    moveTrackTop(trackNum: number): void;
    moveDrumTop(drumNum: number): void;
    moveAutomationTop(filterNum: number): void;
    upTracksLayer(): void;
    upDrumsLayer(): void;
    upAutoLayer(): void;
    upCommentsLayer(): void;
    setTrackSoloState(state: number): void;
    setDrumSoloState(state: number): void;
    promptProjectPluginGUI(label: string, url: string, callback: (obj: any) => boolean): void;
    resendMessagePluginGUI(): void;
    promptPointPluginGUI(label: string, url: string, callback: (obj: any) => boolean): void;
    cancelPluginGUI(): void;
    expandTimeLineSelection(idx: number): void;
}
declare let globalCommandDispatcher: CommandDispatcher;
declare let pluginDialogPrompt: PluginDialogPrompt;
declare type GridTimeTemplate14 = {
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
declare let localMenuPlayPause: string;
declare let localMenuActionsFolder: string;
declare let localMenuPerformersFolder: string;
declare let localMenuFiltersFolder: string;
declare let localMenuSamplersFolder: string;
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
    updateTimeSelectionBar(): void;
    createBarMark(barIdx: number, barLeft: number, size: number, measureAnchor: TileAnchor): void;
    createBarNumber(barLeft: number, barnum: number, zz: number, curBar: Zvoog_SongMeasure, measureAnchor: TileAnchor, barTime: number): void;
    fillTimeBar(): void;
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
    lastWidth: number;
    lastHeight: number;
    backgroundRectangle: TileRectangle;
    listingShadow: TileRectangle;
    backgroundAnchor: TileAnchor;
    layerCurrentTitle: TileText;
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
declare type MenuInfo = {
    text: string;
    noLocalization?: boolean;
    focused?: boolean;
    opened?: boolean;
    children?: MenuInfo[];
    sid?: string;
    onClick?: () => void;
    onSubClick?: () => void;
    onOpen?: () => void;
    itemStates?: string[];
    selection?: number;
};
declare let menuItemsData: MenuInfo[] | null;
declare let menuPointActions: MenuInfo;
declare let menuPointPerformers: MenuInfo;
declare let menuPointFilters: MenuInfo;
declare let menuPointSamplers: MenuInfo;
declare let menuPointTracks: MenuInfo;
declare let menuPointPercussion: MenuInfo;
declare let menuPointAutomation: MenuInfo;
declare function fillPluginsLists(): void;
declare function composeBaseMenu(): MenuInfo[];
declare class LeftPanel {
    leftLayer: TileLayerDefinition;
    leftZoomAnchors: TileAnchor[];
    constructor();
    createLeftPanel(): TileLayerDefinition[];
    reFillLeftPanel(): void;
}
declare class SamplerBar {
    constructor(barIdx: number, drumIdx: number, zoomLevel: number, anchor: TileAnchor, left: number);
}
declare class BarOctave {
    constructor(barIdx: number, octaveIdx: number, left: number, top: number, width: number, height: number, barOctaveGridAnchor: TileAnchor, barOctaveTrackAnchor: TileAnchor, barOctaveFirstAnchor: TileAnchor, zoomLevel: number);
}
declare class OctaveContent {
    constructor(barIdx: number, octaveIdx: number, left: number, top: number, width: number, height: number, barOctaveTrackAnchor: TileAnchor, barOctaveFirstAnchor: TileAnchor, zoomLevel: number);
    addUpperNotes(barIdx: number, octaveIdx: number, left: number, top: number, width: number, height: number, barOctaveAnchor: TileAnchor, zoomLevel: number): void;
    addOtherNotes(barIdx: number, octaveIdx: number, left: number, top: number, width: number, height: number, barOctaveAnchor: TileAnchor): void;
    addTrackNotes(track: Zvoog_MusicTrack, barIdx: number, octaveIdx: number, left: number, top: number, width: number, height: number, barOctaveAnchor: TileAnchor, css: string): void;
}
declare class MixerBar {
    octaves: BarOctave[];
    zoomLevel: number;
    constructor(barIdx: number, left: number, ww: number, zoomLevel: number, gridZoomBarAnchor: TileAnchor, tracksZoomBarAnchor: TileAnchor, firstZoomBarAnchor: TileAnchor);
    addOctaveGridSteps(barIdx: number, barLeft: number, width: number, barOctaveAnchor: TileAnchor, zIndex: number): void;
}
declare class TextComments {
    constructor(barIdx: number, barLeft: number, barOctaveAnchor: TileAnchor, zIndex: number);
}
declare class AutomationBarContent {
    constructor(barIdx: number, barLeft: number, barOctaveAnchor: TileAnchor, zIndex: number);
}
declare class MixerUI {
    gridLayers: TileLayerDefinition;
    trackLayers: TileLayerDefinition;
    firstLayers: TileLayerDefinition;
    fanLayer: TileLayerDefinition;
    fanSVGgroup: SVGElement;
    spearsLayer: TileLayerDefinition;
    levels: MixerZoomLevel[];
    fillerAnchor: TileAnchor;
    fanPane: FanPane;
    constructor();
    reFillMixerUI(): void;
    createMixerLayers(): TileLayerDefinition[];
    reFillSingleRatio(): void;
    reFillWholeRatio(): void;
    barTrackCount(bb: number): number;
    barDrumCount(bb: number): number;
    barAutoCount(bb: number): number;
    barCommentsCount(bb: number): number;
}
declare class MixerZoomLevel {
    zoomGridAnchor: TileAnchor;
    zoomTracksAnchor: TileAnchor;
    zoomFirstAnchor: TileAnchor;
    bars: MixerBar[];
    zoomLevelIndex: number;
    constructor(zoomLevel: number, anchorGrid: TileAnchor, anchorTracks: TileAnchor, anchorFirst: TileAnchor);
    reCreateBars(): void;
    addDrumLines(): void;
    addCommentLines(): void;
    addGridLines(barOctaveAnchor: TileAnchor): void;
}
declare class FanPane {
    filterIcons: FilterIcon[];
    autoIcons: FilterIcon[];
    performerIcons: PerformerIcon[];
    samplerIcons: SamplerIcon[];
    resetPlates(fanAnchors: TileAnchor[], spearsAnchors: TileAnchor[]): void;
    buildPerformerIcons(fanAnchor: TileAnchor, spearsAnchor: TileAnchor, zidx: number): void;
    buildSamplerIcons(fanAnchor: TileAnchor, spearsAnchor: TileAnchor, zidx: number): void;
    buildAutoIcons(fanAnchor: TileAnchor, spearsAnchor: TileAnchor, zidx: number): void;
    buildFilterIcons(fanAnchor: TileAnchor, spearsAnchor: TileAnchor, zidx: number): void;
    buildOutIcon(fanAnchor: TileAnchor, zidx: number): void;
}
declare class PerformerIcon {
    performerId: string;
    constructor(performerId: string);
    buildPerformerSpot(fanLevelAnchor: TileAnchor, spearsAnchor: TileAnchor, zidx: number): void;
    addPerformerSpot(audioSeq: Zvoog_AudioSequencer, fanLevelAnchor: TileAnchor, spearsAnchor: TileAnchor, zidx: number): void;
}
declare class SamplerIcon {
    samplerId: string;
    constructor(samplerId: string);
    buildSamplerSpot(fanLevelAnchor: TileAnchor, spearsAnchor: TileAnchor, zidx: number): void;
    addSamplerSpot(sampler: Zvoog_AudioSampler, fanLevelAnchor: TileAnchor, spearsAnchor: TileAnchor, zidx: number): void;
}
declare class FilterIcon {
    filterId: string;
    constructor(filterId: string);
    buildFilterSpot(fanLevelAnchor: TileAnchor, spearsAnchor: TileAnchor, zidx: number): void;
    addFilterSpot(filterTarget: Zvoog_FilterTarget, fanLevelAnchor: TileAnchor, spearsAnchor: TileAnchor, zidx: number): void;
    buildAutoSpot(fanLevelAnchor: TileAnchor, spearsAnchor: TileAnchor, zidx: number): void;
    addAutoSpot(filterTarget: Zvoog_FilterTarget, fanLevelAnchor: TileAnchor, spearsAnchor: TileAnchor, zidx: number): void;
}
declare class ControlConnection {
    addLineFlow(yy: number, ww: number, anchor: TileAnchor): void;
}
declare class SpearConnection {
    constructor();
    nonan(nn: number): number;
    addSpear(fromX: number, fromY: number, toSize: number, toX: number, toY: number, anchor: TileAnchor): void;
}
declare class FanOutputLine {
    addOutputs(outputs: string[], buttonsAnchor: TileAnchor, fanLinesAnchor: TileAnchor, fromID: string, fromX: number, fromY: number, zidx: number): void;
    addDeleteSpear(fromID: string, toID: string, fromX: number, fromY: number, toSize: number, toX: number, toY: number, anchor: TileAnchor, zidx: number): void;
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
declare let icon_blackfolder: string;
declare let icon_whitefolder: string;
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
declare let icon_close: string;
declare let icon_refresh: string;
declare let icon_search: string;
declare let icon_splitfan: string;
declare class DebugLayerUI {
    debugRectangle: TileRectangle;
    debugAnchor: TileAnchor;
    debugGroup: SVGElement;
    debugLayer: TileLayerDefinition;
    allLayers(): TileLayerDefinition[];
    setupUI(): void;
    resetDebugView(): void;
    deleteDebbugView(): void;
}
declare class WarningUI {
    warningRectangle: TileRectangle;
    warningAnchor: TileAnchor;
    warningGroup: SVGElement;
    warningLayer: TileLayerDefinition;
    warningIcon: TileText;
    warningInfo1: TileImage;
    warningInfo2: TileImage;
    warningInfo3: TileImage;
    warningInfo4: TileImage;
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
    pluginIconSize: number;
    speakerIconSize: number;
    speakerIconPad: number;
    padGridFan: number;
    constructor(data: Zvoog_Project);
    extractDifference(from: Zvoog_Project): Object;
    mergeDifference(diff: Object): void;
    wholeWidth(): number;
    fanWidth(): number;
    heightOfTitle(): number;
    timelineWidth(): number;
    wholeHeight(): number;
    automationMaxHeight(): number;
    commentsMaxHeight(): number;
    commentsAverageFillHeight(): number;
    gridTop(): number;
    gridHeight(): number;
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
    setCurrentPointPosition: (xyz: TileZoom) => void;
    getStartMouseScreen(): TilePoint;
    screen2view(screen: TilePoint): TilePoint;
    resetAnchor(parentSVGGroup: SVGElement, anchor: TileAnchor, layerMode: LevelModes): void;
    delayedResetAnchor(parentSVGGroup: SVGElement, anchor: TileAnchor, layerMode: LevelModes): void;
    setAfterResizeCallback(f: () => void): void;
    setAfterZoomCallback(f: () => void): void;
    resetInnerSize(inWidth: number, inHeight: number): void;
    initRun(svgObject: SVGElement, stickLeft: boolean, inWidth: number, inHeight: number, minZoom: number, curZoom: number, maxZoom: number, layers: TileLayerDefinition[]): void;
};
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
