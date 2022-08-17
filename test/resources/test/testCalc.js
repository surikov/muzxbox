var skipRowsCount = 0;
var levelA;
var linesLevel;
var dataBalls;
var datarows;
var showFirstRow = false;
//declare var calcHalfWidth: number;
//declare var calcHeight: number;
var sversion = 'v1.23 ' + dataName + ': ' + ballsInRow + '/' + rowLen;
var markX = -1;
var markY = -1;
var cellSize = 8;
var topShift = cellSize * 11;
var rowsVisibleCount = 80;
var rowsAvgCount = 5;
var rowsSliceCount = rowsVisibleCount + rowsAvgCount;
var markLines = []; //{ fromX: 5, fromY: 6, toX: 33, toY: 22 }];
function dumpInfo(r) {
    var msgp = document.getElementById('msgp');
    msgp.innerText = sversion + ': ' + r;
}
function sliceRows(rows, firstRowNum, lastRowNum) {
    var sliced = [];
    for (var i = firstRowNum; i <= lastRowNum; i++) {
        sliced.push(rows[i]);
    }
    return sliced;
}
function readParseStat(dataBalls) {
    var dlmtr = '  ';
    var rows = [{
            balls: [],
            key: 'next'
        }];
    for (var i_1 = 0; i_1 < ballsInRow; i_1++) {
        rows[0].balls.push(0);
    }
    for (var i = 0; i < dataBalls.length; i++) {
        var txt = dataBalls[i].trim();
        var arr = txt.split(dlmtr);
        if (arr.length > ballsInRow - 1) {
            var row = {
                balls: [],
                key: ''
            };
            for (var k = 0; k < ballsInRow; k++) {
                var ballnum = 1 * arr[k];
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
function ballExists(ball, row) {
    while (ball < 1)
        ball = ball + rowLen;
    while (ball > rowLen)
        ball = ball - rowLen;
    for (var i = 0; i < row.balls.length; i++) {
        if (row.balls[i] == ball) {
            return true;
        }
    }
    return false;
}
function addSmallText(svg, x, y, txt) {
    var svgNS = "http://www.w3.org/2000/svg";
    var nd = document.createTextNode(txt);
    var tx = document.createElementNS(svgNS, 'text');
    tx.setAttributeNS(null, "x", '' + x);
    tx.setAttributeNS(null, "y", '' + y);
    tx.setAttributeNS(null, "font-size", "7");
    tx.setAttribute("fill", '#000000');
    svg.append(tx);
    tx.appendChild(nd);
}
function addColoredText(svg, x, y, txt, color) {
    var svgNS = "http://www.w3.org/2000/svg";
    var nd = document.createTextNode(txt);
    var tx = document.createElementNS(svgNS, 'text');
    tx.setAttributeNS(null, "x", '' + x);
    tx.setAttributeNS(null, "y", '' + y);
    tx.setAttributeNS(null, "font-size", "11");
    tx.setAttribute("fill", color);
    svg.append(tx);
    tx.appendChild(nd);
}
function addLine(svg, x1, y1, x2, y2, strokeWidth, color) {
    var newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    newLine.setAttribute('x1', '' + x1);
    newLine.setAttribute('y1', '' + y1);
    newLine.setAttribute('x2', '' + x2);
    newLine.setAttribute('y2', '' + y2);
    newLine.setAttribute("stroke", color);
    newLine.setAttribute("stroke-width", '' + strokeWidth);
    newLine.setAttribute("stroke-linecap", 'round');
    svg.append(newLine);
}
function addCircle(svg, x, y, r, strokecolor, fillcolor) {
    var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
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
function addRect(svg, x, y, w, h, color) {
    var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', '' + x);
    rect.setAttribute('y', '' + y);
    rect.setAttribute('width', '' + w);
    rect.setAttribute('height', '' + h);
    rect.setAttribute("stroke-width", '0');
    rect.setAttribute("fill", color);
    svg.append(rect);
}
function clearSVGgroup(svgpane) {
    while (svgpane.firstChild) {
        svgpane.removeChild(svgpane.firstChild);
    }
}
function init() {
    levelA = document.getElementById('levelA');
    linesLevel = document.getElementById('linesLevel');
    dataBalls = window[dataName];
    console.log(dataBalls);
    datarows = readParseStat(dataBalls);
    console.log(datarows);
}
function randomizeData(originalrows) {
    var json = JSON.stringify(originalrows);
    var rows = JSON.parse(json);
    for (var i = 0; i < rows.length; i++) {
        for (var nn = 0; nn < ballsInRow; nn++) {
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
    var xx = Math.round((vnt.offsetX - 0.5 * cellSize) / cellSize);
    var yy = skipRowsCount + Math.round((vnt.offsetY - 0.5 * cellSize) / cellSize);
    if (markX < 0) {
        var exists = false;
        for (var i = 0; i < markLines.length; i++) {
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
    }
    else {
        markLines.push({
            fromX: xx, fromY: yy, toX: markX, toY: markY
        });
        markX = -1;
        markY = -1;
    }
    var mark = document.getElementById('lineMark');
    mark.setAttribute('width', cellSize * 1.5);
    mark.setAttribute('height', cellSize * 1.5);
    mark.setAttribute('x', cellSize * markX - 0.25 * cellSize);
    mark.setAttribute('y', cellSize * (markY - skipRowsCount) - 0.25 * cellSize);
    drawLines();
}
function drawLines() {
    clearSVGgroup(linesLevel);
    for (var i = 0; i < markLines.length; i++) {
        addLine(linesLevel, markLines[i].fromX * cellSize + 0.5 * cellSize, (markLines[i].fromY - skipRowsCount) * cellSize + 0.5 * cellSize, markLines[i].toX * cellSize + 0.5 * cellSize, (markLines[i].toY - skipRowsCount) * cellSize + 0.5 * cellSize, cellSize / 2, '#ffff0099');
    }
}
function drawStat3(svg, rows) {
    drawLines();
    addRect(svg, rowLen * cellSize + cellSize / 2, 0, rowLen * cellSize, cellSize, '#ffffff');
    for (var rowNum = 0; rowNum < rowsVisibleCount; rowNum++) {
        addSmallText(svg, 2 * rowLen * cellSize + 2, topShift + (1 + rowNum) * cellSize - 2, rows[rowNum].key);
        for (var colNum = 1; colNum <= rowLen; colNum++) {
            /*let colors: { strokeColor: string, fillColor: string } = fillColor(colNum, rowNum, rows);;
            addRect(svg
                , colNum * cellSize - 1 * cellSize + 0 * rowLen * cellSize
                , topShift + 0 * cellSize + rowNum * cellSize
                , cellSize, cellSize - 0.1, colors.fillColor);
            
            addRect(svg
                , colNum * cellSize - 1 * cellSize + 1 * rowLen * cellSize
                , topShift + 0 * cellSize + rowNum * cellSize
                , cellSize, cellSize - 0.1, colors.fillColor);
                */
            if (ballExists(colNum, rows[rowNum])) {
                if (rowNum > 0 || showFirstRow) {
                    addCircle(svg, colNum * cellSize - 0.5 * cellSize + 0 * rowLen * cellSize, topShift + 0.5 * cellSize + rowNum * cellSize, cellSize / 3 - 0.5, '#003300ff', '#33221100');
                }
                if (rowNum > 0 || showFirstRow) {
                    addCircle(svg, colNum * cellSize - 0.5 * cellSize + 1 * rowLen * cellSize, topShift + 0.5 * cellSize + rowNum * cellSize, cellSize / 3 - 0.5, '#003300ff', '#33221100');
                }
            }
        }
    }
    for (var colNum = 1; colNum <= rowLen; colNum++) {
        addSmallText(svg, colNum * cellSize - cellSize, topShift, "" + colNum);
    }
}
/*
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
}*/
function pairExists(ball, rowNum, dx, dy, rows) {
    return ballExists(ball, rows[rowNum]) && ballExists(ball + dx, rows[rowNum + dy]);
}
function pairFills(ball, rowNum, dx, dy, rows) {
    return ballExists(ball + dx, rows[rowNum + dy]);
}
function calcPairs(rowNum, dx, dy, rows) {
    var cnt = 0;
    for (var ii = 0; ii < rowLen; ii++) {
        if (pairExists(ii + 1, rowNum, dx, dy, rows)) {
            cnt++;
        }
    }
    return cnt;
}
function calcRowPatterns(rowNum, dy, rows) {
    var cnts = [];
    for (var ii = 0; ii < rowLen; ii++) {
        cnts.push(calcPairs(rowNum, ii, dy, rows));
    }
    return cnts;
}
function calcRowFills(rowNum, dy, rows, counts) {
    var resu = [];
    for (var nn = 0; nn < rowLen; nn++) {
        var one = { ball: nn + 1, dy: dy, fills: [], count: 0 };
        resu.push(one);
        for (var dx = 0; dx < rowLen; dx++) {
            if (pairFills(nn + 1, rowNum, dx, dy, rows)) {
                one.fills.push(dx);
                one.count = one.count + counts[dx];
            }
        }
    }
    return resu;
}
function dumpPairs(svg, rows) {
    for (var rr = 0; rr < rowsVisibleCount; rr++) {
        var precounts = calcRowPatterns(rr + 1, 1, rows);
        var calcs = calcRowFills(rr, 1, rows, precounts);
        var minCnt = 99999;
        var mxCount = 0;
        for (var ii = 0; ii < rowLen; ii++) {
            if (calcs[ii].count > mxCount)
                mxCount = calcs[ii].count;
            if (calcs[ii].count < minCnt)
                minCnt = calcs[ii].count;
        }
        var df = mxCount - minCnt;
        //console.log(minCnt,mxCount,df);
        for (var ii = 0; ii < rowLen; ii++) {
            var idx = 0.5 * (calcs[ii].count - minCnt) / df;
            var color = 'rgba(0,0,255,' + idx + ')';
            //console.log(ii,color);
            addRect(svg, ii * cellSize - 0 * cellSize + 0 * rowLen * cellSize, topShift + 0 * cellSize + rr * cellSize, cellSize, cellSize - 0.1, color);
            addRect(svg, ii * cellSize - 0 * cellSize + 1 * rowLen * cellSize, topShift + 0 * cellSize + rr * cellSize, cellSize, cellSize - 0.1, color);
        }
        //console.log(precounts);
        //console.log(calcs);
    }
}
function fillCells() {
    clearSVGgroup(levelA);
    var slicedrows = sliceRows(datarows, skipRowsCount, skipRowsCount + rowsSliceCount);
    dumpPairs(levelA, slicedrows);
    dumpInfo(skipRowsCount);
    drawLines();
    drawStat3(levelA, slicedrows); //, fillColorFunc);
    //console.log(slicedrows);
    //drawTriad(slicedrows);
}
/*
function drawTriad(slicedrows: BallsRow[]){
    console.log(calcHalfWidth,calcHeight);
    let pro:{cnt:number,ball:number,ex:string}[]=[];
    for(let dx=-calcHalfWidth;dx<=calcHalfWidth;dx++){
        for(let dy=1;dy<=calcHeight;dy++){
            let cnt=calcTriad(1,slicedrows,dx,dy);
            if(cnt){
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
    pro.sort((n1,n2) => { return n1.ball - n2.ball; });
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
            , cellSize *0.9, '#0000ff33');
        //console.log(pro[ii]);
    }
    console.log(pro);
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
*/
/*function randomizeCells() {
    
    let slicedrows: BallsRow[] = sliceRows(datarows, skipRowsCount, skipRowsCount + rowsSliceCount);
    let randomrows: BallsRow[]=randomizeData(slicedrows);
    clearSVGgroup(levelA);
    drawStat3(levelA, randomrows, fillColorFunc);
    var msgp: HTMLElement = (document.getElementById('msgp') as any) as HTMLElement;
    msgp.innerText = sversion + ': ' + skipRowsCount+' random';
}*/
function clickHop() {
    skipRowsCount = Math.round(Math.random() * (datarows.length - 100));
    fillCells();
}
function toggleFirst() {
    showFirstRow = !showFirstRow;
    fillCells();
}
function clickGoSkip(nn) {
    skipRowsCount = skipRowsCount + nn;
    if (skipRowsCount < 0)
        skipRowsCount = 0;
    if (skipRowsCount > datarows.length - 200)
        skipRowsCount = datarows.length - 200;
    fillCells();
}
/*function setAvg(nn:number){
    rowsAvgCount=nn;
    rowsSliceCount = rowsVisibleCount + rowsAvgCount;
    fillCells();
}*/
/*
function changeWidth(nn:number){
    calcHalfWidth=calcHalfWidth+nn;
    fillCells();
}
function changeHeight(nn:number){
    calcHeight=calcHeight+nn;
    fillCells();
}
function countNeighbors(ball:number,row:number,far:number,rows:BallsRow[]){
    console.log(rows[row]);
}*/
/////////////////
init();
fillCells();
//countNeighbors(7,0,1,datarows);
