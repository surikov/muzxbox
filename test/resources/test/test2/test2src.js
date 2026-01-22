function t2(nn) {
    if (nn < 10) {
        return '0' + nn;
    }
    else {
        return '' + nn;
    }
}
function levelCountEmpty(data, fromRow, ball, step) {
    var cnt = 0;
    //for (let ii = fromRow + 1; ii < data2.length; ii++) {
    for (var rr = 1; rr < data.length; rr++) {
        var ii = fromRow + rr * step;
        if (ballExistsInRow(ball, data[ii])) {
            break;
        }
        cnt++;
    }
    return cnt;
}
function rowCountEmpty(data, fromRow, step) {
    var cellVolumes = [];
    for (var tt = 0; tt < cellCount; tt++) {
        var ball = tt + 1;
        cellVolumes[tt] = {
            ball: ball,
            volume: levelCountEmpty(data, fromRow, ball, step),
            exists: ballExistsInRow(ball, data[fromRow])
        };
    }
    return cellVolumes;
}
function ballExistsInRow(ball, row) {
    if (row.balls.indexOf(ball) > -1) {
        return true;
    }
    else {
        return false;
    }
}
function dumpRows(data, firstRow, len) {
    for (var step = 1; step < len; step++) {
        var txt = '';
        var levels = rowCountEmpty(data, firstRow, step);
        levels.sort(function (a, b) {
            return b.volume - a.volume;
        });
        for (var kk = 0; kk < cellCount; kk++) {
            var ball = levels[kk].ball;
            var point = ' ' + t2(ball) + '';
            if (ballExistsInRow(ball, data[firstRow])) {
                point = '+' + t2(ball) + '';
            }
            txt = txt + point;
        }
        var cnt = 0;
        for (var nn = 0; nn < cellCount; nn++) {
            if (levels[nn].exists) {
                break;
            }
            cnt++;
        }
        console.log(txt, ':', cnt);
    }
}
function dumpLevels(row0, data) {
    for (var ii = 0; ii < 20; ii++) {
        var levels = rowCountEmpty(data, row0 + ii, 1);
        console.log(levels);
    }
}
function start2() {
    //console.log('Test string %c[a], b','color: magenta;');
    var start = Math.round(Math.random() * 5000);
    console.log(start); //, dataRows2: BalsRow[][start].balls);
    //for (let ii = 1; ii <= 45; ii++) {
    //console.log(ii,'------------------------');
    //dumpRows(start, 40);//data2[start].balls[0]);
    //}
    dumpLevels(start, dataRows2);
}
