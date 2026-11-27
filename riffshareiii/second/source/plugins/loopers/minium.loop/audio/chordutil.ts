type ZvoogChordPitches = {
    name: string
    , pitches: ZvoogStepHalfTone[]//number[]
};
type ZvoogStepHalfTone = {
    step: number
    , halftone: number
};
type ZvoogFretKeys = {
	pitch: number
	, name: string
	, frets: number[]
};
class ChordUtil {
    pitchC = 0;

	pitchCs = 1;
	pitchDb = 1;

	pitchD = 2;

	pitchDs = 3;
	pitchEb = 2;

	pitchE = 4;

	pitchF = 5;

	pitchFs = 6;
	pitchGb = 6;

	pitchG = 7;

	pitchGs = 8;
	pitchAb = 8;

	pitchA = 9;

	pitchAs = 10;
	pitchBb = 10;

	pitchB = 11;

	O12 = 12;

	S6 = this.O12 * 4 + this.pitchE;
	S5 = this.O12 * 4 + this.pitchA;
	S4 = this.O12 * 5 + this.pitchD;
	S3 = this.O12 * 5 + this.pitchG;
	S2 = this.O12 * 5 + this.pitchB;
	S1 = this.O12 * 6 + this.pitchE;

    guitarStrings6 = [this.S6, this.S5, this.S4, this.S3, this.S2, this.S1];

