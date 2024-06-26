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
                            testSchedule = midiParser.dump();
                            console.log('MZXBX_Schedule', testSchedule);
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
        this.controller_coarseVolume = 0x07;
        this.controller_coarseDataEntrySlider = 0x06;
        this.controller_fineDataEntrySlider = 0x26;
        this.controller_coarseRPN = 0x65;
        this.controller_fineRPN = 0x64;
        this.header = new MIDIFileHeader(arrayBuffer);
        this.parseTracks(arrayBuffer);
    }
    parseTracks(arrayBuffer) {
        console.log('start parseTracks');
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
        var r = '';
        for (var i = 0; i < arr.length; i++) {
            r = r + String.fromCharCode(arr[i]);
        }
        return r;
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
                    if (firstPitch == note.points[0].pitch) {
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
                if (chord.notes[i].points[0].pitch == first) {
                    return chord.notes[i];
                }
            }
        }
        var pi = { closed: false, points: [] };
        pi.points.push({ pointDuration: -1, pitch: first });
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
    simplifyPath(points, tolerance) {
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
                    if (note.points.length > 5) {
                        var xx = 0;
                        var pnts = [];
                        for (var p = 0; p < note.points.length; p++) {
                            note.points[p].pointDuration = Math.max(note.points[p].pointDuration, 0);
                            pnts.push({ x: xx, y: note.points[p].pitch });
                            xx = xx + note.points[p].pointDuration;
                        }
                        pnts.push({ x: xx, y: note.points[note.points.length - 1].pitch });
                        var lessPoints = this.simplifyPath(pnts, 1.5);
                        note.points = [];
                        for (var p = 0; p < lessPoints.length - 1; p++) {
                            var xypoint = lessPoints[p];
                            var xyduration = lessPoints[p + 1].x - xypoint.x;
                            note.points.push({ pointDuration: xyduration, pitch: xypoint.y });
                        }
                    }
                    else {
                        if (note.points.length == 1) {
                            if (note.points[0].pointDuration > 4321) {
                                note.points[0].pointDuration = 1234;
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
        for (let t = 0; t < this.parsedTracks.length; t++) {
            var singleParsedTrack = this.parsedTracks[t];
            this.parseTicks2time(singleParsedTrack);
            for (var e = 0; e < singleParsedTrack.trackevents.length; e++) {
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
                                    var duration = 0;
                                    for (var i = 0; i < chpi.note.points.length - 1; i++) {
                                        duration = duration + chpi.note.points[i].pointDuration;
                                    }
                                    chpi.note.points[chpi.note.points.length - 1].pointDuration = when - chpi.chord.when - duration;
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
                                    var nn1 = evnt.param1 ? evnt.param1 : 0;
                                    var nn2 = evnt.param2 ? evnt.param2 : 0;
                                    nn1 = nn1 & 0b01111111;
                                    nn2 = nn2 & 0b01111111;
                                    nn2 = nn2 << 7;
                                    var nn14 = nn2 | nn1;
                                    nn14 = (nn14 - 0x2000) / 1000;
                                    var slide = ((evnt.param2 ? evnt.param2 : 0) - 64) / 6;
                                    var b14 = evnt.param2 ? evnt.param2 : 0;
                                    b14 <<= 7;
                                    b14 |= evnt.param1 ? evnt.param1 : 0;
                                    b14 = (b14 - 0x2000) / 1000;
                                    var when = evnt.playTimeMs ? evnt.playTimeMs : 0;
                                    var chord = this.findChordBefore(when, singleParsedTrack, evnt.midiChannel ? evnt.midiChannel : 0);
                                    if (chord) {
                                        for (var i = 0; i < chord.notes.length; i++) {
                                            var note = chord.notes[i];
                                            if (!(note.closed)) {
                                                var duration = 0;
                                                for (var k = 0; k < note.points.length - 1; k++) {
                                                    duration = duration + note.points[k].pointDuration;
                                                }
                                                note.points[note.points.length - 1].pointDuration = when - chord.when - duration;
                                                var firstpitch = note.points[0].pitch + nn14;
                                                var point = {
                                                    pointDuration: -1,
                                                    pitch: firstpitch
                                                };
                                                note.points.push(point);
                                            }
                                        }
                                    }
                                }
                                else {
                                    if (evnt.subtype == this.EVENT_MIDI_CONTROLLER && evnt.param1 == this.controller_coarseVolume) {
                                        var v = evnt.param2 ? evnt.param2 / 127 : 0;
                                        let point = { ms: evnt.playTimeMs, value: v, channel: evnt.midiChannel ? evnt.midiChannel : 0, track: t };
                                        singleParsedTrack.trackVolumePoints.push(point);
                                    }
                                    else {
                                        if (evnt.subtype == this.EVENT_MIDI_CONTROLLER
                                            && (evnt.param1 == this.controller_coarseDataEntrySlider
                                                || evnt.param1 == this.controller_fineDataEntrySlider
                                                || evnt.param1 == this.controller_coarseRPN
                                                || evnt.param1 == this.controller_fineRPN)) {
                                            console.log('EVENT_MIDI_CONTROLLER', evnt.param1, evnt.param2, evnt);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                else {
                    if (evnt.subtype == this.EVENT_META_TEXT) {
                        this.header.lyrics.push({ track: t, ms: evnt.playTimeMs ? evnt.playTimeMs : 0, txt: evnt.text ? evnt.text : "?" });
                    }
                    if (evnt.subtype == this.EVENT_META_COPYRIGHT_NOTICE) {
                        this.header.lyrics.push({ track: t, ms: evnt.playTimeMs ? evnt.playTimeMs : 0, txt: evnt.text ? evnt.text : "?" });
                    }
                    if (evnt.subtype == this.EVENT_META_TRACK_NAME) {
                        singleParsedTrack.title = this.toText(evnt.data ? evnt.data : []);
                    }
                    if (evnt.subtype == this.EVENT_META_INSTRUMENT_NAME) {
                        singleParsedTrack.instrument = this.toText(evnt.data ? evnt.data : []);
                    }
                    if (evnt.subtype == this.EVENT_META_LYRICS) {
                        this.header.lyrics.push({ track: t, ms: evnt.playTimeMs ? evnt.playTimeMs : 0, txt: evnt.text ? evnt.text : "?" });
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
                        this.header.meters.push({
                            track: t, ms: evnt.playTimeMs ? evnt.playTimeMs : 0,
                            count: this.header.meterCount, division: this.header.meterDivision
                        });
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
                title: parsedtrack.title,
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
    dump() {
        console.log('MidiParser', this);
        let midiSongData = {
            parser: '1.01',
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
                    var newnote = { points: [] };
                    newchord.notes.push(newnote);
                    for (var v = 0; v < midinote.points.length; v++) {
                        var midipoint = midinote.points[v];
                        var newpoint = { pitch: midipoint.pitch, durationms: midipoint.pointDuration };
                        newpoint.midipoint = midinote;
                        newnote.points.push(newpoint);
                    }
                    newnote.points[newnote.points.length - 1].durationms = newnote.points[newnote.points.length - 1].durationms + 66;
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
        console.log('MIDISongData', midiSongData);
        let schedule = {
            series: [],
            channels: [],
            filters: []
        };
        let volumeCashe = new LastKeyVal();
        for (let mt = 0; mt < midiSongData.miditracks.length; mt++) {
            let miditrack = midiSongData.miditracks[mt];
            let midinum = 1 + Math.round(miditrack.program);
            for (let ch = 0; ch < miditrack.songchords.length; ch++) {
                let chord = miditrack.songchords[ch];
                for (let nn = 0; nn < chord.notes.length; nn++) {
                    let note = chord.notes[nn];
                    let timeIndex = Math.floor(chord.when / 1000.0);
                    let channelId = 'voice' + mt;
                    let tID = 'voice' + mt + 'subVolume';
                    if (miditrack.channelNum == 9) {
                        channelId = 'drum' + mt + '.' + note.points[0].pitch;
                        tID = 'drum' + mt + '.' + note.points[0].pitch + 'subVolume';
                    }
                    let timeSkip = chord.when / 1000 - timeIndex;
                    if (timeSkip < 0)
                        timeSkip = 0;
                    let item = {
                        skip: timeSkip,
                        channelId: channelId,
                        pitch: note.points[0].pitch,
                        slides: []
                    };
                    item.slides.push({ duration: note.points[0].durationms / 1000, delta: 0 });
                    if (miditrack.channelNum == 9) {
                    }
                    else {
                        if (note.points.length > 1) {
                            for (let pp = 0; pp < note.points.length - 1; pp++) {
                                item.slides.push({
                                    duration: note.points[pp].durationms / 1000,
                                    delta: note.points[pp + 1].pitch - item.pitch
                                });
                            }
                            item.slides.push({
                                duration: note.points[note.points.length - 1].durationms / 1000,
                                delta: note.points[note.points.length - 1].pitch - item.pitch
                            });
                        }
                    }
                    if (note.points[0].midipoint) {
                        if (note.points[0].midipoint.volume) {
                            let volVal = Math.round(100 * note.points[0].midipoint.volume / 127);
                            let lastVol = volumeCashe.take(tID);
                            if (lastVol.value == volVal) {
                            }
                            else {
                                lastVol.value = volVal;
                                let newVol = '' + volVal + '%';
                                for (let ii = 0; ii <= timeIndex; ii++) {
                                    if (!(schedule.series[ii])) {
                                        schedule.series[ii] = { duration: 1, items: [], states: [] };
                                    }
                                }
                                schedule.series[timeIndex].states.push({
                                    skip: item.skip,
                                    filterId: tID,
                                    data: newVol
                                });
                            }
                        }
                    }
                    for (let ii = 0; ii <= timeIndex; ii++) {
                        if (!(schedule.series[ii])) {
                            schedule.series[ii] = { duration: 1, items: [], states: [] };
                        }
                    }
                    schedule.series[timeIndex].items.push(item);
                    let exsts = false;
                    for (let ch = 0; ch < schedule.channels.length; ch++) {
                        if (schedule.channels[ch].id == channelId) {
                            exsts = true;
                            break;
                        }
                    }
                    if (!exsts) {
                        if (miditrack.channelNum == 9) {
                            let drumNum = note.points[0].pitch;
                            let performerKind = 'drums_performer_1_test';
                            if (drumNum < 35 || drumNum > 81) {
                                performerKind = 'emptySilent';
                            }
                            let volumeID = 'drum' + mt + '.' + drumNum + 'volume';
                            let tID = 'drum' + mt + '.' + drumNum + 'subVolume';
                            let comment = miditrack.title + ' [' + drumNum + ': ' + drumNames[drumNum] + ': drums]';
                            schedule.channels.push({
                                id: channelId, comment: comment, filters: [
                                    { id: volumeID, kind: 'volume_filter_1_test', properties: '100%' },
                                    { id: tID, kind: 'volume_filter_1_test', properties: '100%' }
                                ],
                                performer: { id: 'drum' + mt + '.' + drumNum + 'performer', kind: performerKind, properties: '' + drumNum }
                            });
                            for (let vv = 0; vv < miditrack.trackVolumes.length; vv++) {
                                let setIndex = Math.floor(miditrack.trackVolumes[vv].ms / 1000.0);
                                for (let ii = 0; ii <= setIndex; ii++) {
                                    if (!(schedule.series[ii])) {
                                        schedule.series[ii] = { duration: 1, items: [], states: [] };
                                    }
                                }
                                schedule.series[setIndex].states.push({
                                    skip: (Math.round(miditrack.trackVolumes[vv].ms) % 1000.0) / 1000.0,
                                    filterId: volumeID,
                                    data: '' + Math.round(100 * miditrack.trackVolumes[vv].value) + '%'
                                });
                            }
                        }
                        else {
                            let performerKind = 'waf_performer_1_test';
                            if (midinum < 1 || midinum > 128) {
                                performerKind = 'emptySilent';
                            }
                            let volumeID = 'voice' + mt + 'volume';
                            let tID = 'voice' + mt + 'subVolume';
                            let comment = miditrack.title + ' [' + midinum + ': ' + insNames[midinum - 1] + ']';
                            schedule.channels.push({
                                id: channelId, comment: comment, filters: [
                                    { id: volumeID, kind: 'volume_filter_1_test', properties: '100%' },
                                    { id: tID, kind: 'volume_filter_1_test', properties: '100%' }
                                ],
                                performer: { id: 'voice' + mt + 'performer', kind: performerKind, properties: '' + midinum }
                            });
                            for (let vv = 0; vv < miditrack.trackVolumes.length; vv++) {
                                let setIndex = Math.floor(miditrack.trackVolumes[vv].ms / 1000.0);
                                for (let ii = 0; ii <= setIndex; ii++) {
                                    if (!(schedule.series[ii])) {
                                        schedule.series[ii] = { duration: 1, items: [], states: [] };
                                    }
                                }
                                schedule.series[setIndex].states.push({
                                    skip: (Math.round(miditrack.trackVolumes[vv].ms) % 1000.0) / 1000.0,
                                    filterId: volumeID,
                                    data: '' + Math.round(100 * miditrack.trackVolumes[vv].value) + '%'
                                });
                            }
                        }
                    }
                }
            }
        }
        console.log(volumeCashe);
        return schedule;
    }
}
//# sourceMappingURL=mzxbx.js.map