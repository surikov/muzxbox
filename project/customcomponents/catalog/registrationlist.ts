let pluginListKindUrlName :{ kind: string, url: string, functionName: string }[]= [
	{ kind: 'volume_filter_1_test', functionName: 'testPluginForVolume1', url: './plugins/filters/testvolume.js' }
	, { kind: 'compressor_filter_1_test', functionName: 'testPluginForCompressor1', url: './plugins/filters/testcompr.js' }
	, { kind: 'echo_filter_1_test', functionName: 'testPluginForEcho1', url: './plugins/filters/testecho.js' }
	, { kind: 'waf_ins_performer_1_test', functionName: 'testPluginForInstrum1', url: './plugins/performers/testins.js' }
	, { kind: 'waf_drums_performer_1_test', functionName: 'testPluginForDrum1', url: './plugins/performers/testperc.js' }
	, { kind: 'sinewave_performer_1_test', functionName: 'testPluginSingleWave', url: './plugins/performers/testsinewave.js' }
    , { kind: 'waf_performer_1_test', functionName: 'testPluginWAF', url: './plugins/performers/testwaf.js' }
    , { kind: 'drums_performer_1_test', functionName: 'testPluginDrums', url: './plugins/performers/drumswaf.js' }
	, { kind: 'emptySilent', functionName: 'testCreateEmpty', url: './plugins/performers/testempty.js' }
];
console.log(pluginListKindUrlName);
