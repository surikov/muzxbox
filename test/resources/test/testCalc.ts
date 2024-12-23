let skipRowsCount = 0;

var levelA: SVGElement;
var linesLevel: SVGElement;
var dataBalls: string[];
var datarows: BallsRow[];

let showFirstRow = true;

declare var dataName: string;
declare var rowLen: number;
declare var ballsInRow: number;

let sversion = 'v1.141 ' + dataName + ': ' + ballsInRow + '/' + rowLen;

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

let wideRange = false;

type StatBeginEnd = {
	row: number;
	left: number;
	right: number;
};
let greenStat: StatBeginEnd[] = [];
let blueStat: StatBeginEnd[] = [];
let greyStat: StatBeginEnd[] = [];
let redStat: StatBeginEnd[] = [];

let sortedBlue: number[] = [];
let sortedGreen: number[] = [];
let sortedGrey: number[] = [];
//let sortedRed: number[] = [];

let markLines: { fromX: number, fromY: number, toX: number, toY: number, color: string, manual: boolean }[] = [];//{ fromX: 5, fromY: 6, toX: 33, toY: 22 }];
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
	//console.log(dataBalls);
	datarows = readParseStat(dataBalls);
	//dumpStatLeftRed(datarows);
}
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
function clickFog(vnt) {
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
					let szz = cellSize / 5 - 0.5;
					let clr = '#ff0000ff';
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
		//one.summ=one.summ;+1/nn;
	}
	//console.log('calculateBallFrequency',rowNum,resu);
	return resu;
}
/*
function calculateEmptyColumnDuration(rowNum: number, rows: BallsRow[]): { ball: number, fills: { dx1: number, dx2: number }[], summ: number, logr: number }[] {
	let resu: { ball: number, fills: { dx1: number, dx2: number }[], summ: number, logr: number }[] = [];
	for (let nn = 0; nn < rowLen; nn++) {
		let one: { ball: number, fills: { dx1: number, dx2: number }[], summ: number, logr: number } = { ball: nn + 1, fills: [], summ: 0, logr: 0 };
		resu.push(one);
		for (var rr = rowNum + 1; rr < rowNum + 1 + calcLen; rr++) {
			if (ballExists(nn + 1, rows[rr])) {
				break;
			}
			one.summ++;
		}
		one.logr = one.summ;
	}
	return resu;
}*/
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
	//console.log(id, text);
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
		//console.log(ii + 1, fl, cc);
		//smm.push({ ball: ii + 1, sm: Math.round(cc/(ss+ss+1)), xst: fl ,sh:ss});
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

	/*for (let shift = -3; shift <= 3; shift++) {
		console.log(shift,':'
			,calcEmptyLineDuration(shift, 1, 1, inrows)
			, calcEmptyLineDuration(shift, 2, 1, inrows)
			, calcEmptyLineDuration(shift, 3, 1, inrows)
			, calcEmptyLineDuration(shift, 4, 1, inrows)
			, calcEmptyLineDuration(shift, 5, 1, inrows)
			, calcEmptyLineDuration(shift, 5, 1, inrows)
			, calcEmptyLineDuration(shift, 7, 1, inrows)
			, calcEmptyLineDuration(shift, 8, 1, inrows)
			, calcEmptyLineDuration(shift, 9, 1, inrows)
			, calcEmptyLineDuration(shift, 10, 1, inrows)
			);
	}*/
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
	greyStat = [];
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
		//if (rr % 2) markLines.push({ fromX: xxx, fromY: yyy, toX: xxx + rowLen / 2, toY: yyy, color: '#00000011', manual: false });
		if (showFirstRow || rr > 0) {
			let grey2 = '#33333333';
			markLines.push({ fromX: xxx, fromY: yyy, toX: xxx + begin2 / 2, toY: yyy, color: grey2, manual: false });
			markLines.push({ fromX: xxx + end2 / 2, fromY: yyy, toX: xxx + (rowLen - 1) / 2, toY: yyy, color: grey2, manual: false });
			let grey = '#333333ff';
			markLines.push({ fromX: xxx, fromY: yyy, toX: xxx + begin / 2, toY: yyy, color: grey, manual: false });
			markLines.push({ fromX: xxx + end / 2, fromY: yyy, toX: xxx + (rowLen - 1) / 2, toY: yyy, color: grey, manual: false });
			//console.log('grey');
			greyStat.push({ row: rr, left: begin, right: rowLen - end - 1 });
		}

		/*if (rr == 0) {
			for (let bb = 0; bb < rowLen; bb++) {
				let hh = (mx - min - (arr[bb].summ - min)) / hr;
				let fromY = Math.round((topShift) / cellSize) + skipRowsCount + 0 - prehh - 2;
				let toY = Math.round((topShift) / cellSize) + skipRowsCount - hh - 0 - 2;
				markLines.push({
					fromX: bb + shiftX - 1
					, fromY: fromY //skipRowsCount + 0 + prehh
					, toX: bb + shiftX
					, toY: toY //skipRowsCount + hh - 0
					, color: color, manual: false
				});
				markLines.push({
					fromX: bb + shiftX - 1 + rowLen
					, fromY: fromY //skipRowsCount + 0 + prehh
					, toX: bb + shiftX + rowLen
					, toY: toY //skipRowsCount + hh - 0
					, color: color, manual: false
				});
				prehh = hh;
			}
			//console.log(arr);
		}*/
	}
	//console.log('greyStat', greyStat);
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

		//console.log(min,center, middle, mx, sorted);

		for (let bb = 0; bb < rowLen; bb++) {
			ballFills[bb].summ = ballFills[bb].summ - center;
			let sig = ballFills[bb].summ > 0 ? 1 : -1;
			ballFills[bb].summ = sig * ballFills[bb].summ * ballFills[bb].summ;
		}

	}
}
function dumpRowFillsColor(rows: BallsRow[], color: string, shiftX: number) {
	let lbl = '';
	//console.log(lbl);
	greenStat = [];
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
			let green2 = '#00990033';
			markLines.push({ fromX: xxx, fromY: yyy, toX: xxx + begin2 / 2, toY: yyy, color: green2, manual: false });
			markLines.push({ fromX: xxx + end2 / 2, fromY: yyy, toX: xxx + (rowLen - 1) / 2, toY: yyy, color: green2, manual: false });
			let green = '#009900ff';
			markLines.push({ fromX: xxx, fromY: yyy, toX: xxx + begin / 2, toY: yyy, color: green, manual: false });
			markLines.push({ fromX: xxx + end / 2, fromY: yyy, toX: xxx + (rowLen - 1) / 2, toY: yyy, color: green, manual: false });
			//console.log(rr,'green',begin,(rowLen - end - 1));
			greenStat.push({ row: rr, left: begin, right: rowLen - end - 1 });
		}

		/*
				if (rr == 0) {
		
					for (let bb = 0; bb < rowLen; bb++) {
						let hh = (mx - min - (ballFills[bb].summ - min)) / hr;
						let fromY = Math.round((topShift) / cellSize) + skipRowsCount + 0 - prehh - 2;
						let toY = Math.round((topShift) / cellSize) + skipRowsCount - hh - 0 - 2;
						markLines.push({
							fromX: bb + shiftX - 1
							, fromY: fromY //skipRowsCount + 0 + prehh
							, toX: bb + shiftX
							, toY: toY //skipRowsCount + hh - 0
							, color: color, manual: false
						});
						markLines.push({
							fromX: bb + shiftX - 1 + rowLen
							, fromY: fromY //skipRowsCount + 0 + prehh
							, toX: bb + shiftX + rowLen
							, toY: toY //skipRowsCount + hh - 0
							, color: color, manual: false
						});
						prehh = hh;
					}
				}*/

	}
	//console.log('greenStat', greenStat);
}
function dumpTriads(svg: SVGElement, rows: BallsRow[]) {

	//console.log('blue');
	let ratioPre = 0.99;//0.99;
	//console.log('dumpTriads mode', highLightMode);
	blueStat = [];
	redStat = [];
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

		//console.log(first);

		if (rr == 0) {
			sortedBlue = [];
			for (let ff = 0; ff < first.length; ff++) {
				sortedBlue[ff] = first[ff].ball;
			}
		}
		//console.log(rr,highLightMode,first,sortedBlue);
		//lbl = 'blue';
		lbl = '';
		let begin = -1;
		let end = -1;
		let begin2 = -1;
		let end2 = -1;
		//let part1=true;
		for (let kk = 0; kk < first.length; kk++) {
			/*if(first[kk].summ>Math.floor(first[0].summ/2)){
				lbl = lbl + '_';
			}else{
				lbl = lbl + ' ';
			}*/
			if (ballExists(first[kk].ball, rows[rr])) {
				if (showFirstRow || rr > 0) {

					//lbl =  padLen( '[' + first[kk].ball+']',4)+lbl;
					lbl = '[' + pad0('' + first[kk].ball, 2) + ']' + lbl;
					end = kk;
					if (begin == -1) {
						begin = kk;
					}
				} else {
					//lbl = lbl + ' ' + first[kk].ball;
					//lbl =  padLen( ' '+first[kk].ball,4)+lbl;
					lbl = ' ' + pad0('' + first[kk].ball, 2) + ' ' + lbl;
				}
			} else {
				//lbl = lbl + ' ' + first[kk].ball;
				//lbl =  padLen( ' '+first[kk].ball,4)+lbl;
				lbl = ' ' + pad0('' + first[kk].ball, 2) + ' ' + lbl;
			}

		}
		for (let kk = 0; kk < first.length; kk++) {
			if (ballExists(first[kk].ball, rows[rr])) {
				if (showFirstRow || rr > 0) {
					if (kk < end) {
						end2 = kk;
					}
					if (begin2 == -1 && kk > begin) {
						begin2 = kk;
					}
				}
			}
		}
		//lbl = '' + begin + ':' + end + '(' + (rowLen - end - 1) + '): ' + lbl;
		lbl = padLen('' + padLen('' + (rowLen - end - 1), 2) + ':' + padLen('' + (rowLen - begin - 1), 2) + '(' + padLen('' + begin, 2) + '): blue ', 20) + lbl;
		if (rr == 0) {
			//let middle=(first[first.length-1].summ-first[0].summ)/2+first[0].summ;
			//console.log(lbl,first,middle);
			dumpInfo2('statblue', lbl);

		}
		/*let rowLab = '' + begin + ' -' + (rowLen - end - 1);
		addSmallText(svg, 2 * rowLen * cellSize + 2 + cellSize * 10
			, topShift + (1 + rr) * cellSize - 2
			, rowLab);*/
		let yyy = rowsVisibleCount + 22 + 0.66 * rr + skipRowsCount;
		let xxx = 0 * rowLen / 2;
		//if (rr % 2) markLines.push({ fromX: xxx, fromY: yyy, toX: xxx + rowLen / 2, toY: yyy, color: '#00000011', manual: false });

		if (showFirstRow || rr > 0) {
			let x2 = xxx + (rowLen - 1) / 2;
			let blue2 = '#3333ff33';
			markLines.push({ fromX: x2, fromY: yyy, toX: x2 - begin2 / 2, toY: yyy, color: blue2, manual: false });
			markLines.push({ fromX: xxx, fromY: yyy, toX: x2 - end2 / 2, toY: yyy, color: blue2, manual: false });
			//markLines.push({ fromX: xxx, fromY: yyy, toX: xxx + begin2 / 2, toY: yyy, color: blue2, manual: false });
			//markLines.push({ fromX: xxx + end2 / 2, fromY: yyy, toX: xxx + (rowLen - 1) / 2, toY: yyy, color: blue2, manual: false });
			let blue = '#3333ffff';
			markLines.push({ fromX: x2, fromY: yyy, toX: x2 - begin / 2, toY: yyy, color: blue, manual: false });
			markLines.push({ fromX: xxx, fromY: yyy, toX: x2 - end / 2, toY: yyy, color: blue, manual: false });
			//markLines.push({ fromX: xxx, fromY: yyy, toX: xxx + begin / 2, toY: yyy, color: blue, manual: false });
			//markLines.push({ fromX: xxx + end / 2, fromY: yyy, toX: xxx + (rowLen - 1) / 2, toY: yyy, color: blue, manual: false });
			blueStat.push({ row: rr, left: begin, right: rowLen - end - 1 });
		}
		if (showFirstRow || rr > 0) {
			begin = rowLen + 1;
			end = 0;
			let begin2 = rowLen + 1;
			let end2 = 0;
			for (let kk = 0; kk < rows[rr].balls.length; kk++) {
				if (rows[rr].balls[kk] < begin) begin = rows[rr].balls[kk];
				if (rows[rr].balls[kk] > end) end = rows[rr].balls[kk];
			}
			for (let kk = 0; kk < rows[rr].balls.length; kk++) {
				if (rows[rr].balls[kk] < begin2 && rows[rr].balls[kk] > begin) begin2 = rows[rr].balls[kk];
				if (rows[rr].balls[kk] > end2 && rows[rr].balls[kk] < end) end2 = rows[rr].balls[kk];
			}
			begin--;
			end--;
			begin2--;
			end2--;
			yyy = rowsVisibleCount + 22 + 0.66 * rr + skipRowsCount;
			xxx = 3 * rowLen / 2;
			let red = '#ff3333ff';
			let red2 = '#ff333333';
			//if (rr % 2) markLines.push({ fromX: xxx, fromY: yyy, toX: xxx + rowLen / 2, toY: yyy, color: '#00000011', manual: false });
			markLines.push({ fromX: xxx, fromY: yyy, toX: xxx + begin2 / 2, toY: yyy, color: red2, manual: false });
			markLines.push({ fromX: xxx + end2 / 2, fromY: yyy, toX: xxx + (rowLen - 1) / 2, toY: yyy, color: red2, manual: false });
			markLines.push({ fromX: xxx, fromY: yyy, toX: xxx + begin / 2, toY: yyy, color: red, manual: false });
			markLines.push({ fromX: xxx + end / 2, fromY: yyy, toX: xxx + (rowLen - 1) / 2, toY: yyy, color: red, manual: false });
			//console.log('red');
			redStat.push({ row: rr, left: begin, right: rowLen - end - 1 });
		}




		for (let ii = 0; ii < rowLen; ii++) {
			let idx = ratioPre * (calcs[ii].summ - minCnt) / df;
			let color = 'rgba(0,0,255,' + idx + ')';
			//console.log(idx,color);
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
		/*if ( rr == 0) {
			
			let min=999999;
			let mx=-9999;

			for (let ii = 0; ii < rowLen; ii++) {
				if(mx<calcs[ii].summ)mx=calcs[ii].summ;
				if(min>calcs[ii].summ)min=calcs[ii].summ;
			}
			//console.log(min,mx,calcs);
			let blue = '#0000ff33';
			let preVal=calcs[calcs.length-1].summ;
			for (let ii = 0; ii < rowLen; ii++) {
				let nextVal=calcs[ii].summ;
				markLines.push({ fromX: ii-1, fromY: 21*(preVal-min)/(mx-min+2)+ skipRowsCount
									, toX: ii, toY: 21*(nextVal-min)/(mx-min+2)+ skipRowsCount
								, color: blue, manual: false });
				markLines.push({ fromX: ii-1+rowLen, fromY: 21*(preVal-min)/(mx-min+2)+ skipRowsCount
									, toX: ii+rowLen, toY: 21*(nextVal-min)/(mx-min+2)+ skipRowsCount
								, color: blue, manual: false });
				preVal=nextVal;
			}
		}*/
	}
	//console.log('blueStat', blueStat);
	//console.log('redStat', redStat);
	//dumpColorStat();
	//dumpStat3();

}
/*
function dumpAvgFromAvg(){
	//console.log('dumpAvgFromAvg', blueStat);
	let data:StatBeginEnd[]=blueStat;
	let calcDeep=4;
	let preAvg=0;
	let preHp=0;
	for(let ii=0;ii<data.length-calcDeep;ii++){
		let smm=0;
		for(let kk=0;kk<calcDeep;kk++){
			smm=smm+data[ii+kk].right;
		}
		let avg=smm/calcDeep;
		let dff=0;
		for(let kk=0;kk<calcDeep;kk++){
			dff=dff+Math.abs(data[ii+kk].right-avg);
		}
		let hp=dff/calcDeep;
		//console.log(data[ii].row,Math.round(avg),Math.round(hp));
		//let top=rowsVisibleCount*cellSize+topShift+cellSize*1.5;
		let top = rowsVisibleCount + 22 + 0.66 * data[ii].row -0.66/2;
		//composeLine(linesLevel, avg*10,top*cellSize, hp*10,top*cellSize, 4, '#ff00ccff');
		if(ii>0){
			let res=Math.abs(hp-avg)+0.66/2;
			//if(!(res))res=hp;
			let preRes=Math.abs(preHp-preAvg)+0.66/2;
			//if(!(preRes))preRes=preHp;
			//composeLine(linesLevel, avg*10,top*cellSize, preAvg*10,(top - 0.66)*cellSize, 1, '#660000ff');
			composeLine(linesLevel, res*11,top*cellSize, preRes*11,(top - 0.66)*cellSize, 3, '#ff66ccff');
		}
		preAvg=avg;
		preHp=hp;
	}
}
*/
function roundDown(num: number, base: number): number {
	return Math.floor(num / base) * base;
}
/*
function dumpColorStat() {
	//console.log('dumpColorStat');
	//console.log('sortedBlue', sortedBlue);
	let skip = 1;
	if (showFirstRow) {
		skip = 0;
	}
	let blueleft=0;
	let blueright=0;
	let greenleft=0;
	let greenright=0;
	let silverleft=0;
	let silverright=0;
	let redleft=0;
	let redright=0;
	let rowcount=0;
	for (let kk = 0; kk < redStat.length; kk++) {
		if(kk>=1-skip &&kk<1-skip+rowsVisibleCount-2  ){
			blueright=blueright+blueStat[kk].left;
			blueleft=blueleft+blueStat[kk].right;
			
			greenleft=greenleft+greenStat[kk].left;
			greenright=greenright+greenStat[kk].right;
			
			silverleft=silverleft+greyStat[kk].left;
			silverright=silverright+greyStat[kk].right;
			
			redleft=redleft+redStat[kk].left;
			redright=redright+redStat[kk].right;
			
			rowcount++;
		}
		let sum = 0;
		//if (showFirstRow || kk > 0) {
		sum = redStat[kk].left + redStat[kk].right
			+ blueStat[kk].left + blueStat[kk].right
			+ greyStat[kk].left + greyStat[kk].right
			+ greenStat[kk].left + greenStat[kk].right;
		//}
		addSmallText(levelA
			, 2 * rowLen * cellSize + cellSize * 0.5
			, cellSize * (rowsVisibleCount + 22.8 + 0.66 * (skip + kk) + 0)
			, '' + (skip + kk) + ': ' + sum);
		let purple = '#ff33ffff';
		let xxx = 2 * rowLen + 2.5;
		markLines.push({
			fromX: xxx
			, fromY: rowsVisibleCount + 22.8 + 0.66 * (skip + kk) + skipRowsCount - 0.8
			, toX: xxx + sum / 3
			, toY: rowsVisibleCount + 22.8 + 0.66 * (skip + kk) + skipRowsCount - 0.8
			, color: purple
			, manual: false
		});
	
	}

	var msgp: HTMLElement = (document.getElementById('statdump') as any) as HTMLElement;
	msgp.innerText = '%blue: '+Math.round(10*blueleft/rowcount)+'/'+Math.round(10*blueright/rowcount)
				+', %green: '+Math.round(10*greenleft/rowcount)+'/'+Math.round(10*greenright/rowcount)
				+', %silver: '+Math.round(10*silverleft/rowcount)+'/'+Math.round(10*silverright/rowcount)
				+', %red: '+Math.round(10*redleft/rowcount)+'/'+Math.round(10*redright/rowcount)
				;
	//console.log('skip',skip,'blue',blueleft,blueright,'green',greenleft,greenright,'silver',silverleft,silverright,'red',redleft,redright);
	//console.log('dumpColorStat');//,'blue',blueStat,'green',greenStat,'silver',greyStat,'red',redStat);
	
	
	
	let delt=5;
	
	let sle:number[]=[];
	for(let barlen=0;barlen<44;barlen=barlen+delt){
		for(let ii=0;ii<blueStat.length;ii++){
			if(Math.floor(blueStat[ii].right/delt)*delt==barlen){
				sle[barlen]=sle[barlen]?sle[barlen]:0;
				sle[barlen]++;
			}
		}
	}
	let sri:number[]=[];
	for(let barlen=0;barlen<44;barlen=barlen+delt){
		for(let ii=0;ii<blueStat.length;ii++){
			if(Math.floor(blueStat[ii].left/delt)*delt==barlen){
				sri[barlen]=sri[barlen]?sri[barlen]:0;
				sri[barlen]++;
			}
		}
	}
	console.log('blue',sle,sri);
	
	sle=[];
	for(let barlen=0;barlen<44;barlen=barlen+delt){
		for(let ii=0;ii<greenStat.length;ii++){
			if(Math.floor(greenStat[ii].left/delt)*delt==barlen){
				sle[barlen]=sle[barlen]?sle[barlen]:0;
				sle[barlen]++;
			}
		}
	}
	sri=[];
	for(let barlen=0;barlen<44;barlen=barlen+delt){
		for(let ii=0;ii<greenStat.length;ii++){
			if(Math.floor(greenStat[ii].right/delt)*delt==barlen){
				sri[barlen]=sri[barlen]?sri[barlen]:0;
				sri[barlen]++;
			}
		}
	}
	console.log('green',sle,sri);
	
	sle=[];
	for(let barlen=0;barlen<44;barlen=barlen+delt){
		for(let ii=0;ii<greyStat.length;ii++){
			if(Math.floor(greyStat[ii].left/delt)*delt==barlen){
				sle[barlen]=sle[barlen]?sle[barlen]:0;
				sle[barlen]++;
			}
		}
	}
	sri=[];
	for(let barlen=0;barlen<44;barlen=barlen+delt){
		for(let ii=0;ii<greyStat.length;ii++){
			if(Math.floor(greyStat[ii].right/delt)*delt==barlen){
				sri[barlen]=sri[barlen]?sri[barlen]:0;
				sri[barlen]++;
			}
		}
	}
	console.log('silver',sle,sri);
	
	
	//dumpGroupStat();
}
*/
/*
function dumpGroupStat(){

	let cntEx=0;
	let cntNot=0;
	for (let kk = 0; kk < redStat.length-5; kk++) {
		let r0=redStat[kk+0].left;
		let r1=redStat[kk+1].left;
		let r2=redStat[kk+2].left;
		let r3=redStat[kk+3].left;
		let r4=redStat[kk+4].left;
		if(r1<5 && r2>6 && r3<5){
			console.log(kk,':',r0,r1,r2,r3);
			if(r0>6 ){
				cntEx++;
			}else{
				cntNot++;
			}
		}
	}
	console.log('dumpGroupStat',cntEx,'/'+(cntEx+cntNot));
}*/
function fillCells() {
	clearSVGgroup(levelA);
	let slicedrows: BallsRow[] = sliceRows(datarows, skipRowsCount, skipRowsCount + rowsSliceCount + calcLen);
	dumpTriads(levelA, slicedrows);
	dumpInfo(skipRowsCount);

	drawStat3(levelA, slicedrows);


	//drawLines();
	//countInfo(slicedrows);

	var msgp: HTMLElement = (document.getElementById('stepsize') as any) as HTMLElement;
	msgp.innerText = '' + reduceRatio;
	//msgp = (document.getElementById('calcLen') as any) as HTMLElement;
	//msgp.innerText = '' + calcLen;
	msgp = (document.getElementById('calcWide') as any) as HTMLElement;
	msgp.innerText = '' + diffWide;

}
function clickHop() {
	skipRowsCount = Math.round(Math.random() * (datarows.length - reduceRatio * rowsVisibleCount));
	addTails();
}
function toggleFirst() {
	showFirstRow = !showFirstRow;
	//fillCells();
	addTails();
}
function toggleWide() {
	wideRange = !wideRange;
	//fillCells();
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
	//console.log(rez,add);
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
	dumpRowFills(slicedrows);
	fillCells();

	let mxdata: { ball: number, mx: number }[] = [];
	let mindata: { ball: number, min: number ,exists?:boolean,diff:number}[] = [];
	for (let ii = 0; ii < rowLen; ii++) {
		let blue = rowLen - sortedBlue.indexOf(ii + 1) - 1;
		let green = sortedGreen.indexOf(ii + 1);
		let black = sortedGrey.indexOf(ii + 1);
		let blueGreenDiff = Math.abs(blue - green);
		let greenBlackDiff = Math.abs(green - black);
		let blackBlueDiff = Math.abs(black - blue);
		let mx = Math.max(blueGreenDiff, greenBlackDiff, blackBlueDiff);
		mxdata.push({ ball: ii + 1, mx: mx});
		//let avg=Math.round((blue+green+black)/3);
		let min = Math.min(blueGreenDiff, greenBlackDiff, blackBlueDiff);
		mindata.push({ ball: ii + 1, min: min ,diff:0 });
		//if(showFirstRow){
			//console.log(mindata[0].ball, slicedrows[0]);
			if(ballExists(mindata[mindata.length-1].ball, slicedrows[0])){
				mindata[mindata.length-1].exists=true;
			}
		//}
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
				//lbl = lbl + padLen('[' + mxdata[kk].ball+']',4);
				lbl = lbl + '[' + pad0('' + mxdata[kk].ball, 2) + ']';
				end = kk;
				if (begin == -1) {
					begin = kk;
				}
			} else {
				//lbl = lbl + padLen( ' '+mxdata[kk].ball,4);
				lbl = lbl + ' ' + pad0('' + mxdata[kk].ball, 2) + ' ';
			}
		} else {
			//lbl = lbl +padLen( ' '+mxdata[kk].ball,4);
			lbl = lbl + ' ' + pad0('' + mxdata[kk].ball, 2) + ' ';
		}
	}
	dumpInfo2('statpurple', padLen('' + padLen('' + (0 + begin), 2) + ':' + padLen('' + end, 2) + '(' + padLen('' + (rowLen - end - 1), 2) + '): mx:', 20) + lbl);

	lbl = '';
	mindata.sort((a: { ball: number, min: number }, b: { ball: number, min: number }) => {
		return a.min - b.min;
	});
	begin = -1;
	end = -1;
	for (let kk = 0; kk < mindata.length; kk++) {
		if (ballExists(mindata[kk].ball, slicedrows[0])) {
			if (showFirstRow) {
				//lbl = lbl + padLen('[' + mindata[kk].ball+']',4);
				lbl = lbl + '[' + pad0('' + mindata[kk].ball, 2) + ']';
				end = kk;
				if (begin == -1) {
					begin = kk;
				}
			} else {
				//lbl = lbl + padLen( ' '+mindata[kk].ball,4);
				lbl = lbl + ' ' + pad0('' + mindata[kk].ball, 2) + ' ';
			}
		} else {
			//lbl = lbl +padLen( ' '+mindata[kk].ball,4);
			lbl = lbl + ' ' + pad0('' + mindata[kk].ball, 2) + ' ';
		}
	}
	//dumpInfo2('statred', padLen(''+(0+begin)+':'+end+'('+(rowLen-end-1)+'): min:',20)+lbl);
	dumpInfo2('statred', padLen('' + padLen('' + (0 + begin), 2) + ':' + padLen('' + end, 2) + '(' + padLen('' + (rowLen - end - 1), 2) + '): min:', 20) + lbl);

	
	let minDist = 99;
	let summDist = 0;
	let maxDist = -1;
	let purpleiff = padLen('', 21);
	for (let kk = 0; kk < mxdata.length; kk++) {
		let dist = 0;
		for (let xx = 0; xx < mindata.length; xx++) {
			//console.log(mindata[xx].ball,mxdata[kk].ball);
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
			//console.log(mindata[xx].ball,mxdata[kk].ball);
			if (mxdata[xx].ball == mindata[kk].ball) {
				dist = xx - kk;
				break;
			}
		}
		rediff = rediff + padLen((dist > 0 ? '+' : '') + dist, 4);
		mindata[kk].diff=dist;
	}
	var span: HTMLElement = (document.getElementById('infopurple') as any) as HTMLElement;
	span.innerText = purpleiff;
	span = (document.getElementById('infored') as any) as HTMLElement;
	span.innerText = rediff;
	
	mindata.sort((a: {diff: number }, b: { diff: number }) => {
		//console.log(a,b,Math.abs(Math.abs(a.diff) - Math.abs(b.diff)));
		return Math.abs(a.diff) - Math.abs(b.diff);
	});
	console.log('mindata',mindata);

	//console.log(avgdata);
	//for(let ii=0;ii<mindata.length;ii++){
	//	console.log(ii,mindata[ii],mxdata[ii]);
	//}
	//console.log(sortedBlue);
	resetNumbs();
	/*
	dumpStat123('blue',blueStat);
	dumpStat123('green',greenStat);
	dumpStat123('grey',greyStat);
	dumpStat123('red',redStat);
	*/
	//dumpAvgFromAvg();
	//dumpPairsPatterns();
}

