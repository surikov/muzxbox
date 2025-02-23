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
    let ui = new UIRenderer();
    ui.createUI();
    window.addEventListener("beforeunload", saveProjectState);
    globalCommandDispatcher.registerWorkProject(_mzxbxProjectForTesting2);
    try {
        let lastprojectdata = readObjectFromlocalStorage('lastprojectdata');
        if (lastprojectdata) {
            globalCommandDispatcher.registerWorkProject(lastprojectdata);
        }
        globalCommandDispatcher.clearUndo();
        globalCommandDispatcher.clearRedo();
        let undocommands = readObjectFromlocalStorage('undocommands');
        if (undocommands) {
            if (undocommands.length) {
                globalCommandDispatcher.undoQueue = undocommands;
            }
        }
        let redocommands = readObjectFromlocalStorage('redocommands');
        if (redocommands) {
            if (redocommands.length) {
                globalCommandDispatcher.redoQueue = redocommands;
            }
        }
    }
    catch (xx) {
        console.log(xx);
    }
    globalCommandDispatcher.resetProject();
    let themei = readTextFromlocalStorage('uicolortheme');
    if (themei) {
        globalCommandDispatcher.setThemeColor(themei);
    }
}
function saveProjectState() {
    globalCommandDispatcher.exe.cutLongUndo();
    let txtdata = JSON.stringify(globalCommandDispatcher.cfg().data);
    try {
        console.log('state size', txtdata.length);
        saveText2localStorage('lastprojectdata', txtdata);
        saveText2localStorage('undocommands', JSON.stringify(globalCommandDispatcher.undo()));
        saveText2localStorage('redocommands', JSON.stringify(globalCommandDispatcher.redo()));
    }
    catch (xx) {
        console.log(xx);
        window.localStorage.clear();
        try {
            saveText2localStorage('lastprojectdata', txtdata);
            saveText2localStorage('undocommands', JSON.stringify(globalCommandDispatcher.undo()));
            saveText2localStorage('redocommands', JSON.stringify(globalCommandDispatcher.redo()));
        }
        catch (nn) {
            console.log(nn);
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
class PluginDialogPrompt {
    constructor() {
        this.dialogID = '?';
        this.waitForPluginInit = false;
        this.waitTitleAction = null;
        this.waitProjectCallback = null;
        this.waitTimelinePointCallback = null;
        window.addEventListener('message', this.receiveMessageFromPlugin.bind(this), false);
    }
    openActionPluginDialogFrame(label, url, callback) {
        this.waitProjectCallback = callback;
        this.waitTimelinePointCallback = null;
        let pluginTitle = document.getElementById("pluginTitle");
        pluginTitle.innerHTML = " " + label;
        let pluginFrame = document.getElementById("pluginFrame");
        if (pluginFrame) {
            if (pluginFrame.contentWindow) {
                this.waitForPluginInit = true;
                pluginFrame.src = url;
                document.getElementById("pluginBottom").style.display = "none";
                document.getElementById("pluginDiv").style.visibility = "visible";
            }
        }
    }
    openPluginPointDialogFrame(label, url, raw, callback, btnLabel, btnAction, titleAction) {
        this.waitTitleAction = titleAction;
        this.waitProjectCallback = null;
        this.waitTimelinePointCallback = callback;
        this.rawData = raw;
        let pluginTitle = document.getElementById("pluginTitle");
        pluginTitle.innerHTML = label;
        let pluginFrame = document.getElementById("pluginFrame");
        if (pluginFrame) {
            if (pluginFrame.contentWindow) {
                this.waitForPluginInit = true;
                pluginFrame.src = url;
                document.getElementById("pluginBottom").style.display = "flex";
                document.getElementById("pluginDiv").style.visibility = "visible";
            }
        }
    }
    sendNewIdToPlugin() {
        let pluginFrame = document.getElementById("pluginFrame");
        if (pluginFrame) {
            this.dialogID = '' + Math.random();
            let message = { hostData: this.dialogID };
            pluginFrame.contentWindow.postMessage(message, '*');
        }
    }
    sendCurrentProjectToPlugin() {
        let pluginFrame = document.getElementById("pluginFrame");
        if (pluginFrame) {
            let message = { hostData: globalCommandDispatcher.cfg().data };
            pluginFrame.contentWindow.postMessage(message, '*');
        }
    }
    sendPointToPlugin() {
        let pluginFrame = document.getElementById("pluginFrame");
        if (pluginFrame) {
            let message = { hostData: this.rawData };
            pluginFrame.contentWindow.postMessage(message, '*');
        }
    }
    closeDialogFrame() {
        let pluginFrame = document.getElementById("pluginFrame");
        if (pluginFrame) {
            pluginFrame.src = "plugins/pluginplaceholder.html";
        }
        document.getElementById("pluginBottom").style.display = "none";
        document.getElementById("pluginDiv").style.visibility = "hidden";
    }
    receiveMessageFromPlugin(event) {
        if (!(event.data)) {
        }
        else {
            let message = event.data;
            if (message.dialogID) {
                if (message.dialogID == this.dialogID) {
                    if (this.waitProjectCallback) {
                        let me = this;
                        globalCommandDispatcher.exe.commitProjectChanges([], () => {
                            if (me.waitProjectCallback) {
                                let newProj = message.pluginData;
                                me.waitProjectCallback(message.pluginData);
                                if (message.done) {
                                    me.closeDialogFrame();
                                }
                            }
                        });
                    }
                    else {
                        if (this.waitTimelinePointCallback) {
                            this.waitTimelinePointCallback(message.pluginData);
                        }
                    }
                    globalCommandDispatcher.reStartPlayIfPlay();
                }
                else {
                }
            }
            else {
                if (this.waitForPluginInit) {
                    this.waitForPluginInit = false;
                    this.sendNewIdToPlugin();
                    if (this.waitProjectCallback) {
                        this.sendCurrentProjectToPlugin();
                    }
                    else {
                        if (this.waitTimelinePointCallback) {
                            this.sendPointToPlugin();
                        }
                    }
                }
                else {
                    console.log('wrong received object');
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
        globalCommandDispatcher.undo().push(cmd);
        globalCommandDispatcher.resetProject();
    }
    parentFromPath(path) {
        let parent = globalCommandDispatcher.cfg().data;
        for (let ii = 0; ii < path.length - 1; ii++) {
            parent = parent[path[ii]];
        }
        return parent;
    }
    unAction(cmd) {
        globalCommandDispatcher.stopPlay();
        for (let ii = cmd.actions.length - 1; ii >= 0; ii--) {
            let act = cmd.actions[ii];
            let parent = this.parentFromPath(act.path);
            let prop = act.path[act.path.length - 1];
            if (act.kind == '+') {
                let idx = prop;
                parent.splice(idx, 1);
            }
            else {
                if (act.kind == '-') {
                    let remove = act;
                    let value = JSON.parse(JSON.stringify(remove.oldNode));
                    let idx = prop;
                    parent.splice(idx, 0, value);
                }
                else {
                    if (act.kind == '=') {
                        let change = act;
                        parent[prop] = JSON.parse(JSON.stringify(change.oldValue));
                    }
                }
            }
        }
    }
    reAction(cmd) {
        globalCommandDispatcher.stopPlay();
        for (let ii = 0; ii < cmd.actions.length; ii++) {
            let act = cmd.actions[ii];
            let parent = this.parentFromPath(act.path);
            let prop = act.path[act.path.length - 1];
            if (act.kind == '+') {
                let create = act;
                let value = JSON.parse(JSON.stringify(create.newNode));
                let idx = prop;
                parent.splice(idx, 0, value);
            }
            else {
                if (act.kind == '-') {
                    let idx = prop;
                    parent.splice(idx, 1);
                }
                else {
                    if (act.kind == '=') {
                        let change = act;
                        parent[prop] = JSON.parse(JSON.stringify(change.newValue));
                    }
                }
            }
        }
    }
    cutLongUndo() {
        let actionCount = 0;
        for (let ii = 0; ii < globalCommandDispatcher.undo().length; ii++) {
            let one = globalCommandDispatcher.undo()[ii];
            actionCount = actionCount + one.actions.length;
            if (actionCount > 43210) {
                console.log('cut undo ', ii, 'from', globalCommandDispatcher.undo().length);
                globalCommandDispatcher.undo().splice(0, ii);
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
            this.lockUndoRedo = true;
            for (let ii = 0; ii < cnt; ii++) {
                if (globalCommandDispatcher.undo().length) {
                    let cmd = globalCommandDispatcher.undo().pop();
                    if (cmd) {
                        this.unAction(cmd);
                        globalCommandDispatcher.redo().unshift(cmd);
                        if (cmd.position) {
                            this.setCurPosition(cmd.position);
                        }
                    }
                }
            }
            this.lockUndoRedo = false;
            this.cutLongUndo();
        }
        globalCommandDispatcher.resetProject();
    }
    redo(cnt) {
        if (this.lockUndoRedo) {
            console.log('lockUndoRedo');
        }
        else {
            this.lockUndoRedo = true;
            for (let ii = 0; ii < cnt; ii++) {
                if (globalCommandDispatcher.redo().length) {
                    let cmd = globalCommandDispatcher.redo().shift();
                    if (cmd) {
                        this.reAction(cmd);
                        globalCommandDispatcher.undo().push(cmd);
                        if (cmd.position) {
                            this.setCurPosition(cmd.position);
                        }
                    }
                }
            }
            this.lockUndoRedo = false;
            this.cutLongUndo();
        }
        globalCommandDispatcher.resetProject();
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
    }
    cfg() {
        return this._mixerDataMathUtility;
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
                    properties: sampler.sampler.data
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
                    properties: track.performer.data
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
                outputs: []
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
        let me = this;
        let result = me.player.startSetupPlugins(me.audioContext, schedule);
        if (this.playPosition < from) {
            this.playPosition = from;
        }
        if (this.playPosition >= to) {
            this.playPosition = to;
        }
        me.startPlayLoop(from, this.playPosition, to);
        if (result != null) {
            me.renderer.warning.showWarning('Start playing', result, null);
        }
        else {
        }
    }
    startPlayLoop(from, position, to) {
        let me = this;
        let msg = me.player.startLoopTicks(from, position, to);
        if (msg) {
            me.renderer.warning.showWarning('Start playing', 'Wait for ' + msg, () => {
                console.log('cancel wait spart loop');
            });
            let id = setTimeout(() => {
                me.startPlayLoop(from, position, to);
            }, 1000);
        }
        else {
            me.renderer.warning.hideWarning();
            me.renderer.menu.rerenderMenuContent(null);
            me.resetProject();
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
    setThemeColor(idx) {
        let cssPath = 'theme/colordarkblue.css';
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
        startLoadCSSfile(cssPath);
        this.renderer.menu.resizeMenu(this.renderer.menu.lastWidth, this.renderer.menu.lastHeight);
        saveText2localStorage('uicolortheme', idx);
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
        try {
            this.renderer.fillWholeUI();
            this.setupSelectionBackground(this.cfg().data.selectedPart);
        }
        catch (xx) {
            console.log('resetProject', xx);
            console.log('data', this.cfg().data);
        }
    }
    promptActionPluginDialog(label, url, callback) {
        pluginDialogPrompt.openActionPluginDialogFrame(label, url, callback);
    }
    promptPluginPointDialog(label, url, rawdata, callback, btnLabel, btnAction, titleAction) {
        pluginDialogPrompt.openPluginPointDialogFrame(label, url, rawdata, callback, btnLabel, btnAction, titleAction);
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
    cancelPluginGUI() {
        pluginDialogPrompt.closeDialogFrame();
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
    setupSelectionBackground(selectedPart) {
        let tileLevelSVG = document.getElementById('tileLevelSVG');
        if (selectedPart.startMeasure < 0) {
            tileLevelSVG === null || tileLevelSVG === void 0 ? void 0 : tileLevelSVG.style.setProperty('background', 'var(--unselectedbg-color)');
        }
        else {
            tileLevelSVG === null || tileLevelSVG === void 0 ? void 0 : tileLevelSVG.style.setProperty('background', 'var(--selectedbgground-color)');
        }
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
                this.setupSelectionBackground(curPro.selectedPart);
            }
        }
        else {
            console.log('no project data');
        }
        if (this.cfg().data.selectedPart.startMeasure >= 0) {
            this.playPosition = 0;
            for (let mm = 0; mm < this.cfg().data.selectedPart.startMeasure; mm++) {
                let measure = this.cfg().data.timeline[mm];
                let cuDuration = MMUtil().set(measure.metre).duration(measure.tempo);
                this.playPosition = this.playPosition + cuDuration;
            }
        }
        this.renderer.timeselectbar.updateTimeSelectionBar();
        this.renderer.tiler.resetAnchor(this.renderer.timeselectbar.selectedTimeSVGGroup, this.renderer.timeselectbar.selectionAnchor, LevelModes.top);
        this.reDrawPlayPosition();
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
        id: localMenuPerformersFolder, data: [
            { locale: 'en', text: 'Add performer' },
            { locale: 'ru', text: '+ Перформер' },
            { locale: 'zh', text: '?' }
        ]
    }, {
        id: localMenuFiltersFolder, data: [
            { locale: 'en', text: 'Add filter' },
            { locale: 'ru', text: '+ Фильтр' },
            { locale: 'zh', text: '?' }
        ]
    }, {
        id: localMenuSamplersFolder, data: [
            { locale: 'en', text: 'Add sampler' },
            { locale: 'ru', text: '+ Сэмплер' },
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
        this.positionTimeSVGGroup = document.getElementById("timepositionmark");
        this.positionTimeMark = {
            x: 0,
            y: 0,
            w: this.positionMarkWidth(),
            h: 11,
            css: 'positionTimeMark'
        };
        this.positionTimeAnchor = {
            xx: 0, yy: 0, ww: 1, hh: 1,
            showZoom: zoomPrefixLevelsCSS[0].minZoom,
            hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom,
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
                globalCommandDispatcher.timeSelectChange(barIdx);
            }
        };
        measureAnchor.content.push(mark);
    }
    createBarNumber(barLeft, barnum, zz, curBar, measureAnchor, barTime, size) {
        let mins = Math.floor(barTime / 60);
        let secs = Math.floor(barTime % 60);
        let hunds = Math.round(100 * (barTime - Math.floor(barTime)));
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
            showZoom: zoomPrefixLevelsCSS[0].minZoom,
            hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom,
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
        this.backgroundAnchor = {
            xx: 0, yy: 0, ww: 111, hh: 111,
            showZoom: zoomPrefixLevelsCSS[0].minZoom,
            hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom,
            content: [
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
                }
            }
            else {
                if (it.dragMix) {
                    this.items.push(new RightMenuItem(it, pad, () => { }, () => { }, (x, y) => {
                        if (it.onDrag) {
                            it.onDrag(x, y);
                        }
                        me.setFocus(it, infos);
                        me.resetAllAnchors();
                    }).initDraggableItem());
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
                        }
                        else {
                            this.items.push(new RightMenuItem(it, pad, () => {
                                me.setFocus(it, infos);
                                me.resetAllAnchors();
                            }).initDisabledItem());
                        }
                    }
                }
            }
        }
    }
    readCurrentSongData(project) {
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
                        let url = info.ui;
                        globalCommandDispatcher.promptPluginPointDialog(track.title, url, track.performer.data, (obj) => {
                            globalCommandDispatcher.exe.commitProjectChanges(['tracks', tt, 'performer'], () => {
                                track.performer.data = obj;
                            });
                            return true;
                        }, LO(localDropInsTrack), () => {
                            globalCommandDispatcher.exe.commitProjectChanges(['tracks'], () => {
                                globalCommandDispatcher.cfg().data.tracks.splice(tt, 1);
                            });
                            globalCommandDispatcher.cancelPluginGUI();
                        }, (newTitle) => {
                            globalCommandDispatcher.exe.commitProjectChanges(['tracks', tt], () => {
                                track.title = newTitle;
                            });
                            globalCommandDispatcher.cancelPluginGUI();
                        });
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
                        let url = info.ui;
                        globalCommandDispatcher.promptPluginPointDialog(drum.title, url, drum.sampler.data, (obj) => {
                            globalCommandDispatcher.exe.commitProjectChanges(['percussions', tt, 'sampler'], () => {
                                drum.sampler.data = obj;
                            });
                            return true;
                        }, LO(localDropSampleTrack), () => {
                            globalCommandDispatcher.exe.commitProjectChanges(['percussions'], () => {
                                globalCommandDispatcher.cfg().data.percussions.splice(tt, 1);
                            });
                            globalCommandDispatcher.cancelPluginGUI();
                        }, (newTitle) => {
                            globalCommandDispatcher.exe.commitProjectChanges(['percussions', tt], () => {
                                drum.title = newTitle;
                            });
                            globalCommandDispatcher.cancelPluginGUI();
                        });
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
                        let url = info.ui;
                        globalCommandDispatcher.promptPluginPointDialog(filter.title, url, filter.data, (obj) => {
                            globalCommandDispatcher.exe.commitProjectChanges(['filters', ff], () => {
                                filter.data = obj;
                            });
                            return true;
                        }, LO(localDropFilterTrack), () => {
                            globalCommandDispatcher.exe.commitProjectChanges(['filters'], () => {
                                globalCommandDispatcher.cfg().data.filters.splice(ff, 1);
                            });
                            globalCommandDispatcher.cancelPluginGUI();
                        }, (newTitle) => {
                            globalCommandDispatcher.exe.commitProjectChanges(['filters', ff], () => {
                                filter.title = newTitle;
                            });
                            globalCommandDispatcher.cancelPluginGUI();
                        });
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
        this.kindDraggable = 2;
        this.kindPreview = 3;
        this.kindClosedFolder = 4;
        this.kindOpenedFolder = 5;
        this.kindAction2 = 6;
        this.kindActionDisabled = 7;
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
        }
        anchor.content.push({ x: 0, y: itemTop + this.calculateHeight(), w: itemWidth, h: 0.02, css: 'rightMenuDelimiterLine' });
        let spot = { x: this.pad, y: itemTop, w: 1, h: 1, activation: this.action, css: 'transparentSpot' };
        let spot2 = null;
        if (this.kind == this.kindAction) {
            anchor.content.push({ x: 0.1 + this.pad, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'rightMenuItemActionBG' });
            anchor.content.push({ x: 0.3 + this.pad, y: itemTop + 0.7, text: label, css: 'rightMenuLabel' });
        }
        if (this.kind == this.kindActionDisabled) {
            anchor.content.push({ x: 0.1 + this.pad, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'rightMenuItemDisabledBG' });
            anchor.content.push({ x: 0.3 + this.pad, y: itemTop + 0.7, text: label, css: 'rightMenuLabel' });
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
                anchor.content.push({ x: 1 + this.pad, y: itemTop + 0.7, text: label, css: 'rightMenuLabel' });
            }
            else {
                anchor.content.push({ x: 0.3 + this.pad, y: itemTop + 0.7, text: label, css: 'rightMenuLabel' });
            }
            anchor.content.push({ x: itemWidth - 1.1, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'rightMenuItemActionBG' });
            anchor.content.push({ x: itemWidth - 1.1 + 0.4, y: itemTop + 0.7, text: stateIicon, css: 'rightMenuIconLabel' });
            spot2 = { x: itemWidth - 1.2, y: itemTop, w: 1, h: 1, activation: this.action2, css: 'transparentSpot' };
        }
        if (this.kind == this.kindDraggable) {
            spot.draggable = true;
            spot.activation = this.drag;
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
    text: localMenuActionsFolder,
    onFolderOpen: () => {
    }
};
let menuPointPerformers = {
    text: localMenuPerformersFolder,
    onFolderOpen: () => {
    }
};
let menuPointFilters = {
    text: localMenuFiltersFolder,
    onFolderOpen: () => {
    }
};
let menuPointSamplers = {
    text: localMenuSamplersFolder,
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
    menuPointFilters.children = [];
    menuPointPerformers.children = [];
    menuPointSamplers.children = [];
    menuPointActions.children = [];
    for (let ii = 0; ii < MZXBX_currentPlugins().length; ii++) {
        let label = MZXBX_currentPlugins()[ii].label;
        let purpose = MZXBX_currentPlugins()[ii].purpose;
        let url = MZXBX_currentPlugins()[ii].ui;
        if (purpose == 'Action') {
            menuPointActions.children.push({
                text: label, noLocalization: true, onClick: () => {
                    globalCommandDispatcher.promptActionPluginDialog(label, url, (obj) => {
                        let project = obj;
                        globalCommandDispatcher.registerWorkProject(project);
                        globalCommandDispatcher.resetProject();
                        return true;
                    });
                }
            });
        }
        else {
            if (purpose == 'Sampler') {
                menuPointSamplers.children.push({
                    dragMix: true,
                    text: label, noLocalization: true, onDrag: (x, y) => {
                        console.log(purpose, label, x, y);
                    }
                });
            }
            else {
                if (purpose == 'Performer') {
                    menuPointPerformers.children.push({
                        dragMix: true,
                        text: label, noLocalization: true, onDrag: (x, y) => {
                            console.log(purpose, label, x, y);
                        }
                    });
                }
                else {
                    if (purpose == 'Filter') {
                        menuPointFilters.children.push({
                            dragMix: true,
                            text: label, noLocalization: true, onDrag: (x, y) => {
                                console.log(purpose, label, x, y);
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
            {
                text: localMenuNewPlugin, children: [
                    menuPointFilters,
                    menuPointPerformers,
                    menuPointSamplers
                ]
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
                        text: 'Colors', children: [
                            {
                                text: 'Red', onClick: () => {
                                    globalCommandDispatcher.setThemeColor('red1');
                                }
                            }, {
                                text: 'Green', onClick: () => {
                                    globalCommandDispatcher.setThemeColor('green1');
                                }
                            }, {
                                text: 'Blue', onClick: () => {
                                    globalCommandDispatcher.setThemeColor('blue1');
                                }
                            }, {
                                text: 'Neon', onClick: () => {
                                    globalCommandDispatcher.setThemeColor('neon1');
                                }
                            },
                            {
                                text: 'Light', onClick: () => {
                                    globalCommandDispatcher.setThemeColor('light1');
                                }
                            }
                        ]
                    },
                    {
                        text: localMenuClearUndoRedo, onClick: () => {
                            globalCommandDispatcher.clearUndo();
                            globalCommandDispatcher.clearRedo();
                        }
                    }
                ]
            },
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
            if (zz < 5) {
                for (let ss = 0; ss < globalCommandDispatcher.cfg().data.percussions.length; ss++) {
                    let samplerLabel = {
                        text: '' + globalCommandDispatcher.cfg().data.percussions[ss].title,
                        x: 0,
                        y: globalCommandDispatcher.cfg().samplerTop()
                            + globalCommandDispatcher.cfg().samplerDotHeight * (1 + ss)
                            - globalCommandDispatcher.cfg().samplerDotHeight * 0.3,
                        css: 'samplerRowLabel' + zoomPrefixLevelsCSS[zz].prefix
                    };
                    this.leftZoomAnchors[zz].content.push(samplerLabel);
                }
            }
            if (zz < 5) {
                for (let ff = 0; ff < globalCommandDispatcher.cfg().data.filters.length; ff++) {
                    let filter = globalCommandDispatcher.cfg().data.filters[ff];
                    let autoLabel = {
                        text: '' + filter.id,
                        x: 0,
                        y: globalCommandDispatcher.cfg().automationTop()
                            + (1 + ff) * globalCommandDispatcher.cfg().autoPointHeight
                            - 0.3 * globalCommandDispatcher.cfg().autoPointHeight,
                        css: 'autoRowLabel' + zoomPrefixLevelsCSS[zz].prefix
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
        let css = 'samplerDrumDotBg';
        for (let ss = 0; ss < measure.skips.length; ss++) {
            let skip = measure.skips[ss];
            let xx = left + MMUtil().set(skip).duration(tempo) * globalCommandDispatcher.cfg().widthDurationRatio;
            let bgline = {
                dots: [xx, yy,
                    xx, yy + globalCommandDispatcher.cfg().samplerDotHeight,
                    xx + durationLen, yy + globalCommandDispatcher.cfg().samplerDotHeight / 2
                ],
                css: 'samplerDrumDotLine'
            };
            anchor.content.push(bgline);
            let ply = {
                dots: [xx, yy,
                    xx, yy + globalCommandDispatcher.cfg().samplerDotHeight,
                    xx + ww, yy + globalCommandDispatcher.cfg().samplerDotHeight / 2
                ],
                css: css
            };
            anchor.content.push(ply);
            if (zoomLevel < globalCommandDispatcher.cfg().zoomEditSLess) {
                let yShift = 0.4;
                if (zoomLevel < 2)
                    yShift = 0.27;
                if (zoomLevel < 1)
                    yShift = 0.20;
                let deleteIcon = {
                    x: xx + globalCommandDispatcher.cfg().samplerDotHeight / 32,
                    y: yy + globalCommandDispatcher.cfg().samplerDotHeight / 2 + yShift,
                    text: icon_close_circle,
                    css: 'samplerDrumDeleteIcon samplerDrumDeleteSize' + zoomLevel
                };
                anchor.content.push(deleteIcon);
            }
        }
    }
}
class BarOctave {
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
            let track = globalCommandDispatcher.cfg().data.tracks[0];
            let css = 'mixNoteLine';
            this.addTrackNotes(track, barIdx, octaveIdx, left, top, width, height, barOctaveAnchor, transpose, css, true, zoomLevel);
        }
    }
    addOtherNotes(barIdx, octaveIdx, left, top, width, height, barOctaveAnchor, transpose, zoomLevel) {
        for (let ii = 1; ii < globalCommandDispatcher.cfg().data.tracks.length; ii++) {
            let track = globalCommandDispatcher.cfg().data.tracks[ii];
            this.addTrackNotes(track, barIdx, octaveIdx, left, top, width, height, barOctaveAnchor, transpose, 'mixNoteSub', false, zoomLevel);
        }
    }
    addTrackNotes(track, barIdx, octaveIdx, left, top, width, height, barOctaveAnchor, transpose, css, interact, zoomLevel) {
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
                                let yShift = 0.13;
                                let xShift = 0.10;
                                if (zoomLevel < 2) {
                                    yShift = 0.22;
                                    xShift = 0.21;
                                }
                                if (zoomLevel < 1) {
                                    yShift = 0.33;
                                    xShift = 0.33;
                                }
                                let deleteIcon = {
                                    x: xStart + xShift,
                                    y: yStart - yShift,
                                    text: icon_close_circle,
                                    css: 'samplerDrumDeleteIcon samplerDrumDeleteSize' + zoomLevel
                                };
                                barOctaveAnchor.content.push(deleteIcon);
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
        for (let oo = globalCommandDispatcher.cfg().transposeOctaveCount(); oo < globalCommandDispatcher.cfg().drawOctaveCount(); oo++) {
            let gridOctaveAnchor = {
                showZoom: zoomPrefixLevelsCSS[zoomLevel].minZoom,
                hideZoom: zoomPrefixLevelsCSS[zoomLevel + 1].minZoom,
                xx: left,
                yy: globalCommandDispatcher.cfg().gridTop() + oo * h12 - transpose,
                ww: ww,
                hh: h12, content: [],
                id: 'octaveGridz' + zoomLevel + 'b' + barIdx + 'o' + oo + 'r' + Math.random()
            };
            gridZoomBarAnchor.content.push(gridOctaveAnchor);
            let tracksOctaveAnchor = {
                showZoom: zoomPrefixLevelsCSS[zoomLevel].minZoom,
                hideZoom: zoomPrefixLevelsCSS[zoomLevel + 1].minZoom,
                xx: left,
                yy: globalCommandDispatcher.cfg().gridTop() + oo * h12 - transpose,
                ww: ww,
                hh: h12, content: [],
                id: 'octaveTracks' + zoomLevel + 'b' + barIdx + 'o' + oo + 'r' + Math.random()
            };
            tracksZoomBarAnchor.content.push(tracksOctaveAnchor);
            let firstOctaveAnchor = {
                showZoom: zoomPrefixLevelsCSS[zoomLevel].minZoom,
                hideZoom: zoomPrefixLevelsCSS[zoomLevel + 1].minZoom,
                xx: left,
                yy: globalCommandDispatcher.cfg().gridTop() + oo * h12 - transpose,
                ww: ww,
                hh: h12, content: [],
                id: 'octaveFirst' + zoomLevel + 'b' + barIdx + 'o' + oo + 'r' + Math.random()
            };
            firstZoomBarAnchor.content.push(firstOctaveAnchor);
            new BarOctave(barIdx, (globalCommandDispatcher.cfg().drawOctaveCount() - oo - 1), left, globalCommandDispatcher.cfg().gridTop() + oo * h12, ww, h12, gridOctaveAnchor, tracksOctaveAnchor, firstOctaveAnchor, transpose, zoomLevel);
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
                activation: (x, y) => { this.cellClick(x, y, zIndex, barIdx); }
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
    cellClick(x, y, zz, idx) {
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
        let css = 'automationBgDot';
        for (let aa = 0; aa < globalCommandDispatcher.cfg().data.filters.length; aa++) {
            let filter = globalCommandDispatcher.cfg().data.filters[aa];
            if (filter.automation[barIdx]) {
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
                            text: icon_gear,
                            css: 'samplerDrumDeleteIcon samplerDrumDeleteSize' + zIndex
                        };
                        barOctaveAnchor.content.push(editIcon);
                    }
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
        this.reFillSingleRatio(globalCommandDispatcher.cfg().samplerTop(), globalCommandDispatcher.cfg().samplerHeight(), this.barDrumCount);
        this.reFillSingleRatio(globalCommandDispatcher.cfg().gridTop(), globalCommandDispatcher.cfg().gridHeight(), this.barTrackCount);
        this.reFillSingleRatio(globalCommandDispatcher.cfg().automationTop(), globalCommandDispatcher.cfg().automationHeight(), this.barAutoCount);
        this.reFillSingleRatio(globalCommandDispatcher.cfg().commentsTop(), globalCommandDispatcher.cfg().commentsMaxHeight(), this.barCommentsCount);
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
        if (this.zoomLevelIndex < 6) {
            for (let oo = 0; oo < globalCommandDispatcher.cfg().drawOctaveCount(); oo++) {
                if (oo > 0) {
                    let octaveBottomBorder = {
                        x: globalCommandDispatcher.cfg().leftPad,
                        y: globalCommandDispatcher.cfg().gridTop() + oo * 12 * globalCommandDispatcher.cfg().notePathHeight,
                        w: globalCommandDispatcher.cfg().timelineWidth(),
                        h: zoomPrefixLevelsCSS[this.zoomLevelIndex].minZoom / 32.0,
                        css: 'octaveBottomBorder'
                    };
                    barOctaveAnchor.content.push(octaveBottomBorder);
                }
                if (this.zoomLevelIndex < globalCommandDispatcher.cfg().zoomEditSLess) {
                    for (let kk = 1; kk < 12; kk++) {
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
            showZoom: fanLevelAnchor.showZoom, hideZoom: fanLevelAnchor.hideZoom, content: [], translation: { x: 0, y: 0 }
        };
        fanLevelAnchor.content.push(dragAnchor);
        let dropAnchor = {
            xx: xx - sz / 2, yy: yy - sz / 2, ww: sz, hh: sz,
            showZoom: fanLevelAnchor.showZoom, hideZoom: fanLevelAnchor.hideZoom, content: [], translation: { x: 0, y: 0 }
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
                                    globalCommandDispatcher.renderer.tiler.updateAnchorTranslation(dragAnchor);
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
                    if (info) {
                        let url = info.ui;
                        globalCommandDispatcher.promptPluginPointDialog(track.title, url, track.performer.data, (obj) => {
                            globalCommandDispatcher.exe.commitProjectChanges(['tracks', trackNo, 'performer'], () => {
                                track.performer.data = obj;
                            });
                            return true;
                        }, LO(localDropInsTrack), () => {
                            globalCommandDispatcher.exe.commitProjectChanges(['tracks'], () => {
                                globalCommandDispatcher.cfg().data.tracks.splice(trackNo, 1);
                            });
                            globalCommandDispatcher.cancelPluginGUI();
                        }, (newTitle) => {
                            globalCommandDispatcher.exe.commitProjectChanges(['tracks', trackNo], () => {
                                track.title = newTitle;
                            });
                            globalCommandDispatcher.cancelPluginGUI();
                        });
                    }
                }
            };
            dragAnchor.content.push(btn);
        }
        if (zidx < globalCommandDispatcher.cfg().zoomEditSLess) {
            let txt = {
                text: track.title + ': ' + track.volume + ': ' + track.performer.kind + ': ' + track.performer.id,
                x: xx,
                y: yy,
                css: 'fanIconLabel'
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
            showZoom: fanLevelAnchor.showZoom, hideZoom: fanLevelAnchor.hideZoom, content: [], translation: { x: 0, y: 0 }
        };
        fanLevelAnchor.content.push(dragAnchor);
        let dropAnchor = {
            xx: xx - sz / 2, yy: yy - sz / 2, ww: sz, hh: sz,
            showZoom: fanLevelAnchor.showZoom, hideZoom: fanLevelAnchor.hideZoom, content: [], translation: { x: 0, y: 0 }
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
                                    globalCommandDispatcher.renderer.tiler.updateAnchorTranslation(dragAnchor);
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
                    console.log('' + samplerTrack.sampler.kind + ':' + samplerTrack.sampler.id);
                    let info = globalCommandDispatcher.findPluginRegistrationByKind(samplerTrack.sampler.kind);
                    if (info) {
                        let url = info.ui;
                        globalCommandDispatcher.promptPluginPointDialog(samplerTrack.title, url, samplerTrack.sampler.data, (obj) => {
                            globalCommandDispatcher.exe.commitProjectChanges(['percussions', order], () => {
                                samplerTrack.sampler.data = obj;
                            });
                            return true;
                        }, LO(localDropSampleTrack), () => {
                            globalCommandDispatcher.exe.commitProjectChanges(['percussions'], () => {
                                globalCommandDispatcher.cfg().data.percussions.splice(order, 1);
                            });
                            globalCommandDispatcher.cancelPluginGUI();
                        }, (newTitle) => {
                            globalCommandDispatcher.exe.commitProjectChanges(['percussions', order], () => {
                                samplerTrack.title = newTitle;
                            });
                            globalCommandDispatcher.cancelPluginGUI();
                        });
                    }
                }
            };
            dragAnchor.content.push(btn);
        }
        if (zidx < globalCommandDispatcher.cfg().zoomEditSLess) {
            let txt = {
                text: samplerTrack.title + ": " + samplerTrack.volume + ": " + samplerTrack.sampler.kind + ': ' + samplerTrack.sampler.id,
                x: xx,
                y: yy,
                css: 'fanIconLabel'
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
            showZoom: fanLevelAnchor.showZoom, hideZoom: fanLevelAnchor.hideZoom, content: [], translation: { x: 0, y: 0 }
        };
        fanLevelAnchor.content.push(dragAnchor);
        let dropAnchor = {
            xx: xx - sz / 2, yy: yy - sz / 2, ww: sz, hh: sz,
            showZoom: fanLevelAnchor.showZoom, hideZoom: fanLevelAnchor.hideZoom, content: [], translation: { x: 0, y: 0 }
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
                                    globalCommandDispatcher.renderer.tiler.updateAnchorTranslation(dragAnchor);
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
                    if (info) {
                        let url = info.ui;
                        globalCommandDispatcher.promptPluginPointDialog(filterTarget.title, url, filterTarget.data, (obj) => {
                            globalCommandDispatcher.exe.commitProjectChanges(['filters', order], () => {
                                filterTarget.data = obj;
                            });
                            return true;
                        }, LO(localDropFilterTrack), () => {
                            globalCommandDispatcher.exe.commitProjectChanges(['filters'], () => {
                                globalCommandDispatcher.cfg().data.filters.splice(order, 1);
                            });
                            globalCommandDispatcher.cancelPluginGUI();
                        }, (newTitle) => {
                            globalCommandDispatcher.exe.commitProjectChanges(['filters', order], () => {
                                filterTarget.title = newTitle;
                            });
                            globalCommandDispatcher.cancelPluginGUI();
                        });
                    }
                }
            };
            dragAnchor.content.push(btn);
        }
        if (zidx < globalCommandDispatcher.cfg().zoomEditSLess) {
            let txt = { text: filterTarget.kind + ':' + filterTarget.id, x: xx, y: yy, css: 'fanIconLabel' };
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
    cancel() {
        this.hideWarning();
        if (this.onCancel) {
            this.onCancel();
        }
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
        this.warningDescription = { x: 0, y: 0, text: 'Use mouse or touchpad to move and zoom piano roll', css: 'warningDescription' };
        this.warningGroup = document.getElementById("warningDialogGroup");
        this.warningRectangle = {
            x: 0, y: 0, w: 1, h: 1, css: 'warningBG', activation: () => {
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
        this.warningDescription.y = hh / 3 + 2.5;
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
    showWarning(title, msg, onCancel) {
        this.onCancel = onCancel;
        this.warningTitle.text = title;
        this.warningDescription.text = msg;
        globalCommandDispatcher.renderer.tiler.resetAnchor(this.warningGroup, this.warningAnchor, LevelModes.overlay);
        document.getElementById("warningDialogGroup").style.visibility = "visible";
    }
    hideWarning() {
        document.getElementById("warningDialogGroup").style.visibility = "hidden";
        this.onCancel = null;
    }
}
function saveText2localStorage(name, text) {
    localStorage.setItem(name, text);
}
function readTextFromlocalStorage(name) {
    try {
        let o = localStorage.getItem(name);
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
function readObjectFromlocalStorage(name) {
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
let _mzxbxProjectForTesting2 = {
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
            title: "Track one", volume: 1, measures: [
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
            title: "Second track", volume: 1, measures: [
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
            title: "Third track", volume: 1, measures: [
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
            title: "A track 1", volume: 1, measures: [
                { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }
            ],
            performer: { id: 'bt3', data: '29', kind: 'zinstr1', outputs: ['track3Volme'], iconPosition: { x: 88, y: 55 }, state: 0 }
        }, {
            title: "A track 987654321", volume: 1, measures: [
                { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] },
                { chords: [] }
            ],
            performer: { id: 'ct3', data: '44', kind: 'zinstr1', outputs: ['track3Volme'], iconPosition: { x: 77, y: 66 }, state: 0 }
        }
    ],
    percussions: [
        {
            title: "Snare", volume: 1, measures: [
                { skips: [] }, { skips: [{ count: 2, part: 16 }] }, { skips: [] }, { skips: [{ count: 0, part: 16 }] }
            ],
            sampler: { id: 'd1', data: '39', kind: 'zdrum1', outputs: ['drum1Volme'], iconPosition: { x: 22, y: 75 }, state: 0 }
        },
        {
            title: "Snare2", volume: 1, measures: [],
            sampler: { id: 'd2', data: '41', kind: 'zdrum1', outputs: ['drum2Volme'], iconPosition: { x: 22, y: 91 }, state: 0 }
        },
        {
            title: "Snare3", volume: 1, measures: [{ skips: [] }, { skips: [{ count: 1, part: 16 }] }],
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
        this.notePathHeight = 1.01;
        this.samplerDotHeight = 3;
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