class MixerUI {
	//svgs: SVGElement[] = [];
	//svg: SVGElement ;
	//zoomLayers: TileLayerDefinition[] = [];
	gridLayers: TileLayerDefinition;
	trackLayers: TileLayerDefinition;
	firstLayers: TileLayerDefinition;
	fanLayer: TileLayerDefinition;
	levels: MixerZoomLevel[] = [];
	fillerAnchor: TileAnchor;
	//samplerUI: SamplerRows;
	fanPane: FanPane = new FanPane();
	//iconsFanAnchor: TileAnchor;
	constructor() {

	}

	reFillMixerUI(//data: Zvoog_Project
		cfg: MixerDataMathUtility
	) {
		console.log('reFillMixerUI',this.fanLayer.anchors.length);
		//let mixm: MixerDataMath = new MixerDataMath(data);
		let ww = cfg.wholeWidth();
		let hh = cfg.wholeHeight();
		for (let ii = 0; ii < zoomPrefixLevelsCSS.length - 1; ii++) {
			//this.zoomLayers[ii].anchors[0].ww = ww;
			//this.zoomLayers[ii].anchors[0].hh = hh;
			this.gridLayers.anchors[ii].ww = ww;
			this.gridLayers.anchors[ii].hh = hh;

			this.trackLayers.anchors[ii].ww = ww;
			this.trackLayers.anchors[ii].hh = hh;

			this.firstLayers.anchors[ii].ww = ww;
			this.firstLayers.anchors[ii].hh = hh;

			this.fanLayer.anchors[ii].ww = ww;
			this.fanLayer.anchors[ii].hh = hh;
			this.fanLayer.anchors[ii].content=[];
			
			this.levels[ii].reCreateBars(cfg);
		}
		this.fanPane.resetPlates(cfg,this.fanLayer.anchors);
		//this.iconsFanAnchor.ww = cfg.wholeWidth() - cfg.leftPad - cfg.rightPad;
		//this.iconsFanAnchor.hh = cfg.gridHeight();
		this.fillerAnchor.xx = cfg.leftPad;
		this.fillerAnchor.yy = cfg.gridTop();
		this.fillerAnchor.ww = cfg.wholeWidth() - cfg.leftPad - cfg.rightPad;
		this.fillerAnchor.hh = cfg.gridHeight();
		this.fillerAnchor.content = [];
		this.reFillWholeRatio(cfg);
		this.reFillSingleRatio(cfg);
		
	}
	createMixerLayers(): TileLayerDefinition[] {
		let tracksLayerZoom: SVGElement = (document.getElementById('tracksLayerZoom') as any) as SVGElement;
		this.trackLayers = { g: tracksLayerZoom, anchors: [], mode: LevelModes.normal };

		let gridLayerZoom: SVGElement = (document.getElementById('gridLayerZoom') as any) as SVGElement;
		this.gridLayers = { g: gridLayerZoom, anchors: [], mode: LevelModes.normal };

		let firstLayerZoom: SVGElement = (document.getElementById('firstLayerZoom') as any) as SVGElement;
		this.firstLayers = { g: firstLayerZoom, anchors: [], mode: LevelModes.normal };

		let fanSVGgroup: SVGElement = (document.getElementById('fanLayer') as any) as SVGElement;
		this.fanLayer = { g: fanSVGgroup, anchors: [], mode: LevelModes.normal };
		/*
		this.iconsFanAnchor = {
			showZoom: zoomPrefixLevelsCSS[0].minZoom
			, hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length-1].minZoom
			, xx: 0, yy: 0, ww: 1, hh: 1, content: []
		};
		console.log('createMixerLayers',this.iconsFanAnchor);
		this.fanLayer.anchors.push(this.iconsFanAnchor);
*/
		for (let ii = 0; ii < zoomPrefixLevelsCSS.length - 1; ii++) {
			//this.svgs.push((document.getElementById(zoomPrefixLevelsCSS[ii].svg) as any) as SVGElement);
			let mixerGridAnchor: TileAnchor = {
				showZoom: zoomPrefixLevelsCSS[ii].minZoom
				, hideZoom: zoomPrefixLevelsCSS[ii + 1].minZoom
				, xx: 0, yy: 0, ww: 1, hh: 1, content: []
			};
			this.gridLayers.anchors.push(mixerGridAnchor);
			let mixerTrackAnchor: TileAnchor = {
				showZoom: zoomPrefixLevelsCSS[ii].minZoom
				, hideZoom: zoomPrefixLevelsCSS[ii + 1].minZoom
				, xx: 0, yy: 0, ww: 1, hh: 1, content: []
			};
			this.trackLayers.anchors.push(mixerTrackAnchor);
			let mixerFirstAnchor: TileAnchor = {
				showZoom: zoomPrefixLevelsCSS[ii].minZoom
				, hideZoom: zoomPrefixLevelsCSS[ii + 1].minZoom
				, xx: 0, yy: 0, ww: 1, hh: 1, content: []
			};
			this.firstLayers.anchors.push(mixerFirstAnchor);
			let fanLevelAnchor = {
				showZoom: zoomPrefixLevelsCSS[ii].minZoom
				, hideZoom: zoomPrefixLevelsCSS[ii + 1].minZoom
				, xx: 0, yy: 0, ww: 1, hh: 1, content: []
			};

			this.fanLayer.anchors.push(fanLevelAnchor);

			

			this.levels.push(new MixerZoomLevel(ii
				, mixerGridAnchor
				, mixerTrackAnchor
				, mixerFirstAnchor
			));

			//
		}
		console.log('this.fanLayer',this.fanLayer);
		this.fillerAnchor = {
			showZoom: zoomPrefixLevelsCSS[6].minZoom
			, hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom + 1
			, xx: 0, yy: 0, ww: 1, hh: 1, content: []
		};
		this.gridLayers.anchors.push(this.fillerAnchor);
		return [this.gridLayers, this.trackLayers, this.firstLayers,this.fanLayer];
	}
	reFillSingleRatio(cfg: MixerDataMathUtility) {
		let countFunction: (cfg: MixerDataMathUtility, barIdx: number) => number;
		let yy = cfg.gridTop() + cfg.gridHeight() / 8;
		let hh = cfg.gridHeight() * 6 / 8;
		if (cfg.data.focus) {
			if (cfg.data.focus == 1) {
				countFunction = this.barDrumCount;
				yy = cfg.gridTop() + cfg.gridHeight() - 2 * cfg.data.percussions.length;
				hh = 2 * cfg.data.percussions.length;
			} else {
				if (cfg.data.focus == 2) {
					countFunction = this.barAutoCount;
					yy = cfg.gridTop();
					hh = cfg.maxAutomationsCount;
				} else {
					countFunction = this.barCommentsCount;
					yy = cfg.gridTop();
					hh = cfg.commentsMaxHeight();
				}
			}
		} else {
			countFunction = this.barTrackCount;
		}
		let mxItems = 0;
		for (let bb = 0; bb < cfg.data.timeline.length; bb++) {
			let itemcount = countFunction(cfg, bb);
			if (mxItems < itemcount) {
				mxItems = itemcount;
			}
		}
		if (mxItems < 1) mxItems = 1;
		let barX = 0;
		for (let bb = 0; bb < cfg.data.timeline.length; bb++) {
			let itemcount = countFunction(cfg, bb);
			let filIdx = 1 + Math.round(7 * itemcount / mxItems);
			let css = 'mixFiller' + filIdx;
			let barwidth = MMUtil().set(cfg.data.timeline[bb].metre).duration(cfg.data.timeline[bb].tempo) * cfg.widthDurationRatio;
			let fillRectangle: TileRectangle = {
				x: cfg.leftPad + barX
				, y: yy
				, w: barwidth
				, h: hh
				, css: css
			};
			this.fillerAnchor.content.push(fillRectangle);
			barX = barX + barwidth;
		}
	}
	reFillWholeRatio(cfg: MixerDataMathUtility) {

		let yy = cfg.gridTop();
		let hh = cfg.gridHeight() / 8;
		if (cfg.data.focus) {
			if (cfg.data.focus == 1) {
				yy = cfg.gridTop();
				hh = cfg.gridHeight() - 2 * cfg.data.percussions.length;
			} else {
				if (cfg.data.focus == 2) {
					yy = cfg.gridTop() + cfg.maxAutomationsCount;
					hh = cfg.gridHeight() - cfg.maxAutomationsCount;
				} else {
					yy = cfg.gridTop() + cfg.commentsMaxHeight();
					hh = cfg.gridHeight() - cfg.commentsMaxHeight();
				}
			}
		}
		let countFunction: (cfg: MixerDataMathUtility, barIdx: number) => number = (cfg: MixerDataMathUtility, barIdx: number) => {
			return this.barDrumCount(cfg, barIdx) + this.barAutoCount(cfg, barIdx) + this.barCommentsCount(cfg, barIdx) + this.barTrackCount(cfg, barIdx);
		};
		let mxItems = 0;
		for (let bb = 0; bb < cfg.data.timeline.length; bb++) {
			let itemcount = countFunction(cfg, bb);
			if (mxItems < itemcount) {
				mxItems = itemcount;
			}
		}
		if (mxItems < 1) mxItems = 1;
		let barX = 0;
		for (let bb = 0; bb < cfg.data.timeline.length; bb++) {
			let itemcount = countFunction(cfg, bb);
			let filIdx = 1 + Math.round(7 * itemcount / mxItems);
			let css = 'mixFiller' + filIdx;
			let barwidth = MMUtil().set(cfg.data.timeline[bb].metre).duration(cfg.data.timeline[bb].tempo) * cfg.widthDurationRatio;
			let fillRectangle: TileRectangle = {
				x: cfg.leftPad + barX
				, y: yy//cfg.gridTop()
				, w: barwidth
				, h: hh//cfg.gridHeight()
				, css: css
			};
			this.fillerAnchor.content.push(fillRectangle);
			if (cfg.data.focus) {
				//
			} else {
				this.fillerAnchor.content.push({
					x: cfg.leftPad + barX
					, y: cfg.gridTop() + cfg.gridHeight() * 7 / 8
					, w: barwidth
					, h: hh//cfg.gridHeight()
					, css: css
				});
			}

			barX = barX + barwidth;
		}
	}

