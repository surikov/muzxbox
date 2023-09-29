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
declare function createTileLevel(): TileLevelBase;
declare type RenderedPart = {
    setupUI: () => void;
    resetUI: (data: MixerData) => void;
    deleteUI: () => void;
};
declare type RenderedLayers = RenderedPart & {
    allLayers: () => TileLayerDefinition[];
};
declare let zoomPrefixLevelsCSS: {
    prefix: string;
    zoom: number;
}[];
declare class UIRenderer implements RenderedPart {
    toolbar: UIToolbar;
    debug: RenderedLayers;
    tileRenderer: TileLevelBase;
    tileLevelSVG: SVGElement;
    setupUI(): void;
    resetUI(data: MixerData): void;
    deleteUI(): void;
}
declare class UIToolbar {
    setupToolbar(): void;
    resetToolbar(): void;
}
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
    mixerGroup: SVGElement;
    mixerAnchor: TileAnchor;
    layerAnchors: TileAnchor[];
    bgRectangles: TileRectangle[];
    mixerLayer: TileLayerDefinition;
    pitchedField: MixerTrackUI[];
    resetMixeUI(data: MixerData): void;
    buildDebugLayers(): TileLayerDefinition[];
}
declare class DebugLayerUI implements RenderedLayers {
    debugRectangle: TileRectangle;
    debugAnchor: TileAnchor;
    debugGroup: SVGElement;
    debugLayer: TileLayerDefinition;
    allLayers(): TileLayerDefinition[];
    setupUI(): void;
    resetUI(data: MixerData): void;
    deleteUI(): void;
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
