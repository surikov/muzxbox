"use strict";
class SimpleCompressorPlugin {
    schedule(when, parameters) {
        console.log('not implemented yet');
    }
    launch(context, parameters) {
        if (!(this.inpt)) {
            this.inpt = context.createGain();
            this.outpt = context.createGain();
            this.compressor = context.createDynamicsCompressor();
            this.inpt.connect(this.compressor);
            this.compressor.connect(this.outpt);
            var threshold = -35;
            var knee = 35;
            var ratio = 8;
            var attack = 0.02;
            var release = 0.1;
            this.compressor.threshold.setValueAtTime(threshold, 0.0001);
            this.compressor.knee.setValueAtTime(knee, 0.0001);
            this.compressor.ratio.setValueAtTime(ratio, 0.0001);
            this.compressor.attack.setValueAtTime(attack, 0.0001);
            this.compressor.release.setValueAtTime(release, 0.0001);
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
}
function basePluginForCompression() {
    return new SimpleCompressorPlugin();
}
//# sourceMappingURL=compressor.js.map