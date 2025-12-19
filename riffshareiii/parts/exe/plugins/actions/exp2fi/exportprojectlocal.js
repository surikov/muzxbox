"use strict";
console.log('Export local v1.0.1');
class LocalExportPlugin {
    constructor() {
        this.callbackID = '';
        this.hostProject = null;
        this.init();
    }
    init() {
        window.addEventListener('message', this.receiveHostMessage.bind(this), false);
        let msg = {
            dialogID: this.callbackID,
            pluginData: null,
            done: false,
            screenWait: true
        };
        window.parent.postMessage(msg, '*');
    }
    receiveHostMessage(par) {
        let message = par.data;
        if (this.callbackID) {
            this.hostProject = message.hostData;
        }
        else {
            this.callbackID = message.hostData;
            this.setupColors(message.colors);
        }
        if (message.screenData) {
            let sz = 500;
            let canvas = document.getElementById("prvw");
            if (canvas) {
                let context = canvas.getContext('2d');
                var imageData = context.getImageData(0, 0, sz, sz);
                imageData.data.set(message.screenData);
                context.putImageData(imageData, 0, 0);
            }
        }
    }
    setupColors(colors) {
        document.documentElement.style.setProperty('--background-color', colors.background);
        document.documentElement.style.setProperty('--main-color', colors.main);
        document.documentElement.style.setProperty('--drag-color', colors.drag);
        document.documentElement.style.setProperty('--line-color', colors.line);
        document.documentElement.style.setProperty('--click-color', colors.click);
    }
    exportLocalfile(th) {
        if (this.hostProject) {
            this.download(JSON.stringify(this.hostProject), 'minium', 'application/json');
            let msg = {
                dialogID: this.callbackID,
                pluginData: null,
                done: true,
                screenWait: false
            };
            window.parent.postMessage(msg, '*');
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
    exportImage() {
        console.log('exportImage');
        let canvas = document.getElementById("prvw");
        if (canvas) {
            let dataURl = canvas.toDataURL('image/png');
            canvas.toBlob((blob) => {
                console.log('blob', blob);
                if (blob) {
                    let pro = blob.arrayBuffer();
                    pro.catch((reason) => {
                        console.log('reason', reason);
                    });
                    pro.then((arrayBuffer) => {
                        console.log('arrayBuffer', arrayBuffer);
                    });
                }
            }, 'image/png');
            let a = document.createElement("a");
            a.href = dataURl;
            a.download = "minium";
            document.body.appendChild(a);
            a.click();
        }
    }
}
//# sourceMappingURL=exportprojectlocal.js.map