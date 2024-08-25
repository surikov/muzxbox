class ControlConnection{
    addLineFlow( yy: number,  ww: number, anchor: TileAnchor) {
        let css='debug';//'fanStream';
        let left = globalCommandDispatcher.cfg().leftPad + globalCommandDispatcher.cfg().timelineWidth() ;
        let line:TileRectangle={x:left,y:yy,w:ww,h:8,css:css};
        anchor.content.push(line);
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
