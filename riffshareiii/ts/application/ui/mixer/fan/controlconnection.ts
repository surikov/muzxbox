class ControlConnection {
	addAudioStreamLineFlow(yy: number, ww: number, anchor: TileAnchor) {
		let css = 'controlConnection';//'fanStream';
		let sz4 = globalCommandDispatcher.cfg().pluginIconSize / 4;
		let left = globalCommandDispatcher.cfg().leftPad + globalCommandDispatcher.cfg().timelineWidth();
		new SpearConnection().addSpear(
					left
					, yy
					, 1
					, left+ww
					, yy
					, anchor);
		/*let line: TileRectangle = {
			x: left
			, y: yy - sz4
			, w: ww - sz4
			, h: sz4 * 2
			, css: css
		};
		anchor.content.push(line);
		let spearHead: TilePolygon = {
			x: left + ww - sz4, y: yy - sz4, css: css, dots: [
				0, 0
				, sz4, sz4
				, 0, sz4 * 2

			]
		};
		anchor.content.push(spearHead);*/
		/*
		let mainLine: TileLine = { x1: fromX, x2: toX, y1: fromY, y2: toY, css: css };
		anchor.content.push(mainLine);
		let angle = Math.atan2(toY - fromY, toX - fromX);
		let da = Math.PI * 19 / 20.0;
		let dx = headLen * Math.cos(angle - da);
		let dy = headLen * Math.sin(angle - da);
		let first: TileLine = { x1: toX, x2: toX + dx, y1: toY, y2: toY + dy, css: css };
		anchor.content.push(first);
		let dx2 = headLen * Math.cos(angle + da);
		let dy2 = headLen * Math.sin(angle + da);
		let second: TileLine = { x1: toX, x2: toX + dx2, y1: toY, y2: toY + dy2, css: css };
		anchor.content.push(second)
		*/
	}
}
