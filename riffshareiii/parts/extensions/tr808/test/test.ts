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
function curveArray(): Float32Array {
	let nn = 1024;
	let cu = new Float32Array(nn);
	for (let ii = 0; ii < nn; ii++) {
		let xx = (ii / (nn - 1)) * 2 - 1;
		cu[ii] = Math.tanh(1.6 * xx) / Math.tanh(1.6);
	}
	//console.log(cu);
	return cu;
}
/*
const CURVE = (() => {
	const n = 1024,
		c = new Float32Array(n);
	for (let i = 0; i < n; i++) {
		const x = (i / (n - 1)) * 2 - 1;
		c[i] = Math.tanh(1.6 * x) / Math.tanh(1.6);
	}
	return c;
})();
*/
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
	startFrequency: number,
	nextFrequency: number,
	freqChangeDuration: number,
	duration: number,
	clickLevel: number,
	clickWave: string,
	clickFrequency: number
	, driveLevel: number
	, baseWave: string
	, baselevel: number
};
type SnareEngineProps808 = {
	toneDur: number
	, noiseLevel: number
	, noiceDur: number
	, noiseFreq: number
	//, tones: number[][]
	, tones: { frequency: number, volume: number }[]
};
type ClapEngineProps808 = {
	freq: number
	, bursts: number[]
	, qualityFactor: number
	, tail: number
};
type HatEngineProps808 = {
	level: number
	, bandFiFreq: number
	, highFiFreq: number
	, decay: number
	, freqScale: number
	, washVolume: number
};
type CowbellEngineProps808 = {

	bellLevel: number
	, duration: number
	, freqs: number[]
	, bpFilterFreq: number
	, strikeVolume: number
	, qualityFilter: number
};
type TomEngineProps808 = {
	startFreq: number,
	nextFreq: number,
	drop: number,
	duration: number,

	tomwave: string

	, skinLevel: number
	, skinFreq: number
	, skinDur: number

};
type Drum808info = { drumname: string, drumprops: DrumEngineProps808 };
type Snare808info = { snarename: string, snareprops: SnareEngineProps808 };
type Clap808info = { clapname: string, clapprops: ClapEngineProps808 };
type Hat808info = { hatname: string, hatprops: HatEngineProps808 };
type Cowbell808info = { cowbellname: string, cowbellprops: CowbellEngineProps808 };
type Tom808info = { tomname: string, tomprops: TomEngineProps808 };
let drumInfos: Drum808info[] = [
	{ drumname: '808 SUB', drumprops: { startFrequency: 110, nextFrequency: 34, freqChangeDuration: 0.28, duration: 4.5, clickLevel: 0.2, clickWave: 'triangle', driveLevel: 0, clickFrequency: 400, baseWave: 'sine', baselevel: 1 } }
	, { drumname: 'DEEP', drumprops: { startFrequency: 80, nextFrequency: 28, freqChangeDuration: 0.4, duration: 6.0, clickLevel: 0.1, clickWave: 'triangle', driveLevel: 0, clickFrequency: 300, baseWave: 'sine', baselevel: 1 } }
	, { drumname: 'DIRTY', drumprops: { startFrequency: 100, nextFrequency: 32, freqChangeDuration: 0.3, duration: 4.0, clickLevel: 0.2, clickWave: 'triangle', driveLevel: 3, clickFrequency: 400, baseWave: 'sine', baselevel: 0.8 } }
	, { drumname: 'PUNCH', drumprops: { startFrequency: 140, nextFrequency: 40, freqChangeDuration: 0.15, duration: 2.0, clickLevel: 0.3, clickWave: 'square', driveLevel: 0, clickFrequency: 900, baseWave: 'sine', baselevel: 1 } }
];

