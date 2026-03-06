var synth;
function initTester() {
    console.log('initTester');
    var audioContext = new window.AudioContext();
    synth = new SynthDX7(audioContext);
}
function testPlay() {
    console.log('testPlay');
    synth.test();
}
