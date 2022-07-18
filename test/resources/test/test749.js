var skipRowsCount = 0;
var sversion = 'test749 v1.11';
var levelA;
var linesLevel;
var dataBalls;
var datarows;
var dataName = 'data645';
var rowLen = 45;
var ballsInRow = 6;
var markX = -1;
var markY = -1;
var cellSize = 8;
var topShift = cellSize * 8;
var rowsVisibleCount = 80;
var rowsAvgCount = 19;
//let opacityRatio = 10;
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
function randomizeData(rows) {
    for (var i = 0; i < rows.length; i++) {
        for (var nn = 0; nn < ballsInRow; nn++) {
            rows[i].balls[nn] = Math.floor(Math.random() * 50);
        }
    }
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
function drawStat3(svg, rows, fillColor) {
    drawLines();
    addRect(svg, rowLen * cellSize + cellSize / 2, 0, rowLen * cellSize, cellSize, '#ffffff');
    for (var rowNum = 0; rowNum < rowsVisibleCount; rowNum++) {
        var row = rows[rowNum];
        for (var colNum = 1; colNum <= rowLen; colNum++) {
            var colors = fillColor(colNum, rowNum, rows);
            ;
            //addCircle(svg, colNum * cellSize - 0.5 * cellSize + 0 * rowLen * cellSize, topShift + 0.5 * cellSize + rowNum * cellSize, cellSize / 2 - 0.5, colors.strokeColor, colors.fillColor);
            addRect(svg, colNum * cellSize - 1 * cellSize + 0 * rowLen * cellSize, topShift + 0 * cellSize + rowNum * cellSize, cellSize, cellSize - 0.1, colors.fillColor);
            addCircle(svg, colNum * cellSize - 0.5 * cellSize + 0 * rowLen * cellSize, topShift + 0.5 * cellSize + rowNum * cellSize, cellSize / 2 - 0.5, colors.strokeColor, '#33221100');
            //addCircle(svg, colNum * cellSize - 0.5 * cellSize + 1 * rowLen * cellSize, topShift + 0.5 * cellSize + rowNum * cellSize, cellSize / 2 - 0.5, colors.strokeColor, colors.fillColor);
            addRect(svg, colNum * cellSize - 1 * cellSize + 1 * rowLen * cellSize, topShift + 0 * cellSize + rowNum * cellSize, cellSize, cellSize - 0.1, colors.fillColor);
            addCircle(svg, colNum * cellSize - 0.5 * cellSize + 1 * rowLen * cellSize, topShift + 0.5 * cellSize + rowNum * cellSize, cellSize / 2 - 0.5, colors.strokeColor, '#33221100');
        }
    }
    for (var colNum = 1; colNum <= rowLen; colNum++) {
        addSmallText(svg, colNum * cellSize - cellSize, topShift, "" + colNum);
    }
}
function fillColorFunc(ballNum, rowNum, rows) {
    //let cnt = 0;
    var counts = [];
    for (var bb = 0; bb < rowLen; bb++) {
        var ballCount = { ballNum: bb + 1, count: 0 };
        counts.push(ballCount);
        for (var i = 1; i < rowsAvgCount; i++) {
            //console.log(rows.length,rowNum,(rowNum + i + 1), ballNum, rows[rowNum + i + 1]);
            if (ballExists(bb + 1, rows[rowNum + i])) {
                ballCount.count++;
            }
        }
    }
    var groups = [];
    for (var ii = 0; ii < counts.length; ii++) {
        var oneCount = counts[ii];
        var flagExists = false;
        for (var kk = 0; kk < groups.length; kk++) {
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
    //counts.sort((a: { ballNum: number, count: number }, b: { ballNum: number, count: number }) => { return a.count - b.count; });
    groups.sort(function (a, b) { return a.count - b.count; });
    var orderNum = 0;
    for (var ii = 0; ii < groups.length; ii++) {
        if (groups[ii].balls.indexOf(ballNum) > -1) {
            orderNum = ii;
            break;
        }
    }
    //let opac = counts[ballNum-1].count / opacityRatio;
    var opac = 0.5 * orderNum / groups.length;
    if (opac > 1)
        opac = 1;
    var fll = 'rgba(0,0,255,' + opac + ')';
    //console.log(rows[rowNum].key, ballNum, orderNum,opac,counts,groups);
    if (ballExists(ballNum, rows[rowNum])) {
        return { strokeColor: '#000000ff', fillColor: fll };
    }
    else {
        return { strokeColor: '#33221100', fillColor: fll };
    }
}
function fillCells() {
    dumpInfo(skipRowsCount);
    var slicedrows = sliceRows(datarows, skipRowsCount, skipRowsCount + rowsSliceCount);
    clearSVGgroup(levelA);
    /*drawStat3(levelA, slicedrows, (ballNum: number, row: BallsRow, rows: BallsRow[]) => {
        if (ballExists(ballNum, row)) {
            return { strokeColor: '#000000', fillColor: '#000000' };
        } else {
            return { strokeColor: '#cccccc', fillColor: '#cccccc' }
        }
    });*/
    drawStat3(levelA, slicedrows, fillColorFunc);
}
function clickRandomize() {
    skipRowsCount = Math.round(Math.random() * (datarows.length - 100));
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
/////////////////
init();
fillCells();
