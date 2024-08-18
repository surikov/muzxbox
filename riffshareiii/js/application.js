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
        this.dialogMessage = null;
        window.addEventListener('message', this.receiveMessageFromPlugin.bind(this), false);
    }
    openDialogFrame(label, url, initOrProject, callback) {
        this.waitCallback = callback;
        let pluginTitle = document.getElementById("pluginTitle");
        pluginTitle.innerHTML = label;
        let pluginFrame = document.getElementById("pluginFrame");
        this.dialogMessage = { dialogID: '' + Math.random(), data: initOrProject };
        let me = this;
        if (pluginFrame) {
            if (pluginFrame.contentWindow) {
                pluginFrame.onload = function () {
                    me.sendMessageToPlugin();
                };
                pluginFrame.src = url;
                document.getElementById("pluginDiv").style.visibility = "visible";
            }
        }
    }
    sendMessageToPlugin() {
        console.log('sendMessageToPlugin', this.dialogMessage);
        let pluginFrame = document.getElementById("pluginFrame");
        if (pluginFrame) {
            pluginFrame.contentWindow.postMessage(this.dialogMessage, '*');
        }
    }
    closeDialogFrame() {
        document.getElementById("pluginDiv").style.visibility = "hidden";
    }
    receiveMessageFromPlugin(e) {
        console.log('receiveMessage', e);
    }
}
class CommandDispatcher {
    constructor() {
        this.tapSizeRatio = 1;
        this.onAir = false;
        this.listener = null;
    }
    initAudioFromUI() {
        console.log('initAudioFromUI');
        var AudioContext = window.AudioContext;
        this.audioContext = new AudioContext();
        this.player = createSchedulePlayer();
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
    toggleStartStop() {
        console.log('toggleStartStop');
        if (this.onAir) {
            this.onAir = !this.onAir;
            this.player.cancel();
        }
        else {
            this.onAir = !this.onAir;
            let n120 = 120 / 60;
            let A3 = 33;
            let schedule = {
                series: [
                    {
                        duration: n120, tempo: 120, items: [
                            { skip: 0 * n120, channelId: 'test1', pitches: [A3 - 0 - 4], slides: [{ duration: 2 / 16 * n120, delta: 4 }, { duration: 2 / 16 * n120, delta: 0 }] },
                            { skip: 1 / 4 * n120, channelId: 'test1', pitches: [A3 - 5], slides: [{ duration: 1 / 4 * n120, delta: 0 }] },
                            { skip: 2 / 4 * n120, channelId: 'test1', pitches: [A3 - 0], slides: [{ duration: 1 / 4 * n120, delta: 0 }] },
                            { skip: 3 / 4 * n120, channelId: 'test1', pitches: [A3 - 5], slides: [{ duration: 1 / 4 * n120, delta: 0 }] }
                        ], states: []
                    },
                    {
                        duration: n120, tempo: 120, items: [
                            { skip: 0 * n120, channelId: 'test1', pitches: [A3 - 0], slides: [{ duration: 1 / 4 * n120, delta: 0 }] },
                            { skip: 1 / 4 * n120, channelId: 'test1', pitches: [A3 - 5], slides: [{ duration: 1 / 4 * n120, delta: 0 }] },
                            { skip: 2 / 4 * n120, channelId: 'test1', pitches: [A3 - 0], slides: [{ duration: 1 / 8 * n120, delta: 0 }] },
                            { skip: 5 / 8 * n120, channelId: 'test1', pitches: [A3 - 5], slides: [{ duration: 1 / 8 * n120, delta: 0 }] },
                            { skip: 6 / 8 * n120, channelId: 'test1', pitches: [A3 - 4], slides: [{ duration: 1 / 8 * n120, delta: 0 }] },
                            { skip: 7 / 8 * n120, channelId: 'test1', pitches: [A3 - 2], slides: [{ duration: 1 / 8 * n120, delta: 0 }] }
                        ], states: []
                    },
                    { duration: n120, tempo: 120, items: [], states: [] },
                    { duration: n120, tempo: 120, items: [], states: [] }
                ],
                channels: [{
                        id: 'test1',
                        filters: [],
                        performer: {
                            id: 'test1',
                            kind: 'beep1',
                            properties: 'Nope'
                        }
                    }],
                filters: []
            };
            let me = this;
            me.player.setupPlugins(me.audioContext, schedule, () => {
                console.log('toggleStartStop setupPlugins done');
                me.player.startLoop(0, 0, n120 * 2);
            });
        }
    }
    setThemeLocale(loc, ratio) {
        console.log("setThemeLocale " + loc);
        setLocaleID(loc, ratio);
        if (loc == 'zh') {
            startLoadCSSfile('theme/font2big.css');
        }
        else {
            if (loc == 'ru') {
                startLoadCSSfile('theme/font3cyr.css');
            }
            else {
                startLoadCSSfile('theme/font1small.css');
            }
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
        console.log('moveTrackTop', trackNum);
        let it = this.cfg.data.tracks[trackNum];
        this.cfg.data.tracks.splice(trackNum, 1);
        this.cfg.data.tracks.unshift(it);
        this.upTracksLayer();
    }
    moveDrumTop(drumNum) {
        console.log('moveDrumTop', drumNum);
        let it = this.cfg.data.percussions[drumNum];
        this.cfg.data.percussions.splice(drumNum, 1);
        this.cfg.data.percussions.unshift(it);
        this.upDrumsLayer();
    }
    moveAutomationTop(filterNum) {
        console.log('moveAutomationTop', filterNum);
        this.upAutoLayer();
    }
    upTracksLayer() {
        console.log('upTracksLayer');
        this.cfg.data.focus = 0;
        this.renderer.menu.layerCurrentTitle.text = LO(localMenuTracksFolder);
        if (this.cfg.data.tracks)
            if (this.cfg.data.tracks[0])
                this.renderer.menu.layerCurrentTitle.text = this.cfg.data.tracks[0].title;
        commandDispatcher.resetProject();
    }
    upDrumsLayer() {
        console.log('upDrumsLayer');
        this.cfg.data.focus = 1;
        this.renderer.menu.layerCurrentTitle.text = LO(localMenuPercussionFolder);
        commandDispatcher.resetProject();
    }
    upAutoLayer() {
        console.log('upAutoayer');
        this.cfg.data.focus = 2;
        this.renderer.menu.layerCurrentTitle.text = LO(localMenuAutomationFolder);
        commandDispatcher.resetProject();
    }
    upCommentsLayer() {
        console.log('upCommentsLayer');
        this.cfg.data.focus = 3;
        this.renderer.menu.layerCurrentTitle.text = LO(localMenuCommentsLayer);
        commandDispatcher.resetProject();
    }
    setTrackSoloState(state) {
        console.log('setTrackSoloState', state);
    }
    setDrumSoloState(state) {
        console.log('setDrumSoloState', state);
    }
    promptProjectPluginGUI(label, url, callback) {
        console.log('promptProjectPluginGUI', url);
        let projectClone = JSON.stringify(this.cfg.data);
        pluginDialogPrompt.openDialogFrame(label, url, projectClone, callback);
    }
    resendMessagePluginGUI() {
        pluginDialogPrompt.sendMessageToPlugin();
    }
    promptPointPluginGUI(label, url, callback) {
        console.log('promptPointPluginGUI', url);
        pluginDialogPrompt.openDialogFrame(label, url, 'data for testing', callback);
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
        this.tiler.initRun(this.tileLevelSVG, false, 1, 1, zoomPrefixLevelsCSS[0].minZoom, zoomPrefixLevelsCSS[Math.floor(zoomPrefixLevelsCSS.length / 2)].minZoom, zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom - 1, layers);
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
        this.tiler.resetInnerSize(commandDispatcher.cfg.wholeWidth(), commandDispatcher.cfg.wholeHeight());
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
            mixH = commandDispatcher.cfg.wholeHeight();
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
let localMenuAutomationFolder = 'localMenuAutomationFolder';
let localMenuCommentsLayer = 'localMenuCommentsLayer';
let localMenuPlayPause = 'localMenuPlayPause';
let localMenuActionsFolder = 'localMenuActionsFolder';
let localMenuPerformersFolder = 'localMenuPerformersFolder';
let localMenuFiltersFolder = 'localMenuFiltersFolder';
let localMenuSamplersFolder = 'localMenuSamplersFolder';
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
    }, {
        id: localMenuCommentsLayer, data: [
            { locale: 'en', text: 'Comments' },
            { locale: 'ru', text: 'Комментарии' },
            { locale: 'zh', text: '?' }
        ]
    }, {
        id: localMenuAutomationFolder, data: [
            { locale: 'en', text: 'Automation' },
            { locale: 'ru', text: 'Автоматизация' },
            { locale: 'zh', text: '?' }
        ]
    }, {
        id: localMenuPlayPause, data: [
            { locale: 'en', text: 'Play/Pause' },
            { locale: 'ru', text: 'Старт/Стоп' },
            { locale: 'zh', text: '?' }
        ]
    },
    {
        id: localMenuActionsFolder, data: [
            { locale: 'en', text: 'Actions' },
            { locale: 'ru', text: 'Действия' },
            { locale: 'zh', text: '?' }
        ]
    }, {
        id: localMenuPerformersFolder, data: [
            { locale: 'en', text: 'Performers' },
            { locale: 'ru', text: 'Перформеры' },
            { locale: 'zh', text: '?' }
        ]
    }, {
        id: localMenuFiltersFolder, data: [
            { locale: 'en', text: 'Filters' },
            { locale: 'ru', text: 'Фильтры' },
            { locale: 'zh', text: '?' }
        ]
    }, {
        id: localMenuSamplersFolder, data: [
            { locale: 'en', text: 'Samplers' },
            { locale: 'ru', text: 'Сэмплеры' },
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
            let barLeft = cfg.leftPad;
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
        this.selectBarAnchor.ww = cfg.wholeWidth();
        this.selectBarAnchor.hh = cfg.wholeHeight();
        this.zoomAnchors = [];
        for (let zz = 0; zz < zoomPrefixLevelsCSS.length - 1; zz++) {
            let selectLevelAnchor = {
                showZoom: zoomPrefixLevelsCSS[zz].minZoom,
                hideZoom: zoomPrefixLevelsCSS[zz + 1].minZoom,
                xx: 0, yy: 0, ww: cfg.wholeWidth(), hh: cfg.wholeHeight(), content: [],
                id: 'time' + (zz + Math.random())
            };
            this.zoomAnchors.push(selectLevelAnchor);
            let mm = MMUtil();
            let barLeft = cfg.leftPad;
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
        this.layerCurrentTitle = { x: 2.5, y: 0, text: LO(localMenuTracksFolder), css: 'currentTitleLabel' };
        this.backgroundAnchor = {
            xx: 0, yy: 0, ww: 111, hh: 111,
            showZoom: zoomPrefixLevelsCSS[0].minZoom,
            hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom,
            content: [
                this.layerCurrentTitle,
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
                        if (it.onOpen) {
                            it.onOpen();
                        }
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
                        if (it.itemStates) {
                            let sel = it.selection ? it.selection : 0;
                            if (it.itemStates.length - 1 > sel) {
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
                itemStates: [icon_sound_low, icon_hide, icon_sound_loud],
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
                itemStates: [icon_sound_low, icon_hide, icon_sound_loud],
                selection: 0
            };
            menuPointPercussion.children.push(item);
        }
        menuPointAutomation.children = [];
        for (let ff = 0; ff < project.filters.length; ff++) {
            let filter = project.filters[ff];
            if (filter.automation) {
                let item = {
                    text: filter.automation.title,
                    noLocalization: true,
                    onClick: () => {
                        commandDispatcher.moveAutomationTop(ff);
                    },
                    onSubClick: () => {
                    },
                    itemStates: [icon_sound_low, icon_hide, icon_sound_loud],
                    selection: 0
                };
                menuPointAutomation.children.push(item);
            }
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
            let stateIicon = '?';
            let sel = this.info.selection ? this.info.selection : 0;
            if (this.info.itemStates) {
                if (this.info.itemStates.length > sel) {
                    stateIicon = this.info.itemStates[sel];
                }
            }
            anchor.content.push({ x: 0.1 + this.pad, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'rightMenuItemActionBG' });
            anchor.content.push({ x: 0.3 + this.pad, y: itemTop + 0.7, text: label, css: 'rightMenuLabel' });
            anchor.content.push({ x: itemWidth - 1.1, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'rightMenuItemActionBG' });
            anchor.content.push({ x: itemWidth - 1.1 + 0.4, y: itemTop + 0.7, text: stateIicon, css: 'rightMenuIconLabel' });
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
let menuPointActions = {
    text: 'localMenuActionsFolder',
    onOpen: () => {
        console.log('actions');
    }
};
let menuPointPerformers = {
    text: 'localMenuPerformersFolder',
    onOpen: () => {
        console.log('performers');
    }
};
let menuPointFilters = {
    text: 'localMenuFiltersFolder',
    onOpen: () => {
        console.log('filters');
    }
};
let menuPointSamplers = {
    text: 'localMenuSamplersFolder',
    onOpen: () => {
        console.log('samplers');
    }
};
let menuPointTracks = {
    text: localMenuTracksFolder,
    onOpen: () => {
        commandDispatcher.upTracksLayer();
    }
};
let menuPointPercussion = {
    text: localMenuPercussionFolder,
    onOpen: () => {
        commandDispatcher.upDrumsLayer();
    }
};
let menuPointAutomation = {
    text: localMenuAutomationFolder,
    onOpen: () => {
        commandDispatcher.upAutoLayer();
    }
};
function fillPluginsLists() {
    menuPointFilters.children = [];
    menuPointPerformers.children = [];
    menuPointSamplers.children = [];
    menuPointActions.children = [];
    for (let ii = 0; ii < MZXBX_currentPlugins().length; ii++) {
        let label = MZXBX_currentPlugins()[ii].label;
        let purpose = MZXBX_currentPlugins()[ii].purpose;
        let url = MZXBX_currentPlugins()[ii].ui;
        if (purpose == MZXBX_PluginPurpose.Action) {
            menuPointActions.children.push({
                text: label, noLocalization: true, onClick: () => {
                    commandDispatcher.promptProjectPluginGUI(label, url, (obj) => {
                        let project = JSON.parse(obj);
                        commandDispatcher.registerWorkProject(project);
                        commandDispatcher.resetProject();
                        return true;
                    });
                }
            });
        }
        else {
            if (purpose == MZXBX_PluginPurpose.Sampler) {
                menuPointSamplers.children.push({
                    text: label, noLocalization: true, onClick: () => {
                        console.log(purpose, label);
                    }
                });
            }
            else {
                if (purpose == MZXBX_PluginPurpose.Performer) {
                    menuPointPerformers.children.push({
                        text: label, noLocalization: true, onClick: () => {
                            commandDispatcher.promptPointPluginGUI(label, url, (obj) => {
                                console.log('performer callback', obj);
                                return true;
                            });
                        }
                    });
                }
                else {
                    if (purpose == MZXBX_PluginPurpose.Filter) {
                        menuPointFilters.children.push({
                            text: label, noLocalization: true, onClick: () => {
                                console.log(purpose, label);
                            }
                        });
                    }
                    else {
                        console.log('unknown plugin kind');
                    }
                }
            }
        }
    }
}
function composeBaseMenu() {
    fillPluginsLists();
    if (menuItemsData) {
        return menuItemsData;
    }
    else {
        menuItemsData = [
            {
                text: localMenuPlayPause, onClick: () => {
                    console.log('start/stop');
                    commandDispatcher.toggleStartStop();
                }
            },
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
            },
            {
                text: localMenuCommentsLayer, onClick: () => {
                    commandDispatcher.upCommentsLayer();
                }
            },
            menuPointAutomation,
            menuPointTracks,
            menuPointPercussion,
            menuPointActions,
            menuPointFilters,
            menuPointPerformers,
            menuPointSamplers
        ];
        console.log('base menu', menuItemsData);
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
            this.leftZoomAnchors[zz].hh = cfg.wholeHeight();
            this.leftZoomAnchors[zz].content = [];
            for (let oo = 1; oo < cfg.octaveCount; oo++) {
                if (zz < 4) {
                    let nm3 = {
                        x: 1,
                        y: cfg.gridTop() + 12 * oo * cfg.notePathHeight + 1 * zoomPrefixLevelsCSS[zz].minZoom,
                        text: '' + (cfg.octaveCount - oo + 0),
                        css: 'octaveLabel' + zoomPrefixLevelsCSS[zz].prefix
                    };
                    this.leftZoomAnchors[zz].content.push(nm3);
                    if (zz < 2) {
                        nm3.x = 0.5;
                        let nm2 = {
                            x: 0.5,
                            y: cfg.gridTop() + 12 * oo * cfg.notePathHeight + 1 * zoomPrefixLevelsCSS[zz].minZoom + 6 * cfg.notePathHeight,
                            text: '' + (cfg.octaveCount - oo + 0),
                            css: 'octaveSubLabel' + zoomPrefixLevelsCSS[zz].prefix
                        };
                        this.leftZoomAnchors[zz].content.push(nm2);
                        if (zz < 1) {
                            nm2.x = 0.25;
                            nm3.x = 0.25;
                            let nm = {
                                x: 0.25,
                                y: cfg.gridTop() + 12 * oo * cfg.notePathHeight + 1 * zoomPrefixLevelsCSS[zz].minZoom + 3 * cfg.notePathHeight,
                                text: '' + (cfg.octaveCount - oo + 0),
                                css: 'octaveSubLabel' + zoomPrefixLevelsCSS[zz].prefix
                            };
                            this.leftZoomAnchors[zz].content.push(nm);
                            nm = {
                                x: 0.25,
                                y: cfg.gridTop() + 12 * oo * cfg.notePathHeight + 1 * zoomPrefixLevelsCSS[zz].minZoom + 9 * cfg.notePathHeight,
                                text: '' + (cfg.octaveCount - oo + 0),
                                css: 'octaveSubLabel' + zoomPrefixLevelsCSS[zz].prefix
                            };
                            this.leftZoomAnchors[zz].content.push(nm);
                        }
                    }
                }
            }
            if (zz < 4) {
                for (let ss = 0; ss < cfg.data.percussions.length; ss++) {
                    let samplerLabel = {
                        text: '' + cfg.data.percussions[ss].title,
                        x: 0,
                        y: cfg.gridTop() + cfg.gridHeight() - 2 * cfg.data.percussions.length + 2 * cfg.notePathHeight * ss + 2 * cfg.notePathHeight,
                        css: 'samplerRowLabel' + zoomPrefixLevelsCSS[zz].prefix
                    };
                    this.leftZoomAnchors[zz].content.push(samplerLabel);
                }
            }
            if (zz < 4) {
                let yy = 0;
                for (let ff = 0; ff < cfg.data.filters.length; ff++) {
                    let filter = cfg.data.filters[ff];
                    if (filter.automation) {
                        let autoLabel = {
                            text: '' + filter.automation.title,
                            x: 0,
                            y: (cfg.gridTop() + yy + 1) * cfg.notePathHeight,
                            css: 'autoRowLabel' + zoomPrefixLevelsCSS[zz].prefix
                        };
                        this.leftZoomAnchors[zz].content.push(autoLabel);
                        yy++;
                    }
                }
            }
        }
    }
}
class SamplerBar {
    constructor(cfg, barIdx, drumIdx, zoomLevel, anchor, left) {
        let drum = cfg.data.percussions[drumIdx];
        let measure = drum.measures[barIdx];
        let yy = cfg.gridTop() + cfg.gridHeight() - 2 * cfg.data.percussions.length + drumIdx * cfg.notePathHeight * 2;
        let tempo = cfg.data.timeline[barIdx].tempo;
        let css = 'samplerDrumDotBg';
        if (cfg.data.focus)
            if (cfg.data.focus == 1)
                css = 'samplerDrumDotFocused';
        for (let ss = 0; ss < measure.skips.length; ss++) {
            let skip = measure.skips[ss];
            let xx = left + MMUtil().set(skip).duration(tempo) * cfg.widthDurationRatio;
            let ply = {
                dots: [xx, yy + 0.025,
                    xx, yy + 2 - 0.025,
                    xx + 1.5, yy + 1
                ],
                css: css
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
            let css = 'mixNoteLine';
            if (cfg.data.focus) {
                css = 'mixNoteSub';
            }
            if (zoomLevel == 0) {
                this.addTrackNotes(cfg.data.tracks[0], barIdx, octaveIdx, left, top, width, height, barOctaveAnchor, cfg, css);
            }
            else {
                this.addTrackNotes(cfg.data.tracks[0], barIdx, octaveIdx, left, top, width, height, barOctaveAnchor, cfg, css);
            }
        }
    }
    addOtherNotes(barIdx, octaveIdx, left, top, width, height, barOctaveAnchor, cfg) {
        for (let ii = 1; ii < cfg.data.tracks.length; ii++) {
            let track = cfg.data.tracks[ii];
            this.addTrackNotes(track, barIdx, octaveIdx, left, top, width, height, barOctaveAnchor, cfg, 'mixNoteSub');
        }
    }
    addTrackNotes(track, barIdx, octaveIdx, left, top, width, height, barOctaveAnchor, cfg, css) {
        let measure = track.measures[barIdx];
        for (let cc = 0; cc < measure.chords.length; cc++) {
            let chord = measure.chords[cc];
            for (let nn = 0; nn < chord.pitches.length; nn++) {
                let from = octaveIdx * 12;
                let to = (octaveIdx + 1) * 12;
                if (chord.pitches[nn] >= from && chord.pitches[nn] < to) {
                    let x1 = left + MMUtil().set(chord.skip).duration(cfg.data.timeline[barIdx].tempo) * cfg.widthDurationRatio;
                    let y1 = top + height - (chord.pitches[nn] - from) * cfg.notePathHeight;
                    for (let ss = 0; ss < chord.slides.length; ss++) {
                        let x2 = x1 + MMUtil().set(chord.slides[ss].duration).duration(cfg.data.timeline[barIdx].tempo) * cfg.widthDurationRatio;
                        let y2 = y1 - chord.slides[ss].delta * cfg.notePathHeight;
                        let r_x1 = x1 + cfg.notePathHeight / 2;
                        if (ss > 0) {
                            r_x1 = x1;
                        }
                        let r_x2 = x2 - cfg.notePathHeight / 2;
                        if (ss < chord.slides.length - 1) {
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
        if (zoomLevel < 7) {
            new TextComments(barIdx, cfg, left, gridZoomBarAnchor, zoomLevel);
        }
        if (zoomLevel < 7) {
            new AutomationBarContent(barIdx, cfg, left, gridZoomBarAnchor, zoomLevel);
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
            css: 'barRightBorder'
        };
        barOctaveAnchor.content.push(barRightBorder);
        if (zoomInfo.gridLines.length > 0) {
            let css = 'stepPartDelimiter';
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
        let top = cfg.gridTop();
        if (barIdx < cfg.data.comments.length) {
            let txtZoomRatio = 1;
            if (zIndex > 2)
                txtZoomRatio = 2;
            if (zIndex > 3)
                txtZoomRatio = 4;
            if (zIndex > 4)
                txtZoomRatio = 8;
            let css = 'commentReadText' + zoomPrefixLevelsCSS[zIndex].prefix;
            if (cfg.data.focus) {
                if (cfg.data.focus == 3) {
                    css = 'commentLineText' + zoomPrefixLevelsCSS[zIndex].prefix;
                }
            }
            for (let ii = 0; ii < cfg.data.comments[barIdx].points.length; ii++) {
                let itxt = cfg.data.comments[barIdx].points[ii];
                let xx = barLeft + MMUtil().set(itxt.skip).duration(curBar.tempo) * cfg.widthDurationRatio;
                let tt = {
                    x: xx,
                    y: top + cfg.notePathHeight * (1 + itxt.row) * txtZoomRatio,
                    text: cfg.data.comments[barIdx].points[ii].text,
                    css: css
                };
                barOctaveAnchor.content.push(tt);
            }
        }
    }
}
class AutomationBarContent {
    constructor(barIdx, cfg, barLeft, barOctaveAnchor, zIndex) {
        let curBar = cfg.data.timeline[barIdx];
        let width = MMUtil().set(curBar.metre).duration(curBar.tempo) * cfg.widthDurationRatio;
        let left = barLeft + width;
        let top = cfg.gridTop();
        let height = cfg.automationMaxHeight();
        let css = 'automationBgDot';
        if (cfg.data.focus)
            if (cfg.data.focus == 2)
                css = 'automationFocusedDot';
        let yy = 0;
        for (let ff = 0; ff < cfg.data.filters.length; ff++) {
            let filter = cfg.data.filters[ff];
            if (filter.automation) {
                if (filter.automation.measures[barIdx]) {
                    let measure = filter.automation.measures[barIdx];
                    for (let ii = 0; ii < measure.changes.length; ii++) {
                        let change = measure.changes[ii];
                        let xx = barLeft + MMUtil().set(change.skip).duration(curBar.tempo) * cfg.widthDurationRatio;
                        let aubtn = {
                            dots: [xx, top + cfg.notePathHeight * yy,
                                xx + 1, top + cfg.notePathHeight * yy,
                                xx, top + cfg.notePathHeight * (yy + 1)
                            ],
                            css: css
                        };
                        barOctaveAnchor.content.push(aubtn);
                    }
                    yy++;
                }
            }
        }
    }
}
class MixerUI {
    constructor() {
        this.levels = [];
        this.fanPane = new FanPane();
    }
    reFillMixerUI(cfg) {
        console.log('reFillMixerUI', this.fanLayer.anchors.length);
        let ww = cfg.wholeWidth();
        let hh = cfg.wholeHeight();
        for (let ii = 0; ii < zoomPrefixLevelsCSS.length - 1; ii++) {
            this.gridLayers.anchors[ii].ww = ww;
            this.gridLayers.anchors[ii].hh = hh;
            this.trackLayers.anchors[ii].ww = ww;
            this.trackLayers.anchors[ii].hh = hh;
            this.firstLayers.anchors[ii].ww = ww;
            this.firstLayers.anchors[ii].hh = hh;
            this.fanLayer.anchors[ii].ww = ww;
            this.fanLayer.anchors[ii].hh = hh;
            this.fanLayer.anchors[ii].content = [];
            this.levels[ii].reCreateBars(cfg);
        }
        this.fanPane.resetPlates(cfg, this.fanLayer.anchors);
        this.fillerAnchor.xx = cfg.leftPad;
        this.fillerAnchor.yy = cfg.gridTop();
        this.fillerAnchor.ww = cfg.wholeWidth() - cfg.leftPad - cfg.rightPad;
        this.fillerAnchor.hh = cfg.gridHeight();
        this.fillerAnchor.content = [];
        this.reFillWholeRatio(cfg);
        this.reFillSingleRatio(cfg);
    }
    createMixerLayers() {
        let tracksLayerZoom = document.getElementById('tracksLayerZoom');
        this.trackLayers = { g: tracksLayerZoom, anchors: [], mode: LevelModes.normal };
        let gridLayerZoom = document.getElementById('gridLayerZoom');
        this.gridLayers = { g: gridLayerZoom, anchors: [], mode: LevelModes.normal };
        let firstLayerZoom = document.getElementById('firstLayerZoom');
        this.firstLayers = { g: firstLayerZoom, anchors: [], mode: LevelModes.normal };
        let fanSVGgroup = document.getElementById('fanLayer');
        this.fanLayer = { g: fanSVGgroup, anchors: [], mode: LevelModes.normal };
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
            let fanLevelAnchor = {
                showZoom: zoomPrefixLevelsCSS[ii].minZoom,
                hideZoom: zoomPrefixLevelsCSS[ii + 1].minZoom,
                xx: 0, yy: 0, ww: 1, hh: 1, content: []
            };
            this.fanLayer.anchors.push(fanLevelAnchor);
            this.levels.push(new MixerZoomLevel(ii, mixerGridAnchor, mixerTrackAnchor, mixerFirstAnchor));
        }
        console.log('this.fanLayer', this.fanLayer);
        this.fillerAnchor = {
            showZoom: zoomPrefixLevelsCSS[6].minZoom,
            hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom + 1,
            xx: 0, yy: 0, ww: 1, hh: 1, content: []
        };
        this.gridLayers.anchors.push(this.fillerAnchor);
        return [this.gridLayers, this.trackLayers, this.firstLayers, this.fanLayer];
    }
    reFillSingleRatio(cfg) {
        let countFunction;
        let yy = cfg.gridTop() + cfg.gridHeight() / 8;
        let hh = cfg.gridHeight() * 6 / 8;
        if (cfg.data.focus) {
            if (cfg.data.focus == 1) {
                countFunction = this.barDrumCount;
                yy = cfg.gridTop() + cfg.gridHeight() - 2 * cfg.data.percussions.length;
                hh = 2 * cfg.data.percussions.length;
            }
            else {
                if (cfg.data.focus == 2) {
                    countFunction = this.barAutoCount;
                    yy = cfg.gridTop();
                    hh = cfg.maxAutomationsCount;
                }
                else {
                    countFunction = this.barCommentsCount;
                    yy = cfg.gridTop();
                    hh = cfg.commentsMaxHeight();
                }
            }
        }
        else {
            countFunction = this.barTrackCount;
        }
        let mxItems = 0;
        for (let bb = 0; bb < cfg.data.timeline.length; bb++) {
            let itemcount = countFunction(cfg, bb);
            if (mxItems < itemcount) {
                mxItems = itemcount;
            }
        }
        if (mxItems < 1)
            mxItems = 1;
        let barX = 0;
        for (let bb = 0; bb < cfg.data.timeline.length; bb++) {
            let itemcount = countFunction(cfg, bb);
            let filIdx = 1 + Math.round(7 * itemcount / mxItems);
            let css = 'mixFiller' + filIdx;
            let barwidth = MMUtil().set(cfg.data.timeline[bb].metre).duration(cfg.data.timeline[bb].tempo) * cfg.widthDurationRatio;
            let fillRectangle = {
                x: cfg.leftPad + barX,
                y: yy,
                w: barwidth,
                h: hh,
                css: css
            };
            this.fillerAnchor.content.push(fillRectangle);
            barX = barX + barwidth;
        }
    }
    reFillWholeRatio(cfg) {
        let yy = cfg.gridTop();
        let hh = cfg.gridHeight() / 8;
        if (cfg.data.focus) {
            if (cfg.data.focus == 1) {
                yy = cfg.gridTop();
                hh = cfg.gridHeight() - 2 * cfg.data.percussions.length;
            }
            else {
                if (cfg.data.focus == 2) {
                    yy = cfg.gridTop() + cfg.maxAutomationsCount;
                    hh = cfg.gridHeight() - cfg.maxAutomationsCount;
                }
                else {
                    yy = cfg.gridTop() + cfg.commentsMaxHeight();
                    hh = cfg.gridHeight() - cfg.commentsMaxHeight();
                }
            }
        }
        let countFunction = (cfg, barIdx) => {
            return this.barDrumCount(cfg, barIdx) + this.barAutoCount(cfg, barIdx) + this.barCommentsCount(cfg, barIdx) + this.barTrackCount(cfg, barIdx);
        };
        let mxItems = 0;
        for (let bb = 0; bb < cfg.data.timeline.length; bb++) {
            let itemcount = countFunction(cfg, bb);
            if (mxItems < itemcount) {
                mxItems = itemcount;
            }
        }
        if (mxItems < 1)
            mxItems = 1;
        let barX = 0;
        for (let bb = 0; bb < cfg.data.timeline.length; bb++) {
            let itemcount = countFunction(cfg, bb);
            let filIdx = 1 + Math.round(7 * itemcount / mxItems);
            let css = 'mixFiller' + filIdx;
            let barwidth = MMUtil().set(cfg.data.timeline[bb].metre).duration(cfg.data.timeline[bb].tempo) * cfg.widthDurationRatio;
            let fillRectangle = {
                x: cfg.leftPad + barX,
                y: yy,
                w: barwidth,
                h: hh,
                css: css
            };
            this.fillerAnchor.content.push(fillRectangle);
            if (cfg.data.focus) {
            }
            else {
                this.fillerAnchor.content.push({
                    x: cfg.leftPad + barX,
                    y: cfg.gridTop() + cfg.gridHeight() * 7 / 8,
                    w: barwidth,
                    h: hh,
                    css: css
                });
            }
            barX = barX + barwidth;
        }
    }
    barTrackCount(cfg, bb) {
        let notecount = 0;
        for (let tt = 0; tt < cfg.data.tracks.length; tt++) {
            let bar = cfg.data.tracks[tt].measures[bb];
            if (bar) {
                for (let cc = 0; cc < bar.chords.length; cc++) {
                    notecount = notecount + bar.chords[cc].pitches.length;
                }
            }
        }
        return notecount;
    }
    barDrumCount(cfg, bb) {
        let drumcount = 0;
        for (let tt = 0; tt < cfg.data.percussions.length; tt++) {
            let bar = cfg.data.percussions[tt].measures[bb];
            if (bar) {
                drumcount = drumcount + bar.skips.length;
            }
        }
        return drumcount;
    }
    barAutoCount(cfg, bb) {
        let autoCnt = 0;
        for (let ff = 0; ff < cfg.data.filters.length; ff++) {
            let filter = cfg.data.filters[ff];
            if (filter.automation) {
                if (filter.automation.measures[bb]) {
                    autoCnt = autoCnt + filter.automation.measures[bb].changes.length;
                }
            }
        }
        return autoCnt;
    }
    barCommentsCount(cfg, bb) {
        if (cfg.data.comments[bb]) {
            if (cfg.data.comments[bb].points) {
                return cfg.data.comments[bb].points.length;
            }
        }
        return 0;
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
        let left = cfg.leftPad;
        let width = 0;
        for (let ii = 0; ii < cfg.data.timeline.length; ii++) {
            let timebar = cfg.data.timeline[ii];
            width = MMUtil().set(timebar.metre).duration(timebar.tempo) * cfg.widthDurationRatio;
            let barGridAnchor = {
                showZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom, hideZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex + 1].minZoom,
                xx: left, yy: 0, ww: width, hh: cfg.wholeHeight(), content: [], id: 'barGrid' + (ii + Math.random())
            };
            this.zoomGridAnchor.content.push(barGridAnchor);
            let barTracksAnchor = {
                showZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom, hideZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex + 1].minZoom,
                xx: left, yy: 0, ww: width, hh: cfg.wholeHeight(), content: [], id: 'barTrack' + (ii + Math.random())
            };
            this.zoomTracksAnchor.content.push(barTracksAnchor);
            let barFirstAnchor = {
                showZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom, hideZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex + 1].minZoom,
                xx: left, yy: 0, ww: width, hh: cfg.wholeHeight(), content: [], id: 'barFirst' + (ii + Math.random())
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
    }
    addCommentLines(cfg) {
    }
    addGridLines(barOctaveAnchor, cfg) {
        if (this.zoomLevelIndex < 4) {
            for (let oo = 0; oo < cfg.octaveCount; oo++) {
                if (oo > 0) {
                    let octaveBottomBorder = {
                        x: cfg.leftPad,
                        y: cfg.gridTop() + oo * 12 * cfg.notePathHeight,
                        w: cfg.timelineWidth(),
                        h: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom / 2.0,
                        css: 'octaveBottomBorder'
                    };
                    barOctaveAnchor.content.push(octaveBottomBorder);
                }
                if (this.zoomLevelIndex < 3) {
                    for (let kk = 1; kk < 12; kk++) {
                        let need = false;
                        if (cfg.data.focus) {
                            if (cfg.data.focus == 1) {
                                if (oo * 12 + kk > 12 * cfg.octaveCount - cfg.data.percussions.length * 2 - 2) {
                                    if (!((oo * 12 + kk) % 2)) {
                                        need = true;
                                    }
                                }
                            }
                            else {
                                if (cfg.data.focus == 2) {
                                    if (oo * 12 + kk <= cfg.maxAutomationsCount) {
                                        need = true;
                                    }
                                }
                                else {
                                    if (oo * 12 + kk < 2 + cfg.maxCommentRowCount) {
                                        need = true;
                                    }
                                }
                            }
                        }
                        else {
                            need = true;
                        }
                        if (need) {
                            barOctaveAnchor.content.push({
                                x: cfg.leftPad,
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
}
class FanPane {
    resetPlates(cfg, fanAnchors) {
        console.log('FanPane.resetPlates', cfg, fanAnchors);
        this.filterIcons = [];
        this.autoIcons = [];
        this.performerIcons = [];
        this.samplerIcons = [];
        for (let ff = 0; ff < cfg.data.filters.length; ff++) {
            if (cfg.data.filters[ff].automation) {
                this.autoIcons.push(new FilterIcon(cfg.data.filters[ff].id));
            }
            else {
                this.filterIcons.push(new FilterIcon(cfg.data.filters[ff].id));
            }
        }
        for (let tt = 0; tt < cfg.data.tracks.length; tt++) {
            this.performerIcons.push(new PerformerIcon(cfg.data.tracks[tt].performer.id));
        }
        for (let tt = 0; tt < cfg.data.percussions.length; tt++) {
            this.samplerIcons.push(new SamplerIcon(cfg.data.percussions[tt].sampler.id));
        }
        for (let ii = 0; ii < zoomPrefixLevelsCSS.length - 1; ii++) {
            this.buildPerformerIcons(cfg, fanAnchors[ii], ii);
            this.buildFilterIcons(cfg, fanAnchors[ii], ii);
            this.buildAutoIcons(cfg, fanAnchors[ii], ii);
            this.buildSamplerIcons(cfg, fanAnchors[ii], ii);
            this.buildOutIcon(cfg, fanAnchors[ii], ii);
        }
    }
    buildPerformerIcons(cfg, fanAnchor, zidx) {
        for (let ii = 0; ii < this.performerIcons.length; ii++) {
            this.performerIcons[ii].buildPerformerSpot(cfg, fanAnchor, zidx);
        }
    }
    buildSamplerIcons(cfg, fanAnchor, zidx) {
        for (let ii = 0; ii < this.samplerIcons.length; ii++) {
            this.samplerIcons[ii].buildSamplerSpot(cfg, fanAnchor, zidx);
        }
    }
    buildAutoIcons(cfg, fanAnchor, zidx) {
        for (let ii = 0; ii < this.autoIcons.length; ii++) {
            this.autoIcons[ii].buildAutoSpot(cfg, fanAnchor, zidx);
        }
    }
    buildFilterIcons(cfg, fanAnchor, zidx) {
        for (let ii = 0; ii < this.filterIcons.length; ii++) {
            this.filterIcons[ii].buildFilterSpot(cfg, fanAnchor, zidx);
        }
    }
    buildOutIcon(cfg, fanAnchor, zidx) {
        let xx = cfg.wholeWidth() - cfg.speakerIconPad - cfg.rightPad;
        let yy = cfg.gridTop() + cfg.gridHeight() / 2 - cfg.speakerIconSize / 2;
        let rec = { x: xx, y: yy, w: cfg.speakerIconSize, h: cfg.speakerIconSize,
            rx: cfg.speakerIconSize / 2, ry: cfg.speakerIconSize / 2, css: 'fanSpeakerIcon' };
        fanAnchor.content.push(rec);
        let icon = { x: xx + cfg.speakerIconSize, y: yy + cfg.speakerIconSize, text: icon_sound_loud, css: 'fanSpeakerIconLabel' };
        fanAnchor.content.push(icon);
    }
}
class PerformerIcon {
    constructor(performerId) {
        this.performerId = performerId;
    }
    buildPerformerSpot(cfg, fanLevelAnchor, zidx) {
        for (let ii = 0; ii < cfg.data.tracks.length; ii++) {
            if (cfg.data.tracks[ii].performer.id == this.performerId) {
                let audioSeq = cfg.data.tracks[ii].performer;
                this.addPerformerSpot(cfg, audioSeq, fanLevelAnchor, zidx);
                break;
            }
        }
    }
    addPerformerSpot(cfg, audioSeq, fanLevelAnchor, zidx) {
        let left = cfg.leftPad + cfg.timelineWidth() + cfg.padGridFan;
        let top = cfg.gridTop();
        let xx = left;
        let yy = top;
        if (audioSeq.iconPosition) {
            xx = left + audioSeq.iconPosition.x;
            yy = top + audioSeq.iconPosition.y;
        }
        let rec = {
            x: xx, y: yy,
            w: cfg.pluginIconSize, h: cfg.pluginIconSize,
            rx: cfg.pluginIconSize / 2, ry: cfg.pluginIconSize / 2,
            css: 'fanPerformerIcon'
        };
        fanLevelAnchor.content.push(rec);
        if (zidx < 5) {
            let txt = { text: audioSeq.kind + ':' + audioSeq.id, x: xx, y: yy + cfg.pluginIconSize, css: 'fanSamplerIcon' };
            fanLevelAnchor.content.push(txt);
        }
        new SpearConnection().addSpear(3, cfg.leftPad + cfg.timelineWidth(), yy + cfg.pluginIconSize / 2, xx, yy + cfg.pluginIconSize / 2, fanLevelAnchor, 'fanStream');
        this.addOutputs(cfg, audioSeq.outputs, fanLevelAnchor, zidx, xx + cfg.pluginIconSize, yy + cfg.pluginIconSize / 2);
    }
    addOutputs(cfg, outputs, fanLevelAnchor, zidx, fromX, fromY) {
        if (outputs)
            if (outputs.length > 0) {
                for (let oo = 0; oo < outputs.length; oo++) {
                    let outId = outputs[oo];
                    for (let ii = 0; ii < cfg.data.filters.length; ii++) {
                        if (cfg.data.filters[ii].id == outId) {
                            let toFilter = cfg.data.filters[ii];
                            let left = cfg.leftPad + cfg.timelineWidth() + cfg.padGridFan;
                            let top = cfg.gridTop();
                            let xx = left;
                            let yy = top;
                            if (toFilter.iconPosition) {
                                xx = left + toFilter.iconPosition.x;
                                yy = top + toFilter.iconPosition.y + cfg.pluginIconSize / 2;
                            }
                            new SpearConnection().addSpear(3, fromX, fromY, xx, yy, fanLevelAnchor, 'fanConnection');
                            break;
                        }
                    }
                }
            }
            else {
                let speakerX = cfg.wholeWidth() - cfg.speakerIconPad - cfg.rightPad;
                new SpearConnection().addSpear(3, fromX, fromY, speakerX, cfg.gridTop() + cfg.gridHeight() / 2, fanLevelAnchor, 'fanConnection');
            }
    }
}
class SamplerIcon {
    constructor(samplerId) {
        this.samplerId = samplerId;
    }
    buildSamplerSpot(cfg, fanLevelAnchor, zidx) {
        for (let ii = 0; ii < cfg.data.percussions.length; ii++) {
            if (cfg.data.percussions[ii].sampler.id == this.samplerId) {
                let sampler = cfg.data.percussions[ii].sampler;
                this.addSamplerSpot(cfg, sampler, fanLevelAnchor, zidx);
                break;
            }
        }
    }
    addSamplerSpot(cfg, sampler, fanLevelAnchor, zidx) {
        let left = cfg.leftPad + cfg.timelineWidth() + cfg.padGridFan;
        let top = cfg.gridTop();
        let xx = left;
        let yy = top;
        if (sampler.iconPosition) {
            xx = left + sampler.iconPosition.x;
            yy = top + sampler.iconPosition.y;
        }
        let rec = { x: xx, y: yy, w: cfg.pluginIconSize, h: cfg.pluginIconSize, rx: cfg.pluginIconSize / 2, ry: cfg.pluginIconSize / 2, css: 'fanSamplerIcon' };
        fanLevelAnchor.content.push(rec);
        if (zidx < 5) {
            let txt = { text: sampler.kind + ':' + sampler.id, x: xx, y: yy + cfg.pluginIconSize, css: 'fanSamplerIcon' };
            fanLevelAnchor.content.push(txt);
        }
        new SpearConnection().addSpear(3, cfg.leftPad + cfg.timelineWidth(), yy + cfg.pluginIconSize / 2, xx, yy + cfg.pluginIconSize / 2, fanLevelAnchor, 'fanStream');
        this.addOutputs(cfg, sampler.outputs, fanLevelAnchor, zidx, xx + cfg.pluginIconSize, yy + cfg.pluginIconSize / 2);
    }
    addOutputs(cfg, outputs, fanLevelAnchor, zidx, fromX, fromY) {
        if (outputs)
            if (outputs.length > 0) {
                for (let oo = 0; oo < outputs.length; oo++) {
                    let outId = outputs[oo];
                    for (let ii = 0; ii < cfg.data.filters.length; ii++) {
                        if (cfg.data.filters[ii].id == outId) {
                            let toFilter = cfg.data.filters[ii];
                            let left = cfg.leftPad + cfg.timelineWidth() + cfg.padGridFan;
                            let top = cfg.gridTop();
                            let xx = left;
                            let yy = top;
                            if (toFilter.iconPosition) {
                                xx = left + toFilter.iconPosition.x;
                                yy = top + toFilter.iconPosition.y + cfg.pluginIconSize / 2;
                            }
                            new SpearConnection().addSpear(3, fromX, fromY, xx, yy, fanLevelAnchor, 'fanConnection');
                            break;
                        }
                    }
                }
            }
            else {
                let speakerX = cfg.wholeWidth() - cfg.speakerIconPad - cfg.rightPad;
                new SpearConnection().addSpear(3, fromX, fromY, speakerX, cfg.gridTop() + cfg.gridHeight() / 2, fanLevelAnchor, 'fanConnection');
            }
    }
}
class FilterIcon {
    constructor(filterId) {
        this.filterId = filterId;
    }
    buildFilterSpot(cfg, fanLevelAnchor, zidx) {
        for (let ii = 0; ii < cfg.data.filters.length; ii++) {
            if (cfg.data.filters[ii].id == this.filterId) {
                let filterTarget = cfg.data.filters[ii];
                this.addFilterSpot(cfg, filterTarget, fanLevelAnchor, zidx);
                break;
            }
        }
    }
    addFilterSpot(cfg, filterTarget, fanLevelAnchor, zidx) {
        let left = cfg.leftPad + cfg.timelineWidth() + cfg.padGridFan;
        let top = cfg.gridTop();
        let xx = left;
        let yy = top;
        if (filterTarget.iconPosition) {
            xx = left + filterTarget.iconPosition.x;
            yy = top + filterTarget.iconPosition.y;
        }
        let rec = { x: xx, y: yy, w: cfg.pluginIconSize, rx: cfg.pluginIconSize / 2, ry: cfg.pluginIconSize / 2,
            h: cfg.pluginIconSize, css: 'fanFilterIcon' };
        fanLevelAnchor.content.push(rec);
        if (zidx < 5) {
            let txt = { text: filterTarget.kind + ':' + filterTarget.id, x: xx, y: yy + cfg.pluginIconSize, css: 'fanSamplerIcon' };
            fanLevelAnchor.content.push(txt);
        }
        this.addOutputs(cfg, filterTarget.outputs, fanLevelAnchor, zidx, xx + cfg.pluginIconSize, yy + cfg.pluginIconSize / 2);
    }
    buildAutoSpot(cfg, fanLevelAnchor, zidx) {
        for (let ii = 0; ii < cfg.data.filters.length; ii++) {
            if (cfg.data.filters[ii].id == this.filterId) {
                let filterTarget = cfg.data.filters[ii];
                this.addAutoSpot(cfg, filterTarget, fanLevelAnchor, zidx);
                break;
            }
        }
    }
    addAutoSpot(cfg, filterTarget, fanLevelAnchor, zidx) {
        let left = cfg.leftPad + cfg.timelineWidth() + cfg.padGridFan;
        let top = cfg.gridTop();
        let xx = left;
        let yy = top;
        if (filterTarget.iconPosition) {
            xx = left + filterTarget.iconPosition.x;
            yy = top + filterTarget.iconPosition.y;
        }
        let rec = { x: xx, y: yy, w: cfg.pluginIconSize, rx: cfg.pluginIconSize / 2, ry: cfg.pluginIconSize / 2,
            h: cfg.pluginIconSize, css: 'fanFilterIcon' };
        fanLevelAnchor.content.push(rec);
        if (zidx < 5) {
            let txt = { text: '' + filterTarget.kind + ':' + filterTarget.id, x: xx, y: yy + cfg.pluginIconSize, css: 'fanSamplerIcon' };
            fanLevelAnchor.content.push(txt);
        }
        new SpearConnection().addSpear(3, cfg.leftPad + cfg.timelineWidth(), yy + cfg.pluginIconSize / 2, xx, yy + cfg.pluginIconSize / 2, fanLevelAnchor, 'fanStream');
        this.addOutputs(cfg, filterTarget.outputs, fanLevelAnchor, zidx, xx + cfg.pluginIconSize, yy + cfg.pluginIconSize / 2);
    }
    addOutputs(cfg, outputs, fanLevelAnchor, zidx, fromX, fromY) {
        if (outputs)
            if (outputs.length > 0) {
                for (let oo = 0; oo < outputs.length; oo++) {
                    let outId = outputs[oo];
                    for (let ii = 0; ii < cfg.data.filters.length; ii++) {
                        if (cfg.data.filters[ii].id == outId) {
                            let toFilter = cfg.data.filters[ii];
                            let left = cfg.leftPad + cfg.timelineWidth() + cfg.padGridFan;
                            let top = cfg.gridTop();
                            let xx = left;
                            let yy = top;
                            if (toFilter.iconPosition) {
                                xx = left + toFilter.iconPosition.x;
                                yy = top + toFilter.iconPosition.y + cfg.pluginIconSize / 2;
                            }
                            new SpearConnection().addSpear(3, fromX, fromY, xx, yy, fanLevelAnchor, 'fanConnection');
                            break;
                        }
                    }
                }
            }
            else {
                let speakerX = cfg.wholeWidth() - cfg.speakerIconPad - cfg.rightPad;
                new SpearConnection().addSpear(3, fromX, fromY, speakerX, cfg.gridTop() + cfg.gridHeight() / 2, fanLevelAnchor, 'fanConnection');
            }
    }
}
class SpearConnection {
    constructor() {
    }
    addSpear(headLen, fromX, fromY, toX, toY, anchor, css) {
        let mainLine = { x1: fromX, x2: toX, y1: fromY, y2: toY, css: css };
        anchor.content.push(mainLine);
        let angle = Math.atan2(toY - fromY, toX - fromX);
        let da = Math.PI * 19 / 20.0;
        let dx = headLen * Math.cos(angle - da);
        let dy = headLen * Math.sin(angle - da);
        let first = { x1: toX, x2: toX + dx, y1: toY, y2: toY + dy, css: css };
        anchor.content.push(first);
        let dx2 = headLen * Math.cos(angle + da);
        let dy2 = headLen * Math.sin(angle + da);
        let second = { x1: toX, x2: toX + dx2, y1: toY, y2: toY + dy2, css: css };
        anchor.content.push(second);
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
        let ww = cfg.wholeWidth();
        let hh = cfg.wholeHeight();
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
        let me = this;
        this.warningIcon = { x: 0, y: 0, text: icon_warningPlay, css: 'warningIcon' };
        this.warningInfo1 = { x: 0, y: 0, w: 1, h: 1, href: 'theme/img/mouse.png', css: 'warningInfoIcon' };
        this.warningInfo2 = { x: 0, y: 0, w: 1, h: 1, href: 'theme/img/wheel.png', css: 'warningInfoIcon' };
        this.warningInfo3 = { x: 0, y: 0, w: 1, h: 1, href: 'theme/img/hand.png', css: 'warningInfoIcon' };
        this.warningInfo4 = { x: 0, y: 0, w: 1, h: 1, href: 'theme/img/trackpad.png', css: 'warningInfoIcon' };
        this.warningTitle = { x: 0, y: 0, text: 'Play', css: 'warningTitle' };
        this.warningDescription = { x: 0, y: 0, text: 'Use mouse or touchpad to move and zoom piano roll', css: 'warningDescription' };
        this.warningGroup = document.getElementById("warningDialogGroup");
        this.warningRectangle = { x: 0, y: 0, w: 1, h: 1, css: 'warningBG', activation: () => {
                commandDispatcher.initAudioFromUI();
                me.cancel();
            }
        };
        this.warningAnchor = {
            id: 'warningAnchor', xx: 0, yy: 0, ww: 1, hh: 1,
            showZoom: zoomPrefixLevelsCSS[0].minZoom,
            hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom + 1,
            content: [this.warningRectangle, this.warningIcon, this.warningTitle, this.warningDescription,
                this.warningInfo1, this.warningInfo2, this.warningInfo3, this.warningInfo4
            ]
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
        this.warningInfo1.x = ww / 2 - 3;
        this.warningInfo1.y = hh - 1.5;
        this.warningInfo2.x = ww / 2 - 1.5;
        this.warningInfo2.y = hh - 1.5;
        this.warningInfo3.x = ww / 2 + 0;
        this.warningInfo3.y = hh - 1.5;
        this.warningInfo4.x = ww / 2 + 1.5;
        this.warningInfo4.y = hh - 1.5;
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
                        { skip: { count: 0, part: 1 }, pitches: [25], slides: [{ duration: { count: 1, part: 8 }, delta: 0 }] },
                        { skip: { count: 1, part: 16 }, pitches: [26], slides: [{ duration: { count: 1, part: 8 }, delta: 0 }] },
                        { skip: { count: 1, part: 8 }, pitches: [27], slides: [{ duration: { count: 1, part: 8 }, delta: 0 }] },
                        { skip: { count: 3, part: 16 }, pitches: [28], slides: [{ duration: { count: 1, part: 8 }, delta: 0 }] },
                        { skip: { count: 1, part: 4 }, pitches: [29], slides: [{ duration: { count: 1, part: 8 }, delta: 0 }] },
                        { skip: { count: 5, part: 16 }, pitches: [30], slides: [{ duration: { count: 1, part: 8 }, delta: 0 }] },
                        { skip: { count: 3, part: 8 }, pitches: [31], slides: [{ duration: { count: 1, part: 8 }, delta: 0 }] },
                        { skip: { count: 7, part: 16 }, pitches: [32], slides: [{ duration: { count: 1, part: 8 }, delta: 0 }] },
                        { skip: { count: 1, part: 2 }, pitches: [33], slides: [{ duration: { count: 1, part: 8 }, delta: 0 }] }
                    ]
                }, {
                    chords: [
                        { skip: { count: 0, part: 2 }, pitches: [60], slides: [
                                { duration: { count: 1, part: 8 }, delta: 5 },
                                { duration: { count: 1, part: 8 }, delta: -5 },
                                { duration: { count: 1, part: 4 }, delta: 0 }
                            ] }
                    ]
                }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }
            ],
            performer: { id: 'firstPerfoemrID', data: '', kind: 'basePitched', outputs: ['track1Volme'], iconPosition: { x: 27, y: 20 } }
        },
        {
            title: "Second track", measures: [
                { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }
            ],
            performer: { id: 'secTrPerfId', data: '', kind: 'basePitched', outputs: ['track2Volme'], iconPosition: { x: 40, y: 49 } }
        },
        {
            title: "Third track", measures: [
                { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }
            ],
            performer: { id: 't3', data: '', kind: 'basePitched', outputs: ['track3Volme'], iconPosition: { x: 40, y: 33 } }
        }
    ],
    percussions: [
        {
            title: "Snare", measures: [
                { skips: [] }, { skips: [{ count: 2, part: 16 }] }, { skips: [] }, { skips: [{ count: 0, part: 16 }] }
            ],
            sampler: { id: 'd1', data: '', kind: 'baseSampler', outputs: ['drum1Volme'], iconPosition: { x: 14, y: 75 } }
        },
        {
            title: "Snare2", measures: [],
            sampler: { id: 'd2', data: '', kind: 'baseSampler', outputs: ['drum2Volme'], iconPosition: { x: 23, y: 91 } }
        },
        {
            title: "Snare3", measures: [{ skips: [] }, { skips: [{ count: 1, part: 16 }] }],
            sampler: { id: 'd3', data: '', kind: 'baseSampler', outputs: ['drum3Volme'], iconPosition: { x: 32, y: 99 } }
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
    filters: [
        {
            id: 'volumeSlide', kind: 'baseVolume', dataBlob: '', outputs: ['masterVolme'],
            automation: { title: 'Simple test', measures: [{ changes: [] }, { changes: [{ skip: { count: 5, part: 16 }, stateBlob: 'sss' }, { skip: { count: 1, part: 16 }, stateBlob: 'sss' }] }, { changes: [{ skip: { count: 1, part: 4 }, stateBlob: 'sss2' }] }] },
            iconPosition: { x: 152, y: 39 }
        },
        {
            id: 'masterVolme', kind: 'base_volume', dataBlob: 'bb1', outputs: [],
            automation: { title: 'test1122', measures: [{ changes: [] }, { changes: [] }, { changes: [{ skip: { count: 1, part: 16 }, stateBlob: 's1' }, { skip: { count: 2, part: 16 }, stateBlob: 's1' }, { skip: { count: 3, part: 16 }, stateBlob: 's1' }, { skip: { count: 4, part: 16 }, stateBlob: 's1' }, { skip: { count: 5, part: 16 }, stateBlob: 's1' }, { skip: { count: 6, part: 16 }, stateBlob: 's1' }, { skip: { count: 7, part: 16 }, stateBlob: 's1' }] }, { changes: [] }] },
            iconPosition: { x: 188, y: 7 }
        },
        { id: 'allDrumsVolme', kind: 'base_volume', dataBlob: '', outputs: ['masterVolme'], automation: null, iconPosition: { x: 112, y: 87 } },
        { id: 'drum1Volme', kind: 'base_volume', dataBlob: '', outputs: ['allDrumsVolme'], automation: null, iconPosition: { x: 52, y: 73 } },
        { id: 'drum2Volme', kind: 'base_volume', dataBlob: '', outputs: ['allDrumsVolme'], automation: null, iconPosition: { x: 72, y: 83 } },
        { id: 'drum3Volme', kind: 'base_volume', dataBlob: '', outputs: ['allDrumsVolme'], automation: null, iconPosition: { x: 82, y: 119 } },
        { id: 'track1Volme', kind: 'base_volume', dataBlob: '', outputs: ['volumeSlide'], automation: null, iconPosition: { x: 132, y: 23 } },
        { id: 'track2Volme', kind: 'base_volume', dataBlob: '', outputs: ['volumeSlide'], automation: null, iconPosition: { x: 102, y: 64 } },
        { id: 'track3Volme', kind: 'base_volume', dataBlob: '', outputs: ['volumeSlide'], automation: null, iconPosition: { x: 72, y: 30 } }
    ]
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
        this.leftPad = 3;
        this.rightPad = 10;
        this.bottomPad = 11;
        this.topPad = 2;
        this.notePathHeight = 1;
        this.widthDurationRatio = 27;
        this.octaveCount = 10;
        this.titleBottomPad = 5;
        this.automationBottomPad = 1;
        this.samplerBottomPad = 1;
        this.gridBottomPad = 1;
        this.maxCommentRowCount = 0;
        this.maxAutomationsCount = 0;
        this.pluginIconSize = 17;
        this.speakerIconSize = 33;
        this.speakerIconPad = 11;
        this.padGridFan = 5;
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
        this.maxAutomationsCount = 0;
        for (let ff = 0; ff < this.data.filters.length; ff++) {
            if (this.data.filters[ff].automation) {
                this.maxAutomationsCount++;
            }
        }
    }
    extractDifference(from) {
        return '';
    }
    mergeDifference(diff) {
    }
    wholeWidth() {
        return this.leftPad + this.timelineWidth() + this.padGridFan + this.fanWidth() + this.rightPad;
    }
    fanWidth() {
        let ww = 1;
        for (let tt = 0; tt < this.data.tracks.length; tt++) {
            let iconPosition = this.data.tracks[tt].performer.iconPosition;
            let pp = { x: 0, y: 0 };
            if (iconPosition) {
                pp = iconPosition;
            }
            if (ww < pp.x + this.pluginIconSize) {
                ww = pp.x + this.pluginIconSize;
            }
        }
        for (let tt = 0; tt < this.data.filters.length; tt++) {
            let iconPosition = this.data.filters[tt].iconPosition;
            let pp = { x: 0, y: 0 };
            if (iconPosition) {
                pp = iconPosition;
            }
            if (ww < pp.x + this.pluginIconSize) {
                ww = pp.x + this.pluginIconSize;
            }
        }
        for (let tt = 0; tt < this.data.percussions.length; tt++) {
            let iconPosition = this.data.percussions[tt].sampler.iconPosition;
            let pp = { x: 0, y: 0 };
            if (iconPosition) {
                pp = iconPosition;
            }
            if (ww < pp.x + this.pluginIconSize) {
                ww = pp.x + this.pluginIconSize;
            }
        }
        ww = ww + this.speakerIconPad + 2 * this.pluginIconSize;
        return ww;
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
    wholeHeight() {
        return this.gridTop()
            + this.gridHeight()
            + this.bottomPad;
    }
    automationMaxHeight() {
        return this.maxAutomationsCount * this.notePathHeight * 2;
    }
    commentsMaxHeight() {
        return (2 + this.maxCommentRowCount) * this.notePathHeight * 8;
    }
    commentsAverageFillHeight() {
        let rcount = this.maxCommentRowCount;
        if (rcount > 3) {
            rcount = 3;
        }
        return (2 + rcount) * this.notePathHeight * 8;
    }
    gridTop() {
        return this.topPad + this.heightOfTitle() + this.titleBottomPad;
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
var MZXBX_PluginPurpose;
(function (MZXBX_PluginPurpose) {
    MZXBX_PluginPurpose[MZXBX_PluginPurpose["Action"] = 0] = "Action";
    MZXBX_PluginPurpose[MZXBX_PluginPurpose["Filter"] = 1] = "Filter";
    MZXBX_PluginPurpose[MZXBX_PluginPurpose["Sampler"] = 2] = "Sampler";
    MZXBX_PluginPurpose[MZXBX_PluginPurpose["Performer"] = 3] = "Performer";
})(MZXBX_PluginPurpose || (MZXBX_PluginPurpose = {}));
//# sourceMappingURL=application.js.map