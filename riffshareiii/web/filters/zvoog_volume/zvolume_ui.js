"use strict";
class ZVUI {
    constructor() {
        this.id = '';
        this.data = '';
    }
    init() {
        window.addEventListener('message', this.receiveHostMessage.bind(this), false);
        this.sendMessageToHost('');
        this.slider = document.getElementById('voluctrl');
        this.slider.addEventListener('change', (event) => {
            this.sendMessageToHost(this.slider.value);
        });
    }
    sendMessageToHost(data) {
        var message = { dialogID: this.id, pluginData: data, done: false };
        window.parent.postMessage(message, '*');
    }
    receiveHostMessage(messageEvent) {
        let message = messageEvent.data;
        if (this.id) {
            this.setState(message.hostData);
        }
        else {
            this.setMessagingId(message.hostData);
        }
    }
    setMessagingId(newId) {
        this.id = newId;
    }
    setState(data) {
        this.data = data;
        this.slider.value = parseInt(this.data);
    }
}
function initZVUI() {
    let zz = new ZVUI();
    zz.init();
}
//# sourceMappingURL=zvolume_ui.js.map