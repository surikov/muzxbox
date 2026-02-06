"use strict";
let _t_all_registerd_plugins_list = [
    { label: 'Save local file', purpose: 'Action', kind: 'exportfile', ui: './plugins/actions/exp2fi/localselector.html', evaluate: 'none', script: 'none' },
    { label: 'Load local file', purpose: 'Action', kind: 'importfile', ui: './plugins/actions/exp2fi/localprochooser.html', evaluate: 'none', script: 'none' },
    {
        label: "Minium Compressor",
        purpose: "Filter",
        kind: "miniumdcompressor1",
        ui: "./plugins/filters/miniumdcompressor1/ui/cmprui.html",
        evaluate: "newBaseCompressor",
        script: "./plugins/filters/miniumdcompressor1/audio/compress.js"
    },
    {
        label: "Minium 10-band Equalizer",
        purpose: "Filter",
        kind: "minium10band_equalizer1",
        ui: "./plugins/filters/minium.equalizer/ui/equi.html",
        evaluate: "new10bEqualizer",
        script: "./plugins/filters/minium.equalizer/audio/eqfilter.js"
    },
    {
        label: "Minium Fader",
        purpose: "Filter",
        kind: "miniumfader1",
        ui: "./plugins/filters/minium.fader/ui/faderui.html",
        evaluate: "newBaseFader",
        script: "./plugins/filters/minium.fader/audio/faderaudio.js"
    },
    {
        label: "Minium Echo",
        purpose: "Filter",
        kind: "miniumecho1",
        ui: "./plugins/filters/miniumecho1/ui/echo.html",
        evaluate: "newBaseEchoV1",
        script: "./plugins/filters/miniumecho1/audio/plugin.js"
    },
    {
        label: "Minium Audio File",
        purpose: "Sampler",
        kind: "miniumaudiofile1",
        ui: "./plugins/samplers/miniumaudiofile1/chooser/pickfile.html",
        evaluate: "newAudiFileSamplerTrack",
        script: "./plugins/samplers/miniumaudiofile1/player/fileplay.js"
    }, {
        label: "Minium Percussion",
        purpose: "Sampler",
        kind: "miniumdrums1",
        ui: "./plugins/samplers/miniumdrums1/gui/drmsui.html",
        evaluate: "newBasePercussionPlugin",
        script: "./plugins/samplers/miniumdrums1/drm/drmsplgn.js"
    },
    {
        "label": "Minium Chords",
        "purpose": "Performer",
        "kind": "miniumpitchchord1",
        "ui": "./plugins/performers/miniumpitchchord1/gui/pitchui.html",
        "evaluate": "newStrumPerformerImplementation",
        "script": "./plugins/performers/miniumpitchchord1/audio/strum_plugin.js"
    },
    {
        "label": "Import",
        "purpose": "Action",
        "kind": "alphatabimport1",
        "ui": "./plugins/actions/alphatabimport1/ui.html",
        "evaluate": "",
        "script": ""
    },
    {
        "label": "Publish & Share",
        "purpose": "Action",
        "kind": "sharemzxbox1",
        "ui": "./plugins/actions/miniumshare/shareui.html",
        "evaluate": "",
        "script": ""
    },
    {
        "label": "Timeline editor",
        "purpose": "Action",
        "kind": "baredit1",
        "ui": "./plugins/actions/baredit1/mied.html",
        "evaluate": "",
        "script": ""
    },
    {
        "label": "MIDI export",
        "purpose": "Action",
        "kind": "midiexport1",
        "ui": "./plugins/actions/midiexport1/miex.html",
        "evaluate": "",
        "script": ""
    }
];
function MZXBX_currentPlugins() {
    return _t_all_registerd_plugins_list;
}
//# sourceMappingURL=catalog.js.map