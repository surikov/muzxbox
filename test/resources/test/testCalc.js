var skipRowsCount = 0;
var levelA;
var linesLevel;
var dataBalls;
var datarows;
var showFirstRow = true;
var sversion = 'v1.143 ' + dataName + ': ' + ballsInRow + '/' + rowLen;
var markX = -1;
var markY = -1;
var cellSize = 12;
var topShift = cellSize * 21;
var rowsVisibleCount = 101;
var rowsAvgCount = 5;
var rowsSliceCount = rowsVisibleCount + rowsAvgCount;
var reduceRatio = 1;
var highLightMode = 1;
var calcLen = 32;
var diffWide = 5;
var blueNotGree = true;
var lastfirst;
var wideRange = false;
var mxdata = [];
var mindata = [];
var mincopy = [];
var sortedBlue = [];
var sortedGreen = [];
var sortedGrey = [];
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
        console.log('wrong composeLine', x1, x2, y1, y2);
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
    datarows = readParseStat(dataBalls);
}
/*
function dumpStatLeftRed(datarows: BallsRow[]) {
    console.log('dumpStatLeftRed', datarows);
    let counts: number[] = [];
    for (let rr = 0; rr <= rowLen; rr++) {
        counts[rr] = 0;
    }

    for (let rr = 0; rr < datarows.length; rr++) {
        let min = 9999;
        for (let bb = 0; bb < datarows[rr].balls.length; bb++) {
            if (min > datarows[rr].balls[bb]) {
                min = datarows[rr].balls[bb];
            }
        }
        counts[min]++;
    }
    let sm = 0;
    for (let rr = 0; rr <= rowLen; rr++) {
        sm = sm + counts[rr];
        console.log(rr, counts[rr], ('' + (100 * counts[rr] / datarows.length) + '%'), ('' + (100 * sm / datarows.length) + '%'));
    }
    //console.log('mins',sm,counts);
}
*/
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
            fromX: xx, fromY: yy, toX: markX, toY: markY, color: '#ff0000ff', manual: true
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
    var strokeWidth = cellSize / 0.99;
    for (var i = 0; i < markLines.length; i++) {
        if (markLines[i].light) {
            strokeWidth = 4;
        }
        else {
            strokeWidth = cellSize / 0.99;
        }
        if (!markLines[i].manual) {
            composeLine(linesLevel, markLines[i].fromX * cellSize + 0.5 * cellSize, (markLines[i].fromY - skipRowsCount) * cellSize + 0.5 * cellSize, markLines[i].toX * cellSize + 0.5 * cellSize, (markLines[i].toY - skipRowsCount) * cellSize + 0.5 * cellSize, strokeWidth //, cellSize / 0.99
            , markLines[i].color); //'#00ff0066');
        }
    }
    strokeWidth = cellSize / 2.99;
    for (var i = 0; i < markLines.length; i++) {
        if (markLines[i].manual) {
            composeLine(linesLevel, markLines[i].fromX * cellSize + 0.5 * cellSize, (markLines[i].fromY - skipRowsCount) * cellSize + 0.5 * cellSize, markLines[i].toX * cellSize + 0.5 * cellSize, (markLines[i].toY - skipRowsCount) * cellSize + 0.5 * cellSize, strokeWidth //, cellSize / 0.99
            , markLines[i].color); //'#00ff0066');
        }
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
                    var topy = topShift + 0.5 * cellSize + rowNum * cellSize;
                    var szz = cellSize / 3 - 0.5;
                    var clr = '#ff000066';
                    if (rowNum == 0) {
                        topy = topy - 1.5 * cellSize;
                        szz = cellSize / 3 - 0.5;
                        clr = '#00ff00ff';
                    }
                    if (rowNum > 0 || showFirstRow) {
                        addCircle(svg, colNum * cellSize - 0.5 * cellSize + 0 * rowLen * cellSize, topy //topShift + 0.5 * cellSize + rowNum * cellSize
                        , szz, clr, clr);
                    }
                    if (rowNum > 0 || showFirstRow) {
                        addCircle(svg, colNum * cellSize - 0.5 * cellSize + 1 * rowLen * cellSize, topy //topShift + 0.5 * cellSize + rowNum * cellSize
                        , szz, clr, clr);
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
function calculateBallTriadChain(rowNum, rows, counts) {
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
        one.logr = one.summ;
    }
    return resu;
}
function calculateBallFrequency(rowNum, rows) {
    var resu = [];
    for (var nn = 0; nn < rowLen; nn++) {
        var one = { ball: nn + 1, fills: [], summ: 0, logr: 0 };
        resu.push(one);
        for (var rr = rowNum + 1; rr < rowNum + 1 + calcLen; rr++) {
            if (ballExists(nn + 1, rows[rr])) {
                //one.summ++;
                break;
            }
            one.summ++;
        }
        var cntbl = 1;
        for (var rr = rowNum + 1; rr < rowNum + 1 + 50; rr++) {
            if (ballExists(nn + 1, rows[rr])) {
                cntbl++;
            }
        }
        one.logr = one.summ + 1 / cntbl;
    }
    return resu;
}
function calcEmptyLineDuration(shift, ball, from, rows) {
    var row = from;
    var count = 0;
    var balColumn = ball;
    while ((!ballExists(balColumn, rows[row])) && row + 2 < rows.length) {
        count++;
        balColumn = balColumn + shift;
        row++;
    }
    return count;
}
function dumpInfo2(id, text) {
    var span = document.getElementById(id);
    span.innerText = text;
}
function countInfo(inrows) {
    var diff = 7;
    console.log('countInfo', diff, inrows[0]);
    var smm = [];
    for (var ii = 0; ii < rowLen; ii++) {
        var cc = 0;
        for (var shift = -diff; shift <= diff; shift++) {
            cc = cc + calcEmptyLineDuration(shift, ii + 1, 1, inrows);
        }
        var fl = '   ';
        if (ballExists(ii + 1, inrows[0])) {
            fl = ' * ';
        }
        smm.push({ ball: ii + 1, sm: cc, xst: fl, sh: diff });
    }
    for (var kk = 0; kk < smm.length; kk++) {
        var len = Math.round(5 * smm[kk].sm / (diff + diff + 1));
        var fl = '  ';
        if (showFirstRow) {
            if (ballExists(smm[kk].ball, inrows[0])) {
                fl = '* ';
            }
        }
        for (var nn = 0; nn < len; nn++) {
            fl = fl + '-';
        }
        fl = fl + ' ' + len + ':' + smm[kk].ball;
        console.log(fl);
    }
    smm.sort(function (a, b) {
        return a.sm - b.sm;
    });
    console.log(smm);
}
function dumpRowFills(inrows) {
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
    var lbl = '';
    //greyStat = [];
    var grey2 = '#33333333';
    var grey = '#333333ff';
    for (var rr = 0; rr < rowsVisibleCount; rr++) {
        var arr = [];
        for (var nn = 0; nn < rowLen; nn++) {
            var one = { ball: nn + 1, summ: 0 };
            arr.push(one);
            for (var shift = -diffWide; shift <= diffWide; shift++) {
                one.summ = one.summ + calcEmptyLineDuration(shift, nn + 1, rr + 1, rows);
            }
        }
        makeWader(arr);
        var mx = 0;
        var min = 98765;
        //console.log(rr,arr);
        for (var bb = 0; bb < rowLen; bb++) {
            if (mx < arr[bb].summ)
                mx = arr[bb].summ;
            if (min > arr[bb].summ)
                min = arr[bb].summ;
        }
        var hr = (mx - min) / (topShift / cellSize - 2);
        var prehh = (mx - min - (arr[rowLen - 1].summ - min)) / hr;
        var first = arr.map(function (x) { return x; });
        first.sort(function (aa, bb) { return bb.summ - aa.summ; });
        if (rr == 0) {
            sortedGrey = [];
            for (var ff = 0; ff < first.length; ff++) {
                sortedGrey[ff] = first[ff].ball;
            }
        }
        var begin = -1;
        var end = -1;
        var begin2 = -1;
        var end2 = -1;
        for (var kk = 0; kk < first.length; kk++) {
            if (ballExists(first[kk].ball, rows[rr])) {
                if (showFirstRow || rr > 0) {
                    //lbl = lbl + padLen('[' + first[kk].ball+']',4);
                    lbl = lbl + '[' + pad0('' + first[kk].ball, 2) + ']';
                    end = kk;
                    if (begin == -1) {
                        begin = kk;
                    }
                }
                else {
                    //lbl = lbl + padLen(' ' + first[kk].ball,4);
                    lbl = lbl + ' ' + pad0('' + first[kk].ball, 2) + ' ';
                }
            }
            else {
                //lbl = lbl +padLen(' ' + first[kk].ball,4);
                lbl = lbl + ' ' + pad0('' + first[kk].ball, 2) + ' ';
            }
        }
        for (var kk = 0; kk < first.length; kk++) {
            if (ballExists(first[kk].ball, rows[rr])) {
                if (showFirstRow || rr > 0) {
                    if (kk < end)
                        end2 = kk;
                    if (begin2 == -1 && kk > begin) {
                        begin2 = kk;
                    }
                }
            }
        }
        lbl = padLen('' + padLen('' + begin, 2) + ':' + padLen('' + end, 2) + '(' + padLen('' + (rowLen - end - 1), 2) + '): grey', 20) + lbl;
        if (rr == 0) {
            //console.log(lbl);
            dumpInfo2('statgrey', lbl);
        }
        var yyy = rowsVisibleCount + 22 + 0.66 * rr + skipRowsCount;
        var xxx = 2 * rowLen / 2;
        if (showFirstRow || rr > 0) {
            markLines.push({ fromX: xxx, fromY: yyy, toX: xxx + begin2 / 2, toY: yyy, color: grey2, manual: false });
            markLines.push({ fromX: xxx + end2 / 2, fromY: yyy, toX: xxx + (rowLen - 1) / 2, toY: yyy, color: grey2, manual: false });
            markLines.push({ fromX: xxx, fromY: yyy, toX: xxx + begin / 2, toY: yyy, color: grey, manual: false });
            markLines.push({ fromX: xxx + end / 2, fromY: yyy, toX: xxx + (rowLen - 1) / 2, toY: yyy, color: grey, manual: false });
        }
    }
}
function makeWader(ballFills) {
    if (wideRange) {
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
        var middle = (mx - min) / 2 + min;
        var sorted = ballFills.map(function (x) { return x; });
        sorted.sort(function (aa, bb) { return bb.summ - aa.summ; });
        var center = sorted[Math.round((sorted.length - 1) / 2)].summ - min;
        for (var bb = 0; bb < rowLen; bb++) {
            ballFills[bb].summ = ballFills[bb].summ - center;
            var sig = ballFills[bb].summ > 0 ? 1 : -1;
            ballFills[bb].summ = sig * ballFills[bb].summ * ballFills[bb].summ;
        }
    }
}
function dumpRowFillsColor(rows, color, shiftX) {
    var green2 = '#00990033';
    var green = '#009900ff';
    var lbl = '';
    //console.log(lbl);
    //greenStat = [];
    for (var rr = 0; rr < rowsVisibleCount; rr++) {
        var precounts = calcRowPatterns(rr + 1, rows);
        var ballFills = calculateBallTriadChain(rr, rows, precounts);
        makeWader(ballFills);
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
        //console.log(ballFills);
        var first = ballFills.map(function (x) { return x; });
        first.sort(function (aa, bb) { return bb.summ - aa.summ; });
        if (rr == 0) {
            sortedGreen = [];
            for (var ff = 0; ff < first.length; ff++) {
                sortedGreen[ff] = first[ff].ball;
            }
        }
        var begin = -1;
        var end = -1;
        var begin2 = -1;
        var end2 = -1;
        for (var kk = 0; kk < first.length; kk++) {
            if (ballExists(first[kk].ball, rows[rr])) {
                if (showFirstRow || rr > 0) {
                    //lbl = lbl + padLen('[' + first[kk].ball+']',4);
                    lbl = lbl + '[' + pad0('' + first[kk].ball, 2) + ']';
                    end = kk;
                    if (begin == -1) {
                        begin = kk;
                    }
                }
                else {
                    //lbl = lbl + padLen( ' '+first[kk].ball,4);
                    lbl = lbl + ' ' + pad0('' + first[kk].ball, 2) + ' ';
                }
            }
            else {
                //lbl = lbl +padLen( ' '+first[kk].ball,4);
                lbl = lbl + ' ' + pad0('' + first[kk].ball, 2) + ' ';
            }
        }
        for (var kk = 0; kk < first.length; kk++) {
            if (ballExists(first[kk].ball, rows[rr])) {
                if (showFirstRow || rr > 0) {
                    if (kk < end)
                        end2 = kk;
                    if (begin2 == -1 && kk > begin) {
                        begin2 = kk;
                    }
                }
            }
        }
        lbl = padLen('' + padLen('' + begin, 2) + ':' + padLen('' + end, 2) + '(' + padLen('' + (rowLen - end - 1), 2) + '): green', 20) + lbl;
        //console.log(lbl);
        if (rr == 0) {
            dumpInfo2('statgreen', lbl);
        }
        var yyy = rowsVisibleCount + 22 + 0.66 * rr + skipRowsCount;
        var xxx = 1 * rowLen / 2;
        //if (rr % 2) markLines.push({ fromX: xxx, fromY: yyy, toX: xxx + rowLen / 2, toY: yyy, color: '#00000011', manual: false });
        if (showFirstRow || rr > 0) {
            markLines.push({ fromX: xxx, fromY: yyy, toX: xxx + begin2 / 2, toY: yyy, color: green2, manual: false });
            markLines.push({ fromX: xxx + end2 / 2, fromY: yyy, toX: xxx + (rowLen - 1) / 2, toY: yyy, color: green2, manual: false });
            markLines.push({ fromX: xxx, fromY: yyy, toX: xxx + begin / 2, toY: yyy, color: green, manual: false });
            markLines.push({ fromX: xxx + end / 2, fromY: yyy, toX: xxx + (rowLen - 1) / 2, toY: yyy, color: green, manual: false });
        }
    }
}
function dumpTriads(svg, rows) {
    var ratioPre = 0.99; //0.99;
    var red = '#ff6633ff';
    var red2 = '#ff663366';
    var blue2 = '#3333ff33';
    var blue = '#3333ffff';
    var mgnt = '#000000ff';
    var blueLeftRight = [];
    for (var rr = 0; rr < rowsVisibleCount; rr++) {
        if (rr > rows.length - 6)
            break;
        var calcs = void 0;
        if (highLightMode == 1) {
            calcs = calculateBallFrequency(rr, rows);
        }
        else {
            var precounts = calcRowPatterns(rr + 1, rows);
            calcs = calculateBallTriadChain(rr, rows, precounts);
        }
        makeWader(calcs);
        var minCnt = 99999;
        var mxCount = 0;
        for (var ii = 0; ii < rowLen; ii++) {
            if (calcs[ii].summ > mxCount)
                mxCount = calcs[ii].summ;
            if (calcs[ii].summ < minCnt)
                minCnt = calcs[ii].summ;
        }
        var df = mxCount - minCnt;
        var first = calcs.map(function (x) { return x; });
        var lbl = "";
        first.sort(function (aa, bb) { return aa.logr - bb.logr; });
        if (rr == 0) {
            sortedBlue = [];
            for (var ff = 0; ff < first.length; ff++) {
                sortedBlue[ff] = first[ff].ball;
            }
        }
        lbl = '';
        var begin1 = -1;
        var end = -1;
        var begin2 = -1;
        var end2 = -1;
        for (var kk = 0; kk < first.length; kk++) {
            if (ballExists(first[kk].ball, rows[rr])) {
                if (showFirstRow || rr > 0) {
                    lbl = '[' + pad0('' + first[kk].ball, 2) + ']' + lbl;
                    end = kk;
                    if (begin1 == -1) {
                        begin1 = kk;
                    }
                }
                else {
                    lbl = ' ' + pad0('' + first[kk].ball, 2) + ' ' + lbl;
                }
            }
            else {
                lbl = ' ' + pad0('' + first[kk].ball, 2) + ' ' + lbl;
            }
        }
        for (var kk = 0; kk < first.length; kk++) {
            if (ballExists(first[kk].ball, rows[rr])) {
                if (showFirstRow || rr > 0) {
                    if (kk < end) {
                        end2 = kk;
                    }
                    if (begin2 == -1 && kk > begin1) {
                        begin2 = kk;
                    }
                }
            }
        }
        lbl = padLen('' + padLen('' + (rowLen - end - 1), 2) + ':' + padLen('' + (rowLen - begin1 - 1), 2) + '(' + padLen('' + begin1, 2) + '): blue ', 20) + lbl;
        if (rr == 0) {
            dumpInfo2('statblue', lbl);
        }
        /*
                if (rr == 1) {
                    let leftNum = -1;
                    let rightNum = 0;
                    for (let kk = 0; kk < first.length; kk++) {
                        if (ballExists(first[kk].ball, rows[rr])) {
                            rightNum = kk;
                            if (leftNum < 0) {
                                leftNum = kk;
                            }
                        }
                    }
                    let leftStart = rowLen - rightNum;
                    let leftBall = first[rightNum].ball;
                    let rightEnd = rowLen - leftNum;
                    let rightBall = first[leftNum].ball;
                    console.log('preblue', leftStart, '>', rightEnd);
                }
        */
        var yyy = rowsVisibleCount + 22 + 0.66 * rr + skipRowsCount;
        var xxx = 0 * rowLen / 2;
        if (showFirstRow || rr > 0) {
            var x2 = xxx + (rowLen - 1) / 2;
            markLines.push({ fromX: x2, fromY: yyy, toX: x2 - begin2 / 2, toY: yyy, color: blue2, manual: false });
            markLines.push({ fromX: xxx, fromY: yyy, toX: x2 - end2 / 2, toY: yyy, color: blue2, manual: false });
            markLines.push({ fromX: x2, fromY: yyy, toX: x2 - begin1 / 2, toY: yyy, color: blue, manual: false });
            markLines.push({ fromX: xxx, fromY: yyy, toX: x2 - end / 2, toY: yyy, color: blue, manual: false });
        }
        //console.log(begin1,end);
        blueLeftRight.push({ left: rowLen - end, right: begin1 });
        if (showFirstRow || rr > 0) {
            begin1 = rowLen + 1;
            end = 0;
            var begin2_1 = rowLen + 1;
            var end2_1 = 0;
            for (var kk = 0; kk < rows[rr].balls.length; kk++) {
                if (rows[rr].balls[kk] < begin1)
                    begin1 = rows[rr].balls[kk];
                if (rows[rr].balls[kk] > end)
                    end = rows[rr].balls[kk];
            }
            for (var kk = 0; kk < rows[rr].balls.length; kk++) {
                if (rows[rr].balls[kk] < begin2_1 && rows[rr].balls[kk] > begin1)
                    begin2_1 = rows[rr].balls[kk];
                if (rows[rr].balls[kk] > end2_1 && rows[rr].balls[kk] < end)
                    end2_1 = rows[rr].balls[kk];
            }
            begin1--;
            end--;
            begin2_1--;
            end2_1--;
            yyy = rowsVisibleCount + 22 + 0.66 * rr + skipRowsCount;
            xxx = 3 * rowLen / 2;
            markLines.push({ fromX: xxx, fromY: yyy, toX: xxx + begin2_1 / 2, toY: yyy, color: red2, manual: false });
            markLines.push({ fromX: xxx + end2_1 / 2, fromY: yyy, toX: xxx + (rowLen - 1) / 2, toY: yyy, color: red2, manual: false });
            markLines.push({ fromX: xxx, fromY: yyy, toX: xxx + begin1 / 2, toY: yyy, color: red, manual: false });
            markLines.push({ fromX: xxx + end / 2, fromY: yyy, toX: xxx + (rowLen - 1) / 2, toY: yyy, color: red, manual: false });
        }
        /*
                for (let ii = 0; ii < rowLen; ii++) {
                    let idx = ratioPre * (calcs[ii].summ - minCnt) / df;
                    let color = 'rgba(0,0,255,' + idx + ')';
                    //color='rgba(0,0,255,0.5)';
        
                    addRect(svg
                        , ii * cellSize - 0 * cellSize + 0 * rowLen * cellSize
                        , topShift + 0 * cellSize + rr * cellSize
                        , cellSize
                        , cellSize //- 0.1
                        , color);
                    addRect(svg
                        , ii * cellSize - 0 * cellSize + 1 * rowLen * cellSize
                        , topShift + 0 * cellSize + rr * cellSize
                        , cellSize
                        , cellSize //- 0.1
                        , color);
        
                }
        */
        if (blueNotGree) {
            paintCellsBlue(ratioPre, calcs, minCnt, svg, df, rr);
        }
        else {
            paintCellsGreen(svg, rr, rows);
        }
        //paintCellsGreen(ratioPre, calcs, minCnt, svg, df, rr, rows);
    }
    var szDiff = 6;
    for (var mmm = 0; mmm < 98 - szDiff; mmm++) {
        var blueLeftDiffSumm = 0;
        var blueRighDiffSumm = 0;
        for (var ii = 1; ii < szDiff; ii++) {
            blueLeftDiffSumm = blueLeftDiffSumm + Math.abs(blueLeftRight[mmm + ii].left - blueLeftRight[mmm + ii + 1].left);
            blueRighDiffSumm = blueRighDiffSumm + Math.abs(blueLeftRight[mmm + ii].right - blueLeftRight[mmm + ii + 1].right);
        }
        blueLeftDiffSumm = blueLeftDiffSumm / szDiff;
        blueRighDiffSumm = blueRighDiffSumm / szDiff;
        //var span: HTMLElement = (document.getElementById('statdump') as any) as HTMLElement;
        //span.innerText = '' + szDiff + ": blue diff: " + Math.round(blueLeftDiffSumm) + ' | ' + Math.round(blueRighDiffSumm);
        //console.log(mmm, Math.round(blueLeftDiffSumm), Math.round(blueRighDiffSumm));
        var yyy = rowsVisibleCount + 22 + 0.66 * mmm + skipRowsCount + 0.33;
        var xxx = 0 * rowLen / 2;
        var invLeftWidth = blueLeftDiffSumm * 1;
        var invRightWidth = blueRighDiffSumm * 1;
        //console.log(mmm, invLeftWidth, invRightWidth);
        markLines.push({ fromX: xxx, fromY: yyy, toX: xxx + invLeftWidth, toY: yyy, color: mgnt, manual: false, light: true });
        markLines.push({ fromX: xxx + rowLen / 2 - invRightWidth, fromY: yyy, toX: xxx + rowLen / 2, toY: yyy, color: mgnt, manual: false, light: true });
    }
}
function paintCellsBlue(ratioPre, calcs, minCnt, svg, df, rr) {
    for (var ii = 0; ii < rowLen; ii++) {
        var idx = ratioPre * (calcs[ii].summ - minCnt) / df;
        //let color = 'rgba(0,0,255,' + idx + ')';
        var colorP = Math.floor(255 * (1 - idx));
        var color = 'rgba(' + colorP + ',' + colorP + ',255)';
        //color='rgba(0,0,255,0.5)';
        addRect(svg, ii * cellSize - 0 * cellSize + 0 * rowLen * cellSize, topShift + 0 * cellSize + rr * cellSize, cellSize, cellSize //- 0.1
        , color);
        addRect(svg, ii * cellSize - 0 * cellSize + 1 * rowLen * cellSize, topShift + 0 * cellSize + rr * cellSize, cellSize, cellSize //- 0.1
        , color);
    }
}
function paintCellsGreen(//ratioPre: number
//, calcs: { ball: number, fills: { dx1: number, dx2: number }[], summ: number, logr: number }[]
//, minCnt: number
svg
//, df: number
, rr, rows) {
    for (var ii = 0; ii < rowLen; ii++) {
        var idx = 0;
        var stepColor = 4 * ballsInRow;
        for (var kk = 1; kk <= stepColor; kk++) {
            if (ballExists(ii + 1, rows[rr + kk])) {
                idx = idx + 4 * ballsInRow / kk;
            }
        }
        idx = 1 - idx / ballsInRow;
        //idx = ballsInRow * (idx * idx) / (stepColor * stepColor);
        //console.log(idx);
        //let color = 'rgba(0,0,255,' + idx + ')';
        //let colorP = Math.floor(255 * (1 - idx));
        //colorP = colorP * colorP / 255;
        //if (colorP < 0) colorP = 0;
        //if (colorP > 150) colorP = 150;
        if (idx < 0)
            idx = 0;
        if (idx > 1)
            idx = 1;
        var color = 'rgba(0,200,0,' + idx + ')';
        //color='rgba(0,0,255,0.5)';
        addRect(svg, ii * cellSize - 0 * cellSize + 0 * rowLen * cellSize, topShift + 0 * cellSize + rr * cellSize, cellSize, cellSize //- 0.1
        , color);
        addRect(svg, ii * cellSize - 0 * cellSize + 1 * rowLen * cellSize, topShift + 0 * cellSize + rr * cellSize, cellSize, cellSize //- 0.1
        , color);
    }
}
function roundDown(num, base) {
    return Math.floor(num / base) * base;
}
function fillCells() {
    clearSVGgroup(levelA);
    var slicedrows = sliceRows(datarows, skipRowsCount, skipRowsCount + rowsSliceCount + calcLen);
    dumpTriads(levelA, slicedrows);
    dumpInfo(skipRowsCount);
    var len3 = 0.5 * rowLen * cellSize / 3;
    addRect(levelA, len3, topShift + (1 + rowsVisibleCount) * cellSize, len3, rowsVisibleCount * cellSize, '#eee');
    addRect(levelA, rowLen * cellSize / 2 + len3, topShift + (1 + rowsVisibleCount) * cellSize, len3, rowsVisibleCount * cellSize, '#eee');
    addRect(levelA, rowLen * cellSize + len3, topShift + (1 + rowsVisibleCount) * cellSize, len3, rowsVisibleCount * cellSize, '#eee');
    addRect(levelA, 3 * rowLen * cellSize / 2 + len3, topShift + (1 + rowsVisibleCount) * cellSize, len3, rowsVisibleCount * cellSize, '#eee');
    drawStat3(levelA, slicedrows);
    var msgp = document.getElementById('stepsize');
    msgp.innerText = '' + reduceRatio;
    msgp = document.getElementById('calcWide');
    msgp.innerText = '' + diffWide;
}
function clickToggleMode() {
    blueNotGree = !blueNotGree;
    addTails();
}
function clickHop() {
    skipRowsCount = Math.round(Math.random() * (datarows.length - reduceRatio * rowsVisibleCount));
    addTails();
}
function toggleFirst() {
    showFirstRow = !showFirstRow;
    addTails();
}
function toggleWide() {
    wideRange = !wideRange;
    addTails();
}
function clickGoSkip(nn) {
    if (skipRowsCount + nn * reduceRatio >= 0) {
        if (skipRowsCount + nn * reduceRatio < datarows.length - rowsVisibleCount * reduceRatio) {
            skipRowsCount = skipRowsCount + nn * reduceRatio;
            for (var i = 0; i < markLines.length; i++) {
                markLines[i].fromY = markLines[i].fromY + nn * (reduceRatio - 1);
                markLines[i].toY = markLines[i].toY + nn * (reduceRatio - 1);
            }
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
    }
    addTails();
}
function moreReduceRatio() {
    reduceRatio = reduceRatio + 1;
    addTails();
}
function lessReduceRatio() {
    reduceRatio = reduceRatio - 1;
    if (reduceRatio < 1)
        reduceRatio = 1;
    addTails();
}
function moreCalcLen() {
    calcLen = calcLen + 1;
    addTails();
}
function lessCalcLen() {
    calcLen = calcLen - 1;
    if (calcLen < 3)
        calcLen = 3;
    addTails();
}
function moreWide() {
    diffWide = diffWide + 1;
    addTails();
}
function lessWide() {
    diffWide = diffWide - 1;
    if (diffWide < 0)
        diffWide = 0;
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
function padLen(txt, sz) {
    var len = txt.length;
    var add = 0;
    if (len < sz) {
        add = sz - len;
    }
    var rez = txt;
    for (var ii = 0; ii < add; ii++) {
        rez = rez + ' ';
    }
    //console.log(rez,add);
    return rez;
}
function pad0(txt, sz) {
    var len = txt.length;
    var add = 0;
    if (len < sz) {
        add = sz - len;
    }
    var rez = '';
    for (var ii = 0; ii < add; ii++) {
        rez = rez + '0';
    }
    rez = rez + txt;
    return rez;
}
function resetNumbs() {
    var lbl = ' ';
    for (var ii = 0; ii < rowLen; ii++) {
        lbl = lbl + pad0('' + (1 + ii), 2);
        lbl = lbl + '  ';
    }
    dumpInfo2('statnums', padLen('', 20) + lbl);
}
function addTails() {
    clearNonManual();
    var slicedrows = sliceRows(datarows, skipRowsCount, skipRowsCount + rowsSliceCount * 2);
    lastfirst = slicedrows[0];
    dumpRowFills(slicedrows);
    fillCells();
    mindata = [];
    mxdata = [];
    for (var ii = 0; ii < rowLen; ii++) {
        var blue = rowLen - sortedBlue.indexOf(ii + 1) - 1;
        var green = sortedGreen.indexOf(ii + 1);
        var black = sortedGrey.indexOf(ii + 1);
        var blueGreenDiff = Math.abs(blue - green);
        var greenBlackDiff = Math.abs(green - black);
        var blackBlueDiff = Math.abs(black - blue);
        var mx = Math.max(blueGreenDiff, greenBlackDiff, blackBlueDiff);
        mxdata.push({ ball: ii + 1, mx: mx });
        var min = Math.min(blueGreenDiff, greenBlackDiff, blackBlueDiff);
        mindata.push({ ball: ii + 1, min: min, diff: 0 });
        if (ballExists(mindata[mindata.length - 1].ball, slicedrows[0])) {
            mindata[mindata.length - 1].exists = true;
        }
    }
    var lbl = '';
    mxdata.sort(function (a, b) {
        return a.mx - b.mx;
    });
    var begin = -1;
    var end = -1;
    for (var kk = 0; kk < mxdata.length; kk++) {
        if (ballExists(mxdata[kk].ball, slicedrows[0])) {
            if (showFirstRow) {
                lbl = lbl + '[' + pad0('' + mxdata[kk].ball, 2) + ']';
                end = kk;
                if (begin == -1) {
                    begin = kk;
                }
            }
            else {
                lbl = lbl + ' ' + pad0('' + mxdata[kk].ball, 2) + ' ';
            }
        }
        else {
            lbl = lbl + ' ' + pad0('' + mxdata[kk].ball, 2) + ' ';
        }
    }
    dumpInfo2('statpurple', padLen('' + padLen('' + (0 + begin), 2) + ':' + padLen('' + end, 2) + '(' + padLen('' + (rowLen - end - 1), 2) + '): mx:', 20) + lbl);
    lbl = '';
    //let modidata=mindata.slice();
    mindata.sort(function (a, b) {
        return a.min - b.min;
    });
    mincopy = mindata.slice();
    ;
    begin = -1;
    end = -1;
    for (var kk = 0; kk < mindata.length; kk++) {
        if (ballExists(mindata[kk].ball, slicedrows[0])) {
            if (showFirstRow) {
                lbl = lbl + '[' + pad0('' + mindata[kk].ball, 2) + ']';
                end = kk;
                if (begin == -1) {
                    begin = kk;
                }
            }
            else {
                lbl = lbl + ' ' + pad0('' + mindata[kk].ball, 2) + ' ';
            }
        }
        else {
            lbl = lbl + ' ' + pad0('' + mindata[kk].ball, 2) + ' ';
        }
    }
    dumpInfo2('statred', padLen('' + padLen('' + (0 + begin), 2) + ':' + padLen('' + end, 2) + '(' + padLen('' + (rowLen - end - 1), 2) + '): min:', 20) + lbl);
    var minDist = 99;
    var summDist = 0;
    var maxDist = -1;
    var purpleiff = padLen('', 21);
    for (var kk = 0; kk < mxdata.length; kk++) {
        var dist = 0;
        for (var xx = 0; xx < mindata.length; xx++) {
            if (mindata[xx].ball == mxdata[kk].ball) {
                dist = xx - kk;
                break;
            }
        }
        purpleiff = purpleiff + padLen((dist > 0 ? '+' : '') + dist, 4);
        summDist = summDist + Math.abs(dist);
        if (minDist > Math.abs(dist))
            minDist = Math.abs(dist);
        if (maxDist < Math.abs(dist))
            maxDist = Math.abs(dist);
    }
    var avgDist = Math.round(summDist / mindata.length);
    var rediff = padLen('' + minDist + '/' + avgDist + '/' + maxDist, 21);
    for (var kk = 0; kk < mindata.length; kk++) {
        var dist = 0;
        for (var xx = 0; xx < mxdata.length; xx++) {
            if (mxdata[xx].ball == mindata[kk].ball) {
                dist = xx - kk;
                break;
            }
        }
        rediff = rediff + padLen((dist > 0 ? '+' : '') + dist, 4);
        mindata[kk].diff = dist;
    }
    var span = document.getElementById('infopurple');
    span.innerText = purpleiff;
    span = document.getElementById('infored');
    span.innerText = rediff;
    mindata.sort(function (a, b) {
        return Math.abs(a.diff) - Math.abs(b.diff);
    });
    resetNumbs();
    //testTest2();
    //testAbsDiff(skipRowsCount);
    //dumpDiffStat();
}
function addTestLines1(data) {
    var bas = 19;
    for (var ii = 0; ii < data.length; ii++) {
        markLines.push({
            fromX: data[ii].ball - 1,
            fromY: skipRowsCount + 0.85 * (bas / data.length * ii),
            toX: data[ii].ball - 1,
            toY: skipRowsCount + bas,
            color: data[ii].color, manual: true
        });
        markLines.push({
            fromX: data[ii].ball - 1 + rowLen,
            fromY: skipRowsCount + 0.85 * (bas / data.length * ii),
            toX: data[ii].ball - 1 + rowLen,
            toY: skipRowsCount + bas,
            color: data[ii].color, manual: true
        });
    }
}
function addTestLines2(data) {
    var bas = 19;
    for (var ii = 0; ii < data.length; ii++) {
        markLines.push({
            fromX: data[ii].ball - 1,
            fromY: skipRowsCount + 0.85 * (bas - bas / data.length * ii),
            toX: data[ii].ball - 1,
            toY: skipRowsCount + bas,
            color: data[ii].color, manual: true
        });
        markLines.push({
            fromX: data[ii].ball - 1 + rowLen,
            fromY: skipRowsCount + 0.85 * (bas - bas / data.length * ii),
            toX: data[ii].ball - 1 + rowLen,
            toY: skipRowsCount + bas,
            color: data[ii].color, manual: true
        });
    }
}
function arrHas0(arr) {
    for (var ii = 1; ii < arr.length; ii++) {
        if (arr[ii] == 0) {
            return true;
        }
    }
    return false;
}
/*
function dumpStat22() {
    console.log('dumpStat22');
    let counts: number[] = [];
    for (let ii = 1; ii < datarows.length - 3; ii++) {
        let idx = datarows[ii + 0].balls[0];
        if (idx) {
            if (!(counts[idx])) {
                counts[idx] = 0;
            }
            counts[idx]++;
        }
    }
    let itog: number[] = [];
    for (let ii = counts.length - 2; ii > 0; ii--) {
        itog[ii] = Math.round(100 * counts[ii] / datarows.length) + ((itog[ii + 1]) ? itog[ii + 1] : 0);
    }
    console.log(counts, itog);
    console.log(datarows.length);
}
function diffPart(a: number, b: number): number {
    if (a > b) {
        return a / b;
    } else {
        return b / a;
    }
}
function dumpPairsCounts() {
    let start = Math.round(Math.random() * 4321 + 1);
    //let deep=4;

    let ball = datarows[start].balls[0];
    console.log('dumpPairsCounts', start, datarows[start], datarows);
    let line = '';
    for (let kk = 0; kk < ball; kk++) {
        line = line + 'I';
    }
    console.log(line, ball);
    let preArr1 = [];
    dumpPairsPatterns(start, preArr1, ball, 1);
    dumpPairsPatterns(start, preArr1, ball, 2);
    dumpPairsPatterns(start, preArr1, ball, 3);
    dumpPairsPatterns(start, preArr1, ball, 4);
    dumpPairsPatterns(start, preArr1, ball, 5);
    dumpPairsPatterns(start, preArr1, ball, 6);
    dumpPairsPatterns(start, preArr1, ball, 7);
    console.log('dumpPairsPatterns', ball, preArr1);

}
function dumpPairsPatterns(start, preArr, left, deep) {
    for (let nn = start; nn < start + 100; nn++) {
        if (datarows[nn].balls[0] >= left) {
            let smm = 0;
            for (let dd = 1; dd <= deep; dd++) {
                smm = smm + datarows[nn + dd].balls[0];
            }
            let avg = Math.round(smm / deep);
            if (nn == start) {
                //console.log('first average',smm/deep);
                let line = '';
                for (let kk = 0; kk < smm / deep; kk++) {
                    line = line + '|';
                }
                console.log(line, smm / deep);
            } else {
                preArr[avg] = (preArr[avg]) ? preArr[avg] : [];
                preArr[avg][deep] = (preArr[avg][deep]) ? preArr[avg][deep] : 0;
                preArr[avg][deep]++;
            }
            //console.log(nn,datarows[nn]);
        }
    }

}
function randBalls(count: number): number[] {
    let test: number[] = [];
    for (let ii = 0; ii < count; ii++) {
        let ball = Math.floor(Math.random() * rowLen);
        if (test[ball]) {
            ii--;
        } else {
            test[ball] = 1;
        }
    }
    return test;
}
function chackRow(selection: number[], row: BallsRow): number {
    let foundcount = 0;
    for (let ii = 1; ii <= rowLen; ii++) {
        if (selection[ii]) {
            if (ballExists(ii, row)) {
                foundcount++;
            }
        }
    }
    return foundcount;
}
function checkAllRows(count: number) {
    let calcs: number[] = [];
    for (let ii = 1; ii < 5001; ii++) {
        let chk = randBalls(count);
        let cc = chackRow(chk, datarows[ii]);
        calcs[cc] = (calcs[cc]) ? calcs[cc] : 0;
        calcs[cc] = calcs[cc] + 2;
    }
    console.log(Math.floor(count), calcs);
}
*/
/*
function test4(){
    console.log('test4');
    //let high=10;
    //let low=7
    let cntx=0;
    let cless=0;
    let cmore=0;
    for(let ii=2;ii<datarows.length-99;ii++){
        let a0=datarows[ii+0].balls[0];
        let a1=datarows[ii+1].balls[0];
        let a2=datarows[ii+2].balls[0];
        let a3=datarows[ii+3].balls[0];
        if(a1<a2 && a2>a3 ){
            if(a0>=a1 && a0>1){
                console.log('+',a0,a1,a2,a3,':',ii);
                cmore++;
            }else{
                console.log('-',a0,a1,a2,a3,':',ii);
                cless++;
            }
            //console.log(ii);
            cntx++;
        }
    }
    console.log(cntx,cless,cmore,cmore/cntx);
}
*/
function yetAnotherStat() {
    var cnts = [];
    for (var ii = 1; ii < datarows.length; ii++) {
        var nn = datarows[ii].balls[0];
        if (!(cnts[nn]))
            cnts[nn] = 0;
        cnts[nn]++;
    }
    console.log('empty left', cnts);
    for (var ii = 0; ii < cnts.length; ii++) {
        console.log(ii, cnts[ii] / datarows.length);
    }
}
function anotherStat() {
    //let randProbe:number[]=[];
    var sz = 15;
    var ln = 4321;
    var sm0 = 0;
    var sm1 = 0;
    var sm2 = 0;
    var sm3 = 0;
    var sm4 = 0;
    var sm5 = 0;
    var sm6 = 0;
    for (var rn = 1; rn < ln; rn++) {
        //let rn=1+Math.floor(Math.random()*datarows.length-1);
        var hitCount = 0;
        for (var ii = 0; ii < sz; ii++) {
            var nxt = 1 + Math.floor(Math.random() * rowLen);
            //console.log(nxt);
            if (ballExists(nxt, datarows[rn])) {
                hitCount++;
            }
        }
        if (hitCount == 0)
            sm0++;
        if (hitCount == 1)
            sm1++;
        if (hitCount == 2)
            sm2++;
        if (hitCount == 3)
            sm3++;
        if (hitCount == 4)
            sm4++;
        if (hitCount == 5)
            sm5++;
        if (hitCount == 6)
            sm6++;
        //sm=sm+hitCount;
        //if(hitCount>ballsInRow)console.log(rn,':',hitCount);
    }
    console.log('random', sz, ln, '0-6:', sm0 / ln, sm1 / ln, sm2 / ln, sm3 / ln, sm4 / ln, sm5 / ln, sm6 / ln);
}
function testAbsDiff() {
    testDumpAbsDiff(1);
    testDumpAbsDiff(1001);
    testDumpAbsDiff(2001);
    testDumpAbsDiff(3001);
    testDumpAbsDiff(4001);
    /*testDumpAbsDiff(1, 2);
    testDumpAbsDiff(1, 3);
    testDumpAbsDiff(1, 4);
    let frstcnt: number[] = [];
    for (let ff = 1; ff < 5000; ff++) {
        let bl = datarows[ff].balls[0];
        frstcnt[bl] = frstcnt[bl] ? frstcnt[bl] : 0;
        frstcnt[bl]++;
    }
    console.log(frstcnt);*/
}
function testDumpAbsDiff(strt) {
    var count1 = 0;
    var preDiffX = [];
    var preDiffNo = [];
    for (var ff = strt; ff < strt + 1000; ff++) {
        //if (datarows[ff + 1].balls[0] >= maxpre) {
        var sz = 6;
        var smm = 0;
        for (var ii = ff + 1; ii < ff + 1 + sz; ii++) {
            smm = smm + Math.abs(datarows[ii].balls[0] - datarows[ii + 1].balls[0]);
        }
        var avg = Math.round(1 * smm / sz);
        //avg = datarows[ff].balls[0];
        preDiffX[avg] = preDiffX[avg] ? preDiffX[avg] : 0;
        preDiffNo[avg] = preDiffNo[avg] ? preDiffNo[avg] : 0;
        //if (datarows[ff].balls[0] >= mincur) {
        if (datarows[ff].balls[0] > 4) {
            count1++;
            preDiffX[avg]++;
        }
        else {
            preDiffNo[avg]++;
        }
        //}
        /*let frst = datarows[ff].balls[0];
        let sz = 9;
        let smm = 0;
        for (let ii = ff + 1; ii < ff + 1 + sz; ii++) {
            smm = smm + Math.abs(datarows[ii].balls[0] - datarows[ii + 1].balls[0]);
        }
        let avg = smm / sz;
        if (Math.round(avg) == 3) {
            let line = '';
            for (let ii = 0; ii < frst; ii++) {
                line = line + '◼';
            }
            console.log(line, frst, ff,avg);
        } else {
            //console.log(frst);
        }*/
    }
    console.log(count1, preDiffX, preDiffNo);
    var end = Math.max(preDiffX.length, preDiffNo.length);
    for (var ii = 0; ii < end; ii++) {
        console.log(ii, preDiffX[ii] / preDiffNo[ii], '' + preDiffX[ii] + '+' + preDiffNo[ii] + '=' + (preDiffX[ii] + preDiffNo[ii]));
    }
}
init();
addTails();
//dumpPairsCounts();
//let chk=randBalls(20);
//anotherStat();
//yetAnotherStat();
//testAbsDiff();
//test4();
/*
checkAllRows(rowLen * 1 / 4);
checkAllRows(rowLen * 1 / 2);
checkAllRows(rowLen * 3 / 4);
*/
/*
let row = datarows[Math.round(Math.random() * 5000 + 1)];
console.log(33, row);
for (let ii = 0; ii < 10; ii++) {
    console.log(chackRow(randBalls(33), row));
}
*/
console.log('start');
