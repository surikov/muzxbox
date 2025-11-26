let skipRowsCount = 0;

var levelA: SVGElement;
var linesLevel: SVGElement;
var dataBalls: string[];
var datarows: BallsRow[];

let showFirstRow = true;

declare var dataName: string;
declare var rowLen: number;
declare var ballsInRow: number;

let sversion = 'v1.143 ' + dataName + ': ' + ballsInRow + '/' + rowLen;

let markX = -1;
let markY = -1;
let cellSize = 12;
let topShift = cellSize * 21;
let rowsVisibleCount = 101;
let rowsAvgCount = 5;
let rowsSliceCount = rowsVisibleCount + rowsAvgCount;
let reduceRatio = 1;
let highLightMode = 1;
var calcLen = 32;
let diffWide = 5;

let blueNotGree = true;
let lastfirst: BallsRow;

let wideRange = false;

let mxdata: { ball: number, mx: number }[] = [];
let mindata: { ball: number, min: number, exists?: boolean, diff: number }[] = [];
let mincopy: { ball: number, min: number, exists?: boolean, diff: number }[] = [];

type StatBeginEnd = {
	row: number;
	left: number;
	right: number;
};

let sortedBlue: number[] = [];
let sortedGreen: number[] = [];
let sortedGrey: number[] = [];

