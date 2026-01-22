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
function levelCountEmpty(data: BalsRow[], fromRow: number, ball: number, step: number): number {
	let cnt = 0;
	//for (let ii = fromRow + 1; ii < data2.length; ii++) {
	for (let rr = 1; rr < data.length; rr++) {
		let ii = fromRow + rr * step;
		if (ballExistsInRow(ball, data[ii])) {
			break;
		}
		cnt++;
	}
	return cnt;
}
function rowCountEmpty(data: BalsRow[], fromRow: number, step: number): CellLevel[] {
	let cellVolumes: CellLevel[] = [];
	for (let tt = 0; tt < cellCount; tt++) {
		let ball = tt + 1;
		cellVolumes[tt] = {
			ball: ball
			, volume: levelCountEmpty(data, fromRow, ball, step)
			, exists: ballExistsInRow(ball, data[fromRow])
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
function dumpRows(data: BalsRow[], firstRow: number, len: number) {
	for (let step = 1; step < len; step++) {
		let txt = '';
		let levels: CellLevel[] = rowCountEmpty(data, firstRow, step);
		levels.sort((a, b) => {
			return b.volume - a.volume
		});
		for (let kk = 0; kk < cellCount; kk++) {
			let ball = levels[kk].ball;
			let point = ' ' + t2(ball) + '';
			if (ballExistsInRow(ball, data[firstRow])) {
				point = '+' + t2(ball) + '';
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
function dumpLevels(row0: number, data: BalsRow[]) {
	for (let ii = 0; ii < 35; ii++) {
		let levels: CellLevel[] = rowCountEmpty(data, row0 + ii, 1);
		levels.sort((a, b) => {
			return b.volume - a.volume
		});
		let txt = '';
		for (let kk = 0; kk < levels.length; kk++) {
			if (levels[kk].volume == 4) {
				txt = txt + '.';
			} else {
				if (levels[kk].volume > 4) {
					txt = txt + ' ';
				} else {
					txt = txt + ' ';
				}
			}
			if (levels[kk].exists) {
				txt = txt + '' + t2(levels[kk].ball) + '';
			} else {
				txt = txt + '  ';
			}
		}
		console.log(txt);
	}
}
function start2() {
	//console.log('Test string %c[a], b','color: magenta;');
	let start = Math.round(Math.random() * 5000);
	console.log(start);//, dataRows2: BalsRow[][start].balls);
	//for (let ii = 1; ii <= 45; ii++) {
	//console.log(ii,'------------------------');
	//dumpRows(start, 40);//data2[start].balls[0]);
	//}
	dumpLevels(start, dataRows2);
}
