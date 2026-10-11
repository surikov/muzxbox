"use strict";
const parser = require('./parser');
const fs = require('fs');
const ReaperBase = require('./reaper-base');
const ReaperAutomationTrack = require('./reaper-automation-track');
const path = require('path');
const { VstB64 } = require('./vst-utils');
const { base64StringByteLength } = require('./base64');
const emptys = fs.readFileSync(path.join(__dirname, '../data/empty.RPP'), 'utf8');
class ReaperProject extends ReaperBase {
    constructor(obj) {
        if (obj)
            super(obj);
        else {
            const empty = parser.parse(emptys);
            super(empty);
        }
    }
    addTrack(trackObj) {
        if (!(trackObj instanceof ReaperTrack))
            throw new TypeError('trackObj has to be of type ReaperTrack');
        return this.add(trackObj);
    }
}
class ReaperTrack extends ReaperBase {
    constructor(obj) {
        if (!obj) {
            obj = parser.parse(`<TRACK
>`);
        }
        super(obj);
    }
    addReceive({ sourceTrackNumber = 0, gain = 1, pan = 0, name = '', sourceChannel = 0, destinationChannel = 0 }) {
        const receive = this.createStruct('AUXRECV', this.contents.length);
        receive.params = [
            sourceTrackNumber,
            0,
            gain,
            pan,
            0,
            0,
            0,
            sourceChannel,
            destinationChannel,
            '-1:U',
            0,
            -1,
            name
        ];
        return receive;
    }
    addItem(obj) {
        if (!(obj instanceof ReaperItem))
            throw new TypeError('obj has to be of type ReaperItem');
        return this.add(obj);
    }
}
class ReaperItem extends ReaperBase {
    constructor(obj) {
        if (!obj) {
            obj = parser.parse(`<ITEM
>`);
        }
        super(obj);
    }
    reverseSources() {
        let found = 0;
        this.contents.forEach((obj, i, all) => {
            if (obj.token === 'SOURCE') {
                let source = obj;
                if (!(obj instanceof ReaperSource)) {
                    source = new ReaperSource(obj);
                    all[i] = source;
                }
                if (source.isMidiSource()) {
                    const msg = 'cannot reverse a `<SOURCE MIDI` object';
                    console.warn('WARNING: rppp ' + msg);
                    return;
                }
                source.makeSectionSource();
                const childSource = source.getStructByToken('SOURCE');
                if (!childSource) {
                    const msg = 'tried to reverse a SOURCE SECTION with no children';
                    console.warn('WARNING: rpp ' + msg);
                    return;
                }
                const modeStruct = source.getStructByToken('MODE');
                if (!modeStruct)
                    source.getOrCreateStructByToken('MODE').params[0] = 2;
                else
                    source.getOrCreateStructByToken('MODE').params[0] = 3;
                if (childSource.getStructByToken('SOURCE', 1)) {
                    const msg = 'reversed only the first SOURCE object in a child source ' + source.dump();
                    console.warn('WARNING: rpp ' + msg);
                }
                if (++found > 1) {
                    console.warn('WARNING: rpp reversed an item with more than one immediate child SOURCE.');
                }
            }
        });
    }
}
class ReaperSource extends ReaperBase {
    constructor(obj) {
        if (!obj) {
            obj = parser.parse(`<SOURCE WAVE
>`);
        }
        super(obj);
        if (this.isMidiSource())
            this.cleanMidi();
    }
    isWaveSource() { return this.params[0] === 'WAVE'; }
    isMidiSource() { return this.params[0] === 'MIDI'; }
    isMp3Source() { return this.params[0] === 'MP3'; }
    isSectionSource() { return this.params[0] === 'SECTION'; }
    makeWaveSource() {
        if (this.isSectionSource()) {
            throw new Error('Cannot convert `<SOURCE SECTION` object to `<SOURCE WAV`');
        }
        this.params[0] = 'WAVE';
        return this;
    }
    makeMidiSource() {
        if (this.isSectionSource()) {
            throw new Error('Cannot convert `<SOURCE SECTION` object to `<SOURCE MIDI`');
        }
        this.params[0] = 'MIDI';
        this.cleanMidi();
        return this;
    }
    makeMp3Source() {
        if (this.isSectionSource()) {
            throw new Error('Cannot convert `<SOURCE SECTION` object to `<SOURCE MP3`');
        }
        this.params[0] = 'MP3';
        return this;
    }
    makeSectionSource() {
        if (this.isSectionSource())
            return this;
        if (this.getStructByToken('SOURCE')) {
            console.warn('WARNING: rppp called .makeSectionSource on an object that already has one or more SOURCE children. This may result in bugs');
        }
        const childSource = new ReaperSource(this);
        this.params = ['SECTION'];
        this.contents = [];
        this.getOrCreateStructByToken('LENGTH').params[0] = 0;
        this.getOrCreateStructByToken('MODE').params[0] = 1;
        this.getOrCreateStructByToken('STARTPOS').params[0] = 0;
        this.contents.push(childSource);
        return this;
    }
    cleanMidi() {
        if (!this.isMidiSource())
            throw new Error('cleanMidi only works on MIDI sources');
        for (let i = 0; i < this.contents.length; i++) {
            if (['E', 'e', 'X', 'x', 'Em', 'em', 'Xm', 'xm'].indexOf(this.contents[i].token) >= 0) {
                for (let j = 1; j < 4; j++) {
                    this.contents[i].params[j] = this.contents[i].params[j].toString();
                    if (this.contents[i].params[j].length < 2) {
                        this.contents[i].params[j] = '0' + this.contents[i].params[j];
                    }
                }
            }
        }
        return this.contents;
    }
    setMidiNotes(notes, lengthInWholeNotes) {
        this.makeMidiSource();
        this.contents = ReaperSource.midiMessagesToContents(notes, lengthInWholeNotes);
    }
    static midiMessagesToContents(midiArray, lengthInWholeNotes) {
        const ticksPerQuarterNote = 960;
        const ticksPerWholeNote = ticksPerQuarterNote * 4;
        const insertAllNotesOff = typeof lengthInWholeNotes === 'number';
        const allNotesOffTicks = insertAllNotesOff ? Math.ceil(ticksPerWholeNote * lengthInWholeNotes) : 0;
        const midiMessage = [{ token: 'HASDATA', params: [1, ticksPerQuarterNote, 'QN'] }];
        const note = (offset, channelAndStatus, midin, midiv) => {
            offset = Math.round(offset);
            const res = [];
            if (offset > Math.pow(2, 32) - 1) {
                res.push(offset - Math.pow(2, 32) - 1);
                res.push(Math.pow(2, 32) - 1);
            }
            else {
                res.push(offset);
            }
            res.push(channelAndStatus);
            res.push(midin);
            if (channelAndStatus[0] === '8')
                res.push('00');
            else
                res.push(midiv);
            return res;
        };
        const midiData = [];
        for (const note of midiArray) {
            if (!note.c)
                note.c = 0;
            if (!note.v)
                note.v = 64;
            const startTick = note.s * ticksPerWholeNote;
            const lengthTick = note.l * ticksPerWholeNote;
            midiData.push({ tick: startTick, status: '9', v: note.v, c: note.c, n: note.n });
            midiData.push({ tick: startTick + lengthTick, status: '8', v: note.v, c: note.c, n: note.n });
        }
        if (insertAllNotesOff)
            midiData.push({ tick: allNotesOffTicks, status: 'b0', byte1: '7b', byte2: '00' });
        midiData.sort(function compare(a, b) {
            return a.tick - b.tick;
        });
        let lastTickInt = 0;
        for (let i = 0; i < midiData.length; i++) {
            let midiByteS, midiByte1, midiByte2;
            if (Object.prototype.hasOwnProperty.call(midiData[i], 'byte1')) {
                midiByteS = midiData[i].status;
                midiByte1 = midiData[i].byte1;
                midiByte2 = midiData[i].byte2;
            }
            else {
                const channel = midiData[i].c.toString(16);
                if (channel.length !== 1)
                    throw new Error('midi channel has to be between 0 and 15');
                midiByteS = midiData[i].status + channel;
                midiByte1 = midiData[i].n.toString(16);
                if (midiByte1.length < 2)
                    midiByte1 = '0' + midiByte1;
                if (midiByte1.length > 2)
                    throw new Error('midi note has to be between 0 and 127');
                midiByte2 = midiData[i].v.toString(16);
                if (midiByte2.length < 2)
                    midiByte2 = '0' + midiByte2;
                if (midiByte2.length > 2)
                    throw new Error('midi velocity has to be between 0 and 127');
            }
            const offset = Math.round(midiData[i].tick - lastTickInt);
            lastTickInt += offset;
            let eventId = 'E';
            if (offset > Math.pow(2, 32) - 1) {
                eventId = 'X';
            }
            midiMessage.push({ token: eventId, params: note(offset, midiByteS, midiByte1, midiByte2) });
        }
        return midiMessage;
    }
}
class ReaperFXChain extends ReaperBase {
    constructor(obj) {
        if (!obj) {
            obj = parser.parse(`<FXCHAIN
  SHOW 0
  LASTSEL 0
  DOCKED 0
>`);
        }
        super(obj);
        const cleanedContents = [];
        let i = 0;
        for (; i < obj.contents.length; i++) {
            if (obj.contents[i].token === 'VST') {
                const VstObj = new ReaperVst(obj.contents[i]);
                if (i !== 0 && obj.contents[i - 1].token === 'BYPASS') {
                    VstObj.externalAttributes.BYPASS = obj.contents[i - 1].params;
                    cleanedContents.pop();
                }
                let toSkip = 0;
                for (let j = 1; j < 5 && i + j < obj.contents.length; j++) {
                    if (['BYPASS', 'PRESETNAME', 'FLOATPOS', 'FXID', 'WAK'].includes(obj.contents[i + j].token)) {
                        VstObj.externalAttributes[obj.contents[i + j].token] = obj.contents[i + j].params;
                        toSkip += 1;
                    }
                    if (obj.contents[i + j].token === 'VST' && j !== 0) {
                        break;
                    }
                }
                cleanedContents.push(VstObj);
                i += toSkip;
            }
            else {
                cleanedContents.push(obj.contents[i]);
            }
        }
        obj.contents = cleanedContents;
    }
    addVst(vstObj) {
        if (!(vstObj instanceof ReaperVst))
            throw new TypeError('vstObj has to be of type ReaperVst');
        return this.add(vstObj);
    }
}
class ReaperVst extends ReaperBase {
    constructor(obj) {
        if (!obj)
            obj = parser.parse('<VST\n>');
        super(obj);
        while (this.params.length < 5)
            this.params.push('');
        this.externalAttributes = obj.externalAttributes || {};
        if (!this.b64Chunks[0])
            this.b64Chunks[0] = new VstB64();
        if (!this.b64Chunks[1])
            this.b64Chunks[1] = '';
        if (!this.b64Chunks[2])
            this.b64Chunks[2] = 'AAAQAAAA';
        if (typeof this.b64Chunks[0] === 'string') {
            this.b64Chunks[0] = VstB64.fromString(this.b64Chunks[0]);
        }
    }
    dumpExternalAttribute(attr, indent) {
        if (typeof attr !== 'string')
            throw new TypeError('attr must be of type string');
        if (this.externalAttributes[attr]) {
            return ReaperBase.dumpStruct(attr, this.externalAttributes[attr], indent) + '\n';
        }
        return '';
    }
    dump(indent = 0) {
        const BYPASS = this.dumpExternalAttribute('BYPASS', indent);
        const PRESETNAME = this.dumpExternalAttribute('PRESETNAME', indent);
        const FLOATPOS = this.dumpExternalAttribute('FLOATPOS', indent);
        const FXID = this.dumpExternalAttribute('FXID', indent);
        const WAK = this.dumpExternalAttribute('WAK', indent);
        let misc = '';
        for (const o of this.contents) {
            if (o.contents) {
                misc += o.dump(indent) + '\n';
            }
            else {
                misc += ReaperBase.dumpStruct(o.token, o.params, indent + 1) + '\n';
            }
        }
        const indentStr = '  '.repeat(indent);
        const start = indentStr + '<' + this.token + ReaperBase.dumpParams(this.params) + '\n';
        const body = this.dumpB64Chunks(indent + 1);
        const end = indentStr + '>';
        const vstBody = start + body + end + '\n';
        return (BYPASS + vstBody + PRESETNAME + FLOATPOS + FXID + misc + WAK).slice(0, -1);
    }
    setVst2State(b64String) {
        if (typeof b64String !== 'string') {
            throw new Error('ReaperVst.setVst2State did not receive a string');
        }
        this.b64Chunks[0].stateSize = base64StringByteLength(b64String);
        this.b64Chunks[1] = b64String;
    }
    initializeRouting(numIn = 2, numOut = 2) {
        this.b64Chunks[0].numIn = numIn;
        this.b64Chunks[0].numOut = numOut;
    }
    setVst2IdNumber(idNumber) {
        this.b64Chunks[0].vst2IdNumber = idNumber;
    }
}
class ReaperPluginAutomation extends ReaperAutomationTrack {
    constructor(obj) {
        if (!obj) {
            obj = parser.parse(`<PARMENV
>`);
        }
        super(obj);
    }
}
class ReaperReceiveVolumeAutomation extends ReaperAutomationTrack {
    constructor(obj) {
        if (!obj) {
            obj = parser.parse(`<AUXVOLENV
>`);
        }
        super(obj);
    }
}
class ReaperNotes extends ReaperBase {
    constructor(obj) {
        if (!obj) {
            obj = parser.parse(`<NOTES
>`);
        }
        super(obj);
    }
    dump(indent = 0) {
        const notes = this.params[0].split('\n');
        const start = '  '.repeat(indent) + '<NOTES\n';
        let body = '';
        for (const line of notes) {
            body += '  '.repeat(indent + 1) + '|' + line + '\n';
        }
        const end = '  '.repeat(indent) + '>';
        return start + body + end;
    }
}
class ReaperVolumeAutomation extends ReaperAutomationTrack {
    constructor(obj) {
        if (!obj) {
            obj = parser.parse(`<VOLENV2
>`);
        }
        super(obj);
    }
}
class ReaperPanAutomation extends ReaperAutomationTrack {
    constructor(obj) {
        if (!obj) {
            obj = parser.parse(`<PANENV2
>`);
        }
        super(obj);
    }
}
class ReaperWidthAutomation extends ReaperAutomationTrack {
    constructor(obj) {
        if (!obj) {
            obj = parser.parse(`<WIDTHENV2
>`);
        }
        super(obj);
    }
}
class ReaperTempoTimeSigAutomation extends ReaperBase {
    constructor(obj) {
        if (!obj) {
            obj = parser.parse(`<TEMPOENVEX
  ACT 1 -1
  VIS 1 0 1
  LANEHEIGHT 0 0
  ARM 0
  DEFSHAPE 1 -1 -1
>`);
        }
        super(obj);
    }
    addTimeSignature(upper, lower, timeSeconds = 0) {
        if (typeof timeSeconds !== 'number')
            throw new TypeError('timeSeconds must be a number');
        if (typeof upper !== 'number' || upper < 1)
            throw new TypeError(`invalid time signature: ${upper}/${lower}`);
        if (typeof lower !== 'number' || lower < 1)
            throw new TypeError(`invalid time signature: ${upper}/${lower}`);
        const reaTimeSig = (lower << 16) + upper;
        this.add({ token: 'PT', params: [timeSeconds, 120, 1, reaTimeSig, 0, 3] });
    }
    addTempo(tempo, timeSeconds = 0, mode = 1) {
        if (typeof tempo !== 'number')
            throw new TypeError('tempo must be a number');
        if (typeof timeSeconds !== 'number')
            throw new TypeError('timeSeconds must be a number');
        if (![0, 1].includes(mode))
            throw new TypeError(`invalid time signature mode: ${mode}`);
        this.add({ token: 'PT', params: [timeSeconds, tempo, mode] });
    }
    addTempoTimeSignature(tempo, upper, lower, timeSeconds, mode = 1) {
        if (typeof tempo !== 'number')
            throw new TypeError('tempo must be a number');
        if (typeof upper !== 'number' || upper < 1)
            throw new TypeError(`invalid time signature: ${upper}/${lower}`);
        if (typeof lower !== 'number' || lower < 1)
            throw new TypeError(`invalid time signature: ${upper}/${lower}`);
        if (typeof timeSeconds !== 'number')
            throw new TypeError('timeSeconds must be a number');
        if (![0, 1].includes(mode))
            throw new TypeError(`invalid time signature mode: ${mode}`);
        const reaTimeSig = (lower << 16) + upper;
        this.add({ token: 'PT', params: [timeSeconds, 120, mode, reaTimeSig, 0, 1] });
    }
}
class Tests {
    dump(input, debugSettings) {
        switch (debugSettings.startRule) {
            case 'int':
                return ReaperBase.dumpNum(input);
            case 'decimal':
                return ReaperBase.dumpNum(input);
            case 'params':
                return ReaperBase.dumpParams(input);
            case 'string':
                return ReaperBase.dumpString(input);
            case 'midi':
                return ReaperSource.midiMessagesToContents(input);
            default:
                return input.dump();
        }
    }
}
module.exports = {
    ReaperProject,
    ReaperItem,
    ReaperVst,
    ReaperTrack,
    ReaperSource,
    ReaperNotes,
    Tests,
    ReaperFXChain,
    ReaperPluginAutomation,
    ReaperPanAutomation,
    ReaperReceiveVolumeAutomation,
    ReaperVolumeAutomation,
    ReaperWidthAutomation,
    ReaperTempoTimeSigAutomation
};
console.log('---test');
