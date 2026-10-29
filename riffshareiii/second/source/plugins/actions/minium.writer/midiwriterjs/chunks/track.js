"use strict";
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
