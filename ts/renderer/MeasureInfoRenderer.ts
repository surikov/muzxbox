class MeasureInfoRenderer {
	measuresMeasureInfoAnchor1: TileAnchor;
	measuresMeasureInfoAnchor4: TileAnchor;
	measuresMeasureInfoAnchor16: TileAnchor;
	measuresMeasureInfoAnchor64: TileAnchor;
	measuresMeasureInfoAnchor256: TileAnchor;
	bottomTimelineLayerGroup: SVGElement;
	attach(zRender: ZRender) {
		this.bottomTimelineLayerGroup = (document.getElementById('bottomTimelineLayerGroup') as any) as SVGElement;
		this.initMeasureInfoAnchors(zRender);
	}
	fillMeasureInfo(song: ZvoogSchedule, ratioDuration: number, ratioThickness: number) {
		this.fillMeasureInfo1(song, ratioDuration, ratioThickness);
		this.fillMeasureInfo4(song, ratioDuration, ratioThickness);
		this.fillMeasureInfo16(song, ratioDuration, ratioThickness);
		this.fillMeasureInfo64(song, ratioDuration, ratioThickness);
		this.fillMeasureInfo256(song, ratioDuration, ratioThickness);
	}
	initMeasureInfoAnchors(zRender: ZRender) {
		this.measuresMeasureInfoAnchor1 = TAnchor(0, 0, 1111, 1111, zRender.zoomMin, zRender.zoomNote);
		this.measuresMeasureInfoAnchor4 = TAnchor(0, 0, 1111, 1111, zRender.zoomNote, zRender.zoomMeasure);
		this.measuresMeasureInfoAnchor16 = TAnchor(0, 0, 1111, 1111, zRender.zoomMeasure, zRender.zoomSong);
		this.measuresMeasureInfoAnchor64 = TAnchor(0, 0, 1111, 1111, zRender.zoomSong, zRender.zoomFar);
		this.measuresMeasureInfoAnchor256 = TAnchor(0, 0, 1111, 1111, zRender.zoomFar, zRender.zoomBig + 1);
		zRender.layers.push({
			g: this.bottomTimelineLayerGroup, stickBottom: 0, anchors: [
				this.measuresMeasureInfoAnchor1, this.measuresMeasureInfoAnchor4, this.measuresMeasureInfoAnchor16, this.measuresMeasureInfoAnchor64, this.measuresMeasureInfoAnchor256
			]
		});
	}
	/*initTimeScaleAnchors() {
		this.measuresTimelineAnchor1 = TAnchor(0, 0, 1111, 1111, this.zoomMin, this.zoomNote);
		this.measuresTimelineAnchor4 = TAnchor(0, 0, 1111, 1111, this.zoomNote, this.zoomMeasure);
		this.measuresTimelineAnchor16 = TAnchor(0, 0, 1111, 1111, this.zoomMeasure, this.zoomSong);
		this.measuresTimelineAnchor64 = TAnchor(0, 0, 1111, 1111, this.zoomSong, this.zoomFar);
		this.measuresTimelineAnchor256 = TAnchor(0, 0, 1111, 1111, this.zoomFar, this.zoomBig + 1);
		this.layers.push({
			g: this.upperSelectionScale, stickTop: 0, anchors: [
				this.measuresTimelineAnchor1, this.measuresTimelineAnchor4, this.measuresTimelineAnchor16, this.measuresTimelineAnchor64, this.measuresTimelineAnchor256
			]
		});
	}*/
	clearAnchorsContent(zRender: ZRender, songDuration: number): void {
		let anchors: TileAnchor[] = [
			this.measuresMeasureInfoAnchor1, this.measuresMeasureInfoAnchor4, this.measuresMeasureInfoAnchor16, this.measuresMeasureInfoAnchor64, this.measuresMeasureInfoAnchor256
		];

		for (let i = 0; i < anchors.length; i++) {
			zRender.clearResizeSingleAnchor(anchors[i], songDuration);
		}

	}
	fillMeasureInfo1(song: ZvoogSchedule, ratioDuration: number, ratioThickness: number) {
		let time = 0;
		//let curMeterCount = 0;
		//let curDivision = 0;
		//let curTempo = 0;
		for (let i = 0; i < song.measures.length; i++) {
			let measureDuration = meter2seconds(song.measures[i].tempo, song.measures[i].meter);
			//let tempoMeterLabel = '' + song.measures[i].tempo + ': ' + song.measures[i].meter.count + '/' + song.measures[i].meter.division;
			let singlemeasuresTimelineAnchor1: TileAnchor = TAnchor(
				time * ratioDuration, 0, ratioDuration * measureDuration, 128 * ratioThickness
				, this.measuresMeasureInfoAnchor1.showZoom, this.measuresMeasureInfoAnchor1.hideZoom
			);
			//singlemeasuresTimelineAnchor1.content.push(TText(time * this.ratioDuration, 0, 'barNumber textSize1', '1-' + (i + 1)));
			//singlemeasuresTimelineAnchor1.content.push(TText(time * this.ratioDuration, -1, 'barNumber textSize1', tempoMeterLabel));
			//if (curMeterCount != song.measures[i].meter.count || curDivision != song.measures[i].meter.division || curTempo != song.measures[i].tempo) {
			//	curMeterCount = song.measures[i].meter.count;
			//	curDivision = song.measures[i].meter.division;
			//	curTempo = song.measures[i].tempo;
			singlemeasuresTimelineAnchor1.content.push(TText(time * ratioDuration, -1 / 4, 'barNumber textSize1'
				, (song.measures[i].tempo + ': ' + song.measures[i].meter.count + '/' + song.measures[i].meter.division)));
			//}
			this.measuresMeasureInfoAnchor1.content.push(singlemeasuresTimelineAnchor1);
			time = time + measureDuration;
		}
	}
	fillMeasureInfo4(song: ZvoogSchedule, ratioDuration: number, ratioThickness: number) {
		let time = 0;
		//let curMeterCount = 0;
		//let curDivision = 0;
		//let curTempo = 0;
		for (let i = 0; i < song.measures.length; i++) {
			let measureDuration = meter2seconds(song.measures[i].tempo, song.measures[i].meter);
			//let tempoMeterLabel = '' + song.measures[i].tempo + ': ' + song.measures[i].meter.count + '/' + song.measures[i].meter.division;
			let singlemeasuresTimelineAnchor4: TileAnchor = TAnchor(
				time * ratioDuration, 0, ratioDuration * measureDuration, 128 * ratioThickness
				, this.measuresMeasureInfoAnchor4.showZoom, this.measuresMeasureInfoAnchor4.hideZoom
			);
			//singlemeasuresTimelineAnchor4.content.push(TText(time * this.ratioDuration, 0, 'barNumber textSize4', ('4-' + (i + 1))));
			//singlemeasuresTimelineAnchor4.content.push(TText(time * this.ratioDuration, -4, 'barNumber textSize4', tempoMeterLabel));
			//if (curMeterCount != song.measures[i].meter.count || curDivision != song.measures[i].meter.division || curTempo != song.measures[i].tempo) {
			//	curMeterCount = song.measures[i].meter.count;
			//	curDivision = song.measures[i].meter.division;
			//	curTempo = song.measures[i].tempo;
			singlemeasuresTimelineAnchor4.content.push(TText(time * ratioDuration, -4 / 4, 'barNumber textSize4'
				, (song.measures[i].tempo + ': ' + song.measures[i].meter.count + '/' + song.measures[i].meter.division)));
			//}
			this.measuresMeasureInfoAnchor4.content.push(singlemeasuresTimelineAnchor4);
			time = time + measureDuration;
		}
	}
	fillMeasureInfo16(song: ZvoogSchedule, ratioDuration: number, ratioThickness: number) {
		let time = 0;
		let curMeterCount = 0;
		let curDivision = 0;
		let curTempo = 0;
		for (let i = 0; i < song.measures.length; i++) {
			let measureDuration = meter2seconds(song.measures[i].tempo, song.measures[i].meter);
			//let tempoMeterLabel = '' + song.measures[i].tempo + ': ' + song.measures[i].meter.count + '/' + song.measures[i].meter.division;
			let singlemeasuresTimelineAnchor16: TileAnchor = TAnchor(
				time * ratioDuration, 0, ratioDuration * measureDuration, 128 * ratioThickness
				, this.measuresMeasureInfoAnchor16.showZoom, this.measuresMeasureInfoAnchor16.hideZoom
			);
			//singlemeasuresTimelineAnchor16.content.push(TText(time * this.ratioDuration, 0, 'barNumber textSize16', ('16-' + (i + 1))));
			//singlemeasuresTimelineAnchor16.content.push({ x: time * this.ratioDuration, y: -16, css: 'barNumber textSize16', text: tempoMeterLabel });
			if (curMeterCount != song.measures[i].meter.count || curDivision != song.measures[i].meter.division || curTempo != song.measures[i].tempo) {
				curMeterCount = song.measures[i].meter.count;
				curDivision = song.measures[i].meter.division;
				curTempo = song.measures[i].tempo;
				singlemeasuresTimelineAnchor16.content.push({
					x: time * ratioDuration, y: -16 / 4, css: 'barNumber textSize16'
					, text: (song.measures[i].tempo + ': ' + song.measures[i].meter.count + '/' + song.measures[i].meter.division)
				});
			}
			this.measuresMeasureInfoAnchor16.content.push(singlemeasuresTimelineAnchor16);
			time = time + measureDuration;
		}
	}
	fillMeasureInfo64(song: ZvoogSchedule, ratioDuration: number, ratioThickness: number) {
		let time = 0;
		let curMeterCount = 0;
		let curDivision = 0;
		let curTempo = 0;
		let lastMeasureNum = -123456;
		for (let i = 0; i < song.measures.length; i++) {
			let measureDuration = meter2seconds(song.measures[i].tempo, song.measures[i].meter);
			//let tempoMeterLabel = '' + song.measures[i].tempo + ': ' + song.measures[i].meter.count + '/' + song.measures[i].meter.division;
			let singlemeasuresTimelineAnchor64: TileAnchor = TAnchor(
				time * ratioDuration, 0, ratioDuration * measureDuration, 128 * ratioThickness
				, this.measuresMeasureInfoAnchor64.showZoom, this.measuresMeasureInfoAnchor64.hideZoom
			);
			//if (i % 4 == 0) singlemeasuresTimelineAnchor64.content.push(TText(time * this.ratioDuration, 0, 'barNumber textSize64', ('64-' + (i + 1))));
			//if (i % 4 == 0) singlemeasuresTimelineAnchor64.content.push({ x: time * this.ratioDuration, y: -64, css: 'barNumber textSize64', text: tempoMeterLabel });
			if (curMeterCount != song.measures[i].meter.count || curDivision != song.measures[i].meter.division || curTempo != song.measures[i].tempo) {
				curMeterCount = song.measures[i].meter.count;
				curDivision = song.measures[i].meter.division;
				curTempo = song.measures[i].tempo;
				if (i - lastMeasureNum > 2) {
					lastMeasureNum = i;
					singlemeasuresTimelineAnchor64.content.push({
						x: time * ratioDuration, y: -64 / 4, css: 'barNumber textSize64'
						, text: (song.measures[i].tempo + ': ' + song.measures[i].meter.count + '/' + song.measures[i].meter.division)
					});
					//console.log('singlemeasuresTimelineAnchor64',i);
				}
			}
			this.measuresMeasureInfoAnchor64.content.push(singlemeasuresTimelineAnchor64);
			time = time + measureDuration;
		}
	}
	fillMeasureInfo256(song: ZvoogSchedule, ratioDuration: number, ratioThickness: number) {
		let time = 0;
		let curMeterCount = 0;
		let curDivision = 0;
		let curTempo = 0;
		let lastMeasureNum = -123456;
		for (let i = 0; i < song.measures.length; i++) {
			let measureDuration = meter2seconds(song.measures[i].tempo, song.measures[i].meter);
			let singlemeasuresTimelineAnchor256: TileAnchor = TAnchor(
				time * ratioDuration, 0, ratioDuration * measureDuration, 128 * ratioThickness
				, this.measuresMeasureInfoAnchor256.showZoom, this.measuresMeasureInfoAnchor256.hideZoom
			);
			if (curMeterCount != song.measures[i].meter.count || curDivision != song.measures[i].meter.division || curTempo != song.measures[i].tempo) {
				curMeterCount = song.measures[i].meter.count;
				curDivision = song.measures[i].meter.division;
				curTempo = song.measures[i].tempo;
				if (i - lastMeasureNum > 8) {
					lastMeasureNum = i;
					singlemeasuresTimelineAnchor256.content.push({
						x: time * ratioDuration, y: -256, css: 'barNumber textSize256'
						, text: ('' + song.measures[i].meter.count + '/' + song.measures[i].meter.division)
					});
					singlemeasuresTimelineAnchor256.content.push({
						x: time * ratioDuration, y: -256 / 4, css: 'barNumber textSize256'
						, text: ('' + song.measures[i].tempo)
					});
				}
			}
			this.measuresMeasureInfoAnchor256.content.push(singlemeasuresTimelineAnchor256);
			time = time + measureDuration;
		}
	}
}
