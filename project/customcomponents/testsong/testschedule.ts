let testSchedule: MZXBX_Schedule = {
	series: [
		{
			duration: 1, items: [
				{ skip: 0, channelId: 'ch1', pitch: 12 * 5 + 0, volume: 0.75, slides: [{ duration: 0.25, delta: 0 }] }
				, { skip: 0, channelId: 'ch1', pitch: 12 * 5 + 4, volume: 0.75, slides: [{ duration: 0.25, delta: 0 }] }
				, { skip: 0, channelId: 'ch1', pitch: 12 * 5 + 7, volume: 0.75, slides: [{ duration: 0.25, delta: 0 }] }
				, { skip: 0.25, channelId: 'ch1', pitch: 12 * 5 + 12, volume: 0.75, slides: [{ duration: 0.75, delta: 0 }] }
			],states:[]
		}, {
			duration: 1, items: [
				{ skip: 0, channelId: 'ch1', pitch: 12 * 5 + 0, volume: 0.75, slides: [{ duration: 0.25, delta: 0 }] }
				, { skip: 0, channelId: 'ch1', pitch: 12 * 5 + 4, volume: 0.75, slides: [{ duration: 0.25, delta: 0 }] }
				, { skip: 0, channelId: 'ch1', pitch: 12 * 5 + 7, volume: 0.75, slides: [{ duration: 0.25, delta: 0 }] }
				, {
					skip: 0.25, channelId: 'ch1', pitch: 12 * 5 + 12, volume: 0.75, slides: [
						{ duration: 0.15, delta: 1 }
						, { duration: 0.15, delta: -1 }
						, { duration: 0.15, delta: 1 }
						, { duration: 0.15, delta: -1 }
						, { duration: 0.15, delta: 1 }
					]
				}
			],states:[]
		}
	]
	, channels: [{
		id: "ch1"
		, filters: []
		, performer: { id: 'p1', kind: 'sinewave_performer_1_test', properties: '' }
	}]
	, filters: [
		{ id: "f1", kind: "volume_filter_1_test", properties: "75%" }
		, { id: "f2", kind: "echo_filter_1_test", properties: "0.2" }
	]
};
console.log('testSchedule', testSchedule);