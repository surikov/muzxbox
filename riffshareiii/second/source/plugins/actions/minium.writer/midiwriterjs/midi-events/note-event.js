"use strict";
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
