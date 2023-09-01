"use strict";
class BaseVolumeFxPlugin {
    schedule(when, parameters) {
        let nn01 = parseFloat(parameters);
        this.base.gain.setValueAtTime(nn01 / 100, when);
    }
    launch(context, parameters) {
        if (!(this.base)) {
            this.base = context.createGain();
        }
        let nn01 = parseFloat(parameters);
        if (isNaN(nn01)) {
            console.log('parameters', parameters, '/', nn01);
        }
        else {
            this.base.gain.value = nn01 / 100;
        }
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
function createBaseVolumeFx() {
    return new BaseVolumeFxPlugin();
}
//# sourceMappingURL=base_volume_fx.js.map