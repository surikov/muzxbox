class MusicXMLFileImporter implements ZvoogStore {
	list(onFinish: (items: ZvoogStoreListItem[]) => void): void { };
	goFolder(title: string, onFinish: (error: string) => void): void { };
	goUp(onFinish: (error: string) => void): void { };

	readSongData(title: string, onFinish: (result: ZvoogSchedule | null) => void): void {
		var fileSelector: HTMLInputElement = document.createElement('input');
		fileSelector.setAttribute('type', 'file');
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
						var mxml: TreeValue = new TreeValue('', '', []);
						mxml.fill(_document);
						var zvoogSchedule: ZvoogSchedule = me.parseMXML(mxml);
						onFinish(zvoogSchedule);
					}
				};
				fileReader.readAsBinaryString(file);
			}
		}, false);
		fileSelector.click();
	};

	parseMXML(mxml: TreeValue): ZvoogSchedule {
		console.log(mxml);
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
		var firstPartMeasures: TreeValue[] = mxml.first('part').every('measure');
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
				var dirtype = directions[dd].first('direction-type').children[0];
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
									console.log(dirtype.name, mm, directions[dd]);
								}
							}
						}
					}
				}
			}
		}
		var scorePart: TreeValue[] = mxml.first('part-list').every('score-part');
		for (var i = 0; i < scorePart.length; i++) {
			//console.log(scorePart[i].first('id').value, scorePart[i].first('part-name').value);
			var newtrack: ZvoogTrack = {
				title: scorePart[i].first('id').value + ': ' + scorePart[i].first('part-name').value
				, voices: []
				, filters: []
			};
			zvoogSchedule.tracks.push(newtrack);
			var midiInstrument: TreeValue[] = scorePart[i].every('midi-instrument');
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
		}
		//console.log(mxml.seek('credit','credit-type','title').first('credit-words').value);
		//console.log(mxml.seek('credit','credit-type','subtitle').first('credit-words').value);
		/*var credits: TreeValue[] = mxml.every('credit');
		for (var i = 0; i < credits.length; i++) {
			if (credits[i].first('credit-type').value == 'title') {
				zvoogSchedule.title = credits[i].first('credit-words').value;

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
