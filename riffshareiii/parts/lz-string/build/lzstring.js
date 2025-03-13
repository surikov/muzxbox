"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define("_compress", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports._compress = void 0;
    function _compress(uncompressed, bitsPerChar, getCharFromInt) {
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
    exports._compress = _compress;
});
define("_decompress", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports._decompress = void 0;
    function _decompress(length, resetValue, getNextValue) {
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
    exports._decompress = _decompress;
});
define("getBaseValue", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getBaseValue = void 0;
    const baseReverseDic = {};
    function getBaseValue(alphabet, character) {
        if (!baseReverseDic[alphabet]) {
            baseReverseDic[alphabet] = {};
            for (let i = 0; i < alphabet.length; i++) {
                baseReverseDic[alphabet][alphabet.charAt(i)] = i;
            }
        }
        return baseReverseDic[alphabet][character];
    }
    exports.getBaseValue = getBaseValue;
});
console.log('test lz');
define("UTF16/compressToUTF16", ["require", "exports", "_compress"], function (require, exports, _compress_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.compressToUTF16 = void 0;
    function compressToUTF16(input) {
        if (input == null)
            return "";
        return (0, _compress_1._compress)(input, 15, (a) => String.fromCharCode(a + 32)) + " ";
    }
    exports.compressToUTF16 = compressToUTF16;
});
define("UTF16/decompressFromUTF16", ["require", "exports", "_decompress"], function (require, exports, _decompress_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.decompressFromUTF16 = void 0;
    function decompressFromUTF16(compressed) {
        if (compressed == null)
            return "";
        if (compressed == "")
            return null;
        return (0, _decompress_1._decompress)(compressed.length, 16384, (index) => compressed.charCodeAt(index) - 32);
    }
    exports.decompressFromUTF16 = decompressFromUTF16;
});
define("UTF16/index", ["require", "exports", "UTF16/compressToUTF16", "UTF16/decompressFromUTF16"], function (require, exports, compressToUTF16_1, decompressFromUTF16_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.decompressFromUTF16 = exports.compressToUTF16 = void 0;
    Object.defineProperty(exports, "compressToUTF16", { enumerable: true, get: function () { return compressToUTF16_1.compressToUTF16; } });
    Object.defineProperty(exports, "decompressFromUTF16", { enumerable: true, get: function () { return decompressFromUTF16_1.decompressFromUTF16; } });
});
define("raw/compress", ["require", "exports", "_compress"], function (require, exports, _compress_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.compress = void 0;
    function compress(input) {
        if (input == null)
            return "";
        return (0, _compress_2._compress)(input, 16, (a) => String.fromCharCode(a));
    }
    exports.compress = compress;
});
define("Uint8Array/compressToUint8Array", ["require", "exports", "raw/compress"], function (require, exports, compress_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.compressToUint8Array = void 0;
    function compressToUint8Array(uncompressed) {
        const compressed = (0, compress_1.compress)(uncompressed);
        const buf = new Uint8Array(compressed.length * 2);
        for (let i = 0, TotalLen = compressed.length; i < TotalLen; i++) {
            const current_value = compressed.charCodeAt(i);
            buf[i * 2] = current_value >>> 8;
            buf[i * 2 + 1] = current_value % 256;
        }
        return buf;
    }
    exports.compressToUint8Array = compressToUint8Array;
});
define("raw/decompress", ["require", "exports", "_decompress"], function (require, exports, _decompress_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.decompress = void 0;
    function decompress(compressed) {
        if (compressed == null)
            return "";
        if (compressed == "")
            return null;
        return (0, _decompress_2._decompress)(compressed.length, 32768, (index) => compressed.charCodeAt(index));
    }
    exports.decompress = decompress;
});
define("Uint8Array/utils", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.convertFromUint8Array = exports.convertToUint8Array = void 0;
    function convertToUint8Array(data, forceEven) {
        if (typeof data === "string") {
            const isOdd = !forceEven && data.charCodeAt(data.length - 1) % 256 === 0;
            const buf = new Uint8Array(data.length * 2 - (isOdd ? 1 : 0));
            for (let i = 0; i < data.length; i++) {
                const current_value = data.charCodeAt(i);
                buf[i * 2] = current_value >>> 8;
                if (!isOdd || i < data.length - 1) {
                    buf[i * 2 + 1] = current_value % 256;
                }
            }
            return buf;
        }
        return data;
    }
    exports.convertToUint8Array = convertToUint8Array;
    function convertFromUint8Array(data) {
        const length = Math.floor(data.byteLength / 2);
        const arr = [];
        for (let i = 0; i < length; i++) {
            arr.push(String.fromCharCode(data[i * 2] * 256 + data[i * 2 + 1]));
        }
        if (data.byteLength & 1) {
            arr.push(String.fromCharCode(data[data.byteLength - 1] * 256));
        }
        return arr.join("");
    }
    exports.convertFromUint8Array = convertFromUint8Array;
});
define("Uint8Array/decompressFromUint8Array", ["require", "exports", "raw/decompress", "Uint8Array/utils"], function (require, exports, decompress_1, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.decompressFromUint8Array = void 0;
    function decompressFromUint8Array(compressed) {
        if (compressed === null || compressed === undefined) {
            return (0, decompress_1.decompress)(compressed);
        }
        else {
            return (0, decompress_1.decompress)((0, utils_1.convertFromUint8Array)(compressed));
        }
    }
    exports.decompressFromUint8Array = decompressFromUint8Array;
});
define("Uint8Array/index", ["require", "exports", "Uint8Array/compressToUint8Array", "Uint8Array/decompressFromUint8Array", "Uint8Array/utils"], function (require, exports, compressToUint8Array_1, decompressFromUint8Array_1, utils_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.convertToUint8Array = exports.convertFromUint8Array = exports.decompressFromUint8Array = exports.compressToUint8Array = void 0;
    Object.defineProperty(exports, "compressToUint8Array", { enumerable: true, get: function () { return compressToUint8Array_1.compressToUint8Array; } });
    Object.defineProperty(exports, "decompressFromUint8Array", { enumerable: true, get: function () { return decompressFromUint8Array_1.decompressFromUint8Array; } });
    Object.defineProperty(exports, "convertFromUint8Array", { enumerable: true, get: function () { return utils_2.convertFromUint8Array; } });
    Object.defineProperty(exports, "convertToUint8Array", { enumerable: true, get: function () { return utils_2.convertToUint8Array; } });
});
const Base64String = {
    compressToUTF16: function (input) {
        const output = [];
        let i;
        let c;
        let current;
        let status = 0;
        input = this.compress(input);
        current = 0;
        for (i = 0; i < input.length; i++) {
            c = input.charCodeAt(i);
            switch (status++) {
                case 0:
                    output.push(String.fromCharCode((c >> 1) + 32));
                    current = (c & 1) << 14;
                    break;
                case 1:
                    output.push(String.fromCharCode(current + (c >> 2) + 32));
                    current = (c & 3) << 13;
                    break;
                case 2:
                    output.push(String.fromCharCode(current + (c >> 3) + 32));
                    current = (c & 7) << 12;
                    break;
                case 3:
                    output.push(String.fromCharCode(current + (c >> 4) + 32));
                    current = (c & 15) << 11;
                    break;
                case 4:
                    output.push(String.fromCharCode(current + (c >> 5) + 32));
                    current = (c & 31) << 10;
                    break;
                case 5:
                    output.push(String.fromCharCode(current + (c >> 6) + 32));
                    current = (c & 63) << 9;
                    break;
                case 6:
                    output.push(String.fromCharCode(current + (c >> 7) + 32));
                    current = (c & 127) << 8;
                    break;
                case 7:
                    output.push(String.fromCharCode(current + (c >> 8) + 32));
                    current = (c & 255) << 7;
                    break;
                case 8:
                    output.push(String.fromCharCode(current + (c >> 9) + 32));
                    current = (c & 511) << 6;
                    break;
                case 9:
                    output.push(String.fromCharCode(current + (c >> 10) + 32));
                    current = (c & 1023) << 5;
                    break;
                case 10:
                    output.push(String.fromCharCode(current + (c >> 11) + 32));
                    current = (c & 2047) << 4;
                    break;
                case 11:
                    output.push(String.fromCharCode(current + (c >> 12) + 32));
                    current = (c & 4095) << 3;
                    break;
                case 12:
                    output.push(String.fromCharCode(current + (c >> 13) + 32));
                    current = (c & 8191) << 2;
                    break;
                case 13:
                    output.push(String.fromCharCode(current + (c >> 14) + 32));
                    current = (c & 16383) << 1;
                    break;
                case 14:
                    output.push(String.fromCharCode(current + (c >> 15) + 32, (c & 32767) + 32));
                    status = 0;
                    break;
            }
        }
        output.push(String.fromCharCode(current + 32));
        return output.join("");
    },
    decompressFromUTF16: function (input) {
        const output = [];
        let i = 0;
        let c;
        let current;
        let status = 0;
        current = 0;
        while (i < input.length) {
            c = input.charCodeAt(i) - 32;
            switch (status++) {
                case 0:
                    current = c << 1;
                    break;
                case 1:
                    output.push(String.fromCharCode(current | (c >> 14)));
                    current = (c & 16383) << 2;
                    break;
                case 2:
                    output.push(String.fromCharCode(current | (c >> 13)));
                    current = (c & 8191) << 3;
                    break;
                case 3:
                    output.push(String.fromCharCode(current | (c >> 12)));
                    current = (c & 4095) << 4;
                    break;
                case 4:
                    output.push(String.fromCharCode(current | (c >> 11)));
                    current = (c & 2047) << 5;
                    break;
                case 5:
                    output.push(String.fromCharCode(current | (c >> 10)));
                    current = (c & 1023) << 6;
                    break;
                case 6:
                    output.push(String.fromCharCode(current | (c >> 9)));
                    current = (c & 511) << 7;
                    break;
                case 7:
                    output.push(String.fromCharCode(current | (c >> 8)));
                    current = (c & 255) << 8;
                    break;
                case 8:
                    output.push(String.fromCharCode(current | (c >> 7)));
                    current = (c & 127) << 9;
                    break;
                case 9:
                    output.push(String.fromCharCode(current | (c >> 6)));
                    current = (c & 63) << 10;
                    break;
                case 10:
                    output.push(String.fromCharCode(current | (c >> 5)));
                    current = (c & 31) << 11;
                    break;
                case 11:
                    output.push(String.fromCharCode(current | (c >> 4)));
                    current = (c & 15) << 12;
                    break;
                case 12:
                    output.push(String.fromCharCode(current | (c >> 3)));
                    current = (c & 7) << 13;
                    break;
                case 13:
                    output.push(String.fromCharCode(current | (c >> 2)));
                    current = (c & 3) << 14;
                    break;
                case 14:
                    output.push(String.fromCharCode(current | (c >> 1)));
                    current = (c & 1) << 15;
                    break;
                case 15:
                    output.push(String.fromCharCode(current | c));
                    status = 0;
                    break;
            }
            i++;
        }
        return this.decompress(output.join(""));
    },
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    decompress: function (input) {
        const output = [];
        let chr1, chr2, chr3;
        let enc1, enc2, enc3, enc4;
        let i = 1;
        const odd = input.charCodeAt(0) >> 8;
        while (i < input.length * 2 && (i < input.length * 2 - 1 || odd == 0)) {
            if (i % 2 == 0) {
                chr1 = input.charCodeAt(i / 2) >> 8;
                chr2 = input.charCodeAt(i / 2) & 255;
                if (i / 2 + 1 < input.length)
                    chr3 = input.charCodeAt(i / 2 + 1) >> 8;
                else
                    chr3 = NaN;
            }
            else {
                chr1 = input.charCodeAt((i - 1) / 2) & 255;
                if ((i + 1) / 2 < input.length) {
                    chr2 = input.charCodeAt((i + 1) / 2) >> 8;
                    chr3 = input.charCodeAt((i + 1) / 2) & 255;
                }
                else
                    chr2 = chr3 = NaN;
            }
            i += 3;
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2) || (i == input.length * 2 + 1 && odd)) {
                enc3 = enc4 = 64;
            }
            else if (isNaN(chr3) || (i == input.length * 2 && odd)) {
                enc4 = 64;
            }
            output.push(this._keyStr.charAt(enc1));
            output.push(this._keyStr.charAt(enc2));
            output.push(this._keyStr.charAt(enc3));
            output.push(this._keyStr.charAt(enc4));
        }
        return output.join("");
    },
    compress: function (input) {
        let output = [];
        let ol = 1;
        let output_;
        let chr1, chr2, chr3;
        let enc1, enc2, enc3, enc4;
        let i = 0;
        let flush = false;
        input = input.replace(/[^A-Za-z0-9+/=]/g, "");
        while (i < input.length) {
            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            if (ol % 2 == 0) {
                output_ = chr1 << 8;
                flush = true;
                if (enc3 != 64) {
                    output.push(String.fromCharCode(output_ | chr2));
                    flush = false;
                }
                if (enc4 != 64) {
                    output_ = chr3 << 8;
                    flush = true;
                }
            }
            else {
                if (output_ === undefined) {
                    throw new Error("Impossible output error 1");
                }
                output.push(String.fromCharCode(output_ | chr1));
                flush = false;
                if (enc3 != 64) {
                    output_ = chr2 << 8;
                    flush = true;
                }
                if (enc4 != 64) {
                    output.push(String.fromCharCode(output_ | chr3));
                    flush = false;
                }
            }
            ol += 3;
        }
        if (flush) {
            if (output_ === undefined) {
                throw new Error("Impossible output error 1");
            }
            output.push(String.fromCharCode(output_));
            output = output.join("");
            output = String.fromCharCode(output.charCodeAt(0) | 256) + output.substring(1);
        }
        else {
            output = output.join("");
        }
        return output;
    },
};
define("base64/keyStrBase64", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
});
define("base64/compressToBase64", ["require", "exports", "_compress", "base64/keyStrBase64"], function (require, exports, _compress_3, keyStrBase64_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.compressToBase64 = void 0;
    keyStrBase64_1 = __importDefault(keyStrBase64_1);
    function compressToBase64(input) {
        if (input == null) {
            return "";
        }
        const res = (0, _compress_3._compress)(input, 6, (a) => keyStrBase64_1.default.charAt(a));
        switch (res.length % 4) {
            default:
            case 0:
                return res;
            case 1:
                return res + "===";
            case 2:
                return res + "==";
            case 3:
                return res + "=";
        }
    }
    exports.compressToBase64 = compressToBase64;
});
define("base64/decompressFromBase64", ["require", "exports", "_decompress", "getBaseValue", "base64/keyStrBase64"], function (require, exports, _decompress_3, getBaseValue_1, keyStrBase64_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.decompressFromBase64 = void 0;
    keyStrBase64_2 = __importDefault(keyStrBase64_2);
    function decompressFromBase64(input) {
        if (input == null)
            return "";
        if (input == "")
            return null;
        return (0, _decompress_3._decompress)(input.length, 32, (index) => (0, getBaseValue_1.getBaseValue)(keyStrBase64_2.default, input.charAt(index)));
    }
    exports.decompressFromBase64 = decompressFromBase64;
});
define("base64/index", ["require", "exports", "base64/compressToBase64", "base64/decompressFromBase64"], function (require, exports, compressToBase64_1, decompressFromBase64_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.decompressFromBase64 = exports.compressToBase64 = void 0;
    Object.defineProperty(exports, "compressToBase64", { enumerable: true, get: function () { return compressToBase64_1.compressToBase64; } });
    Object.defineProperty(exports, "decompressFromBase64", { enumerable: true, get: function () { return decompressFromBase64_1.decompressFromBase64; } });
});
define("custom/compressToCustom", ["require", "exports", "raw/compress"], function (require, exports, compress_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.compressToCustom = void 0;
    function compressToCustom(uncompressed, dict) {
        if (uncompressed == null)
            return "";
        const compressed = (0, compress_2.compress)(uncompressed);
        const charsPerUnicodeChar = Math.ceil(Math.log(65536) / Math.log(dict.length));
        let res = "";
        for (let i = 0, TotalLen = compressed.length; i < TotalLen; i++) {
            let current_value = compressed.charCodeAt(i);
            for (let j = charsPerUnicodeChar - 1; j >= 0; j--) {
                const selector = Math.floor(current_value / Math.pow(dict.length, j));
                current_value = current_value % Math.pow(dict.length, j);
                res += dict.charAt(selector);
            }
        }
        return res;
    }
    exports.compressToCustom = compressToCustom;
});
define("custom/decompressFromCustom", ["require", "exports", "raw/decompress"], function (require, exports, decompress_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.decompressFromCustom = void 0;
    function decompressFromCustom(compressed, dict) {
        if (compressed == null)
            return "";
        if (compressed == "")
            return null;
        if (dict.length < 2)
            return null;
        const charsPerUnicodeChar = Math.ceil(Math.log(65536) / Math.log(dict.length));
        if (compressed.length % charsPerUnicodeChar != 0)
            return null;
        let res = "";
        let current_value;
        let index;
        for (let i = 0, TotalLen = compressed.length; i < TotalLen; i = i + charsPerUnicodeChar) {
            current_value = 0;
            for (let j = 0; j < charsPerUnicodeChar; j++) {
                index = dict.indexOf(compressed[i + j]);
                current_value = current_value + index * Math.pow(dict.length, charsPerUnicodeChar - 1 - j);
            }
            res = res + String.fromCharCode(current_value);
        }
        return (0, decompress_2.decompress)(res);
    }
    exports.decompressFromCustom = decompressFromCustom;
});
define("custom/index", ["require", "exports", "custom/compressToCustom", "custom/decompressFromCustom"], function (require, exports, compressToCustom_1, decompressFromCustom_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.decompressFromCustom = exports.compressToCustom = void 0;
    Object.defineProperty(exports, "compressToCustom", { enumerable: true, get: function () { return compressToCustom_1.compressToCustom; } });
    Object.defineProperty(exports, "decompressFromCustom", { enumerable: true, get: function () { return decompressFromCustom_1.decompressFromCustom; } });
});
define("encodedURIComponent/keyStrUriSafe", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
});
define("encodedURIComponent/compressToEncodedURIComponent", ["require", "exports", "_compress", "encodedURIComponent/keyStrUriSafe"], function (require, exports, _compress_4, keyStrUriSafe_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.compressToEncodedURIComponent = void 0;
    keyStrUriSafe_1 = __importDefault(keyStrUriSafe_1);
    function compressToEncodedURIComponent(input) {
        if (input == null)
            return "";
        return (0, _compress_4._compress)(input, 6, (a) => keyStrUriSafe_1.default.charAt(a));
    }
    exports.compressToEncodedURIComponent = compressToEncodedURIComponent;
});
define("encodedURIComponent/decompressFromEncodedURIComponent", ["require", "exports", "_decompress", "getBaseValue", "encodedURIComponent/keyStrUriSafe"], function (require, exports, _decompress_4, getBaseValue_2, keyStrUriSafe_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.decompressFromEncodedURIComponent = void 0;
    keyStrUriSafe_2 = __importDefault(keyStrUriSafe_2);
    function decompressFromEncodedURIComponent(input) {
        if (input == null)
            return "";
        if (input == "")
            return null;
        input = input.replace(/ /g, "+");
        return (0, _decompress_4._decompress)(input.length, 32, (index) => (0, getBaseValue_2.getBaseValue)(keyStrUriSafe_2.default, input.charAt(index)));
    }
    exports.decompressFromEncodedURIComponent = decompressFromEncodedURIComponent;
});
define("encodedURIComponent/index", ["require", "exports", "encodedURIComponent/compressToEncodedURIComponent", "encodedURIComponent/decompressFromEncodedURIComponent"], function (require, exports, compressToEncodedURIComponent_1, decompressFromEncodedURIComponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.decompressFromEncodedURIComponent = exports.compressToEncodedURIComponent = void 0;
    Object.defineProperty(exports, "compressToEncodedURIComponent", { enumerable: true, get: function () { return compressToEncodedURIComponent_1.compressToEncodedURIComponent; } });
    Object.defineProperty(exports, "decompressFromEncodedURIComponent", { enumerable: true, get: function () { return decompressFromEncodedURIComponent_1.decompressFromEncodedURIComponent; } });
});
define("raw/index", ["require", "exports", "raw/compress", "raw/decompress"], function (require, exports, compress_3, decompress_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.decompress = exports.compress = void 0;
    Object.defineProperty(exports, "compress", { enumerable: true, get: function () { return compress_3.compress; } });
    Object.defineProperty(exports, "decompress", { enumerable: true, get: function () { return decompress_3.decompress; } });
});
//# sourceMappingURL=lzstring.js.map