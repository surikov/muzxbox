class MenuItem{
	anchor: TileAnchor;
	label: TileText;
	bg: TileRectangle;
	constructor(){
        this.build();
	}
	build(){
		this.bg = { x: 0, y: 0, w: 5, h: 5, rx: 0.4, ry: 0.4, css: 'toolBarButtonCircle' };
		this.label = {
            x: 0, y: 0, text: 'svavpkavm iwv awv rawv'
            , css: 'toolBarButtonLabel'
        }
        this.anchor = {
            xx: 0, yy: 0, ww: 111, hh: 111, showZoom: zoomPrefixLevelsCSS[0].zoom, hideZoom: zoomPrefixLevelsCSS[10].zoom, content: [
                this.bg
                , this.label
            ]
        };
	}
}
