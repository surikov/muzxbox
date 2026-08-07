//(() => {
// FRESH SLATE: a plain visit (no shared beat incoming) boots factory-default —
// empty loop, empty banks, default knobs. We wipe persisted state BEFORE any
// of it is read below. A shared link (?s=code, or a legacy #loop= hash) brings
// its own beat, so we leave state alone on that path and let it overwrite.
console.log('1');
function freshSlate() {
	console.log('2');
	const incoming = /[?&]s=[a-z0-9]/i.test(location.search) || /loop=/.test(location.hash);
	if (incoming) return;
	['pads808-banks', 'pads808-transport', 'pads808-choke', 'pads808-pitch',
		'pads808-variant', 'pads808-volume', 'pads808-send', 'pads808-verb',
		'pads808-comp', 'pads808-tube'
	].forEach(k => {
		try {
			localStorage.removeItem(k);
		} catch (_) { }
	});
};
freshSlate();
console.log('3');
// boot overlay can never trap the app: hard anti-brick clear (the boot now
// waits for a tap and auto-rolls itself at 9s, so this only fires if something errored)
setTimeout(() => {
	const b = document.getElementById('boot');
	if (b) b.remove();
}, 16000);
// the real visible height (innerHeight is correct in Safari AND standalone PWA,
// where svh/dvh can be wrong); keep it fresh on rotate / toolbar changes
const setAppH = () => document.documentElement.style.setProperty('--app-h', window.innerHeight + 'px');
setAppH();
window.addEventListener('resize', setAppH);
window.addEventListener('orientationchange', setAppH);
'use strict';

// ---------- Audio engine ----------
//const AC = window.AudioContext || window.webkitAudioContext;
// Buffer size trades latency against pop-resistance, and it's ONE setting for
// the whole context. iOS/desktop hold the tightest buffer (snappy taps, no
// pops); Android underruns there, so it defaults roomier. Tuning knob: append
// ?lat=<value> to the URL to override live on a real device — a number of
// seconds (e.g. 0.012, 0.02) or a category (interactive / balanced / playback).
// Find the smallest that doesn't pop; the footer shows the resulting latency.
/*const latOverride = new URLSearchParams(location.search).get('lat');
let latHint = /Android/i.test(navigator.userAgent) ? 'balanced' : 0;
if (latOverride) latHint = /^[\d.]+$/.test(latOverride) ? parseFloat(latOverride) : latOverride;
const ctx = new AC({
	latencyHint: latHint
});*/
const ctx: AudioContext = new AudioContext({
	latencyHint: 'interactive'
});
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

// shared random data, generated once at 96k resolution, so live playback
// and the offline WAV export are built from IDENTICAL noise + reverb
const NOISE_SECONDS = 2;
const NOISE_DATA = (() => {
	const d = new Float32Array(96000 * NOISE_SECONDS);
	for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
	return d;
})();
// 1.6s plate, not a 2.8s hall: a drum reverb has to sit BEHIND the kit, not
// swallow it. Shorter tail + slightly steeper decay (^2.8) = space without
// smear, so the dial stays musical to the top instead of dying at 5.
const IR_SECONDS = 1.6;
const IR_DATA = [0, 1].map(() => {
	const len = Math.floor(96000 * IR_SECONDS);
	const d = new Float32Array(len);
	for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.8);
	return d;
});
function fillFrom(dst, src) {
	const step = src.length / dst.length;
	for (let i = 0; i < dst.length; i++) dst[i] = src[Math.floor(i * step)];
};
/*
const fillFrom = (dst, src) => {
	const step = src.length / dst.length;
	for (let i = 0; i < dst.length; i++) dst[i] = src[Math.floor(i * step)];
};*/
type Buss808 = {
	master: GainNode,
	comp: DynamicsCompressorNode,
	makeup: GainNode,
	drive: GainNode,
	post: GainNode,
	dry: GainNode,
	wet: GainNode,
	verb: ConvolverNode
};
// master bus: voices -> master -> comp -> makeup -> saturation -> dry/wet
// verb. Built per-context so the WAV export renders the exact same chain.
function makeBus(ac: AudioContext, offline?): Buss808 {
	const master: GainNode = ac.createGain();
	master.gain.value = 0.85;
	const shaper = ac.createWaveShaper();
	shaper.curve = CURVE;
	shaper.oversample = '2x';
	const comp: DynamicsCompressorNode = ac.createDynamicsCompressor();
	comp.knee.value = 12;
	comp.attack.value = 0.003;
	comp.release.value = 0.15;
	comp.threshold.value = 0;
	comp.ratio.value = 1;
	const makeup = ac.createGain();
	const verb = ac.createConvolver();
	const ir = ac.createBuffer(2, Math.floor(ac.sampleRate * IR_SECONDS), ac.sampleRate);
	fillFrom(ir.getChannelData(0), IR_DATA[0]);
	fillFrom(ir.getChannelData(1), IR_DATA[1]);
	// Safari's OfflineAudioContext mis-applies ConvolverNode auto-normalization,
	// so it convolves the beat against our un-normalized 1.6s full-scale noise
	// IR = a giant noise blast = the "static" WAV (peak in the thousands, only
	// on Safari; Chrome renders the same graph clean). For the EXPORT we bake
	// WebKit's own normalization scale into the IR and turn auto-normalize OFF,
	// so the render is deterministic and matches the live, normalized sound.
	// Live playback (offline=false) is untouched.
	if (offline) {
		verb.normalize = false;
		const a = ir.getChannelData(0),
			b = ir.getChannelData(1),
			N = ir.length;
		let power = 0;
		for (let i = 0; i < N; i++) power += a[i] * a[i] + b[i] * b[i];
		power = Math.sqrt(power / (2 * N));
		if (!isFinite(power) || power < 0.000125) power = 0.000125;
		const scale = (1 / power) * 0.00125 * (44100 / ac.sampleRate); // WebKit's calc
		for (let i = 0; i < N; i++) {
			a[i] *= scale;
			b[i] *= scale;
		}
	}
	verb.buffer = ir;
	const dry = ac.createGain();
	const wet = ac.createGain();
	wet.gain.value = 0;
	// output trim: ~1 dB of headroom so peaks never ride the ceiling
	const trim = ac.createGain();
	trim.gain.value = 0.89;
	// TUBE: drive into the tanh stage (pre-gain) with post compensation;
	// detent 1 = unity = the bus exactly as it was before the dial existed
	const drive = ac.createGain();
	const post = ac.createGain();
	master.connect(comp).connect(makeup).connect(drive).connect(shaper).connect(post).connect(trim);
	trim.connect(dry).connect(ac.destination);
	// SEND/RETURN reverb: the verb is NO LONGER fed from the master mix; each pad
	// sends into it by its own amount (padSend -> verb). `wet` is the master
	// return level (the global verb knob); `dry` stays full (reverb is additive).
	// DECISIVE TEST: in the export, leave the reverb return disconnected so the
	// convolver contributes nothing. If the WAV is clean now, the Safari offline
	// convolver IS the static; if still static, the reverb is innocent.
	if (!offline) verb.connect(wet).connect(ac.destination);
	return {
		master,
		comp,
		makeup,
		drive,
		post,
		dry,
		wet,
		verb
	};
}
const bus: Buss808 = makeBus(ctx);

// --- per-hit node cleanup (iOS WebKit leak fix) --------------------------
// A Web Audio node that has stopped but is still connected stays live in
// WebKit's render graph forever; a dense loop piles up thousands of them and
// the audio distorts, then dies. Every synthesised source registers here so
// its hit's gain (vg) can be torn off the bus the instant the last source
// ends, dropping the whole subtree for GC. activeVoice is set only while a
// LIVE hit is being built (renderHit); offline WAV export leaves it null and
// is therefore untouched, byte for byte.
let activeVoice: Voice808 | null = null;

function trackSource(node) {
	const v = activeVoice;
	if (!v) return node; // offline render / non-live: behave exactly as before
	v.n++;
	node.addEventListener('ended', () => {
		try {
			node.disconnect();
		} catch (_) { }
		if (--v.n === 0 && !v.done) {
			v.done = true;
			clearTimeout(v.timer);
			try {
				v.vg.disconnect();
			} catch (_) { }
		}
	});
	return node;
}

