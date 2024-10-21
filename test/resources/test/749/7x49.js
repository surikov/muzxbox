//tsc C:\Users\surikov\Desktop\7x49.html.ts C:\Users\surikov\Desktop\7x49.ts --target esnext --outfile C:\Users\surikov\Desktop\7x49run.js
//node C:\Users\surikov\Desktop\7x49run.js
var TreeValue = /** @class */ (function () {
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
        var tv = new TreeValue(name, '', []);
        this.content.push(tv);
        return tv;
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
        //console.log('readDocChildren',node);
        var children = [];
        if (node.childNodes) {
            for (var i = 0; i < node.childNodes.length; i++) {
                var c = node.childNodes[i];
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
    TreeValue.prototype.fillFromDocument = function (document) {
        var tt = this.readDocChildren(document);
        if (tt.length > 0) {
            this.name = tt[0].name;
            this.value = tt[0].value;
            this.content = tt[0].content;
        }
    };
    TreeValue.prototype.fillFromXMLstring = function (xml) {
        var windowDOMParser = new window.DOMParser();
        var dom = windowDOMParser.parseFromString(xml, "text/xml");
        //console.log('fillFromXMLstring',dom);
        //console.dir(dom);
        //this.readDocChildren(dom.childNodes);
        this.content = this.readDocChildren(dom);
    };
    ;
    TreeValue.prototype.readObjectChildren = function (oo) {
        //console.log('oo', oo);
        if (oo) {
            var keys = Object.keys(oo);
            for (var ii = 0; ii < keys.length; ii++) {
                var key = keys[ii];
                var value = oo[keys[ii]];
                if (Array.isArray(value)) {
                    //console.log('array', ii, key, value);
                    for (var nn = 0; nn < value.length; nn++) {
                        var subValue = value[nn];
                        var tv = new TreeValue(key, '', []);
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
                        //console.log('object', ii, key, value);
                        var tv = new TreeValue(key, '', []);
                        tv.readObjectChildren(value);
                        this.content.push(tv);
                    }
                    else {
                        //console.log('raw', ii, key, value);
                        this.content.push(new TreeValue(key, '' + value, []));
                        //let tv=new TreeValue(key,''+value,[]);
                    }
                }
            }
        }
    };
    TreeValue.prototype.fillFromJSONstring = function (json) {
        var oo = JSON.parse(json);
        //console.log(oo);
        this.readObjectChildren(oo);
    };
    TreeValue.prototype.dump = function (pad, symbol) {
        console.log(pad, this.name, ':', this.value);
        for (var i = 0; i < this.content.length; i++) {
            this.content[i].dump(pad + symbol, symbol);
        }
    };
    ;
    return TreeValue;
}());
function rundump() {
    var cellCount = 49;
    var rows = [{ key: 'start', balls: [] }];
    //console.log(datahtml.length);
    var tree = new TreeValue('', '', []);
    tree.fillFromXMLstring(datahtml);
    //tree.dump(' ',' ');
    var list = tree.first('div').every('div');
    for (var ii = 0; ii < list.length; ii++) {
        var ballsRow = { key: list[ii].first('div').first('button').value, balls: [] };
        rows.push(ballsRow);
        //console.log(list[ii].first('div').first('button').value);
        if (list[ii].every('div').length > 0) {
            var buttons = list[ii].every('div')[1].first('div').every('button');
            for (var kk = 0; kk < buttons.length; kk++) {
                if (buttons[kk].first('class').value.indexOf('BtnNumber_active') > -1) {
                    //console.log(kk,buttons[kk].value);
                    ballsRow.balls.push(kk + 1);
                }
            }
            //console.log(list[ii].every('div')[1].first('div').every('button'));
        }
    }
    console.log(JSON.stringify(rows));
}
