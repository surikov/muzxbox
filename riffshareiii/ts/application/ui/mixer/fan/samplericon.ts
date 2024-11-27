class SamplerIcon {
	samplerId: string;
	constructor(samplerId: string) {
		this.samplerId = samplerId;
	}
	buildSamplerSpot(order: number, fanLevelAnchor: TileAnchor, spearsAnchor: TileAnchor, zidx: number) {
		for (let ii = 0; ii < globalCommandDispatcher.cfg().data.percussions.length; ii++) {
			if (globalCommandDispatcher.cfg().data.percussions[ii].sampler.id == this.samplerId) {
				let sampler: Zvoog_AudioSampler = globalCommandDispatcher.cfg().data.percussions[ii].sampler;
				this.addSamplerSpot(order, sampler, fanLevelAnchor, spearsAnchor, zidx);
				break;
			}
		}
	}
	addSamplerSpot(order: number, sampler: Zvoog_AudioSampler, fanLevelAnchor: TileAnchor, spearsAnchor: TileAnchor, zidx: number) {
		//let sz = globalCommandDispatcher.cfg().pluginIconSize * 1.3 * zoomPrefixLevelsCSS[zidx].iconRatio;
		let sz = globalCommandDispatcher.cfg().fanPluginIconSize(zidx) * 1.3 ;
		
		//console.log(zidx);
		let left = globalCommandDispatcher.cfg().leftPad + globalCommandDispatcher.cfg().timelineWidth() + globalCommandDispatcher.cfg().padGridFan;
		let top = globalCommandDispatcher.cfg().gridTop();
		let xx = left;
		let yy = top;
		if (sampler.iconPosition) {
			xx = left + sampler.iconPosition.x;
			yy = top + sampler.iconPosition.y;
		}
		//if (zidx < 7) {
		let dragAnchor: TileAnchor = {
			xx: xx - sz / 2, yy: yy - sz / 2, ww: sz, hh: sz
			, showZoom: fanLevelAnchor.showZoom, hideZoom: fanLevelAnchor.hideZoom, content: [], translation: { x: 0, y: 0 }
		};
		fanLevelAnchor.content.push(dragAnchor);
		let rec: TilePolygon = {
			x: xx - sz / 2
			, y: yy - sz / 2
			, dots: [
				0, sz / 2
				, sz / 2, 0
				, sz, sz / 2
				, sz / 2, sz
			]
			, draggable: true
			, activation: (x: number, y: number) => {
				//console.log('sampler', x, y);
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
					console.log('move ' + sampler.kind + ':' + sampler.id + ' to ' + sampler.iconPosition.x + '/' + sampler.iconPosition.y);
					dragAnchor.translation = { x: 0, y: 0 };
					globalCommandDispatcher.resetProject();
				} else {
					dragAnchor.translation.x = dragAnchor.translation.x + x;
					dragAnchor.translation.y = dragAnchor.translation.y + y;
					if (sampler.iconPosition) {
						let xx = sampler.iconPosition.x + dragAnchor.translation.x;
						let yy = sampler.iconPosition.y + dragAnchor.translation.y;
						//console.log(xx,yy);
						let toplugin=globalCommandDispatcher.cfg().findPluginSamplerIcon(xx,yy,zidx,sampler.id);
						console.log('link ' + sampler.kind + ':' + sampler.id + ' to '+toplugin );
					}
					globalCommandDispatcher.renderer.tiler.resetAnchor(globalCommandDispatcher.renderer.mixer.fanSVGgroup
						, fanLevelAnchor
						, LevelModes.normal);
				}
			}
			, css: 'fanSamplerMoveIcon fanSamplerMoveIcon' + zidx
		};
		dragAnchor.content.push(rec);
		if (zidx < 3) {
			let txt: TileText = {
				text: sampler.kind + ':' + sampler.id
				, x: xx
				, y: yy
				, css: 'fanIconLabel'
			};
			dragAnchor.content.push(txt);

		}
		//let clickBtnSz = globalCommandDispatcher.cfg().pluginIconSize * 0.3 * zoomPrefixLevelsCSS[zidx].iconRatio;
		let clickBtnSz = globalCommandDispatcher.cfg().fanPluginIconSize(zidx) * 0.3 ;
		
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

		}
		if (zidx < 4) {
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
		}
		//}
		let samplerFromY = globalCommandDispatcher.cfg().samplerTop() + (order + 0.5) * globalCommandDispatcher.cfg().samplerDotHeight;
		new ControlConnection().addAudioStreamLineFlow(zidx, samplerFromY, xx, yy, spearsAnchor);
		new FanOutputLine().addOutputs(sampler.outputs, fanLevelAnchor, spearsAnchor, sampler.id, xx, yy, zidx);
	}
}
