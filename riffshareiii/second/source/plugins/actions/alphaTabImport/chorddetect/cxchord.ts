//https://github.com/cfjello/CxChord
class lodash {
	has11(chordMap: ChordMap, chordName: string): boolean {
		if (chordMap[chordName]) {
			return true;
		} else {
			return false
		}
	}
	sortedUniq(arr) {
		return arr.filter((item, index) => index === 0 || item !== arr[index - 1]);

	}
	isNumber(value) {
		return typeof value === 'number' ||
			(typeof value === 'object' && value !== null && Object.prototype.toString.call(value) === '[object Number]');
	}
	difference = (arr, ...others) => {
		const exclude = new Set(others.flat());
		return arr.filter((item) => !exclude.has(item));
	};
	filter(arr, func: (vv) => boolean) {
		//_.filter(users, o => !o.active);

		// Pure JS
		arr.filter((element, index, array) => {
			return func(element);
		});
		/*
		const lastRow = _.filter(posteriorLastRow,
					function (p: Posterior) {
						return (p.hypo!.key == form)
					})
		*/


	}
	sum(arr) {
		return arr.reduce((acc, val) => acc + val, 0);

	}
	take(arr, n = 1) {
		return arr.slice(0, n);

	}
	isUndefined(value) {
		return value === undefined;

	}
	drop(array, n = 1) {
		array.slice(n); return array;

	}
	head(arr) {
		return arr[0];

	}
	intersection(...arrays) {
		if (arrays.length === 0) return [];

		// Convert subsequent arrays to Sets for O(1) lookup performance
		const sets = arrays.slice(1).map(arr => new Set(arr));

		// Filter unique items from the first array that exist in all other Sets
		const result = arrays[0].filter(item =>
			sets.every(set => set.has(item))
		);

		return [...new Set(result)];
	}
	isEmpty(value) {
		if (value == null) {
			return true;
		}

		if (Array.isArray(value) || typeof value === 'string' || typeof value.splice === 'function') {
			return value.length === 0;
		}

		if (value instanceof Map || value instanceof Set) {
			return value.size === 0;
		}

		if (typeof value === 'object') {
			return Object.keys(value).length === 0;
		}

		// Primitives like numbers, booleans, and symbols return true in Lodash
		return true;
	}
	forEach(collection, iteratee) {
		if (!collection) return collection;

		if (Array.isArray(collection) || typeof collection === 'string') {
			for (let i = 0; i < collection.length; i++) {
				if (iteratee(collection[i], i, collection) === false) {
					break;
				}
			}
		} else if (typeof collection === 'object') {
			const keys = Object.keys(collection);
			for (let i = 0; i < keys.length; i++) {
				const key = keys[i];
				if (iteratee(collection[key], key, collection) === false) {
					break;
				}
			}
		}

		return collection;
	}
	orderBy(collection, iteratees = [], orders = []) {
		const keys = Array.isArray(iteratees) ? iteratees : [iteratees];
		const sortOrders = Array.isArray(orders) ? orders : [orders];

		return [...collection].sort((a, b) => {
			for (let i = 0; i < keys.length; i++) {
				const iteratee = keys[i];
				const direction = sortOrders[i] === 'desc' ? -1 : 1;

				const valA = typeof iteratee === 'function' ? (iteratee as any)(a) : a[iteratee];
				const valB = typeof iteratee === 'function' ? (iteratee as any)(b) : b[iteratee];

				if (valA < valB) return -1 * direction;
				if (valA > valB) return 1 * direction;
			}
			return 0;
		});
	}
	map(datacollection, fiteratee = (ival) => ival) {
		/*
		const squaredDiffs = _.map(data, function (value: number) {
					const diff = value - avg
					return diff * diff
				})
		*/
		if (!datacollection) return [];

		if (Array.isArray(datacollection)) {
			return datacollection.map(fiteratee);
		}

		let res = Object.entries(datacollection).map(([key, value]) =>
			//iteratee(value, key, collection)
			fiteratee(value)
		);
		return res;

	}
	has(obj, path) {
		if (obj == null || !path) return false;

		// Convert string paths like 'a[0].b' into ['a', '0', 'b']
		const keys = Array.isArray(path)
			? path
			: path.replace(/\[(\d+)\]/g, '.$1').split('.').filter(Boolean);

		let current = obj;

		for (const key of keys) {
			if (current == null || !Object.hasOwn(current, key)) {
				return false;
			}
			current = current[key];
		}

		return true;
	}
	forIn(object, iteratee) {

		for (const key in object) {
			if (iteratee(object[key], key, object) === false) {
				break;
			}
		}

		return object;
	}
	isEqual(a, b, visited = new WeakMap()) {
		// 1. Handle identical references and primitives (including NaN === NaN)
		if (Object.is(a, b)) return true;

		// 2. If either is null or not an object, they aren't equal
		if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') {
			return false;
		}

		// 3. Prevent infinite loops on circular references
		if (visited.has(a)) return visited.get(a) === b;
		visited.set(a, b);

		// 4. Handle built-in object types with distinct prototypes
		if (a.constructor !== b.constructor) return false;

		if (a instanceof Date) {
			return Object.is(a.getTime(), b.getTime());
		}

		if (a instanceof RegExp) {
			return a.source === b.source && a.flags === b.flags;
		}

		if (a instanceof Map) {
			if (a.size !== b.size) return false;
			for (const [key, val] of a) {
				if (!b.has(key) || !this.isEqual(val, b.get(key), visited)) return false;
			}
			return true;
		}

		if (a instanceof Set) {
			if (a.size !== b.size) return false;
			for (const val of a) {
				if (!b.has(val)) return false;
			}
			return true;
		}

		// 5. Handle Arrays
		if (Array.isArray(a)) {
			if (a.length !== b.length) return false;
			for (let i = 0; i < a.length; i++) {
				if (!this.isEqual(a[i], b[i], visited)) return false;
			}
			return true;
		}

		// 6. Handle Plain Objects
		const keysA = Object.keys(a);
		const keysB = Object.keys(b);
		if (keysA.length !== keysB.length) return false;

		for (const key of keysA) {
			if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
			if (!this.isEqual(a[key], b[key], visited)) return false;
		}

