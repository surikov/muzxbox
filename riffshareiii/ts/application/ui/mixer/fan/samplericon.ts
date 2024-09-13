class SamplerIcon {
	//track:Zvoog_MusicTrack;
	samplerId: string;
	constructor(samplerId: string) {
		//console.log('PerformerIcon', track.performer);
		//this.track=track;
		this.samplerId = samplerId;
	}
	buildSamplerSpot(fanLevelAnchor: TileAnchor, zidx: number) {
		//console.log('buildPerformerSpot', this.performerId);
		for (let ii = 0; ii < globalCommandDispatcher.cfg().data.percussions.length; ii++) {
			if (globalCommandDispatcher.cfg().data.percussions[ii].sampler.id == this.samplerId) {
				let sampler: Zvoog_AudioSampler = globalCommandDispatcher.cfg().data.percussions[ii].sampler;
				this.addSamplerSpot(sampler, fanLevelAnchor, zidx);
				break;
			}
		}
	}
	addSamplerSpot(sampler: Zvoog_AudioSampler, fanLevelAnchor: TileAnchor, zidx: number) {
		let left = globalCommandDispatcher.cfg().leftPad + globalCommandDispatcher.cfg().timelineWidth() + globalCommandDispatcher.cfg().padGridFan;
		let top = globalCommandDispatcher.cfg().gridTop();
		let xx = left;
		let yy = top;
		if (sampler.iconPosition) {
			xx = left + sampler.iconPosition.x;
			yy = top + sampler.iconPosition.y;
		}
		let controlLineWidth = xx - globalCommandDispatcher.cfg().leftPad - globalCommandDispatcher.cfg().timelineWidth();
		/*
		let rec: TileRectangle = {
			x: xx, y: yy
			, w: globalCommandDispatcher.cfg().pluginIconSize, h: globalCommandDispatcher.cfg().pluginIconSize
			, rx: globalCommandDispatcher.cfg().pluginIconSize / 2
			, ry: globalCommandDispatcher.cfg().pluginIconSize / 2
			, css: 'fanSamplerIcon'
		};
		*/
		let rec: TilePolygon = {
			x: xx, y: yy
			, dots:[
				0,0
				,globalCommandDispatcher.cfg().pluginIconSize/2,0
				,globalCommandDispatcher.cfg().pluginIconSize,globalCommandDispatcher.cfg().pluginIconSize/2
				,globalCommandDispatcher.cfg().pluginIconSize/2,globalCommandDispatcher.cfg().pluginIconSize
				,0,globalCommandDispatcher.cfg().pluginIconSize
			]
			, css: 'fanSamplerIcon'
		};
		fanLevelAnchor.content.push(rec);
		if (zidx < 5) {
			let txt: TileText = {
				text: sampler.kind + ':' + sampler.id
				, x: xx, y: yy + globalCommandDispatcher.cfg().pluginIconSize, css: 'fanIconLabel'
			};
			fanLevelAnchor.content.push(txt);
		}
		//console.log('PerformerIcon', rec);
		new ControlConnection().addLineFlow(yy + globalCommandDispatcher.cfg().pluginIconSize / 2, controlLineWidth, fanLevelAnchor);
		new FanOutputLine().addOutputs(sampler.outputs, fanLevelAnchor, zidx
			, xx + globalCommandDispatcher.cfg().pluginIconSize/2
			, yy + globalCommandDispatcher.cfg().pluginIconSize / 2);
	}
	/*addOutputs(outputs: string[], fanLevelAnchor: TileAnchor, zidx: number, fromX: number, fromY: number) {
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
			new SpearConnection().addSpear(fromX, fromY, speakerX
				, globalCommandDispatcher.cfg().gridTop() + globalCommandDispatcher.cfg().gridHeight() / 2, fanLevelAnchor);
			//console.log('to speaker',fromX,fromY);
		}
	}*/
}