let markLines: { fromX: number, fromY: number, toX: number, toY: number, color: string, manual: boolean, light?: boolean }[] = [];//{ fromX: 5, fromY: 6, toX: 33, toY: 22 }];
type BallsRow = {
	key: string;
	balls: number[];
};
function dumpInfo(r: number) {
	var msgp: HTMLElement = (document.getElementById('msgp') as any) as HTMLElement;
	msgp.innerText = sversion + ': ' + r;
}
function sliceRows(rows: BallsRow[], firstRowNum: number, lastRowNum: number): BallsRow[] {
	var sliced: BallsRow[] = [];
	let nn = firstRowNum;
	for (var i = firstRowNum; i <= lastRowNum; i++) {
		sliced.push(rows[nn]);
		nn = nn + reduceRatio;
	}
	return sliced;
}
function readParseStat(dataBalls: string[]): BallsRow[] {
	let dlmtr: string = '  ';
	var rows: BallsRow[] = [{
		balls: [],
		key: 'next'
	}];
	for (let i = 0; i < ballsInRow; i++) {
		rows[0].balls.push(0);
	}
	for (var i = 0; i < dataBalls.length; i++) {
		var txt = dataBalls[i].trim();
		var arr = txt.split(dlmtr);
		if (arr.length > ballsInRow - 1) {
			var row: BallsRow = {
				balls: [],
				key: ''
			};
			for (var k = 0; k < ballsInRow; k++) {
				var ballnum: number = 1 * ((arr[k] as unknown) as number);
				row.balls.push(ballnum);
			}
			row.balls.sort((a, b) => a - b);
			row.key = dataBalls[i - 1].trim();
			row.key = row.key.replace(':00', ':00 #');
			row.key = row.key.replace(':30', ':30 #');
			rows.push(row);
		}
	}
	return rows;
}
function ballExists(ball: number, row: BallsRow): boolean {
	if (row) {
		while (ball < 1) ball = ball + rowLen;
		while (ball > rowLen) ball = ball - rowLen;
		for (var i = 0; i < row.balls.length; i++) {
			if (row.balls[i] == ball) {
				return true;
			}
		}
	}
	return false;
}
function addSmallText(svg: SVGElement, x: number, y: number, txt: string) {
	var svgNS: string = "http://www.w3.org/2000/svg";
	var nd: Text = document.createTextNode(txt);
	var tx: Element = document.createElementNS(svgNS, 'text');
	tx.setAttributeNS(null, "x", '' + x);
	tx.setAttributeNS(null, "y", '' + y);
	tx.setAttributeNS(null, "font-size", "9");
	tx.setAttribute("fill", '#000000');
	svg.append(tx);
	tx.appendChild(nd);
}
function addBigText(svg: SVGElement, x: number, y: number, txt: string) {
	var svgNS: string = "http://www.w3.org/2000/svg";
	var nd: Text = document.createTextNode(txt);
	var tx: Element = document.createElementNS(svgNS, 'text');
	tx.setAttributeNS(null, "x", '' + x);
	tx.setAttributeNS(null, "y", '' + y);
	tx.setAttributeNS(null, "font-size", "12");
	tx.setAttribute("fill", '#000000');
	svg.append(tx);
	tx.appendChild(nd);
}
function addColoredText(svg: SVGElement, x: number, y: number, txt: string, color: string) {
	var svgNS: string = "http://www.w3.org/2000/svg";
	var nd: Text = document.createTextNode(txt);
	var tx: Element = document.createElementNS(svgNS, 'text');
	tx.setAttributeNS(null, "x", '' + x);
	tx.setAttributeNS(null, "y", '' + y);
	tx.setAttributeNS(null, "font-size", "11");
	tx.setAttribute("fill", color);
	svg.append(tx);
	tx.appendChild(nd);
}
function addLine(svg: SVGElement, x1: number, y1: number, x2: number, y2: number, strokeWidth: number, color: string) {
	var newLine: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'line');
	newLine.setAttribute('x1', '' + x1);
	newLine.setAttribute('y1', '' + y1);
	newLine.setAttribute('x2', '' + x2);
	newLine.setAttribute('y2', '' + y2);
	newLine.setAttribute("stroke", color);
	newLine.setAttribute("stroke-width", '' + strokeWidth);
	newLine.setAttribute("stroke-linecap", 'round');
	svg.append(newLine);
}
function composeLine(svg: SVGElement, x1: number, y1: number, x2: number, y2: number, strokeWidth: number, color: string) {
	if (isNaN(x1) || isNaN(x2) || isNaN(y1) || isNaN(y2)) {
		console.log('wrong composeLine', x1, x2, y1, y2);
	} else {
		addLine(svg, x1, y1, x2, y2, strokeWidth / 2, color);
	}
}
function addCircle(svg: SVGElement, x: number, y: number, r: number, strokecolor: string, fillcolor: string) {
	var rect: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
	rect.setAttribute('x', '' + (x - r));
	rect.setAttribute('y', '' + (y - r));
	rect.setAttribute('width', '' + (r * 2));
	rect.setAttribute('height', '' + (r * 2));
	rect.setAttribute('rx', '' + r);
	rect.setAttribute('ry', '' + r);
	rect.setAttribute("stroke", strokecolor);
	rect.setAttribute("stroke-width", '1');
	rect.setAttribute("fill", fillcolor);
	svg.append(rect);
}
function addRect(svg: SVGElement, x: number, y: number, w: number, h: number, color: string) {
	var rect: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
	rect.setAttribute('x', '' + x);
	rect.setAttribute('y', '' + y);
	rect.setAttribute('width', '' + w);
	rect.setAttribute('height', '' + h);
	rect.setAttribute("stroke-width", '0');
	rect.setAttribute("fill", color);
	svg.append(rect);
}
function clearSVGgroup(svgpane: Node) {
	while (svgpane.firstChild) {
		svgpane.removeChild(svgpane.firstChild);
	}
}
function init() {

	levelA = (document.getElementById('levelA') as any) as SVGElement;
	linesLevel = (document.getElementById('linesLevel') as any) as SVGElement;
	dataBalls = window[dataName];

	datarows = readParseStat(dataBalls);

}
/*
function dumpStatLeftRed(datarows: BallsRow[]) {
	console.log('dumpStatLeftRed', datarows);
	let counts: number[] = [];
	for (let rr = 0; rr <= rowLen; rr++) {
		counts[rr] = 0;
	}

	for (let rr = 0; rr < datarows.length; rr++) {
		let min = 9999;
		for (let bb = 0; bb < datarows[rr].balls.length; bb++) {
			if (min > datarows[rr].balls[bb]) {
				min = datarows[rr].balls[bb];
			}
		}
		counts[min]++;
	}
	let sm = 0;
	for (let rr = 0; rr <= rowLen; rr++) {
		sm = sm + counts[rr];
		console.log(rr, counts[rr], ('' + (100 * counts[rr] / datarows.length) + '%'), ('' + (100 * sm / datarows.length) + '%'));
	}
	//console.log('mins',sm,counts);
}
*/
function randomizedatarows() {
	for (var ii = 0; ii < datarows.length; ii++) {
		var row = datarows[ii];
		for (var bb = 0; bb < ballsInRow; bb++) {
			row.balls[bb] = Math.floor(Math.random() * rowLen);
		}
	}
}
function clickClearLines() {
	markLines = [];
	drawLines();
}
function clearNonManual() {
	let newarr: { fromX: number, fromY: number, toX: number, toY: number, color: string, manual: boolean }[] = [];
	for (let ii = 0; ii < markLines.length; ii++) {
		if (markLines[ii].manual) {
			newarr.push(markLines[ii]);
		}
	}
	markLines = newarr;


}
function clickFog(vnt: any) {
	let xx = Math.round((vnt.offsetX - 0.5 * cellSize) / cellSize);
	let yy = skipRowsCount + Math.round((vnt.offsetY - 0.5 * cellSize) / cellSize);
	if (markX < 0) {
		let exists: boolean = false;
		for (let i = 0; i < markLines.length; i++) {
			if ((xx == markLines[i].fromX && yy == markLines[i].fromY) || (xx == markLines[i].toX && yy == markLines[i].toY)) {
				markLines.splice(i, 1);
				exists = true;
				break;
			}
		}
		if (!exists) {
			markX = xx;
			markY = yy;
		}
	} else {
		markLines.push({
			fromX: xx, fromY: yy, toX: markX, toY: markY, color: '#ff0000ff', manual: true
		});
		markX = -1;
		markY = -1;
	}
	let mark = (document.getElementById('lineMark') as any) as any;
	mark.setAttribute('width', cellSize * 1.5);
	mark.setAttribute('height', cellSize * 1.5);
	mark.setAttribute('x', cellSize * markX - 0.25 * cellSize);
	mark.setAttribute('y', cellSize * (markY - skipRowsCount) - 0.25 * cellSize);
	drawLines();
}
function drawLines() {


	clearSVGgroup(linesLevel);
	let strokeWidth = cellSize / 0.99;
	for (let i = 0; i < markLines.length; i++) {
		if (markLines[i].light) {
			strokeWidth = 4;
		} else {
			strokeWidth = cellSize / 0.99;
		}
		if (!markLines[i].manual) {
			composeLine(linesLevel
				, markLines[i].fromX * cellSize + 0.5 * cellSize
				, (markLines[i].fromY - skipRowsCount) * cellSize + 0.5 * cellSize
				, markLines[i].toX * cellSize + 0.5 * cellSize
				, (markLines[i].toY - skipRowsCount) * cellSize + 0.5 * cellSize
				, strokeWidth //, cellSize / 0.99
				, markLines[i].color);//'#00ff0066');
		}
	}
	strokeWidth = cellSize / 2.99;
	for (let i = 0; i < markLines.length; i++) {

		if (markLines[i].manual) {
			composeLine(linesLevel
				, markLines[i].fromX * cellSize + 0.5 * cellSize
				, (markLines[i].fromY - skipRowsCount) * cellSize + 0.5 * cellSize
				, markLines[i].toX * cellSize + 0.5 * cellSize
				, (markLines[i].toY - skipRowsCount) * cellSize + 0.5 * cellSize
				, strokeWidth //, cellSize / 0.99
				, markLines[i].color);//'#00ff0066');
		}
	}
}
function drawStat3(svg: SVGElement, rows: BallsRow[]) {
	drawLines();
	addRect(svg, rowLen * cellSize + cellSize / 2, 0, rowLen * cellSize, cellSize, '#eee');
	for (let rowNum = 0; rowNum < rowsVisibleCount; rowNum++) {
		if (rows[rowNum]) {
			addSmallText(svg, 2 * rowLen * cellSize + 2, topShift + (1 + rowNum) * cellSize - 2, rows[rowNum].key);
			for (let colNum = 1; colNum <= rowLen; colNum++) {
				if (ballExists(colNum, rows[rowNum])) {
					let topy = topShift + 0.5 * cellSize + rowNum * cellSize;
					let szz = cellSize / 3 - 0.5;
					let clr = '#ff000066';
					if (rowNum == 0) {
						topy = topy - 1.5 * cellSize;
						szz = cellSize / 3 - 0.5
						clr = '#00ff00ff';
					}
					if (rowNum > 0 || showFirstRow) {
						addCircle(svg
							, colNum * cellSize - 0.5 * cellSize + 0 * rowLen * cellSize
							, topy//topShift + 0.5 * cellSize + rowNum * cellSize
							, szz, clr, clr);
					}
					if (rowNum > 0 || showFirstRow) {
						addCircle(svg
							, colNum * cellSize - 0.5 * cellSize + 1 * rowLen * cellSize
							, topy//topShift + 0.5 * cellSize + rowNum * cellSize
							, szz, clr, clr);
					}
				}
			}
		}
	}

	for (let colNum = 1; colNum <= rowLen; colNum++) {
		if (colNum % 10 == 0) {
			addBigText(svg, colNum * cellSize - cellSize * 0.8, topShift - 2, "" + colNum);
			addBigText(svg, (colNum + rowLen) * cellSize - cellSize * 0.8, topShift - 5, "" + colNum);
		} else {
			addSmallText(svg, colNum * cellSize - cellSize * 0.8, topShift - 2, "" + colNum);
			addSmallText(svg, (colNum + rowLen) * cellSize - cellSize * 0.8, topShift - 5, "" + colNum);
		}
		composeLine(levelA
			, colNum * cellSize - cellSize
			, 0
			, colNum * cellSize - cellSize
			, topShift - cellSize
			, cellSize / 20, '#0000ff66');
		composeLine(levelA
			, colNum * cellSize - cellSize + rowLen * cellSize
			, 0
			, colNum * cellSize - cellSize + rowLen * cellSize
			, topShift - cellSize
			, cellSize / 20, '#0000ff66');
	}
}
function triadExists(ball: number, rowNum: number, dx1: number, dx2: number, rows: BallsRow[]): boolean {
	return ballExists(ball, rows[rowNum]) && ballExists(ball + dx1, rows[rowNum + 1]) && ballExists(ball + dx2, rows[rowNum + 2]);
}
function triadFills(ball: number, rowNum: number, dx1: number, dx2: number, rows: BallsRow[]): boolean {
	return ballExists(ball + dx1, rows[rowNum + 1]) && ballExists(ball + dx2, rows[rowNum + 2]);
}
function calcTriads(rowNum: number, dx1: number, dx2: number, rows: BallsRow[]): number {
	let cnt = 0;
	for (let ii = 0; ii < rowLen; ii++) {
		if (triadExists(ii + 1, rowNum, dx1, dx2, rows)) {
			cnt++;
		}
	}
	return cnt;
}
function calcRowPatterns(rowNum: number, rows: BallsRow[]): number[] {
	let cnts: number[] = [];
	for (let dx1 = 0; dx1 < rowLen; dx1++) {
		for (let dx2 = 0; dx2 < rowLen; dx2++) {
			cnts.push(calcTriads(rowNum, dx1, dx2, rows));
		}
	}
	return cnts;
}
function calculateBallTriadChain(rowNum: number, rows: BallsRow[], counts: number[]): { ball: number, fills: { dx1: number, dx2: number }[], summ: number, logr: number }[] {
	let resu: { ball: number, fills: { dx1: number, dx2: number }[], summ: number, logr: number }[] = [];
	for (let nn = 0; nn < rowLen; nn++) {
		let one: { ball: number, fills: { dx1: number, dx2: number }[], summ: number, logr: number } = { ball: nn + 1, fills: [], summ: 0, logr: 0 };
		resu.push(one);
		for (let dx1 = 0; dx1 < rowLen; dx1++) {
			for (let dx2 = 0; dx2 < rowLen; dx2++) {
				if (triadFills(one.ball, rowNum, dx1, dx2, rows)) {
					one.fills.push({ dx1: dx1, dx2: dx2 });
					let cc = counts[dx1 * rowLen + dx2]
					one.summ = one.summ + cc;
				}
			}
		}
		one.logr = one.summ;
	}
	return resu;
}
function calculateBallFrequency(rowNum: number, rows: BallsRow[]): { ball: number, fills: { dx1: number, dx2: number }[], summ: number, logr: number }[] {
	let resu: { ball: number, fills: { dx1: number, dx2: number }[], summ: number, logr: number }[] = [];
	for (let nn = 0; nn < rowLen; nn++) {
		let one: { ball: number, fills: { dx1: number, dx2: number }[], summ: number, logr: number } = { ball: nn + 1, fills: [], summ: 0, logr: 0 };
		resu.push(one);
		for (var rr = rowNum + 1; rr < rowNum + 1 + calcLen; rr++) {
			if (ballExists(nn + 1, rows[rr])) {
				//one.summ++;
				break;
			}
			one.summ++;
		}
		let cntbl = 1;
		for (var rr = rowNum + 1; rr < rowNum + 1 + 50; rr++) {
			if (ballExists(nn + 1, rows[rr])) {
				cntbl++;
			}
		}

		one.logr = one.summ + 1 / cntbl;

	}

	return resu;
}

