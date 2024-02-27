"use strict";
class TreeValue {
    constructor(name, value, children) {
        this.name = name;
        this.value = value;
        this.content = children;
    }
    clone() {
        var r = new TreeValue('', '', []);
        r.name = this.name;
        r.value = this.value;
        r.content = [];
        for (var i = 0; i < this.content.length; i++) {
            r.content.push(this.content[i].clone());
        }
        return r;
    }
    first(name) {
        for (let i = 0; i < this.content.length; i++) {
            if (this.content[i].name == name) {
                return this.content[i];
            }
        }
        let tv = new TreeValue(name, '', []);
        this.content.push(tv);
        return tv;
    }
    exists(name) {
        for (let i = 0; i < this.content.length; i++) {
            if (this.content[i].name == name) {
                return true;
            }
        }
        return false;
    }
    every(name) {
        let r = [];
        for (let i = 0; i < this.content.length; i++) {
            if (this.content[i].name == name) {
                r.push(this.content[i]);
            }
        }
        return r;
    }
    seek(name, subname, subvalue) {
        for (let i = 0; i < this.content.length; i++) {
            if (this.content[i].name == name) {
                var t = this.content[i].first(subname);
                if (t.value == subvalue) {
                    return this.content[i];
                }
            }
        }
        return new TreeValue('', '', []);
    }
    readDocChildren(node) {
        let children = [];
        if (node.children) {
            for (let i = 0; i < node.children.length; i++) {
                let c = node.children[i];
                let t = '';
                if (c.childNodes && c.childNodes[0] && c.childNodes[0].nodeName == '#text') {
                    t = ('' + c.childNodes[0].nodeValue).trim();
                }
                children.push(new TreeValue(c.localName, t, this.readDocChildren(c)));
            }
        }
        if (node.attributes) {
            for (let i = 0; i < node.attributes.length; i++) {
                let a = node.attributes[i];
                children.push(new TreeValue(a.localName, a.value, []));
            }
        }
        return children;
    }
    fillFromDocument(document) {
        var tt = this.readDocChildren(document);
        if (tt.length > 0) {
            this.name = tt[0].name;
            this.value = tt[0].value;
            this.content = tt[0].content;
        }
    }
    fillFromXMLstring(xml) {
        var windowDOMParser = new window.DOMParser();
        var dom = windowDOMParser.parseFromString(xml, "text/xml");
        this.readDocChildren(dom.childNodes);
    }
    ;
    readObjectChildren(oo) {
        if (oo) {
            let keys = Object.keys(oo);
            for (let ii = 0; ii < keys.length; ii++) {
                let key = keys[ii];
                let value = oo[keys[ii]];
                if (Array.isArray(value)) {
                    for (let nn = 0; nn < value.length; nn++) {
                        let subValue = value[nn];
                        let tv = new TreeValue(key, '', []);
                        if (Array.isArray(subValue)) {
                            tv.readObjectChildren(subValue);
                        }
                        else {
                            if (typeof value === 'object') {
                                tv.readObjectChildren(subValue);
                            }
                            else {
                                tv.value = '' + subValue;
                            }
                        }
                        this.content.push(tv);
                    }
                }
                else {
                    if (typeof value === 'object') {
                        let tv = new TreeValue(key, '', []);
                        tv.readObjectChildren(value);
                        this.content.push(tv);
                    }
                    else {
                        this.content.push(new TreeValue(key, '' + value, []));
                    }
                }
            }
        }
    }
    fillFromJSONstring(json) {
        let oo = JSON.parse(json);
        this.readObjectChildren(oo);
    }
    dump(pad, symbol) {
        console.log(pad, this.name, ':', this.value);
        for (var i = 0; i < this.content.length; i++) {
            this.content[i].dump(pad + symbol, symbol);
        }
    }
    ;
}
console.log('startup v1.02');
function startApplication() {
    console.log('startApplication v1.6.01');
    let ui = new UIRenderer();
    ui.createUI();
    commandDispatcher.registerWorkProject(mzxbxProjectForTesting2);
    commandDispatcher.resetProject();
}
function initWebAudioFromUI() {
    console.log('initWebAudioFromUI');
    commandDispatcher.initAudioFromUI();
}
function startLoadCSSfile(cssurl) {
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = cssurl;
    link.media = 'all';
    head.appendChild(link);
}
class CommandDispatcher {
    constructor() {
        this.tapSizeRatio = 1;
        this.listener = null;
    }
    initAudioFromUI() {
        console.log('initAudioFromUI');
        var AudioContext = window.AudioContext;
        this.audioContext = new AudioContext();
    }
    registerWorkProject(data) {
        this.workData = data;
    }
    registerUI(renderer) {
        this.renderer = renderer;
    }
    showRightMenu() {
        let vw = this.renderer.tileLevelSVG.clientWidth / this.renderer.tiler.tapPxSize();
        let vh = this.renderer.tileLevelSVG.clientHeight / this.renderer.tiler.tapPxSize();
        this.renderer.menu.showState = !this.renderer.menu.showState;
        this.renderer.menu.resizeMenu(vw, vh);
        this.renderer.menu.resetAllAnchors();
    }
    ;
    setThemeLocale(loc, ratio) {
        console.log("setThemeLocale " + loc);
        setLocaleID(loc, ratio);
        if (loc == 'zh') {
            startLoadCSSfile('theme/font2big.css');
        }
        else {
            startLoadCSSfile('theme/font1small.css');
        }
        this.renderer.menu.resizeMenu(this.renderer.menu.lastWidth, this.renderer.menu.lastHeight);
    }
    setThemeColor(cssPath) {
        console.log("cssPath " + cssPath);
        startLoadCSSfile(cssPath);
        this.renderer.menu.resizeMenu(this.renderer.menu.lastWidth, this.renderer.menu.lastHeight);
    }
    resetAnchor(parentSVGGroup, anchor, layerMode) {
        this.renderer.tiler.resetAnchor(parentSVGGroup, anchor, layerMode);
    }
    ;
    changeTapSize(ratio) {
        console.log('changeTapSize', ratio, this);
        this.tapSizeRatio = ratio;
        this.renderer.tiler.setupTapSize(ratio);
        this.renderer.onReSizeView();
        this.renderer.tiler.resetModel();
    }
    resetProject() {
        this.renderer.fillWholeUI();
    }
    moveTrackTop(trackNum) {
        let it = this.workData.tracks[trackNum];
        this.workData.tracks.splice(trackNum, 1);
        this.workData.tracks.unshift(it);
        commandDispatcher.resetProject();
    }
    moveDrumTop(drumNum) {
        let it = this.workData.percussions[drumNum];
        this.workData.percussions.splice(drumNum, 1);
        this.workData.percussions.unshift(it);
        commandDispatcher.resetProject();
    }
    setTrackSoloState(state) {
        console.log('setTrackSoloState', state);
    }
    setDrumSoloState(state) {
        console.log('setDrumSoloState', state);
    }
    promptImportFromMIDI() {
        console.log('promptImportFromMIDI');
        let me = this;
        let filesinput = document.getElementById('file_midi_input');
        if (filesinput) {
            if (!(this.listener)) {
                this.listener = function (ievent) {
                    var file = ievent.target.files[0];
                    let title = file.name;
                    let dat = '' + file.lastModifiedDate;
                    try {
                        let last = file.lastModifiedDate;
                        dat = '' + last.getFullYear();
                        if (last.getMonth() < 10) {
                            dat = dat + '-' + last.getMonth();
                        }
                        else {
                            dat = dat + '-0' + last.getMonth();
                        }
                        if (last.getDate() < 10) {
                            dat = dat + '-' + last.getDate();
                        }
                        else {
                            dat = dat + '-0' + last.getDate();
                        }
                    }
                    catch (xx) {
                        console.log(xx);
                    }
                    let comment = ', ' + file.size / 1000 + 'kb, ' + dat;
                    var fileReader = new FileReader();
                    fileReader.onload = function (progressEvent) {
                        if (progressEvent != null) {
                            var arrayBuffer = progressEvent.target.result;
                            var midiParser = newMIDIparser(arrayBuffer);
                            let result = midiParser.convertProject(title, comment);
                            me.registerWorkProject(result);
                            me.resetProject();
                        }
                    };
                    fileReader.readAsArrayBuffer(file);
                };
                filesinput.addEventListener('change', this.listener, false);
            }
            filesinput.click();
        }
    }
    promptTestImport() {
        console.log('promptTestImport');
        let me = this;
        let filesinput = document.getElementById('file_test_input');
        if (filesinput) {
            if (!(this.listener)) {
                this.listener = function (ievent) {
                    var file = ievent.target.files[0];
                    var fileReader = new FileReader();
                    fileReader.onload = function (progressEvent) {
                        if (progressEvent != null) {
                            var arrayBuffer = progressEvent.target.result;
                            var pp = newGPparser(arrayBuffer);
                            let result = pp.convertProject();
                            me.registerWorkProject(result);
                            me.resetProject();
                        }
                    };
                    fileReader.readAsArrayBuffer(file);
                };
                filesinput.addEventListener('change', this.listener, false);
            }
            filesinput.click();
        }
    }
}
let commandDispatcher = new CommandDispatcher();
let gridLinesBrief = [
    { ratio: 0.4, duration: { count: 1, part: 2 } }
];
let gridLinesAccurate = [
    { ratio: 0.2, duration: { count: 1, part: 8 } },
    { ratio: 0.2, duration: { count: 1, part: 8 } },
    { ratio: 0.2, duration: { count: 1, part: 8 } },
    { ratio: 0.4, duration: { count: 1, part: 8 }, label: true }
];
let gridLinesDtailed = [
    { ratio: 0.1, duration: { count: 1, part: 16 } },
    { ratio: 0.1, duration: { count: 1, part: 16 }, label: true },
    { ratio: 0.1, duration: { count: 1, part: 16 } },
    { ratio: 0.2, duration: { count: 1, part: 16 }, label: true },
    { ratio: 0.1, duration: { count: 1, part: 16 } },
    { ratio: 0.1, duration: { count: 1, part: 16 }, label: true },
    { ratio: 0.1, duration: { count: 1, part: 16 } },
    { ratio: 0.4, duration: { count: 1, part: 16 }, label: true }
];
let gridLinesExplicit = [
    { ratio: 0.1, duration: { count: 1, part: 32 } },
    { ratio: 0.1, duration: { count: 1, part: 32 }, label: true },
    { ratio: 0.1, duration: { count: 1, part: 32 } },
    { ratio: 0.1, duration: { count: 1, part: 32 }, label: true },
    { ratio: 0.1, duration: { count: 1, part: 32 } },
    { ratio: 0.1, duration: { count: 1, part: 32 }, label: true },
    { ratio: 0.1, duration: { count: 1, part: 32 } },
    { ratio: 0.2, duration: { count: 1, part: 32 }, label: true },
    { ratio: 0.1, duration: { count: 1, part: 32 } },
    { ratio: 0.1, duration: { count: 1, part: 32 }, label: true },
    { ratio: 0.1, duration: { count: 1, part: 32 } },
    { ratio: 0.1, duration: { count: 1, part: 32 }, label: true },
    { ratio: 0.1, duration: { count: 1, part: 32 } },
    { ratio: 0.1, duration: { count: 1, part: 32 }, label: true },
    { ratio: 0.1, duration: { count: 1, part: 32 } },
    { ratio: 0.4, duration: { count: 1, part: 32 }, label: true }
];
let zoomPrefixLevelsCSS = [
    { prefix: '025', minZoom: 0.25, gridLines: gridLinesExplicit },
    { prefix: '05', minZoom: 0.5, gridLines: gridLinesDtailed },
    { prefix: '1', minZoom: 1, gridLines: gridLinesAccurate },
    { prefix: '2', minZoom: 2, gridLines: gridLinesBrief },
    { prefix: '4', minZoom: 4, gridLines: [] },
    { prefix: '8', minZoom: 8, gridLines: [] },
    { prefix: '16', minZoom: 16, gridLines: [] },
    { prefix: '32', minZoom: 32, gridLines: [] },
    { prefix: '64', minZoom: 64, gridLines: [] },
    { prefix: '128', minZoom: 128, gridLines: [] }
];
class UIRenderer {
    constructor() {
        commandDispatcher.registerUI(this);
    }
    changeTapSIze(ratio) {
        console.log('changeTapSIze', ratio, this);
        this.tiler.setupTapSize(ratio);
        this.onReSizeView();
        this.tiler.resetModel();
    }
    createUI() {
        this.tiler = createTileLevel();
        this.tileLevelSVG = document.getElementById("tileLevelSVG");
        let layers = [];
        this.debug = new DebugLayerUI();
        this.debug.setupUI();
        this.warning = new WarningUI();
        this.warning.initDialogUI();
        this.toolbar = new UIToolbar();
        this.timeselectbar = new TimeSelectBar();
        this.leftPanel = new LeftPanel();
        this.menu = new RightMenuPanel();
        this.mixer = new MixerUI();
        let me = this;
        layers = layers.concat(this.debug.allLayers(), this.toolbar.createToolbar(), this.menu.createMenu(), this.mixer.createMixerLayers(), this.warning.allLayers(), this.timeselectbar.createTimeScale(), this.leftPanel.createLeftPanel());
        this.tiler.initRun(this.tileLevelSVG, true, 1, 1, zoomPrefixLevelsCSS[0].minZoom, zoomPrefixLevelsCSS[Math.floor(zoomPrefixLevelsCSS.length / 2)].minZoom, zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom - 1, layers);
        this.tiler.setAfterZoomCallback(() => {
            if (this.menu) {
                this.menu.lastZ = this.tiler.getCurrentPointPosition().z;
            }
        });
        this.tiler.setAfterResizeCallback(() => {
            this.onReSizeView();
        });
    }
    fillWholeUI() {
        let mixm = new MixerDataMath(commandDispatcher.workData);
        let vw = this.tileLevelSVG.clientWidth / this.tiler.tapPxSize();
        let vh = this.tileLevelSVG.clientHeight / this.tiler.tapPxSize();
        this.tiler.resetInnerSize(mixm.mixerWidth(), mixm.mixerHeight());
        this.mixer.reFillMixerUI(commandDispatcher.workData);
        this.leftPanel.reFillLeftPanel(commandDispatcher.workData);
        this.debug.resetDebugView(commandDispatcher.workData);
        this.toolbar.resizeToolbar(vw, vh);
        this.menu.readCurrentSongData(commandDispatcher.workData);
        this.menu.resizeMenu(vw, vh);
        this.warning.resizeDialog(vw, vh, () => {
            this.tiler.resetAnchor(this.warning.warningGroup, this.warning.warningAnchor, LevelModes.overlay);
        });
        this.timeselectbar.fillTimeBar(commandDispatcher.workData);
        this.timeselectbar.resizeTimeScale(vw, vh);
        this.tiler.resetModel();
    }
    onReSizeView() {
        let mixH = 1;
        if (this.lastUsedData) {
            let mixm = new MixerDataMath(this.lastUsedData);
            mixH = mixm.mixerHeight();
        }
        let vw = this.tileLevelSVG.clientWidth / this.tiler.tapPxSize();
        let vh = this.tileLevelSVG.clientHeight / this.tiler.tapPxSize();
        this.toolbar.resizeToolbar(vw, vh);
        this.tiler.resetAnchor(this.toolbar.toolBarGroup, this.toolbar.toolBarAnchor, LevelModes.overlay);
        this.menu.resizeMenu(vw, vh);
        this.menu.resetAllAnchors();
        this.warning.resizeDialog(vw, vh, () => {
            this.tiler.resetAnchor(this.warning.warningGroup, this.warning.warningAnchor, LevelModes.overlay);
        });
    }
    deleteUI() {
    }
}
let labelLocaleDictionary = 'en';
let localNameLocal = 'localNameLocal';
let localeFontRatio = 1;
let localMenuItemSettings = 'localMenuItemSettings';
let localMenuTracksFolder = 'localMenuTracksFolder';
let localMenuImportMIDI = 'localMenuImportMIDI';
let localMenuPercussionFolder = 'localMenuPercussionFolder';
let localeDictionary = [
    {
        id: localNameLocal, data: [
            { locale: 'en', text: 'English' },
            { locale: 'ru', text: 'Русский' },
            { locale: 'zh', text: '汉语口语' }
        ]
    }, {
        id: localMenuItemSettings, data: [
            { locale: 'en', text: 'Settings' },
            { locale: 'ru', text: 'Настройки' },
            { locale: 'zh', text: '设置' }
        ]
    }, {
        id: localMenuTracksFolder, data: [
            { locale: 'en', text: 'Tracks' },
            { locale: 'ru', text: 'Треки' },
            { locale: 'zh', text: '?' }
        ]
    }, {
        id: localMenuImportMIDI, data: [
            { locale: 'en', text: 'Import from MIDI-file' },
            { locale: 'ru', text: 'Импорт из файлв MIDI' },
            { locale: 'zh', text: '?' }
        ]
    },
    {
        id: localMenuPercussionFolder, data: [
            { locale: 'en', text: 'Sampler' },
            { locale: 'ru', text: 'Сэмплер' },
            { locale: 'zh', text: '?' }
        ]
    }
];
function setLocaleID(loname, ratio) {
    labelLocaleDictionary = loname;
    localeFontRatio = ratio;
}
function LO(id) {
    for (let ii = 0; ii < localeDictionary.length; ii++) {
        let row = localeDictionary[ii];
        if (id == row.id) {
            for (let kk = 0; kk < row.data.length; kk++) {
                if (row.data[kk].locale == labelLocaleDictionary) {
                    return row.data[kk].text;
                }
            }
            return labelLocaleDictionary + '?' + id;
        }
    }
    return labelLocaleDictionary + ':' + id;
}
class TimeSelectBar {
    constructor() {
    }
    createTimeScale() {
        this.selectionBarSVGGroup = document.getElementById("timeselectbar");
        this.selectBarAnchor = {
            xx: 0, yy: 0, ww: 1, hh: 1,
            showZoom: zoomPrefixLevelsCSS[0].minZoom,
            hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom,
            content: []
        };
        this.selectionBarLayer = {
            g: this.selectionBarSVGGroup, anchors: [
                this.selectBarAnchor
            ], mode: LevelModes.top
        };
        return [this.selectionBarLayer];
    }
    resizeTimeScale(viewWIdth, viewHeight) {
    }
    addGridMarks(data, barnum, barLeft, curBar, measureAnchor, zIndex) {
        let zoomInfo = zoomPrefixLevelsCSS[zIndex];
        if (zoomInfo.gridLines.length > 0) {
            let mixm = new MixerDataMath(data);
            let lineCount = 0;
            let skip = MZMM().set({ count: 0, part: 1 });
            while (true) {
                let line = zoomInfo.gridLines[lineCount];
                skip = skip.plus(line.duration).simplyfy();
                if (!skip.less(curBar.metre)) {
                    break;
                }
                if (line.label) {
                    let xx = barLeft + skip.duration(curBar.tempo) * mixm.widthDurationRatio;
                    let mark = {
                        x: xx, y: 0,
                        w: line.ratio * 4 * zoomInfo.minZoom,
                        h: line.ratio * 4 * zoomInfo.minZoom,
                        css: 'timeMeasureMark'
                    };
                    measureAnchor.content.push(mark);
                    let mtr = {
                        x: xx,
                        y: 1 * zoomInfo.minZoom,
                        text: '' + skip.count + '/' + skip.part,
                        css: 'timeBarInfo' + zoomPrefixLevelsCSS[zIndex].prefix
                    };
                    measureAnchor.content.push(mtr);
                }
                lineCount++;
                if (lineCount >= zoomInfo.gridLines.length) {
                    lineCount = 0;
                }
            }
        }
    }
    createBarMark(barLeft, width, height, measureAnchor) {
        let mark = { x: barLeft, y: 0, w: width, h: height, css: 'timeMeasureMark' };
        measureAnchor.content.push(mark);
    }
    createBarNumber(barLeft, barnum, zz, curBar, measureAnchor) {
        let nm = {
            x: barLeft,
            y: zoomPrefixLevelsCSS[zz].minZoom * 2,
            text: '' + (1 + barnum) + ': ' + curBar.metre.count + '/' + curBar.metre.part,
            css: 'timeBarNum' + zoomPrefixLevelsCSS[zz].prefix
        };
        measureAnchor.content.push(nm);
        let bpm = {
            x: barLeft,
            y: zoomPrefixLevelsCSS[zz].minZoom * 3,
            text: '' + Math.round(curBar.tempo),
            css: 'timeBarInfo' + zoomPrefixLevelsCSS[zz].prefix
        };
        measureAnchor.content.push(bpm);
    }
    fillTimeBar(data) {
        let mixm = new MixerDataMath(data);
        this.selectBarAnchor.ww = mixm.mixerWidth();
        this.selectBarAnchor.hh = mixm.mixerHeight();
        this.zoomAnchors = [];
        for (let zz = 0; zz < zoomPrefixLevelsCSS.length - 1; zz++) {
            let selectLevelAnchor = {
                showZoom: zoomPrefixLevelsCSS[zz].minZoom,
                hideZoom: zoomPrefixLevelsCSS[zz + 1].minZoom,
                xx: 0, yy: 0, ww: mixm.mixerWidth(), hh: mixm.mixerHeight(), content: [],
                id: 'time' + (zz + Math.random())
            };
            this.zoomAnchors.push(selectLevelAnchor);
            let mm = MZMM();
            let barLeft = mixm.LeftPad;
            for (let kk = 0; kk < data.timeline.length; kk++) {
                let curBar = data.timeline[kk];
                let curMeasureMeter = mm.set(curBar.metre);
                let barWidth = curMeasureMeter.duration(curBar.tempo) * mixm.widthDurationRatio;
                let measureAnchor = {
                    showZoom: zoomPrefixLevelsCSS[zz].minZoom,
                    hideZoom: zoomPrefixLevelsCSS[zz + 1].minZoom,
                    xx: barLeft, yy: 0, ww: barWidth, hh: 1234, content: [],
                    id: 'measure' + (kk + Math.random())
                };
                selectLevelAnchor.content.push(measureAnchor);
                this.addGridMarks(data, kk, barLeft, curBar, measureAnchor, zz);
                if ((zz <= 4) || (zz == 5 && kk % 2 == 0) || (zz == 6 && kk % 4 == 0) || (zz == 7 && kk % 8 == 0) || (zz == 8 && kk % 16 == 0)) {
                    this.createBarMark(barLeft, zoomPrefixLevelsCSS[zz].minZoom * 3, zoomPrefixLevelsCSS[zz].minZoom * 3, measureAnchor);
                    this.createBarNumber(barLeft, kk, zz, curBar, measureAnchor);
                }
                barLeft = barLeft + barWidth;
            }
        }
        this.selectBarAnchor.content = this.zoomAnchors;
    }
}
class UIToolbar {
    constructor() {
    }
    createToolbar() {
        this.menuButton = new ToolBarButton([icon_ver_menu], 1, 0, (nn) => {
            commandDispatcher.resetAnchor(this.toolBarGroup, this.toolBarAnchor, LevelModes.overlay);
            commandDispatcher.showRightMenu();
        });
        this.toolBarGroup = document.getElementById("toolBarPanelGroup");
        this.toolBarAnchor = {
            xx: 0, yy: 0, ww: 111, hh: 111,
            showZoom: zoomPrefixLevelsCSS[0].minZoom,
            hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom,
            content: [
                this.menuButton.iconLabelButton.anchor
            ]
        };
        this.toolBarLayer = {
            g: this.toolBarGroup, anchors: [
                this.toolBarAnchor
            ], mode: LevelModes.overlay
        };
        return [this.toolBarLayer];
    }
    resizeToolbar(viewWIdth, viewHeight) {
        this.toolBarAnchor.xx = 0;
        this.toolBarAnchor.yy = 0;
        this.toolBarAnchor.ww = viewWIdth;
        this.toolBarAnchor.hh = viewHeight;
        this.menuButton.resize(viewWIdth, viewHeight);
    }
}
class ToolBarButton {
    constructor(labels, stick, position, action) {
        this.iconLabelButton = new IconLabelButton(labels, 'toolBarButtonCircle', 'toolBarButtonLabel', action);
        this.stick = stick;
        this.position = position;
    }
    resize(viewWIdth, viewHeight) {
        let x0 = viewWIdth / 2 - 0.5 + this.position;
        if (this.stick > 0) {
            x0 = viewWIdth - 1 - this.position;
        }
        else {
            if (this.stick < 0) {
                x0 = 0 + this.position;
            }
        }
        this.iconLabelButton.resize(x0, viewHeight - 1, 1);
    }
}
class RightMenuPanel {
    constructor() {
        this.showState = true;
        this.lastWidth = 0;
        this.lastHeight = 0;
        this.items = [];
        this.scrollY = 0;
        this.shiftX = 0;
        this.lastZ = 1;
        this.itemsWidth = 0;
    }
    resetAllAnchors() {
        commandDispatcher.resetAnchor(this.menuPanelBackground, this.backgroundAnchor, LevelModes.overlay);
        commandDispatcher.resetAnchor(this.menuPanelContent, this.contentAnchor, LevelModes.overlay);
        commandDispatcher.resetAnchor(this.menuPanelInteraction, this.interAnchor, LevelModes.overlay);
        commandDispatcher.resetAnchor(this.menuPanelButtons, this.buttonsAnchor, LevelModes.overlay);
    }
    createMenu() {
        this.menuPanelBackground = document.getElementById("menuPanelBackground");
        this.menuPanelContent = document.getElementById("menuPanelContent");
        this.menuPanelInteraction = document.getElementById("menuPanelInteraction");
        this.menuPanelButtons = document.getElementById("menuPanelButtons");
        this.backgroundRectangle = { x: 0, y: 0, w: 5, h: 5, css: 'rightMenuPanel' };
        this.dragHandler = { x: 1, y: 1, w: 5, h: 5, css: 'transparentScroll', id: 'rightMenuDragHandler', draggable: true, activation: this.scrollListing.bind(this) };
        this.listingShadow = { x: 0, y: 0, w: 5, h: 5, css: 'fillShadow' };
        this.menuCloseButton = new IconLabelButton([icon_moveright], 'menuButtonCircle', 'menuButtonLabel', (nn) => {
            this.showState = false;
            this.resizeMenu(this.lastWidth, this.lastHeight);
            this.resetAllAnchors();
        });
        this.menuUpButton = new IconLabelButton([icon_moveup], 'menuButtonCircle', 'menuButtonLabel', (nn) => {
            this.scrollY = 0;
            this.contentAnchor.translation = { x: this.shiftX, y: this.scrollY };
        });
        this.backgroundAnchor = {
            xx: 0, yy: 0, ww: 111, hh: 111,
            showZoom: zoomPrefixLevelsCSS[0].minZoom,
            hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom,
            content: [
                this.listingShadow,
                this.backgroundRectangle
            ], id: 'rightMenuBackgroundAnchor'
        };
        this.contentAnchor = {
            xx: 0, yy: 0, ww: 111, hh: 111,
            showZoom: zoomPrefixLevelsCSS[0].minZoom,
            hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom,
            content: [], id: 'rightMenuContentAnchor'
        };
        this.interAnchor = {
            xx: 0, yy: 111, ww: 111, hh: 0,
            showZoom: zoomPrefixLevelsCSS[0].minZoom,
            hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom,
            content: [
                this.dragHandler
            ], id: 'rightMenuInteractionAnchor'
        };
        this.buttonsAnchor = {
            xx: 0, yy: 111, ww: 111, hh: 0,
            showZoom: zoomPrefixLevelsCSS[0].minZoom,
            hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom,
            content: [
                this.menuCloseButton.anchor, this.menuUpButton.anchor
            ]
        };
        this.bgLayer = { g: this.menuPanelBackground, anchors: [this.backgroundAnchor], mode: LevelModes.overlay };
        this.contentLayer = { g: this.menuPanelContent, anchors: [this.contentAnchor], mode: LevelModes.overlay };
        this.interLayer = { g: this.menuPanelInteraction, anchors: [this.interAnchor], mode: LevelModes.overlay };
        this.buttonsLayer = { g: this.menuPanelButtons, anchors: [this.buttonsAnchor], mode: LevelModes.overlay };
        return [this.bgLayer,
            this.interLayer,
            this.contentLayer,
            this.buttonsLayer
        ];
    }
    scrollListing(dx, dy) {
        let yy = this.scrollY + dy / this.lastZ;
        let itemsH = 0;
        for (let ii = 0; ii < this.items.length - 1; ii++) {
            itemsH = itemsH + this.items[ii].calculateHeight();
        }
        if (yy < -itemsH) {
            yy = -itemsH;
        }
        if (yy > 0) {
            yy = 0;
        }
        this.scrollY = yy;
        this.contentAnchor.translation = { x: this.shiftX, y: this.scrollY };
        commandDispatcher.resetAnchor(this.menuPanelContent, this.contentAnchor, LevelModes.overlay);
    }
    fillMenuItems() {
        this.items = [];
        this.fillMenuItemChildren(0, composeBaseMenu());
    }
    setFocus(it, infos) {
        for (let ii = 0; ii < infos.length; ii++) {
            infos[ii].focused = false;
        }
        it.focused = true;
        this.rerenderMenuContent(null);
    }
    setOpenState(state, it, infos) {
        for (let ii = 0; ii < infos.length; ii++) {
            infos[ii].opened = false;
            infos[ii].focused = false;
        }
        it.focused = true;
        it.opened = state;
    }
    fillMenuItemChildren(pad, infos) {
        let me = this;
        for (let ii = 0; ii < infos.length; ii++) {
            let it = infos[ii];
            let focused = (it.focused) ? true : false;
            let opened = (it.opened) ? true : false;
            let children = it.children;
            let itemLabel = '';
            if (it.noLocalization) {
                itemLabel = it.text;
            }
            else {
                itemLabel = LO(it.text);
            }
            if (children) {
                if (opened) {
                    this.items.push(new RightMenuItem(it, pad).initOpenedFolderItem());
                    this.fillMenuItemChildren(pad + 0.5, children);
                }
                else {
                    let si = new RightMenuItem(it, pad, () => {
                        me.setOpenState(true, it, infos);
                        me.rerenderMenuContent(si);
                    }).initClosedFolderItem();
                    this.items.push(si);
                }
            }
            else {
                if (it.onSubClick) {
                    let rightMenuItem = new RightMenuItem(it, pad, () => {
                        if (it.onClick) {
                            it.onClick();
                        }
                        me.setFocus(it, infos);
                        me.resetAllAnchors();
                    }, () => {
                        if (it.states) {
                            let sel = it.selection ? it.selection : 0;
                            if (it.states.length - 1 > sel) {
                                sel++;
                            }
                            else {
                                sel = 0;
                            }
                            it.selection = sel;
                        }
                        if (it.onSubClick) {
                            it.onSubClick();
                        }
                        me.rerenderMenuContent(rightMenuItem);
                    });
                    this.items.push(rightMenuItem.initActionItem2());
                }
                else {
                    this.items.push(new RightMenuItem(it, pad, () => {
                        if (it.onClick) {
                            it.onClick();
                        }
                        me.setFocus(it, infos);
                        me.resetAllAnchors();
                    }).initActionItem());
                }
            }
        }
    }
    readCurrentSongData(project) {
        console.log('readCurrentSongData');
        menuPointTracks.children = [];
        for (let tt = 0; tt < project.tracks.length; tt++) {
            let track = project.tracks[tt];
            let item = {
                text: track.title,
                noLocalization: true,
                onClick: () => {
                    commandDispatcher.moveTrackTop(tt);
                },
                onSubClick: () => {
                    let state = item.selection ? item.selection : 0;
                    commandDispatcher.setTrackSoloState(state);
                },
                states: [icon_sound_low, icon_hide, icon_sound_loud],
                selection: 0
            };
            menuPointTracks.children.push(item);
        }
        menuPointPercussion.children = [];
        for (let tt = 0; tt < project.percussions.length; tt++) {
            let drum = project.percussions[tt];
            let item = {
                text: drum.title,
                noLocalization: true,
                onClick: () => {
                    commandDispatcher.moveDrumTop(tt);
                },
                onSubClick: () => {
                    let state = item.selection ? item.selection : 0;
                    commandDispatcher.setDrumSoloState(state);
                },
                states: [icon_sound_low, icon_hide, icon_sound_loud],
                selection: 0
            };
            menuPointPercussion.children.push(item);
        }
    }
    rerenderMenuContent(folder) {
        this.contentAnchor.content = [];
        this.fillMenuItems();
        let position = 0;
        for (let ii = 0; ii < this.items.length; ii++) {
            if (folder) {
                if (folder.info == this.items[ii].info) {
                    if (-position > this.scrollY) {
                        this.scrollY = -position + 0.5;
                        this.contentAnchor.translation = { x: this.shiftX, y: this.scrollY };
                    }
                }
            }
            let tile = this.items[ii].buildTile(position, this.itemsWidth);
            this.contentAnchor.content.push(tile);
            position = position + this.items[ii].calculateHeight();
        }
        commandDispatcher.resetAnchor(this.menuPanelContent, this.contentAnchor, LevelModes.overlay);
    }
    resizeMenu(viewWidth, viewHeight) {
        this.lastWidth = viewWidth;
        this.lastHeight = viewHeight;
        this.itemsWidth = viewWidth - 1;
        if (this.itemsWidth > 9)
            this.itemsWidth = 9;
        if (this.itemsWidth < 2) {
            this.itemsWidth = 2;
        }
        this.shiftX = viewWidth - this.itemsWidth;
        if (!this.showState) {
            this.shiftX = viewWidth + 1;
        }
        else {
        }
        let shn = 0.05;
        this.listingShadow.x = this.shiftX - shn;
        this.listingShadow.y = -shn;
        this.listingShadow.w = this.itemsWidth + shn + shn;
        this.listingShadow.h = viewHeight + shn + shn;
        this.backgroundRectangle.x = this.shiftX;
        this.backgroundRectangle.y = 0;
        this.backgroundRectangle.w = this.itemsWidth;
        this.backgroundRectangle.h = viewHeight;
        this.backgroundAnchor.xx = 0;
        this.backgroundAnchor.yy = 0;
        this.backgroundAnchor.ww = viewWidth;
        this.backgroundAnchor.hh = viewHeight;
        this.dragHandler.x = this.shiftX;
        this.dragHandler.y = 0;
        this.dragHandler.w = this.itemsWidth;
        this.dragHandler.h = viewHeight;
        this.interAnchor.xx = 0;
        this.interAnchor.yy = 0;
        this.interAnchor.ww = viewWidth;
        this.interAnchor.hh = viewHeight;
        this.buttonsAnchor.xx = 0;
        this.buttonsAnchor.yy = 0;
        this.buttonsAnchor.ww = viewWidth;
        this.buttonsAnchor.hh = viewHeight;
        this.contentAnchor.xx = 0;
        this.contentAnchor.yy = 0;
        this.contentAnchor.ww = viewWidth;
        this.contentAnchor.hh = viewHeight;
        this.contentAnchor.translation = { x: this.shiftX, y: this.scrollY };
        this.menuCloseButton.resize(this.shiftX + this.itemsWidth - 1, viewHeight - 1, 1);
        this.menuUpButton.resize(this.shiftX + this.itemsWidth - 1, 0, 1);
        this.rerenderMenuContent(null);
    }
}
class RightMenuItem {
    constructor(info, pad, tap, tap2) {
        this.kindAction = 1;
        this.kindDraggable = 2;
        this.kindPreview = 3;
        this.kindClosedFolder = 4;
        this.kindOpenedFolder = 5;
        this.kindAction2 = 6;
        this.kind = this.kindAction;
        this.pad = 0;
        this.info = info;
        this.pad = pad;
        this.action = tap;
        this.action2 = tap2;
        if (this.info.sid) {
        }
        else {
            this.info.sid = 'random' + Math.random();
        }
    }
    initActionItem() {
        this.kind = this.kindAction;
        return this;
    }
    initActionItem2() {
        this.kind = this.kindAction2;
        return this;
    }
    initDraggableItem() {
        this.kind = this.kindDraggable;
        return this;
    }
    initOpenedFolderItem() {
        this.kind = this.kindOpenedFolder;
        return this;
    }
    initClosedFolderItem() {
        this.kind = this.kindClosedFolder;
        return this;
    }
    initPreviewItem() {
        this.kind = this.kindPreview;
        return this;
    }
    calculateHeight() {
        if (this.kind == this.kindPreview) {
            return 2;
        }
        else {
            return 1;
        }
    }
    buildTile(itemTop, itemWidth) {
        let label = '?';
        if (this.info.noLocalization) {
            label = this.info.text;
        }
        else {
            label = LO(this.info.text);
        }
        this.top = itemTop;
        let anchor = {
            xx: 0, yy: itemTop, ww: 111, hh: 111,
            showZoom: zoomPrefixLevelsCSS[0].minZoom,
            hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom,
            content: []
        };
        if (this.info.focused) {
            anchor.content.push({ x: itemWidth - 0.2, y: itemTop + 0.02, w: 0.2, h: this.calculateHeight() - 0.02, css: 'rightMenuFocusedDelimiter' });
        }
        anchor.content.push({ x: 0, y: itemTop + this.calculateHeight(), w: itemWidth, h: 0.02, css: 'rightMenuDelimiterLine' });
        let spot = { x: this.pad, y: itemTop, w: 1, h: 1, activation: this.action, css: 'transparentSpot' };
        let spot2 = null;
        if (this.kind == this.kindAction) {
            anchor.content.push({ x: 0.1 + this.pad, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'rightMenuItemActionBG' });
            anchor.content.push({ x: 0.3 + this.pad, y: itemTop + 0.7, text: label, css: 'rightMenuLabel' });
        }
        if (this.kind == this.kindAction2) {
            let icon = '?';
            let sel = this.info.selection ? this.info.selection : 0;
            if (this.info.states) {
                if (this.info.states.length > sel) {
                    icon = this.info.states[sel];
                }
            }
            anchor.content.push({ x: 0.1 + this.pad, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'rightMenuItemActionBG' });
            anchor.content.push({ x: 0.3 + this.pad, y: itemTop + 0.7, text: label, css: 'rightMenuLabel' });
            anchor.content.push({ x: itemWidth - 1.1, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'rightMenuItemActionBG' });
            anchor.content.push({ x: itemWidth - 1.1 + 0.4, y: itemTop + 0.7, text: icon, css: 'rightMenuIconLabel' });
            spot2 = { x: itemWidth - 1.2, y: itemTop, w: 1, h: 1, activation: this.action2, css: 'transparentSpot' };
        }
        if (this.kind == this.kindDraggable) {
            spot.draggable = true;
            anchor.content.push({ x: 0.1 + this.pad, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'rightMenuItemDragBG' });
            anchor.content.push({ x: 0.3 + this.pad, y: itemTop + 0.7, text: label, css: 'rightMenuLabel' });
        }
        if (this.kind == this.kindOpenedFolder) {
            anchor.content.push({ x: 0.1 + this.pad, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'rightMenuItemActionBG' });
            anchor.content.push({ x: 0.5 + this.pad, y: itemTop + 0.7, text: icon_movedown, css: 'rightMenuIconLabel' });
            anchor.content.push({ x: 1 + this.pad, y: itemTop + 0.7, text: label, css: 'rightMenuLabel' });
        }
        if (this.kind == this.kindClosedFolder) {
            anchor.content.push({ x: 0.1 + this.pad, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'rightMenuItemActionBG' });
            anchor.content.push({ x: 0.5 + this.pad, y: itemTop + 0.7, text: icon_moveright, css: 'rightMenuIconLabel' });
            anchor.content.push({ x: 1 + this.pad, y: itemTop + 0.7, text: label, css: 'rightMenuLabel' });
        }
        if (this.kind == this.kindPreview) {
            spot.draggable = true;
            anchor.content.push({ x: 0.1 + this.pad, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'rightMenuItemDragBG' });
            anchor.content.push({ x: 0.3 + this.pad, y: itemTop + 0.7, text: label, css: 'rightMenuLabel' });
            anchor.content.push({ x: itemWidth - 1 + 0.1, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'rightMenuItemSubActionBG' });
            anchor.content.push({ x: itemWidth - 0.5, y: itemTop + 0.7, text: icon_play, css: 'rightMenuButtonLabel' });
            anchor.content.push({ x: itemWidth - 1, y: itemTop, w: 1, h: 1, activation: this.action, css: 'transparentSpot' });
            anchor.content.push({ x: 0.3 + 1 + this.pad, y: itemTop + 0.7 + 0.55, text: label, css: 'rightMenuSubLabel' });
            anchor.content.push({ x: 0.3 + 1 + this.pad, y: itemTop + 0.7 + 0.55 + 0.55, text: label, css: 'rightMenuSubLabel' });
        }
        anchor.content.push(spot);
        if (spot2) {
            anchor.content.push(spot2);
        }
        return anchor;
    }
}
let menuItemsData = null;
let menuPointTracks = {
    text: localMenuTracksFolder
};
let menuPointPercussion = {
    text: localMenuPercussionFolder
};
function composeBaseMenu() {
    if (menuItemsData) {
        return menuItemsData;
    }
    else {
        menuItemsData = [
            {
                text: localMenuImportMIDI, onClick: () => {
                    commandDispatcher.promptImportFromMIDI();
                }
            }, {
                text: "TestImport", onClick: () => {
                    commandDispatcher.promptTestImport();
                }
            }, menuPointTracks,
            menuPointPercussion,
            {
                text: localMenuItemSettings, children: [
                    {
                        text: 'Size', children: [
                            {
                                text: 'Small', onClick: () => {
                                    startLoadCSSfile('theme/sizesmall.css');
                                    commandDispatcher.changeTapSize(1);
                                }
                            }, {
                                text: 'Big', onClick: () => {
                                    startLoadCSSfile('theme/sizebig.css');
                                    commandDispatcher.changeTapSize(1.5);
                                }
                            }, {
                                text: 'Huge', onClick: () => {
                                    startLoadCSSfile('theme/sizehuge.css');
                                    commandDispatcher.changeTapSize(4);
                                }
                            }
                        ]
                    }, {
                        text: 'Locale', children: [
                            {
                                text: 'Russian', onClick: () => {
                                    commandDispatcher.setThemeLocale('ru', 1);
                                }
                            }, {
                                text: 'English', onClick: () => {
                                    commandDispatcher.setThemeLocale('en', 1);
                                }
                            }, {
                                text: '中文界面语言', onClick: () => {
                                    commandDispatcher.setThemeLocale('zh', 1.5);
                                }
                            }
                        ]
                    }, {
                        text: 'Colors', children: [
                            {
                                text: 'Red', onClick: () => {
                                    commandDispatcher.setThemeColor('theme/colordarkred.css');
                                }
                            }, {
                                text: 'Green', onClick: () => {
                                    commandDispatcher.setThemeColor('theme/colordarkgreen.css');
                                }
                            }, {
                                text: 'Blue', onClick: () => {
                                    commandDispatcher.setThemeColor('theme/colordarkblue.css');
                                }
                            }
                        ]
                    }
                ]
            }
        ];
        return menuItemsData;
    }
}
class LeftPanel {
    constructor() {
        this.leftZoomAnchors = [];
    }
    createLeftPanel() {
        let leftsidebar = document.getElementById("leftsidebar");
        this.leftLayer = { g: leftsidebar, anchors: [], mode: LevelModes.left };
        for (let zz = 0; zz < zoomPrefixLevelsCSS.length - 1; zz++) {
            let zoomLeftLevelAnchor = {
                showZoom: zoomPrefixLevelsCSS[zz].minZoom,
                hideZoom: zoomPrefixLevelsCSS[zz + 1].minZoom,
                xx: 0, yy: 0, ww: 1, hh: 1, content: []
            };
            this.leftZoomAnchors.push(zoomLeftLevelAnchor);
            this.leftLayer.anchors.push(zoomLeftLevelAnchor);
        }
        return [this.leftLayer];
    }
    reFillLeftPanel(data) {
        console.log('reFillLeftPanel');
        let mixm = new MixerDataMath(data);
        for (let zz = 0; zz < this.leftZoomAnchors.length; zz++) {
            this.leftZoomAnchors[zz].hh = mixm.mixerHeight();
            this.leftZoomAnchors[zz].content = [];
            for (let oo = 1; oo < mixm.octaveCount; oo++) {
                if (zz < 4) {
                    let octavemark = {
                        x: 0,
                        y: mixm.gridTop() + 12 * oo,
                        w: 2 * zoomPrefixLevelsCSS[zz].minZoom,
                        h: 2 * zoomPrefixLevelsCSS[zz].minZoom,
                        css: 'octaveMark'
                    };
                    this.leftZoomAnchors[zz].content.push(octavemark);
                    let nm = {
                        x: 0,
                        y: mixm.gridTop() + 12 * oo * mixm.notePathHeight + 2 * zoomPrefixLevelsCSS[zz].minZoom,
                        text: '' + (mixm.octaveCount - oo + 0),
                        css: 'octaveLabel' + zoomPrefixLevelsCSS[zz].prefix
                    };
                    this.leftZoomAnchors[zz].content.push(nm);
                    if (zz < 2) {
                        let nm = {
                            x: 0,
                            y: mixm.gridTop() + 12 * oo * mixm.notePathHeight + 1 * zoomPrefixLevelsCSS[zz].minZoom + 6 * mixm.notePathHeight,
                            text: '' + (mixm.octaveCount - oo + 0),
                            css: 'octaveSubLabel' + zoomPrefixLevelsCSS[zz].prefix
                        };
                        this.leftZoomAnchors[zz].content.push(nm);
                        if (zz < 1) {
                            let nm = {
                                x: 0,
                                y: mixm.gridTop() + 12 * oo * mixm.notePathHeight + 1 * zoomPrefixLevelsCSS[zz].minZoom + 3 * mixm.notePathHeight,
                                text: '' + (mixm.octaveCount - oo + 0),
                                css: 'octaveSubLabel' + zoomPrefixLevelsCSS[zz].prefix
                            };
                            this.leftZoomAnchors[zz].content.push(nm);
                            nm = {
                                x: 0,
                                y: mixm.gridTop() + 12 * oo * mixm.notePathHeight + 1 * zoomPrefixLevelsCSS[zz].minZoom + 9 * mixm.notePathHeight,
                                text: '' + (mixm.octaveCount - oo + 0),
                                css: 'octaveSubLabel' + zoomPrefixLevelsCSS[zz].prefix
                            };
                            this.leftZoomAnchors[zz].content.push(nm);
                        }
                    }
                }
            }
            if (data.tracks.length > 0) {
                let trackLabel = {
                    text: '' + data.tracks[0].title, x: 0, y: mixm.gridTop(), css: 'octaveSubLabel' + zoomPrefixLevelsCSS[zz].prefix
                };
                this.leftZoomAnchors[zz].content.push(trackLabel);
            }
            if (zz < 4) {
                for (let ss = 0; ss < data.percussions.length; ss++) {
                    let samplerLabel = {
                        text: '' + data.percussions[ss].title,
                        x: 0,
                        y: mixm.samplerTop() + mixm.notePathHeight * ss + mixm.notePathHeight,
                        css: 'samplerRowLabel' + zoomPrefixLevelsCSS[zz].prefix
                    };
                    this.leftZoomAnchors[zz].content.push(samplerLabel);
                }
            }
        }
    }
}
class SamplerRows {
}
class BarOctave {
    constructor(barIdx, octaveIdx, left, top, width, height, barOctaveGridAnchor, barOctaveTrackAnchor, barOctaveFirstAnchor, zoomLevel, data) {
        new OctaveContent(barIdx, octaveIdx, left, top, width, height, data, barOctaveTrackAnchor, barOctaveFirstAnchor, zoomLevel);
    }
}
class OctaveContent {
    constructor(barIdx, octaveIdx, left, top, width, height, data, barOctaveTrackAnchor, barOctaveFirstAnchor, zoomLevel) {
        if (zoomLevel < 8) {
            this.addUpperNotes(barIdx, octaveIdx, left, top, width, height, barOctaveFirstAnchor, data, zoomLevel);
            if (zoomLevel < 7) {
                this.addOtherNotes(barIdx, octaveIdx, left, top, width, height, barOctaveTrackAnchor, data);
            }
        }
    }
    addUpperNotes(barIdx, octaveIdx, left, top, width, height, barOctaveAnchor, data, zoomLevel) {
        if (data.tracks.length) {
            if (zoomLevel == 0) {
                this.addTrackNotes(data.tracks[0], barIdx, octaveIdx, left, top, width, height, barOctaveAnchor, data, 'mixNoteLine', true);
            }
            else {
                this.addTrackNotes(data.tracks[0], barIdx, octaveIdx, left, top, width, height, barOctaveAnchor, data, 'mixNoteLine', false);
            }
        }
    }
    addOtherNotes(barIdx, octaveIdx, left, top, width, height, barOctaveAnchor, data) {
        for (let ii = 1; ii < data.tracks.length; ii++) {
            let track = data.tracks[ii];
            this.addTrackNotes(track, barIdx, octaveIdx, left, top, width, height, barOctaveAnchor, data, 'mixNoteSub', false);
        }
    }
    addTrackNotes(track, barIdx, octaveIdx, left, top, width, height, barOctaveAnchor, data, css, addMoreInfo) {
        let mixm = new MixerDataMath(data);
        let measure = track.measures[barIdx];
        for (let cc = 0; cc < measure.chords.length; cc++) {
            let chord = measure.chords[cc];
            for (let nn = 0; nn < chord.notes.length; nn++) {
                let note = chord.notes[nn];
                let from = octaveIdx * 12;
                let to = (octaveIdx + 1) * 12;
                if (note.pitch >= from && note.pitch < to) {
                    let x1 = left + MZMM().set(chord.skip).duration(data.timeline[barIdx].tempo) * mixm.widthDurationRatio;
                    let y1 = top + height - (note.pitch - from) * mixm.notePathHeight;
                    for (let ss = 0; ss < note.slides.length; ss++) {
                        let x2 = x1
                            + MZMM()
                                .set(note.slides[ss].duration)
                                .duration(data.timeline[barIdx].tempo)
                                * mixm.widthDurationRatio;
                        let y2 = y1 + note.slides[ss].delta * mixm.notePathHeight;
                        let rx1 = x1 + mixm.notePathHeight / 2;
                        let rx2 = x2 - mixm.notePathHeight / 2;
                        if (rx2 - rx1 < 0.00001) {
                            rx2 = rx1 + 0.00001;
                        }
                        if (barOctaveAnchor.ww < rx2 - barOctaveAnchor.xx) {
                            barOctaveAnchor.ww = rx2 - barOctaveAnchor.xx;
                        }
                        let line = {
                            x1: rx1,
                            y1: y1 - mixm.notePathHeight / 2,
                            x2: rx2,
                            y2: y2 - mixm.notePathHeight / 2,
                            css: css
                        };
                        barOctaveAnchor.content.push(line);
                        if (addMoreInfo) {
                            let txt = '' + (barIdx + 1)
                                + ':' + chord.skip.count + '/' + chord.skip.part
                                + '(' + note.pitch
                                + '-' + note.slides[0].duration.count + '/' + note.slides[0].duration.part
                                + ')';
                            let info = { x: x1, y: y1 + 0.25, text: txt, css: 'timeBarNum025' };
                            barOctaveAnchor.content.push(info);
                        }
                        x1 = x2;
                        y1 = y2;
                    }
                }
            }
        }
    }
}
class MixerBar {
    constructor(barIdx, left, ww, zoomLevel, gridZoomBarAnchor, tracksZoomBarAnchor, firstZoomBarAnchor, data) {
        let mixm = new MixerDataMath(data);
        let h12 = 12 * mixm.notePathHeight;
        for (let oo = 0; oo < mixm.octaveCount; oo++) {
            let gridOctaveAnchor = {
                showZoom: zoomPrefixLevelsCSS[zoomLevel].minZoom,
                hideZoom: zoomPrefixLevelsCSS[zoomLevel + 1].minZoom,
                xx: left,
                yy: mixm.gridTop() + oo * h12,
                ww: ww,
                hh: h12, content: [],
                id: 'octaveGridz' + zoomLevel + 'b' + barIdx + 'o' + oo + 'r' + Math.random()
            };
            gridZoomBarAnchor.content.push(gridOctaveAnchor);
            let tracksOctaveAnchor = {
                showZoom: zoomPrefixLevelsCSS[zoomLevel].minZoom,
                hideZoom: zoomPrefixLevelsCSS[zoomLevel + 1].minZoom,
                xx: left,
                yy: mixm.gridTop() + oo * h12,
                ww: ww,
                hh: h12, content: [],
                id: 'octaveTracks' + zoomLevel + 'b' + barIdx + 'o' + oo + 'r' + Math.random()
            };
            tracksZoomBarAnchor.content.push(tracksOctaveAnchor);
            let firstOctaveAnchor = {
                showZoom: zoomPrefixLevelsCSS[zoomLevel].minZoom,
                hideZoom: zoomPrefixLevelsCSS[zoomLevel + 1].minZoom,
                xx: left,
                yy: mixm.gridTop() + oo * h12,
                ww: ww,
                hh: h12, content: [],
                id: 'octaveFirst' + zoomLevel + 'b' + barIdx + 'o' + oo + 'r' + Math.random()
            };
            firstZoomBarAnchor.content.push(firstOctaveAnchor);
            new BarOctave(barIdx, (mixm.octaveCount - oo - 1), left, mixm.gridTop() + oo * h12, ww, h12, gridOctaveAnchor, tracksOctaveAnchor, firstOctaveAnchor, zoomLevel, data);
            if (firstZoomBarAnchor.ww < firstOctaveAnchor.ww) {
                firstZoomBarAnchor.ww = firstOctaveAnchor.ww;
            }
            if (tracksZoomBarAnchor.ww < tracksOctaveAnchor.ww) {
                tracksZoomBarAnchor.ww = tracksOctaveAnchor.ww;
            }
        }
        if (zoomLevel < 6) {
            this.addOctaveGridSteps(barIdx, data, left, ww, gridZoomBarAnchor, zoomLevel);
        }
    }
    addOctaveGridSteps(barIdx, data, barLeft, width, barOctaveAnchor, zIndex) {
        let zoomInfo = zoomPrefixLevelsCSS[zIndex];
        let curBar = data.timeline[barIdx];
        let mixm = new MixerDataMath(data);
        let lineCount = 0;
        let skip = MZMM().set({ count: 0, part: 1 });
        let top = mixm.gridTop();
        let height = mixm.gridHeight();
        let barRightBorder = {
            x: barLeft + width,
            y: top,
            w: zoomPrefixLevelsCSS[zIndex].minZoom * 0.25,
            h: height,
            css: 'barRightBorder'
        };
        barOctaveAnchor.content.push(barRightBorder);
        if (data.percussions.length) {
            let barSamRightBorder = {
                x: barLeft + width,
                y: mixm.samplerTop(),
                w: zoomPrefixLevelsCSS[zIndex].minZoom * 0.25,
                h: data.percussions.length * mixm.notePathHeight,
                css: 'barRightBorder'
            };
            barOctaveAnchor.content.push(barSamRightBorder);
        }
        if (zoomInfo.gridLines.length > 0) {
            while (true) {
                let line = zoomInfo.gridLines[lineCount];
                skip = skip.plus(line.duration).simplyfy();
                if (!skip.less(curBar.metre)) {
                    break;
                }
                let xx = barLeft + skip.duration(curBar.tempo) * mixm.widthDurationRatio;
                let mark = {
                    x: xx,
                    y: top,
                    w: line.ratio * zoomInfo.minZoom / 2,
                    h: height,
                    css: 'timeMeasureMark'
                };
                barOctaveAnchor.content.push(mark);
                if (data.percussions.length) {
                    let sammark = {
                        x: xx,
                        y: mixm.samplerTop(),
                        w: line.ratio * zoomInfo.minZoom / 2,
                        h: data.percussions.length * mixm.notePathHeight,
                        css: 'timeMeasureMark'
                    };
                    barOctaveAnchor.content.push(sammark);
                }
                lineCount++;
                if (lineCount >= zoomInfo.gridLines.length) {
                    lineCount = 0;
                }
            }
        }
    }
}
class MixerUI {
    constructor() {
        this.levels = [];
    }
    reFillMixerUI(data) {
        let mixm = new MixerDataMath(data);
        let ww = mixm.mixerWidth();
        let hh = mixm.mixerHeight();
        for (let ii = 0; ii < zoomPrefixLevelsCSS.length - 1; ii++) {
            this.gridLayers.anchors[ii].ww = ww;
            this.gridLayers.anchors[ii].hh = hh;
            this.trackLayers.anchors[ii].ww = ww;
            this.trackLayers.anchors[ii].hh = hh;
            this.firstLayers.anchors[ii].ww = ww;
            this.firstLayers.anchors[ii].hh = hh;
            this.levels[ii].reCreateBars(data);
        }
        this.fillerAnchor.xx = mixm.LeftPad;
        this.fillerAnchor.yy = mixm.gridTop();
        this.fillerAnchor.ww = mixm.mixerWidth() - mixm.LeftPad - mixm.rightPad;
        this.fillerAnchor.hh = mixm.gridHeight();
        this.reFillTracksRatio(data);
    }
    createMixerLayers() {
        let tracksLayerZoom = document.getElementById('tracksLayerZoom');
        this.trackLayers = { g: tracksLayerZoom, anchors: [], mode: LevelModes.normal };
        let gridLayerZoom = document.getElementById('gridLayerZoom');
        this.gridLayers = { g: gridLayerZoom, anchors: [], mode: LevelModes.normal };
        let firstLayerZoom = document.getElementById('firstLayerZoom');
        this.firstLayers = { g: firstLayerZoom, anchors: [], mode: LevelModes.normal };
        for (let ii = 0; ii < zoomPrefixLevelsCSS.length - 1; ii++) {
            let mixerGridAnchor = {
                showZoom: zoomPrefixLevelsCSS[ii].minZoom,
                hideZoom: zoomPrefixLevelsCSS[ii + 1].minZoom,
                xx: 0, yy: 0, ww: 1, hh: 1, content: []
            };
            this.gridLayers.anchors.push(mixerGridAnchor);
            let mixerTrackAnchor = {
                showZoom: zoomPrefixLevelsCSS[ii].minZoom,
                hideZoom: zoomPrefixLevelsCSS[ii + 1].minZoom,
                xx: 0, yy: 0, ww: 1, hh: 1, content: []
            };
            this.trackLayers.anchors.push(mixerTrackAnchor);
            let mixerFirstAnchor = {
                showZoom: zoomPrefixLevelsCSS[ii].minZoom,
                hideZoom: zoomPrefixLevelsCSS[ii + 1].minZoom,
                xx: 0, yy: 0, ww: 1, hh: 1, content: []
            };
            this.firstLayers.anchors.push(mixerFirstAnchor);
            this.levels.push(new MixerZoomLevel(ii, mixerGridAnchor, mixerTrackAnchor, mixerFirstAnchor));
        }
        this.fillerAnchor = {
            showZoom: zoomPrefixLevelsCSS[6].minZoom,
            hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom + 1,
            xx: 0, yy: 0, ww: 1, hh: 1, content: []
        };
        this.gridLayers.anchors.push(this.fillerAnchor);
        return [this.gridLayers, this.trackLayers, this.firstLayers];
    }
    reFillTracksRatio(data) {
        let mixm = new MixerDataMath(data);
        let mxNotes = 0;
        let mxDrums = 0;
        for (let bb = 0; bb < data.timeline.length; bb++) {
            let notecount = 0;
            let drumcount = 0;
            for (let tt = 0; tt < data.tracks.length; tt++) {
                let bar = data.tracks[tt].measures[bb];
                if (bar) {
                    for (let cc = 0; cc < bar.chords.length; cc++) {
                        notecount = notecount + bar.chords[cc].notes.length;
                    }
                }
            }
            if (mxNotes < notecount) {
                mxNotes = notecount;
            }
            for (let tt = 0; tt < data.percussions.length; tt++) {
                let bar = data.percussions[tt].measures[bb];
                if (bar) {
                    drumcount = drumcount + bar.skips.length;
                }
            }
            if (mxDrums < drumcount) {
                mxDrums = drumcount;
            }
        }
        this.fillerAnchor.content = [];
        let barX = 0;
        for (let bb = 0; bb < data.timeline.length; bb++) {
            let notecount = 0;
            for (let tt = 0; tt < data.tracks.length; tt++) {
                let bar = data.tracks[tt].measures[bb];
                for (let cc = 0; cc < bar.chords.length; cc++) {
                    notecount = notecount + bar.chords[cc].notes.length;
                }
            }
            let css = 'mixFiller' + (1 + Math.round(7 * notecount / mxNotes));
            let barwidth = MZMM().set(data.timeline[bb].metre).duration(data.timeline[bb].tempo) * mixm.widthDurationRatio;
            let fillRectangle = {
                x: mixm.LeftPad + barX,
                y: mixm.gridTop(),
                w: barwidth,
                h: mixm.gridHeight(),
                css: css
            };
            this.fillerAnchor.content.push(fillRectangle);
            if (data.percussions.length) {
                let drumcount = 0;
                for (let tt = 0; tt < data.percussions.length; tt++) {
                    let bar = data.percussions[tt].measures[bb];
                    if (bar) {
                        drumcount = drumcount + bar.skips.length;
                    }
                }
                let css2 = 'mixFiller' + (1 + Math.round(7 * drumcount / mxDrums));
                let fillDrumBar = {
                    x: mixm.LeftPad + barX,
                    y: mixm.samplerTop(),
                    w: barwidth,
                    h: data.percussions.length * mixm.notePathHeight,
                    css: css2
                };
                this.fillerAnchor.content.push(fillDrumBar);
            }
            barX = barX + barwidth;
        }
    }
}
class MixerZoomLevel {
    constructor(zoomLevel, anchorGrid, anchorTracks, anchorFirst) {
        this.zoomLevelIndex = zoomLevel;
        this.zoomGridAnchor = anchorGrid;
        this.zoomTracksAnchor = anchorTracks;
        this.zoomFirstAnchor = anchorFirst;
    }
    reCreateBars(data) {
        let mixm = new MixerDataMath(data);
        this.zoomGridAnchor.content = [];
        this.zoomTracksAnchor.content = [];
        this.zoomFirstAnchor.content = [];
        this.bars = [];
        let left = mixm.LeftPad;
        let width = 0;
        for (let ii = 0; ii < data.timeline.length; ii++) {
            let timebar = data.timeline[ii];
            width = MZMM().set(timebar.metre).duration(timebar.tempo) * mixm.widthDurationRatio;
            let barGridAnchor = {
                showZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom, hideZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex + 1].minZoom,
                xx: left, yy: 0, ww: width, hh: mixm.mixerHeight(), content: [], id: 'barGrid' + (ii + Math.random())
            };
            this.zoomGridAnchor.content.push(barGridAnchor);
            let barTracksAnchor = {
                showZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom, hideZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex + 1].minZoom,
                xx: left, yy: 0, ww: width, hh: mixm.mixerHeight(), content: [], id: 'barTrack' + (ii + Math.random())
            };
            this.zoomTracksAnchor.content.push(barTracksAnchor);
            let barFirstAnchor = {
                showZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom, hideZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex + 1].minZoom,
                xx: left, yy: 0, ww: width, hh: mixm.mixerHeight(), content: [], id: 'barFirst' + (ii + Math.random())
            };
            this.zoomFirstAnchor.content.push(barFirstAnchor);
            let mixBar = new MixerBar(ii, left, width, this.zoomLevelIndex, barGridAnchor, barTracksAnchor, barFirstAnchor, data);
            this.bars.push(mixBar);
            left = left + width;
        }
        let titleLabel = { x: 0, y: mixm.gridTop() - zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom * 2, text: data.title, css: 'titleLabel' + zoomPrefixLevelsCSS[this.zoomLevelIndex].prefix };
        this.zoomGridAnchor.content.push(titleLabel);
        if (this.zoomLevelIndex < 4) {
            for (let ss = 1; ss < data.percussions.length; ss++) {
                let line = {
                    x: mixm.LeftPad,
                    y: mixm.samplerTop() + mixm.notePathHeight * ss,
                    h: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom / 8.0,
                    w: mixm.timelineWidth(), css: 'samplerRowBorder'
                };
                this.zoomGridAnchor.content.push(line);
            }
        }
        this.addLines(this.zoomGridAnchor, data);
    }
    addLines(barOctaveAnchor, data) {
        let mixm = new MixerDataMath(data);
        if (this.zoomLevelIndex < 4) {
            for (let oo = 1; oo < mixm.octaveCount; oo++) {
                let octaveBottomBorder = {
                    x: mixm.LeftPad,
                    y: mixm.gridTop() + oo * 12 * mixm.notePathHeight,
                    w: mixm.timelineWidth(),
                    h: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom / 8.0,
                    css: 'octaveBottomBorder'
                };
                barOctaveAnchor.content.push(octaveBottomBorder);
                if (this.zoomLevelIndex < 3) {
                    for (let kk = 1; kk < 12; kk++) {
                        barOctaveAnchor.content.push({
                            x: mixm.LeftPad,
                            y: mixm.gridTop() + (oo * 12 + kk) * mixm.notePathHeight,
                            w: mixm.timelineWidth(),
                            h: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom / 32.0,
                            css: 'octaveBottomBorder'
                        });
                    }
                }
            }
        }
    }
}
class IconLabelButton {
    constructor(labels, cssBG, cssLabel, action) {
        this.left = 0;
        this.top = 0;
        this.selection = 0;
        this.labels = labels;
        this.action = action;
        this.bg = { x: 0, y: 0, w: 5, h: 5, rx: 0.4, ry: 0.4, css: cssBG };
        this.spot = {
            x: 0, y: 0, w: 1, h: 1, css: 'transparentSpot', activation: (x, y) => {
                this.selection++;
                if (this.selection > this.labels.length - 1) {
                    this.selection = 0;
                }
                this.label.text = this.labels[this.selection];
                this.action(this.selection);
            }
        };
        this.label = { x: 0, y: 0, text: this.labels[this.selection], css: cssLabel };
        this.anchor = {
            xx: 0, yy: 0, ww: 111, hh: 111,
            showZoom: zoomPrefixLevelsCSS[0].minZoom,
            hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom,
            content: [
                this.bg,
                this.label,
                this.spot
            ]
        };
    }
    resize(left, top, size) {
        this.bg.x = left + 0.1;
        this.bg.y = top + 0.1;
        this.bg.w = 0.8 * size;
        this.bg.h = 0.8 * size;
        this.bg.rx = 0.4 * size;
        this.bg.ry = 0.4 * size;
        this.label.x = left + 0.5;
        this.label.y = top + 0.69;
        this.spot.x = left;
        this.spot.y = top;
    }
}
let icon_play = '&#xf3aa;';
let icon_pause = '&#xf3a7;';
let icon_hor_menu = '&#xf19c;';
let icon_ver_menu = '&#xf19b;';
let icon_closemenu = '&#xf1ea;';
let icon_closedbranch = '&#xf2f6;';
let icon_openedbranch = '&#xf2f2;';
let icon_openleft = '&#xf244;';
let icon_closeleft = '&#xf243;';
let icon_moveup = '&#xf2fc;';
let icon_movedown = '&#xf2f9;';
let icon_moveleft = '&#xf2fa;';
let icon_moveright = '&#xf2fb;';
let icon_warningPlay = '&#xf2f5;';
let icon_gear = '&#xf1c6;';
let icon_sound_low = '&#xf3ba;';
let icon_sound_middle = '&#xf3b9;';
let icon_sound_loud = '&#xf3bc;';
let icon_sound_none = '&#xf3bb;';
let icon_sound_surround = '&#xf3b7;';
let icon_hide = '&#xf15b;';
class DebugLayerUI {
    allLayers() {
        return [this.debugLayer];
    }
    setupUI() {
        this.debugRectangle = { x: 0, y: 0, w: 1, h: 1, rx: 10, ry: 10, css: 'debug' };
        this.debugGroup = document.getElementById("debugLayer");
        this.debugAnchor = {
            xx: 0, yy: 0, ww: 1, hh: 1,
            showZoom: zoomPrefixLevelsCSS[0].minZoom,
            hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom,
            content: []
        };
        this.debugLayer = {
            g: this.debugGroup, anchors: [
                this.debugAnchor
            ], mode: LevelModes.normal
        };
    }
    resetDebugView(data) {
        let mixm = new MixerDataMath(data);
        let ww = mixm.mixerWidth();
        let hh = mixm.mixerHeight();
        this.debugRectangle.w = ww;
        this.debugRectangle.h = hh;
        this.debugAnchor.ww = ww;
        this.debugAnchor.hh = hh;
    }
    deleteDebbugView() {
    }
}
class WarningUI {
    constructor() {
        this.cancel = function () {
            this.hideWarning();
        };
    }
    initDialogUI() {
        this.warningIcon = { x: 0, y: 0, text: icon_warningPlay, css: 'warningIcon' };
        this.warningTitle = { x: 0, y: 0, text: 'Title', css: 'warningTitle' };
        this.warningDescription = { x: 0, y: 0, text: 'Some optional text information.', css: 'warningDescription' };
        this.warningGroup = document.getElementById("warningDialogGroup");
        this.warningRectangle = { x: 0, y: 0, w: 1, h: 1, css: 'warningBG', activation: this.cancel.bind(this) };
        this.warningAnchor = {
            id: 'warningAnchor', xx: 0, yy: 0, ww: 1, hh: 1,
            showZoom: zoomPrefixLevelsCSS[0].minZoom,
            hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom + 1,
            content: [this.warningRectangle, this.warningIcon, this.warningTitle, this.warningDescription]
        };
        this.warningLayer = { g: this.warningGroup, anchors: [this.warningAnchor], mode: LevelModes.overlay };
    }
    resetDialogView(data) {
    }
    resizeDialog(ww, hh, resetWarningAnchor) {
        this.warningRectangle.w = ww;
        this.warningRectangle.h = hh;
        this.warningAnchor.ww = ww;
        this.warningAnchor.hh = hh;
        this.warningIcon.x = ww / 2;
        this.warningIcon.y = hh / 3;
        this.warningTitle.x = ww / 2;
        this.warningTitle.y = hh / 3 + 1.5;
        this.warningDescription.x = ww / 2;
        this.warningDescription.y = hh / 3 + 2;
        resetWarningAnchor();
    }
    allLayers() {
        return [this.warningLayer];
    }
    showWarning() {
        document.getElementById("warningDialogGroup").style.visibility = "visible";
    }
    hideWarning() {
        document.getElementById("warningDialogGroup").style.visibility = "hidden";
    }
}
let mzxbxProjectForTesting2 = {
    title: 'test data for debug',
    timeline: [
        { tempo: 120, metre: { count: 4, part: 4 } },
        { tempo: 120, metre: { count: 4, part: 4 } },
        { tempo: 200, metre: { count: 3, part: 4 } },
        { tempo: 180, metre: { count: 4, part: 4 } },
        { tempo: 200, metre: { count: 3, part: 4 } },
        { tempo: 180, metre: { count: 4, part: 4 } },
        { tempo: 200, metre: { count: 3, part: 4 } },
        { tempo: 180, metre: { count: 4, part: 4 } },
        { tempo: 200, metre: { count: 3, part: 4 } },
        { tempo: 180, metre: { count: 4, part: 4 } }
    ],
    tracks: [
        {
            title: "Track one", measures: [
                {
                    chords: [
                        { skip: { count: 0, part: 1 }, notes: [{ pitch: 25, slides: [] }] },
                        { skip: { count: 1, part: 16 }, notes: [{ pitch: 26, slides: [] }] },
                        { skip: { count: 1, part: 8 }, notes: [{ pitch: 27, slides: [] }] },
                        { skip: { count: 3, part: 16 }, notes: [{ pitch: 28, slides: [] }] },
                        { skip: { count: 1, part: 4 }, notes: [{ pitch: 29, slides: [] }] },
                        { skip: { count: 5, part: 16 }, notes: [{ pitch: 30, slides: [] }] },
                        { skip: { count: 3, part: 8 }, notes: [{ pitch: 31, slides: [] }] },
                        { skip: { count: 7, part: 16 }, notes: [{ pitch: 32, slides: [] }] },
                        { skip: { count: 1, part: 2 }, notes: [{ pitch: 33, slides: [] }] }
                    ]
                }, { chords: [
                        { skip: { count: 0, part: 2 }, notes: [{ pitch: 31, slides: [] }] }
                    ] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }
            ], filters: [], performer: { id: '', data: '' }
        },
        {
            title: "Second track", measures: [
                { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }
            ], filters: [], performer: { id: '', data: '' }
        },
        {
            title: "Third track", measures: [
                { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }
            ], filters: [], performer: { id: '', data: '' }
        }
    ],
    percussions: [
        { title: "Snare", measures: [], filters: [], sampler: { id: '', data: '' } },
        { title: "Snare2", measures: [], filters: [], sampler: { id: '', data: '' } },
        { title: "Snare3", measures: [], filters: [], sampler: { id: '', data: '' } }
    ],
    comments: [{ texts: [] }, { texts: [] }, { texts: [] }, { texts: [] }],
    filters: []
};
let testBigMixerData = {
    title: 'test data for debug',
    timeline: [
        { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } },
        { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } },
        { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } },
        { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } },
        { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } },
        { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } },
        { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } },
        { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } },
        { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } },
        { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } },
        { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } },
        { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } },
        { tempo: 120, metre: { count: 7, part: 8 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } },
        { tempo: 120, metre: { count: 2, part: 2 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } },
        { tempo: 120, metre: { count: 5, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } },
        { tempo: 120, metre: { count: 3, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } },
        { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } },
        { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } },
        { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } },
        { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } },
        { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } },
        { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } },
        { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } },
        { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } },
        { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } },
        { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } },
        { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } },
        { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } },
        { tempo: 120, metre: { count: 7, part: 8 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } },
        { tempo: 120, metre: { count: 2, part: 2 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } },
        { tempo: 120, metre: { count: 5, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } },
        { tempo: 120, metre: { count: 3, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }
    ],
    notePathHeight: 0.25,
    widthDurationRatio: 15,
    pitchedTracks: [
        { title: 'Test track 1' },
        { title: 'Test track 2' },
        { title: 'Test track 3' },
        { title: 'Test track 4' },
        { title: 'Test track 5' },
        { title: 'Test track 6' },
        { title: 'Test track 7' },
        { title: 'Test track 8' },
        { title: 'Test track 9' },
        { title: 'Test track 10' },
        { title: 'Test track 11' },
        { title: 'Test track 12' },
        { title: 'Test track 13' },
        { title: 'Test track 14' },
        { title: 'Test track 15' },
        { title: 'Test track 16' }
    ]
};
let testEmptyMixerData = {
    title: 'small data for debug',
    timeline: [
        { tempo: 120, metre: { count: 4, part: 4 } }
    ],
    notePathHeight: 0.25,
    widthDurationRatio: 11,
    pitchedTracks: [
        { title: 'A track1' },
        { title: 'Second track' }
    ]
};
class MixerDataMath {
    constructor(data) {
        this.titleHeight = 33;
        this.LeftPad = 3;
        this.rightPad = 10;
        this.bottomMixerPad = 11;
        this.notePathHeight = 1;
        this.widthDurationRatio = 27;
        this.octaveCount = 10;
        this.sequencerBottomPad = 2;
        this.data = data;
    }
    mixerWidth() {
        return this.LeftPad + this.timelineWidth() + this.rightPad;
    }
    timelineWidth() {
        let mm = MZMM();
        let ww = 0;
        for (let ii = 0; ii < this.data.timeline.length; ii++) {
            ww = ww + mm.set(this.data.timeline[ii].metre).duration(this.data.timeline[ii].tempo) * this.widthDurationRatio;
        }
        return ww;
    }
    mixerHeight() {
        return this.titleHeight
            + this.gridHeight()
            + this.sequencerBottomPad
            + this.data.percussions.length * this.notePathHeight
            + this.bottomMixerPad;
    }
    gridTop() {
        return this.titleHeight;
    }
    samplerTop() {
        return this.gridTop() + this.gridHeight() + this.sequencerBottomPad;
    }
    gridHeight() {
        return this.notePathHeight * this.octaveCount * 12;
    }
}
let biChar32 = [];
biChar32[0] = '0';
biChar32[1] = '1';
biChar32[2] = '2';
biChar32[3] = '3';
biChar32[4] = '4';
biChar32[5] = '5';
biChar32[6] = '6';
biChar32[7] = '7';
biChar32[8] = '8';
biChar32[9] = '9';
biChar32[10] = 'a';
biChar32[11] = 'b';
biChar32[12] = 'c';
biChar32[13] = 'd';
biChar32[14] = 'e';
biChar32[15] = 'f';
biChar32[16] = 'g';
biChar32[17] = 'h';
biChar32[18] = 'i';
biChar32[19] = 'j';
biChar32[20] = 'k';
biChar32[21] = 'l';
biChar32[22] = 'm';
biChar32[23] = 'n';
biChar32[24] = '0';
biChar32[25] = 'p';
biChar32[26] = 'q';
biChar32[27] = 'r';
biChar32[28] = 's';
biChar32[29] = 't';
biChar32[30] = 'u';
biChar32[31] = 'v';
function testNumMathUtil() {
}
console.log('Tile Level API');
var LevelModes;
(function (LevelModes) {
    LevelModes[LevelModes["normal"] = 0] = "normal";
    LevelModes[LevelModes["left"] = 1] = "left";
    LevelModes[LevelModes["right"] = 2] = "right";
    LevelModes[LevelModes["top"] = 3] = "top";
    LevelModes[LevelModes["bottom"] = 4] = "bottom";
    LevelModes[LevelModes["overlay"] = 5] = "overlay";
})(LevelModes || (LevelModes = {}));
;
function TAnchor(xx, yy, ww, hh, showZoom, hideZoom, id, translation) {
    return { xx: xx, yy: yy, ww: ww, hh: hh, showZoom: showZoom, hideZoom: hideZoom, content: [], id: id };
}
function TText(x, y, css, text) {
    return { x: x, y: y, text: text, css: css, };
}
//# sourceMappingURL=application.js.map