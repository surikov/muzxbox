var DX7Test = /** @class */ (function () {
    function DX7Test() {
        this.synth = null;
        this.selectedPreset = null;
        this.parsed = null;
        var test = {
            "algorithm1_32": 5,
            "feedback0_7": 6,
            "operators": [
                {
                    "rates0_99": [
                        96,
                        25,
                        25,
                        67
                    ],
                    "levels0_99": [
                        99,
                        75,
                        0,
                        0
                    ],
                    "detune_7_7": 3,
                    "volumeLevel0_99": 99,
                    "constMode0_1": 0,
                    "freqCoarse0_31": 1,
                    "freqFine0_99": 0,
                    "enabled": false,
                    "velocitySens0_7": 2
                },
                {
                    "rates0_99": [
                        95,
                        50,
                        35,
                        78
                    ],
                    "levels0_99": [
                        99,
                        75,
                        0,
                        0
                    ],
                    "detune_7_7": 0,
                    "volumeLevel0_99": 58,
                    "constMode0_1": 0,
                    "freqCoarse0_31": 14,
                    "freqFine0_99": 0,
                    "enabled": false,
                    "velocitySens0_7": 7
                },
                {
                    "rates0_99": [
                        95,
                        20,
                        20,
                        50
                    ],
                    "levels0_99": [
                        99,
                        95,
                        0,
                        0
                    ],
                    "detune_7_7": 0,
                    "volumeLevel0_99": 99,
                    "constMode0_1": 0,
                    "freqCoarse0_31": 1,
                    "freqFine0_99": 0,
                    "enabled": false,
                    "velocitySens0_7": 2
                },
                {
                    "rates0_99": [
                        95,
                        29,
                        20,
                        50
                    ],
                    "levels0_99": [
                        99,
                        95,
                        0,
                        0
                    ],
                    "detune_7_7": 0,
                    "volumeLevel0_99": 89,
                    "constMode0_1": 0,
                    "freqCoarse0_31": 1,
                    "freqFine0_99": 0,
                    "enabled": false,
                    "velocitySens0_7": 6
                },
                {
                    "rates0_99": [
                        95,
                        20,
                        20,
                        50
                    ],
                    "levels0_99": [
                        99,
                        95,
                        0,
                        0
                    ],
                    "detune_7_7": -7,
                    "volumeLevel0_99": 99,
                    "constMode0_1": 0,
                    "freqCoarse0_31": 1,
                    "freqFine0_99": 0,
                    "enabled": true,
                    "velocitySens0_7": 0
                },
                {
                    "rates0_99": [
                        95,
                        29,
                        20,
                        50
                    ],
                    "levels0_99": [
                        99,
                        95,
                        0,
                        0
                    ],
                    "detune_7_7": 7,
                    "volumeLevel0_99": 79,
                    "constMode0_1": 0,
                    "freqCoarse0_31": 1,
                    "freqFine0_99": 0,
                    "enabled": true,
                    "velocitySens0_7": 6
                }
            ],
            "name": "E.PIANO 1 ",
            //"lfoSpeed": 34,
            //"lfoDelay": 33,
            "lfoPitchModDepth0_99": 0,
            "lfoAmpModDepth0_99": 0,
            //"lfoPitchModSens": 3,
            //"lfoWaveform": 4,
            //"lfoSync": 0
        };
        test.operators[0].enabled = false;
        test.operators[1].enabled = false;
        test.operators[2].enabled = false;
        test.operators[3].enabled = false;
        //test.operators[4].enabled = false;
        //test.operators[5].enabled = false;
        test.operators[4].detune_7_7 = 0;
        test.operators[5].detune_7_7 = 0;
        test.feedback0_7 = 0;
        /*
                test.operators[4].rates0_99 = [99, 99, 99, 99];
                test.operators[4].levels0_99 = [99, 99, 99, 0];
                test.operators[5].rates0_99 = [99, 99, 99, 99];
                test.operators[5].levels0_99 = [99, 99, 99, 0];
        */
        //test.feedback0_7
        /*
                test.operators[2].rates0_99=[99,99,99,99];
                test.operators[2].levels0_99=[99,99,99,0];
                test.operators[3].rates0_99=[99,99,99,99];
                test.operators[3].levels0_99=[99,99,99,0];
        
                test.operators[2].volumeLevel0_99=99;
                test.operators[3].volumeLevel0_99=99;
        */
        var loader = new DX7Loader();
        this.selectedPreset = loader.convertDX7data(test);
        console.log('dx7preset', test);
        console.log('synthpreset', this.selectedPreset);
        this.renderLibList();
    }
    DX7Test.prototype.renderLibList = function () {
        var _this = this;
        var liblist = document.getElementById('liblist');
        //console.log(liblist);
        if (liblist) {
            libDX7list.sort(function (a, b) {
                return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
            });
            var _loop_1 = function (ii) {
                var li = document.createElement('li');
                li.innerText = '' + ii + ': ' + libDX7list[ii].name;
                var pid = ii;
                li.onclick = function () {
                    console.log(pid, libDX7list[pid].name);
                    //selectedPreset
                    var loader = new DX7Loader();
                    _this.selectedPreset = loader.convertDX7data(libDX7list[pid]);
                };
                //console.log(ii, libDX7list[ii].name, li);
                liblist.appendChild(li);
            };
            for (var ii = 0; ii < libDX7list.length; ii++) {
                _loop_1(ii);
            }
        }
    };
    DX7Test.prototype.loadSysexFile = function (fileList) {
        console.log('loadSysexFile', fileList);
        var loader = new DX7Loader();
        var me = this;
        loader.parseSyxFile(fileList[0], function (presets) {
            console.log('presets', presets);
            me.parsed = presets;
        });
    };
    DX7Test.prototype.testPlay = function (isPiano, nn) {
        if (!(this.synth)) {
            var ac = new AudioContext();
            this.synth = new DX7Synthesizer(ac);
            this.synth.output.connect(ac.destination);
        }
        if (this.synth) {
            if (this.selectedPreset) {
                //console.log('play', nn, this.selectedPreset);
                //this.selectedPreset.operators[2].volume = 0.001;
                //this.selectedPreset.operators[2].enabled = false;
                //this.selectedPreset.operators[3].enabled = false;
                //this.selectedPreset.operators[4].enabled = false;
                //this.selectedPreset.operators[5].enabled = false;
                this.synth.scheduleStrum(this.selectedPreset, this.synth.audioContext.currentTime + 0.321, [nn], [{ duration: 1.2, delta: 0 }]);
            }
        }
    };
    DX7Test.prototype.playTestSuBass = function () {
        if (!(this.synth)) {
            var ac = new AudioContext();
            this.synth = new DX7Synthesizer(ac);
            this.synth.output.connect(ac.destination);
        }
        var C = 0, Cs = 1, D = 2, Ds = 3, E = 4, F = 5, Fs = 6, G = 7, Gs = 8, A = 9, As = 10, B = 11;
        var tempo = 120;
        var n4 = 60 / tempo;
        var n16 = n4 / 4;
        var n8 = n4 / 2;
        var n2 = n4 * 2;
        var n1 = n4 * 4;
        var o2 = 24;
        var o3 = 36;
        var o4 = 48;
        var o5 = 60;
        if (this.synth) {
            if (this.selectedPreset) {
                //this.synth.recheckCache();
                var tt = this.synth.audioContext.currentTime + 0.2;
                var pp = this.selectedPreset;
                this.synth.scheduleStrum(pp, tt + 0 * n8, [A + o2], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 1 * n8, [A + o3], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 2 * n8, [A + o2], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 3 * n8, [A + o3], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 4 * n8, [G + o2], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 5 * n8, [G + o3], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 6 * n8, [G + o2], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 7 * n8, [G + o3], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 8 * n8, [F + o2], [{ duration: n2, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 12 * n8, [G + o2], [{ duration: n4, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 14 * n8, [G + o2], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 15 * n8, [G + o3], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 16 * n8, [A + o2], [{ duration: n2, delta: 0 }]);
            }
        }
    };
    DX7Test.prototype.playTestBass = function () {
        if (!(this.synth)) {
            var ac = new AudioContext();
            this.synth = new DX7Synthesizer(ac);
            this.synth.output.connect(ac.destination);
        }
        var C = 0, Cs = 1, D = 2, Ds = 3, E = 4, F = 5, Fs = 6, G = 7, Gs = 8, A = 9, As = 10, B = 11;
        var tempo = 120;
        var n4 = 60 / tempo;
        var n16 = n4 / 4;
        var n8 = n4 / 2;
        var n2 = n4 * 2;
        var n1 = n4 * 4;
        var o3 = 36;
        var o4 = 48;
        var o5 = 60;
        if (this.synth) {
            if (this.selectedPreset) {
                //this.synth.recheckCache();
                var tt = this.synth.audioContext.currentTime + 0.2;
                var pp = this.selectedPreset;
                this.synth.scheduleStrum(pp, tt + 0 * n8, [A + o3], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 1 * n8, [A + o4], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 2 * n8, [A + o3], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 3 * n8, [A + o4], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 4 * n8, [G + o3], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 5 * n8, [G + o4], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 6 * n8, [G + o3], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 7 * n8, [G + o4], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 8 * n8, [F + o3], [{ duration: n2, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 12 * n8, [G + o3], [{ duration: n4, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 14 * n8, [G + o3], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 15 * n8, [G + o4], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 16 * n8, [A + o3], [{ duration: n2, delta: 0 }]);
                /*
                                this.synth.scheduleStrum(pp, tt + n1 * 2 + 0 * n8, [A + o4], [{ duration: n8, delta: 0 }]);
                                this.synth.scheduleStrum(pp, tt + n1 * 2 + 1 * n8, [A + o5], [{ duration: n8, delta: 0 }]);
                                this.synth.scheduleStrum(pp, tt + n1 * 2 + 2 * n8, [A + o4], [{ duration: n8, delta: 0 }]);
                                this.synth.scheduleStrum(pp, tt + n1 * 2 + 3 * n8, [A + o5], [{ duration: n8, delta: 0 }]);
                                this.synth.scheduleStrum(pp, tt + n1 * 2 + 4 * n8, [G + o4], [{ duration: n8, delta: 0 }]);
                                this.synth.scheduleStrum(pp, tt + n1 * 2 + 5 * n8, [G + o5], [{ duration: n8, delta: 0 }]);
                                this.synth.scheduleStrum(pp, tt + n1 * 2 + 6 * n8, [G + o4], [{ duration: n8, delta: 0 }]);
                                this.synth.scheduleStrum(pp, tt + n1 * 2 + 7 * n8, [G + o5], [{ duration: n8, delta: 0 }]);
                                this.synth.scheduleStrum(pp, tt + n1 * 2 + 8 * n8, [F + o4, A + o4, C + o5], [{ duration: n2, delta: 0 }]);
                                this.synth.scheduleStrum(pp, tt + n1 * 2 + 12 * n8, [G + o4, B + o4, D + o5], [{ duration: n4, delta: 0 }]);
                                this.synth.scheduleStrum(pp, tt + n1 * 2 + 14 * n8, [G + o4], [{ duration: n8, delta: 0 }]);
                                this.synth.scheduleStrum(pp, tt + n1 * 2 + 15 * n8, [G + o5], [{ duration: n8, delta: 0 }]);
                                
                                this.synth.scheduleStrum(pp, tt + n1 * 2 + 16 * n8, [A + o4, C + o5, E + o5], [{ duration: n1, delta: 0 }]);
                                */
            }
        }
    };
    DX7Test.prototype.playTestChords = function () {
        if (!(this.synth)) {
            var ac = new AudioContext();
            this.synth = new DX7Synthesizer(ac);
            this.synth.output.connect(ac.destination);
        }
        var C = 0, Cs = 1, D = 2, Ds = 3, E = 4, F = 5, Fs = 6, G = 7, Gs = 8, A = 9, As = 10, B = 11;
        var tempo = 120;
        var n4 = 60 / tempo;
        var n16 = n4 / 4;
        var n8 = n4 / 2;
        var n2 = n4 * 2;
        var n1 = n4 * 4;
        var o3 = 36;
        var o4 = 48;
        var o5 = 60;
        var o6 = 73;
        if (this.synth) {
            if (this.selectedPreset) {
                // this.synth.recheckCache();
                var tt = this.synth.audioContext.currentTime + 0.2;
                var pp = this.selectedPreset;
                this.synth.scheduleStrum(pp, tt + 0 * n8, [A + o4], [{ duration: n4, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 1 * n8, [A + o5, C + o6, E + o6], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 2 * n8, [E + o4], [{ duration: n4, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 3 * n8, [A + o5, C + o6, E + o6], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 4 * n8, [G + o4], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 5 * n8, [E + o4], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 6 * n8, [F + o3], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 7 * n8, [G + o4], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 8 * n8, [A + o5, C + o6, E + o6], [{ duration: n4, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 12 * n8, [G + o5, B + o5, D + o6], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 13 * n8, [G + o5, B + o5, D + o6], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 14 * n8, [G + o5, B + o5, D + o6], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 15 * n8, [G + o5, B + o5, D + o6], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 16 * n8, [A + o5, C + o6, E + o6], [{ duration: n4, delta: 0 }]);
            }
        }
    };
    DX7Test.prototype.playTestMelody = function () {
        if (!(this.synth)) {
            var ac = new AudioContext();
            this.synth = new DX7Synthesizer(ac);
            this.synth.output.connect(ac.destination);
        }
        var C = 0, Cs = 1, D = 2, Ds = 3, E = 4, F = 5, Fs = 6, G = 7, Gs = 8, A = 9, As = 10, B = 11;
        var tempo = 120;
        var n4 = 60 / tempo;
        var n16 = n4 / 4;
        var n8 = n4 / 2;
        var n2 = n4 * 2;
        var n1 = n4 * 4;
        var o3 = 36;
        var o4 = 48;
        var o5 = 60;
        var o6 = 73;
        if (this.synth) {
            if (this.selectedPreset) {
                // this.synth.recheckCache();
                var tt = this.synth.audioContext.currentTime + 0.2;
                var pp = this.selectedPreset;
                this.synth.scheduleStrum(pp, tt + 0 * n16, [A + o6], [{ duration: n16, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 1 * n16, [G + o6], [{ duration: n16, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 2 * n16, [E + o6], [{ duration: n16, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 3 * n16, [C + o6], [{ duration: n16, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 4 * n16, [A + o5], [{ duration: n16, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 5 * n16, [G + o5], [{ duration: n16, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 6 * n16, [E + o5], [{ duration: n16, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 7 * n16, [C + o5], [{ duration: n16, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 4 * n8, [A + o5], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 5 * n8, [C + o6], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 6 * n8, [G + o6], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 7 * n8, [E + o6], [{ duration: n8, delta: 0 }]);
                this.synth.scheduleStrum(pp, tt + 8 * n8, [A + o6], [{ duration: n2, delta: 0 }]);
            }
        }
    };
    DX7Test.prototype.customPlay = function (isPiano, nn) {
        this.testPlay(isPiano, nn);
    };
    DX7Test.prototype.loadPresetNum = function (nn) {
        if (this.parsed) {
            this.selectedPreset = this.parsed[nn];
            console.log('select', nn, this.selectedPreset);
        }
    };
    return DX7Test;
}());
var tester = new DX7Test();
////////////////////////////////////////////////////////
/*
function durationUp(nn: number): number {
    //return  this.durationDown(nn)/4;
    return 0.0001 + 38 * Math.pow(2, (99 - nn) * 0.16) / Math.pow(2, 99 * 0.16);
}*/
/*
let loader: DX7Loader = new DX7Loader();
for (let ii = 0; ii < 100; ii++) {
    //console.log(ii,loader.durationUp(ii));
}

console.log(99, 0.0004, loader.durationUp(99));
console.log(98, 0.00047, loader.durationUp(98));
console.log(97, 0.00047, loader.durationUp(97));
console.log(96, 0.00056, loader.durationUp(96));
console.log(96, 0.00068, loader.durationUp(95));
console.log(95, 0.00068, loader.durationUp(94));
console.log(93, 0.00081, loader.durationUp(93));
console.log(92, 0.00098, loader.durationUp(92));
console.log(91, 0.00098, loader.durationUp(91));
console.log(90, 0.0011, loader.durationUp(90));
console.log(89, 0.0011, loader.durationUp(89));
console.log(88, 0.0013, loader.durationUp(88));
console.log(80, 0.0033, loader.durationUp(80));
console.log(70, 0.0113, loader.durationUp(70));
console.log(60, 0.0322, loader.durationUp(60));
console.log(50, 0.0912, loader.durationUp(50));
console.log(40, 0.0371, loader.durationUp(40));
console.log(30, 0.8686, loader.durationUp(30));
console.log(20, 2.92, loader.durationUp(20));
console.log(10, 8.264, loader.durationUp(10));

console.log(99, 0.0033, loader.durationDown(99));
console.log(89, 0.0088, loader.durationDown(89));
console.log(79, 0.02868, loader.durationDown(79));
console.log(69, 0.0803, loader.durationDown(69));
console.log(59, 0.2695, loader.durationDown(59));
console.log(49, 0.7615, loader.durationDown(49));
console.log(19, 20.48, loader.durationDown(19));
*/
/*
for (let ii = 0; ii <= 7; ii++) {
    console.log(ii, Math.pow(2, (ii - 7)));
}
console.log(Math.pow(10, 10 % 4) * (1 + (99 / 99) * 8.772));
*/
/*
function ratio99a(nn99) {
    if (nn99 < 66) {
        return nn99 / 6+0.5;
    } else {
        return 10+(nn99-66) / 1;
    }
}
var LFO_FREQUENCY_TABLE = [ // see https://github.com/smbolton/hexter/tree/master/src/dx7_voice.c#L1002
    0.062506, 0.124815, 0.311474, 0.435381, 0.619784,
    0.744396, 0.930495, 1.116390, 1.284220, 1.496880,
    1.567830, 1.738994, 1.910158, 2.081322, 2.252486,
    2.423650, 2.580668, 2.737686, 2.894704, 3.051722,
    3.208740, 3.366820, 3.524900, 3.682980, 3.841060,
    3.999140, 4.159420, 4.319700, 4.479980, 4.640260,
    4.800540, 4.953584, 5.106628, 5.259672, 5.412716,
    5.565760, 5.724918, 5.884076, 6.043234, 6.202392,
    6.361550, 6.520044, 6.678538, 6.837032, 6.995526,
    7.154020, 7.300500, 7.446980, 7.593460, 7.739940,
    7.886420, 8.020588, 8.154756, 8.288924, 8.423092,
    8.557260, 8.712624, 8.867988, 9.023352, 9.178716,
    9.334080, 9.669644, 10.005208, 10.340772, 10.676336,
    11.011900, 11.963680, 12.915460, 13.867240, 14.819020,
    15.770800, 16.640240, 17.509680, 18.379120, 19.248560,
    20.118000, 21.040700, 21.963400, 22.886100, 23.808800,
    24.731500, 25.759740, 26.787980, 27.816220, 28.844460,
    29.872700, 31.228200, 32.583700, 33.939200, 35.294700,
    36.650200, 37.812480, 38.974760, 40.137040, 41.299320,
    42.461600, 43.639800, 44.818000, 45.996200, 47.174400,
    47.174400, 47.174400, 47.174400, 47.174400, 47.174400,
    47.174400, 47.174400, 47.174400, 47.174400, 47.174400,
    47.174400, 47.174400, 47.174400, 47.174400, 47.174400,
    47.174400, 47.174400, 47.174400, 47.174400, 47.174400,
    47.174400, 47.174400, 47.174400, 47.174400, 47.174400,
    47.174400, 47.174400, 47.174400
];
for (let ii = 0; ii < LFO_FREQUENCY_TABLE.length; ii++) {
    console.log(ii, LFO_FREQUENCY_TABLE[ii], ratio99a(ii));
}
*/
/*
function mod3(x01: number): number {
    let min = -4.5;
    let max = 2;
    return 0.25 * Math.pow(2, x01 * (max - min) + min);
}
function pow2x(x01: number, minx: number, maxx: number, yratio: number): number {
    if (x01) {
        return yratio * Math.pow(2, x01 * (maxx - minx) + minx);
    } else {
        return 0;
    }
}
var LFO_PITCH_MOD_TABLE = [
    0, 0.0264, 0.0534, 0.0889, 0.1612, 0.2769, 0.4967, 1
];
for (let ii = 0; ii < LFO_PITCH_MOD_TABLE.length; ii++) {
    console.log(ii, LFO_PITCH_MOD_TABLE[ii], mod3(ii / 7), pow2x(ii / 7, -4.5, 2, 1 / 4));
}
*/
/*
console.log(99, Math.pow(2, 99 * 0.125) / Math.pow(2, 99 * 0.125));
console.log(88, Math.pow(2, 88 * 0.125) / Math.pow(2, 99 * 0.125));
console.log(77, Math.pow(2, 77 * 0.125) / Math.pow(2, 99 * 0.125));
console.log(66, Math.pow(2, 66 * 0.125) / Math.pow(2, 99 * 0.125));
*/
var SignVerifyTest = /** @class */ (function () {
    function SignVerifyTest() {
    }
    SignVerifyTest.prototype.startTest33 = function () {
        var _this = this;
        this.dumpKeyPEMs(function (signPEM, verifyPEM) {
            console.log('signPEM', signPEM);
            console.log('verifyPEM', verifyPEM);
            var testMessage = 'Test message to for testing.';
            console.log('testMessage', testMessage);
            _this.buildMessageSignature(testMessage, signPEM, function (signaturePEM) {
                console.log('signaturePEM', signaturePEM);
                _this.verifyMessageSignature(testMessage, signaturePEM, verifyPEM, function (same) {
                    console.log('same', same);
                });
            });
        });
    };
    SignVerifyTest.prototype.verifyMessageSignature = function (message, signaturePEM, verifyPEM, onDone) {
        var _this = this;
        var verKeyBuffer = this.str2ab(window.atob(verifyPEM));
        var algorithm = {
            name: "RSASSA-PKCS1-v1_5",
            hash: "SHA-256",
        };
        window.crypto.subtle.importKey("spki", verKeyBuffer, algorithm, true, ['verify'])
            .then(function (verifyKey) {
            var signatureBuffer = _this.str2ab(window.atob(signaturePEM));
            console.log('import signature buffer', signatureBuffer);
            var msgBuff = new TextEncoder().encode(message);
            window.crypto.subtle.verify({ name: "RSASSA-PKCS1-v1_5", saltLength: 32 }, verifyKey, signatureBuffer, msgBuff)
                .then(function (same) {
                onDone(same);
            });
        });
    };
    SignVerifyTest.prototype.buildMessageSignature = function (message, signPEM, onDone) {
        var _this = this;
        var binaryDerString = window.atob(signPEM);
        var binaryDerBuffer = this.str2ab(binaryDerString);
        var algorithm = {
            name: "RSASSA-PKCS1-v1_5",
            hash: "SHA-256",
        };
        window.crypto.subtle.importKey("pkcs8", binaryDerBuffer, algorithm, true, ['sign'])
            .then(function (signKey) {
            var msgBuff = new TextEncoder().encode(message);
            window.crypto.subtle.sign({ name: "RSASSA-PKCS1-v1_5", saltLength: 32 }, signKey, msgBuff)
                .then(function (signature) {
                console.log('export signature buffer', signature);
                var str = _this.ab2str(signature);
                var signaturePEM = window.btoa(str);
                onDone(signaturePEM);
            });
        });
    };
    SignVerifyTest.prototype.dumpKeyPEMs = function (onDone) {
        var _this = this;
        var rsaParam = {
            name: 'RSASSA-PKCS1-v1_5' //'RSA-PSS'
            ,
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: 'SHA-256'
        };
        window.crypto.subtle.generateKey(rsaParam, true, ['sign', 'verify'])
            .then(function (pair) {
            window.crypto.subtle.exportKey("pkcs8", pair.privateKey)
                .then(function (signbuf) {
                var signPEM = window.btoa(_this.ab2str(signbuf));
                window.crypto.subtle.exportKey('spki', pair.publicKey)
                    .then(function (vebuf) {
                    var verifyPEM = window.btoa(_this.ab2str(vebuf));
                    onDone(signPEM, verifyPEM);
                });
            });
        });
    };
    SignVerifyTest.prototype.ab2str = function (buf) {
        return String.fromCharCode.apply(null, new Uint8Array(buf));
    };
    SignVerifyTest.prototype.str2ab = function (str) {
        var buf = new ArrayBuffer(str.length);
        var bufView = new Uint8Array(buf);
        for (var ii = 0; ii < str.length; ii++) {
            bufView[ii] = str.charCodeAt(ii);
        }
        return buf;
    };
    return SignVerifyTest;
}());
var testMessage = 'Test message to for testing.';
var pemSignature = 'TDCmvOJfT5282lPXA9W6DWo2gFywi4IVCGiavpw8g363762sNQeSu+BBGYcW7q6PoPNMy/LVA+QlDbmRTrO/5bdnkB8AGtSU+uYwBV3HKhVvsb0lEUc3qP+FOaZyjYrAwkBF3XnoHrTLsZ8/wDgH4BfCD9pmxAWbH12cPndQ5KUcuIcIKT5B0/yi/EgG5hi4TeR9mlhzt9VMEiAdonemPJaho0VXev+Iv3N5CLChIrsIrTp+BUJFxyXmb+ClJQ0tiNflrxX3XUBoVM+XpxIQ/lVwJfyp6C2Je2YINIJzlUjo+qwa2ItCB69TvdimztRq5EBijIcPCHSckipMVs+Y9w==';
var verifyPEM = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5hSx/AfKe8ZwYIKTsr6obtLIG/8UGPDu4wVpdDVyLryjgeRXNPifJClQGA4IlH+2B++YiEr/XPOTcJUIy6BSXfqzWXNAKixPLeq5E4qr/0I6ah36MPmU8sC3Z8upJaa0lE+HxDqPajYlWzsZTwOkCPLkmpDKRF0GBuXrlAhIdPaFbt4YHL9WfmSf0GADU4D4yD1EIdKC7Xo3S5kB9lXowqbGQwSsUiP6/Ck7WtqVRYL3BG71XazVeHaCLwjaqQb7rte8yN364rr90l+Ke/j2pyf3dh6Tty9uV4dIpQSVCB9R2zyu9wJhso1kS+T4N8xgcJxX8tZ9fnb1qOqqLBgDoQIDAQAB';
//let signPEM = 'MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDgy+feGAkbUUCqWhlKxKzAMc3hEc7bhA71xFvQ5K3TINgPpjFx0xALYPlcZBHqHWTK8hxsJwTuW2b6ijq9c9gJfi2pmrftCkxY2oqfamzWwAKERf0kzso28wfuzqYroeLgVvWsApoAqfGDLHPrgFCZgJNXr4FtN8M8Hukv4mmBRjk22Xh74HT80OZ8XmNA7rccaE7gUN7EWS/V+nali3oSAir7rwChX+IZStOi5Ryh4kuKROYSe7QVzo1QdEUIjn3V4wqYNJ0cEeFIcdJ2xz6V8cYf1LDUtyBKczPEVuNpmk6e5FrlGt9KC0szodWlwNNLr7c/qOrINGGfCSqMJjR1AgMBAAECggEAQZN6ClHcpjlnscoiwqro8hAVTOjS/Tpi2tLzLdbn1kUogjgrCFdXwNoDJC6VA0Sb2JAUNoCTcaz8N24HgKjAhtRmIaneqaltaCYodiSnp2XP1iJMnGYumyT+VW23D9djxanYdNs1baglqexXzIVb/cuCL/wkt2Wi8HDb+XoE6Q61OiDocch/Brk54WAVAp8VKzzLdDxBm+XnQqdmQjOTBJ7RBQRug7Cf1SGDcsYoN0UByKNmZd9rqzarlfSPAKEnjyM2ftTOZv8wPNzIO2r3KWuu+w3mVDzu607s1TyiG0QepHlZw5MogYWaeRaoTNo1ucvbHjix2VuVtPBukP0z6QKBgQD0RfKb3K08wPbwKPOOe6rq+uCXcEbAgj1vKA1B6NAxXO/loB41AqHyRdV8SucXXQeZzVr6vHETzyCEjrLg3amrHtx06toXbLCUOATkt9xxnX9rBCLUe93GVOkVkHRHFajQ4gSRbfP0m9PzZevoSuMZcB5nhwbdmgxFPhJxGdvZDwKBgQDrlpglB0/rCNSEf5RqvCh07XfhM8k61OAD8ifl2HqeRSfVoR+SR73qm2M6vNre32Qsj4EH5PlwVFxCz04BdqfCgi0nf9XOPND2IdineDnZvWjzS4OQhzCrPILpd/hCLyuACHNLNQtHEOciQkzYtpxz7qsJJvJXEYkLQjefGgXyOwKBgQC8v4/Hf60c1L36tKn93vEiwNfqLId/GSP/UCNuWkcE3ZtBA4hTzcT1P6DGedo241uMLHGwbQuzEsk9pEX0G1OPNjmC3jXHA+Utoluln6xm3hwmxPtk1JF5PwMb9pLimonnXb3J4fwvdnlACfFPfQ4eCdR0ipFziiURG/WED0chYQKBgEogh1zXUSkmDSBnuD5hV+V6tsawcbfGNXpoXm9uzx4vqloIqZNwaWyBWhaoR8Hqzm1K9hGS1X2nvaPz8Jp7SEvmg+iyy4ZqEmHvwmjnZmSBuZ0b/JikQQcQMizd58qDZw+RGR3n4dWJlwBrlhx2UQIVbdGiZIxK4zEcs72nBYnzAoGBAIjicEWDHSy5/Adx3QS6bhcr1gNTLybyNfGtuv1YyLYAYQPTK/fBbLueOvUd1zv3N/8aLEu8pE2ulGWRCswGBU6P8oUl9jUe6ZysmqEyE1uw5IZjSmw9LoF/PESBu3rDmYxNTyy8IGHlrp0l6/QHvHK8LMWa4mcsPj6aC3bw8Dig';
var sitest = new SignVerifyTest();
/*
sitest.dumpKeyPEMs((signPEM: string, verifyPEM) => {
    console.log('signPEM', signPEM);
    console.log('verifyPEM', verifyPEM);
});
*/
/*
sitest.buildMessageSignature(testMessage, signPEM, (pemSignature: string) => {
    console.log('pemSignature', pemSignature);
});
*/
sitest.verifyMessageSignature(testMessage, pemSignature, verifyPEM, function (same) {
    console.log('same', same);
});
/*
sitest.dumpKeyPEMs((signPEM: string, verifyPEM) => {
    console.log('signPEM', signPEM);
    console.log('verifyPEM', verifyPEM);
    sitest.buildMessageSignature(testMessage, signPEM, (pemSignature: string) => {
        console.log('pemSignature', pemSignature);
        sitest.verifyMessageSignature(testMessage, pemSignature, verifyPEM, (same: boolean) => {
            console.log('same', same);
        });
    });
});
*/ 
