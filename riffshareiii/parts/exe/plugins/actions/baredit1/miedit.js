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
        console.log('_sendMessageToHost', message);
        window.parent.postMessage(message, '*');
    }
    _receiveHostMessage(messageEvent) {
        let message = messageEvent.data;
        console.log('_receiveHostMessage', message);
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
console.log('BarTimeEdit v1.0.1');
class BarTimeEdit extends MZXBX_Plugin_UI {
    constructor() {
        super(false);
        this.callbackID = '';
    }
    onMessageFromHost(message) {
        this.currentProject = message.hostData;
        if (this.currentProject) {
            this.refreshInfo();
        }
    }
    refreshInfo() {
        let startMeasure = this.currentProject.selectedPart.startMeasure;
        let endMeasure = this.currentProject.selectedPart.endMeasure;
        if (startMeasure < 0) {
            startMeasure = 0;
            endMeasure = this.currentProject.timeline.length - 1;
        }
        let metrecount = this.currentProject.timeline[startMeasure].metre.count;
        let metrepart = this.currentProject.timeline[startMeasure].metre.part;
        let tempo = this.currentProject.timeline[startMeasure].tempo;
        let selfrom = document.getElementById('selfrom');
        if (selfrom) {
            selfrom.value = startMeasure + 1;
        }
        let selto = document.getElementById('selto');
        if (selto) {
            selto.value = endMeasure + 1;
        }
        let metreinput = document.getElementById('metreinput');
        if (metreinput) {
            metreinput.value = '' + metrecount + '/' + metrepart;
        }
        let bpm = document.getElementById('bpm');
        if (bpm) {
            bpm.value = tempo;
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
            this.setText('plugintitle', '更改选定措施');
            this.setText('sellabel', '选择');
            this.setText('splitlabel', '分离');
            this.setText('tempolabel', '音乐节奏');
            this.setText('metrelabel', '音乐节拍');
            this.setText('btndel', '删除');
            this.setText('btnclear', '清除');
            this.setText('btnadd', '添加');
            this.setText('btnpushaside', '推开');
            this.setText('btnmerge', '合并');
        }
        else {
            if (enruzhId == 'ru') {
                this.setText('plugintitle', 'Изменить такты');
                this.setText('sellabel', 'Выбрано');
                this.setText('splitlabel', 'Отделить');
                this.setText('tempolabel', 'Темп');
                this.setText('metrelabel', 'Метр');
                this.setText('btndel', 'Удалить');
                this.setText('btnclear', 'Очистить');
                this.setText('btnadd', 'Добавить');
                this.setText('btnpushaside', 'Отодвинуть');
                this.setText('btnmerge', 'Объединить');
            }
            else {
                this.setText('plugintitle', 'Change selected measures');
                this.setText('sellabel', 'Selection');
                this.setText('splitlabel', 'Split');
                this.setText('tempolabel', 'Tempo');
                this.setText('metrelabel', 'Metre');
                this.setText('btndel', 'Delete');
                this.setText('btnclear', 'Clrear');
                this.setText('btnadd', 'Add to end');
                this.setText('btnpushaside', 'Push aside');
                this.setText('btnmerge', 'Merge');
            }
        }
    }
    split() {
        console.log('split');
        this.closeDialog(this.currentProject);
    }
    setTempo() {
        let bpm = document.getElementById('bpm');
        let selfrom = document.getElementById('selfrom');
        let selto = document.getElementById('selto');
        let newTempo = parseInt(bpm.value);
        let startMeasure = parseInt(selfrom.value) - 1;
        let endMeasure = parseInt(selto.value) - 1;
        if (newTempo > 20 && newTempo < 400) {
            for (let ii = startMeasure; ii <= endMeasure; ii++) {
                this.currentProject.timeline[ii].tempo = newTempo;
            }
            this.closeDialog(this.currentProject);
        }
    }
    metre() {
        let selfrom = document.getElementById('selfrom');
        let selto = document.getElementById('selto');
        let _startMeasure = parseInt(selfrom.value) - 1;
        let _endMeasure = parseInt(selto.value) - 1;
        let txt = document.getElementById('metreinput').value;
        let newpart = parseInt(txt.split('/')[1]);
        let newcount = parseInt(txt.split('/')[0]);
        if ((newcount > 0) && (newpart == 1 || newpart == 2 || newpart == 4 || newpart == 8 || newpart == 16 || newpart == 32)) {
            let newMeter = MMUtil().set({ count: newcount, part: newpart });
            for (let ii = _startMeasure; ii <= _endMeasure; ii++) {
                let bar = this.currentProject.timeline[ii];
                bar.metre = newMeter.metre();
            }
            this.closeDialog(this.currentProject);
        }
    }
    deleteBars() {
        let selfrom = document.getElementById('selfrom');
        let selto = document.getElementById('selto');
        let _startMeasure = parseInt(selfrom.value) - 1;
        let _endMeasure = parseInt(selto.value) - 1;
        this.currentProject.timeline.splice(_startMeasure, _endMeasure - _startMeasure);
        for (let ii = 0; ii < this.currentProject.tracks.length; ii++) {
            this.currentProject.tracks[ii].measures.splice(_startMeasure, _endMeasure - _startMeasure);
        }
        for (let ii = 0; ii < this.currentProject.filters.length; ii++) {
            this.currentProject.filters[ii].automation.splice(_startMeasure, _endMeasure - _startMeasure);
        }
        for (let ii = 0; ii < this.currentProject.percussions.length; ii++) {
            this.currentProject.percussions[ii].measures.splice(_startMeasure, _endMeasure - _startMeasure);
        }
        this.currentProject.comments.splice(_startMeasure, _endMeasure - _startMeasure);
        this.closeDialog(this.currentProject);
    }
    shiftContent() {
        console.log('shiftContent');
        this.closeDialog(JSON.stringify(this.currentProject));
    }
    mergeBars() {
        let selfrom = document.getElementById('selfrom');
        let selto = document.getElementById('selto');
        let startMeasure = parseInt(selfrom.value) - 1;
        let endMeasure = parseInt(selto.value) - 1;
        let newDuration = MMUtil().set(this.currentProject.timeline[startMeasure].metre);
        for (let ii = startMeasure + 1; ii <= endMeasure; ii++) {
            for (let nn = 0; nn < this.currentProject.tracks.length; nn++) {
                let trackBar = this.currentProject.tracks[nn].measures[ii];
                let trackPreBar = this.currentProject.tracks[nn].measures[ii - 1];
                for (let kk = 0; kk < trackBar.chords.length; kk++) {
                    trackBar.chords[kk].skip = newDuration.plus(trackBar.chords[kk].skip).metre();
                    trackPreBar.chords.push(trackBar.chords[kk]);
                }
                trackBar.chords = [];
            }
            for (let nn = 0; nn < this.currentProject.percussions.length; nn++) {
                let percuBar = this.currentProject.percussions[nn].measures[ii];
                let percuPreBar = this.currentProject.percussions[nn].measures[ii - 1];
                for (let kk = 0; kk < percuBar.skips.length; kk++) {
                    percuBar.skips[kk] = newDuration.plus(percuBar.skips[kk]).metre();
                    percuPreBar.skips.push(percuBar.skips[kk]);
                }
                percuBar.skips = [];
            }
            for (let nn = 0; nn < this.currentProject.filters.length; nn++) {
                let autoBar = this.currentProject.filters[nn].automation[ii];
                let autoPreBar = this.currentProject.filters[nn].automation[ii - 1];
                for (let kk = 0; kk < autoBar.changes.length; kk++) {
                    autoBar.changes[kk].skip = newDuration.plus(autoBar.changes[kk].skip).metre();
                    autoPreBar.changes.push(autoBar.changes[kk]);
                }
                autoBar.changes = [];
            }
            let txtBar = this.currentProject.comments[ii];
            let txtPreBar = this.currentProject.comments[ii - 1];
            for (let kk = 0; kk < txtBar.points.length; kk++) {
                txtBar.points[kk].skip = newDuration.plus(txtBar.points[kk].skip).metre();
                txtPreBar.points.push(txtBar.points[kk]);
            }
            txtBar.points = [];
            newDuration = newDuration.plus(this.currentProject.timeline[ii].metre);
        }
        this.currentProject.timeline[startMeasure].metre = newDuration.metre();
        this.currentProject.selectedPart.endMeasure = this.currentProject.selectedPart.startMeasure;
        this.closeDialog(this.currentProject);
    }
    addBars() {
        console.log('addBars');
        this.closeDialog(JSON.stringify(this.currentProject));
    }
    clear() {
        let selfrom = document.getElementById('selfrom');
        let selto = document.getElementById('selto');
        let startMeasure = parseInt(selfrom.value) - 1;
        let endMeasure = parseInt(selto.value) - 1;
        let newDuration = MMUtil().set(this.currentProject.timeline[startMeasure].metre);
        let noSolo = true;
        for (let nn = 0; nn < this.currentProject.tracks.length; nn++) {
            if (this.currentProject.tracks[nn].performer.state == 2) {
                noSolo = false;
                break;
            }
        }
        for (let nn = 0; nn < this.currentProject.percussions.length; nn++) {
            if (this.currentProject.percussions[nn].sampler.state == 2) {
                noSolo = false;
                break;
            }
        }
        for (let ii = startMeasure; ii <= endMeasure; ii++) {
            for (let nn = 0; nn < this.currentProject.tracks.length; nn++) {
                if ((this.currentProject.tracks[nn].performer.state == 0 && noSolo) || this.currentProject.tracks[nn].performer.state == 2) {
                    let trackBar = this.currentProject.tracks[nn].measures[ii];
                    trackBar.chords = [];
                }
            }
            for (let nn = 0; nn < this.currentProject.percussions.length; nn++) {
                if ((this.currentProject.percussions[nn].sampler.state == 0 && noSolo) || this.currentProject.percussions[nn].sampler.state == 2) {
                    let percuBar = this.currentProject.percussions[nn].measures[ii];
                    percuBar.skips = [];
                }
            }
            for (let nn = 0; nn < this.currentProject.filters.length; nn++) {
                if (this.currentProject.filters[nn].state == 0) {
                    let autoBar = this.currentProject.filters[nn].automation[ii];
                    autoBar.changes = [];
                }
            }
            let txtBar = this.currentProject.comments[ii];
            txtBar.points = [];
            newDuration = newDuration.plus(this.currentProject.timeline[ii].metre);
        }
        this.closeDialog(this.currentProject);
    }
}
//# sourceMappingURL=miedit.js.map