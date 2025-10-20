class MIDIReader {
	info: MIDIFileInfo;
	project: Zvoog_Project;
	constructor(filename: string, filesize: number, arrayBuffer: ArrayBuffer) {
		let parser: MidiParser = new MidiParser(arrayBuffer);
		//console.log(parser);
		let converter = new EventsConverter(parser);
		//let project = converter.convertEvents(filename, filesize);
		//console.log(project);
		//parsedProject = project;

		this.project = converter.convertEvents(filename, filesize);
		this.info = converter.midiFileInfo;
	}
}
