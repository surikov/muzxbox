let _mzxbxProjectForTesting2: Zvoog_Project = {
	title: 'test data for debug'
	, versionCode: '1'
	, list: false
	, selectedPart: { startMeasure: 1, endMeasure: 1 }
	, undo: []
	, redo: []
	, position: { x: -13037.9, y: -1317.9, z: 4.7 }
	, timeline: [
		{ tempo: 120, metre: { count: 4, part: 4 } }
		, { tempo: 120, metre: { count: 4, part: 4 } }

		, { tempo: 200, metre: { count: 3, part: 4 } }
		, { tempo: 180, metre: { count: 4, part: 4 } }

		, { tempo: 200, metre: { count: 3, part: 4 } }
		, { tempo: 180, metre: { count: 4, part: 4 } }

		, { tempo: 200, metre: { count: 3, part: 4 } }
		, { tempo: 180, metre: { count: 4, part: 4 } }

		, { tempo: 200, metre: { count: 3, part: 4 } }
		, { tempo: 180, metre: { count: 4, part: 4 } }
	]
	, tracks: [
		{
			title: "Track one", volume: 1, measures: [
				{
					chords: [
						/*{ skip: { count: 0, part: 1 }, notes: [{ pitch: 25, slides: [{ duration: { count: 1, part: 8 }, delta: 0 }] }] }
						, { skip: { count: 1, part: 16 }, notes: [{ pitch: 26, slides: [{ duration: { count: 1, part: 8 }, delta: 0 }] }] }
						, { skip: { count: 1, part: 8 }, notes: [{ pitch: 27, slides: [{ duration: { count: 1, part: 8 }, delta: 0 }] }] }
						, { skip: { count: 3, part: 16 }, notes: [{ pitch: 28, slides: [{ duration: { count: 1, part: 8 }, delta: 0 }] }] }
						, { skip: { count: 1, part: 4 }, notes: [{ pitch: 29, slides: [{ duration: { count: 1, part: 8 }, delta: 0 }] }] }
						, { skip: { count: 5, part: 16 }, notes: [{ pitch: 30, slides: [{ duration: { count: 1, part: 8 }, delta: 0 }] }] }
						, { skip: { count: 3, part: 8 }, notes: [{ pitch: 31, slides: [{ duration: { count: 1, part: 8 }, delta: 0 }] }] }
						, { skip: { count: 7, part: 16 }, notes: [{ pitch: 32, slides: [{ duration: { count: 1, part: 8 }, delta: 0 }] }] }
						, { skip: { count: 1, part: 2 }, notes: [{ pitch: 33, slides: [{ duration: { count: 1, part: 8 }, delta: 0 }] }] }
						*/
						{ skip: { count: 0, part: 1 }, pitches: [25], slides: [{ duration: { count: 1, part: 8 }, delta: 0 }] }
						, { skip: { count: 1, part: 16 }, pitches: [26], slides: [{ duration: { count: 1, part: 8 }, delta: 0 }] }
						, { skip: { count: 1, part: 8 }, pitches: [27], slides: [{ duration: { count: 1, part: 8 }, delta: 0 }] }
						, { skip: { count: 3, part: 16 }, pitches: [28], slides: [{ duration: { count: 1, part: 8 }, delta: 0 }] }
						, { skip: { count: 1, part: 4 }, pitches: [29], slides: [{ duration: { count: 1, part: 8 }, delta: 0 }] }
						, { skip: { count: 5, part: 16 }, pitches: [30], slides: [{ duration: { count: 1, part: 8 }, delta: 0 }] }
						, { skip: { count: 3, part: 8 }, pitches: [31], slides: [{ duration: { count: 1, part: 8 }, delta: 0 }] }
						, { skip: { count: 7, part: 16 }, pitches: [32], slides: [{ duration: { count: 1, part: 8 }, delta: 0 }] }
						, { skip: { count: 1, part: 2 }, pitches: [33], slides: [{ duration: { count: 1, part: 8 }, delta: 0 }] }


					]
				}, {
					chords: [
						//{ skip: { count: 0, part: 2 }, notes: [{ pitch: 31, slides: [] }] }
						{
							skip: { count: 0, part: 2 }, pitches: [60], slides: [
								{ duration: { count: 1, part: 8 }, delta: 5 }
								, { duration: { count: 1, part: 8 }, delta: -5 }
								, { duration: { count: 1, part: 4 }, delta: 0 }
							]
						}
					]
				}, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }
			]//, filters: []
			, performer: { id: 'firstPerfoemrID', data: '77', kind: 'zinstr1', outputs: ['track1Volme'], iconPosition: { x: 40, y: 20 }, state: 0 }
		}
		, {
			title: "Second track", volume: 1, measures: [
				{
					chords: [
						{ skip: { count: 3, part: 4 }, pitches: [44, 47, 49], slides: [{ duration: { count: 5, part: 8 }, delta: -5 }] }
					]
				}
				, { chords: [] }
				, { chords: [] }
				, { chords: [] }
				, { chords: [] }
				, { chords: [] }
				, { chords: [] }
				, { chords: [] }
				, { chords: [] }
				, { chords: [] }
			]//, filters: []
			, performer: { id: 'secTrPerfId', data: '34', kind: 'zinstr1', outputs: ['track2Volme'], iconPosition: { x: 40, y: 49 }, state: 0 }
		}
		, {
			title: "Third track", volume: 1, measures: [
				{ chords: [] }
				, { chords: [] }
				, { chords: [] }
				, { chords: [] }
				, { chords: [] }
				, { chords: [] }
				, { chords: [] }
				, { chords: [] }
				, { chords: [] }
				, { chords: [] }
			]//, filters: []
			, performer: { id: 'at3', data: '23', kind: 'zinstr1', outputs: ['track3Volme'], iconPosition: { x: 99, y: 44 }, state: 0 }
		}
		, {
			title: "A track 1", volume: 1, measures: [
				{ chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }
			]//, filters: []
			, performer: { id: 'bt3', data: '29', kind: 'zinstr1', outputs: ['track3Volme'], iconPosition: { x: 88, y: 55 }, state: 0 }
		}, {
			title: "A track 987654321", volume: 1, measures: [
				{ chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }
				, { chords: [] }
			]//, filters: []
			, performer: { id: 'ct3', data: '44', kind: 'zinstr1', outputs: ['track3Volme'], iconPosition: { x: 77, y: 66 }, state: 0 }
		}
	]
	, percussions: [
		{
			title: "Snare", volume: 1, measures: [
				{ skips: [] }, { skips: [{ count: 2, part: 16 }] }, { skips: [] }, { skips: [{ count: 0, part: 16 }] }
			]//, filters: []
			, sampler: { id: 'd1', data: '39', kind: 'zdrum1', outputs: ['drum1Volme'], iconPosition: { x: 22, y: 75 }, state: 0 }
		}
		, {
			title: "Snare2", volume: 1, measures: []//, filters: []
			, sampler: { id: 'd2', data: '41', kind: 'zdrum1', outputs: ['drum2Volme'], iconPosition: { x: 22, y: 91 }, state: 0 }
		}
		, {
			title: "Snare3", volume: 1, measures: [{ skips: [] }, { skips: [{ count: 1, part: 16 }] }]//, filters: []
			, sampler: { id: 'd3', data: '47', kind: 'zdrum1', outputs: ['drum3Volme'], iconPosition: { x: 22, y: 99 }, state: 0 }
		}
	]
	, comments: [{ points: [{ skip: { count: 2, part: 16 }, text: '1-2/16', row: 0 }] }, {
		points: [
			{ skip: { count: 0, part: 16 }, text: '20', row: 0 }
			, { skip: { count: 1, part: 16 }, text: '21', row: 1 }
			, { skip: { count: 2, part: 16 }, text: '22', row: 2 }
			, { skip: { count: 3, part: 16 }, text: '23', row: 0 }
			, { skip: { count: 4, part: 16 }, text: '24', row: 1 }
			, { skip: { count: 5, part: 16 }, text: '25', row: 2 }
			, { skip: { count: 6, part: 16 }, text: '26', row: 0 }
			, { skip: { count: 7, part: 16 }, text: '27', row: 1 }
			, { skip: { count: 8, part: 16 }, text: '28\ntest', row: 2 }
			, { skip: { count: 9, part: 16 }, text: '29', row: 0 }
			, { skip: { count: 10, part: 16 }, text: '2-10', row: 1 }
			, { skip: { count: 11, part: 16 }, text: '2-11', row: 2 }
			, { skip: { count: 12, part: 16 }, text: '2-12', row: 0 }
			, { skip: { count: 13, part: 16 }, text: '2-13', row: 1 }
			, { skip: { count: 14, part: 16 }, text: '2-14', row: 2 }
			, { skip: { count: 15, part: 16 }, text: '2-15', row: 0 }

		]
	}, { points: [{ skip: { count: 2, part: 16 }, text: '3-2/16', row: 0 }] }
		, { points: [{ skip: { count: 2, part: 16 }, text: '4-2/16', row: 0 }] }
		, { points: [{ skip: { count: 2, part: 16 }, text: '5-2/16', row: 0 }] }]
	, filters: [
		{
			id: 'volumeSlide', kind: 'zvolume1', data: '99', outputs: ['masterVolme']
			, automation: [{ changes: [] }, {
				changes: [
					//{ skip: { count: 5, part: 16 }, stateBlob: '99' }
					//, { skip: { count: 1, part: 16 }, stateBlob: '99' }
				]
			}
				, {
					changes: [
						{ skip: { count: 1, part: 4 }, stateBlob: '99' }
					]
			}]
			, iconPosition: { x: 152, y: 39 }, state: 0
		}
		, {
			id: 'masterVolme', kind: 'zvolume1', data: '99', outputs: ['']
			, automation: [{ changes: [] }, { changes: [] }
				, {
				changes: [
					/*{ skip: { count: 1, part: 16 }, stateBlob: '99' }
					, { skip: { count: 2, part: 16 }, stateBlob: '99' }
					, { skip: { count: 3, part: 16 }, stateBlob: '99' }
					, { skip: { count: 4, part: 16 }, stateBlob: '99' }
					, { skip: { count: 5, part: 16 }, stateBlob: '99' }
					, { skip: { count: 6, part: 16 }, stateBlob: '99' }
					, { skip: { count: 7, part: 16 }, stateBlob: '99' }*/
				]
			}
				, { changes: [] }]
			, iconPosition: { x: 188, y: 7 }, state: 0
		}
		, { id: 'allDrumsVolme', kind: 'zvolume1', data: '99', outputs: ['masterVolme'], iconPosition: { x: 112, y: 87 }, automation: [], state: 0 }
		, { id: 'drum1Volme', kind: 'zvolume1', data: '99', outputs: ['allDrumsVolme'], iconPosition: { x: 52, y: 73 }, automation: [], state: 0 }
		, { id: 'drum2Volme', kind: 'zvolume1', data: '99', outputs: ['allDrumsVolme'], iconPosition: { x: 72, y: 83 }, automation: [], state: 0 }
		, { id: 'drum3Volme', kind: 'zvolume1', data: '99', outputs: ['allDrumsVolme'], iconPosition: { x: 82, y: 119 }, automation: [], state: 0 }
		, { id: 'track1Volme', kind: 'zvolume1', data: '99', outputs: ['volumeSlide'], iconPosition: { x: 132, y: 23 }, automation: [], state: 0 }
		, { id: 'track2Volme', kind: 'zvolume1', data: '99', outputs: ['volumeSlide'], iconPosition: { x: 102, y: 64 }, automation: [], state: 0 }
		, { id: 'track3Echo', kind: 'zvecho1', data: '100', outputs: ['volumeSlide'], iconPosition: { x: 72, y: 30 }, automation: [], state: 0 }
	]
	/*
	, automations: [
		{ output: 'masterVolme', title: 'test1122', measures: [{ changes: [] }, { changes: [] }, { changes: [{ skip: { count: 1, part: 16 }, stateBlob: 's1' }, { skip: { count: 2, part: 16 }, stateBlob: 's1' }, { skip: { count: 3, part: 16 }, stateBlob: 's1' }, { skip: { count: 4, part: 16 }, stateBlob: 's1' }, { skip: { count: 5, part: 16 }, stateBlob: 's1' }, { skip: { count: 6, part: 16 }, stateBlob: 's1' }, { skip: { count: 7, part: 16 }, stateBlob: 's1' }] }, { changes: [] }] }
		, { output: 'volumeSlide', title: 'Simple test', measures: [{ changes: [] }, { changes: [{ skip: { count: 5, part: 16 }, stateBlob: 'sss' }, { skip: { count: 1, part: 16 }, stateBlob: 'sss' }] }, { changes: [{ skip: { count: 1, part: 4 }, stateBlob: 'sss2' }] }] }
	]
	*/
	/*, theme: {
		notePathHeight: 0.5
		, widthDurationRatio: 17
		, octaveCount: 10
	}*/
};












