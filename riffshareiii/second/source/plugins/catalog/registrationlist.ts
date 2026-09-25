let _t_plugin_root_folder = './plugins/';
_t_plugin_root_folder = 'https://daw1024.com/minium/plugins/';
let _t_all_registerd_plugins_list: MZXBX_PluginRegistrationInformation[] = [
	
	{
		label: "Minium 10-band Equalizer"
		, purpose: "Filter"
		, kind: "minium10band_equalizer1"
		, ui: _t_plugin_root_folder + "filters/minium.equalizer/ui/equi.html"
		, evaluate: "new10bEqualizer"
		, script: _t_plugin_root_folder + "filters/minium.equalizer/audio/eqfilter.js"
	}
	,
	{
		label: "Minium Compressor"
		, purpose: "Filter"
		, kind: "miniumdcompressor1"
		, ui: _t_plugin_root_folder + "filters/miniumdcompressor1/ui/cmprui.html"
		, evaluate: "newBaseCompressor"
		, script: _t_plugin_root_folder + "filters/miniumdcompressor1/audio/compress.js"
	}
	,
	{
		label: "Minium Echo"
		, purpose: "Filter"
		, kind: "miniumecho1"
		, ui: _t_plugin_root_folder + "filters/miniumecho1/ui/echo.html"
		, evaluate: "newBaseEchoV1"
		, script: _t_plugin_root_folder + "filters/miniumecho1/audio/plugin.js"
	}
	,
	{
		label: "Minium Fader"
		, purpose: "Filter"
		, kind: "miniumfader1"
		, ui: _t_plugin_root_folder + "filters/minium.fader/ui/faderui.html"
		, evaluate: "newBaseFader"
		, script: _t_plugin_root_folder + "filters/minium.fader/audio/faderaudio.js"
	}
	,
	 {
		"label": "Minium Chords GM"
		, "purpose": "Performer"
		, "kind": "miniumpitchchord1"
		, "ui": _t_plugin_root_folder + "performers/miniumpitchchord1/gui/pitchui.html"
		, "evaluate": "newStrumPerformerImplementation"
		, "script": _t_plugin_root_folder + "performers/miniumpitchchord1/audio/strum_plugin.js"
	}
	,
	 {
		label: "Minium Percussion GM"
		, purpose: "Sampler"
		, kind: "miniumdrums1"
		, ui: _t_plugin_root_folder + "samplers/miniumdrums1/gui/drmsui.html"
		, evaluate: "newBasePercussionPlugin"
		, script: _t_plugin_root_folder + "samplers/miniumdrums1/drm/drmsplgn.js"
	}
	,
	{
		"label": "Export"
		, "purpose": "Action"
		, "kind": "midiexport1"
		, "ui": _t_plugin_root_folder + "actions/midiexport1/miex.html"
		, "evaluate": ""
		, "script": ""
	}
	,
	{
		"label": "Import"
		, "purpose": "Action"
		, "kind": "alphatabimport1"
		, "ui": _t_plugin_root_folder + "actions/alphatabimport1/ui.html"
		, "evaluate": ""
		, "script": ""
	}
	, {
		"label": "Yamaha DX7"
		, "purpose": "Performer"
		, "kind": "dx7fmsynth1"
		, "ui": _t_plugin_root_folder + "performers/dx7fmsynth1/ui/dx7ui.html"
		, "evaluate": "newDX7FMSynth1"
		, "script": _t_plugin_root_folder + "performers/dx7fmsynth1/synth/dx7minium.js"
	}
	,
	{
		"label": "Roland TR-808"
		, "purpose": "Sampler"
		, "kind": "tr808drums"
		, "ui": _t_plugin_root_folder + "samplers/tr808drums/ui/tr808ui.html"
		, "evaluate": "createNewTR808synth"
		, "script": _t_plugin_root_folder + "samplers/tr808drums/audio/tr808drumsBase.js"
	}
	,
	{
		"label": "MIDI.RU Archive"
		, "purpose": "Action"
		, "kind": "midiarchive1"
		, "ui": "https://daw1024.com/midi.ru/libstart.html"
		, "evaluate": ""
		, "script": ""
	}
	/*
	,
	, 
	, 
	,
	,
	,
	, 
	, 
	,
	{
		"label": "Publish & Share"
		, "purpose": "Action"
		, "kind": "sharemzxbox1"
		, "ui": _t_plugin_root_folder + "actions/miniumshare/shareui.html"
		, "evaluate": ""
		, "script": ""
	}
	,
	{
		"label": "Timeline editor"
		, "purpose": "Action"
		, "kind": "baredit1"
		, "ui": _t_plugin_root_folder + "actions/baredit1/mied.html"
		, "evaluate": ""
		, "script": ""
	}
	,
	
	,
	*/
];
function MZXBX_currentPlugins(): MZXBX_PluginRegistrationInformation[] {
	return _t_all_registerd_plugins_list;
}
