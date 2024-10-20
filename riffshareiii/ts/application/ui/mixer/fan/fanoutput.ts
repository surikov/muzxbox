
class FanOutputLine {
	addOutputs(outputs: string[], buttonsAnchor: TileAnchor, fanLinesAnchor: TileAnchor
		, fromID: string
		, fromX: number, fromY: number) {
		if (outputs) {
			if (outputs.length > 0) {
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
							new SpearConnection().addSpear(//globalCommandDispatcher.cfg().pluginIconSize, 
								fromX, fromY
								, globalCommandDispatcher.cfg().pluginIconSize, xx, yy
								, fanLinesAnchor);
							this.addDeleteSpear(fromID, toFilter.id, fromX, fromY
								, globalCommandDispatcher.cfg().pluginIconSize, xx, yy
								, buttonsAnchor);
							break;
						}
					}
				}
			} else {
				let speakerX = globalCommandDispatcher.cfg().wholeWidth() - globalCommandDispatcher.cfg().speakerIconPad - globalCommandDispatcher.cfg().rightPad + globalCommandDispatcher.cfg().pluginIconSize / 2;
				let speakerY = globalCommandDispatcher.cfg().gridTop() + globalCommandDispatcher.cfg().gridHeight() / 2 - globalCommandDispatcher.cfg().speakerIconSize / 2;
				new SpearConnection().addSpear(//globalCommandDispatcher.cfg().pluginIconSize
					//, 
					fromX
					, fromY
					, globalCommandDispatcher.cfg().speakerIconSize
					, speakerX + globalCommandDispatcher.cfg().speakerIconSize / 2
					, speakerY + globalCommandDispatcher.cfg().speakerIconSize / 2
					, fanLinesAnchor);
				this.addDeleteSpear(
					fromID, ''
					, fromX
					, fromY
					, globalCommandDispatcher.cfg().speakerIconSize
					, speakerX + globalCommandDispatcher.cfg().speakerIconSize / 2
					, speakerY + globalCommandDispatcher.cfg().speakerIconSize / 2
					, buttonsAnchor);
			}
		}
	}
	//nonan1(nn: number): number {
	//	return (nn) ? nn : 0;
	//	}
	addDeleteSpear(fromID: string, toID: string
		, fromX: number, fromY: number
		, toSize: number
		, toX: number, toY: number
		, anchor: TileAnchor) {
		let diffX = toX - fromX;
		let diffY = toY - fromY;
		let pathLen = Math.sqrt(diffX * diffX + diffY * diffY);
		let spearLen = pathLen - globalCommandDispatcher.cfg().pluginIconSize / 2 - toSize / 2;
		let ratio = spearLen / pathLen;//globalCommandDispatcher.cfg().pluginIconSize / toSize;
		//console.log(ratio);
		let dx = ratio * (toX - fromX) / 2;
		let dy = ratio * (toY - fromY) / 2;
		let deleteButton: TileRectangle = {
			x: fromX + dx - globalCommandDispatcher.cfg().pluginIconSize / 4
			, y: fromY + dy - globalCommandDispatcher.cfg().pluginIconSize / 4
			, w: globalCommandDispatcher.cfg().pluginIconSize / 2
			, h: globalCommandDispatcher.cfg().pluginIconSize / 2
			, rx: globalCommandDispatcher.cfg().pluginIconSize / 4
			, ry: globalCommandDispatcher.cfg().pluginIconSize / 4
			, css: 'fanDropConnection'
			, activation: (x: number, y: number) => {
				console.log('delete link from', fromID, 'to', toID);
			}
		};
		anchor.content.push(deleteButton);
		let deleteIcon: TileText = {
			x: fromX + dx //- globalCommandDispatcher.cfg().pluginIconSize / 2
			, y: fromY + dy + globalCommandDispatcher.cfg().pluginIconSize / 8
			, text: icon_close
			, css: 'fanDeleteIcon'

		};
		anchor.content.push(deleteIcon);
	}
}
