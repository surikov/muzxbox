"use strict";
console.log('Music Engine');
var SurikovEngine = (function () {
    function SurikovEngine() {
        this.tester = new LibTester();
    }
    SurikovEngine.prototype.version = function () {
        return 'Surikov Engine v1.0.01';
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
        var mmm = MMM({ count: 1, part: 2 });
        var test = mmm;
        console.log(test);
    };
    return LibTester;
}());
function MMM(metre) {
    return new MusicMetreMath(metre);
}
var MusicMetreMath = (function () {
    function MusicMetreMath(from) {
        this.count = from.count;
        this.part = from.part;
    }
    MusicMetreMath.prototype.metre = function () {
        return { count: this.count, part: this.part };
    };
    return MusicMetreMath;
}());
//# sourceMappingURL=musicengine.js.map