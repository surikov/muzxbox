"use strict";
let _t_all_registerd_plugins_list = [
    {
        label: "Minium Compressor",
        purpose: "Filter",
        kind: "miniumdcompressor1",
        ui: "https://mzxbox.ru/minium/plugins/filters/miniumdcompressor1/ui/cmprui.html",
        evaluate: "newBaseCompressor",
        script: "https://mzxbox.ru/minium/plugins/filters/miniumdcompressor1/audio/compress.js"
    },
    {
        label: "Minium 10-band Equalizer",
        purpose: "Filter",
        kind: "minium10band_equalizer1",
        ui: "https://mzxbox.ru/minium/plugins/filters/minium.equalizer/ui/equi.html",
        evaluate: "new10bEqualizer",
        script: "https://mzxbox.ru/minium/plugins/filters/minium.equalizer/audio/eqfilter.js"
    },
    {
        label: "Minium Fader",
        purpose: "Filter",
        kind: "miniumfader1",
        ui: "https://mzxbox.ru/minium/plugins/filters/minium.fader/ui/faderui.html",
        evaluate: "newBaseFader",
        script: "https://mzxbox.ru/minium/plugins/filters/minium.fader/audio/faderaudio.js"
    },
    {
        label: "Minium Echo",
        purpose: "Filter",
        kind: "miniumecho1",
        ui: "https://mzxbox.ru/minium/plugins/filters/miniumecho1/ui/echo.html",
        evaluate: "newBaseEchoV1",
        script: "https://mzxbox.ru/minium/plugins/filters/miniumecho1/audio/plugin.js"
    },
    {
        label: "Minium Audio File",
        purpose: "Sampler",
        kind: "miniumaudiofile1",
        ui: "https://mzxbox.ru/minium/plugins/samplers/miniumaudiofile1/chooser/pickfile.html",
        evaluate: "newAudiFileSamplerTrack",
        script: "https://mzxbox.ru/minium/plugins/samplers/miniumaudiofile1/player/fileplay.js"
    }, {
        label: "Minium Percussion",
        purpose: "Sampler",
        kind: "miniumdrums1",
        ui: "https://mzxbox.ru/minium/plugins/samplers/miniumdrums1/gui/drmsui.html",
        evaluate: "newBasePercussionPlugin",
        script: "https://mzxbox.ru/minium/plugins/samplers/miniumdrums1/drm/drmsplgn.js"
    },
    {
        "label": "Minium Chords",
        "purpose": "Performer",
        "kind": "miniumpitchchord1",
        "ui": "https://mzxbox.ru/minium/plugins/performers/miniumpitchchord1/gui/pitchui.html",
        "evaluate": "newStrumPerformerImplementation",
        "script": "https://mzxbox.ru/minium/plugins/performers/miniumpitchchord1/audio/strum_plugin.js"
    },
    {
        "label": "Yamaha DX7",
        "purpose": "Performer",
        "kind": "dx7fmsynth1",
        "ui": "./plugins/performers/dx7fmsynth1/ui/dx7ui.html",
        "evaluate": "newDX7FMSynth1",
        "script": "./plugins/performers/dx7fmsynth1/synth/dx7minium.js"
    },
    {
        "label": "Import",
        "purpose": "Action",
        "kind": "alphatabimport1",
        "ui": "https://mzxbox.ru/minium/plugins/actions/alphatabimport1/ui.html",
        "evaluate": "",
        "script": ""
    },
    {
        "label": "MIDI.RU Archive",
        "purpose": "Action",
        "kind": "midiarchive1",
        "ui": "https://mzxbox.ru/midiruplugin/libstart.html",
        "evaluate": "",
        "script": ""
    },
    {
        "label": "Publish & Share",
        "purpose": "Action",
        "kind": "sharemzxbox1",
        "ui": "https://mzxbox.ru/minium/plugins/actions/miniumshare/shareui.html",
        "evaluate": "",
        "script": ""
    },
    {
        "label": "Timeline editor",
        "purpose": "Action",
        "kind": "baredit1",
        "ui": "https://mzxbox.ru/minium/plugins/actions/baredit1/mied.html",
        "evaluate": "",
        "script": ""
    },
    {
        "label": "Export",
        "purpose": "Action",
        "kind": "midiexport1",
        "ui": "https://mzxbox.ru/minium/plugins/actions/midiexport1/miex.html",
        "evaluate": "",
        "script": ""
    }
];
function MZXBX_currentPlugins() {
    return _t_all_registerd_plugins_list;
}
//# sourceMappingURL=catalog.js.map