let kickInfos: Drum808info[] = [
	{ drumname: '808', drumprops: { startFrequency: 160, nextFrequency: 48, freqChangeDuration: 0.09, duration: 0.9, clickLevel: 0.25, driveLevel: 0, baseWave: 'sine', baselevel: 1, clickWave: 'square', clickFrequency: 900 } }
	, { drumname: '707', drumprops: { startFrequency: 190, nextFrequency: 62, freqChangeDuration: 0.05, duration: 0.35, baseWave: 'triangle', clickLevel: 0.3, clickFrequency: 1100, driveLevel: 0, baselevel: 1, clickWave: 'square' } }
	, { drumname: '909', drumprops: { startFrequency: 210, nextFrequency: 52, freqChangeDuration: 0.07, duration: 0.5, driveLevel: 2.2, baselevel: 0.85, clickLevel: 0.35, clickFrequency: 1400, baseWave: 'sine', clickWave: 'square' } }
	, { drumname: 'TIGHT', drumprops: { startFrequency: 170, nextFrequency: 55, freqChangeDuration: 0.04, duration: 0.2, clickLevel: 0.3, driveLevel: 0, baseWave: 'sine', baselevel: 1, clickWave: 'square', clickFrequency: 900 } }
];


let snareInfos: Snare808info[] = [
	{ snarename: 'CRISP', snareprops: { tones: [{ frequency: 185, volume: 0.4 }, { frequency: 330, volume: 0.25 }], toneDur: 0.18, noiseLevel: 0.6, noiseFreq: 1600, noiceDur: 0.28 } }
	, { snarename: 'RIM', snareprops: { tones: [{ frequency: 440, volume: 0.5 }, { frequency: 660, volume: 0.2 }], toneDur: 0.06, noiseLevel: 0.25, noiseFreq: 2400, noiceDur: 0.07 } }
	, { snarename: 'BIG', snareprops: { tones: [{ frequency: 150, volume: 0.45 }, { frequency: 270, volume: 0.3 }], toneDur: 0.4, noiseLevel: 0.55, noiseFreq: 1100, noiceDur: 0.8 } }
	, { snarename: 'NOISE', snareprops: { tones: [{ frequency: 185, volume: 0.15 }], toneDur: 0.1, noiseLevel: 0.8, noiseFreq: 800, noiceDur: 0.5 } }
];


let clapInfos: Clap808info[] = [
	{ clapname: '808', clapprops: { freq: 1200, qualityFactor: 1.5, bursts: [0, 0.011, 0.022], tail: 0.6 } }
	, { clapname: '505', clapprops: { freq: 1600, qualityFactor: 2, bursts: [0, 0.009], tail: 0.2 } }
	, { clapname: 'DOUBLE', clapprops: { freq: 1200, qualityFactor: 1.5, bursts: [0, 0.011, 0.022, 0.09, 0.101], tail: 0.45 } }
	, { clapname: 'ROOM', clapprops: { freq: 1000, qualityFactor: 1, bursts: [0, 0.011, 0.022], tail: 1.0 } }
];


let hatInfos: Hat808info[] = [
	{ hatname: 'LO METAL', hatprops: { freqScale: 0.7, bandFiFreq: 6500, highFiFreq: 4500, level: 0.5, decay: 0.2, washVolume: 0 } }
	, { hatname: 'CLASSIC', hatprops: { level: 0.5, decay: 0.15, washVolume: 0, freqScale: 1, bandFiFreq: 10000, highFiFreq: 7000 } }
	, { hatname: 'HIGH', hatprops: { freqScale: 1.3, level: 0.45, decay: 0.09, washVolume: 0, highFiFreq: 7000, bandFiFreq: 10000 } }
	, { hatname: 'TIGHT', hatprops: { freqScale: 1.6, highFiFreq: 9000, level: 0.4, decay: 0.05, washVolume: 0, bandFiFreq: 10000 } }
];
let ohatInfos: Hat808info[] = [
	{ hatname: 'CRASH', hatprops: { level: 0.5, decay: 2.5, washVolume: 0.3, freqScale: 1, bandFiFreq: 10000, highFiFreq: 7000 } }
	, { hatname: 'LONG', hatprops: { level: 0.45, decay: 1.2, washVolume: 0.0, freqScale: 1, bandFiFreq: 10000, highFiFreq: 7000 } }
	, { hatname: 'MID', hatprops: { level: 0.45, decay: 0.7, washVolume: 0.0, freqScale: 1, bandFiFreq: 10000, highFiFreq: 7000 } }
	, { hatname: 'SHORT', hatprops: { freqScale: 1.3, level: 0.4, decay: 0.35, washVolume: 0.0, bandFiFreq: 10000, highFiFreq: 7000 } }
];


