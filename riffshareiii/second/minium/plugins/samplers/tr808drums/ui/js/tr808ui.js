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
    constructor(screenWait) {
        super(screenWait);
        this.currentParameters = {
            volume: 100,
            ratio: 0,
            nn: 70
        };
        setupVolumeRange();
    }
    onMessageFromHost(message) {
        if (message.hostData) {
            let props = JSON.parse(message.hostData);
            this.currentParameters = {
                volume: props.volume,
                ratio: props.ratio,
                nn: props.nn
            };
        }
        showSpotFocus(this.currentParameters.nn);
        showVolumeFreq(this.currentParameters.volume, this.currentParameters.ratio);
    }
    sendProps() {
        this.updateHostData(JSON.stringify(this.currentParameters));
    }
    onLanguaga(enruzhId) {
    }
}
function showVolumeFreq(percents, ratio) {
    let rangeforvolume808 = document.querySelector("#rangeforvolume808");
    if (rangeforvolume808) {
        rangeforvolume808.value = Math.round(percents / 10);
    }
    let freqRatio = document.querySelector("#freqRatio");
    if (freqRatio) {
        freqRatio.value = Math.round(ratio);
    }
}
function setupVolumeRange() {
    let rangeforvolume808 = document.querySelector("#rangeforvolume808");
    if (rangeforvolume808) {
        rangeforvolume808.addEventListener("change", (event) => {
            console.log('rangeforvolume808', rangeforvolume808.value);
            ui808.currentParameters.volume = 10 * rangeforvolume808.value;
            ui808.sendProps();
        });
    }
    let freqRatio = document.querySelector("#freqRatio");
    if (freqRatio) {
        freqRatio.addEventListener("change", (event) => {
            ui808.currentParameters.ratio = 1 * freqRatio.value;
            ui808.sendProps();
        });
    }
}
function spotClicked(num) {
    showSpotFocus(num);
    ui808.currentParameters.nn = 1 * num;
    ui808.sendProps();
}
function showSpotFocus(nn) {
    clearFocus();
    let id = '#drum' + nn;
    let spot = document.querySelector(id);
    if (spot) {
        spot.classList.remove(cssSpotClassName(nn));
        spot.classList.add(cssFocusClassName(nn));
        spot.scrollIntoView();
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