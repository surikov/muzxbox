"use strict";
let _t_all_registerd_plugins_list = [
    { label: 'Import MIDI from file', purpose: 'Action', kind: 'importmidifile', ui: './web/actions/midi/midimusicimport.html', evaluate: 'none', script: 'none' },
    { label: 'Import Guitar Pro file', purpose: 'Action', kind: 'import345gp', ui: './web/actions/alphagpimport/guitartab.html', evaluate: 'none', script: 'none' },
    { label: 'Export file', purpose: 'Action', kind: 'exportfile', ui: './web/actions/exp2fi/localselector.html', evaluate: 'none', script: 'none' },
    { label: 'Import file', purpose: 'Action', kind: 'importfile', ui: './web/actions/exp2fi/localprochooser.html', evaluate: 'none', script: 'none' },
    { label: 'Base Volume', purpose: 'Filter', kind: 'basevolume', ui: './web/filters/basevolume/volume1.html', evaluate: 'none', script: 'none' },
    { label: 'Project info', purpose: 'Action', kind: 'projectstatistics', ui: './web/actions/projinfo/info.html', evaluate: 'none', script: 'none' },
    {
        label: 'Simple beep sound', purpose: 'Performer', kind: 'beep1', ui: './web/performers/simplebeep/uitester/beep1.html',
        evaluate: 'newSimpleBeepImplementation', script: './web/performers/simplebeep/beeper/beep_plugin.js'
    }, {
        label: 'Zvoog DrumKit', purpose: 'Sampler', kind: 'zdrum1', ui: './web/samplers/zvoog_drum_kit/drmsui.html',
        evaluate: 'newZvoogDrumKitImplementation', script: './web/samplers/zvoog_drum_kit/zvoogdrumkit_plugin.js'
    }, {
        label: 'Zvoog Volume', purpose: 'Filter', kind: 'zvolume1', ui: './web/filters/zvoog_volume/zvolume1.html',
        evaluate: 'newZvoogVolumeImplementation', script: './web/filters/zvoog_volume/zvolume_plugin.js'
    }, {
        label: 'Zvoog Echo', purpose: 'Filter', kind: 'zvecho1', ui: './web/filters/zvoog_echo/zvconv.html',
        evaluate: 'newZvoogEchoImplementation', script: './web/filters/zvoog_echo/zecho_plugin.js'
    },
    {
        label: 'Zvoog Compressor', purpose: 'Filter', kind: 'zvooco1', ui: './web/filters/zvoog_compressor/zvoocomp.html',
        evaluate: 'newZvoogCompreImplementation', script: './web/filters/zvoog_compressor/zc_plugin.js'
    },
    {
        label: 'Zvoog Performer', purpose: 'Performer', kind: 'zinstr1', ui: './web/performers/zvoog_perf/perfui.html',
        evaluate: 'newZvoogBasePerformerImplementation', script: './web/performers/zvoog_perf/zvoogperf_plugin.js'
    }
];
function MZXBX_currentPlugins() {
    return _t_all_registerd_plugins_list;
}
//# sourceMappingURL=catalog.js.map