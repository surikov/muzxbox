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
class PluginDialogPrompt {
    constructor() {
        this.dialogID = '?';
        window.addEventListener('message', this.receiveMessageFromPlugin.bind(this), false);
    }
    openDialogFrame(label, url, callback) {
        this.waitCallback = callback;
        let pluginTitle = document.getElementById("pluginTitle");
        pluginTitle.innerHTML = label;
        let pluginFrame = document.getElementById("pluginFrame");
        this.dialogID = '' + Math.random();
        let me = this;
        if (pluginFrame) {
            if (pluginFrame.contentWindow) {
                pluginFrame.onload = function () {
                    me.sendMessageToPlugin('');
                };
                pluginFrame.src = url;
                document.getElementById("pluginDiv").style.visibility = "visible";
            }
        }
    }
    sendMessageToPlugin(data) {
        console.log('sendMessageToPlugin', this.dialogID);
        let pluginFrame = document.getElementById("pluginFrame");
        if (pluginFrame) {
            let message = { dialog: this.dialogID, data: data };
            let txt = JSON.stringify(message);
            pluginFrame.contentWindow.postMessage(txt, '*');
        }
    }
    closeDialogFrame() {
        document.getElementById("pluginDiv").style.visibility = "hidden";
    }
    receiveMessageFromPlugin(e) {
        let parsed = null;
        try {
            parsed = JSON.parse(e.data);
        }
        catch (xxx) {
            console.log(xxx);
        }
        console.log('parsed', parsed);
        if (parsed) {
            if (parsed.dialog == this.dialogID) {
                console.log('data', parsed.data);
                let close = this.waitCallback(parsed.data);
                if (close) {
                    this.closeDialogFrame();
                }
            }
            else {
                console.log('wrong received message id', parsed.id, this.dialogID);
            }
        }
        else {
            console.log('wrong received object');
        }
    }
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
        this.cfg = new MixerDataMathUtility(data);
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
        let it = this.cfg.data.tracks[trackNum];
        this.cfg.data.tracks.splice(trackNum, 1);
        this.cfg.data.tracks.unshift(it);
        commandDispatcher.resetProject();
    }
    moveDrumTop(drumNum) {
        let it = this.cfg.data.percussions[drumNum];
        this.cfg.data.percussions.splice(drumNum, 1);
        this.cfg.data.percussions.unshift(it);
        commandDispatcher.resetProject();
    }
    setTrackSoloState(state) {
        console.log('setTrackSoloState', state);
    }
    setDrumSoloState(state) {
        console.log('setDrumSoloState', state);
    }
    promptPluginGUI(label, url, callback) {
        console.log('promptPluginGUI', url);
        pluginDialogPrompt.openDialogFrame(label, url, callback);
    }
    cancelPluginGUI() {
        console.log('cancelPluginGUI');
        pluginDialogPrompt.closeDialogFrame();
    }
    expandTimeLineSelection(idx) {
        console.log('select bar', idx);
        if (this.cfg.data) {
            if (idx >= 0 && idx < this.cfg.data.timeline.length) {
                let curPro = this.cfg.data;
                if (curPro.selection) {
                    let curProjectSelection = curPro.selection;
                    if (curProjectSelection.startMeasure == curProjectSelection.endMeasure) {
                        if (curProjectSelection.startMeasure == idx) {
                            curPro.selection = undefined;
                        }
                        else {
                            if (curProjectSelection.startMeasure > idx) {
                                curProjectSelection.endMeasure = curProjectSelection.startMeasure;
                                curProjectSelection.startMeasure = idx;
                            }
                            else {
                                curProjectSelection.endMeasure = idx;
                            }
                        }
                    }
                    else {
                        curProjectSelection.startMeasure = idx;
                        curProjectSelection.endMeasure = idx;
                    }
                }
                else {
                    curPro.selection = {
                        startMeasure: idx,
                        endMeasure: idx
                    };
                }
            }
        }
        this.renderer.timeselectbar.updateTimeSelectionBar(this.cfg);
        this.renderer.tiler.resetAnchor(this.renderer.timeselectbar.selectedTimeSVGGroup, this.renderer.timeselectbar.selectionAnchor, LevelModes.top);
    }
}
let commandDispatcher = new CommandDispatcher();
let pluginDialogPrompt = new PluginDialogPrompt();
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
        let vw = this.tileLevelSVG.clientWidth / this.tiler.tapPxSize();
        let vh = this.tileLevelSVG.clientHeight / this.tiler.tapPxSize();
        this.tiler.resetInnerSize(commandDispatcher.cfg.mixerWidth(), commandDispatcher.cfg.mixerHeight());
        this.mixer.reFillMixerUI(commandDispatcher.cfg);
        this.leftPanel.reFillLeftPanel(commandDispatcher.cfg);
        this.debug.resetDebugView(commandDispatcher.cfg);
        this.toolbar.resizeToolbar(vw, vh);
        this.menu.readCurrentSongData(commandDispatcher.cfg.data);
        this.menu.resizeMenu(vw, vh);
        this.warning.resizeDialog(vw, vh, () => {
            this.tiler.resetAnchor(this.warning.warningGroup, this.warning.warningAnchor, LevelModes.overlay);
        });
        this.timeselectbar.fillTimeBar(commandDispatcher.cfg);
        this.timeselectbar.resizeTimeScale(vw, vh);
        this.tiler.resetModel();
    }
    onReSizeView() {
        let mixH = 1;
        if (this.lastUsedData) {
            mixH = commandDispatcher.cfg.mixerHeight();
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
let localMenuPercussionFolder = 'localMenuPercussionFolder';
let localMenuImportFolder = 'localMenuImportFolder';
let localMenuFileFolder = 'localMenuFileFolder';
let localeDictionary = [
    {
        id: localNameLocal, data: [
            { locale: 'en', text: 'English' },
            { locale: 'ru', text: 'Русский' },
            { locale: 'zh', text: '中文' }
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
    },
    {
        id: localMenuPercussionFolder, data: [
            { locale: 'en', text: 'Sampler' },
            { locale: 'ru', text: 'Сэмплер' },
            { locale: 'zh', text: '?' }
        ]
    },
    {
        id: localMenuFileFolder, data: [
            { locale: 'en', text: 'File' },
            { locale: 'ru', text: 'Файл' },
            { locale: 'zh', text: '?' }
        ]
    }, {
        id: localMenuImportFolder, data: [
            { locale: 'en', text: 'Import' },
            { locale: 'ru', text: 'Импорт' },
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
        this.selectedTimeSVGGroup = document.getElementById("selectedTime");
        this.selectionMark = {
            x: 0,
            y: 0,
            w: 1,
            h: 1,
            css: 'timeSelection'
        };
        this.selectionAnchor = {
            xx: 0, yy: 0, ww: 1, hh: 1,
            showZoom: zoomPrefixLevelsCSS[0].minZoom,
            hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom,
            content: [this.selectionMark]
        };
        this.selectedTimeLayer = {
            g: this.selectedTimeSVGGroup, anchors: [this.selectionAnchor], mode: LevelModes.top
        };
        return [this.selectionBarLayer, this.selectedTimeLayer];
    }
    resizeTimeScale(viewWidth, viewHeight) {
        console.log('resizeTimeSelect', viewWidth, viewHeight);
        this.selectionAnchor.ww = viewWidth * 1024;
        this.selectionAnchor.hh = viewHeight * 1024;
        this.selectionMark.h = viewHeight * 1024;
    }
    updateTimeSelectionBar(cfg) {
        if (cfg.data.selection) {
            let mm = MMUtil();
            let barLeft = cfg.LeftPad;
            let startSel = 1;
            let widthSel = 0;
            let startIdx = 0;
            for (startIdx = 0; startIdx < cfg.data.timeline.length; startIdx++) {
                let curBar = cfg.data.timeline[startIdx];
                let curMeasureMeter = mm.set(curBar.metre);
                let barWidth = curMeasureMeter.duration(curBar.tempo) * cfg.widthDurationRatio;
                if (startIdx == cfg.data.selection.startMeasure) {
                    startSel = barLeft;
                    break;
                }
                barLeft = barLeft + barWidth;
            }
            for (let ii = startIdx; ii < cfg.data.timeline.length; ii++) {
                let curBar = cfg.data.timeline[ii];
                let curMeasureMeter = mm.set(curBar.metre);
                let barWidth = curMeasureMeter.duration(curBar.tempo) * cfg.widthDurationRatio;
                widthSel = widthSel + barWidth;
                if (ii == cfg.data.selection.endMeasure) {
                    break;
                }
            }
            if (widthSel) {
                this.selectionMark.x = startSel;
                this.selectionMark.w = widthSel;
            }
        }
        else {
            this.selectionMark.x = -1;
            this.selectionMark.w = 0.5;
        }
        console.log('updateTimeSelectionBar', this.selectionMark.x, this.selectionMark.w);
    }
    createBarMark(barIdx, barLeft, size, measureAnchor, cfg) {
        let mark = {
            x: barLeft, y: 0, w: size, h: size,
            css: 'timeMarkButtonCircle', activation: (x, y) => {
                commandDispatcher.expandTimeLineSelection(barIdx);
            }
        };
        measureAnchor.content.push(mark);
    }
    createBarNumber(barLeft, barnum, zz, curBar, measureAnchor, barTime) {
        let mins = Math.floor(barTime / 60);
        let secs = Math.floor(barTime % 60);
        let hunds = Math.round(100 * (barTime - Math.floor(barTime)));
        let nm = {
            x: barLeft,
            y: zoomPrefixLevelsCSS[zz].minZoom * 1,
            text: '' + (1 + barnum) + ': ' + mins + '\'' + (secs > 9 ? '' : '0') + secs + '.' + hunds,
            css: 'timeBarNum' + zoomPrefixLevelsCSS[zz].prefix
        };
        measureAnchor.content.push(nm);
        let bpm = {
            x: barLeft,
            y: zoomPrefixLevelsCSS[zz].minZoom * 2,
            text: '' + Math.round(curBar.tempo) + ': ' + curBar.metre.count + '/' + curBar.metre.part,
            css: 'timeBarInfo' + zoomPrefixLevelsCSS[zz].prefix
        };
        measureAnchor.content.push(bpm);
    }
    fillTimeBar(cfg) {
        this.selectBarAnchor.ww = cfg.mixerWidth();
        this.selectBarAnchor.hh = cfg.mixerHeight();
        this.zoomAnchors = [];
        for (let zz = 0; zz < zoomPrefixLevelsCSS.length - 1; zz++) {
            let selectLevelAnchor = {
                showZoom: zoomPrefixLevelsCSS[zz].minZoom,
                hideZoom: zoomPrefixLevelsCSS[zz + 1].minZoom,
                xx: 0, yy: 0, ww: cfg.mixerWidth(), hh: cfg.mixerHeight(), content: [],
                id: 'time' + (zz + Math.random())
            };
            this.zoomAnchors.push(selectLevelAnchor);
            let mm = MMUtil();
            let barLeft = cfg.LeftPad;
            let barTime = 0;
            for (let kk = 0; kk < cfg.data.timeline.length; kk++) {
                let curBar = cfg.data.timeline[kk];
                let curMeasureMeter = mm.set(curBar.metre);
                let barWidth = curMeasureMeter.duration(curBar.tempo) * cfg.widthDurationRatio;
                let measureAnchor = {
                    showZoom: zoomPrefixLevelsCSS[zz].minZoom,
                    hideZoom: zoomPrefixLevelsCSS[zz + 1].minZoom,
                    xx: barLeft, yy: 0, ww: barWidth, hh: 1234, content: [],
                    id: 'measure' + (kk + Math.random())
                };
                selectLevelAnchor.content.push(measureAnchor);
                if ((zz <= 4) || (zz == 5 && kk % 2 == 0) || (zz == 6 && kk % 4 == 0) || (zz == 7 && kk % 8 == 0) || (zz == 8 && kk % 16 == 0)) {
                    this.createBarMark(kk, barLeft, zoomPrefixLevelsCSS[zz].minZoom * 1.5, measureAnchor, cfg);
                    this.createBarNumber(barLeft, kk, zz, curBar, measureAnchor, barTime);
                }
                let zoomInfo = zoomPrefixLevelsCSS[zz];
                if (zoomInfo.gridLines.length > 0) {
                    let lineCount = 0;
                    let skip = MMUtil().set({ count: 0, part: 1 });
                    while (true) {
                        let line = zoomInfo.gridLines[lineCount];
                        skip = skip.plus(line.duration).simplyfy();
                        if (!skip.less(curBar.metre)) {
                            break;
                        }
                        if (line.label) {
                            let xx = barLeft + skip.duration(curBar.tempo) * cfg.widthDurationRatio;
                            let mark = {
                                x: xx, y: 0,
                                w: line.ratio * 2 * zoomInfo.minZoom,
                                h: line.ratio * 8 * zoomInfo.minZoom,
                                css: 'timeSubMark'
                            };
                            measureAnchor.content.push(mark);
                            let mtr = {
                                x: xx,
                                y: 0.5 * zoomInfo.minZoom,
                                text: '' + skip.count + '/' + skip.part,
                                css: 'timeBarInfo' + zoomPrefixLevelsCSS[zz].prefix
                            };
                            measureAnchor.content.push(mtr);
                        }
                        lineCount++;
                        if (lineCount >= zoomInfo.gridLines.length) {
                            lineCount = 0;
                        }
                    }
                }
                barLeft = barLeft + barWidth;
                barTime = barTime + curMeasureMeter.duration(curBar.tempo);
            }
        }
        this.selectBarAnchor.content = this.zoomAnchors;
        this.updateTimeSelectionBar(cfg);
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
let menuPointFileImport = {
    text: localMenuImportFolder
};
let menuPointMenuFile = {
    text: localMenuFileFolder,
    children: [menuPointFileImport]
};
function fillMenuImportPlugins() {
    menuPointFileImport.children = [];
    for (let ii = 0; ii < MZXBX_currentPlugins().length; ii++) {
        if (MZXBX_currentPlugins()[ii].group == 'import') {
            let label = MZXBX_currentPlugins()[ii].label;
            let url = MZXBX_currentPlugins()[ii].url;
            menuPointFileImport.children.push({
                text: label, noLocalization: true, onClick: () => {
                    commandDispatcher.promptPluginGUI(label, url, (obj) => {
                        commandDispatcher.registerWorkProject(obj);
                        commandDispatcher.resetProject();
                        return true;
                    });
                }
            });
        }
    }
}
function composeBaseMenu() {
    fillMenuImportPlugins();
    if (menuItemsData) {
        return menuItemsData;
    }
    else {
        menuItemsData = [
            menuPointMenuFile,
            menuPointTracks,
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
    reFillLeftPanel(cfg) {
        for (let zz = 0; zz < this.leftZoomAnchors.length; zz++) {
            this.leftZoomAnchors[zz].hh = cfg.mixerHeight();
            this.leftZoomAnchors[zz].content = [];
            for (let oo = 1; oo < cfg.octaveCount; oo++) {
                if (zz < 4) {
                    let octavemark = {
                        x: 0,
                        y: cfg.gridTop() + 12 * oo,
                        w: 2 * zoomPrefixLevelsCSS[zz].minZoom,
                        h: 2 * zoomPrefixLevelsCSS[zz].minZoom,
                        css: 'octaveMark'
                    };
                    this.leftZoomAnchors[zz].content.push(octavemark);
                    let nm = {
                        x: 0,
                        y: cfg.gridTop() + 12 * oo * cfg.notePathHeight + 2 * zoomPrefixLevelsCSS[zz].minZoom,
                        text: '' + (cfg.octaveCount - oo + 0),
                        css: 'octaveLabel' + zoomPrefixLevelsCSS[zz].prefix
                    };
                    this.leftZoomAnchors[zz].content.push(nm);
                    if (zz < 2) {
                        let nm = {
                            x: 0,
                            y: cfg.gridTop() + 12 * oo * cfg.notePathHeight + 1 * zoomPrefixLevelsCSS[zz].minZoom + 6 * cfg.notePathHeight,
                            text: '' + (cfg.octaveCount - oo + 0),
                            css: 'octaveSubLabel' + zoomPrefixLevelsCSS[zz].prefix
                        };
                        this.leftZoomAnchors[zz].content.push(nm);
                        if (zz < 1) {
                            let nm = {
                                x: 0,
                                y: cfg.gridTop() + 12 * oo * cfg.notePathHeight + 1 * zoomPrefixLevelsCSS[zz].minZoom + 3 * cfg.notePathHeight,
                                text: '' + (cfg.octaveCount - oo + 0),
                                css: 'octaveSubLabel' + zoomPrefixLevelsCSS[zz].prefix
                            };
                            this.leftZoomAnchors[zz].content.push(nm);
                            nm = {
                                x: 0,
                                y: cfg.gridTop() + 12 * oo * cfg.notePathHeight + 1 * zoomPrefixLevelsCSS[zz].minZoom + 9 * cfg.notePathHeight,
                                text: '' + (cfg.octaveCount - oo + 0),
                                css: 'octaveSubLabel' + zoomPrefixLevelsCSS[zz].prefix
                            };
                            this.leftZoomAnchors[zz].content.push(nm);
                        }
                    }
                }
            }
            if (cfg.data.tracks.length > 0) {
                let trackLabel = {
                    text: '' + cfg.data.tracks[0].title,
                    x: 0,
                    y: cfg.gridTop() + zoomPrefixLevelsCSS[zz].minZoom * 0.5,
                    css: 'curTrackTitleLabel' + zoomPrefixLevelsCSS[zz].prefix
                };
                this.leftZoomAnchors[zz].content.push(trackLabel);
            }
            if (zz < 4) {
                for (let ss = 0; ss < cfg.data.percussions.length; ss++) {
                    let samplerLabel = {
                        text: '' + cfg.data.percussions[ss].title,
                        x: 0,
                        y: cfg.samplerTop() + cfg.notePathHeight * ss + cfg.notePathHeight,
                        css: 'samplerRowLabel' + zoomPrefixLevelsCSS[zz].prefix
                    };
                    this.leftZoomAnchors[zz].content.push(samplerLabel);
                }
            }
        }
    }
}
class SamplerBar {
    constructor(cfg, barIdx, drumIdx, zoomLevel, anchor, left) {
        let drum = cfg.data.percussions[drumIdx];
        let measure = drum.measures[barIdx];
        let yy = cfg.samplerTop() + drumIdx * cfg.notePathHeight;
        let tempo = cfg.data.timeline[barIdx].tempo;
        for (let ss = 0; ss < measure.skips.length; ss++) {
            let skip = measure.skips[ss];
            let xx = left + MMUtil().set(skip).duration(tempo) * cfg.widthDurationRatio;
            let ply = {
                dots: [xx, yy + 0.025,
                    xx, yy + 0.975,
                    xx + 0.75, yy + 0.5
                ],
                css: 'samplerDrumDot'
            };
            anchor.content.push(ply);
        }
    }
}
class BarOctave {
    constructor(barIdx, octaveIdx, left, top, width, height, barOctaveGridAnchor, barOctaveTrackAnchor, barOctaveFirstAnchor, zoomLevel, cfg) {
        new OctaveContent(barIdx, octaveIdx, left, top, width, height, cfg, barOctaveTrackAnchor, barOctaveFirstAnchor, zoomLevel);
    }
}
class OctaveContent {
    constructor(barIdx, octaveIdx, left, top, width, height, cfg, barOctaveTrackAnchor, barOctaveFirstAnchor, zoomLevel) {
        if (zoomLevel < 8) {
            this.addUpperNotes(barIdx, octaveIdx, left, top, width, height, barOctaveFirstAnchor, cfg, zoomLevel);
            if (zoomLevel < 7) {
                this.addOtherNotes(barIdx, octaveIdx, left, top, width, height, barOctaveTrackAnchor, cfg);
            }
        }
    }
    addUpperNotes(barIdx, octaveIdx, left, top, width, height, barOctaveAnchor, cfg, zoomLevel) {
        if (cfg.data.tracks.length) {
            if (zoomLevel == 0) {
                this.addTrackNotes(cfg.data.tracks[0], barIdx, octaveIdx, left, top, width, height, barOctaveAnchor, cfg, 'mixNoteLine', true);
            }
            else {
                this.addTrackNotes(cfg.data.tracks[0], barIdx, octaveIdx, left, top, width, height, barOctaveAnchor, cfg, 'mixNoteLine', false);
            }
        }
    }
    addOtherNotes(barIdx, octaveIdx, left, top, width, height, barOctaveAnchor, cfg) {
        for (let ii = 1; ii < cfg.data.tracks.length; ii++) {
            let track = cfg.data.tracks[ii];
            this.addTrackNotes(track, barIdx, octaveIdx, left, top, width, height, barOctaveAnchor, cfg, 'mixNoteSub', false);
        }
    }
    addTrackNotes(track, barIdx, octaveIdx, left, top, width, height, barOctaveAnchor, cfg, css, addMoreInfo) {
        let measure = track.measures[barIdx];
        for (let cc = 0; cc < measure.chords.length; cc++) {
            let chord = measure.chords[cc];
            for (let nn = 0; nn < chord.notes.length; nn++) {
                let note = chord.notes[nn];
                let from = octaveIdx * 12;
                let to = (octaveIdx + 1) * 12;
                if (note.pitch >= from && note.pitch < to) {
                    let x1 = left + MMUtil().set(chord.skip).duration(cfg.data.timeline[barIdx].tempo) * cfg.widthDurationRatio;
                    let y1 = top + height - (note.pitch - from) * cfg.notePathHeight;
                    let slidearr = note.slides;
                    for (let ss = 0; ss < slidearr.length; ss++) {
                        let x2 = x1 + MMUtil().set(slidearr[ss].duration).duration(cfg.data.timeline[barIdx].tempo) * cfg.widthDurationRatio;
                        let y2 = y1 + slidearr[ss].delta * cfg.notePathHeight;
                        let r_x1 = x1 + cfg.notePathHeight / 2;
                        if (ss > 0) {
                            r_x1 = x1;
                        }
                        let r_x2 = x2 - cfg.notePathHeight / 2;
                        if (ss < slidearr.length - 1) {
                            r_x2 = x2;
                        }
                        if (r_x2 - r_x1 < cfg.notePathHeight / 2) {
                            r_x2 = r_x1 + 0.000001;
                        }
                        if (barOctaveAnchor.ww < r_x2 - barOctaveAnchor.xx) {
                            barOctaveAnchor.ww = r_x2 - barOctaveAnchor.xx;
                        }
                        let line = {
                            x1: r_x1,
                            y1: y1 - cfg.notePathHeight / 2,
                            x2: r_x2,
                            y2: y2 - cfg.notePathHeight / 2,
                            css: css
                        };
                        barOctaveAnchor.content.push(line);
                        if (addMoreInfo && ss == 0) {
                            let txt = '' + (barIdx + 1)
                                + ':' + chord.skip.count + '/' + chord.skip.part
                                + '(' + note.pitch
                                + '-' + slidearr[0].duration.count + '/' + slidearr[0].duration.part
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
    constructor(barIdx, left, ww, zoomLevel, gridZoomBarAnchor, tracksZoomBarAnchor, firstZoomBarAnchor, cfg) {
        let h12 = 12 * cfg.notePathHeight;
        for (let oo = 0; oo < cfg.octaveCount; oo++) {
            let gridOctaveAnchor = {
                showZoom: zoomPrefixLevelsCSS[zoomLevel].minZoom,
                hideZoom: zoomPrefixLevelsCSS[zoomLevel + 1].minZoom,
                xx: left,
                yy: cfg.gridTop() + oo * h12,
                ww: ww,
                hh: h12, content: [],
                id: 'octaveGridz' + zoomLevel + 'b' + barIdx + 'o' + oo + 'r' + Math.random()
            };
            gridZoomBarAnchor.content.push(gridOctaveAnchor);
            let tracksOctaveAnchor = {
                showZoom: zoomPrefixLevelsCSS[zoomLevel].minZoom,
                hideZoom: zoomPrefixLevelsCSS[zoomLevel + 1].minZoom,
                xx: left,
                yy: cfg.gridTop() + oo * h12,
                ww: ww,
                hh: h12, content: [],
                id: 'octaveTracks' + zoomLevel + 'b' + barIdx + 'o' + oo + 'r' + Math.random()
            };
            tracksZoomBarAnchor.content.push(tracksOctaveAnchor);
            let firstOctaveAnchor = {
                showZoom: zoomPrefixLevelsCSS[zoomLevel].minZoom,
                hideZoom: zoomPrefixLevelsCSS[zoomLevel + 1].minZoom,
                xx: left,
                yy: cfg.gridTop() + oo * h12,
                ww: ww,
                hh: h12, content: [],
                id: 'octaveFirst' + zoomLevel + 'b' + barIdx + 'o' + oo + 'r' + Math.random()
            };
            firstZoomBarAnchor.content.push(firstOctaveAnchor);
            new BarOctave(barIdx, (cfg.octaveCount - oo - 1), left, cfg.gridTop() + oo * h12, ww, h12, gridOctaveAnchor, tracksOctaveAnchor, firstOctaveAnchor, zoomLevel, cfg);
            if (firstZoomBarAnchor.ww < firstOctaveAnchor.ww) {
                firstZoomBarAnchor.ww = firstOctaveAnchor.ww;
            }
            if (tracksZoomBarAnchor.ww < tracksOctaveAnchor.ww) {
                tracksZoomBarAnchor.ww = tracksOctaveAnchor.ww;
            }
        }
        if (zoomLevel < 6) {
            this.addOctaveGridSteps(barIdx, cfg, left, ww, gridZoomBarAnchor, zoomLevel);
        }
        if (zoomLevel < 7) {
            for (let pp = 0; pp < cfg.data.percussions.length; pp++) {
                let drum = cfg.data.percussions[pp];
                if (drum) {
                    let measure = drum.measures[barIdx];
                    if (measure) {
                        new SamplerBar(cfg, barIdx, pp, zoomLevel, firstZoomBarAnchor, left);
                    }
                }
            }
        }
        if (zoomLevel < 6) {
            new TextComments(barIdx, cfg, left, gridZoomBarAnchor, zoomLevel);
        }
    }
    addOctaveGridSteps(barIdx, cfg, barLeft, width, barOctaveAnchor, zIndex) {
        let zoomInfo = zoomPrefixLevelsCSS[zIndex];
        let curBar = cfg.data.timeline[barIdx];
        let lineCount = 0;
        let skip = MMUtil().set({ count: 0, part: 1 });
        let top = cfg.gridTop();
        let height = cfg.gridHeight();
        let barRightBorder = {
            x: barLeft + width,
            y: top,
            w: zoomPrefixLevelsCSS[zIndex].minZoom * 0.5,
            h: height,
            rx: zoomPrefixLevelsCSS[zIndex].minZoom * 0.25,
            ry: zoomPrefixLevelsCSS[zIndex].minZoom * 0.25,
            css: 'barRightBorder'
        };
        barOctaveAnchor.content.push(barRightBorder);
        if (cfg.data.percussions.length) {
            let barSamRightBorder = {
                x: barLeft + width,
                y: cfg.samplerTop(),
                w: zoomPrefixLevelsCSS[zIndex].minZoom * 0.5,
                h: cfg.data.percussions.length * cfg.notePathHeight,
                rx: zoomPrefixLevelsCSS[zIndex].minZoom * 0.25,
                ry: zoomPrefixLevelsCSS[zIndex].minZoom * 0.25,
                css: 'barRightBorder'
            };
            barOctaveAnchor.content.push(barSamRightBorder);
        }
        if (zoomInfo.gridLines.length > 0) {
            let css = 'octaveBottomBorder';
            if (zIndex < 3) {
                css = 'interactiveTimeMeasureMark';
            }
            while (true) {
                let line = zoomInfo.gridLines[lineCount];
                skip = skip.plus(line.duration).simplyfy();
                if (!skip.less(curBar.metre)) {
                    break;
                }
                let xx = barLeft + skip.duration(curBar.tempo) * cfg.widthDurationRatio;
                let mark = {
                    x: xx,
                    y: top,
                    w: line.ratio * zoomInfo.minZoom / 2,
                    h: height,
                    css: css
                };
                barOctaveAnchor.content.push(mark);
                if (cfg.data.percussions.length) {
                    let sammark = {
                        x: xx,
                        y: cfg.samplerTop(),
                        w: line.ratio * zoomInfo.minZoom / 2,
                        h: cfg.data.percussions.length * cfg.notePathHeight,
                        css: css
                    };
                    barOctaveAnchor.content.push(sammark);
                }
                let txtmark = {
                    x: xx,
                    y: cfg.commentsTop(),
                    w: line.ratio * zoomInfo.minZoom / 2,
                    h: cfg.commentsMaxHeight(),
                    css: css
                };
                barOctaveAnchor.content.push(txtmark);
                lineCount++;
                if (lineCount >= zoomInfo.gridLines.length) {
                    lineCount = 0;
                }
            }
        }
    }
}
class TextComments {
    constructor(barIdx, cfg, barLeft, barOctaveAnchor, zIndex) {
        let curBar = cfg.data.timeline[barIdx];
        let width = MMUtil().set(curBar.metre).duration(curBar.tempo) * cfg.widthDurationRatio;
        let left = barLeft + width;
        let top = cfg.commentsTop();
        let height = cfg.commentsMaxHeight();
        let barTxtRightBorder = {
            x: left,
            y: top,
            w: zoomPrefixLevelsCSS[zIndex].minZoom * 0.5,
            h: height,
            rx: zoomPrefixLevelsCSS[zIndex].minZoom * 0.25,
            ry: zoomPrefixLevelsCSS[zIndex].minZoom * 0.25,
            css: 'barRightBorder'
        };
        barOctaveAnchor.content.push(barTxtRightBorder);
        if (barIdx < cfg.data.comments.length) {
            let txtZoomRatio = 1;
            if (zIndex > 2)
                txtZoomRatio = 2;
            if (zIndex > 3)
                txtZoomRatio = 4;
            if (zIndex > 4)
                txtZoomRatio = 8;
            for (let ii = 0; ii < cfg.data.comments[barIdx].points.length; ii++) {
                let itxt = cfg.data.comments[barIdx].points[ii];
                let xx = barLeft + MMUtil().set(itxt.skip).duration(curBar.tempo) * cfg.widthDurationRatio;
                let tt = {
                    x: xx,
                    y: top + cfg.notePathHeight * (1 + itxt.row) * txtZoomRatio,
                    text: cfg.data.comments[barIdx].points[ii].text,
                    css: 'commentLineText' + zoomPrefixLevelsCSS[zIndex].prefix
                };
                barOctaveAnchor.content.push(tt);
            }
        }
    }
}
class MixerUI {
    constructor() {
        this.levels = [];
    }
    reFillMixerUI(cfg) {
        let ww = cfg.mixerWidth();
        let hh = cfg.mixerHeight();
        for (let ii = 0; ii < zoomPrefixLevelsCSS.length - 1; ii++) {
            this.gridLayers.anchors[ii].ww = ww;
            this.gridLayers.anchors[ii].hh = hh;
            this.trackLayers.anchors[ii].ww = ww;
            this.trackLayers.anchors[ii].hh = hh;
            this.firstLayers.anchors[ii].ww = ww;
            this.firstLayers.anchors[ii].hh = hh;
            this.levels[ii].reCreateBars(cfg);
        }
        this.fillerAnchor.xx = cfg.LeftPad;
        this.fillerAnchor.yy = cfg.gridTop();
        this.fillerAnchor.ww = cfg.mixerWidth() - cfg.LeftPad - cfg.rightPad;
        this.fillerAnchor.hh = cfg.gridHeight();
        this.reFillTracksRatio(cfg);
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
    reFillTracksRatio(cfg) {
        let mxNotes = 0;
        let mxDrums = 0;
        let mxTxt = 0;
        for (let bb = 0; bb < cfg.data.timeline.length; bb++) {
            let notecount = 0;
            let drumcount = 0;
            let txtcnt = 0;
            for (let tt = 0; tt < cfg.data.tracks.length; tt++) {
                let bar = cfg.data.tracks[tt].measures[bb];
                if (bar) {
                    for (let cc = 0; cc < bar.chords.length; cc++) {
                        notecount = notecount + bar.chords[cc].notes.length;
                    }
                }
            }
            if (mxNotes < notecount) {
                mxNotes = notecount;
            }
            for (let tt = 0; tt < cfg.data.percussions.length; tt++) {
                let bar = cfg.data.percussions[tt].measures[bb];
                if (bar) {
                    drumcount = drumcount + bar.skips.length;
                }
            }
            if (mxDrums < drumcount) {
                mxDrums = drumcount;
            }
            if (cfg.data.comments[bb])
                if (cfg.data.comments[bb].points)
                    if (mxTxt < cfg.data.comments[bb].points.length) {
                        mxTxt = cfg.data.comments[bb].points.length;
                    }
        }
        if (mxDrums < 1)
            mxDrums = 1;
        if (mxNotes < 1)
            mxNotes = 1;
        if (mxTxt < 1)
            mxTxt = 1;
        this.fillerAnchor.content = [];
        let barX = 0;
        for (let bb = 0; bb < cfg.data.timeline.length; bb++) {
            let notecount = 0;
            for (let tt = 0; tt < cfg.data.tracks.length; tt++) {
                let bar = cfg.data.tracks[tt].measures[bb];
                for (let cc = 0; cc < bar.chords.length; cc++) {
                    notecount = notecount + bar.chords[cc].notes.length;
                }
            }
            let filIdx = 1 + Math.round(7 * notecount / mxNotes);
            let css = 'mixFiller' + filIdx;
            let barwidth = MMUtil().set(cfg.data.timeline[bb].metre).duration(cfg.data.timeline[bb].tempo) * cfg.widthDurationRatio;
            let fillRectangle = {
                x: cfg.LeftPad + barX,
                y: cfg.gridTop(),
                w: barwidth,
                h: cfg.gridHeight(),
                css: css
            };
            this.fillerAnchor.content.push(fillRectangle);
            if (cfg.data.percussions.length) {
                let drumcount = 0;
                for (let tt = 0; tt < cfg.data.percussions.length; tt++) {
                    let bar = cfg.data.percussions[tt].measures[bb];
                    if (bar) {
                        drumcount = drumcount + bar.skips.length;
                    }
                }
                filIdx = 1 + Math.round(7 * drumcount / mxDrums);
                let css2 = 'mixFiller' + filIdx;
                let fillDrumBar = {
                    x: cfg.LeftPad + barX,
                    y: cfg.samplerTop(),
                    w: barwidth,
                    h: cfg.data.percussions.length * cfg.notePathHeight,
                    css: css2
                };
                this.fillerAnchor.content.push(fillDrumBar);
            }
            filIdx = 1;
            if (cfg.data.comments[bb]) {
                if (cfg.data.comments[bb].points) {
                    filIdx = 1 + Math.round(7 * cfg.data.comments[bb].points.length / mxTxt);
                }
            }
            css = 'mixFiller' + filIdx;
            let fillTxtBar = {
                x: cfg.LeftPad + barX,
                y: cfg.commentsTop(),
                w: barwidth,
                h: cfg.commentsMaxHeight(),
                css: css
            };
            this.fillerAnchor.content.push(fillTxtBar);
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
    reCreateBars(cfg) {
        this.zoomGridAnchor.content = [];
        this.zoomTracksAnchor.content = [];
        this.zoomFirstAnchor.content = [];
        this.bars = [];
        let left = cfg.LeftPad;
        let width = 0;
        for (let ii = 0; ii < cfg.data.timeline.length; ii++) {
            let timebar = cfg.data.timeline[ii];
            width = MMUtil().set(timebar.metre).duration(timebar.tempo) * cfg.widthDurationRatio;
            let barGridAnchor = {
                showZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom, hideZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex + 1].minZoom,
                xx: left, yy: 0, ww: width, hh: cfg.mixerHeight(), content: [], id: 'barGrid' + (ii + Math.random())
            };
            this.zoomGridAnchor.content.push(barGridAnchor);
            let barTracksAnchor = {
                showZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom, hideZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex + 1].minZoom,
                xx: left, yy: 0, ww: width, hh: cfg.mixerHeight(), content: [], id: 'barTrack' + (ii + Math.random())
            };
            this.zoomTracksAnchor.content.push(barTracksAnchor);
            let barFirstAnchor = {
                showZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom, hideZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex + 1].minZoom,
                xx: left, yy: 0, ww: width, hh: cfg.mixerHeight(), content: [], id: 'barFirst' + (ii + Math.random())
            };
            this.zoomFirstAnchor.content.push(barFirstAnchor);
            let mixBar = new MixerBar(ii, left, width, this.zoomLevelIndex, barGridAnchor, barTracksAnchor, barFirstAnchor, cfg);
            this.bars.push(mixBar);
            left = left + width;
        }
        let titleLabel = {
            x: 0,
            y: cfg.heightOfTitle(),
            text: cfg.data.title,
            css: 'titleLabel' + zoomPrefixLevelsCSS[this.zoomLevelIndex].prefix
        };
        this.zoomGridAnchor.content.push(titleLabel);
        this.addDrumLines(cfg);
        this.addGridLines(this.zoomGridAnchor, cfg);
        this.addCommentLines(cfg);
    }
    addDrumLines(cfg) {
        if (this.zoomLevelIndex < 4) {
            for (let ss = 1; ss < cfg.data.percussions.length; ss++) {
                let line = {
                    x: cfg.LeftPad,
                    y: cfg.samplerTop() + cfg.notePathHeight * ss,
                    h: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom / 8.0,
                    w: cfg.timelineWidth(), css: 'samplerRowBorder'
                };
                this.zoomGridAnchor.content.push(line);
            }
        }
    }
    addCommentLines(cfg) {
        if (this.zoomLevelIndex < 3) {
            for (let ss = 0; ss <= cfg.maxCommentRowCount; ss++) {
                let line = {
                    x: cfg.LeftPad,
                    y: cfg.commentsTop() + cfg.notePathHeight * (ss + 1),
                    h: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom / 32.0,
                    w: cfg.timelineWidth(), css: 'interActiveGridLine'
                };
                this.zoomGridAnchor.content.push(line);
            }
        }
    }
    addGridLines(barOctaveAnchor, cfg) {
        if (this.zoomLevelIndex < 4) {
            for (let oo = 0; oo < cfg.octaveCount; oo++) {
                if (oo > 0) {
                    let octaveBottomBorder = {
                        x: cfg.LeftPad,
                        y: cfg.gridTop() + oo * 12 * cfg.notePathHeight,
                        w: cfg.timelineWidth(),
                        h: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom / 8.0,
                        css: 'octaveBottomBorder'
                    };
                    barOctaveAnchor.content.push(octaveBottomBorder);
                }
                if (this.zoomLevelIndex < 3) {
                    for (let kk = 1; kk < 12; kk++) {
                        barOctaveAnchor.content.push({
                            x: cfg.LeftPad,
                            y: cfg.gridTop() + (oo * 12 + kk) * cfg.notePathHeight,
                            w: cfg.timelineWidth(),
                            h: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom / 32.0,
                            css: 'interActiveGridLine'
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
    resetDebugView(cfg) {
        let ww = cfg.mixerWidth();
        let hh = cfg.mixerHeight();
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
                }, {
                    chords: [
                        { skip: { count: 0, part: 2 }, notes: [{ pitch: 31, slides: [] }] }
                    ]
                }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }
            ],
            performer: { id: '', data: '', kind: '', outputId: '' }
        },
        {
            title: "Second track", measures: [
                { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }
            ],
            performer: { id: '', data: '', kind: '', outputId: '' }
        },
        {
            title: "Third track", measures: [
                { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }
            ],
            performer: { id: '', data: '', kind: '', outputId: '' }
        }
    ],
    percussions: [
        {
            title: "Snare", measures: [],
            sampler: { id: '', data: '', kind: '', outputId: '' }
        },
        {
            title: "Snare2", measures: [],
            sampler: { id: '', data: '', kind: '', outputId: '' }
        },
        {
            title: "Snare3", measures: [],
            sampler: { id: '', data: '', kind: '', outputId: '' }
        }
    ],
    comments: [{ points: [{ skip: { count: 2, part: 16 }, text: '1-2/16', row: 0 }] }, {
            points: [
                { skip: { count: 0, part: 16 }, text: '20', row: 0 },
                { skip: { count: 1, part: 16 }, text: '21', row: 1 },
                { skip: { count: 2, part: 16 }, text: '22', row: 2 },
                { skip: { count: 3, part: 16 }, text: '23', row: 0 },
                { skip: { count: 4, part: 16 }, text: '24', row: 1 },
                { skip: { count: 5, part: 16 }, text: '25', row: 2 },
                { skip: { count: 6, part: 16 }, text: '26', row: 0 },
                { skip: { count: 7, part: 16 }, text: '27', row: 1 },
                { skip: { count: 8, part: 16 }, text: '28\ntest', row: 2 },
                { skip: { count: 9, part: 16 }, text: '29', row: 0 },
                { skip: { count: 10, part: 16 }, text: '2-10', row: 1 },
                { skip: { count: 11, part: 16 }, text: '2-11', row: 2 },
                { skip: { count: 12, part: 16 }, text: '2-12', row: 0 },
                { skip: { count: 13, part: 16 }, text: '2-13', row: 1 },
                { skip: { count: 14, part: 16 }, text: '2-14', row: 2 },
                { skip: { count: 15, part: 16 }, text: '2-15', row: 0 }
            ]
        }, { points: [{ skip: { count: 2, part: 16 }, text: '3-2/16', row: 0 }] },
        { points: [{ skip: { count: 2, part: 16 }, text: '4-2/16', row: 0 }] },
        { points: [{ skip: { count: 2, part: 16 }, text: '5-2/16', row: 0 }] }],
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
class MixerDataMathUtility {
    constructor(data) {
        this.LeftPad = 3;
        this.rightPad = 10;
        this.bottomMixerPad = 11;
        this.notePathHeight = 1;
        this.widthDurationRatio = 27;
        this.octaveCount = 10;
        this.samplerBottomPad = 1;
        this.titleBottomPad = 1;
        this.gridBottomPad = 1;
        this.maxCommentRowCount = 0;
        this.data = data;
        this.maxCommentRowCount = -1;
        for (let ii = 0; ii < this.data.comments.length; ii++) {
            let txts = this.data.comments[ii].points;
            for (let tt = 0; tt < txts.length; tt++) {
                if (this.maxCommentRowCount < txts[tt].row) {
                    this.maxCommentRowCount = txts[tt].row;
                }
            }
        }
    }
    mixerWidth() {
        return this.LeftPad + this.timelineWidth() + this.rightPad;
    }
    heightOfTitle() {
        return 10;
    }
    timelineWidth() {
        let mm = MMUtil();
        let ww = 0;
        for (let ii = 0; ii < this.data.timeline.length; ii++) {
            ww = ww + mm.set(this.data.timeline[ii].metre).duration(this.data.timeline[ii].tempo) * this.widthDurationRatio;
        }
        return ww;
    }
    mixerHeight() {
        return this.commentsTop()
            + this.commentsMaxHeight()
            + this.bottomMixerPad;
    }
    commentsMaxHeight() {
        return (2 + this.maxCommentRowCount) * this.notePathHeight * 8;
    }
    commentsTop() {
        return this.gridTop()
            + this.gridHeight()
            + this.gridBottomPad;
    }
    gridTop() {
        return this.samplerTop() + this.samplerHeight() + this.samplerBottomPad;
    }
    gridHeight() {
        return this.notePathHeight * this.octaveCount * 12;
    }
    samplerHeight() {
        return this.data.percussions.length * this.notePathHeight;
    }
    samplerTop() {
        return this.heightOfTitle() + this.titleBottomPad;
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