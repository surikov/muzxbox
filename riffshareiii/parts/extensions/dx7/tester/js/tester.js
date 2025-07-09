"use strict";
let matrixAlgorithmsDX7 = [
    { outputMix: [0, 2], modulationMatrix: [[1], [], [3], [4], [5], [5]] },
    { outputMix: [0, 2], modulationMatrix: [[1], [1], [3], [4], [5], []] },
    { outputMix: [0, 3], modulationMatrix: [[1], [2], [], [4], [5], [5]] },
    { outputMix: [0, 3], modulationMatrix: [[1], [2], [], [4], [5], [3]] },
    { outputMix: [0, 2, 4], modulationMatrix: [[1], [], [3], [], [5], [5]] },
    { outputMix: [0, 2, 4], modulationMatrix: [[1], [], [3], [], [5], [4]] },
    { outputMix: [0, 2], modulationMatrix: [[1], [], [3, 4], [], [5], [5]] },
    { outputMix: [0, 2], modulationMatrix: [[1], [], [3, 4], [3], [5], []] },
    { outputMix: [0, 2], modulationMatrix: [[1], [1], [3, 4], [], [5], []] },
    { outputMix: [0, 3], modulationMatrix: [[1], [2], [2], [4, 5], [], []] },
    { outputMix: [0, 3], modulationMatrix: [[1], [2], [], [4, 5], [], [5]] },
    { outputMix: [0, 2], modulationMatrix: [[1], [1], [3, 4, 5], [], [], []] },
    { outputMix: [0, 2], modulationMatrix: [[1], [], [3, 4, 5], [], [], [5]] },
    { outputMix: [0, 2], modulationMatrix: [[1], [], [3], [4, 5], [], [5]] },
    { outputMix: [0, 2], modulationMatrix: [[1], [1], [3], [4, 5], [], []] },
    { outputMix: [0], modulationMatrix: [[1, 2, 4], [], [3], [], [5], [5]] },
    { outputMix: [0], modulationMatrix: [[1, 2, 4], [1], [3], [], [5], []] },
    { outputMix: [0], modulationMatrix: [[1, 2, 3], [], [2], [4], [5], []] },
    { outputMix: [0, 3, 4], modulationMatrix: [[1], [2], [], [5], [5], [5]] },
    { outputMix: [0, 1, 3], modulationMatrix: [[2], [2], [2], [4, 5], [], []] },
    { outputMix: [0, 1, 3, 4], modulationMatrix: [[2], [2], [2], [5], [5], []] },
    { outputMix: [0, 2, 3, 4], modulationMatrix: [[1], [], [5], [5], [5], [5]] },
    { outputMix: [0, 1, 3, 4], modulationMatrix: [[], [2], [], [5], [5], [5]] },
    { outputMix: [0, 1, 2, 3, 4], modulationMatrix: [[], [], [5], [5], [5], [5]] },
    { outputMix: [0, 1, 2, 3, 4], modulationMatrix: [[], [], [], [5], [5], [5]] },
    { outputMix: [0, 1, 3], modulationMatrix: [[], [2], [], [4, 5], [], [5]] },
    { outputMix: [0, 1, 3], modulationMatrix: [[], [2], [2], [4, 5], [], []] },
    { outputMix: [0, 2, 5], modulationMatrix: [[1], [], [3], [4], [4], []] },
    { outputMix: [0, 1, 2, 4], modulationMatrix: [[], [], [3], [], [5], [5]] },
    { outputMix: [0, 1, 2, 5], modulationMatrix: [[], [], [3], [4], [4], []] },
    { outputMix: [0, 1, 2, 3, 4], modulationMatrix: [[], [], [], [], [5], [5]] },
    { outputMix: [0, 1, 2, 3, 4, 5], modulationMatrix: [[], [], [], [], [], [5]] }
];
class SynthDX7 {
    constructor(audioContext) {
        console.log('new SynthDX7');
        this.moContext = audioContext;
    }
    createVoice() {
        return new VoiceDX7();
    }
    test() {
        console.log('SynthDX7 test');
        let voice = this.createVoice();
        voice.test();
    }
}
class OperatorDX7 {
    constructor() {
        console.log('OperatorDX7');
    }
}
class VoiceDX7 {
    constructor() {
        console.log('new VoiceDX7');
    }
    test() {
        console.log('VoiceDX7 test');
    }
    frequencyFromNoteNumber(note) {
        return 440 * Math.pow(2, (note - 69) / 12);
    }
    ;
}
let synth;
function initTester() {
    console.log('initTester');
    let audioContext = new window.AudioContext();
    synth = new SynthDX7(audioContext);
}
function testPlay() {
    console.log('testPlay');
    synth.test();
}
//# sourceMappingURL=tester.js.map