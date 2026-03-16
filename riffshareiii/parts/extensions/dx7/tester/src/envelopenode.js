//let slopeRatio = 1;
//function fullSlopeDuration(preLevel: number, nextLevel: number, sloperate: number) {
/*
    var rate_scaling = 0;
    let qr = Math.min(63, rate_scaling + ((sloperate * 41) >> 6)); // 5 -> 3; 49 -> 31; 99 -> 63
    let decayIncrement = Math.pow(2, qr / 4) / 2048;
    console.log(decayIncrement, '=', Math.pow(2, sloperate * 16 / 100 - 11), 1 / Math.pow(2, sloperate * 16 / 100 - 9));
    
    let rate = (sloperate > 0) ? sloperate : 1;
    let volDiff = Math.abs(preLevel - nextLevel) / 100;
    let radians = rate * ((Math.PI * 0.5) / 100);
    let timeDiff = volDiff / Math.tan(radians);//a = b / tg(β)
    return slopeRatio * timeDiff;
    */
//let part = Math.abs(preLevel - nextLevel) / 100;
//let fullH = 1 / Math.pow(2, sloperate * 16 / 100 - 9);
//return part * fullH;
//}
/*
console.log(1, ':', fullSlopeDuration(0, 99, 96));
console.log(2, ':', fullSlopeDuration(96, 75, 25));
console.log(3, ':', fullSlopeDuration(75, 0, 25));
*/
/*
var OUTPUT_LEVEL_TABLE = [
    0.000000, 0.000337, 0.000476, 0.000674, 0.000952, 0.001235, 0.001602, 0.001905, 0.002265, 0.002694,
    0.003204, 0.003810, 0.004531, 0.005388, 0.006408, 0.007620, 0.008310, 0.009062, 0.010776, 0.011752,
    0.013975, 0.015240, 0.016619, 0.018123, 0.019764, 0.021552, 0.023503, 0.025630, 0.027950, 0.030480,
    0.033238, 0.036247, 0.039527, 0.043105, 0.047006, 0.051261, 0.055900, 0.060960, 0.066477, 0.072494,
    0.079055, 0.086210, 0.094012, 0.102521, 0.111800, 0.121919, 0.132954, 0.144987, 0.158110, 0.172420,
    0.188025, 0.205043, 0.223601, 0.243838, 0.265907, 0.289974, 0.316219, 0.344839, 0.376050, 0.410085,
    0.447201, 0.487676, 0.531815, 0.579948, 0.632438, 0.689679, 0.752100, 0.820171, 0.894403, 0.975353,
    1.063630, 1.159897, 1.264876, 1.379357, 1.504200, 1.640341, 1.788805, 1.950706, 2.127260, 2.319793,
    2.529752, 2.758714, 3.008399, 3.280683, 3.577610, 3.901411, 4.254519, 4.639586, 5.059505, 5.517429,
    6.016799, 6.561366, 7.155220, 7.802823, 8.509039, 9.279172, 10.11901, 11.03486, 12.03360, 13.12273
];*/
var EnvelopeNode = /** @class */ (function () {
    function EnvelopeNode(ctx) {
        this.minTimeDelta = 0.005;
        this.maxReleaseDelta = 0.5;
        //slopeRatio = 0.25;
        this.slopes = [];
        this.volumes = [];
        this.doneTime = 0;
        this.envelopeContext = ctx;
        this.envelopeGain = this.envelopeContext.createGain();
        this.down0now();
    }
    EnvelopeNode.prototype.rate99Duration = function (r99, from, to) {
        var duration = 3 / Math.pow(2, 16 * r99 / 100 - 7);
        if (from < to) {
            //console.log(from,to,'up',r99,duration/2);
            return duration * 0.5;
        }
        else {
            //console.log(from,to,r99,duration);
            return duration;
        }
        //console.log(r99,duration);
        //return duration;
    };
    EnvelopeNode.prototype.setupEnvelope = function (rates, levels) {
        this.slopes[0] = this.rate99Duration(rates[0], levels[3], levels[0]);
        this.slopes[1] = this.rate99Duration(rates[1], levels[0], levels[1]);
        this.slopes[2] = this.rate99Duration(rates[2], levels[1], levels[2]);
        this.slopes[3] = this.rate99Duration(rates[3], levels[2], levels[3]);
        this.volumes[0] = levels[0] / 100;
        this.volumes[1] = levels[1] / 100;
        this.volumes[2] = levels[2] / 100;
        this.volumes[3] = levels[3] / 100;
    };
    // Helper to convert DX7 "Rate" (0-99) to seconds
    // Higher rate = faster speed = shorter time
    /*rateToTime(rate: number): number {
        let tt = (100 - rate) * 0.05;
        if (tt > 0.001) {
            return tt;
        } else {
            return 0.001;
        }
        //return Math.max(0.001, (100 - rate) * 0.05);
    }*/
    EnvelopeNode.prototype.setupSlope = function (when, duration, from, to) {
        if (from < to) {
            //this.envelopeGain.gain.exponentialRampToValueAtTime(to, when + duration);
            this.envelopeGain.gain.linearRampToValueAtTime(to, when + duration);
        }
        else {
            this.envelopeGain.gain.linearRampToValueAtTime(to, when + duration);
        }
    };
    EnvelopeNode.prototype.startEnvelope = function (when, wholeDuration) {
        //this.envelopeGain.gain.setValueAtTime(1, when);
        //this.envelopeGain.gain.setValueAtTime(0, when + wholeDuration);
        console.log('volumes', this.volumes, 'slopes', this.slopes);
        this.envelopeGain.gain.linearRampToValueAtTime(this.volumes[3], when);
        var attackDuration = this.slopes[0] * Math.abs(this.volumes[3] - this.volumes[0]);
        this.setupSlope(when, attackDuration, this.volumes[3], this.volumes[0]);
        var decayDuration = this.slopes[1] * Math.abs(this.volumes[0] - this.volumes[1]);
        if (attackDuration + decayDuration < wholeDuration) {
            this.setupSlope(when + attackDuration, decayDuration, this.volumes[0], this.volumes[1]);
            var sustainDuration = this.slopes[2] * Math.abs(this.volumes[1] - this.volumes[2]);
            if (attackDuration + decayDuration + sustainDuration > wholeDuration) {
                this.envelopeGain.gain.cancelAndHoldAtTime(when + wholeDuration);
            }
        }
        else {
            this.envelopeGain.gain.cancelAndHoldAtTime(when + wholeDuration);
        }
        var releaseDuration = this.slopes[3] * Math.abs(this.volumes[2] - this.volumes[3]);
        if (releaseDuration > this.maxReleaseDelta) {
            releaseDuration = this.maxReleaseDelta;
        }
        this.envelopeGain.gain.linearRampToValueAtTime(0, when + wholeDuration + releaseDuration);
    };
    EnvelopeNode.prototype.down0now = function () {
        this.envelopeGain.gain.cancelScheduledValues(this.envelopeContext.currentTime);
        this.envelopeGain.gain.value = 0;
    };
    return EnvelopeNode;
}());
