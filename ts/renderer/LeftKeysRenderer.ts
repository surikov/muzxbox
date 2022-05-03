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
	clearAnchorsContent(zRender: ZRender, songDuration: number): void {
		let anchors: TileAnchor[] = [
			this.keysAnchor1, this.keysAnchor4
		];

		for (let i = 0; i < anchors.length; i++) {
			zRender.clearResizeSingleAnchor(anchors[i], songDuration);
		}

	}
	drawKeys(zRender: ZRender, song: ZvoogSchedule
		, ratioDuration: number, ratioThickness: number
	) {
		for (let i = 0; i < 10; i++) {
			this.keysAnchor1.content.push(TText(0, (128 - i * 12 - 1) * ratioThickness, 'barNumber textSize4', '' + (i + 1)));
			
			this.keysAnchor1.content.push({ x: 0, y: (128 - i * 12 - 2) * ratioThickness, w: 4, h: ratioThickness, rx: 0.5, ry: 0.5, css: 'otherFill' });
			this.keysAnchor1.content.push({ x: 0, y: (128 - i * 12 - 4) * ratioThickness, w: 4, h: ratioThickness, rx: 0.5, ry: 0.5, css: 'otherFill' });
			this.keysAnchor1.content.push({ x: 0, y: (128 - i * 12 - 7) * ratioThickness, w: 4, h: ratioThickness, rx: 0.5, ry: 0.5, css: 'otherFill' });
			this.keysAnchor1.content.push({ x: 0, y: (128 - i * 12 - 9) * ratioThickness, w: 4, h: ratioThickness, rx: 0.5, ry: 0.5, css: 'otherFill' });
			this.keysAnchor1.content.push({ x: 0, y: (128 - i * 12 - 11) * ratioThickness, w: 4, h: ratioThickness, rx: 0.5, ry: 0.5, css: 'otherFill' });

			this.keysAnchor4.content.push(TText(0, (128 - i * 12 - 1) * ratioThickness, 'barNumber textSize16', '' + (i + 1)));

			this.keysAnchor4.content.push({ x: 0, y: (128 - i * 12 - 2) * ratioThickness, w: 4, h: ratioThickness, rx: 0.5, ry: 0.5, css: 'otherFill' });
			this.keysAnchor4.content.push({ x: 0, y: (128 - i * 12 - 4) * ratioThickness, w: 4, h: ratioThickness, rx: 0.5, ry: 0.5, css: 'otherFill' });
			this.keysAnchor4.content.push({ x: 0, y: (128 - i * 12 - 7) * ratioThickness, w: 4, h: ratioThickness, rx: 0.5, ry: 0.5, css: 'otherFill' });
			this.keysAnchor4.content.push({ x: 0, y: (128 - i * 12 - 9) * ratioThickness, w: 4, h: ratioThickness, rx: 0.5, ry: 0.5, css: 'otherFill' });
			this.keysAnchor4.content.push({ x: 0, y: (128 - i * 12 - 11) * ratioThickness, w: 4, h: ratioThickness, rx: 0.5, ry: 0.5, css: 'otherFill' });
		}
		zRender.tileLevel.autoID(this.keysLayer.anchors);
	}
}
