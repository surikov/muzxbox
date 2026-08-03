declare function startTest(): void;
declare const NOISE_SECONDS = 2;
declare const NOISE_DATA: Float32Array<ArrayBuffer>;
declare function fillFrom(dst: any, src: any): void;
declare function noiseBuf(ac: AudioContext): AudioBuffer;
declare function noiseSrc(ac: AudioContext): AudioBufferSourceNode;
declare function curveArray(): Float32Array;
declare function trackSource(node: any): any;
type DrumEngineProps808 = {
    startFrequency: number;
    nextFrequency: number;
    freqChangeDuration: number;
    duration: number;
    clickLevel: number;
    clickWave: string;
    clickFrequency: number;
    driveLevel: number;
    baseWave: string;
    baselevel: number;
};
type SnareEngineProps808 = {
    toneDur: number;
    noiseLevel: number;
    noiceDur: number;
    noiseFreq: number;
    tones: {
        frequency: number;
        volume: number;
    }[];
};
type ClapEngineProps808 = {
    freq: number;
    bursts: number[];
    qualityFactor: number;
    tail: number;
};
type HatEngineProps808 = {
    level: number;
    bandFiFreq: number;
    highFiFreq: number;
    decay: number;
    freqScale: number;
    washVolume: number;
};
type CowbellEngineProps808 = {
    bellLevel: number;
    duration: number;
    freqs: number[];
    bpFilterFreq: number;
    strikeVolume: number;
    qualityFilter: number;
};
type TomEngineProps808 = {
    startFreq: number;
    nextFreq: number;
    drop: number;
    duration: number;
    tomwave: string;
    skinLevel: number;
    skinFreq: number;
    skinDur: number;
};
type Drum808info = {
    drumname: string;
    drumprops: DrumEngineProps808;
};
type Snare808info = {
    snarename: string;
    snareprops: SnareEngineProps808;
};
type Clap808info = {
    clapname: string;
    clapprops: ClapEngineProps808;
};
type Hat808info = {
    hatname: string;
    hatprops: HatEngineProps808;
};
type Cowbell808info = {
    cowbellname: string;
    cowbellprops: CowbellEngineProps808;
};
type Tom808info = {
    tomname: string;
    tomprops: TomEngineProps808;
};
declare let drumInfos: Drum808info[];
declare let kickInfos: Drum808info[];
declare let snareInfos: Snare808info[];
declare let clapInfos: Clap808info[];
declare let hatInfos: Hat808info[];
declare let ohatInfos: Hat808info[];
declare let cowbellInfos: Cowbell808info[];
declare let tomInfos: Tom808info[];
declare function drumEng(ctx: AudioContext, when: number, out: AudioNode, pitchRatio: number, props: DrumEngineProps808): void;
declare function snareEng(ctx: AudioContext, when: number, out: AudioNode, pitchRatio: number, props: SnareEngineProps808): void;
declare function clapEng(ctx: AudioContext, when: number, out: AudioNode, pitchRatio: number, props: ClapEngineProps808): void;
declare function hatEng(ctx: AudioContext, when: number, out: AudioNode, pitchRatio: number, props: HatEngineProps808): void;
declare function bellEng(ctx: AudioContext, when: number, out: AudioNode, pitchRatio: number, props: CowbellEngineProps808): void;
declare function tomEng(ctx: AudioContext, when: number, out: AudioNode, pitchRatio: number, props: TomEngineProps808): void;