let cowbellInfos: Cowbell808info[] = [
	{ cowbellname: '808', cowbellprops: { freqs: [540, 800], duration: 0.7, bpFilterFreq: 700, qualityFilter: 1.2, bellLevel: 0.45, strikeVolume: 0 } }
	, { cowbellname: 'REAL', cowbellprops: { freqs: [562, 845, 1102, 1460], bpFilterFreq: 1100, qualityFilter: 0.9, bellLevel: 0.3, duration: 0.45, strikeVolume: 0.25 } }
	, { cowbellname: 'LOW', cowbellprops: { freqs: [405, 600], bpFilterFreq: 550, duration: 0.9, qualityFilter: 1.2, bellLevel: 0.45, strikeVolume: 0 } }
	, { cowbellname: 'PING', cowbellprops: { freqs: [880, 1320], bpFilterFreq: 1200, duration: 0.25, bellLevel: 0.35, qualityFilter: 1.2, strikeVolume: 0 } }
];


let tomInfos: Tom808info[] = [
	{ tomname: '808', tomprops: { startFreq: 200, nextFreq: 110, duration: 0.85, skinLevel: 0.15, drop:0.12, tomwave: 'sine', skinFreq: 800, skinDur: 0.05 } }
	, { tomname: 'ELECTRO', tomprops: { startFreq: 300, nextFreq: 90, drop: 0.3, duration: 1.0, tomwave: 'sine', skinFreq: 800, skinDur: 0.05, skinLevel: 0 } }
	, { tomname: 'NATURAL', tomprops: { startFreq: 185, nextFreq: 140, drop: 0.08, tomwave: 'triangle', duration: 0.5, skinLevel: 0.3, skinFreq: 1200, skinDur: 0.08 } }
	, { tomname: 'TIGHT', tomprops: { startFreq: 220, nextFreq: 160, drop: 0.05, duration: 0.25, skinLevel: 0.2, tomwave: 'sine', skinFreq:800, skinDur: 0.05 } }
];





// pitched drum: sine/tri drop + optional drive + optional click
function drumEng(ctx: AudioContext, when: number, out: AudioNode, pitchRatio: number, props: DrumEngineProps808) {
	const baseOscillator = trackSource(ctx.createOscillator());
	const baseGain = ctx.createGain();
	baseOscillator.type = props.baseWave;// || 'sine';
	baseOscillator.frequency.setValueAtTime(props.startFrequency * pitchRatio, when);
	baseOscillator.frequency.exponentialRampToValueAtTime(props.nextFrequency * pitchRatio, when + props.freqChangeDuration);
	//baseGain.gain.setValueAtTime(props.baselevel || 1.0, when);
	baseGain.gain.setValueAtTime(props.baselevel , when);
	baseGain.gain.exponentialRampToValueAtTime(0.0001, when + props.duration);
	if (props.driveLevel) {
		const driveGain = ctx.createGain();
		driveGain.gain.value = props.driveLevel;
		const waveShaper = ctx.createWaveShaper();
		waveShaper.curve = curveArray();//CURVE;
		baseOscillator.connect(driveGain);
		driveGain.connect(waveShaper);
		waveShaper.connect(baseGain);
	} else {
		baseOscillator.connect(baseGain);
	}
	baseGain.connect(out);
	baseOscillator.start(when);
	baseOscillator.stop(when + props.duration + 0.05);
	if (props.clickLevel) {
		const clickOscillator = trackSource(ctx.createOscillator());
		const clickGain = ctx.createGain();
		clickOscillator.type = props.clickWave;// || 'square';
		//clickOscillator.frequency.setValueAtTime((props.clickFrequency || 900) * pitchRatio, when);
		clickOscillator.frequency.setValueAtTime(props.clickFrequency  * pitchRatio, when);
		clickGain.gain.setValueAtTime(props.clickLevel, when);
		clickGain.gain.exponentialRampToValueAtTime(0.0001, when + 0.015);
		clickOscillator.connect(clickGain);
		clickGain.connect(out);
		clickOscillator.start(when);
		clickOscillator.stop(when + 0.03);
	}
}

