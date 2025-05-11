type MMWaveEnvelope = {
	audioBufferSourceNode?: AudioBufferSourceNode | null
	, target: AudioNode
	, when: number
	, duration: number
	, cancel: () => void
	, pitch: number
	, preset: MMWavePreset
};
type MMWaveZone = {
	keyRangeLow: number
	, keyRangeHigh: number
	, originalPitch: number
	, coarseTune: number
	, fineTune: number
	, loopStart: number
	, loopEnd: number
	, buffer?: AudioBuffer
	, sampleRate: number
	, delay?: number
	, ahdsr?: boolean | MMWaveAHDSR[]
	, sample?: string
	, file?: string
	, sustain?: number
};
type MMWavePreset = {
	zones: MMWaveZone[];
};
type MMWaveSlide = {
	when: number
	, delta: number
};
type MMWaveAHDSR = {
	duration: number
	, volume: number
};
type MMCachedPreset = {
	variableName: string
	, filePath: string
};
//type ZPNumPair = number[];
type MMPresetInfo = {
	variable: string
	, url: string
	, title: string
	, pitch: number
};
type MMChordQueue = {
	when: number
	, destination: AudioNode
	, preset: MMWavePreset
	, pitch: number
	, duration: number
	, volume?: number
	, slides?: MMWaveSlide[]
};

class MM_WebAudioFontLoader {
	cached: MMCachedPreset[] = [];
	player: MM_WebAudioFontPlayer;
	instrumentKeyArray: string[] = [];
	instrumentNamesArray: string[] = [];
	//choosenInfos: ZPNumPair[] = [];
	drumNamesArray: string[] = [];
	drumKeyArray: string[] = [];
	constructor(player: MM_WebAudioFontPlayer) {
		this.player = player;
	}
	startLoad(audioContext: AudioContext, filePath: string, variableName: string) {
		if (window[variableName]) {
			return;
		}
		for (var i = 0; i < this.cached.length; i++) {
			if (this.cached[i].variableName == variableName) {
				return;
			}
		}
		this.cached.push({
			filePath: filePath,
			variableName: variableName
		});
		var r: HTMLScriptElement = document.createElement('script');
		r.setAttribute("type", "text/javascript");
		r.setAttribute("src", filePath);
		document.getElementsByTagName("head")[0].appendChild(r);
		this.decodeAfterLoading(audioContext, variableName);
	};
	decodeAfterLoading(audioContext: AudioContext, variableName: string) {
		var me = this;
		this.waitOrFinish(variableName, function () {
			me.player.adjustPreset(audioContext, (window[variableName] as any) as MMWavePreset);
		});
	};
	waitOrFinish(variableName: string, onFinish: () => void) {
		if (window[variableName]) {
			onFinish();
		} else {
			var me = this;
			setTimeout(function () {
				me.waitOrFinish(variableName, onFinish);
			}, 111);
		}
	};
	loaded(variableName: string): boolean {
		if (!(window[variableName])) {
			return false;
		}
		var preset: MMWavePreset = (window[variableName] as any) as MMWavePreset;
		for (var i = 0; i < preset.zones.length; i++) {
			if (!(preset.zones[i].buffer)) {
				return false;
			}
		}
		return true;
	};
	progress(): number {
		if (this.cached.length > 0) {
			for (var k = 0; k < this.cached.length; k++) {
				if (!this.loaded(this.cached[k].variableName)) {
					return k / this.cached.length;
				}
			}
			return 1;
		} else {
			return 1;
		}
	};
	waitLoad(onFinish: () => void) {
		var me = this;
		if (this.progress() >= 1) {
			onFinish();
		} else {
			setTimeout(function () {
				me.waitLoad(onFinish);
			}, 333);
		}
	};
	
