declare let midiDrumPitchShift: number;
declare class MuzXBox {
    zrenderer: ZRender;
    zInputDeviceHandler: ZInputDeviceHandler;
    zMainMenu: ZMainMenu;
    menuButton: TileRectangle;
    constructor();
    initAll(): void;
    createUI(): void;
    testFSmidi(): void;
    testFSmxml(): void;
    testFS(): void;
}
declare class ZInputDeviceHandler {
    muzXBox: MuzXBox;
    constructor(from: MuzXBox);
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
    allTilesOK: boolean;
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
    lastMoveDt: number;
    dragTileItem: TileItem | null;
    dragTileSVGelement: TileSVGElement | null;
    dragSVGparent: SVGElement | null;
    draggedX: number;
    draggedY: number;
    dragTranslateX: number;
    dragTranslateY: number;
    mouseDownMode: boolean;
    get translateZ(): number;
    set translateZ(z: number);
    get translateX(): number;
    set translateX(x: number);
    get translateY(): number;
    set translateY(y: number);
    constructor(svgObject: SVGElement, inWidth: number, inHeight: number, minZoom: number, curZoom: number, maxZoom: number, layers: TileModelLayer[]);
    dump(): void;
    setupTapSize(): void;
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
    childExists(group: SVGElement, id: string): SVGElement | null;
    addElement(g: SVGElement, dd: TileItem, layer: TileLayerDefinition): void;
    clearAllDetails(): void;
    clearGroupDetails(group: SVGElement): void;
    autoID(definition: (TileAnchor | TileRectangle | TileText | TilePath | TileLine | TilePolygon)[]): void;
    setModel(layers: TileModelLayer[]): void;
    resetModelAndRun(afterDone: () => void): void;
    resetModel(): void;
    resetAnchor(anchor: TileAnchor, svgGroup: SVGElement): void;
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
    dragX?: boolean;
    dragY?: boolean;
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
    ratioDuration: number;
    ratioThickness: number;
    sizeRatio: number;
    measureOtherVoicesLayerGroup: SVGElement;
    measureSecondVoicesLayerGroup: SVGElement;
    measureMainVoiceLayerGroup: SVGElement;
    bottomTimelineLayerGroup: SVGElement;
    debugLayerGroup: SVGElement;
    debugAnchor0: TileAnchor;
    debugAnchor1: TileAnchor;
    debugAnchor4: TileAnchor;
    debugAnchor16: TileAnchor;
    debugAnchor64: TileAnchor;
    debugAnchor256: TileAnchor;
    measuresTimelineAnchor1: TileAnchor;
    measuresTimelineAnchor4: TileAnchor;
    measuresTimelineAnchor16: TileAnchor;
    measuresTimelineAnchor64: TileAnchor;
    measuresTimelineAnchor256: TileAnchor;
    contentMain1: TileAnchor;
    contentMain4: TileAnchor;
    contentMain16: TileAnchor;
    contentMain64: TileAnchor;
    contentMain256: TileAnchor;
    contentSecond1: TileAnchor;
    contentSecond4: TileAnchor;
    contentSecond16: TileAnchor;
    contentSecond64: TileAnchor;
    contentSecond256: TileAnchor;
    contentOther1: TileAnchor;
    contentOther4: TileAnchor;
    contentOther16: TileAnchor;
    contentOther64: TileAnchor;
    contentOther256: TileAnchor;
    constructor();
    bindLayers(): void;
    initUI(): void;
    initDebugAnchors(): void;
    initTimelineAnchors(): void;
    initMainAnchors(): void;
    initSecondAnchors(): void;
    initOthersAnchors(): void;
    clearSingleAnchor(anchor: TileAnchor, songDuration: number): void;
    clearAnchorsContent(songDuration: number): void;
    fillTimeLine1(song: ZvoogSchedule): void;
    fillTimeLine4(song: ZvoogSchedule): void;
    fillTimeLine16(song: ZvoogSchedule): void;
    fillTimeLine64(song: ZvoogSchedule): void;
    fillTimeLine256(song: ZvoogSchedule): void;
    drawSchedule(song: ZvoogSchedule, menuButton: TileRectangle): void;
    addVoiceMeasure(song: ZvoogSchedule, voice: ZvoogVoice, i: number, time: number, css: string, anchors: TileAnchor[]): void;
    addDebugButtons(song: ZvoogSchedule, menuButton: TileRectangle): void;
}
declare function progressionDuration(progression: ZvoogChordMelody[]): ZvoogMeter;
declare function adjustPartLeadPad(voice: ZvoogVoice, fromPosition: ZvoogMeter, toPosition: ZvoogMeter, measures: ZvoogMeasure[]): void;
declare function adjustPartBass(voice: ZvoogVoice, fromPosition: ZvoogMeter, toPosition: ZvoogMeter, measures: ZvoogMeasure[]): void;
declare function createBreakList(originalProg: ZvoogChordMelody[], targetProg: ZvoogChordMelody[], measures: ZvoogMeasure[]): ZvoogMeter[];
declare function adjustVoiceLowHigh(voice: ZvoogVoice, originalProg: ZvoogChordMelody[], targetProg: ZvoogChordMelody[], measures: ZvoogMeasure[], trackIsBass: boolean): void;
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
}
declare class ZvoogSineSource implements ZvoogPerformerPlugin {
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
    addSchedule(when: number, tempo: number, chord: ZvoogEnvelope[], variation: number): void;
    sendLine(when: number, tempo: number, line: ZvoogEnvelope): void;
    busy(): number;
    freq(key: number): number;
    nextClear(): boolean;
    cleanup(): void;
}
declare function WebAudioFontPlayer(): void;
declare class WAFInsSource implements ZvoogPerformerPlugin {
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
    addSchedule(when: number, tempo: number, chord: ZvoogEnvelope[], variation: number): void;
    prepare(audioContext: AudioContext, data: string): void;
    getOutput(): AudioNode;
    getParams(): ZvoogPluginParameter[];
    busy(): number;
    initWAF(): void;
    selectIns(nn: number): void;
}
declare function WebAudioFontPlayer(): void;
declare class WAFPercSource implements ZvoogPerformerPlugin {
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
    addSchedule(when: number, tempo: number, chord: ZvoogEnvelope[], variation: number): void;
    prepare(audioContext: AudioContext, data: string): void;
    getOutput(): AudioNode;
    getParams(): ZvoogPluginParameter[];
    busy(): number;
    initWAF(): void;
    selectDrum(nn: number): void;
}
declare class AudioFileSource implements ZvoogPerformerPlugin {
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
    addSchedule(when: number, tempo: number, chord: ZvoogEnvelope[], variation: number): void;
    busy(): number;
    nextClear(): boolean;
    cleanup(): void;
    findEnvelope(when: number, duration: number): {
        when: number;
        duration: number;
        base: GainNode;
    };
    single(when: number, tempo: number, line: ZvoogEnvelope): void;
}
declare type ZvoogMeter = {
    count: number;
    division: number;
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
    getOutput(): AudioNode;
    prepare(audioContext: AudioContext, data: string): void;
    busy(): number;
    state(): ZvoogPluginLock;
}
declare type ZvoogParameterData = {
    points: ZvoogCurvePoint[];
};
declare type ZvoogVoice = {
    measureChords: ZvoogMeasureChord[];
    performer: ZvoogPerformerSetting;
    filters: ZvoogFilterSetting[];
    title: string;
};
declare type ZvoogMeasureChord = {
    chords: ZvoogChordStrings[];
};
declare type ZvoogChordStrings = {
    when: ZvoogMeter;
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
declare class ZvoogPerformerStub implements ZvoogPerformerPlugin {
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
    addSchedule(when: number, tempo: number, chord: ZvoogEnvelope[], variation: number): void;
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
}
declare type ZvoogTrack = {
    title: string;
    voices: ZvoogVoice[];
    filters: ZvoogFilterSetting[];
};
declare type ZvoogSchedule = {
    title: string;
    tracks: ZvoogTrack[];
    filters: ZvoogFilterSetting[];
    measures: ZvoogMeasure[];
    harmony: ZvoogProgression;
};
declare function scheduleDuration(song: ZvoogSchedule): number;
declare type ZvoogFilterSetting = {
    filterPlugin: ZvoogFilterPlugin | null;
    parameters: ZvoogParameterData[];
    kind: string;
    initial: string;
};
declare type ZvoogPerformerSetting = {
    performerPlugin: ZvoogPerformerPlugin | null;
    parameters: ZvoogParameterData[];
    kind: string;
    initial: string;
};
declare type ZvoogFilterPlugin = ZvoogPlugin & {
    getInput: () => AudioNode;
};
declare type ZvoogPerformerPlugin = ZvoogPlugin & {
    addSchedule: (when: number, tempo: number, envelopes: ZvoogEnvelope[], variation: number) => void;
    cancelSchedule: () => void;
};
declare let cachedPerformerStubPlugins: ZvoogPerformerStub[];
declare function takeZvoogPerformerStub(): ZvoogPerformerStub;
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
declare function createPluginSource(id: string): ZvoogPerformerPlugin;
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
declare type XYp = {
    x: number;
    y: number;
};
declare type PP = {
    p1: XYp;
    p2: XYp;
};
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
    ______getTickResolution(tempo: number): number;
    getCalculatedTickResolution(tempo: number): number;
    get0TickResolution(): number;
    getTicksPerBeat(): number;
    getTicksPerFrame(): number;
    getSMPTEFrames(): number;
}
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
declare class MIDIFileTrack {
    datas: DataView;
    HDR_LENGTH: number;
    trackLength: number;
    trackContent: DataView;
    trackevents: MIDIEvent[];
    title: string;
    instrument: string;
    program: number;
    volumes: {
        ms: number;
        value: number;
    }[];
    chords: TrackChord[];
    constructor(buffer: ArrayBuffer, start: number);
}
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
declare class MidiParser {
    header: MIDIFileHeader;
    tracks: MIDIFileTrack[];
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
    takeDrumVoice(drum: number, drumVoices: {
        voice: ZvoogVoice;
        drum: number;
    }[]): {
        voice: ZvoogVoice;
        drum: number;
    };
    convert(): ZvoogSchedule;
    dump(): MIDISongData;
    instrumentTitles(): string[];
    drumTitles(): string[];
}
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
    tracks: MIDISongTrack[];
    speedMode: number;
    lineMode: number;
};
declare class MusicXMLFileImporter implements ZvoogStore {
    list(onFinish: (items: ZvoogStoreListItem[]) => void): void;
    goFolder(title: string, onFinish: (error: string) => void): void;
    goUp(onFinish: (error: string) => void): void;
    readSongData(title: string, onFinish: (result: ZvoogSchedule | null) => void): void;
    parseMXML(mxml: TreeValue): ZvoogSchedule;
    createSongData(title: string, schedule: ZvoogSchedule, onFinish: (error: string) => void): void;
    updateSongData(title: string, schedule: ZvoogSchedule, onFinish: (error: string) => void): void;
    deleteSongData(title: string, onFinish: (error: string) => void): void;
    renameSongData(title: string, newTitle: string, onFinish: (error: string) => void): void;
    createFolder(title: string, onFinish: (error: string) => void): void;
    deleteFolder(title: string, onFinish: (error: string) => void): void;
    renameFolder(title: string, newTitle: string, onFinish: (error: string) => void): void;
}
declare class TreeValue {
    name: string;
    value: string;
    children: TreeValue[];
    constructor(name: string, value: string, children: TreeValue[]);
    clone(): TreeValue;
    first(name: string): TreeValue;
    every(name: string): TreeValue[];
    seek(name: string, subname: string, subvalue: string): TreeValue;
    readDocChildren(node: any): TreeValue[];
    fill(document: Document): void;
}
declare class ZMainMenu {
    muzXBox: MuzXBox;
    level1: CSSStyleDeclaration;
    level2: CSSStyleDeclaration;
    level3: CSSStyleDeclaration;
    level4: CSSStyleDeclaration;
    level5: CSSStyleDeclaration;
    currentLevel: number;
    constructor(from: MuzXBox);
    openNextLevel(): void;
    backPreLevel(): void;
    hideMenu(): void;
    open_1_level(): void;
    open_2_level(): void;
    open_3_level(): void;
    open_4_level(): void;
    open_5_level(): void;
}
