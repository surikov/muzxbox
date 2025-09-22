class EventsConverter {
	constructor(parser: MidiParser) {

	}
	convertEvents():Zvoog_Project {
		let project: Zvoog_Project = {
			title: 'test'
			, timeline: []
			, tracks: []
			, percussions: []
			, filters: []
			//,automations: []
			, comments: []
			, selectedPart: {
				startMeasure: -1
				, endMeasure: -1
			}
			, versionCode: '1'
			, list: false
			, position: { x: 0, y: 0, z: 30 }

			, menuPerformers: false
			, menuSamplers: false
			, menuFilters: false
			, menuActions: false
			, menuPlugins: false
			, menuClipboard: false
			, menuSettings: false
		};
		return project;
	}
}
