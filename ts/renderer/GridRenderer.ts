class GridRenderer {
	gridLayerGroup: SVGElement;
	gridAnchor0: TileAnchor;
	gridAnchor1: TileAnchor;
	gridAnchor4: TileAnchor;
	gridAnchor16: TileAnchor;
	gridAnchor64: TileAnchor;
	gridAnchor256: TileAnchor;
	attach(zRender: ZRender) {
		this.gridLayerGroup = (document.getElementById('gridLayerGroup') as any) as SVGElement;
		this.initGridAnchors(zRender);
	}
	initGridAnchors(zRender: ZRender) {
		this.gridAnchor0 = TAnchor(0, 0, 1111, 1111, zRender.zoomMin, zRender.zoomMax + 1);
		this.gridAnchor1 = TAnchor(0, 0, 1111, 1111, zRender.zoomMin, zRender.zoomNote);
		this.gridAnchor4 = TAnchor(0, 0, 1111, 1111, zRender.zoomNote, zRender.zoomMeasure);
		this.gridAnchor16 = TAnchor(0, 0, 1111, 1111, zRender.zoomMeasure, zRender.zoomSong);
		this.gridAnchor64 = TAnchor(0, 0, 1111, 1111, zRender.zoomSong, zRender.zoomFar);
		this.gridAnchor256 = TAnchor(0, 0, 1111, 1111, zRender.zoomFar, zRender.zoomMax + 1);
		zRender.layers.push({
			g: this.gridLayerGroup, anchors: [
				this.gridAnchor1, this.gridAnchor4, this.gridAnchor16, this.gridAnchor64, this.gridAnchor256, this.gridAnchor0
			]
		});
	}
	clearAnchorsContent(zRender: ZRender, songDuration: number): void {
		let anchors: TileAnchor[] = [
			this.gridAnchor1, this.gridAnchor4, this.gridAnchor16, this.gridAnchor64, this.gridAnchor256
		];

		for (let i = 0; i < anchors.length; i++) {
			zRender.clearSingleAnchor(anchors[i], songDuration);
		}

	}
	drawSchedule(zRender: ZRender, song: ZvoogSchedule, ratioDuration: number, ratioThickness: number) {//}, menuButton: TileRectangle) {
		let songDuration = scheduleDuration(song);

		let time = 0;
		song.obverseTrackFilter = (song.obverseTrackFilter) ? song.obverseTrackFilter : 0;
		for (let mm = 0; mm < song.measures.length; mm++) {
			let measureDuration = meter2seconds(song.measures[mm].tempo, song.measures[mm].meter);


			let gridMeasure1: TileAnchor = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, 128 * ratioThickness, zRender.pianoRollRenderer.contentMain1.showZoom, zRender.pianoRollRenderer.contentMain1.hideZoom);
			let gridMeasure4: TileAnchor = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, 128 * ratioThickness, zRender.pianoRollRenderer.contentMain4.showZoom, zRender.pianoRollRenderer.contentMain4.hideZoom);
			let gridMeasure16: TileAnchor = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, 128 * ratioThickness, zRender.pianoRollRenderer.contentMain16.showZoom, zRender.pianoRollRenderer.contentMain16.hideZoom);
			let gridMeasure64: TileAnchor = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, 128 * ratioThickness, zRender.pianoRollRenderer.contentMain64.showZoom, zRender.pianoRollRenderer.contentMain64.hideZoom);
			let gridMeasure256: TileAnchor = TAnchor(time * ratioDuration, 0, ratioDuration * measureDuration, 128 * ratioThickness, zRender.pianoRollRenderer.contentMain256.showZoom, zRender.pianoRollRenderer.contentMain256.hideZoom);
			this.gridAnchor1.content.push(gridMeasure1);
			this.gridAnchor4.content.push(gridMeasure4);
			this.gridAnchor16.content.push(gridMeasure16);
			this.gridAnchor64.content.push(gridMeasure64);
			this.gridAnchor256.content.push(gridMeasure256);
			/*
						let measureDebugSquare: TileRectangle = { x: time * ratioDuration, y: 0, w: ratioDuration * measureDuration, h: 128 * ratioThickness, rx: 8, ry: 8, css: 'measureBackground' };
						gridMeasure1.content.push(measureDebugSquare);
						gridMeasure4.content.push(measureDebugSquare);
						gridMeasure16.content.push(measureDebugSquare);
						gridMeasure64.content.push(measureDebugSquare);
						gridMeasure256.content.push(measureDebugSquare);
						*/
			gridMeasure1.content.push({ x1: time * ratioDuration, y1: 0, x2: time * ratioDuration, y2: 128 * ratioThickness, css: 'barLine1' });
			gridMeasure4.content.push({ x1: time * ratioDuration, y1: 0, x2: time * ratioDuration, y2: 128 * ratioThickness, css: 'barLine4' });
			gridMeasure16.content.push({ x1: time * ratioDuration, y1: 0, x2: time * ratioDuration, y2: 128 * ratioThickness, css: 'barLine16' });
			gridMeasure64.content.push({ x1: time * ratioDuration, y1: 0, x2: time * ratioDuration, y2: 128 * ratioThickness, css: 'barLine64' });
			gridMeasure256.content.push({ x1: time * ratioDuration, y1: 0, x2: time * ratioDuration, y2: 128 * ratioThickness, css: 'barLine256' });

			for (let i = 1; i < 128; i = i + 12) {
				gridMeasure16.content.push({
					x1: time * ratioDuration, y1: (128.5 - i) * ratioThickness
					, x2: (time + measureDuration) * ratioDuration, y2: (128.5 - i) * ratioThickness, css: 'barLine16'
				});
			}
			for (let i = 1; i < 128; i = i + 1) {
				if (i % 12 == 0) {
					gridMeasure4.content.push({
						x1: time * ratioDuration, y1: (128.5 - i) * ratioThickness
						, x2: (time + measureDuration) * ratioDuration, y2: (128.5 - i) * ratioThickness, css: 'barLine4'
					});
				} else {
					gridMeasure4.content.push({
						x1: time * ratioDuration, y1: (128.5 - i) * ratioThickness
						, x2: (time + measureDuration) * ratioDuration, y2: (128.5 - i) * ratioThickness, css: 'pitchLine4'
					});
				}
			}

			time = time + measureDuration;
		}
	}
}
