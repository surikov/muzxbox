"use strict";
console.log('test volume plugin v1.01');
class SimpleTestVolumePlugin {
    schedule(when, parameters) {
        console.log('not implemented yet');
    }
    reset(context, parameters) {
        console.log('reset', this);
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
    console.log('new SimpleTestVolumePlugin');
    return new SimpleTestVolumePlugin();
}
//# sourceMappingURL=testvolume.js.map