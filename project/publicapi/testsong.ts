let testIonianC: MZXBX_Scale = {
	basePitch: 0,
	step2: 2,
	step3: 2,
	step4: 1,
	step5: 2,
	step6: 2,
	step7: 2
};
let testMetre44: MZXBX_Metre = {
	count: 4,
	part: 4
};
let testSongProject: MZXBX_Project = {
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
			data: "0.77"
		}
	]
};