		return true;
	}
	isArray(value) {
		return Object.prototype.toString.call(value) === '[object Array]';
	}
};
let _ = new lodash();
interface Hypothesis {
	idx: number
	key: string
	inv: number
	len: number
	root: number
	group: number
}
interface ChordMatchIntf {
	hypo: Hypothesis,
	chord: string
	root: string
	type: string
	bass: string
	inv: number
	notes: number[]
	list: string
}
interface RootNoteNames {
	[key: string]: string[]
}
interface ChordMapEntry {
	notes: number[]
	root: number
	inv: number
	group: number
	count?: number
	probability?: number
}
interface ChordMap {
	[key: string]: ChordMapEntry
}
interface ChordMapTable {
	[key: string]: ChordMapEntry[]
}
interface MatchedNotes {
	[key: string]: {
		invertions: any[]
		extensions: any[]
		knockouts: any[]
		mustHave: any[]
		rootNotes: any[]
		conflicts: any[]
		roots: number[]
		group: number
	}
}
interface RuleFx {
	(chord: ChordInstance, bayes: BayesChordCalculator, row: number, col: number): number
}
interface Posterior {
	post: number,
	idx: number,
	hypo?: Hypothesis
}
interface Rule {
	rule?: string
	chord: ChordInstance
	ruleFx: RuleFx
}
interface Conflicts {
	[key: string]: any[][]
}

enum GR { shell = 1, standard = 2, altered = 4, extented = 8, rootLess = 16, reduced = 32, cluster = 64, passing = 128 }
const rootNoteNames: RootNoteNames = {
	sharp: ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"],
	flat: ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"]
}
const conflicts: Conflicts = { // Each entry is one set off 2 conflciting notes
	// Major
	/*
	"Maj"  		: [[4,5],[10,11]],
	"Maj7" 		: [], 
	"Maj79" 	: [], 
	"Maj79#11" 	: [], 
	"Maj79#1113": [], 
	"Maj6"		: [],
	"Maj69"		: [],
	*/
	// "Maj,7,b5"		: [[6,7]],
	/*
	"Maj-add2"	: [],
	"Maj-add9"	: [],
	"Maj-add9no5":[],
	*/
	"Maj,#5": [[7, 8]],
	// Minor
	"Min": [[5, 6], [7, 8]],
	"Min,6": [[5, 6], [7, 8]],
	"Min,6,9": [[5, 6], [7, 8]],
	"Min,6,9,-1": [[5, 6], [7, 8]],
	"Min,7": [[5, 6], [7, 8]],
	"Min,7,9": [[5, 6], [7, 8]],
	"Min,7,9,-1": [[5, 6], [7, 8]],
	"Min,7,b5": [[5, 6], [7, 8]],
	"Min,M7": [[5, 6], [7, 8]],
	// "MinCluster,7,9,-1": [[5,6], [7,8]]
	// Dominant
	/*
	"Dom7"		: [],
	"Dom7#5"	: [],
	"Dom7b5"	: [],
	"Dom7sus4"	: [],
	"Dom7sus2"	: [],
	// Jazz type no-root chords
	"Dom79-no root"  : [],
	"Dom7b9-no root" : [],
	"Dom7#9-no root" : [],
	"Dim"		: [],
	"Dim7WH"	: [],
	"Dim7HW"	: []
	*/
}
const knockouts: { [key: string]: number[] } = { // Is checked in two octaves
	// Major
	"Maj": [1, 3, 5, 8, 10],
	"Maj,7": [1, 3, 5, 8, 10],
	"Maj,7,9": [1, 3, 5, 8, 10],
	"Maj,7,9,#11": [1, 3, 5, 8, 10],
	"Maj,7,9,#11,13": [1, 3, 5, 8, 10],
	"Maj,6": [1, 3, 5, 8, 10],
	"Maj,6,9": [1, 3, 5, 8, 10],
	"Maj,7,b5": [1, 3, 5, 7, 8, 10],
	"Maj,add2": [1, 3, 5, 8, 10, 11, 14],
	"Maj,add9": [1, 3, 5, 8, 9, 10, 11],
	// "Maj,add9no5": [1,3,5,8,10],
	"Maj,#5": [1, 3, 5, 7, 10],
	"5": [1, 2, 3, 4, 5, 6, 8, 9, 10, 11],
	// Minor
	"Min": [1, 4, 6, 8, 11],
	"Min,6": [1, 4, 6, 8],
	"Min,6,9": [1, 4, 6, 8],
	"Min,7": [1, 4, 6, 8, 11],
	"Min,7,9": [1, 4, 6, 8, 11],
	"Min,7,b5": [4, 7, 8, 11],
	"Min,M7": [1, 4, 6, 8, 10],
	"MinCluster,7,9,-1": [1, 4, 8],
	// Diminished
	"Dim": [4, 7, 9, 10, 11],
	"Dim,7": [1, 2, 4, 5, 7, 8, 10, 11],
	"Dim,7(HW)": [2, 5, 8, 11],
	"Dim,7(WH)": [1, 4, 7, 10],
	// "Half-Dim7" : [4,7,11],
	// Dominant
	"Dom,7": [5, 11],
	"Dom,7,#5": [5, 11],
	"Dom,7,sus4": [4, 11],
	// "Dom7sus4#5": [4,11],
	"Dom,7,b5": [5, 7, 11],
	// Quater types
	"Sus2": [1, 3, 4, 5, 8],
	"Sus4": [1, 3, 4, 6, 8],
	// "Quater"	: [1,3,4,5,8,],
	// Jazz reduced chords
	"Maj,7,-5": [1, 3, 5, 6, 7, 8, 10],
	"Maj,6,-5": [1, 3, 5, 6, 7, 8, 10],
	"Min,6,-5": [1, 4, 6, 7, 8],
	"Min,7,-5": [1, 4, 6, 7, 8, 11],
	// Jazz type no-root chords
	"Maj,6,9,-1(A)": [0, 1, 3, 5, 6, 8, 10],
	"Maj,6,9,-1(B)": [0, 1, 3, 5, 6, 8, 10],
	"Maj,7,9,-1(A)": [0, 1, 3, 5, 6, 8, 10],
	"Maj,7,9,-1(B)": [0, 1, 3, 5, 6, 8, 10],
	"Maj,7,9,-1": [0, 1, 3, 5, 6, 8, 10],
	"Min,6,9,-1(A)": [0, 4, 6, 8, 10, 11],
	"Min,6,9,-1(B)": [0, 4, 6, 8, 10, 11],
	"Min,7,9,-1(A)": [0, 4, 6, 8, 11],
	"Min,7,9,-1(B)": [0, 4, 6, 8, 11],
	// "Min,7,b5(A)"	: [0,4,7,8,11],
	// "Min,7,b5(B)"	: [0,4,7,8,11],			
	"Min,6,9,-1": [1, 4, 8],
	"Min,7,9,-1": [1, 4, 8],
	"Dom,7,9,-1(A)": [0, 1, 3, 5, 8, 11],
	"Dom,7,9,-1(B)": [0, 1, 3, 5, 8, 11],
	"Dom,7,b9,b13,-1(A)": [0, 2, 5, 8, 11],
	"Dom,7,b9,b13,-1(B)": [0, 2, 5, 8, 11],
	"Dom,7,9,13,-1,-5": [0, 5, 7, 11],
	"Dom,7,9,-1": [0, 5, 7, 11],
	"Dom,7,b9,-1": [0, 5, 7, 11],
	"Dom,7,#9,-1": [0, 5, 7, 11],
	// "Dom7Cluster,-1": [0,5,7,11]
}
const extensions: { [key: string]: number[] } = {
	"Maj": [14, 18, 21],
	"Maj,7": [14, 18, 21],
	"Min": [14, 17, 21, 13, 18],
	"Min,M7": [14, 17, 21, 18],
	// "Dim7HW"   : [14,17,20,23], 
	// "Dim7WH"   : [14,17,20,23], 
	// "Half-Dim7": [14,17,20,21],
	"Maj,#5": [14, 18],
	"Dom,7": [13, 14, 18, 21],
	"Dom,7,#5": [13, 14, 15, 18, 19],
	"Dom,7,b5": [13, 14, 15, 19, 20, 21]
	// TODO: Add the rest later			
}
const mustHave: { [key: string]: number[] } = {
	// Major
	"Maj": [4],
	"Maj,7": [4, 11],
	"Maj,7,9": [4, 11],
	"Maj,7,9,#11": [4, 11],
	"Maj,7,9,#11,13": [4, 11],
	"Maj,6": [4, 9],
	"Maj,6,9": [4, 9],
	"Maj,6,9,-1": [4, 9],
	// "Maj,7,b5"		: [0,4,6,11],
	"Maj,add2": [2, 4],
	"Maj,add9": [4, 14],
	// "Maj-add9no5":[4,14],
	"Maj,#5": [0, 4, 8],
	// Sus Types
	"Sus2": [0, 2, 7],
	"Sus4": [0, 5, 7],
	// Minor
	"Min": [3],
	"Min,6": [3, 9],
	"Min,6,9": [3, 9],
	"Min,6,9,-1": [3, 9],
	"Min,7": [3, 10],
	"Min,7,9": [3, 10],
	"Min,7,9,-1": [3, 10],
	"Min,7,b5": [3, 6, 10],
	"Min,M7": [3, 11],
	// Dominant
	"Dom,7": [4, 10],
	"Dom,7,9": [4, 10],
	"Dom,7,#5": [4, 8, 10],
	"Dom,7,b5": [4, 6, 10],
	"Dom,7,sus4": [5, 10],
	"Dom,7,sus2": [2, 10],
	"Dim": [0, 3, 6],
	"Dim,7(WH)": [0, 3, 6, 9],
	"Dim,7(HW)": [0, 3, 6, 9],
	// Jazz type no-root chords
	"Dom,7,9,-1": [4, 10],
	"Dom,7,b9,-1": [4, 10],
	"Dom,7,#9,-1": [4, 10],
	"Dom,7,9,13,-1,-5": [4, 10, 21],
}

