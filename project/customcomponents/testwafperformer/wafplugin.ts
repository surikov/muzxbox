class PublicWAFMIDITonePerformerPlayer {
	audioContext: AudioContext;
	setup(context: AudioContext): void {
		if (!(this.audioContext)) {
			this.audioContext = context;
		}
	}
	startLoadPreset(nn: number) {

	}
	presetReady(nn: number): boolean {
		return true;
	}
	presetLoaded(nn:number):boolean{
		return true;
	}

	send(when: number, volume: number, pitch: number, slides: MZXBX_SlideItem[]): void {

	}
	cancel(): void {
	}
}
class PerformerPluginWAF implements MZXBX_AudioPerformerPlugin {
	out: GainNode;
	player: PublicWAFMIDITonePerformerPlayer;
	program: -1;
	reset(context: AudioContext, parameters: string): boolean {
		if (this.player) {
			return true;
		} else {
			if (window['PublicDefaultBaseOscillatorPlayer']) {
				//
			} else {
				window['DefaultPublicWAFTonePerformerPlayer'] = new PublicWAFMIDITonePerformerPlayer();
				(window['DefaultPublicWAFTonePerformerPlayer'] as PublicWAFMIDITonePerformerPlayer).setup(context);
			}
			this.player = window['DefaultPublicWAFTonePerformerPlayer'] as PublicWAFMIDITonePerformerPlayer;
			return true;
		}
	}
	schedule(when: number, volume: number, pitch: number, slides: MZXBX_SlideItem[]): void {
		this.player.send(when, volume, pitch, slides);
	}
	output(): AudioNode | null {
		return this.out;
	}
	cancel(): void {
		this.player.cancel();
	}
}
function testPluginWAF(): MZXBX_AudioPerformerPlugin {
	return new PerformerPluginWAF();
}
