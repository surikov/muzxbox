console.log("MuzXbox v1.0.1");
class MuzXbox {
  uiStarted: boolean = false;
  constructor() {
    this.initAfterLoad();
  }
  initAfterLoad() {
    console.log("MuzXbox loaded");
  }
  initFromUI() {
    if (this.uiStarted) {
      console.log("skip initFromUI");
    } else {
      console.log("start initFromUI");
      this.initAudioContext();
    }
  }
  initAudioContext() {
    this.uiStarted = true;
  }
}
