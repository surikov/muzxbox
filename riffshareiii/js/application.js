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
    globalCommandDispatcher.registerWorkProject(mzxbxProjectForTesting2);
    globalCommandDispatcher.resetProject();
}
function initWebAudioFromUI() {
    console.log('initWebAudioFromUI');
    globalCommandDispatcher.initAudioFromUI();
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
        let parsed = null;
        try {
            parsed = JSON.parse(e.data);
        }
        catch (xxx) {
            console.log(xxx);
        }
        console.log('parsed', parsed);
        if (parsed) {
            if (this.dialogMessage) {
                if (parsed.dialogID == this.dialogMessage.dialogID) {
                    let close = this.waitCallback(parsed.data);
                    if (close) {
                        this.closeDialogFrame();
                    }
                }
                else {
                    console.log('wrong received message id', parsed.dialogID, this.dialogMessage.dialogID);
                }
            }
            else {
                console.log('wrong received object');
            }
        }
    }
}
class CommandDispatcher {
    constructor() {
        this.tapSizeRatio = 1;
        this.onAir = false;
        this.listener = null;
    }
    cfg() {
        return this._mixerDataMathUtility;
    }
    initAudioFromUI() {
        console.log('initAudioFromUI');
        var AudioContext = window.AudioContext;
        this.audioContext = new AudioContext();
        this.player = createSchedulePlayer();
    }
    registerWorkProject(data) {
        this._mixerDataMathUtility = new MixerDataMathUtility(data);
    }
    registerUI(renderer) {
        this.renderer = renderer;
    }
    showRightMenu() {
        let vw = this.renderer.tileLevelSVG.clientWidth / this.renderer.tiler.tapPxSize();
        let vh = this.renderer.tileLevelSVG.clientHeight / this.renderer.tiler.tapPxSize();
        this.cfg().data.list = true;
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
        let it = this.cfg().data.tracks[trackNum];
        this.cfg().data.tracks.splice(trackNum, 1);
        this.cfg().data.tracks.unshift(it);
        this.upTracksLayer();
    }
    moveDrumTop(drumNum) {
        console.log('moveDrumTop', drumNum);
        let it = this.cfg().data.percussions[drumNum];
        this.cfg().data.percussions.splice(drumNum, 1);
        this.cfg().data.percussions.unshift(it);
        this.upDrumsLayer();
    }
    moveAutomationTop(filterNum) {
        console.log('moveAutomationTop', filterNum);
        this.upAutoLayer();
    }
    upTracksLayer() {
        console.log('upTracksLayer');
        this.cfg().data.focus = 0;
        this.renderer.menu.layerCurrentTitle.text = LO(localMenuTracksFolder);
        if (this.cfg().data.tracks)
            if (this.cfg().data.tracks[0])
                this.renderer.menu.layerCurrentTitle.text = this.cfg().data.tracks[0].title;
        this.resetProject();
    }
    upDrumsLayer() {
        console.log('upDrumsLayer');
        this.cfg().data.focus = 1;
        this.renderer.menu.layerCurrentTitle.text = LO(localMenuPercussionFolder);
        this.resetProject();
    }
    upAutoLayer() {
        console.log('upAutoayer');
        this.cfg().data.focus = 2;
        this.renderer.menu.layerCurrentTitle.text = LO(localMenuAutomationFolder);
        this.resetProject();
    }
    upCommentsLayer() {
        console.log('upCommentsLayer');
        this.cfg().data.focus = 3;
        this.renderer.menu.layerCurrentTitle.text = LO(localMenuCommentsLayer);
        this.resetProject();
    }
    setTrackSoloState(state) {
        console.log('setTrackSoloState', state);
    }
    setDrumSoloState(state) {
        console.log('setDrumSoloState', state);
    }
    promptProjectPluginGUI(label, url, callback) {
        console.log('promptProjectPluginGUI', url);
        let projectClone = JSON.stringify(this.cfg().data);
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
        if (this.cfg().data) {
            if (idx >= 0 && idx < this.cfg().data.timeline.length) {
                let curPro = this.cfg().data;
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
        this.renderer.timeselectbar.updateTimeSelectionBar();
        this.renderer.tiler.resetAnchor(this.renderer.timeselectbar.selectedTimeSVGGroup, this.renderer.timeselectbar.selectionAnchor, LevelModes.top);
    }
}
let globalCommandDispatcher = new CommandDispatcher();
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
        globalCommandDispatcher.registerUI(this);
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
            let xyz = this.tiler.getCurrentPointPosition();
            globalCommandDispatcher.cfg().data.position = xyz;
        });
        this.tiler.setAfterResizeCallback(() => {
            this.onReSizeView();
        });
    }
    fillWholeUI() {
        let vw = this.tileLevelSVG.clientWidth / this.tiler.tapPxSize();
        let vh = this.tileLevelSVG.clientHeight / this.tiler.tapPxSize();
        this.tiler.resetInnerSize(globalCommandDispatcher.cfg().wholeWidth(), globalCommandDispatcher.cfg().wholeHeight());
        this.mixer.reFillMixerUI();
        this.leftPanel.reFillLeftPanel();
        this.debug.resetDebugView();
        this.toolbar.resizeToolbar(vw, vh);
        this.menu.readCurrentSongData(globalCommandDispatcher.cfg().data);
        this.menu.resizeMenu(vw, vh);
        this.warning.resizeDialog(vw, vh, () => {
            this.tiler.resetAnchor(this.warning.warningGroup, this.warning.warningAnchor, LevelModes.overlay);
        });
        this.timeselectbar.fillTimeBar();
        this.timeselectbar.resizeTimeScale(vw, vh);
        let xyz = globalCommandDispatcher.cfg().data.position;
        if (xyz) {
            this.tiler.setCurrentPointPosition(xyz);
        }
        else {
            this.tiler.setCurrentPointPosition({ x: 0, y: 0, z: 32 });
        }
        this.tiler.resetModel();
        console.log('fillWholeUI', this.tiler);
    }
    onReSizeView() {
        let mixH = 1;
        if (this.lastUsedData) {
            mixH = globalCommandDispatcher.cfg().wholeHeight();
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
    updateTimeSelectionBar() {
        let selection = globalCommandDispatcher.cfg().data.selection;
        if (selection) {
            let mm = MMUtil();
            let barLeft = globalCommandDispatcher.cfg().leftPad;
            let startSel = 1;
            let widthSel = 0;
            let startIdx = 0;
            for (startIdx = 0; startIdx < globalCommandDispatcher.cfg().data.timeline.length; startIdx++) {
                let curBar = globalCommandDispatcher.cfg().data.timeline[startIdx];
                let curMeasureMeter = mm.set(curBar.metre);
                let barWidth = curMeasureMeter.duration(curBar.tempo) * globalCommandDispatcher.cfg().widthDurationRatio;
                if (startIdx == selection.startMeasure) {
                    startSel = barLeft;
                    break;
                }
                barLeft = barLeft + barWidth;
            }
            for (let ii = startIdx; ii < globalCommandDispatcher.cfg().data.timeline.length; ii++) {
                let curBar = globalCommandDispatcher.cfg().data.timeline[ii];
                let curMeasureMeter = mm.set(curBar.metre);
                let barWidth = curMeasureMeter.duration(curBar.tempo) * globalCommandDispatcher.cfg().widthDurationRatio;
                widthSel = widthSel + barWidth;
                if (ii == selection.endMeasure) {
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
    createBarMark(barIdx, barLeft, size, measureAnchor) {
        let mark = {
            x: barLeft, y: 0, w: size, h: size,
            css: 'timeMarkButtonCircle', activation: (x, y) => {
                globalCommandDispatcher.expandTimeLineSelection(barIdx);
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
    fillTimeBar() {
        this.selectBarAnchor.ww = globalCommandDispatcher.cfg().wholeWidth();
        this.selectBarAnchor.hh = globalCommandDispatcher.cfg().wholeHeight();
        this.zoomAnchors = [];
        for (let zz = 0; zz < zoomPrefixLevelsCSS.length - 1; zz++) {
            let selectLevelAnchor = {
                showZoom: zoomPrefixLevelsCSS[zz].minZoom,
                hideZoom: zoomPrefixLevelsCSS[zz + 1].minZoom,
                xx: 0, yy: 0, ww: globalCommandDispatcher.cfg().wholeWidth(), hh: globalCommandDispatcher.cfg().wholeHeight(), content: [],
                id: 'time' + (zz + Math.random())
            };
            this.zoomAnchors.push(selectLevelAnchor);
            let mm = MMUtil();
            let barLeft = globalCommandDispatcher.cfg().leftPad;
            let barTime = 0;
            for (let kk = 0; kk < globalCommandDispatcher.cfg().data.timeline.length; kk++) {
                let curBar = globalCommandDispatcher.cfg().data.timeline[kk];
                let curMeasureMeter = mm.set(curBar.metre);
                let barWidth = curMeasureMeter.duration(curBar.tempo) * globalCommandDispatcher.cfg().widthDurationRatio;
                let measureAnchor = {
                    showZoom: zoomPrefixLevelsCSS[zz].minZoom,
                    hideZoom: zoomPrefixLevelsCSS[zz + 1].minZoom,
                    xx: barLeft, yy: 0, ww: barWidth, hh: 1234, content: [],
                    id: 'measure' + (kk + Math.random())
                };
                selectLevelAnchor.content.push(measureAnchor);
                if ((zz <= 4) || (zz == 5 && kk % 2 == 0) || (zz == 6 && kk % 4 == 0) || (zz == 7 && kk % 8 == 0) || (zz == 8 && kk % 16 == 0)) {
                    this.createBarMark(kk, barLeft, zoomPrefixLevelsCSS[zz].minZoom * 1.5, measureAnchor);
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
                            let xx = barLeft + skip.duration(curBar.tempo) * globalCommandDispatcher.cfg().widthDurationRatio;
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
        this.updateTimeSelectionBar();
    }
}
class UIToolbar {
    constructor() {
    }
    createToolbar() {
        this.menuButton = new ToolBarButton([icon_ver_menu], 1, 0, (nn) => {
            globalCommandDispatcher.resetAnchor(this.toolBarGroup, this.toolBarAnchor, LevelModes.overlay);
            globalCommandDispatcher.showRightMenu();
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
        this.lastWidth = 0;
        this.lastHeight = 0;
        this.items = [];
        this.scrollY = 0;
        this.shiftX = 0;
        this.lastZ = 1;
        this.itemsWidth = 0;
    }
    resetAllAnchors() {
        globalCommandDispatcher.resetAnchor(this.menuPanelBackground, this.backgroundAnchor, LevelModes.overlay);
        globalCommandDispatcher.resetAnchor(this.menuPanelContent, this.contentAnchor, LevelModes.overlay);
        globalCommandDispatcher.resetAnchor(this.menuPanelInteraction, this.interAnchor, LevelModes.overlay);
        globalCommandDispatcher.resetAnchor(this.menuPanelButtons, this.buttonsAnchor, LevelModes.overlay);
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
            globalCommandDispatcher.cfg().data.list = false;
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
        globalCommandDispatcher.resetAnchor(this.menuPanelContent, this.contentAnchor, LevelModes.overlay);
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
                    globalCommandDispatcher.moveTrackTop(tt);
                },
                onSubClick: () => {
                    let state = item.selection ? item.selection : 0;
                    globalCommandDispatcher.setTrackSoloState(state);
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
                    globalCommandDispatcher.moveDrumTop(tt);
                },
                onSubClick: () => {
                    let state = item.selection ? item.selection : 0;
                    globalCommandDispatcher.setDrumSoloState(state);
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
                        globalCommandDispatcher.moveAutomationTop(ff);
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
        globalCommandDispatcher.resetAnchor(this.menuPanelContent, this.contentAnchor, LevelModes.overlay);
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
        if (!globalCommandDispatcher.cfg().data.list) {
            this.shiftX = viewWidth + 1;
        }
        else {
        }
        let shn = 0.1;
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
        console.log('resizeMenu globalCommandDispatcher.globalCommandDispatcher.cfg().data.list', globalCommandDispatcher.cfg().data.list);
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
            anchor.content.push({ x: 0.5 + this.pad, y: itemTop + 0.7, text: icon_whitefolder, css: 'rightMenuIconLabel' });
            anchor.content.push({ x: 1 + this.pad, y: itemTop + 0.7, text: label, css: 'rightMenuLabel' });
        }
        if (this.kind == this.kindClosedFolder) {
            anchor.content.push({ x: 0.1 + this.pad, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'rightMenuItemActionBG' });
            anchor.content.push({ x: 0.5 + this.pad, y: itemTop + 0.7, text: icon_blackfolder, css: 'rightMenuIconLabel' });
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
        globalCommandDispatcher.upTracksLayer();
    }
};
let menuPointPercussion = {
    text: localMenuPercussionFolder,
    onOpen: () => {
        globalCommandDispatcher.upDrumsLayer();
    }
};
let menuPointAutomation = {
    text: localMenuAutomationFolder,
    onOpen: () => {
        globalCommandDispatcher.upAutoLayer();
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
                    globalCommandDispatcher.promptProjectPluginGUI(label, url, (obj) => {
                        let project = JSON.parse(obj);
                        globalCommandDispatcher.registerWorkProject(project);
                        globalCommandDispatcher.resetProject();
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
                            globalCommandDispatcher.promptPointPluginGUI(label, url, (obj) => {
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
                    globalCommandDispatcher.toggleStartStop();
                }
            },
            {
                text: localMenuItemSettings, children: [
                    {
                        text: 'Size', children: [
                            {
                                text: 'Small', onClick: () => {
                                    startLoadCSSfile('theme/sizesmall.css');
                                    globalCommandDispatcher.changeTapSize(1);
                                }
                            }, {
                                text: 'Big', onClick: () => {
                                    startLoadCSSfile('theme/sizebig.css');
                                    globalCommandDispatcher.changeTapSize(1.5);
                                }
                            }, {
                                text: 'Huge', onClick: () => {
                                    startLoadCSSfile('theme/sizehuge.css');
                                    globalCommandDispatcher.changeTapSize(4);
                                }
                            }
                        ]
                    }, {
                        text: 'Locale', children: [
                            {
                                text: 'Russian', onClick: () => {
                                    globalCommandDispatcher.setThemeLocale('ru', 1);
                                }
                            }, {
                                text: 'English', onClick: () => {
                                    globalCommandDispatcher.setThemeLocale('en', 1);
                                }
                            }, {
                                text: '中文界面语言', onClick: () => {
                                    globalCommandDispatcher.setThemeLocale('zh', 1.5);
                                }
                            }
                        ]
                    }, {
                        text: 'Colors', children: [
                            {
                                text: 'Red', onClick: () => {
                                    globalCommandDispatcher.setThemeColor('theme/colordarkred.css');
                                }
                            }, {
                                text: 'Green', onClick: () => {
                                    globalCommandDispatcher.setThemeColor('theme/colordarkgreen.css');
                                }
                            }, {
                                text: 'Blue', onClick: () => {
                                    globalCommandDispatcher.setThemeColor('theme/colordarkblue.css');
                                }
                            }
                        ]
                    }
                ]
            },
            {
                text: localMenuCommentsLayer, onClick: () => {
                    globalCommandDispatcher.upCommentsLayer();
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
    reFillLeftPanel() {
        for (let zz = 0; zz < this.leftZoomAnchors.length; zz++) {
            this.leftZoomAnchors[zz].hh = globalCommandDispatcher.cfg().wholeHeight();
            this.leftZoomAnchors[zz].content = [];
            for (let oo = 1; oo < globalCommandDispatcher.cfg().octaveCount; oo++) {
                if (zz < 4) {
                    let nm3 = {
                        x: 1,
                        y: globalCommandDispatcher.cfg().gridTop() + 12 * oo * globalCommandDispatcher.cfg().notePathHeight + 1 * zoomPrefixLevelsCSS[zz].minZoom,
                        text: '' + (globalCommandDispatcher.cfg().octaveCount - oo + 0),
                        css: 'octaveLabel' + zoomPrefixLevelsCSS[zz].prefix
                    };
                    this.leftZoomAnchors[zz].content.push(nm3);
                    if (zz < 2) {
                        nm3.x = 0.5;
                        let nm2 = {
                            x: 0.5,
                            y: globalCommandDispatcher.cfg().gridTop() + 12 * oo * globalCommandDispatcher.cfg().notePathHeight + 1 * zoomPrefixLevelsCSS[zz].minZoom + 6 * globalCommandDispatcher.cfg().notePathHeight,
                            text: '' + (globalCommandDispatcher.cfg().octaveCount - oo + 0),
                            css: 'octaveSubLabel' + zoomPrefixLevelsCSS[zz].prefix
                        };
                        this.leftZoomAnchors[zz].content.push(nm2);
                        if (zz < 1) {
                            nm2.x = 0.25;
                            nm3.x = 0.25;
                            let nm = {
                                x: 0.25,
                                y: globalCommandDispatcher.cfg().gridTop() + 12 * oo * globalCommandDispatcher.cfg().notePathHeight + 1 * zoomPrefixLevelsCSS[zz].minZoom + 3 * globalCommandDispatcher.cfg().notePathHeight,
                                text: '' + (globalCommandDispatcher.cfg().octaveCount - oo + 0),
                                css: 'octaveSubLabel' + zoomPrefixLevelsCSS[zz].prefix
                            };
                            this.leftZoomAnchors[zz].content.push(nm);
                            nm = {
                                x: 0.25,
                                y: globalCommandDispatcher.cfg().gridTop() + 12 * oo * globalCommandDispatcher.cfg().notePathHeight + 1 * zoomPrefixLevelsCSS[zz].minZoom + 9 * globalCommandDispatcher.cfg().notePathHeight,
                                text: '' + (globalCommandDispatcher.cfg().octaveCount - oo + 0),
                                css: 'octaveSubLabel' + zoomPrefixLevelsCSS[zz].prefix
                            };
                            this.leftZoomAnchors[zz].content.push(nm);
                        }
                    }
                }
            }
            if (zz < 4) {
                for (let ss = 0; ss < globalCommandDispatcher.cfg().data.percussions.length; ss++) {
                    let samplerLabel = {
                        text: '' + globalCommandDispatcher.cfg().data.percussions[ss].title,
                        x: 0,
                        y: globalCommandDispatcher.cfg().gridTop() + globalCommandDispatcher.cfg().gridHeight() - 2 * globalCommandDispatcher.cfg().data.percussions.length + 2 * globalCommandDispatcher.cfg().notePathHeight * ss + 2 * globalCommandDispatcher.cfg().notePathHeight,
                        css: 'samplerRowLabel' + zoomPrefixLevelsCSS[zz].prefix
                    };
                    this.leftZoomAnchors[zz].content.push(samplerLabel);
                }
            }
            if (zz < 4) {
                let yy = 0;
                for (let ff = 0; ff < globalCommandDispatcher.cfg().data.filters.length; ff++) {
                    let filter = globalCommandDispatcher.cfg().data.filters[ff];
                    if (filter.automation) {
                        let autoLabel = {
                            text: '' + filter.automation.title,
                            x: 0,
                            y: (globalCommandDispatcher.cfg().gridTop() + yy + 1) * globalCommandDispatcher.cfg().notePathHeight,
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
    constructor(barIdx, drumIdx, zoomLevel, anchor, left) {
        let drum = globalCommandDispatcher.cfg().data.percussions[drumIdx];
        let measure = drum.measures[barIdx];
        let yy = globalCommandDispatcher.cfg().samplerTop() + drumIdx * globalCommandDispatcher.cfg().notePathHeight * 2;
        let tempo = globalCommandDispatcher.cfg().data.timeline[barIdx].tempo;
        let css = 'samplerDrumDotBg';
        if (globalCommandDispatcher.cfg().data.focus)
            if (globalCommandDispatcher.cfg().data.focus == 1)
                css = 'samplerDrumDotFocused';
        for (let ss = 0; ss < measure.skips.length; ss++) {
            let skip = measure.skips[ss];
            let xx = left + MMUtil().set(skip).duration(tempo) * globalCommandDispatcher.cfg().widthDurationRatio;
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
    constructor(barIdx, octaveIdx, left, top, width, height, barOctaveGridAnchor, barOctaveTrackAnchor, barOctaveFirstAnchor, zoomLevel) {
        new OctaveContent(barIdx, octaveIdx, left, top, width, height, barOctaveTrackAnchor, barOctaveFirstAnchor, zoomLevel);
    }
}
class OctaveContent {
    constructor(barIdx, octaveIdx, left, top, width, height, barOctaveTrackAnchor, barOctaveFirstAnchor, zoomLevel) {
        if (zoomLevel < 8) {
            this.addUpperNotes(barIdx, octaveIdx, left, top, width, height, barOctaveFirstAnchor, zoomLevel);
            if (zoomLevel < 7) {
                this.addOtherNotes(barIdx, octaveIdx, left, top, width, height, barOctaveTrackAnchor);
            }
        }
    }
    addUpperNotes(barIdx, octaveIdx, left, top, width, height, barOctaveAnchor, zoomLevel) {
        if (globalCommandDispatcher.cfg().data.tracks.length) {
            let css = 'mixNoteLine';
            if (globalCommandDispatcher.cfg().data.focus) {
                css = 'mixNoteSub';
            }
            if (zoomLevel == 0) {
                this.addTrackNotes(globalCommandDispatcher.cfg().data.tracks[0], barIdx, octaveIdx, left, top, width, height, barOctaveAnchor, css);
            }
            else {
                this.addTrackNotes(globalCommandDispatcher.cfg().data.tracks[0], barIdx, octaveIdx, left, top, width, height, barOctaveAnchor, css);
            }
        }
    }
    addOtherNotes(barIdx, octaveIdx, left, top, width, height, barOctaveAnchor) {
        for (let ii = 1; ii < globalCommandDispatcher.cfg().data.tracks.length; ii++) {
            let track = globalCommandDispatcher.cfg().data.tracks[ii];
            this.addTrackNotes(track, barIdx, octaveIdx, left, top, width, height, barOctaveAnchor, 'mixNoteSub');
        }
    }
    addTrackNotes(track, barIdx, octaveIdx, left, top, width, height, barOctaveAnchor, css) {
        let measure = track.measures[barIdx];
        for (let cc = 0; cc < measure.chords.length; cc++) {
            let chord = measure.chords[cc];
            for (let nn = 0; nn < chord.pitches.length; nn++) {
                let from = octaveIdx * 12;
                let to = (octaveIdx + 1) * 12;
                if (chord.pitches[nn] >= from && chord.pitches[nn] < to) {
                    let x1 = left + MMUtil().set(chord.skip).duration(globalCommandDispatcher.cfg().data.timeline[barIdx].tempo) * globalCommandDispatcher.cfg().widthDurationRatio;
                    let y1 = top + height - (chord.pitches[nn] - from) * globalCommandDispatcher.cfg().notePathHeight;
                    for (let ss = 0; ss < chord.slides.length; ss++) {
                        let x2 = x1 + MMUtil().set(chord.slides[ss].duration).duration(globalCommandDispatcher.cfg().data.timeline[barIdx].tempo) * globalCommandDispatcher.cfg().widthDurationRatio;
                        let y2 = y1 - chord.slides[ss].delta * globalCommandDispatcher.cfg().notePathHeight;
                        let r_x1 = x1 + globalCommandDispatcher.cfg().notePathHeight / 2;
                        if (ss > 0) {
                            r_x1 = x1;
                        }
                        let r_x2 = x2 - globalCommandDispatcher.cfg().notePathHeight / 2;
                        if (ss < chord.slides.length - 1) {
                            r_x2 = x2;
                        }
                        if (r_x2 - r_x1 < globalCommandDispatcher.cfg().notePathHeight / 2) {
                            r_x2 = r_x1 + 0.000001;
                        }
                        if (barOctaveAnchor.ww < r_x2 - barOctaveAnchor.xx) {
                            barOctaveAnchor.ww = r_x2 - barOctaveAnchor.xx;
                        }
                        let line = {
                            x1: r_x1,
                            y1: y1 - globalCommandDispatcher.cfg().notePathHeight / 2,
                            x2: r_x2,
                            y2: y2 - globalCommandDispatcher.cfg().notePathHeight / 2,
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
    constructor(barIdx, left, ww, zoomLevel, gridZoomBarAnchor, tracksZoomBarAnchor, firstZoomBarAnchor) {
        let h12 = 12 * globalCommandDispatcher.cfg().notePathHeight;
        for (let oo = 0; oo < globalCommandDispatcher.cfg().octaveCount; oo++) {
            let gridOctaveAnchor = {
                showZoom: zoomPrefixLevelsCSS[zoomLevel].minZoom,
                hideZoom: zoomPrefixLevelsCSS[zoomLevel + 1].minZoom,
                xx: left,
                yy: globalCommandDispatcher.cfg().gridTop() + oo * h12,
                ww: ww,
                hh: h12, content: [],
                id: 'octaveGridz' + zoomLevel + 'b' + barIdx + 'o' + oo + 'r' + Math.random()
            };
            gridZoomBarAnchor.content.push(gridOctaveAnchor);
            let tracksOctaveAnchor = {
                showZoom: zoomPrefixLevelsCSS[zoomLevel].minZoom,
                hideZoom: zoomPrefixLevelsCSS[zoomLevel + 1].minZoom,
                xx: left,
                yy: globalCommandDispatcher.cfg().gridTop() + oo * h12,
                ww: ww,
                hh: h12, content: [],
                id: 'octaveTracks' + zoomLevel + 'b' + barIdx + 'o' + oo + 'r' + Math.random()
            };
            tracksZoomBarAnchor.content.push(tracksOctaveAnchor);
            let firstOctaveAnchor = {
                showZoom: zoomPrefixLevelsCSS[zoomLevel].minZoom,
                hideZoom: zoomPrefixLevelsCSS[zoomLevel + 1].minZoom,
                xx: left,
                yy: globalCommandDispatcher.cfg().gridTop() + oo * h12,
                ww: ww,
                hh: h12, content: [],
                id: 'octaveFirst' + zoomLevel + 'b' + barIdx + 'o' + oo + 'r' + Math.random()
            };
            firstZoomBarAnchor.content.push(firstOctaveAnchor);
            new BarOctave(barIdx, (globalCommandDispatcher.cfg().octaveCount - oo - 1), left, globalCommandDispatcher.cfg().gridTop() + oo * h12, ww, h12, gridOctaveAnchor, tracksOctaveAnchor, firstOctaveAnchor, zoomLevel);
            if (firstZoomBarAnchor.ww < firstOctaveAnchor.ww) {
                firstZoomBarAnchor.ww = firstOctaveAnchor.ww;
            }
            if (tracksZoomBarAnchor.ww < tracksOctaveAnchor.ww) {
                tracksZoomBarAnchor.ww = tracksOctaveAnchor.ww;
            }
        }
        if (zoomLevel < 6) {
            this.addOctaveGridSteps(barIdx, left, ww, gridZoomBarAnchor, zoomLevel);
        }
        if (zoomLevel < 7) {
            for (let pp = 0; pp < globalCommandDispatcher.cfg().data.percussions.length; pp++) {
                let drum = globalCommandDispatcher.cfg().data.percussions[pp];
                if (drum) {
                    let measure = drum.measures[barIdx];
                    if (measure) {
                        new SamplerBar(barIdx, pp, zoomLevel, firstZoomBarAnchor, left);
                    }
                }
            }
        }
        if (zoomLevel < 7) {
            new TextComments(barIdx, left, gridZoomBarAnchor, zoomLevel);
        }
        if (zoomLevel < 7) {
            new AutomationBarContent(barIdx, left, gridZoomBarAnchor, zoomLevel);
        }
    }
    addOctaveGridSteps(barIdx, barLeft, width, barOctaveAnchor, zIndex) {
        let zoomInfo = zoomPrefixLevelsCSS[zIndex];
        let curBar = globalCommandDispatcher.cfg().data.timeline[barIdx];
        let lineCount = 0;
        let skip = MMUtil().set({ count: 0, part: 1 });
        let top = globalCommandDispatcher.cfg().gridTop();
        let height = globalCommandDispatcher.cfg().gridHeight();
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
                let xx = barLeft + skip.duration(curBar.tempo) * globalCommandDispatcher.cfg().widthDurationRatio;
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
    constructor(barIdx, barLeft, barOctaveAnchor, zIndex) {
        let curBar = globalCommandDispatcher.cfg().data.timeline[barIdx];
        let top = globalCommandDispatcher.cfg().gridTop();
        if (barIdx < globalCommandDispatcher.cfg().data.comments.length) {
            let txtZoomRatio = 1;
            if (zIndex > 2)
                txtZoomRatio = 2;
            if (zIndex > 3)
                txtZoomRatio = 4;
            if (zIndex > 4)
                txtZoomRatio = 8;
            let css = 'commentReadText' + zoomPrefixLevelsCSS[zIndex].prefix;
            if (globalCommandDispatcher.cfg().data.focus) {
                if (globalCommandDispatcher.cfg().data.focus == 3) {
                    css = 'commentLineText' + zoomPrefixLevelsCSS[zIndex].prefix;
                }
            }
            for (let ii = 0; ii < globalCommandDispatcher.cfg().data.comments[barIdx].points.length; ii++) {
                let itxt = globalCommandDispatcher.cfg().data.comments[barIdx].points[ii];
                let xx = barLeft + MMUtil().set(itxt.skip).duration(curBar.tempo) * globalCommandDispatcher.cfg().widthDurationRatio;
                let tt = {
                    x: xx,
                    y: top + globalCommandDispatcher.cfg().notePathHeight * (1 + itxt.row) * txtZoomRatio,
                    text: globalCommandDispatcher.cfg().data.comments[barIdx].points[ii].text,
                    css: css
                };
                barOctaveAnchor.content.push(tt);
            }
        }
    }
}
class AutomationBarContent {
    constructor(barIdx, barLeft, barOctaveAnchor, zIndex) {
        let curBar = globalCommandDispatcher.cfg().data.timeline[barIdx];
        let width = MMUtil().set(curBar.metre).duration(curBar.tempo) * globalCommandDispatcher.cfg().widthDurationRatio;
        let left = barLeft + width;
        let top = globalCommandDispatcher.cfg().gridTop();
        let height = globalCommandDispatcher.cfg().automationMaxHeight();
        let css = 'automationBgDot';
        if (globalCommandDispatcher.cfg().data.focus)
            if (globalCommandDispatcher.cfg().data.focus == 2)
                css = 'automationFocusedDot';
        let yy = 0;
        for (let ff = 0; ff < globalCommandDispatcher.cfg().data.filters.length; ff++) {
            let filter = globalCommandDispatcher.cfg().data.filters[ff];
            if (filter.automation) {
                if (filter.automation.measures[barIdx]) {
                    let measure = filter.automation.measures[barIdx];
                    for (let ii = 0; ii < measure.changes.length; ii++) {
                        let change = measure.changes[ii];
                        let xx = barLeft + MMUtil().set(change.skip).duration(curBar.tempo) * globalCommandDispatcher.cfg().widthDurationRatio;
                        let aubtn = {
                            dots: [xx, top + globalCommandDispatcher.cfg().notePathHeight * yy,
                                xx + 1, top + globalCommandDispatcher.cfg().notePathHeight * yy,
                                xx, top + globalCommandDispatcher.cfg().notePathHeight * (yy + 1)
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
    reFillMixerUI() {
        let ww = globalCommandDispatcher.cfg().wholeWidth();
        let hh = globalCommandDispatcher.cfg().wholeHeight();
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
            this.spearsLayer.anchors[ii].ww = ww;
            this.spearsLayer.anchors[ii].hh = hh;
            this.spearsLayer.anchors[ii].content = [];
            this.levels[ii].reCreateBars();
        }
        this.fanPane.resetPlates(this.fanLayer.anchors, this.spearsLayer.anchors);
        this.fillerAnchor.xx = globalCommandDispatcher.cfg().leftPad;
        this.fillerAnchor.yy = globalCommandDispatcher.cfg().gridTop();
        this.fillerAnchor.ww = globalCommandDispatcher.cfg().wholeWidth() - globalCommandDispatcher.cfg().leftPad - globalCommandDispatcher.cfg().rightPad;
        this.fillerAnchor.hh = globalCommandDispatcher.cfg().gridHeight();
        this.fillerAnchor.content = [];
        this.reFillWholeRatio();
        this.reFillSingleRatio();
    }
    createMixerLayers() {
        let tracksLayerZoom = document.getElementById('tracksLayerZoom');
        this.trackLayers = { g: tracksLayerZoom, anchors: [], mode: LevelModes.normal };
        let gridLayerZoom = document.getElementById('gridLayerZoom');
        this.gridLayers = { g: gridLayerZoom, anchors: [], mode: LevelModes.normal };
        let firstLayerZoom = document.getElementById('firstLayerZoom');
        this.firstLayers = { g: firstLayerZoom, anchors: [], mode: LevelModes.normal };
        this.fanSVGgroup = document.getElementById('fanLayer');
        this.fanLayer = { g: this.fanSVGgroup, anchors: [], mode: LevelModes.normal };
        let spearsSVGgroup = document.getElementById('spearsLayer');
        this.spearsLayer = { g: spearsSVGgroup, anchors: [], mode: LevelModes.normal };
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
            let spearAnchor = {
                showZoom: zoomPrefixLevelsCSS[ii].minZoom,
                hideZoom: zoomPrefixLevelsCSS[ii + 1].minZoom,
                xx: 0, yy: 0, ww: 1, hh: 1, content: []
            };
            this.spearsLayer.anchors.push(spearAnchor);
            this.levels.push(new MixerZoomLevel(ii, mixerGridAnchor, mixerTrackAnchor, mixerFirstAnchor));
        }
        this.fillerAnchor = {
            showZoom: zoomPrefixLevelsCSS[6].minZoom,
            hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom + 1,
            xx: 0, yy: 0, ww: 1, hh: 1, content: []
        };
        this.gridLayers.anchors.push(this.fillerAnchor);
        return [this.gridLayers, this.trackLayers, this.firstLayers, this.fanLayer, this.spearsLayer];
    }
    reFillSingleRatio() {
        let countFunction;
        let yy = globalCommandDispatcher.cfg().gridTop() + globalCommandDispatcher.cfg().gridHeight() / 8;
        let hh = globalCommandDispatcher.cfg().gridHeight() * 6 / 8;
        if (globalCommandDispatcher.cfg().data.focus) {
            if (globalCommandDispatcher.cfg().data.focus == 1) {
                countFunction = this.barDrumCount;
                yy = globalCommandDispatcher.cfg().gridTop() + globalCommandDispatcher.cfg().gridHeight() - 2 * globalCommandDispatcher.cfg().data.percussions.length;
                hh = 2 * globalCommandDispatcher.cfg().data.percussions.length;
            }
            else {
                if (globalCommandDispatcher.cfg().data.focus == 2) {
                    countFunction = this.barAutoCount;
                    yy = globalCommandDispatcher.cfg().gridTop();
                    hh = globalCommandDispatcher.cfg().maxAutomationsCount;
                }
                else {
                    countFunction = this.barCommentsCount;
                    yy = globalCommandDispatcher.cfg().gridTop();
                    hh = globalCommandDispatcher.cfg().commentsMaxHeight();
                }
            }
        }
        else {
            countFunction = this.barTrackCount;
        }
        let mxItems = 0;
        for (let bb = 0; bb < globalCommandDispatcher.cfg().data.timeline.length; bb++) {
            let itemcount = countFunction(bb);
            if (mxItems < itemcount) {
                mxItems = itemcount;
            }
        }
        if (mxItems < 1)
            mxItems = 1;
        let barX = 0;
        for (let bb = 0; bb < globalCommandDispatcher.cfg().data.timeline.length; bb++) {
            let itemcount = countFunction(bb);
            let filIdx = 1 + Math.round(7 * itemcount / mxItems);
            let css = 'mixFiller' + filIdx;
            let barwidth = MMUtil().set(globalCommandDispatcher.cfg().data.timeline[bb].metre).duration(globalCommandDispatcher.cfg().data.timeline[bb].tempo) * globalCommandDispatcher.cfg().widthDurationRatio;
            let fillRectangle = {
                x: globalCommandDispatcher.cfg().leftPad + barX,
                y: yy,
                w: barwidth,
                h: hh,
                css: css
            };
            this.fillerAnchor.content.push(fillRectangle);
            barX = barX + barwidth;
        }
    }
    reFillWholeRatio() {
        let yy = globalCommandDispatcher.cfg().gridTop();
        let hh = globalCommandDispatcher.cfg().gridHeight() / 8;
        if (globalCommandDispatcher.cfg().data.focus) {
            if (globalCommandDispatcher.cfg().data.focus == 1) {
                yy = globalCommandDispatcher.cfg().gridTop();
                hh = globalCommandDispatcher.cfg().gridHeight() - 2 * globalCommandDispatcher.cfg().data.percussions.length;
            }
            else {
                if (globalCommandDispatcher.cfg().data.focus == 2) {
                    yy = globalCommandDispatcher.cfg().gridTop() + globalCommandDispatcher.cfg().maxAutomationsCount;
                    hh = globalCommandDispatcher.cfg().gridHeight() - globalCommandDispatcher.cfg().maxAutomationsCount;
                }
                else {
                    yy = globalCommandDispatcher.cfg().gridTop() + globalCommandDispatcher.cfg().commentsMaxHeight();
                    hh = globalCommandDispatcher.cfg().gridHeight() - globalCommandDispatcher.cfg().commentsMaxHeight();
                }
            }
        }
        let countFunction = (barIdx) => {
            return this.barDrumCount(barIdx) + this.barAutoCount(barIdx)
                + this.barCommentsCount(barIdx) + this.barTrackCount(barIdx);
        };
        let mxItems = 0;
        for (let bb = 0; bb < globalCommandDispatcher.cfg().data.timeline.length; bb++) {
            let itemcount = countFunction(bb);
            if (mxItems < itemcount) {
                mxItems = itemcount;
            }
        }
        if (mxItems < 1)
            mxItems = 1;
        let barX = 0;
        for (let bb = 0; bb < globalCommandDispatcher.cfg().data.timeline.length; bb++) {
            let itemcount = countFunction(bb);
            let filIdx = 1 + Math.round(7 * itemcount / mxItems);
            let css = 'mixFiller' + filIdx;
            let barwidth = MMUtil().set(globalCommandDispatcher.cfg().data.timeline[bb].metre).duration(globalCommandDispatcher.cfg().data.timeline[bb].tempo) * globalCommandDispatcher.cfg().widthDurationRatio;
            let fillRectangle = {
                x: globalCommandDispatcher.cfg().leftPad + barX,
                y: yy,
                w: barwidth,
                h: hh,
                css: css
            };
            this.fillerAnchor.content.push(fillRectangle);
            if (globalCommandDispatcher.cfg().data.focus) {
            }
            else {
                this.fillerAnchor.content.push({
                    x: globalCommandDispatcher.cfg().leftPad + barX,
                    y: globalCommandDispatcher.cfg().gridTop() + globalCommandDispatcher.cfg().gridHeight() * 7 / 8,
                    w: barwidth,
                    h: hh,
                    css: css
                });
            }
            barX = barX + barwidth;
        }
    }
    barTrackCount(bb) {
        let notecount = 0;
        for (let tt = 0; tt < globalCommandDispatcher.cfg().data.tracks.length; tt++) {
            let bar = globalCommandDispatcher.cfg().data.tracks[tt].measures[bb];
            if (bar) {
                for (let cc = 0; cc < bar.chords.length; cc++) {
                    notecount = notecount + bar.chords[cc].pitches.length;
                }
            }
        }
        return notecount;
    }
    barDrumCount(bb) {
        let drumcount = 0;
        for (let tt = 0; tt < globalCommandDispatcher.cfg().data.percussions.length; tt++) {
            let bar = globalCommandDispatcher.cfg().data.percussions[tt].measures[bb];
            if (bar) {
                drumcount = drumcount + bar.skips.length;
            }
        }
        return drumcount;
    }
    barAutoCount(bb) {
        let autoCnt = 0;
        for (let ff = 0; ff < globalCommandDispatcher.cfg().data.filters.length; ff++) {
            let filter = globalCommandDispatcher.cfg().data.filters[ff];
            if (filter.automation) {
                if (filter.automation.measures[bb]) {
                    autoCnt = autoCnt + filter.automation.measures[bb].changes.length;
                }
            }
        }
        return autoCnt;
    }
    barCommentsCount(bb) {
        if (globalCommandDispatcher.cfg().data.comments[bb]) {
            if (globalCommandDispatcher.cfg().data.comments[bb].points) {
                return globalCommandDispatcher.cfg().data.comments[bb].points.length;
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
    reCreateBars() {
        this.zoomGridAnchor.content = [];
        this.zoomTracksAnchor.content = [];
        this.zoomFirstAnchor.content = [];
        this.bars = [];
        let left = globalCommandDispatcher.cfg().leftPad;
        let width = 0;
        for (let ii = 0; ii < globalCommandDispatcher.cfg().data.timeline.length; ii++) {
            let timebar = globalCommandDispatcher.cfg().data.timeline[ii];
            width = MMUtil().set(timebar.metre).duration(timebar.tempo) * globalCommandDispatcher.cfg().widthDurationRatio;
            let barGridAnchor = {
                showZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom, hideZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex + 1].minZoom,
                xx: left, yy: 0, ww: width, hh: globalCommandDispatcher.cfg().wholeHeight(), content: [], id: 'barGrid' + (ii + Math.random())
            };
            this.zoomGridAnchor.content.push(barGridAnchor);
            let barTracksAnchor = {
                showZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom, hideZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex + 1].minZoom,
                xx: left, yy: 0, ww: width, hh: globalCommandDispatcher.cfg().wholeHeight(), content: [], id: 'barTrack' + (ii + Math.random())
            };
            this.zoomTracksAnchor.content.push(barTracksAnchor);
            let barFirstAnchor = {
                showZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom, hideZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex + 1].minZoom,
                xx: left, yy: 0, ww: width, hh: globalCommandDispatcher.cfg().wholeHeight(), content: [], id: 'barFirst' + (ii + Math.random())
            };
            this.zoomFirstAnchor.content.push(barFirstAnchor);
            let mixBar = new MixerBar(ii, left, width, this.zoomLevelIndex, barGridAnchor, barTracksAnchor, barFirstAnchor);
            this.bars.push(mixBar);
            left = left + width;
        }
        let titleLabel = {
            x: 0,
            y: globalCommandDispatcher.cfg().heightOfTitle(),
            text: globalCommandDispatcher.cfg().data.title,
            css: 'titleLabel' + zoomPrefixLevelsCSS[this.zoomLevelIndex].prefix
        };
        this.zoomGridAnchor.content.push(titleLabel);
        this.addDrumLines();
        this.addGridLines(this.zoomGridAnchor);
        this.addCommentLines();
    }
    addDrumLines() {
    }
    addCommentLines() {
    }
    addGridLines(barOctaveAnchor) {
        if (this.zoomLevelIndex < 4) {
            for (let oo = 0; oo < globalCommandDispatcher.cfg().octaveCount; oo++) {
                if (oo > 0) {
                    let octaveBottomBorder = {
                        x: globalCommandDispatcher.cfg().leftPad,
                        y: globalCommandDispatcher.cfg().gridTop() + oo * 12 * globalCommandDispatcher.cfg().notePathHeight,
                        w: globalCommandDispatcher.cfg().timelineWidth(),
                        h: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom / 2.0,
                        css: 'octaveBottomBorder'
                    };
                    barOctaveAnchor.content.push(octaveBottomBorder);
                }
                if (this.zoomLevelIndex < 3) {
                    for (let kk = 1; kk < 12; kk++) {
                        let need = false;
                        if (globalCommandDispatcher.cfg().data.focus) {
                            if (globalCommandDispatcher.cfg().data.focus == 1) {
                                if (oo * 12 + kk > 12 * globalCommandDispatcher.cfg().octaveCount - globalCommandDispatcher.cfg().data.percussions.length * 2 - 2) {
                                    if (!((oo * 12 + kk) % 2)) {
                                        need = true;
                                    }
                                }
                            }
                            else {
                                if (globalCommandDispatcher.cfg().data.focus == 2) {
                                    if (oo * 12 + kk <= globalCommandDispatcher.cfg().maxAutomationsCount) {
                                        need = true;
                                    }
                                }
                                else {
                                    if (oo * 12 + kk < 2 + globalCommandDispatcher.cfg().maxCommentRowCount) {
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
                                x: globalCommandDispatcher.cfg().leftPad,
                                y: globalCommandDispatcher.cfg().gridTop() + (oo * 12 + kk) * globalCommandDispatcher.cfg().notePathHeight,
                                w: globalCommandDispatcher.cfg().timelineWidth(),
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
    resetPlates(fanAnchors, spearsAnchors) {
        this.filterIcons = [];
        this.autoIcons = [];
        this.performerIcons = [];
        this.samplerIcons = [];
        for (let ff = 0; ff < globalCommandDispatcher.cfg().data.filters.length; ff++) {
            if (globalCommandDispatcher.cfg().data.filters[ff].automation) {
                this.autoIcons.push(new FilterIcon(globalCommandDispatcher.cfg().data.filters[ff].id));
            }
            else {
                this.filterIcons.push(new FilterIcon(globalCommandDispatcher.cfg().data.filters[ff].id));
            }
        }
        for (let tt = 0; tt < globalCommandDispatcher.cfg().data.tracks.length; tt++) {
            this.performerIcons.push(new PerformerIcon(globalCommandDispatcher.cfg().data.tracks[tt].performer.id));
        }
        for (let tt = 0; tt < globalCommandDispatcher.cfg().data.percussions.length; tt++) {
            this.samplerIcons.push(new SamplerIcon(globalCommandDispatcher.cfg().data.percussions[tt].sampler.id));
        }
        for (let ii = 0; ii < zoomPrefixLevelsCSS.length - 1; ii++) {
            this.buildPerformerIcons(fanAnchors[ii], spearsAnchors[ii], ii);
            this.buildFilterIcons(fanAnchors[ii], spearsAnchors[ii], ii);
            this.buildAutoIcons(fanAnchors[ii], spearsAnchors[ii], ii);
            this.buildSamplerIcons(fanAnchors[ii], spearsAnchors[ii], ii);
            this.buildOutIcon(fanAnchors[ii], ii);
        }
    }
    buildPerformerIcons(fanAnchor, spearsAnchor, zidx) {
        for (let ii = 0; ii < this.performerIcons.length; ii++) {
            this.performerIcons[ii].buildPerformerSpot(fanAnchor, spearsAnchor, zidx);
        }
    }
    buildSamplerIcons(fanAnchor, spearsAnchor, zidx) {
        for (let ii = 0; ii < this.samplerIcons.length; ii++) {
            this.samplerIcons[ii].buildSamplerSpot(fanAnchor, spearsAnchor, zidx);
        }
    }
    buildAutoIcons(fanAnchor, spearsAnchor, zidx) {
        for (let ii = 0; ii < this.autoIcons.length; ii++) {
            this.autoIcons[ii].buildAutoSpot(fanAnchor, spearsAnchor, zidx);
        }
    }
    buildFilterIcons(fanAnchor, spearsAnchor, zidx) {
        for (let ii = 0; ii < this.filterIcons.length; ii++) {
            this.filterIcons[ii].buildFilterSpot(fanAnchor, spearsAnchor, zidx);
        }
    }
    buildOutIcon(fanAnchor, zidx) {
        let speakerX = globalCommandDispatcher.cfg().wholeWidth() - globalCommandDispatcher.cfg().speakerIconPad - globalCommandDispatcher.cfg().rightPad + globalCommandDispatcher.cfg().pluginIconSize / 2;
        let speakerY = globalCommandDispatcher.cfg().gridTop() + globalCommandDispatcher.cfg().gridHeight() / 2 - globalCommandDispatcher.cfg().speakerIconSize / 2;
        let rec = {
            x: speakerX, y: speakerY, w: globalCommandDispatcher.cfg().speakerIconSize, h: globalCommandDispatcher.cfg().speakerIconSize,
            rx: globalCommandDispatcher.cfg().speakerIconSize / 2, ry: globalCommandDispatcher.cfg().speakerIconSize / 2, css: 'fanSpeakerIcon'
        };
        fanAnchor.content.push(rec);
        let icon = {
            x: speakerX + globalCommandDispatcher.cfg().speakerIconSize,
            y: speakerY + globalCommandDispatcher.cfg().speakerIconSize, text: icon_sound_loud, css: 'fanSpeakerIconLabel'
        };
        fanAnchor.content.push(icon);
    }
}
class PerformerIcon {
    constructor(performerId) {
        this.performerId = performerId;
    }
    buildPerformerSpot(fanLevelAnchor, spearsAnchor, zidx) {
        for (let ii = 0; ii < globalCommandDispatcher.cfg().data.tracks.length; ii++) {
            if (globalCommandDispatcher.cfg().data.tracks[ii].performer.id == this.performerId) {
                let audioSeq = globalCommandDispatcher.cfg().data.tracks[ii].performer;
                this.addPerformerSpot(audioSeq, fanLevelAnchor, spearsAnchor, zidx);
                break;
            }
        }
    }
    addPerformerSpot(audioSeq, fanLevelAnchor, spearsAnchor, zidx) {
        let left = globalCommandDispatcher.cfg().leftPad + globalCommandDispatcher.cfg().timelineWidth() + globalCommandDispatcher.cfg().padGridFan;
        let top = globalCommandDispatcher.cfg().gridTop();
        let xx = left;
        let yy = top;
        if (audioSeq.iconPosition) {
            xx = left + audioSeq.iconPosition.x;
            yy = top + audioSeq.iconPosition.y;
        }
        let rec = {
            x: xx, y: yy,
            w: globalCommandDispatcher.cfg().pluginIconSize, h: globalCommandDispatcher.cfg().pluginIconSize,
            css: 'fanPerformerIcon',
            draggable: true,
            activation: (x, y) => { console.log(x, y); }
        };
        fanLevelAnchor.content.push(rec);
        if (zidx < 5) {
            let txt = {
                text: audioSeq.kind + ':' + audioSeq.id,
                x: xx, y: yy + globalCommandDispatcher.cfg().pluginIconSize, css: 'fanIconLabel'
            };
            fanLevelAnchor.content.push(txt);
        }
        let controlLineWidth = xx - globalCommandDispatcher.cfg().leftPad - globalCommandDispatcher.cfg().timelineWidth();
        new ControlConnection().addAudioStreamLineFlow(yy + globalCommandDispatcher.cfg().pluginIconSize / 2, controlLineWidth, fanLevelAnchor);
        new FanOutputLine().addOutputs(audioSeq.outputs, fanLevelAnchor, spearsAnchor, audioSeq.id, xx + globalCommandDispatcher.cfg().pluginIconSize / 2, yy + globalCommandDispatcher.cfg().pluginIconSize / 2, zidx);
    }
}
class SamplerIcon {
    constructor(samplerId) {
        this.samplerId = samplerId;
    }
    buildSamplerSpot(fanLevelAnchor, spearsAnchor, zidx) {
        for (let ii = 0; ii < globalCommandDispatcher.cfg().data.percussions.length; ii++) {
            if (globalCommandDispatcher.cfg().data.percussions[ii].sampler.id == this.samplerId) {
                let sampler = globalCommandDispatcher.cfg().data.percussions[ii].sampler;
                this.addSamplerSpot(sampler, fanLevelAnchor, spearsAnchor, zidx);
                break;
            }
        }
    }
    addSamplerSpot(sampler, fanLevelAnchor, spearsAnchor, zidx) {
        let left = globalCommandDispatcher.cfg().leftPad + globalCommandDispatcher.cfg().timelineWidth() + globalCommandDispatcher.cfg().padGridFan;
        let top = globalCommandDispatcher.cfg().gridTop();
        let xx = left;
        let yy = top;
        if (sampler.iconPosition) {
            xx = left + sampler.iconPosition.x;
            yy = top + sampler.iconPosition.y;
        }
        let controlLineWidth = xx - globalCommandDispatcher.cfg().leftPad - globalCommandDispatcher.cfg().timelineWidth();
        if (zidx < 5) {
            let dragAnchor = { xx: xx, yy: yy, ww: globalCommandDispatcher.cfg().pluginIconSize, hh: globalCommandDispatcher.cfg().pluginIconSize, showZoom: fanLevelAnchor.showZoom, hideZoom: fanLevelAnchor.hideZoom, content: [], translation: { x: 0, y: 0 } };
            fanLevelAnchor.content.push(dragAnchor);
            let rec = {
                x: xx, y: yy,
                dots: [
                    0, globalCommandDispatcher.cfg().pluginIconSize / 2,
                    globalCommandDispatcher.cfg().pluginIconSize / 2, 0,
                    globalCommandDispatcher.cfg().pluginIconSize, globalCommandDispatcher.cfg().pluginIconSize / 2,
                    globalCommandDispatcher.cfg().pluginIconSize / 2, globalCommandDispatcher.cfg().pluginIconSize
                ],
                draggable: true,
                activation: (x, y) => {
                    console.log('sampler', x, y);
                    if (!dragAnchor.translation) {
                        dragAnchor.translation = { x: 0, y: 0 };
                    }
                    if (x == 0 && y == 0) {
                        console.log('done', dragAnchor.translation);
                        if (!sampler.iconPosition) {
                            sampler.iconPosition = { x: 0, y: 0 };
                        }
                        sampler.iconPosition.x = sampler.iconPosition.x + dragAnchor.translation.x;
                        sampler.iconPosition.y = sampler.iconPosition.y + dragAnchor.translation.y;
                        dragAnchor.translation = { x: 0, y: 0 };
                        globalCommandDispatcher.resetProject();
                    }
                    else {
                        dragAnchor.translation.x = dragAnchor.translation.x + x;
                        dragAnchor.translation.y = dragAnchor.translation.y + y;
                        globalCommandDispatcher.renderer.tiler.resetAnchor(globalCommandDispatcher.renderer.mixer.fanSVGgroup, fanLevelAnchor, LevelModes.normal);
                    }
                },
                css: 'fanSamplerMoveIcon'
            };
            dragAnchor.content.push(rec);
            if (zidx < 3) {
                let txt = {
                    text: sampler.kind + ':' + sampler.id,
                    x: xx + globalCommandDispatcher.cfg().pluginIconSize / 2,
                    y: yy + globalCommandDispatcher.cfg().pluginIconSize / 2,
                    css: 'fanIconLabel'
                };
                dragAnchor.content.push(txt);
            }
            if (zidx < 4) {
                let cx = xx + globalCommandDispatcher.cfg().pluginIconSize;
                let cy = yy + globalCommandDispatcher.cfg().pluginIconSize / 2;
                let btnsz = 1.5;
                if (zidx < 1) {
                    btnsz = 0.5;
                }
                else {
                    if (zidx < 2) {
                        btnsz = 0.75;
                    }
                    else {
                        if (zidx < 3) {
                            btnsz = 1;
                        }
                    }
                }
                let link = { x: cx - btnsz / 2, y: cy - btnsz / 2,
                    w: btnsz, h: btnsz, rx: btnsz / 2, ry: btnsz / 2,
                    css: 'fanPointLinker' };
                dragAnchor.content.push(link);
                let linkIcon = {
                    x: cx, y: cy + btnsz / 5, text: icon_splitfan, css: 'fanSplitIconLabel'
                };
                dragAnchor.content.push(linkIcon);
            }
        }
        new ControlConnection().addAudioStreamLineFlow(yy + globalCommandDispatcher.cfg().pluginIconSize / 2, controlLineWidth, fanLevelAnchor);
        new FanOutputLine().addOutputs(sampler.outputs, fanLevelAnchor, spearsAnchor, sampler.id, xx + globalCommandDispatcher.cfg().pluginIconSize, yy + globalCommandDispatcher.cfg().pluginIconSize / 2, zidx);
    }
}
class FilterIcon {
    constructor(filterId) {
        this.filterId = filterId;
    }
    buildFilterSpot(fanLevelAnchor, spearsAnchor, zidx) {
        for (let ii = 0; ii < globalCommandDispatcher.cfg().data.filters.length; ii++) {
            if (globalCommandDispatcher.cfg().data.filters[ii].id == this.filterId) {
                let filterTarget = globalCommandDispatcher.cfg().data.filters[ii];
                this.addFilterSpot(filterTarget, fanLevelAnchor, spearsAnchor, zidx);
                break;
            }
        }
    }
    addFilterSpot(filterTarget, fanLevelAnchor, spearsAnchor, zidx) {
        let left = globalCommandDispatcher.cfg().leftPad + globalCommandDispatcher.cfg().timelineWidth() + globalCommandDispatcher.cfg().padGridFan;
        let top = globalCommandDispatcher.cfg().gridTop();
        let xx = left;
        let yy = top;
        if (filterTarget.iconPosition) {
            xx = left + filterTarget.iconPosition.x;
            yy = top + filterTarget.iconPosition.y;
        }
        let rec = {
            x: xx, y: yy, w: globalCommandDispatcher.cfg().pluginIconSize,
            rx: globalCommandDispatcher.cfg().pluginIconSize / 2, ry: globalCommandDispatcher.cfg().pluginIconSize / 2,
            h: globalCommandDispatcher.cfg().pluginIconSize, css: 'fanFilterIcon'
        };
        fanLevelAnchor.content.push(rec);
        if (zidx < 5) {
            let txt = { text: filterTarget.kind + ':' + filterTarget.id, x: xx, y: yy + globalCommandDispatcher.cfg().pluginIconSize, css: 'fanIconLabel' };
            fanLevelAnchor.content.push(txt);
        }
        new FanOutputLine().addOutputs(filterTarget.outputs, fanLevelAnchor, spearsAnchor, filterTarget.id, xx + globalCommandDispatcher.cfg().pluginIconSize / 2, yy + globalCommandDispatcher.cfg().pluginIconSize / 2, zidx);
    }
    buildAutoSpot(fanLevelAnchor, spearsAnchor, zidx) {
        for (let ii = 0; ii < globalCommandDispatcher.cfg().data.filters.length; ii++) {
            if (globalCommandDispatcher.cfg().data.filters[ii].id == this.filterId) {
                let filterTarget = globalCommandDispatcher.cfg().data.filters[ii];
                this.addAutoSpot(filterTarget, fanLevelAnchor, spearsAnchor, zidx);
                break;
            }
        }
    }
    addAutoSpot(filterTarget, fanLevelAnchor, spearsAnchor, zidx) {
        let left = globalCommandDispatcher.cfg().leftPad + globalCommandDispatcher.cfg().timelineWidth() + globalCommandDispatcher.cfg().padGridFan;
        let top = globalCommandDispatcher.cfg().gridTop();
        let xx = left;
        let yy = top;
        if (filterTarget.iconPosition) {
            xx = left + filterTarget.iconPosition.x;
            yy = top + filterTarget.iconPosition.y;
        }
        let rec = {
            x: xx, y: yy, w: globalCommandDispatcher.cfg().pluginIconSize,
            rx: globalCommandDispatcher.cfg().pluginIconSize / 2, ry: globalCommandDispatcher.cfg().pluginIconSize / 2,
            h: globalCommandDispatcher.cfg().pluginIconSize, css: 'fanFilterIcon'
        };
        fanLevelAnchor.content.push(rec);
        if (zidx < 5) {
            let txt = {
                text: '' + filterTarget.kind + ':' + filterTarget.id,
                x: xx, y: yy + globalCommandDispatcher.cfg().pluginIconSize, css: 'fanIconLabel'
            };
            fanLevelAnchor.content.push(txt);
        }
        let controlLineWidth = xx - globalCommandDispatcher.cfg().leftPad - globalCommandDispatcher.cfg().timelineWidth();
        new ControlConnection().addAudioStreamLineFlow(yy + globalCommandDispatcher.cfg().pluginIconSize / 2, controlLineWidth, fanLevelAnchor);
        new FanOutputLine().addOutputs(filterTarget.outputs, fanLevelAnchor, spearsAnchor, filterTarget.id, xx + globalCommandDispatcher.cfg().pluginIconSize / 2, yy + globalCommandDispatcher.cfg().pluginIconSize / 2, zidx);
    }
}
class ControlConnection {
    addAudioStreamLineFlow(yy, ww, anchor) {
        let css = 'controlConnection';
        let sz4 = globalCommandDispatcher.cfg().pluginIconSize / 4;
        let left = globalCommandDispatcher.cfg().leftPad + globalCommandDispatcher.cfg().timelineWidth();
        let line = {
            x: left,
            y: yy - sz4,
            w: ww - sz4,
            h: sz4 * 2,
            css: css
        };
        anchor.content.push(line);
        let spearHead = {
            x: left + ww - sz4, y: yy - sz4, css: css, dots: [
                0, 0,
                sz4, sz4,
                0, sz4 * 2
            ]
        };
        anchor.content.push(spearHead);
    }
}
class SpearConnection {
    constructor() {
    }
    nonan(nn) {
        return (nn) ? nn : 0;
    }
    addSpear(fromX, fromY, toSize, toX, toY, anchor) {
        let headLen = 3;
        let css = 'fanConnection';
        let diffX = toX - fromX;
        let diffY = toY - fromY;
        let pathLen = Math.sqrt(diffX * diffX + diffY * diffY);
        let toRatio = pathLen / (toSize / 2);
        let xx2 = toX - diffX / toRatio;
        let yy2 = toY - diffY / toRatio;
        let mainLine = { x1: this.nonan(fromX), x2: this.nonan(xx2), y1: this.nonan(fromY), y2: this.nonan(yy2), css: css };
        anchor.content.push(mainLine);
        let angle = Math.atan2(yy2 - fromY, xx2 - fromX);
        let da = Math.PI * 19 / 20.0;
        let dx = headLen * Math.cos(angle - da);
        let dy = headLen * Math.sin(angle - da);
        let first = { x1: this.nonan(xx2), x2: this.nonan(xx2 + dx), y1: this.nonan(yy2), y2: this.nonan(yy2 + dy), css: css };
        anchor.content.push(first);
        let dx2 = headLen * Math.cos(angle + da);
        let dy2 = headLen * Math.sin(angle + da);
        let second = { x1: this.nonan(xx2), x2: this.nonan(xx2 + dx2), y1: this.nonan(yy2), y2: this.nonan(yy2 + dy2), css: css };
        anchor.content.push(second);
    }
}
class FanOutputLine {
    addOutputs(outputs, buttonsAnchor, fanLinesAnchor, fromID, fromX, fromY, zidx) {
        if (outputs) {
            if (outputs.length > 0) {
                for (let oo = 0; oo < outputs.length; oo++) {
                    let outId = outputs[oo];
                    for (let ii = 0; ii < globalCommandDispatcher.cfg().data.filters.length; ii++) {
                        if (globalCommandDispatcher.cfg().data.filters[ii].id == outId) {
                            let toFilter = globalCommandDispatcher.cfg().data.filters[ii];
                            let left = globalCommandDispatcher.cfg().leftPad + globalCommandDispatcher.cfg().timelineWidth() + globalCommandDispatcher.cfg().padGridFan;
                            let top = globalCommandDispatcher.cfg().gridTop();
                            let xx = left + globalCommandDispatcher.cfg().pluginIconSize / 2;
                            let yy = top + globalCommandDispatcher.cfg().pluginIconSize / 2;
                            if (toFilter.iconPosition) {
                                xx = left + toFilter.iconPosition.x + globalCommandDispatcher.cfg().pluginIconSize / 2;
                                yy = top + toFilter.iconPosition.y + globalCommandDispatcher.cfg().pluginIconSize / 2;
                            }
                            new SpearConnection().addSpear(fromX, fromY, globalCommandDispatcher.cfg().pluginIconSize, xx, yy, fanLinesAnchor);
                            this.addDeleteSpear(fromID, toFilter.id, fromX, fromY, globalCommandDispatcher.cfg().pluginIconSize, xx, yy, buttonsAnchor, zidx);
                            break;
                        }
                    }
                }
            }
            else {
                let speakerX = globalCommandDispatcher.cfg().wholeWidth() - globalCommandDispatcher.cfg().speakerIconPad - globalCommandDispatcher.cfg().rightPad + globalCommandDispatcher.cfg().pluginIconSize / 2;
                let speakerY = globalCommandDispatcher.cfg().gridTop() + globalCommandDispatcher.cfg().gridHeight() / 2 - globalCommandDispatcher.cfg().speakerIconSize / 2;
                new SpearConnection().addSpear(fromX, fromY, globalCommandDispatcher.cfg().speakerIconSize, speakerX + globalCommandDispatcher.cfg().speakerIconSize / 2, speakerY + globalCommandDispatcher.cfg().speakerIconSize / 2, fanLinesAnchor);
                this.addDeleteSpear(fromID, '', fromX, fromY, globalCommandDispatcher.cfg().speakerIconSize, speakerX + globalCommandDispatcher.cfg().speakerIconSize / 2, speakerY + globalCommandDispatcher.cfg().speakerIconSize / 2, buttonsAnchor, zidx);
            }
        }
    }
    addDeleteSpear(fromID, toID, fromX, fromY, toSize, toX, toY, anchor, zidx) {
        if (zidx < 5) {
            let diffX = toX - fromX;
            let diffY = toY - fromY;
            let pathLen = Math.sqrt(diffX * diffX + diffY * diffY);
            let spearLen = pathLen - globalCommandDispatcher.cfg().pluginIconSize / 2 - toSize / 2;
            let ratio = spearLen / pathLen;
            let dx = ratio * (toX - fromX) / 2;
            let dy = ratio * (toY - fromY) / 2;
            let deleteButton = {
                x: fromX + dx - globalCommandDispatcher.cfg().pluginIconSize / 4,
                y: fromY + dy - globalCommandDispatcher.cfg().pluginIconSize / 4,
                w: globalCommandDispatcher.cfg().pluginIconSize / 2,
                h: globalCommandDispatcher.cfg().pluginIconSize / 2,
                rx: globalCommandDispatcher.cfg().pluginIconSize / 4,
                ry: globalCommandDispatcher.cfg().pluginIconSize / 4,
                css: 'fanDropConnection',
                activation: (x, y) => {
                    console.log('delete link from', fromID, 'to', toID);
                }
            };
            anchor.content.push(deleteButton);
            let deleteIcon = {
                x: fromX + dx,
                y: fromY + dy + globalCommandDispatcher.cfg().pluginIconSize / 8,
                text: icon_close,
                css: 'fanDeleteIcon'
            };
            anchor.content.push(deleteIcon);
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
let icon_blackfolder = '&#xf228;';
let icon_whitefolder = '&#xf224;';
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
let icon_close = '&#xf136;';
let icon_refresh = '&#xf1b9;';
let icon_search = '&#xf1c3;';
let icon_splitfan = '&#xf302;';
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
    resetDebugView() {
        let ww = globalCommandDispatcher.cfg().wholeWidth();
        let hh = globalCommandDispatcher.cfg().wholeHeight();
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
                globalCommandDispatcher.initAudioFromUI();
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
    list: false,
    position: { x: -13037.9, y: -1317.9, z: 4.7 },
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
                        {
                            skip: { count: 0, part: 2 }, pitches: [60], slides: [
                                { duration: { count: 1, part: 8 }, delta: 5 },
                                { duration: { count: 1, part: 8 }, delta: -5 },
                                { duration: { count: 1, part: 4 }, delta: 0 }
                            ]
                        }
                    ]
                }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }
            ],
            performer: { id: 'firstPerfoemrID', data: '', kind: 'basePitched', outputs: ['track1Volme'], iconPosition: { x: 40, y: 20 } }
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
            sampler: { id: 'd1', data: '', kind: 'baseSampler', outputs: ['drum1Volme'], iconPosition: { x: 22, y: 75 } }
        },
        {
            title: "Snare2", measures: [],
            sampler: { id: 'd2', data: '', kind: 'baseSampler', outputs: ['drum2Volme'], iconPosition: { x: 22, y: 91 } }
        },
        {
            title: "Snare3", measures: [{ skips: [] }, { skips: [{ count: 1, part: 16 }] }],
            sampler: { id: 'd3', data: '', kind: 'baseSampler', outputs: ['drum3Volme'], iconPosition: { x: 22, y: 99 } }
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
        this.rightPad = 50;
        this.topPad = 2;
        this.parTitleGrid = 5;
        this.padGrid2Sampler = 5;
        this.padSampler2Automation = 5;
        this.padAutomation2Comments = 5;
        this.bottomPad = 11;
        this.notePathHeight = 1;
        this.widthDurationRatio = 27;
        this.octaveCount = 10;
        this.maxCommentRowCount = 0;
        this.maxAutomationsCount = 0;
        this.pluginIconSize = 3;
        this.speakerIconSize = 33;
        this.speakerIconPad = 11;
        this.padGridFan = 15;
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
        return this.topPad + this.heightOfTitle() + this.parTitleGrid;
    }
    gridHeight() {
        return this.notePathHeight * this.octaveCount * 12;
    }
    samplerHeight() {
        return this.data.percussions.length * this.notePathHeight;
    }
    samplerTop() {
        return this.gridTop() + this.gridHeight() + this.padGrid2Sampler;
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