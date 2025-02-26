"use strict";
class GPImporter {
    load(arrayBuffer, ext) {
        console.log('load', arrayBuffer);
        let scoreImporter = null;
        if (ext.toUpperCase() == 'GP3' || ext.toUpperCase() == 'GP4' || ext.toUpperCase() == 'GP5') {
            scoreImporter = new Gp3To5Importer();
        }
        else {
            if (ext.toUpperCase() == 'GPX') {
                scoreImporter = new GpxImporter();
            }
            else {
                console.log('Unknown file ' + ext);
            }
        }
        if (scoreImporter) {
            let uint8Array = new Uint8Array(arrayBuffer);
            let data = ByteBuffer.fromBuffer(uint8Array);
            let settings = new Settings();
            settings.importer.encoding = 'windows-1251';
            scoreImporter.init(data, settings);
            this.score = scoreImporter.readScore();
        }
    }
    convertProject(title, comment) {
        let project = score2schedule(title, comment, this.score);
        return project;
    }
}
function newGPparser(arrayBuffer, ext) {
    console.log("newGPparser");
    let pp = new GPImporter();
    pp.load(arrayBuffer, ext);
    return pp;
}
function score2schedule(title, comment, score) {
    console.log('score2schedule', score);
    let project = {
        versionCode: '1',
        title: title + ' ' + comment,
        timeline: [],
        tracks: [],
        percussions: [],
        filters: [],
        comments: [],
        position: { x: 0, y: 0, z: 30 },
        selectedPart: { startMeasure: -1, endMeasure: -1 },
        list: false
    };
    let tempo = 120;
    for (let bb = 0; bb < score.masterBars.length; bb++) {
        let maBar = score.masterBars[bb];
        if (maBar.tempoAutomation) {
            if (maBar.tempoAutomation.value > 0) {
                tempo = maBar.tempoAutomation.value;
            }
        }
        let measure = {
            tempo: tempo,
            metre: {
                count: maBar.timeSignatureNumerator,
                part: maBar.timeSignatureDenominator
            }
        };
        project.timeline.push(measure);
    }
    for (let tt = 0; tt < score.tracks.length; tt++) {
        let scoreTrack = score.tracks[tt];
        let pp = false;
        for (let ss = 0; ss < scoreTrack.staves.length; ss++) {
            if (scoreTrack.staves[ss].isPercussion) {
                pp = true;
            }
        }
        if (pp) {
            addScoreDrumsTracks(project, scoreTrack);
        }
        else {
            addScoreInsTrack(project, scoreTrack);
        }
    }
    for (let ii = 0; ii < project.tracks.length; ii++) {
        project.tracks[ii].performer.iconPosition.x = 10 + ii * 9;
        project.tracks[ii].performer.iconPosition.y = 0 + ii * 4;
    }
    for (let ii = 0; ii < project.percussions.length; ii++) {
        project.percussions[ii].sampler.iconPosition.x = 20 + ii * 4;
        project.percussions[ii].sampler.iconPosition.y = 30 + ii * 9;
    }
    for (let ii = 0; ii < project.filters.length - 2; ii++) {
        project.filters[ii].iconPosition.x = 10 + project.tracks.length * 9 + 5 + ii * 4;
        project.filters[ii].iconPosition.y = ii * 9;
    }
    console.log(project);
    return project;
}
function stringFret2pitch(stringNum, fretNum, tuning) {
    if (stringNum > 0 && stringNum <= tuning.length) {
        return tuning[tuning.length - stringNum] + fretNum;
    }
    return -1;
}
function beatDuration(beat) {
    let duration = MMUtil().set({ count: 1, part: beat.duration });
    if (beat.dots > 0) {
        duration = duration.plus({ count: duration.count, part: 2 * beat.duration });
    }
    if (beat.dots > 1) {
        duration = duration.plus({ count: duration.count, part: 4 * beat.duration });
    }
    if (beat.dots > 2) {
        duration = duration.plus({ count: duration.count, part: 8 * beat.duration });
    }
    if (beat.dots > 3) {
        duration = duration.plus({ count: duration.count, part: 16 * beat.duration });
    }
    return duration;
}
function takeChord(start, measure) {
    let startBeat = MMUtil().set(start);
    for (let cc = 0; cc < measure.chords.length; cc++) {
        if (startBeat.equals(measure.chords[cc].skip)) {
            return measure.chords[cc];
        }
    }
    let newChord = { pitches: [], slides: [], skip: { count: start.count, part: start.part } };
    measure.chords.push(newChord);
    return newChord;
}
function addScoreInsTrack(project, scoreTrack) {
    let perfkind = 'zinstr1';
    if (scoreTrack.playbackInfo.program == 24
        || scoreTrack.playbackInfo.program == 25
        || scoreTrack.playbackInfo.program == 26
        || scoreTrack.playbackInfo.program == 27
        || scoreTrack.playbackInfo.program == 28
        || scoreTrack.playbackInfo.program == 29
        || scoreTrack.playbackInfo.program == 30) {
        perfkind = 'zvstrumming1';
    }
    let mzxbxTrack = {
        title: scoreTrack.trackName + ' ' + insNames[scoreTrack.playbackInfo.program],
        measures: [],
        performer: {
            id: 'track' + (insNames[scoreTrack.playbackInfo.program] + Math.random()),
            data: '' + scoreTrack.playbackInfo.program,
            kind: perfkind,
            outputs: [''],
            iconPosition: { x: 0, y: 0 },
            state: 0
        },
        volume: 1
    };
    let palmMuteTrack = {
        title: 'P.M.' + scoreTrack.trackName + ' ' + insNames[scoreTrack.playbackInfo.program],
        measures: [],
        performer: {
            id: 'track' + (insNames[scoreTrack.playbackInfo.program] + Math.random()),
            data: '' + scoreTrack.playbackInfo.program,
            kind: perfkind,
            outputs: [''],
            iconPosition: { x: 0, y: 0 },
            state: 0
        },
        volume: 1
    };
    let flag = false;
    project.tracks.push(mzxbxTrack);
    for (let mm = 0; mm < project.timeline.length; mm++) {
        let mzxbxMeasure = { chords: [] };
        let pmMeasure = { chords: [] };
        mzxbxTrack.measures.push(mzxbxMeasure);
        palmMuteTrack.measures.push(pmMeasure);
        for (let ss = 0; ss < scoreTrack.staves.length; ss++) {
            let staff = scoreTrack.staves[ss];
            let tuning = staff.stringTuning.tunings;
            let bar = staff.bars[mm];
            for (let vv = 0; vv < bar.voices.length; vv++) {
                let voice = bar.voices[vv];
                let start = MMUtil();
                for (let bb = 0; bb < voice.beats.length; bb++) {
                    let beat = voice.beats[bb];
                    let currentDuration = beatDuration(beat);
                    let chord = takeChord(start, mzxbxMeasure);
                    let pmChord = takeChord(start, pmMeasure);
                    chord.slides.push({ duration: currentDuration, delta: 0 });
                    pmChord.slides.push({ duration: currentDuration, delta: 0 });
                    for (let nn = 0; nn < beat.notes.length; nn++) {
                        let note = beat.notes[nn];
                        let pitch = stringFret2pitch(note.string, note.fret, tuning);
                        if (note.isPalmMute) {
                            pmChord.pitches.push(pitch);
                            flag = true;
                        }
                        else {
                            chord.pitches.push(pitch);
                        }
                    }
                    start = start.plus(currentDuration);
                }
            }
        }
    }
    if (flag) {
        project.tracks.push(palmMuteTrack);
    }
}
function takeDrumTrack(title, trackDrums, drumNum) {
    if (trackDrums[drumNum]) {
    }
    else {
        let track = {
            title: title,
            measures: [],
            sampler: {
                id: 'drum' + (drumNum + Math.random()),
                data: '' + drumNum,
                kind: 'zdrum1',
                outputs: [''],
                iconPosition: { x: 0, y: 0 },
                state: 0
            },
            volume: 1
        };
        trackDrums[drumNum] = track;
    }
    trackDrums[drumNum].title = title + ' ' + drumNames[drumNum];
    return trackDrums[drumNum];
}
function takeDrumMeasure(trackDrum, barNum) {
    if (trackDrum.measures[barNum]) {
    }
    else {
        let measure = {
            skips: []
        };
        trackDrum.measures[barNum] = measure;
    }
    return trackDrum.measures[barNum];
}
function addScoreDrumsTracks(project, scoreTrack) {
    let trackDrums = [];
    for (let mm = 0; mm < project.timeline.length; mm++) {
        for (let ss = 0; ss < scoreTrack.staves.length; ss++) {
            let staff = scoreTrack.staves[ss];
            let bar = staff.bars[mm];
            for (let vv = 0; vv < bar.voices.length; vv++) {
                let voice = bar.voices[vv];
                let start = MMUtil();
                for (let bb = 0; bb < voice.beats.length; bb++) {
                    let beat = voice.beats[bb];
                    let currentDuration = beatDuration(beat);
                    for (let nn = 0; nn < beat.notes.length; nn++) {
                        let note = beat.notes[nn];
                        let drum = note.percussionArticulation;
                        let track = takeDrumTrack(scoreTrack.trackName + ': ' + drum, trackDrums, drum);
                        let measure = takeDrumMeasure(track, mm);
                        measure.skips.push(start);
                    }
                    start = start.plus(currentDuration);
                }
            }
        }
    }
    for (let mm = 0; mm < project.timeline.length; mm++) {
        for (let tt = 0; tt < trackDrums.length; tt++) {
            if (trackDrums[tt]) {
                takeDrumMeasure(trackDrums[tt], mm);
            }
        }
    }
    for (let tt = 0; tt < trackDrums.length; tt++) {
        if (trackDrums[tt]) {
            project.percussions.push(trackDrums[tt]);
        }
    }
}
let drumNames = [];
drumNames[35] = "Bass Drum 2";
drumNames[36] = "Bass Drum 1";
drumNames[37] = "Side Stick/Rimshot";
drumNames[38] = "Snare Drum 1";
drumNames[39] = "Hand Clap";
drumNames[40] = "Snare Drum 2";
drumNames[41] = "Low Tom 2";
drumNames[42] = "Closed Hi-hat";
drumNames[43] = "Low Tom 1";
drumNames[44] = "Pedal Hi-hat";
drumNames[45] = "Mid Tom 2";
drumNames[46] = "Open Hi-hat";
drumNames[47] = "Mid Tom 1";
drumNames[48] = "High Tom 2";
drumNames[49] = "Crash Cymbal 1";
drumNames[50] = "High Tom 1";
drumNames[51] = "Ride Cymbal 1";
drumNames[52] = "Chinese Cymbal";
drumNames[53] = "Ride Bell";
drumNames[54] = "Tambourine";
drumNames[55] = "Splash Cymbal";
drumNames[56] = "Cowbell";
drumNames[57] = "Crash Cymbal 2";
drumNames[58] = "Vibra Slap";
drumNames[59] = "Ride Cymbal 2";
drumNames[60] = "High Bongo";
drumNames[61] = "Low Bongo";
drumNames[62] = "Mute High Conga";
drumNames[63] = "Open High Conga";
drumNames[64] = "Low Conga";
drumNames[65] = "High Timbale";
drumNames[66] = "Low Timbale";
drumNames[67] = "High Agogo";
drumNames[68] = "Low Agogo";
drumNames[69] = "Cabasa";
drumNames[70] = "Maracas";
drumNames[71] = "Short Whistle";
drumNames[72] = "Long Whistle";
drumNames[73] = "Short Guiro";
drumNames[74] = "Long Guiro";
drumNames[75] = "Claves";
drumNames[76] = "High Wood Block";
drumNames[77] = "Low Wood Block";
drumNames[78] = "Mute Cuica";
drumNames[79] = "Open Cuica";
drumNames[80] = "Mute Triangle";
drumNames[81] = "Open Triangle";
let insNames = [];
insNames[0] = "Acoustic Grand Piano: Piano";
insNames[1] = "Bright Acoustic Piano: Piano";
insNames[2] = "Electric Grand Piano: Piano";
insNames[3] = "Honky-tonk Piano: Piano";
insNames[4] = "Electric Piano 1: Piano";
insNames[5] = "Electric Piano 2: Piano";
insNames[6] = "Harpsichord: Piano";
insNames[7] = "Clavinet: Piano";
insNames[8] = "Celesta: Chromatic Percussion";
insNames[9] = "Glockenspiel: Chromatic Percussion";
insNames[10] = "Music Box: Chromatic Percussion";
insNames[11] = "Vibraphone: Chromatic Percussion";
insNames[12] = "Marimba: Chromatic Percussion";
insNames[13] = "Xylophone: Chromatic Percussion";
insNames[14] = "Tubular Bells: Chromatic Percussion";
insNames[15] = "Dulcimer: Chromatic Percussion";
insNames[16] = "Drawbar Organ: Organ";
insNames[17] = "Percussive Organ: Organ";
insNames[18] = "Rock Organ: Organ";
insNames[19] = "Church Organ: Organ";
insNames[20] = "Reed Organ: Organ";
insNames[21] = "Accordion: Organ";
insNames[22] = "Harmonica: Organ";
insNames[23] = "Tango Accordion: Organ";
insNames[24] = "Acoustic Guitar (nylon): Guitar";
insNames[25] = "Acoustic Guitar (steel): Guitar";
insNames[26] = "Electric Guitar (jazz): Guitar";
insNames[27] = "Electric Guitar (clean): Guitar";
insNames[28] = "Electric Guitar (muted): Guitar";
insNames[29] = "Overdriven Guitar: Guitar";
insNames[30] = "Distortion Guitar: Guitar";
insNames[31] = "Guitar Harmonics: Guitar";
insNames[32] = "Acoustic Bass: Bass";
insNames[33] = "Electric Bass (finger): Bass";
insNames[34] = "Electric Bass (pick): Bass";
insNames[35] = "Fretless Bass: Bass";
insNames[36] = "Slap Bass 1: Bass";
insNames[37] = "Slap Bass 2: Bass";
insNames[38] = "Synth Bass 1: Bass";
insNames[39] = "Synth Bass 2: Bass";
insNames[40] = "Violin: Strings";
insNames[41] = "Viola: Strings";
insNames[42] = "Cello: Strings";
insNames[43] = "Contrabass: Strings";
insNames[44] = "Tremolo Strings: Strings";
insNames[45] = "Pizzicato Strings: Strings";
insNames[46] = "Orchestral Harp: Strings";
insNames[47] = "Timpani: Strings";
insNames[48] = "String Ensemble 1: Ensemble";
insNames[49] = "String Ensemble 2: Ensemble";
insNames[50] = "Synth Strings 1: Ensemble";
insNames[51] = "Synth Strings 2: Ensemble";
insNames[52] = "Choir Aahs: Ensemble";
insNames[53] = "Voice Oohs: Ensemble";
insNames[54] = "Synth Choir: Ensemble";
insNames[55] = "Orchestra Hit: Ensemble";
insNames[56] = "Trumpet: Brass";
insNames[57] = "Trombone: Brass";
insNames[58] = "Tuba: Brass";
insNames[59] = "Muted Trumpet: Brass";
insNames[60] = "French Horn: Brass";
insNames[61] = "Brass Section: Brass";
insNames[62] = "Synth Brass 1: Brass";
insNames[63] = "Synth Brass 2: Brass";
insNames[64] = "Soprano Sax: Reed";
insNames[65] = "Alto Sax: Reed";
insNames[66] = "Tenor Sax: Reed";
insNames[67] = "Baritone Sax: Reed";
insNames[68] = "Oboe: Reed";
insNames[69] = "English Horn: Reed";
insNames[70] = "Bassoon: Reed";
insNames[71] = "Clarinet: Reed";
insNames[72] = "Piccolo: Pipe";
insNames[73] = "Flute: Pipe";
insNames[74] = "Recorder: Pipe";
insNames[75] = "Pan Flute: Pipe";
insNames[76] = "Blown bottle: Pipe";
insNames[77] = "Shakuhachi: Pipe";
insNames[78] = "Whistle: Pipe";
insNames[79] = "Ocarina: Pipe";
insNames[80] = "Lead 1 (square): Synth Lead";
insNames[81] = "Lead 2 (sawtooth): Synth Lead";
insNames[82] = "Lead 3 (calliope): Synth Lead";
insNames[83] = "Lead 4 (chiff): Synth Lead";
insNames[84] = "Lead 5 (charang): Synth Lead";
insNames[85] = "Lead 6 (voice): Synth Lead";
insNames[86] = "Lead 7 (fifths): Synth Lead";
insNames[87] = "Lead 8 (bass + lead): Synth Lead";
insNames[88] = "Pad 1 (new age): Synth Pad";
insNames[89] = "Pad 2 (warm): Synth Pad";
insNames[90] = "Pad 3 (polysynth): Synth Pad";
insNames[91] = "Pad 4 (choir): Synth Pad";
insNames[92] = "Pad 5 (bowed): Synth Pad";
insNames[93] = "Pad 6 (metallic): Synth Pad";
insNames[94] = "Pad 7 (halo): Synth Pad";
insNames[95] = "Pad 8 (sweep): Synth Pad";
insNames[96] = "FX 1 (rain): Synth Effects";
insNames[97] = "FX 2 (soundtrack): Synth Effects";
insNames[98] = "FX 3 (crystal): Synth Effects";
insNames[99] = "FX 4 (atmosphere): Synth Effects";
insNames[100] = "FX 5 (brightness): Synth Effects";
insNames[101] = "FX 6 (goblins): Synth Effects";
insNames[102] = "FX 7 (echoes): Synth Effects";
insNames[103] = "FX 8 (sci-fi): Synth Effects";
insNames[104] = "Sitar: Ethnic";
insNames[105] = "Banjo: Ethnic";
insNames[106] = "Shamisen: Ethnic";
insNames[107] = "Koto: Ethnic";
insNames[108] = "Kalimba: Ethnic";
insNames[109] = "Bagpipe: Ethnic";
insNames[110] = "Fiddle: Ethnic";
insNames[111] = "Shanai: Ethnic";
insNames[112] = "Tinkle Bell: Percussive";
insNames[113] = "Agogo: Percussive";
insNames[114] = "Steel Drums: Percussive";
insNames[115] = "Woodblock: Percussive";
insNames[116] = "Taiko Drum: Percussive";
insNames[117] = "Melodic Tom: Percussive";
insNames[118] = "Synth Drum: Percussive";
insNames[119] = "Reverse Cymbal: Percussive";
insNames[120] = "Guitar Fret Noise: Sound effects";
insNames[121] = "Breath Noise: Sound effects";
insNames[122] = "Seashore: Sound effects";
insNames[123] = "Bird Tweet: Sound effects";
insNames[124] = "Telephone Ring: Sound effects";
insNames[125] = "Helicopter: Sound effects";
insNames[126] = "Applause: Sound effects";
insNames[127] = "Gunshot: Sound effects";
class GP345ImportMusicPlugin {
    constructor() {
        this.callbackID = '';
        this.parsedProject = null;
        this.init();
    }
    init() {
        window.addEventListener('message', this.receiveHostMessage.bind(this), false);
        window.parent.postMessage({
            dialogID: this.callbackID,
            pluginData: this.parsedProject,
            done: false
        }, '*');
    }
    sendParsedGP345Data() {
        if (this.parsedProject) {
            var oo = {
                dialogID: this.callbackID,
                pluginData: this.parsedProject,
                done: true
            };
            window.parent.postMessage(oo, '*');
        }
        else {
            alert('No parsed data');
        }
    }
    receiveHostMessage(par) {
        let message = par.data;
        if (this.callbackID) {
        }
        else {
            this.callbackID = message.hostData;
        }
    }
    loadGP345file(from) {
        console.log('loadGP345file', from.files);
        let me = this;
        var file = from.files[0];
        var fileReader = new FileReader();
        let title = file.name;
        let ext = ('' + file.name).split('.').pop();
        let dat = '' + file.lastModifiedDate;
        try {
            let last = file.lastModifiedDate;
            dat = '' + last.getFullYear();
            if (last.getMonth() < 10) {
                dat = dat + '-' + last.getMonth();
            }
            else {
                dat = dat + '-0' + last.getMonth();
            }
            if (last.getDate() < 10) {
                dat = dat + '-' + last.getDate();
            }
            else {
                dat = dat + '-0' + last.getDate();
            }
        }
        catch (xx) {
            console.log(xx);
        }
        let comment = ', ' + file.size / 1000 + 'kb, ' + dat;
        fileReader.onload = function (progressEvent) {
            if (progressEvent != null) {
                var arrayBuffer = progressEvent.target.result;
                var pp = newGPparser(arrayBuffer, '' + ext);
                try {
                    let result = pp.convertProject(title, comment);
                    me.parsedProject = result;
                }
                catch (xxx) {
                    console.log(xxx);
                }
            }
        };
        fileReader.readAsArrayBuffer(file);
    }
}
class ImporterSettings {
    constructor() {
        this.encoding = 'utf-8';
        this.mergePartGroupsInMusicXml = false;
        this.beatTextAsLyrics = false;
    }
}
var TextAlign;
(function (TextAlign) {
    TextAlign[TextAlign["Left"] = 0] = "Left";
    TextAlign[TextAlign["Center"] = 1] = "Center";
    TextAlign[TextAlign["Right"] = 2] = "Right";
})(TextAlign || (TextAlign = {}));
var TextBaseline;
(function (TextBaseline) {
    TextBaseline[TextBaseline["Top"] = 0] = "Top";
    TextBaseline[TextBaseline["Middle"] = 1] = "Middle";
    TextBaseline[TextBaseline["Bottom"] = 2] = "Bottom";
})(TextBaseline || (TextBaseline = {}));
class ScoreImporter {
    init(data, settings) {
        this.data = data;
        this.settings = settings;
    }
}
var MusicFontSymbol;
(function (MusicFontSymbol) {
    MusicFontSymbol[MusicFontSymbol["None"] = -1] = "None";
    MusicFontSymbol[MusicFontSymbol["GClef"] = 57424] = "GClef";
    MusicFontSymbol[MusicFontSymbol["CClef"] = 57436] = "CClef";
    MusicFontSymbol[MusicFontSymbol["FClef"] = 57442] = "FClef";
    MusicFontSymbol[MusicFontSymbol["UnpitchedPercussionClef1"] = 57449] = "UnpitchedPercussionClef1";
    MusicFontSymbol[MusicFontSymbol["SixStringTabClef"] = 57453] = "SixStringTabClef";
    MusicFontSymbol[MusicFontSymbol["FourStringTabClef"] = 57454] = "FourStringTabClef";
    MusicFontSymbol[MusicFontSymbol["TimeSig0"] = 57472] = "TimeSig0";
    MusicFontSymbol[MusicFontSymbol["TimeSig1"] = 57473] = "TimeSig1";
    MusicFontSymbol[MusicFontSymbol["TimeSig2"] = 57474] = "TimeSig2";
    MusicFontSymbol[MusicFontSymbol["TimeSig3"] = 57475] = "TimeSig3";
    MusicFontSymbol[MusicFontSymbol["TimeSig4"] = 57476] = "TimeSig4";
    MusicFontSymbol[MusicFontSymbol["TimeSig5"] = 57477] = "TimeSig5";
    MusicFontSymbol[MusicFontSymbol["TimeSig6"] = 57478] = "TimeSig6";
    MusicFontSymbol[MusicFontSymbol["TimeSig7"] = 57479] = "TimeSig7";
    MusicFontSymbol[MusicFontSymbol["TimeSig8"] = 57480] = "TimeSig8";
    MusicFontSymbol[MusicFontSymbol["TimeSig9"] = 57481] = "TimeSig9";
    MusicFontSymbol[MusicFontSymbol["TimeSigCommon"] = 57482] = "TimeSigCommon";
    MusicFontSymbol[MusicFontSymbol["TimeSigCutCommon"] = 57483] = "TimeSigCutCommon";
    MusicFontSymbol[MusicFontSymbol["NoteheadDoubleWholeSquare"] = 57505] = "NoteheadDoubleWholeSquare";
    MusicFontSymbol[MusicFontSymbol["NoteheadDoubleWhole"] = 57504] = "NoteheadDoubleWhole";
    MusicFontSymbol[MusicFontSymbol["NoteheadWhole"] = 57506] = "NoteheadWhole";
    MusicFontSymbol[MusicFontSymbol["NoteheadHalf"] = 57507] = "NoteheadHalf";
    MusicFontSymbol[MusicFontSymbol["NoteheadBlack"] = 57508] = "NoteheadBlack";
    MusicFontSymbol[MusicFontSymbol["NoteheadNull"] = 57509] = "NoteheadNull";
    MusicFontSymbol[MusicFontSymbol["NoteheadXOrnate"] = 57514] = "NoteheadXOrnate";
    MusicFontSymbol[MusicFontSymbol["NoteheadTriangleUpWhole"] = 57531] = "NoteheadTriangleUpWhole";
    MusicFontSymbol[MusicFontSymbol["NoteheadTriangleUpHalf"] = 57532] = "NoteheadTriangleUpHalf";
    MusicFontSymbol[MusicFontSymbol["NoteheadTriangleUpBlack"] = 57534] = "NoteheadTriangleUpBlack";
    MusicFontSymbol[MusicFontSymbol["NoteheadDiamondBlackWide"] = 57564] = "NoteheadDiamondBlackWide";
    MusicFontSymbol[MusicFontSymbol["NoteheadDiamondWhite"] = 57565] = "NoteheadDiamondWhite";
    MusicFontSymbol[MusicFontSymbol["NoteheadDiamondWhiteWide"] = 57566] = "NoteheadDiamondWhiteWide";
    MusicFontSymbol[MusicFontSymbol["NoteheadCircleX"] = 57523] = "NoteheadCircleX";
    MusicFontSymbol[MusicFontSymbol["NoteheadXWhole"] = 57511] = "NoteheadXWhole";
    MusicFontSymbol[MusicFontSymbol["NoteheadXHalf"] = 57512] = "NoteheadXHalf";
    MusicFontSymbol[MusicFontSymbol["NoteheadXBlack"] = 57513] = "NoteheadXBlack";
    MusicFontSymbol[MusicFontSymbol["NoteheadParenthesis"] = 57550] = "NoteheadParenthesis";
    MusicFontSymbol[MusicFontSymbol["NoteheadSlashedBlack2"] = 57552] = "NoteheadSlashedBlack2";
    MusicFontSymbol[MusicFontSymbol["NoteheadCircleSlash"] = 57591] = "NoteheadCircleSlash";
    MusicFontSymbol[MusicFontSymbol["NoteheadHeavyX"] = 57592] = "NoteheadHeavyX";
    MusicFontSymbol[MusicFontSymbol["NoteheadHeavyXHat"] = 57593] = "NoteheadHeavyXHat";
    MusicFontSymbol[MusicFontSymbol["NoteQuarterUp"] = 57813] = "NoteQuarterUp";
    MusicFontSymbol[MusicFontSymbol["NoteEighthUp"] = 57815] = "NoteEighthUp";
    MusicFontSymbol[MusicFontSymbol["Tremolo3"] = 57890] = "Tremolo3";
    MusicFontSymbol[MusicFontSymbol["Tremolo2"] = 57889] = "Tremolo2";
    MusicFontSymbol[MusicFontSymbol["Tremolo1"] = 57888] = "Tremolo1";
    MusicFontSymbol[MusicFontSymbol["FlagEighthUp"] = 57920] = "FlagEighthUp";
    MusicFontSymbol[MusicFontSymbol["FlagEighthDown"] = 57921] = "FlagEighthDown";
    MusicFontSymbol[MusicFontSymbol["FlagSixteenthUp"] = 57922] = "FlagSixteenthUp";
    MusicFontSymbol[MusicFontSymbol["FlagSixteenthDown"] = 57923] = "FlagSixteenthDown";
    MusicFontSymbol[MusicFontSymbol["FlagThirtySecondUp"] = 57924] = "FlagThirtySecondUp";
    MusicFontSymbol[MusicFontSymbol["FlagThirtySecondDown"] = 57925] = "FlagThirtySecondDown";
    MusicFontSymbol[MusicFontSymbol["FlagSixtyFourthUp"] = 57926] = "FlagSixtyFourthUp";
    MusicFontSymbol[MusicFontSymbol["FlagSixtyFourthDown"] = 57927] = "FlagSixtyFourthDown";
    MusicFontSymbol[MusicFontSymbol["FlagOneHundredTwentyEighthUp"] = 57928] = "FlagOneHundredTwentyEighthUp";
    MusicFontSymbol[MusicFontSymbol["FlagOneHundredTwentyEighthDown"] = 57929] = "FlagOneHundredTwentyEighthDown";
    MusicFontSymbol[MusicFontSymbol["FlagTwoHundredFiftySixthUp"] = 57930] = "FlagTwoHundredFiftySixthUp";
    MusicFontSymbol[MusicFontSymbol["FlagTwoHundredFiftySixthDown"] = 57931] = "FlagTwoHundredFiftySixthDown";
    MusicFontSymbol[MusicFontSymbol["AccidentalFlat"] = 57952] = "AccidentalFlat";
    MusicFontSymbol[MusicFontSymbol["AccidentalNatural"] = 57953] = "AccidentalNatural";
    MusicFontSymbol[MusicFontSymbol["AccidentalSharp"] = 57954] = "AccidentalSharp";
    MusicFontSymbol[MusicFontSymbol["AccidentalDoubleSharp"] = 57955] = "AccidentalDoubleSharp";
    MusicFontSymbol[MusicFontSymbol["AccidentalDoubleFlat"] = 57956] = "AccidentalDoubleFlat";
    MusicFontSymbol[MusicFontSymbol["AccidentalQuarterToneFlatArrowUp"] = 57968] = "AccidentalQuarterToneFlatArrowUp";
    MusicFontSymbol[MusicFontSymbol["AccidentalQuarterToneSharpArrowUp"] = 57972] = "AccidentalQuarterToneSharpArrowUp";
    MusicFontSymbol[MusicFontSymbol["AccidentalQuarterToneNaturalArrowUp"] = 57970] = "AccidentalQuarterToneNaturalArrowUp";
    MusicFontSymbol[MusicFontSymbol["ArticAccentAbove"] = 58528] = "ArticAccentAbove";
    MusicFontSymbol[MusicFontSymbol["ArticStaccatoAbove"] = 58530] = "ArticStaccatoAbove";
    MusicFontSymbol[MusicFontSymbol["ArticMarcatoAbove"] = 58540] = "ArticMarcatoAbove";
    MusicFontSymbol[MusicFontSymbol["FermataAbove"] = 58560] = "FermataAbove";
    MusicFontSymbol[MusicFontSymbol["FermataShortAbove"] = 58564] = "FermataShortAbove";
    MusicFontSymbol[MusicFontSymbol["FermataLongAbove"] = 58566] = "FermataLongAbove";
    MusicFontSymbol[MusicFontSymbol["RestLonga"] = 58593] = "RestLonga";
    MusicFontSymbol[MusicFontSymbol["RestDoubleWhole"] = 58594] = "RestDoubleWhole";
    MusicFontSymbol[MusicFontSymbol["RestWhole"] = 58595] = "RestWhole";
    MusicFontSymbol[MusicFontSymbol["RestHalf"] = 58596] = "RestHalf";
    MusicFontSymbol[MusicFontSymbol["RestQuarter"] = 58597] = "RestQuarter";
    MusicFontSymbol[MusicFontSymbol["RestEighth"] = 58598] = "RestEighth";
    MusicFontSymbol[MusicFontSymbol["RestSixteenth"] = 58599] = "RestSixteenth";
    MusicFontSymbol[MusicFontSymbol["RestThirtySecond"] = 58600] = "RestThirtySecond";
    MusicFontSymbol[MusicFontSymbol["RestSixtyFourth"] = 58601] = "RestSixtyFourth";
    MusicFontSymbol[MusicFontSymbol["RestOneHundredTwentyEighth"] = 58602] = "RestOneHundredTwentyEighth";
    MusicFontSymbol[MusicFontSymbol["RestTwoHundredFiftySixth"] = 58603] = "RestTwoHundredFiftySixth";
    MusicFontSymbol[MusicFontSymbol["Repeat1Bar"] = 58624] = "Repeat1Bar";
    MusicFontSymbol[MusicFontSymbol["Repeat2Bars"] = 58625] = "Repeat2Bars";
    MusicFontSymbol[MusicFontSymbol["Ottava"] = 58640] = "Ottava";
    MusicFontSymbol[MusicFontSymbol["OttavaAlta"] = 58641] = "OttavaAlta";
    MusicFontSymbol[MusicFontSymbol["OttavaBassaVb"] = 58652] = "OttavaBassaVb";
    MusicFontSymbol[MusicFontSymbol["Quindicesima"] = 58644] = "Quindicesima";
    MusicFontSymbol[MusicFontSymbol["QuindicesimaAlta"] = 58645] = "QuindicesimaAlta";
    MusicFontSymbol[MusicFontSymbol["DynamicPPP"] = 58666] = "DynamicPPP";
    MusicFontSymbol[MusicFontSymbol["DynamicPP"] = 58667] = "DynamicPP";
    MusicFontSymbol[MusicFontSymbol["DynamicPiano"] = 58656] = "DynamicPiano";
    MusicFontSymbol[MusicFontSymbol["DynamicMP"] = 58668] = "DynamicMP";
    MusicFontSymbol[MusicFontSymbol["DynamicMF"] = 58669] = "DynamicMF";
    MusicFontSymbol[MusicFontSymbol["DynamicForte"] = 58658] = "DynamicForte";
    MusicFontSymbol[MusicFontSymbol["DynamicFF"] = 58671] = "DynamicFF";
    MusicFontSymbol[MusicFontSymbol["DynamicFFF"] = 58672] = "DynamicFFF";
    MusicFontSymbol[MusicFontSymbol["OrnamentTrill"] = 58726] = "OrnamentTrill";
    MusicFontSymbol[MusicFontSymbol["StringsDownBow"] = 58896] = "StringsDownBow";
    MusicFontSymbol[MusicFontSymbol["StringsUpBow"] = 58898] = "StringsUpBow";
    MusicFontSymbol[MusicFontSymbol["PictEdgeOfCymbal"] = 59177] = "PictEdgeOfCymbal";
    MusicFontSymbol[MusicFontSymbol["GuitarString0"] = 59443] = "GuitarString0";
    MusicFontSymbol[MusicFontSymbol["GuitarString1"] = 59444] = "GuitarString1";
    MusicFontSymbol[MusicFontSymbol["GuitarString2"] = 59445] = "GuitarString2";
    MusicFontSymbol[MusicFontSymbol["GuitarString3"] = 59446] = "GuitarString3";
    MusicFontSymbol[MusicFontSymbol["GuitarString4"] = 59447] = "GuitarString4";
    MusicFontSymbol[MusicFontSymbol["GuitarString5"] = 59448] = "GuitarString5";
    MusicFontSymbol[MusicFontSymbol["GuitarString6"] = 59449] = "GuitarString6";
    MusicFontSymbol[MusicFontSymbol["GuitarString7"] = 59450] = "GuitarString7";
    MusicFontSymbol[MusicFontSymbol["GuitarString8"] = 59451] = "GuitarString8";
    MusicFontSymbol[MusicFontSymbol["GuitarString9"] = 59452] = "GuitarString9";
    MusicFontSymbol[MusicFontSymbol["GuitarGolpe"] = 59458] = "GuitarGolpe";
    MusicFontSymbol[MusicFontSymbol["FretboardX"] = 59481] = "FretboardX";
    MusicFontSymbol[MusicFontSymbol["FretboardO"] = 59482] = "FretboardO";
    MusicFontSymbol[MusicFontSymbol["WiggleTrill"] = 60068] = "WiggleTrill";
    MusicFontSymbol[MusicFontSymbol["WiggleVibratoMediumFast"] = 60126] = "WiggleVibratoMediumFast";
    MusicFontSymbol[MusicFontSymbol["OctaveBaselineM"] = 60565] = "OctaveBaselineM";
    MusicFontSymbol[MusicFontSymbol["OctaveBaselineB"] = 60563] = "OctaveBaselineB";
})(MusicFontSymbol || (MusicFontSymbol = {}));
class Gp3To5Importer extends ScoreImporter {
    constructor() {
        super();
        this._versionNumber = 0;
        this._globalTripletFeel = TripletFeel.NoTripletFeel;
        this._lyricsTrack = 0;
        this._lyrics = [];
        this._barCount = 0;
        this._trackCount = 0;
        this._playbackInfos = [];
        this._beatTextChunksByTrack = new Map();
    }
    get name() {
        return 'Guitar Pro 3-5';
    }
    readScore() {
        this.readVersion();
        this._score = new Score();
        this.readScoreInformation();
        if (this._versionNumber < 500) {
            this._globalTripletFeel = GpBinaryHelpers.gpReadBool(this.data)
                ? TripletFeel.Triplet8th
                : TripletFeel.NoTripletFeel;
        }
        if (this._versionNumber >= 400) {
            this.readLyrics();
        }
        if (this._versionNumber >= 510) {
            this.data.skip(19);
        }
        if (this._versionNumber >= 500) {
            this.readPageSetup();
            this._score.tempoLabel = GpBinaryHelpers.gpReadStringIntByte(this.data, this.settings.importer.encoding);
        }
        this._score.tempo = IOHelper.readInt32LE(this.data);
        if (this._versionNumber >= 510) {
            GpBinaryHelpers.gpReadBool(this.data);
        }
        IOHelper.readInt32LE(this.data);
        if (this._versionNumber >= 400) {
            this.data.readByte();
        }
        this.readPlaybackInfos();
        if (this._versionNumber >= 500) {
            this.data.skip(38);
            this.data.skip(4);
        }
        this._barCount = IOHelper.readInt32LE(this.data);
        this._trackCount = IOHelper.readInt32LE(this.data);
        this.readMasterBars();
        this.readTracks();
        this.readBars();
        if (this._score.masterBars.length > 0) {
            this._score.masterBars[0].tempoAutomation = Automation.buildTempoAutomation(false, 0, this._score.tempo, 2);
            this._score.masterBars[0].tempoAutomation.text = this._score.tempoLabel;
        }
        this._score.finish(this.settings);
        if (this._lyrics && this._lyricsTrack >= 0) {
            this._score.tracks[this._lyricsTrack].applyLyrics(this._lyrics);
        }
        return this._score;
    }
    readVersion() {
        let version = GpBinaryHelpers.gpReadStringByteLength(this.data, 30, this.settings.importer.encoding);
        if (!version.startsWith(Gp3To5Importer.VersionString)) {
            throw 'Unsupported format';
        }
        version = version.substr(Gp3To5Importer.VersionString.length + 1);
        let dot = version.indexOf(String.fromCharCode(46));
        this._versionNumber = 100 * parseInt(version.substr(0, dot)) + parseInt(version.substr(dot + 1));
        console.log(this.name, 'Guitar Pro version ' + version + ' detected');
    }
    readScoreInformation() {
        var _a;
        this._score.title = GpBinaryHelpers.gpReadStringIntUnused(this.data, this.settings.importer.encoding);
        this._score.subTitle = GpBinaryHelpers.gpReadStringIntUnused(this.data, this.settings.importer.encoding);
        this._score.artist = GpBinaryHelpers.gpReadStringIntUnused(this.data, this.settings.importer.encoding);
        this._score.album = GpBinaryHelpers.gpReadStringIntUnused(this.data, this.settings.importer.encoding);
        this._score.words = GpBinaryHelpers.gpReadStringIntUnused(this.data, this.settings.importer.encoding);
        this._score.music =
            this._versionNumber >= 500
                ? GpBinaryHelpers.gpReadStringIntUnused(this.data, this.settings.importer.encoding)
                : this._score.words;
        this._score.copyright = GpBinaryHelpers.gpReadStringIntUnused(this.data, this.settings.importer.encoding);
        this._score.tab = GpBinaryHelpers.gpReadStringIntUnused(this.data, this.settings.importer.encoding);
        this._score.instructions = GpBinaryHelpers.gpReadStringIntUnused(this.data, this.settings.importer.encoding);
        let noticeLines = IOHelper.readInt32LE(this.data);
        let notice = '';
        for (let i = 0; i < noticeLines; i++) {
            if (i > 0) {
                notice += '\r\n';
            }
            notice += (_a = GpBinaryHelpers.gpReadStringIntUnused(this.data, this.settings.importer.encoding)) === null || _a === void 0 ? void 0 : _a.toString();
        }
        this._score.notices = notice;
    }
    readLyrics() {
        this._lyrics = [];
        this._lyricsTrack = IOHelper.readInt32LE(this.data) - 1;
        for (let i = 0; i < 5; i++) {
            let lyrics = new Lyrics();
            lyrics.startBar = IOHelper.readInt32LE(this.data) - 1;
            lyrics.text = GpBinaryHelpers.gpReadStringInt(this.data, this.settings.importer.encoding);
            this._lyrics.push(lyrics);
        }
    }
    readPageSetup() {
        this.data.skip(30);
        for (let i = 0; i < 10; i++) {
            GpBinaryHelpers.gpReadStringIntByte(this.data, this.settings.importer.encoding);
        }
    }
    readPlaybackInfos() {
        this._playbackInfos = [];
        for (let i = 0; i < 64; i++) {
            let info = new PlaybackInformation();
            info.primaryChannel = i;
            info.secondaryChannel = i;
            info.program = IOHelper.readInt32LE(this.data);
            info.volume = this.data.readByte();
            info.balance = this.data.readByte();
            this.data.skip(6);
            this._playbackInfos.push(info);
        }
    }
    readMasterBars() {
        for (let i = 0; i < this._barCount; i++) {
            this.readMasterBar();
        }
    }
    readMasterBar() {
        let previousMasterBar = null;
        if (this._score.masterBars.length > 0) {
            previousMasterBar = this._score.masterBars[this._score.masterBars.length - 1];
        }
        let newMasterBar = new MasterBar();
        let flags = this.data.readByte();
        if ((flags & 0x01) !== 0) {
            newMasterBar.timeSignatureNumerator = this.data.readByte();
        }
        else if (previousMasterBar) {
            newMasterBar.timeSignatureNumerator = previousMasterBar.timeSignatureNumerator;
        }
        if ((flags & 0x02) !== 0) {
            newMasterBar.timeSignatureDenominator = this.data.readByte();
        }
        else if (previousMasterBar) {
            newMasterBar.timeSignatureDenominator = previousMasterBar.timeSignatureDenominator;
        }
        newMasterBar.isRepeatStart = (flags & 0x04) !== 0;
        if ((flags & 0x08) !== 0) {
            newMasterBar.repeatCount = this.data.readByte() + (this._versionNumber >= 500 ? 0 : 1);
        }
        if ((flags & 0x10) !== 0 && this._versionNumber < 500) {
            let currentMasterBar = previousMasterBar;
            let existentAlternatives = 0;
            while (currentMasterBar) {
                if (currentMasterBar.isRepeatEnd && currentMasterBar !== previousMasterBar) {
                    break;
                }
                if (currentMasterBar.isRepeatStart) {
                    break;
                }
                existentAlternatives = existentAlternatives | currentMasterBar.alternateEndings;
                currentMasterBar = currentMasterBar.previousMasterBar;
            }
            let repeatAlternative = 0;
            let repeatMask = this.data.readByte();
            for (let i = 0; i < 8; i++) {
                let repeating = 1 << i;
                if (repeatMask > i && (existentAlternatives & repeating) === 0) {
                    repeatAlternative = repeatAlternative | repeating;
                }
            }
            newMasterBar.alternateEndings = repeatAlternative;
        }
        if ((flags & 0x20) !== 0) {
            let section = new Section();
            section.text = GpBinaryHelpers.gpReadStringIntByte(this.data, this.settings.importer.encoding);
            section.marker = '';
            GpBinaryHelpers.gpReadColor(this.data, false);
            newMasterBar.section = section;
        }
        if ((flags & 0x40) !== 0) {
            newMasterBar.keySignature = IOHelper.readSInt8(this.data);
            newMasterBar.keySignatureType = this.data.readByte();
        }
        else if (previousMasterBar) {
            newMasterBar.keySignature = previousMasterBar.keySignature;
            newMasterBar.keySignatureType = previousMasterBar.keySignatureType;
        }
        if (this._versionNumber >= 500 && (flags & 0x03) !== 0) {
            this.data.skip(4);
        }
        if (this._versionNumber >= 500) {
            newMasterBar.alternateEndings = this.data.readByte();
        }
        if (this._versionNumber >= 500) {
            let tripletFeel = this.data.readByte();
            switch (tripletFeel) {
                case 1:
                    newMasterBar.tripletFeel = TripletFeel.Triplet8th;
                    break;
                case 2:
                    newMasterBar.tripletFeel = TripletFeel.Triplet16th;
                    break;
            }
            this.data.readByte();
        }
        else {
            newMasterBar.tripletFeel = this._globalTripletFeel;
        }
        newMasterBar.isDoubleBar = (flags & 0x80) !== 0;
        this._score.addMasterBar(newMasterBar);
    }
    readTracks() {
        for (let i = 0; i < this._trackCount; i++) {
            this.readTrack();
        }
    }
    readTrack() {
        let newTrack = new Track();
        newTrack.ensureStaveCount(1);
        this._score.addTrack(newTrack);
        let mainStaff = newTrack.staves[0];
        let flags = this.data.readByte();
        newTrack.trackName = GpBinaryHelpers.gpReadStringByteLength(this.data, 40, this.settings.importer.encoding);
        if ((flags & 0x01) !== 0) {
            mainStaff.isPercussion = true;
        }
        let stringCount = IOHelper.readInt32LE(this.data);
        let tuning = [];
        for (let i = 0; i < 7; i++) {
            let stringTuning = IOHelper.readInt32LE(this.data);
            if (stringCount > i) {
                tuning.push(stringTuning);
            }
        }
        mainStaff.stringTuning.tunings = tuning;
        let port = IOHelper.readInt32LE(this.data);
        let index = IOHelper.readInt32LE(this.data) - 1;
        let effectChannel = IOHelper.readInt32LE(this.data) - 1;
        this.data.skip(4);
        if (index >= 0 && index < this._playbackInfos.length) {
            let info = this._playbackInfos[index];
            info.port = port;
            info.isSolo = (flags & 0x10) !== 0;
            info.isMute = (flags & 0x20) !== 0;
            info.secondaryChannel = effectChannel;
            if (GeneralMidi.isGuitar(info.program)) {
                mainStaff.displayTranspositionPitch = -12;
            }
            newTrack.playbackInfo = info;
        }
        mainStaff.capo = IOHelper.readInt32LE(this.data);
        newTrack.color = GpBinaryHelpers.gpReadColor(this.data, false);
        if (this._versionNumber >= 500) {
            this.data.readByte();
            this.data.readByte();
            this.data.skip(43);
        }
        if (this._versionNumber >= 510) {
            this.data.skip(4);
            GpBinaryHelpers.gpReadStringIntByte(this.data, this.settings.importer.encoding);
            GpBinaryHelpers.gpReadStringIntByte(this.data, this.settings.importer.encoding);
        }
    }
    readBars() {
        for (let i = 0; i < this._barCount; i++) {
            for (let t = 0; t < this._trackCount; t++) {
                this.readBar(this._score.tracks[t]);
            }
        }
    }
    readBar(track) {
        let newBar = new Bar();
        let mainStaff = track.staves[0];
        if (mainStaff.isPercussion) {
            newBar.clef = Clef.Neutral;
        }
        mainStaff.addBar(newBar);
        let voiceCount = 1;
        if (this._versionNumber >= 500) {
            this.data.readByte();
            voiceCount = 2;
        }
        for (let v = 0; v < voiceCount; v++) {
            this.readVoice(track, newBar);
        }
    }
    readVoice(track, bar) {
        let beatCount = IOHelper.readInt32LE(this.data);
        if (beatCount === 0) {
            return;
        }
        let newVoice = new Voice();
        bar.addVoice(newVoice);
        for (let i = 0; i < beatCount; i++) {
            this.readBeat(track, bar, newVoice);
        }
    }
    readBeat(track, bar, voice) {
        let newBeat = new Beat();
        let flags = this.data.readByte();
        if ((flags & 0x01) !== 0) {
            newBeat.dots = 1;
        }
        if ((flags & 0x40) !== 0) {
            let type = this.data.readByte();
            newBeat.isEmpty = (type & 0x02) === 0;
        }
        voice.addBeat(newBeat);
        let duration = IOHelper.readSInt8(this.data);
        switch (duration) {
            case -2:
                newBeat.duration = Duration.Whole;
                break;
            case -1:
                newBeat.duration = Duration.Half;
                break;
            case 0:
                newBeat.duration = Duration.Quarter;
                break;
            case 1:
                newBeat.duration = Duration.Eighth;
                break;
            case 2:
                newBeat.duration = Duration.Sixteenth;
                break;
            case 3:
                newBeat.duration = Duration.ThirtySecond;
                break;
            case 4:
                newBeat.duration = Duration.SixtyFourth;
                break;
            default:
                newBeat.duration = Duration.Quarter;
                break;
        }
        if ((flags & 0x20) !== 0) {
            newBeat.tupletNumerator = IOHelper.readInt32LE(this.data);
            switch (newBeat.tupletNumerator) {
                case 1:
                    newBeat.tupletDenominator = 1;
                    break;
                case 3:
                    newBeat.tupletDenominator = 2;
                    break;
                case 5:
                case 6:
                case 7:
                    newBeat.tupletDenominator = 4;
                    break;
                case 9:
                case 10:
                case 11:
                case 12:
                case 13:
                    newBeat.tupletDenominator = 8;
                    break;
                case 2:
                case 4:
                case 8:
                    break;
                default:
                    newBeat.tupletNumerator = 1;
                    newBeat.tupletDenominator = 1;
                    break;
            }
        }
        if ((flags & 0x02) !== 0) {
            this.readChord(newBeat);
        }
        let beatTextAsLyrics = this.settings.importer.beatTextAsLyrics
            && track.index !== this._lyricsTrack;
        if ((flags & 0x04) !== 0) {
            const text = GpBinaryHelpers.gpReadStringIntUnused(this.data, this.settings.importer.encoding);
            if (beatTextAsLyrics) {
                const lyrics = new Lyrics();
                lyrics.text = text.trim();
                lyrics.finish(true);
                const beatLyrics = [];
                for (let i = lyrics.chunks.length - 1; i >= 0; i--) {
                    beatLyrics.push(lyrics.chunks[i]);
                }
                this._beatTextChunksByTrack.set(track.index, beatLyrics);
            }
            else {
                newBeat.text = text;
            }
        }
        let allNoteHarmonicType = HarmonicType.None;
        if ((flags & 0x08) !== 0) {
            allNoteHarmonicType = this.readBeatEffects(newBeat);
        }
        if ((flags & 0x10) !== 0) {
            this.readMixTableChange(newBeat);
        }
        let stringFlags = this.data.readByte();
        for (let i = 6; i >= 0; i--) {
            if ((stringFlags & (1 << i)) !== 0 && 6 - i < bar.staff.tuning.length) {
                const note = this.readNote(track, bar, voice, newBeat, 6 - i);
                if (allNoteHarmonicType !== HarmonicType.None) {
                    note.harmonicType = allNoteHarmonicType;
                    if (note.harmonicType === HarmonicType.Natural) {
                        note.harmonicValue = this.deltaFretToHarmonicValue(note.fret);
                    }
                }
            }
        }
        if (this._versionNumber >= 500) {
            this.data.readByte();
            let flag = this.data.readByte();
            if ((flag & 0x08) !== 0) {
                this.data.readByte();
            }
        }
        if (beatTextAsLyrics && !newBeat.isRest &&
            this._beatTextChunksByTrack.has(track.index) &&
            this._beatTextChunksByTrack.get(track.index).length > 0) {
            newBeat.lyrics = [this._beatTextChunksByTrack.get(track.index).pop()];
        }
    }
    readChord(beat) {
        let chord = new Chord();
        let chordId = ModelUtils.newGuid();
        if (this._versionNumber >= 500) {
            this.data.skip(17);
            chord.name = GpBinaryHelpers.gpReadStringByteLength(this.data, 21, this.settings.importer.encoding);
            this.data.skip(4);
            chord.firstFret = IOHelper.readInt32LE(this.data);
            for (let i = 0; i < 7; i++) {
                let fret = IOHelper.readInt32LE(this.data);
                if (i < beat.voice.bar.staff.tuning.length) {
                    chord.strings.push(fret);
                }
            }
            let numberOfBarres = this.data.readByte();
            let barreFrets = new Uint8Array(5);
            this.data.read(barreFrets, 0, barreFrets.length);
            for (let i = 0; i < numberOfBarres; i++) {
                chord.barreFrets.push(barreFrets[i]);
            }
            this.data.skip(26);
        }
        else {
            if (this.data.readByte() !== 0) {
                if (this._versionNumber >= 400) {
                    this.data.skip(16);
                    chord.name = GpBinaryHelpers.gpReadStringByteLength(this.data, 21, this.settings.importer.encoding);
                    this.data.skip(4);
                    chord.firstFret = IOHelper.readInt32LE(this.data);
                    for (let i = 0; i < 7; i++) {
                        let fret = IOHelper.readInt32LE(this.data);
                        if (i < beat.voice.bar.staff.tuning.length) {
                            chord.strings.push(fret);
                        }
                    }
                    let numberOfBarres = this.data.readByte();
                    let barreFrets = new Uint8Array(5);
                    this.data.read(barreFrets, 0, barreFrets.length);
                    for (let i = 0; i < numberOfBarres; i++) {
                        chord.barreFrets.push(barreFrets[i]);
                    }
                    this.data.skip(26);
                }
                else {
                    this.data.skip(25);
                    chord.name = GpBinaryHelpers.gpReadStringByteLength(this.data, 34, this.settings.importer.encoding);
                    chord.firstFret = IOHelper.readInt32LE(this.data);
                    for (let i = 0; i < 6; i++) {
                        let fret = IOHelper.readInt32LE(this.data);
                        if (i < beat.voice.bar.staff.tuning.length) {
                            chord.strings.push(fret);
                        }
                    }
                    this.data.skip(36);
                }
            }
            else {
                let strings = this._versionNumber >= 406 ? 7 : 6;
                chord.name = GpBinaryHelpers.gpReadStringIntByte(this.data, this.settings.importer.encoding);
                chord.firstFret = IOHelper.readInt32LE(this.data);
                if (chord.firstFret > 0) {
                    for (let i = 0; i < strings; i++) {
                        let fret = IOHelper.readInt32LE(this.data);
                        if (i < beat.voice.bar.staff.tuning.length) {
                            chord.strings.push(fret);
                        }
                    }
                }
            }
        }
        if (chord.name) {
            beat.chordId = chordId;
            beat.voice.bar.staff.addChord(beat.chordId, chord);
        }
    }
    readBeatEffects(beat) {
        let flags = this.data.readByte();
        let flags2 = 0;
        if (this._versionNumber >= 400) {
            flags2 = this.data.readByte();
        }
        beat.fadeIn = (flags & 0x10) !== 0;
        if ((this._versionNumber < 400 && (flags & 0x01) !== 0) || (flags & 0x02) !== 0) {
            beat.vibrato = VibratoType.Slight;
        }
        beat.hasRasgueado = (flags2 & 0x01) !== 0;
        if ((flags & 0x20) !== 0 && this._versionNumber >= 400) {
            let slapPop = IOHelper.readSInt8(this.data);
            switch (slapPop) {
                case 1:
                    beat.tap = true;
                    break;
                case 2:
                    beat.slap = true;
                    break;
                case 3:
                    beat.pop = true;
                    break;
            }
        }
        else if ((flags & 0x20) !== 0) {
            let slapPop = IOHelper.readSInt8(this.data);
            switch (slapPop) {
                case 1:
                    beat.tap = true;
                    break;
                case 2:
                    beat.slap = true;
                    break;
                case 3:
                    beat.pop = true;
                    break;
            }
            this.data.skip(4);
        }
        if ((flags2 & 0x04) !== 0) {
            this.readTremoloBarEffect(beat);
        }
        if ((flags & 0x40) !== 0) {
            let strokeUp = 0;
            let strokeDown = 0;
            if (this._versionNumber < 500) {
                strokeDown = this.data.readByte();
                strokeUp = this.data.readByte();
            }
            else {
                strokeUp = this.data.readByte();
                strokeDown = this.data.readByte();
            }
            if (strokeUp > 0) {
                beat.brushType = BrushType.BrushUp;
                beat.brushDuration = Gp3To5Importer.toStrokeValue(strokeUp);
            }
            else if (strokeDown > 0) {
                beat.brushType = BrushType.BrushDown;
                beat.brushDuration = Gp3To5Importer.toStrokeValue(strokeDown);
            }
        }
        if ((flags2 & 0x02) !== 0) {
            switch (IOHelper.readSInt8(this.data)) {
                case 0:
                    beat.pickStroke = PickStroke.None;
                    break;
                case 1:
                    beat.pickStroke = PickStroke.Up;
                    break;
                case 2:
                    beat.pickStroke = PickStroke.Down;
                    break;
            }
        }
        if (this._versionNumber < 400) {
            if ((flags & 0x04) !== 0) {
                return HarmonicType.Natural;
            }
            else if ((flags & 0x08) !== 0) {
                return HarmonicType.Artificial;
            }
        }
        return HarmonicType.None;
    }
    readTremoloBarEffect(beat) {
        this.data.readByte();
        IOHelper.readInt32LE(this.data);
        let pointCount = IOHelper.readInt32LE(this.data);
        if (pointCount > 0) {
            for (let i = 0; i < pointCount; i++) {
                let point = new BendPoint(0, 0);
                point.offset = IOHelper.readInt32LE(this.data);
                point.value = (IOHelper.readInt32LE(this.data) / Gp3To5Importer.BendStep) | 0;
                GpBinaryHelpers.gpReadBool(this.data);
                beat.addWhammyBarPoint(point);
            }
        }
    }
    static toStrokeValue(value) {
        switch (value) {
            case 1:
                return 30;
            case 2:
                return 30;
            case 3:
                return 60;
            case 4:
                return 120;
            case 5:
                return 240;
            case 6:
                return 480;
            default:
                return 0;
        }
    }
    readMixTableChange(beat) {
        let tableChange = new MixTableChange();
        tableChange.instrument = IOHelper.readSInt8(this.data);
        if (this._versionNumber >= 500) {
            this.data.skip(16);
        }
        tableChange.volume = IOHelper.readSInt8(this.data);
        tableChange.balance = IOHelper.readSInt8(this.data);
        let chorus = IOHelper.readSInt8(this.data);
        let reverb = IOHelper.readSInt8(this.data);
        let phaser = IOHelper.readSInt8(this.data);
        let tremolo = IOHelper.readSInt8(this.data);
        if (this._versionNumber >= 500) {
            tableChange.tempoName = GpBinaryHelpers.gpReadStringIntByte(this.data, this.settings.importer.encoding);
        }
        tableChange.tempo = IOHelper.readInt32LE(this.data);
        if (tableChange.volume >= 0) {
            this.data.readByte();
        }
        if (tableChange.balance >= 0) {
            this.data.readByte();
        }
        if (chorus >= 0) {
            this.data.readByte();
        }
        if (reverb >= 0) {
            this.data.readByte();
        }
        if (phaser >= 0) {
            this.data.readByte();
        }
        if (tremolo >= 0) {
            this.data.readByte();
        }
        if (tableChange.tempo >= 0) {
            tableChange.duration = IOHelper.readSInt8(this.data);
            if (this._versionNumber >= 510) {
                this.data.readByte();
            }
        }
        if (this._versionNumber >= 400) {
            this.data.readByte();
        }
        if (this._versionNumber >= 500) {
            this.data.readByte();
        }
        if (this._versionNumber >= 510) {
            GpBinaryHelpers.gpReadStringIntByte(this.data, this.settings.importer.encoding);
            GpBinaryHelpers.gpReadStringIntByte(this.data, this.settings.importer.encoding);
        }
        if (tableChange.volume >= 0) {
            let volumeAutomation = new Automation();
            volumeAutomation.isLinear = true;
            volumeAutomation.type = AutomationType.Volume;
            volumeAutomation.value = tableChange.volume;
            beat.automations.push(volumeAutomation);
        }
        if (tableChange.balance >= 0) {
            let balanceAutomation = new Automation();
            balanceAutomation.isLinear = true;
            balanceAutomation.type = AutomationType.Balance;
            balanceAutomation.value = tableChange.balance;
            beat.automations.push(balanceAutomation);
        }
        if (tableChange.instrument >= 0) {
            let instrumentAutomation = new Automation();
            instrumentAutomation.isLinear = true;
            instrumentAutomation.type = AutomationType.Instrument;
            instrumentAutomation.value = tableChange.instrument;
            beat.automations.push(instrumentAutomation);
        }
        if (tableChange.tempo >= 0) {
            let tempoAutomation = new Automation();
            tempoAutomation.isLinear = true;
            tempoAutomation.type = AutomationType.Tempo;
            tempoAutomation.value = tableChange.tempo;
            beat.automations.push(tempoAutomation);
            beat.voice.bar.masterBar.tempoAutomation = tempoAutomation;
        }
    }
    readNote(track, bar, voice, beat, stringIndex) {
        let newNote = new Note();
        newNote.string = bar.staff.tuning.length - stringIndex;
        let flags = this.data.readByte();
        if ((flags & 0x02) !== 0) {
            newNote.accentuated = AccentuationType.Heavy;
        }
        else if ((flags & 0x40) !== 0) {
            newNote.accentuated = AccentuationType.Normal;
        }
        newNote.isGhost = (flags & 0x04) !== 0;
        if ((flags & 0x20) !== 0) {
            let noteType = this.data.readByte();
            if (noteType === 3) {
                newNote.isDead = true;
            }
            else if (noteType === 2) {
                newNote.isTieDestination = true;
            }
        }
        if ((flags & 0x01) !== 0 && this._versionNumber < 500) {
            this.data.readByte();
            this.data.readByte();
        }
        if ((flags & 0x10) !== 0) {
            let dynamicNumber = IOHelper.readSInt8(this.data);
            newNote.dynamics = this.toDynamicValue(dynamicNumber);
            beat.dynamics = newNote.dynamics;
        }
        if ((flags & 0x20) !== 0) {
            newNote.fret = IOHelper.readSInt8(this.data);
        }
        if ((flags & 0x80) !== 0) {
            newNote.leftHandFinger = IOHelper.readSInt8(this.data);
            newNote.rightHandFinger = IOHelper.readSInt8(this.data);
            newNote.isFingering = true;
        }
        let swapAccidentals = false;
        if (this._versionNumber >= 500) {
            if ((flags & 0x01) !== 0) {
                newNote.durationPercent = GpBinaryHelpers.gpReadDouble(this.data);
            }
            let flags2 = this.data.readByte();
            swapAccidentals = (flags2 & 0x02) !== 0;
        }
        beat.addNote(newNote);
        if ((flags & 0x08) !== 0) {
            this.readNoteEffects(track, voice, beat, newNote);
        }
        if (bar.staff.isPercussion) {
            newNote.percussionArticulation = newNote.fret;
            newNote.string = -1;
            newNote.fret = -1;
        }
        if (swapAccidentals) {
            const accidental = Tuning.defaultAccidentals[newNote.realValueWithoutHarmonic % 12];
            if (accidental === '#') {
                newNote.accidentalMode = NoteAccidentalMode.ForceFlat;
            }
            else if (accidental === 'b') {
                newNote.accidentalMode = NoteAccidentalMode.ForceSharp;
            }
        }
        return newNote;
    }
    toDynamicValue(value) {
        switch (value) {
            case 1:
                return DynamicValue.PPP;
            case 2:
                return DynamicValue.PP;
            case 3:
                return DynamicValue.P;
            case 4:
                return DynamicValue.MP;
            case 5:
                return DynamicValue.MF;
            case 6:
                return DynamicValue.F;
            case 7:
                return DynamicValue.FF;
            case 8:
                return DynamicValue.FFF;
            default:
                return DynamicValue.F;
        }
    }
    readNoteEffects(track, voice, beat, note) {
        let flags = this.data.readByte();
        let flags2 = 0;
        if (this._versionNumber >= 400) {
            flags2 = this.data.readByte();
        }
        if ((flags & 0x01) !== 0) {
            this.readBend(note);
        }
        if ((flags & 0x10) !== 0) {
            this.readGrace(voice, note);
        }
        if ((flags2 & 0x04) !== 0) {
            this.readTremoloPicking(beat);
        }
        if ((flags2 & 0x08) !== 0) {
            this.readSlide(note);
        }
        else if (this._versionNumber < 400) {
            if ((flags & 0x04) !== 0) {
                note.slideOutType = SlideOutType.Shift;
            }
        }
        if ((flags2 & 0x10) !== 0) {
            this.readArtificialHarmonic(note);
        }
        if ((flags2 & 0x20) !== 0) {
            this.readTrill(note);
        }
        note.isLetRing = (flags & 0x08) !== 0;
        note.isHammerPullOrigin = (flags & 0x02) !== 0;
        if ((flags2 & 0x40) !== 0) {
            note.vibrato = VibratoType.Slight;
        }
        note.isPalmMute = (flags2 & 0x02) !== 0;
        note.isStaccato = (flags2 & 0x01) !== 0;
    }
    readBend(note) {
        this.data.readByte();
        IOHelper.readInt32LE(this.data);
        let pointCount = IOHelper.readInt32LE(this.data);
        if (pointCount > 0) {
            for (let i = 0; i < pointCount; i++) {
                let point = new BendPoint(0, 0);
                point.offset = IOHelper.readInt32LE(this.data);
                point.value = (IOHelper.readInt32LE(this.data) / Gp3To5Importer.BendStep) | 0;
                GpBinaryHelpers.gpReadBool(this.data);
                note.addBendPoint(point);
            }
        }
    }
    readGrace(voice, note) {
        let graceBeat = new Beat();
        let graceNote = new Note();
        graceNote.string = note.string;
        graceNote.fret = IOHelper.readSInt8(this.data);
        graceBeat.duration = Duration.ThirtySecond;
        graceBeat.dynamics = this.toDynamicValue(IOHelper.readSInt8(this.data));
        let transition = IOHelper.readSInt8(this.data);
        switch (transition) {
            case 0:
                break;
            case 1:
                graceNote.slideOutType = SlideOutType.Legato;
                graceNote.slideTarget = note;
                break;
            case 2:
                break;
            case 3:
                graceNote.isHammerPullOrigin = true;
                break;
        }
        graceNote.dynamics = graceBeat.dynamics;
        this.data.skip(1);
        if (this._versionNumber < 500) {
            graceBeat.graceType = GraceType.BeforeBeat;
        }
        else {
            let flags = this.data.readByte();
            graceNote.isDead = (flags & 0x01) !== 0;
            graceBeat.graceType = (flags & 0x02) !== 0 ? GraceType.OnBeat : GraceType.BeforeBeat;
        }
        voice.addGraceBeat(graceBeat);
        graceBeat.addNote(graceNote);
    }
    readTremoloPicking(beat) {
        let speed = this.data.readByte();
        switch (speed) {
            case 1:
                beat.tremoloSpeed = Duration.Eighth;
                break;
            case 2:
                beat.tremoloSpeed = Duration.Sixteenth;
                break;
            case 3:
                beat.tremoloSpeed = Duration.ThirtySecond;
                break;
        }
    }
    readSlide(note) {
        if (this._versionNumber >= 500) {
            let type = IOHelper.readSInt8(this.data);
            if ((type & 1) !== 0) {
                note.slideOutType = SlideOutType.Shift;
            }
            else if ((type & 2) !== 0) {
                note.slideOutType = SlideOutType.Legato;
            }
            else if ((type & 4) !== 0) {
                note.slideOutType = SlideOutType.OutDown;
            }
            else if ((type & 8) !== 0) {
                note.slideOutType = SlideOutType.OutUp;
            }
            if ((type & 16) !== 0) {
                note.slideInType = SlideInType.IntoFromBelow;
            }
            else if ((type & 32) !== 0) {
                note.slideInType = SlideInType.IntoFromAbove;
            }
        }
        else {
            let type = IOHelper.readSInt8(this.data);
            switch (type) {
                case 1:
                    note.slideOutType = SlideOutType.Shift;
                    break;
                case 2:
                    note.slideOutType = SlideOutType.Legato;
                    break;
                case 3:
                    note.slideOutType = SlideOutType.OutDown;
                    break;
                case 4:
                    note.slideOutType = SlideOutType.OutUp;
                    break;
                case -1:
                    note.slideInType = SlideInType.IntoFromBelow;
                    break;
                case -2:
                    note.slideInType = SlideInType.IntoFromAbove;
                    break;
            }
        }
    }
    readArtificialHarmonic(note) {
        let type = this.data.readByte();
        if (this._versionNumber >= 500) {
            switch (type) {
                case 1:
                    note.harmonicType = HarmonicType.Natural;
                    note.harmonicValue = this.deltaFretToHarmonicValue(note.fret);
                    break;
                case 2:
                    this.data.readByte();
                    this.data.readByte();
                    this.data.readByte();
                    note.harmonicType = HarmonicType.Artificial;
                    break;
                case 3:
                    note.harmonicType = HarmonicType.Tap;
                    note.harmonicValue = this.deltaFretToHarmonicValue(this.data.readByte());
                    break;
                case 4:
                    note.harmonicType = HarmonicType.Pinch;
                    note.harmonicValue = 12;
                    break;
                case 5:
                    note.harmonicType = HarmonicType.Semi;
                    note.harmonicValue = 12;
                    break;
            }
        }
        else if (this._versionNumber >= 400) {
            switch (type) {
                case 1:
                    note.harmonicType = HarmonicType.Natural;
                    break;
                case 3:
                    note.harmonicType = HarmonicType.Tap;
                    break;
                case 4:
                    note.harmonicType = HarmonicType.Pinch;
                    break;
                case 5:
                    note.harmonicType = HarmonicType.Semi;
                    break;
                case 15:
                    note.harmonicType = HarmonicType.Artificial;
                    break;
                case 17:
                    note.harmonicType = HarmonicType.Artificial;
                    break;
                case 22:
                    note.harmonicType = HarmonicType.Artificial;
                    break;
            }
        }
    }
    deltaFretToHarmonicValue(deltaFret) {
        switch (deltaFret) {
            case 2:
                return 2.4;
            case 3:
                return 3.2;
            case 4:
            case 5:
            case 7:
            case 9:
            case 12:
            case 16:
            case 17:
            case 19:
            case 24:
                return deltaFret;
            case 8:
                return 8.2;
            case 10:
                return 9.6;
            case 14:
            case 15:
                return 14.7;
            case 21:
            case 22:
                return 21.7;
            default:
                return 12;
        }
    }
    readTrill(note) {
        note.trillValue = this.data.readByte() + note.stringTuning;
        switch (this.data.readByte()) {
            case 1:
                note.trillSpeed = Duration.Sixteenth;
                break;
            case 2:
                note.trillSpeed = Duration.ThirtySecond;
                break;
            case 3:
                note.trillSpeed = Duration.SixtyFourth;
                break;
        }
    }
}
Gp3To5Importer.VersionString = 'FICHIER GUITAR PRO ';
Gp3To5Importer.BendStep = 25;
class GpBinaryHelpers {
    static gpReadDouble(data) {
        let bytes = new Uint8Array(8);
        data.read(bytes, 0, bytes.length);
        let array = new Float64Array(bytes.buffer);
        return array[0];
    }
    static gpReadFloat(data) {
        let bytes = new Uint8Array(4);
        bytes[3] = data.readByte();
        bytes[2] = data.readByte();
        bytes[2] = data.readByte();
        bytes[1] = data.readByte();
        let array = new Float32Array(bytes.buffer);
        return array[0];
    }
    static gpReadColor(data, readAlpha = false) {
        let r = data.readByte();
        let g = data.readByte();
        let b = data.readByte();
        let a = 255;
        if (readAlpha) {
            a = data.readByte();
        }
        else {
            data.skip(1);
        }
        return new Color(r, g, b, a);
    }
    static gpReadBool(data) {
        return data.readByte() !== 0;
    }
    static gpReadStringIntUnused(data, encoding) {
        data.skip(4);
        return GpBinaryHelpers.gpReadString(data, data.readByte(), encoding);
    }
    static gpReadStringInt(data, encoding) {
        return GpBinaryHelpers.gpReadString(data, IOHelper.readInt32LE(data), encoding);
    }
    static gpReadStringIntByte(data, encoding) {
        let length = IOHelper.readInt32LE(data) - 1;
        data.readByte();
        return GpBinaryHelpers.gpReadString(data, length, encoding);
    }
    static gpReadString(data, length, encoding) {
        let b = new Uint8Array(length);
        data.read(b, 0, b.length);
        return IOHelper.toString(b, encoding);
    }
    static gpWriteString(data, s) {
        const encoded = IOHelper.stringToBytes(s);
        data.writeByte(s.length);
        data.write(encoded, 0, encoded.length);
    }
    static gpReadStringByteLength(data, length, encoding) {
        let stringLength = data.readByte();
        let s = GpBinaryHelpers.gpReadString(data, stringLength, encoding);
        if (stringLength < length) {
            data.skip(length - stringLength);
        }
        return s;
    }
}
class MixTableChange {
    constructor() {
        this.volume = -1;
        this.balance = -1;
        this.instrument = -1;
        this.tempoName = '';
        this.tempo = -1;
        this.duration = -1;
    }
}
class EndOfReaderError {
    constructor() {
    }
}
class Settings {
    constructor() {
        this.notation = new NotationSettings();
        this.importer = new ImporterSettings();
    }
}
class Score {
    constructor() {
        this._currentRepeatGroup = null;
        this._openedRepeatGroups = [];
        this._properlyOpenedRepeatGroups = 0;
        this.album = '';
        this.artist = '';
        this.copyright = '';
        this.instructions = '';
        this.music = '';
        this.notices = '';
        this.subTitle = '';
        this.title = '';
        this.words = '';
        this.tab = '';
        this.tempo = 120;
        this.tempoLabel = '';
        this.masterBars = [];
        this.tracks = [];
        this.defaultSystemsLayout = 3;
        this.systemsLayout = [];
    }
    rebuildRepeatGroups() {
        this._currentRepeatGroup = null;
        this._openedRepeatGroups = [];
        this._properlyOpenedRepeatGroups = 0;
        for (const bar of this.masterBars) {
            this.addMasterBarToRepeatGroups(bar);
        }
    }
    addMasterBar(bar) {
        bar.score = this;
        bar.index = this.masterBars.length;
        if (this.masterBars.length !== 0) {
            bar.previousMasterBar = this.masterBars[this.masterBars.length - 1];
            bar.previousMasterBar.nextMasterBar = bar;
            bar.start =
                bar.previousMasterBar.start +
                    (bar.previousMasterBar.isAnacrusis ? 0 : bar.previousMasterBar.calculateDuration());
        }
        this.addMasterBarToRepeatGroups(bar);
        this.masterBars.push(bar);
    }
    addMasterBarToRepeatGroups(bar) {
        var _a;
        if (bar.isRepeatStart) {
            if ((_a = this._currentRepeatGroup) === null || _a === void 0 ? void 0 : _a.isClosed) {
                this._openedRepeatGroups.pop();
                this._properlyOpenedRepeatGroups--;
            }
            this._currentRepeatGroup = new RepeatGroup();
            this._openedRepeatGroups.push(this._currentRepeatGroup);
            this._properlyOpenedRepeatGroups++;
        }
        else if (!this._currentRepeatGroup) {
            this._currentRepeatGroup = new RepeatGroup();
            this._openedRepeatGroups.push(this._currentRepeatGroup);
        }
        this._currentRepeatGroup.addMasterBar(bar);
        if (bar.isRepeatEnd) {
            if (this._properlyOpenedRepeatGroups > 1) {
                this._openedRepeatGroups.pop();
                this._properlyOpenedRepeatGroups--;
                this._currentRepeatGroup =
                    this._openedRepeatGroups.length > 0
                        ? this._openedRepeatGroups[this._openedRepeatGroups.length - 1]
                        : null;
            }
        }
    }
    addTrack(track) {
        track.score = this;
        track.index = this.tracks.length;
        this.tracks.push(track);
    }
    finish(settings) {
        const sharedDataBag = new Map();
        for (let i = 0, j = this.tracks.length; i < j; i++) {
            this.tracks[i].finish(settings, sharedDataBag);
        }
    }
}
class RepeatGroup {
    constructor() {
        this.masterBars = [];
        this.opening = null;
        this.closings = [];
        this.isClosed = false;
    }
    get openings() {
        const opening = this.opening;
        return opening ? [opening] : [];
    }
    get isOpened() { var _a; return ((_a = this.opening) === null || _a === void 0 ? void 0 : _a.isRepeatStart) === true; }
    addMasterBar(masterBar) {
        if (this.opening === null) {
            this.opening = masterBar;
        }
        this.masterBars.push(masterBar);
        masterBar.repeatGroup = this;
        if (masterBar.isRepeatEnd) {
            this.closings.push(masterBar);
            this.isClosed = true;
        }
    }
}
var AccentuationType;
(function (AccentuationType) {
    AccentuationType[AccentuationType["None"] = 0] = "None";
    AccentuationType[AccentuationType["Normal"] = 1] = "Normal";
    AccentuationType[AccentuationType["Heavy"] = 2] = "Heavy";
})(AccentuationType || (AccentuationType = {}));
var AccidentalType;
(function (AccidentalType) {
    AccidentalType[AccidentalType["None"] = 0] = "None";
    AccidentalType[AccidentalType["Natural"] = 1] = "Natural";
    AccidentalType[AccidentalType["Sharp"] = 2] = "Sharp";
    AccidentalType[AccidentalType["Flat"] = 3] = "Flat";
    AccidentalType[AccidentalType["NaturalQuarterNoteUp"] = 4] = "NaturalQuarterNoteUp";
    AccidentalType[AccidentalType["SharpQuarterNoteUp"] = 5] = "SharpQuarterNoteUp";
    AccidentalType[AccidentalType["FlatQuarterNoteUp"] = 6] = "FlatQuarterNoteUp";
    AccidentalType[AccidentalType["DoubleSharp"] = 7] = "DoubleSharp";
    AccidentalType[AccidentalType["DoubleFlat"] = 8] = "DoubleFlat";
})(AccidentalType || (AccidentalType = {}));
var AutomationType;
(function (AutomationType) {
    AutomationType[AutomationType["Tempo"] = 0] = "Tempo";
    AutomationType[AutomationType["Volume"] = 1] = "Volume";
    AutomationType[AutomationType["Instrument"] = 2] = "Instrument";
    AutomationType[AutomationType["Balance"] = 3] = "Balance";
})(AutomationType || (AutomationType = {}));
class Automation {
    constructor() {
        this.isLinear = false;
        this.type = AutomationType.Tempo;
        this.value = 0;
        this.ratioPosition = 0;
        this.text = '';
    }
    static buildTempoAutomation(isLinear, ratioPosition, value, reference) {
        if (reference < 1 || reference > 5) {
            reference = 2;
        }
        let references = new Float32Array([1, 0.5, 1.0, 1.5, 2.0, 3.0]);
        let automation = new Automation();
        automation.type = AutomationType.Tempo;
        automation.isLinear = isLinear;
        automation.ratioPosition = ratioPosition;
        automation.value = value * references[reference];
        return automation;
    }
    static buildInstrumentAutomation(isLinear, ratioPosition, value) {
        let automation = new Automation();
        automation.type = AutomationType.Instrument;
        automation.isLinear = isLinear;
        automation.ratioPosition = ratioPosition;
        automation.value = value;
        return automation;
    }
}
class Bar {
    constructor() {
        this.id = Bar._globalBarId++;
        this.index = 0;
        this.nextBar = null;
        this.previousBar = null;
        this.clef = Clef.G2;
        this.clefOttava = Ottavia.Regular;
        this.voices = [];
        this.simileMark = SimileMark.None;
        this.isMultiVoice = false;
        this.displayScale = 1;
        this.displayWidth = -1;
    }
    get masterBar() {
        return this.staff.track.score.masterBars[this.index];
    }
    get isEmpty() {
        for (let i = 0, j = this.voices.length; i < j; i++) {
            if (!this.voices[i].isEmpty) {
                return false;
            }
        }
        return true;
    }
    addVoice(voice) {
        voice.bar = this;
        voice.index = this.voices.length;
        this.voices.push(voice);
    }
    finish(settings, sharedDataBag = null) {
        this.isMultiVoice = false;
        for (let i = 0, j = this.voices.length; i < j; i++) {
            let voice = this.voices[i];
            voice.finish(settings, sharedDataBag);
            if (i > 0 && !voice.isEmpty) {
                this.isMultiVoice = true;
            }
        }
    }
    calculateDuration() {
        let duration = 0;
        for (let voice of this.voices) {
            let voiceDuration = voice.calculateDuration();
            if (voiceDuration > duration) {
                duration = voiceDuration;
            }
        }
        return duration;
    }
}
Bar._globalBarId = 0;
var BeatBeamingMode;
(function (BeatBeamingMode) {
    BeatBeamingMode[BeatBeamingMode["Auto"] = 0] = "Auto";
    BeatBeamingMode[BeatBeamingMode["ForceSplitToNext"] = 1] = "ForceSplitToNext";
    BeatBeamingMode[BeatBeamingMode["ForceMergeWithNext"] = 2] = "ForceMergeWithNext";
})(BeatBeamingMode || (BeatBeamingMode = {}));
class Beat {
    constructor() {
        this.id = Beat._globalBeatId++;
        this.index = 0;
        this.previousBeat = null;
        this.nextBeat = null;
        this.notes = [];
        this.noteStringLookup = new Map();
        this.noteValueLookup = new Map();
        this.isEmpty = false;
        this.whammyStyle = BendStyle.Default;
        this.ottava = Ottavia.Regular;
        this.fermata = null;
        this.isLegatoOrigin = false;
        this.minNote = null;
        this.maxNote = null;
        this.maxStringNote = null;
        this.minStringNote = null;
        this.duration = Duration.Quarter;
        this.isLetRing = false;
        this.isPalmMute = false;
        this.automations = [];
        this.dots = 0;
        this.fadeIn = false;
        this.lyrics = null;
        this.hasRasgueado = false;
        this.pop = false;
        this.slap = false;
        this.tap = false;
        this.text = null;
        this.brushType = BrushType.None;
        this.brushDuration = 0;
        this.tupletDenominator = -1;
        this.tupletNumerator = -1;
        this.tupletGroup = null;
        this.isContinuedWhammy = false;
        this.whammyBarType = WhammyType.None;
        this.whammyBarPoints = null;
        this.maxWhammyPoint = null;
        this.minWhammyPoint = null;
        this.vibrato = VibratoType.None;
        this.chordId = null;
        this.graceType = GraceType.None;
        this.graceGroup = null;
        this.graceIndex = -1;
        this.pickStroke = PickStroke.None;
        this.tremoloSpeed = null;
        this.crescendo = CrescendoType.None;
        this.displayStart = 0;
        this.playbackStart = 0;
        this.displayDuration = 0;
        this.playbackDuration = 0;
        this.dynamics = DynamicValue.F;
        this.invertBeamDirection = false;
        this.preferredBeamDirection = null;
        this.isEffectSlurOrigin = false;
        this.effectSlurOrigin = null;
        this.effectSlurDestination = null;
        this.beamingMode = BeatBeamingMode.Auto;
    }
    get isLastOfVoice() {
        return this.index === this.voice.beats.length - 1;
    }
    get isLegatoDestination() {
        return !!this.previousBeat && this.previousBeat.isLegatoOrigin;
    }
    get isRest() {
        return this.isEmpty || this.notes.length === 0;
    }
    get isFullBarRest() {
        return this.isRest && this.voice.beats.length === 1 && this.duration === Duration.Whole;
    }
    get hasTuplet() {
        return (!(this.tupletDenominator === -1 && this.tupletNumerator === -1) &&
            !(this.tupletDenominator === 1 && this.tupletNumerator === 1));
    }
    get hasWhammyBar() {
        return this.whammyBarPoints !== null && this.whammyBarType !== WhammyType.None;
    }
    get hasChord() {
        return !!this.chordId;
    }
    get chord() {
        return this.chordId ? this.voice.bar.staff.getChord(this.chordId) : null;
    }
    get isTremolo() {
        return !!this.tremoloSpeed;
    }
    get absoluteDisplayStart() {
        return this.voice.bar.masterBar.start + this.displayStart;
    }
    get absolutePlaybackStart() {
        return this.voice.bar.masterBar.start + this.playbackStart;
    }
    get isEffectSlurDestination() {
        return !!this.effectSlurOrigin;
    }
    addWhammyBarPoint(point) {
        let points = this.whammyBarPoints;
        if (points === null) {
            points = [];
            this.whammyBarPoints = points;
        }
        points.push(point);
        if (!this.maxWhammyPoint || point.value > this.maxWhammyPoint.value) {
            this.maxWhammyPoint = point;
        }
        if (!this.minWhammyPoint || point.value < this.minWhammyPoint.value) {
            this.minWhammyPoint = point;
        }
        if (this.whammyBarType === WhammyType.None) {
            this.whammyBarType = WhammyType.Custom;
        }
    }
    removeWhammyBarPoint(index) {
        const points = this.whammyBarPoints;
        if (points === null || index < 0 || index >= points.length) {
            return;
        }
        points.splice(index, 1);
        let point = points[index];
        if (point === this.maxWhammyPoint) {
            this.maxWhammyPoint = null;
            for (let currentPoint of points) {
                if (!this.maxWhammyPoint || currentPoint.value > this.maxWhammyPoint.value) {
                    this.maxWhammyPoint = currentPoint;
                }
            }
        }
        if (point === this.minWhammyPoint) {
            this.minWhammyPoint = null;
            for (let currentPoint of points) {
                if (!this.minWhammyPoint || currentPoint.value < this.minWhammyPoint.value) {
                    this.minWhammyPoint = currentPoint;
                }
            }
        }
    }
    addNote(note) {
        note.beat = this;
        note.index = this.notes.length;
        this.notes.push(note);
        if (note.isStringed) {
            this.noteStringLookup.set(note.string, note);
        }
    }
    removeNote(note) {
        let index = this.notes.indexOf(note);
        if (index >= 0) {
            this.notes.splice(index, 1);
            if (note.isStringed) {
                this.noteStringLookup.delete(note.string);
            }
        }
    }
    getAutomation(type) {
        for (let i = 0, j = this.automations.length; i < j; i++) {
            let automation = this.automations[i];
            if (automation.type === type) {
                return automation;
            }
        }
        return null;
    }
    getNoteOnString(noteString) {
        if (this.noteStringLookup.has(noteString)) {
            return this.noteStringLookup.get(noteString);
        }
        return null;
    }
    calculateDuration() {
        if (this.isFullBarRest) {
            return this.voice.bar.masterBar.calculateDuration();
        }
        let ticks = MidiUtils.toTicks(this.duration);
        if (this.dots === 2) {
            ticks = MidiUtils.applyDot(ticks, true);
        }
        else if (this.dots === 1) {
            ticks = MidiUtils.applyDot(ticks, false);
        }
        if (this.tupletDenominator > 0 && this.tupletNumerator >= 0) {
            ticks = MidiUtils.applyTuplet(ticks, this.tupletNumerator, this.tupletDenominator);
        }
        return ticks;
    }
    updateDurations() {
        let ticks = this.calculateDuration();
        this.playbackDuration = ticks;
        switch (this.graceType) {
            case GraceType.BeforeBeat:
            case GraceType.OnBeat:
                switch (this.duration) {
                    case Duration.Sixteenth:
                        this.playbackDuration = MidiUtils.toTicks(Duration.SixtyFourth);
                        break;
                    case Duration.ThirtySecond:
                        this.playbackDuration = MidiUtils.toTicks(Duration.OneHundredTwentyEighth);
                        break;
                    default:
                        this.playbackDuration = MidiUtils.toTicks(Duration.ThirtySecond);
                        break;
                }
                this.displayDuration = 0;
                break;
            case GraceType.BendGrace:
                this.playbackDuration /= 2;
                this.displayDuration = 0;
                break;
            default:
                this.displayDuration = ticks;
                let previous = this.previousBeat;
                if (previous && previous.graceType === GraceType.BendGrace) {
                    this.playbackDuration = previous.playbackDuration;
                }
                break;
        }
    }
    finishTuplet() {
        let previousBeat = this.previousBeat;
        let currentTupletGroup = previousBeat ? previousBeat.tupletGroup : null;
        if (this.hasTuplet || (this.graceType !== GraceType.None && currentTupletGroup)) {
            if (!previousBeat || !currentTupletGroup || !currentTupletGroup.check(this)) {
                currentTupletGroup = new TupletGroup(this.voice);
                currentTupletGroup.check(this);
            }
            this.tupletGroup = currentTupletGroup;
        }
    }
    finish(settings, sharedDataBag = null) {
        if (this.getAutomation(AutomationType.Instrument) === null &&
            this.index === 0 &&
            this.voice.index === 0 &&
            this.voice.bar.index === 0 &&
            this.voice.bar.staff.index === 0) {
            this.automations.push(Automation.buildInstrumentAutomation(false, 0, this.voice.bar.staff.track.playbackInfo.program));
        }
        switch (this.graceType) {
            case GraceType.OnBeat:
            case GraceType.BeforeBeat:
                let numberOfGraceBeats = this.graceGroup.beats.length;
                if (numberOfGraceBeats === 1) {
                    this.duration = Duration.Eighth;
                }
                else if (numberOfGraceBeats === 2) {
                    this.duration = Duration.Sixteenth;
                }
                else {
                    this.duration = Duration.ThirtySecond;
                }
                break;
        }
        let displayMode = !settings ? NotationMode.GuitarPro : settings.notation.notationMode;
        let isGradual = this.text === 'grad' || this.text === 'grad.';
        if (isGradual && displayMode === NotationMode.SongBook) {
            this.text = '';
        }
        let needCopyBeatForBend = false;
        this.minNote = null;
        this.maxNote = null;
        this.minStringNote = null;
        this.maxStringNote = null;
        let visibleNotes = 0;
        let isEffectSlurBeat = false;
        for (let i = 0, j = this.notes.length; i < j; i++) {
            let note = this.notes[i];
            note.dynamics = this.dynamics;
            note.finish(settings, sharedDataBag);
            if (note.isLetRing) {
                this.isLetRing = true;
            }
            if (note.isPalmMute) {
                this.isPalmMute = true;
            }
            if (displayMode === NotationMode.SongBook && note.hasBend && this.graceType !== GraceType.BendGrace) {
                if (!note.isTieOrigin) {
                    switch (note.bendType) {
                        case BendType.Bend:
                        case BendType.PrebendRelease:
                        case BendType.PrebendBend:
                            needCopyBeatForBend = true;
                            break;
                    }
                }
                if (isGradual || note.bendStyle === BendStyle.Gradual) {
                    isGradual = true;
                    note.bendStyle = BendStyle.Gradual;
                    needCopyBeatForBend = false;
                }
                else {
                    note.bendStyle = BendStyle.Fast;
                }
            }
            if (note.isVisible) {
                visibleNotes++;
                if (!this.minNote || note.realValue < this.minNote.realValue) {
                    this.minNote = note;
                }
                if (!this.maxNote || note.realValue > this.maxNote.realValue) {
                    this.maxNote = note;
                }
                if (!this.minStringNote || note.string < this.minStringNote.string) {
                    this.minStringNote = note;
                }
                if (!this.maxStringNote || note.string > this.maxStringNote.string) {
                    this.maxStringNote = note;
                }
                if (note.hasEffectSlur) {
                    isEffectSlurBeat = true;
                }
            }
        }
        if (isEffectSlurBeat) {
            if (this.effectSlurOrigin) {
                this.effectSlurOrigin.effectSlurDestination = this.nextBeat;
                if (this.effectSlurOrigin.effectSlurDestination) {
                    this.effectSlurOrigin.effectSlurDestination.effectSlurOrigin = this.effectSlurOrigin;
                }
                this.effectSlurOrigin = null;
            }
            else {
                this.isEffectSlurOrigin = true;
                this.effectSlurDestination = this.nextBeat;
                if (this.effectSlurDestination) {
                    this.effectSlurDestination.effectSlurOrigin = this;
                }
            }
        }
        if (this.notes.length > 0 && visibleNotes === 0) {
            this.isEmpty = true;
        }
        if (!this.isRest && (!this.isLetRing || !this.isPalmMute)) {
            let currentBeat = this.previousBeat;
            while (currentBeat && currentBeat.isRest) {
                if (!this.isLetRing) {
                    currentBeat.isLetRing = false;
                }
                if (!this.isPalmMute) {
                    currentBeat.isPalmMute = false;
                }
                currentBeat = currentBeat.previousBeat;
            }
        }
        else if (this.isRest &&
            this.previousBeat &&
            settings &&
            settings.notation.notationMode === NotationMode.GuitarPro) {
            if (this.previousBeat.isLetRing) {
                this.isLetRing = true;
            }
            if (this.previousBeat.isPalmMute) {
                this.isPalmMute = true;
            }
        }
        const points = this.whammyBarPoints;
        if (points !== null && points.length > 0 && this.whammyBarType === WhammyType.Custom) {
            if (displayMode === NotationMode.SongBook) {
                this.whammyStyle = isGradual ? BendStyle.Gradual : BendStyle.Fast;
            }
            let isContinuedWhammy = !!this.previousBeat && this.previousBeat.hasWhammyBar;
            this.isContinuedWhammy = isContinuedWhammy;
            if (points.length === 4) {
                let origin = points[0];
                let middle1 = points[1];
                let middle2 = points[2];
                let destination = points[3];
                if (middle1.value === middle2.value) {
                    if ((origin.value < middle1.value && middle1.value < destination.value) ||
                        (origin.value > middle1.value && middle1.value > destination.value)) {
                        if (origin.value !== 0 && !isContinuedWhammy) {
                            this.whammyBarType = WhammyType.PrediveDive;
                        }
                        else {
                            this.whammyBarType = WhammyType.Dive;
                        }
                        points.splice(2, 1);
                        points.splice(1, 1);
                    }
                    else if ((origin.value > middle1.value && middle1.value < destination.value) ||
                        (origin.value < middle1.value && middle1.value > destination.value)) {
                        this.whammyBarType = WhammyType.Dip;
                        if (middle1.offset === middle2.offset || displayMode === NotationMode.SongBook) {
                            points.splice(2, 1);
                        }
                    }
                    else if (origin.value === middle1.value && middle1.value === destination.value) {
                        if (origin.value !== 0 && !isContinuedWhammy) {
                            this.whammyBarType = WhammyType.Predive;
                        }
                        else {
                            this.whammyBarType = WhammyType.Hold;
                        }
                        points.splice(2, 1);
                        points.splice(1, 1);
                    }
                }
            }
        }
        this.updateDurations();
        if (needCopyBeatForBend) {
            let cloneBeat = BeatCloner.clone(this);
            cloneBeat.id = Beat._globalBeatId++;
            cloneBeat.pickStroke = PickStroke.None;
            for (let i = 0, j = cloneBeat.notes.length; i < j; i++) {
                let cloneNote = cloneBeat.notes[i];
                let note = this.notes[i];
                cloneNote.bendType = BendType.None;
                cloneNote.maxBendPoint = null;
                cloneNote.bendPoints = null;
                cloneNote.bendStyle = BendStyle.Default;
                cloneNote.id = Note.GlobalNoteId++;
                if (note.isTieOrigin) {
                    cloneNote.tieDestination = note.tieDestination;
                    note.tieDestination.tieOrigin = cloneNote;
                }
                if (note.isTieDestination) {
                    cloneNote.tieOrigin = note.tieOrigin ? note.tieOrigin : null;
                    note.tieOrigin.tieDestination = cloneNote;
                }
                if (note.hasBend && note.isTieOrigin) {
                    let tieDestination = Note.findTieOrigin(note);
                    if (tieDestination && tieDestination.hasBend) {
                        cloneNote.bendType = BendType.Hold;
                        let lastPoint = note.bendPoints[note.bendPoints.length - 1];
                        cloneNote.addBendPoint(new BendPoint(0, lastPoint.value));
                        cloneNote.addBendPoint(new BendPoint(BendPoint.MaxPosition, lastPoint.value));
                    }
                }
                cloneNote.isTieDestination = true;
            }
            this.graceType = GraceType.BendGrace;
            this.graceGroup = new GraceGroup();
            this.graceGroup.addBeat(this);
            this.graceGroup.isComplete = true;
            this.graceGroup.finish();
            this.updateDurations();
            this.voice.insertBeat(this, cloneBeat);
            cloneBeat.graceGroup = new GraceGroup();
            cloneBeat.graceGroup.addBeat(this);
            cloneBeat.graceGroup.isComplete = true;
            cloneBeat.graceGroup.finish();
        }
    }
    isBefore(beat) {
        return (this.voice.bar.index < beat.voice.bar.index ||
            (beat.voice.bar.index === this.voice.bar.index && this.index < beat.index));
    }
    isAfter(beat) {
        return (this.voice.bar.index > beat.voice.bar.index ||
            (beat.voice.bar.index === this.voice.bar.index && this.index > beat.index));
    }
    hasNoteOnString(noteString) {
        return this.noteStringLookup.has(noteString);
    }
    getNoteWithRealValue(noteRealValue) {
        if (this.noteValueLookup.has(noteRealValue)) {
            return this.noteValueLookup.get(noteRealValue);
        }
        return null;
    }
    chain(sharedDataBag = null) {
        for (const n of this.notes) {
            this.noteValueLookup.set(n.realValue, n);
            n.chain(sharedDataBag);
        }
    }
}
Beat._globalBeatId = 0;
class BendPoint {
    constructor(offset = 0, value = 0) {
        this.offset = offset;
        this.value = value;
    }
}
BendPoint.MaxPosition = 60;
BendPoint.MaxValue = 12;
var BendStyle;
(function (BendStyle) {
    BendStyle[BendStyle["Default"] = 0] = "Default";
    BendStyle[BendStyle["Gradual"] = 1] = "Gradual";
    BendStyle[BendStyle["Fast"] = 2] = "Fast";
})(BendStyle || (BendStyle = {}));
var BendType;
(function (BendType) {
    BendType[BendType["None"] = 0] = "None";
    BendType[BendType["Custom"] = 1] = "Custom";
    BendType[BendType["Bend"] = 2] = "Bend";
    BendType[BendType["Release"] = 3] = "Release";
    BendType[BendType["BendRelease"] = 4] = "BendRelease";
    BendType[BendType["Hold"] = 5] = "Hold";
    BendType[BendType["Prebend"] = 6] = "Prebend";
    BendType[BendType["PrebendBend"] = 7] = "PrebendBend";
    BendType[BendType["PrebendRelease"] = 8] = "PrebendRelease";
})(BendType || (BendType = {}));
var BrushType;
(function (BrushType) {
    BrushType[BrushType["None"] = 0] = "None";
    BrushType[BrushType["BrushUp"] = 1] = "BrushUp";
    BrushType[BrushType["BrushDown"] = 2] = "BrushDown";
    BrushType[BrushType["ArpeggioUp"] = 3] = "ArpeggioUp";
    BrushType[BrushType["ArpeggioDown"] = 4] = "ArpeggioDown";
})(BrushType || (BrushType = {}));
class Chord {
    constructor() {
        this.name = '';
        this.firstFret = 1;
        this.strings = [];
        this.barreFrets = [];
        this.showName = true;
        this.showDiagram = true;
        this.showFingering = true;
    }
    get uniqueId() {
        const properties = [
            this.name,
            this.firstFret.toString(),
            this.strings.join(','),
            this.barreFrets.join(','),
            this.showDiagram.toString(),
            this.showFingering.toString(),
            this.showName.toString()
        ];
        return properties.join('|');
    }
}
var Clef;
(function (Clef) {
    Clef[Clef["Neutral"] = 0] = "Neutral";
    Clef[Clef["C3"] = 1] = "C3";
    Clef[Clef["C4"] = 2] = "C4";
    Clef[Clef["F4"] = 3] = "F4";
    Clef[Clef["G2"] = 4] = "G2";
})(Clef || (Clef = {}));
var FermataType;
(function (FermataType) {
    FermataType[FermataType["Short"] = 0] = "Short";
    FermataType[FermataType["Medium"] = 1] = "Medium";
    FermataType[FermataType["Long"] = 2] = "Long";
})(FermataType || (FermataType = {}));
class Fermata {
    constructor() {
        this.type = FermataType.Short;
        this.length = 0;
    }
}
var KeySignature;
(function (KeySignature) {
    KeySignature[KeySignature["Cb"] = -7] = "Cb";
    KeySignature[KeySignature["Gb"] = -6] = "Gb";
    KeySignature[KeySignature["Db"] = -5] = "Db";
    KeySignature[KeySignature["Ab"] = -4] = "Ab";
    KeySignature[KeySignature["Eb"] = -3] = "Eb";
    KeySignature[KeySignature["Bb"] = -2] = "Bb";
    KeySignature[KeySignature["F"] = -1] = "F";
    KeySignature[KeySignature["C"] = 0] = "C";
    KeySignature[KeySignature["G"] = 1] = "G";
    KeySignature[KeySignature["D"] = 2] = "D";
    KeySignature[KeySignature["A"] = 3] = "A";
    KeySignature[KeySignature["E"] = 4] = "E";
    KeySignature[KeySignature["B"] = 5] = "B";
    KeySignature[KeySignature["FSharp"] = 6] = "FSharp";
    KeySignature[KeySignature["CSharp"] = 7] = "CSharp";
})(KeySignature || (KeySignature = {}));
var KeySignatureType;
(function (KeySignatureType) {
    KeySignatureType[KeySignatureType["Major"] = 0] = "Major";
    KeySignatureType[KeySignatureType["Minor"] = 1] = "Minor";
})(KeySignatureType || (KeySignatureType = {}));
class MasterBar {
    constructor() {
        this.alternateEndings = 0;
        this.nextMasterBar = null;
        this.previousMasterBar = null;
        this.index = 0;
        this.keySignature = KeySignature.C;
        this.keySignatureType = KeySignatureType.Major;
        this.isDoubleBar = false;
        this.isRepeatStart = false;
        this.repeatCount = 0;
        this.timeSignatureNumerator = 4;
        this.timeSignatureDenominator = 4;
        this.timeSignatureCommon = false;
        this.tripletFeel = TripletFeel.NoTripletFeel;
        this.section = null;
        this.tempoAutomation = null;
        this.fermata = null;
        this.start = 0;
        this.isAnacrusis = false;
        this.displayScale = 1;
        this.displayWidth = -1;
    }
    get isRepeatEnd() {
        return this.repeatCount > 0;
    }
    get isSectionStart() {
        return !!this.section;
    }
    calculateDuration(respectAnacrusis = true) {
        if (this.isAnacrusis && respectAnacrusis) {
            let duration = 0;
            for (let track of this.score.tracks) {
                for (let staff of track.staves) {
                    let barDuration = this.index < staff.bars.length ? staff.bars[this.index].calculateDuration() : 0;
                    if (barDuration > duration) {
                        duration = barDuration;
                    }
                }
            }
            return duration;
        }
        return this.timeSignatureNumerator * MidiUtils.valueToTicks(this.timeSignatureDenominator);
    }
    addFermata(offset, fermata) {
        let fermataMap = this.fermata;
        if (fermataMap === null) {
            fermataMap = new Map();
            this.fermata = fermataMap;
        }
        fermataMap.set(offset, fermata);
    }
    getFermata(beat) {
        const fermataMap = this.fermata;
        if (fermataMap === null) {
            return null;
        }
        if (fermataMap.has(beat.playbackStart)) {
            return fermataMap.get(beat.playbackStart);
        }
        return null;
    }
}
MasterBar.MaxAlternateEndings = 8;
class MidiUtils {
    static ticksToMillis(ticks, tempo) {
        return (ticks * (60000.0 / (tempo * MidiUtils.QuarterTime))) | 0;
    }
    static millisToTicks(millis, tempo) {
        return (millis / (60000.0 / (tempo * MidiUtils.QuarterTime))) | 0;
    }
    static toTicks(duration) {
        return MidiUtils.valueToTicks(duration);
    }
    static valueToTicks(duration) {
        let denomninator = duration;
        if (denomninator < 0) {
            denomninator = 1 / -denomninator;
        }
        return (MidiUtils.QuarterTime * (4.0 / denomninator)) | 0;
    }
    static applyDot(ticks, doubleDotted) {
        if (doubleDotted) {
            return ticks + ((ticks / 4) | 0) * 3;
        }
        return ticks + ((ticks / 2) | 0);
    }
    static applyTuplet(ticks, numerator, denominator) {
        return ((ticks * denominator) / numerator) | 0;
    }
    static removeTuplet(ticks, numerator, denominator) {
        return ((ticks * numerator) / denominator) | 0;
    }
    static dynamicToVelocity(dynamicsSteps) {
        return MidiUtils.MinVelocity + dynamicsSteps * MidiUtils.VelocityIncrement;
    }
}
MidiUtils.QuarterTime = 960;
MidiUtils.MinVelocity = 15;
MidiUtils.VelocityIncrement = 16;
var Duration;
(function (Duration) {
    Duration[Duration["QuadrupleWhole"] = -4] = "QuadrupleWhole";
    Duration[Duration["DoubleWhole"] = -2] = "DoubleWhole";
    Duration[Duration["Whole"] = 1] = "Whole";
    Duration[Duration["Half"] = 2] = "Half";
    Duration[Duration["Quarter"] = 4] = "Quarter";
    Duration[Duration["Eighth"] = 8] = "Eighth";
    Duration[Duration["Sixteenth"] = 16] = "Sixteenth";
    Duration[Duration["ThirtySecond"] = 32] = "ThirtySecond";
    Duration[Duration["SixtyFourth"] = 64] = "SixtyFourth";
    Duration[Duration["OneHundredTwentyEighth"] = 128] = "OneHundredTwentyEighth";
    Duration[Duration["TwoHundredFiftySixth"] = 256] = "TwoHundredFiftySixth";
})(Duration || (Duration = {}));
var Ottavia;
(function (Ottavia) {
    Ottavia[Ottavia["_15ma"] = 0] = "_15ma";
    Ottavia[Ottavia["_8va"] = 1] = "_8va";
    Ottavia[Ottavia["Regular"] = 2] = "Regular";
    Ottavia[Ottavia["_8vb"] = 3] = "_8vb";
    Ottavia[Ottavia["_15mb"] = 4] = "_15mb";
})(Ottavia || (Ottavia = {}));
class Staff {
    constructor() {
        this.index = 0;
        this.bars = [];
        this.chords = null;
        this.capo = 0;
        this.transpositionPitch = 0;
        this.displayTranspositionPitch = 0;
        this.stringTuning = new Tuning('', [], false);
        this.showTablature = true;
        this.showStandardNotation = true;
        this.isPercussion = false;
        this.standardNotationLineCount = 5;
    }
    get tuning() {
        return this.stringTuning.tunings;
    }
    get tuningName() {
        return this.stringTuning.name;
    }
    get isStringed() {
        return this.stringTuning.tunings.length > 0;
    }
    finish(settings, sharedDataBag = null) {
        this.stringTuning.finish();
        for (let i = 0, j = this.bars.length; i < j; i++) {
            this.bars[i].finish(settings, sharedDataBag);
        }
    }
    addChord(chordId, chord) {
        chord.staff = this;
        let chordMap = this.chords;
        if (chordMap === null) {
            chordMap = new Map();
            this.chords = chordMap;
        }
        chordMap.set(chordId, chord);
    }
    hasChord(chordId) {
        var _a, _b;
        return (_b = (_a = this.chords) === null || _a === void 0 ? void 0 : _a.has(chordId)) !== null && _b !== void 0 ? _b : false;
    }
    getChord(chordId) {
        var _a, _b;
        return (_b = (_a = this.chords) === null || _a === void 0 ? void 0 : _a.get(chordId)) !== null && _b !== void 0 ? _b : null;
    }
    addBar(bar) {
        let bars = this.bars;
        bar.staff = this;
        bar.index = bars.length;
        if (bars.length > 0) {
            bar.previousBar = bars[bars.length - 1];
            bar.previousBar.nextBar = bar;
        }
        bars.push(bar);
    }
}
class Track {
    constructor() {
        this.index = 0;
        this.staves = [];
        this.playbackInfo = new PlaybackInformation();
        this.color = new Color(200, 0, 0, 255);
        this.trackName = '';
        this.shortName = '';
        this.defaultSystemsLayout = 3;
        this.systemsLayout = [];
        this.percussionArticulations = [];
    }
    ensureStaveCount(staveCount) {
        while (this.staves.length < staveCount) {
            this.addStaff(new Staff());
        }
    }
    addStaff(staff) {
        staff.index = this.staves.length;
        staff.track = this;
        this.staves.push(staff);
    }
    finish(settings, sharedDataBag = null) {
        if (!this.shortName) {
            this.shortName = this.trackName;
            if (this.shortName.length > Track.ShortNameMaxLength) {
                this.shortName = this.shortName.substr(0, Track.ShortNameMaxLength);
            }
        }
        for (let i = 0, j = this.staves.length; i < j; i++) {
            this.staves[i].finish(settings, sharedDataBag);
        }
    }
    applyLyrics(lyrics) {
        for (let lyric of lyrics) {
            lyric.finish();
        }
        let staff = this.staves[0];
        for (let li = 0; li < lyrics.length; li++) {
            let lyric = lyrics[li];
            if (lyric.startBar >= 0 && lyric.startBar < staff.bars.length) {
                let beat = staff.bars[lyric.startBar].voices[0].beats[0];
                for (let ci = 0; ci < lyric.chunks.length && beat; ci++) {
                    while (beat && (beat.isEmpty || beat.isRest)) {
                        beat = beat.nextBeat;
                    }
                    if (beat) {
                        if (!beat.lyrics) {
                            beat.lyrics = new Array(lyrics.length);
                            beat.lyrics.fill("");
                        }
                        beat.lyrics[li] = lyric.chunks[ci];
                        beat = beat.nextBeat;
                    }
                }
            }
        }
    }
}
Track.ShortNameMaxLength = 10;
class Voice {
    constructor() {
        this.id = Voice._globalBarId++;
        this.index = 0;
        this.beats = [];
        this.isEmpty = true;
    }
    insertBeat(after, newBeat) {
        newBeat.nextBeat = after.nextBeat;
        if (newBeat.nextBeat) {
            newBeat.nextBeat.previousBeat = newBeat;
        }
        newBeat.previousBeat = after;
        newBeat.voice = this;
        after.nextBeat = newBeat;
        this.beats.splice(after.index + 1, 0, newBeat);
    }
    addBeat(beat) {
        beat.voice = this;
        beat.index = this.beats.length;
        this.beats.push(beat);
        if (!beat.isEmpty) {
            this.isEmpty = false;
        }
    }
    chain(beat, sharedDataBag = null) {
        if (!this.bar) {
            return;
        }
        if (beat.index < this.beats.length - 1) {
            beat.nextBeat = this.beats[beat.index + 1];
            beat.nextBeat.previousBeat = beat;
        }
        else if (beat.isLastOfVoice && beat.voice.bar.nextBar) {
            let nextVoice = this.bar.nextBar.voices[this.index];
            if (nextVoice.beats.length > 0) {
                beat.nextBeat = nextVoice.beats[0];
                beat.nextBeat.previousBeat = beat;
            }
            else {
                beat.nextBeat.previousBeat = beat;
            }
        }
        beat.chain(sharedDataBag);
    }
    addGraceBeat(beat) {
        if (this.beats.length === 0) {
            this.addBeat(beat);
            return;
        }
        let lastBeat = this.beats[this.beats.length - 1];
        this.beats.splice(this.beats.length - 1, 1);
        this.addBeat(beat);
        this.addBeat(lastBeat);
        this.isEmpty = false;
    }
    getBeatAtPlaybackStart(playbackStart) {
        if (this._beatLookup.has(playbackStart)) {
            return this._beatLookup.get(playbackStart);
        }
        return null;
    }
    finish(settings, sharedDataBag = null) {
        this._beatLookup = new Map();
        let currentGraceGroup = null;
        for (let index = 0; index < this.beats.length; index++) {
            let beat = this.beats[index];
            beat.index = index;
            this.chain(beat, sharedDataBag);
            if (beat.graceType === GraceType.None) {
                beat.graceGroup = currentGraceGroup;
                if (currentGraceGroup) {
                    currentGraceGroup.isComplete = true;
                }
                currentGraceGroup = null;
            }
            else {
                if (!currentGraceGroup) {
                    currentGraceGroup = new GraceGroup();
                }
                currentGraceGroup.addBeat(beat);
            }
        }
        let currentDisplayTick = 0;
        let currentPlaybackTick = 0;
        for (let i = 0; i < this.beats.length; i++) {
            let beat = this.beats[i];
            beat.index = i;
            beat.finish(settings, sharedDataBag);
            if (beat.graceType === GraceType.None) {
                if (beat.graceGroup) {
                    const firstGraceBeat = beat.graceGroup.beats[0];
                    const lastGraceBeat = beat.graceGroup.beats[beat.graceGroup.beats.length - 1];
                    if (firstGraceBeat.graceType !== GraceType.BendGrace) {
                        let stolenDuration = lastGraceBeat.playbackStart + lastGraceBeat.playbackDuration - firstGraceBeat.playbackStart;
                        switch (firstGraceBeat.graceType) {
                            case GraceType.BeforeBeat:
                                if (firstGraceBeat.previousBeat) {
                                    firstGraceBeat.previousBeat.playbackDuration -= stolenDuration;
                                    if (firstGraceBeat.previousBeat.voice == this) {
                                        currentPlaybackTick =
                                            firstGraceBeat.previousBeat.playbackStart +
                                                firstGraceBeat.previousBeat.playbackDuration;
                                    }
                                    else {
                                        currentPlaybackTick = -stolenDuration;
                                    }
                                }
                                else {
                                    currentPlaybackTick = -stolenDuration;
                                }
                                for (const graceBeat of beat.graceGroup.beats) {
                                    this._beatLookup.delete(graceBeat.playbackStart);
                                    graceBeat.playbackStart = currentPlaybackTick;
                                    this._beatLookup.set(graceBeat.playbackStart, beat);
                                    currentPlaybackTick += graceBeat.playbackDuration;
                                }
                                break;
                            case GraceType.OnBeat:
                                beat.playbackDuration -= stolenDuration;
                                if (lastGraceBeat.voice === this) {
                                    currentPlaybackTick = lastGraceBeat.playbackStart + lastGraceBeat.playbackDuration;
                                }
                                else {
                                    currentPlaybackTick = -stolenDuration;
                                }
                                break;
                        }
                    }
                }
                beat.displayStart = currentDisplayTick;
                beat.playbackStart = currentPlaybackTick;
                if (beat.fermata) {
                    this.bar.masterBar.addFermata(beat.playbackStart, beat.fermata);
                }
                else {
                    beat.fermata = this.bar.masterBar.getFermata(beat);
                }
                this._beatLookup.set(beat.playbackStart, beat);
            }
            else {
                beat.displayStart = currentDisplayTick;
                beat.playbackStart = currentPlaybackTick;
            }
            beat.finishTuplet();
            if (beat.graceGroup) {
                beat.graceGroup.finish();
            }
            currentDisplayTick += beat.displayDuration;
            currentPlaybackTick += beat.playbackDuration;
        }
    }
    calculateDuration() {
        if (this.isEmpty || this.beats.length === 0) {
            return 0;
        }
        let lastBeat = this.beats[this.beats.length - 1];
        let firstBeat = this.beats[0];
        return lastBeat.playbackStart + lastBeat.playbackDuration - firstBeat.playbackStart;
    }
}
Voice._globalBarId = 0;
var SimileMark;
(function (SimileMark) {
    SimileMark[SimileMark["None"] = 0] = "None";
    SimileMark[SimileMark["Simple"] = 1] = "Simple";
    SimileMark[SimileMark["FirstOfDouble"] = 2] = "FirstOfDouble";
    SimileMark[SimileMark["SecondOfDouble"] = 3] = "SecondOfDouble";
})(SimileMark || (SimileMark = {}));
class NoteIdBag {
    constructor() {
        this.tieDestinationNoteId = -1;
        this.tieOriginNoteId = -1;
        this.slurDestinationNoteId = -1;
        this.slurOriginNoteId = -1;
        this.hammerPullDestinationNoteId = -1;
        this.hammerPullOriginNoteId = -1;
    }
}
class Note {
    constructor() {
        this.id = Note.GlobalNoteId++;
        this.index = 0;
        this.accentuated = AccentuationType.None;
        this.bendType = BendType.None;
        this.bendStyle = BendStyle.Default;
        this.bendOrigin = null;
        this.isContinuedBend = false;
        this.bendPoints = null;
        this.maxBendPoint = null;
        this.fret = -1;
        this.string = -1;
        this.octave = -1;
        this.tone = -1;
        this.percussionArticulation = -1;
        this.isVisible = true;
        this.isLeftHandTapped = false;
        this.isHammerPullOrigin = false;
        this.hammerPullOrigin = null;
        this.hammerPullDestination = null;
        this.isSlurDestination = false;
        this.slurOrigin = null;
        this.slurDestination = null;
        this.harmonicType = HarmonicType.None;
        this.harmonicValue = 0;
        this.isGhost = false;
        this.isLetRing = false;
        this.letRingDestination = null;
        this.isPalmMute = false;
        this.palmMuteDestination = null;
        this.isDead = false;
        this.isStaccato = false;
        this.slideInType = SlideInType.None;
        this.slideOutType = SlideOutType.None;
        this.slideTarget = null;
        this.slideOrigin = null;
        this.vibrato = VibratoType.None;
        this.tieOrigin = null;
        this.tieDestination = null;
        this.isTieDestination = false;
        this.leftHandFinger = Fingers.Unknown;
        this.rightHandFinger = Fingers.Unknown;
        this.isFingering = false;
        this.trillValue = -1;
        this.trillSpeed = Duration.ThirtySecond;
        this.durationPercent = 1;
        this.accidentalMode = NoteAccidentalMode.Default;
        this.dynamics = DynamicValue.F;
        this.isEffectSlurOrigin = false;
        this.hasEffectSlur = false;
        this.effectSlurOrigin = null;
        this.effectSlurDestination = null;
        this._noteIdBag = null;
    }
    get hasBend() {
        return this.bendPoints !== null && this.bendType !== BendType.None;
    }
    get isStringed() {
        return this.string >= 0;
    }
    get isPiano() {
        return !this.isStringed && this.octave >= 0 && this.tone >= 0;
    }
    get isPercussion() {
        return !this.isStringed && this.percussionArticulation >= 0;
    }
    get element() {
        return this.isPercussion ? PercussionMapper.getElementAndVariation(this)[0] : -1;
    }
    get variation() {
        return this.isPercussion ? PercussionMapper.getElementAndVariation(this)[1] : -1;
    }
    get isHammerPullDestination() {
        return !!this.hammerPullOrigin;
    }
    get isSlurOrigin() {
        return !!this.slurDestination;
    }
    get isHarmonic() {
        return this.harmonicType !== HarmonicType.None;
    }
    get isTieOrigin() {
        return this.tieDestination !== null;
    }
    get trillFret() {
        return this.trillValue - this.stringTuning;
    }
    get isTrill() {
        return this.trillValue >= 0;
    }
    get isEffectSlurDestination() {
        return !!this.effectSlurOrigin;
    }
    get stringTuning() {
        return this.beat.voice.bar.staff.capo + Note.getStringTuning(this.beat.voice.bar.staff, this.string);
    }
    static getStringTuning(staff, noteString) {
        if (staff.tuning.length > 0) {
            return staff.tuning[staff.tuning.length - (noteString - 1) - 1];
        }
        return 0;
    }
    get realValue() {
        return this.calculateRealValue(true, true);
    }
    get realValueWithoutHarmonic() {
        return this.calculateRealValue(true, false);
    }
    calculateRealValue(applyTranspositionPitch, applyHarmonic) {
        const transpositionPitch = applyTranspositionPitch ? this.beat.voice.bar.staff.transpositionPitch : 0;
        if (applyHarmonic) {
            let realValue = this.calculateRealValue(applyTranspositionPitch, false);
            if (this.isStringed) {
                if (this.harmonicType === HarmonicType.Natural) {
                    realValue = this.harmonicPitch + this.stringTuning - transpositionPitch;
                }
                else {
                    realValue += this.harmonicPitch;
                }
            }
            return realValue;
        }
        else {
            if (this.isPercussion) {
                return this.percussionArticulation;
            }
            if (this.isStringed) {
                return this.fret + this.stringTuning - transpositionPitch;
            }
            if (this.isPiano) {
                return this.octave * 12 + this.tone - transpositionPitch;
            }
            return 0;
        }
    }
    get harmonicPitch() {
        if (this.harmonicType === HarmonicType.None || !this.isStringed) {
            return 0;
        }
        let value = this.harmonicValue;
        if (ModelUtils.isAlmostEqualTo(value, 2.4)) {
            return 36;
        }
        if (ModelUtils.isAlmostEqualTo(value, 2.7)) {
            return 34;
        }
        if (value < 3) {
            return 0;
        }
        if (value <= 3.5) {
            return 31;
        }
        if (value <= 4) {
            return 28;
        }
        if (value <= 5) {
            return 24;
        }
        if (value <= 6) {
            return 34;
        }
        if (value <= 7) {
            return 19;
        }
        if (value <= 8.5) {
            return 36;
        }
        if (value <= 9) {
            return 28;
        }
        if (value <= 10) {
            return 34;
        }
        if (value <= 11) {
            return 0;
        }
        if (value <= 12) {
            return 12;
        }
        if (value < 14) {
            return 0;
        }
        if (value <= 15) {
            return 34;
        }
        if (value <= 16) {
            return 28;
        }
        if (value <= 17) {
            return 36;
        }
        if (value <= 18) {
            return 0;
        }
        if (value <= 19) {
            return 19;
        }
        if (value <= 21) {
            return 0;
        }
        if (value <= 22) {
            return 36;
        }
        if (value <= 24) {
            return 24;
        }
        return 0;
    }
    get initialBendValue() {
        if (this.hasBend) {
            return Math.floor(this.bendPoints[0].value / 2);
        }
        else if (this.bendOrigin) {
            return Math.floor(this.bendOrigin.bendPoints[this.bendOrigin.bendPoints.length - 1].value / 2);
        }
        else if (this.isTieDestination && this.tieOrigin.bendOrigin) {
            return Math.floor(this.tieOrigin.bendOrigin.bendPoints[this.tieOrigin.bendOrigin.bendPoints.length - 1].value / 2);
        }
        else if (this.beat.hasWhammyBar) {
            return Math.floor(this.beat.whammyBarPoints[0].value / 2);
        }
        else if (this.beat.isContinuedWhammy) {
            return Math.floor(this.beat.previousBeat.whammyBarPoints[this.beat.previousBeat.whammyBarPoints.length - 1].value / 2);
        }
        return 0;
    }
    get displayValue() {
        return this.displayValueWithoutBend + this.initialBendValue;
    }
    get displayValueWithoutBend() {
        let noteValue = this.realValue;
        if (this.harmonicType !== HarmonicType.Natural && this.harmonicType !== HarmonicType.None) {
            noteValue -= this.harmonicPitch;
        }
        switch (this.beat.ottava) {
            case Ottavia._15ma:
                noteValue -= 24;
                break;
            case Ottavia._8va:
                noteValue -= 12;
                break;
            case Ottavia.Regular:
                break;
            case Ottavia._8vb:
                noteValue += 12;
                break;
            case Ottavia._15mb:
                noteValue += 24;
                break;
        }
        switch (this.beat.voice.bar.clefOttava) {
            case Ottavia._15ma:
                noteValue -= 24;
                break;
            case Ottavia._8va:
                noteValue -= 12;
                break;
            case Ottavia.Regular:
                break;
            case Ottavia._8vb:
                noteValue += 12;
                break;
            case Ottavia._15mb:
                noteValue += 24;
                break;
        }
        return noteValue - this.beat.voice.bar.staff.displayTranspositionPitch;
    }
    get hasQuarterToneOffset() {
        if (this.hasBend) {
            return this.bendPoints[0].value % 2 !== 0;
        }
        if (this.bendOrigin) {
            return this.bendOrigin.bendPoints[this.bendOrigin.bendPoints.length - 1].value % 2 !== 0;
        }
        if (this.beat.hasWhammyBar) {
            return this.beat.whammyBarPoints[0].value % 2 !== 0;
        }
        if (this.beat.isContinuedWhammy) {
            return (this.beat.previousBeat.whammyBarPoints[this.beat.previousBeat.whammyBarPoints.length - 1].value %
                2 !==
                0);
        }
        return false;
    }
    addBendPoint(point) {
        let points = this.bendPoints;
        if (points === null) {
            points = [];
            this.bendPoints = points;
        }
        points.push(point);
        if (!this.maxBendPoint || point.value > this.maxBendPoint.value) {
            this.maxBendPoint = point;
        }
        if (this.bendType === BendType.None) {
            this.bendType = BendType.Custom;
        }
    }
    finish(settings, sharedDataBag = null) {
        let nextNoteOnLine = new Lazy(() => Note.nextNoteOnSameLine(this));
        let isSongBook = settings && settings.notation.notationMode === NotationMode.SongBook;
        if (this.isTieDestination) {
            this.chain(sharedDataBag);
            if (isSongBook && this.tieOrigin && this.tieOrigin.isLetRing) {
                this.isLetRing = true;
            }
        }
        if (this.isLetRing) {
            if (!nextNoteOnLine.value || !nextNoteOnLine.value.isLetRing) {
                this.letRingDestination = this;
            }
            else {
                this.letRingDestination = nextNoteOnLine.value;
            }
            if (isSongBook && this.isTieDestination && !this.tieOrigin.hasBend) {
                this.isVisible = false;
            }
        }
        if (this.isPalmMute) {
            if (!nextNoteOnLine.value || !nextNoteOnLine.value.isPalmMute) {
                this.palmMuteDestination = this;
            }
            else {
                this.palmMuteDestination = nextNoteOnLine.value;
            }
        }
        if (this.isHammerPullOrigin) {
            let hammerPullDestination = Note.findHammerPullDestination(this);
            if (!hammerPullDestination) {
                this.isHammerPullOrigin = false;
            }
            else {
                this.hammerPullDestination = hammerPullDestination;
                hammerPullDestination.hammerPullOrigin = this;
            }
        }
        switch (this.slideOutType) {
            case SlideOutType.Shift:
            case SlideOutType.Legato:
                this.slideTarget = nextNoteOnLine.value;
                if (!this.slideTarget) {
                    this.slideOutType = SlideOutType.None;
                }
                else {
                    this.slideTarget.slideOrigin = this;
                }
                break;
        }
        let effectSlurDestination = null;
        if (this.isHammerPullOrigin && this.hammerPullDestination) {
            effectSlurDestination = this.hammerPullDestination;
        }
        else if (this.slideOutType === SlideOutType.Legato && this.slideTarget) {
            effectSlurDestination = this.slideTarget;
        }
        if (effectSlurDestination) {
            this.hasEffectSlur = true;
            if (this.effectSlurOrigin && this.beat.pickStroke === PickStroke.None) {
                this.effectSlurOrigin.effectSlurDestination = effectSlurDestination;
                this.effectSlurOrigin.effectSlurDestination.effectSlurOrigin = this.effectSlurOrigin;
                this.effectSlurOrigin = null;
            }
            else {
                this.isEffectSlurOrigin = true;
                this.effectSlurDestination = effectSlurDestination;
                this.effectSlurDestination.effectSlurOrigin = this;
            }
        }
        const points = this.bendPoints;
        if (points != null && points.length > 0 && this.bendType === BendType.Custom) {
            let isContinuedBend = this.isTieDestination && this.tieOrigin.hasBend;
            this.isContinuedBend = isContinuedBend;
            if (points.length === 4) {
                let origin = points[0];
                let middle1 = points[1];
                let middle2 = points[2];
                let destination = points[3];
                if (middle1.value === middle2.value) {
                    if (destination.value > origin.value) {
                        if (middle1.value > destination.value) {
                            this.bendType = BendType.BendRelease;
                        }
                        else if (!isContinuedBend && origin.value > 0) {
                            this.bendType = BendType.PrebendBend;
                            points.splice(2, 1);
                            points.splice(1, 1);
                        }
                        else {
                            this.bendType = BendType.Bend;
                            points.splice(2, 1);
                            points.splice(1, 1);
                        }
                    }
                    else if (destination.value < origin.value) {
                        if (isContinuedBend) {
                            this.bendType = BendType.Release;
                            points.splice(2, 1);
                            points.splice(1, 1);
                        }
                        else {
                            this.bendType = BendType.PrebendRelease;
                            points.splice(2, 1);
                            points.splice(1, 1);
                        }
                    }
                    else {
                        if (middle1.value > origin.value) {
                            this.bendType = BendType.BendRelease;
                        }
                        else if (origin.value > 0 && !isContinuedBend) {
                            this.bendType = BendType.Prebend;
                            points.splice(2, 1);
                            points.splice(1, 1);
                        }
                        else {
                            this.bendType = BendType.Hold;
                            points.splice(2, 1);
                            points.splice(1, 1);
                        }
                    }
                }
                else {
                    console.log('Model', 'Unsupported bend type detected, fallback to custom', null);
                }
            }
            else if (points.length === 2) {
                let origin = points[0];
                let destination = points[1];
                if (destination.value > origin.value) {
                    if (!isContinuedBend && origin.value > 0) {
                        this.bendType = BendType.PrebendBend;
                    }
                    else {
                        this.bendType = BendType.Bend;
                    }
                }
                else if (destination.value < origin.value) {
                    if (isContinuedBend) {
                        this.bendType = BendType.Release;
                    }
                    else {
                        this.bendType = BendType.PrebendRelease;
                    }
                }
                else {
                    this.bendType = BendType.Hold;
                }
            }
        }
        else if (points === null || points.length === 0) {
            this.bendType = BendType.None;
        }
        if (this.initialBendValue > 0) {
            this.accidentalMode = NoteAccidentalMode.Default;
        }
    }
    static nextNoteOnSameLine(note) {
        let nextBeat = note.beat.nextBeat;
        while (nextBeat && nextBeat.voice.bar.index <= note.beat.voice.bar.index + Note.MaxOffsetForSameLineSearch) {
            let noteOnString = nextBeat.getNoteOnString(note.string);
            if (noteOnString) {
                return noteOnString;
            }
            nextBeat = nextBeat.nextBeat;
        }
        return null;
    }
    static findHammerPullDestination(note) {
        let nextBeat = note.beat.nextBeat;
        while (nextBeat && nextBeat.voice.bar.index <= note.beat.voice.bar.index + Note.MaxOffsetForSameLineSearch) {
            let noteOnString = nextBeat.getNoteOnString(note.string);
            if (noteOnString) {
                return noteOnString;
            }
            for (let str = note.string; str > 0; str--) {
                noteOnString = nextBeat.getNoteOnString(str);
                if (noteOnString) {
                    if (noteOnString.isLeftHandTapped) {
                        return noteOnString;
                    }
                    else {
                        break;
                    }
                }
            }
            for (let str = note.string; str <= note.beat.voice.bar.staff.tuning.length; str++) {
                noteOnString = nextBeat.getNoteOnString(str);
                if (noteOnString) {
                    if (noteOnString.isLeftHandTapped) {
                        return noteOnString;
                    }
                    else {
                        break;
                    }
                }
            }
            nextBeat = nextBeat.nextBeat;
        }
        return null;
    }
    static findTieOrigin(note) {
        let previousBeat = note.beat.previousBeat;
        while (previousBeat &&
            previousBeat.voice.bar.index >= note.beat.voice.bar.index - Note.MaxOffsetForSameLineSearch) {
            if (note.isStringed) {
                let noteOnString = previousBeat.getNoteOnString(note.string);
                if (noteOnString) {
                    return noteOnString;
                }
            }
            else {
                if (note.octave === -1 && note.tone === -1) {
                    if (note.index < previousBeat.notes.length) {
                        return previousBeat.notes[note.index];
                    }
                }
                else {
                    let noteWithValue = previousBeat.getNoteWithRealValue(note.realValue);
                    if (noteWithValue) {
                        return noteWithValue;
                    }
                }
            }
            previousBeat = previousBeat.previousBeat;
        }
        return null;
    }
    chain(sharedDataBag = null) {
        var _a;
        if (sharedDataBag === null) {
            return;
        }
        if (this._noteIdBag !== null) {
            let noteIdLookup;
            if (sharedDataBag.has(Note.NoteIdLookupKey)) {
                noteIdLookup = sharedDataBag.get(Note.NoteIdLookupKey);
            }
            else {
                noteIdLookup = new Map();
                sharedDataBag.set(Note.NoteIdLookupKey, noteIdLookup);
            }
            if (this._noteIdBag.hammerPullDestinationNoteId !== -1 ||
                this._noteIdBag.tieDestinationNoteId !== -1 ||
                this._noteIdBag.slurDestinationNoteId !== -1) {
                noteIdLookup.set(this.id, this);
            }
            if (this._noteIdBag.hammerPullOriginNoteId !== -1) {
                this.hammerPullOrigin = noteIdLookup.get(this._noteIdBag.hammerPullOriginNoteId);
                this.hammerPullOrigin.hammerPullDestination = this;
            }
            if (this._noteIdBag.tieOriginNoteId !== -1) {
                this.tieOrigin = noteIdLookup.get(this._noteIdBag.tieOriginNoteId);
                this.tieOrigin.tieDestination = this;
            }
            if (this._noteIdBag.slurOriginNoteId !== -1) {
                this.slurOrigin = noteIdLookup.get(this._noteIdBag.slurOriginNoteId);
                this.slurOrigin.slurDestination = this;
            }
            this._noteIdBag = null;
        }
        else {
            if (!this.isTieDestination && this.tieOrigin === null) {
                return;
            }
            let tieOrigin = (_a = this.tieOrigin) !== null && _a !== void 0 ? _a : Note.findTieOrigin(this);
            if (!tieOrigin) {
                this.isTieDestination = false;
            }
            else {
                tieOrigin.tieDestination = this;
                this.tieOrigin = tieOrigin;
                this.fret = tieOrigin.fret;
                this.octave = tieOrigin.octave;
                this.tone = tieOrigin.tone;
                if (tieOrigin.hasBend) {
                    this.bendOrigin = this.tieOrigin;
                }
            }
        }
    }
    toJson(o) {
        if (this.tieDestination !== null) {
            o.set('tiedestinationnoteid', this.tieDestination.id);
        }
        if (this.tieOrigin !== null) {
            o.set('tieoriginnoteid', this.tieOrigin.id);
        }
        if (this.slurDestination !== null) {
            o.set('slurdestinationnoteid', this.slurDestination.id);
        }
        if (this.slurOrigin !== null) {
            o.set('sluroriginnoteid', this.slurOrigin.id);
        }
        if (this.hammerPullOrigin !== null) {
            o.set('hammerpulloriginnoteid', this.hammerPullOrigin.id);
        }
        if (this.hammerPullDestination !== null) {
            o.set('hammerpulldestinationnoteid', this.hammerPullDestination.id);
        }
    }
    setProperty(property, v) {
        switch (property) {
            case "tiedestinationnoteid":
                if (this._noteIdBag == null) {
                    this._noteIdBag = new NoteIdBag();
                }
                this._noteIdBag.tieDestinationNoteId = v;
                return true;
            case "tieoriginnoteid":
                if (this._noteIdBag == null) {
                    this._noteIdBag = new NoteIdBag();
                }
                this._noteIdBag.tieOriginNoteId = v;
                return true;
            case "slurdestinationnoteid":
                if (this._noteIdBag == null) {
                    this._noteIdBag = new NoteIdBag();
                }
                this._noteIdBag.slurDestinationNoteId = v;
                return true;
            case "sluroriginnoteid":
                if (this._noteIdBag == null) {
                    this._noteIdBag = new NoteIdBag();
                }
                this._noteIdBag.slurOriginNoteId = v;
                return true;
            case "hammerpulloriginnoteid":
                if (this._noteIdBag == null) {
                    this._noteIdBag = new NoteIdBag();
                }
                this._noteIdBag.hammerPullOriginNoteId = v;
                return true;
            case "hammerpulldestinationnoteid":
                if (this._noteIdBag == null) {
                    this._noteIdBag = new NoteIdBag();
                }
                this._noteIdBag.hammerPullDestinationNoteId = v;
                return true;
        }
        return false;
    }
}
Note.GlobalNoteId = 0;
Note.MaxOffsetForSameLineSearch = 3;
Note.NoteIdLookupKey = 'NoteIdLookup';
var NoteAccidentalMode;
(function (NoteAccidentalMode) {
    NoteAccidentalMode[NoteAccidentalMode["Default"] = 0] = "Default";
    NoteAccidentalMode[NoteAccidentalMode["ForceNone"] = 1] = "ForceNone";
    NoteAccidentalMode[NoteAccidentalMode["ForceNatural"] = 2] = "ForceNatural";
    NoteAccidentalMode[NoteAccidentalMode["ForceSharp"] = 3] = "ForceSharp";
    NoteAccidentalMode[NoteAccidentalMode["ForceDoubleSharp"] = 4] = "ForceDoubleSharp";
    NoteAccidentalMode[NoteAccidentalMode["ForceFlat"] = 5] = "ForceFlat";
    NoteAccidentalMode[NoteAccidentalMode["ForceDoubleFlat"] = 6] = "ForceDoubleFlat";
})(NoteAccidentalMode || (NoteAccidentalMode = {}));
var HarmonicType;
(function (HarmonicType) {
    HarmonicType[HarmonicType["None"] = 0] = "None";
    HarmonicType[HarmonicType["Natural"] = 1] = "Natural";
    HarmonicType[HarmonicType["Artificial"] = 2] = "Artificial";
    HarmonicType[HarmonicType["Pinch"] = 3] = "Pinch";
    HarmonicType[HarmonicType["Tap"] = 4] = "Tap";
    HarmonicType[HarmonicType["Semi"] = 5] = "Semi";
    HarmonicType[HarmonicType["Feedback"] = 6] = "Feedback";
})(HarmonicType || (HarmonicType = {}));
var WhammyType;
(function (WhammyType) {
    WhammyType[WhammyType["None"] = 0] = "None";
    WhammyType[WhammyType["Custom"] = 1] = "Custom";
    WhammyType[WhammyType["Dive"] = 2] = "Dive";
    WhammyType[WhammyType["Dip"] = 3] = "Dip";
    WhammyType[WhammyType["Hold"] = 4] = "Hold";
    WhammyType[WhammyType["Predive"] = 5] = "Predive";
    WhammyType[WhammyType["PrediveDive"] = 6] = "PrediveDive";
})(WhammyType || (WhammyType = {}));
var TripletFeel;
(function (TripletFeel) {
    TripletFeel[TripletFeel["NoTripletFeel"] = 0] = "NoTripletFeel";
    TripletFeel[TripletFeel["Triplet16th"] = 1] = "Triplet16th";
    TripletFeel[TripletFeel["Triplet8th"] = 2] = "Triplet8th";
    TripletFeel[TripletFeel["Dotted16th"] = 3] = "Dotted16th";
    TripletFeel[TripletFeel["Dotted8th"] = 4] = "Dotted8th";
    TripletFeel[TripletFeel["Scottish16th"] = 5] = "Scottish16th";
    TripletFeel[TripletFeel["Scottish8th"] = 6] = "Scottish8th";
})(TripletFeel || (TripletFeel = {}));
class Tuning {
    constructor(name = '', tuning = null, isStandard = false) {
        this.isStandard = isStandard;
        this.name = name;
        this.tunings = tuning !== null && tuning !== void 0 ? tuning : [];
    }
    static getTextForTuning(tuning, includeOctave) {
        let parts = Tuning.getTextPartsForTuning(tuning);
        return includeOctave ? parts.join('') : parts[0];
    }
    static getTextPartsForTuning(tuning, octaveShift = -1) {
        let octave = (tuning / 12) | 0;
        let note = tuning % 12;
        let notes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
        return [notes[note], (octave + octaveShift).toString()];
    }
    static getDefaultTuningFor(stringCount) {
        if (Tuning._defaultTunings.has(stringCount)) {
            return Tuning._defaultTunings.get(stringCount);
        }
        return null;
    }
    static getPresetsFor(stringCount) {
        switch (stringCount) {
            case 7:
                return Tuning._sevenStrings;
            case 6:
                return Tuning._sixStrings;
            case 5:
                return Tuning._fiveStrings;
            case 4:
                return Tuning._fourStrings;
        }
        return [];
    }
    static initialize() {
        Tuning._defaultTunings.set(7, new Tuning('Guitar 7 strings', [64, 59, 55, 50, 45, 40, 35], true));
        Tuning._sevenStrings.push(Tuning._defaultTunings.get(7));
        Tuning._defaultTunings.set(6, new Tuning('Guitar Standard Tuning', [64, 59, 55, 50, 45, 40], true));
        Tuning._sixStrings.push(Tuning._defaultTunings.get(6));
        Tuning._sixStrings.push(new Tuning('Guitar Tune down ½ step', [63, 58, 54, 49, 44, 39], false));
        Tuning._sixStrings.push(new Tuning('Guitar Tune down 1 step', [62, 57, 53, 48, 43, 38], false));
        Tuning._sixStrings.push(new Tuning('Guitar Tune down 2 step', [60, 55, 51, 46, 41, 36], false));
        Tuning._sixStrings.push(new Tuning('Guitar Dropped D Tuning', [64, 59, 55, 50, 45, 38], false));
        Tuning._sixStrings.push(new Tuning('Guitar Dropped D Tuning variant', [64, 57, 55, 50, 45, 38], false));
        Tuning._sixStrings.push(new Tuning('Guitar Double Dropped D Tuning', [62, 59, 55, 50, 45, 38], false));
        Tuning._sixStrings.push(new Tuning('Guitar Dropped E Tuning', [66, 61, 57, 52, 47, 40], false));
        Tuning._sixStrings.push(new Tuning('Guitar Dropped C Tuning', [62, 57, 53, 48, 43, 36], false));
        Tuning._sixStrings.push(new Tuning('Guitar Open C Tuning', [64, 60, 55, 48, 43, 36], false));
        Tuning._sixStrings.push(new Tuning('Guitar Open Cm Tuning', [63, 60, 55, 48, 43, 36], false));
        Tuning._sixStrings.push(new Tuning('Guitar Open C6 Tuning', [64, 57, 55, 48, 43, 36], false));
        Tuning._sixStrings.push(new Tuning('Guitar Open Cmaj7 Tuning', [64, 59, 55, 52, 43, 36], false));
        Tuning._sixStrings.push(new Tuning('Guitar Open D Tuning', [62, 57, 54, 50, 45, 38], false));
        Tuning._sixStrings.push(new Tuning('Guitar Open Dm Tuning', [62, 57, 53, 50, 45, 38], false));
        Tuning._sixStrings.push(new Tuning('Guitar Open D5 Tuning', [62, 57, 50, 50, 45, 38], false));
        Tuning._sixStrings.push(new Tuning('Guitar Open D6 Tuning', [62, 59, 54, 50, 45, 38], false));
        Tuning._sixStrings.push(new Tuning('Guitar Open Dsus4 Tuning', [62, 57, 55, 50, 45, 38], false));
        Tuning._sixStrings.push(new Tuning('Guitar Open E Tuning', [64, 59, 56, 52, 47, 40], false));
        Tuning._sixStrings.push(new Tuning('Guitar Open Em Tuning', [64, 59, 55, 52, 47, 40], false));
        Tuning._sixStrings.push(new Tuning('Guitar Open Esus11 Tuning', [64, 59, 55, 52, 45, 40], false));
        Tuning._sixStrings.push(new Tuning('Guitar Open F Tuning', [65, 60, 53, 48, 45, 41], false));
        Tuning._sixStrings.push(new Tuning('Guitar Open G Tuning', [62, 59, 55, 50, 43, 38], false));
        Tuning._sixStrings.push(new Tuning('Guitar Open Gm Tuning', [62, 58, 55, 50, 43, 38], false));
        Tuning._sixStrings.push(new Tuning('Guitar Open G6 Tuning', [64, 59, 55, 50, 43, 38], false));
        Tuning._sixStrings.push(new Tuning('Guitar Open Gsus4 Tuning', [62, 60, 55, 50, 43, 38], false));
        Tuning._sixStrings.push(new Tuning('Guitar Open A Tuning', [64, 61, 57, 52, 45, 40], false));
        Tuning._sixStrings.push(new Tuning('Guitar Open Am Tuning', [64, 60, 57, 52, 45, 40], false));
        Tuning._sixStrings.push(new Tuning('Guitar Nashville Tuning', [64, 59, 67, 62, 57, 52], false));
        Tuning._sixStrings.push(new Tuning('Bass 6 Strings Tuning', [48, 43, 38, 33, 28, 23], false));
        Tuning._sixStrings.push(new Tuning('Lute or Vihuela Tuning', [64, 59, 54, 50, 45, 40], false));
        Tuning._defaultTunings.set(5, new Tuning('Bass 5 Strings Tuning', [43, 38, 33, 28, 23], true));
        Tuning._fiveStrings.push(Tuning._defaultTunings.get(5));
        Tuning._fiveStrings.push(new Tuning('Banjo Dropped C Tuning', [62, 59, 55, 48, 67], false));
        Tuning._fiveStrings.push(new Tuning('Banjo Open D Tuning', [62, 57, 54, 50, 69], false));
        Tuning._fiveStrings.push(new Tuning('Banjo Open G Tuning', [62, 59, 55, 50, 67], false));
        Tuning._fiveStrings.push(new Tuning('Banjo G Minor Tuning', [62, 58, 55, 50, 67], false));
        Tuning._fiveStrings.push(new Tuning('Banjo G Modal Tuning', [62, 57, 55, 50, 67], false));
        Tuning._defaultTunings.set(4, new Tuning('Bass Standard Tuning', [43, 38, 33, 28], true));
        Tuning._fourStrings.push(Tuning._defaultTunings.get(4));
        Tuning._fourStrings.push(new Tuning('Bass Tune down ½ step', [42, 37, 32, 27], false));
        Tuning._fourStrings.push(new Tuning('Bass Tune down 1 step', [41, 36, 31, 26], false));
        Tuning._fourStrings.push(new Tuning('Bass Tune down 2 step', [39, 34, 29, 24], false));
        Tuning._fourStrings.push(new Tuning('Bass Dropped D Tuning', [43, 38, 33, 26], false));
        Tuning._fourStrings.push(new Tuning('Ukulele C Tuning', [45, 40, 36, 43], false));
        Tuning._fourStrings.push(new Tuning('Ukulele G Tuning', [52, 47, 43, 38], false));
        Tuning._fourStrings.push(new Tuning('Mandolin Standard Tuning', [64, 57, 50, 43], false));
        Tuning._fourStrings.push(new Tuning('Mandolin or Violin Tuning', [76, 69, 62, 55], false));
        Tuning._fourStrings.push(new Tuning('Viola Tuning', [69, 62, 55, 48], false));
        Tuning._fourStrings.push(new Tuning('Cello Tuning', [57, 50, 43, 36], false));
    }
    static findTuning(strings) {
        let tunings = Tuning.getPresetsFor(strings.length);
        for (let t = 0, tc = tunings.length; t < tc; t++) {
            let tuning = tunings[t];
            let equals = true;
            for (let i = 0, j = strings.length; i < j; i++) {
                if (strings[i] !== tuning.tunings[i]) {
                    equals = false;
                    break;
                }
            }
            if (equals) {
                return tuning;
            }
        }
        return null;
    }
    finish() {
        const knownTuning = Tuning.findTuning(this.tunings);
        if (knownTuning) {
            this.name = knownTuning.name;
            this.isStandard = knownTuning.isStandard;
        }
        this.name = this.name.trim();
    }
}
Tuning._sevenStrings = [];
Tuning._sixStrings = [];
Tuning._fiveStrings = [];
Tuning._fourStrings = [];
Tuning._defaultTunings = new Map();
Tuning.defaultAccidentals = ['', '#', '', '#', '', '', '#', '', '#', '', '#', ''];
Tuning.defaultSteps = ['C', 'C', 'D', 'D', 'E', 'F', 'F', 'G', 'G', 'A', 'A', 'B'];
Tuning.initialize();
class TupletGroup {
    constructor(voice) {
        this._isEqualLengthTuplet = true;
        this.totalDuration = 0;
        this.beats = [];
        this.isFull = false;
        this.voice = voice;
    }
    check(beat) {
        if (this.beats.length === 0) {
            this.beats.push(beat);
            this.totalDuration += beat.playbackDuration;
            return true;
        }
        if (beat.graceType !== GraceType.None) {
            return true;
        }
        if (beat.voice !== this.voice ||
            this.isFull ||
            beat.tupletNumerator !== this.beats[0].tupletNumerator ||
            beat.tupletDenominator !== this.beats[0].tupletDenominator) {
            return false;
        }
        if (beat.playbackDuration !== this.beats[0].playbackDuration) {
            this._isEqualLengthTuplet = false;
        }
        this.beats.push(beat);
        this.totalDuration += beat.playbackDuration;
        if (this._isEqualLengthTuplet) {
            if (this.beats.length === this.beats[0].tupletNumerator) {
                this.isFull = true;
            }
        }
        else {
            let factor = (this.beats[0].tupletNumerator / this.beats[0].tupletDenominator) | 0;
            for (let potentialMatch of TupletGroup.AllTicks) {
                if (this.totalDuration === potentialMatch * factor) {
                    this.isFull = true;
                    break;
                }
            }
        }
        return true;
    }
}
TupletGroup.HalfTicks = 1920;
TupletGroup.QuarterTicks = 960;
TupletGroup.EighthTicks = 480;
TupletGroup.SixteenthTicks = 240;
TupletGroup.ThirtySecondTicks = 120;
TupletGroup.SixtyFourthTicks = 60;
TupletGroup.OneHundredTwentyEighthTicks = 30;
TupletGroup.TwoHundredFiftySixthTicks = 15;
TupletGroup.AllTicks = [
    TupletGroup.HalfTicks,
    TupletGroup.QuarterTicks,
    TupletGroup.EighthTicks,
    TupletGroup.SixteenthTicks,
    TupletGroup.ThirtySecondTicks,
    TupletGroup.SixtyFourthTicks,
    TupletGroup.OneHundredTwentyEighthTicks,
    TupletGroup.TwoHundredFiftySixthTicks
];
var VibratoType;
(function (VibratoType) {
    VibratoType[VibratoType["None"] = 0] = "None";
    VibratoType[VibratoType["Slight"] = 1] = "Slight";
    VibratoType[VibratoType["Wide"] = 2] = "Wide";
})(VibratoType || (VibratoType = {}));
var SlideOutType;
(function (SlideOutType) {
    SlideOutType[SlideOutType["None"] = 0] = "None";
    SlideOutType[SlideOutType["Shift"] = 1] = "Shift";
    SlideOutType[SlideOutType["Legato"] = 2] = "Legato";
    SlideOutType[SlideOutType["OutUp"] = 3] = "OutUp";
    SlideOutType[SlideOutType["OutDown"] = 4] = "OutDown";
    SlideOutType[SlideOutType["PickSlideDown"] = 5] = "PickSlideDown";
    SlideOutType[SlideOutType["PickSlideUp"] = 6] = "PickSlideUp";
})(SlideOutType || (SlideOutType = {}));
var SlideInType;
(function (SlideInType) {
    SlideInType[SlideInType["None"] = 0] = "None";
    SlideInType[SlideInType["IntoFromBelow"] = 1] = "IntoFromBelow";
    SlideInType[SlideInType["IntoFromAbove"] = 2] = "IntoFromAbove";
})(SlideInType || (SlideInType = {}));
var PickStroke;
(function (PickStroke) {
    PickStroke[PickStroke["None"] = 0] = "None";
    PickStroke[PickStroke["Up"] = 1] = "Up";
    PickStroke[PickStroke["Down"] = 2] = "Down";
})(PickStroke || (PickStroke = {}));
class GraceGroup {
    constructor() {
        this.beats = [];
        this.id = 'empty';
        this.isComplete = false;
    }
    addBeat(beat) {
        beat.graceIndex = this.beats.length;
        beat.graceGroup = this;
        this.beats.push(beat);
    }
    finish() {
        if (this.beats.length > 0) {
            this.id = this.beats[0].absoluteDisplayStart + '_' + this.beats[0].voice.index;
        }
    }
}
var GraceType;
(function (GraceType) {
    GraceType[GraceType["None"] = 0] = "None";
    GraceType[GraceType["OnBeat"] = 1] = "OnBeat";
    GraceType[GraceType["BeforeBeat"] = 2] = "BeforeBeat";
    GraceType[GraceType["BendGrace"] = 3] = "BendGrace";
})(GraceType || (GraceType = {}));
var Fingers;
(function (Fingers) {
    Fingers[Fingers["Unknown"] = -2] = "Unknown";
    Fingers[Fingers["NoOrDead"] = -1] = "NoOrDead";
    Fingers[Fingers["Thumb"] = 0] = "Thumb";
    Fingers[Fingers["IndexFinger"] = 1] = "IndexFinger";
    Fingers[Fingers["MiddleFinger"] = 2] = "MiddleFinger";
    Fingers[Fingers["AnnularFinger"] = 3] = "AnnularFinger";
    Fingers[Fingers["LittleFinger"] = 4] = "LittleFinger";
})(Fingers || (Fingers = {}));
var CrescendoType;
(function (CrescendoType) {
    CrescendoType[CrescendoType["None"] = 0] = "None";
    CrescendoType[CrescendoType["Crescendo"] = 1] = "Crescendo";
    CrescendoType[CrescendoType["Decrescendo"] = 2] = "Decrescendo";
})(CrescendoType || (CrescendoType = {}));
var DynamicValue;
(function (DynamicValue) {
    DynamicValue[DynamicValue["PPP"] = 0] = "PPP";
    DynamicValue[DynamicValue["PP"] = 1] = "PP";
    DynamicValue[DynamicValue["P"] = 2] = "P";
    DynamicValue[DynamicValue["MP"] = 3] = "MP";
    DynamicValue[DynamicValue["MF"] = 4] = "MF";
    DynamicValue[DynamicValue["F"] = 5] = "F";
    DynamicValue[DynamicValue["FF"] = 6] = "FF";
    DynamicValue[DynamicValue["FFF"] = 7] = "FFF";
})(DynamicValue || (DynamicValue = {}));
var LyricsState;
(function (LyricsState) {
    LyricsState[LyricsState["IgnoreSpaces"] = 0] = "IgnoreSpaces";
    LyricsState[LyricsState["Begin"] = 1] = "Begin";
    LyricsState[LyricsState["Text"] = 2] = "Text";
    LyricsState[LyricsState["Comment"] = 3] = "Comment";
    LyricsState[LyricsState["Dash"] = 4] = "Dash";
})(LyricsState || (LyricsState = {}));
class Lyrics {
    constructor() {
        this.startBar = 0;
        this.text = '';
    }
    finish(skipEmptyEntries = false) {
        this.chunks = [];
        this.parse(this.text, 0, this.chunks, skipEmptyEntries);
    }
    parse(str, p, chunks, skipEmptyEntries) {
        if (!str) {
            return;
        }
        let state = LyricsState.Begin;
        let next = LyricsState.Begin;
        let skipSpace = false;
        let start = 0;
        while (p < str.length) {
            let c = str.charCodeAt(p);
            switch (state) {
                case LyricsState.IgnoreSpaces:
                    switch (c) {
                        case Lyrics.CharCodeLF:
                        case Lyrics.CharCodeCR:
                        case Lyrics.CharCodeTab:
                            break;
                        case Lyrics.CharCodeSpace:
                            if (!skipSpace) {
                                state = next;
                                continue;
                            }
                            break;
                        default:
                            skipSpace = false;
                            state = next;
                            continue;
                    }
                    break;
                case LyricsState.Begin:
                    switch (c) {
                        case Lyrics.CharCodeBrackedOpen:
                            state = LyricsState.Comment;
                            break;
                        default:
                            start = p;
                            state = LyricsState.Text;
                            continue;
                    }
                    break;
                case LyricsState.Comment:
                    switch (c) {
                        case Lyrics.CharCodeBrackedClose:
                            state = LyricsState.Begin;
                            break;
                    }
                    break;
                case LyricsState.Text:
                    switch (c) {
                        case Lyrics.CharCodeDash:
                            state = LyricsState.Dash;
                            break;
                        case Lyrics.CharCodeCR:
                        case Lyrics.CharCodeLF:
                        case Lyrics.CharCodeSpace:
                            let txt = str.substr(start, p - start);
                            this.addChunk(txt, skipEmptyEntries);
                            state = LyricsState.IgnoreSpaces;
                            next = LyricsState.Begin;
                            break;
                    }
                    break;
                case LyricsState.Dash:
                    switch (c) {
                        case Lyrics.CharCodeDash:
                            break;
                        default:
                            let txt = str.substr(start, p - start);
                            this.addChunk(txt, skipEmptyEntries);
                            skipSpace = true;
                            state = LyricsState.IgnoreSpaces;
                            next = LyricsState.Begin;
                            continue;
                    }
                    break;
            }
            p += 1;
        }
        if (state === LyricsState.Text) {
            if (p !== start) {
                this.addChunk(str.substr(start, p - start), skipEmptyEntries);
            }
        }
    }
    addChunk(txt, skipEmptyEntries) {
        txt = this.prepareChunk(txt);
        if (!skipEmptyEntries || (txt.length > 0 && txt !== '-')) {
            this.chunks.push(txt);
        }
    }
    prepareChunk(txt) {
        let chunk = txt.split('+').join(' ');
        let endLength = chunk.length;
        while (endLength > 0 && chunk.charAt(endLength - 1) === '_') {
            endLength--;
        }
        return endLength !== chunk.length ? chunk.substr(0, endLength) : chunk;
    }
}
Lyrics.CharCodeLF = 10;
Lyrics.CharCodeTab = 9;
Lyrics.CharCodeCR = 13;
Lyrics.CharCodeSpace = 32;
Lyrics.CharCodeBrackedClose = 93;
Lyrics.CharCodeBrackedOpen = 91;
Lyrics.CharCodeDash = 45;
class PlaybackInformation {
    constructor() {
        this.volume = 15;
        this.balance = 8;
        this.port = 1;
        this.program = 0;
        this.primaryChannel = 0;
        this.secondaryChannel = 0;
        this.isMute = false;
        this.isSolo = false;
    }
}
class InstrumentArticulation {
    constructor(elementType = "", staffLine = 0, outputMidiNumber = 0, noteHeadDefault = MusicFontSymbol.None, noteHeadHalf = MusicFontSymbol.None, noteHeadWhole = MusicFontSymbol.None, techniqueSymbol = MusicFontSymbol.None, techniqueSymbolPlacement = TextBaseline.Middle) {
        this.elementType = elementType;
        this.outputMidiNumber = outputMidiNumber;
        this.staffLine = staffLine;
        this.noteHeadDefault = noteHeadDefault;
        this.noteHeadHalf = noteHeadHalf !== MusicFontSymbol.None ? noteHeadHalf : noteHeadDefault;
        this.noteHeadWhole = noteHeadWhole !== MusicFontSymbol.None ? noteHeadWhole : noteHeadDefault;
        this.techniqueSymbol = techniqueSymbol;
        this.techniqueSymbolPlacement = techniqueSymbolPlacement;
    }
    getSymbol(duration) {
        switch (duration) {
            case Duration.Whole:
                return this.noteHeadWhole;
            case Duration.Half:
                return this.noteHeadHalf;
            default:
                return this.noteHeadDefault;
        }
    }
}
class PercussionMapper {
    static articulationFromElementVariation(element, variation) {
        if (element < PercussionMapper.gp6ElementAndVariationToArticulation.length) {
            if (variation >= PercussionMapper.gp6ElementAndVariationToArticulation.length) {
                variation = 0;
            }
            return PercussionMapper.gp6ElementAndVariationToArticulation[element][variation];
        }
        return 38;
    }
    static getArticulation(n) {
        const articulationIndex = n.percussionArticulation;
        const trackArticulations = n.beat.voice.bar.staff.track.percussionArticulations;
        if (articulationIndex < trackArticulations.length) {
            return trackArticulations[articulationIndex];
        }
        return PercussionMapper.getArticulationByValue(articulationIndex);
        ;
    }
    static getElementAndVariation(n) {
        const articulation = PercussionMapper.getArticulation(n);
        if (!articulation) {
            return [-1, -1];
        }
        for (let element = 0; element < PercussionMapper.gp6ElementAndVariationToArticulation.length; element++) {
            const variations = PercussionMapper.gp6ElementAndVariationToArticulation[element];
            for (let variation = 0; variation < variations.length; variation++) {
                const gp6Articulation = PercussionMapper.getArticulationByValue(variations[variation]);
                if ((gp6Articulation === null || gp6Articulation === void 0 ? void 0 : gp6Articulation.outputMidiNumber) === articulation.outputMidiNumber) {
                    return [element, variation];
                }
            }
        }
        return [-1, -1];
    }
    static getArticulationByValue(midiNumber) {
        if (PercussionMapper.instrumentArticulations.has(midiNumber)) {
            return PercussionMapper.instrumentArticulations.get(midiNumber);
        }
        return null;
    }
}
PercussionMapper.gp6ElementAndVariationToArticulation = [
    [35, 35, 35],
    [38, 91, 37],
    [99, 100, 99],
    [56, 100, 56],
    [102, 103, 102],
    [43, 43, 43],
    [45, 45, 45],
    [47, 47, 47],
    [48, 48, 48],
    [50, 50, 50],
    [42, 92, 46],
    [44, 44, 44],
    [57, 98, 57],
    [49, 97, 49],
    [55, 95, 55],
    [51, 93, 127],
    [52, 96, 52],
];
PercussionMapper.instrumentArticulations = new Map([
    [38, new InstrumentArticulation("snare", 3, 38, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [37, new InstrumentArticulation("snare", 3, 37, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack)],
    [91, new InstrumentArticulation("snare", 3, 38, MusicFontSymbol.NoteheadDiamondWhite, MusicFontSymbol.NoteheadDiamondWhite, MusicFontSymbol.NoteheadDiamondWhite)],
    [42, new InstrumentArticulation("hiHat", -1, 42, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack)],
    [92, new InstrumentArticulation("hiHat", -1, 46, MusicFontSymbol.NoteheadCircleSlash, MusicFontSymbol.NoteheadCircleSlash, MusicFontSymbol.NoteheadCircleSlash)],
    [46, new InstrumentArticulation("hiHat", -1, 46, MusicFontSymbol.NoteheadCircleX, MusicFontSymbol.NoteheadCircleX, MusicFontSymbol.NoteheadCircleX)],
    [44, new InstrumentArticulation("hiHat", 9, 44, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack)],
    [35, new InstrumentArticulation("kickDrum", 8, 35, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [36, new InstrumentArticulation("kickDrum", 7, 36, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [50, new InstrumentArticulation("tom", 1, 50, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [48, new InstrumentArticulation("tom", 2, 48, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [47, new InstrumentArticulation("tom", 4, 47, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [45, new InstrumentArticulation("tom", 5, 45, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [43, new InstrumentArticulation("tom", 6, 43, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [93, new InstrumentArticulation("ride", 0, 51, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.PictEdgeOfCymbal, TextBaseline.Bottom)],
    [51, new InstrumentArticulation("ride", 0, 51, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack)],
    [53, new InstrumentArticulation("ride", 0, 53, MusicFontSymbol.NoteheadDiamondWhite, MusicFontSymbol.NoteheadDiamondWhite, MusicFontSymbol.NoteheadDiamondWhite)],
    [94, new InstrumentArticulation("ride", 0, 51, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.ArticStaccatoAbove, TextBaseline.Top)],
    [55, new InstrumentArticulation("splash", -2, 55, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack)],
    [95, new InstrumentArticulation("splash", -2, 55, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.ArticStaccatoAbove, TextBaseline.Bottom)],
    [52, new InstrumentArticulation("china", -3, 52, MusicFontSymbol.NoteheadHeavyXHat, MusicFontSymbol.NoteheadHeavyXHat, MusicFontSymbol.NoteheadHeavyXHat)],
    [96, new InstrumentArticulation("china", -3, 52, MusicFontSymbol.NoteheadHeavyXHat, MusicFontSymbol.NoteheadHeavyXHat, MusicFontSymbol.NoteheadHeavyXHat)],
    [49, new InstrumentArticulation("crash", -2, 49, MusicFontSymbol.NoteheadHeavyX, MusicFontSymbol.NoteheadHeavyX, MusicFontSymbol.NoteheadHeavyX)],
    [97, new InstrumentArticulation("crash", -2, 49, MusicFontSymbol.NoteheadHeavyX, MusicFontSymbol.NoteheadHeavyX, MusicFontSymbol.NoteheadHeavyX, MusicFontSymbol.ArticStaccatoAbove, TextBaseline.Bottom)],
    [57, new InstrumentArticulation("crash", -1, 57, MusicFontSymbol.NoteheadHeavyX, MusicFontSymbol.NoteheadHeavyX, MusicFontSymbol.NoteheadHeavyX)],
    [98, new InstrumentArticulation("crash", -1, 57, MusicFontSymbol.NoteheadHeavyX, MusicFontSymbol.NoteheadHeavyX, MusicFontSymbol.NoteheadHeavyX, MusicFontSymbol.ArticStaccatoAbove, TextBaseline.Bottom)],
    [99, new InstrumentArticulation("cowbell", 1, 56, MusicFontSymbol.NoteheadTriangleUpBlack, MusicFontSymbol.NoteheadTriangleUpHalf, MusicFontSymbol.NoteheadTriangleUpWhole)],
    [100, new InstrumentArticulation("cowbell", 1, 56, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXHalf, MusicFontSymbol.NoteheadXWhole)],
    [56, new InstrumentArticulation("cowbell", 0, 56, MusicFontSymbol.NoteheadTriangleUpBlack, MusicFontSymbol.NoteheadTriangleUpHalf, MusicFontSymbol.NoteheadTriangleUpWhole)],
    [101, new InstrumentArticulation("cowbell", 0, 56, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXHalf, MusicFontSymbol.NoteheadXWhole)],
    [102, new InstrumentArticulation("cowbell", -1, 56, MusicFontSymbol.NoteheadTriangleUpBlack, MusicFontSymbol.NoteheadTriangleUpHalf, MusicFontSymbol.NoteheadTriangleUpWhole)],
    [103, new InstrumentArticulation("cowbell", -1, 56, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXHalf, MusicFontSymbol.NoteheadXWhole)],
    [77, new InstrumentArticulation("woodblock", -9, 77, MusicFontSymbol.NoteheadTriangleUpBlack, MusicFontSymbol.NoteheadTriangleUpBlack, MusicFontSymbol.NoteheadTriangleUpBlack)],
    [76, new InstrumentArticulation("woodblock", -10, 76, MusicFontSymbol.NoteheadTriangleUpBlack, MusicFontSymbol.NoteheadTriangleUpBlack, MusicFontSymbol.NoteheadTriangleUpBlack)],
    [60, new InstrumentArticulation("bongo", -4, 60, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [104, new InstrumentArticulation("bongo", -5, 60, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole, MusicFontSymbol.NoteheadParenthesis, TextBaseline.Middle)],
    [105, new InstrumentArticulation("bongo", -6, 60, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack)],
    [61, new InstrumentArticulation("bongo", -7, 61, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [106, new InstrumentArticulation("bongo", -8, 61, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole, MusicFontSymbol.NoteheadParenthesis, TextBaseline.Middle)],
    [107, new InstrumentArticulation("bongo", -16, 61, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack)],
    [66, new InstrumentArticulation("timbale", 10, 66, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [65, new InstrumentArticulation("timbale", 9, 65, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [68, new InstrumentArticulation("agogo", 12, 68, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [67, new InstrumentArticulation("agogo", 11, 67, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [64, new InstrumentArticulation("conga", 17, 64, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [108, new InstrumentArticulation("conga", 16, 64, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack)],
    [109, new InstrumentArticulation("conga", 15, 64, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole, MusicFontSymbol.NoteheadParenthesis, TextBaseline.Middle)],
    [63, new InstrumentArticulation("conga", 14, 63, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [110, new InstrumentArticulation("conga", 13, 63, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack)],
    [62, new InstrumentArticulation("conga", 19, 62, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole, MusicFontSymbol.NoteheadParenthesis, TextBaseline.Middle)],
    [72, new InstrumentArticulation("whistle", -11, 72, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [71, new InstrumentArticulation("whistle", -17, 71, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [73, new InstrumentArticulation("guiro", 38, 73, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [74, new InstrumentArticulation("guiro", 37, 74, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [86, new InstrumentArticulation("surdo", 36, 86, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [87, new InstrumentArticulation("surdo", 35, 87, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadParenthesis, TextBaseline.Middle)],
    [54, new InstrumentArticulation("tambourine", 3, 54, MusicFontSymbol.NoteheadTriangleUpBlack, MusicFontSymbol.NoteheadTriangleUpBlack, MusicFontSymbol.NoteheadTriangleUpBlack)],
    [111, new InstrumentArticulation("tambourine", 2, 54, MusicFontSymbol.NoteheadTriangleUpBlack, MusicFontSymbol.NoteheadTriangleUpBlack, MusicFontSymbol.NoteheadTriangleUpBlack, MusicFontSymbol.StringsUpBow, TextBaseline.Bottom)],
    [112, new InstrumentArticulation("tambourine", 1, 54, MusicFontSymbol.NoteheadTriangleUpBlack, MusicFontSymbol.NoteheadTriangleUpBlack, MusicFontSymbol.NoteheadTriangleUpBlack, MusicFontSymbol.StringsDownBow, TextBaseline.Bottom)],
    [113, new InstrumentArticulation("tambourine", -7, 54, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack)],
    [79, new InstrumentArticulation("cuica", 30, 79, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [78, new InstrumentArticulation("cuica", 29, 78, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack)],
    [58, new InstrumentArticulation("vibraslap", 28, 58, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [81, new InstrumentArticulation("triangle", 27, 81, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [80, new InstrumentArticulation("triangle", 26, 80, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadParenthesis, TextBaseline.Middle)],
    [114, new InstrumentArticulation("grancassa", 25, 43, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [115, new InstrumentArticulation("piatti", 18, 49, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [116, new InstrumentArticulation("piatti", 24, 49, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack)],
    [69, new InstrumentArticulation("cabasa", 23, 69, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [117, new InstrumentArticulation("cabasa", 22, 69, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole, MusicFontSymbol.StringsUpBow, TextBaseline.Bottom)],
    [85, new InstrumentArticulation("castanets", 21, 85, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [75, new InstrumentArticulation("claves", 20, 75, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [70, new InstrumentArticulation("maraca", -12, 70, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [118, new InstrumentArticulation("maraca", -13, 70, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole, MusicFontSymbol.StringsUpBow, TextBaseline.Bottom)],
    [119, new InstrumentArticulation("maraca", -14, 70, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [120, new InstrumentArticulation("maraca", -15, 70, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole, MusicFontSymbol.StringsUpBow, TextBaseline.Bottom)],
    [82, new InstrumentArticulation("shaker", -23, 54, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [122, new InstrumentArticulation("shaker", -24, 54, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole, MusicFontSymbol.StringsUpBow, TextBaseline.Bottom)],
    [84, new InstrumentArticulation("bellTree", -18, 53, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [123, new InstrumentArticulation("bellTree", -19, 53, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole, MusicFontSymbol.StringsUpBow, TextBaseline.Bottom)],
    [83, new InstrumentArticulation("jingleBell", -20, 53, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [124, new InstrumentArticulation("unpitched", -21, 62, MusicFontSymbol.NoteheadNull, MusicFontSymbol.NoteheadNull, MusicFontSymbol.NoteheadNull, MusicFontSymbol.GuitarGolpe, TextBaseline.Top)],
    [125, new InstrumentArticulation("unpitched", -22, 62, MusicFontSymbol.NoteheadNull, MusicFontSymbol.NoteheadNull, MusicFontSymbol.NoteheadNull, MusicFontSymbol.GuitarGolpe, TextBaseline.Bottom)],
    [39, new InstrumentArticulation("handClap", 3, 39, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [40, new InstrumentArticulation("snare", 3, 40, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [31, new InstrumentArticulation("snare", 3, 40, MusicFontSymbol.NoteheadSlashedBlack2, MusicFontSymbol.NoteheadSlashedBlack2, MusicFontSymbol.NoteheadSlashedBlack2)],
    [41, new InstrumentArticulation("tom", 5, 41, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadHalf, MusicFontSymbol.NoteheadWhole)],
    [59, new InstrumentArticulation("ride", 2, 59, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.PictEdgeOfCymbal, TextBaseline.Bottom)],
    [126, new InstrumentArticulation("ride", 2, 59, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack)],
    [127, new InstrumentArticulation("ride", 2, 59, MusicFontSymbol.NoteheadDiamondWhite, MusicFontSymbol.NoteheadDiamondWhite, MusicFontSymbol.NoteheadDiamondWhite)],
    [29, new InstrumentArticulation("ride", 2, 59, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.ArticStaccatoAbove, TextBaseline.Top)],
    [30, new InstrumentArticulation("crash", -3, 49, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack)],
    [33, new InstrumentArticulation("snare", 3, 37, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack, MusicFontSymbol.NoteheadXBlack)],
    [34, new InstrumentArticulation("snare", 3, 38, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadBlack, MusicFontSymbol.NoteheadBlack)]
]);
class FormatError {
    constructor(message) {
        Object.setPrototypeOf(this, FormatError.prototype);
    }
}
var TabRhythmMode;
(function (TabRhythmMode) {
    TabRhythmMode[TabRhythmMode["Hidden"] = 0] = "Hidden";
    TabRhythmMode[TabRhythmMode["ShowWithBeams"] = 1] = "ShowWithBeams";
    TabRhythmMode[TabRhythmMode["ShowWithBars"] = 2] = "ShowWithBars";
})(TabRhythmMode || (TabRhythmMode = {}));
var FingeringMode;
(function (FingeringMode) {
    FingeringMode[FingeringMode["ScoreDefault"] = 0] = "ScoreDefault";
    FingeringMode[FingeringMode["ScoreForcePiano"] = 1] = "ScoreForcePiano";
    FingeringMode[FingeringMode["SingleNoteEffectBand"] = 2] = "SingleNoteEffectBand";
    FingeringMode[FingeringMode["SingleNoteEffectBandForcePiano"] = 3] = "SingleNoteEffectBandForcePiano";
})(FingeringMode || (FingeringMode = {}));
var NotationMode;
(function (NotationMode) {
    NotationMode[NotationMode["GuitarPro"] = 0] = "GuitarPro";
    NotationMode[NotationMode["SongBook"] = 1] = "SongBook";
})(NotationMode || (NotationMode = {}));
var NotationElement;
(function (NotationElement) {
    NotationElement[NotationElement["ScoreTitle"] = 0] = "ScoreTitle";
    NotationElement[NotationElement["ScoreSubTitle"] = 1] = "ScoreSubTitle";
    NotationElement[NotationElement["ScoreArtist"] = 2] = "ScoreArtist";
    NotationElement[NotationElement["ScoreAlbum"] = 3] = "ScoreAlbum";
    NotationElement[NotationElement["ScoreWords"] = 4] = "ScoreWords";
    NotationElement[NotationElement["ScoreMusic"] = 5] = "ScoreMusic";
    NotationElement[NotationElement["ScoreWordsAndMusic"] = 6] = "ScoreWordsAndMusic";
    NotationElement[NotationElement["ScoreCopyright"] = 7] = "ScoreCopyright";
    NotationElement[NotationElement["GuitarTuning"] = 8] = "GuitarTuning";
    NotationElement[NotationElement["TrackNames"] = 9] = "TrackNames";
    NotationElement[NotationElement["ChordDiagrams"] = 10] = "ChordDiagrams";
    NotationElement[NotationElement["ParenthesisOnTiedBends"] = 11] = "ParenthesisOnTiedBends";
    NotationElement[NotationElement["TabNotesOnTiedBends"] = 12] = "TabNotesOnTiedBends";
    NotationElement[NotationElement["ZerosOnDiveWhammys"] = 13] = "ZerosOnDiveWhammys";
    NotationElement[NotationElement["EffectAlternateEndings"] = 14] = "EffectAlternateEndings";
    NotationElement[NotationElement["EffectCapo"] = 15] = "EffectCapo";
    NotationElement[NotationElement["EffectChordNames"] = 16] = "EffectChordNames";
    NotationElement[NotationElement["EffectCrescendo"] = 17] = "EffectCrescendo";
    NotationElement[NotationElement["EffectDynamics"] = 18] = "EffectDynamics";
    NotationElement[NotationElement["EffectFadeIn"] = 19] = "EffectFadeIn";
    NotationElement[NotationElement["EffectFermata"] = 20] = "EffectFermata";
    NotationElement[NotationElement["EffectFingering"] = 21] = "EffectFingering";
    NotationElement[NotationElement["EffectHarmonics"] = 22] = "EffectHarmonics";
    NotationElement[NotationElement["EffectLetRing"] = 23] = "EffectLetRing";
    NotationElement[NotationElement["EffectLyrics"] = 24] = "EffectLyrics";
    NotationElement[NotationElement["EffectMarker"] = 25] = "EffectMarker";
    NotationElement[NotationElement["EffectOttavia"] = 26] = "EffectOttavia";
    NotationElement[NotationElement["EffectPalmMute"] = 27] = "EffectPalmMute";
    NotationElement[NotationElement["EffectPickSlide"] = 28] = "EffectPickSlide";
    NotationElement[NotationElement["EffectPickStroke"] = 29] = "EffectPickStroke";
    NotationElement[NotationElement["EffectSlightBeatVibrato"] = 30] = "EffectSlightBeatVibrato";
    NotationElement[NotationElement["EffectSlightNoteVibrato"] = 31] = "EffectSlightNoteVibrato";
    NotationElement[NotationElement["EffectTap"] = 32] = "EffectTap";
    NotationElement[NotationElement["EffectTempo"] = 33] = "EffectTempo";
    NotationElement[NotationElement["EffectText"] = 34] = "EffectText";
    NotationElement[NotationElement["EffectTrill"] = 35] = "EffectTrill";
    NotationElement[NotationElement["EffectTripletFeel"] = 36] = "EffectTripletFeel";
    NotationElement[NotationElement["EffectWhammyBar"] = 37] = "EffectWhammyBar";
    NotationElement[NotationElement["EffectWideBeatVibrato"] = 38] = "EffectWideBeatVibrato";
    NotationElement[NotationElement["EffectWideNoteVibrato"] = 39] = "EffectWideNoteVibrato";
    NotationElement[NotationElement["EffectLeftHandTap"] = 40] = "EffectLeftHandTap";
})(NotationElement || (NotationElement = {}));
class NotationSettings {
    constructor() {
        this.notationMode = NotationMode.GuitarPro;
        this.fingeringMode = FingeringMode.ScoreDefault;
        this.elements = new Map();
        this.rhythmMode = TabRhythmMode.Hidden;
        this.rhythmHeight = 15;
        this.transpositionPitches = [];
        this.displayTranspositionPitches = [];
        this.smallGraceTabNotes = true;
        this.extendBendArrowsOnTiedNotes = true;
        this.extendLineEffectsToBeatEnd = false;
        this.slurHeight = 5.0;
    }
    isNotationElementVisible(element) {
        if (this.elements.has(element)) {
            return this.elements.get(element);
        }
        if (NotationSettings.defaultElements.has(element)) {
            return NotationSettings.defaultElements.get(element);
        }
        return true;
    }
}
NotationSettings.defaultElements = new Map([
    [NotationElement.ZerosOnDiveWhammys, false]
]);
class Lazy {
    constructor(factory) {
        this._value = undefined;
        this._factory = factory;
    }
    get value() {
        if (this._value === undefined) {
            this._value = this._factory();
        }
        return this._value;
    }
}
class TuningParseResult {
    constructor() {
        this.note = null;
        this.noteValue = 0;
        this.octave = 0;
    }
    get realValue() {
        return this.octave * 12 + this.noteValue;
    }
}
class ModelUtils {
    static getIndex(duration) {
        let index = 0;
        let value = duration;
        if (value < 0) {
            return index;
        }
        return Math.log2(duration) | 0;
    }
    static keySignatureIsFlat(ks) {
        return ks < 0;
    }
    static keySignatureIsNatural(ks) {
        return ks === 0;
    }
    static keySignatureIsSharp(ks) {
        return ks > 0;
    }
    static applyPitchOffsets(settings, score) {
        for (let i = 0; i < score.tracks.length; i++) {
            if (i < settings.notation.displayTranspositionPitches.length) {
                for (let staff of score.tracks[i].staves) {
                    staff.displayTranspositionPitch = -settings.notation.displayTranspositionPitches[i];
                }
            }
            if (i < settings.notation.transpositionPitches.length) {
                for (let staff of score.tracks[i].staves) {
                    staff.transpositionPitch = -settings.notation.transpositionPitches[i];
                }
            }
        }
    }
    static fingerToString(settings, beat, finger, leftHand) {
        if (settings.notation.fingeringMode === FingeringMode.ScoreForcePiano ||
            settings.notation.fingeringMode === FingeringMode.SingleNoteEffectBandForcePiano ||
            GeneralMidi.isPiano(beat.voice.bar.staff.track.playbackInfo.program)) {
            switch (finger) {
                case Fingers.Unknown:
                case Fingers.NoOrDead:
                    return null;
                case Fingers.Thumb:
                    return '1';
                case Fingers.IndexFinger:
                    return '2';
                case Fingers.MiddleFinger:
                    return '3';
                case Fingers.AnnularFinger:
                    return '4';
                case Fingers.LittleFinger:
                    return '5';
                default:
                    return null;
            }
        }
        if (leftHand) {
            switch (finger) {
                case Fingers.Unknown:
                case Fingers.NoOrDead:
                    return '0';
                case Fingers.Thumb:
                    return 'T';
                case Fingers.IndexFinger:
                    return '1';
                case Fingers.MiddleFinger:
                    return '2';
                case Fingers.AnnularFinger:
                    return '3';
                case Fingers.LittleFinger:
                    return '4';
                default:
                    return null;
            }
        }
        switch (finger) {
            case Fingers.Unknown:
            case Fingers.NoOrDead:
                return null;
            case Fingers.Thumb:
                return 'p';
            case Fingers.IndexFinger:
                return 'i';
            case Fingers.MiddleFinger:
                return 'm';
            case Fingers.AnnularFinger:
                return 'a';
            case Fingers.LittleFinger:
                return 'c';
            default:
                return null;
        }
    }
    static isTuning(name) {
        return !!ModelUtils.parseTuning(name);
    }
    static parseTuning(name) {
        let note = '';
        let octave = '';
        for (let i = 0; i < name.length; i++) {
            let c = name.charCodeAt(i);
            if (c >= 0x30 && c <= 0x39) {
                if (!note) {
                    return null;
                }
                octave += String.fromCharCode(c);
            }
            else if ((c >= 0x41 && c <= 0x5a) || (c >= 0x61 && c <= 0x7a) || c === 0x23) {
                note += String.fromCharCode(c);
            }
            else {
                return null;
            }
        }
        if (!octave || !note) {
            return null;
        }
        let result = new TuningParseResult();
        result.octave = parseInt(octave) + 1;
        result.note = note.toLowerCase();
        result.noteValue = ModelUtils.getToneForText(result.note);
        return result;
    }
    static getTuningForText(str) {
        let result = ModelUtils.parseTuning(str);
        if (!result) {
            return -1;
        }
        return result.realValue;
    }
    static getToneForText(note) {
        switch (note.toLowerCase()) {
            case 'c':
                return 0;
            case 'c#':
            case 'db':
                return 1;
            case 'd':
                return 2;
            case 'd#':
            case 'eb':
                return 3;
            case 'e':
                return 4;
            case 'f':
                return 5;
            case 'f#':
            case 'gb':
                return 6;
            case 'g':
                return 7;
            case 'g#':
            case 'ab':
                return 8;
            case 'a':
                return 9;
            case 'a#':
            case 'bb':
                return 10;
            case 'b':
                return 11;
            default:
                return 0;
        }
    }
    static newGuid() {
        return (Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1) +
            Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1) +
            '-' +
            Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1) +
            '-' +
            Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1) +
            '-' +
            Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1) +
            '-' +
            Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1) +
            Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1) +
            Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1));
    }
    static isAlmostEqualTo(a, b) {
        return Math.abs(a - b) < 0.00001;
    }
    static toHexString(n, digits = 0) {
        let s = '';
        let hexChars = '0123456789ABCDEF';
        do {
            s = String.fromCharCode(hexChars.charCodeAt(n & 15)) + s;
            n = n >> 4;
        } while (n > 0);
        while (s.length < digits) {
            s = '0' + s;
        }
        return s;
    }
}
class Section {
    constructor() {
        this.marker = '';
        this.text = '';
    }
}
class IOHelper {
    static readInt32BE(input) {
        let ch1 = input.readByte();
        let ch2 = input.readByte();
        let ch3 = input.readByte();
        let ch4 = input.readByte();
        return (ch1 << 24) | (ch2 << 16) | (ch3 << 8) | ch4;
    }
    static readInt32LE(input) {
        let ch1 = input.readByte();
        let ch2 = input.readByte();
        let ch3 = input.readByte();
        let ch4 = input.readByte();
        return (ch4 << 24) | (ch3 << 16) | (ch2 << 8) | ch1;
    }
    static readUInt32LE(input) {
        let ch1 = input.readByte();
        let ch2 = input.readByte();
        let ch3 = input.readByte();
        let ch4 = input.readByte();
        return (ch4 << 24) | (ch3 << 16) | (ch2 << 8) | ch1;
    }
    static decodeUInt32LE(data, index) {
        let ch1 = data[index];
        let ch2 = data[index + 1];
        let ch3 = data[index + 2];
        let ch4 = data[index + 3];
        return (ch4 << 24) | (ch3 << 16) | (ch2 << 8) | ch1;
    }
    static readUInt16LE(input) {
        let ch1 = input.readByte();
        let ch2 = input.readByte();
        return TypeConversions.int32ToUint16((ch2 << 8) | ch1);
    }
    static readInt16LE(input) {
        let ch1 = input.readByte();
        let ch2 = input.readByte();
        return TypeConversions.int32ToInt16((ch2 << 8) | ch1);
    }
    static readUInt32BE(input) {
        let ch1 = input.readByte();
        let ch2 = input.readByte();
        let ch3 = input.readByte();
        let ch4 = input.readByte();
        return TypeConversions.int32ToUint32((ch1 << 24) | (ch2 << 16) | (ch3 << 8) | ch4);
    }
    static readUInt16BE(input) {
        let ch1 = input.readByte();
        let ch2 = input.readByte();
        return TypeConversions.int32ToInt16((ch1 << 8) | ch2);
    }
    static readInt16BE(input) {
        let ch1 = input.readByte();
        let ch2 = input.readByte();
        return TypeConversions.int32ToInt16((ch1 << 8) | ch2);
    }
    static readByteArray(input, length) {
        let v = new Uint8Array(length);
        input.read(v, 0, length);
        return v;
    }
    static read8BitChars(input, length) {
        let b = new Uint8Array(length);
        input.read(b, 0, b.length);
        return IOHelper.toString(b, 'utf-8');
    }
    static read8BitString(input) {
        let s = '';
        let c = input.readByte();
        while (c !== 0) {
            s += String.fromCharCode(c);
            c = input.readByte();
        }
        return s;
    }
    static read8BitStringLength(input, length) {
        let s = '';
        let z = -1;
        for (let i = 0; i < length; i++) {
            let c = input.readByte();
            if (c === 0 && z === -1) {
                z = i;
            }
            s += String.fromCharCode(c);
        }
        let t = s;
        if (z >= 0) {
            return t.substr(0, z);
        }
        return t;
    }
    static readSInt8(input) {
        let v = input.readByte();
        return ((v & 255) >> 7) * -256 + (v & 255);
    }
    static readInt24(input, index) {
        let i = input[index] | (input[index + 1] << 8) | (input[index + 2] << 16);
        if ((i & 0x800000) === 0x800000) {
            i = i | (0xff << 24);
        }
        return i;
    }
    static readInt16(input, index) {
        return TypeConversions.int32ToInt16(input[index] | (input[index + 1] << 8));
    }
    static toString(data, encoding) {
        let detectedEncoding = IOHelper.detectEncoding(data);
        if (detectedEncoding) {
            encoding = detectedEncoding;
        }
        if (!encoding) {
            encoding = 'utf-8';
        }
        let decoder = new TextDecoder(encoding);
        return decoder.decode(data.buffer);
    }
    static detectEncoding(data) {
        if (data.length > 2 && data[0] === 0xfe && data[1] === 0xff) {
            return 'utf-16be';
        }
        if (data.length > 2 && data[0] === 0xff && data[1] === 0xfe) {
            return 'utf-16le';
        }
        if (data.length > 4 && data[0] === 0x00 && data[1] === 0x00 && data[2] === 0xfe && data[3] === 0xff) {
            return 'utf-32be';
        }
        if (data.length > 4 && data[0] === 0xff && data[1] === 0xfe && data[2] === 0x00 && data[3] === 0x00) {
            return 'utf-32le';
        }
        return null;
    }
    static stringToBytes(str) {
        let decoder = new TextEncoder();
        return decoder.encode(str);
    }
    static writeInt32BE(o, v) {
        o.writeByte((v >> 24) & 0xff);
        o.writeByte((v >> 16) & 0xff);
        o.writeByte((v >> 8) & 0xff);
        o.writeByte((v >> 0) & 0xff);
    }
    static writeInt32LE(o, v) {
        o.writeByte((v >> 0) & 0xff);
        o.writeByte((v >> 8) & 0xff);
        o.writeByte((v >> 16) & 0xff);
        o.writeByte((v >> 24) & 0xff);
    }
    static writeUInt16LE(o, v) {
        o.writeByte((v >> 0) & 0xff);
        o.writeByte((v >> 8) & 0xff);
    }
    static writeInt16LE(o, v) {
        o.writeByte((v >> 0) & 0xff);
        o.writeByte((v >> 8) & 0xff);
    }
    static writeInt16BE(o, v) {
        o.writeByte((v >> 8) & 0xff);
        o.writeByte((v >> 0) & 0xff);
    }
}
class ByteBuffer {
    constructor() {
        this.length = 0;
        this.position = 0;
    }
    get bytesWritten() {
        return this.position;
    }
    getBuffer() {
        return this._buffer;
    }
    static empty() {
        return ByteBuffer.withCapacity(0);
    }
    static withCapacity(capacity) {
        let buffer = new ByteBuffer();
        buffer._buffer = new Uint8Array(capacity);
        return buffer;
    }
    static fromBuffer(data) {
        let buffer = new ByteBuffer();
        buffer._buffer = data;
        buffer.length = data.length;
        return buffer;
    }
    static fromString(contents) {
        let byteArray = IOHelper.stringToBytes(contents);
        return ByteBuffer.fromBuffer(byteArray);
    }
    reset() {
        this.position = 0;
    }
    skip(offset) {
        this.position += offset;
    }
    readByte() {
        let n = this.length - this.position;
        if (n <= 0) {
            return -1;
        }
        return this._buffer[this.position++];
    }
    read(buffer, offset, count) {
        let n = this.length - this.position;
        if (n > count) {
            n = count;
        }
        if (n <= 0) {
            return 0;
        }
        buffer.set(this._buffer.subarray(this.position, this.position + n), offset);
        this.position += n;
        return n;
    }
    writeByte(value) {
        let i = this.position + 1;
        this.ensureCapacity(i);
        this._buffer[this.position] = value & 0xFF;
        if (i > this.length) {
            this.length = i;
        }
        this.position = i;
    }
    write(buffer, offset, count) {
        let i = this.position + count;
        this.ensureCapacity(i);
        let count1 = Math.min(count, buffer.length - offset);
        this._buffer.set(buffer.subarray(offset, offset + count1), this.position);
        if (i > this.length) {
            this.length = i;
        }
        this.position = i;
    }
    ensureCapacity(value) {
        if (value > this._buffer.length) {
            let newCapacity = value;
            if (newCapacity < 256) {
                newCapacity = 256;
            }
            if (newCapacity < this._buffer.length * 2) {
                newCapacity = this._buffer.length * 2;
            }
            let newBuffer = new Uint8Array(newCapacity);
            if (this.length > 0) {
                newBuffer.set(this._buffer.subarray(0, 0 + this.length), 0);
            }
            this._buffer = newBuffer;
        }
    }
    readAll() {
        return this.toArray();
    }
    toArray() {
        let copy = new Uint8Array(this.length);
        copy.set(this._buffer.subarray(0, 0 + this.length), 0);
        return copy;
    }
    copyTo(destination) {
        destination.write(this._buffer, 0, this.length);
    }
}
class TypeConversions {
    static float64ToBytes(v) {
        TypeConversions._dataView.setFloat64(0, v, true);
        return this._conversionByteArray;
    }
    static bytesToFloat64(bytes) {
        TypeConversions._conversionByteArray.set(bytes, 0);
        throw TypeConversions._dataView.getFloat64(0, true);
    }
    static uint16ToInt16(v) {
        TypeConversions._dataView.setUint16(0, v, true);
        return TypeConversions._dataView.getInt16(0, true);
    }
    static int16ToUint32(v) {
        TypeConversions._dataView.setInt16(0, v, true);
        return TypeConversions._dataView.getUint32(0, true);
    }
    static int32ToUint16(v) {
        TypeConversions._dataView.setInt32(0, v, true);
        return TypeConversions._dataView.getUint16(0, true);
    }
    static int32ToInt16(v) {
        TypeConversions._dataView.setInt32(0, v, true);
        return TypeConversions._dataView.getInt16(0, true);
    }
    static int32ToUint32(v) {
        TypeConversions._dataView.setInt32(0, v, true);
        return TypeConversions._dataView.getUint32(0, true);
    }
    static uint8ToInt8(v) {
        TypeConversions._dataView.setUint8(0, v);
        return TypeConversions._dataView.getInt8(0);
    }
}
TypeConversions._conversionBuffer = new ArrayBuffer(8);
TypeConversions._conversionByteArray = new Uint8Array(TypeConversions._conversionBuffer);
TypeConversions._dataView = new DataView(TypeConversions._conversionBuffer);
class BeatCloner {
    static clone(original) {
        const clone = new Beat();
        clone.index = original.index;
        clone.notes = [];
        for (const i of original.notes) {
            clone.addNote(NoteCloner.clone(i));
        }
        clone.isEmpty = original.isEmpty;
        clone.whammyStyle = original.whammyStyle;
        clone.ottava = original.ottava;
        clone.isLegatoOrigin = original.isLegatoOrigin;
        clone.duration = original.duration;
        clone.isLetRing = original.isLetRing;
        clone.isPalmMute = original.isPalmMute;
        clone.automations = [];
        for (const i of original.automations) {
            clone.automations.push(AutomationCloner.clone(i));
        }
        clone.dots = original.dots;
        clone.fadeIn = original.fadeIn;
        clone.lyrics = original.lyrics ? original.lyrics.slice() : null;
        clone.hasRasgueado = original.hasRasgueado;
        clone.pop = original.pop;
        clone.slap = original.slap;
        clone.tap = original.tap;
        clone.text = original.text;
        clone.brushType = original.brushType;
        clone.brushDuration = original.brushDuration;
        clone.tupletDenominator = original.tupletDenominator;
        clone.tupletNumerator = original.tupletNumerator;
        clone.isContinuedWhammy = original.isContinuedWhammy;
        clone.whammyBarType = original.whammyBarType;
        if (original.whammyBarPoints) {
            clone.whammyBarPoints = [];
            for (const i of original.whammyBarPoints) {
                clone.addWhammyBarPoint(BendPointCloner.clone(i));
            }
        }
        clone.vibrato = original.vibrato;
        clone.chordId = original.chordId;
        clone.graceType = original.graceType;
        clone.pickStroke = original.pickStroke;
        clone.tremoloSpeed = original.tremoloSpeed;
        clone.crescendo = original.crescendo;
        clone.displayStart = original.displayStart;
        clone.playbackStart = original.playbackStart;
        clone.displayDuration = original.displayDuration;
        clone.playbackDuration = original.playbackDuration;
        clone.dynamics = original.dynamics;
        clone.invertBeamDirection = original.invertBeamDirection;
        clone.preferredBeamDirection = original.preferredBeamDirection;
        clone.isEffectSlurOrigin = original.isEffectSlurOrigin;
        clone.beamingMode = original.beamingMode;
        return clone;
    }
}
class NoteCloner {
    static clone(original) {
        const clone = new Note();
        clone.index = original.index;
        clone.accentuated = original.accentuated;
        clone.bendType = original.bendType;
        clone.bendStyle = original.bendStyle;
        clone.isContinuedBend = original.isContinuedBend;
        if (original.bendPoints) {
            clone.bendPoints = [];
            for (const i of original.bendPoints) {
                clone.addBendPoint(BendPointCloner.clone(i));
            }
        }
        clone.fret = original.fret;
        clone.string = original.string;
        clone.octave = original.octave;
        clone.tone = original.tone;
        clone.percussionArticulation = original.percussionArticulation;
        clone.isVisible = original.isVisible;
        clone.isLeftHandTapped = original.isLeftHandTapped;
        clone.isHammerPullOrigin = original.isHammerPullOrigin;
        clone.isSlurDestination = original.isSlurDestination;
        clone.harmonicType = original.harmonicType;
        clone.harmonicValue = original.harmonicValue;
        clone.isGhost = original.isGhost;
        clone.isLetRing = original.isLetRing;
        clone.isPalmMute = original.isPalmMute;
        clone.isDead = original.isDead;
        clone.isStaccato = original.isStaccato;
        clone.slideInType = original.slideInType;
        clone.slideOutType = original.slideOutType;
        clone.vibrato = original.vibrato;
        clone.isTieDestination = original.isTieDestination;
        clone.leftHandFinger = original.leftHandFinger;
        clone.rightHandFinger = original.rightHandFinger;
        clone.isFingering = original.isFingering;
        clone.trillValue = original.trillValue;
        clone.trillSpeed = original.trillSpeed;
        clone.durationPercent = original.durationPercent;
        clone.accidentalMode = original.accidentalMode;
        clone.dynamics = original.dynamics;
        return clone;
    }
}
class BendPointCloner {
    static clone(original) {
        const clone = new BendPoint();
        clone.offset = original.offset;
        clone.value = original.value;
        return clone;
    }
}
class Color {
    constructor(r, g, b, a = 0xff) {
        this.raw = 0;
        this.raw = ((a & 0xff) << 24) | ((r & 0xff) << 16) | ((g & 0xff) << 8) | (b & 0xff);
        this.updateRgba();
    }
    updateRgba() {
        if (this.a === 0xff) {
            this.rgba =
                '#' +
                    ModelUtils.toHexString(this.r, 2) +
                    ModelUtils.toHexString(this.g, 2) +
                    ModelUtils.toHexString(this.b, 2);
        }
        else {
            this.rgba = `rgba(${this.r},${this.g},${this.b},${this.a / 255.0})`;
        }
    }
    get a() {
        return (this.raw >> 24) & 0xff;
    }
    get r() {
        return (this.raw >> 16) & 0xff;
    }
    get g() {
        return (this.raw >> 8) & 0xff;
    }
    get b() {
        return this.raw & 0xff;
    }
    static random(opacity = 100) {
        return new Color((Math.random() * 255) | 0, (Math.random() * 255) | 0, (Math.random() * 255) | 0, opacity);
    }
    static fromJson(v) {
        switch (typeof v) {
            case 'number': {
                const c = new Color(0, 0, 0, 0);
                c.raw = v;
                c.updateRgba();
                return c;
            }
            case 'string': {
                const json = v;
                if (json.startsWith('#')) {
                    if (json.length === 4) {
                        return new Color(parseInt(json[1], 16) * 17, parseInt(json[2], 16) * 17, parseInt(json[3], 16) * 17);
                    }
                    if (json.length === 5) {
                        return new Color(parseInt(json[1], 16) * 17, parseInt(json[2], 16) * 17, parseInt(json[3], 16) * 17, parseInt(json[4], 16) * 17);
                    }
                    if (json.length === 7) {
                        return new Color(parseInt(json.substring(1, 3), 16), parseInt(json.substring(3, 5), 16), parseInt(json.substring(5, 7), 16));
                    }
                    if (json.length === 9) {
                        return new Color(parseInt(json.substring(1, 3), 16), parseInt(json.substring(3, 5), 16), parseInt(json.substring(5, 7), 16), parseInt(json.substring(7, 9), 16));
                    }
                }
                else if (json.startsWith('rgba') || json.startsWith('rgb')) {
                    const start = json.indexOf('(');
                    const end = json.lastIndexOf(')');
                    if (start === -1 || end === -1) {
                        throw 'No values specified for rgb/rgba function';
                    }
                    const numbers = json.substring(start + 1, end).split(',');
                    if (numbers.length === 3) {
                        return new Color(parseInt(numbers[0]), parseInt(numbers[1]), parseInt(numbers[2]));
                    }
                    if (numbers.length === 4) {
                        return new Color(parseInt(numbers[0]), parseInt(numbers[1]), parseInt(numbers[2]), parseFloat(numbers[3]) * 255);
                    }
                }
                return null;
            }
        }
        throw 'Unsupported format for color';
    }
    static toJson(obj) {
        return obj.raw;
    }
}
Color.BlackRgb = '#000000';
var BeamDirection;
(function (BeamDirection) {
    BeamDirection[BeamDirection["Up"] = 0] = "Up";
    BeamDirection[BeamDirection["Down"] = 1] = "Down";
})(BeamDirection || (BeamDirection = {}));
class AutomationCloner {
    static clone(original) {
        const clone = new Automation();
        clone.isLinear = original.isLinear;
        clone.type = original.type;
        clone.value = original.value;
        clone.ratioPosition = original.ratioPosition;
        clone.text = original.text;
        return clone;
    }
}
class GeneralMidi {
    static getValue(name) {
        if (!GeneralMidi._values) {
            GeneralMidi._values = new Map();
        }
        name = name.toLowerCase().replace(' ', '');
        return GeneralMidi._values.has(name) ? GeneralMidi._values.get(name) : 0;
    }
    static isPiano(program) {
        return program <= 7 || program >= 16 && program <= 23;
    }
    static isGuitar(program) {
        return program >= 24 && program <= 39 || program === 105 || program === 43;
    }
}
GeneralMidi._values = new Map([
    ['acousticgrandpiano', 0], ['brightacousticpiano', 1], ['electricgrandpiano', 2],
    ['honkytonkpiano', 3], ['electricpiano1', 4], ['electricpiano2', 5], ['harpsichord', 6],
    ['clavinet', 7], ['celesta', 8], ['glockenspiel', 9], ['musicbox', 10], ['vibraphone', 11],
    ['marimba', 12], ['xylophone', 13], ['tubularbells', 14], ['dulcimer', 15],
    ['drawbarorgan', 16], ['percussiveorgan', 17], ['rockorgan', 18], ['churchorgan', 19],
    ['reedorgan', 20], ['accordion', 21], ['harmonica', 22], ['tangoaccordion', 23],
    ['acousticguitarnylon', 24], ['acousticguitarsteel', 25], ['electricguitarjazz', 26],
    ['electricguitarclean', 27], ['electricguitarmuted', 28], ['overdrivenguitar', 29],
    ['distortionguitar', 30], ['guitarharmonics', 31], ['acousticbass', 32],
    ['electricbassfinger', 33], ['electricbasspick', 34], ['fretlessbass', 35],
    ['slapbass1', 36], ['slapbass2', 37], ['synthbass1', 38], ['synthbass2', 39],
    ['violin', 40], ['viola', 41], ['cello', 42], ['contrabass', 43], ['tremolostrings', 44],
    ['pizzicatostrings', 45], ['orchestralharp', 46], ['timpani', 47], ['stringensemble1', 48],
    ['stringensemble2', 49], ['synthstrings1', 50], ['synthstrings2', 51], ['choiraahs', 52],
    ['voiceoohs', 53], ['synthvoice', 54], ['orchestrahit', 55], ['trumpet', 56],
    ['trombone', 57], ['tuba', 58], ['mutedtrumpet', 59], ['frenchhorn', 60],
    ['brasssection', 61], ['synthbrass1', 62], ['synthbrass2', 63], ['sopranosax', 64],
    ['altosax', 65], ['tenorsax', 66], ['baritonesax', 67], ['oboe', 68], ['englishhorn', 69],
    ['bassoon', 70], ['clarinet', 71], ['piccolo', 72], ['flute', 73], ['recorder', 74],
    ['panflute', 75], ['blownbottle', 76], ['shakuhachi', 77], ['whistle', 78], ['ocarina', 79],
    ['lead1square', 80], ['lead2sawtooth', 81], ['lead3calliope', 82], ['lead4chiff', 83],
    ['lead5charang', 84], ['lead6voice', 85], ['lead7fifths', 86], ['lead8bassandlead', 87],
    ['pad1newage', 88], ['pad2warm', 89], ['pad3polysynth', 90], ['pad4choir', 91],
    ['pad5bowed', 92], ['pad6metallic', 93], ['pad7halo', 94], ['pad8sweep', 95],
    ['fx1rain', 96], ['fx2soundtrack', 97], ['fx3crystal', 98], ['fx4atmosphere', 99],
    ['fx5brightness', 100], ['fx6goblins', 101], ['fx7echoes', 102], ['fx8scifi', 103],
    ['sitar', 104], ['banjo', 105], ['shamisen', 106], ['koto', 107], ['kalimba', 108],
    ['bagpipe', 109], ['fiddle', 110], ['shanai', 111], ['tinklebell', 112], ['agogo', 113],
    ['steeldrums', 114], ['woodblock', 115], ['taikodrum', 116], ['melodictom', 117],
    ['synthdrum', 118], ['reversecymbal', 119], ['guitarfretnoise', 120], ['breathnoise', 121],
    ['seashore', 122], ['birdtweet', 123], ['telephonering', 124], ['helicopter', 125],
    ['applause', 126], ['gunshot', 127]
]);
class GpxImporter extends ScoreImporter {
    get name() {
        return 'Guitar Pro 6';
    }
    constructor() {
        super();
    }
    readScore() {
        console.log(this.name, 'Loading GPX filesystem');
        let fileSystem = new GpxFileSystem();
        fileSystem.fileFilter = s => {
            return s.endsWith('score.gpif') || s.endsWith('BinaryStylesheet') || s.endsWith('PartConfiguration');
        };
        fileSystem.load(this.data);
        console.log(this.name, 'GPX filesystem loaded');
        let xml = null;
        let binaryStylesheetData = null;
        let partConfigurationData = null;
        for (let entry of fileSystem.files) {
            switch (entry.fileName) {
                case 'score.gpif':
                    xml = IOHelper.toString(entry.data, this.settings.importer.encoding);
                    break;
                case 'BinaryStylesheet':
                    binaryStylesheetData = entry.data;
                    break;
                case 'PartConfiguration':
                    partConfigurationData = entry.data;
                    break;
            }
        }
        if (!xml) {
            throw new UnsupportedFormatError('No score.gpif found in GPX');
        }
        console.log(this.name, 'Start Parsing score.gpif');
        let gpifParser = new GpifParser();
        gpifParser.parseXml(xml, this.settings);
        console.log(this.name, 'score.gpif parsed');
        let score = gpifParser.score;
        if (binaryStylesheetData) {
            console.log(this.name, 'Start Parsing BinaryStylesheet');
            let binaryStylesheet = new BinaryStylesheet(binaryStylesheetData);
            binaryStylesheet.apply(score);
            console.log(this.name, 'BinaryStylesheet parsed');
        }
        if (partConfigurationData) {
            console.log(this.name, 'Start Parsing Part Configuration');
            let partConfiguration = new PartConfiguration(partConfigurationData);
            partConfiguration.apply(score);
            console.log(this.name, 'Part Configuration parsed');
        }
        return score;
    }
}
class GpxFile {
    constructor() {
        this.fileName = '';
        this.fileSize = 0;
        this.data = null;
    }
}
class GpxFileSystem {
    constructor() {
        this.files = [];
        this.files = [];
        this.fileFilter = s => {
            return true;
        };
    }
    load(s) {
        let src = new BitReader(s);
        this.readBlock(src);
    }
    readHeader(src) {
        return this.getString(src.readBytes(4), 0, 4);
    }
    decompress(src, skipHeader = false) {
        let uncompressed = ByteBuffer.empty();
        let buffer;
        let expectedLength = this.getInteger(src.readBytes(4), 0);
        try {
            while (uncompressed.length < expectedLength) {
                let flag = src.readBits(1);
                if (flag === 1) {
                    let wordSize = src.readBits(4);
                    let offset = src.readBitsReversed(wordSize);
                    let size = src.readBitsReversed(wordSize);
                    let sourcePosition = uncompressed.length - offset;
                    let toRead = Math.min(offset, size);
                    buffer = uncompressed.getBuffer();
                    uncompressed.write(buffer, sourcePosition, toRead);
                }
                else {
                    let size = src.readBitsReversed(2);
                    for (let i = 0; i < size; i++) {
                        uncompressed.writeByte(src.readByte());
                    }
                }
            }
        }
        catch (e) {
            if (!(e instanceof EndOfReaderError)) {
                throw e;
            }
        }
        buffer = uncompressed.getBuffer();
        let resultOffset = skipHeader ? 4 : 0;
        let resultSize = uncompressed.length - resultOffset;
        let result = new Uint8Array(resultSize);
        let count = resultSize;
        result.set(buffer.subarray(resultOffset, resultOffset + count), 0);
        return result;
    }
    readBlock(data) {
        let header = this.readHeader(data);
        if (header === 'BCFZ') {
            this.readUncompressedBlock(this.decompress(data, true));
        }
        else if (header === 'BCFS') {
            this.readUncompressedBlock(data.readAll());
        }
        else {
            throw new UnsupportedFormatError('Unsupported format');
        }
    }
    readUncompressedBlock(data) {
        let sectorSize = 0x1000;
        let offset = sectorSize;
        while (offset + 3 < data.length) {
            let entryType = this.getInteger(data, offset);
            if (entryType === 2) {
                let file = new GpxFile();
                file.fileName = this.getString(data, offset + 0x04, 127);
                file.fileSize = this.getInteger(data, offset + 0x8c);
                let storeFile = !this.fileFilter || this.fileFilter(file.fileName);
                if (storeFile) {
                    this.files.push(file);
                }
                let dataPointerOffset = offset + 0x94;
                let sector = 0;
                let sectorCount = 0;
                let fileData = storeFile ? ByteBuffer.withCapacity(file.fileSize) : null;
                while (true) {
                    sector = this.getInteger(data, dataPointerOffset + 4 * sectorCount++);
                    if (sector !== 0) {
                        offset = sector * sectorSize;
                        if (storeFile) {
                            fileData.write(data, offset, sectorSize);
                        }
                    }
                    else {
                        break;
                    }
                }
                if (storeFile) {
                    file.data = new Uint8Array(Math.min(file.fileSize, fileData.length));
                    let raw = fileData.toArray();
                    file.data.set(raw.subarray(0, 0 + file.data.length), 0);
                }
            }
            offset += sectorSize;
        }
    }
    getString(data, offset, length) {
        let buf = '';
        for (let i = 0; i < length; i++) {
            let code = data[offset + i] & 0xff;
            if (code === 0) {
                break;
            }
            buf += String.fromCharCode(code);
        }
        return buf;
    }
    getInteger(data, offset) {
        return (data[offset + 3] << 24) | (data[offset + 2] << 16) | (data[offset + 1] << 8) | data[offset];
    }
}
GpxFileSystem.HeaderBcFs = 'BCFS';
GpxFileSystem.HeaderBcFz = 'BCFZ';
GpxFileSystem.ScoreGpif = 'score.gpif';
GpxFileSystem.BinaryStylesheet = 'BinaryStylesheet';
GpxFileSystem.PartConfiguration = 'PartConfiguration';
class BitReader {
    constructor(source) {
        this._currentByte = 0;
        this._position = BitReader.ByteSize;
        this._source = source;
    }
    readByte() {
        return this.readBits(8);
    }
    readBytes(count) {
        const bytes = new Uint8Array(count);
        for (let i = 0; i < count; i++) {
            bytes[i] = this.readByte() & 0xff;
        }
        return bytes;
    }
    readBits(count) {
        let bits = 0;
        let i = count - 1;
        while (i >= 0) {
            bits = bits | (this.readBit() << i);
            i--;
        }
        return bits;
    }
    readBitsReversed(count) {
        let bits = 0;
        for (let i = 0; i < count; i++) {
            bits = bits | (this.readBit() << i);
        }
        return bits;
    }
    readBit() {
        if (this._position >= 8) {
            this._currentByte = this._source.readByte();
            if (this._currentByte === -1) {
                throw new EndOfReaderError();
            }
            this._position = 0;
        }
        const value = (this._currentByte >> (BitReader.ByteSize - this._position - 1)) & 0x01;
        this._position++;
        return value;
    }
    readAll() {
        let all = ByteBuffer.empty();
        try {
            while (true) {
                all.writeByte(this.readByte() & 0xff);
            }
        }
        catch (e) {
            if (!(e instanceof EndOfReaderError)) {
                throw e;
            }
        }
        return all.toArray();
    }
}
BitReader.ByteSize = 8;
class UnsupportedFormatError {
    constructor(message = null, inner = null) {
    }
}
class GpifRhythm {
    constructor() {
        this.id = '';
        this.dots = 0;
        this.tupletDenominator = -1;
        this.tupletNumerator = -1;
        this.value = Duration.Quarter;
    }
}
class GpifSound {
    constructor() {
        this.name = '';
        this.path = '';
        this.role = '';
        this.program = 0;
    }
    get uniqueId() {
        return this.path + ';' + this.name + ';' + this.role;
    }
}
class GpifParser {
    constructor() {
        this._hasAnacrusis = false;
        this._skipApplyLyrics = false;
    }
    parseXml(xml, settings) {
        this._masterTrackAutomations = new Map();
        this._automationsPerTrackIdAndBarIndex = new Map();
        this._tracksMapping = [];
        this._tracksById = new Map();
        this._masterBars = [];
        this._barsOfMasterBar = [];
        this._voicesOfBar = new Map();
        this._barsById = new Map();
        this._voiceById = new Map();
        this._beatsOfVoice = new Map();
        this._beatById = new Map();
        this._rhythmOfBeat = new Map();
        this._rhythmById = new Map();
        this._notesOfBeat = new Map();
        this._noteById = new Map();
        this._tappedNotes = new Map();
        this._lyricsByTrack = new Map();
        this._soundsByTrack = new Map();
        this._skipApplyLyrics = false;
        let dom = new XmlDocument();
        try {
            dom.parse(xml);
        }
        catch (e) {
            throw new UnsupportedFormatError('Could not parse XML', e);
        }
        this.parseDom(dom);
        this.buildModel();
        this.score.finish(settings);
        if (!this._skipApplyLyrics && this._lyricsByTrack.size > 0) {
            for (const [t, lyrics] of this._lyricsByTrack) {
                let track = this._tracksById.get(t);
                track.applyLyrics(lyrics);
            }
        }
    }
    parseDom(dom) {
        let root = dom.firstElement;
        if (!root) {
            return;
        }
        if (root.localName === 'GPIF') {
            this.score = new Score();
            for (let n of root.childNodes) {
                if (n.nodeType === XmlNodeType.Element) {
                    switch (n.localName) {
                        case 'Score':
                            this.parseScoreNode(n);
                            break;
                        case 'MasterTrack':
                            this.parseMasterTrackNode(n);
                            break;
                        case 'Tracks':
                            this.parseTracksNode(n);
                            break;
                        case 'MasterBars':
                            this.parseMasterBarsNode(n);
                            break;
                        case 'Bars':
                            this.parseBars(n);
                            break;
                        case 'Voices':
                            this.parseVoices(n);
                            break;
                        case 'Beats':
                            this.parseBeats(n);
                            break;
                        case 'Notes':
                            this.parseNotes(n);
                            break;
                        case 'Rhythms':
                            this.parseRhythms(n);
                            break;
                    }
                }
            }
        }
        else {
            throw new UnsupportedFormatError('Root node of XML was not GPIF');
        }
    }
    parseScoreNode(element) {
        for (let c of element.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Title':
                        this.score.title = c.firstChild.innerText;
                        break;
                    case 'SubTitle':
                        this.score.subTitle = c.firstChild.innerText;
                        break;
                    case 'Artist':
                        this.score.artist = c.firstChild.innerText;
                        break;
                    case 'Album':
                        this.score.album = c.firstChild.innerText;
                        break;
                    case 'Words':
                        this.score.words = c.firstChild.innerText;
                        break;
                    case 'Music':
                        this.score.music = c.firstChild.innerText;
                        break;
                    case 'WordsAndMusic':
                        if (c.firstChild && c.firstChild.innerText !== '') {
                            let wordsAndMusic = c.firstChild.innerText;
                            if (wordsAndMusic && !this.score.words) {
                                this.score.words = wordsAndMusic;
                            }
                            if (wordsAndMusic && !this.score.music) {
                                this.score.music = wordsAndMusic;
                            }
                        }
                        break;
                    case 'Copyright':
                        this.score.copyright = c.firstChild.innerText;
                        break;
                    case 'Tabber':
                        this.score.tab = c.firstChild.innerText;
                        break;
                    case 'Instructions':
                        this.score.instructions = c.firstChild.innerText;
                        break;
                    case 'Notices':
                        this.score.notices = c.firstChild.innerText;
                        break;
                    case 'ScoreSystemsDefaultLayout':
                        this.score.defaultSystemsLayout = parseInt(c.innerText);
                        break;
                    case 'ScoreSystemsLayout':
                        this.score.systemsLayout = c.innerText.split(' ').map(i => parseInt(i));
                        break;
                }
            }
        }
    }
    parseMasterTrackNode(node) {
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Automations':
                        this.parseAutomations(c, this._masterTrackAutomations, null);
                        break;
                    case 'Tracks':
                        this._tracksMapping = c.innerText.split(' ');
                        break;
                    case 'Anacrusis':
                        this._hasAnacrusis = true;
                        break;
                }
            }
        }
    }
    parseAutomations(node, automations, sounds) {
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Automation':
                        this.parseAutomation(c, automations, sounds);
                        break;
                }
            }
        }
    }
    parseAutomation(node, automations, sounds) {
        let type = null;
        let isLinear = false;
        let barIndex = -1;
        let ratioPosition = 0;
        let numberValue = 0;
        let textValue = null;
        let reference = 0;
        let text = null;
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Type':
                        type = c.innerText;
                        break;
                    case 'Linear':
                        isLinear = c.innerText.toLowerCase() === 'true';
                        break;
                    case 'Bar':
                        barIndex = parseInt(c.innerText);
                        break;
                    case 'Position':
                        ratioPosition = parseFloat(c.innerText);
                        break;
                    case 'Value':
                        if (c.firstElement && c.firstElement.nodeType === XmlNodeType.CDATA) {
                            textValue = c.innerText;
                        }
                        else {
                            let parts = c.innerText.split(' ');
                            if (parts.length === 1) {
                                numberValue = parseFloat(parts[0]);
                                reference = 1;
                            }
                            else {
                                numberValue = parseFloat(parts[0]);
                                reference = parseInt(parts[1]);
                            }
                        }
                        break;
                    case 'Text':
                        text = c.innerText;
                        break;
                }
            }
        }
        if (!type) {
            return;
        }
        let automation = null;
        switch (type) {
            case 'Tempo':
                automation = Automation.buildTempoAutomation(isLinear, ratioPosition, numberValue, reference);
                break;
            case 'Sound':
                if (textValue && sounds && sounds.has(textValue)) {
                    automation = Automation.buildInstrumentAutomation(isLinear, ratioPosition, sounds.get(textValue).program);
                }
                break;
        }
        if (automation) {
            if (text) {
                automation.text = text;
            }
            if (barIndex >= 0) {
                if (!automations.has(barIndex)) {
                    automations.set(barIndex, []);
                }
                automations.get(barIndex).push(automation);
            }
        }
    }
    parseTracksNode(node) {
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Track':
                        this.parseTrack(c);
                        break;
                }
            }
        }
    }
    parseTrack(node) {
        this._articulationByName = new Map();
        let track = new Track();
        track.ensureStaveCount(1);
        let staff = track.staves[0];
        staff.showStandardNotation = true;
        let trackId = node.getAttribute('id');
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Name':
                        track.trackName = c.innerText;
                        break;
                    case 'Color':
                        let parts = c.innerText.split(' ');
                        if (parts.length >= 3) {
                            let r = parseInt(parts[0]);
                            let g = parseInt(parts[1]);
                            let b = parseInt(parts[2]);
                            track.color = new Color(r, g, b, 0xff);
                        }
                        break;
                    case 'Instrument':
                        let instrumentName = c.getAttribute('ref');
                        if (instrumentName.endsWith('-gs') || instrumentName.endsWith('GrandStaff')) {
                            track.ensureStaveCount(2);
                            track.staves[1].showStandardNotation = true;
                        }
                        break;
                    case 'InstrumentSet':
                        this.parseInstrumentSet(track, c);
                        break;
                    case 'NotationPatch':
                        this.parseNotationPatch(track, c);
                        break;
                    case 'ShortName':
                        track.shortName = c.innerText;
                        break;
                    case 'SystemsDefautLayout':
                        track.defaultSystemsLayout = parseInt(c.innerText);
                        break;
                    case 'SystemsLayout':
                        track.systemsLayout = c.innerText.split(' ').map(i => parseInt(i));
                        break;
                    case 'Lyrics':
                        this.parseLyrics(trackId, c);
                        break;
                    case 'Properties':
                        this.parseTrackProperties(track, c);
                        break;
                    case 'GeneralMidi':
                    case 'MidiConnection':
                    case 'MIDISettings':
                        this.parseGeneralMidi(track, c);
                        break;
                    case 'Sounds':
                        this.parseSounds(trackId, track, c);
                        break;
                    case 'PlaybackState':
                        let state = c.innerText;
                        track.playbackInfo.isSolo = state === 'Solo';
                        track.playbackInfo.isMute = state === 'Mute';
                        break;
                    case 'PartSounding':
                        this.parsePartSounding(track, c);
                        break;
                    case 'Staves':
                        this.parseStaves(track, c);
                        break;
                    case 'Transpose':
                        this.parseTranspose(track, c);
                        break;
                    case 'RSE':
                        this.parseRSE(track, c);
                        break;
                    case 'Automations':
                        this.parseTrackAutomations(trackId, c);
                        break;
                }
            }
        }
        this._tracksById.set(trackId, track);
    }
    parseTrackAutomations(trackId, c) {
        const trackAutomations = new Map();
        this._automationsPerTrackIdAndBarIndex.set(trackId, trackAutomations);
        this.parseAutomations(c, trackAutomations, this._soundsByTrack.get(trackId));
    }
    parseNotationPatch(track, node) {
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'LineCount':
                        const lineCount = parseInt(c.innerText);
                        for (let staff of track.staves) {
                            staff.standardNotationLineCount = lineCount;
                        }
                        break;
                    case 'Elements':
                        this.parseElements(track, c);
                        break;
                }
            }
        }
    }
    parseInstrumentSet(track, node) {
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Type':
                        switch (c.innerText) {
                            case 'drumKit':
                                for (let staff of track.staves) {
                                    staff.isPercussion = true;
                                }
                                break;
                        }
                        if (c.innerText === 'drumKit') {
                            for (let staff of track.staves) {
                                staff.isPercussion = true;
                            }
                        }
                        break;
                    case 'Elements':
                        this.parseElements(track, c);
                        break;
                    case 'LineCount':
                        const lineCount = parseInt(c.innerText);
                        for (let staff of track.staves) {
                            staff.standardNotationLineCount = lineCount;
                        }
                        break;
                }
            }
        }
    }
    parseElements(track, node) {
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Element':
                        this.parseElement(track, c);
                        break;
                }
            }
        }
    }
    parseElement(track, node) {
        const typeElement = node.findChildElement('Type');
        const type = typeElement ? typeElement.innerText : "";
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Name':
                    case 'Articulations':
                        this.parseArticulations(track, c, type);
                        break;
                }
            }
        }
    }
    parseArticulations(track, node, elementType) {
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Articulation':
                        this.parseArticulation(track, c, elementType);
                        break;
                }
            }
        }
    }
    parseArticulation(track, node, elementType) {
        const articulation = new InstrumentArticulation();
        articulation.outputMidiNumber = -1;
        articulation.elementType = elementType;
        let name = '';
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                const txt = c.innerText;
                switch (c.localName) {
                    case 'Name':
                        name = c.innerText;
                        break;
                    case 'OutputMidiNumber':
                        if (txt.length > 0) {
                            articulation.outputMidiNumber = parseInt(txt);
                        }
                        break;
                    case 'TechniqueSymbol':
                        articulation.techniqueSymbol = this.parseTechniqueSymbol(txt);
                        break;
                    case 'TechniquePlacement':
                        switch (txt) {
                            case 'outside':
                                articulation.techniqueSymbolPlacement = TextBaseline.Bottom;
                                break;
                            case 'inside':
                                articulation.techniqueSymbolPlacement = TextBaseline.Middle;
                                break;
                            case 'above':
                                articulation.techniqueSymbolPlacement = TextBaseline.Bottom;
                                break;
                            case 'below':
                                articulation.techniqueSymbolPlacement = TextBaseline.Top;
                                break;
                        }
                        break;
                    case 'Noteheads':
                        const noteHeadsTxt = txt.split(' ');
                        if (noteHeadsTxt.length >= 1) {
                            articulation.noteHeadDefault = this.parseNoteHead(noteHeadsTxt[0]);
                        }
                        if (noteHeadsTxt.length >= 2) {
                            articulation.noteHeadHalf = this.parseNoteHead(noteHeadsTxt[1]);
                        }
                        if (noteHeadsTxt.length >= 3) {
                            articulation.noteHeadWhole = this.parseNoteHead(noteHeadsTxt[2]);
                        }
                        if (articulation.noteHeadHalf == MusicFontSymbol.None) {
                            articulation.noteHeadHalf = articulation.noteHeadDefault;
                        }
                        if (articulation.noteHeadWhole == MusicFontSymbol.None) {
                            articulation.noteHeadWhole = articulation.noteHeadDefault;
                        }
                        break;
                    case 'StaffLine':
                        if (txt.length > 0) {
                            articulation.staffLine = parseInt(txt);
                        }
                        break;
                }
            }
        }
        if (articulation.outputMidiNumber !== -1) {
            track.percussionArticulations.push(articulation);
            if (name.length > 0) {
                this._articulationByName.set(name, articulation);
            }
        }
        else if (name.length > 0 && this._articulationByName.has(name)) {
            this._articulationByName.get(name).staffLine = articulation.staffLine;
        }
    }
    parseTechniqueSymbol(txt) {
        switch (txt) {
            case 'pictEdgeOfCymbal':
                return MusicFontSymbol.PictEdgeOfCymbal;
            case 'articStaccatoAbove':
                return MusicFontSymbol.ArticStaccatoAbove;
            case 'noteheadParenthesis':
                return MusicFontSymbol.NoteheadParenthesis;
            case 'stringsUpBow':
                return MusicFontSymbol.StringsUpBow;
            case 'stringsDownBow':
                return MusicFontSymbol.StringsDownBow;
            case 'guitarGolpe':
                return MusicFontSymbol.GuitarGolpe;
            default:
                return MusicFontSymbol.None;
        }
    }
    parseNoteHead(txt) {
        switch (txt) {
            case 'noteheadDoubleWholeSquare':
                return MusicFontSymbol.NoteheadDoubleWholeSquare;
            case 'noteheadDoubleWhole':
                return MusicFontSymbol.NoteheadDoubleWhole;
            case 'noteheadWhole':
                return MusicFontSymbol.NoteheadWhole;
            case 'noteheadHalf':
                return MusicFontSymbol.NoteheadHalf;
            case 'noteheadBlack':
                return MusicFontSymbol.NoteheadBlack;
            case 'noteheadNull':
                return MusicFontSymbol.NoteheadNull;
            case 'noteheadXOrnate':
                return MusicFontSymbol.NoteheadXOrnate;
            case 'noteheadTriangleUpWhole':
                return MusicFontSymbol.NoteheadTriangleUpWhole;
            case 'noteheadTriangleUpHalf':
                return MusicFontSymbol.NoteheadTriangleUpHalf;
            case 'noteheadTriangleUpBlack':
                return MusicFontSymbol.NoteheadTriangleUpBlack;
            case 'noteheadDiamondBlackWide':
                return MusicFontSymbol.NoteheadDiamondBlackWide;
            case 'noteheadDiamondWhite':
                return MusicFontSymbol.NoteheadDiamondWhite;
            case 'noteheadDiamondWhiteWide':
                return MusicFontSymbol.NoteheadDiamondWhiteWide;
            case 'noteheadCircleX':
                return MusicFontSymbol.NoteheadCircleX;
            case 'noteheadXWhole':
                return MusicFontSymbol.NoteheadXWhole;
            case 'noteheadXHalf':
                return MusicFontSymbol.NoteheadXHalf;
            case 'noteheadXBlack':
                return MusicFontSymbol.NoteheadXBlack;
            case 'noteheadParenthesis':
                return MusicFontSymbol.NoteheadParenthesis;
            case 'noteheadSlashedBlack2':
                return MusicFontSymbol.NoteheadSlashedBlack2;
            case 'noteheadCircleSlash':
                return MusicFontSymbol.NoteheadCircleSlash;
            case 'noteheadHeavyX':
                return MusicFontSymbol.NoteheadHeavyX;
            case 'noteheadHeavyXHat':
                return MusicFontSymbol.NoteheadHeavyXHat;
            default:
                console.log('GPIF', 'Unknown notehead symbol', txt);
                return MusicFontSymbol.None;
        }
    }
    parseStaves(track, node) {
        let staffIndex = 0;
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Staff':
                        track.ensureStaveCount(staffIndex + 1);
                        let staff = track.staves[staffIndex];
                        this.parseStaff(staff, c);
                        staffIndex++;
                        break;
                }
            }
        }
    }
    parseStaff(staff, node) {
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Properties':
                        this.parseStaffProperties(staff, c);
                        break;
                }
            }
        }
    }
    parseStaffProperties(staff, node) {
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Property':
                        this.parseStaffProperty(staff, c);
                        break;
                }
            }
        }
    }
    parseStaffProperty(staff, node) {
        let propertyName = node.getAttribute('name');
        switch (propertyName) {
            case 'Tuning':
                for (let c of node.childNodes) {
                    if (c.nodeType === XmlNodeType.Element) {
                        switch (c.localName) {
                            case 'Pitches':
                                let tuningParts = node.findChildElement('Pitches').innerText.split(' ');
                                let tuning = new Array(tuningParts.length);
                                for (let i = 0; i < tuning.length; i++) {
                                    tuning[tuning.length - 1 - i] = parseInt(tuningParts[i]);
                                }
                                staff.stringTuning.tunings = tuning;
                                break;
                            case 'Label':
                                staff.stringTuning.name = c.innerText;
                                break;
                        }
                    }
                }
                if (!staff.isPercussion) {
                    staff.showTablature = true;
                }
                break;
            case 'DiagramCollection':
            case 'ChordCollection':
                this.parseDiagramCollectionForStaff(staff, node);
                break;
            case 'CapoFret':
                let capo = parseInt(node.findChildElement('Fret').innerText);
                staff.capo = capo;
                break;
        }
    }
    parseLyrics(trackId, node) {
        let tracks = [];
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Line':
                        tracks.push(this.parseLyricsLine(c));
                        break;
                }
            }
        }
        this._lyricsByTrack.set(trackId, tracks);
    }
    parseLyricsLine(node) {
        let lyrics = new Lyrics();
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Offset':
                        lyrics.startBar = parseInt(c.innerText);
                        break;
                    case 'Text':
                        lyrics.text = c.innerText;
                        break;
                }
            }
        }
        return lyrics;
    }
    parseDiagramCollectionForTrack(track, node) {
        let items = node.findChildElement('Items');
        for (let c of items.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Item':
                        this.parseDiagramItemForTrack(track, c);
                        break;
                }
            }
        }
    }
    parseDiagramCollectionForStaff(staff, node) {
        let items = node.findChildElement('Items');
        for (let c of items.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Item':
                        this.parseDiagramItemForStaff(staff, c);
                        break;
                }
            }
        }
    }
    parseDiagramItemForTrack(track, node) {
        let chord = new Chord();
        let chordId = node.getAttribute('id');
        for (let staff of track.staves) {
            staff.addChord(chordId, chord);
        }
        this.parseDiagramItemForChord(chord, node);
    }
    parseDiagramItemForStaff(staff, node) {
        let chord = new Chord();
        let chordId = node.getAttribute('id');
        staff.addChord(chordId, chord);
        this.parseDiagramItemForChord(chord, node);
    }
    parseDiagramItemForChord(chord, node) {
        chord.name = node.getAttribute('name');
        let diagram = node.findChildElement('Diagram');
        if (!diagram) {
            chord.showDiagram = false;
            chord.showFingering = false;
            return;
        }
        let stringCount = parseInt(diagram.getAttribute('stringCount'));
        let baseFret = parseInt(diagram.getAttribute('baseFret'));
        chord.firstFret = baseFret + 1;
        for (let i = 0; i < stringCount; i++) {
            chord.strings.push(-1);
        }
        for (let c of diagram.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Fret':
                        let guitarString = parseInt(c.getAttribute('string'));
                        chord.strings[stringCount - guitarString - 1] = baseFret + parseInt(c.getAttribute('fret'));
                        break;
                    case 'Fingering':
                        let existingFingers = new Map();
                        for (let p of c.childNodes) {
                            if (p.nodeType === XmlNodeType.Element) {
                                switch (p.localName) {
                                    case 'Position':
                                        let finger = Fingers.Unknown;
                                        let fret = baseFret + parseInt(p.getAttribute('fret'));
                                        switch (p.getAttribute('finger')) {
                                            case 'Index':
                                                finger = Fingers.IndexFinger;
                                                break;
                                            case 'Middle':
                                                finger = Fingers.MiddleFinger;
                                                break;
                                            case 'Rank':
                                                finger = Fingers.AnnularFinger;
                                                break;
                                            case 'Pinky':
                                                finger = Fingers.LittleFinger;
                                                break;
                                            case 'Thumb':
                                                finger = Fingers.Thumb;
                                                break;
                                            case 'None':
                                                break;
                                        }
                                        if (finger !== Fingers.Unknown) {
                                            if (existingFingers.has(finger)) {
                                                chord.barreFrets.push(fret);
                                            }
                                            else {
                                                existingFingers.set(finger, true);
                                            }
                                        }
                                        break;
                                }
                            }
                        }
                        break;
                    case 'Property':
                        switch (c.getAttribute('name')) {
                            case 'ShowName':
                                chord.showName = c.getAttribute('value') === 'true';
                                break;
                            case 'ShowDiagram':
                                chord.showDiagram = c.getAttribute('value') === 'true';
                                break;
                            case 'ShowFingering':
                                chord.showFingering = c.getAttribute('value') === 'true';
                                break;
                        }
                        break;
                }
            }
        }
    }
    parseTrackProperties(track, node) {
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Property':
                        this.parseTrackProperty(track, c);
                        break;
                }
            }
        }
    }
    parseTrackProperty(track, node) {
        let propertyName = node.getAttribute('name');
        switch (propertyName) {
            case 'Tuning':
                let tuningParts = node.findChildElement('Pitches').innerText.split(' ');
                let tuning = new Array(tuningParts.length);
                for (let i = 0; i < tuning.length; i++) {
                    tuning[tuning.length - 1 - i] = parseInt(tuningParts[i]);
                }
                for (let staff of track.staves) {
                    staff.stringTuning.tunings = tuning;
                    staff.showStandardNotation = true;
                    staff.showTablature = true;
                }
                break;
            case 'DiagramCollection':
            case 'ChordCollection':
                this.parseDiagramCollectionForTrack(track, node);
                break;
            case 'CapoFret':
                let capo = parseInt(node.findChildElement('Fret').innerText);
                for (let staff of track.staves) {
                    staff.capo = capo;
                }
                break;
        }
    }
    parseGeneralMidi(track, node) {
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Program':
                        track.playbackInfo.program = parseInt(c.innerText);
                        break;
                    case 'Port':
                        track.playbackInfo.port = parseInt(c.innerText);
                        break;
                    case 'PrimaryChannel':
                        track.playbackInfo.primaryChannel = parseInt(c.innerText);
                        break;
                    case 'SecondaryChannel':
                        track.playbackInfo.secondaryChannel = parseInt(c.innerText);
                        break;
                }
            }
        }
        let isPercussion = node.getAttribute('table') === 'Percussion';
        if (isPercussion) {
            for (let staff of track.staves) {
                staff.isPercussion = true;
            }
        }
    }
    parseSounds(trackId, track, node) {
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Sound':
                        this.parseSound(trackId, track, c);
                        break;
                }
            }
        }
    }
    parseSound(trackId, track, node) {
        const sound = new GpifSound();
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Name':
                        sound.name = c.innerText;
                        break;
                    case 'Path':
                        sound.path = c.innerText;
                        break;
                    case 'Role':
                        sound.role = c.innerText;
                        break;
                    case 'MIDI':
                        this.parseSoundMidi(sound, c);
                        break;
                }
            }
        }
        if (sound.role === 'Factory' || track.playbackInfo.program === 0) {
            track.playbackInfo.program = sound.program;
        }
        if (!this._soundsByTrack.has(trackId)) {
            this._soundsByTrack.set(trackId, new Map());
        }
        this._soundsByTrack.get(trackId).set(sound.uniqueId, sound);
    }
    parseSoundMidi(sound, node) {
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Program':
                        sound.program = parseInt(c.innerText);
                        break;
                }
            }
        }
    }
    parsePartSounding(track, node) {
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'TranspositionPitch':
                        for (let staff of track.staves) {
                            staff.displayTranspositionPitch = parseInt(c.innerText);
                        }
                        break;
                }
            }
        }
    }
    parseTranspose(track, node) {
        let octave = 0;
        let chromatic = 0;
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Chromatic':
                        chromatic = parseInt(c.innerText);
                        break;
                    case 'Octave':
                        octave = parseInt(c.innerText);
                        break;
                }
            }
        }
        for (let staff of track.staves) {
            staff.displayTranspositionPitch = octave * 12 + chromatic;
        }
    }
    parseRSE(track, node) {
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'ChannelStrip':
                        this.parseChannelStrip(track, c);
                        break;
                }
            }
        }
    }
    parseChannelStrip(track, node) {
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Parameters':
                        this.parseChannelStripParameters(track, c);
                        break;
                }
            }
        }
    }
    parseChannelStripParameters(track, node) {
        if (node.firstChild && node.firstChild.value) {
            let parameters = node.firstChild.value.split(' ');
            if (parameters.length >= 12) {
                track.playbackInfo.balance = Math.floor(parseFloat(parameters[11]) * 16);
                track.playbackInfo.volume = Math.floor(parseFloat(parameters[12]) * 16);
            }
        }
    }
    parseMasterBarsNode(node) {
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'MasterBar':
                        this.parseMasterBar(c);
                        break;
                }
            }
        }
    }
    parseMasterBar(node) {
        let masterBar = new MasterBar();
        if (this._masterBars.length === 0 && this._hasAnacrusis) {
            masterBar.isAnacrusis = true;
        }
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Time':
                        let timeParts = c.innerText.split('/');
                        masterBar.timeSignatureNumerator = parseInt(timeParts[0]);
                        masterBar.timeSignatureDenominator = parseInt(timeParts[1]);
                        break;
                    case 'DoubleBar':
                        masterBar.isDoubleBar = true;
                        break;
                    case 'Section':
                        masterBar.section = new Section();
                        masterBar.section.marker = c.findChildElement('Letter').innerText;
                        masterBar.section.text = c.findChildElement('Text').innerText;
                        break;
                    case 'Repeat':
                        if (c.getAttribute('start').toLowerCase() === 'true') {
                            masterBar.isRepeatStart = true;
                        }
                        if (c.getAttribute('end').toLowerCase() === 'true' && c.getAttribute('count')) {
                            masterBar.repeatCount = parseInt(c.getAttribute('count'));
                        }
                        break;
                    case 'AlternateEndings':
                        let alternateEndings = c.innerText.split(' ');
                        let i = 0;
                        for (let k = 0; k < alternateEndings.length; k++) {
                            i = i | (1 << (-1 + parseInt(alternateEndings[k])));
                        }
                        masterBar.alternateEndings = i;
                        break;
                    case 'Bars':
                        this._barsOfMasterBar.push(c.innerText.split(' '));
                        break;
                    case 'TripletFeel':
                        switch (c.innerText) {
                            case 'NoTripletFeel':
                                masterBar.tripletFeel = TripletFeel.NoTripletFeel;
                                break;
                            case 'Triplet8th':
                                masterBar.tripletFeel = TripletFeel.Triplet8th;
                                break;
                            case 'Triplet16th':
                                masterBar.tripletFeel = TripletFeel.Triplet16th;
                                break;
                            case 'Dotted8th':
                                masterBar.tripletFeel = TripletFeel.Dotted8th;
                                break;
                            case 'Dotted16th':
                                masterBar.tripletFeel = TripletFeel.Dotted16th;
                                break;
                            case 'Scottish8th':
                                masterBar.tripletFeel = TripletFeel.Scottish8th;
                                break;
                            case 'Scottish16th':
                                masterBar.tripletFeel = TripletFeel.Scottish16th;
                                break;
                        }
                        break;
                    case 'Key':
                        masterBar.keySignature = parseInt(c.findChildElement('AccidentalCount').innerText);
                        let mode = c.findChildElement('Mode');
                        if (mode) {
                            switch (mode.innerText.toLowerCase()) {
                                case 'major':
                                    masterBar.keySignatureType = KeySignatureType.Major;
                                    break;
                                case 'minor':
                                    masterBar.keySignatureType = KeySignatureType.Minor;
                                    break;
                            }
                        }
                        break;
                    case 'Fermatas':
                        this.parseFermatas(masterBar, c);
                        break;
                    case "XProperties":
                        this.parseMasterBarXProperties(c, masterBar);
                        break;
                }
            }
        }
        this._masterBars.push(masterBar);
    }
    parseFermatas(masterBar, node) {
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Fermata':
                        this.parseFermata(masterBar, c);
                        break;
                }
            }
        }
    }
    parseFermata(masterBar, node) {
        let offset = 0;
        let fermata = new Fermata();
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Type':
                        switch (c.innerText) {
                            case 'Short':
                                fermata.type = FermataType.Short;
                                break;
                            case 'Medium':
                                fermata.type = FermataType.Medium;
                                break;
                            case 'Long':
                                fermata.type = FermataType.Long;
                                break;
                        }
                        break;
                    case 'Length':
                        fermata.length = parseFloat(c.innerText);
                        break;
                    case 'Offset':
                        let parts = c.innerText.split('/');
                        if (parts.length === 2) {
                            let numerator = parseInt(parts[0]);
                            let denominator = parseInt(parts[1]);
                            offset = ((numerator / denominator) * MidiUtils.QuarterTime) | 0;
                        }
                        break;
                }
            }
        }
        masterBar.addFermata(offset, fermata);
    }
    parseBars(node) {
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Bar':
                        this.parseBar(c);
                        break;
                }
            }
        }
    }
    parseBar(node) {
        let bar = new Bar();
        let barId = node.getAttribute('id');
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Voices':
                        this._voicesOfBar.set(barId, c.innerText.split(' '));
                        break;
                    case 'Clef':
                        switch (c.innerText) {
                            case 'Neutral':
                                bar.clef = Clef.Neutral;
                                break;
                            case 'G2':
                                bar.clef = Clef.G2;
                                break;
                            case 'F4':
                                bar.clef = Clef.F4;
                                break;
                            case 'C4':
                                bar.clef = Clef.C4;
                                break;
                            case 'C3':
                                bar.clef = Clef.C3;
                                break;
                        }
                        break;
                    case 'Ottavia':
                        switch (c.innerText) {
                            case '8va':
                                bar.clefOttava = Ottavia._8va;
                                break;
                            case '15ma':
                                bar.clefOttava = Ottavia._15ma;
                                break;
                            case '8vb':
                                bar.clefOttava = Ottavia._8vb;
                                break;
                            case '15mb':
                                bar.clefOttava = Ottavia._15mb;
                                break;
                        }
                        break;
                    case 'SimileMark':
                        switch (c.innerText) {
                            case 'Simple':
                                bar.simileMark = SimileMark.Simple;
                                break;
                            case 'FirstOfDouble':
                                bar.simileMark = SimileMark.FirstOfDouble;
                                break;
                            case 'SecondOfDouble':
                                bar.simileMark = SimileMark.SecondOfDouble;
                                break;
                        }
                        break;
                    case "XProperties":
                        this.parseBarXProperties(c, bar);
                        break;
                }
            }
        }
        this._barsById.set(barId, bar);
    }
    parseVoices(node) {
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Voice':
                        this.parseVoice(c);
                        break;
                }
            }
        }
    }
    parseVoice(node) {
        let voice = new Voice();
        let voiceId = node.getAttribute('id');
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Beats':
                        this._beatsOfVoice.set(voiceId, c.innerText.split(' '));
                        break;
                }
            }
        }
        this._voiceById.set(voiceId, voice);
    }
    parseBeats(node) {
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Beat':
                        this.parseBeat(c);
                        break;
                }
            }
        }
    }
    parseBeat(node) {
        let beat = new Beat();
        let beatId = node.getAttribute('id');
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Notes':
                        this._notesOfBeat.set(beatId, c.innerText.split(' '));
                        break;
                    case 'Rhythm':
                        this._rhythmOfBeat.set(beatId, c.getAttribute('ref'));
                        break;
                    case 'Fadding':
                        if (c.innerText === 'FadeIn') {
                            beat.fadeIn = true;
                        }
                        break;
                    case 'Tremolo':
                        switch (c.innerText) {
                            case '1/2':
                                beat.tremoloSpeed = Duration.Eighth;
                                break;
                            case '1/4':
                                beat.tremoloSpeed = Duration.Sixteenth;
                                break;
                            case '1/8':
                                beat.tremoloSpeed = Duration.ThirtySecond;
                                break;
                        }
                        break;
                    case 'Chord':
                        beat.chordId = c.innerText;
                        break;
                    case 'Hairpin':
                        switch (c.innerText) {
                            case 'Crescendo':
                                beat.crescendo = CrescendoType.Crescendo;
                                break;
                            case 'Decrescendo':
                                beat.crescendo = CrescendoType.Decrescendo;
                                break;
                        }
                        break;
                    case 'Arpeggio':
                        if (c.innerText === 'Up') {
                            beat.brushType = BrushType.ArpeggioUp;
                        }
                        else {
                            beat.brushType = BrushType.ArpeggioDown;
                        }
                        break;
                    case 'Properties':
                        this.parseBeatProperties(c, beat);
                        break;
                    case 'XProperties':
                        this.parseBeatXProperties(c, beat);
                        break;
                    case 'FreeText':
                        beat.text = c.innerText;
                        break;
                    case 'TransposedPitchStemOrientation':
                        switch (c.innerText) {
                            case 'Upward':
                                beat.preferredBeamDirection = BeamDirection.Up;
                                break;
                            case 'Downward':
                                beat.preferredBeamDirection = BeamDirection.Down;
                                break;
                        }
                        break;
                    case 'Dynamic':
                        switch (c.innerText) {
                            case 'PPP':
                                beat.dynamics = DynamicValue.PPP;
                                break;
                            case 'PP':
                                beat.dynamics = DynamicValue.PP;
                                break;
                            case 'P':
                                beat.dynamics = DynamicValue.P;
                                break;
                            case 'MP':
                                beat.dynamics = DynamicValue.MP;
                                break;
                            case 'MF':
                                beat.dynamics = DynamicValue.MF;
                                break;
                            case 'F':
                                beat.dynamics = DynamicValue.F;
                                break;
                            case 'FF':
                                beat.dynamics = DynamicValue.FF;
                                break;
                            case 'FFF':
                                beat.dynamics = DynamicValue.FFF;
                                break;
                        }
                        break;
                    case 'GraceNotes':
                        switch (c.innerText) {
                            case 'OnBeat':
                                beat.graceType = GraceType.OnBeat;
                                break;
                            case 'BeforeBeat':
                                beat.graceType = GraceType.BeforeBeat;
                                break;
                        }
                        break;
                    case 'Legato':
                        if (c.getAttribute('origin') === 'true') {
                            beat.isLegatoOrigin = true;
                        }
                        break;
                    case 'Whammy':
                        let whammyOrigin = new BendPoint(0, 0);
                        whammyOrigin.value = this.toBendValue(parseFloat(c.getAttribute('originValue')));
                        whammyOrigin.offset = this.toBendOffset(parseFloat(c.getAttribute('originOffset')));
                        beat.addWhammyBarPoint(whammyOrigin);
                        let whammyMiddle1 = new BendPoint(0, 0);
                        whammyMiddle1.value = this.toBendValue(parseFloat(c.getAttribute('middleValue')));
                        whammyMiddle1.offset = this.toBendOffset(parseFloat(c.getAttribute('middleOffset1')));
                        beat.addWhammyBarPoint(whammyMiddle1);
                        let whammyMiddle2 = new BendPoint(0, 0);
                        whammyMiddle2.value = this.toBendValue(parseFloat(c.getAttribute('middleValue')));
                        whammyMiddle2.offset = this.toBendOffset(parseFloat(c.getAttribute('middleOffset2')));
                        beat.addWhammyBarPoint(whammyMiddle2);
                        let whammyDestination = new BendPoint(0, 0);
                        whammyDestination.value = this.toBendValue(parseFloat(c.getAttribute('destinationValue')));
                        whammyDestination.offset = this.toBendOffset(parseFloat(c.getAttribute('destinationOffset')));
                        beat.addWhammyBarPoint(whammyDestination);
                        break;
                    case 'Ottavia':
                        switch (c.innerText) {
                            case '8va':
                                beat.ottava = Ottavia._8va;
                                break;
                            case '8vb':
                                beat.ottava = Ottavia._8vb;
                                break;
                            case '15ma':
                                beat.ottava = Ottavia._15ma;
                                break;
                            case '15mb':
                                beat.ottava = Ottavia._15mb;
                                break;
                        }
                        break;
                    case 'Lyrics':
                        beat.lyrics = this.parseBeatLyrics(c);
                        this._skipApplyLyrics = true;
                        break;
                }
            }
        }
        this._beatById.set(beatId, beat);
    }
    parseBeatLyrics(node) {
        const lines = [];
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Line':
                        lines.push(c.innerText);
                        break;
                }
            }
        }
        return lines;
    }
    parseBeatXProperties(node, beat) {
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'XProperty':
                        let id = c.getAttribute('id');
                        let value = 0;
                        switch (id) {
                            case '1124204545':
                                value = parseInt(c.findChildElement('Int').innerText);
                                beat.invertBeamDirection = value === 1;
                                break;
                            case '687935489':
                                value = parseInt(c.findChildElement('Int').innerText);
                                beat.brushDuration = value;
                                break;
                        }
                        break;
                }
            }
        }
    }
    parseBarXProperties(node, bar) {
        var _a;
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'XProperty':
                        const id = c.getAttribute('id');
                        switch (id) {
                            case '1124139520':
                                const childNode = (_a = c.findChildElement('Double')) !== null && _a !== void 0 ? _a : c.findChildElement('Float');
                                bar.displayScale = parseFloat(childNode.innerText);
                                break;
                        }
                        break;
                }
            }
        }
    }
    parseMasterBarXProperties(node, masterBar) {
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'XProperty':
                        const id = c.getAttribute('id');
                        switch (id) {
                            case '1124073984':
                                masterBar.displayScale = parseFloat(c.findChildElement('Double').innerText);
                                break;
                        }
                        break;
                }
            }
        }
    }
    parseBeatProperties(node, beat) {
        let isWhammy = false;
        let whammyOrigin = null;
        let whammyMiddleValue = null;
        let whammyMiddleOffset1 = null;
        let whammyMiddleOffset2 = null;
        let whammyDestination = null;
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Property':
                        let name = c.getAttribute('name');
                        switch (name) {
                            case 'Brush':
                                if (c.findChildElement('Direction').innerText === 'Up') {
                                    beat.brushType = BrushType.BrushUp;
                                }
                                else {
                                    beat.brushType = BrushType.BrushDown;
                                }
                                break;
                            case 'PickStroke':
                                if (c.findChildElement('Direction').innerText === 'Up') {
                                    beat.pickStroke = PickStroke.Up;
                                }
                                else {
                                    beat.pickStroke = PickStroke.Down;
                                }
                                break;
                            case 'Slapped':
                                if (c.findChildElement('Enable')) {
                                    beat.slap = true;
                                }
                                break;
                            case 'Popped':
                                if (c.findChildElement('Enable')) {
                                    beat.pop = true;
                                }
                                break;
                            case 'VibratoWTremBar':
                                switch (c.findChildElement('Strength').innerText) {
                                    case 'Wide':
                                        beat.vibrato = VibratoType.Wide;
                                        break;
                                    case 'Slight':
                                        beat.vibrato = VibratoType.Slight;
                                        break;
                                }
                                break;
                            case 'WhammyBar':
                                isWhammy = true;
                                break;
                            case 'WhammyBarExtend':
                                break;
                            case 'WhammyBarOriginValue':
                                if (!whammyOrigin) {
                                    whammyOrigin = new BendPoint(0, 0);
                                }
                                whammyOrigin.value = this.toBendValue(parseFloat(c.findChildElement('Float').innerText));
                                break;
                            case 'WhammyBarOriginOffset':
                                if (!whammyOrigin) {
                                    whammyOrigin = new BendPoint(0, 0);
                                }
                                whammyOrigin.offset = this.toBendOffset(parseFloat(c.findChildElement('Float').innerText));
                                break;
                            case 'WhammyBarMiddleValue':
                                whammyMiddleValue = this.toBendValue(parseFloat(c.findChildElement('Float').innerText));
                                break;
                            case 'WhammyBarMiddleOffset1':
                                whammyMiddleOffset1 = this.toBendOffset(parseFloat(c.findChildElement('Float').innerText));
                                break;
                            case 'WhammyBarMiddleOffset2':
                                whammyMiddleOffset2 = this.toBendOffset(parseFloat(c.findChildElement('Float').innerText));
                                break;
                            case 'WhammyBarDestinationValue':
                                if (!whammyDestination) {
                                    whammyDestination = new BendPoint(BendPoint.MaxPosition, 0);
                                }
                                whammyDestination.value = this.toBendValue(parseFloat(c.findChildElement('Float').innerText));
                                break;
                            case 'WhammyBarDestinationOffset':
                                if (!whammyDestination) {
                                    whammyDestination = new BendPoint(0, 0);
                                }
                                whammyDestination.offset = this.toBendOffset(parseFloat(c.findChildElement('Float').innerText));
                                break;
                        }
                        break;
                }
            }
        }
        if (isWhammy) {
            if (!whammyOrigin) {
                whammyOrigin = new BendPoint(0, 0);
            }
            if (!whammyDestination) {
                whammyDestination = new BendPoint(BendPoint.MaxPosition, 0);
            }
            beat.addWhammyBarPoint(whammyOrigin);
            if (whammyMiddleOffset1 && whammyMiddleValue) {
                beat.addWhammyBarPoint(new BendPoint(whammyMiddleOffset1, whammyMiddleValue));
            }
            if (whammyMiddleOffset2 && whammyMiddleValue) {
                beat.addWhammyBarPoint(new BendPoint(whammyMiddleOffset2, whammyMiddleValue));
            }
            if (!whammyMiddleOffset1 && !whammyMiddleOffset2 && whammyMiddleValue) {
                beat.addWhammyBarPoint(new BendPoint((BendPoint.MaxPosition / 2) | 0, whammyMiddleValue));
            }
            beat.addWhammyBarPoint(whammyDestination);
        }
    }
    parseNotes(node) {
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Note':
                        this.parseNote(c);
                        break;
                }
            }
        }
    }
    parseNote(node) {
        let note = new Note();
        let noteId = node.getAttribute('id');
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Properties':
                        this.parseNoteProperties(c, note, noteId);
                        break;
                    case 'AntiAccent':
                        if (c.innerText.toLowerCase() === 'normal') {
                            note.isGhost = true;
                        }
                        break;
                    case 'LetRing':
                        note.isLetRing = true;
                        break;
                    case 'Trill':
                        note.trillValue = parseInt(c.innerText);
                        note.trillSpeed = Duration.Sixteenth;
                        break;
                    case 'Accent':
                        let accentFlags = parseInt(c.innerText);
                        if ((accentFlags & 0x01) !== 0) {
                            note.isStaccato = true;
                        }
                        if ((accentFlags & 0x04) !== 0) {
                            note.accentuated = AccentuationType.Heavy;
                        }
                        if ((accentFlags & 0x08) !== 0) {
                            note.accentuated = AccentuationType.Normal;
                        }
                        break;
                    case 'Tie':
                        if (c.getAttribute('destination').toLowerCase() === 'true') {
                            note.isTieDestination = true;
                        }
                        break;
                    case 'Vibrato':
                        switch (c.innerText) {
                            case 'Slight':
                                note.vibrato = VibratoType.Slight;
                                break;
                            case 'Wide':
                                note.vibrato = VibratoType.Wide;
                                break;
                        }
                        break;
                    case 'LeftFingering':
                        note.isFingering = true;
                        switch (c.innerText) {
                            case 'P':
                                note.leftHandFinger = Fingers.Thumb;
                                break;
                            case 'I':
                                note.leftHandFinger = Fingers.IndexFinger;
                                break;
                            case 'M':
                                note.leftHandFinger = Fingers.MiddleFinger;
                                break;
                            case 'A':
                                note.leftHandFinger = Fingers.AnnularFinger;
                                break;
                            case 'C':
                                note.leftHandFinger = Fingers.LittleFinger;
                                break;
                        }
                        break;
                    case 'RightFingering':
                        note.isFingering = true;
                        switch (c.innerText) {
                            case 'P':
                                note.rightHandFinger = Fingers.Thumb;
                                break;
                            case 'I':
                                note.rightHandFinger = Fingers.IndexFinger;
                                break;
                            case 'M':
                                note.rightHandFinger = Fingers.MiddleFinger;
                                break;
                            case 'A':
                                note.rightHandFinger = Fingers.AnnularFinger;
                                break;
                            case 'C':
                                note.rightHandFinger = Fingers.LittleFinger;
                                break;
                        }
                        break;
                    case 'InstrumentArticulation':
                        note.percussionArticulation = parseInt(c.innerText);
                        break;
                }
            }
        }
        this._noteById.set(noteId, note);
    }
    parseNoteProperties(node, note, noteId) {
        let isBended = false;
        let bendOrigin = null;
        let bendMiddleValue = null;
        let bendMiddleOffset1 = null;
        let bendMiddleOffset2 = null;
        let bendDestination = null;
        let element = -1;
        let variation = -1;
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Property':
                        let name = c.getAttribute('name');
                        switch (name) {
                            case 'String':
                                note.string = parseInt(c.findChildElement('String').innerText) + 1;
                                break;
                            case 'Fret':
                                note.fret = parseInt(c.findChildElement('Fret').innerText);
                                break;
                            case 'Element':
                                element = parseInt(c.findChildElement('Element').innerText);
                                break;
                            case 'Variation':
                                variation = parseInt(c.findChildElement('Variation').innerText);
                                break;
                            case 'Tapped':
                                this._tappedNotes.set(noteId, true);
                                break;
                            case 'HarmonicType':
                                let htype = c.findChildElement('HType');
                                if (htype) {
                                    switch (htype.innerText) {
                                        case 'NoHarmonic':
                                            note.harmonicType = HarmonicType.None;
                                            break;
                                        case 'Natural':
                                            note.harmonicType = HarmonicType.Natural;
                                            break;
                                        case 'Artificial':
                                            note.harmonicType = HarmonicType.Artificial;
                                            break;
                                        case 'Pinch':
                                            note.harmonicType = HarmonicType.Pinch;
                                            break;
                                        case 'Tap':
                                            note.harmonicType = HarmonicType.Tap;
                                            break;
                                        case 'Semi':
                                            note.harmonicType = HarmonicType.Semi;
                                            break;
                                        case 'Feedback':
                                            note.harmonicType = HarmonicType.Feedback;
                                            break;
                                    }
                                }
                                break;
                            case 'HarmonicFret':
                                let hfret = c.findChildElement('HFret');
                                if (hfret) {
                                    note.harmonicValue = parseFloat(hfret.innerText);
                                }
                                break;
                            case 'Muted':
                                if (c.findChildElement('Enable')) {
                                    note.isDead = true;
                                }
                                break;
                            case 'PalmMuted':
                                if (c.findChildElement('Enable')) {
                                    note.isPalmMute = true;
                                }
                                break;
                            case 'Octave':
                                note.octave = parseInt(c.findChildElement('Number').innerText);
                                if (note.tone === -1) {
                                    note.tone = 0;
                                }
                                break;
                            case 'Tone':
                                note.tone = parseInt(c.findChildElement('Step').innerText);
                                break;
                            case 'ConcertPitch':
                                this.parseConcertPitch(c, note);
                                break;
                            case 'Bended':
                                isBended = true;
                                break;
                            case 'BendOriginValue':
                                if (!bendOrigin) {
                                    bendOrigin = new BendPoint(0, 0);
                                }
                                bendOrigin.value = this.toBendValue(parseFloat(c.findChildElement('Float').innerText));
                                break;
                            case 'BendOriginOffset':
                                if (!bendOrigin) {
                                    bendOrigin = new BendPoint(0, 0);
                                }
                                bendOrigin.offset = this.toBendOffset(parseFloat(c.findChildElement('Float').innerText));
                                break;
                            case 'BendMiddleValue':
                                bendMiddleValue = this.toBendValue(parseFloat(c.findChildElement('Float').innerText));
                                break;
                            case 'BendMiddleOffset1':
                                bendMiddleOffset1 = this.toBendOffset(parseFloat(c.findChildElement('Float').innerText));
                                break;
                            case 'BendMiddleOffset2':
                                bendMiddleOffset2 = this.toBendOffset(parseFloat(c.findChildElement('Float').innerText));
                                break;
                            case 'BendDestinationValue':
                                if (!bendDestination) {
                                    bendDestination = new BendPoint(BendPoint.MaxPosition, 0);
                                }
                                bendDestination.value = this.toBendValue(parseFloat(c.findChildElement('Float').innerText));
                                break;
                            case 'BendDestinationOffset':
                                if (!bendDestination) {
                                    bendDestination = new BendPoint(0, 0);
                                }
                                bendDestination.offset = this.toBendOffset(parseFloat(c.findChildElement('Float').innerText));
                                break;
                            case 'HopoOrigin':
                                if (c.findChildElement('Enable')) {
                                    note.isHammerPullOrigin = true;
                                }
                                break;
                            case 'HopoDestination':
                                break;
                            case 'LeftHandTapped':
                                note.isLeftHandTapped = true;
                                break;
                            case 'Slide':
                                let slideFlags = parseInt(c.findChildElement('Flags').innerText);
                                if ((slideFlags & 1) !== 0) {
                                    note.slideOutType = SlideOutType.Shift;
                                }
                                else if ((slideFlags & 2) !== 0) {
                                    note.slideOutType = SlideOutType.Legato;
                                }
                                else if ((slideFlags & 4) !== 0) {
                                    note.slideOutType = SlideOutType.OutDown;
                                }
                                else if ((slideFlags & 8) !== 0) {
                                    note.slideOutType = SlideOutType.OutUp;
                                }
                                if ((slideFlags & 16) !== 0) {
                                    note.slideInType = SlideInType.IntoFromBelow;
                                }
                                else if ((slideFlags & 32) !== 0) {
                                    note.slideInType = SlideInType.IntoFromAbove;
                                }
                                if ((slideFlags & 64) !== 0) {
                                    note.slideOutType = SlideOutType.PickSlideDown;
                                }
                                else if ((slideFlags & 128) !== 0) {
                                    note.slideOutType = SlideOutType.PickSlideUp;
                                }
                                break;
                        }
                        break;
                }
            }
        }
        if (isBended) {
            if (!bendOrigin) {
                bendOrigin = new BendPoint(0, 0);
            }
            if (!bendDestination) {
                bendDestination = new BendPoint(BendPoint.MaxPosition, 0);
            }
            note.addBendPoint(bendOrigin);
            if (bendMiddleOffset1 && bendMiddleValue) {
                note.addBendPoint(new BendPoint(bendMiddleOffset1, bendMiddleValue));
            }
            if (bendMiddleOffset2 && bendMiddleValue) {
                note.addBendPoint(new BendPoint(bendMiddleOffset2, bendMiddleValue));
            }
            if (!bendMiddleOffset1 && !bendMiddleOffset2 && bendMiddleValue) {
                note.addBendPoint(new BendPoint((BendPoint.MaxPosition / 2) | 0, bendMiddleValue));
            }
            note.addBendPoint(bendDestination);
        }
        if (element !== -1 && variation !== -1) {
            note.percussionArticulation = PercussionMapper.articulationFromElementVariation(element, variation);
        }
    }
    parseConcertPitch(node, note) {
        const pitch = node.findChildElement('Pitch');
        if (pitch) {
            for (let c of pitch.childNodes) {
                if (c.nodeType === XmlNodeType.Element) {
                    switch (c.localName) {
                        case 'Accidental':
                            switch (c.innerText) {
                                case 'x':
                                    note.accidentalMode = NoteAccidentalMode.ForceDoubleSharp;
                                    break;
                                case '#':
                                    note.accidentalMode = NoteAccidentalMode.ForceSharp;
                                    break;
                                case 'b':
                                    note.accidentalMode = NoteAccidentalMode.ForceFlat;
                                    break;
                                case 'bb':
                                    note.accidentalMode = NoteAccidentalMode.ForceDoubleFlat;
                                    break;
                            }
                            break;
                    }
                }
            }
        }
    }
    toBendValue(gpxValue) {
        return (gpxValue * GpifParser.BendPointValueFactor) | 0;
    }
    toBendOffset(gpxOffset) {
        return (gpxOffset * GpifParser.BendPointPositionFactor);
    }
    parseRhythms(node) {
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'Rhythm':
                        this.parseRhythm(c);
                        break;
                }
            }
        }
    }
    parseRhythm(node) {
        let rhythm = new GpifRhythm();
        let rhythmId = node.getAttribute('id');
        rhythm.id = rhythmId;
        for (let c of node.childNodes) {
            if (c.nodeType === XmlNodeType.Element) {
                switch (c.localName) {
                    case 'NoteValue':
                        switch (c.innerText) {
                            case 'Long':
                                rhythm.value = Duration.QuadrupleWhole;
                                break;
                            case 'DoubleWhole':
                                rhythm.value = Duration.DoubleWhole;
                                break;
                            case 'Whole':
                                rhythm.value = Duration.Whole;
                                break;
                            case 'Half':
                                rhythm.value = Duration.Half;
                                break;
                            case 'Quarter':
                                rhythm.value = Duration.Quarter;
                                break;
                            case 'Eighth':
                                rhythm.value = Duration.Eighth;
                                break;
                            case '16th':
                                rhythm.value = Duration.Sixteenth;
                                break;
                            case '32nd':
                                rhythm.value = Duration.ThirtySecond;
                                break;
                            case '64th':
                                rhythm.value = Duration.SixtyFourth;
                                break;
                            case '128th':
                                rhythm.value = Duration.OneHundredTwentyEighth;
                                break;
                            case '256th':
                                rhythm.value = Duration.TwoHundredFiftySixth;
                                break;
                        }
                        break;
                    case 'PrimaryTuplet':
                        rhythm.tupletNumerator = parseInt(c.getAttribute('num'));
                        rhythm.tupletDenominator = parseInt(c.getAttribute('den'));
                        break;
                    case 'AugmentationDot':
                        rhythm.dots = parseInt(c.getAttribute('count'));
                        break;
                }
            }
        }
        this._rhythmById.set(rhythmId, rhythm);
    }
    buildModel() {
        for (let i = 0, j = this._masterBars.length; i < j; i++) {
            let masterBar = this._masterBars[i];
            this.score.addMasterBar(masterBar);
        }
        for (let trackId of this._tracksMapping) {
            if (!trackId) {
                continue;
            }
            let track = this._tracksById.get(trackId);
            this.score.addTrack(track);
        }
        for (let barIds of this._barsOfMasterBar) {
            let staffIndex = 0;
            for (let barIndex = 0, trackIndex = 0; barIndex < barIds.length && trackIndex < this.score.tracks.length; barIndex++) {
                let barId = barIds[barIndex];
                if (barId !== GpifParser.InvalidId) {
                    let bar = this._barsById.get(barId);
                    let track = this.score.tracks[trackIndex];
                    let staff = track.staves[staffIndex];
                    staff.addBar(bar);
                    if (this._voicesOfBar.has(barId)) {
                        for (let voiceId of this._voicesOfBar.get(barId)) {
                            if (voiceId !== GpifParser.InvalidId) {
                                let voice = this._voiceById.get(voiceId);
                                bar.addVoice(voice);
                                if (this._beatsOfVoice.has(voiceId)) {
                                    for (let beatId of this._beatsOfVoice.get(voiceId)) {
                                        if (beatId !== GpifParser.InvalidId) {
                                            let beat = BeatCloner.clone(this._beatById.get(beatId));
                                            voice.addBeat(beat);
                                            let rhythmId = this._rhythmOfBeat.get(beatId);
                                            let rhythm = this._rhythmById.get(rhythmId);
                                            beat.duration = rhythm.value;
                                            beat.dots = rhythm.dots;
                                            beat.tupletNumerator = rhythm.tupletNumerator;
                                            beat.tupletDenominator = rhythm.tupletDenominator;
                                            if (this._notesOfBeat.has(beatId)) {
                                                for (let noteId of this._notesOfBeat.get(beatId)) {
                                                    if (noteId !== GpifParser.InvalidId) {
                                                        const note = NoteCloner.clone(this._noteById.get(noteId));
                                                        if (staff.isPercussion) {
                                                            note.fret = -1;
                                                            note.string = -1;
                                                        }
                                                        else {
                                                            note.percussionArticulation = -1;
                                                        }
                                                        beat.addNote(note);
                                                        if (this._tappedNotes.has(noteId)) {
                                                            beat.tap = true;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            else {
                                let voice = new Voice();
                                bar.addVoice(voice);
                                let beat = new Beat();
                                beat.isEmpty = true;
                                beat.duration = Duration.Quarter;
                                voice.addBeat(beat);
                            }
                        }
                    }
                    if (staffIndex === track.staves.length - 1) {
                        trackIndex++;
                        staffIndex = 0;
                    }
                    else {
                        staffIndex++;
                    }
                }
                else {
                    trackIndex++;
                }
            }
        }
        for (let trackId of this._tracksMapping) {
            if (!trackId) {
                continue;
            }
            let track = this._tracksById.get(trackId);
            let hasPercussion = false;
            for (const staff of track.staves) {
                if (staff.isPercussion) {
                    hasPercussion = true;
                    break;
                }
            }
            if (!hasPercussion) {
                track.percussionArticulations = [];
            }
            if (this._automationsPerTrackIdAndBarIndex.has(trackId)) {
                const trackAutomations = this._automationsPerTrackIdAndBarIndex.get(trackId);
                for (const [barNumber, automations] of trackAutomations) {
                    if (track.staves.length > 0 && barNumber < track.staves[0].bars.length) {
                        const bar = track.staves[0].bars[barNumber];
                        if (bar.voices.length > 0 && bar.voices[0].beats.length > 0) {
                            const beat = bar.voices[0].beats[0];
                            for (const a of automations) {
                                beat.automations.push(a);
                            }
                        }
                    }
                }
            }
        }
        for (const [barNumber, automations] of this._masterTrackAutomations) {
            let masterBar = this.score.masterBars[barNumber];
            for (let i = 0, j = automations.length; i < j; i++) {
                let automation = automations[i];
                if (automation.type === AutomationType.Tempo) {
                    if (barNumber === 0) {
                        this.score.tempo = automation.value | 0;
                        if (automation.text) {
                            this.score.tempoLabel = automation.text;
                        }
                    }
                    masterBar.tempoAutomation = automation;
                }
            }
        }
    }
}
GpifParser.InvalidId = '-1';
GpifParser.BendPointPositionFactor = BendPoint.MaxPosition / 100.0;
GpifParser.BendPointValueFactor = 1 / 25.0;
var XmlNodeType;
(function (XmlNodeType) {
    XmlNodeType[XmlNodeType["None"] = 0] = "None";
    XmlNodeType[XmlNodeType["Element"] = 1] = "Element";
    XmlNodeType[XmlNodeType["Text"] = 2] = "Text";
    XmlNodeType[XmlNodeType["CDATA"] = 3] = "CDATA";
    XmlNodeType[XmlNodeType["Document"] = 4] = "Document";
    XmlNodeType[XmlNodeType["DocumentType"] = 5] = "DocumentType";
})(XmlNodeType || (XmlNodeType = {}));
class XmlNode {
    constructor() {
        this.nodeType = XmlNodeType.None;
        this.localName = null;
        this.value = null;
        this.childNodes = [];
        this.attributes = new Map();
        this.firstChild = null;
        this.firstElement = null;
    }
    addChild(node) {
        this.childNodes.push(node);
        this.firstChild = node;
        if (node.nodeType === XmlNodeType.Element || node.nodeType === XmlNodeType.CDATA) {
            this.firstElement = node;
        }
    }
    getAttribute(name) {
        if (this.attributes.has(name)) {
            return this.attributes.get(name);
        }
        return '';
    }
    getElementsByTagName(name, recursive = false) {
        let tags = [];
        this.searchElementsByTagName(this.childNodes, tags, name, recursive);
        return tags;
    }
    searchElementsByTagName(all, result, name, recursive = false) {
        for (let c of all) {
            if (c && c.nodeType === XmlNodeType.Element && c.localName === name) {
                result.push(c);
            }
            if (recursive) {
                this.searchElementsByTagName(c.childNodes, result, name, true);
            }
        }
    }
    findChildElement(name) {
        for (let c of this.childNodes) {
            if (c && c.nodeType === XmlNodeType.Element && c.localName === name) {
                return c;
            }
        }
        return null;
    }
    addElement(name) {
        const newNode = new XmlNode();
        newNode.nodeType = XmlNodeType.Element;
        newNode.localName = name;
        this.addChild(newNode);
        return newNode;
    }
    get innerText() {
        var _a, _b;
        if (this.nodeType === XmlNodeType.Element || this.nodeType === XmlNodeType.Document) {
            if (this.firstElement && this.firstElement.nodeType === XmlNodeType.CDATA) {
                return this.firstElement.innerText;
            }
            let txt = '';
            for (let c of this.childNodes) {
                txt += (_a = c.innerText) === null || _a === void 0 ? void 0 : _a.toString();
            }
            let s = txt;
            return s.trim();
        }
        return (_b = this.value) !== null && _b !== void 0 ? _b : '';
    }
    set innerText(value) {
        const textNode = new XmlNode();
        textNode.nodeType = XmlNodeType.Text;
        textNode.value = value;
        this.childNodes = [textNode];
    }
    setCData(s) {
        const textNode = new XmlNode();
        textNode.nodeType = XmlNodeType.CDATA;
        textNode.value = s;
        this.childNodes = [textNode];
    }
}
class XmlDocument extends XmlNode {
    constructor() {
        super();
        this.nodeType = XmlNodeType.Document;
    }
    parse(xml) {
        XmlParser.parse(xml, 0, this);
    }
    toString() {
        return this.toFormattedString();
    }
    toFormattedString(indention = '', xmlHeader = false) {
        return XmlWriter.write(this, indention, xmlHeader);
    }
}
var XmlState;
(function (XmlState) {
    XmlState[XmlState["IgnoreSpaces"] = 0] = "IgnoreSpaces";
    XmlState[XmlState["Begin"] = 1] = "Begin";
    XmlState[XmlState["BeginNode"] = 2] = "BeginNode";
    XmlState[XmlState["TagName"] = 3] = "TagName";
    XmlState[XmlState["Body"] = 4] = "Body";
    XmlState[XmlState["AttribName"] = 5] = "AttribName";
    XmlState[XmlState["Equals"] = 6] = "Equals";
    XmlState[XmlState["AttvalBegin"] = 7] = "AttvalBegin";
    XmlState[XmlState["AttribVal"] = 8] = "AttribVal";
    XmlState[XmlState["Childs"] = 9] = "Childs";
    XmlState[XmlState["Close"] = 10] = "Close";
    XmlState[XmlState["WaitEnd"] = 11] = "WaitEnd";
    XmlState[XmlState["WaitEndRet"] = 12] = "WaitEndRet";
    XmlState[XmlState["Pcdata"] = 13] = "Pcdata";
    XmlState[XmlState["Header"] = 14] = "Header";
    XmlState[XmlState["Comment"] = 15] = "Comment";
    XmlState[XmlState["Doctype"] = 16] = "Doctype";
    XmlState[XmlState["Cdata"] = 17] = "Cdata";
    XmlState[XmlState["Escape"] = 18] = "Escape";
})(XmlState || (XmlState = {}));
class XmlParser {
    static parse(str, p, parent) {
        var _a;
        let c = str.charCodeAt(p);
        let state = XmlState.Begin;
        let next = XmlState.Begin;
        let start = 0;
        let buf = '';
        let escapeNext = XmlState.Begin;
        let xml = null;
        let aname = null;
        let nbrackets = 0;
        let attrValQuote = 0;
        while (p < str.length) {
            c = str.charCodeAt(p);
            switch (state) {
                case XmlState.IgnoreSpaces:
                    switch (c) {
                        case XmlParser.CharCodeLF:
                        case XmlParser.CharCodeCR:
                        case XmlParser.CharCodeTab:
                        case XmlParser.CharCodeSpace:
                            break;
                        default:
                            state = next;
                            continue;
                    }
                    break;
                case XmlState.Begin:
                    switch (c) {
                        case XmlParser.CharCodeLowerThan:
                            state = XmlState.IgnoreSpaces;
                            next = XmlState.BeginNode;
                            break;
                        default:
                            start = p;
                            state = XmlState.Pcdata;
                            continue;
                    }
                    break;
                case XmlState.Pcdata:
                    if (c === XmlParser.CharCodeLowerThan) {
                        buf += str.substr(start, p - start);
                        let child = new XmlNode();
                        child.nodeType = XmlNodeType.Text;
                        child.value = buf;
                        buf = '';
                        parent.addChild(child);
                        state = XmlState.IgnoreSpaces;
                        next = XmlState.BeginNode;
                    }
                    else if (c === XmlParser.CharCodeAmp) {
                        buf += str.substr(start, p - start);
                        state = XmlState.Escape;
                        escapeNext = XmlState.Pcdata;
                        start = p + 1;
                    }
                    break;
                case XmlState.Cdata:
                    if (c === XmlParser.CharCodeBrackedClose &&
                        str.charCodeAt(p + 1) === XmlParser.CharCodeBrackedClose &&
                        str.charCodeAt(p + 2) === XmlParser.CharCodeGreaterThan) {
                        let child = new XmlNode();
                        child.nodeType = XmlNodeType.CDATA;
                        child.value = str.substr(start, p - start);
                        parent.addChild(child);
                        p += 2;
                        state = XmlState.Begin;
                    }
                    break;
                case XmlState.BeginNode:
                    switch (c) {
                        case XmlParser.CharCodeExclamation:
                            if (str.charCodeAt(p + 1) === XmlParser.CharCodeBrackedOpen) {
                                p += 2;
                                if (str.substr(p, 6).toUpperCase() !== 'CDATA[') {
                                    throw new XmlError('Expected <![CDATA[', str, p);
                                }
                                p += 5;
                                state = XmlState.Cdata;
                                start = p + 1;
                            }
                            else if (str.charCodeAt(p + 1) === XmlParser.CharCodeUpperD ||
                                str.charCodeAt(p + 1) === XmlParser.CharCodeLowerD) {
                                if (str.substr(p + 2, 6).toUpperCase() !== 'OCTYPE') {
                                    throw new XmlError('Expected <!DOCTYPE', str, p);
                                }
                                p += 8;
                                state = XmlState.Doctype;
                                start = p + 1;
                            }
                            else if (str.charCodeAt(p + 1) !== XmlParser.CharCodeMinus ||
                                str.charCodeAt(p + 2) !== XmlParser.CharCodeMinus) {
                                throw new XmlError('Expected <!--', str, p);
                            }
                            else {
                                p += 2;
                                state = XmlState.Comment;
                                start = p + 1;
                            }
                            break;
                        case XmlParser.CharCodeQuestion:
                            state = XmlState.Header;
                            start = p;
                            break;
                        case XmlParser.CharCodeSlash:
                            if (!parent) {
                                throw new XmlError('Expected node name', str, p);
                            }
                            start = p + 1;
                            state = XmlState.IgnoreSpaces;
                            next = XmlState.Close;
                            break;
                        default:
                            state = XmlState.TagName;
                            start = p;
                            continue;
                    }
                    break;
                case XmlState.TagName:
                    if (!XmlParser.isValidChar(c)) {
                        if (p === start) {
                            throw new XmlError('Expected node name', str, p);
                        }
                        xml = new XmlNode();
                        xml.nodeType = XmlNodeType.Element;
                        xml.localName = str.substr(start, p - start);
                        parent.addChild(xml);
                        state = XmlState.IgnoreSpaces;
                        next = XmlState.Body;
                        continue;
                    }
                    break;
                case XmlState.Body:
                    switch (c) {
                        case XmlParser.CharCodeSlash:
                            state = XmlState.WaitEnd;
                            break;
                        case XmlParser.CharCodeGreaterThan:
                            state = XmlState.Childs;
                            break;
                        default:
                            state = XmlState.AttribName;
                            start = p;
                            continue;
                    }
                    break;
                case XmlState.AttribName:
                    if (!XmlParser.isValidChar(c)) {
                        if (start === p) {
                            throw new XmlError('Expected attribute name', str, p);
                        }
                        let tmp = str.substr(start, p - start);
                        aname = tmp;
                        if (xml.attributes.has(aname)) {
                            throw new XmlError(`Duplicate attribute [${aname}]`, str, p);
                        }
                        state = XmlState.IgnoreSpaces;
                        next = XmlState.Equals;
                        continue;
                    }
                    break;
                case XmlState.Equals:
                    switch (c) {
                        case XmlParser.CharCodeEquals:
                            state = XmlState.IgnoreSpaces;
                            next = XmlState.AttvalBegin;
                            break;
                        default:
                            throw new XmlError('Expected =', str, p);
                    }
                    break;
                case XmlState.AttvalBegin:
                    switch (c) {
                        case XmlParser.CharCodeDoubleQuote:
                        case XmlParser.CharCodeSingleQuote:
                            buf = '';
                            state = XmlState.AttribVal;
                            start = p + 1;
                            attrValQuote = c;
                            break;
                    }
                    break;
                case XmlState.AttribVal:
                    switch (c) {
                        case XmlParser.CharCodeAmp:
                            buf += str.substr(start, p - start);
                            state = XmlState.Escape;
                            escapeNext = XmlState.AttribVal;
                            start = p + 1;
                            break;
                        default:
                            if (c === attrValQuote) {
                                buf += str.substr(start, p - start);
                                let value = buf;
                                buf = '';
                                xml.attributes.set(aname, value);
                                state = XmlState.IgnoreSpaces;
                                next = XmlState.Body;
                            }
                            break;
                    }
                    break;
                case XmlState.Childs:
                    p = XmlParser.parse(str, p, xml);
                    start = p;
                    state = XmlState.Begin;
                    break;
                case XmlState.WaitEnd:
                    switch (c) {
                        case XmlParser.CharCodeGreaterThan:
                            state = XmlState.Begin;
                            break;
                        default:
                            throw new XmlError('Expected >', str, p);
                    }
                    break;
                case XmlState.WaitEndRet:
                    switch (c) {
                        case XmlParser.CharCodeGreaterThan:
                            return p;
                        default:
                            throw new XmlError('Expected >', str, p);
                    }
                case XmlState.Close:
                    if (!XmlParser.isValidChar(c)) {
                        if (start === p) {
                            throw new XmlError('Expected node name', str, p);
                        }
                        let v = str.substr(start, p - start);
                        if (v !== parent.localName) {
                            throw new XmlError('Expected </' + parent.localName + '>', str, p);
                        }
                        state = XmlState.IgnoreSpaces;
                        next = XmlState.WaitEndRet;
                        continue;
                    }
                    break;
                case XmlState.Comment:
                    if (c === XmlParser.CharCodeMinus &&
                        str.charCodeAt(p + 1) === XmlParser.CharCodeMinus &&
                        str.charCodeAt(p + 2) === XmlParser.CharCodeGreaterThan) {
                        p += 2;
                        state = XmlState.Begin;
                    }
                    break;
                case XmlState.Doctype:
                    if (c === XmlParser.CharCodeBrackedOpen) {
                        nbrackets++;
                    }
                    else if (c === XmlParser.CharCodeBrackedClose) {
                        nbrackets--;
                    }
                    else if (c === XmlParser.CharCodeGreaterThan && nbrackets === 0) {
                        let node = new XmlNode();
                        node.nodeType = XmlNodeType.DocumentType;
                        node.value = str.substr(start, p - start);
                        parent.addChild(node);
                        state = XmlState.Begin;
                    }
                    break;
                case XmlState.Header:
                    if (c === XmlParser.CharCodeQuestion && str.charCodeAt(p + 1) === XmlParser.CharCodeGreaterThan) {
                        p++;
                        state = XmlState.Begin;
                    }
                    break;
                case XmlState.Escape:
                    if (c === XmlParser.CharCodeSemi) {
                        let s = str.substr(start, p - start);
                        if (s.charCodeAt(0) === XmlParser.CharCodeSharp) {
                            let code = s.charCodeAt(1) === XmlParser.CharCodeLowerX
                                ? parseInt('0' + s.substr(1, s.length - 1))
                                : parseInt(s.substr(1, s.length - 1));
                            buf += String.fromCharCode(code);
                        }
                        else if (XmlParser.Escapes.has(s)) {
                            buf += XmlParser.Escapes.get(s);
                        }
                        else {
                            buf += (_a = ('&' + s + ';')) === null || _a === void 0 ? void 0 : _a.toString();
                        }
                        start = p + 1;
                        state = escapeNext;
                    }
                    else if (!XmlParser.isValidChar(c) && c !== XmlParser.CharCodeSharp) {
                        buf += '&';
                        buf += str.substr(start, p - start);
                        p--;
                        start = p + 1;
                        state = escapeNext;
                    }
                    break;
            }
            p++;
        }
        if (state === XmlState.Begin) {
            start = p;
            state = XmlState.Pcdata;
        }
        if (state === XmlState.Pcdata) {
            if (p !== start) {
                buf += str.substr(start, p - start);
                let node = new XmlNode();
                node.nodeType = XmlNodeType.Text;
                node.value = buf;
                parent.addChild(node);
            }
            return p;
        }
        if (state === XmlState.Escape && escapeNext === XmlState.Pcdata) {
            buf += '&';
            buf += str.substr(start, p - start);
            let node = new XmlNode();
            node.nodeType = XmlNodeType.Text;
            node.value = buf;
            parent.addChild(node);
            return p;
        }
        throw new XmlError('Unexpected end', str, p);
    }
    static isValidChar(c) {
        return ((c >= XmlParser.CharCodeLowerA && c <= XmlParser.CharCodeLowerZ) ||
            (c >= XmlParser.CharCodeUpperA && c <= XmlParser.CharCodeUpperZ) ||
            (c >= XmlParser.CharCode0 && c <= XmlParser.CharCode9) ||
            c === XmlParser.CharCodeColon ||
            c === XmlParser.CharCodeDot ||
            c === XmlParser.CharCodeUnderscore ||
            c === XmlParser.CharCodeMinus);
    }
}
XmlParser.CharCodeLF = 10;
XmlParser.CharCodeTab = 9;
XmlParser.CharCodeCR = 13;
XmlParser.CharCodeSpace = 32;
XmlParser.CharCodeLowerThan = 60;
XmlParser.CharCodeAmp = 38;
XmlParser.CharCodeBrackedClose = 93;
XmlParser.CharCodeBrackedOpen = 91;
XmlParser.CharCodeGreaterThan = 62;
XmlParser.CharCodeExclamation = 33;
XmlParser.CharCodeUpperD = 68;
XmlParser.CharCodeLowerD = 100;
XmlParser.CharCodeMinus = 45;
XmlParser.CharCodeQuestion = 63;
XmlParser.CharCodeSlash = 47;
XmlParser.CharCodeEquals = 61;
XmlParser.CharCodeDoubleQuote = 34;
XmlParser.CharCodeSingleQuote = 39;
XmlParser.CharCodeSharp = 35;
XmlParser.CharCodeLowerX = 120;
XmlParser.CharCodeLowerA = 97;
XmlParser.CharCodeLowerZ = 122;
XmlParser.CharCodeUpperA = 65;
XmlParser.CharCodeUpperZ = 90;
XmlParser.CharCode0 = 48;
XmlParser.CharCode9 = 57;
XmlParser.CharCodeColon = 58;
XmlParser.CharCodeDot = 46;
XmlParser.CharCodeUnderscore = 95;
XmlParser.CharCodeSemi = 59;
XmlParser.Escapes = new Map([
    ['lt', '<'],
    ['gt', '>'],
    ['amp', '&'],
    ['quot', '"'],
    ['apos', "'"]
]);
var AlphaTabErrorType;
(function (AlphaTabErrorType) {
    AlphaTabErrorType[AlphaTabErrorType["General"] = 0] = "General";
    AlphaTabErrorType[AlphaTabErrorType["Format"] = 1] = "Format";
    AlphaTabErrorType[AlphaTabErrorType["AlphaTex"] = 2] = "AlphaTex";
})(AlphaTabErrorType || (AlphaTabErrorType = {}));
class AlphaTabError extends Error {
    constructor(type, message = "", inner) {
        super(message !== null && message !== void 0 ? message : "", { cause: inner });
        this.type = type;
        this.inner = inner !== null && inner !== void 0 ? inner : null;
        Object.setPrototypeOf(this, AlphaTabError.prototype);
    }
}
class XmlError extends AlphaTabError {
    constructor(message, xml, pos) {
        super(AlphaTabErrorType.Format, message);
        this.pos = 0;
        this.xml = xml;
        this.pos = pos;
        Object.setPrototypeOf(this, XmlError.prototype);
    }
}
var DataType;
(function (DataType) {
    DataType[DataType["Boolean"] = 0] = "Boolean";
    DataType[DataType["Integer"] = 1] = "Integer";
    DataType[DataType["Float"] = 2] = "Float";
    DataType[DataType["String"] = 3] = "String";
    DataType[DataType["Point"] = 4] = "Point";
    DataType[DataType["Size"] = 5] = "Size";
    DataType[DataType["Rectangle"] = 6] = "Rectangle";
    DataType[DataType["Color"] = 7] = "Color";
})(DataType || (DataType = {}));
class BinaryStylesheet {
    constructor(data) {
        this.raw = new Map();
        let readable = ByteBuffer.fromBuffer(data);
        let entryCount = IOHelper.readInt32BE(readable);
        for (let i = 0; i < entryCount; i++) {
            let key = GpBinaryHelpers.gpReadString(readable, readable.readByte(), 'utf-8');
            let type = readable.readByte();
            switch (type) {
                case DataType.Boolean:
                    let flag = readable.readByte() === 1;
                    this.addValue(key, flag);
                    break;
                case DataType.Integer:
                    let ivalue = IOHelper.readInt32BE(readable);
                    this.addValue(key, ivalue);
                    break;
                case DataType.Float:
                    let fvalue = GpBinaryHelpers.gpReadFloat(readable);
                    this.addValue(key, fvalue);
                    break;
                case DataType.String:
                    let s = GpBinaryHelpers.gpReadString(readable, IOHelper.readInt16BE(readable), 'utf-8');
                    this.addValue(key, s);
                    break;
                case DataType.Point:
                    let x = IOHelper.readInt32BE(readable);
                    let y = IOHelper.readInt32BE(readable);
                    this.addValue(key, new BendPoint(x, y));
                    break;
                case DataType.Size:
                    let width = IOHelper.readInt32BE(readable);
                    let height = IOHelper.readInt32BE(readable);
                    this.addValue(key, new BendPoint(width, height));
                    break;
                case DataType.Rectangle:
                    let rect = new Bounds();
                    rect.x = IOHelper.readInt32BE(readable);
                    rect.y = IOHelper.readInt32BE(readable);
                    rect.w = IOHelper.readInt32BE(readable);
                    rect.h = IOHelper.readInt32BE(readable);
                    this.addValue(key, rect);
                    break;
                case DataType.Color:
                    let color = GpBinaryHelpers.gpReadColor(readable, true);
                    this.addValue(key, color);
                    break;
            }
        }
    }
    apply(score) {
        for (const [key, value] of this.raw) {
            switch (key) {
                case 'StandardNotation/hideDynamics':
                    break;
            }
        }
    }
    addValue(key, value) {
        this.raw.set(key, value);
    }
    static writeForScore(score) {
        const writer = ByteBuffer.withCapacity(128);
        IOHelper.writeInt32BE(writer, 1);
        return writer.toArray();
    }
    static writeBooleanEntry(writer, key, value) {
        GpBinaryHelpers.gpWriteString(writer, key);
        writer.writeByte(DataType.Boolean);
        writer.writeByte(value ? 1 : 0);
    }
}
class Bounds {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.w = 0;
        this.h = 0;
    }
}
class ScoreView {
    constructor() {
        this.isMultiRest = false;
        this.trackViewGroups = [];
    }
}
class TrackViewGroup {
    constructor() {
        this.showSlash = false;
        this.showStandardNotation = false;
        this.showTablature = false;
    }
}
class PartConfiguration {
    constructor(partConfigurationData) {
        this.scoreViews = [];
        let readable = ByteBuffer.fromBuffer(partConfigurationData);
        const scoreViewCount = IOHelper.readInt32BE(readable);
        for (let i = 0; i < scoreViewCount; i++) {
            const scoreView = new ScoreView();
            this.scoreViews.push(scoreView);
            scoreView.isMultiRest = GpBinaryHelpers.gpReadBool(readable);
            const trackViewGroupCount = IOHelper.readInt32BE(readable);
            for (let j = 0; j < trackViewGroupCount; j++) {
                let flags = readable.readByte();
                if (flags === 0) {
                    flags = 1;
                }
                let trackConfiguration = new TrackViewGroup();
                trackConfiguration.showStandardNotation = (flags & 0x01) !== 0;
                trackConfiguration.showTablature = (flags & 0x02) !== 0;
                trackConfiguration.showSlash = (flags & 0x04) !== 0;
                scoreView.trackViewGroups.push(trackConfiguration);
            }
        }
    }
    apply(score) {
        if (this.scoreViews.length > 0) {
            let trackIndex = 0;
            for (let trackConfig of this.scoreViews[0].trackViewGroups) {
                if (trackIndex < score.tracks.length) {
                    const track = score.tracks[trackIndex];
                    for (const staff of track.staves) {
                        staff.showTablature = trackConfig.showTablature;
                        staff.showStandardNotation = trackConfig.showStandardNotation;
                    }
                }
                trackIndex++;
            }
        }
    }
    static writeForScore(score) {
        const writer = ByteBuffer.withCapacity(128);
        const scoreViews = [
            new ScoreView()
        ];
        for (const track of score.tracks) {
            const trackConfiguration = new TrackViewGroup();
            trackConfiguration.showStandardNotation = track.staves[0].showStandardNotation;
            trackConfiguration.showTablature = track.staves[0].showTablature;
            scoreViews[0].trackViewGroups.push(trackConfiguration);
            const singleTrackScoreView = new ScoreView();
            singleTrackScoreView.trackViewGroups.push(trackConfiguration);
            scoreViews.push(singleTrackScoreView);
        }
        IOHelper.writeInt32BE(writer, scoreViews.length);
        for (const part of scoreViews) {
            writer.writeByte(part.isMultiRest ? 1 : 0);
            IOHelper.writeInt32BE(writer, part.trackViewGroups.length);
            for (const track of part.trackViewGroups) {
                let flags = 0;
                if (track.showStandardNotation) {
                    flags = flags | 0x01;
                }
                if (track.showTablature) {
                    flags = flags | 0x02;
                }
                if (track.showSlash) {
                    flags = flags | 0x04;
                }
                writer.writeByte(flags);
            }
        }
        IOHelper.writeInt32BE(writer, 1);
        return writer.toArray();
    }
}
class XmlWriter {
    constructor(indention, xmlHeader) {
        this._result = [];
        this._indention = indention;
        this._xmlHeader = xmlHeader;
        this._currentIndention = '';
        this._isStartOfLine = true;
    }
    static write(xml, indention, xmlHeader) {
        const writer = new XmlWriter(indention, xmlHeader);
        writer.writeNode(xml);
        return writer.toString();
    }
    writeNode(xml) {
        switch (xml.nodeType) {
            case XmlNodeType.None:
                break;
            case XmlNodeType.Element:
                if (this._result.length > 0) {
                    this.writeLine();
                }
                this.write(`<${xml.localName}`);
                for (const [name, value] of xml.attributes) {
                    this.write(` ${name}="`);
                    this.writeAttributeValue(value);
                    this.write('"');
                }
                if (xml.childNodes.length === 0) {
                    this.write('/>');
                }
                else {
                    this.write('>');
                    if (xml.childNodes.length === 1 && !xml.firstElement) {
                        this.writeNode(xml.childNodes[0]);
                    }
                    else {
                        this.indent();
                        for (const child of xml.childNodes) {
                            if (child.nodeType === XmlNodeType.Element) {
                                this.writeNode(child);
                            }
                        }
                        this.unindend();
                        this.writeLine();
                    }
                    this.write(`</${xml.localName}>`);
                }
                break;
            case XmlNodeType.Text:
                if (xml.value) {
                    this.write(xml.value);
                }
                break;
            case XmlNodeType.CDATA:
                if (xml.value !== null) {
                    this.write(`<![CDATA[${xml.value}]]>`);
                }
                break;
            case XmlNodeType.Document:
                if (this._xmlHeader) {
                    this.write('<?xml version="1.0" encoding="utf-8"?>');
                }
                for (const child of xml.childNodes) {
                    this.writeNode(child);
                }
                break;
            case XmlNodeType.DocumentType:
                this.write(`<!DOCTYPE ${xml.value}>`);
                break;
        }
    }
    unindend() {
        this._currentIndention = this._currentIndention.substr(0, this._currentIndention.length - this._indention.length);
    }
    indent() {
        this._currentIndention += this._indention;
    }
    writeAttributeValue(value) {
        for (let i = 0; i < value.length; i++) {
            const c = value.charAt(i);
            switch (c) {
                case '<':
                    this._result.push('&lt;');
                    break;
                case '>':
                    this._result.push('&gt;');
                    break;
                case '&':
                    this._result.push('&amp;');
                    break;
                case "'":
                    this._result.push('&apos;');
                    break;
                case '"':
                    this._result.push('&quot;');
                    break;
                default:
                    this._result.push(c);
                    break;
            }
        }
    }
    write(s) {
        if (this._isStartOfLine) {
            this._result.push(this._currentIndention);
        }
        this._result.push(s);
        this._isStartOfLine = false;
    }
    writeLine(s = null) {
        if (s) {
            this.write(s);
        }
        if (this._indention.length > 0 && !this._isStartOfLine) {
            this._result.push('\n');
            this._isStartOfLine = true;
        }
    }
    toString() {
        return this._result.join('').trim();
    }
}
//# sourceMappingURL=guitartabimport.js.map