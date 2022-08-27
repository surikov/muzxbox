let skipRowsCount = 0;

var levelA: SVGElement;
var linesLevel: SVGElement;
var dataBalls: string[];
var datarows: BallsRow[];

let showFirstRow=false;

declare var dataName: string;
declare var rowLen: number;
declare var ballsInRow: number;

let sversion = 'v1.31 '+dataName+': '+ballsInRow+'/'+rowLen;

let markX = -1;
let markY = -1;
let cellSize = 12;
let topShift = cellSize * 11;
let rowsVisibleCount = 80;
let rowsAvgCount = 5;
let ratioPre=0.5;
let rowsSliceCount = rowsVisibleCount + rowsAvgCount;
//let prewide=5;
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
function composeLine(svg: SVGElement, x1: number, y1: number, x2: number, y2: number, strokeWidth: number, color: string) {
	addLine(svg, x1, y1, x2, y2, strokeWidth/3, color);
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
function randomizeData(originalrows: BallsRow[]) {
	let json=JSON.stringify(originalrows);
	let rows=JSON.parse(json);
	for (let i = 0; i < rows.length; i++) {
		for (let nn = 0; nn < ballsInRow; nn++) {
			rows[i].balls[nn] = Math.floor(Math.random() * 50);
		}
	}
	return rows;
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
			, cellSize / 0.99, '#ffff0099');
	}
}

function drawStat3(svg: SVGElement, rows: BallsRow[]){
	drawLines();
	addRect(svg, rowLen * cellSize + cellSize / 2, 0, rowLen * cellSize, cellSize, '#eee');
	for (let rowNum = 0; rowNum < rowsVisibleCount; rowNum++) {
		addSmallText(svg, 2 * rowLen * cellSize + 2, topShift + (1 + rowNum) * cellSize - 2, rows[rowNum].key);
		for (let colNum = 1; colNum <= rowLen; colNum++) {
			if(ballExists(colNum,rows[rowNum])){
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
	for (let colNum = 1; colNum <= rowLen; colNum++) {
		addSmallText(svg, colNum * cellSize - cellSize, topShift, "" + colNum);
	}
}
function triadExists(ball:number,rowNum:number,dx1:number,dx2:number,rows: BallsRow[]):boolean{
	return ballExists(ball,rows[rowNum]) && ballExists(ball+dx1,rows[rowNum+1]) && ballExists(ball+dx2,rows[rowNum+2]);
}
function triadFills(ball:number,rowNum:number,dx1:number,dx2:number,rows: BallsRow[]):boolean{
	return ballExists(ball+dx1,rows[rowNum+1]) && ballExists(ball+dx2,rows[rowNum+2]);
}
function calcTriads(rowNum:number,dx1:number,dx2:number,rows: BallsRow[]):number{
	let cnt=0;
	for(let ii=0;ii<rowLen;ii++){
		if(triadExists(ii+1,rowNum,dx1,dx2,rows)){
			cnt++;
		}
	}
	return cnt;
}
function calcRowPatterns(rowNum:number,rows: BallsRow[]):number[]{
	let cnts:number[]=[];
	for(let dx1=0;dx1<rowLen;dx1++){
		for(let dx2=0;dx2<rowLen;dx2++){
			cnts.push(calcTriads(rowNum,dx1,dx2,rows));
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
function calcRowFills(rowNum:number,rows: BallsRow[],counts:number[]):{ball:number,fills:{dx1:number,dx2:number}[],summ:number,logr:number}[]{
	let resu:{ball:number,fills:{dx1:number,dx2:number}[],summ:number,logr:number}[]=[];
	for(let nn=0;nn<rowLen;nn++){
		let one:{ball:number,fills:{dx1:number,dx2:number}[],summ:number,logr:number}={ball:nn+1,fills:[],summ:0,logr:0};
		resu.push(one);
		for(let dx1=0;dx1<rowLen;dx1++){
			for(let dx2=0;dx2<rowLen;dx2++){
				if(triadFills(nn+1,rowNum,dx1,dx2,rows)){
					one.fills.push({dx1:dx1,dx2:dx2});
					let cc=counts[dx1*rowLen+dx2]
					one.summ=one.summ+cc*cc;
				}
			}
		}
		one.logr=one.summ*one.summ*one.summ;
	}
	//setWide(resu);
	return resu;
}
function dumpTriads(svg: SVGElement, rows: BallsRow[]){
	for (let rr = 0; rr < rowsVisibleCount; rr++) {
		let precounts=calcRowPatterns(rr+1,rows);
		let calcs=calcRowFills(rr,rows,precounts);
		let minCnt=99999;
		let mxCount=0;
		for(let ii=0;ii<rowLen;ii++){
			if(calcs[ii].logr>mxCount)mxCount=calcs[ii].logr;
			if(calcs[ii].logr<minCnt)minCnt=calcs[ii].logr;
		}
		let df=mxCount-minCnt;
		for(let ii=0;ii<rowLen;ii++){
			let idx=ratioPre*(calcs[ii].logr-minCnt)/df;
			let color='rgba(0,0,255,'+idx+')';
			addRect(svg
					, ii * cellSize -0 * cellSize + 0 * rowLen * cellSize
					, topShift + 0 * cellSize + rr * cellSize
					, cellSize
					, cellSize - 0.1
					, color);
			addRect(svg
					, ii * cellSize -0 * cellSize + 1 * rowLen * cellSize
					, topShift + 0 * cellSize + rr * cellSize
					, cellSize
					, cellSize - 0.1
					, color);
		}
		if(rr==0)console.log(calcs);
	}

}
function fillCells() {
	clearSVGgroup(levelA);
	let slicedrows: BallsRow[] = sliceRows(datarows, skipRowsCount, skipRowsCount + rowsSliceCount);
	dumpTriads(levelA,slicedrows);
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
}
function clickHop() {
	skipRowsCount = Math.round(Math.random() * (datarows.length - 100));
	fillCells();
}
function toggleFirst(){
	showFirstRow=!showFirstRow;
	fillCells();
}
function clickGoSkip(nn: number) {
	skipRowsCount = skipRowsCount + nn;
	if (skipRowsCount < 0) skipRowsCount = 0;
	if (skipRowsCount > datarows.length - 200) skipRowsCount = datarows.length - 200;
	fillCells();
}
function toggleRatioPre(){
	if(ratioPre==0.5)ratioPre=0.75;
	else if(ratioPre==0.75)ratioPre=0.99;
	else ratioPre=0.5;
	fillCells();
}
/////////////////
init();
fillCells();
