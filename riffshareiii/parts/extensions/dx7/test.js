var presets = [];
var audioContext;
function initDX7loader() {
    //console.log('initDX7loader');
    var romfile = document.getElementById('romfile');
    if (romfile) {
        romfile.addEventListener('change', loadFile);
    }
}
/*
function getNoteFrequency(semitones) {
    // Get the frequency in Hz of a note given as semitones above or below A440
    let rr= 440 * ((2 ** (1 / 12)) ** semitones);
    console.log(semitones,rr);
    return rr;
}*/
function testPlay() {
    console.log(presets);
    if (audioContext) {
        //
    }
    else {
        audioContext = new window.AudioContext();
    }
    var carrier = audioContext.createOscillator();
    var mod1 = audioContext.createOscillator();
    carrier.frequency.value = 440; //getNoteFrequency(55);
    mod1.frequency.value = 10;
    var mod1Gain = audioContext.createGain();
    mod1Gain.gain.value = 90.95;
    mod1.connect(mod1Gain);
    mod1Gain.connect(carrier.detune); // This is the magic FM part!
    carrier.connect(audioContext.destination);
    var bgn = audioContext.currentTime + 0.1;
    mod1.start(bgn);
    carrier.start(bgn);
    // Schedule automatic oscillation stop
    mod1.stop(audioContext.currentTime + 1);
    carrier.stop(audioContext.currentTime + 1);
}
function loadFile(changeEvent) {
    //console.log(changeEvent);
    var file = changeEvent.target.files[0];
    //console.log(file);
    readSyxFile(file);
}
function readSyxFile(file) {
    var fileReder = new FileReader();
    fileReder.onload = function () {
        //console.log(fileReder);
        //let arrayBuffer: ArrayBuffer = fileReder.result as any;
        parseBuffer(fileReder.result);
    };
    //fileReder.readAsArrayBuffer(file);
    fileReder.readAsText(file);
}
function parseBuffer(bankData) {
    //console.log(bankData);
    for (var i = 0; i < 32; i++) {
        presets.push(extractPatchFromRom(bankData, i));
    }
    //console.log(presets);
}
function extractPatchFromRom(bankData, patchId) {
    var dataStart = 128 * patchId + 6;
    var dataEnd = dataStart + 128;
    var voiceData = bankData.substring(dataStart, dataEnd);
    var operators = []; //[{}, {}, {}, {}, {}, {}];
    for (var i = 5; i >= 0; --i) {
        var oscStart = (5 - i) * 17;
        var oscEnd = oscStart + 17;
        var oscData = voiceData.substring(oscStart, oscEnd);
        //var operator = operators[i];
        var operator = {
            rates: [oscData.charCodeAt(0), oscData.charCodeAt(1), oscData.charCodeAt(2), oscData.charCodeAt(3)],
            levels: [oscData.charCodeAt(4), oscData.charCodeAt(5), oscData.charCodeAt(6), oscData.charCodeAt(7)],
            keyScaleBreakpoint: oscData.charCodeAt(8),
            keyScaleDepthL: oscData.charCodeAt(9),
            keyScaleDepthR: oscData.charCodeAt(10),
            keyScaleCurveL: oscData.charCodeAt(11) & 3,
            keyScaleCurveR: oscData.charCodeAt(11) >> 2,
            keyScaleRate: oscData.charCodeAt(12) & 7,
            detune: Math.floor(oscData.charCodeAt(12) >> 3) - 7 // range 0 to 14
            ,
            lfoAmpModSens: oscData.charCodeAt(13) & 3,
            velocitySens: oscData.charCodeAt(13) >> 2,
            volume: oscData.charCodeAt(14),
            oscMode: oscData.charCodeAt(15) & 1,
            freqCoarse: Math.floor(oscData.charCodeAt(15) >> 1),
            freqFine: oscData.charCodeAt(16)
            // Extended/non-standard parameters
            ,
            pan: ((i + 1) % 3 - 1) * 25 // Alternate panning: -25, 0, 25, -25, 0, 25
            ,
            idx: i,
            enabled: true,
            outputLevel: 0,
            freqRatio: 0,
            freqFixed: 0,
            ampL: 0,
            ampR: 0
        };
        operators[i] = operator;
    }
    var romset = {
        algorithm: voiceData.charCodeAt(110) + 1, // start at 1 for readability
        feedback: voiceData.charCodeAt(111) & 7,
        operators: operators,
        name: voiceData.substring(118, 128),
        lfoSpeed: voiceData.charCodeAt(112),
        lfoDelay: voiceData.charCodeAt(113),
        lfoPitchModDepth: voiceData.charCodeAt(114),
        lfoAmpModDepth: voiceData.charCodeAt(115),
        lfoPitchModSens: voiceData.charCodeAt(116) >> 4,
        lfoWaveform: Math.floor(voiceData.charCodeAt(116) >> 1) & 7,
        lfoSync: voiceData.charCodeAt(116) & 1,
        pitchEnvelope: {
            rates: [voiceData.charCodeAt(102), voiceData.charCodeAt(103), voiceData.charCodeAt(104), voiceData.charCodeAt(105)],
            levels: [voiceData.charCodeAt(106), voiceData.charCodeAt(107), voiceData.charCodeAt(108), voiceData.charCodeAt(109)]
        },
        controllerModVal: 0,
        aftertouchEnabled: 0,
        fbRatio: 0
    };
    return romset;
}
