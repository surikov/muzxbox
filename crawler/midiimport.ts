class MIDIReader {
	project:Zvoog_Project;
	info: MIDIFileInfo;
	constructor(filename: string, filesize: number, arrayBuffer: ArrayBuffer) {
		let parser: MidiParser = new MidiParser(arrayBuffer);
		//console.log(parser);
		let converter = new EventsConverter(parser);
		this.info = converter.convertEvents(filename, filesize,this);
		//console.log(project);
		//let parsedProject = project;
	}
}