const chordMap: ChordMap = {
	"Maj": { notes: [0, 4, 7], root: 0, inv: 0, group: GR.standard },
	"Maj,7": { notes: [0, 4, 7, 11], root: 0, inv: 0, group: GR.standard },
	"Maj,7,9": { notes: [0, 4, 7, 11, 14], root: 0, inv: 0, group: GR.extented },
	"Maj,7,9,#11": { notes: [0, 4, 7, 11, 14, 18], root: 0, inv: 0, group: GR.extented },
	"Maj,7,9,#11,13": { notes: [0, 4, 7, 11, 14, 18, 21], root: 0, inv: 0, group: GR.extented },
	"Maj,6": { notes: [0, 4, 7, 9], root: 0, inv: 0, group: GR.standard },
	"Maj,6,9": { notes: [0, 4, 7, 9, 14], root: 0, inv: 0, group: GR.extented },
	"Maj,add2": { notes: [0, 2, 4, 7], root: 0, inv: 0, group: GR.cluster },
	"Maj,add9": { notes: [0, 4, 7, 14], root: 0, inv: 0, group: GR.extented },
	"5": { notes: [0, 7], root: 0, inv: 0, group: GR.shell },
	// Minor
	"Min": { notes: [0, 3, 7], root: 0, inv: 0, group: GR.standard },
	"Min,7": { notes: [0, 3, 7, 10], root: 0, inv: 0, group: GR.standard },
	"Min,7,9": { notes: [0, 3, 7, 10], root: 0, inv: 0, group: GR.altered },
	"Min,7,b5": { notes: [0, 3, 6, 10], root: 0, inv: 0, group: GR.standard },
	"Min,6": { notes: [0, 3, 7, 9], root: 0, inv: 0, group: GR.standard },
	"Min,6,9": { notes: [0, 3, 7, 9, 14], root: 0, inv: 0, group: GR.extented },
	"Min,M7": { notes: [0, 3, 7, 11], root: 0, inv: 0, group: GR.standard },
	// Dominant 
	"Dom,7": { notes: [0, 4, 7, 10], root: 0, inv: 0, group: GR.altered },
	"Dom,7,9": { notes: [0, 4, 7, 10, 14], root: 0, inv: 0, group: GR.extented },
	"Dom,7,#5": { notes: [0, 4, 8, 10], root: 0, inv: 0, group: GR.altered },
	"Dom,7,b5": { notes: [0, 4, 6, 10], root: 0, inv: 0, group: GR.altered },
	"Dom,7,sus4": { notes: [0, 5, 7, 10], root: 0, inv: 0, group: GR.altered },
	"Dom,7,sus2": { notes: [0, 2, 7, 10], root: 0, inv: 0, group: GR.altered },
	"Dim": { notes: [0, 3, 6], root: 0, inv: 0, group: GR.passing },
	"Dim,7": { notes: [0, 3, 6, 9], root: 0, inv: 0, group: GR.passing },
	"Dim,7(HW)": { notes: [0, 3, 6, 9], root: 0, inv: 0, group: GR.passing },
	"Dim,7(WH)": { notes: [0, 3, 6, 9], root: 0, inv: 0, group: GR.passing },
	// "Dimø"			: {notes: [0,3,6,10], root: 0, inv:0, group: 2 },
	"Maj,#5": { notes: [0, 4, 8], root: 0, inv: 0, group: GR.altered },
	"Sus2": { notes: [0, 2, 7], root: 0, inv: 0, group: GR.altered },
	"Sus4": { notes: [0, 5, 7], root: 0, inv: 0, group: GR.altered },
	// "Quater"			: {notes: [0,5,10],   root: 0, inv:0, group: 3 },
	// Jazz reduced chords
	"Maj,7,-5": { notes: [0, 4, 11], root: 0, inv: 0, group: GR.reduced },
	"Maj,6,-5": { notes: [0, 4, 9], root: 0, inv: 0, group: GR.reduced },
	"Min,6,-5": { notes: [0, 3, 9], root: 0, inv: 0, group: GR.reduced },
	"Min,7,-5": { notes: [0, 3, 10], root: 0, inv: 0, group: GR.reduced },
	// Jazz block chords
	// Major A and B Voicings
	"Maj,6,9,-1(A)": { notes: [0, 3, 5, 10], root: -4, inv: 0, group: GR.rootLess },
	"Maj,6,9,-1(B)": { notes: [0, 5, 7, 10], root: -9, inv: 0, group: GR.rootLess },
	"Maj,7,9,-1(A)": { notes: [0, 3, 7, 10], root: -4, inv: 0, group: GR.rootLess },
	"Maj,7,9,-1(B)": { notes: [0, 3, 5, 8], root: -11, inv: 0, group: GR.rootLess },

	// Minor A and B Voicings
	"Min,6,9,-1(A)": { notes: [0, 4, 6, 11], root: -3, inv: 0, group: GR.rootLess },
	// "Min,6,9,-1(B)"		: {notes: [0,4,5,9], 			root: -10, inv:0, group: GR.rootLess }, // TODO - Check this one
	"Min,7,9,-1(A)": { notes: [0, 4, 7, 11], root: -3, inv: 0, group: GR.rootLess },
	"Min,7,9,-1(B)": { notes: [0, 4, 5, 9], root: -10, inv: 0, group: GR.rootLess },
	// "Min,7,b5(A)"		: {notes: [0,3,7,9], 			root: -3, inv:0, group: GR.standard },
	// "Min,7,b5(B)"		: {notes: [0,2,5,8], 			root: -10, inv:0, group: GR.standard },
	// "MinCluster,7,9,-1" : {notes: [0,4,5,9], 			root: -10, inv:0, group: GR.rootLess },
	// Dominant A and B Voicings
	"Dom,7,9,-1(A)": { notes: [0, 4, 6, 11], root: -10, inv: 0, group: GR.rootLess },
	"Dom,7,9,-1(B)": { notes: [0, 5, 6, 10], root: -4, inv: 0, group: GR.rootLess },
	// "Dom,7,b9,-1(A)" 	: {notes: [0,3,6,10], 			root: -10, inv:0, group: GR.rootLess },
	"Dom,7,b9,b13,-1(A)": { notes: [0, 5, 6, 10], root: -4, inv: 0, group: GR.rootLess },
	"Dom,7,b9,b13,-1(B)": { notes: [0, 4, 6, 9], root: -4, inv: 0, group: GR.rootLess },
	"Dom,7,b9,-1": { notes: [0, 3, 6, 9], root: -4, inv: 0, group: GR.rootLess },
	"Dom,7,#9,-1": { notes: [0, 3, 6, 11], root: -4, inv: 0, group: GR.rootLess },
	// "MinCluster"		   	: {notes: [0,2,3,7],  root: 0, inv:0, group: 3 },
	// "MajCluster"		   	: {notes: [0,2,4,7],  root: 0, inv:0, group: 3 },
	// "Dom7Cluster,-1"   : {notes: [0,4,6,9],  			root: -4, inv:0, group:  GR.rootLess }
}
class ChordInstance {
	offset: number[] = []
	chordInv: number[][] = []
	matchedNotes: MatchedNotes = {}
	favorJazzChords = false

