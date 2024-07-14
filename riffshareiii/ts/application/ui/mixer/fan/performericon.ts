class PerformerIcon{
	//track:Zvoog_MusicTrack;
	performerId:string;
	constructor(performerId:string){
		//console.log('PerformerIcon', track.performer);
		//this.track=track;
		this.performerId=performerId;
	}
	buildPerformerSpot(cfg: MixerDataMathUtility){
		console.log('buildPerformerSpot',this.performerId);
	}
}
