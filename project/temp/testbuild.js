"use strict";
let testIonianC = {
    basePitch: 0,
    step2: 2,
    step3: 2,
    step4: 1,
    step5: 2,
    step6: 2,
    step7: 2
};
let testMetre44 = {
    count: 4,
    part: 4
};
let testSongProject = {
    title: "Test song",
    timeline: [
        { tempo: 120, metre: testMetre44, scale: testIonianC },
        { tempo: 120, metre: testMetre44, scale: testIonianC },
        { tempo: 120, metre: testMetre44, scale: testIonianC },
        { tempo: 120, metre: testMetre44, scale: testIonianC }
    ],
    tracks: [],
    percussions: [],
    filters: [
        {
            id: "simple_volume",
            parameters: [
                {
                    title: "value",
                    places: [{ items: [{ skip: { count: 0, part: 4 }, data: "0.7" }] }, { items: [] }, { items: [] }, { items: [] }]
                }
            ]
        }
    ]
};
//# sourceMappingURL=testbuild.js.map