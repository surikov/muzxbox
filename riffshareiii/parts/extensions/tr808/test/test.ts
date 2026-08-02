/*type DrumEngineProps808 = {
	f0: number,
	f1: number,
	drop: number,
	dur: number,
	click: number,
	clickWave: string,
	clickF: number
	, drive: number
	, wave: string
	, level: number
	, skin: number
	, skinF: number
	, skinDur
};*/
function startTest() {
	console.log('startTest');
	let audioContext = new AudioContext();//create the main object
	let when = audioContext.currentTime + 0.1;//start time
	/*
	let beep = audioContext.createOscillator();//beep object
	beep.frequency.value = 440;//frequency of note A
	beep.connect(audioContext.destination);//send sound to the output
	beep.start(when);//start sound
	beep.stop(when + 1);//stop sound after 1 second
	*/
	/*let par: DrumEngineProps808 = {
		f0: 200,
		f1: 110,
		dur: 0.85,
		skin: 0.15
		, drop: 0, click: 0, clickWave: '', clickF: 0, drive: 0, wave: '', level: 0, skinF: 0, skinDur: 0
	};*/
	//tomEng(audioContext, when, audioContext.destination, 1, par);
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

}
const NOISE_SECONDS = 2;
const NOISE_DATA = (() => {
	const d = new Float32Array(96000 * NOISE_SECONDS);
	for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
	return d;
})();
function fillFrom(dst, src) {
	const step = src.length / dst.length;
	for (let i = 0; i < dst.length; i++) dst[i] = src[Math.floor(i * step)];
};
function noiseBuf(ac: AudioContext) {
	const len = Math.floor(ac.sampleRate * NOISE_SECONDS);
	const buf = ac.createBuffer(1, len, ac.sampleRate);
	fillFrom(buf.getChannelData(0), NOISE_DATA);
	return buf;
};
function noiseSrc(ac: AudioContext): AudioBufferSourceNode {
	const s = ac.createBufferSource();
	s.buffer = noiseBuf(ac);
	s.loop = true;
	s.loopStart = Math.random() * 1.0; // decorrelate rapid retriggers
	return s;
};
// gentle tanh saturation curve, shared by the live and export graphs
const CURVE = (() => {
	const n = 1024,
		c = new Float32Array(n);
	for (let i = 0; i < n; i++) {
		const x = (i / (n - 1)) * 2 - 1;
		c[i] = Math.tanh(1.6 * x) / Math.tanh(1.6);
	}
	return c;
})();
/*
// tom family: pitched drop + optional "skin" noise attack
function tomEng(ctx: AudioContext, when: number, out: AudioNode, p: number, o: DrumEngineProps808) {
	const osc = ctx.createOscillator();
	const g = ctx.createGain();
	let strtype: string = o.wave || 'sine';
	//osc.type = o.wave || 'sine';
	osc.type = strtype as OscillatorType;
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
}*/
function trackSource(node) {
	return node;
}
type DrumEngineProps808 = {
	f0: number,
	f1: number,
	drop: number,
	dur: number,
	click: number,
	clickWave: string,
	clickF: number
	, drive: number
	, wave: string
	, level: number
};
type Drum808info = { drumname: string, drumprops: DrumEngineProps808 };
let drumInfos: Drum808info[] = [
	{ drumname: '808 SUB', drumprops: { f0: 110, f1: 34, drop: 0.28, dur: 4.5, click: 0.2, clickWave: 'triangle', clickF: 400, drive: 0, wave: '', level: 0 } }
	, { drumname: 'DEEP', drumprops: { f0: 80, f1: 28, drop: 0.4, dur: 6.0, click: 0.1, clickWave: 'triangle', clickF: 300, drive: 0, wave: '', level: 0 } }
	, { drumname: 'DIRTY', drumprops: { f0: 100, f1: 32, drop: 0.3, dur: 4.0, drive: 3, level: 0.8, click: 0.2, clickWave: 'triangle', clickF: 400, wave: '' } }
	, { drumname: 'PUNCH', drumprops: { f0: 140, f1: 40, drop: 0.15, dur: 2.0, click: 0.3, drive: 0, wave: '', level: 0, clickWave: '', clickF: 0 } }
];
type SnareEngineProps808 = {
	toneDur: number
	, noise: number
	, nDur: number
	, nFreq: number
	, tones: number[][]
};
type Snare808info = { snarename: string, snareprops: SnareEngineProps808 };
let snareInfos: Snare808info[] = [
	{ snarename: 'CRISP', snareprops: { tones: [[185, 0.4], [330, 0.25]], toneDur: 0.18, noise: 0.6, nFreq: 1600, nDur: 0.28 } }
	, { snarename: 'RIM', snareprops: { tones: [[440, 0.5], [660, 0.2]], toneDur: 0.06, noise: 0.25, nFreq: 2400, nDur: 0.07 } }
	, { snarename: 'BIG', snareprops: { tones: [[150, 0.45], [270, 0.3]], toneDur: 0.4, noise: 0.55, nFreq: 1100, nDur: 0.8 } }
	, { snarename: 'NOISE', snareprops: { tones: [[185, 0.15]], toneDur: 0.1, noise: 0.8, nFreq: 800, nDur: 0.5 } }
];
type ClapEngineProps808 = {
	freq: number
	, bursts: number[]
	, q: number
	, tail: number
};
type Clap808info = { clapname: string, clapprops: ClapEngineProps808 };
let clapInfos: Clap808info[] = [
	{ clapname: '808', clapprops: { freq: 1200, bursts: [0, 0.011, 0.022], tail: 0.6, q: 0 } }
	, { clapname: '505', clapprops: { freq: 1600, q: 2, bursts: [0, 0.009], tail: 0.2 } }
	, { clapname: 'DOUBLE', clapprops: { freq: 1200, bursts: [0, 0.011, 0.022, 0.09, 0.101], tail: 0.45, q: 0 } }
	, { clapname: 'ROOM', clapprops: { freq: 1000, q: 1, bursts: [0, 0.011, 0.022], tail: 1.0 } }
];
// pitched drum: sine/tri drop + optional drive + optional click
function drumEng(ctx: AudioContext, t: number, out: AudioNode, p: number, o: DrumEngineProps808) {
	const osc = trackSource(ctx.createOscillator());
	const g = ctx.createGain();
	osc.type = o.wave || 'sine';
	osc.frequency.setValueAtTime(o.f0 * p, t);
	osc.frequency.exponentialRampToValueAtTime(o.f1 * p, t + o.drop);
	g.gain.setValueAtTime(o.level || 1.0, t);
	g.gain.exponentialRampToValueAtTime(0.0001, t + o.dur);
	if (o.drive) {
		const d = ctx.createGain();
		d.gain.value = o.drive;
		const ws = ctx.createWaveShaper();
		ws.curve = CURVE;
		osc.connect(d).connect(ws).connect(g);
	} else {
		osc.connect(g);
	}
	g.connect(out);
	osc.start(t);
	osc.stop(t + o.dur + 0.05);
	if (o.click) {
		const c = trackSource(ctx.createOscillator());
		const cg = ctx.createGain();
		c.type = o.clickWave || 'square';
		c.frequency.setValueAtTime((o.clickF || 900) * p, t);
		cg.gain.setValueAtTime(o.click, t);
		cg.gain.exponentialRampToValueAtTime(0.0001, t + 0.015);
		c.connect(cg).connect(out);
		c.start(t);
		c.stop(t + 0.03);
	}
}

