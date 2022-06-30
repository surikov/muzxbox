class PianoRollRenderer {
	contentMain1: TileAnchor;
	contentMain4: TileAnchor;
	contentMain16: TileAnchor;
	contentMain64: TileAnchor;
	//contentMain256: TileAnchor;

	contentSecond1: TileAnchor;
	contentSecond4: TileAnchor;
	contentSecond16: TileAnchor;
	contentSecond64: TileAnchor;
	//contentSecond256: TileAnchor;

	contentOther1: TileAnchor;
	contentOther4: TileAnchor;
	contentOther16: TileAnchor;
	contentOther64: TileAnchor;
	contentOther256: TileAnchor;

	measureOtherVoicesLayerGroup: SVGElement;
	measureSecondVoicesLayerGroup: SVGElement;
	measureMainVoiceLayerGroup: SVGElement;

	attach(zRender: ZRender) {
		this.measureOtherVoicesLayerGroup = (document.getElementById('measureOtherVoicesLayerGroup') as any) as SVGElement;
		this.measureSecondVoicesLayerGroup = (document.getElementById('measureSecondVoicesLayerGroup') as any) as SVGElement;
		this.measureMainVoiceLayerGroup = (document.getElementById('measureMainVoiceLayerGroup') as any) as SVGElement;
		this.initMainAnchors(zRender);
		this.initSecondAnchors(zRender);
		this.initOthersAnchors(zRender);
	}
	clearPRAnchorsContent(zRender: ZRender, wholeWidth: number): void {
		let anchors: TileAnchor[] = [
			this.contentMain1, this.contentMain4, this.contentMain16, this.contentMain64//, this.contentMain256
			, this.contentSecond1, this.contentSecond4, this.contentSecond16, this.contentSecond64//, this.contentSecond256
			, this.contentOther1, this.contentOther4, this.contentOther16, this.contentOther64, this.contentOther256
		];

		for (let i = 0; i < anchors.length; i++) {
			zRender.clearResizeSingleAnchor(zRender.muzXBox.currentSchedule, anchors[i], wholeWidth);
		}

	}
	initMainAnchors(zRender: ZRender) {
		this.contentMain1 = { id: 'contentMain1', xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: zRender.zoomMin, hideZoom: zRender.zoomNote, content: [] };
		this.contentMain4 = { id: 'contentMain4', xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: zRender.zoomNote, hideZoom: zRender.zoomMeasure, content: [] };
		this.contentMain16 = { id: 'contentMain16', xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: zRender.zoomMeasure, hideZoom: zRender.zoomSong, content: [] };
		this.contentMain64 = { id: 'contentMain64', xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: zRender.zoomSong, hideZoom: zRender.zoomFar, content: [] };
		//this.contentMain256 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: zRender.zoomFar, hideZoom: zRender.zoomMax + 1, content: [] };
		zRender.layers.push({
			g: this.measureMainVoiceLayerGroup, anchors: [
				this.contentMain1, this.contentMain4, this.contentMain16, this.contentMain64//, this.contentMain256
			]
		});
	}
	initSecondAnchors(zRender: ZRender) {
		this.contentSecond1 = TAnchor(0, 0, 1111, 1111, zRender.zoomMin, zRender.zoomNote,  'contentSecond1' );
		this.contentSecond4 = TAnchor(0, 0, 1111, 1111, zRender.zoomNote, zRender.zoomMeasure,'contentSecond4');
		this.contentSecond16 = TAnchor(0, 0, 1111, 1111, zRender.zoomMeasure, zRender.zoomSong,'contentSecond16');
		this.contentSecond64 = TAnchor(0, 0, 1111, 1111, zRender.zoomSong, zRender.zoomFar,'contentSecond64');
		//this.contentSecond256 = TAnchor(0, 0, 1111, 1111, zRender.zoomFar, zRender.zoomMax + 1);
		zRender.layers.push({
			g: this.measureSecondVoicesLayerGroup, anchors: [
				this.contentSecond1, this.contentSecond4, this.contentSecond16, this.contentSecond64//, this.contentSecond256
			]
		});
	}
	initOthersAnchors(zRender: ZRender) {
		this.contentOther1 = TAnchor(0, 0, 1111, 1111, zRender.zoomMin, zRender.zoomNote,'contentOther1');
		this.contentOther4 = TAnchor(0, 0, 1111, 1111, zRender.zoomNote, zRender.zoomMeasure,'contentOther4');
		this.contentOther16 = TAnchor(0, 0, 1111, 1111, zRender.zoomMeasure, zRender.zoomSong,'contentOther16');
		this.contentOther64 = TAnchor(0, 0, 1111, 1111, zRender.zoomSong, zRender.zoomFar,'contentOther64');
		this.contentOther256 = TAnchor(0, 0, 1111, 1111, zRender.zoomFar, zRender.zoomMax + 1,'contentOther256');
		zRender.layers.push({
			g: this.measureOtherVoicesLayerGroup, anchors: [
				this.contentOther1, this.contentOther4, this.contentOther16, this.contentOther64, this.contentOther256
			]
		});
	}

	addParameterMeasure(ratioDuration: number, ratioThickness: number, song: ZvoogSchedule, parameter: ZvoogParameterData
		, measureNum: number, time: number, css: string, anchors: TileAnchor[]) {
		let beforeFirst: null | ZvoogCurvePoint = {
			skipMeasures: measureNum
			, skipSteps: { count: -1, division: 1 }
			, velocity: 0
		};
		let current: null | ZvoogCurvePoint = findNextCurvePoint(parameter.points, beforeFirst);
		if (measureNum == 0 && (current == null || current.skipMeasures > 0 || current.skipSteps.count > 0)) {
			current = {
				skipMeasures: 0
				, skipSteps: { count: 0, division: 1 }
				, velocity: 0
			};
		}
		let topGridMargin = topGridMarginTp(song, ratioThickness);
		while ((current) && current.skipMeasures == measureNum) {
			//console.log(measureNum, parameter, current);
			let to: null | ZvoogCurvePoint = findNextCurvePoint(parameter.points, current);
			if (to == null) {
				to = {
					skipMeasures: song.measures.length
					, skipSteps: { count: 0, division: 1 }
					, velocity: current.velocity
				};
			}
			//console.log(measureNum, parameter.caption, current.skipMeasures, current.skipSteps, current.velocity, '>', to.skipMeasures, to.skipSteps, to.velocity);
			let line: TileLine = {
				x1: leftGridMargin + point2seconds(song, current) * ratioDuration
				, x2: leftGridMargin + point2seconds(song, to) * ratioDuration
				, y1: topGridMargin + (128 - current.velocity + 0.5) * ratioThickness
				, y2: topGridMargin + (128 - to.velocity + 1 - 0.5) * ratioThickness
				, css: css
			};
			
			for (let aa = 0; aa < anchors.length; aa++) {
				let clone=cloneLine(line);
				clone.id='param-'+aa+'-'+measureNum+'-'+rid();
				console.log(clone);
				anchors[aa].content.push(cloneLine(line));
			}
			console.log(anchors);
			current = to;
		}
		//let pointMeasure = 0;
		//let pointStep = { count: 0, division: 1 };
		//for (let pp = 0; pp > parameter.points.length; pp++) {

		//}
		/*
		let point: ZvoogCurvePoint = parameter.points[0];
		for (let aa = 0; aa < anchors.length; aa++) {
			let line: TileLine = {
				x1: 0
				, x2: 0 + 1
				, y1: 128 - point.velocity - 0.5 * ratioThickness
				, y2: 128 - point.velocity + 1 - 0.5 * ratioThickness
				, css: css
			};
			anchors[aa].content.push(cloneLine(line));
		}*/
	}
	addMeasureLyrics(song: ZvoogSchedule, time: number, mm: number, ratioDuration: number, ratioThickness: number, anchor: TileAnchor, css: string) {
		let topGridMargin = topGridMarginTp(song, ratioThickness);
		//let time = 0;
		//for (let mm = 0; mm < song.measures.length; mm++) {
		let measure = song.measures[mm];
		for (let pp = 0; pp < measure.points.length; pp++) {
			//let yShift = (pp % 2) ? 20: 10;
			let yShift = 44;
			let point = measure.points[pp];
			let txt: TileText = {
				x: leftGridMargin + (time + meter2seconds(measure.tempo, point.when)) * ratioDuration
				, y: topGridMargin + 12 * octaveCount * ratioThickness + yShift
				, text: point.lyrics
				, css: css
			};
			anchor.content.push(txt);
			//console.log(txt);
		}
		//let measureDuration = meter2seconds(song.measures[mm].tempo, song.measures[mm].meter);
		//time = time + measureDuration;
		//}
	}
	addSelectKnobs64(song: ZvoogSchedule, time: number, mm: number, ratioDuration: number, ratioThickness: number, anchor: TileAnchor) {
		let topGridMargin = topGridMarginTp(song, ratioThickness);
		let knob: TileRectangle = {
			x: leftGridMargin + time * ratioDuration
			, y: topGridMargin + 12 * octaveCount * ratioThickness
			, w: 8 * ratioThickness
			, h: 8 * ratioThickness
			, css: 'actionSpot64'
			, action: (x: number, y: number) => { console.log('click', x, y); }
		};
		anchor.content.push(knob);
		let txt: TileText = {
			x: leftGridMargin + time * ratioDuration + 2 * ratioThickness
			, y: topGridMargin + 12 * octaveCount * ratioThickness + 3 * ratioThickness
			, text: 'options'
			, css: 'knobLabel64'
			, action: (x: number, y: number) => { console.log('click', x, y); }
		};
		anchor.content.push(txt);
	}
	addSelectKnobs16(song: ZvoogSchedule, time: number, mm: number, ratioDuration: number, ratioThickness: number, anchor: TileAnchor, action: (x: number, y: number) => void | undefined) {
		let topGridMargin = topGridMarginTp(song, ratioThickness);
		let knob: TileRectangle = {
			x: leftGridMargin + time * ratioDuration
			, y: topGridMargin + 12 * octaveCount * ratioThickness
			, w: 4 * ratioThickness
			, h: 4 * ratioThickness
			, css: 'actionSpot16'
			, action: action
		};
		anchor.content.push(knob);
		let txt: TileText = {
			x: leftGridMargin + time * ratioDuration + 1 * ratioThickness
			, y: topGridMargin + 12 * octaveCount * ratioThickness + 2 * ratioThickness
			, text: 'options'
			, css: 'knobLabel16'
			, action: action
		};
		anchor.content.push(txt);
	}
	addSelectKnobs4(song: ZvoogSchedule, time: number, mm: number, ratioDuration: number, ratioThickness: number, anchor: TileAnchor) {
		let topGridMargin = topGridMarginTp(song, ratioThickness);
		let knob: TileRectangle = {
			x: leftGridMargin + time * ratioDuration
			, y: topGridMargin + 12 * octaveCount * ratioThickness
			, w: 2 * ratioThickness
			, h: 2 * ratioThickness
			, css: 'actionSpot4'
			, action: (x: number, y: number) => { console.log('click', x, y); }
		};
		anchor.content.push(knob);
		let txt: TileText = {
			x: leftGridMargin + time * ratioDuration + 0.5 * ratioThickness
			, y: topGridMargin + 12 * octaveCount * ratioThickness + 1 * ratioThickness
			, text: '' + mm + 'opt'
			, css: 'knobLabel4'
			, action: (x: number, y: number) => { console.log('click', x, y); }
		};
		anchor.content.push(txt);
	}
	addSelectKnobs1(song: ZvoogSchedule, time: number, mm: number, rhythmPattern: ZvoogMeter[], ratioDuration: number, ratioThickness: number, anchor: TileAnchor) {
		let topGridMargin = topGridMarginTp(song, ratioThickness);
		let stepNN = 0;
		let position: ZvoogMeter = rhythmPattern[stepNN];
		let positionDuration = 0;
		while (DUU(position).notMoreThen(song.measures[mm].meter)) {
			let posX = leftGridMargin + (time + positionDuration) * ratioDuration;

			let knob: TileRectangle = {
				x: posX
				, y: topGridMargin + 12 * octaveCount * ratioThickness
				, w: 1
				, h: 1
				, css: 'actionSpot1'
				, action: (x: number, y: number) => { console.log('click', x, y); }
			};
			anchor.content.push(knob);
			let txt: TileText = {
				x: posX + 0.005 * ratioThickness
				, y: topGridMargin + 12 * octaveCount * ratioThickness + 1
				, text: 'options'
				, css: 'knobLabel1'
				, action: (x: number, y: number) => { console.log('click', x, y); }
			};
			anchor.content.push(txt);

			positionDuration = meter2seconds(song.measures[mm].tempo, position);
			stepNN++;
			if (stepNN >= rhythmPattern.length) {
				stepNN = 0;
			}
			position = DUU(position).plus(rhythmPattern[stepNN]);
		}
	}
	addInstrumentMeasure(ratioDuration: number, ratioThickness: number, song: ZvoogSchedule, voice: ZvoogInstrumentVoice, measureNum: number, time: number, css: string, anchors: TileAnchor[]): number {
		let topGridMargin = topGridMarginTp(song, ratioThickness);
		let measure = voice.measureChords[measureNum];
		var measureMaxLen = anchors[0].ww;
		let yShift = gridHeightTp(ratioThickness) - (0.5 - 0 * 12) * ratioThickness;
		for (let cc = 0; cc < measure.chords.length; cc++) {
			let chord = measure.chords[cc];
			for (let ee = 0; ee < chord.envelopes.length; ee++) {
				let envelope = chord.envelopes[ee];
				let pitchWhen = meter2seconds(song.measures[measureNum].tempo, chord.when);
				for (let pp = 0; pp < envelope.pitches.length; pp++) {
					let pitch = envelope.pitches[pp];
					let slide = pitch.pitch;
					if (pp + 1 < envelope.pitches.length) {
						slide = envelope.pitches[pp + 1].pitch;
					}
					let pitchDuration = meter2seconds(song.measures[measureNum].tempo, pitch.duration);
					let startShift = 0;
					if (pp == 0) {
						startShift = 0.5 * ratioThickness;
					}
					let endShift = 0;
					if (pp == envelope.pitches.length - 1) {
						endShift = -0.49 * ratioThickness;
					}
					let xx1 = leftGridMargin + (time + pitchWhen) * ratioDuration + startShift;
					let xx2 = leftGridMargin + (time + pitchWhen + pitchDuration) * ratioDuration + endShift;
					if (xx1 >= xx2) {
						xx2 = xx1 + 1;
					}
					let line: TileLine = {
						x1: xx1//leftGridMargin + (time + pitchWhen) * ratioDuration + startShift
						, x2: xx2//leftGridMargin + (time + pitchWhen + pitchDuration) * ratioDuration + endShift
						, y1: topGridMargin + yShift - pitch.pitch * ratioThickness//(128 - pitch.pitch) * ratioThickness-0.5*ratioThickness
						, y2: topGridMargin + yShift - slide * ratioThickness//(128 - slide) * ratioThickness - 0.5 * ratioThickness
						, css: css
					};

					//line.css = css;
					for (let aa = 0; aa < anchors.length; aa++) {
						if (line.x2 - anchors[aa].xx > anchors[aa].ww) {
							//console.log((line.x2- anchors[aa].xx), anchors[aa].ww);
							anchors[aa].ww = line.x2 - anchors[aa].xx;
						}
						anchors[aa].content.push(cloneLine(line));
						if (measureMaxLen < anchors[aa].ww) {
							measureMaxLen = anchors[aa].ww;
						}
					}
					pitchWhen = pitchWhen + pitchDuration;
				}
			}
		}
		return measureMaxLen;
	}
	addDrumMeasure(drumCounter: number, ratioDuration: number, ratioThickness: number, song: ZvoogSchedule, voice: ZvoogPercussionVoice, measureNum: number, time: number, css: string, anchors: TileAnchor[]): number {
		//let topGridMargin = topGridMarginTp(song, ratioThickness);
		let measure = voice.measureBunches[measureNum];
		var measureMaxLen = anchors[0].ww;
		//let yShift = gridHeightTp(ratioThickness) - (0.5 - 0 * 12) * ratioThickness;
		for (let cc = 0; cc < measure.bunches.length; cc++) {
			let chord: ZvoogChordPoint = measure.bunches[cc];
			//for (let ee = 0; ee < chord.envelopes.length; ee++) {
			//let envelope = chord.envelopes[ee];
			let pitchWhen = meter2seconds(song.measures[measureNum].tempo, chord.when);
			//for (let pp = 0; pp < envelope.pitches.length; pp++) {
			//let pitch = envelope.pitches[pp];
			//let slide = pitch.pitch;
			//if (pp + 1 < envelope.pitches.length) {
			//	slide = envelope.pitches[pp + 1].pitch;
			//}
			//let pitchDuration = meter2seconds(song.measures[measureNum].tempo, pitch.duration);
			//let startShift = 0;
			//if (pp == 0) {
			//	startShift = 0.5 * ratioThickness;
			//}
			//let endShift = 0;
			//if (pp == envelope.pitches.length - 1) {
			//	endShift = -0.49 * ratioThickness;
			//}
			let xx1 = leftGridMargin + (time + pitchWhen) * ratioDuration;// + startShift;
			let xx2 = leftGridMargin + (time + pitchWhen + ratioThickness) * ratioDuration;// + endShift;
			if (xx1 >= xx2) {
				xx2 = xx1 + 1;
			}
			/*let line: TileLine = {
				x1: xx1//leftGridMargin + (time + pitchWhen) * ratioDuration + startShift
				, x2: xx2//leftGridMargin + (time + pitchWhen + pitchDuration) * ratioDuration + endShift
				, y1: topGridMargin + yShift - drumCounter * ratioThickness//(128 - pitch.pitch) * ratioThickness-0.5*ratioThickness
				, y2: topGridMargin + yShift// - slide * ratioThickness//(128 - slide) * ratioThickness - 0.5 * ratioThickness
				, css: css
			};*/
			let dot: TileRectangle = {
				x: xx1
				, y: drumCounter * ratioThickness
				, w: ratioThickness
				, h: ratioThickness
				, rx: ratioThickness / 8
				, ry: ratioThickness / 8
				, css: css
			}


			//line.css = css;
			for (let aa = 0; aa < anchors.length; aa++) {
				if (dot.x + dot.w - anchors[aa].xx > anchors[aa].ww) {
					//console.log((line.x2- anchors[aa].xx), anchors[aa].ww);
					anchors[aa].ww = dot.x + dot.w - anchors[aa].xx;
				}
				anchors[aa].content.push(cloneRectangle(dot));
				if (measureMaxLen < anchors[aa].ww) {
					measureMaxLen = anchors[aa].ww;
				}
			}
			//pitchWhen = pitchWhen + pitchDuration;
			//}
			//}
		}
		return measureMaxLen;
	}




	createNoteUpAction(layerSelector: LayerSelector, tt: number, vv: number): (x: number, y: number) => void {
		let up = layerSelector.upInstrument(tt, vv);
		return (x: number, y: number) => {
			up();
			//console.log('click', x, y); 
		};
	}
	createNoteMenuAction(layerSelector: LayerSelector, tt: number, vv: number): (x: number, y: number) => void {
		//let up=layerSelector.upVox(tt, vv);
		return (x: number, y: number) => {
			//up();
			console.log('menu', x, y);
		};
	}
	addNotesKnobs(layerSelector: LayerSelector, ratioDuration: number, ratioThickness: number, song: ZvoogSchedule
		//, voice: ZvoogVoice
		, trackNum: number, voiceNum: number
		, measureNum: number, time: number, isMain: boolean
		, anchor: TileAnchor): void {
		let topGridMargin = topGridMarginTp(song, ratioThickness);
		let voice = song.tracks[trackNum].instruments[voiceNum];
		let measure = voice.measureChords[measureNum];
		let yShift = gridHeightTp(ratioThickness) - (0.5 - 0 * 12) * ratioThickness;
		for (let cc = 0; cc < measure.chords.length; cc++) {
			let chord = measure.chords[cc];
			for (let ee = 0; ee < chord.envelopes.length; ee++) {
				let envelope = chord.envelopes[ee];
				let pitchWhen = meter2seconds(song.measures[measureNum].tempo, chord.when);
				let pp = 0;
				//for (let pp = 0; pp < envelope.pitches.length; pp++) {
				let pitch = envelope.pitches[pp];
				/*let slide = pitch.pitch;
				if (pp + 1 < envelope.pitches.length) {
					slide = envelope.pitches[pp + 1].pitch;
				}*/
				let pitchDuration = meter2seconds(song.measures[measureNum].tempo, pitch.duration);
				//let startShift = 0;
				//if (pp == 0) {
				//	startShift = 0.5 * ratioThickness;
				//}
				//let endShift = 0;
				//if (pp == envelope.pitches.length - 1) {
				//	endShift = -0.49 * ratioThickness;
				//}
				let xx = leftGridMargin + (time + pitchWhen) * ratioDuration + 0.5;// + startShift;
				let yy = topGridMargin + yShift - pitch.pitch * ratioThickness + ratioThickness / 2 - 0.5;
				//let yy = topGridMargin  - pitch.pitch * ratioThickness;

				let knob: TileRectangle = {
					x: xx - 0.5
					, y: yy - 0.5
					, w: isMain ? 3 : 1
					, h: 1
					, rx: 0.5
					, ry: 0.5
					, css: 'actionSpot'
					, action: isMain ? this.createNoteMenuAction(layerSelector, trackNum, voiceNum) : this.createNoteUpAction(layerSelector, trackNum, voiceNum)
				};
				anchor.content.push(knob);
				pitchWhen = pitchWhen + pitchDuration;
				//}
			}
		}
	}
	needToFocusVoice(song: ZvoogSchedule, trackNum: number, voiceNum: number): boolean {
		let sonfino = this.findFocusedFilter(song.filters);
		if (sonfino < 0) {
			let tt = this.findFocusedTrack(song.tracks);
			if (tt < 0) tt = 0;
			if (tt == trackNum) {
				if (trackNum < song.tracks.length) {
					let track = song.tracks[trackNum];
					let trafi = this.findFocusedFilter(track.filters);
					if (trafi < 0) {
						let vv = this.findFocusedInstrument(track.instruments);
						if (vv < 0) vv = 0;
						if (vv == voiceNum) {
							if (voiceNum < track.instruments.length) {
								let voice = track.instruments[voiceNum];
								if (!voice.instrumentSetting.focus) {
									let vofi = this.findFocusedFilter(voice.filters);
									if (vofi < 0) return true;
								}
							}
						}
					}
				}
			}
		}
		return false;
	}
	needToFocusDrum(song: ZvoogSchedule, trackNum: number, drumNum: number): boolean {
		let sonfino = this.findFocusedFilter(song.filters);
		if (sonfino < 0) {
			let tt = this.findFocusedTrack(song.tracks);
			if (tt < 0) tt = 0;
			if (tt == trackNum) {
				if (trackNum < song.tracks.length) {
					let track = song.tracks[trackNum];
					let trafi = this.findFocusedFilter(track.filters);
					if (trafi < 0) {
						let vv = this.findFocusedDrum(track.percussions);
						if (vv < 0) vv = 0;
						if (vv == drumNum) {
							if (drumNum < track.percussions.length) {
								let voice = track.percussions[drumNum];
								if (!voice.percussionSetting.focus) {
									let vofi = this.findFocusedFilter(voice.filters);
									if (vofi < 0) return true;
								}
							}
						}
					}
				}
			}
		}
		return false;
	}
	needToSubFocusInstrument(song: ZvoogSchedule, trackNum: number, voiceNum: number): boolean {
		let sonfino = this.findFocusedFilter(song.filters);
		if (sonfino < 0) {
			let tt = this.findFocusedTrack(song.tracks);
			if (tt < 0) tt = 0;
			if (tt == trackNum) {
				if (trackNum < song.tracks.length) {
					let track = song.tracks[trackNum];
					let trafi = this.findFocusedFilter(track.filters);
					if (trafi < 0) {
						let vv = this.findFocusedInstrument(track.instruments);
						if (vv < 0) vv = 0;
						if (vv != voiceNum) {
							if (vv < track.instruments.length) {
								let avoice = track.instruments[vv];
								if (!avoice.instrumentSetting.focus) {
									let vofi = this.findFocusedFilter(avoice.filters);
									if (vofi < 0) return true;
								}
							}
						}
					}
				}
			}
		}
		return false;
	}
	needToSubFocusDrum(song: ZvoogSchedule, trackNum: number, drumNum: number): boolean {
		let sonfino = this.findFocusedFilter(song.filters);
		if (sonfino < 0) {
			let tt = this.findFocusedTrack(song.tracks);
			if (tt < 0) tt = 0;
			if (tt == trackNum) {
				if (trackNum < song.tracks.length) {
					let track = song.tracks[trackNum];
					let trafi = this.findFocusedFilter(track.filters);
					if (trafi < 0) {
						let vv = this.findFocusedDrum(track.percussions);
						if (vv < 0) vv = 0;
						if (vv != drumNum) {
							if (vv < track.percussions.length) {
								let avoice = track.percussions[vv];
								if (!avoice.percussionSetting.focus) {
									let vofi = this.findFocusedFilter(avoice.filters);
									if (vofi < 0) return true;
								}
							}
						}
					}
				}
			}
		}
		return false;
	}


	findFocusedTrack(tracks: ZvoogTrack[]): number {
		for (let i = 0; i < tracks.length; i++) {
			if (tracks[i].focus) return i;
		}
		return -1;
	}
	findFocusedFilter(filters: ZvoogFilterSetting[]): number {
		for (let i = 0; i < filters.length; i++) {
			if (filters[i].focus) return i;
		}
		return -1;
	}
	findFocusedInstrument(voices: ZvoogInstrumentVoice[]): number {
		for (let i = 0; i < voices.length; i++) {
			if (voices[i].focus) return i;
		}
		return -1;
	}
	findFocusedDrum(voices: ZvoogPercussionVoice[]): number {
		for (let i = 0; i < voices.length; i++) {
			if (voices[i].focus) return i;
		}
		return -1;
	}
	findFocusedParam(pars: ZvoogParameterData[]): number {
		for (let ii = 0; ii < pars.length; ii++) {
			if (pars[ii].focus) return ii;
		}
		return -1;
	}

	createSlectMeasureAction(zRender: ZRender, measureIdx: number): (x: number, y: number) => void {
		let actionSelect: (x: number, y: number) => void = (x: number, y: number) => {
			if (startSlecetionMeasureIdx < 0) {
				startSlecetionMeasureIdx = measureIdx;
			} else {
				if (endSlecetionMeasureIdx < 0) {
					if (measureIdx < startSlecetionMeasureIdx) {
						endSlecetionMeasureIdx = startSlecetionMeasureIdx;
						startSlecetionMeasureIdx = measureIdx;
					} else {
						endSlecetionMeasureIdx = measureIdx;
					}
				} else {
					startSlecetionMeasureIdx = -1;
					endSlecetionMeasureIdx = -1;
				}
			}
			console.log('measureIdx', measureIdx, 'selection', startSlecetionMeasureIdx, endSlecetionMeasureIdx);
			zRender.focusManager.currentFocusLevelX().moveViewToShowSpot(zRender.focusManager);
			zRender.focusManager.reSetFocus(zRender.muzXBox.zrenderer, gridWidthTp(zRender.muzXBox.currentSchedule, zRender.muzXBox.zrenderer.secondWidthInTaps));
		}
		return actionSelect;
	}

	addPianoRoll(zRender: ZRender, layerSelector: LayerSelector, song: ZvoogSchedule, ratioDuration: number, ratioThickness: number) {//}, menuButton: TileRectangle) {
		let topGridMargin = topGridMarginTp(song, ratioThickness);
		let rhythm: ZvoogMeter[] = zRender.rhythmPatternDefault;
		if (song.rhythm) {
			if (song.rhythm.length) {
				rhythm = song.rhythm;
			}
		}

		let time = 0;

		for (let mm = 0; mm < song.measures.length; mm++) {
			let measureDuration = meter2seconds(song.measures[mm].tempo, song.measures[mm].meter);

			let contentMeasure1: TileAnchor = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, topGridMargin + 12 * octaveCount * ratioThickness + bottomGridMargin, this.contentMain1.showZoom, this.contentMain1.hideZoom, 'contentMeasure1-' + mm);
			let contentMeasure4: TileAnchor = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, topGridMargin + 12 * octaveCount * ratioThickness + bottomGridMargin, this.contentMain4.showZoom, this.contentMain4.hideZoom, 'contentMeasure4-' + mm);
			let contentMeasure16: TileAnchor = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, topGridMargin + 12 * octaveCount * ratioThickness + bottomGridMargin, this.contentMain16.showZoom, this.contentMain16.hideZoom, 'contentMeasure16-' + mm);
			let contentMeasure64: TileAnchor = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, topGridMargin + 12 * octaveCount * ratioThickness + bottomGridMargin, this.contentMain64.showZoom, this.contentMain64.hideZoom, 'contentMeasure64-' + mm);
			//let contentMeasure256: TileAnchor = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, 128 * ratioThickness, this.contentMain256.showZoom, this.contentMain256.hideZoom);
			this.contentMain1.content.push(contentMeasure1);
			this.contentMain4.content.push(contentMeasure4);
			this.contentMain16.content.push(contentMeasure16);
			this.contentMain64.content.push(contentMeasure64);

			//this.contentMain256.content.push(contentMeasure256);

			let secondMeasure1: TileAnchor = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, topGridMargin + 12 * octaveCount * ratioThickness + bottomGridMargin, this.contentSecond1.showZoom, this.contentSecond1.hideZoom);
			let secondMeasure4: TileAnchor = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, topGridMargin + 12 * octaveCount * ratioThickness + bottomGridMargin, this.contentSecond4.showZoom, this.contentSecond4.hideZoom);
			let secondMeasure16: TileAnchor = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, topGridMargin + 12 * octaveCount * ratioThickness + bottomGridMargin, this.contentSecond16.showZoom, this.contentSecond16.hideZoom);
			let secondMeasure64: TileAnchor = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, topGridMargin + 12 * octaveCount * ratioThickness + bottomGridMargin, this.contentSecond64.showZoom, this.contentSecond64.hideZoom);
			//let secondMeasure256: TileAnchor = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, 128 * ratioThickness, this.contentSecond256.showZoom, this.contentSecond256.hideZoom);
			this.contentSecond1.content.push(secondMeasure1);
			this.contentSecond4.content.push(secondMeasure4);
			this.contentSecond16.content.push(secondMeasure16);
			this.contentSecond64.content.push(secondMeasure64);
			//this.contentSecond256.content.push(secondMeasure256);

			let otherMeasure1: TileAnchor = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, topGridMargin + 12 * octaveCount * ratioThickness + bottomGridMargin, this.contentOther1.showZoom, this.contentOther1.hideZoom,'otherMeasure1-'+mm);
			let otherMeasure4: TileAnchor = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, topGridMargin + 12 * octaveCount * ratioThickness + bottomGridMargin, this.contentOther4.showZoom, this.contentOther4.hideZoom,'otherMeasure4-'+mm);
			let otherMeasure16: TileAnchor = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, topGridMargin + 12 * octaveCount * ratioThickness + bottomGridMargin, this.contentOther16.showZoom, this.contentOther16.hideZoom,'otherMeasure16-'+mm);
			let otherMeasure64: TileAnchor = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, topGridMargin + 12 * octaveCount * ratioThickness + bottomGridMargin, this.contentOther64.showZoom, this.contentOther64.hideZoom,'otherMeasure64-'+mm);
			//let otherMeasure256: TileAnchor = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, 128 * ratioThickness, this.contentOther256.showZoom, this.contentOther256.hideZoom);
			this.contentOther1.content.push(otherMeasure1);
			this.contentOther4.content.push(otherMeasure4);
			this.contentOther16.content.push(otherMeasure16);
			this.contentOther64.content.push(otherMeasure64);
			//this.contentOther256.content.push(otherMeasure256);
			this.addMeasureLyrics(song, time, mm, ratioDuration, ratioThickness, secondMeasure1, 'lyricsText1');
			this.addMeasureLyrics(song, time, mm, ratioDuration, ratioThickness, secondMeasure4, 'lyricsText4');
			this.addMeasureLyrics(song, time, mm, ratioDuration, ratioThickness, secondMeasure16, 'lyricsText16');

			this.addSelectKnobs64(song, time, mm, ratioDuration, ratioThickness, secondMeasure64);
			this.addSelectKnobs16(song, time, mm, ratioDuration, ratioThickness, secondMeasure16, this.createSlectMeasureAction(zRender, mm));
			this.addSelectKnobs4(song, time, mm, ratioDuration, ratioThickness, secondMeasure4);
			this.addSelectKnobs1(song, time, mm, rhythm, ratioDuration, ratioThickness, secondMeasure1);

			let drumCounter = 0

			for (let tt = 0; tt < song.tracks.length; tt++) {
				let track = song.tracks[tt];
				for (let vv = 0; vv < track.instruments.length; vv++) {
					let voice: ZvoogInstrumentVoice = track.instruments[vv];
					for (let pp = 0; pp < voice.instrumentSetting.parameters.length; pp++) {
						let parameter = voice.instrumentSetting.parameters[pp];
						if (track.focus && voice.focus && voice.instrumentSetting.focus) {
							if (parameter.focus) {
								this.addParameterMeasure(ratioDuration, ratioThickness, song, parameter, mm, time, 'mainLine'
									, [contentMeasure1, contentMeasure4, contentMeasure16, contentMeasure64]);//, contentMeasure256]);
							} else {
								this.addParameterMeasure(ratioDuration, ratioThickness, song, parameter, mm, time, 'secondLine'
									, [secondMeasure1, secondMeasure4, secondMeasure16, secondMeasure64]);
							}
						} else {
							this.addParameterMeasure(ratioDuration, ratioThickness, song, parameter, mm, time, 'otherLine'
								, [otherMeasure1, otherMeasure4, otherMeasure16]);
						}
					}
					if (this.needToFocusVoice(song, tt, vv)) {
						this.addInstrumentMeasure(ratioDuration, ratioThickness, song, voice, mm, time, 'mainLine'
							, [contentMeasure1, contentMeasure4, contentMeasure16, contentMeasure64]);//, contentMeasure256]);
						this.addNotesKnobs(layerSelector, ratioDuration, ratioThickness, song, tt, vv, mm, time, true, contentMeasure1);
					} else {
						if (this.needToSubFocusInstrument(song, tt, vv)) {
							this.addInstrumentMeasure(ratioDuration, ratioThickness, song, voice, mm, time, 'secondLine'
								, [secondMeasure1, secondMeasure4, secondMeasure16, secondMeasure64]);
							this.addNotesKnobs(layerSelector, ratioDuration, ratioThickness, song, tt, vv, mm, time, false, secondMeasure1);
						} else {
							this.addInstrumentMeasure(ratioDuration, ratioThickness, song, voice, mm, time, 'otherLine'
								, [otherMeasure1, otherMeasure4, otherMeasure16]);
							this.addNotesKnobs(layerSelector, ratioDuration, ratioThickness, song, tt, vv, mm, time, false, otherMeasure1);
						}
					}
					for (let ff = 0; ff < voice.filters.length; ff++) {
						let filter = voice.filters[ff];
						for (let pp = 0; pp < filter.parameters.length; pp++) {
							let parameter = filter.parameters[pp];
							if (track.focus && voice.focus && filter.focus) {
								if (parameter.focus) {
									this.addParameterMeasure(ratioDuration, ratioThickness, song, parameter, mm, time, 'mainLine'
										, [contentMeasure1, contentMeasure4, contentMeasure16, contentMeasure64]);//, contentMeasure256]);
								} else {
									this.addParameterMeasure(ratioDuration, ratioThickness, song, parameter, mm, time, 'secondLine'
										, [secondMeasure1, secondMeasure4, secondMeasure16, secondMeasure64]);
								}
							} else {
								this.addParameterMeasure(ratioDuration, ratioThickness, song, parameter, mm, time, 'otherLine'
									, [otherMeasure1, otherMeasure4, otherMeasure16]);
							}
						}
					}
				}







				for (let vv = 0; vv < track.percussions.length; vv++) {
					let voice: ZvoogPercussionVoice = track.percussions[vv];
					for (let pp = 0; pp < voice.percussionSetting.parameters.length; pp++) {
						let parameter = voice.percussionSetting.parameters[pp];
						if (track.focus && voice.focus && voice.percussionSetting.focus) {
							if (parameter.focus) {
								this.addParameterMeasure(ratioDuration, ratioThickness, song, parameter, mm, time, 'mainLine'
									, [contentMeasure1, contentMeasure4, contentMeasure16, contentMeasure64]);//, contentMeasure256]);
							} else {
								this.addParameterMeasure(ratioDuration, ratioThickness, song, parameter, mm, time, 'secondLine'
									, [secondMeasure1, secondMeasure4, secondMeasure16, secondMeasure64]);
							}
						} else {
							this.addParameterMeasure(ratioDuration, ratioThickness, song, parameter, mm, time, 'otherLine'
								, [otherMeasure1,otherMeasure4, otherMeasure16]);
						}
					}
					if (this.needToFocusDrum(song, tt, vv)) {
						this.addDrumMeasure(drumCounter, ratioDuration, ratioThickness, song, voice, mm, time, 'mainDot'
							, [contentMeasure1, contentMeasure4, contentMeasure16, contentMeasure64]);//, contentMeasure256]);
						//this.addNotesKnobs(layerSelector, ratioDuration, ratioThickness, song, tt, vv, mm, time, true, contentMeasure1);
					} else {
						if (this.needToSubFocusDrum(song, tt, vv)) {
							this.addDrumMeasure(drumCounter, ratioDuration, ratioThickness, song, voice, mm, time, 'secondDot'
								, [secondMeasure1, secondMeasure4, secondMeasure16, secondMeasure64]);
							//this.addNotesKnobs(layerSelector, ratioDuration, ratioThickness, song, tt, vv, mm, time, false, secondMeasure1);
						} else {
							this.addDrumMeasure(drumCounter, ratioDuration, ratioThickness, song, voice, mm, time, 'otherDot'
								, [otherMeasure1, otherMeasure4, otherMeasure16]);
							//this.addNotesKnobs(layerSelector, ratioDuration, ratioThickness, song, tt, vv, mm, time, false, otherMeasure1);
						}
					}
					for (let ff = 0; ff < voice.filters.length; ff++) {
						let filter = voice.filters[ff];
						for (let pp = 0; pp < filter.parameters.length; pp++) {
							let parameter = filter.parameters[pp];
							if (track.focus && voice.focus && filter.focus) {
								if (parameter.focus) {
									this.addParameterMeasure(ratioDuration, ratioThickness, song, parameter, mm, time, 'mainLine'
										, [contentMeasure1, contentMeasure4, contentMeasure16, contentMeasure64]);//, contentMeasure256]);
								} else {
									this.addParameterMeasure(ratioDuration, ratioThickness, song, parameter, mm, time, 'secondLine'
										, [secondMeasure1, secondMeasure4, secondMeasure16, secondMeasure64]);
								}
							} else {
								this.addParameterMeasure(ratioDuration, ratioThickness, song, parameter, mm, time, 'otherLine'
									, [otherMeasure1, otherMeasure4, otherMeasure16]);
							}
						}
					}
					drumCounter++;
				}
















				for (let ff = 0; ff < track.filters.length; ff++) {
					let filter = track.filters[ff];
					for (let pp = 0; pp < filter.parameters.length; pp++) {
						let parameter = filter.parameters[pp];
						if (track.focus && filter.focus) {
							if (parameter.focus) {
								this.addParameterMeasure(ratioDuration, ratioThickness, song, parameter, mm, time, 'mainLine'
									, [contentMeasure1, contentMeasure4, contentMeasure16, contentMeasure64]);//, contentMeasure256]);
							} else {
								this.addParameterMeasure(ratioDuration, ratioThickness, song, parameter, mm, time, 'secondLine'
									, [secondMeasure1, secondMeasure4, secondMeasure16, secondMeasure64]);
							}
						} else {
							this.addParameterMeasure(ratioDuration, ratioThickness, song, parameter, mm, time, 'otherLine'
								, [otherMeasure1, otherMeasure4, otherMeasure16]);
						}
					}
				}
			}
			for (let ff = 0; ff < song.filters.length; ff++) {
				let filter = song.filters[ff];
				for (let pp = 0; pp < filter.parameters.length; pp++) {
					let parameter = filter.parameters[pp];
					if (filter.focus) {
						if (parameter.focus) {
							this.addParameterMeasure(ratioDuration, ratioThickness, song, parameter, mm, time, 'mainLine'
								, [contentMeasure1, contentMeasure4, contentMeasure16, contentMeasure64]);//, contentMeasure256]);
						} else {
							this.addParameterMeasure(ratioDuration, ratioThickness, song, parameter, mm, time, 'secondLine'
								, [secondMeasure1, secondMeasure4, secondMeasure16, secondMeasure64]);
						}
					} else {
						this.addParameterMeasure(ratioDuration, ratioThickness, song, parameter, mm, time, 'otherLine'
							, [otherMeasure1, otherMeasure4, otherMeasure16]);
					}
				}
			}
			time = time + measureDuration;
		}
		this.fillFar(song, ratioDuration, ratioThickness);
		this.fillBig(song, ratioDuration, ratioThickness);
		//this.fillLyrics(song, ratioDuration, ratioThickness);
	}

	fillFar(song: ZvoogSchedule, ratioDuration: number, ratioThickness: number) {
		let topGridMargin = topGridMarginTp(song, ratioThickness);
		let chordCount = 0;
		for (let mm = 0; mm < song.measures.length; mm++) {
			let measureChords = 0;
			for (let tt = 0; tt < song.tracks.length; tt++) {
				let track = song.tracks[tt];
				for (let vv = 0; vv < track.instruments.length; vv++) {
					let voice: ZvoogInstrumentVoice = track.instruments[vv];
					measureChords = measureChords + voice.measureChords[mm].chords.length;
				}
			}
			chordCount = chordCount + measureChords;
		}
		let time = 0;
		for (let mm = 0; mm < song.measures.length; mm++) {
			let measureDuration = meter2seconds(song.measures[mm].tempo, song.measures[mm].meter);
			let css = 'average6';
			let curChordCount = 0;
			for (let tt = 0; tt < song.tracks.length; tt++) {
				let track = song.tracks[tt];
				for (let vv = 0; vv < track.instruments.length; vv++) {
					let voice: ZvoogInstrumentVoice = track.instruments[vv];
					curChordCount = curChordCount + voice.measureChords[mm].chords.length;
				}
			}
			if (curChordCount < 0.5 * chordCount / song.measures.length) {
				css = 'average1';
			} else {
				if (curChordCount < 0.8 * chordCount / song.measures.length) {
					css = 'average2';
				} else {
					if (curChordCount < 1.1 * chordCount / song.measures.length) {
						css = 'average3';
					} else {
						if (curChordCount < 1.4 * chordCount / song.measures.length) {
							css = 'average4';
						} else {
							if (curChordCount < 1.7 * chordCount / song.measures.length) {
								css = 'average5';
							}
						}
					}
				}
			}
			let measquare = {
				x: leftGridMargin + time * ratioDuration
				, y: topGridMargin
				, w: ratioDuration * measureDuration - 1
				, h: 12 * octaveCount * ratioThickness
				, rx: 0
				, ry: 0
				, css: css
			};
			this.contentOther64.content.push(measquare);
			//this.contentOther256.content.push(measquare);
			time = time + measureDuration;
		}
	}
	fillBig(song: ZvoogSchedule, ratioDuration: number, ratioThickness: number) {
		let topGridMargin = topGridMarginTp(song, ratioThickness);
		//let nx = 16;
		let chordCount = 0;
		for (let mm = 0; mm < song.measures.length; mm++) {
			let measureChords = 0;
			for (let tt = 0; tt < song.tracks.length; tt++) {
				let track = song.tracks[tt];
				for (let vv = 0; vv < track.instruments.length; vv++) {
					let voice: ZvoogInstrumentVoice = track.instruments[vv];
					measureChords = measureChords + voice.measureChords[mm].chords.length;
				}
			}
			chordCount = chordCount + measureChords;
		}

		let time = 0;
		for (let m10 = 0; m10 < song.measures.length; m10 = m10 + bigGroupMeasure) {
			let curChordCount = 0;
			let duration10 = 0;
			let preTime = time;
			for (let msi = 0; msi < bigGroupMeasure && m10 + msi < song.measures.length; msi++) {
				let measureDuration = meter2seconds(song.measures[m10 + msi].tempo, song.measures[m10 + msi].meter);
				duration10 = duration10 + measureDuration;
				for (let tt = 0; tt < song.tracks.length; tt++) {
					let track = song.tracks[tt];
					for (let vv = 0; vv < track.instruments.length; vv++) {
						let voice: ZvoogInstrumentVoice = track.instruments[vv];
						curChordCount = curChordCount + voice.measureChords[m10 + msi].chords.length;
					}
				}
				time = time + measureDuration;
			}
			let css = 'average6';
			if (curChordCount < 0.5 * bigGroupMeasure * chordCount / song.measures.length) {
				css = 'average1';
			} else {
				if (curChordCount < 0.8 * bigGroupMeasure * chordCount / song.measures.length) {
					css = 'average2';
				} else {
					if (curChordCount < 1.1 * bigGroupMeasure * chordCount / song.measures.length) {
						css = 'average3';
					} else {
						if (curChordCount < 1.4 * bigGroupMeasure * chordCount / song.measures.length) {
							css = 'average4';
						} else {
							if (curChordCount < 1.7 * bigGroupMeasure * chordCount / song.measures.length) {
								css = 'average5';
							}
						}
					}
				}
			}
			//console.log(m10,preTime,duration10,(nx*chordCount/ song.measures.length),curChordCount);
			let measquare = {
				x: leftGridMargin + preTime * ratioDuration
				, y: topGridMargin
				, w: ratioDuration * duration10 - 5
				, h: 12 * octaveCount * ratioThickness
				, rx: 0
				, ry: 0
				, css: css
			};
			//this.contentOther64.content.push(measquare);
			this.contentOther256.content.push(measquare);
		}
	}
}
