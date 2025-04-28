"use strict";
class CompressorBridge {
    constructor(onReadHostData) {
        this.id = '';
        this.data = '';
        this.onReadHostData = onReadHostData;
        window.addEventListener('message', this.receiveHostMessage.bind(this), false);
        this.sendMessageToHost('');
    }
    sendMessageToHost(data) {
        var message = { dialogID: this.id, pluginData: data, done: false };
        window.parent.postMessage(message, '*');
    }
    receiveHostMessage(messageEvent) {
        let message = messageEvent.data;
        if (this.id) {
            this.data = message.hostData;
            this.onReadHostData();
        }
        else {
            this.setMessagingId(message.hostData);
        }
    }
    setMessagingId(newId) {
        this.id = newId;
    }
}
function initCompressorUI() {
    let level = document.getElementById('level');
    let numval = document.getElementById('numval');
    let bridge = new CompressorBridge(() => {
        numval.innerHTML = bridge.data;
        level.value = bridge.data;
    });
    level.addEventListener('change', (event) => {
        numval.innerHTML = level.value;
        bridge.sendMessageToHost(level.value);
    });
}
//# sourceMappingURL=dcui.js.map