    pianoKeysByName(chordName: string): number[] {
        let retarr: number[] = [];
        let root = this.chordAbsoluteHalftones(chordName);
        let start = 1;
        if (chordName.substr(1, 1) == '#') {
            start++;
        }
        if (chordName.substr(1, 1) == 'b') {
            start++;
        }
        if (root < 0) root = root + 12;
        if (root >= 120) root = root - 12;
        retarr.push(root);
        let chordKind = chordName.substr(start);
        for (var i = 0; i < chordPitchesData.length; i++) {
            if (chordPitchesData[i].name == chordKind) {
                for (var p = 0; p < chordPitchesData[i].pitches.length; p++) {
                    retarr.push(root + chordPitchesData[i].pitches[p].halftone);
                }
                break;
            }
        }
        return retarr;
    }
    chordPlainLabel(txt:string):string{

		txt = txt.replace(/min/g, 'm');
		txt = txt.replace(/m/g, 'm');
		txt = txt.replace(/M/g, 'm');
		txt = txt.replace(/♭/g, 'b');
		txt = txt.replace(/♯/g, '#');
		txt = txt.replace(/\+/g, 'aug');
		txt = txt.replace(/ø/g, 'm7b5');
		txt = txt.replace(/°/g, 'dim7');//, 'm7b5');
		txt = txt.replace(/º/g, 'dim7');//, 'm7b5');
		txt = txt.replace(/0/g, 'm7b5');
		txt = txt.replace(/△/g, 'maj7');
		txt = txt.replace(/Δ/g, 'maj7');

		txt = txt.replace(/77/g, '7');

		txt = txt.replace(/-/g, ' ');
		txt = txt.replace(/—/g, ' ');
		txt = txt.replace(/–/g, ' ');
		txt = txt.replace(/\'/g, ' ');
		txt = txt.replace(/\"/g, ' ');
		txt = txt.replace(/\(/g, ' ');
		txt = txt.replace(/\)/g, ' ');

		txt = txt.replace(/#III/g, 'E#');
		txt = txt.replace(/#VII/g, 'B#');
		txt = txt.replace(/#IV/g, 'F#');
		txt = txt.replace(/#II/g, 'D#');
		txt = txt.replace(/#VI/g, 'A#');
		txt = txt.replace(/#V/g, 'G#');
		txt = txt.replace(/#I/g, 'C#');

		txt = txt.replace(/#iii/g, 'E#m');
		txt = txt.replace(/#vii/g, 'B#m');
		txt = txt.replace(/#iv/g, 'F#m');
		txt = txt.replace(/#ii/g, 'D#m');
		txt = txt.replace(/#vi/g, 'A#m');
		txt = txt.replace(/#v/g, 'G#m');
		txt = txt.replace(/#i/g, 'C#m');

		txt = txt.replace(/bIII/g, 'Eb');
		txt = txt.replace(/bVII/g, 'Bb');
		txt = txt.replace(/bIV/g, 'Fb');
		txt = txt.replace(/bII/g, 'Db');
		txt = txt.replace(/bVI/g, 'Ab');
		txt = txt.replace(/bV/g, 'Gb');//i iv VII III VI ii° V
		txt = txt.replace(/bI/g, 'Cb');

		txt = txt.replace(/biii/g, 'Ebm');
		txt = txt.replace(/bvii/g, 'Bbm');
		txt = txt.replace(/biv/g, 'Fbm');
		txt = txt.replace(/bii/g, 'Dbm');
		txt = txt.replace(/bvi/g, 'Abm');
		txt = txt.replace(/bv/g, 'Gbm');
		txt = txt.replace(/bi/g, 'Cbm');

		txt = txt.replace(/III/g, 'E');
		txt = txt.replace(/VII/g, 'B');
		txt = txt.replace(/IV/g, 'F');
		txt = txt.replace(/II/g, 'D');
		txt = txt.replace(/VI/g, 'A');
		txt = txt.replace(/V/g, 'G');
		txt = txt.replace(/I/g, 'C');

		txt = txt.replace(/iii/g, 'Em');
		txt = txt.replace(/vii/g, 'Bm');
		txt = txt.replace(/iv/g, 'Fm');
		txt = txt.replace(/ii/g, 'Dm');
		txt = txt.replace(/vi/g, 'Am');
		txt = txt.replace(/v/g, 'Gm');
		txt = txt.replace(/i/g, 'Cm');

		txt = txt.replace(/dCmm/g, 'dim');


		//console.log(txt);
		//let ss = txt.split(/[-,\n.\s|]+/);
		//let chords: string[] = [];

        return txt;
    }
    chordAbsoluteHalftones(chordName: string): number {
        let a = chordName.substr(0, 1);
        let root = -1;
        if (a == 'C') {
            root = 0;
        }
        if (a == 'D') {
            root = 2;
        }
        if (a == 'E') {
            root = 4;
        }
        if (a == 'F') {
            root = 5;
        }
        if (a == 'G') {
            root = 7;
        }
        if (a == 'A') {
            root = 9;
        }
        if (a == 'B') {
            root = 11;
        }
        if (chordName.substr(1, 1) == '#') {
            root++;
        }
        if (chordName.substr(1, 1) == 'b') {
            root--;
        }
        return root;
    }
}
let chordPitchesData: ZvoogChordPitches[] = [
    { name: '', pitches: [{ step: 2, halftone: 4 }, { step: 4, halftone: 7 }] }
    , { name: '5', pitches: [{ step: 4, halftone: 7 }, { step: 0, halftone: 12 }] }
    , { name: '6', pitches: [{ step: 2, halftone: 4 }, { step: 4, halftone: 7 }, { step: 5, halftone: 9 }] }
    , { name: '69', pitches: [{ step: 2, halftone: 4 }, { step: 4, halftone: 7 }, { step: 5, halftone: 9 }, { step: 1, halftone: 14 }] }
    , { name: '6add9', pitches: [{ step: 2, halftone: 4 }, { step: 4, halftone: 7 }, { step: 5, halftone: 9 }, { step: 1, halftone: 14 }] }
    , { name: '6sus4', pitches: [{ step: 3, halftone: 5 }, { step: 5, halftone: 9 }] }
    , { name: '7', pitches: [{ step: 2, halftone: 4 }, { step: 4, halftone: 7 }, { step: 6, halftone: 10 }] }
    , { name: '7sus4', pitches: [{ step: 3, halftone: 5 }, { step: 4, halftone: 7 }, { step: 6, halftone: 10 }] }
    , { name: '7b5', pitches: [{ step: 2, halftone: 4 }, { step: 4, halftone: 6 }, { step: 6, halftone: 10 }] }
    , { name: '7-5', pitches: [{ step: 2, halftone: 4 }, { step: 4, halftone: 6 }, { step: 6, halftone: 10 }] }
    , { name: '7#9', pitches: [{ step: 2, halftone: 4 }, { step: 4, halftone: 7 }, { step: 6, halftone: 10 }, { step: 2, halftone: 15 }] }
    , { name: '7+9', pitches: [{ step: 2, halftone: 4 }, { step: 4, halftone: 7 }, { step: 6, halftone: 10 }, { step: 2, halftone: 15 }] }
    , { name: '7b9', pitches: [{ step: 2, halftone: 4 }, { step: 4, halftone: 7 }, { step: 6, halftone: 10 }, { step: 1, halftone: 13 }] }
    , { name: '9', pitches: [{ step: 2, halftone: 4 }, { step: 4, halftone: 7 }, { step: 6, halftone: 10 }, { step: 1, halftone: 14 }] }
    , { name: '9#11', pitches: [{ step: 1, halftone: 2 }, { step: 2, halftone: 4 }, { step: 4, halftone: 6 }, { step: 4, halftone: 7 }, { step: 6, halftone: 10 }] }
    , { name: '9b5', pitches: [{ step: 2, halftone: 4 }, { step: 4, halftone: 6 }, { step: 6, halftone: 10 }, { step: 1, halftone: 14 }] }
    , { name: '11', pitches: [{ step: 2, halftone: 4 }, { step: 4, halftone: 7 }, { step: 6, halftone: 10 }, { step: 1, halftone: 14 }, { step: 3, halftone: 17 }] }
    , { name: '13', pitches: [{ step: 6, halftone: 10 }, { step: 1, halftone: 14 }, { step: 3, halftone: 17 }, { step: 5, halftone: 21 }] }
    , { name: 'add9', pitches: [{ step: 2, halftone: 4 }, { step: 4, halftone: 7 }, { step: 1, halftone: 14 }] }
    , { name: 'alt', pitches: [{ step: 2, halftone: 4 }, { step: 4, halftone: 6 }] }
    , { name: 'aug', pitches: [{ step: 2, halftone: 4 }, { step: 5, halftone: 8 }] }
    , { name: '+', pitches: [{ step: 2, halftone: 4 }, { step: 5, halftone: 8 }] }
    , { name: 'aug7', pitches: [{ step: 2, halftone: 4 }, { step: 5, halftone: 8 }, { step: 6, halftone: 10 }] }
    , { name: '+7', pitches: [{ step: 2, halftone: 4 }, { step: 5, halftone: 8 }, { step: 6, halftone: 10 }] }
    , { name: 'aug9', pitches: [{ step: 1, halftone: 2 }, { step: 2, halftone: 4 }, { step: 5, halftone: 8 }, { step: 6, halftone: 10 }] }
    , { name: '+9', pitches: [{ step: 1, halftone: 2 }, { step: 2, halftone: 4 }, { step: 5, halftone: 8 }, { step: 6, halftone: 10 }] }
    , { name: 'dim', pitches: [{ step: 2, halftone: 3 }, { step: 4, halftone: 6 }] }
    , { name: 'dim7', pitches: [{ step: 2, halftone: 3 }, { step: 4, halftone: 6 }, { step: 5, halftone: 9 }] }
    , { name: 'm', pitches: [{ step: 2, halftone: 3 }, { step: 4, halftone: 7 }] }
    , { name: 'm6', pitches: [{ step: 2, halftone: 3 }, { step: 4, halftone: 7 }, { step: 5, halftone: 9 }] }
    , { name: 'm69', pitches: [{ step: 2, halftone: 3 }, { step: 4, halftone: 7 }, { step: 5, halftone: 9 }, { step: 1, halftone: 14 }] }
    , { name: 'm6add9', pitches: [{ step: 2, halftone: 3 }, { step: 4, halftone: 7 }, { step: 5, halftone: 9 }, { step: 1, halftone: 14 }] }
    , { name: 'm7', pitches: [{ step: 2, halftone: 3 }, { step: 4, halftone: 7 }, { step: 6, halftone: 10 }] }
    , { name: 'm7b5', pitches: [{ step: 2, halftone: 3 }, { step: 4, halftone: 6 }, { step: 6, halftone: 10 }] }
    , { name: '0', pitches: [{ step: 2, halftone: 3 }, { step: 4, halftone: 6 }, { step: 6, halftone: 10 }] }
    , { name: 'm9', pitches: [{ step: 2, halftone: 3 }, { step: 4, halftone: 7 }, { step: 6, halftone: 10 }, { step: 1, halftone: 14 }] }
    , { name: 'm9b5', pitches: [{ step: 2, halftone: 3 }, { step: 4, halftone: 6 }, { step: 6, halftone: 10 }, { step: 1, halftone: 14 }] }
    , { name: 'm11', pitches: [{ step: 2, halftone: 3 }, { step: 4, halftone: 7 }, { step: 6, halftone: 10 }, { step: 1, halftone: 14 }, { step: 3, halftone: 17 }] }
    , { name: 'madd9', pitches: [{ step: 2, halftone: 3 }, { step: 4, halftone: 7 }, { step: 1, halftone: 14 }] }
    , { name: 'maj7', pitches: [{ step: 2, halftone: 4 }, { step: 4, halftone: 7 }, { step: 6, halftone: 11 }] }
    , { name: 'maj7#5', pitches: [{ step: 2, halftone: 4 }, { step: 5, halftone: 8 }, { step: 6, halftone: 11 }] }
    , { name: 'maj7b5', pitches: [{ step: 2, halftone: 4 }, { step: 4, halftone: 6 }, { step: 6, halftone: 11 }] }
    , { name: 'maj9', pitches: [{ step: 2, halftone: 4 }, { step: 4, halftone: 7 }, { step: 6, halftone: 11 }, { step: 1, halftone: 14 }] }
    , { name: 'maj11', pitches: [{ step: 1, halftone: 2 }, { step: 2, halftone: 4 }, { step: 3, halftone: 5 }, { step: 4, halftone: 7 }, { step: 6, halftone: 11 }] }
    , { name: 'maj13', pitches: [{ step: 1, halftone: 2 }, { step: 2, halftone: 4 }, { step: 4, halftone: 7 }, { step: 5, halftone: 9 }, { step: 6, halftone: 11 }] }
    , { name: 'mmaj7', pitches: [{ step: 2, halftone: 3 }, { step: 4, halftone: 7 }, { step: 6, halftone: 11 }] }
    , { name: 'mmaj7b5', pitches: [{ step: 2, halftone: 3 }, { step: 4, halftone: 6 }, { step: 6, halftone: 11 }] }
    , { name: 'mmaj9', pitches: [{ step: 2, halftone: 3 }, { step: 4, halftone: 7 }, { step: 6, halftone: 11 }, { step: 1, halftone: 14 }] }
    , { name: 'mmaj11', pitches: [{ step: 2, halftone: 3 }, { step: 3, halftone: 5 }, { step: 4, halftone: 7 }, { step: 6, halftone: 11 }] }
    , { name: 'sus2', pitches: [{ step: 1, halftone: 2 }, { step: 4, halftone: 7 }] }
    , { name: 'sus4', pitches: [{ step: 3, halftone: 5 }, { step: 4, halftone: 7 }] }
    
];

let chordfretsData: ZvoogFretKeys[] = [
	{ name: "A#", pitch: 9, frets: [-1, 1, 3, 3, 3, 1] },
	{ name: "Bb", pitch: 9, frets: [-1, 1, 3, 3, 3, 1] },
	{ name: "A69", pitch: 9, frets: [-1, 0, 4, 4, 2, 2] },
	{ name: "A6", pitch: 9, frets: [-1, 0, 2, 2, 2, 2] },
	{ name: "A11", pitch: 9, frets: [-1, 0, 0, 0, 2, 0] },
	{ name: "A7b9", pitch: 9, frets: [-1, 0, 2, 3, 2, 3] },
	{ name: "A13", pitch: 9, frets: [-1, 0, 2, 0, 2, 2] },
	{ name: "A7#9", pitch: 9, frets: [5, 7, 5, 6, 8, 8] },
	{ name: "A7", pitch: 9, frets: [-1, 0, 2, 0, 2, 0] },
	{ name: "A9", pitch: 9, frets: [5, 4, 2, 0, 0, 0] },
	{ name: "A7b5", pitch: 9, frets: [-1, 0, 1, 2, 2, 3] },
	{ name: "A9b5", pitch: 9, frets: [-1, 0, 1, 4, 2, 3] },
	{ name: "A7sus4", pitch: 9, frets: [-1, 0, 2, 0, 3, 0] },
	{ name: "A9#11", pitch: 9, frets: [-1, 0, 1, 0, 2, 0] },
	{ name: "Aadd9", pitch: 9, frets: [-1, 0, 2, 4, 2, 0] },
	{ name: "Aaug", pitch: 9, frets: [-1, 0, 3, 2, 2, 1] },
	{ name: "Aaug9", pitch: 9, frets: [-1, 0, 3, 4, 2, 3] },
	{ name: "Aalt", pitch: 9, frets: [-1, 0, 1, 2, 2, -1] },
	{ name: "Aaug7", pitch: 9, frets: [-1, 0, 3, 0, 2, 1] },
	{ name: "Am6", pitch: 9, frets: [-1, 0, 2, 2, 1, 2] },
	{ name: "Adim", pitch: 9, frets: [-1, 0, 1, 2, 1, -1] },
	{ name: "Adim7", pitch: 9, frets: [-1, 0, 1, 2, 1, 2] },
	{ name: "Am69", pitch: 9, frets: [-1, 0, 4, 5, 0, 0] },
	{ name: "Am9", pitch: 9, frets: [-1, 0, 2, 4, 1, 3] },
	{ name: "Am11", pitch: 9, frets: [-1, 0, 0, 0, 1, 0] },
	{ name: "Am7b5", pitch: 9, frets: [-1, 0, 1, 0, 1, -1] },
	{ name: "Amadd9", pitch: 9, frets: [-1, 0, 2, 4, 1, 0] },
	{ name: "Am7", pitch: 9, frets: [-1, 0, 2, 0, 1, 0] },
	{ name: "Amaj13", pitch: 9, frets: [-1, 0, 2, 1, 2, 2] },
	{ name: "Amaj11", pitch: 9, frets: [-1, 0, 0, 1, 2, 0] },
	{ name: "Amaj7b5", pitch: 9, frets: [-1, 0, 1, 1, 2, 4] },
	{ name: "Amaj7", pitch: 9, frets: [-1, 0, 2, 1, 2, 0] },
	{ name: "Amaj7#5", pitch: 9, frets: [-1, 0, 3, 1, 2, 1] },
	{ name: "A", pitch: 9, frets: [-1, 0, 2, 2, 2, 0] },
	{ name: "Am", pitch: 9, frets: [-1, 0, 2, 2, 1, 0] },
	{ name: "Amaj9", pitch: 9, frets: [-1, 0, 2, 4, 2, 4] },
	{ name: "Ammaj11", pitch: 9, frets: [-1, 0, 0, 1, 1, 0] },
	{ name: "Ammaj7b5", pitch: 9, frets: [-1, 0, 1, 1, 1, 4] },
	{ name: "Asus2", pitch: 9, frets: [-1, 0, 2, 2, 0, 0] },
	{ name: "Ammaj7", pitch: 9, frets: [-1, 0, 2, 1, 1, 0] },
	{ name: "Ammaj9", pitch: 9, frets: [5, 3, 6, 4, 0, 0] },
	{ name: "Ab11", pitch: 8, frets: [4, 4, 4, 5, 4, 4] },
	{ name: "Asus4", pitch: 9, frets: [-1, 0, 2, 2, 3, 0] },
	{ name: "Ab6", pitch: 8, frets: [-1, 3, 1, 1, 1, 1] },
	{ name: "Ab13", pitch: 8, frets: [4, 1, 3, 1, 1, 2] },
	{ name: "Ab69", pitch: 8, frets: [-1, 1, 1, 1, 1, 1] },
	{ name: "Ab7#9", pitch: 8, frets: [4, 3, 4, 4, 4, 4] },
	{ name: "Ab7b5", pitch: 8, frets: [4, -1, 4, 5, 3, -1] },
	{ name: "Ab7b9", pitch: 8, frets: [-1, 0, 1, 1, 1, 2] },
	{ name: "Ab7", pitch: 8, frets: [-1, -1, 1, 1, 1, 2] },
	{ name: "Ab7sus4", pitch: 8, frets: [-1, -1, 1, 1, 2, 2] },
	{ name: "Ab9#11", pitch: 8, frets: [4, -1, 4, 5, 3, -1] },
	{ name: "Ab9", pitch: 8, frets: [4, 3, 4, 3, 4, -1] },
	{ name: "Abadd9", pitch: 8, frets: [4, 3, -1, 3, 4, -1] },
	{ name: "Abalt", pitch: 8, frets: [-1, -1, 6, 5, 3, 4] },
	{ name: "Ab9b5", pitch: 8, frets: [4, 3, 0, 3, -1, 2] },
	{ name: "Abaug", pitch: 8, frets: [4, 3, 2, 1, 1, -1] },
	{ name: "Abaug7", pitch: 8, frets: [4, -1, 4, 5, 5, 0] },
	{ name: "Abdim", pitch: 8, frets: [4, 2, -1, 4, 3, -1] },
	{ name: "Abaug9", pitch: 8, frets: [2, 1, 2, 1, 1, 2] },
	{ name: "Abdim7", pitch: 8, frets: [-1, -1, 0, 1, 0, 1] },
	{ name: "Abm11", pitch: 8, frets: [4, 2, 4, 3, 2, 2] },
	{ name: "Abm6", pitch: 8, frets: [4, -1, 3, 4, 4, -1] },
	{ name: "Abm69", pitch: 8, frets: [4, -1, 3, 4, 4, 6] },
	{ name: "Abm7", pitch: 8, frets: [4, 6, 4, 4, 4, 4] },
	{ name: "Abm7b5", pitch: 8, frets: [-1, -1, 0, 1, 0, 2] },
	{ name: "Abm9", pitch: 8, frets: [4, 1, 1, 1, 0, 2] },
	{ name: "Abmaj11", pitch: 8, frets: [4, 3, 1, 0, 2, -1] },
	{ name: "Abmadd9", pitch: 8, frets: [4, 2, -1, 3, 4, -1] },
	{ name: "Abmaj13", pitch: 8, frets: [4, 3, 3, 3, 4, 3] },
	{ name: "Abmaj7#5", pitch: 8, frets: [4, 3, 2, 0, 1, 0] },
	{ name: "Ab", pitch: 8, frets: [4, 3, 1, 1, 1, -1] },
	{ name: "Abmaj7b5", pitch: 8, frets: [4, 3, 5, 5, 3, 3] },
	{ name: "Abmaj7", pitch: 8, frets: [4, 6, 5, 5, 4, 4] },
	{ name: "Abmaj9", pitch: 8, frets: [-1, 1, 1, 1, 1, 3] },
	{ name: "Abm", pitch: 8, frets: [4, 6, 6, 4, 4, 4] },
	{ name: "Abmmaj11", pitch: 8, frets: [4, 4, 5, 4, 4, 6] },
	{ name: "Abmmaj7", pitch: 8, frets: [-1, 2, 1, 1, 4, 3] },
	{ name: "Abmmaj9", pitch: 8, frets: [4, -1, 5, 3, 0, 4] },
	{ name: "Abmmaj7b5", pitch: 8, frets: [4, 5, 5, 4, -1, 4] },
	{ name: "Absus4", pitch: 8, frets: [-1, -1, 1, 1, 2, 4] },
	{ name: "Absus2", pitch: 8, frets: [4, -1, -1, 3, 4, 4] },
	{ name: "B11", pitch: 11, frets: [-1, 2, 1, 2, 0, 0] },
	{ name: "B13", pitch: 11, frets: [-1, 2, 1, 2, 4, 4] },
	{ name: "B6", pitch: 11, frets: [-1, 2, 1, 1, 0, -1] },
	{ name: "B69", pitch: 11, frets: [-1, 2, 1, 1, 2, 2] },
	{ name: "B7", pitch: 11, frets: [-1, 2, 1, 2, 0, 2] },
	{ name: "B7#9", pitch: 11, frets: [-1, 2, 1, 2, 3, -1] },
	{ name: "B7b9", pitch: 11, frets: [-1, 2, 1, 2, 1, 2] },
	{ name: "B7b5", pitch: 11, frets: [-1, 2, 1, 2, 0, 1] },
	{ name: "B7sus4", pitch: 11, frets: [-1, 2, 2, 2, 0, 0] },
	{ name: "B9b5", pitch: 11, frets: [-1, 2, 1, 2, 2, 1] },
	{ name: "B9", pitch: 11, frets: [-1, 2, 1, 2, 2, 2] },
	{ name: "Balt", pitch: 11, frets: [-1, 2, 3, 4, 4, -1] },
	{ name: "B9#11", pitch: 11, frets: [-1, 2, 1, 2, 2, 1] },
	{ name: "Badd9", pitch: 11, frets: [-1, 2, 1, -1, 2, 2] },
	{ name: "Baug", pitch: 11, frets: [-1, 2, 1, 0, 0, -1] },
	{ name: "Baug7", pitch: 11, frets: [-1, 2, 1, 2, 0, 3] },
	{ name: "Baug9", pitch: 11, frets: [-1, 2, 1, 2, 2, 3] },
	{ name: "Bdim7", pitch: 11, frets: [-1, 2, 3, 1, 3, 1] },
	{ name: "Bdim", pitch: 11, frets: [-1, 2, 0, -1, 0, 1] },
	{ name: "Bm11", pitch: 11, frets: [-1, 2, 0, 2, 2, 0] },
	{ name: "Bm6", pitch: 11, frets: [2, 2, 0, 1, 0, 2] },
	{ name: "Bm69", pitch: 11, frets: [-1, 2, 0, 1, 2, 2] },
	{ name: "Bm7", pitch: 11, frets: [2, 2, 4, 2, 3, 2] },
	{ name: "Bm7b5", pitch: 11, frets: [-1, 2, 3, 2, 3, -1] },
	{ name: "Bm9", pitch: 11, frets: [-1, 2, 0, 2, 2, 2] },
	{ name: "Bmadd9", pitch: 11, frets: [-1, 5, 4, 4, 2, -1] },
	{ name: "Bmaj11", pitch: 11, frets: [-1, 2, 1, 3, 0, 0] },
	{ name: "Bmaj13", pitch: 11, frets: [-1, 2, 2, 3, 4, 4] },
	{ name: "Bmaj7", pitch: 11, frets: [2, 2, 4, 3, 4, 2] },
	{ name: "Bmaj7#5", pitch: 11, frets: [-1, 2, 1, 3, 0, 3] },
	{ name: "Bmaj9", pitch: 11, frets: [2, 2, 1, 3, 2, -1] },
	{ name: "Bmaj7b5", pitch: 11, frets: [-1, 2, 3, 3, 4, -1] },
	{ name: "B", pitch: 11, frets: [2, 2, 4, 4, 4, 2] },
	{ name: "Bmmaj7", pitch: 11, frets: [-1, 2, 0, 3, 0, 2] },
	{ name: "Bmmaj11", pitch: 11, frets: [-1, 2, 0, 3, 2, 0] },
	{ name: "Bmmaj7b5", pitch: 11, frets: [-1, 2, 3, 3, 3, -1] },
	{ name: "Bmmaj9", pitch: 11, frets: [-1, 2, 0, 3, 2, 2] },
	{ name: "Bsus2", pitch: 11, frets: [2, 2, 4, 4, 2, 2] },
	{ name: "Bsus4", pitch: 11, frets: [2, 2, 4, 4, 5, 2] },
	{ name: "Bm", pitch: 11, frets: [2, 2, 4, 4, 3, 2] },
	{ name: "Bb11", pitch: 10, frets: [-1, 1, 1, 1, 3, 1] },
	{ name: "Bb13", pitch: 10, frets: [-1, 1, 0, 1, 3, 3] },
	{ name: "Bb6", pitch: 10, frets: [-1, 1, 3, 3, 3, 3] },
	{ name: "Bb69", pitch: 10, frets: [-1, 1, 0, 0, 1, 1] },
	{ name: "Bb7", pitch: 10, frets: [-1, 1, 3, 1, 3, 1] },
	{ name: "Bb7#9", pitch: 10, frets: [-1, 1, 0, 1, 2, -1] },
	{ name: "Bb7b5", pitch: 10, frets: [-1, 1, 2, 1, 3, -1] },
	{ name: "Bb9#11", pitch: 10, frets: [-1, 1, 0, 1, 1, 0] },
	{ name: "Bb7sus4", pitch: 10, frets: [-1, 1, 3, 1, 4, 1] },
	{ name: "Bb9", pitch: 10, frets: [-1, 1, 0, 1, 1, 1] },
	{ name: "Bb7b9", pitch: 10, frets: [-1, 1, 0, 1, 0, 1] },
	{ name: "Bb9b5", pitch: 10, frets: [-1, 1, 0, 1, 1, 0] },
	{ name: "Bbadd9", pitch: 10, frets: [-1, 1, 0, 3, 1, 1] },
	{ name: "Bbalt", pitch: 10, frets: [-1, 1, 2, 3, 3, 0] },
	{ name: "Bbaug7", pitch: 10, frets: [-1, 1, 4, 1, 3, 2] },
	{ name: "Bbaug", pitch: 10, frets: [-1, 1, 4, 3, 3, -1] },
	{ name: "Bbaug9", pitch: 10, frets: [-1, 1, 0, 1, 1, 2] },
	{ name: "Bbdim", pitch: 10, frets: [-1, 1, 2, 3, 2, -1] },
	{ name: "Bbm11", pitch: 10, frets: [6, 4, 6, 5, 4, 4] },
	{ name: "Bbm6", pitch: 10, frets: [-1, 1, 3, -1, 2, 3] },
	{ name: "Bbm69", pitch: 10, frets: [6, -1, 5, 6, 6, 8] },
	{ name: "Bbdim7", pitch: 10, frets: [-1, 1, 2, 0, 2, 0] },
	{ name: "Bbm7b5", pitch: 10, frets: [-1, 1, 2, 1, 2, -1] },
	{ name: "Bbm7", pitch: 10, frets: [-1, 1, 3, 1, 2, 1] },
	{ name: "Bbm9", pitch: 10, frets: [-1, -1, 3, 5, 2, 4] },
	{ name: "Bbmadd9", pitch: 10, frets: [-1, 4, 3, 3, 1, -1] },
	{ name: "Bbmaj11", pitch: 10, frets: [-1, 1, 1, 2, 3, 1] },
	{ name: "Bbmaj13", pitch: 10, frets: [-1, 1, 1, 2, 3, 3] },
	{ name: "Bbmaj7#5", pitch: 10, frets: [-1, 1, 0, 2, 3, 2] },
	{ name: "Bbmaj7", pitch: 10, frets: [-1, 1, 3, 2, 3, 1] },
	{ name: "Bb", pitch: 10, frets: [-1, 1, 3, 3, 3, 1] },
	{ name: "Bbmaj7b5", pitch: 10, frets: [-1, 1, 2, 2, 3, -1] },
	{ name: "Bbm", pitch: 10, frets: [-1, 1, 3, 3, 2, 1] },
	{ name: "Bbmmaj11", pitch: 10, frets: [-1, 1, 1, 2, 2, 1] },
	{ name: "Bbmmaj7", pitch: 10, frets: [-1, 1, 3, 2, 2, 1] },
	{ name: "Bbmaj9", pitch: 10, frets: [1, 1, 0, 2, 1, -1] },
	{ name: "Bbmmaj7b5", pitch: 10, frets: [-1, 1, 2, 2, 2, 0] },
	{ name: "Bbmmaj9", pitch: 10, frets: [6, 4, -1, 5, 6, 5] },
	{ name: "Bbsus4", pitch: 10, frets: [-1, 1, 3, 3, 4, 1] },
	{ name: "Bbsus2", pitch: 10, frets: [1, 1, 3, 3, 1, 1] },
	{ name: "C13", pitch: 0, frets: [-1, 3, 2, 3, 5, 5] },
	{ name: "C11", pitch: 0, frets: [-1, 3, 2, 3, 1, 1] },
	{ name: "C6", pitch: 0, frets: [-1, 3, 2, 2, 1, 0] },
	{ name: "C69", pitch: 0, frets: [-1, 3, 2, 2, 3, 3] },
	{ name: "C7", pitch: 0, frets: [-1, 3, 2, 3, 1, 0] },
	{ name: "C7b5", pitch: 0, frets: [-1, -1, 2, 3, 1, 2] },
	{ name: "C7#9", pitch: 0, frets: [-1, 3, 2, 3, 4, -1] },
	{ name: "C7b9", pitch: 0, frets: [-1, 3, 2, 3, 2, 3] },
	{ name: "C7sus4", pitch: 0, frets: [-1, 3, 3, 3, 1, 1] },
	{ name: "C9b5", pitch: 0, frets: [-1, 3, 2, 3, 3, 2] },
	{ name: "C9#11", pitch: 0, frets: [-1, 3, 2, 3, 3, 2] },
	{ name: "C9", pitch: 0, frets: [3, 3, 2, 3, 3, 3] },
	{ name: "Cadd9", pitch: 0, frets: [-1, 3, 2, 0, 3, 0] },
	{ name: "Calt", pitch: 0, frets: [-1, 3, 2, 5, 5, 2] },
	{ name: "Caug", pitch: 0, frets: [-1, 3, 2, 1, 1, -1] },
	{ name: "Caug9", pitch: 0, frets: [-1, 3, 2, 3, 3, 4] },
	{ name: "Cdim", pitch: 0, frets: [-1, 3, 1, -1, 1, 2] },
	{ name: "Caug7", pitch: 0, frets: [-1, 3, 2, 3, -1, 4] },
	{ name: "Cdim7", pitch: 0, frets: [-1, -1, 1, 2, 1, 2] },
	{ name: "Cm11", pitch: 0, frets: [-1, 3, 1, 3, 3, 1] },
	{ name: "Cm6", pitch: 0, frets: [-1, 3, 1, 2, 1, 3] },
	{ name: "Cm7", pitch: 0, frets: [-1, 3, 1, 3, 4, -1] },
	{ name: "Cm69", pitch: 0, frets: [-1, 3, 1, 2, 3, 3] },
	{ name: "Cm9", pitch: 0, frets: [-1, 3, 1, 3, 3, 3] },
	{ name: "Cm7b5", pitch: 0, frets: [-1, 3, 4, 3, 4, -1] },
	{ name: "Cmadd9", pitch: 0, frets: [-1, 3, 1, 0, 3, 3] },
	{ name: "Cmaj11", pitch: 0, frets: [-1, 3, 2, 0, 0, 1] },
	{ name: "Cmaj13", pitch: 0, frets: [-1, 3, 2, 2, 0, 1] },
	{ name: "Cmaj7#5", pitch: 0, frets: [-1, 3, 2, 1, 0, 0] },
	{ name: "Cmaj7", pitch: 0, frets: [3, 3, 2, 0, 0, 0] },
	{ name: "Cmaj9", pitch: 0, frets: [-1, 3, 0, 0, 0, 0] },
	{ name: "C", pitch: 0, frets: [-1, 3, 2, 0, 1, 0] },
	{ name: "Cm", pitch: 0, frets: [-1, 3, 1, 0, 1, 3] },
	{ name: "Cmaj7b5", pitch: 0, frets: [-1, 3, 2, 4, 0, 2] },
	{ name: "Cmmaj11", pitch: 0, frets: [-1, 3, 1, 0, 0, 1] },
	{ name: "Cmmaj7b5", pitch: 0, frets: [-1, 3, -1, 4, 4, 2] },
	{ name: "Cmmaj7", pitch: 0, frets: [-1, 3, 1, 0, 0, -1] },
	{ name: "Cmmaj9", pitch: 0, frets: [-1, 3, 1, 4, 3, -1] },
	{ name: "Csus2", pitch: 0, frets: [-1, 3, 0, 0, 1, 3] },
	{ name: "Csus4", pitch: 0, frets: [-1, 3, 3, 0, 1, 1] },
	{ name: "C#11", pitch: 1, frets: [-1, 4, 3, 0, 0, 4] },
	{ name: "C#6", pitch: 1, frets: [-1, 4, 3, 3, 2, -1] },
	{ name: "C#13", pitch: 1, frets: [-1, 4, 3, 3, 0, 2] },
	{ name: "C#7#9", pitch: 1, frets: [-1, 4, 3, 4, 2, 0] },
	{ name: "C#69", pitch: 1, frets: [-1, 4, 1, 3, 2, 1] },
	{ name: "C#7", pitch: 1, frets: [-1, 4, 3, 4, 2, -1] },
	{ name: "C#7b9", pitch: 1, frets: [-1, 4, 3, 4, 3, 4] },
	{ name: "C#7sus4", pitch: 1, frets: [-1, 4, 4, 4, 2, 2] },
	{ name: "C#7b5", pitch: 1, frets: [-1, 4, 3, 0, 0, 1] },
	{ name: "C#9#11", pitch: 1, frets: [-1, 3, 2, 0, 0, 3] },
	{ name: "C#9", pitch: 1, frets: [4, 4, 3, 4, 4, 4] },
	{ name: "C#alt", pitch: 1, frets: [-1, 4, 3, 0, 2, 1] },
	{ name: "C#add9", pitch: 1, frets: [-1, 4, 3, 1, 4, 1] },
	{ name: "C#9b5", pitch: 1, frets: [-1, 4, 3, 4, 4, 3] },
	{ name: "C#aug", pitch: 1, frets: [-1, 4, 4, 4, 2, 2] },
	{ name: "C#aug7", pitch: 1, frets: [-1, 4, 3, 2, 0, 1] },
	{ name: "C#dim", pitch: 1, frets: [-1, 4, 2, -1, 2, 3] },
	{ name: "C#aug9", pitch: 1, frets: [-1, 4, 3, 4, 4, 5] },
	{ name: "C#dim7", pitch: 1, frets: [-1, -1, 2, 3, 2, 3] },
	{ name: "C#m11", pitch: 1, frets: [-1, 4, 2, 4, 2, 2] },
	{ name: "C#m6", pitch: 1, frets: [-1, 4, 2, 3, 2, 4] },
	{ name: "C#m7", pitch: 1, frets: [-1, 4, 6, 4, 5, 4] },
	{ name: "C#m7b5", pitch: 1, frets: [-1, 4, 5, 4, 5, -1] },
	{ name: "C#m69", pitch: 1, frets: [-1, 4, 1, 3, 2, 0] },
	{ name: "C#m9", pitch: 1, frets: [-1, 4, 2, 4, 4, 4] },
	{ name: "C#madd9", pitch: 1, frets: [-1, 4, 2, 1, 4, -1] },
	{ name: "C#maj11", pitch: 1, frets: [-1, 4, 3, 5, 2, 2] },
	{ name: "C#maj7#5", pitch: 1, frets: [1, 4, 3, 2, 1, 1] },
	{ name: "C#maj13", pitch: 1, frets: [-1, 4, 1, 3, 1, 1] },
	{ name: "C#maj7", pitch: 1, frets: [-1, 4, 3, 1, 1, 1] },
	{ name: "C#maj7b5", pitch: 1, frets: [-1, 4, 3, 5, 6, 3] },
	{ name: "C#maj9", pitch: 1, frets: [-1, 4, 1, 1, 1, 1] },
	{ name: "C#m", pitch: 1, frets: [-1, 4, 2, 1, 2, -1] },
	{ name: "C#mmaj11", pitch: 1, frets: [-1, 4, 2, 5, 4, 2] },
	{ name: "C#", pitch: 1, frets: [-1, 4, 3, 1, 2, 1] },
	{ name: "C#mmaj7", pitch: 1, frets: [-1, 4, 2, 1, 1, -1] },
	{ name: "C#mmaj7b5", pitch: 1, frets: [-1, 4, 2, 0, 1, 0] },
	{ name: "C#mmaj9", pitch: 1, frets: [-1, 4, 1, 1, 1, 0] },
	{ name: "C#sus2", pitch: 1, frets: [4, 4, 6, 6, 4, 4] },
	{ name: "C#sus4", pitch: 1, frets: [-1, 4, 4, 1, 2, -1] },
	{ name: "Db", pitch: 1, frets: [-1, 4, 3, 1, 2, 1] },
	{ name: "D6sus4", pitch: 2, frets: [-1, -1, 0, 2, 0, 3] },
	{ name: "D11", pitch: 2, frets: [-1, -1, 0, 0, 1, 2] },
	{ name: "D69", pitch: 2, frets: [-1, 5, 4, 2, 0, 0] },
	{ name: "D13", pitch: 2, frets: [-1, -1, 0, 4, 1, 2] },
	{ name: "D7#9", pitch: 2, frets: [-1, 5, 4, 5, 6, -1] },
	{ name: "D7b5", pitch: 2, frets: [-1, -1, 0, 1, 1, 2] },
	{ name: "D6", pitch: 2, frets: [-1, -1, 0, 2, 0, 2] },
	{ name: "D7", pitch: 2, frets: [-1, -1, 0, 2, 1, 2] },
	{ name: "D7b9", pitch: 2, frets: [-1, -1, 0, 5, 4, 2] },
	{ name: "D7sus4", pitch: 2, frets: [-1, -1, 0, 2, 1, 3] },
	{ name: "D9", pitch: 2, frets: [5, 5, 4, 5, 5, 5] },
	{ name: "D9#11", pitch: 2, frets: [-1, -1, 0, 1, 1, 2] },
	{ name: "D9b5", pitch: 2, frets: [-1, 5, 4, 5, 5, 4] },
	{ name: "Dadd9", pitch: 2, frets: [-1, 5, 4, 2, 5, 2] },
	{ name: "Dalt", pitch: 2, frets: [-1, -1, 0, 1, 3, 2] },
	{ name: "Daug7", pitch: 2, frets: [-1, -1, 0, 3, 1, 2] },
	{ name: "Daug", pitch: 2, frets: [-1, -1, 0, 3, 3, 2] },
	{ name: "Daug9", pitch: 2, frets: [-1, 5, 4, 5, 5, 6] },
	{ name: "Ddim", pitch: 2, frets: [-1, -1, 0, 1, -1, 1] },
	{ name: "Ddim7", pitch: 2, frets: [-1, -1, 0, 1, 0, 1] },
	{ name: "Dm6", pitch: 2, frets: [-1, -1, 0, 2, 0, 1] },
	{ name: "Dm11", pitch: 2, frets: [-1, -1, 0, 0, 1, 1] },
	{ name: "Dm69", pitch: 2, frets: [-1, 5, 3, 2, 0, 0] },
	{ name: "Dm7", pitch: 2, frets: [-1, -1, 0, 2, 1, 1] },
	{ name: "Dm7b5", pitch: 2, frets: [-1, -1, 0, 1, 1, 1] },
	{ name: "Dmadd9", pitch: 2, frets: [-1, 5, 3, 2, 3, 0] },
	{ name: "Dm9", pitch: 2, frets: [1, 0, 0, 2, 1, 0] },
	{ name: "Dmaj11", pitch: 2, frets: [-1, -1, 0, 0, 2, 2] },
	{ name: "Dmaj13", pitch: 2, frets: [-1, -1, 0, 4, 2, 2] },
	{ name: "Dmaj7#5", pitch: 2, frets: [-1, -1, 0, 3, 2, 2] },
	{ name: "Dm", pitch: 2, frets: [-1, -1, 0, 2, 3, 1] },
	{ name: "Dmaj7b5", pitch: 2, frets: [-1, -1, 0, 1, 2, 2] },
	{ name: "Dmaj7", pitch: 2, frets: [-1, -1, 0, 2, 2, 2] },
	{ name: "D", pitch: 2, frets: [-1, -1, 0, 2, 3, 2] },
	{ name: "Dmaj9", pitch: 2, frets: [-1, 5, 2, 2, 2, 2] },
	{ name: "Dmmaj11", pitch: 2, frets: [-1, -1, 0, 0, 2, 1] },
	{ name: "Dsus4", pitch: 2, frets: [-1, -1, 0, 2, 3, 3] },
	{ name: "Dmmaj7", pitch: 2, frets: [-1, -1, 0, 2, 2, 1] },
	{ name: "Dmmaj7b5", pitch: 2, frets: [-1, -1, 0, 1, 2, 1] },
	{ name: "Dmmaj9", pitch: 2, frets: [-1, 5, 3, 6, 5, 0] },
	{ name: "Dsus2", pitch: 2, frets: [-1, -1, 0, 2, 3, 0] },
	{ name: "Dsus6", pitch: 2, frets: [-1, -1, 0, 0, 0, 3] },
	{ name: "E13", pitch: 4, frets: [0, 2, 0, 1, 2, 0] },
	{ name: "E6", pitch: 4, frets: [0, 2, 2, 1, 2, 0] },
	{ name: "E11", pitch: 4, frets: [0, 0, 0, 1, 0, 0] },
	{ name: "E69", pitch: 4, frets: [0, 2, 2, 1, 2, 2] },
	{ name: "E7#9", pitch: 4, frets: [0, 2, 0, 1, 0, 3] },
	{ name: "E7", pitch: 4, frets: [0, 2, 0, 1, 0, 0] },
	{ name: "E7b9", pitch: 4, frets: [0, 2, 0, 1, 0, 1] },
	{ name: "E7b5", pitch: 4, frets: [0, 1, 0, 1, 3, 0] },
	{ name: "E7sus4", pitch: 4, frets: [0, 2, 0, 2, 0, 0] },
	{ name: "E9#11", pitch: 4, frets: [0, 1, 0, 1, 0, 0] },
	{ name: "E9b5", pitch: 4, frets: [0, 1, 2, 1, 3, 2] },
	{ name: "Eadd9", pitch: 4, frets: [0, 2, 2, 1, 0, 2] },
	{ name: "Ealt", pitch: 4, frets: [0, 1, 2, 1, -1, -1] },
	{ name: "E9", pitch: 4, frets: [0, 2, 0, 1, 0, 2] },
	{ name: "Eaug7", pitch: 4, frets: [0, 3, 0, 1, 1, 0] },
	{ name: "Eaug", pitch: 4, frets: [0, 3, 2, 1, 1, 0] },
	{ name: "Eaug9", pitch: 4, frets: [0, 3, 0, 1, 3, 2] },
	{ name: "Em11", pitch: 4, frets: [0, 0, 0, 0, 0, 2] },
	{ name: "Edim", pitch: 4, frets: [-1, -1, 2, 3, -1, 3] },
	{ name: "Edim7", pitch: 4, frets: [0, 1, 2, 0, 2, 0] },
	{ name: "Em6", pitch: 4, frets: [0, 2, 2, 0, 2, 0] },
	{ name: "Em69", pitch: 4, frets: [0, 2, 2, 0, 2, 2] },
	{ name: "Em7", pitch: 4, frets: [0, 2, 0, 0, 0, 0] },
	{ name: "Em9", pitch: 4, frets: [0, 2, 0, 0, 0, 2] },
	{ name: "Em7b5", pitch: 4, frets: [0, 1, 2, 3, 3, 3] },
	{ name: "Emadd9", pitch: 4, frets: [-1, -1, 3, 1, 1, 3] },
	{ name: "Emaj13", pitch: 4, frets: [0, 2, 1, 1, 2, 2] },
	{ name: "Emaj11", pitch: 4, frets: [0, 0, 1, 1, 0, 0] },
	{ name: "Emaj7", pitch: 4, frets: [0, 2, 1, 1, 0, 0] },
	{ name: "Emaj7#5", pitch: 4, frets: [0, 3, 2, 1, 4, 4] },
	{ name: "Emaj7b5", pitch: 4, frets: [0, 1, 1, 1, 4, 0] },
	{ name: "Emaj9", pitch: 4, frets: [0, 2, 1, 1, 0, 2] },
	{ name: "E", pitch: 4, frets: [0, 2, 2, 1, 0, 0] },
	{ name: "Emmaj11", pitch: 4, frets: [0, 0, 1, 0, 0, 2] },
	{ name: "Em", pitch: 4, frets: [0, 2, 2, 0, 0, 0] },
	{ name: "Emmaj7", pitch: 4, frets: [0, 2, 1, 0, 0, 0] },
	{ name: "Emmaj7b5", pitch: 4, frets: [0, 1, 1, 0, -1, 0] },
	{ name: "Esus2", pitch: 4, frets: [2, 2, 2, 4, 5, 2] },
	{ name: "Esus4", pitch: 4, frets: [0, 2, 2, 2, 0, 0] },
	{ name: "Eb13", pitch: 3, frets: [-1, 6, 5, 6, 8, 8] },
	{ name: "Emmaj9", pitch: 4, frets: [0, 2, 1, 0, 0, 2] },
	{ name: "Eb11", pitch: 3, frets: [1, 1, 1, 1, 2, 3] },
	{ name: "Eb6", pitch: 3, frets: [-1, -1, 1, 3, 1, 3] },
	{ name: "Eb69", pitch: 3, frets: [-1, -1, 1, 0, 1, 1] },
	{ name: "Eb7", pitch: 3, frets: [-1, -1, 1, 3, 2, 3] },
	{ name: "Eb7#9", pitch: 3, frets: [-1, -1, 1, 0, 2, 2] },
	{ name: "Eb7b5", pitch: 3, frets: [-1, -1, 1, 2, 2, 3] },
	{ name: "Eb7b9", pitch: 3, frets: [-1, -1, 1, 0, 2, 0] },
	{ name: "Eb7sus4", pitch: 3, frets: [-1, -1, 1, 3, 2, 4] },
	{ name: "Eb9", pitch: 3, frets: [-1, -1, 1, 0, 2, 1] },
	{ name: "Eb9b5", pitch: 3, frets: [-1, 6, 5, 6, 6, 5] },
	{ name: "Eb9#11", pitch: 3, frets: [-1, -1, 1, 2, 2, 3] },
	{ name: "Ebadd9", pitch: 3, frets: [-1, 6, 5, 3, 6, 3] },
	{ name: "Ebalt", pitch: 3, frets: [-1, -1, 1, 2, 4, 3] },
	{ name: "Ebaug", pitch: 3, frets: [-1, -1, 5, 4, 4, 3] },
	{ name: "Ebaug9", pitch: 3, frets: [3, 4, 3, 4, 4, 3] },
	{ name: "Ebaug7", pitch: 3, frets: [-1, -1, 1, 4, 2, 3] },
	{ name: "Ebdim", pitch: 3, frets: [-1, -1, 1, 2, -1, 2] },
	{ name: "Ebdim7", pitch: 3, frets: [-1, -1, 1, 2, 1, 2] },
	{ name: "Ebm11", pitch: 3, frets: [-1, -1, 1, 1, 2, 2] },
	{ name: "Ebm69", pitch: 3, frets: [2, -1, 1, 3, 1, 1] },
	{ name: "Ebm7", pitch: 3, frets: [-1, -1, 1, 3, 2, 2] },
	{ name: "Ebm6", pitch: 3, frets: [-1, 1, 1, 3, 1, 2] },
	{ name: "Ebm7b5", pitch: 3, frets: [-1, -1, 1, 2, 2, 2] },
	{ name: "Ebm9", pitch: 3, frets: [-1, 6, 4, 6, 6, 6] },
	{ name: "Ebmadd9", pitch: 3, frets: [-1, -1, 4, 3, 4, 1] },
	{ name: "Ebmaj11", pitch: 3, frets: [-1, -1, 1, 1, 3, 3] },
	{ name: "Ebmaj13", pitch: 3, frets: [-1, 3, 1, 0, 3, -1] },
	{ name: "Ebmaj7#5", pitch: 3, frets: [3, 6, 5, 4, 3, 3] },
	{ name: "Ebmaj7", pitch: 3, frets: [-1, 1, 1, 3, 3, 3] },
	{ name: "Ebmaj9", pitch: 3, frets: [-1, 6, 3, 3, 3, 3] },
	{ name: "Ebm", pitch: 3, frets: [-1, -1, 1, 3, 4, 2] },
	{ name: "Ebmaj7b5", pitch: 3, frets: [-1, -1, 1, 2, 3, 3] },
	{ name: "Ebmmaj11", pitch: 3, frets: [-1, 1, 1, 1, 3, 2] },
	{ name: "Eb", pitch: 3, frets: [-1, -1, 1, 3, 4, 3] },
	{ name: "Ebmmaj7", pitch: 3, frets: [-1, -1, 1, 3, 3, 2] },
	{ name: "Ebmmaj7b5", pitch: 3, frets: [-1, -1, 1, 2, 3, 2] },
	{ name: "Ebsus2", pitch: 3, frets: [1, 1, 1, 3, 4, 1] },
	{ name: "Ebmmaj9", pitch: 3, frets: [-1, 6, 4, 7, 6, -1] },
	{ name: "F13", pitch: 5, frets: [1, 3, 1, 2, 3, 1] },
	{ name: "Ebsus4", pitch: 3, frets: [-1, -1, 1, 3, 4, 4] },
	{ name: "F6", pitch: 5, frets: [1, -1, 3, 2, 3, 1] },
	{ name: "F11", pitch: 5, frets: [1, 1, 1, 2, 1, 1] },
	{ name: "F69", pitch: 5, frets: [1, 0, 0, 0, 1, 1] },
	{ name: "F7b5", pitch: 5, frets: [1, 0, 1, 2, 0, 1] },
	{ name: "F7#9", pitch: 5, frets: [1, 3, 1, 2, 1, 4] },
	{ name: "F7", pitch: 5, frets: [1, 3, 1, 2, 1, 1] },
	{ name: "F7sus4", pitch: 5, frets: [1, 3, 1, 3, 1, 1] },
	{ name: "F7b9", pitch: 5, frets: [1, 3, 1, 2, 1, 2] },
	{ name: "F9#11", pitch: 5, frets: [1, 0, 1, 0, 0, 1] },
	{ name: "F9b5", pitch: 5, frets: [1, 0, 1, 0, 0, 1] },
	{ name: "Falt", pitch: 5, frets: [1, 2, 3, 2, 0, -1] },
	{ name: "Fadd9", pitch: 5, frets: [-1, -1, 3, 2, 1, 3] },
	{ name: "Faug7", pitch: 5, frets: [1, 0, 1, 2, 2, -1] },
	{ name: "Faug9", pitch: 5, frets: [1, 0, 1, 0, 2, 1] },
	{ name: "Faug", pitch: 5, frets: [-1, -1, 3, 2, 2, 1] },
	{ name: "Fdim", pitch: 5, frets: [-1, -1, 3, 4, -1, 4] },
	{ name: "Fdim7", pitch: 5, frets: [1, -1, 0, 1, 0, 1] },
	{ name: "F9", pitch: 5, frets: [1, 3, 1, 2, 1, 3] },
	{ name: "Fm11", pitch: 5, frets: [1, 1, 1, 1, 1, 3] },
	{ name: "Fm69", pitch: 5, frets: [1, 3, 3, 1, 3, 3] },
	{ name: "Fm6", pitch: 5, frets: [1, -1, 0, 1, 1, 1] },
	{ name: "Fm7", pitch: 5, frets: [1, 3, 1, 1, 1, 1] },
	{ name: "Fm7b5", pitch: 5, frets: [1, -1, 1, 1, 0, -1] },
	{ name: "Fmaj11", pitch: 5, frets: [1, 1, 2, 2, 1, 1] },
	{ name: "Fm9", pitch: 5, frets: [1, 3, 1, 1, 1, 3] },
	{ name: "Fmadd9", pitch: 5, frets: [-1, -1, 3, 1, 1, 3] },
	{ name: "Fmaj13", pitch: 5, frets: [1, 0, 0, 0, 1, 0] },
	{ name: "Fmaj7#5", pitch: 5, frets: [1, 0, 2, 2, 2, 0] },
	{ name: "Fmaj7", pitch: 5, frets: [-1, -1, 3, 2, 1, 0] },
	{ name: "Fmaj7b5", pitch: 5, frets: [1, 0, 2, 2, 0, 0] },
	{ name: "Fmaj9", pitch: 5, frets: [1, 0, 2, 0, 1, 0] },
	{ name: "Fmmaj11", pitch: 5, frets: [1, 1, 2, 1, 1, 3] },
	{ name: "F", pitch: 5, frets: [1, 3, 3, 2, 1, 1] },
	{ name: "Fm", pitch: 5, frets: [1, 3, 3, 1, 1, 1] },
	{ name: "Fmmaj7", pitch: 5, frets: [1, 3, 2, 1, 1, 1] },
	{ name: "Fmmaj7b5", pitch: 5, frets: [1, 2, 2, 1, 0, 0] },
	{ name: "F#11", pitch: 6, frets: [2, 1, 2, 1, 0, 0] },
	{ name: "Fmmaj9", pitch: 5, frets: [1, 3, 2, 1, 1, 3] },
	{ name: "Fsus2", pitch: 5, frets: [1, 3, 3, -1, 1, 3] },
	{ name: "F#6", pitch: 6, frets: [2, -1, 1, 3, 2, -1] },
	{ name: "F#13", pitch: 6, frets: [2, 2, 1, 3, 0, 0] },
	{ name: "Fsus4", pitch: 5, frets: [1, 3, 3, 3, 1, 1] },
	{ name: "F#69", pitch: 6, frets: [2, 1, 1, 1, 2, 2] },
	{ name: "F#7#9", pitch: 6, frets: [2, 1, 2, 2, 2, 2] },
	{ name: "F#7", pitch: 6, frets: [2, 4, 2, 3, 2, 2] },
	{ name: "F#7b9", pitch: 6, frets: [2, 1, 2, 0, 2, 0] },
	{ name: "F#7sus4", pitch: 6, frets: [2, 4, 2, 4, 2, 2] },
	{ name: "F#9#11", pitch: 6, frets: [2, 1, 2, 1, 1, 2] },
	{ name: "F#7b5", pitch: 6, frets: [2, -1, 2, 3, 1, -1] },
	{ name: "F#aug", pitch: 6, frets: [-1, -1, 4, 3, 3, 2] },
	{ name: "F#add9", pitch: 6, frets: [2, 1, -1, 1, 2, 2] },
	{ name: "F#9", pitch: 6, frets: [2, 4, 2, 3, 2, 4] },
	{ name: "F#9b5", pitch: 6, frets: [2, 1, 2, 1, 1, 2] },
	{ name: "F#alt", pitch: 6, frets: [-1, -1, 4, 3, 1, 2] },
	{ name: "F#aug7", pitch: 6, frets: [2, -1, 2, 3, 3, -1] },
	{ name: "F#aug9", pitch: 6, frets: [2, 1, 2, 1, 3, 0] },
	{ name: "F#dim7", pitch: 6, frets: [2, -1, 1, 2, 1, -1] },
	{ name: "F#dim", pitch: 6, frets: [2, 0, -1, 2, 1, -1] },
	{ name: "F#m6", pitch: 6, frets: [2, -1, 1, 2, 2, 2] },
	{ name: "F#m11", pitch: 6, frets: [2, 0, 2, 1, 0, 0] },
	{ name: "F#m69", pitch: 6, frets: [2, 0, 1, 1, 2, 2] },
	{ name: "F#m7b5", pitch: 6, frets: [2, 0, 2, 2, 1, 0] },
	{ name: "F#madd9", pitch: 6, frets: [-1, -1, 4, 2, 2, 4] },
	{ name: "F#m9", pitch: 6, frets: [2, 0, 2, 1, 2, 0] },
	{ name: "F#m7", pitch: 6, frets: [2, 4, 2, 2, 2, 2] },
	{ name: "F#maj13", pitch: 6, frets: [2, 1, 1, 1, 2, 1] },
	{ name: "F#maj11", pitch: 6, frets: [2, 2, 3, 3, 2, 2] },
	{ name: "F#maj7#5", pitch: 6, frets: [2, -1, 3, 3, 3, -1] },
	{ name: "F#maj7b5", pitch: 6, frets: [2, 1, 3, 3, 1, 1] },
	{ name: "F#maj7", pitch: 6, frets: [2, 4, 3, 3, 2, 2] },
	{ name: "F#maj9", pitch: 6, frets: [2, 1, 3, 1, 2, 1] },
	{ name: "F#", pitch: 6, frets: [2, 4, 4, 3, 2, 2] },
	{ name: "F#mmaj11", pitch: 6, frets: [2, 2, 3, 2, 2, 4] },
	{ name: "F#m", pitch: 6, frets: [2, 4, 4, 2, 2, 2] },
	{ name: "F#mmaj7b5", pitch: 6, frets: [2, 3, 3, 2, -1, 2] },
	{ name: "F#mmaj7", pitch: 6, frets: [2, 4, 3, 2, 2, 2] },
	{ name: "F#sus2", pitch: 6, frets: [2, -1, -1, 1, 2, 2] },
	{ name: "F#sus4", pitch: 6, frets: [2, 4, 4, 4, 2, 2] },
	{ name: "F#mmaj9", pitch: 6, frets: [2, 0, 3, 1, 2, 1] },
	{ name: "G13", pitch: 7, frets: [3, 0, 2, 0, 0, 1] },
	{ name: "G11", pitch: 7, frets: [3, 2, 0, 0, 1, 1] },
	{ name: "G6", pitch: 7, frets: [3, 2, 0, 0, 0, 0] },
	{ name: "G69", pitch: 7, frets: [3, 0, 0, 0, 0, 0] },
	{ name: "G7#9", pitch: 7, frets: [3, 2, 0, 3, 0, 1] },
	{ name: "G7b9", pitch: 7, frets: [3, 2, 0, 1, 3, 1] },
	{ name: "G7", pitch: 7, frets: [3, 2, 0, 0, 0, 1] },
	{ name: "G7b5", pitch: 7, frets: [3, -1, 3, 4, 2, -1] },
	{ name: "G7sus4", pitch: 7, frets: [3, 3, 0, 0, 1, 1] },
	{ name: "G9#11", pitch: 7, frets: [3, 2, 3, 2, 2, 3] },
	{ name: "G9", pitch: 7, frets: [3, 0, 0, 0, 0, 1] },
	{ name: "G9b5", pitch: 7, frets: [3, 2, 3, 2, 2, 3] },
	{ name: "Galt", pitch: 7, frets: [3, 2, -1, 0, 2, 3] },
	{ name: "Gaug", pitch: 7, frets: [3, 2, 1, 0, 0, -1] },
	{ name: "Gadd9", pitch: 7, frets: [3, 0, 0, 2, 0, 3] },
	{ name: "Gaug7", pitch: 7, frets: [3, 2, 1, 0, 0, 1] },
	{ name: "Gaug9", pitch: 7, frets: [3, 0, 1, 0, 0, 1] },
	{ name: "Gm11", pitch: 7, frets: [3, -1, 3, 3, 1, -1] },
	{ name: "Gdim", pitch: 7, frets: [3, 1, -1, 3, 2, -1] },
	{ name: "Gm6", pitch: 7, frets: [3, -1, 2, 3, 3, 3] },
	{ name: "Gm7", pitch: 7, frets: [3, 5, 3, 3, 3, 3] },
	{ name: "Gm69", pitch: 7, frets: [3, 1, 0, 2, 3, 0] },
	{ name: "Gm7b5", pitch: 7, frets: [3, -1, -1, 3, 2, 1] },
	{ name: "Gm9", pitch: 7, frets: [3, 0, 0, 3, 3, 1] },
	{ name: "Gdim7", pitch: 7, frets: [3, 1, -1, 3, 2, 0] },
	{ name: "Gmaj11", pitch: 7, frets: [3, 2, 0, 0, 1, 2] },
	{ name: "Gmadd9", pitch: 7, frets: [3, 1, 0, 2, 3, 3] },
	{ name: "Gmaj13", pitch: 7, frets: [3, 2, 2, 2, 3, 2] },
	{ name: "Gmaj7b5", pitch: 7, frets: [3, 2, 4, 4, 2, 2] },
	{ name: "Gmaj7", pitch: 7, frets: [3, 2, 0, 0, 0, 2] },
	{ name: "Gmaj7#5", pitch: 7, frets: [-1, -1, 1, 0, 0, 2] },
	{ name: "Gm", pitch: 7, frets: [3, 1, 0, 0, 3, 3] },
	{ name: "Gmmaj11", pitch: 7, frets: [3, 3, 4, 3, 3, 5] },
	{ name: "G", pitch: 7, frets: [3, 2, 0, 0, 0, 3] },
	{ name: "Gmaj9", pitch: 7, frets: [3, 0, 0, 0, 0, 2] },
	{ name: "Gmmaj7b5", pitch: 7, frets: [3, 4, 4, 3, -1, 3] },
	{ name: "Gmmaj7", pitch: 7, frets: [3, 1, 0, 0, 3, 2] },
	{ name: "Gsus2", pitch: 7, frets: [3, 0, 0, 0, 3, 3] },
	{ name: "Gmmaj9", pitch: 7, frets: [3, 0, 0, 3, 3, 2] },
	{ name: "Gsus4", pitch: 7, frets: [3, 3, 0, 0, 1, 3] },
	{ name: "G#m", pitch: 6, frets: [4, 6, 6, 4, 4, 4] }
];
