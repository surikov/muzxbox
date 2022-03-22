class ZRender {
	tileLevel: TileLevel;
	layers: TileLayerDefinition[] = [];
	zoomMin: number = 1;
	zoomNote: number = 4;
	zoomMeasure: number = 16;
	zoomSong: number = 64;
	zoomFar: number = 256;
	zoomBig: number = 512;
	zoomMax: number = 10000;
	ratioDuration = 200;
	ratioThickness = 3;
	sizeRatio = 2;

	measureOtherVoicesLayerGroup: SVGElement;
	measureSecondVoicesLayerGroup: SVGElement;
	measureMainVoiceLayerGroup: SVGElement;
	bottomTimelineLayerGroup: SVGElement;
	debugLayerGroup: SVGElement;

	debugAnchor0: TileAnchor;
	debugAnchor1: TileAnchor;
	debugAnchor4: TileAnchor;
	debugAnchor16: TileAnchor;
	debugAnchor64: TileAnchor;
	debugAnchor256: TileAnchor;

	measuresTimelineAnchor1: TileAnchor;
	measuresTimelineAnchor4: TileAnchor;
	measuresTimelineAnchor16: TileAnchor;
	measuresTimelineAnchor64: TileAnchor;
	measuresTimelineAnchor256: TileAnchor;

	contentMain1: TileAnchor;
	contentMain4: TileAnchor;
	contentMain16: TileAnchor;
	contentMain64: TileAnchor;
	contentMain256: TileAnchor;

	contentSecond1: TileAnchor;
	contentSecond4: TileAnchor;
	contentSecond16: TileAnchor;
	contentSecond64: TileAnchor;
	contentSecond256: TileAnchor;

	contentOther1: TileAnchor;
	contentOther4: TileAnchor;
	contentOther16: TileAnchor;
	contentOther64: TileAnchor;
	contentOther256: TileAnchor;

	constructor() {
		this.bindLayers();
	}
	bindLayers() {
		this.measureOtherVoicesLayerGroup = (document.getElementById('measureOtherVoicesLayerGroup') as any) as SVGElement;
		this.measureSecondVoicesLayerGroup = (document.getElementById('measureSecondVoicesLayerGroup') as any) as SVGElement;
		this.measureMainVoiceLayerGroup = (document.getElementById('measureMainVoiceLayerGroup') as any) as SVGElement;
		this.bottomTimelineLayerGroup = (document.getElementById('bottomTimelineLayerGroup') as any) as SVGElement;
		this.debugLayerGroup = (document.getElementById('debugLayerGroup') as any) as SVGElement;
		this.tileLevel = new TileLevel((document.getElementById('contentSVG') as any) as SVGElement
			, 1000//50*time
			, 1000//testProject.tracks.length*11
			, this.zoomMin, this.zoomMin, this.zoomMax
			, this.layers);
	}
	initUI() {
		this.initDebugAnchors();
		this.initTimelineAnchors();
		this.initMainAnchors();
		this.initSecondAnchors();
		this.initOthersAnchors();

	}
	initDebugAnchors() {
		this.debugAnchor0 = TAnchor(0, 0, 1111, 1111, this.zoomMin, this.zoomMax + 1);
		this.debugAnchor1 = TAnchor(0, 0, 1111, 1111, this.zoomMin, this.zoomNote);
		this.debugAnchor4 = TAnchor(0, 0, 1111, 1111, this.zoomNote, this.zoomMeasure);
		this.debugAnchor16 = TAnchor(0, 0, 1111, 1111, this.zoomMeasure, this.zoomSong);
		this.debugAnchor64 = TAnchor(0, 0, 1111, 1111, this.zoomSong, this.zoomFar);
		this.debugAnchor256 = TAnchor(0, 0, 1111, 1111, this.zoomFar, this.zoomMax + 1);
		this.layers.push({
			g: this.debugLayerGroup, anchors: [
				this.debugAnchor1, this.debugAnchor4, this.debugAnchor16, this.debugAnchor64, this.debugAnchor256, this.debugAnchor0
			]
		});
	}
	initTimelineAnchors() {
		this.measuresTimelineAnchor1 = TAnchor(0, 0, 1111, 1111, this.zoomMin, this.zoomNote);
		this.measuresTimelineAnchor4 = TAnchor(0, 0, 1111, 1111, this.zoomNote, this.zoomMeasure);
		this.measuresTimelineAnchor16 = TAnchor(0, 0, 1111, 1111, this.zoomMeasure, this.zoomSong);
		this.measuresTimelineAnchor64 = TAnchor(0, 0, 1111, 1111, this.zoomSong, this.zoomFar);
		this.measuresTimelineAnchor256 = TAnchor(0, 0, 1111, 1111, this.zoomFar, this.zoomBig + 1);
		this.layers.push({
			g: this.bottomTimelineLayerGroup, stickBottom: 0, anchors: [
				this.measuresTimelineAnchor1, this.measuresTimelineAnchor4, this.measuresTimelineAnchor16, this.measuresTimelineAnchor64, this.measuresTimelineAnchor256
			]
		});
	}
	initMainAnchors() {
		this.contentMain1 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomMin, hideZoom: this.zoomNote, content: [] };
		this.contentMain4 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomNote, hideZoom: this.zoomMeasure, content: [] };
		this.contentMain16 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomMeasure, hideZoom: this.zoomSong, content: [] };
		this.contentMain64 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomSong, hideZoom: this.zoomFar, content: [] };
		this.contentMain256 = { xx: 0, yy: 0, ww: 1111, hh: 1111, showZoom: this.zoomFar, hideZoom: this.zoomMax + 1, content: [] };
		this.layers.push({
			g: this.measureMainVoiceLayerGroup, anchors: [
				this.contentMain1, this.contentMain4, this.contentMain16, this.contentMain64, this.contentMain256
			]
		});
	}
	initSecondAnchors() {
		this.contentSecond1 = TAnchor(0, 0, 1111, 1111, this.zoomMin, this.zoomNote);
		this.contentSecond4 = TAnchor(0, 0, 1111, 1111, this.zoomNote, this.zoomMeasure);
		this.contentSecond16 = TAnchor(0, 0, 1111, 1111, this.zoomMeasure, this.zoomSong);
		this.contentSecond64 = TAnchor(0, 0, 1111, 1111, this.zoomSong, this.zoomFar);
		this.contentSecond256 = TAnchor(0, 0, 1111, 1111, this.zoomFar, this.zoomMax + 1);
		this.layers.push({
			g: this.measureSecondVoicesLayerGroup, anchors: [
				this.contentSecond1, this.contentSecond4, this.contentSecond16, this.contentSecond64, this.contentSecond256
			]
		});
	}
	initOthersAnchors() {
		this.contentOther1 = TAnchor(0, 0, 1111, 1111, this.zoomMin, this.zoomNote);
		this.contentOther4 = TAnchor(0, 0, 1111, 1111, this.zoomNote, this.zoomMeasure);
		this.contentOther16 = TAnchor(0, 0, 1111, 1111, this.zoomMeasure, this.zoomSong);
		this.contentOther64 = TAnchor(0, 0, 1111, 1111, this.zoomSong, this.zoomFar);
		this.contentOther256 = TAnchor(0, 0, 1111, 1111, this.zoomFar, this.zoomMax + 1);
		this.layers.push({
			g: this.measureOtherVoicesLayerGroup, anchors: [
				this.contentOther1, this.contentOther4, this.contentOther16, this.contentOther64, this.contentOther256
			]
		});
	}
	clearSingleAnchor(anchor: TileAnchor, songDuration: number) {
		anchor.content.length = 0;
		anchor.ww = this.ratioDuration * songDuration;
		anchor.hh = 128 * this.ratioThickness;
	}
	clearAnchorsContent(songDuration: number): void {
		var anchors: TileAnchor[] = [
			this.debugAnchor0, this.debugAnchor1, this.debugAnchor4, this.debugAnchor16, this.debugAnchor64, this.debugAnchor256
			, this.measuresTimelineAnchor1, this.measuresTimelineAnchor4, this.measuresTimelineAnchor16, this.measuresTimelineAnchor64, this.measuresTimelineAnchor256
			, this.contentMain1, this.contentMain4, this.contentMain16, this.contentMain64, this.contentMain256
			, this.contentSecond1, this.contentSecond4, this.contentSecond16, this.contentSecond64, this.contentSecond256
			, this.contentOther1, this.contentOther4, this.contentOther16, this.contentOther64, this.contentOther256
		];
		for (var i = 0; i < anchors.length; i++) {
			this.clearSingleAnchor(anchors[i], songDuration);
		}
		this.tileLevel.innerWidth = this.ratioDuration * songDuration * this.tileLevel.tapSize;
		this.tileLevel.innerHeight = 128 * this.ratioThickness * this.tileLevel.tapSize;

	}
	fillTimeLine1(song: ZvoogSchedule) {
		var time = 0;
		for (var i = 0; i < song.measures.length; i++) {
			var measureDuration = meter2seconds(song.measures[i].tempo, song.measures[i].meter);
			var tempoMeterLabel = '' + song.measures[i].tempo + ': ' + song.measures[i].meter.count + '/' + song.measures[i].meter.division;
			let singlemeasuresTimelineAnchor1: TileAnchor = TAnchor(
				time * this.ratioDuration, 0, this.ratioDuration * measureDuration, 128 * this.ratioThickness
				, this.measuresTimelineAnchor1.showZoom, this.measuresTimelineAnchor1.hideZoom
			);
			singlemeasuresTimelineAnchor1.content.push(TText(time * this.ratioDuration, 0, 'barNumber textSize1', '1-' + (i + 1)));
			singlemeasuresTimelineAnchor1.content.push(TText(time * this.ratioDuration, -1, 'barNumber textSize1', tempoMeterLabel));
			this.measuresTimelineAnchor1.content.push(singlemeasuresTimelineAnchor1);
			time = time + measureDuration;
		}
	}
	fillTimeLine4(song: ZvoogSchedule) {
		var time = 0;
		for (var i = 0; i < song.measures.length; i++) {
			var measureDuration = meter2seconds(song.measures[i].tempo, song.measures[i].meter);
			var tempoMeterLabel = '' + song.measures[i].tempo + ': ' + song.measures[i].meter.count + '/' + song.measures[i].meter.division;
			let singlemeasuresTimelineAnchor4: TileAnchor = TAnchor(
				time * this.ratioDuration, 0, this.ratioDuration * measureDuration, 128 * this.ratioThickness
				, this.measuresTimelineAnchor4.showZoom, this.measuresTimelineAnchor4.hideZoom
			);
			singlemeasuresTimelineAnchor4.content.push(TText(time * this.ratioDuration, 0, 'barNumber textSize4', ('4-' + (i + 1))));
			singlemeasuresTimelineAnchor4.content.push(TText(time * this.ratioDuration, -4, 'barNumber textSize4', tempoMeterLabel));
			this.measuresTimelineAnchor4.content.push(singlemeasuresTimelineAnchor4);
			time = time + measureDuration;
		}
	}
	fillTimeLine16(song: ZvoogSchedule) {
		var time = 0;
		for (var i = 0; i < song.measures.length; i++) {
			var measureDuration = meter2seconds(song.measures[i].tempo, song.measures[i].meter);
			var tempoMeterLabel = '' + song.measures[i].tempo + ': ' + song.measures[i].meter.count + '/' + song.measures[i].meter.division;
			let singlemeasuresTimelineAnchor16: TileAnchor = TAnchor(
				time * this.ratioDuration, 0, this.ratioDuration * measureDuration, 128 * this.ratioThickness
				, this.measuresTimelineAnchor16.showZoom, this.measuresTimelineAnchor16.hideZoom
			);
			singlemeasuresTimelineAnchor16.content.push(TText(time * this.ratioDuration, 0, 'barNumber textSize16', ('16-' + (i + 1))));
			singlemeasuresTimelineAnchor16.content.push({ x: time * this.ratioDuration, y: -16, css: 'barNumber textSize16', text: tempoMeterLabel });
			this.measuresTimelineAnchor16.content.push(singlemeasuresTimelineAnchor16);
			time = time + measureDuration;
		}
	}
	fillTimeLine64(song: ZvoogSchedule) {
		var time = 0;
		for (var i = 0; i < song.measures.length; i++) {
			var measureDuration = meter2seconds(song.measures[i].tempo, song.measures[i].meter);
			var tempoMeterLabel = '' + song.measures[i].tempo + ': ' + song.measures[i].meter.count + '/' + song.measures[i].meter.division;
			let singlemeasuresTimelineAnchor64: TileAnchor = TAnchor(
				time * this.ratioDuration, 0, this.ratioDuration * measureDuration, 128 * this.ratioThickness
				, this.measuresTimelineAnchor64.showZoom, this.measuresTimelineAnchor64.hideZoom
			);
			if (i % 4 == 0) singlemeasuresTimelineAnchor64.content.push(TText(time * this.ratioDuration, 0, 'barNumber textSize64', ('64-' + (i + 1))));
			if (i % 4 == 0) singlemeasuresTimelineAnchor64.content.push({ x: time * this.ratioDuration, y: -64, css: 'barNumber textSize64', text: tempoMeterLabel });
			this.measuresTimelineAnchor64.content.push(singlemeasuresTimelineAnchor64);
			time = time + measureDuration;
		}
	}
	fillTimeLine256(song: ZvoogSchedule) {
		var time = 0;
		for (var i = 0; i < song.measures.length; i++) {
			var measureDuration = meter2seconds(song.measures[i].tempo, song.measures[i].meter);
			var tempoMeterLabel = '' + song.measures[i].tempo + ': ' + song.measures[i].meter.count + '/' + song.measures[i].meter.division;
			let singlemeasuresTimelineAnchor256: TileAnchor = TAnchor(
				time * this.ratioDuration, 0, this.ratioDuration * measureDuration, 128 * this.ratioThickness
				, this.measuresTimelineAnchor256.showZoom, this.measuresTimelineAnchor256.hideZoom
			);
			if (i % 16 == 0) singlemeasuresTimelineAnchor256.content.push({ x: time * this.ratioDuration, y: 0, css: 'barNumber textSize256', text: ('256-' + (i + 1)) });
			if (i % 16 == 0) singlemeasuresTimelineAnchor256.content.push({ x: time * this.ratioDuration, y: -256, css: 'barNumber textSize256', text: tempoMeterLabel });
			this.measuresTimelineAnchor256.content.push(singlemeasuresTimelineAnchor256);
			time = time + measureDuration;
		}
	}
	drawSchedule(song: ZvoogSchedule) {//}, menuButton: TileRectangle) {
		var songDuration = scheduleDuration(song);
		this.clearAnchorsContent(songDuration);
		this.fillTimeLine1(song);
		this.fillTimeLine4(song);
		this.fillTimeLine16(song);
		this.fillTimeLine64(song);
		this.fillTimeLine256(song);
		var time = 0;
		song.obverse=(song.obverse)?song.obverse:0;
		for (var mm = 0; mm < song.measures.length; mm++) {
			var measureDuration = meter2seconds(song.measures[mm].tempo, song.measures[mm].meter);
			let singleMasuresContentAnchor1: TileAnchor = TAnchor(time * this.ratioDuration, 0, this.ratioDuration * measureDuration, 128 * this.ratioThickness, this.contentMain1.showZoom, this.contentMain1.hideZoom);
			let singleMasuresContentAnchor4: TileAnchor = TAnchor(time * this.ratioDuration, 0, this.ratioDuration * measureDuration, 128 * this.ratioThickness, this.contentMain4.showZoom, this.contentMain4.hideZoom);
			let singleMasuresContentAnchor16: TileAnchor = TAnchor(time * this.ratioDuration, 0, this.ratioDuration * measureDuration, 128 * this.ratioThickness, this.contentMain16.showZoom, this.contentMain16.hideZoom);
			let singleMasuresContentAnchor64: TileAnchor = TAnchor(time * this.ratioDuration, 0, this.ratioDuration * measureDuration, 128 * this.ratioThickness, this.contentMain64.showZoom, this.contentMain64.hideZoom);
			let singleMasuresContentAnchor256: TileAnchor = TAnchor(time * this.ratioDuration, 0, this.ratioDuration * measureDuration, 128 * this.ratioThickness, this.contentMain256.showZoom, this.contentMain256.hideZoom);
			this.contentMain1.content.push(singleMasuresContentAnchor1);
			this.contentMain4.content.push(singleMasuresContentAnchor4);
			this.contentMain16.content.push(singleMasuresContentAnchor16);
			this.contentMain64.content.push(singleMasuresContentAnchor64);
			this.contentMain256.content.push(singleMasuresContentAnchor256);
			let singleMasuresSecondAnchor1: TileAnchor = TAnchor(time * this.ratioDuration, 0, this.ratioDuration * measureDuration, 128 * this.ratioThickness, this.contentSecond1.showZoom, this.contentSecond1.hideZoom);
			let singleMasuresSecondAnchor4: TileAnchor = TAnchor(time * this.ratioDuration, 0, this.ratioDuration * measureDuration, 128 * this.ratioThickness, this.contentSecond4.showZoom, this.contentSecond4.hideZoom);
			let singleMasuresSecondAnchor16: TileAnchor = TAnchor(time * this.ratioDuration, 0, this.ratioDuration * measureDuration, 128 * this.ratioThickness, this.contentSecond16.showZoom, this.contentSecond16.hideZoom);
			let singleMasuresSecondAnchor64: TileAnchor = TAnchor(time * this.ratioDuration, 0, this.ratioDuration * measureDuration, 128 * this.ratioThickness, this.contentSecond64.showZoom, this.contentSecond64.hideZoom);
			let singleMasuresSecondAnchor256: TileAnchor = TAnchor(time * this.ratioDuration, 0, this.ratioDuration * measureDuration, 128 * this.ratioThickness, this.contentSecond256.showZoom, this.contentSecond256.hideZoom);
			this.contentSecond1.content.push(singleMasuresSecondAnchor1);
			this.contentSecond4.content.push(singleMasuresSecondAnchor4);
			this.contentSecond16.content.push(singleMasuresSecondAnchor16);
			this.contentSecond64.content.push(singleMasuresSecondAnchor64);
			this.contentSecond256.content.push(singleMasuresSecondAnchor256);
			let singleMasuresOtherAnchor1: TileAnchor = TAnchor(time * this.ratioDuration, 0, this.ratioDuration * measureDuration, 128 * this.ratioThickness, this.contentOther1.showZoom, this.contentOther1.hideZoom);
			let singleMasuresOtherAnchor4: TileAnchor = TAnchor(time * this.ratioDuration, 0, this.ratioDuration * measureDuration, 128 * this.ratioThickness, this.contentOther4.showZoom, this.contentOther4.hideZoom);
			let singleMasuresOtherAnchor16: TileAnchor = TAnchor(time * this.ratioDuration, 0, this.ratioDuration * measureDuration, 128 * this.ratioThickness, this.contentOther16.showZoom, this.contentOther16.hideZoom);
			let singleMasuresOtherAnchor64: TileAnchor = TAnchor(time * this.ratioDuration, 0, this.ratioDuration * measureDuration, 128 * this.ratioThickness, this.contentOther64.showZoom, this.contentOther64.hideZoom);
			let singleMasuresOtherAnchor256: TileAnchor = TAnchor(time * this.ratioDuration, 0, this.ratioDuration * measureDuration, 128 * this.ratioThickness, this.contentOther256.showZoom, this.contentOther256.hideZoom);
			this.contentOther1.content.push(singleMasuresOtherAnchor1);
			this.contentOther4.content.push(singleMasuresOtherAnchor4);
			this.contentOther16.content.push(singleMasuresOtherAnchor16);
			this.contentOther64.content.push(singleMasuresOtherAnchor64);
			this.contentOther256.content.push(singleMasuresOtherAnchor256);
			for (var tt = 0; tt < song.tracks.length; tt++) {
				var track = song.tracks[tt];
				track.obverse=(track.obverse)?track.obverse:0;
				for (var vv = 0; vv < track.voices.length; vv++) {
					var voice: ZvoogVoice = track.voices[vv];
					for(var pp=0;pp<voice.performer.parameters.length;pp++){
						var paremeter=voice.performer.parameters[pp];
					}
					if (tt == song.obverse) {
						if (vv == track.obverse) {
							this.addVoiceMeasure(song, voice, mm, time, 'mainLine', [singleMasuresContentAnchor1, singleMasuresContentAnchor4, singleMasuresContentAnchor16, singleMasuresContentAnchor64, singleMasuresContentAnchor256]);
						} else {
							this.addVoiceMeasure(song, voice, mm, time, 'secondLine', [singleMasuresSecondAnchor1, singleMasuresSecondAnchor4, singleMasuresSecondAnchor16, singleMasuresSecondAnchor64]);
						}
					} else {
						this.addVoiceMeasure(song, voice, mm, time, 'otherLine', [singleMasuresSecondAnchor1, singleMasuresSecondAnchor4, singleMasuresSecondAnchor16]);
					}
					for(var ff=0;ff<voice.filters.length;ff++){
						var filter=voice.filters[ff];
						for(var pp=0;pp<filter.parameters.length;ff++){
							var paremeter=filter.parameters[pp];
						}
					}
				}
				for(var ff=0;ff<track.filters.length;ff++){
					var filter=track.filters[ff];
					for(var pp=0;pp<filter.parameters.length;pp++){
						var paremeter=filter.parameters[pp];
					}
				}
			}
			for(var ff=0;ff<song.filters.length;ff++){
				var filter=song.filters[ff];
				for(var pp=0;pp<filter.parameters.length;ff++){
					var paremeter=filter.parameters[pp];
				}
			}
			time = time + measureDuration;
		}
		//this.addDebugButtons(song, menuButton);
		this.tileLevel.resetModel();
	}
	addVoiceMeasure(song: ZvoogSchedule, voice: ZvoogVoice, i: number, time: number, css: string, anchors: TileAnchor[]) {
		var measure = voice.measureChords[i];
		for (var cc = 0; cc < measure.chords.length; cc++) {
			var chord = measure.chords[cc];
			for (var ee = 0; ee < chord.envelopes.length; ee++) {
				var envelope = chord.envelopes[ee];
				var pitchWhen = meter2seconds(song.measures[i].tempo, chord.when);
				for (var pp = 0; pp < envelope.pitches.length; pp++) {
					var pitch = envelope.pitches[pp];
					var slide = pitch.pitch;
					if (pp + 1 < envelope.pitches.length) {
						slide = envelope.pitches[pp + 1].pitch;
					}
					var pitchDuration = meter2seconds(song.measures[i].tempo, pitch.duration);
					var startShift = 0;
					if (pp == 0) {
						startShift = 0.5 * this.ratioThickness;
					}
					var endShift = 0;
					if (pp == envelope.pitches.length - 1) {
						endShift = -0.49 * this.ratioThickness;
					}
					var line: TileLine = {
						x1: (time + pitchWhen) * this.ratioDuration + startShift
						, x2: (time + pitchWhen + pitchDuration) * this.ratioDuration + endShift
						, y1: (128 - pitch.pitch) * this.ratioThickness
						, y2: (128 - slide) * this.ratioThickness
						, css: 'debug'
					};
					line.css = css;
					for (var aa = 0; aa < anchors.length; aa++) {
						anchors[aa].content.push(cloneLine(line));
					}
					pitchWhen = pitchWhen + pitchDuration;
				}
			}
		}
	}
	addDebugButtons(song: ZvoogSchedule, menuButton: TileRectangle) {
		this.debugAnchor0.content.push(menuButton);
		this.debugAnchor0.content.push({
			x: 10, y: 10, css: 'textSize16', text: 'import'
		});
		var me = this;
		if (song.tracks.length > 0) {
			this.debugAnchor0.content.push({
				x: 10, y: 30, css: 'textSize16', text: '(' + song.tracks.length + ')' + song.tracks[0].title
			});
		}
		this.debugAnchor0.content.push({
			x: 0, y: 20, w: 10, h: 10, rx: 3, ry: 3, css: 'debug'
			, action: function () {
				var tt = song.tracks.shift();
				if (tt) {
					song.tracks.push(tt);
					//me.drawSchedule(song, menuButton)
				}
			}
		});
		if (song.tracks.length > 0) {
			this.debugAnchor0.content.push({
				x: 10, y: 50, css: 'textSize16', text: '(' + song.tracks[0].voices.length + ')' + song.tracks[0].voices[0].title
			});
		}
		this.debugAnchor0.content.push({
			x: 0, y: 40, w: 10, h: 10, rx: 3, ry: 3, css: 'debug'
			, action: function () {
				if (song.tracks.length > 0) {
					var vv = song.tracks[0].voices.shift();
					if (vv) {
						song.tracks[0].voices.push(vv);
						//me.drawSchedule(song, menuButton)
					}
				}
			}
		});
	}
}
