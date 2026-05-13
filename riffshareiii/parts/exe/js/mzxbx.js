"use strict";
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
            if (this.player.isPlayLoop) {
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
            if (this.player.isPlayLoop) {
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
function createSchedulePlayer(callback) {
    return new SchedulePlayer(callback);
}
class SchedulePlayer {
    constructor(callback) {
        this.position = 0;
        this.schedule = null;
        this.performerDrumHolders = [];
        this.filterHolders = [];
        this.pluginsList = [];
        this.nextAudioContextStart = 0;
        this.tickDuration = 0.25;
        this.isPlayLoop = false;
        this.isConnected = false;
        this.isLoadingPlugins = false;
        this.playCallback = (start, position, end) => { };
        this.waitForID = -1;
        this.playCallback = callback;
    }
    startSetupPlugins(context, schedule) {
        if (!(this.isPlayLoop || this.isLoadingPlugins)) {
            this.isLoadingPlugins = true;
            this.audioContext = context;
            this.schedule = schedule;
            if (this.schedule) {
                let pluginLoader = new PluginLoader();
                let waitload = pluginLoader.collectLoadPlugins(this.schedule, this.filterHolders, this.performerDrumHolders);
                if (waitload) {
                    return waitload;
                }
                else {
                    this.isLoadingPlugins = false;
                    return null;
                }
            }
            else {
                return 'Empty schedule';
            }
        }
        else {
            return 'Already playing/loading';
        }
    }
    allFilters() {
        return this.filterHolders;
    }
    allPerformersSamplers() {
        return this.performerDrumHolders;
    }
    launchCollectedPlugins() {
        let trackName = '?';
        try {
            for (let ff = 0; ff < this.filterHolders.length; ff++) {
                let plugin = this.filterHolders[ff].pluginAudioFilter;
                if (plugin) {
                    plugin.launch(this.audioContext, this.filterHolders[ff].properties);
                }
            }
            for (let pp = 0; pp < this.performerDrumHolders.length; pp++) {
                trackName = this.performerDrumHolders[pp].description;
                let plugin = this.performerDrumHolders[pp].plugin;
                if (plugin) {
                    this.performerDrumHolders[pp].channel.hint = plugin.launch(this.audioContext, this.performerDrumHolders[pp].properties);
                }
            }
            return null;
        }
        catch (xx) {
            let ermsg = 'Can not launch [' + trackName + '] due';
            console.log(ermsg, xx);
            return ermsg + ' ' + xx;
        }
    }
    checkCollectedPlugins() {
        for (let ff = 0; ff < this.filterHolders.length; ff++) {
            let plugin = this.filterHolders[ff].pluginAudioFilter;
            if (plugin) {
                let busyState = plugin.busy();
                if (busyState) {
                    return busyState + ' [' + this.filterHolders[ff].filterId + ']';
                }
            }
            else {
                console.log('no plugin for filter', this.filterHolders[ff]);
                return 'plugin not found [' + this.filterHolders[ff].description + ']';
            }
        }
        for (let pp = 0; pp < this.performerDrumHolders.length; pp++) {
            let plugin = this.performerDrumHolders[pp].plugin;
            if (plugin) {
                let busyState = plugin.busy();
                if (busyState) {
                    return busyState + ' [' + this.performerDrumHolders[pp].description + ' ]';
                }
            }
            else {
                console.log('no plugin for performer/sampler', this.performerDrumHolders[pp]);
                return 'plugin not found [' + this.performerDrumHolders[pp].description + ']';
            }
        }
        return null;
    }
    reconnectAllPlugins(schedule) {
        this.disconnectAllPlugins();
        this.schedule = schedule;
        let msg = this.connectAllPlugins();
        console.log('reconnectAllPlugins', msg, schedule);
    }
    startLoopTicks(loopStart, currentPosition, loopEnd) {
        let msg = this.connectAllPlugins();
        if (msg) {
            return msg;
        }
        else {
            if (this.audioContext) {
                this.nextAudioContextStart = this.audioContext.currentTime + this.tickDuration;
                this.position = currentPosition;
                this.isPlayLoop = true;
                this.waitForID = Math.random();
                this.tick(loopStart, loopEnd, this.waitForID);
                return '';
            }
            else {
                this.cancel();
                return 'Empty audio context';
            }
        }
    }
    playState() {
        return {
            connected: this.isConnected,
            play: this.isPlayLoop,
            loading: this.isLoadingPlugins
        };
    }
    connectAllPlugins() {
        if (!this.isConnected) {
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
                                            }
                                        }
                                        if (targetNode) {
                                            pluginOutput.connect(targetNode);
                                        }
                                    }
                                }
                            }
                        }
                        for (let cc = 0; cc < this.schedule.channels.length; cc++) {
                            let channel = this.schedule.channels[cc];
                            let performer = this.findPerformerSamplerPlugin(channel);
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
                                            }
                                        }
                                        if (targetNode) {
                                            output.connect(targetNode);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    this.isConnected = true;
                    return null;
                }
            }
        }
        else {
            console.log('Connected aready');
            return null;
        }
    }
    disconnectAllPlugins() {
        console.log('disconnectAllPlugins');
        if (this.isConnected) {
            if (this.schedule) {
                let master = this.audioContext.destination;
                for (let ff = this.schedule.filters.length - 1; ff >= 0; ff--) {
                    let filter = this.schedule.filters[ff];
                    let plugin = this.findFilterPlugin(filter.id);
                    if (plugin) {
                        let output = plugin.output();
                        if (output) {
                            try {
                                for (let oo = 0; oo < filter.outputs.length; oo++) {
                                    let outId = filter.outputs[oo];
                                    let targetNode = master;
                                    if (outId) {
                                        let target = this.findFilterPlugin(outId);
                                        if (target) {
                                            targetNode = target.input();
                                        }
                                    }
                                    if (targetNode) {
                                        output.disconnect(targetNode);
                                    }
                                }
                            }
                            catch (ex) {
                                console.log(ex);
                            }
                        }
                    }
                }
                for (let cc = 0; cc < this.schedule.channels.length; cc++) {
                    let channel = this.schedule.channels[cc];
                    let plugin = this.findPerformerSamplerPlugin(channel);
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
                                        }
                                    }
                                    if (targetNode) {
                                        output.disconnect(targetNode);
                                    }
                                }
                            }
                            catch (ex) {
                                console.log(ex);
                            }
                        }
                    }
                }
                this.isConnected = false;
            }
            else {
                console.log('empty schedule');
            }
        }
        else {
            console.log('not connected');
        }
    }
    tick(loopStart, loopEnd, waitId) {
        if (this.audioContext) {
            if (waitId == this.waitForID) {
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
                    this.playCallback(loopStart, this.position, loopEnd);
                }
                let me = this;
                if (this.isPlayLoop) {
                    if (this.waitForID == waitId) {
                        this.waitForID = Math.random();
                        let id = this.waitForID;
                        window.requestAnimationFrame(function (time) {
                            me.tick(loopStart, loopEnd, id);
                        });
                        this.waitForID = id;
                    }
                    else {
                        console.log('cancel ticks due different id');
                    }
                }
                else {
                    console.log('cancel ticks due stop');
                }
            }
        }
    }
    findPerformerSamplerPlugin(channel) {
        if (this.schedule) {
            for (let ii = 0; ii < this.schedule.channels.length; ii++) {
                if (this.schedule.channels[ii].id == channel.id) {
                    for (let nn = 0; nn < this.performerDrumHolders.length; nn++) {
                        let performer = this.performerDrumHolders[nn];
                        if (channel.id == performer.channel.id) {
                            if (performer.plugin) {
                                let plugin = performer.plugin;
                                return plugin;
                            }
                            else {
                                console.error('Empty performer plugin for', channel.id);
                            }
                        }
                    }
                }
            }
            console.error('Empty schedule');
        }
        console.error('No performer for', channel.id);
        return null;
    }
    sendPerformerItem(it, whenAudio, tempo) {
        let pp = this.findPerformerSamplerPlugin(it.channel);
        if (pp) {
            if (pp.start) {
                let sampler = pp;
                sampler.start(whenAudio, tempo);
            }
            else {
                let performer = pp;
                performer.strum(whenAudio, it.pitches, tempo, it.slides);
            }
        }
    }
    findFilterPlugin(filterId) {
        if (this.schedule) {
            for (let nn = 0; nn < this.filterHolders.length; nn++) {
                let filter = this.filterHolders[nn];
                if (filter.filterId == filterId) {
                    if (filter.pluginAudioFilter) {
                        let plugin = filter.pluginAudioFilter;
                        if (plugin) {
                            return plugin;
                        }
                    }
                }
            }
        }
        console.log('not found filter', filterId);
        return null;
    }
    sendFilterItem(state, whenAudio, tempo) {
        let plugin = this.findFilterPlugin(state.filterId);
        if (plugin) {
            plugin.schedule(whenAudio, tempo, state.data);
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
                            this.sendFilterItem(state, whenAudio + serieStart + state.skip - fromPosition, cuSerie.tempo);
                        }
                    }
                }
                serieStart = serieStart + cuSerie.duration;
            }
        }
    }
    cancel() {
        if (this.isPlayLoop) {
            this.waitForID = -1;
            this.isPlayLoop = false;
            this.disconnectAllPlugins();
        }
        else {
        }
    }
}
class PluginLoader {
    collectLoadPlugins(schedule, allfilters, allperformers) {
        for (let ff = 0; ff < schedule.filters.length; ff++) {
            let filter = schedule.filters[ff];
            this.collectFilterPlugin(filter.id, filter.kind, filter.properties, filter.description, allfilters);
        }
        for (let ch = 0; ch < schedule.channels.length; ch++) {
            let performer = schedule.channels[ch].performer;
            this.collectPerformerPlugin(schedule.channels[ch], performer.kind, performer.properties, performer.description, allperformers);
        }
        let result = this.startLoadCollectedPlugins(allfilters, allperformers);
        return result;
    }
    startLoadCollectedPlugins(filters, performers) {
        for (let ff = 0; ff < filters.length; ff++) {
            if (!(filters[ff].pluginAudioFilter)) {
                let result = this.startLoadPluginStarter(filters[ff].kind, filters, performers, (plugin) => {
                    filters[ff].pluginAudioFilter = plugin;
                });
                if (result != null) {
                    return result;
                }
            }
        }
        for (let pp = 0; pp < performers.length; pp++) {
            if (!(performers[pp].plugin)) {
                let result = this.startLoadPluginStarter(performers[pp].kind, filters, performers, (plugin) => {
                    performers[pp].plugin = plugin;
                });
                if (result != null) {
                    return result;
                }
            }
        }
        return null;
    }
    startLoadPluginStarter(kind, filters, performers, onDone) {
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
                    this.startLoadCollectedPlugins(filters, performers);
                }
            });
            return null;
        }
        else {
            console.log('Not found registration for', kind);
            return 'Not found registration for ' + kind;
        }
    }
    collectFilterPlugin(id, kind, properties, description, filters) {
        for (let ii = 0; ii < filters.length; ii++) {
            if (filters[ii].filterId == id) {
                filters[ii].properties = properties;
                return;
            }
        }
        filters.push({ pluginAudioFilter: null, filterId: id, kind: kind, properties: properties, description: description });
    }
    collectPerformerPlugin(channel, kind, properties, description, performers) {
        for (let ii = 0; ii < performers.length; ii++) {
            if (performers[ii].channel.id == channel.id) {
                performers[ii].properties = properties;
                return;
            }
        }
        performers.push({
            plugin: null,
            channel: channel,
            kind: kind,
            properties: properties,
            description: description
        });
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