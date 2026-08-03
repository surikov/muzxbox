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
type SnareEngineProps808 = {
    toneDur: number;
    noise: number;
    nDur: number;
    nFreq: number;
    tones: number[][];
};
type ClapEngineProps808 = {
    freq: number;
    bursts: number[];
    q: number;
    tail: number;
};
type HatEngineProps808 = {
    level: number;
    bpF: number;
    hpF: number;
    decay: number;
    fScale: number;
    wash: number;
};
type CowbellEngineProps808 = {
    level: number;
    dur: number;
    freqs: number[];
    bpF: number;
    strike: number;
    q: number;
};
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
declare function drumEng(ctx: AudioContext, when: number, out: AudioNode, p: number, o: DrumEngineProps808): void;
declare function snareEng(ctx: AudioContext, when: number, out: AudioNode, p: number, o: SnareEngineProps808): void;
declare function clapEng(ctx: AudioContext, when: number, out: AudioNode, p: number, o: ClapEngineProps808): void;
declare function hatEng(ctx: AudioContext, when: number, out: AudioNode, p: number, o: HatEngineProps808): void;
declare function bellEng(ctx: AudioContext, when: number, out: AudioNode, p: number, o: CowbellEngineProps808): void;
declare function tomEng(ctx: AudioContext, when: number, out: AudioNode, p: number, o: TomEngineProps808): void;