// ---------- 808 voices (all synthesized) ----------
// Every voice renders into `out`, a per-trigger gain node owned by the
// trigger plumbing (what the choke gate clamps). `p` is the pitch ratio
// from the pitch dial (2^(semitones/12)); every frequency scales by it.
// Each pad has FOUR variants, picked by the bank selector. Six engines
// cover all 32 sounds. The whole kit builds per-context (makeKit) so the
// WAV export re-renders identical synthesis offline; `ctx` here shadows
// whichever context the kit is being built into.
type EngineFunc808 = (time: number, out: AudioNode, pitchRatio: number) => void;
type CategoryKit808 = {
	names: string[]
	, engineFunctions: EngineFunc808[];//((time: number, out: AudioNode, pitchRatio: number) => void)[]
};
type KIT808 = {
	boom: CategoryKit808
	, kick: CategoryKit808
	, snare: CategoryKit808
	, clap: CategoryKit808
	, chat: CategoryKit808
	, cowbell: CategoryKit808
	, ohat: CategoryKit808
	, hitom: CategoryKit808
};
function findKitCategoryByName(kit: KIT808, name: 'boom' | 'kick' | 'snare' | 'clap' | 'chat' | 'cowbell' | 'ohat' | 'hitom'): CategoryKit808 {
	if (name == 'boom') return kit.boom;
	if (name == 'kick') return kit.kick;
	if (name == 'snare') return kit.snare;
	if (name == 'clap') return kit.clap;
	if (name == 'chat') return kit.chat;
	if (name == 'cowbell') return kit.cowbell;
	if (name == 'ohat') return kit.ohat;
	return kit.hitom;
}
function make808Kit(ac: AudioContext): KIT808 {
	const ctx: AudioContext = ac;

	const noiseBuf = (() => {
		const len = Math.floor(ac.sampleRate * NOISE_SECONDS);
		const buf = ac.createBuffer(1, len, ac.sampleRate);
		fillFrom(buf.getChannelData(0), NOISE_DATA);
		return buf;
	})();
	const noiseSrc = () => {
		const s = trackSource(ac.createBufferSource());
		s.buffer = noiseBuf;
		s.loop = true;
		s.loopStart = Math.random() * 1.0; // decorrelate rapid retriggers
		return s;
	};
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

	// pitched drum: sine/tri drop + optional drive + optional click
	function drumEng(t: number, out: AudioNode, p: number, o: DrumEngineProps808) {
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
	type SnareEngineProps808 = {
		toneDur: number
		, noise: number
		, nDur: number
		, nFreq: number
		, tones: number[][]
	};
	// snare family: tone pair + filtered noise
	function snareEng(t: number, out: AudioNode, p: number, o: SnareEngineProps808) {
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
			const n = noiseSrc();
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
	type ClapEngineProps808 = {
		freq: number
		, bursts: number[]
		, q: number
		, tail: number
	};
	// clap family: noise bursts through a bandpass, then a tail
	function clapEng(t: number, out: AudioNode, p: number, o: ClapEngineProps808) {
		const n = noiseSrc();
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
	function hatEng(t: number, out: AudioNode, p: number, o: HatEngineProps808) {
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
			const n = noiseSrc();
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
	function bellEng(t: number, out: AudioNode, p: number, o: CowbellEngineProps808) {
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
			const n = noiseSrc();
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
	function tomEng(t: number, out: AudioNode, p: number, o: TomEngineProps808) {
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
			const n = noiseSrc();
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

	// The kit: 8 pads x 4 named variants = 32 sounds
	const KIT: KIT808 = {

		boom: {
			names: ['808 SUB', 'DEEP', 'DIRTY', 'PUNCH'],
			engineFunctions: [
				(t, o, p) => drumEng(t, o, p, {
					f0: 110,
					f1: 34,
					drop: 0.28,
					dur: 4.5,
					click: 0.2,
					clickWave: 'triangle',
					clickF: 400
					//
					, drive: 0
					, wave: ''
					, level: 0

				}),
				(t, o, p) => drumEng(t, o, p, {
					f0: 80,
					f1: 28,
					drop: 0.4,
					dur: 6.0,
					click: 0.1,
					clickWave: 'triangle',
					clickF: 300
					//
					, drive: 0
					, wave: ''
					, level: 0

				}),
				(t, o, p) => drumEng(t, o, p, {
					f0: 100,
					f1: 32,
					drop: 0.3,
					dur: 4.0,
					drive: 3,
					level: 0.8,
					click: 0.2,
					clickWave: 'triangle',
					clickF: 400
					//
					, wave: ''

				}),
				(t, o, p) => drumEng(t, o, p, {
					f0: 140,
					f1: 40,
					drop: 0.15,
					dur: 2.0,
					click: 0.3
					//
					, drive: 0
					, wave: ''
					, level: 0
					, clickWave: '',
					clickF: 0

				}),
			],
		},
		kick: {
			names: ['808', '707', '909', 'TIGHT'],
			engineFunctions: [
				(t, o, p) => drumEng(t, o, p, {
					f0: 160,
					f1: 48,
					drop: 0.09,
					dur: 0.9,
					click: 0.25
					//
					, drive: 0
					, wave: ''
					, level: 0
					, clickWave: '',
					clickF: 0

				}),
				(t, o, p) => drumEng(t, o, p, {
					f0: 190,
					f1: 62,
					drop: 0.05,
					dur: 0.35,
					wave: 'triangle',
					click: 0.3,
					clickF: 1100
					//
					, drive: 0
					, level: 0
					, clickWave: ''

				}),
				(t, o, p) => drumEng(t, o, p, {
					f0: 210,
					f1: 52,
					drop: 0.07,
					dur: 0.5,
					drive: 2.2,
					level: 0.85,
					click: 0.35,
					clickF: 1400
					//
					, wave: ''
					, clickWave: ''

				}),
				(t, o, p) => drumEng(t, o, p, {
					f0: 170,
					f1: 55,
					drop: 0.04,
					dur: 0.2,
					click: 0.3
					//
					, drive: 0
					, wave: ''
					, level: 0
					, clickWave: '',
					clickF: 0

				}),
			],
		},
		snare: {
			names: ['CRISP', 'RIM', 'BIG', 'NOISE'],
			engineFunctions: [
				(t, o, p) => snareEng(t, o, p, {
					tones: [
						[185, 0.4],
						[330, 0.25]
					],
					toneDur: 0.18,
					noise: 0.6,
					nFreq: 1600,
					nDur: 0.28
				}),
				(t, o, p) => snareEng(t, o, p, {
					tones: [
						[440, 0.5],
						[660, 0.2]
					],
					toneDur: 0.06,
					noise: 0.25,
					nFreq: 2400,
					nDur: 0.07
				}),
				(t, o, p) => snareEng(t, o, p, {
					tones: [
						[150, 0.45],
						[270, 0.3]
					],
					toneDur: 0.4,
					noise: 0.55,
					nFreq: 1100,
					nDur: 0.8
				}),
				(t, o, p) => snareEng(t, o, p, {
					tones: [
						[185, 0.15]
					],
					toneDur: 0.1,
					noise: 0.8,
					nFreq: 800,
					nDur: 0.5
				}),
			],
		},
		clap: {
			names: ['808', '505', 'DOUBLE', 'ROOM'],
			engineFunctions: [
				(t, o, p) => clapEng(t, o, p, {
					freq: 1200,
					bursts: [0, 0.011, 0.022],
					tail: 0.6, q: 0
				}),
				(t, o, p) => clapEng(t, o, p, {
					freq: 1600,
					q: 2,
					bursts: [0, 0.009],
					tail: 0.2
				}),
				(t, o, p) => clapEng(t, o, p, {
					freq: 1200,
					bursts: [0, 0.011, 0.022, 0.09, 0.101],
					tail: 0.45, q: 0
				}),
				(t, o, p) => clapEng(t, o, p, {
					freq: 1000,
					q: 1,
					bursts: [0, 0.011, 0.022],
					tail: 1.0
				}),
			],
		},
		chat: {
			names: ['LO METAL', 'CLASSIC', 'HIGH', 'TIGHT'],
			engineFunctions: [
				(t, o, p) => hatEng(t, o, p, {
					fScale: 0.7,
					bpF: 6500,
					hpF: 4500,
					level: 0.5,
					decay: 0.2, wash: 0
				}),
				(t, o, p) => hatEng(t, o, p, {
					level: 0.5,
					decay: 0.15, wash: 0, fScale: 0, bpF: 0, hpF: 0
				}),
				(t, o, p) => hatEng(t, o, p, {
					fScale: 1.3,
					level: 0.45,
					decay: 0.09, wash: 0, hpF: 0, bpF: 0
				}),
				(t, o, p) => hatEng(t, o, p, {
					fScale: 1.6,
					hpF: 9000,
					level: 0.4,
					decay: 0.05, wash: 0, bpF: 0
				}),
			],
		},
		ohat: {
			names: ['CRASH', 'LONG', 'MID', 'SHORT'],
			engineFunctions: [
				(t, o, p) => hatEng(t, o, p, {
					level: 0.5,
					decay: 2.5,
					wash: 0.3, fScale: 0, bpF: 0, hpF: 0
				}),
				(t, o, p) => hatEng(t, o, p, {
					level: 0.45,
					decay: 1.2, wash: 0.0, fScale: 0, bpF: 0, hpF: 0
				}),
				(t, o, p) => hatEng(t, o, p, {
					level: 0.45,
					decay: 0.7, wash: 0.0, fScale: 0, bpF: 0, hpF: 0
				}),
				(t, o, p) => hatEng(t, o, p, {
					fScale: 1.3,
					level: 0.4,
					decay: 0.35, wash: 0.0, bpF: 0, hpF: 0
				}),
			],
		},
		cowbell: {
			names: ['808', 'REAL', 'LOW', 'PING'],
			engineFunctions: [
				(t, o, p) => bellEng(t, o, p, {
					freqs: [540, 800],
					dur: 0.7, bpF: 0, q: 0, level: 0, strike: 0
				}),
				(t, o, p) => bellEng(t, o, p, {
					freqs: [562, 845, 1102, 1460],
					bpF: 1100,
					q: 0.9,
					level: 0.3,
					dur: 0.45,
					strike: 0.25
				}),
				(t, o, p) => bellEng(t, o, p, {
					freqs: [405, 600],
					bpF: 550,
					dur: 0.9, q: 0, level: 0, strike: 0
				}),
				(t, o, p) => bellEng(t, o, p, {
					freqs: [880, 1320],
					bpF: 1200,
					dur: 0.25,
					level: 0.35, q: 0, strike: 0
				}),
			],
		},
		hitom: {
			names: ['808', 'ELECTRO', 'NATURAL', 'TIGHT'],
			engineFunctions: [
				(t, o, p) => tomEng(t, o, p, {
					f0: 200,
					f1: 110,
					dur: 0.85,
					skin: 0.15
					, drop: 0, wave: '', skinF: 0, skinDur: 0
				}),
				(t, o, p) => tomEng(t, o, p, {
					f0: 300,
					f1: 90,
					drop: 0.3,
					dur: 1.0
					, wave: '', skinF: 0, skinDur: 0, skin: 0
				}),
				(t, o, p) => tomEng(t, o, p, {
					f0: 185,
					f1: 140,
					drop: 0.08,
					wave: 'triangle',
					dur: 0.5,
					skin: 0.3,
					skinF: 1200,
					skinDur: 0.08

				}),
				(t, o, p) => tomEng(t, o, p, {
					f0: 220,
					f1: 160,
					drop: 0.05,
					dur: 0.25,
					skin: 0.2
					, wave: '', skinF: 0, skinDur: 0
				}),
			],
		},
	};
console.log(KIT);
	return KIT;
}
const workGlobalKIT: KIT808 = make808Kit(ctx);

// ---------- Trigger plumbing ----------
const power: HTMLElement = document.getElementById('power') as HTMLElement;
const powerLabel: HTMLElement = document.getElementById('powerLabel') as HTMLElement;

let lastLive = performance.now();
let idledTick = false;

function armShowLabelLive() {
	if (ctx.state !== 'running') ctx.resume();
	lastLive = performance.now();
	power.classList.add('armed');
	powerLabel.textContent = 'live';
}
// surface state changes (iOS can suspend behind your back)
ctx.onstatechange = () => {
	const on = ctx.state === 'running';
	power.classList.toggle('armed', on);
	powerLabel.textContent = on ? 'live' : 'tap to power on';
	// waking from a sleep while a loop is live: re-anchor the clock so it can't
	// burst-catch-up from the frozen position it was suspended at
	if (on && (seq.playing || seq.recording)) {
		passStart = ctx.currentTime;
		evIdx = 0;
		autoIdx = 0;
		suppressHit = null;
	}
};

// ---------- Choke (per-pad dial: 1..5) ----------
// The dial sets how much of the sound you actually hear:
// 1 = off/default, longest wave (full natural ring)
// 5 = SUPER TIGHT, shortest wave. [hold time, fade time] in seconds:
const GATE = {
	2: [0.9, 0.15],
	3: [0.35, 0.1],
	4: [0.15, 0.06],
	5: [0.05, 0.03],
};
const loadStore = key => {
	try {
		return JSON.parse(localStorage.getItem(key) || '{}');
	} catch (_) {
		return {};
	}
};
const chokeSettings = loadStore('pads808-choke');
// pitch: -6..+6 semitones per pad, 0 = factory tuning
const pitchSettings = loadStore('pads808-pitch');
// variant: which of the pad's 4 sounds is live (bank selector dots)
const variantSettings = loadStore('pads808-variant');
// SHIFT layer (per pad): volume trim (0 = unity, the center detent) and
// reverb send (5 = full, the default, so the global verb knob behaves exactly
// as before until you pull a pad out of the wash).
const volumeSettings = loadStore('pads808-volume');
const sendSettings = loadStore('pads808-send');
const VOL = {
	'-4': 0,
	'-3': 0.25,
	'-2': 0.5,
	'-1': 0.72,
	0: 1,
	1: 1.2,
	2: 1.45,
	3: 1.7,
	4: 2
};
const SEND_GAIN = {
	0: 0,
	1: 0.2,
	2: 0.4,
	3: 0.6,
	4: 0.8,
	5: 1
};
const volOf = name => VOL[Math.max(-4, Math.min(4, (volumeSettings[name] | 0)))];
// one shared reverb, fed by per-pad sends into bus.verb. Each pad gets a
// persistent send gain; renderHit taps the per-hit vg into it (post-fader).
// Seeded full; each send dial's initial onChange corrects it to the stored value.
const padSend = {};
Object.keys(workGlobalKIT).forEach(propName => {
	console.log('connect', propName, 'to convolver');
	const g = ctx.createGain();
	g.gain.value = SEND_GAIN[5];
	g.connect(bus.verb);
	padSend[propName] = g;
});
const variantOf = (name: string) => {
	return Math.min(4, Math.max(1, (variantSettings[name] | 0) || 1));
};
type Voice808 = {
	vg: GainNode;
	n: number;
	done: boolean;
	timer: number;
};
// renders a hit at time t through the CURRENT dials (live tweak by design:
// the loop replays through whatever the knobs say right now)
function renderHit(name: string, t: number, vel: number | null) {
	//console.log('renderHit');
	const v = (vel == null ? 1 : vel) * volOf(name); // velocity x per-pad volume trim
	const vg = ctx.createGain(); // per-trigger bus; this is what the gate clamps
	vg.gain.value = v; // velocity is real here
	vg.connect(bus.master);
	vg.connect(padSend[name]); // post-fader send into the one shared reverb
	const ratio = Math.pow(2, (pitchSettings[name] | 0) / 12);
	// wrap the build so every source this hit spins up is refcounted; vg gets
	// disconnected from the bus the moment the last one ends (see trackSource).
	const voice: Voice808 = {
		vg,
		n: 0,
		done: false,
		timer: 0
	};
	activeVoice = voice;
	(workGlobalKIT[name] as CategoryKit808).engineFunctions[variantOf(name) - 1](t, vg, ratio);

	activeVoice = null;
	// hard backstop: if an 'ended' is ever dropped, tear vg off the bus anyway.
	// Longest voice tails ~6s; 12s past the (possibly future) start is safe.
	voice.timer = setTimeout(() => {
		if (!voice.done) {
			voice.done = true;
			try {
				vg.disconnect();
			} catch (_) { }
		}
	}, Math.max(0, t - ctx.currentTime) * 1000 + 12000);
	const cut = GATE[chokeSettings[name] | 0];
	if (cut) {
		vg.gain.setValueAtTime(v, t + cut[0]);
		vg.gain.linearRampToValueAtTime(0.0001, t + cut[0] + cut[1]);
	}
	const lag = (t - ctx.currentTime) * 1000;
	if (lag > 10) setTimeout(() => flash(padByVoice[name], 90), lag);
}

function triggerPadSound(name: string, vel: number | null) {
	console.log('triggerPadSound', name);
	armShowLabelLive();
	// FIRST gesture: the context is still waking up, so ctx.currentTime is
	// frozen at 0. Scheduling "now" lands in the PAST once it resumes, which
	// fires the voice with a broken envelope = the stray "random drum" burst
	// (worst on the noise voices). Wait until it's actually RUNNING, then
	// render a hair ahead. Costs ~20ms on the very first hit only.
	if (ctx.state !== 'running') {
		ctx.resume().then(() => {
			if (ctx.state === 'running') renderHit(name, ctx.currentTime + 0.02, vel);
		});
		return;
	}
	const t = ctx.currentTime; // schedule immediately; zero added latency
	renderHit(name, t, vel);
	if (seq.recording) {
		if (seq.bars) {
			// overdub: layer into the existing loop, wrapped to its length
			const lb = seq.bars * 4;
			const b = (((t - passStart) / spb()) % lb + lb) % lb;
			seq.events.push({
				pad: name,
				beat: b,
				v: vel == null ? 1 : vel
			});
			buildSched();
			seekSched();
			// already heard live: if quantize pushed this hit ahead of the playhead,
			// mark it so the scheduler skips replaying it once on this pass
			const qt = qBeat(b) % lb;
			const passPos = (ctx.currentTime - passStart) / spb();
			suppressHit = qt > passPos ? {
				pad: name,
				t: qt
				, v: 0
			} : null;
		} else if (seq.guess) {
			guessTimes.push({
				pad: name,
				t,
				v: vel == null ? 1 : vel
			}); // beats resolved on stop
		} else {
			const b = (t - recStart) / spb();
			if (b >= -0.1) seq.events.push({
				pad: name,
				beat: Math.max(0, b),
				v: vel == null ? 1 : vel
			});
		}
	}
}

function flash(pad: any, ms?: number) {
	pad.classList.add('lit');
	if (ms) setTimeout(() => pad.classList.remove('lit'), ms);
}

function renderMutes() {
	document.querySelectorAll('.pad').forEach(p =>
		p.classList.toggle('muted', !!(seq.mutes && seq.mutes[(p as any).dataset.voice])));
}

// Pointer events: fire on DOWN, not click; this is where the latency lives
document.querySelectorAll('.pad').forEach(__pad => {
	let pad = __pad as any;
	const name = pad.dataset.voice;
	pad.setAttribute('role', 'button');
	pad.tabIndex = 0;
	pad.setAttribute('aria-label', pad.querySelector('.name').textContent.toLowerCase() + ' drum pad, hold to clear its part from the loop');
	// hold to clear this pad's part: same gesture as the banks
	let holdT: number | undefined = undefined;
	let holdX = 0;
	let holdY = 0;
	let holdConsumed = false;
	const cancelHold = () => {
		clearTimeout(holdT);
		holdT = undefined;
		pad.classList.remove('clearing');
	};
	pad.addEventListener('pointerdown', e => {
		console.log('click pad');
		e.preventDefault();
		holdConsumed = false;
		if (!document.body.classList.contains('shifted')) triggerPadSound(name, null); // SHIFT layer: tap mutes, long-press deletes, no sound
		flash(pad);
		if (!seq.recording && seq.events.some(ev => ev.pad === name)) {
			holdX = e.clientX;
			holdY = e.clientY;
			pad.classList.add('clearing');
			holdT = setTimeout(() => {
				cancelHold();
				holdConsumed = true;
				pushUndo();
				seq.events = seq.events.filter(ev => ev.pad !== name);
				seq.auto = seq.auto.filter(a => a.id.indexOf(name + ':') !== 0);
				buildSched();
				buildAutoSched();
				if (seq.playing) {
					seekSched();
					seekAuto();
				}
				renderTransport();
				const badge = pad.querySelector('.badge');
				badge.textContent = 'PART CLEARED';
				badge.classList.add('show');
				clearTimeout(badge._t);
				badge._t = setTimeout(() => badge.classList.remove('show'), 900);
				announce(name + ' part cleared');
			}, 1000); // matches the slower sweep on the big surface
		}
	});
	pad.addEventListener('pointermove', e => {
		if (holdT && (Math.abs(e.clientX - holdX) > 8 || Math.abs(e.clientY - holdY) > 8)) {
			cancelHold();
			holdConsumed = true;
		}
	});
	pad.addEventListener('pointerup', () => {
		if (!document.body.classList.contains('shifted') || holdConsumed) return;
		seq.mutes[name] = !seq.mutes[name];
		if (!seq.mutes[name]) delete seq.mutes[name];
		buildSched();
		if (seq.playing) seekSched();
		pad.classList.toggle('muted', !!seq.mutes[name]);
		if (activeSlot != null && banks[activeSlot]) {
			banks[activeSlot].mutes = {
				...seq.mutes
			};
			saveBanks();
		}
		announce(name + (seq.mutes[name] ? ' muted' : ' unmuted'));
	});
	pad.addEventListener('keydown', e => {
		if (e.repeat || (e.key !== 'Enter' && e.key !== ' ')) return;
		e.preventDefault();
		triggerPadSound(name, null);
		flash(pad, 100);
	});
	['pointerup', 'pointercancel', 'pointerleave'].forEach(ev =>
		pad.addEventListener(ev, () => {
			pad.classList.remove('lit');
			cancelHold();
		})
	);
});

// Keyboard mapping for desktop finger drumming
const keymap = {
	a: 'boom',
	s: 'kick',
	d: 'snare',
	f: 'clap',
	q: 'hitom',
	w: 'cowbell',
	e: 'chat',
	r: 'ohat',
};
const padByVoice = {};
document.querySelectorAll('.pad').forEach(p => (padByVoice[(p as any).dataset.voice] = p));
window.addEventListener('keydown', e => {
	if (e.repeat) return;
	const v = keymap[e.key.toLowerCase()];
	if (!v) return;
	triggerPadSound(v, null);
	flash(padByVoice[v], 100);
});

// ---------- Dials (vintage pre-amp knobs) ----------
// choke, top-left: 1 = open/default ... 5 = super tight
// pitch, bottom-right: -6 .. +6 semitones, 0 (noon) = factory tuning
function attachDial(pad, opts) {
	const name = pad.dataset.voice;
	const knob = document.createElement('span');
	knob.className = 'knob ' + opts.cls;
	knob.innerHTML = '<span class="rot"><i></i></span>';
	for (let v = opts.min; v <= opts.max; v++) {
		const tick = document.createElement('b');
		tick.className = 'tick' + (v === opts.zero ? ' zero' : '');
		tick.style.transform = `rotate(${opts.angle(v)}deg)`;
		knob.appendChild(tick);
	}
	(opts.host || pad).appendChild(knob);
	let badge = pad.querySelector('.badge');
	if (!badge) {
		badge = document.createElement('span');
		badge.className = 'badge';
		pad.appendChild(badge);
	}

	const rot = knob.querySelector('.rot');
	knob.setAttribute('role', 'slider');
	knob.tabIndex = 0;
	knob.setAttribute('aria-label', opts.aria || (name + ' ' + opts.cls));
	knob.setAttribute('aria-valuemin', opts.min);
	knob.setAttribute('aria-valuemax', opts.max);
	const val = () => {
		const raw = Math.round(+opts.settings[name]);
		return Number.isFinite(raw) ? Math.min(opts.max, Math.max(opts.min, raw)) : opts.def;
	};
	const render = () => {
		const v = val();
		(rot as any).style.transform = `rotate(${opts.angle(v)}deg)`;
		knob.classList.toggle('on', opts.isOn(v));
		knob.setAttribute('aria-valuenow', v);
		knob.setAttribute('aria-valuetext', opts.label(v).toLowerCase());
	};
	// the readout: badge shows on touch, holds through a drag, fades on release
	const flashBadge = v => {
		badge.textContent = opts.label(v);
		badge.classList.add('show');
		clearTimeout(badge._t);
		if (!badge._held) badge._t = setTimeout(() => badge.classList.remove('show'), 900);
	};
	//let persistT = null;
	let persistT = 0;
	const set = v => {
		opts.settings[name] = v;
		clearTimeout(persistT);
		persistT = setTimeout(() => {
			try {
				localStorage.setItem(opts.store, JSON.stringify(opts.settings));
			} catch (_) { }
		}, 250);
		render();
		if (opts.onChange) opts.onChange(v);
		onDialWrite(name + ':' + opts.cls, v); // overdub writes knob moves as automation
		flashBadge(v);
		if (!applyingAuto) announce(opts.label(v));
	};
	render();
	// lazyChange dials skip the initial call (their targets may not exist yet)
	if (opts.onChange && !opts.lazyChange) opts.onChange(val());

	// tap = next detent (wraps), drag up/down = scrub
	let startY = 0,
		startV = opts.def,
		moved = false;
	knob.addEventListener('pointerdown', e => {
		e.stopPropagation(); // a knob touch is not a drum hit
		e.preventDefault();
		knob.setPointerCapture(e.pointerId);
		startY = e.clientY;
		startV = val();
		moved = false;
		badge._held = true;
		flashBadge(startV); // touching a knob reveals its value before any change
	});
	knob.addEventListener('pointermove', e => {
		if (!knob.hasPointerCapture(e.pointerId)) return;
		const step = Math.round((startY - e.clientY) / opts.dragPx);
		if (step !== 0) moved = true;
		const v = Math.max(opts.min, Math.min(opts.max, startV + step));
		if (v !== val()) set(v);
	});
	knob.addEventListener('pointerup', e => {
		e.stopPropagation();
		badge._held = false;
		if (!moved) set(val() >= opts.max ? opts.min : val() + 1);
		else flashBadge(val()); // release after a drag starts the fade
	});
	knob.addEventListener('pointercancel', () => {
		badge._held = false;
		flashBadge(val());
	});

	// the label is part of the hit area (io808's free usability audit)
	const lbl = (opts.host || pad).querySelector('.vlabel');
	if (lbl) {
		lbl.style.cursor = 'pointer';
		lbl.addEventListener('pointerdown', e => {
			e.stopPropagation();
			e.preventDefault();
		});
		lbl.addEventListener('pointerup', e => {
			e.stopPropagation();
			set(val() >= opts.max ? opts.min : val() + 1); // tap label = step detent
		});
	}
	knob.addEventListener('keydown', e => {
		let v: number | null = null;
		if (e.key === 'ArrowUp' || e.key === 'ArrowRight') v = Math.min(opts.max, val() + 1);
		if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') v = Math.max(opts.min, val() - 1);
		if (e.key === 'Home') v = opts.min;
		if (e.key === 'End') v = opts.max;
		if (v === null) return;
		e.preventDefault();
		set(v);
	});

	return {
		set,
		get: val,
		min: opts.min,
		max: opts.max,
		id: name + ':' + opts.cls,
		text: () => opts.label(val()), // current value's label string, for combined readouts
		flashHTML: html => { // show arbitrary (multi-line) text in this pad's badge
			badge.innerHTML = html;
			badge.classList.add('show');
			clearTimeout(badge._t);
			if (!badge._held) badge._t = setTimeout(() => badge.classList.remove('show'), 1300);
		},
	};
}

// one polite voice for screen readers; storms collapse to the last word
const announceEl = document.getElementById('announce');
let annT: number = 0// = null,
	, annQuiet = false;

function announce(text) {
	if (annQuiet) return;
	clearTimeout(annT);
	annT = setTimeout(() => {
		(announceEl as any).textContent = String(text).toLowerCase();
	}, 120);
}

const dials: any[] = []; // every dial registers here so RND can spin them all

document.querySelectorAll('.pad').forEach(__pad => {
	let pad: any = __pad;
	const ctrl = pad.parentElement.querySelector('.ctrl'); // the unit's rail
	const name = pad.dataset.voice;
	// two stacked knob layers in the same slots (see .klayer CSS)
	const baseLayer = document.createElement('span');
	baseLayer.className = 'klayer base';
	const shiftLayer = document.createElement('span');
	shiftLayer.className = 'klayer shift';
	ctrl.appendChild(baseLayer);
	ctrl.appendChild(shiftLayer);
	dials.push(attachDial(pad, {
		host: baseLayer,
		cls: 'choke',
		aria: name + ' choke, 1 open to 5 tight',
		settings: chokeSettings,
		store: 'pads808-choke',
		min: 1,
		max: 5,
		def: 1,
		angle: v => -135 + (v - 1) * 67.5,
		label: v => (v > 1 ? 'CHOKE ' + v : 'CHOKE OFF'),
		isOn: v => v > 1,
		dragPx: 18,
	}));
	dials.push(attachDial(pad, {
		host: baseLayer,
		cls: 'pitch',
		aria: name + ' pitch, semitones',
		settings: pitchSettings,
		store: 'pads808-pitch',
		min: -6,
		max: 6,
		def: 0,
		zero: 0,
		angle: v => v * 22.5,
		label: v => 'PITCH ' + (v > 0 ? '+' + v : v),
		isOn: v => v !== 0,
		dragPx: 12,
	}));
	// SHIFT layer: volume trim (center = unity) + reverb send (full = default)
	dials.push(attachDial(pad, {
		host: shiftLayer,
		cls: 'volume',
		aria: name + ' volume trim, center is unity',
		settings: volumeSettings,
		store: 'pads808-volume',
		min: -4,
		max: 4,
		def: 0,
		zero: 0,
		angle: v => v * 33.75,
		label: v => (v === 0 ? 'VOL 0' : 'VOL ' + (v > 0 ? '+' + v : v)),
		isOn: v => v !== 0,
		dragPx: 12,
	}));
	dials.push(attachDial(pad, {
		host: shiftLayer,
		cls: 'send',
		aria: name + ' reverb level, 0 dry to 5 full',
		settings: sendSettings,
		store: 'pads808-send',
		min: 0,
		max: 5,
		def: 5,
		angle: v => -135 + v * 54,
		label: v => (v < 5 ? (v === 0 ? 'VERB DRY' : 'VERB ' + v) : 'VERB FULL'),
		isOn: v => v < 5,
		dragPx: 18,
		onChange: v => {
			padSend[name].gain.value = SEND_GAIN[v];
		},
	}));

	// bank selector: 4 dots, tap cycles the pad's sound variant
	const vname = pad.dataset.voice;
	const vsel = document.createElement('span');
	vsel.className = 'vsel';
	const dots: any[] = [];
	for (let i = 0; i < 4; i++) {
		const b = document.createElement('b');
		dots.push(b);
		vsel.appendChild(b);
	}
	ctrl.insertBefore(vsel, ctrl.firstChild); // rail order: dots, then knobs
	vsel.setAttribute('role', 'button');
	vsel.tabIndex = 0;
	const renderV = () => {
		const v = variantOf(vname);
		dots.forEach((d, i) => d.classList.toggle('act', i === v - 1));
		vsel.setAttribute('aria-label',
			vname + ' sound: ' + workGlobalKIT[vname].names[v - 1].toLowerCase() + ', bank ' + v + ' of 4, activate for next');
	};
	let persistVT = 0;//null;
	const setV = v => {
		variantSettings[vname] = v;
		clearTimeout(persistVT);
		persistVT = setTimeout(() => {
			try {
				localStorage.setItem('pads808-variant', JSON.stringify(variantSettings));
			} catch (_) { }
		}, 250);
		renderV();
		onDialWrite(vname + ':bank', v);
		const badge = pad.querySelector('.badge');
		badge.textContent = workGlobalKIT[vname].names[v - 1];
		badge.classList.add('show');
		clearTimeout(badge._t);
		badge._t = setTimeout(() => badge.classList.remove('show'), 900);
		if (!applyingAuto) announce(vname + ' ' + workGlobalKIT[vname].names[v - 1]);
	};
	renderV();
	vsel.addEventListener('pointerdown', e => {
		e.stopPropagation(); // selecting a sound is not a drum hit
		e.preventDefault();
	});
	vsel.addEventListener('pointerup', e => {
		e.stopPropagation();
		setV(variantOf(vname) % 4 + 1);
	});
	vsel.addEventListener('keydown', e => {
		if (e.key !== 'Enter' && e.key !== ' ') return;
		e.preventDefault();
		e.stopPropagation();
		setV(variantOf(vname) % 4 + 1);
	});
	dials.push({
		set: setV,
		get: () => variantOf(vname),
		min: 1,
		max: 4,
		id: vname + ':bank'
	}); // RND rerolls sounds too
});

// Master reverb dial: 1 = off ... 5 = drenched
const verbSettings = loadStore('pads808-verb');
// Re-tuned against the 1.6s plate (Ben: even slow beats died at 5, 4 was too
// much on fast ones). Wet pulled back across the top and dry kept high so the
// drums always lead: 5 is now "clearly drenched" not "gone," 4 is a usable
// wash even on a dense breakbeat.
const WET = {
	1: 0,
	2: 0.1,
	3: 0.2,
	4: 0.32,
	5: 0.45
};
const DRYLVL = {
	1: 1,
	2: 1,
	3: 0.98,
	4: 0.95,
	5: 0.9
};
dials.push(attachDial(document.querySelector('[data-voice="reverb"]'), {
	cls: 'reverb',
	aria: 'master reverb, 1 dry to 5 drenched',
	settings: verbSettings,
	store: 'pads808-verb',
	min: 1,
	max: 5,
	def: 1,
	angle: v => -135 + (v - 1) * 67.5,
	label: v => (v > 1 ? 'VERB ' + v : 'VERB OFF'),
	isOn: v => v > 1,
	dragPx: 18,
	onChange: v => {
		// global verb = master reverb RETURN level; per-pad sends feed it.
		// dry stays full (reverb is additive now, no ducking).
		bus.wet.gain.value = WET[v];
	},
}));

// Master compressor dial: 1 = off ... 5 = brick. [threshold, ratio, makeup]
const compSettings = loadStore('pads808-comp');
const COMP = {
	1: [0, 1, 1],
	2: [-10, 2, 1.1],
	3: [-18, 4, 1.25],
	4: [-26, 8, 1.45],
	5: [-34, 16, 1.7],
};
dials.push(attachDial(document.querySelector('[data-voice="comp"]'), {
	cls: 'compd',
	aria: 'master compressor, 1 off to 5 brick',
	settings: compSettings,
	store: 'pads808-comp',
	min: 1,
	max: 5,
	def: 1,
	angle: v => -135 + (v - 1) * 67.5,
	label: v => (v > 1 ? 'COMP ' + v : 'COMP OFF'),
	isOn: v => v > 1,
	dragPx: 18,
	onChange: v => {
		const s = COMP[v];
		bus.comp.threshold.value = s[0];
		bus.comp.ratio.value = s[1];
		bus.makeup.gain.value = s[2];
	},
}));

// Master tube drive: 1 = clean ... 5 = glowing glass. [pre-gain, post-trim]
const tubeSettings = loadStore('pads808-tube');
const DRIVE = {
	1: [1, 1],
	2: [1.7, 0.78],
	3: [2.6, 0.6],
	4: [3.8, 0.48],
	5: [5.5, 0.4],
};
dials.push(attachDial(document.querySelector('[data-voice="tube"]'), {
	cls: 'tubed', // internal id stays 'tube' so old links + settings survive
	aria: 'master heat, saturation drive, 1 clean to 5 hot',
	settings: tubeSettings,
	store: 'pads808-tube',
	min: 1,
	max: 5,
	def: 1,
	angle: v => -135 + (v - 1) * 67.5,
	label: v => (v > 1 ? 'HEAT ' + v : 'HEAT OFF'),
	isOn: v => v > 1,
	dragPx: 18,
	onChange: v => {
		bus.drive.gain.value = DRIVE[v][0];
		bus.post.gain.value = DRIVE[v][1];
	},
}));

// automation targets by id (every dial + bank selector)
const dialMap = {};
dials.forEach(d => {
	dialMap[d.id] = d;
});
// the dice rolls sounds/pitch/choke + master verb/comp/heat, but NEVER the
// shift-layer volume/send: a roll should never wreck your mix or wash.
const rndDials = dials.filter(d => !/:(?:volume|send)$/.test(d.id));

// SHIFT swaps the pad knob layers (choke/pitch <-> volume/send) via body.shifted.
// Active when the button is LATCHED (tap/click, touch-friendly) OR the Shift key
// is HELD (desktop momentary "peek and tweak"). The two are OR'd so they never fight.
const shiftBtn: any = document.getElementById('shift');
let shiftLatch = false,
	shiftKey = false,
	shifted = false;

function applyShift() {
	const eff = shiftLatch || shiftKey;
	if (eff === shifted) return; // only react on a real transition
	shifted = eff;
	document.body.classList.toggle('shifted', eff);
	shiftBtn.classList.toggle('act', eff);
	shiftBtn.setAttribute('aria-pressed', eff ? 'true' : 'false');
	renderTransport(); // relabel the SHIFT-layer controls (quant <-> swing)
	// pop each pad's badge with BOTH now-visible knobs, stacked two lines
	// (VOL + VERB in shift, CHOKE + PITCH in base), like the dice flash
	document.querySelectorAll('.pad').forEach(pad => {
		const n = (pad as any).dataset.voice;
		const a = dialMap[n + (eff ? ':volume' : ':choke')];
		const b = dialMap[n + (eff ? ':send' : ':pitch')];
		if (a && b) a.flashHTML(a.text() + '<br>' + b.text());
	});
	announce(eff ? 'shift layer on: pads mute, dials are volume and send, quant is swing' : 'shift off');
}
shiftBtn.addEventListener('click', e => {
	e.preventDefault();
	shiftLatch = !shiftLatch;
	applyShift();
});
// desktop: hold Shift to peek the layer, release to drop back (won't fire while typing)
window.addEventListener('keydown', e => {
	if (e.key === 'Shift' && !shiftKey && !/^(INPUT|TEXTAREA)$/.test(((e.target || {}) as any).tagName)) {
		shiftKey = true;
		applyShift();
	}
});
window.addEventListener('keyup', e => {
	if (e.key === 'Shift' && shiftKey) {
		shiftKey = false;
		applyShift();
	}
});

// THE DIE: every dial gets a random detent (sounds, chokes, pitches,
// verb, comp, tube). The roll is theater; the kit lands as it settles.
const rndBtn: any = document.getElementById('rnd');
// HAPTICS on the dice roll: an invisible <input switch> OVERLAYING the RND
// button (kept out of the <button> itself, since nesting interactive content
// is invalid HTML and breaks the tap on iOS). A direct tap on it fires the
// iOS Taptic Engine; we forward that tap to the roll handler, and add
// navigator.vibrate for Android. Positioned over #rnd, re-placed on resize.
const rndHap = document.createElement('input');
rndHap.type = 'checkbox';
rndHap.setAttribute('switch', '');
rndHap.setAttribute('aria-hidden', 'true');
rndHap.tabIndex = -1;
rndHap.style.cssText = 'position:absolute;opacity:0;margin:0;z-index:5;cursor:pointer;-webkit-tap-highlight-color:transparent';
const rndBanks: any = document.getElementById('banks');
rndBanks.style.position = 'relative';
rndBanks.appendChild(rndHap);
const placeHap = () => {
	const a = rndBtn.getBoundingClientRect(),
		b = rndBanks.getBoundingClientRect();
	rndHap.style.left = (a.left - b.left) + 'px';
	rndHap.style.top = (a.top - b.top) + 'px';
	rndHap.style.width = a.width + 'px';
	rndHap.style.height = a.height + 'px';
};
placeHap();
window.addEventListener('resize', placeHap);
setTimeout(placeHap, 400); // catch late layout (fonts, boot fly-in)
rndHap.addEventListener('pointerdown', () => {
	if (navigator.vibrate) navigator.vibrate(45); // Android; iOS taptic = this switch's own tap
	rndBtn.dispatchEvent(new Event('pointerdown', {
		cancelable: true
	})); // run the spin + roll
});
let pendingKit: any = null; // a rolled kit waiting for the next bar line
function applyKit(vals) {
	annQuiet = true;
	rndDials.forEach((d, i) => d.set(vals[i]));
	annQuiet = false;
	announce('kit randomized');
}
const rollAll = () => {
	pushUndo(); // every roll of the die is one undo step
	const vals = rndDials.map(d => d.min + Math.floor(Math.random() * (d.max - d.min + 1)));
	if (seq.playing && seq.bars) {
		// mid-loop: the new kit lands on the 1, like a bank switch
		const spbar = spb() * 4;
		pendingKit = {
			vals,
			at: passStart + Math.ceil((ctx.currentTime + 0.1 - passStart) / spbar) * spbar
		};
		announce('new kit on the next bar');
	} else {
		applyKit(vals);
	}
};
const DIE_COLORS = ['--c-boom', '--c-kick', '--c-snare', '--c-clap', '--c-chat', '--c-ohat', '--c-hitom', '--c-cowbell', '--accent-base'];
let dieC = -1;
const rootStyle = getComputedStyle(document.documentElement);
const flipEl: any = document.getElementById('flip');
const FB = {
	v: Array.from(flipEl.querySelectorAll('.fbv > g')),
	h: Array.from(flipEl.querySelectorAll('.fbh > g')),
	d: Array.from(flipEl.querySelectorAll('.fbd > g')),
};
// six rolls: each axis, both spins. the flipbook is a real projected
// icosahedron; frame 0 IS the resting face, so every landing is exact.
const ROLLS = [
	['v', 1],
	['v', -1],
	['h', 1],
	['h', -1],
	['d', 1],
	['d', -1]
];
let fbCur: any = null;
let fbRaf = 0;
rndBtn.addEventListener('pointerdown', e => {
	// NOTE: deliberately NOT preventDefault here, so the .hap switch's tap can
	// toggle and fire the iOS taptic (preventDefault on pointerdown cancels it).
	if (navigator.vibrate) navigator.vibrate(45); // Android; iOS taptic from the .hap switch
	armShowLabelLive();
	let ci;
	do {
		ci = Math.floor(Math.random() * DIE_COLORS.length);
	} while (ci === dieC);
	dieC = ci;
	const newCol = rootStyle.getPropertyValue(DIE_COLORS[ci]).trim();
	document.documentElement.style.setProperty('--die-c', newCol);
	if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
		rollAll();
		return;
	}
	const pick: any = ROLLS[Math.floor(Math.random() * ROLLS.length)];
	const frames = FB[pick[0]];
	const N = frames.length;
	const SPINS = 2;
	cancelAnimationFrame(fbRaf);
	if (fbCur) {
		fbCur.style.display = 'none';
		fbCur = null;
	}
	rndBtn.classList.add('rolling');
	const t0 = performance.now();
	const D = 1000;
	const step = now => {
		const p = Math.min(1, (now - t0) / D);
		const eased = 1 - Math.pow(1 - p, 3);
		let idx = Math.round(eased * N * SPINS) % N;
		if (pick[1] < 0) idx = (N - idx) % N;
		const f = frames[idx];
		if (f !== fbCur) {
			if (fbCur) fbCur.style.display = 'none';
			f.style.display = 'block';
			fbCur = f;
		}
		if (p < 1) {
			fbRaf = requestAnimationFrame(step);
		} else {
			if (fbCur) {
				fbCur.style.display = 'none';
				fbCur = null;
			}
			rollAll(); // lands on frame 0 = the resting face, then the reveal
			rndBtn.classList.remove('rolling');
		}
	};
	fbRaf = requestAnimationFrame(step);
});

// ---------- Transport: tempo, metronome, record, playback ----------
// Lookahead scheduler: a 25ms timer schedules clicks and loop hits
// ~120ms ahead at sample-accurate times. Recording timestamps hits in
// beats; quantize snaps non-destructively at schedule-build time.
const tStore = loadStore('pads808-transport');
type Event808 = { pad: string, beat: number, v: number };
type Auto808 = { id: string, beat: number, v: number };
type Seq808 = {
	bpm: number,
	quant: number,
	swing: number,
	mutes: {},
	metro: boolean, // global metronome, default OFF until toggled
	guess: boolean, // tempo mode: GUESS by default, until set by hand
	playing: boolean,
	recording: boolean,
	events: Event808[], // { pad, beat } raw beats from recStart
	auto: Auto808[], // { id, v, beat } knob moves written during recording
	bars: number
};
const seq: Seq808 = {
	bpm: Math.min(180, Math.max(60, (tStore.bpm | 0) || 120)),
	quant: [0, 8, 16, 32].indexOf(tStore.quant) >= 0 ? tStore.quant : 16,
	swing: [50, 54, 58, 62, 66].indexOf(tStore.swing) >= 0 ? tStore.swing : 50,
	mutes: {},
	metro: tStore.metro === true, // global metronome, default OFF until toggled
	guess: tStore.guess !== false, // tempo mode: GUESS by default, until set by hand
	playing: false,
	recording: false,
	events: [], // { pad, beat } raw beats from recStart
	auto: [], // { id, v, beat } knob moves written during recording
	bars: 0,
};
const saveT = () => {
	try {
		localStorage.setItem('pads808-transport',
			JSON.stringify({
				bpm: seq.bpm,
				quant: seq.quant,
				swing: seq.swing,
				metro: seq.metro,
				guess: seq.guess
			}));
	} catch (_) { }
};
const spb = () => 60 / seq.bpm;
type SuppressHit808 = { pad: string, t: number, v: number };
type GuessTime808 = {
	pad: string,
	t: number,
	v: number
};
let recStart = 0; // abs time of beat 0 of the take (after count-in)
let passStart = 0; // abs time of beat 0 of the current loop pass
let evIdx = 0; // next event to schedule in this pass
let sched: any[] = []; // quantized + sorted copy of events
// overdub guard: a hit you just tapped plays LIVE at its raw time, then quantize
// can snap its stored slot AHEAD of the playhead, so the scheduler would replay
// it on this same pass = a double tap. We suppress exactly that one replay; the
// hit comes back on the next loop, snapped to grid, as expected.
let suppressHit: SuppressHit808 | null = null; // { pad, t } consumed once within the current pass
let autoIdx = 0; // next automation move in this pass
let autoSched: any[] = []; // sorted copy of automation (unquantized, true to gesture)
let applyingAuto = false; // guard: replayed moves must not re-record
let guessTimes: GuessTime808[] = []; // free-tempo take: raw hit times, beats resolved on stop
let guessAuto: any[] = []; // ditto for knob moves
// touch-overwrite: first grab of a dial during an overdub wipes that dial's
// old automation lane, so re-performing a knob line REPLACES it (no fighting)
const touchedIds = new Set();
// metronome rides the SAME grid as the loop: clicks are computed as
// metroAnchor + beat * spb(), never accumulated, so they can't drift
let metroAnchor = 0,
	metroBeat = 0;

const recBtn: any = document.getElementById('rec');
const trashBtn: any = document.getElementById('trash');
const playBtn: any = document.getElementById('play');
const metroBtn: any = document.getElementById('metro');
const quantBtn: any = document.getElementById('quant');
const bpmEl: any = document.getElementById('bpm');
const bpmVal: any = document.getElementById('bpmVal');
const countEl: any = document.getElementById('count');
const wavBtn: any = document.getElementById('wav');
let losto: any = localStorage;
let wavBits = 16,
	wavRate = 0;
try {
	if (+losto.getItem('pads808-wavbits') === 24) wavBits = 24;
} catch (_) { }
try {
	if (+losto.getItem('pads808-wavrate') === 44100) wavRate = 44100;
} catch (_) { }
const linkBtn: any = document.getElementById('link');
const midBtn: any = document.getElementById('mid');
const laneEl: any = document.getElementById('lane');
const undoBtn: any = document.getElementById('undo');

// ---------- Undo: one step back from anything destructive ----------
// Snapshots are taken BEFORE: trash, a fresh take, an overdub pass,
// loading a bank over your work, and every die roll. 16 levels deep.
const undoStack: any[] = [];

function pushUndo() {
	const snap = {};
	dials.forEach(d => {
		snap[d.id] = d.get();
	});
	undoStack.push({
		events: seq.events.map(e => ({
			pad: e.pad,
			beat: e.beat,
			v: e.v
		})),
		auto: seq.auto.map(a => ({
			id: a.id,
			v: a.v,
			beat: a.beat
		})),
		bars: seq.bars,
		bpm: seq.bpm,
		guess: seq.guess,
		snap,
	});
	if (undoStack.length > 16) undoStack.shift();
	if (undoBtn) undoBtn.disabled = false;
}

function doUndo() {
	const u = undoStack.pop();
	if (!u) return;
	if (u.bankClear) {
		banks[u.bankClear.i] = u.bankClear.data;
		saveBanks();
		renderBanks();
		announce('slot ' + (u.bankClear.i + 1) + ' restored');
		if (!undoStack.length && undoBtn) undoBtn.disabled = true;
		return;
	}
	pendingKit = null; // an undone roll never lands
	const wasPlaying = seq.playing;
	seq.playing = false;
	seq.recording = false;
	touchedIds.clear();
	applyingAuto = true;
	dials.forEach(d => {
		if (u.snap[d.id] != null) d.set(u.snap[d.id]);
	});
	applyingAuto = false;
	seq.events = u.events;
	seq.auto = u.auto;
	seq.bars = u.bars;
	seq.bpm = u.bpm;
	seq.guess = u.guess;
	saveT();
	if (wasPlaying && seq.bars) startPlay();
	renderTransport();
	renderBanks();
	announce('undone');
}

function renderCount() {
	if (seq.recording && !seq.bars && seq.guess) {
		countEl.textContent = guessTimes.length ?
			(ctx.currentTime - guessTimes[0].t).toFixed(1) + 's' :
			'...';
	} else if (seq.recording && !seq.bars) {
		const now = ctx.currentTime;
		if (now < recStart) {
			// count-in: 4 3 2 1
			countEl.textContent = String(Math.ceil((recStart - now) / spb()));
		} else {
			const beats = (now - recStart) / spb();
			countEl.textContent = (Math.floor(beats / 4) + 1) + '.' + (Math.floor(beats % 4) + 1);
		}
	} else if ((seq.playing || seq.recording) && seq.bars) {
		const loopBeats = seq.bars * 4;
		const beats = (((ctx.currentTime - passStart) / spb()) % loopBeats + loopBeats) % loopBeats;
		countEl.textContent = (Math.floor(beats / 4) + 1) + '.' + (Math.floor(beats % 4) + 1) + '/' + seq.bars;
	} else {
		countEl.textContent = 'bpm'; // idle: the count surface is the unit label
	}
	countEl.classList.toggle('isrec', seq.recording);
	countEl.classList.toggle('isplay', seq.playing && !seq.recording);
	// the lane rides the same clock as the count
	if (laneEl.children.length) {
		const lb = seq.bars * 4;
		const active = (seq.playing || seq.recording) && seq.bars > 0;
		const pos = active ? ((((ctx.currentTime - passStart) / spb()) % lb) + lb) % lb : -1;
		for (let i = 0; i < laneEl.children.length; i++) {
			const frac = pos < 0 ? 0 : Math.min(1, Math.max(0, pos / 4 - i));
			laneEl.children[i].firstChild.style.width = (frac * 100) + '%';
		}
		laneEl.classList.toggle('isrec', seq.recording);
		laneEl.classList.toggle('idle', !active);
	}
}

function renderTransport() {
	// the lane mirrors the loop: one segment per bar
	if (laneEl.children.length !== (seq.bars | 0)) {
		laneEl.innerHTML = '';
		for (let i = 0; i < seq.bars; i++) {
			const s = document.createElement('b');
			s.appendChild(document.createElement('i'));
			laneEl.appendChild(s);
		}
	}
	recBtn.classList.toggle('act', seq.recording);
	recBtn.setAttribute('aria-pressed', seq.recording);
	playBtn.classList.toggle('act', seq.playing);
	playBtn.setAttribute('aria-pressed', seq.playing);
	playBtn.textContent = seq.playing ? 'STOP' : 'PLAY';
	playBtn.disabled = !seq.bars && !seq.playing;
	trashBtn.disabled = !seq.bars && !seq.events.length && !seq.auto.length && !seq.recording;
	undoBtn.disabled = !undoStack.length;
	if (!wavBtn.dataset.busy) wavBtn.disabled = !seq.bars;
	// MID stays enabled (it opens the MIDI sheet — connecting a controller works
	// on a blank machine); only the .mid EXPORT inside needs a loop.
	metroBtn.classList.toggle('act', seq.metro);
	metroBtn.setAttribute('aria-pressed', seq.metro);
	if (document.body.classList.contains('shifted')) { // SHIFT layer: show SWING on this button
		const esw = pendingSwing != null ? pendingSwing : seq.swing;
		quantBtn.classList.toggle('act', esw > 50);
		quantBtn.textContent = esw > 50 ? 'SWING ' + esw : 'SWING';
		quantBtn.setAttribute('aria-label', esw > 50 ? 'swing ' + esw + ' percent' : 'swing off');
	} else {
		quantBtn.classList.toggle('act', seq.quant > 0);
		quantBtn.textContent = seq.quant ? '1/' + seq.quant + ' Q' : 'Q OFF';
		quantBtn.setAttribute('aria-label', 'quantize: ' + (seq.quant ? ({
			32: 'thirty-second',
			16: 'sixteenth',
			8: 'eighth'
		}[seq.quant] || ('one over ' + seq.quant)) + ' notes' : 'off'));
	}
	bpmVal.textContent = (seq.guess && !seq.bars) ? 'AUTO' : seq.bpm;
	bpmEl.setAttribute('aria-label', 'tempo, ' +
		((seq.guess && !seq.bars) ? 'auto mode, tempo detected from your take' : seq.bpm + ' beats per minute') +
		', arrows to adjust, enter to type');
}

function clickTone(t, accent) {
	const o = ctx.createOscillator();
	const g = ctx.createGain();
	o.type = 'square';
	o.frequency.value = accent ? 1800 : 1200;
	g.gain.setValueAtTime(accent ? 0.3 : 0.18, t);
	g.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
	o.connect(g).connect(ctx.destination); // click skips comp/verb on purpose
	o.start(t);
	o.stop(t + 0.05);
	// same WebKit reclaim issue: drop the click's nodes once it has rung out
	o.addEventListener('ended', () => {
		try {
			o.disconnect();
			g.disconnect();
		} catch (_) { }
	});
}

const qBeat = beat => {
	if (!seq.quant) return beat;
	const div = seq.quant / 4; // grid slots per beat
	const s = Math.round(beat * div);
	// SWING: push every other grid slot late (50 = straight, ~66 = triplet shuffle)
	if (seq.swing > 50 && (s % 2 === 1)) return (s - 1) / div + (seq.swing / 100) * (2 / div);
	return s / div;
};

function buildSched() {
	const loopBeats = seq.bars * 4;
	sched = seq.events
		.filter(e => !(seq.mutes && seq.mutes[e.pad]))
		.map(e => ({
			pad: e.pad,
			v: e.v,
			t: qBeat(e.beat) % loopBeats
		}))
		.sort((a, b) => a.t - b.t);
}

function buildAutoSched() {
	const loopBeats = seq.bars * 4;
	autoSched = seq.auto
		.map(a => ({
			id: a.id,
			v: a.v,
			t: a.beat % loopBeats
		}))
		.sort((a, b) => a.t - b.t);
}

function seekAuto() {
	const pos = (ctx.currentTime - passStart) / spb() + 0.03;
	autoIdx = autoSched.findIndex(a => a.t >= pos);
	if (autoIdx < 0) autoIdx = autoSched.length;
}

// called by every dial's set(): while recording, knob moves are written
// into the loop (pitch rides on the cowbell, etc.) and replayed each pass
function onDialWrite(id, v) {
	if (applyingAuto || !seq.recording) return;
	if (seq.bars) {
		if (!touchedIds.has(id)) {
			touchedIds.add(id);
			seq.auto = seq.auto.filter(a => a.id !== id); // wipe the old lane
		}
		const lb = seq.bars * 4;
		const beat = (((ctx.currentTime - passStart) / spb()) % lb + lb) % lb;
		seq.auto.push({
			id,
			v,
			beat
		});
		buildAutoSched();
		seekAuto();
	} else if (seq.guess) {
		guessAuto.push({
			id,
			v,
			t: ctx.currentTime
		});
	} else {
		const beat = (ctx.currentTime - recStart) / spb();
		if (beat >= -0.1) seq.auto.push({
			id,
			v,
			beat: Math.max(0, beat)
		});
	}
}

// tempo guess: hits are exact timestamps, so test candidate BPMs by how
// tightly all hits hug that tempo's 16th grid; prefer the slowest tempo
// that explains the take nearly as well as the best one (anti-double-time)
function guessBpm(rel) {
	let iois = 0;
	for (let i = 1; i < rel.length; i++) {
		const d = rel[i] - rel[i - 1];
		if (d > 0.08 && d < 2.5) iois++;
	}
	if (!iois) return null;
	const scoreOf = bpm => {
		const q = 15 / bpm; // one 16th, in seconds
		let s = 0;
		for (const t of rel) {
			const dev = Math.abs(t / q - Math.round(t / q)) * 2; // 0 on grid .. 1 between
			s += Math.max(0, 1 - dev * 1.6);
		}
		return s;
	};
	const scores: any[] = [];
	let bestS = -1;
	for (let bpm = 60; bpm <= 180; bpm += 0.25) {
		const s = scoreOf(bpm);
		scores.push([bpm, s]);
		if (s > bestS) bestS = s;
	}
	for (const pair of scores) {
		if (pair[1] >= bestS * 0.97) return pair[0];
	}
	return null;
}

function seekSched() {
	// small epsilon so a hit recorded "right now" isn't immediately replayed
	const pos = (ctx.currentTime - passStart) / spb() + 0.03;
	evIdx = sched.findIndex(e => e.t >= pos);
	if (evIdx < 0) evIdx = sched.length;
}

function startRec() {
	seq.playing = false;
	seq.events = [];
	seq.auto = [];
	seq.bars = 0;
	seq.recording = true;
	recStart = ctx.currentTime + 4 * spb(); // one bar count-in
	metroAnchor = recStart; // count-in beats -4..-1 land EXACTLY one bar early
	metroBeat = -4;
	renderTransport();
}

function stopRec() {
	seq.recording = false;
	suppressHit = null;
	touchedIds.clear();
	if (seq.bars) {
		renderTransport();
		return;
	} // overdub off; loop keeps going
	if (seq.guess) {
		// free take: estimate the tempo from the hits themselves
		if (guessTimes.length < 4) {
			guessTimes = [];
			guessAuto = [];
			renderTransport();
			return;
		}
		const t0 = guessTimes[0].t; // beat 1 = first hit
		const est = guessBpm(guessTimes.map(h => h.t - t0));
		if (est) seq.bpm = Math.round(est);
		recStart = t0;
		const took = (ctx.currentTime - t0) / spb();
		seq.bars = Math.min(8, Math.max(1, Math.round(took / 4) || 1));
		const lb = seq.bars * 4;
		seq.events = guessTimes
			.map(h => ({
				pad: h.pad,
				beat: (h.t - t0) / spb(),
				v: h.v == null ? 1 : h.v
			}))
			.filter(e => e.beat < lb - 0.01);
		seq.auto = guessAuto
			.filter(a => a.t >= t0)
			.map(a => ({
				id: a.id,
				v: a.v,
				beat: (a.t - t0) / spb()
			}))
			.filter(a => a.beat < lb - 0.01);
		guessTimes = [];
		guessAuto = [];
		if (!seq.events.length) {
			seq.bars = 0;
			renderTransport();
			return;
		}
		saveT();
		bpmVal.classList.add('flash'); // show off the guess
		setTimeout(() => bpmVal.classList.remove('flash'), 1600);
	} else {
		const beats = (ctx.currentTime - recStart) / spb();
		if (!seq.events.length || beats <= 0) {
			renderTransport();
			return;
		}
		seq.bars = Math.min(8, Math.max(1, Math.ceil(beats / 4 - 0.05)));
	}
	buildSched();
	buildAutoSched();
	seq.playing = true;
	passStart = recStart;
	const loopDur = seq.bars * 4 * spb();
	while (passStart + loopDur < ctx.currentTime) passStart += loopDur;
	seekSched(); // everything earlier in this pass already played live
	seekAuto();
	renderTransport();
}

function startPlay() {
	if (!seq.bars) return;
	buildSched();
	buildAutoSched();
	seq.playing = true;
	passStart = ctx.currentTime + 0.06;
	evIdx = 0;
	autoIdx = 0;
	suppressHit = null;
	metroAnchor = passStart;
	metroBeat = 0;
	renderTransport();
}

function setBpm(nv) {
	const k = (60 / nv) / spb();
	seq.bpm = nv;
	seq.guess = false; // setting tempo by hand exits GUESS mode
	// rescale loop + click positions so the music doesn't jump
	passStart = ctx.currentTime - (ctx.currentTime - passStart) * k;
	metroAnchor = ctx.currentTime - (ctx.currentTime - metroAnchor) * k;
	saveT();
	renderTransport();
}

function swingName(v) {
	return v > 50 ? 'swing ' + v + ' percent' : 'swing off';
}

function queueSwing(target) {
	if (!seq.playing || !seq.bars) {
		pendingSwing = null;
		seq.swing = target;
		buildSched();
		saveT();
		renderTransport();
		announce(swingName(target));
		return;
	}
	const spbar = spb() * 4;
	swingAt = passStart + Math.ceil((ctx.currentTime + 0.05 - passStart) / spbar) * spbar;
	pendingSwing = target;
	renderTransport();
	announce(swingName(target) + ' queued for next bar');
}

setInterval(() => {
	if (ctx.state !== 'running') return;
	// POWER: when idle (nothing playing/recording/pending) do no per-tick work
	if (!seq.playing && !seq.recording && !pendingKit && pendingSwing == null && pendingSlot == null) {
		if (!idledTick) {
			renderCount();
			idledTick = true;
		} // settle the readout once, then rest
		return;
	}
	idledTick = false;
	lastLive = performance.now();
	const horizon = ctx.currentTime + 0.12;
	// a queued kit applies just before the lookahead can schedule its bar
	if (pendingKit && ctx.currentTime >= pendingKit.at - 0.13) {
		applyKit(pendingKit.vals);
		pendingKit = null;
	}
	if (pendingSwing != null && ctx.currentTime >= swingAt) {
		seq.swing = pendingSwing;
		pendingSwing = null;
		buildSched();
		saveT();
		renderTransport();
	}
	// metronome: GLOBAL click, persisted across reloads. When ON it ticks
	// through PLAYBACK and RECORDING alike. When OFF it's silent EXCEPT the
	// count-in, which always ticks so a fresh take still has a 4-beat lead-in.
	const metroRun = (seq.recording && isFinite(recStart)) || (seq.playing && seq.bars && seq.metro);
	if (metroRun) {
		// hiccup guard: if the tab slept, jump to the current beat
		if (metroAnchor + metroBeat * spb() < ctx.currentTime - 0.5) {
			metroBeat = Math.ceil((ctx.currentTime - metroAnchor) / spb());
		}
		let mt;
		while ((mt = metroAnchor + metroBeat * spb()) < horizon) {
			const countingIn = seq.recording && !seq.bars && mt < recStart - 0.01;
			if (seq.metro || countingIn) {
				clickTone(Math.max(mt, ctx.currentTime + 0.001), ((metroBeat % 4) + 4) % 4 === 0);
			}
			metroBeat++;
		}
	}
	// 8-bar cap (fresh takes only; overdubs ride the existing loop)
	if (seq.recording && !seq.bars && isFinite(recStart) && ctx.currentTime - recStart >= 8 * 4 * spb()) stopRec();
	// free-tempo takes cap at 32s
	if (seq.recording && !seq.bars && seq.guess && guessTimes.length && ctx.currentTime - guessTimes[0].t > 32) stopRec();
	// loop playback
	if (seq.playing && seq.bars) {
		const scheduleLoop = limit => {
			const loopDur = seq.bars * 4 * spb();
			let guard = 0;
			while (guard++ < 512) {
				// automation first so hits at the same beat render with the new knobs
				while (autoIdx < autoSched.length && passStart + autoSched[autoIdx].t * spb() < limit) {
					const a = autoSched[autoIdx++];
					// a touched dial belongs to the performer until REC goes off
					if (seq.recording && touchedIds.has(a.id)) continue;
					applyingAuto = true;
					if (dialMap[a.id]) dialMap[a.id].set(a.v);
					applyingAuto = false;
				}
				while (evIdx < sched.length && passStart + sched[evIdx].t * spb() < limit) {
					const ev = sched[evIdx++];
					// skip the single live-played hit so it doesn't double this pass
					if (suppressHit && ev.pad === suppressHit.pad && Math.abs(ev.t - suppressHit.t) < 1e-4) {
						suppressHit = null;
						continue;
					}
					const tAbs = passStart + ev.t * spb();
					renderHit(ev.pad, Math.max(tAbs, ctx.currentTime + 0.001), ev.v);
				}
				if (evIdx >= sched.length && autoIdx >= autoSched.length && passStart + loopDur < limit) {
					passStart += loopDur;
					evIdx = 0;
					autoIdx = 0;
					suppressHit = null; // a new pass: the live hit should now play normally
					continue;
				}
				break;
			}
		};
		// pending bank switch: play the old pattern up to the switch beat only
		scheduleLoop(pendingSlot != null ? Math.min(horizon, switchAt) : horizon);
		if (pendingSlot != null && switchAt <= horizon) {
			// the next beat has arrived: swap patterns, KEEP the current tempo
			applySlot(pendingSlot);
			pendingSlot = null;
			buildSched();
			buildAutoSched();
			seq.playing = true;
			passStart = switchAt; // new loop's beat 0 = the switch beat
			evIdx = 0;
			autoIdx = 0;
			suppressHit = null;
			renderTransport();
			renderBanks();
			scheduleLoop(horizon); // new pattern fills the rest of this window
		}
	}
	renderCount();
}, 25);

// POWER: let the audio engine sleep when the machine sits idle, and when the
// app is backgrounded. trigger()/arm() already resume on the next interaction,
// and iOS suspends behind our back anyway, so this is a handled state.
setInterval(() => {
	if (ctx.state === 'running' && !seq.playing && !seq.recording && performance.now() - lastLive > 20000) {
		ctx.suspend().catch(() => { });
	}
}, 4000);
document.addEventListener('visibilitychange', () => {
	if (document.hidden && !seq.playing && !seq.recording && ctx.state === 'running') ctx.suspend().catch(() => { });
});

// First-use hint on touch devices: iOS (and others) mute Web Audio behind the
// hardware silent switch, and there is no reliable way to DETECT that state, so
// we surface it once, like Ableton's Learning Music does.
(function ringHintInit() {
	if (!(navigator.maxTouchPoints > 0)) return;
	try {
		if (localStorage.getItem('pads808-ringhint') === '1') return;
	} catch (_) { }
	const el = document.getElementById('ringHint');
	if (!el) return;
	const hide = () => el.classList.remove('show');
	const show = () => {
		try {
			localStorage.setItem('pads808-ringhint', '1');
		} catch (_) { }
		el.classList.add('show');
		el.addEventListener('click', hide);
		setTimeout(hide, 9000);
	};
	window.addEventListener('pointerdown', () => setTimeout(show, 1200), {
		capture: true,
		once: true
	});
})();

recBtn.addEventListener('pointerdown', e => {
	e.preventDefault();
	armShowLabelLive();
	const wasRec = seq.recording;
	if (seq.recording) {
		stopRec();
	} else if (seq.bars) {
		// loop exists: REC = overdub on top of it
		pushUndo(); // the whole overdub pass is one undo step
		if (!seq.playing) startPlay();
		touchedIds.clear();
		seq.recording = true;
		// click joins the loop's grid
		metroAnchor = passStart;
		metroBeat = Math.ceil((ctx.currentTime - passStart) / spb());
		renderTransport();
	} else if (seq.guess) {
		// free take: no count-in, no click; the clock starts on your first hit
		pushUndo();
		seq.playing = false;
		seq.recording = true;
		recStart = Infinity;
		guessTimes = [];
		guessAuto = [];
		seq.events = [];
		seq.auto = [];
		renderTransport();
	} else {
		pushUndo();
		startRec();
	}
	announce(wasRec ? 'recording stopped' : 'recording');
});
playBtn.addEventListener('pointerdown', e => {
	e.preventDefault();
	armShowLabelLive();
	if (seq.playing) {
		seq.playing = false;
		seq.recording = false;
		pendingSlot = null;
		renderTransport();
		renderBanks();
	} else startPlay();
	announce(seq.playing ? 'playing' : 'stopped');
});
undoBtn.addEventListener('pointerdown', e => {
	e.preventDefault();
	armShowLabelLive();
	doUndo();
});
window.addEventListener('keydown', e => {
	if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z' && (e.target as any).tagName !== 'INPUT') {
		e.preventDefault();
		doUndo();
	}
});
trashBtn.addEventListener('pointerdown', e => {
	e.preventDefault();
	pushUndo();
	pendingKit = null;
	seq.recording = false;
	seq.playing = false;
	seq.events = [];
	seq.auto = [];
	seq.bars = 0;
	sched = [];
	autoSched = [];
	evIdx = 0;
	autoIdx = 0;
	suppressHit = null;
	guessTimes = [];
	guessAuto = [];
	touchedIds.clear();
	seq.guess = true; // trash returns tempo to GUESS, the default
	seq.mutes = {};
	activeSlot = null;
	pendingSlot = null;
	saveT();
	renderTransport();
	renderBanks();
	renderMutes();
	announce('loop cleared');
});
metroBtn.addEventListener('pointerdown', e => {
	e.preventDefault();
	armShowLabelLive();
	seq.metro = !seq.metro; // governs click during recording (count-in always clicks)
	saveT();
	renderTransport();
	announce(seq.metro ? 'click on' : 'click off');
});
quantBtn.addEventListener('pointerdown', e => {
	e.preventDefault();
	if (document.body.classList.contains('shifted')) { // SHIFT layer: SWING (global, lands on the next bar)
		const SW = [50, 54, 58, 62, 66]; // straight -> heavier shuffle
		const cur = pendingSwing != null ? pendingSwing : seq.swing;
		queueSwing(SW[(SW.indexOf(cur) + 1) % SW.length]);
		return;
	}
	const QCYCLE = [16, 32, 8, 0]; // 1/16 (default) -> 1/32 -> 1/8 -> off
	seq.quant = QCYCLE[(QCYCLE.indexOf(seq.quant) + 1) % QCYCLE.length];
	if (seq.bars) {
		buildSched();
		seekSched();
	}
	saveT();
	renderTransport();
	announce('quantize ' + (seq.quant ? ({
		32: 'thirty-second',
		16: 'sixteenth',
		8: 'eighth'
	}[seq.quant] || ('one over ' + seq.quant)) + ' notes' : 'off'));
});

// BPM: drag up/down to scrub, tap to type a number, arrows to nudge. 60-180.
bpmEl.setAttribute('role', 'spinbutton');
bpmEl.tabIndex = 0;
bpmEl.addEventListener('keydown', e => {
	if (e.target.tagName === 'INPUT') return;
	if (e.key === 'ArrowUp') {
		e.preventDefault();
		setBpm(Math.min(180, seq.bpm + 1));
	}
	if (e.key === 'ArrowDown') {
		e.preventDefault();
		setBpm(Math.max(60, seq.bpm - 1));
	}
	if (e.key === 'Enter') {
		e.preventDefault();
		editBpm();
	}
});
let bpmY = 0,
	bpmFrom = 120,
	bpmMoved = false;
bpmEl.addEventListener('pointerdown', e => {
	if (e.target.tagName === 'INPUT') return; // already editing
	e.preventDefault();
	bpmEl.setPointerCapture(e.pointerId);
	bpmY = e.clientY;
	bpmFrom = seq.bpm;
	bpmMoved = false;
});
bpmEl.addEventListener('pointermove', e => {
	if (!bpmEl.hasPointerCapture(e.pointerId)) return;
	if (Math.abs(bpmY - e.clientY) > 3) bpmMoved = true;
	const nv = Math.min(180, Math.max(60, bpmFrom + Math.round((bpmY - e.clientY) / 4)));
	if (nv !== seq.bpm) setBpm(nv);
});
bpmEl.addEventListener('pointerup', e => {
	if (e.target.tagName === 'INPUT' || bpmMoved) return;
	editBpm();
});

function editBpm() {
	if (bpmEl.querySelector('input')) return; // already editing
	const inp: any = document.createElement('input');
	inp.type = 'number';
	inp.inputMode = 'numeric';
	inp.min = 60;
	inp.max = 180;
	inp.value = seq.bpm;
	inp.className = 'bpmin';
	bpmVal.style.display = 'none';
	bpmEl.insertBefore(inp, bpmVal);
	inp.focus();
	inp.select();
	const commit = () => {
		const v = Math.min(180, Math.max(60, Math.round(+inp.value) || seq.bpm));
		inp.remove();
		bpmVal.style.display = '';
		setBpm(v);
	};
	inp.addEventListener('blur', commit);
	inp.addEventListener('keydown', ev => {
		if (ev.key === 'Enter') inp.blur();
		if (ev.key === 'Escape') {
			inp.value = seq.bpm;
			inp.blur();
		}
	});
}

renderTransport();

// ---------- Memory banks: park a beat, trigger it back ----------
// SAVE arms; tapping a slot stores loop + automation + bpm + every knob.
// Tapping a filled slot loads it and plays. Banks survive refreshes.
const banks = loadStore('pads808-banks');
let armSave = false;
let activeSlot = null;
let pendingSlot = null; // slot waiting for the next beat to take over
let switchAt = 0; // abs time of that beat
let pendingSwing = null; // queued swing; lands on the next bar
let swingAt = 0;
const banksEl: any = document.getElementById('banks');
const saveBtn: any = document.getElementById('saveBtn');
const slotBtns = Array.from(document.querySelectorAll('.bank[data-slot]'));

const saveBanks = () => {
	try {
		localStorage.setItem('pads808-banks', JSON.stringify(banks));
	} catch (_) { }
};

function renderBanks() {
	saveBtn.classList.toggle('act', armSave);
	saveBtn.setAttribute('aria-pressed', armSave ? 'true' : 'false');
	saveBtn.setAttribute('aria-label', armSave ? 'save armed: tap a slot A to D to store this beat' : 'save: arm, then tap a slot to store');
	banksEl.classList.toggle('arming', armSave);
	slotBtns.forEach((__b, i) => {
		let b: any = __b;
		b.classList.toggle('filled', !!banks[i]);
		b.classList.toggle('active', activeSlot === i);
		b.classList.toggle('pending', pendingSlot === i);
		b.style.animationDuration = pendingSlot === i ? spb() + 's' : '';
		b.setAttribute('aria-label', 'memory slot ' + b.textContent + ', ' +
			(pendingSlot === i ? 'switching next beat' :
				activeSlot === i ? 'active' : banks[i] ? 'filled' : 'empty') +
			(armSave ? ', save here' : '') +
			(banks[i] && !armSave ? ', hold or press delete to clear' : ''));
	});
}

function saveSlot(i) {
	const snap = {};
	dials.forEach(d => {
		snap[d.id] = d.get();
	});
	banks[i] = {
		events: seq.events.map(e => ({
			pad: e.pad,
			beat: e.beat,
			v: e.v
		})),
		auto: seq.auto.map(a => ({
			id: a.id,
			v: a.v,
			beat: a.beat
		})),
		bars: seq.bars,
		bpm: seq.bpm,
		mutes: {
			...seq.mutes
		},
		snap,
	};
	activeSlot = i;
	saveBanks();
	announce('saved to slot ' + (i + 1));
}

// applies a slot's contents. TEMPO IS GLOBAL: a loaded bank never changes
// the tempo; the global setting governs every bank and sticks until you
// change it (so you can track slow and speed the whole set up after).
function applySlot(i) {
	const b = banks[i];
	pendingKit = null; // a loaded bank outranks a queued roll
	seq.recording = false;
	touchedIds.clear();
	// restore every knob without writing automation
	applyingAuto = true;
	dials.forEach(d => {
		if (b.snap && b.snap[d.id] != null) d.set(b.snap[d.id]);
	});
	applyingAuto = false;
	seq.events = (b.events || []).map(e => ({
		pad: e.pad,
		beat: e.beat,
		v: e.v
	}));
	seq.auto = (b.auto || []).map(a => ({
		id: a.id,
		v: a.v,
		beat: a.beat
	}));
	seq.mutes = {
		...(b.mutes || {})
	};
	renderMutes();
	seq.bars = b.bars | 0;
	seq.guess = false; // there's a loop now; AUTO only governs blank takes
	activeSlot = i;
}

function loadSlot(i) {
	const b = banks[i];
	if (!b) return;
	pushUndo(); // loading a bank over your work is reversible
	if (seq.playing && seq.bars && (b.bars | 0)) {
		// seamless trigger: keep the BPM, take over on the next BAR LINE so
		// the incoming pattern always starts on the 1 (the slot pulses while
		// it waits, like pattern queueing on real hardware)
		const spbar = spb() * 4;
		pendingSlot = i;
		switchAt = passStart + Math.ceil((ctx.currentTime + 0.15 - passStart) / spbar) * spbar;
		announce('slot ' + (i + 1) + ' queued for next bar');
		return;
	}
	applySlot(i);
	announce('slot ' + (i + 1) + ' loaded');
	if (seq.bars) startPlay();
	else {
		seq.playing = false;
		renderTransport();
	}
}

saveBtn.addEventListener('pointerdown', e => {
	e.preventDefault();
	armShowLabelLive();
	armSave = !armSave;
	renderBanks();
	announce(armSave ? 'save armed, tap a slot to store' : 'save off');
});
slotBtns.forEach((btn, i) => {
	// tap = load, save-armed tap = save, HOLD a filled slot 700ms = clear
	let holdT = 0,
		consumed = false;
	const cancelHold = () => {
		clearTimeout(holdT);
		holdT = 0;
		btn.classList.remove('clearing');
	};
	const clearSlot = () => {
		if (banks[i]) {
			undoStack.push({
				bankClear: {
					i,
					data: banks[i]
				}
			});
			if (undoStack.length > 16) undoStack.shift();
			if (undoBtn) undoBtn.disabled = false;
		}
		banks[i] = null;
		if (activeSlot === i) activeSlot = null;
		if (pendingSlot === i) pendingSlot = null;
		saveBanks();
		renderBanks();
		announce('slot ' + (i + 1) + ' cleared, press undo to restore');
	};
	btn.addEventListener('pointerdown', e => {
		e.preventDefault();
		armShowLabelLive();
		consumed = false;
		if (armSave) {
			saveSlot(i);
			armSave = false;
			consumed = true;
			renderBanks();
			return;
		}
		if (banks[i]) {
			btn.classList.add('clearing');
			holdT = setTimeout(() => {
				consumed = true;
				cancelHold();
				clearSlot();
			}, 700);
		}
	});
	btn.addEventListener('pointerup', () => {
		cancelHold();
		if (consumed) {
			consumed = false;
			return;
		}
		loadSlot(i);
		renderBanks();
	});
	btn.addEventListener('pointercancel', cancelHold);
	btn.addEventListener('pointerleave', cancelHold);
	btn.addEventListener('keydown', __e => {
		let e: any = __e;
		if ((e.key === 'Delete' || e.key === 'Backspace') && banks[i]) {
			e.preventDefault();
			clearSlot();
		} else if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			armShowLabelLive();
			if (armSave) {
				saveSlot(i);
				armSave = false;
			} else loadSlot(i);
			renderBanks();
		}
	});
});

renderBanks();

// ---------- Transport keys: the whole panel plays from the keyboard ----------
// space = play/stop, x = record, c = click, g = roll the die,
// 1-4 = memory banks, z = undo (pads stay on QWER / ASDF)
window.addEventListener('keydown', __e => {
	let e: any = __e;
	if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
	if (e.target.tagName === 'INPUT') return;
	if ((sheet && sheet.classList.contains('open')) || (midiSheet && midiSheet.classList.contains('open'))) return;
	const k = e.key.toLowerCase();
	const tap = el => {
		el.dispatchEvent(new Event('pointerdown', {
			cancelable: true
		}));
		el.dispatchEvent(new Event('pointerup', {
			cancelable: true
		}));
	};
	if (k === ' ') {
		e.preventDefault();
		tap(playBtn);
	} else if (k === 'x') tap(recBtn);
	else if (k === 'c') tap(metroBtn);
	else if (k === 'g') tap(rndBtn);
	else if (k === 'z') doUndo();
	else if (k === 'm') hookMidi();
	else if (k >= '1' && k <= '4') tap(slotBtns[+k - 1]);
});

// ---------- WAV export: real-time capture, 16/24-bit at device rate ----------
// The loop is data and the kit is synthesized, so export doesn't record the
// output device; it re-renders the engine and captures it live (see WHY
// REAL-TIME CAPTURE below: the OfflineAudioContext path mis-renders on Safari).
// Two passes are rendered and the SECOND is kept, so tails from the end of
// the loop are baked into its start = a seamless loop in any DAW.
// PCM WAV at the device sample rate, 16- or 24-bit, used for download and the
// mobile audio share. Universal
// interchange: plays everywhere and survives the AAC transcode that chat
// apps (iMessage etc.) run on shared audio, which mangled 24-bit PCM into
// white noise. (We dropped the 24/96 master; 16/44 is plenty for the loop.)
function encodeWav(chs, rate, bits) {
	const bps = bits === 24 ? 3 : 2;
	const n = chs[0].length,
		nch = chs.length;
	const bytes = 44 + n * nch * bps;
	const buf = new ArrayBuffer(bytes);
	const v = new DataView(buf);
	const wstr = (off, str) => {
		for (let i = 0; i < str.length; i++) v.setUint8(off + i, str.charCodeAt(i));
	};
	wstr(0, 'RIFF');
	v.setUint32(4, bytes - 8, true);
	wstr(8, 'WAVE');
	wstr(12, 'fmt ');
	v.setUint32(16, 16, true);
	v.setUint16(20, 1, true); // PCM
	v.setUint16(22, nch, true);
	v.setUint32(24, rate, true);
	v.setUint32(28, rate * nch * bps, true);
	v.setUint16(32, nch * bps, true);
	v.setUint16(34, bits, true); // bit depth
	wstr(36, 'data');
	v.setUint32(40, n * nch * bps, true);
	let off = 44;
	if (bps === 3) {
		for (let i = 0; i < n; i++) {
			for (let c = 0; c < nch; c++) {
				const x = Math.max(-1, Math.min(1, chs[c][i]));
				let q = Math.round(x < 0 ? x * 8388608 : x * 8388607);
				q = Math.max(-8388608, Math.min(8388607, q));
				v.setUint8(off, q & 255);
				v.setUint8(off + 1, (q >> 8) & 255);
				v.setUint8(off + 2, (q >> 16) & 255);
				off += 3;
			}
		}
	} else {
		for (let i = 0; i < n; i++) {
			for (let c = 0; c < nch; c++) {
				const x = Math.max(-1, Math.min(1, chs[c][i]));
				v.setInt16(off, x < 0 ? x * 32768 : x * 32767, true);
				off += 2;
			}
		}
	}
	return new Blob([buf], {
		type: 'audio/wav'
	});
}

const clampInt = (v, lo, hi, def) => {
	v = Math.round(+v);
	return Number.isFinite(v) ? Math.min(hi, Math.max(lo, v)) : def;
};

async function exportWav() {
	if (wavGoBtn.dataset.busy) return;
	if (!seq.bars) {
		wavSay('record a beat first', true);
		return;
	}
	wavGoBtn.dataset.busy = '1';
	wavGoBtn.disabled = true;
	wavGoBtn.textContent = 'rendering…';
	let cap: ScriptProcessorNode | null = null,
		mute: GainNode | null = null,
		tick: number | null = null;
	try {
		try {
			if (ctx.state !== 'running') await ctx.resume();
		} catch (e) { }
		const rate = ctx.sampleRate || 44100;
		const loopBeats = seq.bars * 4;
		const loopSec = loopBeats * spb();

		// WHY REAL-TIME CAPTURE: Safari's OfflineAudioContext mis-renders this
		// engine's complex, automated, resonant-filter voice graph into full-scale
		// static (peak in the thousands; Chrome renders the same graph fine). So we
		// render the way the device renders correctly — the LIVE context, in real
		// time — through a silent ScriptProcessor tap, and keep the second of two
		// passes (so end-of-loop tails wrap into the start = a seamless loop).
		// Costs ~one loop length of wall-clock time; we show a countdown.
		const ebus = makeBus(ctx);
		const ekit = make808Kit(ctx);
		cap = ctx.createScriptProcessor(4096, 2, 2);
		mute = ctx.createGain();
		mute.gain.value = 0; // captured, never heard
		ebus.dry.disconnect();
		ebus.wet.disconnect();
		ebus.dry.connect(cap);
		ebus.wet.connect(cap);
		cap.connect(mute).connect(ctx.destination);

		const blocksL: any[] = [],
			blocksR: any[] = [];
		let capT0: number | null = null;
		cap.onaudioprocess = e => {
			if (capT0 == null) capT0 = e.playbackTime;
			blocksL.push(new Float32Array(e.inputBuffer.getChannelData(0)));
			blocksR.push(new Float32Array(e.inputBuffer.getChannelData(1)));
			e.outputBuffer.getChannelData(0).fill(0);
			e.outputBuffer.getChannelData(1).fill(0);
		};

		// local snapshots; the automation timeline mutates these as it plays out
		const pitch = Object.assign({}, pitchSettings);
		const choke = Object.assign({}, chokeSettings);
		const variant = Object.assign({}, variantSettings);
		const volume = Object.assign({}, volumeSettings);
		const send = Object.assign({}, sendSettings);
		const esend = {};
		Object.keys(ekit).forEach(n => {
			const g = ctx.createGain();
			g.gain.value = SEND_GAIN[clampInt(send[n], 0, 5, 5)];
			g.connect(ebus.verb);
			esend[n] = g;
		});
		let verbV = clampInt(verbSettings.reverb, 1, 5, 1);
		let compV = clampInt(compSettings.comp, 1, 5, 1);
		let tubeV = clampInt(tubeSettings.tube, 1, 5, 1);
		const applyMaster = t => {
			ebus.wet.gain.setValueAtTime(WET[verbV], t);
			ebus.comp.threshold.setValueAtTime(COMP[compV][0], t);
			ebus.comp.ratio.setValueAtTime(COMP[compV][1], t);
			ebus.makeup.gain.setValueAtTime(COMP[compV][2], t);
			ebus.drive.gain.setValueAtTime(DRIVE[tubeV][0], t);
			ebus.post.gain.setValueAtTime(DRIVE[tubeV][1], t);
		};

		// schedule everything against the LIVE clock, two passes from startTime
		const startTime = ctx.currentTime + 0.12;
		applyMaster(startTime);
		const items: any[] = [];
		seq.events.forEach(e => items.push({
			t: qBeat(e.beat) % loopBeats,
			hit: e.pad,
			v: e.v
		}));
		seq.auto.forEach(a => items.push({
			t: a.beat % loopBeats,
			auto: a
		}));
		items.sort((x, y) => x.t - y.t || (x.auto ? -1 : 1));
		for (let pass = 0; pass < 2; pass++) {
			const base = startTime + pass * loopSec;
			for (const it of items) {
				const t = base + it.t * spb();
				if (it.auto) {
					const sep = it.auto.id.indexOf(':');
					const tgt = it.auto.id.slice(0, sep);
					const kind = it.auto.id.slice(sep + 1);
					if (kind === 'pitch') pitch[tgt] = it.auto.v;
					else if (kind === 'choke') choke[tgt] = it.auto.v;
					else if (kind === 'bank') variant[tgt] = it.auto.v;
					else if (kind === 'reverb') {
						verbV = it.auto.v;
						applyMaster(t);
					} else if (kind === 'compd') {
						compV = it.auto.v;
						applyMaster(t);
					} else if (kind === 'tubed') {
						tubeV = it.auto.v;
						applyMaster(t);
					} else if (kind === 'volume') volume[tgt] = it.auto.v;
					else if (kind === 'send') esend[tgt].gain.setValueAtTime(SEND_GAIN[clampInt(it.auto.v, 0, 5, 5)], t);
				} else {
					const lvl = (it.v == null ? 1 : it.v) * VOL[Math.max(-4, Math.min(4, (volume[it.hit] | 0)))];
					const vg = ctx.createGain();
					vg.gain.value = lvl;
					vg.connect(ebus.master);
					vg.connect(esend[it.hit]);
					const ratio = Math.pow(2, (pitch[it.hit] | 0) / 12);
					ekit[it.hit].engineFunctions[clampInt(variant[it.hit], 1, 4, 1) - 1](t, vg, ratio);
					const cut = GATE[choke[it.hit] | 0];
					if (cut) {
						vg.gain.setValueAtTime(lvl, t + cut[0]);
						vg.gain.linearRampToValueAtTime(0.0001, t + cut[0] + cut[1]);
					}
				}
			}
		}

		// run for two passes (+ lead + a little tail), counting down on the button
		const totalSec = 0.12 + loopSec * 2 + 0.3;
		const t0 = performance.now();
		tick = setInterval(() => {
			const left = totalSec - (performance.now() - t0) / 1000;
			wavGoBtn.textContent = left > 0.4 ? Math.ceil(left) + 's' : '...';
		}, 200);
		wavGoBtn.textContent = Math.ceil(totalSec) + 's';
		await new Promise(r => setTimeout(r, totalSec * 1000));
		clearInterval(tick);
		tick = null;
		cap.onaudioprocess = null;

		// stitch the captured blocks and lift out the SECOND pass
		let total = 0;
		for (const b of blocksL) total += b.length;
		const allL = new Float32Array(total),
			allR = new Float32Array(total);
		let o = 0;
		for (let i = 0; i < blocksL.length; i++) {
			allL.set(blocksL[i], o);
			allR.set(blocksR[i], o);
			o += blocksL[i].length;
		}
		const P = Math.round(loopSec * rate);
		// ALIGN THE DOWNBEAT TO SAMPLE 0 (so it sits on the bar line in a DAW).
		// playbackTime was ~180ms off (ScriptProcessor latency), so don't trust
		// it — align to the audio. The captured lead-in is silent, so the first
		// audible sample IS pass 0's earliest hit, whose beat offset we know. From
		// that anchor we place pass 1's beat 0 exactly at sample 0 and take one
		// period; pass-0 tails ride underneath the start = seamless loop.
		const THR = 0.02,
			w1 = Math.max(1, Math.floor(0.001 * rate));
		let d0 = 0;
		for (let i = 0; i + w1 <= total; i += w1) {
			let e = 0;
			for (let j = 0; j < w1; j++) {
				const x = allL[i + j] || 0;
				e += x * x;
			}
			if (Math.sqrt(e / w1) > THR) {
				d0 = i;
				break;
			}
		}
		let earliest = Infinity;
		for (const it of items)
			if (!it.auto) earliest = Math.min(earliest, it.t);
		if (!isFinite(earliest)) earliest = 0;
		let i0 = d0 + Math.round((loopSec - earliest * spb()) * rate);
		i0 = Math.max(0, Math.min(i0, Math.max(0, total - P)));
		const chans = [allL.subarray(i0, i0 + P), allR.subarray(i0, i0 + P)];

		const bits = wavBits === 24 ? 24 : 16;
		let outChans = chans,
			outRate = rate;
		if (wavRate && wavRate !== rate) {
			outChans = await resampleChannels(chans, rate, wavRate);
			outRate = wavRate;
		}
		const blob = encodeWav(outChans, outRate, bits);
		const tag = bits + 'bit-' + Math.round(outRate / 1000) + 'k';
		const stamp = new Date().toISOString().slice(0, 10);
		const name = '808_' + seq.bpm + 'bpm_' + seq.bars + 'bar_' + tag + '_' + stamp + '.wav';
		// Desktop downloads without a user gesture, so deliver now. Mobile needs a
		// LIVE gesture for the share sheet (Chrome iOS strictly; Safari is lenient)
		// and the multi-second capture just consumed ours — so stash the file and
		// turn WAV into a SAVE button. The next tap is a fresh gesture that shares.
		const mobileUA = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
		const coarse = !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
		if (mobileUA || (navigator.maxTouchPoints > 1 && coarse)) {
			pendingWav = {
				blob,
				name
			};
			wavGoBtn.dataset.save = '1';
			wavSay('captured — tap save');
		} else {
			downloadBlob(blob, name);
			wavSay('saved');
			closeWavSheet();
		}
	} catch (err) {
		wavSay('export failed, try again', true);
	} finally {
		if (tick) clearInterval(tick);
		try {
			if (cap) {
				cap.onaudioprocess = null;
				cap.disconnect();
			}
		} catch (e) { }
		try {
			if (mute) mute.disconnect();
		} catch (e) { }
		delete wavGoBtn.dataset.busy;
		if (wavGoBtn.dataset.save === '1') {
			wavGoBtn.disabled = false;
			wavGoBtn.textContent = 'save to files';
		} else {
			wavGoBtn.disabled = false;
			wavGoBtn.textContent = 'download wav';
		}
	}
}

// WAV button: first tap records the loop in real time; on mobile it then
// becomes SAVE (a fresh gesture that opens the share sheet).
// ---------- WAV export sheet: depth + rate, then render / deliver ----------
let pendingWav: any = null;
const wavSheet = document.getElementById('wavSheet');
const wavGoBtn: any = document.getElementById('wavGo');
const wbits16 = document.getElementById('wbits16');
const wbits24 = document.getElementById('wbits24');
const wrateNative = document.getElementById('wrateNative');
const wrate441 = document.getElementById('wrate441');
const wavMsgEl = document.getElementById('wavMsg');
let wavOpener: any = null;

function wavSay(t, bad?) {
	if (wavMsgEl) {
		wavMsgEl.textContent = t;
		wavMsgEl.classList.toggle('bad', !!bad);
	}
	announce(t);
	if (bad && wavGoBtn) linkNope(wavGoBtn);
}

function resetWavGo() {
	pendingWav = null;
	if (wavGoBtn) {
		wavGoBtn.dataset.save = '';
		delete wavGoBtn.dataset.busy;
		wavGoBtn.disabled = false;
		wavGoBtn.textContent = 'download wav';
	}
}

function renderWavOpts() {
	if (wbits16) wbits16.setAttribute('aria-pressed', wavBits === 16 ? 'true' : 'false');
	if (wbits24) wbits24.setAttribute('aria-pressed', wavBits === 24 ? 'true' : 'false');
	if (wrateNative) wrateNative.setAttribute('aria-pressed', wavRate ? 'false' : 'true');
	if (wrate441) wrate441.setAttribute('aria-pressed', wavRate === 44100 ? 'true' : 'false');
}

function openWavSheet() {
	if (!wavSheet) return;
	wavOpener = document.activeElement;
	if (wrateNative) wrateNative.textContent = Math.round((ctx.sampleRate || 48000) / 1000) + ' kHz';
	resetWavGo();
	if (wavMsgEl) {
		wavMsgEl.textContent = '';
		wavMsgEl.classList.remove('bad');
	}
	if (wavGoBtn) wavGoBtn.disabled = !seq.bars;
	renderWavOpts();
	wavSheet.classList.add('open');
	wavSheet.setAttribute('aria-hidden', 'false');
	setTimeout(() => {
		if (wavGoBtn) wavGoBtn.focus();
	}, 120);
}

function closeWavSheet() {
	if (!wavSheet) return;
	wavSheet.classList.remove('open');
	wavSheet.setAttribute('aria-hidden', 'true');
	resetWavGo();
	if (wavOpener && wavOpener.focus) wavOpener.focus();
}

function setWavBits(b) {
	wavBits = b;
	try {
		localStorage.setItem('pads808-wavbits', b);
	} catch (_) { }
	renderWavOpts();
	resetWavGo();
}

function setWavRate(r) {
	wavRate = r;
	try {
		localStorage.setItem('pads808-wavrate', r);
	} catch (_) { }
	renderWavOpts();
	resetWavGo();
}
if (wbits16) wbits16.addEventListener('click', () => setWavBits(16));
if (wbits24) wbits24.addEventListener('click', () => setWavBits(24));
if (wrateNative) wrateNative.addEventListener('click', () => setWavRate(0));
if (wrate441) wrate441.addEventListener('click', () => setWavRate(44100));
async function saveWav() {
	const pw = pendingWav;
	if (!pw) {
		resetWavGo();
		return;
	}
	if (wavGoBtn) wavGoBtn.disabled = true;
	try {
		await deliverFile(pw.blob, pw.name, 'audio/wav');
		wavSay('saved');
	} catch (_) {
		wavSay('save failed', true);
	} finally {
		resetWavGo();
		closeWavSheet();
	}
}
if (wavGoBtn) wavGoBtn.addEventListener('click', () => {
	armShowLabelLive();
	if (!seq.bars) {
		wavSay('record a beat first', true);
		return;
	}
	if (wavGoBtn.dataset.save === '1') saveWav();
	else exportWav();
});
// resample captured float channels to a target rate. Safari-safe: this plays a
// plain buffer through an OfflineAudioContext (no convolver/filter graph), so
// the offline-render bug that forces real-time capture never applies here.
async function resampleChannels(chans, srcRate, dstRate) {
	const OAC = window.OfflineAudioContext;//|| window.webkitOfflineAudioContext;
	if (!OAC || srcRate === dstRate) return chans;
	const frames = chans[0].length;
	const out = Math.max(1, Math.round(frames * dstRate / srcRate));
	const oac = new OAC(chans.length, out, dstRate);
	const buf = oac.createBuffer(chans.length, frames, srcRate);
	for (let c = 0; c < chans.length; c++) buf.copyToChannel(chans[c], c);
	const node = oac.createBufferSource();
	node.buffer = buf;
	node.connect(oac.destination);
	node.start();
	const r = await oac.startRendering();
	const res: any[] = [];
	for (let c = 0; c < chans.length; c++) res.push(r.getChannelData(c));
	return res;
}
wavBtn.addEventListener('pointerdown', e => {
	e.preventDefault();
	armShowLabelLive();
	openWavSheet();
});
if (wavSheet) {
	wavSheet.addEventListener('click', __e => {
		let e: any = __e;
		if (e.target === wavSheet || e.target.dataset.close != null) closeWavSheet();
	});
	wavSheet.addEventListener('keydown', e => {
		if (e.key === 'Escape') {
			closeWavSheet();
			return;
		}
		if (e.key !== 'Tab') return;
		const f = Array.prototype.slice.call(wavSheet.querySelectorAll('button, input, [tabindex]'))
			.filter(x => !x.disabled && !x.hasAttribute('hidden') && x.offsetParent !== null);
		if (!f.length) return;
		const first = f[0],
			last = f[f.length - 1];
		if (e.shiftKey && document.activeElement === first) {
			e.preventDefault();
			last.focus();
		} else if (!e.shiftKey && document.activeElement === last) {
			e.preventDefault();
			first.focus();
		}
	});
}

// ---------- Share: short codes, stored server-side ----------
// The loop (events + automation + knob snapshot + all four banks) is the same
// compact JSON it always was; it just no longer rides in the URL. A tiny
// Cloudflare worker stores it under a short code and the link carries only
// that code (?s=k7m2x9), so it survives chat apps, address bars, and the
// no-address-bar installed PWA. The synth still rebuilds the sound on arrival.
const SHARE_API = 'https://808-share.mullinsben.workers.dev';
const PADS = ['boom', 'kick', 'snare', 'clap', 'chat', 'ohat', 'hitom', 'cowbell'];
const b64u = {
	enc: s => btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''),
	dec: s => atob(s.replace(/-/g, '+').replace(/_/g, '/')),
};
const r3 = x => Math.round(x * 1000) / 1000; // beats to 1/1000 keeps links short

const encEvents = evs => evs.map(e => (e.v == null || e.v >= 0.995) ?
	[PADS.indexOf(e.pad), r3(e.beat)] :
	[PADS.indexOf(e.pad), r3(e.beat), Math.round(e.v * 100) / 100]);
const encAuto = au => au.map(a => [a.id, a.v, r3(a.beat)]);
const decEvents = arr => (arr || [])
	.filter(e => PADS[e[0] | 0] && Number.isFinite(+e[1]))
	.map(e => ({
		pad: PADS[e[0] | 0],
		beat: +e[1],
		v: e[2] == null ? 1 : Math.max(0.05, Math.min(1, +e[2]))
	}));
const decAuto = arr => (arr || [])
	.filter(a => dialMap[a[0]] && Number.isFinite(+a[2]))
	.map(a => ({
		id: a[0],
		v: a[1],
		beat: +a[2]
	}));

// the loop as the compact object the share worker stores (and old #loop=
// links carried). No URL wrapper anymore; just the data.
function buildLoopPayload() {
	const snap = {};
	dials.forEach(d => {
		snap[d.id] = d.get();
	});
	return {
		v: 1,
		t: seq.bpm,
		b: seq.bars,
		e: encEvents(seq.events),
		a: encAuto(seq.auto),
		s: snap,
		// the SET travels too: all four memory banks, if they exist
		// (banks is an OBJECT keyed 0-3, not an array, so map over indices).
		// ONE TEMPO: banks ride the top-level `t`; a bank's own record tempo is
		// just scaffolding and never travels (you spin slow beats up to speed,
		// so the original tempo is gone the moment you do).
		k: [0, 1, 2, 3].map(i => {
			const bk = banks[i];
			return bk ? {
				b: bk.bars,
				e: encEvents(bk.events || []),
				a: encAuto(bk.auto || []),
				s: bk.snap,
			} : 0;
		}),
	};
}

// rebuild the machine from a payload object (overwrites the working loop and
// the four banks; that's the point of opening someone's beat). Returns true
// if it loaded something real, false if the payload was empty/garbage.
function applyLoopPayload(d) {
	try {
		const bars = clampInt(d && d.b, 1, 8, 0);
		if (!bars) return false;
		// restore every knob without writing automation
		applyingAuto = true;
		Object.keys(d.s || {}).forEach(id => {
			if (dialMap[id]) dialMap[id].set(clampInt(d.s[id], dialMap[id].min, dialMap[id].max, dialMap[id].min));
		});
		applyingAuto = false;
		seq.events = decEvents(d.e);
		seq.auto = decAuto(d.a);
		// an arriving SET fills the memory banks (A-D), arrangement and all
		if (Array.isArray(d.k)) {
			for (let i = 0; i < 4; i++) {
				const bk = d.k[i];
				banks[i] = bk ? {
					events: decEvents(bk.e),
					auto: decAuto(bk.a),
					bars: clampInt(bk.b, 1, 8, 1),
					// one tempo: every bank in the set adopts the current/incoming bpm,
					// never a per-bank record tempo (old links with bk.t are ignored)
					bpm: clampInt(d.t, 60, 180, 120),
					snap: bk.s || {},
				} : null;
			}
			saveBanks();
			renderBanks();
		}
		seq.bars = bars;
		seq.bpm = clampInt(d.t, 60, 180, 120);
		seq.guess = false;
		// Land on bank A: the working area shows bank A's pattern, A is the active
		// slot, and it sits ready to play. No auto-play, no cycling through the
		// other banks — just A. (Falls back to the loose loop if there's no A.)
		if (banks[0]) applySlot(0); // overrides loop + knobs from A; tempo stays global
		renderBanks();
		saveT();
		renderTransport();
		bpmVal.classList.add('flash'); // the arrival receipt
		setTimeout(() => bpmVal.classList.remove('flash'), 1600);
		return true;
	} catch (_) {
		return false;
	}
}

// LEGACY: links shared before short codes still carried the whole loop in the
// hash (#loop=base64). Keep decoding them so nobody's old link goes dead.
function loadHashLoop() {
	const m = location.hash.match(/loop=([A-Za-z0-9_-]+)/);
	if (!m) return;
	try {
		applyLoopPayload(JSON.parse(b64u.dec(m[1])));
	} catch (_) { }
}

// pull a short code out of whatever the user pasted: a full ?s= link, a bare
// code, or text a share sheet dumped in. null if there's nothing code-shaped.
function codeFrom(text) {
	if (!text) return null;
	const q = text.match(/[?&]s=([a-z0-9]{1,16})/i);
	if (q) return q[1];
	const bare = text.trim().match(/^[a-z0-9]{4,16}$/i);
	return bare ? bare[0] : null;
}

// ask the worker for a code's loop and load it. returns true on success.
async function loadCode(code) {
	if (!code) return false;
	try {
		const r = await fetch(SHARE_API + '/s/' + encodeURIComponent(code));
		if (!r.ok) return false;
		return applyLoopPayload(await r.json());
	} catch (_) {
		return false;
	}
}

// store the current loop, get a short code back. throws if the worker is
// unreachable (the share UI shows an honest failure).
async function mintCode() {
	const r = await fetch(SHARE_API + '/s', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(buildLoopPayload()),
	});
	if (!r.ok) throw new Error('mint ' + r.status);
	const {
		code
	} = await r.json();
	if (!code) throw new Error('no code');
	return code;
}

// failure tell: shake the source control (button or sheet field)
function linkNope(el) {
	el = el || linkBtn;
	el.classList.add('nope');
	setTimeout(() => el.classList.remove('nope'), 480);
}
// in-gesture clipboard copy fallback: plain textarea, value, select range
function execCopy(text) {
	try {
		const ta = document.createElement('textarea');
		ta.value = text;
		ta.setAttribute('readonly', '');
		ta.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0';
		document.body.appendChild(ta);
		ta.select();
		ta.setSelectionRange(0, text.length); // iOS needs the explicit range
		const ok = document.execCommand('copy');
		ta.remove();
		return ok;
	} catch (_) {
		return false;
	}
}

function copyText(text, okFn, noFn) {
	if (navigator.clipboard && navigator.clipboard.writeText) {
		navigator.clipboard.writeText(text).then(okFn).catch(() => {
			execCopy(text) ? okFn() : noFn();
		});
	} else {
		execCopy(text) ? okFn() : noFn();
	}
}

// ---------- the share / load sheet ----------
// Minting a code is a network round-trip, and an await before navigator.share
// burns the user gesture on iOS. So instead of firing the sheet from the tap,
// we open OUR sheet, mint in the background, and show the link with its own
// Copy / Share buttons — each a fresh gesture. The sheet also carries the
// paste-a-link field, which is the only way to load a beat into the installed
// PWA (no address bar there).
const sheet: any = document.getElementById('sheet');
const sheetURL: any = document.getElementById('sheetURL');
const sheetCopy = document.getElementById('sheetCopy');
const sheetShare = document.getElementById('sheetShare');
const sheetMint = document.getElementById('sheetMint'); // "your link" block
const sheetEmpty = document.getElementById('sheetEmpty'); // "record first" note
const loadInput: any = document.getElementById('loadInput');
const loadBtn = document.getElementById('loadBtn');
const sheetMsg = document.getElementById('sheetMsg');
let currentURL = '';

const sheetSay = (t, bad?) => {
	if (!sheetMsg) return;
	sheetMsg.textContent = t || '';
	sheetMsg.classList.toggle('bad', !!bad);
};
let sheetOpener: any = null;

function openSheet() {
	if (!sheet) return;
	sheetOpener = document.activeElement; // so focus returns here on close
	sheet.classList.add('open');
	sheet.setAttribute('aria-hidden', 'false');
	sheetSay('');
	if (loadInput) loadInput.value = '';
	// SHARE half: only meaningful if there's a loop to share
	const has = !!seq.bars;
	if (sheetMint) sheetMint.hidden = !has;
	if (sheetEmpty) sheetEmpty.hidden = has;
	if (has) {
		currentURL = '';
		if (sheetURL) sheetURL.value = 'minting link…';
		if (sheetShare) sheetShare.hidden = !navigator.share;
		mintCode().then(code => {
			currentURL = location.origin + location.pathname + '?s=' + code;
			if (sheetURL) {
				sheetURL.value = currentURL;
				sheetURL.scrollLeft = 0;
			}
		}).catch(() => {
			if (sheetURL) sheetURL.value = '';
			sheetSay("couldn't reach the share server — try again in a moment.", true);
		});
	}
	setTimeout(() => {
		if (loadInput) loadInput.focus();
	}, 120);
}

function closeSheet() {
	if (!sheet) return;
	sheet.classList.remove('open');
	sheet.setAttribute('aria-hidden', 'true');
	if (sheetOpener && sheetOpener.focus) sheetOpener.focus(); // return focus to the trigger
}
// the visible, operable controls inside the sheet, in order
function sheetFocusables() {
	return Array.prototype.slice.call(sheet.querySelectorAll('button, input, [tabindex]'))
		.filter(el => !el.disabled && !el.hasAttribute('hidden') && el.offsetParent !== null);
}

// link button opens the sheet (click, so iOS counts the gesture for Share)
linkBtn.addEventListener('click', e => {
	e.preventDefault();
	openSheet();
});

if (sheetCopy) sheetCopy.addEventListener('click', () => {
	if (!currentURL) {
		linkNope(sheetCopy);
		return;
	}
	copyText(currentURL,
		() => {
			sheetSay('link copied');
			announce('link copied');
		},
		() => linkNope(sheetCopy));
});
if (sheetShare) sheetShare.addEventListener('click', () => {
	if (!currentURL || !navigator.share) {
		linkNope(sheetShare);
		return;
	}
	// short URL now, so navigator.share no longer hangs on a giant string
	navigator.share({
		title: '808.html',
		url: currentURL
	}).catch(() => { });
});

function doLoad() {
	const code = codeFrom(loadInput ? loadInput.value : '');
	if (!code) {
		linkNope(loadInput || loadBtn);
		sheetSay('paste a beat link or code', true);
		return;
	}
	sheetSay('loading…');
	loadCode(code).then(okLoaded => {
		if (okLoaded) {
			sheetSay('beat loaded');
			announce('beat loaded');
			armShowLabelLive();
			setTimeout(closeSheet, 550);
		} else {
			linkNope(loadInput || loadBtn);
			sheetSay("couldn't find that beat", true);
		}
	});
}
if (loadBtn) loadBtn.addEventListener('click', doLoad);
if (loadInput) loadInput.addEventListener('keydown', e => {
	if (e.key === 'Enter') {
		e.preventDefault();
		doLoad();
	}
});
// dismiss: the X, the backdrop, or Escape
sheet && sheet.addEventListener('click', e => {
	if (e.target === sheet || e.target.dataset.close != null) closeSheet();
});
document.addEventListener('keydown', e => {
	if (e.key === 'Escape' && sheet && sheet.classList.contains('open')) closeSheet();
});
// focus trap: a real modal keeps Tab inside the dialog
if (sheet) sheet.addEventListener('keydown', e => {
	if (e.key !== 'Tab') return;
	const f = sheetFocusables();
	if (!f.length) return;
	const first = f[0],
		last = f[f.length - 1];
	if (e.shiftKey && document.activeElement === first) {
		e.preventDefault();
		last.focus();
	} else if (!e.shiftKey && document.activeElement === last) {
		e.preventDefault();
		first.focus();
	}
});

// ---------- boot: load an incoming beat ----------
// ?s=CODE (a shared link), or text/url a share_target handed us (Android),
// else fall back to a legacy #loop= hash. Strip the query after so a refresh
// doesn't re-load and clobber edits.
(function bootLoad() {
	const params = new URLSearchParams(location.search);
	const code = codeFrom(params.get('s')) ||
		codeFrom(params.get('url')) || codeFrom(params.get('text'));
	const cleanURL = () => {
		try {
			history.replaceState(null, '', location.origin + location.pathname);
		} catch (_) { }
	};
	if (code) {
		loadCode(code).then(() => cleanURL());
		return;
	}
	loadHashLoop();
})();

// ---------- boot: the die spins full-screen, then takes its seat ----------
(function bootScreen() {
	const el = document.getElementById('boot');
	const holder = document.getElementById('bootDie');
	const seat = document.getElementById('rnd');
	if (!el || !holder || !seat) return;
	// returning visitors skip straight to the machine; the boot roll shows once per device
	let bootSeen = false;
	try {
		bootSeen = localStorage.getItem('pads808-booted') === '1';
	} catch (_) { }
	if (bootSeen) {
		el.remove();
		return;
	}
	try {
		localStorage.setItem('pads808-booted', '1');
	} catch (_) { }
	if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
		el.remove();
		return;
	}
	const src = seat.querySelector('svg');
	if (!src) {
		el.remove();
		return;
	}
	// namespaced clone so its ids never collide with the live die
	holder.innerHTML = src.outerHTML
		.replace(/dieCore/g, 'bootCore')
		.replace(/dieface/g, 'bootface')
		.replace(/dieClip/g, 'bootClip')
		.replace(/"flip"/g, '"bootflip"');
	const bsvg: any = holder.querySelector('svg');
	bsvg.removeAttribute('width');
	bsvg.removeAttribute('height');
	bsvg.querySelectorAll('[fill="#fff"]').forEach(n => n.remove()); // no white sparkle
	const frames = Array.from(bsvg.querySelectorAll('.fbd > g')); // diagonal tumble
	const still = bsvg.querySelectorAll('.diebody, .face, .dieoutline'); // the resting 808 die
	frames.forEach(f => {
		(f as any).style.display = 'none';
	}); // idle shows the resting die, not a tumble frame
	const N = frames.length;
	const SPINS = 2;
	const D = 1400;
	const NEON = ['#2ad8ff', '#ff4fd8', '#ff8c1a'];
	const accent = () => getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
	// TAP TO ROLL: the boot waits for a tap. The tap is the gesture that wakes
	// audio (so the cowbell can ring) AND it teaches the whole point — you spin
	// the die. The die rolls, goes COWBELL, lands on 808, and takes its seat.
	const prompt = document.createElement('div');
	prompt.className = 'boot-prompt';
	prompt.textContent = 'roll the dice';
	el.appendChild(prompt);
	let cur: any = null,
		raf = 0,
		done = false,
		started = false;
	let t0 = 0;
	const show = f => {
		if (!f || f === cur) return;
		if (cur) cur.style.display = 'none';
		f.style.display = 'block';
		cur = f;
	};
	const ring = () => {
		if (ctx.state !== 'running') return;
		const vg = ctx.createGain();
		vg.gain.value = 0.85;
		vg.connect(bus.master);
		//KIT.cowbell.engineFunctions[0](ctx.currentTime + 0.02, vg, 1); // the 808 cowbell, on the roll
		workGlobalKIT.cowbell.engineFunctions[0](ctx.currentTime + 0.02, vg, 1);
	};
	const flyToSeat = () => {
		// hold a beat on the resting 808, then take its seat
		setTimeout(() => {
			const r = seat.getBoundingClientRect();
			const b = holder.getBoundingClientRect();
			if (r.width && b.width) {
				const scale = r.width / b.width;
				const dx = (r.left + r.width / 2) - (b.left + b.width / 2);
				const dy = (r.top + r.height / 2) - (b.top + b.height / 2);
				holder.style.transition = 'transform 0.6s cubic-bezier(0.5, 0, 0.15, 1)';
				holder.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(' + scale + ')';
			}
			el.style.transition = 'opacity 0.5s ease 0.15s';
			el.style.opacity = '0';
			setTimeout(() => el.remove(), 760);
		}, 600);
	};
	// EXACTLY the small die's roll: cubic ease, round() lands on frame 0,
	// then the resting face (which carries the 808) appears. no jump.
	const step = now => {
		const p = Math.min(1, (now - t0) / D);
		const eased = 1 - Math.pow(1 - p, 3);
		el.style.setProperty('--boot-c', NEON[Math.floor((now - t0) / 280) % 3]);
		show(frames[Math.round(eased * N * SPINS) % N]);
		if (p < 1) {
			raf = requestAnimationFrame(step);
		} else if (!done) {
			done = true;
			if (cur) {
				cur.style.display = 'none';
				cur = null;
			}
			still.forEach(n => {
				n.style.opacity = '';
			}); // the 808 appears (frame 0 == this face)
			el.style.setProperty('--boot-c', accent());
			flyToSeat();
		}
	};
	const roll = withCowbell => {
		if (started) return;
		started = true;
		prompt.remove();
		if (withCowbell) {
			if (navigator.vibrate) navigator.vibrate(45); // Android; iOS taptic comes from the .hap switch the tap landed on
			ctx.resume().then(ring).catch(() => { }); // the tap wakes audio = the cowbell can ring
		}
		still.forEach(n => {
			n.style.opacity = 0;
		}); // hide the resting die; the tumble takes over
		t0 = performance.now();
		raf = requestAnimationFrame(step);
	};
	// invisible iOS Taptic switch filling the boot; the finger lands on it (haptic),
	// and pointerdown bubbles up to fire the roll. #boot is fixed+inset:0, so it fills.
	const bootHap = document.createElement('input');
	bootHap.type = 'checkbox';
	bootHap.setAttribute('switch', '');
	bootHap.className = 'hap';
	bootHap.setAttribute('aria-hidden', 'true');
	bootHap.tabIndex = -1;
	el.appendChild(bootHap);
	el.addEventListener('pointerdown', () => roll(true), {
		once: true
	});
	// if a user never taps, the die rolls itself (no cowbell) so nothing is stuck
	setTimeout(() => roll(false), 9000);
})();

