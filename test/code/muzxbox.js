"use strict";
console.log('MuzXBox v1.01');
var MuzXBox = (function () {
    function MuzXBox() {
        console.log('start');
    }
    MuzXBox.prototype.initAll = function () {
        console.log('initAll');
        var me = this;
        this.zInputDeviceHandler = new ZInputDeviceHandler();
        window.addEventListener("keydown", function (keyboardEvent) {
            me.zInputDeviceHandler.processKeyboardEvent(keyboardEvent);
        });
    };
    return MuzXBox;
}());
window['MuzXBox'] = new MuzXBox();
console.log('MuzXBox v1.01');
var ZInputDeviceHandler = (function () {
    function ZInputDeviceHandler() {
    }
    ZInputDeviceHandler.prototype.processKeyboardEvent = function (keyboardEvent) {
        if (keyboardEvent.code == 'KeyX') {
            this.processKeyX();
        }
        if (keyboardEvent.code == 'KeyY') {
            this.processKeyY();
        }
        if (keyboardEvent.code == 'KeyA') {
            this.processKeyA();
        }
        if (keyboardEvent.code == 'KeyB') {
            this.processKeyB();
        }
        if (keyboardEvent.key == '+') {
            this.processAnyPlus();
        }
        if (keyboardEvent.key == '-') {
            this.processAnyMinus();
        }
        if (keyboardEvent.code == 'ArrowLeft') {
            this.processArrowLeft();
        }
        if (keyboardEvent.code == 'ArrowRight') {
            this.processArrowRight();
        }
        if (keyboardEvent.code == 'ArrowUp') {
            this.processArrowUp();
        }
        if (keyboardEvent.code == 'ArrowDown') {
            this.processArrowDown();
        }
    };
    ZInputDeviceHandler.prototype.processKeyX = function () {
        console.log('KeyX');
    };
    ZInputDeviceHandler.prototype.processKeyY = function () {
        console.log('KeyY');
    };
    ZInputDeviceHandler.prototype.processKeyA = function () {
        console.log('KeyA');
    };
    ZInputDeviceHandler.prototype.processKeyB = function () {
        console.log('KeyB');
    };
    ZInputDeviceHandler.prototype.processAnyPlus = function () {
        console.log('+');
    };
    ZInputDeviceHandler.prototype.processAnyMinus = function () {
        console.log('-');
    };
    ZInputDeviceHandler.prototype.processArrowLeft = function () {
        console.log('left');
    };
    ZInputDeviceHandler.prototype.processArrowRight = function () {
        console.log('right');
    };
    ZInputDeviceHandler.prototype.processArrowUp = function () {
        console.log('up');
    };
    ZInputDeviceHandler.prototype.processArrowDown = function () {
        console.log('down');
    };
    return ZInputDeviceHandler;
}());
//# sourceMappingURL=muzxbox.js.map