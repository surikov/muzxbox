
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
	{ tomname: '808', tomprops: { startFreq: 200, nextFreq: 110, duration: 0.85, skinLevel: 0.15, drop: 0.12, tomwave: 'sine', skinFreq: 800, skinDur: 0.05 } }
	, { tomname: 'ELECTRO', tomprops: { startFreq: 300, nextFreq: 90, drop: 0.3, duration: 1.0, tomwave: 'sine', skinFreq: 800, skinDur: 0.05, skinLevel: 0 } }
	, { tomname: 'NATURAL', tomprops: { startFreq: 185, nextFreq: 140, drop: 0.08, tomwave: 'triangle', duration: 0.5, skinLevel: 0.3, skinFreq: 1200, skinDur: 0.08 } }
	, { tomname: 'TIGHT', tomprops: { startFreq: 220, nextFreq: 160, drop: 0.05, duration: 0.25, skinLevel: 0.2, tomwave: 'sine', skinFreq: 800, skinDur: 0.05 } }
];

