type MuzXBoxPattern={
	skip: ZvoogMeter
	,duration:ZvoogMeter
	,pattern:number
};
type MuzXBoxTrack={
	patterns:MuzXBoxPattern[]
};
type MuzXBoxProject={
	tracks:MuzXBoxTrack[]
	,title:string
	,tempo:number
	,duration:ZvoogMeter
};






