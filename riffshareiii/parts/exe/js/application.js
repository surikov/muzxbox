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
function startApplication() {
    console.log('startApplication v1.6.11');
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
    if (uilocale) {
        let uiratio = readRawTextFromlocalStorage('uiratio');
        if (uiratio) {
            let nratio = parseInt(uiratio);
            if (nratio >= 0.1) {
                globalCommandDispatcher.setThemeLocale(uilocale, nratio);
            }
        }
    }
    globalCommandDispatcher.resetProject();
}
function squashString(data) {
    return data;
}
function resolveString(data) {
    return data;
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
                pluginFrame.src = 'pluginplaceholder.html';
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
                    pluginFrame.src = filterPlugin.ui;
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
            let message = { hostData: this.dialogID };
            pluginFrame.contentWindow.postMessage(message, '*');
        }
    }
    sendPointToPlugin() {
        let pluginFrame = document.getElementById("pluginFilterFrame");
        if (pluginFrame) {
            let message = { hostData: this.pluginRawData };
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
        pluginFrame.src = 'pluginplaceholder.html';
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
                    pluginFrame.src = fplugin.ui;
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
            let message = { hostData: this.dialogID };
            pluginFrame.contentWindow.postMessage(message, '*');
        }
    }
    sendPointToPlugin() {
        let pluginFrame = document.getElementById("pluginSamplerFrame");
        if (pluginFrame) {
            let message = { hostData: this.pluginRawData };
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
        console.log('receiveMessageFromPlugin', event);
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
            let message = { hostData: this.dialogID };
            pluginFrame.contentWindow.postMessage(message, '*');
        }
    }
    sendCurrentProjectToActionPlugin() {
        let pluginFrame = document.getElementById("pluginActionFrame");
        if (pluginFrame) {
            let message = { hostData: globalCommandDispatcher.cfg().data };
            pluginFrame.contentWindow.postMessage(message, '*');
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
                    globalCommandDispatcher.exe.commitProjectChanges([], () => {
                        let project = message.pluginData;
                        globalCommandDispatcher.registerWorkProject(project);
                        globalCommandDispatcher.resetProject();
                        globalCommandDispatcher.reStartPlayIfPlay();
                    });
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
                    this.sendCurrentProjectToActionPlugin();
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
                pluginFrame.src = this.pluginInfo.ui;
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
        if (pluginFrame) {
            pluginFrame.src = "plugins/pluginplaceholder.html";
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
                pluginFrame.src = 'pluginplaceholder.html';
                pluginDiv.style.visibility = "visible";
                this.resetStateButtons();
            }
        }
    }
    openSequencerPluginDialogFrame(order, track, trackPlugin) {
        this.track = track;
        this.order = order;
        this.pluginRawData = track.performer.data;
        this.resetSequencerTitle();
        let pluginFrame = document.getElementById("pluginSequencerFrame");
        let pluginDiv = document.getElementById("pluginSequencerDiv");
        if (pluginFrame) {
            if (pluginFrame.contentWindow) {
                this.waitSequencerPluginInit = true;
                if (trackPlugin) {
                    pluginFrame.src = trackPlugin.ui;
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
        if (pluginFrame) {
            pluginFrame.src = "plugins/pluginplaceholder.html";
        }
    }
    sendNewIdToPlugin() {
        let pluginFrame = document.getElementById("pluginSequencerFrame");
        if (pluginFrame) {
            this.dialogID = '' + Math.random();
            let message = { hostData: this.dialogID };
            pluginFrame.contentWindow.postMessage(message, '*');
        }
    }
    sendPointToPlugin() {
        let pluginFrame = document.getElementById("pluginSequencerFrame");
        if (pluginFrame) {
            let message = { hostData: this.pluginRawData };
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
                pluginFrame.src = filterPlugin.ui;
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
        if (pluginFrame) {
            pluginFrame.src = "plugins/pluginplaceholder.html";
        }
    }
    sendNewIdToPlugin() {
        let pluginFrame = document.getElementById("pluginPointFrame");
        if (pluginFrame) {
            this.dialogID = '' + Math.random();
            let message = { hostData: this.dialogID };
            pluginFrame.contentWindow.postMessage(message, '*');
        }
    }
    sendPointToPlugin() {
        let pluginFrame = document.getElementById("pluginPointFrame");
        if (pluginFrame) {
            let message = { hostData: this.pluginPoint.stateBlob };
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
        this._mixerDataMathUtility = new MixerDataMathUtility(data);
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
    toggleStartStop() {
        if (this.player.playState().play) {
            this.stopPlay();
        }
        else {
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
        this.registerWorkProject(createNewEmptyProjectData());
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
    adjustTimeLineLength() {
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
    adjustMergeChordByTime(trackBar) {
        let merged = [];
        for (let kk = 0; kk < trackBar.chords.length; kk++) {
            let checkChord = trackBar.chords[kk];
            let xsts = false;
            for (let mm = 0; mm < merged.length; mm++) {
                let existedChord = merged[mm];
                if (MMUtil().set(existedChord.skip).equals(checkChord.skip)) {
                    xsts = true;
                    let pitchcount = checkChord.pitches.length;
                    for (let pp = 0; pp < pitchcount; pp++) {
                        let pitch = checkChord.pitches[pp];
                        existedChord.pitches.push(pitch);
                    }
                    break;
                }
            }
            if (!xsts) {
                merged.push(checkChord);
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
        this.adjustTimeLineLength();
        this.adjustRemoveEmptyChords();
        this.adjustTracksChords();
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
    { prefix: '128', minZoom: 128, gridLines: [], iconRatio: 3.25 }
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
let localAddEmptyMeasures = 'localAddEmptyMeasures';
let localRemoveSelectedMeasures = 'localRemoveSelectedMeasures';
let localMergeSelectedMeausres = 'localMergeSelectedMeausres';
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
    { id: localAddEmptyMeasures, data: [{ locale: 'en', text: '+' }, { locale: 'ru', text: '+' }, { locale: 'zh', text: '?' }] },
    { id: localRemoveSelectedMeasures, data: [{ locale: 'en', text: 'x' }, { locale: 'ru', text: 'x' }, { locale: 'zh', text: '?' }] },
    { id: localMergeSelectedMeausres, data: [{ locale: 'en', text: '>|<' }, { locale: 'ru', text: '()' }, { locale: 'zh', text: '?' }] },
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
            text: '' + (1 + barnum) + ': ' + mins + '\'' + (secs > 9 ? '' : '0') + secs + '.' + hunds,
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
    addSelectionMenuButton(label, left, order, zz, selectLevelAnchor, action) {
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
            x: left + size / 4,
            y: (size * 1.1) * order + size * 3 / 4,
            text: label,
            css: 'selectedBarNum' + zoomPrefixLevelsCSS[zz].prefix
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
            this.addSelectionMenuButton(LO(localAddEmptyMeasures), left, 1, zz, selectLevelAnchor, globalCommandDispatcher.insertAfterSelectedBars);
            this.addSelectionMenuButton(LO(localRemoveSelectedMeasures), left, 2, zz, selectLevelAnchor, globalCommandDispatcher.dropSelectedBars);
            this.addSelectionMenuButton(LO(localMergeSelectedMeausres), left, 3, zz, selectLevelAnchor, globalCommandDispatcher.mergeSelectedBars);
            this.addSelectionMenuButton(tempoLabel, left, 4, zz, selectLevelAnchor, globalCommandDispatcher.promptTempoForSelectedBars);
            this.addSelectionMenuButton(meterLabel, left, 5, zz, selectLevelAnchor, globalCommandDispatcher.promptMeterForSelectedBars);
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
        this.menuButton = new ToolBarButton([icon_ver_menu], 1, 0, (nn) => {
            globalCommandDispatcher.resetAnchor(this.toolBarGroup, this.toolBarAnchor, LevelModes.overlay);
            globalCommandDispatcher.showRightMenu();
        });
        this.playStopButton = new ToolBarButton([icon_play, icon_pause], -1, 0, (nn) => {
            globalCommandDispatcher.toggleStartStop();
        });
        this.undoButton = new ToolBarButton([icon_undo], -1, 1, (nn) => {
            globalCommandDispatcher.exe.undo(1);
        });
        this.redoButton = new ToolBarButton([icon_redo], -1, 2, (nn) => {
            globalCommandDispatcher.exe.redo(1);
        });
        this.toolBarGroup = document.getElementById("toolBarPanelGroup");
        this.toolBarAnchor = {
            xx: 0, yy: 0, ww: 111, hh: 111,
            minZoom: zoomPrefixLevelsCSS[0].minZoom,
            beforeZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom,
            content: [
                this.menuButton.iconLabelButton.anchor,
                this.undoButton.iconLabelButton.anchor,
                this.redoButton.iconLabelButton.anchor,
                this.playStopButton.iconLabelButton.anchor
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
        this.undoButton.resize(viewWIdth, viewHeight);
        this.redoButton.resize(viewWIdth, viewHeight);
        this.playStopButton.resize(viewWIdth, viewHeight);
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
        this.menuCloseButton = new IconLabelButton([icon_moveright], 'menuButtonCircle', 'menuButtonLabel', (nn) => {
            globalCommandDispatcher.hideRightMenu();
        });
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
                    let so = new RightMenuItem(it, pad, () => {
                        me.setOpenState(false, it, infos);
                        me.rerenderMenuContent(so);
                    }).initOpenedFolderItem();
                    this.items.push(so);
                    it.top = this.items.length - 1;
                    this.fillMenuItemChildren(pad + 0.5, children);
                }
                else {
                    let si = new RightMenuItem(it, pad, () => {
                        if (it.onFolderOpen) {
                            it.onFolderOpen();
                        }
                        me.setOpenState(true, it, infos);
                        me.rerenderMenuContent(si);
                    }).initClosedFolderItem();
                    this.items.push(si);
                    it.top = this.items.length - 1;
                }
            }
            else {
                if (it.dragCircle) {
                    this.items.push(new RightMenuItem(it, pad, () => { }, () => { }, (x, y) => {
                        if (it.onDrag) {
                            it.onDrag(x, y);
                        }
                        me.setFocus(it, infos);
                        me.resetAllAnchors();
                    }).initDraggableCircle());
                    it.top = this.items.length - 1;
                }
                else {
                    if (it.dragSquare) {
                        this.items.push(new RightMenuItem(it, pad, () => { }, () => { }, (x, y) => {
                            if (it.onDrag) {
                                it.onDrag(x, y);
                            }
                            me.setFocus(it, infos);
                            me.resetAllAnchors();
                        }).initDraggableSquare());
                        it.top = this.items.length - 1;
                    }
                    else {
                        if (it.dragTriangle) {
                            this.items.push(new RightMenuItem(it, pad, () => { }, () => { }, (x, y) => {
                                if (it.onDrag) {
                                    it.onDrag(x, y);
                                }
                                me.setFocus(it, infos);
                                me.resetAllAnchors();
                            }).initDraggableTriangle());
                            it.top = this.items.length - 1;
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
                                this.items.push(rightMenuItem.initActionItem2());
                                it.top = this.items.length - 1;
                            }
                            else {
                                if (it.onClick) {
                                    this.items.push(new RightMenuItem(it, pad, () => {
                                        if (it.onClick) {
                                            it.onClick();
                                        }
                                        me.setFocus(it, infos);
                                        me.resetAllAnchors();
                                    }).initActionItem());
                                    it.top = this.items.length - 1;
                                }
                                else {
                                    this.items.push(new RightMenuItem(it, pad, () => {
                                        me.setFocus(it, infos);
                                        me.resetAllAnchors();
                                    }).initDisabledItem());
                                    it.top = this.items.length - 1;
                                }
                            }
                        }
                    }
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
        menuPointInsTracks.children = [];
        menuPointDrumTracks.children = [];
        menuPointFxTracks.children = [];
        for (let tt = 0; tt < project.tracks.length; tt++) {
            let track = project.tracks[tt];
            let item = {
                text: track.title,
                noLocalization: true,
                selectedState: track.performer.state,
                itemStates: [icon_sound_loud, icon_power, icon_flash],
                onSubClick: () => {
                    globalCommandDispatcher.exe.commitProjectChanges(['tracks'], () => {
                        if (item.selectedState == 1) {
                            track.performer.state = 1;
                        }
                        else {
                            if (item.selectedState == 2) {
                                track.performer.state = 2;
                            }
                            else {
                                track.performer.state = 0;
                            }
                        }
                    });
                    globalCommandDispatcher.reConnectPluginsIfPlay();
                }
            };
            if (track.performer.state == 1 || (solo && track.performer.state != 2))
                item.lightTitle = true;
            if (tt > 0) {
                item.onClick = () => {
                    globalCommandDispatcher.exe.commitProjectChanges(['tracks'], () => {
                        let track = globalCommandDispatcher.cfg().data.tracks.splice(tt, 1)[0];
                        globalCommandDispatcher.cfg().data.tracks.splice(0, 0, track);
                    });
                };
            }
            else {
                item.onClick = () => {
                    let info = globalCommandDispatcher.findPluginRegistrationByKind(track.performer.kind);
                    if (info) {
                        globalCommandDispatcher.sequencerPluginDialog.openSequencerPluginDialogFrame(tt, track, info);
                    }
                    else {
                        globalCommandDispatcher.sequencerPluginDialog.openEmptySequencerPluginDialogFrame(tt, track);
                    }
                };
                item.highlight = icon_sliders;
            }
            menuPointInsTracks.children.push(item);
        }
        for (let tt = 0; tt < project.percussions.length; tt++) {
            let drum = project.percussions[tt];
            let item = {
                text: drum.title,
                noLocalization: true,
                onSubClick: () => {
                    globalCommandDispatcher.exe.commitProjectChanges(['percussions'], () => {
                        if (item.selectedState == 1) {
                            drum.sampler.state = 1;
                        }
                        else {
                            if (item.selectedState == 2) {
                                drum.sampler.state = 2;
                            }
                            else {
                                drum.sampler.state = 0;
                            }
                        }
                    });
                    globalCommandDispatcher.reConnectPluginsIfPlay();
                },
                itemStates: [icon_sound_loud, icon_power, icon_flash],
                selectedState: drum.sampler.state
            };
            if (drum.sampler.state == 1 || (solo && drum.sampler.state != 2))
                item.lightTitle = true;
            if (tt > 0) {
                item.onClick = () => {
                    globalCommandDispatcher.exe.commitProjectChanges(['percussions'], () => {
                        let smpl = globalCommandDispatcher.cfg().data.percussions.splice(tt, 1)[0];
                        globalCommandDispatcher.cfg().data.percussions.splice(0, 0, smpl);
                    });
                };
            }
            else {
                item.onClick = () => {
                    let info = globalCommandDispatcher.findPluginRegistrationByKind(drum.sampler.kind);
                    if (info) {
                        globalCommandDispatcher.samplerPluginDialog.openDrumPluginDialogFrame(tt, drum, info);
                    }
                    else {
                        globalCommandDispatcher.samplerPluginDialog.openEmptyDrumPluginDialogFrame(tt, drum);
                    }
                };
                item.highlight = icon_sliders;
            }
            menuPointDrumTracks.children.push(item);
        }
        for (let ff = 0; ff < project.filters.length; ff++) {
            let filter = project.filters[ff];
            let item = {
                text: filter.title,
                noLocalization: true,
                itemStates: [icon_equalizer, icon_power],
                selectedState: filter.state
            };
            item.onSubClick = () => {
                globalCommandDispatcher.exe.commitProjectChanges(['filters'], () => {
                    if (item.selectedState == 1) {
                        filter.state = 1;
                    }
                    else {
                        filter.state = 0;
                    }
                });
                globalCommandDispatcher.reConnectPluginsIfPlay();
            };
            if (filter.state) {
                item.lightTitle = true;
            }
            if (ff > 0) {
                item.onClick = () => {
                    globalCommandDispatcher.exe.commitProjectChanges(['filters'], () => {
                        let fltr = globalCommandDispatcher.cfg().data.filters.splice(ff, 1)[0];
                        globalCommandDispatcher.cfg().data.filters.splice(0, 0, fltr);
                    });
                };
            }
            else {
                item.onClick = () => {
                    let info = globalCommandDispatcher.findPluginRegistrationByKind(filter.kind);
                    if (info) {
                        globalCommandDispatcher.filterPluginDialog.openFilterPluginDialogFrame(ff, filter, info);
                    }
                    else {
                        globalCommandDispatcher.filterPluginDialog.openEmptyFilterPluginDialogFrame(ff, filter);
                    }
                };
                item.highlight = icon_sliders;
            }
            menuPointFxTracks.children.push(item);
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
        this.menuCloseButton.resize(this.shiftX + this.itemsWidth - 1, viewHeight - 1, 1);
        this.menuUpButton.resize(this.shiftX + this.itemsWidth - 1, 0, 1);
        this.rerenderMenuContent(null);
    }
}
class RightMenuItem {
    constructor(info, pad, tap, tap2, drag) {
        this.kindAction = 1;
        this.kindDraggableCircle = 2;
        this.kindDraggableSquare = 3;
        this.kindDraggableTriangle = 4;
        this.kindPreview = 5;
        this.kindClosedFolder = 6;
        this.kindOpenedFolder = 7;
        this.kindAction2 = 8;
        this.kindActionDisabled = 9;
        this.kind = this.kindAction;
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
    initDisabledItem() {
        this.kind = this.kindActionDisabled;
        return this;
    }
    initActionItem() {
        this.kind = this.kindAction;
        return this;
    }
    initActionItem2() {
        this.kind = this.kindAction2;
        return this;
    }
    initDraggableCircle() {
        this.kind = this.kindDraggableCircle;
        return this;
    }
    initDraggableSquare() {
        this.kind = this.kindDraggableSquare;
        return this;
    }
    initDraggableTriangle() {
        this.kind = this.kindDraggableTriangle;
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
        if (this.kind == this.kindAction) {
            anchor.content.push({ x: 0.1 + this.pad, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'rightMenuItemActionBG' });
            anchor.content.push({ x: 0.3 + this.pad, y: itemTop + 0.7, text: label, css: labelCss });
        }
        if (this.kind == this.kindActionDisabled) {
            anchor.content.push({ x: 0.1 + this.pad, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'rightMenuItemDisabledBG' });
            anchor.content.push({ x: 0.3 + this.pad, y: itemTop + 0.7, text: label, css: labelCss });
        }
        if (this.kind == this.kindAction2) {
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
        if (this.kind == this.kindDraggableCircle) {
            spot.draggable = true;
            spot.activation = this.drag;
            anchor.content.push({ x: 0.1 + this.pad, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'rightMenuItemDragBG' });
            anchor.content.push({ x: 0.3 + this.pad, y: itemTop + 0.7, text: label, css: labelCss });
        }
        if (this.kind == this.kindDraggableSquare) {
            spot.draggable = true;
            spot.activation = this.drag;
            anchor.content.push({ x: 0.15 + this.pad, y: itemTop + 0.15, w: 0.7, h: 0.7, rx: 0.05, ry: 0.05, css: 'rightMenuItemDragBG' });
            anchor.content.push({ x: 0.3 + this.pad, y: itemTop + 0.7, text: label, css: labelCss });
        }
        if (this.kind == this.kindDraggableTriangle) {
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
    text: localMenuActionsFolder,
    onFolderOpen: () => {
    }
};
let menuPointAddPlugin = {
    text: localMenuNewPlugin,
    onFolderOpen: () => {
    }
};
let menuPointInsTracks = {
    text: localMenuInsTracksFolder,
    onFolderOpen: () => {
    }
};
let menuPointDrumTracks = {
    text: localMenuDrumTracksFolder,
    onFolderOpen: () => {
    }
};
let menuPointFxTracks = {
    text: localMenuFxTracksFolder,
    onFolderOpen: () => {
    }
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
                }
            });
        }
        else {
            if (purpose == 'Sampler') {
                let dragStarted = false;
                let info;
                info = {
                    dragTriangle: true,
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
                            let tt = info.top ? info.top : 0;
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
                    }
                };
                menuPointAddPlugin.children.push(info);
            }
            else {
                if (purpose == 'Performer') {
                    let dragStarted = false;
                    let info;
                    info = {
                        dragSquare: true,
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
                                let tt = info.top ? info.top : 0;
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
                        }
                    };
                    menuPointAddPlugin.children.push(info);
                }
                else {
                    if (purpose == 'Filter') {
                        let dragStarted = false;
                        let info;
                        info = {
                            dragCircle: true,
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
                                    let tt = info.top ? info.top : 0;
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
                            }
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
            menuPointInsTracks,
            menuPointDrumTracks,
            menuPointFxTracks,
            menuPointActions,
            menuPointAddPlugin,
            {
                text: localMenuItemSettings, children: [
                    {
                        text: localMenuNewEmptyProject, onClick: () => {
                            globalCommandDispatcher.newEmptyProject();
                        }
                    },
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
                        text: 'Colors', children: [
                            {
                                text: 'Minium', onClick: () => {
                                    globalCommandDispatcher.setThemeColor('red1');
                                }
                            }, {
                                text: 'Greenstone', onClick: () => {
                                    globalCommandDispatcher.setThemeColor('green1');
                                }
                            }, {
                                text: 'Deep', onClick: () => {
                                    globalCommandDispatcher.setThemeColor('blue1');
                                }
                            }, {
                                text: 'Neon', onClick: () => {
                                    globalCommandDispatcher.setThemeColor('neon1');
                                }
                            },
                            {
                                text: 'Gjel', onClick: () => {
                                    globalCommandDispatcher.setThemeColor('light1');
                                }
                            },
                            {
                                text: 'Vorot', onClick: () => {
                                    globalCommandDispatcher.setThemeColor('light2');
                                }
                            }
                        ]
                    }, {
                        text: 'Language', children: [
                            {
                                text: 'Russian', onClick: () => {
                                    globalCommandDispatcher.setThemeLocale('ru', 1);
                                }
                            }, {
                                text: 'English', onClick: () => {
                                    globalCommandDispatcher.setThemeLocale('en', 1);
                                }
                            }, {
                                text: 'kitaiskiy', onClick: () => {
                                    globalCommandDispatcher.setThemeLocale('zh', 1.5);
                                }
                            }
                        ]
                    },
                    {
                        text: 'other', children: [{
                                text: localMenuClearUndoRedo, onClick: () => {
                                    globalCommandDispatcher.clearUndo();
                                    globalCommandDispatcher.clearRedo();
                                }
                            }, {
                                text: 'Plugindebug', onClick: () => {
                                    globalCommandDispatcher.promptPluginInfoDebug();
                                }
                            }]
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
                    let preCSS = 'firstTrackLabel';
                    if ((soloOnly && globalCommandDispatcher.cfg().data.tracks[0].performer.state != 2) || ((!soloOnly) && globalCommandDispatcher.cfg().data.tracks[0].performer.state == 1)) {
                        preCSS = 'firstTrackMute';
                    }
                    let trackLabel = {
                        x: 0,
                        y: globalCommandDispatcher.cfg().gridTop() + globalCommandDispatcher.cfg().gridHeight(),
                        text: globalCommandDispatcher.cfg().data.tracks[0].title,
                        css: preCSS + zoomPrefixLevelsCSS[zz].prefix
                    };
                    this.leftZoomAnchors[zz].content.push(trackLabel);
                    for (let tr = 1; tr < globalCommandDispatcher.cfg().data.tracks.length; tr++) {
                        let preCSS = 'otherTrackLabel';
                        if ((soloOnly && globalCommandDispatcher.cfg().data.tracks[tr].performer.state != 2) || ((!soloOnly) && globalCommandDispatcher.cfg().data.tracks[tr].performer.state == 1)) {
                            preCSS = 'otherTrackMute';
                        }
                        let trackLabel = {
                            x: 0,
                            y: globalCommandDispatcher.cfg().gridTop() + globalCommandDispatcher.cfg().gridHeight() - (1 + tr) * globalCommandDispatcher.cfg().notePathHeight,
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
            let track = globalCommandDispatcher.cfg().data.tracks[0];
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
        for (let ii = 1; ii < globalCommandDispatcher.cfg().data.tracks.length; ii++) {
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
            console.log('addTrackNotes not found', barIdx, 'for track', track.title);
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
    trackCellClick(barIdx, barX, yy, zz) {
        let trMeasure = globalCommandDispatcher.cfg().data.tracks[0].measures[barIdx];
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
            let measure = globalCommandDispatcher.cfg().data.tracks[0].measures[fromBar];
            globalCommandDispatcher.exe.commitProjectChanges(['tracks', 0, 'measures', barIdx], () => {
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
                    globalCommandDispatcher.exe.commitProjectChanges(['tracks', 0, 'measures', barIdx], () => {
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
                globalCommandDispatcher.exe.commitProjectChanges(['tracks', 0, 'measures', barIdx], () => {
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
                        dots: [xx, top + globalCommandDispatcher.cfg().autoPointHeight * aa,
                            xx + globalCommandDispatcher.cfg().autoPointHeight, top + globalCommandDispatcher.cfg().autoPointHeight * aa,
                            xx, top + globalCommandDispatcher.cfg().autoPointHeight * (aa + 1)
                        ],
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
        this.reFillSingleRatio(globalCommandDispatcher.cfg().samplerTop(), globalCommandDispatcher.cfg().samplerHeight(), this.barDrumCount);
        this.reFillSingleRatio(globalCommandDispatcher.cfg().gridTop(), globalCommandDispatcher.cfg().gridHeight(), this.barTrackCount);
        this.reFillSingleRatio(globalCommandDispatcher.cfg().automationTop(), globalCommandDispatcher.cfg().automationHeight(), this.barAutoCount);
        this.reFillSingleRatio(globalCommandDispatcher.cfg().commentsTop(), globalCommandDispatcher.cfg().commentsMaxHeight(), this.barCommentsCount);
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
    reFillSingleRatio(yy, hh, countFunction) {
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
        for (let ii = 0; ii < globalCommandDispatcher.cfg().data.tracks.length; ii++) {
            if (globalCommandDispatcher.cfg().data.tracks[ii].performer.id == this.performerId) {
                this.addPerformerSpot(ii > 0, ii, globalCommandDispatcher.cfg().data.tracks[ii], fanLevelAnchor, spearsAnchor, zidx);
                break;
            }
        }
    }
    addPerformerSpot(secondary, trackNo, track, fanLevelAnchor, spearsAnchor, zidx) {
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
            rec.css = 'fanSamplerMoveIcon fanSamplerMoveIcon' + zidx;
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
            let btn = {
                x: xx - sz / 2,
                y: yy,
                w: sz,
                h: sz / 2,
                css: 'fanSamplerInteractionIcon fanButton' + zidx,
                activation: (x, y) => {
                    let info = globalCommandDispatcher.findPluginRegistrationByKind(track.performer.kind);
                    globalCommandDispatcher.sequencerPluginDialog.openSequencerPluginDialogFrame(trackNo, track, info);
                }
            };
            dragAnchor.content.push(btn);
        }
        if (zidx <= 5) {
            let txt = {
                text: track.title,
                x: xx - sz * 0.45,
                y: yy - sz * 0.1,
                css: 'fanIconLabel fanIconLabelSize' + zidx
            };
            dragAnchor.content.push(txt);
        }
        let performerFromY = globalCommandDispatcher.cfg().gridTop() + globalCommandDispatcher.cfg().gridHeight() / 2;
        new ControlConnection().addAudioStreamLineFlow(secondary, zidx, performerFromY, xx, yy, spearsAnchor);
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
    buildSamplerSpot(order, fanLevelAnchor, spearsAnchor, zidx) {
        for (let ii = 0; ii < globalCommandDispatcher.cfg().data.percussions.length; ii++) {
            if (globalCommandDispatcher.cfg().data.percussions[ii].sampler.id == this.samplerId) {
                this.addSamplerSpot(order, globalCommandDispatcher.cfg().data.percussions[ii], fanLevelAnchor, spearsAnchor, zidx);
                break;
            }
        }
    }
    addSamplerSpot(order, samplerTrack, fanLevelAnchor, spearsAnchor, zidx) {
        let sz = globalCommandDispatcher.cfg().fanPluginIconSize(zidx) * 0.66;
        let left = globalCommandDispatcher.cfg().leftPad + globalCommandDispatcher.cfg().timelineWidth() + globalCommandDispatcher.cfg().padGridFan;
        let top = globalCommandDispatcher.cfg().gridTop();
        let xx = left;
        let yy = top;
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
                    if (!samplerTrack.sampler.iconPosition) {
                        samplerTrack.sampler.iconPosition = { x: 0, y: 0 };
                    }
                    if (toSpeaker) {
                        globalCommandDispatcher.exe.commitProjectChanges(['percussions', order, 'sampler', 'outputs'], () => {
                            samplerTrack.sampler.outputs.push('');
                        });
                    }
                    else {
                        if (toFilter) {
                            globalCommandDispatcher.exe.commitProjectChanges(['percussions', order, 'sampler', 'outputs'], () => {
                                if (toFilter)
                                    samplerTrack.sampler.outputs.push(toFilter.id);
                            });
                        }
                        else {
                            globalCommandDispatcher.exe.commitProjectChanges(['percussions', order, 'sampler'], () => {
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
            rec.css = 'fanSamplerMoveIcon fanSamplerMoveIcon' + zidx;
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
            let btn = {
                x: xx - sz * 0.6,
                y: yy - sz,
                dots: [0, sz, sz * 2 * 0.8, sz, 0, sz * 2],
                css: 'fanSamplerInteractionIcon fanButton' + zidx,
                activation: (x, y) => {
                    let info = globalCommandDispatcher.findPluginRegistrationByKind(samplerTrack.sampler.kind);
                    globalCommandDispatcher.samplerPluginDialog.openDrumPluginDialogFrame(order, samplerTrack, info);
                }
            };
            dragAnchor.content.push(btn);
        }
        if (zidx <= 5) {
            let txt = {
                text: samplerTrack.title,
                x: xx - sz * 0.5,
                y: yy - sz * 0.2,
                css: 'fanIconLabel fanIconLabelSize' + zidx
            };
            dragAnchor.content.push(txt);
        }
        let samplerFromY = globalCommandDispatcher.cfg().samplerTop()
            + (order + 0.5) * globalCommandDispatcher.cfg().samplerDotHeight;
        new ControlConnection().addAudioStreamLineFlow(order > 0, zidx, samplerFromY, xx, yy, spearsAnchor);
        let fol = new FanOutputLine();
        for (let oo = 0; oo < samplerTrack.sampler.outputs.length; oo++) {
            let outId = samplerTrack.sampler.outputs[oo];
            if (outId) {
                fol.connectOutput(outId, samplerTrack.sampler.id, xx, yy, spearsAnchor, fanLevelAnchor, zidx, samplerTrack.sampler.outputs, (x, y) => {
                    globalCommandDispatcher.exe.commitProjectChanges(['percussions', order, 'sampler', 'outputs'], () => {
                        let nn = samplerTrack.sampler.outputs.indexOf(outId);
                        if (nn > -1) {
                            samplerTrack.sampler.outputs.splice(nn, 1);
                        }
                    });
                });
            }
            else {
                fol.connectSpeaker(samplerTrack.sampler.id, xx, yy, spearsAnchor, fanLevelAnchor, zidx, samplerTrack.sampler.outputs, (x, y) => {
                    globalCommandDispatcher.exe.commitProjectChanges(['percussions', order, 'sampler', 'outputs'], () => {
                        let nn = samplerTrack.sampler.outputs.indexOf('');
                        if (nn > -1) {
                            samplerTrack.sampler.outputs.splice(nn, 1);
                        }
                    });
                });
            }
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
            rec.css = 'fanSamplerMoveIcon fanSamplerMoveIcon' + zidx;
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
            let btn = {
                x: xx - sz / 2,
                y: yy,
                points: 'M 0 0 a 1 1 0 0 0 ' + (sz * px) + ' 0 Z',
                css: 'fanSamplerInteractionIcon fanButton' + zidx,
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
                css: 'fanIconLabel fanIconLabelSize' + zidx
            };
            dragAnchor.content.push(txt);
        }
        let filterFromY = globalCommandDispatcher.cfg().automationTop() + (order + 0.5) * globalCommandDispatcher.cfg().autoPointHeight;
        let start = globalCommandDispatcher.cfg().leftPad + globalCommandDispatcher.cfg().timelineWidth();
        let css = 'fanConnectionBase fanConnection' + zidx;
        if (order) {
            css = 'fanConnectionBase fanConnectionSecondary fanConnection' + zidx;
        }
        let hoLine = { x1: start, x2: xx, y1: filterFromY, y2: filterFromY, css: css };
        spearsAnchor.content.push(hoLine);
        new SpearConnection().addSpear(order > 0, zidx, xx, filterFromY, sz, xx, yy, spearsAnchor);
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
    cancel() {
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
        this.warningTitle = { x: 0, y: 0, text: 'Play', css: 'warningTitle' };
        this.warningDescription = { x: 0, y: 0, text: 'Controls:', css: 'warningDescription' };
        this.warningSmallText = { x: 0, y: 0, text: 'Use mouse or touchpad to move and zoom piano roll', css: 'warningSmallText' };
        this.warningGroup = document.getElementById("warningDialogGroup");
        this.warningRectangle = {
            x: 0, y: 0, w: 1, h: 1, css: 'warningBG', activation: () => {
                globalCommandDispatcher.initAudioFromUI();
                me.cancel();
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
    showWarning(title, msg, smallMsg, onCancel) {
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
        filters: []
    };
    return newEmptyProject;
}
let _______mzxbxProjectForTesting2 = {
    title: 'test data for debug',
    versionCode: '1',
    list: false,
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
    ]
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
            ww = ww + mm.set(this.data.timeline[ii].metre).duration(this.data.timeline[ii].tempo) * this.widthDurationRatio;
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