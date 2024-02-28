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

	reFillMixerUI(data: MZXBX_Project) {
		let mixm: MixerDataMath = new MixerDataMath(data);
		let ww = mixm.mixerWidth();
		let hh = mixm.mixerHeight();
		for (let ii = 0; ii < zoomPrefixLevelsCSS.length - 1; ii++) {
			//this.zoomLayers[ii].anchors[0].ww = ww;
			//this.zoomLayers[ii].anchors[0].hh = hh;
			this.gridLayers.anchors[ii].ww = ww;
			this.gridLayers.anchors[ii].hh = hh;
			this.trackLayers.anchors[ii].ww = ww;
			this.trackLayers.anchors[ii].hh = hh;
			this.firstLayers.anchors[ii].ww = ww;
			this.firstLayers.anchors[ii].hh = hh;
			this.levels[ii].reCreateBars(data);
		}
		this.fillerAnchor.xx = mixm.LeftPad;
		this.fillerAnchor.yy = mixm.gridTop();
		this.fillerAnchor.ww = mixm.mixerWidth() - mixm.LeftPad - mixm.rightPad;
		this.fillerAnchor.hh = mixm.gridHeight();
		this.reFillTracksRatio(data);

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

	reFillTracksRatio(data: MZXBX_Project) {
		let mixm: MixerDataMath = new MixerDataMath(data);
		let mxNotes = 0;
		let mxDrums = 0;
		for (let bb = 0; bb < data.timeline.length; bb++) {
			let notecount = 0;
			let drumcount = 0;
			for (let tt = 0; tt < data.tracks.length; tt++) {
				let bar = data.tracks[tt].measures[bb];
				if (bar) {
					for (let cc = 0; cc < bar.chords.length; cc++) {
						notecount = notecount + bar.chords[cc].notes.length;
					}
				}
			}
			if (mxNotes < notecount) {
				mxNotes = notecount;
			}
			for (let tt = 0; tt < data.percussions.length; tt++) {
				let bar = data.percussions[tt].measures[bb];
				if (bar) {
					drumcount = drumcount + bar.skips.length;
				}
			}
			if (mxDrums < drumcount) {
				mxDrums = drumcount;
			}
			//console.log(bb, notecount);
		}
		//console.log(mxNotes);
		this.fillerAnchor.content = [];
		let barX = 0;
		for (let bb = 0; bb < data.timeline.length; bb++) {
			let notecount = 0;
			for (let tt = 0; tt < data.tracks.length; tt++) {
				let bar = data.tracks[tt].measures[bb];
				for (let cc = 0; cc < bar.chords.length; cc++) {
					notecount = notecount + bar.chords[cc].notes.length;
				}

			}
			let css = 'mixFiller' + (1 + Math.round(7 * notecount / mxNotes));
			let barwidth = MZMM().set(data.timeline[bb].metre).duration(data.timeline[bb].tempo) * mixm.widthDurationRatio;
			let fillRectangle: TileRectangle = {
				x: mixm.LeftPad + barX
				, y: mixm.gridTop()
				, w: barwidth
				, h: mixm.gridHeight()
				, css: css
			};
			//console.log(bb, notecount, css,fillRectangle);
			this.fillerAnchor.content.push(fillRectangle);

			if (data.percussions.length) {
				let drumcount = 0;
				for (let tt = 0; tt < data.percussions.length; tt++) {
					let bar = data.percussions[tt].measures[bb];
					if (bar) {
						drumcount = drumcount + bar.skips.length;
					}
				}
				let css2 = 'mixFiller' + (1 + Math.round(7 * drumcount / mxDrums));
				let fillDrumBar: TileRectangle = {
					x: mixm.LeftPad + barX
					, y: mixm.samplerTop()
					, w: barwidth
					, h: data.percussions.length * mixm.notePathHeight
					, css: css2
				};
				this.fillerAnchor.content.push(fillDrumBar);
			}

			barX = barX + barwidth;
		}

	}

}
