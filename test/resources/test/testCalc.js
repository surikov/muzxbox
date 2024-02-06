var skipRowsCount = 0;
var levelA;
var linesLevel;
var dataBalls;
var datarows;
var showFirstRow = true;
var sversion = 'v1.87 ' + dataName + ': ' + ballsInRow + '/' + rowLen;
var markX = -1;
var markY = -1;
var cellSize = 12;
var topShift = cellSize * 21;
var rowsVisibleCount = 66;
var rowsAvgCount = 5;
var rowsSliceCount = rowsVisibleCount + rowsAvgCount;
var reduceRatio = 1;
var highLightMode = 1;
var calcLen = 32;
var diffWide = 1;
var wideRange = false;
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
    console.log(dataBalls);
    datarows = readParseStat(dataBalls);
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
                    var szz = cellSize / 5 - 0.5;
                    var clr = '#ff0000ff';
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
                one.summ++;
            }
        }
        one.logr = one.summ;
    }
    return resu;
}
/*
function calculateEmptyColumnDuration(rowNum: number, rows: BallsRow[]): { ball: number, fills: { dx1: number, dx2: number }[], summ: number, logr: number }[] {
    let resu: { ball: number, fills: { dx1: number, dx2: number }[], summ: number, logr: number }[] = [];
    for (let nn = 0; nn < rowLen; nn++) {
        let one: { ball: number, fills: { dx1: number, dx2: number }[], summ: number, logr: number } = { ball: nn + 1, fills: [], summ: 0, logr: 0 };
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
}*/
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
    //console.log(id, text);
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
        //console.log(ii + 1, fl, cc);
        //smm.push({ ball: ii + 1, sm: Math.round(cc/(ss+ss+1)), xst: fl ,sh:ss});
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
    /*for (let shift = -3; shift <= 3; shift++) {
        console.log(shift,':'
            ,calcEmptyLineDuration(shift, 1, 1, inrows)
            , calcEmptyLineDuration(shift, 2, 1, inrows)
            , calcEmptyLineDuration(shift, 3, 1, inrows)
            , calcEmptyLineDuration(shift, 4, 1, inrows)
            , calcEmptyLineDuration(shift, 5, 1, inrows)
            , calcEmptyLineDuration(shift, 5, 1, inrows)
            , calcEmptyLineDuration(shift, 7, 1, inrows)
            , calcEmptyLineDuration(shift, 8, 1, inrows)
            , calcEmptyLineDuration(shift, 9, 1, inrows)
            , calcEmptyLineDuration(shift, 10, 1, inrows)
            );
    }*/
}
function dumpRowFills(inrows) {
    if (highLightMode == 1) {
        dumpRowFillsColor(inrows, '#009900cc', 0);
        //let slicedrows: BallsRow[] = sliceRows(inrows, 1*reduceRatio, inrows.length-1*reduceRatio);
        //dumpRowFillsColor(slicedrows, '#00990033', 0);
        dumpRowWaitColor(inrows, '#00000033', 0);
    }
    else {
        dumpRowWaitColor(inrows, '#009900cc', 0);
        dumpRowFillsColor(inrows, '#00000033', 0);
    }
}
function dumpRowWaitColor(rows, color, shiftX) {
    var lbl = 'grey ';
    //console.log(lbl);
    var arr = [];
    //var rowNum = 0;
    //let diff=0;
    for (var nn = 0; nn < rowLen; nn++) {
        var one = { ball: nn + 1, summ: 0 };
        arr.push(one);
        /*for (var rr = rowNum + 1; rr < rowNum + 1 + calcLen; rr++) {
            if (ballExists(nn + 1, rows[rr])) {
                break;
            }
            one.summ++;
        }*/
        for (var shift = -diffWide; shift <= diffWide; shift++) {
            one.summ = one.summ + calcEmptyLineDuration(shift, nn + 1, 1, rows);
        }
    }
    makeWader(arr);
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
    var first = arr.map(function (x) { return x; });
    first.sort(function (aa, bb) { return bb.summ - aa.summ; });
    var begin = -1;
    var end = -1;
    for (var kk = 0; kk < first.length; kk++) {
        if (ballExists(first[kk].ball, rows[0]) && showFirstRow) {
            lbl = lbl + ' ●' + first[kk].ball;
            end = kk;
            if (begin == -1) {
                begin = kk;
            }
        }
        else {
            lbl = lbl + ' ' + first[kk].ball;
        }
    }
    lbl = '' + begin + ':' + end + '(' + (rowLen - end - 1) + '): ' + lbl;
    //console.log(lbl);
    dumpInfo2('statgrey', lbl);
    for (var bb = 0; bb < rowLen; bb++) {
        var hh = (mx - min - (arr[bb].summ - min)) / hr;
        var fromY = Math.round((topShift) / cellSize) + skipRowsCount + 0 - prehh - 2;
        var toY = Math.round((topShift) / cellSize) + skipRowsCount - hh - 0 - 2;
        markLines.push({
            fromX: bb + shiftX - 1,
            fromY: fromY //skipRowsCount + 0 + prehh
            ,
            toX: bb + shiftX,
            toY: toY //skipRowsCount + hh - 0
            ,
            color: color, manual: false
        });
        markLines.push({
            fromX: bb + shiftX - 1 + rowLen,
            fromY: fromY //skipRowsCount + 0 + prehh
            ,
            toX: bb + shiftX + rowLen,
            toY: toY //skipRowsCount + hh - 0
            ,
            color: color, manual: false
        });
        prehh = hh;
    }
    //console.log(arr);
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
        //console.log(min,center, middle, mx, sorted);
        for (var bb = 0; bb < rowLen; bb++) {
            ballFills[bb].summ = ballFills[bb].summ - center;
            var sig = ballFills[bb].summ > 0 ? 1 : -1;
            ballFills[bb].summ = sig * ballFills[bb].summ * ballFills[bb].summ;
        }
    }
}
function dumpRowFillsColor(rows, color, shiftX) {
    var lbl = 'green';
    //console.log(lbl);
    var precounts = calcRowPatterns(0 + 1, rows);
    var ballFills = calculateBallTriadChain(0, rows, precounts);
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
    var begin = -1;
    var end = -1;
    for (var kk = 0; kk < first.length; kk++) {
        if (ballExists(first[kk].ball, rows[0]) && showFirstRow) {
            lbl = lbl + ' ●' + first[kk].ball;
            end = kk;
            if (begin == -1) {
                begin = kk;
            }
        }
        else {
            lbl = lbl + ' ' + first[kk].ball;
        }
    }
    lbl = '' + begin + ':' + end + '(' + (rowLen - end - 1) + '): ' + lbl;
    //console.log(lbl);
    dumpInfo2('statgreen', lbl);
    for (var bb = 0; bb < rowLen; bb++) {
        var hh = (mx - min - (ballFills[bb].summ - min)) / hr;
        var fromY = Math.round((topShift) / cellSize) + skipRowsCount + 0 - prehh - 2;
        var toY = Math.round((topShift) / cellSize) + skipRowsCount - hh - 0 - 2;
        markLines.push({
            fromX: bb + shiftX - 1,
            fromY: fromY //skipRowsCount + 0 + prehh
            ,
            toX: bb + shiftX,
            toY: toY //skipRowsCount + hh - 0
            ,
            color: color, manual: false
        });
        markLines.push({
            fromX: bb + shiftX - 1 + rowLen,
            fromY: fromY //skipRowsCount + 0 + prehh
            ,
            toX: bb + shiftX + rowLen,
            toY: toY //skipRowsCount + hh - 0
            ,
            color: color, manual: false
        });
        prehh = hh;
    }
}
function dumpTriads(svg, rows) {
    //console.log('blue');
    var ratioPre = 0.66; //0.99;
    //console.log('dumpTriads mode', highLightMode);
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
        if (rr == 0) {
            var first = calcs.map(function (x) { return x; });
            var lbl = "";
            first.sort(function (aa, bb) { return aa.summ - bb.summ; });
            lbl = 'blue';
            var begin = -1;
            var end = -1;
            for (var kk = 0; kk < first.length; kk++) {
                if (ballExists(first[kk].ball, rows[0]) && showFirstRow) {
                    lbl = lbl + ' ●' + first[kk].ball;
                    end = kk;
                    if (begin == -1) {
                        begin = kk;
                    }
                }
                else {
                    lbl = lbl + ' ' + first[kk].ball;
                }
            }
            lbl = '' + begin + ':' + end + '(' + (rowLen - end - 1) + '): ' + lbl;
            //console.log(lbl);
            dumpInfo2('statblue', lbl);
        }
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
    drawStat3(levelA, slicedrows);
    //drawLines();
    //countInfo(slicedrows);
    var msgp = document.getElementById('stepsize');
    msgp.innerText = '' + reduceRatio;
    msgp = document.getElementById('calcLen');
    msgp.innerText = '' + calcLen;
    msgp = document.getElementById('calcWide');
    msgp.innerText = '' + diffWide;
}
function clickHop() {
    skipRowsCount = Math.round(Math.random() * (datarows.length - reduceRatio * rowsVisibleCount));
    addTails();
}
function toggleFirst() {
    showFirstRow = !showFirstRow;
    //fillCells();
    addTails();
}
function toggleWide() {
    wideRange = !wideRange;
    //fillCells();
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
function addTails() {
    clearNonManual();
    var slicedrows = sliceRows(datarows, skipRowsCount, skipRowsCount + rowsSliceCount * 2);
    dumpRowFills(slicedrows);
    fillCells();
}
init();
addTails();
