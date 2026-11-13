function createNewEmptyProjectData(): Zvoog_Project {
	let pianoID = 'piano' + Math.random();
	let newEmptyProject: Zvoog_Project = {
		title: 'New Project'
		, versionCode: '1'
		, farorder: []
		, list: false
		, modeNameHint: 'Aeolian F#'
		, selectedPart: { startMeasure: -1, endMeasure: -1 }
		, position: { x: 0, y: -0, z: 33 }
		, timeline: [
			{
				tempo: 120, metre: { count: 4, part: 4 }, chordNameHint: 'Dm'//, modality: { tonic: { step: 0, shift: 0 }, mode: [], chord: [] }
			}
			, {
				tempo: 120, metre: { count: 4, part: 4 }, chordNameHint: 'C'//, modality: { tonic: { step: 0, shift: 0 }, mode: [], chord: [] }
			}
			, {
				tempo: 120, metre: { count: 4, part: 4 }, chordNameHint: 'G'//, modality: { tonic: { step: 0, shift: 0 }, mode: [], chord: [] }
			}
			, {
				tempo: 120, metre: { count: 4, part: 4 }, chordNameHint: 'Am'//, modality: { tonic: { step: 0, shift: 0 }, mode: [], chord: [] }
			}

		]
		, tracks: [
			{
				title: "Piano track"
				, measures: [{ chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }]
				, performer: { id: pianoID, data: '85/14/0', kind: 'miniumpitchchord1', outputs: [''], iconPosition: { x: 50 * Math.random(), y: 100 * Math.random() }, state: 0, hint1_128: 0 }
			}
		]
		, patterns: [
			{
				title: 'test stem'
				, measures: [
					{ points: [] }, { points: [] }, { points: [{ skip: { count: 1, part: 8 }, duration: { count: 9, part: 4 } }] }, { points: [] }
				]
				, arpeggiator: {
					id: 'test' + Math.random()
					, data: ''
					, kind: 'miniumactivestem1'
					, iconPosition: { x: 20, y: 20 }
					, state: 0
				}
			}
		]
		, percussions: []
		, comments: []
		, filters: []
		, menuPerformers: false, menuSamplers: false, menuFilters: false, menuActions: false, menuPlugins: false, menuClipboard: false, menuSettings: false
	};
	return newEmptyProject

}























