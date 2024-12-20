"use strict";
var MZXBX_PluginPurpose;
(function (MZXBX_PluginPurpose) {
    MZXBX_PluginPurpose[MZXBX_PluginPurpose["Action"] = 0] = "Action";
    MZXBX_PluginPurpose[MZXBX_PluginPurpose["Filter"] = 1] = "Filter";
    MZXBX_PluginPurpose[MZXBX_PluginPurpose["Sampler"] = 2] = "Sampler";
    MZXBX_PluginPurpose[MZXBX_PluginPurpose["Performer"] = 3] = "Performer";
})(MZXBX_PluginPurpose || (MZXBX_PluginPurpose = {}));
class LocalExportPlugin {
    constructor() {
        this.callbackID = '';
        this.parsedProject = null;
        console.log('LocalExportPlugin create');
        window.addEventListener('message', this.receiveHostMessage.bind(this), false);
        window.parent.postMessage('', '*');
    }
    receiveHostMessage(par) {
        console.log('receiveHostMessage', par);
        let message = par.data;
        if (this.callbackID) {
            this.parsedProject = message.hostData;
        }
        else {
            this.callbackID = message.hostData;
        }
    }
    exportLocalfile(th) {
        console.log('exportLocalfile', th);
        if (this.parsedProject) {
            this.download(JSON.stringify(this.parsedProject, null, '	'), 'export', 'application/json');
        }
    }
    download(data, filename, type) {
        let file = new Blob([data], { type: type });
        let a = document.createElement("a");
        let url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
    }
}
//# sourceMappingURL=exportprojectlocal.js.map