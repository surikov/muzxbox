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
let testIonianC = {
    basePitch: 0,
    step2: 2,
    step3: 2,
    step4: 1,
    step5: 2,
    step6: 2,
    step7: 2
};
let testMetre44 = {
    count: 4,
    part: 4
};
let testSongProject = {
    title: "Test song",
    timeline: [
        { tempo: 120, metre: testMetre44, scale: testIonianC },
        { tempo: 120, metre: testMetre44, scale: testIonianC },
        { tempo: 120, metre: testMetre44, scale: testIonianC },
        { tempo: 120, metre: testMetre44, scale: testIonianC }
    ],
    tracks: [],
    percussions: [],
    filters: [
        {
            id: "simple_volume",
            data: "0.77"
        }
    ]
};
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
    startTest() {
        console.log('start test');
        let player = new SchedulePlayer();
        player.filters.push({ plugin: null, id: 'test111', kind: 'volume_filter_1_test' });
        player.filters.push({ plugin: null, id: 'test22', kind: 'volume_filter_1_test' });
        player.filters.push({ plugin: null, id: 'test333', kind: 'echo_filter_1_test' });
        player.startSetupPlugins();
    }
}
class SchedulePlayer {
    constructor() {
        this.position = 0;
        this.schedule = null;
        this.performers = [];
        this.filters = [];
        this.pluginURLs = [
            { kind: 'volume_filter_1_test', functionName: 'testPluginForVolume1', url: './plugins/filters/testvolume.js' },
            { kind: 'compressor_filter_1_test', functionName: 'testPluginForCompressor1', url: './plugins/filters/testcompr.js' },
            { kind: 'echo_filter_1_test', functionName: 'testPluginForEcho1', url: './plugins/filters/testecho.js' },
            { kind: 'waf_ins_performer_1_test', functionName: 'testPluginForInstrum1', url: './plugins/performer/testins.js' },
            { kind: 'waf_drums_performer_1_test', functionName: 'testPluginForDrum1', url: './plugins/performer/testperc.js' }
        ];
    }
    setup(context, schedule) {
        this.audioContext = context;
        this.schedule = schedule;
        this.startSetupPlugins();
    }
    startSetupPlugins() {
        if (this.schedule) {
            for (let ff = 0; ff < this.schedule.filters.length; ff++) {
                let filter = this.schedule.filters[ff];
                this.сollectFilterPlugin(filter.id, filter.kind);
            }
            for (let ch = 0; ch < this.schedule.channels.length; ch++) {
                let performer = this.schedule.channels[ch].performer;
                this.сollectPerformerPlugin(performer.id, performer.kind);
                for (let ff = 0; ff < this.schedule.channels[ch].filters.length; ff++) {
                    let filter = this.schedule.channels[ch].filters[ff];
                    this.сollectFilterPlugin(filter.id, filter.kind);
                }
            }
        }
        this.startLoadCollectedPlugins();
    }
    сollectFilterPlugin(id, kind) {
        for (let ii = 0; ii < this.filters.length; ii++) {
            if (this.filters[ii].id == id) {
                return;
            }
        }
        this.filters.push({ plugin: null, id: id, kind: kind });
    }
    сollectPerformerPlugin(id, kind) {
        for (let ii = 0; ii < this.performers.length; ii++) {
            if (this.performers[ii].id == id) {
                return;
            }
        }
        this.performers.push({ plugin: null, id: id, kind: kind });
    }
    tryToCreateFilter(functionName) {
        if (window[functionName]) {
            let exe = window[functionName];
            let plugin = exe();
            return plugin;
        }
        else {
            console.log('no ', functionName);
            return null;
        }
    }
    waitLoadFilter(functionName, filterItem) {
        let plugin = this.tryToCreateFilter(functionName);
        if (plugin) {
            this.setItemFilterPluginAndNext(plugin, filterItem);
        }
        else {
            setTimeout(() => {
                this.waitLoadFilter(functionName, filterItem);
            }, 333);
        }
    }
    setItemFilterPluginAndNext(plugin, filterItem) {
        filterItem.plugin = plugin;
        this.startLoadCollectedPlugins();
    }
    startLoadFilter(filterItem) {
        for (let ll = 0; ll < this.pluginURLs.length; ll++) {
            if (this.pluginURLs[ll].kind == filterItem.kind) {
                let plugin = this.tryToCreateFilter(this.pluginURLs[ll].functionName);
                if (plugin) {
                    this.setItemFilterPluginAndNext(plugin, filterItem);
                }
                else {
                    var rr = document.createElement('script');
                    rr.setAttribute("type", "text/javascript");
                    rr.setAttribute("src", this.pluginURLs[ll].url);
                    document.getElementsByTagName("head")[0].appendChild(rr);
                    this.waitLoadFilter(this.pluginURLs[ll].functionName, filterItem);
                    return;
                }
            }
        }
    }
    startLoadCollectedPlugins() {
        for (let ff = 0; ff < this.filters.length; ff++) {
            if (this.filters[ff].plugin) {
            }
            else {
                this.startLoadFilter(this.filters[ff]);
                return;
            }
        }
    }
    start(from, position, to) {
        return false;
    }
    cancel() {
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
//# sourceMappingURL=base.js.map