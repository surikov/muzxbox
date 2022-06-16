class TimeLineRenderer {
	upperSelectionScale: SVGElement;
	measuresTimelineAnchor1: TileAnchor;
	measuresTimelineAnchor4: TileAnchor;
	measuresTimelineAnchor16: TileAnchor;
	measuresTimelineAnchor64: TileAnchor;
	//measuresTimelineAnchor256: TileAnchor;
	timeLayer: TileLayerDefinition;
	attach(zRender: ZRender) {
		this.upperSelectionScale = (document.getElementById('upperSelectionScale') as any) as SVGElement;
		this.initTimeScaleAnchors(zRender);
	}
	initTimeScaleAnchors(zRender: ZRender) {
		this.measuresTimelineAnchor1 = TAnchor(0, 0, 1111, 1111, zRender.zoomMin, zRender.zoomNote);
		this.measuresTimelineAnchor4 = TAnchor(0, 0, 1111, 1111, zRender.zoomNote, zRender.zoomMeasure);
		this.measuresTimelineAnchor16 = TAnchor(0, 0, 1111, 1111, zRender.zoomMeasure, zRender.zoomSong);
		this.measuresTimelineAnchor64 = TAnchor(0, 0, 1111, 1111, zRender.zoomSong, zRender.zoomFar);
		//this.measuresTimelineAnchor256 = TAnchor(0, 0, 1111, 1111, zRender.zoomFar, zRender.zoomBig + 1);
		this.timeLayer = {
			g: this.upperSelectionScale, stickTop: 0, anchors: [
				this.measuresTimelineAnchor1, this.measuresTimelineAnchor4, this.measuresTimelineAnchor16, this.measuresTimelineAnchor64//, this.measuresTimelineAnchor256
			]
		};
		zRender.layers.push(this.timeLayer);
	}
	clearTLAnchorsContent(zRender: ZRender, wholeWidth: number): void {
		let anchors: TileAnchor[] = [
			this.measuresTimelineAnchor1, this.measuresTimelineAnchor4, this.measuresTimelineAnchor16, this.measuresTimelineAnchor64//, this.measuresTimelineAnchor256
		];
		for (let i = 0; i < anchors.length; i++) {
			zRender.clearResizeSingleAnchor(zRender.muzXBox.currentSchedule,anchors[i], wholeWidth);
		}

	}
	drawSchedule(zRender: ZRender, song: ZvoogSchedule
		, ratioDuration: number, ratioThickness: number
	) {

		this.drawLevel(zRender, song, ratioDuration, ratioThickness, this.measuresTimelineAnchor1, 'timelineBarSubNote', 'timelineBarLabelNote', 1, false);
		this.drawLevel(zRender, song, ratioDuration, ratioThickness, this.measuresTimelineAnchor4, 'timelineBarSubMeasure', 'timelineBarLabelMeasure', 4, false);
		this.drawLevel(zRender, song, ratioDuration, ratioThickness, this.measuresTimelineAnchor16, null, 'timelineBarLabelSong', 16, false);
		this.drawLevel(zRender, song, ratioDuration, ratioThickness, this.measuresTimelineAnchor64, null, 'timelineBarLabelSongFar', 64, true);
		//this.drawLevel(zRender, song, ratioDuration, ratioThickness, this.measuresTimelineAnchor256, null, 'textSize256', 256, true);
	}
	drawLevel(zRender: ZRender, song: ZvoogSchedule, ratioDuration: number, ratioThickness: number, layerAnchor: TileAnchor
		, subCSS: string | null, textCSS: string, yy: number, skip8: boolean) {
		this.measuresTimelineAnchor64.content = [];
		layerAnchor.content = [];
		let time = 0;

		for (let i = 0; i < song.measures.length; i++) {
			let measureDuration = meter2seconds(song.measures[i].tempo, song.measures[i].meter);
			if (!skip8 || (skip8 && i % 8 == 0)) {
				let measureAnchor: TileAnchor = TAnchor(
					leftGridMargin + time * ratioDuration
					, 0
					, ratioDuration * measureDuration
					, wholeHeightTp(song,ratioThickness)
					, layerAnchor.showZoom, layerAnchor.hideZoom
				);
				measureAnchor.content.push(TText(
					leftGridMargin +time * ratioDuration
					, yy * 1
					//, 'barNumber ' + textSize
					,  textCSS
					, ('' + (1 + i))));
				let rhythmPattern: ZvoogMeter[] = song.rhythm ? song.rhythm : zRender.rhythmPatternDefault;
				if (subCSS) {
					let stepNN = 0;
					let position: ZvoogMeter = rhythmPattern[stepNN];
					while (DUU(position).lessThen(song.measures[i].meter)) {
						let positionDuration = meter2seconds(song.measures[i].tempo, position);
						let simple = DUU(position).simplify();
						measureAnchor.content.push(TText(
							leftGridMargin + (time + positionDuration) * ratioDuration
							, yy
							//, 'barNumber ' + subSize
							//, 'barNumber ' + subSize
							,subCSS
							, ('' + simple.count + '/' + simple.division)));
						stepNN++;
						if (stepNN >= rhythmPattern.length) {
							stepNN = 0;
						}
						position = DUU(position).plus(rhythmPattern[stepNN]);
					}
				}
				layerAnchor.content.push(measureAnchor);
			}
			time = time + measureDuration;
		}
		zRender.tileLevel.autoID(this.timeLayer.anchors);
	}
	reSetGrid(zrenderer: ZRender, meters: ZvoogMeter[], currentSchedule: ZvoogSchedule) {
		zrenderer.tileLevel.resetAnchor(this.measuresTimelineAnchor1, this.upperSelectionScale);
		zrenderer.tileLevel.resetAnchor(this.measuresTimelineAnchor4, this.upperSelectionScale);
		zrenderer.tileLevel.resetAnchor(this.measuresTimelineAnchor16, this.upperSelectionScale);
		zrenderer.tileLevel.resetAnchor(this.measuresTimelineAnchor64, this.upperSelectionScale);
		//zrenderer.tileLevel.resetAnchor(this.measuresTimelineAnchor256, this.upperSelectionScale);
		this.drawSchedule(zrenderer
			, currentSchedule
			, zrenderer.secondWidthInTaps
			, zrenderer.pitchLineThicknessInTaps
		);
		//zrenderer.tileLevel.allTilesOK=false;
		//console.log(this.zrenderer.gridRenderer.gridLayerGroup);
	}
}
