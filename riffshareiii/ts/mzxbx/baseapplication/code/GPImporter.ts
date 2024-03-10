/*https://github.com/CoderLine/alphaTab
*/
class GPImporter {
    score: Score;
    load(arrayBuffer: ArrayBuffer) {
        console.log('load', arrayBuffer);
        let gp3To5Importer: Gp3To5Importer = new Gp3To5Importer();
        let uint8Array: Uint8Array = new Uint8Array(arrayBuffer);
        //console.log('uint8Array', uint8Array);
        let data: ByteBuffer = ByteBuffer.fromBuffer(uint8Array);
        let settings: Settings = new Settings();
        gp3To5Importer.init(data, settings);
        //console.log('gp3To5Importer', gp3To5Importer);
        this.score = gp3To5Importer.readScore();
        //console.log("score", this.score);
    }
    convertProject(title: string, comment: string): MZXBX_Project {
        //console.log('GPImporter.convertProject');
        let project: MZXBX_Project = score2schedule(title, comment, this.score);
        return project;
    }
}
function newGPparser(arrayBuffer: ArrayBuffer) {
    console.log("newGPparser");
    let pp = new GPImporter();
    pp.load(arrayBuffer);
    return pp;
}
function score2schedule(title: string, comment: string, score: Score): MZXBX_Project {
    console.log('score2schedule', score);
    let project: MZXBX_Project = {
        title: title + ' ' + comment
        , timeline: []
        , tracks: []
        , percussions: []
        , filters: []
        , comments: []
    };

    let tempo = 120;
    for (let bb = 0; bb < score.masterBars.length; bb++) {
        let maBar = score.masterBars[bb];
        if (maBar.tempoAutomation) {
            if (maBar.tempoAutomation.value > 0) {
                tempo = maBar.tempoAutomation.value;
            }
        }
        let measure: MZXBX_SongMeasure = {
            tempo: tempo
            , metre: {
                count: maBar.timeSignatureNumerator
                , part: maBar.timeSignatureDenominator
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
        } else {
            addScoreInsTrack(project, scoreTrack);
        }
    }
    console.log(project);
    return project;
}
function stringFret2pitch(stringNum: number, fretNum: number, tuning: number[]): number {
    if (stringNum > 0 && stringNum <= tuning.length) {
        return tuning[tuning.length - stringNum] + fretNum;
    }
    /*
    var C = 0, Cs = 1, D = 2, Ds = 3, E = 4, F = 5, Fs = 6, G = 7, Gs = 8, A = 9, As = 10, B = 11;
    var O = 12;
    var _6th = E + O * 3, _5th = A + O * 3, _4th = D + O * 4, _3rd = G + O * 4, _2nd = B + O * 4, _1st = E + O * 5;
    if (stringNum == 1) return _6th + fretNum;
    if (stringNum == 2) return _5th + fretNum;
    if (stringNum == 3) return _4th + fretNum;
    if (stringNum == 4) return _3rd + fretNum;
    if (stringNum == 5) return _2nd + fretNum;
    if (stringNum == 6) return _1st + fretNum;
    */
    return -1;
}
function beatDuration(beat: Beat): MZXBX_MetreMathType {
    let duration: MZXBX_MetreMathType = MZMM().set({ count: 1, part: beat.duration });
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
function takeChord(start: MZXBX_Metre, measure: MZXBX_TrackMeasure): MZXBX_Chord {
    let startBeat = MZMM().set(start);
    for (let cc = 0; cc < measure.chords.length; cc++) {
        if (startBeat.equals(measure.chords[cc].skip)) {
            return measure.chords[cc];
        }
    }
    let newChord: MZXBX_Chord = { notes: [], skip: { count: start.count, part: start.part } };
    measure.chords.push(newChord);
    return newChord;
}
function addScoreInsTrack(project: MZXBX_Project, scoreTrack: Track) {
    let mzxbxTrack: MZXBX_MusicTrack = {
        title: scoreTrack.name
        , measures: []
        , filters: []
        , performer: { id: '', data: '' }
    };
    project.tracks.push(mzxbxTrack);
    for (let mm = 0; mm < project.timeline.length; mm++) {
        let mzxbxMeasure: MZXBX_TrackMeasure = { chords: [] };
        mzxbxTrack.measures.push(mzxbxMeasure);
        for (let ss = 0; ss < scoreTrack.staves.length; ss++) {
            let staff = scoreTrack.staves[ss];
            let tuning: number[] = staff.stringTuning.tunings;
            let bar = staff.bars[mm];
            for (let vv = 0; vv < bar.voices.length; vv++) {
                let voice = bar.voices[vv];
                let start: MZXBX_MetreMathType = MZMM();
                for (let bb = 0; bb < voice.beats.length; bb++) {
                    let beat = voice.beats[bb];
                    let currentDuration = beatDuration(beat);
                    for (let nn = 0; nn < beat.notes.length; nn++) {
                        let note = beat.notes[nn];
                        let pitch = stringFret2pitch(note.string, note.fret, tuning);
                        let chord: MZXBX_Chord = takeChord(start, mzxbxMeasure);
                        let mzxbxNote: MZXBX_Note = {
                            pitch: pitch
                            , slides: [{
                                delta: 0
                                , duration: currentDuration
                            }]
                        };
                        chord.notes.push(mzxbxNote);
                    }
                    start = start.plus(currentDuration);
                }
            }

        }
        //let bar = scoreTrack.staves
    }
}
function takeDrumTrack(title: string, trackDrums: MZXBX_PercussionTrack[], drumNum: number): MZXBX_PercussionTrack {
    if (trackDrums[drumNum]) {
        //
    } else {
        let track: MZXBX_PercussionTrack = {
            title: title
            , measures: []
            , filters: []
            , sampler: { id: '', data: '' }
        };
        trackDrums[drumNum] = track;
    }
    trackDrums[drumNum].title = title;
    return trackDrums[drumNum];
}
function takeDrumMeasure(trackDrum: MZXBX_PercussionTrack, barNum: number): MZXBX_PercussionMeasure {
    if (trackDrum.measures[barNum]) {
        //
    } else {
        let measure: MZXBX_PercussionMeasure = {
            skips: []
        };
        trackDrum.measures[barNum] = measure;
    }
    return trackDrum.measures[barNum];
}

function addScoreDrumsTracks(project: MZXBX_Project, scoreTrack: Track) {
    let trackDrums: MZXBX_PercussionTrack[] = [];
    for (let mm = 0; mm < project.timeline.length; mm++) {
        //let mzxbxMeasure: MZXBX_TrackMeasure = { chords: [] };
        //mzxbxTrack.measures.push(mzxbxMeasure);
        for (let ss = 0; ss < scoreTrack.staves.length; ss++) {
            let staff = scoreTrack.staves[ss];
            //let tuning: number[] = staff.stringTuning.tunings;
            let bar = staff.bars[mm];
            for (let vv = 0; vv < bar.voices.length; vv++) {
                let voice = bar.voices[vv];
                let start: MZXBX_MetreMathType = MZMM();
                for (let bb = 0; bb < voice.beats.length; bb++) {
                    let beat = voice.beats[bb];
                    let currentDuration = beatDuration(beat);
                    for (let nn = 0; nn < beat.notes.length; nn++) {
                        let note = beat.notes[nn];
                        let drum = note.percussionArticulation;
                        let track = takeDrumTrack(scoreTrack.name + ': ' + drum, trackDrums, drum);
                        let measure = takeDrumMeasure(track, mm);
                        measure.skips.push(start);
                        /*let pitch = stringFret2pitch(note.string, note.fret, tuning);
                        let chord: MZXBX_Chord = takeChord(start, mzxbxMeasure);
                        let mzxbxNote: MZXBX_Note = {
                            pitch: pitch
                            , slides: [{
                                delta: 0
                                , duration: currentDuration
                            }]
                        };
                        chord.notes.push(mzxbxNote);*/
                    }
                    start = start.plus(currentDuration);
                }
            }

        }
        //let bar = scoreTrack.staves
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
            //console.log(trackDrums[tt]);
            project.percussions.push(trackDrums[tt]);
        }
    }
}
