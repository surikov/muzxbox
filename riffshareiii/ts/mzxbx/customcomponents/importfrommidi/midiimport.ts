class MIDIIImportMusicPlugin implements MZXBX_ImportMusicPlugin {
	GUIURL(callback: (imported: MZXBX_Project) => void) {
		return './web/plugins/midi/midimusicimport.html';
	}

}
function createImportMIDIfile(): MZXBX_ImportMusicPlugin {
	return new MIDIIImportMusicPlugin();
}
