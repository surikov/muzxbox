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
/*
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
*/
function dumpLevels(row0: number, data: BalsRow[], stepsize: number) {
	let counts: number[] = [];
	for (let ii = 0; ii < 40; ii++) {
		let levels: CellLevel[] = rowCountEmpty(data, row0 + ii * stepsize, stepsize);
		levels.sort((a, b) => {
			return b.volume - a.volume
		});
		let txt = '';
		for (let kk = 0; kk < levels.length; kk++) {
			if (levels[kk].exists) {
				txt = txt + '[' + t2(levels[kk].ball) + ']';
				counts[kk] = counts[kk] ? counts[kk] + 1 : 1;
			} else {
				txt = txt + ' ' + t2(levels[kk].ball) + ' ';
			}
		}
		console.log(txt + ' : ' + (row0 + ii * stepsize));

	}
	let line = '';
	for (let kk = 0; kk < 45; kk++) {
		counts[kk] = counts[kk] ? counts[kk] : 0;
		line = line + ':' + t2(counts[kk]) + ' ';
	}
	console.log(line);
}
function start2() {
	let start = Math.round(Math.random() * 5000);
	let stepsize = 1 + Math.round(Math.random() * 50);
	//console.log(window.location);
	let txt = window.location.href;
	//console.log(txt);
	let url = new URL(txt);
	let searchParams = new URLSearchParams(url.search);
	let txtstart = searchParams.get('start');
	if (txtstart) {
		start = parseInt(txtstart);
	}
	let txtstepsize = searchParams.get('step');
	if (txtstepsize) {
		stepsize = parseInt(txtstepsize);
	}
	//console.log(searchParams.get('start'));  // outputs "m2-m3-m4-m5"
	//console.log(searchParams.get('step'));  // outputs "m2-m3-m4-m5"
	//console.log('Test string %c[a], b','color: magenta;');

	console.log('test2.html?start=' + start + '&step=' + stepsize);//, dataRows2: BalsRow[][start].balls);
	//for (let ii = 1; ii <= 45; ii++) {
	//console.log(ii,'------------------------');
	//dumpRows(start, 40);//data2[start].balls[0]);
	//}
	dumpLevels(start, dataRows2, stepsize);
}
