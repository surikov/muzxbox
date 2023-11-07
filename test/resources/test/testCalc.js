var skipRowsCount = 0;
var levelA;
var linesLevel;
var dataBalls;
var datarows;
var showFirstRow = true;
var sversion = 'v1.73 ' + dataName + ': ' + ballsInRow + '/' + rowLen;
var markX = -1;
var markY = -1;
var cellSize = 12;
var topShift = cellSize * 21;
var rowsVisibleCount = 66;
var rowsAvgCount = 5;
var rowsSliceCount = rowsVisibleCount + rowsAvgCount;
var reduceRatio = 1;
var highLightMode = 1;
var calcLen = 51;
var markLines = []; //{ fromX: 5, fromY: 6, toX: 33, toY: 22 }];
function dumpInfo(r) {
    var msgp = document.getElementById('msgp');
    msgp.innerText = sversion + ': ' + r;
}
function sliceRows(rows, firstRowNum, lastRowNum) {
    var sliced = [];
    var nn = firstRowNum;
    for (var i = firstRowNum; i <= lastRowNum; i++) {
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
    tx.setAttributeNS(null, "font-size", "9");
    tx.setAttribute("fill", '#000000');
    svg.append(tx);
    tx.appendChild(nd);
}
function addBigText(svg, x, y, txt) {
    var svgNS = "http://www.w3.org/2000/svg";
    var nd = document.createTextNode(txt);
    var tx = document.createElementNS(svgNS, 'text');
    tx.setAttributeNS(null, "x", '' + x);
    tx.setAttributeNS(null, "y", '' + y);
    tx.setAttributeNS(null, "font-size", "12");
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
    if (isNaN(x1) || isNaN(x2) || isNaN(y1) || isNaN(y2)) {
        console.log('composeLine', x1, x2, y1, y2);
    }
    else {
        addLine(svg, x1, y1, x2, y2, strokeWidth / 2, color);
    }
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
    //randomizedatarows();
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
    var newarr = [];
    for (var ii = 0; ii < markLines.length; ii++) {
        if (markLines[ii].manual) {
            newarr.push(markLines[ii]);
        }
    }
    markLines = newarr;
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
            fromX: xx, fromY: yy, toX: markX, toY: markY, color: '#ff000066', manual: true
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
    //console.log('drawLines',markLines);
    clearSVGgroup(linesLevel);
    for (var i = 0; i < markLines.length; i++) {
        composeLine(linesLevel, markLines[i].fromX * cellSize + 0.5 * cellSize, (markLines[i].fromY - skipRowsCount) * cellSize + 0.5 * cellSize, markLines[i].toX * cellSize + 0.5 * cellSize, (markLines[i].toY - skipRowsCount) * cellSize + 0.5 * cellSize, cellSize / 0.99, markLines[i].color); //'#00ff0066');
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
        if (colNum % 10 == 0) {
            addBigText(svg, colNum * cellSize - cellSize * 0.8, topShift - 2, "" + colNum);
            addBigText(svg, (colNum + rowLen) * cellSize - cellSize * 0.8, topShift - 5, "" + colNum);
        }
        else {
            addSmallText(svg, colNum * cellSize - cellSize * 0.8, topShift - 2, "" + colNum);
            addSmallText(svg, (colNum + rowLen) * cellSize - cellSize * 0.8, topShift - 5, "" + colNum);
        }
        composeLine(levelA, colNum * cellSize - cellSize, 0, colNum * cellSize - cellSize, topShift - cellSize, cellSize / 20, '#0000ff66');
        composeLine(levelA, colNum * cellSize - cellSize + rowLen * cellSize, 0, colNum * cellSize - cellSize + rowLen * cellSize, topShift - cellSize, cellSize / 20, '#0000ff66');
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
function calcEmptyColumnDuration(rowNum, rows, counts) {
    var resu = [];
    for (var nn = 0; nn < rowLen; nn++) {
        var one = { ball: nn + 1, fills: [], summ: 0 };
        resu.push(one);
        for (var dx1 = 0; dx1 < rowLen; dx1++) {
            for (var dx2 = 0; dx2 < rowLen; dx2++) {
                if (triadFills(one.ball, rowNum, dx1, dx2, rows)) {
                    one.fills.push({ dx1: dx1, dx2: dx2 });
                    var cc = counts[dx1 * rowLen + dx2];
                    one.summ = one.summ + cc;
                }
            }
        }
        //one.logr = one.summ;
        //if(log){one.logr = one.summ*one.summ;}
        //console.log(rowNum,nn,one);
    }
    return resu;
}
/*
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
}*/
function calcRowPatternsCOunt(rowNum, rows) {
    var resu = [];
    for (var nn = 0; nn < rowLen; nn++) {
        var one = { ball: nn + 1, fills: [], summ: 0, logr: 0 };
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
function dumpRowFills(inrows) {
    console.log('dumpRowFills', inrows);
    /*if (reduceRatio == 1) {
        dumpRowFillsColor(sliceRows(inrows, 2, 100+2), '#cccc0066',0.1);
        dumpRowFillsColor(sliceRows(inrows, 1, 100 + 1), '#66cc0099', -0.1);
    }*/
    if (highLightMode == 1) {
        dumpRowFillsColor(inrows, '#009900cc', 0);
        dumpRowWaitColor(inrows, '#00000033', 0);
    }
    else {
        dumpRowWaitColor(inrows, '#009900cc', 0);
        dumpRowFillsColor(inrows, '#00000033', 0);
    }
}
function dumpRowWaitColor(rows, color, shiftX) {
    //let resu: { ball: number, fills: { dx1: number, dx2: number }[], summ: number, logr: number }[] = [];
    var arr = [];
    var rowNum = 0;
    for (var nn = 0; nn < rowLen; nn++) {
        //let one: { ball: number, fills: { dx1: number, dx2: number }[], summ: number, logr: number } = { ball: nn + 1, fills: [], summ: 0, logr: 0 };
        var one = { ball: nn + 1, summ: 0 };
        arr.push(one);
        for (var rr = rowNum + 1; rr < rowNum + 1 + calcLen; rr++) {
            if (ballExists(nn + 1, rows[rr])) {
                break;
            }
            one.summ++;
        }
    }
    var mx = 0;
    var min = 98765;
    for (var bb = 0; bb < rowLen; bb++) {
        if (mx < arr[bb].summ)
            mx = arr[bb].summ;
        if (min > arr[bb].summ)
            min = arr[bb].summ;
    }
    var hr = (mx - min) / (topShift / cellSize - 2);
    var prehh = (mx - min - (arr[rowLen - 1].summ - min)) / hr;
    for (var bb = 0; bb < rowLen; bb++) {
        var hh = (mx - min - (arr[bb].summ - min)) / hr;
        /*markLines.push({ fromX: bb + shiftX-1
            , fromY: Math.round((topShift) / cellSize) + skipRowsCount + 0 - prehh - 2
            , toX: bb + shiftX
            , toY: Math.round((topShift) / cellSize) + skipRowsCount - hh - 0 - 2
            , color: color,manual:false
        });*/
        markLines.push({
            fromX: bb + shiftX - 1,
            fromY: skipRowsCount + 0 + prehh,
            toX: bb + shiftX,
            toY: skipRowsCount + hh - 0,
            color: color, manual: false
        });
        /*markLines.push({ fromX: bb + shiftX-1+ rowLen
            , fromY: Math.round((topShift) / cellSize) + skipRowsCount + 0 - prehh - 2
            , toX: bb + shiftX+ rowLen
            , toY: Math.round((topShift) / cellSize) + skipRowsCount - hh - 0 - 2
            , color: color,manual:false
        });*/
        markLines.push({
            fromX: bb + shiftX - 1 + rowLen,
            fromY: skipRowsCount + 0 + prehh,
            toX: bb + shiftX + rowLen,
            toY: skipRowsCount + hh - 0,
            color: color, manual: false
        });
        prehh = hh;
    }
    //console.log(arr);
}
function dumpRowFillsColor(rows, color, shiftX) {
    //let oldReduceRatio = reduceRatio;
    //let rows: BallsRow[] = sliceRows(inrows, 0, 100);
    var precounts = calcRowPatterns(0 + 1, rows);
    var ballFills = calcEmptyColumnDuration(0, rows, precounts);
    //console.log('ballFills',ballFills);
    var mx = 0;
    var min = 987654321;
    for (var bb = 0; bb < rowLen; bb++) {
        if (mx < ballFills[bb].summ) {
            mx = ballFills[bb].summ;
        }
        if (min > ballFills[bb].summ) {
            min = ballFills[bb].summ;
        }
    }
    var hr = (mx - min) / (topShift / cellSize - 2);
    var prehh = (mx - min - (ballFills[rowLen - 1].summ - min)) / hr;
    for (var bb = 0; bb < rowLen; bb++) {
        var hh = (mx - min - (ballFills[bb].summ - min)) / hr;
        markLines.push({
            fromX: bb + shiftX - 1,
            fromY: skipRowsCount + 0 + prehh,
            toX: bb + shiftX,
            toY: skipRowsCount + hh - 0,
            color: color, manual: false
        });
        markLines.push({
            fromX: bb + shiftX - 1 + rowLen,
            fromY: skipRowsCount + 0 + prehh,
            toX: bb + shiftX + rowLen,
            toY: skipRowsCount + hh - 0,
            color: color, manual: false
        });
        prehh = hh;
    }
    //reduceRatio = oldReduceRatio;
}
function dumpTriads(svg, rows) {
    var ratioPre = 0.99;
    if (highLightMode == 1) {
        ratioPre = 0.66;
    }
    else {
        if (highLightMode == 2) {
            ratioPre = 0.66;
        }
    }
    console.log('dumpTriads', highLightMode);
    for (var rr = 0; rr < rowsVisibleCount; rr++) {
        if (rr > rows.length - 6)
            break;
        var calcs = void 0;
        //console.log(highLightMode);
        //if (highLightMode == 2) {
        //	calcs = calcRowPreFreqs(rr, rows);
        //} else {
        if (highLightMode == 1) {
            calcs = calcRowPatternsCOunt(rr, rows);
        }
        else {
            var precounts = calcRowPatterns(rr + 1, rows);
            calcs = calcEmptyColumnDuration(rr, rows, precounts);
        }
        //}
        var minCnt = 99999;
        var mxCount = 0;
        for (var ii = 0; ii < rowLen; ii++) {
            if (calcs[ii].summ > mxCount)
                mxCount = calcs[ii].summ;
            if (calcs[ii].summ < minCnt)
                minCnt = calcs[ii].summ;
        }
        var df = mxCount - minCnt;
        for (var ii = 0; ii < rowLen; ii++) {
            var idx = ratioPre * (calcs[ii].summ - minCnt) / df;
            var color = 'rgba(0,0,255,' + idx + ')';
            addRect(svg, ii * cellSize - 0 * cellSize + 0 * rowLen * cellSize, topShift + 0 * cellSize + rr * cellSize, cellSize, cellSize //- 0.1
            , color);
            addRect(svg, ii * cellSize - 0 * cellSize + 1 * rowLen * cellSize, topShift + 0 * cellSize + rr * cellSize, cellSize, cellSize //- 0.1
            , color);
        }
    }
}
function fillCells() {
    clearSVGgroup(levelA);
    var slicedrows = sliceRows(datarows, skipRowsCount, skipRowsCount + rowsSliceCount + calcLen);
    dumpTriads(levelA, slicedrows);
    dumpInfo(skipRowsCount);
    //drawLines();
    drawStat3(levelA, slicedrows);
    var msgp = document.getElementById('stepsize');
    msgp.innerText = '' + reduceRatio;
    msgp = document.getElementById('calcLen');
    msgp.innerText = '' + calcLen;
    //calcRatios(slicedrows);
}
function clickHop() {
    skipRowsCount = Math.round(Math.random() * (datarows.length - reduceRatio * rowsVisibleCount));
    //showFirstRow=false;
    //fillCells();
    addTails();
}
function toggleFirst() {
    showFirstRow = !showFirstRow;
    fillCells();
}
function clickGoSkip(nn) {
    console.log('clickGoSkip', nn, nn * reduceRatio, skipRowsCount, datarows.length);
    if (skipRowsCount + nn * reduceRatio >= 0) {
        if (skipRowsCount + nn * reduceRatio < datarows.length - rowsVisibleCount * reduceRatio) {
            skipRowsCount = skipRowsCount + nn * reduceRatio;
            for (var i = 0; i < markLines.length; i++) {
                markLines[i].fromY = markLines[i].fromY + nn * (reduceRatio - 1);
                markLines[i].toY = markLines[i].toY + nn * (reduceRatio - 1);
            }
            //fillCells();
            addTails();
        }
    }
}
function toggleRatioPre() {
    if (highLightMode == 0) {
        highLightMode = 1;
    }
    else {
        highLightMode = 0;
        //if (highLightMode == 1) {
        //    highLightMode = 2;
        //} else {
        //    highLightMode = 0;
        //}
    }
    //fillCells();
    addTails();
}
function moreReduceRatio() {
    reduceRatio = reduceRatio + 1;
    addTails();
    //fillCells();
}
function lessReduceRatio() {
    reduceRatio = reduceRatio - 1;
    if (reduceRatio < 1)
        reduceRatio = 1;
    //fillCells();
    addTails();
}
function moreCalcLen() {
    calcLen = calcLen + 1;
    //fillCells();
    addTails();
}
function lessCalcLen() {
    calcLen = calcLen - 1;
    if (calcLen < 3)
        calcLen = 3;
    //fillCells();
    addTails();
}
function sobstvennoe(balls) {
    var pre = balls;
    var nxt = [];
    while (1 == 1) {
        nxt = [];
        for (var bb = 1; bb < pre.length; bb++) {
            nxt.push(Math.abs(pre[bb - 1] - pre[bb]));
        }
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
    //markLines = [];
    clearNonManual();
    var slicedrows = sliceRows(datarows, skipRowsCount, skipRowsCount + rowsSliceCount * 2);
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
/*
function dumpStatAll() {
    let idx = Math.floor(Math.random() * rowLen);
    for (let sz = 1; sz <= 22; sz++) {
        dumpStatIne(idx, sz);
    }
    //dumpLongness();
}*/
/*
type Stat123 = {
    dx1: number
    , dx2: number
    , count000: number
    , count100: number
    , ratioX00?: number
    , count001: number
    , count101: number
    , ratioX01?: number
    , count010: number
    , count110: number
    , ratioX10?: number
    , count011: number
    , count111: number
    , ratioX11?: number
    , deep?: number
};
function stat3rows(rr: number, slicedrows: BallsRow[], result: Stat123): void {
    //let result:Stat123={dx1:dx1,dx2:dx2,count000:0,count001:0,count010:0,count011:0,count100:0,count101:0,count110:0,count111:0};
    for (let bb = 0; bb < rowLen; bb++) {
        if ((!ballExists(bb + 1, slicedrows[rr])) && (!ballExists(bb + 1 + result.dx1, slicedrows[rr + 1])) && (!ballExists(bb + 1 + result.dx2, slicedrows[rr + 2]))) result.count000++;
        if ((!ballExists(bb + 1, slicedrows[rr])) && (!ballExists(bb + 1 + result.dx1, slicedrows[rr + 1])) && (ballExists(bb + 1 + result.dx2, slicedrows[rr + 2]))) result.count001++;
        if ((!ballExists(bb + 1, slicedrows[rr])) && (ballExists(bb + 1 + result.dx1, slicedrows[rr + 1])) && (!ballExists(bb + 1 + result.dx2, slicedrows[rr + 2]))) result.count010++;
        if ((!ballExists(bb + 1, slicedrows[rr])) && (ballExists(bb + 1 + result.dx1, slicedrows[rr + 1])) && (ballExists(bb + 1 + result.dx2, slicedrows[rr + 2]))) result.count011++;
        if ((ballExists(bb + 1, slicedrows[rr])) && (!ballExists(bb + 1 + result.dx1, slicedrows[rr + 1])) && (!ballExists(bb + 1 + result.dx2, slicedrows[rr + 2]))) result.count100++;
        if ((ballExists(bb + 1, slicedrows[rr])) && (!ballExists(bb + 1 + result.dx1, slicedrows[rr + 1])) && (ballExists(bb + 1 + result.dx2, slicedrows[rr + 2]))) result.count101++;
        if ((ballExists(bb + 1, slicedrows[rr])) && (ballExists(bb + 1 + result.dx1, slicedrows[rr + 1])) && (!ballExists(bb + 1 + result.dx2, slicedrows[rr + 2]))) result.count110++;
        if ((ballExists(bb + 1, slicedrows[rr])) && (ballExists(bb + 1 + result.dx1, slicedrows[rr + 1])) && (ballExists(bb + 1 + result.dx2, slicedrows[rr + 2]))) result.count111++;
    }
}*/
/*
function stat3lenRows(dx1: number, dx2: number, slicedrows: BallsRow[]): Stat123 {
    let rowStat: Stat123 = { dx1: dx1, dx2: dx2, count000: 0, count001: 0, count010: 0, count011: 0, count100: 0, count101: 0, count110: 0, count111: 0, deep: rowLen };
    //let dx1=3;
    //let dx2=1;
    for (let rr = 1; rr < rowLen; rr++) {
        //let rowStat:Stat123={dx1:0,dx2:0,count000:0,count001:0,count010:0,count011:0,count100:0,count101:0,count110:0,count111:0};
        stat3rows(rr, slicedrows, rowStat);
    }

    return rowStat;
}*/
/*
function statRes1(ball: number, allstat3: Stat123[], slicedrows: BallsRow[]) {
    let avg = 0;
    for (let dx1 = 0; dx1 < rowLen; dx1++) {
        for (let dx2 = 0; dx2 < rowLen; dx2++) {
            if ((ballExists(ball + dx1, slicedrows[1])) && (ballExists(ball + dx2, slicedrows[2]))) {
                //console.log(ball,dx1,dx2,'11');
                avg = avg + allstat3[dx1 * rowLen + dx2].ratioX11;
            } else {
                if ((ballExists(ball + dx1, slicedrows[1])) && (!ballExists(ball + dx2, slicedrows[2]))) {
                    //console.log(ball,dx1,dx2,'10');
                    avg = avg + allstat3[dx1 * rowLen + dx2].ratioX10;
                } else {
                    if ((!ballExists(ball + dx1, slicedrows[1])) && (!ballExists(ball + dx2, slicedrows[2]))) {
                        avg = avg + allstat3[dx1 * rowLen + dx2].ratioX00;
                        //console.log(ball,dx1,dx2,'00');
                    } else {
                        //console.log(ball,dx1,dx2,'01');
                        avg = avg + allstat3[dx1 * rowLen + dx2].ratioX11;
                    }
                }
            }
        }
    }
    avg = avg / (rowLen * rowLen);
    console.log(ball, avg);
}*/
/*
function calcRatios(slicedrows: BallsRow[]) {
    let allstat3: Stat123[] = [];
    for (let dx1 = 0; dx1 < rowLen; dx1++) {
        for (let dx2 = 0; dx2 < rowLen; dx2++) {
            let rowStat: Stat123 = stat3lenRows(dx1, dx2, slicedrows);
            rowStat.ratioX00 = Math.round(100 * rowStat.count100 / (rowStat.count100 + rowStat.count000));
            rowStat.ratioX01 = Math.round(100 * rowStat.count101 / (rowStat.count101 + rowStat.count001));
            rowStat.ratioX10 = Math.round(100 * rowStat.count110 / (rowStat.count110 + rowStat.count010));
            rowStat.ratioX11 = Math.round(100 * rowStat.count111 / (rowStat.count111 + rowStat.count011));
            allstat3.push(rowStat);
        }
    }
    console.log(slicedrows[0], allstat3);
    for (let ball = 1; ball <= rowLen; ball++) {
        statRes1(ball, allstat3, slicedrows);
    }
}*/
function dumpStatIne(idx, sz) {
    //console.log('dumpStatIne', idx, sz);
    var count0 = 0;
    var count1 = 0;
    var count2 = 0;
    var count3 = 0;
    var count4 = 0;
    var count5 = 0;
    var count6 = 0;
    var count7 = 0;
    var stat = { balls: '' + (1 + idx) + '-' + (idx + sz), counts: [] };
    for (var rr = 1; rr < datarows.length; rr++) {
        var count = 0;
        for (var bb = 0; bb < sz; bb++) {
            if (ballExists(bb + 1 + idx, datarows[rr])) {
                count++;
            }
        }
        if (count == 0) {
            count0++;
        }
        if (count == 1) {
            count1++;
        }
        if (count == 2) {
            count2++;
        }
        if (count == 3) {
            count3++;
        }
        if (count == 4) {
            count4++;
        }
        if (count == 5) {
            count5++;
        }
        if (count == 6) {
            count6++;
        }
        if (count == 7) {
            count7++;
        }
    }
    stat.counts[0] = '' + count0 + ': ' + Math.round(100 * count0 / datarows.length) + '%';
    stat.counts[1] = '' + count1 + ': ' + Math.round(100 * count1 / datarows.length) + '%';
    stat.counts[2] = '' + count2 + ': ' + Math.round(100 * count2 / datarows.length) + '%';
    stat.counts[3] = '' + count3 + ': ' + Math.round(100 * count3 / datarows.length) + '%';
    stat.counts[4] = '' + count4 + ': ' + Math.round(100 * count4 / datarows.length) + '%';
    stat.counts[5] = '' + count5 + ': ' + Math.round(100 * count5 / datarows.length) + '%';
    stat.counts[6] = '' + count6 + ': ' + Math.round(100 * count6 / datarows.length) + '%';
    stat.counts[7] = '' + count7 + ': ' + Math.round(100 * count7 / datarows.length) + '%';
    //console.log('dumpStatIne '+(1+ idx)+'-'+(1+ idx+ sz));
    console.log('dumpStatIne', idx, sz, stat);
}
/*
function anotherStat(){
    var stat:{count:number,part:number,other:number}[]=[];
    for(var ball=1;ball<=rowLen;ball++){
        var cuco=1;
        for (let rr = 1; rr < datarows.length; rr++) {
            if (ballExists(ball, datarows[rr])) {
                stat[cuco]=stat[cuco]?stat[cuco]:{count:0,part:0,other:0};
                stat[cuco].count++;
                cuco=1;
            }else{
                cuco++;
            }
        }
    }
    for(var ii=0;ii<stat.length;ii++){
        stat[ii]=stat[ii]?stat[ii]:{count:0,part:0,other:0};
    }
    for(var ii=1;ii<stat.length-1;ii++){
        for(var kk=ii+1;kk<stat.length;kk++){
            stat[ii].other=stat[ii].other+stat[kk].count;
        }
        stat[ii].part=Math.round(1000*stat[ii].count/stat[ii].other)/10;
    }
    
    console.log(stat);
}*/
/*
function dumpLongness(shift:number) {
    //console.log('longness');
    let longness: number[] = [];
    for (var ball = 1; ball <= rowLen; ball++) {
        let nn = 0;
        while (nn < datarows.length && (!ballExists(ball, datarows[nn]))) {
            nn++;
        }
        nn++;
        let cuLen = 0;
        while (nn < datarows.length) {
            if (ballExists(ball+shift, datarows[nn])) {
                longness[cuLen] = longness[cuLen] ? longness[cuLen] : 0;
                longness[cuLen]++;
                cuLen = 0;
            } else {
                cuLen++;
            }
            nn++;
        }
    }
    //console.log(longness);
    let sum = 0;
    for (let ii = 0; ii < longness.length; ii++) {
        longness[ii] = longness[ii] ? longness[ii] : 0;
        sum = sum + longness[ii];
    }
    let stat:string[]=[];
    for (let ii = 0; ii < longness.length; ii++) {
        stat[ii]=''+longness[ii]+': '+ Math.round(100 * longness[ii] / sum) + '%';
        //console.log(ii, longness[ii], Math.round(100 * longness[ii] / sum) + '%');
    }
    console.log('dumpLongness',shift,stat);
}*/
/////////////////
init();
fillCells();
//dumpStatAll();
//anotherStat();
//dumpLongness(-2);
//dumpLongness(-1);
//dumpLongness(0);
//dumpLongness(1);
//dumpLongness(2);
