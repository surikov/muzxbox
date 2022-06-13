//https://w3c.github.io/musicxml/tutorial/notation-basics/
class MusicXMLFileImporter implements ZvoogStore {
	list(onFinish: (items: ZvoogStoreListItem[]) => void): void { };
	goFolder(title: string, onFinish: (error: string) => void): void { };
	goUp(onFinish: (error: string) => void): void { };

	readSongData(title: string, onFinish: (result: ZvoogSchedule | null) => void): void {
		var fileSelector: HTMLInputElement = document.createElement('input');
		fileSelector.setAttribute('type', 'file');
		fileSelector.setAttribute('accept', 'application/vnd.recordare.musicxml+xml');
		var me = this;
		fileSelector.addEventListener("change", function (ev: Event) {
			if (fileSelector.files) {
				let file = fileSelector.files[0];
				let fileReader: FileReader = new FileReader();
				fileReader.onload = function (progressEvent) {
					if (progressEvent.target) {
						let xml: string = (progressEvent.target as any).result;
						var domParser: DOMParser = new DOMParser();
						var _document: Document = domParser.parseFromString(xml, "text/xml");
						var mxml: XV = new XV('', '', []);
						mxml.fill(_document);
						var zvoogSchedule: ZvoogSchedule = me.parseMXML(mxml);
						console.log('parsed musicxml', zvoogSchedule);
						onFinish(zvoogSchedule);
					}
				};
				fileReader.readAsBinaryString(file);
			}
		}, false);
		fileSelector.click();
	};
	takeChord(songVoice: ZvoogVoice, measureIdx: number, when: ZvoogMeter): ZvoogChordStrings {
		let cnt = songVoice.measureChords.length;
		for (let i = cnt; i < measureIdx; i++) {
			songVoice.measureChords.push({
				chords: []
			});
		}
		let imeasure=songVoice.measureChords[measureIdx];
		for(let i=0;i<imeasure.chords.length;i++){
			if(DUU(imeasure.chords[i].when).equalsTo(when)){
				return imeasure.chords[i];
			}
		}
		let chorddef: ZvoogChordStrings = {
			when: when
			, envelopes: []
			, variation: 0
		};
		imeasure.chords.push(chorddef);
		return chorddef;

	}
	takeVoice(voiceid: string, songtrack: ZvoogTrack): ZvoogVoice {
		for (let i = 0; i < songtrack.voices.length; i++) {
			if (songtrack.voices[i].title == voiceid) {
				return songtrack.voices[i];
			}
		}
		let trackvoice: ZvoogVoice = {
			measureChords: []
			, performer: {
				performerPlugin: null
				, parameters: []
				, kind: ''
				, initial: ''
			}
			, filters: []
			, title: voiceid
		};
		songtrack.voices.push(trackvoice);
		return trackvoice;
	}
	parsePitch(step:string,octave:string):number{
return 0;
	}
	parseMXML(mxml: XV): ZvoogSchedule {
		console.log('parseMXML', mxml);
		var zvoogSchedule: ZvoogSchedule = {
			title: ''
			, tracks: []
			, filters: []
			, measures: []
			, harmony: {
				tone: ''
				, mode: ''
				, progression: []
			}
		};
		let scoreParts: XV[] = mxml.first('part-list').every('score-part');
		for (var pp = 0; pp < scoreParts.length; pp++) {
			let part = scoreParts[pp];
			let partid = part.first('id').value;
			let partdata = mxml.seek('part', 'id', partid);
			console.log(partid, part.first('part-name').value, partdata);

			let partmeasures = partdata.every('measure');
			for (let mm = 0; mm < partmeasures.length; mm++) {
				if (zvoogSchedule.measures.length <= mm) {
					zvoogSchedule.measures.push(
						{
							meter: {
								count: 4
								, division: 4
							}
							, tempo: 120
							, points: []
						}
					);
				}
				let beats = partmeasures[mm].first("attributes").first("time").first("beats").value;
				let beattype = partmeasures[mm].first("attributes").first("time").first("beat-type").value;
				if ((beats) && (beattype)) {
					//console.log('meter', mm, beats, beattype);
				}
				let octaveChange = partmeasures[mm].first("attributes").first("transpose").first("octave-change").value;
				if (octaveChange) {
					//console.log('octaveChange', octaveChange);
				}
				var directions = partmeasures[mm].every('direction');

				for (var dd = 0; dd < directions.length; dd++) {
					var dirtype = directions[dd].first('direction-type').content[0];
					if (dirtype.name == 'rehearsal') {
						//console.log('label', mm, dirtype.value);
					} else {
						if (dirtype.name == 'dynamics') {
							//console.log(dirtype.name, mm, directions[dd].first('sound').first('dynamics').value);
						} else {
							if (dirtype.name == 'metronome') {
								//console.log('tempo', mm, dirtype.first('per-minute').value, dirtype.first('beat-unit').value);
							} else {
								if (dirtype.name == 'words') {
									if (dirtype.value == 'P.M.') {
										//
									} else {
										console.log(dirtype.name, mm, dirtype.value);
									}
								} else {
									if (dirtype.name == 'bracket') {
										//console.log(dirtype.name, mm, dirtype.first('type').value, dirtype.first('number').value, dirtype.first('line-end').value, dirtype.first('end-length').value);
									} else {
										console.log('?', mm, directions[dd]);
									}
								}
							}
						}
					}
				}


			}
		}
		for (var pp = 0; pp < scoreParts.length; pp++) {
			let part = scoreParts[pp];
			let partid = part.first('id').value;
			let partdata = mxml.seek('part', 'id', partid);
			let songtrack: ZvoogTrack = {
				title: part.first('part-name').value
				, voices: []
				, filters: []
			};
			zvoogSchedule.tracks.push(songtrack);
			let partmeasures = partdata.every('measure');
			let currentDivisions4 = 1;
			for (let mm = 0; mm < partmeasures.length; mm++) {
				let measurenotes = partmeasures[mm].every('note');
				let divisions = partmeasures[mm].first('attributes').first('divisions').value;
				if (divisions) {
					currentDivisions4 = parseInt(divisions);
					console.log(pp, mm, divisions);
				}
				let when: ZvoogMeter = {
					count: 0 / 1
					, division: 4
				};
				for (let nn = 0; nn < measurenotes.length; nn++) {
					let notedef = measurenotes[nn];
					let voiceId = notedef.first('voice').value;
					let dividuration = parseInt(notedef.first('duration').value);
					let noteDuration: ZvoogMeter = {
						count: dividuration / currentDivisions4
						, division: 4
					};
					let songvoice = this.takeVoice(voiceId, songtrack);
					let songchord=this.takeChord(songvoice,mm,when);
					let pitch=this.parsePitch(notedef.first('pitch').first('step').value,notedef.first('pitch').first('octave').value);
					let songnote:ZvoogEnvelope = {
						pitches: [{
							duration: noteDuration
							, pitch: pitch
						}]
					};
					songchord.envelopes.push(songnote);
				}
			}
		}

		/*
		var firstPartMeasures: Extra[] = mxml.first('part').every('measure');
		var timecount = '4';
		var timediv = '4';
		var fifths = '';
		for (var mm = 0; mm < firstPartMeasures.length; mm++) {
			var attributes = firstPartMeasures[mm].first('attributes');
			if (
				((attributes.first('time').first('beats').value) && attributes.first('time').first('beats').value != timecount)
				|| ((attributes.first('time').first('beat-type').value) && attributes.first('time').first('beat-type').value != timediv)
				|| ((attributes.first('key').first('fifths').value) && fifths != attributes.first('key').first('fifths').value)
			) {
				timecount = attributes.first('time').first('beats').value;
				timediv = attributes.first('time').first('beat-type').value;
				fifths = attributes.first('key').first('fifths').value;
				console.log(mm
					, 'time', timecount, timediv
					//,'clef',attributes.first('clef').first('sign').value,attributes.first('clef').first('line').value
					, 'fifths', attributes.first('key').first('fifths').value
				);
			}
			var directions = firstPartMeasures[mm].every('direction');

			for (var dd = 0; dd < directions.length; dd++) {
				var dirtype = directions[dd].first('direction-type').brood[0];
				if (dirtype.name == 'rehearsal') {
					console.log(dirtype.name, mm, dirtype.value);
				} else {
					if (dirtype.name == 'dynamics') {
						console.log(dirtype.name, mm, directions[dd].first('sound').first('dynamics').value);
					} else {
						if (dirtype.name == 'metronome') {
							console.log(dirtype.name, mm, dirtype.first('per-minute').value, dirtype.first('beat-unit').value);
						} else {
							if (dirtype.name == 'words') {
								console.log(dirtype.name, mm, dirtype.value);
							} else {
								if (dirtype.name == 'bracket') {
									console.log(dirtype.name, mm, dirtype.first('type').value, dirtype.first('number').value, dirtype.first('line-end').value, dirtype.first('end-length').value);
								} else {
									console.log('?',dirtype.name, mm, directions[dd]);
								}
							}
						}
					}
				}
			}
		}
		*/
		/*
		var scorePart: Extra[] = mxml.first('part-list').every('score-part');
		for (var i = 0; i < scorePart.length; i++) {
			console.log(scorePart[i].first('id').value, scorePart[i].first('part-name').value);
			var newtrack: ZvoogTrack = {
				title: scorePart[i].first('id').value + ': ' + scorePart[i].first('part-name').value
				, voices: []
				, filters: []
			};
			zvoogSchedule.tracks.push(newtrack);
			var midiInstrument: Extra[] = scorePart[i].every('midi-instrument');
			for (var kk = 0; kk < midiInstrument.length; kk++) {
				var unpitched = midiInstrument[kk].first('midi-unpitched').value;
				//console.log('program', midiInstrument[kk].first('midi-program').value, 'unpitched', midiInstrument[kk].first('midi-unpitched').value);
				var newvoice: ZvoogVoice = {
					measureChords: []
					, performer: {
						performerPlugin: null
						, parameters: []
						, kind: ''
						, initial: ''
					}
					, filters: []
					, title: ''
				};
				newtrack.voices.push(newvoice);
				if (unpitched) {
					newvoice.title = 'drum ' + unpitched;
					newvoice.performer.kind = 'wafdrum';
					newvoice.performer.initial = unpitched;
				} else {
					newvoice.title = 'program ' + midiInstrument[kk].first('midi-program').value;
					newvoice.performer.kind = 'wafinstrument';
					newvoice.performer.initial = midiInstrument[kk].first('midi-program').value;
				}
			}
		}*/
		return zvoogSchedule;
	}

	createSongData(title: string, schedule: ZvoogSchedule, onFinish: (error: string) => void): void { };
	updateSongData(title: string, schedule: ZvoogSchedule, onFinish: (error: string) => void): void { };
	deleteSongData(title: string, onFinish: (error: string) => void): void { };
	renameSongData(title: string, newTitle: string, onFinish: (error: string) => void): void { };

	createFolder(title: string, onFinish: (error: string) => void): void { };
	deleteFolder(title: string, onFinish: (error: string) => void): void { };
	renameFolder(title: string, newTitle: string, onFinish: (error: string) => void): void { };
};