	constructor(public midiChord: number[], public normalizeChord: boolean = true) {
		this.validate(midiChord)
		for (let i = 0; i < midiChord.length; i++) {
			this.offset.push(midiChord[i])
		}
		this.chordInv = this.invert(midiChord)
	}

	addOffset(chord: number[], offset: number): number[] {
		const res: number[] = []
		for (var i = 0; i < chord.length; i++) {
			res.push(chord[i] + offset)
		}
		return res;
	}

	addRootOffset(chord: number[], root: number): number[] {
		const offset = (root < 0 ? 12 + root : root) % 12
		return this.normalize(this.addOffset(chord, offset))
	}

	getOffset(inv: number): number {
		if (inv < 0 || inv >= this.offset.length)
			throw Error("getRootOffset inversion is out of range")
		else
			return this.offset[inv]
	}

	getBassName(_hypo: Hypothesis, sharpOrFlat = 'flat'): string {
		const bass = this.offset[0] % 12
		const bassName: string = rootNoteNames[sharpOrFlat][bass]
		return bassName
	}

	getBassNumber(): number { return this.offset[0] }

	getRootName(hypo: Hypothesis, sharpOrFlat = 'flat'): string {
		const _offset = (this.offset[0] + hypo.root) % 12
		// var octave  = Math.floor( ( this.offset[hypo.inv] + hypo.root )  / 12 )	
		var root = _offset < 0 ? _offset + 12 : _offset
		var rootName: string = rootNoteNames[sharpOrFlat][root]
		return rootName
	}

	getInversion(inv: number) {
		return _.isUndefined(this.chordInv[inv]) ? [] : this.chordInv[inv]
	}

	validate(notes: number[]) {
		if (notes.length == 0) {
			throw Error("No notes in notes array")
		}
		for (var i = 0; i < notes.length; i++) {
			if (notes[i] < 0 || notes[i] > 127) {
				throw Error("Illegal midi note value:" + notes[i])
			}
		}
	}

	normalize(notes: number[]): number[] {
		var target: number[] = []
		try {
			var offset = notes[0]
			for (var i = 0; i < notes.length; i++) {
				var note = notes[i] - offset
				while (note > 21) note -= 12
				// if ( note == 16 || note == 19 ) {
				// 	note -= 12
				// }
				target[i] = note
			}
		}
		catch (e) {
			throw Error(e)
		}
		return target
	}

	invert(notes: number[]): number[][] {
		//if (notes.length < 2) throw Error("Cannot invert less than 2 notes")
		if (notes.length < 2) {
			console.log("Cannot invert less than 2 notes",notes)
			return [[]];
		}
		var target: number[][] = []
		target[0] = this.normalizeChord ? this.normalize(notes) : notes;
		this.offset[0] = notes[0]
		for (var d = 1; d < notes.length; d++) {
			var currNotes = _.drop(target[d - 1])
			var invNote = _.head(target[d - 1])
			invNote += 12
			currNotes.push(invNote)
			target[d] = this.normalizeChord ? this.normalize(currNotes) : currNotes
		}
		if (target.length < notes.length) throw Error("Bad invertion")
		return target;
	}
}
class ChordForms {
	public chordMapWithInv: ChordMapTable = {}

	constructor() {
		this.buildInversions()
	}

