type PresetInstrument = {
    variable: string
    , url: string
};
type WaveZone = {
    keyRangeLow: number
    , keyRangeHigh: number
    , originalPitch: number
    , coarseTune: number
    , fineTune: number
    , loopStart: number
    , loopEnd: number
    , buffer?: AudioBuffer
    , sampleRate: number
    , delay?: number
    , ahdsr?: boolean | WaveAHDSR[]
    , sample?: string
    , file?: string
    , sustain?: number
};
type WavePreset = {
    zones: WaveZone[];
};
type WaveAHDSR = {
    duration: number
    , volume: number
};
type WaveEnvelope = {
    audioBufferSourceNode?: AudioBufferSourceNode | null
    , out: AudioNode
    , when: number
    , duration: number
    , cancel: () => void
    , pitch: number
    , preset: WavePreset
};
class PublicWAFMIDITonePerformerPlayer {
    audioContext: AudioContext;
    instrumentKeyArray: string[] = [];
    instrumentNamesArray: string[] = [];
    envelopes: WaveEnvelope[] = [];
    afterTime = 0.05;
    nearZero = 0.000001;
    setup(context: AudioContext): void {
        if (!(this.audioContext)) {
            this.audioContext = context;
        }
    }
    startLoadPreset(nn: number) {
        let info: PresetInstrument = this.instrumentInfo(nn);
        let me = this;
        if (MZXBX_appendScriptURL(info.url)) {
            MZXBX_waitForCondition(250, () => { return (window[info.variable]); }, () => {
                let preset: WavePreset = window[info.variable] as WavePreset;
                me.adjustPreset(preset);
            });
        }
    }
    presetReady(nn: number): boolean {
        let info: PresetInstrument = this.instrumentInfo(nn);
        let loaded = window[info.variable];
        if (loaded) {
            let preset: WavePreset = loaded as WavePreset;
            for (var i = 0; i < preset.zones.length; i++) {
                if (preset.zones[i].buffer) {
                    //
                } else {
                    return false;
                }
            }
            return true;
        } else {
            return false;
        }
    }
    adjustPreset(preset: WavePreset) {
        for (var i = 0; i < preset.zones.length; i++) {
            this.adjustZone(preset.zones[i]);
        }
    };
    adjustZone(zone: WaveZone) {
        if (zone.buffer) {
            //
        } else {
            zone.delay = 0;
            if (zone.sample) {
                var decoded = atob(zone.sample);
                zone.buffer = this.audioContext.createBuffer(1, decoded.length / 2, zone.sampleRate);
                var float32Array = zone.buffer.getChannelData(0);
                var b1,
                    b2,
                    n;
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
            } else {
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
    };
    numValue(aValue: any, defValue: number): number {
        if (typeof aValue === "number") {
            return aValue;
        } else {
            return defValue;
        }
    };
    findZone(audioContext: AudioContext, preset: WavePreset, pitch: number): WaveZone | null {
        var zone: WaveZone | null = null;
        for (var i = preset.zones.length - 1; i >= 0; i--) {
            zone = preset.zones[i];
            if (zone.keyRangeLow <= pitch && zone.keyRangeHigh + 1 >= pitch) {
                break;
            }
        }
        return zone;
    };
    findEnvelope(audioContext: AudioContext, out: AudioNode): WaveEnvelope {
        var envelope: WaveEnvelope | null = null;
        for (var i = 0; i < this.envelopes.length; i++) {
            var e = this.envelopes[i];
            if (e.out == out && audioContext.currentTime > e.when + e.duration + 0.001) {
                try {
                    if (e.audioBufferSourceNode) {
                        e.audioBufferSourceNode.disconnect();
                        e.audioBufferSourceNode.stop(0);
                        e.audioBufferSourceNode = null;
                    }
                } catch (x) {
                    //audioBufferSourceNode is dead already
                }
                envelope = e;
                break;
            }
        }
        if (!(envelope)) {
            envelope = (audioContext.createGain() as any) as WaveEnvelope;
            envelope.out = out;
            ((envelope as any) as GainNode).connect(out);
            envelope.cancel = function () {
                if (envelope && (envelope.when + envelope.duration > audioContext.currentTime)) {
                    ((envelope as any) as GainNode).gain.cancelScheduledValues(0);
                    ((envelope as any) as GainNode).gain.setTargetAtTime(0.00001, audioContext.currentTime, 0.1);
                    envelope.when = audioContext.currentTime + 0.00001;
                    envelope.duration = 0;
                }
            };
            this.envelopes.push(envelope);
        }
        return envelope;
    };
    setupEnvelope(audioContext: AudioContext, envelope: WaveEnvelope, zone: WaveZone, volume: number, when: number, sampleDuration: number, noteDuration: number) {
        ((envelope as any) as GainNode).gain.setValueAtTime(this.noZeroVolume(0), audioContext.currentTime);
        var lastTime = 0;
        var lastVolume = 0;
        var duration = noteDuration;
        var zoneahdsr: undefined | boolean | WaveAHDSR[] = zone.ahdsr;
        if (sampleDuration < duration + this.afterTime) {
            duration = sampleDuration - this.afterTime;
        }
        if (zoneahdsr) {
            if (!((zoneahdsr as any).length > 0)) {
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
        } else {
            zoneahdsr = [{
                duration: 0,
                volume: 1
            }, {
                duration: duration,
                volume: 1
            }
            ];
        }
        var ahdsr: WaveAHDSR[] = zoneahdsr as WaveAHDSR[];
        ((envelope as any) as GainNode).gain.cancelScheduledValues(when);
        ((envelope as any) as GainNode).gain.setValueAtTime(this.noZeroVolume(ahdsr[0].volume * volume), when);
        for (var i = 0; i < ahdsr.length; i++) {
            if (ahdsr[i].duration > 0) {
                if (ahdsr[i].duration + lastTime > duration) {
                    var r = 1 - (ahdsr[i].duration + lastTime - duration) / ahdsr[i].duration;
                    var n = lastVolume - r * (lastVolume - ahdsr[i].volume);
                    ((envelope as any) as GainNode).gain.linearRampToValueAtTime(this.noZeroVolume(volume * n), when + duration);
                    break;
                }
                lastTime = lastTime + ahdsr[i].duration;
                lastVolume = ahdsr[i].volume;
                ((envelope as any) as GainNode).gain.linearRampToValueAtTime(this.noZeroVolume(volume * lastVolume), when + lastTime);
            }
        }
        ((envelope as any) as GainNode).gain.linearRampToValueAtTime(this.noZeroVolume(0), when + duration + this.afterTime);
    };
    noZeroVolume(n: number): number {
        if (n > this.nearZero) {
            return n;
        } else {
            return this.nearZero;
        }
    };
    queueWaveTable(out: AudioNode, preset: WavePreset, when: number, pitch: number, volume: number, slides: MZXBX_SlideItem[]): WaveEnvelope | null {
        //this.resumeContext(audioContext);
        //volume = this.limitVolume(volume);
        //volume=0.0001;
        var zone: WaveZone | null = this.findZone(this.audioContext, preset, pitch);
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
            var envelope: WaveEnvelope = this.findEnvelope(this.audioContext, out);
            this.setupEnvelope(this.audioContext, envelope, zone, volume, startWhen, waveDuration, duration);
            envelope.audioBufferSourceNode = this.audioContext.createBufferSource();
            envelope.audioBufferSourceNode.playbackRate.setValueAtTime(playbackRate, 0);
            //if (slides) {
            if (slides.length > 1) {
                //envelope.audioBufferSourceNode.playbackRate.setValueAtTime(playbackRate, when);
                for (var i = 0; i < slides.length; i++) {
                    var nextPitch = pitch + slides[i].delta;
                    var newPlaybackRate = 1.0 * Math.pow(2, (100.0 * nextPitch - baseDetune) / 1200.0);
                    var newWhen = when + slides[i].duration;
                    envelope.audioBufferSourceNode.playbackRate.linearRampToValueAtTime(newPlaybackRate, newWhen);
                }
            }
            //}
            envelope.audioBufferSourceNode.buffer = zone.buffer;
            if (loop) {
                envelope.audioBufferSourceNode.loop = true;
                envelope.audioBufferSourceNode.loopStart = zone.loopStart / zone.sampleRate + ((zone.delay) ? zone.delay : 0);
                envelope.audioBufferSourceNode.loopEnd = zone.loopEnd / zone.sampleRate + ((zone.delay) ? zone.delay : 0);
            } else {
                envelope.audioBufferSourceNode.loop = false;
            }
            envelope.audioBufferSourceNode.connect((envelope as any) as GainNode);
            envelope.audioBufferSourceNode.start(startWhen, zone.delay);
            envelope.audioBufferSourceNode.stop(startWhen + waveDuration);
            envelope.when = startWhen;
            envelope.duration = waveDuration;
            envelope.pitch = pitch;
            envelope.preset = preset;
            return envelope;
        } else {
            return null
        }
    };
    cancelQueue() {
        for (var i = 0; i < this.envelopes.length; i++) {
            var e = this.envelopes[i];
            ((e as any) as GainNode).gain.cancelScheduledValues(0);
            ((e as any) as GainNode).gain.setValueAtTime(this.nearZero, this.audioContext.currentTime);
            e.when = -1;
            try {
                if (e.audioBufferSourceNode) e.audioBufferSourceNode.disconnect();
            } catch (ex) {
                console.log(ex);
            }
        }
    }
    instrumentInfo(n: number): PresetInstrument {
        var key: string = this.instrumentKeys()[n];
        if (!(key)) {
            console.log('not found instrument definition for', n);
        }
        return {
            variable: '_tone_' + key,
            url: 'https://surikov.github.io/webaudiofontdata/sound/' + key + '.js'
        };
    };

    instrumentKeys(): string[] {
        if (this.instrumentKeyArray.length == 0) {
            this.instrumentKeyArray = [
                '0000_JCLive_sf2_file', '0000_Aspirin_sf2_file', '0000_Chaos_sf2_file', '0000_FluidR3_GM_sf2_file', '0000_GeneralUserGS_sf2_file', '0000_SBLive_sf2'
                , '0000_SoundBlasterOld_sf2'
                , '0001_FluidR3_GM_sf2_file', '0001_GeneralUserGS_sf2_file', '0002_GeneralUserGS_sf2_file', '0003_GeneralUserGS_sf2_file', '0010_Aspirin_sf2_file', '0010_Chaos_sf2_file', '0010_FluidR3_GM_sf2_file', '0010_GeneralUserGS_sf2_file', '0010_JCLive_sf2_file', '0010_SBLive_sf2', '0010_SoundBlasterOld_sf2', '0011_Aspirin_sf2_file', '0011_FluidR3_GM_sf2_file', '0011_GeneralUserGS_sf2_file'
                , '0012_GeneralUserGS_sf2_file'
                , '0020_Aspirin_sf2_file', '0020_Chaos_sf2_file', '0020_FluidR3_GM_sf2_file', '0020_GeneralUserGS_sf2_file', '0020_JCLive_sf2_file', '0020_SBLive_sf2', '0020_SoundBlasterOld_sf2', '0021_Aspirin_sf2_file', '0021_GeneralUserGS_sf2_file'
                , '0022_Aspirin_sf2_file'
                , '0030_Aspirin_sf2_file', '0030_Chaos_sf2_file', '0030_FluidR3_GM_sf2_file', '0030_GeneralUserGS_sf2_file', '0030_JCLive_sf2_file', '0030_SBLive_sf2', '0030_SoundBlasterOld_sf2', '0031_Aspirin_sf2_file', '0031_FluidR3_GM_sf2_file', '0031_GeneralUserGS_sf2_file'
                , '0031_SoundBlasterOld_sf2'
                , '0040_Aspirin_sf2_file', '0040_Chaos_sf2_file', '0040_FluidR3_GM_sf2_file', '0040_GeneralUserGS_sf2_file', '0040_JCLive_sf2_file', '0040_SBLive_sf2', '0040_SoundBlasterOld_sf2', '0041_FluidR3_GM_sf2_file', '0041_GeneralUserGS_sf2_file', '0041_SoundBlasterOld_sf2', '0042_GeneralUserGS_sf2_file', '0043_GeneralUserGS_sf2_file', '0044_GeneralUserGS_sf2_file', '0045_GeneralUserGS_sf2_file'
                , '0046_GeneralUserGS_sf2_file'
                , '0050_Aspirin_sf2_file', '0050_Chaos_sf2_file', '0050_FluidR3_GM_sf2_file', '0050_GeneralUserGS_sf2_file', '0050_JCLive_sf2_file', '0050_SBLive_sf2', '0050_SoundBlasterOld_sf2', '0051_FluidR3_GM_sf2_file', '0051_GeneralUserGS_sf2_file', '0052_GeneralUserGS_sf2_file', '0053_GeneralUserGS_sf2_file'
                , '0054_GeneralUserGS_sf2_file'
                , '0060_Aspirin_sf2_file', '0060_Chaos_sf2_file', '0060_FluidR3_GM_sf2_file', '0060_GeneralUserGS_sf2_file', '0060_JCLive_sf2_file', '0060_SBLive_sf2', '0060_SoundBlasterOld_sf2', '0061_Aspirin_sf2_file', '0061_GeneralUserGS_sf2_file', '0061_SoundBlasterOld_sf2'
                , '0062_GeneralUserGS_sf2_file'
                , '0070_Aspirin_sf2_file', '0070_Chaos_sf2_file', '0070_FluidR3_GM_sf2_file', '0070_GeneralUserGS_sf2_file', '0070_JCLive_sf2_file', '0070_SBLive_sf2', '0070_SoundBlasterOld_sf2'
                , '0071_GeneralUserGS_sf2_file'
                , '0080_Aspirin_sf2_file', '0080_Chaos_sf2_file', '0080_FluidR3_GM_sf2_file', '0080_GeneralUserGS_sf2_file', '0080_JCLive_sf2_file', '0080_SBLive_sf2', '0080_SoundBlasterOld_sf2', '0081_FluidR3_GM_sf2_file', '0081_GeneralUserGS_sf2_file'
                , '0081_SoundBlasterOld_sf2'
                , '0090_Aspirin_sf2_file', '0090_Chaos_sf2_file', '0090_FluidR3_GM_sf2_file', '0090_GeneralUserGS_sf2_file'
                , '0090_JCLive_sf2_file', '0090_SBLive_sf2', '0090_SoundBlasterOld_sf2', '0091_SoundBlasterOld_sf2'
                , '0100_Aspirin_sf2_file', '0100_Chaos_sf2_file', '0100_FluidR3_GM_sf2_file'
                , '0100_GeneralUserGS_sf2_file', '0100_JCLive_sf2_file', '0100_SBLive_sf2', '0100_SoundBlasterOld_sf2', '0101_GeneralUserGS_sf2_file', '0101_SoundBlasterOld_sf2'
                , '0110_Aspirin_sf2_file'
                , '0110_Chaos_sf2_file', '0110_FluidR3_GM_sf2_file', '0110_GeneralUserGS_sf2_file', '0110_JCLive_sf2_file', '0110_SBLive_sf2', '0110_SoundBlasterOld_sf2', '0111_FluidR3_GM_sf2_file'
                , '0120_Aspirin_sf2_file', '0120_Chaos_sf2_file', '0120_FluidR3_GM_sf2_file', '0120_GeneralUserGS_sf2_file', '0120_JCLive_sf2_file', '0120_SBLive_sf2', '0120_SoundBlasterOld_sf2'
                , '0121_FluidR3_GM_sf2_file', '0121_GeneralUserGS_sf2_file', '0130_Aspirin_sf2_file', '0130_Chaos_sf2_file', '0130_FluidR3_GM_sf2_file', '0130_GeneralUserGS_sf2_file', '0130_JCLive_sf2_file'
                , '0130_SBLive_sf2', '0130_SoundBlasterOld_sf2', '0131_FluidR3_GM_sf2_file', '0140_Aspirin_sf2_file', '0140_Chaos_sf2_file', '0140_FluidR3_GM_sf2_file', '0140_GeneralUserGS_sf2_file'
                , '0140_JCLive_sf2_file', '0140_SBLive_sf2', '0140_SoundBlasterOld_sf2', '0141_FluidR3_GM_sf2_file', '0141_GeneralUserGS_sf2_file', '0142_GeneralUserGS_sf2_file', '0143_GeneralUserGS_sf2_file'
                , '0150_Aspirin_sf2_file', '0150_Chaos_sf2_file', '0150_FluidR3_GM_sf2_file', '0150_GeneralUserGS_sf2_file', '0150_JCLive_sf2_file', '0150_SBLive_sf2', '0150_SoundBlasterOld_sf2'
                , '0151_FluidR3_GM_sf2_file', '0160_Aspirin_sf2_file', '0160_Chaos_sf2_file', '0160_FluidR3_GM_sf2_file', '0160_GeneralUserGS_sf2_file', '0160_JCLive_sf2_file', '0160_SBLive_sf2'
                , '0160_SoundBlasterOld_sf2', '0161_Aspirin_sf2_file', '0161_FluidR3_GM_sf2_file', '0161_SoundBlasterOld_sf2', '0170_Aspirin_sf2_file', '0170_Chaos_sf2_file', '0170_FluidR3_GM_sf2_file'
                , '0170_GeneralUserGS_sf2_file', '0170_JCLive_sf2_file', '0170_SBLive_sf2', '0170_SoundBlasterOld_sf2', '0171_FluidR3_GM_sf2_file', '0171_GeneralUserGS_sf2_file', '0172_FluidR3_GM_sf2_file'
                , '0180_Aspirin_sf2_file', '0180_Chaos_sf2_file', '0180_FluidR3_GM_sf2_file', '0180_GeneralUserGS_sf2_file', '0180_JCLive_sf2_file', '0180_SBLive_sf2', '0180_SoundBlasterOld_sf2'
                , '0181_Aspirin_sf2_file', '0181_GeneralUserGS_sf2_file', '0181_SoundBlasterOld_sf2', '0190_Aspirin_sf2_file', '0190_Chaos_sf2_file', '0190_FluidR3_GM_sf2_file', '0190_GeneralUserGS_sf2_file'
                , '0190_JCLive_sf2_file', '0190_SBLive_sf2', '0190_SoundBlasterOld_sf2', '0191_Aspirin_sf2_file', '0191_GeneralUserGS_sf2_file', '0191_SoundBlasterOld_sf2', '0200_Aspirin_sf2_file'
                , '0200_Chaos_sf2_file', '0200_FluidR3_GM_sf2_file', '0200_GeneralUserGS_sf2_file', '0200_JCLive_sf2_file', '0200_SBLive_sf2', '0200_SoundBlasterOld_sf2', '0201_Aspirin_sf2_file'
                , '0201_FluidR3_GM_sf2_file', '0201_GeneralUserGS_sf2_file', '0201_SoundBlasterOld_sf2', '0210_Aspirin_sf2_file', '0210_Chaos_sf2_file', '0210_FluidR3_GM_sf2_file', '0210_GeneralUserGS_sf2_file'
                , '0210_JCLive_sf2_file', '0210_SBLive_sf2', '0210_SoundBlasterOld_sf2', '0211_Aspirin_sf2_file', '0211_FluidR3_GM_sf2_file', '0211_GeneralUserGS_sf2_file', '0211_SoundBlasterOld_sf2'
                , '0212_GeneralUserGS_sf2_file', '0220_Aspirin_sf2_file', '0220_Chaos_sf2_file', '0220_FluidR3_GM_sf2_file', '0220_GeneralUserGS_sf2_file', '0220_JCLive_sf2_file', '0220_SBLive_sf2'
                , '0220_SoundBlasterOld_sf2', '0221_FluidR3_GM_sf2_file', '0230_Aspirin_sf2_file', '0230_Chaos_sf2_file', '0230_FluidR3_GM_sf2_file', '0230_GeneralUserGS_sf2_file', '0230_JCLive_sf2_file'
                , '0230_SBLive_sf2', '0230_SoundBlasterOld_sf2', '0231_FluidR3_GM_sf2_file', '0231_GeneralUserGS_sf2_file', '0231_JCLive_sf2_file', '0231_SoundBlasterOld_sf2', '0232_FluidR3_GM_sf2_file'
                , '0233_FluidR3_GM_sf2_file', '0240_Aspirin_sf2_file', '0240_Chaos_sf2_file', '0240_FluidR3_GM_sf2_file', '0240_GeneralUserGS_sf2_file', '0240_JCLive_sf2_file', '0240_LK_Godin_Nylon_SF2_file'
                , '0240_SBLive_sf2', '0240_SoundBlasterOld_sf2', '0241_GeneralUserGS_sf2_file', '0241_JCLive_sf2_file', '0242_JCLive_sf2_file', '0243_JCLive_sf2_file', '0253_Acoustic_Guitar_sf2_file'
                , '0250_Aspirin_sf2_file', '0250_Chaos_sf2_file', '0250_FluidR3_GM_sf2_file', '0250_GeneralUserGS_sf2_file', '0250_JCLive_sf2_file', '0250_LK_AcousticSteel_SF2_file', '0250_SBLive_sf2'
                , '0250_SoundBlasterOld_sf2', '0251_Acoustic_Guitar_sf2_file', '0251_GeneralUserGS_sf2_file', '0252_Acoustic_Guitar_sf2_file', '0252_GeneralUserGS_sf2_file', '0253_Acoustic_Guitar_sf2_file'
                , '0253_GeneralUserGS_sf2_file', '0254_Acoustic_Guitar_sf2_file', '0254_GeneralUserGS_sf2_file', '0255_GeneralUserGS_sf2_file', '0260_Aspirin_sf2_file', '0260_Chaos_sf2_file'
                , '0260_FluidR3_GM_sf2_file', '0260_GeneralUserGS_sf2_file', '0260_JCLive_sf2_file', '0260_SBLive_sf2', '0260_SoundBlasterOld_sf2', '0260_Stratocaster_sf2_file', '0261_GeneralUserGS_sf2_file'
                , '0261_SoundBlasterOld_sf2', '0261_Stratocaster_sf2_file', '0262_Stratocaster_sf2_file', '0270_Aspirin_sf2_file', '0270_Chaos_sf2_file', '0270_FluidR3_GM_sf2_file', '0270_GeneralUserGS_sf2_file'
                , '0270_Gibson_Les_Paul_sf2_file', '0270_JCLive_sf2_file', '0270_SBAWE32_sf2_file', '0270_SBLive_sf2', '0270_SoundBlasterOld_sf2', '0270_Stratocaster_sf2_file', '0271_GeneralUserGS_sf2_file'
                , '0271_Stratocaster_sf2_file', '0272_Stratocaster_sf2_file', '0280_Aspirin_sf2_file', '0280_Chaos_sf2_file', '0280_FluidR3_GM_sf2_file', '0280_GeneralUserGS_sf2_file', '0280_JCLive_sf2_file'
                , '0280_LesPaul_sf2', '0280_LesPaul_sf2_file', '0280_SBAWE32_sf2_file', '0280_SBLive_sf2', '0280_SoundBlasterOld_sf2', '0281_Aspirin_sf2_file', '0281_FluidR3_GM_sf2_file'
                , '0281_GeneralUserGS_sf2_file', '0282_FluidR3_GM_sf2_file', '0282_GeneralUserGS_sf2_file', '0283_GeneralUserGS_sf2_file', '0290_Aspirin_sf2_file', '0290_Chaos_sf2_file', '0290_FluidR3_GM_sf2_file'
                , '0290_GeneralUserGS_sf2_file', '0290_JCLive_sf2_file', '0290_LesPaul_sf2', '0290_LesPaul_sf2_file', '0290_SBAWE32_sf2_file', '0290_SBLive_sf2', '0290_SoundBlasterOld_sf2', '0291_Aspirin_sf2_file'
                , '0291_LesPaul_sf2', '0291_LesPaul_sf2_file', '0291_SBAWE32_sf2_file', '0291_SoundBlasterOld_sf2', '0292_Aspirin_sf2_file', '0292_LesPaul_sf2', '0292_LesPaul_sf2_file', '0300_Aspirin_sf2_file'
                , '0300_Chaos_sf2_file', '0300_FluidR3_GM_sf2_file', '0300_GeneralUserGS_sf2_file', '0300_JCLive_sf2_file', '0300_LesPaul_sf2', '0300_LesPaul_sf2_file', '0300_SBAWE32_sf2_file', '0300_SBLive_sf2'
                , '0300_SoundBlasterOld_sf2', '0301_Aspirin_sf2_file', '0301_FluidR3_GM_sf2_file', '0301_GeneralUserGS_sf2_file', '0301_JCLive_sf2_file', '0301_LesPaul_sf2', '0301_LesPaul_sf2_file'
                , '0302_Aspirin_sf2_file', '0302_GeneralUserGS_sf2_file', '0302_JCLive_sf2_file', '0303_Aspirin_sf2_file', '0304_Aspirin_sf2_file', '0310_Aspirin_sf2_file', '0310_Chaos_sf2_file'
                , '0310_FluidR3_GM_sf2_file', '0310_GeneralUserGS_sf2_file', '0310_JCLive_sf2_file', '0310_LesPaul_sf2', '0310_LesPaul_sf2_file', '0310_SBAWE32_sf2_file', '0310_SBLive_sf2'
                , '0310_SoundBlasterOld_sf2', '0311_FluidR3_GM_sf2_file', '0311_GeneralUserGS_sf2_file', '0320_Aspirin_sf2_file', '0320_Chaos_sf2_file', '0320_FluidR3_GM_sf2_file', '0320_GeneralUserGS_sf2_file'
                , '0320_JCLive_sf2_file', '0320_SBLive_sf2', '0320_SoundBlasterOld_sf2', '0321_GeneralUserGS_sf2_file', '0322_GeneralUserGS_sf2_file', '0330_Aspirin_sf2_file', '0330_Chaos_sf2_file'
                , '0330_FluidR3_GM_sf2_file', '0330_GeneralUserGS_sf2_file', '0330_JCLive_sf2_file', '0330_SBLive_sf2', '0330_SoundBlasterOld_sf2', '0331_GeneralUserGS_sf2_file', '0332_GeneralUserGS_sf2_file'
                , '0340_Aspirin_sf2_file', '0340_Chaos_sf2_file', '0340_FluidR3_GM_sf2_file', '0340_GeneralUserGS_sf2_file', '0340_JCLive_sf2_file', '0340_SBLive_sf2', '0340_SoundBlasterOld_sf2'
                , '0341_Aspirin_sf2_file', '0341_GeneralUserGS_sf2_file', '0350_Aspirin_sf2_file', '0350_Chaos_sf2_file', '0350_FluidR3_GM_sf2_file', '0350_GeneralUserGS_sf2_file', '0350_JCLive_sf2_file'
                , '0350_SBLive_sf2', '0350_SoundBlasterOld_sf2', '0351_GeneralUserGS_sf2_file', '0360_Aspirin_sf2_file', '0360_Chaos_sf2_file', '0360_FluidR3_GM_sf2_file', '0360_GeneralUserGS_sf2_file'
                , '0360_JCLive_sf2_file', '0360_SBLive_sf2', '0360_SoundBlasterOld_sf2', '0361_GeneralUserGS_sf2_file', '0370_Aspirin_sf2_file', '0370_Chaos_sf2_file', '0370_FluidR3_GM_sf2_file'
                , '0370_GeneralUserGS_sf2_file', '0370_JCLive_sf2_file', '0370_SBLive_sf2', '0370_SoundBlasterOld_sf2', '0371_GeneralUserGS_sf2_file', '0372_GeneralUserGS_sf2_file'

                , '0385_GeneralUserGS_sf2_file'
                , '0380_Aspirin_sf2_file'
                , '0380_Chaos_sf2_file'
                , '0380_FluidR3_GM_sf2_file'
                , '0380_GeneralUserGS_sf2_file'
                , '0380_JCLive_sf2_file'
                , '0380_SBLive_sf2'
                , '0380_SoundBlasterOld_sf2'
                , '0381_FluidR3_GM_sf2_file'
                , '0381_GeneralUserGS_sf2_file'
                , '0382_FluidR3_GM_sf2_file'
                , '0382_GeneralUserGS_sf2_file'
                , '0383_GeneralUserGS_sf2_file'
                , '0384_GeneralUserGS_sf2_file'

                , '0386_GeneralUserGS_sf2_file'
                , '0387_GeneralUserGS_sf2_file'
                , '0390_Aspirin_sf2_file', '0390_Chaos_sf2_file', '0390_FluidR3_GM_sf2_file'
                , '0390_GeneralUserGS_sf2_file', '0390_JCLive_sf2_file', '0390_SBLive_sf2', '0390_SoundBlasterOld_sf2', '0391_FluidR3_GM_sf2_file'
                , '0391_GeneralUserGS_sf2_file', '0391_SoundBlasterOld_sf2', '0392_FluidR3_GM_sf2_file', '0392_GeneralUserGS_sf2_file'
                , '0393_GeneralUserGS_sf2_file', '0400_Aspirin_sf2_file', '0400_Chaos_sf2_file', '0400_FluidR3_GM_sf2_file', '0400_GeneralUserGS_sf2_file'
                , '0400_JCLive_sf2_file', '0400_SBLive_sf2', '0400_SoundBlasterOld_sf2', '0401_Aspirin_sf2_file', '0401_FluidR3_GM_sf2_file'
                , '0401_GeneralUserGS_sf2_file', '0402_GeneralUserGS_sf2_file', '0410_Aspirin_sf2_file', '0410_Chaos_sf2_file', '0410_FluidR3_GM_sf2_file'
                , '0410_GeneralUserGS_sf2_file', '0410_JCLive_sf2_file', '0410_SBLive_sf2', '0410_SoundBlasterOld_sf2', '0411_FluidR3_GM_sf2_file'
                , '0420_Aspirin_sf2_file', '0420_Chaos_sf2_file', '0420_FluidR3_GM_sf2_file', '0420_GeneralUserGS_sf2_file', '0420_JCLive_sf2_file'
                , '0420_SBLive_sf2', '0420_SoundBlasterOld_sf2', '0421_FluidR3_GM_sf2_file', '0421_GeneralUserGS_sf2_file', '0430_Aspirin_sf2_file'
                , '0430_Chaos_sf2_file', '0430_FluidR3_GM_sf2_file', '0430_GeneralUserGS_sf2_file', '0430_JCLive_sf2_file', '0430_SBLive_sf2'
                , '0430_SoundBlasterOld_sf2', '0431_FluidR3_GM_sf2_file', '0440_Aspirin_sf2_file', '0440_Chaos_sf2_file', '0440_FluidR3_GM_sf2_file'
                , '0440_GeneralUserGS_sf2_file', '0440_JCLive_sf2_file', '0440_SBLive_sf2'
                , '0440_SoundBlasterOld_sf2', '0441_GeneralUserGS_sf2_file', '0442_GeneralUserGS_sf2_file', '0450_Aspirin_sf2_file', '0450_Chaos_sf2_file'
                , '0450_FluidR3_GM_sf2_file'
                , '0450_GeneralUserGS_sf2_file', '0450_JCLive_sf2_file', '0450_SBLive_sf2', '0450_SoundBlasterOld_sf2', '0451_FluidR3_GM_sf2_file', '0460_Aspirin_sf2_file'
                , '0460_Chaos_sf2_file', '0460_FluidR3_GM_sf2_file', '0460_GeneralUserGS_sf2_file', '0460_JCLive_sf2_file', '0460_SBLive_sf2', '0460_SoundBlasterOld_sf2'
                , '0461_FluidR3_GM_sf2_file', '0470_Aspirin_sf2_file', '0470_Chaos_sf2_file', '0470_FluidR3_GM_sf2_file', '0470_GeneralUserGS_sf2_file', '0470_JCLive_sf2_file'
                , '0470_SBLive_sf2', '0470_SoundBlasterOld_sf2', '0471_FluidR3_GM_sf2_file', '0471_GeneralUserGS_sf2_file', '0480_Aspirin_sf2_file', '0480_Chaos_sf2_file'
                , '0480_FluidR3_GM_sf2_file', '0480_GeneralUserGS_sf2_file', '0480_JCLive_sf2_file', '0480_SBLive_sf2', '0480_SoundBlasterOld_sf2', '04810_GeneralUserGS_sf2_file'
                , '04811_GeneralUserGS_sf2_file', '04812_GeneralUserGS_sf2_file', '04813_GeneralUserGS_sf2_file', '04814_GeneralUserGS_sf2_file', '04815_GeneralUserGS_sf2_file', '04816_GeneralUserGS_sf2_file'
                , '04817_GeneralUserGS_sf2_file', '0481_Aspirin_sf2_file', '0481_FluidR3_GM_sf2_file', '0481_GeneralUserGS_sf2_file', '0482_Aspirin_sf2_file', '0482_GeneralUserGS_sf2_file'
                , '0483_GeneralUserGS_sf2_file', '0484_GeneralUserGS_sf2_file', '0485_GeneralUserGS_sf2_file', '0486_GeneralUserGS_sf2_file', '0487_GeneralUserGS_sf2_file', '0488_GeneralUserGS_sf2_file'
                , '0489_GeneralUserGS_sf2_file', '0490_Aspirin_sf2_file', '0490_Chaos_sf2_file', '0490_FluidR3_GM_sf2_file', '0490_GeneralUserGS_sf2_file', '0490_JCLive_sf2_file', '0490_SBLive_sf2'
                , '0490_SoundBlasterOld_sf2', '0491_GeneralUserGS_sf2_file', '0492_GeneralUserGS_sf2_file', '0500_Aspirin_sf2_file', '0500_Chaos_sf2_file', '0500_FluidR3_GM_sf2_file', '0500_GeneralUserGS_sf2_file'
                , '0500_JCLive_sf2_file', '0500_SBLive_sf2', '0500_SoundBlasterOld_sf2', '0501_FluidR3_GM_sf2_file', '0501_GeneralUserGS_sf2_file', '0502_FluidR3_GM_sf2_file', '0502_GeneralUserGS_sf2_file'
                , '0503_FluidR3_GM_sf2_file', '0504_FluidR3_GM_sf2_file', '0505_FluidR3_GM_sf2_file', '0510_Aspirin_sf2_file', '0510_Chaos_sf2_file', '0510_FluidR3_GM_sf2_file', '0510_GeneralUserGS_sf2_file'
                , '0510_JCLive_sf2_file', '0510_SBLive_sf2', '0510_SoundBlasterOld_sf2', '0511_GeneralUserGS_sf2_file', '0511_SoundBlasterOld_sf2', '0520_Aspirin_sf2_file', '0520_Chaos_sf2_file'
                , '0520_FluidR3_GM_sf2_file', '0520_GeneralUserGS_sf2_file', '0520_JCLive_sf2_file', '0520_SBLive_sf2', '0520_Soul_Ahhs_sf2_file', '0520_SoundBlasterOld_sf2', '0521_FluidR3_GM_sf2_file'
                , '0521_Soul_Ahhs_sf2_file', '0521_SoundBlasterOld_sf2', '0522_Soul_Ahhs_sf2_file', '0530_Aspirin_sf2_file', '0530_Chaos_sf2_file', '0530_FluidR3_GM_sf2_file', '0530_GeneralUserGS_sf2_file'
                , '0530_JCLive_sf2_file', '0530_SBLive_sf2', '0530_Soul_Ahhs_sf2_file', '0530_SoundBlasterOld_sf2', '0531_FluidR3_GM_sf2_file', '0531_GeneralUserGS_sf2_file', '0531_JCLive_sf2_file'
                , '0531_SoundBlasterOld_sf2', '0540_Aspirin_sf2_file', '0540_Chaos_sf2_file', '0540_FluidR3_GM_sf2_file', '0540_GeneralUserGS_sf2_file', '0540_JCLive_sf2_file', '0540_SBLive_sf2'
                , '0540_SoundBlasterOld_sf2', '0541_FluidR3_GM_sf2_file', '0550_Aspirin_sf2_file', '0550_Chaos_sf2_file', '0550_FluidR3_GM_sf2_file', '0550_GeneralUserGS_sf2_file', '0550_JCLive_sf2_file'
                , '0550_SBLive_sf2', '0550_SoundBlasterOld_sf2', '0551_Aspirin_sf2_file', '0551_FluidR3_GM_sf2_file', '0560_Aspirin_sf2_file', '0560_Chaos_sf2_file', '0560_FluidR3_GM_sf2_file'
                , '0560_GeneralUserGS_sf2_file', '0560_JCLive_sf2_file', '0560_SBLive_sf2', '0560_SoundBlasterOld_sf2', '0570_Aspirin_sf2_file', '0570_Chaos_sf2_file', '0570_FluidR3_GM_sf2_file'
                , '0570_GeneralUserGS_sf2_file', '0570_JCLive_sf2_file', '0570_SBLive_sf2', '0570_SoundBlasterOld_sf2', '0571_GeneralUserGS_sf2_file', '0580_Aspirin_sf2_file', '0580_Chaos_sf2_file'
                , '0580_FluidR3_GM_sf2_file', '0580_GeneralUserGS_sf2_file', '0580_JCLive_sf2_file', '0580_SBLive_sf2', '0580_SoundBlasterOld_sf2', '0581_GeneralUserGS_sf2_file', '0590_Aspirin_sf2_file'
                , '0590_Chaos_sf2_file', '0590_FluidR3_GM_sf2_file', '0590_GeneralUserGS_sf2_file', '0590_JCLive_sf2_file', '0590_SBLive_sf2', '0590_SoundBlasterOld_sf2', '0591_GeneralUserGS_sf2_file'
                , '0600_Aspirin_sf2_file', '0600_Chaos_sf2_file', '0600_FluidR3_GM_sf2_file', '0600_GeneralUserGS_sf2_file', '0600_JCLive_sf2_file', '0600_SBLive_sf2', '0600_SoundBlasterOld_sf2'
                , '0601_FluidR3_GM_sf2_file', '0601_GeneralUserGS_sf2_file', '0602_GeneralUserGS_sf2_file', '0603_GeneralUserGS_sf2_file', '0610_Aspirin_sf2_file', '0610_Chaos_sf2_file', '0610_FluidR3_GM_sf2_file'
                , '0610_GeneralUserGS_sf2_file', '0610_JCLive_sf2_file', '0610_SBLive_sf2', '0610_SoundBlasterOld_sf2', '0611_GeneralUserGS_sf2_file', '0612_GeneralUserGS_sf2_file', '0613_GeneralUserGS_sf2_file'
                , '0614_GeneralUserGS_sf2_file', '0615_GeneralUserGS_sf2_file', '0620_Aspirin_sf2_file', '0620_Chaos_sf2_file', '0620_FluidR3_GM_sf2_file', '0620_GeneralUserGS_sf2_file', '0620_JCLive_sf2_file'
                , '0620_SBLive_sf2', '0620_SoundBlasterOld_sf2', '0621_Aspirin_sf2_file', '0621_FluidR3_GM_sf2_file', '0621_GeneralUserGS_sf2_file', '0622_FluidR3_GM_sf2_file', '0622_GeneralUserGS_sf2_file'
                , '0630_Aspirin_sf2_file', '0630_Chaos_sf2_file', '0630_FluidR3_GM_sf2_file', '0630_GeneralUserGS_sf2_file', '0630_JCLive_sf2_file', '0630_SBLive_sf2', '0630_SoundBlasterOld_sf2'
                , '0631_Aspirin_sf2_file', '0631_FluidR3_GM_sf2_file', '0631_GeneralUserGS_sf2_file', '0632_FluidR3_GM_sf2_file', '0633_FluidR3_GM_sf2_file', '0640_Aspirin_sf2_file', '0640_Chaos_sf2_file'
                , '0640_FluidR3_GM_sf2_file', '0640_GeneralUserGS_sf2_file', '0640_JCLive_sf2_file', '0640_SBLive_sf2', '0640_SoundBlasterOld_sf2', '0641_FluidR3_GM_sf2_file', '0650_Aspirin_sf2_file'
                , '0650_Chaos_sf2_file', '0650_FluidR3_GM_sf2_file', '0650_GeneralUserGS_sf2_file', '0650_JCLive_sf2_file', '0650_SBLive_sf2', '0650_SoundBlasterOld_sf2', '0651_Aspirin_sf2_file'
                , '0651_FluidR3_GM_sf2_file', '0660_Aspirin_sf2_file', '0660_Chaos_sf2_file', '0660_FluidR3_GM_sf2_file', '0660_GeneralUserGS_sf2_file', '0660_JCLive_sf2_file', '0660_SBLive_sf2'
                , '0660_SoundBlasterOld_sf2', '0661_FluidR3_GM_sf2_file', '0661_GeneralUserGS_sf2_file', '0670_Aspirin_sf2_file', '0670_Chaos_sf2_file', '0670_FluidR3_GM_sf2_file', '0670_GeneralUserGS_sf2_file'
                , '0670_JCLive_sf2_file', '0670_SBLive_sf2', '0670_SoundBlasterOld_sf2', '0671_FluidR3_GM_sf2_file', '0680_Aspirin_sf2_file', '0680_Chaos_sf2_file', '0680_FluidR3_GM_sf2_file'
                , '0680_GeneralUserGS_sf2_file', '0680_JCLive_sf2_file', '0680_SBLive_sf2', '0680_SoundBlasterOld_sf2', '0681_FluidR3_GM_sf2_file', '0690_Aspirin_sf2_file', '0690_Chaos_sf2_file'
                , '0690_FluidR3_GM_sf2_file', '0690_GeneralUserGS_sf2_file', '0690_JCLive_sf2_file', '0690_SBLive_sf2', '0690_SoundBlasterOld_sf2', '0691_FluidR3_GM_sf2_file', '0700_Aspirin_sf2_file'
                , '0700_Chaos_sf2_file', '0700_FluidR3_GM_sf2_file', '0700_GeneralUserGS_sf2_file', '0700_JCLive_sf2_file', '0700_SBLive_sf2', '0700_SoundBlasterOld_sf2', '0701_FluidR3_GM_sf2_file'
                , '0701_GeneralUserGS_sf2_file', '0710_Aspirin_sf2_file', '0710_Chaos_sf2_file', '0710_FluidR3_GM_sf2_file', '0710_GeneralUserGS_sf2_file', '0710_JCLive_sf2_file', '0710_SBLive_sf2'
                , '0710_SoundBlasterOld_sf2', '0711_FluidR3_GM_sf2_file', '0720_Aspirin_sf2_file', '0720_Chaos_sf2_file', '0720_FluidR3_GM_sf2_file', '0720_GeneralUserGS_sf2_file', '0720_JCLive_sf2_file'
                , '0720_SBLive_sf2', '0720_SoundBlasterOld_sf2', '0721_FluidR3_GM_sf2_file', '0721_SoundBlasterOld_sf2', '0730_Aspirin_sf2_file', '0730_Chaos_sf2_file', '0730_FluidR3_GM_sf2_file'
                , '0730_GeneralUserGS_sf2_file', '0730_JCLive_sf2_file', '0730_SBLive_sf2', '0730_SoundBlasterOld_sf2', '0731_Aspirin_sf2_file', '0731_FluidR3_GM_sf2_file', '0731_SoundBlasterOld_sf2'
                , '0740_Aspirin_sf2_file', '0740_Chaos_sf2_file', '0740_FluidR3_GM_sf2_file', '0740_GeneralUserGS_sf2_file', '0740_JCLive_sf2_file', '0740_SBLive_sf2', '0740_SoundBlasterOld_sf2'
                , '0741_GeneralUserGS_sf2_file', '0750_Aspirin_sf2_file', '0750_Chaos_sf2_file', '0750_FluidR3_GM_sf2_file', '0750_GeneralUserGS_sf2_file', '0750_JCLive_sf2_file', '0750_SBLive_sf2'
                , '0750_SoundBlasterOld_sf2', '0751_Aspirin_sf2_file', '0751_FluidR3_GM_sf2_file', '0751_GeneralUserGS_sf2_file', '0751_SoundBlasterOld_sf2', '0760_Aspirin_sf2_file', '0760_Chaos_sf2_file'
                , '0760_FluidR3_GM_sf2_file', '0760_GeneralUserGS_sf2_file', '0760_JCLive_sf2_file', '0760_SBLive_sf2', '0760_SoundBlasterOld_sf2', '0761_FluidR3_GM_sf2_file', '0761_GeneralUserGS_sf2_file'
                , '0761_SoundBlasterOld_sf2', '0762_GeneralUserGS_sf2_file', '0770_Aspirin_sf2_file', '0770_Chaos_sf2_file', '0770_FluidR3_GM_sf2_file', '0770_GeneralUserGS_sf2_file', '0770_JCLive_sf2_file'
                , '0770_SBLive_sf2', '0770_SoundBlasterOld_sf2', '0771_FluidR3_GM_sf2_file', '0771_GeneralUserGS_sf2_file', '0772_GeneralUserGS_sf2_file', '0780_Aspirin_sf2_file', '0780_Chaos_sf2_file'
                , '0780_FluidR3_GM_sf2_file', '0780_GeneralUserGS_sf2_file', '0780_JCLive_sf2_file', '0780_SBLive_sf2', '0780_SoundBlasterOld_sf2', '0781_GeneralUserGS_sf2_file', '0790_Aspirin_sf2_file'
                , '0790_Chaos_sf2_file', '0790_FluidR3_GM_sf2_file', '0790_GeneralUserGS_sf2_file', '0790_JCLive_sf2_file', '0790_SBLive_sf2', '0790_SoundBlasterOld_sf2', '0791_GeneralUserGS_sf2_file'
                , '0800_Aspirin_sf2_file', '0800_Chaos_sf2_file', '0800_FluidR3_GM_sf2_file', '0800_GeneralUserGS_sf2_file', '0800_JCLive_sf2_file', '0800_SBLive_sf2', '0800_SoundBlasterOld_sf2'
                , '0801_FluidR3_GM_sf2_file', '0801_GeneralUserGS_sf2_file', '0810_Aspirin_sf2_file', '0810_Chaos_sf2_file', '0810_FluidR3_GM_sf2_file', '0810_GeneralUserGS_sf2_file', '0810_JCLive_sf2_file'
                , '0810_SBLive_sf2', '0810_SoundBlasterOld_sf2', '0811_Aspirin_sf2_file', '0811_GeneralUserGS_sf2_file', '0811_SoundBlasterOld_sf2', '0820_Aspirin_sf2_file', '0820_Chaos_sf2_file'
                , '0820_FluidR3_GM_sf2_file', '0820_GeneralUserGS_sf2_file', '0820_JCLive_sf2_file', '0820_SBLive_sf2', '0820_SoundBlasterOld_sf2', '0821_FluidR3_GM_sf2_file', '0821_GeneralUserGS_sf2_file'
                , '0821_SoundBlasterOld_sf2', '0822_GeneralUserGS_sf2_file', '0823_GeneralUserGS_sf2_file', '0830_Aspirin_sf2_file', '0830_Chaos_sf2_file', '0830_FluidR3_GM_sf2_file', '0830_GeneralUserGS_sf2_file'
                , '0830_JCLive_sf2_file', '0830_SBLive_sf2', '0830_SoundBlasterOld_sf2', '0831_FluidR3_GM_sf2_file', '0831_GeneralUserGS_sf2_file', '0831_SoundBlasterOld_sf2', '0840_Aspirin_sf2_file'
                , '0840_Chaos_sf2_file', '0840_FluidR3_GM_sf2_file', '0840_GeneralUserGS_sf2_file', '0840_JCLive_sf2_file', '0840_SBLive_sf2', '0840_SoundBlasterOld_sf2', '0841_Aspirin_sf2_file'
                , '0841_Chaos_sf2_file', '0841_FluidR3_GM_sf2_file', '0841_GeneralUserGS_sf2_file', '0841_JCLive_sf2_file', '0841_SoundBlasterOld_sf2', '0842_FluidR3_GM_sf2_file', '0850_Aspirin_sf2_file'
                , '0850_Chaos_sf2_file', '0850_FluidR3_GM_sf2_file', '0850_GeneralUserGS_sf2_file', '0850_JCLive_sf2_file', '0850_SBLive_sf2', '0850_SoundBlasterOld_sf2', '0851_FluidR3_GM_sf2_file'
                , '0851_GeneralUserGS_sf2_file', '0851_JCLive_sf2_file', '0851_SoundBlasterOld_sf2', '0860_Aspirin_sf2_file', '0860_Chaos_sf2_file', '0860_FluidR3_GM_sf2_file', '0860_GeneralUserGS_sf2_file'
                , '0860_JCLive_sf2_file', '0860_SBLive_sf2', '0860_SoundBlasterOld_sf2', '0861_Aspirin_sf2_file', '0861_FluidR3_GM_sf2_file', '0861_SoundBlasterOld_sf2', '0870_Aspirin_sf2_file'
                , '0870_Chaos_sf2_file', '0870_FluidR3_GM_sf2_file', '0870_GeneralUserGS_sf2_file', '0870_JCLive_sf2_file', '0870_SBLive_sf2', '0870_SoundBlasterOld_sf2', '0871_GeneralUserGS_sf2_file'
                , '0872_GeneralUserGS_sf2_file', '0873_GeneralUserGS_sf2_file', '0880_Aspirin_sf2_file', '0880_Chaos_sf2_file', '0880_FluidR3_GM_sf2_file', '0880_GeneralUserGS_sf2_file', '0880_JCLive_sf2_file'
                , '0880_SBLive_sf2', '0880_SoundBlasterOld_sf2', '0881_Aspirin_sf2_file', '0881_FluidR3_GM_sf2_file', '0881_GeneralUserGS_sf2_file', '0881_SoundBlasterOld_sf2', '0882_Aspirin_sf2_file'
                , '0882_FluidR3_GM_sf2_file', '0882_GeneralUserGS_sf2_file', '0883_GeneralUserGS_sf2_file', '0884_GeneralUserGS_sf2_file', '0885_GeneralUserGS_sf2_file', '0886_GeneralUserGS_sf2_file'
                , '0887_GeneralUserGS_sf2_file', '0888_GeneralUserGS_sf2_file', '0889_GeneralUserGS_sf2_file', '0890_Aspirin_sf2_file', '0890_Chaos_sf2_file', '0890_FluidR3_GM_sf2_file'
                , '0890_GeneralUserGS_sf2_file', '0890_JCLive_sf2_file', '0890_SBLive_sf2', '0890_SoundBlasterOld_sf2', '0891_Aspirin_sf2_file', '0891_FluidR3_GM_sf2_file', '0891_GeneralUserGS_sf2_file'
                , '0900_Aspirin_sf2_file', '0900_Chaos_sf2_file', '0900_FluidR3_GM_sf2_file', '0900_GeneralUserGS_sf2_file', '0900_JCLive_sf2_file', '0900_SBLive_sf2', '0900_SoundBlasterOld_sf2'
                , '0901_Aspirin_sf2_file', '0901_FluidR3_GM_sf2_file', '0901_GeneralUserGS_sf2_file', '0901_SoundBlasterOld_sf2', '0910_Aspirin_sf2_file', '0910_Chaos_sf2_file', '0910_FluidR3_GM_sf2_file'
                , '0910_GeneralUserGS_sf2_file', '0910_JCLive_sf2_file', '0910_SBLive_sf2', '0910_SoundBlasterOld_sf2', '0911_Aspirin_sf2_file', '0911_GeneralUserGS_sf2_file', '0911_JCLive_sf2_file'
                , '0911_SoundBlasterOld_sf2', '0920_Aspirin_sf2_file', '0920_Chaos_sf2_file', '0920_FluidR3_GM_sf2_file', '0920_GeneralUserGS_sf2_file', '0920_JCLive_sf2_file', '0920_SBLive_sf2'
                , '0920_SoundBlasterOld_sf2', '0921_Aspirin_sf2_file', '0921_GeneralUserGS_sf2_file', '0921_SoundBlasterOld_sf2', '0930_Aspirin_sf2_file', '0930_Chaos_sf2_file', '0930_FluidR3_GM_sf2_file'
                , '0930_GeneralUserGS_sf2_file', '0930_JCLive_sf2_file', '0930_SBLive_sf2', '0930_SoundBlasterOld_sf2', '0931_Aspirin_sf2_file', '0931_FluidR3_GM_sf2_file', '0931_GeneralUserGS_sf2_file'
                , '0931_SoundBlasterOld_sf2', '0940_Aspirin_sf2_file', '0940_Chaos_sf2_file', '0940_FluidR3_GM_sf2_file', '0940_GeneralUserGS_sf2_file', '0940_JCLive_sf2_file', '0940_SBLive_sf2'
                , '0940_SoundBlasterOld_sf2', '0941_Aspirin_sf2_file', '0941_FluidR3_GM_sf2_file', '0941_GeneralUserGS_sf2_file', '0941_JCLive_sf2_file', '0950_Aspirin_sf2_file', '0950_Chaos_sf2_file'
                , '0950_FluidR3_GM_sf2_file', '0950_GeneralUserGS_sf2_file', '0950_JCLive_sf2_file', '0950_SBLive_sf2', '0950_SoundBlasterOld_sf2', '0951_FluidR3_GM_sf2_file', '0951_GeneralUserGS_sf2_file'
                , '0960_Aspirin_sf2_file', '0960_Chaos_sf2_file', '0960_FluidR3_GM_sf2_file', '0960_GeneralUserGS_sf2_file', '0960_JCLive_sf2_file', '0960_SBLive_sf2', '0960_SoundBlasterOld_sf2'
                , '0961_Aspirin_sf2_file', '0961_FluidR3_GM_sf2_file', '0961_GeneralUserGS_sf2_file', '0961_SoundBlasterOld_sf2', '0962_GeneralUserGS_sf2_file', '0970_Aspirin_sf2_file', '0970_Chaos_sf2_file'
                , '0970_FluidR3_GM_sf2_file', '0970_GeneralUserGS_sf2_file', '0970_JCLive_sf2_file', '0970_SBLive_sf2', '0970_SoundBlasterOld_sf2', '0971_FluidR3_GM_sf2_file', '0971_GeneralUserGS_sf2_file'
                , '0971_SoundBlasterOld_sf2', '0980_Aspirin_sf2_file', '0980_Chaos_sf2_file', '0980_FluidR3_GM_sf2_file', '0980_GeneralUserGS_sf2_file', '0980_JCLive_sf2_file', '0980_SBLive_sf2'
                , '0980_SoundBlasterOld_sf2', '0981_Aspirin_sf2_file', '0981_FluidR3_GM_sf2_file', '0981_GeneralUserGS_sf2_file', '0981_SoundBlasterOld_sf2', '0982_GeneralUserGS_sf2_file'
                , '0983_GeneralUserGS_sf2_file', '0984_GeneralUserGS_sf2_file', '0990_Aspirin_sf2_file', '0990_Chaos_sf2_file', '0990_FluidR3_GM_sf2_file', '0990_GeneralUserGS_sf2_file', '0990_JCLive_sf2_file'
                , '0990_SBLive_sf2', '0990_SoundBlasterOld_sf2', '0991_Aspirin_sf2_file', '0991_FluidR3_GM_sf2_file', '0991_GeneralUserGS_sf2_file', '0991_JCLive_sf2_file', '0991_SoundBlasterOld_sf2'
                , '0992_FluidR3_GM_sf2_file', '0992_JCLive_sf2_file', '0993_JCLive_sf2_file', '0994_JCLive_sf2_file', '1000_Aspirin_sf2_file', '1000_Chaos_sf2_file', '1000_FluidR3_GM_sf2_file'
                , '1000_GeneralUserGS_sf2_file', '1000_JCLive_sf2_file', '1000_SBLive_sf2', '1000_SoundBlasterOld_sf2', '1001_Aspirin_sf2_file', '1001_FluidR3_GM_sf2_file', '1001_GeneralUserGS_sf2_file'
                , '1001_JCLive_sf2_file', '1001_SoundBlasterOld_sf2', '1002_Aspirin_sf2_file', '1002_FluidR3_GM_sf2_file', '1002_GeneralUserGS_sf2_file', '1010_Aspirin_sf2_file', '1010_Chaos_sf2_file'
                , '1010_FluidR3_GM_sf2_file', '1010_GeneralUserGS_sf2_file', '1010_JCLive_sf2_file', '1010_SBLive_sf2', '1010_SoundBlasterOld_sf2', '1011_Aspirin_sf2_file', '1011_FluidR3_GM_sf2_file'
                , '1011_JCLive_sf2_file', '1012_Aspirin_sf2_file', '1020_Aspirin_sf2_file', '1020_Chaos_sf2_file', '1020_FluidR3_GM_sf2_file', '1020_GeneralUserGS_sf2_file', '1020_JCLive_sf2_file'
                , '1020_SBLive_sf2', '1020_SoundBlasterOld_sf2', '1021_Aspirin_sf2_file', '1021_FluidR3_GM_sf2_file', '1021_GeneralUserGS_sf2_file', '1021_JCLive_sf2_file', '1021_SoundBlasterOld_sf2'
                , '1022_GeneralUserGS_sf2_file', '1030_Aspirin_sf2_file', '1030_Chaos_sf2_file', '1030_FluidR3_GM_sf2_file', '1030_GeneralUserGS_sf2_file', '1030_JCLive_sf2_file', '1030_SBLive_sf2'
                , '1030_SoundBlasterOld_sf2', '1031_Aspirin_sf2_file', '1031_FluidR3_GM_sf2_file', '1031_GeneralUserGS_sf2_file', '1031_SoundBlasterOld_sf2', '1032_FluidR3_GM_sf2_file', '1040_Aspirin_sf2_file'
                , '1040_Chaos_sf2_file', '1040_FluidR3_GM_sf2_file', '1040_GeneralUserGS_sf2_file', '1040_JCLive_sf2_file', '1040_SBLive_sf2', '1040_SoundBlasterOld_sf2', '1041_FluidR3_GM_sf2_file'
                , '1041_GeneralUserGS_sf2_file', '1050_Aspirin_sf2_file', '1050_Chaos_sf2_file', '1050_FluidR3_GM_sf2_file', '1050_GeneralUserGS_sf2_file', '1050_JCLive_sf2_file', '1050_SBLive_sf2'
                , '1050_SoundBlasterOld_sf2', '1051_GeneralUserGS_sf2_file', '1060_Aspirin_sf2_file', '1060_Chaos_sf2_file', '1060_FluidR3_GM_sf2_file', '1060_GeneralUserGS_sf2_file', '1060_JCLive_sf2_file'
                , '1060_SBLive_sf2', '1060_SoundBlasterOld_sf2', '1061_FluidR3_GM_sf2_file', '1061_GeneralUserGS_sf2_file', '1061_SoundBlasterOld_sf2', '1070_Aspirin_sf2_file', '1070_Chaos_sf2_file'
                , '1070_FluidR3_GM_sf2_file', '1070_GeneralUserGS_sf2_file', '1070_JCLive_sf2_file', '1070_SBLive_sf2', '1070_SoundBlasterOld_sf2', '1071_FluidR3_GM_sf2_file', '1071_GeneralUserGS_sf2_file'
                , '1072_GeneralUserGS_sf2_file', '1073_GeneralUserGS_sf2_file', '1080_Aspirin_sf2_file', '1080_Chaos_sf2_file', '1080_FluidR3_GM_sf2_file', '1080_GeneralUserGS_sf2_file', '1080_JCLive_sf2_file'
                , '1080_SBLive_sf2', '1080_SoundBlasterOld_sf2', '1081_SoundBlasterOld_sf2', '1090_Aspirin_sf2_file', '1090_Chaos_sf2_file', '1090_FluidR3_GM_sf2_file', '1090_GeneralUserGS_sf2_file'
                , '1090_JCLive_sf2_file', '1090_SBLive_sf2', '1090_SoundBlasterOld_sf2', '1091_SoundBlasterOld_sf2', '1100_Aspirin_sf2_file', '1100_Chaos_sf2_file', '1100_FluidR3_GM_sf2_file'
                , '1100_GeneralUserGS_sf2_file', '1100_JCLive_sf2_file', '1100_SBLive_sf2', '1100_SoundBlasterOld_sf2', '1101_Aspirin_sf2_file', '1101_FluidR3_GM_sf2_file', '1101_GeneralUserGS_sf2_file'
                , '1102_GeneralUserGS_sf2_file', '1110_Aspirin_sf2_file', '1110_Chaos_sf2_file', '1110_FluidR3_GM_sf2_file', '1110_GeneralUserGS_sf2_file', '1110_JCLive_sf2_file', '1110_SBLive_sf2'
                , '1110_SoundBlasterOld_sf2', '1120_Aspirin_sf2_file', '1120_Chaos_sf2_file', '1120_FluidR3_GM_sf2_file', '1120_GeneralUserGS_sf2_file', '1120_JCLive_sf2_file', '1120_SBLive_sf2'
                , '1120_SoundBlasterOld_sf2', '1121_SoundBlasterOld_sf2', '1130_Aspirin_sf2_file', '1130_Chaos_sf2_file', '1130_FluidR3_GM_sf2_file', '1130_GeneralUserGS_sf2_file', '1130_JCLive_sf2_file'
                , '1130_SBLive_sf2', '1130_SoundBlasterOld_sf2', '1131_FluidR3_GM_sf2_file', '1131_SoundBlasterOld_sf2', '1140_Aspirin_sf2_file', '1140_Chaos_sf2_file', '1140_FluidR3_GM_sf2_file'
                , '1140_GeneralUserGS_sf2_file', '1140_JCLive_sf2_file', '1140_SBLive_sf2', '1140_SoundBlasterOld_sf2', '1141_FluidR3_GM_sf2_file', '1150_Aspirin_sf2_file', '1150_Chaos_sf2_file'
                , '1150_FluidR3_GM_sf2_file', '1150_GeneralUserGS_sf2_file', '1150_JCLive_sf2_file', '1150_SBLive_sf2', '1150_SoundBlasterOld_sf2', '1151_FluidR3_GM_sf2_file', '1151_GeneralUserGS_sf2_file'
                , '1152_FluidR3_GM_sf2_file', '1152_GeneralUserGS_sf2_file', '1160_Aspirin_sf2_file', '1160_Chaos_sf2_file', '1160_FluidR3_GM_sf2_file', '1160_GeneralUserGS_sf2_file', '1160_JCLive_sf2_file'
                , '1160_SBLive_sf2', '1160_SoundBlasterOld_sf2', '1161_FluidR3_GM_sf2_file', '1161_GeneralUserGS_sf2_file', '1161_SoundBlasterOld_sf2', '1162_FluidR3_GM_sf2_file', '1162_GeneralUserGS_sf2_file'
                , '1163_FluidR3_GM_sf2_file', '1170_Aspirin_sf2_file', '1170_Chaos_sf2_file', '1170_FluidR3_GM_sf2_file', '1170_GeneralUserGS_sf2_file', '1170_JCLive_sf2_file', '1170_SBLive_sf2'
                , '1170_SoundBlasterOld_sf2', '1171_FluidR3_GM_sf2_file', '1171_GeneralUserGS_sf2_file', '1172_FluidR3_GM_sf2_file', '1173_FluidR3_GM_sf2_file', '1180_Aspirin_sf2_file', '1180_Chaos_sf2_file'
                , '1180_FluidR3_GM_sf2_file', '1180_GeneralUserGS_sf2_file', '1180_JCLive_sf2_file', '1180_SBLive_sf2', '1180_SoundBlasterOld_sf2', '1181_FluidR3_GM_sf2_file', '1181_GeneralUserGS_sf2_file'
                , '1181_SoundBlasterOld_sf2', '1190_Aspirin_sf2_file', '1190_Chaos_sf2_file', '1190_FluidR3_GM_sf2_file', '1190_GeneralUserGS_sf2_file', '1190_JCLive_sf2_file', '1190_SBLive_sf2'
                , '1190_SoundBlasterOld_sf2', '1191_GeneralUserGS_sf2_file', '1192_GeneralUserGS_sf2_file', '1193_GeneralUserGS_sf2_file', '1194_GeneralUserGS_sf2_file', '1200_Aspirin_sf2_file'
                , '1200_Chaos_sf2_file', '1200_FluidR3_GM_sf2_file', '1200_GeneralUserGS_sf2_file', '1200_JCLive_sf2_file', '1200_SBLive_sf2', '1200_SoundBlasterOld_sf2', '1201_Aspirin_sf2_file'
                , '1201_GeneralUserGS_sf2_file', '1202_GeneralUserGS_sf2_file', '1210_Aspirin_sf2_file', '1210_Chaos_sf2_file', '1210_FluidR3_GM_sf2_file', '1210_GeneralUserGS_sf2_file', '1210_JCLive_sf2_file'
                , '1210_SBLive_sf2', '1210_SoundBlasterOld_sf2', '1211_Aspirin_sf2_file', '1211_GeneralUserGS_sf2_file', '1212_GeneralUserGS_sf2_file', '1220_Aspirin_sf2_file', '1220_Chaos_sf2_file'
                , '1220_FluidR3_GM_sf2_file', '1220_GeneralUserGS_sf2_file', '1220_JCLive_sf2_file', '1220_SBLive_sf2', '1220_SoundBlasterOld_sf2', '1221_Aspirin_sf2_file', '1221_GeneralUserGS_sf2_file'
                , '1221_JCLive_sf2_file', '1222_Aspirin_sf2_file', '1222_GeneralUserGS_sf2_file', '1223_Aspirin_sf2_file', '1223_GeneralUserGS_sf2_file', '1224_Aspirin_sf2_file', '1224_GeneralUserGS_sf2_file'
                , '1225_GeneralUserGS_sf2_file', '1226_GeneralUserGS_sf2_file', '1230_Aspirin_sf2_file', '1230_Chaos_sf2_file', '1230_FluidR3_GM_sf2_file', '1230_GeneralUserGS_sf2_file', '1230_JCLive_sf2_file'
                , '1230_SBLive_sf2', '1230_SoundBlasterOld_sf2', '1231_Aspirin_sf2_file', '1231_GeneralUserGS_sf2_file', '1232_Aspirin_sf2_file', '1232_GeneralUserGS_sf2_file', '1233_GeneralUserGS_sf2_file'
                , '1234_GeneralUserGS_sf2_file', '1240_Aspirin_sf2_file', '1240_Chaos_sf2_file', '1240_FluidR3_GM_sf2_file', '1240_GeneralUserGS_sf2_file', '1240_JCLive_sf2_file', '1240_SBLive_sf2'
                , '1240_SoundBlasterOld_sf2', '1241_Aspirin_sf2_file', '1241_GeneralUserGS_sf2_file', '1242_Aspirin_sf2_file', '1242_GeneralUserGS_sf2_file', '1243_Aspirin_sf2_file', '1243_GeneralUserGS_sf2_file'
                , '1244_Aspirin_sf2_file', '1244_GeneralUserGS_sf2_file', '1250_Aspirin_sf2_file', '1250_Chaos_sf2_file', '1250_FluidR3_GM_sf2_file', '1250_GeneralUserGS_sf2_file', '1250_JCLive_sf2_file'
                , '1250_SBLive_sf2', '1250_SoundBlasterOld_sf2', '1251_Aspirin_sf2_file', '1251_FluidR3_GM_sf2_file', '1251_GeneralUserGS_sf2_file', '1252_Aspirin_sf2_file', '1252_FluidR3_GM_sf2_file'
                , '1252_GeneralUserGS_sf2_file', '1253_Aspirin_sf2_file', '1253_GeneralUserGS_sf2_file', '1254_Aspirin_sf2_file', '1254_GeneralUserGS_sf2_file', '1255_Aspirin_sf2_file'
                , '1255_GeneralUserGS_sf2_file', '1256_Aspirin_sf2_file', '1256_GeneralUserGS_sf2_file', '1257_Aspirin_sf2_file', '1257_GeneralUserGS_sf2_file', '1258_Aspirin_sf2_file'
                , '1258_GeneralUserGS_sf2_file', '1259_GeneralUserGS_sf2_file', '1260_Aspirin_sf2_file', '1260_Chaos_sf2_file', '1260_FluidR3_GM_sf2_file', '1260_GeneralUserGS_sf2_file', '1260_JCLive_sf2_file'
                , '1260_SBLive_sf2', '1260_SoundBlasterOld_sf2', '1261_Aspirin_sf2_file', '1261_GeneralUserGS_sf2_file', '1262_Aspirin_sf2_file', '1262_GeneralUserGS_sf2_file', '1263_Aspirin_sf2_file'
                , '1263_GeneralUserGS_sf2_file', '1264_Aspirin_sf2_file', '1264_GeneralUserGS_sf2_file', '1265_Aspirin_sf2_file', '1265_GeneralUserGS_sf2_file', '1270_Aspirin_sf2_file', '1270_Chaos_sf2_file'
                , '1270_FluidR3_GM_sf2_file', '1270_GeneralUserGS_sf2_file', '1270_JCLive_sf2_file', '1270_SBLive_sf2', '1270_SoundBlasterOld_sf2', '1271_Aspirin_sf2_file', '1271_GeneralUserGS_sf2_file'
                , '1272_Aspirin_sf2_file', '1272_GeneralUserGS_sf2_file', '1273_GeneralUserGS_sf2_file', '1274_GeneralUserGS_sf2_file'
            ];
        }
        return this.instrumentKeyArray;
    };
}
class PerformerPluginWAF implements MZXBX_AudioPerformerPlugin {
    out: GainNode;
    player: PublicWAFMIDITonePerformerPlayer;
    index: number = -1;
    velocityRatio = 0.75;
    reset(context: AudioContext, parameters: string): boolean {
        if (this.player) {
            return this.player.presetReady(this.index);
        } else {
            this.out = context.createGain();
            this.player = new PublicWAFMIDITonePerformerPlayer();
            this.player.setup(context);
            let nn: number = parseInt(parameters);
            if (this.index == nn) {
                //
            } else {
                this.index = nn;
                this.player.startLoadPreset(this.index);
            }
            return this.player.presetReady(this.index);
        }
    }
    schedule(when: number, volume: number, pitch: number, slides: MZXBX_SlideItem[]): void {
        let info: PresetInstrument = this.player.instrumentInfo(this.index);
        let preset: WavePreset = window[info.variable] as WavePreset;
        let rr = this.player.queueWaveTable(this.out, preset, when, pitch, volume*this.velocityRatio, slides);
        //console.log(rr);
    }
    output(): AudioNode | null {
        return this.out;
    }
    cancel(): void {
        this.player.cancelQueue();
    }
}
function testPluginWAF(): MZXBX_AudioPerformerPlugin {
    return new PerformerPluginWAF();
}
