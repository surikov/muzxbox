let cachedPerformerStubPlugins: ZvoogPerformerStub[] = [];
function takeZvoogPerformerStub(): ZvoogPerformerStub {
	for (let i = 0; i < cachedPerformerStubPlugins.length; i++) {
		if (!cachedPerformerStubPlugins[i].state().locked()) {
			cachedPerformerStubPlugins[i].state().lock();
			return cachedPerformerStubPlugins[i];
		}
	}
	let plugin = new ZvoogPerformerStub();
	plugin.state().lock();
	cachedPerformerStubPlugins.push(plugin);
	return plugin;
}
let cachedFilterStubPlugins: ZvoogFilterStub[] = [];
function takeZvoogFilterStub(): ZvoogFilterStub {
	for (let i = 0; i < cachedFilterStubPlugins.length; i++) {
		if (!cachedFilterStubPlugins[i].state().locked()) {
			cachedFilterStubPlugins[i].state().lock();
			return cachedFilterStubPlugins[i];
		}
	}
	let plugin = new ZvoogFilterStub();
	plugin.state().lock();
	cachedFilterStubPlugins.push(plugin);
	return plugin;
}
let cachedWAFEchoPlugins: WAFEcho[] = [];
function takeWAFEcho(): WAFEcho {
	for (let i = 0; i < cachedWAFEchoPlugins.length; i++) {
		if (!cachedWAFEchoPlugins[i].state().locked()) {
			cachedWAFEchoPlugins[i].state().lock();
			return cachedWAFEchoPlugins[i];
		}
	}
	let plugin = new WAFEcho();
	plugin.state().lock();
	cachedWAFEchoPlugins.push(plugin);
	return plugin;
}
let cachedWAFEqualizerPlugins: WAFEqualizer[] = [];
function takeWAFEqualizer(): WAFEqualizer {
	for (let i = 0; i < cachedWAFEqualizerPlugins.length; i++) {
		if (!cachedWAFEqualizerPlugins[i].state().locked()) {
			cachedWAFEqualizerPlugins[i].state().lock();
			return cachedWAFEqualizerPlugins[i];
		}
	}
	let plugin = new WAFEqualizer();
	plugin.state().lock();
	cachedWAFEqualizerPlugins.push(plugin);
	return plugin;
}
let cachedZvoogFxGainPlugins: ZvoogFxGain[] = [];
function takeZvoogFxGain(): ZvoogFxGain {
	for (let i = 0; i < cachedZvoogFxGainPlugins.length; i++) {
		if (!cachedZvoogFxGainPlugins[i].state().locked()) {
			cachedZvoogFxGainPlugins[i].state().lock();
			return cachedZvoogFxGainPlugins[i];
		}
	}
	let plugin = new ZvoogFxGain();
	plugin.state().lock();
	cachedZvoogFxGainPlugins.push(plugin);
	return plugin;
}
let cachedAudioFileSourcePlugins: AudioFileSource[] = [];
function takeAudioFileSource(): AudioFileSource {
	for (let i = 0; i < cachedAudioFileSourcePlugins.length; i++) {
		if (!cachedAudioFileSourcePlugins[i].state().locked()) {
			cachedAudioFileSourcePlugins[i].state().lock();
			return cachedAudioFileSourcePlugins[i];
		}
	}
	let plugin = new AudioFileSource();//arr);
	plugin.state().lock();
	cachedAudioFileSourcePlugins.push(plugin);
	return plugin;
}
let cachedWAFInsSourcePlugins: WAFInsSource[] = [];
function takeWAFInsSource(): WAFInsSource {
	for (let i = 0; i < cachedWAFInsSourcePlugins.length; i++) {
		if (!cachedWAFInsSourcePlugins[i].state().locked()) {
			cachedWAFInsSourcePlugins[i].state().lock();
			return cachedWAFInsSourcePlugins[i];
		}
	}
	let plugin = new WAFInsSource();//parseInt(data));
	plugin.state().lock();
	cachedWAFInsSourcePlugins.push(plugin);
	return plugin;
}
let cachedWAFPercSourcePlugins: WAFPercSource[] = [];
function takeWAFPercSource(): WAFPercSource {
	for (let i = 0; i < cachedWAFPercSourcePlugins.length; i++) {
		if (!cachedWAFPercSourcePlugins[i].state().locked()) {
			cachedWAFPercSourcePlugins[i].state().lock();
			return cachedWAFPercSourcePlugins[i];
		}
	}
	let plugin = new WAFPercSource();//parseInt(data));
	plugin.state().lock();
	cachedWAFPercSourcePlugins.push(plugin);
	return plugin;
}
let cachedZvoogSineSourcePlugins: ZvoogSineSource[] = [];
function takeZvoogSineSource(): ZvoogSineSource {
	for (let i = 0; i < cachedZvoogSineSourcePlugins.length; i++) {
		if (!cachedZvoogSineSourcePlugins[i].state().locked()) {
			cachedZvoogSineSourcePlugins[i].state().lock();
			return cachedZvoogSineSourcePlugins[i];
		}
	}
	let plugin = new ZvoogSineSource();
	plugin.state().lock();
	cachedZvoogSineSourcePlugins.push(plugin);
	return plugin;
}
function createPluginEffect(id: string): ZvoogFilterPlugin {
	//console.log('createPluginEffect', id, cachedZvoogFxGainPlugins.length, cachedWAFEqualizerPlugins.length);
	if (id == 'echo') return takeWAFEcho();//new WAFEcho();
	if (id == 'equalizer') return takeWAFEqualizer();//new WAFEqualizer();
	if (id == 'gain') return takeZvoogFxGain();//new ZvoogFxGain();
	//console.log('empty plugin effect for', id);
	//return new ZvoogFilterSourceEmpty();
	return takeZvoogFilterStub();
}
function createPluginSource(id: string): ZvoogPerformerPlugin {
	//console.log('createPluginSource', id, cachedWAFInsSourcePlugins.length, cachedWAFPercSourcePlugins.length);
	if (id == 'audio') {
		//var t = [0, 1, 2];
		//var arr: Uint8Array;
		//arr = Uint8Array.from(t);
		return takeAudioFileSource();//new AudioFileSource(arr);
	}
	if (id == 'wafinstrument') return takeWAFInsSource();//new WAFInsSource(parseInt(data));
	if (id == 'wafdrum') return takeWAFPercSource();//new WAFPercSource(parseInt(data));
	if (id == 'sine') return takeZvoogSineSource();//new ZvoogSineSource();
	//console.log('empty plugin source for', id);
	//return new ZvoogFilterSourceEmpty();
	return takeZvoogPerformerStub();
}
