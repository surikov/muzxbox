class SamplerIcon {
	//track:Zvoog_MusicTrack;
	samplerId: string;
	constructor(samplerId: string) {
		//console.log('PerformerIcon', track.performer);
		//this.track=track;
		this.samplerId = samplerId;
	}
	buildSamplerSpot(cfg: MixerDataMathUtility, fanLevelAnchor: TileAnchor, zidx: number) {
		//console.log('buildPerformerSpot', this.performerId);
		for (let ii = 0; ii < cfg.data.percussions.length; ii++) {
			if (cfg.data.percussions[ii].sampler.id == this.samplerId) {
				let sampler: Zvoog_AudioSampler = cfg.data.percussions[ii].sampler;
				this.addSamplerSpot(cfg, sampler, fanLevelAnchor, zidx);
				break;
			}
		}
	}
	addSamplerSpot(cfg: MixerDataMathUtility, audioSeq: Zvoog_AudioSampler, fanLevelAnchor: TileAnchor, zidx: number) {
		let left = cfg.leftPad+cfg.timelineWidth() + cfg.padGridFan;
		let top = cfg.gridTop();
		let xx = left;
		let yy = top;
		if (audioSeq.iconPosition) {
			xx = left + audioSeq.iconPosition.x;
			yy = top + audioSeq.iconPosition.y;
		}

		let rec: TileRectangle = { x: xx, y: yy, w: cfg.pluginIconWidth, h: cfg.pluginIconHeight, css: 'fanSamplerIcon' };
		fanLevelAnchor.content.push(rec);
		let txt: TileText = { text: 'z' + zidx + ':' + zoomPrefixLevelsCSS[zidx].minZoom + ':' + audioSeq.id, x: xx, y: yy + cfg.pluginIconHeight, css: 'fanSamplerIcon' };
		fanLevelAnchor.content.push(txt);
		//console.log('PerformerIcon', rec);
		cfg.addSpear(3, cfg.leftPad+cfg.timelineWidth(), yy + cfg.pluginIconHeight / 2, xx, yy + cfg.pluginIconHeight / 2, fanLevelAnchor, 'fanSamplerIcon');
	}

}