function calcEmptyLineDuration(shift: number, ball: number, from: number, rows: BallsRow[]) {
	let row = from;
	let count = 0;
	let balColumn = ball;
	while ((!ballExists(balColumn, rows[row])) && row + 2 < rows.length) {
		count++;
		balColumn = balColumn + shift;
		row++;
	}
	return count;
}
function dumpInfo2(id: string, text: string) {

	var span: HTMLElement = (document.getElementById(id) as any) as HTMLElement;
	span.innerText = text;

}
function countInfo(inrows: BallsRow[]) {
	let diff: number = 7;
	console.log('countInfo', diff, inrows[0]);

	let smm: { ball: number, sm: number, xst: string, sh: number }[] = [];
	for (let ii = 0; ii < rowLen; ii++) {
		let cc = 0;
		for (let shift = -diff; shift <= diff; shift++) {
			cc = cc + calcEmptyLineDuration(shift, ii + 1, 1, inrows);
		}
		let fl = '   ';
		if (ballExists(ii + 1, inrows[0])) {
			fl = ' * ';
		}

		smm.push({ ball: ii + 1, sm: cc, xst: fl, sh: diff });
	}

	for (let kk = 0; kk < smm.length; kk++) {
		let len = Math.round(5 * smm[kk].sm / (diff + diff + 1));
		let fl = '  ';
		if (showFirstRow) {
			if (ballExists(smm[kk].ball, inrows[0])) {
				fl = '* ';
			}
		}
		for (let nn = 0; nn < len; nn++) {
			fl = fl + '-';
		}
		fl = fl + ' ' + len + ':' + smm[kk].ball;
		console.log(fl);
	}

	smm.sort((a, b) => {
		return a.sm - b.sm;
	});
	console.log(smm);

}
function dumpRowFills(inrows: BallsRow[]) {


	if (highLightMode == 1) {
		dumpRowFillsColor(inrows, '#009900cc', 0);

		dumpRowWaitColor(inrows, '#00000033', 0);
	} else {
		dumpRowWaitColor(inrows, '#009900cc', 0);
		dumpRowFillsColor(inrows, '#00000033', 0);
	}



}

