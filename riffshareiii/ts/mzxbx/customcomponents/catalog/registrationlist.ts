let _t_all_registerd_plugins_list: MZXBX_PluginRegistrationInformation[] = [
	{ label: 'vouleme plu', group: 'filter', id: 'volume', evaluate: 'createBaseVolumeFx', url: './plugins/filters/base_volume_fx.js' }
	, { label: 'cmprsor', group: 'filter', id: 'compression', evaluate: 'basePluginForCompression', url: './plugins/filters/compressor.js' }
	, { label: 'echo1', group: 'filter', id: 'echo_filter_base', evaluate: 'createPluginForEchoIRR', url: './plugins/filters/irrecho.js' }
	, { label: 'webaudiofont instr', group: 'sequencer', id: 'waf_ins_performer_1_test', evaluate: 'testPluginForInstrum1', url: './plugins/performers/testins.js' }
	, { label: 'webaudiofont drms', group: 'sampler', id: 'waf_drums_performer_1_test', evaluate: 'testPluginForDrum1', url: './plugins/performers/testperc.js' }
	, { label: 'sine test', group: 'sequencer', id: 'sinewave_performer_1_test', evaluate: 'testPluginSingleWave', url: './plugins/performers/testsinewave.js' }
	, { label: 'webaudiofont test', group: 'sequencer', id: 'waf_performer_1_test', evaluate: 'testPluginWAF', url: './plugins/performers/testwaf.js' }
	, { label: 'webaudiofont drum test', group: 'sampler', id: 'drums_performer_1_test', evaluate: 'testPluginDrums', url: './plugins/performers/drumswaf.js' }
	, { label: 'Silent', group: '', id: 'emptySilent', evaluate: 'testCreateEmpty', url: './plugins/performers/testempty.js' }
	, { label: 'a voice', group: 'sampler', id: 'vox2', evaluate: 'testPluginVoxPerf', url: './plugins/performers/vox.js' }
	, { label: 'wave', group: 'sampler', id: 'cachedWave', evaluate: 'createPluginCachedVoxPerf', url: './plugins/performers/cachedvox.js' }
	, { label: 'EQ10B', group: 'filter', id: 'equalizer10b', evaluate: 'equalizer10bands', url: './plugins/filters/equalizer10band.js' }
	, { label: 'Import MIDI from file', group: 'import', id: 'importmidifile', evaluate: '', url: './web/plugins/midi/midimusicimport.html' }
	, { label: 'Import Guitar Pro file', group: 'import', id: 'import345gp', evaluate: '', url: './plugins/import/gp345/gpold.js' }
];
function MZXBX_currentPlugins(): MZXBX_PluginRegistrationInformation[] {
	return _t_all_registerd_plugins_list;
}
//console.log('pluginListKindUrlName',pluginListKindUrlName);
