let skipRowsCount = 0;
let sversion = 'test749 v1.06';
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
	//let ballsInRow: number = 7;
	var rows: BallsRow[] = [{
		balls: [],
		key: 'next'
	}];
	for (let i = 0; i < ballsInRow; i++) {
		rows[0].balls.push(0);
	}
	//var rows: BallsRow[] = [{
	//	balls: [0, 0, 0, 0, 0, 0, 0],
	//	key: 'next'
	//}];
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
	//rect.setAttribute("stroke-color", strokecolor);
	//rect.setAttribute("fill-opacity", '100%');
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

/////////////////
function init() {

	levelA = (document.getElementById('levelA') as any) as SVGElement;
	//console.log(levelA);
	linesLevel = (document.getElementById('linesLevel') as any) as SVGElement;
	//console.log(levelB);
	//dataBalls = window['data749'];
	dataBalls = window[dataName];

	console.log(dataBalls);
	datarows = readParseStat(dataBalls);
	//randomizeData(datarows);
	console.log(datarows);
}
function randomizeData(rows: BallsRow[]) {
	for (let i = 0; i < rows.length; i++) {
		for (let nn = 0; nn < ballsInRow; nn++) {
			rows[i].balls[nn] = Math.floor(Math.random() * 50);
		}
	}
}

//function drawStat2(svg: SVGElement, rows: BallsRow[]) {
//	var cx = 500;
//	var cy = 500;
/*var stepPerRotation = 4 * 60;
var increment =  20*2 * Math.PI / stepPerRotation;
var theta = 0;
var count = 10;
while (theta < count * 2 * Math.PI) {
	var newX = cx + 6 * theta * Math.cos(theta);
	var newY = cy - 6 * theta * Math.sin(theta);
	addCircle(svg, newX, newY, 4, '#000000');
	theta = 0.992*(theta + increment);
}
*/
/*let angle = 0;
let angleStep = 2 * Math.PI / 16;
let radius=10;
let radiusStep=10;
for (let ii = 0; ii < 1000; ii++) {
	var xx = cx + sizeRatio * angle * Math.cos(angle);
	var yy = cy + sizeRatio * angle * Math.sin(angle);
	addCircle(svg, xx, yy, 4, '#000000');
	angleStep = farRatio * angleStep;
	angle = angle + angleStep;
}*/
//}
/*
function drawStat1(svg: SVGElement, rows: BallsRow[]) {
	//randomizeData(rows);
	let rowCount = 7;
	let rowLen = 49;
	let cellSize = 4;
	addRect(svg, rowLen * cellSize + cellSize / 2, 0, rowLen * cellSize, cellSize, '#ffffff');
	for (let rowNum = 0; rowNum < 500; rowNum++) {
		let row = rows[rowNum];
		for (let colNum = 1; colNum <= rowLen; colNum++) {
			if (ballExists(colNum, rowLen, row)) {
				addCircle(svg, colNum * cellSize * 2, 30 + rowNum * cellSize * 2, cellSize, '#000000', '#000000');
			} else {
				addCircle(svg, colNum * cellSize * 2, 30 + rowNum * cellSize * 2, cellSize, '#cccccc', '#cccccc');
			}
		}
		for (let colNum = 1 + rowLen; colNum <= rowLen + rowLen; colNum++) {
			if (ballExists(colNum, rowLen, row)) {
				addCircle(svg, colNum * cellSize * 2, 30 + rowNum * cellSize * 2, cellSize, '#000000', '#000000');
			} else {
				addCircle(svg, colNum * cellSize * 2, 30 + rowNum * cellSize * 2, cellSize, '#cccccc', '#cccccc');
			}
		}
		for (let colNum = 1 + rowLen + rowLen; colNum <= rowLen + rowLen + rowLen; colNum++) {
			if (ballExists(colNum, rowLen, row)) {
				addCircle(svg, colNum * cellSize * 2, 30 + rowNum * cellSize * 2, cellSize, '#000000', '#000000');
			} else {
				addCircle(svg, colNum * cellSize * 2, 30 + rowNum * cellSize * 2, cellSize, '#cccccc', '#cccccc');
			}
		}
	}

}*/
function clickClearLines(){
	markLines=[];
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
function drawStat3(svg: SVGElement, rows: BallsRow[], fillColor: (ballNum: number, row: BallsRow, rows: BallsRow[]) => { strokeColor: string, fillColor: string }) {
	drawLines();
	//let rowCount = 7;
	//let rowLen = 49;

	addRect(svg, rowLen * cellSize + cellSize / 2, 0, rowLen * cellSize, cellSize, '#ffffff');
	for (let rowNum = 0; rowNum < rows.length; rowNum++) {
		let row = rows[rowNum];
		for (let colNum = 1; colNum <= rowLen; colNum++) {
			let colors: { strokeColor: string, fillColor: string } = fillColor(colNum, row, rows);;
			addCircle(svg, colNum * cellSize - 0.5 * cellSize + 0 * rowLen * cellSize, topShift + 0.5 * cellSize + rowNum * cellSize, cellSize / 2 - 0.5, colors.strokeColor, colors.fillColor);
			addCircle(svg, colNum * cellSize - 0.5 * cellSize + 1 * rowLen * cellSize, topShift + 0.5 * cellSize + rowNum * cellSize, cellSize / 2 - 0.5, colors.strokeColor, colors.fillColor);
			//addCircle(svg, colNum * cellSize + 2 * rowLen * cellSize, 30 + rowNum * cellSize, cellSize / 2 - 0.5, colors.strokeColor, colors.fillColor);

		}
	}
	for (let colNum = 1; colNum <= rowLen; colNum++) {
		addSmallText(svg, colNum * cellSize - cellSize, topShift, "" + colNum);
	}
	//for (let i = 1; i <= rowLen; i++) {
	//	console.log(i, countSummExists(i, rowCount, rows) / rows.length);
	//}
}
/*
function countSummExists(ballNum: number, rowCount: number, rows: BallsRow[]): number {
	let smm = 0;
	for (let i = 0; i < rows.length; i++) {
		if (ballExists(ballNum, rowCount, rows[i])) {
			smm++;
		}
	}
	return smm;
}*/
function fillCells() {
	dumpInfo(skipRowsCount);

	let rowsCheckCount = 88;

	let slicedrows: BallsRow[] = sliceRows(datarows, skipRowsCount, skipRowsCount + rowsCheckCount);

	clearSVGgroup(levelA);

	//addCircle(levelA,200,100,4,'#666666');
	drawStat3(levelA, slicedrows, (ballNum: number, row: BallsRow, rows: BallsRow[]) => {
		if (ballExists(ballNum, row)) {
			return { strokeColor: '#000000', fillColor: '#000000' };
		} else {
			return { strokeColor: '#cccccc', fillColor: '#cccccc' }
		}
	});
}
function clickRandomize() {
	skipRowsCount = Math.round(Math.random() * (datarows.length - 100));
	fillCells();
}
function clickGoSkip(nn: number) {
	skipRowsCount = skipRowsCount + nn;
	if (skipRowsCount < 0) skipRowsCount = 0;
	if (skipRowsCount > datarows.length - 100) skipRowsCount = datarows.length - 100;
	fillCells();
}

/////////////////
init();
clickRandomize();
