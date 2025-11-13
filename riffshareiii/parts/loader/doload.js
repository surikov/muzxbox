"use strict";
function startload() {
    console.log('startload');
    let fileurl = './deff_leppard-hysteria';
    let xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.open("GET", fileurl);
    xmlHttpRequest.responseType = "arraybuffer";
    xmlHttpRequest.onload = (event) => {
        let arrayBuffer = xmlHttpRequest.response;
        if (arrayBuffer) {
            console.log(arrayBuffer);
        }
    };
    xmlHttpRequest.send(null);
}
//# sourceMappingURL=doload.js.map