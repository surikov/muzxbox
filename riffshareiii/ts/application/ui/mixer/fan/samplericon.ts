class SamplerIcon {
	samplerId: string;
	constructor(samplerId: string) {
		this.samplerId = samplerId;
	}
	buildSamplerSpot(order: number, fanLevelAnchor: TileAnchor, spearsAnchor: TileAnchor, zidx: number) {
		for (let ii = 0; ii < globalCommandDispatcher.cfg().data.percussions.length; ii++) {
			if (globalCommandDispatcher.cfg().data.percussions[ii].sampler.id == this.samplerId) {
				//let sampler: Zvoog_AudioSampler = globalCommandDispatcher.cfg().data.percussions[ii].sampler;
				this.addSamplerSpot(order,  globalCommandDispatcher.cfg().data.percussions[ii], fanLevelAnchor, spearsAnchor, zidx);
				break;
			}
		}
	}
	addSamplerSpot(order: number, samplerTrack: Zvoog_PercussionTrack, fanLevelAnchor: TileAnchor, spearsAnchor: TileAnchor, zidx: number) {
		let sz = globalCommandDispatcher.cfg().fanPluginIconSize(zidx) * 0.66;
		let left = globalCommandDispatcher.cfg().leftPad + globalCommandDispatcher.cfg().timelineWidth() + globalCommandDispatcher.cfg().padGridFan;
		let top = globalCommandDispatcher.cfg().gridTop();
		let xx = left;
		let yy = top;
		if (samplerTrack.sampler.iconPosition) {
			xx = left + samplerTrack.sampler.iconPosition.x;
			yy = top + samplerTrack.sampler.iconPosition.y;
		}
		let dragAnchor: TileAnchor = {
			xx: xx - sz / 2, yy: yy - sz / 2, ww: sz, hh: sz
			, showZoom: fanLevelAnchor.showZoom, hideZoom: fanLevelAnchor.hideZoom, content: [], translation: { x: 0, y: 0 }
		};
		fanLevelAnchor.content.push(dragAnchor);
		let rec: TilePolygon = {
			x: xx - sz * 0.6
			, y: yy - sz
			, dots: [
				0, 0
				, sz * 2 * 0.8, sz
				, 0, sz * 2
			]
			, draggable: true
			, activation: (x: number, y: number) => {
				if (!dragAnchor.translation) {
					dragAnchor.translation = { x: 0, y: 0 };
				}
				if (x == 0 && y == 0) {
					console.log('done', dragAnchor.translation);
					if (!samplerTrack.sampler.iconPosition) {
						samplerTrack.sampler.iconPosition = { x: 0, y: 0 };
					}
					samplerTrack.sampler.iconPosition.x = samplerTrack.sampler.iconPosition.x + dragAnchor.translation.x;
					samplerTrack.sampler.iconPosition.y = samplerTrack.sampler.iconPosition.y + dragAnchor.translation.y;
					console.log('move ' + samplerTrack.sampler.kind + ':' + samplerTrack.sampler.id + ' to ' + samplerTrack.sampler.iconPosition.x + '/' + samplerTrack.sampler.iconPosition.y);
					dragAnchor.translation = { x: 0, y: 0 };
					globalCommandDispatcher.resetProject();
				} else {
					dragAnchor.translation.x = dragAnchor.translation.x + x;
					dragAnchor.translation.y = dragAnchor.translation.y + y;
					if (samplerTrack.sampler.iconPosition) {
						let xx = samplerTrack.sampler.iconPosition.x + dragAnchor.translation.x;
						let yy = samplerTrack.sampler.iconPosition.y + dragAnchor.translation.y;
						let toplugin = globalCommandDispatcher.cfg().findPluginSamplerIcon(xx, yy, zidx, samplerTrack.sampler.id);
						console.log('link ' + samplerTrack.sampler.kind + ':' + samplerTrack.sampler.id + ' to ' + toplugin);
					}
					globalCommandDispatcher.renderer.tiler.resetAnchor(globalCommandDispatcher.renderer.mixer.fanSVGgroup
						, fanLevelAnchor
						, LevelModes.normal);
				}
			}
			, css: 'fanSamplerMoveIcon fanSamplerMoveIcon' + zidx
		};
		dragAnchor.content.push(rec);
		/*let clickBtnSz = globalCommandDispatcher.cfg().fanPluginIconSize(zidx) * 0.3;
		if (zidx < 5) {
			let btn: TileRectangle = {
				x: xx - clickBtnSz / 2
				, y: yy + sz / 5 - clickBtnSz / 2
				, w: clickBtnSz
				, h: clickBtnSz
				, rx: clickBtnSz / 2
				, ry: clickBtnSz / 2
				, css: 'fanSamplerInteractionIcon fanButton' + zidx
				, activation: (x: number, y: number) => {
					console.log('' + sampler.kind + ':' + sampler.id);
				}
			};
			dragAnchor.content.push(btn);
		}*/
		if (zidx < 5) {
			let btn: TilePolygon = {
				x: xx - sz * 0.6
				, y: yy -sz
				, dots: [
					0, sz
					, sz * 2 * 0.8, sz
					, 0, sz * 2
				]
				, css: 'fanSamplerInteractionIcon fanButton' + zidx
				, activation: (x: number, y: number) => {
					console.log('' + samplerTrack.sampler.kind + ':' + samplerTrack.sampler.id);
				}
			};
			dragAnchor.content.push(btn);
		}
		if (zidx < 3) {
			let txt: TileText = {
				text: samplerTrack.title+": "+samplerTrack.volume+": "+samplerTrack.sampler.kind + ': ' + samplerTrack.sampler.id
				, x: xx
				, y: yy
				, css: 'fanIconLabel'
			};
			dragAnchor.content.push(txt);
		}
		/*if (zidx < 4) {
			let yZshift = 0.3;
			if (zidx > 0) yZshift = 0.25;
			if (zidx > 1) yZshift = 0.2;
			if (zidx > 2) yZshift = 0.15;
			let txt: TileText = {
				text: icon_gear
				, x: xx
				, y: yy + sz / 5 + clickBtnSz * yZshift
				, css: 'fanSamplerActionIconLabel'
			};
			dragAnchor.content.push(txt);
		}*/
		//}
		let samplerFromY = globalCommandDispatcher.cfg().samplerTop() + (order + 0.5) * globalCommandDispatcher.cfg().samplerDotHeight;
		new ControlConnection().addAudioStreamLineFlow(false, zidx, samplerFromY, xx, yy, spearsAnchor);
		new FanOutputLine().addOutputs(samplerTrack.sampler.outputs, fanLevelAnchor, spearsAnchor, samplerTrack.sampler.id, xx, yy, zidx);
	}
}
