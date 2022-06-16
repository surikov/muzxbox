
type StartDuration = {
	start: number;
	duration: number;
};
function countMeasureSteps(meter: ZvoogMeter, rhythm: ZvoogMeter[]): number {
	let currentStepStart: ZvoogMeter = { count: 0, division: 1 };
	let stepNN = 0;
	let stepCnt = 0;
	while (DUU(currentStepStart).lessThen(meter)) {
		currentStepStart = DUU(currentStepStart).plus(rhythm[stepNN]);
		stepNN++;
		stepCnt++;
		if (stepNN >= rhythm.length) {
			stepNN = 0;
		}
	}
	return stepCnt;
}

function countSteps(meter: ZvoogMeter, rhythmPattern: ZvoogMeter[]): number {
	let stepStartMeter: ZvoogMeter = { count: 0, division: 1 };
	let nn = 0;
	let stepIdx = 0;
	while (DUU(stepStartMeter).lessThen(meter)) {
		stepStartMeter = DUU(stepStartMeter).plus(rhythmPattern[nn]);
		nn++;
		stepIdx++;
		if (nn >= rhythmPattern.length) {
			nn = 0;
		}
	}
	return stepIdx;
}
function findMeasureStep(measures: ZvoogMeasure[], rhythmPattern: ZvoogMeter[], ratioDuration: number, xx: number): null | ZvoogStepIndex {
	let measureStartX = 0;
	let measureIdx = 0;
	for (measureIdx = 0; measureIdx < measures.length; measureIdx++) {
		let measure = measures[measureIdx];
		let measureLength = ratioDuration * meter2seconds(measure.tempo, measure.meter);
		//console.log('findMeasureStep',measureStartX , measureLength , xx);
		if (measureStartX + measureLength > xx) {
			let stepStartMeter: ZvoogMeter = { count: 0, division: 1 };
			let nn = 0;
			let stepIdx = -1;
			while (measureStartX + ratioDuration * meter2seconds(measure.tempo, stepStartMeter) < xx) {
				stepStartMeter = DUU(stepStartMeter).plus(rhythmPattern[nn]);
				nn++;
				stepIdx++;
				if (nn >= rhythmPattern.length) {
					nn = 0;
				}
			}
			if (stepIdx < 0) {
				stepIdx = 0;
			}
			return { measure: measureIdx, step: stepIdx };
		}
		measureStartX = measureStartX + measureLength;
	}
	return null;
}
function measuresAndStepDuration(song: ZvoogSchedule, count: number, step: number, rhythmPattern: ZvoogMeter[]): StartDuration {
	if (count < song.measures.length) {
		let measureStartTime = 0;
		let measureIdx = 0;
		for (let mm = 0; mm < song.measures.length; mm++) {
			measureIdx = mm;
			if (mm < count) {
				let measureDuration = meter2seconds(song.measures[mm].tempo, song.measures[mm].meter);
				measureStartTime = measureStartTime + measureDuration;
			} else {
				break;
			}
		}
		let stepNN = 0;
		let stepCnt = 0;
		let stepStartTime = 0;
		let currentStepStart: ZvoogMeter = { count: 0, division: 1 };
		if (measureIdx < song.measures.length) {
			while (DUU(currentStepStart).lessThen(song.measures[measureIdx].meter) && stepCnt < step) {
				currentStepStart = DUU(currentStepStart).plus(rhythmPattern[stepNN]);
				stepNN++;
				stepCnt++;
				if (stepNN >= rhythmPattern.length) {
					stepNN = 0;
				}
			}
			stepStartTime = meter2seconds(song.measures[measureIdx].tempo, currentStepStart);
		}
		return {
			start: measureStartTime + stepStartTime
			, duration: meter2seconds(song.measures[measureIdx].tempo, rhythmPattern[stepNN])
		};
	} else {
		return {
			start: 0
			, duration: 1
		};
	}
}
function progressionDuration(progression: ZvoogChordMelody[]): ZvoogMeter {
	let duration: ZvoogMeter = { count: 0, division: 1 };
	for (let i = 0; i < progression.length; i++) {
		//duration = plusMeter(duration, progression[i].duration);
		duration = DUU(duration).plus(progression[i].duration);
	}
	return duration;
}
function adjustPartLeadPad(voice: ZvoogInstrumentVoice, fromPosition: ZvoogMeter, toPosition: ZvoogMeter, measures: ZvoogMeasure[]) {
	let lowest = 120;
	let highest = 0;
	let measurePosition: ZvoogMeter = { count: 0, division: 1 };
	for (let m = 0; m < voice.measureChords.length; m++) {
		let mch = voice.measureChords[m].chords;
		for (let ch = 0; ch < mch.length; ch++) {
			let chord = mch[ch];
			//let chordPosition = plusMeter(measurePosition, chord.when);
			let chordPosition = DUU(measurePosition).plus(chord.when);
			//if (meterMore(chordPosition, fromPosition) >= 0 && meterMore(chordPosition, toPosition) < 0) {
			if (DUU(chordPosition).notLessThen(fromPosition) && DUU(chordPosition).lessThen(toPosition)) {
				for (let e = 0; e < chord.envelopes.length; e++) {
					let envelope = chord.envelopes[e];
					for (let p = 0; p < envelope.pitches.length; p++) {
						let pitch = envelope.pitches[p];
						if (pitch.pitch < lowest) {
							lowest = pitch.pitch;
						}
						if (pitch.pitch > highest) {
							highest = pitch.pitch;
						}
					}
				}
			}
		}
		measurePosition = DUU(measurePosition).plus(measures[m].meter);
	}
	if (lowest < 3 * 12 + 4) {
		let shift = 1 * 12;
		if (lowest < 2 * 12 + 4) shift = 2 * 12;
		if (lowest < 1 * 12 + 4) shift = 3 * 12;
		if (lowest < 0 * 12 + 4) shift = 4 * 12;
		//console.log('adjustPartLeadPad', lowest, '>', highest, ':', shift, voice.title, fromPosition);
		let measurePosition: ZvoogMeter = { count: 0, division: 1 };
		for (let m = 0; m < voice.measureChords.length; m++) {
			let mch = voice.measureChords[m].chords;
			for (let ch = 0; ch < mch.length; ch++) {
				let chord = mch[ch];
				//let chordPosition = plusMeter(measurePosition, chord.when);
				let chordPosition = DUU(measurePosition).plus(chord.when);
				//if (meterMore(chordPosition, fromPosition) >= 0 && meterMore(chordPosition, toPosition) < 0) {
				if (DUU(chordPosition).notLessThen(fromPosition) && DUU(chordPosition).lessThen(toPosition)) {
					for (let e = 0; e < chord.envelopes.length; e++) {
						let envelope = chord.envelopes[e];
						for (let p = 0; p < envelope.pitches.length; p++) {
							let pitch = envelope.pitches[p];
							pitch.pitch = pitch.pitch + shift;
						}
					}
				}
			}
			//measurePosition = plusMeter(measurePosition, measures[m].meter);
			measurePosition = DUU(measurePosition).plus(measures[m].meter);
		}
	}
	if (highest > 8 * 12 + 4) {
		let shift = 1 * 12;
		if (highest > 9 * 12 + 4) shift = 2 * 12;
		if (highest > 10 * 12 + 4) shift = 3 * 12;
		if (highest > 11 * 12 + 4) shift = 4 * 12;
		//console.log('adjustPartLeadPad', lowest, '>', highest, ':', shift, voice.title, fromPosition);
		let measurePosition: ZvoogMeter = { count: 0, division: 1 };
		for (let m = 0; m < voice.measureChords.length; m++) {
			let mch = voice.measureChords[m].chords;
			for (let ch = 0; ch < mch.length; ch++) {
				let chord = mch[ch];
				//let chordPosition = plusMeter(measurePosition, chord.when);
				let chordPosition = DUU(measurePosition).plus(chord.when);
				//if (meterMore(chordPosition, fromPosition) >= 0 && meterMore(chordPosition, toPosition) < 0) {
				if (DUU(chordPosition).notLessThen(fromPosition) && DUU(chordPosition).lessThen(toPosition)) {
					for (let e = 0; e < chord.envelopes.length; e++) {
						let envelope = chord.envelopes[e];
						for (let p = 0; p < envelope.pitches.length; p++) {
							let pitch = envelope.pitches[p];
							pitch.pitch = pitch.pitch - shift;
						}
					}
				}
			}
			//measurePosition = plusMeter(measurePosition, measures[m].meter);
			measurePosition = DUU(measurePosition).plus(measures[m].meter);
		}
	}
}
function adjustPartBass(voice: ZvoogInstrumentVoice, fromPosition: ZvoogMeter, toPosition: ZvoogMeter, measures: ZvoogMeasure[]) {
	let lowest = 120;
	let measurePosition: ZvoogMeter = { count: 0, division: 1 };
	for (let m = 0; m < voice.measureChords.length; m++) {
		let mch = voice.measureChords[m].chords;
		for (let ch = 0; ch < mch.length; ch++) {
			let chord = mch[ch];
			//let chordPosition = plusMeter(measurePosition, chord.when);
			let chordPosition = DUU(measurePosition).plus(chord.when);
			//if (meterMore(chordPosition, fromPosition) >= 0 && meterMore(chordPosition, toPosition) < 0) {
			if (DUU(chordPosition).notLessThen(fromPosition) && DUU(chordPosition).lessThen(toPosition)) {
				for (let e = 0; e < chord.envelopes.length; e++) {
					let envelope = chord.envelopes[e];
					for (let p = 0; p < envelope.pitches.length; p++) {
						let pitch = envelope.pitches[p];
						if (pitch.pitch < lowest) {
							lowest = pitch.pitch;
						}
					}
				}
			}
		}
		//measurePosition = plusMeter(measurePosition, measures[m].meter);
		measurePosition = DUU(measurePosition).plus(measures[m].meter);
	}
	if (lowest < 12 + 12 + 4) {//let shift=36;
		let shift = 12;
		if (lowest < 12 + 4) shift = 24;
		if (lowest < 4) shift = 36;
		//shift=shift+24;
		//console.log('adjustPartBass',lowest, '+', shift, voice.title,fromPosition);
		let measurePosition: ZvoogMeter = { count: 0, division: 1 };
		for (let m = 0; m < voice.measureChords.length; m++) {
			let mch = voice.measureChords[m].chords;
			for (let ch = 0; ch < mch.length; ch++) {
				let chord = mch[ch];
				//let chordPosition = plusMeter(measurePosition, chord.when);
				let chordPosition = DUU(measurePosition).plus(chord.when);
				if (DUU(chordPosition).notLessThen(fromPosition) && DUU(chordPosition).lessThen(toPosition)) {
					//if (meterMore(chordPosition, fromPosition) >= 0 && meterMore(chordPosition, toPosition) < 0) {
					for (let e = 0; e < chord.envelopes.length; e++) {
						let envelope = chord.envelopes[e];
						for (let p = 0; p < envelope.pitches.length; p++) {
							let pitch = envelope.pitches[p];
							pitch.pitch = pitch.pitch + shift;
						}
					}
				}
			}
			//measurePosition = plusMeter(measurePosition, measures[m].meter);
			measurePosition = DUU(measurePosition).plus(measures[m].meter);
		}
	}
}
function createBreakList(originalProg: ZvoogChordMelody[], targetProg: ZvoogChordMelody[], measures: ZvoogMeasure[]): ZvoogMeter[] {
	let list: ZvoogMeter[] = [{ count: 0, division: 1 }];
	let fromPosition: ZvoogMeter = { count: 0, division: 1 };
	for (let i = 0; i < originalProg.length; i++) {
		let part = originalProg[i];
		//let toPosition = plusMeter(fromPosition, part.duration);
		let toPosition = DUU(fromPosition).plus(part.duration);
		list.push({ count: toPosition.count, division: toPosition.division });
		fromPosition = toPosition;
	}
	fromPosition = { count: 0, division: 1 };
	for (let i = 0; i < targetProg.length; i++) {
		let part = targetProg[i];
		//let toPosition = plusMeter(fromPosition, part.duration);
		let toPosition = DUU(fromPosition).plus(part.duration);
		for (let kk = 0; kk < list.length - 1; kk++) {
			let kkPos = list[kk];
			let nxtPos = list[kk + 1];
			//if (meterMore(kkPos, toPosition) == 0) {
			if (DUU(kkPos).equalsTo(toPosition)) {
				break;
			} else {
				//if (meterMore(kkPos, toPosition) < 0 && meterMore(nxtPos, toPosition) > 0) {
				if (DUU(kkPos).lessThen(toPosition) && DUU(nxtPos).moreThen(toPosition)) {
					list.splice(kk + 1, 0, { count: toPosition.count, division: toPosition.division });
					break;
				}
			}
		}
		fromPosition = toPosition;
	}
	return list;
}
function adjustVoiceLowHigh(voice: ZvoogInstrumentVoice, originalProg: ZvoogChordMelody[], targetProg: ZvoogChordMelody[], measures: ZvoogMeasure[], trackIsBass: boolean) {
	let list = createBreakList(originalProg, targetProg, measures);
	for (let i = 0; i < list.length - 1; i++) {
		if (trackIsBass) {
			adjustPartBass(voice, list[i], list[i + 1], measures);
		} else {
			adjustPartLeadPad(voice, list[i], list[i + 1], measures);
		}
	}
}
let default8rhytym: ZvoogMeter[] = [
	{ count: 1, division: 8 }, { count: 1, division: 8 }
	, { count: 1, division: 8 }, { count: 1, division: 8 }

];
