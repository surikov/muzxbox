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
            }
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
class ChordFinder {
    constructor(pretonic, triadPrefs, pre7, barNo, from, to, project) {
        this.halfStepNames = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
        this.tonic = -1;
        this.pretonic = -1;
        this.avg = -1;
        this.isminor = false;
        this.seventh = false;
        this.pretonic = pretonic;
        this.triadPrefs = triadPrefs;
        this.seventh = pre7;
        this.counts = [];
        this.steps12 = [];
        for (let ii = 0; ii < 128; ii++) {
            this.counts[ii] = 0;
        }
        for (let ii = 0; ii < 12; ii++) {
            this.steps12[ii] = 0;
        }
        for (let tt = 0; tt < project.tracks.length; tt++) {
            let trackMeasure = project.tracks[tt].measures[barNo];
            for (let cc = 0; cc < trackMeasure.chords.length; cc++) {
                let trackMeasureChord = trackMeasure.chords[cc];
                let mm = MMUtil().set(trackMeasureChord.skip);
                if ((!mm.less(from)) && mm.less(to)) {
                    for (let pp = 0; pp < trackMeasureChord.pitches.length; pp++) {
                        let halftone = trackMeasureChord.pitches[pp];
                        let weight = this.pitchWeight(halftone);
                        this.counts[halftone] = this.counts[halftone] + weight;
                        this.steps12[halftone % 12] = this.steps12[halftone % 12] + weight;
                    }
                }
            }
        }
        let sum = 0;
        let cnt = 0;
        for (let ii = 0; ii < 128; ii++) {
            if (this.counts[ii] > 0) {
                sum = sum + ii * this.counts[ii];
                cnt = cnt + this.counts[ii];
            }
        }
        this.avg = Math.round(sum / cnt);
        this.findTonic();
    }
    pitchWeight(half) {
        let oct = Math.floor(half / 12);
        let rr = 10 - oct;
        return 1 + rr * 0.123;
    }
    findTonic() {
        this.tonic = this.pretonic;
        for (let ii = 0; ii < 12; ii++) {
            if (this.steps12[ii] > 0) {
                if (this.tonic < 0) {
                    this.tonic = ii;
                }
                else {
                    if (this.steps12[ii] + 0.5 * this.steps12[(ii + 7) % 12] > this.steps12[this.tonic] + 0.5 * this.steps12[(this.tonic + 7) % 12]) {
                        this.tonic = ii;
                    }
                }
            }
        }
        if (this.tonic == this.pretonic) {
        }
        else {
            this.seventh = false;
        }
        if (this.steps12[(this.tonic + 10) % 12] > 0) {
            this.seventh = true;
        }
        if (this.steps12[(this.tonic + 3) % 12] > this.steps12[(this.tonic + 4) % 12]) {
            this.isminor = true;
            this.triadPrefs[this.tonic] = -1;
        }
        else {
            if (this.steps12[(this.tonic + 3) % 12] < this.steps12[(this.tonic + 4) % 12]) {
                this.isminor = false;
                this.triadPrefs[this.tonic] = 1;
            }
            else {
                if (this.triadPrefs[this.tonic] < 0) {
                    this.isminor = true;
                }
            }
        }
    }
    chordLabel() {
        let label = '';
        if (this.tonic < 0) {
            label = '?';
        }
        else {
            label = this.halfStepNames[this.tonic];
            if (this.isminor) {
                label = label + 'm';
            }
            if (this.seventh) {
                label = label + '7';
            }
        }
        return label;
    }
}
console.log('BarTimeEdit v1.0.3');
class MiniumHarmonyPlugin extends MZXBX_Plugin_UI {
    constructor() {
        super(false);
        this.callbackID = '';
        this.startMeasure = 0;
        this.endMeasure = 0;
    }
    onMessageFromHost(message) {
        this.currentProject = message.hostData;
        if (this.currentProject) {
            this.refreshInfo();
            let preview = this.setupProjectChordHints(this.currentProject);
            this.setText('preview', '' + preview);
        }
    }
    refreshInfo() {
        this.startMeasure = this.currentProject.selectedPart.startMeasure;
        this.endMeasure = this.currentProject.selectedPart.endMeasure;
        if (this.startMeasure < 0) {
            this.startMeasure = 0;
            this.endMeasure = this.currentProject.timeline.length - 1;
        }
    }
    setText(id, txt) {
        let oo = document.getElementById(id);
        if (oo) {
            oo.innerHTML = txt;
        }
    }
    onLanguaga(enruzhId) {
        if (enruzhId == 'zh') {
            this.setText('btnok', 'OK');
        }
        else {
            if (enruzhId == 'ru') {
                this.setText('btnok', 'OK');
            }
            else {
                this.setText('btnok', 'OK');
            }
        }
    }
    sendClose() {
        console.log('sendClose');
        this.closeDialog(this.currentProject);
    }
    setupProjectChordHints(project) {
        let preview = '';
        if (project) {
            let lastLabel = '';
            let step = { count: 1, part: 2 };
            let lastTonic = -1;
            let last7 = false;
            let triadPrefs = [];
            for (let hh = 0; hh < 12; hh++) {
                triadPrefs[hh] = 0;
            }
            for (let ii = this.startMeasure; ii <= this.endMeasure; ii++) {
                for (let nn = 0; nn < project.comments[ii].points.length; nn++) {
                    if (project.comments[ii].points[nn].row == 0) {
                        project.comments[ii].points.splice(nn, 1);
                        nn--;
                    }
                }
            }
            for (let ii = this.startMeasure; ii <= this.endMeasure; ii++) {
                let measure = project.timeline[ii];
                let point = MMUtil().set({ count: 0, part: 1 });
                let barLabel = ', ' + (1 + ii) + ':';
                if (ii == this.startMeasure) {
                    barLabel = '' + (1 + ii) + ':';
                }
                while (point.less(measure.metre)) {
                    let chord = new ChordFinder(lastTonic, triadPrefs, last7, ii, point, point.plus(step), project);
                    lastTonic = chord.tonic;
                    last7 = chord.seventh;
                    let label = chord.chordLabel();
                    if (label != lastLabel) {
                        preview = preview + barLabel + ' ' + label;
                        barLabel = '';
                        project.comments[ii].points.push({
                            skip: point.metre(),
                            text: label,
                            row: 0
                        });
                        lastLabel = label;
                    }
                    point = point.plus(step);
                }
            }
        }
        return preview;
    }
}
