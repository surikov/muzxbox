"use strict";
class AudioFileParametersUrility {
    parse(parameters) {
        let result = { ratio: 0, volume: 100, url: '' };
        try {
            let split = parameters.split(',');
            result.ratio = parseInt(split[0]);
            result.volume = parseInt(split[1]);
            result.url = split[2];
        }
        catch (xx) {
            console.log(xx);
        }
        if (result.ratio >= -100 && result.ratio <= 100) {
        }
        else {
            result.ratio = 0;
        }
        if (result.volume >= 0 && result.ratio <= 100) {
        }
        else {
            result.volume = 100;
        }
        result.url = (result.url) ? result.url : '';
        return result;
    }
    dump(ratio, volume, url) {
        return '' + ratio + ',' + volume + ',' + url;
    }
}
class AudioFilePicker {
    constructor() {
        this.id = '';
        this.path = 'https://surikov.github.io/muzxbox/riffshareiii/parts/extensions/minium.audiofile/audiosamples/hello.wav';
        this.ratio = 0;
        this.volumeLevel = 100;
        window.addEventListener('message', this.receiveHostMessage.bind(this), false);
        this.ratioslider = document.getElementById('ratioslider');
        this.numval = document.getElementById('numval');
        this.volumeslider = document.getElementById('volumeslider');
        this.volval = document.getElementById('volval');
        this.fname = document.getElementById('fname');
        this.ratioslider.addEventListener('change', (event) => {
            this.ratio = this.ratioslider.value;
            this.numval.innerHTML = this.ratio;
            this.sendMessageToHost(new AudioFileParametersUrility().dump(this.ratio, this.volumeLevel, this.path));
        });
        this.volumeslider.addEventListener('change', (event) => {
            this.volumeLevel = this.volumeslider.value;
            this.volval.innerHTML = this.volumeLevel;
            this.sendMessageToHost(new AudioFileParametersUrility().dump(this.ratio, this.volumeLevel, this.path));
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
            let parsed = new AudioFileParametersUrility().parse(message.hostData);
            this.ratio = parsed.ratio;
            this.volumeLevel = parsed.volume;
            this.path = parsed.url;
            this.updateUI();
        }
        else {
            this.id = message.hostData;
        }
    }
    updateUI() {
        this.numval.innerHTML = this.ratio;
        this.volval.innerHTML = this.volumeLevel;
        this.ratioslider.value = this.ratio;
        this.volumeslider.value = this.volumeLevel;
        this.fname.value = this.path;
    }
    selectPath(name) {
        this.path = 'http://127.0.0.1:8080/audiosamples/' + name;
        this.sendMessageToHost('' + this.ratio + ',' + this.path);
        this.updateUI();
    }
    checkPath() {
        this.sendMessageToHost(new AudioFileParametersUrility().dump(this.ratio, this.volumeLevel, this.path));
        this.startLoadFile(this.path);
    }
    startLoadFile(url) {
        let xmlHttpRequest = new XMLHttpRequest();
        xmlHttpRequest.open("GET", url, true);
        xmlHttpRequest.responseType = "arraybuffer";
        xmlHttpRequest.onload = (event) => {
            const arrayBuffer = xmlHttpRequest.response;
            if (arrayBuffer) {
                console.log('arrayBuffer', arrayBuffer);
            }
        };
        xmlHttpRequest.onerror = (proevent) => {
            console.log('onerror', proevent);
            console.log('xmlHttpRequest', xmlHttpRequest);
            alert('Error ' + proevent);
        };
        try {
            xmlHttpRequest.send(null);
        }
        catch (xx) {
            console.log(xx);
            alert('Error ' + xx);
        }
    }
}
let pickerbridge = new AudioFilePicker();
//# sourceMappingURL=dataplay.js.map