let skipRowsCount = 0;
let sversion = 'test749 v1.07';
var levelA: SVGElement;
var linesLevel: SVGElement;
var dataBalls: string[];
var datarows: BallsRow[];
let dataName = 'data645';
let rowLen = 45;
let ballsInRow = 6;
let markX = -1;
let markY = -1;
let cellSize = 8;
let topShift = cellSize * 22;
let rowsVisibleCount = 80;
let rowsAvgCount = 12;
let opacityRatio=10;
let rowsSliceCount = rowsVisibleCount + rowsAvgCount;
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
	for (var i = firstRowNum; i <= lastRowNum; i++) {
		sliced.push(rows[i]);
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
			row.key = dataBalls[i - 1].trim();
			row.key = row.key.replace(':00', ':00 #');
			row.key = row.key.replace(':30', ':30 #');
			rows.push(row);
		}
	}
	return rows;
}
function ballExists(ball: number, row: BallsRow): boolean {
	while (ball < 1) ball = ball + rowLen;
	while (ball > rowLen) ball = ball - rowLen;
	for (var i = 0; i < row.balls.length; i++) {
		if (row.balls[i] == ball) {
			return true;
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
	tx.setAttributeNS(null, "font-size", "7");
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
function randomizeData(rows: BallsRow[]) {
	for (let i = 0; i < rows.length; i++) {
		for (let nn = 0; nn < ballsInRow; nn++) {
			rows[i].balls[nn] = Math.floor(Math.random() * 50);
		}
	}
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
		addLine(linesLevel
			, markLines[i].fromX * cellSize + 0.5 * cellSize
			, (markLines[i].fromY - skipRowsCount) * cellSize + 0.5 * cellSize
			, markLines[i].toX * cellSize + 0.5 * cellSize
			, (markLines[i].toY - skipRowsCount) * cellSize + 0.5 * cellSize
			, cellSize / 2, '#ffff0099');
	}
}
function drawStat3(svg: SVGElement, rows: BallsRow[], fillColor: (ballNum: number, rowNum: number, rows: BallsRow[]) => { strokeColor: string, fillColor: string }) {
	drawLines();
	addRect(svg, rowLen * cellSize + cellSize / 2, 0, rowLen * cellSize, cellSize, '#ffffff');
	for (let rowNum = 0; rowNum < rowsVisibleCount; rowNum++) {
		let row = rows[rowNum];
		for (let colNum = 1; colNum <= rowLen; colNum++) {
			let colors: { strokeColor: string, fillColor: string } = fillColor(colNum, rowNum, rows);;
			//addCircle(svg, colNum * cellSize - 0.5 * cellSize + 0 * rowLen * cellSize, topShift + 0.5 * cellSize + rowNum * cellSize, cellSize / 2 - 0.5, colors.strokeColor, colors.fillColor);
			addRect(svg
				, colNum * cellSize - 1 * cellSize + 0 * rowLen * cellSize
				, topShift + 0 * cellSize + rowNum * cellSize
				, cellSize, cellSize - 0.1, colors.fillColor);
			addCircle(svg
				, colNum * cellSize - 0.5 * cellSize + 0 * rowLen * cellSize
				, topShift + 0.5 * cellSize + rowNum * cellSize
				, cellSize / 2 - 0.5, colors.strokeColor, '#33221100');
			//addCircle(svg, colNum * cellSize - 0.5 * cellSize + 1 * rowLen * cellSize, topShift + 0.5 * cellSize + rowNum * cellSize, cellSize / 2 - 0.5, colors.strokeColor, colors.fillColor);
			addRect(svg
				, colNum * cellSize - 1 * cellSize + 1 * rowLen * cellSize
				, topShift + 0 * cellSize + rowNum * cellSize
				, cellSize, cellSize - 0.1, colors.fillColor);
			addCircle(svg
				, colNum * cellSize - 0.5 * cellSize + 1 * rowLen * cellSize
				, topShift + 0.5 * cellSize + rowNum * cellSize
				, cellSize / 2 - 0.5, colors.strokeColor, '#33221100');
		}
	}
	for (let colNum = 1; colNum <= rowLen; colNum++) {
		addSmallText(svg, colNum * cellSize - cellSize, topShift, "" + colNum);
	}
}
function fillColorFunc(ballNum: number, rowNum: number, rows: BallsRow[]): { strokeColor: string, fillColor: string } {
	let cnt = 0;
	for (let i = 1; i < rowsAvgCount; i++) {
		//console.log(rows.length,rowNum,(rowNum + i + 1), ballNum, rows[rowNum + i + 1]);
		if (ballExists(ballNum, rows[rowNum + i])) {
			cnt++;
		}
	}
	let opac = cnt / opacityRatio;
	if (opac > 1) opac = 1;
	let fll = 'rgba(0,0,255,' + opac + ')';
	//console.log(rows[rowNum].key, ballNum, cnt);
	if (ballExists(ballNum, rows[rowNum])) {
		return { strokeColor: '#000000ff', fillColor: fll };
	} else {
		return { strokeColor: '#33221100', fillColor: fll }
	}
}
function fillCells() {
	dumpInfo(skipRowsCount);

	let slicedrows: BallsRow[] = sliceRows(datarows, skipRowsCount, skipRowsCount + rowsSliceCount);
	clearSVGgroup(levelA);
	/*drawStat3(levelA, slicedrows, (ballNum: number, row: BallsRow, rows: BallsRow[]) => {
		if (ballExists(ballNum, row)) {
			return { strokeColor: '#000000', fillColor: '#000000' };
		} else {
			return { strokeColor: '#cccccc', fillColor: '#cccccc' }
		}
	});*/
	drawStat3(levelA, slicedrows, fillColorFunc);
}
function clickRandomize() {
	skipRowsCount = Math.round(Math.random() * (datarows.length - 100));
	fillCells();
}
function clickGoSkip(nn: number) {
	skipRowsCount = skipRowsCount + nn;
	if (skipRowsCount < 0) skipRowsCount = 0;
	if (skipRowsCount > datarows.length - 200) skipRowsCount = datarows.length - 200;
	fillCells();
}

/////////////////
init();
fillCells();
