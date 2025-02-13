"use strict";
class MidiParser {
    constructor(arrayBuffer) {
        this.instrumentNamesArray = [];
        this.drumNamesArray = [];
        this.EVENT_META = 0xff;
        this.EVENT_SYSEX = 0xf0;
        this.EVENT_DIVSYSEX = 0xf7;
        this.EVENT_MIDI = 0x8;
        this.EVENT_META_SEQUENCE_NUMBER = 0x00;
        this.EVENT_META_TEXT = 0x01;
        this.EVENT_META_COPYRIGHT_NOTICE = 0x02;
        this.EVENT_META_TRACK_NAME = 0x03;
        this.EVENT_META_INSTRUMENT_NAME = 0x04;
        this.EVENT_META_LYRICS = 0x05;
        this.EVENT_META_MARKER = 0x06;
        this.EVENT_META_CUE_POINT = 0x07;
        this.EVENT_META_MIDI_CHANNEL_PREFIX = 0x20;
        this.EVENT_META_END_OF_TRACK = 0x2f;
        this.EVENT_META_SET_TEMPO = 0x51;
        this.EVENT_META_SMTPE_OFFSET = 0x54;
        this.EVENT_META_TIME_SIGNATURE = 0x58;
        this.EVENT_META_KEY_SIGNATURE = 0x59;
        this.EVENT_META_SEQUENCER_SPECIFIC = 0x7f;
        this.EVENT_MIDI_NOTE_OFF = 0x8;
        this.EVENT_MIDI_NOTE_ON = 0x9;
        this.EVENT_MIDI_NOTE_AFTERTOUCH = 0xa;
        this.EVENT_MIDI_CONTROLLER = 0xb;
        this.EVENT_MIDI_PROGRAM_CHANGE = 0xc;
        this.EVENT_MIDI_CHANNEL_AFTERTOUCH = 0xd;
        this.EVENT_MIDI_PITCH_BEND = 0xe;
        this.midiEventType = 0;
        this.midiEventChannel = 0;
        this.midiEventParam1 = 0;
        this.controller_BankSelectMSB = 0x00;
        this.controller_ModulationWheel = 0x01;
        this.controller_coarseDataEntrySlider = 0x06;
        this.controller_coarseVolume = 0x07;
        this.controller_ballance = 0x08;
        this.controller_pan = 0x0A;
        this.controller_expression = 0x0B;
        this.controller_BankSelectLSBGS = 0x20;
        this.controller_fineDataEntrySlider = 0x26;
        this.controller_ReverbLevel = 0x5B;
        this.controller_HoldPedal1 = 0x40;
        this.controller_TremoloDepth = 0x5C;
        this.controller_ChorusLevel = 0x5D;
        this.controller_NRPNParameterLSB = 0x62;
        this.controller_NRPNParameterMSB = 0x63;
        this.controller_fineRPN = 0x64;
        this.controller_coarseRPN = 0x65;
        this.controller_ResetAllControllers = 0x79;
        this.header = new MIDIFileHeader(arrayBuffer);
        this.parseTracks(arrayBuffer);
    }
    parseTracks(arrayBuffer) {
        var curIndex = this.header.HEADER_LENGTH;
        var trackCount = this.header.trackCount;
        this.parsedTracks = [];
        for (var i = 0; i < trackCount; i++) {
            var track = new MIDIFileTrack(arrayBuffer, curIndex);
            this.parsedTracks.push(track);
            curIndex = curIndex + track.trackLength + 8;
        }
        for (var i = 0; i < this.parsedTracks.length; i++) {
            this.parseTrackEvents(this.parsedTracks[i]);
        }
        this.parseNotes();
        this.simplifyAllBendPaths();
    }
    toText(arr) {
        let txt = '';
        try {
            let win1251decoder = new TextDecoder("windows-1251");
            let bytes = new Uint8Array(arr);
            let txt1251 = win1251decoder.decode(bytes);
            txt = txt1251;
        }
        catch (xx) {
            console.log(xx);
            var rr = '';
            for (var ii = 0; ii < arr.length; ii++) {
                rr = rr + String.fromCharCode(arr[ii]);
            }
            txt = rr;
        }
        txt = txt.replace("\\n", " ");
        txt = txt.replace("\\r", " ");
        txt = txt.replace("\\t", " ");
        txt = txt.replace("\n", " ");
        txt = txt.replace("\r", " ");
        txt = txt.replace("\t", " ");
        txt = txt.replace("\\", " ");
        txt = txt.replace("/", " ");
        txt = txt.replace("  ", " ");
        txt = txt.replace("  ", " ");
        txt = txt.replace("  ", " ");
        txt = txt.replace("  ", " ");
        txt = txt.replace("  ", " ");
        txt = txt.replace("  ", " ");
        txt = txt.replace("  ", " ");
        txt = txt.replace("  ", " ");
        txt = txt.replace("  ", " ");
        return txt;
    }
    findChordBefore(when, track, channel) {
        for (var i = 0; i < track.chords.length; i++) {
            var chord = track.chords[track.chords.length - i - 1];
            if (chord.when < when && chord.channel == channel) {
                return chord;
            }
        }
        return null;
    }
    findOpenedNoteBefore(firstPitch, when, track, channel) {
        var before = when;
        var chord = this.findChordBefore(before, track, channel);
        while (chord) {
            for (var i = 0; i < chord.notes.length; i++) {
                var note = chord.notes[i];
                if (!(note.closed)) {
                    if (firstPitch == note.basePitch) {
                        return { chord: chord, note: note };
                    }
                }
            }
            before = chord.when;
            chord = this.findChordBefore(before, track, channel);
        }
        return null;
    }
    takeChord(when, track, channel) {
        for (var i = 0; i < track.chords.length; i++) {
            if (track.chords[i].when == when && track.chords[i].channel == channel) {
                return track.chords[i];
            }
        }
        var ch = {
            when: when,
            channel: channel,
            notes: []
        };
        track.chords.push(ch);
        return ch;
    }
    takeOpenedNote(first, when, track, channel) {
        var chord = this.takeChord(when, track, channel);
        for (var i = 0; i < chord.notes.length; i++) {
            if (!(chord.notes[i].closed)) {
                if (chord.notes[i].basePitch == first) {
                    return chord.notes[i];
                }
            }
        }
        var pi = { closed: false, bendPoints: [], basePitch: first, baseDuration: -1 };
        chord.notes.push(pi);
        return pi;
    }
    distanceToPoint(line, point) {
        var m = (line.p2.y - line.p1.y) / (line.p2.x - line.p1.x);
        var b = line.p1.y - (m * line.p1.x);
        var d = [];
        d.push(Math.abs(point.y - (m * point.x) - b) / Math.sqrt(Math.pow(m, 2) + 1));
        d.push(Math.sqrt(Math.pow((point.x - line.p1.x), 2) + Math.pow((point.y - line.p1.y), 2)));
        d.push(Math.sqrt(Math.pow((point.x - line.p2.x), 2) + Math.pow((point.y - line.p2.y), 2)));
        d.sort(function (a, b) {
            return (a - b);
        });
        return d[0];
    }
    ;
    douglasPeucker(points, tolerance) {
        if (points.length <= 2) {
            return [points[0]];
        }
        var returnPoints = [];
        var line = { p1: points[0], p2: points[points.length - 1] };
        var maxDistance = 0;
        var maxDistanceIndex = 0;
        var p;
        for (var i = 1; i <= points.length - 2; i++) {
            var distance = this.distanceToPoint(line, points[i]);
            if (distance > maxDistance) {
                maxDistance = distance;
                maxDistanceIndex = i;
            }
        }
        if (maxDistance >= tolerance) {
            p = points[maxDistanceIndex];
            this.distanceToPoint(line, p);
            returnPoints = returnPoints.concat(this.douglasPeucker(points.slice(0, maxDistanceIndex + 1), tolerance));
            returnPoints = returnPoints.concat(this.douglasPeucker(points.slice(maxDistanceIndex, points.length), tolerance));
        }
        else {
            p = points[maxDistanceIndex];
            this.distanceToPoint(line, p);
            returnPoints = [points[0]];
        }
        return returnPoints;
    }
    ;
    simplifyAllBendPaths() {
        let msMin = 75;
        for (var t = 0; t < this.parsedTracks.length; t++) {
            var track = this.parsedTracks[t];
            for (var ch = 0; ch < track.chords.length; ch++) {
                var chord = track.chords[ch];
                for (var n = 0; n < chord.notes.length; n++) {
                    var note = chord.notes[n];
                    if (note.bendPoints.length > 1) {
                        let simplifiedPath = [];
                        let cuPointDuration = 0;
                        let lastBasePitchDelta = 0;
                        for (let pp = 0; pp < note.bendPoints.length; pp++) {
                            let cuPoint = note.bendPoints[pp];
                            lastBasePitchDelta = cuPoint.basePitchDelta;
                            cuPointDuration = cuPointDuration + cuPoint.pointDuration;
                            if (cuPointDuration > msMin) {
                                simplifiedPath.push({ pointDuration: cuPointDuration, basePitchDelta: lastBasePitchDelta });
                                cuPointDuration = 0;
                            }
                            else {
                                if (simplifiedPath.length > 0) {
                                    let prePoint = simplifiedPath[simplifiedPath.length - 1];
                                    prePoint.basePitchDelta = lastBasePitchDelta;
                                }
                            }
                        }
                        simplifiedPath.push({ pointDuration: cuPointDuration, basePitchDelta: lastBasePitchDelta });
                        note.bendPoints = simplifiedPath;
                    }
                    else {
                        if (note.bendPoints.length == 1) {
                            if (note.bendPoints[0].pointDuration > 4321) {
                                note.bendPoints[0].pointDuration = 1234;
                            }
                        }
                    }
                }
            }
        }
    }
    dumpResolutionChanges() {
        this.header.changes = [];
        let tickResolution = this.header.get0TickResolution();
        this.header.changes.push({ track: -1, ms: -1, resolution: tickResolution, bpm: 120 });
        for (var t = 0; t < this.parsedTracks.length; t++) {
            var track = this.parsedTracks[t];
            let playTimeTicks = 0;
            for (var e = 0; e < track.trackevents.length; e++) {
                var evnt = track.trackevents[e];
                let curDelta = 0.0;
                if (evnt.delta)
                    curDelta = evnt.delta;
                playTimeTicks = playTimeTicks + curDelta * tickResolution / 1000.0;
                if (evnt.basetype === this.EVENT_META) {
                    if (evnt.subtype === this.EVENT_META_SET_TEMPO) {
                        if (evnt.tempo) {
                            tickResolution = this.header.getCalculatedTickResolution(evnt.tempo);
                            this.header.changes.push({ track: t, ms: playTimeTicks, resolution: tickResolution, bpm: (evnt.tempoBPM) ? evnt.tempoBPM : 120 });
                        }
                    }
                }
            }
        }
        this.header.changes.sort((a, b) => { return a.ms - b.ms; });
    }
    lastResolution(ms) {
        for (var i = this.header.changes.length - 1; i >= 0; i--) {
            if (this.header.changes[i].ms <= ms) {
                return this.header.changes[i].resolution;
            }
        }
        return 0;
    }
    parseTicks2time(track) {
        let tickResolution = this.lastResolution(0);
        let playTimeTicks = 0;
        for (let e = 0; e < track.trackevents.length; e++) {
            let evnt = track.trackevents[e];
            let curDelta = 0.0;
            if (evnt.delta)
                curDelta = evnt.delta;
            let searchPlayTimeTicks = playTimeTicks + curDelta * tickResolution / 1000.0;
            tickResolution = this.lastResolution(searchPlayTimeTicks);
            evnt.preTimeMs = playTimeTicks;
            playTimeTicks = playTimeTicks + curDelta * tickResolution / 1000.0;
            evnt.playTimeMs = playTimeTicks;
            evnt.deltaTimeMs = curDelta * tickResolution / 1000.0;
        }
    }
    parseNotes() {
        this.dumpResolutionChanges();
        var expectedPitchBendRangeMessageNumber = 1;
        var expectedPitchBendRangeChannel = null;
        var pitchBendRange = Array(16).fill(2);
        for (let t = 0; t < this.parsedTracks.length; t++) {
            var singleParsedTrack = this.parsedTracks[t];
            this.parseTicks2time(singleParsedTrack);
            for (var e = 0; e < singleParsedTrack.trackevents.length; e++) {
                var expectedPitchBendRangeMessageNumberOld = expectedPitchBendRangeMessageNumber;
                var evnt = singleParsedTrack.trackevents[e];
                if (evnt.basetype == this.EVENT_MIDI) {
                    evnt.param1 = evnt.param1 ? evnt.param1 : 0;
                    if (evnt.subtype == this.EVENT_MIDI_NOTE_ON) {
                        if (evnt.param1 >= 0 && evnt.param1 <= 127) {
                            var pitch = evnt.param1 ? evnt.param1 : 0;
                            var when = 0;
                            if (evnt.playTimeMs)
                                when = evnt.playTimeMs;
                            let trno = this.takeOpenedNote(pitch, when, singleParsedTrack, evnt.midiChannel ? evnt.midiChannel : 0);
                            trno.volume = evnt.param2;
                            trno.openEvent = evnt;
                        }
                    }
                    else {
                        if (evnt.subtype == this.EVENT_MIDI_NOTE_OFF) {
                            if (evnt.param1 >= 0 && evnt.param1 <= 127) {
                                var pitch = evnt.param1 ? evnt.param1 : 0;
                                var when = 0;
                                if (evnt.playTimeMs)
                                    when = evnt.playTimeMs;
                                var chpi = this.findOpenedNoteBefore(pitch, when, singleParsedTrack, evnt.midiChannel ? evnt.midiChannel : 0);
                                if (chpi) {
                                    chpi.note.baseDuration = when - chpi.chord.when;
                                    chpi.note.closed = true;
                                    chpi.note.closeEvent = evnt;
                                }
                            }
                        }
                        else {
                            if (evnt.subtype == this.EVENT_MIDI_PROGRAM_CHANGE) {
                                if (evnt.param1 >= 0 && evnt.param1 <= 127) {
                                    singleParsedTrack.programChannel.push({
                                        program: evnt.param1 ? evnt.param1 : 0,
                                        channel: evnt.midiChannel ? evnt.midiChannel : 0
                                    });
                                }
                            }
                            else {
                                if (evnt.subtype == this.EVENT_MIDI_PITCH_BEND) {
                                    var eventWhen = evnt.playTimeMs ? evnt.playTimeMs : 0;
                                    var chord = this.findChordBefore(eventWhen, singleParsedTrack, evnt.midiChannel ? evnt.midiChannel : 0);
                                    if (chord) {
                                        for (var i = 0; i < chord.notes.length; i++) {
                                            var note = chord.notes[i];
                                            if (!(note.closed)) {
                                                var allPointsDuration = 0;
                                                for (var k = 0; k < note.bendPoints.length; k++) {
                                                    allPointsDuration = allPointsDuration + note.bendPoints[k].pointDuration;
                                                }
                                                let idx = evnt.midiChannel ? evnt.midiChannel : 0;
                                                let pp2 = evnt.param2 ? evnt.param2 : 0;
                                                var delta = (pp2 - 64) / 64 * pitchBendRange[idx];
                                                var point = {
                                                    pointDuration: eventWhen - chord.when - allPointsDuration,
                                                    basePitchDelta: delta
                                                };
                                                note.bendPoints.push(point);
                                            }
                                        }
                                    }
                                }
                                else {
                                    if (evnt.subtype == this.EVENT_MIDI_CONTROLLER) {
                                        if (evnt.param1 == this.controller_coarseVolume) {
                                            var v = evnt.param2 ? evnt.param2 / 127 : 0;
                                            let point = { ms: evnt.playTimeMs, value: v, channel: evnt.midiChannel ? evnt.midiChannel : 0, track: t };
                                            singleParsedTrack.trackVolumePoints.push(point);
                                        }
                                        else {
                                            if ((expectedPitchBendRangeMessageNumber == 1 && evnt.param1 == this.controller_coarseRPN && evnt.param2 == 0x00) ||
                                                (expectedPitchBendRangeMessageNumber == 2 && evnt.param1 == this.controller_fineRPN && evnt.param2 == 0x00) ||
                                                (expectedPitchBendRangeMessageNumber == 3 && evnt.param1 == this.controller_coarseDataEntrySlider) ||
                                                (expectedPitchBendRangeMessageNumber == 4 && evnt.param1 == this.controller_fineDataEntrySlider)) {
                                                if (expectedPitchBendRangeMessageNumber > 1 && evnt.midiChannel != expectedPitchBendRangeChannel) {
                                                    console.log('Unexpected channel number in non-first pitch-bend RANGE (SENSITIVITY) message. MIDI file might be corrupt.');
                                                }
                                                expectedPitchBendRangeChannel = evnt.midiChannel;
                                                let idx = evnt.midiChannel ? evnt.midiChannel : 0;
                                                if (expectedPitchBendRangeMessageNumber == 3) {
                                                    pitchBendRange[idx] = evnt.param2;
                                                }
                                                if (expectedPitchBendRangeMessageNumber == 4) {
                                                    let pp = evnt.param2 ? evnt.param2 : 0;
                                                    pitchBendRange[idx] = pitchBendRange[idx] + pp / 100;
                                                }
                                                expectedPitchBendRangeMessageNumber++;
                                                if (expectedPitchBendRangeMessageNumber == 5) {
                                                    expectedPitchBendRangeMessageNumber = 1;
                                                }
                                            }
                                            else {
                                                if (evnt.param1 == this.controller_BankSelectMSB
                                                    || evnt.param1 == this.controller_ModulationWheel
                                                    || evnt.param1 == this.controller_ReverbLevel
                                                    || evnt.param1 == this.controller_TremoloDepth
                                                    || evnt.param1 == this.controller_ChorusLevel
                                                    || evnt.param1 == this.controller_NRPNParameterLSB
                                                    || evnt.param1 == this.controller_NRPNParameterMSB
                                                    || evnt.param1 == this.controller_fineRPN
                                                    || evnt.param1 == this.controller_coarseRPN
                                                    || evnt.param1 == this.controller_coarseDataEntrySlider
                                                    || evnt.param1 == this.controller_ballance
                                                    || evnt.param1 == this.controller_pan
                                                    || evnt.param1 == this.controller_expression
                                                    || evnt.param1 == this.controller_BankSelectLSBGS
                                                    || evnt.param1 == this.controller_HoldPedal1
                                                    || evnt.param1 == this.controller_ResetAllControllers
                                                    || (evnt.param1 >= 32 && evnt.param1 <= 63)
                                                    || (evnt.param1 >= 70 && evnt.param1 <= 79)) {
                                                }
                                                else {
                                                    console.log('unknown controller', evnt.playTimeMs, 'ms, channel', evnt.midiChannel, ':', evnt.param1, evnt.param2);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                else {
                    if (evnt.subtype == this.EVENT_META_TEXT) {
                        this.header.lyrics.push({ track: t, ms: evnt.playTimeMs ? evnt.playTimeMs : 0, txt: (evnt.text ? evnt.text : "") });
                    }
                    if (evnt.subtype == this.EVENT_META_MARKER) {
                        this.header.lyrics.push({ track: t, ms: evnt.playTimeMs ? evnt.playTimeMs : 0, txt: (evnt.text ? evnt.text : "") });
                    }
                    if (evnt.subtype == this.EVENT_META_COPYRIGHT_NOTICE) {
                        this.header.lyrics.push({ track: t, ms: evnt.playTimeMs ? evnt.playTimeMs : 0, txt: 'Copyright: ' + (evnt.text ? evnt.text : "") });
                    }
                    if (evnt.subtype == this.EVENT_META_TRACK_NAME) {
                        singleParsedTrack.trackTitle = evnt.text ? evnt.text : '';
                    }
                    if (evnt.subtype == this.EVENT_META_INSTRUMENT_NAME) {
                        singleParsedTrack.instrumentName = evnt.text ? evnt.text : '';
                    }
                    if (evnt.subtype == this.EVENT_META_LYRICS) {
                        this.header.lyrics.push({ track: t, ms: evnt.playTimeMs ? evnt.playTimeMs : 0, txt: (evnt.text ? evnt.text : "") });
                    }
                    if (evnt.subtype == this.EVENT_META_CUE_POINT) {
                        this.header.lyrics.push({ track: t, ms: evnt.playTimeMs ? evnt.playTimeMs : 0, txt: 'CUE: ' + (evnt.text ? evnt.text : "") });
                    }
                    if (evnt.subtype == this.EVENT_META_KEY_SIGNATURE) {
                        var majSharpCircleOfFifths = ['C', 'G', 'D', 'A', 'E', 'B', 'F#'];
                        var majFlatCircleOfFifths = ['C', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb'];
                        var minSharpCircleOfFifths = ['Am', 'Em', 'Bm', 'F#m', 'C#m', 'G#m', 'D#'];
                        var minFlatCircleOfFifths = ['Am', 'Dm', 'Gm', 'Cm', 'Fm', 'Bbm', 'Ebm'];
                        var key = evnt.key ? evnt.key : 0;
                        if (key > 127)
                            key = key - 256;
                        this.header.keyFlatSharp = key;
                        this.header.keyMajMin = evnt.scale ? evnt.scale : 0;
                        var signature = 'C';
                        if (this.header.keyFlatSharp >= 0) {
                            if (this.header.keyMajMin < 1) {
                                signature = majSharpCircleOfFifths[Math.abs(this.header.keyFlatSharp)];
                            }
                            else {
                                signature = minSharpCircleOfFifths[Math.abs(this.header.keyFlatSharp)];
                            }
                        }
                        else {
                            if (this.header.keyMajMin < 1) {
                                signature = majFlatCircleOfFifths[Math.abs(this.header.keyFlatSharp)];
                            }
                            else {
                                signature = minFlatCircleOfFifths[Math.abs(this.header.keyFlatSharp)];
                            }
                        }
                        this.header.signs.push({ track: t, ms: evnt.playTimeMs ? evnt.playTimeMs : 0, sign: signature });
                    }
                    if (evnt.subtype == this.EVENT_META_SET_TEMPO) {
                        this.header.tempoBPM = evnt.tempoBPM ? evnt.tempoBPM : 120;
                    }
                    if (evnt.subtype == this.EVENT_META_TIME_SIGNATURE) {
                        this.header.meterCount = evnt.param1 ? evnt.param1 : 4;
                        var dvsn = evnt.param2 ? evnt.param2 : 2;
                        if (dvsn == 1)
                            this.header.meterDivision = 2;
                        else if (dvsn == 2)
                            this.header.meterDivision = 4;
                        else if (dvsn == 3)
                            this.header.meterDivision = 8;
                        else if (dvsn == 4)
                            this.header.meterDivision = 16;
                        else if (dvsn == 5)
                            this.header.meterDivision = 32;
                        else if (dvsn == 0)
                            this.header.meterDivision = 1;
                        this.header.meters.push({
                            track: t, ms: evnt.playTimeMs ? evnt.playTimeMs : 0,
                            count: this.header.meterCount, division: this.header.meterDivision
                        });
                    }
                }
                if (expectedPitchBendRangeMessageNumberOld == expectedPitchBendRangeMessageNumber) {
                    if (expectedPitchBendRangeMessageNumberOld >= 2 && expectedPitchBendRangeMessageNumberOld <= 3) {
                    }
                    if (expectedPitchBendRangeMessageNumberOld == 4) {
                        expectedPitchBendRangeMessageNumber = 1;
                    }
                }
            }
        }
    }
    nextEvent(stream) {
        var index = stream.offset();
        var delta = stream.readVarInt();
        var eventTypeByte = stream.readUint8();
        var event = { offset: index, delta: delta, eventTypeByte: eventTypeByte, playTimeMs: 0 };
        if (0xf0 === (eventTypeByte & 0xf0)) {
            if (eventTypeByte === this.EVENT_META) {
                event.basetype = this.EVENT_META;
                event.subtype = stream.readUint8();
                event.length = stream.readVarInt();
                switch (event.subtype) {
                    case this.EVENT_META_SEQUENCE_NUMBER:
                        event.msb = stream.readUint8();
                        event.lsb = stream.readUint8();
                        console.log('EVENT_META_SEQUENCE_NUMBER', event);
                        return event;
                    case this.EVENT_META_TEXT:
                    case this.EVENT_META_COPYRIGHT_NOTICE:
                    case this.EVENT_META_TRACK_NAME:
                    case this.EVENT_META_INSTRUMENT_NAME:
                    case this.EVENT_META_LYRICS:
                    case this.EVENT_META_MARKER:
                    case this.EVENT_META_CUE_POINT:
                        event.data = stream.readBytes(event.length);
                        event.text = this.toText(event.data ? event.data : []);
                        return event;
                    case this.EVENT_META_MIDI_CHANNEL_PREFIX:
                        event.prefix = stream.readUint8();
                        return event;
                    case this.EVENT_META_END_OF_TRACK:
                        return event;
                    case this.EVENT_META_SET_TEMPO:
                        event.tempo = (stream.readUint8() << 16) + (stream.readUint8() << 8) + stream.readUint8();
                        event.tempoBPM = 60000000 / event.tempo;
                        return event;
                    case this.EVENT_META_SMTPE_OFFSET:
                        event.hour = stream.readUint8();
                        event.minutes = stream.readUint8();
                        event.seconds = stream.readUint8();
                        event.frames = stream.readUint8();
                        event.subframes = stream.readUint8();
                        return event;
                    case this.EVENT_META_KEY_SIGNATURE:
                        event.key = stream.readUint8();
                        event.scale = stream.readUint8();
                        return event;
                    case this.EVENT_META_TIME_SIGNATURE:
                        event.data = stream.readBytes(event.length);
                        event.param1 = event.data[0];
                        event.param2 = event.data[1];
                        event.param3 = event.data[2];
                        event.param4 = event.data[3];
                        return event;
                    case this.EVENT_META_SEQUENCER_SPECIFIC:
                        event.data = stream.readBytes(event.length);
                        return event;
                    default:
                        event.data = stream.readBytes(event.length);
                        return event;
                }
            }
            else {
                if (eventTypeByte === this.EVENT_SYSEX || eventTypeByte === this.EVENT_DIVSYSEX) {
                    event.basetype = eventTypeByte;
                    event.length = stream.readVarInt();
                    event.data = stream.readBytes(event.length);
                    return event;
                }
                else {
                    event.basetype = eventTypeByte;
                    event.badsubtype = stream.readVarInt();
                    event.length = stream.readUint8();
                    event.data = stream.readBytes(event.length);
                    return event;
                }
            }
        }
        else {
            if (0 === (eventTypeByte & 0x80)) {
                if (!this.midiEventType) {
                    throw new Error('no pre event' + stream.offset());
                }
                this.midiEventParam1 = eventTypeByte;
            }
            else {
                this.midiEventType = eventTypeByte >> 4;
                this.midiEventChannel = eventTypeByte & 0x0f;
                this.midiEventParam1 = stream.readUint8();
            }
            event.basetype = this.EVENT_MIDI;
            event.subtype = this.midiEventType;
            event.midiChannel = this.midiEventChannel;
            event.param1 = this.midiEventParam1;
            switch (this.midiEventType) {
                case this.EVENT_MIDI_NOTE_OFF:
                    event.param2 = stream.readUint8();
                    return event;
                case this.EVENT_MIDI_NOTE_ON:
                    event.param2 = stream.readUint8();
                    if (!event.param2) {
                        event.subtype = this.EVENT_MIDI_NOTE_OFF;
                        event.param2 = -1;
                    }
                    return event;
                case this.EVENT_MIDI_NOTE_AFTERTOUCH:
                    event.param2 = stream.readUint8();
                    return event;
                case this.EVENT_MIDI_CONTROLLER:
                    event.param2 = stream.readUint8();
                    if (event.param1 == 7) {
                    }
                    return event;
                case this.EVENT_MIDI_PROGRAM_CHANGE:
                    return event;
                case this.EVENT_MIDI_CHANNEL_AFTERTOUCH:
                    return event;
                case this.EVENT_MIDI_PITCH_BEND:
                    event.param2 = stream.readUint8();
                    return event;
                default:
                    console.log('unknown note', event);
                    return event;
            }
        }
    }
    parseTrackEvents(track) {
        var stream = new DataViewStream(track.trackContent);
        this.midiEventType = 0;
        this.midiEventChannel = 0;
        this.midiEventParam1 = 0;
        while (!stream.end()) {
            var e = this.nextEvent(stream);
            track.trackevents.push(e);
        }
    }
    findOrCreateTrack(parsedtrack, trackNum, channelNum, trackChannel) {
        for (let i = 0; i < trackChannel.length; i++) {
            if (trackChannel[i].trackNum == trackNum && trackChannel[i].channelNum == channelNum) {
                return trackChannel[i];
            }
        }
        let it = {
            trackNum: trackNum, channelNum: channelNum, track: {
                order: 0,
                title: parsedtrack.trackTitle + ((parsedtrack.instrumentName) ? (' - ' + parsedtrack.instrumentName) : ''),
                channelNum: channelNum,
                trackVolumes: [],
                program: -1,
                songchords: []
            }
        };
        for (let vv = 0; vv < parsedtrack.trackVolumePoints.length; vv++) {
            if (parsedtrack.trackVolumePoints[vv].channel == it.track.channelNum) {
                it.track.trackVolumes.push(parsedtrack.trackVolumePoints[vv]);
            }
        }
        trackChannel.push(it);
        return it;
    }
    findLastMeter(midiSongData, beforeMs, barIdx) {
        let metre = {
            count: midiSongData.meter.count,
            part: midiSongData.meter.division
        };
        let midimeter = { track: 0, ms: 0, count: 4, division: 4 };
        for (let mi = 0; mi < midiSongData.meters.length; mi++) {
            if (midiSongData.meters[mi].ms > beforeMs + 1 + barIdx * 3) {
                break;
            }
            midimeter = midiSongData.meters[mi];
        }
        metre.count = midimeter.count;
        metre.part = midimeter.division;
        return metre;
    }
    findLastChange(midiSongData, beforeMs) {
        let nextChange = { track: 0, ms: 0, resolution: 0, bpm: 120 };
        for (let ii = 1; ii < midiSongData.changes.length; ii++) {
            if (midiSongData.changes[ii].ms > beforeMs + 1) {
                break;
            }
            nextChange = midiSongData.changes[ii];
        }
        return nextChange;
    }
    findNextChange(midiSongData, afterMs) {
        let nextChange = { track: 0, ms: 0, resolution: 0, bpm: 120 };
        for (let ii = 1; ii < midiSongData.changes.length; ii++) {
            if (midiSongData.changes[ii].ms > afterMs) {
                nextChange = midiSongData.changes[ii];
                break;
            }
        }
        return nextChange;
    }
    calcMeasureDuration(midiSongData, meter, bpm, part, startMs) {
        let metreMath = MMUtil();
        let wholeDurationMs = 1000 * metreMath.set(meter).duration(bpm);
        let partDurationMs = part * wholeDurationMs;
        let nextChange = this.findNextChange(midiSongData, startMs);
        if (startMs < nextChange.ms && nextChange.ms < startMs + partDurationMs) {
            let diffMs = nextChange.ms - startMs;
            let ratio = diffMs / partDurationMs;
            let newPart = ratio * part;
            let newPartDurationMs = newPart * wholeDurationMs;
            let remainsMs = this.calcMeasureDuration(midiSongData, meter, nextChange.bpm, part - newPart, nextChange.ms);
            return newPartDurationMs + remainsMs;
        }
        else {
            return partDurationMs;
        }
    }
    createMeasure(midiSongData, fromMs, barIdx) {
        let change = this.findLastChange(midiSongData, fromMs);
        let meter = this.findLastMeter(midiSongData, fromMs, barIdx);
        let duration = this.calcMeasureDuration(midiSongData, meter, change.bpm, 1, fromMs);
        let measure = {
            tempo: change.bpm,
            metre: meter,
            startMs: fromMs,
            durationMs: duration
        };
        return measure;
    }
    createTimeLine(midiSongData) {
        let count = 0;
        let part = 0;
        let bpm = 0;
        let timeline = [];
        let fromMs = 0;
        while (fromMs < midiSongData.duration) {
            let measure = this.createMeasure(midiSongData, fromMs, timeline.length);
            fromMs = fromMs + measure.durationMs;
            if (count != measure.metre.count || part != measure.metre.part || bpm != measure.tempo) {
                count = measure.metre.count;
                part = measure.metre.part;
                bpm = measure.tempo;
            }
            else {
            }
            timeline.push(measure);
        }
        return timeline;
    }
    convertProject(title, comment) {
        let midiSongData = {
            parser: '1.12',
            duration: 0,
            bpm: this.header.tempoBPM,
            changes: this.header.changes,
            lyrics: this.header.lyrics,
            key: this.header.keyFlatSharp,
            mode: this.header.keyMajMin,
            meter: { count: this.header.meterCount, division: this.header.meterDivision },
            meters: this.header.meters,
            signs: this.header.signs,
            miditracks: [],
            speedMode: 0,
            lineMode: 0
        };
        let tracksChannels = [];
        for (let i = 0; i < this.parsedTracks.length; i++) {
            let parsedtrack = this.parsedTracks[i];
            for (let k = 0; k < parsedtrack.programChannel.length; k++) {
                this.findOrCreateTrack(parsedtrack, i, parsedtrack.programChannel[k].channel, tracksChannels);
            }
        }
        var maxWhen = 0;
        for (var i = 0; i < this.parsedTracks.length; i++) {
            var miditrack = this.parsedTracks[i];
            for (var ch = 0; ch < miditrack.chords.length; ch++) {
                var midichord = miditrack.chords[ch];
                var newchord = { when: midichord.when, notes: [], channel: midichord.channel };
                if (maxWhen < midichord.when) {
                    maxWhen = midichord.when;
                }
                for (var n = 0; n < midichord.notes.length; n++) {
                    var midinote = midichord.notes[n];
                    var newnote = { slidePoints: [], midiPitch: midinote.basePitch, midiDuration: midinote.baseDuration };
                    newchord.notes.push(newnote);
                    if (midinote.bendPoints.length > 0) {
                        for (var v = 0; v < midinote.bendPoints.length; v++) {
                            var midipoint = midinote.bendPoints[v];
                            var newpoint = {
                                pitch: midinote.basePitch + midipoint.basePitchDelta,
                                durationms: midipoint.pointDuration
                            };
                            newpoint.midipoint = midinote;
                            newnote.slidePoints.push(newpoint);
                        }
                    }
                    else {
                    }
                }
                let chanTrack = this.findOrCreateTrack(miditrack, i, newchord.channel, tracksChannels);
                chanTrack.track.songchords.push(newchord);
            }
        }
        for (let tt = 0; tt < tracksChannels.length; tt++) {
            let trackChan = tracksChannels[tt];
            if (trackChan.track.songchords.length > 0) {
                midiSongData.miditracks.push(tracksChannels[tt].track);
                if (midiSongData.duration < maxWhen) {
                    midiSongData.duration = 54321 + maxWhen;
                }
                for (let i = 0; i < this.parsedTracks.length; i++) {
                    let miditrack = this.parsedTracks[i];
                    for (let kk = 0; kk < miditrack.programChannel.length; kk++) {
                        if (miditrack.programChannel[kk].channel == trackChan.channelNum) {
                            trackChan.track.program = miditrack.programChannel[kk].program;
                        }
                    }
                }
            }
        }
        let newtimeline = this.createTimeLine(midiSongData);
        let project = {
            title: title + ' ' + comment,
            timeline: newtimeline,
            tracks: [],
            percussions: [],
            filters: [],
            comments: [],
            selectedPart: {
                startMeasure: -1,
                endMeasure: -1
            },
            versionCode: '1',
            list: false,
            undo: [],
            redo: [],
            position: { x: 0, y: 0, z: 100 }
        };
        let echoOutID = 'reverberation';
        let compresID = 'compression';
        for (let ii = 0; ii < project.timeline.length; ii++) {
            project.comments.push({ points: [] });
        }
        for (let ii = 0; ii < midiSongData.lyrics.length; ii++) {
            let textpoint = midiSongData.lyrics[ii];
            let pnt = findMeasureSkipByTime(textpoint.ms / 1000, project.timeline);
            if (pnt) {
                this.addLyricsPoints(project.comments[pnt.idx], { count: pnt.skip.count, part: pnt.skip.part }, textpoint.txt, project.timeline[pnt.idx].tempo);
            }
        }
        let top = 0;
        let outputID = '';
        let volume = 1;
        for (var ii = 0; ii < midiSongData.miditracks.length; ii++) {
            let midiSongTrack = midiSongData.miditracks[ii];
            if (midiSongTrack.trackVolumes.length > 1) {
                let filterID = 'volume' + ii;
                let filterVolume = {
                    id: filterID,
                    title: filterID,
                    kind: 'zvolume1', data: '99', outputs: [compresID],
                    iconPosition: { x: 77 + ii * 5, y: ii * 11 + 2 },
                    automation: [], state: 0
                };
                outputID = filterID;
                project.filters.push(filterVolume);
                for (let mm = 0; mm < project.timeline.length; mm++) {
                    filterVolume.automation.push({ changes: [] });
                }
                for (let vv = 0; vv < midiSongTrack.trackVolumes.length; vv++) {
                    let gain = midiSongTrack.trackVolumes[vv];
                    let vol = '' + Math.round(gain.value * 100) + '%';
                    let pnt = findMeasureSkipByTime(gain.ms / 1000, project.timeline);
                    if (pnt) {
                        pnt.skip = MMUtil().set(pnt.skip).strip(16);
                        for (let aa = 0; aa < filterVolume.automation[pnt.idx].changes.length; aa++) {
                            let sk = filterVolume.automation[pnt.idx].changes[aa].skip;
                            if (MMUtil().set(sk).equals(pnt.skip)) {
                                filterVolume.automation[pnt.idx].changes.splice(aa, 1);
                                break;
                            }
                        }
                        filterVolume.automation[pnt.idx].changes.push({ skip: pnt.skip, stateBlob: vol });
                    }
                }
            }
            else {
                outputID = compresID;
                if (midiSongTrack.trackVolumes.length == 1) {
                    let vol = 1 * midiSongTrack.trackVolumes[0].value;
                    volume = 1 * midiSongTrack.trackVolumes[0].value;
                }
                else {
                }
            }
            if (midiSongTrack.channelNum == 9) {
                let drums = this.collectDrums(midiSongTrack);
                for (let dd = 0; dd < drums.length; dd++) {
                    project.percussions.push(this.createProjectDrums(1, top * 9, drums[dd], project.timeline, midiSongTrack, outputID));
                    top++;
                }
            }
            else {
                project.tracks.push(this.createProjectTrack(volume, top * 8, project.timeline, midiSongTrack, outputID));
                top++;
            }
        }
        let filterEcho = {
            id: echoOutID, title: echoOutID,
            kind: 'zvecho1', data: '22', outputs: [''],
            iconPosition: {
                x: 77 + midiSongData.miditracks.length * 30,
                y: midiSongData.miditracks.length * 8 + 2
            },
            automation: [], state: 0
        };
        let filterCompression = {
            id: compresID,
            title: compresID,
            kind: 'zvooco1', data: '1', outputs: [echoOutID],
            iconPosition: {
                x: 88 + midiSongData.miditracks.length * 30,
                y: midiSongData.miditracks.length * 8 + 2
            },
            automation: [], state: 0
        };
        project.filters.push(filterEcho);
        project.filters.push(filterCompression);
        for (let mm = project.timeline.length - 2; mm >= 0; mm--) {
            for (let ff = 0; ff < project.filters.length; ff++) {
                if (!(project.filters[ff].automation[mm])) {
                    project.filters[ff].automation[mm] = { changes: [] };
                }
            }
            for (let cc = 0; cc < project.comments.length; cc++) {
                if (!(project.comments[mm])) {
                    project.comments[mm] = { points: [] };
                }
            }
        }
        console.log('midiParser', this);
        console.log('midiSongData', midiSongData);
        console.log('project', project);
        let needSlice = (midiSongData.meters.length < 2)
            && (midiSongData.changes.length < 3)
            && (project.timeline[0].metre.count / project.timeline[0].metre.part == 1);
        this.trimProject(project, needSlice);
        return project;
    }
    calculateShift32(project, count32) {
        let ticker = MMUtil().set({ count: count32, part: 32 });
        let duration = MMUtil().set({ count: 0, part: 32 });
        for (let mm = 0; mm < project.timeline.length; mm++) {
            duration = duration.plus(project.timeline[mm].metre);
        }
        let smm = MMUtil().set({ count: 0, part: 32 });
        while (ticker.less(duration)) {
            let pointLen = this.extractPointStampDuration(project, ticker);
            smm = smm.plus(pointLen).strip(32);
            ticker = ticker.plus({ count: 1, part: 1 });
        }
        return smm.strip(32);
    }
    extractPointStampDuration(project, at) {
        let pointSumm = MMUtil().set({ count: 0, part: 32 });
        let end = MMUtil().set({ count: 0, part: 32 });
        for (let mm = 0; mm < project.timeline.length; mm++) {
            let barStart = end.simplyfy();
            end = end.plus(project.timeline[mm].metre).strip(32);
            if (end.more(at)) {
                let skip = MMUtil().set(at).minus(barStart);
                for (let pp = 0; pp < project.tracks.length; pp++) {
                    let track = project.tracks[pp];
                    let trackBar = track.measures[mm];
                    for (let ss = 0; ss < trackBar.chords.length; ss++) {
                        let chord = trackBar.chords[ss];
                        if (skip.equals(chord.skip)) {
                            let chordLen = MMUtil().set({ count: 0, part: 32 });
                            for (let ss = 0; ss < chord.slides.length; ss++) {
                                chordLen = chordLen.plus(chord.slides[ss].duration).strip(32);
                            }
                            pointSumm = pointSumm.plus(chordLen).strip(32);
                            break;
                        }
                    }
                }
                for (let dd = 0; dd < project.percussions.length; dd++) {
                    let drum = project.percussions[dd];
                    let drumBar = drum.measures[mm];
                    let drumDuration = { count: 1, part: 16 };
                    if (drum.sampler.data == '35' || drum.sampler.data == '36') {
                        drumDuration = { count: 3, part: 16 };
                    }
                    else {
                        if (drum.sampler.data == '38' || drum.sampler.data == '40') {
                            drumDuration = { count: 2, part: 16 };
                        }
                    }
                    for (let ss = 0; ss < drumBar.skips.length; ss++) {
                        if (skip.equals(drumBar.skips[ss])) {
                            pointSumm = pointSumm.plus(drumDuration).strip(32);
                            break;
                        }
                    }
                }
                break;
            }
        }
        return pointSumm;
    }
    trimProject(project, reslice) {
        for (let ii = 0; ii < project.tracks.length; ii++) {
            project.tracks[ii].performer.iconPosition.x = 10 + ii * 9;
            project.tracks[ii].performer.iconPosition.y = 0 + ii * 4;
        }
        for (let ii = 0; ii < project.percussions.length; ii++) {
            project.percussions[ii].sampler.iconPosition.x = 20 + ii * 4;
            project.percussions[ii].sampler.iconPosition.y = 30 + ii * 9;
        }
        for (let ii = 0; ii < project.filters.length - 2; ii++) {
            project.filters[ii].iconPosition.x = 10 + project.tracks.length * 9 + 5 + ii * 4;
            project.filters[ii].iconPosition.y = ii * 9;
        }
        project.filters[project.filters.length - 2].iconPosition.x = 35 + project.tracks.length * 9 + project.filters.length * 4;
        project.filters[project.filters.length - 2].iconPosition.y = project.filters.length * 5;
        project.filters[project.filters.length - 1].iconPosition.x = 20 + project.tracks.length * 9 + project.filters.length * 4;
        project.filters[project.filters.length - 1].iconPosition.y = project.filters.length * 6;
        for (let tt = 0; tt < project.tracks.length; tt++) {
            let track = project.tracks[tt];
            for (let mm = 0; mm < track.measures.length; mm++) {
                let measure = track.measures[mm];
                for (let cc = 0; cc < measure.chords.length; cc++) {
                    let chord = measure.chords[cc];
                    chord.skip = MMUtil().set(chord.skip).strip(32);
                }
            }
        }
        for (let ss = 0; ss < project.percussions.length; ss++) {
            let sampleTrack = project.percussions[ss];
            for (let mm = 0; mm < sampleTrack.measures.length; mm++) {
                let measure = sampleTrack.measures[mm];
                for (let mp = 0; mp < measure.skips.length; mp++) {
                    let newSkip = MMUtil().set(measure.skips[mp]).strip(32);
                    measure.skips[mp].count = newSkip.count;
                    measure.skips[mp].part = newSkip.part;
                }
            }
        }
        this.limitShort(project);
        if (reslice) {
            let durations = [];
            for (let ii = 0; ii < 32; ii++) {
                let len = this.calculateShift32(project, ii);
                let nn = 32 - ii;
                if (ii == 0) {
                    nn = 0;
                }
                durations.push({ len: Math.round(len.count / len.part), shft: nn });
            }
            durations.sort((a, b) => {
                return b.len - a.len;
            });
            console.log(durations);
            let top = [durations[0]];
            for (let ii = 1; ii < durations.length; ii++) {
                if (durations[ii].len * 2.2 > durations[0].len) {
                    top.push(durations[ii]);
                }
            }
            top.sort((a, b) => { return a.shft - b.shft; });
            console.log(top);
            let shsize = top[0].shft;
            if (shsize) {
                console.log('shift', '' + shsize + '/32');
                this.shiftForwar32(project, shsize);
            }
        }
        let len = project.timeline.length;
        for (let ii = len - 1; ii > 0; ii--) {
            if (this.isBarEmpty(ii, project)) {
            }
            else {
                project.timeline.length = ii + 2;
                return;
            }
        }
    }
    limitShort(project) {
        let note16 = MMUtil().set({ count: 1, part: 16 });
        for (let tt = 0; tt < project.tracks.length; tt++) {
            let track = project.tracks[tt];
            for (let mm = 0; mm < track.measures.length; mm++) {
                let measure = track.measures[mm];
                for (let cc = 0; cc < measure.chords.length; cc++) {
                    let chord = measure.chords[cc];
                    if (chord.slides.length == 1) {
                        chord.slides[0].duration = MMUtil().set(chord.slides[0].duration).simplyfy();
                        if (note16.more(chord.slides[0].duration)) {
                            chord.slides[0].duration = note16;
                        }
                    }
                }
            }
        }
    }
    shiftForwar32(project, amount) {
        for (let mm = project.timeline.length - 2; mm >= 0; mm--) {
            let measureDuration = MMUtil().set(project.timeline[mm].metre);
            for (let tt = 0; tt < project.tracks.length; tt++) {
                let track = project.tracks[tt];
                let trackMeasure = track.measures[mm];
                let trackNextMeasure = track.measures[mm + 1];
                for (let cc = 0; cc < trackMeasure.chords.length; cc++) {
                    let chord = trackMeasure.chords[cc];
                    let newSkip = MMUtil().set(chord.skip).plus({ count: amount, part: 32 });
                    if (measureDuration.more(newSkip)) {
                        chord.skip = newSkip.simplyfy();
                    }
                    else {
                        trackMeasure.chords.splice(cc, 1);
                        cc--;
                        trackNextMeasure.chords.push(chord);
                        chord.skip = newSkip.minus(measureDuration).simplyfy();
                    }
                }
            }
            for (let ss = 0; ss < project.percussions.length; ss++) {
                let sampleTrack = project.percussions[ss];
                let sampleMeasure = sampleTrack.measures[mm];
                let sampleNextMeasure = sampleTrack.measures[mm + 1];
                for (let mp = 0; mp < sampleMeasure.skips.length; mp++) {
                    let newSkip = MMUtil().set(sampleMeasure.skips[mp]).plus({ count: amount, part: 32 });
                    if (measureDuration.more(newSkip)) {
                        sampleMeasure.skips[mp] = newSkip.simplyfy();
                    }
                    else {
                        sampleMeasure.skips.splice(mp, 1);
                        mp--;
                        sampleNextMeasure.skips.push(newSkip.minus(measureDuration).simplyfy());
                    }
                }
            }
            for (let cc = 0; cc < project.comments.length; cc++) {
                let comMeasure = project.comments[mm];
                let comNextMeasure = project.comments[mm + 1];
                for (let pp = 0; pp < comMeasure.points.length; pp++) {
                    let point = comMeasure.points[pp];
                    let newSkip = MMUtil().set(point.skip).plus({ count: amount, part: 32 });
                    if (measureDuration.more(newSkip)) {
                        point.skip = newSkip.simplyfy();
                    }
                    else {
                        comMeasure.points.splice(pp, 1);
                        pp--;
                        comNextMeasure.points.push(point);
                        point.skip = newSkip.minus(measureDuration).simplyfy();
                    }
                }
            }
            for (let ff = 0; ff < project.filters.length; ff++) {
                let autoMeasure = project.filters[ff].automation[mm];
                let autoNextMeasure = project.filters[ff].automation[mm + 1];
                for (let cc = 0; cc < autoMeasure.changes.length; cc++) {
                    let change = autoMeasure.changes[cc];
                    let newSkip = MMUtil().set(change.skip).plus({ count: amount, part: 32 });
                    if (measureDuration.more(newSkip)) {
                        change.skip = newSkip.simplyfy();
                    }
                    else {
                        autoMeasure.changes.splice(cc, 1);
                        cc--;
                        autoNextMeasure.changes.push(change);
                        change.skip = newSkip.minus(measureDuration).simplyfy();
                    }
                }
            }
        }
    }
    isBarEmpty(barIdx, project) {
        for (let tt = 0; tt < project.tracks.length; tt++) {
            let track = project.tracks[tt];
            if (track.measures[barIdx]) {
                if (track.measures[barIdx].chords.length) {
                    return false;
                }
            }
        }
        for (let tt = 0; tt < project.percussions.length; tt++) {
            let drum = project.percussions[tt];
            if (drum.measures[barIdx]) {
                if (drum.measures[barIdx].skips.length) {
                    return false;
                }
            }
        }
        return true;
    }
    addLyricsPoints(commentPoint, skip, txt, tempo) {
        txt = txt.replace(/(\r)/g, '~');
        txt = txt.replace(/\\r/g, '~');
        txt = txt.replace(/(\n)/g, '~');
        txt = txt.replace(/\\n/g, '~');
        txt = txt.replace(/(~~)/g, '~');
        txt = txt.replace(/(~~)/g, '~');
        txt = txt.replace(/(~~)/g, '~');
        txt = txt.replace(/(~~)/g, '~');
        let strings = txt.split('~');
        if (strings.length) {
            let roundN = 750;
            let nextMs = 1000 * MMUtil().set(skip).duration(tempo);
            for (let ii = 0; ii < strings.length; ii++) {
                let row = 0;
                for (let ii = 0; ii < commentPoint.points.length; ii++) {
                    let existsMs = 1000 * MMUtil().set(commentPoint.points[ii].skip).duration(tempo);
                    if (Math.floor(Math.floor(existsMs / roundN) * roundN) == Math.floor(Math.floor(nextMs / roundN) * roundN)) {
                        row++;
                    }
                }
                commentPoint.points.push({ skip: skip, text: strings[ii].trim(), row: row });
            }
        }
    }
    collectDrums(midiTrack) {
        let drums = [];
        for (let ii = 0; ii < midiTrack.songchords.length; ii++) {
            let chord = midiTrack.songchords[ii];
            for (let kk = 0; kk < chord.notes.length; kk++) {
                let note = chord.notes[kk];
                if (drums.indexOf(note.midiPitch) < 0) {
                    drums.push(note.midiPitch);
                }
            }
        }
        return drums;
    }
    numratio(nn) {
        let rr = 1;
        return Math.round(nn * rr);
    }
    createProjectTrack(volume, top, timeline, midiTrack, outputId) {
        let perfkind = 'zinstr1';
        if (midiTrack.program == 24
            || midiTrack.program == 25
            || midiTrack.program == 26
            || midiTrack.program == 27
            || midiTrack.program == 28
            || midiTrack.program == 29
            || midiTrack.program == 30) {
            perfkind = 'zvstrumming1';
        }
        let projectTrack = {
            title: midiTrack.title + ' ' + insNames[midiTrack.program],
            measures: [],
            performer: {
                id: 'track' + (midiTrack.program + Math.random()), data: '' + midiTrack.program, kind: perfkind, outputs: [outputId],
                iconPosition: { x: top * 2, y: top }, state: 0
            },
            volume: volume
        };
        if (!(midiTrack.program >= 0 && midiTrack.program <= 127)) {
            projectTrack.performer.outputs = [];
        }
        let mm = MMUtil();
        for (let tt = 0; tt < timeline.length; tt++) {
            let projectMeasure = { chords: [] };
            projectTrack.measures.push(projectMeasure);
            let nextMeasure = timeline[tt];
            for (let ii = 0; ii < midiTrack.songchords.length; ii++) {
                let midiChord = midiTrack.songchords[ii];
                if (this.numratio(midiChord.when) >= nextMeasure.startMs
                    && this.numratio(midiChord.when) < nextMeasure.startMs + nextMeasure.durationMs) {
                    let trackChord = null;
                    let skip = mm.calculate((midiChord.when - nextMeasure.startMs) / 1000.0, nextMeasure.tempo).strip(32);
                    if (skip.count < 0) {
                        skip.count = 0;
                    }
                    for (let cc = 0; cc < projectMeasure.chords.length; cc++) {
                        if (mm.set(projectMeasure.chords[cc].skip).equals(skip)) {
                            trackChord = projectMeasure.chords[cc];
                        }
                    }
                    if (trackChord == null) {
                        trackChord = { skip: skip, pitches: [], slides: [] };
                        projectMeasure.chords.push(trackChord);
                    }
                    if (trackChord) {
                        for (let nn = 0; nn < midiChord.notes.length; nn++) {
                            let midiNote = midiChord.notes[nn];
                            if (midiNote.slidePoints.length > 0) {
                                trackChord.slides = [];
                                let bendDurationMs = 0;
                                for (let pp = 0; pp < midiNote.slidePoints.length; pp++) {
                                    let midiPoint = midiNote.slidePoints[pp];
                                    let xduration = mm.calculate(midiPoint.durationms / 1000.0, nextMeasure.tempo);
                                    trackChord.slides.push({
                                        duration: xduration,
                                        delta: midiNote.midiPitch - midiPoint.pitch
                                    });
                                    bendDurationMs = bendDurationMs + midiPoint.durationms;
                                }
                                let remains = midiNote.midiDuration - bendDurationMs;
                                if (remains > 0) {
                                    trackChord.slides.push({
                                        duration: mm.calculate(remains / 1000.0, nextMeasure.tempo),
                                        delta: midiNote.midiPitch - midiNote.slidePoints[midiNote.slidePoints.length - 1].pitch
                                    });
                                }
                            }
                            else {
                                trackChord.slides = [{
                                        duration: mm.calculate(midiNote.midiDuration / 1000.0, nextMeasure.tempo), delta: 0
                                    }];
                            }
                            trackChord.pitches.push(midiNote.midiPitch);
                        }
                    }
                }
            }
        }
        return projectTrack;
    }
    createProjectDrums(volume, top, drum, timeline, midiTrack, outputId) {
        let projectDrums = {
            title: midiTrack.title + ' ' + drumNames[drum],
            measures: [],
            sampler: {
                id: 'drum' + (drum + Math.random()), data: '' + drum, kind: 'zdrum1', outputs: [outputId],
                iconPosition: { x: top * 1.5, y: top / 2 }, state: 0
            },
            volume: volume
        };
        if (!(drum >= 35 && drum <= 81)) {
            projectDrums.sampler.outputs = [];
        }
        let currentTimeMs = 0;
        let mm = MMUtil();
        for (let tt = 0; tt < timeline.length; tt++) {
            let projectMeasure = { skips: [] };
            projectDrums.measures.push(projectMeasure);
            let nextMeasure = timeline[tt];
            let measureDurationS = mm.set(nextMeasure.metre).duration(nextMeasure.tempo);
            for (let ii = 0; ii < midiTrack.songchords.length; ii++) {
                let chord = midiTrack.songchords[ii];
                for (let kk = 0; kk < chord.notes.length; kk++) {
                    let note = chord.notes[kk];
                    let pitch = note.midiPitch;
                    if (pitch == drum) {
                        if (chord.when >= currentTimeMs && chord.when < currentTimeMs + measureDurationS * 1000) {
                            let skip = mm.calculate((chord.when - currentTimeMs) / 1000, nextMeasure.tempo);
                            projectMeasure.skips.push(skip);
                        }
                    }
                }
            }
            currentTimeMs = currentTimeMs + measureDurationS * 1000;
        }
        return projectDrums;
    }
}
let instrumentNamesArray = [];
let drumNamesArray = [];
function findrumTitles(nn) {
    let name = drumTitles()[nn];
    if (name) {
        return '' + name;
    }
    else {
        return 'MIDI' + nn;
    }
}
let drumNames = [];
drumNames[35] = "Bass Drum 2";
drumNames[36] = "Bass Drum 1";
drumNames[37] = "Side Stick/Rimshot";
drumNames[38] = "Snare Drum 1";
drumNames[39] = "Hand Clap";
drumNames[40] = "Snare Drum 2";
drumNames[41] = "Low Tom 2";
drumNames[42] = "Closed Hi-hat";
drumNames[43] = "Low Tom 1";
drumNames[44] = "Pedal Hi-hat";
drumNames[45] = "Mid Tom 2";
drumNames[46] = "Open Hi-hat";
drumNames[47] = "Mid Tom 1";
drumNames[48] = "High Tom 2";
drumNames[49] = "Crash Cymbal 1";
drumNames[50] = "High Tom 1";
drumNames[51] = "Ride Cymbal 1";
drumNames[52] = "Chinese Cymbal";
drumNames[53] = "Ride Bell";
drumNames[54] = "Tambourine";
drumNames[55] = "Splash Cymbal";
drumNames[56] = "Cowbell";
drumNames[57] = "Crash Cymbal 2";
drumNames[58] = "Vibra Slap";
drumNames[59] = "Ride Cymbal 2";
drumNames[60] = "High Bongo";
drumNames[61] = "Low Bongo";
drumNames[62] = "Mute High Conga";
drumNames[63] = "Open High Conga";
drumNames[64] = "Low Conga";
drumNames[65] = "High Timbale";
drumNames[66] = "Low Timbale";
drumNames[67] = "High Agogo";
drumNames[68] = "Low Agogo";
drumNames[69] = "Cabasa";
drumNames[70] = "Maracas";
drumNames[71] = "Short Whistle";
drumNames[72] = "Long Whistle";
drumNames[73] = "Short Guiro";
drumNames[74] = "Long Guiro";
drumNames[75] = "Claves";
drumNames[76] = "High Wood Block";
drumNames[77] = "Low Wood Block";
drumNames[78] = "Mute Cuica";
drumNames[79] = "Open Cuica";
drumNames[80] = "Mute Triangle";
drumNames[81] = "Open Triangle";
let insNames = [];
insNames[0] = "Acoustic Grand Piano: Piano";
insNames[1] = "Bright Acoustic Piano: Piano";
insNames[2] = "Electric Grand Piano: Piano";
insNames[3] = "Honky-tonk Piano: Piano";
insNames[4] = "Electric Piano 1: Piano";
insNames[5] = "Electric Piano 2: Piano";
insNames[6] = "Harpsichord: Piano";
insNames[7] = "Clavinet: Piano";
insNames[8] = "Celesta: Chromatic Percussion";
insNames[9] = "Glockenspiel: Chromatic Percussion";
insNames[10] = "Music Box: Chromatic Percussion";
insNames[11] = "Vibraphone: Chromatic Percussion";
insNames[12] = "Marimba: Chromatic Percussion";
insNames[13] = "Xylophone: Chromatic Percussion";
insNames[14] = "Tubular Bells: Chromatic Percussion";
insNames[15] = "Dulcimer: Chromatic Percussion";
insNames[16] = "Drawbar Organ: Organ";
insNames[17] = "Percussive Organ: Organ";
insNames[18] = "Rock Organ: Organ";
insNames[19] = "Church Organ: Organ";
insNames[20] = "Reed Organ: Organ";
insNames[21] = "Accordion: Organ";
insNames[22] = "Harmonica: Organ";
insNames[23] = "Tango Accordion: Organ";
insNames[24] = "Acoustic Guitar (nylon): Guitar";
insNames[25] = "Acoustic Guitar (steel): Guitar";
insNames[26] = "Electric Guitar (jazz): Guitar";
insNames[27] = "Electric Guitar (clean): Guitar";
insNames[28] = "Electric Guitar (muted): Guitar";
insNames[29] = "Overdriven Guitar: Guitar";
insNames[30] = "Distortion Guitar: Guitar";
insNames[31] = "Guitar Harmonics: Guitar";
insNames[32] = "Acoustic Bass: Bass";
insNames[33] = "Electric Bass (finger): Bass";
insNames[34] = "Electric Bass (pick): Bass";
insNames[35] = "Fretless Bass: Bass";
insNames[36] = "Slap Bass 1: Bass";
insNames[37] = "Slap Bass 2: Bass";
insNames[38] = "Synth Bass 1: Bass";
insNames[39] = "Synth Bass 2: Bass";
insNames[40] = "Violin: Strings";
insNames[41] = "Viola: Strings";
insNames[42] = "Cello: Strings";
insNames[43] = "Contrabass: Strings";
insNames[44] = "Tremolo Strings: Strings";
insNames[45] = "Pizzicato Strings: Strings";
insNames[46] = "Orchestral Harp: Strings";
insNames[47] = "Timpani: Strings";
insNames[48] = "String Ensemble 1: Ensemble";
insNames[49] = "String Ensemble 2: Ensemble";
insNames[50] = "Synth Strings 1: Ensemble";
insNames[51] = "Synth Strings 2: Ensemble";
insNames[52] = "Choir Aahs: Ensemble";
insNames[53] = "Voice Oohs: Ensemble";
insNames[54] = "Synth Choir: Ensemble";
insNames[55] = "Orchestra Hit: Ensemble";
insNames[56] = "Trumpet: Brass";
insNames[57] = "Trombone: Brass";
insNames[58] = "Tuba: Brass";
insNames[59] = "Muted Trumpet: Brass";
insNames[60] = "French Horn: Brass";
insNames[61] = "Brass Section: Brass";
insNames[62] = "Synth Brass 1: Brass";
insNames[63] = "Synth Brass 2: Brass";
insNames[64] = "Soprano Sax: Reed";
insNames[65] = "Alto Sax: Reed";
insNames[66] = "Tenor Sax: Reed";
insNames[67] = "Baritone Sax: Reed";
insNames[68] = "Oboe: Reed";
insNames[69] = "English Horn: Reed";
insNames[70] = "Bassoon: Reed";
insNames[71] = "Clarinet: Reed";
insNames[72] = "Piccolo: Pipe";
insNames[73] = "Flute: Pipe";
insNames[74] = "Recorder: Pipe";
insNames[75] = "Pan Flute: Pipe";
insNames[76] = "Blown bottle: Pipe";
insNames[77] = "Shakuhachi: Pipe";
insNames[78] = "Whistle: Pipe";
insNames[79] = "Ocarina: Pipe";
insNames[80] = "Lead 1 (square): Synth Lead";
insNames[81] = "Lead 2 (sawtooth): Synth Lead";
insNames[82] = "Lead 3 (calliope): Synth Lead";
insNames[83] = "Lead 4 (chiff): Synth Lead";
insNames[84] = "Lead 5 (charang): Synth Lead";
insNames[85] = "Lead 6 (voice): Synth Lead";
insNames[86] = "Lead 7 (fifths): Synth Lead";
insNames[87] = "Lead 8 (bass + lead): Synth Lead";
insNames[88] = "Pad 1 (new age): Synth Pad";
insNames[89] = "Pad 2 (warm): Synth Pad";
insNames[90] = "Pad 3 (polysynth): Synth Pad";
insNames[91] = "Pad 4 (choir): Synth Pad";
insNames[92] = "Pad 5 (bowed): Synth Pad";
insNames[93] = "Pad 6 (metallic): Synth Pad";
insNames[94] = "Pad 7 (halo): Synth Pad";
insNames[95] = "Pad 8 (sweep): Synth Pad";
insNames[96] = "FX 1 (rain): Synth Effects";
insNames[97] = "FX 2 (soundtrack): Synth Effects";
insNames[98] = "FX 3 (crystal): Synth Effects";
insNames[99] = "FX 4 (atmosphere): Synth Effects";
insNames[100] = "FX 5 (brightness): Synth Effects";
insNames[101] = "FX 6 (goblins): Synth Effects";
insNames[102] = "FX 7 (echoes): Synth Effects";
insNames[103] = "FX 8 (sci-fi): Synth Effects";
insNames[104] = "Sitar: Ethnic";
insNames[105] = "Banjo: Ethnic";
insNames[106] = "Shamisen: Ethnic";
insNames[107] = "Koto: Ethnic";
insNames[108] = "Kalimba: Ethnic";
insNames[109] = "Bagpipe: Ethnic";
insNames[110] = "Fiddle: Ethnic";
insNames[111] = "Shanai: Ethnic";
insNames[112] = "Tinkle Bell: Percussive";
insNames[113] = "Agogo: Percussive";
insNames[114] = "Steel Drums: Percussive";
insNames[115] = "Woodblock: Percussive";
insNames[116] = "Taiko Drum: Percussive";
insNames[117] = "Melodic Tom: Percussive";
insNames[118] = "Synth Drum: Percussive";
insNames[119] = "Reverse Cymbal: Percussive";
insNames[120] = "Guitar Fret Noise: Sound effects";
insNames[121] = "Breath Noise: Sound effects";
insNames[122] = "Seashore: Sound effects";
insNames[123] = "Bird Tweet: Sound effects";
insNames[124] = "Telephone Ring: Sound effects";
insNames[125] = "Helicopter: Sound effects";
insNames[126] = "Applause: Sound effects";
insNames[127] = "Gunshot: Sound effects";
function drumTitles() {
    if (drumNamesArray.length == 0) {
        var drumNames = [];
        drumNames[35] = "Bass Drum 2";
        drumNames[36] = "Bass Drum 1";
        drumNames[37] = "Side Stick/Rimshot";
        drumNames[38] = "Snare Drum 1";
        drumNames[39] = "Hand Clap";
        drumNames[40] = "Snare Drum 2";
        drumNames[41] = "Low Tom 2";
        drumNames[42] = "Closed Hi-hat";
        drumNames[43] = "Low Tom 1";
        drumNames[44] = "Pedal Hi-hat";
        drumNames[45] = "Mid Tom 2";
        drumNames[46] = "Open Hi-hat";
        drumNames[47] = "Mid Tom 1";
        drumNames[48] = "High Tom 2";
        drumNames[49] = "Crash Cymbal 1";
        drumNames[50] = "High Tom 1";
        drumNames[51] = "Ride Cymbal 1";
        drumNames[52] = "Chinese Cymbal";
        drumNames[53] = "Ride Bell";
        drumNames[54] = "Tambourine";
        drumNames[55] = "Splash Cymbal";
        drumNames[56] = "Cowbell";
        drumNames[57] = "Crash Cymbal 2";
        drumNames[58] = "Vibra Slap";
        drumNames[59] = "Ride Cymbal 2";
        drumNames[60] = "High Bongo";
        drumNames[61] = "Low Bongo";
        drumNames[62] = "Mute High Conga";
        drumNames[63] = "Open High Conga";
        drumNames[64] = "Low Conga";
        drumNames[65] = "High Timbale";
        drumNames[66] = "Low Timbale";
        drumNames[67] = "High Agogo";
        drumNames[68] = "Low Agogo";
        drumNames[69] = "Cabasa";
        drumNames[70] = "Maracas";
        drumNames[71] = "Short Whistle";
        drumNames[72] = "Long Whistle";
        drumNames[73] = "Short Guiro";
        drumNames[74] = "Long Guiro";
        drumNames[75] = "Claves";
        drumNames[76] = "High Wood Block";
        drumNames[77] = "Low Wood Block";
        drumNames[78] = "Mute Cuica";
        drumNames[79] = "Open Cuica";
        drumNames[80] = "Mute Triangle";
        drumNames[81] = "Open Triangle";
        drumNamesArray = drumNames;
    }
    return drumNamesArray;
}
;
function round1000(nn) {
    return Math.round(1000 * nn) / 1000;
}
function findMeasureSkipByTime(time, measures) {
    let curTime = 0;
    let mm = MMUtil();
    for (let ii = 0; ii < measures.length; ii++) {
        let cumea = measures[ii];
        let measureDurationS = mm.set(cumea.metre).duration(cumea.tempo);
        if (round1000(curTime + measureDurationS) > round1000(time)) {
            let delta = time - curTime;
            if (delta < 0) {
                delta = 0;
            }
            return {
                idx: ii,
                skip: mm.calculate(delta, cumea.tempo)
            };
        }
        curTime = curTime + measureDurationS;
    }
    return null;
}
class DataViewStream {
    constructor(dv) {
        this.position = 0;
        this.buffer = dv;
    }
    readUint8() {
        var n = this.buffer.getUint8(this.position);
        this.position++;
        return n;
    }
    readUint16() {
        var v = this.buffer.getUint16(this.position);
        this.position = this.position + 2;
        return v;
    }
    readVarInt() {
        var v = 0;
        var i = 0;
        var b;
        while (i < 4) {
            b = this.readUint8();
            if (b & 0x80) {
                v = v + (b & 0x7f);
                v = v << 7;
            }
            else {
                return v + b;
            }
            i++;
        }
        throw new Error('readVarInt ' + i);
    }
    readBytes(length) {
        var bytes = [];
        for (var i = 0; i < length; i++) {
            bytes.push(this.readUint8());
        }
        return bytes;
    }
    offset() {
        return this.buffer.byteOffset + this.position;
    }
    end() {
        return this.position == this.buffer.byteLength;
    }
}
function utf8ArrayToString(aBytes) {
    var sView = "";
    for (var nPart, nLen = aBytes.length, nIdx = 0; nIdx < nLen; nIdx++) {
        nPart = aBytes[nIdx];
        sView = sView + String.fromCharCode(nPart > 251 && nPart < 254 && nIdx + 5 < nLen ?
            (nPart - 252) * 1073741824 + (aBytes[++nIdx] - 128 << 24) + (aBytes[++nIdx] - 128 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
            : nPart > 247 && nPart < 252 && nIdx + 4 < nLen ?
                (nPart - 248 << 24) + (aBytes[++nIdx] - 128 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
                : nPart > 239 && nPart < 248 && nIdx + 3 < nLen ?
                    (nPart - 240 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
                    : nPart > 223 && nPart < 240 && nIdx + 2 < nLen ?
                        (nPart - 224 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
                        : nPart > 191 && nPart < 224 && nIdx + 1 < nLen ?
                            (nPart - 192 << 6) + aBytes[++nIdx] - 128
                            :
                                nPart);
    }
    return sView;
}
class MIDIFileHeader {
    constructor(buffer) {
        this.HEADER_LENGTH = 14;
        this.tempoBPM = 120;
        this.changes = [];
        this.meters = [];
        this.lyrics = [];
        this.signs = [];
        this.meterCount = 4;
        this.meterDivision = 4;
        this.keyFlatSharp = 0;
        this.keyMajMin = 0;
        this.lastNonZeroQuarter = 0;
        this.datas = new DataView(buffer, 0, this.HEADER_LENGTH);
        this.format = this.datas.getUint16(8);
        this.trackCount = this.datas.getUint16(10);
    }
    getCalculatedTickResolution(tempo) {
        this.lastNonZeroQuarter = tempo;
        if (this.datas.getUint16(12) & 0x8000) {
            var r = 1000000 / (this.getSMPTEFrames() * this.getTicksPerFrame());
            return r;
        }
        else {
            tempo = tempo || 500000;
            var r = tempo / this.getTicksPerBeat();
            return r;
        }
    }
    get0TickResolution() {
        var tempo = 0;
        if (this.lastNonZeroQuarter) {
            tempo = this.lastNonZeroQuarter;
        }
        else {
            tempo = 60000000 / this.tempoBPM;
        }
        if (this.datas.getUint16(12) & 0x8000) {
            var r = 1000000 / (this.getSMPTEFrames() * this.getTicksPerFrame());
            return r;
        }
        else {
            tempo = tempo || 500000;
            var r = tempo / this.getTicksPerBeat();
            return r;
        }
    }
    getTicksPerBeat() {
        var divisionWord = this.datas.getUint16(12);
        return divisionWord;
    }
    getTicksPerFrame() {
        const divisionWord = this.datas.getUint16(12);
        return divisionWord & 0x00ff;
    }
    getSMPTEFrames() {
        const divisionWord = this.datas.getUint16(12);
        let smpteFrames;
        smpteFrames = divisionWord & 0x7f00;
        if (smpteFrames == 29) {
            return 29.97;
        }
        else {
            return smpteFrames;
        }
    }
}
class MIDIIImportMusicPlugin {
    constructor() {
        this.callbackID = '';
        this.parsedProject = null;
        this.init();
    }
    init() {
        window.addEventListener('message', this.receiveHostMessage.bind(this), false);
        window.parent.postMessage({
            dialogID: this.callbackID,
            pluginData: this.parsedProject,
            done: false
        }, '*');
    }
    sendImportedMIDIData() {
        if (this.parsedProject) {
            var oo = {
                dialogID: this.callbackID,
                pluginData: this.parsedProject,
                done: true
            };
            window.parent.postMessage(oo, '*');
        }
        else {
            alert('No parsed data');
        }
    }
    loadMIDIfile(inputFile) {
        var file = inputFile.files[0];
        var fileReader = new FileReader();
        let me = this;
        fileReader.onload = function (progressEvent) {
            if (progressEvent != null) {
                let title = file.name;
                let dat = '' + file.lastModifiedDate;
                try {
                    let last = file.lastModifiedDate;
                    dat = '' + last.getFullYear();
                    if (last.getMonth() < 10) {
                        dat = dat + '-' + last.getMonth();
                    }
                    else {
                        dat = dat + '-0' + last.getMonth();
                    }
                    if (last.getDate() < 10) {
                        dat = dat + '-' + last.getDate();
                    }
                    else {
                        dat = dat + '-0' + last.getDate();
                    }
                }
                catch (xx) {
                    console.log(xx);
                }
                let comment = ', ' + file.size / 1000 + 'kb, ' + dat;
                var arrayBuffer = progressEvent.target.result;
                var midiParser = newMIDIparser2(arrayBuffer);
                me.parsedProject = midiParser.convertProject(title, comment);
            }
        };
        fileReader.readAsArrayBuffer(file);
    }
    receiveHostMessage(par) {
        let message = par.data;
        if (this.callbackID) {
        }
        else {
            this.callbackID = message.hostData;
        }
    }
}
function newMIDIparser2(arrayBuffer) {
    return new MidiParser(arrayBuffer);
}
class MIDIFileTrack {
    constructor(buffer, start) {
        this.HDR_LENGTH = 8;
        this.chords = [];
        this.datas = new DataView(buffer, start, this.HDR_LENGTH);
        this.trackLength = this.datas.getUint32(4);
        this.datas = new DataView(buffer, start, this.HDR_LENGTH + this.trackLength);
        this.trackContent = new DataView(this.datas.buffer, this.datas.byteOffset + this.HDR_LENGTH, this.datas.byteLength - this.HDR_LENGTH);
        this.trackevents = [];
        this.trackVolumePoints = [];
        this.programChannel = [];
    }
}
//# sourceMappingURL=midimusic.js.map