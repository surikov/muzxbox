"use strict";
var MZXBX_PluginKind;
(function (MZXBX_PluginKind) {
    MZXBX_PluginKind[MZXBX_PluginKind["Action"] = 0] = "Action";
    MZXBX_PluginKind[MZXBX_PluginKind["Filter"] = 1] = "Filter";
    MZXBX_PluginKind[MZXBX_PluginKind["Sampler"] = 2] = "Sampler";
    MZXBX_PluginKind[MZXBX_PluginKind["Performer"] = 3] = "Performer";
})(MZXBX_PluginKind || (MZXBX_PluginKind = {}));
let _t_all_registerd_plugins_list = [
    { label: 'Import MIDI from file', kind: MZXBX_PluginKind.Action, id: 'importmidifile', url: './web/actions/midi/midimusicimport.html' },
    { label: 'Import Guitar Pro file', kind: MZXBX_PluginKind.Action, id: 'import345gp', url: './web/actions/alphagpimport/guitartab.html' },
    { label: 'Base Volume', kind: MZXBX_PluginKind.Filter, id: 'basevolume', url: './web/filters/basevolume/volume1.html' },
    { label: 'Project info', kind: MZXBX_PluginKind.Action, id: 'projectstatistics', url: './web/actions/projinfo/info.html' },
    { label: 'Simple beep sound', kind: MZXBX_PluginKind.Performer, id: 'beep1', url: './web/performers/simplebeep/uitester/beep1.html' }
];
function MZXBX_currentPlugins() {
    return _t_all_registerd_plugins_list;
}
//# sourceMappingURL=catalog.js.map