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
    resetAnchor: (parentSVGGroup: SVGElement, anchor: TileAnchor, layerMode: LevelModes) => void;
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
    createToolbar(resetAnchor: (parentSVGGroup: SVGElement, anchor: TileAnchor, layerMode: LevelModes) => void, actionShowMenu: () => void): TileLayerDefinition[];
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
    changeTapSIze: (ratio: number) => void;
    resetAnchor: (parentSVGGroup: SVGElement, anchor: TileAnchor, layerMode: LevelModes) => void;
    resetAllAnchors(): void;
    createMenu(resetAnchor: (parentSVGGroup: SVGElement, anchor: TileAnchor, layerMode: LevelModes) => void, changeTapSIze: (ratio: number) => void): TileLayerDefinition[];
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
declare let testMenuData: MenuInfo[];
declare class BarOctave {
}
declare class MixerTrackUI {
    trackRectangle: TileRectangle;
    trackAnchor: TileAnchor;
    bars: TrackBarUI[];
    constructor(top: number, toAnchor: TileAnchor, data: MixerData);
    resetMainPitchedTrackUI(pitchedTrackData: PitchedTrack): void;
    resetOtherPitchedTrackUI(pitchedTrackData: PitchedTrack): void;
}
declare class TrackBarUI {
    barRectangle: TileRectangle;
    barAnchor: TileAnchor;
    constructor(left: number, top: number, ww: number, toAnchor: TileAnchor, data: MixerData);
}
declare class MixerUI {
    svgs: SVGElement[];
    zoomLayers: TileLayerDefinition[];
    zoomAnchors: TileAnchor[];
    levels: MixerLevel[];
    resetMixeUI(data: MixerData): void;
    buildMixerLayers(): TileLayerDefinition[];
}
declare class MixerLevel {
    minZoom: number;
    maxZoom: number;
    anchor: TileAnchor;
    bg: TileRectangle;
    prefix: string;
    constructor(prefix: string, minZoom: number, maxZoom: number, anchor: TileAnchor);
    build(ww: number, hh: number): void;
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
