let _t_all_registerd_plugins_list: MZXBX_PluginRegistrationInformation[] = [
	/*{ label: 'vouleme plu', kind: MZXBX_PluginKind.Filter, id: 'volume', evaluate: 'createBaseVolumeFx', url: './plugins/filters/base_volume_fx.js' }
	, { label: 'cmprsor', kind: MZXBX_PluginKind.Filter, id: 'compression', evaluate: 'basePluginForCompression', url: './plugins/filters/compressor.js' }
	, { label: 'echo1', kind: MZXBX_PluginKind.Performer, id: 'echo_filter_base', evaluate: 'createPluginForEchoIRR', url: './plugins/filters/irrecho.js' }
	, { label: 'webaudiofont instr', kind: MZXBX_PluginKind.Action, id: 'waf_ins_performer_1_test', evaluate: 'testPluginForInstrum1', url: './plugins/performers/testins.js' }
	, { label: 'webaudiofont drms', kind: MZXBX_PluginKind.Performer, id: 'waf_drums_performer_1_test', evaluate: 'testPluginForDrum1', url: './plugins/performers/testperc.js' }
	, { label: 'sine test', kind: MZXBX_PluginKind.Action, id: 'sinewave_performer_1_test', evaluate: 'testPluginSingleWave', url: './plugins/performers/testsinewave.js' }
	, { label: 'webaudiofont test', kind: MZXBX_PluginKind.Filter, id: 'waf_performer_1_test', evaluate: 'testPluginWAF', url: './plugins/performers/testwaf.js' }
	, { label: 'webaudiofont drum test', kind:MZXBX_PluginKind.Sampler, id: 'drums_performer_1_test', evaluate: 'testPluginDrums', url: './plugins/performers/drumswaf.js' }
	, { label: 'Silent', kind: MZXBX_PluginKind.Filter, id: 'emptySilent', evaluate: 'testCreateEmpty', url: './plugins/performers/testempty.js' }
	, { label: 'a voice', kind: MZXBX_PluginKind.Sampler, id: 'vox2', evaluate: 'testPluginVoxPerf', url: './plugins/performers/vox.js' }
	, { label: 'wave', kind: MZXBX_PluginKind.Sampler, id: 'cachedWave', evaluate: 'createPluginCachedVoxPerf', url: './plugins/performers/cachedvox.js' }
	, { label: 'EQ10B', kind: MZXBX_PluginKind.Action, id: 'equalizer10b', evaluate: 'equalizer10bands', url: './plugins/filters/equalizer10band.js' }
	,*/

	//{ label: 'Import MIDI from file', kind: MZXBX_PluginKind.Action, id: 'importmidifile', evaluate: '', url: './web/plugins/midi/midimusicimport.html' }
	//, { label: 'Import Guitar Pro file', kind: MZXBX_PluginKind.Action, id: 'import345gp', evaluate: '', url: './web/plugins/alpha/guitartab.html' }

	{ label: 'Import MIDI from file', kind: MZXBX_PluginKind.Action, id: 'importmidifile', url: './web/actions/midi/midimusicimport.html' }
	, { label: 'Import Guitar Pro file', kind: MZXBX_PluginKind.Action, id: 'import345gp', url: './web/actions/alphagpimport/guitartab.html' }
	, { label: 'Base Volume', kind: MZXBX_PluginKind.Filter, id: 'basevolume', url: './web/filters/basevolume/volume1.html' }
	, { label: 'Project info', kind: MZXBX_PluginKind.Action, id: 'projectstatistics', url: './web/actions/projinfo/info.html' }
	, { label: 'Simple beep sound', kind: MZXBX_PluginKind.Performer, id: 'beep1', url: './web/performers/simplebeep/uitester/beep1.html' }
	


];
function MZXBX_currentPlugins(): MZXBX_PluginRegistrationInformation[] {
	return _t_all_registerd_plugins_list;
}
//console.log('pluginListKindUrlName',pluginListKindUrlName);
