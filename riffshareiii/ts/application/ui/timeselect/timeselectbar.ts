class TimeSelectBar {
	selectionBarLayer: TileLayerDefinition;
	selectionBarSVGGroup: SVGElement;
	selectBarAnchor: TileAnchor;
	zoomAnchors: TileAnchor[];
	constructor() {

	}
	createTimeScale(): TileLayerDefinition[] {
		this.selectionBarSVGGroup = (document.getElementById("timeselectbar") as any) as SVGElement;
		this.selectBarAnchor = {
			xx: 0, yy: 0, ww: 1, hh: 1
			, showZoom: zoomPrefixLevelsCSS[0].minZoom
			, hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom
			, content: [
			]
		};
		this.selectionBarLayer = {
			g: this.selectionBarSVGGroup, anchors: [
				this.selectBarAnchor
			], mode: LevelModes.top
		};
		return [this.selectionBarLayer];
	}
	resizeTimeScale(viewWIdth: number, viewHeight: number) {

	}
	addMarks8plus() {

	}
	addMarks7(barnum: number, barLeft: number, curBar: MZXBX_SongMeasure, measureAnchor: TileAnchor) {
		if (barnum % 8 == 0) {
			this.createBarMark(barLeft, zoomPrefixLevelsCSS[7].minZoom * 0.25, zoomPrefixLevelsCSS[7].minZoom * 2, measureAnchor);
			this.createBarNumber(barLeft, zoomPrefixLevelsCSS[7].minZoom * 2, barnum,7,curBar, measureAnchor);
		}
	}
	addMarks6(barnum: number, barLeft: number, curBar: MZXBX_SongMeasure, measureAnchor: TileAnchor) {
		if (barnum % 4 == 0) {
			this.createBarMark(barLeft, zoomPrefixLevelsCSS[6].minZoom * 0.25, zoomPrefixLevelsCSS[6].minZoom * 2, measureAnchor);
			this.createBarNumber(barLeft, zoomPrefixLevelsCSS[6].minZoom * 2, barnum, 6,curBar, measureAnchor);
		}
	}
	addMarks5(barnum: number, barLeft: number, curBar: MZXBX_SongMeasure, measureAnchor: TileAnchor) {
		if (barnum % 2 == 0) {
			this.createBarMark(barLeft, zoomPrefixLevelsCSS[5].minZoom * 0.25, zoomPrefixLevelsCSS[5].minZoom * 2, measureAnchor);
			this.createBarNumber(barLeft, zoomPrefixLevelsCSS[5].minZoom * 2, barnum,5,curBar, measureAnchor);
		}
	}
	addMarks4(duRatio: number, barnum: number, barLeft: number, curBar: MZXBX_SongMeasure, measureAnchor: TileAnchor) {
		this.createBarMark(barLeft, zoomPrefixLevelsCSS[4].minZoom * 0.25, zoomPrefixLevelsCSS[4].minZoom * 2, measureAnchor);
		this.createBarNumber(barLeft
			, zoomPrefixLevelsCSS[4].minZoom * 2, barnum, 4,curBar, measureAnchor);
		this.createBarMark(barLeft + MZMM().set({ count: 1, part: 2 }).duration(curBar.tempo) * duRatio
			, zoomPrefixLevelsCSS[4].minZoom * 0.1, zoomPrefixLevelsCSS[4].minZoom * 2, measureAnchor);
	}
	addMarks3minus(duRatio: number, zoomidx: number, barnum: number, barLeft: number, curBar: MZXBX_SongMeasure, measureAnchor: TileAnchor) {
		this.createBarMark(barLeft, zoomPrefixLevelsCSS[zoomidx].minZoom * 0.25, zoomPrefixLevelsCSS[zoomidx].minZoom * 2, measureAnchor);
		this.createBarNumber(barLeft
			, zoomPrefixLevelsCSS[zoomidx].minZoom * 2, barnum,zoomidx,curBar, measureAnchor);
		let st16 = MZMM().set({ count: 1, part: 16 });
		let cntr8 = st16;
		while (cntr8.less(curBar.metre)) {
			this.createBarMark(barLeft + cntr8.duration(curBar.tempo) * duRatio
				, zoomPrefixLevelsCSS[zoomidx].minZoom * 0.1, zoomPrefixLevelsCSS[zoomidx].minZoom * 1, measureAnchor);
			cntr8 = cntr8.plus(st16)
		}
		this.createBarMark(barLeft + MZMM().set({ count: 1, part: 2 }).duration(curBar.tempo) * duRatio
			, zoomPrefixLevelsCSS[zoomidx].minZoom * 0.1, zoomPrefixLevelsCSS[zoomidx].minZoom * 2, measureAnchor);
	}
	createBarMark(barLeft: number, width: number, height: number, measureAnchor: TileAnchor) {
		let mark: TileRectangle = { x: barLeft, y: 0, w: width, h: height, css: 'timeMeasureMark' };
		measureAnchor.content.push(mark);
	}
	createBarNumber(barLeft: number, top: number, barnum: number, zz: number, curBar: MZXBX_SongMeasure, measureAnchor: TileAnchor) {
		let nm: TileText = { x: barLeft, y: top, text: '' + (1 + barnum), css: 'timeBarNum' + zoomPrefixLevelsCSS[zz].prefix };
		measureAnchor.content.push(nm);
		let bpm: TileText = {
			x: barLeft
			, y: top*2/3
			, text: '' + Math.round(curBar.tempo)
			, css: 'timeBarInfo' + zoomPrefixLevelsCSS[zz].prefix
		};
		measureAnchor.content.push(bpm);
		let mtr: TileText = {
			x: barLeft
			, y: top
			, text: '' + curBar.metre.count + '/' + curBar.metre.part
			, css: 'timeBarInfo' + zoomPrefixLevelsCSS[zz].prefix
		};
		measureAnchor.content.push(mtr);
	}
	fillTimeBar(data: MZXBX_Project) {
		//console.log('fillTimeBar', data.timeline);
		let mixm: MixerDataMath = new MixerDataMath(data);
		this.selectBarAnchor.ww = mixm.mixerWidth();
		this.selectBarAnchor.hh = mixm.mixerHeight();
		this.zoomAnchors = [];
		for (let zz = 0; zz < zoomPrefixLevelsCSS.length - 1; zz++) {
            //console.log('add',zoomPrefixLevelsCSS[zz]);
			let selectLevelAnchor: TileAnchor = {
				showZoom: zoomPrefixLevelsCSS[zz].minZoom
				, hideZoom: zoomPrefixLevelsCSS[zz + 1].minZoom
				, xx: 0, yy: 0, ww: mixm.mixerWidth(), hh: mixm.mixerHeight(), content: []
				, id: 'time' + (zz + Math.random())
			};
			this.zoomAnchors.push(selectLevelAnchor);
			let mm: MZXBX_MetreMathType = MZMM();
			let barLeft = mixm.LeftPad;
			for (let kk = 0; kk < data.timeline.length; kk++) {
				let curBar = data.timeline[kk];
				let curMeasureMeter = mm.set(curBar.metre);
				let barWidth = curMeasureMeter.duration(curBar.tempo) * data.theme.widthDurationRatio;
				let measureAnchor: TileAnchor = {
					showZoom: zoomPrefixLevelsCSS[zz].minZoom
					, hideZoom: zoomPrefixLevelsCSS[zz + 1].minZoom
					, xx: barLeft, yy: 0, ww: barWidth, hh: 1234, content: []
					, id: 'measure' + (kk + Math.random())
				};
				selectLevelAnchor.content.push(measureAnchor);
				if (zz >= 8) {
					this.addMarks8plus();
				}
				if (zz == 7) {
					this.addMarks7(kk, barLeft, curBar, measureAnchor);
				}
				if (zz == 6) {
					this.addMarks6(kk, barLeft, curBar, measureAnchor);
				}
				if (zz == 5) {
					this.addMarks5(kk, barLeft, curBar, measureAnchor);
				}
				if (zz == 4) {
					this.addMarks4(data.theme.widthDurationRatio, kk, barLeft, curBar, measureAnchor);
				}
				if (zz <= 3) {
					this.addMarks3minus(data.theme.widthDurationRatio, zz, kk, barLeft, curBar, measureAnchor);
				}
				barLeft = barLeft + barWidth;
			}
		}
		this.selectBarAnchor.content = this.zoomAnchors;
	}
}
