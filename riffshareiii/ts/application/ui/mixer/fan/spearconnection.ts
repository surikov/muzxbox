class SpearConnection {
	constructor() {

	}
	addSpear(fromX: number, fromY: number, toX: number, toY: number, anchor: TileAnchor) {
		let headLen = 3;
		let css = 'fanConnection';

		let diffX = toX - fromX;
		let diffY = toY - fromY;
		let pathLen = Math.sqrt(diffX * diffX + diffY * diffY);
		let ratio = pathLen / (globalCommandDispatcher.cfg().pluginIconSize / 1.8);

		let xx1 = fromX + diffX / ratio;
		let yy1 = fromY + diffY / ratio;
		let xx2 = toX - diffX / ratio;
		let yy2 = toY - diffY / ratio;

		//let mainLine: TileLine = { x1: fromX, x2: toX, y1: fromY, y2: toY, css: css };
		let mainLine: TileLine = { x1: xx1, x2: xx2, y1: yy1, y2: yy2, css: css };
		anchor.content.push(mainLine);
		//let headLen = 31;
		let angle = Math.atan2(yy2 - yy1, xx2 - xx1);
		let da = Math.PI * 19 / 20.0;
		let dx = headLen * Math.cos(angle - da);
		let dy = headLen * Math.sin(angle - da);
		let first: TileLine = { x1: xx2, x2: xx2 + dx, y1: yy2, y2: yy2 + dy, css: css };
		anchor.content.push(first);
		let dx2 = headLen * Math.cos(angle + da);
		let dy2 = headLen * Math.sin(angle + da);
		let second: TileLine = { x1: xx2, x2: xx2 + dx2, y1: yy2, y2: yy2 + dy2, css: css };
		anchor.content.push(second)
		//console.log(fromX, toX, fromY, toY, angle * 180 / Math.PI, dx, dy);
	}
}
