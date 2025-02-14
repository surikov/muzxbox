class MIDIConverter {
	convertProject(parser: MidiParser): MIDISongData {
		//console.log('MidiParser.convertProject', this);
		let midiSongData: MIDISongData = {
			parser: '1.12'
			, duration: 0
			, bpm: parser.header.tempoBPM
			, changes: parser.header.changes
			, lyrics: parser.header.lyrics
			, key: parser.header.keyFlatSharp
			, mode: parser.header.keyMajMin
			, meter: { count: parser.header.meterCount, division: parser.header.meterDivision }
			, meters: parser.header.meters
			, signs: parser.header.signs
			, miditracks: []
			, speedMode: 0
			, lineMode: 0
		};
		let tracksChannels: { trackNum: number, channelNum: number, track: MIDISongTrack }[] = [];
		for (let i = 0; i < parser.parsedTracks.length; i++) {
			let parsedtrack: MIDIFileTrack = parser.parsedTracks[i];
			for (let k = 0; k < parsedtrack.programChannel.length; k++) {
				this.findOrCreateTrack(parsedtrack, i, parsedtrack.programChannel[k].channel, tracksChannels);
			}

		}
		var maxWhen = 0;
		for (var i = 0; i < parser.parsedTracks.length; i++) {
			var miditrack: MIDIFileTrack = parser.parsedTracks[i];
			for (var ch = 0; ch < miditrack.chords.length; ch++) {
				var midichord: TrackChord = miditrack.chords[ch];
				var newchord: MIDISongChord = { when: midichord.when, notes: [], channel: midichord.channel };
				if (maxWhen < midichord.when) {
					maxWhen = midichord.when;
				}

				for (var n = 0; n < midichord.notes.length; n++) {
					var midinote: TrackNote = midichord.notes[n];
					var newnote: MIDISongNote = { slidePoints: [], midiPitch: midinote.basePitch, midiDuration: midinote.baseDuration };
					newchord.notes.push(newnote);
					if (midinote.bendPoints.length > 0) {

						for (var v = 0; v < midinote.bendPoints.length; v++) {
							var midipoint: NotePitch = midinote.bendPoints[v];
							var newpoint: MIDISongPoint = {
								pitch: midinote.basePitch + midipoint.basePitchDelta
								, durationms: midipoint.pointDuration
							};
							newpoint.midipoint = midinote;
							newnote.slidePoints.push(newpoint);
						}
					} else {
						//
					}
				}

				let chanTrack = this.findOrCreateTrack(miditrack, i, newchord.channel, tracksChannels);
				chanTrack.track.songchords.push(newchord);
			}
		}

		for (let tt = 0; tt < tracksChannels.length; tt++) {
			let trackChan = tracksChannels[tt];
			if (trackChan.track.songchords.length > 0) {
				midiSongData.miditracks.push(tracksChannels[tt].track);
				if (midiSongData.duration < maxWhen) {
					midiSongData.duration = 54321 + maxWhen;
				}
				for (let i = 0; i < parser.parsedTracks.length; i++) {
					let miditrack: MIDIFileTrack = parser.parsedTracks[i];
					for (let kk = 0; kk < miditrack.programChannel.length; kk++) {
						if (miditrack.programChannel[kk].channel == trackChan.channelNum) {
							trackChan.track.program = miditrack.programChannel[kk].program;
						}
					}
				}
			}
		}
		
		return midiSongData;
	}

	



	findOrCreateTrack(parsedtrack: MIDIFileTrack, trackNum: number, channelNum: number, trackChannel: { trackNum: number, channelNum: number, track: MIDISongTrack }[])
		: { trackNum: number, channelNum: number, track: MIDISongTrack } {
		for (let i = 0; i < trackChannel.length; i++) {
			if (trackChannel[i].trackNum == trackNum && trackChannel[i].channelNum == channelNum) {
				return trackChannel[i];
			}
		}
		//console.log('findOrCreateTrack',parsedtrack.trackTitle);
		let it: { trackNum: number, channelNum: number, track: MIDISongTrack } = {
			trackNum: trackNum, channelNum: channelNum, track: {
				order: 0
				, title: parsedtrack.trackTitle + ((parsedtrack.instrumentName) ? (' - ' + parsedtrack.instrumentName) : '')
				//, instrument: '0'
				, channelNum: channelNum
				, trackVolumes: []//parsedtrack.trackVolumePoints
				, program: -1
				, songchords: []
			}
		};
		for (let vv = 0; vv < parsedtrack.trackVolumePoints.length; vv++) {
			if (parsedtrack.trackVolumePoints[vv].channel == it.track.channelNum) {
				it.track.trackVolumes.push(parsedtrack.trackVolumePoints[vv]);
			}
		}
		trackChannel.push(it);
		return it;
	}

}