"use strict";
console.log("load apiexample");
var APIMainSpace;
(function (APIMainSpace) {
    function apiFunction() {
        console.log("start apiFunction");
    }
    APIMainSpace.apiFunction = apiFunction;
    class APITest {
        constructor() {
            console.log("create APITest");
        }
        methodFromAPIClass() {
            console.log("start methodFromAPIClass");
        }
    }
    APIMainSpace.APITest = APITest;
})(APIMainSpace || (APIMainSpace = {}));
function exportedMain() {
    console.log("run exportedMain");
}
class APISecond {
    constructor() {
        console.log('create APISecond');
    }
    fromAnother(v) {
        console.log('run fromAnother', v);
    }
}
//# sourceMappingURL=apilib.js.map