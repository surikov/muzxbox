"use strict";
let testSchedule = {
    series: [
        {
            duration: 1, items: [
                { skip: 0, channelId: 'bass', pitch: 12 * 3 + 0, volume: 0.33, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0.25, channelId: 'bass', pitch: 12 * 4 + 0, volume: 0.33, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0.5, channelId: 'bass', pitch: 12 * 3 + 0, volume: 0.33, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0.75, channelId: 'bass', pitch: 12 * 4 + 0, volume: 0.33, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0, channelId: 'pad', pitch: 12 * 5 + 0, volume: 0.33, slides: [{ duration: 1, delta: 0 }] },
                { skip: 0, channelId: 'pad', pitch: 12 * 5 + 0 + 5, volume: 0.33, slides: [{ duration: 1, delta: 0 }] },
                { skip: 0, channelId: 'pad', pitch: 12 * 5 + 0 + 7, volume: 0.33, slides: [{ duration: 1, delta: 0 }] }
            ], states: []
        }, {
            duration: 1, items: [
                { skip: 0, channelId: 'bass', pitch: 12 * 2 + 5, volume: 0.33, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0.25, channelId: 'bass', pitch: 12 * 3 + 5, volume: 0.33, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0.5, channelId: 'bass', pitch: 12 * 2 + 5, volume: 0.33, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0.75, channelId: 'bass', pitch: 12 * 3 + 5, volume: 0.33, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0, channelId: 'pad', pitch: 12 * 5 + 5, volume: 0.33, slides: [{ duration: 1, delta: 0 }] },
                { skip: 0, channelId: 'pad', pitch: 12 * 5 + 5 + 5, volume: 0.33, slides: [{ duration: 1, delta: 0 }] },
                { skip: 0, channelId: 'pad', pitch: 12 * 5 + 5 + 7, volume: 0.33, slides: [{ duration: 1, delta: 0 }] }
            ], states: []
        }, {
            duration: 1, items: [
                { skip: 0, channelId: 'bass', pitch: 12 * 2 + 7, volume: 0.33, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0.25, channelId: 'bass', pitch: 12 * 3 + 7, volume: 0.33, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0.5, channelId: 'bass', pitch: 12 * 2 + 7, volume: 0.33, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0.75, channelId: 'bass', pitch: 12 * 3 + 7, volume: 0.33, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0, channelId: 'pad', pitch: 12 * 5 + 7, volume: 0.33, slides: [{ duration: 1, delta: 0 }] },
                { skip: 0, channelId: 'pad', pitch: 12 * 5 + 7 + 5, volume: 0.33, slides: [{ duration: 1, delta: 0 }] },
                { skip: 0, channelId: 'pad', pitch: 12 * 5 + 7 + 7, volume: 0.33, slides: [{ duration: 1, delta: 0 }] }
            ], states: []
        }, {
            duration: 1, items: [
                { skip: 0, channelId: 'bass', pitch: 12 * 2 + 9, volume: 0.33, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0.25, channelId: 'bass', pitch: 12 * 3 + 9, volume: 0.33, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0.5, channelId: 'bass', pitch: 12 * 2 + 9, volume: 0.33, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0.75, channelId: 'bass', pitch: 12 * 3 + 4, volume: 0.33, slides: [{ duration: 0.25, delta: 0 }] },
                { skip: 0, channelId: 'pad', pitch: 12 * 5 + 9, volume: 0.33, slides: [{ duration: 1, delta: 0 }] },
                { skip: 0, channelId: 'pad', pitch: 12 * 5 + 9 + 4, volume: 0.33, slides: [{ duration: 1, delta: 0 }] },
                { skip: 0, channelId: 'pad', pitch: 12 * 5 + 9 + 7, volume: 0.33, slides: [{ duration: 1, delta: 0 }] }
            ], states: []
        }
    ],
    channels: [{
            id: "bass",
            filters: [{ id: "bassVolume123", kind: "volume_filter_1_test", properties: "20%" }],
            performer: { id: 'p1', kind: 'sinewave_performer_1_test', properties: 'square' }
        }, {
            id: "pad",
            filters: [{ id: "padVolume3", kind: "volume_filter_1_test", properties: "10%" }],
            performer: { id: '22', kind: 'sinewave_performer_1_test', properties: 'sine' }
        }],
    filters: [
        { id: "f1", kind: "volume_filter_1_test", properties: "15%" },
        { id: "f2", kind: "echo_filter_1_test", properties: "0.2" }
    ]
};
console.log('testSchedule', testSchedule);
//# sourceMappingURL=testschedule.js.map