class FocusManagement {
	focusMarkerLayer: SVGElement;
	focusAnchor1: TileAnchor;
	focusAnchor4: TileAnchor;
	focusAnchor16: TileAnchor;
	focusAnchor64: TileAnchor;
	focusAnchor256: TileAnchor;
	attach(zRender: ZRender) {
		this.focusMarkerLayer = (document.getElementById('focusMarkerLayer') as any) as SVGElement;
		this.focusAnchor1 = TAnchor(0, 0, 1111, 1111, zRender.zoomMin, zRender.zoomNote);
		this.focusAnchor4 = TAnchor(0, 0, 1111, 1111, zRender.zoomNote, zRender.zoomMeasure);
		this.focusAnchor16 = TAnchor(0, 0, 1111, 1111, zRender.zoomMeasure, zRender.zoomSong);
		this.focusAnchor64 = TAnchor(0, 0, 1111, 1111, zRender.zoomSong, zRender.zoomFar);
		this.focusAnchor256 = TAnchor(0, 0, 1111, 1111, zRender.zoomFar, zRender.zoomMax + 1);
	}
}
