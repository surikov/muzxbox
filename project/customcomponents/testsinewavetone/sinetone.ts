class DefaultBaseOscillatorPlayer {
    velocityRatio = 0.33;
    preRamp = 0.01;
    afterRamp = 0.05;
    rampZero = 0.000001;
    audioContext: AudioContext;
    poll: { gainNode: GainNode, oscillatorNode: OscillatorNode | null; end: number }[];
    setup(context: AudioContext): void {
        if (!(this.audioContext)) {
            this.audioContext = context;
            this.poll = [];
        }
    }
    send(when: number, volume: number, pitch: number, slides: MZXBX_SlideItem[], target: AudioNode, type: OscillatorType): void {
        //console.log(volume,volume*this.velocityRatio);
        let it = this.takePollItem(target);
        it.oscillatorNode = this.audioContext.createOscillator();
        it.oscillatorNode.type = type;
        it.oscillatorNode.frequency.setValueAtTime(this.freq(pitch), when- this.preRamp);
        let duration = 0;
        for (let i = 1; i < slides.length; i++) {
            duration = duration + slides[i].duration;
        }
        let nextPointSeconds = when + slides[0].duration;
        if (slides.length > 0) {
            for (let i = 1; i < slides.length; i++) {
                it.oscillatorNode.frequency.linearRampToValueAtTime(this.freq(slides[i].delta + pitch), nextPointSeconds);
                nextPointSeconds = nextPointSeconds + slides[i].duration;
            }
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
                o.disconnect(this.poll[i].gainNode);
            }
        }
    }
    takePollItem(target: AudioNode): { gainNode: GainNode, oscillatorNode: OscillatorNode | null, end: number } {
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
        it.gainNode.connect(target);
        this.poll.push(it);
        return it;
    }
}
class SimpleSinePerformer implements MZXBX_AudioPerformerPlugin {
    out: GainNode;
    type: OscillatorType = 'sine';
    player: DefaultBaseOscillatorPlayer;
    reset(context: AudioContext, parameters: string): boolean {
        if (this.player) {
            //
        } else {
            this.player = new DefaultBaseOscillatorPlayer();
            this.player.setup(context);
			this.out = context.createGain();
        }
        if (parameters == 'sine') this.type = 'sine';
		if (parameters == 'square') this.type = 'square';
		if (parameters == 'sawtooth') this.type = 'sawtooth';
		if (parameters == 'triangle') this.type = 'triangle';
		//console.log('reset SimpleSinePerformer',this);
        return true;
    }
    schedule(when: number, volume: number, pitch: number, slides: MZXBX_SlideItem[]): void {
        this.player.send(when, volume, pitch, slides, this.out, this.type);
    }
    output(): AudioNode | null {
        return this.out;
    }
    cancel(): void {
        this.player.cancel();
    }
}
function testPluginSingleWave(): MZXBX_AudioPerformerPlugin {
    return new SimpleSinePerformer();
}
