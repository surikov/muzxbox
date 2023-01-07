"use strict";
class MZXBX_MetreMath {
    set(from) {
        this.count = from.count;
        this.part = from.part;
        return this;
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
        return new MZXBX_MetreMath().set({ count: cc, part: pp });
    }
    strip(toPart) {
        let cc = this.count;
        let pp = this.part;
        let rr = pp / toPart;
        cc = Math.ceil(cc / rr);
        pp = toPart;
        return new MZXBX_MetreMath().set({ count: cc, part: pp });
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
        return new MZXBX_MetreMath().set(rr).simplyfy();
    }
    minus(metre) {
        let countMe = this.count * metre.part;
        let countTo = metre.count * this.part;
        let rr = { count: countMe - countTo, part: metre.part * this.part };
        return new MZXBX_MetreMath().set(rr).simplyfy();
    }
    duration(metre, tempo) {
        let wholeNoteSeconds = (4 * 60) / tempo;
        let meterSeconds = (wholeNoteSeconds * metre.count) / metre.part;
        return meterSeconds;
    }
}
class MZXBX_ScaleMath {
    set(scale) {
        this.basePitch = scale.basePitch;
        this.step2 = scale.step2;
        this.step3 = scale.step3;
        this.step4 = scale.step4;
        this.step5 = scale.step5;
        this.step6 = scale.step6;
        this.step7 = scale.step7;
        return this;
    }
    scale() {
        return {
            basePitch: this.basePitch,
            step2: this.step2,
            step3: this.step3,
            step4: this.step4,
            step5: this.step5,
            step6: this.step6,
            step7: this.step7
        };
    }
    pitch(note) {
        let pp = this.basePitch + 12 * note.octave;
        switch (note.step) {
            case 1: {
                break;
            }
            case 2: {
                pp = pp + this.step2;
                break;
            }
            case 3: {
                pp = pp + this.step2 + this.step3;
                break;
            }
            case 4: {
                pp = pp + this.step2 + this.step3 + this.step4;
                break;
            }
            case 5: {
                pp = pp + this.step2 + this.step3 + this.step4 + this.step5;
                break;
            }
            case 6: {
                pp = pp + this.step2 + this.step3 + this.step4 + this.step5 + this.step6;
                break;
            }
            case 7: {
                pp = pp + this.step2 + this.step3 + this.step4 + this.step5 + this.step6 + this.step7;
                break;
            }
        }
        pp = pp + note.shift;
        return 0;
    }
}
let testIonianC = {
    basePitch: 0,
    step2: 2,
    step3: 2,
    step4: 1,
    step5: 2,
    step6: 2,
    step7: 2
};
let testMetre44 = {
    count: 4,
    part: 4
};
let testSongProject = {
    title: "Test song",
    timeline: [
        { tempo: 120, metre: testMetre44, scale: testIonianC },
        { tempo: 120, metre: testMetre44, scale: testIonianC },
        { tempo: 120, metre: testMetre44, scale: testIonianC },
        { tempo: 120, metre: testMetre44, scale: testIonianC }
    ],
    tracks: [],
    percussions: [],
    filters: [
        {
            id: "simple_volume",
            parameters: [
                {
                    title: "value",
                    places: [{ items: [{ skip: { count: 0, part: 4 }, data: "0.7" }] }, { items: [] }, { items: [] }, { items: [] }]
                }
            ]
        }
    ]
};
console.log("MuzXbox v1.0.1");
class MuzXbox {
    constructor() {
        this.uiStarted = false;
        this.initAfterLoad();
    }
    initAfterLoad() {
        console.log("MuzXbox loaded");
    }
    initFromUI() {
        if (this.uiStarted) {
            console.log("skip initFromUI");
        }
        else {
            console.log("start initFromUI");
            this.initAudioContext();
        }
    }
    initAudioContext() {
        let AudioContextFunc = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioContextFunc();
        console.log(this.audioContext);
        if (this.audioContext.state == "running") {
            this.uiStarted = true;
        }
    }
}
class MusicTicker {
    startPlay() { }
    cancelPlay() { }
    setPosition(seconds) { }
    getPosition() {
        return 0;
    }
}
//# sourceMappingURL=base.js.map