console.log("MuzXbox v1.0.1");
class MuzXbox {
    uiStarted: boolean = false;
    audioContext: AudioContext;
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
        let AudioContextFunc = (window as any).AudioContext || (window as any).webkitAudioContext;
        this.audioContext = new AudioContextFunc();
        console.log(this.audioContext);
        if (this.audioContext.state == "running") {
            this.uiStarted = true;
        }
    }
}
class SchedulePlayer implements MZXBX_Player {
    position: number = 0;
    audioContext: AudioContext;
    schedule: MZXBX_Schedule;
    performers: { plugin: MZXBX_AudioPerformerPlugin, id: string }[];
    filters: { plugin: MZXBX_AudioFilterPlugin, id: string }[];
    setup(context: AudioContext, schedule: MZXBX_Schedule) {
        this.audioContext = context;
        this.schedule = schedule;
        this.initPlugins();
        return true;
    }
    initPlugins() {
        this.performers = [];
        this.filters = [];
        for (let ff = 0; ff < this.schedule.filters.length; ff++) {
            this.collectFilterPlugin(this.schedule.filters[ff].id, this.schedule.filters[ff].kind);
        }
        for (let ch = 0; ch < this.schedule.channels.length; ch++) {
            this.collectPerformerPlugin(this.schedule.channels[ch].performer.id, this.schedule.channels[ch].performer.kind);
            for (let ff = 0; ff < this.schedule.channels[ch].filters.length; ff++) {
                this.collectFilterPlugin(this.schedule.channels[ch].filters[ff].id, this.schedule.channels[ch].filters[ff].kind);
            }
        }
    }
    collectFilterPlugin(id: string, kind: string): void {

    }
    collectPerformerPlugin(id: string, kind: string): void {

    }
    start(from: number, position: number, to: number): boolean {
        return false;
    }
    cancel(): void {

    }
    
}
