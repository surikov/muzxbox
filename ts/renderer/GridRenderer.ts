class GridRenderer {
	gridLayerGroup: SVGElement;
	gridAnchor1: TileAnchor;
	gridAnchor4: TileAnchor;
	gridAnchor16: TileAnchor;
	//gridAnchor64: TileAnchor;
	//gridAnchor256: TileAnchor;
	gridLayer: TileLayerDefinition;
	attach(zRender: ZRender) {
		this.gridLayerGroup = (document.getElementById('gridLayerGroup') as any) as SVGElement;
		this.initGridAnchors(zRender);
	}
	initGridAnchors(zRender: ZRender) {
		this.gridAnchor1 = TAnchor(0, 0, 1111, 1111, zRender.zoomMin, zRender.zoomNote);
		this.gridAnchor4 = TAnchor(0, 0, 1111, 1111, zRender.zoomNote, zRender.zoomMeasure);
		this.gridAnchor16 = TAnchor(0, 0, 1111, 1111, zRender.zoomMeasure, zRender.zoomSong);
		//this.gridAnchor64 = TAnchor(0, 0, 1111, 1111, zRender.zoomSong, zRender.zoomFar);
		//this.gridAnchor256 = TAnchor(0, 0, 1111, 1111, zRender.zoomFar, zRender.zoomMax + 1);
		this.gridLayer = {
			g: this.gridLayerGroup, anchors: [
				this.gridAnchor1, this.gridAnchor4, this.gridAnchor16//, this.gridAnchor64, this.gridAnchor256//, this.gridAnchor0
			]
		};
		zRender.layers.push(this.gridLayer);
	}
	clearGridAnchorsContent(zRender: ZRender, wholeWidth: number): void {
		let anchors: TileAnchor[] = [
			this.gridAnchor1, this.gridAnchor4, this.gridAnchor16//, this.gridAnchor64, this.gridAnchor256
		];

		for (let i = 0; i < anchors.length; i++) {
			zRender.clearResizeSingleAnchor(anchors[i], wholeWidth);
		}

	}
	drawGrid(zRender: ZRender, song: ZvoogSchedule, ratioDuration: number, ratioThickness: number, rhythmPattern: ZvoogMeter[]) {//}, menuButton: TileRectangle) {
		this.gridAnchor1.content = [];
		this.gridAnchor4.content = [];
		this.gridAnchor16.content = [];
		//this.gridAnchor64.content = [];
		//this.gridAnchor256.content = [];
		let time = 0;
		for (let mm = 0; mm < song.measures.length; mm++) {
			let measureDuration = meter2seconds(song.measures[mm].tempo, song.measures[mm].meter);
			let gridMeasure1: TileAnchor = TAnchor(leftGridMargin + time * ratioDuration, 0, ratioDuration * measureDuration, gridHeightTp(ratioThickness) + bottomGridMargin, zRender.pianoRollRenderer.contentMain1.showZoom, zRender.pianoRollRenderer.contentMain1.hideZoom);
			let gridMeasure4: TileAnchor = TAnchor(leftGridMargin + time * ratioDuration, 0, ratioDuration * measureDuration, gridHeightTp(ratioThickness) + bottomGridMargin, zRender.pianoRollRenderer.contentMain4.showZoom, zRender.pianoRollRenderer.contentMain4.hideZoom);
			let gridMeasure16: TileAnchor = TAnchor(leftGridMargin + time * ratioDuration, 0, ratioDuration * measureDuration, gridHeightTp(ratioThickness), zRender.pianoRollRenderer.contentMain16.showZoom, zRender.pianoRollRenderer.contentMain16.hideZoom);
			//let gridMeasure64: TileAnchor = TAnchor(leftGridMargin + time * ratioDuration, 0, ratioDuration * measureDuration, gridHeightTp(ratioThickness), zRender.pianoRollRenderer.contentMain64.showZoom, zRender.pianoRollRenderer.contentMain64.hideZoom);
			//let gridMeasure256: TileAnchor = TAnchor(leftGridMargin + time * ratioDuration, 0, ratioDuration * measureDuration, gridHeightTp(ratioThickness), zRender.pianoRollRenderer.contentMain256.showZoom, zRender.pianoRollRenderer.contentMain256.hideZoom);
			this.gridAnchor1.content.push(gridMeasure1);
			this.gridAnchor4.content.push(gridMeasure4);
			this.gridAnchor16.content.push(gridMeasure16);
			//this.gridAnchor64.content.push(gridMeasure64);
			//this.gridAnchor256.content.push(gridMeasure256);
			gridMeasure1.content.push({
				x1: leftGridMargin + time * ratioDuration
				, y1: topGridMargin
				, x2: leftGridMargin + time * ratioDuration
				, y2: topGridMargin + gridHeightTp(ratioThickness) + bottomGridMargin
				, css: 'barLine1'
			});
			gridMeasure4.content.push({
				x1: leftGridMargin + time * ratioDuration
				, y1: topGridMargin
				, x2: leftGridMargin + time * ratioDuration
				, y2: topGridMargin + gridHeightTp(ratioThickness) + bottomGridMargin
				, css: 'barLine4'
			});
			gridMeasure16.content.push({
				x1: leftGridMargin + time * ratioDuration
				, y1: topGridMargin
				, x2: leftGridMargin + time * ratioDuration
				, y2: topGridMargin + gridHeightTp(ratioThickness)
				, css: 'barLine16'
			});
			/*gridMeasure64.content.push({
				x1: leftGridMargin + time * ratioDuration
				, y1: topGridMargin
				, x2: leftGridMargin + time * ratioDuration
				, y2: topGridMargin + gridHeightTp(ratioThickness)
				, css: 'barLine64'
			});
			gridMeasure256.content.push({
				x1: leftGridMargin + time * ratioDuration
				, y1: topGridMargin
				, x2: leftGridMargin + time * ratioDuration
				, y2: topGridMargin + gridHeightTp(ratioThickness)
				, css: 'barLine256'
			});*/
			for (let n = 1; n < 12; n++) {
				gridMeasure4.content.push({
					x1: leftGridMargin + time * ratioDuration
					, y1: topGridMargin + (12 * (octaveCount - 0) - n) * ratioThickness
					, x2: leftGridMargin + (time + measureDuration) * ratioDuration
					, y2: topGridMargin + (12 * (octaveCount - 0) - n) * ratioThickness
					, css: 'pitchLine4'
				});
			}
			for (let i = 1; i < octaveCount; i++) {
				gridMeasure16.content.push({
					x1: leftGridMargin + time * ratioDuration
					, y1: topGridMargin + 12 * (octaveCount - i) * ratioThickness
					, x2: leftGridMargin + (time + measureDuration) * ratioDuration
					, y2: topGridMargin + 12 * (octaveCount - i) * ratioThickness
					, css: 'octaveLine16'
				});
				gridMeasure4.content.push({
					x1: leftGridMargin + time * ratioDuration
					, y1: topGridMargin + 12 * (octaveCount - i) * ratioThickness
					, x2: leftGridMargin + (time + measureDuration) * ratioDuration
					, y2: topGridMargin + 12 * (octaveCount - i) * ratioThickness
					, css: 'octaveLine4'
				});
				gridMeasure1.content.push({
					x1: leftGridMargin + time * ratioDuration
					, y1: topGridMargin + 12 * (octaveCount - i) * ratioThickness
					, x2: leftGridMargin + (time + measureDuration) * ratioDuration
					, y2: topGridMargin + 12 * (octaveCount - i) * ratioThickness
					, css: 'octaveLine1'
				});
				for (let n = 1; n < 12; n++) {
					gridMeasure4.content.push({
						x1: leftGridMargin + time * ratioDuration
						, y1: topGridMargin + (12 * (octaveCount - i) - n) * ratioThickness
						, x2: leftGridMargin + (time + measureDuration) * ratioDuration
						, y2: topGridMargin + (12 * (octaveCount - i) - n) * ratioThickness
						, css: 'pitchLine4'
					});
				}
			}
			let stepNN = 0;
			let position: ZvoogMeter = rhythmPattern[stepNN];
			while (DUU(position).lessThen(song.measures[mm].meter)) {
				let positionDuration = meter2seconds(song.measures[mm].tempo, position);
				let css = 'rhythmLine4';
				if (stepNN == rhythmPattern.length - 1) {
					css = 'rhythmWideLine4';
				}
				let line = {
					x1: leftGridMargin + (time + positionDuration) * ratioDuration
					, y1: topGridMargin
					, x2: leftGridMargin + (time + positionDuration) * ratioDuration
					, y2: topGridMargin + gridHeightTp(ratioThickness) + bottomGridMargin
					, css: css
				};
				gridMeasure4.content.push(line);
				gridMeasure1.content.push(line);
				stepNN++;
				if (stepNN >= rhythmPattern.length) {
					stepNN = 0;
				}
				position = DUU(position).plus(rhythmPattern[stepNN]);
			}

			time = time + measureDuration;
		}
		zRender.tileLevel.autoID(this.gridLayer.anchors);
	}
	reSetGrid(zrenderer: ZRender, meters: ZvoogMeter[], currentSchedule: ZvoogSchedule) {
		zrenderer.tileLevel.resetAnchor(this.gridAnchor1, this.gridLayerGroup);
		zrenderer.tileLevel.resetAnchor(this.gridAnchor4, this.gridLayerGroup);
		zrenderer.tileLevel.resetAnchor(this.gridAnchor16, this.gridLayerGroup);
		//zrenderer.tileLevel.resetAnchor(this.gridAnchor64, this.gridLayerGroup);
		//zrenderer.tileLevel.resetAnchor(this.gridAnchor256, this.gridLayerGroup);
		this.drawGrid(zrenderer
			, currentSchedule
			, zrenderer.secondWidthInTaps
			, zrenderer.pitchLineThicknessInTaps
			, meters);
	}
}
