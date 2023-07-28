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
console.log('startup v1.01');
function startApplication() {
    console.log('startApplication v1.6.01');
    let ui = new UIRenderer();
    ui.setupUI();
    ui.resetUI();
}
class UIRenderer {
    setupUI() {
        this.tileRenderer = createTileLevel();
        this.tileLevelSVG = document.getElementById("tileLevelSVG");
        let layers = [];
        let debugGroup = document.getElementById("debugLayer");
        let debugAnchor = { xx: 0, yy: 0, ww: this.constentWidth(), hh: this.constentHeight(), showZoom: 0.25, hideZoom: 1024, content: [] };
        this.createTestMixerTracks(debugAnchor, 1, 1, 2, 256);
        let debugLayer = {
            g: debugGroup, anchors: [debugAnchor], mode: LevelModes.normal
        };
        layers.push(debugLayer);
        this.mixer = new MixerUI();
        this.tileRenderer.initRun(this.tileLevelSVG, false, this.constentWidth(), this.constentHeight(), 0.25, 4, 1024 - 1, layers);
        this.tileRenderer.setAfterZoomCallback(() => { console.log(this.tileRenderer.getCurrentPointPosition()); });
    }
    createTestMixerTracks(anchor, minZoom, showZoom, hideZoom, maxZoom) {
        let debugRectangle = { x: 0, y: 0, w: this.constentWidth(), h: this.constentHeight(), rx: this.constentWidth() / 8, ry: this.constentHeight() / 8, css: 'debug' };
        anchor.content.push(debugRectangle);
        for (let tt = 0; tt < 16; tt++) {
            let trackRectangle = { x: 0, y: 12 * 10 * tt, w: this.constentWidth(), h: 12 * 10 - 5, rx: 22, ry: 22, css: 'debug' };
            anchor.content.push(trackRectangle);
            for (let mm = 0; mm < 200; mm++) {
                let measureRectangle = { x: mm * 32, y: 12 * 10 * tt, w: 32 - 1, h: 12 * 10 - 2, rx: 5, ry: 5, css: 'debug' };
                anchor.content.push(measureRectangle);
            }
            for (let oo = 0; oo < 12; oo++) {
                let oktaRectangle = { x: 0, y: 12 * 10 * tt + oo * 12, w: this.constentWidth(), h: 12 - 1, rx: 3, ry: 3, css: 'debug' };
                anchor.content.push(oktaRectangle);
            }
        }
    }
    resetUI() {
        this.mixer.resetMixeUI();
    }
    constentWidth() {
        return 32 * 200;
    }
    constentHeight() {
        return 12 * 10 * 16;
    }
}
class UIToolbar {
    setupToolbar() {
    }
    resetToolbar() {
    }
}
class MixerUI {
    setupMixerUI() {
    }
    resetMixeUI() {
    }
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