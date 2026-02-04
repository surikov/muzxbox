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
        return this;
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
console.log('newMIDIx v1.0.1');
class MiniumMIDIx extends MZXBX_Plugin_UI {
    constructor() {
        super(false);
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
}
//# sourceMappingURL=mx.js.map