//let  MZXBX_RegisteredPlugins: MZXBX_PluginRegistration[];
declare function MZXBX_currentPlugins(): MZXBX_PluginRegistrationInformation[];
class PluginLoader {
	collectLoadPlugins(schedule: MZXBX_Schedule, filters: MZXBX_FilterHolder[], performers: MZXBX_PerformerHolder[], afterLoad: () => void) {
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
		this.startLoadCollectedPlugins(filters, performers, afterLoad);
	}
	startLoadCollectedPlugins(filters: MZXBX_FilterHolder[], performers: MZXBX_PerformerHolder[], afterLoad: () => void) {
		//console.log('startLoadCollectedPlugins');
		for (let ff = 0; ff < filters.length; ff++) {
			//console.log('check filter',filters[ff]);
			if (!(filters[ff].plugin)) {
				this.startLoadPluginStarter(filters[ff].kind, filters, performers, (plugin) => {
					//console.log('assign filter',ff,plugin);
					filters[ff].plugin = plugin;
				}, afterLoad);
				return;
			}
		}
		for (let pp = 0; pp < performers.length; pp++) {
			//console.log('check performer',performers[pp]);
			if (!(performers[pp].plugin)) {
				this.startLoadPluginStarter(performers[pp].kind, filters, performers, (plugin) => {
					//console.log('assign performer',pp,plugin);
					performers[pp].plugin = plugin;
				}, afterLoad);
				return;
			}
		}
		//this.stateSetupDone = true;
		afterLoad();
	}
	startLoadPluginStarter(kind: MZXBX_PluginKind, filters: MZXBX_FilterHolder[], performers: MZXBX_PerformerHolder[], onDone: (plugin) => void, afterLoad: () => void) {
		//console.log('startLoadSinglePlugin', kind);
		let tt = this.findPluginInfo(kind);
		if (tt) {
			let info: MZXBX_PluginRegistrationInformation = tt;
			//console.log('wait',info);
			MZXBX_appendScriptURL(info.url);
			MZXBX_waitForCondition(250, () => { return (window[info.evaluate]); }, () => {
				let exe = window[info.evaluate];
				let plugin = exe();
				//console.log(plugin);
				if (plugin) {
					onDone(plugin);
					this.startLoadCollectedPlugins(filters, performers, afterLoad);
				}
			});
		} else {
			console.log('Not found ', kind);
		}
	}
	
	сollectFilterPlugin(id: string, kind: MZXBX_PluginKind, properties: string, filters: MZXBX_FilterHolder[]): void {
		for (let ii = 0; ii < filters.length; ii++) {
			if (filters[ii].id == id) {
				filters[ii].properties = properties;
				return;
			}
		}
		filters.push({ plugin: null, id: id, kind: kind, properties: properties, launched: false });
	}
	сollectPerformerPlugin(id: string, kind: MZXBX_PluginKind, properties: string, performers: MZXBX_PerformerHolder[]): void {
		//console.log('сollectPerformerPlugin',id,kind);
		for (let ii = 0; ii < performers.length; ii++) {
			if (performers[ii].id == id) {
				performers[ii].properties = properties;
				return;
			}
		}
		performers.push({ plugin: null, id: id, kind: kind, properties: properties, launched: false });
	}
	findPluginInfo(kind: MZXBX_PluginKind): MZXBX_PluginRegistrationInformation | null {
		for (let ll = 0; ll < MZXBX_currentPlugins().length; ll++) {
			if (MZXBX_currentPlugins()[ll].kind == kind) {
				return MZXBX_currentPlugins()[ll];
			}
		}
		//console.log('startLoadFilter', kind);
		return null;
	}
}
