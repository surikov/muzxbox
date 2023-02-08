var skipRowsCount = 0;
var levelA;
var linesLevel;
var dataBalls;
var datarows;
var showFirstRow = false;
var sversion = 'v1.51 ' + dataName + ': ' + ballsInRow + '/' + rowLen;
var markX = -1;
var markY = -1;
var cellSize = 12;
var topShift = cellSize * 11;
var rowsVisibleCount = 66;
var rowsAvgCount = 5;
var rowsSliceCount = rowsVisibleCount + rowsAvgCount;
var reduceRatio = 1;
var highLightMode = 1;
var calcLen = 9;
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
    addLine(svg, x1, y1, x2, y2, strokeWidth / 2, color);
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
            fromX: xx, fromY: yy, toX: markX, toY: markY, color: '#99990066'
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
function calcRowFills(rowNum, rows, counts) {
    var resu = [];
    for (var nn = 0; nn < rowLen; nn++) {
        var one = { ball: nn + 1, fills: [], summ: 0, logr: 0 };
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
        one.logr = one.summ * one.summ;
    }
    return resu;
}
function calcRowPreFreqs(rowNum, rows) {
    var w0 = 0;
    var w1 = 100;
    var w2 = 75;
    var w3 = 50;
    var w4 = 30;
    var w5 = 10;
    var sums = [
        w4, w3, w2, w1, w1, w1, w2, w3, w4 //
        ,
        w5, w4, w3, w2, w1, w2, w3, w4, w5 //
        ,
        w5, w4, w4, w3, w3, w3, w4, w4, w5 //
        ,
        w0, w5, w4, w4, w4, w4, w4, w5, w0 //
        ,
        w0, w0, w5, w5, w5, w5, w5, w0, w0 //
    ];
    var resu = [];
    for (var nn = 0; nn < rowLen; nn++) {
        var one = { ball: nn + 1, fills: [], summ: 0, logr: 0 };
        resu.push(one);
        if (rows.length > rowNum + 1 + calcLen) {
            for (var ax = -4; ax <= 4; ax++) {
                for (var ay = 0; ay < 5; ay++) {
                    var rr = sums[ax + 4 + 9 * ay];
                    if (ballExists(nn + ax + 1, rows[rowNum + ay + 1])) {
                        one.logr = one.logr + rr;
                    }
                }
            }
        }
    }
    return resu;
}
function calcRowHot(rowNum, rows) {
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
    if (reduceRatio == 1) {
        dumpRowFillsColor(sliceRows(inrows, 2, 100 + 2), '#cccc0066', 0.1);
        dumpRowFillsColor(sliceRows(inrows, 1, 100 + 1), '#66cc0099', -0.1);
    }
    dumpRowFillsColor(inrows, '#006600cc', 0);
}
function dumpRowFillsColor(inrows, color, shiftX) {
    var oldReduceRatio = reduceRatio;
    var arr = [];
    for (var bb = 0; bb < rowLen; bb++) {
        arr.push({ ball: bb + 1, avg: 0, sums: [] });
    }
    for (var thd = 1; thd <= 30; thd++) {
        reduceRatio = thd;
        var rows = sliceRows(inrows, 0, 100);
        var precounts = calcRowPatterns(0 + 1, rows);
        var calcs = void 0;
        calcs = calcRowFills(0, rows, precounts);
        for (var bb = 0; bb < rowLen; bb++) {
            arr[bb].sums.push(calcs[bb].summ);
        }
    }
    var mx = 0;
    var min = 98765;
    for (var bb = 0; bb < rowLen; bb++) {
        arr[bb].avg = 0;
        for (var ii = 0; ii < arr[bb].sums.length; ii++) {
            arr[bb].avg = arr[bb].avg + arr[bb].sums[ii];
        }
        arr[bb].avg = arr[bb].avg / arr[bb].sums.length;
        if (mx < arr[bb].avg)
            mx = arr[bb].avg;
        if (min > arr[bb].avg)
            min = arr[bb].avg;
    }
    //let hr = mx * mx * mx / (topShift / cellSize);
    var hr = (mx - min) / (topShift / cellSize - 2);
    var prehh = (arr[rowLen - 1].avg - min) / hr;
    for (var bb = 0; bb < rowLen; bb++) {
        //------------let hh = arr[bb].avg * arr[bb].avg * arr[bb].avg / hr;
        var hh = (arr[bb].avg - min) / hr;
        markLines.push({
            fromX: bb + shiftX - 1,
            fromY: Math.round((topShift) / cellSize) + skipRowsCount + 0 - prehh - 2,
            toX: bb + shiftX,
            toY: Math.round((topShift) / cellSize) + skipRowsCount - hh - 0 - 2,
            color: color
        });
        markLines.push({
            fromX: bb + shiftX - 1 + rowLen,
            fromY: Math.round((topShift) / cellSize) + skipRowsCount + 0 - prehh - 2,
            toX: bb + shiftX + rowLen,
            toY: Math.round((topShift) / cellSize) + skipRowsCount - hh - 0 - 2,
            color: color
        });
        prehh = hh;
        /*markLines.push({
            fromX: bb + shiftX
            , fromY: Math.round((topShift) / cellSize) + skipRowsCount + 0 - 0 - 2
            , toX: bb + shiftX
            , toY: Math.round((topShift) / cellSize) + skipRowsCount - hh - 0 - 2
            , color: color
        });
        markLines.push({
            fromX: bb + rowLen + shiftX
            , fromY: Math.round((topShift) / cellSize) + skipRowsCount + 0 - 0 - 2
            , toX: bb + rowLen + shiftX
            , toY: Math.round((topShift) / cellSize) + skipRowsCount - hh - 0 - 2
            , color: color
        });*/
    }
    reduceRatio = oldReduceRatio;
    console.log(reduceRatio, arr[0]);
}
function dumpTriads(svg, rows) {
    var ratioPre = 0.99;
    if (highLightMode == 1) {
        ratioPre = 0.33;
    }
    else {
        if (highLightMode == 2) {
            ratioPre = 0.66;
        }
    }
    for (var rr = 0; rr < rowsVisibleCount; rr++) {
        if (rr > rows.length - 6)
            break;
        var calcs = void 0;
        if (highLightMode == 2) {
            calcs = calcRowPreFreqs(rr, rows);
        }
        else {
            if (highLightMode == 1) {
                calcs = calcRowHot(rr, rows);
            }
            else {
                var precounts = calcRowPatterns(rr + 1, rows);
                calcs = calcRowFills(rr, rows, precounts);
            }
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
    }
}
function fillCells() {
    clearSVGgroup(levelA);
    var slicedrows = sliceRows(datarows, skipRowsCount, skipRowsCount + rowsSliceCount + calcLen);
    dumpTriads(levelA, slicedrows);
    dumpInfo(skipRowsCount);
    drawLines();
    drawStat3(levelA, slicedrows);
    var msgp = document.getElementById('stepsize');
    msgp.innerText = '' + reduceRatio;
    msgp = document.getElementById('calcLen');
    msgp.innerText = '' + calcLen;
}
function clickHop() {
    skipRowsCount = Math.round(Math.random() * (datarows.length / reduceRatio - 100));
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
        if (skipRowsCount + nn * reduceRatio < datarows.length - 200) {
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
        if (highLightMode == 1) {
            highLightMode = 2;
        }
        else {
            highLightMode = 0;
        }
    }
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
function moreCalcLen() {
    calcLen = calcLen + 1;
    fillCells();
}
function lessCalcLen() {
    calcLen = calcLen - 1;
    if (calcLen < 3)
        calcLen = 3;
    fillCells();
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
    markLines = [];
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
function dumpStatAll() {
    var idx = Math.floor(Math.random() * rowLen);
    for (var sz = 1; sz <= ballsInRow; sz++) {
        dumpStatIne(idx, sz);
    }
}
function dumpStatIne(idx, sz) {
    console.log('dumpStatAll', idx, sz);
    var count0 = 0;
    var count1 = 0;
    var count2 = 0;
    var count3 = 0;
    var count4 = 0;
    var count5 = 0;
    var count6 = 0;
    var count7 = 0;
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
    console.log(0, count0, Math.round(100 * count0 / datarows.length), '%');
    console.log(1, count1, Math.round(100 * count1 / datarows.length), '%');
    console.log(2, count2, Math.round(100 * count2 / datarows.length), '%');
    console.log(3, count3, Math.round(100 * count3 / datarows.length), '%');
    console.log(4, count4, Math.round(100 * count4 / datarows.length), '%');
    console.log(5, count5, Math.round(100 * count5 / datarows.length), '%');
    console.log(6, count6, Math.round(100 * count6 / datarows.length), '%');
    console.log(7, count7, Math.round(100 * count7 / datarows.length), '%');
}
/////////////////
init();
fillCells();
dumpStatAll();
