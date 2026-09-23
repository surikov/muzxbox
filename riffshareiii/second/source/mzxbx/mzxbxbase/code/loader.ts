declare function MZXBX_currentPlugins(): MZXBX_PluginRegistrationInformation[];
class PluginLoader {
	collectLoadPlugins(schedule: MZXBX_Schedule, allfilters: MZXBX_FilterHolder[], allperformers: MZXBX_PerformerSamplerHolder[]): null | string {

		for (let ff = 0; ff < schedule.filters.length; ff++) {
			let filter: MZXBX_Filter = schedule.filters[ff];
			//console.log('collectFilterPlugin',filter.id);
			this.collectFilterPlugin(filter.id, filter.kind, filter.properties, filter.description, allfilters);
		}

		for (let ch = 0; ch < schedule.channels.length; ch++) {
			let performer: MZXBX_ChannelSource = schedule.channels[ch].performer;
			//let chanid = schedule.channels[ch].id;
			//console.log('collectPerformerPlugin', schedule.channels[ch]);
			this.collectPerformerPlugin(schedule.channels[ch], performer.kind, performer.properties, performer.description, allperformers);
		}
		//console.log('startLoadCollectedPlugins',allfilters, allperformers);
		let result = this.startLoadCollectedPlugins(allfilters, allperformers);
		//afterStart();
		return result;
	}
	startLoadCollectedPlugins(filters: MZXBX_FilterHolder[], performers: MZXBX_PerformerSamplerHolder[]): null | string {
		//console.log('startLoadCollectedPlugins');
		for (let ff = 0; ff < filters.length; ff++) {
			//console.log('filter', ff, filters[ff].kind);
			if (!(filters[ff].pluginAudioFilter)) {
				let result = this.startLoadPluginStarter(filters[ff].kind//, filters, performers
					, (exeName: string) => {
						if (filters[ff].pluginAudioFilter) {
							//console.log('skip', filters[ff]);
						} else {
							//console.log('new', filters[ff]);
							let exe = window[exeName];
							let plugin = exe();
							if (plugin) {
								filters[ff].pluginAudioFilter = plugin;
								//this.startLoadCollectedPlugins(filters, performers);
							} else {
								//console.log('no', filters[ff]);
							}
						}
					});
				if (result != null) {
					return result;
				}
			} else {
				//console.log('skip filter', ff, filters[ff].kind);
			}
		}
		//console.log('startLoadCollectedPlugins samplers/performers');
		for (let pp = 0; pp < performers.length; pp++) {
			//console.log('performer', pp, performers[pp].kind);
			if (!(performers[pp].pluginPerformerSampler)) {
				let result = this.startLoadPluginStarter(performers[pp].kind//, filters, performers
					//, (plugin) => {
					//	performers[pp].pluginPerformerSampler = plugin;
					//});
					, (exeName: string) => {
						if (performers[pp].pluginPerformerSampler) {
							//console.log('skip', performers[pp]);
						} else {
							//console.log('new', performers[pp]);
							let exe = window[exeName];
							let plugin = exe();
							if (plugin) {
								performers[pp].pluginPerformerSampler = plugin;
								//this.startLoadCollectedPlugins(filters, performers);
							} else {
								console.log('no', performers[pp]);
							}
						}
					});
				if (result != null) {
					return result;
				}
			} else {
				//console.log('skip performer', pp, performers[pp].kind);
			}
		}

		return null;
	}

	startLoadPluginStarter(kind: string
		//holder: MZXBX_FilterHolder | MZXBX_PerformerSamplerHolder
		//, filters: MZXBX_FilterHolder[], performers: MZXBX_PerformerSamplerHolder[]
		, onDone: (exeName: string) => void
	): null | string {

		let tt: MZXBX_PluginRegistrationInformation | null = this.findPluginInfo(kind);

		if (tt) {
			//console.log('startLoadPluginStarter', kind, tt.kind);
			let info: MZXBX_PluginRegistrationInformation = tt;

			MZXBX_appendScriptURL(info.script);
			MZXBX_waitForCondition(250
				, () => {
					//console.log('check evaluate',info);
					return (window[info.evaluate]);
				}
				//,onDone
				, () => {
					onDone(info.evaluate);
					/*
					//console.log('exe', info.kind, info.evaluate);
					let exe = window[info.evaluate];
					let plugin = exe();
					//console.log('plugin',plugin);
					if (plugin) {
						onDone(plugin);
						this.startLoadCollectedPlugins(filters, performers);
					}
					*/
				}
			);
			return null;
		} else {
			console.log('Not found registration for', kind);
			return 'Not found registration for ' + kind;
		}
	}
	collectFilterPlugin(id: string, kind: string, properties: string, description: string, filters: MZXBX_FilterHolder[]): void {
		for (let ii = 0; ii < filters.length; ii++) {
			if (filters[ii].filterId == id) {
				filters[ii].properties = properties;
				return;
			}
		}
		filters.push({ pluginAudioFilter: null, filterId: id, kind: kind, properties: properties, description: description });
	}
	collectPerformerPlugin(channel: MZXBX_Channel, kind: string, properties: string, description: string, performers: MZXBX_PerformerSamplerHolder[]): void {
		for (let ii = 0; ii < performers.length; ii++) {
			//if (performers[ii].channelId == id) {
			if (performers[ii].channel.id == channel.id) {
				//console.log('found performer', performers[ii]);
				performers[ii].properties = properties;
				return;
			}
		}
		//console.log('add performer', channel.id, kind);
		performers.push({
			pluginPerformerSampler: null
			//, channelId: id
			, channel: channel
			, kind: kind
			, properties: properties
			, description: description
		});
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
