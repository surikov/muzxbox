class RightMenuItem {
	//anchor: TileAnchor;
	//label: TileText;
	//bg: TileRectangle;
	//subline:TileRectangle;

	//label: string = '';
	//isbig: boolean = false;
	kindAction: 1 = 1;
	kindDraggable: 2 = 2;
	kindPreview: 3 = 3;
	kindClosedFolder: 4 = 4;
	kindOpenedFolder: 5 = 5;
	kindAction2: 6 = 6;
	kindActionDisabled: 7 = 7;
	kind: 1 | 2 | 3 | 4 | 5 | 6 | 7 = this.kindAction;
	action?: { (): void };
	action2?: { (): void };
	pad: number = 0;
	//focused: boolean = false;
	//scroll:number=0;
	top: number;
	info: MenuInfo;

	constructor(info: MenuInfo, pad: number, tap?: () => void, tap2?: () => void) {
		this.info = info;
		this.pad = pad;
		this.action = tap;
		this.action2 = tap2;
		if (this.info.sid) {
			//
		} else {
			this.info.sid = 'random' + Math.random();
		}
	}
	initDisabledItem(): RightMenuItem {
		this.kind = this.kindActionDisabled;
		return this;
	}
	initActionItem(/*pad: number, focused: boolean, label: string, tap: () => void*/): RightMenuItem {
		//this.pad = pad;
		//this.focused = focused;
		this.kind = this.kindAction;
		//this.label = label;
		//this.action = tap;
		return this;
	}
	initActionItem2(): RightMenuItem {//pad: number, focused: boolean, label: string, tap: () => void, tap2: () => void) {
		//this.pad = pad;
		//this.focused = focused;
		this.kind = this.kindAction2;
		//this.label = label;
		//this.action = tap;
		//this.action2 = tap2;
		return this;
	}
	initDraggableItem(/*pad: number, focused: boolean, tap: () => void*/): RightMenuItem {
		this.kind = this.kindDraggable;
		//this.focused = focused;
		//this.pad = pad;
		//this.action = tap;
		return this;
	}
	initOpenedFolderItem(/*pad: number, focused: boolean, label: string, tap: () => void*/): RightMenuItem {
		//this.pad = pad;
		//this.label = label;
		//this.focused = focused;
		this.kind = this.kindOpenedFolder;
		//this.action = tap;
		return this;
	}
	initClosedFolderItem(/*pad: number, focused: boolean, label: string, tap: () => void*/): RightMenuItem {
		//this.pad = pad;
		//this.label = label;
		//this.focused = focused;
		this.kind = this.kindClosedFolder;
		//this.action = tap;
		return this;
	}
	initPreviewItem(/*pad: number, focused: boolean, tap: () => void*/): RightMenuItem {
		//this.focused = focused;
		//this.pad = pad;
		this.kind = this.kindPreview;
		//this.action = tap;
		return this;
	}


	calculateHeight(): number {
		if (this.kind == this.kindPreview) {
			return 2;
		} else {
			return 1;
		}
	}
	buildTile(itemTop: number, itemWidth: number): TileItem {
		let label: string = '?';
		if (this.info.noLocalization) {
			label = this.info.text;
		} else {
			label = LO(this.info.text);
		}
		this.top = itemTop;
		let anchor: TileAnchor = {
			xx: 0, yy: itemTop, ww: 111, hh: 111
			, showZoom: zoomPrefixLevelsCSS[0].minZoom
			, hideZoom: zoomPrefixLevelsCSS[zoomPrefixLevelsCSS.length - 1].minZoom
			, content: []
		};
		if (this.info.focused) {
			anchor.content.push({ x: itemWidth - 0.2, y: itemTop + 0.02, w: 0.2, h: this.calculateHeight() - 0.02, css: 'rightMenuFocusedDelimiter' });
		}
		anchor.content.push({ x: 0, y: itemTop + this.calculateHeight(), w: itemWidth, h: 0.02, css: 'rightMenuDelimiterLine' });
		let spot: TileRectangle = { x: this.pad, y: itemTop, w: 1, h: 1, activation: this.action, css: 'transparentSpot' };
		let spot2: TileRectangle | null = null;
		if (this.kind == this.kindAction) {
			anchor.content.push({ x: 0.1 + this.pad, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'rightMenuItemActionBG' });
			anchor.content.push({ x: 0.3 + this.pad, y: itemTop + 0.7, text: label, css: 'rightMenuLabel' });
		}
		if (this.kind == this.kindActionDisabled) {
			anchor.content.push({ x: 0.1 + this.pad, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'rightMenuItemDisabledBG' });
			anchor.content.push({ x: 0.3 + this.pad, y: itemTop + 0.7, text: label, css: 'rightMenuLabel' });
		}
		if (this.kind == this.kindAction2) {
			let stateIicon = '?';
			let sel = this.info.selection ? this.info.selection : 0;
			if (this.info.itemStates) {
				if (this.info.itemStates.length > sel) {
					stateIicon = this.info.itemStates[sel];
				}
			}
			anchor.content.push({ x: 0.1 + this.pad, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'rightMenuItemActionBG' });
			anchor.content.push({ x: 0.3 + this.pad, y: itemTop + 0.7, text: label, css: 'rightMenuLabel' });
			anchor.content.push({ x: itemWidth - 1.1, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'rightMenuItemActionBG' });
			anchor.content.push({ x: itemWidth - 1.1 + 0.4, y: itemTop + 0.7, text: stateIicon, css: 'rightMenuIconLabel' });
			spot2 = { x: itemWidth - 1.2, y: itemTop, w: 1, h: 1, activation: this.action2, css: 'transparentSpot' };
		}
		if (this.kind == this.kindDraggable) {
			spot.draggable = true;
			anchor.content.push({ x: 0.1 + this.pad, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'rightMenuItemDragBG' });
			anchor.content.push({ x: 0.3 + this.pad, y: itemTop + 0.7, text: label, css: 'rightMenuLabel' });
		}
		if (this.kind == this.kindOpenedFolder) {
			anchor.content.push({ x: 0.1 + this.pad, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'rightMenuItemActionBG' });
			anchor.content.push({ x: 0.5 + this.pad, y: itemTop + 0.7, text: icon_movedown, css: 'rightMenuIconLabel' });
			anchor.content.push({ x: 1 + this.pad, y: itemTop + 0.7, text: label, css: 'rightMenuLabel' });
		}
		if (this.kind == this.kindClosedFolder) {
			anchor.content.push({ x: 0.1 + this.pad, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'rightMenuItemActionBG' });
			anchor.content.push({ x: 0.5 + this.pad, y: itemTop + 0.7, text: icon_moveright, css: 'rightMenuIconLabel' });
			anchor.content.push({ x: 1 + this.pad, y: itemTop + 0.7, text: label, css: 'rightMenuLabel' });
		}
		if (this.kind == this.kindPreview) {
			spot.draggable = true;
			anchor.content.push({ x: 0.1 + this.pad, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'rightMenuItemDragBG' });
			anchor.content.push({ x: 0.3 + this.pad, y: itemTop + 0.7, text: label, css: 'rightMenuLabel' });
			anchor.content.push({ x: itemWidth - 1 + 0.1, y: itemTop + 0.1, w: 0.8, h: 0.8, rx: 0.4, ry: 0.4, css: 'rightMenuItemSubActionBG' });
			anchor.content.push({ x: itemWidth - 0.5, y: itemTop + 0.7, text: icon_play, css: 'rightMenuButtonLabel' });
			anchor.content.push({ x: itemWidth - 1, y: itemTop, w: 1, h: 1, activation: this.action, css: 'transparentSpot' });
			anchor.content.push({ x: 0.3 + 1 + this.pad, y: itemTop + 0.7 + 0.55, text: label, css: 'rightMenuSubLabel' });
			anchor.content.push({ x: 0.3 + 1 + this.pad, y: itemTop + 0.7 + 0.55 + 0.55, text: label, css: 'rightMenuSubLabel' });
		}
		anchor.content.push(spot);
		if (spot2) {
			anchor.content.push(spot2);
		}
		return anchor;
	}
}
