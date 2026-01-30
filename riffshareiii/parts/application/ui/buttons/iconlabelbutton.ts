class IconLabelButton {
	anchor: TileAnchor;
	bg: TileRectangle;
	shadow: TileRectangle | null = null;
	spot: TileRectangle;
	label: TileText;
	left = 0;
	top = 0;
	labels: string[];
	action: (selection: number) => void;
	selection: number = 0;
	constructor(labels: string[], cssBG: string, cssLabel: string, action: (nn: number) => void) {
		this.labels = labels;
		this.action = action;
		this.bg = { x: 0, y: 0, w: 5, h: 5, rx: 0.4, ry: 0.4, css: cssBG };
		this.shadow = {
			x: 0, y: 0, w: 5, h: 5
			, rx: 0.5, ry: 0.5
			, css: 'fillShadow'
		};
		this.spot = {
			x: 0, y: 0, w: 1, h: 1, css: 'transparentSpot', activation: (x: number, y: number) => {
				this.selection++;
				if (this.selection > this.labels.length - 1) {
					this.selection = 0;
				}
				this.label.text = this.labels[this.selection];
				this.action(this.selection);
			}
		};
		this.label = { x: 0, y: 0, text: this.labels[this.selection], css: cssLabel }
		this.anchor = {
			xx: 0, yy: 0, ww: 111, hh: 111
			, minZoom: zoomPrefixLevelsCSS[0].minZoom
			, beforeZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom
			, content: [
				//this.bg
				//, this.label
				//, this.spot
			]
		};
		if (this.shadow) {
			this.anchor.content.push(this.shadow);
		}
		this.anchor.content.push(this.bg);
		this.anchor.content.push(this.label);
		this.anchor.content.push(this.spot);
	}
	resize(left: number, top: number, size: number) {
		//console.log('resize button',this.label.text);
		let pad = 0.1;
		let sh = 0.1;
		this.bg.x = left + pad;
		this.bg.y = top + pad;
		this.bg.w = size - 2 * pad;
		this.bg.h = size - 2 * pad;
		this.bg.rx = 0.5 * (size - 2 * pad);
		this.bg.ry = 0.5 * (size - 2 * pad);
		this.label.x = left + 0.5 * size;
		this.label.y = top + 0.69 * size;// * localeFontRatio;//*globalCommandDispatcher.tapSizeRatio;
		this.spot.x = left;
		this.spot.y = top;
		this.spot.w = size;
		this.spot.h = size;
		if (this.shadow) {
			this.shadow.x = left + pad - sh;
			this.shadow.y = top + pad - sh;
			this.shadow.w = size - 2 * (pad - sh);
			this.shadow.h = size - 2 * (pad - sh);
			this.shadow.rx = 0.5 * (size - 2 * (pad - sh));
			this.shadow.ry = 0.5 * (size - 2 * (pad - sh));
		}
	}
}

