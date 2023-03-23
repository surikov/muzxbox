"use strict";
let testSchedule = {
    series: [
        {
            duration: 1, items: [
                { skip: 0, channelId: 'bass', pitch: 12 * 3 + 0, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0.25, channelId: 'bass', pitch: 12 * 4 + 0, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0.5, channelId: 'bass', pitch: 12 * 3 + 0, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0.75, channelId: 'bass', pitch: 12 * 4 + 0, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0, channelId: 'pad', pitch: 12 * 5 + 0, slides: [{ duration: 0.26, delta: 4 }, { duration: 0.24, delta: 0 }, { duration: 0.23, delta: 4 }, { duration: 0.27, delta: 0 }] },
                { skip: 0, channelId: 'pad', pitch: 12 * 5 + 0 + 4, slides: [{ duration: 0.26, delta: 4 }, { duration: 0.24, delta: 0 }, { duration: 0.23, delta: 4 }, { duration: 0.27, delta: 0 }] },
                { skip: 0, channelId: 'pad', pitch: 12 * 5 + 0 + 7, slides: [{ duration: 0.26, delta: 4 }, { duration: 0.24, delta: 0 }, { duration: 0.23, delta: 4 }, { duration: 0.27, delta: 0 }] }
            ], states: [
                { skip: 0, filterId: 'bassVolume123', data: '10%' }
            ]
        }, {
            duration: 1, items: [
                { skip: 0, channelId: 'bass', pitch: 12 * 2 + 5, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0.25, channelId: 'bass', pitch: 12 * 3 + 5, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0.5, channelId: 'bass', pitch: 12 * 2 + 5, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0.75, channelId: 'bass', pitch: 12 * 3 + 5, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0, channelId: 'pad', pitch: 12 * 5 + 5, slides: [{ duration: 0.99, delta: 7 }] },
                { skip: 0, channelId: 'pad', pitch: 12 * 5 + 5 + 4, slides: [{ duration: 0.98, delta: 7 }] },
                { skip: 0, channelId: 'pad', pitch: 12 * 5 + 5 + 7, slides: [{ duration: 0.96, delta: 7 }] }
            ], states: [
                { skip: 0, filterId: 'bassVolume123', data: '15%' }
            ]
        }, {
            duration: 1, items: [
                { skip: 0, channelId: 'bass', pitch: 12 * 2 + 7, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0.25, channelId: 'bass', pitch: 12 * 3 + 7, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0.5, channelId: 'bass', pitch: 12 * 2 + 7, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0.75, channelId: 'bass', pitch: 12 * 3 + 7, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0, channelId: 'pad', pitch: 12 * 5 + 7, slides: [{ duration: 1, delta: 0 }] },
                { skip: 0, channelId: 'pad', pitch: 12 * 5 + 7 + 4, slides: [{ duration: 1, delta: 0 }] },
                { skip: 0, channelId: 'pad', pitch: 12 * 5 + 7 + 7, slides: [{ duration: 1, delta: 0 }] }
            ], states: [
                { skip: 0, filterId: 'bassVolume123', data: '20%' }
            ]
        }, {
            duration: 1, items: [
                { skip: 0, channelId: 'bass', pitch: 12 * 2 + 9, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0.25, channelId: 'bass', pitch: 12 * 3 + 9, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0.5, channelId: 'bass', pitch: 12 * 2 + 9, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0.75, channelId: 'bass', pitch: 12 * 3 + 4, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0, channelId: 'pad', pitch: 12 * 5 + 9, slides: [{ duration: 1, delta: 0 }] },
                { skip: 0, channelId: 'pad', pitch: 12 * 5 + 9 + 3, slides: [{ duration: 1, delta: 0 }] },
                { skip: 0, channelId: 'pad', pitch: 12 * 5 + 9 + 7, slides: [{ duration: 1, delta: 0 }] },
                { skip: 0, channelId: 'drumSnare', pitch: 0, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0.25, channelId: 'drumSnare', pitch: 0, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0.5, channelId: 'drumSnare', pitch: 0, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0.75, channelId: 'drumSnare', pitch: 0, slides: [{ duration: 0.25, delta: 0 }] }
            ], states: [
                { skip: 0, filterId: 'bassVolume123', data: '25%' }
            ]
        },
        {
            duration: 1, items: [
                { skip: 0, channelId: 'bass', pitch: 12 * 3 + 0, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0.25, channelId: 'bass', pitch: 12 * 4 + 0, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0.5, channelId: 'bass', pitch: 12 * 3 + 0, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0.75, channelId: 'bass', pitch: 12 * 4 + 0, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0, channelId: 'pad', pitch: 12 * 5 + 0, slides: [{ duration: 1, delta: 0 }] },
                { skip: 0, channelId: 'pad', pitch: 12 * 5 + 0 + 4, slides: [{ duration: 1, delta: 0 }] },
                { skip: 0, channelId: 'pad', pitch: 12 * 5 + 0 + 7, slides: [{ duration: 1, delta: 0 }] },
                { skip: 0, channelId: 'drumBass', pitch: 0, slides: [{ duration: 0.5, delta: 0 }] },
                { skip: 0.5, channelId: 'drumSnare', pitch: 0, slides: [{ duration: 0.5, delta: 0 }] },
                { skip: 0, channelId: 'hihat', pitch: 0, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0.25, channelId: 'hihat', pitch: 0, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0.5, channelId: 'hihat', pitch: 0, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0.75, channelId: 'hihat', pitch: 0, slides: [{ duration: 0.25, delta: 0 }] }
            ], states: [
                { skip: 0, filterId: 'bassVolume123', data: '50%' }
            ]
        }, {
            duration: 1, items: [
                { skip: 0, channelId: 'bass', pitch: 12 * 2 + 5, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0.25, channelId: 'bass', pitch: 12 * 3 + 5, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0.5, channelId: 'bass', pitch: 12 * 2 + 5, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0.75, channelId: 'bass', pitch: 12 * 3 + 5, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0, channelId: 'pad', pitch: 12 * 5 + 5, slides: [{ duration: 1, delta: 0 }] },
                { skip: 0, channelId: 'pad', pitch: 12 * 5 + 5 + 4, slides: [{ duration: 1, delta: 0 }] },
                { skip: 0, channelId: 'pad', pitch: 12 * 5 + 5 + 7, slides: [{ duration: 1, delta: 0 }] },
                { skip: 0, channelId: 'drumBass', pitch: 0, slides: [{ duration: 0.5, delta: 0 }] },
                { skip: 0.5, channelId: 'drumSnare', pitch: 0, slides: [{ duration: 0.5, delta: 0 }] },
                { skip: 0, channelId: 'hihat', pitch: 0, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0.25, channelId: 'hihat', pitch: 0, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0.5, channelId: 'hihat', pitch: 0, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0.75, channelId: 'hihat', pitch: 0, slides: [{ duration: 0.25, delta: 0 }] }
            ], states: []
        }, {
            duration: 1, items: [
                { skip: 0, channelId: 'bass', pitch: 12 * 2 + 7, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0.25, channelId: 'bass', pitch: 12 * 3 + 7, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0.5, channelId: 'bass', pitch: 12 * 2 + 7, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0.75, channelId: 'bass', pitch: 12 * 3 + 7, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0, channelId: 'pad', pitch: 12 * 5 + 7, slides: [{ duration: 1, delta: 0 }] },
                { skip: 0, channelId: 'pad', pitch: 12 * 5 + 7 + 4, slides: [{ duration: 1, delta: 0 }] },
                { skip: 0, channelId: 'pad', pitch: 12 * 5 + 7 + 7, slides: [{ duration: 1, delta: 0 }] },
                { skip: 0, channelId: 'drumBass', pitch: 0, slides: [{ duration: 0.5, delta: 0 }] },
                { skip: 0.5, channelId: 'drumSnare', pitch: 0, slides: [{ duration: 0.5, delta: 0 }] },
                { skip: 0, channelId: 'hihat', pitch: 0, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0.25, channelId: 'hihat', pitch: 0, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0.5, channelId: 'hihat', pitch: 0, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0.75, channelId: 'hihat', pitch: 0, slides: [{ duration: 0.25, delta: 0 }] }
            ], states: []
        }, {
            duration: 1, items: [
                { skip: 0, channelId: 'bass', pitch: 12 * 2 + 9, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0.25, channelId: 'bass', pitch: 12 * 3 + 9, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0.5, channelId: 'bass', pitch: 12 * 2 + 9, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0.75, channelId: 'bass', pitch: 12 * 3 + 4, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0, channelId: 'pad', pitch: 12 * 5 + 9, slides: [{ duration: 1, delta: 0 }] },
                { skip: 0, channelId: 'pad', pitch: 12 * 5 + 9 + 3, slides: [{ duration: 1, delta: 0 }] },
                { skip: 0, channelId: 'pad', pitch: 12 * 5 + 9 + 7, slides: [{ duration: 1, delta: 0 }] },
                { skip: 0, channelId: 'drumBass', pitch: 0, slides: [{ duration: 0.5, delta: 0 }] },
                { skip: 0.5, channelId: 'drumSnare', pitch: 0, slides: [{ duration: 0.5, delta: 0 }] },
                { skip: 0, channelId: 'hihat', pitch: 0, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0.25, channelId: 'hihat', pitch: 0, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0.5, channelId: 'hihat', pitch: 0, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0.75, channelId: 'hihat', pitch: 0, slides: [{ duration: 0.25, delta: 0 }] }
            ], states: []
        }
    ],
    channels: [{
            id: "bass",
            filters: [{ id: "bassVolume123", kind: "volume_filter_1_test", properties: "50%" }],
            performer: { id: 'p1', kind: 'waf_performer_1_test', properties: '40' }
        }, {
            id: "drumSnare",
            filters: [{ id: "dr1", kind: "volume_filter_1_test", properties: "95%" }],
            performer: { id: 'snaredrum', kind: 'drums_performer_1_test', properties: '40' }
        }, {
            id: "drumBass",
            filters: [{ id: "dr2", kind: "volume_filter_1_test", properties: "50%" }],
            performer: { id: 'bassdrum', kind: 'drums_performer_1_test', properties: '35' }
        }, {
            id: "hihat",
            filters: [{ id: "dr3", kind: "volume_filter_1_test", properties: "75%" }],
            performer: { id: 'hh1', kind: 'drums_performer_1_test', properties: '42' }
        }, { id: "pad",
            filters: [{ id: "padVolume3", kind: "volume_filter_1_test", properties: "75%" }],
            performer: { id: '22', kind: 'waf_performer_1_test', properties: '21' }
        }],
    filters: [
        { id: "f1", kind: "volume_filter_1_test", properties: "75%" },
        { id: "f2", kind: "echo_filter_1_test", properties: "0.2" }
    ]
};
console.log('testSchedule', testSchedule);
//# sourceMappingURL=testschedule.js.map