class MusicScaleMath implements MusicScaleMathType {
  basePitch: number;
  step2: StepSkip;
  step3: StepSkip;
  step4: StepSkip;
  step5: StepSkip;
  step6: StepSkip;
  step7: StepSkip;
  set(scale: MusicScale): MusicScaleMath {
    this.basePitch = scale.basePitch;
    this.step2 = scale.step2;
    this.step3 = scale.step3;
    this.step4 = scale.step4;
    this.step5 = scale.step5;
    this.step6 = scale.step6;
    this.step7 = scale.step7;
    return this;
  }
  scale(): MusicScale {
    return {
      basePitch: this.basePitch,
      step2: this.step2,
      step3: this.step3,
      step4: this.step4,
      step5: this.step5,
      step6: this.step6,
      step7: this.step7,
    };
  }
  pitch(note: MusicNote): number {
    let pp = this.basePitch + 12 * note.octave;
    switch (note.step) {
      case 1: {
        break;
      }
      case 2: {
        pp = pp + this.step2;
        break;
      }
      case 3: {
        pp = pp + this.step2 + this.step3;
        break;
      }
      case 4: {
        pp = pp + this.step2 + this.step3 + this.step4;
        break;
      }
      case 5: {
        pp = pp + this.step2 + this.step3 + this.step4 + this.step5;
        break;
      }
      case 6: {
        pp =
          pp + this.step2 + this.step3 + this.step4 + this.step5 + this.step6;
        break;
      }
      case 7: {
        pp =
          pp +
          this.step2 +
          this.step3 +
          this.step4 +
          this.step5 +
          this.step6 +
          this.step7;
        break;
      }
    }
    pp = pp + note.shift;
    return 0;
  }
}
