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
		let anchors: TileAnchor[] = [
			this.debugAnchor0, this.debugAnchor1, this.debugAnchor4, this.debugAnchor16, this.debugAnchor64, this.debugAnchor256
			, this.measuresTimelineAnchor1, this.measuresTimelineAnchor4, this.measuresTimelineAnchor16, this.measuresTimelineAnchor64, this.measuresTimelineAnchor256
			, this.contentMain1, this.contentMain4, this.contentMain16, this.contentMain64, this.contentMain256
			, this.contentSecond1, this.contentSecond4, this.contentSecond16, this.contentSecond64, this.contentSecond256
			, this.contentOther1, this.contentOther4, this.contentOther16, this.contentOther64, this.contentOther256
		];
		for (let i = 0; i < anchors.length; i++) {
			this.clearSingleAnchor(anchors[i], songDuration);
		}
		this.tileLevel.innerWidth = this.ratioDuration * songDuration * this.tileLevel.tapSize;
		this.tileLevel.innerHeight = 128 * this.ratioThickness * this.tileLevel.tapSize;

	}
	fillTimeLine1(song: ZvoogSchedule) {
		let time = 0;
		for (let i = 0; i < song.measures.length; i++) {
			let measureDuration = meter2seconds(song.measures[i].tempo, song.measures[i].meter);
			let tempoMeterLabel = '' + song.measures[i].tempo + ': ' + song.measures[i].meter.count + '/' + song.measures[i].meter.division;
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
		let time = 0;
		for (let i = 0; i < song.measures.length; i++) {
			let measureDuration = meter2seconds(song.measures[i].tempo, song.measures[i].meter);
			let tempoMeterLabel = '' + song.measures[i].tempo + ': ' + song.measures[i].meter.count + '/' + song.measures[i].meter.division;
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
		let time = 0;
		for (let i = 0; i < song.measures.length; i++) {
			let measureDuration = meter2seconds(song.measures[i].tempo, song.measures[i].meter);
			let tempoMeterLabel = '' + song.measures[i].tempo + ': ' + song.measures[i].meter.count + '/' + song.measures[i].meter.division;
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
		let time = 0;
		for (let i = 0; i < song.measures.length; i++) {
			let measureDuration = meter2seconds(song.measures[i].tempo, song.measures[i].meter);
			let tempoMeterLabel = '' + song.measures[i].tempo + ': ' + song.measures[i].meter.count + '/' + song.measures[i].meter.division;
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
		let time = 0;
		for (let i = 0; i < song.measures.length; i++) {
			let measureDuration = meter2seconds(song.measures[i].tempo, song.measures[i].meter);
			let tempoMeterLabel = '' + song.measures[i].tempo + ': ' + song.measures[i].meter.count + '/' + song.measures[i].meter.division;
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
		let songDuration = scheduleDuration(song);
		this.clearAnchorsContent(songDuration);
		this.fillTimeLine1(song);
		this.fillTimeLine4(song);
		this.fillTimeLine16(song);
		this.fillTimeLine64(song);
		this.fillTimeLine256(song);
		let time = 0;
		song.obverseTrackFilter = (song.obverseTrackFilter) ? song.obverseTrackFilter : 0;
		for (let mm = 0; mm < song.measures.length; mm++) {
			let measureDuration = meter2seconds(song.measures[mm].tempo, song.measures[mm].meter);
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


			let measuresquare: TileRectangle = {
				x: time * this.ratioDuration, y: 0, w: this.ratioDuration * measureDuration, h: 128 * this.ratioThickness
				, rx: 20
				, ry: 20
				, css: 'debug'
			};
			let measurenum: TileText = { x: time * this.ratioDuration, y: 64, text: ''+mm, css: 'debug textSize64' };
			singleMasuresContentAnchor1.content.push(measurenum);
			singleMasuresContentAnchor4.content.push(measurenum);
			singleMasuresContentAnchor16.content.push(measurenum);
			singleMasuresContentAnchor64.content.push(measurenum);
			singleMasuresContentAnchor256.content.push(measurenum);
			singleMasuresContentAnchor1.content.push(measuresquare);
			singleMasuresContentAnchor4.content.push(measuresquare);
			singleMasuresContentAnchor16.content.push(measuresquare);
			singleMasuresContentAnchor64.content.push(measuresquare);
			singleMasuresContentAnchor256.content.push(measuresquare);

			for (let tt = 0; tt < song.tracks.length; tt++) {
				let track = song.tracks[tt];
				track.obverseVoiceFilter = (track.obverseVoiceFilter) ? track.obverseVoiceFilter : 0;
				for (let vv = 0; vv < track.voices.length; vv++) {
					let voice: ZvoogVoice = track.voices[vv];
					voice.obversePerformerFilter = (voice.obversePerformerFilter) ? voice.obversePerformerFilter : 0;
					for (let pp = 0; pp < voice.performer.parameters.length; pp++) {
						let paremeter = voice.performer.parameters[pp];
						if (song.obverseTrackFilter == tt && track.obverseVoiceFilter == vv && voice.obversePerformerFilter == 0) {
							voice.performer.obverseParameter = (voice.performer.obverseParameter) ? voice.performer.obverseParameter : 0;
							if (voice.performer.obverseParameter == pp) {
								this.addParameterMeasure(song, paremeter, mm, time, 'mainLine', [singleMasuresContentAnchor1, singleMasuresContentAnchor4, singleMasuresContentAnchor16, singleMasuresContentAnchor64, singleMasuresContentAnchor256]);
							} else {
								this.addParameterMeasure(song, paremeter, mm, time, 'secondLine', [singleMasuresSecondAnchor1, singleMasuresSecondAnchor4, singleMasuresSecondAnchor16, singleMasuresSecondAnchor64]);
							}
						} else {
							this.addParameterMeasure(song, paremeter, mm, time, 'otherLine', [singleMasuresSecondAnchor1, singleMasuresSecondAnchor4, singleMasuresSecondAnchor16]);
						}
					}
					if (tt == song.obverseTrackFilter) {
						if (vv == track.obverseVoiceFilter) {
							this.addVoiceMeasure(song, voice, mm, time, 'mainLine', [singleMasuresContentAnchor1, singleMasuresContentAnchor4, singleMasuresContentAnchor16, singleMasuresContentAnchor64, singleMasuresContentAnchor256]);
						} else {
							this.addVoiceMeasure(song, voice, mm, time, 'secondLine', [singleMasuresSecondAnchor1, singleMasuresSecondAnchor4, singleMasuresSecondAnchor16, singleMasuresSecondAnchor64]);
						}
					} else {
						this.addVoiceMeasure(song, voice, mm, time, 'otherLine', [singleMasuresSecondAnchor1, singleMasuresSecondAnchor4, singleMasuresSecondAnchor16]);
					}
					for (let ff = 0; ff < voice.filters.length; ff++) {
						let filter = voice.filters[ff];
						for (let pp = 0; pp < filter.parameters.length; pp++) {
							let paremeter = filter.parameters[pp];
							if (song.obverseTrackFilter == tt && track.obverseVoiceFilter == vv && voice.obversePerformerFilter == ff + 1) {
								filter.obverseParameter = (filter.obverseParameter) ? filter.obverseParameter : 0;
								if (filter.obverseParameter == pp) {
									this.addParameterMeasure(song, paremeter, mm, time, 'mainLine', [singleMasuresContentAnchor1, singleMasuresContentAnchor4, singleMasuresContentAnchor16, singleMasuresContentAnchor64, singleMasuresContentAnchor256]);
								} else {
									this.addParameterMeasure(song, paremeter, mm, time, 'secondLine', [singleMasuresSecondAnchor1, singleMasuresSecondAnchor4, singleMasuresSecondAnchor16, singleMasuresSecondAnchor64]);
								}
							} else {
								this.addParameterMeasure(song, paremeter, mm, time, 'otherLine', [singleMasuresSecondAnchor1, singleMasuresSecondAnchor4, singleMasuresSecondAnchor16]);
							}
						}
					}
				}
				for (let ff = 0; ff < track.filters.length; ff++) {
					let filter = track.filters[ff];
					for (let pp = 0; pp < filter.parameters.length; pp++) {
						let paremeter = filter.parameters[pp];
						if (song.obverseTrackFilter == tt && track.obverseVoiceFilter == track.voices.length + ff) {
							filter.obverseParameter = (filter.obverseParameter) ? filter.obverseParameter : 0;
							if (filter.obverseParameter == pp) {
								this.addParameterMeasure(song, paremeter, mm, time, 'mainLine', [singleMasuresContentAnchor1, singleMasuresContentAnchor4, singleMasuresContentAnchor16, singleMasuresContentAnchor64, singleMasuresContentAnchor256]);
							} else {
								this.addParameterMeasure(song, paremeter, mm, time, 'secondLine', [singleMasuresSecondAnchor1, singleMasuresSecondAnchor4, singleMasuresSecondAnchor16, singleMasuresSecondAnchor64]);
							}
						} else {
							this.addParameterMeasure(song, paremeter, mm, time, 'otherLine', [singleMasuresSecondAnchor1, singleMasuresSecondAnchor4, singleMasuresSecondAnchor16]);
						}
					}
				}
			}
			for (let ff = 0; ff < song.filters.length; ff++) {
				let filter = song.filters[ff];
				for (let pp = 0; pp < filter.parameters.length; pp++) {
					let paremeter = filter.parameters[pp];
					if (song.obverseTrackFilter == song.tracks.length + ff) {
						filter.obverseParameter = (filter.obverseParameter) ? filter.obverseParameter : 0;
						if (filter.obverseParameter == pp) {
							this.addParameterMeasure(song, paremeter, mm, time, 'mainLine', [singleMasuresContentAnchor1, singleMasuresContentAnchor4, singleMasuresContentAnchor16, singleMasuresContentAnchor64, singleMasuresContentAnchor256]);
						} else {
							this.addParameterMeasure(song, paremeter, mm, time, 'secondLine', [singleMasuresSecondAnchor1, singleMasuresSecondAnchor4, singleMasuresSecondAnchor16, singleMasuresSecondAnchor64]);
						}
					} else {
						this.addParameterMeasure(song, paremeter, mm, time, 'otherLine', [singleMasuresSecondAnchor1, singleMasuresSecondAnchor4, singleMasuresSecondAnchor16]);
					}
				}
			}
			time = time + measureDuration;
		}
		//this.addDebugButtons(song, menuButton);
		this.tileLevel.resetModel();
	}
	addParameterMeasure(song: ZvoogSchedule, parameter: ZvoogParameterData, measureNum: number, time: number, css: string, anchors: TileAnchor[]) {
		let point: ZvoogCurvePoint = parameter.points[0];
		for (let aa = 0; aa < anchors.length; aa++) {
			let line: TileLine = {
				x1: 0
				, x2: 0 + 1
				, y1: 128 - point.velocity
				, y2: 128 - point.velocity + 1
				, css: css
			};
			anchors[aa].content.push(cloneLine(line));
		}
	}
	addVoiceMeasure(song: ZvoogSchedule, voice: ZvoogVoice, measureNum: number, time: number, css: string, anchors: TileAnchor[]) {
		let measure = voice.measureChords[measureNum];
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
						startShift = 0.5 * this.ratioThickness;
					}
					let endShift = 0;
					if (pp == envelope.pitches.length - 1) {
						endShift = -0.49 * this.ratioThickness;
					}
					let line: TileLine = {
						x1: (time + pitchWhen) * this.ratioDuration + startShift
						, x2: (time + pitchWhen + pitchDuration) * this.ratioDuration + endShift
						, y1: (128 - pitch.pitch) * this.ratioThickness
						, y2: (128 - slide) * this.ratioThickness
						, css: css
					};
					//line.css = css;
					for (let aa = 0; aa < anchors.length; aa++) {
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
		let me = this;
		if (song.tracks.length > 0) {
			this.debugAnchor0.content.push({
				x: 10, y: 30, css: 'textSize16', text: '(' + song.tracks.length + ')' + song.tracks[0].title
			});
		}
		this.debugAnchor0.content.push({
			x: 0, y: 20, w: 10, h: 10, rx: 3, ry: 3, css: 'debug'
			, action: function () {
				let tt = song.tracks.shift();
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
					let vv = song.tracks[0].voices.shift();
					if (vv) {
						song.tracks[0].voices.push(vv);
						//me.drawSchedule(song, menuButton)
					}
				}
			}
		});
	}
}
