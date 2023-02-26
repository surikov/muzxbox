"use strict";
class SimpleTestVolumePlugin {
    schedule(when, parameters) {
        console.log('not implemented yet');
    }
    reset(context, parameters) {
        if (!(this.base)) {
            this.base = context.createGain();
        }
        let nn01 = parseFloat(parameters);
        this.base.gain.value = nn01;
        return true;
    }
    output() {
        return this.base;
    }
    input() {
        return this.base;
    }
}
function testPluginForVolume1() {
    return new SimpleTestVolumePlugin();
}
//# sourceMappingURL=testvolume.js.map