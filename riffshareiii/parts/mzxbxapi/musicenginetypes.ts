
type Zvoog_Metre = {
	count: number;
	part: number;
};
interface Zvoog_MetreMathType {
	count: number;
	part: number;
	set(from: Zvoog_Metre): Zvoog_MetreMathType;
	metre(): Zvoog_Metre;
	simplyfy(): Zvoog_MetreMathType;
	strip(toPart: number): Zvoog_MetreMathType;
	equals(metre: Zvoog_Metre): boolean;
	less(metre: Zvoog_Metre): boolean;
	more(metre: Zvoog_Metre): boolean;
	plus(metre: Zvoog_Metre): Zvoog_MetreMathType;
	minus(metre: Zvoog_Metre): Zvoog_MetreMathType;
	duration(tempo: number): number;
	calculate(duration: number, tempo: number): Zvoog_MetreMathType;
}
type Zvoog_Slide = {
	duration: Zvoog_Metre;
	delta: number;
};
/*
type Zvoog_Note = {
	pitch: number;
	slides: Zvoog_Slide[];
};
*/
type Zvoog_PluginBase = {
	setup: (audioContext: AudioContext) => boolean;
};
type Zvoog_PluginFilter = Zvoog_PluginBase | {
	input: string;
};
type Zvoog_PluginPerformer = Zvoog_PluginBase | {
	output: string;
	schedule: (chord: Zvoog_Chord, when: number) => boolean;
};
type Zvoog_PluginSampler = Zvoog_PluginBase | {
	output: string;
};
type Zvoog_FilterTarget = {
	id: string;
	kind: string;
	data: string;
	outputs: string[];
	automation: Zvoog_FilterMeasure[];
	iconPosition: { x: number, y: number };
	state: 0 | 1;//on|off
	title:string;
};
type Zvoog_AudioSequencer = {
	id: string;
	data: string;
	kind: string;
	outputs: string[];
	iconPosition: { x: number, y: number };
	state: 0 | 1 | 2;//on|mute|solo
};
type Zvoog_AudioSampler = {
	id: string;
	data: string;
	kind: string;
	outputs: string[];
	iconPosition: { x: number, y: number };
	state: 0 | 1 | 2;//on|mute|solo
};
type Zvoog_Chord = {
	skip: Zvoog_Metre;
	//notes: Zvoog_Note[];
	pitches: number[];
	slides: Zvoog_Slide[];
};
type Zvoog_TrackMeasure = {
	chords: Zvoog_Chord[];
};
type Zvoog_PercussionMeasure = {
	skips: Zvoog_Metre[];
};
type Zvoog_SongMeasure = {
	tempo: number;
	metre: Zvoog_Metre;
};
/*
type Zvoog_AutomationTrack = {
	title: string;
	measures: Zvoog_FilterMeasure[];
	output:string;
};
*/
type Zvoog_FilterMeasure = {
	changes: Zvoog_FilterStateChange[];
};
type Zvoog_FilterStateChange = {
	skip: Zvoog_Metre;
	stateBlob: string;
};

type Zvoog_PercussionTrack = {
	title: string;
	measures: Zvoog_PercussionMeasure[];
	sampler: Zvoog_AudioSampler;
	//volume: number;
};
type Zvoog_MusicTrack = {
	title: string;
	//active?:boolean;
	measures: Zvoog_TrackMeasure[];
	performer: Zvoog_AudioSequencer;
	//volume: number;
};
type Zvoog_CommentText = {
	skip: Zvoog_Metre;
	text: string;
	row: number;
};
type Zvoog_CommentMeasure = {
	points: Zvoog_CommentText[];
};

type Zvoog_Selection = {
	startMeasure: number;
	endMeasure: number;
};
/*
type Zvoog_Command = {
	id: string;
	parameters: string;
}
*/
/*
type Zvoog_Command = {
	kind: string;
	position: {
		x: number;
		y: number;
		z: number;
	};
	params: any;
};*/
type DifferenceCreate = {
	kind: "+";
	path: (string | number)[];
	newNode: any;
}

type DifferenceRemove = {
	kind: "-";
	path: (string | number)[];
	oldNode: any;
}

type DifferenceChange = {
	kind: "=";
	path: (string | number)[];
	newValue: any;
	oldValue: any;
}
type Zvoog_Action = DifferenceCreate | DifferenceRemove | DifferenceChange;

type Zvoog_UICommand = {
	position: {
		x: number,
		y: number,
		z: number
	};
	actions: Zvoog_Action[];
};

