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
	addSamplerSpot(cfg: MixerDataMathUtility, sampler: Zvoog_AudioSampler, fanLevelAnchor: TileAnchor, zidx: number) {
		let left = cfg.leftPad + cfg.timelineWidth() + cfg.padGridFan;
		let top = cfg.gridTop();
		let xx = left;
		let yy = top;
		if (sampler.iconPosition) {
			xx = left + sampler.iconPosition.x;
			yy = top + sampler.iconPosition.y;
		}

		let rec: TileRectangle = { x: xx, y: yy, w: cfg.pluginIconSize, h: cfg.pluginIconSize, rx: cfg.pluginIconSize / 2, ry: cfg.pluginIconSize / 2, css: 'fanSamplerIcon' };
		fanLevelAnchor.content.push(rec);
		if (zidx < 5) {
			let txt: TileText = { text: sampler.kind + ':' + sampler.id, x: xx, y: yy + cfg.pluginIconSize, css: 'fanSamplerIcon' };
			fanLevelAnchor.content.push(txt);
		}
		//console.log('PerformerIcon', rec);
		new SpearConnection().addSpear(3, cfg.leftPad + cfg.timelineWidth(), yy + cfg.pluginIconSize / 2, xx, yy + cfg.pluginIconSize / 2, fanLevelAnchor
		, 'fanStream');
		this.addOutputs(cfg, sampler.outputs, fanLevelAnchor, zidx, xx + cfg.pluginIconSize, yy + cfg.pluginIconSize / 2);
	}
	addOutputs(cfg: MixerDataMathUtility, outputs: string[], fanLevelAnchor: TileAnchor, zidx: number, fromX: number, fromY: number) {
		if (outputs)if (outputs.length > 0) {
			for (let oo = 0; oo < outputs.length; oo++) {
				let outId = outputs[oo];
				for (let ii = 0; ii < cfg.data.filters.length; ii++) {
					if (cfg.data.filters[ii].id == outId) {
						let toFilter: Zvoog_FilterTarget = cfg.data.filters[ii];
						let left = cfg.leftPad + cfg.timelineWidth() + cfg.padGridFan;
						let top = cfg.gridTop();
						let xx = left;
						let yy = top;
						if (toFilter.iconPosition) {
							xx = left + toFilter.iconPosition.x;
							yy = top + toFilter.iconPosition.y + cfg.pluginIconSize / 2;
						}
						new SpearConnection().addSpear(3, fromX, fromY, xx, yy, fanLevelAnchor, 'fanConnection');
						break;
					}
				}
			}
		} else {
			let speakerX=cfg.wholeWidth() - cfg.speakerIconPad-cfg.rightPad;
			new SpearConnection().addSpear(3, fromX, fromY, speakerX, cfg.gridTop() + cfg.gridHeight() / 2, fanLevelAnchor, 'fanConnection');
			//console.log('to speaker',fromX,fromY);
		}
	}
}
