type PercussionWaveEnvelope = {
	audioBufferSourceNode?: AudioBufferSourceNode | null
	, target: AudioNode
	, when: number
	, duration: number
	, cancel: () => void
	, pitch: number
	, preset: PercussionWavePreset
};
type PercussionWaveAHDSR = {
	duration: number
	, volume: number
};
type PercussionWaveZone = {
	keyRangeLow: number
	, keyRangeHigh: number
	, originalPitch: number
	, coarseTune: number
	, fineTune: number
	, loopStart: number
	, loopEnd: number
	, buffer?: AudioBuffer
	, sampleRate: number
	, sample?: string
	, file?: string
	, sustain?: number
	, ahdsr?: boolean | PercussionWaveAHDSR[]
};
type PercussionWavePreset = {
	zones: PercussionWaveZone[];
};
type PercussionCachedPreset = {
	variableName: string
	, filePath: string
};
type PercussionPresetInfo = {
	variable: string
	, url: string
	, title: string
	, pitch: number
};
