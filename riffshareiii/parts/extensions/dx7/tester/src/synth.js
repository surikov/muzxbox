var SynthDX7 = /** @class */ (function () {
    function SynthDX7(audioContext) {
        this.testVox = null;
        console.log('new SynthDX7');
        this.moContext = audioContext;
        this.output = this.moContext.createGain();
        this.output.connect(this.moContext.destination);
    }
    /*createVoice(): VoiceDX7 {
        return new VoiceDX7();
    }*/
    SynthDX7.prototype.test = function () {
        console.log('SynthDX7 test');
        if (this.testVox == null) {
            this.testVox = new VoiceDX7(this.output, this.moContext);
        }
        this.testVox.startPlayNote(this.moContext.currentTime + 0.2, 2, 12 * 5);
    };
    return SynthDX7;
}());
