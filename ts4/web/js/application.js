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
        let debugAnchor = { xx: 0, yy: 0, ww: 1000, hh: 1000, showZoom: 1, hideZoom: 16 + 1, content: [] };
        this.testAddRectangles(debugAnchor, Math.pow(2, 4), 8, 8, 16 + 1);
        this.testAddRectangles(debugAnchor, Math.pow(2, 5), 4, 4, 8);
        this.testAddRectangles(debugAnchor, Math.pow(2, 6), 2, 2, 4);
        this.testAddRectangles(debugAnchor, Math.pow(2, 7), 1, 1, 2);
        let debugLayer = {
            g: debugGroup, anchors: [debugAnchor], mode: LevelModes.normal
        };
        layers.push(debugLayer);
        this.mixer = new MixerUI();
        this.tileRenderer.initRun(this.tileLevelSVG, true, this.constentWidth(), this.constentWidth(), 1, 4, 16, layers);
    }
    testAddRectangles(anchor, count, size, showZoom, hideZoom) {
        for (let x = 0; x < count; x++) {
            for (let y = 0; y < count; y++) {
                let aa = { xx: x * size, yy: y * size, ww: size, hh: size, showZoom: showZoom, hideZoom: hideZoom, content: [] };
                let rr = { x: x * size, y: y * size, w: size, h: size, rx: size * 0.5, ry: size * 0.5, css: 'debug' };
                aa.content.push(rr);
                anchor.content.push(aa);
            }
        }
    }
    resetUI() {
        this.mixer.resetMixeUI();
    }
    constentWidth() {
        return 1000;
    }
    constentHeight() {
        return 1000;
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