"use strict";
class MZXBXEqualizer10 {
    schedule(when, parameters) {
        console.log('not implemented yet');
    }
    launch(context, parameters) {
        if (this.inpt) {
        }
        else {
            this.inpt = context.createGain();
            this.band32 = this.bandEqualizer(context, this.inpt, 32);
            this.band64 = this.bandEqualizer(context, this.band32, 64);
            this.band128 = this.bandEqualizer(context, this.band64, 128);
            this.band256 = this.bandEqualizer(context, this.band128, 256);
            this.band512 = this.bandEqualizer(context, this.band256, 512);
            this.band1k = this.bandEqualizer(context, this.band512, 1024);
            this.band2k = this.bandEqualizer(context, this.band1k, 2048);
            this.band4k = this.bandEqualizer(context, this.band2k, 4096);
            this.band8k = this.bandEqualizer(context, this.band4k, 8192);
            this.band16k = this.bandEqualizer(context, this.band8k, 16384);
            this.outpt = context.createGain();
            this.band16k.connect(this.outpt);
        }
        let pars = parameters.split(',');
        if (pars) {
            if (pars.length == 10) {
                this.band32.gain.setTargetAtTime(parseFloat(pars[0]), 0, 0.0001);
                this.band64.gain.setTargetAtTime(parseFloat(pars[1]), 0, 0.0001);
                this.band128.gain.setTargetAtTime(parseFloat(pars[2]), 0, 0.0001);
                this.band256.gain.setTargetAtTime(parseFloat(pars[3]), 0, 0.0001);
                this.band512.gain.setTargetAtTime(parseFloat(pars[4]), 0, 0.0001);
                this.band1k.gain.setTargetAtTime(parseFloat(pars[5]), 0, 0.0001);
                this.band2k.gain.setTargetAtTime(parseFloat(pars[6]), 0, 0.0001);
                this.band4k.gain.setTargetAtTime(parseFloat(pars[7]), 0, 0.0001);
                this.band8k.gain.setTargetAtTime(parseFloat(pars[8]), 0, 0.0001);
                this.band16k.gain.setTargetAtTime(parseFloat(pars[9]), 0, 0.0001);
            }
        }
    }
    busy() {
        return null;
    }
    output() {
        return this.outpt;
    }
    input() {
        return this.inpt;
    }
    bandEqualizer(context, from, frequency) {
        var filter = context.createBiquadFilter();
        filter.frequency.setTargetAtTime(frequency, 0, 0.0001);
        filter.type = "peaking";
        filter.gain.setTargetAtTime(0, 0, 0.0001);
        filter.Q.setTargetAtTime(1.0, 0, 0.0001);
        from.connect(filter);
        return filter;
    }
    ;
}
function equalizer10bands() {
    return new MZXBXEqualizer10();
}
//# sourceMappingURL=equalizer10band.js.map