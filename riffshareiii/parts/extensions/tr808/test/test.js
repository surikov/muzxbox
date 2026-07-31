"use strict";
function startTest() {
    console.log('startTest');
    let audioContext = new AudioContext();
    let when = audioContext.currentTime + 0.1;
    let par = {
        f0: 200,
        f1: 110,
        dur: 0.85,
        skin: 0.15,
        drop: 0, click: 0, clickWave: '', clickF: 0, drive: 0, wave: '', level: 0, skinF: 0, skinDur: 0
    };
    tomEng(audioContext, when, audioContext.destination, 1, par);
}
const NOISE_SECONDS = 2;
const NOISE_DATA = (() => {
    const d = new Float32Array(96000 * NOISE_SECONDS);
    for (let i = 0; i < d.length; i++)
        d[i] = Math.random() * 2 - 1;
    return d;
})();
function fillFrom(dst, src) {
    const step = src.length / dst.length;
    for (let i = 0; i < dst.length; i++)
        dst[i] = src[Math.floor(i * step)];
}
;
function noiseBuf(ac) {
    const len = Math.floor(ac.sampleRate * NOISE_SECONDS);
    const buf = ac.createBuffer(1, len, ac.sampleRate);
    fillFrom(buf.getChannelData(0), NOISE_DATA);
    return buf;
}
;
function noiseSrc(ac) {
    const s = ac.createBufferSource();
    s.buffer = noiseBuf(ac);
    s.loop = true;
    s.loopStart = Math.random() * 1.0;
    return s;
}
;
function tomEng(ctx, when, out, p, o) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    let strtype = o.wave || 'sine';
    osc.type = strtype;
    osc.frequency.setValueAtTime(o.f0 * p, when);
    osc.frequency.exponentialRampToValueAtTime(o.f1 * p, when + (o.drop || 0.12));
    g.gain.setValueAtTime(0.85, when);
    g.gain.exponentialRampToValueAtTime(0.0001, when + o.dur);
    osc.connect(g).connect(out);
    osc.start(when);
    osc.stop(when + o.dur + 0.05);
    if (o.skin) {
        const n = noiseSrc(ctx);
        const lp = ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.value = (o.skinF || 800) * p;
        const ng = ctx.createGain();
        ng.gain.setValueAtTime(o.skin, when);
        ng.gain.exponentialRampToValueAtTime(0.0001, when + (o.skinDur || 0.05));
        n.connect(lp).connect(ng).connect(out);
        n.start(when);
        n.stop(when + (o.skinDur || 0.05) + 0.02);
    }
}
//# sourceMappingURL=test.js.map