"use strict";
console.log('Share YAVK start v1.0.1');
class YAVKSharePlugin {
    constructor() {
        this.callbackID = '';
        this.hostProject = null;
        this.setupMessaging();
    }
    setupMessaging() {
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
        }
        else {
            this.callbackID = message.hostData;
            this.setupColors(message.colors);
            this.selupLanguage(message.langID);
            localStorage.setItem('yavkmsgid', this.callbackID);
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
    selupLanguage(langID) {
        if (langID == 'ru') {
            document.getElementById("butonStart").textContent = 'Отправить';
        }
        else {
            if (langID == 'zh') {
                document.getElementById("butonStart").textContent = '分享';
            }
            else {
                document.getElementById("butonStart").textContent = 'Share';
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
    requestYaToken() {
        let redirect_uri = 'https://mzxbox.ru/minium/vkread.html';
        let client_id = 'ad8bb18784e44c64a2098ad6a342e576';
        let suggest_hostname = 'mzxbox.ru';
        let retpath = 'https://oauth.yandex.ru/authorize' +
            '?client_id=' + client_id +
            '&response_type=token' +
            '&redirect_uri=' + encodeURI(redirect_uri) +
            '&suggest_hostname=' + suggest_hostname;
        window.location.href = retpath;
    }
    startYAVKshare() {
        console.log('startYAVKshare');
        this.requestYaToken();
    }
}
//# sourceMappingURL=startup.js.map