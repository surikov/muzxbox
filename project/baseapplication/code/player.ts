declare let pluginListKindUrlName: { kind: string, url: string, functionName: string }[];

function waitForCondition(sleepMs: number, isDone: () => boolean, onFinish: () => void): void {
    if (isDone()) {
        onFinish();
    } else {
        setTimeout(() => {
            waitForCondition(sleepMs, isDone, onFinish);
        }, sleepMs);
    }
}
function appendScriptURL(url: string): void {
    let scripts: HTMLCollectionOf<HTMLScriptElement> = document.getElementsByTagName("script");
    for (let ii = 0; ii < scripts.length; ii++) {
        let script: HTMLScriptElement | null = scripts.item(ii);
        if (script) {
            if (url == (script as any).lockedLoaderURL) {
                return;
            }
        }
    }
    var scriptElement: HTMLScriptElement = document.createElement('script');
    scriptElement.setAttribute("type", "text/javascript");
    scriptElement.setAttribute("src", url);
    (scriptElement as any).lockedLoaderURL = url;
    let head: HTMLHeadElement = document.getElementsByTagName("head")[0];
    head.appendChild(scriptElement);
}
class SchedulePlayer implements MZXBX_Player {
    position: number = 0;
    audioContext: AudioContext;
    schedule: MZXBX_Schedule | null = null;
    performers: { plugin: MZXBX_AudioPerformerPlugin | null, id: string, kind: string }[] = [];
    filters: { plugin: MZXBX_AudioFilterPlugin | null, id: string, kind: string }[] = [];
    pluginsList: { url: string, name: string, kind: string }[];
    stateSetupDone: boolean = false;
    nextAudioContextStart: number = 0;
    currentPosition: number = 0;
    tickDuration = 0.3;
    setup(context: AudioContext, schedule: MZXBX_Schedule): void {
        this.audioContext = context;
        this.schedule = schedule;
        this.stateSetupDone = false;
        this.startSetupPlugins();
    }
    startSetupPlugins() {
        if (this.schedule) {
            for (let ff = 0; ff < this.schedule.filters.length; ff++) {
                let filter: MZXBX_ChannelFilter = this.schedule.filters[ff];
                this.сollectFilterPlugin(filter.id, filter.kind);
            }
            for (let ch = 0; ch < this.schedule.channels.length; ch++) {
                let performer: MZXBX_ChannelPerformer = this.schedule.channels[ch].performer;
                this.сollectPerformerPlugin(performer.id, performer.kind);
                for (let ff = 0; ff < this.schedule.channels[ch].filters.length; ff++) {
                    let filter: MZXBX_ChannelFilter = this.schedule.channels[ch].filters[ff];
                    this.сollectFilterPlugin(filter.id, filter.kind);
                }
            }
        }
        this.startLoadCollectedPlugins();
    }
    сollectFilterPlugin(id: string, kind: string): void {
        for (let ii = 0; ii < this.filters.length; ii++) {
            if (this.filters[ii].id == id) {
                return;
            }
        }
        this.filters.push({ plugin: null, id: id, kind: kind });
    }
    сollectPerformerPlugin(id: string, kind: string): void {
        for (let ii = 0; ii < this.performers.length; ii++) {
            if (this.performers[ii].id == id) {
                return;
            }
        }
        this.performers.push({ plugin: null, id: id, kind: kind });
    }
    findPluginInfo(kind: string): { kind: string, url: string, functionName: string } | null {
        for (let ll = 0; ll < pluginListKindUrlName.length; ll++) {
            if (pluginListKindUrlName[ll].kind == kind) {
                return pluginListKindUrlName[ll];
            }
        }
        console.log('startLoadFilter', kind);
        return null;
    }
    startLoadPluginStarter(kind: string, onDone: (plugin) => void) {
        console.log('startLoadSinglePlugin', kind);
        let tt = this.findPluginInfo(kind);
        if (tt) {
            let info: { kind: string, url: string, functionName: string } = tt;
            appendScriptURL(info.url);
            waitForCondition(250, () => { return (window[info.functionName]); }, () => {
                let exe = window[info.functionName];
                let plugin = exe();
                if (plugin) {
                    onDone(plugin);
                    this.startLoadCollectedPlugins();
                }
            });
        } else {
            console.log('Not found ', kind);
        }
    }
    startLoadCollectedPlugins() {
        for (let ff = 0; ff < this.filters.length; ff++) {
            if (!(this.filters[ff].plugin)) {
                this.startLoadPluginStarter(this.filters[ff].kind, (plugin) => {
                    this.filters[ff].plugin = plugin;
                });
                return;
            }
        }
        for (let pp = 0; pp < this.performers.length; pp++) {
            if (!(this.performers[pp].plugin)) {
                this.startLoadPluginStarter(this.performers[pp].kind, (plugin) => {
                    this.performers[pp].plugin = plugin;
                });
                return;
            }
        }
        this.stateSetupDone = true;
    }
    start(from: number, position: number, to: number): boolean {
        console.log('start', from, position, to);

        return false;
    }
    cancel(): void {

    }

}