type CellLevel = {
	ball: number
	, volume: number
	, exists: boolean
};
function t2(nn: number): string {
	if (nn < 10) {
		return '0' + nn;
	} else {
		return '' + nn;
	}
}
function levelCountEmpty(fromRow: number, ball: number, step: number): number {
	let cnt = 0;
	//for (let ii = fromRow + 1; ii < data2.length; ii++) {
	for (let rr = 1; rr < data2.length; rr++) {
		let ii = fromRow + rr * step;
		if (ballExistsInRow(ball, data2[ii])) {
			break;
		}
		cnt++;
	}
	return cnt;
}
function rowCountEmpty(fromRow: number, step: number): CellLevel[] {
	let cellVolumes: CellLevel[] = [];
	for (let tt = 0; tt < cellCount; tt++) {
		let ball = tt + 1;
		cellVolumes[tt] = {
			ball: ball
			, volume: levelCountEmpty(fromRow, ball, step)
			, exists: ballExistsInRow(ball, data2[fromRow])
		};
	}
	return cellVolumes;
}
function ballExistsInRow(ball: number, row: BalsRow): boolean {
	if (row.balls.indexOf(ball) > -1) {
		return true;
	} else {
		return false;
	}
}
function dumpRows(firstRow: number, len: number) {
	for (let step = 1; step < 40; step++) {
		let txt = '';
		let levels: CellLevel[] = rowCountEmpty(firstRow, step);
		levels.sort((a, b) => {
			return b.volume - a.volume
		});
		for (let kk = 0; kk < cellCount; kk++) {
			let ball=levels[kk].ball;
			let point = ' ' + t2(ball) + ' ';
			if (ballExistsInRow(ball, data2[firstRow])) {
				point = '[' + t2(ball) + ']';
			}
			txt = txt + point;
		}
		let cnt = 0;
		for (let nn = 0; nn < cellCount; nn++) {
			if (levels[nn].exists) {
				break;
			}
			cnt++;
		}
		console.log(txt, ':', cnt);
	}
}
function start2() {
	//console.log('Test string %c[a], b','color: magenta;');
	let start = Math.round(Math.random() * 5000);
	console.log('start2', start);
	dumpRows(start, 20);
}
