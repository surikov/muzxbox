//console.log('tilelevelг v2.17');
//let this: TileLevel = null;
/*
let layerModeLockX: string = 'lockX';
let layerModeNormal: string = 'normal';
let layerModeOverlay: string = 'overlay';
let layerModeLockY: string = 'lockY';
let layerModeStickBottom: string = 'stickBottom';
let layerModeStickRight: string = 'stickRight';
*/

class CannyDo {
    currentID: number = 0;
    start(ms: number, action: () => void) {
        var startId = -1;
        this.currentID = setTimeout(function () {
            if (startId == this.currentID) {
                action();
            }
        }.bind(this), ms);
        startId = this.currentID;
    }
}
class LazyDo {
    locked = false;
    //lastAction:() => void;
    start(ms: number, action: () => void) {
        //this.lastAction=action;
        if (!this.locked) {
            //console.log('queue',action);
            this.locked = true;
            setTimeout(function () {
                action();
                this.locked = false;
            }.bind(this), ms);
        } else {
            //console.log('skip', action);
        }
    }
}

function cloneBaseDefiition(from: TileBaseDefinition): TileBaseDefinition {
    var to: TileBaseDefinition = {};
    //if (from.action) to.action = from.action;
    if (from.css) to.css = from.css;
    //if (from.dragX) to.dragX = from.dragX;
    //if (from.dragY) to.dragY = from.dragY;
    return to;
}
function cloneLine(from: TileLine): TileLine {
    var to: TileLine = cloneBaseDefiition(from) as TileLine;
    to.x1 = from.x1;
    to.x2 = from.x2;
    to.y1 = from.y1;
    to.y2 = from.y2;
    return to;
}
function cloneRectangle(from: TileRectangle): TileRectangle {
    var to: TileRectangle = cloneBaseDefiition(from) as TileRectangle;
    to.x = from.x;
    to.y = from.y;
    to.w = from.w;
    to.h = from.h;
    to.rx = from.rx;
    to.ry = from.ry;
    return to;
}
function vectorFromTouch(touch: Touch): TilePoint {
    return {
        x: touch.clientX,
        y: touch.clientY
    };
}
function vectorFindCenter(xy1: TilePoint, xy2: TilePoint): TilePoint {
    let xy: TilePoint = vectorAdd(xy1, xy2);
    return vectorScale(xy, 0.5);
};
function vectorAdd(xy1: TilePoint, xy2: TilePoint): TilePoint {
    return {
        x: xy1.x + xy2.x,
        y: xy1.y + xy2.y
    };
};
function vectorScale(xy: TilePoint, coef: number): TilePoint {
    return {
        x: xy.x * coef,
        y: xy.y * coef
    };
};
function vectorDistance(xy1: TilePoint, xy2: TilePoint): number {
    let xy: TilePoint = vectorSubstract(xy1, xy2);
    let n: number = vectorNorm(xy);
    return n;
}
function vectorNorm(xy: TilePoint): number {
    return Math.sqrt(vectorNormSquared(xy));
}
function vectorSubstract(xy1: TilePoint, xy2: TilePoint): TilePoint {
    return {
        x: xy1.x - xy2.x,
        y: xy1.y - xy2.y
    };
}
function vectorNormSquared(xy: TilePoint): number {
    return xy.x * xy.x + xy.y * xy.y;
}