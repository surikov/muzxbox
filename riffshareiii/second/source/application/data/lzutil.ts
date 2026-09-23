type Dictionary = Record<string, number>;
type PendingDictionary = Record<string, true>;
type DictionaryCollection = Record<string, Dictionary>;
interface DecompressionTracker {
	val: number;
	position: number;
	index: number;
}
class LZUtil {

	keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";


	baseReverseDic: DictionaryCollection = {};
	getBaseValue(alphabet: string, character: string): number {
		if (!this.baseReverseDic[alphabet]) {
			this.baseReverseDic[alphabet] = {};
			for (let i = 0; i < alphabet.length; i++) {
				this.baseReverseDic[alphabet][alphabet.charAt(i)] = i;
			}
		}
		return this.baseReverseDic[alphabet][character];
	}

	_compress(
		uncompressed: string | null,
		bitsPerChar: number,
		getCharFromInt: (a: number) => string,
	): string {
		if (uncompressed == null) {
			return "";
		}

		let value: number;
		const context_dictionary: Dictionary = {};
		const context_dictionaryToCreate: PendingDictionary = {};
		let context_c = "";
		let context_wc = "";
		let context_w = "";
		let context_enlargeIn = 2; // Compensate for the first entry which should not count
		let context_dictSize = 3;
		let context_numBits = 2;
		const context_data: string[] = [];
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
			} else {
				if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
					if (context_w.charCodeAt(0) < 256) {
						for (let i = 0; i < context_numBits; i++) {
							context_data_val = context_data_val << 1;
							if (context_data_position == bitsPerChar - 1) {
								context_data_position = 0;
								context_data.push(getCharFromInt(context_data_val));
								context_data_val = 0;
							} else {
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
							} else {
								context_data_position++;
							}
							value = value >> 1;
						}
					} else {
						value = 1;
						for (let i = 0; i < context_numBits; i++) {
							context_data_val = (context_data_val << 1) | value;
							if (context_data_position == bitsPerChar - 1) {
								context_data_position = 0;
								context_data.push(getCharFromInt(context_data_val));
								context_data_val = 0;
							} else {
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
							} else {
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
				} else {
					value = context_dictionary[context_w];
					for (let i = 0; i < context_numBits; i++) {
						context_data_val = (context_data_val << 1) | (value & 1);
						if (context_data_position == bitsPerChar - 1) {
							context_data_position = 0;
							context_data.push(getCharFromInt(context_data_val));
							context_data_val = 0;
						} else {
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
				// Add wc to the dictionary.
				context_dictionary[context_wc] = context_dictSize++;
				context_w = String(context_c);
			}
		}
		// Output the code for w.
		if (context_w !== "") {
			if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
				if (context_w.charCodeAt(0) < 256) {
					for (let i = 0; i < context_numBits; i++) {
						context_data_val = context_data_val << 1;
						if (context_data_position == bitsPerChar - 1) {
							context_data_position = 0;
							context_data.push(getCharFromInt(context_data_val));
							context_data_val = 0;
						} else {
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
						} else {
							context_data_position++;
						}
						value = value >> 1;
					}
				} else {
					value = 1;
					for (let i = 0; i < context_numBits; i++) {
						context_data_val = (context_data_val << 1) | value;
						if (context_data_position == bitsPerChar - 1) {
							context_data_position = 0;
							context_data.push(getCharFromInt(context_data_val));
							context_data_val = 0;
						} else {
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
						} else {
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
			} else {
				value = context_dictionary[context_w];
				for (let i = 0; i < context_numBits; i++) {
					context_data_val = (context_data_val << 1) | (value & 1);
					if (context_data_position == bitsPerChar - 1) {
						context_data_position = 0;
						context_data.push(getCharFromInt(context_data_val));
						context_data_val = 0;
					} else {
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
		// Mark the end of the stream
		value = 2;
		for (let i = 0; i < context_numBits; i++) {
			context_data_val = (context_data_val << 1) | (value & 1);
			if (context_data_position == bitsPerChar - 1) {
				context_data_position = 0;
				context_data.push(getCharFromInt(context_data_val));
				context_data_val = 0;
			} else {
				context_data_position++;
			}
			value = value >> 1;
		}
		// Flush the last char
		let loop = true;

		do {
			context_data_val = context_data_val << 1;
			if (context_data_position == bitsPerChar - 1) {
				context_data.push(getCharFromInt(context_data_val));
				loop = false;
			} else context_data_position++;
		} while (loop);

		return context_data.join("");
	}
	_decompress(length: number, resetValue: number, getNextValue: (a: number) => number) {
		const dictionary: string[] = [];
		const result: string[] = [];
		const data: DecompressionTracker = {
			val: getNextValue(0),
			position: resetValue,
			index: 1,
		};
		let enlargeIn = 4;
		let dictSize = 4;
		let numBits = 3;
		let entry = "";
		let c: string | number;
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
		if (c! === undefined) {
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
			} else {
				if (c === dictSize) {
					entry = w + w.charAt(0);
				} else {
					return null;
				}
			}
			result.push(entry);
			// Add w+entry[0] to the dictionary.
			dictionary[dictSize++] = w + entry.charAt(0);
			enlargeIn--;
			w = entry;
			if (enlargeIn == 0) {
				enlargeIn = Math.pow(2, numBits);
				numBits++;
			}
		}
	}
	/*compressToBase64(input: string | null): string {
		if (input == null) {
			return "";
		}

		const res = this._compress(input, 6, (a) => this.keyStrBase64.charAt(a));

		// To produce valid Base64
		switch (res.length % 4) {
			default: // When could this happen ?
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
	decompressFromBase64(input: string | null) {
		if (input == null) return "";
		if (input == "") return null;

		return this._decompress(input.length, 32, (index) => this.getBaseValue(this.keyStrBase64, input.charAt(index)));
	}
	compressToEncodedURIComponent(input: string | null) {
		if (input == null) return "";

		return this._compress(input, 6, (a) => this.keyStrUriSafe.charAt(a));
	}
	decompressFromEncodedURIComponent(input: string | null) {
		if (input == null) return "";
		if (input == "") return null;

		input = input.replace(/ /g, "+");

		return this._decompress(input.length, 32, (index) => this.getBaseValue(this.keyStrUriSafe, input!.charAt(index)));
	}*/
	compressToUTF16(input: string | null| undefined):string {
		//if (input == null) return "";
		if(input){
		return this._compress(input, 15, (a) => String.fromCharCode(a + 32)) + " ";
		}else{
			return '';
		}
	}
	decompressFromUTF16(compressed: string | null | undefined) {
		//if (compressed == null) return "";
		//if (compressed == "") return null;
		if (compressed) {
			return this._decompress(compressed.length, 16384, (index) => compressed.charCodeAt(index) - 32);
		}
		else return null;
	}



}
/*
console.log('===lztest');
let teststring = 'Mar 12, 2022 — LZ-based compression algorithm for TypeScript projects (Browser, Node.js). Latest version: 1.1.2, last published: 3 years ago. WebAudioFont is a set of resources and associated technology that uses sample-based synthesis to play musical instruments in the browser. You can choose from thousands of instrument, see Catalog. Это значит, что можно запустить приложение с одним набором зависимостей, а рядом — второе с другим. Это значит, что можно сохранить все связки приложения, упаковать его в контейнер и деплоить где угодно — и знать, что оно точно запустится. Есть нюансы с переходом между ARM-архитектурой и x86, но в целом контейнеры универсальны. Для быстрого создания какого-то продукта часто используют различные open source решения. Но применение открытого ПО несёт в себе определённые риски: от финансовых до юридических. Потому что разработка на базе ПО с открытым исходным кодом не означает бесконтрольное использование созданных на этом коде продуктов из-за действия соответствующей лицензии: BSD, GNU, MIT, LGPL, AGPL, BSPL, SSPL, Demoware License, Apache License 2.0, RSAL и других. А в соответствии со статьями 1252 и 1301 ГК РФ иски о нарушении лицензионного права предъявляются к юридическому лицу, использующему указанное программное обеспечение. ';

console.log(teststring);
console.log(teststring.length);
let lzu = new LZUtil();
let cmpr: string = lzu.compressToUTF16(teststring);
//let cmpr: string = compressToBase64(teststring);
console.log(cmpr);
console.log(cmpr.length);
let dcp = lzu.decompressFromUTF16(cmpr);
//let dcp = decompressFromBase64(cmpr);
console.log(dcp);
if (dcp)
	console.log(dcp.length);
	
	*/
