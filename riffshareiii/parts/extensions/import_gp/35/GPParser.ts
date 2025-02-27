
function score2schedule(title: string, comment: string, score: Score): Zvoog_Project {
	console.log('score2schedule', score);
	let project: Zvoog_Project = {
		versionCode: '1'
		, title: title + ' ' + comment
		, timeline: []
		, tracks: []
		, percussions: []
		, filters: []
		, comments: []
		, position: { x: 0, y: 0, z: 30 }
		, selectedPart: { startMeasure: -1, endMeasure: -1 }
		, list: false
	};

	let tempo = 120;
	for (let bb = 0; bb < score.masterBars.length; bb++) {
		let maBar = score.masterBars[bb];
		if (maBar.tempoAutomation) {
			if (maBar.tempoAutomation.value > 0) {
				tempo = maBar.tempoAutomation.value;
			}
		}
		let measure: Zvoog_SongMeasure = {
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
	/*
	project.filters[project.filters.length - 2].iconPosition.x = 35 + project.tracks.length * 9 + project.filters.length * 4;
		project.filters[project.filters.length - 2].iconPosition.y = project.filters.length * 5;

		project.filters[project.filters.length - 1].iconPosition.x = 20 + project.tracks.length * 9 + project.filters.length * 4;
		project.filters[project.filters.length - 1].iconPosition.y = project.filters.length * 6;
	*/
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
function beatDuration(beat: Beat): Zvoog_MetreMathType {
	let duration: Zvoog_MetreMathType = MMUtil().set({ count: 1, part: beat.duration });
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
function takeChord(start: Zvoog_Metre, measure: Zvoog_TrackMeasure): Zvoog_Chord {
	let startBeat = MMUtil().set(start);
	for (let cc = 0; cc < measure.chords.length; cc++) {
		if (startBeat.equals(measure.chords[cc].skip)) {
			return measure.chords[cc];
		}
	}
	//let newChord: Zvoog_Chord = { notes: [], skip: { count: start.count, part: start.part } };
	let newChord: Zvoog_Chord = { pitches: [], slides: [], skip: { count: start.count, part: start.part } };
	measure.chords.push(newChord);
	return newChord;
}
function addScoreInsTrack(project: Zvoog_Project, scoreTrack: Track) {
	let perfkind = 'zinstr1';
		if (scoreTrack.playbackInfo.program == 24
			|| scoreTrack.playbackInfo.program == 25
			|| scoreTrack.playbackInfo.program == 26
			|| scoreTrack.playbackInfo.program == 27
			|| scoreTrack.playbackInfo.program == 28
			|| scoreTrack.playbackInfo.program == 29
			|| scoreTrack.playbackInfo.program == 30
		) {
			perfkind = 'zvstrumming1';
		}
	let mzxbxTrack: Zvoog_MusicTrack = {
		title: scoreTrack.trackName+' '+insNames[scoreTrack.playbackInfo.program]
		, measures: []
		, performer: {
			id: 'track' + (insNames[scoreTrack.playbackInfo.program] + Math.random())
			, data: ''+scoreTrack.playbackInfo.program
			, kind:perfkind
			, outputs: ['']
			, iconPosition: { x: 0, y: 0 }
			, state: 0
		}
		, volume: 1
	};
	let palmMuteTrack: Zvoog_MusicTrack = {
		title: 'P.M.'+scoreTrack.trackName+' '+insNames[scoreTrack.playbackInfo.program]
		, measures: []
		, performer: {
			id: 'track' + (insNames[scoreTrack.playbackInfo.program] + Math.random())
			, data: ''+scoreTrack.playbackInfo.program
			, kind:perfkind
			, outputs: ['']
			, iconPosition: { x: 0, y: 0 }
			, state: 0
		}
		, volume: 1
	};
	if (scoreTrack.playbackInfo.program == 29
		|| scoreTrack.playbackInfo.program == 30) {
		mzxbxTrack.performer.data = '30/341';
		palmMuteTrack.performer.data = '29/323';
	}
	let flag=false;
	project.tracks.push(mzxbxTrack);
	for (let mm = 0; mm < project.timeline.length; mm++) {
		let mzxbxMeasure: Zvoog_TrackMeasure = { chords: [] };
		let pmMeasure: Zvoog_TrackMeasure = { chords: [] };
		mzxbxTrack.measures.push(mzxbxMeasure);
		palmMuteTrack.measures.push(pmMeasure);
		for (let ss = 0; ss < scoreTrack.staves.length; ss++) {
			let staff = scoreTrack.staves[ss];
			let tuning: number[] = staff.stringTuning.tunings;
			let bar = staff.bars[mm];
			for (let vv = 0; vv < bar.voices.length; vv++) {
				let voice = bar.voices[vv];
				let start: Zvoog_MetreMathType = MMUtil();
				for (let bb = 0; bb < voice.beats.length; bb++) {
					let beat = voice.beats[bb];
					let currentDuration = beatDuration(beat);
					
					
					for (let nn = 0; nn < beat.notes.length; nn++) {
						let note = beat.notes[nn];
						let pitch = stringFret2pitch(note.string, note.fret, tuning);
						if(note.isPalmMute){
							let pmChord: Zvoog_Chord = takeChord(start, pmMeasure);
					pmChord.slides=[{ duration: currentDuration, delta: 0 }];
							pmChord.pitches.push(pitch);
							flag=true;
						}else{
							let chord: Zvoog_Chord = takeChord(start, mzxbxMeasure);
					chord.slides=[{ duration: currentDuration, delta: 0 }];
							chord.pitches.push(pitch);
						}
						
					}
					start = start.plus(currentDuration);
				}
			}

		}
		//let bar = scoreTrack.staves
	}
	if(flag){
		project.tracks.push(palmMuteTrack);
	}
}
function takeDrumTrack(title: string, trackDrums: Zvoog_PercussionTrack[], drumNum: number): Zvoog_PercussionTrack {
	if (trackDrums[drumNum]) {
		//
	} else {
		let track: Zvoog_PercussionTrack = {
			title: title
			, measures: []
			//, filters: []
			//, sampler: { id: '', data: '', kind: '', outputs: [] }
			, sampler: {
				id: 'drum' + (drumNum + Math.random())
				, data: '' + drumNum
				, kind: 'zdrum1'
				, outputs: ['']
				, iconPosition: { x: 0, y: 0 }
				, state: 0
			}
			, volume: 1
		};
		trackDrums[drumNum] = track;
	}
	trackDrums[drumNum].title = title+' '+drumNames[drumNum];
	return trackDrums[drumNum];
}
function takeDrumMeasure(trackDrum: Zvoog_PercussionTrack, barNum: number): Zvoog_PercussionMeasure {
	if (trackDrum.measures[barNum]) {
		//
	} else {
		let measure: Zvoog_PercussionMeasure = {
			skips: []
		};
		trackDrum.measures[barNum] = measure;
	}
	return trackDrum.measures[barNum];
}

function addScoreDrumsTracks(project: Zvoog_Project, scoreTrack: Track) {
	let trackDrums: Zvoog_PercussionTrack[] = [];
	for (let mm = 0; mm < project.timeline.length; mm++) {
		//let mzxbxMeasure: Zvoog_TrackMeasure = { chords: [] };
		//mzxbxTrack.measures.push(mzxbxMeasure);
		for (let ss = 0; ss < scoreTrack.staves.length; ss++) {
			let staff = scoreTrack.staves[ss];
			//let tuning: number[] = staff.stringTuning.tunings;
			let bar = staff.bars[mm];
			for (let vv = 0; vv < bar.voices.length; vv++) {
				let voice = bar.voices[vv];
				let start: Zvoog_MetreMathType = MMUtil();
				for (let bb = 0; bb < voice.beats.length; bb++) {
					let beat = voice.beats[bb];
					let currentDuration = beatDuration(beat);
					for (let nn = 0; nn < beat.notes.length; nn++) {
						let note = beat.notes[nn];
						let drum = note.percussionArticulation;
						let track = takeDrumTrack(scoreTrack.trackName + ': ' + drum, trackDrums, drum);
						let measure = takeDrumMeasure(track, mm);
						measure.skips.push(start);
						/*let pitch = stringFret2pitch(note.string, note.fret, tuning);
						let chord: Zvoog_Chord = takeChord(start, mzxbxMeasure);
						let mzxbxNote: Zvoog_Note = {
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


let drumNames: string[] = [];
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
let insNames: string[] = [];
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