class PluginLoader {
    collectLoadPlugins(schedule: MZXBX_Schedule, filters: FilterHolder[], performers: PerformerHolder[],afterLoad:()=>void) {
        for (let ff = 0; ff < schedule.filters.length; ff++) {
            let filter: MZXBX_ChannelFilter = schedule.filters[ff];
            this.сollectFilterPlugin(filter.id, filter.kind, filter.properties, filters);
        }
        for (let ch = 0; ch < schedule.channels.length; ch++) {
            let performer: MZXBX_ChannelPerformer = schedule.channels[ch].performer;
            this.сollectPerformerPlugin(performer.id, performer.kind, performer.properties, performers);
            for (let ff = 0; ff < schedule.channels[ch].filters.length; ff++) {
                let filter: MZXBX_ChannelFilter = schedule.channels[ch].filters[ff];
                this.сollectFilterPlugin(filter.id, filter.kind, filter.properties, filters);
            }
        }
        this.startLoadCollectedPlugins(filters, performers,afterLoad);
    }
    startLoadCollectedPlugins(filters: FilterHolder[], performers: PerformerHolder[],afterLoad:()=>void) {
        //console.log('startLoadCollectedPlugins');
        for (let ff = 0; ff < filters.length; ff++) {
            //console.log('check filter',filters[ff]);
            if (!(filters[ff].plugin)) {
                this.startLoadPluginStarter(filters[ff].kind, filters, performers, (plugin) => {
                    //console.log('assign filter',ff,plugin);
                    filters[ff].plugin = plugin;
                },afterLoad);
                return;
            }
        }
        for (let pp = 0; pp < performers.length; pp++) {
            //console.log('check performer',performers[pp]);
            if (!(performers[pp].plugin)) {
                this.startLoadPluginStarter(performers[pp].kind, filters, performers, (plugin) => {
                    //console.log('assign performer',pp,plugin);
                    performers[pp].plugin = plugin;
                },afterLoad);
                return;
            }
        }
        //this.stateSetupDone = true;
        afterLoad();
    }
    startLoadPluginStarter(kind: string, filters: FilterHolder[], performers: PerformerHolder[], onDone: (plugin) => void,afterLoad:()=>void) {
        //console.log('startLoadSinglePlugin', kind);
        let tt = this.findPluginInfo(kind);
        if (tt) {
            let info: { kind: string, url: string, functionName: string } = tt;
            appendScriptURL(info.url);
            waitForCondition(250, () => { return (window[info.functionName]); }, () => {
                let exe = window[info.functionName];
                let plugin = exe();
                if (plugin) {
                    onDone(plugin);
                    this.startLoadCollectedPlugins(filters, performers,afterLoad);
                }
            });
        } else {
            console.log('Not found ', kind);
        }
    }
    сollectFilterPlugin(id: string, kind: string, properties: string, filters: FilterHolder[]): void {
        for (let ii = 0; ii < filters.length; ii++) {
            if (filters[ii].id == id) {
                return;
            }
        }
        filters.push({ plugin: null, id: id, kind: kind, properties: properties });
    }
    сollectPerformerPlugin(id: string, kind: string, properties: string, performers: PerformerHolder[]): void {
        for (let ii = 0; ii < performers.length; ii++) {
            if (performers[ii].id == id) {
                return;
            }
        }
        performers.push({ plugin: null, id: id, kind: kind, properties: properties });
    }
    findPluginInfo(kind: string): { kind: string, url: string, functionName: string } | null {
        for (let ll = 0; ll < pluginListKindUrlName.length; ll++) {
            if (pluginListKindUrlName[ll].kind == kind) {
                return pluginListKindUrlName[ll];
            }
        }
        //console.log('startLoadFilter', kind);
        return null;
    }
}