function dumpRowWaitColor(rows: BallsRow[], color: string, shiftX: number) {
	let lbl = '';
	//greyStat = [];
	let grey2 = '#33333333';
	let grey = '#333333ff';
	for (let rr = 0; rr < rowsVisibleCount; rr++) {
		let arr: { ball: number, summ: number }[] = [];
		for (let nn = 0; nn < rowLen; nn++) {
			let one: { ball: number, summ: number } = { ball: nn + 1, summ: 0 };
			arr.push(one);
			for (let shift = -diffWide; shift <= diffWide; shift++) {
				one.summ = one.summ + calcEmptyLineDuration(shift, nn + 1, rr + 1, rows);
			}
		}
		makeWader(arr);
		let mx = 0;
		let min = 98765;
		//console.log(rr,arr);
		for (let bb = 0; bb < rowLen; bb++) {
			if (mx < arr[bb].summ) mx = arr[bb].summ;
			if (min > arr[bb].summ) min = arr[bb].summ;
		}
		let hr = (mx - min) / (topShift / cellSize - 2);
		let prehh = (mx - min - (arr[rowLen - 1].summ - min)) / hr;


		let first = arr.map((x) => x);
		first.sort((aa, bb) => { return bb.summ - aa.summ; });
		if (rr == 0) {
			sortedGrey = [];
			for (let ff = 0; ff < first.length; ff++) {
				sortedGrey[ff] = first[ff].ball;
			}
		}
		let begin = -1;
		let end = -1;
		let begin2 = -1;
		let end2 = -1;
		for (let kk = 0; kk < first.length; kk++) {
			if (ballExists(first[kk].ball, rows[rr])) {
				if (showFirstRow || rr > 0) {
					//lbl = lbl + padLen('[' + first[kk].ball+']',4);
					lbl = lbl + '[' + pad0('' + first[kk].ball, 2) + ']';
					end = kk;
					if (begin == -1) {
						begin = kk;
					}
				} else {
					//lbl = lbl + padLen(' ' + first[kk].ball,4);
					lbl = lbl + ' ' + pad0('' + first[kk].ball, 2) + ' ';
				}
			} else {
				//lbl = lbl +padLen(' ' + first[kk].ball,4);
				lbl = lbl + ' ' + pad0('' + first[kk].ball, 2) + ' ';
			}
		}
		for (let kk = 0; kk < first.length; kk++) {
			if (ballExists(first[kk].ball, rows[rr])) {
				if (showFirstRow || rr > 0) {
					if (kk < end) end2 = kk;
					if (begin2 == -1 && kk > begin) {
						begin2 = kk;
					}
				}
			}
		}
		lbl = padLen('' + padLen('' + begin, 2) + ':' + padLen('' + end, 2) + '(' + padLen('' + (rowLen - end - 1), 2) + '): grey', 20) + lbl;
		if (rr == 0) {

			//console.log(lbl);
			dumpInfo2('statgrey', lbl);
		}

		let yyy = rowsVisibleCount + 22 + 0.66 * rr + skipRowsCount;
		let xxx = 2 * rowLen / 2;

		if (showFirstRow || rr > 0) {

			markLines.push({ fromX: xxx, fromY: yyy, toX: xxx + begin2 / 2, toY: yyy, color: grey2, manual: false });
			markLines.push({ fromX: xxx + end2 / 2, fromY: yyy, toX: xxx + (rowLen - 1) / 2, toY: yyy, color: grey2, manual: false });

			markLines.push({ fromX: xxx, fromY: yyy, toX: xxx + begin / 2, toY: yyy, color: grey, manual: false });
			markLines.push({ fromX: xxx + end / 2, fromY: yyy, toX: xxx + (rowLen - 1) / 2, toY: yyy, color: grey, manual: false });

		}

	}

}
function makeWader(ballFills: { ball: number, summ: number }[]) {
	if (wideRange) {
		let mx = 0;
		let min = 987654321;
		for (let bb = 0; bb < rowLen; bb++) {
			if (mx < ballFills[bb].summ) { mx = ballFills[bb].summ; }
			if (min > ballFills[bb].summ) { min = ballFills[bb].summ; }
		}
		let middle = (mx - min) / 2 + min;

		let sorted = ballFills.map((x) => x);
		sorted.sort((aa, bb) => { return bb.summ - aa.summ; });
		let center = sorted[Math.round((sorted.length - 1) / 2)].summ - min;

		for (let bb = 0; bb < rowLen; bb++) {
			ballFills[bb].summ = ballFills[bb].summ - center;
			let sig = ballFills[bb].summ > 0 ? 1 : -1;
			ballFills[bb].summ = sig * ballFills[bb].summ * ballFills[bb].summ;
		}

	}
}
function dumpRowFillsColor(rows: BallsRow[], color: string, shiftX: number) {
	let green2 = '#00990033';
	let green = '#009900ff';
	let lbl = '';
	//console.log(lbl);
	//greenStat = [];
	for (let rr = 0; rr < rowsVisibleCount; rr++) {
		let precounts: number[] = calcRowPatterns(rr + 1, rows);
		let ballFills: { ball: number, fills: { dx1: number, dx2: number }[], summ: number }[] = calculateBallTriadChain(rr, rows, precounts);
		makeWader(ballFills);
		let mx = 0;
		let min = 987654321;
		for (let bb = 0; bb < rowLen; bb++) {
			if (mx < ballFills[bb].summ) { mx = ballFills[bb].summ; }
			if (min > ballFills[bb].summ) { min = ballFills[bb].summ; }
		}
		let hr = (mx - min) / (topShift / cellSize - 2);
		let prehh = (mx - min - (ballFills[rowLen - 1].summ - min)) / hr;
		//console.log(ballFills);

		let first = ballFills.map((x) => x);
		first.sort((aa, bb) => { return bb.summ - aa.summ; });
		if (rr == 0) {
			sortedGreen = [];
			for (let ff = 0; ff < first.length; ff++) {
				sortedGreen[ff] = first[ff].ball;
			}
		}
		let begin = -1;
		let end = -1;
		let begin2 = -1;
		let end2 = -1;
		for (let kk = 0; kk < first.length; kk++) {
			if (ballExists(first[kk].ball, rows[rr])) {
				if (showFirstRow || rr > 0) {
					//lbl = lbl + padLen('[' + first[kk].ball+']',4);
					lbl = lbl + '[' + pad0('' + first[kk].ball, 2) + ']';
					end = kk;
					if (begin == -1) {
						begin = kk;
					}
				} else {
					//lbl = lbl + padLen( ' '+first[kk].ball,4);
					lbl = lbl + ' ' + pad0('' + first[kk].ball, 2) + ' ';
				}
			} else {
				//lbl = lbl +padLen( ' '+first[kk].ball,4);
				lbl = lbl + ' ' + pad0('' + first[kk].ball, 2) + ' ';
			}
		}
		for (let kk = 0; kk < first.length; kk++) {
			if (ballExists(first[kk].ball, rows[rr])) {
				if (showFirstRow || rr > 0) {
					if (kk < end) end2 = kk;
					if (begin2 == -1 && kk > begin) {
						begin2 = kk;
					}
				}
			}
		}
		lbl = padLen('' + padLen('' + begin, 2) + ':' + padLen('' + end, 2) + '(' + padLen('' + (rowLen - end - 1), 2) + '): green', 20) + lbl;
		//console.log(lbl);
		if (rr == 0) {
			dumpInfo2('statgreen', lbl);
		}


		let yyy = rowsVisibleCount + 22 + 0.66 * rr + skipRowsCount;
		let xxx = 1 * rowLen / 2;
		//if (rr % 2) markLines.push({ fromX: xxx, fromY: yyy, toX: xxx + rowLen / 2, toY: yyy, color: '#00000011', manual: false });
		if (showFirstRow || rr > 0) {

			markLines.push({ fromX: xxx, fromY: yyy, toX: xxx + begin2 / 2, toY: yyy, color: green2, manual: false });
			markLines.push({ fromX: xxx + end2 / 2, fromY: yyy, toX: xxx + (rowLen - 1) / 2, toY: yyy, color: green2, manual: false });

			markLines.push({ fromX: xxx, fromY: yyy, toX: xxx + begin / 2, toY: yyy, color: green, manual: false });
			markLines.push({ fromX: xxx + end / 2, fromY: yyy, toX: xxx + (rowLen - 1) / 2, toY: yyy, color: green, manual: false });

		}



	}

}
function dumpTriads(svg: SVGElement, rows: BallsRow[]) {

	let ratioPre = 0.99;//0.99;

	let red = '#ff6633ff';
	let red2 = '#ff663366';
	let blue2 = '#3333ff33';
	let blue = '#3333ffff';
	let mgnt = '#ff00ffff';

	let blueLeftRight: { left: number, right: number }[] = [];

	for (let rr = 0; rr < rowsVisibleCount; rr++) {
		if (rr > rows.length - 6) break;
		let calcs: { ball: number, fills: { dx1: number, dx2: number }[], summ: number, logr: number }[];
		if (highLightMode == 1) {
			calcs = calculateBallFrequency(rr, rows);
		} else {
			let precounts = calcRowPatterns(rr + 1, rows);
			calcs = calculateBallTriadChain(rr, rows, precounts);
		}
		makeWader(calcs);
		let minCnt = 99999;
		let mxCount = 0;
		for (let ii = 0; ii < rowLen; ii++) {
			if (calcs[ii].summ > mxCount) mxCount = calcs[ii].summ;
			if (calcs[ii].summ < minCnt) minCnt = calcs[ii].summ;
		}
		let df = mxCount - minCnt;

		let first = calcs.map((x) => x);
		let lbl = "";
		first.sort((aa, bb) => { return aa.logr - bb.logr; });


		if (rr == 0) {
			sortedBlue = [];
			for (let ff = 0; ff < first.length; ff++) {
				sortedBlue[ff] = first[ff].ball;
			}
		}

		lbl = '';
		let begin1 = -1;
		let end = -1;
		let begin2 = -1;
		let end2 = -1;

		for (let kk = 0; kk < first.length; kk++) {

			if (ballExists(first[kk].ball, rows[rr])) {

				if (showFirstRow || rr > 0) {

					lbl = '[' + pad0('' + first[kk].ball, 2) + ']' + lbl;
					end = kk;
					if (begin1 == -1) {
						begin1 = kk;
					}
				} else {

					lbl = ' ' + pad0('' + first[kk].ball, 2) + ' ' + lbl;
				}
			} else {

				lbl = ' ' + pad0('' + first[kk].ball, 2) + ' ' + lbl;
			}

		}
		for (let kk = 0; kk < first.length; kk++) {
			if (ballExists(first[kk].ball, rows[rr])) {
				if (showFirstRow || rr > 0) {
					if (kk < end) {
						end2 = kk;
					}
					if (begin2 == -1 && kk > begin1) {
						begin2 = kk;
					}
				}
			}
		}

		lbl = padLen('' + padLen('' + (rowLen - end - 1), 2) + ':' + padLen('' + (rowLen - begin1 - 1), 2) + '(' + padLen('' + begin1, 2) + '): blue ', 20) + lbl;
		if (rr == 0) {

			dumpInfo2('statblue', lbl);

		}
		/*
				if (rr == 1) {
					let leftNum = -1;
					let rightNum = 0;
					for (let kk = 0; kk < first.length; kk++) {
						if (ballExists(first[kk].ball, rows[rr])) {
							rightNum = kk;
							if (leftNum < 0) {
								leftNum = kk;
							}
						}
					}
					let leftStart = rowLen - rightNum;
					let leftBall = first[rightNum].ball;
					let rightEnd = rowLen - leftNum;
					let rightBall = first[leftNum].ball;
					console.log('preblue', leftStart, '>', rightEnd);
				}
		*/
		let yyy = rowsVisibleCount + 22 + 0.66 * rr + skipRowsCount;
		let xxx = 0 * rowLen / 2;

		if (showFirstRow || rr > 0) {
			let x2 = xxx + (rowLen - 1) / 2;

			markLines.push({ fromX: x2, fromY: yyy, toX: x2 - begin2 / 2, toY: yyy, color: blue2, manual: false });
			markLines.push({ fromX: xxx, fromY: yyy, toX: x2 - end2 / 2, toY: yyy, color: blue2, manual: false });


			markLines.push({ fromX: x2, fromY: yyy, toX: x2 - begin1 / 2, toY: yyy, color: blue, manual: false });
			markLines.push({ fromX: xxx, fromY: yyy, toX: x2 - end / 2, toY: yyy, color: blue, manual: false });

		}
		//console.log(begin1,end);
		blueLeftRight.push({ left: rowLen - end, right: begin1 });

		if (showFirstRow || rr > 0) {
			begin1 = rowLen + 1;
			end = 0;
			let begin2 = rowLen + 1;
			let end2 = 0;
			for (let kk = 0; kk < rows[rr].balls.length; kk++) {
				if (rows[rr].balls[kk] < begin1) begin1 = rows[rr].balls[kk];
				if (rows[rr].balls[kk] > end) end = rows[rr].balls[kk];
			}
			for (let kk = 0; kk < rows[rr].balls.length; kk++) {
				if (rows[rr].balls[kk] < begin2 && rows[rr].balls[kk] > begin1) begin2 = rows[rr].balls[kk];
				if (rows[rr].balls[kk] > end2 && rows[rr].balls[kk] < end) end2 = rows[rr].balls[kk];
			}
			begin1--;
			end--;
			begin2--;
			end2--;
			yyy = rowsVisibleCount + 22 + 0.66 * rr + skipRowsCount;
			xxx = 3 * rowLen / 2;

			markLines.push({ fromX: xxx, fromY: yyy, toX: xxx + begin2 / 2, toY: yyy, color: red2, manual: false });
			markLines.push({ fromX: xxx + end2 / 2, fromY: yyy, toX: xxx + (rowLen - 1) / 2, toY: yyy, color: red2, manual: false });
			markLines.push({ fromX: xxx, fromY: yyy, toX: xxx + begin1 / 2, toY: yyy, color: red, manual: false });
			markLines.push({ fromX: xxx + end / 2, fromY: yyy, toX: xxx + (rowLen - 1) / 2, toY: yyy, color: red, manual: false });

		}



		/*
				for (let ii = 0; ii < rowLen; ii++) {
					let idx = ratioPre * (calcs[ii].summ - minCnt) / df;
					let color = 'rgba(0,0,255,' + idx + ')';
					//color='rgba(0,0,255,0.5)';
		
					addRect(svg
						, ii * cellSize - 0 * cellSize + 0 * rowLen * cellSize
						, topShift + 0 * cellSize + rr * cellSize
						, cellSize
						, cellSize //- 0.1
						, color);
					addRect(svg
						, ii * cellSize - 0 * cellSize + 1 * rowLen * cellSize
						, topShift + 0 * cellSize + rr * cellSize
						, cellSize
						, cellSize //- 0.1
						, color);
		
				}
		*/
		if (blueNotGree) {
			paintCellsBlue(ratioPre, calcs, minCnt, svg, df, rr);
		} else {
			paintCellsGreen(svg, rr, rows);
		}
		//paintCellsGreen(ratioPre, calcs, minCnt, svg, df, rr, rows);
	}
	let szDiff = 6;
	for (let mmm = 0; mmm < 98 - szDiff; mmm++) {
		let blueLeftDiffSumm = 0;
		let blueRighDiffSumm = 0;
		for (let ii = 1; ii < szDiff; ii++) {
			blueLeftDiffSumm = blueLeftDiffSumm + Math.abs(blueLeftRight[mmm + ii].left - blueLeftRight[mmm + ii + 1].left);
			blueRighDiffSumm = blueRighDiffSumm + Math.abs(blueLeftRight[mmm + ii].right - blueLeftRight[mmm + ii + 1].right);
		}
		blueLeftDiffSumm = blueLeftDiffSumm / szDiff;
		blueRighDiffSumm = blueRighDiffSumm / szDiff;
		//var span: HTMLElement = (document.getElementById('statdump') as any) as HTMLElement;
		//span.innerText = '' + szDiff + ": blue diff: " + Math.round(blueLeftDiffSumm) + ' | ' + Math.round(blueRighDiffSumm);
		//console.log(mmm, Math.round(blueLeftDiffSumm), Math.round(blueRighDiffSumm));
		let yyy = rowsVisibleCount + 22 + 0.66 * mmm + skipRowsCount + 0.33;
		let xxx = 0 * rowLen / 2
		let invLeftWidth = blueLeftDiffSumm * blueLeftDiffSumm / 10;
		let invRightWidth = blueRighDiffSumm * blueRighDiffSumm / 10;
		//console.log(mmm, invLeftWidth, invRightWidth);
		markLines.push({ fromX: xxx, fromY: yyy, toX: xxx + invLeftWidth, toY: yyy, color: mgnt, manual: false, light: true });
		markLines.push({ fromX: xxx + rowLen / 2 - invRightWidth, fromY: yyy, toX: xxx + rowLen / 2, toY: yyy, color: mgnt, manual: false, light: true });
	}
}

