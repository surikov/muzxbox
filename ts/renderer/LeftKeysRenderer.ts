class LeftKeysRenderer {
	leftKeysGroup: SVGElement;
	keysAnchor1: TileAnchor;
	keysAnchor4: TileAnchor;
	keysLayer: TileLayerDefinition;
	attach(zRender: ZRender) {
		this.leftKeysGroup = (document.getElementById('leftKeysGroup') as any) as SVGElement;
		this.initLeftKeysGroup(zRender);
	}
	initLeftKeysGroup(zRender: ZRender) {
		this.keysAnchor1 = TAnchor(0, 0, 1111, 1111, zRender.zoomMin, zRender.zoomNote);
		this.keysAnchor4 = TAnchor(0, 0, 1111, 1111, zRender.zoomNote, zRender.zoomMeasure);
		this.keysLayer = {
			g: this.leftKeysGroup, stickLeft: 0, anchors: [
				this.keysAnchor1, this.keysAnchor4
			]
		};
		zRender.layers.push(this.keysLayer);
	}
	clearKeysAnchorsContent(zRender: ZRender, wholeWidth: number): void {
		let anchors: TileAnchor[] = [
			this.keysAnchor1, this.keysAnchor4
		];

		for (let i = 0; i < anchors.length; i++) {
			zRender.clearResizeSingleAnchor(zRender.muzXBox.currentSchedule, anchors[i], wholeWidth);
		}

	}
	drawKeys(zRender: ZRender, song: ZvoogSchedule
		, ratioDuration: number, ratioThickness: number
	) {
		let topGridMargin = topGridMarginTp(song, ratioThickness);
		for (let i = 0; i < octaveCount; i++) {
			this.keysAnchor1.content.push(TText(0, topGridMargin + ((octaveCount - i) * 12) * ratioThickness, 'octaveNumNote', '' + (i + 1)));

			this.keysAnchor1.content.push({ x: -1, y: topGridMargin + (0.05 + (octaveCount - i) * 12 - 2) * ratioThickness, w: 5, h: ratioThickness * 0.9, rx: 0.125, ry: 0.25, css: 'keysNote' });
			this.keysAnchor1.content.push({ x: -1, y: topGridMargin + (0.05 + (octaveCount - i) * 12 - 4) * ratioThickness, w: 5, h: ratioThickness * 0.9, rx: 0.125, ry: 0.25, css: 'keysNote' });
			this.keysAnchor1.content.push({ x: -1, y: topGridMargin + (0.05 + (octaveCount - i) * 12 - 7) * ratioThickness, w: 5, h: ratioThickness * 0.9, rx: 0.125, ry: 0.25, css: 'keysNote' });
			this.keysAnchor1.content.push({ x: -1, y: topGridMargin + (0.05 + (octaveCount - i) * 12 - 9) * ratioThickness, w: 5, h: ratioThickness * 0.9, rx: 0.125, ry: 0.25, css: 'keysNote' });
			this.keysAnchor1.content.push({ x: -1, y: topGridMargin + (0.05 + (octaveCount - i) * 12 - 11) * ratioThickness, w: 5, h: ratioThickness * 0.9, rx: 0.125, ry: 0.25, css: 'keysNote' });

			this.keysAnchor4.content.push(TText(0, topGridMargin + ((octaveCount - i) * 12) * ratioThickness, 'octaveNumMeasure', '' + (i + 1)));

			this.keysAnchor4.content.push({ x: -1, y: topGridMargin + (0.05 + (octaveCount - i) * 12 - 2) * ratioThickness, w: 5, h: ratioThickness * 0.9, rx: 0.25, ry: 0.25, css: 'keysMeasure' });
			this.keysAnchor4.content.push({ x: -1, y: topGridMargin + (0.05 + (octaveCount - i) * 12 - 4) * ratioThickness, w: 5, h: ratioThickness * 0.9, rx: 0.25, ry: 0.25, css: 'keysMeasure' });
			this.keysAnchor4.content.push({ x: -1, y: topGridMargin + (0.05 + (octaveCount - i) * 12 - 7) * ratioThickness, w: 5, h: ratioThickness * 0.9, rx: 0.25, ry: 0.25, css: 'keysMeasure' });
			this.keysAnchor4.content.push({ x: -1, y: topGridMargin + (0.05 + (octaveCount - i) * 12 - 9) * ratioThickness, w: 5, h: ratioThickness * 0.9, rx: 0.25, ry: 0.25, css: 'keysMeasure' });
			this.keysAnchor4.content.push({ x: -1, y: topGridMargin + (0.05 + (octaveCount - i) * 12 - 11) * ratioThickness, w: 5, h: ratioThickness * 0.9, rx: 0.25, ry: 0.25, css: 'keysMeasure' });
		}
		let cntr = 0;
		for (let tt = 0; tt < song.tracks.length; tt++) {
			let track = song.tracks[tt];
			for (let pp = 0; pp < track.percussions.length; pp++) {
				let drum=track.percussions[pp];
				this.keysAnchor1.content.push(TText(0, cntr * ratioThickness, 'drumTitleNote', drum.title));
				this.keysAnchor4.content.push(TText(0, cntr * ratioThickness, 'drumTitleMeasure', drum.title));
				cntr++;
			}
		}
		zRender.tileLevel.autoID(this.keysLayer.anchors);
	}
}
