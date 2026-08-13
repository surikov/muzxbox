"use strict";
class MZXBX_Plugin_UI {
    constructor(screenWait) {
        this.dialogId = '';
        this.hostData = '';
        window.addEventListener('message', this._receiveHostMessage.bind(this), false);
        this._sendMessageToHost('', false, screenWait);
    }
    closeDialog(data) {
        this._sendMessageToHost(data, true, false);
    }
    updateHostData(data) {
        this._sendMessageToHost(data, false, false);
    }
    _sendMessageToHost(data, done, screenWait) {
        var message = {
            dialogID: this.dialogId,
            pluginData: data,
            done: done,
            screenWait: screenWait
        };
        console.log('MZXBX_Plugin_UI._sendMessageToHost', message);
        window.parent.postMessage(message, '*');
    }
    _receiveHostMessage(messageEvent) {
        let message = messageEvent.data;
        console.log('MZXBX_Plugin_UI._receiveHostMessage', message);
        if (message) {
            if (this.dialogId) {
                this.hostData = message.hostData;
                this.onMessageFromHost(message);
            }
            else {
                this.dialogId = message.hostData;
                this.onLanguaga(message.langID);
                if (message.colors) {
                    document.documentElement.style.setProperty('--background-color', message.colors.background);
                    document.documentElement.style.setProperty('--main-color', message.colors.main);
                    document.documentElement.style.setProperty('--drag-color', message.colors.drag);
                    document.documentElement.style.setProperty('--line-color', message.colors.line);
                    document.documentElement.style.setProperty('--click-color', message.colors.click);
                }
            }
        }
    }
}
console.log('UI 808');
class UI808 extends MZXBX_Plugin_UI {
    onMessageFromHost(message) {
        if (message.hostData) {
            let props = JSON.parse(message.hostData);
            showSpotFocus(props.nn);
        }
    }
    onLanguaga(enruzhId) {
    }
}
function spotClicked(num) {
    showSpotFocus(num);
    let par = {
        volume: 100,
        ratio: 1,
        nn: 1 * num
    };
    ui808.updateHostData(JSON.stringify(par));
}
function showSpotFocus(nn) {
    clearFocus();
    let id = '#drum' + nn;
    let spot = document.querySelector(id);
    if (spot) {
        spot.classList.remove(cssSpotClassName(nn));
        spot.classList.add(cssFocusClassName(nn));
        spot.scrollIntoView();
        console.log('spot', spot);
        let carouselItemsDiv = document.querySelector('#carouselItemsDiv');
        console.log('carouselItemsDiv', carouselItemsDiv);
        let markers = document.querySelector('::scroll-marker-group');
        console.log('markers', markers);
    }
}
function clearFocus() {
    for (let ii = 0; ii < 32; ii++) {
        resetSpotClass(ii);
    }
}
function cssFocusClassName(nn) {
    let cssName = 'kickFocus';
    if (nn > 7)
        cssName = 'snareFocus';
    if (nn > 11)
        cssName = 'clapFocus';
    if (nn > 15)
        cssName = 'hiFocus';
    if (nn > 19)
        cssName = 'hatFocus';
    if (nn > 23)
        cssName = 'cowbellFocus';
    if (nn > 27)
        cssName = 'tomFocus';
    return cssName;
}
function cssSpotClassName(nn) {
    let cssName = 'kickSpot';
    if (nn > 7)
        cssName = 'snareSpot';
    if (nn > 11)
        cssName = 'clapSpot';
    if (nn > 15)
        cssName = 'hiSpot';
    if (nn > 19)
        cssName = 'hatSpot';
    if (nn > 23)
        cssName = 'cowbellSpot';
    if (nn > 27)
        cssName = 'tomSpot';
    return cssName;
}
function resetSpotClass(nn) {
    let id = '#drum' + nn;
    let spot = document.querySelector(id);
    spot.classList.remove(cssSpotClassName(nn));
    spot.classList.remove(cssFocusClassName(nn));
    spot.classList.add(cssSpotClassName(nn));
}
let ui808 = new UI808(false);
//# sourceMappingURL=tr808ui.js.map