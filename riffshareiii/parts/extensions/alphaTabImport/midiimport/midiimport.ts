class MIDIReader {
	constructor(filename:string,arrayBuffer: ArrayBuffer) {
		let parser: MidiParser = new MidiParser(arrayBuffer);
		console.log(parser);
		let converter = new EventsConverter(parser);
		let project = converter.convertEvents(filename);
		console.log(project);
		parsedProject = project;
	}
}
