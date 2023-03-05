"use strict";
class MZXBX_MetreMath {
    set(from) {
        this.count = from.count;
        this.part = from.part;
        return this;
    }
    metre() {
        return { count: this.count, part: this.part };
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
        return new MZXBX_MetreMath().set({ count: cc, part: pp });
    }
    strip(toPart) {
        let cc = this.count;
        let pp = this.part;
        let rr = pp / toPart;
        cc = Math.ceil(cc / rr);
        pp = toPart;
        return new MZXBX_MetreMath().set({ count: cc, part: pp });
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
        let rr = { count: countMe + countTo, part: metre.part * this.part };
        return new MZXBX_MetreMath().set(rr).simplyfy();
    }
    minus(metre) {
        let countMe = this.count * metre.part;
        let countTo = metre.count * this.part;
        let rr = { count: countMe - countTo, part: metre.part * this.part };
        return new MZXBX_MetreMath().set(rr).simplyfy();
    }
    duration(metre, tempo) {
        let wholeNoteSeconds = (4 * 60) / tempo;
        let meterSeconds = (wholeNoteSeconds * metre.count) / metre.part;
        return meterSeconds;
    }
}
class MZXBX_ScaleMath {
    set(scale) {
        this.basePitch = scale.basePitch;
        this.step2 = scale.step2;
        this.step3 = scale.step3;
        this.step4 = scale.step4;
        this.step5 = scale.step5;
        this.step6 = scale.step6;
        this.step7 = scale.step7;
        return this;
    }
    scale() {
        return {
            basePitch: this.basePitch,
            step2: this.step2,
            step3: this.step3,
            step4: this.step4,
            step5: this.step5,
            step6: this.step6,
            step7: this.step7
        };
    }
    pitch(note) {
        let pp = this.basePitch + 12 * note.octave;
        switch (note.step) {
            case 1: {
                break;
            }
            case 2: {
                pp = pp + this.step2;
                break;
            }
            case 3: {
                pp = pp + this.step2 + this.step3;
                break;
            }
            case 4: {
                pp = pp + this.step2 + this.step3 + this.step4;
                break;
            }
            case 5: {
                pp = pp + this.step2 + this.step3 + this.step4 + this.step5;
                break;
            }
            case 6: {
                pp = pp + this.step2 + this.step3 + this.step4 + this.step5 + this.step6;
                break;
            }
            case 7: {
                pp = pp + this.step2 + this.step3 + this.step4 + this.step5 + this.step6 + this.step7;
                break;
            }
        }
        pp = pp + note.shift;
        return 0;
    }
}
console.log("MuzXbox v1.0.2");
class MuzXbox {
    constructor() {
        this.uiStarted = false;
        this.initAfterLoad();
    }
    initAfterLoad() {
        console.log("MuzXbox loaded");
    }
    initFromUI() {
        if (this.uiStarted) {
            console.log("skip initFromUI");
        }
        else {
            console.log("start initFromUI");
            this.initAudioContext();
        }
    }
    initAudioContext() {
        let AudioContextFunc = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioContextFunc();
        console.log(this.audioContext);
        if (this.audioContext.state == "running") {
            this.uiStarted = true;
        }
        else {
            console.log('AudioContext state is ', this.audioContext.state);
        }
    }
    resumeContext(audioContext) {
        try {
            if (audioContext.state == 'suspended') {
                console.log('audioContext.resume', audioContext);
                audioContext.resume();
            }
        }
        catch (e) {
        }
    }
    startTest() {
        console.log('start test');
        if (this.player) {
        }
        else {
            this.player = new SchedulePlayer();
        }
        if (!this.setupDone) {
            let me = this;
            this.player.setup(this.audioContext, testSchedule, () => {
                me.setupDone = true;
                console.log('done setup');
            });
        }
        if (this.player.onAir) {
            this.player.onAir = false;
        }
        else {
            MZXBX_waitForCondition(500, () => this.setupDone, () => {
                console.log('loaded', this.player.filters, this.player.performers);
                let duration = 0;
                for (let ii = 0; ii < testSchedule.series.length; ii++) {
                    duration = duration + testSchedule.series[ii].duration;
                }
                this.player.start(0, 0, duration);
            });
        }
    }
}
function MZXBX_waitForCondition(sleepMs, isDone, onFinish) {
    if (isDone()) {
        onFinish();
    }
    else {
        setTimeout(() => {
            MZXBX_waitForCondition(sleepMs, isDone, onFinish);
        }, sleepMs);
    }
}
function MZXBX_appendScriptURL(url) {
    let scripts = document.getElementsByTagName("script");
    for (let ii = 0; ii < scripts.length; ii++) {
        let script = scripts.item(ii);
        if (script) {
            if (url == script.lockedLoaderURL) {
                return false;
            }
        }
    }
    var scriptElement = document.createElement('script');
    scriptElement.setAttribute("type", "text/javascript");
    scriptElement.setAttribute("src", url);
    scriptElement.lockedLoaderURL = url;
    let head = document.getElementsByTagName("head")[0];
    head.appendChild(scriptElement);
    return true;
}
class SchedulePlayer {
    constructor() {
        this.position = 0;
        this.schedule = null;
        this.performers = [];
        this.filters = [];
        this.pluginsList = [];
        this.nextAudioContextStart = 0;
        this.tickDuration = 0.35;
        this.onAir = false;
    }
    setup(context, schedule, onDone) {
        this.audioContext = context;
        this.schedule = schedule;
        if (this.schedule) {
            let pluginLoader = new PluginLoader();
            pluginLoader.collectLoadPlugins(this.schedule, this.filters, this.performers, onDone);
        }
    }
    resetCollectedPlugins() {
        for (let ff = 0; ff < this.filters.length; ff++) {
            let plugin = this.filters[ff].plugin;
            if (plugin) {
                console.log('reset', this.filters[ff].id, this.filters[ff].kind, this.filters[ff].properties);
                if (!plugin.reset(this.audioContext, this.filters[ff].properties)) {
                    console.log('filter ' + this.filters[ff].id + ' is not ready for reset');
                    return false;
                }
            }
            else {
                console.log('empty filter ', this.filters[ff]);
                return false;
            }
        }
        for (let pp = 0; pp < this.performers.length; pp++) {
            let plugin = this.performers[pp].plugin;
            if (plugin) {
                console.log('reset', this.performers[pp].id, this.performers[pp].kind, this.performers[pp].properties);
                if (!plugin.reset(this.audioContext, this.performers[pp].properties)) {
                    console.log('performer ' + this.performers[pp].id + ' is not ready for reset');
                    return false;
                }
            }
            else {
                console.log('empty performer ', this.performers[pp]);
                return false;
            }
        }
        return true;
    }
    start(loopStart, currentPosition, loopEnd) {
        console.log('start', loopStart, currentPosition, loopEnd);
        if (this.connect()) {
            this.nextAudioContextStart = this.audioContext.currentTime + this.tickDuration;
            this.position = currentPosition;
            this.onAir = true;
            this.tick(loopStart, loopEnd);
            return true;
        }
        else {
            return false;
        }
    }
    connect() {
        console.log('connect');
        if (this.resetCollectedPlugins()) {
            if (this.schedule) {
                let toNode = this.audioContext.destination;
                for (let ff = this.schedule.filters.length - 1; ff >= 0; ff--) {
                    let filter = this.schedule.filters[ff];
                    let plugin = this.findFilterPlugin(filter.id);
                    if (plugin) {
                        let output = plugin.output();
                        if (output) {
                            output.connect(toNode);
                            let input = plugin.input();
                            if (input) {
                                toNode = input;
                            }
                        }
                    }
                }
                for (let cc = 0; cc < this.schedule.channels.length; cc++) {
                    let channel = this.schedule.channels[cc];
                    let channelOutput = toNode;
                    for (let ff = channel.filters.length - 1; ff >= 0; ff--) {
                        let filter = channel.filters[ff];
                        let plugin = this.findFilterPlugin(filter.id);
                        if (plugin) {
                            let output = plugin.output();
                            if (output) {
                                output.connect(channelOutput);
                                let input = plugin.input();
                                if (input) {
                                    channelOutput = input;
                                }
                            }
                        }
                    }
                    let plugin = this.findPerformerPlugin(channel.id);
                    if (plugin) {
                        let output = plugin.output();
                        if (output) {
                            output.connect(channelOutput);
                        }
                    }
                }
            }
            return true;
        }
        else {
            return false;
        }
    }
    disconnect() {
        console.log('disconnect');
        if (this.schedule) {
            let toNode = this.audioContext.destination;
            for (let ff = this.schedule.filters.length - 1; ff >= 0; ff--) {
                let filter = this.schedule.filters[ff];
                let plugin = this.findFilterPlugin(filter.id);
                if (plugin) {
                    let output = plugin.output();
                    if (output) {
                        output.disconnect(toNode);
                        let input = plugin.input();
                        if (input) {
                            toNode = input;
                        }
                    }
                }
            }
            for (let cc = 0; cc < this.schedule.channels.length; cc++) {
                let channel = this.schedule.channels[cc];
                let channelOutput = toNode;
                for (let ff = channel.filters.length - 1; ff >= 0; ff--) {
                    let filter = channel.filters[ff];
                    let plugin = this.findFilterPlugin(filter.id);
                    if (plugin) {
                        let output = plugin.output();
                        if (output) {
                            output.disconnect(channelOutput);
                            let input = plugin.input();
                            if (input) {
                                channelOutput = input;
                            }
                        }
                    }
                }
                let plugin = this.findPerformerPlugin(channel.id);
                if (plugin) {
                    let output = plugin.output();
                    if (output) {
                        output.disconnect(channelOutput);
                    }
                }
            }
        }
    }
    tick(loopStart, loopEnd) {
        let sendFrom = this.position;
        let sendTo = this.position + this.tickDuration;
        if (this.audioContext.currentTime > this.nextAudioContextStart - this.tickDuration) {
            let atTime = this.nextAudioContextStart;
            if (sendTo > loopEnd) {
                this.sendPiece(sendFrom, loopEnd, atTime);
                atTime = atTime + (loopEnd - sendFrom);
                sendFrom = loopStart;
                sendTo = loopStart + (sendTo - loopEnd);
            }
            this.sendPiece(sendFrom, sendTo, atTime);
            this.position = sendTo;
            this.nextAudioContextStart = this.nextAudioContextStart + this.tickDuration;
            if (this.nextAudioContextStart < this.audioContext.currentTime) {
                this.nextAudioContextStart = this.audioContext.currentTime + this.tickDuration;
            }
        }
        let me = this;
        if (this.onAir) {
            window.requestAnimationFrame(function (time) {
                me.tick(loopStart, loopEnd);
            });
        }
        else {
            this.disconnect();
        }
    }
    findPerformerPlugin(channelId) {
        if (this.schedule) {
            for (let ii = 0; ii < this.schedule.channels.length; ii++) {
                if (this.schedule.channels[ii].id == channelId) {
                    let performerId = this.schedule.channels[ii].performer.id;
                    for (let nn = 0; nn < this.performers.length; nn++) {
                        let performer = this.performers[nn];
                        if (performerId == performer.id) {
                            if (performer.plugin) {
                                let plugin = performer.plugin;
                                return plugin;
                            }
                        }
                    }
                }
            }
        }
        return null;
    }
    sendPerformerItem(it, whenAudio) {
        let plugin = this.findPerformerPlugin(it.channelId);
        if (plugin) {
            plugin.schedule(whenAudio, it.volume, it.pitch, it.slides);
        }
    }
    findFilterPlugin(filterId) {
        if (this.schedule) {
            for (let nn = 0; nn < this.filters.length; nn++) {
                let filter = this.filters[nn];
                if (filter.id == filterId) {
                    if (filter.plugin) {
                        let plugin = filter.plugin;
                        if (plugin) {
                            return plugin;
                        }
                    }
                }
            }
        }
        return null;
    }
    sendFilterItem(state, whenAudio) {
        let plugin = this.findFilterPlugin(state.filterId);
        if (plugin) {
            plugin.schedule(whenAudio, state.data);
        }
    }
    sendPiece(fromPosition, toPosition, whenAudio) {
        if (this.schedule) {
            let serieStart = 0;
            for (let ii = 0; ii < this.schedule.series.length; ii++) {
                let cuSerie = this.schedule.series[ii];
                if (serieStart < toPosition && serieStart + cuSerie.duration >= fromPosition) {
                    for (let nn = 0; nn < cuSerie.items.length; nn++) {
                        let it = cuSerie.items[nn];
                        if (serieStart + it.skip >= fromPosition && serieStart + it.skip < toPosition) {
                            this.sendPerformerItem(it, whenAudio + serieStart + it.skip - fromPosition);
                        }
                    }
                    for (let nn = 0; nn < cuSerie.states.length; nn++) {
                        let state = cuSerie.states[nn];
                        if (serieStart + state.skip >= fromPosition && serieStart + state.skip < toPosition) {
                            this.sendFilterItem(state, whenAudio + serieStart + state.skip - fromPosition);
                        }
                    }
                }
                serieStart = serieStart + cuSerie.duration;
            }
        }
    }
    cancel() {
        this.onAir = false;
    }
}
class MusicTicker {
    startPlay() { }
    cancelPlay() { }
    setPosition(seconds) { }
    getPosition() {
        return 0;
    }
}
class PluginLoader {
    collectLoadPlugins(schedule, filters, performers, afterLoad) {
        for (let ff = 0; ff < schedule.filters.length; ff++) {
            let filter = schedule.filters[ff];
            this.сollectFilterPlugin(filter.id, filter.kind, filter.properties, filters);
        }
        for (let ch = 0; ch < schedule.channels.length; ch++) {
            let performer = schedule.channels[ch].performer;
            this.сollectPerformerPlugin(performer.id, performer.kind, performer.properties, performers);
            for (let ff = 0; ff < schedule.channels[ch].filters.length; ff++) {
                let filter = schedule.channels[ch].filters[ff];
                this.сollectFilterPlugin(filter.id, filter.kind, filter.properties, filters);
            }
        }
        this.startLoadCollectedPlugins(filters, performers, afterLoad);
    }
    startLoadCollectedPlugins(filters, performers, afterLoad) {
        for (let ff = 0; ff < filters.length; ff++) {
            if (!(filters[ff].plugin)) {
                this.startLoadPluginStarter(filters[ff].kind, filters, performers, (plugin) => {
                    filters[ff].plugin = plugin;
                }, afterLoad);
                return;
            }
        }
        for (let pp = 0; pp < performers.length; pp++) {
            if (!(performers[pp].plugin)) {
                this.startLoadPluginStarter(performers[pp].kind, filters, performers, (plugin) => {
                    performers[pp].plugin = plugin;
                }, afterLoad);
                return;
            }
        }
        afterLoad();
    }
    startLoadPluginStarter(kind, filters, performers, onDone, afterLoad) {
        let tt = this.findPluginInfo(kind);
        if (tt) {
            let info = tt;
            MZXBX_appendScriptURL(info.url);
            MZXBX_waitForCondition(250, () => { return (window[info.functionName]); }, () => {
                let exe = window[info.functionName];
                let plugin = exe();
                if (plugin) {
                    onDone(plugin);
                    this.startLoadCollectedPlugins(filters, performers, afterLoad);
                }
            });
        }
        else {
            console.log('Not found ', kind);
        }
    }
    сollectFilterPlugin(id, kind, properties, filters) {
        for (let ii = 0; ii < filters.length; ii++) {
            if (filters[ii].id == id) {
                return;
            }
        }
        filters.push({ plugin: null, id: id, kind: kind, properties: properties });
    }
    сollectPerformerPlugin(id, kind, properties, performers) {
        for (let ii = 0; ii < performers.length; ii++) {
            if (performers[ii].id == id) {
                return;
            }
        }
        performers.push({ plugin: null, id: id, kind: kind, properties: properties });
    }
    findPluginInfo(kind) {
        for (let ll = 0; ll < pluginListKindUrlName.length; ll++) {
            if (pluginListKindUrlName[ll].kind == kind) {
                return pluginListKindUrlName[ll];
            }
        }
        return null;
    }
}
//# sourceMappingURL=base.js.map