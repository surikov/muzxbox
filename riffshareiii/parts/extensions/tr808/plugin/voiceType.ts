
type DrumEngineProps808 = {
	startFrequency: number
	, nextFrequency: number
	, freqChangeDuration: number
	, duration: number
	, clickLevel: number
	, clickWave: string
	, clickFrequency: number
	, driveLevel: number
	, baseWave: string
	, baselevel: number
};
type SnareEngineProps808 = {
	toneDur: number
	, noiseLevel: number
	, noiceDur: number
	, noiseFreq: number
	, tones: {
		frequency: number
		, volume: number
	}[]
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
	startFreq: number
	, nextFreq: number
	, drop: number
	, duration: number
	, tomwave: string
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

type DrumCache = {
	kind: number;
	drum: BoomDrum;
};
type BoomDrum = {
	start: (when: number, pitchRatio: number, propertyId: number) => void;
	cancel: () => void;
	duration: () => number;
	endTime: () => number;
	output: () => AudioNode;
};
type BoomParameters = {
	volume: number
	, ratio: number
	, nn: number
};