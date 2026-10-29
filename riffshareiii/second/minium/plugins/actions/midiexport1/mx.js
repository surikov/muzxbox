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
class TreeValue {
    constructor(name, value, children) {
        this.name = name;
        this.value = value;
        this.content = children;
    }
    clone() {
        var r = new TreeValue('', '', []);
        r.name = this.name;
        r.value = this.value;
        r.content = [];
        for (var i = 0; i < this.content.length; i++) {
            r.content.push(this.content[i].clone());
        }
        return r;
    }
    advance(name, values) {
        for (let ii = 0; ii < values.length; ii++) {
            this.content.push(new TreeValue(name, values[ii], []));
        }
        return this;
    }
    first(name) {
        for (let i = 0; i < this.content.length; i++) {
            if (this.content[i].name == name) {
                return this.content[i];
            }
        }
        let tv = new TreeValue(name, '', []);
        this.content.push(tv);
        return tv;
    }
    exists(name) {
        for (let i = 0; i < this.content.length; i++) {
            if (this.content[i].name == name) {
                return true;
            }
        }
        return false;
    }
    every(name) {
        let r = [];
        for (let i = 0; i < this.content.length; i++) {
            if (this.content[i].name == name) {
                r.push(this.content[i]);
            }
        }
        return r;
    }
    seek(name, subname, subvalue) {
        for (let i = 0; i < this.content.length; i++) {
            if (this.content[i].name == name) {
                var t = this.content[i].first(subname);
                if (t.value == subvalue) {
                    return this.content[i];
                }
            }
        }
        return new TreeValue('', '', []);
    }
    readDocChildren(node) {
        let children = [];
        if (node.children) {
            for (let i = 0; i < node.children.length; i++) {
                let c = node.children[i];
                let t = '';
                if (c.childNodes && c.childNodes[0] && c.childNodes[0].nodeName == '#text') {
                    t = ('' + c.childNodes[0].nodeValue).trim();
                }
                children.push(new TreeValue(c.localName, t, this.readDocChildren(c)));
            }
        }
        if (node.attributes) {
            for (let i = 0; i < node.attributes.length; i++) {
                let a = node.attributes[i];
                children.push(new TreeValue(a.localName, a.value, []));
            }
        }
        return children;
    }
    fillFromDocument(document) {
        var tt = this.readDocChildren(document);
        if (tt.length > 0) {
            this.name = tt[0].name;
            this.value = tt[0].value;
            this.content = tt[0].content;
        }
    }
    fillFromXMLstring(xml) {
        var windowDOMParser = new window.DOMParser();
        var dom = windowDOMParser.parseFromString(xml, "text/xml");
        this.readDocChildren(dom.childNodes);
    }
    ;
    readObjectChildren(oo) {
        if (oo) {
            let keys = Object.keys(oo);
            for (let ii = 0; ii < keys.length; ii++) {
                let key = keys[ii];
                let value = oo[keys[ii]];
                if (Array.isArray(value)) {
                    for (let nn = 0; nn < value.length; nn++) {
                        let subValue = value[nn];
                        let tv = new TreeValue(key, '', []);
                        if (Array.isArray(subValue)) {
                            tv.readObjectChildren(subValue);
                        }
                        else {
                            if (typeof value === 'object') {
                                tv.readObjectChildren(subValue);
                            }
                            else {
                                tv.value = '' + subValue;
                            }
                        }
                        this.content.push(tv);
                    }
                }
                else {
                    if (typeof value === 'object') {
                        let tv = new TreeValue(key, '', []);
                        tv.readObjectChildren(value);
                        this.content.push(tv);
                    }
                    else {
                        this.content.push(new TreeValue(key, '' + value, []));
                    }
                }
            }
        }
    }
    fillFromJSONstring(json) {
        let oo = JSON.parse(json);
        this.readObjectChildren(oo);
    }
    dump(pad, symbol) {
        console.log(pad, this.name, ':', this.value);
        for (var i = 0; i < this.content.length; i++) {
            this.content[i].dump(pad + symbol, symbol);
        }
    }
    ;
}
class ControllerChangeEvent {
    constructor(fields) {
        this.channel = fields.channel - 1 || 0;
        this.controllerValue = fields.controllerValue;
        this.controllerNumber = fields.controllerNumber;
        this.delta = fields.delta || 0x00;
        this.name = 'ControllerChangeEvent';
        this.status = 0xB0;
        this.data = Utils.numberToVariableLength(fields.delta).concat(this.status | this.channel, this.controllerNumber, this.controllerValue);
    }
}
class NoteEvent {
    constructor(fields) {
        this.data = [];
        this.name = 'NoteEvent';
        this.pitch = Utils.toArray(fields.pitch);
        this.channel = fields.channel || 1;
        this.duration = fields.duration || '4';
        this.grace = fields.grace;
        this.repeat = fields.repeat || 1;
        this.sequential = fields.sequential || false;
        this.tick = fields.startTick || fields.tick || null;
        this.velocity = fields.velocity || 50;
        this.wait = fields.wait || 0;
        this.tickDuration = Utils.getTickDuration(this.duration);
        this.restDuration = Utils.getTickDuration(this.wait);
        this.events = [];
    }
    buildData() {
        this.data = [];
        if (this.grace) {
            const graceDuration = 1;
            this.grace = Utils.toArray(this.grace);
            this.grace.forEach(() => {
                const noteEvent = new NoteEvent({ pitch: this.grace, duration: 'T' + graceDuration });
                this.data = this.data.concat(noteEvent.data);
            });
        }
        if (!this.sequential) {
            for (let j = 0; j < this.repeat; j++) {
                this.pitch.forEach((p, i) => {
                    let noteOnNew;
                    if (i == 0) {
                        noteOnNew = new NoteOnEvent({
                            channel: this.channel,
                            wait: this.wait,
                            delta: Utils.getTickDuration(this.wait),
                            velocity: this.velocity,
                            pitch: p,
                            tick: this.tick,
                        });
                    }
                    else {
                        noteOnNew = new NoteOnEvent({
                            channel: this.channel,
                            wait: 0,
                            delta: 0,
                            velocity: this.velocity,
                            pitch: p,
                            tick: this.tick,
                        });
                    }
                    this.events.push(noteOnNew);
                });
                this.pitch.forEach((p, i) => {
                    let noteOffNew;
                    if (i == 0) {
                        noteOffNew = new NoteOffEvent({
                            channel: this.channel,
                            duration: this.duration,
                            velocity: this.velocity,
                            pitch: p,
                            tick: (this.tick !== null ? Utils.getTickDuration(this.duration) + this.tick : null),
                        });
                    }
                    else {
                        noteOffNew = new NoteOffEvent({
                            channel: this.channel,
                            duration: 0,
                            velocity: this.velocity,
                            pitch: p,
                            tick: (this.tick !== null ? Utils.getTickDuration(this.duration) + this.tick : null),
                        });
                    }
                    this.events.push(noteOffNew);
                });
            }
        }
        else {
            for (let j = 0; j < this.repeat; j++) {
                this.pitch.forEach((p, i) => {
                    const noteOnNew = new NoteOnEvent({
                        channel: this.channel,
                        wait: (i > 0 ? 0 : this.wait),
                        delta: (i > 0 ? 0 : Utils.getTickDuration(this.wait)),
                        velocity: this.velocity,
                        pitch: p,
                        tick: this.tick,
                    });
                    const noteOffNew = new NoteOffEvent({
                        channel: this.channel,
                        duration: this.duration,
                        velocity: this.velocity,
                        pitch: p,
                    });
                    this.events.push(noteOnNew, noteOffNew);
                });
            }
        }
        return this;
    }
}
class NoteOffEvent {
    constructor(fields) {
        this.name = 'NoteOffEvent';
        this.channel = fields.channel || 1;
        this.pitch = fields.pitch;
        this.velocity = fields.velocity || 50;
        this.tick = (fields.tick || null);
        this.data = fields.data;
        this.delta = fields.delta || Utils.getTickDuration(fields.duration);
        this.status = 0x80;
    }
    buildData(track, precisionDelta, options = {}) {
        if (this.tick === null) {
            this.tick = Utils.getRoundedIfClose(this.delta + track.tickPointer);
        }
        this.deltaWithPrecisionCorrection = Utils.getRoundedIfClose(this.delta - precisionDelta);
        this.data = Utils.numberToVariableLength(this.deltaWithPrecisionCorrection)
            .concat(this.status | this.channel - 1, Utils.getPitch(this.pitch, options.middleC), Utils.convertVelocity(this.velocity));
        return this;
    }
}
class NoteOnEvent {
    constructor(fields) {
        this.name = 'NoteOnEvent';
        this.channel = fields.channel || 1;
        this.pitch = fields.pitch;
        this.wait = fields.wait || 0;
        this.velocity = fields.velocity || 50;
        this.tick = (fields.tick || null);
        this.delta = null;
        this.data = fields.data;
        this.status = 0x90;
    }
    buildData(track, precisionDelta, options = {}) {
        this.data = [];
        if (this.tick) {
            this.tick = Utils.getRoundedIfClose(this.tick);
            if (track.tickPointer == 0) {
                this.delta = this.tick;
            }
        }
        else {
            this.delta = Utils.getTickDuration(this.wait);
            this.tick = Utils.getRoundedIfClose(track.tickPointer + this.delta);
        }
        this.deltaWithPrecisionCorrection = Utils.getRoundedIfClose(this.delta - precisionDelta);
        this.data = Utils.numberToVariableLength(this.deltaWithPrecisionCorrection)
            .concat(this.status | this.channel - 1, Utils.getPitch(this.pitch, options.middleC), Utils.convertVelocity(this.velocity));
        console.log(this.deltaWithPrecisionCorrection, 'channel', (this.status | this.channel - 1), this.status, this.channel, 'pitch', Utils.getPitch(this.pitch, options.middleC));
        return this;
    }
}
class NoteOnEventOnOff2 {
    constructor(channel, tickDelta, pitch, velocity, isOn) {
        let statOnOff = 0x90;
        if (!isOn) {
            statOnOff = 0x80;
        }
        this.data = Utils.numberToVariableLength(tickDelta)
            .concat(statOnOff | channel, pitch, velocity);
    }
}
class PitchBendEvent {
    constructor(fields) {
        this.channel = fields.channel || 0;
        this.delta = fields.delta || 0x00;
        this.name = 'PitchBendEvent';
        this.status = 0xE0;
        const bend14 = this.scale14bits(fields.bend);
        const lsbValue = bend14 & 0x7f;
        const msbValue = (bend14 >> 7) & 0x7f;
        this.data = Utils.numberToVariableLength(this.delta).concat(this.status | this.channel, lsbValue, msbValue);
    }
    scale14bits(zeroOne) {
        if (zeroOne <= 0) {
            return Math.floor(16384 * (zeroOne + 1) / 2);
        }
        return Math.floor(16383 * (zeroOne + 1) / 2);
    }
}
class ProgramChangeEvent {
    constructor(fields) {
        this.channel = fields.channel || 0;
        this.delta = fields.delta || 0x00;
        this.instrument = fields.instrument;
        this.status = 0xC0;
        this.name = 'ProgramChangeEvent';
        this.data = Utils.numberToVariableLength(this.delta).concat(this.status | this.channel, this.instrument);
    }
}
class CopyrightEvent {
    constructor(fields) {
        this.delta = fields.delta || 0x00;
        this.name = 'CopyrightEvent';
        this.text = fields.text;
        this.type = 0x02;
        const textBytes = Utils.stringToBytes(this.text);
        this.data = Utils.numberToVariableLength(this.delta).concat(Constants.META_EVENT_ID, this.type, Utils.numberToVariableLength(textBytes.length), textBytes);
    }
}
class CuePointEvent {
    constructor(fields) {
        this.delta = fields.delta || 0x00;
        this.name = 'CuePointEvent';
        this.text = fields.text;
        this.type = 0x07;
        const textBytes = Utils.stringToBytes(this.text);
        this.data = Utils.numberToVariableLength(this.delta).concat(Constants.META_EVENT_ID, this.type, Utils.numberToVariableLength(textBytes.length), textBytes);
    }
}
class EndTrackEvent {
    constructor(fields) {
        this.delta = (fields === null || fields === void 0 ? void 0 : fields.delta) || 0x00;
        this.name = 'EndTrackEvent';
        this.type = [0x2F, 0x00];
        this.data = Utils.numberToVariableLength(this.delta).concat(Constants.META_EVENT_ID, this.type);
    }
}
class InstrumentNameEvent {
    constructor(fields) {
        this.delta = fields.delta || 0x00;
        this.name = 'InstrumentNameEvent';
        this.text = fields.text;
        this.type = 0x04;
        const textBytes = Utils.stringToBytes(this.text);
        this.data = Utils.numberToVariableLength(this.delta).concat(Constants.META_EVENT_ID, this.type, Utils.numberToVariableLength(textBytes.length), textBytes);
    }
}
class KeySignatureEvent {
    constructor(sf, mi) {
        this.name = 'KeySignatureEvent';
        this.type = 0x59;
        let mode = mi || 0;
        sf = sf || 0;
        if (typeof mi === 'undefined') {
            const fifths = [
                ['Cb', 'Gb', 'Db', 'Ab', 'Eb', 'Bb', 'F', 'C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#'],
                ['ab', 'eb', 'bb', 'f', 'c', 'g', 'd', 'a', 'e', 'b', 'f#', 'c#', 'g#', 'd#', 'a#']
            ];
            const _sflen = sf.length;
            let note = sf || 'C';
            if (sf[0] === sf[0].toLowerCase())
                mode = 1;
            if (_sflen > 1) {
                switch (sf.charAt(_sflen - 1)) {
                    case 'm':
                        mode = 1;
                        note = sf.charAt(0).toLowerCase();
                        note = note.concat(sf.substring(1, _sflen - 1));
                        break;
                    case '-':
                        mode = 1;
                        note = sf.charAt(0).toLowerCase();
                        note = note.concat(sf.substring(1, _sflen - 1));
                        break;
                    case 'M':
                        mode = 0;
                        note = sf.charAt(0).toUpperCase();
                        note = note.concat(sf.substring(1, _sflen - 1));
                        break;
                    case '+':
                        mode = 0;
                        note = sf.charAt(0).toUpperCase();
                        note = note.concat(sf.substring(1, _sflen - 1));
                        break;
                }
            }
            const fifthindex = fifths[mode].indexOf(note);
            sf = fifthindex === -1 ? 0 : fifthindex - 7;
        }
        this.data = Utils.numberToVariableLength(0x00).concat(Constants.META_EVENT_ID, this.type, [0x02], Utils.numberToBytes(sf, 1), Utils.numberToBytes(mode, 1));
    }
}
class LyricEvent {
    constructor(fields) {
        this.delta = fields.delta || 0x00;
        this.name = 'LyricEvent';
        this.text = fields.text;
        this.type = 0x05;
        const textBytes = Utils.stringToBytes(this.text);
        this.data = Utils.numberToVariableLength(this.delta).concat(Constants.META_EVENT_ID, this.type, Utils.numberToVariableLength(textBytes.length), textBytes);
    }
}
class MarkerEvent {
    constructor(fields) {
        this.delta = fields.delta || 0x00;
        this.name = 'MarkerEvent';
        this.text = fields.text;
        this.type = 0x06;
        const textBytes = Utils.stringToBytes(this.text);
        this.data = Utils.numberToVariableLength(this.delta).concat(Constants.META_EVENT_ID, this.type, Utils.numberToVariableLength(textBytes.length), textBytes);
    }
}
class TempoEvent {
    constructor(fields) {
        this.bpm = fields.bpm;
        this.delta = fields.delta || 0x00;
        this.tick = fields.tick;
        this.name = 'TempoEvent';
        this.type = 0x51;
        const tempo = Math.round(60000000 / this.bpm);
        this.data = Utils.numberToVariableLength(this.delta).concat(Constants.META_EVENT_ID, this.type, [0x03], Utils.numberToBytes(tempo, 3));
    }
}
class TrackTextEvent {
    constructor(fields) {
        this.delta = fields.delta || 0x00;
        this.text = fields.text;
        this.name = 'TextEvent';
        this.type = 0x01;
        const textBytes = Utils.stringToBytes(this.text);
        this.data = Utils.numberToVariableLength(fields.delta).concat(Constants.META_EVENT_ID, this.type, Utils.numberToVariableLength(textBytes.length), textBytes);
    }
}
class TimeSignatureEvent {
    constructor(numerator, denominator, midiclockspertick, notespermidiclock) {
        this.name = 'TimeSignatureEvent';
        this.type = 0x58;
        this.data = Utils.numberToVariableLength(0x00).concat(Constants.META_EVENT_ID, this.type, [0x04], Utils.numberToBytes(numerator, 1), Utils.numberToBytes(Math.log2(denominator), 1), Utils.numberToBytes(midiclockspertick || 24, 1), Utils.numberToBytes(notespermidiclock || 8, 1));
    }
}
class TrackNameEvent {
    constructor(fields) {
        this.delta = fields.delta || 0x00;
        this.name = 'TrackNameEvent';
        this.text = fields.text;
        this.type = 0x03;
        const textBytes = Utils.stringToBytes(this.text);
        this.data = Utils.numberToVariableLength(this.delta).concat(Constants.META_EVENT_ID, this.type, Utils.numberToVariableLength(textBytes.length), textBytes);
    }
}
class MHeader {
    constructor(numberOfTracks) {
        this.type = Constants.HEADER_CHUNK_TYPE;
        const trackType = numberOfTracks > 1 ? Constants.HEADER_CHUNK_FORMAT1 : Constants.HEADER_CHUNK_FORMAT0;
        this.data = trackType.concat(Utils.numberToBytes(numberOfTracks, 2), Constants.HEADER_CHUNK_DIVISION);
        this.size = [0, 0, 0, this.data.length];
    }
}
class Track {
    constructor() {
        this.type = Constants.TRACK_CHUNK_TYPE;
        this.data = [];
        this.size = [];
        this.events = [];
        this.explicitTickEvents = [];
        this.tickPointer = 0;
    }
    addEvent(events, mapFunction) {
        Utils.toArray(events).forEach((event, i) => {
            if (event instanceof NoteEvent) {
                if (typeof mapFunction === 'function') {
                    const properties = mapFunction(i, event);
                    if (typeof properties === 'object') {
                        Object.assign(event, properties);
                    }
                }
                if (event.tick !== null) {
                    this.explicitTickEvents.push(event);
                }
                else {
                    event.buildData().events.forEach((e) => this.events.push(e));
                }
            }
            else {
                this.events.push(event);
            }
        });
        return this;
    }
    buildData(options = {}) {
        this.data = [];
        this.size = [];
        this.tickPointer = 0;
        let precisionLoss = 0;
        this.events.forEach((event) => {
            if (event instanceof NoteOnEvent || event instanceof NoteOffEvent) {
                const built = event.buildData(this, precisionLoss, options);
                precisionLoss = Utils.getPrecisionLoss(event.deltaWithPrecisionCorrection || 0);
                this.data = this.data.concat(built.data);
                this.tickPointer = Utils.getRoundedIfClose(event.tick);
            }
            else if (event instanceof TempoEvent) {
                this.tickPointer = Utils.getRoundedIfClose(event.tick);
                this.data = this.data.concat(event.data);
            }
            else {
                this.data = this.data.concat(event.data);
            }
        });
        this.mergeExplicitTickEvents();
        if (!this.events.length || !(this.events[this.events.length - 1] instanceof EndTrackEvent)) {
            this.data = this.data.concat((new EndTrackEvent).data);
        }
        this.size = Utils.numberToBytes(this.data.length, 4);
        return this;
    }
    mergeExplicitTickEvents() {
        if (!this.explicitTickEvents.length)
            return;
        this.explicitTickEvents.sort((a, b) => a.tick - b.tick);
        this.explicitTickEvents.forEach((noteEvent) => {
            noteEvent.buildData().events.forEach((e) => e.buildData(this));
            noteEvent.events.forEach((event) => this.mergeSingleEvent(event));
        });
        this.explicitTickEvents = [];
        this.buildData();
    }
    mergeTrack(track) {
        this.buildData();
        track.buildData().events.forEach((event) => this.mergeSingleEvent(event));
        return this;
    }
    mergeSingleEvent(event) {
        if (!this.events.length) {
            return this.addEvent(event);
        }
        let lastEventIndex;
        for (let i = 0; i < this.events.length; i++) {
            if (this.events[i].tick > event.tick)
                break;
            lastEventIndex = i;
        }
        const splicedEventIndex = lastEventIndex + 1;
        event.delta = event.tick - this.events[lastEventIndex].tick;
        this.events.splice(splicedEventIndex, 0, event);
        for (let i = splicedEventIndex + 1; i < this.events.length; i++) {
            this.events[i].delta = this.events[i].tick - this.events[i - 1].tick;
        }
        return this;
    }
    removeEventsByName(eventName) {
        this.events.forEach((event, index) => {
            if (event.name === eventName) {
                this.events.splice(index, 1);
            }
        });
        return this;
    }
    setTempo(bpm, tick = 0) {
        return this.addEvent(new TempoEvent({ bpm, tick }));
    }
    setTimeSignature(numerator, denominator, midiclockspertick, notespermidiclock) {
        return this.addEvent(new TimeSignatureEvent(numerator, denominator, midiclockspertick, notespermidiclock));
    }
    setTimeSignatureOnly(numerator, denominator) {
        return this.addEvent(new TimeSignatureEvent(numerator, denominator));
    }
    setKeySignature(sf, mi) {
        return this.addEvent(new KeySignatureEvent(sf, mi));
    }
    addText(text) {
        return this.addEvent(new TrackTextEvent({ text }));
    }
    addCopyright(text) {
        return this.addEvent(new CopyrightEvent({ text }));
    }
    addTrackName(text) {
        return this.addEvent(new TrackNameEvent({ text }));
    }
    addInstrumentName(text) {
        return this.addEvent(new InstrumentNameEvent({ text }));
    }
    addMarker(text) {
        return this.addEvent(new MarkerEvent({ text }));
    }
    addCuePoint(text) {
        return this.addEvent(new CuePointEvent({ text }));
    }
    addLyric(text) {
        return this.addEvent(new LyricEvent({ text }));
    }
    polyModeOn() {
        const event = new NoteOnEvent({ data: [0x00, 0xB0, 0x7E, 0x00] });
        return this.addEvent(event);
    }
    setPitchBend(bend) {
        return this.addEvent(new PitchBendEvent({ bend }));
    }
    controllerChange(number, value, channel, delta) {
        return this.addEvent(new ControllerChangeEvent({ controllerNumber: number, controllerValue: value, channel: channel, delta: delta }));
    }
}
const Constants = {
    VERSION: '3.1.1',
    HEADER_CHUNK_TYPE: [0x4d, 0x54, 0x68, 0x64],
    HEADER_CHUNK_LENGTH: [0x00, 0x00, 0x00, 0x06],
    HEADER_CHUNK_FORMAT0: [0x00, 0x00],
    HEADER_CHUNK_FORMAT1: [0x00, 0x01],
    HEADER_CHUNK_DIVISION: [0x00, 0x80],
    TRACK_CHUNK_TYPE: [0x4d, 0x54, 0x72, 0x6b],
    META_EVENT_ID: 0xFF,
    META_SMTPE_OFFSET: 0x54
};
var NoNote = { empty: true, name: "", pc: "", acc: "" };
var REGEX = /^([a-gA-G]?)(#{1,}|b{1,}|x{1,}|)(-?\d*)\s*(.*)$/;
var SEMI = [0, 2, 4, 5, 7, 9, 11];
var cache = new Map();
function tokenizeNote(str) {
    const m = REGEX.exec(str);
    return [m[1].toUpperCase(), m[2].replace(/x/g, "##"), m[3], m[4]];
}
function parse(noteName) {
    const tokens = tokenizeNote(noteName);
    if (tokens[0] === "" || tokens[3] !== "") {
        return NoNote;
    }
    const letter = tokens[0];
    const acc = tokens[1];
    const octStr = tokens[2];
    const step = (letter.charCodeAt(0) + 3) % 7;
    const alt = accToAlt(acc);
    const oct = octStr.length ? +octStr : void 0;
    const coord = encode({ step, alt, oct });
    const name = letter + acc + octStr;
    const pc = letter + acc;
    const chroma = (SEMI[step] + alt + 120) % 12;
    const height = oct === void 0 ? mod(SEMI[step] + alt, 12) - 12 * 99 : SEMI[step] + alt + 12 * (oct + 1);
    const midi = height >= 0 && height <= 127 ? height : null;
    const freq = oct === void 0 ? null : Math.pow(2, (height - 69) / 12) * 440;
    return {
        empty: false,
        acc,
        alt,
        chroma,
        coord,
        freq,
        height,
        letter,
        midi,
        name,
        oct,
        pc,
        step
    };
}
var mod = (n, m) => (n % m + m) % m;
var FIFTHS = [0, 2, 4, -1, 1, 3, 5];
var STEPS_TO_OCTS = FIFTHS.map((fifths) => Math.floor(fifths * 7 / 12));
function encode(pitch) {
    const { step, alt, oct, dir = 1 } = pitch;
    const f = FIFTHS[step] + 7 * alt;
    if (oct === void 0) {
        return [dir * f];
    }
    const o = oct - STEPS_TO_OCTS[step] - 4 * alt;
    return [dir * f, dir * o];
}
var fillStr = (s, n) => Array(Math.abs(n) + 1).join(s);
var altToAcc = (alt) => alt < 0 ? fillStr("b", -alt) : fillStr("#", alt);
var accToAlt = (acc) => acc[0] === "b" ? -acc.length : acc.length;
var stepToLetter = (step) => "CDEFGAB".charAt(step);
function pitchName(props) {
    const { step, alt, oct } = props;
    const letter = stepToLetter(step);
    if (!letter) {
        return "";
    }
    const pc = letter + altToAcc(alt);
    return oct || oct === 0 ? pc + oct : pc;
}
function note(src) {
    const stringSrc = JSON.stringify(src);
    const cached = cache.get(stringSrc);
    if (cached) {
        return cached;
    }
    const value = typeof src === "string" ? parse(src) : isPitch(src) ? note(pitchName(src)) : isNamed(src) ? note(src.name) : NoNote;
    cache.set(stringSrc, value);
    return value;
}
function isNamed(src) {
    return src !== null && typeof src === "object" && typeof src.name === "string" ? true : false;
}
function isPitch(pitch) {
    return pitch !== null && typeof pitch === "object" && typeof pitch.step === "number" && typeof pitch.alt === "number" ? true : false;
}
function isMidi(arg) {
    return +arg >= 0 && +arg <= 127;
}
function toMidi(pnote) {
    if (isMidi(pnote)) {
        return +pnote;
    }
    const n = note(pnote);
    return n.empty ? null : n.midi;
}
class Utils {
    static version() {
        return Constants.VERSION;
    }
    static stringToBytes(string) {
        return string.split('').map(char => char.charCodeAt(0));
    }
    static isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
    static getPitch(pitch, middleC = 'C4') {
        return 60 - toMidi(middleC) + toMidi(pitch);
    }
    static numberToVariableLength(ticks) {
        ticks = Math.round(ticks);
        let buffer = ticks & 0x7F;
        while (ticks = ticks >> 7) {
            buffer <<= 8;
            buffer |= ((ticks & 0x7F) | 0x80);
        }
        const bList = [];
        while (true) {
            bList.push(buffer & 0xff);
            if (buffer & 0x80)
                buffer >>= 8;
            else {
                break;
            }
        }
        return bList;
    }
    static stringByteCount(s) {
        return encodeURI(s).split(/%..|./).length - 1;
    }
    static numberFromBytes(bytes) {
        let hex = '';
        let stringResult;
        bytes.forEach((byte) => {
            stringResult = byte.toString(16);
            if (stringResult.length == 1)
                stringResult = "0" + stringResult;
            hex += stringResult;
        });
        return parseInt(hex, 16);
    }
    static numberToBytes(number, bytesNeeded) {
        bytesNeeded = bytesNeeded || 1;
        let hexString = number.toString(16);
        if (hexString.length & 1) {
            hexString = '0' + hexString;
        }
        const hexArray = hexString.match(/.{2}/g);
        const intArray = hexArray.map(item => parseInt(item, 16));
        if (intArray.length < bytesNeeded) {
            while (bytesNeeded - intArray.length > 0) {
                intArray.unshift(0);
            }
        }
        return intArray;
    }
    static toArray(value) {
        if (Array.isArray(value))
            return value;
        return [value];
    }
    static convertVelocity(velocity) {
        velocity = velocity > 100 ? 100 : velocity;
        return Math.round(velocity / 100 * 127);
    }
    static getTickDuration(duration) {
        if (Array.isArray(duration)) {
            return duration.map((value) => {
                return Utils.getTickDuration(value);
            }).reduce((a, b) => {
                return a + b;
            }, 0);
        }
        duration = duration.toString();
        if (duration.toLowerCase().charAt(0) === 't') {
            const ticks = parseInt(duration.substring(1));
            if (isNaN(ticks) || ticks < 0) {
                throw new Error(duration + ' is not a valid duration.');
            }
            return ticks;
        }
        const quarterTicks = Utils.numberFromBytes(Constants.HEADER_CHUNK_DIVISION);
        const tickDuration = quarterTicks * Utils.getDurationMultiplier(duration);
        return Utils.getRoundedIfClose(tickDuration);
    }
    static getRoundedIfClose(tick) {
        const roundedTick = Math.round(tick);
        return Math.abs(roundedTick - tick) < 0.000001 ? roundedTick : tick;
    }
    static getPrecisionLoss(tick) {
        const roundedTick = Math.round(tick);
        return roundedTick - tick;
    }
    static getDurationMultiplier(duration) {
        if (duration === '0')
            return 0;
        const match = duration.match(/^(?<dotted>d+)?(?<base>\d+)(?:t(?<tuplet>\d*))?/);
        if (match) {
            const base = Number(match.groups.base);
            const isValidBase = base === 1 || ((base & (base - 1)) === 0);
            if (isValidBase) {
                const ratio = base / 4;
                let durationInQuarters = 1 / ratio;
                let match_groups = match.groups;
                let dotted = match_groups["dotted"];
                let tuplet = match_groups["tuplet"];
                if (dotted) {
                    const thisManyDots = dotted.length;
                    const divisor = Math.pow(2, thisManyDots);
                    durationInQuarters = durationInQuarters + (durationInQuarters * ((divisor - 1) / divisor));
                }
                if (typeof tuplet === 'string') {
                    const fitInto = durationInQuarters * 2;
                    const thisManyNotes = Number(tuplet || '3');
                    durationInQuarters = fitInto / thisManyNotes;
                }
                return durationInQuarters;
            }
        }
        throw new Error(duration + ' is not a valid duration.');
    }
}
class Writer {
    constructor(tracks, options = {}) {
        this.tracks = Utils.toArray(tracks);
        this.options = options;
    }
    buildData() {
        const data = [];
        data.push(new MHeader(this.tracks.length));
        this.tracks.forEach((track) => {
            data.push(track.buildData(this.options));
        });
        return data;
    }
    buildFile() {
        let build = [];
        this.buildData().forEach((d) => build = build.concat(d.type, d.size, d.data));
        return new Uint8Array(build);
    }
    base64() {
        if (typeof btoa === 'function') {
            let binary = '';
            const bytes = this.buildFile();
            const len = bytes.byteLength;
            for (let i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return btoa(binary);
        }
        return Buffer.from(this.buildFile()).toString('base64');
    }
    dataUri() {
        return 'data:audio/midi;base64,' + this.base64();
    }
    setOption(key, value) {
        this.options[key] = value;
        return this;
    }
    stdout() {
        return process.stdout.write(Buffer.from(this.buildFile()));
    }
}
class RPPWriter {
    constructor() {
        this.crlf = '\r\n';
    }
    composeReaperProject(zvoogProject) {
        let body = '';
        body = body + '<REAPER_PROJECT 0.1 "7.83/win64" ' + Date.now() + ' 0';
        body = body + this.crlf + `  <NOTES 0 2
  >
  RIPPLE 0 0
  GROUPOVERRIDE 0 0 0 0
  AUTOXFADE 129
  ENVATTACH 3
  POOLEDENVATTACH 0
  TCPUIFLAGS 0
  MIXERUIFLAGS 11 48 0
  ENVFADESZ10 40
  PEAKGAIN 1
  FEEDBACK 0
  PANLAW 1
  PROJOFFS 0 0 0
  MAXPROJLEN 0 0
  GRID 3199 8 1 8 1 0 0 0
  TIMEMODE 1 5 -1 30 0 0 -1 0
  VIDEO_CONFIG 0 0 65792
  PANMODE 3
  PANLAWFLAGS 3
  CURSOR 8.5
  ZOOM 100 0 0
  VZOOMEX 6 0
  USE_REC_CFG 0
  RECMODE 1
  SMPTESYNC 0 30 100 40 1000 300 0 0 1 0 0
  LOOP 1
  LOOPGRAN 0 4
  RECORD_PATH "Media" ""
  <RECORD_CFG
    ZXZhdxgAAQ==
  >
  <APPLYFX_CFG
  >
  RENDER_FILE ""
  RENDER_PATTERN ""
  RENDER_FMT 0 2 0
  RENDER_1X 0 0
  RENDER_RANGE 1 0 0 0 1000
  RENDER_RESAMPLE 3 0 1
  RENDER_ADDTOPROJ 0
  RENDER_STEMS 0
  RENDER_DITHER 0
  RENDER_TRIM 0.000001 0.000001 0 0
  TIMELOCKMODE 1
  TEMPOENVLOCKMODE 1
  ITEMMIX 1
  DEFPITCHMODE 589824 0
  TAKELANE 1
  SAMPLERATE 44100 0 0
  <RENDER_CFG
    ZXZhdxgAAQ==
  >
  LOCK 1
  <METRONOME 6 2
    VOL 0.25 0.125
    BEATLEN 4
    FREQ 1760 880 1
    SAMPLES "" "" "" ""
    SPLIGNORE 0 0
    SPLDEF 2 660 "" 0 ""
    SPLDEF 3 440 "" 0 ""
    PATTERN 0 169
    PATTERNSTR ABBB
    MULT 1
  >
  GLOBAL_AUTO -1
  TEMPO 120 4 4 0
  PLAYRATE 1 0 0.25 4
  SELECTION 0 0
  SELECTION2 0 0
  MASTERAUTOMODE 0
  MASTERTRACKHEIGHT 0 0
  MASTERPEAKCOL 16576
  MASTERMUTESOLO 0
  MASTERTRACKVIEW 0 0.6667 0.5 0.5 0 0 0 0 0 0 0 0 0 0 1
  MASTERHWOUT 0 0 1 0 0 0 0 -1
  MASTER_NCH 2 2
  MASTER_VOLUME 1 0 -1 -1 1
  MASTER_PANMODE 3
  MASTER_PANLAWFLAGS 3
  MASTER_FX 1
  MASTER_TRACKID {6FCA227D-6A90-41E7-83EA-45510A18B3B7}
  MASTER_SEL 0
  <MASTERPLAYSPEEDENV
    EGUID {EE6A31E0-E64D-9C58-44E2-D382C813B154}
    ACT 0 -1
    VIS 0 1 1
    LANEHEIGHT 0 0
    ARM 0
    DEFSHAPE 0 -1 -1
  >
  <TEMPOENVEX
    EGUID {845912B6-402A-2FA6-975F-2A7D1BC3460B}
    ACT 0 -1
    VIS 1 0 1
    LANEHEIGHT 0 0
    ARM 0
    DEFSHAPE 1 -1 -1
  >
  RULERHEIGHT 86 86
  RULERLANE 1 4 "" 0 -1 0
  RULERLANE 2 8 "" 0 -1 0
  <PROJBAY
  >
  <TRACK {E8FAFD0F-FFE1-DB44-5CAE-8AC7DAC5992D}
    NAME testinsrtrynebt
    PEAKCOL 16576
    BEAT -1
    AUTOMODE 0
    PANLAWFLAGS 3
    VOLPAN 1 0 -1 -1 1
    MUTESOLO 0 0 0
    IPHASE 0
    PLAYOFFS 0 1
    ISBUS 0 0
    BUSCOMP 0 0 0 0 0
    SHOWINMIX 1 0.6667 0.5 1 0.5 0 0 0 0
    FIXEDLANES 9 0 0 0 0
    LANEREC -1 -1 -1 0
    SEL 0
    REC 0 0 1 0 0 0 0 0
    VU 64
    TRACKHEIGHT 120 0 0 0 0 0 0
    INQ 0 0 0 0.5 100 0 0 100
    NCHAN 2
    FX 1
    TRACKID {E8FAFD0F-FFE1-DB44-5CAE-8AC7DAC5992D}
    PERF 0
    MIDIOUT -1 -1
    MAINSEND 1 0
    <FXCHAIN
      WNDRECT 212 99 1227 753
      SHOW 0
      LASTSEL 0
      DOCKED 0
      BYPASS 0 0 0
      <JS chmaha-inst/MajorGeneralMIDI.jsfx ""
        80 1 2 3 4 5 6 7 8 128 10 11 12 13 19 15 440 5 0 2 84.5 0 1 30 39 100 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 100 100 100 100 100 100 100 100 100 100 100 100 100 100 100 100 64 64 64 64 "" 64 64 64 64 64 64 64 64 64 64 64 64 64
      >
      MULTIFXLINK 0
      FLOATPOS 0 0 0 0
      FXID {9215941B-69D3-42ED-8EA6-002B8A507461}
      WAK 0 0
    >
    <ITEM
      POSITION 0
      SNAPOFFS 0
      LENGTH 4
      LOOP 1
      ALLTAKES 0
      FADEIN 1 0 0 1 0 0 0 1 0 0 1 0 0
      FADEOUT 1 0 0 1 0 0 0 1 0 0 1 0 0
      MUTE 0 0
      SEL 0
      IGUID {1D84EA37-7518-49C9-12C5-FCB48F17FFDD}
      IID 1
      NAME 01-MIDI
      VOLPAN 1 0 1 -1
      SOFFS 0 0
      PLAYRATE 1 1 0 -1 0 0.0025
      CHANMODE 0
      GUID {4B3574FF-F14F-7D38-9484-F3538F84A12F}
      <SOURCE MIDI
        HASDATA 1 960 QN
        CCINTERP 32
        POOLEDEVTS {B198B953-C8B9-A3B1-4128-393FEC14D712}
        e 0 90 40 60
        E 360 e0 2e 42
        E 120 e0 22 4a
        E 120 e0 15 52
        E 120 e0 08 5a
        E 120 e0 6f 69
        E 120 e0 6f 69
        E 120 e0 18 70
        E 120 e0 77 74
        E 120 e0 55 79
        E 0 90 3d 60
        E 120 e0 6a 7c
        E 120 e0 7f 7f
        E 600 90 38 60
        E 120 80 3d 00
        e 720 80 40 00
        E 600 80 38 00
        E 240 b0 7b 00
        CCINTERP 32
        CHASE_CC_TAKEOFFS 1
        GUID {4B571F06-0FF5-2A92-BB3E-AF2988C94DB3}
        IGNTEMPO 0 120 4 4
        SRCCOLOR 0
        EVTFILTER 0 -1 -1 -1 -1 0 0 0 0 -1 -1 -1 -1 0 -1 0 -1 -1
        VELLANE 128 100 0 0 1
        CFGEDITVIEW -373.342898 0.104879 45 12 0 0 0 0 0 0.5
        KEYSNAP 0
        TRACKSEL -252
        CFGEDIT 1 1 0 1 0 0 1 1 1 1 1 0.125 260 79 1503 964 0 0 0 0 0 0 0 0 0 0.5 0 0 1 64
      >
    >
    <ITEM
      POSITION 4
      SNAPOFFS 0
      LENGTH 4
      LOOP 1
      ALLTAKES 0
      FADEIN 1 0 0 1 0 0 0 1 0 0 1 0 0
      FADEOUT 1 0 0 1 0 0 0 1 0 0 1 0 0
      MUTE 0 0
      SEL 0
      IGUID {EB47B7BC-A3F6-445E-B038-385E5434900B}
      IID 3
      NAME 01-testinsrtrynebt-MIDI
      VOLPAN 1 0 1 -1
      SOFFS 1.5 3
      PLAYRATE 1 1 0 -1 0 0.0025
      CHANMODE 0
      GUID {612E7EE9-93E3-4CEE-BC61-EF72030B71FB}
      <SOURCE MIDI
        HASDATA 1 960 QN
        CCINTERP 32
        POOLEDEVTS {99E7E6FA-6F38-4BCB-8B01-BB522E5D5177}
        E 600 90 36 60
        E 240 90 51 60
        E 0 90 48 60
        E 480 80 36 00
        E 120 80 48 00
        e 1200 90 42 60
        e 240 80 42 00
        E 720 90 4b 60
        E 240 80 51 00
        E 0 80 4b 00
        E 0 b0 7b 00
        CCINTERP 32
        CHASE_CC_TAKEOFFS 1
        GUID {B0ECF4E2-C222-4A65-BFBC-91A9FC2DFE5D}
        IGNTEMPO 0 120 4 4
        SRCCOLOR 2
        EVTFILTER 0 -1 -1 -1 -1 0 0 0 0 -1 -1 -1 -1 0 -1 0 -1 -1
        VELLANE 128 100 0 0 1
        CFGEDITVIEW -4786.468216 0.104879 45 12 0 0 0 0 0 0.5
        KEYSNAP 0
        TRACKSEL -252
        CFGEDIT 1 1 0 1 0 0 1 1 1 1 1 0.125 260 79 1503 964 0 0 0 0 0 0 0 0 0 0.5 0 0 1 64
      >
    >
  >`;
        body = body + this.crlf + this.createDrumTrack(zvoogProject);
        body = body + this.crlf + this.createCommentTrack(zvoogProject.title);
        body = body + this.crlf + '>';
        return body;
    }
    createCommentTrack(projectTitle) {
        let commentTrackGuid = crypto.randomUUID();
        let commentBody = `  <TRACK {` + commentTrackGuid + `}
    NAME DAW1024
    PEAKCOL 16576
    BEAT -1
    AUTOMODE 0
    PANLAWFLAGS 3
    VOLPAN 1 0 -1 -1 1
    MUTESOLO 0 0 0
    IPHASE 0
    PLAYOFFS 0 1
    ISBUS 0 0
    BUSCOMP 0 0 0 0 0
    SHOWINMIX 1 0.6667 0.5 1 0.5 0 0 0 0
    FIXEDLANES 9 0 0 0 0
    SEL 1
    REC 0 0 1 0 0 0 0 0
    VU 64
    TRACKHEIGHT 0 0 0 0 0 0 0
    INQ 0 0 0 0.5 100 0 0 100
    NCHAN 2
    FX 1
    TRACKID {` + commentTrackGuid + `}
    PERF 0
    MIDIOUT -1 -1
    MAINSEND 1 0
    <ITEM
      POSITION 0
      SNAPOFFS 0
      LENGTH 8
      LOOP 1
      ALLTAKES 0
      FADEIN 1 0 0 1 0 0 0 1 0 0 1 0 0
      FADEOUT 1 0 0 1 0 0 0 1 0 0 1 0 0
      MUTE 0 0
      SEL 1
      IGUID {` + crypto.randomUUID() + `}
      IID 6
      <NOTES`;
        commentBody = commentBody + this.crlf + '        |https://daw1024.com';
        commentBody = commentBody + this.crlf + '        |' + projectTitle.replace('\n', ' ').replace('\r', ' ').replace('\'', ' ').replace('"', ' ').replace('\t', ' ');
        commentBody = commentBody + this.crlf + `      >
      IMGRESOURCEFLAGS 8
      NOTESWND 0 43 499 440
    >
  >`;
        return commentBody;
    }
    createDrumTrack(project) {
        let drumTrackGuid = crypto.randomUUID();
        let drumBody = `  <TRACK {` + drumTrackGuid + `}
    NAME Drums
    PEAKCOL 16576
    BEAT -1
    AUTOMODE 0
    PANLAWFLAGS 3
    VOLPAN 1 0 -1 -1 1
    MUTESOLO 0 0 0
    IPHASE 0
    PLAYOFFS 0 1
    ISBUS 0 0
    BUSCOMP 0 0 0 0 0
    SHOWINMIX 1 0.6667 0.5 1 0.5 0 0 0 0
    FIXEDLANES 9 0 0 0 0
    LANEREC -1 -1 -1 0
    SEL 0
    REC 0 0 1 0 0 0 0 0
    VU 64
    TRACKHEIGHT 0 0 0 0 0 0 0
    INQ 0 0 0 0.5 100 0 0 100
    NCHAN 2
    FX 1
    TRACKID {` + drumTrackGuid + `}
    PERF 0
    MIDIOUT -1 -1
    MAINSEND 1 0
    <FXCHAIN
      WNDRECT 243 219 1227 753
      SHOW 0
      LASTSEL 0
      DOCKED 0
      BYPASS 0 0 0
      <JS chmaha-inst/MajorGeneralMIDI.jsfx ""
        128 1 2 3 4 5 6 7 8 128 10 11 12 13 14 15 440 5 0 2 84.5 0 1 30 39 100 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 100 100 100 100 100 100 100 100 100 100 100 100 100 100 100 100 64 64 64 64 "" 64 64 64 64 64 64 64 64 64 64 64 64 64
      >
      MULTIFXLINK 0
      FLOATPOS 0 0 0 0
      FXID {C734D5D9-69FE-4DC8-9A17-BEB617E1186D}
      WAK 0 0
    >
    <ITEM
      POSITION 0
      SNAPOFFS 0
      LENGTH 2
      LOOP 1
      ALLTAKES 0
      FADEIN 1 0 0 1 0 0 0 1 0 0 1 0 0
      FADEOUT 1 0 0 1 0 0 0 1 0 0 1 0 0
      MUTE 0 0
      SEL 0
      IGUID {20FB351E-ADDF-400E-956C-0C08AC44D384}
      IID 4
      NAME 02-rumstest-MIDI
      VOLPAN 1 0 1 -1
      SOFFS 0 0
      PLAYRATE 1 1 0 -1 0 0.0025
      CHANMODE 0
      GUID {D444BCB9-7F34-4030-807A-0DFCB0CE833B}
      <SOURCE MIDI
        HASDATA 1 960 QN
        CCINTERP 32
        POOLEDEVTS {D5707424-DCA4-409B-A12A-2015E891DC0C}
        e 120 90 26 60
        E 240 90 19 60
        e 480 80 26 00
        E 0 90 33 60
        E 0 90 1e 60
        E 240 90 2e 60
        E 120 80 19 00
        E 240 80 33 00
        E 0 80 2e 00
        E 120 80 1e 00
        E 240 90 1e 60
        E 240 80 1e 00
        E 240 90 23 60
        E 240 80 23 00
        E 0 90 2f 60
        E 240 80 2f 00
        E 360 90 3e 60
        E 240 80 3e 00
        E 0 90 1d 60
        E 0 90 2d 60
        E 360 80 1d 00
        E 0 80 2d 00
        E 120 b0 7b 00
        CCINTERP 32
        CHASE_CC_TAKEOFFS 1
        GUID {A32784D0-48D1-4744-B811-8E189AA97159}
        IGNTEMPO 0 120 4 4
        SRCCOLOR 3
        EVTFILTER 0 -1 -1 -1 -1 0 1 0 0 -1 -1 -1 -1 0 -1 0 -1 -1
        VELLANE -1 100 0 0 1
        CFGEDITVIEW 0 0.188451 61 12 0 0 0 0 0 0.5
        KEYSNAP 0
        TRACKSEL -252
        CFGEDIT 1 1 0 1 0 0 1 1 1 1 1 0.125 260 79 1503 964 0 0 0 0 0 0 0 0 0 0.5 0 0 1 64
      >
    >
    <ITEM
      POSITION 2
      SNAPOFFS 0
      LENGTH 6
      LOOP 1
      ALLTAKES 0
      FADEIN 1 0 0 1 0 0 0 1 0 0 1 0 0
      FADEOUT 1 0 0 1 0 0 0 1 0 0 1 0 0
      MUTE 0 0
      SEL 0
      IGUID {13C083A8-179A-ADE8-CD3D-C43CF138D729}
      IID 2
      NAME 02-rumstest-MIDI
      VOLPAN 1 0 1 -1
      SOFFS 0 0
      PLAYRATE 1 1 0 -1 0 0.0025
      CHANMODE 0
      GUID {86DA1699-BB66-987E-51E6-B2B0E9550914}
      <SOURCE MIDI
        HASDATA 1 960 QN
        CCINTERP 32
        POOLEDEVTS {C7BD63EB-4889-1372-D115-7D775EAF0FE2}
        E 0 90 1a 60
        E 120 90 1d 60
        E 120 80 1d 00
        E 120 90 23 60
        E 120 90 1d 60
        E 120 80 1a 00
        E 0 80 1d 00
        E 0 90 21 60
        E 120 80 21 00
        E 240 80 23 00
        E 360 90 35 60
        E 120 90 18 60
        E 120 80 18 00
        E 120 80 35 00
        E 360 90 39 60
        E 120 80 39 00
        e 0 90 40 60
        E 120 90 28 60
        E 120 80 28 00
        E 240 90 32 60
        E 120 80 32 00
        e 840 80 40 00
        E 240 b0 7b 00
        CCINTERP 32
        CHASE_CC_TAKEOFFS 1
        GUID {DF32DB9F-316A-543C-9FA7-B160F4A94992}
        IGNTEMPO 0 120 4 4
        SRCCOLOR 1
        EVTFILTER 0 -1 -1 -1 -1 0 0 0 0 -1 -1 -1 -1 0 -1 0 -1 -1
        VELLANE -1 100 0 0 1
        CFGEDITVIEW 0 0.188451 61 12 0 0 0 0 0 0.5
        KEYSNAP 0
        TRACKSEL 0
        CFGEDIT 1 1 0 1 0 0 1 1 1 1 1 0.125 260 79 1503 964 0 0 0 0 0 0 0 0 0 0.5 0 0 1 64
      >
    >
  >`;
        return drumBody;
    }
}
console.log('newMIDIx v1.0.1');
class MiniumMIDIx extends MZXBX_Plugin_UI {
    constructor() {
        super(true);
    }
    startExportReaperRPP() {
        if (this.currentProject) {
            let writer = new RPPWriter();
            let txt = writer.composeReaperProject(this.currentProject);
            this.download(txt, this.safeProjectName() + '.rpp', 'text/plain');
        }
    }
    startExportJSON() {
        this.exportLocalfile();
    }
    exportLocalfile() {
        if (this.currentProject) {
            this.download(JSON.stringify(this.currentProject), this.safeProjectName(), 'application/json');
        }
    }
    safeProjectName() {
        if (this.currentProject) {
            let text = this.currentProject.title;
            let cleanText = text.replace(/[^a-zA-Z0-9]/g, "");
            return '' + cleanText + '_DAW1024';
        }
        else {
            return 'DAW1024export';
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
            a.download = this.safeProjectName();
            document.body.appendChild(a);
            a.click();
        }
    }
    startExportMIDI() {
        console.log('startExportMIDI', this.currentProject);
        let tracks = [];
        let track0 = new Track();
        track0.addEvent(new TrackNameEvent({ text: 'Drums' }));
        track0.addInstrumentName('Drums');
        tracks[0] = track0;
        track0.setTimeSignatureOnly(4, 4);
        track0.setTempo(120);
        let drumEvents = [];
        let drumdur = 0.5;
        for (let ii = 0; ii < this.currentProject.percussions.length; ii++) {
            let barstart = 0;
            let perctrack = this.currentProject.percussions[ii];
            for (let mm = 0; mm < this.currentProject.timeline.length; mm++) {
                let bar = this.currentProject.timeline[mm];
                let drumeasure = perctrack.measures[mm];
                for (let dd = 0; dd < drumeasure.skips.length; dd++) {
                    let sk = drumeasure.skips[dd];
                    let pi = perctrack.sampler.hint35_81;
                    if (pi < 35 || pi > 81)
                        pi = 81;
                    drumEvents.push({ pitch: pi, start: barstart + MMUtil().set(sk).duration(bar.tempo), on: true });
                    drumEvents.push({ pitch: pi, start: barstart + MMUtil().set(sk).duration(bar.tempo) + drumdur, on: false });
                }
                barstart = barstart + MMUtil().set(bar.metre).duration(bar.tempo);
            }
        }
        drumEvents.sort(function (a, b) {
            return a.start - b.start;
        });
        let preStart = 0;
        let tickRatio = 128 * 2;
        for (var ii = 0; ii < drumEvents.length; ii++) {
            var wait = drumEvents[ii].start - preStart;
            if (drumEvents[ii].on) {
                let on = new NoteOnEventOnOff2(9, Math.round(wait * tickRatio), drumEvents[ii].pitch, 98, true);
                track0.addEvent(on);
            }
            else {
                let off = new NoteOnEventOnOff2(9, Math.round(wait * tickRatio), drumEvents[ii].pitch, 0, false);
                track0.addEvent(off);
            }
            preStart = preStart + wait;
        }
        for (let tt = 0; tt < this.currentProject.tracks.length && tt < 15; tt++) {
            let channn = tt;
            if (channn > 8)
                channn = tt + 1;
            let trckEvents = [];
            let barstart = 0;
            let protrack = this.currentProject.tracks[tt];
            let newmitrack = new Track();
            newmitrack.setTimeSignatureOnly(4, 4);
            newmitrack.setTempo(120);
            tracks.push(newmitrack);
            let mins = protrack.performer.hint1_128;
            if (mins > 0 && mins < 129) {
                mins = mins - 1;
            }
            else {
                mins = 0;
            }
            newmitrack.addEvent(new ProgramChangeEvent({ instrument: mins, channel: channn }));
            newmitrack.addInstrumentName(protrack.title);
            newmitrack.addEvent(new TrackNameEvent({ text: protrack.title }));
            for (let mm = 0; mm < this.currentProject.timeline.length; mm++) {
                let bar = this.currentProject.timeline[mm];
                let inmeasure = protrack.measures[mm];
                for (let cc = 0; cc < inmeasure.chords.length; cc++) {
                    let chord = inmeasure.chords[cc];
                    let sk = chord.skip;
                    let chorddur = 0;
                    for (let sl = 0; sl < chord.slides.length; sl++) {
                        chorddur = chorddur + MMUtil().set(chord.slides[sl].duration).duration(bar.tempo);
                    }
                    for (let nn = 0; nn < chord.pitches.length; nn++) {
                        let pi = chord.pitches[nn];
                        trckEvents.push({ chordpitch: pi, start: barstart + MMUtil().set(sk).duration(bar.tempo), on: true });
                        trckEvents.push({ chordpitch: pi, start: barstart + MMUtil().set(sk).duration(bar.tempo) + chorddur, on: false });
                    }
                }
                barstart = barstart + MMUtil().set(bar.metre).duration(bar.tempo);
            }
            trckEvents.sort(function (a, b) {
                return a.start - b.start;
            });
            let preStart = 0;
            for (var ii = 0; ii < trckEvents.length; ii++) {
                var wait = trckEvents[ii].start - preStart;
                if (trckEvents[ii].on) {
                    let on = new NoteOnEventOnOff2(channn, Math.round(wait * tickRatio), trckEvents[ii].chordpitch, 97, true);
                    newmitrack.addEvent(on);
                }
                else {
                    let off = new NoteOnEventOnOff2(channn, Math.round(wait * tickRatio), trckEvents[ii].chordpitch, 0, false);
                    newmitrack.addEvent(off);
                }
                preStart = preStart + wait;
            }
        }
        var write = new Writer(tracks);
        let a = document.createElement("a");
        a.href = write.dataUri();
        a.download = this.safeProjectName();
        document.body.appendChild(a);
        a.click();
    }
    onMessageFromHost(message) {
        this.currentProject = message.hostData;
        console.log('onMessageFromHost', message);
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
    setText(id, txt) {
        let oo = document.getElementById(id);
        if (oo) {
            oo.innerHTML = txt;
        }
    }
    onLanguaga(enruzhId) {
        let exportName = '';
        if (this.currentProject) {
            let text = this.currentProject.title;
            exportName = text.replace(/[^a-zA-Z0-9]/g, "");
        }
        if (enruzhId == 'zh') {
            this.setText('plugintitle', '导出 ' + exportName);
            this.setText('btnsendmidi', '*.mid MIDI');
            this.setText('btnsendjson', '*.json DAW1024');
            this.setText('btnsendrpp', '*.rpp Reaper');
            this.setText('btnsendimage', '*.png image');
        }
        else {
            if (enruzhId == 'ru') {
                this.setText('plugintitle', 'Экспорт ' + exportName);
                this.setText('btnsendmidi', '*.mid MIDI');
                this.setText('btnsendjson', '*.json DAW1024');
                this.setText('btnsendrpp', '*.rpp Reaper');
                this.setText('btnsendimage', '*.png image');
            }
            else {
                this.setText('plugintitle', 'Export ' + exportName);
                this.setText('btnsendmidi', '*.mid MIDI');
                this.setText('btnsendjson', '*.json DAW1024');
                this.setText('btnsendrpp', '*.rpp Reaper');
                this.setText('btnsendimage', '*.png image');
            }
        }
    }
}
