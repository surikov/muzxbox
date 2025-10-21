class MIDIReader {
	info: MIDIFileInfo;
	project: Zvoog_Project;
	parser: MidiParser 
	constructor(filename: string, filesize: number, 
		arrayBuffer: ArrayBuffer) {
		this.parser = new MidiParser(arrayBuffer);
		//console.log(parser);
		let converter = new EventsConverter(this.parser);
		//let project = converter.convertEvents(filename, filesize);
		//console.log(project);
		//parsedProject = project;

		this.project = converter.convertEvents(filename, filesize);
		this.info = converter.midiFileInfo;
	}
}
