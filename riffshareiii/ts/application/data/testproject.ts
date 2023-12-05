let mzxbxProjectForTesting:MZXBX_Project={
	title: 'test data for debug'
	, timeline: []
	,tracks:[]
	,percussions:[]
	,comments:[]
	,filters:[],
	theme:{notePathHeight: 0.25
		, widthDurationRatio: 50}
};
let testBigMixerData = {
    title: 'test data for debug'
    , timeline: [
        {tempo:120,metre:{count:4,part:4}},{tempo:120,metre:{count:4,part:4}},{tempo:120,metre:{count:4,part:4}},{tempo:120,metre:{count:4,part:4}}
        ,{tempo:120,metre:{count:4,part:4}},{tempo:120,metre:{count:4,part:4}},{tempo:120,metre:{count:4,part:4}},{tempo:120,metre:{count:4,part:4}}
        ,{tempo:120,metre:{count:4,part:4}},{tempo:120,metre:{count:4,part:4}},{tempo:120,metre:{count:4,part:4}},{tempo:120,metre:{count:4,part:4}}
        ,{tempo:120,metre:{count:4,part:4}},{tempo:120,metre:{count:4,part:4}},{tempo:120,metre:{count:4,part:4}},{tempo:120,metre:{count:4,part:4}}

        ,{tempo:140,metre:{count:3,part:4}},{tempo:140,metre:{count:3,part:4}},{tempo:140,metre:{count:3,part:4}},{tempo:140,metre:{count:3,part:4}}
        ,{tempo:140,metre:{count:3,part:4}},{tempo:140,metre:{count:3,part:4}},{tempo:140,metre:{count:3,part:4}},{tempo:140,metre:{count:3,part:4}}
        ,{tempo:140,metre:{count:3,part:4}},{tempo:140,metre:{count:3,part:4}},{tempo:140,metre:{count:3,part:4}},{tempo:140,metre:{count:3,part:4}}
        ,{tempo:140,metre:{count:3,part:4}},{tempo:140,metre:{count:3,part:4}},{tempo:140,metre:{count:3,part:4}},{tempo:140,metre:{count:3,part:4}}
        
        ,{tempo:180,metre:{count:4,part:4}},{tempo:180,metre:{count:4,part:4}},{tempo:180,metre:{count:4,part:4}},{tempo:180,metre:{count:4,part:4}}
        ,{tempo:180,metre:{count:4,part:4}},{tempo:180,metre:{count:4,part:4}},{tempo:180,metre:{count:4,part:4}},{tempo:180,metre:{count:4,part:4}}
        ,{tempo:180,metre:{count:4,part:4}},{tempo:180,metre:{count:4,part:4}},{tempo:180,metre:{count:4,part:4}},{tempo:180,metre:{count:4,part:4}}
        ,{tempo:180,metre:{count:4,part:4}},{tempo:180,metre:{count:4,part:4}},{tempo:180,metre:{count:4,part:4}},{tempo:180,metre:{count:4,part:4}}

        ,{tempo:120,metre:{count:7,part:8}},{tempo:120,metre:{count:4,part:4}},{tempo:120,metre:{count:4,part:4}},{tempo:120,metre:{count:4,part:4}}
        ,{tempo:120,metre:{count:2,part:2}},{tempo:120,metre:{count:4,part:4}},{tempo:120,metre:{count:4,part:4}},{tempo:120,metre:{count:4,part:4}}
        ,{tempo:120,metre:{count:5,part:4}},{tempo:120,metre:{count:4,part:4}},{tempo:120,metre:{count:4,part:4}},{tempo:120,metre:{count:4,part:4}}
        ,{tempo:120,metre:{count:3,part:4}},{tempo:120,metre:{count:4,part:4}},{tempo:120,metre:{count:4,part:4}},{tempo:120,metre:{count:4,part:4}}

		,{tempo:120,metre:{count:4,part:4}},{tempo:120,metre:{count:4,part:4}},{tempo:120,metre:{count:4,part:4}},{tempo:120,metre:{count:4,part:4}}
        ,{tempo:120,metre:{count:4,part:4}},{tempo:120,metre:{count:4,part:4}},{tempo:120,metre:{count:4,part:4}},{tempo:120,metre:{count:4,part:4}}
        ,{tempo:120,metre:{count:4,part:4}},{tempo:120,metre:{count:4,part:4}},{tempo:120,metre:{count:4,part:4}},{tempo:120,metre:{count:4,part:4}}
        ,{tempo:120,metre:{count:4,part:4}},{tempo:120,metre:{count:4,part:4}},{tempo:120,metre:{count:4,part:4}},{tempo:120,metre:{count:4,part:4}}

        ,{tempo:140,metre:{count:3,part:4}},{tempo:140,metre:{count:3,part:4}},{tempo:140,metre:{count:3,part:4}},{tempo:140,metre:{count:3,part:4}}
        ,{tempo:140,metre:{count:3,part:4}},{tempo:140,metre:{count:3,part:4}},{tempo:140,metre:{count:3,part:4}},{tempo:140,metre:{count:3,part:4}}
        ,{tempo:140,metre:{count:3,part:4}},{tempo:140,metre:{count:3,part:4}},{tempo:140,metre:{count:3,part:4}},{tempo:140,metre:{count:3,part:4}}
        ,{tempo:140,metre:{count:3,part:4}},{tempo:140,metre:{count:3,part:4}},{tempo:140,metre:{count:3,part:4}},{tempo:140,metre:{count:3,part:4}}
        
        ,{tempo:180,metre:{count:4,part:4}},{tempo:180,metre:{count:4,part:4}},{tempo:180,metre:{count:4,part:4}},{tempo:180,metre:{count:4,part:4}}
        ,{tempo:180,metre:{count:4,part:4}},{tempo:180,metre:{count:4,part:4}},{tempo:180,metre:{count:4,part:4}},{tempo:180,metre:{count:4,part:4}}
        ,{tempo:180,metre:{count:4,part:4}},{tempo:180,metre:{count:4,part:4}},{tempo:180,metre:{count:4,part:4}},{tempo:180,metre:{count:4,part:4}}
        ,{tempo:180,metre:{count:4,part:4}},{tempo:180,metre:{count:4,part:4}},{tempo:180,metre:{count:4,part:4}},{tempo:180,metre:{count:4,part:4}}

        ,{tempo:120,metre:{count:7,part:8}},{tempo:120,metre:{count:4,part:4}},{tempo:120,metre:{count:4,part:4}},{tempo:120,metre:{count:4,part:4}}
        ,{tempo:120,metre:{count:2,part:2}},{tempo:120,metre:{count:4,part:4}},{tempo:120,metre:{count:4,part:4}},{tempo:120,metre:{count:4,part:4}}
        ,{tempo:120,metre:{count:5,part:4}},{tempo:120,metre:{count:4,part:4}},{tempo:120,metre:{count:4,part:4}},{tempo:120,metre:{count:4,part:4}}
        ,{tempo:120,metre:{count:3,part:4}},{tempo:120,metre:{count:4,part:4}},{tempo:120,metre:{count:4,part:4}},{tempo:120,metre:{count:4,part:4}}
    ]
    , notePathHeight: 0.25
    , widthDurationRatio: 50
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
        {tempo:120,metre:{count:4,part:4}}        
    ]
    , notePathHeight: 0.25
    , widthDurationRatio: 50
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
