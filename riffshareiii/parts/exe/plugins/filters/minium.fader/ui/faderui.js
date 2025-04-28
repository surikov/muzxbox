"use strict";
class FaderBridge {
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
function initFaderUI() {
    let volume = document.getElementById('volume');
    let numval = document.getElementById('numval');
    let bridge = new FaderBridge(() => {
        numval.innerHTML = bridge.data;
        volume.value = bridge.data;
    });
    volume.addEventListener('change', (event) => {
        numval.innerHTML = volume.value;
        bridge.sendMessageToHost(volume.value);
    });
}
//# sourceMappingURL=faderui.js.map