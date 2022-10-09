"use strict";
console.log('SSSEngine v1.01.001');
var SSSEngine = (function () {
    function SSSEngine() {
        console.log('constructor SSSEngine');
    }
    SSSEngine.prototype.init = function () {
        console.log('init');
    };
    return SSSEngine;
}());
window['sssengine'] = new SSSEngine();
var TreeValue = (function () {
    function TreeValue(name, value, children) {
        this.name = name;
        this.value = value;
        this.content = children;
    }
    TreeValue.prototype.clone = function () {
        var r = new TreeValue('', '', []);
        r.name = this.name;
        r.value = this.value;
        r.content = [];
        for (var i = 0; i < this.content.length; i++) {
            r.content.push(this.content[i].clone());
        }
        return r;
    };
    TreeValue.prototype.first = function (name) {
        for (var i = 0; i < this.content.length; i++) {
            if (this.content[i].name == name) {
                return this.content[i];
            }
        }
        return new TreeValue('', '', []);
    };
    TreeValue.prototype.exists = function (name) {
        for (var i = 0; i < this.content.length; i++) {
            if (this.content[i].name == name) {
                return true;
            }
        }
        return false;
    };
    TreeValue.prototype.every = function (name) {
        var r = [];
        for (var i = 0; i < this.content.length; i++) {
            if (this.content[i].name == name) {
                r.push(this.content[i]);
            }
        }
        return r;
    };
    TreeValue.prototype.seek = function (name, subname, subvalue) {
        for (var i = 0; i < this.content.length; i++) {
            if (this.content[i].name == name) {
                var t = this.content[i].first(subname);
                if (t.value == subvalue) {
                    return this.content[i];
                }
            }
        }
        return new TreeValue('', '', []);
    };
    TreeValue.prototype.readDocChildren = function (node) {
        var children = [];
        if (node.children) {
            for (var i = 0; i < node.children.length; i++) {
                var c = node.children[i];
                var t = '';
                if (c.childNodes && c.childNodes[0] && c.childNodes[0].nodeName == '#text') {
                    t = ('' + c.childNodes[0].nodeValue).trim();
                }
                children.push(new TreeValue(c.localName, t, this.readDocChildren(c)));
            }
        }
        if (node.attributes) {
            for (var i = 0; i < node.attributes.length; i++) {
                var a = node.attributes[i];
                children.push(new TreeValue(a.localName, a.value, []));
            }
        }
        return children;
    };
    TreeValue.prototype.fill = function (document) {
        var tt = this.readDocChildren(document);
        if (tt.length > 0) {
            this.name = tt[0].name;
            this.value = tt[0].value;
            this.content = tt[0].content;
        }
    };
    return TreeValue;
}());
function MeterMath(u) {
    return new DurationUnitUtil(u);
}
var DurationUnitUtil = (function () {
    function DurationUnitUtil(u) {
        this._unit = u;
    }
    DurationUnitUtil.prototype.clone = function () {
        return { count: this._unit.count, division: this._unit.division };
    };
    DurationUnitUtil.prototype.plus = function (b) {
        if (this._unit.division == b.division) {
            return { count: this._unit.count + b.count, division: this._unit.division };
        }
        else {
            var r = { count: this._unit.count * b.division + b.count * this._unit.division, division: this._unit.division * b.division };
            return r;
        }
    };
    DurationUnitUtil.prototype.minus = function (b) {
        if (this._unit.division == b.division) {
            return { count: this._unit.count - b.count, division: this._unit.division };
        }
        else {
            var r = { count: this._unit.count * b.division - b.count * this._unit.division, division: this._unit.division * b.division };
            return r;
        }
    };
    DurationUnitUtil.prototype._meterCompare = function (b) {
        var a1 = this.plus({ count: 0, division: b.division });
        var b1 = MeterMath(b).plus({ count: 0, division: this._unit.division });
        if (a1.count == b1.count) {
            return 0;
        }
        else {
            if (a1.count > b1.count) {
                return 1;
            }
            else {
                return -1;
            }
        }
    };
    DurationUnitUtil.prototype.moreThen = function (b) {
        if (this._meterCompare(b) == 1) {
            return true;
        }
        else {
            return false;
        }
    };
    DurationUnitUtil.prototype.notMoreThen = function (b) {
        if (this._meterCompare(b) == 1) {
            return false;
        }
        else {
            return true;
        }
    };
    DurationUnitUtil.prototype.lessThen = function (b) {
        if (this._meterCompare(b) == -1) {
            return true;
        }
        else {
            return false;
        }
    };
    DurationUnitUtil.prototype.notLessThen = function (b) {
        if (this._meterCompare(b) == -1) {
            return false;
        }
        else {
            return true;
        }
    };
    DurationUnitUtil.prototype.equalsTo = function (b) {
        if (this._meterCompare(b) == 0) {
            return true;
        }
        else {
            return false;
        }
    };
    DurationUnitUtil.prototype.simplify = function () {
        var r = this.clone();
        while (r.division % 3 == 0) {
            r.division = r.division / 3;
            r.count = Math.round(r.count / 3);
        }
        while (r.division % 2 == 0 && r.count % 2 == 0) {
            r.division = r.division / 2;
            r.count = Math.round(r.count / 2);
        }
        if (r.division % r.count == 0) {
            r.division = r.division / r.count;
            r.count = 1;
        }
        return r;
    };
    return DurationUnitUtil;
}());
//# sourceMappingURL=se.js.map