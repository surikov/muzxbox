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
declare function newMIDIparser(arrayBuffer: ArrayBuffer): any;
declare class CommandDispatcher {
    renderer: UIRenderer;
    audioContext: AudioContext;
    tapSizeRatio: number;
    listener: null | ((this: HTMLElement, event: HTMLElementEventMap['change']) => any);
    initAudioFromUI(): void;
    registerUI(renderer: UIRenderer): void;
    showRightMenu(): void;
    resetAnchor(parentSVGGroup: SVGElement, anchor: TileAnchor, layerMode: LevelModes): void;
    changeTapSize(ratio: number): void;
    resetProject(data: MZXBX_Project): void;
    promptImportFromMIDI(): void;
}
declare let commandDispatcher: CommandDispatcher;
declare let zoomPrefixLevelsCSS: {
    prefix: string;
    zoom: number;
}[];
declare class UIRenderer {
    toolbar: UIToolbar;
    menu: RightMenuPanel;
    mixer: MixerUI;
    debug: DebugLayerUI;
    warning: WarningUI;
    tiler: TileLevelBase;
    tileLevelSVG: SVGElement;
    constructor();
    changeTapSIze(ratio: number): void;
    createUI(): void;
    fillWholeUI(data: MZXBX_Project): void;
    onReSizeView(): void;
    deleteUI(): void;
}
declare let labelLocaleDictionary: string;
declare let localNameLocal: string;
declare let localeFontRatio: number;
declare let localMenuItemSettings: string;
declare let localeDictionary: {
    id: string;
    data: {
        locale: string;
        text: string;
    }[];
}[];
declare function setLocaleID(loname: string, ratio: number): void;
declare function LO(id: string): string;
declare class UIToolbar {
    toolBarAnchor: TileAnchor;
    toolBarGroup: SVGElement;
    toolBarLayer: TileLayerDefinition;
    playPauseButton: ToolBarButton;
    menuButton: ToolBarButton;
    headButton: ToolBarButton;
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
    randomString(nn: number): string;
    fillMenuItems(): void;
    setFocus(it: MenuInfo, infos: MenuInfo[]): void;
    setOpenState(state: boolean, it: MenuInfo, infos: MenuInfo[]): void;
    fillMenuItemChildren(pad: number, infos: MenuInfo[]): void;
    setThemeLocale(loc: string, ratio: number): void;
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
    barRightBorder: TileRectangle;
    octaveBottomBorder: TileRectangle;
    constructor(left: number, top: number, width: number, height: number, anchor: TileAnchor, zoomLevel: number);
}
declare class OctaveContent {
    constructor(aa: number, top: number, toAnchor: TileAnchor, data: MZXBX_Project);
}
declare class MixerBar {
    octaves: BarOctave[];
    anchor: TileAnchor;
    zoomLevel: number;
    constructor(left: number, top: number, ww: number, hh: number, zoomLevel: number, toAnchor: TileAnchor, data: MZXBX_Project);
}
declare class MixerUI {
    zoomLayer: TileLayerDefinition;
    levels: MixerZoomLevel[];
    reFillMixerUI(data: MZXBX_Project): void;
    createMixerLayers(): TileLayerDefinition[];
}
declare class MixerZoomLevel {
    zoomAnchor: TileAnchor;
    bars: MixerBar[];
    zoomLevelIndex: number;
    title: TileText;
    constructor(zoomLevel: number, anchor: TileAnchor);
    reCreateBars(data: MZXBX_Project, ww: number, hh: number): void;
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
declare let icon_warningPlay: string;
declare class DebugLayerUI {
    debugRectangle: TileRectangle;
    debugAnchor: TileAnchor;
    debugGroup: SVGElement;
    debugLayer: TileLayerDefinition;
    allLayers(): TileLayerDefinition[];
    setupUI(): void;
    resetDebugView(data: MZXBX_Project): void;
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
    resetDialogView(data: MZXBX_Project): void;
    resizeDialog(ww: number, hh: number): void;
    allLayers(): TileLayerDefinition[];
    showWarning(): void;
    hideWarning(): void;
}
declare let mzxbxProjectForTesting: MZXBX_Project;
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
declare class MixerDataMath {
    data: MZXBX_Project;
    titleHeight: number;
    constructor(data: MZXBX_Project);
    mixerWidth(): number;
    mixerHeight(): number;
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
    getStartMouseScreen(): TilePoint;
    screen2view(screen: TilePoint): TilePoint;
    resetAnchor(parentSVGGroup: SVGElement, anchor: TileAnchor, layerMode: LevelModes): void;
    delayedResetAnchor(parentSVGGroup: SVGElement, anchor: TileAnchor, layerMode: LevelModes): void;
    setAfterResizeCallback(f: () => void): void;
    setAfterZoomCallback(f: () => void): void;
    resetInnerSize(inWidth: number, inHeight: number): void;
    initRun(svgObject: SVGElement, stickLeft: boolean, inWidth: number, inHeight: number, minZoom: number, curZoom: number, maxZoom: number, layers: TileLayerDefinition[]): void;
};
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
declare type MZXBX_Theme = {
    widthDurationRatio: number;
    notePathHeight: number;
    octaveCount: number;
};
declare type MZXBX_Project = {
    title: string;
    timeline: MZXBX_SongMeasure[];
    tracks: MZXBX_MusicTrack[];
    percussions: MZXBX_PercussionTrack[];
    comments: MZXBX_CommentMeasure[];
    filters: MZXBX_AudioFilter[];
    theme: MZXBX_Theme;
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
declare function MZXBX_waitForCondition(sleepMs: number, isDone: () => boolean, onFinish: () => void): void;
declare function MZXBX_loadCachedBuffer(audioContext: AudioContext, path: string, onDone: (cachedWave: MZXBX_CachedWave) => void): void;
declare function MZXBX_appendScriptURL(url: string): boolean;
declare function MZMM(): MZXBX_MetreMathType;
