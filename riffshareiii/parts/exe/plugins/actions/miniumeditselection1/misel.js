"use strict";
console.log('MINIUMselectionEditPlugin v1.0.1');
class MINIUMselectionEditPlugin {
    constructor() {
        this.callbackID = '';
        this.startMeasure = 0;
        this.endMeasure = 0;
        this.init();
    }
    init() {
        window.addEventListener('message', this.receiveHostMessage.bind(this), false);
        window.parent.postMessage({
            dialogID: '',
            pluginData: '',
            done: false
        }, '*');
    }
    sendImportedMIDIData() {
    }
    refreshInfo() {
        let selectionInfo = document.getElementById('selectionInfo');
        if (selectionInfo) {
            selectionInfo.innerHTML = '' + (this.startMeasure + 1) + ' - ' + (this.endMeasure + 1);
        }
    }
    receiveHostMessage(par) {
        let message = par.data;
        if (this.callbackID) {
            this.currentProject = par.data.hostData;
            if (this.currentProject) {
                this.startMeasure = this.currentProject.selectedPart.startMeasure;
                this.endMeasure = this.currentProject.selectedPart.endMeasure;
            }
            if (this.startMeasure < 0) {
                this.startMeasure = 0;
                this.endMeasure = this.currentProject.timeline.length - 1;
            }
            this.refreshInfo();
        }
        else {
            this.callbackID = message.hostData;
        }
        console.log(par);
    }
    deleteBars() {
        console.log('deleteBars');
    }
    addBars() {
        console.log('addBars');
    }
    promptTempo() {
        console.log('promptTempo');
    }
    promptMetre() {
        console.log('promptMetre');
    }
    shiftContent() {
        console.log('shiftContent');
    }
}
//# sourceMappingURL=misel.js.map