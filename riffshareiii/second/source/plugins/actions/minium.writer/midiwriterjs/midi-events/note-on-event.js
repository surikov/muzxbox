"use strict";
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
