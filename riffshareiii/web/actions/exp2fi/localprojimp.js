"use strict";
var MZXBX_PluginPurpose;
(function (MZXBX_PluginPurpose) {
    MZXBX_PluginPurpose[MZXBX_PluginPurpose["Action"] = 0] = "Action";
    MZXBX_PluginPurpose[MZXBX_PluginPurpose["Filter"] = 1] = "Filter";
    MZXBX_PluginPurpose[MZXBX_PluginPurpose["Sampler"] = 2] = "Sampler";
    MZXBX_PluginPurpose[MZXBX_PluginPurpose["Performer"] = 3] = "Performer";
})(MZXBX_PluginPurpose || (MZXBX_PluginPurpose = {}));
class LocalProjectImport {
    constructor() {
        this.id = '';
        this.parsedProject = null;
        this.init();
    }
    init() {
        console.log('init MIDI import');
        window.addEventListener('message', this.receiveHostMessage.bind(this), false);
        window.parent.postMessage('', '*');
    }
    loadLocalFile(inputFile) {
        var file = inputFile.files[0];
        var fileReader = new FileReader();
        let me = this;
        fileReader.onload = function (progressEvent) {
            if (progressEvent != null) {
                console.log('loadLocalFile', progressEvent);
                me.parsedProject = JSON.parse(progressEvent.target.result);
            }
        };
        fileReader.readAsText(file);
    }
    sendLoadedData() {
        if (this.parsedProject) {
            var oo = { dialogID: this.id, pluginData: this.parsedProject };
            window.parent.postMessage(JSON.stringify(oo), '*');
        }
    }
    receiveHostMessage(par) {
        console.log('receiveHostMessage', par);
        let message = par.data;
        if (this.id) {
        }
        else {
            this.id = message.hostData;
        }
    }
}
//# sourceMappingURL=localprojimp.js.map