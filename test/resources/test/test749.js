var skipRowsCount = 0;
var sversion = 'test749 v1.03';
var levelA;
var levelB;
var dataBalls;
var datarows;
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
    var ballsInRow = 7;
    var rows = [{
            balls: [0, 0, 0, 0, 0, 0, 0],
            key: 'next'
        }];
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
function ballExists(ball, len, row) {
    while (ball < 1)
        ball = ball + len;
    while (ball > len)
        ball = ball - len;
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
    tx.setAttributeNS(null, "font-size", "11");
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
    //rect.setAttribute("stroke-color", strokecolor);
    //rect.setAttribute("fill-opacity", '100%');
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
/////////////////
function init() {
    levelA = document.getElementById('levelA');
    //console.log(levelA);
    levelB = document.getElementById('levelA');
    //console.log(levelB);
    dataBalls = window['data749'];
    //console.log(dataBalls);
    datarows = readParseStat(dataBalls);
    //randomizeData(datarows);
    console.log(datarows);
}
function randomizeData(rows) {
    for (var i = 0; i < rows.length; i++) {
        for (var nn = 0; nn < 7; nn++) {
            rows[i].balls[nn] = Math.floor(Math.random() * 50);
        }
    }
}
//function drawStat2(svg: SVGElement, rows: BallsRow[]) {
//	var cx = 500;
//	var cy = 500;
/*var stepPerRotation = 4 * 60;
var increment =  20*2 * Math.PI / stepPerRotation;
var theta = 0;
var count = 10;
while (theta < count * 2 * Math.PI) {
    var newX = cx + 6 * theta * Math.cos(theta);
    var newY = cy - 6 * theta * Math.sin(theta);
    addCircle(svg, newX, newY, 4, '#000000');
    theta = 0.992*(theta + increment);
}
*/
/*let angle = 0;
let angleStep = 2 * Math.PI / 16;
let radius=10;
let radiusStep=10;
for (let ii = 0; ii < 1000; ii++) {
    var xx = cx + sizeRatio * angle * Math.cos(angle);
    var yy = cy + sizeRatio * angle * Math.sin(angle);
    addCircle(svg, xx, yy, 4, '#000000');
    angleStep = farRatio * angleStep;
    angle = angle + angleStep;
}*/
//}
/*
function drawStat1(svg: SVGElement, rows: BallsRow[]) {
    //randomizeData(rows);
    let rowCount = 7;
    let rowLen = 49;
    let cellSize = 4;
    addRect(svg, rowLen * cellSize + cellSize / 2, 0, rowLen * cellSize, cellSize, '#ffffff');
    for (let rowNum = 0; rowNum < 500; rowNum++) {
        let row = rows[rowNum];
        for (let colNum = 1; colNum <= rowLen; colNum++) {
            if (ballExists(colNum, rowLen, row)) {
                addCircle(svg, colNum * cellSize * 2, 30 + rowNum * cellSize * 2, cellSize, '#000000', '#000000');
            } else {
                addCircle(svg, colNum * cellSize * 2, 30 + rowNum * cellSize * 2, cellSize, '#cccccc', '#cccccc');
            }
        }
        for (let colNum = 1 + rowLen; colNum <= rowLen + rowLen; colNum++) {
            if (ballExists(colNum, rowLen, row)) {
                addCircle(svg, colNum * cellSize * 2, 30 + rowNum * cellSize * 2, cellSize, '#000000', '#000000');
            } else {
                addCircle(svg, colNum * cellSize * 2, 30 + rowNum * cellSize * 2, cellSize, '#cccccc', '#cccccc');
            }
        }
        for (let colNum = 1 + rowLen + rowLen; colNum <= rowLen + rowLen + rowLen; colNum++) {
            if (ballExists(colNum, rowLen, row)) {
                addCircle(svg, colNum * cellSize * 2, 30 + rowNum * cellSize * 2, cellSize, '#000000', '#000000');
            } else {
                addCircle(svg, colNum * cellSize * 2, 30 + rowNum * cellSize * 2, cellSize, '#cccccc', '#cccccc');
            }
        }
    }

}*/
function drawStat3(svg, rows, fillColor) {
    var rowCount = 7;
    var rowLen = 49;
    var cellSize = 8;
    addRect(svg, rowLen * cellSize + cellSize / 2, 0, rowLen * cellSize, cellSize, '#ffffff');
    for (var rowNum = 0; rowNum < rows.length; rowNum++) {
        var row = rows[rowNum];
        for (var colNum = 1; colNum <= rowLen; colNum++) {
            var colors = fillColor(rowCount, rowLen, colNum, row, rows);
            ;
            addCircle(svg, colNum * cellSize + 0 * rowLen * cellSize, 30 + rowNum * cellSize, cellSize / 2 - 0.5, colors.strokeColor, colors.fillColor);
            addCircle(svg, colNum * cellSize + 1 * rowLen * cellSize, 30 + rowNum * cellSize, cellSize / 2 - 0.5, colors.strokeColor, colors.fillColor);
            addCircle(svg, colNum * cellSize + 2 * rowLen * cellSize, 30 + rowNum * cellSize, cellSize / 2 - 0.5, colors.strokeColor, colors.fillColor);
        }
    }
    //for (let i = 1; i <= rowLen; i++) {
    //	console.log(i, countSummExists(i, rowCount, rows) / rows.length);
    //}
}
/*
function countSummExists(ballNum: number, rowCount: number, rows: BallsRow[]): number {
    let smm = 0;
    for (let i = 0; i < rows.length; i++) {
        if (ballExists(ballNum, rowCount, rows[i])) {
            smm++;
        }
    }
    return smm;
}*/
function fillCells() {
    dumpInfo(skipRowsCount);
    var rowsCheckCount = 88;
    var slicedrows = sliceRows(datarows, skipRowsCount, skipRowsCount + rowsCheckCount);
    clearSVGgroup(levelA);
    //addCircle(levelA,200,100,4,'#666666');
    drawStat3(levelA, slicedrows, function (rowCount, rowLen, ballNum, row, rows) {
        if (ballExists(ballNum, rowLen, row)) {
            return { strokeColor: '#000000', fillColor: '#000000' };
        }
        else {
            return { strokeColor: '#cccccc', fillColor: '#cccccc' };
        }
    });
}
function clickRandomize() {
    skipRowsCount = Math.round(Math.random() * 1500);
    fillCells();
}
function clickGoUp() {
    skipRowsCount--;
    if (skipRowsCount < 0)
        skipRowsCount = 0;
    fillCells();
}
function clickGoDown() {
    skipRowsCount++;
    if (skipRowsCount > datarows.length - 100)
        skipRowsCount = datarows.length - 100;
    fillCells();
}
/////////////////
init();
clickRandomize();
