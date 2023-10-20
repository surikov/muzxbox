class RightMenuItem {
	//anchor: TileAnchor;
	//label: TileText;
	//bg: TileRectangle;
	//subline:TileRectangle;

	labelText: string = '';
	big: boolean = false;

	constructor() {
		//this.build();
	}


	calculateHeight(): number {
		if (this.big) {
			return 3;
		} else {
			return 1;
		}
	}
	buildTile(itemTop: number, itemWidth: number): TileItem {
		/*this.subline={x: 0, y: itemTop, w: itemWidth, h: 0.01, css: 'rightMenuDelimiterLine'};
		this.bg = { x: 0.1, y: itemTop+0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'toolBarButtonCircle' };
		this.label = {
			x: itemWidth/2, y: itemTop+0.5, text: this.labelText
			, css: 'toolBarButtonLabel'
		}*/
		//if(this.big)this.bg.h=2.95;
		return {
			xx: 0, yy: itemTop, ww: 111, hh: 111, showZoom: zoomPrefixLevelsCSS[0].zoom, hideZoom: zoomPrefixLevelsCSS[10].zoom, content: [
				{ x: 0.1, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'toolBarButtonCircle' }
				, { x: 0, y: itemTop, w: itemWidth, h: 0.01, css: 'rightMenuDelimiterLine' }
				, { x: itemWidth / 2, y: itemTop + 0.5, text: this.labelText, css: 'toolBarButtonLabel' }
			]
		};
		//return anchor;
	}
}
