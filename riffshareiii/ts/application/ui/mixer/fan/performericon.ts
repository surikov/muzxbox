class PerformerIcon {
	//track:Zvoog_MusicTrack;
	performerId: string;
	constructor(performerId: string) {
		//console.log('PerformerIcon', track.performer);
		//this.track=track;
		this.performerId = performerId;
	}
	buildPerformerSpot(cfg: MixerDataMathUtility, fanLevelAnchor: TileAnchor, zidx: number) {
		//console.log('buildPerformerSpot', this.performerId);
		for (let ii = 0; ii < cfg.data.tracks.length; ii++) {
			if (cfg.data.tracks[ii].performer.id == this.performerId) {
				let audioSeq: Zvoog_AudioSequencer = cfg.data.tracks[ii].performer;
				this.addPerformerSpot(cfg, audioSeq, fanLevelAnchor, zidx);
				break;
			}
		}
	}
	addPerformerSpot(cfg: MixerDataMathUtility, audioSeq: Zvoog_AudioSequencer, fanLevelAnchor: TileAnchor, zidx: number) {
		let left = cfg.leftPad + cfg.timelineWidth() + cfg.padGridFan;
		let top = cfg.gridTop();
		let xx = left;
		let yy = top;
		if (audioSeq.iconPosition) {
			xx = left + audioSeq.iconPosition.x;
			yy = top + audioSeq.iconPosition.y;
		}

		let rec: TileRectangle = { x: xx, y: yy, w: cfg.pluginIconWidth, h: cfg.pluginIconHeight, css: 'fanSamplerIcon' };
		fanLevelAnchor.content.push(rec);
		if (zidx < 5) {
			let txt: TileText = { text: audioSeq.kind + ':' + audioSeq.id, x: xx, y: yy + cfg.pluginIconHeight, css: 'fanSamplerIcon' };
			fanLevelAnchor.content.push(txt);
		}
		//console.log('PerformerIcon', rec);
		new SpearConnection().addSpear(3, cfg.leftPad + cfg.timelineWidth(), yy + cfg.pluginIconHeight / 2, xx, yy + cfg.pluginIconHeight / 2, fanLevelAnchor, 'fanSamplerIcon');
		this.addOutputs(cfg, audioSeq.outputs, fanLevelAnchor, zidx, xx + cfg.pluginIconWidth, yy + cfg.pluginIconHeight / 2);
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
							yy = top + toFilter.iconPosition.y + cfg.pluginIconHeight / 2;
						}
						new SpearConnection().addSpear(3, fromX, fromY, xx, yy, fanLevelAnchor, 'fanSamplerIcon');
						break;
					}
				}
			}
		} else {
			new SpearConnection().addSpear(3, fromX, fromY, cfg.wholeWidth() - cfg.pluginIconWidth, cfg.gridTop() + cfg.gridHeight() / 2, fanLevelAnchor, 'fanSamplerIcon');
		}
	}
}
