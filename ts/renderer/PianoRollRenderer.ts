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
			zRender.clearResizeSingleAnchor(anchors[i], wholeWidth);
		}

	}
	initMainAnchors(zRender: ZRender) {
		this.contentMain1 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: zRender.zoomMin, hideZoom: zRender.zoomNote, content: [] };
		this.contentMain4 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: zRender.zoomNote, hideZoom: zRender.zoomMeasure, content: [] };
		this.contentMain16 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: zRender.zoomMeasure, hideZoom: zRender.zoomSong, content: [] };
		this.contentMain64 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: zRender.zoomSong, hideZoom: zRender.zoomFar, content: [] };
		//this.contentMain256 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: zRender.zoomFar, hideZoom: zRender.zoomMax + 1, content: [] };
		zRender.layers.push({
			g: this.measureMainVoiceLayerGroup, anchors: [
				this.contentMain1, this.contentMain4, this.contentMain16, this.contentMain64//, this.contentMain256
			]
		});
	}
	initSecondAnchors(zRender: ZRender) {
		this.contentSecond1 = TAnchor(0, 0, 1111, 1111, zRender.zoomMin, zRender.zoomNote);
		this.contentSecond4 = TAnchor(0, 0, 1111, 1111, zRender.zoomNote, zRender.zoomMeasure);
		this.contentSecond16 = TAnchor(0, 0, 1111, 1111, zRender.zoomMeasure, zRender.zoomSong);
		this.contentSecond64 = TAnchor(0, 0, 1111, 1111, zRender.zoomSong, zRender.zoomFar);
		//this.contentSecond256 = TAnchor(0, 0, 1111, 1111, zRender.zoomFar, zRender.zoomMax + 1);
		zRender.layers.push({
			g: this.measureSecondVoicesLayerGroup, anchors: [
				this.contentSecond1, this.contentSecond4, this.contentSecond16, this.contentSecond64//, this.contentSecond256
			]
		});
	}
	initOthersAnchors(zRender: ZRender) {
		this.contentOther1 = TAnchor(0, 0, 1111, 1111, zRender.zoomMin, zRender.zoomNote);
		this.contentOther4 = TAnchor(0, 0, 1111, 1111, zRender.zoomNote, zRender.zoomMeasure);
		this.contentOther16 = TAnchor(0, 0, 1111, 1111, zRender.zoomMeasure, zRender.zoomSong);
		this.contentOther64 = TAnchor(0, 0, 1111, 1111, zRender.zoomSong, zRender.zoomFar);
		this.contentOther256 = TAnchor(0, 0, 1111, 1111, zRender.zoomFar, zRender.zoomMax + 1);
		zRender.layers.push({
			g: this.measureOtherVoicesLayerGroup, anchors: [
				this.contentOther1, this.contentOther4, this.contentOther16, this.contentOther64, this.contentOther256
			]
		});
	}
	addParameterMeasure(ratioDuration: number, ratioThickness: number, song: ZvoogSchedule, parameter: ZvoogParameterData, measureNum: number, time: number, css: string, anchors: TileAnchor[]) {
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
		}
	}
	addVoiceMeasure(ratioDuration: number, ratioThickness: number, song: ZvoogSchedule, voice: ZvoogVoice, measureNum: number, time: number, css: string, anchors: TileAnchor[]): number {
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
	addSubVoiceKnobs(ratioDuration: number, ratioThickness: number, song: ZvoogSchedule, voice: ZvoogVoice
		, measureNum: number, time: number
		, anchor: TileAnchor): void {
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
				let startShift = 0;
				if (pp == 0) {
					startShift = 0.5 * ratioThickness;
				}
				let endShift = 0;
				if (pp == envelope.pitches.length - 1) {
					endShift = -0.49 * ratioThickness;
				}
				let xx = leftGridMargin + (time + pitchWhen) * ratioDuration + startShift;
				let yy = topGridMargin + yShift - pitch.pitch * ratioThickness;
				let knob: TileRectangle = {
					x: xx - 0.5
					, y: yy - 0.5
					, w: 1
					, h: 1
					, rx: 0.5
					, ry: 0.5
					, css: 'actionSpot'
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
						let vv = this.findFocusedVoice(track.voices);
						if (vv < 0) vv = 0;
						if (vv == voiceNum) {
							if (voiceNum < track.voices.length) {
								let voice = track.voices[voiceNum];
								if (!voice.performer.focus) {
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
	needToSubFocusVoice(song: ZvoogSchedule, trackNum: number, voiceNum: number): boolean {
		let sonfino = this.findFocusedFilter(song.filters);
		if (sonfino < 0) {
			let tt = this.findFocusedTrack(song.tracks);
			if (tt < 0) tt = 0;
			if (tt == trackNum) {
				if (trackNum < song.tracks.length) {
					let track = song.tracks[trackNum];
					let trafi = this.findFocusedFilter(track.filters);
					if (trafi < 0) {
						let vv = this.findFocusedVoice(track.voices);
						if (vv < 0) vv = 0;
						if (vv != voiceNum) {
							if (vv < track.voices.length) {
								let avoice = track.voices[vv];
								if (!avoice.performer.focus) {
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
	findFocusedVoice(voices: ZvoogVoice[]): number {
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


	drawSchedule(song: ZvoogSchedule, ratioDuration: number, ratioThickness: number) {//}, menuButton: TileRectangle) {
		let time = 0;

		for (let mm = 0; mm < song.measures.length; mm++) {
			let measureDuration = meter2seconds(song.measures[mm].tempo, song.measures[mm].meter);

			let contentMeasure1: TileAnchor = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, 12 * octaveCount * ratioThickness, this.contentMain1.showZoom, this.contentMain1.hideZoom);
			let contentMeasure4: TileAnchor = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, 128 * ratioThickness, this.contentMain4.showZoom, this.contentMain4.hideZoom);
			let contentMeasure16: TileAnchor = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, 128 * ratioThickness, this.contentMain16.showZoom, this.contentMain16.hideZoom);
			let contentMeasure64: TileAnchor = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, 128 * ratioThickness, this.contentMain64.showZoom, this.contentMain64.hideZoom);
			//let contentMeasure256: TileAnchor = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, 128 * ratioThickness, this.contentMain256.showZoom, this.contentMain256.hideZoom);
			this.contentMain1.content.push(contentMeasure1);
			this.contentMain4.content.push(contentMeasure4);
			this.contentMain16.content.push(contentMeasure16);
			this.contentMain64.content.push(contentMeasure64);
			//this.contentMain256.content.push(contentMeasure256);

			let secondMeasure1: TileAnchor = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, 128 * ratioThickness, this.contentSecond1.showZoom, this.contentSecond1.hideZoom);
			let secondMeasure4: TileAnchor = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, 128 * ratioThickness, this.contentSecond4.showZoom, this.contentSecond4.hideZoom);
			let secondMeasure16: TileAnchor = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, 128 * ratioThickness, this.contentSecond16.showZoom, this.contentSecond16.hideZoom);
			let secondMeasure64: TileAnchor = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, 128 * ratioThickness, this.contentSecond64.showZoom, this.contentSecond64.hideZoom);
			//let secondMeasure256: TileAnchor = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, 128 * ratioThickness, this.contentSecond256.showZoom, this.contentSecond256.hideZoom);
			this.contentSecond1.content.push(secondMeasure1);
			this.contentSecond4.content.push(secondMeasure4);
			this.contentSecond16.content.push(secondMeasure16);
			this.contentSecond64.content.push(secondMeasure64);
			//this.contentSecond256.content.push(secondMeasure256);

			let otherMeasure1: TileAnchor = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, 128 * ratioThickness, this.contentOther1.showZoom, this.contentOther1.hideZoom);
			let otherMeasure4: TileAnchor = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, 128 * ratioThickness, this.contentOther4.showZoom, this.contentOther4.hideZoom);
			let otherMeasure16: TileAnchor = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, 128 * ratioThickness, this.contentOther16.showZoom, this.contentOther16.hideZoom);
			let otherMeasure64: TileAnchor = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, 128 * ratioThickness, this.contentOther64.showZoom, this.contentOther64.hideZoom);
			//let otherMeasure256: TileAnchor = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, 128 * ratioThickness, this.contentOther256.showZoom, this.contentOther256.hideZoom);
			this.contentOther1.content.push(otherMeasure1);
			this.contentOther4.content.push(otherMeasure4);
			this.contentOther16.content.push(otherMeasure16);
			this.contentOther64.content.push(otherMeasure64);
			//this.contentOther256.content.push(otherMeasure256);
			for (let tt = 0; tt < song.tracks.length; tt++) {
				let track = song.tracks[tt];
				for (let vv = 0; vv < track.voices.length; vv++) {
					let voice: ZvoogVoice = track.voices[vv];
					for (let pp = 0; pp < voice.performer.parameters.length; pp++) {
						let parameter = voice.performer.parameters[pp];
						if (track.focus && voice.focus && voice.performer.focus) {
							if (parameter.focus) {
								this.addParameterMeasure(ratioDuration, ratioThickness, song, parameter, mm, time, 'mainLine'
									, [contentMeasure1, contentMeasure4, contentMeasure16, contentMeasure64]);//, contentMeasure256]);
							} else {
								this.addParameterMeasure(ratioDuration, ratioThickness, song, parameter, mm, time, 'secondLine'
									, [secondMeasure1, secondMeasure4, secondMeasure16, secondMeasure64]);
							}
						} else {
							this.addParameterMeasure(ratioDuration, ratioThickness, song, parameter, mm, time, 'otherLine'
								, [secondMeasure1, secondMeasure4, secondMeasure16]);
						}
					}
					if (this.needToFocusVoice(song, tt, vv)) {
						this.addVoiceMeasure(ratioDuration, ratioThickness, song, voice, mm, time, 'mainLine'
							, [contentMeasure1, contentMeasure4, contentMeasure16, contentMeasure64]);//, contentMeasure256]);
						this.addSubVoiceKnobs(ratioDuration, ratioThickness, song, voice, mm, time, contentMeasure1);
					} else {
						if (this.needToSubFocusVoice(song, tt, vv)) {
							this.addVoiceMeasure(ratioDuration, ratioThickness, song, voice, mm, time, 'secondLine'
								, [secondMeasure1, secondMeasure4, secondMeasure16, secondMeasure64]);
							this.addSubVoiceKnobs(ratioDuration, ratioThickness, song, voice, mm, time, secondMeasure1);
						} else {
							this.addVoiceMeasure(ratioDuration, ratioThickness, song, voice, mm, time, 'otherLine'
								, [otherMeasure1, otherMeasure4, otherMeasure16]);
							this.addSubVoiceKnobs(ratioDuration, ratioThickness, song, voice, mm, time, otherMeasure1);
						}
					}
					/*if (track.focus) {
						if (voice.focus) {
							let maxMeasureLen = this.addVoiceMeasure(ratioDuration, ratioThickness, song, voice, mm, time, 'mainLine', [
								contentMeasure1, contentMeasure4, contentMeasure16, contentMeasure64, contentMeasure256]);
						} else {
							this.addVoiceMeasure(ratioDuration, ratioThickness, song, voice, mm, time, 'secondLine', [
								secondMeasure1, secondMeasure4, secondMeasure16, secondMeasure64]);
						}
					} else {
						this.addVoiceMeasure(ratioDuration, ratioThickness, song, voice, mm, time, 'otherLine', [
							secondMeasure1, secondMeasure4, secondMeasure16]);
					}*/
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
									, [secondMeasure1, secondMeasure4, secondMeasure16]);
							}
						}
					}
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
								, [secondMeasure1, secondMeasure4, secondMeasure16]);
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
							, [secondMeasure1, secondMeasure4, secondMeasure16]);
					}
				}
			}
			time = time + measureDuration;
		}
		this.fillFar(song, ratioDuration, ratioThickness);
		this.fillBig(song, ratioDuration, ratioThickness);
	}
	fillFar(song: ZvoogSchedule, ratioDuration: number, ratioThickness: number) {
		let chordCount = 0;
		for (let mm = 0; mm < song.measures.length; mm++) {
			let measureChords = 0;
			for (let tt = 0; tt < song.tracks.length; tt++) {
				let track = song.tracks[tt];
				for (let vv = 0; vv < track.voices.length; vv++) {
					let voice: ZvoogVoice = track.voices[vv];
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
				for (let vv = 0; vv < track.voices.length; vv++) {
					let voice: ZvoogVoice = track.voices[vv];
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
		let nx = 16;
		let chordCount = 0;
		for (let mm = 0; mm < song.measures.length; mm++) {
			let measureChords = 0;
			for (let tt = 0; tt < song.tracks.length; tt++) {
				let track = song.tracks[tt];
				for (let vv = 0; vv < track.voices.length; vv++) {
					let voice: ZvoogVoice = track.voices[vv];
					measureChords = measureChords + voice.measureChords[mm].chords.length;
				}
			}
			chordCount = chordCount + measureChords;
		}

		let time = 0;
		for (let m10 = 0; m10 < song.measures.length; m10 = m10 + nx) {
			let curChordCount = 0;
			let duration10 = 0;
			let preTime = time;
			for (let msi = 0; msi < nx && m10 + msi < song.measures.length; msi++) {
				let measureDuration = meter2seconds(song.measures[m10 + msi].tempo, song.measures[m10 + msi].meter);
				duration10 = duration10 + measureDuration;
				for (let tt = 0; tt < song.tracks.length; tt++) {
					let track = song.tracks[tt];
					for (let vv = 0; vv < track.voices.length; vv++) {
						let voice: ZvoogVoice = track.voices[vv];
						curChordCount = curChordCount + voice.measureChords[m10 + msi].chords.length;
					}
				}
				time = time + measureDuration;
			}
			let css = 'average6';
			if (curChordCount < 0.5 * nx * chordCount / song.measures.length) {
				css = 'average1';
			} else {
				if (curChordCount < 0.8 * nx * chordCount / song.measures.length) {
					css = 'average2';
				} else {
					if (curChordCount < 1.1 * nx * chordCount / song.measures.length) {
						css = 'average3';
					} else {
						if (curChordCount < 1.4 * nx * chordCount / song.measures.length) {
							css = 'average4';
						} else {
							if (curChordCount < 1.7 * nx * chordCount / song.measures.length) {
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
