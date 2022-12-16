declare class SurikovEngine {
    tester: LibTester;
    constructor();
    version(): string;
    createContext(): void;
}
declare class LibTester {
    startTest1(): void;
}
declare namespace Surikov {
    type Metre = {
        count: number;
        part: number;
    };
    class MusicMetreMath {
        count: number;
        part: number;
        constructor(from: Metre);
        metre(): Metre;
        simplyfy(): MusicMetreMath;
        strip(toPart: number): MusicMetreMath;
        equals(metre: Metre): boolean;
        less(metre: Metre): boolean;
        more(metre: Metre): boolean;
        plus(metre: Metre): MusicMetreMath;
        minus(metre: Metre): MusicMetreMath;
        duration(metre: Metre, tempo: number): number;
    }
}
declare type MusicScale = {
    basePitch: number;
};
declare class MusicScaleMath {
}