function paintCellsBlue(ratioPre: number
	, calcs: { ball: number, fills: { dx1: number, dx2: number }[], summ: number, logr: number }[]
	, minCnt: number
	, svg: SVGElement
	, df: number
	, rr: number
) {
	for (let ii = 0; ii < rowLen; ii++) {
		let idx = ratioPre * (calcs[ii].summ - minCnt) / df;
		//let color = 'rgba(0,0,255,' + idx + ')';
		let colorP = Math.floor(255 * (1 - idx));
		let color = 'rgba(' + colorP + ',' + colorP + ',255)';
		//color='rgba(0,0,255,0.5)';

		addRect(svg
			, ii * cellSize - 0 * cellSize + 0 * rowLen * cellSize
			, topShift + 0 * cellSize + rr * cellSize
			, cellSize
			, cellSize //- 0.1
			, color);
		addRect(svg
			, ii * cellSize - 0 * cellSize + 1 * rowLen * cellSize
			, topShift + 0 * cellSize + rr * cellSize
			, cellSize
			, cellSize //- 0.1
			, color);

	}
}
function paintCellsGreen(//ratioPre: number
	//, calcs: { ball: number, fills: { dx1: number, dx2: number }[], summ: number, logr: number }[]
	//, minCnt: number
	svg: SVGElement
	//, df: number
	, rr: number
	, rows: BallsRow[]
) {

	for (let ii = 0; ii < rowLen; ii++) {
		let idx = 0;
		let stepColor = 4 * ballsInRow;
		for (let kk = 1; kk <= stepColor; kk++) {
			if (ballExists(ii + 1, rows[rr + kk])) {
				idx = idx + 4 * ballsInRow / kk;
			}
		}
		idx = 1 - idx / ballsInRow;
		//idx = ballsInRow * (idx * idx) / (stepColor * stepColor);
		//console.log(idx);

		//let color = 'rgba(0,0,255,' + idx + ')';
		//let colorP = Math.floor(255 * (1 - idx));
		//colorP = colorP * colorP / 255;
		//if (colorP < 0) colorP = 0;
		//if (colorP > 150) colorP = 150;
		if (idx < 0) idx = 0;
		if (idx > 1) idx = 1;
		let color = 'rgba(0,200,0,' + idx + ')';
		//color='rgba(0,0,255,0.5)';

		addRect(svg
			, ii * cellSize - 0 * cellSize + 0 * rowLen * cellSize
			, topShift + 0 * cellSize + rr * cellSize
			, cellSize
			, cellSize //- 0.1
			, color);
		addRect(svg
			, ii * cellSize - 0 * cellSize + 1 * rowLen * cellSize
			, topShift + 0 * cellSize + rr * cellSize
			, cellSize
			, cellSize //- 0.1
			, color);

	}
}

