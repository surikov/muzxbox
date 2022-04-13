class TimeLineRenderer {
	upperSelectionScale: SVGElement;
	measuresTimelineAnchor1: TileAnchor;
	measuresTimelineAnchor4: TileAnchor;
	measuresTimelineAnchor16: TileAnchor;
	measuresTimelineAnchor64: TileAnchor;
	measuresTimelineAnchor256: TileAnchor;
	attach(zRender: ZRender) {
		this.upperSelectionScale = (document.getElementById('upperSelectionScale') as any) as SVGElement;
		this.initTimeScaleAnchors(zRender);
	}
	initTimeScaleAnchors(zRender: ZRender) {
		this.measuresTimelineAnchor1 = TAnchor(0, 0, 1111, 1111, zRender.zoomMin, zRender.zoomNote);
		this.measuresTimelineAnchor4 = TAnchor(0, 0, 1111, 1111, zRender.zoomNote, zRender.zoomMeasure);
		this.measuresTimelineAnchor16 = TAnchor(0, 0, 1111, 1111, zRender.zoomMeasure, zRender.zoomSong);
		this.measuresTimelineAnchor64 = TAnchor(0, 0, 1111, 1111, zRender.zoomSong, zRender.zoomFar);
		this.measuresTimelineAnchor256 = TAnchor(0, 0, 1111, 1111, zRender.zoomFar, zRender.zoomBig + 1);
		zRender.layers.push({
			g: this.upperSelectionScale, stickTop: 0, anchors: [
				this.measuresTimelineAnchor1, this.measuresTimelineAnchor4, this.measuresTimelineAnchor16, this.measuresTimelineAnchor64, this.measuresTimelineAnchor256
			]
		});
	}
	clearAnchorsContent(zRender: ZRender, songDuration: number): void {
		let anchors: TileAnchor[] = [
			this.measuresTimelineAnchor1, this.measuresTimelineAnchor4, this.measuresTimelineAnchor16, this.measuresTimelineAnchor64, this.measuresTimelineAnchor256
		];

		for (let i = 0; i < anchors.length; i++) {
			zRender.clearSingleAnchor(anchors[i], songDuration);
		}

	}
	drawSchedule(zRender: ZRender, song: ZvoogSchedule, ratioDuration: number, ratioThickness: number) {
		this.drawLevel(song, ratioDuration, ratioThickness, this.measuresTimelineAnchor1, 'textSize1', 1);
		this.drawLevel(song, ratioDuration, ratioThickness, this.measuresTimelineAnchor4, 'textSize4', 4);
		this.drawLevel(song, ratioDuration, ratioThickness, this.measuresTimelineAnchor16, 'textSize16', 16);
		this.drawLevel(song, ratioDuration, ratioThickness, this.measuresTimelineAnchor64, 'textSize64', 64);
		this.drawLevel(song, ratioDuration, ratioThickness, this.measuresTimelineAnchor256, 'textSize256', 256);
	}
	drawLevel(song: ZvoogSchedule, ratioDuration: number, ratioThickness: number, layerAnchor: TileAnchor, textSize: string, yy: number) {
		let time = 0;
		for (let i = 0; i < song.measures.length; i++) {
			let measureDuration = meter2seconds(song.measures[i].tempo, song.measures[i].meter);
			if (yy < 64 || (i % 8 == 0)) {
				let measureAnchor: TileAnchor = TAnchor(
					time * ratioDuration, 0, ratioDuration * measureDuration, 128 * ratioThickness
					, layerAnchor.showZoom, layerAnchor.hideZoom
				);
				measureAnchor.content.push(TText(time * ratioDuration, yy*2, 'barNumber ' + textSize, ('' + (1 + i))));
				if (yy < 16) {
					let step: ZvoogMeter = { count: 1, division: 8 };
					let part: ZvoogMeter = { count: 1, division: 8 };
					while (DUU(part).lessThen(song.measures[i].meter)) {
						let duration = meter2seconds(song.measures[i].tempo, part);
						let simple = DUU(part).simplify();
						measureAnchor.content.push(TText((time + duration) * ratioDuration, yy, 'barNumber ' + textSize, ('' + simple.count + '/' + simple.division)));
						part = DUU(part).plus(step);
					}

				}
				layerAnchor.content.push(measureAnchor);
			}
			time = time + measureDuration;
		}
	}
}