type Zvoog_Project = {
	versionCode: '1'
	title: string;
	timeline: Zvoog_SongMeasure[];
	tracks: Zvoog_MusicTrack[];
	percussions: Zvoog_PercussionTrack[];
	comments: Zvoog_CommentMeasure[];
	filters: Zvoog_FilterTarget[];
	selectedPart: Zvoog_Selection;
	position: {
		x: number;
		y: number;
		z: number;
	};
	list: boolean;
	//undo: Zvoog_UICommand[];//Zvoog_Command[];
	//redo: Zvoog_UICommand[];//Zvoog_Command[];
};











///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////








type MZXBX_CachedWave = {
	path: string;
	buffer: AudioBuffer | null;
	canceled?: boolean;
	line100?: number[];
};
type MZXBX_FilterHolder = {
	plugin: MZXBX_AudioFilterPlugin | null
	, filterId: string
	, kind: string
	, properties: string
	, description: string
};
type MZXBX_PerformerSamplerHolder = {
	plugin: MZXBX_AudioPerformerPlugin | MZXBX_AudioSamplerPlugin | null
	, channelId: string
	, kind: string
	, properties: string
	, description: string
};
type MZXBX_Channel = {
	id: string;
	//comment?: string;
	//filters: MZXBX_ChannelFilter[];
	performer: MZXBX_ChannelSource;
	outputs: string[];
};
type MZXBX_SlideItem = {
	duration: number;
	delta: number;
}
type MZXBX_PlayItem = {
	skip: number;
	channelId: string;
	pitches: number[];
	slides: MZXBX_SlideItem[];
};
type MZXBX_FilterState = {
	skip: number;
	filterId: string;
	data: string;
};
type MZXBX_Set = {
	duration: number;
	tempo: number;
	items: MZXBX_PlayItem[];
	states: MZXBX_FilterState[];
};
type MZXBX_Filter = {
	id: string;
	kind: string;
	properties: string;
	outputs: string[];
	description:string;
};
type MZXBX_AudioFilterPlugin = {
	launch: (context: AudioContext, parameters: string) => void;
	busy: () => null | string;
	schedule: (when: number, tempo: number, parameters: string) => void;
	input: () => AudioNode | null;
	output: () => AudioNode | null;
};
/*
type MZXBX_ChannelSampler = {
	id: string;
	kind: string;
	properties: string;
};
*/
type MZXBX_AudioSamplerPlugin = {
	launch: (context: AudioContext, parameters: string) => void;
	busy: () => null | string;
	start: (when: number, tempo: number) => void;
	cancel: () => void;
	output: () => AudioNode | null;
	duration: () => number;
};

type MZXBX_ChannelSource = {
	//id: string;
	kind: string;
	properties: string;
	description:string;
};

type MZXBX_AudioPerformerPlugin = {
	launch: (context: AudioContext, parameters: string) => void;
	busy: () => null | string;
	strum: (when: number, pitches: number[], tempo: number, slides: MZXBX_SlideItem[]) => void;
	cancel: () => void;
	output: () => AudioNode | null;
};
type MZXBX_Schedule = {
	series: MZXBX_Set[];
	channels: MZXBX_Channel[];
	filters: MZXBX_Filter[];
};
type MZXBX_Player = {
	startSetupPlugins: (context: AudioContext, schedule: MZXBX_Schedule) => string | null;
	startLoopTicks: (from: number, position: number, to: number) => string;
	reconnectAllPlugins: (schedule: MZXBX_Schedule) => void;
	cancel: () => void;
	allFilters(): MZXBX_FilterHolder[];
	allPerformersSamplers(): MZXBX_PerformerSamplerHolder[];
	position: number;
	playState(): { connected: boolean, play: boolean, loading: boolean };
};
/*
type Zvoog_import = {
	import: () => Zvoog_Schedule | null;
};*/
/*
enum MZXBX_PluginPurpose {
	Action
	, Filter
	, Sampler
	, Performer
}*/
type MZXBX_PluginRegistrationInformation = {
	label: string
	, kind: string
	, purpose: 'Action' | 'Filter' | 'Sampler' | 'Performer'
	, ui: string
	, evaluate: string
	, script: string
};
/*
type MZXBX_PluginMessage = {
	dialogID: string
	, data: any
};*/
type MZXBX_MessageToPlugin = {
	hostData: any
};
type MZXBX_MessageToHost = {
	dialogID: string
	, pluginData: any
	, done: boolean
};