	public getInvariants(chordName: string): string[] {
		const invariants: string[] = []
		if (_.has(chordMap, chordName)) {
			const chord: ChordMapEntry = chordMap[chordName]
			_.forIn(chordMap, function (value: ChordMapEntry, key: string) {
				if (key !== chordName && _.isEqual(value.notes, chord.notes)) {
					invariants.push(key)
				}
			});
		}
		return invariants;
	}

	public buildInversions() {
		const mapWithInv = this.chordMapWithInv
		//
		// Loop through the Chord hypothesis
		// 
		_.forIn(chordMap, function (value: ChordMapEntry, key) {
			mapWithInv[key] = []
			//
			// Loop through the inversions
			//   
			const chord = new ChordInstance(value.notes)
			const interval = chord.getInversion(0)
			for (let i = 0; i < value.notes.length; i++) {
				const _notes = chord.getInversion(i)
				//
				// Calculate the new inverted root note 
				// 		
				const rootNote = (- (Math.abs(value.root) + interval[i])) % 12
				// mapWithInv[key].push( { notes: _notes, root: ( rootNote <= 0 ? 0 : rootNote ) , inv: i, group: value.group } ) 
				mapWithInv[key].push({ notes: _notes, root: rootNote, inv: i, group: value.group })
			}
		})
	}
}
class BayesChordCalculator {
	self = this
	hypothesis: Hypothesis[] = []
	rules: Rule[] = []
	likelyhoods: number[][] = []
	normalizingConst: number[] = []
	posterior: Posterior[][] = []
	chartsCount = 0

	constructor(public bayesChordMap: ChordMapTable) {
		this.createHypothesis()
	}
	//
	// create an even distribution
	// 
	createHypothesis() {
		let idx = 0
		const _self = this.self

		for (const key in this.bayesChordMap) {
			for (let inv = 0; inv < this.bayesChordMap[key].length; inv++) {
				_self.hypothesis.push({
					idx: idx++,
					key: key,
					inv: inv,
					group: this.bayesChordMap[key][inv].group,
					len: this.bayesChordMap[key][inv].notes.length,
					root: this.bayesChordMap[key][inv].root
				}
				)
			}
		}
	}

	getChordMapNotes(idx: number): number[] {
		return this.bayesChordMap[this.hypothesis[idx].key][this.hypothesis[idx].inv].notes
	}

	standardDeriviation(data: number[]): number {
		const sum = _.sum(data)
		const avg = sum / data.length
		const squaredDiffs = _.map(data, function (value: number) {
			const diff = value - avg
			return diff * diff
		})
		const avgSquaredDiff = _.sum(squaredDiffs) / squaredDiffs.length
		const stdDev = Math.sqrt(avgSquaredDiff)
		return stdDev
	}

	//
	// Apply a Rule to the Hypothesis
	// 
	applyRule(rule: Rule) {
		const _self = this.self
		const row = this.likelyhoods.length
		const firstRow: boolean = (row == 0)
		let normalizingConst = 0
		this.rules.push(rule)
		if (_.isUndefined(this.likelyhoods[row]))
			this.likelyhoods[row] = []
		for (let col = 0; col < this.hypothesis.length; col++) {
			const likelyhood = rule.ruleFx(rule.chord, _self, row, col)
			this.likelyhoods[row].push(likelyhood)
			const prior = firstRow ? 1 : this.posterior[row - 1][col].post
			normalizingConst += (prior * likelyhood)
		}
		this.likelyhoods[row].push(normalizingConst)
		this.calcPosterior(row)
	}

	calcPosterior(_row: number) {
		for (let row = _row < 0 ? 0 : _row; row < this.likelyhoods.length; row++) {
			const firstRow: boolean = (row == 0)
			const colIdx = this.likelyhoods[row].length - 1
			const normalizingConst = this.likelyhoods[row][colIdx]
			if (_.isUndefined(this.posterior[row]))
				this.posterior[row] = []
			for (let col = 0; col < this.hypothesis.length; col++) {
				const prior = firstRow ? 1 : this.posterior[row - 1][col].post
				const likelyhood = this.likelyhoods[row][col]
				const posterior = (prior * likelyhood) / (firstRow ? 1 : normalizingConst)
				this.posterior[row].push({ post: posterior, idx: col })
			}
		}
	}

	getPosteriorByRow(rowIdx: number): Posterior[] {
		if (rowIdx < 0 || rowIdx >= this.posterior.length || _.isUndefined(this.posterior[rowIdx]))
			throw Error("getPosteriorByRow index: " + rowIdx + " is out of range or undefined")
		// this.posterior[rowIdx][col].rootName = CxChord.getRootName(this.posterior[rowIdx][col].idx)
		for (let col = 0; col < this.hypothesis.length; col++) {
			this.posterior[rowIdx][col].hypo = this.hypothesis[col]

		}
		return _.orderBy(this.posterior[rowIdx], ['post', 'hypo.len', 'hypo.inv'] as any, 'desc' as any)
	}

	getPosterior(): Posterior[] {
		const lastRow = this.posterior.length - 1
		if (lastRow < 0)
			return []
		else
			return this.getPosteriorByRow(lastRow)
	}

	getHypothesis(posterior: Posterior): Hypothesis {
		return this.hypothesis[posterior.idx]
	}

	getHypothesisByIdx(idx: number): Hypothesis {
		if (idx < 0 || idx >= this.hypothesis.length)
			throw Error("getHypothesisByIdx index: " + idx + " is out of range")
		return this.hypothesis[idx]
	}

	getBestPosterior(idx = 0): Posterior {
		const res = this.getPosterior()
		if (idx < 0 || idx >= res.length)
			throw Error("getBestPosterior index: " + idx + " is out of range")
		return res[idx]
	}

	normalize(posterior: Posterior[]) {
		const postArr: number[] = []
		_.forEach(posterior, function (val: Posterior) {
			postArr.push(val.post)
		})
		const sum = _.sum(postArr)
		let checkSum = 0
		for (let i = 0; i < postArr.length; i++) {
			posterior[i].post = postArr[i] / sum
			checkSum += posterior[i].post
		}
		// console.log( "checkSum: " + checkSum )
	}

	getTopX(topX = 10, row: number = this.posterior.length - 1, normalize = true): Posterior[] {
		const posterior = this.getPosteriorByRow(row)
		const postTopX = _.take(posterior, topX)
		if (normalize) {
			this.normalize(postTopX)
		}
		return postTopX
	}

