class MixerUI {
	//svgs: SVGElement[] = [];
	//svg: SVGElement ;
	//zoomLayers: TileLayerDefinition[] = [];
	gridLayers: TileLayerDefinition;
	trackLayers: TileLayerDefinition;
	firstLayers: TileLayerDefinition;

	fanLayer: TileLayerDefinition;
	fanSVGgroup: SVGElement;

	spearsSVGgroup: SVGElement;
	spearsLayer: TileLayerDefinition;

	levels: MixerZoomLevel[] = [];
	fillerAnchor: TileAnchor;
	markAnchor: TileAnchor;
	markRectangle: TileRectangle;
	sliderAnchor: TileAnchor;
	sliderRectangle: TileRectangle;
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
		this.resetEditMark();
		this.resetSliderMark();
		this.fanPane.resetPlates(this.fanLayer.anchors, this.spearsLayer.anchors);
		//console.log('spearsLayer',this.spearsLayer.anchors);
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

		this.reFillSingleRatio(globalCommandDispatcher.cfg().automationTop()
			, globalCommandDispatcher.cfg().automationHeight()
			, this.barAutoCount);

		this.reFillSingleRatio(globalCommandDispatcher.cfg().commentsTop()
			, globalCommandDispatcher.cfg().commentsMaxHeight()
			, this.barCommentsCount);
	}
	resetSliderMark() {

		let mark = globalCommandDispatcher.cfg().slidemark;
		//console.log('resetSliderMark', mark);
		if (mark) {
			let mm: Zvoog_MetreMathType = MMUtil();
			let barX = 0;
			let bar: Zvoog_SongMeasure = globalCommandDispatcher.cfg().data.timeline[0];
			for (let ii = 0; ii < mark.barIdx; ii++) {
				bar = globalCommandDispatcher.cfg().data.timeline[ii];
				barX = barX + mm.set(bar.metre).duration(bar.tempo)
					* globalCommandDispatcher.cfg().widthDurationRatio
					;
			}

			let top = globalCommandDispatcher.cfg().gridTop()
				+ globalCommandDispatcher.cfg().gridHeight()
				- mark.pitch
				+ 11 - mark.chord.slides[mark.chord.slides.length-1].delta
				;
			let len = 0;
			for (let ss = 0; ss < mark.chord.slides.length; ss++) {
				let duration = MMUtil().set(mark.chord.slides[ss].duration);
				len=len+duration.duration(globalCommandDispatcher.cfg().data.timeline[mark.barIdx].tempo)*globalCommandDispatcher.cfg().widthDurationRatio;
			}

			let rr = globalCommandDispatcher.cfg().notePathHeight;
			let skipX = mm.set(mark.chord.skip).duration(bar.tempo) * globalCommandDispatcher.cfg().widthDurationRatio
			this.sliderAnchor.xx = globalCommandDispatcher.cfg().leftPad + barX + skipX + len - rr / 2-rr;
			this.sliderAnchor.yy = top - rr / 2;
			this.sliderAnchor.ww = rr;
			this.sliderAnchor.hh = rr;
			this.sliderRectangle.x = this.sliderAnchor.xx;
			this.sliderRectangle.y = this.sliderAnchor.yy;
			this.sliderRectangle.w = rr * 2;
			this.sliderRectangle.h = rr * 2;
			this.sliderRectangle.rx = rr;
			this.sliderRectangle.ry = rr;
			this.sliderRectangle.css = 'slidePointFill';
		} else {
			this.sliderRectangle.css = 'markPointNone';
		}
	}
	resetEditMark() {
		let mark = globalCommandDispatcher.cfg().editmark;
		//console.log('resetEditMark', mark);
		if (mark) {
			let mm: Zvoog_MetreMathType = MMUtil();
			let barX = 0;
			let bar: Zvoog_SongMeasure = globalCommandDispatcher.cfg().data.timeline[0];
			for (let ii = 0; ii < mark.barIdx; ii++) {
				bar = globalCommandDispatcher.cfg().data.timeline[ii];
				barX = barX + mm.set(bar.metre).duration(bar.tempo)
					* globalCommandDispatcher.cfg().widthDurationRatio
					;
			}

			let top = globalCommandDispatcher.cfg().gridTop()
				+ globalCommandDispatcher.cfg().gridHeight()
				- mark.pitch;
			let rr = globalCommandDispatcher.cfg().notePathHeight;
			let skipX = mm.set(mark.skip).duration(bar.tempo) * globalCommandDispatcher.cfg().widthDurationRatio
			this.markAnchor.xx = globalCommandDispatcher.cfg().leftPad + barX + skipX - rr / 2;
			this.markAnchor.yy = top - rr / 2;
			this.markAnchor.ww = rr;
			this.markAnchor.hh = rr;
			this.markRectangle.x = this.markAnchor.xx;
			this.markRectangle.y = this.markAnchor.yy;
			this.markRectangle.w = rr * 2;
			this.markRectangle.h = rr * 2;
			this.markRectangle.rx = rr;
			this.markRectangle.ry = rr;
			this.markRectangle.css = 'markPointFill';
			//console.log(globalCommandDispatcher.cfg().editmark, this.markAnchor, globalCommandDispatcher.cfg().leftPad, skipX);
		} else {
			this.markRectangle.css = 'markPointNone';
		}
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
		this.spearsSVGgroup = (document.getElementById('spearsLayer') as any) as SVGElement;
		this.spearsLayer = { g: this.spearsSVGgroup, anchors: [], mode: LevelModes.normal };
		this.markRectangle = {
			x: 0
			, y: 0
			, w: 222
			, h: 222
			, css: 'markPointFill'
		};
		this.sliderRectangle = {
			x: 0
			, y: 0
			, w: 222
			, h: 222
			, css: 'slidePointFill'
		};


		/*
		this.iconsFanAnchor = {
			minZoom: zoomPrefixLevelsCSS[0].minZoom
			, beforeZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length-1].minZoom
			, xx: 0, yy: 0, ww: 1, hh: 1, content: []
		};
		console.log('createMixerLayers',this.iconsFanAnchor);
		this.fanLayer.anchors.push(this.iconsFanAnchor);
*/
		for (let ii = 0; ii < zoomPrefixLevelsCSS.length - 1; ii++) {
			//this.svgs.push((document.getElementById(zoomPrefixLevelsCSS[ii].svg) as any) as SVGElement);
			let mixerGridAnchor: TileAnchor = {
				minZoom: zoomPrefixLevelsCSS[ii].minZoom
				, beforeZoom: zoomPrefixLevelsCSS[ii + 1].minZoom
				, xx: 0, yy: 0, ww: 1, hh: 1, content: []
			};
			this.gridLayers.anchors.push(mixerGridAnchor);
			let mixerTrackAnchor: TileAnchor = {
				minZoom: zoomPrefixLevelsCSS[ii].minZoom
				, beforeZoom: zoomPrefixLevelsCSS[ii + 1].minZoom
				, xx: 0, yy: 0, ww: 1, hh: 1, content: []
			};
			this.trackLayers.anchors.push(mixerTrackAnchor);
			let mixerFirstAnchor: TileAnchor = {
				minZoom: zoomPrefixLevelsCSS[ii].minZoom
				, beforeZoom: zoomPrefixLevelsCSS[ii + 1].minZoom
				, xx: 0, yy: 0, ww: 1, hh: 1, content: []
			};
			this.firstLayers.anchors.push(mixerFirstAnchor);
			let fanLevelAnchor = {
				minZoom: zoomPrefixLevelsCSS[ii].minZoom
				, beforeZoom: zoomPrefixLevelsCSS[ii + 1].minZoom
				, xx: 0, yy: 0, ww: 1, hh: 1, content: []
			};
			this.fanLayer.anchors.push(fanLevelAnchor);
			let spearAnchor = {
				minZoom: zoomPrefixLevelsCSS[ii].minZoom
				, beforeZoom: zoomPrefixLevelsCSS[ii + 1].minZoom
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
		this.markAnchor = {
			minZoom: 0
			, beforeZoom: zoomPrefixLevelsCSS[6].minZoom
			, xx: 0, yy: 0, ww: 1, hh: 1, content: [this.markRectangle]
		};
		this.gridLayers.anchors.push(this.markAnchor);
		this.sliderAnchor = {
			minZoom: 0
			, beforeZoom: zoomPrefixLevelsCSS[6].minZoom
			, xx: 0, yy: 0, ww: 1, hh: 1, content: [this.sliderRectangle]
		};
		this.gridLayers.anchors.push(this.sliderAnchor);
		//console.log(this.gridLayers.anchors);
		this.fillerAnchor = {
			minZoom: zoomPrefixLevelsCSS[6].minZoom
			, beforeZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom + 1
			, xx: 0, yy: 0, ww: 1, hh: 1, content: []
		};
		this.gridLayers.anchors.push(this.fillerAnchor);

		return [this.gridLayers, this.trackLayers, this.firstLayers, this.fanLayer, this.spearsLayer];
	}
	reFillSingleRatio(yy: number, hh: number, countFunction: (barIdx: number) => number) {

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

			let timebar = globalCommandDispatcher.cfg().data.timeline[bb];
			if (!(timebar)) {
				timebar = { tempo: 120, metre: { count: 4, part: 4 } }
			}

			//let barwidth = MMUtil().set(globalCommandDispatcher.cfg().data.timeline[bb].metre).duration(globalCommandDispatcher.cfg().data.timeline[bb].tempo) * globalCommandDispatcher.cfg().widthDurationRatio;
			let barwidth = MMUtil().set(timebar.metre).duration(timebar.tempo) * globalCommandDispatcher.cfg().widthDurationRatio;
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
		//console.log(this.fillerAnchor.content);
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
			//if (automation) {
			if (filter.automation[bb]) {
				autoCnt = autoCnt + filter.automation[bb].changes.length;
			}
			//}
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
