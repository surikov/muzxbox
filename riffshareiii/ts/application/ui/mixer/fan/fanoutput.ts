
class FanOutputLine {
	addOutputs(outputs: string[], fanLinesAnchor: TileAnchor, fromX: number, fromY: number) {
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
						new SpearConnection().addSpear(//globalCommandDispatcher.cfg().pluginIconSize, 
						fromX, fromY
							, globalCommandDispatcher.cfg().pluginIconSize, xx, yy
							, fanLinesAnchor);
						break;
					}
				}
			}
		} else {
			let speakerX = globalCommandDispatcher.cfg().wholeWidth() - globalCommandDispatcher.cfg().speakerIconPad - globalCommandDispatcher.cfg().rightPad + globalCommandDispatcher.cfg().pluginIconSize / 2;
			let speakerY=globalCommandDispatcher.cfg().gridTop() + globalCommandDispatcher.cfg().gridHeight() / 2-globalCommandDispatcher.cfg().speakerIconSize / 2;
			new SpearConnection().addSpear(//globalCommandDispatcher.cfg().pluginIconSize
				//, 
				fromX
				, fromY
				, globalCommandDispatcher.cfg().speakerIconSize
				, speakerX + globalCommandDispatcher.cfg().speakerIconSize / 2
				, speakerY+ globalCommandDispatcher.cfg().speakerIconSize / 2
				, fanLinesAnchor);
		}
	}
}