	instrumentInfo(n: number): MMPresetInfo {
		var key: string = tonechordinstrumentKeys()[n];
		//var key: string = this.instrumentKeys()[n];
		var p = 1 * parseInt(key.substring(0, 3));
		return {
			variable: '_tone_' + key,
			url: 'https://surikov.github.io/webaudiofontdata/sound/' + key + '.js',
			title: tonechordinslist()[p]
			, pitch: -1
		};
	};
	findInstrument(program: number): number {
		
		for (var i = 0; i < tonechordinstrumentKeys().length; i++) {
			if (program == 1 * parseInt(tonechordinstrumentKeys()[i].substring(0, 3))) {
				return i;
			}
		}
		console.log('program', program, 'not found set 0');
		return 0;
	};

}
//'use strict'
//console.log('WebAudioFont Engine v3.0.04 GPL3');
//docs 
//npm link typescript
//npx typedoc player.ts otypes.ts channel.ts loader.ts reverberator.ts ticker.ts

class MM_WebAudioFontPlayer {
	envelopes: MMWaveEnvelope[] = [];
	loader = new MM_WebAudioFontLoader(this);
	//onCacheFinish = null;
	//onCacheProgress = null;
	afterTime = 0.05;
	nearZero = 0.000001;

	limitVolume(volume: number | undefined): number {
		if (volume) {
			volume = 1.0 * volume;
		} else {
			volume = 0.5;
		}
		return volume;
	};
	queueChord(audioContext: AudioContext, target: AudioNode, preset: MMWavePreset, when: number, pitches: number[], duration: number, volume?: number
		//, slides?: ZPWaveSlide[][]
		, slides?: MZXBX_SlideItem[]
	): MMWaveEnvelope[] {
		volume = this.limitVolume(volume);
		var envelopes: MMWaveEnvelope[] = [];
		for (var i = 0; i < pitches.length; i++) {
			//var singleSlide: undefined | ZPWaveSlide[] = undefined;
			//if (slides) {
			//	singleSlide = slides[i];
			//}
			var envlp: MMWaveEnvelope | null = this.queueWaveTable(audioContext, target, preset, when, pitches[i], duration, volume - Math.random() * 0.01, slides);
			if (envlp) envelopes.push(envlp);
		}
		return envelopes;
	};
	queueStrumUp(audioContext: AudioContext, target: AudioNode, preset: MMWavePreset, when: number, tempo: number, pitches: number[], duration: number, volume?: number
		//, slides?: ZPWaveSlide[][]
		, slides?: MZXBX_SlideItem[]
	): MMWaveEnvelope[] {
		pitches.sort(function (a, b) {
			return b - a;
		});
		return this.queueStrum(audioContext, target, preset, when, tempo, pitches, duration, volume, slides);
	};
	queueStrumDown(audioContext: AudioContext, target: AudioNode, preset: MMWavePreset, when: number, tempo: number, pitches: number[], duration: number, volume?: number
		//, slides?: ZPWaveSlide[][]
		, slides?: MZXBX_SlideItem[]
	): MMWaveEnvelope[] {
		pitches.sort(function (a, b) {
			return a - b;
		});
		return this.queueStrum(audioContext, target, preset, when, tempo, pitches, duration, volume, slides);
	};
	queueStrum(audioContext: AudioContext, target: AudioNode, preset: MMWavePreset, when: number, tempo: number, pitches: number[], duration: number, volume?: number
		//, slides?: ZPWaveSlide[][]
		, slides?: MZXBX_SlideItem[]
	): MMWaveEnvelope[] {
		volume = this.limitVolume(volume);
		if (when < audioContext.currentTime) {
			when = audioContext.currentTime;
		}
		//console.log(when);
		when = when + Math.random() * 2 / tempo;
		//console.log('~',when);
		var envelopes: MMWaveEnvelope[] = [];
		let strumStep = 1 / tempo;
		for (var i = 0; i < pitches.length; i++) {
			/*var singleSlide: undefined | ZPWaveSlide[] = undefined;
			if (slides) {
				singleSlide = slides[i];
			}*/
			var envlp: MMWaveEnvelope | null = this.queueWaveTable(audioContext, target, preset, when + i * strumStep, pitches[i], duration, volume - Math.random() * 0.01, slides);
			if (envlp) envelopes.push(envlp);
			volume = 0.9 * volume;
		}
		return envelopes;
	};
	queueSnap(audioContext: AudioContext, target: AudioNode, preset: MMWavePreset, when: number, tempo: number, pitches: number[], duration: number, volume?: number
		//, slides?: ZPWaveSlide[][]
		, slides?: MZXBX_SlideItem[]
	): MMWaveEnvelope[] {
		volume = this.limitVolume(volume);
		volume = 1.5 * (volume || 1.0);
		duration = 0.05;
		return this.queueChord(audioContext, target, preset, when, pitches, duration, volume, slides);
	};
	resumeContext(audioContext: AudioContext) {
		try {
			if (audioContext.state == 'suspended') {
				console.log('audioContext.resume', audioContext);
				audioContext.resume();
			}
		} catch (e) {
			//don't care
		}
	}
	queueWaveTable(audioContext: AudioContext, target: AudioNode, preset: MMWavePreset, when: number, pitch: number, duration: number, volume?: number
		//, slides?: ZPWaveSlide[]
		, slides?: MZXBX_SlideItem[]
	): MMWaveEnvelope | null {
		//target=audioContext.destination;
		this.resumeContext(audioContext);
		volume = this.limitVolume(volume);
		var zone: MMWaveZone | null = this.findZone(audioContext, preset, pitch);
		if (zone) {
			if (!(zone.buffer)) {
				console.log('empty buffer ', zone);
				return null;
			}
			var baseDetune = zone.originalPitch - 100.0 * zone.coarseTune - zone.fineTune;
			var playbackRate = 1.0 * Math.pow(2, (100.0 * pitch - baseDetune) / 1200.0);
			var startWhen = when;
			if (startWhen < audioContext.currentTime) {
				startWhen = audioContext.currentTime;
			}
			var waveDuration = duration + this.afterTime;
			var loop = true;
			if (zone.loopStart < 1 || zone.loopStart >= zone.loopEnd) {
				loop = false;
			}
			if (!loop) {
				if (waveDuration > zone.buffer.duration / playbackRate) {
					waveDuration = zone.buffer.duration / playbackRate;
				}
			}
			var envelope: MMWaveEnvelope = this.findEnvelope(audioContext, target);
			this.setupEnvelope(audioContext, envelope, zone, volume, startWhen, waveDuration, duration);
			envelope.audioBufferSourceNode = audioContext.createBufferSource();
			envelope.audioBufferSourceNode.buffer = zone.buffer;
			//console.log(when,pitch,waveDuration);
			envelope.audioBufferSourceNode.playbackRate.setValueAtTime(playbackRate, when);
			if (slides) {
				if (slides.length > 0) {
					//envelope.audioBufferSourceNode.playbackRate.setValueAtTime(playbackRate, when);
					var newWhen = when;
					for (var i = 0; i < slides.length; i++) {
						var nextPitch = pitch + slides[i].delta;
						var newPlaybackRate = 1.0 * Math.pow(2, (100.0 * nextPitch - baseDetune) / 1200.0);
						newWhen = newWhen + slides[i].duration;
						//console.log(when,newWhen,nextPitch);
						envelope.audioBufferSourceNode.playbackRate.linearRampToValueAtTime(newPlaybackRate, newWhen);
					}
				}
			}

			if (loop) {
				envelope.audioBufferSourceNode.loop = true;
				envelope.audioBufferSourceNode.loopStart = zone.loopStart / zone.sampleRate + ((zone.delay) ? zone.delay : 0);
				envelope.audioBufferSourceNode.loopEnd = zone.loopEnd / zone.sampleRate + ((zone.delay) ? zone.delay : 0);
			} else {
				envelope.audioBufferSourceNode.loop = false;
			}
			envelope.audioBufferSourceNode.connect((envelope as any) as GainNode);
			envelope.audioBufferSourceNode.start(startWhen, zone.delay);
			envelope.audioBufferSourceNode.stop(startWhen + waveDuration);
			envelope.when = startWhen;
			envelope.duration = waveDuration;
			envelope.pitch = pitch;
			envelope.preset = preset;
			//console.log('queueWaveTable',pitch,when,target);
			//console.log('preset',preset);
			//console.log('volume',volume);
			//console.log('envelope',envelope);
			return envelope;
		} else {
			return null
		}
	};
	noZeroVolume(n: number): number {
		if (n > this.nearZero) {
			return n;
		} else {
			return this.nearZero;
		}
	};
	setupEnvelope(audioContext: AudioContext, envelope: MMWaveEnvelope, zone: MMWaveZone, volume: number, when: number, sampleDuration: number, noteDuration: number) {
		((envelope as any) as GainNode).gain.setValueAtTime(this.noZeroVolume(0), audioContext.currentTime);
		var lastTime = 0;
		var lastVolume = 0;
		var duration = noteDuration;
		var zoneahdsr: undefined | boolean | MMWaveAHDSR[] = zone.ahdsr;
		if (sampleDuration < duration + this.afterTime) {
			duration = sampleDuration - this.afterTime;
		}
		if (zoneahdsr) {
			if (!((zoneahdsr as any).length > 0)) {
				zoneahdsr = [{
					duration: 0,
					volume: 1
				}, {
					duration: 0.5,
					volume: 1
				}, {
					duration: 1.5,
					volume: 0.5
				}, {
					duration: 3,
					volume: 0
				}
				];
			}
		} else {
			zoneahdsr = [{
				duration: 0,
				volume: 1
			}, {
				duration: duration,
				volume: 1
			}
			];
		}
		var ahdsr: MMWaveAHDSR[] = zoneahdsr as MMWaveAHDSR[];
		((envelope as any) as GainNode).gain.cancelScheduledValues(when);
		((envelope as any) as GainNode).gain.setValueAtTime(this.noZeroVolume(ahdsr[0].volume * volume), when);
		for (var i = 0; i < ahdsr.length; i++) {
			if (ahdsr[i].duration > 0) {
				if (ahdsr[i].duration + lastTime > duration) {
					var r = 1 - (ahdsr[i].duration + lastTime - duration) / ahdsr[i].duration;
					var n = lastVolume - r * (lastVolume - ahdsr[i].volume);
					((envelope as any) as GainNode).gain.linearRampToValueAtTime(this.noZeroVolume(volume * n), when + duration);
					break;
				}
				lastTime = lastTime + ahdsr[i].duration;
				lastVolume = ahdsr[i].volume;
				((envelope as any) as GainNode).gain.linearRampToValueAtTime(this.noZeroVolume(volume * lastVolume), when + lastTime);
			}
		}
		((envelope as any) as GainNode).gain.linearRampToValueAtTime(this.noZeroVolume(0), when + duration + this.afterTime);
	};
	numValue(aValue: any, defValue: number): number {
		if (typeof aValue === "number") {
			return aValue;
		} else {
			return defValue;
		}
	};
	findEnvelope(audioContext: AudioContext, target: AudioNode): MMWaveEnvelope {
		var envelope: MMWaveEnvelope | null = null;
		for (var i = 0; i < this.envelopes.length; i++) {
			var e = this.envelopes[i];
			if (e.target == target && audioContext.currentTime > e.when + e.duration + 0.001) {
				try {
					if (e.audioBufferSourceNode) {
						e.audioBufferSourceNode.disconnect();
						e.audioBufferSourceNode.stop(0);
						e.audioBufferSourceNode = null;
					}
				} catch (x) {
					//audioBufferSourceNode is dead already
				}
				envelope = e;
				break;
			}
		}
		if (!(envelope)) {
			envelope = (audioContext.createGain() as any) as MMWaveEnvelope;
			envelope.target = target;
			((envelope as any) as GainNode).connect(target);
			envelope.cancel = function () {
				if (envelope && (envelope.when + envelope.duration > audioContext.currentTime)) {
					((envelope as any) as GainNode).gain.cancelScheduledValues(0);
					((envelope as any) as GainNode).gain.setTargetAtTime(0.00001, audioContext.currentTime, 0.1);
					envelope.when = audioContext.currentTime + 0.00001;
					envelope.duration = 0;
				}
			};
			this.envelopes.push(envelope);
		}
		return envelope;
	};
	adjustPreset = function (audioContext: AudioContext, preset: MMWavePreset) {
		for (var i = 0; i < preset.zones.length; i++) {
			this.adjustZone(audioContext, preset.zones[i]);
		}
	};
	adjustZone = function (audioContext: AudioContext, zone: MMWaveZone) {
		if (zone.buffer) {
			//
		} else {
			zone.delay = 0;
			if (zone.sample) {
				var decoded = atob(zone.sample);
				zone.buffer = audioContext.createBuffer(1, decoded.length / 2, zone.sampleRate);
				var float32Array = zone.buffer.getChannelData(0);
				var b1,
					b2,
					n;
				for (var i = 0; i < decoded.length / 2; i++) {
					b1 = decoded.charCodeAt(i * 2);
					b2 = decoded.charCodeAt(i * 2 + 1);
					if (b1 < 0) {
						b1 = 256 + b1;
					}
					if (b2 < 0) {
						b2 = 256 + b2;
					}
					n = b2 * 256 + b1;
					if (n >= 65536 / 2) {
						n = n - 65536;
					}
					float32Array[i] = n / 65536.0;
				}
			} else {
				if (zone.file) {
					var datalen = zone.file.length;
					var arraybuffer = new ArrayBuffer(datalen);
					var view = new Uint8Array(arraybuffer);
					var decoded = atob(zone.file);
					var b;
					for (var i = 0; i < decoded.length; i++) {
						b = decoded.charCodeAt(i);
						view[i] = b;
					}
					audioContext.decodeAudioData(arraybuffer, function (audioBuffer) {
						zone.buffer = audioBuffer;
					});
				}
			}
			zone.loopStart = this.numValue(zone.loopStart, 0);
			zone.loopEnd = this.numValue(zone.loopEnd, 0);
			zone.coarseTune = this.numValue(zone.coarseTune, 0);
			zone.fineTune = this.numValue(zone.fineTune, 0);
			zone.originalPitch = this.numValue(zone.originalPitch, 6000);
			zone.sampleRate = this.numValue(zone.sampleRate, 44100);
			zone.sustain = this.numValue(zone.originalPitch, 0);
		}
	};
	findZone(audioContext: AudioContext, preset: MMWavePreset, pitch: number): MMWaveZone | null {
		var zone: MMWaveZone | null = null;
		for (var i = preset.zones.length - 1; i >= 0; i--) {
			zone = preset.zones[i];
			if (zone.keyRangeLow <= pitch && zone.keyRangeHigh + 1 >= pitch) {
				break;
			}
		}
		try {
			if (zone) this.adjustZone(audioContext, zone);
		} catch (ex) {
			console.log('adjustZone', ex);
		}
		return zone;
	};
	cancelQueue(audioContext: AudioContext) {
		for (var i = 0; i < this.envelopes.length; i++) {
			var e = this.envelopes[i];
			((e as any) as GainNode).gain.cancelScheduledValues(0);
			((e as any) as GainNode).gain.setValueAtTime(this.nearZero, audioContext.currentTime);
			e.when = -1;
			try {
				if (e.audioBufferSourceNode) e.audioBufferSourceNode.disconnect();
			} catch (ex) {
				console.log(ex);
			}
		}
	};
}
