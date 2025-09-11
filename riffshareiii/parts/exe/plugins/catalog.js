"use strict";
let _t_all_registerd_plugins_list = [
    { label: 'Import MIDI from file', purpose: 'Action', kind: 'importmidifile', ui: './plugins/actions/midi/midimusicimport.html', evaluate: 'none', script: 'none' },
    { label: 'Import Guitar Pro file', purpose: 'Action', kind: 'import345gp', ui: './plugins/actions/alphagpimport/guitartab.html', evaluate: 'none', script: 'none' },
    { label: 'Export file', purpose: 'Action', kind: 'exportfile', ui: './plugins/actions/exp2fi/localselector.html', evaluate: 'none', script: 'none' },
    { label: 'Import file', purpose: 'Action', kind: 'importfile', ui: './plugins/actions/exp2fi/localprochooser.html', evaluate: 'none', script: 'none' },
    { label: 'Base Volume', purpose: 'Filter', kind: 'basevolume', ui: './plugins/filters/basevolume/volume1.html', evaluate: 'none', script: 'none' },
    { label: 'Project info', purpose: 'Action', kind: 'projectstatistics', ui: './plugins/actions/projinfo/info.html', evaluate: 'none', script: 'none' },
    {
        label: 'Simple beep sound', purpose: 'Performer', kind: 'beep1', ui: './plugins/performers/simplebeep/uitester/beep1.html',
        evaluate: 'newSimpleBeepImplementation', script: './plugins/performers/simplebeep/beeper/beep_plugin.js'
    }, {
        label: 'Zvoog DrumKit', purpose: 'Sampler', kind: 'zdrum1', ui: './plugins/samplers/zvoog_drum_kit/drmsui.html',
        evaluate: 'newZvoogDrumKitImplementation', script: './plugins/samplers/zvoog_drum_kit/zvoogdrumkit_plugin.js'
    }, {
        label: 'Zvoog Volume', purpose: 'Filter', kind: 'zvolume1', ui: './plugins/filters/zvoog_volume/zvolume1.html',
        evaluate: 'newZvoogVolumeImplementation', script: './plugins/filters/zvoog_volume/zvolume_plugin.js'
    }, {
        label: 'Zvoog Echo', purpose: 'Filter', kind: 'zvecho1', ui: './plugins/filters/zvoog_echo/zvconv.html',
        evaluate: 'newZvoogEchoImplementation', script: './plugins/filters/zvoog_echo/zecho_plugin.js'
    },
    {
        label: 'Zvoog Compressor', purpose: 'Filter', kind: 'zvooco1', ui: './plugins/filters/zvoog_compressor/zvoocomp.html',
        evaluate: 'newZvoogCompreImplementation', script: './plugins/filters/zvoog_compressor/zc_plugin.js'
    },
    {
        label: 'Zvoog Strum', purpose: 'Performer', kind: 'zvstrumming1', ui: './plugins/performers/zvoog_strum/strumui.html',
        evaluate: 'newZvoogStrumPerformerImplementation', script: './plugins/performers/zvoog_strum/zvoogstrum_plugin.js'
    },
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
        kind: "10band_equalizer1",
        ui: "./plugins/filters/10band_equalizer1/ui/equi.html",
        evaluate: "new10bEqualizer",
        script: "./plugins/filters/10band_equalizer1/audio/eqfilter.js"
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
        "label": "Minium Import *.mid",
        "purpose": "Action",
        "kind": "minimidimport1",
        "ui": "./plugins/actions/minimidimport1/mimidi.html",
        "evaluate": "",
        "script": ""
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
        "label": "Minium Selection properties",
        "purpose": "Action",
        "kind": "miniumeditselection1",
        "ui": "./plugins/actions/miniumeditselection1/mied.html",
        "evaluate": "",
        "script": ""
    },
    {
        "label": "Alpha Tab Import",
        "purpose": "Action",
        "kind": "alphatabimport1",
        "ui": "./plugins/actions/alphatabimport1/ui.html",
        "evaluate": "",
        "script": ""
    }
];
function MZXBX_currentPlugins() {
    return _t_all_registerd_plugins_list;
}
//# sourceMappingURL=catalog.js.map