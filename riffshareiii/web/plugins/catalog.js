"use strict";
let pluginListKindUrlName = [
    { kind: 'volume', functionName: 'createBaseVolumeFx', url: './plugins/filters/base_volume_fx.js' },
    { kind: 'compression', functionName: 'basePluginForCompression', url: './plugins/filters/compressor.js' },
    { kind: 'echo_filter_base', functionName: 'createPluginForEchoIRR', url: './plugins/filters/irrecho.js' },
    { kind: 'waf_ins_performer_1_test', functionName: 'testPluginForInstrum1', url: './plugins/performers/testins.js' },
    { kind: 'waf_drums_performer_1_test', functionName: 'testPluginForDrum1', url: './plugins/performers/testperc.js' },
    { kind: 'sinewave_performer_1_test', functionName: 'testPluginSingleWave', url: './plugins/performers/testsinewave.js' },
    { kind: 'waf_performer_1_test', functionName: 'testPluginWAF', url: './plugins/performers/testwaf.js' },
    { kind: 'drums_performer_1_test', functionName: 'testPluginDrums', url: './plugins/performers/drumswaf.js' },
    { kind: 'emptySilent', functionName: 'testCreateEmpty', url: './plugins/performers/testempty.js' },
    { kind: 'vox2', functionName: 'testPluginVoxPerf', url: './plugins/performers/vox.js' },
    { kind: 'cachedWave', functionName: 'createPluginCachedVoxPerf', url: './plugins/performers/cachedvox.js' },
    { kind: 'equalizer10b', functionName: 'equalizer10bands', url: './plugins/filters/equalizer10band.js' }
];
//# sourceMappingURL=catalog.js.map