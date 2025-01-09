let mzxbxProjectForTesting2: Zvoog_Project = {
	title: 'test data for debug'
	,versionCode:'1'
	, list: false
	, selectedPart: {startMeasure: 1,		endMeasure: 1}
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
			, performer: { id: 'firstPerfoemrID', data: '', kind: 'basePitched', outputs: ['track1Volme'], iconPosition: { x: 40, y: 20 } }
		}
		, {
			title: "Second track", volume: 1, measures: [
				{
					chords: [
						{ skip: { count: 3, part: 4 }, pitches: [77], slides: [{ duration: { count: 13, part: 8 }, delta: -1 }] }
					]
				}, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }
			]//, filters: []
			, performer: { id: 'secTrPerfId', data: '', kind: 'basePitched', outputs: ['track2Volme'], iconPosition: { x: 40, y: 49 } }
		}
		, {
			title: "Third track", volume: 1, measures: [
				{ chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }
			]//, filters: []
			, performer: { id: 'at3', data: '', kind: 'basePitched', outputs: ['track3Volme'], iconPosition: { x: 99, y: 44 } }
		}
		, {
			title: "A track 1", volume: 1, measures: [
				{ chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }
			]//, filters: []
			, performer: { id: 'bt3', data: '', kind: 'basePitched', outputs: ['track3Volme'], iconPosition: { x: 88, y: 55 } }
		}, {
			title: "A track 987654321", volume: 1, measures: [
				{ chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }
			]//, filters: []
			, performer: { id: 'ct3', data: '', kind: 'basePitched', outputs: ['track3Volme'], iconPosition: { x: 77, y: 66 } }
		}
	]
	, percussions: [
		{
			title: "Snare", volume: 1, measures: [
				{ skips: [] }, { skips: [{ count: 2, part: 16 }] }, { skips: [] }, { skips: [{ count: 0, part: 16 }] }
			]//, filters: []
			, sampler: { id: 'd1', data: '', kind: 'baseSampler', outputs: ['drum1Volme'], iconPosition: { x: 22, y: 75 } }
		}
		, {
			title: "Snare2", volume: 1, measures: []//, filters: []
			, sampler: { id: 'd2', data: '', kind: 'baseSampler', outputs: ['drum2Volme'], iconPosition: { x: 22, y: 91 } }
		}
		, {
			title: "Snare3", volume: 1, measures: [{ skips: [] }, { skips: [{ count: 1, part: 16 }] }]//, filters: []
			, sampler: { id: 'd3', data: '', kind: 'baseSampler', outputs: ['drum3Volme'], iconPosition: { x: 22, y: 99 } }
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
			id: 'volumeSlide', kind: 'baseVolume', dataBlob: '', outputs: ['masterVolme']
			, automation: [{ changes: [] }, { changes: [{ skip: { count: 5, part: 16 }, stateBlob: 'sss' }, { skip: { count: 1, part: 16 }, stateBlob: 'sss' }] }, { changes: [{ skip: { count: 1, part: 4 }, stateBlob: 'sss2' }] }]
			, iconPosition: { x: 152, y: 39 }
		}
		, {
			id: 'masterVolme', kind: 'base_volume', dataBlob: 'bb1', outputs: ['']
			, automation: [{ changes: [] }, { changes: [] }, { changes: [{ skip: { count: 1, part: 16 }, stateBlob: 's1' }, { skip: { count: 2, part: 16 }, stateBlob: 's1' }, { skip: { count: 3, part: 16 }, stateBlob: 's1' }, { skip: { count: 4, part: 16 }, stateBlob: 's1' }, { skip: { count: 5, part: 16 }, stateBlob: 's1' }, { skip: { count: 6, part: 16 }, stateBlob: 's1' }, { skip: { count: 7, part: 16 }, stateBlob: 's1' }] }, { changes: [] }]
			, iconPosition: { x: 188, y: 7 }
		}
		, { id: 'allDrumsVolme', kind: 'base_volume', dataBlob: '', outputs: ['masterVolme'], iconPosition: { x: 112, y: 87 }, automation: [] }
		, { id: 'drum1Volme', kind: 'base_volume', dataBlob: '', outputs: ['allDrumsVolme'], iconPosition: { x: 52, y: 73 }, automation: [] }
		, { id: 'drum2Volme', kind: 'base_volume', dataBlob: '', outputs: ['allDrumsVolme'], iconPosition: { x: 72, y: 83 }, automation: [] }
		, { id: 'drum3Volme', kind: 'base_volume', dataBlob: '', outputs: ['allDrumsVolme'], iconPosition: { x: 82, y: 119 }, automation: [] }
		, { id: 'track1Volme', kind: 'base_volume', dataBlob: '', outputs: ['volumeSlide'], iconPosition: { x: 132, y: 23 }, automation: [] }
		, { id: 'track2Volme', kind: 'base_volume', dataBlob: '', outputs: ['volumeSlide'], iconPosition: { x: 102, y: 64 }, automation: [] }
		, { id: 'track3Volme', kind: 'base_volume', dataBlob: '', outputs: ['volumeSlide'], iconPosition: { x: 72, y: 30 }, automation: [] }
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



























let mzxbxProjectForTesting3: Zvoog_Project = {
	title: 'test 33 data for debug'
	,versionCode:'1'
	, list: false
	, selectedPart: {startMeasure: 1,		endMeasure: 2}
	, undo: []
	, redo: []
	, position: { x: -13037.9, y: -1317.9, z: 4.007 }
	, timeline: [
		{ tempo: 120, metre: { count: 4, part: 4 } }
		, { tempo: 120, metre: { count: 4, part: 4 } }

		, { tempo: 201, metre: { count: 3, part: 4 } }
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
			title: "Second track", volume: 1, measures: [
				{
					chords: [
						{ skip: { count: 3, part: 4 }, pitches: [77], slides: [{ duration: { count: 13, part: 8 }, delta: -1 }] }
					]
				}, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }
			]//, filters: []
			, performer: { id: 'secTrPerfId', data: '', kind: 'basePitched', outputs: ['track2Volme'], iconPosition: { x: 40, y: 49 } }
		}
		
		, {
			title: "A track 1", volume: 1, measures: [
				{ chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }
			]//, filters: []
			, performer: { id: 'bt3', data: '', kind: 'basePitched', outputs: ['track3Volme'], iconPosition: { x: 88, y: 55 } }
		}
		
		,
		
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
								, { duration: { count: 1, part: 8 }, delta: -57 }
								, { duration: { count: 1, part: 4 }, delta: 0 }
							]
						}
					]
				}, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }
			]//, filters: []
			, performer: { id: 'firstPerfoemrID', data: '', kind: 'basePitched', outputs: ['track1Volme'], iconPosition: { x: 40, y: 20 } }
		}
		, 
		{
			title: "Third track", volume: 1, measures: [
				{ chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }
			]//, filters: []
			, performer: { id: 'at3', data: '', kind: 'basePitched', outputs: ['track3Volme'], iconPosition: { x: 99, y: 44 } }
		}

		, {
			title: "A track 987654321", volume: 1, measures: [
				{ chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }
			]//, filters: []
			, performer: { id: 'ct3', data: '', kind: 'basePitched', outputs: ['track3Volme'], iconPosition: { x: 77, y: 66 } }
		}
	]
	, percussions: [
		{
			title: "Snare", volume: 1, measures: [
				{ skips: [] }, { skips: [{ count: 2, part: 16 }] }, { skips: [] }, { skips: [{ count: 0, part: 16 }] }
			]//, filters: []
			, sampler: { id: 'd1', data: '', kind: 'baseSampler', outputs: ['drum1Volme'], iconPosition: { x: 22, y: 75 } }
		}
		, {
			title: "Snare2", volume: 1, measures: []//, filters: []
			, sampler: { id: 'd2', data: '', kind: 'baseSampler', outputs: ['drum2Volme'], iconPosition: { x: 22, y: 91 } }
		}
		, {
			title: "Snare3", volume: 1, measures: [{ skips: [] }, { skips: [{ count: 1, part: 16 }] }]//, filters: []
			, sampler: { id: 'd3', data: '', kind: 'baseSampler', outputs: ['drum3Volme'], iconPosition: { x: 22, y: 99 } }
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
			id: 'volumeSlide', kind: 'baseVolume', dataBlob: '', outputs: ['masterVolme']
			, automation: [{ changes: [] }, { changes: [{ skip: { count: 5, part: 16 }, stateBlob: 'sss' }, { skip: { count: 1, part: 16 }, stateBlob: 'sss' }] }, { changes: [{ skip: { count: 1, part: 4 }, stateBlob: 'sss2' }] }]
			, iconPosition: { x: 152, y: 39 }
		}
		, {
			id: 'masterVolme', kind: 'base_volume', dataBlob: 'bb1', outputs: ['']
			, automation: [{ changes: [] }, { changes: [] }, { changes: [{ skip: { count: 1, part: 16 }, stateBlob: 's1' }, { skip: { count: 2, part: 16 }, stateBlob: 's1' }, { skip: { count: 3, part: 16 }, stateBlob: 's1' }, { skip: { count: 4, part: 16 }, stateBlob: 's1' }, { skip: { count: 5, part: 16 }, stateBlob: 's1' }, { skip: { count: 6, part: 16 }, stateBlob: 's1' }, { skip: { count: 7, part: 16 }, stateBlob: 's1' }] }, { changes: [] }]
			, iconPosition: { x: 188, y: 7 }
		}
		, { id: 'allDrumsVolme', kind: 'base_volume', dataBlob: '', outputs: ['masterVolme'], iconPosition: { x: 112, y: 87 }, automation: [] }
		, { id: 'drum1Volme', kind: 'base_volume', dataBlob: '', outputs: ['allDrumsVolme'], iconPosition: { x: 52, y: 73 }, automation: [] }
		, { id: 'drum2Volme', kind: 'base_volume', dataBlob: '', outputs: ['allDrumsVolme'], iconPosition: { x: 72, y: 83 }, automation: [] }
		, { id: 'drum3Volme', kind: 'base_volume', dataBlob: '', outputs: ['allDrumsVolme'], iconPosition: { x: 82, y: 119 }, automation: [] }
		, { id: 'track1Volme', kind: 'base_volume', dataBlob: '', outputs: ['volumeSlide'], iconPosition: { x: 132, y: 23 }, automation: [] }
		, { id: 'track2Volme', kind: 'base_volume', dataBlob: '', outputs: ['volumeSlide'], iconPosition: { x: 102, y: 64 }, automation: [] }
		, { id: 'track3Volme', kind: 'base_volume', dataBlob: '', outputs: ['volumeSlide'], iconPosition: { x: 72, y: 30 }, automation: [] }
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












/*
//console.log('testMixerData',testBigMixerData);
let msstart = Date.now();
let diff = new ODiff(mzxbxProjectForTesting2);
let resu = diff.createDocDiffCommands(mzxbxProjectForTesting3);
console.log(structuredClone(resu));
//console.log(diff(mzxbxProjectForTesting2, mzxbxProjectForTesting3));
console.log(Date.now() - msstart, 'difference');
*/