	barTrackCount(cfg: MixerDataMathUtility, bb: number): number {
		let notecount = 0;
		for (let tt = 0; tt < cfg.data.tracks.length; tt++) {
			let bar = cfg.data.tracks[tt].measures[bb];
			if (bar) {
				for (let cc = 0; cc < bar.chords.length; cc++) {
					notecount = notecount + bar.chords[cc].notes.length;
				}
			}
		}
		return notecount;
	}
	barDrumCount(cfg: MixerDataMathUtility, bb: number): number {
		let drumcount = 0;
		for (let tt = 0; tt < cfg.data.percussions.length; tt++) {
			let bar = cfg.data.percussions[tt].measures[bb];
			if (bar) {
				drumcount = drumcount + bar.skips.length;
			}
		}
		return drumcount;
	}
	barAutoCount(cfg: MixerDataMathUtility, bb: number): number {
		let autoCnt = 0;
		for (let ff = 0; ff < cfg.data.filters.length; ff++) {
			let filter = cfg.data.filters[ff];
			if (filter.automation) {
				if (filter.automation.measures[bb]) {
					autoCnt = autoCnt + filter.automation.measures[bb].changes.length;
				}
			}
		}
		return autoCnt;
	}
	barCommentsCount(cfg: MixerDataMathUtility, bb: number): number {
		if (cfg.data.comments[bb]) {
			if (cfg.data.comments[bb].points) {
				return cfg.data.comments[bb].points.length;
			}
		}
		return 0;
	}
	
}
