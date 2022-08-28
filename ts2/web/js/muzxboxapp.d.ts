declare class MuzXBoxApplication {
    constructor();
    initAll(): void;
    bindLayers(): void;
}
declare class SongUI {
}
declare class FocusManager {
}
declare class TileLevel {
    svg: SVGElement;
    tapSize: number;
    twoZoom: boolean;
    clickLimit: number;
    svgns: string;
    viewWidth: number;
    viewHeight: number;
    innerWidth: number;
    innerHeight: number;
    _translateX: number;
    _translateY: number;
    _translateZ: number;
    startMouseScreenX: number;
    startMouseScreenY: number;
    clickX: number;
    clickY: number;
    dragZoom: number;
    _allTilesOK: boolean;
    clicked: boolean;
    mx: number;
    mn: number;
    startedTouch: boolean;
    twodistance: number;
    twocenter: TilePoint;
    model: TileModelLayer[];
    slidingLockTo: number;
    slidingID: number;
    onResizeDo: CannyDo;
    onZoom: CannyDo;
    afterZoomCallback: () => void;
    afterResizeCallback: () => void;
    lastTickTime: number;
    fastenUp: boolean;
    fastenDown: boolean;
    fastenLeft: boolean;
    fastenRight: boolean;
    lastMoveDx: number;
    lastMoveDy: number;
    mouseDownMode: boolean;
    allTilesOK: boolean;
    translateZ: number;
    translateX: number;
    translateY: number;
    constructor(svgObject: SVGElement, inWidth: number, inHeight: number, minZoom: number, curZoom: number, maxZoom: number, layers: TileModelLayer[]);
    dump(): void;
    setupTapSize(baseSize: number): void;
    onAfterResize(): void;
    onMove(dx: number, dy: number): void;
    moveTail(speed: number): void;
    rakeMouseWheel(e: WheelEvent): boolean;
    rakeMouseDown(mouseEvent: MouseEvent): void;
    rakeMouseMove(mouseEvent: MouseEvent): void;
    rakeMouseUp(mouseEvent: MouseEvent): void;
    rakeTouchStart(touchEvent: TouchEvent): void;
    rakeTouchMove(touchEvent: TouchEvent): void;
    rakeTouchEnd(touchEvent: TouchEvent): void;
    startDragZoom(): void;
    cancelDragZoom(): void;
    applyZoomPosition(): void;
    checkAfterZoom(): void;
    slideToContentPosition(): void;
    maxZoom(): number;
    minZoom(): number;
    adjustContentPosition(): void;
    calculateValidContentPosition(): TileZoom;
    startTouchZoom(touchEvent: TouchEvent): void;
    vectorFromTouch(touch: Touch): TilePoint;
    vectorFindCenter(xy1: TilePoint, xy2: TilePoint): TilePoint;
    vectorAdd(xy1: TilePoint, xy2: TilePoint): TilePoint;
    vectorScale(xy: TilePoint, coef: number): TilePoint;
    vectorDistance(xy1: TilePoint, xy2: TilePoint): number;
    vectorNorm(xy: TilePoint): number;
    vectorSubstract(xy1: TilePoint, xy2: TilePoint): TilePoint;
    vectorNormSquared(xy: TilePoint): number;
    startSlideCenter(x: number, y: number, z: number, w: number, h: number, action: () => void): void;
    startSlideTo(x: number, y: number, z: number, action: (() => void) | null): void;
    startStepSlideTo(s: number, x: number, y: number, z: number, action: (() => void) | null): void;
    stepSlideTo(key: number, xyz: TileZoom[], action: (() => void) | null): void;
    queueTiles(): void;
    clearUselessDetails(): void;
    clearUselessGroups(group: SVGElement, layer: TileLayerDefinition): void;
    msEdgeHook(g: SVGElement): void;
    outOfWatch(g: TileSVGElement, x: number, y: number, w: number, h: number): boolean;
    collision(x1: number, y1: number, w1: number, h1: number, x2: number, y2: number, w2: number, h2: number): boolean;
    collision2(x: number, w: number, left: number, width: number): boolean;
    tileFromModel(): void;
    addGroupTile(parentSVGElement: SVGElement, anchor: TileAnchor, layer: TileLayerDefinition): void;
    groupChildWithID(group: SVGElement, id: string): SVGElement | null;
    addElement(g: SVGElement, dd: TileItem, layer: TileLayerDefinition): void;
    clearAllDetails(): void;
    clearGroupDetails(group: SVGElement): void;
    autoID(definition: (TileAnchor | TileRectangle | TileText | TilePath | TileLine | TilePolygon)[]): void;
    setModel(layers: TileModelLayer[]): void;
    resetModelAndRun(afterDone: () => void): void;
    resetModel(): void;
    resetAnchor(anchor: TileAnchor, fromSVGGroup: SVGElement): void;
    redrawAnchor(anchor: TileAnchor): boolean;
    removeFromTree(anchor: TileAnchor, parentSVG: SVGElement, layer: TileLayerDefinition): boolean;
    startLoop(): void;
    tick(): void;
}
declare class CannyDo {
    currentID: number;
    start(ms: number, action: () => void): void;
}
declare type TileZoom = {
    x: number;
    y: number;
    z: number;
};
declare type TilePoint = {
    x: number;
    y: number;
};
declare type TileModelLayer = {
    g: SVGElement;
    anchors: TileAnchor[];
};
declare type TileLayerStickLeft = {
    stickLeft: number;
} & TileModelLayer;
declare type TileLayerStickTop = {
    stickTop: number;
} & TileModelLayer;
declare type TileLayerStickBottom = {
    stickBottom: number;
} & TileModelLayer;
declare type TileLayerStickRight = {
    stickRight: number;
} & TileModelLayer;
declare type TileLayerOverlay = {
    overlay: number;
} & TileModelLayer;
declare type TileBaseDefinition = {
    id?: string;
    css?: string;
    action?: (x: number, y: number) => void | undefined;
};
declare type TileLayerDefinition = TileModelLayer | TileLayerStickLeft | TileLayerStickTop | TileLayerStickBottom | TileLayerStickRight | TileLayerOverlay;
declare type TileItem = TileAnchor | TileRectangle | TileText | TilePath | TileLine | TilePolygon;
declare type TileAnchor = {
    xx: number;
    yy: number;
    ww: number;
    hh: number;
    showZoom: number;
    hideZoom: number;
    content: TileItem[];
} & TileBaseDefinition;
declare function TAnchor(xx: number, yy: number, ww: number, hh: number, showZoom: number, hideZoom: number, id?: string): TileAnchor;
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
declare function cloneBaseDefiition(from: TileBaseDefinition): TileBaseDefinition;
declare function cloneLine(from: TileLine): TileLine;
declare function cloneRectangle(from: TileRectangle): TileRectangle;
declare function tilePolygon(svgns: string, tapSize: number, g: SVGElement, x: number, y: number, z: number | undefined, dots: number[], cssClass: string | undefined): TileSVGElement;
declare function tilePath(svgns: string, tapSize: number, g: SVGElement, x: number, y: number, z: number, data: string, cssClass: string): TileSVGElement;
declare function tileRectangle(svgns: string, tapSize: number, g: SVGElement, x: number, y: number, w: number, h: number, rx: number | undefined, ry: number | undefined, cssClass: string): TileSVGElement;
declare function tileLine(svgns: string, tapSize: number, g: SVGElement, x1: number, y1: number, x2: number, y2: number, cssClass: string | undefined): TileSVGElement;
declare function tileText(svgns: string, tapSize: number, g: SVGElement, x: number, y: number, html: string, cssClass: string): TileSVGElement;
declare function anchor(xx: number, yy: number, ww: number, hh: number, showZoom: number, hideZoom: number): TileAnchor;
declare function rectangle(x: number, y: number, w: number, h: number, rx?: number, ry?: number, css?: string): TileRectangle;
declare function actionRectangle(action: (x: number, y: number) => void | undefined, x: number, y: number, w: number, h: number, rx?: number, ry?: number, css?: string): TileRectangle;
declare function line(x1: number, y1: number, x2: number, y2: number, css?: string): TileLine;
declare function text(x: number, y: number, text: string, css?: string): TileText;
declare function pathImage(x: number, y: number, scale: number, points: string, css?: string): TilePath;
declare function isLayerStickTop(t: TileLayerDefinition): t is TileLayerStickTop;
declare function isLayerStickBottom(t: TileLayerDefinition): t is TileLayerStickBottom;
declare function isLayerStickRight(t: TileLayerDefinition): t is TileLayerStickRight;
declare function isLayerOverlay(t: TileLayerDefinition): t is TileLayerOverlay;
declare function isTilePath(t: TileItem): t is TilePath;
declare function isTileText(t: TileItem): t is TileText;
declare function isTileLine(t: TileItem): t is TileLine;
declare function isTilePolygon(t: TileItem): t is TilePolygon;
declare function isLayerStickLeft(t: TileLayerDefinition): t is TileLayerStickLeft;
declare function isTileRectangle(t: TileItem): t is TileRectangle;
declare function isTileGroup(t: TileItem): t is TileAnchor;
declare function isLayerNormal(t: TileLayerDefinition): t is TileModelLayer;
declare function rid(): string;
declare function nonEmptyID(id?: string): string;
declare type ZvoogMeter = {
    count: number;
    division: number;
};
declare type ZvoogStepIndex = {
    measure: number;
    step: number;
};
declare function point2seconds(song: ZvoogSchedule, point: ZvoogCurvePoint): number;
declare function points2meter(points: ZvoogCurvePoint[]): ZvoogCurvePoint;
declare function meter2seconds(bpm: number, meter: ZvoogMeter): number;
declare function seconds2meterRound(bpm: number, seconds: number): ZvoogMeter;
declare function calculateEnvelopeDuration(envelope: ZvoogEnvelope): ZvoogMeter;
declare function DUU(u: ZvoogMeter): DurationUnitUtil;
declare class DurationUnitUtil {
    _unit: ZvoogMeter;
    constructor(u: ZvoogMeter);
    clone(): ZvoogMeter;
    plus(b: ZvoogMeter): ZvoogMeter;
    minus(b: ZvoogMeter): ZvoogMeter;
    _meterMore(b: ZvoogMeter): number;
    moreThen(b: ZvoogMeter): boolean;
    notMoreThen(b: ZvoogMeter): boolean;
    lessThen(b: ZvoogMeter): boolean;
    notLessThen(b: ZvoogMeter): boolean;
    equalsTo(b: ZvoogMeter): boolean;
    simplify(): ZvoogMeter;
}
declare type ZvoogCurvePoint = {
    skipMeasures: number;
    skipSteps: ZvoogMeter;
    velocity: number;
};
declare type ZvoogMeasure = {
    meter: ZvoogMeter;
    tempo: number;
    points: ZvoogMeasurePoint[];
};
declare type ZvoogParameterData = {
    points: ZvoogCurvePoint[];
    caption: string;
    focus?: boolean;
};
declare type ZvoogTrackVoice = {
    filters: ZvoogFilterSetting[];
    title: string;
    focus?: boolean;
};
declare type ZvoogInstrumentVoice = ZvoogTrackVoice & {
    instrumentSetting: ZvoogInstrumentSetting;
    measureChords: ZvoogChordsInMeasure[];
};
declare type ZvoogPercussionVoice = ZvoogTrackVoice & {
    percussionSetting: ZvoogPercussionSetting;
    measureBunches: ZvoogBunchesInMeasure[];
};
declare type ZvoogChordsInMeasure = {
    chords: ZvoogChordStrings[];
};
declare type ZvoogBunchesInMeasure = {
    bunches: ZvoogChordPoint[];
};
declare type ZvoogMeasurePoint = {
    when: ZvoogMeter;
    lyrics: string;
};
declare type ZvoogChordPoint = {
    when: ZvoogMeter;
};
declare type ZvoogChordStrings = ZvoogChordPoint & {
    envelopes: ZvoogEnvelope[];
    variation: number;
};
declare type ZvoogEnvelope = {
    pitches: ZvoogPitch[];
};
declare type ZvoogPitch = {
    duration: ZvoogMeter;
    pitch: number;
};
declare type ZvoogModeStep = {
    step: number;
    halfTones: number;
    shift: number;
    octave: number;
};
declare type ZvoogStrumPattern = {
    directions: string;
};
declare type ZvoogKeyPattern = {
    octaves: string;
};
declare type ZvoogStringPattern = {
    strings: string[] | null;
};
declare type ZvoogChordMelody = {
    duration: ZvoogMeter;
    chord: string;
};
declare type ZvoogProgression = {
    tone: string;
    mode: string;
    progression: ZvoogChordMelody[];
};
declare type ZvoogFretKeys = {
    pitch: number;
    name: string;
    frets: number[];
};
declare type ZvoogStepHalfTone = {
    step: number;
    halftone: number;
};
declare type ZvoogChordPitches = {
    name: string;
    pitches: ZvoogStepHalfTone[];
};
declare type IntervalMode = {
    name: string;
    steps: number[];
    flat: boolean;
    priority: number;
};
declare type ZvoogTrack = {
    title: string;
    instruments: ZvoogInstrumentVoice[];
    percussions: ZvoogPercussionVoice[];
    filters: ZvoogFilterSetting[];
    focus?: boolean;
};
declare type ZvoogSchedule = {
    title: string;
    tracks: ZvoogTrack[];
    filters: ZvoogFilterSetting[];
    measures: ZvoogMeasure[];
    harmony: ZvoogProgression;
    rhythm?: ZvoogMeter[];
};
declare function scheduleSecondsDuration(song: ZvoogSchedule): number;
declare let defaultEmptySchedule: ZvoogSchedule;
declare type ZvoogFilterSetting = ZvoogAudioPerformerSetting & {
    filterPlugin: ZvoogFilterPlugin | null;
};
declare type ZvoogAudioPerformerSetting = {
    parameters: ZvoogParameterData[];
    kind: string;
    initial: string;
    focus?: boolean;
};
declare type ZvoogInstrumentSetting = ZvoogAudioPerformerSetting & {
    instrumentPlugin: ZvoogInstrumentPlugin | null;
};
declare type ZvoogPercussionSetting = ZvoogAudioPerformerSetting & {
    percussionPlugin: ZvoogPercussionPlugin | null;
};
declare type ZvoogFilterPlugin = ZvoogPlugin & {
    getInput: () => AudioNode;
};
declare type ZvoogAudioPerformerPlugin = ZvoogPlugin & {
    cancelSchedule: () => void;
};
declare type ZvoogInstrumentPlugin = ZvoogAudioPerformerPlugin & {
    scheduleChord: (when: number, tempo: number, envelopes: ZvoogEnvelope[], variation: number) => void;
};
declare type ZvoogPercussionPlugin = ZvoogAudioPerformerPlugin & {
    scheduleHit: (when: number) => void;
};
declare class ZvoogPluginLock {
    lockedState: boolean;
    lock(): void;
    unlock(): void;
    locked(): boolean;
}
interface ZvoogPluginParameter {
    cancelScheduledValues(cancelTime: number): void;
    linearRampToValueAtTime(value: number, endTime: number): void;
    setValueAtTime(value: number, startTime: number): void;
}
declare class RangedAudioParam120 implements ZvoogPluginParameter {
    baseParam: ZvoogPluginParameter;
    minValue: number;
    maxValue: number;
    constructor(base: ZvoogPluginParameter, min: number, max: number);
    recalulate(value: number): number;
    cancelScheduledValues(cancelTime: number): void;
    linearRampToValueAtTime(value: number, endTime: number): void;
    setValueAtTime(value: number, startTime: number): void;
}
interface ZvoogPlugin {
    getParams(): ZvoogPluginParameter[];
    getParId(nn: number): string | null;
    getOutput(): AudioNode;
    prepare(audioContext: AudioContext, data: string): void;
    busy(): number;
    state(): ZvoogPluginLock;
}
