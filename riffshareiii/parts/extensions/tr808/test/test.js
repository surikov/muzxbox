"use strict";
function startTest() {
    console.log('startTest');
    let audioContext = new AudioContext();
    let when = audioContext.currentTime + 0.1;
    drumEng(audioContext, when + 0 * 0.5, audioContext.destination, 1, drumInfos[0].drumprops);
    drumEng(audioContext, when + 1 * 0.5, audioContext.destination, 1, drumInfos[1].drumprops);
    drumEng(audioContext, when + 2 * 0.5, audioContext.destination, 1, drumInfos[2].drumprops);
    drumEng(audioContext, when + 3 * 0.5, audioContext.destination, 1, drumInfos[3].drumprops);
    snareEng(audioContext, when + 4 * 0.5, audioContext.destination, 1, snareInfos[0].snareprops);
    snareEng(audioContext, when + 5 * 0.5, audioContext.destination, 1, snareInfos[1].snareprops);
    snareEng(audioContext, when + 6 * 0.5, audioContext.destination, 1, snareInfos[2].snareprops);
    snareEng(audioContext, when + 7 * 0.5, audioContext.destination, 1, snareInfos[3].snareprops);
    clapEng(audioContext, when + 8 * 0.5, audioContext.destination, 1, clapInfos[0].clapprops);
    clapEng(audioContext, when + 9 * 0.5, audioContext.destination, 1, clapInfos[1].clapprops);
    clapEng(audioContext, when + 10 * 0.5, audioContext.destination, 1, clapInfos[2].clapprops);
    clapEng(audioContext, when + 11 * 0.5, audioContext.destination, 1, clapInfos[3].clapprops);
    hatEng(audioContext, when + 12 * 0.5, audioContext.destination, 1, hatInfos[0].hatprops);
    hatEng(audioContext, when + 13 * 0.5, audioContext.destination, 1, hatInfos[1].hatprops);
    hatEng(audioContext, when + 14 * 0.5, audioContext.destination, 1, hatInfos[2].hatprops);
    hatEng(audioContext, when + 15 * 0.5, audioContext.destination, 1, hatInfos[3].hatprops);
    bellEng(audioContext, when + 16 * 0.5, audioContext.destination, 1, cowbellInfos[0].cowbellprops);
    bellEng(audioContext, when + 17 * 0.5, audioContext.destination, 1, cowbellInfos[1].cowbellprops);
    bellEng(audioContext, when + 18 * 0.5, audioContext.destination, 1, cowbellInfos[2].cowbellprops);
    bellEng(audioContext, when + 19 * 0.5, audioContext.destination, 1, cowbellInfos[3].cowbellprops);
    tomEng(audioContext, when + 20 * 0.5, audioContext.destination, 1, tomInfos[0].tomprops);
    tomEng(audioContext, when + 21 * 0.5, audioContext.destination, 1, tomInfos[1].tomprops);
    tomEng(audioContext, when + 22 * 0.5, audioContext.destination, 1, tomInfos[2].tomprops);
    tomEng(audioContext, when + 23 * 0.5, audioContext.destination, 1, tomInfos[3].tomprops);
    drumEng(audioContext, when + 24 * 0.5, audioContext.destination, 1, kickInfos[0].drumprops);
    drumEng(audioContext, when + 25 * 0.5, audioContext.destination, 1, kickInfos[1].drumprops);
    drumEng(audioContext, when + 26 * 0.5, audioContext.destination, 1, kickInfos[2].drumprops);
    drumEng(audioContext, when + 27 * 0.5, audioContext.destination, 1, kickInfos[3].drumprops);
    hatEng(audioContext, when + 28 * 0.5, audioContext.destination, 1, ohatInfos[0].hatprops);
    hatEng(audioContext, when + 29 * 0.5, audioContext.destination, 1, ohatInfos[1].hatprops);
    hatEng(audioContext, when + 30 * 0.5, audioContext.destination, 1, ohatInfos[2].hatprops);
    hatEng(audioContext, when + 31 * 0.5, audioContext.destination, 1, ohatInfos[3].hatprops);
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
const CURVE = (() => {
    const n = 1024, c = new Float32Array(n);
    for (let i = 0; i < n; i++) {
        const x = (i / (n - 1)) * 2 - 1;
        c[i] = Math.tanh(1.6 * x) / Math.tanh(1.6);
    }
    return c;
})();
function trackSource(node) {
    return node;
}
let drumInfos = [
    { drumname: '808 SUB', drumprops: { f0: 110, f1: 34, drop: 0.28, dur: 4.5, click: 0.2, clickWave: 'triangle', drive: 0, clickF: 400, wave: '', level: 0 } },
    { drumname: 'DEEP', drumprops: { f0: 80, f1: 28, drop: 0.4, dur: 6.0, click: 0.1, clickWave: 'triangle', drive: 0, clickF: 300, wave: '', level: 0 } },
    { drumname: 'DIRTY', drumprops: { f0: 100, f1: 32, drop: 0.3, dur: 4.0, click: 0.2, clickWave: 'triangle', drive: 3, clickF: 400, wave: '', level: 0.8 } },
    { drumname: 'PUNCH', drumprops: { f0: 140, f1: 40, drop: 0.15, dur: 2.0, click: 0.3, clickWave: '', drive: 0, clickF: 0, wave: '', level: 0 } }
];
let kickInfos = [
    { drumname: '808', drumprops: { f0: 160, f1: 48, drop: 0.09, dur: 0.9, click: 0.25, drive: 0, wave: '', level: 0, clickWave: '', clickF: 0 } },
    { drumname: '707', drumprops: { f0: 190, f1: 62, drop: 0.05, dur: 0.35, wave: 'triangle', click: 0.3, clickF: 1100, drive: 0, level: 0, clickWave: '' } },
    { drumname: '909', drumprops: { f0: 210, f1: 52, drop: 0.07, dur: 0.5, drive: 2.2, level: 0.85, click: 0.35, clickF: 1400, wave: '', clickWave: '' } },
    { drumname: 'TIGHT', drumprops: { f0: 170, f1: 55, drop: 0.04, dur: 0.2, click: 0.3, drive: 0, wave: '', level: 0, clickWave: '', clickF: 0 } }
];
let snareInfos = [
    { snarename: 'CRISP', snareprops: { tones: [[185, 0.4], [330, 0.25]], toneDur: 0.18, noise: 0.6, nFreq: 1600, nDur: 0.28 } },
    { snarename: 'RIM', snareprops: { tones: [[440, 0.5], [660, 0.2]], toneDur: 0.06, noise: 0.25, nFreq: 2400, nDur: 0.07 } },
    { snarename: 'BIG', snareprops: { tones: [[150, 0.45], [270, 0.3]], toneDur: 0.4, noise: 0.55, nFreq: 1100, nDur: 0.8 } },
    { snarename: 'NOISE', snareprops: { tones: [[185, 0.15]], toneDur: 0.1, noise: 0.8, nFreq: 800, nDur: 0.5 } }
];
let clapInfos = [
    { clapname: '808', clapprops: { freq: 1200, bursts: [0, 0.011, 0.022], tail: 0.6, q: 0 } },
    { clapname: '505', clapprops: { freq: 1600, q: 2, bursts: [0, 0.009], tail: 0.2 } },
    { clapname: 'DOUBLE', clapprops: { freq: 1200, bursts: [0, 0.011, 0.022, 0.09, 0.101], tail: 0.45, q: 0 } },
    { clapname: 'ROOM', clapprops: { freq: 1000, q: 1, bursts: [0, 0.011, 0.022], tail: 1.0 } }
];
let hatInfos = [
    { hatname: 'LO METAL', hatprops: { fScale: 0.7, bpF: 6500, hpF: 4500, level: 0.5, decay: 0.2, wash: 0 } },
    { hatname: 'CLASSIC', hatprops: { level: 0.5, decay: 0.15, wash: 0, fScale: 0, bpF: 0, hpF: 0 } },
    { hatname: 'HIGH', hatprops: { fScale: 1.3, level: 0.45, decay: 0.09, wash: 0, hpF: 0, bpF: 0 } },
    { hatname: 'TIGHT', hatprops: { fScale: 1.6, hpF: 9000, level: 0.4, decay: 0.05, wash: 0, bpF: 0 } }
];
let ohatInfos = [
    { hatname: 'CRASH', hatprops: { level: 0.5, decay: 2.5, wash: 0.3, fScale: 0, bpF: 0, hpF: 0 } },
    { hatname: 'LONG', hatprops: { level: 0.45, decay: 1.2, wash: 0.0, fScale: 0, bpF: 0, hpF: 0 } },
    { hatname: 'MID', hatprops: { level: 0.45, decay: 0.7, wash: 0.0, fScale: 0, bpF: 0, hpF: 0 } },
    { hatname: 'SHORT', hatprops: { fScale: 1.3, level: 0.4, decay: 0.35, wash: 0.0, bpF: 0, hpF: 0 } }
];
let cowbellInfos = [
    { cowbellname: '808', cowbellprops: { freqs: [540, 800], dur: 0.7, bpF: 0, q: 0, level: 0, strike: 0 } },
    { cowbellname: 'REAL', cowbellprops: { freqs: [562, 845, 1102, 1460], bpF: 1100, q: 0.9, level: 0.3, dur: 0.45, strike: 0.25 } },
    { cowbellname: 'LOW', cowbellprops: { freqs: [405, 600], bpF: 550, dur: 0.9, q: 0, level: 0, strike: 0 } },
    { cowbellname: 'PING', cowbellprops: { freqs: [880, 1320], bpF: 1200, dur: 0.25, level: 0.35, q: 0, strike: 0 } }
];
let tomInfos = [
    { tomname: '808', tomprops: { f0: 200, f1: 110, dur: 0.85, skin: 0.15, drop: 0, wave: '', skinF: 0, skinDur: 0 } },
    { tomname: 'ELECTRO', tomprops: { f0: 300, f1: 90, drop: 0.3, dur: 1.0, wave: '', skinF: 0, skinDur: 0, skin: 0 } },
    { tomname: 'NATURAL', tomprops: { f0: 185, f1: 140, drop: 0.08, wave: 'triangle', dur: 0.5, skin: 0.3, skinF: 1200, skinDur: 0.08 } },
    { tomname: 'TIGHT', tomprops: { f0: 220, f1: 160, drop: 0.05, dur: 0.25, skin: 0.2, wave: '', skinF: 0, skinDur: 0 } }
];
function drumEng(ctx, when, out, p, o) {
    const osc = trackSource(ctx.createOscillator());
    const g = ctx.createGain();
    osc.type = o.wave || 'sine';
    osc.frequency.setValueAtTime(o.f0 * p, when);
    osc.frequency.exponentialRampToValueAtTime(o.f1 * p, when + o.drop);
    g.gain.setValueAtTime(o.level || 1.0, when);
    g.gain.exponentialRampToValueAtTime(0.0001, when + o.dur);
    if (o.drive) {
        const d = ctx.createGain();
        d.gain.value = o.drive;
        const ws = ctx.createWaveShaper();
        ws.curve = CURVE;
        osc.connect(d).connect(ws).connect(g);
    }
    else {
        osc.connect(g);
    }
    g.connect(out);
    osc.start(when);
    osc.stop(when + o.dur + 0.05);
    if (o.click) {
        const c = trackSource(ctx.createOscillator());
        const cg = ctx.createGain();
        c.type = o.clickWave || 'square';
        c.frequency.setValueAtTime((o.clickF || 900) * p, when);
        cg.gain.setValueAtTime(o.click, when);
        cg.gain.exponentialRampToValueAtTime(0.0001, when + 0.015);
        c.connect(cg).connect(out);
        c.start(when);
        c.stop(when + 0.03);
    }
}
function snareEng(ctx, when, out, p, o) {
    (o.tones || []).forEach(pair => {
        const osc = trackSource(ctx.createOscillator());
        const g = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(pair[0] * p, when);
        g.gain.setValueAtTime(pair[1], when);
        g.gain.exponentialRampToValueAtTime(0.0001, when + o.toneDur);
        osc.connect(g).connect(out);
        osc.start(when);
        osc.stop(when + o.toneDur + 0.03);
    });
    if (o.noise) {
        const n = noiseSrc(ctx);
        const f = ctx.createBiquadFilter();
        f.type = 'highpass';
        f.frequency.value = o.nFreq * p;
        const g = ctx.createGain();
        g.gain.setValueAtTime(o.noise, when);
        g.gain.exponentialRampToValueAtTime(0.0001, when + o.nDur);
        n.connect(f).connect(g).connect(out);
        n.start(when);
        n.stop(when + o.nDur + 0.02);
    }
}
function clapEng(ctx, when, out, p, o) {
    const n = noiseSrc(ctx);
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = o.freq * p;
    bp.Q.value = o.q || 1.5;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, when);
    o.bursts.forEach(off => {
        g.gain.setValueAtTime(0.9, when + off);
        g.gain.exponentialRampToValueAtTime(0.12, when + off + 0.01);
    });
    const last = o.bursts[o.bursts.length - 1];
    g.gain.setValueAtTime(0.7, when + last + 0.011);
    g.gain.exponentialRampToValueAtTime(0.0001, when + last + o.tail);
    n.connect(bp).connect(g).connect(out);
    n.start(when);
    n.stop(when + last + o.tail + 0.02);
}
function hatEng(ctx, when, out, p, o) {
    const freqs = [263, 400, 421, 474, 587, 845];
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = (o.bpF || 10000) * p;
    bp.Q.value = 0.8;
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = (o.hpF || 7000) * p;
    const g = ctx.createGain();
    g.gain.setValueAtTime(o.level, when);
    g.gain.exponentialRampToValueAtTime(0.0001, when + o.decay);
    bp.connect(hp).connect(g).connect(out);
    freqs.forEach(f => {
        const osc = trackSource(ctx.createOscillator());
        osc.type = 'square';
        osc.frequency.value = f * (o.fScale || 1) * p;
        osc.connect(bp);
        osc.start(when);
        osc.stop(when + o.decay + 0.05);
    });
    if (o.wash) {
        const n = noiseSrc(ctx);
        const f = ctx.createBiquadFilter();
        f.type = 'highpass';
        f.frequency.value = 5000 * p;
        const ng = ctx.createGain();
        ng.gain.setValueAtTime(o.wash, when);
        ng.gain.exponentialRampToValueAtTime(0.0001, when + o.decay);
        n.connect(f).connect(ng).connect(out);
        n.start(when);
        n.stop(when + o.decay + 0.02);
    }
}
function bellEng(ctx, when, out, p, o) {
    o.freqs.forEach(f => {
        const osc = trackSource(ctx.createOscillator());
        const bp = ctx.createBiquadFilter();
        const g = ctx.createGain();
        osc.type = 'square';
        osc.frequency.value = f * p;
        bp.type = 'bandpass';
        bp.frequency.value = (o.bpF || 700) * p;
        bp.Q.value = o.q || 1.2;
        g.gain.setValueAtTime(o.level || 0.45, when);
        g.gain.exponentialRampToValueAtTime(0.12, when + 0.03);
        g.gain.exponentialRampToValueAtTime(0.0001, when + o.dur);
        osc.connect(bp).connect(g).connect(out);
        osc.start(when);
        osc.stop(when + o.dur + 0.05);
    });
    if (o.strike) {
        const n = noiseSrc(ctx);
        const f = ctx.createBiquadFilter();
        f.type = 'bandpass';
        f.frequency.value = 2500 * p;
        const ng = ctx.createGain();
        ng.gain.setValueAtTime(o.strike, when);
        ng.gain.exponentialRampToValueAtTime(0.0001, when + 0.03);
        n.connect(f).connect(ng).connect(out);
        n.start(when);
        n.stop(when + 0.05);
    }
}
function tomEng(ctx, when, out, p, o) {
    const osc = trackSource(ctx.createOscillator());
    const g = ctx.createGain();
    osc.type = o.wave || 'sine';
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