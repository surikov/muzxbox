"use strict";
console.log('test echo plugin v1.01');
class SimpleEchoTestPlugin {
    reset(context, parameters) {
        console.log('reset', this);
        return true;
    }
}
function testPluginForEcho1() {
    console.log('new SimpleEchoTestPlugin');
    return new SimpleEchoTestPlugin();
}
//# sourceMappingURL=testecho.js.map