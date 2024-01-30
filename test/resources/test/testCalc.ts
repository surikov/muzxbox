let skipRowsCount = 0;

var levelA: SVGElement;
var linesLevel: SVGElement;
var dataBalls: string[];
var datarows: BallsRow[];

let showFirstRow = true;

declare var dataName: string;
declare var rowLen: number;
declare var ballsInRow: number;

let sversion = 'v1.80 ' + dataName + ': ' + ballsInRow + '/' + rowLen;

let markX = -1;
let markY = -1;
let cellSize = 12;
let topShift = cellSize * 21;
let rowsVisibleCount = 66;
let rowsAvgCount = 5;
let rowsSliceCount = rowsVisibleCount + rowsAvgCount;
let reduceRatio = 1;
let highLightMode = 1;
var calcLen = 32;
let diffWide=1;


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
	console.log(dataBalls);
	datarows = readParseStat(dataBalls);
	console.log('datarows', datarows);
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
function calculateBallTriadChain(rowNum: number, rows: BallsRow[], counts: number[]): { ball: number, fills: { dx1: number, dx2: number }[], summ: number }[] {
	let resu: { ball: number, fills: { dx1: number, dx2: number }[], summ: number }[] = [];
	for (let nn = 0; nn < rowLen; nn++) {
		let one: { ball: number, fills: { dx1: number, dx2: number }[], summ: number } = { ball: nn + 1, fills: [], summ: 0 };
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
				one.summ++;
			}
		}
		one.logr = one.summ;
	}
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
		//let slicedrows: BallsRow[] = sliceRows(inrows, 1*reduceRatio, inrows.length-1*reduceRatio);
		//dumpRowFillsColor(slicedrows, '#00990033', 0);
		
		dumpRowWaitColor(inrows, '#00000033', 0);
	} else {
		dumpRowWaitColor(inrows, '#009900cc', 0);
		dumpRowFillsColor(inrows, '#00000033', 0);
	}
}

function dumpRowWaitColor(rows: BallsRow[], color: string, shiftX: number) {
	let arr: { ball: number, summ: number }[] = [];
	//var rowNum = 0;
	//let diff=0;
	for (let nn = 0; nn < rowLen; nn++) {
		let one: { ball: number, summ: number } = { ball: nn + 1, summ: 0 };
		arr.push(one);
		/*for (var rr = rowNum + 1; rr < rowNum + 1 + calcLen; rr++) {
			if (ballExists(nn + 1, rows[rr])) {
				break;
			}
			one.summ++;
		}*/
		for (let shift = -diffWide; shift <= diffWide; shift++) {
			one.summ = one.summ + calcEmptyLineDuration(shift, nn + 1, 1, rows);
		}
	}
	let mx = 0;
	let min = 98765;
	for (let bb = 0; bb < rowLen; bb++) {
		if (mx < arr[bb].summ) mx = arr[bb].summ;
		if (min > arr[bb].summ) min = arr[bb].summ;
	}
	let hr = (mx - min) / (topShift / cellSize - 2);
	let prehh = (mx - min - (arr[rowLen - 1].summ - min)) / hr;
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
}
function dumpRowFillsColor(rows: BallsRow[], color: string, shiftX: number) {
	let precounts: number[] = calcRowPatterns(0 + 1, rows);
	let ballFills: { ball: number, fills: { dx1: number, dx2: number }[], summ: number }[] = calculateBallTriadChain(0, rows, precounts);
	let mx = 0;
	let min = 987654321;
	for (let bb = 0; bb < rowLen; bb++) {
		if (mx < ballFills[bb].summ) { mx = ballFills[bb].summ; }
		if (min > ballFills[bb].summ) { min = ballFills[bb].summ; }
	}
	let hr = (mx - min) / (topShift / cellSize - 2);
	let prehh = (mx - min - (ballFills[rowLen - 1].summ - min)) / hr;
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
}
function dumpTriads(svg: SVGElement, rows: BallsRow[]) {
	let ratioPre = 0.66;//0.99;
	//console.log('dumpTriads mode', highLightMode);
	for (let rr = 0; rr < rowsVisibleCount; rr++) {
		if (rr > rows.length - 6) break;
		let calcs: { ball: number, fills: { dx1: number, dx2: number }[], summ: number }[];
		if (highLightMode == 1) {
			calcs = calculateBallFrequency(rr, rows);
		} else {
			let precounts = calcRowPatterns(rr + 1, rows);
			calcs = calculateBallTriadChain(rr, rows, precounts);
		}
		let minCnt = 99999;
		let mxCount = 0;
		for (let ii = 0; ii < rowLen; ii++) {
			if (calcs[ii].summ > mxCount) mxCount = calcs[ii].summ;
			if (calcs[ii].summ < minCnt) minCnt = calcs[ii].summ;
		}
		let df = mxCount - minCnt;
		for (let ii = 0; ii < rowLen; ii++) {
			let idx = ratioPre * (calcs[ii].summ - minCnt) / df;
			let color = 'rgba(0,0,255,' + idx + ')';
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
}
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
	msgp = (document.getElementById('calcLen') as any) as HTMLElement;
	msgp.innerText = '' + calcLen;
	msgp = (document.getElementById('calcWide') as any) as HTMLElement;
	msgp.innerText = '' + diffWide;

}
function clickHop() {
	skipRowsCount = Math.round(Math.random() * (datarows.length - reduceRatio * rowsVisibleCount));
	addTails();
}
function toggleFirst() {
	showFirstRow = !showFirstRow;
	fillCells();
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
function addTails() {
	clearNonManual();
	let slicedrows: BallsRow[] = sliceRows(datarows, skipRowsCount, skipRowsCount + rowsSliceCount * 2);
	dumpRowFills(slicedrows);
	fillCells();
}


init();
addTails();

