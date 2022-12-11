let skipRowsCount = 0;

var levelA: SVGElement;
var linesLevel: SVGElement;
var dataBalls: string[];
var datarows: BallsRow[];

let showFirstRow = false;

declare var dataName: string;
declare var rowLen: number;
declare var ballsInRow: number;

let sversion = 'v1.40 ' + dataName + ': ' + ballsInRow + '/' + rowLen;

let markX = -1;
let markY = -1;
let cellSize = 12;
let topShift = cellSize * 11;
let rowsVisibleCount = 44;
let rowsAvgCount = 5;
//let ratioPre=0.5;
let rowsSliceCount = rowsVisibleCount + rowsAvgCount;
let reduceRatio = 1;
let highLightMode = 1;
//let tailOrder=0;
//let prewide=5;
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
/*
function reducedRows(ech:number,rows: BallsRow[]): BallsRow[]{
	let newrows: BallsRow[]=[];
	for(let i=0;i<rows.length;i=i+ech){
		newrows.push(rows[i]);
	}
	return newrows;
}*/
function sliceRows(rows: BallsRow[], firstRowNum: number, lastRowNum: number): BallsRow[] {
	var sliced: BallsRow[] = [];
	let nn = firstRowNum;
	for (var i = firstRowNum; i <= lastRowNum; i++) {
		//sliced.push(rows[i]);
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
			//console.log(row.balls);
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
	addLine(svg, x1, y1, x2, y2, strokeWidth / 3, color);
	/*addCircle(svg, x2, y2, strokeWidth/2, color, color);
	let stepCount=Math.abs(x1-x2)/cellSize;
	if(stepCount<Math.abs(y1-y2)/cellSize)stepCount=Math.abs(y1-y2)/cellSize;
	let dx=(x1-x2)/stepCount;
	let dy=(y1-y2)/stepCount;
	let cx=x2;
	let cy=y2;
	for(var ii=1;ii<=stepCount;ii++){
		if(Math.round(cx+ii*dx)!=cx || Math.round(cy+ii*dy)!=cy){
			cx=Math.round(x2+ii*dx);
			cy=Math.round(y2+ii*dy);
			console.log(cx,cy);
			let xx=cellSize*Math.round(cx/cellSize);
			let yy=cellSize*Math.round(cy/cellSize);
			addCircle(svg, xx, yy, strokeWidth/2, color, color);
		}
	}*/
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
/*
function randomizeData(originalrows: BallsRow[]) {
	let json=JSON.stringify(originalrows);
	let rows=JSON.parse(json);
	for (let i = 0; i < rows.length; i++) {
		for (let nn = 0; nn < ballsInRow; nn++) {
			rows[i].balls[nn] = Math.floor(Math.random() * 50);
		}
	}
	return rows;
}*/
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
function drawLines() {//reduceRatio
	clearSVGgroup(linesLevel);
	//console.log(markLines);
	for (let i = 0; i < markLines.length; i++) {
		//let fy=markLines[i].fromY - skipRowsCount;
		//let ty=markLines[i].toY - skipRowsCount;
		composeLine(linesLevel
			, markLines[i].fromX * cellSize + 0.5 * cellSize
			, (markLines[i].fromY - skipRowsCount) * cellSize + 0.5 * cellSize
			, markLines[i].toX * cellSize + 0.5 * cellSize
			, (markLines[i].toY - skipRowsCount) * cellSize + 0.5 * cellSize
			, cellSize / 0.99, '#ffff0099');
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
		if(colNum%10==0){
			addBigText(svg, colNum * cellSize - cellSize*0.8, topShift-2, "" + colNum);
			addBigText(svg, (colNum+rowLen) * cellSize - cellSize*0.8, topShift-5, "" + colNum);
		}else{
			addSmallText(svg, colNum * cellSize - cellSize*0.8, topShift-2, "" + colNum);
			addSmallText(svg, (colNum+rowLen) * cellSize - cellSize*0.8, topShift-5, "" + colNum);
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
	//console.log(rowNum,rows.length);
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
/*function setWide(resu:{ball:number,fills:{dx1:number,dx2:number}[],summ:number,logr:number}[]){
	for(let nn=0;nn<rowLen;nn++){
		let one:{ball:number,fills:{dx1:number,dx2:number}[],summ:number,logr:number}=resu[nn];
		one.logr=one.summ;
		for(let kk=0;kk<prewide;kk++){
			let idx=nn+kk;
			if(idx>=rowLen)idx=idx-rowLen;
			let nextOne:{ball:number,fills:{dx1:number,dx2:number}[],summ:number,logr:number}=resu[idx];
			one.logr=one.logr*nextOne.summ;
		}
		//one.logr=one.summ*one.summ;
	}
	for(let nn=0;nn<rowLen;nn=nn+prewide){
		let one:{ball:number,fills:{dx1:number,dx2:number}[],summ:number,logr:number}=resu[nn];
		for(let kk=1;kk<prewide;kk++){
			let idx=nn+kk;
			if(idx>=rowLen)idx=idx-rowLen;
			let nextOne:{ball:number,fills:{dx1:number,dx2:number}[],summ:number,logr:number}=resu[idx];
			nextOne.logr=one.logr;
		}
	}
}*/
function calcRowFills(rowNum: number, rows: BallsRow[], counts: number[]): { ball: number, fills: { dx1: number, dx2: number }[], summ: number, logr: number }[] {
	let resu: { ball: number, fills: { dx1: number, dx2: number }[], summ: number, logr: number }[] = [];
	for (let nn = 0; nn < rowLen; nn++) {
		let one: { ball: number, fills: { dx1: number, dx2: number }[], summ: number, logr: number } = { ball: nn + 1, fills: [], summ: 0, logr: 0 };
		resu.push(one);
		for (let dx1 = 0; dx1 < rowLen; dx1++) {
			for (let dx2 = 0; dx2 < rowLen; dx2++) {
				if (triadFills(nn + 1, rowNum, dx1, dx2, rows)) {
					one.fills.push({ dx1: dx1, dx2: dx2 });
					let cc = counts[dx1 * rowLen + dx2]
					one.summ = one.summ + cc * cc;
				}
			}
		}
		one.logr = one.summ * one.summ * one.summ* one.summ;
	}
	//setWide(resu);
	return resu;
}
function calcRowFreqs(rowNum: number, rows: BallsRow[]): { ball: number, fills: { dx1: number, dx2: number }[], summ: number, logr: number }[] {
	let resu: { ball: number, fills: { dx1: number, dx2: number }[], summ: number, logr: number }[] = [];
	//console.log(rows);

	for (let nn = 0; nn < rowLen; nn++) {
		let one: { ball: number, fills: { dx1: number, dx2: number }[], summ: number, logr: number } = { ball: nn + 1, fills: [], summ: 0, logr: 0 };
		resu.push(one);
		if (rows.length > rowNum + 1 + calcLen) {
			for (var rr = rowNum + 1; rr < rowNum + 1 + calcLen; rr++) {
				if (ballExists(nn + 0, rows[rr])) { one.summ = one.summ + 0.15; }
				if (ballExists(nn + 1, rows[rr])) { one.summ++; }
				if (ballExists(nn + 2, rows[rr])) { one.summ = one.summ + 0.15; }
			}
			one.logr = one.summ * one.summ;
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
			/*for (let cc = 0; cc < 99; cc++) {
				one.summ++;
				if (rows.length > rr + cc) {
					if (ballExists(nn + 1, rows[rr + cc])) {
						break;
					}
				}
			}*/
			//one.summ = nn+rr;
			if (ballExists(nn + 1, rows[rr])) {
				break;
			}
			one.summ++;
		}
		one.logr = one.summ  ;
	}
	//console.log(rowNum,rows[rowNum],resu);
	return resu;
}
function dumpTriads(svg: SVGElement, rows: BallsRow[]) {
	//console.log('dumpTriads', highLightMode);
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
		//console.log(rr,rows.length);
		let precounts = calcRowPatterns(rr + 1, rows);
		let calcs: { ball: number, fills: { dx1: number, dx2: number }[], summ: number, logr: number }[];
		if (highLightMode == 2) {
			calcs = calcRowFreqs(rr, rows);
		} else {
			if (highLightMode == 1) {
				calcs = calcRowHot(rr, rows);
			} else {
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
		//if (rr == 0) console.log(calcs);
	}

}
function fillCells() {
	clearSVGgroup(levelA);
	let slicedrows: BallsRow[] = sliceRows(datarows, skipRowsCount, skipRowsCount + rowsSliceCount + calcLen);
	dumpTriads(levelA, slicedrows);
	dumpInfo(skipRowsCount);
	drawLines();
	drawStat3(levelA, slicedrows);
	/*
	let precounts=calcRowPatterns(0+1,slicedrows);
	let calcs=calcRowFills(0,slicedrows,precounts);
	console.log(calcs);
	for(let ii=0;ii<10;ii++){
		console.log(calcRowPatterns(ii+0,slicedrows));
	}*/
	//console.log('reduceRatio', reduceRatio);
	var msgp: HTMLElement = (document.getElementById('stepsize') as any) as HTMLElement;
	msgp.innerText = '' + reduceRatio;
	msgp = (document.getElementById('calcLen') as any) as HTMLElement;
	msgp.innerText = '' + calcLen;
}
function clickHop() {
	//console.log(datarows.length, reduceRatio);
	skipRowsCount = Math.round(Math.random() * (datarows.length / reduceRatio - 100));
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
			//if (skipRowsCount < 0) skipRowsCount = 0;
			//if (skipRowsCount > datarows.length/reduceRatio - 200) skipRowsCount = datarows.length/reduceRatio - 200;
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

	//if(ratioPre==0.5)ratioPre=0.75;
	//else if(ratioPre==0.75)ratioPre=0.99;
	//else ratioPre=0.5;

	fillCells();
}
function moreReduceRatio() {
	reduceRatio = reduceRatio + 1;
	fillCells();
}
function lessReduceRatio() {
	/*for (let i = 0; i < markLines.length; i++) {
		markLines[i].fromY=markLines[i].fromY/reduceRatio;
		markLines[i].toY=markLines[i].toY*reduceRatio;
	}*/
	reduceRatio = reduceRatio - 1;
	if (reduceRatio < 1) reduceRatio = 1;
	/*for (let i = 0; i < markLines.length; i++) {
		markLines[i].fromY=markLines[i].fromY/reduceRatio;
		markLines[i].toY=markLines[i].toY*reduceRatio;
	}*/
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
	//console.log(balls);
	let pre: number[] = balls;
	//let prepre:number[]=[];
	let nxt: number[] = [];
	while (1 == 1) {
		//console.log(pre,nxt);
		nxt = [];
		for (let bb = 1; bb < pre.length; bb++) {
			nxt.push(Math.abs(pre[bb - 1] - pre[bb]));
		}
		//console.log(nxt);
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
	let slicedrows: BallsRow[] = sliceRows(datarows, skipRowsCount, skipRowsCount + rowsSliceCount);
	let firsts: number[] = [];
	for (let ii = 1; ii < slicedrows.length - 1 - 1 - 1; ii++) {
		if (slicedrows[ii + 1]) {
			//console.log(slicedrows[ii], slicedrows[ii].balls[0]);
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
	}
	dumpLineFirst(firsts);
	fillCells();

}
function dumpLineFirst(firsts: number[]) {
	console.log(firsts);
	var alpha = 0.5  // overall smoothing component
		, beta = 0.4   // trend smoothing component
		, gamma = 0.6  // seasonal smoothing component
		, period = 4   // # of observations per season
		, m = 1        // # of future observations to forecast
		, predictions = [];
	var sz = Math.floor(firsts.length / period) * period;
	console.log(sz);
	firsts.splice(0, firsts.length - sz);
	console.log(firsts);
	predictions = forecast(firsts, alpha, beta, gamma, period, m);
	// -> [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 594.8043646513713, 357.12171044215734, ...]
	console.log(predictions);
	console.log(predictions[predictions.length - 1] - 100);
}
////////////////////////
/* Holt-Winters triple exponential smoothing
 * see: http://www.itl.nist.gov/div898/handbook/pmc/section4/pmc435.htm
 *
 * @param {array} data input data (Float64Array)
 * @param {number} alpha overall smoothing parameter (float)
 * @param {number} beta seasonal smoothing parameter (float)
 * @param {number} gamma trend smoothing parameter (float)
 * @param {number} period (int)
 * @param {number} m how many periods to forecast ahead (int)
 *
 * @return {Float64Array}
 */
function forecast(data: number[], alpha: number, beta: number, gamma: number, period: number, m): number[] {
	var seasons: number, seasonal: number[];
	if (!validArgs(data, alpha, beta, gamma, period, m)) return;
	seasons = data.length / period;
	var st_1: number = data[0];
	var bt_1: number = initialTrend(data, period);
	seasonal = seasonalIndices(data, period, seasons);
	return calcHoltWinters(data, st_1, bt_1, alpha, beta, gamma, seasonal, period, m);
}
//module.exports = forecast;
function validArgs(data: number[], alpha: number, beta: number, gamma: number, period: number, m: number): boolean {
	if (!data.length) return false;
	if (m <= 0) return false;
	if (m > period) return false;
	if (alpha < 0.0 || alpha > 1.0) return false;
	if (beta < 0.0 || beta > 1.0) return false;
	if (gamma < 0.0 || gamma > 1.0) return false;
	return true;
}
function initialTrend(data: number[], period: number): number {
	var sum = 0;
	for (var i = 0; i < period; i++) {
		sum = sum + (data[period + i] - data[i]);
	}
	return sum / (period * period);
}
function seasonalIndices(data: number[], period: number, seasons: number): number[] {
	var savg: number[], obsavg: number[], si: number[], i: number, j: number;
	savg = Array(seasons);
	obsavg = Array(data.length);
	si = Array(period);
	// zero-fill savg[] and si[]
	for (let i: number = 0; i < seasons; i++) {
		savg[i] = 0.0;
	}
	for (let i = 0; i < period; i++) {
		si[i] = 0.0;
	}
	// seasonal averages
	for (let i = 0; i < seasons; i++) {
		for (let j = 0; j < period; j++) {
			savg[i] = savg[i] + data[(i * period) + j];
		}
		savg[i] = savg[i] / period;
	}
	// averaged observations
	for (let i = 0; i < seasons; i++) {
		for (let j = 0; j < period; j++) {
			obsavg[(i * period) + j] = data[(i * period) + j] / savg[i];
		}
	}
	// seasonal indices
	for (let i = 0; i < period; i++) {
		for (let j = 0; j < seasons; j++) {
			si[i] = si[i] + obsavg[(j * period) + i];
		}
		si[i] = si[i] / seasons;
	}
	return si;
}
function calcHoltWinters(data: number[], st_1: number, bt_1: number, alpha: number, beta: number, gamma: number, seasonal: number[], period: number, m: number): number[] {
	var len: number = data.length,
		st: number[] = Array(len), // overall smoothing component
		bt: number[] = Array(len), // trend smoothing component
		it: number[] = Array(len), // seasonal smoothing component
		ft: number[] = Array(len), // generated forecast
		i: number; // reusable idx
	// initial level st[1] == st_1 == data[0] ... see function forecast()
	st[1] = st_1;
	// initial trend bt[1] == bt_1 == initialTrend(data, period) ... see function forecast()
	bt[1] = bt_1;
	// zero-fill ft[] (to clean up undefined values at start of forecast array --i.e. ft[])
	for (i = 0; i < len; i++) {
		ft[i] = 0.0;
	}
	// initial seasonal indices it[]
	for (i = 0; i < period; i++) {
		it[i] = seasonal[i];
	}
	for (let i = 2; i < len; i++) {
		// overall level smoothing component st[]
		if (i - period >= 0) {
			st[i] = ((alpha * data[i]) / it[i - period]) + ((1.0 - alpha) * (st[i - 1] + bt[i - 1]));
		} else {
			st[i] = (alpha * data[i]) + ((1.0 - alpha) * (st[i - 1] + bt[i - 1]));
		}
		// trend smoothing component bt[]
		bt[i] = (gamma * (st[i] - st[i - 1])) + ((1 - gamma) * bt[i - 1]);
		// seasonal smoothing component it[]
		if (i - period >= 0) {
			it[i] = ((beta * data[i]) / st[i]) + ((1.0 - beta) * it[i - period]);
		}
		// generate forecast as ft[]
		if (i + m >= period) {
			ft[i + m] = (st[i] + (m * bt[i])) * it[i - period + m];
		}
	}
	// -> forecast[]
	return ft;
}
function dumpStatAll(){
	let idx=Math.floor(Math.random()*rowLen);
	for(let sz=1;sz<=ballsInRow;sz++){
		dumpStatIne(idx,sz);
	}
}
function dumpStatIne(idx,sz){
	console.log('dumpStatAll',idx,sz);
	let count0=0;
	let count1=0;
	let count2=0;
	let count3=0;
	let count4=0;
	let count5=0;
	let count6=0;
	let count7=0;
	
	for(let rr=1;rr<datarows.length;rr++){
		let count=0;
		for(let bb=0;bb<sz;bb++){
			if(ballExists(bb+1+idx,datarows[rr])){
				count++;
			}
		}
		if(count==0){count0++;}
		if(count==1){count1++;}
		if(count==2){count2++;}
		if(count==3){count3++;}
		if(count==4){count4++;}
		if(count==5){count5++;}
		if(count==6){count6++;}
		if(count==7){count7++;}
	}
	console.log(0,count0,Math.round(100*count0/datarows.length),'%');
	console.log(1,count1,Math.round(100*count1/datarows.length),'%');
	console.log(2,count2,Math.round(100*count2/datarows.length),'%');
	console.log(3,count3,Math.round(100*count3/datarows.length),'%');
	console.log(4,count4,Math.round(100*count4/datarows.length),'%');
	console.log(5,count5,Math.round(100*count5/datarows.length),'%');
	console.log(6,count6,Math.round(100*count6/datarows.length),'%');
	console.log(7,count7,Math.round(100*count7/datarows.length),'%');
}
/////////////////
init();
fillCells();
dumpStatAll();

// plain-vanilla
/*
var forecast = require('nostradamus')
  , data = [
      362, 385, 432, 341, 382, 409,
      498, 387, 473, 513, 582, 474,
      544, 582, 681, 557, 628, 707,
      773, 592, 627, 725, 854, 661
    ]
  , alpha = 0.5  // overall smoothing component
  , beta = 0.4   // trend smoothing component
  , gamma = 0.6  // seasonal smoothing component
  , period = 4   // # of observations per season
  , m = 4        // # of future observations to forecast
  , predictions = [];
*/
/*
var data1 = [
	362, 385, 432, 341, 382, 409,
	498, 387, 473, 513, 582, 474,
	544, 582, 681, 557, 628, 707,
	773, 592, 627, 725, 854, 661
];
var data = [
	100,200,300,400,200,300
	,100,200,300,500,200,300
	,100,200,300,400,200,300
	,100,200,300,600,200,300
];
	var alpha = 0.5  // overall smoothing component
	, beta = 0.4   // trend smoothing component
	, gamma = 0.6  // seasonal smoothing component
	, period = 12   // # of observations per season
	, m = 1        // # of future observations to forecast
	, predictions = [];
console.log(data);
predictions = forecast(data, alpha, beta, gamma, period, m);
// -> [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 594.8043646513713, 357.12171044215734, ...]
console.log(predictions);
for(let i=0;i<predictions.length;i++){
	console.log(i,data[i],Math.round(predictions[i]));
}
*/


