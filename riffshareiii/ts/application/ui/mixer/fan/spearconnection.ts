class SpearConnection {
	constructor() {

	}
	nonan(nn: number): number {
		return (nn) ? nn : 0;
	}
	addSpear(
		secondary: boolean
		, zidx: number
		, fromX: number, fromY: number
		, toSize: number
		, toX: number, toY: number
		, anchor: TileAnchor) {
		let headLen = 0.5 * (1 + zidx);
		let css = 'fanConnectionBase fanConnection' + zidx;
		if (secondary) {
			css = 'fanConnectionBase fanConnectionSecondary fanConnection' + zidx;
		}
		//console.log(zidx);

		let diffX = toX - fromX;
		let diffY = toY - fromY;
		let pathLen = Math.sqrt(diffX * diffX + diffY * diffY);
		//let fromRatio = pathLen / (fromSize / 2 );
		let toRatio = pathLen / (toSize / 2);

		//let xx1 = fromX + diffX / fromRatio;
		//let yy1 = fromY + diffY / fromRatio;
		let xx2 = toX - diffX / toRatio;
		let yy2 = toY - diffY / toRatio;

		//let mainLine: TileLine = { x1: fromX, x2: toX, y1: fromY, y2: toY, css: css };
		//let mainLine: TileLine = { x1: this.nonan(xx1), x2: this.nonan(xx2), y1: this.nonan(yy1), y2: this.nonan(yy2), css: css };
		let mainLine: TileLine = { x1: this.nonan(fromX), x2: this.nonan(xx2), y1: this.nonan(fromY), y2: this.nonan(yy2), css: css };
		anchor.content.push(mainLine);
		//let headLen = 31;
		//let angle = Math.atan2(yy2 - yy1, xx2 - xx1);
		let angle = Math.atan2(yy2 - fromY, xx2 - fromX);
		let da = Math.PI * 19 / 20.0;
		let dx = headLen * Math.cos(angle - da);
		let dy = headLen * Math.sin(angle - da);
		let first: TileLine = { x1: this.nonan(xx2), x2: this.nonan(xx2 + dx), y1: this.nonan(yy2), y2: this.nonan(yy2 + dy), css: css };
		anchor.content.push(first);
		let dx2 = headLen * Math.cos(angle + da);
		let dy2 = headLen * Math.sin(angle + da);
		let second: TileLine = { x1: this.nonan(xx2), x2: this.nonan(xx2 + dx2), y1: this.nonan(yy2), y2: this.nonan(yy2 + dy2), css: css };
		anchor.content.push(second)
		//console.log(fromX, toX, fromY, toY, angle * 180 / Math.PI, dx, dy);

	}
}
