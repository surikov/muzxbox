//import {Constants} from './constants';
//import {toMidi} from '@tonaljs/midi';
var NoNote = { empty: true, name: "", pc: "", acc: "" };
var REGEX = /^([a-gA-G]?)(#{1,}|b{1,}|x{1,}|)(-?\d*)\s*(.*)$/;
var SEMI = [0, 2, 4, 5, 7, 9, 11];
var cache = /* @__PURE__ */ new Map();
function tokenizeNote(str) {
  const m = REGEX.exec(str) as any;
  return [m[1].toUpperCase(), m[2].replace(/x/g, "##"), m[3], m[4]];
}
function parse(noteName) {
  const tokens = tokenizeNote(noteName);
  if (tokens[0] === "" || tokens[3] !== "") {
    return NoNote;
  }
  const letter = tokens[0];
  const acc = tokens[1];
  const octStr = tokens[2];
  const step = (letter.charCodeAt(0) + 3) % 7;
  const alt = accToAlt(acc);
  const oct = octStr.length ? +octStr : void 0;
  const coord = encode({ step, alt, oct });
  const name = letter + acc + octStr;
  const pc = letter + acc;
  const chroma = (SEMI[step] + alt + 120) % 12;
  const height = oct === void 0 ? mod(SEMI[step] + alt, 12) - 12 * 99 : SEMI[step] + alt + 12 * (oct + 1);
  const midi = height >= 0 && height <= 127 ? height : null;
  const freq = oct === void 0 ? null : Math.pow(2, (height - 69) / 12) * 440;
  return {
    empty: false,
    acc,
    alt,
    chroma,
    coord,
    freq,
    height,
    letter,
    midi,
    name,
    oct,
    pc,
    step
  };
}
var mod = (n, m) => (n % m + m) % m;
var FIFTHS = [0, 2, 4, -1, 1, 3, 5];
var STEPS_TO_OCTS = FIFTHS.map(
  (fifths) => Math.floor(fifths * 7 / 12)
);
function encode(pitch) {
  const { step, alt, oct, dir = 1 } = pitch;
  const f = FIFTHS[step] + 7 * alt;
  if (oct === void 0) {
    return [dir * f];
  }
  const o = oct - STEPS_TO_OCTS[step] - 4 * alt;
  return [dir * f, dir * o];
}
var fillStr = (s, n) => Array(Math.abs(n) + 1).join(s);
var altToAcc = (alt) => alt < 0 ? fillStr("b", -alt) : fillStr("#", alt);
var accToAlt = (acc) => acc[0] === "b" ? -acc.length : acc.length;
var stepToLetter = (step) => "CDEFGAB".charAt(step);
function pitchName(props) {
  const { step, alt, oct } = props;
  const letter = stepToLetter(step);
  if (!letter) {
    return "";
  }
  const pc = letter + altToAcc(alt);
  return oct || oct === 0 ? pc + oct : pc;
}

function note(src) {
  const stringSrc = JSON.stringify(src);
  const cached = cache.get(stringSrc);
  if (cached) {
    return cached;
  }
  const value = typeof src === "string" ? parse(src) : isPitch(src) ? note(pitchName(src)) : isNamed(src) ? note(src.name) : NoNote;
  cache.set(stringSrc, value);
  return value;
}
function isNamed(src) {
  return src !== null && typeof src === "object" && typeof src.name === "string" ? true : false;
}
function isPitch(pitch) {
  return pitch !== null && typeof pitch === "object" && typeof pitch.step === "number" && typeof pitch.alt === "number" ? true : false;
}
function isMidi(arg) {
  return +arg >= 0 && +arg <= 127;
}
function toMidi(pnote) {
  if (isMidi(pnote)) {
    return +pnote;
  }
  //const n = (0, import_core.note)(note);
  //const n = (0, note)(note);
  const n=note(pnote);
  return n.empty ? null : n.midi;
}
/**
 * Static utility functions used throughout the library.
 */
class Utils {

	/**
	 * Gets MidiWriterJS version number.
	 * @return {string}
	 */
	static version(): string {
		return Constants.VERSION;
	}

	/**
	 * Convert a string to an array of bytes
	 * @param {string} string
	 * @return {array}
	 */
	static stringToBytes(string: string): number[] {
		return string.split('').map(char => char.charCodeAt(0))
	}

	/**
	 * Checks if argument is a valid number.
	 * @param {*} n - Value to check
	 * @return {boolean}
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	static isNumeric(n: any): boolean {
		return !isNaN(parseFloat(n)) && isFinite(n)
	}

	/**
	 * Returns the correct MIDI number for the specified pitch.
	 * Uses Tonal Midi - https://github.com/danigb/tonal/tree/master/packages/midi
	 * @param {(string|number)} pitch - 'C#4' or midi note code
	 * @param {string} middleC
	 * @return {number}
	 */
	static getPitch(pitch: any, middleC = 'C4'): number {
		return 60 - toMidi(middleC) + toMidi(pitch);
	}

	/**
	 * Translates number of ticks to MIDI timestamp format, returning an array of
	 * hex strings with the time values. Midi has a very particular time to express time,
	 * take a good look at the spec before ever touching this function.
	 * Thanks to https://github.com/sergi/jsmidi
	 *
	 * @param {number} ticks - Number of ticks to be translated
	 * @return {array} - Bytes that form the MIDI time value
	 */
	static numberToVariableLength(ticks: number): number[] {
		ticks = Math.round(ticks);
		let buffer = ticks & 0x7F;

		// eslint-disable-next-line no-cond-assign
		while (ticks = ticks >> 7) {
			buffer <<= 8;
			buffer |= ((ticks & 0x7F) | 0x80);
		}

		const bList = [];
		// eslint-disable-next-line no-constant-condition
		while (true) {
			(bList as any).push(buffer & 0xff);

			if (buffer & 0x80) buffer >>= 8
			else { break; }
		}

		return bList;
	}

	/**
	 * Counts number of bytes in string
	 * @param {string} s
	 * @return {number}
	 */
	static stringByteCount(s: string): number {
		return encodeURI(s).split(/%..|./).length - 1
	}

	/**
	 * Get an int from an array of bytes.
	 * @param {array} bytes
	 * @return {number}
	 */
	static numberFromBytes(bytes: number[]): number {
		let hex = '';
		let stringResult;

		bytes.forEach((byte) => {
			stringResult = byte.toString(16);

			// ensure string is 2 chars
			if (stringResult.length == 1) stringResult = "0" + stringResult

			hex += stringResult;
		});

		return parseInt(hex, 16);
	}

	/**
	 * Takes a number and splits it up into an array of bytes.  Can be padded by passing a number to bytesNeeded
	 * @param {number} number
	 * @param {number} bytesNeeded
	 * @return {array} - Array of bytes
	 */
	static numberToBytes(number: number, bytesNeeded: number): number[] {
		bytesNeeded = bytesNeeded || 1;

		let hexString = number.toString(16);

		if (hexString.length & 1) { // Make sure hex string is even number of chars
			hexString = '0' + hexString;
		}

		// Split hex string into an array of two char elements
		const hexArray = hexString.match(/.{2}/g);

		// Now parse them out as integers
		const intArray = (hexArray as any).map(item => parseInt(item, 16))

		// Prepend empty bytes if we don't have enough
		if (intArray.length < bytesNeeded) {
			while (bytesNeeded - intArray.length > 0) {
				intArray.unshift(0);
			}
		}

		return intArray;
	}

	/**
	 * Converts value to array if needed.
	 * @param {any} value
	 * @return {array}
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	static toArray(value: any): any[] {
		if (Array.isArray(value)) return value;
		return [value];
	}

	/**
	 * Converts velocity to value 0-127
	 * @param {number} velocity - Velocity value 1-100
	 * @return {number}
	 */
	static convertVelocity(velocity: number): number {
		// Max passed value limited to 100
		velocity = velocity > 100 ? 100 : velocity;
		return Math.round(velocity / 100 * 127);
	}

	/**
	 * Gets the total number of ticks of a specified duration.
	 * Note: type=='note' defaults to quarter note, type==='rest' defaults to 0
	 * @param {(string|array)} duration
	 * @return {number}
	 */
	static getTickDuration(duration: (string | string[] | number)): number {
		if (Array.isArray(duration)) {
			// Recursively execute this method for each item in the array and return the sum of tick durations.
			return duration.map((value) => {
				return Utils.getTickDuration(value);
			}).reduce((a, b) => {
				return a + b;
			}, 0);
		}

		duration = duration.toString();

		if (duration.toLowerCase().charAt(0) === 't') {
			// If duration starts with 't' then the number that follows is an explicit tick count
			const ticks = parseInt(duration.substring(1));

			if (isNaN(ticks) || ticks < 0) {
				throw new Error(duration + ' is not a valid duration.');
			}

			return ticks;
		}

		// Need to apply duration here.  Quarter note == Constants.HEADER_CHUNK_DIVISION
		const quarterTicks = Utils.numberFromBytes(Constants.HEADER_CHUNK_DIVISION);
		const tickDuration = quarterTicks * Utils.getDurationMultiplier(duration);
		return Utils.getRoundedIfClose(tickDuration)
	}

	/**
	 * Due to rounding errors in JavaScript engines,
	 * it's safe to round when we're very close to the actual tick number
	 *
	 * @static
	 * @param {number} tick
	 * @return {number}
	 */
	static getRoundedIfClose(tick: number): number {
		const roundedTick = Math.round(tick);
		return Math.abs(roundedTick - tick) < 0.000001 ? roundedTick : tick;
	}

	/**
	 * Due to low precision of MIDI,
	 * we need to keep track of rounding errors in deltas.
	 * This function will calculate the rounding error for a given duration.
	 *
	 * @static
	 * @param {number} tick
	 * @return {number}
	 */
	static getPrecisionLoss(tick: number): number {
		const roundedTick = Math.round(tick);
		return roundedTick - tick;
	}

	/**
	 * Gets what to multiple ticks/quarter note by to get the specified duration.
	 * Note: type=='note' defaults to quarter note, type==='rest' defaults to 0
	 * @param {string} duration
	 * @return {number}
	 */
	static getDurationMultiplier(duration: string): number {
		// Need to apply duration here.
		// Quarter note == Constants.HEADER_CHUNK_DIVISION ticks.

		if (duration === '0') return 0;

		const match = duration.match(/^(?<dotted>d+)?(?<base>\d+)(?:t(?<tuplet>\d*))?/);
		if (match) {
			const base = Number((match.groups as any).base);
			// 1 or any power of two:
			const isValidBase = base === 1 || ((base & (base - 1)) === 0);
			if (isValidBase) {
				// how much faster or slower is this note compared to a quarter?
				const ratio = base / 4;
				let durationInQuarters = 1 / ratio;
				//const {dotted, tuplet} = match.groups;
				let match_groups=match.groups as any;
				let dotted=match_groups["dotted"];
				let tuplet=match_groups["tuplet"];
				if (dotted) {
					const thisManyDots = dotted.length;
					const divisor = Math.pow(2, thisManyDots);
					durationInQuarters = durationInQuarters + (durationInQuarters * ((divisor - 1) / divisor));
				}
				if (typeof tuplet === 'string') {
					const fitInto = durationInQuarters * 2;
					// default to triplet:
					const thisManyNotes = Number(tuplet || '3');
					durationInQuarters = fitInto / thisManyNotes;
				}
				return durationInQuarters
			}
		}
		throw new Error(duration + ' is not a valid duration.');
	}
}

//export {Utils};
