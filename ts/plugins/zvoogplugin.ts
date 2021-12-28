class ZvoogPluginLock {
	lockedState: boolean;
	lock(): void {
		this.lockedState = true;
	}
	unlock(): void {
		this.lockedState = false;
	}
	locked(): boolean {
		return this.lockedState;
	}
}
interface ZvoogPluginParameter {
	cancelScheduledValues(cancelTime: number): void;
	linearRampToValueAtTime(value: number, endTime: number): void;
	setValueAtTime(value: number, startTime: number): void;
}
class RangedAudioParam120 implements ZvoogPluginParameter {
	baseParam: ZvoogPluginParameter;
	minValue: number;
	maxValue: number;
	constructor(base: ZvoogPluginParameter, min: number, max: number) {
		this.baseParam = base;
		this.minValue = min;
		this.maxValue = max;
	}
	recalulate(value: number): number {
		if (value < 0) console.log('wrong 1-119', value);
		if (value < 0) value = 0;
		if (value > 119) value = 119;
		let ratio = (this.maxValue - this.minValue) / 119;
		let nn = this.minValue + value * ratio;
		//console.log('recalulate', value, 'min', this.minValue, 'max', this.maxValue, 'result', nn);
		return nn;
	}
	cancelScheduledValues(cancelTime: number): void {
		this.baseParam.cancelScheduledValues(cancelTime);
	}
	linearRampToValueAtTime(value: number, endTime: number): void {
		this.baseParam.linearRampToValueAtTime(this.recalulate(value), endTime);
	}
	setValueAtTime(value: number, startTime: number): void {
		this.baseParam.setValueAtTime(this.recalulate(value), startTime);
	}
}
interface ZvoogPlugin {
	getParams(): ZvoogPluginParameter[]; //parameters automation
	getOutput(): AudioNode;
	prepare(audioContext: AudioContext, data: string): void;
	busy(): number;
	state(): ZvoogPluginLock;
	passthrough(value: boolean): void;
}







