class FocusManagement {
	focusMarkerLayer: SVGElement;
	focusAnchor1: TileAnchor;
	focusAnchor4: TileAnchor;
	focusAnchor16: TileAnchor;
	focusAnchor64: TileAnchor;
	focusAnchor256: TileAnchor;
	focusLayer: TileLayerDefinition;
	levelOfDetails:number=0;
	attach(zRender: ZRender) {
		this.focusMarkerLayer = (document.getElementById('focusMarkerLayer') as any) as SVGElement;
		this.focusAnchor1 = TAnchor(0, 0, 1111, 1111, zRender.zoomMin, zRender.zoomNote);
		this.focusAnchor4 = TAnchor(0, 0, 1111, 1111, zRender.zoomNote, zRender.zoomMeasure);
		this.focusAnchor16 = TAnchor(0, 0, 1111, 1111, zRender.zoomMeasure, zRender.zoomSong);
		this.focusAnchor64 = TAnchor(0, 0, 1111, 1111, zRender.zoomSong, zRender.zoomFar);
		this.focusAnchor256 = TAnchor(0, 0, 1111, 1111, zRender.zoomFar, zRender.zoomMax + 1);
		this.focusLayer = {
			g: this.focusMarkerLayer, anchors: [
				this.focusAnchor1, this.focusAnchor4, this.focusAnchor16, this.focusAnchor64, this.focusAnchor256//, this.gridAnchor0
			]
		};
		zRender.layers.push(this.focusLayer);
	}
	addSpot() {

	}
	reSetFocus(zrenderer: ZRender, song: ZvoogSchedule) {
		zrenderer.tileLevel.resetAnchor(this.focusAnchor1, this.focusMarkerLayer);
		zrenderer.tileLevel.resetAnchor(this.focusAnchor4, this.focusMarkerLayer);
		zrenderer.tileLevel.resetAnchor(this.focusAnchor16, this.focusMarkerLayer);
		zrenderer.tileLevel.resetAnchor(this.focusAnchor64, this.focusMarkerLayer);
		zrenderer.tileLevel.resetAnchor(this.focusAnchor256, this.focusMarkerLayer);
		this.addSpot();
		zrenderer.tileLevel.allTilesOK = false;
	}
}
