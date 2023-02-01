let skipRowsCount = 0;

var levelA: SVGElement;
var linesLevel: SVGElement;
var dataBalls: string[];
var datarows: BallsRow[];

let showFirstRow = false;

declare var dataName: string;
declare var rowLen: number;
declare var ballsInRow: number;

let sversion = 'v1.48 ' + dataName + ': ' + ballsInRow + '/' + rowLen;

let markX = -1;
let markY = -1;
let cellSize = 12;
let topShift = cellSize * 11;
let rowsVisibleCount = 66;
let rowsAvgCount = 5;
let rowsSliceCount = rowsVisibleCount + rowsAvgCount;
let reduceRatio = 1;
let highLightMode = 1;
var calcLen = 9;
let markLines: { fromX: number, fromY: number, toX: number, toY: number }[] = [];//{ fromX: 5, fromY: 6, toX: 33, toY: 22 }];
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
	addLine(svg, x1, y1, x2, y2, strokeWidth / 2, color);
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
	console.log(dataBalls);
	datarows = readParseStat(dataBalls);
	console.log(datarows);
}
function clickClearLines() {
	markLines = [];
	drawLines();
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
			fromX: xx, fromY: yy, toX: markX, toY: markY
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
	for (let i = 0; i < markLines.length; i++) {
		composeLine(linesLevel
			, markLines[i].fromX * cellSize + 0.5 * cellSize
			, (markLines[i].fromY - skipRowsCount) * cellSize + 0.5 * cellSize
			, markLines[i].toX * cellSize + 0.5 * cellSize
			, (markLines[i].toY - skipRowsCount) * cellSize + 0.5 * cellSize
			, cellSize / 0.99, '#00ff0066');
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
					if (rowNum > 0 || showFirstRow) {
						addCircle(svg
							, colNum * cellSize - 0.5 * cellSize + 0 * rowLen * cellSize
							, topShift + 0.5 * cellSize + rowNum * cellSize
							, cellSize / 5 - 0.5, '#ff0000ff', '#ff0000ff');
					}
					if (rowNum > 0 || showFirstRow) {
						addCircle(svg
							, colNum * cellSize - 0.5 * cellSize + 1 * rowLen * cellSize
							, topShift + 0.5 * cellSize + rowNum * cellSize
							, cellSize / 5 - 0.5, '#ff0000ff', '#ff0000ff');
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
function calcRowFills(rowNum: number, rows: BallsRow[], counts: number[]): { ball: number, fills: { dx1: number, dx2: number }[], summ: number, logr: number }[] {
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
		one.logr = one.summ ;
	}
	return resu;
}
function calcRowPreFreqs(rowNum: number, rows: BallsRow[]): { ball: number, fills: { dx1: number, dx2: number }[], summ: number, logr: number }[] {
	let w0 = 0;
	let w1 = 100;
	let w2 = 75;
	let w3 = 50;
	let w4 = 30;
	let w5 = 10;
	let sums = [
		w4, w3, w2, w1, w1, w1, w2, w3, w4//
		, w5, w4, w3, w2, w1, w2, w3, w4, w5//
		, w5, w4, w4, w3, w3, w3, w4, w4, w5//
		, w0, w5, w4, w4, w4, w4, w4, w5, w0//
		, w0, w0, w5, w5, w5, w5, w5, w0, w0//
	];
	let resu: { ball: number, fills: { dx1: number, dx2: number }[], summ: number, logr: number }[] = [];
	for (let nn = 0; nn < rowLen; nn++) {
		let one: { ball: number, fills: { dx1: number, dx2: number }[], summ: number, logr: number } = { ball: nn + 1, fills: [], summ: 0, logr: 0 };
		resu.push(one);
		if (rows.length > rowNum + 1 + calcLen) {
			for (let ax = -4; ax <= 4; ax++) {
				for (let ay = 0; ay < 5; ay++) {
					let rr = sums[ax + 4 + 9 * ay];
					if (ballExists(nn + ax + 1, rows[rowNum + ay + 1])) { one.logr = one.logr + rr; }
				}
			}
		}
	}
	return resu;
}
function calcRowHot(rowNum: number, rows: BallsRow[]): { ball: number, fills: { dx1: number, dx2: number }[], summ: number, logr: number }[] {
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
}
function dumpRowFills(inrows: BallsRow[]) {
	let oldReduceRatio = reduceRatio;
	let arr: { ball: number, avg: number, sums: number[] }[] = [];
	for (let bb = 0; bb < rowLen; bb++) {
		arr.push({ ball: bb + 1, avg: 0, sums: [] });
	}
	for (let thd = 1; thd <= 30; thd++) {
		reduceRatio = thd;
		let rows: BallsRow[] = sliceRows(inrows, 0, 100);
		let precounts = calcRowPatterns(0 + 1, rows);
		let calcs: { ball: number, fills: { dx1: number, dx2: number }[], summ: number, logr: number }[];
		calcs = calcRowFills(0, rows, precounts);
		for (let bb = 0; bb < rowLen; bb++) {
			arr[bb].sums.push(calcs[bb].summ);
		}
	}
	let mx = 0;
	for (let bb = 0; bb < rowLen; bb++) {
		arr[bb].avg = 0;
		for (let ii = 0; ii < arr[bb].sums.length; ii++) {
			arr[bb].avg = arr[bb].avg + arr[bb].sums[ii];
		}
		arr[bb].avg = arr[bb].avg / arr[bb].sums.length;
		if (mx < arr[bb].avg) mx = arr[bb].avg;
	}
	let hr = mx * mx * mx / (topShift / cellSize);
	for (let bb = 0; bb < rowLen; bb++) {
		let hh = arr[bb].avg * arr[bb].avg * arr[bb].avg / hr;
		markLines.push({
			fromX: bb
			, fromY: Math.round(topShift / cellSize) + skipRowsCount + 0 - 2
			, toX: bb
			, toY: Math.round(topShift / cellSize) + skipRowsCount - hh
		});
		markLines.push({
			fromX: bb + rowLen
			, fromY: Math.round(topShift / cellSize) + skipRowsCount + 0 - 2
			, toX: bb + rowLen
			, toY: Math.round(topShift / cellSize) + skipRowsCount - hh
		});
	}
	reduceRatio = oldReduceRatio;
	console.log(arr);
}
function dumpTriads(svg: SVGElement, rows: BallsRow[]) {
	let ratioPre = 0.99;
	if (highLightMode == 1) {
		ratioPre = 0.33;
	} else {
		if (highLightMode == 2) {
			ratioPre = 0.66;
		}
	}
	for (let rr = 0; rr < rowsVisibleCount; rr++) {
		if (rr > rows.length - 6) break;
		let calcs: { ball: number, fills: { dx1: number, dx2: number }[], summ: number, logr: number }[];
		if (highLightMode == 2) {
			calcs = calcRowPreFreqs(rr, rows);
		} else {
			if (highLightMode == 1) {
				calcs = calcRowHot(rr, rows);
			} else {
				let precounts = calcRowPatterns(rr + 1, rows);
				calcs = calcRowFills(rr, rows, precounts);
			}
		}
		let minCnt = 99999;
		let mxCount = 0;
		for (let ii = 0; ii < rowLen; ii++) {
			if (calcs[ii].logr > mxCount) mxCount = calcs[ii].logr;
			if (calcs[ii].logr < minCnt) minCnt = calcs[ii].logr;
		}
		let df = mxCount - minCnt;
		for (let ii = 0; ii < rowLen; ii++) {
			let idx = ratioPre * (calcs[ii].logr - minCnt) / df;
			let color = 'rgba(0,0,255,' + idx + ')';
			addRect(svg
				, ii * cellSize - 0 * cellSize + 0 * rowLen * cellSize
				, topShift + 0 * cellSize + rr * cellSize
				, cellSize
				, cellSize - 0.1
				, color);
			addRect(svg
				, ii * cellSize - 0 * cellSize + 1 * rowLen * cellSize
				, topShift + 0 * cellSize + rr * cellSize
				, cellSize
				, cellSize - 0.1
				, color);
		}
	}

}
function fillCells() {
	clearSVGgroup(levelA);
	let slicedrows: BallsRow[] = sliceRows(datarows, skipRowsCount, skipRowsCount + rowsSliceCount + calcLen);
	dumpTriads(levelA, slicedrows);
	dumpInfo(skipRowsCount);
	drawLines();
	drawStat3(levelA, slicedrows);
	var msgp: HTMLElement = (document.getElementById('stepsize') as any) as HTMLElement;
	msgp.innerText = '' + reduceRatio;
	msgp = (document.getElementById('calcLen') as any) as HTMLElement;
	msgp.innerText = '' + calcLen;
}
function clickHop() {
	skipRowsCount = Math.round(Math.random() * (datarows.length / reduceRatio - 100));
	showFirstRow=false;
	fillCells();
}
function toggleFirst() {
	showFirstRow = !showFirstRow;
	fillCells();
}
function clickGoSkip(nn: number) {
	console.log('clickGoSkip', nn, nn * reduceRatio, skipRowsCount, datarows.length);
	if (skipRowsCount + nn * reduceRatio >= 0) {
		if (skipRowsCount + nn * reduceRatio < datarows.length - 200) {
			skipRowsCount = skipRowsCount + nn * reduceRatio;
			for (let i = 0; i < markLines.length; i++) {
				markLines[i].fromY = markLines[i].fromY + nn * (reduceRatio - 1);
				markLines[i].toY = markLines[i].toY + nn * (reduceRatio - 1);
			}
			fillCells();
		}
	}
}
function toggleRatioPre() {
	if (highLightMode == 0) {
		highLightMode = 1;
	} else {
		if (highLightMode == 1) {
			highLightMode = 2;
		} else {
			highLightMode = 0;
		}
	}
	fillCells();
}
function moreReduceRatio() {
	reduceRatio = reduceRatio + 1;
	fillCells();
}
function lessReduceRatio() {
	reduceRatio = reduceRatio - 1;
	if (reduceRatio < 1) reduceRatio = 1;
	fillCells();
}
function moreCalcLen() {
	calcLen = calcLen + 1;
	fillCells();
}
function lessCalcLen() {
	calcLen = calcLen - 1;
	if (calcLen < 3) calcLen = 3;
	fillCells();
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
function addTails() {
	markLines = [];
	let slicedrows: BallsRow[] = sliceRows(datarows, skipRowsCount, skipRowsCount + rowsSliceCount * 2);
	/*let firsts: number[] = [];
	for (let ii = 1; ii < slicedrows.length - 1 - 1 - 1; ii++) {
		if (slicedrows[ii + 1]) {
			firsts.splice(0, 0, 100 + slicedrows[ii].balls[0]);
			markLines.push({
				fromX: slicedrows[ii].balls[0] - 1
				, fromY: Math.round(topShift / cellSize) + skipRowsCount + ii
				, toX: slicedrows[ii + 1].balls[0] - 1
				, toY: Math.round(topShift / cellSize) + skipRowsCount + ii + 1
			});
			markLines.push({
				fromX: slicedrows[ii].balls[ballsInRow - 1] - 1
				, fromY: Math.round(topShift / cellSize) + skipRowsCount + ii
				, toX: slicedrows[ii + 1].balls[ballsInRow - 1] - 1
				, toY: Math.round(topShift / cellSize) + skipRowsCount + ii + 1
			});
			markLines.push({
				fromX: slicedrows[ii].balls[0] - 1 + rowLen
				, fromY: Math.round(topShift / cellSize) + skipRowsCount + ii
				, toX: slicedrows[ii + 1].balls[0] - 1 + rowLen
				, toY: Math.round(topShift / cellSize) + skipRowsCount + ii + 1
			});
			markLines.push({
				fromX: slicedrows[ii].balls[ballsInRow - 1] - 1 + rowLen
				, fromY: Math.round(topShift / cellSize) + skipRowsCount + ii
				, toX: slicedrows[ii + 1].balls[ballsInRow - 1] - 1 + rowLen
				, toY: Math.round(topShift / cellSize) + skipRowsCount + ii + 1
			});
		}
	}*/
	dumpRowFills(slicedrows);
	fillCells();
}
function dumpStatAll() {
	let idx = Math.floor(Math.random() * rowLen);
	for (let sz = 1; sz <= ballsInRow; sz++) {
		dumpStatIne(idx, sz);
	}
}
function dumpStatIne(idx, sz) {
	console.log('dumpStatAll', idx, sz);
	let count0 = 0;
	let count1 = 0;
	let count2 = 0;
	let count3 = 0;
	let count4 = 0;
	let count5 = 0;
	let count6 = 0;
	let count7 = 0;

	for (let rr = 1; rr < datarows.length; rr++) {
		let count = 0;
		for (let bb = 0; bb < sz; bb++) {
			if (ballExists(bb + 1 + idx, datarows[rr])) {
				count++;
			}
		}
		if (count == 0) { count0++; }
		if (count == 1) { count1++; }
		if (count == 2) { count2++; }
		if (count == 3) { count3++; }
		if (count == 4) { count4++; }
		if (count == 5) { count5++; }
		if (count == 6) { count6++; }
		if (count == 7) { count7++; }
	}
	console.log(0, count0, Math.round(100 * count0 / datarows.length), '%');
	console.log(1, count1, Math.round(100 * count1 / datarows.length), '%');
	console.log(2, count2, Math.round(100 * count2 / datarows.length), '%');
	console.log(3, count3, Math.round(100 * count3 / datarows.length), '%');
	console.log(4, count4, Math.round(100 * count4 / datarows.length), '%');
	console.log(5, count5, Math.round(100 * count5 / datarows.length), '%');
	console.log(6, count6, Math.round(100 * count6 / datarows.length), '%');
	console.log(7, count7, Math.round(100 * count7 / datarows.length), '%');
}
/////////////////
init();
fillCells();
dumpStatAll();



