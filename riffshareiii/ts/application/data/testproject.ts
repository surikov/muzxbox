let mzxbxProjectForTesting2: Zvoog_Project = {
	title: 'test data for debug'
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
			title: "Track one", measures: [
				{
					chords: [
						{ skip: { count: 0, part: 1 }, notes: [{ pitch: 25, slides: [{ duration: { count: 1, part: 8 }, delta: 0 }] }] }
						, { skip: { count: 1, part: 16 }, notes: [{ pitch: 26, slides: [{ duration: { count: 1, part: 8 }, delta: 0 }] }] }
						, { skip: { count: 1, part: 8 }, notes: [{ pitch: 27, slides: [{ duration: { count: 1, part: 8 }, delta: 0 }] }] }
						, { skip: { count: 3, part: 16 }, notes: [{ pitch: 28, slides: [{ duration: { count: 1, part: 8 }, delta: 0 }] }] }
						, { skip: { count: 1, part: 4 }, notes: [{ pitch: 29, slides: [{ duration: { count: 1, part: 8 }, delta: 0 }] }] }
						, { skip: { count: 5, part: 16 }, notes: [{ pitch: 30, slides: [{ duration: { count: 1, part: 8 }, delta: 0 }] }] }
						, { skip: { count: 3, part: 8 }, notes: [{ pitch: 31, slides: [{ duration: { count: 1, part: 8 }, delta: 0 }] }] }
						, { skip: { count: 7, part: 16 }, notes: [{ pitch: 32, slides: [{ duration: { count: 1, part: 8 }, delta: 0 }] }] }
						, { skip: { count: 1, part: 2 }, notes: [{ pitch: 33, slides: [{ duration: { count: 1, part: 8 }, delta: 0 }] }] }
					]
				}, {
					chords: [
						{ skip: { count: 0, part: 2 }, notes: [{ pitch: 31, slides: [] }] }
					]
				}, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }
			]//, filters: []
			, performer: { id: 'firstPerfoemrID', data: '', kind: 'basePitched', outputId: 'track1Volme', iconPosition: { x: 27, y: 20 } }
		}
		, {
			title: "Second track", measures: [
				{ chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }
			]//, filters: []
			, performer: { id: 'secTrPerfId', data: '', kind: 'basePitched', outputId: 'track2Volme', iconPosition: { x: 110, y: 69 } }
		}
		, {
			title: "Third track", measures: [
				{ chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }
			]//, filters: []
			, performer: { id: 't3', data: '', kind: 'basePitched', outputId: 'track3Volme', iconPosition: { x: 60, y: 33 } }
		}
	]
	, percussions: [
		{
			title: "Snare", measures: [
				{ skips: [] }, { skips: [{ count: 2, part: 16 }] }, { skips: [] }, { skips: [{ count: 0, part: 16 }] }
			]//, filters: []
			, sampler: { id: 'd1', data: '', kind: 'baseSampler', outputId: 'drum1Volme', iconPosition: { x: 44, y: 55 } }
		}
		, {
			title: "Snare2", measures: []//, filters: []
			, sampler: { id: 'd2', data: '', kind: 'baseSampler', outputId: 'drum2Volme', iconPosition: { x: 23, y: 41 } }
		}
		, {
			title: "Snare3", measures: [{ skips: [] }, { skips: [{ count: 1, part: 16 }] }]//, filters: []
			, sampler: { id: 'd3', data: '', kind: 'baseSampler', outputId: 'drum3Volme', iconPosition: { x: 112, y: 223 } }
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
			id: 'volumeSlide', kind: 'baseVolume', dataBlob: '', outputId: 'masterVolme'
			, automation: { title: 'Simple test', measures: [{ changes: [] }, { changes: [{ skip: { count: 5, part: 16 }, stateBlob: 'sss' }, { skip: { count: 1, part: 16 }, stateBlob: 'sss' }] }, { changes: [{ skip: { count: 1, part: 4 }, stateBlob: 'sss2' }] }] }
			,iconPosition:{x:62,y:39}
		}
		, {
			id: 'masterVolme', kind: 'base_volume', dataBlob: 'bb1', outputId: ''
			, automation: { title: 'test1122', measures: [{ changes: [] }, { changes: [] }, { changes: [{ skip: { count: 1, part: 16 }, stateBlob: 's1' }, { skip: { count: 2, part: 16 }, stateBlob: 's1' }, { skip: { count: 3, part: 16 }, stateBlob: 's1' }, { skip: { count: 4, part: 16 }, stateBlob: 's1' }, { skip: { count: 5, part: 16 }, stateBlob: 's1' }, { skip: { count: 6, part: 16 }, stateBlob: 's1' }, { skip: { count: 7, part: 16 }, stateBlob: 's1' }] }, { changes: [] }] }
			,iconPosition:{x:28,y:77}
		}
		, { id: 'allDrumsVolme', kind: 'base_volume', dataBlob: '', outputId: 'volumeSlide', automation: null ,iconPosition:{x:132,y:33}}
		, { id: 'drum1Volme', kind: 'base_volume', dataBlob: '', outputId: 'allDrumsVolme', automation: null ,iconPosition:{x:42,y:93}}
		, { id: 'drum2Volme', kind: 'base_volume', dataBlob: '', outputId: 'allDrumsVolme', automation: null,iconPosition:{x:112,y:53} }
		, { id: 'drum3Volme', kind: 'base_volume', dataBlob: '', outputId: 'allDrumsVolme', automation: null,iconPosition:{x:182,y:9} }
		, { id: 'track1Volme', kind: 'base_volume', dataBlob: '', outputId: 'volumeSlide', automation: null ,iconPosition:{x:132,y:23}}
		, { id: 'track2Volme', kind: 'base_volume', dataBlob: '', outputId: 'volumeSlide', automation: null ,iconPosition:{x:162,y:4}}
		, { id: 'track3Volme', kind: 'base_volume', dataBlob: '', outputId: 'volumeSlide', automation: null ,iconPosition:{x:172,y:83}}
	]
	/*, theme: {
		notePathHeight: 0.5
		, widthDurationRatio: 17
		, octaveCount: 10
	}*/
};
let testBigMixerData = {
	title: 'test data for debug'
	, timeline: [
		{ tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }
		, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }
		, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }
		, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }

		, { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } }
		, { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } }
		, { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } }
		, { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } }

		, { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } }
		, { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } }
		, { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } }
		, { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } }

		, { tempo: 120, metre: { count: 7, part: 8 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }
		, { tempo: 120, metre: { count: 2, part: 2 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }
		, { tempo: 120, metre: { count: 5, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }
		, { tempo: 120, metre: { count: 3, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }

		, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }
		, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }
		, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }
		, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }

		, { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } }
		, { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } }
		, { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } }
		, { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } }, { tempo: 140, metre: { count: 3, part: 4 } }

		, { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } }
		, { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } }
		, { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } }
		, { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } }, { tempo: 180, metre: { count: 4, part: 4 } }

		, { tempo: 120, metre: { count: 7, part: 8 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }
		, { tempo: 120, metre: { count: 2, part: 2 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }
		, { tempo: 120, metre: { count: 5, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }
		, { tempo: 120, metre: { count: 3, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }, { tempo: 120, metre: { count: 4, part: 4 } }
	]
	, notePathHeight: 0.25
	, widthDurationRatio: 15
	, pitchedTracks: [
		{ title: 'Test track 1' }
		, { title: 'Test track 2' }
		, { title: 'Test track 3' }
		, { title: 'Test track 4' }
		, { title: 'Test track 5' }
		, { title: 'Test track 6' }
		, { title: 'Test track 7' }
		, { title: 'Test track 8' }
		, { title: 'Test track 9' }
		, { title: 'Test track 10' }
		, { title: 'Test track 11' }
		, { title: 'Test track 12' }
		, { title: 'Test track 13' }
		, { title: 'Test track 14' }
		, { title: 'Test track 15' }
		, { title: 'Test track 16' }
	]
	/*, drumsTracks: [
		{ title: 'Test drums 1' }
		, { title: 'Test drums 2' }
		, { title: 'Test drums 3' }
		, { title: 'Test drums 4' }
		, { title: 'Test drums 5' }
		, { title: 'Test drums 6' }
		, { title: 'Test drums 7' }
		, { title: 'Test drums 8' }
		, { title: 'Test drums 9' }
		, { title: 'Test drums 10' }
	]*/
};
let testEmptyMixerData = {
	title: 'small data for debug'
	, timeline: [
		{ tempo: 120, metre: { count: 4, part: 4 } }
	]
	, notePathHeight: 0.25
	, widthDurationRatio: 11
	, pitchedTracks: [
		{ title: 'A track1' }
		, { title: 'Second track' }
	]
	/*, drumsTracks: [
		{ title: 'Test drums 1' }
		, { title: 'Test drums 2' }
		, { title: 'Test drums 3' }
		, { title: 'Test drums 4' }
		, { title: 'Test drums 5' }
		, { title: 'Test drums 6' }
		, { title: 'Test drums 7' }
		, { title: 'Test drums 8' }
		, { title: 'Test drums 9' }
		, { title: 'Test drums 10' }
	]*/
};
//console.log('testMixerData',testBigMixerData);
