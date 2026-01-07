"use strict";
class LZUtil {
    constructor() {
        this.keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        this.keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
        this.baseReverseDic = {};
    }
    getBaseValue(alphabet, character) {
        if (!this.baseReverseDic[alphabet]) {
            this.baseReverseDic[alphabet] = {};
            for (let i = 0; i < alphabet.length; i++) {
                this.baseReverseDic[alphabet][alphabet.charAt(i)] = i;
            }
        }
        return this.baseReverseDic[alphabet][character];
    }
    _compress(uncompressed, bitsPerChar, getCharFromInt) {
        if (uncompressed == null) {
            return "";
        }
        let value;
        const context_dictionary = {};
        const context_dictionaryToCreate = {};
        let context_c = "";
        let context_wc = "";
        let context_w = "";
        let context_enlargeIn = 2;
        let context_dictSize = 3;
        let context_numBits = 2;
        const context_data = [];
        let context_data_val = 0;
        let context_data_position = 0;
        for (let ii = 0; ii < uncompressed.length; ii += 1) {
            context_c = uncompressed.charAt(ii);
            if (!Object.prototype.hasOwnProperty.call(context_dictionary, context_c)) {
                context_dictionary[context_c] = context_dictSize++;
                context_dictionaryToCreate[context_c] = true;
            }
            context_wc = context_w + context_c;
            if (Object.prototype.hasOwnProperty.call(context_dictionary, context_wc)) {
                context_w = context_wc;
            }
            else {
                if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
                    if (context_w.charCodeAt(0) < 256) {
                        for (let i = 0; i < context_numBits; i++) {
                            context_data_val = context_data_val << 1;
                            if (context_data_position == bitsPerChar - 1) {
                                context_data_position = 0;
                                context_data.push(getCharFromInt(context_data_val));
                                context_data_val = 0;
                            }
                            else {
                                context_data_position++;
                            }
                        }
                        value = context_w.charCodeAt(0);
                        for (let i = 0; i < 8; i++) {
                            context_data_val = (context_data_val << 1) | (value & 1);
                            if (context_data_position == bitsPerChar - 1) {
                                context_data_position = 0;
                                context_data.push(getCharFromInt(context_data_val));
                                context_data_val = 0;
                            }
                            else {
                                context_data_position++;
                            }
                            value = value >> 1;
                        }
                    }
                    else {
                        value = 1;
                        for (let i = 0; i < context_numBits; i++) {
                            context_data_val = (context_data_val << 1) | value;
                            if (context_data_position == bitsPerChar - 1) {
                                context_data_position = 0;
                                context_data.push(getCharFromInt(context_data_val));
                                context_data_val = 0;
                            }
                            else {
                                context_data_position++;
                            }
                            value = 0;
                        }
                        value = context_w.charCodeAt(0);
                        for (let i = 0; i < 16; i++) {
                            context_data_val = (context_data_val << 1) | (value & 1);
                            if (context_data_position == bitsPerChar - 1) {
                                context_data_position = 0;
                                context_data.push(getCharFromInt(context_data_val));
                                context_data_val = 0;
                            }
                            else {
                                context_data_position++;
                            }
                            value = value >> 1;
                        }
                    }
                    context_enlargeIn--;
                    if (context_enlargeIn == 0) {
                        context_enlargeIn = Math.pow(2, context_numBits);
                        context_numBits++;
                    }
                    delete context_dictionaryToCreate[context_w];
                }
                else {
                    value = context_dictionary[context_w];
                    for (let i = 0; i < context_numBits; i++) {
                        context_data_val = (context_data_val << 1) | (value & 1);
                        if (context_data_position == bitsPerChar - 1) {
                            context_data_position = 0;
                            context_data.push(getCharFromInt(context_data_val));
                            context_data_val = 0;
                        }
                        else {
                            context_data_position++;
                        }
                        value = value >> 1;
                    }
                }
                context_enlargeIn--;
                if (context_enlargeIn == 0) {
                    context_enlargeIn = Math.pow(2, context_numBits);
                    context_numBits++;
                }
                context_dictionary[context_wc] = context_dictSize++;
                context_w = String(context_c);
            }
        }
        if (context_w !== "") {
            if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
                if (context_w.charCodeAt(0) < 256) {
                    for (let i = 0; i < context_numBits; i++) {
                        context_data_val = context_data_val << 1;
                        if (context_data_position == bitsPerChar - 1) {
                            context_data_position = 0;
                            context_data.push(getCharFromInt(context_data_val));
                            context_data_val = 0;
                        }
                        else {
                            context_data_position++;
                        }
                    }
                    value = context_w.charCodeAt(0);
                    for (let i = 0; i < 8; i++) {
                        context_data_val = (context_data_val << 1) | (value & 1);
                        if (context_data_position == bitsPerChar - 1) {
                            context_data_position = 0;
                            context_data.push(getCharFromInt(context_data_val));
                            context_data_val = 0;
                        }
                        else {
                            context_data_position++;
                        }
                        value = value >> 1;
                    }
                }
                else {
                    value = 1;
                    for (let i = 0; i < context_numBits; i++) {
                        context_data_val = (context_data_val << 1) | value;
                        if (context_data_position == bitsPerChar - 1) {
                            context_data_position = 0;
                            context_data.push(getCharFromInt(context_data_val));
                            context_data_val = 0;
                        }
                        else {
                            context_data_position++;
                        }
                        value = 0;
                    }
                    value = context_w.charCodeAt(0);
                    for (let i = 0; i < 16; i++) {
                        context_data_val = (context_data_val << 1) | (value & 1);
                        if (context_data_position == bitsPerChar - 1) {
                            context_data_position = 0;
                            context_data.push(getCharFromInt(context_data_val));
                            context_data_val = 0;
                        }
                        else {
                            context_data_position++;
                        }
                        value = value >> 1;
                    }
                }
                context_enlargeIn--;
                if (context_enlargeIn == 0) {
                    context_enlargeIn = Math.pow(2, context_numBits);
                    context_numBits++;
                }
                delete context_dictionaryToCreate[context_w];
            }
            else {
                value = context_dictionary[context_w];
                for (let i = 0; i < context_numBits; i++) {
                    context_data_val = (context_data_val << 1) | (value & 1);
                    if (context_data_position == bitsPerChar - 1) {
                        context_data_position = 0;
                        context_data.push(getCharFromInt(context_data_val));
                        context_data_val = 0;
                    }
                    else {
                        context_data_position++;
                    }
                    value = value >> 1;
                }
            }
            context_enlargeIn--;
            if (context_enlargeIn == 0) {
                context_enlargeIn = Math.pow(2, context_numBits);
                context_numBits++;
            }
        }
        value = 2;
        for (let i = 0; i < context_numBits; i++) {
            context_data_val = (context_data_val << 1) | (value & 1);
            if (context_data_position == bitsPerChar - 1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
            }
            else {
                context_data_position++;
            }
            value = value >> 1;
        }
        let loop = true;
        do {
            context_data_val = context_data_val << 1;
            if (context_data_position == bitsPerChar - 1) {
                context_data.push(getCharFromInt(context_data_val));
                loop = false;
            }
            else
                context_data_position++;
        } while (loop);
        return context_data.join("");
    }
    _decompress(length, resetValue, getNextValue) {
        const dictionary = [];
        const result = [];
        const data = {
            val: getNextValue(0),
            position: resetValue,
            index: 1,
        };
        let enlargeIn = 4;
        let dictSize = 4;
        let numBits = 3;
        let entry = "";
        let c;
        let bits = 0;
        let maxpower = Math.pow(2, 2);
        let power = 1;
        for (let i = 0; i < 3; i += 1) {
            dictionary[i] = String(i);
        }
        while (power != maxpower) {
            const resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
                data.position = resetValue;
                data.val = getNextValue(data.index++);
            }
            bits |= (resb > 0 ? 1 : 0) * power;
            power <<= 1;
        }
        switch (bits) {
            case 0:
                bits = 0;
                maxpower = Math.pow(2, 8);
                power = 1;
                while (power != maxpower) {
                    const resb = data.val & data.position;
                    data.position >>= 1;
                    if (data.position == 0) {
                        data.position = resetValue;
                        data.val = getNextValue(data.index++);
                    }
                    bits |= (resb > 0 ? 1 : 0) * power;
                    power <<= 1;
                }
                c = String.fromCharCode(bits);
                break;
            case 1:
                bits = 0;
                maxpower = Math.pow(2, 16);
                power = 1;
                while (power != maxpower) {
                    const resb = data.val & data.position;
                    data.position >>= 1;
                    if (data.position == 0) {
                        data.position = resetValue;
                        data.val = getNextValue(data.index++);
                    }
                    bits |= (resb > 0 ? 1 : 0) * power;
                    power <<= 1;
                }
                c = String.fromCharCode(bits);
                break;
            case 2:
                return "";
        }
        if (c === undefined) {
            throw new Error("No character found");
        }
        dictionary[3] = String(c);
        let w = String(c);
        result.push(String(c));
        const forever = true;
        while (forever) {
            if (data.index > length) {
                return "";
            }
            bits = 0;
            maxpower = Math.pow(2, numBits);
            power = 1;
            while (power != maxpower) {
                const resb = data.val & data.position;
                data.position >>= 1;
                if (data.position == 0) {
                    data.position = resetValue;
                    data.val = getNextValue(data.index++);
                }
                bits |= (resb > 0 ? 1 : 0) * power;
                power <<= 1;
            }
            switch ((c = bits)) {
                case 0:
                    bits = 0;
                    maxpower = Math.pow(2, 8);
                    power = 1;
                    while (power != maxpower) {
                        const resb = data.val & data.position;
                        data.position >>= 1;
                        if (data.position == 0) {
                            data.position = resetValue;
                            data.val = getNextValue(data.index++);
                        }
                        bits |= (resb > 0 ? 1 : 0) * power;
                        power <<= 1;
                    }
                    dictionary[dictSize++] = String.fromCharCode(bits);
                    c = dictSize - 1;
                    enlargeIn--;
                    break;
                case 1:
                    bits = 0;
                    maxpower = Math.pow(2, 16);
                    power = 1;
                    while (power != maxpower) {
                        const resb = data.val & data.position;
                        data.position >>= 1;
                        if (data.position == 0) {
                            data.position = resetValue;
                            data.val = getNextValue(data.index++);
                        }
                        bits |= (resb > 0 ? 1 : 0) * power;
                        power <<= 1;
                    }
                    dictionary[dictSize++] = String.fromCharCode(bits);
                    c = dictSize - 1;
                    enlargeIn--;
                    break;
                case 2:
                    return result.join("");
            }
            if (enlargeIn == 0) {
                enlargeIn = Math.pow(2, numBits);
                numBits++;
            }
            if (dictionary[c]) {
                entry = String(dictionary[c]);
            }
            else {
                if (c === dictSize) {
                    entry = w + w.charAt(0);
                }
                else {
                    return null;
                }
            }
            result.push(entry);
            dictionary[dictSize++] = w + entry.charAt(0);
            enlargeIn--;
            w = entry;
            if (enlargeIn == 0) {
                enlargeIn = Math.pow(2, numBits);
                numBits++;
            }
        }
    }
    compressToUTF16(input) {
        if (input) {
            return this._compress(input, 15, (a) => String.fromCharCode(a + 32)) + " ";
        }
        else {
            return '';
        }
    }
    decompressFromUTF16(compressed) {
        if (compressed) {
            return this._decompress(compressed.length, 16384, (index) => compressed.charCodeAt(index) - 32);
        }
        else
            return null;
    }
}
console.log('upload v1');
let dt = datekey();
let ya_file_name = 'MiniumStudio-' + dt + '.json';
let ya_picture_name = 'MiniumStudio-' + dt + '.png';
let ya_access_token = check_ya_token();
let projecttextdata = '';
let previewArrayBuffer;
let image_download_link = '';
let project_download_link = '';
function dumpResultMessage(txt) {
    console.log('error', txt);
}
function check_ya_token() {
    if (window.location.hash) {
        let hash = window.location.hash.substring(1);
        if (hash) {
            let pars = hash.split('&');
            for (let ii = 0; ii < pars.length; ii++) {
                let namval = pars[ii].split('=');
                if (namval[0]) {
                    if (namval[1]) {
                        if (namval[0] == 'access_token') {
                            let ya_access_token = namval[1];
                            return ya_access_token;
                        }
                    }
                }
            }
        }
    }
    return '';
}
function textcell2(num) {
    if (num < 10) {
        return '0' + num;
    }
    else {
        return '' + num;
    }
}
function datekey() {
    let dd = new Date();
    return dd.getFullYear() + '.' + textcell2(dd.getMonth()) + '.' + textcell2(dd.getDay()) +
        '_' + textcell2(dd.getHours()) + '-' + textcell2(dd.getMinutes()) + '-' + textcell2(dd.getSeconds());
}
function sendRequest(token, url, method, jsonOrArrayBuffer, onError, onDone) {
    let xmlHttpRequest = new XMLHttpRequest();
    try {
        xmlHttpRequest.open(method, url, false);
        xmlHttpRequest.onload = function (vProgressEvent) {
            onDone(xmlHttpRequest, vProgressEvent);
        };
        xmlHttpRequest.onerror = function (vProgressEvent) {
            console.log('onerror', vProgressEvent);
            onError('request error');
        };
        if (token) {
            xmlHttpRequest.setRequestHeader("Authorization", 'OAuth ' + token);
        }
        if (jsonOrArrayBuffer) {
            xmlHttpRequest.send(jsonOrArrayBuffer);
        }
        else {
            xmlHttpRequest.send();
        }
    }
    catch (xx) {
        console.log('sendRequest', xx, xmlHttpRequest);
        onError('Can\'t send request');
    }
}
function readYaUploadURL(ya_access_token, filename, onError, onDone) {
    sendRequest(ya_access_token, 'https://cloud-api.yandex.net/v1/disk/resources/upload?path=app:/' + filename, 'GET', '', onError, (xmlHttpRequest, vProgressEvent) => {
        try {
            let json = JSON.parse(xmlHttpRequest.responseText);
            let ya_upload_url = json['href'];
            let ya_operation_id = json['operation_id'];
            onDone(ya_upload_url, ya_operation_id);
        }
        catch (xx) {
            console.log('parse', xx);
            onError('Can\'t parse response ' + xmlHttpRequest.responseText);
        }
    });
}
function uploadYaFileData(ya_upload_url, jsonOrArrayBuffer, onError, onDone) {
    sendRequest('', ya_upload_url, 'PUT', jsonOrArrayBuffer, onError, (xmlHttpRequest, vProgressEvent) => {
        onDone();
    });
}
function dumpYaOperationState(ya_operation_id, ya_access_token, onError, onDone) {
    sendRequest(ya_access_token, 'https://cloud-api.yandex.net/v1/disk/operations/' + ya_operation_id, 'GET', '', onError, (xmlHttpRequest, vProgressEvent) => {
        try {
            let json = JSON.parse(xmlHttpRequest.responseText);
            let status = json['status'];
            if (status == 'success') {
                onDone();
            }
            else {
                onError(xmlHttpRequest.responseText);
            }
        }
        catch (xx) {
            console.log('parse', xx);
            onError('Can\'t parse response ' + xmlHttpRequest.responseText);
        }
    });
}
function getYaLink(ya_file_name, ya_access_token, onError, onDone) {
    sendRequest(ya_access_token, 'https://cloud-api.yandex.net/v1/disk/resources/download?path=app:/' + ya_file_name, 'GET', '', onError, (xmlHttpRequest, vProgressEvent) => {
        try {
            let json = JSON.parse(xmlHttpRequest.responseText);
            let downurl = json['href'];
            onDone(downurl);
        }
        catch (xx) {
            onError('Can\'t parse response ' + xmlHttpRequest.responseText);
        }
    });
}
function getLinkUpload(ya_file_name, jsonOrArrayBuffer, ya_access_token, onError, onDone) {
    readYaUploadURL(ya_access_token, ya_file_name, onError, (href, operation_id) => {
        uploadYaFileData(href, jsonOrArrayBuffer, onError, () => {
            dumpYaOperationState(operation_id, ya_access_token, onError, () => {
                getYaLink(ya_file_name, ya_access_token, onError, (linkDownload) => {
                    onDone(linkDownload);
                });
            });
        });
    });
}
function postVKarticle() {
    let link = 'https://mzxbox.ru/minium/yaload.html?data=' + project_download_link;
    let url = 'https://vk.com/share.php'
        + '?noparse=true'
        + '&url=' + encodeURIComponent(link)
        + '&title=' + encodeURIComponent('Моя Mузыка')
        + '&image=' + encodeURIComponent(image_download_link)
        + '&description=' + encodeURIComponent(image_download_link);
    console.log('postVKarticle', url);
}
function yavkInit() {
    console.log('yavkInit');
    let lz = new LZUtil();
    let txt = localStorage.getItem('yavkpreview');
    if (txt) {
        let json = lz.decompressFromUTF16(txt);
        if (json) {
            let screenData = JSON.parse(json);
            let sz = 500;
            let canvas = document.getElementById("prvw");
            if (canvas) {
                let context = canvas.getContext('2d');
                var imageData = context.getImageData(0, 0, sz, sz);
                imageData.data.set(screenData);
                context.putImageData(imageData, 0, 0);
                canvas.toBlob((blob) => {
                    console.log('blob', blob);
                    if (blob) {
                        let pro = blob.arrayBuffer();
                        pro.catch((reason) => {
                            console.log('reason', reason);
                        });
                        pro.then((arrayBuffer) => {
                            console.log('arrayBuffer', arrayBuffer);
                            previewArrayBuffer = arrayBuffer;
                            let txt = localStorage.getItem('yavkdata');
                            let json = lz.decompressFromUTF16(txt);
                            if (json) {
                                projecttextdata = json;
                            }
                        });
                    }
                }, 'image/png');
            }
        }
    }
}
function startYAVKipload() {
    console.log('startYAVKipload');
    getLinkUpload(ya_file_name, projecttextdata, ya_access_token, dumpResultMessage, (link) => {
        project_download_link = link;
        console.log('project_download_link', project_download_link);
        getLinkUpload(ya_picture_name, previewArrayBuffer, ya_access_token, dumpResultMessage, (link) => {
            image_download_link = link;
            console.log('image_download_link', image_download_link);
        });
    });
}
//# sourceMappingURL=yavkupload.js.map