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

	measureInfoRenderer: MeasureInfoRenderer = new MeasureInfoRenderer();
	pianoRollRenderer: PianoRollRenderer = new PianoRollRenderer();
	gridRenderer:GridRenderer=new GridRenderer();
	

	//upperSelectionScale: SVGElement;
	debugLayerGroup: SVGElement;
	

	debugAnchor0: TileAnchor;
	debugAnchor1: TileAnchor;
	debugAnchor4: TileAnchor;
	debugAnchor16: TileAnchor;
	debugAnchor64: TileAnchor;
	debugAnchor256: TileAnchor;

	
	/*
		measuresTimelineAnchor1: TileAnchor;
		measuresTimelineAnchor4: TileAnchor;
		measuresTimelineAnchor16: TileAnchor;
		measuresTimelineAnchor64: TileAnchor;
		measuresTimelineAnchor256: TileAnchor;*/



	

	constructor() {
		//this.bindLayers();
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
	}
	initUI() {
		this.initDebugAnchors();
		//this.initTimelineAnchors();
		//this.initMeasureInfoAnchors();
		
		//this.initGridAnchors();
		this.measureInfoRenderer.attach(this);
		this.pianoRollRenderer.attach(this);
		this.gridRenderer.attach(this);
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
	initTimeScaleAnchors() {
		this.measuresTimelineAnchor1 = TAnchor(0, 0, 1111, 1111, this.zoomMin, this.zoomNote);
		this.measuresTimelineAnchor4 = TAnchor(0, 0, 1111, 1111, this.zoomNote, this.zoomMeasure);
		this.measuresTimelineAnchor16 = TAnchor(0, 0, 1111, 1111, this.zoomMeasure, this.zoomSong);
		this.measuresTimelineAnchor64 = TAnchor(0, 0, 1111, 1111, this.zoomSong, this.zoomFar);
		this.measuresTimelineAnchor256 = TAnchor(0, 0, 1111, 1111, this.zoomFar, this.zoomBig + 1);
		this.layers.push({
			g: this.upperSelectionScale, stickTop: 0, anchors: [
				this.measuresTimelineAnchor1, this.measuresTimelineAnchor4, this.measuresTimelineAnchor16, this.measuresTimelineAnchor64, this.measuresTimelineAnchor256
			]
		});
	}*/
	
	clearSingleAnchor(anchor: TileAnchor, songDuration: number) {
		anchor.content.length = 0;
		anchor.ww = this.ratioDuration * songDuration;
		anchor.hh = 128 * this.ratioThickness;
	}
	clearAnchorsContent(songDuration: number): void {
		let anchors: TileAnchor[] = [
			this.debugAnchor0, this.debugAnchor1, this.debugAnchor4, this.debugAnchor16, this.debugAnchor64, this.debugAnchor256
			//, this.measuresTimelineAnchor1, this.measuresTimelineAnchor4, this.measuresTimelineAnchor16, this.measuresTimelineAnchor64, this.measuresTimelineAnchor256
			
			//, this.gridAnchor1, this.gridAnchor4, this.gridAnchor16, this.gridAnchor64, this.gridAnchor256
		];

		for (let i = 0; i < anchors.length; i++) {
			this.clearSingleAnchor(anchors[i], songDuration);
		}
		this.gridRenderer.clearAnchorsContent(this, songDuration)
		this.measureInfoRenderer.clearAnchorsContent(this, songDuration)
		this.pianoRollRenderer.clearAnchorsContent(this, songDuration)
		this.tileLevel.innerWidth = this.ratioDuration * songDuration * this.tileLevel.tapSize;
		this.tileLevel.innerHeight = 128 * this.ratioThickness * this.tileLevel.tapSize;

	}

	drawSchedule(song: ZvoogSchedule) {//}, menuButton: TileRectangle) {
		let songDuration = scheduleDuration(song);
		this.clearAnchorsContent(songDuration);
		this.measureInfoRenderer.fillMeasureInfo(song, this.ratioDuration, this.ratioThickness);
		this.pianoRollRenderer.drawSchedule(song, this.ratioDuration, this.ratioThickness);
		this.gridRenderer.drawSchedule(this,song, this.ratioDuration, this.ratioThickness);
		let time = 0;
		song.obverseTrackFilter = (song.obverseTrackFilter) ? song.obverseTrackFilter : 0;
		for (let mm = 0; mm < song.measures.length; mm++) {
			let measureDuration = meter2seconds(song.measures[mm].tempo, song.measures[mm].meter);

			
			time = time + measureDuration;
		}
		this.tileLevel.resetModel();
	}
	
}
