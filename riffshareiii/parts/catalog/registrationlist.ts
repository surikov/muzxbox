let _t_all_registerd_plugins_list: MZXBX_PluginRegistrationInformation[] = [
	/*{ label: 'vouleme plu', kind: MZXBX_PluginKind.Filter, id: 'volume', evaluate: 'createBaseVolumeFx', url: 'https://mzxbox.ru/minium/plugins/filters/base_volume_fx.js' }
	, { label: 'cmprsor', kind: MZXBX_PluginKind.Filter, id: 'compression', evaluate: 'basePluginForCompression', url: 'https://mzxbox.ru/minium/plugins/filters/compressor.js' }
	, { label: 'echo1', kind: MZXBX_PluginKind.Performer, id: 'echo_filter_base', evaluate: 'createPluginForEchoIRR', url: 'https://mzxbox.ru/minium/plugins/filters/irrecho.js' }
	, { label: 'webaudiofont instr', kind: MZXBX_PluginKind.Action, id: 'waf_ins_performer_1_test', evaluate: 'testPluginForInstrum1', url: 'https://mzxbox.ru/minium/plugins/performers/testins.js' }
	, { label: 'webaudiofont drms', kind: MZXBX_PluginKind.Performer, id: 'waf_drums_performer_1_test', evaluate: 'testPluginForDrum1', url: 'https://mzxbox.ru/minium/plugins/performers/testperc.js' }
	, { label: 'sine test', kind: MZXBX_PluginKind.Action, id: 'sinewave_performer_1_test', evaluate: 'testPluginSingleWave', url: 'https://mzxbox.ru/minium/plugins/performers/testsinewave.js' }
	, { label: 'webaudiofont test', kind: MZXBX_PluginKind.Filter, id: 'waf_performer_1_test', evaluate: 'testPluginWAF', url: 'https://mzxbox.ru/minium/plugins/performers/testwaf.js' }
	, { label: 'webaudiofont drum test', kind:MZXBX_PluginKind.Sampler, id: 'drums_performer_1_test', evaluate: 'testPluginDrums', url: 'https://mzxbox.ru/minium/plugins/performers/drumswaf.js' }
	, { label: 'Silent', kind: MZXBX_PluginKind.Filter, id: 'emptySilent', evaluate: 'testCreateEmpty', url: 'https://mzxbox.ru/minium/plugins/performers/testempty.js' }
	, { label: 'a voice', kind: MZXBX_PluginKind.Sampler, id: 'vox2', evaluate: 'testPluginVoxPerf', url: 'https://mzxbox.ru/minium/plugins/performers/vox.js' }
	, { label: 'wave', kind: MZXBX_PluginKind.Sampler, id: 'cachedWave', evaluate: 'createPluginCachedVoxPerf', url: 'https://mzxbox.ru/minium/plugins/performers/cachedvox.js' }
	, { label: 'EQ10B', kind: MZXBX_PluginKind.Action, id: 'equalizer10b', evaluate: 'equalizer10bands', url: 'https://mzxbox.ru/minium/plugins/filters/equalizer10band.js' }
	,*/

	//{ label: 'Import MIDI from file', kind: MZXBX_PluginKind.Action, id: 'importmidifile', evaluate: '', url: 'https://mzxbox.ru/minium/plugins/plugins/midi/midimusicimport.html' }
	//, { label: 'Import Guitar Pro file', kind: MZXBX_PluginKind.Action, id: 'import345gp', evaluate: '', url: 'https://mzxbox.ru/minium/plugins/plugins/alpha/guitartab.html' }

	//{ label: 'Import MIDI from file', purpose: 'Action', kind: 'importmidifile', ui: 'https://mzxbox.ru/minium/plugins/actions/midi/midimusicimport.html', evaluate: 'none', script: 'none' }
	//, { label: 'Import Guitar Pro file', purpose: 'Action', kind: 'import345gp', ui: 'https://mzxbox.ru/minium/plugins/actions/alphagpimport/guitartab.html', evaluate: 'none', script: 'none' }
	//	 { label: 'Save local file', purpose: 'Action', kind: 'exportfile', ui: 'https://mzxbox.ru/minium/plugins/actions/exp2fi/localselector.html', evaluate: 'none', script: 'none' }
	//	, { label: 'Load local file', purpose: 'Action', kind: 'importfile', ui: 'https://mzxbox.ru/minium/plugins/actions/exp2fi/localprochooser.html', evaluate: 'none', script: 'none' }
	//, { label: 'Base Volume', purpose: 'Filter', kind: 'basevolume', ui: 'https://mzxbox.ru/minium/plugins/filters/basevolume/volume1.html', evaluate: 'none', script: 'none' }
	//, { label: 'Project info', purpose: 'Action', kind: 'projectstatistics', ui: 'https://mzxbox.ru/minium/plugins/actions/projinfo/info.html', evaluate: 'none', script: 'none' }
	//, {
	//	label: 'Simple beep sound', purpose: 'Performer', kind: 'beep1', ui: 'https://mzxbox.ru/minium/plugins/performers/simplebeep/uitester/beep1.html'
	//	, evaluate: 'newSimpleBeepImplementation', script: 'https://mzxbox.ru/minium/plugins/performers/simplebeep/beeper/beep_plugin.js'
	//}, {
	//	label: 'Zvoog DrumKit', purpose: 'Sampler', kind: 'zdrum1', ui: 'https://mzxbox.ru/minium/plugins/samplers/zvoog_drum_kit/drmsui.html'
	//	, evaluate: 'newZvoogDrumKitImplementation', script: 'https://mzxbox.ru/minium/plugins/samplers/zvoog_drum_kit/zvoogdrumkit_plugin.js'
	//}, {
	//	label: 'Zvoog Volume', purpose: 'Filter', kind: 'zvolume1', ui: 'https://mzxbox.ru/minium/plugins/filters/zvoog_volume/zvolume1.html'
	//	, evaluate: 'newZvoogVolumeImplementation', script: 'https://mzxbox.ru/minium/plugins/filters/zvoog_volume/zvolume_plugin.js'
	//},{
	//	label: 'Zvoog Echo', purpose: 'Filter', kind: 'zvecho1', ui: 'https://mzxbox.ru/minium/plugins/filters/zvoog_echo/zvconv.html'
	//	, evaluate: 'newZvoogEchoImplementation', script: 'https://mzxbox.ru/minium/plugins/filters/zvoog_echo/zecho_plugin.js'
	//}
	//,{
	//	label: 'Zvoog Compressor', purpose: 'Filter', kind: 'zvooco1', ui: 'https://mzxbox.ru/minium/plugins/filters/zvoog_compressor/zvoocomp.html'
	//	, evaluate: 'newZvoogCompreImplementation', script: 'https://mzxbox.ru/minium/plugins/filters/zvoog_compressor/zc_plugin.js'
	//}
	/*, {
		label: 'Zvoog Performer', purpose: 'Performer', kind: 'zinstr1', ui: 'https://mzxbox.ru/minium/plugins/performers/zvoog_perf/perfui.html'
		, evaluate: 'newZvoogBasePerformerImplementation', script: 'https://mzxbox.ru/minium/plugins/performers/zvoog_perf/zvoogperf_plugin.js'
	}*/
	//, {
	//	label: 'Zvoog Strum', purpose: 'Performer', kind: 'zvstrumming1', ui: 'https://mzxbox.ru/minium/plugins/performers/zvoog_strum/strumui.html'
	//	, evaluate: 'newZvoogStrumPerformerImplementation', script: 'https://mzxbox.ru/minium/plugins/performers/zvoog_strum/zvoogstrum_plugin.js'
	//}


	{
		label: "Minium Compressor"
		, purpose: "Filter"
		, kind: "miniumdcompressor1"
		, ui: "https://mzxbox.ru/minium/plugins/filters/miniumdcompressor1/ui/cmprui.html"
		, evaluate: "newBaseCompressor"
		, script: "https://mzxbox.ru/minium/plugins/filters/miniumdcompressor1/audio/compress.js"
	}
	/*,{
		label: "Minium 10-band Equalizer"
		, purpose: "Filter"
		, kind: "10band_equalizer1"
		, ui: "https://mzxbox.ru/minium/plugins/filters/10band_equalizer1/ui/equi.html"
		, evaluate: "new10bEqualizer"
		, script: "https://mzxbox.ru/minium/plugins/filters/10band_equalizer1/audio/eqfilter.js"
	}*/
	, {
		label: "Minium 10-band Equalizer"
		, purpose: "Filter"
		, kind: "minium10band_equalizer1"
		, ui: "https://mzxbox.ru/minium/plugins/filters/minium.equalizer/ui/equi.html"
		, evaluate: "new10bEqualizer"
		, script: "https://mzxbox.ru/minium/plugins/filters/minium.equalizer/audio/eqfilter.js"
	}
	, {
		label: "Minium Fader"
		, purpose: "Filter"
		, kind: "miniumfader1"
		, ui: "https://mzxbox.ru/minium/plugins/filters/minium.fader/ui/faderui.html"
		, evaluate: "newBaseFader"
		, script: "https://mzxbox.ru/minium/plugins/filters/minium.fader/audio/faderaudio.js"
	}
	, {
		label: "Minium Echo"
		, purpose: "Filter"
		, kind: "miniumecho1"
		, ui: "https://mzxbox.ru/minium/plugins/filters/miniumecho1/ui/echo.html"
		, evaluate: "newBaseEchoV1"
		, script: "https://mzxbox.ru/minium/plugins/filters/miniumecho1/audio/plugin.js"
	}


	, {
		label: "Minium Audio File"
		, purpose: "Sampler"
		, kind: "miniumaudiofile1"
		, ui: "https://mzxbox.ru/minium/plugins/samplers/miniumaudiofile1/chooser/pickfile.html"
		, evaluate: "newAudiFileSamplerTrack"
		, script: "https://mzxbox.ru/minium/plugins/samplers/miniumaudiofile1/player/fileplay.js"
	}, {
		label: "Minium Percussion"
		, purpose: "Sampler"
		, kind: "miniumdrums1"
		, ui: "https://mzxbox.ru/minium/plugins/samplers/miniumdrums1/gui/drmsui.html"
		, evaluate: "newBasePercussionPlugin"
		, script: "https://mzxbox.ru/minium/plugins/samplers/miniumdrums1/drm/drmsplgn.js"
	}
	/*,{
		"label": "Minium Import *.mid"
		, "purpose": "Action"
		, "kind": "minimidimport1"
		, "ui": "https://mzxbox.ru/minium/plugins/actions/minimidimport1/mimidi.html"
		, "evaluate": ""
		, "script": ""
	}*/
	, {
		"label": "Minium Chords"
		, "purpose": "Performer"
		, "kind": "miniumpitchchord1"
		, "ui": "https://mzxbox.ru/minium/plugins/performers/miniumpitchchord1/gui/pitchui.html"
		, "evaluate": "newStrumPerformerImplementation"
		, "script": "https://mzxbox.ru/minium/plugins/performers/miniumpitchchord1/audio/strum_plugin.js"
	}
	, {
		"label": "Yamaha DX7"
		, "purpose": "Performer"
		, "kind": "dx7fmsynth1"
		, "ui": "https://mzxbox.ru/minium/plugins/performers/dx7fmsynth1/ui/dx7ui.html"
		, "evaluate": "newDX7FMSynth1"
		, "script": "https://mzxbox.ru/minium/plugins/performers/dx7fmsynth1/synth/dx7minium.js"
	}
	/*,{
		"label": "Minium Selection properties"
		, "purpose": "Action"
		, "kind": "miniumeditselection1"
		, "ui": "https://mzxbox.ru/minium/plugins/actions/miniumeditselection1/mied.html"
		, "evaluate": ""
		, "script": ""
	}*/
	, {
		"label": "Import"
		, "purpose": "Action"
		, "kind": "alphatabimport1"
		, "ui": "https://mzxbox.ru/minium/plugins/actions/alphatabimport1/ui.html"
		, "evaluate": ""
		, "script": ""
	}
	, {
		"label": "MIDI.RU Archive"
		, "purpose": "Action"
		, "kind": "midiarchive1"
		//, ui: 'http://127.0.0.1:8080/libstart.html'
		, "ui": "https://mzxbox.ru/midiruplugin/libstart.html"
		, "evaluate": ""
		, "script": ""
	}
	/*,{
		"label": "Yandex/VKontakte"
		, "purpose": "Action"
		, "kind": "shareyavk"
		, "ui": "https://mzxbox.ru/minium/plugins/actions/shareyavk/preview.html"
		, "evaluate": ""
		, "script": ""
	}*/
	,
	{
		"label": "Publish & Share"
		, "purpose": "Action"
		, "kind": "sharemzxbox1"
		, "ui": "https://mzxbox.ru/minium/plugins/actions/miniumshare/shareui.html"
		, "evaluate": ""
		, "script": ""
	}
	,
	{
		"label": "Timeline editor"
		, "purpose": "Action"
		, "kind": "baredit1"
		, "ui": "https://mzxbox.ru/minium/plugins/actions/baredit1/mied.html"
		, "evaluate": ""
		, "script": ""
	}
	,
	{
		"label": "Export"
		, "purpose": "Action"
		, "kind": "midiexport1"
		, "ui": "https://mzxbox.ru/minium/plugins/actions/midiexport1/miex.html"
		, "evaluate": ""
		, "script": ""
	}









];
function MZXBX_currentPlugins(): MZXBX_PluginRegistrationInformation[] {
	return _t_all_registerd_plugins_list;
}
//console.log('pluginListKindUrlName',pluginListKindUrlName);
