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
		let left = cfg.timelineWidth() + cfg.padGridFan;
		let top = cfg.gridTop();
		let xx = left;
		let yy = top;
		if (audioSeq.iconPosition) {
			xx = left + audioSeq.iconPosition.x;
			yy = top + audioSeq.iconPosition.y;
		}

		let rec: TileRectangle = { x: xx, y: yy, w: cfg.pluginIconWidth, h: cfg.pluginIconHeight, css: 'fanSamplerIcon' };
		fanLevelAnchor.content.push(rec);
		let txt: TileText = { text: 'z' + zidx + ':' + zoomPrefixLevelsCSS[zidx].minZoom + ':' + audioSeq.id, x: xx , y: yy + cfg.pluginIconHeight, css: 'fanSamplerIcon' };
		fanLevelAnchor.content.push(txt);
		//console.log('PerformerIcon', rec);
		this.addSpear(0, 0, xx, yy, fanLevelAnchor);
	}
	addSpear(fromX: number, fromY: number, toX: number, toY: number, anchor: TileAnchor) {
		let line: TileLine = { x1: fromX, x2: toX, y1: fromY, y2: toY, css: 'fanSamplerIcon' };
		anchor.content.push(line);
	}
}
