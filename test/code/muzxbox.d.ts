declare let firstAnchor: TileAnchor;
declare let menuAnchor: TileAnchor;
declare let tileLevel: TileLevel;
declare let sizeRatio: number;
declare class MuzXBox {
    zInputDeviceHandler: ZInputDeviceHandler;
    muzLoader: MuzLoader;
    constructor();
    initAll(): void;
    createUI(): void;
    resetSong(testProject: MuzXBoxProject): void;
    testChooser(xx: number, yy: any): void;
    openMenu(): void;
    closeMenu(): void;
}
declare class ZInputDeviceHandler {
    constructor();
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
declare class MuzLoader {
    createTestProject(): MuzXBoxProject;
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
    anchor(xx: number, yy: number, ww: number, hh: number, showZoom: number, hideZoom: number): TileAnchor;
    rectangle(x: number, y: number, w: number, h: number, rx?: number, ry?: number, css?: string): TileRectangle;
    actionRectangle(action: (x: number, y: number) => void | undefined, x: number, y: number, w: number, h: number, rx?: number, ry?: number, css?: string): TileRectangle;
    line(x1: number, y1: number, x2: number, y2: number, css?: string): TileLine;
    text(x: number, y: number, text: string, css?: string): TileText;
    pathImage(x: number, y: number, scale: number, points: string, css?: string): TilePath;
    isLayerStickTop(t: TileLayerDefinition): t is TileLayerStickTop;
    isLayerStickBottom(t: TileLayerDefinition): t is TileLayerStickBottom;
    isLayerStickRight(t: TileLayerDefinition): t is TileLayerStickRight;
    isLayerOverlay(t: TileLayerDefinition): t is TileLayerOverlay;
    isTilePath(t: TileItem): t is TilePath;
    isTileText(t: TileItem): t is TileText;
    isTileLine(t: TileItem): t is TileLine;
    isTilePolygon(t: TileItem): t is TilePolygon;
    isLayerStickLeft(t: TileLayerDefinition): t is TileLayerStickLeft;
    isTileRectangle(t: TileItem): t is TileRectangle;
    isTileGroup(t: TileItem): t is TileAnchor;
    isLayerNormal(t: TileLayerDefinition): t is TileModelLayer;
    rid(): string;
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
declare function tilePolygon(svgns: string, tapSize: number, g: SVGElement, x: number, y: number, z: number | undefined, dots: number[], cssClass: string | undefined): TileSVGElement;
declare function tilePath(svgns: string, tapSize: number, g: SVGElement, x: number, y: number, z: number, data: string, cssClass: string): TileSVGElement;
declare function tileRectangle(svgns: string, tapSize: number, g: SVGElement, x: number, y: number, w: number, h: number, rx: number | undefined, ry: number | undefined, cssClass: string): TileSVGElement;
declare function tileLine(svgns: string, tapSize: number, g: SVGElement, x1: number, y1: number, x2: number, y2: number, cssClass: string | undefined): TileSVGElement;
declare function tileText(svgns: string, tapSize: number, g: SVGElement, x: number, y: number, html: string, cssClass: string): TileSVGElement;
declare type MuzXBoxPattern = {
    skip: ZvoogMeter;
    duration: ZvoogMeter;
    pattern: number;
};
declare type MuzXBoxTrack = {
    patterns: MuzXBoxPattern[];
};
declare type MuzXBoxProject = {
    tracks: MuzXBoxTrack[];
    title: string;
    tempo: number;
    duration: ZvoogMeter;
};
declare function duration2seconds(bpm: number, duration384: number): number;
declare function durations2time(measures: ZvoogMeasure[]): number;
declare function seconds2Duration384(time: number, bpm: number): number;
declare function duration384(meter: ZvoogMeter): number;
declare function calculateEnvelopeDuration(envelope: ZvoogEnvelope): ZvoogMeter;
declare function scheduleDuration(measures: ZvoogMeasure[]): ZvoogMeter;
declare function progressionDuration(progression: ZvoogChordMelody[]): ZvoogMeter;
declare function adjustPartLeadPad(voice: ZvoogVoice, fromPosition: ZvoogMeter, toPosition: ZvoogMeter, measures: ZvoogMeasure[]): void;
declare function adjustPartBass(voice: ZvoogVoice, fromPosition: ZvoogMeter, toPosition: ZvoogMeter, measures: ZvoogMeasure[]): void;
declare function createBreakList(originalProg: ZvoogChordMelody[], targetProg: ZvoogChordMelody[], measures: ZvoogMeasure[]): ZvoogMeter[];
declare function adjustVoiceLowHigh(voice: ZvoogVoice, originalProg: ZvoogChordMelody[], targetProg: ZvoogChordMelody[], measures: ZvoogMeasure[], trackIsBass: boolean): void;
declare type ZvoogStoreListItem = {
    title: string;
    isFolder: boolean;
};
interface ZvoogStore {
    getList(): ZvoogStoreListItem[];
    goFolder(): boolean;
    goUp(): boolean;
    readSongData(): ZvoogSchedule;
}
declare class ZvoogFxGain implements ZvoogFilterPlugin {
    base: GainNode;
    params: ZvoogPluginParameter[];
    lockedState: ZvoogPluginLock;
    state(): ZvoogPluginLock;
    passthrough(value: boolean): void;
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
    passthrough(value: boolean): void;
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
    passthrough(value: boolean): void;
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
    passthrough(value: boolean): void;
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
    passthrough(value: boolean): void;
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
    passthrough(value: boolean): void;
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
    passthrough(value: boolean): void;
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
    passthrough(value: boolean): void;
}
declare type ZvoogParameterData = {
    points: ZvoogCurvePoint[];
};
declare type ZvoogVoice = {
    measureChords: ZvoogMeasureChord[];
    performer: ZvoogPerformerSetting;
    filters: ZvoogFilterSetting[];
    title: string;
    stringPattern: ZvoogStringPattern | null;
    strumPattern: ZvoogStrumPattern | null;
    keyPattern: ZvoogKeyPattern | null;
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
    passthrough(value: boolean): void;
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
    passthrough(value: boolean): void;
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
    effects: ZvoogFilterSetting[];
    measures: ZvoogMeasure[];
    harmony: ZvoogProgression;
};
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
