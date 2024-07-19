class PerformerIcon {
	//track:Zvoog_MusicTrack;
	performerId: string;
	constructor(performerId: string) {
		//console.log('PerformerIcon', track.performer);
		//this.track=track;
		this.performerId = performerId;
	}
	buildPerformerSpot(cfg: MixerDataMathUtility, fanLevelAnchor: TileAnchor,zidx:number) {
		//console.log('buildPerformerSpot', this.performerId);
		for (let ii = 0; ii < cfg.data.tracks.length; ii++) {
			if (cfg.data.tracks[ii].performer.id == this.performerId) {
				let audioSeq: Zvoog_AudioSequencer = cfg.data.tracks[ii].performer;
				this.addPerformerSpot(cfg, audioSeq, fanLevelAnchor,zidx);
				break;
			}
		}
	}
	addPerformerSpot(cfg: MixerDataMathUtility, audioSeq: Zvoog_AudioSequencer, fanLevelAnchor: TileAnchor,zidx:number) {
		let xx = 0;
		let yy = 0;
		if (audioSeq.iconPosition) {
			xx = audioSeq.iconPosition.x;
			yy = audioSeq.iconPosition.y;
		}
		let rec: TileRectangle = { x: xx+zidx, y: yy, w: 100, h: 10,css:'fanSamplerIcon' };
		fanLevelAnchor.content.push(rec);
		let txt:TileText={text:''+zidx,x: xx+zidx, y: yy, css:'fanSamplerIcon' };
		fanLevelAnchor.content.push(txt);
		//console.log('PerformerIcon', rec);
	}
}
