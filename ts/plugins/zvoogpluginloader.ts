let cachedPerformerStubPlugins: ZvoogPerformerStub[] = [];
function takeZvoogInstrumentStub(): ZvoogPerformerStub {
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
function takeZvoogPercussionStub(): ZvoogPerformerStub {
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
	console.log('createPluginEffect wrong', id);
	return takeZvoogFilterStub();
}
function createPluginInstrument(id: string): ZvoogInstrumentPlugin {
	if (id == 'wafinstrument') return takeWAFInsSource();
	if (id == 'sine') return takeZvoogSineSource();
	console.log('createPluginInstrument wrong', id);
	return takeZvoogInstrumentStub();
}
function createPluginPercussion(id: string): ZvoogPercussionPlugin {
	if (id == 'wafdrum') return takeWAFPercSource();
	console.log('createPluginPercussion wrong', id);
	return takeZvoogInstrumentStub();
}
function startPausePlay() {
	//console.log('startPausePlay');
	var me: MuzXBox = window['MZXB'] as MuzXBox;
	//console.log(me);
	if (me) {
		me.zTicker.toggleStatePlay(me.currentSchedule);
	}
}
class ZvoogTicker {
	stateStoped = 1;
	statePlay = 2;
	stateEnding = 3;
	state = this.stateStoped;
	stepDuration = 0.91;
	lastPosition = 0;

	audioContext: AudioContext;

	constructor() {
		var AudioContextFunc = window.AudioContext || window['webkitAudioContext'];
		this.audioContext = new AudioContextFunc();
	}
	tryToResumeAudioContext() {
		try {
			if (this.audioContext.state == 'suspended') {
				console.log('audioContext.resume', this.audioContext);
				this.audioContext.resume();
			}
		}
		catch (e) {
			console.log('try to resume AudioContext', e);
		}
	}
	createFilterPlugins(filters: ZvoogFilterSetting[]): void {
		for (let ff = 0; ff < filters.length; ff++) {
			let filter = filters[ff];
			if (filter.filterPlugin) {
				//
			} else {
				filter.filterPlugin = createPluginEffect(filter.kind);
			}
		}
	}
	createSongPlugins(song: ZvoogSchedule): void {
		this.createFilterPlugins(song.filters);
		for (let tt = 0; tt > song.tracks.length; tt++) {
			let track = song.tracks[tt];
			this.createFilterPlugins(track.filters);
			for (let vv = 0; vv < track.instruments.length; vv++) {
				let voice = track.instruments[vv];
				this.createFilterPlugins(voice.filters);
				if (voice.instrumentSetting.instrumentPlugin) {
					//
				} else {
					voice.instrumentSetting.instrumentPlugin = createPluginInstrument(voice.instrumentSetting.kind);
				}
			}
			for (let vv = 0; vv < track.percussions.length; vv++) {
				let voice = track.percussions[vv];
				this.createFilterPlugins(voice.filters);
				if (voice.percussionSetting.percussionPlugin) {
					//
				} else {
					console.log('empty percussion', tt, track.title, vv, voice.title);
					voice.percussionSetting.percussionPlugin = createPluginPercussion(voice.percussionSetting.kind);
				}
			}
		}
	}
	tryToInitPlugins(song: ZvoogSchedule): boolean {
		this.createSongPlugins(song);
		if (this.tryToInitEffects(song.filters)) {
			for (let tt = 0; tt > song.tracks.length; tt++) {
				let track = song.tracks[tt];
				if (this.tryToInitEffects(track.filters)) {
					for (let vv = 0; vv < track.instruments.length; vv++) {
						let voice = track.instruments[vv];
						if (this.tryToInitEffects(voice.filters)) {
							let plugin = voice.instrumentSetting.instrumentPlugin;
							if (plugin) {
								plugin.prepare(this.audioContext, "");
								if (plugin.busy()) {
									console.log('busy instrument', tt, track.title, vv, voice.title);
									return false;
								}
							} else {
								console.log('empty instrument', tt, track.title, vv, voice.title);
								return false;
							}
						} else {
							return false;
						}
					}
					for (let vv = 0; vv < track.percussions.length; vv++) {
						let voice = track.percussions[vv];
						if (this.tryToInitEffects(voice.filters)) {
							let plugin = voice.percussionSetting.percussionPlugin;
							if (plugin) {
								plugin.prepare(this.audioContext, "");
								if (plugin.busy()) {
									console.log('busy percussion', tt, track.title, vv, voice.title);
									return false;
								}
							} else {
								console.log('empty percussion', tt, track.title, vv, voice.title);
								return false;
							}
						} else {
							console.log('empty instrument', tt, track.title, vv, voice.title);
							return false;
						}
					}
				} else {
					return false;
				}
			}
		} else {
			return false;
		}
		return true;
	}
	tryToInitEffects(filters: ZvoogFilterSetting[]): boolean {
		for (let ff = 0; ff < filters.length; ff++) {
			let filter = filters[ff];
			let plugin = filter.filterPlugin;
			if (plugin) {
				plugin.prepare(this.audioContext, "");
				if (plugin.busy()) {
					console.log('busy filter', ff, filter.kind);
					return false;
				}
			} else {
				console.log('empty filter', ff, filter.kind);
				return false;
			}
		}
		return true;
	}
	toggleStatePlay(song: ZvoogSchedule) {
		console.log('toggleStatePlay');
		this.tryToResumeAudioContext();
		if (this.state == this.stateStoped) {
			if (this.tryToInitPlugins(song)) {
				this.startTicks(
					this.audioContext
					, (when: number, from: number, to: number) => { console.log('onTick', when, from, to); }
					, 0
					, 0
					, 5
					, (loopPosition: number) => { console.log('onEnd', loopPosition); }
				);
			}
		} else {
			this.cancel();
		}
	}
	startTicks(audioContext: AudioContext
		, onTick: (when: number, from: number, to: number) => void
		, loopStart: number
		, loopPosition: number
		, loopEnd: number
		, onEnd: (loopPosition: number) => void
	) {
		if (this.state == this.stateStoped) {
			this.state = this.statePlay;
			this.tick(audioContext, audioContext.currentTime, onTick, loopStart, loopPosition, loopEnd, onEnd);
		}
	}
	tick(audioContext: AudioContext
		, nextAudioTime: number
		, onTick: (when: number, from: number, to: number) => void
		, loopStart: number
		, loopPosition: number
		, loopEnd: number
		, onEnd: (loopPosition: number) => void
	) {
		this.lastPosition = loopPosition;
		if (this.state == this.stateEnding) {
			this.state = this.stateStoped;
			onEnd(loopPosition);
		} else {
			if (this.state == this.statePlay) {
				//console.log((nextAudioTime - this.stepDuration ), audioContext.currentTime);
				if (nextAudioTime - this.stepDuration < audioContext.currentTime) {
					if (loopPosition + this.stepDuration < loopEnd) {
						var from = loopPosition;
						var to = loopPosition + this.stepDuration;
						onTick(nextAudioTime, from, to);
						loopPosition = to;
					} else {
						var from = loopPosition;
						var to = loopEnd;
						onTick(nextAudioTime, from, to);
						from = loopStart;
						to = loopStart + this.stepDuration - (loopEnd - loopPosition);
						if (to < loopEnd) {
							onTick(nextAudioTime + (loopEnd - loopPosition), from, to);
							loopPosition = to;
						} else {
							loopPosition = loopEnd;
						}
					}
					nextAudioTime = nextAudioTime + this.stepDuration;
					if (nextAudioTime < audioContext.currentTime) {
						nextAudioTime = audioContext.currentTime
					}
				}
				var me = this;
				window.requestAnimationFrame(function (time) {
					me.tick(audioContext, nextAudioTime, onTick, loopStart, loopPosition, loopEnd, onEnd);
				});
			}
		}
	}
	cancel() {
		if (this.state == this.statePlay) {
			this.state = this.stateEnding;
		}
	};
}