// First tap anywhere arms the context, and keeps trying until it RUNS.
// iOS Chrome only honors resume() from certain gestures (touchend/click,
// not always pointerdown), so we listen to all of them in capture phase
// (stopPropagation can't hide taps from us) and retire only on success.
const unlockEvents = ['pointerdown', 'touchend', 'mousedown', 'click', 'keydown'];
const unlock = () => {
	if (ctx.state === 'running') {
		unlockEvents.forEach(ev => window.removeEventListener(ev, unlock, true));
		return;
	}
	ctx.resume().then(() => {
		if (ctx.state === 'running') {
			// warm the graph with a silent 1-sample source so the first real hit
			// is clean (the trigger() defer is the primary first-note fix).
			try {
				const w = ctx.createBufferSource();
				w.buffer = ctx.createBuffer(1, 1, ctx.sampleRate);
				w.connect(ctx.destination);
				w.start(0);
			} catch (_) { }
			unlockEvents.forEach(ev => window.removeEventListener(ev, unlock, true));
		}
	}).catch(() => { });
};
unlockEvents.forEach(ev => window.addEventListener(ev, unlock, true));

// Deliver an exported file. PHONES get the native share sheet: its "Save to
// Files" writes the real bytes and lets you choose where, which fixes both the
// iOS-Safari static (its <a download> mishandled the blob) and Chrome-iOS
// dumping the file somewhere you had to hunt for. DESKTOP gets a plain
// download (its share sheet has no save-to-disk). The rendered audio itself is
// good — same WebKit engine renders fine in Chrome iOS — so sharing the same
// bytes through the sheet lands a clean file.
async function deliverFile(blob, filename, mime) {
	// "touch" = a phone/tablet where the native share sheet (Save to Files) is
	// the right flow. A desktop — even a touch-screen laptop, which has a FINE
	// pointer — must go straight to download; desktop share sheets silently
	// no-op a file ("counts down, then nothing"). maxTouchPoints alone misfires
	// on some Macs, so we also require a coarse (finger) primary pointer.
	const mobileUA = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
	const coarse = !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
	const touch = mobileUA || (navigator.maxTouchPoints > 1 && coarse);
	// PHONE: native share sheet (Save to Files). Try it DIRECTLY instead of
	// gating on canShare({files}) — locked-down in-app webviews (the Google app,
	// Gmail, etc.) under-report file support and return false there, yet often
	// still share fine from a live gesture, which is the only way to get a file
	// out of them. So we attempt the share and only fall back if it throws.
	if (touch && navigator.share) {
		try {
			await navigator.share({
				files: [new File([blob], filename, {
					type: mime
				})],
				title: filename
			});
			return;
		} catch (err) {
			if (err && err.name === 'AbortError') return; // user dismissed the sheet
			// share genuinely unsupported here; fall through
		}
	}
	// last resort: a download. Works on desktop; in a webview that ignores it,
	// open the blob so the OS viewer can save it (still better than nothing).
	if (touch) {
		try {
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.target = '_blank';
			a.rel = 'noopener';
			document.body.appendChild(a);
			a.click();
			a.remove();
			setTimeout(() => URL.revokeObjectURL(url), 60000);
			return;
		} catch (_) { }
	}
	downloadBlob(blob, filename);
}

