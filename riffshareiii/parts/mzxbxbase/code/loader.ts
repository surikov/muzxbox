declare function MZXBX_currentPlugins(): MZXBX_PluginRegistrationInformation[];
class PluginLoader {
	collectLoadPlugins(schedule: MZXBX_Schedule, allfilters: MZXBX_FilterHolder[], allperformers: MZXBX_PerformerSamplerHolder[]): null | string {
		
		for (let ff = 0; ff < schedule.filters.length; ff++) {
			let filter: MZXBX_Filter = schedule.filters[ff];
			this.сollectFilterPlugin(filter.id, filter.kind, filter.properties,filter.description, allfilters);
		}
		for (let ch = 0; ch < schedule.channels.length; ch++) {
			let performer: MZXBX_ChannelSource = schedule.channels[ch].performer;
			let chanid = schedule.channels[ch].id;
			this.сollectPerformerPlugin(chanid, performer.kind, performer.properties, performer.description,allperformers);
		}
		let result = this.startLoadCollectedPlugins(allfilters, allperformers);
		//afterStart();
		return result;
	}
	startLoadCollectedPlugins(filters: MZXBX_FilterHolder[], performers: MZXBX_PerformerSamplerHolder[]): null | string {
		for (let ff = 0; ff < filters.length; ff++) {
			if (!(filters[ff].pluginAudioFilter)) {
				let result = this.startLoadPluginStarter(filters[ff].kind, filters, performers
					, (plugin) => {
						filters[ff].pluginAudioFilter = plugin;
					});
				if (result != null) {
					return result;
				}
			}
		}
		for (let pp = 0; pp < performers.length; pp++) {
			if (!(performers[pp].plugin)) {
				let result = this.startLoadPluginStarter(performers[pp].kind, filters, performers
					, (plugin) => {
						performers[pp].plugin = plugin;
					});
				if (result != null) {
					return result;
				}
			}
		}
		
		return null;
	}

	startLoadPluginStarter(kind: string, filters: MZXBX_FilterHolder[], performers: MZXBX_PerformerSamplerHolder[], onDone: (plugin) => void): null | string {
		let tt: MZXBX_PluginRegistrationInformation | null = this.findPluginInfo(kind);
		if (tt) {
			let info: MZXBX_PluginRegistrationInformation = tt;
			//console.log(info);
			MZXBX_appendScriptURL(info.script);
			MZXBX_waitForCondition(250
				, () => {
					//console.log('check evaluate',Math.random(),info);
					return (window[info.evaluate]);
				}
				, () => {
					//console.log('exe',info);
					let exe = window[info.evaluate];
					let plugin = exe();
					if (plugin) {
						onDone(plugin);
						this.startLoadCollectedPlugins(filters, performers);
					}
				});
			return null;
		} else {
			console.log('Not found registration for', kind);
			return 'Not found registration for ' + kind;
		}
	}
	сollectFilterPlugin(id: string, kind: string, properties: string, description: string, filters: MZXBX_FilterHolder[]): void {
		for (let ii = 0; ii < filters.length; ii++) {
			if (filters[ii].filterId == id) {
				filters[ii].properties = properties;
				return;
			}
		}
		filters.push({ pluginAudioFilter: null, filterId: id, kind: kind, properties: properties ,description:description});
	}
	сollectPerformerPlugin(id: string, kind: string, properties: string, description: string, performers: MZXBX_PerformerSamplerHolder[]): void {
		for (let ii = 0; ii < performers.length; ii++) {
			if (performers[ii].channelId == id) {
				performers[ii].properties = properties;
				return;
			}
		}
		performers.push({ plugin: null, channelId: id, kind: kind, properties: properties ,description:description});
	}
	findPluginInfo(kind: string): MZXBX_PluginRegistrationInformation | null {
		for (let ll = 0; ll < MZXBX_currentPlugins().length; ll++) {
			if (MZXBX_currentPlugins()[ll].kind == kind) {
				return MZXBX_currentPlugins()[ll];
			}
		}
		return null;
	}
}
