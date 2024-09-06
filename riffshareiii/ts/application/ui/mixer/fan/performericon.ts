class PerformerIcon {
	//track:Zvoog_MusicTrack;
	performerId: string;
	constructor(performerId: string) {
		//console.log('PerformerIcon', track.performer);
		//this.track=track;
		this.performerId = performerId;
	}
	buildPerformerSpot(fanLevelAnchor: TileAnchor, zidx: number) {
		//console.log('buildPerformerSpot', this.performerId);
		for (let ii = 0; ii < globalCommandDispatcher.cfg().data.tracks.length; ii++) {
			if (globalCommandDispatcher.cfg().data.tracks[ii].performer.id == this.performerId) {
				let audioSeq: Zvoog_AudioSequencer = globalCommandDispatcher.cfg().data.tracks[ii].performer;
				this.addPerformerSpot(audioSeq, fanLevelAnchor, zidx);
				break;
			}
		}
	}
	addPerformerSpot(audioSeq: Zvoog_AudioSequencer, fanLevelAnchor: TileAnchor, zidx: number) {
		let left = globalCommandDispatcher.cfg().leftPad + globalCommandDispatcher.cfg().timelineWidth() + globalCommandDispatcher.cfg().padGridFan;
		let top = globalCommandDispatcher.cfg().gridTop();
		let xx = left;
		let yy = top;
		if (audioSeq.iconPosition) {
			xx = left + audioSeq.iconPosition.x;
			yy = top + audioSeq.iconPosition.y;
		}

		let rec: TileRectangle = {
			x: xx, y: yy
			, w: globalCommandDispatcher.cfg().pluginIconSize, h: globalCommandDispatcher.cfg().pluginIconSize
			, rx: globalCommandDispatcher.cfg().pluginIconSize / 2, ry: globalCommandDispatcher.cfg().pluginIconSize / 2
			, css: 'fanPerformerIcon'
		};
		fanLevelAnchor.content.push(rec);
		if (zidx < 5) {
			let txt: TileText = {
				text: audioSeq.kind + ':' + audioSeq.id
				, x: xx, y: yy + globalCommandDispatcher.cfg().pluginIconSize, css: 'fanSamplerIcon'
			};
			fanLevelAnchor.content.push(txt);
		}
		//console.log('PerformerIcon', rec);
		let controlLineWidth = xx - globalCommandDispatcher.cfg().leftPad - globalCommandDispatcher.cfg().timelineWidth();
		new ControlConnection().addLineFlow(yy + globalCommandDispatcher.cfg().pluginIconSize / 2, controlLineWidth, fanLevelAnchor);
		new FanOutputLine().addOutputs(audioSeq.outputs, fanLevelAnchor, zidx
			, xx + globalCommandDispatcher.cfg().pluginIconSize / 2
			, yy + globalCommandDispatcher.cfg().pluginIconSize / 2
		);
	}
	/*
	addOutputs(outputs: string[], fanLevelAnchor: TileAnchor, zidx: number, fromX: number, fromY: number) {
		if (outputs) if (outputs.length > 0) {
			for (let oo = 0; oo < outputs.length; oo++) {
				let outId = outputs[oo];
				for (let ii = 0; ii < globalCommandDispatcher.cfg().data.filters.length; ii++) {
					if (globalCommandDispatcher.cfg().data.filters[ii].id == outId) {
						let toFilter: Zvoog_FilterTarget = globalCommandDispatcher.cfg().data.filters[ii];
						let left = globalCommandDispatcher.cfg().leftPad + globalCommandDispatcher.cfg().timelineWidth() + globalCommandDispatcher.cfg().padGridFan;
						let top = globalCommandDispatcher.cfg().gridTop();
						let xx = left + globalCommandDispatcher.cfg().pluginIconSize / 2;
						let yy = top + globalCommandDispatcher.cfg().pluginIconSize / 2;
						if (toFilter.iconPosition) {
							xx = left + toFilter.iconPosition.x + globalCommandDispatcher.cfg().pluginIconSize / 2;
							yy = top + toFilter.iconPosition.y + globalCommandDispatcher.cfg().pluginIconSize / 2;
						}
						new SpearConnection().addSpear(fromX, fromY, xx, yy, fanLevelAnchor);
						break;
					}
				}
			}
		} else {
			let speakerX = globalCommandDispatcher.cfg().wholeWidth() - globalCommandDispatcher.cfg().speakerIconPad - globalCommandDispatcher.cfg().rightPad;
			new SpearConnection().addSpear(fromX, fromY, speakerX, globalCommandDispatcher.cfg().gridTop() + globalCommandDispatcher.cfg().gridHeight() / 2, fanLevelAnchor);
		}
	}*/
}

class FanOutputLine {
	addOutputs(outputs: string[], fanLevelAnchor: TileAnchor, zidx: number, fromX: number, fromY: number) {
		if (outputs) if (outputs.length > 0) {
			for (let oo = 0; oo < outputs.length; oo++) {
				let outId = outputs[oo];
				for (let ii = 0; ii < globalCommandDispatcher.cfg().data.filters.length; ii++) {
					if (globalCommandDispatcher.cfg().data.filters[ii].id == outId) {
						let toFilter: Zvoog_FilterTarget = globalCommandDispatcher.cfg().data.filters[ii];
						let left = globalCommandDispatcher.cfg().leftPad + globalCommandDispatcher.cfg().timelineWidth() + globalCommandDispatcher.cfg().padGridFan;
						let top = globalCommandDispatcher.cfg().gridTop();
						let xx = left + globalCommandDispatcher.cfg().pluginIconSize / 2;
						let yy = top + globalCommandDispatcher.cfg().pluginIconSize / 2;
						if (toFilter.iconPosition) {
							xx = left + toFilter.iconPosition.x + globalCommandDispatcher.cfg().pluginIconSize / 2;
							yy = top + toFilter.iconPosition.y + globalCommandDispatcher.cfg().pluginIconSize / 2;
						}
						new SpearConnection().addSpear(fromX, fromY, xx, yy, fanLevelAnchor);
						break;
					}
				}
			}
		} else {
			let speakerX = globalCommandDispatcher.cfg().wholeWidth() - globalCommandDispatcher.cfg().speakerIconPad - globalCommandDispatcher.cfg().rightPad+ globalCommandDispatcher.cfg().pluginIconSize / 2;
			new SpearConnection().addSpear(fromX, fromY, speakerX, globalCommandDispatcher.cfg().gridTop() + globalCommandDispatcher.cfg().gridHeight() / 2, fanLevelAnchor);
		}
	}
}
