var SynthDX7 = /** @class */ (function () {
    //testVox: VoiceDX7 | null = null;
    function SynthDX7(audioContext) {
        console.log('new SynthDX7');
        this.audioContext = audioContext;
        this.output = this.audioContext.createGain();
        this.output.connect(this.audioContext.destination);
    }
    /*createVoice(): VoiceDX7 {
        return new VoiceDX7();
    }*/
    SynthDX7.prototype.test = function () {
        console.log('SynthDX7 test');
        var testVox = new VoiceDX7(this.output, this.audioContext);
        testVox.setupVoice(epiano1preset);
        testVox.startPlayNote(this.audioContext.currentTime + 0.54321, 2, 12 * 5);
    };
    return SynthDX7;
}());
