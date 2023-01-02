type MusicMetre = {
  count: number;
  part: number;
};
interface MusicMetreMathType {
  count: number;
  part: number;
  set(from: MusicMetre): MusicMetreMathType;
  metre(): MusicMetre;
  simplyfy(): MusicMetreMathType;
  strip(toPart: number): MusicMetreMathType;
  equals(metre: MusicMetre): boolean;
  less(metre: MusicMetre): boolean;
  more(metre: MusicMetre): boolean;
  plus(metre: MusicMetre): MusicMetreMathType;
  minus(metre: MusicMetre): MusicMetreMathType;
  duration(metre: MusicMetre, tempo: number): number;
}
type MusicOctave = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type MusicStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;
type StepShift = -2 | -1 | 0 | 1 | 2;
type StepSkip = 1 | 2;
type MusicScale = {
  basePitch: number;
  step2: StepSkip;
  step3: StepSkip;
  step4: StepSkip;
  step5: StepSkip;
  step6: StepSkip;
  step7: StepSkip;
};
type MusicNote = {
  step: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  shift: StepShift;
  octave: MusicOctave;
};
interface MusicScaleMathType {
  basePitch: number;
  step2: StepSkip;
  step3: StepSkip;
  step4: StepSkip;
  step5: StepSkip;
  step6: StepSkip;
  step7: StepSkip;
  set(scale: MusicScale): MusicScaleMath;
  scale(): MusicScale;
  pitch(musicNote: MusicNote): number;
}
type MusicTrack = {
  title: string;
};
type MusicProject = {
  title: string;
  timeline: MusicMetre[];
  tracks: MusicTrack[];
};
