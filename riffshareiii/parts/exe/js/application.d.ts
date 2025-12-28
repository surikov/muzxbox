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
declare class StateDiff {
    pathDataCopy: any;
    basePath: (string | number)[];
    constructor(path: (string | number)[]);
    findNodeByPath(): any;
    diffChangedCommands(): Zvoog_UICommand;
    addDiff(nodePath: (string | number)[], commands: Zvoog_Action[], old: any, changed: any): void;
    calculateNonArray(nodePath: (string | number)[], commands: Zvoog_Action[], old: any, changed: any): void;
    calculateArray(nodePath: (string | number)[], commands: Zvoog_Action[], old: any[], changed: any[]): void;
}
declare function createSchedulePlayer(callback: (start: number, position: number, end: number) => void): MZXBX_Player;
declare function createTileLevel(): TileLevelBase;
declare let goHomeBackURL: string;
declare function startApplication(): void;
declare function setupHomeBackURL(): void;
declare function squashString(data: string): string;
declare function resolveString(data: string): string | null;
declare function getNavigatorLanguage(): string;
declare function saveProjectState(): void;
declare function initWebAudioFromUI(): void;
declare function startLoadCSSfile(cssurl: string): void;
declare class Plugin__DialogPrompt2 {
}
declare class FilterPluginDialog {
    filter: Zvoog_FilterTarget;
    order: number;
    pluginRawData: string;
    dialogID: string;
    waitFilterPluginInit: boolean;
    constructor();
    promptFilterTitle(): void;
    resetFilterTitle(): void;
    resetStateButtons(): void;
    setFilterOn(): void;
    setFilterPass(): void;
    dropFilter(): void;
    openEmptyFilterPluginDialogFrame(order: number, filter: Zvoog_FilterTarget): void;
    openFilterPluginDialogFrame(order: number, filter: Zvoog_FilterTarget, filterPlugin: null | MZXBX_PluginRegistrationInformation): void;
    closeFilterDialogFrame(): void;
    sendNewIdToPlugin(): void;
    sendPointToPlugin(): void;
    setFilterValue(): void;
    receiveMessageFromPlugin(event: any): void;
}
declare class SamplerPluginDialog {
    drum: Zvoog_PercussionTrack;
    order: number;
    pluginRawData: string;
    dialogID: string;
    waitSamplerPluginInit: boolean;
    constructor();
    promptDrumTitle(): void;
    resetDrumTitle(): void;
    resetStateButtons(): void;
    setDrumOn(): void;
    setDrumMute(): void;
    setDrumSolo(): void;
    dropDrum(): void;
    openEmptyDrumPluginDialogFrame(order: number, drum: Zvoog_PercussionTrack): void;
    openDrumPluginDialogFrame(order: number, drum: Zvoog_PercussionTrack, fplugin: null | MZXBX_PluginRegistrationInformation): void;
    closeDrumDialogFrame(): void;
    sendNewIdToPlugin(): void;
    sendPointToPlugin(): void;
    setFilterValue(): void;
    receiveMessageFromPlugin(event: any): void;
}
declare class ActionPluginDialog {
    pluginInfo: MZXBX_PluginRegistrationInformation;
    waitActionPluginInit: boolean;
    dialogID: string;
    constructor();
    sendNewIdToPlugin(): void;
    sendDataToActionPlugin(): void;
    sendCurrentProjectToActionPlugin(screen: boolean): void;
    receiveMessageFromPlugin(event: any): void;
    openActionPluginDialogFrame(info: MZXBX_PluginRegistrationInformation): void;
    closeActionDialogFrame(): void;
    resetActionTitle(): void;
}
declare class SequencerPluginDialog {
    track: Zvoog_MusicTrack;
    order: number;
    pluginRawData: string;
    dialogID: string;
    waitSequencerPluginInit: boolean;
    constructor();
    promptSequencerTitle(): void;
    resetSequencerTitle(): void;
    resetStateButtons(): void;
    setSequencerOn(): void;
    setSequencerMute(): void;
    setSequencerSolo(): void;
    dropSequencer(): void;
    openEmptySequencerPluginDialogFrame(order: number, track: Zvoog_MusicTrack): void;
    openSequencerPluginDialogFrame(farNo: number, trackNo: number, track: Zvoog_MusicTrack, trackPlugin: null | MZXBX_PluginRegistrationInformation): void;
    closeSequencerDialogFrame(): void;
    sendNewIdToPlugin(): void;
    sendPointToPlugin(): void;
    setSequencerValue(): void;
    receiveMessageFromPlugin(event: any): void;
}
declare class PointPluginDialog {
    filter: Zvoog_FilterTarget;
    barIdx: number;
    filterIdx: number;
    pointIdx: number;
    pluginPoint: Zvoog_FilterStateChange;
    startEnd: BarStepStartEnd;
    dialogID: string;
    waitPointPluginInit: boolean;
    constructor();
    resetPointTitle(): void;
    dropPoint(): void;
    openPointPluginDialogFrame(filterIdx: number, barIdx: number, info: BarStepStartEnd, pointIdx: number, pointChange: Zvoog_FilterStateChange, filter: Zvoog_FilterTarget, filterPlugin: MZXBX_PluginRegistrationInformation): void;
    closePointDialogFrame(): void;
    sendNewIdToPlugin(): void;
    sendPointToPlugin(): void;
    setPointValue(data: string): void;
    receiveMessageFromPlugin(event: any): void;
}
declare class CommandExe {
    lockUndoRedo: boolean;
    setCurPosition(xyz: TileZoom): void;
    commitProjectChanges(path: (string | number)[], proAction: () => void): void;
    addUndoCommandActiions(cmd: Zvoog_UICommand): void;
    parentFromPath(path: (string | number)[]): any;
    actionChangeNode(act: Zvoog_Action, value: any): void;
    actionDeleteNode(act: Zvoog_Action): void;
    actionAddNode(act: Zvoog_Action, node: string): void;
    unAction(cmd: Zvoog_UICommand): void;
    reAction(cmd: Zvoog_UICommand): void;
    cutLongUndo(): void;
    undo(cnt: number): void;
    redo(cnt: number): void;
}
declare let uiLinkFilterToSpeaker: string;
declare let uiLinkFilterToFilter: string;
declare class CommandDispatcher {
    player: MZXBX_Player;
    renderer: UIRenderer;
    audioContext: AudioContext;
    tapSizeRatio: number;
    playPosition: number;
    playCallback: (start: number, position: number, end: number) => void;
    _mixerDataMathUtility: MixerDataMathUtility;
    listener: null | ((this: HTMLElement, event: HTMLElementEventMap['change']) => any);
    exe: CommandExe;
    undoQueue: string[];
    redoQueue: string[];
    filterPluginDialog: FilterPluginDialog;
    pointPluginDialog: PointPluginDialog;
    samplerPluginDialog: SamplerPluginDialog;
    actionPluginDialog: ActionPluginDialog;
    sequencerPluginDialog: SequencerPluginDialog;
    cfg(): MixerDataMathUtility;
    promptPluginInfoDebug(): void;
    undo(): string[];
    redo(): string[];
    clearUndo(): void;
    clearRedo(): void;
    setVisibleTimeMark(): void;
    setHiddenTimeMark(): void;
    reDrawPlayPosition(): void;
    initAudioFromUI(): void;
    registerWorkProject(data: Zvoog_Project): void;
    registerUI(renderer: UIRenderer): void;
    hideRightMenu(): void;
    showRightMenu(): void;
    findCurrentFilter(id: string): null | Zvoog_FilterTarget;
    renderCurrentOutputs(id: string, result: string[], outputs: string[]): void;
    renderCurrentProjectForOutput(): MZXBX_Schedule;
    reConnectPluginsIfPlay(): void;
    reStartPlayIfPlay(): void;
    toggleStartStop(): void;
    stopPlay(): void;
    setupAndStartPlay(): void;
    startPlayLoop(from: number, position: number, to: number): void;
    setThemeLocale(loc: string, ratio: number): void;
    setThemeColor(idx: string): void;
    resetAnchor(parentSVGGroup: SVGElement, anchor: TileAnchor, layerMode: LevelModes): void;
    changeTapSize(ratio: number): void;
    newEmptyProject(): void;
    resetProject(): void;
    findPluginRegistrationByKind(kind: String): null | MZXBX_PluginRegistrationInformation;
    timeSelectChange(idx: number): void;
    playFromTimeSelection(idx: number): void;
    setupSelectionBackground22(selectedPart: Zvoog_Selection): void;
    expandTimeLineSelection(idx: number): void;
    downloadBlob(blob: Blob, name: string): void;
    exportCanvasAsFile(canvas: HTMLCanvasElement, fileName: string): void;
    hideMenuByStyle(): void;
    showMenuByStyle(): void;
    makeTileSVGsquareCanvas(canvasSize: number, onDoneCanvas: (canvas: HTMLCanvasElement, buffer: ArrayBuffer) => void): void;
    copySelectedBars(): void;
    copySelectedBars222(): void;
    moveAsideSelectedBars(): void;
    readThemeColors(): {
        background: string;
        main: string;
        drag: string;
        line: string;
        click: string;
    };
    mergeSelectedBars(): void;
    calculateRealTrackFarOrder(): number[];
    dropSelectedBars(): void;
    insertAfterSelectedBars(): void;
    promptTempoForSelectedBars(): void;
    promptMeterForSelectedBars(): void;
    setPlayPositionFromSelectedPart(): void;
    rollTracksClick(left: number, top: number): void;
    adjustTimeLineLength(): void;
    adjustRemoveEmptyChords(): void;
    appendBar(): void;
    slidesEquals(a1: Zvoog_Slide[], a2: Zvoog_Slide[]): boolean;
    adjustMergeChordByTime(trackBar: Zvoog_TrackMeasure): void;
    adjustTracksChords(): void;
    adjustSamplerSkips(): void;
    adjustAutoPoints(): void;
    adjustLyricsPoints(): void;
    adjustTimelineContent(): void;
}
declare let globalCommandDispatcher: CommandDispatcher;
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
    iconRatio: number;
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
declare let localMenuNewEmptyProject: string;
declare let localMenuItemSettings: string;
declare let localMenuPercussionFolder: string;
declare let localMenuAutomationFolder: string;
declare let localMenuPlay: string;
declare let localMenuPause: string;
declare let localMenuUndo: string;
declare let localMenuRedo: string;
declare let localMenuClearUndoRedo: string;
declare let localDropInsTrack: string;
declare let localDropSampleTrack: string;
declare let localDropFilterTrack: string;
declare let localDropFilterPoint: string;
declare let localMenuActionsFolder: string;
declare let localMenuPerformersFolder: string;
declare let localMenuFiltersFolder: string;
declare let localMenuSamplersFolder: string;
declare let localMenuInsTracksFolder: string;
declare let localMenuDrumTracksFolder: string;
declare let localMenuFxTracksFolder: string;
declare let localMenuNewPlugin: string;
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
    positionTimeLayer: TileLayerDefinition;
    positionTimeSVGGroup: SVGElement;
    positionTimeAnchor: TileAnchor;
    positionTimeMark: TileRectangle;
    constructor();
    createTimeScale(): TileLayerDefinition[];
    positionMarkWidth(): number;
    resizeTimeScale(viewWidth: number, viewHeight: number): void;
    updateTimeSelectionBar(): void;
    createBarMark(barIdx: number, barLeft: number, size: number, measureAnchor: TileAnchor, zz: number): void;
    createBarNumber(barLeft: number, barnum: number, zz: number, curBar: Zvoog_SongMeasure, measureAnchor: TileAnchor, barTime: number, size: number): void;
    addSelectionMenuButton(label: string, left: number, order: number, zz: number, selectLevelAnchor: TileAnchor, labelCSS: string, action: () => void): void;
    fillSelectionMenu(zz: number, selectLevelAnchor: TileAnchor): void;
    fillTimeBar(): void;
}
declare class UIToolbar {
    toolBarAnchor: TileAnchor;
    toolBarGroup: SVGElement;
    toolBarLayer: TileLayerDefinition;
    openRightMenuButton: ToolBarButton;
    undoButton: ToolBarButton;
    redoButton: ToolBarButton;
    playStopButton: ToolBarButton;
    backHomeButton: ToolBarButton;
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
    menuUpButton: IconLabelButton;
    lastWidth: number;
    lastHeight: number;
    backgroundRectangle: TileRectangle;
    listingShadow: TileRectangle;
    backgroundAnchor: TileAnchor;
    dragItemX: number;
    dragItemY: number;
    dragAnchor: TileAnchor;
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
    showDragMenuItem(dx: number, dy: number, dragContent: TileItem): void;
    moveDragMenuItem(dx: number, dy: number): void;
    hideDragMenuItem(): TilePoint;
    createMenu(): TileLayerDefinition[];
    scrollListing(dx: number, dy: number): void;
    fillMenuItems(): void;
    setFocus(it: MenuInfo, infos: MenuInfo[]): void;
    fillMenuItemChildren(pad: number, infos: MenuInfo[]): void;
    readCurrentSongData(project: Zvoog_Project): void;
    rerenderMenuContent(folder: RightMenuItem | null): void;
    resizeMenu(viewWidth: number, viewHeight: number): void;
}
declare const kindAction: 1;
declare const kindDraggableCircle: 2;
declare const kindDraggableSquare: 3;
declare const kindDraggableTriangle: 4;
declare const kindPreview: 5;
declare const kindClosedFolder: 6;
declare const kindOpenedFolder: 7;
declare const kindAction2: 8;
declare const kindActionDisabled: 9;
declare class RightMenuItem {
    action?: {
        (): void;
    };
    action2?: {
        (): void;
    };
    drag?: {
        (x: number, y: number): void;
    };
    pad: number;
    top: number;
    info: MenuInfo;
    constructor(newkind: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9, info: MenuInfo, pad: number, tap?: () => void, tap2?: () => void, drag?: (x: number, y: number) => void);
    calculateHeight(): number;
    buildTile(itemTop: number, itemWidth: number): TileItem;
}
type MenuInfo = {
    text: string;
    lightTitle?: boolean;
    noLocalization?: boolean;
    focused?: boolean;
    children?: MenuInfo[];
    sid?: string;
    onClick?: () => void;
    onDrag?: (x: number, y: number) => void;
    onSubClick?: () => void;
    onFolderCloseOpen?: () => void;
    itemStates?: string[];
    selectedState?: number;
    highlight?: string;
    menuTop?: number;
    url?: string;
    itemKind: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
};
declare let menuItemsData: MenuInfo[] | null;
declare let menuPointActions: MenuInfo;
declare let menuPointAddPlugin: MenuInfo;
declare let menuPointSettings: MenuInfo;
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
    constructor(barIdx: number, drumIdx: number, zoomLevel: number, anchor: TileAnchor, left: number, durationLen: number);
    drumCellClick(barIdx: number, barX: number, yy: number, zz: number): void;
}
declare class BarOctaveRender {
    constructor(barIdx: number, octaveIdx: number, left: number, top: number, width: number, height: number, barOctaveGridAnchor: TileAnchor, barOctaveTrackAnchor: TileAnchor, barOctaveFirstAnchor: TileAnchor, transpose: number, zoomLevel: number);
}
declare class OctaveContent {
    constructor(barIdx: number, octaveIdx: number, left: number, top: number, width: number, height: number, barOctaveTrackAnchor: TileAnchor, barOctaveFirstAnchor: TileAnchor, transpose: number, zoomLevel: number);
    addUpperNotes(barIdx: number, octaveIdx: number, left: number, top: number, width: number, height: number, barOctaveAnchor: TileAnchor, transpose: number, zoomLevel: number): void;
    addOtherNotes(barIdx: number, octaveIdx: number, left: number, top: number, width: number, height: number, barOctaveAnchor: TileAnchor, transpose: number, zoomLevel: number): void;
    addTrackNotes(track: Zvoog_MusicTrack, barIdx: number, octaveIdx: number, left: number, top: number, width: number, height: number, barOctaveAnchor: TileAnchor, transpose: number, css: string, interact: boolean, zoomLevel: number): void;
}
declare class MixerBar {
    octaves: BarOctaveRender[];
    zoomLevel: number;
    constructor(barIdx: number, left: number, ww: number, zoomLevel: number, gridZoomBarAnchor: TileAnchor, tracksZoomBarAnchor: TileAnchor, firstZoomBarAnchor: TileAnchor);
    findDurationOfSample(samplerId: string): number;
    addOctaveGridSteps(barIdx: number, barLeft: number, width: number, barOctaveAnchor: TileAnchor, zIndex: number): void;
    trackCellClick(barIdx: number, barX: number, yy: number, zz: number): void;
}
declare class TextCommentsBar {
    constructor(barIdx: number, barLeft: number, barOctaveAnchor: TileAnchor, zIndex: number);
    testBars(): void;
    textCellClick(x: number, y: number, zz: number, idx: number): void;
    getFirstCommentText(commentBar: Zvoog_CommentMeasure, row: number, info: {
        start: Zvoog_MetreMathType;
        length: Zvoog_MetreMathType;
        end: Zvoog_MetreMathType;
    }): string;
    dropBarComments(commentBar: Zvoog_CommentMeasure, row: number, info: {
        start: Zvoog_MetreMathType;
        length: Zvoog_MetreMathType;
        end: Zvoog_MetreMathType;
    }): void;
}
declare class AutomationBarContent {
    constructor(barIdx: number, barLeft: number, barOctaveAnchor: TileAnchor, zIndex: number);
    autoCellClick(barIdx: number, barX: number, yy: number, zz: number): void;
}
declare class MixerUI {
    gridLayers: TileLayerDefinition;
    trackLayers: TileLayerDefinition;
    firstLayers: TileLayerDefinition;
    fanLayer: TileLayerDefinition;
    fanSVGgroup: SVGElement;
    spearsSVGgroup: SVGElement;
    spearsLayer: TileLayerDefinition;
    levels: MixerZoomLevel[];
    fillerAnchor: TileAnchor;
    markAnchor: TileAnchor;
    markRectangle: TileRectangle;
    sliderAnchor: TileAnchor;
    sliderRectangle: TileRectangle;
    fanPane: FanPane;
    gridClickAnchor: TileAnchor;
    gridClickRectangle: TileRectangle;
    constructor();
    reFillMixerUI(): void;
    resetSliderMark(): void;
    resetEditMark(): void;
    createMixerLayers(): TileLayerDefinition[];
    reFillSingleRatio(clicks: boolean, yy: number, hh: number, countFunction: (barIdx: number) => number): void;
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
    performerIcons: PerformerIcon[];
    samplerIcons: SamplerIcon[];
    resetPlates(fanAnchors: TileAnchor[], spearsAnchors: TileAnchor[]): void;
    buildPerformerIcons(fanAnchor: TileAnchor, spearsAnchor: TileAnchor, zidx: number): void;
    buildSamplerIcons(fanAnchor: TileAnchor, spearsAnchor: TileAnchor, zidx: number): void;
    buildAutoIcons(fanAnchor: TileAnchor, spearsAnchor: TileAnchor, zidx: number): void;
    buildOutIcon(fanAnchor: TileAnchor, zidx: number): void;
}
declare class PerformerIcon {
    performerId: string;
    constructor(performerId: string);
    buildPerformerSpot(fanLevelAnchor: TileAnchor, spearsAnchor: TileAnchor, zidx: number): void;
    addPerformerSpot(farNo: number, fanLevelAnchor: TileAnchor, spearsAnchor: TileAnchor, zidx: number): void;
}
declare class SamplerIcon {
    samplerId: string;
    constructor(samplerId: string);
    buildSamplerSpot(order: number, fanLevelAnchor: TileAnchor, spearsAnchor: TileAnchor, zidx: number): void;
    addSamplerSpot(order: number, samplerTrack: Zvoog_PercussionTrack, fanLevelAnchor: TileAnchor, spearsAnchor: TileAnchor, zidx: number): void;
}
declare class FilterIcon {
    filterId: string;
    constructor(filterId: string);
    buildAutoSpot(order: number, fanLevelAnchor: TileAnchor, spearsAnchor: TileAnchor, zidx: number): void;
    addFilterSpot(order: number, filterTarget: Zvoog_FilterTarget, fanLevelAnchor: TileAnchor, spearsAnchor: TileAnchor, zidx: number): void;
}
declare class ControlConnection {
    addAudioStreamLineFlow(secondary: boolean, zIndex: number, yy: number, toX: number, toY: number, anchor: TileAnchor): void;
}
declare class SpearConnection {
    constructor();
    nonan(nn: number): number;
    addSpear(secondary: boolean, zidx: number, fromX: number, fromY: number, toSize: number, toX: number, toY: number, anchor: TileAnchor): void;
}
declare class FanOutputLine {
    connectOutput(outId: string, fromID: string, fromX: number, fromY: number, fanLinesAnchor: TileAnchor, buttonsAnchor: TileAnchor, zidx: number, outputs: string[], onDelete: (x: number, y: number) => void): void;
    connectSpeaker(fromID: string, fromX: number, fromY: number, fanLinesAnchor: TileAnchor, buttonsAnchor: TileAnchor, zidx: number, outputs: string[], onDelete: (x: number, y: number) => void): void;
    addDeleteSpear(fromID: string, toID: string, fromX: number, fromY: number, toSize: number, toX: number, toY: number, anchor: TileAnchor, zidx: number, outputs: string[], onDelete: (x: number, y: number) => void): void;
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
declare abstract class UIAction {
    abstract doAction: (blobParameters: string) => boolean;
    name: string;
}
declare class UILinkFilterToTarget implements UIAction {
    doAction(blobParameters: string): boolean;
    name: string;
}
declare class UISeparateFilterFromTarget implements UIAction {
    doAction(blobParameters: string): boolean;
    name: string;
}
declare class UILinkPerformerToTarget implements UIAction {
    doAction(blobParameters: string): boolean;
    name: string;
}
declare class UISeparatePerformerFromTarget implements UIAction {
    doAction(blobParameters: string): boolean;
    name: string;
}
declare class UILinkSamplerToTarget implements UIAction {
    doAction(blobParameters: string): boolean;
    name: string;
}
declare class UISeparateSamplerFromTarget implements UIAction {
    doAction(blobParameters: string): boolean;
    name: string;
}
declare class UnDoReDo {
    uiactions: UIAction[];
    doAction(actionID: string, data: string): boolean;
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
declare let icon_sound_speaker: string;
declare let icon_hide: string;
declare let icon_flash: string;
declare let icon_close: string;
declare let icon_refresh: string;
declare let icon_search: string;
declare let icon_splitfan: string;
declare let icon_undo: string;
declare let icon_redo: string;
declare let icon_forward: string;
declare let icon_block: string;
declare let icon_equalizer: string;
declare let icon_sliders: string;
declare let icon_play_circle: string;
declare let icon_close_circle: string;
declare let icon_delete: string;
declare let icon_power: string;
declare let icon_leftright: string;
declare let icon_leftrightupdown: string;
declare let icon_addbars: string;
declare let icon_deletebars: string;
declare let icon_shiftbarcontent: string;
declare let icon_mergebars: string;
declare let icon_copybarcontent: string;
declare let icon_home: string;
declare let icon_time: string;
declare let icon_hourglass: string;
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
    warningSmallText: TileText;
    onCancel: null | (() => void);
    noWarning: boolean;
    cancelWarning(): void;
    initDialogUI(): void;
    resetDialogView(data: Zvoog_Project): void;
    resizeDialog(ww: number, hh: number, resetWarningAnchor: () => void): void;
    allLayers(): TileLayerDefinition[];
    setIcon(icon: string): void;
    showWarning(title: string, msg: string, smallMsg: string, onCancel: null | (() => void)): void;
    hideWarning(): void;
}
declare function saveLzText2localStorage(name: string, text: string): void;
declare function saveRawText2localStorage(name: string, text: string): void;
declare function readLzTextFromlocalStorage(name: string): string;
declare function readRawTextFromlocalStorage(name: string): string;
declare function readLzObjectFromlocalStorage(name: string): any;
declare function readRawObjectFromlocalStorage(name: string): any;
declare function createNewEmptyProjectData(): Zvoog_Project;
declare let _______mzxbxProjectForTesting2: Zvoog_Project;
type BarStepStartEnd = {
    start: Zvoog_MetreMathType;
    length: Zvoog_MetreMathType;
    end: Zvoog_MetreMathType;
};
declare class MixerDataMathUtility {
    data: Zvoog_Project;
    leftPad: number;
    rightPad: number;
    topPad: number;
    parTitleGrid: number;
    padGrid2Sampler: number;
    padSampler2Automation: number;
    padAutomation2Comments: number;
    bottomPad: number;
    notePathHeight: number;
    samplerDotHeight: number;
    autoPointHeight: number;
    widthDurationRatio: number;
    octaveDrawCount: number;
    octaveTransposeCount: number;
    maxCommentRowCount: number;
    pluginIconSize: number;
    speakerIconSize: number;
    speakerIconPad: number;
    padGridFan: number;
    zoomEditSLess: number;
    zoomAuxLess: number;
    editmark: null | {
        barIdx: number;
        skip: Zvoog_Metre;
        pitch: number;
    };
    slidemark: null | {
        barIdx: number;
        chord: Zvoog_Chord;
        pitch: number;
    };
    constructor(data: Zvoog_Project);
    recalculateCommentMax(): void;
    extractDifference(from: Zvoog_Project): Object;
    mergeDifference(diff: Object): void;
    wholeWidth(): number;
    fanPluginIconSize(zidx: number): number;
    fanWidth(): number;
    dragFindPluginFilterIcon(x: number, y: number, z: number, xid: string, outputs: string[]): Zvoog_FilterTarget | null;
    dragCollisionSpeaker(fanx: number, fany: number, outputs: string[]): boolean;
    speakerFanPosition(): TilePoint;
    heightOfTitle(): number;
    timelineWidth(): number;
    commentsMaxHeight(): number;
    wholeHeight(): number;
    workHeight(): number;
    automationHeight(): number;
    commentsZoomHeight(zIndex: number): number;
    commentsZoomLineY(zIndex: number, lineNo: number): number;
    commentsAverageFillHeight(): number;
    automationTop(): number;
    commentsTop(): number;
    gridTop(): number;
    drawOctaveCount(): number;
    transposeOctaveCount(): number;
    gridHeight(): number;
    samplerHeight(): number;
    samplerTop(): number;
    findFilterTarget(filterId: string): Zvoog_FilterTarget | null;
    textZoomRatio(zIndex: number): number;
    gridClickInfo(barIdx: number, barX: number, zoomIdx: number): BarStepStartEnd;
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
type Dictionary = Record<string, number>;
type PendingDictionary = Record<string, true>;
type DictionaryCollection = Record<string, Dictionary>;
interface DecompressionTracker {
    val: number;
    position: number;
    index: number;
}
declare class LZUtil {
    keyStrBase64: string;
    keyStrUriSafe: string;
    baseReverseDic: DictionaryCollection;
    getBaseValue(alphabet: string, character: string): number;
    _compress(uncompressed: string | null, bitsPerChar: number, getCharFromInt: (a: number) => string): string;
    _decompress(length: number, resetValue: number, getNextValue: (a: number) => number): string | null | undefined;
    compressToUTF16(input: string | null | undefined): string;
    decompressFromUTF16(compressed: string | null | undefined): string | null | undefined;
}
declare let styleText: string;
declare let colorbirch: string;
declare let colordarkblue: string;
declare let colordarkgreen: string;
declare let colordarkred: string;
declare let colorlight: string;
declare let colorneon: string;
declare let colorwhite: string;
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
    minZoom: number;
    beforeZoom: number;
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
    setCurrentPointPosition: (xyz: TileZoom) => void;
    getStartMouseScreen(): TilePoint;
    screen2view(screenpx: TilePoint): TilePoint;
    resetAnchor(parentSVGGroup: SVGElement, anchor: TileAnchor, layerMode: LevelModes): void;
    delayedResetAnchor(parentSVGGroup: SVGElement, anchor: TileAnchor, layerMode: LevelModes): void;
    updateAnchorStyle(anchor: TileAnchor): void;
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
    floor(toPart: number): Zvoog_MetreMathType;
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
    data: string;
    outputs: string[];
    automation: Zvoog_FilterMeasure[];
    iconPosition: {
        x: number;
        y: number;
    };
    state: 0 | 1;
    title: string;
};
type Zvoog_AudioSequencer = {
    id: string;
    data: string;
    kind: string;
    outputs: string[];
    iconPosition: {
        x: number;
        y: number;
    };
    state: 0 | 1 | 2;
};
type Zvoog_AudioSampler = {
    id: string;
    data: string;
    kind: string;
    outputs: string[];
    iconPosition: {
        x: number;
        y: number;
    };
    state: 0 | 1 | 2;
};
type Zvoog_Chord = {
    skip: Zvoog_Metre;
    pitches: number[];
    slides: Zvoog_Slide[];
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
type DifferenceCreate = {
    kind: "+";
    path: (string | number)[];
    newNode: any;
};
type DifferenceRemove = {
    kind: "-";
    path: (string | number)[];
    oldNode: any;
};
type DifferenceChange = {
    kind: "=";
    path: (string | number)[];
    newValue: any;
    oldValue: any;
};
type Zvoog_Action = DifferenceCreate | DifferenceRemove | DifferenceChange;
type Zvoog_UICommand = {
    position: {
        x: number;
        y: number;
        z: number;
    };
    actions: Zvoog_Action[];
};
type Zvoog_Project = {
    versionCode: '1';
    title: string;
    timeline: Zvoog_SongMeasure[];
    tracks: Zvoog_MusicTrack[];
    farorder: number[];
    percussions: Zvoog_PercussionTrack[];
    comments: Zvoog_CommentMeasure[];
    filters: Zvoog_FilterTarget[];
    selectedPart: Zvoog_Selection;
    position: {
        x: number;
        y: number;
        z: number;
    };
    list: boolean;
    menuPerformers: boolean;
    menuSamplers: boolean;
    menuFilters: boolean;
    menuActions: boolean;
    menuPlugins: boolean;
    menuClipboard: boolean;
    menuSettings: boolean;
};
type MZXBX_CachedWave = {
    path: string;
    buffer: AudioBuffer | null;
    canceled?: boolean;
    line100?: number[];
};
type MZXBX_FilterHolder = {
    pluginAudioFilter: MZXBX_AudioFilterPlugin | null;
    filterId: string;
    kind: string;
    properties: string;
    description: string;
};
type MZXBX_PerformerSamplerHolder = {
    plugin: MZXBX_AudioPerformerPlugin | MZXBX_AudioSamplerPlugin | null;
    channelId: string;
    kind: string;
    properties: string;
    description: string;
};
type MZXBX_Channel = {
    id: string;
    performer: MZXBX_ChannelSource;
    outputs: string[];
};
type MZXBX_SlideItem = {
    duration: number;
    delta: number;
};
type MZXBX_PlayItem = {
    skip: number;
    channelId: string;
    pitches: number[];
    slides: MZXBX_SlideItem[];
};
type MZXBX_FilterState = {
    skip: number;
    filterId: string;
    data: string;
};
type MZXBX_Set = {
    duration: number;
    tempo: number;
    items: MZXBX_PlayItem[];
    states: MZXBX_FilterState[];
};
type MZXBX_Filter = {
    id: string;
    kind: string;
    properties: string;
    outputs: string[];
    description: string;
};
type MZXBX_AudioFilterPlugin = {
    launch: (context: AudioContext, parameters: string) => void;
    busy: () => null | string;
    schedule: (when: number, tempo: number, parameters: string) => void;
    input: () => AudioNode | null;
    output: () => AudioNode | null;
};
type MZXBX_AudioSamplerPlugin = {
    launch: (context: AudioContext, parameters: string) => void;
    busy: () => null | string;
    start: (when: number, tempo: number) => void;
    cancel: () => void;
    output: () => AudioNode | null;
    duration: () => number;
};
type MZXBX_ChannelSource = {
    kind: string;
    properties: string;
    description: string;
};
type MZXBX_AudioPerformerPlugin = {
    launch: (context: AudioContext, parameters: string) => void;
    busy: () => null | string;
    strum: (when: number, pitches: number[], tempo: number, slides: MZXBX_SlideItem[]) => void;
    cancel: () => void;
    output: () => AudioNode | null;
};
type MZXBX_Schedule = {
    series: MZXBX_Set[];
    channels: MZXBX_Channel[];
    filters: MZXBX_Filter[];
};
type MZXBX_Player = {
    startSetupPlugins: (context: AudioContext, schedule: MZXBX_Schedule) => string | null;
    startLoopTicks: (from: number, position: number, to: number) => string;
    reconnectAllPlugins: (schedule: MZXBX_Schedule) => void;
    cancel: () => void;
    allFilters(): MZXBX_FilterHolder[];
    allPerformersSamplers(): MZXBX_PerformerSamplerHolder[];
    position: number;
    playState(): {
        connected: boolean;
        play: boolean;
        loading: boolean;
    };
};
type MZXBX_PluginRegistrationInformation = {
    label: string;
    kind: string;
    purpose: 'Action' | 'Filter' | 'Sampler' | 'Performer';
    ui: string;
    evaluate: string;
    script: string;
};
type MZXBX_MessageToPlugin = {
    hostData: any;
    colors: {
        background: string;
        main: string;
        drag: string;
        line: string;
        click: string;
    };
    screenData: number[] | null;
    langID: string;
};
type MZXBX_MessageToHost = {
    dialogID: string;
    pluginData: any;
    done: boolean;
    screenWait: boolean;
};
declare function MZXBX_waitForCondition(sleepMs: number, isDone: () => boolean, onFinish: () => void): void;
declare function MZXBX_loadCachedBuffer(audioContext: AudioContext, path: string, onDone: (cachedWave: MZXBX_CachedWave) => void): void;
declare function MZXBX_appendScriptURL(url: string): boolean;
declare function MMUtil(): Zvoog_MetreMathType;
declare function MZXBX_currentPlugins(): MZXBX_PluginRegistrationInformation[];
