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

	{ label: 'Import MIDI from file', purpose: 'Action', kind: 'importmidifile', ui: './web/actions/midi/midimusicimport.html', evaluate: 'none', script: 'none' }
	, { label: 'Import Guitar Pro file', purpose: 'Action', kind: 'import345gp', ui: './web/actions/alphagpimport/guitartab.html', evaluate: 'none', script: 'none' }
	, { label: 'Export file', purpose: 'Action', kind: 'exportfile', ui: './web/actions/exp2fi/localselector.html', evaluate: 'none', script: 'none' }
	, { label: 'Import file', purpose: 'Action', kind: 'importfile', ui: './web/actions/exp2fi/localprochooser.html', evaluate: 'none', script: 'none' }
	, { label: 'Base Volume', purpose: 'Filter', kind: 'basevolume', ui: './web/filters/basevolume/volume1.html', evaluate: 'none', script: 'none' }
	, { label: 'Project info', purpose: 'Action', kind: 'projectstatistics', ui: './web/actions/projinfo/info.html', evaluate: 'none', script: 'none' }
	, {
		label: 'Simple beep sound', purpose: 'Performer', kind: 'beep1', ui: './web/performers/simplebeep/uitester/beep1.html'
		, evaluate: 'newSimpleBeepImplementation', script: './web/performers/simplebeep/beeper/beep_plugin.js'
	}, {
		label: 'Zvoog DrumKit', purpose: 'Sampler', kind: 'zdrum1', ui: './web/samplers/zvoog_drum_kit/drmsui.html'
		, evaluate: 'newZvoogDrumKitImplementation', script: './web/samplers/zvoog_drum_kit/zvoogdrumkit_plugin.js'
	}, {
		label: 'Zvoog Volume', purpose: 'Filter', kind: 'zvolume1', ui: './web/filters/zvoog_volume/zvolume1.html'
		, evaluate: 'newZvoogVolumeImplementation', script: './web/filters/zvoog_volume/zvolume_plugin.js'
	},{
		label: 'Zvoog Echo', purpose: 'Filter', kind: 'zvecho1', ui: './web/filters/zvoog_echo/zvconv.html'
		, evaluate: 'newZvoogEchoImplementation', script: './web/filters/zvoog_echo/zecho_plugin.js'
	}
	,{
		label: 'Zvoog Compressor', purpose: 'Filter', kind: 'zvooco1', ui: './web/filters/zvoog_compressor/zvoocomp.html'
		, evaluate: 'newZvoogCompreImplementation', script: './web/filters/zvoog_compressor/zc_plugin.js'
	}
	, {
		label: 'Zvoog Performer', purpose: 'Performer', kind: 'zinstr1', ui: './web/performers/zvoog_perf/perfui.html'
		, evaluate: 'newZvoogBasePerformerImplementation', script: './web/performers/zvoog_perf/zvoogperf_plugin.js'
	}
	, {
		label: 'Zvoog Strum', purpose: 'Performer', kind: 'zvstrumming1', ui: './web/performers/zvoog_strum/strumui.html'
		, evaluate: 'newZvoogStrumPerformerImplementation', script: './web/performers/zvoog_strum/zvoogstrum_plugin.js'
	}



];
function MZXBX_currentPlugins(): MZXBX_PluginRegistrationInformation[] {
	return _t_all_registerd_plugins_list;
}
//console.log('pluginListKindUrlName',pluginListKindUrlName);