// snare family: tone pair + filtered noise
function snareEng(ctx: AudioContext, t: number, out: AudioNode, p: number, o: SnareEngineProps808) {
	(o.tones || []).forEach(pair => {
		const osc = trackSource(ctx.createOscillator());
		const g = ctx.createGain();
		osc.type = 'triangle';
		osc.frequency.setValueAtTime(pair[0] * p, t);
		g.gain.setValueAtTime(pair[1], t);
		g.gain.exponentialRampToValueAtTime(0.0001, t + o.toneDur);
		osc.connect(g).connect(out);
		osc.start(t);
		osc.stop(t + o.toneDur + 0.03);
	});
	if (o.noise) {
		const n = noiseSrc(ctx);
		const f = ctx.createBiquadFilter();
		f.type = 'highpass';
		f.frequency.value = o.nFreq * p;
		const g = ctx.createGain();
		g.gain.setValueAtTime(o.noise, t);
		g.gain.exponentialRampToValueAtTime(0.0001, t + o.nDur);
		n.connect(f).connect(g).connect(out);
		n.start(t);
		n.stop(t + o.nDur + 0.02);
	}
}

// clap family: noise bursts through a bandpass, then a tail
function clapEng(ctx: AudioContext, t: number, out: AudioNode, p: number, o: ClapEngineProps808) {
	const n = noiseSrc(ctx);
	const bp = ctx.createBiquadFilter();
	bp.type = 'bandpass';
	bp.frequency.value = o.freq * p;
	bp.Q.value = o.q || 1.5;
	const g = ctx.createGain();
	g.gain.setValueAtTime(0.0001, t);
	o.bursts.forEach(off => {
		g.gain.setValueAtTime(0.9, t + off);
		g.gain.exponentialRampToValueAtTime(0.12, t + off + 0.01);
	});
	const last = o.bursts[o.bursts.length - 1];
	g.gain.setValueAtTime(0.7, t + last + 0.011);
	g.gain.exponentialRampToValueAtTime(0.0001, t + last + o.tail);
	n.connect(bp).connect(g).connect(out);
	n.start(t);
	n.stop(t + last + o.tail + 0.02);
}
type HatEngineProps808 = {
	level: number
	, bpF: number
	, hpF: number
	, decay: number
	, fScale: number
	, wash: number
};
// hat family: six metallic squares + filters, optional noisy crash wash
function hatEng(ctx: AudioContext, t: number, out: AudioNode, p: number, o: HatEngineProps808) {
	const freqs = [263, 400, 421, 474, 587, 845];
	const bp = ctx.createBiquadFilter();
	bp.type = 'bandpass';
	bp.frequency.value = (o.bpF || 10000) * p;
	bp.Q.value = 0.8;
	const hp = ctx.createBiquadFilter();
	hp.type = 'highpass';
	hp.frequency.value = (o.hpF || 7000) * p;
	const g = ctx.createGain();
	g.gain.setValueAtTime(o.level, t);
	g.gain.exponentialRampToValueAtTime(0.0001, t + o.decay);
	bp.connect(hp).connect(g).connect(out);
	freqs.forEach(f => {
		const osc = trackSource(ctx.createOscillator());
		osc.type = 'square';
		osc.frequency.value = f * (o.fScale || 1) * p;
		osc.connect(bp);
		osc.start(t);
		osc.stop(t + o.decay + 0.05);
	});
	if (o.wash) {
		const n = noiseSrc(ctx);
		const f = ctx.createBiquadFilter();
		f.type = 'highpass';
		f.frequency.value = 5000 * p;
		const ng = ctx.createGain();
		ng.gain.setValueAtTime(o.wash, t);
		ng.gain.exponentialRampToValueAtTime(0.0001, t + o.decay);
		n.connect(f).connect(ng).connect(out);
		n.start(t);
		n.stop(t + o.decay + 0.02);
	}
}
type CowbellEngineProps808 = {

	level: number
	, dur: number
	, freqs: number[]
	, bpF: number
	, strike: number
	, q: number
};
// cowbell family: square partials through a bandpass, optional strike noise
function bellEng(ctx: AudioContext, t: number, out: AudioNode, p: number, o: CowbellEngineProps808) {
	o.freqs.forEach(f => {
		const osc = trackSource(ctx.createOscillator());
		const bp = ctx.createBiquadFilter();
		const g = ctx.createGain();
		osc.type = 'square';
		osc.frequency.value = f * p;
		bp.type = 'bandpass';
		bp.frequency.value = (o.bpF || 700) * p;
		bp.Q.value = o.q || 1.2;
		g.gain.setValueAtTime(o.level || 0.45, t);
		g.gain.exponentialRampToValueAtTime(0.12, t + 0.03);
		g.gain.exponentialRampToValueAtTime(0.0001, t + o.dur);
		osc.connect(bp).connect(g).connect(out);
		osc.start(t);
		osc.stop(t + o.dur + 0.05);
	});
	if (o.strike) {
		const n = noiseSrc(ctx);
		const f = ctx.createBiquadFilter();
		f.type = 'bandpass';
		f.frequency.value = 2500 * p;
		const ng = ctx.createGain();
		ng.gain.setValueAtTime(o.strike, t);
		ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
		n.connect(f).connect(ng).connect(out);
		n.start(t);
		n.stop(t + 0.05);
	}
}
type TomEngineProps808 = {
	f0: number,
	f1: number,
	drop: number,
	dur: number,

	wave: string

	, skin: number
	, skinF: number
	, skinDur: number

};
// tom family: pitched drop + optional "skin" noise attack
function tomEng(ctx: AudioContext, t: number, out: AudioNode, p: number, o: TomEngineProps808) {
	const osc = trackSource(ctx.createOscillator());
	const g = ctx.createGain();
	osc.type = o.wave || 'sine';
	osc.frequency.setValueAtTime(o.f0 * p, t);
	osc.frequency.exponentialRampToValueAtTime(o.f1 * p, t + (o.drop || 0.12));
	g.gain.setValueAtTime(0.85, t);
	g.gain.exponentialRampToValueAtTime(0.0001, t + o.dur);
	osc.connect(g).connect(out);
	osc.start(t);
	osc.stop(t + o.dur + 0.05);
	if (o.skin) {
		const n = noiseSrc(ctx);
		const lp = ctx.createBiquadFilter();
		lp.type = 'lowpass';
		lp.frequency.value = (o.skinF || 800) * p;
		const ng = ctx.createGain();
		ng.gain.setValueAtTime(o.skin, t);
		ng.gain.exponentialRampToValueAtTime(0.0001, t + (o.skinDur || 0.05));
		n.connect(lp).connect(ng).connect(out);
		n.start(t);
		n.stop(t + (o.skinDur || 0.05) + 0.02);
	}
}

