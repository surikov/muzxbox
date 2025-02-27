
class FanOutputLine {
	/*addOutputs(outputs: string[], buttonsAnchor: TileAnchor, fanLinesAnchor: TileAnchor
		, fromID: string
		, fromX: number, fromY: number
		, zidx: number
		, onDelete: (x: number, y: number) => void
	) {
		for (let oo = 0; oo < outputs.length; oo++) {
			let outId = outputs[oo];
			if (outId) {
				this.connectOutput(outId, fromID, fromX, fromY, fanLinesAnchor, buttonsAnchor, zidx, outputs, onDelete);
			} else {
				this.connectSpeaker(fromID, fromX, fromY, fanLinesAnchor, buttonsAnchor, zidx, outputs, onDelete);
			}
		}

	}*/
	connectOutput(outId: string, fromID: string, fromX: number, fromY: number, fanLinesAnchor: TileAnchor, buttonsAnchor: TileAnchor, zidx: number, outputs: string[]
		, onDelete: (x: number, y: number) => void
	) {
		let sz = globalCommandDispatcher.cfg().pluginIconSize * zoomPrefixLevelsCSS[zidx].iconRatio;
		for (let ii = 0; ii < globalCommandDispatcher.cfg().data.filters.length; ii++) {
			if (globalCommandDispatcher.cfg().data.filters[ii].id == outId) {
				let toFilter: Zvoog_FilterTarget = globalCommandDispatcher.cfg().data.filters[ii];
				let left = globalCommandDispatcher.cfg().leftPad + globalCommandDispatcher.cfg().timelineWidth() + globalCommandDispatcher.cfg().padGridFan;
				let top = globalCommandDispatcher.cfg().gridTop();
				let xx = left;
				let yy = top;
				if (toFilter.iconPosition) {
					xx = left + toFilter.iconPosition.x;
					yy = top + toFilter.iconPosition.y;
				}
				new SpearConnection().addSpear(false, zidx,
					fromX, fromY
					, sz, xx, yy
					, fanLinesAnchor);
				this.addDeleteSpear(fromID, toFilter.id, fromX, fromY
					, sz, xx, yy
					, buttonsAnchor, zidx, outputs, onDelete);
				break;
			}
		}
	}
	connectSpeaker(fromID: string, fromX: number, fromY: number, fanLinesAnchor: TileAnchor, buttonsAnchor: TileAnchor, zidx: number, outputs: string[]
		, onDelete: (x: number, y: number) => void

	) {
		let spos = globalCommandDispatcher.cfg().speakerFanPosition();
		let speakerX = spos.x ;//+ globalCommandDispatcher.cfg().speakerIconSize / 2;
		//globalCommandDispatcher.cfg().wholeWidth();// - globalCommandDispatcher.cfg().speakerIconPad - globalCommandDispatcher.cfg().rightPad + globalCommandDispatcher.cfg().speakerIconSize / 2;
		let speakerY = spos.y;//+ globalCommandDispatcher.cfg().speakerIconSize / 2;
		//globalCommandDispatcher.cfg().gridTop() + globalCommandDispatcher.cfg().gridHeight() / 2 - globalCommandDispatcher.cfg().speakerIconSize / 2;
		new SpearConnection().addSpear(false, zidx,
			fromX
			, fromY
			, globalCommandDispatcher.cfg().speakerIconSize
			, speakerX
			, speakerY
			, fanLinesAnchor);
		this.addDeleteSpear(
			fromID, ''
			, fromX
			, fromY
			, globalCommandDispatcher.cfg().speakerIconSize
			, speakerX
			, speakerY
			, buttonsAnchor, zidx, outputs
			, onDelete
		);
	}
	//nonan1(nn: number): number {
	//	return (nn) ? nn : 0;
	//	}
	addDeleteSpear(fromID: string
		, toID: string
		, fromX: number, fromY: number
		, toSize: number
		, toX: number, toY: number
		, anchor: TileAnchor
		, zidx: number
		, outputs: string[]
		, onDelete: (x: number, y: number) => void
	) {
		if (zidx < 5) {
			let diffX = toX - fromX;
			let diffY = toY - fromY;
			let pathLen = Math.sqrt(diffX * diffX + diffY * diffY);
			let spearLen = pathLen - globalCommandDispatcher.cfg().pluginIconSize / 2 - toSize / 2;
			let ratio = spearLen / pathLen;//globalCommandDispatcher.cfg().pluginIconSize / toSize;
			//console.log(ratio);
			let dx = ratio * (toX - fromX) / 2;
			let dy = ratio * (toY - fromY) / 2;
			let deleteButton: TileRectangle = {
				x: fromX + dx - globalCommandDispatcher.cfg().pluginIconSize / 2
				, y: fromY + dy - globalCommandDispatcher.cfg().pluginIconSize / 2
				, w: globalCommandDispatcher.cfg().pluginIconSize
				, h: globalCommandDispatcher.cfg().pluginIconSize
				, rx: globalCommandDispatcher.cfg().pluginIconSize
				, ry: globalCommandDispatcher.cfg().pluginIconSize
				, css: 'fanDropConnection fanDropConnection' + zidx
				, activation: onDelete
				/*, activation: (x: number, y: number) => {
					console.log('delete link from', fromID, 'to', toID);
					this.deleteConnection(toID, outputs);
				}*/
			};
			anchor.content.push(deleteButton);
			let deleteIcon: TileText = {
				x: fromX + dx //- globalCommandDispatcher.cfg().pluginIconSize / 2
				, y: fromY + dy + globalCommandDispatcher.cfg().pluginIconSize / 4
				, text: icon_close
				, css: 'fanDeleteIcon'

			};
			anchor.content.push(deleteIcon);
		}
	}
	/*deleteConnection(id: string, outputs: string[]) {
		let nn = outputs.indexOf(id, 0);
		if (nn > -1) {
			outputs.splice(nn, 1);
			globalCommandDispatcher.resetProject();
		}
	}*/
}
