//console.log('test sinewave plugin v1.01');
class SimpleSinePerformer implements MZXBX_AudioPerformerPlugin {
    velocityRatio = 0.001;
    preRamp = 0.01;
    afterRamp = 0.05;
    rampZero = 0.000001;
    out: GainNode;
    audioContext: AudioContext;
    poll: { gainNode: GainNode, oscillatorNode: OscillatorNode | null; end: number }[];
    type: OscillatorType = 'sine';
    reset(context: AudioContext, parameters: string): boolean {
        if (!(this.out)) {
            this.audioContext = context;
            this.out = this.audioContext.createGain();
            this.poll = [];
            if (parameters == 'sine') this.type = 'sine';
            if (parameters == 'square') this.type = 'square';
            if (parameters == 'sawtooth') this.type = 'sawtooth';
            if (parameters == 'triangle') this.type = 'triangle';
        }
        return true;
    }
    schedule(when: number, volume: number, pitch: number, slides: MZXBX_SlideItem[]): void {
        //console.log('sine',volume,volume * this.velocityRatio);
        let it = this.takePollItem();
        it.oscillatorNode = this.audioContext.createOscillator();
        it.oscillatorNode.type = this.type;
        //it.oscillatorNode.type = 'square';
        it.oscillatorNode.frequency.setValueAtTime(this.freq(pitch), when);
        let duration = 0;
        for (let i = 1; i < slides.length; i++) {
            duration = duration + slides[i].duration;
        }
        let nextPointSeconds = when + slides[0].duration;
        for (let i = 1; i < slides.length; i++) {
            it.oscillatorNode.frequency.linearRampToValueAtTime(this.freq(slides[i].delta + pitch), nextPointSeconds);
            nextPointSeconds = nextPointSeconds + slides[i].duration;
        }
        it.oscillatorNode.connect(it.gainNode);
        it.oscillatorNode.start(when - this.preRamp);
        it.oscillatorNode.stop(nextPointSeconds + this.afterRamp);
        it.gainNode.gain.cancelScheduledValues(when - this.preRamp);
        it.gainNode.gain.exponentialRampToValueAtTime(this.rampZero, when - this.preRamp);
        it.gainNode.gain.exponentialRampToValueAtTime(volume * this.velocityRatio, when);
        it.gainNode.gain.exponentialRampToValueAtTime(volume * this.velocityRatio, nextPointSeconds);
        it.gainNode.gain.exponentialRampToValueAtTime(this.rampZero, nextPointSeconds + this.afterRamp);
        it.end = nextPointSeconds + this.preRamp + this.afterRamp;
    }
    output(): AudioNode | null {
        return this.out;
    }
    freq(key: number): number {
        let O4 = [261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392.00, 415.30, 440.00, 466.16, 493.88];
        let half = Math.floor(key % 12);
        let octave = Math.floor(key / 12);
        let freq0 = O4[half] / (2 * 2 * 2 * 2);
        return freq0 * Math.pow(2, octave);
    }
    cancel(): void {
        for (let i = 0; i < this.poll.length; i++) {
            let o = this.poll[i].oscillatorNode;
            if (o) {
                o.stop();
            }
        }
    }
    takePollItem(): { gainNode: GainNode, oscillatorNode: OscillatorNode | null, end: number } {
        for (let i = 0; i < this.poll.length; i++) {
            if (this.poll[i].end < this.audioContext.currentTime && this.poll[i].end > -1) {
                let o = this.poll[i].oscillatorNode;
                if (o) {
                    o.disconnect(this.poll[i].gainNode);
                }
                return this.poll[i];
            }
        }
        let it = { gainNode: this.audioContext.createGain(), oscillatorNode: null, end: -1 };
        it.gainNode.connect(this.out);
        this.poll.push(it);
        return it;
    }
}
function testPluginSingleWave(): MZXBX_AudioPerformerPlugin {
    return new SimpleSinePerformer();
}
