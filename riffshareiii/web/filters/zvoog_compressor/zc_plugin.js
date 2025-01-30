"use strict";
console.log('zecho v1.0');
class ZCompressorImplementation {
    constructor() {
        this.num = 1;
    }
    createAll(context) {
        this.audioContext = context;
        this.inputNode = this.audioContext.createGain();
        this.outputNode = this.audioContext.createGain();
        this.compressor = this.audioContext.createDynamicsCompressor();
        var threshold = -40;
        var knee = 35;
        var ratio = 15;
        var attack = 0.02;
        var release = 0.91;
        this.compressor.threshold.setValueAtTime(threshold, this.audioContext.currentTime + 0.0001);
        this.compressor.knee.setValueAtTime(knee, this.audioContext.currentTime + 0.0001);
        this.compressor.ratio.setValueAtTime(ratio, this.audioContext.currentTime + 0.0001);
        this.compressor.attack.setValueAtTime(attack, this.audioContext.currentTime + 0.0001);
        this.compressor.release.setValueAtTime(release, this.audioContext.currentTime + 0.0001);
        this.dry = this.audioContext.createGain();
        this.wet = this.audioContext.createGain();
        this.dry.gain.setTargetAtTime(0.001, 0, 0.0001);
        this.wet.gain.setTargetAtTime(0.999, 0, 0.0001);
        this.inputNode.connect(this.dry);
        this.inputNode.connect(this.compressor);
        this.compressor.connect(this.wet);
        this.dry.connect(this.outputNode);
        this.wet.connect(this.outputNode);
    }
    launch(context, parameters) {
        if (this.audioContext) {
        }
        else {
            this.createAll(context);
        }
        this.schedule(this.audioContext.currentTime + 0.0001, 120, parameters);
    }
    busy() {
        return null;
    }
    schedule(when, tempo, parameters) {
        this.wet.gain.setValueAtTime(this.num, when);
        this.dry.gain.setValueAtTime(1 - this.num, when);
        this.num = parseInt(parameters);
        this.wet.gain.linearRampToValueAtTime(this.num, when + 0.001);
        this.dry.gain.linearRampToValueAtTime(1 - this.num, when + 0.001);
    }
    input() {
        return this.inputNode;
    }
    output() {
        return this.outputNode;
    }
}
class ZCO {
    constructor() {
        this.id = '';
        this.data = '';
    }
    init() {
        window.addEventListener('message', this.receiveHostMessage.bind(this), false);
        this.sendMessageToHost('');
        this.slider = document.getElementById('coctrl');
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
function initZC() {
    let zz = new ZCO();
    zz.init();
}
function newZvoogCompreImplementation() {
    return new ZCompressorImplementation();
}
//# sourceMappingURL=zc_plugin.js.map