"use strict";
console.log('Simple beep UI');
class SimpleBeepPlugin {
    constructor() {
        console.log('SimpleBeepPlugin');
        this.register();
    }
    register() {
        console.log('register');
        window.addEventListener('message', this.receiveHostMessage.bind(this), false);
        window.parent.postMessage('', '*');
    }
    receiveHostMessage(messageEvent) {
        let message = messageEvent.data;
        if (this.id) {
            this.data = message.hostData;
        }
        else {
            this.id = message.hostData;
        }
    }
    sendMessageToHost(data) {
        console.log('sendMessageToHost');
        var message = { dialogID: this.id, pluginData: data, done: false };
        window.parent.postMessage(message, '*');
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
            this.plugin.strum(this.audioContext.currentTime + 0.1, [48, 60, 64, 67], 120, [{ duration: 0.1, delta: 7 },
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