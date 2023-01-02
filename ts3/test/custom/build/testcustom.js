"use strict";
console.log("load customfile");
function customFunction() {
    console.log('start customFunction');
    exportedMain();
    var test = new APISecond();
    test.fromAnother({ name: "one", value: 1 });
    test.fromAnother({ name: "ten", value: 10 });
}
;
//# sourceMappingURL=testcustom.js.map