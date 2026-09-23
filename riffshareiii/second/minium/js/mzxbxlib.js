"use strict";
class MZXBX_MetreMathUtil {
    set(from) {
        this.count = from.count;
        this.part = from.part;
        return this;
    }
    calculate(duration, tempo) {
        this.part = 1024.0;
        let tempPart = new MZXBX_MetreMathUtil().set({ count: 1, part: this.part }).duration(tempo);
        this.count = Math.round(duration / tempPart);
        return this.simplyfy();
    }
    metre() {
        return { count: this.count, part: this.part };
    }
    simplyfy() {
        let cc = this.count;
        let pp = this.part;
        if (cc > 0 && pp > 0) {
            while (cc % 2 == 0 && pp % 2 == 0) {
                cc = cc / 2;
                pp = pp / 2;
            }
        }
        return new MZXBX_MetreMathUtil().set({ count: cc, part: pp });
    }
    strip(toPart) {
        let cc = this.count;
        let pp = this.part;
        let rr = pp / toPart;
        cc = Math.round(cc / rr);
        pp = toPart;
        let r = new MZXBX_MetreMathUtil().set({ count: cc, part: pp }).simplyfy();
        return r;
    }
    floor(toPart) {
        let cc = this.count;
        let pp = this.part;
        let rr = pp / toPart;
        cc = Math.floor(cc / rr);
        pp = toPart;
        let r = new MZXBX_MetreMathUtil().set({ count: cc, part: pp }).simplyfy();
        return r;
    }
    equals(metre) {
        let countMe = this.count * metre.part;
        let countTo = metre.count * this.part;
        if (countMe == countTo) {
            return true;
        }
        else {
            return false;
        }
    }
    less(metre) {
        let countMe = this.count * metre.part;
        let countTo = metre.count * this.part;
        if (countMe < countTo) {
            return true;
        }
        else {
            return false;
        }
    }
    more(metre) {
        let countMe = this.count * metre.part;
        let countTo = metre.count * this.part;
        if (countMe > countTo) {
            return true;
        }
        else {
            return false;
        }
    }
    plus(metre) {
        let countMe = this.count * metre.part;
        let countTo = metre.count * this.part;
        let rr = { count: countMe + countTo, part: metre.part * this.part };
        return new MZXBX_MetreMathUtil().set(rr).simplyfy();
    }
    minus(metre) {
        let countMe = this.count * metre.part;
        let countTo = metre.count * this.part;
        let rr = { count: countMe - countTo, part: metre.part * this.part };
        return new MZXBX_MetreMathUtil().set(rr).simplyfy();
    }
    duration(tempo) {
        let wholeNoteSeconds = (4 * 60) / tempo;
        let meterSeconds = (wholeNoteSeconds * this.count) / this.part;
        return meterSeconds;
    }
    width(tempo, ratio) {
        return this.duration(tempo) * ratio;
    }
}
function MMUtil() {
    return new MZXBX_MetreMathUtil().set({ count: 0, part: 1 });
}
function MZXBX_appendScriptURL(url) {
    let scripts = document.getElementsByTagName("script");
    for (let ii = 0; ii < scripts.length; ii++) {
        let script = scripts.item(ii);
        if (script) {
            if (url == script.lockedLoaderURL) {
                return false;
            }
        }
    }
    var scriptElement = document.createElement('script');
    scriptElement.setAttribute("type", "text/javascript");
    scriptElement.setAttribute("src", url);
    scriptElement.lockedLoaderURL = url;
    let head = document.getElementsByTagName("head")[0];
    head.appendChild(scriptElement);
    return true;
}
function MZXBX_loadCachedBuffer(audioContext, path, onDone) {
    if (window['decodedArrayBuffer']) {
    }
    else {
        window['decodedArrayBuffer'] = [];
    }
    let waves = window['decodedArrayBuffer'];
    for (let ii = 0; ii < waves.length; ii++) {
        if (waves[ii].path == path) {
            if (waves[ii].buffer) {
                if (!(waves[ii].line100)) {
                    waves[ii].line100 = MZXBX_FillLinesOfBuffer(waves[ii].buffer);
                }
                onDone(waves[ii]);
            }
            else {
                if (waves[ii].canceled) {
                    console.log('cancel', waves[ii]);
                }
                else {
                    setTimeout(() => {
                    }, 999);
                }
            }
            return;
        }
    }
    let wave = {
        path: path, buffer: null
    };
    window['decodedArrayBuffer'].push(wave);
    let xhr = new XMLHttpRequest();
    xhr.responseType = 'arraybuffer';
    xhr.open("GET", path);
    let xonload = function () {
        audioContext.decodeAudioData(xhr.response, function (decodedData) {
            let waves = window['decodedArrayBuffer'];
            for (let ii = 0; ii < waves.length; ii++) {
                if (waves[ii].path == path) {
                    waves[ii].buffer = decodedData;
                    if (!(waves[ii].line100)) {
                        waves[ii].line100 = MZXBX_FillLinesOfBuffer(waves[ii].buffer);
                    }
                    onDone(waves[ii]);
                    return;
                }
            }
        }, function (err) {
            console.log(err);
            wave.canceled = true;
        });
    };
    xhr.onload = xonload;
    xhr.onerror = () => {
        wave.canceled = true;
        console.log('error', wave);
    };
    xhr.send();
}
function MZXBX_FillLinesOfBuffer(buffer) {
    let dots = [];
    if (buffer) {
        let data = buffer.getChannelData(0);
        let step = Math.round(data.length / 100);
        for (let ii = 0; ii < data.length; ii = ii + step) {
            let mx = 0;
            for (let kk = 0; kk < step; kk++) {
                if (Math.abs(data[ii + kk]) > mx)
                    mx = Math.abs(data[ii + kk]);
            }
            dots.push(mx);
        }
    }
    return dots;
}
function MZXBX_waitForCondition(sleepMs, isDone, onFinish) {
    if (isDone()) {
        onFinish();
    }
    else {
        setTimeout(() => {
            MZXBX_waitForCondition(sleepMs, isDone, onFinish);
        }, sleepMs);
    }
}
//# sourceMappingURL=mzxbxlib.js.map