var skipRowsCount = 0;
var levelA;
var linesLevel;
var dataBalls;
var datarows;
var showFirstRow = false;
var sversion = 'v1.36 ' + dataName + ': ' + ballsInRow + '/' + rowLen;
var markX = -1;
var markY = -1;
var cellSize = 12;
var topShift = cellSize * 11;
var rowsVisibleCount = 44;
var rowsAvgCount = 5;
//let ratioPre=0.5;
var rowsSliceCount = rowsVisibleCount + rowsAvgCount;
var reduceRatio = 1;
var highLightMode = 0;
//let tailOrder=0;
//let prewide=5;
var calcLen = 9;
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
    //console.log(markLines);
    for (var i = 0; i < markLines.length; i++) {
        //let fy=markLines[i].fromY - skipRowsCount;
        //let ty=markLines[i].toY - skipRowsCount;
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
function calcRowFreqs(rowNum, rows) {
    var resu = [];
    //console.log(rows);
    for (var nn = 0; nn < rowLen; nn++) {
        var one = { ball: nn + 1, fills: [], summ: 0, logr: 0 };
        resu.push(one);
        if (rows.length > rowNum + 1 + calcLen) {
            for (var rr = rowNum + 1; rr < rowNum + 1 + calcLen; rr++) {
                if (ballExists(nn + 0, rows[rr])) {
                    one.summ = one.summ + 0.5;
                }
                if (ballExists(nn + 1, rows[rr])) {
                    one.summ++;
                }
                if (ballExists(nn + 2, rows[rr])) {
                    one.summ = one.summ + 0.5;
                }
            }
            one.logr = one.summ * one.summ;
        }
    }
    return resu;
}
function dumpTriads(svg, rows) {
    var ratioPre = 0.5;
    if (highLightMode == 1) {
        ratioPre = 0;
    }
    else {
        if (highLightMode == 2) {
            ratioPre = 0.75;
        }
    }
    for (var rr = 0; rr < rowsVisibleCount; rr++) {
        if (rr > rows.length - 6)
            break;
        //console.log(rr,rows.length);
        var precounts = calcRowPatterns(rr + 1, rows);
        var calcs = void 0;
        if (highLightMode == 2) {
            calcs = calcRowFreqs(rr, rows);
        }
        else {
            calcs = calcRowFills(rr, rows, precounts);
        }
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
        //if (rr == 0) console.log(calcs);
    }
}
function fillCells() {
    clearSVGgroup(levelA);
    var slicedrows = sliceRows(datarows, skipRowsCount, skipRowsCount + rowsSliceCount + calcLen);
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
    console.log('clickGoSkip', nn, nn * reduceRatio, skipRowsCount, datarows.length);
    if (skipRowsCount + nn * reduceRatio >= 0) {
        if (skipRowsCount + nn * reduceRatio < datarows.length - 200) {
            skipRowsCount = skipRowsCount + nn * reduceRatio;
            //if (skipRowsCount < 0) skipRowsCount = 0;
            //if (skipRowsCount > datarows.length/reduceRatio - 200) skipRowsCount = datarows.length/reduceRatio - 200;
            for (var i = 0; i < markLines.length; i++) {
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
    }
    else {
        if (highLightMode == 1) {
            highLightMode = 2;
        }
        else {
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
    if (reduceRatio < 1)
        reduceRatio = 1;
    /*for (let i = 0; i < markLines.length; i++) {
        markLines[i].fromY=markLines[i].fromY/reduceRatio;
        markLines[i].toY=markLines[i].toY*reduceRatio;
    }*/
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
    var firsts = [];
    for (var ii = 1; ii < slicedrows.length - 1 - 1 - 1; ii++) {
        if (slicedrows[ii + 1]) {
            //console.log(slicedrows[ii], slicedrows[ii].balls[0]);
            firsts.splice(0, 0, 100 + slicedrows[ii].balls[0]);
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
    }
    dumpLineFirst(firsts);
    fillCells();
}
function dumpLineFirst(firsts) {
    console.log(firsts);
    var alpha = 0.5 // overall smoothing component
    , beta = 0.4 // trend smoothing component
    , gamma = 0.6 // seasonal smoothing component
    , period = 4 // # of observations per season
    , m = 1 // # of future observations to forecast
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
function forecast(data, alpha, beta, gamma, period, m) {
    var seasons, seasonal;
    if (!validArgs(data, alpha, beta, gamma, period, m))
        return;
    seasons = data.length / period;
    var st_1 = data[0];
    var bt_1 = initialTrend(data, period);
    seasonal = seasonalIndices(data, period, seasons);
    return calcHoltWinters(data, st_1, bt_1, alpha, beta, gamma, seasonal, period, m);
}
//module.exports = forecast;
function validArgs(data, alpha, beta, gamma, period, m) {
    if (!data.length)
        return false;
    if (m <= 0)
        return false;
    if (m > period)
        return false;
    if (alpha < 0.0 || alpha > 1.0)
        return false;
    if (beta < 0.0 || beta > 1.0)
        return false;
    if (gamma < 0.0 || gamma > 1.0)
        return false;
    return true;
}
function initialTrend(data, period) {
    var sum = 0;
    for (var i = 0; i < period; i++) {
        sum = sum + (data[period + i] - data[i]);
    }
    return sum / (period * period);
}
function seasonalIndices(data, period, seasons) {
    var savg, obsavg, si, i, j;
    savg = Array(seasons);
    obsavg = Array(data.length);
    si = Array(period);
    // zero-fill savg[] and si[]
    for (var i_2 = 0; i_2 < seasons; i_2++) {
        savg[i_2] = 0.0;
    }
    for (var i_3 = 0; i_3 < period; i_3++) {
        si[i_3] = 0.0;
    }
    // seasonal averages
    for (var i_4 = 0; i_4 < seasons; i_4++) {
        for (var j_1 = 0; j_1 < period; j_1++) {
            savg[i_4] = savg[i_4] + data[(i_4 * period) + j_1];
        }
        savg[i_4] = savg[i_4] / period;
    }
    // averaged observations
    for (var i_5 = 0; i_5 < seasons; i_5++) {
        for (var j_2 = 0; j_2 < period; j_2++) {
            obsavg[(i_5 * period) + j_2] = data[(i_5 * period) + j_2] / savg[i_5];
        }
    }
    // seasonal indices
    for (var i_6 = 0; i_6 < period; i_6++) {
        for (var j_3 = 0; j_3 < seasons; j_3++) {
            si[i_6] = si[i_6] + obsavg[(j_3 * period) + i_6];
        }
        si[i_6] = si[i_6] / seasons;
    }
    return si;
}
function calcHoltWinters(data, st_1, bt_1, alpha, beta, gamma, seasonal, period, m) {
    var len = data.length, st = Array(len), // overall smoothing component
    bt = Array(len), // trend smoothing component
    it = Array(len), // seasonal smoothing component
    ft = Array(len), // generated forecast
    i; // reusable idx
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
    for (var i_7 = 2; i_7 < len; i_7++) {
        // overall level smoothing component st[]
        if (i_7 - period >= 0) {
            st[i_7] = ((alpha * data[i_7]) / it[i_7 - period]) + ((1.0 - alpha) * (st[i_7 - 1] + bt[i_7 - 1]));
        }
        else {
            st[i_7] = (alpha * data[i_7]) + ((1.0 - alpha) * (st[i_7 - 1] + bt[i_7 - 1]));
        }
        // trend smoothing component bt[]
        bt[i_7] = (gamma * (st[i_7] - st[i_7 - 1])) + ((1 - gamma) * bt[i_7 - 1]);
        // seasonal smoothing component it[]
        if (i_7 - period >= 0) {
            it[i_7] = ((beta * data[i_7]) / st[i_7]) + ((1.0 - beta) * it[i_7 - period]);
        }
        // generate forecast as ft[]
        if (i_7 + m >= period) {
            ft[i_7 + m] = (st[i_7] + (m * bt[i_7])) * it[i_7 - period + m];
        }
    }
    // -> forecast[]
    return ft;
}
/////////////////
init();
fillCells();
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
