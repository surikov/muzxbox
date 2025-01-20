//let  MZXBX_RegisteredPlugins: MZXBX_PluginRegistration[];
declare function MZXBX_currentPlugins(): MZXBX_PluginRegistrationInformation[];
class PluginLoader {
	collectLoadPlugins(schedule: MZXBX_Schedule, filters: MZXBX_FilterHolder[], performers: MZXBX_PerformerHolder[], afterLoad: () => void): null | string {
		for (let ff = 0; ff < schedule.filters.length; ff++) {
			let filter: MZXBX_Filter = schedule.filters[ff];
			this.сollectFilterPlugin(filter.id, filter.kind, filter.properties, filters);
		}
		for (let ch = 0; ch < schedule.channels.length; ch++) {
			let performer: MZXBX_ChannelSource = schedule.channels[ch].performer;
			let chanid = schedule.channels[ch].id;
			//this.сollectPerformerPlugin(performer.id, performer.kind, performer.properties, performers);
			this.сollectPerformerPlugin(chanid, performer.kind, performer.properties, performers);
			/*for (let ff = 0; ff < schedule.channels[ch].filters.length; ff++) {
				let filter: MZXBX_ChannelFilter = schedule.channels[ch].filters[ff];
				this.сollectFilterPlugin(filter.id, filter.kind, filter.properties, filters);
			}*/
		}
		let result = this.startLoadCollectedPlugins(filters, performers, afterLoad);
		return result;
	}
	startLoadCollectedPlugins(filters: MZXBX_FilterHolder[], performers: MZXBX_PerformerHolder[], afterLoad: () => void): null | string {
		//console.log('startLoadCollectedPlugins',filters,performers);
		for (let ff = 0; ff < filters.length; ff++) {
			//console.log('check filter',filters[ff]);
			if (!(filters[ff].plugin)) {
				let result = this.startLoadPluginStarter(filters[ff].kind, filters, performers, (plugin) => {

					filters[ff].plugin = plugin;
					//console.log('assign filter', ff, plugin);
				}, afterLoad);
				if (result != null) {
					return result;
				}
				//return 'No filtert ' + filters[ff].filterId;
			}
		}
		for (let pp = 0; pp < performers.length; pp++) {
			//console.log('check performer',performers[pp]);
			if (!(performers[pp].plugin)) {
				let result = this.startLoadPluginStarter(performers[pp].kind, filters, performers, (plugin) => {

					performers[pp].plugin = plugin;
					//console.log('assign performer', pp, performers[pp]);
				}, afterLoad);
				//return 'No performer ' + performers[pp].channelId;
				if (result != null) {
					return result;
				}
			}
		}
		//this.stateSetupDone = true;
		afterLoad();
		return null;
	}

	startLoadPluginStarter(kind: string, filters: MZXBX_FilterHolder[], performers: MZXBX_PerformerHolder[]
		, onDone: (plugin) => void
		, afterLoad: () => void
	): null | string {
		//console.log('startLoadSinglePlugin', kind);
		let tt: MZXBX_PluginRegistrationInformation | null = this.findPluginInfo(kind);
		if (tt) {
			let info: MZXBX_PluginRegistrationInformation = tt;
			//console.log('wait',info);
			MZXBX_appendScriptURL(info.script);
			MZXBX_waitForCondition(250, () => {

				return (window[info.evaluate]);
			}, () => {
				let exe = window[info.evaluate];
				let plugin = exe();
				//console.log(plugin);
				if (plugin) {
					onDone(plugin);
					this.startLoadCollectedPlugins(filters, performers, afterLoad);
				}
			});
			return null;
		} else {
			console.log('Not found registration for', kind);
			return 'Not found registration for ' + kind;
		}
	}

	сollectFilterPlugin(id: string, kind: string, properties: string, filters: MZXBX_FilterHolder[]): void {
		for (let ii = 0; ii < filters.length; ii++) {
			if (filters[ii].filterId == id) {
				filters[ii].properties = properties;
				return;
			}
		}
		filters.push({ plugin: null, filterId: id, kind: kind, properties: properties, launched: false });
	}
	сollectPerformerPlugin(id: string, kind: string, properties: string, performers: MZXBX_PerformerHolder[]): void {
		//console.log('сollectPerformerPlugin id:', id, 'kind', kind);
		for (let ii = 0; ii < performers.length; ii++) {
			if (performers[ii].channelId == id) {
				performers[ii].properties = properties;
				return;
			}
		}
		performers.push({ plugin: null, channelId: id, kind: kind, properties: properties, launched: false });
	}
	findPluginInfo(kind: string): MZXBX_PluginRegistrationInformation | null {
		for (let ll = 0; ll < MZXBX_currentPlugins().length; ll++) {
			if (MZXBX_currentPlugins()[ll].kind == kind) {
				return MZXBX_currentPlugins()[ll];
			}
		}
		//console.log('startLoadFilter', kind);
		return null;
	}
}
