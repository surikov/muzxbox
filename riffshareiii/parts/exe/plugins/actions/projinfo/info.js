"use strict";
var MZXBX_PluginKind;
(function (MZXBX_PluginKind) {
    MZXBX_PluginKind[MZXBX_PluginKind["Action"] = 0] = "Action";
    MZXBX_PluginKind[MZXBX_PluginKind["Filter"] = 1] = "Filter";
    MZXBX_PluginKind[MZXBX_PluginKind["Sampler"] = 2] = "Sampler";
    MZXBX_PluginKind[MZXBX_PluginKind["Performer"] = 3] = "Performer";
})(MZXBX_PluginKind || (MZXBX_PluginKind = {}));
class ActionPluginStatistics {
    constructor() {
        this.callbackID = '';
        this.parsedProject = null;
        this.init();
    }
    init() {
        window.addEventListener('message', this.receiveHostMessage.bind(this), false);
    }
    sendChangedData() {
        console.log('sendChangedData');
        if (this.parsedProject) {
            let input = document.getElementById('project_title');
            if (input) {
                this.parsedProject.title = input.value;
            }
            var oo = {
                dialogID: this.callbackID,
                data: JSON.stringify(this.parsedProject)
            };
            window.parent.postMessage(JSON.stringify(oo), '*');
        }
        else {
            alert('No parsed data');
        }
    }
    receiveHostMessage(par) {
        console.log('receiveHostMessage', par);
        try {
            var oo = JSON.parse(par.data);
            this.callbackID = oo.dialogID;
            this.parsedProject = JSON.parse(oo.data);
        }
        catch (xx) {
            console.log(xx);
        }
        let input = document.getElementById('project_title');
        if (input) {
            if (this.parsedProject) {
                input.value = this.parsedProject.title;
            }
        }
    }
}
function newActionPluginStatistics() {
    return new ActionPluginStatistics();
}
//# sourceMappingURL=info.js.map