function downloadBlob(blob, filename) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = filename;
	a.rel = 'noopener';
	document.body.appendChild(a);
	a.click();
	a.remove();
	// Keep the URL alive well past any iOS "Download?" confirmation prompt;
	// revoking at 5s could truncate a slow download into static. Free it on the
	// next pagehide, or after a generous timeout, whichever comes first.
	const free = () => URL.revokeObjectURL(url);
	setTimeout(free, 60000);
	window.addEventListener('pagehide', free, {
		once: true
	});
}

// ---------- MID export: the loop as a standard midi file ----------
// GM drum map; quantize applied exactly as the WAV hears it
const GM_OUT = {
	boom: 35,
	kick: 36,
	snare: 38,
	clap: 39,
	chat: 42,
	ohat: 46,
	hitom: 50,
	cowbell: 56
};

function exportMid() {
	if (!seq.bars) {
		announce('nothing to export yet, record a beat first');
		return;
	}
	const PPQ = 96;
	const lb = seq.bars * 4;
	const vlq = n => {
		const out = [n & 127];
		while ((n >>= 7)) out.unshift((n & 127) | 128);
		return out;
	};
	const us = Math.round(60000000 / seq.bpm);
	let track = [0, 255, 81, 3, (us >> 16) & 255, (us >> 8) & 255, us & 255];
	const NOTELEN = 24;
	const seqd: any[] = [];
	seq.events.forEach(e => {
		const t = Math.round((qBeat(e.beat) % lb) * PPQ);
		const v = Math.max(1, Math.round((e.v == null ? 1 : e.v) * 127));
		seqd.push({
			t,
			on: 1,
			n: GM_OUT[e.pad],
			v
		});
		seqd.push({
			t: t + NOTELEN,
			on: 0,
			n: GM_OUT[e.pad],
			v: 64
		});
	});
	seqd.sort((a, b) => a.t - b.t || b.on - a.on);
	let last = 0;
	seqd.forEach(e => {
		track = track.concat(vlq(e.t - last), [e.on ? 0x99 : 0x89, e.n, e.v]);
		last = e.t;
	});
	track = track.concat([0, 255, 47, 0]);
	const head = [77, 84, 104, 100, 0, 0, 0, 6, 0, 0, 0, 1, 0, PPQ,
		77, 84, 114, 107,
		(track.length >> 24) & 255, (track.length >> 16) & 255, (track.length >> 8) & 255, track.length & 255
	];
	const blob = new Blob([new Uint8Array(head.concat(track))], {
		type: 'audio/midi'
	});
	deliverFile(blob,
		'808_' + seq.bpm + 'bpm_' + seq.bars + 'bar_' + new Date().toISOString().slice(0, 10) + '.mid', 'audio/midi');
	announce('midi file exported');
}
// MID now opens the MIDI sheet (connect a controller + export the .mid).
midBtn.addEventListener('pointerdown', e => {
	e.preventDefault();
	openMidiSheet();
});

