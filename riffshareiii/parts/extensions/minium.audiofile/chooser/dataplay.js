"use strict";
class AudioFilePicker {
    constructor() {
        this.id = '';
        this.path = '';
        this.ratio = 0;
        window.addEventListener('message', this.receiveHostMessage.bind(this), false);
        this.ratioslider = document.getElementById('ratioslider');
        this.numval = document.getElementById('numval');
        this.ratioslider.addEventListener('change', (event) => {
            this.ratio = this.ratioslider.value;
            this.numval.innerHTML = this.ratio;
            this.sendMessageToHost('' + this.ratio + ',' + this.path);
        });
        this.sendMessageToHost('');
    }
    sendMessageToHost(data) {
        var message = { dialogID: this.id, pluginData: data, done: false };
        window.parent.postMessage(message, '*');
        console.log('sendMessageToHost', message);
    }
    receiveHostMessage(messageEvent) {
        let message = messageEvent.data;
        console.log('receiveHostMessage', message);
        if (this.id) {
            this.ratio = 0;
            this.path = '';
            try {
                let splits = message.hostData.split(',');
                this.ratio = parseInt(splits[0]);
                this.path = '' + parseInt(splits[1]);
            }
            catch (xx) {
                console.log(xx);
            }
            this.ratio = this.ratio ? this.ratio : 0;
            this.updateUI();
        }
        else {
            this.id = message.hostData;
        }
    }
    updateUI() {
    }
    selectPath(path) {
        this.path = path;
        this.sendMessageToHost('' + this.ratio + ',' + this.path);
        this.updateUI();
    }
    checkPath() {
        alert('Check');
    }
}
let pickerbridge = new AudioFilePicker();
//# sourceMappingURL=dataplay.js.map