function roundDown(num: number, base: number): number {
	return Math.floor(num / base) * base;
}

function fillCells() {
	clearSVGgroup(levelA);
	let slicedrows: BallsRow[] = sliceRows(datarows, skipRowsCount, skipRowsCount + rowsSliceCount + calcLen);
	dumpTriads(levelA, slicedrows);
	dumpInfo(skipRowsCount);
	let len3 = 0.5 * rowLen * cellSize / 3;
	addRect(levelA, len3, topShift + (1 + rowsVisibleCount) * cellSize, len3, rowsVisibleCount * cellSize, '#eee');
	addRect(levelA, rowLen * cellSize / 2 + len3, topShift + (1 + rowsVisibleCount) * cellSize, len3, rowsVisibleCount * cellSize, '#eee');
	addRect(levelA, rowLen * cellSize + len3, topShift + (1 + rowsVisibleCount) * cellSize, len3, rowsVisibleCount * cellSize, '#eee');
	addRect(levelA, 3 * rowLen * cellSize / 2 + len3, topShift + (1 + rowsVisibleCount) * cellSize, len3, rowsVisibleCount * cellSize, '#eee');
	drawStat3(levelA, slicedrows);

	var msgp: HTMLElement = (document.getElementById('stepsize') as any) as HTMLElement;
	msgp.innerText = '' + reduceRatio;

	msgp = (document.getElementById('calcWide') as any) as HTMLElement;
	msgp.innerText = '' + diffWide;

}
function clickToggleMode() {
	blueNotGree = !blueNotGree;
	addTails();
}
function clickHop() {
	skipRowsCount = Math.round(Math.random() * (datarows.length - reduceRatio * rowsVisibleCount));
	addTails();
}
function toggleFirst() {
	showFirstRow = !showFirstRow;

	addTails();
}
function toggleWide() {
	wideRange = !wideRange;

	addTails();
}

function clickGoSkip(nn: number) {
	if (skipRowsCount + nn * reduceRatio >= 0) {
		if (skipRowsCount + nn * reduceRatio < datarows.length - rowsVisibleCount * reduceRatio) {
			skipRowsCount = skipRowsCount + nn * reduceRatio;
			for (let i = 0; i < markLines.length; i++) {
				markLines[i].fromY = markLines[i].fromY + nn * (reduceRatio - 1);
				markLines[i].toY = markLines[i].toY + nn * (reduceRatio - 1);
			}
			addTails();
		}
	}
}
function toggleRatioPre() {
	if (highLightMode == 0) {
		highLightMode = 1;
	} else {
		highLightMode = 0;
	}
	addTails();
}
function moreReduceRatio() {
	reduceRatio = reduceRatio + 1;
	addTails();
}
function lessReduceRatio() {
	reduceRatio = reduceRatio - 1;
	if (reduceRatio < 1) reduceRatio = 1;
	addTails();
}
function moreCalcLen() {
	calcLen = calcLen + 1;
	addTails();
}
function lessCalcLen() {
	calcLen = calcLen - 1;
	if (calcLen < 3) calcLen = 3;
	addTails();
}


function moreWide() {
	diffWide = diffWide + 1;
	addTails();
}
function lessWide() {
	diffWide = diffWide - 1;
	if (diffWide < 0) diffWide = 0;
	addTails();
}

