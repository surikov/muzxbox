class SpearConnection {
    constructor() {

    }
	addSpear(headLen: number, fromX: number, fromY: number, toX: number, toY: number, anchor: TileAnchor, css: string) {
		let mainLine: TileLine = { x1: fromX, x2: toX, y1: fromY, y2: toY, css: css };
		anchor.content.push(mainLine);
		//let headLen = 31;
		let angle = Math.atan2(toY - fromY, toX - fromX);
		let da = Math.PI * 5 / 6.0;
		let dx = headLen * Math.cos(angle - da);
		let dy = headLen * Math.sin(angle - da);
		let first: TileLine = { x1: toX, x2: toX + dx, y1: toY, y2: toY + dy, css: css };
		anchor.content.push(first);
		let dx2 = headLen * Math.cos(angle + da);
		let dy2 = headLen * Math.sin(angle + da);
		let second: TileLine = { x1: toX, x2: toX + dx2, y1: toY, y2: toY + dy2, css: css };
		anchor.content.push(second)
		//console.log(fromX, toX, fromY, toY, angle * 180 / Math.PI, dx, dy);
	}
}