// ---------- MIDI in: hook up a controller, velocity becomes real ----------
// CONNECT lives in the MIDI sheet now (the M key still works as a shortcut).
// ONE clean layout, same in EVERY octave: pitch class -> pad. C..G play the
// eight sounds in order; G#..B are silent. No GM-table/keyboard hybrid (that
// collided in the low octave and made the mapping a mess).
//   C kick · C# boom · D snare · D# clap · E closed-hat · F open-hat · F# tom · G cowbell
const MIDI_PADS = {
	0: 'boom',
	1: 'kick',
	2: 'snare',
	3: 'clap',
	4: 'chat',
	5: 'ohat',
	6: 'hitom',
	7: 'cowbell',
};
const midiSupported = !!navigator.requestMIDIAccess;
let midiOn = false,
	midiNames: any[] = [],
	midiDenied = false;

function midiStatusLine() {
	if (!midiSupported) return 'midi needs chrome or edge';
	if (midiDenied) return 'blocked — allow midi in the site settings';
	if (!midiOn) return 'connect a controller to play live';
	return midiNames.length ? 'connected · ' + midiNames.join(', ') : 'connected · no device found';
}

function refreshMidiStatus() {
	const el = document.getElementById('midiMsg');
	if (el) el.textContent = midiStatusLine();
}
let hookMidi = () => { };
if (midiSupported) {
	const onMsg = ev => {
		const st = ev.data[0] & 0xf0;
		const note = ev.data[1];
		const vel = ev.data[2];
		if (st === 0x90 && vel > 0) {
			const pad = MIDI_PADS[note % 12]; // C..G -> the 8 sounds, any octave
			if (!pad) return;
			armShowLabelLive();
			triggerPadSound(pad, Math.pow(vel / 127, 1.4)); // perceptual-ish curve
			flash(padByVoice[pad], 100);
		}
	};
	hookMidi = () => {
		if (midiOn) {
			refreshMidiStatus();
			return;
		}
		navigator.requestMIDIAccess().then(acc => {
			const hook = () => {
				midiNames = [];
				acc.inputs.forEach(__inp => {
					let inp: any = __inp;
					inp.onmidimessage = onMsg;
					if (inp.name) midiNames.push(inp.name);
				});
				if (midiNames.length) announce('midi connected');
				refreshMidiStatus();
			};
			acc.onstatechange = hook;
			hook();
			midiOn = true;
			refreshMidiStatus();
		}).catch(() => {
			midiDenied = true;
			announce('midi access denied');
			refreshMidiStatus();
		});
	};
	// returning users reconnect silently; nobody gets prompted unasked
	if (navigator.permissions && navigator.permissions.query) {
		navigator.permissions.query({
			name: 'midi'
		})
			.then(s => {
				if (s.state === 'granted') hookMidi();
			})
			.catch(() => { });
	}
}

