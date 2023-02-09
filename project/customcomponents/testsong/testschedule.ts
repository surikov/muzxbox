let testSchedule: MZXBX_Schedule = {
	series: []
	, channels: [{
		id: "ch1"
		, filters: []
		, performer: {
			id: 'p1'
			, kind: 'sinewave_performer_1_test'
			, properties: ''
		}
	}]
	, filters: [{ id: "f1", kind: "volume_filter_1_test", properties: "" }, { id: "f2", kind: "echo_filter_1_test", properties: "" }]
};
console.log('testSchedule',testSchedule);