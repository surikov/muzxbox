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
		var scorePart: TreeValue[] = mxml.first('part-list').every('score-part');
		for (var i = 0; i < scorePart.length; i++) {
			console.log(scorePart[i].first('part-name').value);
			var midiInstrument:TreeValue[] =scorePart[i].every('midi-instrument');
			for(var kk=0;kk<midiInstrument.length;kk++){
				console.log('-',midiInstrument[kk].first('midi-program').value,'/',midiInstrument[kk].first('midi-unpitched').value);
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
