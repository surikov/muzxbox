"use strict";
console.log('test volume plugin v1.01');
class SimpleTestVolumePlugin {
    reset(context, parameters) {
        console.log('reset', this);
        return true;
    }
}
function testPluginForVolume1() {
    console.log('new SimpleTestVolumePlugin');
    return new SimpleTestVolumePlugin();
}
//# sourceMappingURL=testvolume.js.map