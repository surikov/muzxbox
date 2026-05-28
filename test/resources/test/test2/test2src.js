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
/*
function dumpRows(data: BalsRow[], firstRow: number, len: number) {
    for (let step = 1; step < len; step++) {
        let txt = '';
        let levels: CellLevel[] = rowCountEmpty(data, firstRow, step);
        levels.sort((a, b) => {
            return b.volume - a.volume
        });
        for (let kk = 0; kk < cellCount; kk++) {
            let ball = levels[kk].ball;
            let point = ' ' + t2(ball) + '';
            if (ballExistsInRow(ball, data[firstRow])) {
                point = '+' + t2(ball) + '';
            }

            txt = txt + point;
        }
        let cnt = 0;
        for (let nn = 0; nn < cellCount; nn++) {
            if (levels[nn].exists) {
                break;
            }
            cnt++;
        }
        console.log(txt, ':', cnt);
    }
}
*/
function dumpLevels(row0, data, len, stepsize, firstlong, lastshort) {
    //let counts: number[] = [];
    for (var ii = 0; ii < len; ii++) {
        var levels = rowCountEmpty(data, row0 + ii * stepsize, stepsize);
        levels.sort(function (a, b) {
            return b.volume - a.volume;
        });
        var txt = '';
        for (var kk = 0; kk < levels.length; kk++) {
            if (levels[kk].exists) {
                txt = txt + '[' + t2(levels[kk].ball) + ']';
                //counts[kk] = counts[kk] ? counts[kk] + 1 : 1;
            }
            else {
                txt = txt + ' ' + t2(levels[kk].ball) + ' ';
            }
        }
        if (ii == 0) {
            firstlong[levels[0].ball] = levels[0].exists ? '*****' : '-';
            lastshort[levels[44].ball] = levels[44].exists ? '++++++' : '-';
            //console.log(levels);
        }
        console.log(txt + ' : ' + (row0 + ii * stepsize) + ':' + stepsize);
    }
    //dumpLevelsCounts(counts);
}
function dumpLevelsCounts(counts) {
    var line = '';
    for (var kk = 0; kk < 45; kk++) {
        counts[kk] = counts[kk] ? counts[kk] : 0;
        line = line + ':' + t2(counts[kk]) + ' ';
    }
    console.log(line);
}
function start2() {
    var start = Math.round(Math.random() * 5000);
    var stepsize = 1 + Math.round(Math.random() * 50);
    //console.log(window.location);
    var txt = window.location.href;
    //console.log(txt);
    var url = new URL(txt);
    var searchParams = new URLSearchParams(url.search);
    var txtstart = searchParams.get('start');
    if (txtstart) {
        start = parseInt(txtstart);
    }
    var txtstepsize = searchParams.get('step');
    if (txtstepsize) {
        stepsize = parseInt(txtstepsize);
    }
    //console.log(searchParams.get('start'));  // outputs "m2-m3-m4-m5"
    //console.log(searchParams.get('step'));  // outputs "m2-m3-m4-m5"
    //console.log('Test string %c[a], b','color: magenta;');
    console.log('test2.html?start=' + start + '&step=' + stepsize); //, dataRows2: BalsRow[][start].balls);
    //for (let ii = 1; ii <= 45; ii++) {
    //console.log(ii,'------------------------');
    //dumpRows(start, 40);//data2[start].balls[0]);
    //}
    //dumpLevels(start, dataRows2,40, stepsize);
    //console.log('--');
    var firstlong = [];
    var lastshort = [];
    for (var ii = 0; ii < 99; ii = ii + 1) {
        //console.log('test2.html?start=' + start + '&step=' + (ii + 1));//, dataRows2: BalsRow[][start].balls);
        dumpLevels(start, dataRows2, 1, ii + 1, firstlong, lastshort);
    }
    console.log('firstlong', firstlong);
    console.log('lastshort', lastshort);
}
