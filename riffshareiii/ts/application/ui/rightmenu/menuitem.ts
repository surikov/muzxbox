class RightMenuItem {
    //anchor: TileAnchor;
    //label: TileText;
    //bg: TileRectangle;
    //subline:TileRectangle;

    label: string = '';
    //isbig: boolean = false;
    kind: 1 | 2 | 3 | 4 = 1;
    action: { (x: number, y: number): void };

    constructor() {
        //this.build();
    }
    initActionItem(label: string, tap: () => void) {
        this.kind = 1;
        this.label = label;
        this.action = tap;
        return this;
    }
    initDraggableItem() {
        this.kind = 2;

        return this;
    }
    initFolderItem() {
        this.kind = 3;
        return this;
    }
    initPreviewItem() {
        this.kind = 4;
        return this;
    }


    calculateHeight(): number {
        if (this.kind == 4) {
            return 2;
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




        let anchor: TileAnchor = { xx: 0, yy: itemTop, ww: 111, hh: 111, showZoom: zoomPrefixLevelsCSS[0].zoom, hideZoom: zoomPrefixLevelsCSS[10].zoom, content: [] };
        if (this.kind == 1) {
            let bg: TileRectangle = { x: 0.1, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'rightMenuItemActionBG' };
            anchor.content.push(bg);
            let delimiter: TileRectangle = { x: 0, y: itemTop + 1, w: itemWidth, h: 0.005, css: 'rightMenuDelimiterLine' };
            anchor.content.push(delimiter);
            let itemLabel: TileText = { x: 0.3, y: itemTop + 0.7, text: this.label, css: 'rightMenuLabel' };
            anchor.content.push(itemLabel);
            let spot: TileRectangle = { x: 0, y: itemTop, w: 1, h: 1, activation: this.action, css: 'transparentSpot' };
            anchor.content.push(spot);
        }
        if (this.kind == 2) {
            let bg: TileRectangle = { x: 0.1, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'rightMenuItemDragBG' };
            anchor.content.push(bg);
            let delimiter: TileRectangle = { x: 0, y: itemTop + 1, w: itemWidth, h: 0.005, css: 'rightMenuDelimiterLine' };
            anchor.content.push(delimiter);
            let itemLabel: TileText = { x: 0.3, y: itemTop + 0.7, text: this.label, css: 'rightMenuLabel' };
            anchor.content.push(itemLabel);
            let spot: TileRectangle = { x: 0, y: itemTop, w: 1, h: 1, activation: this.action, css: 'transparentDragger' };
            anchor.content.push(spot);
        }
        if (this.kind == 4) {
            let bg: TileRectangle = { x: 0.1, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'rightMenuItemDragBG' };
            anchor.content.push(bg);
            let delimiter: TileRectangle = { x: 0, y: itemTop + 2, w: itemWidth, h: 0.005, css: 'rightMenuDelimiterLine' };
            anchor.content.push(delimiter);
            let itemLabel: TileText = { x: 0.3, y: itemTop + 0.7, text: this.label, css: 'rightMenuLabel' };
            anchor.content.push(itemLabel);
            let spot: TileRectangle = { x: 0, y: itemTop, w: 1, h: 1, activation: this.action, css: 'transparentDragger' };
            anchor.content.push(spot);

			let bg2: TileRectangle = { x: itemWidth-1+0.1, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'rightMenuItemSubActionBG' };
            anchor.content.push(bg2);
			let itemLabel2: TileText = { x: itemWidth-0.5, y: itemTop + 0.55, text: '⏵', css: 'rightMenuButtonLabel' };
            anchor.content.push(itemLabel2);
			let spot2: TileRectangle = { x: itemWidth-1, y: itemTop, w: 1, h: 1, activation: this.action, css: 'transparentSpot' };
            anchor.content.push(spot2);
        }
        return anchor;
    }
}
