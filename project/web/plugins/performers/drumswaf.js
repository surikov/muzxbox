"use strict";
var WAFMIDIDrumURLs = [];
WAFMIDIDrumURLs[35] = { name: "35_0_Chaos_sf2_file", volume: 0.99 };
WAFMIDIDrumURLs[36] = { name: "36_0_SBLive_sf2", volume: 0.99 };
WAFMIDIDrumURLs[37] = { name: "37_0_SBLive_sf2", volume: 0.99 };
WAFMIDIDrumURLs[38] = { name: "38_0_SBLive_sf2", volume: 0.99 };
WAFMIDIDrumURLs[39] = { name: "39_0_SBLive_sf2", volume: 0.99 };
WAFMIDIDrumURLs[40] = { name: "40_0_SBLive_sf2", volume: 0.99 };
WAFMIDIDrumURLs[41] = { name: "41_0_SBLive_sf2", volume: 0.99 };
WAFMIDIDrumURLs[42] = { name: "42_0_SBLive_sf2", volume: 0.99 };
WAFMIDIDrumURLs[43] = { name: "43_0_SBLive_sf2", volume: 0.99 };
WAFMIDIDrumURLs[44] = { name: "44_0_SBLive_sf2", volume: 0.99 };
WAFMIDIDrumURLs[45] = { name: "45_0_SBLive_sf2", volume: 0.99 };
WAFMIDIDrumURLs[46] = { name: "46_0_SBLive_sf2", volume: 0.99 };
WAFMIDIDrumURLs[47] = { name: "47_0_SBLive_sf2", volume: 0.99 };
WAFMIDIDrumURLs[48] = { name: "48_0_SBLive_sf2", volume: 0.99 };
WAFMIDIDrumURLs[49] = { name: "49_0_SBLive_sf2", volume: 0.99 };
WAFMIDIDrumURLs[50] = { name: "50_0_SBLive_sf2", volume: 0.99 };
WAFMIDIDrumURLs[51] = { name: "51_0_SBLive_sf2", volume: 0.99 };
WAFMIDIDrumURLs[52] = { name: "52_0_SBLive_sf2", volume: 0.99 };
WAFMIDIDrumURLs[53] = { name: "53_0_SBLive_sf2", volume: 0.99 };
WAFMIDIDrumURLs[54] = { name: "54_0_SBLive_sf2", volume: 0.99 };
WAFMIDIDrumURLs[55] = { name: "55_0_SBLive_sf2", volume: 0.99 };
WAFMIDIDrumURLs[56] = { name: "56_0_SBLive_sf2", volume: 0.99 };
WAFMIDIDrumURLs[57] = { name: "57_0_SBLive_sf2", volume: 0.99 };
WAFMIDIDrumURLs[58] = { name: "58_0_SBLive_sf2", volume: 0.99 };
WAFMIDIDrumURLs[59] = { name: "59_0_SBLive_sf2", volume: 0.99 };
WAFMIDIDrumURLs[60] = { name: "60_0_SBLive_sf2", volume: 0.99 };
WAFMIDIDrumURLs[61] = { name: "61_0_SBLive_sf2", volume: 0.99 };
WAFMIDIDrumURLs[62] = { name: "62_0_SBLive_sf2", volume: 0.99 };
WAFMIDIDrumURLs[63] = { name: "63_0_SBLive_sf2", volume: 0.99 };
WAFMIDIDrumURLs[64] = { name: "64_0_SBLive_sf2", volume: 0.99 };
WAFMIDIDrumURLs[65] = { name: "65_0_SBLive_sf2", volume: 0.99 };
WAFMIDIDrumURLs[66] = { name: "66_0_SBLive_sf2", volume: 0.99 };
WAFMIDIDrumURLs[67] = { name: "67_0_SBLive_sf2", volume: 0.99 };
WAFMIDIDrumURLs[68] = { name: "68_0_SBLive_sf2", volume: 0.99 };
WAFMIDIDrumURLs[69] = { name: "69_0_SBLive_sf2", volume: 0.99 };
WAFMIDIDrumURLs[70] = { name: "70_0_SBLive_sf2", volume: 0.99 };
WAFMIDIDrumURLs[71] = { name: "71_0_SBLive_sf2", volume: 0.99 };
WAFMIDIDrumURLs[72] = { name: "72_0_SBLive_sf2", volume: 0.99 };
WAFMIDIDrumURLs[73] = { name: "73_0_SBLive_sf2", volume: 0.99 };
WAFMIDIDrumURLs[74] = { name: "74_0_SBLive_sf2", volume: 0.99 };
WAFMIDIDrumURLs[75] = { name: "75_0_SBLive_sf2", volume: 0.99 };
WAFMIDIDrumURLs[76] = { name: "76_0_SBLive_sf2", volume: 0.99 };
WAFMIDIDrumURLs[77] = { name: "77_0_SBLive_sf2", volume: 0.99 };
WAFMIDIDrumURLs[78] = { name: "78_0_SBLive_sf2", volume: 0.99 };
WAFMIDIDrumURLs[79] = { name: "79_0_SBLive_sf2", volume: 0.99 };
WAFMIDIDrumURLs[80] = { name: "80_0_SBLive_sf2", volume: 0.99 };
WAFMIDIDrumURLs[81] = { name: "81_0_SBLive_sf2", volume: 0.99 };
class PerformerPluginDrums {
    constructor() {
        this.midiDrum = -1;
        this.instrumentKeyArray = [];
        this.instrumentNamesArray = [];
        this.envelopes = [];
        this.afterTime = 0.05;
        this.nearZero = 0.000001;
    }
    launch(context, parameters) {
        if (!(this.out)) {
            this.audioContext = context;
            this.out = this.audioContext.createGain();
        }
        let nn = parseInt(parameters);
        if (this.midiDrum == nn) {
        }
        else {
            this.midiDrum = nn;
            this.startLoadPreset(this.midiDrum);
        }
    }
    busy() {
        if (this.presetReady(this.midiDrum)) {
            return null;
        }
        else {
            return 'wave ' + this.midiDrum + ' isn\'t ready';
        }
    }
    schedule(when, pitch, slides) {
        let info = this.instrumentInfo(this.midiDrum);
        let preset = window[info.variable];
        let rr = this.queueWaveTable(this.out, preset, when, info.pitch, slides);
    }
    output() {
        return this.out;
    }
    cancel() {
        this.cancelQueue();
    }
    startLoadPreset(nn) {
        let info = this.instrumentInfo(nn);
        let me = this;
        if (MZXBX_appendScriptURL(info.url)) {
            MZXBX_waitForCondition(250, () => { return (window[info.variable]); }, () => {
                let preset = window[info.variable];
                preset.volume = 0.0;
                if (WAFMIDIDrumURLs[nn]) {
                    preset.volume = WAFMIDIDrumURLs[nn].volume;
                }
                me.adjustPreset(preset);
            });
        }
    }
    presetReady(nn) {
        let info = this.instrumentInfo(nn);
        let loaded = window[info.variable];
        if (loaded) {
            let preset = loaded;
            for (var i = 0; i < preset.zones.length; i++) {
                if (preset.zones[i].buffer) {
                }
                else {
                    return false;
                }
            }
            return true;
        }
        else {
            return false;
        }
    }
    adjustPreset(preset) {
        for (var i = 0; i < preset.zones.length; i++) {
            this.adjustZone(preset.zones[i]);
        }
    }
    ;
    adjustZone(zone) {
        if (zone.buffer) {
        }
        else {
            zone.delay = 0;
            if (zone.sample) {
                var decoded = atob(zone.sample);
                zone.buffer = this.audioContext.createBuffer(1, decoded.length / 2, zone.sampleRate);
                var float32Array = zone.buffer.getChannelData(0);
                var b1, b2, n;
                for (var i = 0; i < decoded.length / 2; i++) {
                    b1 = decoded.charCodeAt(i * 2);
                    b2 = decoded.charCodeAt(i * 2 + 1);
                    if (b1 < 0) {
                        b1 = 256 + b1;
                    }
                    if (b2 < 0) {
                        b2 = 256 + b2;
                    }
                    n = b2 * 256 + b1;
                    if (n >= 65536 / 2) {
                        n = n - 65536;
                    }
                    float32Array[i] = n / 65536.0;
                }
            }
            else {
                if (zone.file) {
                    var datalen = zone.file.length;
                    var arraybuffer = new ArrayBuffer(datalen);
                    var view = new Uint8Array(arraybuffer);
                    var decoded = atob(zone.file);
                    var b;
                    for (var i = 0; i < decoded.length; i++) {
                        b = decoded.charCodeAt(i);
                        view[i] = b;
                    }
                    this.audioContext.decodeAudioData(arraybuffer, function (audioBuffer) {
                        zone.buffer = audioBuffer;
                    });
                }
            }
            zone.loopStart = this.numValue(zone.loopStart, 0);
            zone.loopEnd = this.numValue(zone.loopEnd, 0);
            zone.coarseTune = this.numValue(zone.coarseTune, 0);
            zone.fineTune = this.numValue(zone.fineTune, 0);
            zone.originalPitch = this.numValue(zone.originalPitch, 6000);
            zone.sampleRate = this.numValue(zone.sampleRate, 44100);
            zone.sustain = this.numValue(zone.originalPitch, 0);
        }
    }
    ;
    numValue(aValue, defValue) {
        if (typeof aValue === "number") {
            return aValue;
        }
        else {
            return defValue;
        }
    }
    ;
    findZone(audioContext, preset, pitch) {
        var zone = null;
        for (var i = preset.zones.length - 1; i >= 0; i--) {
            zone = preset.zones[i];
            if (zone.keyRangeLow <= pitch && zone.keyRangeHigh + 1 >= pitch) {
                break;
            }
        }
        return zone;
    }
    ;
    findEnvelope(audioContext, out) {
        var envelope = null;
        for (var i = 0; i < this.envelopes.length; i++) {
            var e = this.envelopes[i];
            if (e.out == out && audioContext.currentTime > e.when + e.duration + 0.001) {
                try {
                    if (e.audioBufferSourceNode) {
                        e.audioBufferSourceNode.disconnect();
                        e.audioBufferSourceNode.stop(0);
                        e.audioBufferSourceNode = null;
                    }
                }
                catch (x) {
                }
                envelope = e;
                break;
            }
        }
        if (!(envelope)) {
            envelope = audioContext.createGain();
            envelope.out = out;
            envelope.connect(out);
            envelope.cancel = function () {
                if (envelope && (envelope.when + envelope.duration > audioContext.currentTime)) {
                    envelope.gain.cancelScheduledValues(0);
                    envelope.gain.setTargetAtTime(0.00001, audioContext.currentTime, 0.1);
                    envelope.when = audioContext.currentTime + 0.00001;
                    envelope.duration = 0;
                }
            };
            this.envelopes.push(envelope);
        }
        return envelope;
    }
    ;
    setupEnvelope(audioContext, envelope, zone, volume, when, sampleDuration, noteDuration) {
        envelope.gain.setValueAtTime(this.noZeroVolume(0), audioContext.currentTime);
        var lastTime = 0;
        var lastVolume = 0;
        var duration = noteDuration;
        var zoneahdsr = zone.ahdsr;
        if (sampleDuration < duration + this.afterTime) {
            duration = sampleDuration - this.afterTime;
        }
        if (zoneahdsr) {
            if (!(zoneahdsr.length > 0)) {
                zoneahdsr = [{
                        duration: 0,
                        volume: 1
                    }, {
                        duration: 0.5,
                        volume: 1
                    }, {
                        duration: 1.5,
                        volume: 0.5
                    }, {
                        duration: 3,
                        volume: 0
                    }
                ];
            }
        }
        else {
            zoneahdsr = [{
                    duration: 0,
                    volume: 1
                }, {
                    duration: duration,
                    volume: 1
                }
            ];
        }
        var ahdsr = zoneahdsr;
        envelope.gain.cancelScheduledValues(when);
        envelope.gain.setValueAtTime(this.noZeroVolume(ahdsr[0].volume * volume), when);
        for (var i = 0; i < ahdsr.length; i++) {
            if (ahdsr[i].duration > 0) {
                if (ahdsr[i].duration + lastTime > duration) {
                    var r = 1 - (ahdsr[i].duration + lastTime - duration) / ahdsr[i].duration;
                    var n = lastVolume - r * (lastVolume - ahdsr[i].volume);
                    envelope.gain.linearRampToValueAtTime(this.noZeroVolume(volume * n), when + duration);
                    break;
                }
                lastTime = lastTime + ahdsr[i].duration;
                lastVolume = ahdsr[i].volume;
                envelope.gain.linearRampToValueAtTime(this.noZeroVolume(volume * lastVolume), when + lastTime);
            }
        }
        envelope.gain.linearRampToValueAtTime(this.noZeroVolume(0), when + duration + this.afterTime);
    }
    ;
    noZeroVolume(n) {
        if (n > this.nearZero) {
            return n;
        }
        else {
            return this.nearZero;
        }
    }
    ;
    queueWaveTable(out, preset, when, pitch, slides) {
        var zone = this.findZone(this.audioContext, preset, pitch);
        if (zone) {
            if (!(zone.buffer)) {
                console.log('empty buffer ', zone);
                return null;
            }
            var baseDetune = zone.originalPitch - 100.0 * zone.coarseTune - zone.fineTune;
            var playbackRate = 1.0 * Math.pow(2, (100.0 * pitch - baseDetune) / 1200.0);
            var startWhen = when;
            if (startWhen < this.audioContext.currentTime) {
                startWhen = this.audioContext.currentTime;
            }
            let duration = 0;
            for (let i = 0; i < slides.length; i++) {
                duration = duration + slides[i].duration;
            }
            var waveDuration = duration + this.afterTime;
            var loop = true;
            if (zone.loopStart < 1 || zone.loopStart >= zone.loopEnd) {
                loop = false;
            }
            if (!loop) {
                if (waveDuration > zone.buffer.duration / playbackRate) {
                    waveDuration = zone.buffer.duration / playbackRate;
                }
            }
            var envelope = this.findEnvelope(this.audioContext, out);
            this.setupEnvelope(this.audioContext, envelope, zone, preset.volume, startWhen, waveDuration, duration);
            envelope.audioBufferSourceNode = this.audioContext.createBufferSource();
            envelope.audioBufferSourceNode.playbackRate.setValueAtTime(playbackRate, 0);
            if (slides.length > 1) {
                for (var i = 0; i < slides.length; i++) {
                    var nextPitch = pitch + slides[i].delta;
                    var newPlaybackRate = 1.0 * Math.pow(2, (100.0 * nextPitch - baseDetune) / 1200.0);
                    var newWhen = when + slides[i].duration;
                    envelope.audioBufferSourceNode.playbackRate.linearRampToValueAtTime(newPlaybackRate, newWhen);
                }
            }
            envelope.audioBufferSourceNode.buffer = zone.buffer;
            if (loop) {
                envelope.audioBufferSourceNode.loop = true;
                envelope.audioBufferSourceNode.loopStart = zone.loopStart / zone.sampleRate + ((zone.delay) ? zone.delay : 0);
                envelope.audioBufferSourceNode.loopEnd = zone.loopEnd / zone.sampleRate + ((zone.delay) ? zone.delay : 0);
            }
            else {
                envelope.audioBufferSourceNode.loop = false;
            }
            envelope.audioBufferSourceNode.connect(envelope);
            envelope.audioBufferSourceNode.start(startWhen, zone.delay);
            envelope.audioBufferSourceNode.stop(startWhen + waveDuration);
            envelope.when = startWhen;
            envelope.duration = waveDuration;
            envelope.pitch = pitch;
            envelope.preset = preset;
            return envelope;
        }
        else {
            return null;
        }
    }
    ;
    cancelQueue() {
        for (var i = 0; i < this.envelopes.length; i++) {
            var e = this.envelopes[i];
            e.gain.cancelScheduledValues(0);
            e.gain.setValueAtTime(this.nearZero, this.audioContext.currentTime);
            e.when = -1;
            try {
                if (e.audioBufferSourceNode)
                    e.audioBufferSourceNode.disconnect();
            }
            catch (ex) {
                console.log(ex);
            }
        }
    }
    instrumentInfo(n) {
        var key = '';
        if (WAFMIDIDrumURLs[n]) {
            key = WAFMIDIDrumURLs[n].name;
        }
        if (!(key)) {
            console.log('not found drum definition for', n);
        }
        return {
            variable: '_drum_' + key,
            url: 'https://surikov.github.io/webaudiofontdata/sound/128' + key + '.js',
            pitch: n
        };
    }
    ;
}
function testPluginDrums() {
    return new PerformerPluginDrums();
}
//# sourceMappingURL=drumswaf.js.map