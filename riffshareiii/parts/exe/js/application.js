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
class StateDiff {
    constructor(path) {
        this.basePath = path.slice(0);
        this.pathDataCopy = JSON.parse(JSON.stringify(this.findNodeByPath()));
    }
    findNodeByPath() {
        let parent = globalCommandDispatcher.cfg().data;
        for (let ii = 0; ii < this.basePath.length; ii++) {
            parent = parent[this.basePath[ii]];
        }
        return parent;
    }
    diffChangedCommands() {
        let cmds = [];
        let changed = this.findNodeByPath();
        this.addDiff(this.basePath, cmds, this.pathDataCopy, changed);
        let dc = {
            actions: cmds,
            position: {
                x: globalCommandDispatcher.cfg().data.position.x,
                y: globalCommandDispatcher.cfg().data.position.y,
                z: globalCommandDispatcher.cfg().data.position.z
            }
        };
        return dc;
    }
    addDiff(nodePath, commands, old, changed) {
        if (Array.isArray(old)) {
            this.calculateArray(nodePath, commands, old, changed);
        }
        else {
            this.calculateNonArray(nodePath, commands, old, changed);
        }
    }
    calculateNonArray(nodePath, commands, old, changed) {
        for (let prop in old) {
            if (prop == 'undo' || prop == 'redo') {
            }
            else {
                let currentPath = nodePath.slice(0);
                currentPath.push(prop);
                if (typeof old[prop] === "object" || Array.isArray(old[prop])) {
                    this.addDiff(currentPath, commands, old[prop], changed[prop]);
                }
                else {
                    if (old[prop] !== changed[prop]) {
                        commands.push({
                            path: currentPath,
                            kind: "=",
                            newValue: changed[prop],
                            oldValue: old[prop]
                        });
                    }
                }
            }
        }
    }
    calculateArray(nodePath, commands, old, changed) {
        for (let idx = 0; idx < old.length && idx < changed.length; idx++) {
            let currentPath = nodePath.slice(0);
            currentPath.push(idx);
            if (typeof old[idx] === "object" || Array.isArray(old[idx])) {
                this.addDiff(currentPath, commands, old[idx], changed[idx]);
            }
            else {
                if (old[idx] !== changed[idx]) {
                    commands.push({
                        path: currentPath,
                        kind: "=",
                        newValue: changed[idx],
                        oldValue: old[idx]
                    });
                }
            }
        }
        for (let idx = old.length; idx < changed.length; idx++) {
            let currentPath = nodePath.slice(0);
            currentPath.push(idx);
            commands.push({
                path: currentPath,
                kind: "+",
                newNode: JSON.parse(JSON.stringify(changed[idx]))
            });
        }
        for (let idx = changed.length; idx < old.length; idx++) {
            let currentPath = nodePath.slice(0);
            currentPath.push(idx);
            commands.push({
                path: currentPath,
                kind: "-",
                oldNode: old[idx]
            });
        }
    }
}
let goHomeBackURL = '';
function startApplication() {
    console.log('startApplication v1.6.11');
    setupHomeBackURL();
    globalCommandDispatcher.registerWorkProject(createNewEmptyProjectData());
    let ui = new UIRenderer();
    ui.createUI();
    window.addEventListener("beforeunload", () => {
        saveProjectState();
    });
    window.addEventListener("blur", () => {
        saveProjectState();
    });
    window.addEventListener("visibilitychange", function () {
        if (document.hidden) {
            saveProjectState();
        }
    });
    try {
        let lastprojectdata = readLzObjectFromlocalStorage('lastprojectdata');
        if (lastprojectdata) {
            globalCommandDispatcher.registerWorkProject(lastprojectdata);
        }
        console.log('lastprojectdata', lastprojectdata);
        globalCommandDispatcher.clearUndo();
        globalCommandDispatcher.clearRedo();
        let undocommands = readRawObjectFromlocalStorage('undocommands');
        if (undocommands) {
            if (undocommands.length) {
                globalCommandDispatcher.undoQueue = undocommands;
            }
        }
        let redocommands = readRawObjectFromlocalStorage('redocommands');
        if (redocommands) {
            if (redocommands.length) {
                globalCommandDispatcher.redoQueue = redocommands;
            }
        }
    }
    catch (xx) {
        console.log(xx);
    }
    let themei = readRawTextFromlocalStorage('uicolortheme');
    if (themei) {
        globalCommandDispatcher.setThemeColor(themei);
    }
    let uilocale = readRawTextFromlocalStorage('uilocale');
    let navilang = getNavigatorLanguage();
    console.log(uilocale, navilang);
    if (uilocale) {
    }
    else {
        uilocale = navilang;
    }
    let uiratio = readRawTextFromlocalStorage('uiratio');
    if (uiratio) {
        let nratio = parseInt(uiratio);
        if (nratio >= 0.1) {
            globalCommandDispatcher.setThemeLocale(uilocale, nratio);
        }
    }
    globalCommandDispatcher.resetProject();
}
function setupHomeBackURL() {
    let urlParams = new URLSearchParams(window.location.search);
    let home = urlParams.get('home');
    if (home) {
        goHomeBackURL = home;
        console.log('goHomeBackURL', goHomeBackURL);
    }
    else {
        let saved = readRawTextFromlocalStorage('goHomeBackURL');
        if (saved) {
            goHomeBackURL = saved;
        }
    }
    saveRawText2localStorage('goHomeBackURL', goHomeBackURL);
}
function squashString(data) {
    return data;
}
function resolveString(data) {
    return data;
}
function getNavigatorLanguage() {
    console.log('navigator.languages', navigator.languages);
    console.log('navigator.language', navigator.language);
    let rr = '';
    if (navigator.languages && navigator.languages.length) {
        rr = navigator.languages[0];
    }
    else {
        if (navigator.language) {
            rr = navigator.language;
        }
    }
    if (rr.toLowerCase().startsWith('ru')) {
        rr = 'ru';
    }
    else {
        if (rr.toLowerCase().startsWith('zh')) {
            rr = 'zh';
        }
        else {
            rr = 'en';
        }
    }
    return rr;
}
function saveProjectState() {
    globalCommandDispatcher.exe.cutLongUndo();
    let txtdata = JSON.stringify(globalCommandDispatcher.cfg().data);
    try {
        saveLzText2localStorage('lastprojectdata', txtdata);
        saveRawText2localStorage('undocommands', JSON.stringify(globalCommandDispatcher.undo()));
        saveRawText2localStorage('redocommands', JSON.stringify(globalCommandDispatcher.redo()));
    }
    catch (xx) {
        console.log(xx);
        globalCommandDispatcher.clearUndo();
        globalCommandDispatcher.clearRedo();
        try {
            saveLzText2localStorage('lastprojectdata', txtdata);
            saveRawText2localStorage('undocommands', JSON.stringify(globalCommandDispatcher.undo()));
            saveRawText2localStorage('redocommands', JSON.stringify(globalCommandDispatcher.redo()));
        }
        catch (nn) {
            console.log(nn);
            window.localStorage.clear();
            try {
                saveLzText2localStorage('lastprojectdata', txtdata);
                saveRawText2localStorage('undocommands', JSON.stringify(globalCommandDispatcher.undo()));
                saveRawText2localStorage('redocommands', JSON.stringify(globalCommandDispatcher.redo()));
            }
            catch (n22) {
                console.log(n22);
            }
        }
    }
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
class Plugin__DialogPrompt2 {
}
class FilterPluginDialog {
    constructor() {
        this.dialogID = '?';
        this.waitFilterPluginInit = false;
        window.addEventListener('message', this.receiveMessageFromPlugin.bind(this), false);
    }
    promptFilterTitle() {
        let newTitle = prompt(this.filter.title, this.filter.title);
        if (newTitle == this.filter.title) {
        }
        else {
            if (newTitle != null) {
                globalCommandDispatcher.exe.commitProjectChanges(['filters', this.order], () => {
                    if (newTitle) {
                        this.filter.title = newTitle;
                    }
                    ;
                });
                this.resetFilterTitle();
            }
        }
    }
    resetFilterTitle() {
        let pluginTitle = document.getElementById("pluginFilterTitle");
        pluginTitle.innerHTML = '&nbsp;&nbsp;' + this.filter.title;
    }
    resetStateButtons() {
        if (this.filter.state == 1) {
            document.getElementById("pluginFilterSetFilter").className = 'pluginDoButton';
            document.getElementById("pluginFilterSetPasstrough").className = 'pluginNoneButton';
        }
        else {
            document.getElementById("pluginFilterSetFilter").className = 'pluginNoneButton';
            document.getElementById("pluginFilterSetPasstrough").className = 'pluginDoButton';
        }
    }
    setFilterOn() {
        globalCommandDispatcher.exe.commitProjectChanges(['filters', this.order], () => {
            this.filter.state = 0;
        });
        this.resetStateButtons();
        globalCommandDispatcher.reConnectPluginsIfPlay();
    }
    setFilterPass() {
        globalCommandDispatcher.exe.commitProjectChanges(['filters', this.order], () => {
            this.filter.state = 1;
        });
        this.resetStateButtons();
        globalCommandDispatcher.reConnectPluginsIfPlay();
    }
    dropFilter() {
        globalCommandDispatcher.exe.commitProjectChanges([], () => {
            let id = globalCommandDispatcher.cfg().data.filters[this.order].id;
            globalCommandDispatcher.cfg().data.filters.splice(this.order, 1);
            for (let ii = 0; ii < globalCommandDispatcher.cfg().data.filters.length; ii++) {
                let oo = globalCommandDispatcher.cfg().data.filters[ii];
                oo.outputs = oo.outputs.filter(item => item !== id);
            }
            for (let ii = 0; ii < globalCommandDispatcher.cfg().data.percussions.length; ii++) {
                let oo = globalCommandDispatcher.cfg().data.percussions[ii].sampler;
                oo.outputs = oo.outputs.filter(item => item !== id);
            }
            for (let ii = 0; ii < globalCommandDispatcher.cfg().data.tracks.length; ii++) {
                let oo = globalCommandDispatcher.cfg().data.tracks[ii].performer;
                oo.outputs = oo.outputs.filter(item => item !== id);
            }
        });
        this.closeFilterDialogFrame();
        globalCommandDispatcher.reConnectPluginsIfPlay();
    }
    openEmptyFilterPluginDialogFrame(order, filter) {
        this.filter = filter;
        this.order = order;
        this.pluginRawData = filter.data;
        this.resetFilterTitle();
        let pluginFrame = document.getElementById("pluginFilterFrame");
        let pluginDiv = document.getElementById("pluginFilterDiv");
        if (pluginFrame) {
            if (pluginFrame.contentWindow) {
                this.waitFilterPluginInit = true;
                pluginFrame.contentWindow.window.location.replace("plugins/pluginplaceholder.html");
                pluginDiv.style.visibility = "visible";
                this.resetStateButtons();
            }
        }
    }
    openFilterPluginDialogFrame(order, filter, filterPlugin) {
        this.filter = filter;
        this.order = order;
        this.pluginRawData = filter.data;
        this.resetFilterTitle();
        let pluginFrame = document.getElementById("pluginFilterFrame");
        let pluginDiv = document.getElementById("pluginFilterDiv");
        if (pluginFrame) {
            if (pluginFrame.contentWindow) {
                this.waitFilterPluginInit = true;
                if (filterPlugin) {
                    pluginFrame.contentWindow.window.location.replace(filterPlugin.ui);
                }
                pluginDiv.style.visibility = "visible";
                this.resetStateButtons();
            }
        }
    }
    closeFilterDialogFrame() {
        let pluginDiv = document.getElementById("pluginFilterDiv");
        if (pluginDiv) {
            pluginDiv.style.visibility = "hidden";
        }
        let pluginFrame = document.getElementById("pluginFilterFrame");
        if (pluginFrame) {
            pluginFrame.src = "plugins/pluginplaceholder.html";
        }
    }
    sendNewIdToPlugin() {
        let pluginFrame = document.getElementById("pluginFilterFrame");
        if (pluginFrame) {
            this.dialogID = '' + Math.random();
            let message = { hostData: this.dialogID, colors: globalCommandDispatcher.readThemeColors(), screenData: null, langID: labelLocaleDictionary };
            pluginFrame.contentWindow.postMessage(message, '*');
        }
    }
    sendPointToPlugin() {
        let pluginFrame = document.getElementById("pluginFilterFrame");
        if (pluginFrame) {
            let message = { hostData: this.pluginRawData, colors: globalCommandDispatcher.readThemeColors(), screenData: null, langID: labelLocaleDictionary };
            pluginFrame.contentWindow.postMessage(message, '*');
        }
    }
    setFilterValue() {
        globalCommandDispatcher.exe.commitProjectChanges(['filters', this.order], () => {
            this.filter.data = this.pluginRawData;
        });
        globalCommandDispatcher.reStartPlayIfPlay();
    }
    receiveMessageFromPlugin(event) {
        if (!(event.data)) {
        }
        else {
            let message = event.data;
            if (message.dialogID) {
                if (message.dialogID == this.dialogID) {
                    this.pluginRawData = message.pluginData;
                    this.setFilterValue();
                }
                else {
                }
            }
            else {
                if (this.waitFilterPluginInit) {
                    this.waitFilterPluginInit = false;
                    this.sendNewIdToPlugin();
                    this.sendPointToPlugin();
                }
                else {
                }
            }
        }
    }
}
class SamplerPluginDialog {
    constructor() {
        this.dialogID = '?';
        this.waitSamplerPluginInit = false;
        window.addEventListener('message', this.receiveMessageFromPlugin.bind(this), false);
    }
    promptDrumTitle() {
        let newTitle = prompt(this.drum.title, this.drum.title);
        if (newTitle == this.drum.title) {
        }
        else {
            if (newTitle != null) {
                globalCommandDispatcher.exe.commitProjectChanges(['percussions', this.order], () => {
                    if (newTitle) {
                        this.drum.title = newTitle;
                    }
                    ;
                });
                this.resetDrumTitle();
            }
        }
    }
    resetDrumTitle() {
        let pluginTitle = document.getElementById("pluginSamplerTitle");
        pluginTitle.innerHTML = '&nbsp;&nbsp;' + this.drum.title;
    }
    resetStateButtons() {
        if (this.drum.sampler.state == 1) {
            document.getElementById("pluginSamplerSetPlay").className = 'pluginDoButton';
            document.getElementById("pluginSamplerSetPasstrough").className = 'pluginNoneButton';
            document.getElementById("pluginSamplerSetSolo").className = 'pluginDoButton';
        }
        else {
            if (this.drum.sampler.state == 2) {
                document.getElementById("pluginSamplerSetPlay").className = 'pluginDoButton';
                document.getElementById("pluginSamplerSetPasstrough").className = 'pluginDoButton';
                document.getElementById("pluginSamplerSetSolo").className = 'pluginNoneButton';
            }
            else {
                document.getElementById("pluginSamplerSetPlay").className = 'pluginNoneButton';
                document.getElementById("pluginSamplerSetPasstrough").className = 'pluginDoButton';
                document.getElementById("pluginSamplerSetSolo").className = 'pluginDoButton';
            }
        }
    }
    setDrumOn() {
        globalCommandDispatcher.exe.commitProjectChanges(['percussions', this.order], () => {
            this.drum.sampler.state = 0;
        });
        this.resetStateButtons();
        globalCommandDispatcher.reConnectPluginsIfPlay();
    }
    setDrumMute() {
        globalCommandDispatcher.exe.commitProjectChanges(['percussions', this.order], () => {
            this.drum.sampler.state = 1;
        });
        this.resetStateButtons();
        globalCommandDispatcher.reConnectPluginsIfPlay();
    }
    setDrumSolo() {
        globalCommandDispatcher.exe.commitProjectChanges(['percussions', this.order], () => {
            this.drum.sampler.state = 2;
        });
        this.resetStateButtons();
        globalCommandDispatcher.reConnectPluginsIfPlay();
    }
    dropDrum() {
        globalCommandDispatcher.exe.commitProjectChanges(['percussions'], () => {
            globalCommandDispatcher.cfg().data.percussions.splice(this.order, 1);
        });
        this.closeDrumDialogFrame();
        globalCommandDispatcher.reConnectPluginsIfPlay();
    }
    openEmptyDrumPluginDialogFrame(order, drum) {
        this.drum = drum;
        this.order = order;
        this.resetDrumTitle();
        let pluginFrame = document.getElementById("pluginSamplerFrame");
        let pluginDiv = document.getElementById("pluginSamplerDiv");
        if (pluginFrame.contentWindow) {
            pluginFrame.contentWindow.window.location.replace("plugins/pluginplaceholder.html");
        }
        pluginDiv.style.visibility = "visible";
        this.resetStateButtons();
    }
    openDrumPluginDialogFrame(order, drum, fplugin) {
        this.drum = drum;
        this.order = order;
        this.pluginRawData = drum.sampler.data;
        this.resetDrumTitle();
        let pluginFrame = document.getElementById("pluginSamplerFrame");
        let pluginDiv = document.getElementById("pluginSamplerDiv");
        if (pluginFrame) {
            if (pluginFrame.contentWindow) {
                this.waitSamplerPluginInit = true;
                if (fplugin) {
                    pluginFrame.contentWindow.window.location.replace(fplugin.ui);
                }
                pluginDiv.style.visibility = "visible";
                this.resetStateButtons();
            }
        }
    }
    closeDrumDialogFrame() {
        let pluginDiv = document.getElementById("pluginSamplerDiv");
        if (pluginDiv) {
            pluginDiv.style.visibility = "hidden";
        }
        let pluginFrame = document.getElementById("pluginSamplerFrame");
        if (pluginFrame) {
            pluginFrame.src = "plugins/pluginplaceholder.html";
        }
    }
    sendNewIdToPlugin() {
        let pluginFrame = document.getElementById("pluginSamplerFrame");
        if (pluginFrame) {
            this.dialogID = '' + Math.random();
            let message = { hostData: this.dialogID, colors: globalCommandDispatcher.readThemeColors(), screenData: null, langID: labelLocaleDictionary };
            pluginFrame.contentWindow.postMessage(message, '*');
        }
    }
    sendPointToPlugin() {
        let pluginFrame = document.getElementById("pluginSamplerFrame");
        if (pluginFrame) {
            let message = { hostData: this.pluginRawData, colors: globalCommandDispatcher.readThemeColors(), screenData: null, langID: labelLocaleDictionary };
            pluginFrame.contentWindow.postMessage(message, '*');
        }
    }
    setFilterValue() {
        globalCommandDispatcher.exe.commitProjectChanges(['percussions', this.order], () => {
            this.drum.sampler.data = this.pluginRawData;
        });
        globalCommandDispatcher.reStartPlayIfPlay();
    }
    receiveMessageFromPlugin(event) {
        if (!(event.data)) {
        }
        else {
            let message = event.data;
            if (message.dialogID) {
                if (message.dialogID == this.dialogID) {
                    this.pluginRawData = message.pluginData;
                    this.setFilterValue();
                }
                else {
                }
            }
            else {
                if (this.waitSamplerPluginInit) {
                    this.waitSamplerPluginInit = false;
                    this.sendNewIdToPlugin();
                    this.sendPointToPlugin();
                }
                else {
                }
            }
        }
    }
}
class ActionPluginDialog {
    constructor() {
        this.waitActionPluginInit = false;
        this.dialogID = '?';
        window.addEventListener('message', this.receiveMessageFromPlugin.bind(this), false);
    }
    sendNewIdToPlugin() {
        let pluginFrame = document.getElementById("pluginActionFrame");
        if (pluginFrame) {
            this.dialogID = '' + Math.random();
            let message = { hostData: this.dialogID, colors: globalCommandDispatcher.readThemeColors(), screenData: null, langID: labelLocaleDictionary };
            pluginFrame.contentWindow.postMessage(message, '*');
        }
    }
    sendDataToActionPlugin() {
    }
    sendCurrentProjectToActionPlugin(screen) {
        let pluginFrame = document.getElementById("pluginActionFrame");
        if (pluginFrame) {
            if (screen) {
                globalCommandDispatcher.makeTileSVGsquareCanvas(500, (canvas, buffer) => {
                    let data = [];
                    var array8 = new Uint8Array(buffer);
                    var len = buffer.byteLength;
                    for (var ii = 0; ii < len; ii++) {
                        data.push(array8[ii]);
                    }
                    let message = {
                        hostData: globalCommandDispatcher.cfg().data,
                        colors: globalCommandDispatcher.readThemeColors(),
                        screenData: data,
                        langID: labelLocaleDictionary
                    };
                    pluginFrame.contentWindow.postMessage(message, '*');
                });
            }
            else {
                let message = {
                    hostData: globalCommandDispatcher.cfg().data,
                    colors: globalCommandDispatcher.readThemeColors(),
                    screenData: null,
                    langID: labelLocaleDictionary
                };
                console.log('from host to plugin', message);
                pluginFrame.contentWindow.postMessage(message, '*');
            }
        }
    }
    receiveMessageFromPlugin(event) {
        if (!(event.data)) {
        }
        else {
            let message = event.data;
            if (message.dialogID) {
                if (message.dialogID == this.dialogID) {
                    let me = this;
                    console.log('waitProjectCallback');
                    if (message.pluginData) {
                        globalCommandDispatcher.exe.commitProjectChanges([], () => {
                            let project = message.pluginData;
                            globalCommandDispatcher.registerWorkProject(project);
                            globalCommandDispatcher.resetProject();
                            globalCommandDispatcher.reStartPlayIfPlay();
                        });
                    }
                    if (message.done) {
                        me.closeActionDialogFrame();
                    }
                }
                else {
                }
            }
            else {
                if (this.waitActionPluginInit) {
                    this.waitActionPluginInit = false;
                    this.sendNewIdToPlugin();
                    this.sendCurrentProjectToActionPlugin(!!(message.screenWait));
                }
                else {
                }
            }
        }
    }
    openActionPluginDialogFrame(info) {
        this.pluginInfo = info;
        this.resetActionTitle();
        let pluginFrame = document.getElementById("pluginActionFrame");
        let pluginDiv = document.getElementById("pluginActionDiv");
        if (pluginFrame) {
            if (pluginFrame.contentWindow) {
                this.waitActionPluginInit = true;
                pluginFrame.contentWindow.window.location.replace(this.pluginInfo.ui);
                pluginDiv.style.visibility = "visible";
            }
        }
    }
    closeActionDialogFrame() {
        let pluginDiv = document.getElementById("pluginActionDiv");
        if (pluginDiv) {
            pluginDiv.style.visibility = "hidden";
        }
        let pluginFrame = document.getElementById("pluginActionFrame");
        if (pluginFrame.contentWindow) {
            pluginFrame.contentWindow.window.location.replace("plugins/pluginplaceholder.html");
        }
    }
    resetActionTitle() {
        let pluginTitle = document.getElementById("pluginActionTitle");
        pluginTitle.innerHTML = '&nbsp;&nbsp;' + this.pluginInfo.label;
    }
}
class SequencerPluginDialog {
    constructor() {
        this.dialogID = '?';
        this.waitSequencerPluginInit = false;
        window.addEventListener('message', this.receiveMessageFromPlugin.bind(this), false);
    }
    promptSequencerTitle() {
        let newTitle = prompt(this.track.title, this.track.title);
        if (newTitle == this.track.title) {
        }
        else {
            if (newTitle != null) {
                globalCommandDispatcher.exe.commitProjectChanges(['tracks', this.order], () => {
                    if (newTitle) {
                        this.track.title = newTitle;
                    }
                    ;
                });
                this.resetSequencerTitle();
            }
        }
    }
    resetSequencerTitle() {
        let pluginTitle = document.getElementById("pluginSequencerTitle");
        pluginTitle.innerHTML = '&nbsp;&nbsp;' + this.track.title;
    }
    resetStateButtons() {
        if (this.track.performer.state == 1) {
            document.getElementById("pluginSequencerSetPlay").className = 'pluginDoButton';
            document.getElementById("pluginSequencerSetPasstrough").className = 'pluginNoneButton';
            document.getElementById("pluginSequencerSetSolo").className = 'pluginDoButton';
        }
        else {
            if (this.track.performer.state == 2) {
                document.getElementById("pluginSequencerSetPlay").className = 'pluginDoButton';
                document.getElementById("pluginSequencerSetPasstrough").className = 'pluginDoButton';
                document.getElementById("pluginSequencerSetSolo").className = 'pluginNoneButton';
            }
            else {
                document.getElementById("pluginSequencerSetPlay").className = 'pluginNoneButton';
                document.getElementById("pluginSequencerSetPasstrough").className = 'pluginDoButton';
                document.getElementById("pluginSequencerSetSolo").className = 'pluginDoButton';
            }
        }
    }
    setSequencerOn() {
        globalCommandDispatcher.exe.commitProjectChanges(['tracks', this.order], () => {
            this.track.performer.state = 0;
        });
        this.resetStateButtons();
        globalCommandDispatcher.reConnectPluginsIfPlay();
    }
    setSequencerMute() {
        globalCommandDispatcher.exe.commitProjectChanges(['tracks', this.order], () => {
            this.track.performer.state = 1;
        });
        this.resetStateButtons();
        globalCommandDispatcher.reConnectPluginsIfPlay();
    }
    setSequencerSolo() {
        globalCommandDispatcher.exe.commitProjectChanges(['tracks', this.order], () => {
            this.track.performer.state = 2;
        });
        this.resetStateButtons();
        globalCommandDispatcher.reConnectPluginsIfPlay();
    }
    dropSequencer() {
        globalCommandDispatcher.exe.commitProjectChanges(['tracks'], () => {
            globalCommandDispatcher.cfg().data.tracks.splice(this.order, 1);
        });
        this.closeSequencerDialogFrame();
        globalCommandDispatcher.reConnectPluginsIfPlay();
    }
    openEmptySequencerPluginDialogFrame(order, track) {
        this.track = track;
        this.order = order;
        this.resetSequencerTitle();
        let pluginFrame = document.getElementById("pluginSequencerFrame");
        let pluginDiv = document.getElementById("pluginSequencerDiv");
        if (pluginFrame) {
            if (pluginFrame.contentWindow) {
                pluginFrame.contentWindow.window.location.replace("plugins/pluginplaceholder.html");
                pluginDiv.style.visibility = "visible";
                this.resetStateButtons();
            }
        }
    }
    openSequencerPluginDialogFrame(farNo, trackNo, track, trackPlugin) {
        if (farNo) {
            globalCommandDispatcher.exe.commitProjectChanges(['farorder'], () => {
                let farorder = globalCommandDispatcher.calculateRealTrackFarOrder();
                let nn = farorder.splice(farNo, 1)[0];
                farorder.splice(0, 0, nn);
                globalCommandDispatcher.cfg().data.farorder = farorder;
            });
        }
        this.track = track;
        this.order = trackNo;
        this.pluginRawData = track.performer.data;
        this.resetSequencerTitle();
        let pluginFrame = document.getElementById("pluginSequencerFrame");
        let pluginDiv = document.getElementById("pluginSequencerDiv");
        if (pluginFrame) {
            if (pluginFrame.contentWindow) {
                this.waitSequencerPluginInit = true;
                if (trackPlugin) {
                    pluginFrame.contentWindow.window.location.replace(trackPlugin.ui);
                }
                pluginDiv.style.visibility = "visible";
                this.resetStateButtons();
            }
        }
    }
    closeSequencerDialogFrame() {
        let pluginDiv = document.getElementById("pluginSequencerDiv");
        if (pluginDiv) {
            pluginDiv.style.visibility = "hidden";
        }
        let pluginFrame = document.getElementById("pluginSequencerFrame");
        if (pluginFrame.contentWindow) {
            pluginFrame.contentWindow.window.location.replace("plugins/pluginplaceholder.html");
        }
    }
    sendNewIdToPlugin() {
        let pluginFrame = document.getElementById("pluginSequencerFrame");
        if (pluginFrame) {
            this.dialogID = '' + Math.random();
            let message = { hostData: this.dialogID, colors: globalCommandDispatcher.readThemeColors(), screenData: null, langID: labelLocaleDictionary };
            pluginFrame.contentWindow.postMessage(message, '*');
        }
    }
    sendPointToPlugin() {
        let pluginFrame = document.getElementById('pluginSequencerFrame');
        if (pluginFrame) {
            let message = { hostData: this.pluginRawData, colors: globalCommandDispatcher.readThemeColors(), screenData: null, langID: labelLocaleDictionary };
            pluginFrame.contentWindow.postMessage(message, '*');
        }
    }
    setSequencerValue() {
        globalCommandDispatcher.exe.commitProjectChanges(['tracks', this.order], () => {
            this.track.performer.data = this.pluginRawData;
        });
        globalCommandDispatcher.reStartPlayIfPlay();
    }
    receiveMessageFromPlugin(event) {
        if (!(event.data)) {
        }
        else {
            let message = event.data;
            if (message.dialogID) {
                if (message.dialogID == this.dialogID) {
                    this.pluginRawData = message.pluginData;
                    this.setSequencerValue();
                }
                else {
                }
            }
            else {
                if (this.waitSequencerPluginInit) {
                    this.waitSequencerPluginInit = false;
                    this.sendNewIdToPlugin();
                    this.sendPointToPlugin();
                }
                else {
                }
            }
        }
    }
}
class PointPluginDialog {
    constructor() {
        this.dialogID = '?';
        this.waitPointPluginInit = false;
        window.addEventListener('message', this.receiveMessageFromPlugin.bind(this), false);
    }
    resetPointTitle() {
        let pluginTitle = document.getElementById("pluginPointTitle");
        pluginTitle.innerHTML = '&nbsp;&nbsp;' + (this.barIdx + 1) + ':' + this.pluginPoint.skip.count + '/' + this.pluginPoint.skip.part + ' ' + this.filter.title;
    }
    dropPoint() {
        globalCommandDispatcher.exe.commitProjectChanges(['filters', this.filterIdx, 'automation', this.barIdx], () => {
            let muStart = MMUtil().set(this.startEnd.start);
            let muEnd = MMUtil().set(this.startEnd.end);
            for (let changeIdx = 0; changeIdx < this.filter.automation[this.barIdx].changes.length; changeIdx++) {
                let testChange = this.filter.automation[this.barIdx].changes[changeIdx];
                if (muStart.more(testChange.skip)) {
                }
                else {
                    if (muEnd.more(testChange.skip)) {
                        this.filter.automation[this.barIdx].changes.splice(changeIdx, 1);
                        changeIdx--;
                    }
                }
            }
        });
        this.closePointDialogFrame();
    }
    openPointPluginDialogFrame(filterIdx, barIdx, info, pointIdx, pointChange, filter, filterPlugin) {
        this.filter = filter;
        this.startEnd = info,
            this.barIdx = barIdx;
        this.filterIdx = filterIdx;
        this.pointIdx = pointIdx;
        this.pluginPoint = pointChange;
        this.resetPointTitle();
        let pluginFrame = document.getElementById("pluginPointFrame");
        let pluginDiv = document.getElementById("pluginPointDiv");
        if (pluginFrame) {
            if (pluginFrame.contentWindow) {
                this.waitPointPluginInit = true;
                pluginFrame.contentWindow.window.location.replace(filterPlugin.ui);
                pluginDiv.style.visibility = "visible";
            }
        }
    }
    closePointDialogFrame() {
        let pluginDiv = document.getElementById("pluginPointDiv");
        if (pluginDiv) {
            pluginDiv.style.visibility = "hidden";
        }
        let pluginFrame = document.getElementById("pluginPointFrame");
        if (pluginFrame.contentWindow) {
            pluginFrame.contentWindow.window.location.replace("plugins/pluginplaceholder.html");
        }
    }
    sendNewIdToPlugin() {
        let pluginFrame = document.getElementById("pluginPointFrame");
        if (pluginFrame) {
            this.dialogID = '' + Math.random();
            let message = { hostData: this.dialogID, colors: globalCommandDispatcher.readThemeColors(), screenData: null, langID: labelLocaleDictionary };
            pluginFrame.contentWindow.postMessage(message, '*');
        }
    }
    sendPointToPlugin() {
        let pluginFrame = document.getElementById("pluginPointFrame");
        if (pluginFrame) {
            let message = { hostData: this.pluginPoint.stateBlob, colors: globalCommandDispatcher.readThemeColors(), screenData: null, langID: labelLocaleDictionary };
            pluginFrame.contentWindow.postMessage(message, '*');
        }
    }
    setPointValue(data) {
        globalCommandDispatcher.exe.commitProjectChanges(['filters', this.filterIdx, 'automation', this.barIdx], () => {
            this.pluginPoint.stateBlob = data;
        });
        globalCommandDispatcher.reStartPlayIfPlay();
    }
    receiveMessageFromPlugin(event) {
        if (!(event.data)) {
        }
        else {
            let message = event.data;
            if (message.dialogID) {
                if (message.dialogID == this.dialogID) {
                    this.setPointValue(message.pluginData);
                }
                else {
                }
            }
            else {
                if (this.waitPointPluginInit) {
                    this.waitPointPluginInit = false;
                    this.sendNewIdToPlugin();
                    this.sendPointToPlugin();
                }
                else {
                }
            }
        }
    }
}
class CommandExe {
    constructor() {
        this.lockUndoRedo = false;
    }
    setCurPosition(xyz) {
        globalCommandDispatcher.cfg().data.position = { x: xyz.x, y: xyz.y, z: xyz.z };
    }
    commitProjectChanges(path, proAction) {
        let state = new StateDiff(path);
        proAction();
        this.addUndoCommandActiions(state.diffChangedCommands());
        this.cutLongUndo();
    }
    addUndoCommandActiions(cmd) {
        globalCommandDispatcher.clearRedo();
        globalCommandDispatcher.undo().push(new LZUtil().compressToUTF16(JSON.stringify(cmd)));
        globalCommandDispatcher.resetProject();
    }
    parentFromPath(path) {
        let nodeparent = globalCommandDispatcher.cfg().data;
        for (let ii = 0; ii < path.length - 1; ii++) {
            nodeparent = nodeparent[path[ii]];
        }
        return nodeparent;
    }
    actionChangeNode(act, value) {
        let nodeProp = act.path[act.path.length - 1];
        let nodeParent = this.parentFromPath(act.path);
        nodeParent[nodeProp] = JSON.parse(JSON.stringify(value));
    }
    actionDeleteNode(act) {
        let nodeParent = this.parentFromPath(act.path);
        nodeParent.pop();
    }
    actionAddNode(act, node) {
        let nodeParent = this.parentFromPath(act.path);
        nodeParent.push(JSON.parse(JSON.stringify(node)));
    }
    unAction(cmd) {
        for (let ii = 0; ii < cmd.actions.length; ii++) {
            let act = cmd.actions[ii];
            if (act.kind == '-') {
                this.actionAddNode(act, act.oldNode);
            }
        }
        for (let ii = 0; ii < cmd.actions.length; ii++) {
            let act = cmd.actions[ii];
            if (act.kind == '+') {
                this.actionDeleteNode(act);
            }
        }
        for (let ii = 0; ii < cmd.actions.length; ii++) {
            let act = cmd.actions[ii];
            if (act.kind == '=') {
                this.actionChangeNode(act, act.oldValue);
            }
        }
    }
    reAction(cmd) {
        for (let ii = 0; ii < cmd.actions.length; ii++) {
            let act = cmd.actions[ii];
            if (act.kind == '+') {
                this.actionAddNode(act, act.newNode);
            }
        }
        for (let ii = 0; ii < cmd.actions.length; ii++) {
            let act = cmd.actions[ii];
            if (act.kind == '-') {
                this.actionDeleteNode(act);
            }
        }
        for (let ii = 0; ii < cmd.actions.length; ii++) {
            let act = cmd.actions[ii];
            if (act.kind == '=') {
                this.actionChangeNode(act, act.newValue);
            }
        }
    }
    cutLongUndo() {
        let size = 0;
        for (let ii = 0; ii < globalCommandDispatcher.undo().length; ii++) {
            size = size + globalCommandDispatcher.undo()[ii].length;
            if (size > 543210) {
                let drp = Math.ceil(ii / 2);
                globalCommandDispatcher.undo().splice(0, drp);
                globalCommandDispatcher.clearRedo();
                break;
            }
        }
    }
    undo(cnt) {
        if (this.lockUndoRedo) {
            console.log('lockUndoRedo');
        }
        else {
            globalCommandDispatcher.stopPlay();
            this.lockUndoRedo = true;
            for (let ii = 0; ii < cnt; ii++) {
                if (globalCommandDispatcher.undo().length) {
                    let cmd = JSON.parse('' + new LZUtil().decompressFromUTF16(globalCommandDispatcher.undo().pop()));
                    if (cmd) {
                        this.unAction(cmd);
                        let lz = new LZUtil().compressToUTF16(JSON.stringify(cmd));
                        globalCommandDispatcher.redo().unshift(lz);
                        if (cmd.position) {
                            this.setCurPosition(cmd.position);
                        }
                    }
                }
            }
            this.lockUndoRedo = false;
            this.cutLongUndo();
            globalCommandDispatcher.resetProject();
        }
    }
    redo(cnt) {
        if (this.lockUndoRedo) {
            console.log('lockUndoRedo');
        }
        else {
            globalCommandDispatcher.stopPlay();
            this.lockUndoRedo = true;
            for (let ii = 0; ii < cnt; ii++) {
                if (globalCommandDispatcher.redo().length) {
                    let cmd = JSON.parse('' + new LZUtil().decompressFromUTF16(globalCommandDispatcher.redo().shift()));
                    if (cmd) {
                        this.reAction(cmd);
                        let lz = new LZUtil().compressToUTF16(JSON.stringify(cmd));
                        globalCommandDispatcher.undo().push(lz);
                        if (cmd.position) {
                            this.setCurPosition(cmd.position);
                        }
                    }
                }
            }
            this.lockUndoRedo = false;
            this.cutLongUndo();
            globalCommandDispatcher.resetProject();
        }
    }
}
let uiLinkFilterToSpeaker = 'uiLinkFilterToSpeaker';
let uiLinkFilterToFilter = 'uiLinkFilterToFilter';
class CommandDispatcher {
    constructor() {
        this.tapSizeRatio = 1;
        this.playPosition = 0;
        this.playCallback = (start, pos, end) => {
            this.playPosition = pos - 0.25;
            this.reDrawPlayPosition();
        };
        this.listener = null;
        this.exe = new CommandExe();
        this.undoQueue = [];
        this.redoQueue = [];
        this.filterPluginDialog = new FilterPluginDialog();
        this.pointPluginDialog = new PointPluginDialog();
        this.samplerPluginDialog = new SamplerPluginDialog();
        this.actionPluginDialog = new ActionPluginDialog();
        this.sequencerPluginDialog = new SequencerPluginDialog();
    }
    cfg() {
        return this._mixerDataMathUtility;
    }
    promptPluginInfoDebug() {
        console.log('promptPluginInfoDebug');
        var input = document.createElement('input');
        input.type = 'file';
        input.onchange = (evnt) => {
            var file = evnt.target.files[0];
            console.log(file);
            var reader = new FileReader();
            reader.readAsText(file, 'UTF-8');
            reader.onload = (readerEvent) => {
                var content = readerEvent.target.result;
                console.log(content);
                let inf = JSON.parse(content);
                console.log(inf);
                MZXBX_currentPlugins().push(inf);
                console.log(MZXBX_currentPlugins());
                menuItemsData = null;
                globalCommandDispatcher.renderer.menu.rerenderMenuContent(null);
                globalCommandDispatcher.resetProject();
            };
        };
        input.click();
    }
    undo() {
        return this.undoQueue;
    }
    redo() {
        return this.redoQueue;
    }
    clearUndo() {
        this.undoQueue = [];
    }
    clearRedo() {
        this.redoQueue = [];
    }
    setVisibleTimeMark() {
        this.renderer.timeselectbar.positionTimeMark.css = 'positionTimeMarkShow';
        this.renderer.tiler.resetAnchor(this.renderer.timeselectbar.positionTimeSVGGroup, this.renderer.timeselectbar.positionTimeAnchor, LevelModes.normal);
    }
    setHiddenTimeMark() {
        this.renderer.timeselectbar.positionTimeMark.css = 'positionTimeMarkHide';
        this.renderer.tiler.resetAnchor(this.renderer.timeselectbar.positionTimeSVGGroup, this.renderer.timeselectbar.positionTimeAnchor, LevelModes.normal);
    }
    reDrawPlayPosition() {
        let ww = this.renderer.timeselectbar.positionMarkWidth();
        let xx = this.cfg().leftPad + this.playPosition * this.cfg().widthDurationRatio - ww;
        this.renderer.timeselectbar.positionTimeAnchor.translation = { x: xx, y: 0 };
        this.renderer.timeselectbar.positionTimeMark.w = ww;
        this.renderer.tiler.resetAnchor(this.renderer.timeselectbar.positionTimeSVGGroup, this.renderer.timeselectbar.positionTimeAnchor, LevelModes.normal);
    }
    initAudioFromUI() {
        var AudioContext = window.AudioContext;
        this.audioContext = new AudioContext();
        this.player = createSchedulePlayer(this.playCallback);
    }
    registerWorkProject(data) {
        console.log('registerWorkProject', data.menuPerformers);
        this._mixerDataMathUtility = new MixerDataMathUtility(data);
        this.adjustTimelineContent();
    }
    registerUI(renderer) {
        this.renderer = renderer;
    }
    hideRightMenu() {
        globalCommandDispatcher.cfg().data.list = false;
        this.renderer.menu.resizeMenu(this.renderer.menu.lastWidth, this.renderer.menu.lastHeight);
        this.renderer.menu.resetAllAnchors();
    }
    showRightMenu() {
        let vw = this.renderer.tileLevelSVG.clientWidth / this.renderer.tiler.tapPxSize();
        let vh = this.renderer.tileLevelSVG.clientHeight / this.renderer.tiler.tapPxSize();
        this.cfg().data.list = true;
        this.renderer.menu.resizeMenu(vw, vh);
        this.renderer.menu.resetAllAnchors();
    }
    ;
    findCurrentFilter(id) {
        for (let ff = 0; ff < this.cfg().data.filters.length; ff++) {
            if (this.cfg().data.filters[ff].id == id) {
                return this.cfg().data.filters[ff];
            }
        }
        return null;
    }
    renderCurrentOutputs(id, result, outputs) {
        for (let oo = 0; oo < outputs.length; oo++) {
            let cid = outputs[oo];
            if (cid) {
                if (cid != id) {
                    let filter = this.findCurrentFilter(cid);
                    if (filter) {
                        if (filter.state == 1) {
                            this.renderCurrentOutputs(id, result, filter.outputs);
                        }
                        else {
                            if (result.indexOf(cid) < 0) {
                                result.push(cid);
                            }
                        }
                    }
                }
            }
            else {
                if (result.indexOf('') < 0) {
                    result.push('');
                }
            }
        }
    }
    renderCurrentProjectForOutput() {
        let forOutput = {
            series: [],
            channels: [],
            filters: []
        };
        let prj = this.cfg().data;
        let soloOnly = false;
        for (let ss = 0; ss < prj.percussions.length; ss++) {
            if (prj.percussions[ss].sampler.state == 2) {
                soloOnly = true;
                break;
            }
        }
        for (let tt = 0; tt < prj.tracks.length; tt++) {
            if (prj.tracks[tt].performer.state == 2) {
                soloOnly = true;
                break;
            }
        }
        for (let ss = 0; ss < prj.percussions.length; ss++) {
            let sampler = prj.percussions[ss];
            let mchannel = {
                id: sampler.sampler.id,
                outputs: [],
                performer: {
                    kind: sampler.sampler.kind,
                    properties: sampler.sampler.data,
                    description: 'sampler ' + sampler.title
                }
            };
            if ((soloOnly && sampler.sampler.state != 2)
                || ((!soloOnly) && sampler.sampler.state == 1)) {
            }
            else {
                this.renderCurrentOutputs(sampler.sampler.id, mchannel.outputs, sampler.sampler.outputs);
            }
            forOutput.channels.push(mchannel);
        }
        for (let tt = 0; tt < prj.tracks.length; tt++) {
            let track = prj.tracks[tt];
            let mchannel = {
                id: track.performer.id,
                outputs: [],
                performer: {
                    kind: track.performer.kind,
                    properties: track.performer.data,
                    description: 'track ' + track.title
                }
            };
            if ((soloOnly && track.performer.state != 2)
                || ((!soloOnly) && track.performer.state == 1)) {
            }
            else {
                this.renderCurrentOutputs(track.performer.id, mchannel.outputs, track.performer.outputs);
            }
            forOutput.channels.push(mchannel);
        }
        for (let ff = 0; ff < prj.filters.length; ff++) {
            let filter = prj.filters[ff];
            let outFilter = {
                id: filter.id,
                kind: filter.kind,
                properties: filter.data,
                outputs: [],
                description: 'filter ' + filter.title
            };
            if (filter.state == 1) {
            }
            else {
                this.renderCurrentOutputs(filter.id, outFilter.outputs, filter.outputs);
            }
            forOutput.filters.push(outFilter);
        }
        for (let mm = 0; mm < prj.timeline.length; mm++) {
            let measure = prj.timeline[mm];
            let cuDuration = MMUtil().set(measure.metre).duration(measure.tempo);
            let singleSet = {
                duration: cuDuration,
                tempo: measure.tempo,
                items: [],
                states: []
            };
            forOutput.series.push(singleSet);
            for (let ff = 0; ff < prj.filters.length; ff++) {
                let filter = prj.filters[ff];
                let auto = filter.automation[mm];
                if (auto) {
                    for (let aa = 0; aa < auto.changes.length; aa++) {
                        let change = auto.changes[aa];
                        let start = MMUtil().set(change.skip).duration(measure.tempo);
                        let filterChange = { skip: start, filterId: filter.id, data: change.stateBlob };
                        singleSet.states.push(filterChange);
                    }
                }
            }
            for (let ss = 0; ss < prj.percussions.length; ss++) {
                let channel = forOutput.channels[ss];
                let sampler = prj.percussions[ss];
                let percBar = sampler.measures[mm];
                if (percBar) {
                    for (let ski = 0; ski < percBar.skips.length; ski++) {
                        let askip = percBar.skips[ski];
                        let start = MMUtil().set(askip).duration(measure.tempo);
                        let it = { skip: start, channelId: channel.id, pitches: [], slides: [] };
                        singleSet.items.push(it);
                    }
                }
            }
            for (let ss = 0; ss < prj.tracks.length; ss++) {
                let channel = forOutput.channels[ss + prj.percussions.length];
                let track = prj.tracks[ss];
                let trackBar = track.measures[mm];
                if (trackBar) {
                    for (let ch = 0; ch < trackBar.chords.length; ch++) {
                        let chord = trackBar.chords[ch];
                        let start = MMUtil().set(chord.skip).duration(measure.tempo);
                        let it = { skip: start, channelId: channel.id, pitches: chord.pitches, slides: [] };
                        singleSet.items.push(it);
                        for (let kk = 0; kk < chord.slides.length; kk++) {
                            let one = chord.slides[kk];
                            it.slides.push({ duration: MMUtil().set(one.duration).duration(measure.tempo), delta: one.delta });
                        }
                        if (it.pitches.length < 1) {
                            console.log('empty', it);
                        }
                    }
                }
            }
        }
        return forOutput;
    }
    reConnectPluginsIfPlay() {
        if (this.player.playState().play) {
            let schedule = this.renderCurrentProjectForOutput();
            this.player.reconnectAllPlugins(schedule);
        }
    }
    reStartPlayIfPlay() {
        if (this.player.playState().play) {
            this.stopPlay();
            this.setupAndStartPlay();
        }
    }
    stopPlay() {
        this.player.cancel();
        this.renderer.menu.rerenderMenuContent(null);
        this.setHiddenTimeMark();
        this.resetProject();
    }
    setupAndStartPlay() {
        let schedule = this.renderCurrentProjectForOutput();
        let from = 0;
        let to = 0;
        if (globalCommandDispatcher.cfg().data.selectedPart.startMeasure > -1) {
            for (let nn = 0; nn <= globalCommandDispatcher.cfg().data.selectedPart.endMeasure; nn++) {
                to = to + schedule.series[nn].duration;
                if (nn < globalCommandDispatcher.cfg().data.selectedPart.startMeasure) {
                    from = to;
                }
            }
        }
        else {
            for (let nn = 0; nn < schedule.series.length; nn++) {
                to = to + schedule.series[nn].duration;
            }
        }
        let result = this.player.startSetupPlugins(this.audioContext, schedule);
        if (this.playPosition < from) {
            this.playPosition = from;
        }
        if (this.playPosition >= to) {
            this.playPosition = to;
        }
        if (result != null) {
            this.renderer.warning.showWarning('Start playing', result, 'Loading...', null);
        }
        else {
        }
        this.startPlayLoop(from, this.playPosition, to);
    }
    startPlayLoop(from, position, to) {
        console.log('startPlayLoop', from, position, to);
        let msg = this.player.startLoopTicks(from, position, to);
        if (msg) {
            console.log('startPlayLoop', msg, this.renderer.warning.noWarning);
            this.renderer.warning.showWarning('Start playing', 'Loading...', '' + msg, () => {
                console.log('cancel wait start loop');
            });
            let me = this;
            let id = setTimeout(() => {
                if (!me.renderer.warning.noWarning) {
                    me.startPlayLoop(from, position, to);
                }
            }, 1000);
        }
        else {
            this.renderer.warning.hideWarning();
            this.setVisibleTimeMark();
            this.renderer.menu.rerenderMenuContent(null);
            this.resetProject();
        }
    }
    setThemeLocale(loc, ratio) {
        console.log("setThemeLocale", loc, ratio);
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
        this.resetProject();
    }
    setThemeColor(idx) {
        let cssPath = 'theme/colordarkred.css';
        if (idx == 'green1') {
            cssPath = 'theme/colordarkgreen.css';
        }
        if (idx == 'red1') {
            cssPath = 'theme/colordarkred.css';
        }
        if (idx == 'neon1') {
            cssPath = 'theme/colorneon.css';
        }
        if (idx == 'light1') {
            cssPath = 'theme/colorlight.css';
        }
        if (idx == 'light2') {
            cssPath = 'theme/colorwhite.css';
        }
        if (idx == 'blue1') {
            cssPath = 'theme/colordarkblue.css';
        }
        if (idx == 'light3') {
            cssPath = 'theme/colorbirch.css';
        }
        startLoadCSSfile(cssPath);
        this.renderer.menu.resizeMenu(this.renderer.menu.lastWidth, this.renderer.menu.lastHeight);
        saveRawText2localStorage('uicolortheme', idx);
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
    newEmptyProject() {
        globalCommandDispatcher.exe.commitProjectChanges([], () => {
            this.registerWorkProject(createNewEmptyProjectData());
            globalCommandDispatcher.adjustTimelineContent();
        });
        this.resetProject();
    }
    resetProject() {
        try {
            this.setPlayPositionFromSelectedPart();
            this.renderer.fillWholeUI();
        }
        catch (xx) {
            console.log('resetProject', xx);
            console.log('data', this.cfg().data);
        }
    }
    findPluginRegistrationByKind(kind) {
        let list = MZXBX_currentPlugins();
        for (let ii = 0; ii < list.length; ii++) {
            if (list[ii].kind == kind) {
                return list[ii];
            }
        }
        return null;
    }
    timeSelectChange(idx) {
        if (this.player.playState().play) {
            this.playFromTimeSelection(idx);
        }
        else {
            this.expandTimeLineSelection(idx);
        }
    }
    playFromTimeSelection(idx) {
        this.stopPlay();
        console.log('last position', this.playPosition);
        this.playPosition = 0;
        this.cfg().data.selectedPart.startMeasure = -1;
        this.cfg().data.selectedPart.endMeasure = -1;
        console.log('selection', this.cfg().data.selectedPart);
        for (let mm = 0; mm < idx; mm++) {
            let measure = this.cfg().data.timeline[mm];
            let cuDuration = MMUtil().set(measure.metre).duration(measure.tempo);
            this.playPosition = this.playPosition + cuDuration;
        }
        console.log('position now', this.playPosition);
        this.renderer.timeselectbar.updateTimeSelectionBar();
        this.renderer.tiler.resetAnchor(this.renderer.timeselectbar.selectedTimeSVGGroup, this.renderer.timeselectbar.selectionAnchor, LevelModes.top);
        this.reDrawPlayPosition();
        this.setupAndStartPlay();
    }
    setupSelectionBackground22(selectedPart) {
    }
    expandTimeLineSelection(idx) {
        if (this.cfg().data) {
            if (idx >= 0 && idx < this.cfg().data.timeline.length) {
                let curPro = this.cfg().data;
                if (curPro.selectedPart.startMeasure > -1 || curPro.selectedPart.endMeasure > -1) {
                    let curProjectSelection = curPro.selectedPart;
                    if (curProjectSelection.startMeasure == curProjectSelection.endMeasure) {
                        if (curProjectSelection.startMeasure == idx) {
                            curPro.selectedPart = {
                                startMeasure: -1,
                                endMeasure: -1
                            };
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
                    curPro.selectedPart = {
                        startMeasure: idx,
                        endMeasure: idx
                    };
                }
            }
        }
        else {
            console.log('no project data');
        }
        this.setPlayPositionFromSelectedPart();
        this.reDrawPlayPosition();
        this.resetProject();
    }
    downloadBlob(blob, name) {
        let a = document.createElement('a');
        const url = URL.createObjectURL(blob);
        a.href = url;
        a.download = name;
        a.click();
        URL.revokeObjectURL(url);
    }
    exportCanvasAsFile(canvas, fileName) {
        canvas.toBlob((blobresult) => {
            globalCommandDispatcher.downloadBlob(blobresult, fileName);
        });
    }
    hideMenuByStyle() {
        this.renderer.menu.menuPanelBackground.style.visibility = 'hidden';
        this.renderer.menu.menuPanelContent.style.visibility = 'hidden';
        this.renderer.menu.menuPanelInteraction.style.visibility = 'hidden';
        this.renderer.menu.menuPanelButtons.style.visibility = 'hidden';
    }
    showMenuByStyle() {
        this.renderer.menu.menuPanelBackground.style.visibility = 'visible';
        this.renderer.menu.menuPanelContent.style.visibility = 'visible';
        this.renderer.menu.menuPanelInteraction.style.visibility = 'visible';
        this.renderer.menu.menuPanelButtons.style.visibility = 'visible';
    }
    makeTileSVGsquareCanvas(canvasSize, onDoneCanvas) {
        console.log('makeTileSVGsquareCanvas', canvasSize);
        this.hideMenuByStyle();
        let tileLevelSVG = document.getElementById('tileLevelSVG');
        let xml = encodeURIComponent(tileLevelSVG.outerHTML);
        let replaceText = '%3C!--%20css%20--%3E';
        let csscolors = colordarkred;
        let idx = readRawTextFromlocalStorage('uicolortheme');
        if (idx == 'green1') {
            csscolors = colordarkgreen;
        }
        if (idx == 'red1') {
            csscolors = colordarkred;
        }
        if (idx == 'neon1') {
            csscolors = colorneon;
        }
        if (idx == 'light1') {
            csscolors = colorlight;
        }
        if (idx == 'light2') {
            csscolors = colorwhite;
        }
        if (idx == 'blue1') {
            csscolors = colordarkblue;
        }
        if (idx == 'light3') {
            csscolors = colorbirch;
        }
        let wholeCSSstring = encodeURIComponent('<style>')
            + encodeURIComponent(styleText)
            + encodeURIComponent(' ' + csscolors)
            + encodeURIComponent('</style>');
        xml = xml.replace(replaceText, wholeCSSstring);
        var url = 'data:image/svg+xml;utf8,' + xml;
        let ratio = window.innerWidth / window.innerHeight;
        let canvas = document.createElement('canvas');
        canvas.height = canvasSize;
        canvas.width = canvasSize;
        let context = canvas.getContext('2d');
        let svgImg = new Image(window.innerWidth, window.innerHeight);
        svgImg.onload = () => {
            if (ratio > 1) {
                context.drawImage(svgImg, -0.5 * (canvasSize * ratio - canvasSize), 0, canvasSize * ratio, canvasSize);
            }
            else {
                context.drawImage(svgImg, 0, -0.5 * (canvasSize / ratio - canvasSize), canvasSize, canvasSize / ratio);
            }
            var imageData = context.getImageData(0, 0, canvasSize, canvasSize);
            var buffer = imageData.data.buffer;
            onDoneCanvas(canvas, buffer);
            this.showMenuByStyle();
        };
        svgImg.src = url;
    }
    copySelectedBars() {
        console.log('copySelectedBars');
        globalCommandDispatcher.makeTileSVGsquareCanvas(300, (canvas, buffer) => {
            globalCommandDispatcher.exportCanvasAsFile(canvas, 'testCanvasSVG.png');
        });
    }
    copySelectedBars222() {
        console.log('copySelectedBars');
        let tileLevelSVG = document.getElementById('tileLevelSVG');
        let xml = encodeURIComponent(tileLevelSVG.outerHTML);
        let replaceText = '%3C!--%20css%20--%3E';
        var url = 'data:image/svg+xml;utf8,' + xml;
        let ww = window.innerWidth;
        let hh = window.innerHeight;
        console.log(url);
        let canvas = document.createElement('canvas');
        canvas.height = hh;
        canvas.width = ww;
        let context = canvas.getContext('2d');
        let svgImg = new Image(ww, hh);
        console.log('image onload');
        context.beginPath();
        context.rect(10, 20, 150, 100);
        context.fill();
        svgImg.onload = () => {
            console.log('image onload');
            context.drawImage(svgImg, 0, 0, ww, hh);
            canvas.toBlob((blobresult) => {
                console.log('canvas toBlob');
                globalCommandDispatcher.downloadBlob(blobresult, 'canvasImage.png');
            });
        };
        console.log('image start');
        svgImg.src = url;
        console.log('image done');
    }
    moveAsideSelectedBars() {
        console.log('move aside');
    }
    readThemeColors() {
        return {
            background: window.getComputedStyle(document.documentElement).getPropertyValue('--background-color'),
            main: window.getComputedStyle(document.documentElement).getPropertyValue('--main-color'),
            drag: window.getComputedStyle(document.documentElement).getPropertyValue('--drag-color'),
            line: window.getComputedStyle(document.documentElement).getPropertyValue('--line-color'),
            click: window.getComputedStyle(document.documentElement).getPropertyValue('--click-color')
        };
    }
    mergeSelectedBars() {
        let startMeasure = globalCommandDispatcher.cfg().data.selectedPart.startMeasure;
        let endMeasure = globalCommandDispatcher.cfg().data.selectedPart.endMeasure;
        if (startMeasure > -1 && endMeasure >= startMeasure) {
            globalCommandDispatcher.exe.commitProjectChanges([], () => {
                globalCommandDispatcher.adjustTimelineContent();
                let newDuration = MMUtil().set(globalCommandDispatcher.cfg().data.timeline[startMeasure].metre);
                for (let ii = startMeasure + 1; ii <= endMeasure; ii++) {
                    for (let nn = 0; nn < globalCommandDispatcher.cfg().data.tracks.length; nn++) {
                        let trackBar = globalCommandDispatcher.cfg().data.tracks[nn].measures[ii];
                        let trackPreBar = globalCommandDispatcher.cfg().data.tracks[nn].measures[ii - 1];
                        for (let kk = 0; kk < trackBar.chords.length; kk++) {
                            trackBar.chords[kk].skip = newDuration.plus(trackBar.chords[kk].skip).metre();
                            trackPreBar.chords.push(trackBar.chords[kk]);
                        }
                        trackBar.chords = [];
                    }
                    for (let nn = 0; nn < globalCommandDispatcher.cfg().data.percussions.length; nn++) {
                        let percuBar = globalCommandDispatcher.cfg().data.percussions[nn].measures[ii];
                        let percuPreBar = globalCommandDispatcher.cfg().data.percussions[nn].measures[ii - 1];
                        for (let kk = 0; kk < percuBar.skips.length; kk++) {
                            percuBar.skips[kk] = newDuration.plus(percuBar.skips[kk]).metre();
                            percuPreBar.skips.push(percuBar.skips[kk]);
                        }
                        percuBar.skips = [];
                    }
                    for (let nn = 0; nn < globalCommandDispatcher.cfg().data.filters.length; nn++) {
                        let autoBar = globalCommandDispatcher.cfg().data.filters[nn].automation[ii];
                        let autoPreBar = globalCommandDispatcher.cfg().data.filters[nn].automation[ii - 1];
                        for (let kk = 0; kk < autoBar.changes.length; kk++) {
                            autoBar.changes[kk].skip = newDuration.plus(autoBar.changes[kk].skip).metre();
                            autoPreBar.changes.push(autoBar.changes[kk]);
                        }
                        autoBar.changes = [];
                    }
                    let txtBar = globalCommandDispatcher.cfg().data.comments[ii];
                    let txtPreBar = globalCommandDispatcher.cfg().data.comments[ii - 1];
                    for (let kk = 0; kk < txtBar.points.length; kk++) {
                        txtBar.points[kk].skip = newDuration.plus(txtBar.points[kk].skip).metre();
                        txtPreBar.points.push(txtBar.points[kk]);
                    }
                    txtBar.points = [];
                    newDuration = newDuration.plus(globalCommandDispatcher.cfg().data.timeline[ii].metre);
                }
                globalCommandDispatcher.cfg().data.timeline[startMeasure].metre = newDuration.metre();
                globalCommandDispatcher.adjustTimelineContent();
                globalCommandDispatcher.cfg().data.selectedPart.endMeasure = globalCommandDispatcher.cfg().data.selectedPart.startMeasure;
            });
            globalCommandDispatcher.resetProject();
        }
    }
    calculateRealTrackFarOrder() {
        let realOrder = this.cfg().data.farorder.map((it) => it);
        let trcnt = this.cfg().data.tracks.length;
        for (let ii = 0; ii < trcnt; ii++) {
            if (realOrder.indexOf(ii) < 0) {
                realOrder.push(ii);
            }
        }
        return realOrder.filter((it) => it >= 0 && it < trcnt);
    }
    dropSelectedBars() {
        let startMeasure = globalCommandDispatcher.cfg().data.selectedPart.startMeasure;
        let endMeasure = globalCommandDispatcher.cfg().data.selectedPart.endMeasure;
        let count = endMeasure - startMeasure + 1;
        if (count >= globalCommandDispatcher.cfg().data.timeline.length) {
            count = globalCommandDispatcher.cfg().data.timeline.length - 1;
        }
        if (startMeasure > -1 && count > 0) {
            console.log('start delete', startMeasure, endMeasure, globalCommandDispatcher.cfg().data.timeline.length);
            globalCommandDispatcher.exe.commitProjectChanges([], () => {
                globalCommandDispatcher.adjustTimelineContent();
                for (let ii = 0; ii < count; ii++) {
                    globalCommandDispatcher.cfg().data.timeline.splice(startMeasure, 1);
                    for (let nn = 0; nn < globalCommandDispatcher.cfg().data.tracks.length; nn++) {
                        let track = globalCommandDispatcher.cfg().data.tracks[nn];
                        track.measures.splice(startMeasure, 1);
                    }
                    for (let nn = 0; nn < globalCommandDispatcher.cfg().data.percussions.length; nn++) {
                        let percu = globalCommandDispatcher.cfg().data.percussions[nn];
                        percu.measures.splice(startMeasure, 1);
                    }
                    for (let nn = 0; nn < globalCommandDispatcher.cfg().data.filters.length; nn++) {
                        let filter = globalCommandDispatcher.cfg().data.filters[nn];
                        filter.automation.splice(startMeasure, 1);
                    }
                    globalCommandDispatcher.cfg().data.comments.splice(startMeasure, 1);
                }
                globalCommandDispatcher.adjustTimelineContent();
                globalCommandDispatcher.cfg().data.selectedPart.startMeasure = -1;
                globalCommandDispatcher.cfg().data.selectedPart.endMeasure = -1;
            });
            globalCommandDispatcher.resetProject();
            console.log('end delete', startMeasure, endMeasure, globalCommandDispatcher.cfg().data.timeline.length);
        }
    }
    insertAfterSelectedBars() {
        let startMeasure = globalCommandDispatcher.cfg().data.selectedPart.startMeasure;
        let endMeasure = globalCommandDispatcher.cfg().data.selectedPart.endMeasure;
        let count = endMeasure - startMeasure + 1;
        if (count >= globalCommandDispatcher.cfg().data.timeline.length) {
            count = globalCommandDispatcher.cfg().data.timeline.length - 1;
        }
        if (startMeasure > -1 && count > 0) {
            globalCommandDispatcher.exe.commitProjectChanges([], () => {
                globalCommandDispatcher.adjustTimelineContent();
                for (let ii = 0; ii < count; ii++) {
                    let fromBar = globalCommandDispatcher.cfg().data.timeline[startMeasure + ii];
                    globalCommandDispatcher.cfg().data.timeline.splice(startMeasure + count + ii, 0, {
                        tempo: fromBar.tempo,
                        metre: { count: fromBar.metre.count, part: fromBar.metre.part }
                    });
                    for (let nn = 0; nn < globalCommandDispatcher.cfg().data.tracks.length; nn++) {
                        let track = globalCommandDispatcher.cfg().data.tracks[nn];
                        track.measures.splice(startMeasure + count + ii, 0, { chords: [] });
                    }
                    for (let nn = 0; nn < globalCommandDispatcher.cfg().data.percussions.length; nn++) {
                        let percu = globalCommandDispatcher.cfg().data.percussions[nn];
                        percu.measures.splice(startMeasure + count + ii, 0, { skips: [] });
                    }
                    for (let nn = 0; nn < globalCommandDispatcher.cfg().data.filters.length; nn++) {
                        let filter = globalCommandDispatcher.cfg().data.filters[nn];
                        filter.automation.splice(startMeasure + count + ii, 0, { changes: [] });
                    }
                    globalCommandDispatcher.cfg().data.comments.splice(startMeasure + count + ii, 0, { points: [] });
                }
                globalCommandDispatcher.adjustTimelineContent();
                globalCommandDispatcher.cfg().data.selectedPart.endMeasure = globalCommandDispatcher.cfg().data.selectedPart.startMeasure + count * 2 - 1;
            });
            globalCommandDispatcher.resetProject();
        }
    }
    promptTempoForSelectedBars() {
        let startMeasure = globalCommandDispatcher.cfg().data.selectedPart.startMeasure;
        let endMeasure = globalCommandDispatcher.cfg().data.selectedPart.endMeasure;
        let count = endMeasure - startMeasure + 1;
        if (count >= globalCommandDispatcher.cfg().data.timeline.length) {
            count = globalCommandDispatcher.cfg().data.timeline.length - 1;
        }
        if (startMeasure > -1 && count > 0) {
            let oldTempo = Math.round(globalCommandDispatcher.cfg().data.timeline[startMeasure].tempo);
            let txt = prompt('Tempo', '' + oldTempo);
            if (txt) {
                let newTempo = parseInt(txt);
                if (newTempo > 20 && newTempo < 400) {
                    globalCommandDispatcher.exe.commitProjectChanges([], () => {
                        globalCommandDispatcher.adjustTimelineContent();
                        for (let ii = 0; ii < count; ii++) {
                            globalCommandDispatcher.cfg().data.timeline[startMeasure + ii].tempo = newTempo;
                        }
                        globalCommandDispatcher.adjustTimelineContent();
                    });
                    globalCommandDispatcher.resetProject();
                }
            }
        }
    }
    promptMeterForSelectedBars() {
        let startMeasure = globalCommandDispatcher.cfg().data.selectedPart.startMeasure;
        let endMeasure = globalCommandDispatcher.cfg().data.selectedPart.endMeasure;
        let count = endMeasure - startMeasure + 1;
        if (count >= globalCommandDispatcher.cfg().data.timeline.length) {
            count = globalCommandDispatcher.cfg().data.timeline.length - 1;
        }
        if (startMeasure > -1 && count > 0) {
            let oldMeter = '' + globalCommandDispatcher.cfg().data.timeline[startMeasure].metre.count + '/' + globalCommandDispatcher.cfg().data.timeline[startMeasure].metre.part;
            let txt = prompt('Metre', '' + oldMeter);
            if (txt) {
                let newpart = parseInt(txt.split('/')[1]);
                let newcount = parseInt(txt.split('/')[0]);
                if (newpart == 1 || newpart == 2 || newpart == 4 || newpart == 8 || newpart == 16 || newpart == 32) {
                    let newMeter = MMUtil().set({ count: newcount, part: newpart });
                    globalCommandDispatcher.exe.commitProjectChanges([], () => {
                        globalCommandDispatcher.adjustTimelineContent();
                        for (let ii = 0; ii < count; ii++) {
                            let bar = globalCommandDispatcher.cfg().data.timeline[startMeasure + ii];
                            if (newMeter.less(bar.metre)) {
                                globalCommandDispatcher.cfg().data.timeline.splice(startMeasure + ii + 1, 0, {
                                    tempo: bar.tempo,
                                    metre: MMUtil().set(bar.metre).minus(newMeter).metre()
                                });
                                for (let nn = 0; nn < globalCommandDispatcher.cfg().data.tracks.length; nn++) {
                                    let track = globalCommandDispatcher.cfg().data.tracks[nn];
                                    track.measures.splice(startMeasure + ii + 1, 0, { chords: [] });
                                }
                                for (let nn = 0; nn < globalCommandDispatcher.cfg().data.percussions.length; nn++) {
                                    let percu = globalCommandDispatcher.cfg().data.percussions[nn];
                                    percu.measures.splice(startMeasure + ii + 1, 0, { skips: [] });
                                }
                                for (let nn = 0; nn < globalCommandDispatcher.cfg().data.filters.length; nn++) {
                                    let filter = globalCommandDispatcher.cfg().data.filters[nn];
                                    filter.automation.splice(startMeasure + ii + 1, 0, { changes: [] });
                                }
                                globalCommandDispatcher.cfg().data.comments.splice(startMeasure + ii + 1, 0, { points: [] });
                                ii++;
                                globalCommandDispatcher.cfg().data.selectedPart.endMeasure++;
                            }
                            bar.metre = newMeter.metre();
                        }
                        globalCommandDispatcher.adjustTimelineContent();
                    });
                    globalCommandDispatcher.resetProject();
                }
            }
        }
    }
    setPlayPositionFromSelectedPart() {
        if (this.cfg().data.selectedPart.startMeasure >= 0) {
            this.playPosition = 0;
            for (let mm = 0; mm < this.cfg().data.selectedPart.startMeasure; mm++) {
                let measure = this.cfg().data.timeline[mm];
                let cuDuration = MMUtil().set(measure.metre).duration(measure.tempo);
                this.playPosition = this.playPosition + cuDuration;
            }
        }
    }
    rollTracksClick(left, top) {
        let zz = this.renderer.tiler.getCurrentPointPosition().z;
        if (zz < 64) {
            let centerPitch = (globalCommandDispatcher.cfg().gridTop() + globalCommandDispatcher.cfg().gridHeight() - top) - 3.5 - 12;
            let upper = Math.round(centerPitch + zz / 3);
            let lower = Math.round(centerPitch - zz / 3);
            let barStart = 0;
            let areaTrack = [];
            for (let ii = 0; ii < this.cfg().data.timeline.length; ii++) {
                let bar = this.cfg().data.timeline[ii];
                let barWidth = MMUtil().set(bar.metre).duration(bar.tempo) * this.cfg().widthDurationRatio;
                if (barStart + barWidth > left) {
                    let clickBarNo = ii;
                    let leftSelect = left - 0.5 * zz - barStart;
                    let rightSelect = left + 0.5 * zz - barStart;
                    for (let tt = 0; tt < globalCommandDispatcher.cfg().data.tracks.length; tt++) {
                        let track = globalCommandDispatcher.cfg().data.tracks[tt];
                        let measure = track.measures[clickBarNo];
                        for (let cc = 0; cc < measure.chords.length; cc++) {
                            let chord = measure.chords[cc];
                            let skipStart = MMUtil().set(chord.skip).duration(bar.tempo) * this.cfg().widthDurationRatio;
                            let chordWidth = 0;
                            for (let ss = 0; ss < chord.slides.length; ss++) {
                                chordWidth = chordWidth + MMUtil().set(chord.slides[ss].duration).duration(bar.tempo) * this.cfg().widthDurationRatio;
                            }
                            if (skipStart <= rightSelect && skipStart + chordWidth >= leftSelect) {
                                for (let pp = 0; pp < chord.pitches.length; pp++) {
                                    let pitch = chord.pitches[pp];
                                    if (pitch <= upper && pitch >= lower) {
                                        if (areaTrack.indexOf(tt) < 0) {
                                            areaTrack.push(tt);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    break;
                }
                else {
                    barStart = barStart + barWidth;
                }
            }
            let farorder = this.calculateRealTrackFarOrder();
            let pairs = [];
            let mostDistantIdx = farorder.length - 1;
            for (let ii = 0; ii < farorder.length; ii++) {
                let trackIdx = farorder[ii];
                if (areaTrack.indexOf(trackIdx) > -1) {
                    pairs.push({ far: ii, track: farorder[ii] });
                }
            }
            if (pairs.length > 0) {
                if (pairs[pairs.length - 1].far > 0) {
                    mostDistantIdx = pairs[pairs.length - 1].far;
                }
            }
            globalCommandDispatcher.exe.commitProjectChanges(['farorder'], () => {
                let farorder = globalCommandDispatcher.calculateRealTrackFarOrder();
                let nn = farorder.splice(mostDistantIdx, 1)[0];
                farorder.splice(0, 0, nn);
                globalCommandDispatcher.cfg().data.farorder = farorder;
            });
        }
    }
    adjustTimeLineLength() {
        console.log('adjustTimeLineLength');
        if (this.cfg().data.timeline.length > 1) {
            if (!(this.cfg().data.timeline[this.cfg().data.timeline.length - 1])) {
                this.cfg().data.timeline.length = this.cfg().data.timeline.length - 1;
            }
        }
        if (this.cfg().data.timeline.length > 1) {
            if (!(this.cfg().data.timeline[this.cfg().data.timeline.length - 1])) {
                this.cfg().data.timeline.length = this.cfg().data.timeline.length - 1;
            }
        }
        if (this.cfg().data.timeline.length > 1) {
            if (!(this.cfg().data.timeline[this.cfg().data.timeline.length - 1])) {
                this.cfg().data.timeline.length = this.cfg().data.timeline.length - 1;
            }
        }
        for (let tt = 0; tt < this.cfg().data.timeline.length; tt++) {
            for (let nn = 0; nn < this.cfg().data.tracks.length; nn++) {
                let track = this.cfg().data.tracks[nn];
                if (!(track.measures[tt])) {
                    track.measures[tt] = { chords: [] };
                }
            }
            for (let nn = 0; nn < this.cfg().data.percussions.length; nn++) {
                let percu = this.cfg().data.percussions[nn];
                if (!(percu.measures[tt])) {
                    percu.measures[tt] = { skips: [] };
                }
            }
            for (let nn = 0; nn < this.cfg().data.filters.length; nn++) {
                let filter = this.cfg().data.filters[nn];
                if (!(filter.automation[tt])) {
                    filter.automation[tt] = { changes: [] };
                }
            }
            if (!(this.cfg().data.comments[tt])) {
                this.cfg().data.comments[tt] = { points: [] };
            }
        }
        for (let nn = 0; nn < this.cfg().data.tracks.length; nn++) {
            this.cfg().data.tracks[nn].measures.length = this.cfg().data.timeline.length;
        }
        for (let nn = 0; nn < this.cfg().data.percussions.length; nn++) {
            this.cfg().data.percussions[nn].measures.length = this.cfg().data.timeline.length;
        }
        for (let nn = 0; nn < this.cfg().data.filters.length; nn++) {
            this.cfg().data.filters[nn].automation.length = this.cfg().data.timeline.length;
        }
        this.cfg().data.comments.length = this.cfg().data.timeline.length;
    }
    adjustRemoveEmptyChords() {
        for (let nn = 0; nn < this.cfg().data.tracks.length; nn++) {
            let track = this.cfg().data.tracks[nn];
            for (let mm = 0; mm < track.measures.length; mm++) {
                let trackMeasure = track.measures[mm];
                for (let cc = 0; cc < trackMeasure.chords.length; cc++) {
                    let chord = trackMeasure.chords[cc];
                    if (chord.pitches.length) {
                    }
                    else {
                        trackMeasure.chords.splice(cc, 1);
                        cc--;
                    }
                }
            }
        }
    }
    appendBar() {
        this.cfg().data.timeline.push({
            tempo: this.cfg().data.timeline[this.cfg().data.timeline.length - 1].tempo,
            metre: {
                count: this.cfg().data.timeline[this.cfg().data.timeline.length - 1].metre.count,
                part: this.cfg().data.timeline[this.cfg().data.timeline.length - 1].metre.part
            }
        });
        this.adjustTimeLineLength();
    }
    slidesEquals(a1, a2) {
        if (a1.length == a2.length) {
            for (let ii = 0; ii < a1.length; ii++) {
                if (Math.abs(a1[ii].delta - a2[ii].delta) < 0.005) {
                }
                else {
                    return false;
                }
            }
            return true;
        }
        return false;
    }
    adjustMergeChordByTime(trackBar) {
        let mergedChords = [];
        for (let kk = 0; kk < trackBar.chords.length; kk++) {
            let checkChord = trackBar.chords[kk];
            let xsts = false;
            for (let mm = 0; mm < mergedChords.length; mm++) {
                let existedChord = mergedChords[mm];
                if (MMUtil().set(existedChord.skip).equals(checkChord.skip) && this.slidesEquals(existedChord.slides, checkChord.slides)) {
                    xsts = true;
                    let pitchcount = checkChord.pitches.length;
                    for (let pp = 0; pp < pitchcount; pp++) {
                        let pitch = checkChord.pitches[pp];
                        if (existedChord.pitches.indexOf(pitch) == -1) {
                            existedChord.pitches.push(pitch);
                            checkChord.pitches.splice(pp, 1);
                            pp--;
                            pitchcount--;
                        }
                    }
                    break;
                }
            }
            if (!xsts) {
                mergedChords.push(checkChord);
            }
        }
    }
    adjustTracksChords() {
        for (let nn = 0; nn < this.cfg().data.tracks.length; nn++) {
            for (let ii = 0; ii < this.cfg().data.timeline.length; ii++) {
                let barMetre = MMUtil().set(this.cfg().data.timeline[ii].metre);
                let trackBar = this.cfg().data.tracks[nn].measures[ii];
                for (let kk = 0; kk < trackBar.chords.length; kk++) {
                    let chord = trackBar.chords[kk];
                    if (barMetre.less(chord.skip)) {
                        if (ii >= this.cfg().data.timeline.length) {
                        }
                        chord.skip = MMUtil().set(chord.skip).minus(barMetre).simplyfy().metre();
                        this.cfg().data.tracks[nn].measures[ii + 1].chords.push(chord);
                        trackBar.chords.splice(kk, 1);
                        kk--;
                    }
                    else {
                        if (chord.skip.count < 0) {
                            if (ii > 0) {
                                let preMetre = MMUtil().set(this.cfg().data.timeline[ii - 1].metre);
                                chord.skip = preMetre.plus(chord.skip).simplyfy().metre();
                                this.cfg().data.tracks[nn].measures[ii - 1].chords.push(chord);
                            }
                            trackBar.chords.splice(kk, 1);
                            kk--;
                        }
                    }
                }
            }
        }
        for (let nn = 0; nn < this.cfg().data.tracks.length; nn++) {
            for (let ii = 0; ii < this.cfg().data.timeline.length; ii++) {
                let trackBar = this.cfg().data.tracks[nn].measures[ii];
                this.adjustMergeChordByTime(trackBar);
            }
        }
    }
    adjustSamplerSkips() {
        for (let ii = 0; ii < this.cfg().data.timeline.length; ii++) {
            let barMetre = MMUtil().set(this.cfg().data.timeline[ii].metre);
            for (let nn = 0; nn < this.cfg().data.percussions.length; nn++) {
                let percuBar = this.cfg().data.percussions[nn].measures[ii];
                for (let kk = 0; kk < percuBar.skips.length; kk++) {
                    if (barMetre.less(percuBar.skips[kk])) {
                        if (ii >= this.cfg().data.timeline.length) {
                            this.appendBar();
                            this.cfg().data.percussions[nn].measures.push({ skips: [] });
                        }
                        percuBar.skips[kk] = MMUtil().set(percuBar.skips[kk]).minus(barMetre).simplyfy();
                        this.cfg().data.percussions[nn].measures[ii + 1].skips.push(percuBar.skips[kk]);
                        percuBar.skips.splice(kk, 1);
                        kk--;
                    }
                    else {
                        if (percuBar.skips[kk].count < 0) {
                            if (ii > 0) {
                                let preMetre = MMUtil().set(this.cfg().data.timeline[ii - 1].metre);
                                percuBar.skips[kk] = preMetre.plus(percuBar.skips[kk]).simplyfy();
                                this.cfg().data.percussions[nn].measures[ii - 1].skips.push(percuBar.skips[kk]);
                            }
                            percuBar.skips.splice(kk, 1);
                            kk--;
                        }
                    }
                }
            }
        }
    }
    adjustAutoPoints() {
        for (let ii = 0; ii < this.cfg().data.timeline.length; ii++) {
            let barMetre = MMUtil().set(this.cfg().data.timeline[ii].metre);
            for (let nn = 0; nn < this.cfg().data.filters.length; nn++) {
                let autoBar = this.cfg().data.filters[nn].automation[ii];
                for (let kk = 0; kk < autoBar.changes.length; kk++) {
                    if (barMetre.less(autoBar.changes[kk].skip)) {
                        if (ii >= this.cfg().data.timeline.length) {
                            this.appendBar();
                            this.cfg().data.filters[nn].automation.push({ changes: [] });
                        }
                        autoBar.changes[kk].skip = MMUtil().set(autoBar.changes[kk].skip).minus(barMetre).simplyfy().metre();
                        this.cfg().data.percussions[nn].measures[ii + 1].skips.push(autoBar.changes[kk].skip);
                        autoBar.changes.splice(kk, 1);
                        kk--;
                    }
                    else {
                        if (autoBar.changes[kk].skip.count < 0) {
                            if (ii > 0) {
                                let preMetre = MMUtil().set(this.cfg().data.timeline[ii - 1].metre);
                                autoBar.changes[kk].skip = preMetre.plus(autoBar.changes[kk].skip).simplyfy().metre();
                                this.cfg().data.percussions[nn].measures[ii - 1].skips.push(autoBar.changes[kk].skip);
                            }
                            autoBar.changes.splice(kk, 1);
                            kk--;
                        }
                    }
                }
            }
        }
    }
    adjustLyricsPoints() {
        for (let ii = 0; ii < this.cfg().data.timeline.length; ii++) {
            let barMetre = MMUtil().set(this.cfg().data.timeline[ii].metre);
            let txtBar = this.cfg().data.comments[ii];
            for (let kk = 0; kk < txtBar.points.length; kk++) {
                if (barMetre.less(txtBar.points[kk].skip)) {
                    if (ii >= this.cfg().data.timeline.length) {
                        this.appendBar();
                        this.cfg().data.comments.push({ points: [] });
                    }
                    txtBar.points[kk].skip = MMUtil().set(txtBar.points[kk].skip).minus(barMetre).simplyfy().metre();
                    this.cfg().data.comments[ii + 1].points.push(txtBar.points[kk]);
                    txtBar.points.splice(kk, 1);
                    kk--;
                }
                else {
                    if (txtBar.points[kk].skip.count < 0) {
                        if (ii > 0) {
                            let preMetre = MMUtil().set(this.cfg().data.timeline[ii - 1].metre);
                            txtBar.points[kk].skip = preMetre.plus(txtBar.points[kk].skip).simplyfy().metre();
                            this.cfg().data.comments[ii - 1].points.push(txtBar.points[kk]);
                        }
                        txtBar.points.splice(kk, 1);
                        kk--;
                    }
                }
            }
        }
    }
    adjustTimelineContent() {
        console.log('adjustTimelineContent');
        this.adjustTimeLineLength();
        this.adjustTracksChords();
        this.adjustRemoveEmptyChords();
        this.adjustSamplerSkips();
        this.adjustAutoPoints();
        this.adjustLyricsPoints();
        this.adjustTimeLineLength();
    }
}
let globalCommandDispatcher = new CommandDispatcher();
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
    { prefix: '025', minZoom: 0.25, gridLines: gridLinesExplicit, iconRatio: 1 },
    { prefix: '05', minZoom: 0.5, gridLines: gridLinesDtailed, iconRatio: 1.25 },
    { prefix: '1', minZoom: 1, gridLines: gridLinesAccurate, iconRatio: 1.5 },
    { prefix: '2', minZoom: 2, gridLines: gridLinesBrief, iconRatio: 1.75 },
    { prefix: '4', minZoom: 4, gridLines: [], iconRatio: 2 },
    { prefix: '8', minZoom: 8, gridLines: [], iconRatio: 2.25 },
    { prefix: '16', minZoom: 16, gridLines: [], iconRatio: 2.5 },
    { prefix: '32', minZoom: 32, gridLines: [], iconRatio: 2.75 },
    { prefix: '64', minZoom: 64, gridLines: [], iconRatio: 3 },
    { prefix: '128', minZoom: 128, gridLines: [], iconRatio: 3.25 },
    { prefix: '128', minZoom: 256, gridLines: [], iconRatio: 3.25 },
    { prefix: '128', minZoom: 512, gridLines: [], iconRatio: 3.25 }
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
        globalCommandDispatcher.reDrawPlayPosition();
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
let localMenuNewEmptyProject = 'localMenuNewEmptyProject';
let localMenuItemSettings = 'localMenuItemSettings';
let localMenuPercussionFolder = 'localMenuPercussionFolder';
let localMenuAutomationFolder = 'localMenuAutomationFolder';
let localMenuPlay = 'localMenuPlay';
let localMenuPause = 'localMenuPause';
let localMenuUndo = 'localMenuUndo';
let localMenuRedo = 'localMenuRedo';
let localMenuClearUndoRedo = 'localMenuClearUndoRedo';
let localDropInsTrack = 'localDropInsTrack';
let localDropSampleTrack = 'localDropSampleTrack';
let localDropFilterTrack = 'localDropFilterTrack';
let localDropFilterPoint = 'localDropFilterPoint';
let localMenuActionsFolder = 'localMenuActionsFolder';
let localMenuPerformersFolder = 'localMenuPerformersFolder';
let localMenuFiltersFolder = 'localMenuFiltersFolder';
let localMenuSamplersFolder = 'localMenuSamplersFolder';
let localMenuInsTracksFolder = 'localMenuInsTracksFolder';
let localMenuDrumTracksFolder = 'localMenuDrumTracksFolder';
let localMenuFxTracksFolder = 'localMenuFxTracksFolder';
let localMenuNewPlugin = 'localMenuNewPlugin';
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
    },
    {
        id: localMenuPercussionFolder, data: [
            { locale: 'en', text: 'Sampler' },
            { locale: 'ru', text: 'Сэмплер' },
            { locale: 'zh', text: '?' }
        ]
    },
    { id: localMenuNewEmptyProject, data: [{ locale: 'en', text: 'New empty project' }, { locale: 'ru', text: 'Новый проект' }, { locale: 'zh', text: 'тew' }] },
    {
        id: localMenuAutomationFolder, data: [
            { locale: 'en', text: 'Automation' },
            { locale: 'ru', text: 'Автоматизация' },
            { locale: 'zh', text: '?' }
        ]
    }, {
        id: localMenuPlay, data: [
            { locale: 'en', text: 'Play' },
            { locale: 'ru', text: 'Старт' },
            { locale: 'zh', text: '?' }
        ]
    }, {
        id: localMenuPause, data: [
            { locale: 'en', text: 'Pause' },
            { locale: 'ru', text: 'Стоп' },
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
        id: localMenuNewPlugin, data: [
            { locale: 'en', text: 'Add new item to the mixer' },
            { locale: 'ru', text: 'Добавить дорожку' },
            { locale: 'zh', text: '?' }
        ]
    }, {
        id: localMenuInsTracksFolder, data: [
            { locale: 'en', text: 'Performers' },
            { locale: 'ru', text: 'Перформеры' },
            { locale: 'zh', text: '?' }
        ]
    }, {
        id: localMenuFxTracksFolder, data: [
            { locale: 'en', text: 'Filters' },
            { locale: 'ru', text: 'Фильтры' },
            { locale: 'zh', text: '?' }
        ]
    }, {
        id: localMenuDrumTracksFolder, data: [
            { locale: 'en', text: 'Samplers' },
            { locale: 'ru', text: 'Сэмплеры' },
            { locale: 'zh', text: '?' }
        ]
    }, {
        id: localMenuUndo, data: [
            { locale: 'en', text: 'Undo' },
            { locale: 'ru', text: 'Вернуть' },
            { locale: 'zh', text: '?' }
        ]
    },
    {
        id: localMenuRedo, data: [
            { locale: 'en', text: 'Redo' },
            { locale: 'ru', text: 'Повторить' },
            { locale: 'zh', text: '?' }
        ]
    },
    {
        id: localMenuClearUndoRedo, data: [
            { locale: 'en', text: 'Clear Undo queue' },
            { locale: 'ru', text: 'Очистить очередь действий' },
            { locale: 'zh', text: '?' }
        ]
    }
];
function setLocaleID(loname, ratio) {
    labelLocaleDictionary = loname;
    localeFontRatio = ratio;
    saveRawText2localStorage('uilocale', loname);
    saveRawText2localStorage('uiratio', '' + ratio);
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
            minZoom: zoomPrefixLevelsCSS[0].minZoom,
            beforeZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom,
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
            minZoom: zoomPrefixLevelsCSS[0].minZoom,
            beforeZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom,
            content: [this.selectionMark]
        };
        this.selectedTimeLayer = {
            g: this.selectedTimeSVGGroup, anchors: [this.selectionAnchor], mode: LevelModes.top
        };
        this.positionTimeSVGGroup = document.getElementById("timepositionmark");
        this.positionTimeMark = {
            x: 0,
            y: 0,
            w: this.positionMarkWidth(),
            h: 11,
            css: 'positionTimeMarkHide'
        };
        this.positionTimeAnchor = {
            xx: 0, yy: 0, ww: 1, hh: 1,
            minZoom: zoomPrefixLevelsCSS[0].minZoom,
            beforeZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom,
            content: [this.positionTimeMark]
        };
        this.positionTimeLayer = {
            g: this.positionTimeSVGGroup, anchors: [this.positionTimeAnchor], mode: LevelModes.top
        };
        return [this.selectionBarLayer, this.selectedTimeLayer, this.positionTimeLayer];
    }
    positionMarkWidth() {
        let zz = globalCommandDispatcher.renderer.tiler.getCurrentPointPosition().z;
        let ww = zz * 2;
        return ww;
    }
    resizeTimeScale(viewWidth, viewHeight) {
        let ww = 0.001;
        if ((globalCommandDispatcher.player) && (globalCommandDispatcher.player.playState().play)) {
            ww = this.positionMarkWidth();
        }
        this.positionTimeMark.w = ww;
        this.positionTimeAnchor.ww = viewWidth * 1024;
        this.positionTimeAnchor.hh = viewHeight * 1024;
        this.positionTimeMark.h = viewHeight * 1024;
        this.selectionAnchor.ww = viewWidth * 1024;
        this.selectionAnchor.hh = viewHeight * 1024;
        this.selectionMark.h = viewHeight * 1024;
    }
    updateTimeSelectionBar() {
        let selection = globalCommandDispatcher.cfg().data.selectedPart;
        if (selection.startMeasure > -1 || selection.endMeasure > -1) {
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
            this.selectionMark.x = 0;
            this.selectionMark.w = 0.0005;
        }
    }
    createBarMark(barIdx, barLeft, size, measureAnchor, zz) {
        let mark = {
            x: barLeft, y: 0, w: size, h: size,
            rx: size / 2, ry: size / 2,
            css: 'timeMarkButtonCircle' + zoomPrefixLevelsCSS[zz].prefix,
            activation: (x, y) => {
                let toIdx = barIdx;
                if (zz > 4) {
                    if (globalCommandDispatcher.cfg().data.selectedPart.startMeasure < barIdx
                        && globalCommandDispatcher.cfg().data.selectedPart.startMeasure > -1
                        && globalCommandDispatcher.cfg().data.selectedPart.startMeasure == globalCommandDispatcher.cfg().data.selectedPart.endMeasure) {
                        toIdx = barIdx - 1;
                    }
                }
                else {
                }
                globalCommandDispatcher.timeSelectChange(toIdx);
            }
        };
        measureAnchor.content.push(mark);
    }
    createBarNumber(barLeft, barnum, zz, curBar, measureAnchor, barTime, size) {
        let mins = Math.floor(barTime / 60);
        let secs = Math.floor(barTime % 60);
        let hunds = barTime - Math.floor(barTime);
        hunds = hunds * 100;
        hunds = Math.floor(hunds);
        let nm = {
            x: barLeft + size / 4,
            y: zoomPrefixLevelsCSS[zz].minZoom * 1,
            text: '' + (1 + barnum) + ':' + mins + '\'' + (secs > 9 ? '' : '0') + secs + '.' + hunds,
            css: 'timeBarNum' + zoomPrefixLevelsCSS[zz].prefix
        };
        measureAnchor.content.push(nm);
        let bpm = {
            x: barLeft + size / 4,
            y: zoomPrefixLevelsCSS[zz].minZoom * 2,
            text: '' + Math.round(curBar.tempo) + ': ' + curBar.metre.count + '/' + curBar.metre.part,
            css: 'timeBarInfo' + zoomPrefixLevelsCSS[zz].prefix
        };
        measureAnchor.content.push(bpm);
    }
    addSelectionMenuButton(label, left, order, zz, selectLevelAnchor, labelCSS, action) {
        let size = zoomPrefixLevelsCSS[zz].minZoom * 1.5;
        let opt1 = {
            x: left,
            y: (size * 1.1) * order,
            w: size,
            h: size,
            rx: size / 2,
            ry: size / 2,
            css: 'timeMarkButtonCircle' + zoomPrefixLevelsCSS[zz].prefix,
            activation: action
        };
        selectLevelAnchor.content.push(opt1);
        let nm = {
            x: left + size * 10 / 33,
            y: (size * 1.1) * order + size * 30 / 43,
            text: label,
            css: labelCSS + zoomPrefixLevelsCSS[zz].prefix
        };
        selectLevelAnchor.content.push(nm);
    }
    fillSelectionMenu(zz, selectLevelAnchor) {
        if (globalCommandDispatcher.cfg().data.selectedPart.startMeasure > -1) {
            let left = globalCommandDispatcher.cfg().leftPad;
            for (let ii = 0; ii < globalCommandDispatcher.cfg().data.selectedPart.startMeasure; ii++) {
                let curBar = globalCommandDispatcher.cfg().data.timeline[ii];
                let curMeasureMeter = MMUtil().set(curBar.metre);
                let barWidth = curMeasureMeter.duration(curBar.tempo) * globalCommandDispatcher.cfg().widthDurationRatio;
                left = left + barWidth;
            }
            let tempoLabel = '' + Math.round(globalCommandDispatcher.cfg().data.timeline[globalCommandDispatcher.cfg().data.selectedPart.startMeasure].tempo);
            let meterLabel = '' + globalCommandDispatcher.cfg().data.timeline[globalCommandDispatcher.cfg().data.selectedPart.startMeasure].metre.count
                + '/' + globalCommandDispatcher.cfg().data.timeline[globalCommandDispatcher.cfg().data.selectedPart.startMeasure].metre.part;
        }
    }
    fillTimeBar() {
        this.selectBarAnchor.ww = globalCommandDispatcher.cfg().wholeWidth();
        this.selectBarAnchor.hh = globalCommandDispatcher.cfg().wholeHeight();
        this.zoomAnchors = [];
        for (let zz = 0; zz < zoomPrefixLevelsCSS.length - 1; zz++) {
            let selectLevelAnchor = {
                minZoom: zoomPrefixLevelsCSS[zz].minZoom,
                beforeZoom: zoomPrefixLevelsCSS[zz + 1].minZoom,
                xx: 0, yy: 0, ww: globalCommandDispatcher.cfg().wholeWidth(), hh: globalCommandDispatcher.cfg().wholeHeight(), content: [],
                id: 'time' + (zz + Math.random())
            };
            this.zoomAnchors.push(selectLevelAnchor);
            let mm = MMUtil();
            let barLeft = globalCommandDispatcher.cfg().leftPad;
            let barTime = 0;
            for (let kk = 0; kk < globalCommandDispatcher.cfg().data.timeline.length; kk++) {
                let curBar = globalCommandDispatcher.cfg().data.timeline[kk];
                if (curBar) {
                    let curMeasureMeter = mm.set(curBar.metre);
                    let barWidth = curMeasureMeter.duration(curBar.tempo) * globalCommandDispatcher.cfg().widthDurationRatio;
                    let measureAnchor = {
                        minZoom: zoomPrefixLevelsCSS[zz].minZoom,
                        beforeZoom: zoomPrefixLevelsCSS[zz + 1].minZoom,
                        xx: barLeft, yy: 0, ww: barWidth, hh: 1234, content: [],
                        id: 'measure' + (kk + Math.random())
                    };
                    selectLevelAnchor.content.push(measureAnchor);
                    if ((zz <= 4) || (zz == 5 && kk % 2 == 0) || (zz == 6 && kk % 4 == 0) || (zz == 7 && kk % 8 == 0) || (zz == 8 && kk % 16 == 0)) {
                        this.createBarMark(kk, barLeft, zoomPrefixLevelsCSS[zz].minZoom * 1.5, measureAnchor, zz);
                        this.createBarNumber(barLeft, kk, zz, curBar, measureAnchor, barTime, zoomPrefixLevelsCSS[zz].minZoom * 1.5);
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
            this.fillSelectionMenu(zz, selectLevelAnchor);
        }
        this.selectBarAnchor.content = this.zoomAnchors;
        this.updateTimeSelectionBar();
    }
}
class UIToolbar {
    constructor() {
    }
    createToolbar() {
        this.openRightMenuButton = new ToolBarButton([icon_ver_menu], 0, 2, (nn) => {
            globalCommandDispatcher.resetAnchor(this.toolBarGroup, this.toolBarAnchor, LevelModes.overlay);
            if (globalCommandDispatcher.cfg().data.list) {
                globalCommandDispatcher.hideRightMenu();
            }
            else {
                globalCommandDispatcher.showRightMenu();
            }
        });
        this.redoButton = new ToolBarButton([icon_redo], 0, 1, (nn) => {
            globalCommandDispatcher.exe.redo(1);
        });
        this.undoButton = new ToolBarButton([icon_undo], 0, 0, (nn) => {
            globalCommandDispatcher.exe.undo(1);
        });
        this.playStopButton = new ToolBarButton([icon_pause, icon_play], 0, -1, (nn) => {
            if (globalCommandDispatcher.player.playState().play) {
                globalCommandDispatcher.stopPlay();
            }
            else {
                globalCommandDispatcher.setupAndStartPlay();
            }
        });
        this.backHomeButton = new ToolBarButton([icon_home], 0, -2, (nn) => {
            if (goHomeBackURL) {
                window.location.replace(goHomeBackURL);
            }
        });
        this.toolBarGroup = document.getElementById("toolBarPanelGroup");
        this.toolBarAnchor = {
            xx: 0, yy: 0, ww: 111, hh: 111,
            minZoom: zoomPrefixLevelsCSS[0].minZoom,
            beforeZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom,
            content: [
                this.openRightMenuButton.iconLabelButton.anchor,
                this.undoButton.iconLabelButton.anchor,
                this.redoButton.iconLabelButton.anchor,
                this.playStopButton.iconLabelButton.anchor,
                this.backHomeButton.iconLabelButton.anchor
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
        this.openRightMenuButton.resize(viewWIdth, viewHeight);
        this.undoButton.resize(viewWIdth, viewHeight);
        this.redoButton.resize(viewWIdth, viewHeight);
        this.playStopButton.resize(viewWIdth, viewHeight);
        this.backHomeButton.resize(viewWIdth, viewHeight);
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
        this.dragItemX = 0;
        this.dragItemY = 0;
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
    showDragMenuItem(dx, dy, dragContent) {
        this.dragAnchor.content = [dragContent];
        let zz = globalCommandDispatcher.renderer.tiler.getCurrentPointPosition().z;
        this.dragItemX = dx / zz;
        this.dragItemY = dy / zz;
        this.dragAnchor.translation = { x: this.dragItemX, y: this.dragItemY };
        this.dragAnchor.css = 'dragDropMixerItem';
        globalCommandDispatcher.renderer.tiler.updateAnchorStyle(this.dragAnchor);
    }
    moveDragMenuItem(dx, dy) {
        let zz = globalCommandDispatcher.renderer.tiler.getCurrentPointPosition().z;
        this.dragItemX = this.dragItemX + dx / zz;
        this.dragItemY = this.dragItemY + dy / zz;
        this.dragAnchor.translation = { x: this.dragItemX, y: this.dragItemY };
        this.dragAnchor.css = 'dragDropMixerItem';
        globalCommandDispatcher.renderer.tiler.updateAnchorStyle(this.dragAnchor);
    }
    hideDragMenuItem() {
        let tap = globalCommandDispatcher.renderer.tiler.tapPxSize();
        let point = globalCommandDispatcher.renderer.tiler.screen2view({
            x: this.dragItemX * tap,
            y: this.dragItemY * tap
        });
        let start = globalCommandDispatcher.cfg().leftPad + globalCommandDispatcher.cfg().timelineWidth() + globalCommandDispatcher.cfg().padGridFan;
        let left = point.x - start;
        let top = point.y - globalCommandDispatcher.cfg().gridTop();
        this.dragAnchor.css = 'noDragDropMixerItem';
        globalCommandDispatcher.renderer.tiler.updateAnchorStyle(this.dragAnchor);
        return { x: left, y: top };
    }
    createMenu() {
        this.menuPanelBackground = document.getElementById("menuPanelBackground");
        this.menuPanelContent = document.getElementById("menuPanelContent");
        this.menuPanelInteraction = document.getElementById("menuPanelInteraction");
        this.menuPanelButtons = document.getElementById("menuPanelButtons");
        this.backgroundRectangle = { x: 0, y: 0, w: 5, h: 5, css: 'rightMenuPanel' };
        this.dragHandler = { x: 1, y: 1, w: 5, h: 5, css: 'transparentScroll', id: 'rightMenuDragHandler', draggable: true, activation: this.scrollListing.bind(this) };
        this.listingShadow = { x: 0, y: 0, w: 5, h: 5, css: 'fillShadow' };
        this.menuUpButton = new IconLabelButton([icon_moveup], 'menuButtonCircle', 'menuButtonLabel', (nn) => {
            this.scrollY = 0;
            this.contentAnchor.translation = { x: this.shiftX, y: this.scrollY };
        });
        this.backgroundAnchor = {
            xx: 0, yy: 0, ww: 111, hh: 111,
            minZoom: zoomPrefixLevelsCSS[0].minZoom,
            beforeZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom,
            content: [
                this.listingShadow,
                this.backgroundRectangle
            ], id: 'rightMenuBackgroundAnchor'
        };
        this.contentAnchor = {
            xx: 0, yy: 0, ww: 111, hh: 111,
            minZoom: zoomPrefixLevelsCSS[0].minZoom,
            beforeZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom,
            content: [], id: 'rightMenuContentAnchor'
        };
        this.dragAnchor = {
            xx: 0, yy: 111, ww: 111, hh: 0,
            minZoom: zoomPrefixLevelsCSS[0].minZoom,
            beforeZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom,
            content: [],
            css: 'noDragDropMixerItem'
        };
        this.interAnchor = {
            xx: 0, yy: 111, ww: 111, hh: 0,
            minZoom: zoomPrefixLevelsCSS[0].minZoom,
            beforeZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom,
            content: [
                this.dragHandler,
                this.dragAnchor
            ]
        };
        this.buttonsAnchor = {
            xx: 0, yy: 111, ww: 111, hh: 0,
            minZoom: zoomPrefixLevelsCSS[0].minZoom,
            beforeZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom,
            content: [
                this.menuUpButton.anchor
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
    fillMenuItemChildren(pad, infos) {
        if (globalCommandDispatcher.cfg()) {
            if (globalCommandDispatcher.cfg().data.menuPlugins) {
                menuPointAddPlugin.itemKind = kindOpenedFolder;
            }
            else {
                menuPointAddPlugin.itemKind = kindClosedFolder;
            }
            if (globalCommandDispatcher.cfg().data.menuActions) {
                menuPointActions.itemKind = kindOpenedFolder;
            }
            else {
                menuPointActions.itemKind = kindClosedFolder;
            }
            if (globalCommandDispatcher.cfg().data.menuSettings) {
                menuPointSettings.itemKind = kindOpenedFolder;
            }
            else {
                menuPointSettings.itemKind = kindClosedFolder;
            }
        }
        let me = this;
        for (let ii = 0; ii < infos.length; ii++) {
            let it = infos[ii];
            let children = it.children;
            let itemLabel = '';
            if (it.noLocalization) {
                itemLabel = it.text;
            }
            else {
                itemLabel = LO(it.text);
            }
            switch (it.itemKind) {
                case kindOpenedFolder: {
                    let so = new RightMenuItem(kindOpenedFolder, it, pad, () => {
                        if (it.onFolderCloseOpen) {
                            it.onFolderCloseOpen();
                        }
                        it.focused = true;
                        it.itemKind = kindClosedFolder;
                        me.rerenderMenuContent(so);
                    });
                    this.items.push(so);
                    it.menuTop = this.items.length - 1;
                    if (children) {
                        this.fillMenuItemChildren(pad + 0.5, children);
                    }
                    break;
                }
                case kindClosedFolder: {
                    let si = new RightMenuItem(kindClosedFolder, it, pad, () => {
                        if (it.onFolderCloseOpen) {
                            it.onFolderCloseOpen();
                        }
                        it.focused = true;
                        it.itemKind = kindOpenedFolder;
                        me.rerenderMenuContent(si);
                    });
                    this.items.push(si);
                    it.menuTop = this.items.length - 1;
                    break;
                }
                case kindDraggableCircle: {
                    this.items.push(new RightMenuItem(kindDraggableCircle, it, pad, () => { }, () => { }, (x, y) => {
                        if (it.onDrag) {
                            it.onDrag(x, y);
                        }
                        me.setFocus(it, infos);
                        me.resetAllAnchors();
                    }));
                    it.menuTop = this.items.length - 1;
                    break;
                }
                case kindDraggableSquare: {
                    this.items.push(new RightMenuItem(kindDraggableSquare, it, pad, () => { }, () => { }, (x, y) => {
                        if (it.onDrag) {
                            it.onDrag(x, y);
                        }
                        me.setFocus(it, infos);
                        me.resetAllAnchors();
                    }));
                    it.menuTop = this.items.length - 1;
                    break;
                }
                case kindDraggableTriangle: {
                    this.items.push(new RightMenuItem(kindDraggableTriangle, it, pad, () => { }, () => { }, (x, y) => {
                        if (it.onDrag) {
                            it.onDrag(x, y);
                        }
                        me.setFocus(it, infos);
                        me.resetAllAnchors();
                    }));
                    it.menuTop = this.items.length - 1;
                    break;
                }
                case kindPreview: {
                    let rightMenuItem = new RightMenuItem(kindPreview, it, pad, () => {
                        if (it.onClick) {
                            it.onClick();
                        }
                        me.setFocus(it, infos);
                        me.resetAllAnchors();
                    }, () => {
                        if (it.itemStates) {
                            let sel = it.selectedState ? it.selectedState : 0;
                            if (it.itemStates.length - 1 > sel) {
                                sel++;
                            }
                            else {
                                sel = 0;
                            }
                            it.selectedState = sel;
                        }
                        if (it.onSubClick) {
                            it.onSubClick();
                        }
                        me.rerenderMenuContent(rightMenuItem);
                    });
                    this.items.push(rightMenuItem);
                    it.menuTop = this.items.length - 1;
                    break;
                }
                case kindAction2: {
                    let rightMenuItem = new RightMenuItem(kindAction2, it, pad, () => {
                        if (it.onClick) {
                            it.onClick();
                        }
                        me.setFocus(it, infos);
                        me.resetAllAnchors();
                    }, () => {
                        if (it.itemStates) {
                            let sel = it.selectedState ? it.selectedState : 0;
                            if (it.itemStates.length - 1 > sel) {
                                sel++;
                            }
                            else {
                                sel = 0;
                            }
                            it.selectedState = sel;
                        }
                        if (it.onSubClick) {
                            it.onSubClick();
                        }
                        me.rerenderMenuContent(rightMenuItem);
                    });
                    this.items.push(rightMenuItem);
                    it.menuTop = this.items.length - 1;
                    break;
                }
                case kindAction: {
                    this.items.push(new RightMenuItem(kindAction, it, pad, () => {
                        if (it.onClick) {
                            it.onClick();
                        }
                        me.setFocus(it, infos);
                        me.resetAllAnchors();
                    }));
                    it.menuTop = this.items.length - 1;
                    break;
                }
                case kindActionDisabled: {
                    this.items.push(new RightMenuItem(kindActionDisabled, it, pad, () => {
                        me.setFocus(it, infos);
                        me.resetAllAnchors();
                    }));
                    it.menuTop = this.items.length - 1;
                    break;
                }
            }
        }
    }
    readCurrentSongData(project) {
        let solo = false;
        for (let tt = 0; tt < project.tracks.length; tt++)
            if (project.tracks[tt].performer.state == 2)
                solo = true;
        for (let tt = 0; tt < project.percussions.length; tt++)
            if (project.percussions[tt].sampler.state == 2)
                solo = true;
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
        if (this.itemsWidth > 14)
            this.itemsWidth = 14;
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
        this.menuUpButton.resize(this.shiftX + this.itemsWidth - 1, 0, 1);
        this.rerenderMenuContent(null);
    }
}
const kindAction = 1;
const kindDraggableCircle = 2;
const kindDraggableSquare = 3;
const kindDraggableTriangle = 4;
const kindPreview = 5;
const kindClosedFolder = 6;
const kindOpenedFolder = 7;
const kindAction2 = 8;
const kindActionDisabled = 9;
class RightMenuItem {
    constructor(newkind, info, pad, tap, tap2, drag) {
        this.pad = 0;
        this.info = info;
        this.pad = pad;
        this.action = tap;
        this.action2 = tap2;
        this.drag = drag;
        if (this.info.sid) {
        }
        else {
            this.info.sid = 'random' + Math.random();
        }
    }
    calculateHeight() {
        if (this.info.itemKind == kindPreview) {
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
        let labelCss = 'rightMenuLabel';
        if (this.info.lightTitle) {
            labelCss = 'rightMenuLightLabel';
        }
        this.top = itemTop;
        let anchor = {
            xx: 0, yy: itemTop, ww: 111, hh: 111,
            minZoom: zoomPrefixLevelsCSS[0].minZoom,
            beforeZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom,
            content: []
        };
        if (this.info.focused) {
        }
        anchor.content.push({ x: 0, y: itemTop + this.calculateHeight(), w: itemWidth, h: 0.02, css: 'rightMenuDelimiterLine' });
        let spot = { x: this.pad, y: itemTop, w: 1, h: 1, activation: this.action, css: 'transparentSpot' };
        let spot2 = null;
        if (this.info.itemKind == kindAction) {
            anchor.content.push({ x: 0.1 + this.pad, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'rightMenuItemActionBG' });
            anchor.content.push({ x: 0.3 + this.pad, y: itemTop + 0.7, text: label, css: labelCss });
        }
        if (this.info.itemKind == kindActionDisabled) {
            anchor.content.push({ x: 0.1 + this.pad, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'rightMenuItemDisabledBG' });
            anchor.content.push({ x: 0.3 + this.pad, y: itemTop + 0.7, text: label, css: labelCss });
        }
        if (this.info.itemKind == kindAction2) {
            let stateIicon = '?';
            let sel = this.info.selectedState ? this.info.selectedState : 0;
            if (this.info.itemStates) {
                if (this.info.itemStates.length > sel) {
                    stateIicon = this.info.itemStates[sel];
                }
            }
            anchor.content.push({ x: 0.1 + this.pad, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'rightMenuItemActionBG' });
            if (this.info.highlight) {
                anchor.content.push({ x: 0.5 + this.pad, y: itemTop + 0.7, text: this.info.highlight, css: 'rightMenuIconLabel' });
                anchor.content.push({ x: 1 + this.pad, y: itemTop + 0.7, text: label, css: labelCss });
            }
            else {
                anchor.content.push({ x: 0.3 + this.pad, y: itemTop + 0.7, text: label, css: labelCss });
            }
            anchor.content.push({ x: itemWidth - 1.1, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'rightMenuItemActionBG' });
            anchor.content.push({ x: itemWidth - 1.1 + 0.4, y: itemTop + 0.7, text: stateIicon, css: 'rightMenuIconLabel' });
            spot2 = { x: itemWidth - 1.2, y: itemTop, w: 1, h: 1, activation: this.action2, css: 'transparentSpot' };
        }
        if (this.info.itemKind == kindDraggableCircle) {
            spot.draggable = true;
            spot.activation = this.drag;
            anchor.content.push({ x: 0.1 + this.pad, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'rightMenuItemDragBG' });
            anchor.content.push({ x: 0.3 + this.pad, y: itemTop + 0.7, text: label, css: labelCss });
        }
        if (this.info.itemKind == kindDraggableSquare) {
            spot.draggable = true;
            spot.activation = this.drag;
            anchor.content.push({ x: 0.15 + this.pad, y: itemTop + 0.15, w: 0.7, h: 0.7, rx: 0.05, ry: 0.05, css: 'rightMenuItemDragBG' });
            anchor.content.push({ x: 0.3 + this.pad, y: itemTop + 0.7, text: label, css: labelCss });
        }
        if (this.info.itemKind == kindDraggableTriangle) {
            spot.draggable = true;
            spot.activation = this.drag;
            let sz = 0.45;
            let tri = {
                x: 0.2 + this.pad,
                y: itemTop + 0.1,
                dots: [0, 0, sz * 2 * 0.8 * 0.9, sz * 0.9, 0, sz * 2 * 0.9],
                css: 'rightMenuItemDragBG'
            };
            anchor.content.push(tri);
            anchor.content.push({ x: 0.3 + this.pad, y: itemTop + 0.7, text: label, css: labelCss });
        }
        if (this.info.itemKind == kindOpenedFolder) {
            anchor.content.push({ x: 0.1 + this.pad, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'rightMenuItemActionBG' });
            anchor.content.push({ x: 0.5 + this.pad, y: itemTop + 0.7, text: icon_movedown, css: 'rightMenuIconLabel' });
            anchor.content.push({ x: 1 + this.pad, y: itemTop + 0.7, text: label, css: 'rightMenuLabel' });
        }
        if (this.info.itemKind == kindClosedFolder) {
            anchor.content.push({ x: 0.1 + this.pad, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'rightMenuItemActionBG' });
            anchor.content.push({ x: 0.5 + this.pad, y: itemTop + 0.7, text: icon_moveright, css: 'rightMenuIconLabel' });
            anchor.content.push({ x: 1 + this.pad, y: itemTop + 0.7, text: label, css: 'rightMenuLabel' });
        }
        if (this.info.itemKind == kindPreview) {
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
    text: localMenuActionsFolder,
    onFolderCloseOpen: () => {
        if (globalCommandDispatcher.cfg()) {
            if (menuPointActions.itemKind == kindClosedFolder) {
                globalCommandDispatcher.cfg().data.menuActions = true;
            }
            else {
                globalCommandDispatcher.cfg().data.menuActions = false;
            }
        }
    },
    itemKind: kindClosedFolder
};
let menuPointAddPlugin = {
    text: localMenuNewPlugin,
    onFolderCloseOpen: () => {
        if (globalCommandDispatcher.cfg()) {
            if (menuPointAddPlugin.itemKind == kindClosedFolder) {
                globalCommandDispatcher.cfg().data.menuPlugins = true;
            }
            else {
                globalCommandDispatcher.cfg().data.menuPlugins = false;
            }
        }
    },
    itemKind: kindClosedFolder
};
let menuPointSettings = {
    text: localMenuItemSettings, onFolderCloseOpen: () => {
        if (globalCommandDispatcher.cfg()) {
            if (menuPointSettings.itemKind == kindClosedFolder) {
                globalCommandDispatcher.cfg().data.menuSettings = true;
            }
            else {
                globalCommandDispatcher.cfg().data.menuSettings = false;
            }
        }
    }, children: [
        {
            text: localMenuNewEmptyProject, onClick: () => {
                globalCommandDispatcher.newEmptyProject();
            }, itemKind: kindAction
        }, {
            text: 'Size', children: [
                {
                    text: 'Small', onClick: () => {
                        startLoadCSSfile('theme/sizesmall.css');
                        globalCommandDispatcher.changeTapSize(1);
                    }, itemKind: kindAction
                }, {
                    text: 'Big', onClick: () => {
                        startLoadCSSfile('theme/sizebig.css');
                        globalCommandDispatcher.changeTapSize(1.5);
                    },
                    itemKind: kindAction
                }, {
                    text: 'Huge', onClick: () => {
                        startLoadCSSfile('theme/sizehuge.css');
                        globalCommandDispatcher.changeTapSize(4);
                    },
                    itemKind: kindAction
                }
            ], itemKind: kindClosedFolder
        }, {
            text: 'Colors', children: [
                {
                    text: 'Minium', onClick: () => {
                        globalCommandDispatcher.setThemeColor('red1');
                    }, itemKind: kindAction
                }, {
                    text: 'Greenstone', onClick: () => {
                        globalCommandDispatcher.setThemeColor('green1');
                    }, itemKind: kindAction
                }, {
                    text: 'Deep', onClick: () => {
                        globalCommandDispatcher.setThemeColor('blue1');
                    }, itemKind: kindAction
                }, {
                    text: 'Neon', onClick: () => {
                        globalCommandDispatcher.setThemeColor('neon1');
                    }, itemKind: kindAction
                },
                {
                    text: 'Gjel', onClick: () => {
                        globalCommandDispatcher.setThemeColor('light1');
                    }, itemKind: kindAction
                },
                {
                    text: 'Vorot', onClick: () => {
                        globalCommandDispatcher.setThemeColor('light2');
                    }, itemKind: kindAction
                },
                {
                    text: 'Bereza', onClick: () => {
                        globalCommandDispatcher.setThemeColor('light3');
                    }, itemKind: kindAction
                }
            ], itemKind: kindClosedFolder
        }, {
            text: 'Language', children: [
                {
                    text: 'Russian', onClick: () => {
                        globalCommandDispatcher.setThemeLocale('ru', 1);
                    }, itemKind: kindAction
                }, {
                    text: 'English', onClick: () => {
                        globalCommandDispatcher.setThemeLocale('en', 1);
                    }, itemKind: kindAction
                }, {
                    text: 'kitaiskiy', onClick: () => {
                        globalCommandDispatcher.setThemeLocale('zh', 1.5);
                    }, itemKind: kindAction
                }
            ], itemKind: kindClosedFolder
        },
        {
            text: 'other', children: [{
                    text: localMenuClearUndoRedo, onClick: () => {
                        globalCommandDispatcher.clearUndo();
                        globalCommandDispatcher.clearRedo();
                    }, itemKind: kindAction
                }, {
                    text: 'Plugindebug', onClick: () => {
                        globalCommandDispatcher.promptPluginInfoDebug();
                    }, itemKind: kindAction
                }
            ], itemKind: kindClosedFolder
        }
    ], itemKind: kindClosedFolder
};
function fillPluginsLists() {
    menuPointAddPlugin.children = [];
    menuPointActions.children = [];
    for (let ii = 0; ii < MZXBX_currentPlugins().length; ii++) {
        let label = MZXBX_currentPlugins()[ii].label;
        let purpose = MZXBX_currentPlugins()[ii].purpose;
        if (purpose == 'Action') {
            menuPointActions.children.push({
                text: label, noLocalization: true, onClick: () => {
                    globalCommandDispatcher.actionPluginDialog.openActionPluginDialogFrame(MZXBX_currentPlugins()[ii]);
                },
                itemKind: kindAction
            });
        }
        else {
            if (purpose == 'Sampler') {
                let dragStarted = false;
                let info;
                info = {
                    text: label,
                    noLocalization: true,
                    onDrag: (x, y) => {
                        if (dragStarted) {
                            if (x == 0 && y == 0) {
                                dragStarted = false;
                                let newPos = globalCommandDispatcher.renderer.menu.hideDragMenuItem();
                                globalCommandDispatcher.exe.commitProjectChanges(['percussions'], () => {
                                    globalCommandDispatcher.cfg().data.percussions.push({
                                        sampler: {
                                            id: '' + Math.random(),
                                            kind: MZXBX_currentPlugins()[ii].kind,
                                            data: '',
                                            outputs: [''],
                                            iconPosition: newPos,
                                            state: 0
                                        },
                                        measures: [],
                                        title: MZXBX_currentPlugins()[ii].label
                                    });
                                    globalCommandDispatcher.adjustTimelineContent();
                                });
                            }
                            else {
                                globalCommandDispatcher.renderer.menu.moveDragMenuItem(x, y);
                            }
                        }
                        else {
                            let zz = globalCommandDispatcher.renderer.tiler.getCurrentPointPosition().z;
                            let ss = globalCommandDispatcher.renderer.menu.scrollY;
                            let tt = info.menuTop ? info.menuTop : 0;
                            let yy = (tt + ss - 0.0) * zz;
                            let xx = (1 + globalCommandDispatcher.renderer.menu.shiftX) * zz;
                            dragStarted = true;
                            globalCommandDispatcher.hideRightMenu();
                            let sz = 1;
                            let tri = {
                                x: 0,
                                y: 0,
                                dots: [0, 0, sz * 2 * 0.8 * 0.9, sz * 0.9, 0, sz * 2 * 0.9],
                                css: 'rectangleDragItem'
                            };
                            globalCommandDispatcher.renderer.menu.showDragMenuItem(xx, yy, tri);
                        }
                    },
                    itemKind: kindDraggableTriangle
                };
                menuPointAddPlugin.children.push(info);
            }
            else {
                if (purpose == 'Performer') {
                    let dragStarted = false;
                    let info;
                    info = {
                        text: label,
                        noLocalization: true,
                        onDrag: (x, y) => {
                            if (dragStarted) {
                                if (x == 0 && y == 0) {
                                    dragStarted = false;
                                    let newPos = globalCommandDispatcher.renderer.menu.hideDragMenuItem();
                                    globalCommandDispatcher.exe.commitProjectChanges(['tracks'], () => {
                                        globalCommandDispatcher.cfg().data.tracks.push({
                                            performer: {
                                                id: '' + Math.random(),
                                                kind: MZXBX_currentPlugins()[ii].kind,
                                                data: '',
                                                outputs: [''],
                                                iconPosition: newPos,
                                                state: 0
                                            },
                                            measures: [],
                                            title: MZXBX_currentPlugins()[ii].label
                                        });
                                        globalCommandDispatcher.adjustTimelineContent();
                                    });
                                }
                                else {
                                    globalCommandDispatcher.renderer.menu.moveDragMenuItem(x, y);
                                }
                            }
                            else {
                                let zz = globalCommandDispatcher.renderer.tiler.getCurrentPointPosition().z;
                                let ss = globalCommandDispatcher.renderer.menu.scrollY;
                                let tt = info.menuTop ? info.menuTop : 0;
                                let yy = (tt + ss - 0.0) * zz;
                                let xx = (1 + globalCommandDispatcher.renderer.menu.shiftX) * zz;
                                dragStarted = true;
                                globalCommandDispatcher.hideRightMenu();
                                let sz = 1;
                                globalCommandDispatcher.renderer.menu.showDragMenuItem(xx, yy, {
                                    x: 0, y: 0,
                                    w: sz, h: sz,
                                    rx: sz / 20, ry: sz / 20,
                                    css: 'rectangleDragItem'
                                });
                            }
                        },
                        itemKind: kindDraggableSquare
                    };
                    menuPointAddPlugin.children.push(info);
                }
                else {
                    if (purpose == 'Filter') {
                        let dragStarted = false;
                        let info;
                        info = {
                            text: label,
                            noLocalization: true,
                            onDrag: (x, y) => {
                                if (dragStarted) {
                                    if (x == 0 && y == 0) {
                                        dragStarted = false;
                                        let newPos = globalCommandDispatcher.renderer.menu.hideDragMenuItem();
                                        globalCommandDispatcher.exe.commitProjectChanges(['filters'], () => {
                                            globalCommandDispatcher.cfg().data.filters.push({
                                                id: '' + Math.random(),
                                                kind: MZXBX_currentPlugins()[ii].kind,
                                                data: '',
                                                outputs: [''],
                                                automation: [],
                                                iconPosition: newPos,
                                                state: 0,
                                                title: MZXBX_currentPlugins()[ii].label
                                            });
                                        });
                                        globalCommandDispatcher.adjustTimelineContent();
                                    }
                                    else {
                                        globalCommandDispatcher.renderer.menu.moveDragMenuItem(x, y);
                                    }
                                }
                                else {
                                    let zz = globalCommandDispatcher.renderer.tiler.getCurrentPointPosition().z;
                                    let ss = globalCommandDispatcher.renderer.menu.scrollY;
                                    let tt = info.menuTop ? info.menuTop : 0;
                                    let yy = (tt + ss - 0.0) * zz;
                                    let xx = (1 + globalCommandDispatcher.renderer.menu.shiftX) * zz;
                                    dragStarted = true;
                                    globalCommandDispatcher.hideRightMenu();
                                    let sz = 1;
                                    globalCommandDispatcher.renderer.menu.showDragMenuItem(xx, yy, {
                                        x: 0, y: 0,
                                        w: sz, h: sz,
                                        rx: sz / 2, ry: sz / 2,
                                        css: 'rectangleDragItem'
                                    });
                                }
                            },
                            itemKind: kindDraggableCircle
                        };
                        menuPointAddPlugin.children.push(info);
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
    if (menuItemsData) {
        return menuItemsData;
    }
    else {
        fillPluginsLists();
        menuItemsData = [
            menuPointActions,
            menuPointAddPlugin,
            menuPointSettings
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
                minZoom: zoomPrefixLevelsCSS[zz].minZoom,
                beforeZoom: zoomPrefixLevelsCSS[zz + 1].minZoom,
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
            for (let oo = 1; oo < globalCommandDispatcher.cfg().drawOctaveCount(); oo++) {
                if (zz < 4) {
                    let olabel = '' + (globalCommandDispatcher.cfg().drawOctaveCount() - oo);
                    let nm3 = {
                        x: 1,
                        y: globalCommandDispatcher.cfg().gridTop() + 12 * oo * globalCommandDispatcher.cfg().notePathHeight + 1 * zoomPrefixLevelsCSS[zz].minZoom,
                        text: olabel,
                        css: 'octaveLabel' + zoomPrefixLevelsCSS[zz].prefix
                    };
                    this.leftZoomAnchors[zz].content.push(nm3);
                    if (zz < 2) {
                        nm3.x = 0.5;
                        let nm2 = {
                            x: 0.5,
                            y: globalCommandDispatcher.cfg().gridTop() + 12 * oo * globalCommandDispatcher.cfg().notePathHeight + 1 * zoomPrefixLevelsCSS[zz].minZoom + 6 * globalCommandDispatcher.cfg().notePathHeight,
                            text: olabel,
                            css: 'octaveSubLabel' + zoomPrefixLevelsCSS[zz].prefix
                        };
                        this.leftZoomAnchors[zz].content.push(nm2);
                        if (zz < 1) {
                            nm2.x = 0.25;
                            nm3.x = 0.25;
                            let nm = {
                                x: 0.25,
                                y: globalCommandDispatcher.cfg().gridTop() + 12 * oo * globalCommandDispatcher.cfg().notePathHeight + 1 * zoomPrefixLevelsCSS[zz].minZoom + 3 * globalCommandDispatcher.cfg().notePathHeight,
                                text: olabel,
                                css: 'octaveSubLabel' + zoomPrefixLevelsCSS[zz].prefix
                            };
                            this.leftZoomAnchors[zz].content.push(nm);
                            nm = {
                                x: 0.25,
                                y: globalCommandDispatcher.cfg().gridTop() + 12 * oo * globalCommandDispatcher.cfg().notePathHeight + 1 * zoomPrefixLevelsCSS[zz].minZoom + 9 * globalCommandDispatcher.cfg().notePathHeight,
                                text: olabel,
                                css: 'octaveSubLabel' + zoomPrefixLevelsCSS[zz].prefix
                            };
                            this.leftZoomAnchors[zz].content.push(nm);
                        }
                    }
                }
            }
            let titleLabel = {
                x: 0,
                y: globalCommandDispatcher.cfg().gridTop(),
                text: globalCommandDispatcher.cfg().data.title,
                css: 'titleLabel' + zoomPrefixLevelsCSS[zz].prefix
            };
            this.leftZoomAnchors[zz].content.push(titleLabel);
            let soloOnly = false;
            for (let ss = 0; ss < globalCommandDispatcher.cfg().data.percussions.length; ss++)
                if (globalCommandDispatcher.cfg().data.percussions[ss].sampler.state == 2) {
                    soloOnly = true;
                    break;
                }
            for (let tt = 0; tt < globalCommandDispatcher.cfg().data.tracks.length; tt++) {
                if (globalCommandDispatcher.cfg().data.tracks[tt].performer.state == 2) {
                    soloOnly = true;
                    break;
                }
            }
            if (zz < 5) {
                if (globalCommandDispatcher.cfg().data.tracks.length > 0) {
                    let farorder = globalCommandDispatcher.calculateRealTrackFarOrder();
                    let preCSS = 'firstTrackLabel';
                    if ((soloOnly && globalCommandDispatcher.cfg().data.tracks[0].performer.state != 2) || ((!soloOnly) && globalCommandDispatcher.cfg().data.tracks[0].performer.state == 1)) {
                        preCSS = 'firstTrackMute';
                    }
                    let trackLabel = {
                        x: 0,
                        y: globalCommandDispatcher.cfg().gridTop() + globalCommandDispatcher.cfg().gridHeight(),
                        text: globalCommandDispatcher.cfg().data.tracks[farorder[0]].title,
                        css: preCSS + zoomPrefixLevelsCSS[zz].prefix
                    };
                    this.leftZoomAnchors[zz].content.push(trackLabel);
                    for (let farIdx = 1; farIdx < farorder.length; farIdx++) {
                        let tr = farorder[farIdx];
                        let preCSS = 'otherTrackLabel';
                        if ((soloOnly && globalCommandDispatcher.cfg().data.tracks[tr].performer.state != 2) || ((!soloOnly) && globalCommandDispatcher.cfg().data.tracks[tr].performer.state == 1)) {
                            preCSS = 'otherTrackMute';
                        }
                        let trackLabel = {
                            x: 0,
                            y: globalCommandDispatcher.cfg().gridTop() + globalCommandDispatcher.cfg().gridHeight()
                                - (1 + farIdx) * globalCommandDispatcher.cfg().notePathHeight,
                            text: globalCommandDispatcher.cfg().data.tracks[tr].title,
                            css: preCSS + zoomPrefixLevelsCSS[zz].prefix
                        };
                        this.leftZoomAnchors[zz].content.push(trackLabel);
                    }
                }
            }
            if (zz < 5) {
                for (let ss = 0; ss < globalCommandDispatcher.cfg().data.percussions.length; ss++) {
                    let preCSS = 'samplerRowLabel';
                    if ((soloOnly && globalCommandDispatcher.cfg().data.percussions[ss].sampler.state != 2) || ((!soloOnly) && globalCommandDispatcher.cfg().data.percussions[ss].sampler.state == 1)) {
                        preCSS = 'samplerMuteLabel';
                    }
                    let samplerLabel = {
                        text: '' + globalCommandDispatcher.cfg().data.percussions[ss].title,
                        x: 0,
                        y: globalCommandDispatcher.cfg().samplerTop()
                            + globalCommandDispatcher.cfg().samplerDotHeight * (1 + ss)
                            - globalCommandDispatcher.cfg().samplerDotHeight * 0.3,
                        css: preCSS + zoomPrefixLevelsCSS[zz].prefix
                    };
                    this.leftZoomAnchors[zz].content.push(samplerLabel);
                }
            }
            if (zz < 5) {
                for (let ff = 0; ff < globalCommandDispatcher.cfg().data.filters.length; ff++) {
                    let filter = globalCommandDispatcher.cfg().data.filters[ff];
                    let preCSS = 'autoRowLabel';
                    if (filter.state == 1) {
                        preCSS = 'autoMuteLabel';
                    }
                    let autoLabel = {
                        text: '' + filter.title,
                        x: 0,
                        y: globalCommandDispatcher.cfg().automationTop()
                            + (1 + ff) * globalCommandDispatcher.cfg().autoPointHeight
                            - 0.3 * globalCommandDispatcher.cfg().autoPointHeight,
                        css: preCSS + zoomPrefixLevelsCSS[zz].prefix
                    };
                    this.leftZoomAnchors[zz].content.push(autoLabel);
                }
            }
        }
    }
}
class SamplerBar {
    constructor(barIdx, drumIdx, zoomLevel, anchor, left, durationLen) {
        let ww = globalCommandDispatcher.cfg().samplerDotHeight * (1 + zoomLevel / 3) / 4;
        let drum = globalCommandDispatcher.cfg().data.percussions[drumIdx];
        let measure = drum.measures[barIdx];
        let yy = globalCommandDispatcher.cfg().samplerTop() + drumIdx * globalCommandDispatcher.cfg().samplerDotHeight;
        let tempo = globalCommandDispatcher.cfg().data.timeline[barIdx].tempo;
        let cucss = 'samplerDrumDotBg';
        let licss = 'samplerDrumDotLine';
        let soloOnly = false;
        for (let ss = 0; ss < globalCommandDispatcher.cfg().data.percussions.length; ss++)
            if (globalCommandDispatcher.cfg().data.percussions[ss].sampler.state == 2) {
                soloOnly = true;
                break;
            }
        for (let tt = 0; tt < globalCommandDispatcher.cfg().data.tracks.length; tt++) {
            if (globalCommandDispatcher.cfg().data.tracks[tt].performer.state == 2) {
                soloOnly = true;
                break;
            }
        }
        if ((soloOnly && drum.sampler.state != 2) || ((!soloOnly) && drum.sampler.state == 1)) {
            cucss = 'samplerDrumMuteBg';
            licss = 'samplerDrumMuteLine';
        }
        if (zoomLevel < globalCommandDispatcher.cfg().zoomEditSLess) {
            let interpane = {
                x: anchor.xx,
                y: globalCommandDispatcher.cfg().samplerTop(),
                w: anchor.ww,
                h: globalCommandDispatcher.cfg().data.percussions.length * globalCommandDispatcher.cfg().samplerDotHeight,
                css: 'commentPaneForClick',
                activation: (x, y) => { this.drumCellClick(barIdx, x, y, zoomLevel); }
            };
            anchor.content.push(interpane);
        }
        for (let ss = 0; ss < measure.skips.length; ss++) {
            let skip = measure.skips[ss];
            let xx = left + MMUtil().set(skip).duration(tempo) * globalCommandDispatcher.cfg().widthDurationRatio;
            let bgline = {
                dots: [xx, yy,
                    xx, yy + globalCommandDispatcher.cfg().samplerDotHeight,
                    xx + durationLen, yy + globalCommandDispatcher.cfg().samplerDotHeight / 2
                ],
                css: licss
            };
            anchor.content.push(bgline);
            let ply = {
                dots: [xx, yy,
                    xx, yy + globalCommandDispatcher.cfg().samplerDotHeight,
                    xx + ww, yy + globalCommandDispatcher.cfg().samplerDotHeight / 2
                ],
                css: cucss
            };
            anchor.content.push(ply);
            if (zoomLevel < globalCommandDispatcher.cfg().zoomEditSLess) {
                let yShift = 0.3;
                if (zoomLevel < 2)
                    yShift = 0.2;
                if (zoomLevel < 1)
                    yShift = 0.15;
                let deleteIcon = {
                    x: xx,
                    y: yy + globalCommandDispatcher.cfg().samplerDotHeight / 2 + yShift,
                    text: icon_close_circle,
                    css: 'samplerDrumDeleteIcon samplerDrumDeleteSize' + zoomLevel
                };
                anchor.content.push(deleteIcon);
            }
        }
    }
    drumCellClick(barIdx, barX, yy, zz) {
        let row = Math.floor(yy / globalCommandDispatcher.cfg().samplerDotHeight);
        let drum = globalCommandDispatcher.cfg().data.percussions[row];
        let info = globalCommandDispatcher.cfg().gridClickInfo(barIdx, barX, zz);
        let muStart = MMUtil().set(info.start);
        let muEnd = MMUtil().set(info.end);
        let deleteSkipIdx = 0;
        let addDrum = true;
        globalCommandDispatcher.exe.commitProjectChanges(['percussions', row, 'measures', barIdx], () => {
            for (deleteSkipIdx = 0; deleteSkipIdx < drum.measures[barIdx].skips.length; deleteSkipIdx++) {
                let probeSkip = drum.measures[barIdx].skips[deleteSkipIdx];
                if (muStart.more(probeSkip)) {
                }
                else {
                    if (muEnd.more(probeSkip)) {
                        addDrum = false;
                        drum.measures[barIdx].skips.splice(deleteSkipIdx, 1);
                        deleteSkipIdx--;
                        break;
                    }
                }
            }
            if (addDrum) {
                drum.measures[barIdx].skips.push(muStart.metre());
            }
        });
    }
}
class BarOctaveRender {
    constructor(barIdx, octaveIdx, left, top, width, height, barOctaveGridAnchor, barOctaveTrackAnchor, barOctaveFirstAnchor, transpose, zoomLevel) {
        new OctaveContent(barIdx, octaveIdx, left, top, width, height, barOctaveTrackAnchor, barOctaveFirstAnchor, transpose, zoomLevel);
    }
}
class OctaveContent {
    constructor(barIdx, octaveIdx, left, top, width, height, barOctaveTrackAnchor, barOctaveFirstAnchor, transpose, zoomLevel) {
        if (zoomLevel < 8) {
            this.addUpperNotes(barIdx, octaveIdx, left, top, width, height, barOctaveFirstAnchor, transpose, zoomLevel);
            if (zoomLevel < 7) {
                this.addOtherNotes(barIdx, octaveIdx, left, top, width, height, barOctaveTrackAnchor, transpose, zoomLevel);
            }
        }
    }
    addUpperNotes(barIdx, octaveIdx, left, top, width, height, barOctaveAnchor, transpose, zoomLevel) {
        if (globalCommandDispatcher.cfg().data.tracks.length) {
            let soloOnly = false;
            for (let ss = 0; ss < globalCommandDispatcher.cfg().data.percussions.length; ss++)
                if (globalCommandDispatcher.cfg().data.percussions[ss].sampler.state == 2) {
                    soloOnly = true;
                    break;
                }
            for (let tt = 0; tt < globalCommandDispatcher.cfg().data.tracks.length; tt++) {
                if (globalCommandDispatcher.cfg().data.tracks[tt].performer.state == 2) {
                    soloOnly = true;
                    break;
                }
            }
            let farorder = globalCommandDispatcher.calculateRealTrackFarOrder();
            let track = globalCommandDispatcher.cfg().data.tracks[farorder[0]];
            let css = 'mixNoteLine';
            if ((soloOnly && track.performer.state != 2) || ((!soloOnly) && track.performer.state == 1)) {
                css = 'mixMuteLine';
            }
            this.addTrackNotes(track, barIdx, octaveIdx, left, top, width, height, barOctaveAnchor, transpose, css, true, zoomLevel);
        }
    }
    addOtherNotes(barIdx, octaveIdx, left, top, width, height, barOctaveAnchor, transpose, zoomLevel) {
        let soloOnly = false;
        for (let ss = 0; ss < globalCommandDispatcher.cfg().data.percussions.length; ss++)
            if (globalCommandDispatcher.cfg().data.percussions[ss].sampler.state == 2) {
                soloOnly = true;
                break;
            }
        for (let tt = 0; tt < globalCommandDispatcher.cfg().data.tracks.length; tt++) {
            if (globalCommandDispatcher.cfg().data.tracks[tt].performer.state == 2) {
                soloOnly = true;
                break;
            }
        }
        let farorder = globalCommandDispatcher.calculateRealTrackFarOrder();
        for (let kk = 1; kk < farorder.length; kk++) {
            let ii = farorder[kk];
            let track = globalCommandDispatcher.cfg().data.tracks[ii];
            let css = 'mixNoteSub';
            if ((soloOnly && track.performer.state != 2) || ((!soloOnly) && track.performer.state == 1)) {
                css = 'mixMuteSub';
            }
            this.addTrackNotes(track, barIdx, octaveIdx, left, top, width, height, barOctaveAnchor, transpose, css, false, zoomLevel);
        }
    }
    addTrackNotes(track, barIdx, octaveIdx, left, top, width, height, barOctaveAnchor, transpose, css, interact, zoomLevel) {
        if (!track.measures[barIdx]) {
            return;
        }
        let measure = track.measures[barIdx];
        if (measure) {
            for (let cc = 0; cc < measure.chords.length; cc++) {
                let chord = measure.chords[cc];
                for (let nn = 0; nn < chord.pitches.length; nn++) {
                    let from = octaveIdx * 12;
                    let to = (octaveIdx + 1) * 12;
                    if (chord.pitches[nn] >= from && chord.pitches[nn] < to) {
                        let xStart = left + MMUtil().set(chord.skip).duration(globalCommandDispatcher.cfg().data.timeline[barIdx].tempo) * globalCommandDispatcher.cfg().widthDurationRatio;
                        let yStart = top + height - (chord.pitches[nn] - from + transpose) * globalCommandDispatcher.cfg().notePathHeight;
                        let x1 = xStart;
                        let y1 = yStart;
                        for (let ss = 0; ss < chord.slides.length; ss++) {
                            let x2 = x1 + MMUtil().set(chord.slides[ss].duration).duration(globalCommandDispatcher.cfg().data.timeline[barIdx].tempo) * globalCommandDispatcher.cfg().widthDurationRatio;
                            let y2 = yStart - chord.slides[ss].delta * globalCommandDispatcher.cfg().notePathHeight;
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
                        if (interact) {
                            if (zoomLevel < globalCommandDispatcher.cfg().zoomEditSLess) {
                                let yShift = 0.24;
                                let xShift = 0.20;
                                if (zoomLevel < 2) {
                                    yShift = 0.29;
                                    xShift = 0.29;
                                }
                                if (zoomLevel < 1) {
                                    yShift = 0.37;
                                    xShift = 0.37;
                                }
                                let deleteIcon = {
                                    x: xStart + xShift,
                                    y: yStart - yShift,
                                    text: icon_close_circle,
                                    css: 'samplerDrumDeleteIcon samplerDrumDeleteSize' + zoomLevel
                                };
                                barOctaveAnchor.content.push(deleteIcon);
                                let slideClick = {
                                    x: x1 - globalCommandDispatcher.cfg().notePathHeight,
                                    y: y1 - globalCommandDispatcher.cfg().notePathHeight,
                                    w: globalCommandDispatcher.cfg().notePathHeight,
                                    h: globalCommandDispatcher.cfg().notePathHeight,
                                    rx: globalCommandDispatcher.cfg().notePathHeight / 2,
                                    ry: globalCommandDispatcher.cfg().notePathHeight / 2,
                                    css: 'mixDropClick',
                                    activation: (x, y) => {
                                        globalCommandDispatcher.cfg().slidemark = {
                                            barIdx: barIdx,
                                            chord: chord,
                                            pitch: chord.pitches[nn]
                                        };
                                        globalCommandDispatcher.resetProject();
                                    }
                                };
                                barOctaveAnchor.content.push(slideClick);
                                let slideDot = {
                                    x: x1 - globalCommandDispatcher.cfg().notePathHeight * 5 / 8,
                                    y: y1 - globalCommandDispatcher.cfg().notePathHeight * 5 / 8,
                                    w: globalCommandDispatcher.cfg().notePathHeight / 4,
                                    h: globalCommandDispatcher.cfg().notePathHeight / 4,
                                    rx: globalCommandDispatcher.cfg().notePathHeight / 8,
                                    ry: globalCommandDispatcher.cfg().notePathHeight / 8,
                                    css: 'mixDropNote'
                                };
                                barOctaveAnchor.content.push(slideDot);
                            }
                        }
                    }
                }
            }
        }
        else {
            console.log('addTrackNotes no measure', barIdx, track);
        }
    }
}
class MixerBar {
    constructor(barIdx, left, ww, zoomLevel, gridZoomBarAnchor, tracksZoomBarAnchor, firstZoomBarAnchor) {
        let h12 = 12 * globalCommandDispatcher.cfg().notePathHeight;
        let transpose = globalCommandDispatcher.cfg().transposeOctaveCount() * 12;
        if (zoomLevel < globalCommandDispatcher.cfg().zoomEditSLess) {
            let interpane = {
                x: gridZoomBarAnchor.xx,
                y: globalCommandDispatcher.cfg().gridTop(),
                w: gridZoomBarAnchor.ww,
                h: globalCommandDispatcher.cfg().gridHeight(),
                css: 'commentPaneForClick',
                activation: (x, y) => {
                    this.trackCellClick(barIdx, x, y, zoomLevel);
                }
            };
            gridZoomBarAnchor.content.push(interpane);
        }
        for (let oo = globalCommandDispatcher.cfg().transposeOctaveCount(); oo < globalCommandDispatcher.cfg().drawOctaveCount(); oo++) {
            let gridOctaveAnchor = {
                minZoom: zoomPrefixLevelsCSS[zoomLevel].minZoom,
                beforeZoom: zoomPrefixLevelsCSS[zoomLevel + 1].minZoom,
                xx: left,
                yy: globalCommandDispatcher.cfg().gridTop() + oo * h12 - transpose,
                ww: ww,
                hh: h12, content: [],
                id: 'octaveGridz' + zoomLevel + 'b' + barIdx + 'o' + oo + 'r' + Math.random()
            };
            gridZoomBarAnchor.content.push(gridOctaveAnchor);
            let tracksOctaveAnchor = {
                minZoom: zoomPrefixLevelsCSS[zoomLevel].minZoom,
                beforeZoom: zoomPrefixLevelsCSS[zoomLevel + 1].minZoom,
                xx: left,
                yy: globalCommandDispatcher.cfg().gridTop() + oo * h12 - transpose,
                ww: ww,
                hh: h12, content: [],
                id: 'octaveTracks' + zoomLevel + 'b' + barIdx + 'o' + oo + 'r' + Math.random()
            };
            tracksZoomBarAnchor.content.push(tracksOctaveAnchor);
            let firstOctaveAnchor = {
                minZoom: zoomPrefixLevelsCSS[zoomLevel].minZoom,
                beforeZoom: zoomPrefixLevelsCSS[zoomLevel + 1].minZoom,
                xx: left,
                yy: globalCommandDispatcher.cfg().gridTop() + oo * h12 - transpose,
                ww: ww,
                hh: h12, content: [],
                id: 'octaveFirst' + zoomLevel + 'b' + barIdx + 'o' + oo + 'r' + Math.random()
            };
            firstZoomBarAnchor.content.push(firstOctaveAnchor);
            new BarOctaveRender(barIdx, (globalCommandDispatcher.cfg().drawOctaveCount() - oo - 1), left, globalCommandDispatcher.cfg().gridTop() + oo * h12, ww, h12, gridOctaveAnchor, tracksOctaveAnchor, firstOctaveAnchor, transpose, zoomLevel);
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
                let durationLen = this.findDurationOfSample(drum.sampler.id) * globalCommandDispatcher.cfg().widthDurationRatio;
                if (drum) {
                    let measure = drum.measures[barIdx];
                    if (measure) {
                        new SamplerBar(barIdx, pp, zoomLevel, firstZoomBarAnchor, left, durationLen);
                    }
                }
            }
        }
        if (zoomLevel < 7) {
            new TextCommentsBar(barIdx, left, gridZoomBarAnchor, zoomLevel);
        }
        if (zoomLevel < 7) {
            new AutomationBarContent(barIdx, left, gridZoomBarAnchor, zoomLevel);
        }
    }
    findDurationOfSample(samplerId) {
        if (globalCommandDispatcher.player) {
            let arr = globalCommandDispatcher.player.allPerformersSamplers();
            for (let ii = 0; ii < arr.length; ii++) {
                if (arr[ii].channelId == samplerId) {
                    try {
                        let pluginImplementation = arr[ii].plugin;
                        if (pluginImplementation.duration) {
                            return pluginImplementation.duration();
                        }
                        else {
                            return 0.0001;
                        }
                    }
                    catch (xxx) {
                        console.log(xxx);
                        return 0.0002;
                    }
                }
            }
        }
        return 0.0001;
    }
    addOctaveGridSteps(barIdx, barLeft, width, barOctaveAnchor, zIndex) {
        let zoomInfo = zoomPrefixLevelsCSS[zIndex];
        let curBar = globalCommandDispatcher.cfg().data.timeline[barIdx];
        if (curBar) {
            let lineCount = 0;
            let skip = MMUtil().set({ count: 0, part: 1 });
            barOctaveAnchor.content.push({
                x: barLeft + width,
                y: globalCommandDispatcher.cfg().gridTop(),
                w: zoomPrefixLevelsCSS[zIndex].minZoom * 0.8,
                h: globalCommandDispatcher.cfg().gridHeight(),
                css: 'barRightBorder'
            });
            barOctaveAnchor.content.push({
                x: barLeft + width,
                y: globalCommandDispatcher.cfg().samplerTop(),
                w: zoomPrefixLevelsCSS[zIndex].minZoom * 0.8,
                h: globalCommandDispatcher.cfg().samplerHeight(),
                css: 'barRightBorder'
            });
            barOctaveAnchor.content.push({
                x: barLeft + width,
                y: globalCommandDispatcher.cfg().automationTop(),
                w: zoomPrefixLevelsCSS[zIndex].minZoom * 0.8,
                h: globalCommandDispatcher.cfg().automationHeight(),
                css: 'barRightBorder'
            });
            if (zoomInfo.gridLines.length > 0) {
                let css = 'stepPartDelimiter';
                if (zIndex < globalCommandDispatcher.cfg().zoomEditSLess) {
                    css = 'interactiveTimeMeasureMark';
                }
                while (true) {
                    let line = zoomInfo.gridLines[lineCount];
                    skip = skip.plus(line.duration).simplyfy();
                    if (!skip.less(curBar.metre)) {
                        break;
                    }
                    let xx = barLeft + skip.duration(curBar.tempo) * globalCommandDispatcher.cfg().widthDurationRatio;
                    barOctaveAnchor.content.push({
                        x: xx,
                        y: globalCommandDispatcher.cfg().gridTop(),
                        w: line.ratio * zoomInfo.minZoom / 4,
                        h: globalCommandDispatcher.cfg().gridHeight(),
                        css: css
                    });
                    barOctaveAnchor.content.push({
                        x: xx,
                        y: globalCommandDispatcher.cfg().samplerTop(),
                        w: line.ratio * zoomInfo.minZoom / 4,
                        h: globalCommandDispatcher.cfg().samplerHeight(),
                        css: css
                    });
                    barOctaveAnchor.content.push({
                        x: xx,
                        y: globalCommandDispatcher.cfg().automationTop(),
                        w: line.ratio * zoomInfo.minZoom / 4,
                        h: globalCommandDispatcher.cfg().automationHeight(),
                        css: css
                    });
                    if (zIndex < globalCommandDispatcher.cfg().zoomEditSLess) {
                        barOctaveAnchor.content.push({
                            x: xx,
                            y: globalCommandDispatcher.cfg().commentsTop(),
                            w: line.ratio * zoomInfo.minZoom / 4,
                            h: globalCommandDispatcher.cfg().commentsZoomHeight(zIndex),
                            css: css
                        });
                    }
                    lineCount++;
                    if (lineCount >= zoomInfo.gridLines.length) {
                        lineCount = 0;
                    }
                }
                if (zIndex < globalCommandDispatcher.cfg().zoomEditSLess) {
                    let xx = barLeft + skip.duration(curBar.tempo) * globalCommandDispatcher.cfg().widthDurationRatio;
                    let line = zoomInfo.gridLines[lineCount];
                    barOctaveAnchor.content.push({
                        x: xx,
                        y: globalCommandDispatcher.cfg().commentsTop(),
                        w: line.ratio * zoomInfo.minZoom / 4,
                        h: globalCommandDispatcher.cfg().commentsZoomHeight(zIndex),
                        css: css
                    });
                }
            }
        }
    }
    trackCellClick(barIdx, barX, yy, zz) {
        let upperTrackIdx = globalCommandDispatcher.calculateRealTrackFarOrder()[0];
        let trMeasure = globalCommandDispatcher.cfg().data.tracks[upperTrackIdx].measures[barIdx];
        let pitch = Math.ceil(globalCommandDispatcher.cfg().gridHeight() - yy);
        let info = globalCommandDispatcher.cfg().gridClickInfo(barIdx, barX, zz);
        let cueditmark = globalCommandDispatcher.cfg().editmark;
        if (cueditmark) {
            let from = MMUtil().set(cueditmark.skip);
            let toStart = MMUtil().set(info.start);
            let toEnd = MMUtil().set(info.end);
            let fromBar = cueditmark.barIdx;
            let chordPitch = cueditmark.pitch;
            let shift = pitch - cueditmark.pitch;
            for (let ii = 0; ii < globalCommandDispatcher.cfg().data.timeline.length; ii++) {
                if (ii < cueditmark.barIdx) {
                    from.set(from.plus(globalCommandDispatcher.cfg().data.timeline[ii].metre));
                }
                if (ii < barIdx) {
                    toStart.set(toStart.plus(globalCommandDispatcher.cfg().data.timeline[ii].metre));
                    toEnd.set(toEnd.plus(globalCommandDispatcher.cfg().data.timeline[ii].metre));
                }
            }
            let to = MMUtil().set(toEnd);
            if (from.more(toStart)) {
                let newForm = toStart.metre();
                to.set(MMUtil().set(from.metre()).plus(info.end).minus(info.start));
                from.set(newForm);
                fromBar = barIdx;
                chordPitch = pitch;
                shift = cueditmark.pitch - pitch;
            }
            let duration = to.minus(from).simplyfy();
            let skip = MMUtil().set(from);
            for (let ii = 0; ii < globalCommandDispatcher.cfg().data.timeline.length; ii++) {
                if (ii < fromBar) {
                    skip.set(skip.minus(globalCommandDispatcher.cfg().data.timeline[ii].metre));
                }
            }
            let chord = null;
            let measure = globalCommandDispatcher.cfg().data.tracks[upperTrackIdx].measures[fromBar];
            globalCommandDispatcher.exe.commitProjectChanges(['tracks', upperTrackIdx, 'measures', barIdx], () => {
                for (let ii = 0; ii < measure.chords.length; ii++) {
                    if (MMUtil().set(measure.chords[ii].skip).equals(skip)) {
                        chord = measure.chords[ii];
                    }
                }
                if (chord) {
                }
                else {
                    chord = { skip: skip, pitches: [], slides: [] };
                    measure.chords.push(chord);
                }
                chord.pitches.push(chordPitch + 11);
                chord.slides = [{ duration: duration, delta: shift }];
            });
            globalCommandDispatcher.cfg().editmark = null;
        }
        else {
            let cuslidemark = globalCommandDispatcher.cfg().slidemark;
            if (cuslidemark) {
                let from = MMUtil().set(cuslidemark.chord.skip);
                let toStart = MMUtil().set(info.start);
                let toEnd = MMUtil().set(info.end);
                let fromBar = cuslidemark.barIdx;
                for (let ii = 0; ii < globalCommandDispatcher.cfg().data.timeline.length; ii++) {
                    if (ii < cuslidemark.barIdx) {
                        from.set(from.plus(globalCommandDispatcher.cfg().data.timeline[ii].metre));
                    }
                    if (ii < barIdx) {
                        toStart.set(toStart.plus(globalCommandDispatcher.cfg().data.timeline[ii].metre));
                        toEnd.set(toEnd.plus(globalCommandDispatcher.cfg().data.timeline[ii].metre));
                    }
                }
                let to = MMUtil().set(toEnd);
                if (from.more(toStart)) {
                    let newForm = toStart.metre();
                    to.set(MMUtil().set(from.metre()).plus(info.end).minus(info.start));
                    from.set(newForm);
                    fromBar = barIdx;
                }
                let duration = to.minus(from).simplyfy();
                for (let kk = 0; kk < cuslidemark.chord.slides.length; kk++) {
                    duration = MMUtil().set(duration).minus(cuslidemark.chord.slides[kk].duration);
                }
                if (duration.count > 0) {
                    globalCommandDispatcher.exe.commitProjectChanges(['tracks', upperTrackIdx, 'measures', barIdx], () => {
                        if (cuslidemark) {
                            cuslidemark.chord.slides.push({ duration: duration, delta: pitch - cuslidemark.pitch + 11 });
                            console.log(cuslidemark, pitch);
                        }
                    });
                    globalCommandDispatcher.cfg().slidemark = null;
                }
            }
            else {
                let muStart = MMUtil().set(info.start);
                let muEnd = MMUtil().set(info.end);
                let drop = false;
                globalCommandDispatcher.exe.commitProjectChanges(['tracks', upperTrackIdx, 'measures', barIdx], () => {
                    for (let ii = 0; ii < trMeasure.chords.length; ii++) {
                        let chord = trMeasure.chords[ii];
                        if ((!muStart.more(chord.skip)) && muEnd.more(chord.skip)) {
                            for (let nn = 0; nn < chord.pitches.length; nn++) {
                                if (chord.pitches[nn] >= pitch + 11 && chord.pitches[nn] < pitch + 11 + 1) {
                                    chord.pitches.splice(nn, 1);
                                    nn--;
                                    drop = true;
                                }
                            }
                        }
                    }
                });
                if (!drop) {
                    globalCommandDispatcher.cfg().editmark = { barIdx: barIdx, skip: muStart.metre(), pitch };
                }
            }
        }
        globalCommandDispatcher.resetProject();
    }
}
class TextCommentsBar {
    constructor(barIdx, barLeft, barOctaveAnchor, zIndex) {
        let curBar = globalCommandDispatcher.cfg().data.timeline[barIdx];
        let top = globalCommandDispatcher.cfg().commentsTop();
        if (barIdx < globalCommandDispatcher.cfg().data.comments.length) {
            let pad = 0.125 * globalCommandDispatcher.cfg().notePathHeight * globalCommandDispatcher.cfg().textZoomRatio(zIndex);
            let css = 'commentReadText' + zoomPrefixLevelsCSS[zIndex].prefix;
            css = 'commentLineText' + zoomPrefixLevelsCSS[zIndex].prefix;
            this.testBars();
            for (let ii = 0; ii < globalCommandDispatcher.cfg().data.comments[barIdx].points.length; ii++) {
                let itxt = globalCommandDispatcher.cfg().data.comments[barIdx].points[ii];
                let xx = barLeft + MMUtil().set(itxt.skip).duration(curBar.tempo) * globalCommandDispatcher.cfg().widthDurationRatio + pad;
                let yy = top + globalCommandDispatcher.cfg().notePathHeight * (1 + itxt.row) * globalCommandDispatcher.cfg().textZoomRatio(zIndex) - pad;
                let tt = {
                    x: xx,
                    y: yy,
                    text: globalCommandDispatcher.cfg().data.comments[barIdx].points[ii].text,
                    css: css
                };
                barOctaveAnchor.content.push(tt);
            }
        }
        if (zIndex < globalCommandDispatcher.cfg().zoomEditSLess) {
            let interpane = {
                x: barOctaveAnchor.xx,
                y: globalCommandDispatcher.cfg().commentsTop(),
                w: barOctaveAnchor.ww,
                h: globalCommandDispatcher.cfg().commentsMaxHeight(),
                css: 'commentPaneForClick',
                activation: (x, y) => { this.textCellClick(x, y, zIndex, barIdx); }
            };
            barOctaveAnchor.content.push(interpane);
        }
    }
    testBars() {
        for (let idx = 0; idx < globalCommandDispatcher.cfg().data.timeline.length; idx++) {
            if (globalCommandDispatcher.cfg().data.comments[idx]) {
            }
            else {
                globalCommandDispatcher.cfg().data.comments[idx] = {
                    points: []
                };
            }
        }
    }
    textCellClick(x, y, zz, idx) {
        let row = 0;
        for (let tt = 0; tt <= globalCommandDispatcher.cfg().maxCommentRowCount; tt++) {
            let nextY = globalCommandDispatcher.cfg().commentsZoomLineY(zz, tt);
            if (nextY > y) {
                break;
            }
            row++;
        }
        let info = globalCommandDispatcher.cfg().gridClickInfo(idx, x, zz);
        this.testBars();
        let commentBar = globalCommandDispatcher.cfg().data.comments[idx];
        let first = this.getFirstCommentText(commentBar, row, info);
        let re = prompt(first, first);
        if (re === first) {
        }
        else {
            if (re !== null) {
                let newText = re;
                globalCommandDispatcher.exe.commitProjectChanges(['comments', idx], () => {
                    this.dropBarComments(commentBar, row, info);
                    commentBar.points.push({
                        skip: info.start,
                        text: newText,
                        row: row
                    });
                });
                globalCommandDispatcher.cfg().recalculateCommentMax();
            }
        }
    }
    getFirstCommentText(commentBar, row, info) {
        for (let ii = 0; ii < commentBar.points.length; ii++) {
            let pp = commentBar.points[ii];
            if (pp.row == row) {
                if (!info.start.more(pp.skip)) {
                    if (info.end.more(pp.skip)) {
                        return pp.text;
                    }
                }
            }
        }
        return '';
    }
    dropBarComments(commentBar, row, info) {
        commentBar.points = commentBar.points.filter((pp) => {
            if (pp.row == row) {
                if (!info.start.more(pp.skip)) {
                    if (info.end.more(pp.skip)) {
                        return false;
                    }
                }
            }
            return true;
        });
    }
}
class AutomationBarContent {
    constructor(barIdx, barLeft, barOctaveAnchor, zIndex) {
        let curBar = globalCommandDispatcher.cfg().data.timeline[barIdx];
        let top = globalCommandDispatcher.cfg().automationTop();
        if (zIndex < globalCommandDispatcher.cfg().zoomEditSLess) {
            let interpane = {
                x: barOctaveAnchor.xx,
                y: globalCommandDispatcher.cfg().automationTop(),
                w: barOctaveAnchor.ww,
                h: globalCommandDispatcher.cfg().data.filters.length * globalCommandDispatcher.cfg().autoPointHeight,
                css: 'commentPaneForClick',
                activation: (x, y) => { this.autoCellClick(barIdx, x, y, zIndex); }
            };
            barOctaveAnchor.content.push(interpane);
        }
        for (let aa = 0; aa < globalCommandDispatcher.cfg().data.filters.length; aa++) {
            let filter = globalCommandDispatcher.cfg().data.filters[aa];
            if (filter.automation[barIdx]) {
                let css = 'automationBgDot';
                if (filter.state > 0) {
                    css = 'automationMuteDot';
                }
                let measure = filter.automation[barIdx];
                for (let ii = 0; ii < measure.changes.length; ii++) {
                    let change = measure.changes[ii];
                    let xx = barLeft + MMUtil().set(change.skip).duration(curBar.tempo) * globalCommandDispatcher.cfg().widthDurationRatio;
                    let aubtn = {
                        x: xx,
                        y: top + globalCommandDispatcher.cfg().autoPointHeight * aa,
                        w: globalCommandDispatcher.cfg().autoPointHeight * 0.95,
                        h: globalCommandDispatcher.cfg().autoPointHeight * 0.95,
                        css: css
                    };
                    barOctaveAnchor.content.push(aubtn);
                    if (zIndex < globalCommandDispatcher.cfg().zoomEditSLess) {
                        let yShift = 2 * 0.4;
                        if (zIndex < 2)
                            yShift = 2 * 0.27;
                        if (zIndex < 1)
                            yShift = 2 * 0.20;
                        let editIcon = {
                            x: xx + globalCommandDispatcher.cfg().autoPointHeight / 16,
                            y: top + globalCommandDispatcher.cfg().autoPointHeight / 16 + globalCommandDispatcher.cfg().autoPointHeight * aa + yShift,
                            text: icon_sliders,
                            css: 'samplerDrumDeleteIcon samplerDrumDeleteSize' + zIndex
                        };
                        barOctaveAnchor.content.push(editIcon);
                    }
                }
            }
        }
    }
    autoCellClick(barIdx, barX, yy, zz) {
        let row = Math.floor(yy / globalCommandDispatcher.cfg().autoPointHeight);
        let filter = globalCommandDispatcher.cfg().data.filters[row];
        let info = globalCommandDispatcher.cfg().gridClickInfo(barIdx, barX, zz);
        let change = null;
        let muStart = MMUtil().set(info.start);
        let muEnd = MMUtil().set(info.end);
        let changeIdx = 0;
        for (changeIdx = 0; changeIdx < filter.automation[barIdx].changes.length; changeIdx++) {
            let testChange = filter.automation[barIdx].changes[changeIdx];
            if (muStart.more(testChange.skip)) {
            }
            else {
                if (muEnd.more(testChange.skip)) {
                    change = testChange;
                    break;
                }
            }
        }
        if (change) {
        }
        else {
            globalCommandDispatcher.exe.commitProjectChanges(['filters', row, 'automation', barIdx], () => {
                change = { skip: info.start, stateBlob: '' };
                filter.automation[barIdx].changes.push(change);
            });
        }
        let finfo = globalCommandDispatcher.findPluginRegistrationByKind(filter.kind);
        if (finfo) {
            if (change) {
                globalCommandDispatcher.pointPluginDialog.openPointPluginDialogFrame(row, barIdx, info, changeIdx, change, filter, finfo);
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
        this.resetEditMark();
        this.resetSliderMark();
        this.fanPane.resetPlates(this.fanLayer.anchors, this.spearsLayer.anchors);
        this.fillerAnchor.xx = globalCommandDispatcher.cfg().leftPad;
        this.fillerAnchor.yy = globalCommandDispatcher.cfg().gridTop();
        this.fillerAnchor.ww = globalCommandDispatcher.cfg().wholeWidth() - globalCommandDispatcher.cfg().leftPad - globalCommandDispatcher.cfg().rightPad;
        this.fillerAnchor.hh = globalCommandDispatcher.cfg().gridHeight();
        this.fillerAnchor.content = [];
        this.reFillSingleRatio(false, globalCommandDispatcher.cfg().samplerTop(), globalCommandDispatcher.cfg().samplerHeight(), this.barDrumCount);
        this.reFillSingleRatio(true, globalCommandDispatcher.cfg().gridTop(), globalCommandDispatcher.cfg().gridHeight(), this.barTrackCount);
        this.reFillSingleRatio(false, globalCommandDispatcher.cfg().automationTop(), globalCommandDispatcher.cfg().automationHeight(), this.barAutoCount);
        this.reFillSingleRatio(false, globalCommandDispatcher.cfg().commentsTop(), globalCommandDispatcher.cfg().commentsMaxHeight(), this.barCommentsCount);
        this.gridClickAnchor.xx = globalCommandDispatcher.cfg().leftPad;
        this.gridClickAnchor.yy = globalCommandDispatcher.cfg().gridTop();
        this.gridClickAnchor.ww = globalCommandDispatcher.cfg().timelineWidth();
        this.gridClickAnchor.hh = globalCommandDispatcher.cfg().gridHeight();
        this.gridClickRectangle.x = globalCommandDispatcher.cfg().leftPad;
        this.gridClickRectangle.y = globalCommandDispatcher.cfg().gridTop();
        this.gridClickRectangle.w = globalCommandDispatcher.cfg().timelineWidth();
        this.gridClickRectangle.h = globalCommandDispatcher.cfg().gridHeight();
    }
    resetSliderMark() {
        let mark = globalCommandDispatcher.cfg().slidemark;
        if (mark) {
            let mm = MMUtil();
            let barX = 0;
            let bar = globalCommandDispatcher.cfg().data.timeline[0];
            for (let ii = 0; ii < mark.barIdx; ii++) {
                bar = globalCommandDispatcher.cfg().data.timeline[ii];
                barX = barX + mm.set(bar.metre).duration(bar.tempo)
                    * globalCommandDispatcher.cfg().widthDurationRatio;
            }
            let top = globalCommandDispatcher.cfg().gridTop()
                + globalCommandDispatcher.cfg().gridHeight()
                - mark.pitch
                + 11 - mark.chord.slides[mark.chord.slides.length - 1].delta;
            let len = 0;
            for (let ss = 0; ss < mark.chord.slides.length; ss++) {
                let duration = MMUtil().set(mark.chord.slides[ss].duration);
                len = len + duration.duration(globalCommandDispatcher.cfg().data.timeline[mark.barIdx].tempo) * globalCommandDispatcher.cfg().widthDurationRatio;
            }
            let rr = globalCommandDispatcher.cfg().notePathHeight;
            let skipX = mm.set(mark.chord.skip).duration(bar.tempo) * globalCommandDispatcher.cfg().widthDurationRatio;
            this.sliderAnchor.xx = globalCommandDispatcher.cfg().leftPad + barX + skipX + len - rr / 2 - rr;
            this.sliderAnchor.yy = top - rr / 2;
            this.sliderAnchor.ww = rr;
            this.sliderAnchor.hh = rr;
            this.sliderRectangle.x = this.sliderAnchor.xx;
            this.sliderRectangle.y = this.sliderAnchor.yy;
            this.sliderRectangle.w = rr * 2;
            this.sliderRectangle.h = rr * 2;
            this.sliderRectangle.rx = rr;
            this.sliderRectangle.ry = rr;
            this.sliderRectangle.css = 'slidePointFill';
        }
        else {
            this.sliderRectangle.css = 'markPointNone';
        }
    }
    resetEditMark() {
        let mark = globalCommandDispatcher.cfg().editmark;
        if (mark) {
            let mm = MMUtil();
            let barX = 0;
            let bar = globalCommandDispatcher.cfg().data.timeline[0];
            for (let ii = 0; ii < mark.barIdx; ii++) {
                bar = globalCommandDispatcher.cfg().data.timeline[ii];
                barX = barX + mm.set(bar.metre).duration(bar.tempo)
                    * globalCommandDispatcher.cfg().widthDurationRatio;
            }
            let top = globalCommandDispatcher.cfg().gridTop()
                + globalCommandDispatcher.cfg().gridHeight()
                - mark.pitch;
            let rr = globalCommandDispatcher.cfg().notePathHeight;
            let skipX = mm.set(mark.skip).duration(bar.tempo) * globalCommandDispatcher.cfg().widthDurationRatio;
            this.markAnchor.xx = globalCommandDispatcher.cfg().leftPad + barX + skipX - rr / 2;
            this.markAnchor.yy = top - rr / 2;
            this.markAnchor.ww = rr;
            this.markAnchor.hh = rr;
            this.markRectangle.x = this.markAnchor.xx;
            this.markRectangle.y = this.markAnchor.yy;
            this.markRectangle.w = rr * 2;
            this.markRectangle.h = rr * 2;
            this.markRectangle.rx = rr;
            this.markRectangle.ry = rr;
            this.markRectangle.css = 'markPointFill';
        }
        else {
            this.markRectangle.css = 'markPointNone';
        }
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
        this.spearsSVGgroup = document.getElementById('spearsLayer');
        this.spearsLayer = { g: this.spearsSVGgroup, anchors: [], mode: LevelModes.normal };
        this.markRectangle = {
            x: 0,
            y: 0,
            w: 222,
            h: 222,
            css: 'markPointFill'
        };
        this.sliderRectangle = {
            x: 0,
            y: 0,
            w: 222,
            h: 222,
            css: 'slidePointFill'
        };
        this.gridClickRectangle = {
            x: 0,
            y: 0,
            w: 2222,
            h: 2222,
            css: 'gridRollTracks',
            activation: (x, y) => {
                globalCommandDispatcher.rollTracksClick(x, y);
            }
        };
        for (let ii = 0; ii < zoomPrefixLevelsCSS.length - 1; ii++) {
            let mixerGridAnchor = {
                minZoom: zoomPrefixLevelsCSS[ii].minZoom,
                beforeZoom: zoomPrefixLevelsCSS[ii + 1].minZoom,
                xx: 0, yy: 0, ww: 1, hh: 1, content: []
            };
            this.gridLayers.anchors.push(mixerGridAnchor);
            let mixerTrackAnchor = {
                minZoom: zoomPrefixLevelsCSS[ii].minZoom,
                beforeZoom: zoomPrefixLevelsCSS[ii + 1].minZoom,
                xx: 0, yy: 0, ww: 1, hh: 1, content: []
            };
            this.trackLayers.anchors.push(mixerTrackAnchor);
            let mixerFirstAnchor = {
                minZoom: zoomPrefixLevelsCSS[ii].minZoom,
                beforeZoom: zoomPrefixLevelsCSS[ii + 1].minZoom,
                xx: 0, yy: 0, ww: 1, hh: 1, content: []
            };
            this.firstLayers.anchors.push(mixerFirstAnchor);
            let fanLevelAnchor = {
                minZoom: zoomPrefixLevelsCSS[ii].minZoom,
                beforeZoom: zoomPrefixLevelsCSS[ii + 1].minZoom,
                xx: 0, yy: 0, ww: 1, hh: 1, content: []
            };
            this.fanLayer.anchors.push(fanLevelAnchor);
            let spearAnchor = {
                minZoom: zoomPrefixLevelsCSS[ii].minZoom,
                beforeZoom: zoomPrefixLevelsCSS[ii + 1].minZoom,
                xx: 0, yy: 0, ww: 1, hh: 1, content: []
            };
            this.spearsLayer.anchors.push(spearAnchor);
            this.levels.push(new MixerZoomLevel(ii, mixerGridAnchor, mixerTrackAnchor, mixerFirstAnchor));
        }
        this.gridClickAnchor = {
            minZoom: zoomPrefixLevelsCSS[3].minZoom,
            beforeZoom: zoomPrefixLevelsCSS[6].minZoom,
            xx: 0, yy: 0, ww: 1, hh: 1, content: [this.gridClickRectangle]
        };
        this.gridLayers.anchors.push(this.gridClickAnchor);
        this.markAnchor = {
            minZoom: 0,
            beforeZoom: zoomPrefixLevelsCSS[6].minZoom,
            xx: 0, yy: 0, ww: 1, hh: 1, content: [this.markRectangle]
        };
        this.gridLayers.anchors.push(this.markAnchor);
        this.sliderAnchor = {
            minZoom: 0,
            beforeZoom: zoomPrefixLevelsCSS[6].minZoom,
            xx: 0, yy: 0, ww: 1, hh: 1, content: [this.sliderRectangle]
        };
        this.gridLayers.anchors.push(this.sliderAnchor);
        this.fillerAnchor = {
            minZoom: zoomPrefixLevelsCSS[6].minZoom,
            beforeZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom + 1,
            xx: 0, yy: 0, ww: 1, hh: 1, content: []
        };
        this.gridLayers.anchors.push(this.fillerAnchor);
        return [this.gridLayers, this.trackLayers, this.firstLayers, this.fanLayer, this.spearsLayer];
    }
    reFillSingleRatio(clicks, yy, hh, countFunction) {
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
            let timebar = globalCommandDispatcher.cfg().data.timeline[bb];
            if (!(timebar)) {
                timebar = { tempo: 120, metre: { count: 4, part: 4 } };
            }
            let barwidth = MMUtil().set(timebar.metre).duration(timebar.tempo) * globalCommandDispatcher.cfg().widthDurationRatio;
            let barLeft = barX;
            let fillRectangle = {
                x: globalCommandDispatcher.cfg().leftPad + barX,
                y: yy,
                w: barwidth,
                h: hh,
                css: css
            };
            if (clicks) {
                fillRectangle.activation = (x, y) => {
                    globalCommandDispatcher.rollTracksClick(barLeft + x, yy + y - globalCommandDispatcher.cfg().gridTop());
                };
            }
            this.fillerAnchor.content.push(fillRectangle);
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
            if (filter.automation[bb]) {
                autoCnt = autoCnt + filter.automation[bb].changes.length;
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
            if (!(timebar)) {
                timebar = { tempo: 120, metre: { count: 4, part: 4 } };
            }
            width = MMUtil().set(timebar.metre).duration(timebar.tempo) * globalCommandDispatcher.cfg().widthDurationRatio;
            let barGridAnchor = {
                minZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom, beforeZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex + 1].minZoom,
                xx: left, yy: 0, ww: width, hh: globalCommandDispatcher.cfg().wholeHeight(), content: [], id: 'barGrid' + (ii + Math.random())
            };
            this.zoomGridAnchor.content.push(barGridAnchor);
            let barTracksAnchor = {
                minZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom, beforeZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex + 1].minZoom,
                xx: left, yy: 0, ww: width, hh: globalCommandDispatcher.cfg().wholeHeight(), content: [], id: 'barTrack' + (ii + Math.random())
            };
            this.zoomTracksAnchor.content.push(barTracksAnchor);
            let barFirstAnchor = {
                minZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom, beforeZoom: zoomPrefixLevelsCSS[this.zoomLevelIndex + 1].minZoom,
                xx: left, yy: 0, ww: width, hh: globalCommandDispatcher.cfg().wholeHeight(), content: [], id: 'barFirst' + (ii + Math.random())
            };
            this.zoomFirstAnchor.content.push(barFirstAnchor);
            let mixBar = new MixerBar(ii, left, width, this.zoomLevelIndex, barGridAnchor, barTracksAnchor, barFirstAnchor);
            this.bars.push(mixBar);
            left = left + width;
        }
        this.addDrumLines();
        this.addGridLines(this.zoomGridAnchor);
        this.addCommentLines();
    }
    addDrumLines() {
    }
    addCommentLines() {
    }
    addGridLines(barOctaveAnchor) {
        if (this.zoomLevelIndex < 6) {
            for (let octaveIdx = 0; octaveIdx < globalCommandDispatcher.cfg().drawOctaveCount(); octaveIdx++) {
                let octaveY = globalCommandDispatcher.cfg().gridTop() + octaveIdx * 12 * globalCommandDispatcher.cfg().notePathHeight;
                if (octaveIdx > 0) {
                    let octaveBottomBorder = {
                        x: globalCommandDispatcher.cfg().leftPad,
                        y: octaveY,
                        w: globalCommandDispatcher.cfg().timelineWidth(),
                        h: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom / 32.0,
                        css: 'octaveBottomBorder'
                    };
                    barOctaveAnchor.content.push(octaveBottomBorder);
                }
                if (this.zoomLevelIndex < globalCommandDispatcher.cfg().zoomEditSLess) {
                    for (let kk = 1; kk < 12; kk++) {
                        let pitchY = octaveY + kk * globalCommandDispatcher.cfg().notePathHeight;
                        barOctaveAnchor.content.push({
                            x: globalCommandDispatcher.cfg().leftPad,
                            y: pitchY,
                            w: globalCommandDispatcher.cfg().timelineWidth(),
                            h: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom / 32.0,
                            css: 'interActiveGridLine'
                        });
                    }
                }
            }
            for (let pp = 1; pp < globalCommandDispatcher.cfg().data.percussions.length; pp++) {
                barOctaveAnchor.content.push({
                    x: globalCommandDispatcher.cfg().leftPad,
                    y: globalCommandDispatcher.cfg().samplerTop() + pp * globalCommandDispatcher.cfg().samplerDotHeight,
                    w: globalCommandDispatcher.cfg().timelineWidth(),
                    h: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom / 64.0,
                    css: 'octaveBottomBorder'
                });
            }
            for (let aa = 1; aa < globalCommandDispatcher.cfg().data.filters.length; aa++) {
                barOctaveAnchor.content.push({
                    x: globalCommandDispatcher.cfg().leftPad,
                    y: globalCommandDispatcher.cfg().automationTop() + aa * globalCommandDispatcher.cfg().autoPointHeight,
                    w: globalCommandDispatcher.cfg().timelineWidth(),
                    h: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom / 64.0,
                    css: 'octaveBottomBorder'
                });
            }
            if (this.zoomLevelIndex < globalCommandDispatcher.cfg().zoomEditSLess) {
                for (let tt = 0; tt <= globalCommandDispatcher.cfg().maxCommentRowCount; tt++) {
                    barOctaveAnchor.content.push({
                        x: globalCommandDispatcher.cfg().leftPad,
                        y: globalCommandDispatcher.cfg().commentsTop() + globalCommandDispatcher.cfg().commentsZoomLineY(this.zoomLevelIndex, tt),
                        w: globalCommandDispatcher.cfg().timelineWidth(),
                        h: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom / 32.0,
                        css: 'interActiveGridLine'
                    });
                }
            }
        }
    }
}
class FanPane {
    resetPlates(fanAnchors, spearsAnchors) {
        this.filterIcons = [];
        this.performerIcons = [];
        this.samplerIcons = [];
        for (let ff = 0; ff < globalCommandDispatcher.cfg().data.filters.length; ff++) {
            this.filterIcons.push(new FilterIcon(globalCommandDispatcher.cfg().data.filters[ff].id));
        }
        for (let tt = 0; tt < globalCommandDispatcher.cfg().data.tracks.length; tt++) {
            this.performerIcons.push(new PerformerIcon(globalCommandDispatcher.cfg().data.tracks[tt].performer.id));
        }
        for (let tt = 0; tt < globalCommandDispatcher.cfg().data.percussions.length; tt++) {
            this.samplerIcons.push(new SamplerIcon(globalCommandDispatcher.cfg().data.percussions[tt].sampler.id));
        }
        for (let ii = 0; ii < zoomPrefixLevelsCSS.length - 1; ii++) {
            let css = 'fanConnectionBase fanConnection' + ii;
            let left = globalCommandDispatcher.cfg().leftPad + globalCommandDispatcher.cfg().timelineWidth();
            let gridBorder = {
                x1: left,
                x2: left,
                y1: globalCommandDispatcher.cfg().gridTop(),
                y2: globalCommandDispatcher.cfg().gridTop() + globalCommandDispatcher.cfg().gridHeight(),
                css: css
            };
            spearsAnchors[ii].content.push(gridBorder);
            if (globalCommandDispatcher.cfg().data.percussions.length) {
                let samplerBorder = {
                    x1: left,
                    x2: left,
                    y1: globalCommandDispatcher.cfg().samplerTop(),
                    y2: globalCommandDispatcher.cfg().samplerTop() + globalCommandDispatcher.cfg().samplerHeight(),
                    css: css
                };
                spearsAnchors[ii].content.push(samplerBorder);
            }
            if (globalCommandDispatcher.cfg().data.filters.length) {
                let autoBorder = {
                    x1: left,
                    x2: left,
                    y1: globalCommandDispatcher.cfg().automationTop(),
                    y2: globalCommandDispatcher.cfg().automationTop() + globalCommandDispatcher.cfg().automationHeight(),
                    css: css
                };
                spearsAnchors[ii].content.push(autoBorder);
            }
            this.buildPerformerIcons(fanAnchors[ii], spearsAnchors[ii], ii);
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
            this.samplerIcons[ii].buildSamplerSpot(ii, fanAnchor, spearsAnchor, zidx);
        }
    }
    buildAutoIcons(fanAnchor, spearsAnchor, zidx) {
        for (let ii = 0; ii < this.filterIcons.length; ii++) {
            this.filterIcons[ii].buildAutoSpot(ii, fanAnchor, spearsAnchor, zidx);
        }
    }
    buildOutIcon(fanAnchor, zidx) {
        let speakerCenter = globalCommandDispatcher.cfg().speakerFanPosition();
        let icon = {
            x: speakerCenter.x - globalCommandDispatcher.cfg().speakerIconSize / 2.2,
            y: speakerCenter.y + globalCommandDispatcher.cfg().speakerIconSize / 2.4,
            text: icon_sound_loud,
            css: 'fanSpeakerIconLabel'
        };
        fanAnchor.content.push(icon);
    }
}
class PerformerIcon {
    constructor(performerId) {
        this.performerId = performerId;
    }
    buildPerformerSpot(fanLevelAnchor, spearsAnchor, zidx) {
        let farorder = globalCommandDispatcher.calculateRealTrackFarOrder();
        for (let ff = 0; ff < farorder.length; ff++) {
            let trackNo = farorder[ff];
            if (globalCommandDispatcher.cfg().data.tracks[trackNo].performer.id == this.performerId) {
                this.addPerformerSpot(ff, fanLevelAnchor, spearsAnchor, zidx);
                break;
            }
        }
    }
    addPerformerSpot(farNo, fanLevelAnchor, spearsAnchor, zidx) {
        let farorder = globalCommandDispatcher.calculateRealTrackFarOrder();
        let trackNo = farorder[farNo];
        let track = globalCommandDispatcher.cfg().data.tracks[trackNo];
        let sz = globalCommandDispatcher.cfg().fanPluginIconSize(zidx);
        let left = globalCommandDispatcher.cfg().leftPad + globalCommandDispatcher.cfg().timelineWidth() + globalCommandDispatcher.cfg().padGridFan;
        let top = globalCommandDispatcher.cfg().gridTop();
        let xx = left;
        let yy = top;
        if (track.performer.iconPosition) {
            xx = left + track.performer.iconPosition.x;
            yy = top + track.performer.iconPosition.y;
        }
        let dragAnchor = {
            xx: xx - sz / 2, yy: yy - sz / 2, ww: sz, hh: sz,
            minZoom: fanLevelAnchor.minZoom, beforeZoom: fanLevelAnchor.beforeZoom, content: [], translation: { x: 0, y: 0 }
        };
        fanLevelAnchor.content.push(dragAnchor);
        let dropAnchor = {
            xx: xx - sz / 2, yy: yy - sz / 2, ww: sz, hh: sz,
            minZoom: fanLevelAnchor.minZoom, beforeZoom: fanLevelAnchor.beforeZoom, content: [], translation: { x: 0, y: 0 }
        };
        fanLevelAnchor.content.push(dropAnchor);
        let rec = {
            x: xx - sz / 2, y: yy - sz / 2,
            w: sz, h: sz
        };
        let showSoloOnly = false;
        for (let tt = 0; tt < globalCommandDispatcher.cfg().data.tracks.length; tt++)
            if (globalCommandDispatcher.cfg().data.tracks[tt].performer.state == 2)
                showSoloOnly = true;
        for (let tt = 0; tt < globalCommandDispatcher.cfg().data.percussions.length; tt++)
            if (globalCommandDispatcher.cfg().data.percussions[tt].sampler.state == 2)
                showSoloOnly = true;
        if (zidx < 7) {
            rec.draggable = true;
            let toFilter = null;
            let toSpeaker = false;
            let needReset = false;
            rec.activation = (x, y) => {
                if (!dragAnchor.translation) {
                    dragAnchor.translation = { x: 0, y: 0 };
                }
                dropAnchor.content = [];
                if (x == 0 && y == 0) {
                    if (!track.performer.iconPosition) {
                        track.performer.iconPosition = { x: 0, y: 0 };
                    }
                    if (toSpeaker) {
                        globalCommandDispatcher.exe.commitProjectChanges(['tracks', trackNo, 'performer', 'outputs'], () => {
                            track.performer.outputs.push('');
                        });
                    }
                    else {
                        if (toFilter) {
                            globalCommandDispatcher.exe.commitProjectChanges(['tracks', trackNo, 'performer', 'outputs'], () => {
                                if (toFilter)
                                    track.performer.outputs.push(toFilter.id);
                            });
                        }
                        else {
                            globalCommandDispatcher.exe.commitProjectChanges(['tracks', trackNo, 'performer'], () => {
                                if (dragAnchor.translation) {
                                    track.performer.iconPosition.x = track.performer.iconPosition.x + dragAnchor.translation.x;
                                    track.performer.iconPosition.y = track.performer.iconPosition.y + dragAnchor.translation.y;
                                }
                            });
                        }
                    }
                    dragAnchor.translation = { x: 0, y: 0 };
                    let curfarorder = globalCommandDispatcher.calculateRealTrackFarOrder();
                    let curTrackFar = curfarorder.indexOf(trackNo);
                    if (curTrackFar) {
                        globalCommandDispatcher.exe.commitProjectChanges(['farorder'], () => {
                            let farorder = globalCommandDispatcher.calculateRealTrackFarOrder();
                            let nn = farorder.splice(curTrackFar, 1)[0];
                            farorder.splice(0, 0, nn);
                            globalCommandDispatcher.cfg().data.farorder = farorder;
                        });
                    }
                    globalCommandDispatcher.renderer.tiler.resetAnchor(globalCommandDispatcher.renderer.mixer.fanSVGgroup, fanLevelAnchor, LevelModes.normal);
                }
                else {
                    toSpeaker = false;
                    toFilter = null;
                    dragAnchor.translation.x = dragAnchor.translation.x + x;
                    dragAnchor.translation.y = dragAnchor.translation.y + y;
                    if (track.performer.iconPosition) {
                        let xx = track.performer.iconPosition.x + dragAnchor.translation.x;
                        let yy = track.performer.iconPosition.y + dragAnchor.translation.y;
                        toFilter = globalCommandDispatcher.cfg().dragFindPluginFilterIcon(xx, yy, zidx, track.performer.id, track.performer.outputs);
                        if (toFilter) {
                            needReset = true;
                            let sz = globalCommandDispatcher.cfg().fanPluginIconSize(zidx);
                            let left = globalCommandDispatcher.cfg().leftPad + globalCommandDispatcher.cfg().timelineWidth() + globalCommandDispatcher.cfg().padGridFan;
                            let top = globalCommandDispatcher.cfg().gridTop();
                            let fx = left;
                            let fy = top;
                            if (toFilter.iconPosition) {
                                fx = left + toFilter.iconPosition.x;
                                fy = top + toFilter.iconPosition.y;
                            }
                            dropAnchor.content.push({
                                x: fx - sz * 0.75, y: fy - sz * 0.75,
                                w: sz * 1.5, h: sz * 1.5,
                                rx: sz * 0.75, ry: sz * 0.75,
                                css: 'fanConnectionBase  fanConnection' + zidx
                            });
                            globalCommandDispatcher.renderer.tiler.resetAnchor(globalCommandDispatcher.renderer.mixer.fanSVGgroup, fanLevelAnchor, LevelModes.normal);
                        }
                        else {
                            if (globalCommandDispatcher.cfg().dragCollisionSpeaker(xx, yy, track.performer.outputs)) {
                                needReset = true;
                                toSpeaker = true;
                                let speakerCenter = globalCommandDispatcher.cfg().speakerFanPosition();
                                let rec = {
                                    x: speakerCenter.x - globalCommandDispatcher.cfg().speakerIconSize * 0.55,
                                    y: speakerCenter.y - globalCommandDispatcher.cfg().speakerIconSize * 0.55,
                                    w: globalCommandDispatcher.cfg().speakerIconSize * 1.1,
                                    h: globalCommandDispatcher.cfg().speakerIconSize * 1.1,
                                    rx: globalCommandDispatcher.cfg().speakerIconSize * 0.55,
                                    ry: globalCommandDispatcher.cfg().speakerIconSize * 0.55,
                                    css: 'fanConnectionBase  fanConnection' + zidx
                                };
                                dropAnchor.content = [rec];
                                globalCommandDispatcher.renderer.tiler.resetAnchor(globalCommandDispatcher.renderer.mixer.fanSVGgroup, fanLevelAnchor, LevelModes.normal);
                            }
                            else {
                                if (needReset) {
                                    globalCommandDispatcher.renderer.tiler.resetAnchor(globalCommandDispatcher.renderer.mixer.fanSVGgroup, fanLevelAnchor, LevelModes.normal);
                                    needReset = false;
                                }
                                else {
                                    globalCommandDispatcher.renderer.tiler.updateAnchorStyle(dragAnchor);
                                }
                            }
                        }
                    }
                }
            };
            let dragSamplerCss = 'fanSamplerMoveIconBase';
            if (track.performer.state == 0 && showSoloOnly)
                dragSamplerCss = 'fanSamplerMoveIconDisabled';
            if (track.performer.state == 1)
                dragSamplerCss = 'fanSamplerMoveIconDisabled';
            rec.css = dragSamplerCss + ' fanSamplerMoveIcon' + zidx;
        }
        else {
            rec.css = 'fanConnectionBase fanConnectionSecondary fanConnection' + zidx;
        }
        dragAnchor.content.push(rec);
        spearsAnchor.content.push({
            x: xx - sz / 2 + sz * 0.05, y: yy - sz / 2 + sz * 0.05,
            w: sz * 0.9, h: sz * 0.9,
            css: 'fanConnectionBase fanConnectionSecondary fanConnection' + zidx
        });
        if (zidx < 5) {
            let interSamplerCss = 'fanSamplerInteractionIcon';
            if (track.performer.state == 0 && showSoloOnly)
                interSamplerCss = 'fanSamplerInterDisabledIcon';
            if (track.performer.state == 1)
                interSamplerCss = 'fanSamplerInterDisabledIcon';
            let btn = {
                x: xx - sz / 2,
                y: yy,
                w: sz,
                h: sz / 2,
                css: interSamplerCss + ' fanButton' + zidx,
                activation: (x, y) => {
                    let info = globalCommandDispatcher.findPluginRegistrationByKind(track.performer.kind);
                    globalCommandDispatcher.sequencerPluginDialog.openSequencerPluginDialogFrame(farNo, trackNo, track, info);
                }
            };
            dragAnchor.content.push(btn);
        }
        if (zidx <= 5) {
            let labelSamplerCss = 'fanIconLabel';
            if (track.performer.state == 0 && showSoloOnly)
                labelSamplerCss = 'fanDisabledLabel';
            if (track.performer.state == 1)
                labelSamplerCss = 'fanDisabledLabel';
            let txt = {
                text: track.title,
                x: xx - sz * 0.45,
                y: yy - sz * 0.1,
                css: labelSamplerCss + ' fanIconLabelSize' + zidx
            };
            dragAnchor.content.push(txt);
        }
        let performerFromY = globalCommandDispatcher.cfg().gridTop() + globalCommandDispatcher.cfg().gridHeight() / 2;
        new ControlConnection().addAudioStreamLineFlow(farNo > 0, zidx, performerFromY, xx, yy, spearsAnchor);
        let fol = new FanOutputLine();
        for (let oo = 0; oo < track.performer.outputs.length; oo++) {
            let outId = track.performer.outputs[oo];
            if (outId) {
                fol.connectOutput(outId, track.performer.id, xx, yy, spearsAnchor, fanLevelAnchor, zidx, track.performer.outputs, (x, y) => {
                    globalCommandDispatcher.exe.commitProjectChanges(['tracks', trackNo, 'performer'], () => {
                        let nn = track.performer.outputs.indexOf(outId);
                        if (nn > -1) {
                            track.performer.outputs.splice(nn, 1);
                        }
                    });
                });
            }
            else {
                fol.connectSpeaker(track.performer.id, xx, yy, spearsAnchor, fanLevelAnchor, zidx, track.performer.outputs, (x, y) => {
                    globalCommandDispatcher.exe.commitProjectChanges(['tracks', trackNo, 'performer'], () => {
                        let nn = track.performer.outputs.indexOf('');
                        if (nn > -1) {
                            track.performer.outputs.splice(nn, 1);
                        }
                    });
                });
            }
        }
    }
}
class SamplerIcon {
    constructor(samplerId) {
        this.samplerId = samplerId;
    }
    buildSamplerSpot(percnum, fanLevelAnchor, spearsAnchor, zidx) {
        for (let ii = 0; ii < globalCommandDispatcher.cfg().data.percussions.length; ii++) {
            if (globalCommandDispatcher.cfg().data.percussions[ii].sampler.id == this.samplerId) {
                this.addSamplerSpot(percnum, fanLevelAnchor, spearsAnchor, zidx);
                break;
            }
        }
    }
    addSamplerSpot(percnum, fanLevelAnchor, spearsAnchor, zidx) {
        let sz = globalCommandDispatcher.cfg().fanPluginIconSize(zidx) * 0.66;
        let left = globalCommandDispatcher.cfg().leftPad + globalCommandDispatcher.cfg().timelineWidth() + globalCommandDispatcher.cfg().padGridFan;
        let top = globalCommandDispatcher.cfg().gridTop();
        let xx = left;
        let yy = top;
        let samplerTrack = globalCommandDispatcher.cfg().data.percussions[percnum];
        if (samplerTrack.sampler.iconPosition) {
            xx = left + samplerTrack.sampler.iconPosition.x;
            yy = top + samplerTrack.sampler.iconPosition.y;
        }
        let dragAnchor = {
            xx: xx - sz / 2, yy: yy - sz / 2, ww: sz, hh: sz,
            minZoom: fanLevelAnchor.minZoom, beforeZoom: fanLevelAnchor.beforeZoom, content: [], translation: { x: 0, y: 0 }
        };
        fanLevelAnchor.content.push(dragAnchor);
        let dropAnchor = {
            xx: xx - sz / 2, yy: yy - sz / 2, ww: sz, hh: sz,
            minZoom: fanLevelAnchor.minZoom, beforeZoom: fanLevelAnchor.beforeZoom, content: [], translation: { x: 0, y: 0 }
        };
        fanLevelAnchor.content.push(dropAnchor);
        let rec = {
            x: xx - sz * 0.6,
            y: yy - sz,
            dots: [0, 0, sz * 2 * 0.8, sz, 0, sz * 2]
        };
        let showSoloOnly = false;
        for (let tt = 0; tt < globalCommandDispatcher.cfg().data.tracks.length; tt++)
            if (globalCommandDispatcher.cfg().data.tracks[tt].performer.state == 2)
                showSoloOnly = true;
        for (let tt = 0; tt < globalCommandDispatcher.cfg().data.percussions.length; tt++)
            if (globalCommandDispatcher.cfg().data.percussions[tt].sampler.state == 2)
                showSoloOnly = true;
        if (zidx < 7) {
            let dragSamplerCss = 'fanSamplerMoveIconBase';
            if (samplerTrack.sampler.state == 0 && showSoloOnly)
                dragSamplerCss = 'fanSamplerMoveIconDisabled';
            if (samplerTrack.sampler.state == 1)
                dragSamplerCss = 'fanSamplerMoveIconDisabled';
            rec.draggable = true;
            let toFilter = null;
            let toSpeaker = false;
            let needReset = false;
            rec.activation = (x, y) => {
                if (!dragAnchor.translation) {
                    dragAnchor.translation = { x: 0, y: 0 };
                }
                dropAnchor.content = [];
                if (x == 0 && y == 0) {
                    if (!samplerTrack.sampler.iconPosition) {
                        samplerTrack.sampler.iconPosition = { x: 0, y: 0 };
                    }
                    if (toSpeaker) {
                        globalCommandDispatcher.exe.commitProjectChanges(['percussions', percnum, 'sampler', 'outputs'], () => {
                            samplerTrack.sampler.outputs.push('');
                        });
                    }
                    else {
                        if (toFilter) {
                            globalCommandDispatcher.exe.commitProjectChanges(['percussions', percnum, 'sampler', 'outputs'], () => {
                                if (toFilter)
                                    samplerTrack.sampler.outputs.push(toFilter.id);
                            });
                        }
                        else {
                            globalCommandDispatcher.exe.commitProjectChanges(['percussions', percnum, 'sampler'], () => {
                                if (dragAnchor.translation) {
                                    samplerTrack.sampler.iconPosition.x = samplerTrack.sampler.iconPosition.x + dragAnchor.translation.x;
                                    samplerTrack.sampler.iconPosition.y = samplerTrack.sampler.iconPosition.y + dragAnchor.translation.y;
                                }
                            });
                        }
                    }
                    dragAnchor.translation = { x: 0, y: 0 };
                }
                else {
                    toSpeaker = false;
                    toFilter = null;
                    dragAnchor.translation.x = dragAnchor.translation.x + x;
                    dragAnchor.translation.y = dragAnchor.translation.y + y;
                    if (samplerTrack.sampler.iconPosition) {
                        let xx = samplerTrack.sampler.iconPosition.x + dragAnchor.translation.x;
                        let yy = samplerTrack.sampler.iconPosition.y + dragAnchor.translation.y;
                        toFilter = globalCommandDispatcher.cfg().dragFindPluginFilterIcon(xx, yy, zidx, samplerTrack.sampler.id, samplerTrack.sampler.outputs);
                        if (toFilter) {
                            needReset = true;
                            let sz = globalCommandDispatcher.cfg().fanPluginIconSize(zidx);
                            let left = globalCommandDispatcher.cfg().leftPad + globalCommandDispatcher.cfg().timelineWidth() + globalCommandDispatcher.cfg().padGridFan;
                            let top = globalCommandDispatcher.cfg().gridTop();
                            let fx = left;
                            let fy = top;
                            if (toFilter.iconPosition) {
                                fx = left + toFilter.iconPosition.x;
                                fy = top + toFilter.iconPosition.y;
                            }
                            dropAnchor.content.push({
                                x: fx - sz * 0.75, y: fy - sz * 0.75,
                                w: sz * 1.5, h: sz * 1.5,
                                rx: sz * 0.75, ry: sz * 0.75,
                                css: 'fanConnectionBase  fanConnection' + zidx
                            });
                            globalCommandDispatcher.renderer.tiler.resetAnchor(globalCommandDispatcher.renderer.mixer.fanSVGgroup, fanLevelAnchor, LevelModes.normal);
                        }
                        else {
                            if (globalCommandDispatcher.cfg().dragCollisionSpeaker(xx, yy, samplerTrack.sampler.outputs)) {
                                toSpeaker = true;
                                needReset = true;
                                let speakerCenter = globalCommandDispatcher.cfg().speakerFanPosition();
                                let rec = {
                                    x: speakerCenter.x - globalCommandDispatcher.cfg().speakerIconSize * 0.55,
                                    y: speakerCenter.y - globalCommandDispatcher.cfg().speakerIconSize * 0.55,
                                    w: globalCommandDispatcher.cfg().speakerIconSize * 1.1,
                                    h: globalCommandDispatcher.cfg().speakerIconSize * 1.1,
                                    rx: globalCommandDispatcher.cfg().speakerIconSize * 0.55,
                                    ry: globalCommandDispatcher.cfg().speakerIconSize * 0.55,
                                    css: 'fanConnectionBase  fanConnection' + zidx
                                };
                                dropAnchor.content = [rec];
                                globalCommandDispatcher.renderer.tiler.resetAnchor(globalCommandDispatcher.renderer.mixer.fanSVGgroup, fanLevelAnchor, LevelModes.normal);
                            }
                            else {
                                if (needReset) {
                                    globalCommandDispatcher.renderer.tiler.resetAnchor(globalCommandDispatcher.renderer.mixer.fanSVGgroup, fanLevelAnchor, LevelModes.normal);
                                    needReset = false;
                                }
                                else {
                                    globalCommandDispatcher.renderer.tiler.updateAnchorStyle(dragAnchor);
                                }
                            }
                        }
                    }
                }
            };
            rec.css = dragSamplerCss + ' fanSamplerMoveIcon' + zidx;
        }
        else {
            rec.css = 'fanConnectionBase fanConnectionSecondary fanConnection' + zidx;
        }
        dragAnchor.content.push(rec);
        spearsAnchor.content.push({
            x: xx - sz * 0.6 * 0.9,
            y: yy - sz * 0.9,
            dots: [0, 0, sz * 2 * 0.8 * 0.9, sz * 0.9, 0, sz * 2 * 0.9],
            css: 'fanConnectionBase fanConnectionSecondary fanConnection' + zidx
        });
        if (zidx < 5) {
            let interSamplerCss = 'fanSamplerInteractionIcon';
            if (samplerTrack.sampler.state == 0 && showSoloOnly)
                interSamplerCss = 'fanSamplerInterDisabledIcon';
            if (samplerTrack.sampler.state == 1)
                interSamplerCss = 'fanSamplerInterDisabledIcon';
            let btn = {
                x: xx - sz * 0.6,
                y: yy - sz,
                dots: [0, sz, sz * 2 * 0.8, sz, 0, sz * 2],
                css: interSamplerCss + ' fanButton' + zidx,
                activation: (x, y) => {
                    let info = globalCommandDispatcher.findPluginRegistrationByKind(samplerTrack.sampler.kind);
                    globalCommandDispatcher.samplerPluginDialog.openDrumPluginDialogFrame(percnum, samplerTrack, info);
                }
            };
            dragAnchor.content.push(btn);
        }
        if (zidx <= 5) {
            let labelSamplerCss = 'fanIconLabel';
            if (samplerTrack.sampler.state == 0 && showSoloOnly)
                labelSamplerCss = 'fanDisabledLabel';
            if (samplerTrack.sampler.state == 1)
                labelSamplerCss = 'fanDisabledLabel';
            let txt = {
                text: samplerTrack.title,
                x: xx - sz * 0.5,
                y: yy - sz * 0.2,
                css: labelSamplerCss + ' fanIconLabelSize' + zidx
            };
            dragAnchor.content.push(txt);
        }
        let samplerFromY = globalCommandDispatcher.cfg().samplerTop()
            + (percnum + 0.5) * globalCommandDispatcher.cfg().samplerDotHeight;
        new ControlConnection().addAudioStreamLineFlow(false, zidx, samplerFromY, xx, yy, spearsAnchor);
        let fol = new FanOutputLine();
        for (let oo = 0; oo < samplerTrack.sampler.outputs.length; oo++) {
            let outId = samplerTrack.sampler.outputs[oo];
            if (outId) {
                fol.connectOutput(outId, samplerTrack.sampler.id, xx, yy, spearsAnchor, fanLevelAnchor, zidx, samplerTrack.sampler.outputs, (x, y) => {
                    globalCommandDispatcher.exe.commitProjectChanges(['percussions', percnum, 'sampler', 'outputs'], () => {
                        let nn = samplerTrack.sampler.outputs.indexOf(outId);
                        if (nn > -1) {
                            samplerTrack.sampler.outputs.splice(nn, 1);
                        }
                    });
                });
            }
            else {
                fol.connectSpeaker(samplerTrack.sampler.id, xx, yy, spearsAnchor, fanLevelAnchor, zidx, samplerTrack.sampler.outputs, (x, y) => {
                    globalCommandDispatcher.exe.commitProjectChanges(['percussions', percnum, 'sampler', 'outputs'], () => {
                        let nn = samplerTrack.sampler.outputs.indexOf('');
                        if (nn > -1) {
                            samplerTrack.sampler.outputs.splice(nn, 1);
                        }
                    });
                });
            }
        }
        this.addReorderSamplerIcon(zidx, percnum, fanLevelAnchor);
    }
    addReorderSamplerIcon(zidx, percnum, fanLevelAnchor) {
        if (zidx < 4) {
            let ratio = zoomPrefixLevelsCSS[zidx].minZoom;
            if (zidx >= 3) {
                ratio = ratio / 2;
            }
            let top = globalCommandDispatcher.cfg().samplerTop();
            let xx = globalCommandDispatcher.cfg().leftPad + globalCommandDispatcher.cfg().timelineWidth();
            let sz = globalCommandDispatcher.cfg().samplerDotHeight * 0.75 * ratio;
            let css = 'fanSamplerMoveIconBase fanSamplerMoveIcon' + zidx;
            let yy = top + globalCommandDispatcher.cfg().samplerDotHeight * (percnum + 0.5);
            let dragOrderSampleAnchor = {
                xx: xx - sz / 2, yy: yy - sz / 2, ww: sz, hh: sz,
                minZoom: fanLevelAnchor.minZoom,
                beforeZoom: fanLevelAnchor.beforeZoom,
                content: [],
                translation: { x: 0, y: 0 }
            };
            let reorderSamplerButton = {
                x: xx - 0.5 * sz,
                y: yy - 0.5 * sz,
                w: sz,
                h: sz,
                rx: 0.5 * sz,
                ry: 0.5 * sz,
                css: css,
                draggable: true
            };
            let aim = percnum;
            reorderSamplerButton.activation = (xx, yy) => {
                if (dragOrderSampleAnchor.translation) {
                    if (xx == 0 && yy == 0) {
                        dragOrderSampleAnchor.translation.x = 0;
                        dragOrderSampleAnchor.translation.y = 0;
                        if (aim < 0) {
                            aim = 0;
                        }
                        if (aim > globalCommandDispatcher.cfg().data.percussions.length - 1) {
                            aim = globalCommandDispatcher.cfg().data.percussions.length - 1;
                        }
                        if (aim == percnum) {
                            globalCommandDispatcher.renderer.tiler.updateAnchorStyle(dragOrderSampleAnchor);
                        }
                        else {
                            globalCommandDispatcher.exe.commitProjectChanges(['percussions'], () => {
                                let percTrack = globalCommandDispatcher.cfg().data.percussions.splice(percnum, 1)[0];
                                globalCommandDispatcher.cfg().data.percussions.splice(aim, 0, percTrack);
                            });
                            globalCommandDispatcher.resetProject();
                        }
                    }
                    else {
                        dragOrderSampleAnchor.translation.x = sz / 3;
                        aim = Math.round((dragOrderSampleAnchor.translation.y + yy)
                            / globalCommandDispatcher.cfg().samplerDotHeight) + percnum;
                        if (aim >= 0 && aim < globalCommandDispatcher.cfg().data.percussions.length) {
                            dragOrderSampleAnchor.translation.y = dragOrderSampleAnchor.translation.y + yy;
                        }
                        globalCommandDispatcher.renderer.tiler.updateAnchorStyle(dragOrderSampleAnchor);
                    }
                }
            };
            dragOrderSampleAnchor.content.push(reorderSamplerButton);
            fanLevelAnchor.content.push(dragOrderSampleAnchor);
        }
    }
}
class FilterIcon {
    constructor(filterId) {
        this.filterId = filterId;
    }
    buildAutoSpot(order, fanLevelAnchor, spearsAnchor, zidx) {
        for (let ii = 0; ii < globalCommandDispatcher.cfg().data.filters.length; ii++) {
            if (globalCommandDispatcher.cfg().data.filters[ii].id == this.filterId) {
                let filterTarget = globalCommandDispatcher.cfg().data.filters[ii];
                this.addFilterSpot(order, filterTarget, fanLevelAnchor, spearsAnchor, zidx);
                break;
            }
        }
    }
    addFilterSpot(order, filterTarget, fanLevelAnchor, spearsAnchor, zidx) {
        let sz = globalCommandDispatcher.cfg().fanPluginIconSize(zidx);
        let left = globalCommandDispatcher.cfg().leftPad + globalCommandDispatcher.cfg().timelineWidth() + globalCommandDispatcher.cfg().padGridFan;
        let top = globalCommandDispatcher.cfg().gridTop();
        let xx = left;
        let yy = top;
        if (filterTarget.iconPosition) {
            xx = left + filterTarget.iconPosition.x;
            yy = top + filterTarget.iconPosition.y;
        }
        let dragAnchor = {
            xx: xx - sz / 2, yy: yy - sz / 2, ww: sz, hh: sz,
            minZoom: fanLevelAnchor.minZoom, beforeZoom: fanLevelAnchor.beforeZoom, content: [], translation: { x: 0, y: 0 }
        };
        fanLevelAnchor.content.push(dragAnchor);
        let dropAnchor = {
            xx: xx - sz / 2, yy: yy - sz / 2, ww: sz, hh: sz,
            minZoom: fanLevelAnchor.minZoom, beforeZoom: fanLevelAnchor.beforeZoom, content: [], translation: { x: 0, y: 0 }
        };
        fanLevelAnchor.content.push(dropAnchor);
        let rec = {
            x: xx - sz / 2, y: yy - sz / 2, w: sz,
            rx: sz / 2, ry: sz / 2,
            h: sz
        };
        if (zidx < 7) {
            rec.draggable = true;
            let toFilter = null;
            let toSpeaker = false;
            let needReset = false;
            rec.activation = (x, y) => {
                if (!dragAnchor.translation) {
                    dragAnchor.translation = { x: 0, y: 0 };
                }
                dropAnchor.content = [];
                if (x == 0 && y == 0) {
                    if (!filterTarget.iconPosition) {
                        filterTarget.iconPosition = { x: 0, y: 0 };
                    }
                    if (toSpeaker) {
                        globalCommandDispatcher.exe.commitProjectChanges(['filters', order], () => {
                            filterTarget.outputs.push('');
                        });
                    }
                    else {
                        if (toFilter) {
                            globalCommandDispatcher.exe.commitProjectChanges(['filters', order], () => {
                                if (toFilter)
                                    filterTarget.outputs.push(toFilter.id);
                            });
                        }
                        else {
                            globalCommandDispatcher.exe.commitProjectChanges(['filters', order], () => {
                                if (dragAnchor.translation) {
                                    filterTarget.iconPosition.x = filterTarget.iconPosition.x + dragAnchor.translation.x;
                                    filterTarget.iconPosition.y = filterTarget.iconPosition.y + dragAnchor.translation.y;
                                }
                            });
                        }
                    }
                    dragAnchor.translation = { x: 0, y: 0 };
                    globalCommandDispatcher.renderer.tiler.resetAnchor(globalCommandDispatcher.renderer.mixer.fanSVGgroup, fanLevelAnchor, LevelModes.normal);
                }
                else {
                    toSpeaker = false;
                    toFilter = null;
                    dragAnchor.translation.x = dragAnchor.translation.x + x;
                    dragAnchor.translation.y = dragAnchor.translation.y + y;
                    if (filterTarget.iconPosition) {
                        let xx = filterTarget.iconPosition.x + dragAnchor.translation.x;
                        let yy = filterTarget.iconPosition.y + dragAnchor.translation.y;
                        toFilter = globalCommandDispatcher.cfg().dragFindPluginFilterIcon(xx, yy, zidx, filterTarget.id, filterTarget.outputs);
                        if (toFilter) {
                            needReset = true;
                            let sz = globalCommandDispatcher.cfg().fanPluginIconSize(zidx);
                            let left = globalCommandDispatcher.cfg().leftPad + globalCommandDispatcher.cfg().timelineWidth() + globalCommandDispatcher.cfg().padGridFan;
                            let top = globalCommandDispatcher.cfg().gridTop();
                            let fx = left;
                            let fy = top;
                            if (toFilter.iconPosition) {
                                fx = left + toFilter.iconPosition.x;
                                fy = top + toFilter.iconPosition.y;
                            }
                            dropAnchor.content.push({
                                x: fx - sz * 0.75, y: fy - sz * 0.75,
                                w: sz * 1.5, h: sz * 1.5,
                                rx: sz * 0.75, ry: sz * 0.75,
                                css: 'fanConnectionBase  fanConnection' + zidx
                            });
                            globalCommandDispatcher.renderer.tiler.resetAnchor(globalCommandDispatcher.renderer.mixer.fanSVGgroup, fanLevelAnchor, LevelModes.normal);
                        }
                        else {
                            if (globalCommandDispatcher.cfg().dragCollisionSpeaker(xx, yy, filterTarget.outputs)) {
                                toSpeaker = true;
                                needReset = true;
                                let speakerCenter = globalCommandDispatcher.cfg().speakerFanPosition();
                                let rec = {
                                    x: speakerCenter.x - globalCommandDispatcher.cfg().speakerIconSize * 0.55,
                                    y: speakerCenter.y - globalCommandDispatcher.cfg().speakerIconSize * 0.55,
                                    w: globalCommandDispatcher.cfg().speakerIconSize * 1.1,
                                    h: globalCommandDispatcher.cfg().speakerIconSize * 1.1,
                                    rx: globalCommandDispatcher.cfg().speakerIconSize * 0.55,
                                    ry: globalCommandDispatcher.cfg().speakerIconSize * 0.55,
                                    css: 'fanConnectionBase  fanConnection' + zidx
                                };
                                dropAnchor.content = [rec];
                                globalCommandDispatcher.renderer.tiler.resetAnchor(globalCommandDispatcher.renderer.mixer.fanSVGgroup, fanLevelAnchor, LevelModes.normal);
                            }
                            else {
                                if (needReset) {
                                    globalCommandDispatcher.renderer.tiler.resetAnchor(globalCommandDispatcher.renderer.mixer.fanSVGgroup, fanLevelAnchor, LevelModes.normal);
                                    needReset = false;
                                }
                                else {
                                    globalCommandDispatcher.renderer.tiler.updateAnchorStyle(dragAnchor);
                                }
                            }
                        }
                    }
                }
            };
            if (filterTarget.state == 1) {
                rec.css = 'fanSamplerMoveIconDisabled fanSamplerMoveIcon' + zidx;
            }
            else {
                rec.css = 'fanSamplerMoveIconBase fanSamplerMoveIcon' + zidx;
            }
        }
        else {
            rec.css = 'fanConnectionBase fanConnectionSecondary fanConnection' + zidx;
        }
        dragAnchor.content.push(rec);
        spearsAnchor.content.push({
            x: xx - sz / 2 * 0.9, y: yy - sz / 2 * 0.9,
            w: sz * 0.9,
            rx: sz / 2 * 0.9, ry: sz / 2 * 0.9,
            h: sz * 0.9,
            css: 'fanConnectionBase fanConnectionSecondary fanConnection' + zidx
        });
        if (zidx < 5) {
            let px = globalCommandDispatcher.renderer.tiler.tapPxSize();
            let cssstring = 'fanSamplerInteractionIcon fanButton' + zidx;
            if (filterTarget.state == 1) {
                cssstring = 'fanSamplerInterDisabledIcon fanButton' + zidx;
            }
            let btn = {
                x: xx - sz / 2,
                y: yy,
                points: 'M 0 0 a 1 1 0 0 0 ' + (sz * px) + ' 0 Z',
                css: cssstring,
                activation: (x, y) => {
                    let info = globalCommandDispatcher.findPluginRegistrationByKind(filterTarget.kind);
                    globalCommandDispatcher.filterPluginDialog.openFilterPluginDialogFrame(order, filterTarget, info);
                }
            };
            dragAnchor.content.push(btn);
        }
        if (zidx <= 5) {
            let txt = {
                text: filterTarget.title,
                x: xx - sz * 0.4,
                y: yy - sz * 0.1,
                css: (filterTarget.state == 1 ? 'fanDisabledLabel' : 'fanIconLabel') + ' fanIconLabelSize' + zidx
            };
            dragAnchor.content.push(txt);
        }
        let filterFromY = globalCommandDispatcher.cfg().automationTop() + (order + 0.5) * globalCommandDispatcher.cfg().autoPointHeight;
        let start = globalCommandDispatcher.cfg().leftPad + globalCommandDispatcher.cfg().timelineWidth();
        let css = 'fanConnectionBase fanConnection' + zidx;
        let hoLine = { x1: start, x2: xx, y1: filterFromY, y2: filterFromY, css: css };
        spearsAnchor.content.push(hoLine);
        new SpearConnection().addSpear(false, zidx, xx, filterFromY, sz, xx, yy, spearsAnchor);
        let fol = new FanOutputLine();
        for (let oo = 0; oo < filterTarget.outputs.length; oo++) {
            let outId = filterTarget.outputs[oo];
            if (outId) {
                fol.connectOutput(outId, filterTarget.id, xx, yy, spearsAnchor, fanLevelAnchor, zidx, filterTarget.outputs, (x, y) => {
                    globalCommandDispatcher.exe.commitProjectChanges(['filters', order], () => {
                        let nn = filterTarget.outputs.indexOf(outId);
                        if (nn > -1) {
                            filterTarget.outputs.splice(nn, 1);
                        }
                    });
                });
            }
            else {
                fol.connectSpeaker(filterTarget.id, xx, yy, spearsAnchor, fanLevelAnchor, zidx, filterTarget.outputs, (x, y) => {
                    globalCommandDispatcher.exe.commitProjectChanges(['filters', order], () => {
                        let nn = filterTarget.outputs.indexOf('');
                        if (nn > -1) {
                            filterTarget.outputs.splice(nn, 1);
                        }
                    });
                });
            }
        }
        this.addReorderFilterIcon(zidx, order, fanLevelAnchor);
    }
    addReorderFilterIcon(zidx, order, fanLevelAnchor) {
        if (zidx < 4) {
            let ratio = zoomPrefixLevelsCSS[zidx].minZoom;
            if (zidx >= 3) {
                ratio = ratio / 2;
            }
            let top = globalCommandDispatcher.cfg().automationTop();
            let xx = globalCommandDispatcher.cfg().leftPad + globalCommandDispatcher.cfg().timelineWidth();
            let sz = globalCommandDispatcher.cfg().samplerDotHeight * 0.75 * ratio;
            let css = 'fanSamplerMoveIconBase fanSamplerMoveIcon' + zidx;
            let yy = top + globalCommandDispatcher.cfg().autoPointHeight * (order + 0.5);
            let dragOrderFilterAnchor = {
                xx: xx - sz / 2, yy: yy - sz / 2, ww: sz, hh: sz,
                minZoom: fanLevelAnchor.minZoom,
                beforeZoom: fanLevelAnchor.beforeZoom,
                content: [],
                translation: { x: 0, y: 0 }
            };
            let reorderAutoButton = {
                x: xx - 0.5 * sz,
                y: yy - 0.5 * sz,
                w: sz,
                h: sz,
                rx: 0.5 * sz,
                ry: 0.5 * sz,
                css: css,
                draggable: true
            };
            let aim = order;
            reorderAutoButton.activation = (xx, yy) => {
                if (dragOrderFilterAnchor.translation) {
                    if (xx == 0 && yy == 0) {
                        dragOrderFilterAnchor.translation.x = 0;
                        dragOrderFilterAnchor.translation.y = 0;
                        if (aim < 0) {
                            aim = 0;
                        }
                        if (aim > globalCommandDispatcher.cfg().data.filters.length - 1) {
                            aim = globalCommandDispatcher.cfg().data.filters.length - 1;
                        }
                        if (aim == order) {
                            globalCommandDispatcher.renderer.tiler.updateAnchorStyle(dragOrderFilterAnchor);
                        }
                        else {
                            globalCommandDispatcher.exe.commitProjectChanges(['filters'], () => {
                                let autoTrack = globalCommandDispatcher.cfg().data.filters.splice(order, 1)[0];
                                globalCommandDispatcher.cfg().data.filters.splice(aim, 0, autoTrack);
                            });
                            globalCommandDispatcher.resetProject();
                        }
                    }
                    else {
                        dragOrderFilterAnchor.translation.x = sz / 3;
                        aim = Math.round((dragOrderFilterAnchor.translation.y + yy)
                            / globalCommandDispatcher.cfg().autoPointHeight) + order;
                        if (aim >= 0 && aim < globalCommandDispatcher.cfg().data.filters.length) {
                            dragOrderFilterAnchor.translation.y = dragOrderFilterAnchor.translation.y + yy;
                        }
                        globalCommandDispatcher.renderer.tiler.updateAnchorStyle(dragOrderFilterAnchor);
                    }
                }
            };
            dragOrderFilterAnchor.content.push(reorderAutoButton);
            fanLevelAnchor.content.push(dragOrderFilterAnchor);
        }
    }
}
class ControlConnection {
    addAudioStreamLineFlow(secondary, zIndex, yy, toX, toY, anchor) {
        let left = globalCommandDispatcher.cfg().leftPad + globalCommandDispatcher.cfg().timelineWidth();
        new SpearConnection().addSpear(secondary, zIndex, left, yy, globalCommandDispatcher.cfg().fanPluginIconSize(zIndex), toX, toY, anchor);
    }
}
class SpearConnection {
    constructor() {
    }
    nonan(nn) {
        return (nn) ? nn : 0;
    }
    addSpear(secondary, zidx, fromX, fromY, toSize, toX, toY, anchor) {
        let headLen = 0.5 * (1 + zidx);
        let css = 'fanConnectionBase fanConnection' + zidx;
        if (secondary) {
            css = 'fanConnectionBase fanConnectionSecondary fanConnection' + zidx;
        }
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
    connectOutput(outId, fromID, fromX, fromY, fanLinesAnchor, buttonsAnchor, zidx, outputs, onDelete) {
        let sz = globalCommandDispatcher.cfg().pluginIconSize * zoomPrefixLevelsCSS[zidx].iconRatio;
        for (let ii = 0; ii < globalCommandDispatcher.cfg().data.filters.length; ii++) {
            if (globalCommandDispatcher.cfg().data.filters[ii].id == outId) {
                let toFilter = globalCommandDispatcher.cfg().data.filters[ii];
                let left = globalCommandDispatcher.cfg().leftPad + globalCommandDispatcher.cfg().timelineWidth() + globalCommandDispatcher.cfg().padGridFan;
                let top = globalCommandDispatcher.cfg().gridTop();
                let xx = left;
                let yy = top;
                if (toFilter.iconPosition) {
                    xx = left + toFilter.iconPosition.x;
                    yy = top + toFilter.iconPosition.y;
                }
                new SpearConnection().addSpear(false, zidx, fromX, fromY, sz, xx, yy, fanLinesAnchor);
                this.addDeleteSpear(fromID, toFilter.id, fromX, fromY, sz, xx, yy, buttonsAnchor, zidx, outputs, onDelete);
                break;
            }
        }
    }
    connectSpeaker(fromID, fromX, fromY, fanLinesAnchor, buttonsAnchor, zidx, outputs, onDelete) {
        let spos = globalCommandDispatcher.cfg().speakerFanPosition();
        let speakerX = spos.x;
        let speakerY = spos.y;
        new SpearConnection().addSpear(false, zidx, fromX, fromY, globalCommandDispatcher.cfg().speakerIconSize, speakerX, speakerY, fanLinesAnchor);
        this.addDeleteSpear(fromID, '', fromX, fromY, globalCommandDispatcher.cfg().speakerIconSize, speakerX, speakerY, buttonsAnchor, zidx, outputs, onDelete);
    }
    addDeleteSpear(fromID, toID, fromX, fromY, toSize, toX, toY, anchor, zidx, outputs, onDelete) {
        if (zidx < 5) {
            let diffX = toX - fromX;
            let diffY = toY - fromY;
            let pathLen = Math.sqrt(diffX * diffX + diffY * diffY);
            let spearLen = pathLen - globalCommandDispatcher.cfg().pluginIconSize / 2 - toSize / 2;
            let ratio = spearLen / pathLen;
            let dx = ratio * (toX - fromX) / 2;
            let dy = ratio * (toY - fromY) / 2;
            let deleteButton = {
                x: fromX + dx - globalCommandDispatcher.cfg().pluginIconSize / 2,
                y: fromY + dy - globalCommandDispatcher.cfg().pluginIconSize / 2,
                w: globalCommandDispatcher.cfg().pluginIconSize,
                h: globalCommandDispatcher.cfg().pluginIconSize,
                rx: globalCommandDispatcher.cfg().pluginIconSize,
                ry: globalCommandDispatcher.cfg().pluginIconSize,
                css: 'fanDropConnection fanDropConnection' + zidx,
                activation: onDelete
            };
            anchor.content.push(deleteButton);
            let deleteIcon = {
                x: fromX + dx,
                y: fromY + dy + globalCommandDispatcher.cfg().pluginIconSize / 4,
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
            minZoom: zoomPrefixLevelsCSS[0].minZoom,
            beforeZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom,
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
class UIAction {
}
class UILinkFilterToTarget {
    constructor() {
        this.name = 'UILinkFilterToTarget';
    }
    doAction(blobParameters) {
        return false;
    }
}
class UISeparateFilterFromTarget {
    constructor() {
        this.name = 'UISeparateFilterFromTarget';
    }
    doAction(blobParameters) {
        return false;
    }
}
class UILinkPerformerToTarget {
    constructor() {
        this.name = 'UILinkPerformerToTarget';
    }
    doAction(blobParameters) {
        return false;
    }
}
class UISeparatePerformerFromTarget {
    constructor() {
        this.name = 'UISeparatePerformerFromTarget';
    }
    doAction(blobParameters) {
        return false;
    }
}
class UILinkSamplerToTarget {
    constructor() {
        this.name = 'UILinkSamplerToTarget';
    }
    doAction(blobParameters) {
        return false;
    }
}
class UISeparateSamplerFromTarget {
    constructor() {
        this.name = 'UISeparateSamplerFromTarget';
    }
    doAction(blobParameters) {
        return false;
    }
}
class UnDoReDo {
    constructor() {
        this.uiactions = [
            new UILinkFilterToTarget(),
            new UISeparateFilterFromTarget(),
            new UILinkPerformerToTarget(),
            new UISeparatePerformerFromTarget(),
            new UILinkSamplerToTarget(),
            new UISeparateSamplerFromTarget()
        ];
    }
    doAction(actionID, data) {
        for (let ii = 0; ii < this.uiactions.length; ii++) {
            if (this.uiactions[ii].name == actionID) {
                return this.uiactions[ii].doAction(data);
            }
        }
        return false;
    }
}
let icon_play = '&#xf3aa;';
let icon_pause = '&#xf3a7;';
let icon_hor_menu = '&#xf19c;';
let icon_ver_menu = '&#xf247;';
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
let icon_sound_speaker = '&#xf2d5;';
let icon_hide = '&#xf15b;';
let icon_flash = '&#xf166;';
let icon_close = '&#xf136;';
let icon_refresh = '&#xf1b9;';
let icon_search = '&#xf1c3;';
let icon_splitfan = '&#xf302;';
let icon_undo = '&#xf258;';
let icon_redo = '&#xf253;';
let icon_forward = '&#xf2fd;';
let icon_block = '&#xf119;';
let icon_equalizer = '&#xf39e;';
let icon_sliders = '&#xf3b8;';
let icon_play_circle = '&#xf3a8;';
let icon_close_circle = '&#xf134;';
let icon_delete = '&#xf154;';
let icon_power = '&#xf1af;';
let icon_leftright = '&#xf30d';
let icon_leftrightupdown = '&#xf2f0';
let icon_addbars = '&#xf277';
let icon_deletebars = '&#xf314';
let icon_shiftbarcontent = '&#xf302';
let icon_mergebars = '&#xf232';
let icon_copybarcontent = '&#xf237';
let icon_home = '&#xf175';
let icon_time = '&#xf337';
let icon_hourglass = '&#xf179';
class DebugLayerUI {
    allLayers() {
        return [this.debugLayer];
    }
    setupUI() {
        this.debugRectangle = { x: 0, y: 0, w: 1, h: 1, rx: 10, ry: 10, css: 'debug' };
        this.debugGroup = document.getElementById("debugLayer");
        this.debugAnchor = {
            xx: 0, yy: 0, ww: 1, hh: 1,
            minZoom: zoomPrefixLevelsCSS[0].minZoom,
            beforeZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom,
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
        this.noWarning = true;
    }
    cancelWarning() {
        if (this.onCancel) {
            this.onCancel();
        }
        else {
        }
        this.hideWarning();
    }
    ;
    initDialogUI() {
        let me = this;
        this.warningIcon = { x: 0, y: 0, text: icon_warningPlay, css: 'warningIcon' };
        this.warningInfo1 = { x: 0, y: 0, w: 1, h: 1, href: 'theme/img/mouse.png', css: 'warningInfoIcon' };
        this.warningInfo2 = { x: 0, y: 0, w: 1, h: 1, href: 'theme/img/wheel.png', css: 'warningInfoIcon' };
        this.warningInfo3 = { x: 0, y: 0, w: 1, h: 1, href: 'theme/img/hand.png', css: 'warningInfoIcon' };
        this.warningInfo4 = { x: 0, y: 0, w: 1, h: 1, href: 'theme/img/trackpad.png', css: 'warningInfoIcon' };
        this.warningTitle = { x: 0, y: 0, text: '', css: 'warningTitle' };
        this.warningDescription = { x: 0, y: 0, text: '', css: 'warningDescription' };
        this.warningSmallText = { x: 0, y: 0, text: '', css: 'warningSmallText' };
        this.warningGroup = document.getElementById("warningDialogGroup");
        this.warningRectangle = {
            x: 0, y: 0, w: 1, h: 1, css: 'warningBG', activation: () => {
                globalCommandDispatcher.initAudioFromUI();
                me.cancelWarning();
                globalCommandDispatcher.setupAndStartPlay();
            }
        };
        this.warningAnchor = {
            id: 'warningAnchor', xx: 0, yy: 0, ww: 1, hh: 1,
            minZoom: zoomPrefixLevelsCSS[0].minZoom,
            beforeZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom + 1,
            content: [this.warningRectangle, this.warningIcon,
                this.warningTitle,
                this.warningDescription,
                this.warningSmallText,
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
        this.warningDescription.y = hh / 3 + 2.5;
        this.warningSmallText.x = ww / 2;
        this.warningSmallText.y = hh / 3 + 2.5 + 0.5;
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
    setIcon(icon) {
        this.warningIcon.text = icon;
        this.warningInfo1.href = '';
        this.warningInfo2.href = '';
        this.warningInfo3.href = '';
        this.warningInfo4.href = '';
    }
    showWarning(title, msg, smallMsg, onCancel) {
        this.setIcon(icon_hourglass);
        this.onCancel = onCancel;
        this.warningTitle.text = title;
        this.warningDescription.text = msg;
        this.warningSmallText.text = smallMsg;
        globalCommandDispatcher.renderer.tiler.resetAnchor(this.warningGroup, this.warningAnchor, LevelModes.overlay);
        document.getElementById("warningDialogGroup").style.visibility = "visible";
        this.noWarning = false;
    }
    hideWarning() {
        document.getElementById("warningDialogGroup").style.visibility = "hidden";
        this.onCancel = null;
        this.noWarning = true;
    }
}
function saveLzText2localStorage(name, text) {
    let lzu = new LZUtil();
    let cmpr = lzu.compressToUTF16(text);
    localStorage.setItem(name, cmpr);
}
function saveRawText2localStorage(name, text) {
    localStorage.setItem(name, text);
}
function readLzTextFromlocalStorage(name) {
    try {
        let cmpr = localStorage.getItem(name);
        let lzu = new LZUtil();
        let o = lzu.decompressFromUTF16(cmpr);
        if (o) {
            return o;
        }
        else {
            return '';
        }
    }
    catch (ex) {
        console.log(ex);
    }
    return '';
}
function readRawTextFromlocalStorage(name) {
    try {
        let txt = localStorage.getItem(name);
        return '' + txt;
    }
    catch (ex) {
        console.log(ex);
    }
    return '';
}
function readLzObjectFromlocalStorage(name) {
    try {
        let cmpr = localStorage.getItem(name);
        let lzu = new LZUtil();
        let txt = lzu.decompressFromUTF16(cmpr);
        if (txt) {
            let o = JSON.parse(txt);
            return o;
        }
        else {
            return null;
        }
    }
    catch (ex) {
        console.log(ex);
    }
    return null;
}
function readRawObjectFromlocalStorage(name) {
    try {
        let txt = localStorage.getItem(name);
        if (txt) {
            let o = JSON.parse(txt);
            return o;
        }
        else {
            return null;
        }
    }
    catch (ex) {
        console.log(ex);
    }
    return null;
}
function createNewEmptyProjectData() {
    let pianoID = 'piano' + Math.random();
    let newEmptyProject = {
        title: 'New Project',
        versionCode: '1',
        farorder: [],
        list: false,
        selectedPart: { startMeasure: -1, endMeasure: -1 },
        position: { x: 0, y: -0, z: 33 },
        timeline: [
            { tempo: 120, metre: { count: 4, part: 4 } },
            { tempo: 120, metre: { count: 4, part: 4 } },
            { tempo: 120, metre: { count: 4, part: 4 } },
            { tempo: 120, metre: { count: 4, part: 4 } }
        ],
        tracks: [
            {
                title: "Piano track",
                measures: [{ chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }],
                performer: { id: pianoID, data: '85/14/0', kind: 'miniumpitchchord1', outputs: [''], iconPosition: { x: 50 * Math.random(), y: 100 * Math.random() }, state: 0 }
            }
        ],
        percussions: [],
        comments: [],
        filters: [],
        menuPerformers: false, menuSamplers: false, menuFilters: false, menuActions: false, menuPlugins: false, menuClipboard: false, menuSettings: false
    };
    return newEmptyProject;
}
let _______mzxbxProjectForTesting2 = {
    title: 'test data for debug',
    versionCode: '1',
    list: false,
    farorder: [],
    selectedPart: { startMeasure: 1, endMeasure: 1 },
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
            performer: { id: 'firstPerfoemrID', data: '77', kind: 'zinstr1', outputs: ['track1Volme'], iconPosition: { x: 40, y: 20 }, state: 0 }
        },
        {
            title: "Second track", measures: [
                {
                    chords: [
                        { skip: { count: 3, part: 4 }, pitches: [44, 47, 49], slides: [{ duration: { count: 5, part: 8 }, delta: -5 }] }
                    ]
                },
                { chords: [] },
                { chords: [] },
                { chords: [] },
                { chords: [] },
                { chords: [] },
                { chords: [] },
                { chords: [] },
                { chords: [] },
                { chords: [] }
            ],
            performer: { id: 'secTrPerfId', data: '34', kind: 'zinstr1', outputs: ['track2Volme'], iconPosition: { x: 40, y: 49 }, state: 0 }
        },
        {
            title: "Third track", measures: [
                { chords: [] },
                { chords: [] },
                { chords: [] },
                { chords: [] },
                { chords: [] },
                { chords: [] },
                { chords: [] },
                { chords: [] },
                { chords: [] },
                { chords: [] }
            ],
            performer: { id: 'at3', data: '23', kind: 'zinstr1', outputs: ['track3Volme'], iconPosition: { x: 99, y: 44 }, state: 0 }
        },
        {
            title: "A track 1", measures: [
                { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }
            ],
            performer: { id: 'bt3', data: '29', kind: 'zinstr1', outputs: ['track3Volme'], iconPosition: { x: 88, y: 55 }, state: 0 }
        }, {
            title: "A track 987654321", measures: [
                { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] },
                { chords: [] }
            ],
            performer: { id: 'ct3', data: '44', kind: 'zinstr1', outputs: ['track3Volme'], iconPosition: { x: 77, y: 66 }, state: 0 }
        }
    ],
    percussions: [
        {
            title: "Snare", measures: [
                { skips: [] }, { skips: [{ count: 2, part: 16 }] }, { skips: [] }, { skips: [{ count: 0, part: 16 }] }
            ],
            sampler: { id: 'd1', data: '39', kind: 'zdrum1', outputs: ['drum1Volme'], iconPosition: { x: 22, y: 75 }, state: 0 }
        },
        {
            title: "Snare2", measures: [],
            sampler: { id: 'd2', data: '41', kind: 'zdrum1', outputs: ['drum2Volme'], iconPosition: { x: 22, y: 91 }, state: 0 }
        },
        {
            title: "Snare3", measures: [{ skips: [] }, { skips: [{ count: 1, part: 16 }] }],
            sampler: { id: 'd3', data: '47', kind: 'zdrum1', outputs: ['drum3Volme'], iconPosition: { x: 22, y: 99 }, state: 0 }
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
            id: 'volumeSlide', kind: 'zvolume1', data: '99', outputs: ['masterVolme'],
            title: 't1',
            automation: [{ changes: [] }, {
                    changes: []
                },
                {
                    changes: [
                        { skip: { count: 1, part: 4 }, stateBlob: '99' }
                    ]
                }],
            iconPosition: { x: 152, y: 39 }, state: 0
        },
        {
            id: 'masterVolme', kind: 'zvolume1', data: '99', outputs: [''],
            title: 't2',
            automation: [{ changes: [] }, { changes: [] },
                {
                    changes: []
                },
                { changes: [] }],
            iconPosition: { x: 188, y: 7 }, state: 0
        },
        { id: 'allDrumsVolme', title: 't1', kind: 'zvolume1', data: '99', outputs: ['masterVolme'], iconPosition: { x: 112, y: 87 }, automation: [], state: 0 },
        { id: 'drum1Volme', title: 't1a', kind: 'zvolume1', data: '99', outputs: ['allDrumsVolme'], iconPosition: { x: 52, y: 73 }, automation: [], state: 0 },
        { id: 'drum2Volme', title: 't1s', kind: 'zvolume1', data: '99', outputs: ['allDrumsVolme'], iconPosition: { x: 72, y: 83 }, automation: [], state: 0 },
        { id: 'drum3Volme', title: 't1d', kind: 'zvolume1', data: '99', outputs: ['allDrumsVolme'], iconPosition: { x: 82, y: 119 }, automation: [], state: 0 },
        { id: 'track1Volme', title: 'tf1', kind: 'zvolume1', data: '99', outputs: ['volumeSlide'], iconPosition: { x: 132, y: 23 }, automation: [], state: 0 },
        { id: 'track2Volme', title: 'tg1', kind: 'zvolume1', data: '99', outputs: ['volumeSlide'], iconPosition: { x: 102, y: 64 }, automation: [], state: 0 },
        { id: 'track3Echo', title: 't1h', kind: 'zvecho1', data: '100', outputs: ['volumeSlide'], iconPosition: { x: 72, y: 30 }, automation: [], state: 0 }
    ],
    menuPerformers: false, menuSamplers: false, menuFilters: false, menuActions: false, menuPlugins: false, menuClipboard: false, menuSettings: false
};
class MixerDataMathUtility {
    constructor(data) {
        this.leftPad = 3;
        this.rightPad = 50;
        this.topPad = 12;
        this.parTitleGrid = 5;
        this.padGrid2Sampler = 1;
        this.padSampler2Automation = 1;
        this.padAutomation2Comments = 1;
        this.bottomPad = 11;
        this.notePathHeight = 1.00;
        this.samplerDotHeight = 2;
        this.autoPointHeight = 4;
        this.widthDurationRatio = 27;
        this.octaveDrawCount = 8;
        this.octaveTransposeCount = -1;
        this.maxCommentRowCount = 0;
        this.pluginIconSize = 3;
        this.speakerIconSize = 22;
        this.speakerIconPad = 44;
        this.padGridFan = 15;
        this.zoomEditSLess = 3;
        this.zoomAuxLess = 1;
        this.editmark = null;
        this.slidemark = null;
        this.data = data;
        this.recalculateCommentMax();
    }
    recalculateCommentMax() {
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
    extractDifference(from) {
        return '';
    }
    mergeDifference(diff) {
    }
    wholeWidth() {
        return this.leftPad + this.timelineWidth() + this.padGridFan + this.fanWidth() + this.rightPad;
    }
    fanPluginIconSize(zidx) {
        return this.pluginIconSize * zoomPrefixLevelsCSS[zidx].iconRatio;
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
        ww = ww + this.speakerIconPad + 7 * this.pluginIconSize;
        return ww;
    }
    dragFindPluginFilterIcon(x, y, z, xid, outputs) {
        let sz = this.fanPluginIconSize(z);
        for (let ii = 0; ii < this.data.filters.length; ii++) {
            let plugin = this.data.filters[ii];
            if (plugin.id != xid) {
                if (outputs.indexOf(plugin.id, 0) < 0) {
                    if (plugin.iconPosition) {
                        if (Math.abs(x - plugin.iconPosition.x) < sz * 0.75) {
                            if (Math.abs(y - plugin.iconPosition.y) < sz * 0.75) {
                                return plugin;
                            }
                        }
                    }
                }
            }
        }
        return null;
    }
    dragCollisionSpeaker(fanx, fany, outputs) {
        if (outputs.indexOf('', 0) > -1) {
            return false;
        }
        let sz = this.speakerIconSize;
        let speaker = this.speakerFanPosition();
        let x = fanx + this.leftPad + this.timelineWidth() + this.padGridFan;
        let y = fany + this.gridTop();
        if (Math.abs(x - speaker.x) < sz * 0.75) {
            if (Math.abs(y - speaker.y) < sz * 0.75) {
                return true;
            }
        }
        return false;
    }
    speakerFanPosition() {
        let speakerX = this.wholeWidth() - this.speakerIconPad - this.rightPad + this.speakerIconSize / 2;
        let speakerY = this.wholeHeight() / 2 - this.speakerIconSize / 2;
        return { x: speakerX, y: speakerY };
    }
    heightOfTitle() {
        return 10;
    }
    timelineWidth() {
        let mm = MMUtil();
        let ww = 0;
        for (let ii = 0; ii < this.data.timeline.length; ii++) {
            let timebar = this.data.timeline[ii];
            if (!(timebar)) {
                timebar = { tempo: 120, metre: { count: 4, part: 4 } };
            }
            ww = ww + mm.set(timebar.metre).duration(timebar.tempo) * this.widthDurationRatio;
        }
        return ww;
    }
    commentsMaxHeight() {
        return this.commentsZoomHeight(zoomPrefixLevelsCSS.length - 1);
    }
    wholeHeight() {
        return this.commentsTop()
            + this.commentsMaxHeight()
            + this.bottomPad;
    }
    workHeight() {
        return this.gridHeight()
            + this.padGrid2Sampler + this.samplerHeight()
            + this.padSampler2Automation + this.automationHeight()
            + this.padAutomation2Comments + this.commentsMaxHeight();
    }
    automationHeight() {
        return this.data.filters.length * this.autoPointHeight;
    }
    commentsZoomHeight(zIndex) {
        return (2 + this.maxCommentRowCount) * this.notePathHeight * this.textZoomRatio(zIndex);
    }
    commentsZoomLineY(zIndex, lineNo) {
        let ratio = globalCommandDispatcher.cfg().textZoomRatio(zIndex);
        let nextY = (1 + lineNo) * globalCommandDispatcher.cfg().notePathHeight * ratio;
        return nextY;
    }
    commentsAverageFillHeight() {
        let rcount = this.maxCommentRowCount;
        if (rcount > 3) {
            rcount = 3;
        }
        return (2 + rcount) * this.notePathHeight * 8;
    }
    automationTop() {
        return this.samplerTop() + this.samplerHeight() + this.padSampler2Automation;
    }
    commentsTop() {
        return this.automationTop()
            + this.automationHeight()
            + this.padAutomation2Comments;
    }
    gridTop() {
        return this.topPad + this.heightOfTitle() + this.parTitleGrid;
    }
    drawOctaveCount() {
        return this.octaveDrawCount;
    }
    transposeOctaveCount() {
        return this.octaveTransposeCount;
    }
    gridHeight() {
        return this.notePathHeight * this.drawOctaveCount() * 12;
    }
    samplerHeight() {
        return this.data.percussions.length * this.samplerDotHeight;
    }
    samplerTop() {
        return this.gridTop() + this.gridHeight() + this.padGrid2Sampler;
    }
    findFilterTarget(filterId) {
        if (this.data) {
            for (let nn = 0; nn < this.data.filters.length; nn++) {
                let filter = this.data.filters[nn];
                if (filter.id == filterId) {
                    return filter;
                }
            }
        }
        return null;
    }
    textZoomRatio(zIndex) {
        let txtZoomRatio = 1;
        if (zIndex > 2)
            txtZoomRatio = 2;
        if (zIndex > 3)
            txtZoomRatio = 4;
        if (zIndex > 4)
            txtZoomRatio = 8;
        return txtZoomRatio;
    }
    gridClickInfo(barIdx, barX, zoomIdx) {
        let curBar = this.data.timeline[barIdx];
        let curDur = barX / this.widthDurationRatio;
        let start = MMUtil().set({ count: 0, part: 1 });
        let end = MMUtil().set({ count: 0, part: 1 });
        let lineCount = 0;
        let zoomInfo = zoomPrefixLevelsCSS[zoomIdx];
        while (true) {
            let line = zoomInfo.gridLines[lineCount];
            end = end.plus(line.duration);
            if (end.duration(curBar.tempo) > curDur) {
                break;
            }
            start = end.simplyfy();
            lineCount++;
            if (lineCount >= zoomInfo.gridLines.length) {
                lineCount = 0;
            }
        }
        let len = end.minus(start);
        return { start: start, length: len, end: end };
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
class LZUtil {
    constructor() {
        this.keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        this.keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
        this.baseReverseDic = {};
    }
    getBaseValue(alphabet, character) {
        if (!this.baseReverseDic[alphabet]) {
            this.baseReverseDic[alphabet] = {};
            for (let i = 0; i < alphabet.length; i++) {
                this.baseReverseDic[alphabet][alphabet.charAt(i)] = i;
            }
        }
        return this.baseReverseDic[alphabet][character];
    }
    _compress(uncompressed, bitsPerChar, getCharFromInt) {
        if (uncompressed == null) {
            return "";
        }
        let value;
        const context_dictionary = {};
        const context_dictionaryToCreate = {};
        let context_c = "";
        let context_wc = "";
        let context_w = "";
        let context_enlargeIn = 2;
        let context_dictSize = 3;
        let context_numBits = 2;
        const context_data = [];
        let context_data_val = 0;
        let context_data_position = 0;
        for (let ii = 0; ii < uncompressed.length; ii += 1) {
            context_c = uncompressed.charAt(ii);
            if (!Object.prototype.hasOwnProperty.call(context_dictionary, context_c)) {
                context_dictionary[context_c] = context_dictSize++;
                context_dictionaryToCreate[context_c] = true;
            }
            context_wc = context_w + context_c;
            if (Object.prototype.hasOwnProperty.call(context_dictionary, context_wc)) {
                context_w = context_wc;
            }
            else {
                if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
                    if (context_w.charCodeAt(0) < 256) {
                        for (let i = 0; i < context_numBits; i++) {
                            context_data_val = context_data_val << 1;
                            if (context_data_position == bitsPerChar - 1) {
                                context_data_position = 0;
                                context_data.push(getCharFromInt(context_data_val));
                                context_data_val = 0;
                            }
                            else {
                                context_data_position++;
                            }
                        }
                        value = context_w.charCodeAt(0);
                        for (let i = 0; i < 8; i++) {
                            context_data_val = (context_data_val << 1) | (value & 1);
                            if (context_data_position == bitsPerChar - 1) {
                                context_data_position = 0;
                                context_data.push(getCharFromInt(context_data_val));
                                context_data_val = 0;
                            }
                            else {
                                context_data_position++;
                            }
                            value = value >> 1;
                        }
                    }
                    else {
                        value = 1;
                        for (let i = 0; i < context_numBits; i++) {
                            context_data_val = (context_data_val << 1) | value;
                            if (context_data_position == bitsPerChar - 1) {
                                context_data_position = 0;
                                context_data.push(getCharFromInt(context_data_val));
                                context_data_val = 0;
                            }
                            else {
                                context_data_position++;
                            }
                            value = 0;
                        }
                        value = context_w.charCodeAt(0);
                        for (let i = 0; i < 16; i++) {
                            context_data_val = (context_data_val << 1) | (value & 1);
                            if (context_data_position == bitsPerChar - 1) {
                                context_data_position = 0;
                                context_data.push(getCharFromInt(context_data_val));
                                context_data_val = 0;
                            }
                            else {
                                context_data_position++;
                            }
                            value = value >> 1;
                        }
                    }
                    context_enlargeIn--;
                    if (context_enlargeIn == 0) {
                        context_enlargeIn = Math.pow(2, context_numBits);
                        context_numBits++;
                    }
                    delete context_dictionaryToCreate[context_w];
                }
                else {
                    value = context_dictionary[context_w];
                    for (let i = 0; i < context_numBits; i++) {
                        context_data_val = (context_data_val << 1) | (value & 1);
                        if (context_data_position == bitsPerChar - 1) {
                            context_data_position = 0;
                            context_data.push(getCharFromInt(context_data_val));
                            context_data_val = 0;
                        }
                        else {
                            context_data_position++;
                        }
                        value = value >> 1;
                    }
                }
                context_enlargeIn--;
                if (context_enlargeIn == 0) {
                    context_enlargeIn = Math.pow(2, context_numBits);
                    context_numBits++;
                }
                context_dictionary[context_wc] = context_dictSize++;
                context_w = String(context_c);
            }
        }
        if (context_w !== "") {
            if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
                if (context_w.charCodeAt(0) < 256) {
                    for (let i = 0; i < context_numBits; i++) {
                        context_data_val = context_data_val << 1;
                        if (context_data_position == bitsPerChar - 1) {
                            context_data_position = 0;
                            context_data.push(getCharFromInt(context_data_val));
                            context_data_val = 0;
                        }
                        else {
                            context_data_position++;
                        }
                    }
                    value = context_w.charCodeAt(0);
                    for (let i = 0; i < 8; i++) {
                        context_data_val = (context_data_val << 1) | (value & 1);
                        if (context_data_position == bitsPerChar - 1) {
                            context_data_position = 0;
                            context_data.push(getCharFromInt(context_data_val));
                            context_data_val = 0;
                        }
                        else {
                            context_data_position++;
                        }
                        value = value >> 1;
                    }
                }
                else {
                    value = 1;
                    for (let i = 0; i < context_numBits; i++) {
                        context_data_val = (context_data_val << 1) | value;
                        if (context_data_position == bitsPerChar - 1) {
                            context_data_position = 0;
                            context_data.push(getCharFromInt(context_data_val));
                            context_data_val = 0;
                        }
                        else {
                            context_data_position++;
                        }
                        value = 0;
                    }
                    value = context_w.charCodeAt(0);
                    for (let i = 0; i < 16; i++) {
                        context_data_val = (context_data_val << 1) | (value & 1);
                        if (context_data_position == bitsPerChar - 1) {
                            context_data_position = 0;
                            context_data.push(getCharFromInt(context_data_val));
                            context_data_val = 0;
                        }
                        else {
                            context_data_position++;
                        }
                        value = value >> 1;
                    }
                }
                context_enlargeIn--;
                if (context_enlargeIn == 0) {
                    context_enlargeIn = Math.pow(2, context_numBits);
                    context_numBits++;
                }
                delete context_dictionaryToCreate[context_w];
            }
            else {
                value = context_dictionary[context_w];
                for (let i = 0; i < context_numBits; i++) {
                    context_data_val = (context_data_val << 1) | (value & 1);
                    if (context_data_position == bitsPerChar - 1) {
                        context_data_position = 0;
                        context_data.push(getCharFromInt(context_data_val));
                        context_data_val = 0;
                    }
                    else {
                        context_data_position++;
                    }
                    value = value >> 1;
                }
            }
            context_enlargeIn--;
            if (context_enlargeIn == 0) {
                context_enlargeIn = Math.pow(2, context_numBits);
                context_numBits++;
            }
        }
        value = 2;
        for (let i = 0; i < context_numBits; i++) {
            context_data_val = (context_data_val << 1) | (value & 1);
            if (context_data_position == bitsPerChar - 1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
            }
            else {
                context_data_position++;
            }
            value = value >> 1;
        }
        let loop = true;
        do {
            context_data_val = context_data_val << 1;
            if (context_data_position == bitsPerChar - 1) {
                context_data.push(getCharFromInt(context_data_val));
                loop = false;
            }
            else
                context_data_position++;
        } while (loop);
        return context_data.join("");
    }
    _decompress(length, resetValue, getNextValue) {
        const dictionary = [];
        const result = [];
        const data = {
            val: getNextValue(0),
            position: resetValue,
            index: 1,
        };
        let enlargeIn = 4;
        let dictSize = 4;
        let numBits = 3;
        let entry = "";
        let c;
        let bits = 0;
        let maxpower = Math.pow(2, 2);
        let power = 1;
        for (let i = 0; i < 3; i += 1) {
            dictionary[i] = String(i);
        }
        while (power != maxpower) {
            const resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
                data.position = resetValue;
                data.val = getNextValue(data.index++);
            }
            bits |= (resb > 0 ? 1 : 0) * power;
            power <<= 1;
        }
        switch (bits) {
            case 0:
                bits = 0;
                maxpower = Math.pow(2, 8);
                power = 1;
                while (power != maxpower) {
                    const resb = data.val & data.position;
                    data.position >>= 1;
                    if (data.position == 0) {
                        data.position = resetValue;
                        data.val = getNextValue(data.index++);
                    }
                    bits |= (resb > 0 ? 1 : 0) * power;
                    power <<= 1;
                }
                c = String.fromCharCode(bits);
                break;
            case 1:
                bits = 0;
                maxpower = Math.pow(2, 16);
                power = 1;
                while (power != maxpower) {
                    const resb = data.val & data.position;
                    data.position >>= 1;
                    if (data.position == 0) {
                        data.position = resetValue;
                        data.val = getNextValue(data.index++);
                    }
                    bits |= (resb > 0 ? 1 : 0) * power;
                    power <<= 1;
                }
                c = String.fromCharCode(bits);
                break;
            case 2:
                return "";
        }
        if (c === undefined) {
            throw new Error("No character found");
        }
        dictionary[3] = String(c);
        let w = String(c);
        result.push(String(c));
        const forever = true;
        while (forever) {
            if (data.index > length) {
                return "";
            }
            bits = 0;
            maxpower = Math.pow(2, numBits);
            power = 1;
            while (power != maxpower) {
                const resb = data.val & data.position;
                data.position >>= 1;
                if (data.position == 0) {
                    data.position = resetValue;
                    data.val = getNextValue(data.index++);
                }
                bits |= (resb > 0 ? 1 : 0) * power;
                power <<= 1;
            }
            switch ((c = bits)) {
                case 0:
                    bits = 0;
                    maxpower = Math.pow(2, 8);
                    power = 1;
                    while (power != maxpower) {
                        const resb = data.val & data.position;
                        data.position >>= 1;
                        if (data.position == 0) {
                            data.position = resetValue;
                            data.val = getNextValue(data.index++);
                        }
                        bits |= (resb > 0 ? 1 : 0) * power;
                        power <<= 1;
                    }
                    dictionary[dictSize++] = String.fromCharCode(bits);
                    c = dictSize - 1;
                    enlargeIn--;
                    break;
                case 1:
                    bits = 0;
                    maxpower = Math.pow(2, 16);
                    power = 1;
                    while (power != maxpower) {
                        const resb = data.val & data.position;
                        data.position >>= 1;
                        if (data.position == 0) {
                            data.position = resetValue;
                            data.val = getNextValue(data.index++);
                        }
                        bits |= (resb > 0 ? 1 : 0) * power;
                        power <<= 1;
                    }
                    dictionary[dictSize++] = String.fromCharCode(bits);
                    c = dictSize - 1;
                    enlargeIn--;
                    break;
                case 2:
                    return result.join("");
            }
            if (enlargeIn == 0) {
                enlargeIn = Math.pow(2, numBits);
                numBits++;
            }
            if (dictionary[c]) {
                entry = String(dictionary[c]);
            }
            else {
                if (c === dictSize) {
                    entry = w + w.charAt(0);
                }
                else {
                    return null;
                }
            }
            result.push(entry);
            dictionary[dictSize++] = w + entry.charAt(0);
            enlargeIn--;
            w = entry;
            if (enlargeIn == 0) {
                enlargeIn = Math.pow(2, numBits);
                numBits++;
            }
        }
    }
    compressToUTF16(input) {
        if (input) {
            return this._compress(input, 15, (a) => String.fromCharCode(a + 32)) + " ";
        }
        else {
            return '';
        }
    }
    decompressFromUTF16(compressed) {
        if (compressed) {
            return this._decompress(compressed.length, 16384, (index) => compressed.charCodeAt(index) - 32);
        }
        else
            return null;
    }
}
let styleText = '#topbox { width:100%; height2:1cm; background-color: #330099; flex-basis: auto; flex-shrink: 0; flex-grow: 0; } #innerframe { width:100%; height:1cm; background-color: #999900; border:0; }:root { --tapSize: 1cm; } /* cyrillic @font-face { font-family: "Poiret One"; font-style: normal; font-weight: 400; font-display: swap; src: url(poiretone/poiretonecyrillic.woff2) format("woff2"); unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116; } */ /* latin-ext @font-face { font-family: "Poiret One"; font-style: normal; font-weight: 400; font-display: swap; src: url(poiretone/poiretonelatinext.woff2) format("woff2"); unicode-range: U+0100-02AF, U+0304, U+0308, U+0329, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF; } */ /* latin @font-face { font-family: "Poiret One"; font-style: normal; font-weight: 400; font-display: swap; src: url(poiretone/poiretonelatin.woff2) format("woff2"); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; } */ /* @font-face { font-family: "Roboto"; src: url(roboto/Roboto-Regular.ttf); } */ /* @font-face { font-family: "MontserratAlternates-Regular"; src: url(MontserratAlternates/MontserratAlternates-Regular.ttf); }*/ /* @font-face { font-family: "Brahms"; src: url("ofont.ru_Brahms Gotisch.ttf"); }*/ @font-face { font-family: "MontserratAlternates"; src: url("MontserratAlternates/MontserratAlternates-Regular.ttf"); } ::-webkit-scrollbar2 { display: none; } :root { --font-ratio2: 1; --font-ratio: 1.0; } :root { --tapSize: 1cm; } :root { --label-4cm: calc(4.0*var(--font-ratio)*var(--tapSize)); --label-3cm: calc(3.0*var(--font-ratio)*var(--tapSize)); --label-2cm: calc(2.0*var(--font-ratio)*var(--tapSize)); --label-1cm: calc(1.0*var(--font-ratio)*var(--tapSize)); --label-075cm: calc(0.75*var(--font-ratio)*var(--tapSize)); --label-05cm: calc(0.5*var(--font-ratio)*var(--tapSize)); --label-04cm: calc(0.4*var(--font-ratio)*var(--tapSize)); --label-025cm: calc(0.25*var(--font-ratio)*var(--tapSize)); --label-0125cm: calc(0.125*var(--font-ratio)*var(--tapSize)); --icon-4cm: calc(4.0*var(--tapSize)); --icon-2cm: calc(2.0*var(--tapSize)); --icon-1cm: calc(1.0*var(--tapSize)); --icon-075cm: calc(0.75*var(--tapSize)); --icon-05cm: calc(0.5*var(--tapSize)); --icon-04cm: calc(0.4*var(--tapSize)); --icon-033cm: calc(0.33*var(--tapSize)); } :root { --color-debug: #c00; /* --color-shadow: #00000066; --color-background: #000000ff; --color-panel: #114466ff; --color-focus: #009933ff; --color-interactive: #cc6633ff; --color-panel: #44ccffff; --color-subtext: #99ccccff; (((--main-color))): #ddeeffff; */ --background-color: #030900; --main-color: #fff; --drag-color: #066; --line-color: #cff; --click-color: #360; --click-color50: color-mix(in lab, transparent 50%, var(--click-color)); --line-color90: color-mix(in lab, transparent 90%, var(--line-color)); --line-color75: color-mix(in lab, transparent 75%, var(--line-color)); --line-color50: color-mix(in lab, transparent 50%, var(--line-color)); --line-color30: color-mix(in lab, transparent 30%, var(--line-color)); --line-color15: color-mix(in lab, transparent 15%, var(--line-color)); --line-color6: color-mix(in lab, transparent 6%, var(--line-color)); --background-color10: color-mix(in lab, transparent 10%, var(--background-color)); --selectedtime-color22: color-mix(in lab, transparent 85%, var(--line-color)); --selectedtime-color: color-mix(in lab, transparent 66%, var(--drag-color)); --selectedbgground-color: color-mix(in lab, transparent 0%, var(--background-color)); --unselectedbg-color: color-mix(in lab, transparent 0%, var(--background-color)); --disable-drag-color: color-mix(in lab, transparent 75%, var(--drag-color)); --disable-click-color: color-mix(in lab, transparent 75%, var(--click-color)); } :root { --fog-color: color-mix(in lab, transparent 10%, var(--background-color)); --back-color: color-mix(in lab, transparent 3%, var(--background-color)); --shadow-color: color-mix(in lab, transparent 75%, var(--main-color)); --plugintitle-color: var(--drag-color); } #file_midi_input { display: none; } #file_gp35_input { display: none; } @keyframes focusFlashFill { 0% { fill: var(--main-color) } 40% { fill: var(--main-color) } 60% { fill: var(--drag-color) } 80% { fill: var(--click-color) } 100% { fill: var(--main-color) } } html { width: 100%; height: 100%; margin: 0px; padding: 0px; font-family2: "Poiret One"; font-family2: "Fontquan-XinYiJiXiangSong-Regular"; background-color2: #ff0000; user-select: none; background-color2: var(--main-color); } body { width: 100%; height: 100%; margin: 0px; padding: 0px; touch-action: manipulation; background-color2: #ff00ff; cursor: grab; background-color2: var(--main-color); overflow: hidden; } #pagediv { width: 100%; height: 100%; margin: 0px; padding: 0px; min-height: 100%; background-image2: url("bg/burevestnik.jpg"); background-repeat2: no-repeat; background-size2: cover; background-position2: center; display: flex; flex-direction: column; background: var(--background-color); } #tileLevelSVG { width: 100%; user-select: none; touch-action: manipulation; background-size: cover; stroke-linecap: round; margin: 0px; padding: 0px; background2: var(--unselectedbg-color); flex-basis: 0; flex-shrink: 1; flex-grow: 1; background-image22: url("bg/blue.png"); background-size: cover; background-position-x: center; background-position-y: center; background: var(--background-color); } .debug { fill: var(--color-debug); fill-opacity: 30%; stroke: var(--color-debug); stroke-opacity: 90%; stroke-width: 0.3%; } .fillShadow { fill: var(--shadow-color); } .warningAnchor22 { cursor: default; } .warningBG { fill: var(--fog-color); cursor: default; } .warningIcon { font-size222: calc(4*var(--tapSize)); font-size: var(--icon-4cm); fill: var(--line-color); text-anchor: middle; font-family: "Material-Design-Iconic-Font"; pointer-events: none; } .warningTitle { font-size222: calc(0.75*var(--tapSize)); font-size: var(--label-075cm); fill: var(--main-color); text-anchor: middle; pointer-events: none; } .warningDescription { font-size222: calc(0.33*var(--tapSize)); font-size: var(--label-04cm); fill: var(--line-color); text-anchor: middle; pointer-events: none; width2:50%; } .warningSmallText { font-size222: calc(0.33*var(--tapSize)); font-size: var(--label-025cm); fill: var(--line-color); text-anchor: middle; pointer-events: none; width2:50%; } .warningInfoIcon { fill: #ff993300; } .mixTextFill { fill: var(--main-color); stroke: none; } .mixSubtextFill { fill: var(--drag-color); stroke: none; } .mixFocusFill { fill: var(--color-focus); stroke: none; } .leftPanelBG { fill: color-mix(in lab, transparent 15%, var(--color-panel)) } .gridRollTracks { fill: #ffffff01 }.samplerRowBorder{ fill: var(--line-color); fill-opacity:25%; stroke: none; } .samplerDrumDotFocused{ fill: var(--main-color); fill-opacity:99%; stroke: none; } .samplerDrumDotBg{ fill: var(--main-color); fill-opacity2:75%; stroke: none; pointer-events: none; } .samplerDrumMuteBg{ fill: var(--main-color); fill-opacity:10%; stroke: none; pointer-events: none; } .samplerDrumDotActive23542354{ fill: var(--click-color); fill-opacity2:75%; stroke: none; } .samplerDrumDotLine{ fill: var(--main-color); fill-opacity33:95%; stroke: none; pointer-events: none; } .samplerDrumMuteLine{ fill: var(--main-color); fill-opacity:10%; stroke: none; pointer-events: none; } .samplerDrumDeleteIcon{ fill: var(--click-color); stroke: none; font-family: "Material-Design-Iconic-Font"; pointer-events: none; } .samplerDrumDeleteSize2{ font-size: var(--icon-075cm); } .samplerDrumDeleteSize1{ font-size: var(--icon-05cm); } .samplerDrumDeleteSize0{ font-size: var(--icon-033cm); } .samplerDrumDragSpot{ fill: var(--drag-color); stroke: none; cursor: ew-resize; stroke: var(--main-color); stroke-width: 0.015cm; } .samplerDrumDragIcon{ font-size: var(--icon-05cm); font-family: "Material-Design-Iconic-Font"; fill: var(--main-color); stroke: none; pointer-events: none; }.rightMenuPanel { fill: var(--background-color); } .rectangleDragItem { fill: var(--drag-color); stroke: var(--main-color); stroke-width: 0.01cm; } .dragDropMixerItem { visibility: visible; } .noDragDropMixerItem { visibility: hidden; } .rightMenuDelimiterLine { fill: var(--shadow-color); pointer-events: none; } .rightMenuFocusedDelimiter { fill: var(--main-color); pointer-events: none; animation: focusFlashFill 4s linear infinite; } .rightMenuLabel { fill: var(--main-color); font-size: var(--label-04cm); pointer-events: none; } .rightMenuLightLabel { fill: var(--shadow-color); font-size: var(--label-04cm); pointer-events: none; } .rightMenuSubLabel { fill: var(--drag-color); font-size: var(--label-04cm); pointer-events: none; } .rightMenuItemDragBG { stroke: var(--main-color); stroke-width: 0.01cm; fill: var(--drag-color); cursor: move; } .rightMenuItemActionBG { stroke: var(--main-color); stroke-width: 0.01cm; fill: var(--click-color); } .rightMenuItemDisabledBG { stroke: var(--main-color); stroke-width: 0.01cm; fill: none; } .rightMenuItemSubActionBG { fill: none; stroke: var(--click-color); stroke-width: 0.05cm; } .rightMenuButtonLabel { fill: var(--click-color); text-anchor: middle; font-size: var(--label-05cm); pointer-events: none; font-family: "Material-Design-Iconic-Font"; } .rightMenuIconLabel { fill: var(--main-color); text-anchor: middle; font-size: var(--icon-05cm); pointer-events: none; font-family: "Material-Design-Iconic-Font"; } .menuButtonCircle { fill: var(--click-color); stroke: var(--main-color); stroke-width: 0.015cm; } .menuButtonLabel { fill: var(--main-color); text-anchor: middle; font-size: var(--icon-05cm); pointer-events: none; font-family: "Material-Design-Iconic-Font"; } .currentTitleLabel { fill: var(--line-color); font-size: var(--label-05cm); pointer-events: none; opacity: 50%; transform: rotate(90deg); transform-origin: 0cm 0cm; }.leftBlackKey { fill: var(--drag-color); } .leftKeyWhite { fill: var(--main-color); } .octaveLabel025 { fill: var(--line-color); fill-opacity: 50%; font-size: calc(1*0.25*var(--tapSize)); } .octaveLabel05 { fill: var(--line-color); fill-opacity: 50%; font-size: calc(1*0.5*var(--tapSize)); } .octaveLabel1 { fill: var(--line-color); fill-opacity: 50%; font-size: calc(1*var(--tapSize)); } .octaveLabel2 { fill: var(--line-color); fill-opacity: 50%; font-size: calc(1*2*var(--tapSize)); } .octaveLabel4 { fill: var(--line-color); fill-opacity: 50%; font-size: calc(1*4*var(--tapSize)); } .octaveLabel8 { fill: var(--line-color); fill-opacity: 50%; font-size: calc(1*8*var(--tapSize)); } .octaveLabel16 { fill: var(--line-color); fill-opacity: 50%; font-size: calc(1*16*var(--tapSize)); } .octaveLabel32 { fill: var(--line-color); fill-opacity: 50%; font-size: calc(1*32*var(--tapSize)); } .octaveLabel64 { fill: var(--line-color); fill-opacity: 50%; font-size: calc(1*64*var(--tapSize)); } .octaveLabel128 { fill: var(--line-color); fill-opacity: 50%; font-size: calc(1*128*var(--tapSize)); } .octaveSubLabel025 { fill: var(--line-color); fill-opacity: 50%; font-size: calc(1*0.25*var(--tapSize)); text-anchor22: start; pointer-events: none; } .octaveSubLabel05 { fill: var(--line-color); fill-opacity: 50%; font-size: calc(1*0.5*var(--tapSize)); pointer-events: none; } .octaveSubLabel1 { fill: var(--line-color); fill-opacity: 50%; font-size: calc(1*var(--tapSize)); pointer-events: none; } .octaveSubLabel2 { fill: var(--line-color); fill-opacity: 50%; font-size: calc(1*2*var(--tapSize)); pointer-events: none; } .octaveSubLabel4 { fill: var(--line-color); fill-opacity: 50%; font-size: calc(1*4*var(--tapSize)); pointer-events: none; } .octaveSubLabel8 { fill: var(--line-color); fill-opacity: 50%; font-size: calc(1*8*var(--tapSize)); pointer-events: none; } .octaveSubLabel16 { fill: var(--line-color); fill-opacity: 50%; font-size: calc(1*16*var(--tapSize)); pointer-events: none; } .octaveSubLabel32 { fill: var(--line-color); fill-opacity: 50%; font-size: calc(1*32*var(--tapSize)); pointer-events: none; } .octaveSubLabel64 { fill: var(--line-color); fill-opacity: 50%; font-size: calc(1*64*var(--tapSize)); pointer-events: none; } .octaveSubLabel128 { fill: var(--line-color); fill-opacity: 50%; font-size: calc(1*128*var(--tapSize)); pointer-events: none; } .curTrackTitleLabel025 { fill: var(--line-color); fill-opacity: 50%; font-size: calc(0.5*0.25*var(--tapSize)); text-anchor22: start; pointer-events: none; } .curTrackTitleLabel05 { fill: var(--line-color); fill-opacity: 50%; font-size: calc(0.5*0.5*var(--tapSize)); pointer-events: none; } .curTrackTitleLabel1 { fill: var(--line-color); fill-opacity: 50%; font-size: calc(0.5*var(--tapSize)); pointer-events: none; } .curTrackTitleLabel2 { fill: var(--line-color); fill-opacity: 50%; font-size: calc(0.5*2*var(--tapSize)); pointer-events: none; } .curTrackTitleLabel4 { fill: var(--line-color); fill-opacity: 50%; font-size: calc(0.5*4*var(--tapSize)); pointer-events: none; } .curTrackTitleLabel8 { fill: var(--line-color); fill-opacity: 50%; font-size: calc(0.5*8*var(--tapSize)); pointer-events: none; } .curTrackTitleLabel16 { fill: var(--line-color); fill-opacity: 50%; font-size: calc(0.5*16*var(--tapSize)); pointer-events: none; } .curTrackTitleLabel32 { fill: var(--line-color); fill-opacity: 50%; font-size: calc(0.5*32*var(--tapSize)); pointer-events: none; } .curTrackTitleLabel64 { fill: var(--line-color); fill-opacity: 50%; font-size: calc(0.5*64*var(--tapSize)); pointer-events: none; } .curTrackTitleLabel128 { fill: var(--line-color); fill-opacity: 50%; font-size: calc(0.5*128*var(--tapSize)); pointer-events: none; } .samplerRowLabel025 { fill: var(--line-color); fill-opacity: 75%; font-size: calc(0.25*var(--tapSize)); pointer-events: none; } .samplerRowLabel05 { fill: var(--line-color); fill-opacity: 75%; font-size: calc(0.5*var(--tapSize)); pointer-events: none; } .samplerRowLabel1 { fill: var(--line-color); fill-opacity: 75%; font-size: calc(0.75*var(--tapSize)); pointer-events: none; } .samplerRowLabel2 { fill: var(--line-color); fill-opacity: 75%; font-size: calc(1*var(--tapSize)); pointer-events: none; } .samplerRowLabel4 { fill: var(--line-color); fill-opacity: 75%; font-size: calc(1.5*var(--tapSize)); pointer-events: none; } .samplerMuteLabel025 { fill: var(--line-color); fill-opacity: 15%; font-size: calc(0.25*var(--tapSize)); pointer-events: none; } .samplerMuteLabel05 { fill: var(--line-color); fill-opacity: 15%; font-size: calc(0.5*var(--tapSize)); pointer-events: none; } .samplerMuteLabel1 { fill: var(--line-color); fill-opacity: 15%; font-size: calc(0.75*var(--tapSize)); pointer-events: none; } .samplerMuteLabel2 { fill: var(--line-color); fill-opacity: 15%; font-size: calc(1*var(--tapSize)); pointer-events: none; } .samplerMuteLabel4 { fill: var(--line-color); fill-opacity: 15%; font-size: calc(1.5*var(--tapSize)); pointer-events: none; } .autoRowLabel025 { fill: var(--line-color); fill-opacity: 75%; font-size: calc(2*0.125*var(--tapSize)); pointer-events: none; } .autoRowLabel05 { fill: var(--line-color); fill-opacity: 75%; font-size: calc(4*0.125*var(--tapSize)); pointer-events: none; } .autoRowLabel1 { fill: var(--line-color); fill-opacity: 75%; font-size: calc(6*0.125*var(--tapSize)); pointer-events: none; } .autoRowLabel2 { fill: var(--line-color); fill-opacity: 75%; font-size: calc(8*0.125*var(--tapSize)); pointer-events: none; } .autoRowLabel4 { fill: var(--line-color); fill-opacity: 75%; font-size: calc(12*0.125*var(--tapSize)); pointer-events: none; } .autoMuteLabel025 { fill: var(--line-color); fill-opacity: 15%; font-size: calc(2*0.125*var(--tapSize)); pointer-events: none; } .autoMuteLabel05 { fill: var(--line-color); fill-opacity: 15%; font-size: calc(4*0.125*var(--tapSize)); pointer-events: none; } .autoMuteLabel1 { fill: var(--line-color); fill-opacity: 15%; font-size: calc(6*0.125*var(--tapSize)); pointer-events: none; } .autoMuteLabel2 { fill: var(--line-color); fill-opacity: 15%; font-size: calc(8*0.125*var(--tapSize)); pointer-events: none; } .autoMuteLabel4 { fill: var(--line-color); fill-opacity: 15%; font-size: calc(12*0.125*var(--tapSize)); pointer-events: none; } .firstTrackLabel025 { fill: var(--line-color); fill-opacity: 75%; font-size: calc(2*0.15*var(--tapSize)); pointer-events: none; } .firstTrackLabel05 { fill: var(--line-color); fill-opacity: 75%; font-size: calc(4*0.15*var(--tapSize)); pointer-events: none; } .firstTrackLabel1 { fill: var(--line-color); fill-opacity: 75%; font-size: calc(6*0.15*var(--tapSize)); pointer-events: none; } .firstTrackLabel2 { fill: var(--line-color); fill-opacity: 75%; font-size: calc(8*0.15*var(--tapSize)); pointer-events: none; } .firstTrackLabel4 { fill: var(--line-color); fill-opacity: 75%; font-size: calc(12*0.15*var(--tapSize)); pointer-events: none; } .firstTrackMute05 { fill: var(--line-color); fill-opacity: 15%; font-size: calc(4*0.15*var(--tapSize)); pointer-events: none; } .firstTrackMute1 { fill: var(--line-color); fill-opacity: 15%; font-size: calc(6*0.15*var(--tapSize)); pointer-events: none; } .firstTrackMute2 { fill: var(--line-color); fill-opacity: 15%; font-size: calc(8*0.15*var(--tapSize)); pointer-events: none; } .firstTrackMute4 { fill: var(--line-color); fill-opacity: 15%; font-size: calc(12*0.15*var(--tapSize)); pointer-events: none; } .otherTrackLabel025 { fill: var(--line-color); fill-opacity: 50%; font-size: calc(1*0.15*var(--tapSize)); pointer-events: none; } .otherTrackLabel05 { fill: var(--line-color); fill-opacity: 50%; font-size: calc(2*0.175*var(--tapSize)); pointer-events: none; } .otherTrackLabel1 { fill: var(--line-color); fill-opacity: 50%; font-size: calc(3*0.2*var(--tapSize)); pointer-events: none; } .otherTrackLabel2 { fill: var(--line-color); fill-opacity: 50%; font-size: calc(4*0.2*var(--tapSize)); pointer-events: none; } .otherTrackLabel4 { fill: var(--line-color); fill-opacity: 50%; font-size: calc(6*0.2*var(--tapSize)); pointer-events: none; } .otherTrackMute025 { fill: var(--line-color); fill-opacity: 20%; font-size: calc(1*0.125*var(--tapSize)); pointer-events: none; } .otherTrackMute05 { fill: var(--line-color); fill-opacity: 20%; font-size: calc(2*0.125*var(--tapSize)); pointer-events: none; } .otherTrackMute1 { fill: var(--line-color); fill-opacity: 20%; font-size: calc(3*0.125*var(--tapSize)); pointer-events: none; } .otherTrackMute2 { fill: var(--line-color); fill-opacity: 20%; font-size: calc(4*0.125*var(--tapSize)); pointer-events: none; } .otherTrackMute4 { fill: var(--line-color); fill-opacity: 20%; font-size: calc(6*0.125*var(--tapSize)); pointer-events: none; } .octaveMark { fill: var(--line-color); fill-opacity: 25%; } .toolBarPanel { fill: var(--line-color); pointer-events: none; } .transparentSpot { fill: #0f0; fill-opacity: 0.050%; cursor: pointer; } .transparentDragger { fill: #0f0; fill-opacity: 0.050%; cursor: move; } .transparentScroll { fill: #999; fill-opacity: 0.05%; cursor: ns-resize; } .toolBarButtonCircle { fill: var(--click-color); stroke: var(--main-color); stroke-width: 0.015cm; } .toolBarButtonLabel { fill: var(--main-color); text-anchor: middle; alignment-baseline222: middle; font-size: var(--icon-05cm); pointer-events2: none; font-family: "Material-Design-Iconic-Font"; } .projectTitle222222 { fill: var(--drag-color); font-size: var(--label-4cm); } .trackTitle { fill: var(--drag-color); font-size: var(--label-1cm); } .mixNoteLine{ stroke: var(--main-color); stroke-linejoin: round; stroke-width: calc(0.95*var(--tapSize)); stroke-opacity: 90%; pointer-events: none; } .mixMuteLine{ stroke: var(--main-color); stroke-linejoin: round; stroke-width: calc(0.95*var(--tapSize)); stroke-opacity: 8%; pointer-events: none; } .mixDropClick{ fill: red;/* var(--click-color); */ fill-opacity: 0.001%; cursor:col-resize; } .mixDropNote{ fill: var(--click-color); fill-opacity: 90%; pointer-events: none; } .mixNoteSub{ stroke: var(--line-color); stroke-linejoin: round; stroke-width: calc(0.95*var(--tapSize)); stroke-opacity: 33%; pointer-events: none; } .mixMuteSub{ stroke: var(--line-color); stroke-linejoin: round; stroke-width: calc(0.95*var(--tapSize)); stroke-opacity: 8%; pointer-events: none; } .mixTimeMeasureMark{ fill: var(--line-color); fill-opacity: 25%; } .interactiveTimeMeasureMark{ fill: var(--click-color); fill-opacity: 95%; pointer-events: none; } .mixFiller1{ fill: var(--line-color); fill-opacity: 5%; } .mixFiller2{ fill: var(--line-color); fill-opacity: 10%; } .mixFiller3{ fill: var(--line-color); fill-opacity: 15%; } .mixFiller4{ fill: var(--line-color); fill-opacity: 20%; } .mixFiller5{ fill: var(--line-color); fill-opacity: 25%; } .mixFiller6{ fill: var(--line-color); fill-opacity: 30%; } .mixFiller7{ fill: var(--line-color); fill-opacity: 35%; } .mixFiller8{ fill: var(--line-color); fill-opacity: 40%; } .titleLabel025 { fill: var(--line-color); fill-opacity: 50%; font-size: calc(0.25*var(--tapSize)); text-anchor22: start; pointer-events: none; } .titleLabel05 { fill: var(--line-color); fill-opacity: 50%; font-size: calc(0.5*var(--tapSize)); pointer-events: none; } .titleLabel1 { fill: var(--line-color); fill-opacity: 50%; font-size: calc(1*var(--tapSize)); pointer-events: none; } .titleLabel2 { fill: var(--line-color); fill-opacity: 50%; font-size: calc(2*var(--tapSize)); pointer-events: none; } .titleLabel4 { fill: var(--line-color); fill-opacity: 50%; font-size: calc(4*var(--tapSize)); pointer-events: none; } .titleLabel8 { fill: var(--line-color); fill-opacity: 50%; font-size: calc(8*var(--tapSize)); pointer-events: none; } .titleLabel16 { fill: var(--line-color); fill-opacity:50%; font-size: calc(16*var(--tapSize)); pointer-events: none; } .titleLabel32 { fill: var(--line-color); fill-opacity: 50%; font-size: calc(32*var(--tapSize)); pointer-events: none; } .titleLabel64 { fill: var(--line-color); fill-opacity: 50%; font-size: calc(64*var(--tapSize)); pointer-events: none; } .titleLabel128 { fill: var(--line-color); fill-opacity: 50%; font-size: calc(128*var(--tapSize)); pointer-events: none; } .markPointFill22222 { fill: var(--drag-color); fill-opacity: 90%; stroke-dasharray: 5px; stroke: var(--main-color); stroke-linejoin: round; stroke-linecap: butt; stroke-width: calc(0.25*var(--tapSize)); stroke-opacity: 90%; pointer-events: none; } .slidePointFill { fill: none; stroke-dasharray2: 5px; stroke: var(--drag-color); stroke-width: calc(0.25*var(--tapSize)); stroke-opacity: 60%; pointer-events: none; } .markPointFill { fill: none; stroke-dasharray2: 5px; stroke: var(--main-color); stroke-width: calc(0.25*var(--tapSize)); stroke-opacity: 60%; pointer-events: none; } .markPointNone { fill: none; stroke: none; pointer-events: none; } .octaveBottomBorder{ fill: var(--line-color); fill-opacity:75%; stroke: none; pointer-events: none; } .octaveBottomBorder123{ fill: url(#horizontalBorderLine);; stroke: none; pointer-events: none; } .stepPartDelimiter{ fill2: var(--line-color); fill-opacity:9%; stroke2: none; fill22: url(#verticalBorderLine);; fill: var(--line-color); stroke: none; pointer-events: none; } .verLineFrom { stop-color: var(--line-color); stop-opacity: 50%; } .verLineMiddle{ stop-color: var(--line-color); stop-opacity: 20%; } .verLineTo { stop-color: var(--line-color); stop-opacity: 0; } .barRightBorder{ fill: url(#verticalBorderLine); stroke: none; pointer-events: none; } .barRightBorder2{ fill: var(--line-color); fill-opacity:50%; stroke: none; pointer-events: none; } .interActiveGridLine{ fill: var(--click-color); fill-opacity:95%; stroke: none; pointer-events: none; } .commentLineText025 { fill: var(--main-color); font-size: calc(0.25*var(--tapSize)); pointer-events: none; } .commentLineText05 { fill: var(--main-color); font-size: calc(0.5*var(--tapSize)); pointer-events: none; } .commentLineText1 { fill: var(--main-color); font-size: calc(1*var(--tapSize)); pointer-events: none; } .commentLineText2 { fill: var(--main-color); font-size: calc(2*var(--tapSize)); pointer-events: none; } .commentLineText4 { fill: var(--main-color); font-size: calc(3*var(--tapSize)); pointer-events: none; } .commentLineText8 { fill: var(--main-color); font-size: calc(4*var(--tapSize)); pointer-events: none; } .commentLineText16 { fill: var(--main-color); font-size: calc(4*var(--tapSize)); pointer-events: none; } .commentPaneForClick { fill: #00000000; cursor: pointer; } .commentReadText025 { fill: var(--line-color); font-size: calc(0.25*var(--tapSize)); pointer-events: none; } .commentReadText05 { fill: var(--line-color); font-size: calc(0.5*var(--tapSize)); pointer-events: none; } .commentReadText1 { fill: var(--line-color); font-size: calc(1*var(--tapSize)); pointer-events: none; } .commentReadText2 { fill: var(--line-color); font-size: calc(2*var(--tapSize)); pointer-events: none; } .commentReadText4 { fill: var(--line-color); font-size: calc(3*var(--tapSize)); pointer-events: none; } .commentReadText8 { fill: var(--line-color); font-size: calc(4*var(--tapSize)); pointer-events: none; } .commentReadText16 { fill: var(--line-color); font-size: calc(4*var(--tapSize)); pointer-events: none; } .automationBgDot{ fill: var(--main-color); fill-opacity:95%; stroke: none; pointer-events: none; } .automationMuteDot{ fill: var(--main-color); fill-opacity:8%; stroke: none; pointer-events: none; } .automationFocusedDot{ fill: var(--click-color); fill-opacity:90%; stroke: none; } .timeMeasureMark22222 { fill: var(--line-color); fill-opacity: 25%; } .positionMark1 { stop-color: var(--drag-color); stop-opacity: 0%; } .positionMark2 { stop-color: var(--drag-color); stop-opacity: 50%; } .positionMark3 { stop-color: var(--drag-color); stop-opacity: 100%; } .positionTimeMarkShow { fill2: var(--drag-color); fill: url(#positionTimeMarkFill); visibility:visible; } .positionTimeMarkHide { fill2: var(--drag-color); fill: url(#positionTimeMarkFill); visibility:hidden; } .timeSelection { fill-opacity2: 20%; fill: var(--selectedtime-color); pointer-events: none; animation2: focusFlashFill 4s linear infinite; } .timeSubMark { fill: var(--line-color); fill-opacity: 50%; pointer-events: none; } .timeMarkButtonCircle025 { fill: var(--click-color); cursor: pointer; stroke: var(--main-color); stroke-width: 0.005cm; } .timeMarkButtonCircle05 { fill: var(--click-color); cursor: pointer; stroke: var(--main-color); stroke-width: 0.01cm; } .timeMarkButtonCircle1 { fill: var(--click-color); cursor: pointer; stroke: var(--main-color); stroke-width: 0.02cm; } .timeMarkButtonCircle2 { fill: var(--click-color); cursor: pointer; stroke: var(--main-color); stroke-width: 0.04cm; } .timeMarkButtonCircle4 { fill: var(--click-color); cursor: pointer; stroke: var(--main-color); stroke-width: 0.08cm; } .timeMarkButtonCircle8 { fill: var(--click-color); cursor: pointer; stroke: var(--main-color); stroke-width: 0.16cm; } .timeMarkButtonCircle16 { fill: var(--click-color); cursor: pointer; stroke: var(--main-color); stroke-width: 0.32cm; } .timeMarkButtonCircle32 { fill: var(--click-color); cursor: pointer; stroke: var(--main-color); stroke-width: 0.64cm; } .timeMarkButtonCircle64 { fill: var(--click-color); cursor: pointer; stroke: var(--main-color); stroke-width: 1.28cm; } .timeMarkButtonCircle128 { fill: var(--click-color); cursor: pointer; stroke: var(--main-color); stroke-width: 2.56cm; } .timeMarkButtonBorder { fill: var(--main-color); } .timeBarNum025 { fill: var(--line-color); fill-opacity: 90%; font-size: calc(0.2*var(--tapSize)); text-anchor22: start; pointer-events: none; } .timeBarNum05 { fill: var(--line-color); fill-opacity: 90%; font-size: calc(0.4*var(--tapSize)); pointer-events: none; } .timeBarNum1 { fill: var(--line-color); fill-opacity: 90%; font-size: calc(0.8*var(--tapSize)); pointer-events: none; } .timeBarNum2 { fill: var(--line-color); fill-opacity: 90%; font-size: calc(1.6*var(--tapSize)); pointer-events: none; } .timeBarNum4 { fill: var(--line-color); fill-opacity: 90%; font-size: calc(3.2*var(--tapSize)); pointer-events: none; } .timeBarNum8 { fill: var(--line-color); fill-opacity: 90%; font-size: calc(6.4*var(--tapSize)); pointer-events: none; } .timeBarNum16 { fill: var(--line-color); fill-opacity: 90%; font-size: calc(12.8*var(--tapSize)); pointer-events: none; } .timeBarNum32 { fill: var(--line-color); fill-opacity: 90%; font-size: calc(25.6*var(--tapSize)); pointer-events: none; } .timeBarNum64 { fill: var(--line-color); fill-opacity: 90%; font-size: calc(51.2*var(--tapSize)); pointer-events: none; } .timeBarNum128 { fill: var(--line-color); fill-opacity: 90%; font-size: calc(102.4*var(--tapSize)); pointer-events: none; } .selectedBarNum025 { fill: var(--main-color); fill-opacity: 90%; font-size: calc(0.75*0.2*var(--tapSize)); text-anchor22: start; pointer-events: none; } .selectedBarNum05 { fill: var(--main-color); fill-opacity: 90%; font-size: calc(0.75*0.4*var(--tapSize)); pointer-events: none; } .selectedBarNum1 { fill: var(--main-color); fill-opacity: 90%; font-size: calc(0.75*0.8*var(--tapSize)); pointer-events: none; } .selectedBarNum2 { fill: var(--main-color); fill-opacity: 90%; font-size: calc(0.75*1.6*var(--tapSize)); pointer-events: none; } .selectedBarNum4 { fill: var(--main-color); fill-opacity: 90%; font-size: calc(0.75*3.2*var(--tapSize)); pointer-events: none; } .selectedBarNum8 { fill: var(--main-color); fill-opacity: 90%; font-size: calc(0.75*6.4*var(--tapSize)); pointer-events: none; } .selectedBarNum16 { fill: var(--main-color); fill-opacity: 90%; font-size: calc(0.75*12.8*var(--tapSize)); pointer-events: none; } .selectedBarNum32 { fill: var(--main-color); fill-opacity: 90%; font-size: calc(0.75*25.6*var(--tapSize)); pointer-events: none; } .selectedBarNum64 { fill: var(--main-color); fill-opacity: 90%; font-size: calc(0.75*51.2*var(--tapSize)); pointer-events: none; } .selectedBarNum128 { fill: var(--main-color); fill-opacity: 90%; font-size: calc(0.75*102.4*var(--tapSize)); pointer-events: none; } .selectedBarIcon025 { fill: var(--main-color); fill-opacity: 90%; font-size: calc(0.2*var(--tapSize)); pointer-events: none; font-family: "Material-Design-Iconic-Font"; } .selectedBarIcon05 { fill: var(--main-color); fill-opacity: 90%; font-size: calc(0.4*var(--tapSize)); pointer-events: none; font-family: "Material-Design-Iconic-Font"; } .selectedBarIcon1 { fill: var(--main-color); fill-opacity: 90%; font-size: calc(0.8*var(--tapSize)); pointer-events: none; font-family: "Material-Design-Iconic-Font"; } .selectedBarIcon2 { fill: var(--main-color); fill-opacity: 90%; font-size: calc(1.6*var(--tapSize)); pointer-events: none; font-family: "Material-Design-Iconic-Font"; } .selectedBarIcon4 { fill: var(--main-color); fill-opacity: 90%; font-size: calc(3.2*var(--tapSize)); pointer-events: none; font-family: "Material-Design-Iconic-Font"; } .selectedBarIcon8 { fill: var(--main-color); fill-opacity: 90%; font-size: calc(6.4*var(--tapSize)); pointer-events: none; font-family: "Material-Design-Iconic-Font"; } .selectedBarIcon16 { fill: var(--main-color); fill-opacity: 90%; font-size: calc(12.8*var(--tapSize)); pointer-events: none; font-family: "Material-Design-Iconic-Font"; } .selectedBarIcon32 { fill: var(--main-color); fill-opacity: 90%; font-size: calc(25.6*var(--tapSize)); pointer-events: none; font-family: "Material-Design-Iconic-Font"; } .selectedBarIcon64 { fill: var(--main-color); fill-opacity: 90%; font-size: calc(51.2*var(--tapSize)); pointer-events: none; font-family: "Material-Design-Iconic-Font"; } .selectedBarIcon128 { fill: var(--main-color); fill-opacity: 90%; font-size: calc(102.4*var(--tapSize)); pointer-events: none; font-family: "Material-Design-Iconic-Font"; } .timeBarInfo025 { fill: var(--line-color); fill-opacity: 90%; font-size: calc(0.1*var(--tapSize)); text-anchor2: end; } .timeBarInfo05 { fill: var(--line-color); fill-opacity: 90%; font-size: calc(0.2*var(--tapSize)); text-anchor2: end; } .timeBarInfo1 { fill: var(--line-color); fill-opacity: 90%; font-size: calc(0.4*var(--tapSize)); text-anchor2: end; } .timeBarInfo2 { fill: var(--line-color); fill-opacity: 90%; font-size: calc(0.8*var(--tapSize)); text-anchor2: end; } .timeBarInfo4 { fill: var(--line-color); fill-opacity: 90%; font-size: calc(1.6*var(--tapSize)); text-anchor2: end; } .timeBarInfo8 { fill: var(--line-color); fill-opacity: 90%; font-size: calc(3.2*var(--tapSize)); text-anchor2: end; } .timeBarInfo16 { fill: var(--line-color); fill-opacity: 90%; font-size: calc(6.4*var(--tapSize)); text-anchor2: end; } .timeBarInfo32 { fill: var(--line-color); fill-opacity: 90%; font-size: calc(12.8*var(--tapSize)); text-anchor2: end; } .timeBarInfo64 { fill: var(--line-color); fill-opacity: 90%; font-size: calc(25.6*var(--tapSize)); text-anchor2: end; } .timeBarInfo128 { fill: var(--line-color); fill-opacity: 90%; font-size: calc(51.2*var(--tapSize)); text-anchor2: end; }#pluginFilterDiv { position: absolute; z-index: 1999; left: 0.0cm; right: 0.0cm; top: 0.0cm; bottom: 0.0cm; border-style: solid; border-width: 0.0cm; border-width2: 0.125cm; border-color2: var(--shadow-color); display: flex; flex-direction: column; visibility: hidden; border-radius2: 0.25cm; background-color2: #888888ee; } #pluginSamplerDiv { position: absolute; z-index: 1999; left: 0.0cm; right: 0.0cm; top: 0.0cm; bottom: 0.0cm; border-style: solid; border-width: 0.0cm; border-width2: 0.125cm; border-color2: var(--shadow-color); display: flex; flex-direction: column; visibility: hidden; border-radius2: 0.25cm; background-color2: #888888ee; } #pluginSequencerDiv { position: absolute; z-index: 1999; left: 0.0cm; right: 0.0cm; top: 0.0cm; bottom: 0.0cm; border-style: solid; border-width: 0.0cm; border-width2: 0.125cm; border-color2: var(--shadow-color); display: flex; flex-direction: column; visibility: hidden; border-radius2: 0.25cm; background-color2: #888888ee; } #pluginActionDiv { position: absolute; z-index: 1999; left: 0.0cm; right: 0.0cm; top: 0.0cm; bottom: 0.0cm; border-style: solid; border-width: 0.0cm; border-width2: 0.125cm; border-color2: var(--shadow-color); display: flex; flex-direction: column; visibility: hidden; border-radius2: 0.25cm; background-color2: #888888ee; } #pluginPointDiv { position: absolute; z-index: 1999; left: 0.0cm; right: 0.0cm; top: 0.0cm; bottom: 0.0cm; border-style: solid; border-width: 0.0cm; border-width2: 0.125cm; border-color2: var(--shadow-color); display: flex; flex-direction: column; visibility: hidden; border-radius2: 0.25cm; background-color2: #888888ee; } .pluginFrame { left: 0.0cm; right: 0.0cm; top: 1.0cm; bottom: 0.0cm; border: none; background-color222: #66666633; flex-basis: 0; flex-shrink: 1; flex-grow: 1; border-radius2: 0.0cm 0.0cm 0.125cm 0.125cm; overflow: scroll; scrollbar-color: red orange; scrollbar-width: thin; } #pluginActionHeader { width: 100%; height: 1.0cm; background-color: var(--plugintitle-color); border-radius2: 0.125cm 0.125cm 0.0cm 0.0cm; flex-basis: auto; flex-shrink: 0; flex-grow: 0; display: flex; flex-direction: row; justify-content: space-between; padding-top: 0.1cm; } #pluginPointHeader { width: 100%; height: 1.0cm; background-color: var(--background-color); border-radius2: 0.125cm 0.125cm 0.0cm 0.0cm; flex-basis: auto; flex-shrink: 0; flex-grow: 0; display: flex; flex-direction: row; justify-content: space-between; padding-top: 0.1cm; } .pluginOtherHeader { width: 100%; height: 1.0cm; background-color: var(--background-color); border-radius2: 0.125cm 0.125cm 0.0cm 0.0cm; flex-basis: auto; flex-shrink: 0; flex-grow: 0; display: flex; flex-direction: row; justify-content: space-between; padding-top: 0.1cm; } /* #pluginEditTitleButton { border-radius: 0.4cm; background-color: var(--click-color); color: var(--main-color); box-shadow: inset 0px 0px 0px 0.5px var(--main-color); font-size: var(--label-05cm); width: 0.8cm; height: 0.8cm; text-align: center; font-family: "Material-Design-Iconic-Font"; cursor: pointer; margin-left: 0.2cm; margin-right: 0.2cm; display: flex; align-items: center; justify-content: center; min-width: 0.8cm; } */ #pluginActionTitle { color: var(--line-color); font-size: var(--label-04cm); padding-left: 0.0cm; padding-top: 0.25cm; flex-grow: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center; cursor:default; } #pluginPointTitle { color: var(--line-color); font-size: var(--label-04cm); padding-left: 0.0cm; padding-top: 0.25cm; flex-grow: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center; cursor:default; } .pluginPromptTitle { border-radius: 0.4cm; background-color: var(--click-color); color: var(--main-color); box-shadow: inset 0px 0px 0px 0.5px var(--main-color); font-size: var(--label-05cm); width: 0.8cm; height: 0.8cm; text-align: left; cursor: pointer; margin-left: 0.2cm; margin-right: 0.2cm; display: flex; align-items: center; justify-content: start; min-width: 0.8cm; white-space: nowrap; text-overflow: ellipsis; } .pluginCancel { border-radius: 0.4cm; background-color: var(--click-color); color: var(--main-color); box-shadow: inset 0px 0px 0px 0.5px var(--main-color); text-shadow2: 0.25px 0px var(--main-color), -0.25px 0px var(--main-color), 0px 0.25px var(--main-color), 0px -0.25px var(--main-color); font-size: var(--label-05cm); width: 0.8cm; height: 0.8cm; text-align: center; padding-top2: 0.05cm; background-color2: green; border-color2: var(--main-color); border-style2: solid; border-width2: 1px; border-radius2: 1cm; margin2: 0.05cm; font-family: "Material-Design-Iconic-Font"; vertical-align22: middle; alignment-baseline22: middle; cursor: pointer; margin-left: 0.2cm; margin-right: 0.2cm; display: flex; align-items: center; justify-content: center; min-width: 0.8cm; } /* #pluginRefresh { border-radius2: 0.4cm; background-color: var(--click-color); color: var(--main-color); text-shadow2: 0.25px 0px var(--main-color), -0.25px 0px var(--main-color), 0px 0.25px var(--main-color), 0px -0.25px var(--main-color); font-size: var(--label-05cm); width: 0.8cm; height: 0.8cm; text-align: center; margin-to2p: 0.1cm; font-family: "Material-Design-Iconic-Font"; background-color2: brown; cursor: pointer; box-shadow: inset 0px 0px 0px 0.5px var(--main-color); display: flex; align-items: center; justify-content: center; min-width: 0.8cm; } */ .pluginBottom { width: 100%; height: 1.0cm; background-color: var(--background-color10); border-radius2: 0.125cm 0.125cm 0.0cm 0.0cm; flex-basis: auto; flex-shrink: 0; flex-grow: 0; display: flex; flex-direction: row; justify-content: center; padding-top: 0.1cm; } /* #pluginDeleteLabel { color: var(--main-color); font-size: var(--label-04cm); padding-left: 0.5cm; padding-top: 0.15cm; flex-grow: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: right; } */ .pluginDoButton { border-radius: 0.4cm; background-color: var(--click-color); background-color2: var(--background-color); color: var(--main-color); box-shadow: inset 0px 0px 0px 0.5px var(--main-color); font-size: var(--label-05cm); width: 0.8cm; height: 0.8cm; text-align: center; font-family: "Material-Design-Iconic-Font"; cursor: pointer; margin-left: 0.07cm; margin-right: 0.07cm; display: flex; align-items: center; justify-content: center; min-width: 0.8cm; } .pluginNoneButton { border-radius: 0.4cm; background-color2: var(--click-color); background-color: var(--background-color); color: var(--main-color); box-shadow: inset 0px 0px 0px 0.5px var(--main-color); font-size: var(--label-05cm); width: 0.8cm; height: 0.8cm; text-align: center; font-family: "Material-Design-Iconic-Font"; cursor: pointer; margin-left: 0.07cm; margin-right: 0.07cm; display: flex; align-items: center; justify-content: center; min-width: 0.8cm; } .fanIconLabel { fill: var(--line-color); font-size: var(--label-2cm); pointer-events: none; dominant-baseline22: middle; text-anchor2: middle; } .fanDisabledLabel { fill: var(--line-color75); font-size: var(--label-2cm); pointer-events: none; dominant-baseline22: middle; text-anchor2: middle; } .fanIconLabelSize0 { font-size: var(--label-025cm); } .fanIconLabelSize1 { font-size: var(--label-04cm); } .fanIconLabelSize2 { font-size: var(--label-075cm); } .fanIconLabelSize3 { font-size: var(--label-1cm); } .fanIconLabelSize4{ font-size: var(--label-2cm); } .fanIconLabelSize5 { font-size: var(--label-3cm); } .fanSamplerMoveIconBase { fill: var(--drag-color); font-size: calc(0.25*var(--tapSize)); cursor: move; stroke: var(--line-color); stroke-width: calc(0.125*var(--tapSize)); stroke-linejoin: round; paint-order: stroke fill; } .fanSamplerMoveIconDisabled { fill: var(--disable-drag-color); font-size: calc(0.25*var(--tapSize)); cursor: move; stroke: var(--line-color75); stroke-width: calc(0.125*var(--tapSize)); stroke-linejoin: round; paint-order: stroke fill; } .fanSamplerMoveIcon0 {stroke-width: calc(0.02*var(--tapSize));} .fanSamplerMoveIcon1 {stroke-width: calc(0.04*var(--tapSize));} .fanSamplerMoveIcon2 {stroke-width: calc(0.08*var(--tapSize));} .fanSamplerMoveIcon3 {stroke-width: calc(0.16*var(--tapSize));} .fanSamplerMoveIcon4 {stroke-width: calc(0.32*var(--tapSize));} .fanSamplerMoveIcon5 {stroke-width: calc(0.64*var(--tapSize));} .fanSamplerMoveIcon6 {stroke-width: calc(1.28*var(--tapSize));} .fanSamplerMoveIcon7 {stroke-width: calc(2.56*var(--tapSize));} .fanSamplerMoveIcon8 {stroke-width: calc(5.12*var(--tapSize));} .fanSamplerMoveIcon9 {stroke-width: calc(10.24*var(--tapSize));} /* .fanSamplerUpIcon0 {stroke-width: calc(0.08*var(--tapSize));} .fanSamplerUpIcon1 {stroke-width: calc(0.16*var(--tapSize));} .fanSamplerUpIcon2 {stroke-width: calc(0.32*var(--tapSize));} .fanSamplerUpIcon3 {stroke-width: calc(0.64*var(--tapSize));} .fanSamplerUpIcon4 {stroke-width: calc(1.28*var(--tapSize));} .fanSamplerUpIcon5 {stroke-width: calc(2.56*var(--tapSize));} .fanSamplerUpIcon6 {stroke-width: calc(5.12*var(--tapSize));} .fanSamplerUpIcon7 {stroke-width: calc(7.68*var(--tapSize));} .fanSamplerUpIcon8 {stroke-width: calc(10.24*var(--tapSize));} .fanSamplerUpIcon9 {stroke-width: calc(20.48*var(--tapSize));} */ .fanSamplerInteractionIcon { fill: var(--click-color); font-size: calc(0.25*var(--tapSize)); cursor: pointer; stroke: var(--line-color); stroke-width2: calc(0.125*var(--tapSize)); stroke-linejoin: round; paint-order: stroke fill; } .fanSamplerInterDisabledIcon { fill: var(--disable-click-color); font-size: calc(0.25*var(--tapSize)); cursor: pointer; stroke: var(--line-color90); stroke-width2: calc(0.125*var(--tapSize)); stroke-linejoin: round; paint-order: stroke fill; } .fanButton0 {stroke-width: calc(0.02*var(--tapSize));} .fanButton1 {stroke-width: calc(0.04*var(--tapSize));} .fanButton2 {stroke-width: calc(0.08*var(--tapSize));} .fanButton3 {stroke-width: calc(0.16*var(--tapSize));} .fanButton4 {stroke-width: calc(0.32*var(--tapSize));} .fanSamplerActionIconLabel { fill: var(--main-color); font-size: var(--label-075cm); pointer-events: none; text-anchor: middle; font-family: "Material-Design-Iconic-Font"; } .fanPointLinker { fill: var(--drag-color); cursor: move; stroke: var(--line-color); stroke-width: calc(0.125*var(--tapSize)); stroke-linejoin: round; paint-order: stroke fill; } .fanSamplerClickIcon { fill: var(--click-color); font-size: calc(0.25*var(--tapSize)); cursor: pointer; } .fanPerformerIcon { fill: var(--line-color); stroke-dasharray: 15, 15; pointer-events: none; } .fanFilterIcon { fill: var(--line-color); stroke-dasharray: 45, 45; pointer-events: none; } .fanConnectionButton { cursor: ns-resize; stroke: var(--main-color); fill: var(--drag-color); stroke-width: calc(0.0256*var(--tapSize)); } .fanSampleDrragger { cursor: ns-resize; stroke: var(--line-color); fill: var(--drag-color); stroke-width: calc(0.1024*var(--tapSize)); } .fanFilterDrragger { cursor: ns-resize; stroke: var(--line-color); fill: var(--drag-color); stroke-width: calc(0.1024*var(--tapSize)); } .fanConnectionBase { pointer-events: none; stroke: var(--line-color50); stroke-width2: 0.5cm; stroke-linejoin: round; paint-order: stroke; fill:none; } .fanConnectionSecondary{ stroke: var(--line-color90); } .fanConnection0 {stroke-width: 0.02cm;} .fanConnection1 {stroke-width: 0.04cm;} .fanConnection2 {stroke-width: 0.08cm;} .fanConnection3 {stroke-width: 0.16cm;} .fanConnection4 {stroke-width: 0.32cm;} .fanConnection5 {stroke-width: 0.5cm;} .fanConnection6 {stroke-width: 0.75cm;} .fanConnection7 {stroke-width: 1cm;} .fanConnection8 {stroke-width: 2cm;} .fanStream { pointer-events: none; stroke: var(--main-color); stroke-width: 2cm; stroke-linejoin: round; paint-order: stroke; } .fanDropConnection { cursor: pointer; stroke: var(--line-color); stroke-width: 0.5cm; stroke-linejoin: round; paint-order: stroke; fill: var(--click-color); } .fanDropConnection0 {stroke-width: 0.02cm;} .fanDropConnection1 {stroke-width: 0.04cm;} .fanDropConnection2 {stroke-width: 0.08cm;} .fanDropConnection3 {stroke-width: 0.16cm;} .fanDropConnection4 {stroke-width: 0.32cm;} .fanDeleteIcon { fill: var(--main-color); text-anchor: middle; font-size: var(--icon-2cm); pointer-events: none; font-family: "Material-Design-Iconic-Font"; } .fanSpeakerIcon { fill: var(--line-color); font-size: calc(4*var(--tapSize)); pointer-events: none; border-color: var(--main-color); stroke: var(--main-color); stroke-width: 0.1cm; stroke-linejoin: round; paint-order: stroke; } .fanSpeakerLabel { fill: var(--line-color); font-size: calc(4*var(--tapSize)); pointer-events: none; border-color: var(--main-color); stroke: var(--main-color); stroke-width: 0.1cm; stroke-linejoin: round; paint-order: stroke; } .fanSpeakerIconLabel { font-size: calc(24*var(--tapSize)); pointer-events: none; fill: var(--line-color); font-family: "Material-Design-Iconic-Font"; text-align2: center; } .controlConnection { fill: var(--main-color); fill-opacity: 25%; } .fanSplitIconLabel { fill: var(--main-color); font-size: var(--label-025cm); pointer-events: none; text-anchor: middle; font-family: "Material-Design-Iconic-Font"; }:root { --background-color: #411; --main-color: #ff9; --drag-color: #c30; --line-color: #fff; --click-color: #264; } #tileLevelSVG { background-image: url("bg/logo.png"); background-size2: cover; background-position-x: left; background-position-y: bottom; background-repeat: no-repeat; background-size: auto 100%; } :root { --font-ratio: 0.85; } /* latin-ext */ @font-face { font-family: "Bruno Ace"; font-style: normal; font-weight: 400; font-display: swap; src: url(BrunoAce/WwkcxPa2E06x4trkOj_UOaANaNM.woff2) format("woff2"); unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF; } /* latin */ @font-face { font-family: "Bruno Ace"; font-style: normal; font-weight: 400; font-display: swap; src: url(BrunoAce/WwkcxPa2E06x4trkOj_UN6AN.woff2) format("woff2"); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; } html { font-family2: "MontserratAlternates-Regular"; font-family3: "Brahms"; font-family4: "MontserratAlternates"; font-family: "Bruno Ace"; } ';
let colorbirch = ':root { --background-color: #ccddee; --main-color: #000; --drag-color: #f96; --line-color: #003; --click-color: #bbdd99; } #tileLevelSVG { background-image: url("bg/birch2.jpg"); background-size: cover; background-position-x: center; background-position-y: bottom; } ';
let colordarkblue = ':root { --background-color: #000; --main-color: #fff; --drag-color: #399; --line-color: #9cf; --click-color: #069; } #tileLevelSVG { background-image: url("bg/blue.png"); background-size: cover; background-position-x: center; background-position-y: center; } ';
let colordarkgreen = ':root { --background-color: #030900; --main-color: #fff; --drag-color: #066; --line-color: #cfe; --click-color: #360; } #tileLevelSVG { background-image: url("bg/green.png"); background-size: cover; background-position-x: center; background-position-y: center; } ';
let colordarkred = ':root { --background-color: #411; --main-color: #ff9; --drag-color: #c30; --line-color: #fff; --click-color: #264; } #tileLevelSVG { background-image: url("bg/logo.png"); background-size2: cover; background-position-x: left; background-position-y: bottom; background-repeat: no-repeat; background-size: auto 100%; } ';
let colorlight = ':root { --background-color: #eef6ff; --main-color: #000; --drag-color: #fcf; --line-color: #339; --click-color: #6cf; } #tileLevelSVG { background-image: url("bg/gjel.png"); background-repeat: repeat-x; background-size2: cover; background-position: bottom; background-position-x2: center; background-position-y2: bottom; background-color2: red; background-size: 25% auto; } ';
let colorneon = ':root { --background-color: #101; --main-color: #9cf; --drag-color: #03f; --line-color: #ffc; --click-color: #c39; } #tileLevelSVG { background-image: url("bg/neon.png"); background-size: cover; background-position-x: center; background-position-y: bottom; } ';
let colorwhite = ':root { --background-color: #fff9f6; --main-color: #900; --drag-color: #9cf; --line-color: #433; --click-color: #fc0; } #tileLevelSVG { background-image: url("bg/rus.png"); background-repeat: no-repeat; background-size2: cover; background-position: bottom; background-position-x: left; background-position-y: top; background-color2: red; background-size: auto 33%; } ';
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
    return { xx: xx, yy: yy, ww: ww, hh: hh, minZoom: showZoom, beforeZoom: hideZoom, content: [], id: id };
}
function TText(x, y, css, text) {
    return { x: x, y: y, text: text, css: css, };
}
//# sourceMappingURL=application.js.map