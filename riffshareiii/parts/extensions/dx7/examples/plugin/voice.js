var matrixConnectionAlgorithmsDX7 = [
    //stacking
    { outputMix: [0, 2], modulationMatrix: [[1], [], [3], [4], [5], []], feedbackMatrix: [[], [], [], [], [], [5]] }, //1
    { outputMix: [0, 2], modulationMatrix: [[1], [], [3], [4], [5], []], feedbackMatrix: [[], [1], [], [], [], []] }, //2
    { outputMix: [0, 3], modulationMatrix: [[1], [2], [], [4], [5], []], feedbackMatrix: [[], [], [], [], [], [5]] }, //3
    { outputMix: [0, 3], modulationMatrix: [[1], [2], [], [4], [5], []], feedbackMatrix: [[], [], [], [], [], [3]] }, //4
    { outputMix: [0, 2, 4], modulationMatrix: [[1], [], [3], [], [5], []], feedbackMatrix: [[], [], [], [], [], [5]] }, //5 e.piano 1
    { outputMix: [0, 2, 4], modulationMatrix: [[1], [], [3], [], [5], []], feedbackMatrix: [[], [], [], [], [], [4]] }, //6
    //branch
    { outputMix: [0, 2], modulationMatrix: [[1], [], [3, 4], [], [5], []], feedbackMatrix: [[], [], [], [], [], [5]] }, //7
    { outputMix: [0, 2], modulationMatrix: [[1], [], [3, 4], [], [5], []], feedbackMatrix: [[], [], [], [3], [], []] }, //8
    { outputMix: [0, 2], modulationMatrix: [[1], [], [3, 4], [], [5], []], feedbackMatrix: [[], [1], [], [], [], []] }, //9
    { outputMix: [0, 3], modulationMatrix: [[1], [2], [], [4, 5], [], []], feedbackMatrix: [[], [], [2], [], [], []] }, //10
    { outputMix: [0, 3], modulationMatrix: [[1], [2], [], [4, 5], [], []], feedbackMatrix: [[], [], [], [], [], [5]] }, //11
    { outputMix: [0, 2], modulationMatrix: [[1], [], [3, 4, 5], [], [], []], feedbackMatrix: [[], [1], [], [], [], []] }, //12
    { outputMix: [0, 2], modulationMatrix: [[1], [], [3, 4, 5], [], [], []], feedbackMatrix: [[], [], [], [], [], [5]] }, //13
    { outputMix: [0, 2], modulationMatrix: [[1], [], [3], [4, 5], [], []], feedbackMatrix: [[], [], [], [], [], [5]] }, //14
    { outputMix: [0, 2], modulationMatrix: [[1], [], [3], [4, 5], [], []], feedbackMatrix: [[], [1], [], [], [], []] }, //15
    { outputMix: [0], modulationMatrix: [[1, 2, 4], [], [3], [], [5], []], feedbackMatrix: [[], [], [], [], [], [5]] }, //16 
    { outputMix: [0], modulationMatrix: [[1, 2, 4], [], [3], [], [5], []], feedbackMatrix: [[], [1], [], [], [], []] }, //17
    { outputMix: [0], modulationMatrix: [[1, 2, 3], [], [2], [], [5], []], feedbackMatrix: [[], [], [], [4], [], []] }, //18
    //rooting/tower combi
    { outputMix: [0, 3, 4], modulationMatrix: [[1], [2], [], [5], [5], []], feedbackMatrix: [[], [], [], [], [], [5]] }, //19
    { outputMix: [0, 1, 3], modulationMatrix: [[2], [2], [], [4, 5], [], []], feedbackMatrix: [[], [], [2], [], [], []] }, //20
    { outputMix: [0, 1, 3, 4], modulationMatrix: [[2], [2], [], [5], [5], []], feedbackMatrix: [[], [], [2], [], [], []] }, //21
    { outputMix: [0, 2, 3, 4], modulationMatrix: [[1], [], [5], [5], [5], []], feedbackMatrix: [[], [], [], [], [], [5]] }, //22 bass 1
    { outputMix: [0, 1, 3, 4], modulationMatrix: [[], [2], [], [5], [5], []], feedbackMatrix: [[], [], [], [], [], [5]] }, //23 vibe 1
    { outputMix: [0, 1, 2, 3, 4], modulationMatrix: [[], [], [5], [5], [5], []], feedbackMatrix: [[], [], [], [], [], [5]] }, //24
    { outputMix: [0, 1, 2, 3, 4], modulationMatrix: [[], [], [], [5], [5], []], feedbackMatrix: [[], [], [], [], [], [5]] }, //25
    //branch/tower combi
    { outputMix: [0, 1, 3], modulationMatrix: [[], [2], [], [4, 5], [], []], feedbackMatrix: [[], [], [], [], [], [5]] }, //26
    { outputMix: [0, 1, 3], modulationMatrix: [[], [2], [], [4, 5], [], []], feedbackMatrix: [[], [], [2], [], [], []] }, //27
    { outputMix: [0, 2, 5], modulationMatrix: [[1], [], [3], [4], [], []], feedbackMatrix: [[], [], [], [], [4], []] }, //28
    { outputMix: [0, 1, 2, 4], modulationMatrix: [[], [], [3], [], [5], []], feedbackMatrix: [[], [], [], [], [], [5]] }, //29
    { outputMix: [0, 1, 2, 5], modulationMatrix: [[], [], [3], [4], [], []], feedbackMatrix: [[], [], [], [], [4], []] }, //30
    { outputMix: [0, 1, 2, 3, 4], modulationMatrix: [[], [], [], [], [5], []], feedbackMatrix: [[], [], [], [], [], [5]] }, //31
    { outputMix: [0, 1, 2, 3, 4, 5], modulationMatrix: [[], [], [], [], [], []], feedbackMatrix: [[], [], [], [], [], [5]] } //32 e.organ 1
];
var DX7Voice = /** @class */ (function () {
    function DX7Voice(mixID, audioContext, to) {
        this.locktime = 0;
        this.mixID = mixID;
        this.audioContext = audioContext;
        this.output = this.audioContext.createGain();
        this.output.connect(to);
        this.output.gain.value = 0.125; //0.33;//0.25;//0.125;
        this.operators = [
            new DX7Operator(this.audioContext),
            new DX7Operator(this.audioContext),
            new DX7Operator(this.audioContext),
            new DX7Operator(this.audioContext),
            new DX7Operator(this.audioContext),
            new DX7Operator(this.audioContext)
        ];
        this.connectOperators();
    }
    DX7Voice.prototype.disonnectOperators = function () {
        for (var ii = 0; ii < 6; ii++) {
            this.operators[ii].output.disconnect();
        }
        //this.connectOperators();
        this.mixID = 0;
    };
    DX7Voice.prototype.connectOperators = function () {
        //console.log(this.mixID, this.matrixConnectionAlgorithmsDX7[this.mixID]);
        var mix = matrixConnectionAlgorithmsDX7[this.mixID - 1];
        for (var cid = 0; cid < mix.modulationMatrix.length; cid++) {
            var carrier = this.operators[cid];
            var modulatorIds = mix.modulationMatrix[cid];
            for (var mm = 0; mm < modulatorIds.length; mm++) {
                var mid = modulatorIds[mm];
                var modulator = this.operators[mid];
                modulator.output.connect(carrier.modulationLevel);
                /*if (mid == cid) {
                    modulator.output.connect(carrier.feedbackLevel);
                    //console.log((1 + mid), 'feedback');
                } else {
                    modulator.output.connect(carrier.modulationLevel);
                    //console.log((1 + mid), 'to', (1 + cid));
                }*/
            }
        }
        for (var cid = 0; cid < mix.feedbackMatrix.length; cid++) {
            var carrier = this.operators[cid];
            var fbIds = mix.modulationMatrix[cid];
            for (var ff = 0; ff < fbIds.length; ff++) {
                var fid = fbIds[ff];
                var fbmodulator = this.operators[fid];
                fbmodulator.output.connect(carrier.feedbackLevel);
            }
        }
        for (var ii = 0; ii < mix.outputMix.length; ii++) {
            var outIdx = mix.outputMix[ii];
            this.operators[outIdx].output.connect(this.output);
            //console.log((1 + outIdx), 'out');
        }
    };
    DX7Voice.prototype.startPlayNote = function (preset, when, duration, note) {
        //this.reConnectOperators();//preset);
        for (var ii = 0; ii < 6; ii++) {
            if (preset.operators[ii].enabled) {
                var frequency = preset.operators[ii].constantFrequency;
                if (!(frequency)) {
                    var noteFreq = 440 * Math.pow(2, (note - 69) / 12);
                    var detuneRatio = Math.pow(Math.exp(Math.log(2) / 1024), preset.operators[ii].detune);
                    frequency = noteFreq * detuneRatio * preset.operators[ii].frequencyRatio;
                }
                //console.log(ii, 'startPlayFrequency', frequency);
                this.operators[ii].startPlayFrequency(preset.operators[ii], when, duration, frequency, preset.modulationRatio, preset.feedbackRatio);
                var otime = when + duration + preset.operators[ii].envelope.release + 0.01;
                if (this.locktime < otime) {
                    this.locktime = otime;
                    //console.log(ii, 'locktime', time,'when',when,'now',this.audioContext.currentTime);
                }
            }
        }
        //console.log('startPlayNote', note, 'when', when, preset);
    };
    return DX7Voice;
}());
