"use strict";
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
