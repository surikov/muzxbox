"use strict";
class SimpleTestVolumePlugin {
    schedule(when, parameters) {
        let nn01 = parseFloat(parameters);
        this.base.gain.setValueAtTime(nn01 / 100, when);
    }
    launch(context, parameters) {
        if (!(this.base)) {
            this.base = context.createGain();
        }
        let nn01 = parseFloat(parameters);
        this.base.gain.value = nn01 / 100;
    }
    busy() {
        return null;
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