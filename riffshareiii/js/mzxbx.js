"use strict";
class MZXBX_MetreMath {
    set(from) {
        this.count = from.count;
        this.part = from.part;
        return this;
    }
    calculate(duration, tempo) {
        this.part = 1024.0;
        let tempPart = new MZXBX_MetreMath().set({ count: 1, part: this.part }).duration(tempo);
        this.count = Math.round(duration / tempPart);
        return this.simplyfy();
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
        cc = Math.round(cc / rr);
        pp = toPart;
        let r = new MZXBX_MetreMath().set({ count: cc, part: pp }).simplyfy();
        return r;
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
    duration(tempo) {
        let wholeNoteSeconds = (4 * 60) / tempo;
        let meterSeconds = (wholeNoteSeconds * this.count) / this.part;
        return meterSeconds;
    }
    width(tempo, ratio) {
        return this.duration(tempo) * ratio;
    }
}
function MZMM() {
    return new MZXBX_MetreMath();
}
class MZXBX_ScaleMath {
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
            let filesinput = document.getElementById('filesinput');
            if (filesinput) {
                let listener = function (ievent) {
                    var file = ievent.target.files[0];
                    var fileReader = new FileReader();
                    fileReader.onload = function (progressEvent) {
                        if (progressEvent != null) {
                            var arrayBuffer = progressEvent.target.result;
                            var midiParser = new MidiParser(arrayBuffer);
                        }
                    };
                    fileReader.readAsArrayBuffer(file);
                };
                filesinput.addEventListener('change', listener, false);
            }
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
function MZXBX_loadCachedBuffer(audioContext, path, onDone) {
    if (window['decodedArrayBuffer']) {
    }
    else {
        window['decodedArrayBuffer'] = [];
    }
    let waves = window['decodedArrayBuffer'];
    for (let ii = 0; ii < waves.length; ii++) {
        if (waves[ii].path == path) {
            if (waves[ii].buffer) {
                if (!(waves[ii].line100)) {
                    waves[ii].line100 = fillLinesOfBuffer(waves[ii].buffer);
                }
                onDone(waves[ii]);
            }
            else {
                if (waves[ii].canceled) {
                    console.log('cancel', waves[ii]);
                }
                else {
                    setTimeout(() => {
                    }, 999);
                }
            }
            return;
        }
    }
    let wave = {
        path: path, buffer: null
    };
    window['decodedArrayBuffer'].push(wave);
    let xhr = new XMLHttpRequest();
    xhr.responseType = 'arraybuffer';
    xhr.open("GET", path);
    let xonload = function () {
        audioContext.decodeAudioData(xhr.response, function (decodedData) {
            let waves = window['decodedArrayBuffer'];
            for (let ii = 0; ii < waves.length; ii++) {
                if (waves[ii].path == path) {
                    waves[ii].buffer = decodedData;
                    if (!(waves[ii].line100)) {
                        waves[ii].line100 = fillLinesOfBuffer(waves[ii].buffer);
                    }
                    onDone(waves[ii]);
                    return;
                }
            }
        }, function (err) {
            console.log(err);
            wave.canceled = true;
        });
    };
    xhr.onload = xonload;
    xhr.onerror = () => {
        wave.canceled = true;
        console.log('error', wave);
    };
    xhr.send();
}
function fillLinesOfBuffer(buffer) {
    let dots = [];
    if (buffer) {
        let data = buffer.getChannelData(0);
        let step = Math.round(data.length / 100);
        for (let ii = 0; ii < data.length; ii = ii + step) {
            let mx = 0;
            for (let kk = 0; kk < step; kk++) {
                if (Math.abs(data[ii + kk]) > mx)
                    mx = Math.abs(data[ii + kk]);
            }
            dots.push(mx);
        }
    }
    return dots;
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
        console.log('startLoop', loopStart, currentPosition, loopEnd);
        let msg = this.connect();
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
    connect() {
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
                    let masterOutput = this.audioContext.destination;
                    masterOutput.debug = 'destination';
                    for (let ff = this.schedule.filters.length - 1; ff >= 0; ff--) {
                        let filter = this.schedule.filters[ff];
                        let plugin = this.findFilterPlugin(filter.id);
                        if (plugin) {
                            let pluginOutput = plugin.output();
                            if (pluginOutput) {
                                pluginOutput.debug = filter.id;
                                pluginOutput.connect(masterOutput);
                                let pluginInput = plugin.input();
                                if (pluginInput) {
                                    masterOutput = pluginInput;
                                }
                            }
                        }
                    }
                    for (let cc = 0; cc < this.schedule.channels.length; cc++) {
                        let channel = this.schedule.channels[cc];
                        let channelOutput = masterOutput;
                        for (let ff = channel.filters.length - 1; ff >= 0; ff--) {
                            let filter = channel.filters[ff];
                            let plugin = this.findFilterPlugin(filter.id);
                            if (plugin) {
                                let output = plugin.output();
                                if (output) {
                                    output.debug = filter.id;
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
                                output.debug = channel.id;
                                output.connect(channelOutput);
                            }
                        }
                    }
                }
                return null;
            }
        }
    }
    disconnect() {
        if (this.schedule) {
            let toNode = this.audioContext.destination;
            for (let ff = this.schedule.filters.length - 1; ff >= 0; ff--) {
                let filter = this.schedule.filters[ff];
                let plugin = this.findFilterPlugin(filter.id);
                if (plugin) {
                    let output = plugin.output();
                    if (output) {
                        try {
                            output.disconnect(toNode);
                        }
                        catch (ex) {
                        }
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
                            try {
                                output.disconnect(channelOutput);
                            }
                            catch (ex) {
                            }
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
                        try {
                            plugin.cancel();
                            output.disconnect(channelOutput);
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
    sendPerformerItem(it, whenAudio) {
        let plugin = this.findPerformerPlugin(it.channelId);
        if (plugin) {
            plugin.schedule(whenAudio, it.pitch, it.slides);
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
                            this.sendPerformerItem(it, whenAudio + serieStart + it.skip - fromPosition);
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
        for (let ll = 0; ll < pluginListKindUrlName.length; ll++) {
            if (pluginListKindUrlName[ll].kind == kind) {
                return pluginListKindUrlName[ll];
            }
        }
        return null;
    }
}
let drumNames = [];
drumNames[35] = "Bass Drum 2";
drumNames[36] = "Bass Drum 1";
drumNames[37] = "Side Stick/Rimshot";
drumNames[38] = "Snare Drum 1";
drumNames[39] = "Hand Clap";
drumNames[40] = "Snare Drum 2";
drumNames[41] = "Low Tom 2";
drumNames[42] = "Closed Hi-hat";
drumNames[43] = "Low Tom 1";
drumNames[44] = "Pedal Hi-hat";
drumNames[45] = "Mid Tom 2";
drumNames[46] = "Open Hi-hat";
drumNames[47] = "Mid Tom 1";
drumNames[48] = "High Tom 2";
drumNames[49] = "Crash Cymbal 1";
drumNames[50] = "High Tom 1";
drumNames[51] = "Ride Cymbal 1";
drumNames[52] = "Chinese Cymbal";
drumNames[53] = "Ride Bell";
drumNames[54] = "Tambourine";
drumNames[55] = "Splash Cymbal";
drumNames[56] = "Cowbell";
drumNames[57] = "Crash Cymbal 2";
drumNames[58] = "Vibra Slap";
drumNames[59] = "Ride Cymbal 2";
drumNames[60] = "High Bongo";
drumNames[61] = "Low Bongo";
drumNames[62] = "Mute High Conga";
drumNames[63] = "Open High Conga";
drumNames[64] = "Low Conga";
drumNames[65] = "High Timbale";
drumNames[66] = "Low Timbale";
drumNames[67] = "High Agogo";
drumNames[68] = "Low Agogo";
drumNames[69] = "Cabasa";
drumNames[70] = "Maracas";
drumNames[71] = "Short Whistle";
drumNames[72] = "Long Whistle";
drumNames[73] = "Short Guiro";
drumNames[74] = "Long Guiro";
drumNames[75] = "Claves";
drumNames[76] = "High Wood Block";
drumNames[77] = "Low Wood Block";
drumNames[78] = "Mute Cuica";
drumNames[79] = "Open Cuica";
drumNames[80] = "Mute Triangle";
drumNames[81] = "Open Triangle";
let insNames = [];
insNames[0] = "Acoustic Grand Piano: Piano";
insNames[1] = "Bright Acoustic Piano: Piano";
insNames[2] = "Electric Grand Piano: Piano";
insNames[3] = "Honky-tonk Piano: Piano";
insNames[4] = "Electric Piano 1: Piano";
insNames[5] = "Electric Piano 2: Piano";
insNames[6] = "Harpsichord: Piano";
insNames[7] = "Clavinet: Piano";
insNames[8] = "Celesta: Chromatic Percussion";
insNames[9] = "Glockenspiel: Chromatic Percussion";
insNames[10] = "Music Box: Chromatic Percussion";
insNames[11] = "Vibraphone: Chromatic Percussion";
insNames[12] = "Marimba: Chromatic Percussion";
insNames[13] = "Xylophone: Chromatic Percussion";
insNames[14] = "Tubular Bells: Chromatic Percussion";
insNames[15] = "Dulcimer: Chromatic Percussion";
insNames[16] = "Drawbar Organ: Organ";
insNames[17] = "Percussive Organ: Organ";
insNames[18] = "Rock Organ: Organ";
insNames[19] = "Church Organ: Organ";
insNames[20] = "Reed Organ: Organ";
insNames[21] = "Accordion: Organ";
insNames[22] = "Harmonica: Organ";
insNames[23] = "Tango Accordion: Organ";
insNames[24] = "Acoustic Guitar (nylon): Guitar";
insNames[25] = "Acoustic Guitar (steel): Guitar";
insNames[26] = "Electric Guitar (jazz): Guitar";
insNames[27] = "Electric Guitar (clean): Guitar";
insNames[28] = "Electric Guitar (muted): Guitar";
insNames[29] = "Overdriven Guitar: Guitar";
insNames[30] = "Distortion Guitar: Guitar";
insNames[31] = "Guitar Harmonics: Guitar";
insNames[32] = "Acoustic Bass: Bass";
insNames[33] = "Electric Bass (finger): Bass";
insNames[34] = "Electric Bass (pick): Bass";
insNames[35] = "Fretless Bass: Bass";
insNames[36] = "Slap Bass 1: Bass";
insNames[37] = "Slap Bass 2: Bass";
insNames[38] = "Synth Bass 1: Bass";
insNames[39] = "Synth Bass 2: Bass";
insNames[40] = "Violin: Strings";
insNames[41] = "Viola: Strings";
insNames[42] = "Cello: Strings";
insNames[43] = "Contrabass: Strings";
insNames[44] = "Tremolo Strings: Strings";
insNames[45] = "Pizzicato Strings: Strings";
insNames[46] = "Orchestral Harp: Strings";
insNames[47] = "Timpani: Strings";
insNames[48] = "String Ensemble 1: Ensemble";
insNames[49] = "String Ensemble 2: Ensemble";
insNames[50] = "Synth Strings 1: Ensemble";
insNames[51] = "Synth Strings 2: Ensemble";
insNames[52] = "Choir Aahs: Ensemble";
insNames[53] = "Voice Oohs: Ensemble";
insNames[54] = "Synth Choir: Ensemble";
insNames[55] = "Orchestra Hit: Ensemble";
insNames[56] = "Trumpet: Brass";
insNames[57] = "Trombone: Brass";
insNames[58] = "Tuba: Brass";
insNames[59] = "Muted Trumpet: Brass";
insNames[60] = "French Horn: Brass";
insNames[61] = "Brass Section: Brass";
insNames[62] = "Synth Brass 1: Brass";
insNames[63] = "Synth Brass 2: Brass";
insNames[64] = "Soprano Sax: Reed";
insNames[65] = "Alto Sax: Reed";
insNames[66] = "Tenor Sax: Reed";
insNames[67] = "Baritone Sax: Reed";
insNames[68] = "Oboe: Reed";
insNames[69] = "English Horn: Reed";
insNames[70] = "Bassoon: Reed";
insNames[71] = "Clarinet: Reed";
insNames[72] = "Piccolo: Pipe";
insNames[73] = "Flute: Pipe";
insNames[74] = "Recorder: Pipe";
insNames[75] = "Pan Flute: Pipe";
insNames[76] = "Blown bottle: Pipe";
insNames[77] = "Shakuhachi: Pipe";
insNames[78] = "Whistle: Pipe";
insNames[79] = "Ocarina: Pipe";
insNames[80] = "Lead 1 (square): Synth Lead";
insNames[81] = "Lead 2 (sawtooth): Synth Lead";
insNames[82] = "Lead 3 (calliope): Synth Lead";
insNames[83] = "Lead 4 (chiff): Synth Lead";
insNames[84] = "Lead 5 (charang): Synth Lead";
insNames[85] = "Lead 6 (voice): Synth Lead";
insNames[86] = "Lead 7 (fifths): Synth Lead";
insNames[87] = "Lead 8 (bass + lead): Synth Lead";
insNames[88] = "Pad 1 (new age): Synth Pad";
insNames[89] = "Pad 2 (warm): Synth Pad";
insNames[90] = "Pad 3 (polysynth): Synth Pad";
insNames[91] = "Pad 4 (choir): Synth Pad";
insNames[92] = "Pad 5 (bowed): Synth Pad";
insNames[93] = "Pad 6 (metallic): Synth Pad";
insNames[94] = "Pad 7 (halo): Synth Pad";
insNames[95] = "Pad 8 (sweep): Synth Pad";
insNames[96] = "FX 1 (rain): Synth Effects";
insNames[97] = "FX 2 (soundtrack): Synth Effects";
insNames[98] = "FX 3 (crystal): Synth Effects";
insNames[99] = "FX 4 (atmosphere): Synth Effects";
insNames[100] = "FX 5 (brightness): Synth Effects";
insNames[101] = "FX 6 (goblins): Synth Effects";
insNames[102] = "FX 7 (echoes): Synth Effects";
insNames[103] = "FX 8 (sci-fi): Synth Effects";
insNames[104] = "Sitar: Ethnic";
insNames[105] = "Banjo: Ethnic";
insNames[106] = "Shamisen: Ethnic";
insNames[107] = "Koto: Ethnic";
insNames[108] = "Kalimba: Ethnic";
insNames[109] = "Bagpipe: Ethnic";
insNames[110] = "Fiddle: Ethnic";
insNames[111] = "Shanai: Ethnic";
insNames[112] = "Tinkle Bell: Percussive";
insNames[113] = "Agogo: Percussive";
insNames[114] = "Steel Drums: Percussive";
insNames[115] = "Woodblock: Percussive";
insNames[116] = "Taiko Drum: Percussive";
insNames[117] = "Melodic Tom: Percussive";
insNames[118] = "Synth Drum: Percussive";
insNames[119] = "Reverse Cymbal: Percussive";
insNames[120] = "Guitar Fret Noise: Sound effects";
insNames[121] = "Breath Noise: Sound effects";
insNames[122] = "Seashore: Sound effects";
insNames[123] = "Bird Tweet: Sound effects";
insNames[124] = "Telephone Ring: Sound effects";
insNames[125] = "Helicopter: Sound effects";
insNames[126] = "Applause: Sound effects";
insNames[127] = "Gunshot: Sound effects";
let instrumentNamesArray = [];
let drumNamesArray = [];
function findrumTitles(nn) {
    let name = drumTitles()[nn];
    if (name) {
        return '' + name;
    }
    else {
        return 'MIDI' + nn;
    }
}
function drumTitles() {
    if (drumNamesArray.length == 0) {
        var drumNames = [];
        drumNames[35] = "Bass Drum 2";
        drumNames[36] = "Bass Drum 1";
        drumNames[37] = "Side Stick/Rimshot";
        drumNames[38] = "Snare Drum 1";
        drumNames[39] = "Hand Clap";
        drumNames[40] = "Snare Drum 2";
        drumNames[41] = "Low Tom 2";
        drumNames[42] = "Closed Hi-hat";
        drumNames[43] = "Low Tom 1";
        drumNames[44] = "Pedal Hi-hat";
        drumNames[45] = "Mid Tom 2";
        drumNames[46] = "Open Hi-hat";
        drumNames[47] = "Mid Tom 1";
        drumNames[48] = "High Tom 2";
        drumNames[49] = "Crash Cymbal 1";
        drumNames[50] = "High Tom 1";
        drumNames[51] = "Ride Cymbal 1";
        drumNames[52] = "Chinese Cymbal";
        drumNames[53] = "Ride Bell";
        drumNames[54] = "Tambourine";
        drumNames[55] = "Splash Cymbal";
        drumNames[56] = "Cowbell";
        drumNames[57] = "Crash Cymbal 2";
        drumNames[58] = "Vibra Slap";
        drumNames[59] = "Ride Cymbal 2";
        drumNames[60] = "High Bongo";
        drumNames[61] = "Low Bongo";
        drumNames[62] = "Mute High Conga";
        drumNames[63] = "Open High Conga";
        drumNames[64] = "Low Conga";
        drumNames[65] = "High Timbale";
        drumNames[66] = "Low Timbale";
        drumNames[67] = "High Agogo";
        drumNames[68] = "Low Agogo";
        drumNames[69] = "Cabasa";
        drumNames[70] = "Maracas";
        drumNames[71] = "Short Whistle";
        drumNames[72] = "Long Whistle";
        drumNames[73] = "Short Guiro";
        drumNames[74] = "Long Guiro";
        drumNames[75] = "Claves";
        drumNames[76] = "High Wood Block";
        drumNames[77] = "Low Wood Block";
        drumNames[78] = "Mute Cuica";
        drumNames[79] = "Open Cuica";
        drumNames[80] = "Mute Triangle";
        drumNames[81] = "Open Triangle";
        drumNamesArray = drumNames;
    }
    return drumNamesArray;
}
;
function instrumentTitles() {
    if (instrumentNamesArray.length == 0) {
        var insNames = [];
        insNames[0] = "Acoustic Grand Piano: Piano";
        insNames[1] = "Bright Acoustic Piano: Piano";
        insNames[2] = "Electric Grand Piano: Piano";
        insNames[3] = "Honky-tonk Piano: Piano";
        insNames[4] = "Electric Piano 1: Piano";
        insNames[5] = "Electric Piano 2: Piano";
        insNames[6] = "Harpsichord: Piano";
        insNames[7] = "Clavinet: Piano";
        insNames[8] = "Celesta: Chromatic Percussion";
        insNames[9] = "Glockenspiel: Chromatic Percussion";
        insNames[10] = "Music Box: Chromatic Percussion";
        insNames[11] = "Vibraphone: Chromatic Percussion";
        insNames[12] = "Marimba: Chromatic Percussion";
        insNames[13] = "Xylophone: Chromatic Percussion";
        insNames[14] = "Tubular Bells: Chromatic Percussion";
        insNames[15] = "Dulcimer: Chromatic Percussion";
        insNames[16] = "Drawbar Organ: Organ";
        insNames[17] = "Percussive Organ: Organ";
        insNames[18] = "Rock Organ: Organ";
        insNames[19] = "Church Organ: Organ";
        insNames[20] = "Reed Organ: Organ";
        insNames[21] = "Accordion: Organ";
        insNames[22] = "Harmonica: Organ";
        insNames[23] = "Tango Accordion: Organ";
        insNames[24] = "Acoustic Guitar (nylon): Guitar";
        insNames[25] = "Acoustic Guitar (steel): Guitar";
        insNames[26] = "Electric Guitar (jazz): Guitar";
        insNames[27] = "Electric Guitar (clean): Guitar";
        insNames[28] = "Electric Guitar (muted): Guitar";
        insNames[29] = "Overdriven Guitar: Guitar";
        insNames[30] = "Distortion Guitar: Guitar";
        insNames[31] = "Guitar Harmonics: Guitar";
        insNames[32] = "Acoustic Bass: Bass";
        insNames[33] = "Electric Bass (finger): Bass";
        insNames[34] = "Electric Bass (pick): Bass";
        insNames[35] = "Fretless Bass: Bass";
        insNames[36] = "Slap Bass 1: Bass";
        insNames[37] = "Slap Bass 2: Bass";
        insNames[38] = "Synth Bass 1: Bass";
        insNames[39] = "Synth Bass 2: Bass";
        insNames[40] = "Violin: Strings";
        insNames[41] = "Viola: Strings";
        insNames[42] = "Cello: Strings";
        insNames[43] = "Contrabass: Strings";
        insNames[44] = "Tremolo Strings: Strings";
        insNames[45] = "Pizzicato Strings: Strings";
        insNames[46] = "Orchestral Harp: Strings";
        insNames[47] = "Timpani: Strings";
        insNames[48] = "String Ensemble 1: Ensemble";
        insNames[49] = "String Ensemble 2: Ensemble";
        insNames[50] = "Synth Strings 1: Ensemble";
        insNames[51] = "Synth Strings 2: Ensemble";
        insNames[52] = "Choir Aahs: Ensemble";
        insNames[53] = "Voice Oohs: Ensemble";
        insNames[54] = "Synth Choir: Ensemble";
        insNames[55] = "Orchestra Hit: Ensemble";
        insNames[56] = "Trumpet: Brass";
        insNames[57] = "Trombone: Brass";
        insNames[58] = "Tuba: Brass";
        insNames[59] = "Muted Trumpet: Brass";
        insNames[60] = "French Horn: Brass";
        insNames[61] = "Brass Section: Brass";
        insNames[62] = "Synth Brass 1: Brass";
        insNames[63] = "Synth Brass 2: Brass";
        insNames[64] = "Soprano Sax: Reed";
        insNames[65] = "Alto Sax: Reed";
        insNames[66] = "Tenor Sax: Reed";
        insNames[67] = "Baritone Sax: Reed";
        insNames[68] = "Oboe: Reed";
        insNames[69] = "English Horn: Reed";
        insNames[70] = "Bassoon: Reed";
        insNames[71] = "Clarinet: Reed";
        insNames[72] = "Piccolo: Pipe";
        insNames[73] = "Flute: Pipe";
        insNames[74] = "Recorder: Pipe";
        insNames[75] = "Pan Flute: Pipe";
        insNames[76] = "Blown bottle: Pipe";
        insNames[77] = "Shakuhachi: Pipe";
        insNames[78] = "Whistle: Pipe";
        insNames[79] = "Ocarina: Pipe";
        insNames[80] = "Lead 1 (square): Synth Lead";
        insNames[81] = "Lead 2 (sawtooth): Synth Lead";
        insNames[82] = "Lead 3 (calliope): Synth Lead";
        insNames[83] = "Lead 4 (chiff): Synth Lead";
        insNames[84] = "Lead 5 (charang): Synth Lead";
        insNames[85] = "Lead 6 (voice): Synth Lead";
        insNames[86] = "Lead 7 (fifths): Synth Lead";
        insNames[87] = "Lead 8 (bass + lead): Synth Lead";
        insNames[88] = "Pad 1 (new age): Synth Pad";
        insNames[89] = "Pad 2 (warm): Synth Pad";
        insNames[90] = "Pad 3 (polysynth): Synth Pad";
        insNames[91] = "Pad 4 (choir): Synth Pad";
        insNames[92] = "Pad 5 (bowed): Synth Pad";
        insNames[93] = "Pad 6 (metallic): Synth Pad";
        insNames[94] = "Pad 7 (halo): Synth Pad";
        insNames[95] = "Pad 8 (sweep): Synth Pad";
        insNames[96] = "FX 1 (rain): Synth Effects";
        insNames[97] = "FX 2 (soundtrack): Synth Effects";
        insNames[98] = "FX 3 (crystal): Synth Effects";
        insNames[99] = "FX 4 (atmosphere): Synth Effects";
        insNames[100] = "FX 5 (brightness): Synth Effects";
        insNames[101] = "FX 6 (goblins): Synth Effects";
        insNames[102] = "FX 7 (echoes): Synth Effects";
        insNames[103] = "FX 8 (sci-fi): Synth Effects";
        insNames[104] = "Sitar: Ethnic";
        insNames[105] = "Banjo: Ethnic";
        insNames[106] = "Shamisen: Ethnic";
        insNames[107] = "Koto: Ethnic";
        insNames[108] = "Kalimba: Ethnic";
        insNames[109] = "Bagpipe: Ethnic";
        insNames[110] = "Fiddle: Ethnic";
        insNames[111] = "Shanai: Ethnic";
        insNames[112] = "Tinkle Bell: Percussive";
        insNames[113] = "Agogo: Percussive";
        insNames[114] = "Steel Drums: Percussive";
        insNames[115] = "Woodblock: Percussive";
        insNames[116] = "Taiko Drum: Percussive";
        insNames[117] = "Melodic Tom: Percussive";
        insNames[118] = "Synth Drum: Percussive";
        insNames[119] = "Reverse Cymbal: Percussive";
        insNames[120] = "Guitar Fret Noise: Sound effects";
        insNames[121] = "Breath Noise: Sound effects";
        insNames[122] = "Seashore: Sound effects";
        insNames[123] = "Bird Tweet: Sound effects";
        insNames[124] = "Telephone Ring: Sound effects";
        insNames[125] = "Helicopter: Sound effects";
        insNames[126] = "Applause: Sound effects";
        insNames[127] = "Gunshot: Sound effects";
        instrumentNamesArray = insNames;
    }
    return instrumentNamesArray;
}
;
class DataViewStream {
    constructor(dv) {
        this.position = 0;
        this.buffer = dv;
    }
    readUint8() {
        var n = this.buffer.getUint8(this.position);
        this.position++;
        return n;
    }
    readUint16() {
        var v = this.buffer.getUint16(this.position);
        this.position = this.position + 2;
        return v;
    }
    readVarInt() {
        var v = 0;
        var i = 0;
        var b;
        while (i < 4) {
            b = this.readUint8();
            if (b & 0x80) {
                v = v + (b & 0x7f);
                v = v << 7;
            }
            else {
                return v + b;
            }
            i++;
        }
        throw new Error('readVarInt ' + i);
    }
    readBytes(length) {
        var bytes = [];
        for (var i = 0; i < length; i++) {
            bytes.push(this.readUint8());
        }
        return bytes;
    }
    offset() {
        return this.buffer.byteOffset + this.position;
    }
    end() {
        return this.position == this.buffer.byteLength;
    }
}
class MIDIFileHeader {
    constructor(buffer) {
        this.HEADER_LENGTH = 14;
        this.tempoBPM = 120;
        this.changes = [];
        this.meters = [];
        this.lyrics = [];
        this.signs = [];
        this.meterCount = 4;
        this.meterDivision = 4;
        this.keyFlatSharp = 0;
        this.keyMajMin = 0;
        this.lastNonZeroQuarter = 0;
        this.datas = new DataView(buffer, 0, this.HEADER_LENGTH);
        this.format = this.datas.getUint16(8);
        this.trackCount = this.datas.getUint16(10);
    }
    getCalculatedTickResolution(tempo) {
        this.lastNonZeroQuarter = tempo;
        if (this.datas.getUint16(12) & 0x8000) {
            var r = 1000000 / (this.getSMPTEFrames() * this.getTicksPerFrame());
            return r;
        }
        else {
            tempo = tempo || 500000;
            var r = tempo / this.getTicksPerBeat();
            return r;
        }
    }
    get0TickResolution() {
        var tempo = 0;
        if (this.lastNonZeroQuarter) {
            tempo = this.lastNonZeroQuarter;
        }
        else {
            tempo = 60000000 / this.tempoBPM;
        }
        if (this.datas.getUint16(12) & 0x8000) {
            var r = 1000000 / (this.getSMPTEFrames() * this.getTicksPerFrame());
            return r;
        }
        else {
            tempo = tempo || 500000;
            var r = tempo / this.getTicksPerBeat();
            return r;
        }
    }
    getTicksPerBeat() {
        var divisionWord = this.datas.getUint16(12);
        return divisionWord;
    }
    getTicksPerFrame() {
        const divisionWord = this.datas.getUint16(12);
        return divisionWord & 0x00ff;
    }
    getSMPTEFrames() {
        const divisionWord = this.datas.getUint16(12);
        let smpteFrames;
        smpteFrames = divisionWord & 0x7f00;
        if (smpteFrames == 29) {
            return 29.97;
        }
        else {
            return smpteFrames;
        }
    }
}
class LastKeyVal {
    constructor() {
        this.data = [];
    }
    take(keyName) {
        for (let ii = 0; ii < this.data.length; ii++) {
            if (this.data[ii].name == keyName) {
                return this.data[ii];
            }
        }
        let newit = { name: keyName, value: -1 };
        this.data.push(newit);
        return newit;
    }
}
class MIDIFileTrack {
    constructor(buffer, start) {
        this.HDR_LENGTH = 8;
        this.chords = [];
        this.datas = new DataView(buffer, start, this.HDR_LENGTH);
        this.trackLength = this.datas.getUint32(4);
        this.datas = new DataView(buffer, start, this.HDR_LENGTH + this.trackLength);
        this.trackContent = new DataView(this.datas.buffer, this.datas.byteOffset + this.HDR_LENGTH, this.datas.byteLength - this.HDR_LENGTH);
        this.trackevents = [];
        this.trackVolumePoints = [];
        this.programChannel = [];
    }
}
function utf8ArrayToString(aBytes) {
    var sView = "";
    for (var nPart, nLen = aBytes.length, nIdx = 0; nIdx < nLen; nIdx++) {
        nPart = aBytes[nIdx];
        sView = sView + String.fromCharCode(nPart > 251 && nPart < 254 && nIdx + 5 < nLen ?
            (nPart - 252) * 1073741824 + (aBytes[++nIdx] - 128 << 24) + (aBytes[++nIdx] - 128 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
            : nPart > 247 && nPart < 252 && nIdx + 4 < nLen ?
                (nPart - 248 << 24) + (aBytes[++nIdx] - 128 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
                : nPart > 239 && nPart < 248 && nIdx + 3 < nLen ?
                    (nPart - 240 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
                    : nPart > 223 && nPart < 240 && nIdx + 2 < nLen ?
                        (nPart - 224 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
                        : nPart > 191 && nPart < 224 && nIdx + 1 < nLen ?
                            (nPart - 192 << 6) + aBytes[++nIdx] - 128
                            :
                                nPart);
    }
    return sView;
}
class MidiParser {
    constructor(arrayBuffer) {
        this.instrumentNamesArray = [];
        this.drumNamesArray = [];
        this.EVENT_META = 0xff;
        this.EVENT_SYSEX = 0xf0;
        this.EVENT_DIVSYSEX = 0xf7;
        this.EVENT_MIDI = 0x8;
        this.EVENT_META_SEQUENCE_NUMBER = 0x00;
        this.EVENT_META_TEXT = 0x01;
        this.EVENT_META_COPYRIGHT_NOTICE = 0x02;
        this.EVENT_META_TRACK_NAME = 0x03;
        this.EVENT_META_INSTRUMENT_NAME = 0x04;
        this.EVENT_META_LYRICS = 0x05;
        this.EVENT_META_MARKER = 0x06;
        this.EVENT_META_CUE_POINT = 0x07;
        this.EVENT_META_MIDI_CHANNEL_PREFIX = 0x20;
        this.EVENT_META_END_OF_TRACK = 0x2f;
        this.EVENT_META_SET_TEMPO = 0x51;
        this.EVENT_META_SMTPE_OFFSET = 0x54;
        this.EVENT_META_TIME_SIGNATURE = 0x58;
        this.EVENT_META_KEY_SIGNATURE = 0x59;
        this.EVENT_META_SEQUENCER_SPECIFIC = 0x7f;
        this.EVENT_MIDI_NOTE_OFF = 0x8;
        this.EVENT_MIDI_NOTE_ON = 0x9;
        this.EVENT_MIDI_NOTE_AFTERTOUCH = 0xa;
        this.EVENT_MIDI_CONTROLLER = 0xb;
        this.EVENT_MIDI_PROGRAM_CHANGE = 0xc;
        this.EVENT_MIDI_CHANNEL_AFTERTOUCH = 0xd;
        this.EVENT_MIDI_PITCH_BEND = 0xe;
        this.midiEventType = 0;
        this.midiEventChannel = 0;
        this.midiEventParam1 = 0;
        this.controller_BankSelectMSB = 0x00;
        this.controller_ModulationWheel = 0x01;
        this.controller_coarseDataEntrySlider = 0x06;
        this.controller_coarseVolume = 0x07;
        this.controller_ballance = 0x08;
        this.controller_pan = 0x0A;
        this.controller_expression = 0x0B;
        this.controller_BankSelectLSBGS = 0x20;
        this.controller_fineDataEntrySlider = 0x26;
        this.controller_ReverbLevel = 0x5B;
        this.controller_HoldPedal1 = 0x40;
        this.controller_TremoloDepth = 0x5C;
        this.controller_ChorusLevel = 0x5D;
        this.controller_NRPNParameterLSB = 0x62;
        this.controller_NRPNParameterMSB = 0x63;
        this.controller_fineRPN = 0x64;
        this.controller_coarseRPN = 0x65;
        this.controller_ResetAllControllers = 0x79;
        this.header = new MIDIFileHeader(arrayBuffer);
        this.parseTracks(arrayBuffer);
    }
    parseTracks(arrayBuffer) {
        var curIndex = this.header.HEADER_LENGTH;
        var trackCount = this.header.trackCount;
        this.parsedTracks = [];
        for (var i = 0; i < trackCount; i++) {
            var track = new MIDIFileTrack(arrayBuffer, curIndex);
            this.parsedTracks.push(track);
            curIndex = curIndex + track.trackLength + 8;
        }
        for (var i = 0; i < this.parsedTracks.length; i++) {
            this.parseTrackEvents(this.parsedTracks[i]);
        }
        this.parseNotes();
        this.simplifyAllPaths();
    }
    toText(arr) {
        let txt = '';
        try {
            let win1251decoder = new TextDecoder("windows-1251");
            let bytes = new Uint8Array(arr);
            txt = win1251decoder.decode(bytes);
        }
        catch (xx) {
            console.log(xx);
            var rr = '';
            for (var ii = 0; ii < arr.length; ii++) {
                rr = rr + String.fromCharCode(arr[ii]);
            }
            txt = rr;
        }
        txt = txt.replace("\\n", " ");
        txt = txt.replace("\\r", " ");
        txt = txt.replace("\\t", " ");
        txt = txt.replace("\n", " ");
        txt = txt.replace("\r", " ");
        txt = txt.replace("\t", " ");
        txt = txt.replace("\\", " ");
        txt = txt.replace("/", " ");
        txt = txt.replace("  ", " ");
        txt = txt.replace("  ", " ");
        txt = txt.replace("  ", " ");
        txt = txt.replace("  ", " ");
        txt = txt.replace("  ", " ");
        txt = txt.replace("  ", " ");
        txt = txt.replace("  ", " ");
        txt = txt.replace("  ", " ");
        txt = txt.replace("  ", " ");
        return txt;
    }
    findChordBefore(when, track, channel) {
        for (var i = 0; i < track.chords.length; i++) {
            var chord = track.chords[track.chords.length - i - 1];
            if (chord.when < when && chord.channel == channel) {
                return chord;
            }
        }
        return null;
    }
    findOpenedNoteBefore(firstPitch, when, track, channel) {
        var before = when;
        var chord = this.findChordBefore(before, track, channel);
        while (chord) {
            for (var i = 0; i < chord.notes.length; i++) {
                var note = chord.notes[i];
                if (!(note.closed)) {
                    if (firstPitch == note.basePitch) {
                        return { chord: chord, note: note };
                    }
                }
            }
            before = chord.when;
            chord = this.findChordBefore(before, track, channel);
        }
        return null;
    }
    takeChord(when, track, channel) {
        for (var i = 0; i < track.chords.length; i++) {
            if (track.chords[i].when == when && track.chords[i].channel == channel) {
                return track.chords[i];
            }
        }
        var ch = {
            when: when,
            channel: channel,
            notes: []
        };
        track.chords.push(ch);
        return ch;
    }
    takeOpenedNote(first, when, track, channel) {
        var chord = this.takeChord(when, track, channel);
        for (var i = 0; i < chord.notes.length; i++) {
            if (!(chord.notes[i].closed)) {
                if (chord.notes[i].basePitch == first) {
                    return chord.notes[i];
                }
            }
        }
        var pi = { closed: false, bendPoints: [], basePitch: first, baseDuration: -1 };
        chord.notes.push(pi);
        return pi;
    }
    distanceToPoint(line, point) {
        var m = (line.p2.y - line.p1.y) / (line.p2.x - line.p1.x);
        var b = line.p1.y - (m * line.p1.x);
        var d = [];
        d.push(Math.abs(point.y - (m * point.x) - b) / Math.sqrt(Math.pow(m, 2) + 1));
        d.push(Math.sqrt(Math.pow((point.x - line.p1.x), 2) + Math.pow((point.y - line.p1.y), 2)));
        d.push(Math.sqrt(Math.pow((point.x - line.p2.x), 2) + Math.pow((point.y - line.p2.y), 2)));
        d.sort(function (a, b) {
            return (a - b);
        });
        return d[0];
    }
    ;
    douglasPeucker(points, tolerance) {
        if (points.length <= 2) {
            return [points[0]];
        }
        var returnPoints = [];
        var line = { p1: points[0], p2: points[points.length - 1] };
        var maxDistance = 0;
        var maxDistanceIndex = 0;
        var p;
        for (var i = 1; i <= points.length - 2; i++) {
            var distance = this.distanceToPoint(line, points[i]);
            if (distance > maxDistance) {
                maxDistance = distance;
                maxDistanceIndex = i;
            }
        }
        if (maxDistance >= tolerance) {
            p = points[maxDistanceIndex];
            this.distanceToPoint(line, p);
            returnPoints = returnPoints.concat(this.douglasPeucker(points.slice(0, maxDistanceIndex + 1), tolerance));
            returnPoints = returnPoints.concat(this.douglasPeucker(points.slice(maxDistanceIndex, points.length), tolerance));
        }
        else {
            p = points[maxDistanceIndex];
            this.distanceToPoint(line, p);
            returnPoints = [points[0]];
        }
        return returnPoints;
    }
    ;
    simplifySinglePath(points, tolerance) {
        var arr = this.douglasPeucker(points, tolerance);
        arr.push(points[points.length - 1]);
        return arr;
    }
    simplifyAllPaths() {
        for (var t = 0; t < this.parsedTracks.length; t++) {
            var track = this.parsedTracks[t];
            for (var ch = 0; ch < track.chords.length; ch++) {
                var chord = track.chords[ch];
                for (var n = 0; n < chord.notes.length; n++) {
                    var note = chord.notes[n];
                    if (note.bendPoints.length > 1) {
                    }
                    if (note.bendPoints.length > 5) {
                        let tolerance = 0.3;
                        if (note.bendPoints.length > 30) {
                            tolerance = 0.5;
                        }
                        if (note.bendPoints.length > 50) {
                            tolerance = 1;
                        }
                        var xx = 0;
                        var pnts = [];
                        for (var p = 0; p < note.bendPoints.length; p++) {
                            note.bendPoints[p].pointDuration = Math.max(note.bendPoints[p].pointDuration, 0);
                            pnts.push({ x: xx, y: note.bendPoints[p].basePitchDelta });
                            xx = xx + note.bendPoints[p].pointDuration;
                        }
                        pnts.push({ x: xx, y: note.bendPoints[note.bendPoints.length - 1].basePitchDelta });
                        var lessPoints = this.simplifySinglePath(pnts, tolerance);
                        note.bendPoints = [];
                        for (var p = 0; p < lessPoints.length - 1; p++) {
                            var xypoint = lessPoints[p];
                            var xyduration = lessPoints[p + 1].x - xypoint.x;
                            if (xyduration < 0) {
                                xyduration = 0;
                            }
                            note.bendPoints.push({ pointDuration: xyduration, basePitchDelta: xypoint.y });
                        }
                    }
                    else {
                        if (note.bendPoints.length == 1) {
                            if (note.bendPoints[0].pointDuration > 4321) {
                                note.bendPoints[0].pointDuration = 1234;
                            }
                        }
                    }
                }
            }
        }
    }
    dumpResolutionChanges() {
        this.header.changes = [];
        let tickResolution = this.header.get0TickResolution();
        this.header.changes.push({ track: -1, ms: -1, resolution: tickResolution, bpm: 120 });
        for (var t = 0; t < this.parsedTracks.length; t++) {
            var track = this.parsedTracks[t];
            let playTimeTicks = 0;
            for (var e = 0; e < track.trackevents.length; e++) {
                var evnt = track.trackevents[e];
                let curDelta = 0.0;
                if (evnt.delta)
                    curDelta = evnt.delta;
                playTimeTicks = playTimeTicks + curDelta * tickResolution / 1000.0;
                if (evnt.basetype === this.EVENT_META) {
                    if (evnt.subtype === this.EVENT_META_SET_TEMPO) {
                        if (evnt.tempo) {
                            tickResolution = this.header.getCalculatedTickResolution(evnt.tempo);
                            this.header.changes.push({ track: t, ms: playTimeTicks, resolution: tickResolution, bpm: (evnt.tempoBPM) ? evnt.tempoBPM : 120 });
                        }
                    }
                }
            }
        }
        this.header.changes.sort((a, b) => { return a.ms - b.ms; });
    }
    lastResolution(ms) {
        for (var i = this.header.changes.length - 1; i >= 0; i--) {
            if (this.header.changes[i].ms <= ms) {
                return this.header.changes[i].resolution;
            }
        }
        return 0;
    }
    parseTicks2time(track) {
        let tickResolution = this.lastResolution(0);
        let playTimeTicks = 0;
        for (let e = 0; e < track.trackevents.length; e++) {
            let evnt = track.trackevents[e];
            let curDelta = 0.0;
            if (evnt.delta)
                curDelta = evnt.delta;
            let searchPlayTimeTicks = playTimeTicks + curDelta * tickResolution / 1000.0;
            tickResolution = this.lastResolution(searchPlayTimeTicks);
            evnt.preTimeMs = playTimeTicks;
            playTimeTicks = playTimeTicks + curDelta * tickResolution / 1000.0;
            evnt.playTimeMs = playTimeTicks;
            evnt.deltaTimeMs = curDelta * tickResolution / 1000.0;
        }
    }
    parseNotes() {
        this.dumpResolutionChanges();
        var expectedPitchBendRangeMessageNumber = 1;
        var expectedPitchBendRangeChannel = null;
        var pitchBendRange = Array(16).fill(2);
        for (let t = 0; t < this.parsedTracks.length; t++) {
            var singleParsedTrack = this.parsedTracks[t];
            this.parseTicks2time(singleParsedTrack);
            for (var e = 0; e < singleParsedTrack.trackevents.length; e++) {
                var expectedPitchBendRangeMessageNumberOld = expectedPitchBendRangeMessageNumber;
                var evnt = singleParsedTrack.trackevents[e];
                if (evnt.basetype == this.EVENT_MIDI) {
                    evnt.param1 = evnt.param1 ? evnt.param1 : 0;
                    if (evnt.subtype == this.EVENT_MIDI_NOTE_ON) {
                        if (evnt.param1 >= 0 && evnt.param1 <= 127) {
                            var pitch = evnt.param1 ? evnt.param1 : 0;
                            var when = 0;
                            if (evnt.playTimeMs)
                                when = evnt.playTimeMs;
                            let trno = this.takeOpenedNote(pitch, when, singleParsedTrack, evnt.midiChannel ? evnt.midiChannel : 0);
                            trno.volume = evnt.param2;
                            trno.openEvent = evnt;
                        }
                    }
                    else {
                        if (evnt.subtype == this.EVENT_MIDI_NOTE_OFF) {
                            if (evnt.param1 >= 0 && evnt.param1 <= 127) {
                                var pitch = evnt.param1 ? evnt.param1 : 0;
                                var when = 0;
                                if (evnt.playTimeMs)
                                    when = evnt.playTimeMs;
                                var chpi = this.findOpenedNoteBefore(pitch, when, singleParsedTrack, evnt.midiChannel ? evnt.midiChannel : 0);
                                if (chpi) {
                                    chpi.note.baseDuration = when - chpi.chord.when;
                                    chpi.note.closed = true;
                                    chpi.note.closeEvent = evnt;
                                }
                            }
                        }
                        else {
                            if (evnt.subtype == this.EVENT_MIDI_PROGRAM_CHANGE) {
                                if (evnt.param1 >= 0 && evnt.param1 <= 127) {
                                    singleParsedTrack.programChannel.push({
                                        program: evnt.param1 ? evnt.param1 : 0,
                                        channel: evnt.midiChannel ? evnt.midiChannel : 0
                                    });
                                }
                            }
                            else {
                                if (evnt.subtype == this.EVENT_MIDI_PITCH_BEND) {
                                    var eventWhen = evnt.playTimeMs ? evnt.playTimeMs : 0;
                                    var chord = this.findChordBefore(eventWhen, singleParsedTrack, evnt.midiChannel ? evnt.midiChannel : 0);
                                    if (chord) {
                                        for (var i = 0; i < chord.notes.length; i++) {
                                            var note = chord.notes[i];
                                            if (!(note.closed)) {
                                                var allPointsDuration = 0;
                                                for (var k = 0; k < note.bendPoints.length; k++) {
                                                    allPointsDuration = allPointsDuration + note.bendPoints[k].pointDuration;
                                                }
                                                let idx = evnt.midiChannel ? evnt.midiChannel : 0;
                                                let pp2 = evnt.param2 ? evnt.param2 : 0;
                                                var delta = (pp2 - 64) / 64 * pitchBendRange[idx];
                                                var point = {
                                                    pointDuration: eventWhen - chord.when - allPointsDuration,
                                                    basePitchDelta: delta
                                                };
                                                note.bendPoints.push(point);
                                            }
                                        }
                                    }
                                }
                                else {
                                    if (evnt.subtype == this.EVENT_MIDI_CONTROLLER) {
                                        if (evnt.param1 == this.controller_coarseVolume) {
                                            var v = evnt.param2 ? evnt.param2 / 127 : 0;
                                            let point = { ms: evnt.playTimeMs, value: v, channel: evnt.midiChannel ? evnt.midiChannel : 0, track: t };
                                            singleParsedTrack.trackVolumePoints.push(point);
                                        }
                                        else {
                                            if ((expectedPitchBendRangeMessageNumber == 1 && evnt.param1 == this.controller_coarseRPN && evnt.param2 == 0x00) ||
                                                (expectedPitchBendRangeMessageNumber == 2 && evnt.param1 == this.controller_fineRPN && evnt.param2 == 0x00) ||
                                                (expectedPitchBendRangeMessageNumber == 3 && evnt.param1 == this.controller_coarseDataEntrySlider) ||
                                                (expectedPitchBendRangeMessageNumber == 4 && evnt.param1 == this.controller_fineDataEntrySlider)) {
                                                if (expectedPitchBendRangeMessageNumber > 1 && evnt.midiChannel != expectedPitchBendRangeChannel) {
                                                    console.log('Unexpected channel number in non-first pitch-bend RANGE (SENSITIVITY) message. MIDI file might be corrupt.');
                                                }
                                                expectedPitchBendRangeChannel = evnt.midiChannel;
                                                let idx = evnt.midiChannel ? evnt.midiChannel : 0;
                                                if (expectedPitchBendRangeMessageNumber == 3) {
                                                    pitchBendRange[idx] = evnt.param2;
                                                }
                                                if (expectedPitchBendRangeMessageNumber == 4) {
                                                    let pp = evnt.param2 ? evnt.param2 : 0;
                                                    pitchBendRange[idx] = pitchBendRange[idx] + pp / 100;
                                                }
                                                expectedPitchBendRangeMessageNumber++;
                                                if (expectedPitchBendRangeMessageNumber == 5) {
                                                    expectedPitchBendRangeMessageNumber = 1;
                                                }
                                            }
                                            else {
                                                if (evnt.param1 == this.controller_BankSelectMSB
                                                    || evnt.param1 == this.controller_ModulationWheel
                                                    || evnt.param1 == this.controller_ReverbLevel
                                                    || evnt.param1 == this.controller_TremoloDepth
                                                    || evnt.param1 == this.controller_ChorusLevel
                                                    || evnt.param1 == this.controller_NRPNParameterLSB
                                                    || evnt.param1 == this.controller_NRPNParameterMSB
                                                    || evnt.param1 == this.controller_fineRPN
                                                    || evnt.param1 == this.controller_coarseRPN
                                                    || evnt.param1 == this.controller_coarseDataEntrySlider
                                                    || evnt.param1 == this.controller_ballance
                                                    || evnt.param1 == this.controller_pan
                                                    || evnt.param1 == this.controller_expression
                                                    || evnt.param1 == this.controller_BankSelectLSBGS
                                                    || evnt.param1 == this.controller_HoldPedal1
                                                    || evnt.param1 == this.controller_ResetAllControllers
                                                    || (evnt.param1 >= 32 && evnt.param1 <= 63)
                                                    || (evnt.param1 >= 70 && evnt.param1 <= 79)) {
                                                }
                                                else {
                                                    console.log('unknown controller', evnt.playTimeMs, 'ms, channel', evnt.midiChannel, ':', evnt.param1, evnt.param2);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                else {
                    if (evnt.subtype == this.EVENT_META_TEXT) {
                        this.header.lyrics.push({ track: t, ms: evnt.playTimeMs ? evnt.playTimeMs : 0, txt: (evnt.text ? evnt.text : "") });
                    }
                    if (evnt.subtype == this.EVENT_META_COPYRIGHT_NOTICE) {
                        this.header.lyrics.push({ track: t, ms: evnt.playTimeMs ? evnt.playTimeMs : 0, txt: 'Copyright: ' + (evnt.text ? evnt.text : "") });
                    }
                    if (evnt.subtype == this.EVENT_META_TRACK_NAME) {
                        singleParsedTrack.trackTitle = evnt.text ? evnt.text : '';
                    }
                    if (evnt.subtype == this.EVENT_META_INSTRUMENT_NAME) {
                        singleParsedTrack.instrumentName = evnt.text ? evnt.text : '';
                    }
                    if (evnt.subtype == this.EVENT_META_LYRICS) {
                        this.header.lyrics.push({ track: t, ms: evnt.playTimeMs ? evnt.playTimeMs : 0, txt: (evnt.text ? evnt.text : "") });
                    }
                    if (evnt.subtype == this.EVENT_META_CUE_POINT) {
                        this.header.lyrics.push({ track: t, ms: evnt.playTimeMs ? evnt.playTimeMs : 0, txt: 'CUE: ' + (evnt.text ? evnt.text : "") });
                    }
                    if (evnt.subtype == this.EVENT_META_KEY_SIGNATURE) {
                        var majSharpCircleOfFifths = ['C', 'G', 'D', 'A', 'E', 'B', 'F#'];
                        var majFlatCircleOfFifths = ['C', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb'];
                        var minSharpCircleOfFifths = ['Am', 'Em', 'Bm', 'F#m', 'C#m', 'G#m', 'D#'];
                        var minFlatCircleOfFifths = ['Am', 'Dm', 'Gm', 'Cm', 'Fm', 'Bbm', 'Ebm'];
                        var key = evnt.key ? evnt.key : 0;
                        if (key > 127)
                            key = key - 256;
                        this.header.keyFlatSharp = key;
                        this.header.keyMajMin = evnt.scale ? evnt.scale : 0;
                        var signature = 'C';
                        if (this.header.keyFlatSharp >= 0) {
                            if (this.header.keyMajMin < 1) {
                                signature = majSharpCircleOfFifths[Math.abs(this.header.keyFlatSharp)];
                            }
                            else {
                                signature = minSharpCircleOfFifths[Math.abs(this.header.keyFlatSharp)];
                            }
                        }
                        else {
                            if (this.header.keyMajMin < 1) {
                                signature = majFlatCircleOfFifths[Math.abs(this.header.keyFlatSharp)];
                            }
                            else {
                                signature = minFlatCircleOfFifths[Math.abs(this.header.keyFlatSharp)];
                            }
                        }
                        this.header.signs.push({ track: t, ms: evnt.playTimeMs ? evnt.playTimeMs : 0, sign: signature });
                    }
                    if (evnt.subtype == this.EVENT_META_SET_TEMPO) {
                        this.header.tempoBPM = evnt.tempoBPM ? evnt.tempoBPM : 120;
                    }
                    if (evnt.subtype == this.EVENT_META_TIME_SIGNATURE) {
                        this.header.meterCount = evnt.param1 ? evnt.param1 : 4;
                        var dvsn = evnt.param2 ? evnt.param2 : 2;
                        if (dvsn == 1)
                            this.header.meterDivision = 2;
                        else if (dvsn == 2)
                            this.header.meterDivision = 4;
                        else if (dvsn == 3)
                            this.header.meterDivision = 8;
                        else if (dvsn == 4)
                            this.header.meterDivision = 16;
                        else if (dvsn == 5)
                            this.header.meterDivision = 32;
                        else if (dvsn == 0)
                            this.header.meterDivision = 1;
                        this.header.meters.push({
                            track: t, ms: evnt.playTimeMs ? evnt.playTimeMs : 0,
                            count: this.header.meterCount, division: this.header.meterDivision
                        });
                    }
                }
                if (expectedPitchBendRangeMessageNumberOld == expectedPitchBendRangeMessageNumber) {
                    if (expectedPitchBendRangeMessageNumberOld >= 2 && expectedPitchBendRangeMessageNumberOld <= 3) {
                    }
                    if (expectedPitchBendRangeMessageNumberOld == 4) {
                        expectedPitchBendRangeMessageNumber = 1;
                    }
                }
            }
        }
    }
    nextEvent(stream) {
        var index = stream.offset();
        var delta = stream.readVarInt();
        var eventTypeByte = stream.readUint8();
        var event = { offset: index, delta: delta, eventTypeByte: eventTypeByte, playTimeMs: 0 };
        if (0xf0 === (eventTypeByte & 0xf0)) {
            if (eventTypeByte === this.EVENT_META) {
                event.basetype = this.EVENT_META;
                event.subtype = stream.readUint8();
                event.length = stream.readVarInt();
                switch (event.subtype) {
                    case this.EVENT_META_SEQUENCE_NUMBER:
                        event.msb = stream.readUint8();
                        event.lsb = stream.readUint8();
                        console.log('EVENT_META_SEQUENCE_NUMBER', event);
                        return event;
                    case this.EVENT_META_TEXT:
                    case this.EVENT_META_COPYRIGHT_NOTICE:
                    case this.EVENT_META_TRACK_NAME:
                    case this.EVENT_META_INSTRUMENT_NAME:
                    case this.EVENT_META_LYRICS:
                    case this.EVENT_META_MARKER:
                    case this.EVENT_META_CUE_POINT:
                        event.data = stream.readBytes(event.length);
                        event.text = this.toText(event.data ? event.data : []);
                        return event;
                    case this.EVENT_META_MIDI_CHANNEL_PREFIX:
                        event.prefix = stream.readUint8();
                        return event;
                    case this.EVENT_META_END_OF_TRACK:
                        return event;
                    case this.EVENT_META_SET_TEMPO:
                        event.tempo = (stream.readUint8() << 16) + (stream.readUint8() << 8) + stream.readUint8();
                        event.tempoBPM = 60000000 / event.tempo;
                        return event;
                    case this.EVENT_META_SMTPE_OFFSET:
                        event.hour = stream.readUint8();
                        event.minutes = stream.readUint8();
                        event.seconds = stream.readUint8();
                        event.frames = stream.readUint8();
                        event.subframes = stream.readUint8();
                        return event;
                    case this.EVENT_META_KEY_SIGNATURE:
                        event.key = stream.readUint8();
                        event.scale = stream.readUint8();
                        return event;
                    case this.EVENT_META_TIME_SIGNATURE:
                        event.data = stream.readBytes(event.length);
                        event.param1 = event.data[0];
                        event.param2 = event.data[1];
                        event.param3 = event.data[2];
                        event.param4 = event.data[3];
                        return event;
                    case this.EVENT_META_SEQUENCER_SPECIFIC:
                        event.data = stream.readBytes(event.length);
                        return event;
                    default:
                        event.data = stream.readBytes(event.length);
                        return event;
                }
            }
            else {
                if (eventTypeByte === this.EVENT_SYSEX || eventTypeByte === this.EVENT_DIVSYSEX) {
                    event.basetype = eventTypeByte;
                    event.length = stream.readVarInt();
                    event.data = stream.readBytes(event.length);
                    return event;
                }
                else {
                    event.basetype = eventTypeByte;
                    event.badsubtype = stream.readVarInt();
                    event.length = stream.readUint8();
                    event.data = stream.readBytes(event.length);
                    return event;
                }
            }
        }
        else {
            if (0 === (eventTypeByte & 0x80)) {
                if (!this.midiEventType) {
                    throw new Error('no pre event' + stream.offset());
                }
                this.midiEventParam1 = eventTypeByte;
            }
            else {
                this.midiEventType = eventTypeByte >> 4;
                this.midiEventChannel = eventTypeByte & 0x0f;
                this.midiEventParam1 = stream.readUint8();
            }
            event.basetype = this.EVENT_MIDI;
            event.subtype = this.midiEventType;
            event.midiChannel = this.midiEventChannel;
            event.param1 = this.midiEventParam1;
            switch (this.midiEventType) {
                case this.EVENT_MIDI_NOTE_OFF:
                    event.param2 = stream.readUint8();
                    return event;
                case this.EVENT_MIDI_NOTE_ON:
                    event.param2 = stream.readUint8();
                    if (!event.param2) {
                        event.subtype = this.EVENT_MIDI_NOTE_OFF;
                        event.param2 = -1;
                    }
                    return event;
                case this.EVENT_MIDI_NOTE_AFTERTOUCH:
                    event.param2 = stream.readUint8();
                    return event;
                case this.EVENT_MIDI_CONTROLLER:
                    event.param2 = stream.readUint8();
                    if (event.param1 == 7) {
                    }
                    return event;
                case this.EVENT_MIDI_PROGRAM_CHANGE:
                    return event;
                case this.EVENT_MIDI_CHANNEL_AFTERTOUCH:
                    return event;
                case this.EVENT_MIDI_PITCH_BEND:
                    event.param2 = stream.readUint8();
                    return event;
                default:
                    console.log('unknown note', event);
                    return event;
            }
        }
    }
    parseTrackEvents(track) {
        var stream = new DataViewStream(track.trackContent);
        this.midiEventType = 0;
        this.midiEventChannel = 0;
        this.midiEventParam1 = 0;
        while (!stream.end()) {
            var e = this.nextEvent(stream);
            track.trackevents.push(e);
        }
    }
    findOrCreateTrack(parsedtrack, trackNum, channelNum, trackChannel) {
        for (let i = 0; i < trackChannel.length; i++) {
            if (trackChannel[i].trackNum == trackNum && trackChannel[i].channelNum == channelNum) {
                return trackChannel[i];
            }
        }
        let it = {
            trackNum: trackNum, channelNum: channelNum, track: {
                order: 0,
                title: parsedtrack.trackTitle + ((parsedtrack.instrumentName) ? (' - ' + parsedtrack.instrumentName) : ''),
                channelNum: channelNum,
                trackVolumes: [],
                program: -1,
                songchords: []
            }
        };
        for (let vv = 0; vv < parsedtrack.trackVolumePoints.length; vv++) {
            if (parsedtrack.trackVolumePoints[vv].channel == it.track.channelNum) {
                it.track.trackVolumes.push(parsedtrack.trackVolumePoints[vv]);
            }
        }
        trackChannel.push(it);
        return it;
    }
    findLastMeter(midiSongData, beforeMs, barIdx) {
        let metre = {
            count: midiSongData.meter.count,
            part: midiSongData.meter.division
        };
        let midimeter = { track: 0, ms: 0, count: 4, division: 4 };
        for (let mi = 0; mi < midiSongData.meters.length; mi++) {
            if (midiSongData.meters[mi].ms > beforeMs + 1 + barIdx * 3) {
                break;
            }
            midimeter = midiSongData.meters[mi];
        }
        metre.count = midimeter.count;
        metre.part = midimeter.division;
        return metre;
    }
    findLastChange(midiSongData, beforeMs) {
        let nextChange = { track: 0, ms: 0, resolution: 0, bpm: 120 };
        for (let ii = 1; ii < midiSongData.changes.length; ii++) {
            if (midiSongData.changes[ii].ms > beforeMs + 1) {
                break;
            }
            nextChange = midiSongData.changes[ii];
        }
        return nextChange;
    }
    findNextChange(midiSongData, afterMs) {
        let nextChange = { track: 0, ms: 0, resolution: 0, bpm: 120 };
        for (let ii = 1; ii < midiSongData.changes.length; ii++) {
            if (midiSongData.changes[ii].ms > afterMs) {
                nextChange = midiSongData.changes[ii];
                break;
            }
        }
        return nextChange;
    }
    calcMeasureDuration(midiSongData, meter, bpm, part, startMs) {
        let metreMath = new MZXBX_MetreMath();
        let wholeDurationMs = 1000 * metreMath.set(meter).duration(bpm);
        let partDurationMs = part * wholeDurationMs;
        let nextChange = this.findNextChange(midiSongData, startMs);
        if (startMs < nextChange.ms && nextChange.ms < startMs + partDurationMs) {
            let diffMs = nextChange.ms - startMs;
            let ratio = diffMs / partDurationMs;
            let newPart = ratio * part;
            let newPartDurationMs = newPart * wholeDurationMs;
            let remainsMs = this.calcMeasureDuration(midiSongData, meter, nextChange.bpm, part - newPart, nextChange.ms);
            return newPartDurationMs + remainsMs;
        }
        else {
            return partDurationMs;
        }
    }
    createMeasure(midiSongData, fromMs, barIdx) {
        let change = this.findLastChange(midiSongData, fromMs);
        let meter = this.findLastMeter(midiSongData, fromMs, barIdx);
        let duration = this.calcMeasureDuration(midiSongData, meter, change.bpm, 1, fromMs);
        let measure = {
            tempo: change.bpm,
            metre: meter,
            startMs: fromMs,
            durationMs: duration
        };
        return measure;
    }
    createTimeLine(midiSongData) {
        let count = 0;
        let part = 0;
        let bpm = 0;
        let timeline = [];
        let fromMs = 0;
        while (fromMs < midiSongData.duration) {
            let measure = this.createMeasure(midiSongData, fromMs, timeline.length);
            fromMs = fromMs + measure.durationMs;
            if (count != measure.metre.count || part != measure.metre.part || bpm != measure.tempo) {
                count = measure.metre.count;
                part = measure.metre.part;
                bpm = measure.tempo;
            }
            else {
            }
            timeline.push(measure);
        }
        return timeline;
    }
    convertProject(title, comment) {
        console.log('MidiParser.convertProject', this);
        let midiSongData = {
            parser: '1.12',
            duration: 0,
            bpm: this.header.tempoBPM,
            changes: this.header.changes,
            lyrics: this.header.lyrics,
            key: this.header.keyFlatSharp,
            mode: this.header.keyMajMin,
            meter: { count: this.header.meterCount, division: this.header.meterDivision },
            meters: this.header.meters,
            signs: this.header.signs,
            miditracks: [],
            speedMode: 0,
            lineMode: 0
        };
        let tracksChannels = [];
        for (let i = 0; i < this.parsedTracks.length; i++) {
            let parsedtrack = this.parsedTracks[i];
            for (let k = 0; k < parsedtrack.programChannel.length; k++) {
                this.findOrCreateTrack(parsedtrack, i, parsedtrack.programChannel[k].channel, tracksChannels);
            }
        }
        var maxWhen = 0;
        for (var i = 0; i < this.parsedTracks.length; i++) {
            var miditrack = this.parsedTracks[i];
            for (var ch = 0; ch < miditrack.chords.length; ch++) {
                var midichord = miditrack.chords[ch];
                var newchord = { when: midichord.when, notes: [], channel: midichord.channel };
                if (maxWhen < midichord.when) {
                    maxWhen = midichord.when;
                }
                for (var n = 0; n < midichord.notes.length; n++) {
                    var midinote = midichord.notes[n];
                    var newnote = { slidePoints: [], midiPitch: midinote.basePitch, midiDuration: midinote.baseDuration };
                    newchord.notes.push(newnote);
                    if (midinote.bendPoints.length > 0) {
                        for (var v = 0; v < midinote.bendPoints.length; v++) {
                            var midipoint = midinote.bendPoints[v];
                            var newpoint = {
                                pitch: midinote.basePitch + midipoint.basePitchDelta,
                                durationms: midipoint.pointDuration
                            };
                            newpoint.midipoint = midinote;
                            newnote.slidePoints.push(newpoint);
                        }
                    }
                    else {
                    }
                }
                let chanTrack = this.findOrCreateTrack(miditrack, i, newchord.channel, tracksChannels);
                chanTrack.track.songchords.push(newchord);
            }
        }
        for (let tt = 0; tt < tracksChannels.length; tt++) {
            let trackChan = tracksChannels[tt];
            if (trackChan.track.songchords.length > 0) {
                midiSongData.miditracks.push(tracksChannels[tt].track);
                if (midiSongData.duration < maxWhen) {
                    midiSongData.duration = 54321 + maxWhen;
                }
                for (let i = 0; i < this.parsedTracks.length; i++) {
                    let miditrack = this.parsedTracks[i];
                    for (let kk = 0; kk < miditrack.programChannel.length; kk++) {
                        if (miditrack.programChannel[kk].channel == trackChan.channelNum) {
                            trackChan.track.program = miditrack.programChannel[kk].program;
                        }
                    }
                }
            }
        }
        let newtimeline = this.createTimeLine(midiSongData);
        let project = {
            title: title + ' ' + comment,
            timeline: newtimeline,
            tracks: [],
            percussions: [],
            filters: [],
            comments: []
        };
        for (let ii = 0; ii < project.timeline.length; ii++) {
            project.comments.push({ texts: [] });
        }
        for (let ii = 0; ii < midiSongData.lyrics.length; ii++) {
            let textpoint = midiSongData.lyrics[ii];
            let pnt = findMeasureSkipByTime(textpoint.ms / 1000, project.timeline);
            if (pnt) {
                this.addLyricsPoints(project.comments[pnt.idx], { count: pnt.skip.count, part: pnt.skip.part }, textpoint.txt);
            }
        }
        for (var ii = 0; ii < midiSongData.miditracks.length; ii++) {
            let midiTrack = midiSongData.miditracks[ii];
            if (midiTrack.channelNum == 9) {
                let drums = this.collectDrums(midiTrack);
                for (let dd = 0; dd < drums.length; dd++) {
                    project.percussions.push(this.createProjectDrums(drums[dd], project.timeline, midiTrack));
                }
            }
            else {
                project.tracks.push(this.createProjectTrack(project.timeline, midiTrack));
            }
        }
        console.log('project', project);
        return project;
    }
    addLyricsPoints(commentPoint, skip, txt) {
        txt = txt.replace(/(\r)/g, '~');
        txt = txt.replace(/\\r/g, '~');
        txt = txt.replace(/(\n)/g, '~');
        txt = txt.replace(/\\n/g, '~');
        txt = txt.replace(/(~~)/g, '~');
        txt = txt.replace(/(~~)/g, '~');
        txt = txt.replace(/(~~)/g, '~');
        txt = txt.replace(/(~~)/g, '~');
        let strings = txt.split('~');
        if (strings.length) {
            for (let ii = 0; ii < strings.length; ii++) {
                commentPoint.texts.push({ skip: skip, text: strings[ii].trim() });
            }
        }
    }
    collectDrums(midiTrack) {
        let drums = [];
        for (let ii = 0; ii < midiTrack.songchords.length; ii++) {
            let chord = midiTrack.songchords[ii];
            for (let kk = 0; kk < chord.notes.length; kk++) {
                let note = chord.notes[kk];
                if (drums.indexOf(note.midiPitch) < 0) {
                    drums.push(note.midiPitch);
                }
            }
        }
        return drums;
    }
    numratio(nn) {
        let rr = 1;
        return Math.round(nn * rr);
    }
    stripDuration(what) {
        return what;
    }
    createProjectTrack(timeline, midiTrack) {
        let projectTrack = {
            title: midiTrack.title + ' [' + midiTrack.program + '] ' + insNames[midiTrack.program],
            measures: [],
            filters: [],
            performer: { id: '', data: '' }
        };
        let mm = new MZXBX_MetreMath();
        for (let tt = 0; tt < timeline.length; tt++) {
            let projectMeasure = { chords: [] };
            projectTrack.measures.push(projectMeasure);
            let nextMeasure = timeline[tt];
            for (let ii = 0; ii < midiTrack.songchords.length; ii++) {
                let midiChord = midiTrack.songchords[ii];
                if (this.numratio(midiChord.when) >= nextMeasure.startMs
                    && this.numratio(midiChord.when) < nextMeasure.startMs + nextMeasure.durationMs) {
                    let trackChord = null;
                    let skip = mm.calculate((midiChord.when - nextMeasure.startMs) / 1000.0, nextMeasure.tempo).strip(32);
                    if (skip.count < 0) {
                        skip.count = 0;
                    }
                    for (let cc = 0; cc < projectMeasure.chords.length; cc++) {
                        if (mm.set(projectMeasure.chords[cc].skip).equals(skip)) {
                            trackChord = projectMeasure.chords[cc];
                        }
                    }
                    if (trackChord == null) {
                        trackChord = { skip: skip, notes: [] };
                        projectMeasure.chords.push(trackChord);
                    }
                    if (trackChord) {
                        for (let nn = 0; nn < midiChord.notes.length; nn++) {
                            let midiNote = midiChord.notes[nn];
                            let currentSlidePitch = midiNote.midiPitch;
                            let startDuration = mm.calculate(midiNote.midiDuration / 1000.0, nextMeasure.tempo);
                            let curSlide = {
                                duration: startDuration,
                                delta: 0
                            };
                            let trackNote = { pitch: currentSlidePitch, slides: [curSlide] };
                            if (midiNote.slidePoints.length > 0) {
                                trackNote.slides = [];
                                let bendDuration = 0;
                                for (let pp = 0; pp < midiNote.slidePoints.length; pp++) {
                                    let midiPoint = midiNote.slidePoints[pp];
                                    curSlide.delta = currentSlidePitch - midiPoint.pitch;
                                    currentSlidePitch = midiPoint.pitch;
                                    let xduration = mm.calculate(midiPoint.durationms / 1000.0, nextMeasure.tempo);
                                    curSlide = {
                                        duration: xduration,
                                        delta: 0
                                    };
                                    bendDuration = bendDuration + midiPoint.durationms;
                                    trackNote.slides.push(curSlide);
                                }
                                let remains = midiNote.midiDuration - bendDuration;
                                if (remains > 0) {
                                    curSlide = {
                                        duration: mm.calculate(remains / 1000.0, nextMeasure.tempo),
                                        delta: currentSlidePitch - Math.round(currentSlidePitch)
                                    };
                                    trackNote.slides.push(curSlide);
                                }
                            }
                            trackChord.notes.push(trackNote);
                        }
                    }
                }
            }
        }
        return projectTrack;
    }
    createProjectDrums(drum, timeline, midiTrack) {
        let projectDrums = {
            title: midiTrack.title + ' [' + drum + '] ' + drumNames[drum],
            measures: [],
            filters: [],
            sampler: { id: '', data: '' }
        };
        let currentTimeMs = 0;
        let mm = new MZXBX_MetreMath();
        for (let tt = 0; tt < timeline.length; tt++) {
            let projectMeasure = { skips: [] };
            projectDrums.measures.push(projectMeasure);
            let nextMeasure = timeline[tt];
            let measureDurationS = mm.set(nextMeasure.metre).duration(nextMeasure.tempo);
            for (let ii = 0; ii < midiTrack.songchords.length; ii++) {
                let chord = midiTrack.songchords[ii];
                for (let kk = 0; kk < chord.notes.length; kk++) {
                    let note = chord.notes[kk];
                    let pitch = note.midiPitch;
                    if (pitch == drum) {
                        if (chord.when >= currentTimeMs && chord.when < currentTimeMs + measureDurationS * 1000) {
                            let skip = mm.calculate((chord.when - currentTimeMs) / 1000, nextMeasure.tempo);
                            projectMeasure.skips.push(skip);
                        }
                    }
                }
            }
            currentTimeMs = currentTimeMs + measureDurationS * 1000;
        }
        return projectDrums;
    }
}
function findMeasureSkipByTime(time, measures) {
    let curTime = 0;
    let mm = new MZXBX_MetreMath();
    for (let ii = 0; ii < measures.length; ii++) {
        let cumea = measures[ii];
        let measureDurationS = mm.set(cumea.metre).duration(cumea.tempo);
        if (curTime + measureDurationS > time) {
            return {
                idx: ii,
                skip: mm.calculate(time - curTime, cumea.tempo)
            };
        }
        curTime = curTime + measureDurationS;
    }
    return null;
}
function newMIDIparser(arrayBuffer) {
    return new MidiParser(arrayBuffer);
}
class GPImporter {
    load(arrayBuffer) {
        console.log('load', arrayBuffer);
        let gp3To5Importer = new Gp3To5Importer();
        let uint8Array = new Uint8Array(arrayBuffer);
        console.log('uint8Array', uint8Array);
        let data = ByteBuffer.fromBuffer(uint8Array);
        let settings = new Settings();
        gp3To5Importer.init(data, settings);
        console.log('gp3To5Importer', gp3To5Importer);
        this.score = gp3To5Importer.readScore();
    }
    convertProject(title, comment) {
        let project = score2schedule(title, comment, this.score);
        return project;
    }
}
function newGPparser(arrayBuffer) {
    console.log("newGPparser");
    let pp = new GPImporter();
    pp.load(arrayBuffer);
    return pp;
}
function score2schedule(title, comment, score) {
    console.log('score2schedule', score);
    let project = {
        title: title + ' ' + comment,
        timeline: [],
        tracks: [],
        percussions: [],
        filters: [],
        comments: []
    };
    for (let tt = 0; tt < score.tracks.length; tt++) {
        let track = score.tracks[tt];
        let pp = false;
        for (let ss = 0; ss < track.staves.length; ss++) {
            if (track.staves[ss].isPercussion) {
                pp = true;
            }
        }
        if (pp) {
            addScoreDrumsTracks(project, track);
        }
        else {
            addScoreInsTrack(project, track);
        }
    }
    let tempo = 120;
    for (let bb = 0; bb < score.masterBars.length; bb++) {
        let maBar = score.masterBars[bb];
        if (maBar.tempoAutomation) {
            if (maBar.tempoAutomation.value > 0) {
                tempo = maBar.tempoAutomation.value;
            }
        }
        let measure = {
            tempo: tempo,
            metre: {
                count: maBar.timeSignatureNumerator,
                part: maBar.timeSignatureDenominator
            }
        };
        project.timeline.push(measure);
        for (let tr = 0; tr < project.tracks.length; tr++) {
            project.tracks[tr].measures.push({ chords: [] });
        }
    }
    return project;
}
function addScoreInsTrack(project, fromTrack) {
    let toTrack = {
        title: fromTrack.name,
        measures: [],
        filters: [],
        performer: { id: '', data: '' }
    };
    project.tracks.push(toTrack);
}
function addScoreDrumsTracks(project, fromTrack) {
}
class ImporterSettings {
    constructor() {
        this.encoding = 'utf-8';
        this.mergePartGroupsInMusicXml = false;
        this.beatTextAsLyrics = false;
    }
}
var TextAlign;
(function (TextAlign) {
    TextAlign[TextAlign["Left"] = 0] = "Left";
    TextAlign[TextAlign["Center"] = 1] = "Center";
    TextAlign[TextAlign["Right"] = 2] = "Right";
})(TextAlign || (TextAlign = {}));
var TextBaseline;
(function (TextBaseline) {
    TextBaseline[TextBaseline["Top"] = 0] = "Top";
    TextBaseline[TextBaseline["Middle"] = 1] = "Middle";
    TextBaseline[TextBaseline["Bottom"] = 2] = "Bottom";
})(TextBaseline || (TextBaseline = {}));
class ScoreImporter {
    init(data, settings) {
        this.data = data;
        this.settings = settings;
    }
}
var MusicFontSymbol;
(function (MusicFontSymbol) {
    MusicFontSymbol[MusicFontSymbol["None"] = -1] = "None";
    MusicFontSymbol[MusicFontSymbol["GClef"] = 57424] = "GClef";
    MusicFontSymbol[MusicFontSymbol["CClef"] = 57436] = "CClef";
    MusicFontSymbol[MusicFontSymbol["FClef"] = 57442] = "FClef";
    MusicFontSymbol[MusicFontSymbol["UnpitchedPercussionClef1"] = 57449] = "UnpitchedPercussionClef1";
    MusicFontSymbol[MusicFontSymbol["SixStringTabClef"] = 57453] = "SixStringTabClef";
    MusicFontSymbol[MusicFontSymbol["FourStringTabClef"] = 57454] = "FourStringTabClef";
    MusicFontSymbol[MusicFontSymbol["TimeSig0"] = 57472] = "TimeSig0";
    MusicFontSymbol[MusicFontSymbol["TimeSig1"] = 57473] = "TimeSig1";
    MusicFontSymbol[MusicFontSymbol["TimeSig2"] = 57474] = "TimeSig2";
    MusicFontSymbol[MusicFontSymbol["TimeSig3"] = 57475] = "TimeSig3";
    MusicFontSymbol[MusicFontSymbol["TimeSig4"] = 57476] = "TimeSig4";
    MusicFontSymbol[MusicFontSymbol["TimeSig5"] = 57477] = "TimeSig5";
    MusicFontSymbol[MusicFontSymbol["TimeSig6"] = 57478] = "TimeSig6";
    MusicFontSymbol[MusicFontSymbol["TimeSig7"] = 57479] = "TimeSig7";
    MusicFontSymbol[MusicFontSymbol["TimeSig8"] = 57480] = "TimeSig8";
    MusicFontSymbol[MusicFontSymbol["TimeSig9"] = 57481] = "TimeSig9";
    MusicFontSymbol[MusicFontSymbol["TimeSigCommon"] = 57482] = "TimeSigCommon";
    MusicFontSymbol[MusicFontSymbol["TimeSigCutCommon"] = 57483] = "TimeSigCutCommon";
    MusicFontSymbol[MusicFontSymbol["NoteheadDoubleWholeSquare"] = 57505] = "NoteheadDoubleWholeSquare";
    MusicFontSymbol[MusicFontSymbol["NoteheadDoubleWhole"] = 57504] = "NoteheadDoubleWhole";
    MusicFontSymbol[MusicFontSymbol["NoteheadWhole"] = 57506] = "NoteheadWhole";
    MusicFontSymbol[MusicFontSymbol["NoteheadHalf"] = 57507] = "NoteheadHalf";
    MusicFontSymbol[MusicFontSymbol["NoteheadBlack"] = 57508] = "NoteheadBlack";
    MusicFontSymbol[MusicFontSymbol["NoteheadNull"] = 57509] = "NoteheadNull";
    MusicFontSymbol[MusicFontSymbol["NoteheadXOrnate"] = 57514] = "NoteheadXOrnate";
    MusicFontSymbol[MusicFontSymbol["NoteheadTriangleUpWhole"] = 57531] = "NoteheadTriangleUpWhole";
    MusicFontSymbol[MusicFontSymbol["NoteheadTriangleUpHalf"] = 57532] = "NoteheadTriangleUpHalf";
    MusicFontSymbol[MusicFontSymbol["NoteheadTriangleUpBlack"] = 57534] = "NoteheadTriangleUpBlack";
    MusicFontSymbol[MusicFontSymbol["NoteheadDiamondBlackWide"] = 57564] = "NoteheadDiamondBlackWide";
    MusicFontSymbol[MusicFontSymbol["NoteheadDiamondWhite"] = 57565] = "NoteheadDiamondWhite";
    MusicFontSymbol[MusicFontSymbol["NoteheadDiamondWhiteWide"] = 57566] = "NoteheadDiamondWhiteWide";
    MusicFontSymbol[MusicFontSymbol["NoteheadCircleX"] = 57523] = "NoteheadCircleX";
    MusicFontSymbol[MusicFontSymbol["NoteheadXWhole"] = 57511] = "NoteheadXWhole";
    MusicFontSymbol[MusicFontSymbol["NoteheadXHalf"] = 57512] = "NoteheadXHalf";
    MusicFontSymbol[MusicFontSymbol["NoteheadXBlack"] = 57513] = "NoteheadXBlack";
    MusicFontSymbol[MusicFontSymbol["NoteheadParenthesis"] = 57550] = "NoteheadParenthesis";
    MusicFontSymbol[MusicFontSymbol["NoteheadSlashedBlack2"] = 57552] = "NoteheadSlashedBlack2";
    MusicFontSymbol[MusicFontSymbol["NoteheadCircleSlash"] = 57591] = "NoteheadCircleSlash";
    MusicFontSymbol[MusicFontSymbol["NoteheadHeavyX"] = 57592] = "NoteheadHeavyX";
    MusicFontSymbol[MusicFontSymbol["NoteheadHeavyXHat"] = 57593] = "NoteheadHeavyXHat";
    MusicFontSymbol[MusicFontSymbol["NoteQuarterUp"] = 57813] = "NoteQuarterUp";
    MusicFontSymbol[MusicFontSymbol["NoteEighthUp"] = 57815] = "NoteEighthUp";
    MusicFontSymbol[MusicFontSymbol["Tremolo3"] = 57890] = "Tremolo3";
    MusicFontSymbol[MusicFontSymbol["Tremolo2"] = 57889] = "Tremolo2";
    MusicFontSymbol[MusicFontSymbol["Tremolo1"] = 57888] = "Tremolo1";
    MusicFontSymbol[MusicFontSymbol["FlagEighthUp"] = 57920] = "FlagEighthUp";
    MusicFontSymbol[MusicFontSymbol["FlagEighthDown"] = 57921] = "FlagEighthDown";
    MusicFontSymbol[MusicFontSymbol["FlagSixteenthUp"] = 57922] = "FlagSixteenthUp";
    MusicFontSymbol[MusicFontSymbol["FlagSixteenthDown"] = 57923] = "FlagSixteenthDown";
    MusicFontSymbol[MusicFontSymbol["FlagThirtySecondUp"] = 57924] = "FlagThirtySecondUp";
    MusicFontSymbol[MusicFontSymbol["FlagThirtySecondDown"] = 57925] = "FlagThirtySecondDown";
    MusicFontSymbol[MusicFontSymbol["FlagSixtyFourthUp"] = 57926] = "FlagSixtyFourthUp";
    MusicFontSymbol[MusicFontSymbol["FlagSixtyFourthDown"] = 57927] = "FlagSixtyFourthDown";
    MusicFontSymbol[MusicFontSymbol["FlagOneHundredTwentyEighthUp"] = 57928] = "FlagOneHundredTwentyEighthUp";
    MusicFontSymbol[MusicFontSymbol["FlagOneHundredTwentyEighthDown"] = 57929] = "FlagOneHundredTwentyEighthDown";
    MusicFontSymbol[MusicFontSymbol["FlagTwoHundredFiftySixthUp"] = 57930] = "FlagTwoHundredFiftySixthUp";
    MusicFontSymbol[MusicFontSymbol["FlagTwoHundredFiftySixthDown"] = 57931] = "FlagTwoHundredFiftySixthDown";
    MusicFontSymbol[MusicFontSymbol["AccidentalFlat"] = 57952] = "AccidentalFlat";
    MusicFontSymbol[MusicFontSymbol["AccidentalNatural"] = 57953] = "AccidentalNatural";
    MusicFontSymbol[MusicFontSymbol["AccidentalSharp"] = 57954] = "AccidentalSharp";
    MusicFontSymbol[MusicFontSymbol["AccidentalDoubleSharp"] = 57955] = "AccidentalDoubleSharp";
    MusicFontSymbol[MusicFontSymbol["AccidentalDoubleFlat"] = 57956] = "AccidentalDoubleFlat";
    MusicFontSymbol[MusicFontSymbol["AccidentalQuarterToneFlatArrowUp"] = 57968] = "AccidentalQuarterToneFlatArrowUp";
    MusicFontSymbol[MusicFontSymbol["AccidentalQuarterToneSharpArrowUp"] = 57972] = "AccidentalQuarterToneSharpArrowUp";
    MusicFontSymbol[MusicFontSymbol["AccidentalQuarterToneNaturalArrowUp"] = 57970] = "AccidentalQuarterToneNaturalArrowUp";
    MusicFontSymbol[MusicFontSymbol["ArticAccentAbove"] = 58528] = "ArticAccentAbove";
    MusicFontSymbol[MusicFontSymbol["ArticStaccatoAbove"] = 58530] = "ArticStaccatoAbove";
    MusicFontSymbol[MusicFontSymbol["ArticMarcatoAbove"] = 58540] = "ArticMarcatoAbove";
    MusicFontSymbol[MusicFontSymbol["FermataAbove"] = 58560] = "FermataAbove";
    MusicFontSymbol[MusicFontSymbol["FermataShortAbove"] = 58564] = "FermataShortAbove";
    MusicFontSymbol[MusicFontSymbol["FermataLongAbove"] = 58566] = "FermataLongAbove";
    MusicFontSymbol[MusicFontSymbol["RestLonga"] = 58593] = "RestLonga";
    MusicFontSymbol[MusicFontSymbol["RestDoubleWhole"] = 58594] = "RestDoubleWhole";
    MusicFontSymbol[MusicFontSymbol["RestWhole"] = 58595] = "RestWhole";
    MusicFontSymbol[MusicFontSymbol["RestHalf"] = 58596] = "RestHalf";
    MusicFontSymbol[MusicFontSymbol["RestQuarter"] = 58597] = "RestQuarter";
    MusicFontSymbol[MusicFontSymbol["RestEighth"] = 58598] = "RestEighth";
    MusicFontSymbol[MusicFontSymbol["RestSixteenth"] = 58599] = "RestSixteenth";
    MusicFontSymbol[MusicFontSymbol["RestThirtySecond"] = 58600] = "RestThirtySecond";
    MusicFontSymbol[MusicFontSymbol["RestSixtyFourth"] = 58601] = "RestSixtyFourth";
    MusicFontSymbol[MusicFontSymbol["RestOneHundredTwentyEighth"] = 58602] = "RestOneHundredTwentyEighth";
    MusicFontSymbol[MusicFontSymbol["RestTwoHundredFiftySixth"] = 58603] = "RestTwoHundredFiftySixth";
    MusicFontSymbol[MusicFontSymbol["Repeat1Bar"] = 58624] = "Repeat1Bar";
    MusicFontSymbol[MusicFontSymbol["Repeat2Bars"] = 58625] = "Repeat2Bars";
    MusicFontSymbol[MusicFontSymbol["Ottava"] = 58640] = "Ottava";
    MusicFontSymbol[MusicFontSymbol["OttavaAlta"] = 58641] = "OttavaAlta";
    MusicFontSymbol[MusicFontSymbol["OttavaBassaVb"] = 58652] = "OttavaBassaVb";
    MusicFontSymbol[MusicFontSymbol["Quindicesima"] = 58644] = "Quindicesima";
    MusicFontSymbol[MusicFontSymbol["QuindicesimaAlta"] = 58645] = "QuindicesimaAlta";
    MusicFontSymbol[MusicFontSymbol["DynamicPPP"] = 58666] = "DynamicPPP";
    MusicFontSymbol[MusicFontSymbol["DynamicPP"] = 58667] = "DynamicPP";
    MusicFontSymbol[MusicFontSymbol["DynamicPiano"] = 58656] = "DynamicPiano";
    MusicFontSymbol[MusicFontSymbol["DynamicMP"] = 58668] = "DynamicMP";
    MusicFontSymbol[MusicFontSymbol["DynamicMF"] = 58669] = "DynamicMF";
    MusicFontSymbol[MusicFontSymbol["DynamicForte"] = 58658] = "DynamicForte";
    MusicFontSymbol[MusicFontSymbol["DynamicFF"] = 58671] = "DynamicFF";
    MusicFontSymbol[MusicFontSymbol["DynamicFFF"] = 58672] = "DynamicFFF";
    MusicFontSymbol[MusicFontSymbol["OrnamentTrill"] = 58726] = "OrnamentTrill";
    MusicFontSymbol[MusicFontSymbol["StringsDownBow"] = 58896] = "StringsDownBow";
    MusicFontSymbol[MusicFontSymbol["StringsUpBow"] = 58898] = "StringsUpBow";
    MusicFontSymbol[MusicFontSymbol["PictEdgeOfCymbal"] = 59177] = "PictEdgeOfCymbal";
    MusicFontSymbol[MusicFontSymbol["GuitarString0"] = 59443] = "GuitarString0";
    MusicFontSymbol[MusicFontSymbol["GuitarString1"] = 59444] = "GuitarString1";
    MusicFontSymbol[MusicFontSymbol["GuitarString2"] = 59445] = "GuitarString2";
    MusicFontSymbol[MusicFontSymbol["GuitarString3"] = 59446] = "GuitarString3";
    MusicFontSymbol[MusicFontSymbol["GuitarString4"] = 59447] = "GuitarString4";
    MusicFontSymbol[MusicFontSymbol["GuitarString5"] = 59448] = "GuitarString5";
    MusicFontSymbol[MusicFontSymbol["GuitarString6"] = 59449] = "GuitarString6";
    MusicFontSymbol[MusicFontSymbol["GuitarString7"] = 59450] = "GuitarString7";
    MusicFontSymbol[MusicFontSymbol["GuitarString8"] = 59451] = "GuitarString8";
    MusicFontSymbol[MusicFontSymbol["GuitarString9"] = 59452] = "GuitarString9";
    MusicFontSymbol[MusicFontSymbol["GuitarGolpe"] = 59458] = "GuitarGolpe";
    MusicFontSymbol[MusicFontSymbol["FretboardX"] = 59481] = "FretboardX";
    MusicFontSymbol[MusicFontSymbol["FretboardO"] = 59482] = "FretboardO";
    MusicFontSymbol[MusicFontSymbol["WiggleTrill"] = 60068] = "WiggleTrill";
    MusicFontSymbol[MusicFontSymbol["WiggleVibratoMediumFast"] = 60126] = "WiggleVibratoMediumFast";
    MusicFontSymbol[MusicFontSymbol["OctaveBaselineM"] = 60565] = "OctaveBaselineM";
    MusicFontSymbol[MusicFontSymbol["OctaveBaselineB"] = 60563] = "OctaveBaselineB";
})(MusicFontSymbol || (MusicFontSymbol = {}));
class Gp3To5Importer extends ScoreImporter {
    constructor() {
        super();
        this._versionNumber = 0;
        this._globalTripletFeel = TripletFeel.NoTripletFeel;
        this._lyricsTrack = 0;
        this._lyrics = [];
        this._barCount = 0;
        this._trackCount = 0;
        this._playbackInfos = [];
        this._beatTextChunksByTrack = new Map();
    }
    get name() {
        return 'Guitar Pro 3-5';
    }
    readScore() {
        this.readVersion();
        this._score = new Score();
        this.readScoreInformation();
        if (this._versionNumber < 500) {
            this._globalTripletFeel = GpBinaryHelpers.gpReadBool(this.data)
                ? TripletFeel.Triplet8th
                : TripletFeel.NoTripletFeel;
        }
        if (this._versionNumber >= 400) {
            this.readLyrics();
        }
        if (this._versionNumber >= 510) {
            this.data.skip(19);
        }
        if (this._versionNumber >= 500) {
            this.readPageSetup();
            this._score.tempoLabel = GpBinaryHelpers.gpReadStringIntByte(this.data, this.settings.importer.encoding);
        }
        this._score.tempo = IOHelper.readInt32LE(this.data);
        if (this._versionNumber >= 510) {
            GpBinaryHelpers.gpReadBool(this.data);
        }
        IOHelper.readInt32LE(this.data);
        if (this._versionNumber >= 400) {
            this.data.readByte();
        }
        this.readPlaybackInfos();
        if (this._versionNumber >= 500) {
            this.data.skip(38);
            this.data.skip(4);
        }
        this._barCount = IOHelper.readInt32LE(this.data);
        this._trackCount = IOHelper.readInt32LE(this.data);
        this.readMasterBars();
        this.readTracks();
        this.readBars();
        if (this._score.masterBars.length > 0) {
            this._score.masterBars[0].tempoAutomation = Automation.buildTempoAutomation(false, 0, this._score.tempo, 2);
            this._score.masterBars[0].tempoAutomation.text = this._score.tempoLabel;
        }
        this._score.finish(this.settings);
        if (this._lyrics && this._lyricsTrack >= 0) {
            this._score.tracks[this._lyricsTrack].applyLyrics(this._lyrics);
        }
        return this._score;
    }
    readVersion() {
        let version = GpBinaryHelpers.gpReadStringByteLength(this.data, 30, this.settings.importer.encoding);
        if (!version.startsWith(Gp3To5Importer.VersionString)) {
            throw 'Unsupported format';
        }
        version = version.substr(Gp3To5Importer.VersionString.length + 1);
        let dot = version.indexOf(String.fromCharCode(46));
        this._versionNumber = 100 * parseInt(version.substr(0, dot)) + parseInt(version.substr(dot + 1));
        console.log(this.name, 'Guitar Pro version ' + version + ' detected');
    }
    readScoreInformation() {
        var _a;
        this._score.title = GpBinaryHelpers.gpReadStringIntUnused(this.data, this.settings.importer.encoding);
        this._score.subTitle = GpBinaryHelpers.gpReadStringIntUnused(this.data, this.settings.importer.encoding);
        this._score.artist = GpBinaryHelpers.gpReadStringIntUnused(this.data, this.settings.importer.encoding);
        this._score.album = GpBinaryHelpers.gpReadStringIntUnused(this.data, this.settings.importer.encoding);
        this._score.words = GpBinaryHelpers.gpReadStringIntUnused(this.data, this.settings.importer.encoding);
        this._score.music =
            this._versionNumber >= 500
                ? GpBinaryHelpers.gpReadStringIntUnused(this.data, this.settings.importer.encoding)
                : this._score.words;
        this._score.copyright = GpBinaryHelpers.gpReadStringIntUnused(this.data, this.settings.importer.encoding);
        this._score.tab = GpBinaryHelpers.gpReadStringIntUnused(this.data, this.settings.importer.encoding);
        this._score.instructions = GpBinaryHelpers.gpReadStringIntUnused(this.data, this.settings.importer.encoding);
        let noticeLines = IOHelper.readInt32LE(this.data);
        let notice = '';
        for (let i = 0; i < noticeLines; i++) {
            if (i > 0) {
                notice += '\r\n';
            }
            notice += (_a = GpBinaryHelpers.gpReadStringIntUnused(this.data, this.settings.importer.encoding)) === null || _a === void 0 ? void 0 : _a.toString();
        }
        this._score.notices = notice;
    }
    readLyrics() {
        this._lyrics = [];
        this._lyricsTrack = IOHelper.readInt32LE(this.data) - 1;
        for (let i = 0; i < 5; i++) {
            let lyrics = new Lyrics();
            lyrics.startBar = IOHelper.readInt32LE(this.data) - 1;
            lyrics.text = GpBinaryHelpers.gpReadStringInt(this.data, this.settings.importer.encoding);
            this._lyrics.push(lyrics);
        }
    }
    readPageSetup() {
        this.data.skip(30);
        for (let i = 0; i < 10; i++) {
            GpBinaryHelpers.gpReadStringIntByte(this.data, this.settings.importer.encoding);
        }
    }
    readPlaybackInfos() {
        this._playbackInfos = [];
        for (let i = 0; i < 64; i++) {
            let info = new PlaybackInformation();
            info.primaryChannel = i;
            info.secondaryChannel = i;
            info.program = IOHelper.readInt32LE(this.data);
            info.volume = this.data.readByte();
            info.balance = this.data.readByte();
            this.data.skip(6);
            this._playbackInfos.push(info);
        }
    }
    readMasterBars() {
        for (let i = 0; i < this._barCount; i++) {
            this.readMasterBar();
        }
    }
    readMasterBar() {
        let previousMasterBar = null;
        if (this._score.masterBars.length > 0) {
            previousMasterBar = this._score.masterBars[this._score.masterBars.length - 1];
        }
        let newMasterBar = new MasterBar();
        let flags = this.data.readByte();
        if ((flags & 0x01) !== 0) {
            newMasterBar.timeSignatureNumerator = this.data.readByte();
        }
        else if (previousMasterBar) {
            newMasterBar.timeSignatureNumerator = previousMasterBar.timeSignatureNumerator;
        }
        if ((flags & 0x02) !== 0) {
            newMasterBar.timeSignatureDenominator = this.data.readByte();
        }
        else if (previousMasterBar) {
            newMasterBar.timeSignatureDenominator = previousMasterBar.timeSignatureDenominator;
        }
        newMasterBar.isRepeatStart = (flags & 0x04) !== 0;
        if ((flags & 0x08) !== 0) {
            newMasterBar.repeatCount = this.data.readByte() + (this._versionNumber >= 500 ? 0 : 1);
        }
        if ((flags & 0x10) !== 0 && this._versionNumber < 500) {
            let currentMasterBar = previousMasterBar;
            let existentAlternatives = 0;
            while (currentMasterBar) {
                if (currentMasterBar.isRepeatEnd && currentMasterBar !== previousMasterBar) {
                    break;
                }
                if (currentMasterBar.isRepeatStart) {
                    break;
                }
                existentAlternatives = existentAlternatives | currentMasterBar.alternateEndings;
                currentMasterBar = currentMasterBar.previousMasterBar;
            }
            let repeatAlternative = 0;
            let repeatMask = this.data.readByte();
            for (let i = 0; i < 8; i++) {
                let repeating = 1 << i;
                if (repeatMask > i && (existentAlternatives & repeating) === 0) {
                    repeatAlternative = repeatAlternative | repeating;
                }
            }
            newMasterBar.alternateEndings = repeatAlternative;
        }
        if ((flags & 0x20) !== 0) {
            let section = new Section();
            section.text = GpBinaryHelpers.gpReadStringIntByte(this.data, this.settings.importer.encoding);
            section.marker = '';
            GpBinaryHelpers.gpReadColor(this.data, false);
            newMasterBar.section = section;
        }
        if ((flags & 0x40) !== 0) {
            newMasterBar.keySignature = IOHelper.readSInt8(this.data);
            newMasterBar.keySignatureType = this.data.readByte();
        }
        else if (previousMasterBar) {
            newMasterBar.keySignature = previousMasterBar.keySignature;
            newMasterBar.keySignatureType = previousMasterBar.keySignatureType;
        }
        if (this._versionNumber >= 500 && (flags & 0x03) !== 0) {
            this.data.skip(4);
        }
        if (this._versionNumber >= 500) {
            newMasterBar.alternateEndings = this.data.readByte();
        }
        if (this._versionNumber >= 500) {
            let tripletFeel = this.data.readByte();
            switch (tripletFeel) {
                case 1:
                    newMasterBar.tripletFeel = TripletFeel.Triplet8th;
                    break;
                case 2:
                    newMasterBar.tripletFeel = TripletFeel.Triplet16th;
                    break;
            }
            this.data.readByte();
        }
        else {
            newMasterBar.tripletFeel = this._globalTripletFeel;
        }
        newMasterBar.isDoubleBar = (flags & 0x80) !== 0;
        this._score.addMasterBar(newMasterBar);
    }
    readTracks() {
        for (let i = 0; i < this._trackCount; i++) {
            this.readTrack();
        }
    }
    readTrack() {
        let newTrack = new Track();
        newTrack.ensureStaveCount(1);
        this._score.addTrack(newTrack);
        let mainStaff = newTrack.staves[0];
        let flags = this.data.readByte();
        newTrack.name = GpBinaryHelpers.gpReadStringByteLength(this.data, 40, this.settings.importer.encoding);
        if ((flags & 0x01) !== 0) {
            mainStaff.isPercussion = true;
        }
        let stringCount = IOHelper.readInt32LE(this.data);
        let tuning = [];
        for (let i = 0; i < 7; i++) {
            let stringTuning = IOHelper.readInt32LE(this.data);
            if (stringCount > i) {
                tuning.push(stringTuning);
            }
        }
        mainStaff.stringTuning.tunings = tuning;
        let port = IOHelper.readInt32LE(this.data);
        let index = IOHelper.readInt32LE(this.data) - 1;
        let effectChannel = IOHelper.readInt32LE(this.data) - 1;
        this.data.skip(4);
        if (index >= 0 && index < this._playbackInfos.length) {
            let info = this._playbackInfos[index];
            info.port = port;
            info.isSolo = (flags & 0x10) !== 0;
            info.isMute = (flags & 0x20) !== 0;
            info.secondaryChannel = effectChannel;
            if (GeneralMidi.isGuitar(info.program)) {
                mainStaff.displayTranspositionPitch = -12;
            }
            newTrack.playbackInfo = info;
        }
        mainStaff.capo = IOHelper.readInt32LE(this.data);
        newTrack.color = GpBinaryHelpers.gpReadColor(this.data, false);
        if (this._versionNumber >= 500) {
            this.data.readByte();
            this.data.readByte();
            this.data.skip(43);
        }
        if (this._versionNumber >= 510) {
            this.data.skip(4);
            GpBinaryHelpers.gpReadStringIntByte(this.data, this.settings.importer.encoding);
            GpBinaryHelpers.gpReadStringIntByte(this.data, this.settings.importer.encoding);
        }
    }
    readBars() {
        for (let i = 0; i < this._barCount; i++) {
            for (let t = 0; t < this._trackCount; t++) {
                this.readBar(this._score.tracks[t]);
            }
        }
    }
    readBar(track) {
        let newBar = new Bar();
        let mainStaff = track.staves[0];
        if (mainStaff.isPercussion) {
            newBar.clef = Clef.Neutral;
        }
        mainStaff.addBar(newBar);
        let voiceCount = 1;
        if (this._versionNumber >= 500) {
            this.data.readByte();
            voiceCount = 2;
        }
        for (let v = 0; v < voiceCount; v++) {
            this.readVoice(track, newBar);
        }
    }
    readVoice(track, bar) {
        let beatCount = IOHelper.readInt32LE(this.data);
        if (beatCount === 0) {
            return;
        }
        let newVoice = new Voice();
        bar.addVoice(newVoice);
        for (let i = 0; i < beatCount; i++) {
            this.readBeat(track, bar, newVoice);
        }
    }
    readBeat(track, bar, voice) {
        let newBeat = new Beat();
        let flags = this.data.readByte();
        if ((flags & 0x01) !== 0) {
            newBeat.dots = 1;
        }
        if ((flags & 0x40) !== 0) {
            let type = this.data.readByte();
            newBeat.isEmpty = (type & 0x02) === 0;
        }
        voice.addBeat(newBeat);
        let duration = IOHelper.readSInt8(this.data);
        switch (duration) {
            case -2:
                newBeat.duration = Duration.Whole;
                break;
            case -1:
                newBeat.duration = Duration.Half;
                break;
            case 0:
                newBeat.duration = Duration.Quarter;
                break;
            case 1:
                newBeat.duration = Duration.Eighth;
                break;
            case 2:
                newBeat.duration = Duration.Sixteenth;
                break;
            case 3:
                newBeat.duration = Duration.ThirtySecond;
                break;
            case 4:
                newBeat.duration = Duration.SixtyFourth;
                break;
            default:
                newBeat.duration = Duration.Quarter;
                break;
        }
        if ((flags & 0x20) !== 0) {
            newBeat.tupletNumerator = IOHelper.readInt32LE(this.data);
            switch (newBeat.tupletNumerator) {
                case 1:
                    newBeat.tupletDenominator = 1;
                    break;
                case 3:
                    newBeat.tupletDenominator = 2;
                    break;
                case 5:
                case 6:
                case 7:
                    newBeat.tupletDenominator = 4;
                    break;
                case 9:
                case 10:
                case 11:
                case 12:
                case 13:
                    newBeat.tupletDenominator = 8;
                    break;
                case 2:
                case 4:
                case 8:
                    break;
                default:
                    newBeat.tupletNumerator = 1;
                    newBeat.tupletDenominator = 1;
                    break;
            }
        }
        if ((flags & 0x02) !== 0) {
            this.readChord(newBeat);
        }
        let beatTextAsLyrics = this.settings.importer.beatTextAsLyrics
            && track.index !== this._lyricsTrack;
        if ((flags & 0x04) !== 0) {
            const text = GpBinaryHelpers.gpReadStringIntUnused(this.data, this.settings.importer.encoding);
            if (beatTextAsLyrics) {
                const lyrics = new Lyrics();
                lyrics.text = text.trim();
                lyrics.finish(true);
                const beatLyrics = [];
                for (let i = lyrics.chunks.length - 1; i >= 0; i--) {
                    beatLyrics.push(lyrics.chunks[i]);
                }
                this._beatTextChunksByTrack.set(track.index, beatLyrics);
            }
            else {
                newBeat.text = text;
            }
        }
        let allNoteHarmonicType = HarmonicType.None;
        if ((flags & 0x08) !== 0) {
            allNoteHarmonicType = this.readBeatEffects(newBeat);
        }
        if ((flags & 0x10) !== 0) {
            this.readMixTableChange(newBeat);
        }
        let stringFlags = this.data.readByte();
        for (let i = 6; i >= 0; i--) {
            if ((stringFlags & (1 << i)) !== 0 && 6 - i < bar.staff.tuning.length) {
                const note = this.readNote(track, bar, voice, newBeat, 6 - i);
                if (allNoteHarmonicType !== HarmonicType.None) {
                    note.harmonicType = allNoteHarmonicType;
                    if (note.harmonicType === HarmonicType.Natural) {
                        note.harmonicValue = this.deltaFretToHarmonicValue(note.fret);
                    }
                }
            }
        }
        if (this._versionNumber >= 500) {
            this.data.readByte();
            let flag = this.data.readByte();
            if ((flag & 0x08) !== 0) {
                this.data.readByte();
            }
        }
        if (beatTextAsLyrics && !newBeat.isRest &&
            this._beatTextChunksByTrack.has(track.index) &&
            this._beatTextChunksByTrack.get(track.index).length > 0) {
            newBeat.lyrics = [this._beatTextChunksByTrack.get(track.index).pop()];
        }
    }
    readChord(beat) {
        let chord = new Chord();
        let chordId = ModelUtils.newGuid();
        if (this._versionNumber >= 500) {
            this.data.skip(17);
            chord.name = GpBinaryHelpers.gpReadStringByteLength(this.data, 21, this.settings.importer.encoding);
            this.data.skip(4);
            chord.firstFret = IOHelper.readInt32LE(this.data);
            for (let i = 0; i < 7; i++) {
                let fret = IOHelper.readInt32LE(this.data);
                if (i < beat.voice.bar.staff.tuning.length) {
                    chord.strings.push(fret);
                }
            }
            let numberOfBarres = this.data.readByte();
            let barreFrets = new Uint8Array(5);
            this.data.read(barreFrets, 0, barreFrets.length);
            for (let i = 0; i < numberOfBarres; i++) {
                chord.barreFrets.push(barreFrets[i]);
            }
            this.data.skip(26);
        }
        else {
            if (this.data.readByte() !== 0) {
                if (this._versionNumber >= 400) {
                    this.data.skip(16);
                    chord.name = GpBinaryHelpers.gpReadStringByteLength(this.data, 21, this.settings.importer.encoding);
                    this.data.skip(4);
                    chord.firstFret = IOHelper.readInt32LE(this.data);
                    for (let i = 0; i < 7; i++) {
                        let fret = IOHelper.readInt32LE(this.data);
                        if (i < beat.voice.bar.staff.tuning.length) {
                            chord.strings.push(fret);
                        }
                    }
                    let numberOfBarres = this.data.readByte();
                    let barreFrets = new Uint8Array(5);
                    this.data.read(barreFrets, 0, barreFrets.length);
                    for (let i = 0; i < numberOfBarres; i++) {
                        chord.barreFrets.push(barreFrets[i]);
                    }
                    this.data.skip(26);
                }
                else {
                    this.data.skip(25);
                    chord.name = GpBinaryHelpers.gpReadStringByteLength(this.data, 34, this.settings.importer.encoding);
                    chord.firstFret = IOHelper.readInt32LE(this.data);
                    for (let i = 0; i < 6; i++) {
                        let fret = IOHelper.readInt32LE(this.data);
                        if (i < beat.voice.bar.staff.tuning.length) {
                            chord.strings.push(fret);
                        }
                    }
                    this.data.skip(36);
                }
            }
            else {
                let strings = this._versionNumber >= 406 ? 7 : 6;
                chord.name = GpBinaryHelpers.gpReadStringIntByte(this.data, this.settings.importer.encoding);
                chord.firstFret = IOHelper.readInt32LE(this.data);
                if (chord.firstFret > 0) {
                    for (let i = 0; i < strings; i++) {
                        let fret = IOHelper.readInt32LE(this.data);
                        if (i < beat.voice.bar.staff.tuning.length) {
                            chord.strings.push(fret);
                        }
                    }
                }
            }
        }
        if (chord.name) {
            beat.chordId = chordId;
            beat.voice.bar.staff.addChord(beat.chordId, chord);
        }
    }
    readBeatEffects(beat) {
        let flags = this.data.readByte();
        let flags2 = 0;
        if (this._versionNumber >= 400) {
            flags2 = this.data.readByte();
        }
        beat.fadeIn = (flags & 0x10) !== 0;
        if ((this._versionNumber < 400 && (flags & 0x01) !== 0) || (flags & 0x02) !== 0) {
            beat.vibrato = VibratoType.Slight;
        }
        beat.hasRasgueado = (flags2 & 0x01) !== 0;
        if ((flags & 0x20) !== 0 && this._versionNumber >= 400) {
            let slapPop = IOHelper.readSInt8(this.data);
            switch (slapPop) {
                case 1:
                    beat.tap = true;
                    break;
                case 2:
                    beat.slap = true;
                    break;
                case 3:
                    beat.pop = true;
                    break;
            }
        }
        else if ((flags & 0x20) !== 0) {
            let slapPop = IOHelper.readSInt8(this.data);
            switch (slapPop) {
                case 1:
                    beat.tap = true;
                    break;
                case 2:
                    beat.slap = true;
                    break;
                case 3:
                    beat.pop = true;
                    break;
            }
            this.data.skip(4);
        }
        if ((flags2 & 0x04) !== 0) {
            this.readTremoloBarEffect(beat);
        }
        if ((flags & 0x40) !== 0) {
            let strokeUp = 0;
            let strokeDown = 0;
            if (this._versionNumber < 500) {
                strokeDown = this.data.readByte();
                strokeUp = this.data.readByte();
            }
            else {
                strokeUp = this.data.readByte();
                strokeDown = this.data.readByte();
            }
            if (strokeUp > 0) {
                beat.brushType = BrushType.BrushUp;
                beat.brushDuration = Gp3To5Importer.toStrokeValue(strokeUp);
            }
            else if (strokeDown > 0) {
                beat.brushType = BrushType.BrushDown;
                beat.brushDuration = Gp3To5Importer.toStrokeValue(strokeDown);
            }
        }
        if ((flags2 & 0x02) !== 0) {
            switch (IOHelper.readSInt8(this.data)) {
                case 0:
                    beat.pickStroke = PickStroke.None;
                    break;
                case 1:
                    beat.pickStroke = PickStroke.Up;
                    break;
                case 2:
                    beat.pickStroke = PickStroke.Down;
                    break;
            }
        }
        if (this._versionNumber < 400) {
            if ((flags & 0x04) !== 0) {
                return HarmonicType.Natural;
            }
            else if ((flags & 0x08) !== 0) {
                return HarmonicType.Artificial;
            }
        }
        return HarmonicType.None;
    }
    readTremoloBarEffect(beat) {
        this.data.readByte();
        IOHelper.readInt32LE(this.data);
        let pointCount = IOHelper.readInt32LE(this.data);
        if (pointCount > 0) {
            for (let i = 0; i < pointCount; i++) {
                let point = new BendPoint(0, 0);
                point.offset = IOHelper.readInt32LE(this.data);
                point.value = (IOHelper.readInt32LE(this.data) / Gp3To5Importer.BendStep) | 0;
                GpBinaryHelpers.gpReadBool(this.data);
                beat.addWhammyBarPoint(point);
            }
        }
    }
    static toStrokeValue(value) {
        switch (value) {
            case 1:
                return 30;
            case 2:
                return 30;
            case 3:
                return 60;
            case 4:
                return 120;
            case 5:
                return 240;
            case 6:
                return 480;
            default:
                return 0;
        }
    }
    readMixTableChange(beat) {
        let tableChange = new MixTableChange();
        tableChange.instrument = IOHelper.readSInt8(this.data);
        if (this._versionNumber >= 500) {
            this.data.skip(16);
        }
        tableChange.volume = IOHelper.readSInt8(this.data);
        tableChange.balance = IOHelper.readSInt8(this.data);
        let chorus = IOHelper.readSInt8(this.data);
        let reverb = IOHelper.readSInt8(this.data);
        let phaser = IOHelper.readSInt8(this.data);
        let tremolo = IOHelper.readSInt8(this.data);
        if (this._versionNumber >= 500) {
            tableChange.tempoName = GpBinaryHelpers.gpReadStringIntByte(this.data, this.settings.importer.encoding);
        }
        tableChange.tempo = IOHelper.readInt32LE(this.data);
        if (tableChange.volume >= 0) {
            this.data.readByte();
        }
        if (tableChange.balance >= 0) {
            this.data.readByte();
        }
        if (chorus >= 0) {
            this.data.readByte();
        }
        if (reverb >= 0) {
            this.data.readByte();
        }
        if (phaser >= 0) {
            this.data.readByte();
        }
        if (tremolo >= 0) {
            this.data.readByte();
        }
        if (tableChange.tempo >= 0) {
            tableChange.duration = IOHelper.readSInt8(this.data);
            if (this._versionNumber >= 510) {
                this.data.readByte();
            }
        }
        if (this._versionNumber >= 400) {
            this.data.readByte();
        }
        if (this._versionNumber >= 500) {
            this.data.readByte();
        }
        if (this._versionNumber >= 510) {
            GpBinaryHelpers.gpReadStringIntByte(this.data, this.settings.importer.encoding);
            GpBinaryHelpers.gpReadStringIntByte(this.data, this.settings.importer.encoding);
        }
        if (tableChange.volume >= 0) {
            let volumeAutomation = new Automation();
            volumeAutomation.isLinear = true;
            volumeAutomation.type = AutomationType.Volume;
            volumeAutomation.value = tableChange.volume;
            beat.automations.push(volumeAutomation);
        }
        if (tableChange.balance >= 0) {
            let balanceAutomation = new Automation();
            balanceAutomation.isLinear = true;
            balanceAutomation.type = AutomationType.Balance;
            balanceAutomation.value = tableChange.balance;
            beat.automations.push(balanceAutomation);
        }
        if (tableChange.instrument >= 0) {
            let instrumentAutomation = new Automation();
            instrumentAutomation.isLinear = true;
            instrumentAutomation.type = AutomationType.Instrument;
            instrumentAutomation.value = tableChange.instrument;
            beat.automations.push(instrumentAutomation);
        }
        if (tableChange.tempo >= 0) {
            let tempoAutomation = new Automation();
            tempoAutomation.isLinear = true;
            tempoAutomation.type = AutomationType.Tempo;
            tempoAutomation.value = tableChange.tempo;
            beat.automations.push(tempoAutomation);
            beat.voice.bar.masterBar.tempoAutomation = tempoAutomation;
        }
    }
    readNote(track, bar, voice, beat, stringIndex) {
        let newNote = new Note();
        newNote.string = bar.staff.tuning.length - stringIndex;
        let flags = this.data.readByte();
        if ((flags & 0x02) !== 0) {
            newNote.accentuated = AccentuationType.Heavy;
        }
        else if ((flags & 0x40) !== 0) {
            newNote.accentuated = AccentuationType.Normal;
        }
        newNote.isGhost = (flags & 0x04) !== 0;
        if ((flags & 0x20) !== 0) {
            let noteType = this.data.readByte();
            if (noteType === 3) {
                newNote.isDead = true;
            }
            else if (noteType === 2) {
                newNote.isTieDestination = true;
            }
        }
        if ((flags & 0x01) !== 0 && this._versionNumber < 500) {
            this.data.readByte();
            this.data.readByte();
        }
        if ((flags & 0x10) !== 0) {
            let dynamicNumber = IOHelper.readSInt8(this.data);
            newNote.dynamics = this.toDynamicValue(dynamicNumber);
            beat.dynamics = newNote.dynamics;
        }
        if ((flags & 0x20) !== 0) {
            newNote.fret = IOHelper.readSInt8(this.data);
        }
        if ((flags & 0x80) !== 0) {
            newNote.leftHandFinger = IOHelper.readSInt8(this.data);
            newNote.rightHandFinger = IOHelper.readSInt8(this.data);
            newNote.isFingering = true;
        }
        let swapAccidentals = false;
        if (this._versionNumber >= 500) {
            if ((flags & 0x01) !== 0) {
                newNote.durationPercent = GpBinaryHelpers.gpReadDouble(this.data);
            }
            let flags2 = this.data.readByte();
            swapAccidentals = (flags2 & 0x02) !== 0;
        }
        beat.addNote(newNote);
        if ((flags & 0x08) !== 0) {
            this.readNoteEffects(track, voice, beat, newNote);
        }
        if (bar.staff.isPercussion) {
            newNote.percussionArticulation = newNote.fret;
            newNote.string = -1;
            newNote.fret = -1;
        }
        if (swapAccidentals) {
            const accidental = Tuning.defaultAccidentals[newNote.realValueWithoutHarmonic % 12];
            if (accidental === '#') {
                newNote.accidentalMode = NoteAccidentalMode.ForceFlat;
            }
            else if (accidental === 'b') {
                newNote.accidentalMode = NoteAccidentalMode.ForceSharp;
            }
        }
        return newNote;
    }
    toDynamicValue(value) {
        switch (value) {
            case 1:
                return DynamicValue.PPP;
            case 2:
                return DynamicValue.PP;
            case 3:
                return DynamicValue.P;
            case 4:
                return DynamicValue.MP;
            case 5:
                return DynamicValue.MF;
            case 6:
                return DynamicValue.F;
            case 7:
                return DynamicValue.FF;
            case 8:
                return DynamicValue.FFF;
            default:
                return DynamicValue.F;
        }
    }
    readNoteEffects(track, voice, beat, note) {
        let flags = this.data.readByte();
        let flags2 = 0;
        if (this._versionNumber >= 400) {
            flags2 = this.data.readByte();
        }
        if ((flags & 0x01) !== 0) {
            this.readBend(note);
        }
        if ((flags & 0x10) !== 0) {
            this.readGrace(voice, note);
        }
        if ((flags2 & 0x04) !== 0) {
            this.readTremoloPicking(beat);
        }
        if ((flags2 & 0x08) !== 0) {
            this.readSlide(note);
        }
        else if (this._versionNumber < 400) {
            if ((flags & 0x04) !== 0) {
                note.slideOutType = SlideOutType.Shift;
            }
        }
        if ((flags2 & 0x10) !== 0) {
            this.readArtificialHarmonic(note);
        }
        if ((flags2 & 0x20) !== 0) {
            this.readTrill(note);
        }
        note.isLetRing = (flags & 0x08) !== 0;
        note.isHammerPullOrigin = (flags & 0x02) !== 0;
        if ((flags2 & 0x40) !== 0) {
            note.vibrato = VibratoType.Slight;
        }
        note.isPalmMute = (flags2 & 0x02) !== 0;
        note.isStaccato = (flags2 & 0x01) !== 0;
    }
    readBend(note) {
        this.data.readByte();
        IOHelper.readInt32LE(this.data);
        let pointCount = IOHelper.readInt32LE(this.data);
        if (pointCount > 0) {
            for (let i = 0; i < pointCount; i++) {
                let point = new BendPoint(0, 0);
                point.offset = IOHelper.readInt32LE(this.data);
                point.value = (IOHelper.readInt32LE(this.data) / Gp3To5Importer.BendStep) | 0;
                GpBinaryHelpers.gpReadBool(this.data);
                note.addBendPoint(point);
            }
        }
    }
    readGrace(voice, note) {
        let graceBeat = new Beat();
        let graceNote = new Note();
        graceNote.string = note.string;
        graceNote.fret = IOHelper.readSInt8(this.data);
        graceBeat.duration = Duration.ThirtySecond;
        graceBeat.dynamics = this.toDynamicValue(IOHelper.readSInt8(this.data));
        let transition = IOHelper.readSInt8(this.data);
        switch (transition) {
            case 0:
                break;
            case 1:
                graceNote.slideOutType = SlideOutType.Legato;
                graceNote.slideTarget = note;
                break;
            case 2:
                break;
            case 3:
                graceNote.isHammerPullOrigin = true;
                break;
        }
        graceNote.dynamics = graceBeat.dynamics;
        this.data.skip(1);
        if (this._versionNumber < 500) {
            graceBeat.graceType = GraceType.BeforeBeat;
        }
        else {
            let flags = this.data.readByte();
            graceNote.isDead = (flags & 0x01) !== 0;
            graceBeat.graceType = (flags & 0x02) !== 0 ? GraceType.OnBeat : GraceType.BeforeBeat;
        }
        voice.addGraceBeat(graceBeat);
        graceBeat.addNote(graceNote);
    }
    readTremoloPicking(beat) {
        let speed = this.data.readByte();
        switch (speed) {
            case 1:
                beat.tremoloSpeed = Duration.Eighth;
                break;
            case 2:
                beat.tremoloSpeed = Duration.Sixteenth;
                break;
            case 3:
                beat.tremoloSpeed = Duration.ThirtySecond;
                break;
        }
    }
    readSlide(note) {
        if (this._versionNumber >= 500) {
            let type = IOHelper.readSInt8(this.data);
            if ((type & 1) !== 0) {
                note.slideOutType = SlideOutType.Shift;
            }
            else if ((type & 2) !== 0) {
                note.slideOutType = SlideOutType.Legato;
            }
            else if ((type & 4) !== 0) {
                note.slideOutType = SlideOutType.OutDown;
            }
            else if ((type & 8) !== 0) {
                note.slideOutType = SlideOutType.OutUp;
            }
            if ((type & 16) !== 0) {
                note.slideInType = SlideInType.IntoFromBelow;
            }
            else if ((type & 32) !== 0) {
                note.slideInType = SlideInType.IntoFromAbove;
            }
        }
        else {
            let type = IOHelper.readSInt8(this.data);
            switch (type) {
                case 1:
                    note.slideOutType = SlideOutType.Shift;
                    break;
                case 2:
                    note.slideOutType = SlideOutType.Legato;
                    break;
                case 3:
                    note.slideOutType = SlideOutType.OutDown;
                    break;
                case 4:
                    note.slideOutType = SlideOutType.OutUp;
                    break;
                case -1:
                    note.slideInType = SlideInType.IntoFromBelow;
                    break;
                case -2:
                    note.slideInType = SlideInType.IntoFromAbove;
                    break;
            }
        }
    }
    readArtificialHarmonic(note) {
        let type = this.data.readByte();
        if (this._versionNumber >= 500) {
            switch (type) {
                case 1:
                    note.harmonicType = HarmonicType.Natural;
                    note.harmonicValue = this.deltaFretToHarmonicValue(note.fret);
                    break;
                case 2:
                    this.data.readByte();
                    this.data.readByte();
                    this.data.readByte();
                    note.harmonicType = HarmonicType.Artificial;
                    break;
                case 3:
                    note.harmonicType = HarmonicType.Tap;
                    note.harmonicValue = this.deltaFretToHarmonicValue(this.data.readByte());
                    break;
                case 4:
                    note.harmonicType = HarmonicType.Pinch;
                    note.harmonicValue = 12;
                    break;
                case 5:
                    note.harmonicType = HarmonicType.Semi;
                    note.harmonicValue = 12;
                    break;
            }
        }
        else if (this._versionNumber >= 400) {
            switch (type) {
                case 1:
                    note.harmonicType = HarmonicType.Natural;
                    break;
                case 3:
                    note.harmonicType = HarmonicType.Tap;
                    break;
                case 4:
                    note.harmonicType = HarmonicType.Pinch;
                    break;
                case 5:
                    note.harmonicType = HarmonicType.Semi;
                    break;
                case 15:
                    note.harmonicType = HarmonicType.Artificial;
                    break;
                case 17:
                    note.harmonicType = HarmonicType.Artificial;
                    break;
                case 22:
                    note.harmonicType = HarmonicType.Artificial;
                    break;
            }
        }
    }
    deltaFretToHarmonicValue(deltaFret) {
        switch (deltaFret) {
            case 2:
                return 2.4;
            case 3:
                return 3.2;
            case 4:
            case 5:
            case 7:
            case 9:
            case 12:
            case 16:
            case 17:
            case 19:
            case 24:
                return deltaFret;
            case 8:
                return 8.2;
            case 10:
                return 9.6;
            case 14:
            case 15:
                return 14.7;
            case 21:
            case 22:
                return 21.7;
            default:
                return 12;
        }
    }
    readTrill(note) {
        note.trillValue = this.data.readByte() + note.stringTuning;
        switch (this.data.readByte()) {
            case 1:
                note.trillSpeed = Duration.Sixteenth;
                break;
            case 2:
                note.trillSpeed = Duration.ThirtySecond;
                break;
            case 3:
                note.trillSpeed = Duration.SixtyFourth;
                break;
        }
    }
}
Gp3To5Importer.VersionString = 'FICHIER GUITAR PRO ';
Gp3To5Importer.BendStep = 25;
class GpBinaryHelpers {
    static gpReadDouble(data) {
        let bytes = new Uint8Array(8);
        data.read(bytes, 0, bytes.length);
        let array = new Float64Array(bytes.buffer);
        return array[0];
    }
    static gpReadFloat(data) {
        let bytes = new Uint8Array(4);
        bytes[3] = data.readByte();
        bytes[2] = data.readByte();
        bytes[2] = data.readByte();
        bytes[1] = data.readByte();
        let array = new Float32Array(bytes.buffer);
        return array[0];
    }
    static gpReadColor(data, readAlpha = false) {
        let r = data.readByte();
        let g = data.readByte();
        let b = data.readByte();
        let a = 255;
        if (readAlpha) {
            a = data.readByte();
        }
        else {
            data.skip(1);
        }
        return new Color(r, g, b, a);
    }
    static gpReadBool(data) {
        return data.readByte() !== 0;
    }
    static gpReadStringIntUnused(data, encoding) {
        data.skip(4);
        return GpBinaryHelpers.gpReadString(data, data.readByte(), encoding);
    }
    static gpReadStringInt(data, encoding) {
        return GpBinaryHelpers.gpReadString(data, IOHelper.readInt32LE(data), encoding);
    }
    static gpReadStringIntByte(data, encoding) {
        let length = IOHelper.readInt32LE(data) - 1;
        data.readByte();
        return GpBinaryHelpers.gpReadString(data, length, encoding);
    }
    static gpReadString(data, length, encoding) {
        let b = new Uint8Array(length);
        data.read(b, 0, b.length);
        return IOHelper.toString(b, encoding);
    }
    static gpWriteString(data, s) {
        const encoded = IOHelper.stringToBytes(s);
        data.writeByte(s.length);
        data.write(encoded, 0, encoded.length);
    }
    static gpReadStringByteLength(data, length, encoding) {
        let stringLength = data.readByte();
        let s = GpBinaryHelpers.gpReadString(data, stringLength, encoding);
        if (stringLength < length) {
            data.skip(length - stringLength);
        }
        return s;
    }
}
class MixTableChange {
    constructor() {
        this.volume = -1;
        this.balance = -1;
        this.instrument = -1;
        this.tempoName = '';
        this.tempo = -1;
        this.duration = -1;
    }
}
class Settings {
    constructor() {
        this.notation = new NotationSettings();
        this.importer = new ImporterSettings();
    }
}
class Score {
    constructor() {
        this._currentRepeatGroup = null;
        this._openedRepeatGroups = [];
        this._properlyOpenedRepeatGroups = 0;
        this.album = '';
        this.artist = '';
        this.copyright = '';
        this.instructions = '';
        this.music = '';
        this.notices = '';
        this.subTitle = '';
        this.title = '';
        this.words = '';
        this.tab = '';
        this.tempo = 120;
        this.tempoLabel = '';
        this.masterBars = [];
        this.tracks = [];
        this.defaultSystemsLayout = 3;
        this.systemsLayout = [];
    }
    rebuildRepeatGroups() {
        this._currentRepeatGroup = null;
        this._openedRepeatGroups = [];
        this._properlyOpenedRepeatGroups = 0;
        for (const bar of this.masterBars) {
            this.addMasterBarToRepeatGroups(bar);
        }
    }
    addMasterBar(bar) {
        bar.score = this;
        bar.index = this.masterBars.length;
        if (this.masterBars.length !== 0) {
            bar.previousMasterBar = this.masterBars[this.masterBars.length - 1];
            bar.previousMasterBar.nextMasterBar = bar;
            bar.start =
                bar.previousMasterBar.start +
                    (bar.previousMasterBar.isAnacrusis ? 0 : bar.previousMasterBar.calculateDuration());
        }
        this.addMasterBarToRepeatGroups(bar);
        this.masterBars.push(bar);
    }
    addMasterBarToRepeatGroups(bar) {
        var _a;
        if (bar.isRepeatStart) {
            if ((_a = this._currentRepeatGroup) === null || _a === void 0 ? void 0 : _a.isClosed) {
                this._openedRepeatGroups.pop();
                this._properlyOpenedRepeatGroups--;
            }
            this._currentRepeatGroup = new RepeatGroup();
            this._openedRepeatGroups.push(this._currentRepeatGroup);
            this._properlyOpenedRepeatGroups++;
        }
        else if (!this._currentRepeatGroup) {
            this._currentRepeatGroup = new RepeatGroup();
            this._openedRepeatGroups.push(this._currentRepeatGroup);
        }
        this._currentRepeatGroup.addMasterBar(bar);
        if (bar.isRepeatEnd) {
            if (this._properlyOpenedRepeatGroups > 1) {
                this._openedRepeatGroups.pop();
                this._properlyOpenedRepeatGroups--;
                this._currentRepeatGroup =
                    this._openedRepeatGroups.length > 0
                        ? this._openedRepeatGroups[this._openedRepeatGroups.length - 1]
                        : null;
            }
        }
    }
    addTrack(track) {
        track.score = this;
        track.index = this.tracks.length;
        this.tracks.push(track);
    }
    finish(settings) {
        const sharedDataBag = new Map();
        for (let i = 0, j = this.tracks.length; i < j; i++) {
            this.tracks[i].finish(settings, sharedDataBag);
        }
    }
}
class RepeatGroup {
    constructor() {
        this.masterBars = [];
        this.opening = null;
        this.closings = [];
        this.isClosed = false;
    }
    get openings() {
        const opening = this.opening;
        return opening ? [opening] : [];
    }
    get isOpened() { var _a; return ((_a = this.opening) === null || _a === void 0 ? void 0 : _a.isRepeatStart) === true; }
    addMasterBar(masterBar) {
        if (this.opening === null) {
            this.opening = masterBar;
        }
        this.masterBars.push(masterBar);
        masterBar.repeatGroup = this;
        if (masterBar.isRepeatEnd) {
            this.closings.push(masterBar);
            this.isClosed = true;
        }
    }
}
var AccentuationType;
(function (AccentuationType) {
    AccentuationType[AccentuationType["None"] = 0] = "None";
    AccentuationType[AccentuationType["Normal"] = 1] = "Normal";
    AccentuationType[AccentuationType["Heavy"] = 2] = "Heavy";
})(AccentuationType || (AccentuationType = {}));
var AccidentalType;
(function (AccidentalType) {
    AccidentalType[AccidentalType["None"] = 0] = "None";
    AccidentalType[AccidentalType["Natural"] = 1] = "Natural";
    AccidentalType[AccidentalType["Sharp"] = 2] = "Sharp";
    AccidentalType[AccidentalType["Flat"] = 3] = "Flat";
    AccidentalType[AccidentalType["NaturalQuarterNoteUp"] = 4] = "NaturalQuarterNoteUp";
    AccidentalType[AccidentalType["SharpQuarterNoteUp"] = 5] = "SharpQuarterNoteUp";
    AccidentalType[AccidentalType["FlatQuarterNoteUp"] = 6] = "FlatQuarterNoteUp";
    AccidentalType[AccidentalType["DoubleSharp"] = 7] = "DoubleSharp";
    AccidentalType[AccidentalType["DoubleFlat"] = 8] = "DoubleFlat";
})(AccidentalType || (AccidentalType = {}));
var AutomationType;
(function (AutomationType) {
    AutomationType[AutomationType["Tempo"] = 0] = "Tempo";
    AutomationType[AutomationType["Volume"] = 1] = "Volume";
    AutomationType[AutomationType["Instrument"] = 2] = "Instrument";
    AutomationType[AutomationType["Balance"] = 3] = "Balance";
})(AutomationType || (AutomationType = {}));
class Automation {
    constructor() {
        this.isLinear = false;
        this.type = AutomationType.Tempo;
        this.value = 0;
        this.ratioPosition = 0;
        this.text = '';
    }
    static buildTempoAutomation(isLinear, ratioPosition, value, reference) {
        if (reference < 1 || reference > 5) {
            reference = 2;
        }
        let references = new Float32Array([1, 0.5, 1.0, 1.5, 2.0, 3.0]);
        let automation = new Automation();
        automation.type = AutomationType.Tempo;
        automation.isLinear = isLinear;
        automation.ratioPosition = ratioPosition;
        automation.value = value * references[reference];
        return automation;
    }
    static buildInstrumentAutomation(isLinear, ratioPosition, value) {
        let automation = new Automation();
        automation.type = AutomationType.Instrument;
        automation.isLinear = isLinear;
        automation.ratioPosition = ratioPosition;
        automation.value = value;
        return automation;
    }
}
class Bar {
    constructor() {
        this.id = Bar._globalBarId++;
        this.index = 0;
        this.nextBar = null;
        this.previousBar = null;
        this.clef = Clef.G2;
        this.clefOttava = Ottavia.Regular;
        this.voices = [];
        this.simileMark = SimileMark.None;
        this.isMultiVoice = false;
        this.displayScale = 1;
        this.displayWidth = -1;
    }
    get masterBar() {
        return this.staff.track.score.masterBars[this.index];
    }
    get isEmpty() {
        for (let i = 0, j = this.voices.length; i < j; i++) {
            if (!this.voices[i].isEmpty) {
                return false;
            }
        }
        return true;
    }
    addVoice(voice) {
        voice.bar = this;
        voice.index = this.voices.length;
        this.voices.push(voice);
    }
    finish(settings, sharedDataBag = null) {
        this.isMultiVoice = false;
        for (let i = 0, j = this.voices.length; i < j; i++) {
            let voice = this.voices[i];
            voice.finish(settings, sharedDataBag);
            if (i > 0 && !voice.isEmpty) {
                this.isMultiVoice = true;
            }
        }
    }
    calculateDuration() {
        let duration = 0;
        for (let voice of this.voices) {
            let voiceDuration = voice.calculateDuration();
            if (voiceDuration > duration) {
                duration = voiceDuration;
            }
        }
        return duration;
    }
}
Bar._globalBarId = 0;
var BeatBeamingMode;
(function (BeatBeamingMode) {
    BeatBeamingMode[BeatBeamingMode["Auto"] = 0] = "Auto";
    BeatBeamingMode[BeatBeamingMode["ForceSplitToNext"] = 1] = "ForceSplitToNext";
    BeatBeamingMode[BeatBeamingMode["ForceMergeWithNext"] = 2] = "ForceMergeWithNext";
})(BeatBeamingMode || (BeatBeamingMode = {}));
class Beat {
    constructor() {
        this.id = Beat._globalBeatId++;
        this.index = 0;
        this.previousBeat = null;
        this.nextBeat = null;
        this.notes = [];
        this.noteStringLookup = new Map();
        this.noteValueLookup = new Map();
        this.isEmpty = false;
        this.whammyStyle = BendStyle.Default;
        this.ottava = Ottavia.Regular;
        this.fermata = null;
        this.isLegatoOrigin = false;
        this.minNote = null;
        this.maxNote = null;
        this.maxStringNote = null;
        this.minStringNote = null;
        this.duration = Duration.Quarter;
        this.isLetRing = false;
        this.isPalmMute = false;
        this.automations = [];
        this.dots = 0;
        this.fadeIn = false;
        this.lyrics = null;
        this.hasRasgueado = false;
        this.pop = false;
        this.slap = false;
        this.tap = false;
        this.text = null;
        this.brushType = BrushType.None;
        this.brushDuration = 0;
        this.tupletDenominator = -1;
        this.tupletNumerator = -1;
        this.tupletGroup = null;
        this.isContinuedWhammy = false;
        this.whammyBarType = WhammyType.None;
        this.whammyBarPoints = null;
        this.maxWhammyPoint = null;
        this.minWhammyPoint = null;
        this.vibrato = VibratoType.None;
        this.chordId = null;
        this.graceType = GraceType.None;
        this.graceGroup = null;
        this.graceIndex = -1;
        this.pickStroke = PickStroke.None;
        this.tremoloSpeed = null;
        this.crescendo = CrescendoType.None;
        this.displayStart = 0;
        this.playbackStart = 0;
        this.displayDuration = 0;
        this.playbackDuration = 0;
        this.dynamics = DynamicValue.F;
        this.invertBeamDirection = false;
        this.preferredBeamDirection = null;
        this.isEffectSlurOrigin = false;
        this.effectSlurOrigin = null;
        this.effectSlurDestination = null;
        this.beamingMode = BeatBeamingMode.Auto;
    }
    get isLastOfVoice() {
        return this.index === this.voice.beats.length - 1;
    }
    get isLegatoDestination() {
        return !!this.previousBeat && this.previousBeat.isLegatoOrigin;
    }
    get isRest() {
        return this.isEmpty || this.notes.length === 0;
    }
    get isFullBarRest() {
        return this.isRest && this.voice.beats.length === 1 && this.duration === Duration.Whole;
    }
    get hasTuplet() {
        return (!(this.tupletDenominator === -1 && this.tupletNumerator === -1) &&
            !(this.tupletDenominator === 1 && this.tupletNumerator === 1));
    }
    get hasWhammyBar() {
        return this.whammyBarPoints !== null && this.whammyBarType !== WhammyType.None;
    }
    get hasChord() {
        return !!this.chordId;
    }
    get chord() {
        return this.chordId ? this.voice.bar.staff.getChord(this.chordId) : null;
    }
    get isTremolo() {
        return !!this.tremoloSpeed;
    }
    get absoluteDisplayStart() {
        return this.voice.bar.masterBar.start + this.displayStart;
    }
    get absolutePlaybackStart() {
        return this.voice.bar.masterBar.start + this.playbackStart;
    }
    get isEffectSlurDestination() {
        return !!this.effectSlurOrigin;
    }
    addWhammyBarPoint(point) {
        let points = this.whammyBarPoints;
        if (points === null) {
            points = [];
            this.whammyBarPoints = points;
        }
        points.push(point);
        if (!this.maxWhammyPoint || point.value > this.maxWhammyPoint.value) {
            this.maxWhammyPoint = point;
        }
        if (!this.minWhammyPoint || point.value < this.minWhammyPoint.value) {
            this.minWhammyPoint = point;
        }
        if (this.whammyBarType === WhammyType.None) {
            this.whammyBarType = WhammyType.Custom;
        }
    }
    removeWhammyBarPoint(index) {
        const points = this.whammyBarPoints;
        if (points === null || index < 0 || index >= points.length) {
            return;
        }
        points.splice(index, 1);
        let point = points[index];
        if (point === this.maxWhammyPoint) {
            this.maxWhammyPoint = null;
            for (let currentPoint of points) {
                if (!this.maxWhammyPoint || currentPoint.value > this.maxWhammyPoint.value) {
                    this.maxWhammyPoint = currentPoint;
                }
            }
        }
        if (point === this.minWhammyPoint) {
            this.minWhammyPoint = null;
            for (let currentPoint of points) {
                if (!this.minWhammyPoint || currentPoint.value < this.minWhammyPoint.value) {
                    this.minWhammyPoint = currentPoint;
                }
            }
        }
    }
    addNote(note) {
        note.beat = this;
        note.index = this.notes.length;
        this.notes.push(note);
        if (note.isStringed) {
            this.noteStringLookup.set(note.string, note);
        }
    }
    removeNote(note) {
        let index = this.notes.indexOf(note);
        if (index >= 0) {
            this.notes.splice(index, 1);
            if (note.isStringed) {
                this.noteStringLookup.delete(note.string);
            }
        }
    }
    getAutomation(type) {
        for (let i = 0, j = this.automations.length; i < j; i++) {
            let automation = this.automations[i];
            if (automation.type === type) {
                return automation;
            }
        }
        return null;
    }
    getNoteOnString(noteString) {
        if (this.noteStringLookup.has(noteString)) {
            return this.noteStringLookup.get(noteString);
        }
        return null;
    }
    calculateDuration() {
        if (this.isFullBarRest) {
            return this.voice.bar.masterBar.calculateDuration();
        }
        let ticks = MidiUtils.toTicks(this.duration);
        if (this.dots === 2) {
            ticks = MidiUtils.applyDot(ticks, true);
        }
        else if (this.dots === 1) {
            ticks = MidiUtils.applyDot(ticks, false);
        }
        if (this.tupletDenominator > 0 && this.tupletNumerator >= 0) {
            ticks = MidiUtils.applyTuplet(ticks, this.tupletNumerator, this.tupletDenominator);
        }
        return ticks;
    }
    updateDurations() {
        let ticks = this.calculateDuration();
        this.playbackDuration = ticks;
        switch (this.graceType) {
            case GraceType.BeforeBeat:
            case GraceType.OnBeat:
                switch (this.duration) {
                    case Duration.Sixteenth:
                        this.playbackDuration = MidiUtils.toTicks(Duration.SixtyFourth);
                        break;
                    case Duration.ThirtySecond:
                        this.playbackDuration = MidiUtils.toTicks(Duration.OneHundredTwentyEighth);
                        break;
                    default:
                        this.playbackDuration = MidiUtils.toTicks(Duration.ThirtySecond);
                        break;
                }
                this.displayDuration = 0;
                break;
            case GraceType.BendGrace:
                this.playbackDuration /= 2;
                this.displayDuration = 0;
                break;
            default:
                this.displayDuration = ticks;
                let previous = this.previousBeat;
                if (previous && previous.graceType === GraceType.BendGrace) {
                    this.playbackDuration = previous.playbackDuration;
                }
                break;
        }
    }
    finishTuplet() {
        let previousBeat = this.previousBeat;
        let currentTupletGroup = previousBeat ? previousBeat.tupletGroup : null;
        if (this.hasTuplet || (this.graceType !== GraceType.None && currentTupletGroup)) {
            if (!previousBeat || !currentTupletGroup || !currentTupletGroup.check(this)) {
                currentTupletGroup = new TupletGroup(this.voice);
                currentTupletGroup.check(this);
            }
            this.tupletGroup = currentTupletGroup;
        }
    }
    finish(settings, sharedDataBag = null) {
        if (this.getAutomation(AutomationType.Instrument) === null &&
            this.index === 0 &&
            this.voice.index === 0 &&
            this.voice.bar.index === 0 &&
            this.voice.bar.staff.index === 0) {
            this.automations.push(Automation.buildInstrumentAutomation(false, 0, this.voice.bar.staff.track.playbackInfo.program));
        }
        switch (this.graceType) {
            case GraceType.OnBeat:
            case GraceType.BeforeBeat:
                let numberOfGraceBeats = this.graceGroup.beats.length;
                if (numberOfGraceBeats === 1) {
                    this.duration = Duration.Eighth;
                }
                else if (numberOfGraceBeats === 2) {
                    this.duration = Duration.Sixteenth;
                }
                else {
                    this.duration = Duration.ThirtySecond;
                }
                break;
        }
        let displayMode = !settings ? NotationMode.GuitarPro : settings.notation.notationMode;
        let isGradual = this.text === 'grad' || this.text === 'grad.';
        if (isGradual && displayMode === NotationMode.SongBook) {
            this.text = '';
        }
        let needCopyBeatForBend = false;
        this.minNote = null;
        this.maxNote = null;
        this.minStringNote = null;
        this.maxStringNote = null;
        let visibleNotes = 0;
        let isEffectSlurBeat = false;
        for (let i = 0, j = this.notes.length; i < j; i++) {
            let note = this.notes[i];
            note.dynamics = this.dynamics;
            note.finish(settings, sharedDataBag);
            if (note.isLetRing) {
                this.isLetRing = true;
            }
            if (note.isPalmMute) {
                this.isPalmMute = true;
            }
            if (displayMode === NotationMode.SongBook && note.hasBend && this.graceType !== GraceType.BendGrace) {
                if (!note.isTieOrigin) {
                    switch (note.bendType) {
                        case BendType.Bend:
                        case BendType.PrebendRelease:
                        case BendType.PrebendBend:
                            needCopyBeatForBend = true;
                            break;
                    }
                }
                if (isGradual || note.bendStyle === BendStyle.Gradual) {
                    isGradual = true;
                    note.bendStyle = BendStyle.Gradual;
                    needCopyBeatForBend = false;
                }
                else {
                    note.bendStyle = BendStyle.Fast;
                }
            }
            if (note.isVisible) {
                visibleNotes++;
                if (!this.minNote || note.realValue < this.minNote.realValue) {
                    this.minNote = note;
                }
                if (!this.maxNote || note.realValue > this.maxNote.realValue) {
                    this.maxNote = note;
                }
                if (!this.minStringNote || note.string < this.minStringNote.string) {
                    this.minStringNote = note;
                }
                if (!this.maxStringNote || note.string > this.maxStringNote.string) {
                    this.maxStringNote = note;
                }
                if (note.hasEffectSlur) {
                    isEffectSlurBeat = true;
                }
            }
        }
        if (isEffectSlurBeat) {
            if (this.effectSlurOrigin) {
                this.effectSlurOrigin.effectSlurDestination = this.nextBeat;
                if (this.effectSlurOrigin.effectSlurDestination) {
                    this.effectSlurOrigin.effectSlurDestination.effectSlurOrigin = this.effectSlurOrigin;
                }
                this.effectSlurOrigin = null;
            }
            else {
                this.isEffectSlurOrigin = true;
                this.effectSlurDestination = this.nextBeat;
                if (this.effectSlurDestination) {
                    this.effectSlurDestination.effectSlurOrigin = this;
                }
            }
        }
        if (this.notes.length > 0 && visibleNotes === 0) {
            this.isEmpty = true;
        }
        if (!this.isRest && (!this.isLetRing || !this.isPalmMute)) {
            let currentBeat = this.previousBeat;
            while (currentBeat && currentBeat.isRest) {
                if (!this.isLetRing) {
                    currentBeat.isLetRing = false;
                }
                if (!this.isPalmMute) {
                    currentBeat.isPalmMute = false;
                }
                currentBeat = currentBeat.previousBeat;
            }
        }
        else if (this.isRest &&
            this.previousBeat &&
            settings &&
            settings.notation.notationMode === NotationMode.GuitarPro) {
            if (this.previousBeat.isLetRing) {
                this.isLetRing = true;
            }
            if (this.previousBeat.isPalmMute) {
                this.isPalmMute = true;
            }
        }
        const points = this.whammyBarPoints;
        if (points !== null && points.length > 0 && this.whammyBarType === WhammyType.Custom) {
            if (displayMode === NotationMode.SongBook) {
                this.whammyStyle = isGradual ? BendStyle.Gradual : BendStyle.Fast;
            }
            let isContinuedWhammy = !!this.previousBeat && this.previousBeat.hasWhammyBar;
            this.isContinuedWhammy = isContinuedWhammy;
            if (points.length === 4) {
                let origin = points[0];
                let middle1 = points[1];
                let middle2 = points[2];
                let destination = points[3];
                if (middle1.value === middle2.value) {
                    if ((origin.value < middle1.value && middle1.value < destination.value) ||
                        (origin.value > middle1.value && middle1.value > destination.value)) {
                        if (origin.value !== 0 && !isContinuedWhammy) {
                            this.whammyBarType = WhammyType.PrediveDive;
                        }
                        else {
                            this.whammyBarType = WhammyType.Dive;
                        }
                        points.splice(2, 1);
                        points.splice(1, 1);
                    }
                    else if ((origin.value > middle1.value && middle1.value < destination.value) ||
                        (origin.value < middle1.value && middle1.value > destination.value)) {
                        this.whammyBarType = WhammyType.Dip;
                        if (middle1.offset === middle2.offset || displayMode === NotationMode.SongBook) {
                            points.splice(2, 1);
                        }
                    }
                    else if (origin.value === middle1.value && middle1.value === destination.value) {
                        if (origin.value !== 0 && !isContinuedWhammy) {
                            this.whammyBarType = WhammyType.Predive;
                        }
                        else {
                            this.whammyBarType = WhammyType.Hold;
                        }
                        points.splice(2, 1);
                        points.splice(1, 1);
                    }
                }
            }
        }
        this.updateDurations();
        if (needCopyBeatForBend) {
            let cloneBeat = BeatCloner.clone(this);
            cloneBeat.id = Beat._globalBeatId++;
            cloneBeat.pickStroke = PickStroke.None;
            for (let i = 0, j = cloneBeat.notes.length; i < j; i++) {
                let cloneNote = cloneBeat.notes[i];
                let note = this.notes[i];
                cloneNote.bendType = BendType.None;
                cloneNote.maxBendPoint = null;
                cloneNote.bendPoints = null;
                cloneNote.bendStyle = BendStyle.Default;
                cloneNote.id = Note.GlobalNoteId++;
                if (note.isTieOrigin) {
                    cloneNote.tieDestination = note.tieDestination;
                    note.tieDestination.tieOrigin = cloneNote;
                }
                if (note.isTieDestination) {
                    cloneNote.tieOrigin = note.tieOrigin ? note.tieOrigin : null;
                    note.tieOrigin.tieDestination = cloneNote;
                }
                if (note.hasBend && note.isTieOrigin) {
                    let tieDestination = Note.findTieOrigin(note);
                    if (tieDestination && tieDestination.hasBend) {
                        cloneNote.bendType = BendType.Hold;
                        let lastPoint = note.bendPoints[note.bendPoints.length - 1];
                        cloneNote.addBendPoint(new BendPoint(0, lastPoint.value));
                        cloneNote.addBendPoint(new BendPoint(BendPoint.MaxPosition, lastPoint.value));
                    }
                }
                cloneNote.isTieDestination = true;
            }
            this.graceType = GraceType.BendGrace;
            this.graceGroup = new GraceGroup();
            this.graceGroup.addBeat(this);
            this.graceGroup.isComplete = true;
            this.graceGroup.finish();
            this.updateDurations();
            this.voice.insertBeat(this, cloneBeat);
            cloneBeat.graceGroup = new GraceGroup();
            cloneBeat.graceGroup.addBeat(this);
            cloneBeat.graceGroup.isComplete = true;
            cloneBeat.graceGroup.finish();
        }
    }
    isBefore(beat) {
        return (this.voice.bar.index < beat.voice.bar.index ||
            (beat.voice.bar.index === this.voice.bar.index && this.index < beat.index));
    }
    isAfter(beat) {
        return (this.voice.bar.index > beat.voice.bar.index ||
            (beat.voice.bar.index === this.voice.bar.index && this.index > beat.index));
    }
    hasNoteOnString(noteString) {
        return this.noteStringLookup.has(noteString);
    }
    getNoteWithRealValue(noteRealValue) {
        if (this.noteValueLookup.has(noteRealValue)) {
            return this.noteValueLookup.get(noteRealValue);
        }
        return null;
    }
    chain(sharedDataBag = null) {
        for (const n of this.notes) {
            this.noteValueLookup.set(n.realValue, n);
            n.chain(sharedDataBag);
        }
    }
}
Beat._globalBeatId = 0;
class BendPoint {
    constructor(offset = 0, value = 0) {
        this.offset = offset;
        this.value = value;
    }
}
BendPoint.MaxPosition = 60;
BendPoint.MaxValue = 12;
var BendStyle;
(function (BendStyle) {
    BendStyle[BendStyle["Default"] = 0] = "Default";
    BendStyle[BendStyle["Gradual"] = 1] = "Gradual";
    BendStyle[BendStyle["Fast"] = 2] = "Fast";
})(BendStyle || (BendStyle = {}));
var BendType;
(function (BendType) {
    BendType[BendType["None"] = 0] = "None";
    BendType[BendType["Custom"] = 1] = "Custom";
    BendType[BendType["Bend"] = 2] = "Bend";
    BendType[BendType["Release"] = 3] = "Release";
    BendType[BendType["BendRelease"] = 4] = "BendRelease";
    BendType[BendType["Hold"] = 5] = "Hold";
    BendType[BendType["Prebend"] = 6] = "Prebend";
    BendType[BendType["PrebendBend"] = 7] = "PrebendBend";
    BendType[BendType["PrebendRelease"] = 8] = "PrebendRelease";
})(BendType || (BendType = {}));
var BrushType;
(function (BrushType) {
    BrushType[BrushType["None"] = 0] = "None";
    BrushType[BrushType["BrushUp"] = 1] = "BrushUp";
    BrushType[BrushType["BrushDown"] = 2] = "BrushDown";
    BrushType[BrushType["ArpeggioUp"] = 3] = "ArpeggioUp";
    BrushType[BrushType["ArpeggioDown"] = 4] = "ArpeggioDown";
})(BrushType || (BrushType = {}));
class Chord {
    constructor() {
        this.name = '';
        this.firstFret = 1;
        this.strings = [];
        this.barreFrets = [];
        this.showName = true;
        this.showDiagram = true;
        this.showFingering = true;
    }
    get uniqueId() {
        const properties = [
            this.name,
            this.firstFret.toString(),
            this.strings.join(','),
            this.barreFrets.join(','),
            this.showDiagram.toString(),
            this.showFingering.toString(),
            this.showName.toString()
        ];
        return properties.join('|');
    }
}
var Clef;
(function (Clef) {
    Clef[Clef["Neutral"] = 0] = "Neutral";
    Clef[Clef["C3"] = 1] = "C3";
    Clef[Clef["C4"] = 2] = "C4";
    Clef[Clef["F4"] = 3] = "F4";
    Clef[Clef["G2"] = 4] = "G2";
})(Clef || (Clef = {}));
var FermataType;
(function (FermataType) {
    FermataType[FermataType["Short"] = 0] = "Short";
    FermataType[FermataType["Medium"] = 1] = "Medium";
    FermataType[FermataType["Long"] = 2] = "Long";
})(FermataType || (FermataType = {}));
class Fermata {
    constructor() {
        this.type = FermataType.Short;
        this.length = 0;
    }
}
var KeySignature;
(function (KeySignature) {
    KeySignature[KeySignature["Cb"] = -7] = "Cb";
    KeySignature[KeySignature["Gb"] = -6] = "Gb";
    KeySignature[KeySignature["Db"] = -5] = "Db";
    KeySignature[KeySignature["Ab"] = -4] = "Ab";
    KeySignature[KeySignature["Eb"] = -3] = "Eb";
    KeySignature[KeySignature["Bb"] = -2] = "Bb";
    KeySignature[KeySignature["F"] = -1] = "F";
    KeySignature[KeySignature["C"] = 0] = "C";
    KeySignature[KeySignature["G"] = 1] = "G";
    KeySignature[KeySignature["D"] = 2] = "D";
    KeySignature[KeySignature["A"] = 3] = "A";
    KeySignature[KeySignature["E"] = 4] = "E";
    KeySignature[KeySignature["B"] = 5] = "B";
    KeySignature[KeySignature["FSharp"] = 6] = "FSharp";
    KeySignature[KeySignature["CSharp"] = 7] = "CSharp";
})(KeySignature || (KeySignature = {}));
var KeySignatureType;
(function (KeySignatureType) {
    KeySignatureType[KeySignatureType["Major"] = 0] = "Major";
    KeySignatureType[KeySignatureType["Minor"] = 1] = "Minor";
})(KeySignatureType || (KeySignatureType = {}));
class MasterBar {
    constructor() {
        this.alternateEndings = 0;
        this.nextMasterBar = null;
        this.previousMasterBar = null;
        this.index = 0;
        this.keySignature = KeySignature.C;
        this.keySignatureType = KeySignatureType.Major;
        this.isDoubleBar = false;
        this.isRepeatStart = false;
        this.repeatCount = 0;
        this.timeSignatureNumerator = 4;
        this.timeSignatureDenominator = 4;
        this.timeSignatureCommon = false;
        this.tripletFeel = TripletFeel.NoTripletFeel;
        this.section = null;
        this.tempoAutomation = null;
        this.fermata = null;
        this.start = 0;
        this.isAnacrusis = false;
        this.displayScale = 1;
        this.displayWidth = -1;
    }
    get isRepeatEnd() {
        return this.repeatCount > 0;
    }
    get isSectionStart() {
        return !!this.section;
    }
    calculateDuration(respectAnacrusis = true) {
        if (this.isAnacrusis && respectAnacrusis) {
            let duration = 0;
            for (let track of this.score.tracks) {
                for (let staff of track.staves) {
                    let barDuration = this.index < staff.bars.length ? staff.bars[this.index].calculateDuration() : 0;
                    if (barDuration > duration) {
                        duration = barDuration;
                    }
                }
            }
            return duration;
        }
        return this.timeSignatureNumerator * MidiUtils.valueToTicks(this.timeSignatureDenominator);
    }
    addFermata(offset, fermata) {
        let fermataMap = this.fermata;
        if (fermataMap === null) {
            fermataMap = new Map();
            this.fermata = fermataMap;
        }
        fermataMap.set(offset, fermata);
    }
    getFermata(beat) {
        const fermataMap = this.fermata;
        if (fermataMap === null) {
            return null;
        }
        if (fermataMap.has(beat.playbackStart)) {
            return fermataMap.get(beat.playbackStart);
        }
        return null;
    }
}
MasterBar.MaxAlternateEndings = 8;
class MidiUtils {
    static ticksToMillis(ticks, tempo) {
        return (ticks * (60000.0 / (tempo * MidiUtils.QuarterTime))) | 0;
    }
    static millisToTicks(millis, tempo) {
        return (millis / (60000.0 / (tempo * MidiUtils.QuarterTime))) | 0;
    }
    static toTicks(duration) {
        return MidiUtils.valueToTicks(duration);
    }
    static valueToTicks(duration) {
        let denomninator = duration;
        if (denomninator < 0) {
            denomninator = 1 / -denomninator;
        }
        return (MidiUtils.QuarterTime * (4.0 / denomninator)) | 0;
    }
    static applyDot(ticks, doubleDotted) {
        if (doubleDotted) {
            return ticks + ((ticks / 4) | 0) * 3;
        }
        return ticks + ((ticks / 2) | 0);
    }
    static applyTuplet(ticks, numerator, denominator) {
        return ((ticks * denominator) / numerator) | 0;
    }
    static removeTuplet(ticks, numerator, denominator) {
        return ((ticks * numerator) / denominator) | 0;
    }
    static dynamicToVelocity(dynamicsSteps) {
        return MidiUtils.MinVelocity + dynamicsSteps * MidiUtils.VelocityIncrement;
    }
}
MidiUtils.QuarterTime = 960;
MidiUtils.MinVelocity = 15;
MidiUtils.VelocityIncrement = 16;
var Duration;
(function (Duration) {
    Duration[Duration["QuadrupleWhole"] = -4] = "QuadrupleWhole";
    Duration[Duration["DoubleWhole"] = -2] = "DoubleWhole";
    Duration[Duration["Whole"] = 1] = "Whole";
    Duration[Duration["Half"] = 2] = "Half";
    Duration[Duration["Quarter"] = 4] = "Quarter";
    Duration[Duration["Eighth"] = 8] = "Eighth";
    Duration[Duration["Sixteenth"] = 16] = "Sixteenth";
    Duration[Duration["ThirtySecond"] = 32] = "ThirtySecond";
    Duration[Duration["SixtyFourth"] = 64] = "SixtyFourth";
    Duration[Duration["OneHundredTwentyEighth"] = 128] = "OneHundredTwentyEighth";
    Duration[Duration["TwoHundredFiftySixth"] = 256] = "TwoHundredFiftySixth";
})(Duration || (Duration = {}));
var Ottavia;
(function (Ottavia) {
    Ottavia[Ottavia["_15ma"] = 0] = "_15ma";
    Ottavia[Ottavia["_8va"] = 1] = "_8va";
    Ottavia[Ottavia["Regular"] = 2] = "Regular";
    Ottavia[Ottavia["_8vb"] = 3] = "_8vb";
    Ottavia[Ottavia["_15mb"] = 4] = "_15mb";
})(Ottavia || (Ottavia = {}));
class Staff {
    constructor() {
        this.index = 0;
        this.bars = [];
        this.chords = null;
        this.capo = 0;
        this.transpositionPitch = 0;
        this.displayTranspositionPitch = 0;
        this.stringTuning = new Tuning('', [], false);
        this.showTablature = true;
        this.showStandardNotation = true;
        this.isPercussion = false;
        this.standardNotationLineCount = 5;
    }
    get tuning() {
        return this.stringTuning.tunings;
    }
    get tuningName() {
        return this.stringTuning.name;
    }
    get isStringed() {
        return this.stringTuning.tunings.length > 0;
    }
    finish(settings, sharedDataBag = null) {
        this.stringTuning.finish();
        for (let i = 0, j = this.bars.length; i < j; i++) {
            this.bars[i].finish(settings, sharedDataBag);
        }
    }
    addChord(chordId, chord) {
        chord.staff = this;
        let chordMap = this.chords;
        if (chordMap === null) {
            chordMap = new Map();
            this.chords = chordMap;
        }
        chordMap.set(chordId, chord);
    }
    hasChord(chordId) {
        var _a, _b;
        return (_b = (_a = this.chords) === null || _a === void 0 ? void 0 : _a.has(chordId)) !== null && _b !== void 0 ? _b : false;
    }
    getChord(chordId) {
        var _a, _b;
        return (_b = (_a = this.chords) === null || _a === void 0 ? void 0 : _a.get(chordId)) !== null && _b !== void 0 ? _b : null;
    }
    addBar(bar) {
        let bars = this.bars;
        bar.staff = this;
        bar.index = bars.length;
        if (bars.length > 0) {
            bar.previousBar = bars[bars.length - 1];
            bar.previousBar.nextBar = bar;
        }
        bars.push(bar);
    }
}
class Track {
    constructor() {
        this.index = 0;
        this.staves = [];
        this.playbackInfo = new PlaybackInformation();
        this.color = new Color(200, 0, 0, 255);
        this.name = '';
        this.shortName = '';
        this.defaultSystemsLayout = 3;
        this.systemsLayout = [];
        this.percussionArticulations = [];
    }
    ensureStaveCount(staveCount) {
        while (this.staves.length < staveCount) {
            this.addStaff(new Staff());
        }
    }
    addStaff(staff) {
        staff.index = this.staves.length;
        staff.track = this;
        this.staves.push(staff);
    }
    finish(settings, sharedDataBag = null) {
        if (!this.shortName) {
            this.shortName = this.name;
            if (this.shortName.length > Track.ShortNameMaxLength) {
                this.shortName = this.shortName.substr(0, Track.ShortNameMaxLength);
            }
        }
        for (let i = 0, j = this.staves.length; i < j; i++) {
            this.staves[i].finish(settings, sharedDataBag);
        }
    }
    applyLyrics(lyrics) {
        for (let lyric of lyrics) {
            lyric.finish();
        }
        let staff = this.staves[0];
        for (let li = 0; li < lyrics.length; li++) {
            let lyric = lyrics[li];
            if (lyric.startBar >= 0 && lyric.startBar < staff.bars.length) {
                let beat = staff.bars[lyric.startBar].voices[0].beats[0];
                for (let ci = 0; ci < lyric.chunks.length && beat; ci++) {
                    while (beat && (beat.isEmpty || beat.isRest)) {
                        beat = beat.nextBeat;
                    }
                    if (beat) {
                        if (!beat.lyrics) {
                            beat.lyrics = new Array(lyrics.length);
                            beat.lyrics.fill("");
                        }
                        beat.lyrics[li] = lyric.chunks[ci];
                        beat = beat.nextBeat;
                    }
                }
            }
        }
    }
}
Track.ShortNameMaxLength = 10;
class Voice {
    constructor() {
        this.id = Voice._globalBarId++;
        this.index = 0;
        this.beats = [];
        this.isEmpty = true;
    }
    insertBeat(after, newBeat) {
        newBeat.nextBeat = after.nextBeat;
        if (newBeat.nextBeat) {
            newBeat.nextBeat.previousBeat = newBeat;
        }
        newBeat.previousBeat = after;
        newBeat.voice = this;
        after.nextBeat = newBeat;
        this.beats.splice(after.index + 1, 0, newBeat);
    }
    addBeat(beat) {
        beat.voice = this;
        beat.index = this.beats.length;
        this.beats.push(beat);
        if (!beat.isEmpty) {
            this.isEmpty = false;
        }
    }
    chain(beat, sharedDataBag = null) {
        if (!this.bar) {
            return;
        }
        if (beat.index < this.beats.length - 1) {
            beat.nextBeat = this.beats[beat.index + 1];
            beat.nextBeat.previousBeat = beat;
        }
        else if (beat.isLastOfVoice && beat.voice.bar.nextBar) {
            let nextVoice = this.bar.nextBar.voices[this.index];
            if (nextVoice.beats.length > 0) {
                beat.nextBeat = nextVoice.beats[0];
                beat.nextBeat.previousBeat = beat;
            }
            else {
                beat.nextBeat.previousBeat = beat;
            }
        }
        beat.chain(sharedDataBag);
    }
    addGraceBeat(beat) {
        if (this.beats.length === 0) {
            this.addBeat(beat);
            return;
        }
        let lastBeat = this.beats[this.beats.length - 1];
        this.beats.splice(this.beats.length - 1, 1);
        this.addBeat(beat);
        this.addBeat(lastBeat);
        this.isEmpty = false;
    }
    getBeatAtPlaybackStart(playbackStart) {
        if (this._beatLookup.has(playbackStart)) {
            return this._beatLookup.get(playbackStart);
        }
        return null;
    }
    finish(settings, sharedDataBag = null) {
        this._beatLookup = new Map();
        let currentGraceGroup = null;
        for (let index = 0; index < this.beats.length; index++) {
            let beat = this.beats[index];
            beat.index = index;
            this.chain(beat, sharedDataBag);
            if (beat.graceType === GraceType.None) {
                beat.graceGroup = currentGraceGroup;
                if (currentGraceGroup) {
                    currentGraceGroup.isComplete = true;
                }
                currentGraceGroup = null;
            }
            else {
                if (!currentGraceGroup) {
                    currentGraceGroup = new GraceGroup();
                }
                currentGraceGroup.addBeat(beat);
            }
        }
        let currentDisplayTick = 0;
        let currentPlaybackTick = 0;
        for (let i = 0; i < this.beats.length; i++) {
            let beat = this.beats[i];
            beat.index = i;
            beat.finish(settings, sharedDataBag);
            if (beat.graceType === GraceType.None) {
                if (beat.graceGroup) {
                    const firstGraceBeat = beat.graceGroup.beats[0];
                    const lastGraceBeat = beat.graceGroup.beats[beat.graceGroup.beats.length - 1];
                    if (firstGraceBeat.graceType !== GraceType.BendGrace) {
                        let stolenDuration = lastGraceBeat.playbackStart + lastGraceBeat.playbackDuration - firstGraceBeat.playbackStart;
                        switch (firstGraceBeat.graceType) {
                            case GraceType.BeforeBeat:
                                if (firstGraceBeat.previousBeat) {
                                    firstGraceBeat.previousBeat.playbackDuration -= stolenDuration;
                                    if (firstGraceBeat.previousBeat.voice == this) {
                                        currentPlaybackTick =
                                            firstGraceBeat.previousBeat.playbackStart +
                                                firstGraceBeat.previousBeat.playbackDuration;
                                    }
                                    else {
                                        currentPlaybackTick = -stolenDuration;
                                    }
                                }
                                else {
                                    currentPlaybackTick = -stolenDuration;
                                }
                                for (const graceBeat of beat.graceGroup.beats) {
                                    this._beatLookup.delete(graceBeat.playbackStart);
                                    graceBeat.playbackStart = currentPlaybackTick;
                                    this._beatLookup.set(graceBeat.playbackStart, beat);
                                    currentPlaybackTick += graceBeat.playbackDuration;
                                }
                                break;
                            case GraceType.OnBeat:
                                beat.playbackDuration -= stolenDuration;
                                if (lastGraceBeat.voice === this) {
                                    currentPlaybackTick = lastGraceBeat.playbackStart + lastGraceBeat.playbackDuration;
                                }
                                else {
                                    currentPlaybackTick = -stolenDuration;
                                }
                                break;
                        }
                    }
                }
                beat.displayStart = currentDisplayTick;
                beat.playbackStart = currentPlaybackTick;
                if (beat.fermata) {
                    this.bar.masterBar.addFermata(beat.playbackStart, beat.fermata);
                }
                else {
                    beat.fermata = this.bar.masterBar.getFermata(beat);
                }
                this._beatLookup.set(beat.playbackStart, beat);
            }
            else {
                beat.displayStart = currentDisplayTick;
                beat.playbackStart = currentPlaybackTick;
            }
            beat.finishTuplet();
            if (beat.graceGroup) {
                beat.graceGroup.finish();
            }
            currentDisplayTick += beat.displayDuration;
            currentPlaybackTick += beat.playbackDuration;
        }
    }
    calculateDuration() {
        if (this.isEmpty || this.beats.length === 0) {
            return 0;
        }
        let lastBeat = this.beats[this.beats.length - 1];
        let firstBeat = this.beats[0];
        return lastBeat.playbackStart + lastBeat.playbackDuration - firstBeat.playbackStart;
    }
}
Voice._globalBarId = 0;
var SimileMark;
(function (SimileMark) {
    SimileMark[SimileMark["None"] = 0] = "None";
    SimileMark[SimileMark["Simple"] = 1] = "Simple";
    SimileMark[SimileMark["FirstOfDouble"] = 2] = "FirstOfDouble";
    SimileMark[SimileMark["SecondOfDouble"] = 3] = "SecondOfDouble";
})(SimileMark || (SimileMark = {}));
class NoteIdBag {
    constructor() {
        this.tieDestinationNoteId = -1;
        this.tieOriginNoteId = -1;
        this.slurDestinationNoteId = -1;
        this.slurOriginNoteId = -1;
        this.hammerPullDestinationNoteId = -1;
        this.hammerPullOriginNoteId = -1;
    }
}
class Note {
    constructor() {
        this.id = Note.GlobalNoteId++;
        this.index = 0;
        this.accentuated = AccentuationType.None;
        this.bendType = BendType.None;
        this.bendStyle = BendStyle.Default;
        this.bendOrigin = null;
        this.isContinuedBend = false;
        this.bendPoints = null;
        this.maxBendPoint = null;
        this.fret = -1;
        this.string = -1;
        this.octave = -1;
        this.tone = -1;
        this.percussionArticulation = -1;
        this.isVisible = true;
        this.isLeftHandTapped = false;
        this.isHammerPullOrigin = false;
        this.hammerPullOrigin = null;
        this.hammerPullDestination = null;
        this.isSlurDestination = false;
        this.slurOrigin = null;
        this.slurDestination = null;
        this.harmonicType = HarmonicType.None;
        this.harmonicValue = 0;
        this.isGhost = false;
        this.isLetRing = false;
        this.letRingDestination = null;
        this.isPalmMute = false;
        this.palmMuteDestination = null;
        this.isDead = false;
        this.isStaccato = false;
        this.slideInType = SlideInType.None;
        this.slideOutType = SlideOutType.None;
        this.slideTarget = null;
        this.slideOrigin = null;
        this.vibrato = VibratoType.None;
        this.tieOrigin = null;
        this.tieDestination = null;
        this.isTieDestination = false;
        this.leftHandFinger = Fingers.Unknown;
        this.rightHandFinger = Fingers.Unknown;
        this.isFingering = false;
        this.trillValue = -1;
        this.trillSpeed = Duration.ThirtySecond;
        this.durationPercent = 1;
        this.accidentalMode = NoteAccidentalMode.Default;
        this.dynamics = DynamicValue.F;
        this.isEffectSlurOrigin = false;
        this.hasEffectSlur = false;
        this.effectSlurOrigin = null;
        this.effectSlurDestination = null;
        this._noteIdBag = null;
    }
    get hasBend() {
        return this.bendPoints !== null && this.bendType !== BendType.None;
    }
    get isStringed() {
        return this.string >= 0;
    }
    get isPiano() {
        return !this.isStringed && this.octave >= 0 && this.tone >= 0;
    }
    get isPercussion() {
        return !this.isStringed && this.percussionArticulation >= 0;
    }
    get element() {
        return this.isPercussion ? PercussionMapper.getElementAndVariation(this)[0] : -1;
    }
    get variation() {
        return this.isPercussion ? PercussionMapper.getElementAndVariation(this)[1] : -1;
    }
    get isHammerPullDestination() {
        return !!this.hammerPullOrigin;
    }
    get isSlurOrigin() {
        return !!this.slurDestination;
    }
    get isHarmonic() {
        return this.harmonicType !== HarmonicType.None;
    }
    get isTieOrigin() {
        return this.tieDestination !== null;
    }
    get trillFret() {
        return this.trillValue - this.stringTuning;
    }
    get isTrill() {
        return this.trillValue >= 0;
    }
    get isEffectSlurDestination() {
        return !!this.effectSlurOrigin;
    }
    get stringTuning() {
        return this.beat.voice.bar.staff.capo + Note.getStringTuning(this.beat.voice.bar.staff, this.string);
    }
    static getStringTuning(staff, noteString) {
        if (staff.tuning.length > 0) {
            return staff.tuning[staff.tuning.length - (noteString - 1) - 1];
        }
        return 0;
    }
    get realValue() {
        return this.calculateRealValue(true, true);
    }
    get realValueWithoutHarmonic() {
        return this.calculateRealValue(true, false);
    }
    calculateRealValue(applyTranspositionPitch, applyHarmonic) {
        const transpositionPitch = applyTranspositionPitch ? this.beat.voice.bar.staff.transpositionPitch : 0;
        if (applyHarmonic) {
            let realValue = this.calculateRealValue(applyTranspositionPitch, false);
            if (this.isStringed) {
                if (this.harmonicType === HarmonicType.Natural) {
                    realValue = this.harmonicPitch + this.stringTuning - transpositionPitch;
                }
                else {
                    realValue += this.harmonicPitch;
                }
            }
            return realValue;
        }
        else {
            if (this.isPercussion) {
                return this.percussionArticulation;
            }
            if (this.isStringed) {
                return this.fret + this.stringTuning - transpositionPitch;
            }
            if (this.isPiano) {
                return this.octave * 12 + this.tone - transpositionPitch;
            }
            return 0;
        }
    }
    get harmonicPitch() {
        if (this.harmonicType === HarmonicType.None || !this.isStringed) {
            return 0;
        }
        let value = this.harmonicValue;
        if (ModelUtils.isAlmostEqualTo(value, 2.4)) {
            return 36;
        }
        if (ModelUtils.isAlmostEqualTo(value, 2.7)) {
            return 34;
        }
        if (value < 3) {
            return 0;
        }
        if (value <= 3.5) {
            return 31;
        }
        if (value <= 4) {
            return 28;
        }
        if (value <= 5) {
            return 24;
        }
        if (value <= 6) {
            return 34;
        }
        if (value <= 7) {
            return 19;
        }
        if (value <= 8.5) {
            return 36;
        }
        if (value <= 9) {
            return 28;
        }
        if (value <= 10) {
            return 34;
        }
        if (value <= 11) {
            return 0;
        }
        if (value <= 12) {
            return 12;
        }
        if (value < 14) {
            return 0;
        }
        if (value <= 15) {
            return 34;
        }
        if (value <= 16) {
            return 28;
        }
        if (value <= 17) {
            return 36;
        }
        if (value <= 18) {
            return 0;
        }
        if (value <= 19) {
            return 19;
        }
        if (value <= 21) {
            return 0;
        }
        if (value <= 22) {
            return 36;
        }
        if (value <= 24) {
            return 24;
        }
        return 0;
    }
    get initialBendValue() {
        if (this.hasBend) {
            return Math.floor(this.bendPoints[0].value / 2);
        }
        else if (this.bendOrigin) {
            return Math.floor(this.bendOrigin.bendPoints[this.bendOrigin.bendPoints.length - 1].value / 2);
        }
        else if (this.isTieDestination && this.tieOrigin.bendOrigin) {
            return Math.floor(this.tieOrigin.bendOrigin.bendPoints[this.tieOrigin.bendOrigin.bendPoints.length - 1].value / 2);
        }
        else if (this.beat.hasWhammyBar) {
            return Math.floor(this.beat.whammyBarPoints[0].value / 2);
        }
        else if (this.beat.isContinuedWhammy) {
            return Math.floor(this.beat.previousBeat.whammyBarPoints[this.beat.previousBeat.whammyBarPoints.length - 1].value / 2);
        }
        return 0;
    }
    get displayValue() {
        return this.displayValueWithoutBend + this.initialBendValue;
    }
    get displayValueWithoutBend() {
        let noteValue = this.realValue;
        if (this.harmonicType !== HarmonicType.Natural && this.harmonicType !== HarmonicType.None) {
            noteValue -= this.harmonicPitch;
        }
        switch (this.beat.ottava) {
            case Ottavia._15ma:
                noteValue -= 24;
                break;
            case Ottavia._8va:
                noteValue -= 12;
                break;
            case Ottavia.Regular:
                break;
            case Ottavia._8vb:
                noteValue += 12;
                break;
            case Ottavia._15mb:
                noteValue += 24;
                break;
        }
        switch (this.beat.voice.bar.clefOttava) {
            case Ottavia._15ma:
                noteValue -= 24;
                break;
            case Ottavia._8va:
                noteValue -= 12;
                break;
            case Ottavia.Regular:
                break;
            case Ottavia._8vb:
                noteValue += 12;
                break;
            case Ottavia._15mb:
                noteValue += 24;
                break;
        }
        return noteValue - this.beat.voice.bar.staff.displayTranspositionPitch;
    }
    get hasQuarterToneOffset() {
        if (this.hasBend) {
            return this.bendPoints[0].value % 2 !== 0;
        }
        if (this.bendOrigin) {
            return this.bendOrigin.bendPoints[this.bendOrigin.bendPoints.length - 1].value % 2 !== 0;
        }
        if (this.beat.hasWhammyBar) {
            return this.beat.whammyBarPoints[0].value % 2 !== 0;
        }
        if (this.beat.isContinuedWhammy) {
            return (this.beat.previousBeat.whammyBarPoints[this.beat.previousBeat.whammyBarPoints.length - 1].value %
                2 !==
                0);
        }
        return false;
    }
    addBendPoint(point) {
        let points = this.bendPoints;
        if (points === null) {
            points = [];
            this.bendPoints = points;
        }
        points.push(point);
        if (!this.maxBendPoint || point.value > this.maxBendPoint.value) {
            this.maxBendPoint = point;
        }
        if (this.bendType === BendType.None) {
            this.bendType = BendType.Custom;
        }
    }
    finish(settings, sharedDataBag = null) {
        let nextNoteOnLine = new Lazy(() => Note.nextNoteOnSameLine(this));
        let isSongBook = settings && settings.notation.notationMode === NotationMode.SongBook;
        if (this.isTieDestination) {
            this.chain(sharedDataBag);
            if (isSongBook && this.tieOrigin && this.tieOrigin.isLetRing) {
                this.isLetRing = true;
            }
        }
        if (this.isLetRing) {
            if (!nextNoteOnLine.value || !nextNoteOnLine.value.isLetRing) {
                this.letRingDestination = this;
            }
            else {
                this.letRingDestination = nextNoteOnLine.value;
            }
            if (isSongBook && this.isTieDestination && !this.tieOrigin.hasBend) {
                this.isVisible = false;
            }
        }
        if (this.isPalmMute) {
            if (!nextNoteOnLine.value || !nextNoteOnLine.value.isPalmMute) {
                this.palmMuteDestination = this;
            }
            else {
                this.palmMuteDestination = nextNoteOnLine.value;
            }
        }
        if (this.isHammerPullOrigin) {
            let hammerPullDestination = Note.findHammerPullDestination(this);
            if (!hammerPullDestination) {
                this.isHammerPullOrigin = false;
            }
            else {
                this.hammerPullDestination = hammerPullDestination;
                hammerPullDestination.hammerPullOrigin = this;
            }
        }
        switch (this.slideOutType) {
            case SlideOutType.Shift:
            case SlideOutType.Legato:
                this.slideTarget = nextNoteOnLine.value;
                if (!this.slideTarget) {
                    this.slideOutType = SlideOutType.None;
                }
                else {
                    this.slideTarget.slideOrigin = this;
                }
                break;
        }
        let effectSlurDestination = null;
        if (this.isHammerPullOrigin && this.hammerPullDestination) {
            effectSlurDestination = this.hammerPullDestination;
        }
        else if (this.slideOutType === SlideOutType.Legato && this.slideTarget) {
            effectSlurDestination = this.slideTarget;
        }
        if (effectSlurDestination) {
            this.hasEffectSlur = true;
            if (this.effectSlurOrigin && this.beat.pickStroke === PickStroke.None) {
                this.effectSlurOrigin.effectSlurDestination = effectSlurDestination;
                this.effectSlurOrigin.effectSlurDestination.effectSlurOrigin = this.effectSlurOrigin;
                this.effectSlurOrigin = null;
            }
            else {
                this.isEffectSlurOrigin = true;
                this.effectSlurDestination = effectSlurDestination;
                this.effectSlurDestination.effectSlurOrigin = this;
            }
        }
        const points = this.bendPoints;
        if (points != null && points.length > 0 && this.bendType === BendType.Custom) {
            let isContinuedBend = this.isTieDestination && this.tieOrigin.hasBend;
            this.isContinuedBend = isContinuedBend;
            if (points.length === 4) {
                let origin = points[0];
                let middle1 = points[1];
                let middle2 = points[2];
                let destination = points[3];
                if (middle1.value === middle2.value) {
                    if (destination.value > origin.value) {
                        if (middle1.value > destination.value) {
                            this.bendType = BendType.BendRelease;
                        }
                        else if (!isContinuedBend && origin.value > 0) {
                            this.bendType = BendType.PrebendBend;
                            points.splice(2, 1);
                            points.splice(1, 1);
                        }
                        else {
                            this.bendType = BendType.Bend;
                            points.splice(2, 1);
                            points.splice(1, 1);
                        }
                    }
                    else if (destination.value < origin.value) {
                        if (isContinuedBend) {
                            this.bendType = BendType.Release;
                            points.splice(2, 1);
                            points.splice(1, 1);
                        }
                        else {
                            this.bendType = BendType.PrebendRelease;
                            points.splice(2, 1);
                            points.splice(1, 1);
                        }
                    }
                    else {
                        if (middle1.value > origin.value) {
                            this.bendType = BendType.BendRelease;
                        }
                        else if (origin.value > 0 && !isContinuedBend) {
                            this.bendType = BendType.Prebend;
                            points.splice(2, 1);
                            points.splice(1, 1);
                        }
                        else {
                            this.bendType = BendType.Hold;
                            points.splice(2, 1);
                            points.splice(1, 1);
                        }
                    }
                }
                else {
                    console.log('Model', 'Unsupported bend type detected, fallback to custom', null);
                }
            }
            else if (points.length === 2) {
                let origin = points[0];
                let destination = points[1];
                if (destination.value > origin.value) {
                    if (!isContinuedBend && origin.value > 0) {
                        this.bendType = BendType.PrebendBend;
                    }
                    else {
                        this.bendType = BendType.Bend;
                    }
                }
                else if (destination.value < origin.value) {
                    if (isContinuedBend) {
                        this.bendType = BendType.Release;
                    }
                    else {
                        this.bendType = BendType.PrebendRelease;
                    }
                }
                else {
                    this.bendType = BendType.Hold;
                }
            }
        }
        else if (points === null || points.length === 0) {
            this.bendType = BendType.None;
        }
        if (this.initialBendValue > 0) {
            this.accidentalMode = NoteAccidentalMode.Default;
        }
    }
    static nextNoteOnSameLine(note) {
        let nextBeat = note.beat.nextBeat;
        while (nextBeat && nextBeat.voice.bar.index <= note.beat.voice.bar.index + Note.MaxOffsetForSameLineSearch) {
            let noteOnString = nextBeat.getNoteOnString(note.string);
            if (noteOnString) {
                return noteOnString;
            }
            nextBeat = nextBeat.nextBeat;
        }
        return null;
    }
    static findHammerPullDestination(note) {
        let nextBeat = note.beat.nextBeat;
        while (nextBeat && nextBeat.voice.bar.index <= note.beat.voice.bar.index + Note.MaxOffsetForSameLineSearch) {
            let noteOnString = nextBeat.getNoteOnString(note.string);
            if (noteOnString) {
                return noteOnString;
            }
            for (let str = note.string; str > 0; str--) {
                noteOnString = nextBeat.getNoteOnString(str);
                if (noteOnString) {
                    if (noteOnString.isLeftHandTapped) {
                        return noteOnString;
                    }
                    else {
                        break;
                    }
                }
            }
            for (let str = note.string; str <= note.beat.voice.bar.staff.tuning.length; str++) {
                noteOnString = nextBeat.getNoteOnString(str);
                if (noteOnString) {
                    if (noteOnString.isLeftHandTapped) {
                        return noteOnString;
                    }
                    else {
                        break;
                    }
                }
            }
            nextBeat = nextBeat.nextBeat;
        }
        return null;
    }
    static findTieOrigin(note) {
        let previousBeat = note.beat.previousBeat;
        while (previousBeat &&
            previousBeat.voice.bar.index >= note.beat.voice.bar.index - Note.MaxOffsetForSameLineSearch) {
            if (note.isStringed) {
                let noteOnString = previousBeat.getNoteOnString(note.string);
                if (noteOnString) {
                    return noteOnString;
                }
            }
            else {
                if (note.octave === -1 && note.tone === -1) {
                    if (note.index < previousBeat.notes.length) {
                        return previousBeat.notes[note.index];
                    }
                }
                else {
                    let noteWithValue = previousBeat.getNoteWithRealValue(note.realValue);
                    if (noteWithValue) {
                        return noteWithValue;
                    }
                }
            }
            previousBeat = previousBeat.previousBeat;
        }
        return null;
    }
    chain(sharedDataBag = null) {
        var _a;
        if (sharedDataBag === null) {
            return;
        }
        if (this._noteIdBag !== null) {
            let noteIdLookup;
            if (sharedDataBag.has(Note.NoteIdLookupKey)) {
                noteIdLookup = sharedDataBag.get(Note.NoteIdLookupKey);
            }
            else {
                noteIdLookup = new Map();
                sharedDataBag.set(Note.NoteIdLookupKey, noteIdLookup);
            }
            if (this._noteIdBag.hammerPullDestinationNoteId !== -1 ||
                this._noteIdBag.tieDestinationNoteId !== -1 ||
                this._noteIdBag.slurDestinationNoteId !== -1) {
                noteIdLookup.set(this.id, this);
            }
            if (this._noteIdBag.hammerPullOriginNoteId !== -1) {
                this.hammerPullOrigin = noteIdLookup.get(this._noteIdBag.hammerPullOriginNoteId);
                this.hammerPullOrigin.hammerPullDestination = this;
            }
            if (this._noteIdBag.tieOriginNoteId !== -1) {
                this.tieOrigin = noteIdLookup.get(this._noteIdBag.tieOriginNoteId);
                this.tieOrigin.tieDestination = this;
            }
            if (this._noteIdBag.slurOriginNoteId !== -1) {
                this.slurOrigin = noteIdLookup.get(this._noteIdBag.slurOriginNoteId);
                this.slurOrigin.slurDestination = this;
            }
            this._noteIdBag = null;
        }
        else {
            if (!this.isTieDestination && this.tieOrigin === null) {
                return;
            }
            let tieOrigin = (_a = this.tieOrigin) !== null && _a !== void 0 ? _a : Note.findTieOrigin(this);
            if (!tieOrigin) {
                this.isTieDestination = false;
            }
            else {
                tieOrigin.tieDestination = this;
                this.tieOrigin = tieOrigin;
                this.fret = tieOrigin.fret;
                this.octave = tieOrigin.octave;
                this.tone = tieOrigin.tone;
                if (tieOrigin.hasBend) {
                    this.bendOrigin = this.tieOrigin;
                }
            }
        }
    }
    toJson(o) {
        if (this.tieDestination !== null) {
            o.set('tiedestinationnoteid', this.tieDestination.id);
        }
        if (this.tieOrigin !== null) {
            o.set('tieoriginnoteid', this.tieOrigin.id);
        }
        if (this.slurDestination !== null) {
            o.set('slurdestinationnoteid', this.slurDestination.id);
        }
        if (this.slurOrigin !== null) {
            o.set('sluroriginnoteid', this.slurOrigin.id);
        }
        if (this.hammerPullOrigin !== null) {
            o.set('hammerpulloriginnoteid', this.hammerPullOrigin.id);
        }
        if (this.hammerPullDestination !== null) {
            o.set('hammerpulldestinationnoteid', this.hammerPullDestination.id);
        }
    }
    setProperty(property, v) {
        switch (property) {
            case "tiedestinationnoteid":
                if (this._noteIdBag == null) {
                    this._noteIdBag = new NoteIdBag();
                }
                this._noteIdBag.tieDestinationNoteId = v;
                return true;
            case "tieoriginnoteid":
                if (this._noteIdBag == null) {
                    this._noteIdBag = new NoteIdBag();
                }
                this._noteIdBag.tieOriginNoteId = v;
                return true;
            case "slurdestinationnoteid":
                if (this._noteIdBag == null) {
                    this._noteIdBag = new NoteIdBag();
                }
                this._noteIdBag.slurDestinationNoteId = v;
                return true;
            case "sluroriginnoteid":
                if (this._noteIdBag == null) {
                    this._noteIdBag = new NoteIdBag();
                }
                this._noteIdBag.slurOriginNoteId = v;
                return true;
            case "hammerpulloriginnoteid":
                if (this._noteIdBag == null) {
                    this._noteIdBag = new NoteIdBag();
                }
                this._noteIdBag.hammerPullOriginNoteId = v;
                return true;
            case "hammerpulldestinationnoteid":
                if (this._noteIdBag == null) {
                    this._noteIdBag = new NoteIdBag();
                }
                this._noteIdBag.hammerPullDestinationNoteId = v;
                return true;
        }
        return false;
    }
}
Note.GlobalNoteId = 0;
Note.MaxOffsetForSameLineSearch = 3;
Note.NoteIdLookupKey = 'NoteIdLookup';
var NoteAccidentalMode;
(function (NoteAccidentalMode) {
    NoteAccidentalMode[NoteAccidentalMode["Default"] = 0] = "Default";
    NoteAccidentalMode[NoteAccidentalMode["ForceNone"] = 1] = "ForceNone";
    NoteAccidentalMode[NoteAccidentalMode["ForceNatural"] = 2] = "ForceNatural";
    NoteAccidentalMode[NoteAccidentalMode["ForceSharp"] = 3] = "ForceSharp";
    NoteAccidentalMode[NoteAccidentalMode["ForceDoubleSharp"] = 4] = "ForceDoubleSharp";
    NoteAccidentalMode[NoteAccidentalMode["ForceFlat"] = 5] = "ForceFlat";
    NoteAccidentalMode[NoteAccidentalMode["ForceDoubleFlat"] = 6] = "ForceDoubleFlat";
})(NoteAccidentalMode || (NoteAccidentalMode = {}));
var HarmonicType;
(function (HarmonicType) {
    HarmonicType[HarmonicType["None"] = 0] = "None";
    HarmonicType[HarmonicType["Natural"] = 1] = "Natural";
    HarmonicType[HarmonicType["Artificial"] = 2] = "Artificial";
    HarmonicType[HarmonicType["Pinch"] = 3] = "Pinch";
    HarmonicType[HarmonicType["Tap"] = 4] = "Tap";
    HarmonicType[HarmonicType["Semi"] = 5] = "Semi";
    HarmonicType[HarmonicType["Feedback"] = 6] = "Feedback";
})(HarmonicType || (HarmonicType = {}));
var WhammyType;
(function (WhammyType) {
    WhammyType[WhammyType["None"] = 0] = "None";
    WhammyType[WhammyType["Custom"] = 1] = "Custom";
    WhammyType[WhammyType["Dive"] = 2] = "Dive";
    WhammyType[WhammyType["Dip"] = 3] = "Dip";
    WhammyType[WhammyType["Hold"] = 4] = "Hold";
    WhammyType[WhammyType["Predive"] = 5] = "Predive";
    WhammyType[WhammyType["PrediveDive"] = 6] = "PrediveDive";
})(WhammyType || (WhammyType = {}));
var TripletFeel;
(function (TripletFeel) {
    TripletFeel[TripletFeel["NoTripletFeel"] = 0] = "NoTripletFeel";
    TripletFeel[TripletFeel["Triplet16th"] = 1] = "Triplet16th";
    TripletFeel[TripletFeel["Triplet8th"] = 2] = "Triplet8th";
    TripletFeel[TripletFeel["Dotted16th"] = 3] = "Dotted16th";
    TripletFeel[TripletFeel["Dotted8th"] = 4] = "Dotted8th";
    TripletFeel[TripletFeel["Scottish16th"] = 5] = "Scottish16th";
    TripletFeel[TripletFeel["Scottish8th"] = 6] = "Scottish8th";
})(TripletFeel || (TripletFeel = {}));
class Tuning {
    constructor(name = '', tuning = null, isStandard = false) {
        this.isStandard = isStandard;
        this.name = name;
        this.tunings = tuning !== null && tuning !== void 0 ? tuning : [];
    }
    static getTextForTuning(tuning, includeOctave) {
        let parts = Tuning.getTextPartsForTuning(tuning);
        return includeOctave ? parts.join('') : parts[0];
    }
    static getTextPartsForTuning(tuning, octaveShift = -1) {
        let octave = (tuning / 12) | 0;
        let note = tuning % 12;
        let notes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
        return [notes[note], (octave + octaveShift).toString()];
    }
    static getDefaultTuningFor(stringCount) {
        if (Tuning._defaultTunings.has(stringCount)) {
            return Tuning._defaultTunings.get(stringCount);
        }
        return null;
    }
    static getPresetsFor(stringCount) {
        switch (stringCount) {
            case 7:
                return Tuning._sevenStrings;
            case 6:
                return Tuning._sixStrings;
            case 5:
                return Tuning._fiveStrings;
            case 4:
                return Tuning._fourStrings;
        }
        return [];
    }
    static initialize() {
        Tuning._defaultTunings.set(7, new Tuning('Guitar 7 strings', [64, 59, 55, 50, 45, 40, 35], true));
        Tuning._sevenStrings.push(Tuning._defaultTunings.get(7));
        Tuning._defaultTunings.set(6, new Tuning('Guitar Standard Tuning', [64, 59, 55, 50, 45, 40], true));
        Tuning._sixStrings.push(Tuning._defaultTunings.get(6));
        Tuning._sixStrings.push(new Tuning('Guitar Tune down ½ step', [63, 58, 54, 49, 44, 39], false));
        Tuning._sixStrings.push(new Tuning('Guitar Tune down 1 step', [62, 57, 53, 48, 43, 38], false));
        Tuning._sixStrings.push(new Tuning('Guitar Tune down 2 step', [60, 55, 51, 46, 41, 36], false));
        Tuning._sixStrings.push(new Tuning('Guitar Dropped D Tuning', [64, 59, 55, 50, 45, 38], false));
        Tuning._sixStrings.push(new Tuning('Guitar Dropped D Tuning variant', [64, 57, 55, 50, 45, 38], false));
        Tuning._sixStrings.push(new Tuning('Guitar Double Dropped D Tuning', [62, 59, 55, 50, 45, 38], false));
        Tuning._sixStrings.push(new Tuning('Guitar Dropped E Tuning', [66, 61, 57, 52, 47, 40], false));
        Tuning._sixStrings.push(new Tuning('Guitar Dropped C Tuning', [62, 57, 53, 48, 43, 36], false));
        Tuning._sixStrings.push(new Tuning('Guitar Open C Tuning', [64, 60, 55, 48, 43, 36], false));
        Tuning._sixStrings.push(new Tuning('Guitar Open Cm Tuning', [63, 60, 55, 48, 43, 36], false));
        Tuning._sixStrings.push(new Tuning('Guitar Open C6 Tuning', [64, 57, 55, 48, 43, 36], false));
        Tuning._sixStrings.push(new Tuning('Guitar Open Cmaj7 Tuning', [64, 59, 55, 52, 43, 36], false));
        Tuning._sixStrings.push(new Tuning('Guitar Open D Tuning', [62, 57, 54, 50, 45, 38], false));
        Tuning._sixStrings.push(new Tuning('Guitar Open Dm Tuning', [62, 57, 53, 50, 45, 38], false));
        Tuning._sixStrings.push(new Tuning('Guitar Open D5 Tuning', [62, 57, 50, 50, 45, 38], false));
        Tuning._sixStrings.push(new Tuning('Guitar Open D6 Tuning', [62, 59, 54, 50, 45, 38], false));
        Tuning._sixStrings.push(new Tuning('Guitar Open Dsus4 Tuning', [62, 57, 55, 50, 45, 38], false));
        Tuning._sixStrings.push(new Tuning('Guitar Open E Tuning', [64, 59, 56, 52, 47, 40], false));
        Tuning._sixStrings.push(new Tuning('Guitar Open Em Tuning', [64, 59, 55, 52, 47, 40], false));
        Tuning._sixStrings.push(new Tuning('Guitar Open Esus11 Tuning', [64, 59, 55, 52, 45, 40], false));
        Tuning._sixStrings.push(new Tuning('Guitar Open F Tuning', [65, 60, 53, 48, 45, 41], false));
        Tuning._sixStrings.push(new Tuning('Guitar Open G Tuning', [62, 59, 55, 50, 43, 38], false));
        Tuning._sixStrings.push(new Tuning('Guitar Open Gm Tuning', [62, 58, 55, 50, 43, 38], false));
        Tuning._sixStrings.push(new Tuning('Guitar Open G6 Tuning', [64, 59, 55, 50, 43, 38], false));
        Tuning._sixStrings.push(new Tuning('Guitar Open Gsus4 Tuning', [62, 60, 55, 50, 43, 38], false));
        Tuning._sixStrings.push(new Tuning('Guitar Open A Tuning', [64, 61, 57, 52, 45, 40], false));
        Tuning._sixStrings.push(new Tuning('Guitar Open Am Tuning', [64, 60, 57, 52, 45, 40], false));
        Tuning._sixStrings.push(new Tuning('Guitar Nashville Tuning', [64, 59, 67, 62, 57, 52], false));
        Tuning._sixStrings.push(new Tuning('Bass 6 Strings Tuning', [48, 43, 38, 33, 28, 23], false));
        Tuning._sixStrings.push(new Tuning('Lute or Vihuela Tuning', [64, 59, 54, 50, 45, 40], false));
        Tuning._defaultTunings.set(5, new Tuning('Bass 5 Strings Tuning', [43, 38, 33, 28, 23], true));
        Tuning._fiveStrings.push(Tuning._defaultTunings.get(5));
        Tuning._fiveStrings.push(new Tuning('Banjo Dropped C Tuning', [62, 59, 55, 48, 67], false));
        Tuning._fiveStrings.push(new Tuning('Banjo Open D Tuning', [62, 57, 54, 50, 69], false));
        Tuning._fiveStrings.push(new Tuning('Banjo Open G Tuning', [62, 59, 55, 50, 67], false));
        Tuning._fiveStrings.push(new Tuning('Banjo G Minor Tuning', [62, 58, 55, 50, 67], false));
        Tuning._fiveStrings.push(new Tuning('Banjo G Modal Tuning', [62, 57, 55, 50, 67], false));
        Tuning._defaultTunings.set(4, new Tuning('Bass Standard Tuning', [43, 38, 33, 28], true));
        Tuning._fourStrings.push(Tuning._defaultTunings.get(4));
        Tuning._fourStrings.push(new Tuning('Bass Tune down ½ step', [42, 37, 32, 27], false));
        Tuning._fourStrings.push(new Tuning('Bass Tune down 1 step', [41, 36, 31, 26], false));
        Tuning._fourStrings.push(new Tuning('Bass Tune down 2 step', [39, 34, 29, 24], false));
        Tuning._fourStrings.push(new Tuning('Bass Dropped D Tuning', [43, 38, 33, 26], false));
        Tuning._fourStrings.push(new Tuning('Ukulele C Tuning', [45, 40, 36, 43], false));
        Tuning._fourStrings.push(new Tuning('Ukulele G Tuning', [52, 47, 43, 38], false));
        Tuning._fourStrings.push(new Tuning('Mandolin Standard Tuning', [64, 57, 50, 43], false));
        Tuning._fourStrings.push(new Tuning('Mandolin or Violin Tuning', [76, 69, 62, 55], false));
        Tuning._fourStrings.push(new Tuning('Viola Tuning', [69, 62, 55, 48], false));
        Tuning._fourStrings.push(new Tuning('Cello Tuning', [57, 50, 43, 36], false));
    }
    static findTuning(strings) {
        let tunings = Tuning.getPresetsFor(strings.length);
        for (let t = 0, tc = tunings.length; t < tc; t++) {
            let tuning = tunings[t];
            let equals = true;
            for (let i = 0, j = strings.length; i < j; i++) {
                if (strings[i] !== tuning.tunings[i]) {
                    equals = false;
                    break;
                }
            }
            if (equals) {
                return tuning;
            }
        }
        return null;
    }
    finish() {
        const knownTuning = Tuning.findTuning(this.tunings);
        if (knownTuning) {
            this.name = knownTuning.name;
            this.isStandard = knownTuning.isStandard;
        }
        this.name = this.name.trim();
    }
}
Tuning._sevenStrings = [];
Tuning._sixStrings = [];
Tuning._fiveStrings = [];
Tuning._fourStrings = [];
Tuning._defaultTunings = new Map();
Tuning.defaultAccidentals = ['', '#', '', '#', '', '', '#', '', '#', '', '#', ''];
Tuning.defaultSteps = ['C', 'C', 'D', 'D', 'E', 'F', 'F', 'G', 'G', 'A', 'A', 'B'];
Tuning.initialize();
class TupletGroup {
    constructor(voice) {
        this._isEqualLengthTuplet = true;
        this.totalDuration = 0;
        this.beats = [];
        this.isFull = false;
        this.voice = voice;
    }
    check(beat) {
        if (this.beats.length === 0) {
            this.beats.push(beat);
            this.totalDuration += beat.playbackDuration;
            return true;
        }
        if (beat.graceType !== GraceType.None) {
            return true;
        }
        if (beat.voice !== this.voice ||
            this.isFull ||
            beat.tupletNumerator !== this.beats[0].tupletNumerator ||
            beat.tupletDenominator !== this.beats[0].tupletDenominator) {
            return false;
        }
        if (beat.playbackDuration !== this.beats[0].playbackDuration) {
            this._isEqualLengthTuplet = false;
        }
        this.beats.push(beat);
        this.totalDuration += beat.playbackDuration;
        if (this._isEqualLengthTuplet) {
            if (this.beats.length === this.beats[0].tupletNumerator) {
                this.isFull = true;
            }
        }
        else {
            let factor = (this.beats[0].tupletNumerator / this.beats[0].tupletDenominator) | 0;
            for (let potentialMatch of TupletGroup.AllTicks) {
                if (this.totalDuration === potentialMatch * factor) {
                    this.isFull = true;
                    break;
                }
            }
        }
        return true;
    }
}
TupletGroup.HalfTicks = 1920;
TupletGroup.QuarterTicks = 960;
TupletGroup.EighthTicks = 480;
TupletGroup.SixteenthTicks = 240;
TupletGroup.ThirtySecondTicks = 120;
TupletGroup.SixtyFourthTicks = 60;
TupletGroup.OneHundredTwentyEighthTicks = 30;
TupletGroup.TwoHundredFiftySixthTicks = 15;
TupletGroup.AllTicks = [
    TupletGroup.HalfTicks,
    TupletGroup.QuarterTicks,
    TupletGroup.EighthTicks,
    TupletGroup.SixteenthTicks,
    TupletGroup.ThirtySecondTicks,
    TupletGroup.SixtyFourthTicks,
    TupletGroup.OneHundredTwentyEighthTicks,
    TupletGroup.TwoHundredFiftySixthTicks
];
var VibratoType;
(function (VibratoType) {
    VibratoType[VibratoType["None"] = 0] = "None";
    VibratoType[VibratoType["Slight"] = 1] = "Slight";
    VibratoType[VibratoType["Wide"] = 2] = "Wide";
})(VibratoType || (VibratoType = {}));
var SlideOutType;
(function (SlideOutType) {
    SlideOutType[SlideOutType["None"] = 0] = "None";
    SlideOutType[SlideOutType["Shift"] = 1] = "Shift";
    SlideOutType[SlideOutType["Legato"] = 2] = "Legato";
    SlideOutType[SlideOutType["OutUp"] = 3] = "OutUp";
    SlideOutType[SlideOutType["OutDown"] = 4] = "OutDown";
    SlideOutType[SlideOutType["PickSlideDown"] = 5] = "PickSlideDown";
    SlideOutType[SlideOutType["PickSlideUp"] = 6] = "PickSlideUp";
})(SlideOutType || (SlideOutType = {}));
var SlideInType;
(function (SlideInType) {
    SlideInType[SlideInType["None"] = 0] = "None";
    SlideInType[SlideInType["IntoFromBelow"] = 1] = "IntoFromBelow";
    SlideInType[SlideInType["IntoFromAbove"] = 2] = "IntoFromAbove";
})(SlideInType || (SlideInType = {}));
var PickStroke;
(function (PickStroke) {
    PickStroke[PickStroke["None"] = 0] = "None";
    PickStroke[PickStroke["Up"] = 1] = "Up";
    PickStroke[PickStroke["Down"] = 2] = "Down";
})(PickStroke || (PickStroke = {}));
class GraceGroup {
    constructor() {
        this.beats = [];
        this.id = 'empty';
        this.isComplete = false;
    }
    addBeat(beat) {
        beat.graceIndex = this.beats.length;
        beat.graceGroup = this;
        this.beats.push(beat);
    }
    finish() {
        if (this.beats.length > 0) {
            this.id = this.beats[0].absoluteDisplayStart + '_' + this.beats[0].voice.index;
        }
    }
}
var GraceType;
(function (GraceType) {
    GraceType[GraceType["None"] = 0] = "None";
    GraceType[GraceType["OnBeat"] = 1] = "OnBeat";
    GraceType[GraceType["BeforeBeat"] = 2] = "BeforeBeat";
    GraceType[GraceType["BendGrace"] = 3] = "BendGrace";
})(GraceType || (GraceType = {}));
var Fingers;
(function (Fingers) {
    Fingers[Fingers["Unknown"] = -2] = "Unknown";
    Fingers[Fingers["NoOrDead"] = -1] = "NoOrDead";
    Fingers[Fingers["Thumb"] = 0] = "Thumb";
    Fingers[Fingers["IndexFinger"] = 1] = "IndexFinger";
    Fingers[Fingers["MiddleFinger"] = 2] = "MiddleFinger";
    Fingers[Fingers["AnnularFinger"] = 3] = "AnnularFinger";
    Fingers[Fingers["LittleFinger"] = 4] = "LittleFinger";
})(Fingers || (Fingers = {}));
var CrescendoType;
(function (CrescendoType) {
    CrescendoType[CrescendoType["None"] = 0] = "None";
    CrescendoType[CrescendoType["Crescendo"] = 1] = "Crescendo";
    CrescendoType[CrescendoType["Decrescendo"] = 2] = "Decrescendo";
})(CrescendoType || (CrescendoType = {}));
var DynamicValue;
(function (DynamicValue) {
    DynamicValue[DynamicValue["PPP"] = 0] = "PPP";
    DynamicValue[DynamicValue["PP"] = 1] = "PP";
    DynamicValue[DynamicValue["P"] = 2] = "P";
    DynamicValue[DynamicValue["MP"] = 3] = "MP";
    DynamicValue[DynamicValue["MF"] = 4] = "MF";
    DynamicValue[DynamicValue["F"] = 5] = "F";
    DynamicValue[DynamicValue["FF"] = 6] = "FF";
    DynamicValue[DynamicValue["FFF"] = 7] = "FFF";
})(DynamicValue || (DynamicValue = {}));
var LyricsState;
(function (LyricsState) {
    LyricsState[LyricsState["IgnoreSpaces"] = 0] = "IgnoreSpaces";
    LyricsState[LyricsState["Begin"] = 1] = "Begin";
    LyricsState[LyricsState["Text"] = 2] = "Text";
    LyricsState[LyricsState["Comment"] = 3] = "Comment";
    LyricsState[LyricsState["Dash"] = 4] = "Dash";
})(LyricsState || (LyricsState = {}));
class Lyrics {
    constructor() {
        this.startBar = 0;
        this.text = '';
    }
    finish(skipEmptyEntries = false) {
        this.chunks = [];
        this.parse(this.text, 0, this.chunks, skipEmptyEntries);
    }
    parse(str, p, chunks, skipEmptyEntries) {
        if (!str) {
            return;
        }
        let state = LyricsState.Begin;
        let next = LyricsState.Begin;
        let skipSpace = false;
        let start = 0;
        while (p < str.length) {
            let c = str.charCodeAt(p);
            switch (state) {
                case LyricsState.IgnoreSpaces:
                    switch (c) {
                        case Lyrics.CharCodeLF:
                        case Lyrics.CharCodeCR:
                        case Lyrics.CharCodeTab:
                            break;
                        case Lyrics.CharCodeSpace:
                            if (!skipSpace) {
                                state = next;
                                continue;
                            }
                            break;
                        default:
                            skipSpace = false;
                            state = next;
                            continue;
                    }
                    break;
                case LyricsState.Begin:
                    switch (c) {
                        case Lyrics.CharCodeBrackedOpen:
                            state = LyricsState.Comment;
                            break;
                        default:
                            start = p;
                            state = LyricsState.Text;
                            continue;
                    }
                    break;
                case LyricsState.Comment:
                    switch (c) {
                        case Lyrics.CharCodeBrackedClose:
                            state = LyricsState.Begin;
                            break;
                    }
                    break;
                case LyricsState.Text:
                    switch (c) {
                        case Lyrics.CharCodeDash:
                            state = LyricsState.Dash;
                            break;
                        case Lyrics.CharCodeCR:
                        case Lyrics.CharCodeLF:
                        case Lyrics.CharCodeSpace:
                            let txt = str.substr(start, p - start);
                            this.addChunk(txt, skipEmptyEntries);
                            state = LyricsState.IgnoreSpaces;
                            next = LyricsState.Begin;
                            break;
                    }
                    break;
                case LyricsState.Dash:
                    switch (c) {
                        case Lyrics.CharCodeDash:
                            break;
                        default:
                            let txt = str.substr(start, p - start);
                            this.addChunk(txt, skipEmptyEntries);
                            skipSpace = true;
                            state = LyricsState.IgnoreSpaces;
                            next = LyricsState.Begin;
                            continue;
                    }
                    break;
            }
            p += 1;
        }
        if (state === LyricsState.Text) {
            if (p !== start) {
                this.addChunk(str.substr(start, p - start), skipEmptyEntries);
            }
        }
    }
    addChunk(txt, skipEmptyEntries) {
        txt = this.prepareChunk(txt);
        if (!skipEmptyEntries || (txt.length > 0 && txt !== '-')) {
            this.chunks.push(txt);
        }
    }
    prepareChunk(txt) {
        let chunk = txt.split('+').join(' ');
        let endLength = chunk.length;
        while (endLength > 0 && chunk.charAt(endLength - 1) === '_') {
            endLength--;
        }
        return endLength !== chunk.length ? chunk.substr(0, endLength) : chunk;
    }
}
Lyrics.CharCodeLF = 10;
Lyrics.CharCodeTab = 9;
Lyrics.CharCodeCR = 13;
Lyrics.CharCodeSpace = 32;
Lyrics.CharCodeBrackedClose = 93;
Lyrics.CharCodeBrackedOpen = 91;
Lyrics.CharCodeDash = 45;
class PlaybackInformation {
    constructor() {
        this.volume = 15;
        this.balance = 8;
        this.port = 1;
        this.program = 0;
        this.primaryChannel = 0;
        this.secondaryChannel = 0;
        this.isMute = false;
        this.isSolo = false;
    }
}
class InstrumentArticulation {
    constructor(elementType = "", staffLine = 0, outputMidiNumber = 0, noteHeadDefault = MusicFontSymbol.None, noteHeadHalf = MusicFontSymbol.None, noteHeadWhole = MusicFontSymbol.None, techniqueSymbol = MusicFontSymbol.None, techniqueSymbolPlacement = TextBaseline.Middle) {
        this.elementType = elementType;
        this.outputMidiNumber = outputMidiNumber;
        this.staffLine = staffLine;
        this.noteHeadDefault = noteHeadDefault;
        this.noteHeadHalf = noteHeadHalf !== MusicFontSymbol.None ? noteHeadHalf : noteHeadDefault;
        this.noteHeadWhole = noteHeadWhole !== MusicFontSymbol.None ? noteHeadWhole : noteHeadDefault;
        this.techniqueSymbol = techniqueSymbol;
        this.techniqueSymbolPlacement = techniqueSymbolPlacement;
    }
    getSymbol(duration) {
        switch (duration) {
            case Duration.Whole:
                return this.noteHeadWhole;
            case Duration.Half:
                return this.noteHeadHalf;
            default:
                return this.noteHeadDefault;
        }
    }
}
class PercussionMapper {
    static articulationFromElementVariation(element, variation) {
        if (element < PercussionMapper.gp6ElementAndVariationToArticulation.length) {
            if (variation >= PercussionMapper.gp6ElementAndVariationToArticulation.length) {
                variation = 0;
            }
            return PercussionMapper.gp6ElementAndVariationToArticulation[element][variation];
        }
        return 38;
    }
    static getArticulation(n) {
        const articulationIndex = n.percussionArticulation;
        const trackArticulations = n.beat.voice.bar.staff.track.percussionArticulations;
        if (articulationIndex < trackArticulations.length) {
            return trackArticulations[articulationIndex];
        }
        return PercussionMapper.getArticulationByValue(articulationIndex);
        ;
    }
    static getElementAndVariation(n) {
        const articulation = PercussionMapper.getArticulation(n);
        if (!articulation) {
            return [-1, -1];
        }
        for (let element = 0; element < PercussionMapper.gp6ElementAndVariationToArticulation.length; element++) {
            const variations = PercussionMapper.gp6ElementAndVariationToArticulation[element];
            for (let variation = 0; variation < variations.length; variation++) {
                const gp6Articulation = PercussionMapper.getArticulationByValue(variations[variation]);
                if ((gp6Articulation === null || gp6Articulation === void 0 ? void 0 : gp6Articulation.outputMidiNumber) === articulation.outputMidiNumber) {
                    return [element, variation];
                }
            }
        }
        return [-1, -1];
    }
    static getArticulationByValue(midiNumber) {
        if (PercussionMapper.instrumentArticulations.has(midiNumber)) {
            return PercussionMapper.instrumentArticulations.get(midiNumber);
        }
        return null;
    }
}
PercussionMapper.gp6ElementAndVariationToArticulation = [
    [35, 35, 35],
    [38, 91, 37],
    [99, 100, 99],
    [56, 100, 56],
    [102, 103, 102],
    [43, 43, 43],
    [45, 45, 45],
    [47, 47, 47],
    [48, 48, 48],
    [50, 50, 50],
    [42, 92, 46],
    [44, 44, 44],
    [57, 98, 57],
    [49, 97, 49],
    [55, 95, 55],
    [51, 93, 127],
    [52, 96, 52],
];
PercussionMapper.instrumentArticulations = new Map([
    [38, new InstrumentArticulation("snare", 3, 38, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [37, new InstrumentArticulation("snare", 3, 37, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack)],
    [91, new InstrumentArticulation("snare", 3, 38, MusicFontSymbol.NoteheadDiamondWhite, MusicFontSymbol.NoteheadDiamondWhite, MusicFontSymbol.NoteheadDiamondWhite)],
    [42, new InstrumentArticulation("hiHat", -1, 42, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack)],
    [92, new InstrumentArticulation("hiHat", -1, 46, MusicFontSymbol.NoteheadCircleSlash, MusicFontSymbol.NoteheadCircleSlash, MusicFontSymbol.NoteheadCircleSlash)],
    [46, new InstrumentArticulation("hiHat", -1, 46, MusicFontSymbol.NoteheadCircleX, MusicFontSymbol.NoteheadCircleX, MusicFontSymbol.NoteheadCircleX)],
    [44, new InstrumentArticulation("hiHat", 9, 44, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack)],
    [35, new InstrumentArticulation("kickDrum", 8, 35, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [36, new InstrumentArticulation("kickDrum", 7, 36, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [50, new InstrumentArticulation("tom", 1, 50, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [48, new InstrumentArticulation("tom", 2, 48, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [47, new InstrumentArticulation("tom", 4, 47, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [45, new InstrumentArticulation("tom", 5, 45, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [43, new InstrumentArticulation("tom", 6, 43, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [93, new InstrumentArticulation("ride", 0, 51, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.PictEdgeOfCymbal, TextBaseline.Bottom)],
    [51, new InstrumentArticulation("ride", 0, 51, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack)],
    [53, new InstrumentArticulation("ride", 0, 53, MusicFontSymbol.NoteheadDiamondWhite, MusicFontSymbol.NoteheadDiamondWhite, MusicFontSymbol.NoteheadDiamondWhite)],
    [94, new InstrumentArticulation("ride", 0, 51, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.ArticStaccatoAbove, TextBaseline.Top)],
    [55, new InstrumentArticulation("splash", -2, 55, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack)],
    [95, new InstrumentArticulation("splash", -2, 55, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.ArticStaccatoAbove, TextBaseline.Bottom)],
    [52, new InstrumentArticulation("china", -3, 52, MusicFontSymbol.NoteheadHeavyXHat, MusicFontSymbol.NoteheadHeavyXHat, MusicFontSymbol.NoteheadHeavyXHat)],
    [96, new InstrumentArticulation("china", -3, 52, MusicFontSymbol.NoteheadHeavyXHat, MusicFontSymbol.NoteheadHeavyXHat, MusicFontSymbol.NoteheadHeavyXHat)],
    [49, new InstrumentArticulation("crash", -2, 49, MusicFontSymbol.NoteheadHeavyX, MusicFontSymbol.NoteheadHeavyX, MusicFontSymbol.NoteheadHeavyX)],
    [97, new InstrumentArticulation("crash", -2, 49, MusicFontSymbol.NoteheadHeavyX, MusicFontSymbol.NoteheadHeavyX, MusicFontSymbol.NoteheadHeavyX, MusicFontSymbol.ArticStaccatoAbove, TextBaseline.Bottom)],
    [57, new InstrumentArticulation("crash", -1, 57, MusicFontSymbol.NoteheadHeavyX, MusicFontSymbol.NoteheadHeavyX, MusicFontSymbol.NoteheadHeavyX)],
    [98, new InstrumentArticulation("crash", -1, 57, MusicFontSymbol.NoteheadHeavyX, MusicFontSymbol.NoteheadHeavyX, MusicFontSymbol.NoteheadHeavyX, MusicFontSymbol.ArticStaccatoAbove, TextBaseline.Bottom)],
    [99, new InstrumentArticulation("cowbell", 1, 56, MusicFontSymbol.NoteheadTriangleUpBlack, MusicFontSymbol.NoteheadTriangleUpHalf, MusicFontSymbol.NoteheadTriangleUpWhole)],
    [100, new InstrumentArticulation("cowbell", 1, 56, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXHalf, MusicFontSymbol.NoteheadXWhole)],
    [56, new InstrumentArticulation("cowbell", 0, 56, MusicFontSymbol.NoteheadTriangleUpBlack, MusicFontSymbol.NoteheadTriangleUpHalf, MusicFontSymbol.NoteheadTriangleUpWhole)],
    [101, new InstrumentArticulation("cowbell", 0, 56, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXHalf, MusicFontSymbol.NoteheadXWhole)],
    [102, new InstrumentArticulation("cowbell", -1, 56, MusicFontSymbol.NoteheadTriangleUpBlack, MusicFontSymbol.NoteheadTriangleUpHalf, MusicFontSymbol.NoteheadTriangleUpWhole)],
    [103, new InstrumentArticulation("cowbell", -1, 56, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXHalf, MusicFontSymbol.NoteheadXWhole)],
    [77, new InstrumentArticulation("woodblock", -9, 77, MusicFontSymbol.NoteheadTriangleUpBlack, MusicFontSymbol.NoteheadTriangleUpBlack, MusicFontSymbol.NoteheadTriangleUpBlack)],
    [76, new InstrumentArticulation("woodblock", -10, 76, MusicFontSymbol.NoteheadTriangleUpBlack, MusicFontSymbol.NoteheadTriangleUpBlack, MusicFontSymbol.NoteheadTriangleUpBlack)],
    [60, new InstrumentArticulation("bongo", -4, 60, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [104, new InstrumentArticulation("bongo", -5, 60, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole, MusicFontSymbol.NoteheadParenthesis, TextBaseline.Middle)],
    [105, new InstrumentArticulation("bongo", -6, 60, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack)],
    [61, new InstrumentArticulation("bongo", -7, 61, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [106, new InstrumentArticulation("bongo", -8, 61, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole, MusicFontSymbol.NoteheadParenthesis, TextBaseline.Middle)],
    [107, new InstrumentArticulation("bongo", -16, 61, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack)],
    [66, new InstrumentArticulation("timbale", 10, 66, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [65, new InstrumentArticulation("timbale", 9, 65, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [68, new InstrumentArticulation("agogo", 12, 68, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [67, new InstrumentArticulation("agogo", 11, 67, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [64, new InstrumentArticulation("conga", 17, 64, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [108, new InstrumentArticulation("conga", 16, 64, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack)],
    [109, new InstrumentArticulation("conga", 15, 64, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole, MusicFontSymbol.NoteheadParenthesis, TextBaseline.Middle)],
    [63, new InstrumentArticulation("conga", 14, 63, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [110, new InstrumentArticulation("conga", 13, 63, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack)],
    [62, new InstrumentArticulation("conga", 19, 62, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole, MusicFontSymbol.NoteheadParenthesis, TextBaseline.Middle)],
    [72, new InstrumentArticulation("whistle", -11, 72, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [71, new InstrumentArticulation("whistle", -17, 71, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [73, new InstrumentArticulation("guiro", 38, 73, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [74, new InstrumentArticulation("guiro", 37, 74, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [86, new InstrumentArticulation("surdo", 36, 86, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [87, new InstrumentArticulation("surdo", 35, 87, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadParenthesis, TextBaseline.Middle)],
    [54, new InstrumentArticulation("tambourine", 3, 54, MusicFontSymbol.NoteheadTriangleUpBlack, MusicFontSymbol.NoteheadTriangleUpBlack, MusicFontSymbol.NoteheadTriangleUpBlack)],
    [111, new InstrumentArticulation("tambourine", 2, 54, MusicFontSymbol.NoteheadTriangleUpBlack, MusicFontSymbol.NoteheadTriangleUpBlack, MusicFontSymbol.NoteheadTriangleUpBlack, MusicFontSymbol.StringsUpBow, TextBaseline.Bottom)],
    [112, new InstrumentArticulation("tambourine", 1, 54, MusicFontSymbol.NoteheadTriangleUpBlack, MusicFontSymbol.NoteheadTriangleUpBlack, MusicFontSymbol.NoteheadTriangleUpBlack, MusicFontSymbol.StringsDownBow, TextBaseline.Bottom)],
    [113, new InstrumentArticulation("tambourine", -7, 54, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack)],
    [79, new InstrumentArticulation("cuica", 30, 79, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [78, new InstrumentArticulation("cuica", 29, 78, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack)],
    [58, new InstrumentArticulation("vibraslap", 28, 58, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [81, new InstrumentArticulation("triangle", 27, 81, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [80, new InstrumentArticulation("triangle", 26, 80, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadParenthesis, TextBaseline.Middle)],
    [114, new InstrumentArticulation("grancassa", 25, 43, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [115, new InstrumentArticulation("piatti", 18, 49, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [116, new InstrumentArticulation("piatti", 24, 49, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack)],
    [69, new InstrumentArticulation("cabasa", 23, 69, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [117, new InstrumentArticulation("cabasa", 22, 69, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole, MusicFontSymbol.StringsUpBow, TextBaseline.Bottom)],
    [85, new InstrumentArticulation("castanets", 21, 85, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [75, new InstrumentArticulation("claves", 20, 75, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [70, new InstrumentArticulation("maraca", -12, 70, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [118, new InstrumentArticulation("maraca", -13, 70, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole, MusicFontSymbol.StringsUpBow, TextBaseline.Bottom)],
    [119, new InstrumentArticulation("maraca", -14, 70, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [120, new InstrumentArticulation("maraca", -15, 70, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole, MusicFontSymbol.StringsUpBow, TextBaseline.Bottom)],
    [82, new InstrumentArticulation("shaker", -23, 54, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [122, new InstrumentArticulation("shaker", -24, 54, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole, MusicFontSymbol.StringsUpBow, TextBaseline.Bottom)],
    [84, new InstrumentArticulation("bellTree", -18, 53, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [123, new InstrumentArticulation("bellTree", -19, 53, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole, MusicFontSymbol.StringsUpBow, TextBaseline.Bottom)],
    [83, new InstrumentArticulation("jingleBell", -20, 53, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [124, new InstrumentArticulation("unpitched", -21, 62, MusicFontSymbol.NoteheadNull, MusicFontSymbol.NoteheadNull, MusicFontSymbol.NoteheadNull, MusicFontSymbol.GuitarGolpe, TextBaseline.Top)],
    [125, new InstrumentArticulation("unpitched", -22, 62, MusicFontSymbol.NoteheadNull, MusicFontSymbol.NoteheadNull, MusicFontSymbol.NoteheadNull, MusicFontSymbol.GuitarGolpe, TextBaseline.Bottom)],
    [39, new InstrumentArticulation("handClap", 3, 39, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [40, new InstrumentArticulation("snare", 3, 40, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [31, new InstrumentArticulation("snare", 3, 40, MusicFontSymbol.NoteheadSlashedBlack2, MusicFontSymbol.NoteheadSlashedBlack2, MusicFontSymbol.NoteheadSlashedBlack2)],
    [41, new InstrumentArticulation("tom", 5, 41, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [59, new InstrumentArticulation("ride", 2, 59, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.PictEdgeOfCymbal, TextBaseline.Bottom)],
    [126, new InstrumentArticulation("ride", 2, 59, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack)],
    [127, new InstrumentArticulation("ride", 2, 59, MusicFontSymbol.NoteheadDiamondWhite, MusicFontSymbol.NoteheadDiamondWhite, MusicFontSymbol.NoteheadDiamondWhite)],
    [29, new InstrumentArticulation("ride", 2, 59, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.ArticStaccatoAbove, TextBaseline.Top)],
    [30, new InstrumentArticulation("crash", -3, 49, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack)],
    [33, new InstrumentArticulation("snare", 3, 37, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack)],
    [34, new InstrumentArticulation("snare", 3, 38, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadBlack)]
]);
var TabRhythmMode;
(function (TabRhythmMode) {
    TabRhythmMode[TabRhythmMode["Hidden"] = 0] = "Hidden";
    TabRhythmMode[TabRhythmMode["ShowWithBeams"] = 1] = "ShowWithBeams";
    TabRhythmMode[TabRhythmMode["ShowWithBars"] = 2] = "ShowWithBars";
})(TabRhythmMode || (TabRhythmMode = {}));
var FingeringMode;
(function (FingeringMode) {
    FingeringMode[FingeringMode["ScoreDefault"] = 0] = "ScoreDefault";
    FingeringMode[FingeringMode["ScoreForcePiano"] = 1] = "ScoreForcePiano";
    FingeringMode[FingeringMode["SingleNoteEffectBand"] = 2] = "SingleNoteEffectBand";
    FingeringMode[FingeringMode["SingleNoteEffectBandForcePiano"] = 3] = "SingleNoteEffectBandForcePiano";
})(FingeringMode || (FingeringMode = {}));
var NotationMode;
(function (NotationMode) {
    NotationMode[NotationMode["GuitarPro"] = 0] = "GuitarPro";
    NotationMode[NotationMode["SongBook"] = 1] = "SongBook";
})(NotationMode || (NotationMode = {}));
var NotationElement;
(function (NotationElement) {
    NotationElement[NotationElement["ScoreTitle"] = 0] = "ScoreTitle";
    NotationElement[NotationElement["ScoreSubTitle"] = 1] = "ScoreSubTitle";
    NotationElement[NotationElement["ScoreArtist"] = 2] = "ScoreArtist";
    NotationElement[NotationElement["ScoreAlbum"] = 3] = "ScoreAlbum";
    NotationElement[NotationElement["ScoreWords"] = 4] = "ScoreWords";
    NotationElement[NotationElement["ScoreMusic"] = 5] = "ScoreMusic";
    NotationElement[NotationElement["ScoreWordsAndMusic"] = 6] = "ScoreWordsAndMusic";
    NotationElement[NotationElement["ScoreCopyright"] = 7] = "ScoreCopyright";
    NotationElement[NotationElement["GuitarTuning"] = 8] = "GuitarTuning";
    NotationElement[NotationElement["TrackNames"] = 9] = "TrackNames";
    NotationElement[NotationElement["ChordDiagrams"] = 10] = "ChordDiagrams";
    NotationElement[NotationElement["ParenthesisOnTiedBends"] = 11] = "ParenthesisOnTiedBends";
    NotationElement[NotationElement["TabNotesOnTiedBends"] = 12] = "TabNotesOnTiedBends";
    NotationElement[NotationElement["ZerosOnDiveWhammys"] = 13] = "ZerosOnDiveWhammys";
    NotationElement[NotationElement["EffectAlternateEndings"] = 14] = "EffectAlternateEndings";
    NotationElement[NotationElement["EffectCapo"] = 15] = "EffectCapo";
    NotationElement[NotationElement["EffectChordNames"] = 16] = "EffectChordNames";
    NotationElement[NotationElement["EffectCrescendo"] = 17] = "EffectCrescendo";
    NotationElement[NotationElement["EffectDynamics"] = 18] = "EffectDynamics";
    NotationElement[NotationElement["EffectFadeIn"] = 19] = "EffectFadeIn";
    NotationElement[NotationElement["EffectFermata"] = 20] = "EffectFermata";
    NotationElement[NotationElement["EffectFingering"] = 21] = "EffectFingering";
    NotationElement[NotationElement["EffectHarmonics"] = 22] = "EffectHarmonics";
    NotationElement[NotationElement["EffectLetRing"] = 23] = "EffectLetRing";
    NotationElement[NotationElement["EffectLyrics"] = 24] = "EffectLyrics";
    NotationElement[NotationElement["EffectMarker"] = 25] = "EffectMarker";
    NotationElement[NotationElement["EffectOttavia"] = 26] = "EffectOttavia";
    NotationElement[NotationElement["EffectPalmMute"] = 27] = "EffectPalmMute";
    NotationElement[NotationElement["EffectPickSlide"] = 28] = "EffectPickSlide";
    NotationElement[NotationElement["EffectPickStroke"] = 29] = "EffectPickStroke";
    NotationElement[NotationElement["EffectSlightBeatVibrato"] = 30] = "EffectSlightBeatVibrato";
    NotationElement[NotationElement["EffectSlightNoteVibrato"] = 31] = "EffectSlightNoteVibrato";
    NotationElement[NotationElement["EffectTap"] = 32] = "EffectTap";
    NotationElement[NotationElement["EffectTempo"] = 33] = "EffectTempo";
    NotationElement[NotationElement["EffectText"] = 34] = "EffectText";
    NotationElement[NotationElement["EffectTrill"] = 35] = "EffectTrill";
    NotationElement[NotationElement["EffectTripletFeel"] = 36] = "EffectTripletFeel";
    NotationElement[NotationElement["EffectWhammyBar"] = 37] = "EffectWhammyBar";
    NotationElement[NotationElement["EffectWideBeatVibrato"] = 38] = "EffectWideBeatVibrato";
    NotationElement[NotationElement["EffectWideNoteVibrato"] = 39] = "EffectWideNoteVibrato";
    NotationElement[NotationElement["EffectLeftHandTap"] = 40] = "EffectLeftHandTap";
})(NotationElement || (NotationElement = {}));
class NotationSettings {
    constructor() {
        this.notationMode = NotationMode.GuitarPro;
        this.fingeringMode = FingeringMode.ScoreDefault;
        this.elements = new Map();
        this.rhythmMode = TabRhythmMode.Hidden;
        this.rhythmHeight = 15;
        this.transpositionPitches = [];
        this.displayTranspositionPitches = [];
        this.smallGraceTabNotes = true;
        this.extendBendArrowsOnTiedNotes = true;
        this.extendLineEffectsToBeatEnd = false;
        this.slurHeight = 5.0;
    }
    isNotationElementVisible(element) {
        if (this.elements.has(element)) {
            return this.elements.get(element);
        }
        if (NotationSettings.defaultElements.has(element)) {
            return NotationSettings.defaultElements.get(element);
        }
        return true;
    }
}
NotationSettings.defaultElements = new Map([
    [NotationElement.ZerosOnDiveWhammys, false]
]);
class Lazy {
    constructor(factory) {
        this._value = undefined;
        this._factory = factory;
    }
    get value() {
        if (this._value === undefined) {
            this._value = this._factory();
        }
        return this._value;
    }
}
class TuningParseResult {
    constructor() {
        this.note = null;
        this.noteValue = 0;
        this.octave = 0;
    }
    get realValue() {
        return this.octave * 12 + this.noteValue;
    }
}
class ModelUtils {
    static getIndex(duration) {
        let index = 0;
        let value = duration;
        if (value < 0) {
            return index;
        }
        return Math.log2(duration) | 0;
    }
    static keySignatureIsFlat(ks) {
        return ks < 0;
    }
    static keySignatureIsNatural(ks) {
        return ks === 0;
    }
    static keySignatureIsSharp(ks) {
        return ks > 0;
    }
    static applyPitchOffsets(settings, score) {
        for (let i = 0; i < score.tracks.length; i++) {
            if (i < settings.notation.displayTranspositionPitches.length) {
                for (let staff of score.tracks[i].staves) {
                    staff.displayTranspositionPitch = -settings.notation.displayTranspositionPitches[i];
                }
            }
            if (i < settings.notation.transpositionPitches.length) {
                for (let staff of score.tracks[i].staves) {
                    staff.transpositionPitch = -settings.notation.transpositionPitches[i];
                }
            }
        }
    }
    static fingerToString(settings, beat, finger, leftHand) {
        if (settings.notation.fingeringMode === FingeringMode.ScoreForcePiano ||
            settings.notation.fingeringMode === FingeringMode.SingleNoteEffectBandForcePiano ||
            GeneralMidi.isPiano(beat.voice.bar.staff.track.playbackInfo.program)) {
            switch (finger) {
                case Fingers.Unknown:
                case Fingers.NoOrDead:
                    return null;
                case Fingers.Thumb:
                    return '1';
                case Fingers.IndexFinger:
                    return '2';
                case Fingers.MiddleFinger:
                    return '3';
                case Fingers.AnnularFinger:
                    return '4';
                case Fingers.LittleFinger:
                    return '5';
                default:
                    return null;
            }
        }
        if (leftHand) {
            switch (finger) {
                case Fingers.Unknown:
                case Fingers.NoOrDead:
                    return '0';
                case Fingers.Thumb:
                    return 'T';
                case Fingers.IndexFinger:
                    return '1';
                case Fingers.MiddleFinger:
                    return '2';
                case Fingers.AnnularFinger:
                    return '3';
                case Fingers.LittleFinger:
                    return '4';
                default:
                    return null;
            }
        }
        switch (finger) {
            case Fingers.Unknown:
            case Fingers.NoOrDead:
                return null;
            case Fingers.Thumb:
                return 'p';
            case Fingers.IndexFinger:
                return 'i';
            case Fingers.MiddleFinger:
                return 'm';
            case Fingers.AnnularFinger:
                return 'a';
            case Fingers.LittleFinger:
                return 'c';
            default:
                return null;
        }
    }
    static isTuning(name) {
        return !!ModelUtils.parseTuning(name);
    }
    static parseTuning(name) {
        let note = '';
        let octave = '';
        for (let i = 0; i < name.length; i++) {
            let c = name.charCodeAt(i);
            if (c >= 0x30 && c <= 0x39) {
                if (!note) {
                    return null;
                }
                octave += String.fromCharCode(c);
            }
            else if ((c >= 0x41 && c <= 0x5a) || (c >= 0x61 && c <= 0x7a) || c === 0x23) {
                note += String.fromCharCode(c);
            }
            else {
                return null;
            }
        }
        if (!octave || !note) {
            return null;
        }
        let result = new TuningParseResult();
        result.octave = parseInt(octave) + 1;
        result.note = note.toLowerCase();
        result.noteValue = ModelUtils.getToneForText(result.note);
        return result;
    }
    static getTuningForText(str) {
        let result = ModelUtils.parseTuning(str);
        if (!result) {
            return -1;
        }
        return result.realValue;
    }
    static getToneForText(note) {
        switch (note.toLowerCase()) {
            case 'c':
                return 0;
            case 'c#':
            case 'db':
                return 1;
            case 'd':
                return 2;
            case 'd#':
            case 'eb':
                return 3;
            case 'e':
                return 4;
            case 'f':
                return 5;
            case 'f#':
            case 'gb':
                return 6;
            case 'g':
                return 7;
            case 'g#':
            case 'ab':
                return 8;
            case 'a':
                return 9;
            case 'a#':
            case 'bb':
                return 10;
            case 'b':
                return 11;
            default:
                return 0;
        }
    }
    static newGuid() {
        return (Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1) +
            Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1) +
            '-' +
            Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1) +
            '-' +
            Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1) +
            '-' +
            Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1) +
            '-' +
            Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1) +
            Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1) +
            Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1));
    }
    static isAlmostEqualTo(a, b) {
        return Math.abs(a - b) < 0.00001;
    }
    static toHexString(n, digits = 0) {
        let s = '';
        let hexChars = '0123456789ABCDEF';
        do {
            s = String.fromCharCode(hexChars.charCodeAt(n & 15)) + s;
            n = n >> 4;
        } while (n > 0);
        while (s.length < digits) {
            s = '0' + s;
        }
        return s;
    }
}
class Section {
    constructor() {
        this.marker = '';
        this.text = '';
    }
}
class IOHelper {
    static readInt32BE(input) {
        let ch1 = input.readByte();
        let ch2 = input.readByte();
        let ch3 = input.readByte();
        let ch4 = input.readByte();
        return (ch1 << 24) | (ch2 << 16) | (ch3 << 8) | ch4;
    }
    static readInt32LE(input) {
        let ch1 = input.readByte();
        let ch2 = input.readByte();
        let ch3 = input.readByte();
        let ch4 = input.readByte();
        return (ch4 << 24) | (ch3 << 16) | (ch2 << 8) | ch1;
    }
    static readUInt32LE(input) {
        let ch1 = input.readByte();
        let ch2 = input.readByte();
        let ch3 = input.readByte();
        let ch4 = input.readByte();
        return (ch4 << 24) | (ch3 << 16) | (ch2 << 8) | ch1;
    }
    static decodeUInt32LE(data, index) {
        let ch1 = data[index];
        let ch2 = data[index + 1];
        let ch3 = data[index + 2];
        let ch4 = data[index + 3];
        return (ch4 << 24) | (ch3 << 16) | (ch2 << 8) | ch1;
    }
    static readUInt16LE(input) {
        let ch1 = input.readByte();
        let ch2 = input.readByte();
        return TypeConversions.int32ToUint16((ch2 << 8) | ch1);
    }
    static readInt16LE(input) {
        let ch1 = input.readByte();
        let ch2 = input.readByte();
        return TypeConversions.int32ToInt16((ch2 << 8) | ch1);
    }
    static readUInt32BE(input) {
        let ch1 = input.readByte();
        let ch2 = input.readByte();
        let ch3 = input.readByte();
        let ch4 = input.readByte();
        return TypeConversions.int32ToUint32((ch1 << 24) | (ch2 << 16) | (ch3 << 8) | ch4);
    }
    static readUInt16BE(input) {
        let ch1 = input.readByte();
        let ch2 = input.readByte();
        return TypeConversions.int32ToInt16((ch1 << 8) | ch2);
    }
    static readInt16BE(input) {
        let ch1 = input.readByte();
        let ch2 = input.readByte();
        return TypeConversions.int32ToInt16((ch1 << 8) | ch2);
    }
    static readByteArray(input, length) {
        let v = new Uint8Array(length);
        input.read(v, 0, length);
        return v;
    }
    static read8BitChars(input, length) {
        let b = new Uint8Array(length);
        input.read(b, 0, b.length);
        return IOHelper.toString(b, 'utf-8');
    }
    static read8BitString(input) {
        let s = '';
        let c = input.readByte();
        while (c !== 0) {
            s += String.fromCharCode(c);
            c = input.readByte();
        }
        return s;
    }
    static read8BitStringLength(input, length) {
        let s = '';
        let z = -1;
        for (let i = 0; i < length; i++) {
            let c = input.readByte();
            if (c === 0 && z === -1) {
                z = i;
            }
            s += String.fromCharCode(c);
        }
        let t = s;
        if (z >= 0) {
            return t.substr(0, z);
        }
        return t;
    }
    static readSInt8(input) {
        let v = input.readByte();
        return ((v & 255) >> 7) * -256 + (v & 255);
    }
    static readInt24(input, index) {
        let i = input[index] | (input[index + 1] << 8) | (input[index + 2] << 16);
        if ((i & 0x800000) === 0x800000) {
            i = i | (0xff << 24);
        }
        return i;
    }
    static readInt16(input, index) {
        return TypeConversions.int32ToInt16(input[index] | (input[index + 1] << 8));
    }
    static toString(data, encoding) {
        let detectedEncoding = IOHelper.detectEncoding(data);
        if (detectedEncoding) {
            encoding = detectedEncoding;
        }
        if (!encoding) {
            encoding = 'utf-8';
        }
        let decoder = new TextDecoder(encoding);
        return decoder.decode(data.buffer);
    }
    static detectEncoding(data) {
        if (data.length > 2 && data[0] === 0xfe && data[1] === 0xff) {
            return 'utf-16be';
        }
        if (data.length > 2 && data[0] === 0xff && data[1] === 0xfe) {
            return 'utf-16le';
        }
        if (data.length > 4 && data[0] === 0x00 && data[1] === 0x00 && data[2] === 0xfe && data[3] === 0xff) {
            return 'utf-32be';
        }
        if (data.length > 4 && data[0] === 0xff && data[1] === 0xfe && data[2] === 0x00 && data[3] === 0x00) {
            return 'utf-32le';
        }
        return null;
    }
    static stringToBytes(str) {
        let decoder = new TextEncoder();
        return decoder.encode(str);
    }
    static writeInt32BE(o, v) {
        o.writeByte((v >> 24) & 0xff);
        o.writeByte((v >> 16) & 0xff);
        o.writeByte((v >> 8) & 0xff);
        o.writeByte((v >> 0) & 0xff);
    }
    static writeInt32LE(o, v) {
        o.writeByte((v >> 0) & 0xff);
        o.writeByte((v >> 8) & 0xff);
        o.writeByte((v >> 16) & 0xff);
        o.writeByte((v >> 24) & 0xff);
    }
    static writeUInt16LE(o, v) {
        o.writeByte((v >> 0) & 0xff);
        o.writeByte((v >> 8) & 0xff);
    }
    static writeInt16LE(o, v) {
        o.writeByte((v >> 0) & 0xff);
        o.writeByte((v >> 8) & 0xff);
    }
    static writeInt16BE(o, v) {
        o.writeByte((v >> 8) & 0xff);
        o.writeByte((v >> 0) & 0xff);
    }
}
class ByteBuffer {
    constructor() {
        this.length = 0;
        this.position = 0;
    }
    get bytesWritten() {
        return this.position;
    }
    getBuffer() {
        return this._buffer;
    }
    static empty() {
        return ByteBuffer.withCapacity(0);
    }
    static withCapacity(capacity) {
        let buffer = new ByteBuffer();
        buffer._buffer = new Uint8Array(capacity);
        return buffer;
    }
    static fromBuffer(data) {
        let buffer = new ByteBuffer();
        buffer._buffer = data;
        buffer.length = data.length;
        return buffer;
    }
    static fromString(contents) {
        let byteArray = IOHelper.stringToBytes(contents);
        return ByteBuffer.fromBuffer(byteArray);
    }
    reset() {
        this.position = 0;
    }
    skip(offset) {
        this.position += offset;
    }
    readByte() {
        let n = this.length - this.position;
        if (n <= 0) {
            return -1;
        }
        return this._buffer[this.position++];
    }
    read(buffer, offset, count) {
        let n = this.length - this.position;
        if (n > count) {
            n = count;
        }
        if (n <= 0) {
            return 0;
        }
        buffer.set(this._buffer.subarray(this.position, this.position + n), offset);
        this.position += n;
        return n;
    }
    writeByte(value) {
        let i = this.position + 1;
        this.ensureCapacity(i);
        this._buffer[this.position] = value & 0xFF;
        if (i > this.length) {
            this.length = i;
        }
        this.position = i;
    }
    write(buffer, offset, count) {
        let i = this.position + count;
        this.ensureCapacity(i);
        let count1 = Math.min(count, buffer.length - offset);
        this._buffer.set(buffer.subarray(offset, offset + count1), this.position);
        if (i > this.length) {
            this.length = i;
        }
        this.position = i;
    }
    ensureCapacity(value) {
        if (value > this._buffer.length) {
            let newCapacity = value;
            if (newCapacity < 256) {
                newCapacity = 256;
            }
            if (newCapacity < this._buffer.length * 2) {
                newCapacity = this._buffer.length * 2;
            }
            let newBuffer = new Uint8Array(newCapacity);
            if (this.length > 0) {
                newBuffer.set(this._buffer.subarray(0, 0 + this.length), 0);
            }
            this._buffer = newBuffer;
        }
    }
    readAll() {
        return this.toArray();
    }
    toArray() {
        let copy = new Uint8Array(this.length);
        copy.set(this._buffer.subarray(0, 0 + this.length), 0);
        return copy;
    }
    copyTo(destination) {
        destination.write(this._buffer, 0, this.length);
    }
}
class TypeConversions {
    static float64ToBytes(v) {
        TypeConversions._dataView.setFloat64(0, v, true);
        return this._conversionByteArray;
    }
    static bytesToFloat64(bytes) {
        TypeConversions._conversionByteArray.set(bytes, 0);
        throw TypeConversions._dataView.getFloat64(0, true);
    }
    static uint16ToInt16(v) {
        TypeConversions._dataView.setUint16(0, v, true);
        return TypeConversions._dataView.getInt16(0, true);
    }
    static int16ToUint32(v) {
        TypeConversions._dataView.setInt16(0, v, true);
        return TypeConversions._dataView.getUint32(0, true);
    }
    static int32ToUint16(v) {
        TypeConversions._dataView.setInt32(0, v, true);
        return TypeConversions._dataView.getUint16(0, true);
    }
    static int32ToInt16(v) {
        TypeConversions._dataView.setInt32(0, v, true);
        return TypeConversions._dataView.getInt16(0, true);
    }
    static int32ToUint32(v) {
        TypeConversions._dataView.setInt32(0, v, true);
        return TypeConversions._dataView.getUint32(0, true);
    }
    static uint8ToInt8(v) {
        TypeConversions._dataView.setUint8(0, v);
        return TypeConversions._dataView.getInt8(0);
    }
}
TypeConversions._conversionBuffer = new ArrayBuffer(8);
TypeConversions._conversionByteArray = new Uint8Array(TypeConversions._conversionBuffer);
TypeConversions._dataView = new DataView(TypeConversions._conversionBuffer);
class BeatCloner {
    static clone(original) {
        const clone = new Beat();
        clone.index = original.index;
        clone.notes = [];
        for (const i of original.notes) {
            clone.addNote(NoteCloner.clone(i));
        }
        clone.isEmpty = original.isEmpty;
        clone.whammyStyle = original.whammyStyle;
        clone.ottava = original.ottava;
        clone.isLegatoOrigin = original.isLegatoOrigin;
        clone.duration = original.duration;
        clone.isLetRing = original.isLetRing;
        clone.isPalmMute = original.isPalmMute;
        clone.automations = [];
        for (const i of original.automations) {
            clone.automations.push(AutomationCloner.clone(i));
        }
        clone.dots = original.dots;
        clone.fadeIn = original.fadeIn;
        clone.lyrics = original.lyrics ? original.lyrics.slice() : null;
        clone.hasRasgueado = original.hasRasgueado;
        clone.pop = original.pop;
        clone.slap = original.slap;
        clone.tap = original.tap;
        clone.text = original.text;
        clone.brushType = original.brushType;
        clone.brushDuration = original.brushDuration;
        clone.tupletDenominator = original.tupletDenominator;
        clone.tupletNumerator = original.tupletNumerator;
        clone.isContinuedWhammy = original.isContinuedWhammy;
        clone.whammyBarType = original.whammyBarType;
        if (original.whammyBarPoints) {
            clone.whammyBarPoints = [];
            for (const i of original.whammyBarPoints) {
                clone.addWhammyBarPoint(BendPointCloner.clone(i));
            }
        }
        clone.vibrato = original.vibrato;
        clone.chordId = original.chordId;
        clone.graceType = original.graceType;
        clone.pickStroke = original.pickStroke;
        clone.tremoloSpeed = original.tremoloSpeed;
        clone.crescendo = original.crescendo;
        clone.displayStart = original.displayStart;
        clone.playbackStart = original.playbackStart;
        clone.displayDuration = original.displayDuration;
        clone.playbackDuration = original.playbackDuration;
        clone.dynamics = original.dynamics;
        clone.invertBeamDirection = original.invertBeamDirection;
        clone.preferredBeamDirection = original.preferredBeamDirection;
        clone.isEffectSlurOrigin = original.isEffectSlurOrigin;
        clone.beamingMode = original.beamingMode;
        return clone;
    }
}
class NoteCloner {
    static clone(original) {
        const clone = new Note();
        clone.index = original.index;
        clone.accentuated = original.accentuated;
        clone.bendType = original.bendType;
        clone.bendStyle = original.bendStyle;
        clone.isContinuedBend = original.isContinuedBend;
        if (original.bendPoints) {
            clone.bendPoints = [];
            for (const i of original.bendPoints) {
                clone.addBendPoint(BendPointCloner.clone(i));
            }
        }
        clone.fret = original.fret;
        clone.string = original.string;
        clone.octave = original.octave;
        clone.tone = original.tone;
        clone.percussionArticulation = original.percussionArticulation;
        clone.isVisible = original.isVisible;
        clone.isLeftHandTapped = original.isLeftHandTapped;
        clone.isHammerPullOrigin = original.isHammerPullOrigin;
        clone.isSlurDestination = original.isSlurDestination;
        clone.harmonicType = original.harmonicType;
        clone.harmonicValue = original.harmonicValue;
        clone.isGhost = original.isGhost;
        clone.isLetRing = original.isLetRing;
        clone.isPalmMute = original.isPalmMute;
        clone.isDead = original.isDead;
        clone.isStaccato = original.isStaccato;
        clone.slideInType = original.slideInType;
        clone.slideOutType = original.slideOutType;
        clone.vibrato = original.vibrato;
        clone.isTieDestination = original.isTieDestination;
        clone.leftHandFinger = original.leftHandFinger;
        clone.rightHandFinger = original.rightHandFinger;
        clone.isFingering = original.isFingering;
        clone.trillValue = original.trillValue;
        clone.trillSpeed = original.trillSpeed;
        clone.durationPercent = original.durationPercent;
        clone.accidentalMode = original.accidentalMode;
        clone.dynamics = original.dynamics;
        return clone;
    }
}
class BendPointCloner {
    static clone(original) {
        const clone = new BendPoint();
        clone.offset = original.offset;
        clone.value = original.value;
        return clone;
    }
}
class Color {
    constructor(r, g, b, a = 0xff) {
        this.raw = 0;
        this.raw = ((a & 0xff) << 24) | ((r & 0xff) << 16) | ((g & 0xff) << 8) | (b & 0xff);
        this.updateRgba();
    }
    updateRgba() {
        if (this.a === 0xff) {
            this.rgba =
                '#' +
                    ModelUtils.toHexString(this.r, 2) +
                    ModelUtils.toHexString(this.g, 2) +
                    ModelUtils.toHexString(this.b, 2);
        }
        else {
            this.rgba = `rgba(${this.r},${this.g},${this.b},${this.a / 255.0})`;
        }
    }
    get a() {
        return (this.raw >> 24) & 0xff;
    }
    get r() {
        return (this.raw >> 16) & 0xff;
    }
    get g() {
        return (this.raw >> 8) & 0xff;
    }
    get b() {
        return this.raw & 0xff;
    }
    static random(opacity = 100) {
        return new Color((Math.random() * 255) | 0, (Math.random() * 255) | 0, (Math.random() * 255) | 0, opacity);
    }
    static fromJson(v) {
        switch (typeof v) {
            case 'number': {
                const c = new Color(0, 0, 0, 0);
                c.raw = v;
                c.updateRgba();
                return c;
            }
            case 'string': {
                const json = v;
                if (json.startsWith('#')) {
                    if (json.length === 4) {
                        return new Color(parseInt(json[1], 16) * 17, parseInt(json[2], 16) * 17, parseInt(json[3], 16) * 17);
                    }
                    if (json.length === 5) {
                        return new Color(parseInt(json[1], 16) * 17, parseInt(json[2], 16) * 17, parseInt(json[3], 16) * 17, parseInt(json[4], 16) * 17);
                    }
                    if (json.length === 7) {
                        return new Color(parseInt(json.substring(1, 3), 16), parseInt(json.substring(3, 5), 16), parseInt(json.substring(5, 7), 16));
                    }
                    if (json.length === 9) {
                        return new Color(parseInt(json.substring(1, 3), 16), parseInt(json.substring(3, 5), 16), parseInt(json.substring(5, 7), 16), parseInt(json.substring(7, 9), 16));
                    }
                }
                else if (json.startsWith('rgba') || json.startsWith('rgb')) {
                    const start = json.indexOf('(');
                    const end = json.lastIndexOf(')');
                    if (start === -1 || end === -1) {
                        throw 'No values specified for rgb/rgba function';
                    }
                    const numbers = json.substring(start + 1, end).split(',');
                    if (numbers.length === 3) {
                        return new Color(parseInt(numbers[0]), parseInt(numbers[1]), parseInt(numbers[2]));
                    }
                    if (numbers.length === 4) {
                        return new Color(parseInt(numbers[0]), parseInt(numbers[1]), parseInt(numbers[2]), parseFloat(numbers[3]) * 255);
                    }
                }
                return null;
            }
        }
        throw 'Unsupported format for color';
    }
    static toJson(obj) {
        return obj.raw;
    }
}
Color.BlackRgb = '#000000';
var BeamDirection;
(function (BeamDirection) {
    BeamDirection[BeamDirection["Up"] = 0] = "Up";
    BeamDirection[BeamDirection["Down"] = 1] = "Down";
})(BeamDirection || (BeamDirection = {}));
class AutomationCloner {
    static clone(original) {
        const clone = new Automation();
        clone.isLinear = original.isLinear;
        clone.type = original.type;
        clone.value = original.value;
        clone.ratioPosition = original.ratioPosition;
        clone.text = original.text;
        return clone;
    }
}
class GeneralMidi {
    static getValue(name) {
        if (!GeneralMidi._values) {
            GeneralMidi._values = new Map();
        }
        name = name.toLowerCase().replace(' ', '');
        return GeneralMidi._values.has(name) ? GeneralMidi._values.get(name) : 0;
    }
    static isPiano(program) {
        return program <= 7 || program >= 16 && program <= 23;
    }
    static isGuitar(program) {
        return program >= 24 && program <= 39 || program === 105 || program === 43;
    }
}
GeneralMidi._values = new Map([
    ['acousticgrandpiano', 0], ['brightacousticpiano', 1], ['electricgrandpiano', 2],
    ['honkytonkpiano', 3], ['electricpiano1', 4], ['electricpiano2', 5], ['harpsichord', 6],
    ['clavinet', 7], ['celesta', 8], ['glockenspiel', 9], ['musicbox', 10], ['vibraphone', 11],
    ['marimba', 12], ['xylophone', 13], ['tubularbells', 14], ['dulcimer', 15],
    ['drawbarorgan', 16], ['percussiveorgan', 17], ['rockorgan', 18], ['churchorgan', 19],
    ['reedorgan', 20], ['accordion', 21], ['harmonica', 22], ['tangoaccordion', 23],
    ['acousticguitarnylon', 24], ['acousticguitarsteel', 25], ['electricguitarjazz', 26],
    ['electricguitarclean', 27], ['electricguitarmuted', 28], ['overdrivenguitar', 29],
    ['distortionguitar', 30], ['guitarharmonics', 31], ['acousticbass', 32],
    ['electricbassfinger', 33], ['electricbasspick', 34], ['fretlessbass', 35],
    ['slapbass1', 36], ['slapbass2', 37], ['synthbass1', 38], ['synthbass2', 39],
    ['violin', 40], ['viola', 41], ['cello', 42], ['contrabass', 43], ['tremolostrings', 44],
    ['pizzicatostrings', 45], ['orchestralharp', 46], ['timpani', 47], ['stringensemble1', 48],
    ['stringensemble2', 49], ['synthstrings1', 50], ['synthstrings2', 51], ['choiraahs', 52],
    ['voiceoohs', 53], ['synthvoice', 54], ['orchestrahit', 55], ['trumpet', 56],
    ['trombone', 57], ['tuba', 58], ['mutedtrumpet', 59], ['frenchhorn', 60],
    ['brasssection', 61], ['synthbrass1', 62], ['synthbrass2', 63], ['sopranosax', 64],
    ['altosax', 65], ['tenorsax', 66], ['baritonesax', 67], ['oboe', 68], ['englishhorn', 69],
    ['bassoon', 70], ['clarinet', 71], ['piccolo', 72], ['flute', 73], ['recorder', 74],
    ['panflute', 75], ['blownbottle', 76], ['shakuhachi', 77], ['whistle', 78], ['ocarina', 79],
    ['lead1square', 80], ['lead2sawtooth', 81], ['lead3calliope', 82], ['lead4chiff', 83],
    ['lead5charang', 84], ['lead6voice', 85], ['lead7fifths', 86], ['lead8bassandlead', 87],
    ['pad1newage', 88], ['pad2warm', 89], ['pad3polysynth', 90], ['pad4choir', 91],
    ['pad5bowed', 92], ['pad6metallic', 93], ['pad7halo', 94], ['pad8sweep', 95],
    ['fx1rain', 96], ['fx2soundtrack', 97], ['fx3crystal', 98], ['fx4atmosphere', 99],
    ['fx5brightness', 100], ['fx6goblins', 101], ['fx7echoes', 102], ['fx8scifi', 103],
    ['sitar', 104], ['banjo', 105], ['shamisen', 106], ['koto', 107], ['kalimba', 108],
    ['bagpipe', 109], ['fiddle', 110], ['shanai', 111], ['tinklebell', 112], ['agogo', 113],
    ['steeldrums', 114], ['woodblock', 115], ['taikodrum', 116], ['melodictom', 117],
    ['synthdrum', 118], ['reversecymbal', 119], ['guitarfretnoise', 120], ['breathnoise', 121],
    ['seashore', 122], ['birdtweet', 123], ['telephonering', 124], ['helicopter', 125],
    ['applause', 126], ['gunshot', 127]
]);
//# sourceMappingURL=mzxbx.js.map