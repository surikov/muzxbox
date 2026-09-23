class MIDIReader {
	info: MIDIFileInfo;
	project: Zvoog_Project;
	parser: MidiParser 
	constructor(filename: string, filesize: number, 
		arrayBuffer: ArrayBuffer) {
		this.parser = new MidiParser(arrayBuffer);
		//console.log('convert');
		let converter = new EventsConverter(this.parser);
		//let project = converter.convertEvents(filename, filesize);
		//console.log(project);
		//parsedProject = project;
		//console.log('project');
		this.project = converter.convertEvents(filename, filesize);
		//console.log('done');
		this.info = converter.midiFileInfo;
	}
}
