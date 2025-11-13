"use strict";
class LocalProjectImport {
    constructor() {
        this.id = '';
        this.parsedProject = null;
        this.init();
    }
    init() {
        window.addEventListener('message', this.receiveHostMessage.bind(this), false);
        let msg = {
            dialogID: '',
            pluginData: null,
            done: false,
            sceenWait: false
        };
        window.parent.postMessage(msg, '*');
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
            var oo = { dialogID: this.id, pluginData: this.parsedProject, sceenWait: false, done: true };
            window.parent.postMessage(oo, '*');
        }
    }
    receiveHostMessage(par) {
        let message = par.data;
        if (this.id) {
        }
        else {
            this.id = message.hostData;
            this.setupLangColors(message);
        }
    }
    setupLangColors(message) {
        document.documentElement.style.setProperty('--background-color', message.colors.background);
        document.documentElement.style.setProperty('--main-color', message.colors.main);
        document.documentElement.style.setProperty('--drag-color', message.colors.drag);
        document.documentElement.style.setProperty('--line-color', message.colors.line);
        document.documentElement.style.setProperty('--click-color', message.colors.click);
        if (message.langID == 'ru') {
            document.getElementById('title').innerHTML = 'Загрузить локальный проект';
        }
        else {
            if (message.langID == 'zh') {
                document.getElementById('title').innerHTML = '从本地存储导入项目';
            }
            else {
                document.getElementById('title').innerHTML = 'Import project from local storage';
            }
        }
    }
}
//# sourceMappingURL=localprojimp.js.map