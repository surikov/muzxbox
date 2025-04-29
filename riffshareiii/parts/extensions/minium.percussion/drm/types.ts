type ZDRWaveEnvelope = {
	audioBufferSourceNode?: AudioBufferSourceNode | null
	, target: AudioNode
	, when: number
	, duration: number
	, cancel: () => void
	, pitch: number
	, preset: ZDRWavePreset
};
type ZDRWaveAHDSR = {
	duration: number
	, volume: number
};
type ZDRWaveZone = {
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
	, ahdsr?: boolean | ZDRWaveAHDSR[]
};
type ZDRWavePreset = {
	zones: ZDRWaveZone[];
};
type ZDRCachedPreset = {
	variableName: string
	, filePath: string
};
type ZDRPresetInfo = {
	variable: string
	, url: string
	, title: string
	, pitch: number
};
