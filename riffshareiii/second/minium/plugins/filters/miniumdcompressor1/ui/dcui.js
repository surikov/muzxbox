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
        var message = { dialogID: this.id, pluginData: data, done: false, screenWait: false };
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
            this.setupLangColors(message);
        }
    }
    setMessagingId(newId) {
        this.id = newId;
    }
    setupLangColors(message) {
        document.documentElement.style.setProperty('--background-color', message.colors.background);
        document.documentElement.style.setProperty('--main-color', message.colors.main);
        document.documentElement.style.setProperty('--drag-color', message.colors.drag);
        document.documentElement.style.setProperty('--line-color', message.colors.line);
        document.documentElement.style.setProperty('--click-color', message.colors.click);
        if (message.langID == 'ru') {
            document.getElementById('title').innerHTML = 'Динамический компрессор';
        }
        else {
            if (message.langID == 'zh') {
                document.getElementById('title').innerHTML = '淡入淡出';
            }
            else {
                document.getElementById('title').innerHTML = 'Dynamic compressor';
            }
        }
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