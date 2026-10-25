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
    composeReaperProject222(zvoogProject) {
        let unixTimestamp = Math.floor(new Date().getTime() / 1000);
        let rpp = new TreeValue('REAPER_PROJECT', '', []).advance('_', ['0.1', '"7.46/linux-x86_64"', '' + unixTimestamp]);
        rpp.first('_SAMPLERATE').advance('_', ['48000', '0', '0']);
        rpp.first('_TIMEMODE').advance('_', ['0', '5', '0', '30', '0', '-1', '0', '0']);
        rpp.first('_MASTERMUTESOLO').advance('_', ['0']);
        rpp.first('_MASTERTRACKVIEW').advance('_', ['0', '0.5', '0.5', '0.5', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '1']);
        rpp.first('_MASTER_VOLUME').advance('_', ['1', '0', '-1', '-1', '1']);
        rpp.first('_RIPPLE').advance('_', ['0']);
        rpp.first('_GROUPOVERRIDE').advance('_', ['0', '0', '0']);
        rpp.first('RECORD_CFG');
        rpp.first('METRONOME').advance('_', ['6', '2']);
        rpp.first('METRONOME').first('_VOL').advance('_', ['0.25', '0.125']);
        rpp.first('METRONOME').first('_FREQ').advance('_', ['800', '1600', '1']);
        rpp.first('METRONOME').first('_BEATLEN').advance('_', ['4']);
        rpp.first('METRONOME').first('_SAMPLES').advance('_', ['""', '""']);
        rpp.first('METRONOME').first('_PATTERN').advance('_', ['2863311530', '2863311529']);
        return this.rpp2text('', rpp);
    }
    rpp2text(pad, tree) {
        let crlf = '\r\n';
        let rpptxt = '';
        let rline = pad + '<' + tree.name;
        for (let ii = 0; ii < tree.content.length; ii++) {
            if (tree.content[ii].name == '_') {
                rline = rline + ' ' + tree.content[ii].value;
            }
        }
        rpptxt = rpptxt + rline;
        for (let kk = 0; kk < tree.content.length; kk++) {
            let subtree = tree.content[kk];
            if (subtree.name == '_') {
            }
            else {
                if (subtree.name.startsWith('_')) {
                    let subline = pad + '  ' + subtree.name.substring(1);
                    for (let nn = 0; nn < subtree.content.length; nn++) {
                        if (subtree.content[nn].name == '_') {
                            subline = subline + ' ' + subtree.content[nn].value;
                        }
                    }
                    rpptxt = rpptxt + crlf + subline;
                }
                else {
                    rpptxt = rpptxt + crlf + this.rpp2text(pad + '  ', subtree);
                }
            }
        }
        rpptxt = rpptxt + crlf + pad + '>';
        return rpptxt;
    }
    composeReaperProject(zvoogProject) {
        let body = '';
        body = body + `<REAPER_PROJECT 0.1 "7.46/linux-x86_64" 1791702502`;
        body = body + '\r\n' + `  <NOTES 0 2
  >
  RIPPLE 0 0
  GROUPOVERRIDE 0 0 0
  AUTOXFADE 129
  ENVATTACH 3
  POOLEDENVATTACH 0
  TCPUIFLAGS 0
  MIXERUIFLAGS 11 48
  ENVFADESZ10 40
  PEAKGAIN 1
  FEEDBACK 0
  PANLAW 1
  PROJOFFS 0 0 0
  MAXPROJLEN 0 0
  GRID 3199 8 1 8 1 0 0 0
  TIMEMODE 1 5 -1 30 0 0 -1
  VIDEO_CONFIG 0 0 65792
  PANMODE 3
  PANLAWFLAGS 3
  CURSOR 2.125
  ZOOM 100 0 0
  VZOOMEX 6 0
  USE_REC_CFG 0
  RECMODE 1
  SMPTESYNC 0 30 100 40 1000 300 0 0 1 0 0
  LOOP 0
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
  RENDER_1X 0
  RENDER_RANGE 1 0 0 0 1000
  RENDER_RESAMPLE 3 0 1
  RENDER_ADDTOPROJ 0
  RENDER_STEMS 0
  RENDER_DITHER 0
  RENDER_TRIM 0 0 0 0
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
    ACT 1 -1
    VIS 1 0 1
    LANEHEIGHT 0 0
    ARM 0
    DEFSHAPE 1 -1 -1
  >
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
    SEL 0
    REC 0 0 1 0 0 0 0 0
    VU 64
    TRACKHEIGHT 0 0 0 0 0 0 0
    INQ 0 0 0 0.5 100 0 0 100
    NCHAN 2
    FX 1
    TRACKID {E8FAFD0F-FFE1-DB44-5CAE-8AC7DAC5992D}
    PERF 0
    MIDIOUT -1
    MAINSEND 1 0
    <FXCHAIN
      WNDRECT 32 94 2414 1455
      SHOW 0
      LASTSEL 0
      DOCKED 0
      BYPASS 0 0 0
      <VST "VST3i: simpleSF2 (simpleSoundbank)" simpleSF2.vst3 0 "" 1793455926{ABCDEF019182FAEB53424E4B5366706C} ""
        Nvflau5e7f4AAAAAAgAAAAEAAAAAAAAAAgAAAAAAAACvRwAAAQAAAP//EAA=
        n0cAAAEAAABWQzIhWkcAADw/eG1sIHZlcnNpb249IjEuMCIgZW5jb2Rpbmc9IlVURi04Ij8+IDxMb2dpY1NGMlBsYXllclN0YXRlIHNmMlBhdGg9Ii9ob21lL3Nzcy8u
        Y29uZmlnL3NpbXBsZVNvdW5kYmFuay9JbXBvcnRlZFNvdW5kRm9udHMvN2Y2YTM0OTZmNjgyNDJiNmE4ODlmNzMwYmRhYzYyNzRfRmx1aWRSM19HTS9GbHVpZFIzX0dN
        LnNmMiIgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjQyIiBzZWxlY3RlZExpYnJhcnlJbmRleD0iMCIgY3VzdG9tU3RvcmFnZVBhdGg9IiIgYWN0aXZl
        Q3VzdG9tU291bmRQcmVzZXQ9IiI+PFBBUkFNIGlkPSJhbXBBdHRhY2tTZWNvbmRzIiB2YWx1ZT0iMC4wIi8+PFBBUkFNIGlkPSJhbXBEZWNheVNlY29uZHMiIHZhbHVl
        PSIwLjAiLz48UEFSQU0gaWQ9ImFtcFJlbGVhc2VTZWNvbmRzIiB2YWx1ZT0iMC4wIi8+PFBBUkFNIGlkPSJhbXBTdXN0YWluIiB2YWx1ZT0iMS4wIi8+PFBBUkFNIGlk
        PSJmaWx0ZXJBdHRhY2tTZWNvbmRzIiB2YWx1ZT0iMC4wIi8+PFBBUkFNIGlkPSJmaWx0ZXJDdXRvZmZIeiIgdmFsdWU9IjIwMDAwLjAiLz48UEFSQU0gaWQ9ImZpbHRl
        ckRlY2F5U2Vjb25kcyIgdmFsdWU9IjAuMCIvPjxQQVJBTSBpZD0iZmlsdGVyRW52ZWxvcGVBbW91bnQiIHZhbHVlPSIwLjAiLz48UEFSQU0gaWQ9ImZpbHRlclJlbGVh
        c2VTZWNvbmRzIiB2YWx1ZT0iMC4wIi8+PFBBUkFNIGlkPSJmaWx0ZXJSZXNvbmFuY2UiIHZhbHVlPSIwLjcwOTk5OTk3ODU0MjMyNzkiLz48UEFSQU0gaWQ9ImZpbHRl
        clN1c3RhaW4iIHZhbHVlPSIxLjAiLz48UEFSQU0gaWQ9ImZpbHRlclR5cGUiIHZhbHVlPSI0LjAiLz48UEFSQU0gaWQ9ImdsaWRlTW9kZSIgdmFsdWU9IjAuMCIvPjxQ
        QVJBTSBpZD0iZ2xpc3NhbmRvVGltZU1zIiB2YWx1ZT0iMC4wIi8+PFBBUkFNIGlkPSJtYXN0ZXJWb2x1bWUiIHZhbHVlPSIwLjg1MDAwMDAyMzg0MTg1NzkiLz48UEFS
        QU0gaWQ9InBpdGNoQmVuZFJhbmdlIiB2YWx1ZT0iMi4wIi8+PFBBUkFNIGlkPSJwb2x5cGhvbnkiIHZhbHVlPSI2NC4wIi8+PFBBUkFNIGlkPSJzd2VlcE9mZnNldFNl
        bWl0b25lcyIgdmFsdWU9Ii0yLjAiLz48UEFSQU0gaWQ9InRyYW5zcG9zZSIgdmFsdWU9IjAuMCIvPjxJbXBvcnRlZExpYnJhcmllcz48SW1wb3J0ZWRMaWJyYXJ5IGlk
        ZW50aWZpZXI9IjJjYjY2MzZjMTNkNTRiYzFhZGMxMDYyMjNlNTM4YWYxIiBkaXNwbGF5TmFtZT0iRmx1aWRSM19HTSIgc3RvcmVkRmlsZVBhdGg9Ii9ob21lL3Nzcy8u
        Y29uZmlnL3NpbXBsZVNvdW5kYmFuay9JbXBvcnRlZFNvdW5kRm9udHMvN2Y2YTM0OTZmNjgyNDJiNmE4ODlmNzMwYmRhYzYyNzRfRmx1aWRSM19HTS9GbHVpZFIzX0dN
        LnNmMiIgaXNJbmNsdWRlZENvbnRlbnQ9IjAiPjxQcmVzZXRMaXN0PjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjAiIHByZXNldEluZGV4
        PSIwIiBwcmVzZXROYW1lPSJZYW1haGEgR3JhbmQgUGlhbm8iLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSIxIiBwcmVzZXRJbmRleD0i
        MSIgcHJlc2V0TmFtZT0iQnJpZ2h0IFlhbWFoYSBHcmFuZCIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjIiIHByZXNldEluZGV4PSIy
        IiBwcmVzZXROYW1lPSJFbGVjdHJpYyBQaWFubyIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjMiIHByZXNldEluZGV4PSIzIiBwcmVz
        ZXROYW1lPSJIb25reSBUb25rIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0iNCIgcHJlc2V0SW5kZXg9IjQiIHByZXNldE5hbWU9IlJo
        b2RlcyBFUCIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjUiIHByZXNldEluZGV4PSI1IiBwcmVzZXROYW1lPSJMZWdlbmQgRVAgMiIv
        PjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjYiIHByZXNldEluZGV4PSI2IiBwcmVzZXROYW1lPSJIYXJwc2ljaG9yZCIvPjxQcmVzZXQg
        c2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjciIHByZXNldEluZGV4PSI3IiBwcmVzZXROYW1lPSJDbGF2aW5ldCIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5r
        PSIwIiBzZWxlY3RlZFByb2dyYW09IjgiIHByZXNldEluZGV4PSI4IiBwcmVzZXROYW1lPSJDZWxlc3RhIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVk
        UHJvZ3JhbT0iOSIgcHJlc2V0SW5kZXg9IjkiIHByZXNldE5hbWU9Ikdsb2NrZW5zcGllbCIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09
        IjEwIiBwcmVzZXRJbmRleD0iMTAiIHByZXNldE5hbWU9Ik11c2ljIEJveCIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjExIiBwcmVz
        ZXRJbmRleD0iMTEiIHByZXNldE5hbWU9IlZpYnJhcGhvbmUiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSIxMiIgcHJlc2V0SW5kZXg9
        IjEyIiBwcmVzZXROYW1lPSJNYXJpbWJhIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0iMTMiIHByZXNldEluZGV4PSIxMyIgcHJlc2V0
        TmFtZT0iWHlsb3Bob25lIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0iMTQiIHByZXNldEluZGV4PSIxNCIgcHJlc2V0TmFtZT0iVHVi
        dWxhciBCZWxscyIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjE1IiBwcmVzZXRJbmRleD0iMTUiIHByZXNldE5hbWU9IkR1bGNpbWVy
        Ii8+PFByZXNldCBzZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0iMTYiIHByZXNldEluZGV4PSIxNiIgcHJlc2V0TmFtZT0iRHJhd2Jhck9yZ2FuIi8+PFBy
        ZXNldCBzZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0iMTciIHByZXNldEluZGV4PSIxNyIgcHJlc2V0TmFtZT0iUGVyY3Vzc2l2ZSBPcmdhbiIvPjxQcmVz
        ZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjE4IiBwcmVzZXRJbmRleD0iMTgiIHByZXNldE5hbWU9IlJvY2sgT3JnYW4iLz48UHJlc2V0IHNlbGVj
        dGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSIxOSIgcHJlc2V0SW5kZXg9IjE5IiBwcmVzZXROYW1lPSJDaHVyY2ggT3JnYW4iLz48UHJlc2V0IHNlbGVjdGVkQmFu
        az0iMCIgc2VsZWN0ZWRQcm9ncmFtPSIyMCIgcHJlc2V0SW5kZXg9IjIwIiBwcmVzZXROYW1lPSJSZWVkIE9yZ2FuIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjAiIHNl
        bGVjdGVkUHJvZ3JhbT0iMjEiIHByZXNldEluZGV4PSIyMSIgcHJlc2V0TmFtZT0iQWNjb3JkaWFuIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVkUHJv
        Z3JhbT0iMjIiIHByZXNldEluZGV4PSIyMiIgcHJlc2V0TmFtZT0iSGFybW9uaWNhIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0iMjMi
        IHByZXNldEluZGV4PSIyMyIgcHJlc2V0TmFtZT0iQmFuZG9uZW9uIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0iMjQiIHByZXNldElu
        ZGV4PSIyNCIgcHJlc2V0TmFtZT0iTnlsb24gU3RyaW5nIEd1aXRhciIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjI1IiBwcmVzZXRJ
        bmRleD0iMjUiIHByZXNldE5hbWU9IlN0ZWVsIFN0cmluZyBHdWl0YXIiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSIyNiIgcHJlc2V0
        SW5kZXg9IjI2IiBwcmVzZXROYW1lPSJKYXp6IEd1aXRhciIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjI3IiBwcmVzZXRJbmRleD0i
        MjciIHByZXNldE5hbWU9IkNsZWFuIEd1aXRhciIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjI4IiBwcmVzZXRJbmRleD0iMjgiIHBy
        ZXNldE5hbWU9IlBhbG0gTXV0ZWQgR3VpdGFyIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0iMjkiIHByZXNldEluZGV4PSIyOSIgcHJl
        c2V0TmFtZT0iT3ZlcmRyaXZlIEd1aXRhciIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjMwIiBwcmVzZXRJbmRleD0iMzAiIHByZXNl
        dE5hbWU9IkRpc3RvcnRpb24gR3VpdGFyIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0iMzEiIHByZXNldEluZGV4PSIzMSIgcHJlc2V0
        TmFtZT0iR3VpdGFyIEhhcm1vbmljcyIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjMyIiBwcmVzZXRJbmRleD0iMzIiIHByZXNldE5h
        bWU9IkFjb3VzdGljIEJhc3MiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSIzMyIgcHJlc2V0SW5kZXg9IjMzIiBwcmVzZXROYW1lPSJG
        aW5nZXJlZCBCYXNzIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0iMzQiIHByZXNldEluZGV4PSIzNCIgcHJlc2V0TmFtZT0iUGlja2Vk
        IEJhc3MiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSIzNSIgcHJlc2V0SW5kZXg9IjM1IiBwcmVzZXROYW1lPSJGcmV0bGVzcyBCYXNz
        Ii8+PFByZXNldCBzZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0iMzYiIHByZXNldEluZGV4PSIzNiIgcHJlc2V0TmFtZT0iU2xhcCBCYXNzIi8+PFByZXNl
        dCBzZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0iMzciIHByZXNldEluZGV4PSIzNyIgcHJlc2V0TmFtZT0iUG9wIEJhc3MiLz48UHJlc2V0IHNlbGVjdGVk
        QmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSIzOCIgcHJlc2V0SW5kZXg9IjM4IiBwcmVzZXROYW1lPSJTeW50aCBCYXNzIDEiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0i
        MCIgc2VsZWN0ZWRQcm9ncmFtPSIzOSIgcHJlc2V0SW5kZXg9IjM5IiBwcmVzZXROYW1lPSJTeW50aCBCYXNzIDIiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2Vs
        ZWN0ZWRQcm9ncmFtPSI0MCIgcHJlc2V0SW5kZXg9IjQwIiBwcmVzZXROYW1lPSJWaW9saW4iLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFt
        PSI0MSIgcHJlc2V0SW5kZXg9IjQxIiBwcmVzZXROYW1lPSJWaW9sYSIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjQyIiBwcmVzZXRJ
        bmRleD0iNDIiIHByZXNldE5hbWU9IkNlbGxvIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0iNDMiIHByZXNldEluZGV4PSI0MyIgcHJl
        c2V0TmFtZT0iQ29udHJhYmFzcyIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjQ0IiBwcmVzZXRJbmRleD0iNDQiIHByZXNldE5hbWU9
        IlRyZW1vbG8iLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSI0NSIgcHJlc2V0SW5kZXg9IjQ1IiBwcmVzZXROYW1lPSJQaXp6aWNhdG8g
        U2VjdGlvbiIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjQ2IiBwcmVzZXRJbmRleD0iNDYiIHByZXNldE5hbWU9IkhhcnAiLz48UHJl
        c2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSI0NyIgcHJlc2V0SW5kZXg9IjQ3IiBwcmVzZXROYW1lPSJUaW1wYW5pIi8+PFByZXNldCBzZWxlY3Rl
        ZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0iNDgiIHByZXNldEluZGV4PSI0OCIgcHJlc2V0TmFtZT0iU3RyaW5ncyIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBz
        ZWxlY3RlZFByb2dyYW09IjQ5IiBwcmVzZXRJbmRleD0iNDkiIHByZXNldE5hbWU9IlNsb3cgU3RyaW5ncyIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3Rl
        ZFByb2dyYW09IjUwIiBwcmVzZXRJbmRleD0iNTAiIHByZXNldE5hbWU9IlN5bnRoIFN0cmluZ3MgMSIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFBy
        b2dyYW09IjUxIiBwcmVzZXRJbmRleD0iNTEiIHByZXNldE5hbWU9IlN5bnRoIFN0cmluZ3MgMiIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dy
        YW09IjUyIiBwcmVzZXRJbmRleD0iNTIiIHByZXNldE5hbWU9IkFoaCBDaG9pciIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjUzIiBw
        cmVzZXRJbmRleD0iNTMiIHByZXNldE5hbWU9Ik9oaCBWb2ljZXMiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSI1NCIgcHJlc2V0SW5k
        ZXg9IjU0IiBwcmVzZXROYW1lPSJTeW50aCBWb2ljZSIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjU1IiBwcmVzZXRJbmRleD0iNTUi
        IHByZXNldE5hbWU9Ik9yY2hlc3RyYSBIaXQiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSI1NiIgcHJlc2V0SW5kZXg9IjU2IiBwcmVz
        ZXROYW1lPSJUcnVtcGV0Ii8+PFByZXNldCBzZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0iNTciIHByZXNldEluZGV4PSI1NyIgcHJlc2V0TmFtZT0iVHJv
        bWJvbmUiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSI1OCIgcHJlc2V0SW5kZXg9IjU4IiBwcmVzZXROYW1lPSJUdWJhIi8+PFByZXNl
        dCBzZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0iNTkiIHByZXNldEluZGV4PSI1OSIgcHJlc2V0TmFtZT0iTXV0ZWQgVHJ1bXBldCIvPjxQcmVzZXQgc2Vs
        ZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjYwIiBwcmVzZXRJbmRleD0iNjAiIHByZXNldE5hbWU9IkZyZW5jaCBIb3JucyIvPjxQcmVzZXQgc2VsZWN0ZWRC
        YW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjYxIiBwcmVzZXRJbmRleD0iNjEiIHByZXNldE5hbWU9IkJyYXNzIFNlY3Rpb24iLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0i
        MCIgc2VsZWN0ZWRQcm9ncmFtPSI2MiIgcHJlc2V0SW5kZXg9IjYyIiBwcmVzZXROYW1lPSJTeW50aCBCcmFzcyAxIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjAiIHNl
        bGVjdGVkUHJvZ3JhbT0iNjMiIHByZXNldEluZGV4PSI2MyIgcHJlc2V0TmFtZT0iU3ludGggQnJhc3MgMiIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3Rl
        ZFByb2dyYW09IjY0IiBwcmVzZXRJbmRleD0iNjQiIHByZXNldE5hbWU9IlNvcHJhbm8gU2F4Ii8+PFByZXNldCBzZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3Jh
        bT0iNjUiIHByZXNldEluZGV4PSI2NSIgcHJlc2V0TmFtZT0iQWx0byBTYXgiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSI2NiIgcHJl
        c2V0SW5kZXg9IjY2IiBwcmVzZXROYW1lPSJUZW5vciBTYXgiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSI2NyIgcHJlc2V0SW5kZXg9
        IjY3IiBwcmVzZXROYW1lPSJCYXJpdG9uZSBTYXgiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSI2OCIgcHJlc2V0SW5kZXg9IjY4IiBw
        cmVzZXROYW1lPSJPYm9lIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0iNjkiIHByZXNldEluZGV4PSI2OSIgcHJlc2V0TmFtZT0iRW5n
        bGlzaCBIb3JuIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0iNzAiIHByZXNldEluZGV4PSI3MCIgcHJlc2V0TmFtZT0iQmFzc29vbiIv
        PjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjcxIiBwcmVzZXRJbmRleD0iNzEiIHByZXNldE5hbWU9IkNsYXJpbmV0Ii8+PFByZXNldCBz
        ZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0iNzIiIHByZXNldEluZGV4PSI3MiIgcHJlc2V0TmFtZT0iUGljY29sbyIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5r
        PSIwIiBzZWxlY3RlZFByb2dyYW09IjczIiBwcmVzZXRJbmRleD0iNzMiIHByZXNldE5hbWU9IkZsdXRlIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVk
        UHJvZ3JhbT0iNzQiIHByZXNldEluZGV4PSI3NCIgcHJlc2V0TmFtZT0iUmVjb3JkZXIiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSI3
        NSIgcHJlc2V0SW5kZXg9Ijc1IiBwcmVzZXROYW1lPSJQYW4gRmx1dGUiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSI3NiIgcHJlc2V0
        SW5kZXg9Ijc2IiBwcmVzZXROYW1lPSJCb3R0bGUgQ2hpZmYiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSI3NyIgcHJlc2V0SW5kZXg9
        Ijc3IiBwcmVzZXROYW1lPSJTaGFrdWhhY2hpIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0iNzgiIHByZXNldEluZGV4PSI3OCIgcHJl
        c2V0TmFtZT0iV2hpc3RsZSIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09Ijc5IiBwcmVzZXRJbmRleD0iNzkiIHByZXNldE5hbWU9Ik9j
        YXJpbmEiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSI4MCIgcHJlc2V0SW5kZXg9IjgwIiBwcmVzZXROYW1lPSJTcXVhcmUgTGVhZCIv
        PjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjgxIiBwcmVzZXRJbmRleD0iODEiIHByZXNldE5hbWU9IlNhdyBXYXZlIi8+PFByZXNldCBz
        ZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0iODIiIHByZXNldEluZGV4PSI4MiIgcHJlc2V0TmFtZT0iQ2FsbGlvcGUgTGVhZCIvPjxQcmVzZXQgc2VsZWN0
        ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjgzIiBwcmVzZXRJbmRleD0iODMiIHByZXNldE5hbWU9IkNoaWZmZXIgTGVhZCIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5r
        PSIwIiBzZWxlY3RlZFByb2dyYW09Ijg0IiBwcmVzZXRJbmRleD0iODQiIHByZXNldE5hbWU9IkNoYXJhbmciLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0
        ZWRQcm9ncmFtPSI4NSIgcHJlc2V0SW5kZXg9Ijg1IiBwcmVzZXROYW1lPSJTb2xvIFZveCIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09
        Ijg2IiBwcmVzZXRJbmRleD0iODYiIHByZXNldE5hbWU9IkZpZnRoIFNhd3Rvb3RoIFdhdmUiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFt
        PSI4NyIgcHJlc2V0SW5kZXg9Ijg3IiBwcmVzZXROYW1lPSJCYXNzICZhbXA7IExlYWQiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSI4
        OCIgcHJlc2V0SW5kZXg9Ijg4IiBwcmVzZXROYW1lPSJGYW50YXNpYSIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09Ijg5IiBwcmVzZXRJ
        bmRleD0iODkiIHByZXNldE5hbWU9Ildhcm0gUGFkIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0iOTAiIHByZXNldEluZGV4PSI5MCIg
        cHJlc2V0TmFtZT0iUG9seXN5bnRoIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0iOTEiIHByZXNldEluZGV4PSI5MSIgcHJlc2V0TmFt
        ZT0iU3BhY2UgVm9pY2UiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSI5MiIgcHJlc2V0SW5kZXg9IjkyIiBwcmVzZXROYW1lPSJCb3dl
        ZCBHbGFzcyIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjkzIiBwcmVzZXRJbmRleD0iOTMiIHByZXNldE5hbWU9Ik1ldGFsIFBhZCIv
        PjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09Ijk0IiBwcmVzZXRJbmRleD0iOTQiIHByZXNldE5hbWU9IkhhbG8gUGFkIi8+PFByZXNldCBz
        ZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0iOTUiIHByZXNldEluZGV4PSI5NSIgcHJlc2V0TmFtZT0iU3dlZXAgUGFkIi8+PFByZXNldCBzZWxlY3RlZEJh
        bms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0iOTYiIHByZXNldEluZGV4PSI5NiIgcHJlc2V0TmFtZT0iSWNlIFJhaW4iLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2Vs
        ZWN0ZWRQcm9ncmFtPSI5NyIgcHJlc2V0SW5kZXg9Ijk3IiBwcmVzZXROYW1lPSJTb3VuZHRyYWNrIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVkUHJv
        Z3JhbT0iOTgiIHByZXNldEluZGV4PSI5OCIgcHJlc2V0TmFtZT0iQ3J5c3RhbCIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09Ijk5IiBw
        cmVzZXRJbmRleD0iOTkiIHByZXNldE5hbWU9IkF0bW9zcGhlcmUiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSIxMDAiIHByZXNldElu
        ZGV4PSIxMDAiIHByZXNldE5hbWU9IkJyaWdodG5lc3MiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSIxMDEiIHByZXNldEluZGV4PSIx
        MDEiIHByZXNldE5hbWU9IkdvYmxpbiIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjEwMiIgcHJlc2V0SW5kZXg9IjEwMiIgcHJlc2V0
        TmFtZT0iRWNobyBEcm9wcyIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjEwMyIgcHJlc2V0SW5kZXg9IjEwMyIgcHJlc2V0TmFtZT0i
        U3RhciBUaGVtZSIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjEwNCIgcHJlc2V0SW5kZXg9IjEwNCIgcHJlc2V0TmFtZT0iU2l0YXIi
        Lz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSIxMDUiIHByZXNldEluZGV4PSIxMDUiIHByZXNldE5hbWU9IkJhbmpvIi8+PFByZXNldCBz
        ZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0iMTA2IiBwcmVzZXRJbmRleD0iMTA2IiBwcmVzZXROYW1lPSJTaGFtaXNlbiIvPjxQcmVzZXQgc2VsZWN0ZWRC
        YW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjEwNyIgcHJlc2V0SW5kZXg9IjEwNyIgcHJlc2V0TmFtZT0iS290byIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxl
        Y3RlZFByb2dyYW09IjEwOCIgcHJlc2V0SW5kZXg9IjEwOCIgcHJlc2V0TmFtZT0iS2FsaW1iYSIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dy
        YW09IjEwOSIgcHJlc2V0SW5kZXg9IjEwOSIgcHJlc2V0TmFtZT0iQmFnUGlwZSIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjExMCIg
        cHJlc2V0SW5kZXg9IjExMCIgcHJlc2V0TmFtZT0iRmlkZGxlIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0iMTExIiBwcmVzZXRJbmRl
        eD0iMTExIiBwcmVzZXROYW1lPSJTaGVuYWkiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSIxMTIiIHByZXNldEluZGV4PSIxMTIiIHBy
        ZXNldE5hbWU9IlRpbmtlciBCZWxsIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0iMTEzIiBwcmVzZXRJbmRleD0iMTEzIiBwcmVzZXRO
        YW1lPSJBZ29nbyIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjExNCIgcHJlc2V0SW5kZXg9IjExNCIgcHJlc2V0TmFtZT0iU3RlZWwg
        RHJ1bXMiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSIxMTUiIHByZXNldEluZGV4PSIxMTUiIHByZXNldE5hbWU9Ildvb2RibG9jayIv
        PjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjExNiIgcHJlc2V0SW5kZXg9IjExNiIgcHJlc2V0TmFtZT0iVGFpa28gRHJ1bSIvPjxQcmVz
        ZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjExNyIgcHJlc2V0SW5kZXg9IjExNyIgcHJlc2V0TmFtZT0iTWVsb2RpYyBUb20iLz48UHJlc2V0IHNl
        bGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSIxMTgiIHByZXNldEluZGV4PSIxMTgiIHByZXNldE5hbWU9IlN5bnRoIERydW0iLz48UHJlc2V0IHNlbGVjdGVk
        QmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSIxMTkiIHByZXNldEluZGV4PSIxMTkiIHByZXNldE5hbWU9IlJldmVyc2UgQ3ltYmFsIi8+PFByZXNldCBzZWxlY3RlZEJh
        bms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0iMTIwIiBwcmVzZXRJbmRleD0iMTIwIiBwcmVzZXROYW1lPSJGcmV0IE5vaXNlIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjAi
        IHNlbGVjdGVkUHJvZ3JhbT0iMTIxIiBwcmVzZXRJbmRleD0iMTIxIiBwcmVzZXROYW1lPSJCcmVhdGggTm9pc2UiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2Vs
        ZWN0ZWRQcm9ncmFtPSIxMjIiIHByZXNldEluZGV4PSIxMjIiIHByZXNldE5hbWU9IlNlYSBTaG9yZSIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFBy
        b2dyYW09IjEyMyIgcHJlc2V0SW5kZXg9IjEyMyIgcHJlc2V0TmFtZT0iQmlyZCBUd2VldCIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09
        IjEyNCIgcHJlc2V0SW5kZXg9IjEyNCIgcHJlc2V0TmFtZT0iVGVsZXBob25lIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0iMTI1IiBw
        cmVzZXRJbmRleD0iMTI1IiBwcmVzZXROYW1lPSJIZWxpY29wdGVyIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0iMTI2IiBwcmVzZXRJ
        bmRleD0iMTI2IiBwcmVzZXROYW1lPSJBcHBsYXVzZSIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjEyNyIgcHJlc2V0SW5kZXg9IjEy
        NyIgcHJlc2V0TmFtZT0iR3VuIFNob3QiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iOCIgc2VsZWN0ZWRQcm9ncmFtPSI0IiBwcmVzZXRJbmRleD0iMTI4IiBwcmVzZXRO
        YW1lPSJEZXR1bmVkIEVQIDEiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iOCIgc2VsZWN0ZWRQcm9ncmFtPSI1IiBwcmVzZXRJbmRleD0iMTI5IiBwcmVzZXROYW1lPSJE
        ZXR1bmVkIEVQIDIiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iOCIgc2VsZWN0ZWRQcm9ncmFtPSI2IiBwcmVzZXRJbmRleD0iMTMwIiBwcmVzZXROYW1lPSJDb3VwbGVk
        IEhhcnBzaWNob3JkIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjgiIHNlbGVjdGVkUHJvZ3JhbT0iMTQiIHByZXNldEluZGV4PSIxMzEiIHByZXNldE5hbWU9IkNodXJj
        aCBCZWxsIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjgiIHNlbGVjdGVkUHJvZ3JhbT0iMTYiIHByZXNldEluZGV4PSIxMzIiIHByZXNldE5hbWU9IkRldHVuZWQgT3Jn
        YW4gMSIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSI4IiBzZWxlY3RlZFByb2dyYW09IjE3IiBwcmVzZXRJbmRleD0iMTMzIiBwcmVzZXROYW1lPSJEZXR1bmVkIE9yZ2Fu
        IDIiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iOCIgc2VsZWN0ZWRQcm9ncmFtPSIxOSIgcHJlc2V0SW5kZXg9IjEzNCIgcHJlc2V0TmFtZT0iQ2h1cmNoIE9yZ2FuIDIi
        Lz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iOCIgc2VsZWN0ZWRQcm9ncmFtPSIyMSIgcHJlc2V0SW5kZXg9IjEzNSIgcHJlc2V0TmFtZT0iSXRhbGlhbiBBY2NvcmRpb24i
        Lz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iOCIgc2VsZWN0ZWRQcm9ncmFtPSIyNCIgcHJlc2V0SW5kZXg9IjEzNiIgcHJlc2V0TmFtZT0iVWt1bGVsZSIvPjxQcmVzZXQg
        c2VsZWN0ZWRCYW5rPSI4IiBzZWxlY3RlZFByb2dyYW09IjI1IiBwcmVzZXRJbmRleD0iMTM3IiBwcmVzZXROYW1lPSIxMiBTdHJpbmcgR3VpdGFyIi8+PFByZXNldCBz
        ZWxlY3RlZEJhbms9IjgiIHNlbGVjdGVkUHJvZ3JhbT0iMjYiIHByZXNldEluZGV4PSIxMzgiIHByZXNldE5hbWU9Ikhhd2FpaWFuIEd1aXRhciIvPjxQcmVzZXQgc2Vs
        ZWN0ZWRCYW5rPSI4IiBzZWxlY3RlZFByb2dyYW09IjI4IiBwcmVzZXRJbmRleD0iMTM5IiBwcmVzZXROYW1lPSJGdW5rIEd1aXRhciIvPjxQcmVzZXQgc2VsZWN0ZWRC
        YW5rPSI4IiBzZWxlY3RlZFByb2dyYW09IjMwIiBwcmVzZXRJbmRleD0iMTQwIiBwcmVzZXROYW1lPSJGZWVkYmFjayBHdWl0YXIiLz48UHJlc2V0IHNlbGVjdGVkQmFu
        az0iOCIgc2VsZWN0ZWRQcm9ncmFtPSIzMSIgcHJlc2V0SW5kZXg9IjE0MSIgcHJlc2V0TmFtZT0iR3VpdGFyIEZlZWRiYWNrIi8+PFByZXNldCBzZWxlY3RlZEJhbms9
        IjgiIHNlbGVjdGVkUHJvZ3JhbT0iMzgiIHByZXNldEluZGV4PSIxNDIiIHByZXNldE5hbWU9IlN5bnRoIEJhc3MgMyIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSI4IiBz
        ZWxlY3RlZFByb2dyYW09IjM5IiBwcmVzZXRJbmRleD0iMTQzIiBwcmVzZXROYW1lPSJTeW50aCBCYXNzIDQiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iOCIgc2VsZWN0
        ZWRQcm9ncmFtPSI0MCIgcHJlc2V0SW5kZXg9IjE0NCIgcHJlc2V0TmFtZT0iU2xvdyBWaW9saW4iLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iOCIgc2VsZWN0ZWRQcm9n
        cmFtPSI0OCIgcHJlc2V0SW5kZXg9IjE0NSIgcHJlc2V0TmFtZT0iT3JjaGVzdHJhbCBQYWQiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iOCIgc2VsZWN0ZWRQcm9ncmFt
        PSI1MCIgcHJlc2V0SW5kZXg9IjE0NiIgcHJlc2V0TmFtZT0iU3ludGggU3RyaW5ncyAzIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjgiIHNlbGVjdGVkUHJvZ3JhbT0i
        NjEiIHByZXNldEluZGV4PSIxNDciIHByZXNldE5hbWU9IkJyYXNzIDIiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iOCIgc2VsZWN0ZWRQcm9ncmFtPSI2MiIgcHJlc2V0
        SW5kZXg9IjE0OCIgcHJlc2V0TmFtZT0iU3ludGggQnJhc3MgMyIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSI4IiBzZWxlY3RlZFByb2dyYW09IjYzIiBwcmVzZXRJbmRl
        eD0iMTQ5IiBwcmVzZXROYW1lPSJTeW50aCBCcmFzcyA0Ii8+PFByZXNldCBzZWxlY3RlZEJhbms9IjgiIHNlbGVjdGVkUHJvZ3JhbT0iODAiIHByZXNldEluZGV4PSIx
        NTAiIHByZXNldE5hbWU9IlNpbmUgV2F2ZSIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSI4IiBzZWxlY3RlZFByb2dyYW09IjEwNyIgcHJlc2V0SW5kZXg9IjE1MSIgcHJl
        c2V0TmFtZT0iVGFpc2hvIEtvdG8iLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iOCIgc2VsZWN0ZWRQcm9ncmFtPSIxMTUiIHByZXNldEluZGV4PSIxNTIiIHByZXNldE5h
        bWU9IkNhc3RhbmV0cyIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSI4IiBzZWxlY3RlZFByb2dyYW09IjExNiIgcHJlc2V0SW5kZXg9IjE1MyIgcHJlc2V0TmFtZT0iQ29u
        Y2VydCBCYXNzIERydW0iLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iOCIgc2VsZWN0ZWRQcm9ncmFtPSIxMTciIHByZXNldEluZGV4PSIxNTQiIHByZXNldE5hbWU9Ik1l
        bG8gVG9tIDIiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iOCIgc2VsZWN0ZWRQcm9ncmFtPSIxMTgiIHByZXNldEluZGV4PSIxNTUiIHByZXNldE5hbWU9IjgwOCBUb20i
        Lz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iOSIgc2VsZWN0ZWRQcm9ncmFtPSIxMjUiIHByZXNldEluZGV4PSIxNTYiIHByZXNldE5hbWU9IkJ1cnN0IE5vaXNlIi8+PFBy
        ZXNldCBzZWxlY3RlZEJhbms9IjE2IiBzZWxlY3RlZFByb2dyYW09IjI1IiBwcmVzZXRJbmRleD0iMTU3IiBwcmVzZXROYW1lPSJNYW5kb2xpbiIvPjxQcmVzZXQgc2Vs
        ZWN0ZWRCYW5rPSIxMjgiIHNlbGVjdGVkUHJvZ3JhbT0iMCIgcHJlc2V0SW5kZXg9IjE1OCIgcHJlc2V0TmFtZT0iU3RhbmRhcmQiLz48UHJlc2V0IHNlbGVjdGVkQmFu
        az0iMTI4IiBzZWxlY3RlZFByb2dyYW09IjEiIHByZXNldEluZGV4PSIxNTkiIHByZXNldE5hbWU9IlN0YW5kYXJkIDEiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMTI4
        IiBzZWxlY3RlZFByb2dyYW09IjIiIHByZXNldEluZGV4PSIxNjAiIHByZXNldE5hbWU9IlN0YW5kYXJkIDIiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMTI4IiBzZWxl
        Y3RlZFByb2dyYW09IjMiIHByZXNldEluZGV4PSIxNjEiIHByZXNldE5hbWU9IlN0YW5kYXJkIDMiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMTI4IiBzZWxlY3RlZFBy
        b2dyYW09IjQiIHByZXNldEluZGV4PSIxNjIiIHByZXNldE5hbWU9IlN0YW5kYXJkIDQiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMTI4IiBzZWxlY3RlZFByb2dyYW09
        IjUiIHByZXNldEluZGV4PSIxNjMiIHByZXNldE5hbWU9IlN0YW5kYXJkIDUiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMTI4IiBzZWxlY3RlZFByb2dyYW09IjYiIHBy
        ZXNldEluZGV4PSIxNjQiIHByZXNldE5hbWU9IlN0YW5kYXJkIDYiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMTI4IiBzZWxlY3RlZFByb2dyYW09IjciIHByZXNldElu
        ZGV4PSIxNjUiIHByZXNldE5hbWU9IlN0YW5kYXJkIDciLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMTI4IiBzZWxlY3RlZFByb2dyYW09IjgiIHByZXNldEluZGV4PSIx
        NjYiIHByZXNldE5hbWU9IlJvb20iLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMTI4IiBzZWxlY3RlZFByb2dyYW09IjkiIHByZXNldEluZGV4PSIxNjciIHByZXNldE5h
        bWU9IlJvb20gMSIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIxMjgiIHNlbGVjdGVkUHJvZ3JhbT0iMTAiIHByZXNldEluZGV4PSIxNjgiIHByZXNldE5hbWU9IlJvb20g
        MiIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIxMjgiIHNlbGVjdGVkUHJvZ3JhbT0iMTEiIHByZXNldEluZGV4PSIxNjkiIHByZXNldE5hbWU9IlJvb20gMyIvPjxQcmVz
        ZXQgc2VsZWN0ZWRCYW5rPSIxMjgiIHNlbGVjdGVkUHJvZ3JhbT0iMTIiIHByZXNldEluZGV4PSIxNzAiIHByZXNldE5hbWU9IlJvb20gNCIvPjxQcmVzZXQgc2VsZWN0
        ZWRCYW5rPSIxMjgiIHNlbGVjdGVkUHJvZ3JhbT0iMTMiIHByZXNldEluZGV4PSIxNzEiIHByZXNldE5hbWU9IlJvb20gNSIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIx
        MjgiIHNlbGVjdGVkUHJvZ3JhbT0iMTQiIHByZXNldEluZGV4PSIxNzIiIHByZXNldE5hbWU9IlJvb20gNiIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIxMjgiIHNlbGVj
        dGVkUHJvZ3JhbT0iMTUiIHByZXNldEluZGV4PSIxNzMiIHByZXNldE5hbWU9IlJvb20gNyIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIxMjgiIHNlbGVjdGVkUHJvZ3Jh
        bT0iMTYiIHByZXNldEluZGV4PSIxNzQiIHByZXNldE5hbWU9IlBvd2VyIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjEyOCIgc2VsZWN0ZWRQcm9ncmFtPSIxNyIgcHJl
        c2V0SW5kZXg9IjE3NSIgcHJlc2V0TmFtZT0iUG93ZXIgMSIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIxMjgiIHNlbGVjdGVkUHJvZ3JhbT0iMTgiIHByZXNldEluZGV4
        PSIxNzYiIHByZXNldE5hbWU9IlBvd2VyIDIiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMTI4IiBzZWxlY3RlZFByb2dyYW09IjE5IiBwcmVzZXRJbmRleD0iMTc3IiBw
        cmVzZXROYW1lPSJQb3dlciAzIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjEyOCIgc2VsZWN0ZWRQcm9ncmFtPSIyNCIgcHJlc2V0SW5kZXg9IjE3OCIgcHJlc2V0TmFt
        ZT0iRWxlY3Ryb25pYyIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIxMjgiIHNlbGVjdGVkUHJvZ3JhbT0iMjUiIHByZXNldEluZGV4PSIxNzkiIHByZXNldE5hbWU9IlRS
        LTgwOCIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIxMjgiIHNlbGVjdGVkUHJvZ3JhbT0iMzIiIHByZXNldEluZGV4PSIxODAiIHByZXNldE5hbWU9IkphenoiLz48UHJl
        c2V0IHNlbGVjdGVkQmFuaz0iMTI4IiBzZWxlY3RlZFByb2dyYW09IjMzIiBwcmVzZXRJbmRleD0iMTgxIiBwcmVzZXROYW1lPSJKYXp6IDEiLz48UHJlc2V0IHNlbGVj
        dGVkQmFuaz0iMTI4IiBzZWxlY3RlZFByb2dyYW09IjM0IiBwcmVzZXRJbmRleD0iMTgyIiBwcmVzZXROYW1lPSJKYXp6IDIiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0i
        MTI4IiBzZWxlY3RlZFByb2dyYW09IjM1IiBwcmVzZXRJbmRleD0iMTgzIiBwcmVzZXROYW1lPSJKYXp6IDMiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMTI4IiBzZWxl
        Y3RlZFByb2dyYW09IjM2IiBwcmVzZXRJbmRleD0iMTg0IiBwcmVzZXROYW1lPSJKYXp6IDQiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMTI4IiBzZWxlY3RlZFByb2dy
        YW09IjQwIiBwcmVzZXRJbmRleD0iMTg1IiBwcmVzZXROYW1lPSJCcnVzaCIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIxMjgiIHNlbGVjdGVkUHJvZ3JhbT0iNDEiIHBy
        ZXNldEluZGV4PSIxODYiIHByZXNldE5hbWU9IkJydXNoIDEiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMTI4IiBzZWxlY3RlZFByb2dyYW09IjQyIiBwcmVzZXRJbmRl
        eD0iMTg3IiBwcmVzZXROYW1lPSJCcnVzaCAyIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjEyOCIgc2VsZWN0ZWRQcm9ncmFtPSI0OCIgcHJlc2V0SW5kZXg9IjE4OCIg
        cHJlc2V0TmFtZT0iT3JjaGVzdHJhIEtpdCIvPjwvUHJlc2V0TGlzdD48L0ltcG9ydGVkTGlicmFyeT48L0ltcG9ydGVkTGlicmFyaWVzPjxGYXZvcml0ZUluc3RydW1l
        bnRzLz48U291bmRQcmVzZXRzLz48L0xvZ2ljU0YyUGxheWVyU3RhdGU+AAAAAAAAAAAASlVDRVByaXZhdGVEYXRhAAEBQnlwYXNzAAEBAwAdAAAAAAAAAEpVQ0VQcml2
        YXRlRGF0YQAAAAAAAAAA
        AAAQAAAA
      >
      FLOATPOS 0 0 0 0
      FXID {D7C1BA01-6D55-5523-B9F6-B17AA39C546C}
      WAK 0 0
    >
    <ITEM
      POSITION 0
      SNAPOFFS 0
      LENGTH 8
      LOOP 1
      ALLTAKES 0
      FADEIN 1 0 0 1 0 0 0
      FADEOUT 1 0 0 1 0 0 0
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
        E 0 90 30 60
        E 480 80 30 00
        e 840 90 3d 60
        e 120 80 3d 00
        E 720 90 38 60
        E 120 80 38 00
        E 1560 b0 7b 00
        CCINTERP 32
        CHASE_CC_TAKEOFFS 1
        GUID {4B571F06-0FF5-2A92-BB3E-AF2988C94DB3}
        IGNTEMPO 0 120 4 4
        SRCCOLOR 0
        EVTFILTER 0 -1 -1 -1 -1 0 0 0 0 -1 -1 -1 -1 0 -1 0 -1 -1
        VELLANE -1 100 0 0 1
        CFGEDITVIEW 0 0.453906 61 12 0 0 0 0 0 0.5
        KEYSNAP 0
        TRACKSEL 0
        CFGEDIT 1 1 0 1 0 0 1 1 1 1 1 0.125 60 98 2118 1229 0 0 0 0 0 0 0 0 0 0.5 0 0 1 64
      >
    >
  >
  <TRACK {15F14257-93EF-E26E-1F17-705A6639B8D6}
    NAME rumstest
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
    TRACKID {15F14257-93EF-E26E-1F17-705A6639B8D6}
    PERF 0
    MIDIOUT -1
    MAINSEND 1 0
    <FXCHAIN
      WNDRECT 32 94 2414 1455
      SHOW 0
      LASTSEL 0
      DOCKED 0
      BYPASS 0 0 0
      <VST "VST3i: simpleSF2 (simpleSoundbank)" simpleSF2.vst3 0 "" 1793455926{ABCDEF019182FAEB53424E4B5366706C} ""
        Nvflau5e7f4AAAAAAgAAAAEAAAAAAAAAAgAAAAAAAACwRwAAAQAAAP//EAA=
        oEcAAAEAAABWQzIhW0cAADw/eG1sIHZlcnNpb249IjEuMCIgZW5jb2Rpbmc9IlVURi04Ij8+IDxMb2dpY1NGMlBsYXllclN0YXRlIHNmMlBhdGg9Ii9ob21lL3Nzcy8u
        Y29uZmlnL3NpbXBsZVNvdW5kYmFuay9JbXBvcnRlZFNvdW5kRm9udHMvN2Y2YTM0OTZmNjgyNDJiNmE4ODlmNzMwYmRhYzYyNzRfRmx1aWRSM19HTS9GbHVpZFIzX0dN
        LnNmMiIgc2VsZWN0ZWRCYW5rPSIxMjgiIHNlbGVjdGVkUHJvZ3JhbT0iMCIgc2VsZWN0ZWRMaWJyYXJ5SW5kZXg9IjAiIGN1c3RvbVN0b3JhZ2VQYXRoPSIiIGFjdGl2
        ZUN1c3RvbVNvdW5kUHJlc2V0PSIiPjxQQVJBTSBpZD0iYW1wQXR0YWNrU2Vjb25kcyIgdmFsdWU9IjAuMCIvPjxQQVJBTSBpZD0iYW1wRGVjYXlTZWNvbmRzIiB2YWx1
        ZT0iMC4wIi8+PFBBUkFNIGlkPSJhbXBSZWxlYXNlU2Vjb25kcyIgdmFsdWU9IjAuMCIvPjxQQVJBTSBpZD0iYW1wU3VzdGFpbiIgdmFsdWU9IjEuMCIvPjxQQVJBTSBp
        ZD0iZmlsdGVyQXR0YWNrU2Vjb25kcyIgdmFsdWU9IjAuMCIvPjxQQVJBTSBpZD0iZmlsdGVyQ3V0b2ZmSHoiIHZhbHVlPSIyMDAwMC4wIi8+PFBBUkFNIGlkPSJmaWx0
        ZXJEZWNheVNlY29uZHMiIHZhbHVlPSIwLjAiLz48UEFSQU0gaWQ9ImZpbHRlckVudmVsb3BlQW1vdW50IiB2YWx1ZT0iMC4wIi8+PFBBUkFNIGlkPSJmaWx0ZXJSZWxl
        YXNlU2Vjb25kcyIgdmFsdWU9IjAuMCIvPjxQQVJBTSBpZD0iZmlsdGVyUmVzb25hbmNlIiB2YWx1ZT0iMC43MDk5OTk5Nzg1NDIzMjc5Ii8+PFBBUkFNIGlkPSJmaWx0
        ZXJTdXN0YWluIiB2YWx1ZT0iMS4wIi8+PFBBUkFNIGlkPSJmaWx0ZXJUeXBlIiB2YWx1ZT0iNC4wIi8+PFBBUkFNIGlkPSJnbGlkZU1vZGUiIHZhbHVlPSIwLjAiLz48
        UEFSQU0gaWQ9ImdsaXNzYW5kb1RpbWVNcyIgdmFsdWU9IjAuMCIvPjxQQVJBTSBpZD0ibWFzdGVyVm9sdW1lIiB2YWx1ZT0iMC44NTAwMDAwMjM4NDE4NTc5Ii8+PFBB
        UkFNIGlkPSJwaXRjaEJlbmRSYW5nZSIgdmFsdWU9IjIuMCIvPjxQQVJBTSBpZD0icG9seXBob255IiB2YWx1ZT0iNjQuMCIvPjxQQVJBTSBpZD0ic3dlZXBPZmZzZXRT
        ZW1pdG9uZXMiIHZhbHVlPSItMi4wIi8+PFBBUkFNIGlkPSJ0cmFuc3Bvc2UiIHZhbHVlPSIwLjAiLz48SW1wb3J0ZWRMaWJyYXJpZXM+PEltcG9ydGVkTGlicmFyeSBp
        ZGVudGlmaWVyPSIyY2I2NjM2YzEzZDU0YmMxYWRjMTA2MjIzZTUzOGFmMSIgZGlzcGxheU5hbWU9IkZsdWlkUjNfR00iIHN0b3JlZEZpbGVQYXRoPSIvaG9tZS9zc3Mv
        LmNvbmZpZy9zaW1wbGVTb3VuZGJhbmsvSW1wb3J0ZWRTb3VuZEZvbnRzLzdmNmEzNDk2ZjY4MjQyYjZhODg5ZjczMGJkYWM2Mjc0X0ZsdWlkUjNfR00vRmx1aWRSM19H
        TS5zZjIiIGlzSW5jbHVkZWRDb250ZW50PSIwIj48UHJlc2V0TGlzdD48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSIwIiBwcmVzZXRJbmRl
        eD0iMCIgcHJlc2V0TmFtZT0iWWFtYWhhIEdyYW5kIFBpYW5vIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0iMSIgcHJlc2V0SW5kZXg9
        IjEiIHByZXNldE5hbWU9IkJyaWdodCBZYW1haGEgR3JhbmQiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSIyIiBwcmVzZXRJbmRleD0i
        MiIgcHJlc2V0TmFtZT0iRWxlY3RyaWMgUGlhbm8iLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSIzIiBwcmVzZXRJbmRleD0iMyIgcHJl
        c2V0TmFtZT0iSG9ua3kgVG9uayIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjQiIHByZXNldEluZGV4PSI0IiBwcmVzZXROYW1lPSJS
        aG9kZXMgRVAiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSI1IiBwcmVzZXRJbmRleD0iNSIgcHJlc2V0TmFtZT0iTGVnZW5kIEVQIDIi
        Lz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSI2IiBwcmVzZXRJbmRleD0iNiIgcHJlc2V0TmFtZT0iSGFycHNpY2hvcmQiLz48UHJlc2V0
        IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSI3IiBwcmVzZXRJbmRleD0iNyIgcHJlc2V0TmFtZT0iQ2xhdmluZXQiLz48UHJlc2V0IHNlbGVjdGVkQmFu
        az0iMCIgc2VsZWN0ZWRQcm9ncmFtPSI4IiBwcmVzZXRJbmRleD0iOCIgcHJlc2V0TmFtZT0iQ2VsZXN0YSIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3Rl
        ZFByb2dyYW09IjkiIHByZXNldEluZGV4PSI5IiBwcmVzZXROYW1lPSJHbG9ja2Vuc3BpZWwiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFt
        PSIxMCIgcHJlc2V0SW5kZXg9IjEwIiBwcmVzZXROYW1lPSJNdXNpYyBCb3giLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSIxMSIgcHJl
        c2V0SW5kZXg9IjExIiBwcmVzZXROYW1lPSJWaWJyYXBob25lIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0iMTIiIHByZXNldEluZGV4
        PSIxMiIgcHJlc2V0TmFtZT0iTWFyaW1iYSIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjEzIiBwcmVzZXRJbmRleD0iMTMiIHByZXNl
        dE5hbWU9Ilh5bG9waG9uZSIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjE0IiBwcmVzZXRJbmRleD0iMTQiIHByZXNldE5hbWU9IlR1
        YnVsYXIgQmVsbHMiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSIxNSIgcHJlc2V0SW5kZXg9IjE1IiBwcmVzZXROYW1lPSJEdWxjaW1l
        ciIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjE2IiBwcmVzZXRJbmRleD0iMTYiIHByZXNldE5hbWU9IkRyYXdiYXJPcmdhbiIvPjxQ
        cmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjE3IiBwcmVzZXRJbmRleD0iMTciIHByZXNldE5hbWU9IlBlcmN1c3NpdmUgT3JnYW4iLz48UHJl
        c2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSIxOCIgcHJlc2V0SW5kZXg9IjE4IiBwcmVzZXROYW1lPSJSb2NrIE9yZ2FuIi8+PFByZXNldCBzZWxl
        Y3RlZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0iMTkiIHByZXNldEluZGV4PSIxOSIgcHJlc2V0TmFtZT0iQ2h1cmNoIE9yZ2FuIi8+PFByZXNldCBzZWxlY3RlZEJh
        bms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0iMjAiIHByZXNldEluZGV4PSIyMCIgcHJlc2V0TmFtZT0iUmVlZCBPcmdhbiIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBz
        ZWxlY3RlZFByb2dyYW09IjIxIiBwcmVzZXRJbmRleD0iMjEiIHByZXNldE5hbWU9IkFjY29yZGlhbiIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFBy
        b2dyYW09IjIyIiBwcmVzZXRJbmRleD0iMjIiIHByZXNldE5hbWU9Ikhhcm1vbmljYSIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjIz
        IiBwcmVzZXRJbmRleD0iMjMiIHByZXNldE5hbWU9IkJhbmRvbmVvbiIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjI0IiBwcmVzZXRJ
        bmRleD0iMjQiIHByZXNldE5hbWU9Ik55bG9uIFN0cmluZyBHdWl0YXIiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSIyNSIgcHJlc2V0
        SW5kZXg9IjI1IiBwcmVzZXROYW1lPSJTdGVlbCBTdHJpbmcgR3VpdGFyIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0iMjYiIHByZXNl
        dEluZGV4PSIyNiIgcHJlc2V0TmFtZT0iSmF6eiBHdWl0YXIiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSIyNyIgcHJlc2V0SW5kZXg9
        IjI3IiBwcmVzZXROYW1lPSJDbGVhbiBHdWl0YXIiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSIyOCIgcHJlc2V0SW5kZXg9IjI4IiBw
        cmVzZXROYW1lPSJQYWxtIE11dGVkIEd1aXRhciIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjI5IiBwcmVzZXRJbmRleD0iMjkiIHBy
        ZXNldE5hbWU9Ik92ZXJkcml2ZSBHdWl0YXIiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSIzMCIgcHJlc2V0SW5kZXg9IjMwIiBwcmVz
        ZXROYW1lPSJEaXN0b3J0aW9uIEd1aXRhciIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjMxIiBwcmVzZXRJbmRleD0iMzEiIHByZXNl
        dE5hbWU9Ikd1aXRhciBIYXJtb25pY3MiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSIzMiIgcHJlc2V0SW5kZXg9IjMyIiBwcmVzZXRO
        YW1lPSJBY291c3RpYyBCYXNzIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0iMzMiIHByZXNldEluZGV4PSIzMyIgcHJlc2V0TmFtZT0i
        RmluZ2VyZWQgQmFzcyIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjM0IiBwcmVzZXRJbmRleD0iMzQiIHByZXNldE5hbWU9IlBpY2tl
        ZCBCYXNzIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0iMzUiIHByZXNldEluZGV4PSIzNSIgcHJlc2V0TmFtZT0iRnJldGxlc3MgQmFz
        cyIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjM2IiBwcmVzZXRJbmRleD0iMzYiIHByZXNldE5hbWU9IlNsYXAgQmFzcyIvPjxQcmVz
        ZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjM3IiBwcmVzZXRJbmRleD0iMzciIHByZXNldE5hbWU9IlBvcCBCYXNzIi8+PFByZXNldCBzZWxlY3Rl
        ZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0iMzgiIHByZXNldEluZGV4PSIzOCIgcHJlc2V0TmFtZT0iU3ludGggQmFzcyAxIi8+PFByZXNldCBzZWxlY3RlZEJhbms9
        IjAiIHNlbGVjdGVkUHJvZ3JhbT0iMzkiIHByZXNldEluZGV4PSIzOSIgcHJlc2V0TmFtZT0iU3ludGggQmFzcyAyIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjAiIHNl
        bGVjdGVkUHJvZ3JhbT0iNDAiIHByZXNldEluZGV4PSI0MCIgcHJlc2V0TmFtZT0iVmlvbGluIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3Jh
        bT0iNDEiIHByZXNldEluZGV4PSI0MSIgcHJlc2V0TmFtZT0iVmlvbGEiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSI0MiIgcHJlc2V0
        SW5kZXg9IjQyIiBwcmVzZXROYW1lPSJDZWxsbyIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjQzIiBwcmVzZXRJbmRleD0iNDMiIHBy
        ZXNldE5hbWU9IkNvbnRyYWJhc3MiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSI0NCIgcHJlc2V0SW5kZXg9IjQ0IiBwcmVzZXROYW1l
        PSJUcmVtb2xvIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0iNDUiIHByZXNldEluZGV4PSI0NSIgcHJlc2V0TmFtZT0iUGl6emljYXRv
        IFNlY3Rpb24iLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSI0NiIgcHJlc2V0SW5kZXg9IjQ2IiBwcmVzZXROYW1lPSJIYXJwIi8+PFBy
        ZXNldCBzZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0iNDciIHByZXNldEluZGV4PSI0NyIgcHJlc2V0TmFtZT0iVGltcGFuaSIvPjxQcmVzZXQgc2VsZWN0
        ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjQ4IiBwcmVzZXRJbmRleD0iNDgiIHByZXNldE5hbWU9IlN0cmluZ3MiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIg
        c2VsZWN0ZWRQcm9ncmFtPSI0OSIgcHJlc2V0SW5kZXg9IjQ5IiBwcmVzZXROYW1lPSJTbG93IFN0cmluZ3MiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0
        ZWRQcm9ncmFtPSI1MCIgcHJlc2V0SW5kZXg9IjUwIiBwcmVzZXROYW1lPSJTeW50aCBTdHJpbmdzIDEiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQ
        cm9ncmFtPSI1MSIgcHJlc2V0SW5kZXg9IjUxIiBwcmVzZXROYW1lPSJTeW50aCBTdHJpbmdzIDIiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9n
        cmFtPSI1MiIgcHJlc2V0SW5kZXg9IjUyIiBwcmVzZXROYW1lPSJBaGggQ2hvaXIiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSI1MyIg
        cHJlc2V0SW5kZXg9IjUzIiBwcmVzZXROYW1lPSJPaGggVm9pY2VzIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0iNTQiIHByZXNldElu
        ZGV4PSI1NCIgcHJlc2V0TmFtZT0iU3ludGggVm9pY2UiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSI1NSIgcHJlc2V0SW5kZXg9IjU1
        IiBwcmVzZXROYW1lPSJPcmNoZXN0cmEgSGl0Ii8+PFByZXNldCBzZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0iNTYiIHByZXNldEluZGV4PSI1NiIgcHJl
        c2V0TmFtZT0iVHJ1bXBldCIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjU3IiBwcmVzZXRJbmRleD0iNTciIHByZXNldE5hbWU9IlRy
        b21ib25lIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0iNTgiIHByZXNldEluZGV4PSI1OCIgcHJlc2V0TmFtZT0iVHViYSIvPjxQcmVz
        ZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjU5IiBwcmVzZXRJbmRleD0iNTkiIHByZXNldE5hbWU9Ik11dGVkIFRydW1wZXQiLz48UHJlc2V0IHNl
        bGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSI2MCIgcHJlc2V0SW5kZXg9IjYwIiBwcmVzZXROYW1lPSJGcmVuY2ggSG9ybnMiLz48UHJlc2V0IHNlbGVjdGVk
        QmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSI2MSIgcHJlc2V0SW5kZXg9IjYxIiBwcmVzZXROYW1lPSJCcmFzcyBTZWN0aW9uIi8+PFByZXNldCBzZWxlY3RlZEJhbms9
        IjAiIHNlbGVjdGVkUHJvZ3JhbT0iNjIiIHByZXNldEluZGV4PSI2MiIgcHJlc2V0TmFtZT0iU3ludGggQnJhc3MgMSIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBz
        ZWxlY3RlZFByb2dyYW09IjYzIiBwcmVzZXRJbmRleD0iNjMiIHByZXNldE5hbWU9IlN5bnRoIEJyYXNzIDIiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0
        ZWRQcm9ncmFtPSI2NCIgcHJlc2V0SW5kZXg9IjY0IiBwcmVzZXROYW1lPSJTb3ByYW5vIFNheCIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dy
        YW09IjY1IiBwcmVzZXRJbmRleD0iNjUiIHByZXNldE5hbWU9IkFsdG8gU2F4Ii8+PFByZXNldCBzZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0iNjYiIHBy
        ZXNldEluZGV4PSI2NiIgcHJlc2V0TmFtZT0iVGVub3IgU2F4Ii8+PFByZXNldCBzZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0iNjciIHByZXNldEluZGV4
        PSI2NyIgcHJlc2V0TmFtZT0iQmFyaXRvbmUgU2F4Ii8+PFByZXNldCBzZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0iNjgiIHByZXNldEluZGV4PSI2OCIg
        cHJlc2V0TmFtZT0iT2JvZSIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjY5IiBwcmVzZXRJbmRleD0iNjkiIHByZXNldE5hbWU9IkVu
        Z2xpc2ggSG9ybiIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjcwIiBwcmVzZXRJbmRleD0iNzAiIHByZXNldE5hbWU9IkJhc3Nvb24i
        Lz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSI3MSIgcHJlc2V0SW5kZXg9IjcxIiBwcmVzZXROYW1lPSJDbGFyaW5ldCIvPjxQcmVzZXQg
        c2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjcyIiBwcmVzZXRJbmRleD0iNzIiIHByZXNldE5hbWU9IlBpY2NvbG8iLz48UHJlc2V0IHNlbGVjdGVkQmFu
        az0iMCIgc2VsZWN0ZWRQcm9ncmFtPSI3MyIgcHJlc2V0SW5kZXg9IjczIiBwcmVzZXROYW1lPSJGbHV0ZSIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3Rl
        ZFByb2dyYW09Ijc0IiBwcmVzZXRJbmRleD0iNzQiIHByZXNldE5hbWU9IlJlY29yZGVyIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0i
        NzUiIHByZXNldEluZGV4PSI3NSIgcHJlc2V0TmFtZT0iUGFuIEZsdXRlIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0iNzYiIHByZXNl
        dEluZGV4PSI3NiIgcHJlc2V0TmFtZT0iQm90dGxlIENoaWZmIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0iNzciIHByZXNldEluZGV4
        PSI3NyIgcHJlc2V0TmFtZT0iU2hha3VoYWNoaSIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09Ijc4IiBwcmVzZXRJbmRleD0iNzgiIHBy
        ZXNldE5hbWU9IldoaXN0bGUiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSI3OSIgcHJlc2V0SW5kZXg9Ijc5IiBwcmVzZXROYW1lPSJP
        Y2FyaW5hIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0iODAiIHByZXNldEluZGV4PSI4MCIgcHJlc2V0TmFtZT0iU3F1YXJlIExlYWQi
        Lz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSI4MSIgcHJlc2V0SW5kZXg9IjgxIiBwcmVzZXROYW1lPSJTYXcgV2F2ZSIvPjxQcmVzZXQg
        c2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjgyIiBwcmVzZXRJbmRleD0iODIiIHByZXNldE5hbWU9IkNhbGxpb3BlIExlYWQiLz48UHJlc2V0IHNlbGVj
        dGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSI4MyIgcHJlc2V0SW5kZXg9IjgzIiBwcmVzZXROYW1lPSJDaGlmZmVyIExlYWQiLz48UHJlc2V0IHNlbGVjdGVkQmFu
        az0iMCIgc2VsZWN0ZWRQcm9ncmFtPSI4NCIgcHJlc2V0SW5kZXg9Ijg0IiBwcmVzZXROYW1lPSJDaGFyYW5nIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjAiIHNlbGVj
        dGVkUHJvZ3JhbT0iODUiIHByZXNldEluZGV4PSI4NSIgcHJlc2V0TmFtZT0iU29sbyBWb3giLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFt
        PSI4NiIgcHJlc2V0SW5kZXg9Ijg2IiBwcmVzZXROYW1lPSJGaWZ0aCBTYXd0b290aCBXYXZlIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3Jh
        bT0iODciIHByZXNldEluZGV4PSI4NyIgcHJlc2V0TmFtZT0iQmFzcyAmYW1wOyBMZWFkIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0i
        ODgiIHByZXNldEluZGV4PSI4OCIgcHJlc2V0TmFtZT0iRmFudGFzaWEiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSI4OSIgcHJlc2V0
        SW5kZXg9Ijg5IiBwcmVzZXROYW1lPSJXYXJtIFBhZCIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjkwIiBwcmVzZXRJbmRleD0iOTAi
        IHByZXNldE5hbWU9IlBvbHlzeW50aCIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjkxIiBwcmVzZXRJbmRleD0iOTEiIHByZXNldE5h
        bWU9IlNwYWNlIFZvaWNlIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0iOTIiIHByZXNldEluZGV4PSI5MiIgcHJlc2V0TmFtZT0iQm93
        ZWQgR2xhc3MiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSI5MyIgcHJlc2V0SW5kZXg9IjkzIiBwcmVzZXROYW1lPSJNZXRhbCBQYWQi
        Lz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSI5NCIgcHJlc2V0SW5kZXg9Ijk0IiBwcmVzZXROYW1lPSJIYWxvIFBhZCIvPjxQcmVzZXQg
        c2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09Ijk1IiBwcmVzZXRJbmRleD0iOTUiIHByZXNldE5hbWU9IlN3ZWVwIFBhZCIvPjxQcmVzZXQgc2VsZWN0ZWRC
        YW5rPSIwIiBzZWxlY3RlZFByb2dyYW09Ijk2IiBwcmVzZXRJbmRleD0iOTYiIHByZXNldE5hbWU9IkljZSBSYWluIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjAiIHNl
        bGVjdGVkUHJvZ3JhbT0iOTciIHByZXNldEluZGV4PSI5NyIgcHJlc2V0TmFtZT0iU291bmR0cmFjayIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFBy
        b2dyYW09Ijk4IiBwcmVzZXRJbmRleD0iOTgiIHByZXNldE5hbWU9IkNyeXN0YWwiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSI5OSIg
        cHJlc2V0SW5kZXg9Ijk5IiBwcmVzZXROYW1lPSJBdG1vc3BoZXJlIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0iMTAwIiBwcmVzZXRJ
        bmRleD0iMTAwIiBwcmVzZXROYW1lPSJCcmlnaHRuZXNzIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0iMTAxIiBwcmVzZXRJbmRleD0i
        MTAxIiBwcmVzZXROYW1lPSJHb2JsaW4iLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSIxMDIiIHByZXNldEluZGV4PSIxMDIiIHByZXNl
        dE5hbWU9IkVjaG8gRHJvcHMiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSIxMDMiIHByZXNldEluZGV4PSIxMDMiIHByZXNldE5hbWU9
        IlN0YXIgVGhlbWUiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSIxMDQiIHByZXNldEluZGV4PSIxMDQiIHByZXNldE5hbWU9IlNpdGFy
        Ii8+PFByZXNldCBzZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0iMTA1IiBwcmVzZXRJbmRleD0iMTA1IiBwcmVzZXROYW1lPSJCYW5qbyIvPjxQcmVzZXQg
        c2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjEwNiIgcHJlc2V0SW5kZXg9IjEwNiIgcHJlc2V0TmFtZT0iU2hhbWlzZW4iLz48UHJlc2V0IHNlbGVjdGVk
        QmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSIxMDciIHByZXNldEluZGV4PSIxMDciIHByZXNldE5hbWU9IktvdG8iLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2Vs
        ZWN0ZWRQcm9ncmFtPSIxMDgiIHByZXNldEluZGV4PSIxMDgiIHByZXNldE5hbWU9IkthbGltYmEiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9n
        cmFtPSIxMDkiIHByZXNldEluZGV4PSIxMDkiIHByZXNldE5hbWU9IkJhZ1BpcGUiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSIxMTAi
        IHByZXNldEluZGV4PSIxMTAiIHByZXNldE5hbWU9IkZpZGRsZSIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjExMSIgcHJlc2V0SW5k
        ZXg9IjExMSIgcHJlc2V0TmFtZT0iU2hlbmFpIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0iMTEyIiBwcmVzZXRJbmRleD0iMTEyIiBw
        cmVzZXROYW1lPSJUaW5rZXIgQmVsbCIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjExMyIgcHJlc2V0SW5kZXg9IjExMyIgcHJlc2V0
        TmFtZT0iQWdvZ28iLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSIxMTQiIHByZXNldEluZGV4PSIxMTQiIHByZXNldE5hbWU9IlN0ZWVs
        IERydW1zIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0iMTE1IiBwcmVzZXRJbmRleD0iMTE1IiBwcmVzZXROYW1lPSJXb29kYmxvY2si
        Lz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSIxMTYiIHByZXNldEluZGV4PSIxMTYiIHByZXNldE5hbWU9IlRhaWtvIERydW0iLz48UHJl
        c2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSIxMTciIHByZXNldEluZGV4PSIxMTciIHByZXNldE5hbWU9Ik1lbG9kaWMgVG9tIi8+PFByZXNldCBz
        ZWxlY3RlZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0iMTE4IiBwcmVzZXRJbmRleD0iMTE4IiBwcmVzZXROYW1lPSJTeW50aCBEcnVtIi8+PFByZXNldCBzZWxlY3Rl
        ZEJhbms9IjAiIHNlbGVjdGVkUHJvZ3JhbT0iMTE5IiBwcmVzZXRJbmRleD0iMTE5IiBwcmVzZXROYW1lPSJSZXZlcnNlIEN5bWJhbCIvPjxQcmVzZXQgc2VsZWN0ZWRC
        YW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjEyMCIgcHJlc2V0SW5kZXg9IjEyMCIgcHJlc2V0TmFtZT0iRnJldCBOb2lzZSIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIw
        IiBzZWxlY3RlZFByb2dyYW09IjEyMSIgcHJlc2V0SW5kZXg9IjEyMSIgcHJlc2V0TmFtZT0iQnJlYXRoIE5vaXNlIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjAiIHNl
        bGVjdGVkUHJvZ3JhbT0iMTIyIiBwcmVzZXRJbmRleD0iMTIyIiBwcmVzZXROYW1lPSJTZWEgU2hvcmUiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQ
        cm9ncmFtPSIxMjMiIHByZXNldEluZGV4PSIxMjMiIHByZXNldE5hbWU9IkJpcmQgVHdlZXQiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFt
        PSIxMjQiIHByZXNldEluZGV4PSIxMjQiIHByZXNldE5hbWU9IlRlbGVwaG9uZSIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjEyNSIg
        cHJlc2V0SW5kZXg9IjEyNSIgcHJlc2V0TmFtZT0iSGVsaWNvcHRlciIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIwIiBzZWxlY3RlZFByb2dyYW09IjEyNiIgcHJlc2V0
        SW5kZXg9IjEyNiIgcHJlc2V0TmFtZT0iQXBwbGF1c2UiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMCIgc2VsZWN0ZWRQcm9ncmFtPSIxMjciIHByZXNldEluZGV4PSIx
        MjciIHByZXNldE5hbWU9Ikd1biBTaG90Ii8+PFByZXNldCBzZWxlY3RlZEJhbms9IjgiIHNlbGVjdGVkUHJvZ3JhbT0iNCIgcHJlc2V0SW5kZXg9IjEyOCIgcHJlc2V0
        TmFtZT0iRGV0dW5lZCBFUCAxIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjgiIHNlbGVjdGVkUHJvZ3JhbT0iNSIgcHJlc2V0SW5kZXg9IjEyOSIgcHJlc2V0TmFtZT0i
        RGV0dW5lZCBFUCAyIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjgiIHNlbGVjdGVkUHJvZ3JhbT0iNiIgcHJlc2V0SW5kZXg9IjEzMCIgcHJlc2V0TmFtZT0iQ291cGxl
        ZCBIYXJwc2ljaG9yZCIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSI4IiBzZWxlY3RlZFByb2dyYW09IjE0IiBwcmVzZXRJbmRleD0iMTMxIiBwcmVzZXROYW1lPSJDaHVy
        Y2ggQmVsbCIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSI4IiBzZWxlY3RlZFByb2dyYW09IjE2IiBwcmVzZXRJbmRleD0iMTMyIiBwcmVzZXROYW1lPSJEZXR1bmVkIE9y
        Z2FuIDEiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iOCIgc2VsZWN0ZWRQcm9ncmFtPSIxNyIgcHJlc2V0SW5kZXg9IjEzMyIgcHJlc2V0TmFtZT0iRGV0dW5lZCBPcmdh
        biAyIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjgiIHNlbGVjdGVkUHJvZ3JhbT0iMTkiIHByZXNldEluZGV4PSIxMzQiIHByZXNldE5hbWU9IkNodXJjaCBPcmdhbiAy
        Ii8+PFByZXNldCBzZWxlY3RlZEJhbms9IjgiIHNlbGVjdGVkUHJvZ3JhbT0iMjEiIHByZXNldEluZGV4PSIxMzUiIHByZXNldE5hbWU9Ikl0YWxpYW4gQWNjb3JkaW9u
        Ii8+PFByZXNldCBzZWxlY3RlZEJhbms9IjgiIHNlbGVjdGVkUHJvZ3JhbT0iMjQiIHByZXNldEluZGV4PSIxMzYiIHByZXNldE5hbWU9IlVrdWxlbGUiLz48UHJlc2V0
        IHNlbGVjdGVkQmFuaz0iOCIgc2VsZWN0ZWRQcm9ncmFtPSIyNSIgcHJlc2V0SW5kZXg9IjEzNyIgcHJlc2V0TmFtZT0iMTIgU3RyaW5nIEd1aXRhciIvPjxQcmVzZXQg
        c2VsZWN0ZWRCYW5rPSI4IiBzZWxlY3RlZFByb2dyYW09IjI2IiBwcmVzZXRJbmRleD0iMTM4IiBwcmVzZXROYW1lPSJIYXdhaWlhbiBHdWl0YXIiLz48UHJlc2V0IHNl
        bGVjdGVkQmFuaz0iOCIgc2VsZWN0ZWRQcm9ncmFtPSIyOCIgcHJlc2V0SW5kZXg9IjEzOSIgcHJlc2V0TmFtZT0iRnVuayBHdWl0YXIiLz48UHJlc2V0IHNlbGVjdGVk
        QmFuaz0iOCIgc2VsZWN0ZWRQcm9ncmFtPSIzMCIgcHJlc2V0SW5kZXg9IjE0MCIgcHJlc2V0TmFtZT0iRmVlZGJhY2sgR3VpdGFyIi8+PFByZXNldCBzZWxlY3RlZEJh
        bms9IjgiIHNlbGVjdGVkUHJvZ3JhbT0iMzEiIHByZXNldEluZGV4PSIxNDEiIHByZXNldE5hbWU9Ikd1aXRhciBGZWVkYmFjayIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5r
        PSI4IiBzZWxlY3RlZFByb2dyYW09IjM4IiBwcmVzZXRJbmRleD0iMTQyIiBwcmVzZXROYW1lPSJTeW50aCBCYXNzIDMiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iOCIg
        c2VsZWN0ZWRQcm9ncmFtPSIzOSIgcHJlc2V0SW5kZXg9IjE0MyIgcHJlc2V0TmFtZT0iU3ludGggQmFzcyA0Ii8+PFByZXNldCBzZWxlY3RlZEJhbms9IjgiIHNlbGVj
        dGVkUHJvZ3JhbT0iNDAiIHByZXNldEluZGV4PSIxNDQiIHByZXNldE5hbWU9IlNsb3cgVmlvbGluIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjgiIHNlbGVjdGVkUHJv
        Z3JhbT0iNDgiIHByZXNldEluZGV4PSIxNDUiIHByZXNldE5hbWU9Ik9yY2hlc3RyYWwgUGFkIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjgiIHNlbGVjdGVkUHJvZ3Jh
        bT0iNTAiIHByZXNldEluZGV4PSIxNDYiIHByZXNldE5hbWU9IlN5bnRoIFN0cmluZ3MgMyIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSI4IiBzZWxlY3RlZFByb2dyYW09
        IjYxIiBwcmVzZXRJbmRleD0iMTQ3IiBwcmVzZXROYW1lPSJCcmFzcyAyIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjgiIHNlbGVjdGVkUHJvZ3JhbT0iNjIiIHByZXNl
        dEluZGV4PSIxNDgiIHByZXNldE5hbWU9IlN5bnRoIEJyYXNzIDMiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iOCIgc2VsZWN0ZWRQcm9ncmFtPSI2MyIgcHJlc2V0SW5k
        ZXg9IjE0OSIgcHJlc2V0TmFtZT0iU3ludGggQnJhc3MgNCIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSI4IiBzZWxlY3RlZFByb2dyYW09IjgwIiBwcmVzZXRJbmRleD0i
        MTUwIiBwcmVzZXROYW1lPSJTaW5lIFdhdmUiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iOCIgc2VsZWN0ZWRQcm9ncmFtPSIxMDciIHByZXNldEluZGV4PSIxNTEiIHBy
        ZXNldE5hbWU9IlRhaXNobyBLb3RvIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjgiIHNlbGVjdGVkUHJvZ3JhbT0iMTE1IiBwcmVzZXRJbmRleD0iMTUyIiBwcmVzZXRO
        YW1lPSJDYXN0YW5ldHMiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iOCIgc2VsZWN0ZWRQcm9ncmFtPSIxMTYiIHByZXNldEluZGV4PSIxNTMiIHByZXNldE5hbWU9IkNv
        bmNlcnQgQmFzcyBEcnVtIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjgiIHNlbGVjdGVkUHJvZ3JhbT0iMTE3IiBwcmVzZXRJbmRleD0iMTU0IiBwcmVzZXROYW1lPSJN
        ZWxvIFRvbSAyIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjgiIHNlbGVjdGVkUHJvZ3JhbT0iMTE4IiBwcmVzZXRJbmRleD0iMTU1IiBwcmVzZXROYW1lPSI4MDggVG9t
        Ii8+PFByZXNldCBzZWxlY3RlZEJhbms9IjkiIHNlbGVjdGVkUHJvZ3JhbT0iMTI1IiBwcmVzZXRJbmRleD0iMTU2IiBwcmVzZXROYW1lPSJCdXJzdCBOb2lzZSIvPjxQ
        cmVzZXQgc2VsZWN0ZWRCYW5rPSIxNiIgc2VsZWN0ZWRQcm9ncmFtPSIyNSIgcHJlc2V0SW5kZXg9IjE1NyIgcHJlc2V0TmFtZT0iTWFuZG9saW4iLz48UHJlc2V0IHNl
        bGVjdGVkQmFuaz0iMTI4IiBzZWxlY3RlZFByb2dyYW09IjAiIHByZXNldEluZGV4PSIxNTgiIHByZXNldE5hbWU9IlN0YW5kYXJkIi8+PFByZXNldCBzZWxlY3RlZEJh
        bms9IjEyOCIgc2VsZWN0ZWRQcm9ncmFtPSIxIiBwcmVzZXRJbmRleD0iMTU5IiBwcmVzZXROYW1lPSJTdGFuZGFyZCAxIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjEy
        OCIgc2VsZWN0ZWRQcm9ncmFtPSIyIiBwcmVzZXRJbmRleD0iMTYwIiBwcmVzZXROYW1lPSJTdGFuZGFyZCAyIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjEyOCIgc2Vs
        ZWN0ZWRQcm9ncmFtPSIzIiBwcmVzZXRJbmRleD0iMTYxIiBwcmVzZXROYW1lPSJTdGFuZGFyZCAzIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjEyOCIgc2VsZWN0ZWRQ
        cm9ncmFtPSI0IiBwcmVzZXRJbmRleD0iMTYyIiBwcmVzZXROYW1lPSJTdGFuZGFyZCA0Ii8+PFByZXNldCBzZWxlY3RlZEJhbms9IjEyOCIgc2VsZWN0ZWRQcm9ncmFt
        PSI1IiBwcmVzZXRJbmRleD0iMTYzIiBwcmVzZXROYW1lPSJTdGFuZGFyZCA1Ii8+PFByZXNldCBzZWxlY3RlZEJhbms9IjEyOCIgc2VsZWN0ZWRQcm9ncmFtPSI2IiBw
        cmVzZXRJbmRleD0iMTY0IiBwcmVzZXROYW1lPSJTdGFuZGFyZCA2Ii8+PFByZXNldCBzZWxlY3RlZEJhbms9IjEyOCIgc2VsZWN0ZWRQcm9ncmFtPSI3IiBwcmVzZXRJ
        bmRleD0iMTY1IiBwcmVzZXROYW1lPSJTdGFuZGFyZCA3Ii8+PFByZXNldCBzZWxlY3RlZEJhbms9IjEyOCIgc2VsZWN0ZWRQcm9ncmFtPSI4IiBwcmVzZXRJbmRleD0i
        MTY2IiBwcmVzZXROYW1lPSJSb29tIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjEyOCIgc2VsZWN0ZWRQcm9ncmFtPSI5IiBwcmVzZXRJbmRleD0iMTY3IiBwcmVzZXRO
        YW1lPSJSb29tIDEiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMTI4IiBzZWxlY3RlZFByb2dyYW09IjEwIiBwcmVzZXRJbmRleD0iMTY4IiBwcmVzZXROYW1lPSJSb29t
        IDIiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMTI4IiBzZWxlY3RlZFByb2dyYW09IjExIiBwcmVzZXRJbmRleD0iMTY5IiBwcmVzZXROYW1lPSJSb29tIDMiLz48UHJl
        c2V0IHNlbGVjdGVkQmFuaz0iMTI4IiBzZWxlY3RlZFByb2dyYW09IjEyIiBwcmVzZXRJbmRleD0iMTcwIiBwcmVzZXROYW1lPSJSb29tIDQiLz48UHJlc2V0IHNlbGVj
        dGVkQmFuaz0iMTI4IiBzZWxlY3RlZFByb2dyYW09IjEzIiBwcmVzZXRJbmRleD0iMTcxIiBwcmVzZXROYW1lPSJSb29tIDUiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0i
        MTI4IiBzZWxlY3RlZFByb2dyYW09IjE0IiBwcmVzZXRJbmRleD0iMTcyIiBwcmVzZXROYW1lPSJSb29tIDYiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMTI4IiBzZWxl
        Y3RlZFByb2dyYW09IjE1IiBwcmVzZXRJbmRleD0iMTczIiBwcmVzZXROYW1lPSJSb29tIDciLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMTI4IiBzZWxlY3RlZFByb2dy
        YW09IjE2IiBwcmVzZXRJbmRleD0iMTc0IiBwcmVzZXROYW1lPSJQb3dlciIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIxMjgiIHNlbGVjdGVkUHJvZ3JhbT0iMTciIHBy
        ZXNldEluZGV4PSIxNzUiIHByZXNldE5hbWU9IlBvd2VyIDEiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMTI4IiBzZWxlY3RlZFByb2dyYW09IjE4IiBwcmVzZXRJbmRl
        eD0iMTc2IiBwcmVzZXROYW1lPSJQb3dlciAyIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjEyOCIgc2VsZWN0ZWRQcm9ncmFtPSIxOSIgcHJlc2V0SW5kZXg9IjE3NyIg
        cHJlc2V0TmFtZT0iUG93ZXIgMyIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIxMjgiIHNlbGVjdGVkUHJvZ3JhbT0iMjQiIHByZXNldEluZGV4PSIxNzgiIHByZXNldE5h
        bWU9IkVsZWN0cm9uaWMiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMTI4IiBzZWxlY3RlZFByb2dyYW09IjI1IiBwcmVzZXRJbmRleD0iMTc5IiBwcmVzZXROYW1lPSJU
        Ui04MDgiLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMTI4IiBzZWxlY3RlZFByb2dyYW09IjMyIiBwcmVzZXRJbmRleD0iMTgwIiBwcmVzZXROYW1lPSJKYXp6Ii8+PFBy
        ZXNldCBzZWxlY3RlZEJhbms9IjEyOCIgc2VsZWN0ZWRQcm9ncmFtPSIzMyIgcHJlc2V0SW5kZXg9IjE4MSIgcHJlc2V0TmFtZT0iSmF6eiAxIi8+PFByZXNldCBzZWxl
        Y3RlZEJhbms9IjEyOCIgc2VsZWN0ZWRQcm9ncmFtPSIzNCIgcHJlc2V0SW5kZXg9IjE4MiIgcHJlc2V0TmFtZT0iSmF6eiAyIi8+PFByZXNldCBzZWxlY3RlZEJhbms9
        IjEyOCIgc2VsZWN0ZWRQcm9ncmFtPSIzNSIgcHJlc2V0SW5kZXg9IjE4MyIgcHJlc2V0TmFtZT0iSmF6eiAzIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjEyOCIgc2Vs
        ZWN0ZWRQcm9ncmFtPSIzNiIgcHJlc2V0SW5kZXg9IjE4NCIgcHJlc2V0TmFtZT0iSmF6eiA0Ii8+PFByZXNldCBzZWxlY3RlZEJhbms9IjEyOCIgc2VsZWN0ZWRQcm9n
        cmFtPSI0MCIgcHJlc2V0SW5kZXg9IjE4NSIgcHJlc2V0TmFtZT0iQnJ1c2giLz48UHJlc2V0IHNlbGVjdGVkQmFuaz0iMTI4IiBzZWxlY3RlZFByb2dyYW09IjQxIiBw
        cmVzZXRJbmRleD0iMTg2IiBwcmVzZXROYW1lPSJCcnVzaCAxIi8+PFByZXNldCBzZWxlY3RlZEJhbms9IjEyOCIgc2VsZWN0ZWRQcm9ncmFtPSI0MiIgcHJlc2V0SW5k
        ZXg9IjE4NyIgcHJlc2V0TmFtZT0iQnJ1c2ggMiIvPjxQcmVzZXQgc2VsZWN0ZWRCYW5rPSIxMjgiIHNlbGVjdGVkUHJvZ3JhbT0iNDgiIHByZXNldEluZGV4PSIxODgi
        IHByZXNldE5hbWU9Ik9yY2hlc3RyYSBLaXQiLz48L1ByZXNldExpc3Q+PC9JbXBvcnRlZExpYnJhcnk+PC9JbXBvcnRlZExpYnJhcmllcz48RmF2b3JpdGVJbnN0cnVt
        ZW50cy8+PFNvdW5kUHJlc2V0cy8+PC9Mb2dpY1NGMlBsYXllclN0YXRlPgAAAAAAAAAAAEpVQ0VQcml2YXRlRGF0YQABAUJ5cGFzcwABAQMAHQAAAAAAAABKVUNFUHJp
        dmF0ZURhdGEAAAAAAAAAAA==
        AAAQAAAA
      >
      FLOATPOS 0 0 0 0
      FXID {5296A64C-9008-595A-7B66-DB8EAEF52238}
      WAK 0 0
    >
    <ITEM
      POSITION 0
      SNAPOFFS 0
      LENGTH 8
      LOOP 1
      ALLTAKES 0
      FADEIN 1 0 0 1 0 0 0
      FADEOUT 1 0 0 1 0 0 0
      MUTE 0 0
      SEL 1
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
        E 120 80 1a 00
        E 0 90 1d 60
        E 120 80 1d 00
        E 120 90 23 60
        E 120 80 23 00
        E 0 90 1d 60
        E 120 80 1d 00
        E 0 90 21 60
        E 120 80 21 00
        E 720 90 18 60
        E 120 80 18 00
        e 480 90 39 60
        e 120 80 39 00
        E 120 90 28 60
        E 120 80 28 00
        E 240 90 32 60
        E 120 80 32 00
        E 1080 b0 7b 00
        CCINTERP 32
        CHASE_CC_TAKEOFFS 1
        GUID {DF32DB9F-316A-543C-9FA7-B160F4A94992}
        IGNTEMPO 0 120 4 4
        SRCCOLOR 1
        EVTFILTER 0 -1 -1 -1 -1 0 0 0 0 -1 -1 -1 -1 0 -1 0 -1 -1
        VELLANE -1 100 0 0 1
        CFGEDITVIEW 0 0.453906 61 12 0 0 0 0 0 0.5
        KEYSNAP 0
        TRACKSEL 0
        CFGEDIT 1 1 0 1 0 0 1 1 1 1 1 0.125 60 98 2118 1229 0 0 0 0 0 0 0 0 0 0.5 0 0 1 64
      >
    >
  >
>
`;
        return body;
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
