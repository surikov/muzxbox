class MixerUI {
	//svgs: SVGElement[] = [];
	//svg: SVGElement ;
	//zoomLayers: TileLayerDefinition[] = [];
	gridLayers: TileLayerDefinition;
	trackLayers: TileLayerDefinition;
	firstLayers: TileLayerDefinition;

	fanLayer: TileLayerDefinition;
	fanSVGgroup: SVGElement;
	spearsLayer: TileLayerDefinition;

	levels: MixerZoomLevel[] = [];
	fillerAnchor: TileAnchor;
	//samplerUI: SamplerRows;
	fanPane: FanPane = new FanPane();
	//iconsFanAnchor: TileAnchor;
	constructor() {

	}

	reFillMixerUI(//data: Zvoog_Project

	) {
		//console.log('reFillMixerUI', this.fanLayer.anchors.length);
		//let mixm: MixerDataMath = new MixerDataMath(data);
		let ww = globalCommandDispatcher.cfg().wholeWidth();
		let hh = globalCommandDispatcher.cfg().wholeHeight();
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
			this.fanLayer.anchors[ii].content = [];

			this.spearsLayer.anchors[ii].ww = ww;
			this.spearsLayer.anchors[ii].hh = hh;
			this.spearsLayer.anchors[ii].content = [];

			this.levels[ii].reCreateBars();
		}
		this.fanPane.resetPlates(this.fanLayer.anchors, this.spearsLayer.anchors);
		//this.iconsFanAnchor.ww = globalCommandDispatcher.cfg().wholeWidth() - globalCommandDispatcher.cfg().leftPad - globalCommandDispatcher.cfg().rightPad;
		//this.iconsFanAnchor.hh = globalCommandDispatcher.cfg().gridHeight();
		this.fillerAnchor.xx = globalCommandDispatcher.cfg().leftPad;
		this.fillerAnchor.yy = globalCommandDispatcher.cfg().gridTop();
		this.fillerAnchor.ww = globalCommandDispatcher.cfg().wholeWidth() - globalCommandDispatcher.cfg().leftPad - globalCommandDispatcher.cfg().rightPad;
		this.fillerAnchor.hh = globalCommandDispatcher.cfg().gridHeight();
		this.fillerAnchor.content = [];
		//this.reFillWholeRatio();
		//this.reFillSingleRatio();
		this.reFillSingleRatio(globalCommandDispatcher.cfg().samplerTop()
			, globalCommandDispatcher.cfg().samplerHeight()
			, this.barDrumCount);
		this.reFillSingleRatio(globalCommandDispatcher.cfg().gridTop()
			, globalCommandDispatcher.cfg().gridHeight()
			, this.barTrackCount);

	}
	createMixerLayers(): TileLayerDefinition[] {
		let tracksLayerZoom: SVGElement = (document.getElementById('tracksLayerZoom') as any) as SVGElement;
		this.trackLayers = { g: tracksLayerZoom, anchors: [], mode: LevelModes.normal };

		let gridLayerZoom: SVGElement = (document.getElementById('gridLayerZoom') as any) as SVGElement;
		this.gridLayers = { g: gridLayerZoom, anchors: [], mode: LevelModes.normal };

		let firstLayerZoom: SVGElement = (document.getElementById('firstLayerZoom') as any) as SVGElement;
		this.firstLayers = { g: firstLayerZoom, anchors: [], mode: LevelModes.normal };

		this.fanSVGgroup = (document.getElementById('fanLayer') as any) as SVGElement;
		this.fanLayer = { g: this.fanSVGgroup, anchors: [], mode: LevelModes.normal };
		let spearsSVGgroup: SVGElement = (document.getElementById('spearsLayer') as any) as SVGElement;
		this.spearsLayer = { g: spearsSVGgroup, anchors: [], mode: LevelModes.normal };


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
			let spearAnchor = {
				showZoom: zoomPrefixLevelsCSS[ii].minZoom
				, hideZoom: zoomPrefixLevelsCSS[ii + 1].minZoom
				, xx: 0, yy: 0, ww: 1, hh: 1, content: []
			};
			this.spearsLayer.anchors.push(spearAnchor);



			this.levels.push(new MixerZoomLevel(ii
				, mixerGridAnchor
				, mixerTrackAnchor
				, mixerFirstAnchor
			));

			//
		}
		//console.log('this.fanLayer', this.fanLayer);
		this.fillerAnchor = {
			showZoom: zoomPrefixLevelsCSS[6].minZoom
			, hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom + 1
			, xx: 0, yy: 0, ww: 1, hh: 1, content: []
		};
		this.gridLayers.anchors.push(this.fillerAnchor);
		return [this.gridLayers, this.trackLayers, this.firstLayers, this.fanLayer, this.spearsLayer];
	}
	reFillSingleRatio(yy: number, hh: number, countFunction: (barIdx: number) => number) {
		//let countFunction: (barIdx: number) => number;
		//let yy = globalCommandDispatcher.cfg().gridTop() + globalCommandDispatcher.cfg().gridHeight() / 8;
		//let hh = globalCommandDispatcher.cfg().gridHeight() * 6 / 8;
		/*if (globalCommandDispatcher.cfg().data.focus) {
			if (globalCommandDispatcher.cfg().data.focus == 1) {
				countFunction = this.barDrumCount;
				yy = globalCommandDispatcher.cfg().gridTop() + globalCommandDispatcher.cfg().gridHeight() - 2 * globalCommandDispatcher.cfg().data.percussions.length;
				hh = 2 * globalCommandDispatcher.cfg().data.percussions.length;
			} else {
				if (globalCommandDispatcher.cfg().data.focus == 2) {
					countFunction = this.barAutoCount;
					yy = globalCommandDispatcher.cfg().gridTop();
					hh = globalCommandDispatcher.cfg().maxAutomationsCount;
				} else {
					countFunction = this.barCommentsCount;
					yy = globalCommandDispatcher.cfg().gridTop();
					hh = globalCommandDispatcher.cfg().commentsMaxHeight();
				}
			}
		} else {
			countFunction = this.barTrackCount;
		}*/
		//countFunction = this.barTrackCount;
		let mxItems = 0;
		for (let bb = 0; bb < globalCommandDispatcher.cfg().data.timeline.length; bb++) {
			let itemcount = countFunction(bb);
			if (mxItems < itemcount) {
				mxItems = itemcount;
			}
		}
		if (mxItems < 1) mxItems = 1;
		let barX = 0;
		for (let bb = 0; bb < globalCommandDispatcher.cfg().data.timeline.length; bb++) {
			let itemcount = countFunction(bb);
			let filIdx = 1 + Math.round(7 * itemcount / mxItems);
			let css = 'mixFiller' + filIdx;
			let barwidth = MMUtil().set(globalCommandDispatcher.cfg().data.timeline[bb].metre).duration(globalCommandDispatcher.cfg().data.timeline[bb].tempo) * globalCommandDispatcher.cfg().widthDurationRatio;
			let fillRectangle: TileRectangle = {
				x: globalCommandDispatcher.cfg().leftPad + barX
				, y: yy
				, w: barwidth
				, h: hh
				, css: css
			};
			this.fillerAnchor.content.push(fillRectangle);
			barX = barX + barwidth;
		}
	}
	__reFillWholeRatio() {

		let yy = globalCommandDispatcher.cfg().gridTop();
		let hh = globalCommandDispatcher.cfg().gridHeight() / 8;
		/*if (globalCommandDispatcher.cfg().data.focus) {
			if (globalCommandDispatcher.cfg().data.focus == 1) {
				yy = globalCommandDispatcher.cfg().gridTop();
				hh = globalCommandDispatcher.cfg().gridHeight() - 2 * globalCommandDispatcher.cfg().data.percussions.length;
			} else {
				if (globalCommandDispatcher.cfg().data.focus == 2) {
					yy = globalCommandDispatcher.cfg().gridTop() + globalCommandDispatcher.cfg().maxAutomationsCount;
					hh = globalCommandDispatcher.cfg().gridHeight() - globalCommandDispatcher.cfg().maxAutomationsCount;
				} else {
					yy = globalCommandDispatcher.cfg().gridTop() + globalCommandDispatcher.cfg().commentsMaxHeight();
					hh = globalCommandDispatcher.cfg().gridHeight() - globalCommandDispatcher.cfg().commentsMaxHeight();
				}
			}
		}*/
		let countFunction: (barIdx: number) => number = (barIdx: number) => {
			return this.barDrumCount(barIdx) + this.barAutoCount(barIdx)
				+ this.barCommentsCount(barIdx) + this.barTrackCount(barIdx);
		};
		let mxItems = 0;
		for (let bb = 0; bb < globalCommandDispatcher.cfg().data.timeline.length; bb++) {
			let itemcount = countFunction(bb);
			if (mxItems < itemcount) {
				mxItems = itemcount;
			}
		}
		if (mxItems < 1) mxItems = 1;
		let barX = 0;
		for (let bb = 0; bb < globalCommandDispatcher.cfg().data.timeline.length; bb++) {
			let itemcount = countFunction(bb);
			let filIdx = 1 + Math.round(7 * itemcount / mxItems);
			let css = 'mixFiller' + filIdx;
			let barwidth = MMUtil().set(globalCommandDispatcher.cfg().data.timeline[bb].metre).duration(globalCommandDispatcher.cfg().data.timeline[bb].tempo) * globalCommandDispatcher.cfg().widthDurationRatio;
			let fillRectangle: TileRectangle = {
				x: globalCommandDispatcher.cfg().leftPad + barX
				, y: yy//globalCommandDispatcher.cfg().gridTop()
				, w: barwidth
				, h: hh//globalCommandDispatcher.cfg().gridHeight()
				, css: css
			};
			this.fillerAnchor.content.push(fillRectangle);
			//if (globalCommandDispatcher.cfg().data.focus) {
			//
			//} else {
			this.fillerAnchor.content.push({
				x: globalCommandDispatcher.cfg().leftPad + barX
				, y: globalCommandDispatcher.cfg().gridTop() + globalCommandDispatcher.cfg().gridHeight() * 7 / 8
				, w: barwidth
				, h: hh//globalCommandDispatcher.cfg().gridHeight()
				, css: css
			});
			//}

			barX = barX + barwidth;
		}
	}

	barTrackCount(bb: number): number {
		let notecount = 0;
		for (let tt = 0; tt < globalCommandDispatcher.cfg().data.tracks.length; tt++) {
			let bar = globalCommandDispatcher.cfg().data.tracks[tt].measures[bb];
			if (bar) {
				for (let cc = 0; cc < bar.chords.length; cc++) {
					//notecount = notecount + bar.chords[cc].notes.length;
					notecount = notecount + bar.chords[cc].pitches.length;
				}
			}
		}
		return notecount;
	}
	barDrumCount(bb: number): number {
		let drumcount = 0;
		for (let tt = 0; tt < globalCommandDispatcher.cfg().data.percussions.length; tt++) {
			let bar = globalCommandDispatcher.cfg().data.percussions[tt].measures[bb];
			if (bar) {
				drumcount = drumcount + bar.skips.length;
			}
		}
		return drumcount;
	}
	barAutoCount(bb: number): number {
		let autoCnt = 0;
		for (let ff = 0; ff < globalCommandDispatcher.cfg().data.filters.length; ff++) {
			let filter = globalCommandDispatcher.cfg().data.filters[ff];
			if (filter.automation) {
				if (filter.automation.measures[bb]) {
					autoCnt = autoCnt + filter.automation.measures[bb].changes.length;
				}
			}
		}
		return autoCnt;
	}
	barCommentsCount(bb: number): number {
		if (globalCommandDispatcher.cfg().data.comments[bb]) {
			if (globalCommandDispatcher.cfg().data.comments[bb].points) {
				return globalCommandDispatcher.cfg().data.comments[bb].points.length;
			}
		}
		return 0;
	}

}
