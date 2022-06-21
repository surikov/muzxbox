declare class ZInputDeviceHandler {
    muzXBox: MuzXBox;
    constructor(from: MuzXBox);
    bindEvents(): void;
    processKeyboardEvent(keyboardEvent: KeyboardEvent): void;
    processKeyX(): void;
    processKeyY(): void;
    processKeyA(): void;
    processKeyB(): void;
    processAnyPlus(): void;
    processAnyMinus(): void;
    processArrowLeft(): void;
    processArrowRight(): void;
    processArrowUp(): void;
    processArrowDown(): void;
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
    get allTilesOK(): boolean;
    set allTilesOK(bb: boolean);
    get translateZ(): number;
    set translateZ(z: number);
    get translateX(): number;
    set translateX(x: number);
    get translateY(): number;
    set translateY(y: number);
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
declare function TAnchor(xx: number, yy: number, ww: number, hh: number, showZoom: number, hideZoom: number): TileAnchor;
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
declare class ZRender {
    tileLevel: TileLevel;
    layers: TileLayerDefinition[];
    zoomMin: number;
    zoomNote: number;
    zoomMeasure: number;
    zoomSong: number;
    zoomFar: number;
    zoomBig: number;
    zoomMax: number;
    secondWidthInTaps: number;
    pitchLineThicknessInTaps: number;
    sizeRatio: number;
    rhythmPatternDefault: ZvoogMeter[];
    measureInfoRenderer: MeasureInfoRenderer;
    pianoRollRenderer: PianoRollRenderer;
    gridRenderer: GridRenderer;
    timeLineRenderer: TimeLineRenderer;
    leftKeysRenderer: LeftKeysRenderer;
    focusManager: FocusManagement;
    debugLayerGroup: SVGElement;
    debugAnchor0: TileAnchor;
    debugAnchor1: TileAnchor;
    debugAnchor4: TileAnchor;
    debugAnchor16: TileAnchor;
    debugAnchor64: TileAnchor;
    debugAnchor256: TileAnchor;
    muzXBox: MuzXBox;
    constructor(bx: MuzXBox);
    bindLayers(): void;
    zToLOD(zz: number): number;
    resetLabel(song: ZvoogSchedule): void;
    levelOfDetails(zz: number): 1 | 16 | 64 | 256 | 4;
    initUI(bx: MuzXBox): void;
    initDebugAnchors(): void;
    clearResizeSingleAnchor(song: ZvoogSchedule, anchor: TileAnchor, wholeWidth: number): void;
    clearAnchorsContent(song: ZvoogSchedule, wholeWidth: number, wholeHeight: number): void;
    drawSchedule(song: ZvoogSchedule): void;
}
declare type ZUIModeValue = {
    mode: string;
    txt: string;
    id: string;
};
declare class ZUserSetting {
    mode: string;
    texts: ZUIModeValue[];
    constructor();
    fillModeValues(): void;
    selectMode(mode: string): void;
    txt(id: string): string;
}
declare type StartDuration = {
    start: number;
    duration: number;
};
declare function countMeasureSteps(meter: ZvoogMeter, rhythm: ZvoogMeter[]): number;
declare function countSteps(meter: ZvoogMeter, rhythmPattern: ZvoogMeter[]): number;
declare function findMeasureStep(measures: ZvoogMeasure[], rhythmPattern: ZvoogMeter[], ratioDuration: number, xx: number): null | ZvoogStepIndex;
declare function measuresAndStepDuration(song: ZvoogSchedule, count: number, step: number, rhythmPattern: ZvoogMeter[]): StartDuration;
declare function progressionDuration(progression: ZvoogChordMelody[]): ZvoogMeter;
declare function adjustPartLeadPad(voice: ZvoogInstrumentVoice, fromPosition: ZvoogMeter, toPosition: ZvoogMeter, measures: ZvoogMeasure[]): void;
declare function adjustPartBass(voice: ZvoogInstrumentVoice, fromPosition: ZvoogMeter, toPosition: ZvoogMeter, measures: ZvoogMeasure[]): void;
declare function createBreakList(originalProg: ZvoogChordMelody[], targetProg: ZvoogChordMelody[], measures: ZvoogMeasure[]): ZvoogMeter[];
declare function adjustVoiceLowHigh(voice: ZvoogInstrumentVoice, originalProg: ZvoogChordMelody[], targetProg: ZvoogChordMelody[], measures: ZvoogMeasure[], trackIsBass: boolean): void;
declare let default8rhytym: ZvoogMeter[];
declare type ZvoogStoreListItem = {
    title: string;
    isFolder: boolean;
};
declare type ZvoogStoreDoneEvent = {};
interface ZvoogStore {
    list(onFinish: (items: ZvoogStoreListItem[]) => void): void;
    goFolder(title: string, onFinish: (error: string) => void): void;
    goUp(onFinish: (error: string) => void): void;
    readSongData(title: string, onFinish: (result: ZvoogSchedule | null) => void): void;
    createSongData(title: string, schedule: ZvoogSchedule, onFinish: (error: string) => void): void;
    updateSongData(title: string, schedule: ZvoogSchedule, onFinish: (error: string) => void): void;
    deleteSongData(title: string, onFinish: (error: string) => void): void;
    renameSongData(title: string, newTitle: string, onFinish: (error: string) => void): void;
    createFolder(title: string, onFinish: (error: string) => void): void;
    deleteFolder(title: string, onFinish: (error: string) => void): void;
    renameFolder(title: string, newTitle: string, onFinish: (error: string) => void): void;
}
declare class ZvoogFxGain implements ZvoogFilterPlugin {
    base: GainNode;
    params: ZvoogPluginParameter[];
    lockedState: ZvoogPluginLock;
    state(): ZvoogPluginLock;
    prepare(audioContext: AudioContext, data: string): void;
    getInput(): AudioNode;
    getOutput(): AudioNode;
    getParams(): ZvoogPluginParameter[];
    busy(): number;
    getParId(nn: number): string | null;
}
declare class WAFEcho implements ZvoogFilterPlugin {
    inpt: GainNode;
    outpt: GainNode;
    rvrbrtr: any;
    params: ZvoogPluginParameter[];
    lockedState: ZvoogPluginLock;
    state(): ZvoogPluginLock;
    setData(data: string): void;
    prepare(audioContext: AudioContext, data: string): void;
    getParId(nn: number): string | null;
    getInput(): AudioNode;
    getOutput(): AudioNode;
    getParams(): ZvoogPluginParameter[];
    busy(): number;
    initWAF(): void;
}
declare class WAFEqualizer implements ZvoogFilterPlugin {
    inpt: GainNode;
    outpt: GainNode;
    chnl: any;
    params: ZvoogPluginParameter[];
    lockedState: ZvoogPluginLock;
    state(): ZvoogPluginLock;
    prepare(audioContext: AudioContext, data: string): void;
    getInput(): AudioNode;
    getOutput(): AudioNode;
    getParams(): ZvoogPluginParameter[];
    busy(): number;
    initWAF(): void;
    getParId(nn: number): string | null;
}
declare class ZvoogSineSource implements ZvoogInstrumentPlugin {
    out: GainNode;
    params: ZvoogPluginParameter[];
    audioContext: AudioContext;
    poll: {
        node: OscillatorNode;
        end: number;
    }[];
    lockedState: ZvoogPluginLock;
    state(): ZvoogPluginLock;
    prepare(audioContext: AudioContext, data: string): void;
    getOutput(): AudioNode;
    getParams(): ZvoogPluginParameter[];
    cancelSchedule(): void;
    scheduleChord(when: number, tempo: number, chord: ZvoogEnvelope[], variation: number): void;
    sendLine(when: number, tempo: number, line: ZvoogEnvelope): void;
    busy(): number;
    freq(key: number): number;
    nextClear(): boolean;
    cleanup(): void;
    getParId(nn: number): string | null;
}
declare function WebAudioFontPlayer(): void;
declare class WAFInsSource implements ZvoogInstrumentPlugin {
    out: GainNode;
    params: ZvoogPluginParameter[];
    audioContext: AudioContext;
    poll: {
        node: OscillatorNode;
        end: number;
    }[];
    ins: number;
    zones: any;
    lockedState: ZvoogPluginLock;
    state(): ZvoogPluginLock;
    cancelSchedule(): void;
    scheduleChord(when: number, tempo: number, chord: ZvoogEnvelope[], variation: number): void;
    prepare(audioContext: AudioContext, data: string): void;
    getOutput(): AudioNode;
    getParams(): ZvoogPluginParameter[];
    busy(): number;
    initWAF(): void;
    selectIns(nn: number): void;
    getParId(nn: number): string | null;
}
declare function WebAudioFontPlayer(): void;
declare class WAFPercSource implements ZvoogPercussionPlugin {
    out: GainNode;
    params: ZvoogPluginParameter[];
    audioContext: AudioContext;
    poll: {
        node: OscillatorNode;
        end: number;
    }[];
    ins: number;
    zones: any;
    lockedState: ZvoogPluginLock;
    state(): ZvoogPluginLock;
    cancelSchedule(): void;
    scheduleHit(when: number): void;
    prepare(audioContext: AudioContext, data: string): void;
    getOutput(): AudioNode;
    getParams(): ZvoogPluginParameter[];
    busy(): number;
    initWAF(): void;
    selectDrum(nn: number): void;
    getParId(nn: number): string | null;
}
declare class AudioFileSource implements ZvoogPercussionPlugin {
    out: GainNode;
    params: ZvoogPluginParameter[];
    audioContext: AudioContext;
    rawData: Uint8Array;
    buffer: AudioBuffer;
    waves: {
        audio: AudioBufferSourceNode;
        end: number;
    }[];
    envelopes: {
        when: number;
        duration: number;
        base: GainNode;
    }[];
    afterTime: number;
    lockedState: ZvoogPluginLock;
    state(): ZvoogPluginLock;
    setData(base64file: string): void;
    prepare(audioContext: AudioContext, data: string): void;
    getOutput(): AudioNode;
    getParams(): ZvoogPluginParameter[];
    cancelSchedule(): void;
    scheduleHit(when: number): void;
    busy(): number;
    nextClear(): boolean;
    cleanup(): void;
    findEnvelope(when: number, duration: number): {
        when: number;
        duration: number;
        base: GainNode;
    };
    hit(when: number): void;
    getParId(nn: number): string | null;
}
declare type ZvoogMeter = {
    count: number;
    division: number;
};
declare type ZvoogStepIndex = {
    measure: number;
    step: number;
};
declare function meter2seconds(bpm: number, meter: ZvoogMeter): number;
declare function seconds2meter32(bpm: number, seconds: number): ZvoogMeter;
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
    skip384: number;
    velocity: number;
};
declare type ZvoogMeasure = {
    meter: ZvoogMeter;
    tempo: number;
    points: ZvoogMeasurePoint[];
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
declare class ZvoogPerformerStub implements ZvoogInstrumentPlugin, ZvoogPercussionPlugin {
    base: GainNode;
    params: ZvoogPluginParameter[];
    lockedState: ZvoogPluginLock;
    setData(data: string): void;
    state(): ZvoogPluginLock;
    prepare(audioContext: AudioContext): void;
    getOutput(): AudioNode;
    getParams(): ZvoogPluginParameter[];
    busy(): number;
    cancelSchedule(): void;
    scheduleChord(when: number, tempo: number, chord: ZvoogEnvelope[], variation: number): void;
    scheduleHit(when: number): void;
    getParId(nn: number): string | null;
}
declare class ZvoogFilterStub implements ZvoogFilterPlugin {
    base: GainNode;
    params: ZvoogPluginParameter[];
    lockedState: ZvoogPluginLock;
    setData(data: string): void;
    state(): ZvoogPluginLock;
    prepare(audioContext: AudioContext): void;
    getOutput(): AudioNode;
    getParams(): ZvoogPluginParameter[];
    busy(): number;
    getInput(): AudioNode;
    getParId(nn: number): string | null;
}
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
declare function gridWidthTp(song: ZvoogSchedule, ratioDuration: number): number;
declare function wholeWidthTp(song: ZvoogSchedule, ratioDuration: number): number;
declare function gridHeightTp(ratioThickness: number): number;
declare function drumRowsCount(song: ZvoogSchedule): number;
declare function topGridMarginTp(song: ZvoogSchedule, pitchLineThicknessInTaps: number): number;
declare function wholeHeightTp(song: ZvoogSchedule, ratioThickness: number): number;
declare type ZvoogFilterSetting = {
    filterPlugin: ZvoogFilterPlugin | null;
    parameters: ZvoogParameterData[];
    kind: string;
    initial: string;
    focus?: boolean;
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
declare let cachedPerformerStubPlugins: ZvoogPerformerStub[];
declare function takeZvoogInstrumentStub(): ZvoogPerformerStub;
declare function takeZvoogPercussionStub(): ZvoogPerformerStub;
declare let cachedFilterStubPlugins: ZvoogFilterStub[];
declare function takeZvoogFilterStub(): ZvoogFilterStub;
declare let cachedWAFEchoPlugins: WAFEcho[];
declare function takeWAFEcho(): WAFEcho;
declare let cachedWAFEqualizerPlugins: WAFEqualizer[];
declare function takeWAFEqualizer(): WAFEqualizer;
declare let cachedZvoogFxGainPlugins: ZvoogFxGain[];
declare function takeZvoogFxGain(): ZvoogFxGain;
declare let cachedAudioFileSourcePlugins: AudioFileSource[];
declare function takeAudioFileSource(): AudioFileSource;
declare let cachedWAFInsSourcePlugins: WAFInsSource[];
declare function takeWAFInsSource(): WAFInsSource;
declare let cachedWAFPercSourcePlugins: WAFPercSource[];
declare function takeWAFPercSource(): WAFPercSource;
declare let cachedZvoogSineSourcePlugins: ZvoogSineSource[];
declare function takeZvoogSineSource(): ZvoogSineSource;
declare function createPluginEffect(id: string): ZvoogFilterPlugin;
declare function createPluginInstrument(id: string): ZvoogInstrumentPlugin;
declare function createPluginPercussion(id: string): ZvoogPercussionPlugin;
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
    trackNum?: number;
    text?: string;
};
declare type MIDISongPoint = {
    pitch: number;
    durationms: number;
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
    instrument: string;
    program: number;
    volumes: {
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
declare class MIDIFileImporter implements ZvoogStore {
    list(onFinish: (items: ZvoogStoreListItem[]) => void): void;
    goFolder(title: string, onFinish: (error: string) => void): void;
    goUp(onFinish: (error: string) => void): void;
    readSongData(title: string, onFinish: (result: ZvoogSchedule | null) => void): void;
    createSongData(title: string, schedule: ZvoogSchedule, onFinish: (error: string) => void): void;
    updateSongData(title: string, schedule: ZvoogSchedule, onFinish: (error: string) => void): void;
    deleteSongData(title: string, onFinish: (error: string) => void): void;
    renameSongData(title: string, newTitle: string, onFinish: (error: string) => void): void;
    createFolder(title: string, onFinish: (error: string) => void): void;
    deleteFolder(title: string, onFinish: (error: string) => void): void;
    renameFolder(title: string, newTitle: string, onFinish: (error: string) => void): void;
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
    volumes: {
        ms: number;
        value: number;
    }[];
    chords: TrackChord[];
    constructor(buffer: ArrayBuffer, start: number);
}
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
    simplify(): void;
    dumpResolutionChanges(): void;
    lastResolution(ms: number): number;
    parseTicks2time(track: MIDIFileTrack): void;
    parseNotes(): void;
    nextEvent(stream: DataViewStream): MIDIEvent;
    parseTrackEvents(track: MIDIFileTrack): void;
    parametersDefs(plugin: ZvoogPlugin): ZvoogParameterData[];
    convert(): ZvoogSchedule;
    findOrCreateTrack(trackNum: number, channelNum: number, trackChannel: {
        trackNum: number;
        channelNum: number;
        track: MIDISongTrack;
    }[]): {
        trackNum: number;
        channelNum: number;
        track: MIDISongTrack;
    };
    dump(): MIDISongData;
}
declare class MusicXMLFileImporter implements ZvoogStore {
    list(onFinish: (items: ZvoogStoreListItem[]) => void): void;
    goFolder(title: string, onFinish: (error: string) => void): void;
    goUp(onFinish: (error: string) => void): void;
    readSongData(title: string, onFinish: (result: ZvoogSchedule | null) => void): void;
    takeChord(songVoice: ZvoogInstrumentVoice, measureIdx: number, when: ZvoogMeter): ZvoogChordStrings;
    takeVoice(voiceid: string, songtrack: ZvoogTrack): ZvoogInstrumentVoice;
    parsePitch(step: string, octave: string, alter: string): number;
    parseMXML(mxml: XV): ZvoogSchedule;
    createSongData(title: string, schedule: ZvoogSchedule, onFinish: (error: string) => void): void;
    updateSongData(title: string, schedule: ZvoogSchedule, onFinish: (error: string) => void): void;
    deleteSongData(title: string, onFinish: (error: string) => void): void;
    renameSongData(title: string, newTitle: string, onFinish: (error: string) => void): void;
    createFolder(title: string, onFinish: (error: string) => void): void;
    deleteFolder(title: string, onFinish: (error: string) => void): void;
    renameFolder(title: string, newTitle: string, onFinish: (error: string) => void): void;
}
declare class XV {
    name: string;
    value: string;
    content: XV[];
    constructor(name: string, value: string, children: XV[]);
    clone(): XV;
    first(name: string): XV;
    exists(name: string): boolean;
    every(name: string): XV[];
    seek(name: string, subname: string, subvalue: string): XV;
    readDocChildren(node: any): XV[];
    fill(document: Document): void;
}
declare type ZMenuItem = {
    label: string;
    action: () => void;
    autoclose: boolean;
    icon: string;
};
declare type ZMenuFolder = {
    path: string;
    icon: string;
    folders: ZMenuFolder[];
    items: ZMenuItem[];
    afterOpen: () => void;
};
declare class ZMainMenu {
    muzXBox: MuzXBox;
    layerSelector: LayerSelector;
    currentLevel: number;
    menuRoot: ZMenuFolder;
    panels: SingleMenuPanel[];
    songFolder: ZMenuFolder;
    constructor(from: MuzXBox);
    openNextLevel(): void;
    backPreLevel(): void;
    hideMenu(): void;
    moveSelection(level: number, row: number): void;
    createFolderClick(idx: number): () => void;
    createActionClick(nn: number, item: ZMenuItem): () => void;
    reFillMenulevel(menuContent: HTMLElement, subRoot: ZMenuFolder, selectedLevel: number): void;
    open_nn_level(nn: number): void;
    reBuildMenu(): void;
    fillSongMenuFrom(prj: ZvoogSchedule): void;
}
declare class SingleMenuPanel {
    levelStyle: CSSStyleDeclaration;
    menuTextHead: HTMLElement;
    menuContent: HTMLElement;
    selection: number;
    constructor(menuPaneDivID: string, menuTextHeadID: string, menuContentID: string);
    off(): void;
    moveSelection(row: number): void;
}
declare let midiDrumPitchShift: number;
declare let midiInstrumentPitchShift: number;
declare let leftGridMargin: number;
declare let rightGridMargin: number;
declare let topContentMargin: number;
declare let drumGridPadding: number;
declare let bottomGridMargin: number;
declare let octaveCount: number;
declare let bigGroupMeasure: number;
declare let us: ZUserSetting;
declare let startSlecetionMeasureIdx: number;
declare let endSlecetionMeasureIdx: number;
declare class MuzXBox {
    currentSchedule: ZvoogSchedule;
    zrenderer: ZRender;
    zInputDeviceHandler: ZInputDeviceHandler;
    zMainMenu: ZMainMenu;
    constructor();
    initAll(): void;
    createUI(): void;
    changeCSS(cssHref: string, cssLinkIndex: number): void;
    setLayoutBig(): void;
    setLayoutNormal(): void;
    setGrid(meters: ZvoogMeter[]): void;
    testFSmidi(): void;
    testFSmxml(): void;
}
declare class MeasureInfoRenderer {
    measuresMeasureInfoAnchor1: TileAnchor;
    measuresMeasureInfoAnchor4: TileAnchor;
    measuresMeasureInfoAnchor16: TileAnchor;
    measuresMeasureInfoAnchor64: TileAnchor;
    measuresMeasureInfoAnchor256: TileAnchor;
    bottomTimelineLayerGroup: SVGElement;
    attach(zRender: ZRender): void;
    fillMeasureInfo(song: ZvoogSchedule, ratioDuration: number, ratioThickness: number): void;
    initMeasureInfoAnchors(zRender: ZRender): void;
    clearMeasuresAnchorsContent(zRender: ZRender, wholeWidth: number): void;
    fillMeasureInfo1(song: ZvoogSchedule, ratioDuration: number, ratioThickness: number): void;
    fillMeasureInfo4(song: ZvoogSchedule, ratioDuration: number, ratioThickness: number): void;
    fillMeasureInfo16(song: ZvoogSchedule, ratioDuration: number, ratioThickness: number): void;
    fillMeasureInfo64(song: ZvoogSchedule, ratioDuration: number, ratioThickness: number): void;
    fillMeasureInfo256(song: ZvoogSchedule, ratioDuration: number, ratioThickness: number): void;
}
declare class PianoRollRenderer {
    contentMain1: TileAnchor;
    contentMain4: TileAnchor;
    contentMain16: TileAnchor;
    contentMain64: TileAnchor;
    contentSecond1: TileAnchor;
    contentSecond4: TileAnchor;
    contentSecond16: TileAnchor;
    contentSecond64: TileAnchor;
    contentOther1: TileAnchor;
    contentOther4: TileAnchor;
    contentOther16: TileAnchor;
    contentOther64: TileAnchor;
    contentOther256: TileAnchor;
    measureOtherVoicesLayerGroup: SVGElement;
    measureSecondVoicesLayerGroup: SVGElement;
    measureMainVoiceLayerGroup: SVGElement;
    attach(zRender: ZRender): void;
    clearPRAnchorsContent(zRender: ZRender, wholeWidth: number): void;
    initMainAnchors(zRender: ZRender): void;
    initSecondAnchors(zRender: ZRender): void;
    initOthersAnchors(zRender: ZRender): void;
    addParameterMeasure(ratioDuration: number, ratioThickness: number, song: ZvoogSchedule, parameter: ZvoogParameterData, measureNum: number, time: number, css: string, anchors: TileAnchor[]): void;
    addMeasureLyrics(song: ZvoogSchedule, time: number, mm: number, ratioDuration: number, ratioThickness: number, anchor: TileAnchor, css: string): void;
    addSelectKnobs64(song: ZvoogSchedule, time: number, mm: number, ratioDuration: number, ratioThickness: number, anchor: TileAnchor): void;
    addSelectKnobs16(song: ZvoogSchedule, time: number, mm: number, ratioDuration: number, ratioThickness: number, anchor: TileAnchor, action: (x: number, y: number) => void | undefined): void;
    addSelectKnobs4(song: ZvoogSchedule, time: number, mm: number, ratioDuration: number, ratioThickness: number, anchor: TileAnchor): void;
    addSelectKnobs1(song: ZvoogSchedule, time: number, mm: number, rhythmPattern: ZvoogMeter[], ratioDuration: number, ratioThickness: number, anchor: TileAnchor): void;
    addInstrumentMeasure(ratioDuration: number, ratioThickness: number, song: ZvoogSchedule, voice: ZvoogInstrumentVoice, measureNum: number, time: number, css: string, anchors: TileAnchor[]): number;
    addDrumMeasure(drumCounter: number, ratioDuration: number, ratioThickness: number, song: ZvoogSchedule, voice: ZvoogPercussionVoice, measureNum: number, time: number, css: string, anchors: TileAnchor[]): number;
    createNoteUpAction(layerSelector: LayerSelector, tt: number, vv: number): (x: number, y: number) => void;
    createNoteMenuAction(layerSelector: LayerSelector, tt: number, vv: number): (x: number, y: number) => void;
    addNotesKnobs(layerSelector: LayerSelector, ratioDuration: number, ratioThickness: number, song: ZvoogSchedule, trackNum: number, voiceNum: number, measureNum: number, time: number, isMain: boolean, anchor: TileAnchor): void;
    needToFocusVoice(song: ZvoogSchedule, trackNum: number, voiceNum: number): boolean;
    needToFocusDrum(song: ZvoogSchedule, trackNum: number, drumNum: number): boolean;
    needToSubFocusInstrument(song: ZvoogSchedule, trackNum: number, voiceNum: number): boolean;
    needToSubFocusDrum(song: ZvoogSchedule, trackNum: number, drumNum: number): boolean;
    findFocusedTrack(tracks: ZvoogTrack[]): number;
    findFocusedFilter(filters: ZvoogFilterSetting[]): number;
    findFocusedInstrument(voices: ZvoogInstrumentVoice[]): number;
    findFocusedDrum(voices: ZvoogPercussionVoice[]): number;
    findFocusedParam(pars: ZvoogParameterData[]): number;
    createSlectMeasureAction(zRender: ZRender, measureIdx: number): (x: number, y: number) => void;
    addPianoRoll(zRender: ZRender, layerSelector: LayerSelector, song: ZvoogSchedule, ratioDuration: number, ratioThickness: number): void;
    fillFar(song: ZvoogSchedule, ratioDuration: number, ratioThickness: number): void;
    fillBig(song: ZvoogSchedule, ratioDuration: number, ratioThickness: number): void;
}
declare class GridRenderer {
    gridLayerGroup: SVGElement;
    gridAnchor1: TileAnchor;
    gridAnchor4: TileAnchor;
    gridAnchor16: TileAnchor;
    backGroundAnchor: TileAnchor;
    backGroundRectangle: TileRectangle;
    gridLayer: TileLayerDefinition;
    zoomrender: ZRender;
    attach(zRender: ZRender): void;
    initGridAnchors(zRender: ZRender): void;
    resizeBackgroundFill(): void;
    clearGridAnchorsContent(zRender: ZRender, wholeWidth: number): void;
    drawGrid(zRender: ZRender, song: ZvoogSchedule, ratioDuration: number, ratioThickness: number, rhythmPattern: ZvoogMeter[]): void;
    reSetGrid(zrenderer: ZRender, meters: ZvoogMeter[], currentSchedule: ZvoogSchedule): void;
}
declare class TimeLineRenderer {
    upperSelectionScale: SVGElement;
    measuresTimelineAnchor1: TileAnchor;
    measuresTimelineAnchor4: TileAnchor;
    measuresTimelineAnchor16: TileAnchor;
    measuresTimelineAnchor64: TileAnchor;
    timeLayer: TileLayerDefinition;
    attach(zRender: ZRender): void;
    initTimeScaleAnchors(zRender: ZRender): void;
    clearTLAnchorsContent(zRender: ZRender, wholeWidth: number): void;
    drawSchedule(zRender: ZRender, song: ZvoogSchedule, ratioDuration: number, ratioThickness: number): void;
    drawLevel(zRender: ZRender, song: ZvoogSchedule, ratioDuration: number, ratioThickness: number, layerAnchor: TileAnchor, subCSS: string | null, textCSS: string, yy: number, skip8: boolean): void;
    reSetGrid(zrenderer: ZRender, meters: ZvoogMeter[], currentSchedule: ZvoogSchedule): void;
}
declare class LayerSelector {
    muzXBox: MuzXBox;
    constructor(from: MuzXBox);
    upSongFx(fx: number): () => void;
    upSongFxParam(fx: number, param: number): () => void;
    upTrack(trk: number): () => void;
    upTrackFx(trk: number, fx: number): () => void;
    upTrackFxParam(trk: number, fx: number, param: number): () => void;
    upInstrument(trk: number, vox: number): () => void;
    upDrum(trk: number, vox: number): () => void;
    upInstrumentFx(trk: number, vox: number, fx: number): () => void;
    upDrumFx(trk: number, vox: number, fx: number): () => void;
    upInstrumentFxParam(trk: number, vox: number, fx: number, param: number): () => void;
    upDrumFxParam(trk: number, vox: number, fx: number, param: number): () => void;
    upInstrumentProvider(trk: number, vox: number): () => void;
    upDrumProvider(trk: number, vox: number): () => void;
    upInstrumentProviderParam(trk: number, vox: number, param: number): () => void;
    upDrumProviderParam(trk: number, vox: number, param: number): () => void;
    clearLevelFocus(song: ZvoogSchedule): void;
    selectSongFx(song: ZvoogSchedule, fxNum: number): void;
    selectSongFxParam(song: ZvoogSchedule, fxNum: number, prNum: number): void;
    selectSongTrack(song: ZvoogSchedule, trNum: number): void;
    selectSongTrackFx(song: ZvoogSchedule, trNum: number, fxNum: number): void;
    selectSongTrackFxParam(song: ZvoogSchedule, trNum: number, fxNum: number, prNum: number): void;
    selectSongTrackInstrument(song: ZvoogSchedule, trNum: number, voxNum: number): void;
    selectSongTrackDrum(song: ZvoogSchedule, trNum: number, voxNum: number): void;
    selectSongTrackInstrumentPerformer(song: ZvoogSchedule, trNum: number, voxNum: number): void;
    selectSongTrackDrumPerformer(song: ZvoogSchedule, trNum: number, voxNum: number): void;
    selectSongTrackInstrumentPerformerParam(song: ZvoogSchedule, trNum: number, voxNum: number, prNum: number): void;
    selectSongTrackDrumPerformerParam(song: ZvoogSchedule, trNum: number, voxNum: number, prNum: number): void;
    selectSongTrackInstrumentFx(song: ZvoogSchedule, trNum: number, voxNum: number, fxNum: number): void;
    selectSongTrackDrumFx(song: ZvoogSchedule, trNum: number, voxNum: number, fxNum: number): void;
    selectSongTrackInstrumentFxParam(song: ZvoogSchedule, trNum: number, voxNum: number, fxNum: number, prNum: number): void;
    selectSongTrackDrumFxParam(song: ZvoogSchedule, trNum: number, voxNum: number, fxNum: number, prNum: number): void;
    almostFirstInSong(song: ZvoogSchedule): void;
    almostFirstInTrack(track: ZvoogTrack): void;
}
interface FocusLevel {
    isMatch(zoomLevel: number, zRender: ZRender): boolean;
    addSpot(mngmnt: FocusManagement): void;
    spotUp(mngmnt: FocusManagement): boolean;
    spotDown(mngmnt: FocusManagement): boolean;
    spotLeft(mngmnt: FocusManagement): boolean;
    spotRight(mngmnt: FocusManagement): boolean;
    moveSpotIntoView(mngmnt: FocusManagement): void;
    moveViewToShowSpot(mngmnt: FocusManagement): void;
}
declare class FocusManagement {
    focusMarkerLayer: SVGElement;
    focusAnchor: TileAnchor;
    focusLayer: TileLayerDefinition;
    levelOfDetails: number;
    muzXBox: MuzXBox;
    focusLevels: FocusLevel[];
    attachFocus(bx: MuzXBox, zRender: ZRender): void;
    clearFocusAnchorsContent(zRender: ZRender, wholeWidth: number): void;
    currentFocusLevelX(): FocusLevel;
    reSetFocus(zrenderer: ZRender, wholeWidth: number): void;
    resetSpotPosition(): void;
    spotUp(): void;
    spotDown(): void;
    spotLeft(): void;
    spotRight(): void;
    spotSelectA(): void;
    spotPlus(): void;
    spotMinus(): void;
    changePositionTo(xx: number, yy: number): void;
    changeZoomTo(zoom: number): void;
    wrongActionWarning(): void;
}
declare class FocusZoomFar implements FocusLevel {
    idxMeasureStart: number;
    idxRow: number;
    isMatch(zoomLevel: number, zRender: ZRender): boolean;
    addSpot(mngmnt: FocusManagement): void;
    spotUp(mngmnt: FocusManagement): boolean;
    spotDown(mngmnt: FocusManagement): boolean;
    spotLeft(mngmnt: FocusManagement): boolean;
    spotRight(mngmnt: FocusManagement): boolean;
    moveSpotIntoView(mngmnt: FocusManagement): void;
    moveViewToShowSpot(mngmnt: FocusManagement): void;
}
declare class FocusZoomBig implements FocusLevel {
    measureGroupIndx: number;
    isMatch(zoomLevel: number, zRender: ZRender): boolean;
    addSpot(mngmnt: FocusManagement): void;
    spotUp(mngmnt: FocusManagement): boolean;
    spotDown(mngmnt: FocusManagement): boolean;
    spotLeft(mngmnt: FocusManagement): boolean;
    spotRight(mngmnt: FocusManagement): boolean;
    moveSpotIntoView(mngmnt: FocusManagement): void;
    moveViewToShowSpot(mngmnt: FocusManagement): void;
}
declare class FocusZoomMeasure implements FocusLevel {
    pitchLineIdx: number;
    idxMeasure: number;
    idxStep: number;
    isMatch(zoomLevel: number, zRender: ZRender): boolean;
    addSpot(mngmnt: FocusManagement): void;
    spotUp(mngmnt: FocusManagement): boolean;
    spotDown(mngmnt: FocusManagement): boolean;
    spotLeft(mngmnt: FocusManagement): boolean;
    spotRight(mngmnt: FocusManagement): boolean;
    moveViewToShowSpot(mngmnt: FocusManagement): void;
    moveSpotIntoView(mngmnt: FocusManagement): void;
}
declare class FocusZoomNote implements FocusLevel {
    xxPoint: number;
    yyPoint: number;
    isMatch(zoomLevel: number, zRender: ZRender): boolean;
    addSpot(mngmnt: FocusManagement): void;
    spotUp(mngmnt: FocusManagement): boolean;
    spotDown(mngmnt: FocusManagement): boolean;
    spotLeft(mngmnt: FocusManagement): boolean;
    spotRight(mngmnt: FocusManagement): boolean;
    moveSpotIntoView(mngmnt: FocusManagement): void;
    moveViewToShowSpot(mngmnt: FocusManagement): void;
}
declare class FocusZoomSong implements FocusLevel {
    indexMeasure: number;
    indexOctave: number;
    isMatch(zoomLevel: number, zRender: ZRender): boolean;
    addSpot(mngmnt: FocusManagement): void;
    spotUp(mngmnt: FocusManagement): boolean;
    spotDown(mngmnt: FocusManagement): boolean;
    spotLeft(mngmnt: FocusManagement): boolean;
    spotRight(mngmnt: FocusManagement): boolean;
    moveViewToShowSpot(mngmnt: FocusManagement): void;
    moveSpotIntoView(mngmnt: FocusManagement): void;
}
declare class LeftKeysRenderer {
    leftKeysGroup: SVGElement;
    keysAnchor1: TileAnchor;
    keysAnchor4: TileAnchor;
    keysLayer: TileLayerDefinition;
    attach(zRender: ZRender): void;
    initLeftKeysGroup(zRender: ZRender): void;
    clearKeysAnchorsContent(zRender: ZRender, wholeWidth: number): void;
    drawKeys(zRender: ZRender, song: ZvoogSchedule, ratioDuration: number, ratioThickness: number): void;
}
