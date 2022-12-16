"use strict";
console.log('Surikov\'s API for Regular Music');
var SurikovEngine = (function () {
    function SurikovEngine() {
        this.tester = new LibTester();
    }
    SurikovEngine.prototype.version = function () {
        return 'Surikov\'s API for Regular Music v1.0.01';
    };
    SurikovEngine.prototype.createContext = function () {
    };
    return SurikovEngine;
}());
var LibTester = (function () {
    function LibTester() {
    }
    LibTester.prototype.startTest1 = function () {
        console.log("startTest1");
        var a2 = new Surikov.MusicMetreMath({ count: 1, part: 2 });
        var a4 = new Surikov.MusicMetreMath({ count: 1, part: 4 });
        var a8 = new Surikov.MusicMetreMath({ count: 1, part: 8 });
        var a72 = new Surikov.MusicMetreMath({ count: 7, part: 2 });
        console.log(a2.equals(a72));
        console.log(a2.equals(a4.plus(a4)));
        console.log(a2.plus(a8));
        console.log(a2.minus(a8));
    };
    return LibTester;
}());
var Surikov;
(function (Surikov) {
    var MusicMetreMath = (function () {
        function MusicMetreMath(from) {
            this.count = from.count;
            this.part = from.part;
        }
        MusicMetreMath.prototype.metre = function () {
            return { count: this.count, part: this.part };
        };
        MusicMetreMath.prototype.simplyfy = function () {
            var cc = this.count;
            var pp = this.part;
            if (cc > 0 && pp > 0) {
                while (cc % 2 == 0 && pp % 2 == 0) {
                    cc = cc / 2;
                    pp = pp / 2;
                }
            }
            return new MusicMetreMath({ count: cc, part: pp });
        };
        MusicMetreMath.prototype.strip = function (toPart) {
            var cc = this.count;
            var pp = this.part;
            var rr = pp / toPart;
            cc = Math.round(cc / rr);
            pp = toPart;
            return new MusicMetreMath({ count: cc, part: pp });
        };
        MusicMetreMath.prototype.equals = function (metre) {
            var countMe = this.count * metre.part;
            var countTo = metre.count * this.part;
            if (countMe == countTo) {
                return true;
            }
            else {
                return false;
            }
        };
        MusicMetreMath.prototype.less = function (metre) {
            var countMe = this.count * metre.part;
            var countTo = metre.count * this.part;
            if (countMe < countTo) {
                return true;
            }
            else {
                return false;
            }
        };
        MusicMetreMath.prototype.more = function (metre) {
            var countMe = this.count * metre.part;
            var countTo = metre.count * this.part;
            if (countMe > countTo) {
                return true;
            }
            else {
                return false;
            }
        };
        MusicMetreMath.prototype.plus = function (metre) {
            var countMe = this.count * metre.part;
            var countTo = metre.count * this.part;
            var rr = { count: countMe + countTo, part: metre.part * this.part };
            return new MusicMetreMath(rr).simplyfy();
        };
        MusicMetreMath.prototype.minus = function (metre) {
            var countMe = this.count * metre.part;
            var countTo = metre.count * this.part;
            var rr = { count: countMe - countTo, part: metre.part * this.part };
            return new MusicMetreMath(rr).simplyfy();
        };
        MusicMetreMath.prototype.duration = function (metre, tempo) {
            return 0;
        };
        return MusicMetreMath;
    }());
    Surikov.MusicMetreMath = MusicMetreMath;
})(Surikov || (Surikov = {}));
var MusicScaleMath = (function () {
    function MusicScaleMath() {
    }
    return MusicScaleMath;
}());
;
//# sourceMappingURL=musicengine.js.map