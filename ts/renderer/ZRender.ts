class ZRender {
	tileLevel: TileLevel;
	layers: TileLayerDefinition[] = [];
	zoomMin: number = 1;
	zoomNote: number = 2;
	zoomMeasure: number = 16;
	zoomSong: number = 64;
	zoomFar: number = 256;
	zoomBig: number = 512;
	zoomMax: number = 1024;
	secondWidthInTaps = 96;
	pitchLineThicknessInTaps = 7;
	sizeRatio = 2;

	rhythmPatternDefault: ZvoogMeter[] = [
		{ count: 1, division: 8 }, { count: 1, division: 8 }
		, { count: 1, division: 8 }, { count: 1, division: 8 }
	];


	measureInfoRenderer: MeasureInfoRenderer = new MeasureInfoRenderer();
	pianoRollRenderer: PianoRollRenderer = new PianoRollRenderer();
	gridRenderer: GridRenderer = new GridRenderer();
	timeLineRenderer: TimeLineRenderer = new TimeLineRenderer();
	leftKeysRenderer: LeftKeysRenderer = new LeftKeysRenderer();
	focusManager: FocusManagement = new FocusManagement();

	//upperSelectionScale: SVGElement;
	debugLayerGroup: SVGElement;


	debugAnchor0: TileAnchor;
	debugAnchor1: TileAnchor;
	debugAnchor4: TileAnchor;
	debugAnchor16: TileAnchor;
	debugAnchor64: TileAnchor;
	debugAnchor256: TileAnchor;

	muzXBox: MuzXBox;
	/*
		*/





	constructor(bx: MuzXBox) {
		//this.bindLayers();
		this.muzXBox = bx;
	}

	bindLayers() {


		//this.upperSelectionScale= (document.getElementById('upperSelectionScale') as any) as SVGElement;
		this.debugLayerGroup = (document.getElementById('debugLayerGroup') as any) as SVGElement;
		//this.gridLayerGroup = (document.getElementById('gridLayerGroup') as any) as SVGElement;
		this.tileLevel = new TileLevel((document.getElementById('contentSVG') as any) as SVGElement
			, 1000//50*time
			, 1000//testProject.tracks.length*11
			, this.zoomMin, this.zoomMin, this.zoomMax
			, this.layers);
		//this.measureInfoRenderer.attach(this);
		var lastLevelOfDetails = this.zoomMin;
		this.tileLevel.afterZoomCallback = () => {
			//console.log('check afterZoomCallback', lastLevelOfDetails, this.tileLevel.translateZ);

			var curLOD = this.zoomMin;
			if (this.tileLevel.translateZ >= this.zoomMin) curLOD = this.zoomMin;
			if (this.tileLevel.translateZ >= this.zoomNote) curLOD = this.zoomNote;
			if (this.tileLevel.translateZ >= this.zoomMeasure) curLOD = this.zoomMeasure;
			if (this.tileLevel.translateZ >= this.zoomSong) curLOD = this.zoomSong;
			if (this.tileLevel.translateZ >= this.zoomFar) curLOD = this.zoomFar;
			if (this.tileLevel.translateZ >= this.zoomBig) curLOD = this.zoomBig;
			if (this.tileLevel.translateZ >= this.zoomMax) curLOD = this.zoomMax;

			var curLOD = this.zToLOD(this.tileLevel.translateZ);
			if (curLOD != lastLevelOfDetails) {
				//let songDuration = scheduleSecondsDuration(this.muzXBox.currentSchedule);
				let wholeWidth = gridWidthTp(this.muzXBox.currentSchedule, this.muzXBox.zrenderer.secondWidthInTaps);
				//console.log('LOD', lastLevelOfDetails, curLOD, this.tileLevel.translateZ);
				lastLevelOfDetails = curLOD;
				this.focusManager.resetSpotPosition();
				this.focusManager.reSetFocus(this, wholeWidth);
			}
		};
		this.tileLevel.afterResizeCallback = () => {
			//this.gridRenderer.resizeBackgroundFill();
			this.drawSchedule(this.muzXBox.currentSchedule);
		};

	}

	zToLOD(zz: number): number {
		var curLOD = this.zoomMin;
		if (zz >= this.zoomMin) curLOD = this.zoomMin;
		if (zz >= this.zoomNote) curLOD = this.zoomNote;
		if (zz >= this.zoomMeasure) curLOD = this.zoomMeasure;
		if (zz >= this.zoomSong) curLOD = this.zoomSong;
		if (zz >= this.zoomFar) curLOD = this.zoomFar;
		if (zz >= this.zoomBig) curLOD = this.zoomBig;
		if (zz >= this.zoomMax) curLOD = this.zoomMax;
		return curLOD;
	}
	resetLabel(song: ZvoogSchedule) {
		let s1: string = '';
		let s2: string = '';
		let s3: string = '';
		let s4: string = '';
		let numsf = this.pianoRollRenderer.findFocusedFilter(song.filters);
		if (numsf > -1) {
			s2 = song.filters[numsf].kind;
			let numparam = this.pianoRollRenderer.findFocusedParam(song.filters[numsf].parameters);
			if (numparam > -1) s1 = song.filters[numsf].parameters[numparam].caption;
		} else {
			let trnum = this.pianoRollRenderer.findFocusedTrack(song.tracks);
			if (trnum < 0) trnum = 0;
			if (trnum < song.tracks.length) {
				let track = song.tracks[trnum];
				let vonum = this.pianoRollRenderer.findFocusedInstrument(track.instruments);
				if (vonum < 0) vonum = 0;
				if (vonum < track.instruments.length && this.pianoRollRenderer.needToFocusVoice(song, trnum, vonum)) {
					s2 = track.title;
					s1 = track.instruments[vonum].title;
				} else {
					s3 = track.title;
					let trfi = this.pianoRollRenderer.findFocusedFilter(track.filters);
					if (trfi > -1) {
						s3 = track.title;
						s2 = track.filters[trfi].kind;
						let trfipa = this.pianoRollRenderer.findFocusedParam(track.filters[trfi].parameters);
						if (trfipa > -1) s1 = track.filters[trfi].parameters[trfipa].caption;
					} else {
						if (vonum < track.instruments.length) {
							let voice = track.instruments[vonum];
							if (voice.instrumentSetting.focus) {
								s4 = track.title;
								s3 = voice.title;
								s2 = voice.instrumentSetting.kind;
								let ppar = this.pianoRollRenderer.findFocusedParam(voice.instrumentSetting.parameters);
								if (ppar > -1) {
									s1 = voice.instrumentSetting.parameters[ppar].caption;
								}
							} else {
								s4 = track.title;
								s3 = voice.title;
								let vofi = this.pianoRollRenderer.findFocusedFilter(voice.filters);
								if (vofi > -1) {
									s2 = voice.filters[vofi].kind;
									let vfpar = this.pianoRollRenderer.findFocusedParam(voice.filters[vofi].parameters);
									if (vfpar > -1) s1 = voice.filters[vofi].parameters[vfpar].caption;
								}
							}
						}
					}
				}
			}
		}
		/*let obTrFx = song.obverseTrackFilter = (song.obverseTrackFilter) ? song.obverseTrackFilter : 0;
		if (obTrFx < song.tracks.length) {

			if (song.tracks.length) {
				let track = song.tracks[obTrFx];
				let obVxFx = (track.obverseVoiceFilter) ? track.obverseVoiceFilter : 0;
				if (obVxFx < track.voices.length) {
					if (track.voices.length) {
						let vx: ZvoogVoice = track.voices[obVxFx];
						vx.obversePerformerFilter;
					}
				} else {
					if (track.filters.length) {
						let trfx: ZvoogFilterSetting = track.filters[obVxFx - track.voices.length];
						if (trfx.parameters) if (trfx.parameters.length > 0) {
							let trfxparnu: number = trfx.obverseParameter ? trfx.obverseParameter : 0;
							s1 = trfx.parameters[trfxparnu].caption;
							s2 = trfx.kind;
							s3 = track.title;
						}
					}
				}
			}
		} else {
			if (song.filters.length) {
				let fx: ZvoogFilterSetting = song.filters[obTrFx - song.tracks.length];
				if (fx.parameters) if (fx.parameters.length > 0) {
					let parnu: number = fx.obverseParameter ? fx.obverseParameter : 0;
					s1 = fx.parameters[parnu].caption;
					s2 = fx.kind;
				}
			}
		}*/
		//console.log('resetLabel', s4, '/', s3, '/', s2, '/', s1, song);
		let i1 = document.getElementById('selectionInfo1');
		if (i1) i1.innerText = s1;
		let i2 = document.getElementById('selectionInfo2');
		if (i2) i2.innerText = s2;
		let i3 = document.getElementById('selectionInfo3');
		if (i3) i3.innerText = s3;
		let i4 = document.getElementById('selectionInfo4');
		if (i4) i4.innerText = s4;
	}
	levelOfDetails(zz: number) {
		if (zz < this.zoomNote) { return 1; }
		if (zz < this.zoomMeasure) { return 4; }
		if (zz < this.zoomSong) { return 16; }
		if (zz < this.zoomFar) { return 64; }
		return 256;
	}
	initUI(bx: MuzXBox) {
		this.initDebugAnchors();
		//this.initTimelineAnchors();
		//this.initMeasureInfoAnchors();

		//this.initGridAnchors();
		this.measureInfoRenderer.attach(this);
		this.pianoRollRenderer.attach(this);
		this.gridRenderer.attach(this);
		this.timeLineRenderer.attach(this);
		this.focusManager.attachFocus(bx, this);
		this.leftKeysRenderer.attach(this);

		//this.gridRenderer.resizeBackgroundFill();

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

	/*
	*/

	clearResizeSingleAnchor(song: ZvoogSchedule,anchor: TileAnchor, wholeWidth: number) {
		anchor.content.length = 0;
		//anchor.ww = this.ratioDuration * songDuration;
		anchor.ww = wholeWidth;
		//anchor.hh = 128 * this.ratioThickness;
		anchor.hh = wholeHeightTp(song,this.pitchLineThicknessInTaps);
	}
	clearAnchorsContent(song: ZvoogSchedule,wholeWidth: number, wholeHeight: number): void {
		let anchors: TileAnchor[] = [
			this.debugAnchor0, this.debugAnchor1, this.debugAnchor4, this.debugAnchor16, this.debugAnchor64, this.debugAnchor256
			//, this.measuresTimelineAnchor1, this.measuresTimelineAnchor4, this.measuresTimelineAnchor16, this.measuresTimelineAnchor64, this.measuresTimelineAnchor256

			//, this.gridAnchor1, this.gridAnchor4, this.gridAnchor16, this.gridAnchor64, this.gridAnchor256
		];

		for (let i = 0; i < anchors.length; i++) {
			this.clearResizeSingleAnchor(song,anchors[i], wholeWidth);
		}
		this.focusManager.clearFocusAnchorsContent(this, wholeWidth);
		this.gridRenderer.clearGridAnchorsContent(this, wholeWidth);
		this.measureInfoRenderer.clearMeasuresAnchorsContent(this, wholeWidth);
		this.pianoRollRenderer.clearPRAnchorsContent(this, wholeWidth);
		this.timeLineRenderer.clearTLAnchorsContent(this, wholeWidth);
		this.leftKeysRenderer.clearKeysAnchorsContent(this, wholeWidth);
		this.tileLevel.innerWidth = wholeWidth * this.tileLevel.tapSize;
		this.tileLevel.innerHeight = wholeHeight * this.tileLevel.tapSize;

	}

	drawSchedule(song: ZvoogSchedule) {//}, menuButton: TileRectangle) {
		//let songDuration = scheduleSecondsDuration(song);
		let wholeWidth = wholeWidthTp(song, this.secondWidthInTaps);
		let wholeHeight = wholeHeightTp(song,this.pitchLineThicknessInTaps);
		this.clearAnchorsContent(song,wholeWidth, wholeHeight);
		this.measureInfoRenderer.fillMeasureInfo(song, this.secondWidthInTaps, this.pitchLineThicknessInTaps);
		this.pianoRollRenderer.addPianoRoll(this, this.muzXBox.zMainMenu.layerSelector,
			song, this.secondWidthInTaps, this.pitchLineThicknessInTaps);
		let rhythm: ZvoogMeter[] = this.rhythmPatternDefault;
		if (song.rhythm) {
			if (song.rhythm.length) {
				rhythm = song.rhythm;
			}
		}
		this.gridRenderer.drawGrid(this, song, this.secondWidthInTaps, this.pitchLineThicknessInTaps, rhythm);
		this.timeLineRenderer.drawSchedule(this, song, this.secondWidthInTaps, this.pitchLineThicknessInTaps);
		this.leftKeysRenderer.drawKeys(this, song, this.secondWidthInTaps, this.pitchLineThicknessInTaps);
		/*
		this.debugAnchor0.content.push({
			x: leftGridMargin
			, y: topGridMargin
			, w: gridWidthTp(song, this.ratioDuration)//songDuration * this.ratioDuration
			, h: gridHeightTp(this.ratioThickness)//(ocataveCount * 12) * this.ratioThickness
			, css: 'debug'
		});
		this.debugAnchor0.content.push({
			x: 0
			, y: 0
			, w: wholeWidthTp(song, this.ratioDuration)//songDuration * this.ratioDuration+leftGridMargin+rightGridMargin
			, h: wholeHeightTp(this.ratioThickness)//(ocataveCount * 12) * this.ratioThickness + topGridMargin + bottomGridMargin
			, css: 'debug'
		});
*/
		/*
		let time = 0;
		song.obverseTrackFilter = (song.obverseTrackFilter) ? song.obverseTrackFilter : 0;
		for (let mm = 0; mm < song.measures.length; mm++) {
			let measureDuration = meter2seconds(song.measures[mm].tempo, song.measures[mm].meter);


			time = time + measureDuration;
		}
*/
		this.tileLevel.resetModel();
		this.focusManager.reSetFocus(this, wholeWidth);//, song,this.tileLevel.translateX,this.tileLevel.translateY,this.tileLevel.translateZ);
		this.resetLabel(song);
		this.gridRenderer.resizeBackgroundFill();
	}

}
