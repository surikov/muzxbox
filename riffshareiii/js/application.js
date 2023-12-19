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
    ui.fillWholeUI(mzxbxProjectForTesting);
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
        var AudioContext = window.AudioContext;
        this.audioContext = new AudioContext();
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
    resetProject(data) {
        console.log('resetProject', data);
        this.renderer.fillWholeUI(data);
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
                    let comment = '' + file.size / 1000 + 'kb, ' + file.lastModifiedDate;
                    var fileReader = new FileReader();
                    fileReader.onload = function (progressEvent) {
                        if (progressEvent != null) {
                            var arrayBuffer = progressEvent.target.result;
                            var midiParser = newMIDIparser(arrayBuffer);
                            let result = midiParser.convertProject(title, comment);
                            me.resetProject(result);
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
let zoomPrefixLevelsCSS = [
    { prefix: '025', zoom: 0.25 },
    { prefix: '05', zoom: 0.5 },
    { prefix: '1', zoom: 1 },
    { prefix: '2', zoom: 2 },
    { prefix: '4', zoom: 4 },
    { prefix: '8', zoom: 8 },
    { prefix: '16', zoom: 16 },
    { prefix: '32', zoom: 32 },
    { prefix: '64', zoom: 64 },
    { prefix: '128', zoom: 128 }
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
        this.menu = new RightMenuPanel();
        this.mixer = new MixerUI();
        let me = this;
        layers = layers.concat(this.debug.allLayers(), this.toolbar.createToolbar(), this.menu.createMenu(), this.mixer.createMixerLayers(), this.warning.allLayers(), this.timeselectbar.createTimeScale());
        this.tiler.initRun(this.tileLevelSVG, false, 1, 1, zoomPrefixLevelsCSS[0].zoom, zoomPrefixLevelsCSS[Math.floor(zoomPrefixLevelsCSS.length / 2)].zoom, zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].zoom - 1, layers);
        this.tiler.setAfterZoomCallback(() => {
            if (this.menu) {
                this.menu.lastZ = this.tiler.getCurrentPointPosition().z;
            }
        });
        this.tiler.setAfterResizeCallback(() => {
            this.onReSizeView();
        });
    }
    fillWholeUI(data) {
        let mixm = new MixerDataMath(data);
        let vw = this.tileLevelSVG.clientWidth / this.tiler.tapPxSize();
        let vh = this.tileLevelSVG.clientHeight / this.tiler.tapPxSize();
        this.tiler.resetInnerSize(mixm.mixerWidth(), mixm.mixerHeight());
        this.mixer.reFillMixerUI(data);
        this.debug.resetDebugView(data);
        this.toolbar.resizeToolbar(vw, vh);
        this.menu.fillMenuItems();
        this.menu.resizeMenu(vw, vh);
        this.warning.resizeDialog(vw, vh);
        this.timeselectbar.fillTimeBar(data);
        this.timeselectbar.resizeTimeScale(vw, vh);
        this.tiler.resetModel();
    }
    onReSizeView() {
        let vw = this.tileLevelSVG.clientWidth / this.tiler.tapPxSize();
        let vh = this.tileLevelSVG.clientHeight / this.tiler.tapPxSize();
        this.toolbar.resizeToolbar(vw, vh);
        this.tiler.resetAnchor(this.toolbar.toolBarGroup, this.toolbar.toolBarAnchor, LevelModes.overlay);
        this.menu.resizeMenu(vw, vh);
        this.menu.resetAllAnchors();
        this.warning.resizeDialog(vw, vh);
    }
    deleteUI() {
    }
}
let labelLocaleDictionary = 'en';
let localNameLocal = 'localNameLocal';
let localeFontRatio = 1;
let localMenuItemSettings = 'localMenuItemSettings';
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
            showZoom: zoomPrefixLevelsCSS[0].zoom,
            hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].zoom,
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
    addMarks8plus() {
    }
    addMarks7(barnum, barLeft, curBar, measureAnchor) {
        if (barnum % 8 == 0) {
            this.createBarMark(barLeft, zoomPrefixLevelsCSS[7].zoom * 0.25, zoomPrefixLevelsCSS[7].zoom * 2, measureAnchor);
            this.createBarNumber(barLeft, zoomPrefixLevelsCSS[7].zoom * 2, barnum, 7, curBar, measureAnchor);
        }
    }
    addMarks6(barnum, barLeft, curBar, measureAnchor) {
        if (barnum % 4 == 0) {
            this.createBarMark(barLeft, zoomPrefixLevelsCSS[6].zoom * 0.25, zoomPrefixLevelsCSS[6].zoom * 2, measureAnchor);
            this.createBarNumber(barLeft, zoomPrefixLevelsCSS[6].zoom * 2, barnum, 6, curBar, measureAnchor);
        }
    }
    addMarks5(barnum, barLeft, curBar, measureAnchor) {
        if (barnum % 2 == 0) {
            this.createBarMark(barLeft, zoomPrefixLevelsCSS[5].zoom * 0.25, zoomPrefixLevelsCSS[5].zoom * 2, measureAnchor);
            this.createBarNumber(barLeft, zoomPrefixLevelsCSS[5].zoom * 2, barnum, 5, curBar, measureAnchor);
        }
    }
    addMarks4(duRatio, barnum, barLeft, curBar, measureAnchor) {
        this.createBarMark(barLeft, zoomPrefixLevelsCSS[4].zoom * 0.25, zoomPrefixLevelsCSS[4].zoom * 2, measureAnchor);
        this.createBarNumber(barLeft, zoomPrefixLevelsCSS[4].zoom * 2, barnum, 4, curBar, measureAnchor);
        this.createBarMark(barLeft + MZMM().set({ count: 1, part: 2 }).duration(curBar.tempo) * duRatio, zoomPrefixLevelsCSS[4].zoom * 0.1, zoomPrefixLevelsCSS[4].zoom * 2, measureAnchor);
    }
    addMarks3minus(duRatio, zoomidx, barnum, barLeft, curBar, measureAnchor) {
        this.createBarMark(barLeft, zoomPrefixLevelsCSS[zoomidx].zoom * 0.25, zoomPrefixLevelsCSS[zoomidx].zoom * 2, measureAnchor);
        this.createBarNumber(barLeft, zoomPrefixLevelsCSS[zoomidx].zoom * 2, barnum, zoomidx, curBar, measureAnchor);
        let st16 = MZMM().set({ count: 1, part: 16 });
        let cntr8 = st16;
        while (cntr8.less(curBar.metre)) {
            this.createBarMark(barLeft + cntr8.duration(curBar.tempo) * duRatio, zoomPrefixLevelsCSS[zoomidx].zoom * 0.1, zoomPrefixLevelsCSS[zoomidx].zoom * 1, measureAnchor);
            cntr8 = cntr8.plus(st16);
        }
        this.createBarMark(barLeft + MZMM().set({ count: 1, part: 2 }).duration(curBar.tempo) * duRatio, zoomPrefixLevelsCSS[zoomidx].zoom * 0.1, zoomPrefixLevelsCSS[zoomidx].zoom * 2, measureAnchor);
    }
    createBarMark(barLeft, width, height, measureAnchor) {
        let mark = { x: barLeft, y: 0, w: width, h: height, css: 'timeMeasureMark' };
        measureAnchor.content.push(mark);
    }
    createBarNumber(barLeft, top, barnum, zz, curBar, measureAnchor) {
        let nm = { x: barLeft, y: top, text: '' + (1 + barnum), css: 'timeBarNum' + zoomPrefixLevelsCSS[zz].prefix };
        measureAnchor.content.push(nm);
        let bpm = {
            x: barLeft,
            y: top * 2 / 3,
            text: '' + Math.round(curBar.tempo),
            css: 'timeBarInfo' + zoomPrefixLevelsCSS[zz].prefix
        };
        measureAnchor.content.push(bpm);
        let mtr = {
            x: barLeft,
            y: top,
            text: '' + curBar.metre.count + '/' + curBar.metre.part,
            css: 'timeBarInfo' + zoomPrefixLevelsCSS[zz].prefix
        };
        measureAnchor.content.push(mtr);
    }
    fillTimeBar(data) {
        console.log('fillTimeBar', data.timeline);
        let mixm = new MixerDataMath(data);
        this.selectBarAnchor.ww = mixm.mixerWidth();
        this.selectBarAnchor.hh = mixm.mixerHeight();
        this.zoomAnchors = [];
        for (let zz = 0; zz < zoomPrefixLevelsCSS.length - 1; zz++) {
            let selectLevelAnchor = {
                showZoom: zoomPrefixLevelsCSS[zz].zoom,
                hideZoom: zoomPrefixLevelsCSS[zz + 1].zoom,
                xx: 0, yy: 0, ww: mixm.mixerWidth(), hh: mixm.mixerHeight(), content: [],
                id: 'time' + (zz + Math.random())
            };
            this.zoomAnchors.push(selectLevelAnchor);
            let mm = MZMM();
            let barLeft = mixm.LeftPad;
            for (let kk = 0; kk < data.timeline.length; kk++) {
                let curBar = data.timeline[kk];
                let curMeasureMeter = mm.set(curBar.metre);
                let barWidth = curMeasureMeter.duration(curBar.tempo) * data.theme.widthDurationRatio;
                let measureAnchor = {
                    showZoom: zoomPrefixLevelsCSS[zz].zoom,
                    hideZoom: zoomPrefixLevelsCSS[zz + 1].zoom,
                    xx: barLeft, yy: 0, ww: barWidth, hh: 1234, content: [],
                    id: 'measure' + (kk + Math.random())
                };
                selectLevelAnchor.content.push(measureAnchor);
                if (zz >= 8) {
                    this.addMarks8plus();
                }
                if (zz == 7) {
                    this.addMarks7(kk, barLeft, curBar, measureAnchor);
                }
                if (zz == 6) {
                    this.addMarks6(kk, barLeft, curBar, measureAnchor);
                }
                if (zz == 5) {
                    this.addMarks5(kk, barLeft, curBar, measureAnchor);
                }
                if (zz == 4) {
                    this.addMarks4(data.theme.widthDurationRatio, kk, barLeft, curBar, measureAnchor);
                }
                if (zz <= 3) {
                    this.addMarks3minus(data.theme.widthDurationRatio, zz, kk, barLeft, curBar, measureAnchor);
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
        this.playPauseButton = new ToolBarButton([icon_play, icon_pause], 0, 0, (nn) => {
            console.log('playPauseButton', nn);
            commandDispatcher.resetAnchor(this.toolBarGroup, this.toolBarAnchor, LevelModes.overlay);
        });
        this.menuButton = new ToolBarButton([icon_openmenu], 0, 1, (nn) => {
            console.log('menuButton', nn);
            commandDispatcher.resetAnchor(this.toolBarGroup, this.toolBarAnchor, LevelModes.overlay);
            commandDispatcher.showRightMenu();
        });
        this.headButton = new ToolBarButton([icon_openleft, icon_closeleft], 0, -1, (nn) => {
            console.log('headButton', nn);
            commandDispatcher.resetAnchor(this.toolBarGroup, this.toolBarAnchor, LevelModes.overlay);
        });
        this.toolBarGroup = document.getElementById("toolBarPanelGroup");
        this.toolBarAnchor = {
            xx: 0, yy: 0, ww: 111, hh: 111,
            showZoom: zoomPrefixLevelsCSS[0].zoom,
            hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].zoom,
            content: [
                this.playPauseButton.iconLabelButton.anchor,
                this.menuButton.iconLabelButton.anchor,
                this.headButton.iconLabelButton.anchor
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
        let shn = 0.05;
        this.toolBarAnchor.xx = 0;
        this.toolBarAnchor.yy = 0;
        this.toolBarAnchor.ww = viewWIdth;
        this.toolBarAnchor.hh = viewHeight;
        this.playPauseButton.resize(viewWIdth, viewHeight);
        this.menuButton.resize(viewWIdth, viewHeight);
        this.headButton.resize(viewWIdth, viewHeight);
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
        this.showState = false;
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
            console.log('menuCloseButton', nn);
            this.showState = false;
            this.resizeMenu(this.lastWidth, this.lastHeight);
            this.resetAllAnchors();
        });
        this.menuUpButton = new IconLabelButton([icon_moveup], 'menuButtonCircle', 'menuButtonLabel', (nn) => {
            console.log('up', nn);
            this.scrollY = 0;
            this.contentAnchor.translation = { x: this.shiftX, y: this.scrollY };
        });
        this.backgroundAnchor = {
            xx: 0, yy: 0, ww: 111, hh: 111,
            showZoom: zoomPrefixLevelsCSS[0].zoom,
            hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].zoom,
            content: [
                this.listingShadow,
                this.backgroundRectangle
            ], id: 'rightMenuBackgroundAnchor'
        };
        this.contentAnchor = {
            xx: 0, yy: 0, ww: 111, hh: 111,
            showZoom: zoomPrefixLevelsCSS[0].zoom,
            hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].zoom,
            content: [], id: 'rightMenuContentAnchor'
        };
        this.interAnchor = {
            xx: 0, yy: 111, ww: 111, hh: 0,
            showZoom: zoomPrefixLevelsCSS[0].zoom,
            hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].zoom,
            content: [
                this.dragHandler
            ], id: 'rightMenuInteractionAnchor'
        };
        this.buttonsAnchor = {
            xx: 0, yy: 111, ww: 111, hh: 0,
            showZoom: zoomPrefixLevelsCSS[0].zoom,
            hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].zoom,
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
    randomString(nn) {
        let words = ['red', 'green', 'blue', 'purple', 'black', 'white', 'yellow', 'grey', 'orange', 'cyan', 'magenta', 'silver', 'olive'];
        let ss = words[Math.floor(Math.random() * (words.length - 1))];
        ss = ss[0].toUpperCase() + ss.substring(1);
        for (let ii = 1; ii < nn; ii++) {
            ss = ss + ' ' + words[Math.floor(Math.random() * (words.length - 1))];
        }
        return ss;
    }
    fillMenuItems() {
        this.items = [];
        this.fillMenuItemChildren(0, testMenuData);
    }
    setFocus(it, infos) {
        for (let ii = 0; ii < infos.length; ii++) {
            infos[ii].focused = false;
        }
        it.focused = true;
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
            if (children) {
                if (opened) {
                    this.items.push(new RightMenuItem(it).initOpenedFolderItem(pad, focused, it.text, () => {
                        console.log("close " + ii);
                        me.setOpenState(false, it, infos);
                        me.rerenderContent(null);
                    }));
                    this.fillMenuItemChildren(pad + 0.5, children);
                }
                else {
                    let si = new RightMenuItem(it);
                    let order = this.items.length;
                    this.items.push(si.initClosedFolderItem(pad, focused, it.text, () => {
                        console.log("open " + ii);
                        me.setOpenState(true, it, infos);
                        me.rerenderContent(si);
                    }));
                }
            }
            else {
                switch (it.sid) {
                    case commandThemeSizeSmall: {
                        this.items.push(new RightMenuItem(it).initActionItem(pad, focused, it.text, () => {
                            me.setFocus(it, infos);
                            me.setThemeSize(1, 'theme/sizesmall.css');
                        }));
                        break;
                    }
                    case commandThemeSizeBig: {
                        this.items.push(new RightMenuItem(it).initActionItem(pad, focused, it.text, () => {
                            me.setFocus(it, infos);
                            me.setThemeSize(1.5, 'theme/sizebig.css');
                        }));
                        break;
                    }
                    case commandThemeSizeHuge: {
                        this.items.push(new RightMenuItem(it).initActionItem(pad, focused, it.text, () => {
                            me.setFocus(it, infos);
                            me.setThemeSize(4, 'theme/sizehuge.css');
                        }));
                        break;
                    }
                    case commandThemeColorRed: {
                        this.items.push(new RightMenuItem(it).initActionItem(pad, focused, it.text, () => {
                            me.setFocus(it, infos);
                            me.setThemeColor('theme/colordarkred.css');
                        }));
                        break;
                    }
                    case commandThemeColorGreen: {
                        this.items.push(new RightMenuItem(it).initActionItem(pad, focused, it.text, () => {
                            me.setFocus(it, infos);
                            me.setThemeColor('theme/colordarkgreen.css');
                        }));
                        break;
                    }
                    case commandThemeColorBlue: {
                        this.items.push(new RightMenuItem(it).initActionItem(pad, focused, it.text, () => {
                            me.setFocus(it, infos);
                            me.setThemeColor('theme/colordarkblue.css');
                        }));
                        break;
                    }
                    case commandLocaleRU: {
                        this.items.push(new RightMenuItem(it).initActionItem(pad, focused, it.text, () => {
                            me.setFocus(it, infos);
                            me.setThemeLocale('ru', 1);
                        }));
                        break;
                    }
                    case commandLocaleEN: {
                        this.items.push(new RightMenuItem(it).initActionItem(pad, focused, it.text, () => {
                            me.setFocus(it, infos);
                            me.setThemeLocale('en', 1);
                        }));
                        break;
                    }
                    case commandLocaleZH: {
                        this.items.push(new RightMenuItem(it).initActionItem(pad, focused, it.text, () => {
                            me.setFocus(it, infos);
                            me.setThemeLocale('zh', 1.5);
                        }));
                        break;
                    }
                    case commandImportFromMIDI: {
                        this.items.push(new RightMenuItem(it).initActionItem(pad, focused, it.text, () => {
                            me.setFocus(it, infos);
                            console.log('import');
                            commandDispatcher.promptImportFromMIDI();
                        }));
                        break;
                    }
                    default: {
                        this.items.push(new RightMenuItem(it).initActionItem(pad, focused, it.text, () => {
                            console.log("tap " + ii);
                            me.setFocus(it, infos);
                        }));
                        break;
                    }
                }
            }
        }
    }
    setThemeLocale(loc, ratio) {
        console.log("setThemeLocale " + loc);
        setLocaleID(loc, ratio);
        if (loc == 'zh') {
            startLoadCSSfile('theme/font2big.css');
        }
        else {
            startLoadCSSfile('theme/font1small.css');
        }
        this.resizeMenu(this.lastWidth, this.lastHeight);
        this.resetAllAnchors();
    }
    setThemeColor(cssPath) {
        console.log("cssPath " + cssPath);
        startLoadCSSfile(cssPath);
        this.resizeMenu(this.lastWidth, this.lastHeight);
        this.resetAllAnchors();
    }
    setThemeSize(ratio, cssPath) {
        console.log("cssPath " + cssPath);
        startLoadCSSfile(cssPath);
        commandDispatcher.changeTapSize(ratio);
    }
    rerenderContent(folder) {
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
        this.rerenderContent(null);
    }
}
class RightMenuItem {
    constructor(info) {
        this.label = '';
        this.kindAction = 1;
        this.kindDraggable = 2;
        this.kindPreview = 3;
        this.kindClosedFolder = 4;
        this.kindOpenedFolder = 5;
        this.kind = this.kindAction;
        this.pad = 0;
        this.focused = false;
        this.info = info;
        if (this.info.sid) {
        }
        else {
            this.info.sid = 'random' + Math.random();
        }
    }
    initActionItem(pad, focused, label, tap) {
        this.pad = pad;
        this.focused = focused;
        this.kind = this.kindAction;
        this.label = label;
        this.action = tap;
        return this;
    }
    initDraggableItem(pad, focused, tap) {
        this.kind = this.kindDraggable;
        this.focused = focused;
        this.pad = pad;
        this.action = tap;
        return this;
    }
    initOpenedFolderItem(pad, focused, label, tap) {
        this.pad = pad;
        this.label = label;
        this.focused = focused;
        this.kind = this.kindOpenedFolder;
        this.action = tap;
        return this;
    }
    initClosedFolderItem(pad, focused, label, tap) {
        this.pad = pad;
        this.label = label;
        this.focused = focused;
        this.kind = this.kindClosedFolder;
        this.action = tap;
        return this;
    }
    initPreviewItem(pad, focused, tap) {
        this.focused = focused;
        this.pad = pad;
        this.kind = this.kindPreview;
        this.action = tap;
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
        this.top = itemTop;
        let anchor = { xx: 0, yy: itemTop, ww: 111, hh: 111,
            showZoom: zoomPrefixLevelsCSS[0].zoom,
            hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].zoom,
            content: [] };
        if (this.focused) {
            anchor.content.push({ x: itemWidth - 0.2, y: itemTop + 0.02, w: 0.2, h: this.calculateHeight() - 0.02, css: 'rightMenuFocusedDelimiter' });
        }
        anchor.content.push({ x: 0, y: itemTop + this.calculateHeight(), w: itemWidth, h: 0.02, css: 'rightMenuDelimiterLine' });
        let spot = { x: this.pad, y: itemTop, w: 1, h: 1, activation: this.action, css: 'transparentSpot' };
        if (this.kind == this.kindAction) {
            anchor.content.push({ x: 0.1 + this.pad, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'rightMenuItemActionBG' });
            anchor.content.push({ x: 0.3 + this.pad, y: itemTop + 0.7, text: LO(this.label), css: 'rightMenuLabel' });
        }
        if (this.kind == this.kindDraggable) {
            spot.draggable = true;
            anchor.content.push({ x: 0.1 + this.pad, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'rightMenuItemDragBG' });
            anchor.content.push({ x: 0.3 + this.pad, y: itemTop + 0.7, text: LO(this.label), css: 'rightMenuLabel' });
        }
        if (this.kind == this.kindOpenedFolder) {
            anchor.content.push({ x: 0.1 + this.pad, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'rightMenuItemActionBG' });
            anchor.content.push({ x: 0.5 + this.pad, y: itemTop + 0.7, text: icon_movedown, css: 'rightMenuIconLabel' });
            anchor.content.push({ x: 1 + this.pad, y: itemTop + 0.7, text: LO(this.label), css: 'rightMenuLabel' });
        }
        if (this.kind == this.kindClosedFolder) {
            anchor.content.push({ x: 0.1 + this.pad, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'rightMenuItemActionBG' });
            anchor.content.push({ x: 0.5 + this.pad, y: itemTop + 0.7, text: icon_moveright, css: 'rightMenuIconLabel' });
            anchor.content.push({ x: 1 + this.pad, y: itemTop + 0.7, text: LO(this.label), css: 'rightMenuLabel' });
        }
        if (this.kind == this.kindPreview) {
            spot.draggable = true;
            anchor.content.push({ x: 0.1 + this.pad, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'rightMenuItemDragBG' });
            anchor.content.push({ x: 0.3 + this.pad, y: itemTop + 0.7, text: LO(this.label), css: 'rightMenuLabel' });
            anchor.content.push({ x: itemWidth - 1 + 0.1, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'rightMenuItemSubActionBG' });
            anchor.content.push({ x: itemWidth - 0.5, y: itemTop + 0.7, text: icon_play, css: 'rightMenuButtonLabel' });
            anchor.content.push({ x: itemWidth - 1, y: itemTop, w: 1, h: 1, activation: this.action, css: 'transparentSpot' });
            anchor.content.push({ x: 0.3 + 1 + this.pad, y: itemTop + 0.7 + 0.55, text: this.label, css: 'rightMenuSubLabel' });
            anchor.content.push({ x: 0.3 + 1 + this.pad, y: itemTop + 0.7 + 0.55 + 0.55, text: this.label, css: 'rightMenuSubLabel' });
        }
        anchor.content.push(spot);
        return anchor;
    }
}
let commandThemeSizeSmall = 'commandThemeSizeSmall';
let commandThemeSizeBig = 'commandThemeSizeBig';
let commandThemeSizeHuge = 'commandThemeSizeHuge';
let commandThemeColorRed = 'commandThemeColorRed';
let commandThemeColorGreen = 'commandThemeColorGreen';
let commandThemeColorBlue = 'commandThemeColorBlue';
let commandLocaleEN = 'commandLocaleEN';
let commandLocaleRU = 'commandLocaleRU';
let commandLocaleZH = 'commandLocaleZH';
let commandImportFromMIDI = 'commandImportFromMIDI';
let testMenuData = [
    { text: 'test import', sid: commandImportFromMIDI },
    { text: 'One' },
    {
        text: 'Two', children: [{ text: 'One' },
            { text: 'Two' },
            { text: 'Orange', focused: true },
            { text: 'Blue' },
            { text: 'Green' },
            {
                text: 'Brown', children: [{ text: 'One' },
                    { text: 'Two' },
                    { text: 'Orange' },
                    {
                        text: 'Blue', children: [{ text: 'One' },
                            { text: 'Two' },
                            { text: 'Orange' },
                            { text: 'Blue' },
                            { text: 'Green' },
                            {
                                text: 'Brown', children: [{ text: 'One' },
                                    { text: 'Two' },
                                    {
                                        text: 'Orange', children: [{ text: 'One' },
                                            { text: 'Two' },
                                            { text: 'Orange' },
                                            { text: 'Blue' },
                                            { text: 'Green' },
                                            {
                                                text: 'Brown', children: [{ text: 'One' },
                                                    { text: 'Two' },
                                                    { text: 'Orange' },
                                                    { text: 'Blue' },
                                                    { text: 'Green' },
                                                    { text: 'Brown' },
                                                    { text: 'eleven' }]
                                            },
                                            {
                                                text: 'eleven', children: [{ text: 'One' },
                                                    { text: 'Two' },
                                                    { text: 'Orange' },
                                                    { text: 'Blue' },
                                                    { text: 'Green' },
                                                    { text: 'Brown' },
                                                    { text: 'eleven' }]
                                            }]
                                    },
                                    { text: 'Blue' },
                                    { text: 'Green' },
                                    { text: 'Brown' },
                                    { text: 'eleven' }]
                            },
                            {
                                text: 'eleven', children: [{ text: 'One' },
                                    { text: 'Two' },
                                    { text: 'Orange' },
                                    { text: 'Blue' },
                                    { text: 'Green' },
                                    { text: 'Brown' },
                                    { text: 'eleven' }]
                            }]
                    },
                    { text: 'Green' },
                    { text: 'Brown' },
                    { text: 'eleven' }]
            },
            {
                text: 'eleven', children: [{ text: 'One' },
                    { text: 'Two' },
                    { text: 'Orange' },
                    { text: 'Blue' },
                    { text: 'Green' },
                    { text: 'Brown' },
                    { text: 'eleven' }]
            }]
    },
    { text: 'Orange' },
    { text: 'Blue' },
    {
        text: 'Green', focused: true, children: [{ text: 'One' },
            { text: 'Two' },
            { text: 'Orange' },
            { text: 'Blue' },
            { text: 'Green' },
            { text: 'Brown' },
            { text: 'eleven' }]
    },
    {
        text: 'Brown', children: [{ text: 'One' },
            { text: 'Two' },
            {
                text: 'Orange', children: [{ text: 'One' },
                    { text: 'Two' },
                    { text: 'Orange' },
                    { text: 'Blue' },
                    { text: 'Green' },
                    {
                        text: 'Brown', children: [{ text: 'One' },
                            { text: 'Two' },
                            { text: 'Orange' },
                            { text: 'Blue' },
                            { text: 'Green' },
                            { text: 'Brown' },
                            { text: 'eleven' }]
                    },
                    {
                        text: 'eleven', children: [{ text: 'One' },
                            { text: 'Two' },
                            { text: 'Orange' },
                            { text: 'Blue' },
                            { text: 'Green' },
                            { text: 'Brown' },
                            { text: 'eleven' }]
                    }]
            },
            {
                text: 'Blue', children: [{ text: 'One' },
                    { text: 'Two' },
                    { text: 'Orange' },
                    { text: 'Blue' },
                    { text: 'Green' },
                    {
                        text: 'Brown', children: [{ text: 'One' },
                            { text: 'Two' },
                            { text: 'Orange' },
                            { text: 'Blue' },
                            { text: 'Green' },
                            { text: 'Brown' },
                            { text: 'eleven' }]
                    },
                    {
                        text: 'eleven', children: [{ text: 'One' },
                            { text: 'Two' },
                            { text: 'Orange' },
                            { text: 'Blue' },
                            { text: 'Green' },
                            { text: 'Brown' },
                            { text: 'eleven' }]
                    }]
            },
            { text: 'Green' },
            { text: 'Brown' },
            { text: 'eleven' }]
    },
    { text: 'eleven' },
    {
        text: localMenuItemSettings, children: [
            {
                text: 'Size', children: [
                    { text: 'Small', sid: commandThemeSizeSmall },
                    { text: 'Big', sid: commandThemeSizeBig },
                    { text: 'Huge', sid: commandThemeSizeHuge }
                ]
            },
            {
                text: 'Locale', children: [{ text: 'Russian', sid: commandLocaleRU },
                    { text: 'English', sid: commandLocaleEN },
                    { text: '中文界面语言', sid: commandLocaleZH }]
            },
            {
                text: 'Colors', children: [
                    { text: 'Red', sid: commandThemeColorRed },
                    { text: 'Green', sid: commandThemeColorGreen },
                    { text: 'Blue', sid: commandThemeColorBlue }
                ]
            }
        ]
    }
];
class LeftBar {
}
class BarOctave {
    constructor(barIdx, octaveIdx, left, top, width, height, anchor, zoomLevel, data) {
        this.barRightBorder = {
            x: left + width,
            y: top,
            w: zoomPrefixLevelsCSS[zoomLevel].zoom / 8.0,
            h: height - 1.5,
            css: 'mixPanelFill'
        };
        this.octaveBottomBorder = {
            x: left,
            y: top + height,
            w: width - 1.5,
            h: zoomPrefixLevelsCSS[zoomLevel].zoom / 8.0,
            css: 'mixToolbarFill'
        };
        anchor.content.push(this.barRightBorder);
        anchor.content.push(this.octaveBottomBorder);
        if (zoomLevel <= 16) {
            this.addNotes(barIdx, octaveIdx, left, top, width, height, anchor, zoomLevel, data);
        }
    }
    addNotes(barIdx, octaveIdx, left, top, width, height, anchor, zoomLevel, data) {
        for (let ii = 0; ii < data.tracks.length; ii++) {
            let track = data.tracks[ii];
            if (ii == 0) {
                let measure = track.measures[barIdx];
                for (let cc = 0; cc < measure.chords.length; cc++) {
                    let chord = measure.chords[cc];
                    for (let nn = 0; nn < chord.notes.length; nn++) {
                        let note = chord.notes[nn];
                        let from = octaveIdx * 12;
                        let to = (octaveIdx + 1) * 12;
                        if (note.pitch >= from && note.pitch < to) {
                            let x = left + MZMM().set(chord.skip).duration(data.timeline[barIdx].tempo) * data.theme.widthDurationRatio;
                            let y = top + height - (note.pitch - from) * data.theme.notePathHeight;
                            let dot = { x: x, y: y, w: data.theme.notePathHeight, h: data.theme.notePathHeight, css: 'mixTextFill' };
                            anchor.content.push(dot);
                        }
                    }
                }
            }
        }
    }
}
class OctaveContent {
    constructor(aa, top, toAnchor, data) {
    }
}
class MixerBar {
    constructor(barIdx, left, ww, zoomLevel, toAnchor, data) {
        this.zoomLevel = zoomLevel;
        let mixm = new MixerDataMath(data);
        this.anchor = toAnchor;
        this.octaves = [];
        let h12 = 12 * data.theme.notePathHeight;
        for (let oo = 0; oo < data.theme.octaveCount; oo++) {
            let barOctaveAnchor = {
                showZoom: zoomPrefixLevelsCSS[this.zoomLevel].zoom,
                hideZoom: zoomPrefixLevelsCSS[this.zoomLevel + 1].zoom,
                xx: left,
                yy: mixm.gridTop() + oo * h12,
                ww: ww,
                hh: h12, content: [],
                id: 'octave' + (oo + Math.random())
            };
            this.anchor.content.push(barOctaveAnchor);
            let bo = new BarOctave(barIdx, (data.theme.octaveCount - oo - 1), left, mixm.gridTop() + oo * h12, ww, h12, barOctaveAnchor, this.zoomLevel, data);
            this.octaves.push(bo);
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
            this.zoomLayer.anchors[ii].ww = ww;
            this.zoomLayer.anchors[ii].hh = hh;
            this.levels[ii].reCreateBars(data);
        }
    }
    createMixerLayers() {
        let svg = document.getElementById('tracksLayerZoom');
        this.zoomLayer = { g: svg, anchors: [], mode: LevelModes.normal };
        for (let ii = 0; ii < zoomPrefixLevelsCSS.length - 1; ii++) {
            let mixerLevelAnchor = {
                showZoom: zoomPrefixLevelsCSS[ii].zoom,
                hideZoom: zoomPrefixLevelsCSS[ii + 1].zoom,
                xx: 0, yy: 0, ww: 1, hh: 1, content: [],
                id: 'mix' + (ii + Math.random())
            };
            this.zoomLayer.anchors.push(mixerLevelAnchor);
            this.levels.push(new MixerZoomLevel(ii, mixerLevelAnchor));
        }
        return [this.zoomLayer];
    }
}
class MixerZoomLevel {
    constructor(zoomLevel, anchor) {
        this.zoomLevelIndex = zoomLevel;
        this.zoomAnchor = anchor;
        this.zoomAnchor.content = [];
        this.projectTitle = { x: 0, y: 1, text: 'Text label for testing of middle size project title', css: 'projectTitle' };
        this.trackTitle = { x: 0, y: 1, text: 'Text label for testing of middle size project title', css: 'trackTitle' };
    }
    reCreateBars(data) {
        let mixm = new MixerDataMath(data);
        this.zoomAnchor.content = [this.projectTitle, this.trackTitle];
        this.trackTitle.y = mixm.gridTop();
        this.trackTitle.text = data.tracks[0].title;
        this.projectTitle.y = mixm.gridTop() * 0.9;
        this.projectTitle.text = data.title;
        this.bars = [];
        let left = mixm.LeftPad;
        let width = 0;
        let h12 = 12 * data.theme.notePathHeight * data.theme.octaveCount;
        for (let ii = 0; ii < data.timeline.length; ii++) {
            let timebar = data.timeline[ii];
            width = MZMM().set(timebar.metre).duration(timebar.tempo) * data.theme.widthDurationRatio;
            let barAnchor = {
                showZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex].zoom,
                hideZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex + 1].zoom,
                xx: left,
                yy: mixm.gridTop(),
                ww: width,
                hh: h12,
                content: [],
                id: 'measure' + (ii + Math.random())
            };
            this.zoomAnchor.content.push(barAnchor);
            let mixBar = new MixerBar(ii, left, width, this.zoomLevelIndex, barAnchor, data);
            this.bars.push(mixBar);
            left = left + width;
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
            showZoom: zoomPrefixLevelsCSS[0].zoom,
            hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].zoom,
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
let icon_openmenu = '&#xf19c;';
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
class DebugLayerUI {
    allLayers() {
        return [this.debugLayer];
    }
    setupUI() {
        this.debugRectangle = { x: 0, y: 0, w: 1, h: 1, rx: 10, ry: 10, css: 'debug' };
        this.debugGroup = document.getElementById("debugLayer");
        this.debugAnchor = {
            xx: 0, yy: 0, ww: 1, hh: 1,
            showZoom: zoomPrefixLevelsCSS[0].zoom,
            hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].zoom,
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
            showZoom: zoomPrefixLevelsCSS[0].zoom,
            hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].zoom + 1,
            content: [this.warningRectangle, this.warningIcon, this.warningTitle, this.warningDescription]
        };
        this.warningLayer = { g: this.warningGroup, anchors: [this.warningAnchor], mode: LevelModes.overlay };
    }
    resetDialogView(data) {
        console.log('resetDialogView');
    }
    resizeDialog(ww, hh) {
        console.log('resizeDialog');
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
    }
    allLayers() {
        return [this.warningLayer];
    }
    showWarning() {
        console.log('WarningUI show');
        document.getElementById("warningDialogGroup").style.visibility = "visible";
    }
    hideWarning() {
        console.log('WarningUI hide');
        document.getElementById("warningDialogGroup").style.visibility = "hidden";
    }
}
let mzxbxProjectForTesting = {
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
        }
    ],
    percussions: [
        { title: "Snare", measures: [], filters: [], sampler: { id: '', data: '' } }
    ],
    comments: [{ texts: [] }, { texts: [] }, { texts: [] }, { texts: [] }],
    filters: [],
    theme: {
        notePathHeight: 0.5,
        widthDurationRatio: 17,
        octaveCount: 10
    }
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
        this.bottomPad = 11;
        this.data = data;
    }
    mixerWidth() {
        let mm = MZMM();
        let ww = 0;
        for (let ii = 0; ii < this.data.timeline.length; ii++) {
            ww = ww + mm.set(this.data.timeline[ii].metre).duration(this.data.timeline[ii].tempo) * this.data.theme.widthDurationRatio;
        }
        return this.LeftPad + ww + this.rightPad;
    }
    mixerHeight() {
        return this.titleHeight + this.gridHeight() + this.bottomPad;
    }
    gridTop() {
        return this.titleHeight;
    }
    gridHeight() {
        return this.data.theme.notePathHeight * 10 * 12;
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