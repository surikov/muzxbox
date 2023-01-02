type MusicOctave = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8|9;
type MusicStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 ;
type StepShift = -2 | -1 | 0 | 1 | 2;
type StepSkip = 1 | 2;
type MusicScale = {
  basePitch: number;
  step2: StepSkip;
  step3: StepSkip;
  step4: StepSkip;
  step5: StepSkip;
  step6: StepSkip;
};
type MusicNote = {
  step: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  shift: StepShift;
  octave: MusicOctave;
};
class MusicScaleMath {
  basePitch: number;
  step2: number;
  step3: number;
  step4: number;
  step5: number;
  step6: number;
  constructor(scale: MusicScale) {}
  pitch(): number {
    return 0;
  }
}
