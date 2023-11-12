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
    ui.fillUI(testBigMixerData);
    setupZoomDialog();
    showDialog(icon_warningPlay, '', '', () => {
        initWebAudioFromUI();
    });
}
function initWebAudioFromUI() {
    console.log('initWebAudioFromUI');
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
function setupZoomDialog() {
    let dialogdiv = document.getElementById('warningDialog');
    if (dialogdiv) {
        dialogdiv.addEventListener("wheel", function touchHandler(e) {
            if (e.ctrlKey) {
                e.preventDefault();
            }
        }, { passive: false });
    }
}
function setZoom100() {
    try {
        var scale = 'scale(1)';
        document.body.style.zoom = 1.0;
        document.body.style.webkitTransform = scale;
        document.body.style.msTransform = scale;
        document.body.style.transform = scale;
        document.body.style.zoom = '100%';
    }
    catch (xx) {
        console.log(xx);
    }
}
function showDialog(icon, title, text, cancel) {
    let dialogdiv = document.getElementById('warningDialog');
    if (dialogdiv) {
        let icondiv = document.getElementById('warningIcon');
        if (icondiv) {
            icondiv.innerHTML = icon;
        }
        let titlediv = document.getElementById('warningTitle');
        if (titlediv) {
            titlediv.innerHTML = title;
        }
        let textdiv = document.getElementById('warningText');
        if (textdiv) {
            textdiv.innerHTML = text;
        }
        dialogdiv.style.display = 'flex';
        dialogdiv.onclick = () => {
            setZoom100();
            let dialogdiv = document.getElementById('warningDialog');
            if (dialogdiv) {
                dialogdiv.style.display = 'none';
            }
            if (cancel) {
                cancel();
            }
        };
    }
}
class CommandDispatcher {
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
    changeTapSIze(ratio) {
        console.log('changeTapSIze', ratio, this);
        this.renderer.tiler.setupTapSize(ratio);
        this.renderer.onReSizeView();
        this.renderer.tiler.resetModel();
    }
    promptImportFromMIDI() {
        console.log('promptImportFromMIDI');
        let filesinput = document.getElementById('file_midi_input');
        if (filesinput) {
            console.log('choose');
            let listener = function (ievent) {
                var file = ievent.target.files[0];
                var fileReader = new FileReader();
                fileReader.onload = function (progressEvent) {
                    if (progressEvent != null) {
                        var arrayBuffer = progressEvent.target.result;
                    }
                };
                fileReader.readAsArrayBuffer(file);
            };
            filesinput.addEventListener('change', listener, false);
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
    { prefix: '128', zoom: 128 },
    { prefix: '256', zoom: 256 }
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
        this.toolbar = new UIToolbar();
        this.menu = new RightMenuPanel();
        this.mixer = new MixerUI();
        let me = this;
        layers = layers.concat(this.debug.allLayers(), this.toolbar.createToolbar(), this.menu.createMenu(), this.mixer.buildMixerLayers());
        this.tiler.initRun(this.tileLevelSVG, false, 1, 1, 0.25, 4, 256 - 1, layers);
        console.log('tap size', this.tiler.tapPxSize());
        this.tiler.setAfterZoomCallback(() => {
            if (this.menu) {
                this.menu.lastZ = this.tiler.getCurrentPointPosition().z;
            }
        });
        this.tiler.setAfterResizeCallback(() => {
            this.onReSizeView();
        });
    }
    fillUI(data) {
        let mixm = new MixerDataMath(data);
        let vw = this.tileLevelSVG.clientWidth / this.tiler.tapPxSize();
        let vh = this.tileLevelSVG.clientHeight / this.tiler.tapPxSize();
        this.tiler.resetInnerSize(mixm.wholeWidth(), mixm.wholeHeight());
        this.mixer.fillMixeUI(data);
        this.debug.resetDebugView(data);
        this.toolbar.resizeToolbar(vw, vh);
        this.menu.fillMenuItems();
        this.menu.resizeMenu(vw, vh);
        this.tiler.resetModel();
    }
    onReSizeView() {
        let vw = this.tileLevelSVG.clientWidth / this.tiler.tapPxSize();
        let vh = this.tileLevelSVG.clientHeight / this.tiler.tapPxSize();
        this.toolbar.resizeToolbar(vw, vh);
        this.tiler.resetAnchor(this.toolbar.toolBarGroup, this.toolbar.toolBarAnchor, LevelModes.overlay);
        this.menu.resizeMenu(vw, vh);
        this.menu.resetAllAnchors();
    }
    deleteUI() {
    }
}
let labelLocaleDictionary = 'en';
let localNameLocal = 'localNameLocal';
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
function setLocaleID(loname) {
    labelLocaleDictionary = loname;
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
        this.toolBarRectangle = { x: 0, y: 0, w: 5, h: 5, css: 'toolBarPanel' };
        this.toolBarShadow = { x: 0, y: 0, w: 5, h: 5, css: 'fillShadow' };
        this.toolBarAnchor = {
            xx: 0, yy: 0, ww: 111, hh: 111, showZoom: zoomPrefixLevelsCSS[0].zoom, hideZoom: zoomPrefixLevelsCSS[10].zoom, content: [
                this.toolBarShadow,
                this.toolBarRectangle,
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
        this.toolBarShadow.x = -shn;
        this.toolBarShadow.y = viewHeight - 1 - shn;
        this.toolBarShadow.w = viewWIdth + shn + shn;
        this.toolBarShadow.h = 1 + shn + shn;
        this.toolBarRectangle.x = -1;
        this.toolBarRectangle.y = viewHeight - 1;
        this.toolBarRectangle.w = viewWIdth + 2;
        this.toolBarRectangle.h = 2;
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
            xx: 0, yy: 0, ww: 111, hh: 111, showZoom: zoomPrefixLevelsCSS[0].zoom, hideZoom: zoomPrefixLevelsCSS[10].zoom, content: [
                this.listingShadow,
                this.backgroundRectangle
            ], id: 'rightMenuBackgroundAnchor'
        };
        this.contentAnchor = {
            xx: 0, yy: 0, ww: 111, hh: 111, showZoom: zoomPrefixLevelsCSS[0].zoom, hideZoom: zoomPrefixLevelsCSS[10].zoom, content: [], id: 'rightMenuContentAnchor'
        };
        this.interAnchor = {
            xx: 0, yy: 111, ww: 111, hh: 0, showZoom: zoomPrefixLevelsCSS[0].zoom, hideZoom: zoomPrefixLevelsCSS[10].zoom, content: [
                this.dragHandler
            ], id: 'rightMenuInteractionAnchor'
        };
        this.buttonsAnchor = {
            xx: 0, yy: 111, ww: 111, hh: 0, showZoom: zoomPrefixLevelsCSS[0].zoom, hideZoom: zoomPrefixLevelsCSS[10].zoom, content: [
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
                            me.setThemeLocale('ru');
                        }));
                        break;
                    }
                    case commandLocaleEN: {
                        this.items.push(new RightMenuItem(it).initActionItem(pad, focused, it.text, () => {
                            me.setFocus(it, infos);
                            me.setThemeLocale('en');
                        }));
                        break;
                    }
                    case commandLocaleZH: {
                        this.items.push(new RightMenuItem(it).initActionItem(pad, focused, it.text, () => {
                            me.setFocus(it, infos);
                            me.setThemeLocale('zh');
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
    setThemeLocale(loc) {
        console.log("setThemeLocale " + loc);
        setLocaleID(loc);
        if (loc == 'zh') {
            startLoadCSSfile('theme/font2.css');
        }
        else {
            startLoadCSSfile('theme/font1.css');
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
        commandDispatcher.changeTapSIze(ratio);
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
        let anchor = { xx: 0, yy: itemTop, ww: 111, hh: 111, showZoom: zoomPrefixLevelsCSS[0].zoom, hideZoom: zoomPrefixLevelsCSS[10].zoom, content: [] };
        if (this.focused) {
            anchor.content.push({ x: itemWidth - 0.1, y: itemTop + 0.02, w: 0.1, h: this.calculateHeight() - 0.02, css: 'rightMenuFocusedDelimiter' });
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
class BarOctave {
    constructor(left, top, width, height, anchor, prefix, minZoom, maxZoom, data) {
        let mixm = new MixerDataMath(data);
        let oRectangle = { x: left, y: top, w: width, h: height, rx: 1, ry: 1, css: 'mixFieldBg' + prefix };
        let oAnchor = { xx: left, yy: top, ww: width, hh: height, showZoom: minZoom, hideZoom: maxZoom, content: [oRectangle] };
        anchor.content.push(oAnchor);
    }
}
class OctaveContent {
    constructor(aa, top, toAnchor, data) {
    }
    resetMainPitchedTrackUI(pitchedTrackData) {
    }
    resetOtherPitchedTrackUI(pitchedTrackData) {
    }
}
class MixerBar {
    constructor(prefix, left, top, ww, hh, minZoom, maxZoom, toAnchor, data) {
        this.prefix = '';
        this.prefix = prefix;
        this.barRectangle = { x: left, y: top, w: ww, h: hh, rx: 1, ry: 1, css: 'mixFieldBg' + this.prefix };
        this.barAnchor = { xx: left, yy: top, ww: ww, hh: hh, showZoom: minZoom, hideZoom: maxZoom, content: [this.barRectangle] };
        toAnchor.content.push(this.barAnchor);
        this.octaves = [];
        for (let oo = 0; oo < 10; oo++) {
            this.octaves.push(new BarOctave(left, oo * 12 * data.notePathHeight, ww, 12 * data.notePathHeight, this.barAnchor, prefix, minZoom, maxZoom, data));
        }
    }
}
class MixerUI {
    constructor() {
        this.svgs = [];
        this.zoomLayers = [];
        this.zoomAnchors = [];
        this.levels = [];
    }
    fillMixeUI(data) {
        let mixm = new MixerDataMath(data);
        let ww = mixm.wholeWidth();
        let hh = mixm.wholeHeight();
        for (let ii = 0; ii < this.zoomAnchors.length; ii++) {
            this.zoomAnchors[ii].ww = ww;
            this.zoomAnchors[ii].hh = hh;
            this.levels[ii].buildLevel(ww, hh);
            this.levels[ii].fillBars(data, hh);
        }
    }
    buildMixerLayers() {
        for (let ii = 0; ii < zoomPrefixLevelsCSS.length - 1; ii++) {
            this.svgs.push(document.getElementById("tracksLayerZoom" + zoomPrefixLevelsCSS[ii].prefix));
            this.zoomAnchors.push({ showZoom: zoomPrefixLevelsCSS[ii].zoom, hideZoom: zoomPrefixLevelsCSS[ii + 1].zoom, xx: 0, yy: 0, ww: 1, hh: 1, content: [] });
            this.zoomLayers.push({ g: this.svgs[ii], anchors: [this.zoomAnchors[ii]], mode: LevelModes.normal });
            this.levels.push(new MixerZoomLevel(zoomPrefixLevelsCSS[ii].prefix, zoomPrefixLevelsCSS[ii].zoom, zoomPrefixLevelsCSS[ii + 1].zoom, this.zoomAnchors[ii]));
        }
        return this.zoomLayers;
    }
}
class MixerZoomLevel {
    constructor(prefix, minZoom, maxZoom, anchor) {
        this.minZoom = minZoom;
        this.maxZoom = maxZoom;
        this.anchor = anchor;
        this.prefix = prefix;
        this.bg = { x: 0, y: 0, w: 5, h: 5, rx: 0.4, ry: 0.4, css: 'mixFieldBg' + this.prefix };
        this.anchor.content = [this.bg];
        this.bars = [];
    }
    buildLevel(ww, hh) {
        this.bg.w = ww;
        this.bg.h = hh;
    }
    fillBars(data, hh) {
        let left = 0;
        let width = 0;
        for (let ii = 0; ii < data.timeline.length; ii++) {
            let timebar = data.timeline[ii];
            width = new MusicMetreMath(timebar.metre).width(timebar.tempo, data.widthDurationRatio);
            this.bars.push(new MixerBar(this.prefix, left, 0, width, hh, this.minZoom, this.maxZoom, this.anchor, data));
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
            xx: 0, yy: 0, ww: 111, hh: 111, showZoom: zoomPrefixLevelsCSS[0].zoom, hideZoom: zoomPrefixLevelsCSS[10].zoom, content: [
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
        this.label.y = top + 1 - 0.31;
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
        this.debugAnchor = { xx: 0, yy: 0, ww: 1, hh: 1, showZoom: zoomPrefixLevelsCSS[0].zoom, hideZoom: zoomPrefixLevelsCSS[10].zoom, content: [] };
        this.debugLayer = {
            g: this.debugGroup, anchors: [
                this.debugAnchor
            ], mode: LevelModes.normal
        };
    }
    resetDebugView(data) {
        let mixm = new MixerDataMath(data);
        let ww = mixm.wholeWidth();
        let hh = mixm.wholeHeight();
        this.debugRectangle.w = ww;
        this.debugRectangle.h = hh;
        this.debugAnchor.ww = ww;
        this.debugAnchor.hh = hh;
    }
    deleteDebbugView() {
    }
}
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
    widthDurationRatio: 50,
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
    widthDurationRatio: 50,
    pitchedTracks: [
        { title: 'A track1' },
        { title: 'Second track' }
    ]
};
class MusicMetreMath {
    constructor(from) {
        this.count = from.count;
        this.part = from.part;
    }
    metre() {
        return {
            count: this.count,
            part: this.part
        };
    }
    simplyfy() {
        let cc = this.count;
        let pp = this.part;
        if (cc > 0 && pp > 0) {
            while (cc % 2 == 0 && pp % 2 == 0) {
                cc = cc / 2;
                pp = pp / 2;
            }
        }
        return new MusicMetreMath({ count: cc, part: pp });
    }
    strip(toPart) {
        let cc = this.count;
        let pp = this.part;
        let rr = pp / toPart;
        cc = Math.round(cc / rr);
        pp = toPart;
        return new MusicMetreMath({
            count: cc,
            part: pp
        });
    }
    equals(metre) {
        let countMe = this.count * metre.part;
        let countTo = metre.count * this.part;
        if (countMe == countTo) {
            return true;
        }
        else {
            return false;
        }
    }
    less(metre) {
        let countMe = this.count * metre.part;
        let countTo = metre.count * this.part;
        if (countMe < countTo) {
            return true;
        }
        else {
            return false;
        }
    }
    more(metre) {
        let countMe = this.count * metre.part;
        let countTo = metre.count * this.part;
        if (countMe > countTo) {
            return true;
        }
        else {
            return false;
        }
    }
    plus(metre) {
        let countMe = this.count * metre.part;
        let countTo = metre.count * this.part;
        let rr = {
            count: countMe + countTo,
            part: metre.part * this.part
        };
        return new MusicMetreMath(rr).simplyfy();
    }
    minus(metre) {
        let countMe = this.count * metre.part;
        let countTo = metre.count * this.part;
        let rr = { count: countMe - countTo, part: metre.part * this.part };
        return new MusicMetreMath(rr).simplyfy();
    }
    duration(tempo) {
        let wholeNoteSeconds = (4 * 60) / tempo;
        let meterSeconds = (wholeNoteSeconds * this.count) / this.part;
        return meterSeconds;
    }
    width(tempo, ratio) {
        return this.duration(tempo) * ratio;
    }
}
class MixerDataMath {
    constructor(data) {
        this.data = data;
    }
    wholeWidth() {
        let ww = 0;
        for (let ii = 0; ii < this.data.timeline.length; ii++) {
            ww = ww + new MusicMetreMath(this.data.timeline[ii].metre).width(this.data.timeline[ii].tempo, this.data.widthDurationRatio);
        }
        return ww;
    }
    wholeHeight() {
        return this.data.notePathHeight * 10 * 12;
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