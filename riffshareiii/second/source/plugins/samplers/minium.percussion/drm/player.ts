'use strict'
//console.log('WebAudioFont Engine v3.0.04 GPL3');
//docs 
//npm link typescript
//npx typedoc player.ts otypes.ts channel.ts loader.ts reverberator.ts ticker.ts

class PercussionWebAudioFontPlayer {
	envelopes: PercussionWaveEnvelope[] = [];
	loader = new PercussionWebAudioFontLoader();
	//onCacheFinish = null;
	//onCacheProgress = null;
	afterTime = 0.05;
	nearZero = 0.000001;
	/*createChannel(audioContext: AudioContext) {
		return new WebAudioFontChannel(audioContext);
	};
	createReverberator(audioContext: AudioContext) {
		return new WebAudioFontReverberator(audioContext);
	};*/
	limitVolume(volume: number | undefined): number {
		if (volume) {
			volume = 1.0 * volume;
		} else {
			volume = 0.5;
		}
		return volume;
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
	queueWaveTable(audioContext: AudioContext, target: AudioNode, preset: PercussionWavePreset, when: number, pitch: number, duration: number, volume: number): PercussionWaveEnvelope | null {
		this.resumeContext(audioContext);
		volume = this.limitVolume(volume);
		var zone: PercussionWaveZone | null = this.findZone(audioContext, preset, pitch);
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
			var envelope: PercussionWaveEnvelope = this.findEnvelope(audioContext, target);
			this.setupEnvelope(audioContext, envelope, zone, volume, startWhen, waveDuration, duration);
			envelope.audioBufferSourceNode = audioContext.createBufferSource();
			envelope.audioBufferSourceNode.playbackRate.setValueAtTime(playbackRate, 0);
			envelope.audioBufferSourceNode.buffer = zone.buffer;
			if (loop) {
				envelope.audioBufferSourceNode.loop = true;
				envelope.audioBufferSourceNode.loopStart = zone.loopStart / zone.sampleRate;
				envelope.audioBufferSourceNode.loopEnd = zone.loopEnd / zone.sampleRate;
			} else {
				envelope.audioBufferSourceNode.loop = false;
			}
			envelope.audioBufferSourceNode.connect((envelope as any) as GainNode);
			envelope.audioBufferSourceNode.start(startWhen);
			envelope.audioBufferSourceNode.stop(startWhen + waveDuration);
			envelope.when = startWhen;
			envelope.duration = waveDuration;
			envelope.pitch = pitch;
			envelope.preset = preset;
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
	setupEnvelope(audioContext: AudioContext, envelope: PercussionWaveEnvelope, zone: PercussionWaveZone, volume: number, when: number, sampleDuration: number, noteDuration: number) {
		((envelope as any) as GainNode).gain.setValueAtTime(this.noZeroVolume(0), audioContext.currentTime);
		var lastTime = 0;
		var lastVolume = 0;
		var duration = noteDuration;
		var zoneahdsr: undefined | boolean | PercussionWaveAHDSR[] = zone.ahdsr;
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
		var ahdsr: PercussionWaveAHDSR[] = zoneahdsr as PercussionWaveAHDSR[];
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
	findEnvelope(audioContext: AudioContext, target: AudioNode): PercussionWaveEnvelope {
		var envelope: PercussionWaveEnvelope | null = null;
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
			envelope = (audioContext.createGain() as any) as PercussionWaveEnvelope;
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
	
	findZone(audioContext: AudioContext, preset: PercussionWavePreset, pitch: number): PercussionWaveZone | null {
		var zone: PercussionWaveZone | null = null;
		for (var i = preset.zones.length - 1; i >= 0; i--) {
			zone = preset.zones[i];
			if (zone.keyRangeLow <= pitch && zone.keyRangeHigh + 1 >= pitch) {
				break;
			}
		}
		try {
			if (zone) this.loader.adjustZone(audioContext, zone);
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
