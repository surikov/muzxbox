var skipRowsCount = 0;
var levelA;
var linesLevel;
var dataBalls;
var datarows;
var showFirstRow = false;
var sversion = 'v1.33 ' + dataName + ': ' + ballsInRow + '/' + rowLen;
var markX = -1;
var markY = -1;
var cellSize = 12;
var topShift = cellSize * 11;
var rowsVisibleCount = 44;
var rowsAvgCount = 5;
var ratioPre = 0.5;
var rowsSliceCount = rowsVisibleCount + rowsAvgCount;
var reduceRatio = 1;
//let tailOrder=0;
//let prewide=5;
var markLines = []; //{ fromX: 5, fromY: 6, toX: 33, toY: 22 }];
function dumpInfo(r) {
    var msgp = document.getElementById('msgp');
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
function sliceRows(rows, firstRowNum, lastRowNum) {
    var sliced = [];
    var nn = firstRowNum;
    for (var i = firstRowNum; i <= lastRowNum; i++) {
        //sliced.push(rows[i]);
        sliced.push(rows[nn]);
        nn = nn + reduceRatio;
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
            row.balls.sort(function (a, b) { return a - b; });
            //console.log(row.balls);
            row.key = dataBalls[i - 1].trim();
            row.key = row.key.replace(':00', ':00 #');
            row.key = row.key.replace(':30', ':30 #');
            rows.push(row);
        }
    }
    return rows;
}
function ballExists(ball, row) {
    if (row) {
        while (ball < 1)
            ball = ball + rowLen;
        while (ball > rowLen)
            ball = ball - rowLen;
        for (var i = 0; i < row.balls.length; i++) {
            if (row.balls[i] == ball) {
                return true;
            }
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
function composeLine(svg, x1, y1, x2, y2, strokeWidth, color) {
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
        composeLine(linesLevel, markLines[i].fromX * cellSize + 0.5 * cellSize, (markLines[i].fromY - skipRowsCount) * cellSize + 0.5 * cellSize, markLines[i].toX * cellSize + 0.5 * cellSize, (markLines[i].toY - skipRowsCount) * cellSize + 0.5 * cellSize, cellSize / 0.99, '#ffff0099');
    }
}
function drawStat3(svg, rows) {
    drawLines();
    addRect(svg, rowLen * cellSize + cellSize / 2, 0, rowLen * cellSize, cellSize, '#eee');
    for (var rowNum = 0; rowNum < rowsVisibleCount; rowNum++) {
        if (rows[rowNum]) {
            addSmallText(svg, 2 * rowLen * cellSize + 2, topShift + (1 + rowNum) * cellSize - 2, rows[rowNum].key);
            for (var colNum = 1; colNum <= rowLen; colNum++) {
                if (ballExists(colNum, rows[rowNum])) {
                    if (rowNum > 0 || showFirstRow) {
                        addCircle(svg, colNum * cellSize - 0.5 * cellSize + 0 * rowLen * cellSize, topShift + 0.5 * cellSize + rowNum * cellSize, cellSize / 5 - 0.5, '#ff0000ff', '#ff0000ff');
                    }
                    if (rowNum > 0 || showFirstRow) {
                        addCircle(svg, colNum * cellSize - 0.5 * cellSize + 1 * rowLen * cellSize, topShift + 0.5 * cellSize + rowNum * cellSize, cellSize / 5 - 0.5, '#ff0000ff', '#ff0000ff');
                    }
                }
            }
        }
    }
    for (var colNum = 1; colNum <= rowLen; colNum++) {
        addSmallText(svg, colNum * cellSize - cellSize, topShift, "" + colNum);
    }
}
function triadExists(ball, rowNum, dx1, dx2, rows) {
    return ballExists(ball, rows[rowNum]) && ballExists(ball + dx1, rows[rowNum + 1]) && ballExists(ball + dx2, rows[rowNum + 2]);
}
function triadFills(ball, rowNum, dx1, dx2, rows) {
    return ballExists(ball + dx1, rows[rowNum + 1]) && ballExists(ball + dx2, rows[rowNum + 2]);
}
function calcTriads(rowNum, dx1, dx2, rows) {
    var cnt = 0;
    //console.log(rowNum,rows.length);
    for (var ii = 0; ii < rowLen; ii++) {
        if (triadExists(ii + 1, rowNum, dx1, dx2, rows)) {
            cnt++;
        }
    }
    return cnt;
}
function calcRowPatterns(rowNum, rows) {
    var cnts = [];
    for (var dx1 = 0; dx1 < rowLen; dx1++) {
        for (var dx2 = 0; dx2 < rowLen; dx2++) {
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
function calcRowFills(rowNum, rows, counts) {
    var resu = [];
    for (var nn = 0; nn < rowLen; nn++) {
        var one = { ball: nn + 1, fills: [], summ: 0, logr: 0 };
        resu.push(one);
        for (var dx1 = 0; dx1 < rowLen; dx1++) {
            for (var dx2 = 0; dx2 < rowLen; dx2++) {
                if (triadFills(nn + 1, rowNum, dx1, dx2, rows)) {
                    one.fills.push({ dx1: dx1, dx2: dx2 });
                    var cc = counts[dx1 * rowLen + dx2];
                    one.summ = one.summ + cc * cc;
                }
            }
        }
        one.logr = one.summ * one.summ * one.summ;
    }
    //setWide(resu);
    return resu;
}
function dumpTriads(svg, rows) {
    for (var rr = 0; rr < rowsVisibleCount; rr++) {
        if (rr > rows.length - 6)
            break;
        //console.log(rr,rows.length);
        var precounts = calcRowPatterns(rr + 1, rows);
        var calcs = calcRowFills(rr, rows, precounts);
        var minCnt = 99999;
        var mxCount = 0;
        for (var ii = 0; ii < rowLen; ii++) {
            if (calcs[ii].logr > mxCount)
                mxCount = calcs[ii].logr;
            if (calcs[ii].logr < minCnt)
                minCnt = calcs[ii].logr;
        }
        var df = mxCount - minCnt;
        for (var ii = 0; ii < rowLen; ii++) {
            var idx = ratioPre * (calcs[ii].logr - minCnt) / df;
            var color = 'rgba(0,0,255,' + idx + ')';
            addRect(svg, ii * cellSize - 0 * cellSize + 0 * rowLen * cellSize, topShift + 0 * cellSize + rr * cellSize, cellSize, cellSize - 0.1, color);
            addRect(svg, ii * cellSize - 0 * cellSize + 1 * rowLen * cellSize, topShift + 0 * cellSize + rr * cellSize, cellSize, cellSize - 0.1, color);
        }
        if (rr == 0)
            console.log(calcs);
    }
}
function fillCells() {
    clearSVGgroup(levelA);
    var slicedrows = sliceRows(datarows, skipRowsCount, skipRowsCount + rowsSliceCount);
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
    console.log('reduceRatio', reduceRatio);
    var msgp = document.getElementById('stepsize');
    msgp.innerText = '' + reduceRatio;
}
function clickHop() {
    console.log(datarows.length, reduceRatio);
    skipRowsCount = Math.round(Math.random() * (datarows.length / reduceRatio - 100));
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
    if (skipRowsCount > datarows.length / reduceRatio - 200)
        skipRowsCount = datarows.length / reduceRatio - 200;
    fillCells();
}
function toggleRatioPre() {
    if (ratioPre == 0.5)
        ratioPre = 0.75;
    else if (ratioPre == 0.75)
        ratioPre = 0.99;
    else
        ratioPre = 0.5;
    fillCells();
}
function moreReduceRatio() {
    reduceRatio = reduceRatio + 1;
    fillCells();
}
function lessReduceRatio() {
    reduceRatio = reduceRatio - 1;
    if (reduceRatio < 1)
        reduceRatio = 1;
    fillCells();
}
function sobstvennoe(balls) {
    //console.log(balls);
    var pre = balls;
    //let prepre:number[]=[];
    var nxt = [];
    while (1 == 1) {
        //console.log(pre,nxt);
        nxt = [];
        for (var bb = 1; bb < pre.length; bb++) {
            nxt.push(Math.abs(pre[bb - 1] - pre[bb]));
        }
        //console.log(nxt);
        if (nxt.length < 2)
            break;
        pre = [];
        for (var bb = 0; bb < nxt.length; bb++) {
            pre[bb] = nxt[bb];
        }
    }
    var r0 = nxt[0];
    if (r0 < 2)
        r0 = -(pre[1] + pre[0]);
    return r0;
}
function addTails() {
    markLines = [];
    var slicedrows = sliceRows(datarows, skipRowsCount, skipRowsCount + rowsSliceCount);
    for (var ii = 1; ii < slicedrows.length - 1 - 1; ii++) {
        markLines.push({
            fromX: slicedrows[ii].balls[0] - 1,
            fromY: Math.round(topShift / cellSize) + skipRowsCount + ii,
            toX: slicedrows[ii + 1].balls[0] - 1,
            toY: Math.round(topShift / cellSize) + skipRowsCount + ii + 1
        });
        markLines.push({
            fromX: slicedrows[ii].balls[ballsInRow - 1] - 1,
            fromY: Math.round(topShift / cellSize) + skipRowsCount + ii,
            toX: slicedrows[ii + 1].balls[ballsInRow - 1] - 1,
            toY: Math.round(topShift / cellSize) + skipRowsCount + ii + 1
        });
        markLines.push({
            fromX: slicedrows[ii].balls[0] - 1 + rowLen,
            fromY: Math.round(topShift / cellSize) + skipRowsCount + ii,
            toX: slicedrows[ii + 1].balls[0] - 1 + rowLen,
            toY: Math.round(topShift / cellSize) + skipRowsCount + ii + 1
        });
        markLines.push({
            fromX: slicedrows[ii].balls[ballsInRow - 1] - 1 + rowLen,
            fromY: Math.round(topShift / cellSize) + skipRowsCount + ii,
            toX: slicedrows[ii + 1].balls[ballsInRow - 1] - 1 + rowLen,
            toY: Math.round(topShift / cellSize) + skipRowsCount + ii + 1
        });
    }
    fillCells();
}
/////////////////
init();
fillCells();
