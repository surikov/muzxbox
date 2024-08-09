"use strict";
var MZXBX_PluginKind;
(function (MZXBX_PluginKind) {
    MZXBX_PluginKind[MZXBX_PluginKind["Action"] = 0] = "Action";
    MZXBX_PluginKind[MZXBX_PluginKind["Filter"] = 1] = "Filter";
    MZXBX_PluginKind[MZXBX_PluginKind["Sampler"] = 2] = "Sampler";
    MZXBX_PluginKind[MZXBX_PluginKind["Performer"] = 3] = "Performer";
})(MZXBX_PluginKind || (MZXBX_PluginKind = {}));
class SimpleBeepPlugin {
    constructor() {
        this.lastMessage = null;
        console.log('SimpleBeepPlugin');
        this.register();
    }
    register() {
        console.log('register');
        window.addEventListener('message', this.receiveHostMessage.bind(this), false);
    }
    receiveHostMessage(messageEvent) {
        console.log('receiveHostMessage', messageEvent);
        this.lastMessage = messageEvent.data;
    }
    sendMessageToHost(data) {
        console.log('sendMessageToHost');
        if (this.lastMessage) {
            var message = {
                dialogID: this.lastMessage.dialogID,
                data: data
            };
            window.parent.postMessage(message, '*');
        }
    }
    test() {
        console.log('test beep');
        if (this.audioContext) {
        }
        else {
            this.audioContext = new AudioContext();
        }
        if (this.plugin) {
        }
        else {
            this.plugin = newSimpleBeepImplementation();
            this.plugin.launch(this.audioContext, '');
            let audioNode = this.plugin.output();
            if (audioNode) {
                audioNode.connect(this.audioContext.destination);
            }
        }
        if (this.plugin.busy()) {
        }
        else {
            this.plugin.cancel();
            this.plugin.schedule(this.audioContext.currentTime + 0.1, [48, 60, 64, 67], 120, [{ duration: 0.1, delta: 7 },
                { duration: 0.2, delta: -7 },
                { duration: 0.7, delta: 0 }
            ]);
        }
    }
    set() {
        this.sendMessageToHost('test answer from beep');
    }
}
//# sourceMappingURL=beeppui.js.map