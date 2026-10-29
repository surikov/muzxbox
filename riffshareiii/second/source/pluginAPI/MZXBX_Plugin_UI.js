"use strict";
class MZXBX_Plugin_UI {
    constructor(screenWait) {
        this.dialogId = '';
        this.hostData = '';
        window.addEventListener('message', this._receiveHostMessage.bind(this), false);
        this._sendMessageToHost('', false, screenWait);
    }
    closeDialog(data) {
        this._sendMessageToHost(data, true, false);
    }
    updateHostData(data) {
        this._sendMessageToHost(data, false, false);
    }
    _sendMessageToHost(data, done, screenWait) {
        var message = {
            dialogID: this.dialogId,
            pluginData: data,
            done: done,
            screenWait: screenWait
        };
        console.log('MZXBX_Plugin_UI._sendMessageToHost', message);
        window.parent.postMessage(message, '*');
    }
    _receiveHostMessage(messageEvent) {
        let message = messageEvent.data;
        console.log('MZXBX_Plugin_UI._receiveHostMessage', message);
        if (message) {
            if (this.dialogId) {
                this.hostData = message.hostData;
                this.onMessageFromHost(message);
            }
            else {
                this.dialogId = message.hostData;
            }
            this.onLanguaga(message.langID);
            if (message.colors) {
                document.documentElement.style.setProperty('--background-color', message.colors.background);
                document.documentElement.style.setProperty('--main-color', message.colors.main);
                document.documentElement.style.setProperty('--drag-color', message.colors.drag);
                document.documentElement.style.setProperty('--line-color', message.colors.line);
                document.documentElement.style.setProperty('--click-color', message.colors.click);
            }
        }
    }
}
