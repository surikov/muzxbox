var VoiceDX7 = /** @class */ (function () {
    function VoiceDX7(destination, aContext) {
        this.dx7voxData = epiano1preset; //defaultBrass1test;
        console.log('new VoiceDX7', aContext.currentTime, 'algorithm', this.dx7voxData.algorithm, matrixAlgorithmsDX7[this.dx7voxData.algorithm - 1]);
        //this.note = note;
        //this.velocity = velocity;
        this.voContext = aContext;
        this.voxoutput = this.voContext.createGain();
        this.voxoutput.connect(destination);
        this.operators = [];
        this.operators[0] = new OperatorDX7(this.voContext);
        this.operators[1] = new OperatorDX7(this.voContext);
        this.operators[2] = new OperatorDX7(this.voContext);
        this.operators[3] = new OperatorDX7(this.voContext);
        this.operators[4] = new OperatorDX7(this.voContext);
        this.operators[5] = new OperatorDX7(this.voContext);
        //let scheme: ConnectionSchemeDX7 = matrixAlgorithmsDX7[3];
        //this.connectOperators(scheme);
        //this.operators[0].onNotOff = true;
        //this.operators[0].outDestination = destination;
        //this.operators[1].onNotOff = false;
        //this.operators[1].freqRatio = 1.5;
        //this.operators[1].outDestination = destination;
        for (var ii = 0; ii < this.operators.length; ii++) {
            this.operators[ii].onNotOff = true;
        }
        this.connectMixOperators(matrixAlgorithmsDX7[this.dx7voxData.algorithm - 1]);
    }
    /*setupMix(algoIdx: number) {
        let info = matrixAlgorithmsDX7[algoIdx];

    }*/
    VoiceDX7.prototype.startPlayNote = function (when, duration, pitch) {
        console.log(this.dx7voxData.name, 'startPlayNote', when, 'duration', duration, 'pitch', pitch, 'now time', this.voContext.currentTime);
        for (var ii = 0; ii < this.operators.length; ii++) {
            //for (let ii = 0; ii < 1; ii++) {
            var operadata = this.dx7voxData.operators[ii];
            if (operadata.enabled) {
                console.log('startOperator', ii, ('' + operadata.freqCoarse + '.' + operadata.freqFine + '/' + operadata.detune), ('' + operadata.volume + '%'));
                this.operators[ii].startOperator(operadata.levels[0], operadata.rates[0], operadata.levels[1], operadata.rates[1], operadata.levels[2], operadata.rates[2], operadata.levels[3], operadata.rates[3], when, duration, pitch, operadata.oscMode, operadata.freqCoarse, operadata.freqFine, operadata.detune, operadata.volume);
            }
        }
    };
    /*test() {
        console.log('VoiceDX7 test');
    }*/
    VoiceDX7.prototype.connectMixOperators = function (scheme) {
        //console.log(scheme.outputMix);
        for (var ii = 0; ii < scheme.outputMix.length; ii++) {
            var outIdx = scheme.outputMix[ii];
            this.operators[outIdx].connectToOutputNode(this.voxoutput);
            console.log('' + (1 + outIdx) + ' -> out');
        }
        //console.log(scheme.modulationMatrix);
        for (var ii = 0; ii < scheme.modulationMatrix.length; ii++) {
            var carrier = this.operators[ii];
            var modulators = scheme.modulationMatrix[ii];
            for (var mm = 0; mm < modulators.length; mm++) {
                var modulatorIdx = modulators[mm];
                this.operators[modulatorIdx].connectSendToOperator(carrier);
                console.log('' + (modulatorIdx + 1) + ' -> ' + (ii + 1));
            }
        }
    };
    return VoiceDX7;
}());
