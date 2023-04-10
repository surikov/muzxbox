type VoxEnvelope = {
	audioBufferSourceNode: AudioBufferSourceNode
	, when: number
	, duration: number
	, out: GainNode
};
class PerformerVoxPlugin implements MZXBX_AudioPerformerPlugin {
	out: GainNode;
	parameters = "";
	audioContext: AudioContext;
	waveready = false;
	afterTime = 0.05;
	nearZero = 0.000001;
	audioBuffer: null | AudioBuffer = null;
	envelopes: VoxEnvelope[] = [];
	launch(context: AudioContext, parameters: string): void {
		if (!(this.out)) {
			this.audioContext = context;
			this.out = this.audioContext.createGain();
			this.parameters = parameters;
		}
		if (!this.waveready) {
			let me = this;
			let datalen = this.parameters.length / 2;
			let parArrayBuffer = new ArrayBuffer(datalen);
			let view = new Uint8Array(parArrayBuffer);
			let decoded = atob(this.parameters);
			for (var i = 0; i < decoded.length; i++) {
				view[i] = decoded.charCodeAt(i);
			}
			console.log('start decode wav');
			context.decodeAudioData(parArrayBuffer, function (audioBuffer) {
				me.audioBuffer = audioBuffer;
				console.log('wav audioBuffer', audioBuffer);
				me.waveready = true;
			});
		}
	}
	busy(): string | null {
		if (this.waveready) {
			return null;
		} else {
			return "loading wave";
		}
	}
	schedule(when: number, pitch: number, slides: MZXBX_SlideItem[]): void {
		console.log('vox',when);
		let involume = 1.0;
		let duration = 0;
		for (let i = 0; i < slides.length; i++) {
			duration = duration + slides[i].duration;
		}
		//var waveDuration = duration + this.afterTime;
		var envelope: VoxEnvelope = this.findEnvelope(this.audioContext, this.out);
		envelope.when = when;
		envelope.duration = duration + this.afterTime;
		envelope.out.gain.cancelScheduledValues(when);
		envelope.out.gain.setValueAtTime(this.noZeroVolume(involume), when);
		envelope.out.gain.setValueAtTime(this.noZeroVolume(involume), when + duration);
		envelope.out.gain.linearRampToValueAtTime(this.noZeroVolume(0), when + duration + this.afterTime);
		envelope.out.disconnect();
		envelope.out.connect(this.out);
		envelope.audioBufferSourceNode.start(when, 0);
		envelope.audioBufferSourceNode.stop(when + duration + this.afterTime);
	}
	output(): AudioNode | null {
		return this.out;
	}
	cancel(): void {

	}
	noZeroVolume(n: number): number {
		if (n > this.nearZero) {
			return n;
		} else {
			return this.nearZero;
		}
	};
	findEnvelope(audioContext: AudioContext, out: AudioNode): VoxEnvelope {
		for (var i = 0; i < this.envelopes.length; i++) {
			var e: VoxEnvelope = this.envelopes[i];
			if (audioContext.currentTime > e.when + e.duration + 0.001) {
				try {
					if (e.audioBufferSourceNode) {
						e.audioBufferSourceNode.disconnect();
						e.audioBufferSourceNode.disconnect();
						e.audioBufferSourceNode.stop(0);
					}
				} catch (x) {
					//audioBufferSourceNode is dead already
				}
				e.audioBufferSourceNode = this.audioContext.createBufferSource();
				e.audioBufferSourceNode.buffer = this.audioBuffer;
				e.audioBufferSourceNode.connect(e.out);
				return e;
			}
		}
		let envelope: VoxEnvelope = {
			audioBufferSourceNode: this.audioContext.createBufferSource()
			, when: 0
			, duration: 0
			, out: audioContext.createGain()
		};
		envelope.audioBufferSourceNode.buffer = this.audioBuffer;
		envelope.audioBufferSourceNode.connect(envelope.out);
		this.envelopes.push(envelope);
		return envelope;
	};

}
function testPluginVoxPerf(): MZXBX_AudioPerformerPlugin {
	return new PerformerVoxPlugin();
}
