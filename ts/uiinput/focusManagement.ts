class FocusManagement {
	focusMarkerLayer: SVGElement;
	focusAnchor: TileAnchor;
	focusLayer: TileLayerDefinition;
	levelOfDetails: number = 0;
	attach(zRender: ZRender) {
		this.focusMarkerLayer = (document.getElementById('focusMarkerLayer') as any) as SVGElement;
		this.focusAnchor = TAnchor(0, 0, 1111, 1111, zRender.zoomMin, zRender.zoomMax + 1);
		this.focusLayer = {
			g: this.focusMarkerLayer, anchors: [
				this.focusAnchor
			]
		};
		zRender.layers.push(this.focusLayer);
	}
	addSpot() {

	}
	reSetFocus(zrenderer: ZRender, song: ZvoogSchedule) {
		zrenderer.tileLevel.resetAnchor(this.focusAnchor, this.focusMarkerLayer);
		this.addSpot();
		zrenderer.tileLevel.allTilesOK = false;
	}
	spotUp() {
		console.log('spotUp');
	}
	spotDown() {
		console.log('spotDown');
	}
	spotLeft() {
		console.log('spotLeft');
	}
	spotRight() {
		console.log('spotRight');
	}
	spotReset() {
		console.log('spotReset');
	}
	spotSelectA() {
		console.log('spotSelectA');
	}
	
}
