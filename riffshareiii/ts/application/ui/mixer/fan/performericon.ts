class PerformerIcon {
	performerId: string;
	constructor(performerId: string) {
		this.performerId = performerId;
	}
	buildPerformerSpot(fanLevelAnchor: TileAnchor, spearsAnchor: TileAnchor, zidx: number) {
		for (let ii = 0; ii < globalCommandDispatcher.cfg().data.tracks.length; ii++) {
			if (globalCommandDispatcher.cfg().data.tracks[ii].performer.id == this.performerId) {
				let audioSeq: Zvoog_AudioSequencer = globalCommandDispatcher.cfg().data.tracks[ii].performer;
				this.addPerformerSpot(ii>0,audioSeq, fanLevelAnchor, spearsAnchor, zidx);
				break;
			}
		}
	}
	addPerformerSpot(secondary:boolean,audioSeq: Zvoog_AudioSequencer, fanLevelAnchor: TileAnchor, spearsAnchor: TileAnchor, zidx: number) {
		let sz = globalCommandDispatcher.cfg().fanPluginIconSize(zidx);
		let left = globalCommandDispatcher.cfg().leftPad + globalCommandDispatcher.cfg().timelineWidth() + globalCommandDispatcher.cfg().padGridFan;
		let top = globalCommandDispatcher.cfg().gridTop();
		let xx = left;
		let yy = top;
		if (audioSeq.iconPosition) {
			xx = left + audioSeq.iconPosition.x;
			yy = top + audioSeq.iconPosition.y;
		}
		let dragAnchor: TileAnchor = {
			xx: xx - sz / 2, yy: yy - sz / 2, ww: sz, hh: sz
			, showZoom: fanLevelAnchor.showZoom, hideZoom: fanLevelAnchor.hideZoom, content: [], translation: { x: 0, y: 0 }
		};
		fanLevelAnchor.content.push(dragAnchor);
		let rec: TileRectangle = {
			x: xx - sz / 2, y: yy - sz / 2
			, w: sz, h: sz
			, draggable: true
			, activation: (x: number, y: number) => {
				if (!dragAnchor.translation) {
					dragAnchor.translation = { x: 0, y: 0 };
				}
				if (x == 0 && y == 0) {
					console.log('done', dragAnchor.translation);
					if (!audioSeq.iconPosition) {
						audioSeq.iconPosition = { x: 0, y: 0 };
					}
					audioSeq.iconPosition.x = audioSeq.iconPosition.x + dragAnchor.translation.x;
					audioSeq.iconPosition.y = audioSeq.iconPosition.y + dragAnchor.translation.y;
					console.log('drop' + audioSeq.kind + ':' + audioSeq.id + ' to ' + audioSeq.iconPosition.x + '/' + audioSeq.iconPosition.y);
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
			, css: 'fanSamplerMoveIcon fanSamplerMoveIcon' + zidx
		};
		dragAnchor.content.push(rec);
		spearsAnchor.content.push({
			x: xx - sz / 2 + sz * 0.05, y: yy - sz / 2 + sz * 0.05
			, w: sz * 0.9, h: sz * 0.9
			, css: 'fanConnectionBase fanConnection' + zidx
		});
		
		//let clickBtnSz = globalCommandDispatcher.cfg().fanPluginIconSize(zidx) * 0.3;
		if (zidx < 5) {
			let btn: TileRectangle = {
				x: xx-sz/2//xx - clickBtnSz / 2
				, y: yy//yy + sz / 5 - clickBtnSz / 2
				, w: sz//clickBtnSz
				, h: sz/2//clickBtnSz
				//, rx: clickBtnSz / 2
				//, ry: clickBtnSz / 2
				, css: 'fanSamplerInteractionIcon fanButton' + zidx
				, activation: (x: number, y: number) => {
					console.log('' + audioSeq.kind + ':' + audioSeq.id);
				}
			};
			dragAnchor.content.push(btn);
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
		if (zidx < 3) {
			let txt: TileText = {
				text: audioSeq.kind + ':' + audioSeq.id
				, x: xx
				, y: yy
				, css: 'fanIconLabel'
			};
			dragAnchor.content.push(txt);

		}
		let performerFromY = globalCommandDispatcher.cfg().gridTop() + globalCommandDispatcher.cfg().gridHeight() / 2;
		new ControlConnection().addAudioStreamLineFlow(secondary,zidx, performerFromY, xx, yy, spearsAnchor);
		new FanOutputLine().addOutputs(audioSeq.outputs, fanLevelAnchor, spearsAnchor, audioSeq.id, xx, yy, zidx);
	}
}

