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

	//{ label: 'Import MIDI from file', kind: MZXBX_PluginKind.Action, id: 'importmidifile', evaluate: '', url: './plugins/plugins/midi/midimusicimport.html' }
	//, { label: 'Import Guitar Pro file', kind: MZXBX_PluginKind.Action, id: 'import345gp', evaluate: '', url: './plugins/plugins/alpha/guitartab.html' }

	{ label: 'Import MIDI from file', purpose: 'Action', kind: 'importmidifile', ui: './plugins/actions/midi/midimusicimport.html', evaluate: 'none', script: 'none' }
	, { label: 'Import Guitar Pro file', purpose: 'Action', kind: 'import345gp', ui: './plugins/actions/alphagpimport/guitartab.html', evaluate: 'none', script: 'none' }
	, { label: 'Export file', purpose: 'Action', kind: 'exportfile', ui: './plugins/actions/exp2fi/localselector.html', evaluate: 'none', script: 'none' }
	, { label: 'Import file', purpose: 'Action', kind: 'importfile', ui: './plugins/actions/exp2fi/localprochooser.html', evaluate: 'none', script: 'none' }
	, { label: 'Base Volume', purpose: 'Filter', kind: 'basevolume', ui: './plugins/filters/basevolume/volume1.html', evaluate: 'none', script: 'none' }
	, { label: 'Project info', purpose: 'Action', kind: 'projectstatistics', ui: './plugins/actions/projinfo/info.html', evaluate: 'none', script: 'none' }
	, {
		label: 'Simple beep sound', purpose: 'Performer', kind: 'beep1', ui: './plugins/performers/simplebeep/uitester/beep1.html'
		, evaluate: 'newSimpleBeepImplementation', script: './plugins/performers/simplebeep/beeper/beep_plugin.js'
	}, {
		label: 'Zvoog DrumKit', purpose: 'Sampler', kind: 'zdrum1', ui: './plugins/samplers/zvoog_drum_kit/drmsui.html'
		, evaluate: 'newZvoogDrumKitImplementation', script: './plugins/samplers/zvoog_drum_kit/zvoogdrumkit_plugin.js'
	}, {
		label: 'Zvoog Volume', purpose: 'Filter', kind: 'zvolume1', ui: './plugins/filters/zvoog_volume/zvolume1.html'
		, evaluate: 'newZvoogVolumeImplementation', script: './plugins/filters/zvoog_volume/zvolume_plugin.js'
	},{
		label: 'Zvoog Echo', purpose: 'Filter', kind: 'zvecho1', ui: './plugins/filters/zvoog_echo/zvconv.html'
		, evaluate: 'newZvoogEchoImplementation', script: './plugins/filters/zvoog_echo/zecho_plugin.js'
	}
	,{
		label: 'Zvoog Compressor', purpose: 'Filter', kind: 'zvooco1', ui: './plugins/filters/zvoog_compressor/zvoocomp.html'
		, evaluate: 'newZvoogCompreImplementation', script: './plugins/filters/zvoog_compressor/zc_plugin.js'
	}
	/*, {
		label: 'Zvoog Performer', purpose: 'Performer', kind: 'zinstr1', ui: './plugins/performers/zvoog_perf/perfui.html'
		, evaluate: 'newZvoogBasePerformerImplementation', script: './plugins/performers/zvoog_perf/zvoogperf_plugin.js'
	}*/
	, {
		label: 'Zvoog Strum', purpose: 'Performer', kind: 'zvstrumming1', ui: './plugins/performers/zvoog_strum/strumui.html'
		, evaluate: 'newZvoogStrumPerformerImplementation', script: './plugins/performers/zvoog_strum/zvoogstrum_plugin.js'
	}


,{
    label: "Compressor"
    , purpose: "Filter"
    , kind: "miniumdcompressor1"
    , ui: "./plugins/filters/minium.compressor/ui/cmprui.html"
    , evaluate: "newBaseCompressor"
    , script: "./plugins/filters/minium.compressor/audio/compress.js"
}
,{
    label: "Equalizer"
    , purpose: "Filter"
    , kind: "10band_equalizer1"
    , ui: "./plugins/filters/minium.equalizer/ui/equi.html"
    , evaluate: "new10bEqualizer"
    , script: "./plugins/filters/minium.equalizer/audio/eqfilter.js"
}
,{
    label: "Fader"
    , purpose: "Filter"
    , kind: "miniumfader1"
    , ui: "./plugins/filters/minium.fader/ui/faderui.html"
    , evaluate: "newBaseFader"
    , script: "./plugins/filters/minium.fader/audio/faderaudio.js"
}
,{
    label: "Echo"
    , purpose: "Filter"
    , kind: "miniumecho1"
    , ui: "./plugins/filters/minium.reverberator/ui/echo.html"
    , evaluate: "newBaseEcho"
    , script: "./plugins/filters/minium.reverberator/audio/plugin.js"
}


,{
    label: "Audio File"
    , purpose: "Sampler"
    , kind: "miniumaudiofile1"
    , ui: "./plugins/performers/miniumaudiofile1/chooser/pickfile.html"
    , evaluate: "newAudiFileSamplerTrack"
    , script: "./plugins/performers/miniumaudiofile1/player/fileplay.js"
},{
    label: "Percussion"
    , purpose: "Sampler"
    , kind: "miniumdrums1"
    , ui: "./plugins/samplers/miniumdrums1/drmsui.html"
    , evaluate: "newBasePercussionPlugin"
    , script: "./plugins/samplers/miniumdrums1/drmsplgn.js"
}















];
function MZXBX_currentPlugins(): MZXBX_PluginRegistrationInformation[] {
	return _t_all_registerd_plugins_list;
}
//console.log('pluginListKindUrlName',pluginListKindUrlName);