// ---------- MIDI sheet: the share/load plate, contents = connect + export ----
const midiSheet = document.getElementById('midiSheet');
const midiConnectBtn = document.getElementById('midiConnect');
const midiExportBtn: any = document.getElementById('midiExport');
let midiOpener: any = null;

function openMidiSheet() {
	if (!midiSheet) return;
	midiOpener = document.activeElement;
	if (midiExportBtn) midiExportBtn.disabled = !seq.bars; // export needs a loop
	midiSheet.classList.add('open');
	midiSheet.setAttribute('aria-hidden', 'false');
	refreshMidiStatus();
	setTimeout(() => {
		if (midiConnectBtn) midiConnectBtn.focus();
	}, 120);
}

function closeMidiSheet() {
	if (!midiSheet) return;
	midiSheet.classList.remove('open');
	midiSheet.setAttribute('aria-hidden', 'true');
	if (midiOpener && midiOpener.focus) midiOpener.focus();
}
if (midiConnectBtn) midiConnectBtn.addEventListener('click', () => {
	armShowLabelLive();
	hookMidi();
});
if (midiExportBtn) midiExportBtn.addEventListener('click', () => {
	if (seq.bars) {
		exportMid();
		closeMidiSheet();
	}
});
if (midiSheet) {
	midiSheet.addEventListener('click', __e => {
		let e: any = __e;
		if (e.target === midiSheet || e.target.dataset.close != null) closeMidiSheet();
	});
	midiSheet.addEventListener('keydown', e => {
		if (e.key === 'Escape') {
			closeMidiSheet();
			return;
		}
		if (e.key !== 'Tab') return;
		const f = Array.prototype.slice.call(midiSheet.querySelectorAll('button, input, [tabindex]'))
			.filter(x => !x.disabled && !x.hasAttribute('hidden') && x.offsetParent !== null);
		if (!f.length) return;
		const first = f[0],
			last = f[f.length - 1];
		if (e.shiftKey && document.activeElement === first) {
			e.preventDefault();
			last.focus();
		} else if (!e.shiftKey && document.activeElement === last) {
			e.preventDefault();
			first.focus();
		}
	});
}

// ---------- Latency readout (the receipt) ----------
// a dev instrument: shows on file:// and localhost, hides in production,
// returns if the URL carries ?debug
const latEl: any = document.getElementById('latency');
const isDev = location.protocol === 'file:' ||
	/^(localhost|127\.|192\.168\.)/.test(location.hostname) ||
	new URLSearchParams(location.search).has('debug');
if (isDev) {
	setInterval(() => {
		if (ctx.state !== 'running') return;
		const ms = ((ctx.baseLatency || 0) + (ctx.outputLatency || 0)) * 1000;
		latEl.textContent = ms.toFixed(1) + ' ms';
		// over 20ms the output device is the problem (looking at you, bluetooth)
		latEl.style.color = ms > 20 ? '#ff3b3b' : '';
	}, 1000);
} else {
	latEl.parentElement.style.display = 'none';
}
//})();