	// Returns a random integer between min (included) and max (included)
	// Using Math.round() will give you a non-uniform distribution!
	getRandomIntInclusive(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	randomColorFactor = function () {
		return Math.round(Math.random() * 255);
	}
	/*
		visualizeTopX(_title: string, chord: ChordInstance, topX = 10) {
			const labels: string[] = []
			const posteriorLastRow = this.getTopX(topX)
	
			for (let i = 0; i < posteriorLastRow.length; i++) {
				const hypo = this.getHypothesis(posteriorLastRow[i])
				const label = chord.getRootName(hypo) + hypo.key + "_i" + hypo.inv // + chord.getBassName(hypo)
				labels.push(label)
			}
	
			const bayesChart = new BayesChart('visualization', labels)
			for (let dataSet = 1; dataSet < this.posterior.length; dataSet++) {
				const data: number[] = []
				for (let i = 0; i < posteriorLastRow.length; i++) {
					const idx = posteriorLastRow[i].idx
					const post = this.posterior[dataSet][idx].post
					data.push(post)
				}
				const randomColor = this.randomColorFactor() + ',' + this.randomColorFactor() + ',' + this.randomColorFactor()
				bayesChart.addDataSet(this.rules[dataSet].rule!, randomColor, data)
			}
			bayesChart.showChart()
		}
	*/
	/*
	visualizeForm(form: string, chord: ChordInstance) {
		// var container = new BayesChart('visualization') // document.getElementById('visualization');
		const labels: string[] = []
		const posteriorLastRow = this.getPosterior()

		const lastRow = _.filter(posteriorLastRow,
			function (p: Posterior) {
				return (p.hypo!.key == form)
			})

		const bestMatch = this.getBestPosterior()
		const bestHypo = this.getHypothesis(bestMatch)
		const bestLabel = chord.getRootName(bestHypo) + bestHypo.key + "_i" + bestHypo.inv
		labels.push(bestLabel)

		for (let i = 0; i < lastRow.length; i++) {
			const hypo = this.getHypothesis(lastRow[i])
			const label = chord.getRootName(hypo) + hypo.key + "_i" + hypo.inv // + chord.getBassName(hypo)
			labels.push(label)
		}

		const bayesChart = new BayesChart('visualization', labels)
		for (let dataSet = 1; dataSet < this.posterior.length; dataSet++) {
			const data: number[] = []
			const bestIdx = bestMatch.idx
			const bestPost = this.posterior[dataSet][bestIdx].post
			data.push(bestPost)
			for (let i = 0; i < lastRow.length; i++) {
				const idx = lastRow[i].idx
				const post = this.posterior[dataSet][idx].post
				data.push(post)
			}
			const randomColor = this.randomColorFactor() + ',' + this.randomColorFactor() + ',' + this.randomColorFactor()
			bayesChart.addDataSet(this.rules[dataSet].rule!, randomColor, data)
		}
		bayesChart.showChart()
	}*/
}
class Rules {

	// size    = 0

	ruleMap = new Map<string, Rule>();

	get<K, V>(key: string): Rule {
		return this.ruleMap.get(key)! satisfies Rule
	}

	has(key: string): boolean {
		return this.ruleMap.has(key)
	}

	set(key: string, rule: Rule) {
		rule.rule = key
		this.ruleMap.set(key, rule)
		// this.size = _.keys(this.ruleMap).length
		return this.ruleMap.get(key)
	}

	constructor(_chord: ChordInstance, public debugKey: string = 'Maj') {
		//
		// TODO: Scores and Penalties (tax) should be configurable or even dynamic and trained for best matching capability
		//
		//
		// Even Distribution Rule
		// 
		this.set('EvenDistribution', {
			chord: _chord,
			// deno-lint-ignore no-unused-vars
			ruleFx: function (chord: ChordInstance, bayes: BayesChordCalculator, row, col) {
				//const evenDistibution = 1 / bayes.hypothesis.length ?? 0
				if (bayes.hypothesis.length) { return 1 / bayes.hypothesis.length } else { return 0; }
				//return evenDistibution;
			}
		});
		//
		// Count the number of notes and see iof they match with the Hypothesis chord  
		//
		this.set('CountNotes', {
			chord: _chord,
			// deno-lint-ignore no-unused-vars
			ruleFx: function (chord: ChordInstance, bayes: BayesChordCalculator, row, col) {
				const hypoLen = bayes.hypothesis[col].len
				const chordLen = chord.chordInv[0].length
				let score = 0.1
				if (hypoLen == chordLen)
					score = 1
				else if (hypoLen > chordLen)
					score = 1 / (hypoLen - chordLen) * 2
				else if (hypoLen < chordLen)
					score = 1 / (chordLen - hypoLen) * 2
				return score;
			}
		});
		//
		// MustHave Rule  
		//
		this.set('MustHave', {
			chord: _chord,
			// deno-lint-ignore no-unused-vars
			ruleFx: function (chord, bayes, row, col) {
				const key = bayes.hypothesis[col].key
				const inv = bayes.hypothesis[col].inv
				const mustHave = chord.matchedNotes[key].mustHave[inv]
				const score = 1 / (mustHave == 0 ? 1 : Math.abs(mustHave) * 2)
				return score
			}
		});
		//
		// Knockout Rule  
		//
		this.set('Knockouts', {
			chord: _chord,
			// deno-lint-ignore no-unused-vars
			ruleFx: function (chord, bayes, row, col) {
				const key = bayes.hypothesis[col].key
				const inv = bayes.hypothesis[col].inv
				const knockouts = chord.matchedNotes[key].knockouts[inv].length
				const score = 1 / (knockouts == 0 ? 1 : knockouts * 10)
				return score
			}
		});
		//
		// Matched Notes rule
		// 
		this.set('MatchedNotes', {
			chord: _chord,
			// deno-lint-ignore no-unused-vars
			ruleFx: function (chord, bayes, row, col) {
				const key = bayes.hypothesis[col].key
				const inv = bayes.hypothesis[col].inv
				const chordLen = chord.chordInv[0].length
				const matches = chord.matchedNotes[key].invertions[inv].length
				const missing = chordLen - matches
				const missingTax = 2
				const score: number = matches / (bayes.hypothesis[col].len + (missing * missingTax))
				return score
			}
		});
		//
		// Root is present Rule  
		//
		this.set('RootFound', {
			chord: _chord,
			// deno-lint-ignore no-unused-vars
			ruleFx: function (chord, bayes, row, col) {
				const key = bayes.hypothesis[col].key
				const inv = bayes.hypothesis[col].inv
				const indexOfRoot = chord.matchedNotes[key].roots[inv]
				const favorJazz = chord.favorJazzChords
				let score: number
				// Check if it is a jazzchord
				const flavor = bayes.hypothesis[col].group
				const jazzChord: boolean = (flavor == GR.rootLess)
				//
				// Score root as first note in chord higher than inversions
				// and special handling for Jazz left hand chords (negative root)
				// 

				let inversionTax = 0.1 * inv
				inversionTax = inversionTax < 1 ? inversionTax : 0.8
				if (jazzChord) {
					if (jazzChord && !favorJazz) {
						score = 0.2
					}
					else {
						score = indexOfRoot >= 0 ? 0.2 : 1 - inversionTax
					}
				}
				else if (indexOfRoot == 0) {
					score = favorJazz ? 0.7 : 1
				}
				else if (indexOfRoot > 0) {
					score = favorJazz ? 0.7 - inversionTax : 1 - inversionTax

				}
				else {
					score = 0.6 - inversionTax
				}
				return score
			}
		});
		//
		// favor Jazz Rule  
		//
		this.set('FavorJazz', {
			chord: _chord,
			ruleFx: function (chord, bayes, row, col) {
				const key = bayes.hypothesis[col].key
				const flavor = bayes.hypothesis[col].group
				const jazzChord: boolean = (flavor == GR.rootLess || flavor == GR.reduced)
				if (key == "Maj,7,-5") {
					const debug = true
				}
				const score = jazzChord ? 1 : 0.70
				return score
			}
		});
		//
		// Conflict Rule  
		//
		this.set('Conflicts', {
			chord: _chord,
			ruleFx: function (chord, bayes, row, col) {
				const key = bayes.hypothesis[col].key
				const inv = bayes.hypothesis[col].inv
				const conflicts = chord.matchedNotes[key].conflicts[inv]
				const score = 1 / (conflicts == 0 ? 1 : conflicts * 10)
				return score
			}
		});
		//
		// Group Rule  
		//
		this.set('ChordGroup', {
			chord: _chord,
			ruleFx: function (chord, bayes, row, col) {
				const score = 1 / chord.matchedNotes[bayes.hypothesis[col].key].group
				return score
			}
		});

	}
}
function getExtName(nameWithCommas: string): string {
	const extName = nameWithCommas.replace(/,/g, "").replace(/-1/g, "-no-root").replace(/-5/g, "-no-fifth")
	return extName
}
const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
	"c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b",
	"C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B",
	"c", "db", "d", "eb", "e", "f", "gb", "g", "ab", "a", "bb", "b"]
