
function createNewTR808synth(): MZXBX_AudioSamplerPlugin {
	type BoomDrum = {
		start: (when: number, tempo: number) => void;
		cancel: () => void;
		duration: () => number;
		done: number;
	};
	class TR808Synth implements MZXBX_AudioSamplerPlugin {
		acontext: AudioContext;
		drumOutput: GainNode;
		launch(context: AudioContext, parameters: string): number {
			this.acontext = context;
			this.drumOutput = this.acontext.createGain();
			return 0;
		}
		busy(): null | string {
			return null;
		};
		start(when: number, tempo: number): void {

		}
		cancel(): void {

		};
		output(): AudioNode | null {
			return this.drumOutput;
		};
		duration(): number {
			return 0;
		}
	}
	return new TR808Synth();
}