// snare family: tone pair + filtered noise
function snareEng(ctx: AudioContext, when: number, out: AudioNode, pitchRatio: number, props: SnareEngineProps808) {
	//(props.tones || []).forEach(pair => {
	props.tones .forEach(pair => {
		const osc = trackSource(ctx.createOscillator());
		const baseGain = ctx.createGain();
		osc.type = 'triangle';
		//osc.frequency.setValueAtTime(pair[0] * pitchRatio, when);
		osc.frequency.setValueAtTime(pair.frequency * pitchRatio, when);
		//baseGain.gain.setValueAtTime(pair[1], when);
		baseGain.gain.setValueAtTime(pair.volume, when);
		baseGain.gain.exponentialRampToValueAtTime(0.0001, when + props.toneDur);
		osc.connect(baseGain);
		baseGain.connect(out);
		osc.start(when);
		osc.stop(when + props.toneDur + 0.03);
	});
	if (props.noiseLevel) {
		const noiseSourceBuffer = noiseSrc(ctx);
		const bqFilter = ctx.createBiquadFilter();
		bqFilter.type = 'highpass';
		bqFilter.frequency.value = props.noiseFreq * pitchRatio;
		const noiseGain = ctx.createGain();
		noiseGain.gain.setValueAtTime(props.noiseLevel, when);
		noiseGain.gain.exponentialRampToValueAtTime(0.0001, when + props.noiceDur);
		noiseSourceBuffer.connect(bqFilter);
		bqFilter.connect(noiseGain);
		noiseGain.connect(out);
		noiseSourceBuffer.start(when);
		noiseSourceBuffer.stop(when + props.noiceDur + 0.02);
	}
}

// clap family: noise bursts through a bandpass, then a tail
function clapEng(ctx: AudioContext, when: number, out: AudioNode, pitchRatio: number, props: ClapEngineProps808) {
	const noiseBufferSource = noiseSrc(ctx);
	const biFilter = ctx.createBiquadFilter();
	biFilter.type = 'bandpass';
	biFilter.frequency.value = props.freq * pitchRatio;
	biFilter.Q.value = props.qualityFactor ;//|| 1.5;
	const baseGain = ctx.createGain();
	baseGain.gain.setValueAtTime(0.0001, when);
	props.bursts.forEach(off => {
		baseGain.gain.setValueAtTime(0.9, when + off);
		baseGain.gain.exponentialRampToValueAtTime(0.12, when + off + 0.01);
	});
	const last = props.bursts[props.bursts.length - 1];
	baseGain.gain.setValueAtTime(0.7, when + last + 0.011);
	baseGain.gain.exponentialRampToValueAtTime(0.0001, when + last + props.tail);
	noiseBufferSource.connect(biFilter);
	biFilter.connect(baseGain);
	baseGain.connect(out);
	noiseBufferSource.start(when);
	noiseBufferSource.stop(when + last + props.tail + 0.02);
}

// hat family: six metallic squares + filters, optional noisy crash wash
function hatEng(ctx: AudioContext, when: number, out: AudioNode, pitchRatio: number, props: HatEngineProps808) {
	const freqs = [263, 400, 421, 474, 587, 845];
	const biFilter = ctx.createBiquadFilter();
	biFilter.type = 'bandpass';
	//biFilter.frequency.value = (props.bandFiFreq || 10000) * pitchRatio;
	biFilter.frequency.value = props.bandFiFreq  * pitchRatio;
	biFilter.Q.value = 0.8;
	const hipaFilter = ctx.createBiquadFilter();
	hipaFilter.type = 'highpass';
	//hipaFilter.frequency.value = (props.highFiFreq || 7000) * pitchRatio;
	hipaFilter.frequency.value = props.highFiFreq  * pitchRatio;
	const baseGain = ctx.createGain();
	baseGain.gain.setValueAtTime(props.level, when);
	baseGain.gain.exponentialRampToValueAtTime(0.0001, when + props.decay);
	biFilter.connect(hipaFilter);
	hipaFilter.connect(baseGain);
	baseGain.connect(out);
	freqs.forEach(freqVal => {
		const osc = trackSource(ctx.createOscillator());
		osc.type = 'square';
		//osc.frequency.value = freqVal * (props.freqScale || 1) * pitchRatio;
		osc.frequency.value = freqVal * props.freqScale * pitchRatio;
		osc.connect(biFilter);
		osc.start(when);
		osc.stop(when + props.decay + 0.05);
	});
	if (props.washVolume) {
		const noiseSource = noiseSrc(ctx);
		const washFilter = ctx.createBiquadFilter();
		washFilter.type = 'highpass';
		washFilter.frequency.value = 5000 * pitchRatio;
		const noiseGain = ctx.createGain();
		noiseGain.gain.setValueAtTime(props.washVolume, when);
		noiseGain.gain.exponentialRampToValueAtTime(0.0001, when + props.decay);
		noiseSource.connect(washFilter);
		washFilter.connect(noiseGain);
		noiseGain.connect(out);
		noiseSource.start(when);
		noiseSource.stop(when + props.decay + 0.02);
	}
}