function sobstvennoe(balls: number[]): number {
	let pre: number[] = balls;
	let nxt: number[] = [];
	while (1 == 1) {
		nxt = [];
		for (let bb = 1; bb < pre.length; bb++) {
			nxt.push(Math.abs(pre[bb - 1] - pre[bb]));
		}
		if (nxt.length < 2) break;
		pre = [];
		for (let bb = 0; bb < nxt.length; bb++) {
			pre[bb] = nxt[bb];
		}

	}
	let r0 = nxt[0];
	if (r0 < 2) r0 = -(pre[1] + pre[0]);
	return r0;
}
function padLen(txt: string, sz: number) {
	let len = txt.length;
	let add = 0;
	if (len < sz) {
		add = sz - len;
	}
	let rez = txt;
	for (let ii = 0; ii < add; ii++) {
		rez = rez + ' ';
	}
	//console.log(rez,add);
	return rez;
}
function pad0(txt: string, sz: number) {
	let len = txt.length;
	let add = 0;
	if (len < sz) {
		add = sz - len;
	}
	let rez = '';
	for (let ii = 0; ii < add; ii++) {
		rez = rez + '0';
	}
	rez = rez + txt;
	return rez;
}
function resetNumbs() {
	let lbl = ' ';
	for (let ii = 0; ii < rowLen; ii++) {
		lbl = lbl + pad0('' + (1 + ii), 2);
		lbl = lbl + '  ';
	}
	dumpInfo2('statnums', padLen('', 20) + lbl);
}
function addTails() {
	clearNonManual();
	let slicedrows: BallsRow[] = sliceRows(datarows, skipRowsCount, skipRowsCount + rowsSliceCount * 2);
	lastfirst = slicedrows[0];
	dumpRowFills(slicedrows);

	fillCells();

	mindata = [];
	mxdata = [];

	for (let ii = 0; ii < rowLen; ii++) {
		let blue = rowLen - sortedBlue.indexOf(ii + 1) - 1;
		let green = sortedGreen.indexOf(ii + 1);
		let black = sortedGrey.indexOf(ii + 1);
		let blueGreenDiff = Math.abs(blue - green);
		let greenBlackDiff = Math.abs(green - black);
		let blackBlueDiff = Math.abs(black - blue);
		let mx = Math.max(blueGreenDiff, greenBlackDiff, blackBlueDiff);
		mxdata.push({ ball: ii + 1, mx: mx });
		let min = Math.min(blueGreenDiff, greenBlackDiff, blackBlueDiff);
		mindata.push({ ball: ii + 1, min: min, diff: 0 });
		if (ballExists(mindata[mindata.length - 1].ball, slicedrows[0])) {
			mindata[mindata.length - 1].exists = true;
		}
	}
	let lbl = '';
	mxdata.sort((a: { ball: number, mx: number }, b: { ball: number, mx: number }) => {
		return a.mx - b.mx;
	});
	let begin = -1;
	let end = -1;
	for (let kk = 0; kk < mxdata.length; kk++) {
		if (ballExists(mxdata[kk].ball, slicedrows[0])) {
			if (showFirstRow) {

				lbl = lbl + '[' + pad0('' + mxdata[kk].ball, 2) + ']';
				end = kk;
				if (begin == -1) {
					begin = kk;
				}
			} else {

				lbl = lbl + ' ' + pad0('' + mxdata[kk].ball, 2) + ' ';
			}
		} else {

			lbl = lbl + ' ' + pad0('' + mxdata[kk].ball, 2) + ' ';
		}
	}
	dumpInfo2('statpurple', padLen('' + padLen('' + (0 + begin), 2) + ':' + padLen('' + end, 2) + '(' + padLen('' + (rowLen - end - 1), 2) + '): mx:', 20) + lbl);

	lbl = '';
	//let modidata=mindata.slice();
	mindata.sort((a: { ball: number, min: number }, b: { ball: number, min: number }) => {
		return a.min - b.min;
	});
	mincopy = mindata.slice();;
	begin = -1;
	end = -1;
	for (let kk = 0; kk < mindata.length; kk++) {
		if (ballExists(mindata[kk].ball, slicedrows[0])) {
			if (showFirstRow) {

				lbl = lbl + '[' + pad0('' + mindata[kk].ball, 2) + ']';
				end = kk;
				if (begin == -1) {
					begin = kk;
				}
			} else {

				lbl = lbl + ' ' + pad0('' + mindata[kk].ball, 2) + ' ';
			}
		} else {

			lbl = lbl + ' ' + pad0('' + mindata[kk].ball, 2) + ' ';
		}
	}

	dumpInfo2('statred', padLen('' + padLen('' + (0 + begin), 2) + ':' + padLen('' + end, 2) + '(' + padLen('' + (rowLen - end - 1), 2) + '): min:', 20) + lbl);


	let minDist = 99;
	let summDist = 0;
	let maxDist = -1;
	let purpleiff = padLen('', 21);
	for (let kk = 0; kk < mxdata.length; kk++) {
		let dist = 0;
		for (let xx = 0; xx < mindata.length; xx++) {

			if (mindata[xx].ball == mxdata[kk].ball) {
				dist = xx - kk;
				break;
			}
		}
		purpleiff = purpleiff + padLen((dist > 0 ? '+' : '') + dist, 4);
		summDist = summDist + Math.abs(dist);
		if (minDist > Math.abs(dist)) minDist = Math.abs(dist);
		if (maxDist < Math.abs(dist)) maxDist = Math.abs(dist);
	}
	let avgDist = Math.round(summDist / mindata.length);

	let rediff = padLen('' + minDist + '/' + avgDist + '/' + maxDist, 21);
	for (let kk = 0; kk < mindata.length; kk++) {
		let dist = 0;
		for (let xx = 0; xx < mxdata.length; xx++) {

			if (mxdata[xx].ball == mindata[kk].ball) {
				dist = xx - kk;
				break;
			}
		}
		rediff = rediff + padLen((dist > 0 ? '+' : '') + dist, 4);
		mindata[kk].diff = dist;
	}
	var span: HTMLElement = (document.getElementById('infopurple') as any) as HTMLElement;
	span.innerText = purpleiff;
	span = (document.getElementById('infored') as any) as HTMLElement;
	span.innerText = rediff;

	mindata.sort((a: { diff: number }, b: { diff: number }) => {

		return Math.abs(a.diff) - Math.abs(b.diff);
	});

	resetNumbs();

	//testTest2();
	//testAbsDiff(skipRowsCount);
	//dumpDiffStat();

}

function addTestLines1(data: { ball: number, color: string }[]) {
	let bas = 19;
	for (let ii = 0; ii < data.length; ii++) {
		markLines.push({
			fromX: data[ii].ball - 1
			, fromY: skipRowsCount + 0.85 * (bas / data.length * ii)
			, toX: data[ii].ball - 1
			, toY: skipRowsCount + bas
			, color: data[ii].color, manual: true
		});
		markLines.push({
			fromX: data[ii].ball - 1 + rowLen
			, fromY: skipRowsCount + 0.85 * (bas / data.length * ii)
			, toX: data[ii].ball - 1 + rowLen
			, toY: skipRowsCount + bas
			, color: data[ii].color, manual: true
		});
	}
}
function addTestLines2(data: { ball: number, color: string }[]) {
	let bas = 19;
	for (let ii = 0; ii < data.length; ii++) {
		markLines.push({
			fromX: data[ii].ball - 1
			, fromY: skipRowsCount + 0.85 * (bas - bas / data.length * ii)
			, toX: data[ii].ball - 1
			, toY: skipRowsCount + bas
			, color: data[ii].color, manual: true
		});
		markLines.push({
			fromX: data[ii].ball - 1 + rowLen
			, fromY: skipRowsCount + 0.85 * (bas - bas / data.length * ii)
			, toX: data[ii].ball - 1 + rowLen
			, toY: skipRowsCount + bas
			, color: data[ii].color, manual: true
		});
	}
}
function arrHas0(arr: number[]): boolean {
	for (let ii = 1; ii < arr.length; ii++) {
		if (arr[ii] == 0) {
			return true;
		}
	}
	return false;
}

