class SamplerIcon {
	//track:Zvoog_MusicTrack;
	samplerId: string;
	constructor(samplerId: string) {
		this.samplerId = samplerId;
	}
	buildSamplerSpot(fanLevelAnchor: TileAnchor, spearsAnchor: TileAnchor, zidx: number) {
		for (let ii = 0; ii < globalCommandDispatcher.cfg().data.percussions.length; ii++) {
			if (globalCommandDispatcher.cfg().data.percussions[ii].sampler.id == this.samplerId) {
				let sampler: Zvoog_AudioSampler = globalCommandDispatcher.cfg().data.percussions[ii].sampler;
				this.addSamplerSpot(sampler, fanLevelAnchor, spearsAnchor, zidx);
				break;
			}
		}
	}
	addSamplerSpot(sampler: Zvoog_AudioSampler, fanLevelAnchor: TileAnchor, spearsAnchor: TileAnchor, zidx: number) {

		let left = globalCommandDispatcher.cfg().leftPad + globalCommandDispatcher.cfg().timelineWidth() + globalCommandDispatcher.cfg().padGridFan;
		let top = globalCommandDispatcher.cfg().gridTop();
		let xx = left;
		let yy = top;
		if (sampler.iconPosition) {
			xx = left + sampler.iconPosition.x;
			yy = top + sampler.iconPosition.y;
		}
		let controlLineWidth = xx - globalCommandDispatcher.cfg().leftPad - globalCommandDispatcher.cfg().timelineWidth();

		let dragAnchor: TileAnchor = { xx: xx, yy: yy, ww: globalCommandDispatcher.cfg().pluginIconSize, hh: globalCommandDispatcher.cfg().pluginIconSize, showZoom: fanLevelAnchor.showZoom, hideZoom: fanLevelAnchor.hideZoom, content: [], translation: { x: 0, y: 0 } };
		fanLevelAnchor.content.push(dragAnchor);
		let rec: TilePolygon = {
			x: xx, y: yy
			, dots: [
				0, globalCommandDispatcher.cfg().pluginIconSize / 2
				, globalCommandDispatcher.cfg().pluginIconSize / 2, 0
				, globalCommandDispatcher.cfg().pluginIconSize, globalCommandDispatcher.cfg().pluginIconSize / 2
				, globalCommandDispatcher.cfg().pluginIconSize / 2, globalCommandDispatcher.cfg().pluginIconSize

			]
			, draggable: true
			, activation: (x: number, y: number) => {
				console.log('sampler', x, y);
				if (!dragAnchor.translation) {
					dragAnchor.translation = { x: 0, y: 0 };
				}
				if (x == 0 && y == 0) {
					console.log('done', dragAnchor.translation);
					if (!sampler.iconPosition) {
						sampler.iconPosition = { x: 0, y: 0 };
					}
					sampler.iconPosition.x = sampler.iconPosition.x + dragAnchor.translation.x;
					sampler.iconPosition.y = sampler.iconPosition.y + dragAnchor.translation.y;
					dragAnchor.translation = { x: 0, y: 0 };
					globalCommandDispatcher.resetProject();
				} else {
					dragAnchor.translation.x = dragAnchor.translation.x + x;
					dragAnchor.translation.y = dragAnchor.translation.y + y;
					globalCommandDispatcher.renderer.tiler.resetAnchor(globalCommandDispatcher.renderer.mixer.fanSVGgroup
						, fanLevelAnchor
						, LevelModes.normal);
				}


			}
			, css: 'fanSamplerMoveIcon'
		};
		dragAnchor.content.push(rec);
		if (zidx < 5) {
			let txt: TileText = {
				text: sampler.kind + ':' + sampler.id
				, x: xx, y: yy + globalCommandDispatcher.cfg().pluginIconSize, css: 'fanIconLabel'
			};
			dragAnchor.content.push(txt);
		}
		new ControlConnection().addLineFlow(yy + globalCommandDispatcher.cfg().pluginIconSize / 2, controlLineWidth, fanLevelAnchor);
		new FanOutputLine().addOutputs(sampler.outputs, fanLevelAnchor, spearsAnchor
			, sampler.id
			, xx + globalCommandDispatcher.cfg().pluginIconSize / 2
			, yy + globalCommandDispatcher.cfg().pluginIconSize / 2);
	}
}
