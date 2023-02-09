"use strict";
console.log('test volume plugin v1.01');
class SimpleSinePerformer {
    reset(context, parameters) {
        console.log('reset', this);
        return true;
    }
    schedule(when, pitch, volume, slides) {
        console.log('schedule', this);
    }
    cancel() {
        console.log('cancel', this);
    }
}
function testPluginSingleWave() {
    console.log('new testPluginSingleWave');
    return new SimpleSinePerformer();
}
//# sourceMappingURL=testsinewave.js.map