function getNoteNumber(note: string): number {
	let octave = 5
	const _oct = note.replace(/^[A-Ga-g]+[#b]*/, '')
	if (!_.isEmpty(_oct)) {
		const _octave = _oct.replace(/[^0-9]+/g, '')
		if (_octave.match(/^[0-9]0{0,1}/))
			octave = parseInt(_octave)
		else
			throw Error("getNoteNumber: Illegal octave number. Legal octaves are 0-10");
	}
	const noteName = note.replace(/[0-9]/g, '')
	const noteNum = noteNames.indexOf(noteName) % 12

	if (noteNum < 0)
		throw Error("getNoteNumber: Unknown note name");
	else
		return noteNum + (octave * 12)
}
class ChordMatch implements ChordMatchIntf {

	inv: number
	type: string
	notes: number[] = []
	chord: string
	bass: string
	root: string
	list: string

	constructor(public hypo: Hypothesis, chordEntry: ChordInstance, _mapEntry: ChordMapEntry, sharpOrFlat: string = 'flat') {
		this.inv = hypo.inv
		this.type = hypo.key
		for (let i = 0; i < chordEntry.chordInv[0].length; i++) {
			const note = chordEntry.chordInv[0][i] + chordEntry.offset[0]
			this.notes.push(note)
		}
		this.bass = chordEntry.getBassName(hypo, sharpOrFlat)
		this.root = chordEntry.getRootName(hypo, sharpOrFlat)
		this.list = this.root + "," + this.hypo.key
		if (this.bass !== this.root) {
			this.list += ",/" + this.bass
		}
		this.chord = getExtName(this.list);
	}
}
function isNoRootChord(chordSym: string): boolean {
	return _.isUndefined(chordSym) ? false : (chordSym.indexOf("-1") > 0)
}
function getKnockouts(key: string): number[] {
	let _key = key
	if (_.isUndefined(knockouts[_key])) {
		_key = _key.split(',')[0]
	}
	return _.isUndefined(knockouts[_key]) ? [] : knockouts[_key]
}
class ChordMatcher extends ChordForms {

	chord: ChordInstance | null = null
	bayes: BayesChordCalculator | null = null
	rules: Rules | null = null
	favorJazzChords = false
	priorChords: ChordInstance[] = []

	constructor(public debugKey: string = "Maj") {
		super()
	}

	getMatches(sharpOrFlat = 'flat'): ChordMatch[] { //TODO: Implement sharpOrFlat
		if(this.bayes){
		const post = this.bayes!.getPosterior()
		const res: ChordMatch[] = []
		for (let i = 0; i < post.length; i++)
			if (i == 0 || post[i].post == post[i - 1].post) {
				const chordEntry = this.chord!
				const chordMapEntry = this.chordMapWithInv[post[i].hypo!.key][post[i].hypo!.inv]
				const entry = new ChordMatch(post[i].hypo!, chordEntry, chordMapEntry, sharpOrFlat)
				res.push(entry)
			}
			else { break }

		return res
		}else{
			return [];
		}
	}

	getMatch(idx = 0, sharpOrFlat = 'flat'): ChordMatch {
		const res: ChordMatch[] = this.getMatches(sharpOrFlat)
		if (idx < 0 || idx >= res.length)
			throw Error("getMatch index: " + idx + " is out of range")
		else
			return res[idx]
	}

	getPosterior(): Posterior[] { return this.bayes!.getPosterior() }

	getChord() { return this.chord }

	favorJazz(favor = true) {
		this.favorJazzChords = favor
		if (this.chord !== null) {
			this.chord!.favorJazzChords = favor
		}
	}

	addRootOffset(_arr: number[] = [], root: number, _addOctave = true): number[] {
		let arr: number[] = []
		if (root == 0) {
			arr = _arr
		}
		else {
			for (let i = 0; i < _arr.length; i++) {
				let note = _arr[i] + root % 12
				note = note < 0 ? note + 12 : note
				arr.push(note)
			}
		}
		return _.sortedUniq(arr)
	}

	addToArray(_arr: number[], value: number): number[] {
		const arr: number[] = []
		for (let i = 0; i < _arr.length; i++) {
			arr.push(_arr[i] + value)
		}
		return arr
	}

	doMatch(chord: ChordInstance, _limit = chord.chordInv[0].length): ChordInstance {
		// deno-lint-ignore no-this-alias
		const self = this
		let idx = 0;
		_.forIn(this.chordMapWithInv, function (hypothesis: ChordMapEntry[], key: string) {
			idx++
			for (let inv = 0; inv < hypothesis.length; inv++) {
				idx += inv
				if (!_.has(chord.matchedNotes, key)) {
					chord.matchedNotes[key] = {
						invertions: [],
						extensions: [],
						knockouts: [],
						mustHave: [],
						rootNotes: [],
						conflicts: [],
						roots: [],
						group: hypothesis[inv].group
					}
				}
				// Save the root note for the inversion
				chord.matchedNotes[key].rootNotes.push(hypothesis[inv].root)
				//
				// Check for matching notes
				// 
				const intersection = _.intersection(chord.chordInv[0], hypothesis[inv].notes)

				if (!_.isArray(intersection)) throw Error('inversion Intersection is not an array')
				chord.matchedNotes[key].invertions.push(intersection)
				// if ( chord.chordInv[0].length == intersection.length  ) this.fullMatches = true             
				//
				// The following checks should also check against the the root of no-root chords
				//        
				let _hypoToMatch: number[] = []
				let chordToMatch: number[] = []
				const invRoot = (hypothesis[inv].root < 0 ? 12 + hypothesis[inv].root : hypothesis[inv].root) % 12

				if (isNoRootChord(key) && hypothesis[inv].root < 0) {
					const tmpArr: number[] = []
					tmpArr.push(invRoot)
					_hypoToMatch = tmpArr.concat(hypothesis[inv].notes).sort()
					chordToMatch = chord.addRootOffset(chord.chordInv[0], hypothesis[inv].root)
				}
				else {
					_hypoToMatch = hypothesis[inv].notes
					chordToMatch = chord.chordInv[0]
				}
				//
				// Check for the root notes
				// For chord without the root it should not be present
				// For chord with roots it should score higher if present 
				//
				const indexOfRoot = chordToMatch.indexOf(invRoot) >= 0 ? chordToMatch.indexOf(invRoot) : chordToMatch.indexOf(invRoot + 12)
				chord.matchedNotes[key].roots.push(indexOfRoot)
				// 
				// Check for must Have notes
				//
				let mustHaveTrans: number[]
				let mustHaveMatch: number[]
				if (!_.isUndefined(mustHave[key])) {
					mustHaveTrans = self.addRootOffset(mustHave[key], hypothesis[inv].root, false)
					mustHaveMatch = _.intersection(chordToMatch, mustHaveTrans) as any
					chord.matchedNotes[key].mustHave.push(mustHaveMatch.length - mustHaveTrans.length)
				}
				else chord.matchedNotes[key].mustHave.push(0)
				//
				// Now check the extensions
				// 
				const extensionNotes = extensions[key]
				const remainingNotes = _.difference(chord.chordInv[0], intersection)
				const extensionMatch = _.intersection(remainingNotes, extensionNotes)
				chord.matchedNotes[key].extensions.push(extensionMatch)
				//
				// Now check the knockouts
				// 
				let knockoutTrans: number[]
				let knockoutMatch: number[]
				const KOs = getKnockouts(key)

				if (KOs.length > 0) {
					knockoutTrans = self.addRootOffset(knockouts[key], hypothesis[inv].root)
					knockoutMatch = _.intersection(chord.chordInv[0], knockoutTrans) as any
				}
				chord.matchedNotes[key].knockouts.push(knockoutMatch! ?? [])
				// 
				// Check for Conflicting notes
				//
				let conflictCount = 0
				let conflictTrans: number[]
				if (!_.isUndefined(conflicts[key])) {
					for (let i = 0; i < conflicts[key].length; i++) {
						conflictTrans = self.addRootOffset(conflicts[key][i], hypothesis[inv].root)
						let conflictMatch = _.intersection(chordToMatch, conflictTrans)
						if (conflictMatch.length == conflictTrans.length) { conflictCount += 1 }
						// Check in 2 octaves
						conflictTrans = self.addToArray(conflictTrans, 12)
						conflictMatch = _.intersection(chord.chordInv[0], conflictTrans)
						if (conflictMatch.length == conflictTrans.length) { conflictCount += 1 }
					}
				}
				chord.matchedNotes[key].conflicts.push(conflictCount)
			}
		})
		return chord;
	}

	//
	// Tone number and name support
	//
	match(midiChord: number[] | string[]): ChordInstance {
		if (_.isUndefined(midiChord) || _.isEmpty(midiChord)) {//throw "match: supplied Chord is empty";
			return new ChordInstance([0],false);
		}
		if (_.isNumber(midiChord[0]))
			return this.matchNotes(midiChord as number[])
		// else
		return this.matchNoteNames(midiChord as string[])

	}

	matchNoteNames(midiNames: string[]): ChordInstance {
		const midiChord: number[] = []
		for (let i = 0; i < midiNames.length; i++)
			try {
				const noteNo = getNoteNumber(midiNames[i])
				midiChord.push(noteNo)
			}
			catch (e) {
				throw e
			}
		return this.matchNotes(midiChord)
	}

	matchNotes(midiChord: number[]): ChordInstance {
		this.bayes = new BayesChordCalculator(this.chordMapWithInv)
		this.chord = new ChordInstance(midiChord)
		this.chord.favorJazzChords = this.favorJazzChords
		//
		// TODO: Application of rules should be configurable or even dynamic for best matching capabilities
		//
		// Do chord tone matches 
		//     
		this.doMatch(this.chord)
		this.rules = new Rules(this.chord, this.debugKey)!
		//
		// Apply the Bayes Rules
		// 
		// Even distribution
		//
		const ruleE: Rule = this.rules.get('EvenDistribution')
		this.bayes.applyRule(ruleE)
		//
		// Count Notes Rule  
		//
		// var ruleN: Rule = this.rules.get('CountNotes')  
		// this.bayes.applyRule(ruleN)
		//
		// Knockout Rule  
		//
		var ruleK: Rule = this.rules.get('Knockouts')
		this.bayes.applyRule(ruleK)
		//
		// Matched Notes rule
		// 
		var ruleM: Rule = this.rules.get('MatchedNotes')
		this.bayes.applyRule(ruleM)
		//
		// MustHave Notes rule
		//  
		var ruleH: Rule = this.rules.get('MustHave')
		this.bayes.applyRule(ruleH)
		//
		// Favor Jazz Chords
		// 
		// if ( this.favorJazzChords ) { 
		//      var ruleJ: Rule = this.rules.get('FavorJazz') 
		//      this.bayes.applyRule(ruleJ)
		// }
		//
		// Conflict Notes rule
		//  
		// var ruleX: Rule = this.rules.get('Conflicts') 
		// this.bayes.applyRule(ruleX)
		//
		// Root is present Rule  
		//
		var ruleR: Rule = this.rules.get('RootFound')
		this.bayes.applyRule(ruleR)
		//
		// Group Rule  
		//
		// var ruleG: Rule = this.rules.get('ChordGroup')
		// this.bayes.applyRule(ruleG)          

		// this.priorChords.push(this.chord) 
		//
		return this.chord;
	}

}

class CxChord {

}
