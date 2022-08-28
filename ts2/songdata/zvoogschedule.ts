type ZvoogSchedule = {
	title: string
	, tracks: ZvoogTrack[]
	, filters: ZvoogFilterSetting[]
	, measures: ZvoogMeasure[]
	, harmony: ZvoogProgression
	, rhythm?: ZvoogMeter[]
};
function scheduleSecondsDuration(song: ZvoogSchedule): number {
	var ss = 0;
	for (var i = 0; i < song.measures.length; i++) {
		ss = ss + meter2seconds(song.measures[i].tempo, song.measures[i].meter);
	}
	return ss;
}
let defaultEmptySchedule: ZvoogSchedule = {
	title: 'Empty project'
	, tracks: [
		{
			title: "First", filters: [], percussions: [], instruments: [
				{
					filters: []
					, title: 'Single'
					, instrumentSetting: { instrumentPlugin: null, parameters: [], kind: 'none', initial: '' }
					, measureChords: [{
						chords: [
							{
								when: { count: 1, division: 4 }, variation: 0
								, envelopes: [{
									pitches: [{ duration: { count: 5, division: 8 }, pitch: 24 }
										, { duration: { count: 1, division: 8 }, pitch: 36 }]
								}]
							}
						]
					}
						, { chords: [] }
						, { chords: [] }
					]
				}
				, {
					filters: []
					, title: 'Another'
					, instrumentSetting: { instrumentPlugin: null, parameters: [], kind: 'wafinstrument', initial: '33' }
					, measureChords: [
						{
							chords: [
								{
									when: { count: 0, division: 8 }, variation: 0, envelopes: [{
										pitches: [
											{ duration: { count: 1, division: 4 }, pitch: 22 }
											, { duration: { count: 0, division: 8 }, pitch: 34 }
										]
									}]
								}
								//, { when: { count: 1, division: 8 }, variation: 0, envelopes: [{ pitches: [{ duration: { count: 1, division: 8 }, pitch: 34 }] }] }
								, {
									when: { count: 2, division: 8 }, variation: 0, envelopes: [{
										pitches: [
											{ duration: { count: 1, division: 8 }, pitch: 22 }
											, { duration: { count: 1, division: 8 }, pitch: 46 }
											, { duration: { count: 0, division: 8 }, pitch: 34 }
										]
									}]
								}
								//, { when: { count: 3, division: 8 }, variation: 0, envelopes: [{ pitches: [{ duration: { count: 1, division: 8 }, pitch: 34 },{ duration: { count: 0, division: 16 }, pitch: 22 }] }] }
								//, { when: { count: 3, division: 8 }, variation: 0, envelopes: [{ pitches: [{ duration: { count: 1, division: 8 }, pitch: 34 }] }] }
								, { when: { count: 4, division: 8 }, variation: 0, envelopes: [{ pitches: [{ duration: { count: 1, division: 4 }, pitch: 22 }] }] }
								//, { when: { count: 5, division: 8 }, variation: 0, envelopes: [{ pitches: [{ duration: { count: 1, division: 8 }, pitch: 34 }] }] }
							]
						}
						, {
							chords: [{ when: { count: 0, division: 8 }, variation: 0, envelopes: [{ pitches: [{ duration: { count: 1, division: 8 }, pitch: 5 }] }] }
								, { when: { count: 1, division: 8 }, variation: 0, envelopes: [{ pitches: [{ duration: { count: 1, division: 8 }, pitch: 17 }] }] }
								, { when: { count: 2, division: 8 }, variation: 0, envelopes: [{ pitches: [{ duration: { count: 1, division: 8 }, pitch: 5 }] }] }
								, { when: { count: 3, division: 8 }, variation: 0, envelopes: [{ pitches: [{ duration: { count: 1, division: 8 }, pitch: 17 }] }] }
								, { when: { count: 4, division: 8 }, variation: 0, envelopes: [{ pitches: [{ duration: { count: 1, division: 8 }, pitch: 29 }] }] }
								, { when: { count: 5, division: 8 }, variation: 0, envelopes: [{ pitches: [{ duration: { count: 1, division: 8 }, pitch: 17 }] }] }
								, { when: { count: 6, division: 8 }, variation: 0, envelopes: [{ pitches: [{ duration: { count: 1, division: 8 }, pitch: 5 }] }] }
								, { when: { count: 7, division: 8 }, variation: 0, envelopes: [{ pitches: [{ duration: { count: 1, division: 8 }, pitch: 17 }] }] }
							]
						}
						, {
							chords: [
								{ when: { count: 0, division: 8 }, variation: 0, envelopes: [{ pitches: [{ duration: { count: 1, division: 8 }, pitch: 10 }] }] }
								, { when: { count: 1, division: 8 }, variation: 0, envelopes: [{ pitches: [{ duration: { count: 1, division: 8 }, pitch: 22 }] }] }
								, { when: { count: 2, division: 8 }, variation: 0, envelopes: [{ pitches: [{ duration: { count: 1, division: 8 }, pitch: 10 }] }] }
								, { when: { count: 3, division: 8 }, variation: 0, envelopes: [{ pitches: [{ duration: { count: 1, division: 8 }, pitch: 22 }] }] }
								, { when: { count: 4, division: 8 }, variation: 0, envelopes: [{ pitches: [{ duration: { count: 1, division: 8 }, pitch: 10 }] }] }
								, { when: { count: 5, division: 8 }, variation: 0, envelopes: [{ pitches: [{ duration: { count: 1, division: 8 }, pitch: 22 }] }] }
								, { when: { count: 6, division: 8 }, variation: 0, envelopes: [{ pitches: [{ duration: { count: 1, division: 8 }, pitch: 10 }] }] }
								, { when: { count: 7, division: 8 }, variation: 0, envelopes: [{ pitches: [{ duration: { count: 1, division: 8 }, pitch: 22 }] }] }
							]
						}
					]
				}
			]
		}
		, {
			title: "Second", filters: [], percussions: [], instruments: [
				{
					filters: []
					, title: 'Another'
					, instrumentSetting: { instrumentPlugin: null, parameters: [], kind: 'none', initial: '' }
					, measureChords: [
						{ chords: [] }
						, { chords: [] }
						, {
							chords: [{
								when: { count: 1, division: 8 }, variation: 0, envelopes: [
									{ pitches: [{ duration: { count: 14, division: 16 }, pitch: 70 }] }
									, { pitches: [{ duration: { count: 14, division: 16 }, pitch: 77 }] }
								]
							}]
						}
					]
				}
			]
		}
	]
	, filters: [
		{
			filterPlugin: null
			, parameters: [{
				points: [
					{ skipMeasures: 0, skipSteps: { count: 0, division: 2 }, velocity: 99 }
					, { skipMeasures: 1, skipSteps: { count: 1, division: 2 }, velocity: 22 }
					, { skipMeasures: 0, skipSteps: { count: 1, division: 32 }, velocity: 72 }
				]
				, caption: 'test gain'
			}]
			, kind: 'gain'
			, initial: ''
		}
		/*, {
			filterPlugin: null
			, parameters: [{
				points: [
					{ skipMeasures: 0, skipSteps: { count: 1, division: 4 }, velocity: 88 }
					, { skipMeasures: 2, skipSteps: { count: 2, division: 4 }, velocity: 88 }
					, { skipMeasures: 0, skipSteps: { count: 1, division: 16 }, velocity: 22 }
					, { skipMeasures: 0, skipSteps: { count: 1, division: 16 }, velocity: 66 }
					, { skipMeasures: 1, skipSteps: { count: 1, division: 2 }, velocity: 44 }
				]
				, caption: 'another echo'
			}]
			, kind: 'echo'
			, initial: ''
		}*/
	]
	, measures: [
		{ meter: { count: 3, division: 4 }, tempo: 120, points: [] }
		, { meter: { count: 4, division: 4 }, tempo: 90, points: [] }
		, { meter: { count: 4, division: 4 }, tempo: 150, points: [] }
	]
	, harmony: { tone: '', mode: '', progression: [] }
};
