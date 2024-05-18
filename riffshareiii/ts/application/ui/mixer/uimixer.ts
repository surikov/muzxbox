class MixerUI {
	//svgs: SVGElement[] = [];
	//svg: SVGElement ;
	//zoomLayers: TileLayerDefinition[] = [];
	gridLayers: TileLayerDefinition;
	trackLayers: TileLayerDefinition;
	firstLayers: TileLayerDefinition;
	levels: MixerZoomLevel[] = [];
	fillerAnchor: TileAnchor;
	//samplerUI: SamplerRows;

	reFillMixerUI(//data: Zvoog_Project
		cfg:MixerDataMathUtility
	) {
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
			this.levels[ii].reCreateBars(cfg);
		}
		this.fillerAnchor.xx = cfg.leftPad;
		this.fillerAnchor.yy = cfg.gridTop();
		this.fillerAnchor.ww = cfg.wholeWidth() - cfg.leftPad - cfg.rightPad;
		this.fillerAnchor.hh = cfg.gridHeight();
		this.reFillTracksRatio(cfg);

	}
	createMixerLayers(): TileLayerDefinition[] {
		let tracksLayerZoom: SVGElement = (document.getElementById('tracksLayerZoom') as any) as SVGElement;
		this.trackLayers = { g: tracksLayerZoom, anchors: [], mode: LevelModes.normal };

		let gridLayerZoom: SVGElement = (document.getElementById('gridLayerZoom') as any) as SVGElement;
		this.gridLayers = { g: gridLayerZoom, anchors: [], mode: LevelModes.normal };

		let firstLayerZoom: SVGElement = (document.getElementById('firstLayerZoom') as any) as SVGElement;
		this.firstLayers = { g: firstLayerZoom, anchors: [], mode: LevelModes.normal };

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

			this.levels.push(new MixerZoomLevel(ii
				, mixerGridAnchor
				, mixerTrackAnchor
				, mixerFirstAnchor
			));

			//
		}
		this.fillerAnchor = {
			showZoom: zoomPrefixLevelsCSS[6].minZoom
			, hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom + 1
			, xx: 0, yy: 0, ww: 1, hh: 1, content: []
		};
		this.gridLayers.anchors.push(this.fillerAnchor);
		return [this.gridLayers, this.trackLayers, this.firstLayers];
	}

	reFillTracksRatio(//data: Zvoog_Project
		cfg:MixerDataMathUtility
	) {
		//let mixm: MixerDataMath = new MixerDataMath(data);
		let mxNotes = 0;
		let mxDrums = 0;
		let mxTxt = 0;
		for (let bb = 0; bb < cfg.data.timeline.length; bb++) {
			let notecount = 0;
			let drumcount = 0;
			let txtcnt = 0;
			for (let tt = 0; tt < cfg.data.tracks.length; tt++) {
				let bar = cfg.data.tracks[tt].measures[bb];
				if (bar) {
					for (let cc = 0; cc < bar.chords.length; cc++) {
						notecount = notecount + bar.chords[cc].notes.length;
					}
				}
			}
			if (mxNotes < notecount) {
				mxNotes = notecount;
			}
			for (let tt = 0; tt < cfg.data.percussions.length; tt++) {
				let bar = cfg.data.percussions[tt].measures[bb];
				if (bar) {
					drumcount = drumcount + bar.skips.length;
				}
			}
			if (mxDrums < drumcount) {
				mxDrums = drumcount;
			}
			if (cfg.data.comments[bb])
				if (cfg.data.comments[bb].points)
					if (mxTxt < cfg.data.comments[bb].points.length) {
						mxTxt = cfg.data.comments[bb].points.length;
					}
			//txtcnt = txtcnt + cfg.data.comments[bb].texts.length;
			//console.log(bb, notecount);
		}
		//console.log(mxNotes);
		if (mxDrums < 1) mxDrums = 1;
		if (mxNotes < 1) mxNotes = 1;
		if (mxTxt < 1) mxTxt = 1;
		this.fillerAnchor.content = [];
		let barX = 0;
		for (let bb = 0; bb < cfg.data.timeline.length; bb++) {
			let notecount = 0;
			for (let tt = 0; tt < cfg.data.tracks.length; tt++) {
				let bar = cfg.data.tracks[tt].measures[bb];
				for (let cc = 0; cc < bar.chords.length; cc++) {
					notecount = notecount + bar.chords[cc].notes.length;
				}

			}
			let filIdx = 1 + Math.round(7 * notecount / mxNotes);
			let css = 'mixFiller' + filIdx;
			let barwidth = MMUtil().set(cfg.data.timeline[bb].metre).duration(cfg.data.timeline[bb].tempo) * cfg.widthDurationRatio;
			let fillRectangle: TileRectangle = {
				x: cfg.leftPad + barX
				, y: cfg.gridTop()
				, w: barwidth
				, h: cfg.gridHeight()
				, css: css
			};
			//console.log(bb, notecount, css,fillRectangle);
			this.fillerAnchor.content.push(fillRectangle);

			if (cfg.data.percussions.length) {
				let drumcount = 0;
				for (let tt = 0; tt < cfg.data.percussions.length; tt++) {
					let bar = cfg.data.percussions[tt].measures[bb];
					if (bar) {
						drumcount = drumcount + bar.skips.length;
					}
				}
				filIdx = 1 + Math.round(7 * drumcount / mxDrums);
				let css2 = 'mixFiller' + filIdx;
				let fillDrumBar: TileRectangle = {
					x: cfg.leftPad + barX
					, y: cfg.samplerTop()
					, w: barwidth
					, h: cfg.data.percussions.length * cfg.notePathHeight
					, css: css2
				};
				this.fillerAnchor.content.push(fillDrumBar);
			}
			filIdx = 1;
			if (cfg.data.comments[bb]) {
				if (cfg.data.comments[bb].points) {
					filIdx = 1 + Math.round(7 * cfg.data.comments[bb].points.length / mxTxt);
				}
			}
			css = 'mixFiller' + filIdx;
			let fillTxtBar: TileRectangle = {
				x: cfg.leftPad + barX
				, y: cfg.commentsTop()
				, w: barwidth
				, h: cfg.commentsMaxHeight()
				, css: css
			};
			this.fillerAnchor.content.push(fillTxtBar);


			barX = barX + barwidth;
		}

	}

}
