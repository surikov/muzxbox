
class TimeSelectBar {
	selectionBarLayer: TileLayerDefinition;
	selectionBarSVGGroup: SVGElement;
	selectBarAnchor: TileAnchor;
	zoomAnchors: TileAnchor[];

	selectedTimeLayer: TileLayerDefinition;
	selectedTimeSVGGroup: SVGElement;
	selectionAnchor: TileAnchor;
	selectionMark: TileRectangle;

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

		this.selectedTimeSVGGroup = (document.getElementById("selectedTime") as any) as SVGElement;
		this.selectionMark = {
			x: 0
			, y: 0
			, w: 1
			, h: 1
			, css: 'timeSelection'
		};
		this.selectionAnchor = {
			xx: 0, yy: 0, ww: 1, hh: 1
			, showZoom: zoomPrefixLevelsCSS[0].minZoom
			, hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom
			, content: [this.selectionMark]
		};
		this.selectedTimeLayer = {
			g: this.selectedTimeSVGGroup, anchors: [this.selectionAnchor], mode: LevelModes.top
		};

		return [this.selectionBarLayer, this.selectedTimeLayer];
	}
	resizeTimeScale(viewWidth: number, viewHeight: number) {
		//console.log('resizeTimeSelect',viewWidth,viewHeight);
		this.selectionAnchor.ww = viewWidth * 1024;
		this.selectionAnchor.hh = viewHeight * 1024;
		this.selectionMark.h = viewHeight * 1024;
	}
	updateTimeSelectionBar(//data: Zvoog_Project
	//cfg:MixerDataMathUtility
	) {
		let selection: Zvoog_Selection|undefined=globalCommandDispatcher.cfg().data.selection;
		if (selection) {
			//let mixm: MixerDataMath = new MixerDataMath(data);
			let mm: Zvoog_MetreMathType = MMUtil();
			let barLeft = globalCommandDispatcher.cfg().leftPad;
			let startSel = 1;
			let widthSel = 0;
			let startIdx = 0;
			for (startIdx = 0; startIdx < globalCommandDispatcher.cfg().data.timeline.length; startIdx++) {
				let curBar = globalCommandDispatcher.cfg().data.timeline[startIdx];
				let curMeasureMeter = mm.set(curBar.metre);
				let barWidth = curMeasureMeter.duration(curBar.tempo) * globalCommandDispatcher.cfg().widthDurationRatio;
				if (startIdx == selection.startMeasure) {
					startSel = barLeft;
					break;
				}
				barLeft = barLeft + barWidth;
			}
			for (let ii = startIdx; ii < globalCommandDispatcher.cfg().data.timeline.length; ii++) {
				let curBar = globalCommandDispatcher.cfg().data.timeline[ii];
				let curMeasureMeter = mm.set(curBar.metre);
				let barWidth = curMeasureMeter.duration(curBar.tempo) * globalCommandDispatcher.cfg().widthDurationRatio;
				widthSel = widthSel + barWidth;
				if (ii == selection.endMeasure) {
					break;
				}
			}
			if(widthSel){
				this.selectionMark.x = startSel;
				this.selectionMark.w = widthSel;
			}
			
		}else{
			this.selectionMark.x = -1;
			this.selectionMark.w = 0.5;
		}
		//console.log('updateTimeSelectionBar',this.selectionMark.x,this.selectionMark.w);
	}
	
	createBarMark(barIdx: number, barLeft: number, size: number, measureAnchor: TileAnchor//, data: Zvoog_Project
	//,cfg:MixerDataMathUtility
	) {
		let mark: TileRectangle = {
			x: barLeft, y: 0, w: size, h: size
			//, rx: size / 2, ry: size / 2
			, css: 'timeMarkButtonCircle', activation: (x, y) => {
				//console.log('barIdx', barIdx);
				globalCommandDispatcher.expandTimeLineSelection(barIdx);
			}
		};
		measureAnchor.content.push(mark);
	}
	createBarNumber(barLeft: number//, top: number
		, barnum: number
		, zz: number
		, curBar: Zvoog_SongMeasure
		, measureAnchor: TileAnchor
		, barTime: number
	) {
		let mins = Math.floor(barTime / 60);
		let secs = Math.floor(barTime % 60);
		let hunds = Math.round(100 * (barTime - Math.floor(barTime)));
		//let timeText = Math.round(barTime * 100) / 100;
		let nm: TileText = {
			x: barLeft
			, y: zoomPrefixLevelsCSS[zz].minZoom * 1
			, text: '' + (1 + barnum) + ': ' + mins + '\'' + (secs > 9 ? '' : '0') + secs + '.' + hunds
			, css: 'timeBarNum' + zoomPrefixLevelsCSS[zz].prefix
		};
		measureAnchor.content.push(nm);

		let bpm: TileText = {
			x: barLeft
			, y: zoomPrefixLevelsCSS[zz].minZoom * 2
			, text: '' + Math.round(curBar.tempo) + ': ' + curBar.metre.count + '/' + curBar.metre.part
			, css: 'timeBarInfo' + zoomPrefixLevelsCSS[zz].prefix
		};
		measureAnchor.content.push(bpm);
	
	}

	fillTimeBar(//data:Zvoog_Project
		//cfg:MixerDataMathUtility
	) {
		//console.log('fillTimeBar', globalCommandDispatcher.cfg().data.timeline);
		//let mixm: MixerDataMath = new MixerDataMath(data);
		this.selectBarAnchor.ww = globalCommandDispatcher.cfg().wholeWidth();
		this.selectBarAnchor.hh = globalCommandDispatcher.cfg().wholeHeight();
		this.zoomAnchors = [];
		for (let zz = 0; zz < zoomPrefixLevelsCSS.length - 1; zz++) {
			//console.log('add',zoomPrefixLevelsCSS[zz]);
			let selectLevelAnchor: TileAnchor = {
				showZoom: zoomPrefixLevelsCSS[zz].minZoom
				, hideZoom: zoomPrefixLevelsCSS[zz + 1].minZoom
				, xx: 0, yy: 0, ww: globalCommandDispatcher.cfg().wholeWidth(), hh: globalCommandDispatcher.cfg().wholeHeight(), content: []
				, id: 'time' + (zz + Math.random())
			};
			this.zoomAnchors.push(selectLevelAnchor);
			let mm: Zvoog_MetreMathType = MMUtil();
			//this.reBuildSelectionMark(zz, data);

			let barLeft = globalCommandDispatcher.cfg().leftPad;
			let barTime = 0;
			for (let kk = 0; kk < globalCommandDispatcher.cfg().data.timeline.length; kk++) {
				let curBar = globalCommandDispatcher.cfg().data.timeline[kk];
				let curMeasureMeter = mm.set(curBar.metre);
				let barWidth = curMeasureMeter.duration(curBar.tempo) * globalCommandDispatcher.cfg().widthDurationRatio;
				let measureAnchor: TileAnchor = {
					showZoom: zoomPrefixLevelsCSS[zz].minZoom
					, hideZoom: zoomPrefixLevelsCSS[zz + 1].minZoom
					, xx: barLeft, yy: 0, ww: barWidth, hh: 1234, content: []
					, id: 'measure' + (kk + Math.random())
				};
				selectLevelAnchor.content.push(measureAnchor);

				//this.addGridMarks(data, kk, barLeft, curBar, measureAnchor, zz);
				if ((zz <= 4) || (zz == 5 && kk % 2 == 0) || (zz == 6 && kk % 4 == 0) || (zz == 7 && kk % 8 == 0) || (zz == 8 && kk % 16 == 0)) {
					this.createBarMark(kk, barLeft
						, zoomPrefixLevelsCSS[zz].minZoom * 1.5
						//, zoomPrefixLevelsCSS[zz].minZoom * 3
						, measureAnchor
						//, cfg
					);
					this.createBarNumber(barLeft
						//, zoomPrefixLevelsCSS[zz].minZoom * 3
						, kk, zz, curBar, measureAnchor, barTime);
				}
				let zoomInfo = zoomPrefixLevelsCSS[zz];
				if (zoomInfo.gridLines.length > 0) {
					//let mixm: MixerDataMath = new MixerDataMath(data);
					let lineCount = 0;
					let skip: Zvoog_MetreMathType = MMUtil().set({ count: 0, part: 1 });
					while (true) {
						let line = zoomInfo.gridLines[lineCount];
						skip = skip.plus(line.duration).simplyfy();
						if (!skip.less(curBar.metre)) {
							break;
						}
		
						if (line.label) {
							let xx = barLeft + skip.duration(curBar.tempo) * globalCommandDispatcher.cfg().widthDurationRatio;
							let mark: TileRectangle = {
								x: xx, y: 0
								, w: line.ratio * 2 * zoomInfo.minZoom
								, h: line.ratio * 8 * zoomInfo.minZoom
								, css: 'timeSubMark'
							};
							measureAnchor.content.push(mark);
							let mtr: TileText = {
								x: xx
								, y: 0.5 * zoomInfo.minZoom
								, text: '' + skip.count + '/' + skip.part
								, css: 'timeBarInfo' + zoomPrefixLevelsCSS[zz].prefix
							};
							measureAnchor.content.push(mtr);
						}
						lineCount++;
						if (lineCount >= zoomInfo.gridLines.length) {
							lineCount = 0;
						}
					}
				}
				barLeft = barLeft + barWidth;
				barTime = barTime + curMeasureMeter.duration(curBar.tempo);
			}
		}
		this.selectBarAnchor.content = this.zoomAnchors;
		this.updateTimeSelectionBar();
	}
}
