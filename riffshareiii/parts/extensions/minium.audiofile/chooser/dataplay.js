"use strict";
class AudioFilePicker {
    constructor() {
        this.id = '';
        this.path = './plugins/samplers/miniumfader1/audiosamples/voice-yeah.wav';
        this.ratio = 0;
        window.addEventListener('message', this.receiveHostMessage.bind(this), false);
        this.ratioslider = document.getElementById('ratioslider');
        this.numval = document.getElementById('numval');
        this.fname = document.getElementById('fname');
        this.ratioslider.addEventListener('change', (event) => {
            this.ratio = this.ratioslider.value;
            this.numval.innerHTML = this.ratio;
            this.sendMessageToHost('' + this.ratio + ',' + this.path);
        });
        this.sendMessageToHost('');
        this.updateUI();
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
        this.numval.innerHTML = this.ratio;
        this.ratioslider.value = this.ratio;
        this.fname.value = this.path;
    }
    selectPath(name) {
        this.path = './plugins/samplers/miniumfader1/audiosamples/' + name;
        this.sendMessageToHost('' + this.ratio + ',' + this.path);
        this.updateUI();
    }
    checkPath() {
        this.sendMessageToHost('' + this.ratio + ',' + this.path);
    }
}
let pickerbridge = new AudioFilePicker();
//# sourceMappingURL=dataplay.js.map