type TrackNumChanNum = { trackNum: number, channelNum: number, zvoogtrack: Zvoog_MusicTrack };
class EventsConverter {
	parser: MidiParser;
	constructor(parser: MidiParser) {
		this.parser = parser;
	}
	convertEvents(): Zvoog_Project {
		let project: Zvoog_Project = {
			title: 'test'
			, timeline: []
			, tracks: []
			, percussions: []
			, filters: []
			//,automations: []
			, comments: []
			, selectedPart: {
				startMeasure: -1
				, endMeasure: -1
			}
			, versionCode: '1'
			, list: false
			, position: { x: 0, y: 0, z: 30 }
			, menuPerformers: false
			, menuSamplers: false
			, menuFilters: false
			, menuActions: false
			, menuPlugins: false
			, menuClipboard: false
			, menuSettings: false
		};
		let tracksChannels: TrackNumChanNum[] = [];
		for (let ii = 0; ii < this.parser.parsedTracks.length; ii++) {
			let parsedtrack: MIDIFileTrack = this.parser.parsedTracks[ii];
			for (let k = 0; k < parsedtrack.programChannel.length; k++) {
				this.findOrCreateTrack(parsedtrack, ii, parsedtrack.programChannel[k].channel, tracksChannels);
			}

		}
		for (let ii = 0; ii < tracksChannels.length; ii++) {
			project.tracks.push(tracksChannels[ii].zvoogtrack);
		}
		return project;
	}
	findOrCreateTrack(parsedtrack: MIDIFileTrack, trackOrder: number, channelNum: number, tracksChannels: TrackNumChanNum[]): TrackNumChanNum {
		for (let ii = 0; ii < tracksChannels.length; ii++) {
			if (tracksChannels[ii].trackNum == trackOrder && tracksChannels[ii].channelNum == channelNum) {
				return tracksChannels[ii];
			}
		}
		let it: TrackNumChanNum = {
			trackNum: trackOrder
			, channelNum: channelNum
			, zvoogtrack: {
				title: parsedtrack.trackTitle + ' / ' + parsedtrack.instrumentName
				, measures: []
				, performer: {
					id: '' + Math.random()
					, data: ''
					, kind: ''
					, outputs: []
					, iconPosition: { x: 0, y: 0 }
					, state: 0
				}
			}
		};
		tracksChannels.push(it);
		return it;
	}
}