function dumpStat123(label: string, stat: StatBeginEnd[]) {
	let absLeft = 0;
	let absRight = 0;
	for (let kk = 1; kk < stat.length - 1; kk++) {
		absLeft = absLeft + Math.abs(stat[kk + 0].right - stat[kk + 1].right);
	}
	for (let kk = 1; kk < stat.length - 1; kk++) {
		absRight = absRight + Math.abs(stat[kk + 0].left - stat[kk + 1].left);
	}
	console.log(label, absLeft / stat.length, absRight / stat.length);
}

/*
function drawTestLinesRight(data: { ball: number, color: string }[]) {
	let bas=19;
	//for (let ii = 0; ii < data.length; ii++) {
	for (let ii = data.length-1; ii >= 0; ii--) {
		markLines.push({
			fromX: data[ii].ball - 1
			, fromY: skipRowsCount + 0.75*(bas/data.length*ii)
			, toX: data[ii].ball - 1
			, toY: skipRowsCount + bas
			, color: data[ii].color, manual: true
		});
	}

}
function drawTestLinesLeft(data: { ball: number, color: string }[]) {
	let bas=19;
	//for (let ii = 0; ii < data.length; ii++) {
	for (let ii = data.length-1; ii >= 0; ii--) {
		markLines.push({
			fromX: data[ii].ball - 1
			, fromY: skipRowsCount + 0.75*(bas/data.length*ii)
			, toX: data[ii].ball - 1
			, toY: skipRowsCount + bas
			, color: data[ii].color, manual: true
		});
	}

}
*/
function addTestLines1(data: { ball: number, color: string }[]) {
	let bas = 19;
	for (let ii = 0; ii < data.length; ii++) {
		//for (let ii = data.length-1; ii >= 0; ii--) {
		markLines.push({
			fromX: data[ii].ball - 1
			, fromY: skipRowsCount + 0.85 * (bas / data.length * ii)
			, toX: data[ii].ball - 1
			, toY: skipRowsCount + bas
			, color: data[ii].color, manual: true
		});
	}
}
function addTestLines2(data: { ball: number, color: string }[]) {
	let bas = 19;
	for (let ii = 0; ii < data.length; ii++) {
		//for (let ii = data.length-1; ii >= 0; ii--) {
		markLines.push({
			fromX: data[ii].ball - 1
			, fromY: skipRowsCount + 0.85 * (bas - bas / data.length * ii)
			, toX: data[ii].ball - 1
			, toY: skipRowsCount + bas
			, color: data[ii].color, manual: true
		});
	}
}

