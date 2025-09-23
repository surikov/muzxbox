class MIDIReader {
	constructor(arrayBuffer: ArrayBuffer) {
		let parser: MidiParser = new MidiParser(arrayBuffer);
		console.log(parser);
		let converter = new EventsConverter(parser);
		let project = converter.convertEvents();
		console.log(project);
		parsedProject = project;
	}
}
