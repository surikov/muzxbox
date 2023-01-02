declare namespace Surikov {
    class SurikovEngine {
        constructor();
        version(): string;
        createTester(): LibTester;
        createContext(): void;
    }
}
declare namespace Surikov {
    class LibTester {
        startTest1(): void;
    }
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
declare type MusicOctave = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
declare type MusicStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;
declare type StepShift = -2 | -1 | 0 | 1 | 2;
declare type StepSkip = 1 | 2;
declare type MusicScale = {
    basePitch: number;
    step2: StepSkip;
    step3: StepSkip;
    step4: StepSkip;
    step5: StepSkip;
    step6: StepSkip;
};
declare type MusicNote = {
    step: 1 | 2 | 3 | 4 | 5 | 6 | 7;
    shift: StepShift;
    octave: MusicOctave;
};
declare class MusicScaleMath {
    basePitch: number;
    step2: number;
    step3: number;
    step4: number;
    step5: number;
    step6: number;
    constructor(scale: MusicScale);
    pitch(): number;
}
