declare function startTest(): void;
declare const NOISE_SECONDS = 2;
declare const NOISE_DATA: Float32Array<ArrayBuffer>;
declare function fillFrom(dst: any, src: any): void;
declare function noiseBuf(ac: AudioContext): AudioBuffer;
declare function noiseSrc(ac: AudioContext): AudioBufferSourceNode;
declare const CURVE: Float32Array<ArrayBuffer>;
declare function trackSource(node: any): any;
type DrumEngineProps808 = {
    f0: number;
    f1: number;
    drop: number;
    dur: number;
    click: number;
    clickWave: string;
    clickF: number;
    drive: number;
    wave: string;
    level: number;
};
type Drum808info = {
    drumname: string;
    drumprops: DrumEngineProps808;
};
declare let drumInfos: Drum808info[];
type SnareEngineProps808 = {
    toneDur: number;
    noise: number;
    nDur: number;
    nFreq: number;
    tones: number[][];
};
type Snare808info = {
    snarename: string;
    snareprops: SnareEngineProps808;
};
declare let snareInfos: Snare808info[];
type ClapEngineProps808 = {
    freq: number;
    bursts: number[];
    q: number;
    tail: number;
};
type Clap808info = {
    clapname: string;
    clapprops: ClapEngineProps808;
};
declare let clapInfos: Clap808info[];
declare function drumEng(ctx: AudioContext, t: number, out: AudioNode, p: number, o: DrumEngineProps808): void;
declare function snareEng(ctx: AudioContext, t: number, out: AudioNode, p: number, o: SnareEngineProps808): void;
declare function clapEng(ctx: AudioContext, t: number, out: AudioNode, p: number, o: ClapEngineProps808): void;
type HatEngineProps808 = {
    level: number;
    bpF: number;
    hpF: number;
    decay: number;
    fScale: number;
    wash: number;
};
declare function hatEng(ctx: AudioContext, t: number, out: AudioNode, p: number, o: HatEngineProps808): void;
type CowbellEngineProps808 = {
    level: number;
    dur: number;
    freqs: number[];
    bpF: number;
    strike: number;
    q: number;
};
declare function bellEng(ctx: AudioContext, t: number, out: AudioNode, p: number, o: CowbellEngineProps808): void;
type TomEngineProps808 = {
    f0: number;
    f1: number;
    drop: number;
    dur: number;
    wave: string;
    skin: number;
    skinF: number;
    skinDur: number;
};
declare function tomEng(ctx: AudioContext, t: number, out: AudioNode, p: number, o: TomEngineProps808): void;
