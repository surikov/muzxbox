let skipRowsCount = 0;

var levelA: SVGElement;
var linesLevel: SVGElement;
var dataBalls: string[];
var datarows: BallsRow[];


declare var dataName: string;
declare var rowLen: number;
declare var ballsInRow: number;

let sversion = 'v1.20 '+dataName+': '+ballsInRow+'/'+rowLen;

let markX = -1;
let markY = -1;
let cellSize = 8;
let topShift = cellSize * 11;
let rowsVisibleCount = 80;
let rowsAvgCount = 5;
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
		addSmallText(svg, 2 * rowLen * cellSize + 2, topShift + (1 + rowNum) * cellSize - 2, rows[rowNum].key);
		for (let colNum = 1; colNum <= rowLen; colNum++) {
			let colors: { strokeColor: string, fillColor: string } = fillColor(colNum, rowNum, rows);;
			addRect(svg
				, colNum * cellSize - 1 * cellSize + 0 * rowLen * cellSize
				, topShift + 0 * cellSize + rowNum * cellSize
				, cellSize, cellSize - 0.1, colors.fillColor);
			if (rowNum > 0) {
				addCircle(svg
					, colNum * cellSize - 0.5 * cellSize + 0 * rowLen * cellSize
					, topShift + 0.5 * cellSize + rowNum * cellSize
					, cellSize / 2 - 0.5, colors.strokeColor, '#33221100');
			}
			addRect(svg
				, colNum * cellSize - 1 * cellSize + 1 * rowLen * cellSize
				, topShift + 0 * cellSize + rowNum * cellSize
				, cellSize, cellSize - 0.1, colors.fillColor);
			if (rowNum > 0) {
				addCircle(svg
					, colNum * cellSize - 0.5 * cellSize + 1 * rowLen * cellSize
					, topShift + 0.5 * cellSize + rowNum * cellSize
					, cellSize / 2 - 0.5, colors.strokeColor, '#33221100');
			}
		}
	}
	for (let colNum = 1; colNum <= rowLen; colNum++) {
		addSmallText(svg, colNum * cellSize - cellSize, topShift, "" + colNum);
	}
}
function fillColorFunc(ballNum: number, rowNum: number, rows: BallsRow[]): { strokeColor: string, fillColor: string } {
	let counts: { ballNum: number, count: number }[] = [];
	for (let bb = 0; bb < rowLen; bb++) {
		let ballCount = { ballNum: bb + 1, count: 0 };
		counts.push(ballCount)
		for (let i = 1; i < rowsAvgCount; i++) {
			//if (ballExists(bb + 1, rows[rowNum + i])) {
			//	ballCount.count++;
			//}
			if (ballExists(bb - 1, rows[rowNum + i])) { ballCount.count=ballCount.count+1; }
			if (ballExists(bb + 0, rows[rowNum + i])) { ballCount.count=ballCount.count+2; }
			if (ballExists(bb + 1, rows[rowNum + i])) { ballCount.count=ballCount.count+3; }
			if (ballExists(bb + 2, rows[rowNum + i])) { ballCount.count=ballCount.count+2; }
			if (ballExists(bb + 3, rows[rowNum + i])) { ballCount.count=ballCount.count+1; }
		}
	}
	let groups: { balls: number[], count: number }[] = [];
	for (let ii = 0; ii < counts.length; ii++) {
		let oneCount = counts[ii];
		let flagExists = false;
		for (let kk = 0; kk < groups.length; kk++) {
			if (groups[kk].count == oneCount.count) {
				flagExists = true;
				groups[kk].balls.push(oneCount.ballNum);
				break;
			}
		}
		if (!flagExists) {
			groups.push({ balls: [oneCount.ballNum], count: oneCount.count });
		}
	}
	groups.sort((a: { balls: number[], count: number }, b: { balls: number[], count: number }) => { return a.count - b.count; })
	let orderNum = 0;
	for (let ii = 0; ii < groups.length; ii++) {
		if (groups[ii].balls.indexOf(ballNum) > -1) {
			orderNum = ii;
			break;
		}
	}
	let opac = 0.5 * orderNum / groups.length;
	if (opac > 1) opac = 1;
	let fll = 'rgba(0,0,255,' + opac + ')';
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
	drawStat3(levelA, slicedrows, fillColorFunc);
	//console.log(slicedrows);
	drawTriad(slicedrows);
}
function drawTriad(slicedrows: BallsRow[]){
	let yes1=0;
	let yes2=0;
	let pro:{cnt:number,ball:number,ex:string}[]=[];
	for(let dx=-22;dx<=22;dx++){
		for(let dy=1;dy<=27;dy++){
			let cnt=calcTriad(1,slicedrows,dx,dy);
			if(cnt){
				//console.log(dx,dy,':',cnt);
				for(let bb=0;bb<rowLen;bb++){
					if(	ballExists(bb + 1+1*dx, slicedrows[0 +1*dy]) 
					 && ballExists(bb + 1+2*dx, slicedrows[0 +2*dy])
						){
						let exsts=false;
						for(let pp=0;pp<pro.length;pp++){
							if(pro[pp].ball==bb+1){
								exsts=true;
								pro[pp].cnt++;
								break;
							}
						}
						if(!exsts){
							pro.push({cnt:1,ball:bb+1,ex:''});
						}
					}
				}
			}
		}
	}
	//pro = 
	pro.sort((n1,n2) => { return n1.ball - n2.ball; });
	//console.log(pro);
	for(var ii=0;ii<pro.length;ii++){
		addLine(levelA
			, pro[ii].ball * cellSize - 0.5 * cellSize
			, topShift -1.5* cellSize
			, pro[ii].ball * cellSize - 0.5 * cellSize
			,  topShift -1.5* cellSize-pro[ii].cnt*cellSize+ 0.9 * cellSize
			, cellSize *0.9, '#0000ff66');
		addLine(levelA
			, pro[ii].ball * cellSize - 0.5 * cellSize+rowLen* cellSize
			, topShift -1.5* cellSize
			, pro[ii].ball * cellSize - 0.5 * cellSize+rowLen* cellSize
			,  topShift -1.5* cellSize-pro[ii].cnt*cellSize+ 0.9 * cellSize
			, cellSize *0.9, '#0000ff66');
		console.log(pro[ii]);
	}
}
function drawTriadTest(slicedrows: BallsRow[]){
	let yes1=0;
	let yes2=0;
	let pro:{cnt:number,ball:number,ex:string}[]=[];
	for(let dx=-3;dx<=3;dx++){
		for(let dy=1;dy<=5;dy++){
			let cnt1=calcTriad(1,slicedrows,dx,dy);
			let cnt2=calcTriad(2,slicedrows,dx,dy);
			if(cnt2){
				yes2++;
				if(cnt1){
					yes1++;
				}
				for(let bb=0;bb<rowLen;bb++){
					if(	ballExists(bb + 1+1*dx, slicedrows[1 +1*dy]) 
					 && ballExists(bb + 1+2*dx, slicedrows[1 +2*dy])
						){
						let exsts=false;
						for(let pp=0;pp<pro.length;pp++){
							if(pro[pp].ball==bb+1){
								exsts=true;
								pro[pp].cnt++;
								break;
							}
						}
						if(!exsts){
							pro.push({cnt:1,ball:bb+1,ex:(ballExists(bb + 1+0*dx, slicedrows[1 +0*dy])?'x':'')});
						}
					}
				}
				console.log(dx,dy,':',cnt1,'<',cnt2);
			}
		}
	}
	//pro = 
	pro.sort((n1,n2) => { return n1.ball - n2.ball; });
	console.log(yes1,yes2,pro);
}
function calcTriad(rr:number,rows: BallsRow[],dx:number,dy:number):number{
	let cntr=0;
	for(let bb=0;bb<rowLen;bb++){
		if(		   ballExists(bb + 1+0*dx, rows[rr +0*dy]) 
				&& ballExists(bb + 1+1*dx, rows[rr +1*dy]) 
				&& ballExists(bb + 1+2*dx, rows[rr +2*dy])
			){
			cntr++;
		}
	}

	return cntr;
}
function randomizeCells() {
	
	let slicedrows: BallsRow[] = sliceRows(datarows, skipRowsCount, skipRowsCount + rowsSliceCount);
	let randomrows: BallsRow[]=randomizeData(slicedrows);
	clearSVGgroup(levelA);
	drawStat3(levelA, randomrows, fillColorFunc);
	var msgp: HTMLElement = (document.getElementById('msgp') as any) as HTMLElement;
	msgp.innerText = sversion + ': ' + skipRowsCount+' random';
}
function clickHop() {
	skipRowsCount = Math.round(Math.random() * (datarows.length - 100));
	fillCells();
}
function clickGoSkip(nn: number) {
	skipRowsCount = skipRowsCount + nn;
	if (skipRowsCount < 0) skipRowsCount = 0;
	if (skipRowsCount > datarows.length - 200) skipRowsCount = datarows.length - 200;
	fillCells();
}
function setAvg(nn:number){
	rowsAvgCount=nn;
	rowsSliceCount = rowsVisibleCount + rowsAvgCount;
	fillCells();
}
function countNeighbors(ball:number,row:number,far:number,rows:BallsRow[]){
	console.log(rows[row]);
}

/////////////////
init();
fillCells();
//countNeighbors(7,0,1,datarows);