function testTest() {
	let yyy = rowsVisibleCount + 22 + skipRowsCount - 1;
	console.log('TESTtEST', sortedBlue, sortedGreen, sortedGrey);
	let rightBlue = Math.ceil(0 * rowLen / 2);
	let leftBlue = Math.ceil(1 * rowLen / 2) - 1;
	//let leftBlue = Math.ceil(0 * rowLen / 2);
	//let rightBlue = Math.ceil(1 * rowLen / 2) - 1;
	let leftGreen = Math.ceil(1 * rowLen / 2);
	let rightGreen = Math.ceil(2 * rowLen / 2) - 1;
	let leftGrey = Math.ceil(2 * rowLen / 2);
	let rightGrey = Math.ceil(3 * rowLen / 2) - 1;
	let leftRed = Math.ceil(3 * rowLen / 2);
	let rightRed = Math.ceil(4 * rowLen / 2) - 1;
	//console.log(leftBlue, rightBlue, leftGreen, rightGreen, leftGrey, rightGrey, leftRed, rightRed);
	for (let mm = 0; mm < markLines.length; mm++) {
		let line = markLines[mm];
		if (line.fromY == yyy && line.toY == yyy) {
			if (line.fromX == leftBlue || line.toX == leftBlue) {
				let nn = 2 * Math.abs(line.fromX - line.toX);
				let orders: number[] = sortedBlue.slice(0, nn);
				let data: { ball: number, color: string }[] = [];
				for (let bb = 0; bb < orders.length; bb++) {
					data.push({ ball: orders[bb] + 0.1, color: '#0000ff99' });
				}
				console.log('rightBlue', nn, data);
				addTestLines1(data);

			}
			if (line.fromX == rightBlue || line.toX == rightBlue) {
				let nn = 2 * Math.abs(line.fromX - line.toX);
				//let data = sortedBlue.slice(sortedBlue.length - nn);
				let orders: number[] = sortedBlue.slice(sortedBlue.length - nn);
				let data: { ball: number, color: string }[] = [];
				for (let bb = 0; bb < orders.length; bb++) {
					data.push({ ball: orders[bb] + 0.1, color: '#0000ff99' });
				}
				console.log('leftBlue', nn, data);
				addTestLines2(data);
			}
			if (line.fromX == leftGreen || line.toX == leftGreen) {
				let nn = 2 * Math.abs(line.fromX - line.toX);
				//let data = sortedGreen.slice(0, nn);
				let orders: number[] = sortedGreen.slice(0, nn);
				let data: { ball: number, color: string }[] = [];
				for (let bb = 0; bb < orders.length; bb++) {
					data.push({ ball: orders[bb] - 0.1, color: '#00990099' });
				}
				console.log('leftGreen', nn, data);
				addTestLines1(data);
			}
			if (line.fromX == rightGreen || line.toX == rightGreen) {
				let nn = 2 * Math.abs(line.fromX - line.toX);
				//let data = sortedGreen.slice(sortedGreen.length - nn);
				let orders: number[] = sortedGreen.slice(sortedGreen.length - nn);
				let data: { ball: number, color: string }[] = [];
				for (let bb = 0; bb < orders.length; bb++) {
					data.push({ ball: orders[bb] - 0.1, color: '#00990099' });
				}
				console.log('rightGreen', nn, data);
				addTestLines2(data);
			}
			if (line.fromX == leftGrey || line.toX == leftGrey) {
				let nn = 2 * Math.abs(line.fromX - line.toX);
				//let data = sortedGrey.slice(0, nn);
				let orders: number[] = sortedGrey.slice(0, nn);
				let data: { ball: number, color: string }[] = [];
				for (let bb = 0; bb < orders.length; bb++) {
					data.push({ ball: orders[bb] - 0.2, color: '#66666699' });
				}
				console.log('leftGrey', nn, data);
				addTestLines1(data);
			}
			if (line.fromX == rightGrey || line.toX == rightGrey) {
				let nn = 2 * Math.abs(line.fromX - line.toX);
				//let data = sortedGrey.slice(sortedGrey.length - nn);
				let orders: number[] = sortedGrey.slice(sortedGrey.length - nn);
				let data: { ball: number, color: string }[] = [];
				for (let bb = 0; bb < orders.length; bb++) {
					data.push({ ball: orders[bb] - 0.2, color: '#66666699' });
				}
				console.log('rightGrey', nn, data);
				addTestLines2(data);
			}

			if (line.fromX == leftRed || line.toX == leftRed) {
				let nn = 2 * Math.abs(line.fromX - line.toX);
				let data: { ball: number, color: string }[] = [];
				for (let rr = 0; rr < nn; rr++) {
					let kk: number = rr;
					data.push({ ball: 1 + kk, color: '#ff000099' });
				}
				console.log('leftRed', nn, data);
				addTestLines1(data);
			}
			if (line.fromX == rightRed || line.toX == rightRed) {
				let nn = 2 * Math.abs(line.fromX - line.toX);
				let data: { ball: number, color: string }[] = [];
				for (let rr = 0; rr < nn; rr++) {
					let kk: number = rowLen - rr - 1;
					data.push({ ball: 1 + kk, color: '#ff000099' });
				}
				console.log('rightRed', nn, data);
				addTestLines1(data);
			}


		}
	}
	drawLines();
}