/*
function dumpStat22() {
	console.log('dumpStat22');
	let counts: number[] = [];
	for (let ii = 1; ii < datarows.length - 3; ii++) {
		let idx = datarows[ii + 0].balls[0];
		if (idx) {
			if (!(counts[idx])) {
				counts[idx] = 0;
			}
			counts[idx]++;
		}
	}
	let itog: number[] = [];
	for (let ii = counts.length - 2; ii > 0; ii--) {
		itog[ii] = Math.round(100 * counts[ii] / datarows.length) + ((itog[ii + 1]) ? itog[ii + 1] : 0);
	}
	console.log(counts, itog);
	console.log(datarows.length);
}
function diffPart(a: number, b: number): number {
	if (a > b) {
		return a / b;
	} else {
		return b / a;
	}
}
function dumpPairsCounts() {
	let start = Math.round(Math.random() * 4321 + 1);
	//let deep=4;

	let ball = datarows[start].balls[0];
	console.log('dumpPairsCounts', start, datarows[start], datarows);
	let line = '';
	for (let kk = 0; kk < ball; kk++) {
		line = line + 'I';
	}
	console.log(line, ball);
	let preArr1 = [];
	dumpPairsPatterns(start, preArr1, ball, 1);
	dumpPairsPatterns(start, preArr1, ball, 2);
	dumpPairsPatterns(start, preArr1, ball, 3);
	dumpPairsPatterns(start, preArr1, ball, 4);
	dumpPairsPatterns(start, preArr1, ball, 5);
	dumpPairsPatterns(start, preArr1, ball, 6);
	dumpPairsPatterns(start, preArr1, ball, 7);
	console.log('dumpPairsPatterns', ball, preArr1);

}
function dumpPairsPatterns(start, preArr, left, deep) {
	for (let nn = start; nn < start + 100; nn++) {
		if (datarows[nn].balls[0] >= left) {
			let smm = 0;
			for (let dd = 1; dd <= deep; dd++) {
				smm = smm + datarows[nn + dd].balls[0];
			}
			let avg = Math.round(smm / deep);
			if (nn == start) {
				//console.log('first average',smm/deep);
				let line = '';
				for (let kk = 0; kk < smm / deep; kk++) {
					line = line + '|';
				}
				console.log(line, smm / deep);
			} else {
				preArr[avg] = (preArr[avg]) ? preArr[avg] : [];
				preArr[avg][deep] = (preArr[avg][deep]) ? preArr[avg][deep] : 0;
				preArr[avg][deep]++;
			}
			//console.log(nn,datarows[nn]);
		}
	}

}
function randBalls(count: number): number[] {
	let test: number[] = [];
	for (let ii = 0; ii < count; ii++) {
		let ball = Math.floor(Math.random() * rowLen);
		if (test[ball]) {
			ii--;
		} else {
			test[ball] = 1;
		}
	}
	return test;
}
function chackRow(selection: number[], row: BallsRow): number {
	let foundcount = 0;
	for (let ii = 1; ii <= rowLen; ii++) {
		if (selection[ii]) {
			if (ballExists(ii, row)) {
				foundcount++;
			}
		}
	}
	return foundcount;
}
function checkAllRows(count: number) {
	let calcs: number[] = [];
	for (let ii = 1; ii < 5001; ii++) {
		let chk = randBalls(count);
		let cc = chackRow(chk, datarows[ii]);
		calcs[cc] = (calcs[cc]) ? calcs[cc] : 0;
		calcs[cc] = calcs[cc] + 2;
	}
	console.log(Math.floor(count), calcs);
}
*/
/*
function test4(){
	console.log('test4');
	//let high=10;
	//let low=7
	let cntx=0;
	let cless=0;
	let cmore=0;
	for(let ii=2;ii<datarows.length-99;ii++){
		let a0=datarows[ii+0].balls[0];
		let a1=datarows[ii+1].balls[0];
		let a2=datarows[ii+2].balls[0];
		let a3=datarows[ii+3].balls[0];
		if(a1<a2 && a2>a3 ){
			if(a0>=a1 && a0>1){
				console.log('+',a0,a1,a2,a3,':',ii);
				cmore++;
			}else{
				console.log('-',a0,a1,a2,a3,':',ii);
				cless++;
			}
			//console.log(ii);
			cntx++;
		}
	}
	console.log(cntx,cless,cmore,cmore/cntx);
}
*/
function yetAnotherStat() {
	let cnts: number[] = [];
	for (let ii = 1; ii < datarows.length; ii++) {
		let nn = datarows[ii].balls[0];
		if (!(cnts[nn])) cnts[nn] = 0;
		cnts[nn]++;
	}
	console.log('empty left', cnts);
	for (let ii = 0; ii < cnts.length; ii++) {
		console.log(ii, cnts[ii] / datarows.length);
	}
}
function anotherStat() {
	//let randProbe:number[]=[];
	let sz = 15;
	let ln = 4321;
	let sm0 = 0;
	let sm1 = 0;
	let sm2 = 0;
	let sm3 = 0;
	let sm4 = 0;
	let sm5 = 0;
	let sm6 = 0;
	for (let rn = 1; rn < ln; rn++) {
		//let rn=1+Math.floor(Math.random()*datarows.length-1);
		let hitCount = 0;
		for (let ii = 0; ii < sz; ii++) {
			let nxt = 1 + Math.floor(Math.random() * rowLen);
			//console.log(nxt);
			if (ballExists(nxt, datarows[rn])) {
				hitCount++;
			}
		}
		if (hitCount == 0) sm0++;
		if (hitCount == 1) sm1++;
		if (hitCount == 2) sm2++;
		if (hitCount == 3) sm3++;
		if (hitCount == 4) sm4++;
		if (hitCount == 5) sm5++;
		if (hitCount == 6) sm6++;
		//sm=sm+hitCount;
		//if(hitCount>ballsInRow)console.log(rn,':',hitCount);
	}
	console.log('random', sz, ln, '0-6:', sm0 / ln, sm1 / ln, sm2 / ln, sm3 / ln, sm4 / ln, sm5 / ln, sm6 / ln);
}
function testAbsDiff() {
	testDumpAbsDiff(1);
	testDumpAbsDiff(1001);
	testDumpAbsDiff(2001);
	testDumpAbsDiff(3001);
	testDumpAbsDiff(4001);
	/*testDumpAbsDiff(1, 2);
	testDumpAbsDiff(1, 3);
	testDumpAbsDiff(1, 4);
	let frstcnt: number[] = [];
	for (let ff = 1; ff < 5000; ff++) {
		let bl = datarows[ff].balls[0];
		frstcnt[bl] = frstcnt[bl] ? frstcnt[bl] : 0;
		frstcnt[bl]++;
	}
	console.log(frstcnt);*/
}
function testDumpAbsDiff(strt: number) {//}, maxpre: number) {//, mincur: number) {
	let count1 = 0;
	let preDiffX: number[] = [];
	let preDiffNo: number[] = [];
	for (let ff = strt; ff < strt + 1000; ff++) {

		//if (datarows[ff + 1].balls[0] >= maxpre) {
		let sz = 6;
		let smm = 0;
		for (let ii = ff + 1; ii < ff + 1 + sz; ii++) {
			smm = smm + Math.abs(datarows[ii].balls[0] - datarows[ii + 1].balls[0]);
		}
		let avg = Math.round(1 * smm / sz);
		//avg = datarows[ff].balls[0];
		preDiffX[avg] = preDiffX[avg] ? preDiffX[avg] : 0;
		preDiffNo[avg] = preDiffNo[avg] ? preDiffNo[avg] : 0;
		//if (datarows[ff].balls[0] >= mincur) {
		if (datarows[ff].balls[0] > 4) {
			count1++;
			preDiffX[avg]++;
		} else {
			preDiffNo[avg]++;
		}
		//}
		/*let frst = datarows[ff].balls[0];
		let sz = 9;
		let smm = 0;
		for (let ii = ff + 1; ii < ff + 1 + sz; ii++) {
			smm = smm + Math.abs(datarows[ii].balls[0] - datarows[ii + 1].balls[0]);
		}
		let avg = smm / sz;
		if (Math.round(avg) == 3) {
			let line = '';
			for (let ii = 0; ii < frst; ii++) {
				line = line + '◼';
			}
			console.log(line, frst, ff,avg);
		} else {
			//console.log(frst);
		}*/
	}
	console.log(count1, preDiffX, preDiffNo);
	let end = Math.max(preDiffX.length, preDiffNo.length);
	for (let ii = 0; ii < end; ii++) {
		console.log(ii, preDiffX[ii] / preDiffNo[ii], '' + preDiffX[ii] + '+' + preDiffNo[ii] + '=' + (preDiffX[ii] + preDiffNo[ii]));
	}
}
function test9() {
	let counts: number[] = [];
	for (let ii = 1; ii < datarows.length; ii++) {
		let nn = datarows[ii].balls[0];
		counts[nn] = counts[nn] ? counts[nn] : 0;
		counts[nn]++;
	}
	let last = 1;
	let limit = 5;
	let first = 6;

	let freq: number[] = [];
	let antifreq: number[] = [];
	let found = 0;
	for (let ii = 1; ii < datarows.length; ii++) {
		let lastBall = datarows[ii].balls[0];
		let cuarr=antifreq;
		if (lastBall == last) {
			 cuarr=freq;
		}
			let lenCount = 0;
			for (let kk = 1; ii + kk < datarows.length; kk++) {
				let cuball = datarows[ii + kk].balls[0];
				if (cuball > limit) {
					if (cuball > first) {
						cuarr[lenCount] = cuarr[lenCount] ? cuarr[lenCount] : 0;
						cuarr[lenCount]++;
						found++;
					}
					break;
				}
				lenCount++;
			}
		//}
	}

	console.log(freq);
	console.log(antifreq);
}
init();
addTails();

//dumpPairsCounts();
//let chk=randBalls(20);
//anotherStat();
//yetAnotherStat();
//testAbsDiff();
//test4();
/*
checkAllRows(rowLen * 1 / 4);
checkAllRows(rowLen * 1 / 2);
checkAllRows(rowLen * 3 / 4);
*/
/*
let row = datarows[Math.round(Math.random() * 5000 + 1)];
console.log(33, row);
for (let ii = 0; ii < 10; ii++) {
	console.log(chackRow(randBalls(33), row));
}
*/
test9();
console.log('start');