// cowbell family: square partials through a bandpass, optional strike noise
function bellEng(ctx: AudioContext, when: number, out: AudioNode, pitchRatio: number, props: CowbellEngineProps808) {
	props.freqs.forEach(bellFreq => {
		const beep = trackSource(ctx.createOscillator());
		const biFilter = ctx.createBiquadFilter();
		const volumeGain = ctx.createGain();
		beep.type = 'square';
		beep.frequency.value = bellFreq * pitchRatio;
		biFilter.type = 'bandpass';
		//biFilter.frequency.value = (props.bpFilterFreq || 700) * pitchRatio;
		biFilter.frequency.value = props.bpFilterFreq * pitchRatio;
		biFilter.Q.value = props.qualityFilter //|| 1.2;
		//volumeGain.gain.setValueAtTime(props.bellLevel || 0.45, when);
		volumeGain.gain.setValueAtTime(props.bellLevel , when);
		volumeGain.gain.exponentialRampToValueAtTime(0.12, when + 0.03);
		volumeGain.gain.exponentialRampToValueAtTime(0.0001, when + props.duration);
		beep.connect(biFilter);
		biFilter.connect(volumeGain);
		volumeGain.connect(out);
		beep.start(when);
		beep.stop(when + props.duration + 0.05);
	});
	if (props.strikeVolume) {
		const noiseSource = noiseSrc(ctx);
		const passFilter = ctx.createBiquadFilter();
		passFilter.type = 'bandpass';
		passFilter.frequency.value = 2500 * pitchRatio;
		const noiseGain = ctx.createGain();
		noiseGain.gain.setValueAtTime(props.strikeVolume, when);
		noiseGain.gain.exponentialRampToValueAtTime(0.0001, when + 0.03);
		noiseSource.connect(passFilter);
		passFilter.connect(noiseGain);
		noiseGain.connect(out);
		noiseSource.start(when);
		noiseSource.stop(when + 0.05);
	}
}

// tom family: pitched drop + optional "skin" noise attack
function tomEng(ctx: AudioContext, when: number, out: AudioNode, pitchRatio: number, props: TomEngineProps808) {
	const beep = trackSource(ctx.createOscillator());
	const baseGain = ctx.createGain();
	beep.type = props.tomwave ;//|| 'sine';
	beep.frequency.setValueAtTime(props.startFreq * pitchRatio, when);
	//beep.frequency.exponentialRampToValueAtTime(props.nextFreq * pitchRatio, when + (props.drop || 0.12));
	beep.frequency.exponentialRampToValueAtTime(props.nextFreq * pitchRatio, when + props.drop );
	baseGain.gain.setValueAtTime(0.85, when);
	baseGain.gain.exponentialRampToValueAtTime(0.0001, when + props.duration);
	beep.connect(baseGain);
	baseGain.connect(out);
	beep.start(when);
	beep.stop(when + props.duration + 0.05);
	if (props.skinLevel) {
		const noiseSource = noiseSrc(ctx);
		const loFilter = ctx.createBiquadFilter();
		loFilter.type = 'lowpass';
		//loFilter.frequency.value = (props.skinFreq || 800) * pitchRatio;
		loFilter.frequency.value = (props.skinFreq ) * pitchRatio;
		const noiseGain = ctx.createGain();
		noiseGain.gain.setValueAtTime(props.skinLevel, when);
		//noiseGain.gain.exponentialRampToValueAtTime(0.0001, when + (props.skinDur || 0.05));
		noiseGain.gain.exponentialRampToValueAtTime(0.0001, when + props.skinDur);
		noiseSource.connect(loFilter);
		loFilter.connect(noiseGain);
		noiseGain.connect(out);
		noiseSource.start(when);
		//noiseSource.stop(when + (props.skinDur || 0.05) + 0.02);
		noiseSource.stop(when + props.skinDur + 0.02);
	}
}