/*
function dumpLeftStat(){
	console.log('dumpLeftStat',datarows);
	let ss:number[]=[];
	for(let ii=1;ii<datarows.length;ii++){
		let kk=datarows[ii].balls[0];
		if(!(ss[kk]))ss[kk]=0;
		ss[kk]++;
	}
	let itg=0;
	for(let ii=1;ii<ss.length;ii++){
		let procnt=Math.round(1000*ss[ii]/datarows.length)/10;
		itg=itg+procnt;
		console.log(ii,procnt,itg);
	}
*/
/*
let sngl=0;
let grp=0;
for(let ii=1;ii<datarows.length-5;ii++){
	let kk=datarows[ii].balls[0];
	if(kk>20){
		if(datarows[ii+1].balls[0]<8){
			sngl++;
		}else{
			grp++;
		}
	}
}
console.log('single',sngl,'group',grp);
*/

//}
/*
function dumpPatternStat(){
	console.log('dumpPatternStat');
	let exists=0;
	let no=0;
	for(let ii=1;ii<20;ii++){
		let bn= 
			datarows[ii].balls[0]*Math.pow(45,1)
			+datarows[ii].balls[1]*Math.pow(45,2)
			+datarows[ii].balls[2]*Math.pow(45,3)
			+datarows[ii].balls[3]*Math.pow(45,4)
			+datarows[ii].balls[4]*Math.pow(45,5)
			+datarows[ii].balls[5]*Math.pow(45,6)
		;
		console.log(ii,Math.round(bn/Math.pow(45,6)),datarows[ii].balls);
	}
	
}
function dumpStat5(){
	dumpLeftStat();
	dumpPatternStat();
	console.log(45*45*45*45*45*45); 
}
*/
/*
function countHoles(datarows:BallsRow[],longe:number){
	let avg=0;
	for(let rr=1;rr<datarows.length;rr++){
		let row:BallsRow=datarows[rr];
		//console.log(row);
		let rowCount=0;
		for(let bb=1;bb<=rowLen;bb++){
			//console.log(bb);
			let hole=true;
			for(let kk=0;kk<longe;kk++){
				//console.log(kk);
				if(ballExists(bb+kk,row)){//console.log('exists',bb+kk);
					hole=false;
					break;
				}//else console.log('not exists',bb+kk);
			}
			if(hole){
				rowCount++;
			}
		}
		avg=avg+rowCount/rowLen;
	}
	console.log('empty duration more or equal',longe,'average count',avg/(datarows.length-1));
}

function dumpHoleStat(){
	let dataBalls = window[dataName];
	let datarows:BallsRow[]  = readParseStat(dataBalls);
	console.log(datarows);
	console.log('countHoles');
	countHoles(datarows,1);
	countHoles(datarows,2);
	countHoles(datarows,3);
	countHoles(datarows,4);
	countHoles(datarows,5);
	countHoles(datarows,6);
	countHoles(datarows,7);
	countHoles(datarows,8);
	countHoles(datarows,9);
	countHoles(datarows,10);
	countHoles(datarows,11);
	countHoles(datarows,12);
	countHoles(datarows,13);
	countHoles(datarows,14);
	countHoles(datarows,15);
	countHoles(datarows,16);
	countHoles(datarows,17);
	countHoles(datarows,18);
	countHoles(datarows,19);
	countHoles(datarows,20);
	countHoles(datarows,21);
	countHoles(datarows,22);
	countHoles(datarows,23);
}
*/
/*
function dumpHill(target:number,lft:number,mid:number,rt:number){
	let moreequal=0;
	let less=0;
	for (let ii = 1; ii < datarows.length - 4; ii++) {
		let cur=datarows[ii+0].balls[0];
		let p1=datarows[ii+1].balls[0];
		let p2=datarows[ii+2].balls[0];
		let p3=datarows[ii+3].balls[0];
		let p4=datarows[ii+4].balls[0];
		if((p1<=lft && p2>=mid && p3<=rt)||(p1<=lft && p2>=mid && p3>=mid && p4<=rt)){
			if(cur>=target){
				moreequal++;
			}else{
				less++;
			}
			//console.log(cur,':',p1,p2,p3);
		}
	}
	console.log(target,':',lft,mid,rt,'=', moreequal,less, moreequal/less);
}
function dumpStat3() {
	console.log('dumpStat3', datarows);
	let counts: number[] = [];
	for (let ii = 1; ii < datarows.length - 3; ii++) {
		let idx = datarows[ii].balls[0];
		counts[idx] = (counts[idx]) ? counts[idx] : 0;
		counts[idx]++;
	}
	//console.log('counts', counts);
	for(let ii=0;ii<counts.length;ii++){
		console.log(ii,counts[ii],counts[ii]/datarows.length);
	}
	for(let kk=1;kk<10;kk++){
		dumpHill(kk,6,11,6);
	}
	
}
*/
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
function dumpPairsPatterns() {
	console.log('dumpPairsPatterns', datarows);//,skipRowsCount,redStat);
	let calcLen = 7;

	for (let lop = 1; lop < 5000; lop++) {
		//console.log('---',lop,datarows[lop].balls);
		for (let kk = 1; kk < datarows.length - calcLen; kk++) {
			if (lop != kk) {
				let smm = 0;
				for (let ii = 0; ii < calcLen; ii++) {
					let a = datarows[ii + lop].balls[0];
					let b = datarows[ii + kk].balls[0];
					let dp = diffPart(a, b);
					//console.log(ii,':',a,b,'=',dp);
					smm = smm + dp;
				}
				if (smm / calcLen < 1.25) {
					console.log(lop, datarows[lop - 1].balls[0], datarows[kk - 1].balls[0], ':', kk, smm / calcLen);
				}
			}
		}
	}
}
init();
addTails();
//dumpStat22();
//dumpStat3();
//dumpHoleStat();
//dumpPairsPatterns();
console.log('start');






