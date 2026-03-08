var OCTAVE_1024 = 1.0006771307; //Math.exp(Math.log(2)/1024);
var OperatorDX7 = /** @class */ (function () {
    //freqRatio: number = 1;
    function OperatorDX7(cntxt) {
        this.minimalDelta = 0.001;
        //outOperators: OperatorDX7[] = [];
        //outDestination: AudioNode | null = null;
        this.onNotOff = false;
        this.velocitySens0_7 = 0;
        this.level0_99 = 0;
        this.lfoAmpModSens_3_3 = 0;
        this.freqCoarse0_31 = 0;
        this.freqCoarseFixed0_3 = 0;
        this.freqFine0_99 = 0;
        this.detune_7_7 = 0;
        this.isModulator = false;
        this.adsr = {
            attackDuration: 0.01,
            attackVolume: 1,
            decayDuration: 0.02,
            decayVolume: 0.5,
            releaseDuration: 0.2
        };
        this.ocntxt = cntxt;
        //this.oenvelope = this.ocntxt.createGain();
        this.envelope = new EnvelopeNode(this.ocntxt);
        this.osc = this.ocntxt.createOscillator();
        //this.osc.connect(this.oenvelope);
        this.osc.connect(this.envelope.envelopeGain);
        this.outGain = this.ocntxt.createGain();
        this.envelope.envelopeGain.connect(this.outGain);
        this.envelope.down0now();
        this.osc.start(this.ocntxt.currentTime + this.envelope.minTimeDelta);
    }
    /*setupCarrier(){
        console.log('setupCarrier');
    }*/
    /*setupModulator(){
        console.log('setupModulator');
    }*/
    /*outputToOperator(to: OperatorDX7) {
        this.outOperators.push(to);
    }
    outputToDestination(destination: AudioNode) {
        this.outDestination = destination;
    }*/
    OperatorDX7.prototype.frequencyFromNoteNumber = function (note) {
        return 440 * Math.pow(2, (note - 69) / 12);
    };
    ;
    OperatorDX7.prototype.startOperator = function (level1, rate1, level2, rate2, level3, rate3, level4, rate4, when, duration, pitch, oscMode, freqCoarse, freqFine, detune, volume) {
        if (this.onNotOff) {
            //console.log('startOperator', when, pitch, ('' + freqCoarse + '.' + freqFine + '/' + detune), ('' + volume + '%'));
            /*
                        this.oenvelope.disconnect();
                        this.oenvelope.gain.setValueAtTime(0, when);
                        this.oenvelope.gain.linearRampToValueAtTime(this.adsr.attackVolume, when + this.adsr.attackDuration);
                        this.oenvelope.gain.linearRampToValueAtTime(this.adsr.decayVolume, when + this.adsr.attackDuration + this.adsr.decayDuration);
                        this.oenvelope.gain.linearRampToValueAtTime(this.adsr.decayVolume, when + duration);
                        this.oenvelope.gain.linearRampToValueAtTime(0, when + duration + this.adsr.releaseDuration);
                        if (this.outDestination) {
                            this.oenvelope.connect(this.outDestination);
                        }
            */
            var detuneRatio = Math.pow(OCTAVE_1024, detune);
            //this.envelope.setLevelRate(88, 90, 33, 80, 99, 70, 55, 60, when, duration);
            this.envelope.setLevelRate(level1, rate1, level2, rate2, level3, rate3, level4, rate4, when, duration, volume);
            if (freqCoarse == 0)
                freqCoarse = 0.5;
            //let freqRatio = (freqCoarse || 0.5) * (1 + freqFine / 100);
            var freqRatio = freqCoarse * (1 + freqFine / 100);
            var opefrequency = detuneRatio * freqRatio * this.frequencyFromNoteNumber(pitch);
            console.log('opefrequency', opefrequency);
            if (oscMode > 0) {
                opefrequency = Math.pow(10, freqCoarse % 4) * (1 + (freqFine / 99) * 8.772);
                ;
            }
            /*console.log('freq', freqRatio
                , this.frequencyFromNoteNumber(pitch), '>', freqRatio * this.frequencyFromNoteNumber(pitch), '>', opefrequency
                , ':', detuneRatio, detune);
*/
            this.osc.frequency.setValueAtTime(opefrequency, this.ocntxt.currentTime);
            //this.osc.start(when);
            //this.osc.stop(when + duration + this.adsr.releaseDuration);
            //console.log('osc',when,(when + duration + this.adsr.releaseDuration));
            //this.outGain.gain.setValueAtTime(outputLevel016 / 16, this.ocntxt.currentTime);
            if (this.isModulator) {
                this.outGain.gain.setValueAtTime(4000 * volume / 100, this.ocntxt.currentTime);
            }
            else {
                this.outGain.gain.setValueAtTime(volume / 100, this.ocntxt.currentTime);
            }
        }
    };
    OperatorDX7.prototype.connectToOutputNode = function (outNode) {
        this.outGain.connect(outNode);
    };
    OperatorDX7.prototype.connectSendToOperator = function (opDX7) {
        //this.outGain.connect(opDX7.osc.detune);
        //this.outGain.connect(opDX7.outGain);
        //this.isModulator = true;
        this.outGain.connect(opDX7.osc.frequency);
    };
    return OperatorDX7;
}());
