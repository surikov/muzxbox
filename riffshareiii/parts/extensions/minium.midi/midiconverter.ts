class MIDIConverter {
	convertProject(parser: MidiParser): MIDISongData {
		//console.log('MidiParser.convertProject', this);
		let midiSongData: MIDISongData = {
			parser: '1.12'
			, duration: 0
			, bpm: parser.midiheader.tempoBPM
			, changesData: parser.midiheader.changesResolutionBPM
			, lyrics: parser.midiheader.lyricsList
			, key: parser.midiheader.keyFlatSharp
			, mode: parser.midiheader.keyMajMin
			, startMeter: { count: parser.midiheader.meterCount, division: parser.midiheader.meterDivision }
			, metersData: parser.midiheader.metersList
			, signs: parser.midiheader.signsList
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
			for (var ch = 0; ch < miditrack.trackChords.length; ch++) {
				var midichord: TrackChord = miditrack.trackChords[ch];
				var newchord: MIDISongChord = { when: midichord.startMs, notes: [], channel: midichord.channelidx };
				if (maxWhen < midichord.startMs) {
					maxWhen = midichord.startMs;
				}

				for (var n = 0; n < midichord.tracknotes.length; n++) {
					var midinote: TrackNote = midichord.tracknotes[n];
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
type StatPitch = {
	track: number;
	channel: number;
	note: TrackNote;
	//existsWhen: number
	fromChord: TrackChord;
};
type StatWhen = {
	when: number;
	notes: StatPitch[];
	pitches: number[];
	shape: string;
};
function timeMsNear(a: number, b: number): boolean {
	return Math.abs(a - b) < 20;
}
function takeNearWhen(when: number, statArr: StatWhen[]): StatWhen {
	for (let ii = 0; ii < statArr.length; ii++) {
		let xsts = statArr[ii];
		for (let nn = 0; nn < xsts.notes.length; nn++) {
			//let noteWhen = xsts.notes[nn].existsWhen;
			let noteWhen = xsts.notes[nn].fromChord.startMs;
			if (timeMsNear(when, noteWhen)) {
				return xsts;
			}
		}
	}
	let newWhen: StatWhen = { when: when, notes: [], pitches: [],shape:"" };
	statArr.push(newWhen);
	return newWhen;
}
function findNearestStart(when: number, statArr: StatWhen[]): number {
	let delta = 321;
	let newWhen = when;
	for (let ss = 0; ss < statArr.length; ss++) {
		let newDelta = Math.abs(statArr[ss].when - when);
		if (newDelta < delta) {
			delta = newDelta;
			newWhen = statArr[ss].when;
		}
	}
	return newWhen;
}
function findPreMeter(when: number, midiParser: MidiParser): { count: number, part: number } {
	let meter: { count: number, part: number } = { count: 4, part: 4 };
	for (let ii = 0; ii < midiParser.midiheader.metersList.length; ii++) {
		if (midiParser.midiheader.metersList[ii].ms > when) {
			break;
		}
		meter.count = midiParser.midiheader.metersList[ii].count;
		meter.part = midiParser.midiheader.metersList[ii].division;
	}
	return meter;
}
function findPreTempo(when: number, midiParser: MidiParser): number {
	let bpm: number = 120;
	for (let ii = 0; ii < midiParser.midiheader.metersList.length; ii++) {
		if (midiParser.midiheader.changesResolutionBPM[ii].ms > when) {
			break;
		}
		bpm = midiParser.midiheader.changesResolutionBPM[ii].bpm;
	}
	return bpm;
}
function dumpStat(midiParser: MidiParser) {
	//console.log('dumpStat');
	let statArr: StatWhen[] = [];
	for (let tt = 0; tt < midiParser.parsedTracks.length; tt++) {
		let track = midiParser.parsedTracks[tt];
		for (let cc = 0; cc < track.trackChords.length; cc++) {
			let chord = track.trackChords[cc];
			//let whenStart = chord.when;
			//whenStart=Math.round(whenStart/25)*25;
			let point = takeNearWhen(chord.startMs, statArr);
			for (let nn = 0; nn < chord.tracknotes.length; nn++) {
				point.notes.push({
					track: tt
					, channel: chord.channelidx
					, note: chord.tracknotes[nn]
					//, existsWhen: chord.when
					, fromChord: chord
				});
				//point.sumavg=point.sumavg+chord.tracknotes[nn].basePitch;
				if(chord.channelidx==9){
					//
				}else{
				let tone = chord.tracknotes[nn].basePitch % 12;
				if (point.pitches.indexOf(tone) < 0) {
					point.pitches.push(tone);
				}}
			}
		}
	}
	for (let ss = 0; ss < statArr.length; ss++) {
		let one = statArr[ss];
		let smm = 0;
		for (let nn = 0; nn < one.notes.length; nn++) {
			//smm = smm + one.notes[nn].existsWhen;
			smm = smm + one.notes[nn].fromChord.startMs;
		}
		one.when = Math.round(smm / one.notes.length);
		for (let nn = 0; nn < one.notes.length; nn++) {
			one.notes[nn].fromChord.startMs = one.when;
		}
		one.pitches.sort();
		one.shape=one.pitches.toString();
	}
	statArr.sort((a: StatWhen, b: StatWhen) => {
		return a.when - b.when;
	});
	console.log(statArr);
	let lastStart = 0;
	if (statArr.length > 0) {
		lastStart = statArr[statArr.length - 1].when;
	}
	let currentBarStart = 0;

	//let barMeterCount = midiParser.header.meterCount;
	//let barMeterPart = midiParser.header.meterDivision;
	//let barTempo = midiParser.header.tempoBPM;
	let barDuration = 0;//1000 * (4 * 60 / barTempo) * (barMeterCount / barMeterPart);

	let barSign = 0;
	let barIdx = 1;
	//console.log(lastStart, ':', barIdx, barTempo, ('' + barMeterCount + '/' + barMeterPart), barStart, ('+' + barDuration));
	while (currentBarStart + barDuration < lastStart) {
		let currentMeter = findPreMeter(currentBarStart + 99, midiParser);
		let currentBPM = findPreTempo(currentBarStart + 99, midiParser);

		barDuration = 1000 * (4 * 60 / currentBPM) * (currentMeter.count / currentMeter.part);
		//console.log(barDuration,(currentBarStart+barDuration));
		let nextStart = findNearestStart(currentBarStart + barDuration, statArr);

		//console.log(barStart + barDuration, nextStart);
		barDuration = nextStart - currentBarStart;
		//let retempo = 1000 * (4 * 60 / barDuration) * (currentMeter.count / currentMeter.part)
		//console.log(barIdx, Math.round(retempo), ('' + currentMeter.count + '/' + currentMeter.part), Math.round(currentBarStart), ('+' + Math.round(barDuration)));


		currentBarStart = nextStart;
		barIdx++;

	}
}