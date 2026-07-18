var DX7Synthesizer = /** @class */ (function () {
    function DX7Synthesizer(audioContext) {
        this.cache = [];
        this.audioContext = audioContext;
        this.output = this.audioContext.createGain();
    }
    DX7Synthesizer.prototype.checkCache = function () {
        if (this.cache.length > 25) {
            for (var ii = 0; ii < this.cache.length; ii++) {
                if (this.cache[ii].locktime < this.audioContext.currentTime) {
                    this.cache[ii].disonnectOperators();
                    this.cache[ii].mixID = 0;
                    //console.log('free',ii);
                }
            }
        }
    };
    DX7Synthesizer.prototype.takeVox = function (mid) {
        this.checkCache();
        for (var ii = 0; ii < this.cache.length; ii++) {
            if (this.cache[ii].locktime < this.audioContext.currentTime && mid == this.cache[ii].mixID) {
                //console.log('found vox', ii);
                return this.cache[ii];
            }
        }
        for (var ii = 0; ii < this.cache.length; ii++) {
            if (this.cache[ii].locktime < this.audioContext.currentTime && this.cache[ii].mixID == 0) {
                //console.log('reused vox', ii);
                this.cache[ii].mixID = mid;
                this.cache[ii].connectOperators();
                return this.cache[ii];
            }
        }
        //console.log('new vox', this.audioContext.currentTime, this.cache);
        var vx = new DX7Voice(mid, this.audioContext, this.output);
        this.cache.push(vx);
        return vx;
    };
    DX7Synthesizer.prototype.scheduleStrum = function (preset, when, pitches, slides) {
        for (var ii = 0; ii < pitches.length; ii++) {
            var vox = this.takeVox(preset.mixID);
            vox.startPlayNote(preset, when, slides.reduce(function (sm, cur) { return sm + cur.duration; }, 0), pitches[ii]);
        }
    };
    return DX7Synthesizer;
}());
