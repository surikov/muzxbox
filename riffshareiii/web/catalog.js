"use strict";
var MZXBX_PluginPurpose;
(function (MZXBX_PluginPurpose) {
    MZXBX_PluginPurpose[MZXBX_PluginPurpose["Action"] = 0] = "Action";
    MZXBX_PluginPurpose[MZXBX_PluginPurpose["Filter"] = 1] = "Filter";
    MZXBX_PluginPurpose[MZXBX_PluginPurpose["Sampler"] = 2] = "Sampler";
    MZXBX_PluginPurpose[MZXBX_PluginPurpose["Performer"] = 3] = "Performer";
})(MZXBX_PluginPurpose || (MZXBX_PluginPurpose = {}));
let _t_all_registerd_plugins_list = [
    { label: 'Import MIDI from file', purpose: MZXBX_PluginPurpose.Action, kind: 'importmidifile', ui: './web/actions/midi/midimusicimport.html', evaluate: 'none', script: 'none' },
    { label: 'Import Guitar Pro file', purpose: MZXBX_PluginPurpose.Action, kind: 'import345gp', ui: './web/actions/alphagpimport/guitartab.html', evaluate: 'none', script: 'none' },
    { label: 'Export file', purpose: MZXBX_PluginPurpose.Action, kind: 'exportfile', ui: './web/actions/exp2fi/localselector.html', evaluate: 'none', script: 'none' },
    { label: 'Import file', purpose: MZXBX_PluginPurpose.Action, kind: 'importfile', ui: './web/actions/exp2fi/localprochooser.html', evaluate: 'none', script: 'none' },
    { label: 'Base Volume', purpose: MZXBX_PluginPurpose.Filter, kind: 'basevolume', ui: './web/filters/basevolume/volume1.html', evaluate: 'none', script: 'none' },
    { label: 'Project info', purpose: MZXBX_PluginPurpose.Action, kind: 'projectstatistics', ui: './web/actions/projinfo/info.html', evaluate: 'none', script: 'none' },
    { label: 'Simple beep sound', purpose: MZXBX_PluginPurpose.Performer, kind: 'beep1', ui: './web/performers/simplebeep/uitester/beep1.html', evaluate: 'newSimpleBeepImplementation', script: './web/performers/simplebeep/beeper/beep_plugin.js' }
];
function MZXBX_currentPlugins() {
    return _t_all_registerd_plugins_list;
}
//# sourceMappingURL=catalog.js.map