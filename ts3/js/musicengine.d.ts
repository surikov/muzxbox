declare class SurikovEngine {
    tester: LibTester;
    constructor();
    version(): string;
    createContext(): void;
}
declare class LibTester {
    startTest1(): void;
}
declare type MusicMetre = {
    count: number;
    part: number;
};
declare function MMM(metre: MusicMetre): MusicMetreMath;
declare class MusicMetreMath {
    count: number;
    part: number;
    constructor(from: MusicMetre);
    metre(): MusicMetre;
}
