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
    }
];
function MZXBX_currentPlugins() {
    return _t_all_registerd_plugins_list;
}
//# sourceMappingURL=catalog.js.map