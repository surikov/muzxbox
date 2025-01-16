"use strict";
class MZXBX_ScaleMath {
}
console.log("MuzXbox v1.0.2");
class MuzXbox {
    constructor() {
        this.uiStarted = false;
        this.currentDuration = 0;
        this.songslide = null;
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
            this.songslide = document.getElementById('songslide');
            if (this.songslide) {
                let me = this;
                this.updateSongSlider();
                this.songslide.onchange = function (changeEvent) {
                    if (me.songslide) {
                        console.log('changeEvent', changeEvent, me.songslide.value);
                        me.updatePosition(parseFloat(me.songslide.value));
                    }
                };
            }
        }
    }
    updatePosition(pp) {
        if (this.player) {
            if (this.player.onAir) {
                this.player.position = (pp * this.currentDuration) / 100;
            }
        }
    }
    updateSongSlider() {
        let me = this;
        setTimeout(function () {
            me.setSongSlider();
            me.updateSongSlider();
        }, 999);
    }
    setSongSlider() {
        if (this.player) {
            if (this.player.onAir) {
                if (this.songslide) {
                    let newValue = Math.floor(100 * this.player.position / this.currentDuration);
                    this.songslide.value = '' + newValue;
                }
            }
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
}
function createSchedulePlayer() {
    return new SchedulePlayer();
}
class SchedulePlayer {
    constructor() {
        this.position = 0;
        this.schedule = null;
        this.performers = [];
        this.filters = [];
        this.pluginsList = [];
        this.nextAudioContextStart = 0;
        this.tickDuration = 0.25;
        this.onAir = false;
    }
    setupPlugins(context, schedule, onDone) {
        this.audioContext = context;
        this.schedule = schedule;
        if (this.schedule) {
            let pluginLoader = new PluginLoader();
            pluginLoader.collectLoadPlugins(this.schedule, this.filters, this.performers, onDone);
        }
    }
    allFilters() {
        return this.filters;
    }
    allPerformers() {
        return this.performers;
    }
    launchCollectedPlugins() {
        for (let ff = 0; ff < this.filters.length; ff++) {
            let plugin = this.filters[ff].plugin;
            if (plugin) {
                plugin.launch(this.audioContext, this.filters[ff].properties);
                this.filters[ff].launched = true;
            }
        }
        for (let pp = 0; pp < this.performers.length; pp++) {
            let plugin = this.performers[pp].plugin;
            if (plugin) {
                plugin.launch(this.audioContext, this.performers[pp].properties);
                this.performers[pp].launched = true;
            }
        }
        return null;
    }
    checkCollectedPlugins() {
        for (let ff = 0; ff < this.filters.length; ff++) {
            let plugin = this.filters[ff].plugin;
            if (plugin) {
                if (plugin.busy()) {
                    return 'filter ' + this.filters[ff].id + ' ' + plugin.busy();
                }
            }
            else {
                return 'empty plugin for filter ' + this.filters[ff].id;
            }
        }
        for (let pp = 0; pp < this.performers.length; pp++) {
            let plugin = this.performers[pp].plugin;
            if (plugin) {
                if (plugin.busy()) {
                    return 'performer ' + this.performers[pp].id + ' ' + plugin.busy();
                }
            }
            else {
                return 'empty performer ' + this.performers[pp];
            }
        }
        return null;
    }
    startLoop(loopStart, currentPosition, loopEnd) {
        let msg = this.connectAllPlugins();
        if (msg) {
            return msg;
        }
        else {
            this.nextAudioContextStart = this.audioContext.currentTime + this.tickDuration;
            this.position = currentPosition;
            this.onAir = true;
            this.tick(loopStart, loopEnd);
            return '';
        }
    }
    connectAllPlugins() {
        let msg = this.launchCollectedPlugins();
        if (msg) {
            return msg;
        }
        else {
            msg = this.checkCollectedPlugins();
            if (msg) {
                return msg;
            }
            else {
                if (this.schedule) {
                    let master = this.audioContext.destination;
                    for (let ff = this.schedule.filters.length - 1; ff >= 0; ff--) {
                        let filter = this.schedule.filters[ff];
                        let plugin = this.findFilterPlugin(filter.id);
                        if (plugin) {
                            let pluginOutput = plugin.output();
                            if (pluginOutput) {
                                for (let oo = 0; oo < filter.outputs.length; oo++) {
                                    let outId = filter.outputs[oo];
                                    let targetNode = master;
                                    if (outId) {
                                        let target = this.findFilterPlugin(outId);
                                        if (target) {
                                            targetNode = target.input();
                                            if (targetNode) {
                                                pluginOutput.connect(targetNode);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    for (let cc = 0; cc < this.schedule.channels.length; cc++) {
                        let channel = this.schedule.channels[cc];
                        let performer = this.findPerformerPlugin(channel.id);
                        if (performer) {
                            let output = performer.output();
                            if (output) {
                                for (let oo = 0; oo < channel.outputs.length; oo++) {
                                    let outId = channel.outputs[oo];
                                    let targetNode = master;
                                    if (outId) {
                                        let target = this.findFilterPlugin(outId);
                                        if (target) {
                                            targetNode = target.input();
                                            if (targetNode) {
                                                output.connect(targetNode);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                return null;
            }
        }
    }
    disconnectAllPlugins() {
        if (this.schedule) {
            let master = this.audioContext.destination;
            for (let ff = this.schedule.filters.length - 1; ff >= 0; ff--) {
                let filter = this.schedule.filters[ff];
                let plugin = this.findFilterPlugin(filter.id);
                if (plugin) {
                    let output = plugin.output();
                    if (output) {
                        for (let oo = 0; oo < filter.outputs.length; oo++) {
                            let outId = filter.outputs[oo];
                            let targetNode = master;
                            if (outId) {
                                let target = this.findFilterPlugin(outId);
                                if (target) {
                                    targetNode = target.input();
                                    if (targetNode) {
                                        output.disconnect(targetNode);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            for (let cc = 0; cc < this.schedule.channels.length; cc++) {
                let channel = this.schedule.channels[cc];
                let plugin = this.findPerformerPlugin(channel.id);
                if (plugin) {
                    let output = plugin.output();
                    if (output) {
                        try {
                            plugin.cancel();
                            for (let oo = 0; oo < channel.outputs.length; oo++) {
                                let outId = channel.outputs[oo];
                                let targetNode = master;
                                if (outId) {
                                    let target = this.findFilterPlugin(outId);
                                    if (target) {
                                        targetNode = target.input();
                                        if (targetNode) {
                                            output.disconnect(targetNode);
                                        }
                                    }
                                }
                            }
                        }
                        catch (ex) {
                        }
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
            this.disconnectAllPlugins();
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
                            else {
                                console.error('Empty performer plugin for', channelId);
                            }
                        }
                    }
                }
            }
            console.error('Empty schedule');
        }
        console.error('No performer for', channelId);
        return null;
    }
    sendPerformerItem(it, whenAudio, tempo) {
        let plugin = this.findPerformerPlugin(it.channelId);
        if (plugin) {
            plugin.schedule(whenAudio, it.pitches, tempo, it.slides);
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
    ms(nn) {
        return Math.round(nn * 1000);
    }
    sendPiece(fromPosition, toPosition, whenAudio) {
        if (this.schedule) {
            let serieStart = 0;
            for (let ii = 0; ii < this.schedule.series.length; ii++) {
                let cuSerie = this.schedule.series[ii];
                if (this.ms(serieStart) < this.ms(toPosition)
                    && this.ms(serieStart + cuSerie.duration) >= this.ms(fromPosition)) {
                    for (let nn = 0; nn < cuSerie.items.length; nn++) {
                        let it = cuSerie.items[nn];
                        if (this.ms(serieStart + it.skip) >= this.ms(fromPosition)
                            && this.ms(serieStart + it.skip) < this.ms(toPosition)) {
                            this.sendPerformerItem(it, whenAudio + serieStart + it.skip - fromPosition, cuSerie.tempo);
                        }
                    }
                    for (let nn = 0; nn < cuSerie.states.length; nn++) {
                        let state = cuSerie.states[nn];
                        if (this.ms(serieStart + state.skip) >= this.ms(fromPosition)
                            && this.ms(serieStart + state.skip) < this.ms(toPosition)) {
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
        }
        this.startLoadCollectedPlugins(filters, performers, afterLoad);
    }
    startLoadCollectedPlugins(filters, performers, afterLoad) {
        for (let ff = 0; ff < filters.length; ff++) {
            if (!(filters[ff].plugin)) {
                this.startLoadPluginStarter(filters[ff].kind, filters, performers, (plugin) => {
                    filters[ff].plugin = plugin;
                    console.log('assign filter', ff, plugin);
                }, afterLoad);
                return;
            }
        }
        for (let pp = 0; pp < performers.length; pp++) {
            if (!(performers[pp].plugin)) {
                this.startLoadPluginStarter(performers[pp].kind, filters, performers, (plugin) => {
                    performers[pp].plugin = plugin;
                    console.log('assign performer', pp, performers[pp]);
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
            MZXBX_appendScriptURL(info.script);
            MZXBX_waitForCondition(250, () => {
                return (window[info.evaluate]);
            }, () => {
                let exe = window[info.evaluate];
                let plugin = exe();
                if (plugin) {
                    onDone(plugin);
                    this.startLoadCollectedPlugins(filters, performers, afterLoad);
                }
            });
        }
        else {
            console.log('Not found registration for', kind);
        }
    }
    сollectFilterPlugin(id, kind, properties, filters) {
        for (let ii = 0; ii < filters.length; ii++) {
            if (filters[ii].id == id) {
                filters[ii].properties = properties;
                return;
            }
        }
        filters.push({ plugin: null, id: id, kind: kind, properties: properties, launched: false });
    }
    сollectPerformerPlugin(id, kind, properties, performers) {
        for (let ii = 0; ii < performers.length; ii++) {
            if (performers[ii].id == id) {
                performers[ii].properties = properties;
                return;
            }
        }
        performers.push({ plugin: null, id: id, kind: kind, properties: properties, launched: false });
    }
    findPluginInfo(kind) {
        for (let ll = 0; ll < MZXBX_currentPlugins().length; ll++) {
            if (MZXBX_currentPlugins()[ll].kind == kind) {
                return MZXBX_currentPlugins()[ll];
            }
        }
        return null;
    }
}
//# sourceMappingURL=mzxbx.js.map