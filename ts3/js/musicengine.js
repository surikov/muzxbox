"use strict";
console.log("Surikov's API for Regular Music");
var Surikov;
(function (Surikov) {
    var SurikovEngine = (function () {
        function SurikovEngine() {
        }
        SurikovEngine.prototype.version = function () {
            return "Surikov's API for Regular Music v1.0.01";
        };
        SurikovEngine.prototype.createTester = function () {
            return new Surikov.LibTester();
        };
        SurikovEngine.prototype.createContext = function () { };
        return SurikovEngine;
    }());
    Surikov.SurikovEngine = SurikovEngine;
})(Surikov || (Surikov = {}));
window["SurikovEngine"] = new Surikov.SurikovEngine();
var Surikov;
(function (Surikov) {
    var LibTester = (function () {
        function LibTester() {
        }
        LibTester.prototype.startTest1 = function () {
            console.log("startTest1");
            var a2 = new Surikov.MusicMetreMath({
                count: 1,
                part: 2,
            });
            var a4 = new Surikov.MusicMetreMath({
                count: 1,
                part: 4,
            });
            var a8 = new Surikov.MusicMetreMath({
                count: 1,
                part: 8,
            });
            var a72 = new Surikov.MusicMetreMath({
                count: 7,
                part: 2,
            });
            console.log(a2.equals(a72));
            console.log(a2.equals(a4.plus(a4)));
            console.log(a2.plus(a8));
            console.log(a2.minus(a8));
        };
        return LibTester;
    }());
    Surikov.LibTester = LibTester;
})(Surikov || (Surikov = {}));
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
            var wholeNoteSeconds = (4 * 60) / tempo;
            var meterSeconds = (wholeNoteSeconds * metre.count) / metre.part;
            return meterSeconds;
        };
        return MusicMetreMath;
    }());
    Surikov.MusicMetreMath = MusicMetreMath;
})(Surikov || (Surikov = {}));
var MusicScaleMath = (function () {
    function MusicScaleMath(scale) {
    }
    MusicScaleMath.prototype.pitch = function () {
        return 0;
    };
    return MusicScaleMath;
}());
//# sourceMappingURL=musicengine.js.map