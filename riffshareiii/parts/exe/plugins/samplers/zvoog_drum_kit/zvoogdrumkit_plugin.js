"use strict";
class ZDRWebAudioFontLoader {
    constructor() {
        this.cached = [];
        this.drumNamesArray = [];
        this.drumKeyArray = [];
    }
    startLoad(audioContext, filePath, variableName) {
        if (window[variableName]) {
            return;
        }
        for (var i = 0; i < this.cached.length; i++) {
            if (this.cached[i].variableName == variableName) {
                return;
            }
        }
        this.cached.push({
            filePath: filePath,
            variableName: variableName
        });
        var r = document.createElement('script');
        r.setAttribute("type", "text/javascript");
        r.setAttribute("src", filePath);
        document.getElementsByTagName("head")[0].appendChild(r);
        this.decodeAfterLoading(audioContext, variableName);
    }
    ;
    adjustPreset(audioContext, preset) {
        for (var i = 0; i < preset.zones.length; i++) {
            this.adjustZone(audioContext, preset.zones[i]);
        }
    }
    adjustZone(audioContext, zone) {
        if (zone.buffer) {
        }
        else {
            if (zone.sample) {
                var decoded = atob(zone.sample);
                zone.buffer = audioContext.createBuffer(1, decoded.length / 2, zone.sampleRate);
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
                    audioContext.decodeAudioData(arraybuffer, function (audioBuffer) {
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
    decodeAfterLoading(audioContext, variableName) {
        var me = this;
        this.waitOrFinish(variableName, function () {
            me.adjustPreset(audioContext, window[variableName]);
        });
    }
    ;
    waitOrFinish(variableName, onFinish) {
        if (window[variableName]) {
            onFinish();
        }
        else {
            var me = this;
            setTimeout(function () {
                me.waitOrFinish(variableName, onFinish);
            }, 111);
        }
    }
    ;
    loaded(variableName) {
        if (!(window[variableName])) {
            return false;
        }
        var preset = window[variableName];
        for (var i = 0; i < preset.zones.length; i++) {
            if (!(preset.zones[i].buffer)) {
                return false;
            }
        }
        return true;
    }
    ;
    progress() {
        if (this.cached.length > 0) {
            for (var k = 0; k < this.cached.length; k++) {
                if (!this.loaded(this.cached[k].variableName)) {
                    return k / this.cached.length;
                }
            }
            return 1;
        }
        else {
            return 1;
        }
    }
    ;
    waitLoad(onFinish) {
        var me = this;
        if (this.progress() >= 0) {
            onFinish();
        }
        else {
            setTimeout(function () {
                me.waitLoad(onFinish);
            }, 333);
        }
    }
    ;
    drumTitles() {
        if (this.drumNamesArray.length == 0) {
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
            this.drumNamesArray = drumNames;
        }
        return this.drumNamesArray;
    }
    ;
    drumKeys() {
        if (this.drumKeyArray.length == 0) {
            this.drumKeyArray = [
                '35_0_Chaos_sf2_file', '35_12_JCLive_sf2_file', '35_16_JCLive_sf2_file', '35_18_JCLive_sf2_file', '35_4_Chaos_sf2_file',
                '36_0_SBLive_sf2', '36_12_JCLive_sf2_file', '36_16_JCLive_sf2_file', '36_18_JCLive_sf2_file', '36_4_Chaos_sf2_file',
                '37_0_SBLive_sf2', '37_12_JCLive_sf2_file', '37_16_JCLive_sf2_file', '37_18_JCLive_sf2_file', '37_4_Chaos_sf2_file',
                '38_16_JCLive_sf2_file', '38_0_SBLive_sf2', '38_12_JCLive_sf2_file', '38_18_JCLive_sf2_file', '38_4_Chaos_sf2_file',
                '39_0_SBLive_sf2', '39_12_JCLive_sf2_file', '39_16_JCLive_sf2_file', '39_18_JCLive_sf2_file', '39_4_Chaos_sf2_file',
                '40_18_JCLive_sf2_file', '40_0_SBLive_sf2', '40_12_JCLive_sf2_file', '40_16_JCLive_sf2_file', '40_4_Chaos_sf2_file',
                '41_0_SBLive_sf2', '41_12_JCLive_sf2_file', '41_16_JCLive_sf2_file', '41_18_JCLive_sf2_file', '41_4_Chaos_sf2_file',
                '42_0_SBLive_sf2', '42_12_JCLive_sf2_file', '42_16_JCLive_sf2_file', '42_18_JCLive_sf2_file', '42_4_Chaos_sf2_file',
                '43_0_SBLive_sf2', '43_12_JCLive_sf2_file', '43_16_JCLive_sf2_file', '43_18_JCLive_sf2_file', '43_4_Chaos_sf2_file',
                '44_0_SBLive_sf2', '44_12_JCLive_sf2_file', '44_16_JCLive_sf2_file', '44_18_JCLive_sf2_file', '44_4_Chaos_sf2_file',
                '45_0_SBLive_sf2', '45_12_JCLive_sf2_file', '45_16_JCLive_sf2_file', '45_18_JCLive_sf2_file', '45_4_Chaos_sf2_file',
                '46_0_SBLive_sf2', '46_12_JCLive_sf2_file', '46_16_JCLive_sf2_file', '46_18_JCLive_sf2_file', '46_4_Chaos_sf2_file',
                '47_0_SBLive_sf2', '47_12_JCLive_sf2_file', '47_16_JCLive_sf2_file', '47_18_JCLive_sf2_file', '47_4_Chaos_sf2_file',
                '48_0_SBLive_sf2', '48_12_JCLive_sf2_file', '48_16_JCLive_sf2_file', '48_18_JCLive_sf2_file', '48_4_Chaos_sf2_file',
                '49_4_Chaos_sf2_file', '49_0_SBLive_sf2', '49_12_JCLive_sf2_file', '49_16_JCLive_sf2_file', '49_18_JCLive_sf2_file',
                '50_0_SBLive_sf2', '50_12_JCLive_sf2_file', '50_16_JCLive_sf2_file', '50_18_JCLive_sf2_file', '50_4_Chaos_sf2_file',
                '51_0_SBLive_sf2', '51_12_JCLive_sf2_file', '51_16_JCLive_sf2_file', '51_18_JCLive_sf2_file', '51_4_Chaos_sf2_file',
                '52_0_SBLive_sf2', '52_12_JCLive_sf2_file', '52_16_JCLive_sf2_file', '52_18_JCLive_sf2_file', '52_4_Chaos_sf2_file',
                '53_0_SBLive_sf2', '53_12_JCLive_sf2_file', '53_16_JCLive_sf2_file', '53_18_JCLive_sf2_file', '53_4_Chaos_sf2_file',
                '54_0_SBLive_sf2', '54_12_JCLive_sf2_file', '54_16_JCLive_sf2_file', '54_18_JCLive_sf2_file', '54_4_Chaos_sf2_file',
                '55_0_SBLive_sf2', '55_12_JCLive_sf2_file', '55_16_JCLive_sf2_file', '55_18_JCLive_sf2_file', '55_4_Chaos_sf2_file',
                '56_0_SBLive_sf2', '56_12_JCLive_sf2_file', '56_16_JCLive_sf2_file', '56_18_JCLive_sf2_file', '56_4_Chaos_sf2_file',
                '57_4_Chaos_sf2_file', '57_0_SBLive_sf2', '57_12_JCLive_sf2_file', '57_16_JCLive_sf2_file', '57_18_JCLive_sf2_file',
                '58_0_SBLive_sf2', '58_12_JCLive_sf2_file', '58_16_JCLive_sf2_file', '58_18_JCLive_sf2_file', '58_4_Chaos_sf2_file',
                '59_0_SBLive_sf2', '59_12_JCLive_sf2_file', '59_16_JCLive_sf2_file', '59_18_JCLive_sf2_file', '59_4_Chaos_sf2_file',
                '60_0_SBLive_sf2', '60_12_JCLive_sf2_file', '60_16_JCLive_sf2_file', '60_18_JCLive_sf2_file', '60_4_Chaos_sf2_file',
                '61_0_SBLive_sf2', '61_12_JCLive_sf2_file', '61_16_JCLive_sf2_file', '61_18_JCLive_sf2_file', '61_4_Chaos_sf2_file',
                '62_0_SBLive_sf2', '62_12_JCLive_sf2_file', '62_16_JCLive_sf2_file', '62_18_JCLive_sf2_file', '62_4_Chaos_sf2_file',
                '63_0_SBLive_sf2', '63_12_JCLive_sf2_file', '63_16_JCLive_sf2_file', '63_18_JCLive_sf2_file', '63_4_Chaos_sf2_file',
                '64_0_SBLive_sf2', '64_12_JCLive_sf2_file', '64_16_JCLive_sf2_file', '64_18_JCLive_sf2_file', '64_4_Chaos_sf2_file',
                '65_0_SBLive_sf2', '65_12_JCLive_sf2_file', '65_16_JCLive_sf2_file', '65_18_JCLive_sf2_file', '65_4_Chaos_sf2_file',
                '66_0_SBLive_sf2', '66_12_JCLive_sf2_file', '66_16_JCLive_sf2_file', '66_18_JCLive_sf2_file', '66_4_Chaos_sf2_file',
                '67_0_SBLive_sf2', '67_12_JCLive_sf2_file', '67_16_JCLive_sf2_file', '67_18_JCLive_sf2_file', '67_4_Chaos_sf2_file',
                '68_0_SBLive_sf2', '68_12_JCLive_sf2_file', '68_16_JCLive_sf2_file', '68_18_JCLive_sf2_file', '68_4_Chaos_sf2_file',
                '69_0_SBLive_sf2', '69_12_JCLive_sf2_file', '69_16_JCLive_sf2_file', '69_18_JCLive_sf2_file', '69_4_Chaos_sf2_file',
                '70_0_SBLive_sf2', '70_12_JCLive_sf2_file', '70_16_JCLive_sf2_file', '70_18_JCLive_sf2_file', '70_4_Chaos_sf2_file',
                '71_0_SBLive_sf2', '71_12_JCLive_sf2_file', '71_16_JCLive_sf2_file', '71_18_JCLive_sf2_file', '71_4_Chaos_sf2_file',
                '72_0_SBLive_sf2', '72_12_JCLive_sf2_file', '72_16_JCLive_sf2_file', '72_18_JCLive_sf2_file', '72_4_Chaos_sf2_file',
                '73_0_SBLive_sf2', '73_12_JCLive_sf2_file', '73_16_JCLive_sf2_file', '73_18_JCLive_sf2_file', '73_4_Chaos_sf2_file',
                '74_0_SBLive_sf2', '74_12_JCLive_sf2_file', '74_16_JCLive_sf2_file', '74_18_JCLive_sf2_file', '74_4_Chaos_sf2_file',
                '75_0_SBLive_sf2', '75_12_JCLive_sf2_file', '75_16_JCLive_sf2_file', '75_18_JCLive_sf2_file', '75_4_Chaos_sf2_file',
                '76_0_SBLive_sf2', '76_12_JCLive_sf2_file', '76_16_JCLive_sf2_file', '76_18_JCLive_sf2_file', '76_4_Chaos_sf2_file',
                '77_0_SBLive_sf2', '77_12_JCLive_sf2_file', '77_16_JCLive_sf2_file', '77_18_JCLive_sf2_file', '77_4_Chaos_sf2_file',
                '78_0_SBLive_sf2', '78_12_JCLive_sf2_file',
                '78_16_JCLive_sf2_file', '78_18_JCLive_sf2_file', '78_4_Chaos_sf2_file',
                '79_0_SBLive_sf2', '79_12_JCLive_sf2_file', '79_16_JCLive_sf2_file', '79_18_JCLive_sf2_file', '79_4_Chaos_sf2_file',
                '80_0_SBLive_sf2', '80_12_JCLive_sf2_file', '80_16_JCLive_sf2_file', '80_18_JCLive_sf2_file', '80_4_Chaos_sf2_file',
                '81_0_SBLive_sf2', '81_12_JCLive_sf2_file', '81_16_JCLive_sf2_file', '81_18_JCLive_sf2_file', '81_4_Chaos_sf2_file'
            ];
        }
        return this.drumKeyArray;
    }
    ;
    drumInfo(n) {
        var key = this.drumKeys()[n];
        var p = 1 * parseInt(key.substring(0, 2));
        return {
            variable: '_drum_' + key,
            url: 'https://surikov.github.io/webaudiofontdata/sound/128' + key + '.js',
            pitch: p,
            title: this.drumTitles()[p]
        };
    }
    ;
    findDrum(midinu) {
        for (var i = 0; i < this.drumKeys().length; i++) {
            if (midinu == 1 * parseInt(this.drumKeys()[i].substring(0, 2))) {
                return i;
            }
        }
        return 0;
    }
}
class ZDRWebAudioFontPlayer {
    constructor() {
        this.envelopes = [];
        this.loader = new ZDRWebAudioFontLoader();
        this.afterTime = 0.05;
        this.nearZero = 0.000001;
    }
    limitVolume(volume) {
        if (volume) {
            volume = 1.0 * volume;
        }
        else {
            volume = 0.5;
        }
        return volume;
    }
    ;
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
    queueWaveTable(audioContext, target, preset, when, pitch, duration, volume) {
        this.resumeContext(audioContext);
        volume = this.limitVolume(volume);
        var zone = this.findZone(audioContext, preset, pitch);
        if (zone) {
            if (!(zone.buffer)) {
                console.log('empty buffer ', zone);
                return null;
            }
            var baseDetune = zone.originalPitch - 100.0 * zone.coarseTune - zone.fineTune;
            var playbackRate = 1.0 * Math.pow(2, (100.0 * pitch - baseDetune) / 1200.0);
            var startWhen = when;
            if (startWhen < audioContext.currentTime) {
                startWhen = audioContext.currentTime;
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
            var envelope = this.findEnvelope(audioContext, target);
            this.setupEnvelope(audioContext, envelope, zone, volume, startWhen, waveDuration, duration);
            envelope.audioBufferSourceNode = audioContext.createBufferSource();
            envelope.audioBufferSourceNode.playbackRate.setValueAtTime(playbackRate, 0);
            envelope.audioBufferSourceNode.buffer = zone.buffer;
            if (loop) {
                envelope.audioBufferSourceNode.loop = true;
                envelope.audioBufferSourceNode.loopStart = zone.loopStart / zone.sampleRate;
                envelope.audioBufferSourceNode.loopEnd = zone.loopEnd / zone.sampleRate;
            }
            else {
                envelope.audioBufferSourceNode.loop = false;
            }
            envelope.audioBufferSourceNode.connect(envelope);
            envelope.audioBufferSourceNode.start(startWhen);
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
    noZeroVolume(n) {
        if (n > this.nearZero) {
            return n;
        }
        else {
            return this.nearZero;
        }
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
    numValue(aValue, defValue) {
        if (typeof aValue === "number") {
            return aValue;
        }
        else {
            return defValue;
        }
    }
    ;
    findEnvelope(audioContext, target) {
        var envelope = null;
        for (var i = 0; i < this.envelopes.length; i++) {
            var e = this.envelopes[i];
            if (e.target == target && audioContext.currentTime > e.when + e.duration + 0.001) {
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
            envelope.target = target;
            envelope.connect(target);
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
    findZone(audioContext, preset, pitch) {
        var zone = null;
        for (var i = preset.zones.length - 1; i >= 0; i--) {
            zone = preset.zones[i];
            if (zone.keyRangeLow <= pitch && zone.keyRangeHigh + 1 >= pitch) {
                break;
            }
        }
        try {
            if (zone)
                this.loader.adjustZone(audioContext, zone);
        }
        catch (ex) {
            console.log('adjustZone', ex);
        }
        return zone;
    }
    ;
    cancelQueue(audioContext) {
        for (var i = 0; i < this.envelopes.length; i++) {
            var e = this.envelopes[i];
            e.gain.cancelScheduledValues(0);
            e.gain.setValueAtTime(this.nearZero, audioContext.currentTime);
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
    ;
}
console.log('ZvoogDrumKit v1.0');
class ZvoogDrumKitImplementation {
    constructor() {
        this.player = new ZDRWebAudioFontPlayer();
        this.loader = new ZDRWebAudioFontLoader();
        this.preset = null;
        this.sampleDuration = 0.000001;
        this.loudness = 0.5;
    }
    launch(context, parameters) {
        this.preset = null;
        this.audioContext = context;
        this.volumeNode = this.audioContext.createGain();
        let split = parameters.split('/');
        let idx = 0;
        if (split.length > 1) {
            let listidx = parseInt(split[1]);
            idx = listidx;
        }
        else {
            let midiidx = parseInt(parameters);
            idx = this.loader.findDrum(midiidx);
        }
        if (split.length > 2) {
            if (split[2].length > 0) {
                this.loudness = 0.01 * (0.0 + parseInt(split[2]));
            }
        }
        this.volumeNode.gain.setValueAtTime(this.loudness, 0);
        this.info = this.loader.drumInfo(idx);
        this.loader.startLoad(context, this.info.url, this.info.variable);
        this.loader.waitLoad(() => {
            this.preset = window[this.info.variable];
        });
    }
    busy() {
        if (this.preset == null) {
            return 'empty preset';
        }
        else {
            if (!this.loader.loaded(this.info.variable)) {
                return 'no ' + this.info.variable;
            }
            else {
                if (this.preset) {
                    if (this.preset.zones.length > 0) {
                        if (this.preset.zones[0].buffer) {
                            this.sampleDuration = this.preset.zones[0].buffer.duration;
                        }
                    }
                }
                return null;
            }
        }
    }
    start(when, tempo) {
        if (this.audioContext) {
            if (this.volumeNode) {
                if (this.preset) {
                    when = when + Math.random() * 1 / tempo;
                    let rlevel = 1 + 0.15 * Math.random();
                    this.player.queueWaveTable(this.audioContext, this.volumeNode, this.preset, when, this.info.pitch, this.sampleDuration + 0.001, rlevel);
                }
            }
        }
    }
    cancel() {
        this.player.cancelQueue(this.audioContext);
    }
    output() {
        if (this.volumeNode) {
            return this.volumeNode;
        }
        else {
            return null;
        }
    }
    duration() {
        return this.sampleDuration;
    }
}
class ZDUI {
    constructor() {
        this.id = '';
        this.data = '';
        this.player = new ZDRWebAudioFontPlayer();
    }
    init() {
        window.addEventListener('message', this.receiveHostMessage.bind(this), false);
        this.sendMessageToHost('');
        this.list = document.getElementById('drlist');
        this.player = new ZDRWebAudioFontPlayer();
        let drms = this.player.loader.drumKeys();
        this.voluctrl = document.getElementById('voluctrl');
        for (let ii = 0; ii < drms.length; ii++) {
            var option = document.createElement('option');
            option.value = '' + ii;
            let midi = parseInt(drms[ii].substring(0, 2));
            option.innerHTML = drms[ii] + ": " + this.player.loader.drumTitles()[midi];
            this.list.appendChild(option);
        }
        this.list.addEventListener('change', (event) => {
            let msg = '0/' + this.list.value + '/' + this.voluctrl.value;
            this.sendMessageToHost(msg);
        });
        this.voluctrl.addEventListener('change', (event) => {
            let msg = '0/' + this.list.value + '/' + this.voluctrl.value;
            this.sendMessageToHost(msg);
        });
    }
    sendMessageToHost(data) {
        var message = { dialogID: this.id, pluginData: data, done: false };
        console.log('set drum', data);
        window.parent.postMessage(message, '*');
    }
    receiveHostMessage(messageEvent) {
        let message = messageEvent.data;
        if (this.id) {
            this.setState(message.hostData);
        }
        else {
            this.setMessagingId(message.hostData);
        }
    }
    setMessagingId(newId) {
        this.id = newId;
    }
    setState(data) {
        this.data = data;
        let split = this.data.split('/');
        if (split.length > 1) {
            this.list.value = parseInt(split[1]);
        }
        else {
            this.list.value = this.player.loader.findDrum(parseInt(split[0]));
        }
        this.voluctrl.value = 95;
        if (split.length > 2) {
            if (split[2].length > 0) {
                this.voluctrl.value = parseInt(split[2]);
            }
        }
    }
}
function newZvoogDrumKitImplementation() {
    return new ZvoogDrumKitImplementation();
}
function initZDRUI() {
    new ZDUI().init();
}
//# sourceMappingURL=zvoogdrumkit_plugin.js.map